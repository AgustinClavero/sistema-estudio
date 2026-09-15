/* ==========================================================================
   Infra · Módulo 07 — Cuánto cuesta realmente
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'infra',
  id: 'm07',
  titulo: 'Cuánto cuesta realmente',
  fuentes: ['supabase-precios', 'neon-precios', 'cloudflare-r2', 'cloudflare-workers',
            'aws-precios', 'anthropic-precios', 'postgres', 'pgbouncer'],

  intro:
    '<p>Este es <b>el módulo de la plata</b>. El que responde por qué una factura se dispara sin que haya subido ' +
    'el tráfico, y el que te da el criterio para elegir plataforma con números en vez de con impresiones.</p>' +
    '<p>Una advertencia honesta: <b>los precios cambian</b>. Lo que no cambia son los <i>ejes</i> de costo y la ' +
    'forma de razonarlos. Los números que vas a ver acá son órdenes de magnitud para comparar, no cotizaciones — ' +
    'siempre verificá contra la página del proveedor antes de decidir.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Los cinco ejes de costo',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> toda factura de nube se descompone en cinco cosas.
Si sabés cuáles son, podés predecir el costo de cualquier arquitectura antes de construirla.</div>

<h4>Los cinco ejes</h4>

<p><b>1 · Cómputo.</b> CPU y memoria mientras algo corre. Se cobra por hora encendido, o por tiempo de ejecución
en serverless.</p>

<p><b>2 · Almacenamiento.</b> Los gigabytes guardados. Suele ser lo <b>más barato</b> y lo que más preocupa a la
gente — al revés de lo que corresponde.</p>

<p><b>3 · Transferencia de datos.</b> Sobre todo <b>salida</b> (egreso). Es lo más caro por unidad y lo que
menos se anticipa. Tiene su propia lección.</p>

<p><b>4 · Operaciones.</b> Cantidad de peticiones, lecturas, escrituras, invocaciones. Individualmente valen
fracciones de centavo; multiplicadas por millones, no.</p>

<p><b>5 · Lo que no está en la factura.</b> Tu tiempo. Es el eje más caro de todos y el único que nadie mide.</p>

<div class="aviso"><strong>La regla que ordena todo:</strong> el costo casi nunca está donde uno cree.
La gente optimiza <b>almacenamiento</b> —que es barato— y se olvida del <b>egreso</b> y del <b>cómputo
ocioso</b>, que son los que realmente pesan. Antes de optimizar cualquier cosa, <b>mirá el desglose de la
factura</b> y ordená por importe.</div>

<h4>Modelos de precio</h4>
<table>
<tr><th>Modelo</th><th>Cómo</th><th>Conviene cuando</th></tr>
<tr><td><b>Fijo mensual</b></td><td>Pagás la máquina, la uses o no</td><td>Carga constante y previsible</td></tr>
<tr><td><b>Por uso</b></td><td>Pagás lo que consumís</td><td>Tráfico variable o bajo</td></tr>
<tr><td><b>Escalonado</b></td><td>Un plan con cupos incluidos y excedentes</td><td>El modelo de Supabase, Vercel y muchos más</td></tr>
<tr><td><b>Escala a cero</b></td><td>Sin tráfico, sin costo</td><td>Entornos de prueba, proyectos con picos</td></tr>
</table>

<p>El modelo <b>escalonado</b> tiene una trampa específica: los planes son baratos <i>dentro</i> del cupo y
los excedentes suelen ser caros. Un salto pequeño de uso puede duplicar la factura. Por eso importa saber
<b>cuál de tus métricas está más cerca de su límite</b>.</p>
`,

      tecnico: `
<h4>Cómputo: el detalle que más plata desperdicia</h4>
<p>Pagás por <b>capacidad reservada</b>, no por capacidad usada. Una instancia al 8% de CPU cuesta lo mismo que
una al 80%.</p>
<table>
<tr><th>Modelo</th><th>Se paga</th><th>Ocioso</th></tr>
<tr><td>VPS / VM</td><td>Por hora encendida</td><td><b>Se paga completo</b></td></tr>
<tr><td>Contenedor gestionado</td><td>Por instancia activa</td><td>Puede escalar a cero</td></tr>
<tr><td>Serverless por request</td><td>Por milisegundo de ejecución</td><td><b>Cero</b></td></tr>
<tr><td>Edge / Workers</td><td>Por invocación y CPU real</td><td>Cero</td></tr>
</table>

<div class="dato"><strong>El desperdicio silencioso más común son los entornos de staging.</strong> Una base
de staging encendida 24/7 cuesta igual que una de producción, y se usa unas pocas horas por semana. Apagarla
fuera de horario, o usar una plataforma que escale a cero, suele ser <b>el ahorro más grande y más fácil</b> de
cualquier infraestructura chica.</div>

<h4>Almacenamiento: barato, pero mirá el multiplicador</h4>
<p>Un gigabyte guardado cuesta centavos al mes. Lo que sorprende son los multiplicadores que nadie contó:</p>
<ul>
<li><b>Backups</b> — si guardás 30 días de respaldos diarios, podés estar pagando varias veces tus datos.</li>
<li><b>Réplicas</b> — cada réplica de lectura es otra copia completa.</li>
<li><b>Point-in-time recovery</b> — guarda el registro de cambios, y en bases con mucha escritura pesa bastante.</li>
<li><b>Versionado de objetos</b> — si está activo y no hay política de expiración, <b>nada se borra nunca</b>.</li>
</ul>
<p>Ese último es un clásico: un bucket con versionado y sin regla de ciclo de vida crece para siempre, incluso
si borrás archivos.</p>

<h4>Operaciones: cuando lo pequeño se acumula</h4>
<p>Una operación de escritura en almacenamiento de objetos cuesta del orden de 0,000005 USD. Irrelevante —
hasta que un proceso hace diez millones por día.</p>
<p>Los casos que se descubren tarde:</p>
<ul>
<li>Un cron que se ejecuta cada minuto en vez de cada hora: <b>60 veces más invocaciones</b>.</li>
<li>Polling desde el cliente cada 5 segundos con mil usuarios: 17 millones de peticiones al día.</li>
<li>Una consulta N+1 que convierte una petición en doscientas.</li>
<li>Reintentos sin backoff que multiplican el tráfico justo cuando el sistema está en problemas.</li>
</ul>

<h4>El eje que no está en la factura</h4>
<p>Si una plataforma te cuesta 200 USD/mes menos pero te consume dos días de trabajo al mes, ' +
<b>no es más barata</b>. Y ese cálculo casi nunca se hace explícito.</p>
<p>Por eso una plataforma gestionada más cara puede ser la decisión económicamente correcta en un equipo chico,
y una autoadministrada puede ser correcta en un equipo con alguien dedicado a infraestructura. <b>La respuesta
depende de cuánto vale tu hora, no solo del precio de lista.</b></p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS CINCO EJES — y dónde está el costo de verdad</text>

  <rect x="24" y="36" width="632" height="34" rx="7" fill="#fbbf24" fill-opacity=".28" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="58" fill="#fbbf24" font-size="11.5" font-weight="700">1 · CÓMPUTO</text>
  <text x="180" y="58" fill="currentColor" opacity=".75" font-size="10.5">se paga la capacidad RESERVADA, no la usada — el ocioso cuesta igual</text>

  <rect x="24" y="76" width="632" height="34" rx="7" fill="#34d399" fill-opacity=".18" stroke="#34d399" stroke-width="1.2"/>
  <text x="44" y="98" fill="#34d399" font-size="11.5" font-weight="700">2 · ALMACENAMIENTO</text>
  <text x="180" y="98" fill="currentColor" opacity=".75" font-size="10.5">barato… salvo por backups, réplicas y versionado sin expiración</text>

  <rect x="24" y="116" width="632" height="38" rx="7" fill="#f87171" fill-opacity=".3" stroke="#f87171" stroke-width="1.8"/>
  <text x="44" y="140" fill="#f87171" font-size="12" font-weight="700">3 · TRANSFERENCIA (egreso)</text>
  <text x="230" y="132" fill="currentColor" opacity=".8" font-size="10.5">lo más caro por unidad</text>
  <text x="230" y="147" fill="#f87171" font-size="10.5" font-weight="700">y lo que menos se anticipa — tiene su propia lección</text>

  <rect x="24" y="160" width="632" height="34" rx="7" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="44" y="182" fill="#22d3ee" font-size="11.5" font-weight="700">4 · OPERACIONES</text>
  <text x="180" y="182" fill="currentColor" opacity=".75" font-size="10.5">fracciones de centavo × millones = una cifra real</text>

  <rect x="24" y="200" width="632" height="38" rx="7" fill="#7c5cff" fill-opacity=".22" stroke="#7c5cff" stroke-width="1.6"/>
  <text x="44" y="224" fill="#7c5cff" font-size="12" font-weight="700">5 · TU TIEMPO</text>
  <text x="180" y="216" fill="currentColor" opacity=".8" font-size="10.5">el eje más caro de todos</text>
  <text x="180" y="231" fill="#7c5cff" font-size="10.5" font-weight="700">y el único que no aparece en ninguna factura</text>

  <line x1="24" y1="256" x2="656" y2="256" stroke="currentColor" opacity=".18"/>

  <text x="24" y="280" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    DÓNDE MIRA LA GENTE vs DÓNDE ESTÁ EL COSTO</text>

  <rect x="24" y="292" width="304" height="94" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="314" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">DONDE MIRA LA GENTE</text>
  <rect x="44" y="326" width="180" height="16" rx="3" fill="#34d399" fill-opacity=".5"/>
  <text x="234" y="338" fill="currentColor" opacity=".6" font-size="9.5">almacenamiento</text>
  <rect x="44" y="348" width="60" height="16" rx="3" fill="#fbbf24" fill-opacity=".4"/>
  <text x="114" y="360" fill="currentColor" opacity=".5" font-size="9.5">cómputo</text>
  <text x="176" y="378" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10">optimiza lo barato</text>

  <rect x="352" y="292" width="304" height="94" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.3"/>
  <text x="504" y="314" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">DONDE ESTÁ EL COSTO</text>
  <rect x="372" y="326" width="200" height="16" rx="3" fill="#f87171" fill-opacity=".7"/>
  <text x="582" y="338" fill="#f87171" font-size="9.5" font-weight="700">egreso</text>
  <rect x="372" y="348" width="150" height="16" rx="3" fill="#fbbf24" fill-opacity=".65"/>
  <text x="532" y="360" fill="#fbbf24" font-size="9.5" font-weight="700">cómputo ocioso</text>
  <text x="504" y="378" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">mirá el desglose y ordená por importe</text>
</svg>`,
        pie: 'Antes de optimizar cualquier cosa: abrí la factura y ordená por importe. Casi nunca es lo que pensabas.',
      },

      entrevista: [
        { p: '¿En qué se descompone el costo de una infraestructura en la nube?',
          r: 'En cinco ejes: <b>cómputo</b> —que se paga por capacidad reservada, así que el ocioso cuesta igual—, <b>almacenamiento</b>, ' +
             '<b>transferencia de datos</b>, sobre todo la de salida, <b>operaciones</b> —peticiones, lecturas, escrituras— y ' +
             '<b>el tiempo del equipo</b>, que es el eje más caro y el único que no aparece en la factura. ' +
             'Lo importante es que el costo casi nunca está donde uno cree: la gente optimiza almacenamiento, que es barato, y se olvida ' +
             'del egreso y del cómputo ocioso. <b>Antes de optimizar, hay que mirar el desglose y ordenar por importe.</b>' },

        { p: '¿Cuál es el desperdicio más común en una infraestructura chica?',
          r: 'Los <b>entornos que no escalan a cero</b>. Una base de staging encendida las 24 horas cuesta casi lo mismo que una de producción ' +
             'y se usa unas pocas horas por semana. Apagarla fuera de horario, o elegir una plataforma que escale a cero, suele ser ' +
             'el ahorro más grande y más fácil de conseguir. El segundo es el <b>versionado de objetos sin política de expiración</b>: ' +
             'un bucket que crece para siempre incluso cuando borrás archivos.' },

        { p: '¿Cómo comparás dos plataformas si una es más barata pero requiere más trabajo?',
          r: 'Poniendo el tiempo en la ecuación explícitamente. Si una opción cuesta 200 dólares menos al mes pero consume dos días de trabajo ' +
             'mensuales, <b>no es más barata</b> — depende de cuánto vale esa hora. Por eso una plataforma gestionada más cara puede ser la decisión ' +
             'económicamente correcta en un equipo chico, y una autoadministrada puede serlo en un equipo con alguien dedicado a infraestructura. ' +
             '<b>El precio de lista es solo uno de los cinco ejes.</b>' },
      ],

      practica: `
<h4>Estimar antes de construir</h4>
<pre><code>Aplicación web con 10.000 usuarios activos por mes:

CÓMPUTO
  1 instancia siempre encendida            ~20-40 USD
  (o serverless con este volumen:          ~5-15 USD)

ALMACENAMIENTO
  Base 10 GB                               ~2-5 USD
  Archivos 50 GB                           ~1-2 USD

TRANSFERENCIA
  200 GB de salida                         ~0 a 18 USD  ← según proveedor
                                                          y acá está la diferencia

OPERACIONES
  5M de peticiones                         ~1-5 USD

TOTAL                                      ~30 a 70 USD/mes</code></pre>

<div class="aviso"><strong>Fijate el rango de la transferencia: de 0 a 18 dólares por lo mismo.</strong> Esa
línea es la que más varía entre proveedores y la que decide la comparación cuando el volumen crece. Con 2 TB
en vez de 200 GB, esa línea pasa de "un detalle" a "el ítem más grande de la factura".</div>

<h4>Encontrar el desperdicio, en orden</h4>
<table>
<tr><th>#</th><th>Buscá</th><th>Ahorro típico</th></tr>
<tr><td>1</td><td>Entornos de staging encendidos 24/7</td><td>30-50% del total en proyectos chicos</td></tr>
<tr><td>2</td><td>Instancias sobredimensionadas (CPU al 5%)</td><td>40-60% de esa línea</td></tr>
<tr><td>3</td><td>Egreso que podría ir por CDN</td><td>Hasta el 90% de esa línea</td></tr>
<tr><td>4</td><td>Backups y snapshots sin política de retención</td><td>Variable, a veces enorme</td></tr>
<tr><td>5</td><td>Crons demasiado frecuentes</td><td>Proporcional a la reducción</td></tr>
<tr><td>6</td><td>Recursos huérfanos: discos, IPs, balanceadores sin usar</td><td>Sorprendentemente alto</td></tr>
</table>

<p>El punto 6 se subestima siempre: discos de instancias que borraste, IPs reservadas que nadie usa,
balanceadores de un experimento. <b>Facturan igual y nadie los mira.</b></p>

<h4>Instrumentar el costo desde el día uno</h4>
<pre><code>-- Etiquetar TODO por proyecto y entorno hace que el desglose sea legible
-- AWS: tags · GCP: labels · Supabase: un proyecto por entorno

-- Y en tu aplicación, lo que ya viste en el track de IA:
select feature, sum(costo_usd) usd
from ai_requests
where created_at &gt; now() - interval '30 days'
group by 1 order by usd desc;</code></pre>
<p>Sin etiquetas, la factura es un número global y no podés atribuir nada. <b>Etiquetar es gratis y hay que
hacerlo antes de necesitarlo</b>, porque no se puede aplicar hacia atrás.</p>
`,

      errores: [
        { mito: 'El almacenamiento es lo que más cuesta.',
          realidad: 'Suele ser lo <b>más barato</b>. Los que pesan son el <b>egreso</b> y el <b>cómputo ocioso</b>. ' +
                    'Optimizar almacenamiento primero es el error de priorización más común, y da resultados casi imperceptibles.' },

        { mito: 'Pago solo por lo que uso.',
          realidad: 'Depende del modelo. En una VM o un VPS pagás <b>capacidad reservada</b>: una instancia al 8% de CPU cuesta igual que una al 80%. ' +
                    'Solo el serverless real y las plataformas que escalan a cero cobran por uso efectivo.' },

        { mito: 'Un plan con cupo generoso me cubre.',
          realidad: 'Los planes escalonados son baratos <b>dentro</b> del cupo y los excedentes suelen ser caros. Un salto pequeño de uso puede ' +
                    'duplicar la factura. Hay que saber <b>cuál de tus métricas está más cerca de su límite</b>, no solo cuánto pagás hoy.' },

        { mito: 'La opción más barata es la mejor.',
          realidad: 'Falta el quinto eje: <b>tu tiempo</b>. Doscientos dólares menos al mes que cuestan dos días de trabajo mensuales ' +
                    'no son un ahorro. Es el eje que nunca aparece en la comparación y muchas veces el que decide.' },
      ],

      glosario: [
        { t: 'Egreso', d: 'Transferencia de datos hacia afuera del proveedor. El ítem más caro por unidad.' },
        { t: 'Capacidad reservada', d: 'Recursos que pagás estén o no en uso.' },
        { t: 'Escala a cero', d: 'Reducir a cero instancias sin tráfico, y por lo tanto a cero costo.' },
        { t: 'Plan escalonado', d: 'Cupos incluidos más excedentes. Barato dentro del cupo, caro fuera.' },
        { t: 'Recurso huérfano', d: 'Disco, IP o balanceador que quedó sin usar y sigue facturando.' },
        { t: 'Point-in-time recovery', d: 'Poder restaurar a cualquier momento. Guarda el registro de cambios y ocupa espacio.' },
        { t: 'Etiquetado (tags)', d: 'Marcar recursos por proyecto y entorno para poder atribuir el costo. No se puede aplicar hacia atrás.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'El egreso: el costo que nadie ve venir',
      minutos: 8,
      fuentes: ['cloudflare-r2', 'aws-precios', 'web-dev-cache'],

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> subir datos a la nube es gratis. <b>Bajarlos
cuesta</b>. Y esa asimetría no es un detalle técnico: es un modelo de negocio.</div>

<h4>Qué es el egreso</h4>
<p>Es la transferencia de datos <b>desde</b> el proveedor <b>hacia</b> internet. Cada imagen que sirve tu
aplicación, cada respuesta de API, cada archivo descargado, cada backup que te llevás.</p>

<p>Los órdenes de magnitud, para tener una referencia:</p>
<table>
<tr><th>Proveedor</th><th>Egreso a internet</th></tr>
<tr><td>AWS, GCP, Azure</td><td>~0,08 – 0,12 USD por GB</td></tr>
<tr><td>DigitalOcean, Hetzner</td><td>Cupo incluido generoso, después algunos centavos por GB</td></tr>
<tr><td><b>Cloudflare R2</b></td><td><b>0</b></td></tr>
<tr><td>Backblaze B2</td><td>0 hacia varios CDN aliados</td></tr>
</table>

<p>Diez centavos por gigabyte suena a nada. Pero:</p>
<ul>
<li>1 TB de salida al mes → ~90 USD</li>
<li>10 TB → ~900 USD</li>
<li>100 TB → ~9.000 USD</li>
</ul>
<p>Un sitio con video o imágenes pesadas llega a esos números <b>sin ser un producto grande</b>.</p>

<div class="aviso"><strong>Por qué existe esta asimetría:</strong> es el mecanismo de retención. Meter datos es
gratis y sacarlos cuesta, así que cuanto más grande es tu volumen, <b>más caro es irte</b>. Se lo llama
<i>data gravity</i>, y es una decisión de negocio deliberada, no una limitación técnica. Reconocerlo es el
primer paso para no quedar atrapado.</div>

<h4>Las tres formas de bajarlo</h4>

<p><b>1 · Un CDN adelante.</b> El CDN sirve desde su caché y solo consulta a tu origen cuando no lo tiene.
Con buena tasa de acierto, el egreso desde tu servidor baja <b>un 90% o más</b>. Es la medida más efectiva y
la más simple.</p>

<p><b>2 · Almacenamiento sin cargo de egreso.</b> Cloudflare R2 tiene la misma API que S3 y <b>no cobra
egreso</b>. Para archivos servidos al público, la diferencia es enorme.</p>

<p><b>3 · No mover los datos.</b> Procesar donde están en vez de traerlos. Si tu base está en una región y tu
worker en otra, estás pagando egreso <b>entre tus propios servicios</b>.</p>
`,

      tecnico: `
<h4>Los egresos que no se ven venir</h4>
<table>
<tr><th>Origen</th><th>Por qué sorprende</th></tr>
<tr><td><b>Entre regiones</b></td><td>Tu base en una región y la app en otra: pagás cada consulta</td></tr>
<tr><td><b>Entre zonas</b></td><td>Dentro de la misma región, cruzar zonas también factura</td></tr>
<tr><td><b>Entre nubes</b></td><td>Base en un proveedor y cómputo en otro: el peor de todos</td></tr>
<tr><td><b>Backups hacia afuera</b></td><td>Un respaldo diario de una base grande es egreso diario</td></tr>
<tr><td><b>Réplicas cruzadas</b></td><td>Replicar a otra región es egreso continuo</td></tr>
<tr><td><b>Logs y métricas a un tercero</b></td><td>Volumen alto y sostenido, fácil de subestimar</td></tr>
<tr><td><b>Descarga de imágenes de contenedor</b></td><td>Un registro en otra región y muchos despliegues suman</td></tr>
</table>

<div class="dato"><strong>El caso que más plata desperdicia en arquitecturas modernas:</strong> tener la base
de datos en un proveedor y el cómputo en otro. Cada consulta cruza internet: pagás egreso <b>y</b> latencia,
en cada petición. Es un patrón muy común cuando se combinan servicios "porque cada uno es el mejor en lo suyo".
<b>Antes de mezclar proveedores, verificá dónde vive cada pieza y cuántos datos cruzan entre ellas.</b></div>

<h4>El CDN, en números</h4>
<pre><code>Sitio con 2 TB de salida al mes, sin CDN:
  2.000 GB × 0,09 USD  =  180 USD/mes

Con CDN y 92% de aciertos:
  origen:  160 GB × 0,09  =  14 USD
  CDN:     2.000 GB × ~0,01 = 20 USD (o incluido en varios planes)
                              ─────
                              ~34 USD/mes</code></pre>
<p>De 180 a 34 dólares por poner un CDN adelante. Y además el sitio queda más rápido, porque se sirve desde
un punto cercano al usuario.</p>

<h4>Cómo subir la tasa de aciertos del CDN</h4>
<ul>
<li><b>Nombres con hash</b> para los assets: <code>app.a3f2.js</code> se puede cachear un año con <code>immutable</code>.</li>
<li><b>Cabeceras correctas</b>: si no mandás <code>Cache-Control</code>, muchos CDN no cachean nada.</li>
<li><b>Sin cookies en los assets</b>: una cookie en la respuesta hace que el CDN la considere personalizada y no la cachee.</li>
<li><b><code>stale-while-revalidate</code></b> para contenido semi-dinámico: se sirve de caché mientras se revalida.</li>
<li><b>Cuidado con las URLs con parámetros</b>: cada variante es una entrada distinta en la caché y baja la tasa de aciertos.</li>
</ul>

<h4>Ojo con "egreso gratis"</h4>
<p>Cloudflare R2 no cobra egreso, pero sí cobra <b>operaciones</b>: las escrituras son bastante más caras que
las lecturas. Para un patrón de "escribir poco, leer mucho" —que es el caso de archivos servidos al público—
sale muy bien. Para uno de escritura intensiva, hay que hacer la cuenta. <b>"Gratis" siempre significa "gratis
en un eje", y hay que mirar los otros.</b></p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="eg1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA ASIMETRÍA — y por qué existe</text>

  <rect x="150" y="38" width="380" height="76" rx="11" fill="currentColor" fill-opacity=".05" stroke="currentColor" stroke-opacity=".28" stroke-width="1.3"/>
  <text x="340" y="60" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11" font-weight="700">tu proveedor de nube</text>

  <line x1="60" y1="72" x2="146" y2="72" stroke="#34d399" stroke-width="2.4" marker-end="url(#eg1)" color="#34d399"/>
  <text x="103" y="64" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">entrada</text>
  <text x="103" y="88" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">GRATIS</text>

  <line x1="534" y1="96" x2="620" y2="96" stroke="#f87171" stroke-width="2.4" marker-end="url(#eg1)" color="#f87171"/>
  <text x="577" y="88" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">salida</text>
  <text x="577" y="112" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">~0,09 USD/GB</text>

  <text x="340" y="134" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">
    “data gravity”: cuanto más grande tu volumen, más caro irte. Es deliberado.</text>

  <line x1="24" y1="154" x2="656" y2="154" stroke="currentColor" opacity=".18"/>

  <text x="24" y="178" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    2 TB DE SALIDA AL MES</text>

  <rect x="24" y="190" width="304" height="86" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="176" y="212" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">SIN CDN</text>
  <rect x="44" y="224" width="264" height="22" rx="4" fill="#f87171" fill-opacity=".65"/>
  <text x="176" y="240" text-anchor="middle" fill="#3b0a0a" font-size="10" font-weight="700">2.000 GB desde tu origen</text>
  <text x="176" y="266" text-anchor="middle" fill="#f87171" font-size="14" font-weight="700">180 USD/mes</text>

  <rect x="352" y="190" width="304" height="86" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="212" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">CON CDN  ·  92% de aciertos</text>
  <rect x="372" y="224" width="22" height="22" rx="4" fill="#f87171" fill-opacity=".65"/>
  <rect x="398" y="224" width="238" height="22" rx="4" fill="#34d399" fill-opacity=".55"/>
  <text x="383" y="240" text-anchor="middle" fill="#3b0a0a" font-size="8" font-weight="700">160</text>
  <text x="517" y="240" text-anchor="middle" fill="#06281c" font-size="10" font-weight="700">servido desde la caché del CDN</text>
  <text x="504" y="266" text-anchor="middle" fill="#34d399" font-size="14" font-weight="700">~34 USD/mes</text>

  <text x="340" y="296" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10.5">
    …y además el sitio queda más rápido, porque se sirve desde un punto cercano al usuario.</text>

  <text x="24" y="326" fill="#f87171" font-size="11.5" font-weight="700">
    LOS EGRESOS QUE NO SE VEN VENIR</text>

  <rect x="24" y="338" width="200" height="50" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="124" y="357" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">entre regiones</text>
  <text x="124" y="374" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">base acá, app allá</text>

  <rect x="240" y="338" width="200" height="50" rx="9" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="357" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">ENTRE NUBES</text>
  <text x="340" y="374" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">el peor: egreso + latencia</text>

  <rect x="456" y="338" width="200" height="50" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="556" y="357" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">backups y réplicas</text>
  <text x="556" y="374" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">egreso diario o continuo</text>
</svg>`,
        pie: 'Subir es gratis, bajar cuesta. No es una limitación técnica: es un mecanismo de retención.',
      },

      entrevista: [
        { p: '¿Qué es el egreso y por qué importa tanto?',
          r: 'Es la transferencia de datos <b>desde</b> el proveedor hacia internet, y es el ítem más caro por unidad: en las nubes grandes ronda ' +
             'los 0,09 dólares por gigabyte. Suena a nada hasta que lo multiplicás: un terabyte al mes son unos 90 dólares, diez terabytes son 900. ' +
             'Un sitio con imágenes pesadas o video llega ahí sin ser un producto grande. Y la asimetría —entrada gratis, salida cara— ' +
             'no es técnica: es un <b>mecanismo de retención</b>, porque cuanto más grande es tu volumen, más caro es irte. Se lo llama <i>data gravity</i>.' },

        { p: '¿Cómo bajarías el costo de egreso de un sitio?',
          r: 'Lo primero y más efectivo es <b>un CDN adelante</b>: sirve desde su caché y solo consulta al origen cuando no lo tiene. ' +
             'Con una tasa de aciertos del 90% o más, el egreso desde tu servidor cae en esa proporción, y de paso el sitio queda más rápido. ' +
             'Segundo, usar <b>almacenamiento sin cargo de egreso</b> como Cloudflare R2, que tiene API compatible con S3. ' +
             'Y tercero, <b>no mover los datos</b>: si la base está en una región y el worker en otra, estás pagando egreso entre tus propios ' +
             'servicios sin ganar nada.' },

        { p: '¿Cuál es el error de arquitectura que más egreso genera?',
          r: 'Tener la <b>base de datos en un proveedor y el cómputo en otro</b>. Cada consulta cruza internet, así que pagás egreso <i>y</i> ' +
             'latencia en cada petición. Es un patrón muy común cuando se combinan servicios "porque cada uno es el mejor en lo suyo", ' +
             'y el costo aparece meses después. La versión más leve del mismo problema es cruzar regiones o zonas dentro del mismo proveedor, ' +
             'que también factura. <b>Antes de mezclar proveedores conviene verificar cuántos datos cruzan entre las piezas.</b>' },

        { p: 'Un proveedor ofrece "egreso gratis". ¿Qué verificás?',
          r: 'En qué eje cobra en cambio. Cloudflare R2 no cobra egreso pero sí <b>operaciones</b>, y las escrituras son bastante más caras que ' +
             'las lecturas. Para un patrón de escribir poco y leer mucho —archivos servidos al público— sale muy bien; para escritura intensiva ' +
             'hay que hacer la cuenta. <b>"Gratis" siempre significa "gratis en un eje"</b>, así que reviso los otros cuatro antes de decidir.' },
      ],

      practica: `
<h4>Medir tu egreso antes de optimizar</h4>
<pre><code># En la consola del proveedor, buscá el desglose por servicio.
# Preguntas concretas:
#   · ¿Cuántos GB de salida al mes?
#   · ¿Qué proporción son assets estáticos?     ← esos van a un CDN
#   · ¿Hay tráfico entre regiones o entre nubes? ← eso es arquitectura
#   · ¿Los backups salen del proveedor?</code></pre>

<div class="aviso"><strong>Si la mayor parte de tu egreso son imágenes, CSS y JavaScript, la solución es un
CDN y es cuestión de horas.</strong> Si es tráfico de API o entre servicios, el problema es de arquitectura y
lleva más trabajo. <b>Hacer esa distinción primero te evita optimizar la línea equivocada.</b></div>

<h4>Cabeceras que suben la tasa de aciertos</h4>
<pre><code># assets con hash en el nombre → cachear un año
Cache-Control: public, max-age=31536000, immutable

# HTML → revalidar, pero permitir 304
Cache-Control: public, max-age=0, must-revalidate

# API semi-estática → el CDN absorbe casi todo
Cache-Control: public, s-maxage=60, stale-while-revalidate=300</code></pre>

<p>Y tres cosas que <b>rompen</b> la caché sin que te des cuenta:</p>
<ul>
<li><b>Cookies en la respuesta de un asset.</b> El CDN la considera personalizada y no la cachea.</li>
<li><b>URLs con parámetros variables.</b> Cada variante es una entrada distinta.</li>
<li><b>Ausencia de <code>Cache-Control</code>.</b> Muchos CDN, ante la duda, no cachean.</li>
</ul>

<h4>Migrar archivos a almacenamiento sin egreso</h4>
<pre><code>// R2 usa la API de S3: el cambio es de configuración, no de código
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: \`https://\${CUENTA}.r2.cloudflarestorage.com\`,
  credentials: { accessKeyId: R2_KEY, secretAccessKey: R2_SECRET },
});
// el resto del código de subida y descarga queda igual</code></pre>

<h4>Regla rápida de decisión</h4>
<table>
<tr><th>Si tu egreso mensual es…</th><th>Prioridad</th></tr>
<tr><td>Menos de 100 GB</td><td>No te preocupes. Optimizá otra cosa</td></tr>
<tr><td>100 GB – 1 TB</td><td>Poné un CDN. Es una tarde de trabajo</td></tr>
<tr><td>1 – 10 TB</td><td>CDN <b>y</b> evaluá almacenamiento sin cargo de egreso</td></tr>
<tr><td>Más de 10 TB</td><td>Es un ítem de arquitectura: revisá dónde vive cada dato</td></tr>
</table>
`,

      errores: [
        { mito: 'La transferencia de datos es un costo menor.',
          realidad: 'Es <b>el más caro por unidad</b> y el que menos se anticipa. Un terabyte mensual son unos 90 dólares en las nubes grandes, ' +
                    'y un sitio con imágenes pesadas llega ahí sin ser grande. Es habitual que sea el ítem principal de la factura.' },

        { mito: 'Puedo mezclar proveedores eligiendo el mejor de cada categoría.',
          realidad: 'Podés, pero <b>los datos que cruzan entre ellos se pagan</b> — y además suman latencia en cada petición. ' +
                    'Base en un proveedor y cómputo en otro es el patrón que más egreso genera, y el costo aparece meses después.' },

        { mito: 'Puse un CDN, así que ya está resuelto.',
          realidad: 'Hay que <b>medir la tasa de aciertos</b>. Una cookie en la respuesta de un asset, URLs con parámetros variables o la falta de ' +
                    '<code>Cache-Control</code> hacen que el CDN no cachee casi nada — y estás pagando el CDN <b>y</b> el egreso completo.' },

        { mito: '"Egreso gratis" significa que no pago nada.',
          realidad: 'Significa gratis <b>en ese eje</b>. R2 cobra operaciones, y las escrituras son bastante más caras que las lecturas. ' +
                    'Para leer mucho y escribir poco sale muy bien; para escritura intensiva hay que hacer la cuenta completa.' },
      ],

      glosario: [
        { t: 'Egreso', d: 'Datos que salen del proveedor hacia internet. El ítem más caro por unidad.' },
        { t: 'Ingreso', d: 'Datos que entran. Gratis en prácticamente todos los proveedores.' },
        { t: 'Data gravity', d: 'Efecto por el cual mover datos grandes es caro, lo que dificulta cambiar de proveedor.' },
        { t: 'CDN', d: 'Red de servidores que cachea y sirve contenido desde un punto cercano al usuario.' },
        { t: 'Tasa de aciertos', d: 'Proporción de peticiones servidas desde la caché del CDN sin ir al origen.' },
        { t: 'Cross-region', d: 'Tráfico entre regiones del mismo proveedor. Se factura.' },
        { t: 'R2', d: 'Almacenamiento de objetos de Cloudflare, compatible con S3 y sin cargo de egreso.' },
        { t: 'Origen', d: 'El servidor real detrás del CDN, al que se consulta cuando no hay caché.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Comparativa: Supabase, Neon, Cloudflare, AWS y VPS',
      minutos: 10,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> no hay una plataforma "más barata". Hay
plataformas que cobran distinto, y la más barata para vos depende de <b>en qué eje consumís más</b>.</div>

<div class="aviso"><strong>Antes de los números:</strong> los precios cambian y varían por región y por plan.
Lo que sigue son <b>órdenes de magnitud para razonar</b>, no cotizaciones. Verificá siempre contra la página
del proveedor antes de decidir.</div>

<h4>Qué es cada uno</h4>

<p><b>Supabase</b> — Postgres gestionado <i>más</i> autenticación, almacenamiento, tiempo real y funciones edge.
No es solo una base: es una plataforma. Lo que pagás incluye piezas que de otro modo tendrías que construir.</p>

<p><b>Neon</b> — Postgres serverless. Separa cómputo y almacenamiento, <b>escala a cero</b> y tiene
<i>branching</i> de base de datos: una copia instantánea para cada rama de código.</p>

<p><b>Cloudflare</b> — no es una base: es una plataforma edge. Workers para cómputo, D1 (SQLite) para datos
chicos, R2 para archivos <b>sin cargo de egreso</b>, KV para caché.</p>

<p><b>AWS</b> — todo, configurable, complejo. RDS para Postgres, S3 para archivos. Más control y más trabajo.</p>

<p><b>VPS</b> (Hetzner, DigitalOcean) — una máquina. Vos instalás y administrás todo. Lo más barato en dinero
y lo más caro en tiempo.</p>

<h4>Órdenes de magnitud para un proyecto chico</h4>
<table>
<tr><th>Opción</th><th>Costo mensual aprox.</th><th>Qué incluye</th></tr>
<tr><td><b>VPS</b> (4 GB)</td><td>~5 – 20 USD</td><td>La máquina. Todo lo demás lo hacés vos</td></tr>
<tr><td><b>Neon</b></td><td>0 – 25 USD</td><td>Solo Postgres. Escala a cero</td></tr>
<tr><td><b>Supabase</b></td><td>0 – 25 USD</td><td>Postgres + auth + storage + realtime + edge</td></tr>
<tr><td><b>Cloudflare</b></td><td>~5 USD</td><td>Workers + D1 + R2. Sin egreso</td></tr>
<tr><td><b>AWS</b></td><td>~30 – 80 USD</td><td>RDS + S3 + cómputo, configurado a mano</td></tr>
</table>

<p>En un proyecto chico están todos cerca. <b>La diferencia aparece al crecer</b>, y aparece en ejes distintos
para cada uno.</p>
`,

      tecnico: `
<h4>Dónde te cobra cada uno cuando crecés</h4>
<table>
<tr><th>Plataforma</th><th>El eje que se dispara</th><th>Umbral típico donde duele</th></tr>
<tr><td><b>Supabase</b></td><td>Tamaño de la base y cómputo del plan</td><td>Al pasar de plan, y con muchas conexiones concurrentes</td></tr>
<tr><td><b>Neon</b></td><td>Horas de cómputo activo</td><td>Si nunca escala a cero, pierde su ventaja</td></tr>
<tr><td><b>Cloudflare</b></td><td>Operaciones y límites de D1</td><td>D1 no es para cargas grandes ni consultas complejas</td></tr>
<tr><td><b>AWS</b></td><td>Egreso e instancias sobredimensionadas</td><td>Casi siempre, y suele descubrirse tarde</td></tr>
<tr><td><b>VPS</b></td><td>Tu tiempo</td><td>Desde el primer incidente a las 3 de la mañana</td></tr>
</table>

<div class="dato"><strong>Sobre Supabase específicamente, que es el caso concreto de este workspace:</strong>
lo que pagás no es solo Postgres. Incluye <b>auth</b> —con proveedores OAuth, recuperación de contraseña,
sesiones—, <b>storage</b> con políticas por fila, <b>realtime</b>, <b>edge functions</b> y <b>RLS</b> bien
integrado. Si migrás solo la base a algo más barato, <b>tenés que reconstruir todo lo demás</b>. Auth propio
son semanas de trabajo y una superficie de seguridad que no querés mantener. <b>La comparación honesta no es
"Postgres contra Postgres": es la plataforma completa contra la suma de sus reemplazos.</b></div>

<h4>Qué tendrías que reemplazar al salir de Supabase</h4>
<table>
<tr><th>Pieza</th><th>Alternativa</th><th>Costo real de migrar</th></tr>
<tr><td>Postgres</td><td>Neon, RDS, VPS</td><td>Bajo: es Postgres estándar</td></tr>
<tr><td><b>Auth</b></td><td>Clerk, Auth0, Better Auth, propio</td><td><b>Alto.</b> Semanas + riesgo de seguridad</td></tr>
<tr><td>Storage + políticas</td><td>S3/R2 + tu propia autorización</td><td>Medio-alto: las policies por fila hay que rehacerlas</td></tr>
<tr><td>Realtime</td><td>Pusher, Ably, WebSockets propios</td><td>Medio</td></tr>
<tr><td>Edge functions</td><td>Vercel, Cloudflare Workers</td><td>Bajo</td></tr>
<tr><td>RLS</td><td>Se conserva: es de Postgres</td><td>Ninguno</td></tr>
</table>

<h4>Combinaciones que funcionan bien</h4>
<ul>
<li><b>Supabase + Cloudflare R2 para archivos pesados.</b> Te quedás con auth, realtime y RLS, y sacás el egreso de imágenes y videos —que suele ser el ítem que más crece— a un almacenamiento sin cargo de salida. <b>Es la optimización de mejor relación beneficio/esfuerzo</b> si tu costo está en archivos.</li>
<li><b>Neon + Clerk + Vercel.</b> Cada pieza escala a cero. Muy barato con tráfico bajo, y con branching de base por rama.</li>
<li><b>VPS con Docker Compose + R2.</b> Lo más barato en dinero si tenés el tiempo. Postgres, tu app y un proxy en una máquina.</li>
<li><b>Cloudflare completo.</b> Workers + D1 + R2. Excelente para cargas livianas de lectura intensiva; <b>D1 no reemplaza a Postgres</b> en consultas complejas.</li>
</ul>

<h4>El costo de cambiar</h4>
<p>Antes de migrar, hacé esta cuenta:</p>
<pre><code>ahorro_mensual × 12  vs  horas_de_migración × tu_tarifa
                          + riesgo de romper algo
                          + tiempo de aprender la plataforma nueva</code></pre>
<p>Si ahorrás 30 dólares al mes y la migración lleva 40 horas, el punto de equilibrio está <b>a más de diez
años</b>. Si ahorrás 800 al mes, se paga en semanas. <b>La cuenta define la decisión, no la preferencia.</b></p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    DÓNDE TE COBRA CADA UNO CUANDO CRECÉS</text>

  <rect x="24" y="34" width="632" height="32" rx="7" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.3"/>
  <text x="44" y="55" fill="#34d399" font-size="11" font-weight="700">SUPABASE</text>
  <text x="160" y="55" fill="currentColor" opacity=".75" font-size="10">tamaño de base + cómputo del plan · pero incluye auth, storage, realtime, RLS</text>

  <rect x="24" y="72" width="632" height="32" rx="7" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="44" y="93" fill="#22d3ee" font-size="11" font-weight="700">NEON</text>
  <text x="160" y="93" fill="currentColor" opacity=".75" font-size="10">horas de cómputo activo · si nunca escala a cero, pierde su ventaja</text>

  <rect x="24" y="110" width="632" height="32" rx="7" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="44" y="131" fill="#fbbf24" font-size="11" font-weight="700">CLOUDFLARE</text>
  <text x="160" y="131" fill="currentColor" opacity=".75" font-size="10">operaciones · SIN egreso · D1 no reemplaza a Postgres en consultas complejas</text>

  <rect x="24" y="148" width="632" height="32" rx="7" fill="#f87171" fill-opacity=".16" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="169" fill="#f87171" font-size="11" font-weight="700">AWS</text>
  <text x="160" y="169" fill="currentColor" opacity=".75" font-size="10">egreso + instancias sobredimensionadas · se descubre tarde</text>

  <rect x="24" y="186" width="632" height="32" rx="7" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="44" y="207" fill="#7c5cff" font-size="11" font-weight="700">VPS</text>
  <text x="160" y="207" fill="currentColor" opacity=".75" font-size="10">tu tiempo · desde el primer incidente a las 3 de la mañana</text>

  <line x1="24" y1="234" x2="656" y2="234" stroke="currentColor" opacity=".18"/>

  <text x="24" y="256" fill="#34d399" font-size="11.5" font-weight="700">
    LO QUE HAY QUE REEMPLAZAR AL SALIR DE SUPABASE</text>

  <rect x="24" y="266" width="120" height="46" rx="8" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.2"/>
  <text x="84" y="284" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">Postgres</text>
  <text x="84" y="300" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">fácil · es estándar</text>

  <rect x="152" y="266" width="120" height="46" rx="8" fill="#f87171" fill-opacity=".24" stroke="#f87171" stroke-width="1.8"/>
  <text x="212" y="284" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">AUTH</text>
  <text x="212" y="300" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">semanas + riesgo</text>

  <rect x="280" y="266" width="120" height="46" rx="8" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="340" y="284" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">storage+policies</text>
  <text x="340" y="300" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">medio-alto</text>

  <rect x="408" y="266" width="120" height="46" rx="8" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="468" y="284" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">realtime</text>
  <text x="468" y="300" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">medio</text>

  <rect x="536" y="266" width="120" height="46" rx="8" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.2"/>
  <text x="596" y="284" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">RLS</text>
  <text x="596" y="300" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">se conserva</text>

  <rect x="24" y="324" width="632" height="64" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="340" y="346" text-anchor="middle" fill="#7c5cff" font-size="12" font-weight="700">
    La comparación honesta NO es “Postgres contra Postgres”.</text>
  <text x="340" y="364" text-anchor="middle" fill="#7c5cff" font-size="12" font-weight="700">
    Es la plataforma completa contra la SUMA de sus reemplazos.</text>
  <text x="340" y="382" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10.5">
    Y la optimización más rentable suele ser sacar los archivos pesados a R2, sin migrar nada más.</text>
</svg>`,
        pie: 'Los precios cambian; los ejes no. Órdenes de magnitud para razonar, no cotizaciones.',
      },

      entrevista: [
        { p: '¿Cómo elegirías entre Supabase, Neon, Cloudflare y un VPS?',
          r: 'Por <b>en qué eje consumo más</b> y por cuánto vale el tiempo del equipo. Si necesito auth, storage, realtime y RLS integrados, ' +
             'Supabase incluye piezas que de otro modo tendría que construir, y eso pesa más que la diferencia de precio de la base. ' +
             'Si solo necesito Postgres y el tráfico es intermitente, <b>Neon</b> escala a cero y además da branching por rama de código. ' +
             'Si el costo está en <b>servir archivos</b>, Cloudflare R2 sin cargo de egreso es la diferencia más grande. ' +
             'Y un VPS es lo más barato en dinero y lo más caro en tiempo. <b>No hay una respuesta universal: hay una cuenta.</b>' },

        { p: 'Tu proyecto en Supabase se puso caro. ¿Qué evaluás antes de migrar?',
          r: 'Primero <b>dónde está el costo</b>, porque la solución cambia mucho. Si es <b>egreso de archivos</b> —imágenes, videos—, ' +
             'la optimización más rentable es sacarlos a R2 y quedarme con Supabase para todo lo demás: es una tarde de trabajo y no toco auth ni RLS. ' +
             'Si es <b>tamaño o cómputo de la base</b>, ahí sí evalúo alternativas, pero teniendo en cuenta que la comparación honesta no es ' +
             '"Postgres contra Postgres": al salir tengo que <b>reemplazar auth, storage con políticas y realtime</b>, y el auth propio son semanas ' +
             'más una superficie de seguridad que no quiero mantener.' },

        { p: '¿Cómo justificás una migración de plataforma con números?',
          r: 'Con una cuenta explícita: <b>ahorro mensual por doce</b>, contra <b>horas de migración por la tarifa del equipo</b>, más el riesgo de ' +
             'romper algo y el tiempo de aprender la plataforma nueva. Si ahorro 30 dólares al mes y la migración lleva 40 horas, el punto de ' +
             'equilibrio está a más de diez años y la respuesta es no. Si ahorro 800 al mes, se paga en semanas. ' +
             '<b>La cuenta define la decisión, no la preferencia técnica</b>, y ponerla por escrito evita discusiones basadas en impresiones.' },

        { p: '¿Cuándo NO usarías Cloudflare D1?',
          r: 'Cuando necesito Postgres de verdad. D1 es SQLite en el edge: excelente para cargas <b>livianas y de lectura intensiva</b>, ' +
             'con latencia muy baja porque está cerca del usuario. Pero no tiene la potencia de consulta de Postgres, ni extensiones como pgvector, ' +
             'ni el mismo modelo de concurrencia para escrituras. Si mi aplicación hace consultas complejas, usa RLS o necesita búsqueda vectorial, ' +
             'D1 no es un reemplazo. <b>Cloudflare brilla en Workers y R2; para datos relacionales serios sigo con Postgres.</b>' },
      ],

      practica: `
<h4>La tabla de decisión</h4>
<table>
<tr><th>Tu situación</th><th>Lo que conviene</th></tr>
<tr><td>Necesitás auth, storage y realtime integrados</td><td><b>Supabase.</b> Construir eso aparte cuesta más que la diferencia</td></tr>
<tr><td>Solo Postgres, tráfico intermitente</td><td><b>Neon.</b> Escala a cero + branching por rama</td></tr>
<tr><td>El costo está en servir archivos</td><td><b>R2</b> para los archivos, sin migrar el resto</td></tr>
<tr><td>Lectura intensiva, latencia global</td><td><b>Cloudflare Workers + KV</b></td></tr>
<tr><td>Presupuesto mínimo y tenés tiempo</td><td><b>VPS</b> con Compose</td></tr>
<tr><td>Requisitos regulatorios o infraestructura existente</td><td><b>AWS</b>, con alguien que lo maneje</td></tr>
</table>

<div class="aviso"><strong>La fila más rentable es la tercera.</strong> Si tu costo está en archivos pesados,
mover <b>solo</b> el storage a R2 te saca el egreso de encima sin tocar auth, RLS ni el resto de la aplicación.
Es la optimización con mejor relación beneficio/esfuerzo del módulo, y no implica ninguna migración riesgosa.</div>

<h4>Antes de decidir, respondé esto</h4>
<pre><code>1. ¿Cuál es mi factura actual, desglosada por ítem?
2. ¿Qué línea es la más grande?                    ← optimizá esa
3. ¿Esa línea crece con usuarios, con datos o con tráfico?
4. ¿Cuántas horas lleva la migración que estoy considerando?
5. ¿Qué piezas tendría que reconstruir?             ← auth es la cara
6. ahorro × 12  vs  horas × tarifa + riesgo</code></pre>

<h4>Optimizaciones que no requieren migrar</h4>
<table>
<tr><th>Acción</th><th>Ahorro típico</th><th>Esfuerzo</th></tr>
<tr><td>CDN delante de todo lo estático</td><td>Hasta 90% del egreso</td><td>Horas</td></tr>
<tr><td>Archivos pesados a R2</td><td>Toda la línea de egreso</td><td>Un día</td></tr>
<tr><td>Apagar staging fuera de horario</td><td>30-50% en proyectos chicos</td><td>Horas</td></tr>
<tr><td>Ajustar el tamaño de la instancia a lo que usa</td><td>40-60% de esa línea</td><td>Horas</td></tr>
<tr><td>Política de retención de backups</td><td>Variable, a veces mucho</td><td>Minutos</td></tr>
<tr><td>Borrar recursos huérfanos</td><td>Sorprendentemente alto</td><td>Una tarde</td></tr>
<tr><td>Pooler de conexiones</td><td>Permite un plan más chico</td><td>Horas</td></tr>
</table>
<p><b>Hacé estas siete antes de considerar cualquier migración.</b> Muchas veces resuelven el problema entero,
y ninguna tiene riesgo de romper algo.</p>
`,

      errores: [
        { mito: 'Migro a la plataforma más barata y listo.',
          realidad: 'La comparación honesta no es "Postgres contra Postgres". Al salir de una plataforma integrada tenés que <b>reemplazar auth, ' +
                    'storage con políticas y realtime</b>. El auth propio son semanas de trabajo más una superficie de seguridad que no querés ' +
                    'mantener. <b>Sumá el costo de los reemplazos antes de comparar.</b>' },

        { mito: 'Si Supabase se puso caro, hay que migrar.',
          realidad: 'Primero averiguá <b>qué línea</b> es la cara. Si es egreso de archivos, moverlos a R2 resuelve el problema <b>sin migrar nada ' +
                    'más</b> — una tarde de trabajo contra semanas. Si es cómputo de la base, un pooler puede permitirte un plan más chico. ' +
                    'Migrar es la última opción, no la primera.' },

        { mito: 'Un VPS es siempre más barato.',
          realidad: 'En dinero sí; en <b>tiempo</b> no. Actualizaciones, respaldos verificados, monitoreo, certificados, y un incidente a las tres ' +
                    'de la mañana. Si eso te consume dos días al mes, el ahorro se evaporó. Es la opción correcta si tenés el tiempo o si el ' +
                    'volumen justifica dedicarlo.' },

        { mito: 'Cloudflare D1 puede reemplazar a Postgres.',
          realidad: 'Es <b>SQLite en el edge</b>: excelente para lecturas livianas con latencia global, pero sin la potencia de consulta de Postgres, ' +
                    'sin extensiones como pgvector y con otro modelo de concurrencia para escrituras. Cloudflare brilla en Workers y R2; ' +
                    'para datos relacionales serios, Postgres.' },
      ],

      glosario: [
        { t: 'Supabase', d: 'Plataforma sobre Postgres con auth, storage, realtime, edge functions y RLS integrados.' },
        { t: 'Neon', d: 'Postgres serverless que separa cómputo y almacenamiento, escala a cero y ofrece branching.' },
        { t: 'Branching de base', d: 'Copia instantánea de la base para una rama de código, sin duplicar almacenamiento.' },
        { t: 'D1', d: 'Base SQLite distribuida de Cloudflare. Para cargas livianas de lectura intensiva.' },
        { t: 'R2', d: 'Almacenamiento de objetos de Cloudflare, compatible con S3 y sin cargo de egreso.' },
        { t: 'Workers', d: 'Cómputo en el edge de Cloudflare, cerca del usuario.' },
        { t: 'Vendor lock-in', d: 'Dificultad para cambiar de proveedor por acoplamiento técnico o costo de mover datos.' },
        { t: 'Punto de equilibrio', d: 'Momento en que el ahorro acumulado supera el costo de la migración.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Cuándo migrar y cuándo no',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> migrar de plataforma es caro, riesgoso y aburrido.
Se hace cuando <b>los números lo justifican</b>, no cuando apareció algo que suena mejor.</div>

<h4>Las razones válidas</h4>
<ol>
<li><b>El costo es un problema real</b>, ya optimizaste lo fácil, y el ahorro se paga en meses, no en años.</li>
<li><b>Un límite técnico</b> que la plataforma no puede levantar: falta una extensión, un tipo de consulta, una región.</li>
<li><b>Un requisito legal</b> de residencia de datos.</li>
<li><b>Riesgo del proveedor</b>: cambios de precio agresivos, incidentes repetidos, dudas sobre su continuidad.</li>
</ol>

<h4>Las razones que no alcanzan</h4>
<ul>
<li>"Salió algo nuevo que se ve mejor."</li>
<li>"Todos están usando X."</li>
<li>"Quiero aprender esa tecnología." — <b>aprendela en un proyecto paralelo</b>, no en producción.</li>
<li>"Es más barato" sin haber hecho la cuenta completa.</li>
<li>"No me gusta cómo está hecho." — real, pero no es un argumento de negocio.</li>
</ul>

<div class="aviso"><strong>El orden correcto, y casi nadie lo respeta:</strong><br>
<b>1 · Medí</b> — ¿cuál línea es la cara?<br>
<b>2 · Optimizá sin migrar</b> — CDN, apagar staging, ajustar tamaños, retención de backups.<br>
<b>3 · Migrá solo una pieza</b> — los archivos a R2, por ejemplo.<br>
<b>4 · Migración completa</b> — recién si lo anterior no alcanzó.<br><br>
La mayoría salta directo al paso 4. <b>Los pasos 2 y 3 resuelven el problema la mayoría de las veces</b>, con
una fracción del riesgo.</div>

<h4>Reducir el riesgo antes de necesitarlo</h4>
<p>La mejor forma de poder migrar barato es <b>no acoplarte de más</b> desde el principio:</p>
<ul>
<li>Usar <b>SQL estándar</b> cuando se pueda, y aislar lo específico del proveedor.</li>
<li><b>RLS es de Postgres</b>, no de Supabase: se conserva al migrar entre Postgres.</li>
<li>Poner el acceso a storage detrás de <b>tu propia interfaz</b>, no llamando al SDK desde todos lados.</li>
<li>Que la autenticación pase por <b>una capa tuya</b>, para poder cambiar el proveedor sin tocar la aplicación.</li>
<li><b>Migraciones en archivos versionados</b>, no cambios hechos a mano en un panel.</li>
</ul>
<p>Ninguna de esas cosas cuesta trabajo extra si se hacen desde el principio, y todas bajan muchísimo el costo
de una migración futura.</p>
`,

      tecnico: `
<h4>Cómo migrar sin apagar nada</h4>
<p>El patrón es siempre el mismo, y es el mismo <i>expand and contract</i> que viste en Kubernetes:</p>
<ol>
<li><b>Levantar el destino en paralelo.</b> Nada apuntando todavía.</li>
<li><b>Replicar los datos</b> y mantenerlos sincronizados —replicación lógica en Postgres, o escritura dual.</li>
<li><b>Escritura dual</b> temporal: la aplicación escribe en los dos lados.</li>
<li><b>Mover la lectura</b> al destino, con la posibilidad de volver atrás en cualquier momento.</li>
<li><b>Verificar</b> durante días, comparando resultados.</li>
<li><b>Cortar</b> la escritura al origen. Recién ahí es irreversible.</li>
</ol>
<p>Los pasos 3 a 5 son los que hacen la migración reversible. <b>Sin ellos es un corte, y un corte no se puede
deshacer si algo sale mal a las dos horas.</b></p>

<div class="dato"><strong>La regla del ensayo:</strong> ninguna migración se hace por primera vez en producción.
Se ensaya completa en staging —incluyendo el paso de vuelta atrás— y se cronometra. Si el ensayo tomó cuatro
horas, en producción va a tomar más. <b>Y si no pudiste volver atrás en el ensayo, no tenés plan de reversión:
tenés una esperanza.</b></div>

<h4>Checklist antes de cortar</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Respaldo verificado <b>y restaurado</b> en otro lado — un backup que nunca restauraste no es un backup</td></tr>
<tr><td>☐</td><td>Ensayo completo en staging, cronometrado</td></tr>
<tr><td>☐</td><td>Plan de vuelta atrás <b>probado</b>, no escrito</td></tr>
<tr><td>☐</td><td>TTL de DNS bajado con días de anticipación</td></tr>
<tr><td>☐</td><td>Comparación de conteos y sumas entre origen y destino</td></tr>
<tr><td>☐</td><td>Ventana de bajo tráfico elegida</td></tr>
<tr><td>☐</td><td>Alguien más al tanto, no una sola persona</td></tr>
<tr><td>☐</td><td>Métricas y alertas listas para detectar problemas rápido</td></tr>
</table>

<h4>Lo que se rompe en las migraciones de Postgres</h4>
<ul>
<li><b>Extensiones que el destino no tiene.</b> <code>pgvector</code>, <code>pg_cron</code>, PostGIS. Verificar <b>antes</b>.</li>
<li><b>Secuencias desincronizadas.</b> Después de copiar datos, hay que reajustar los contadores o el primer insert falla con clave duplicada.</li>
<li><b>Roles y permisos</b>, que no viajan con un volcado de datos.</li>
<li><b>Configuración del pooler</b>: el modo <i>transaction</i> no soporta sentencias preparadas, y algunos ORM las usan por defecto.</li>
<li><b>Diferencias de versión</b> de Postgres entre origen y destino.</li>
<li><b>Políticas RLS</b>, que viajan bien pero dependen de funciones y roles que hay que recrear.</li>
</ul>

<div class="dato"><strong>El de las secuencias es el que más veces arruina una migración</strong>, porque no
falla durante la copia sino <b>en el primer insert después</b> — cuando ya cortaste. <code>setval</code> sobre
cada secuencia es parte obligatoria del procedimiento, no un detalle.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="mg1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL ORDEN CORRECTO — y casi nadie lo respeta</text>

  <rect x="24" y="36" width="150" height="70" rx="9" fill="#34d399" fill-opacity=".18" stroke="#34d399" stroke-width="1.5"/>
  <text x="99" y="58" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">1 · MEDÍ</text>
  <text x="99" y="78" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">¿cuál línea es la cara?</text>
  <text x="99" y="96" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9.5">desglose de la factura</text>

  <line x1="178" y1="71" x2="196" y2="71" stroke="currentColor" stroke-width="1.3" marker-end="url(#mg1)"/>

  <rect x="200" y="36" width="150" height="70" rx="9" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="275" y="58" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">2 · OPTIMIZÁ</text>
  <text x="275" y="76" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">CDN · apagar staging</text>
  <text x="275" y="92" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">tamaños · retención</text>

  <line x1="354" y1="71" x2="372" y2="71" stroke="currentColor" stroke-width="1.3" marker-end="url(#mg1)"/>

  <rect x="376" y="36" width="150" height="70" rx="9" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="451" y="58" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">3 · UNA PIEZA</text>
  <text x="451" y="78" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">los archivos a R2</text>
  <text x="451" y="96" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9.5">sin tocar el resto</text>

  <line x1="530" y1="71" x2="548" y2="71" stroke="currentColor" stroke-width="1.3" marker-end="url(#mg1)"/>

  <rect x="552" y="36" width="104" height="70" rx="9" fill="#f87171" fill-opacity=".16" stroke="#f87171" stroke-width="1.4"/>
  <text x="604" y="58" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">4 · MIGRAR</text>
  <text x="604" y="78" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">todo</text>
  <text x="604" y="96" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">último recurso</text>

  <path d="M 99 112 q 0 22 253 22 q 253 0 253 -22" fill="none" stroke="#f87171" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#mg1)"/>
  <text x="352" y="152" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    la mayoría salta directo del 1 al 4</text>
  <text x="352" y="168" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10.5">
    …y los pasos 2 y 3 suelen resolver el problema con una fracción del riesgo</text>

  <line x1="24" y1="188" x2="656" y2="188" stroke="currentColor" opacity=".18"/>

  <text x="24" y="212" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    MIGRAR SIN APAGAR NADA — los pasos 3 a 5 la hacen REVERSIBLE</text>

  <rect x="24" y="224" width="100" height="44" rx="8" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="74" y="242" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">1 · destino</text>
  <text x="74" y="257" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">en paralelo</text>

  <rect x="132" y="224" width="100" height="44" rx="8" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="182" y="242" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">2 · replicar</text>
  <text x="182" y="257" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">y sincronizar</text>

  <rect x="240" y="224" width="100" height="44" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.5"/>
  <text x="290" y="242" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">3 · escritura</text>
  <text x="290" y="257" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">DUAL</text>

  <rect x="348" y="224" width="100" height="44" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.5"/>
  <text x="398" y="242" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">4 · mover</text>
  <text x="398" y="257" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">la lectura</text>

  <rect x="456" y="224" width="100" height="44" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.5"/>
  <text x="506" y="242" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">5 · verificar</text>
  <text x="506" y="257" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">días</text>

  <rect x="564" y="224" width="92" height="44" rx="8" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.5"/>
  <text x="610" y="242" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">6 · cortar</text>
  <text x="610" y="257" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">irreversible</text>

  <rect x="24" y="284" width="632" height="46" rx="9" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="304" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">
    Si no pudiste volver atrás en el ENSAYO, no tenés plan de reversión: tenés una esperanza.</text>
  <text x="340" y="322" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10.5">
    Ninguna migración se hace por primera vez en producción. Se ensaya completa en staging, y se cronometra.</text>

  <rect x="24" y="342" width="632" height="46" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="362" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    LAS SECUENCIAS: lo que más veces arruina una migración de Postgres.</text>
  <text x="340" y="380" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10.5">
    No falla al copiar: falla en el PRIMER INSERT después — cuando ya cortaste. setval es obligatorio.</text>
</svg>`,
        pie: 'Medí, optimizá, migrá una pieza. La migración completa es el último recurso, no el primero.',
      },

      entrevista: [
        { p: '¿Cuándo justificarías una migración de plataforma?',
          r: 'Cuando hay una razón concreta y medida: el <b>costo</b> es un problema real, ya optimicé lo fácil y el ahorro se paga en meses; ' +
             'un <b>límite técnico</b> que la plataforma no puede levantar; un <b>requisito legal</b> de residencia de datos; o <b>riesgo del ' +
             'proveedor</b>. Lo que no alcanza es "salió algo mejor", "todos usan X" o "quiero aprenderlo" — eso se aprende en un proyecto paralelo, ' +
             'no en producción. Y antes de migrar completo sigo un orden: medir, optimizar sin migrar, migrar <b>una sola pieza</b>, ' +
             'y recién ahí considerar el resto.' },

        { p: '¿Cómo hacés una migración de base de datos sin cortar el servicio?',
          r: 'Con el patrón <i>expand and contract</i>: levanto el destino en paralelo, replico los datos y los mantengo sincronizados, ' +
             'paso a <b>escritura dual</b> —la aplicación escribe en los dos lados—, muevo la lectura al destino, <b>verifico durante días</b> ' +
             'comparando resultados, y recién al final corto la escritura al origen. Los pasos de escritura dual y verificación son los que la hacen ' +
             '<b>reversible</b>: sin ellos es un corte, y un corte no se puede deshacer si algo sale mal a las dos horas.' },

        { p: '¿Qué se rompe habitualmente en una migración de Postgres?',
          r: 'Lo primero, <b>extensiones</b> que el destino no tiene —pgvector, pg_cron, PostGIS—, que hay que verificar antes. ' +
             'Después <b>roles y permisos</b>, que no viajan con un volcado de datos, y la <b>configuración del pooler</b>: el modo <i>transaction</i> ' +
             'no soporta sentencias preparadas y algunos ORM las usan por defecto. Pero el que más veces arruina una migración son las ' +
             '<b>secuencias desincronizadas</b>: no falla durante la copia, falla <b>en el primer insert después</b> —cuando ya cortaste— con un ' +
             'error de clave duplicada. Reajustarlas con <code>setval</code> es parte obligatoria del procedimiento.' },

        { p: '¿Cómo reducís el costo de una migración futura desde hoy?',
          r: 'No acoplándome de más. Usar <b>SQL estándar</b> donde se pueda y aislar lo específico del proveedor. Aprovechar que <b>RLS es de ' +
             'Postgres</b>, no de la plataforma, así que se conserva al migrar entre Postgres. Poner el acceso a storage y la autenticación detrás ' +
             'de <b>mi propia interfaz</b> en vez de llamar al SDK desde todos lados. Y mantener las <b>migraciones en archivos versionados</b>, ' +
             'no cambios hechos a mano en un panel. Nada de eso cuesta trabajo extra si se hace desde el principio, y baja muchísimo el costo de ' +
             'moverse después.' },
      ],

      practica: `
<h4>Verificar que los datos llegaron completos</h4>
<pre><code>-- En origen y destino, y comparar
select 'clientes' t, count(*), sum(hashtext(clientes::text)) from clientes
union all
select 'pedidos',    count(*), sum(hashtext(pedidos::text))  from pedidos;

-- Las secuencias: lo que más veces arruina una migración.
-- No falla al copiar: falla en el PRIMER INSERT después.
select setval(
  pg_get_serial_sequence('clientes','id'),
  coalesce((select max(id) from clientes), 1)
);</code></pre>

<div class="aviso"><strong>Ese <code>setval</code> no es opcional.</strong> Después de copiar datos con IDs
explícitos, el contador de la secuencia sigue donde estaba —muchas veces en 1— y el primer insert nuevo choca
con una clave existente. Ocurre <b>después</b> del corte, con usuarios reales, y es de los errores más
angustiantes que hay.</div>

<h4>Extensiones: verificar antes, no después</h4>
<pre><code>-- En el ORIGEN, para saber qué necesitás
select extname, extversion from pg_extension;

-- Verificá una por una que el destino las soporte.
-- pgvector, pg_cron y PostGIS son las que más faltan.</code></pre>

<h4>Ensayo en staging, cronometrado</h4>
<pre><code>1. Clonar producción a un entorno de ensayo.
2. Correr la migración COMPLETA, midiendo el tiempo de cada paso.
3. Verificar conteos, sumas y consultas representativas.
4. ⚠ EJECUTAR EL PLAN DE VUELTA ATRÁS y comprobar que funciona.
5. Documentar los tiempos reales.

Si el ensayo tomó 4 horas, en producción va a tomar más:
hay más datos, más carga y más nervios.</code></pre>

<h4>La decisión, en una línea</h4>
<pre><code>SI (ahorro_mensual × 12) &gt; (horas_migración × tarifa) × 3
   Y ya hiciste las optimizaciones sin migrar
   Y ensayaste la vuelta atrás
ENTONCES migrá.
SI NO → optimizá lo que ya tenés.</code></pre>
<p>Ese <b>× 3</b> es el margen por lo que siempre sale mal: la migración va a llevar más de lo estimado, y va a
haber problemas después que también consumen tiempo. Si el ahorro no soporta ese margen, la cuenta no cierra.</p>
`,

      errores: [
        { mito: 'Migro porque salió algo mejor.',
          realidad: 'Migrar es caro, riesgoso y aburrido. Las razones válidas son costo medido, límite técnico, requisito legal o riesgo del proveedor. ' +
                    '"Quiero aprenderlo" es legítimo como motivación, pero <b>se aprende en un proyecto paralelo</b>, no en producción.' },

        { mito: 'Hago la migración de una vez, en una ventana de mantenimiento.',
          realidad: 'Un corte <b>no se puede deshacer</b> si algo falla a las dos horas. El patrón correcto —replicar, escritura dual, mover lectura, ' +
                    'verificar días, cortar— mantiene la migración <b>reversible</b> hasta el último paso.' },

        { mito: 'Tengo un plan de vuelta atrás escrito.',
          realidad: 'Escrito no es probado. Si no lo <b>ejecutaste en el ensayo</b>, no tenés un plan: tenés una esperanza. ' +
                    'Y lo mismo con los respaldos: un backup que nunca restauraste no es un backup.' },

        { mito: 'Copié todos los datos, así que está todo bien.',
          realidad: 'Faltan las <b>secuencias</b> —que fallan en el primer insert posterior al corte, con clave duplicada—, los <b>roles y ' +
                    'permisos</b>, y verificar que el destino tenga las <b>extensiones</b> que usás. Los tres se descubren tarde y con usuarios reales.' },
      ],

      glosario: [
        { t: 'Expand and contract', d: 'Patrón de migración reversible: agregar el destino, convivir, y quitar el origen al final.' },
        { t: 'Escritura dual', d: 'Escribir en origen y destino simultáneamente durante la transición.' },
        { t: 'Replicación lógica', d: 'Mecanismo de Postgres para replicar cambios entre bases, incluso de distinta versión.' },
        { t: 'Punto de corte', d: 'Momento en que se deja de escribir en el origen. A partir de ahí es irreversible.' },
        { t: 'setval', d: 'Función que reajusta el contador de una secuencia. Obligatoria tras copiar datos con IDs.' },
        { t: 'Ensayo (dry run)', d: 'Ejecución completa de la migración en un entorno de prueba, incluida la vuelta atrás.' },
        { t: 'Vendor lock-in', d: 'Acoplamiento que encarece cambiar de proveedor.' },
        { t: 'Punto de equilibrio', d: 'Momento en que el ahorro acumulado cubre el costo de migrar.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿En qué cinco ejes se descompone el costo de una infraestructura en la nube?',
      opciones: [
        'Cómputo, almacenamiento, transferencia, operaciones y el tiempo del equipo',
        'Servidores, licencias, soporte, backups y seguridad',
        'CPU, RAM, disco, red y monitoreo',
        'Desarrollo, testing, deploy, operación y mantenimiento',
      ],
      correcta: 0,
      porQue: 'El quinto —el tiempo del equipo— es el más caro y el único que no aparece en ninguna factura. Y el costo casi nunca está donde uno cree: la gente optimiza almacenamiento, que es barato.',
      porQueNo: {
        1: 'Mezcla conceptos y deja fuera la transferencia, que suele ser el ítem más grande.',
        2: 'Son recursos técnicos, no ejes de facturación: falta el egreso y el tiempo.',
        3: 'Son fases de un proyecto, no componentes de una factura de nube.',
      },
    },
    {
      p: '¿Cuál es el desperdicio más común en una infraestructura chica?',
      opciones: [
        'Entornos de staging encendidos 24/7 que se usan pocas horas por semana',
        'Backups demasiado frecuentes',
        'Usar HTTPS en todas las conexiones',
        'Tener demasiadas tablas en la base',
      ],
      correcta: 0,
      porQue: 'Una base de staging encendida siempre cuesta casi lo mismo que una de producción. Apagarla fuera de horario suele ser el ahorro más grande y más fácil de conseguir.',
      porQueNo: {
        1: 'Puede pesar, pero es un problema de retención, no el más común ni el más grande.',
        2: 'El costo de TLS es despreciable.',
        3: 'La cantidad de tablas no afecta el precio.',
      },
    },
    {
      p: '¿Por qué el egreso es asimétrico —entrada gratis, salida cara?',
      opciones: [
        'Es un mecanismo de retención: cuanto más grande tu volumen, más caro es irte',
        'Porque la salida consume más ancho de banda que la entrada',
        'Por limitaciones técnicas de los centros de datos',
        'Porque la entrada se subsidia con publicidad',
      ],
      correcta: 0,
      porQue: 'Se lo llama data gravity y es una decisión de negocio deliberada, no una limitación técnica. Reconocerlo es el primer paso para no quedar atrapado.',
      porQueNo: {
        1: 'Técnicamente el ancho de banda es simétrico.',
        2: 'No hay ninguna razón técnica para la diferencia de precio.',
        3: 'No existe tal subsidio en la nube empresarial.',
      },
    },
    {
      p: 'Tenés 2 TB de salida al mes. ¿Cuál es la medida más efectiva?',
      opciones: [
        'Poner un CDN adelante: con 90% de aciertos, el egreso del origen cae en esa proporción',
        'Comprimir más las imágenes',
        'Aumentar el tamaño de la instancia',
        'Reducir la cantidad de páginas del sitio',
      ],
      correcta: 0,
      porQue: 'De unos 180 dólares mensuales a unos 34, y además el sitio queda más rápido porque se sirve desde un punto cercano al usuario. Es una tarde de trabajo.',
      porQueNo: {
        1: 'Ayuda, pero el impacto es mucho menor que servir desde caché.',
        2: 'No afecta la transferencia de salida.',
        3: 'No es una solución técnica al problema de egreso.',
      },
    },
    {
      p: '¿Cuál es el error de arquitectura que más egreso genera?',
      opciones: [
        'Base de datos en un proveedor y cómputo en otro: cada consulta cruza internet',
        'Usar demasiadas tablas',
        'No tener réplicas de lectura',
        'Usar HTTPS entre servicios internos',
      ],
      correcta: 0,
      porQue: 'Pagás egreso y latencia en cada petición. Es común cuando se combinan servicios "porque cada uno es el mejor en lo suyo", y el costo aparece meses después.',
      porQueNo: {
        1: 'La cantidad de tablas no genera transferencia entre proveedores.',
        2: 'Las réplicas generan más egreso, no menos.',
        3: 'El costo de TLS es despreciable frente al volumen transferido.',
      },
    },
    {
      p: 'Un proveedor ofrece "egreso gratis". ¿Qué hay que verificar?',
      opciones: [
        'En qué otro eje cobra: R2 no cobra egreso pero sí operaciones, y las escrituras son caras',
        'Que el contrato no tenga letra chica legal',
        'La velocidad de la conexión',
        'Nada: si dice gratis, es gratis',
      ],
      correcta: 0,
      porQue: '"Gratis" siempre significa "gratis en un eje". Para leer mucho y escribir poco R2 sale muy bien; para escritura intensiva hay que hacer la cuenta completa.',
      porQueNo: {
        1: 'Es prudente, pero el punto técnico es dónde se traslada el costo.',
        2: 'No tiene relación con el modelo de precios.',
        3: 'Ningún proveedor regala capacidad sin cobrarla en otro lado.',
      },
    },
    {
      p: 'Al comparar Supabase con alternativas más baratas, ¿qué se suele omitir?',
      opciones: [
        'Que incluye auth, storage con políticas, realtime y edge: hay que sumar el costo de reemplazarlos',
        'Que Postgres es más lento en Supabase',
        'Que no soporta RLS',
        'Que no permite migraciones versionadas',
      ],
      correcta: 0,
      porQue: 'La comparación honesta no es "Postgres contra Postgres": es la plataforma completa contra la suma de sus reemplazos. El auth propio son semanas más una superficie de seguridad que no querés mantener.',
      porQueNo: {
        1: 'Es Postgres estándar; el rendimiento depende del plan.',
        2: 'Al contrario: RLS está profundamente integrado, y además es de Postgres.',
        3: 'Soporta migraciones versionadas con su CLI.',
      },
    },
    {
      p: 'Tu costo en Supabase se disparó y es principalmente egreso de imágenes. ¿Qué hacés?',
      opciones: [
        'Mover solo los archivos a R2, sin migrar nada más',
        'Migrar toda la plataforma a AWS',
        'Reducir la calidad de todas las imágenes',
        'Cambiar a un VPS',
      ],
      correcta: 0,
      porQue: 'Es la optimización con mejor relación beneficio/esfuerzo: una tarde de trabajo, saca toda la línea de egreso, y no tocás auth, RLS ni el resto de la aplicación.',
      porQueNo: {
        1: 'Semanas de trabajo y riesgo alto para un problema que se resuelve moviendo una pieza.',
        2: 'Ayuda algo, pero no elimina el cargo de egreso.',
        3: 'Cambia todos los ejes de costo y todo el trabajo operativo por un problema acotado.',
      },
    },
    {
      p: '¿Cuándo NO conviene Cloudflare D1?',
      opciones: [
        'Cuando necesitás consultas complejas, extensiones como pgvector o escritura intensiva',
        'Cuando el tráfico es global',
        'Cuando querés baja latencia',
        'Cuando usás TypeScript',
      ],
      correcta: 0,
      porQue: 'D1 es SQLite en el edge: excelente para cargas livianas de lectura intensiva, pero no reemplaza a Postgres en consultas complejas ni tiene sus extensiones.',
      porQueNo: {
        1: 'El tráfico global es justamente donde más brilla.',
        2: 'La baja latencia es su principal ventaja.',
        3: 'El lenguaje no tiene relación.',
      },
    },
    {
      p: '¿Qué razón NO justifica una migración de plataforma?',
      opciones: [
        '"Quiero aprender esa tecnología"',
        'El costo es un problema medido y el ahorro se paga en meses',
        'Un límite técnico que la plataforma no puede levantar',
        'Un requisito legal de residencia de datos',
      ],
      correcta: 0,
      porQue: 'Es una motivación legítima pero se satisface en un proyecto paralelo, no en producción. Migrar es caro, riesgoso y aburrido: necesita una razón de negocio.',
      porQueNo: {
        1: 'Es la razón más sólida, siempre que ya se hayan hecho las optimizaciones sin migrar.',
        2: 'Si la plataforma no puede hacer lo que necesitás, no hay alternativa.',
        3: 'Suele ser un requisito duro, no negociable.',
      },
    },
    {
      p: '¿Cuál es el orden correcto antes de migrar?',
      opciones: [
        'Medir, optimizar sin migrar, migrar una sola pieza, y recién ahí migrar todo',
        'Elegir la plataforma nueva, planificar y ejecutar',
        'Migrar primero staging y después producción',
        'Comparar precios de lista y elegir el más barato',
      ],
      correcta: 0,
      porQue: 'La mayoría salta directo al último paso. Los pasos intermedios —CDN, apagar staging, ajustar tamaños, mover una pieza— resuelven el problema la mayoría de las veces, con una fracción del riesgo.',
      porQueNo: {
        1: 'Salta la medición y las optimizaciones que suelen resolver el problema entero.',
        2: 'Es parte del cómo, no del cuándo. Y no evita migrar innecesariamente.',
        3: 'El precio de lista ignora los otros cuatro ejes y el costo de reemplazar piezas.',
      },
    },
    {
      p: '¿Qué hace que una migración de base de datos sea reversible?',
      opciones: [
        'Escritura dual y verificación durante días antes de cortar el origen',
        'Tener un backup antes de empezar',
        'Hacerla en una ventana de mantenimiento',
        'Usar la misma versión de Postgres',
      ],
      correcta: 0,
      porQue: 'Mientras escribís en los dos lados y la lectura se puede volver atrás, podés revertir en cualquier momento. Sin eso es un corte, y un corte no se deshace si algo falla a las dos horas.',
      porQueNo: {
        1: 'Ayuda ante desastres, pero restaurar pierde todo lo escrito desde el backup.',
        2: 'Reduce el impacto pero no hace la migración reversible.',
        3: 'Evita incompatibilidades, pero no permite volver atrás.',
      },
    },
    {
      p: '¿Qué es lo que más veces arruina una migración de Postgres?',
      opciones: [
        'Las secuencias desincronizadas: fallan en el primer insert después del corte',
        'La diferencia de zona horaria',
        'El tamaño de los índices',
        'La codificación de caracteres',
      ],
      correcta: 0,
      porQue: 'No falla durante la copia sino después, con usuarios reales, con error de clave duplicada. Reajustarlas con setval es parte obligatoria del procedimiento, no un detalle.',
      porQueNo: {
        1: 'Es un problema real pero mucho menos frecuente y más visible.',
        2: 'Los índices se reconstruyen; no rompen la migración.',
        3: 'Suele detectarse durante la copia, no después.',
      },
    },
    {
      p: '¿Cómo reducís hoy el costo de una migración futura?',
      opciones: [
        'SQL estándar, acceso a storage y auth detrás de tu propia interfaz, migraciones versionadas',
        'Guardando backups más frecuentes',
        'Usando el plan más caro del proveedor',
        'Evitando usar bases de datos relacionales',
      ],
      correcta: 0,
      porQue: 'Nada de eso cuesta trabajo extra si se hace desde el principio, y baja muchísimo el costo de moverse después. Además RLS es de Postgres, no de la plataforma, así que se conserva.',
      porQueNo: {
        1: 'Protege ante desastres, no reduce el acoplamiento.',
        2: 'Aumenta el costo sin reducir el acoplamiento.',
        3: 'Cambiar el modelo de datos por miedo a migrar es un problema mayor que el que resuelve.',
      },
    },
    {
      p: 'Ahorrarías 30 USD/mes migrando, y la migración lleva 40 horas. ¿Qué hacés?',
      opciones: [
        'No migrar: el punto de equilibrio está a más de diez años',
        'Migrar: todo ahorro suma',
        'Migrar solo la mitad de los servicios',
        'Migrar en tiempo libre para no contar las horas',
      ],
      correcta: 0,
      porQue: 'La cuenta define la decisión: ahorro × 12 contra horas × tarifa, con un margen porque la migración siempre lleva más de lo estimado y aparecen problemas después.',
      porQueNo: {
        1: 'Ignora el costo de oportunidad de esas 40 horas y el riesgo de romper algo.',
        2: 'Sumaría complejidad de tener dos plataformas por un ahorro mínimo.',
        3: 'El tiempo tiene costo aunque no se facture. Es exactamente el eje que la gente omite.',
      },
    },
  ],
});
