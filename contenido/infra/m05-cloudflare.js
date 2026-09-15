/* ==========================================================================
   Infra · Módulo 05 — Cloudflare y el edge
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'infra',
  id: 'm05',
  titulo: 'Cloudflare y el edge',
  fuentes: ['cloudflare-workers', 'cloudflare-r2', 'cloudflare-dns', 'web-dev-cache', 'mdn-http'],

  intro:
    '<p>Cloudflare empezó como un CDN y hoy es una plataforma completa. Para vos importa por dos motivos muy ' +
    'concretos: es donde está <b>el mayor ahorro de egreso disponible</b>, y es la puerta de entrada más barata ' +
    'para protegerte de abuso.</p>' +
    '<p>Este módulo va sobre qué hace cada pieza, cuál conviene adoptar primero, y —importante— dónde <b>no</b> ' +
    'reemplaza a lo que ya tenés.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'CDN y caché: cómo funciona de verdad',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un CDN es una red de heladeras repartidas por el
mundo. En vez de que todos vayan al depósito central, cada uno saca de la heladera más cercana.</div>

<h4>Qué pasa cuando alguien entra a tu sitio</h4>
<ol>
<li>El DNS lo manda al punto de Cloudflare <b>más cercano</b>.</li>
<li>Ese punto revisa si tiene el archivo en caché.</li>
<li><b>Si lo tiene</b> → lo devuelve al instante. Tu servidor ni se entera.</li>
<li><b>Si no lo tiene</b> → se lo pide a tu servidor, lo guarda, y lo devuelve.</li>
</ol>

<p>De ahí salen los dos beneficios: <b>velocidad</b> —porque el contenido viaja menos— y <b>ahorro</b>, porque
tu servidor deja de servir la mayoría del tráfico.</p>

<h4>Los dos números que hay que mirar</h4>
<p><b>Tasa de aciertos</b> — qué proporción de peticiones se sirvió desde caché. Con 90% o más, tu origen
recibe una décima parte del tráfico.</p>
<p><b>Egreso desde el origen</b> — lo que efectivamente sale de tu servidor. Es lo que pagás.</p>

<div class="aviso"><strong>Lo que sorprende:</strong> un CDN mal configurado puede tener una tasa de aciertos
del <b>10%</b>, y ahí estás pagando el CDN <b>y</b> el egreso completo. Y no da ningún error: el sitio funciona
perfecto, solo que cada petición va al origen igual.<br><br>
<b>Poner un CDN no es el trabajo. El trabajo es que efectivamente cachee.</b></div>

<h4>Las tres cosas que rompen la caché</h4>

<p><b>1 · Falta la cabecera.</b> Sin <code>Cache-Control</code>, muchos CDN ante la duda no cachean.</p>

<p><b>2 · Hay una cookie en la respuesta.</b> Si tu servidor manda <code>Set-Cookie</code> junto con una imagen,
el CDN la considera personalizada y no la guarda. Es la causa más común y la menos evidente.</p>

<p><b>3 · La URL tiene parámetros variables.</b> Cada variante es una entrada distinta en la caché. Si tus URLs
llevan un identificador de sesión o una marca de tiempo, <b>ninguna se reutiliza jamás</b>.</p>
`,

      tecnico: `
<h4>Qué se cachea por defecto y qué no</h4>
<p>Un punto que confunde a mucha gente: por defecto, Cloudflare cachea <b>solo por extensión de archivo</b> —
imágenes, CSS, JavaScript, fuentes—. <b>El HTML y las respuestas de API no se cachean</b> salvo que lo pidas
explícitamente con una regla.</p>
<p>Eso es un default razonable —el HTML suele ser dinámico— pero significa que "puse Cloudflare" no equivale a
"mi API está cacheada".</p>

<h4>Las cabeceras que deciden</h4>
<pre><code># Assets con hash en el nombre → un año, sin revalidar
Cache-Control: public, max-age=31536000, immutable

# HTML → el navegador revalida, el CDN puede cachear un rato
Cache-Control: public, max-age=0, s-maxage=60, must-revalidate

# API semi-estática → el CDN absorbe casi todo
Cache-Control: public, s-maxage=300, stale-while-revalidate=3600

# Datos de un usuario → NUNCA en caché compartida
Cache-Control: private, no-store</code></pre>

<div class="dato"><strong>La distinción entre <code>max-age</code> y <code>s-maxage</code> es la que más se
ignora.</strong> <code>max-age</code> aplica a la caché del <b>navegador</b>; <code>s-maxage</code> aplica a las
cachés <b>compartidas</b>, como el CDN. Poder darles valores distintos es lo que permite decirle al navegador
"revalidá siempre" y al CDN "guardalo cinco minutos" — que es exactamente lo que querés para contenido
semi-dinámico.</div>

<h4>Purga e invalidación</h4>
<p>Cuando publicás una versión nueva, la caché vieja sigue ahí. Las opciones:</p>
<ul>
<li><b>Nombres con hash</b> (<code>app.a3f2.js</code>) — la mejor: la URL cambia, así que no hay nada que invalidar. Por eso se pueden cachear un año.</li>
<li><b>Purga selectiva</b> por URL — precisa, pero hay que saber qué purgar.</li>
<li><b>Purga total</b> — simple y brutal: tu origen recibe un pico de tráfico mientras la caché se vuelve a llenar.</li>
<li><b>Etiquetas de caché</b> — marcar respuestas con etiquetas y purgar por etiqueta. Muy útil para contenido relacionado.</li>
</ul>

<h4>Detectar si está cacheando</h4>
<pre><code>curl -I https://tusitio.com/assets/app.js | grep -i "cf-cache-status\\|cache-control\\|age"

# cf-cache-status: HIT     ✓ vino de caché
# cf-cache-status: MISS    → fue al origen (normal la primera vez)
# cf-cache-status: BYPASS  ⚠ algo lo está impidiendo: cookie, cabecera, o regla
# cf-cache-status: DYNAMIC ⚠ no se considera cacheable por defecto</code></pre>

<div class="dato"><strong><code>BYPASS</code> y <code>DYNAMIC</code> sostenidos son la señal de que tu CDN no
está haciendo nada.</strong> <code>BYPASS</code> suele ser una cookie en la respuesta o
<code>Cache-Control: private</code>; <code>DYNAMIC</code> significa que el tipo de contenido no entra en las
reglas por defecto y hay que agregar una. Verificar esa cabecera es lo primero después de poner un CDN, ' +
y casi nadie lo hace.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="cd1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CON BUENA TASA DE ACIERTOS</text>

  <circle cx="60" cy="66" r="12" fill="#22d3ee" fill-opacity=".6"/>
  <text x="60" y="92" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">usuario</text>
  <line x1="76" y1="66" x2="126" y2="66" stroke="#34d399" stroke-width="2.4" marker-end="url(#cd1)" color="#34d399"/>
  <text x="101" y="58" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">2 ms</text>

  <rect x="130" y="46" width="120" height="40" rx="8" fill="#fbbf24" fill-opacity=".28" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="190" y="63" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">CDN cercano</text>
  <text x="190" y="78" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">HIT · 92%</text>

  <line x1="254" y1="66" x2="470" y2="66" stroke="#f87171" stroke-width="1" stroke-dasharray="4 4" opacity=".45"/>
  <text x="362" y="58" text-anchor="middle" fill="currentColor" opacity=".45" font-size="9">solo el 8% llega acá</text>

  <rect x="474" y="46" width="120" height="40" rx="8" fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-opacity=".3" stroke-width="1.2"/>
  <text x="534" y="70" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10.5" font-weight="700">tu origen</text>

  <text x="24" y="112" fill="#34d399" font-size="11" font-weight="700">
    rápido para el usuario · tu servidor sirve la décima parte · ~34 USD/mes</text>

  <line x1="24" y1="132" x2="656" y2="132" stroke="currentColor" opacity=".18"/>

  <text x="24" y="156" fill="#f87171" font-size="11.5" font-weight="700">
    CON CDN MAL CONFIGURADO — y no da ningún error</text>

  <circle cx="60" cy="196" r="12" fill="#22d3ee" fill-opacity=".6"/>
  <line x1="76" y1="196" x2="126" y2="196" stroke="currentColor" stroke-width="1.6" opacity=".4" marker-end="url(#cd1)"/>

  <rect x="130" y="176" width="120" height="40" rx="8" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.4"/>
  <text x="190" y="193" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">CDN</text>
  <text x="190" y="208" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">BYPASS · 10%</text>

  <line x1="254" y1="196" x2="470" y2="196" stroke="#f87171" stroke-width="2.6" marker-end="url(#cd1)" color="#f87171"/>
  <text x="362" y="188" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">el 90% va igual al origen</text>

  <rect x="474" y="176" width="120" height="40" rx="8" fill="#f87171" fill-opacity=".16" stroke="#f87171" stroke-width="1.3"/>
  <text x="534" y="200" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">tu origen</text>

  <text x="24" y="242" fill="#f87171" font-size="11" font-weight="700">
    pagás el CDN Y el egreso completo · el sitio funciona perfecto · nadie lo nota</text>

  <line x1="24" y1="262" x2="656" y2="262" stroke="currentColor" opacity=".18"/>

  <text x="24" y="286" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS TRES COSAS QUE ROMPEN LA CACHÉ</text>

  <rect x="24" y="298" width="200" height="54" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="124" y="318" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">1 · falta Cache-Control</text>
  <text x="124" y="336" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">ante la duda, no cachea</text>

  <rect x="240" y="298" width="200" height="54" rx="9" fill="#f87171" fill-opacity=".18" stroke="#f87171" stroke-width="1.6"/>
  <text x="340" y="318" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">2 · Set-Cookie en la respuesta</text>
  <text x="340" y="336" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">la más común y la menos evidente</text>

  <rect x="456" y="298" width="200" height="54" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="556" y="318" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">3 · URLs con parámetros</text>
  <text x="556" y="336" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">cada variante es otra entrada</text>

  <rect x="24" y="362" width="632" height="26" rx="7" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="340" y="380" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">
    curl -I tusitio.com | grep cf-cache-status   →   HIT es lo que querés ver</text>
</svg>`,
        pie: 'Poner un CDN no es el trabajo. El trabajo es verificar que efectivamente cachee.',
      },

      entrevista: [
        { p: '¿Cómo verificás que tu CDN está funcionando?',
          r: 'Mirando la cabecera <code>cf-cache-status</code> con un <code>curl -I</code>. <b>HIT</b> es lo que querés; ' +
             '<b>MISS</b> es normal la primera vez; <b>BYPASS</b> significa que algo lo está impidiendo —típicamente una cookie en la respuesta o ' +
             '<code>Cache-Control: private</code>—; y <b>DYNAMIC</b> significa que ese tipo de contenido no entra en las reglas por defecto. ' +
             'Es lo primero que hay que hacer después de poner un CDN, y casi nadie lo hace: <b>un CDN con 10% de aciertos no da ningún error, ' +
             'simplemente estás pagando el CDN y el egreso completo</b>.' },

        { p: '¿Cuál es la diferencia entre max-age y s-maxage?',
          r: '<code>max-age</code> aplica a la caché del <b>navegador</b>; <code>s-maxage</code> a las cachés <b>compartidas</b>, como un CDN. ' +
             'Poder darles valores distintos es lo que permite decirle al navegador "revalidá siempre" y al CDN "guardalo cinco minutos", ' +
             'que es exactamente lo que se necesita para contenido semi-dinámico. Es la distinción que más se ignora, y sin ella terminás ' +
             'o sin caché o sirviendo contenido viejo al usuario.' },

        { p: '¿Qué es lo que más rompe la tasa de aciertos de un CDN?',
          r: 'Tres cosas, en orden de frecuencia. <b>Una cookie en la respuesta</b>: si el servidor manda <code>Set-Cookie</code> junto con una ' +
             'imagen, el CDN la considera personalizada y no la guarda — es la causa más común y la menos evidente. <b>La ausencia de ' +
             '<code>Cache-Control</code></b>, porque ante la duda muchos CDN no cachean. Y <b>URLs con parámetros variables</b>: si llevan un ' +
             'identificador de sesión o una marca de tiempo, cada petición es una entrada distinta y ninguna se reutiliza.' },

        { p: '¿Cómo invalidás la caché al desplegar una versión nueva?',
          r: 'La mejor forma es <b>no tener que invalidarla</b>: assets con hash en el nombre, como <code>app.a3f2.js</code>. Si el contenido cambia, ' +
             'cambia la URL, así que la vieja simplemente deja de pedirse — y por eso se pueden cachear un año con <code>immutable</code>. ' +
             'Cuando hace falta invalidar, prefiero <b>purga selectiva</b> por URL o por etiqueta antes que purga total, porque vaciar toda la caché ' +
             'genera un pico de tráfico contra el origen mientras se vuelve a llenar.' },
      ],

      practica: `
<h4>Diagnóstico en tres comandos</h4>
<pre><code># 1 · ¿Está cacheando?
curl -sI https://tusitio.com/assets/app.js | grep -i "cf-cache-status\\|cache-control\\|age"

# 2 · ¿Y el HTML?  (por defecto NO se cachea)
curl -sI https://tusitio.com/ | grep -i "cf-cache-status\\|cache-control"

# 3 · ¿Hay una cookie rompiendo la caché de un asset?
curl -sI https://tusitio.com/assets/app.js | grep -i "set-cookie"
#    ← si aparece algo acá, ahí está el problema</code></pre>

<div class="aviso"><strong>El comando 3 es el que más veces encuentra el problema.</strong> Muchos frameworks
mandan una cookie de sesión en <i>toda</i> respuesta si no se los limita, incluidas las de archivos estáticos.
El resultado es un CDN que no cachea nada y una factura de egreso intacta.</div>

<h4>Cabeceras por tipo de contenido</h4>
<pre><code>// next.config.js
async headers() {
  return [
    {
      source: '/:all*(svg|jpg|png|webp|woff2)',
      headers: [{ key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/api/publico/:path*',
      headers: [{ key: 'Cache-Control',
                  value: 'public, s-maxage=300, stale-while-revalidate=3600' }],
    },
    {
      source: '/api/privado/:path*',
      headers: [{ key: 'Cache-Control', value: 'private, no-store' }],
    },
  ];
}</code></pre>

<div class="dato"><strong>Esa última regla no es opcional.</strong> Si una respuesta con datos de un usuario se
cachea en una caché compartida sin <code>private</code>, <b>el siguiente usuario recibe los datos del
anterior</b>. Es una de las filtraciones más graves y más silenciosas que existen: no genera ningún error.</div>

<h4>Orden para subir la tasa de aciertos</h4>
<table>
<tr><th>#</th><th>Acción</th><th>Impacto</th></tr>
<tr><td>1</td><td>Sacar <code>Set-Cookie</code> de las respuestas de assets</td><td>Muy alto</td></tr>
<tr><td>2</td><td>Poner <code>Cache-Control</code> explícito por tipo</td><td>Muy alto</td></tr>
<tr><td>3</td><td>Nombres con hash en los assets</td><td>Alto: permite cachear un año</td></tr>
<tr><td>4</td><td>Regla de caché para el HTML con <code>s-maxage</code></td><td>Alto si el HTML es estable</td></tr>
<tr><td>5</td><td><code>stale-while-revalidate</code> en APIs públicas</td><td>Alto: el usuario nunca espera</td></tr>
<tr><td>6</td><td>Limpiar parámetros innecesarios de las URLs</td><td>Medio</td></tr>
</table>
`,

      errores: [
        { mito: 'Puse un CDN, así que el egreso bajó.',
          realidad: 'Solo si <b>efectivamente cachea</b>. Un CDN con 10% de aciertos te hace pagar el CDN <b>y</b> el egreso completo, ' +
                    'sin generar ningún error: el sitio funciona perfecto. Verificá <code>cf-cache-status</code> antes de dar nada por hecho.' },

        { mito: 'Cloudflare cachea todo por defecto.',
          realidad: 'Por defecto cachea <b>solo por extensión de archivo</b> —imágenes, CSS, JS, fuentes—. El <b>HTML y las respuestas de API ' +
                    'no se cachean</b> salvo que agregues una regla. "Puse Cloudflare" no equivale a "mi API está cacheada".' },

        { mito: 'Las cookies no afectan al CDN.',
          realidad: 'Son la causa <b>más común</b> de que no cachee. Un <code>Set-Cookie</code> en la respuesta de un asset hace que el CDN la ' +
                    'considere personalizada. Y muchos frameworks mandan la cookie de sesión en toda respuesta si no se los limita.' },

        { mito: 'Uso la misma cabecera de caché para todo.',
          realidad: 'Los datos de un usuario necesitan <code>private, no-store</code>. Si se cachean en una caché compartida, ' +
                    '<b>el siguiente usuario recibe los datos del anterior</b> — una filtración grave que no genera ningún error.' },
      ],

      glosario: [
        { t: 'CDN', d: 'Red de servidores que cachea y sirve contenido desde un punto cercano al usuario.' },
        { t: 'Tasa de aciertos', d: 'Proporción de peticiones servidas desde caché sin ir al origen.' },
        { t: 'Origen', d: 'Tu servidor real, al que el CDN consulta cuando no tiene el contenido.' },
        { t: 'cf-cache-status', d: 'Cabecera de Cloudflare que indica si la respuesta vino de caché: HIT, MISS, BYPASS, DYNAMIC.' },
        { t: 'max-age', d: 'Segundos que el navegador puede cachear la respuesta.' },
        { t: 's-maxage', d: 'Segundos que una caché compartida —el CDN— puede cachearla. Puede diferir de max-age.' },
        { t: 'immutable', d: 'Indica que el contenido nunca cambia. Se usa con nombres que llevan hash.' },
        { t: 'Purga', d: 'Invalidar contenido cacheado. Puede ser selectiva, por etiqueta o total.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'R2: almacenamiento sin cargo de egreso',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> R2 es almacenamiento de archivos con <b>la misma
API que S3</b> y <b>sin cobrar egreso</b>. Para todo lo que sirvas al público, es la diferencia más grande
disponible en una factura de nube.</div>

<h4>Por qué importa tanto</h4>
<p>Ya lo viste en el módulo de costos: el egreso es el ítem más caro por unidad. Con archivos pesados —
imágenes, PDF, video— esa línea crece rápido:</p>
<table>
<tr><th>Salida mensual</th><th>Nube tradicional</th><th>R2</th></tr>
<tr><td>500 GB</td><td>~45 USD</td><td><b>0</b></td></tr>
<tr><td>2 TB</td><td>~180 USD</td><td><b>0</b></td></tr>
<tr><td>10 TB</td><td>~900 USD</td><td><b>0</b></td></tr>
</table>
<p>El almacenamiento sí se paga —unos centavos por GB al mes— pero es la parte barata.</p>

<h4>Que use la API de S3 cambia todo</h4>
<p>No hay que aprender nada nuevo ni reescribir la aplicación. Si tu código ya usa el SDK de S3, migrar es
<b>cambiar la configuración del cliente</b>:</p>
<pre><code>const s3 = new S3Client({
  region: 'auto',
  endpoint: 'https://CUENTA.r2.cloudflarestorage.com',   // ← lo único que cambia
  credentials: { accessKeyId: R2_KEY, secretAccessKey: R2_SECRET },
});
// subir, descargar y firmar URLs: exactamente igual</code></pre>

<div class="aviso"><strong>Por eso es la optimización con mejor relación beneficio/esfuerzo</strong> si tu costo
está en archivos servidos al público. No es una migración de plataforma: es cambiar el destino de una pieza,
sin tocar auth, base de datos ni lógica de negocio. <b>Una tarde de trabajo contra semanas.</b></div>

<h4>Dónde sí se paga</h4>
<p>"Gratis" siempre significa "gratis en un eje". En R2 se cobran las <b>operaciones</b>, y las de escritura son
bastante más caras que las de lectura.</p>
<ul>
<li><b>Escribir muy poco y leer mucho</b> —el caso de archivos servidos al público— sale muy bien.</li>
<li><b>Escritura intensiva</b> —logs, eventos, muchos archivos chicos por segundo— hay que hacer la cuenta.</li>
</ul>
`,

      tecnico: `
<h4>Comparación con S3</h4>
<table>
<tr><th></th><th>S3</th><th>R2</th></tr>
<tr><td>API</td><td>S3</td><td><b>Compatible con S3</b></td></tr>
<tr><td>Egreso a internet</td><td>~0,09 USD/GB</td><td><b>0</b></td></tr>
<tr><td>Almacenamiento</td><td>~0,023 USD/GB/mes</td><td>Similar</td></tr>
<tr><td>Operaciones de escritura</td><td>Baratas</td><td>Más caras relativamente</td></tr>
<tr><td>Regiones</td><td>Elegís una</td><td>Automático, con ubicación opcional</td></tr>
<tr><td>Integración con CDN</td><td>CloudFront, aparte</td><td>Nativa</td></tr>
<tr><td>Ecosistema</td><td>Enorme</td><td>Más chico, pero la API es la misma</td></tr>
</table>

<div class="dato"><strong>Qué hay que verificar antes de migrar:</strong> R2 implementa la <b>mayor parte</b>
de la API de S3, no toda. Las funciones más avanzadas —algunas formas de replicación, ciertos eventos,
políticas complejas— pueden no estar. Para el uso habitual —subir, descargar, listar, URLs firmadas, subida
multiparte— funciona idéntico. <b>Revisá la lista de compatibilidad si usás algo fuera de lo común.</b></div>

<h4>Servir archivos públicos, bien</h4>
<p>Hay dos formas y la diferencia importa:</p>
<ul>
<li><b>Dominio propio conectado al bucket.</b> Los archivos se sirven por tu dominio, con la caché del CDN delante. <b>Es lo que querés</b> para contenido público: rápido y sin egreso.</li>
<li><b>URLs firmadas con vencimiento.</b> Para contenido privado. Cada URL es única, así que <b>no se cachea</b> — y eso está bien, porque no debería.</li>
</ul>

<h4>Contenido privado, sin romper el aislamiento</h4>
<p>El patrón correcto es el mismo que ya usás con Supabase Storage:</p>
<ol>
<li>El cliente pide un archivo a <b>tu servidor</b>, no al bucket.</li>
<li>El servidor verifica sesión y <b>tenant</b>.</li>
<li>Genera una <b>URL firmada de vida corta</b> —60 segundos o menos—.</li>
<li>El cliente descarga directo del bucket con esa URL.</li>
</ol>
<p>Así el archivo nunca pasa por tu servidor —no pagás ancho de banda ni ocupás un proceso— y la autorización
sigue siendo tuya.</p>

<div class="dato"><strong>Y el detalle de multi-tenant que no cambia:</strong> el <code>tenant_id</code> del
path lo pone <b>el servidor</b>, nunca el cliente. La convención del workspace —<code>&lt;tenant_id&gt;/&lt;resto&gt;</code>—
aplica igual en R2 que en Supabase Storage. Si el cliente puede influir en el path, no hay aislamiento.</div>

<h4>Ciclo de vida: el costo silencioso</h4>
<p>Sin una regla de expiración, un bucket <b>crece para siempre</b> — sobre todo si tiene versionado activo, que
conserva cada versión anterior de cada archivo. Conviene definir desde el principio:</p>
<ul>
<li>Expiración de subidas multiparte incompletas (se acumulan y nadie las ve).</li>
<li>Expiración de versiones antiguas, si hay versionado.</li>
<li>Borrado de temporales y previsualizaciones pasado cierto tiempo.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="r2a" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA MISMA API, OTRA FACTURA</text>

  <rect x="24" y="34" width="304" height="94" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="176" y="56" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">S3 y similares</text>
  <text x="44" y="80" fill="currentColor" opacity=".72" font-size="11">2 TB de salida al mes</text>
  <rect x="44" y="88" width="264" height="18" rx="4" fill="#f87171" fill-opacity=".65"/>
  <text x="176" y="101" text-anchor="middle" fill="#3b0a0a" font-size="10" font-weight="700">egreso ~0,09 USD/GB</text>
  <text x="176" y="122" text-anchor="middle" fill="#f87171" font-size="14" font-weight="700">~180 USD/mes</text>

  <rect x="352" y="34" width="304" height="94" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="56" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">Cloudflare R2</text>
  <text x="372" y="80" fill="currentColor" opacity=".72" font-size="11">2 TB de salida al mes</text>
  <rect x="372" y="88" width="264" height="18" rx="4" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-opacity=".5" stroke-dasharray="4 3"/>
  <text x="504" y="101" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">egreso: 0</text>
  <text x="504" y="122" text-anchor="middle" fill="#34d399" font-size="14" font-weight="700">solo almacenamiento</text>

  <rect x="24" y="140" width="632" height="34" rx="8" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="340" y="161" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">
    Migrar = cambiar el endpoint del cliente S3. El resto del código queda igual.</text>

  <line x1="24" y1="192" x2="656" y2="192" stroke="currentColor" opacity=".18"/>

  <text x="24" y="216" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CONTENIDO PRIVADO — el archivo nunca pasa por tu servidor</text>

  <rect x="24" y="228" width="110" height="42" rx="8" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="79" y="253" text-anchor="middle" fill="currentColor" font-size="10" font-weight="700">cliente</text>

  <line x1="138" y1="240" x2="176" y2="240" stroke="currentColor" stroke-width="1.4" marker-end="url(#r2a)"/>
  <text x="157" y="232" text-anchor="middle" fill="currentColor" opacity=".5" font-size="8.5">1 · pide</text>

  <rect x="180" y="222" width="150" height="56" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.4"/>
  <text x="255" y="242" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">TU SERVIDOR</text>
  <text x="255" y="257" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8.5">verifica sesión + tenant</text>
  <text x="255" y="270" text-anchor="middle" fill="#34d399" font-size="8.5" font-weight="700">firma URL · 60 s</text>

  <line x1="180" y1="264" x2="142" y2="264" stroke="#34d399" stroke-width="1.4" marker-end="url(#r2a)" color="#34d399"/>
  <text x="120" y="284" text-anchor="middle" fill="#34d399" font-size="8.5">2 · URL firmada</text>

  <line x1="138" y1="252" x2="470" y2="300" stroke="#fbbf24" stroke-width="2.4" marker-end="url(#r2a)" color="#fbbf24"/>
  <text x="300" y="296" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">3 · descarga DIRECTO del bucket</text>

  <rect x="474" y="286" width="182" height="42" rx="8" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="565" y="311" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">R2</text>

  <text x="24" y="330" fill="#34d399" font-size="10.5" font-weight="700">
    no pagás ancho de banda de tu servidor</text>
  <text x="24" y="346" fill="#34d399" font-size="10.5" font-weight="700">
    ni ocupás un proceso sirviendo bytes</text>

  <rect x="24" y="358" width="632" height="30" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.3"/>
  <text x="340" y="377" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    El tenant_id del path lo pone EL SERVIDOR, nunca el cliente. Igual que en Supabase Storage.</text>
</svg>`,
        pie: 'Si tu costo está en archivos servidos al público, esta es la mejor relación beneficio/esfuerzo que hay.',
      },

      entrevista: [
        { p: '¿Qué es R2 y cuándo lo usarías?',
          r: 'Almacenamiento de objetos de Cloudflare, <b>compatible con la API de S3</b> y <b>sin cargo de egreso</b>. Lo usaría siempre que ' +
             'el costo esté en <b>archivos servidos al público</b> —imágenes, PDF, video—, porque ahí el egreso es el ítem que más crece. ' +
             'Y lo bueno es que no es una migración de plataforma: como usa la API de S3, cambiar es modificar el <i>endpoint</i> del cliente y ' +
             'nada más. <b>Es la optimización con mejor relación beneficio/esfuerzo</b> de una factura con archivos pesados.' },

        { p: '¿En qué eje cobra R2 entonces?',
          r: 'En <b>operaciones</b>, y las de escritura son bastante más caras que las de lectura. Para el patrón de "escribir poco y leer mucho" — ' +
             'que es el de archivos públicos— sale muy bien. Para <b>escritura intensiva</b> —logs, eventos, muchos archivos chicos por segundo— ' +
             'hay que hacer la cuenta. La regla general que aplico es que <b>"gratis" siempre significa "gratis en un eje"</b>, ' +
             'así que reviso los otros antes de decidir.' },

        { p: '¿Cómo servís contenido privado desde un bucket sin que pase por tu servidor?',
          r: 'Con <b>URLs firmadas de vida corta</b>. El cliente le pide el archivo a <b>mi servidor</b>, no al bucket; el servidor verifica sesión ' +
             'y tenant, genera una URL firmada de 60 segundos o menos, y el cliente descarga <b>directo del bucket</b>. ' +
             'Así el archivo nunca pasa por mi infraestructura —no pago ancho de banda ni ocupo un proceso sirviendo bytes— y la autorización ' +
             'sigue siendo mía. Y el <code>tenant_id</code> del path lo pone el servidor, nunca el cliente.' },

        { p: '¿Qué costo silencioso tiene un bucket de objetos?',
          r: 'Que <b>crece para siempre</b> si no hay reglas de ciclo de vida. Tres cosas se acumulan sin que nadie las vea: las ' +
             '<b>subidas multiparte incompletas</b>, que quedan ocupando espacio; las <b>versiones antiguas</b>, si el versionado está activo — ' +
             'ahí borrar un archivo no libera nada—; y los temporales y previsualizaciones. Definir expiraciones desde el principio cuesta minutos ' +
             'y evita que la línea de almacenamiento crezca sin explicación.' },
      ],

      practica: `
<h4>Migrar de S3 a R2</h4>
<pre><code>// Solo cambia la configuración del cliente
const s3 = new S3Client({
  region: 'auto',
  endpoint: \`https://\${CUENTA}.r2.cloudflarestorage.com\`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Subir, descargar, listar y firmar: exactamente el mismo código
await s3.send(new PutObjectCommand({ Bucket, Key, Body }));
const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket, Key }), { expiresIn: 60 });</code></pre>

<h4>URL firmada con verificación de tenant</h4>
<pre><code>'use server';
import 'server-only';

export async function urlDeArchivo(ruta: string) {
  // 1 · el tenant sale del SERVIDOR
  const tenant = await requireTenantContext(supabase);
  if (!tenant.ok) return { error: tenant.error };

  // 2 · el path se ARMA con el tenant, no se recibe del cliente
  const clave = \`\${tenant.ctx.tenantId}/\${ruta}\`;

  // 3 · verificar que el archivo pertenezca a este tenant en tu base
  const existe = await archivoDelTenant(tenant.ctx.tenantId, ruta);
  if (!existe) return { error: 'No encontrado' };

  // 4 · URL de vida corta
  const url = await getSignedUrl(s3,
    new GetObjectCommand({ Bucket: 'archivos', Key: clave }),
    { expiresIn: 60 });

  return { url };
}</code></pre>

<div class="aviso"><strong>El paso 3 no sobra.</strong> Aunque el path incluya el tenant, verificar en tu base
que ese archivo le pertenece te cubre de un caso concreto: alguien que conoce el identificador de otro tenant y
adivina un nombre de archivo. <b>Defensa en profundidad: el path bien armado más la verificación.</b></div>

<h4>Reglas de ciclo de vida que conviene tener desde el día uno</h4>
<pre><code>· Subidas multiparte incompletas → borrar a los 7 días
· Versiones antiguas (si hay versionado) → borrar a los 30 días
· Prefijo temporales/ → borrar a las 24 horas
· Prefijo previsualizaciones/ → borrar a los 30 días</code></pre>
<p>La primera es la más olvidada: una subida que falla a la mitad deja las partes ocupando espacio, y no
aparecen al listar el bucket.</p>

<h4>Checklist antes de migrar archivos a R2</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Verificar que usás solo funciones de S3 compatibles</td></tr>
<tr><td>☐</td><td>Copiar los archivos existentes (rclone o similar)</td></tr>
<tr><td>☐</td><td>Escritura dual durante la transición, por si hay que volver</td></tr>
<tr><td>☐</td><td>Dominio propio conectado, para servir público con caché</td></tr>
<tr><td>☐</td><td>Reglas de ciclo de vida definidas</td></tr>
<tr><td>☐</td><td>Path <code>&lt;tenant_id&gt;/&lt;resto&gt;</code> armado en el servidor</td></tr>
<tr><td>☐</td><td>Bucket <b>privado</b> si hay datos sensibles, con URLs firmadas</td></tr>
</table>
`,

      errores: [
        { mito: 'R2 es gratis.',
          realidad: 'El <b>egreso</b> es gratis. Se cobran el almacenamiento y las <b>operaciones</b>, y las de escritura son relativamente caras. ' +
                    'Para leer mucho y escribir poco sale muy bien; para escritura intensiva hay que hacer la cuenta completa.' },

        { mito: 'Migrar a R2 es una migración de plataforma.',
          realidad: 'Es cambiar el <i>endpoint</i> del cliente S3. No tocás auth, ni base de datos, ni lógica de negocio. ' +
                    '<b>Una tarde de trabajo contra semanas</b>, y por eso es la primera optimización a evaluar si tu costo está en archivos.' },

        { mito: 'R2 implementa toda la API de S3.',
          realidad: 'Implementa la <b>mayor parte</b>. Lo habitual —subir, descargar, listar, URLs firmadas, multiparte— funciona idéntico, ' +
                    'pero algunas funciones avanzadas pueden faltar. Si usás algo fuera de lo común, revisá la compatibilidad antes.' },

        { mito: 'Con el path por tenant ya está aislado.',
          realidad: 'El path lo tiene que armar <b>el servidor</b>, nunca el cliente. Y conviene además <b>verificar en tu base</b> que el archivo ' +
                    'pertenece a ese tenant: cubre el caso de alguien que conoce otro identificador y adivina un nombre.' },
      ],

      glosario: [
        { t: 'R2', d: 'Almacenamiento de objetos de Cloudflare, compatible con S3 y sin cargo de egreso.' },
        { t: 'Compatible con S3', d: 'Usa la misma API, así que el código del SDK de S3 funciona sin cambios.' },
        { t: 'URL firmada', d: 'Enlace temporal con permiso de acceso a un objeto, generado por tu servidor.' },
        { t: 'Bucket', d: 'Contenedor de objetos, equivalente a un espacio de nombres de archivos.' },
        { t: 'Subida multiparte', d: 'Subir un archivo grande en partes. Las incompletas ocupan espacio invisible.' },
        { t: 'Regla de ciclo de vida', d: 'Política que borra objetos automáticamente pasado cierto tiempo.' },
        { t: 'Versionado', d: 'Conservar versiones anteriores de cada objeto. Sin expiración, el bucket nunca deja de crecer.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Workers, D1, KV y Durable Objects',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> Cloudflare tiene una pieza para cada tipo de dato,
y elegir mal es la fuente número uno de frustración con esta plataforma.</div>

<h4>Las cuatro piezas</h4>

<p><b>Workers</b> — el cómputo. Tu código corriendo en cientos de puntos, cerca del usuario, con arranque en
milisegundos. Es el equivalente a una función serverless, pero mucho más liviana.</p>

<p><b>KV</b> — clave-valor replicado globalmente. Lecturas rapidísimas desde cualquier punto, escrituras que
tardan en propagarse. Para configuración, banderas y caché.</p>

<p><b>D1</b> — SQLite distribuido. Datos relacionales, con SQL de verdad, pero pensado para cargas
<b>livianas y de lectura intensiva</b>.</p>

<p><b>Durable Objects</b> — objetos con estado, uno por clave, que viven en <b>una sola ubicación</b>. Sirven
para coordinar: contadores, salas de chat, WebSockets, cualquier cosa que necesite un punto único de verdad.</p>

<h4>La tabla que evita el 90% de los problemas</h4>
<table>
<tr><th>Necesitás…</th><th>Usá</th><th>Por qué</th></tr>
<tr><td>Leer configuración muy seguido</td><td><b>KV</b></td><td>Lectura rapidísima, tolera estar unos segundos vieja</td></tr>
<tr><td>Un contador exacto</td><td><b>Durable Object</b></td><td>KV es eventual: perderías cuentas</td></tr>
<tr><td>Consultas relacionales livianas</td><td><b>D1</b></td><td>SQL real, cerca del usuario</td></tr>
<tr><td>Consultas complejas, pgvector, RLS</td><td><b>Postgres</b></td><td>D1 no lo reemplaza</td></tr>
<tr><td>Archivos</td><td><b>R2</b></td><td>Sin egreso</td></tr>
<tr><td>WebSockets con estado</td><td><b>Durable Object</b></td><td>Un punto único donde converge la sesión</td></tr>
</table>

<div class="aviso"><strong>La confusión más cara es usar KV donde hace falta consistencia.</strong> KV es de
<b>consistencia eventual</b>: escribís un valor y puede tardar en verse en todos los puntos. Para una bandera
de funcionalidad está perfecto. Para un contador de stock, <b>vas a perder cuentas</b> y el error va a ser
intermitente e imposible de reproducir.</div>
`,

      tecnico: `
<h4>Workers, en detalle</h4>
<p>Corren sobre el motor V8 con aislamiento por <i>isolate</i>, no por contenedor. Eso explica sus
características:</p>
<ul>
<li><b>Arranque en milisegundos</b> — no hay que levantar un proceso ni un runtime completo.</li>
<li><b>Poco tiempo de CPU</b> por invocación — están pensados para decidir, no para procesar.</li>
<li><b>API limitada</b> — no hay acceso al sistema de archivos ni a muchos módulos de Node; se usan APIs web estándar.</li>
<li><b>Sin conexiones TCP salientes arbitrarias</b> — para bases de datos hay que usar drivers por HTTP o servicios vinculados.</li>
</ul>

<div class="dato"><strong>Esa última restricción es la que más planes rompe.</strong> No podés abrir una
conexión TCP normal a Postgres desde un Worker: hace falta un driver por HTTP —como el serverless de Neon— o
un <i>Hyperdrive</i> que haga de intermediario. Si tu plan era "muevo la API a Workers y sigue hablando con mi
Postgres", hay un paso más del que parecía.</div>

<h4>D1: qué es y qué no</h4>
<p>Es SQLite, con lo que eso implica:</p>
<table>
<tr><th>Bien</th><th>Mal</th></tr>
<tr><td>SQL real, con joins e índices</td><td>Un solo escritor: la concurrencia de escritura es limitada</td></tr>
<tr><td>Latencia bajísima en lecturas</td><td>Sin extensiones: no hay pgvector ni PostGIS</td></tr>
<tr><td>Barato para volúmenes chicos</td><td>Límites de tamaño de base y de resultado por consulta</td></tr>
<tr><td>Ideal para catálogos y configuración</td><td>No reemplaza a Postgres en consultas complejas ni en RLS</td></tr>
</table>
<p><b>Regla práctica:</b> D1 es excelente para datos que se <b>leen mucho y se escriben poco</b> y que caben
cómodos. Para el corazón transaccional de un producto, Postgres.</p>

<h4>Durable Objects: el que resuelve lo difícil</h4>
<p>Es la pieza más interesante y la menos entendida. Cada objeto:</p>
<ul>
<li>Existe <b>una sola vez</b> globalmente, identificado por una clave.</li>
<li>Vive en <b>una ubicación</b>, elegida cerca de quien más lo usa.</li>
<li>Procesa sus mensajes <b>de a uno</b>: no hay condiciones de carrera dentro del objeto.</li>
<li>Tiene <b>almacenamiento propio</b> y persistente.</li>
</ul>
<p>Eso lo hace ideal para lo que en un sistema distribuido normal requiere bloqueos: un contador exacto, una
sala de chat, el estado de una partida, un límite de peticiones por usuario que sea preciso.</p>

<h4>La combinación que funciona</h4>
<p>Adoptar Cloudflare entero rara vez es la respuesta. Lo que sí rinde en un stack como el del workspace:</p>
<ul>
<li><b>R2</b> para archivos — el ahorro más grande, sin tocar nada más.</li>
<li><b>CDN y caché</b> delante del sitio.</li>
<li><b>Workers</b> para middleware: redirecciones, límite de peticiones, geolocalización.</li>
<li><b>Postgres se queda donde está</b> — con RLS, pgvector y todo lo que ya funciona.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    UNA PIEZA PARA CADA TIPO DE DATO — elegir mal es la frustración n°1</text>

  <rect x="24" y="34" width="152" height="100" rx="10" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="100" y="56" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">WORKERS</text>
  <text x="100" y="76" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">el cómputo</text>
  <text x="100" y="94" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">arranca en ms</text>
  <text x="100" y="110" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">API limitada</text>
  <text x="100" y="126" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">sin TCP a Postgres</text>

  <rect x="188" y="34" width="152" height="100" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="264" y="56" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">KV</text>
  <text x="264" y="76" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">clave-valor global</text>
  <text x="264" y="94" text-anchor="middle" fill="#34d399" font-size="9.5">config · banderas · caché</text>
  <text x="264" y="112" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">CONSISTENCIA EVENTUAL</text>
  <text x="264" y="127" text-anchor="middle" fill="#f87171" font-size="9">nunca para contadores</text>

  <rect x="352" y="34" width="152" height="100" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="428" y="56" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">D1</text>
  <text x="428" y="76" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">SQLite distribuido</text>
  <text x="428" y="94" text-anchor="middle" fill="#34d399" font-size="9.5">SQL real, lectura intensiva</text>
  <text x="428" y="112" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">sin pgvector ni RLS</text>
  <text x="428" y="127" text-anchor="middle" fill="#f87171" font-size="9">no reemplaza a Postgres</text>

  <rect x="516" y="34" width="140" height="100" rx="10" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="586" y="56" text-anchor="middle" fill="#7c5cff" font-size="11.5" font-weight="700">DURABLE OBJECTS</text>
  <text x="586" y="76" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">estado coordinado</text>
  <text x="586" y="94" text-anchor="middle" fill="#7c5cff" font-size="9.5">uno por clave, un lugar</text>
  <text x="586" y="112" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">sin condiciones de carrera</text>
  <text x="586" y="127" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">contadores · WebSockets</text>

  <line x1="24" y1="154" x2="656" y2="154" stroke="currentColor" opacity=".18"/>

  <text x="24" y="178" fill="#f87171" font-size="12" font-weight="700">
    LA CONFUSIÓN MÁS CARA</text>

  <rect x="24" y="190" width="304" height="86" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="176" y="212" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">✗ KV para un contador</text>
  <text x="44" y="234" fill="currentColor" opacity=".72" font-size="10.5">escribís 10, otro punto todavía lee 9</text>
  <text x="44" y="252" fill="currentColor" opacity=".72" font-size="10.5">las escrituras se pisan</text>
  <text x="44" y="268" fill="#f87171" font-size="10" font-weight="700">error intermitente, imposible de reproducir</text>

  <rect x="352" y="190" width="304" height="86" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="212" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">✓ Durable Object para un contador</text>
  <text x="372" y="234" fill="currentColor" opacity=".72" font-size="10.5">existe una sola vez, en un lugar</text>
  <text x="372" y="252" fill="currentColor" opacity=".72" font-size="10.5">procesa los mensajes de a uno</text>
  <text x="372" y="268" fill="#34d399" font-size="10" font-weight="700">cuenta exacta, sin bloqueos</text>

  <rect x="24" y="292" width="632" height="96" rx="10" fill="#7c5cff" fill-opacity=".08" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="340" y="314" text-anchor="middle" fill="#7c5cff" font-size="12" font-weight="700">
    LA COMBINACIÓN QUE RINDE — adoptar Cloudflare entero rara vez es la respuesta</text>
  <text x="44" y="338" fill="#34d399" font-size="11" font-weight="700">✓ R2 para archivos</text>
  <text x="200" y="338" fill="currentColor" opacity=".65" font-size="10.5">el ahorro más grande, sin tocar nada más</text>
  <text x="44" y="356" fill="#34d399" font-size="11" font-weight="700">✓ CDN y caché</text>
  <text x="200" y="356" fill="currentColor" opacity=".65" font-size="10.5">delante del sitio</text>
  <text x="44" y="374" fill="#34d399" font-size="11" font-weight="700">✓ Workers de middleware</text>
  <text x="200" y="374" fill="currentColor" opacity=".65" font-size="10.5">redirecciones, límites, geolocalización</text>
  <text x="420" y="374" fill="#fbbf24" font-size="11" font-weight="700">· Postgres se queda donde está</text>
</svg>`,
        pie: 'Cada pieza resuelve un problema distinto. La combinación que rinde no es adoptarlas todas.',
      },

      entrevista: [
        { p: '¿Cuándo usarías KV y cuándo un Durable Object?',
          r: '<b>KV</b> para datos que se leen muchísimo y toleran estar unos segundos desactualizados: configuración, banderas de funcionalidad, ' +
             'caché. Es de <b>consistencia eventual</b>, así que una escritura tarda en verse en todos los puntos. ' +
             '<b>Durable Objects</b> para cualquier cosa que necesite <b>un punto único de verdad</b>: un contador exacto, una sala de chat, ' +
             'un límite de peticiones preciso. Cada objeto existe una sola vez globalmente y procesa sus mensajes de a uno, así que no hay ' +
             'condiciones de carrera. <b>Usar KV para un contador es perder cuentas</b>, con un error intermitente e imposible de reproducir.' },

        { p: '¿D1 puede reemplazar a Postgres?',
          r: 'No en el caso general. D1 es <b>SQLite distribuido</b>: da SQL real con joins e índices, y latencia bajísima en lecturas desde ' +
             'cualquier punto. Pero tiene <b>un solo escritor</b>, así que la concurrencia de escritura es limitada; no tiene extensiones, ' +
             'así que no hay pgvector ni PostGIS; y no tiene RLS. Es excelente para datos que se <b>leen mucho y se escriben poco</b> ' +
             '—catálogos, configuración— pero para el corazón transaccional de un producto, Postgres.' },

        { p: '¿Qué restricción de Workers rompe más planes de migración?',
          r: 'Que <b>no podés abrir una conexión TCP arbitraria</b>, y eso incluye la conexión normal a Postgres. Hace falta un driver por HTTP — ' +
             'como el serverless de Neon— o un intermediario tipo Hyperdrive. Si el plan era "muevo la API a Workers y sigue hablando con mi ' +
             'Postgres", hay un paso más del que parecía. Las otras dos restricciones son el <b>poco tiempo de CPU</b> por invocación y la ' +
             '<b>API limitada</b>: no hay sistema de archivos ni muchos módulos de Node.' },

        { p: '¿Qué combinación de Cloudflare recomendarías en un stack que ya usa Postgres?',
          r: 'Adoptar la plataforma entera rara vez es la respuesta. Lo que rinde es: <b>R2 para archivos</b>, que es el ahorro más grande y no ' +
             'toca nada más; <b>CDN y caché</b> delante del sitio; y <b>Workers para middleware</b> —redirecciones, límite de peticiones, ' +
             'geolocalización—, que es donde el edge realmente aporta. Y <b>Postgres se queda donde está</b>, con RLS, pgvector y todo lo que ya ' +
             'funciona. Es una adopción por piezas, no una migración.' },
      ],

      practica: `
<h4>Un Worker de middleware, que es el caso real</h4>
<pre><code>export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1 · bloquear rutas de administración desde fuera de tu país
    if (url.pathname.startsWith('/admin') &amp;&amp; request.cf?.country !== 'AR') {
      return new Response('No disponible', { status: 403 });
    }

    // 2 · límite de peticiones, con estado exacto
    const id = env.LIMITADOR.idFromName(request.headers.get('cf-connecting-ip'));
    const limitador = env.LIMITADOR.get(id);          // ← Durable Object
    const permitido = await limitador.fetch(request);
    if (!permitido.ok) return new Response('Demasiadas peticiones', { status: 429 });

    // 3 · todo lo demás sigue al origen
    return fetch(request);
  },
};</code></pre>

<div class="aviso"><strong>El límite de peticiones es el caso donde Durable Objects brilla.</strong> Hacerlo
con KV daría cuentas mal —dos peticiones simultáneas leen el mismo valor y ambas pasan—. Con un Durable Object
por IP, los mensajes se procesan de a uno y la cuenta es exacta, <b>sin necesidad de bloqueos</b>.</div>

<h4>Un Durable Object de contador</h4>
<pre><code>export class Limitador {
  constructor(state) { this.state = state; }

  async fetch(request) {
    // se procesa de a uno: no hay condición de carrera
    const ahora = Date.now();
    let datos = (await this.state.storage.get('ventana')) ?? { desde: ahora, n: 0 };

    if (ahora - datos.desde &gt; 60_000) datos = { desde: ahora, n: 0 };
    datos.n++;
    await this.state.storage.put('ventana', datos);

    return new Response(null, { status: datos.n &lt;= 100 ? 200 : 429 });
  }
}</code></pre>

<h4>Qué adoptar, y en qué orden</h4>
<table>
<tr><th>#</th><th>Pieza</th><th>Beneficio</th><th>Riesgo</th></tr>
<tr><td>1</td><td><b>CDN + caché</b></td><td>Velocidad y egreso</td><td>Ninguno</td></tr>
<tr><td>2</td><td><b>R2</b> para archivos</td><td>Toda la línea de egreso</td><td>Bajo: API de S3</td></tr>
<tr><td>3</td><td><b>Workers</b> de middleware</td><td>Bloqueos y límites en el borde</td><td>Bajo, si es acotado</td></tr>
<tr><td>4</td><td><b>Durable Objects</b></td><td>Coordinación exacta</td><td>Medio: modelo mental nuevo</td></tr>
<tr><td>5</td><td><b>D1</b></td><td>Datos livianos cerca del usuario</td><td>Alto si esperás Postgres</td></tr>
</table>
<p>Los dos primeros son casi siempre ganancia neta. El quinto es el que más decepciona si se adopta esperando
que reemplace a lo que ya tenés.</p>
`,

      errores: [
        { mito: 'KV es una base de datos rápida.',
          realidad: 'Es clave-valor de <b>consistencia eventual</b>. Perfecto para configuración, banderas y caché; ' +
                    '<b>desastroso para contadores</b>: dos escrituras concurrentes se pisan y perdés cuentas, con un error intermitente ' +
                    'que no se puede reproducir.' },

        { mito: 'D1 reemplaza a Postgres.',
          realidad: 'Es SQLite: <b>un solo escritor</b>, sin extensiones —no hay pgvector— y sin RLS. Excelente para datos que se leen mucho ' +
                    'y se escriben poco. Para el corazón transaccional de un producto, Postgres.' },

        { mito: 'Muevo mi API a Workers y sigue hablando con Postgres.',
          realidad: 'Los Workers <b>no pueden abrir conexiones TCP arbitrarias</b>. Hace falta un driver por HTTP o un intermediario tipo ' +
                    'Hyperdrive. Es un paso más que suele descubrirse tarde en el plan.' },

        { mito: 'Si adopto Cloudflare, adopto todo.',
          realidad: 'La adopción que rinde es <b>por piezas</b>: CDN y R2 primero, que son ganancia casi neta; Workers para middleware; ' +
                    'y Postgres se queda donde está. Migrar todo de una es asumir un riesgo grande por un beneficio que las dos primeras piezas ' +
                    'ya te dan.' },
      ],

      glosario: [
        { t: 'Worker', d: 'Cómputo en el edge de Cloudflare, sobre V8, con arranque en milisegundos y API limitada.' },
        { t: 'Isolate', d: 'Unidad de aislamiento de V8. Más liviana que un contenedor: por eso el arranque es tan rápido.' },
        { t: 'KV', d: 'Almacenamiento clave-valor replicado globalmente, de consistencia eventual.' },
        { t: 'D1', d: 'SQLite distribuido. SQL real para cargas livianas de lectura intensiva.' },
        { t: 'Durable Object', d: 'Objeto con estado que existe una sola vez, en una ubicación, y procesa mensajes de a uno.' },
        { t: 'Hyperdrive', d: 'Intermediario que permite a un Worker hablar con una base de datos por conexión agrupada.' },
        { t: 'Consistencia eventual', d: 'Los cambios se propagan con retraso; una lectura puede devolver un valor viejo.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Seguridad en el borde',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> es mucho más barato frenar el tráfico malicioso
<b>antes</b> de que llegue a tu servidor que después. Y esa es la mitad del valor de un CDN.</div>

<h4>Lo que se frena en el borde</h4>

<p><b>DDoS</b> — un ataque de denegación de servicio distribuido busca saturarte con tráfico. Una red grande lo
absorbe sin que tu servidor se entere. Es protección que viene incluida y que sería carísimo montar solo.</p>

<p><b>Bots</b> — rastreadores, raspadores y scripts que consumen tu ancho de banda y tus recursos. Se pueden
distinguir de los usuarios reales y bloquear, o dejar pasar a los que sí querés —los buscadores.</p>

<p><b>Límite de peticiones</b> — cortar a quien hace demasiadas. Funciona mejor en el borde porque ni siquiera
consume una conexión de tu servidor.</p>

<p><b>WAF</b> — reglas que detectan patrones de ataque conocidos: inyección SQL, scripts inyectados,
recorridos de directorio. <b>No reemplaza escribir código seguro</b>, pero filtra lo evidente.</p>

<div class="aviso"><strong>El punto que ordena todo esto:</strong> el borde es una <b>capa</b>, no la
seguridad. Frena el ruido y los ataques genéricos, y eso vale mucho. Pero <b>no te protege de un permiso mal
puesto, de una consulta sin filtro de tenant ni de una lógica de negocio equivocada</b>. Confiar en el WAF en
lugar de en RLS es cambiar una defensa real por una probabilística.</div>

<h4>Lo más rentable, y es gratis</h4>
<p>Antes de configurar reglas sofisticadas, dos cosas simples cubren la mayoría de los casos:</p>
<ul>
<li><b>Límite de peticiones</b> en las rutas sensibles: login, registro, recuperación de contraseña, endpoints caros.</li>
<li><b>Bloqueo por geografía</b> del panel de administración, si tu equipo está en un solo país.</li>
</ul>
<p>Las dos se configuran en minutos y frenan la enorme mayoría del abuso automatizado.</p>
`,

      tecnico: `
<h4>Las capas, en orden de utilidad real</h4>
<table>
<tr><th>Capa</th><th>Frena</th><th>Esfuerzo</th></tr>
<tr><td><b>DDoS</b></td><td>Saturación por volumen</td><td>Ninguno: viene incluido</td></tr>
<tr><td><b>Límite de peticiones</b></td><td>Fuerza bruta, raspado, abuso de endpoints caros</td><td>Minutos</td></tr>
<tr><td><b>Bloqueo geográfico</b></td><td>Acceso a rutas administrativas desde donde no corresponde</td><td>Minutos</td></tr>
<tr><td><b>Gestión de bots</b></td><td>Raspadores y automatización</td><td>Bajo, con ajuste</td></tr>
<tr><td><b>WAF</b></td><td>Patrones de ataque conocidos</td><td>Medio: hay que revisar falsos positivos</td></tr>
<tr><td><b>mTLS o listas de IP</b></td><td>Acceso a APIs internas</td><td>Medio</td></tr>
</table>

<div class="dato"><strong>El límite de peticiones en el login es la medida con mejor relación
beneficio/esfuerzo de todo el módulo.</strong> Un ataque de credenciales robadas prueba miles de combinaciones
por hora. Limitar a unos pocos intentos por IP y por cuenta lo vuelve inviable, y son cinco minutos de
configuración. <b>Y conviene limitar por las dos dimensiones</b>: por IP frena a un atacante único, por cuenta
frena a uno distribuido que prueba la misma cuenta desde muchas IPs.</div>

<h4>Proteger el origen, que es lo que casi nadie hace</h4>
<p>Un detalle importante: si alguien descubre la IP real de tu servidor, puede <b>saltarse el CDN por
completo</b> y atacarte directo. Toda la protección del borde queda de adorno.</p>
<p>Las medidas:</p>
<ul>
<li><b>Firewall que solo acepte tráfico del CDN</b> — sus rangos de IP son públicos y se pueden allowlist.</li>
<li><b>Certificado de origen autenticado</b> — que tu servidor exija un certificado que solo el CDN tiene.</li>
<li><b>Túnel</b> — el servidor abre una conexión saliente hacia el CDN y no expone ningún puerto entrante. Es la opción más fuerte.</li>
</ul>
<p>Sin alguna de estas, el borde es una puerta con cerradura al lado de una ventana abierta.</p>

<h4>Cabeceras que conviene fijar en el borde</h4>
<pre><code>Strict-Transport-Security: max-age=63072000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()</code></pre>
<p>Ponerlas en el borde tiene una ventaja concreta sobre ponerlas en la aplicación: <b>aplican a todo</b>,
incluidas las respuestas que no pasan por tu código —assets, errores del proxy, redirecciones—.</p>

<h4>Lo que el borde NO resuelve</h4>
<ul>
<li>Un usuario legítimo que accede a datos que no le corresponden.</li>
<li>Una consulta sin filtro de tenant.</li>
<li>Un permiso mal configurado.</li>
<li>Una clave filtrada en el repositorio.</li>
<li>Prompt injection en un sistema con IA.</li>
</ul>
<p>Todo eso pasa por el borde sin levantar ninguna alarma, porque <b>es tráfico legítimo</b>.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="sg1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LO QUE SE FRENA ANTES DE LLEGAR A TU SERVIDOR</text>

  <rect x="24" y="34" width="130" height="120" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.3"/>
  <text x="89" y="54" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">tráfico entrante</text>
  <text x="89" y="76" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">usuarios reales</text>
  <text x="89" y="94" text-anchor="middle" fill="#f87171" font-size="9.5">bots y raspadores</text>
  <text x="89" y="112" text-anchor="middle" fill="#f87171" font-size="9.5">fuerza bruta</text>
  <text x="89" y="130" text-anchor="middle" fill="#f87171" font-size="9.5">DDoS</text>
  <text x="89" y="146" text-anchor="middle" fill="#f87171" font-size="9.5">inyecciones</text>

  <line x1="158" y1="94" x2="184" y2="94" stroke="currentColor" stroke-width="1.4" marker-end="url(#sg1)"/>

  <rect x="188" y="34" width="180" height="120" rx="10" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="278" y="54" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">EL BORDE</text>
  <text x="204" y="76" fill="currentColor" opacity=".72" font-size="9.5">· DDoS (incluido)</text>
  <text x="204" y="94" fill="#34d399" font-size="9.5" font-weight="700">· límite de peticiones ← lo más rentable</text>
  <text x="204" y="112" fill="currentColor" opacity=".72" font-size="9.5">· bloqueo geográfico</text>
  <text x="204" y="130" fill="currentColor" opacity=".72" font-size="9.5">· bots</text>
  <text x="204" y="146" fill="currentColor" opacity=".72" font-size="9.5">· WAF</text>

  <line x1="372" y1="94" x2="398" y2="94" stroke="#34d399" stroke-width="2" marker-end="url(#sg1)" color="#34d399"/>
  <text x="385" y="86" text-anchor="middle" fill="#34d399" font-size="8.5" font-weight="700">solo lo</text>
  <text x="385" y="112" text-anchor="middle" fill="#34d399" font-size="8.5" font-weight="700">legítimo</text>

  <rect x="402" y="34" width="254" height="120" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="529" y="54" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">TU SERVIDOR</text>
  <text x="529" y="78" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10">acá siguen viviendo</text>
  <text x="529" y="98" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">RLS · autorización · validación</text>
  <text x="529" y="120" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">el borde es una CAPA,</text>
  <text x="529" y="136" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">no la seguridad</text>

  <line x1="24" y1="176" x2="656" y2="176" stroke="currentColor" opacity=".18"/>

  <text x="24" y="200" fill="#f87171" font-size="12" font-weight="700">
    EL AGUJERO QUE CASI NADIE TAPA</text>

  <rect x="24" y="212" width="632" height="66" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="234" fill="currentColor" opacity=".75" font-size="11">
    Si alguien descubre la IP real de tu servidor, se saltea el CDN por completo y te ataca directo.</text>
  <text x="44" y="254" fill="#f87171" font-size="11.5" font-weight="700">
    Toda la protección del borde queda de adorno: es una puerta con cerradura al lado de una ventana abierta.</text>
  <text x="44" y="271" fill="#34d399" font-size="10.5" font-weight="700">
    Se tapa con: firewall que solo acepte rangos del CDN · certificado de origen · o un túnel (lo más fuerte).</text>

  <text x="24" y="304" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LO QUE EL BORDE NO RESUELVE — pasa como tráfico legítimo</text>

  <rect x="24" y="316" width="200" height="28" rx="7" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".28"/>
  <text x="124" y="335" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">consulta sin filtro de tenant</text>

  <rect x="240" y="316" width="200" height="28" rx="7" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".28"/>
  <text x="340" y="335" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">permiso mal configurado</text>

  <rect x="456" y="316" width="200" height="28" rx="7" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".28"/>
  <text x="556" y="335" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">clave filtrada en el repo</text>

  <rect x="24" y="352" width="304" height="28" rx="7" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".28"/>
  <text x="176" y="371" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">usuario legítimo accediendo a lo ajeno</text>

  <rect x="344" y="352" width="312" height="28" rx="7" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".28"/>
  <text x="500" y="371" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">prompt injection en un sistema con IA</text>
</svg>`,
        pie: 'El borde frena el ruido. La autorización real sigue viviendo en tu base y en tu código.',
      },

      entrevista: [
        { p: '¿Qué te da la seguridad en el borde y qué no?',
          r: 'Te da protección contra <b>ataques genéricos y de volumen</b>: DDoS absorbido por la red, límite de peticiones contra fuerza bruta ' +
             'y raspado, bloqueo geográfico, gestión de bots y un WAF que filtra patrones conocidos. Todo eso es muy valioso y barato. ' +
             'Lo que <b>no</b> te da es autorización: un usuario legítimo accediendo a datos ajenos, una consulta sin filtro de tenant, ' +
             'un permiso mal puesto o una clave filtrada <b>pasan por el borde sin levantar ninguna alarma</b>, porque son tráfico legítimo. ' +
             'El borde es una capa, no la seguridad.' },

        { p: '¿Cuál es la medida de seguridad en el borde con mejor relación beneficio/esfuerzo?',
          r: 'El <b>límite de peticiones en el login</b>. Un ataque con credenciales robadas prueba miles de combinaciones por hora; limitar a unos ' +
             'pocos intentos lo vuelve inviable, y son cinco minutos de configuración. Y conviene limitar por <b>dos dimensiones</b>: ' +
             'por IP frena a un atacante único, y <b>por cuenta</b> frena a uno distribuido que prueba la misma cuenta desde muchas IPs. ' +
             'La segunda dimensión es la que casi nadie configura.' },

        { p: 'Tenés un CDN con WAF delante. ¿Estás protegido?',
          r: 'No del todo, y hay un agujero concreto que casi nadie tapa: si alguien descubre <b>la IP real de tu servidor</b>, se saltea el CDN por ' +
             'completo y te ataca directo. Toda la protección del borde queda de adorno. Se tapa de tres formas: un <b>firewall que solo acepte los ' +
             'rangos de IP del CDN</b>, que son públicos; un <b>certificado de origen</b> que solo el CDN tiene; o un <b>túnel</b>, donde el servidor ' +
             'abre una conexión saliente y no expone ningún puerto entrante — que es la opción más fuerte.' },

        { p: '¿Por qué conviene poner las cabeceras de seguridad en el borde y no solo en la aplicación?',
          r: 'Porque en el borde <b>aplican a todo</b>, incluidas las respuestas que nunca pasan por tu código: archivos estáticos, errores generados ' +
             'por el proxy, redirecciones. Si las ponés solo en la aplicación, quedan huecos justo en las respuestas que no controlás. ' +
             'Lo ideal es tenerlas en las dos capas: en el borde como red de seguridad universal, y en la aplicación para lo que necesite ' +
             'valores específicos por ruta.' },
      ],

      practica: `
<h4>Las dos reglas que cubren la mayoría del abuso</h4>
<pre><code># 1 · Límite en el login — por IP Y por cuenta
Ruta:      /api/auth/login
Límite:    5 peticiones cada 10 minutos por IP
           10 peticiones cada 10 minutos por email  ← la que casi nadie pone
Acción:    bloquear 15 minutos

# 2 · Panel de administración solo desde tu país
Ruta:      /admin/*
Condición: país ≠ AR
Acción:    bloquear</code></pre>

<div class="aviso"><strong>La segunda dimensión del límite —por cuenta— es la que falta casi siempre.</strong>
Limitar solo por IP frena a un atacante único, pero no a uno que prueba la misma cuenta desde cien IPs
distintas, que es exactamente cómo funciona un ataque con credenciales filtradas.</div>

<h4>Proteger el origen</h4>
<pre><code># Opción A · firewall que solo acepte los rangos del CDN
# (los rangos son públicos y hay que actualizarlos cada tanto)
ufw default deny incoming
for rango in $(curl -s https://www.cloudflare.com/ips-v4); do
  ufw allow from "$rango" to any port 443
done

# Opción B · túnel: el servidor abre una conexión SALIENTE
# No hay ningún puerto entrante expuesto. Es la más fuerte.</code></pre>

<h4>Verificar que el origen no sea alcanzable</h4>
<pre><code># Si esto responde, tu origen está expuesto y el CDN se puede saltear
curl -sI --resolve tusitio.com:443:IP_REAL_DEL_SERVIDOR https://tusitio.com

# Debería fallar o dar un error de certificado, no devolver tu sitio.</code></pre>

<h4>Qué configurar y en qué orden</h4>
<table>
<tr><th>#</th><th>Medida</th><th>Tiempo</th><th>Frena</th></tr>
<tr><td>1</td><td>Límite en login y registro</td><td>5 min</td><td>Fuerza bruta y credenciales filtradas</td></tr>
<tr><td>2</td><td>Bloqueo geográfico del panel</td><td>5 min</td><td>Acceso automatizado a rutas críticas</td></tr>
<tr><td>3</td><td>Cabeceras de seguridad</td><td>10 min</td><td>Clases enteras de ataques de navegador</td></tr>
<tr><td>4</td><td><b>Proteger el origen</b></td><td>30 min</td><td>Que se saltee todo lo anterior</td></tr>
<tr><td>5</td><td>Límite en endpoints caros</td><td>15 min</td><td>Abuso de recursos y de tu factura de IA</td></tr>
<tr><td>6</td><td>WAF con reglas gestionadas</td><td>1 h + ajuste</td><td>Patrones conocidos. Ojo con falsos positivos</td></tr>
</table>
<p>El punto 5 aplica directo a lo que estudiaste en el track de IA: <b>un endpoint que llama a un LLM es un
endpoint caro</b>, y sin límite alguien puede consumirte el presupuesto mensual en una tarde.</p>
`,

      errores: [
        { mito: 'Con un WAF ya estoy seguro.',
          realidad: 'El WAF filtra <b>patrones conocidos</b>. No detecta un usuario legítimo accediendo a datos ajenos, una consulta sin filtro de ' +
                    'tenant ni un permiso mal puesto — todo eso pasa como tráfico normal. <b>Confiar en el WAF en lugar de en RLS es cambiar una ' +
                    'defensa real por una probabilística.</b>' },

        { mito: 'Tengo el CDN delante, así que mi servidor está protegido.',
          realidad: 'Si alguien descubre la <b>IP real</b> de tu origen, se saltea el CDN por completo. Hace falta un firewall que solo acepte los ' +
                    'rangos del CDN, un certificado de origen o un túnel. Sin eso, el borde es una puerta con cerradura al lado de una ventana abierta.' },

        { mito: 'El límite de peticiones por IP alcanza.',
          realidad: 'Frena a un atacante único, no a uno distribuido que prueba la <b>misma cuenta</b> desde cien IPs — que es exactamente cómo ' +
                    'funciona un ataque con credenciales filtradas. Hay que limitar también <b>por cuenta</b>, y es lo que casi nadie configura.' },

        { mito: 'Las cabeceras de seguridad las pongo en la aplicación.',
          realidad: 'Ahí no cubren las respuestas que <b>no pasan por tu código</b>: archivos estáticos, errores del proxy, redirecciones. ' +
                    'En el borde aplican a todo. Lo ideal es tenerlas en las dos capas.' },
      ],

      glosario: [
        { t: 'DDoS', d: 'Ataque de denegación de servicio distribuido: saturar con tráfico desde muchas fuentes.' },
        { t: 'WAF', d: 'Web Application Firewall. Reglas que detectan patrones de ataque conocidos.' },
        { t: 'Límite de peticiones', d: 'Cortar a quien supera cierta cantidad. Conviene por IP y por cuenta.' },
        { t: 'Gestión de bots', d: 'Distinguir automatización de usuarios reales y actuar en consecuencia.' },
        { t: 'Protección de origen', d: 'Impedir que se alcance tu servidor directamente, salteando el CDN.' },
        { t: 'Certificado de origen', d: 'Certificado que solo el CDN posee, exigido por tu servidor.' },
        { t: 'Túnel', d: 'Conexión saliente desde tu servidor al CDN. No expone ningún puerto entrante.' },
        { t: 'Falso positivo', d: 'Tráfico legítimo bloqueado por una regla. El costo de ajustar un WAF.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cómo verificás que tu CDN efectivamente está cacheando?',
      opciones: [
        'Mirando la cabecera cf-cache-status: HIT es lo que querés ver',
        'Comprobando que el sitio cargue rápido',
        'Revisando el panel del proveedor una vez al mes',
        'Midiendo el uso de CPU del servidor',
      ],
      correcta: 0,
      porQue: 'Un CDN con 10% de aciertos no genera ningún error: el sitio funciona perfecto y estás pagando el CDN y el egreso completo. Verificar esa cabecera es lo primero después de configurarlo.',
      porQueNo: {
        1: 'Puede cargar rápido por otras razones y aun así ir al origen en cada petición.',
        2: 'Es útil, pero no reemplaza verificar respuesta por respuesta.',
        3: 'La CPU no indica si el contenido vino de caché o del origen.',
      },
    },
    {
      p: '¿Qué significa cf-cache-status: BYPASS?',
      opciones: [
        'Algo impide cachear: típicamente una cookie en la respuesta o Cache-Control private',
        'El contenido se sirvió desde caché correctamente',
        'Es la primera vez que se pide ese recurso',
        'El CDN está caído',
      ],
      correcta: 0,
      porQue: 'Muchos frameworks mandan la cookie de sesión en toda respuesta si no se los limita, incluidas las de archivos estáticos. El resultado es un CDN que no cachea nada.',
      porQueNo: {
        1: 'Eso sería HIT.',
        2: 'Eso sería MISS, que es normal la primera vez.',
        3: 'Si estuviera caído no habría respuesta ni cabecera.',
      },
    },
    {
      p: '¿Cuál es la diferencia entre max-age y s-maxage?',
      opciones: [
        'max-age aplica al navegador; s-maxage a las cachés compartidas como el CDN',
        'Son sinónimos con distinta sintaxis',
        'max-age es para HTML y s-maxage para imágenes',
        's-maxage es una versión obsoleta',
      ],
      correcta: 0,
      porQue: 'Poder darles valores distintos permite decirle al navegador "revalidá siempre" y al CDN "guardalo cinco minutos", que es lo que se necesita para contenido semi-dinámico.',
      porQueNo: {
        1: 'Aplican a cachés distintas y pueden tener valores distintos.',
        2: 'No distinguen por tipo de contenido sino por tipo de caché.',
        3: 'Es parte del estándar y está plenamente vigente.',
      },
    },
    {
      p: '¿Qué se cachea en Cloudflare por defecto?',
      opciones: [
        'Solo por extensión de archivo: imágenes, CSS, JS y fuentes. El HTML y las APIs no',
        'Absolutamente todo',
        'Solo el HTML',
        'Nada hasta que se configure',
      ],
      correcta: 0,
      porQue: 'Es un default razonable porque el HTML suele ser dinámico, pero significa que "puse Cloudflare" no equivale a "mi API está cacheada": eso requiere una regla explícita.',
      porQueNo: {
        1: 'Cachear HTML dinámico por defecto sería peligroso.',
        2: 'Es justo al revés: el HTML es lo que no se cachea por defecto.',
        3: 'Los assets estáticos sí se cachean sin configuración.',
      },
    },
    {
      p: '¿Cuál es la principal ventaja de R2 sobre S3?',
      opciones: [
        'No cobra egreso, y usa la misma API de S3',
        'Es más rápido para escribir',
        'Tiene mejor durabilidad',
        'Permite consultas SQL sobre los objetos',
      ],
      correcta: 0,
      porQue: 'Migrar es cambiar el endpoint del cliente S3, sin tocar auth, base de datos ni lógica. Es la optimización con mejor relación beneficio/esfuerzo si el costo está en archivos servidos al público.',
      porQueNo: {
        1: 'Las operaciones de escritura son relativamente más caras en R2.',
        2: 'Ambos ofrecen alta durabilidad.',
        3: 'Ninguno de los dos es una base de datos.',
      },
    },
    {
      p: 'Si R2 no cobra egreso, ¿dónde cobra?',
      opciones: [
        'En operaciones, y las de escritura son relativamente caras',
        'En el ancho de banda de subida',
        'En la cantidad de buckets',
        'No cobra nada',
      ],
      correcta: 0,
      porQue: '"Gratis" siempre significa "gratis en un eje". Para escribir poco y leer mucho sale muy bien; para escritura intensiva —logs, eventos— hay que hacer la cuenta.',
      porQueNo: {
        1: 'La entrada de datos es gratis en prácticamente todos los proveedores.',
        2: 'La cantidad de buckets no es un eje de facturación.',
        3: 'Se cobran el almacenamiento y las operaciones.',
      },
    },
    {
      p: '¿Cómo servís un archivo privado desde un bucket sin que pase por tu servidor?',
      opciones: [
        'El servidor verifica sesión y tenant, y devuelve una URL firmada de vida corta',
        'Haciendo el bucket público y ocultando la URL',
        'Descargando el archivo en el servidor y reenviándolo',
        'Con una contraseña en el nombre del archivo',
      ],
      correcta: 0,
      porQue: 'Así el archivo nunca pasa por tu infraestructura —no pagás ancho de banda ni ocupás un proceso— y la autorización sigue siendo tuya.',
      porQueNo: {
        1: 'Una URL pública es pública: ocultarla no es un control de acceso.',
        2: 'Funciona, pero pagás el ancho de banda y ocupás un proceso sirviendo bytes.',
        3: 'El nombre del archivo no es un mecanismo de autorización.',
      },
    },
    {
      p: '¿Qué costo silencioso tiene un bucket sin reglas de ciclo de vida?',
      opciones: [
        'Crece para siempre: subidas multiparte incompletas y versiones antiguas se acumulan',
        'Las descargas se vuelven más lentas',
        'Se pierde la durabilidad',
        'Aumenta el costo de egreso',
      ],
      correcta: 0,
      porQue: 'Las subidas multiparte incompletas son las más olvidadas: ocupan espacio y ni siquiera aparecen al listar el bucket. Con versionado activo, además, borrar un archivo no libera nada.',
      porQueNo: {
        1: 'La cantidad de objetos no afecta la velocidad de descarga.',
        2: 'La durabilidad la garantiza el proveedor independientemente.',
        3: 'En R2 el egreso es cero; el problema es el almacenamiento acumulado.',
      },
    },
    {
      p: '¿Cuándo usarías KV y cuándo un Durable Object?',
      opciones: [
        'KV para configuración y banderas; Durable Object para contadores y cualquier cosa que necesite exactitud',
        'KV para datos grandes; Durable Object para datos chicos',
        'Son intercambiables',
        'KV para escritura; Durable Object para lectura',
      ],
      correcta: 0,
      porQue: 'KV es de consistencia eventual: dos escrituras concurrentes se pisan. Un Durable Object existe una sola vez y procesa mensajes de a uno, así que la cuenta es exacta sin bloqueos.',
      porQueNo: {
        1: 'La diferencia es el modelo de consistencia, no el tamaño.',
        2: 'Resuelven problemas opuestos: eventual contra coordinado.',
        3: 'KV está optimizado para lectura, no para escritura.',
      },
    },
    {
      p: '¿D1 puede reemplazar a Postgres?',
      opciones: [
        'No en general: es SQLite, con un solo escritor, sin extensiones y sin RLS',
        'Sí, es Postgres distribuido',
        'Sí, si la base es menor a 1 GB',
        'Sí, salvo que uses transacciones',
      ],
      correcta: 0,
      porQue: 'Es excelente para datos que se leen mucho y se escriben poco —catálogos, configuración— con latencia bajísima. Para el corazón transaccional de un producto, Postgres.',
      porQueNo: {
        1: 'Es SQLite, no Postgres.',
        2: 'El tamaño no resuelve la falta de extensiones ni de RLS.',
        3: 'Soporta transacciones; lo que le falta es concurrencia de escritura y extensiones.',
      },
    },
    {
      p: '¿Qué restricción de Workers rompe más planes de migración?',
      opciones: [
        'No pueden abrir conexiones TCP arbitrarias, incluida la conexión normal a Postgres',
        'No soportan JavaScript moderno',
        'No permiten leer cabeceras HTTP',
        'Tienen un límite de 1 petición por segundo',
      ],
      correcta: 0,
      porQue: 'Hace falta un driver por HTTP o un intermediario tipo Hyperdrive. Si el plan era "muevo la API a Workers y sigue hablando con mi Postgres", hay un paso más del que parecía.',
      porQueNo: {
        1: 'Corren sobre V8 con soporte moderno completo.',
        2: 'Leer y modificar cabeceras es su caso de uso principal.',
        3: 'Escalan a volúmenes muy altos.',
      },
    },
    {
      p: '¿Qué combinación de Cloudflare rinde en un stack que ya usa Postgres?',
      opciones: [
        'CDN, R2 para archivos y Workers de middleware — dejando Postgres donde está',
        'Migrar todo: Workers, D1 y KV reemplazando el backend',
        'Solo el DNS',
        'Durable Objects para toda la lógica de negocio',
      ],
      correcta: 0,
      porQue: 'Es una adopción por piezas: CDN y R2 son ganancia casi neta, Workers aporta en middleware, y Postgres conserva RLS, pgvector y todo lo que ya funciona.',
      porQueNo: {
        1: 'D1 no reemplaza a Postgres, y sería asumir un riesgo grande por un beneficio que las dos primeras piezas ya dan.',
        2: 'Deja sobre la mesa el ahorro de egreso y la caché, que es lo más valioso.',
        3: 'Los Durable Objects son para coordinación puntual, no para toda la lógica.',
      },
    },
    {
      p: '¿Cuál es la medida de seguridad en el borde con mejor relación beneficio/esfuerzo?',
      opciones: [
        'Límite de peticiones en el login, por IP y también por cuenta',
        'Activar todas las reglas del WAF',
        'Bloquear todos los bots',
        'Exigir CAPTCHA en todas las páginas',
      ],
      correcta: 0,
      porQue: 'Un ataque con credenciales filtradas prueba miles de combinaciones por hora. Limitar lo vuelve inviable en cinco minutos de configuración. La dimensión "por cuenta" es la que casi nadie pone.',
      porQueNo: {
        1: 'Genera falsos positivos y requiere ajuste; no es lo primero.',
        2: 'Bloquearía también a los buscadores, con impacto en SEO.',
        3: 'Degrada muchísimo la experiencia para un beneficio marginal.',
      },
    },
    {
      p: 'Tenés CDN con WAF delante. ¿Qué agujero suele quedar abierto?',
      opciones: [
        'Que se descubra la IP real del origen y se saltee el CDN por completo',
        'Que el WAF no filtre inyección SQL',
        'Que el CDN no soporte HTTPS',
        'Que los bots pasen igual',
      ],
      correcta: 0,
      porQue: 'Toda la protección del borde queda de adorno. Se tapa con un firewall que solo acepte los rangos del CDN, un certificado de origen, o un túnel — que es la opción más fuerte.',
      porQueNo: {
        1: 'Las reglas gestionadas cubren inyección SQL como caso básico.',
        2: 'Todos los CDN modernos manejan HTTPS de forma nativa.',
        3: 'La gestión de bots es justamente una de las funciones del borde.',
      },
    },
    {
      p: '¿Qué NO resuelve la seguridad en el borde?',
      opciones: [
        'Un usuario legítimo accediendo a datos ajenos por falta de filtro de tenant',
        'Un ataque DDoS por volumen',
        'Fuerza bruta contra el login',
        'Raspado automatizado del sitio',
      ],
      correcta: 0,
      porQue: 'Eso pasa por el borde sin levantar ninguna alarma porque es tráfico legítimo. Confiar en el WAF en lugar de en RLS es cambiar una defensa real por una probabilística.',
      porQueNo: {
        1: 'Es exactamente lo que una red grande absorbe mejor que tu servidor.',
        2: 'El límite de peticiones lo frena de forma muy efectiva.',
        3: 'La gestión de bots está diseñada para eso.',
      },
    },
  ],
});
