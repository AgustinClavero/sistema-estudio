/* ==========================================================================
   Infra · Módulo 03 — El modelo mental de la nube
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'infra',
  id: 'm03',
  titulo: 'El modelo mental de la nube',
  fuentes: ['12factor', 'cloudflare-workers', 'aws-precios', 'cloudflare-dns'],

  intro:
    '<p>"La nube" es la computadora de otro. Lo que cambia entre opciones no es la magia: es <b>hasta dónde ' +
    'llega tu responsabilidad</b> y dónde empieza la del proveedor.</p>' +
    '<p>Este módulo te da ese mapa. Con él, elegir entre un VPS, Vercel, Cloud Run o Lambda deja de ser una ' +
    'cuestión de moda y pasa a ser una decisión con criterio.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'IaaS, PaaS, SaaS: quién se ocupa de qué',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La analogía de la pizza, que es vieja y sigue funcionando:</strong> podés hacerla
en casa (comprás todo), comprar la masa hecha (te ahorrás una parte), pedir delivery (solo elegís y comés) o
ir a un restaurante (no tocás nada).</div>

<h4>Las capas, de más a menos trabajo tuyo</h4>

<p><b>Servidor propio</b> — comprás la máquina, la ponés en algún lado, la enfriás, la actualizás. Casi nadie
hace esto ya.</p>

<p><b>IaaS</b> (infraestructura como servicio) — alquilás una máquina virtual. El proveedor pone el hardware y
la red; vos ponés el sistema operativo, los parches, el servidor web, tu aplicación. <i>Ejemplos: EC2, un VPS
de Hetzner o DigitalOcean.</i></p>

<p><b>PaaS</b> (plataforma como servicio) — subís tu código y la plataforma se encarga del resto: lo construye,
lo despliega, lo escala, le pone HTTPS. <i>Ejemplos: Vercel, Railway, Render, Fly.</i></p>

<p><b>Serverless / FaaS</b> — subís funciones sueltas. Corren cuando hay un evento y no cuestan nada cuando no
lo hay. <i>Ejemplos: Lambda, Cloud Functions, Vercel Functions.</i></p>

<p><b>SaaS</b> — no administrás nada, usás el producto. <i>Ejemplos: Supabase para tu base, Resend para mails,
Sentry para errores.</i></p>

<div class="aviso"><strong>La regla que ordena todo:</strong> cuanto más arriba en esa lista, <b>menos
controlás y menos trabajás</b>. No hay una capa "correcta": hay una capa correcta <b>para cada pieza de tu
sistema</b>. Es perfectamente normal —y sano— tener la aplicación en un PaaS, la base en un SaaS y un worker
pesado en una máquina IaaS.</div>

<h4>Qué queda siendo tuyo, siempre</h4>
<p>Sin importar la capa que elijas, estas cosas nunca las hace el proveedor:</p>
<ul>
<li><b>Tu código</b> y sus dependencias.</li>
<li><b>Tus datos</b> — y sus respaldos verificados.</li>
<li><b>El control de acceso</b>: quién puede ver qué.</li>
<li><b>La configuración</b> que elegiste.</li>
</ul>
<p>Es el <b>modelo de responsabilidad compartida</b>, y el malentendido más caro del rubro es creer que
"está en la nube" significa "está respaldado y seguro".</p>
`,

      tecnico: `
<h4>Qué administra cada uno</h4>
<table>
<tr><th>Capa</th><th>Vos</th><th>El proveedor</th></tr>
<tr><td><b>IaaS</b></td><td>SO, parches, runtime, servidor web, app, datos, escalado</td><td>Hardware, red, virtualización, energía</td></tr>
<tr><td><b>PaaS</b></td><td>App, datos, configuración</td><td>Todo lo anterior + SO, runtime, escalado, TLS</td></tr>
<tr><td><b>FaaS</b></td><td>Funciones, datos</td><td>Todo, incluido el ciclo de vida del proceso</td></tr>
<tr><td><b>SaaS</b></td><td>Tus datos y quién accede</td><td>Absolutamente todo lo demás</td></tr>
</table>

<div class="dato"><strong>El malentendido más caro:</strong> "está en la nube" no significa "está
respaldado". La mayoría de los proveedores garantizan <b>durabilidad de la infraestructura</b> —que el disco no
se pierda— pero <b>no te protegen de vos mismo</b>: si borrás una tabla, si una migración destruye datos, si
alguien con acceso hace algo mal, eso es tuyo. <b>Un respaldo que nunca restauraste no es un respaldo</b>, y la
prueba de restauración es la única que cuenta.</div>

<h4>El costo de la abstracción</h4>
<p>Subir de capa no es gratis. Lo que se pierde:</p>
<ul>
<li><b>Control fino.</b> En un PaaS no elegís la versión del kernel ni ajustás parámetros del sistema.</li>
<li><b>Previsibilidad de costo.</b> Los modelos por uso pueden sorprender con un pico de tráfico o un bucle.</li>
<li><b>Portabilidad.</b> Cuanto más usás las funciones propietarias, más caro es irte.</li>
<li><b>Capacidad de depurar.</b> No podés entrar a la máquina a mirar qué pasa.</li>
</ul>
<p>Y lo que se gana es tiempo — que es el eje más caro, como viste en el módulo de costos.</p>

<h4>Doce factores, en tres que importan</h4>
<p>La metodología <i>Twelve-Factor App</i> es de 2011 y sigue siendo la mejor guía para que una aplicación
funcione bien en cualquier capa. Tres puntos concentran casi todo el valor:</p>
<ul>
<li><b>Configuración por entorno.</b> Nada de credenciales ni URLs en el código: variables de entorno. Esto es lo que permite usar la <b>misma imagen</b> en desarrollo, staging y producción.</li>
<li><b>Procesos sin estado.</b> No guardes nada en la memoria del proceso ni en su disco: cualquier instancia tiene que poder atender cualquier petición. Es lo que hace posible escalar horizontalmente.</li>
<li><b>Logs a la salida estándar.</b> No archivos: un flujo de eventos que la plataforma recolecta.</li>
</ul>

<div class="dato"><strong>El más incumplido es el de procesos sin estado</strong>, y se descubre justo al
escalar: sesiones en memoria, archivos subidos guardados en el disco local, caché en una variable del módulo.
Con una instancia funciona; con dos, el usuario que cae en la otra pierde la sesión o no encuentra su archivo.
<b>Si tu aplicación no puede correr en dos instancias, no puede escalar.</b></div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    QUIÉN ADMINISTRA QUÉ  ·  verde = vos  ·  gris = el proveedor</text>

  <text x="36" y="52" fill="currentColor" opacity=".5" font-size="10" font-weight="700">SERVIDOR</text>
  <text x="36" y="64" fill="currentColor" opacity=".5" font-size="10" font-weight="700">PROPIO</text>
  <text x="176" y="58" fill="currentColor" opacity=".5" font-size="10" font-weight="700">IaaS</text>
  <text x="316" y="58" fill="currentColor" opacity=".5" font-size="10" font-weight="700">PaaS</text>
  <text x="456" y="58" fill="currentColor" opacity=".5" font-size="10" font-weight="700">FaaS</text>
  <text x="590" y="58" fill="currentColor" opacity=".5" font-size="10" font-weight="700">SaaS</text>

  <!-- filas: aplicación, datos, runtime, SO, virtualización, hardware -->
  <g font-size="9" text-anchor="middle">
    <!-- fila app -->
    <rect x="24"  y="72" width="118" height="24" rx="4" fill="#34d399" fill-opacity=".55"/>
    <rect x="150" y="72" width="118" height="24" rx="4" fill="#34d399" fill-opacity=".55"/>
    <rect x="276" y="72" width="118" height="24" rx="4" fill="#34d399" fill-opacity=".55"/>
    <rect x="402" y="72" width="118" height="24" rx="4" fill="#34d399" fill-opacity=".55"/>
    <rect x="528" y="72" width="128" height="24" rx="4" fill="currentColor" fill-opacity=".12"/>
    <text x="83"  y="88" fill="#06281c" font-weight="700">aplicación</text>
    <text x="209" y="88" fill="#06281c" font-weight="700">aplicación</text>
    <text x="335" y="88" fill="#06281c" font-weight="700">aplicación</text>
    <text x="461" y="88" fill="#06281c" font-weight="700">funciones</text>
    <text x="592" y="88" fill="currentColor" opacity=".5">—</text>

    <!-- fila datos -->
    <rect x="24"  y="100" width="118" height="24" rx="4" fill="#34d399" fill-opacity=".55"/>
    <rect x="150" y="100" width="118" height="24" rx="4" fill="#34d399" fill-opacity=".55"/>
    <rect x="276" y="100" width="118" height="24" rx="4" fill="#34d399" fill-opacity=".55"/>
    <rect x="402" y="100" width="118" height="24" rx="4" fill="#34d399" fill-opacity=".55"/>
    <rect x="528" y="100" width="128" height="24" rx="4" fill="#34d399" fill-opacity=".4"/>
    <text x="83"  y="116" fill="#06281c" font-weight="700">datos</text>
    <text x="209" y="116" fill="#06281c" font-weight="700">datos</text>
    <text x="335" y="116" fill="#06281c" font-weight="700">datos</text>
    <text x="461" y="116" fill="#06281c" font-weight="700">datos</text>
    <text x="592" y="116" fill="#06281c" font-weight="700">datos + acceso</text>

    <!-- fila runtime -->
    <rect x="24"  y="128" width="118" height="24" rx="4" fill="#34d399" fill-opacity=".55"/>
    <rect x="150" y="128" width="118" height="24" rx="4" fill="#34d399" fill-opacity=".55"/>
    <rect x="276" y="128" width="118" height="24" rx="4" fill="currentColor" fill-opacity=".12"/>
    <rect x="402" y="128" width="118" height="24" rx="4" fill="currentColor" fill-opacity=".12"/>
    <rect x="528" y="128" width="128" height="24" rx="4" fill="currentColor" fill-opacity=".12"/>
    <text x="83"  y="144" fill="#06281c" font-weight="700">runtime</text>
    <text x="209" y="144" fill="#06281c" font-weight="700">runtime</text>
    <text x="335" y="144" fill="currentColor" opacity=".5">runtime</text>
    <text x="461" y="144" fill="currentColor" opacity=".5">runtime</text>
    <text x="592" y="144" fill="currentColor" opacity=".5">runtime</text>

    <!-- fila SO -->
    <rect x="24"  y="156" width="118" height="24" rx="4" fill="#34d399" fill-opacity=".55"/>
    <rect x="150" y="156" width="118" height="24" rx="4" fill="#34d399" fill-opacity=".55"/>
    <rect x="276" y="156" width="118" height="24" rx="4" fill="currentColor" fill-opacity=".12"/>
    <rect x="402" y="156" width="118" height="24" rx="4" fill="currentColor" fill-opacity=".12"/>
    <rect x="528" y="156" width="128" height="24" rx="4" fill="currentColor" fill-opacity=".12"/>
    <text x="83"  y="172" fill="#06281c" font-weight="700">SO + parches</text>
    <text x="209" y="172" fill="#06281c" font-weight="700">SO + parches</text>
    <text x="335" y="172" fill="currentColor" opacity=".5">SO</text>
    <text x="461" y="172" fill="currentColor" opacity=".5">SO</text>
    <text x="592" y="172" fill="currentColor" opacity=".5">SO</text>

    <!-- fila hardware -->
    <rect x="24"  y="184" width="118" height="24" rx="4" fill="#34d399" fill-opacity=".55"/>
    <rect x="150" y="184" width="118" height="24" rx="4" fill="currentColor" fill-opacity=".12"/>
    <rect x="276" y="184" width="118" height="24" rx="4" fill="currentColor" fill-opacity=".12"/>
    <rect x="402" y="184" width="118" height="24" rx="4" fill="currentColor" fill-opacity=".12"/>
    <rect x="528" y="184" width="128" height="24" rx="4" fill="currentColor" fill-opacity=".12"/>
    <text x="83"  y="200" fill="#06281c" font-weight="700">hardware + red</text>
    <text x="209" y="200" fill="currentColor" opacity=".5">hardware</text>
    <text x="335" y="200" fill="currentColor" opacity=".5">hardware</text>
    <text x="461" y="200" fill="currentColor" opacity=".5">hardware</text>
    <text x="592" y="200" fill="currentColor" opacity=".5">hardware</text>
  </g>

  <text x="24" y="228" fill="currentColor" opacity=".55" font-size="10.5">
    ← más control y más trabajo                                                                  menos control y menos trabajo →</text>

  <line x1="24" y1="248" x2="656" y2="248" stroke="currentColor" opacity=".18"/>

  <rect x="24" y="262" width="632" height="52" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="284" text-anchor="middle" fill="#f87171" font-size="12" font-weight="700">
    “Está en la nube” NO significa “está respaldado”.</text>
  <text x="340" y="304" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">
    Te garantizan que el disco no se pierda. NO te protegen de una migración que borra datos. Eso es tuyo, en toda capa.</text>

  <rect x="24" y="326" width="632" height="60" rx="10" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="348" fill="#fbbf24" font-size="11.5" font-weight="700">EL FACTOR MÁS INCUMPLIDO: procesos SIN ESTADO</text>
  <text x="44" y="368" fill="currentColor" opacity=".7" font-size="10.5">
    Sesiones en memoria, archivos en el disco local, caché en una variable. Con una instancia anda; con dos, se rompe.</text>
  <text x="44" y="382" fill="#fbbf24" font-size="10.5" font-weight="700">
    Si tu aplicación no puede correr en dos instancias, no puede escalar.</text>
</svg>`,
        pie: 'No hay una capa correcta: hay una capa correcta para cada pieza de tu sistema.',
      },

      entrevista: [
        { p: '¿Cuál es la diferencia entre IaaS, PaaS y SaaS?',
          r: 'Es una escala de <b>cuánto administrás vos</b>. Con <b>IaaS</b> alquilás una máquina virtual: el proveedor pone hardware y red, ' +
             'vos ponés sistema operativo, parches, runtime y aplicación. Con <b>PaaS</b> subís código y la plataforma construye, despliega, escala ' +
             'y pone HTTPS: te quedás con la aplicación y los datos. Con <b>SaaS</b> no administrás nada, solo usás el producto. ' +
             'Y no hay una capa correcta: es normal tener la aplicación en un PaaS, la base en un SaaS y un worker pesado en IaaS. ' +
             '<b>La capa se elige por pieza, no por proyecto.</b>' },

        { p: '¿Qué significa el modelo de responsabilidad compartida?',
          r: 'Que el proveedor se ocupa de la seguridad <i>de</i> la nube y vos de la seguridad <i>en</i> la nube. Sin importar la capa, siempre ' +
             'quedan de tu lado: <b>tu código, tus datos y sus respaldos, el control de acceso y la configuración</b>. ' +
             'El malentendido más caro es creer que "está en la nube" significa "está respaldado y seguro": te garantizan durabilidad de ' +
             'infraestructura, pero <b>no te protegen de una migración que borra datos ni de un permiso mal puesto</b>.' },

        { p: '¿Cuál es el principio de Twelve-Factor que más se incumple?',
          r: 'El de <b>procesos sin estado</b>, y se descubre justo al escalar. Sesiones guardadas en la memoria del proceso, archivos subidos ' +
             'escritos en el disco local, caché en una variable del módulo: con una instancia funciona perfecto; con dos, el usuario que cae en la ' +
             'otra pierde la sesión o no encuentra su archivo. <b>Si tu aplicación no puede correr en dos instancias, no puede escalar</b>, ' +
             'y eso es independiente de la plataforma que elijas.' },
      ],

      practica: `
<h4>Test rápido: ¿tu aplicación puede escalar?</h4>
<pre><code># Levantá DOS instancias con un balanceador delante y probá:

☐ ¿La sesión sobrevive si el usuario cae en la otra instancia?
    → si no: las sesiones están en memoria. Van a Redis o a una cookie firmada.

☐ ¿Un archivo subido a la instancia A se ve desde la B?
    → si no: se está escribiendo en el disco local. Va a S3 o R2.

☐ ¿Los trabajos programados se ejecutan DOS veces?
    → si sí: cada instancia corre su propio cron. Va a una cola con bloqueo.

☐ ¿La caché en memoria devuelve datos distintos según la instancia?
    → si sí: es caché local. Va a Redis, o se acepta que sea inconsistente.

☐ ¿Los contadores en variables globales se pierden?
    → sí, siempre. Van a la base.</code></pre>

<div class="aviso"><strong>Ese ejercicio es el que revela si tu aplicación es realmente portable.</strong>
Todo lo que falla ahí va a fallar igual en Kubernetes, en Cloud Run o en cualquier plataforma que escale — el
problema no es la infraestructura, es el estado guardado donde no corresponde.</div>

<h4>Configuración por entorno, bien hecha</h4>
<pre><code>// ✅ Validada al arrancar: si falta algo, falla YA y no en el primer request
const env = {
  DATABASE_URL: requerido('DATABASE_URL'),
  REDIS_URL:    requerido('REDIS_URL'),
  NODE_ENV:     process.env.NODE_ENV ?? 'development',
};

function requerido(clave) {
  const v = process.env[clave];
  if (!v) throw new Error(\`Falta la variable de entorno \${clave}\`);
  return v;
}</code></pre>
<p>Fallar al arrancar es mucho mejor que fallar en el primer request de un usuario: el despliegue no progresa,
el healthcheck no pasa, y el rolling update deja la versión anterior atendiendo.</p>

<h4>Elegir capa por pieza</h4>
<table>
<tr><th>Pieza</th><th>Capa razonable</th><th>Por qué</th></tr>
<tr><td>Aplicación web</td><td>PaaS</td><td>Despliegue, HTTPS y escalado resueltos</td></tr>
<tr><td>Base de datos</td><td>SaaS</td><td>Respaldos, actualizaciones y alta disponibilidad son trabajo especializado</td></tr>
<tr><td>Archivos</td><td>SaaS (S3/R2)</td><td>Durabilidad y CDN incluidos</td></tr>
<tr><td>Workers pesados</td><td>IaaS o contenedor gestionado</td><td>Control de recursos y sin límite de tiempo</td></tr>
<tr><td>Tareas por evento</td><td>FaaS</td><td>Escala a cero, pagás por ejecución</td></tr>
<tr><td>Correo, errores, pagos</td><td>SaaS</td><td>Nunca los construyas vos</td></tr>
</table>
`,

      errores: [
        { mito: '"Está en la nube", así que está respaldado.',
          realidad: 'Te garantizan <b>durabilidad de la infraestructura</b> —que el disco no se pierda—, no te protegen de vos mismo. ' +
                    'Una migración que borra datos o un permiso mal puesto son tuyos en cualquier capa. <b>Y un respaldo que nunca restauraste ' +
                    'no es un respaldo.</b>' },

        { mito: 'Hay que elegir una capa para todo el proyecto.',
          realidad: 'Se elige <b>por pieza</b>. Lo normal es aplicación en un PaaS, base y archivos en SaaS, workers pesados en un contenedor ' +
                    'gestionado. Forzar todo a la misma capa termina en una de dos cosas: trabajo innecesario o falta de control donde hacía falta.' },

        { mito: 'Subir de capa es siempre mejor.',
          realidad: 'Se pierde <b>control fino, previsibilidad de costo, portabilidad y capacidad de depurar</b>. Lo que se gana es tiempo. ' +
                    'Es un intercambio, y en algunos casos el control importa más — por ejemplo, cargas que necesitan ajustar parámetros del sistema.' },

        { mito: 'Guardo la sesión en memoria, total anda.',
          realidad: 'Anda <b>con una sola instancia</b>. Con dos, el usuario que cae en la otra pierde la sesión. Es el principio de Twelve-Factor ' +
                    'más incumplido y el que aparece justo cuando necesitás escalar — el peor momento para descubrirlo.' },
      ],

      glosario: [
        { t: 'IaaS', d: 'Infraestructura como servicio: alquilás la máquina, administrás el sistema operativo hacia arriba.' },
        { t: 'PaaS', d: 'Plataforma como servicio: subís código y la plataforma construye, despliega y escala.' },
        { t: 'FaaS', d: 'Funciones como servicio: subís funciones que corren por evento y escalan a cero.' },
        { t: 'SaaS', d: 'Software como servicio: usás el producto sin administrar nada.' },
        { t: 'Responsabilidad compartida', d: 'El proveedor asegura la nube; vos asegurás lo que ponés en ella.' },
        { t: 'Twelve-Factor App', d: 'Metodología de 2011 para aplicaciones que funcionan bien en cualquier plataforma.' },
        { t: 'Proceso sin estado', d: 'Que no guarde nada en memoria ni disco local entre peticiones. Condición para escalar.' },
        { t: 'Configuración por entorno', d: 'Credenciales y URLs en variables de entorno, no en el código.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Regiones, zonas y latencia',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> la información viaja rápido pero no infinitamente
rápido. <b>Dónde pongas cada pieza define cuánto tarda tu aplicación</b>, y eso no se arregla con más CPU.</div>

<h4>Región y zona</h4>
<p><b>Región</b> — una ubicación geográfica: São Paulo, Virginia, Frankfurt. Están a miles de kilómetros entre
sí.</p>
<p><b>Zona de disponibilidad</b> — dentro de una región, centros de datos separados pero cercanos. Tienen
energía y red independientes, así que si uno se cae los otros siguen.</p>

<p>La diferencia práctica:</p>
<ul>
<li>Entre <b>zonas</b> de la misma región: menos de un milisegundo. Podés replicar sincrónicamente.</li>
<li>Entre <b>regiones</b>: decenas o cientos de milisegundos. Ahí ya hay que pensar la arquitectura.</li>
</ul>

<h4>La latencia, en números que se pueden recordar</h4>
<table>
<tr><th>Recorrido</th><th>Ida y vuelta aprox.</th></tr>
<tr><td>Dentro de la misma zona</td><td>&lt; 1 ms</td></tr>
<tr><td>Entre zonas de una región</td><td>1 – 2 ms</td></tr>
<tr><td>Buenos Aires ↔ São Paulo</td><td>~30 ms</td></tr>
<tr><td>Buenos Aires ↔ Virginia (EE.UU.)</td><td>~120 ms</td></tr>
<tr><td>Buenos Aires ↔ Frankfurt</td><td>~220 ms</td></tr>
</table>

<div class="aviso"><strong>Por qué esos números importan más de lo que parece:</strong> si tu aplicación está
en Virginia y tu base también, una consulta cuesta menos de un milisegundo. Pero si tu <b>usuario</b> está en
Buenos Aires, cada ida y vuelta a Virginia son 120 ms. Y si tu página hace <b>diez peticiones en serie</b>, son
<b>1,2 segundos solo de viaje</b> — sin contar nada de procesamiento.<br><br>
<b>La latencia no se optimiza con hardware: se optimiza con menos viajes y con distancia más corta.</b></div>

<h4>Dónde poner cada cosa</h4>
<ul>
<li><b>La aplicación, cerca de la base.</b> Esa es la conversación más frecuente y la que más se repite por request.</li>
<li><b>El contenido estático, cerca del usuario.</b> Eso lo resuelve un CDN.</li>
<li><b>La base, cerca de la mayoría de tus usuarios</b> — si tenés que elegir.</li>
</ul>
<p>El error clásico es al revés: la aplicación cerca del usuario y la base lejos. Cada consulta cruza el
océano, y son muchas por página.</p>
`,

      tecnico: `
<h4>Qué protege cada nivel</h4>
<table>
<tr><th>Falla</th><th>Te salva</th><th>Costo</th></tr>
<tr><td>Un servidor</td><td>Varias instancias en una zona</td><td>Bajo</td></tr>
<tr><td>Una zona entera</td><td>Instancias en varias zonas</td><td>Bajo: el tráfico entre zonas es barato</td></tr>
<tr><td>Una región entera</td><td>Réplicas en otra región</td><td><b>Alto</b>: egreso continuo y complejidad</td></tr>
</table>

<div class="dato"><strong>La recomendación honesta:</strong> <b>multi-zona sí, multi-región casi nunca.</b>
Multi-zona es barato y te cubre del fallo más probable —un centro de datos con problemas—. Multi-región duplica
costo, agrega egreso continuo entre regiones y trae el problema difícil de la consistencia de datos.
Las caídas de una región completa son <b>raras</b>, y para la mayoría de los productos unas horas de
indisponibilidad al año son aceptables. Si no lo son, eso es una decisión de negocio con presupuesto propio.</div>

<h4>El problema de la consistencia</h4>
<p>Si replicás tu base a otra región, aparece una elección que no tiene salida fácil:</p>
<ul>
<li><b>Replicación sincrónica</b> — cada escritura espera la confirmación de la otra región. Consistente, pero le sumás la latencia entre regiones <b>a cada escritura</b>.</li>
<li><b>Replicación asincrónica</b> — la escritura confirma enseguida y se replica después. Rápido, pero la réplica está unos milisegundos atrasada: un usuario puede escribir y no ver su propio cambio.</li>
</ul>
<p>Ese último caso —<i>read your own writes</i>— es el que rompe cosas de forma más confusa: el usuario guarda,
la interfaz recarga, y el dato viejo vuelve. Se resuelve leyendo del primario después de escribir, con un
mecanismo de "pegajosidad" temporal.</p>

<h4>Reducir viajes, que es lo que realmente importa</h4>
<p>Con 120 ms de latencia, la diferencia entre diseños es brutal:</p>
<pre><code>❌ 10 peticiones en serie   → 10 × 120 ms = 1.200 ms
✅ 10 peticiones en paralelo → ~120 ms
✅ 1 petición que trae todo  → ~120 ms

❌ Consulta N+1: 1 + 50 consultas a la base
✅ Un JOIN o un &#96;in (...)&#96;: 1 consulta</code></pre>
<p><b>La consulta N+1 es el asesino silencioso</b>: en desarrollo, con la base local, cincuenta consultas
tardan 5 ms y no se nota. En producción, con 2 ms de red cada una, son 100 ms extra por petición.</p>

<h4>Elegir región</h4>
<ol>
<li>Dónde están <b>tus usuarios</b>. Es el criterio principal.</li>
<li>Dónde están tus <b>datos</b> — si hay requisitos legales de residencia, esto manda sobre todo lo demás.</li>
<li><b>Precio</b>: hay diferencias reales entre regiones para el mismo servicio.</li>
<li><b>Disponibilidad de servicios</b>: no todas las regiones tienen todo.</li>
</ol>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    REGIÓN vs ZONA</text>

  <rect x="24" y="34" width="300" height="128" rx="12" fill="#22d3ee" fill-opacity=".07" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="44" y="56" fill="#22d3ee" font-size="11.5" font-weight="700">REGIÓN  ·  São Paulo</text>

  <rect x="44" y="68" width="82" height="52" rx="8" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="85" y="90" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">zona A</text>
  <text x="85" y="106" text-anchor="middle" fill="currentColor" opacity=".5" font-size="8.5">energía propia</text>

  <rect x="132" y="68" width="82" height="52" rx="8" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="173" y="90" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">zona B</text>
  <text x="173" y="106" text-anchor="middle" fill="currentColor" opacity=".5" font-size="8.5">energía propia</text>

  <rect x="220" y="68" width="82" height="52" rx="8" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="261" y="90" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">zona C</text>

  <text x="44" y="140" fill="#34d399" font-size="10.5" font-weight="700">entre zonas: &lt; 2 ms · barato</text>
  <text x="44" y="155" fill="currentColor" opacity=".55" font-size="10">multi-zona te cubre del fallo más probable</text>

  <path d="M 330 100 L 372 100" stroke="#f87171" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="351" y="92" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">~120 ms</text>
  <text x="351" y="118" text-anchor="middle" fill="#f87171" font-size="9.5">caro</text>

  <rect x="378" y="34" width="278" height="128" rx="12" fill="#7c5cff" fill-opacity=".07" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="398" y="56" fill="#7c5cff" font-size="11.5" font-weight="700">REGIÓN  ·  Virginia</text>
  <rect x="398" y="68" width="118" height="52" rx="8" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.1"/>
  <text x="457" y="98" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">zona A</text>
  <rect x="522" y="68" width="118" height="52" rx="8" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.1"/>
  <text x="581" y="98" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">zona B</text>
  <text x="398" y="140" fill="#f87171" font-size="10.5" font-weight="700">multi-región: caro y complejo</text>
  <text x="398" y="155" fill="currentColor" opacity=".55" font-size="10">egreso continuo + problema de consistencia</text>

  <line x1="24" y1="180" x2="656" y2="180" stroke="currentColor" opacity=".18"/>

  <text x="24" y="204" fill="#f87171" font-size="12" font-weight="700">
    LA LATENCIA NO SE ARREGLA CON MÁS CPU</text>

  <text x="24" y="228" fill="currentColor" opacity=".6" font-size="10.5">Usuario en Buenos Aires, servidor en Virginia: 120 ms por viaje.</text>

  <rect x="24" y="240" width="632" height="40" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="258" fill="#f87171" font-size="11" font-weight="700">✗ 10 peticiones EN SERIE</text>
  <g fill="#f87171" fill-opacity=".6">
    <rect x="220" y="248" width="38" height="12" rx="3"/><rect x="262" y="248" width="38" height="12" rx="3"/>
    <rect x="304" y="248" width="38" height="12" rx="3"/><rect x="346" y="248" width="38" height="12" rx="3"/>
    <rect x="388" y="248" width="38" height="12" rx="3"/><rect x="430" y="248" width="38" height="12" rx="3"/>
    <rect x="472" y="248" width="38" height="12" rx="3"/><rect x="514" y="248" width="38" height="12" rx="3"/>
    <rect x="556" y="248" width="38" height="12" rx="3"/><rect x="598" y="248" width="38" height="12" rx="3"/>
  </g>
  <text x="44" y="274" fill="#f87171" font-size="12" font-weight="700">1.200 ms solo de viaje</text>

  <rect x="24" y="288" width="632" height="40" rx="8" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="44" y="306" fill="#34d399" font-size="11" font-weight="700">✓ 10 EN PARALELO, o 1 que trae todo</text>
  <rect x="220" y="296" width="38" height="12" rx="3" fill="#34d399" fill-opacity=".7"/>
  <text x="44" y="322" fill="#34d399" font-size="12" font-weight="700">~120 ms</text>

  <rect x="24" y="340" width="632" height="46" rx="9" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="360" fill="#fbbf24" font-size="11.5" font-weight="700">EL ASESINO SILENCIOSO: la consulta N+1</text>
  <text x="44" y="378" fill="currentColor" opacity=".7" font-size="10.5">
    En desarrollo, con la base local, 50 consultas tardan 5 ms y no se nota. En producción, con 2 ms de red cada una, son 100 ms extra.</text>
</svg>`,
        pie: 'Multi-zona sí, multi-región casi nunca. Y lo que más rinde es reducir viajes, no acercarse.',
      },

      entrevista: [
        { p: '¿Cuál es la diferencia entre región y zona de disponibilidad?',
          r: 'Una <b>región</b> es una ubicación geográfica —São Paulo, Virginia—; las <b>zonas</b> son centros de datos separados dentro de esa ' +
             'región, con energía y red independientes. La diferencia práctica está en la latencia: entre zonas es menos de dos milisegundos, ' +
             'entre regiones son decenas o cientos. Por eso <b>multi-zona es barato y multi-región es caro</b>: entre zonas podés replicar ' +
             'sincrónicamente sin penalidad, entre regiones cada escritura pagaría la latencia completa.' },

        { p: '¿Recomendarías una arquitectura multi-región?',
          r: 'Casi nunca. <b>Multi-zona sí</b>: es barato y cubre el fallo más probable, que es un centro de datos con problemas. ' +
             '<b>Multi-región</b> duplica el costo, agrega egreso continuo y trae el problema difícil de la consistencia de datos — con replicación ' +
             'asincrónica un usuario puede escribir y no ver su propio cambio. Las caídas de una región completa son raras, y para la mayoría de los ' +
             'productos unas horas de indisponibilidad al año son aceptables. Si no lo son, es una decisión de negocio con presupuesto propio, ' +
             'no una decisión técnica por defecto.' },

        { p: 'Tu aplicación es lenta para usuarios de otro continente. ¿Qué hacés?',
          r: 'Primero distingo <b>qué</b> es lento. Si es contenido estático, un <b>CDN</b> lo resuelve sirviéndolo desde un punto cercano. ' +
             'Si es la aplicación, lo que más rinde no es acercarse sino <b>reducir viajes</b>: con 120 ms de latencia, diez peticiones en serie ' +
             'son 1,2 segundos, y las mismas diez en paralelo son 120 ms. Ahí también miraría <b>consultas N+1</b>, que en desarrollo con la base ' +
             'local no se notan y en producción suman muchísimo. Mover la infraestructura es la última opción, y sobre todo hay que mantener ' +
             '<b>la aplicación cerca de la base</b>, no del usuario.' },

        { p: '¿Qué problema aparece con la replicación asincrónica entre regiones?',
          r: 'Que la réplica está atrasada, así que un usuario puede <b>escribir y no ver su propio cambio</b> — se lo llama ' +
             '<i>read your own writes</i>. Guarda algo, la interfaz recarga leyendo de la réplica, y vuelve el dato viejo. Es especialmente confuso ' +
             'porque es intermitente y depende de a qué réplica caiga. Se resuelve leyendo del primario durante un tiempo después de cada escritura ' +
             'de ese usuario, con un mecanismo de pegajosidad temporal.' },
      ],

      practica: `
<h4>Medir dónde se va el tiempo</h4>
<pre><code># ¿Cuánto es red y cuánto es tu aplicación?
curl -w "dns:%{time_namelookup}  conexión:%{time_connect}  tls:%{time_appconnect}  \\
primer_byte:%{time_starttransfer}  total:%{time_total}\\n" \\
     -o /dev/null -s https://tuapp.com/api/algo</code></pre>
<p>Si <code>time_connect</code> ya es alto, es distancia. Si el salto está entre <code>tls</code> y
<code>primer_byte</code>, es tu aplicación o la base. <b>Esa distinción evita optimizar la capa equivocada.</b></p>

<h4>Detectar consultas N+1</h4>
<pre><code>-- Activar el log de consultas lentas en desarrollo
-- (en Postgres: log_min_duration_statement = 0 muestra TODAS)

-- Si ves esto repetido 50 veces, tenés un N+1:
select * from pedidos where cliente_id = $1;
select * from pedidos where cliente_id = $1;
...</code></pre>
<pre><code>// ❌ N+1: una consulta por cliente
for (const c of clientes) {
  c.pedidos = await db.pedidos.findMany({ where: { clienteId: c.id } });
}

// ✅ Una sola consulta y agrupás en memoria
const ids = clientes.map(c =&gt; c.id);
const pedidos = await db.pedidos.findMany({ where: { clienteId: { in: ids } } });
const porCliente = agrupar(pedidos, p =&gt; p.clienteId);</code></pre>

<div class="aviso"><strong>El N+1 es invisible en desarrollo.</strong> Con la base en tu propia máquina, cada
consulta tarda una fracción de milisegundo y cincuenta no se notan. En producción, con la base a 2 ms, son
100 ms extra <b>por petición</b> — y si el usuario está lejos, se suma a todo lo demás.</div>

<h4>Paralelizar lo independiente</h4>
<pre><code>// ❌ En serie: 3 viajes sumados
const cliente = await traerCliente(id);
const pedidos = await traerPedidos(id);
const facturas = await traerFacturas(id);

// ✅ En paralelo: el tiempo del más lento
const [cliente, pedidos, facturas] = await Promise.all([
  traerCliente(id), traerPedidos(id), traerFacturas(id),
]);</code></pre>

<h4>Checklist de latencia</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>La aplicación está en la <b>misma región</b> que la base</td></tr>
<tr><td>☐</td><td>Hay un CDN delante del contenido estático</td></tr>
<tr><td>☐</td><td>Las peticiones independientes van en paralelo</td></tr>
<tr><td>☐</td><td>No hay consultas N+1 en las rutas más usadas</td></tr>
<tr><td>☐</td><td>Multi-zona configurado (barato y cubre el fallo probable)</td></tr>
<tr><td>☐</td><td>Multi-región <b>solo</b> si el negocio lo justifica y lo paga</td></tr>
</table>
`,

      errores: [
        { mito: 'Pongo la aplicación cerca del usuario y listo.',
          realidad: 'Si la base queda lejos, <b>cada consulta cruza el océano</b> — y son muchas por página. La aplicación va cerca de la base, ' +
                    'y lo que se acerca al usuario es el contenido estático, con un CDN.' },

        { mito: 'Multi-región es lo que hacen los sistemas serios.',
          realidad: 'Es caro, agrega egreso continuo y trae el problema de la consistencia. <b>Multi-zona cubre el fallo más probable</b> ' +
                    'a un costo bajísimo. Multi-región es una decisión de negocio con presupuesto propio, no un default técnico.' },

        { mito: 'Si está lento, agrando la instancia.',
          realidad: 'La latencia de red <b>no baja con más CPU</b>. Lo que rinde es reducir viajes: paralelizar lo independiente, ' +
                    'eliminar consultas N+1 y traer todo en una sola petición cuando se pueda.' },

        { mito: 'La consulta N+1 se nota si está mal.',
          realidad: 'En desarrollo, con la base local, cincuenta consultas tardan milisegundos y <b>no se nota nada</b>. Aparece solo en producción, ' +
                    'donde cada una suma latencia de red. Es de los problemas que más tarde se descubren.' },
      ],

      glosario: [
        { t: 'Región', d: 'Ubicación geográfica de un proveedor. Entre regiones hay decenas o cientos de milisegundos.' },
        { t: 'Zona de disponibilidad', d: 'Centro de datos independiente dentro de una región. Entre zonas, menos de 2 ms.' },
        { t: 'Multi-zona', d: 'Instancias repartidas en varias zonas. Barato y cubre el fallo más probable.' },
        { t: 'Multi-región', d: 'Réplicas en regiones distintas. Caro, con egreso continuo y problemas de consistencia.' },
        { t: 'Replicación sincrónica', d: 'La escritura espera confirmación de la réplica. Consistente y lenta entre regiones.' },
        { t: 'Replicación asincrónica', d: 'La escritura confirma antes de replicar. Rápida, con réplicas atrasadas.' },
        { t: 'Read your own writes', d: 'Garantía de que un usuario vea sus propios cambios inmediatamente.' },
        { t: 'Consulta N+1', d: 'Hacer una consulta por cada elemento de una lista. Invisible en desarrollo, cara en producción.' },
        { t: 'Residencia de datos', d: 'Requisito legal sobre en qué país se almacenan los datos.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Serverless: qué gana y qué pierde',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> "serverless" no significa que no haya servidores.
Significa que <b>no los administrás vos</b> y que solo pagás mientras tu código realmente se ejecuta.</div>

<h4>Cómo funciona</h4>
<p>Tu función está guardada, apagada. Llega una petición, la plataforma <b>levanta un entorno</b>, ejecuta tu
código, devuelve la respuesta y lo deja andando un rato por si viene otra. Si no viene, lo apaga.</p>

<h4>Lo que ganás</h4>
<ul>
<li><b>Escala a cero.</b> Sin tráfico, sin costo. Ideal para entornos de prueba y proyectos con picos.</li>
<li><b>Escala hacia arriba solo.</b> Mil peticiones simultáneas levantan mil entornos, sin que hagas nada.</li>
<li><b>Cero administración.</b> No hay sistema operativo, ni parches, ni reinicios.</li>
</ul>

<h4>Lo que perdés</h4>
<ul>
<li><b>Arranque en frío.</b> La primera petición después de un rato de inactividad tarda más — de decenas de milisegundos a segundos, según el entorno.</li>
<li><b>Límite de tiempo.</b> Suele haber un tope por ejecución. Nada largo entra ahí.</li>
<li><b>Sin estado entre ejecuciones.</b> No podés confiar en nada guardado en memoria.</li>
<li><b>Conexiones a la base.</b> El problema más grande, y tiene su propia sección.</li>
<li><b>Depuración más difícil.</b> No hay una máquina donde entrar a mirar.</li>
</ul>

<div class="aviso"><strong>El problema de las conexiones es el que sorprende a todo el mundo.</strong> Cada
ejecución concurrente es un entorno distinto que abre <b>su propia conexión</b> a la base. Mil peticiones
simultáneas intentan abrir mil conexiones, y Postgres acepta unas cien.<br><br>
<b>Serverless + base relacional = necesitás un pooler, sí o sí.</b> Es el mismo problema que viste al escalar
pods en Kubernetes, y aparece mucho antes de lo que uno espera.</div>

<h4>Cuándo conviene</h4>
<table>
<tr><th>Buen encaje</th><th>Mal encaje</th></tr>
<tr><td>Tráfico irregular o con picos</td><td>Tráfico alto y constante (sale más caro)</td></tr>
<tr><td>Tareas por evento: webhooks, subidas</td><td>Procesos largos o por lotes</td></tr>
<tr><td>APIs con carga variable</td><td>Conexiones persistentes: WebSockets</td></tr>
<tr><td>Entornos de prueba</td><td>Cargas que necesitan estado en memoria</td></tr>
</table>
`,

      tecnico: `
<h4>Arranque en frío</h4>
<p>Se compone de tres tiempos:</p>
<pre><code>arranque_frío = descargar el código
              + iniciar el runtime
              + ejecutar la inicialización de tu módulo</code></pre>
<p>La tercera parte es la única que controlás, y suele ser la más grande. Lo que la infla:</p>
<ul>
<li>Dependencias pesadas importadas al inicio, se usen o no.</li>
<li>Conexiones establecidas al cargar el módulo.</li>
<li>Configuración leída de un servicio externo en cada arranque.</li>
</ul>

<div class="dato"><strong>La optimización más efectiva es reducir el tamaño del paquete</strong> y usar
<b>importaciones dinámicas</b> para lo que no se necesita en todas las rutas. Una función de 50 MB que importa
tres SDKs completos arranca mucho más lento que una de 2 MB. Y el runtime importa: los entornos tipo <i>edge</i>
arrancan en milisegundos porque no levantan un Node completo, a cambio de una API más limitada.</div>

<h4>El problema de las conexiones, con números</h4>
<pre><code>Aplicación tradicional:
  3 instancias × pool de 10  =  30 conexiones. Estable.

Serverless:
  1.000 peticiones concurrentes = hasta 1.000 entornos
  cada uno abriendo su conexión = 1.000 intentos
  Postgres acepta ~100          → el resto falla</code></pre>
<p>Las soluciones, en orden:</p>
<ul>
<li><b>Un pooler</b> —PgBouncer, el pooler de Supabase, RDS Proxy—: multiplexa muchas conexiones de aplicación sobre pocas reales. <b>Es la solución estándar.</b></li>
<li><b>Driver por HTTP</b> —Neon serverless driver, Data API—: no abre conexión TCP persistente, así que el problema desaparece.</li>
<li><b>Límite de concurrencia</b> en la función, que acota el daño a costa de encolar.</li>
</ul>
<p>Ojo con el detalle del pooler que ya viste: el modo <i>transaction</i> no soporta sentencias preparadas, y
varios ORM las usan por defecto.</p>

<h4>Serverless en el borde vs en el servidor</h4>
<table>
<tr><th></th><th>Edge runtime</th><th>Node runtime</th></tr>
<tr><td>Arranque en frío</td><td>Milisegundos</td><td>Cientos de ms a segundos</td></tr>
<tr><td>Dónde corre</td><td>Cerca del usuario</td><td>En una región</td></tr>
<tr><td>APIs disponibles</td><td>Limitadas: sin acceso a archivos, sin muchos módulos de Node</td><td>Node completo</td></tr>
<tr><td>Conexión a Postgres</td><td>Solo por HTTP</td><td>TCP, con pooler</td></tr>
<tr><td>Ideal para</td><td>Middleware, redirecciones, personalización liviana</td><td>Lógica de negocio, acceso a base</td></tr>
</table>

<h4>El costo, comparado</h4>
<p>Serverless conviene con tráfico irregular y <b>deja de convenir con tráfico alto y constante</b>: pagás por
invocación y por milisegundo, y a cierto volumen una instancia siempre encendida sale más barata.</p>
<p>El punto de cruce depende del caso, pero la señal es simple: <b>si tu función está prácticamente siempre
activa, ya no estás aprovechando lo que serverless ofrece</b> — estás pagando el sobreprecio de la elasticidad
sin usarla.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL CICLO DE UNA FUNCIÓN SERVERLESS</text>

  <rect x="24" y="34" width="120" height="46" rx="9" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".3" stroke-width="1.2"/>
  <text x="84" y="54" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5" font-weight="700">apagada</text>
  <text x="84" y="70" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">costo: 0</text>

  <text x="152" y="62" fill="currentColor" opacity=".4" font-size="14">→</text>

  <rect x="172" y="34" width="140" height="46" rx="9" fill="#f87171" fill-opacity=".16" stroke="#f87171" stroke-width="1.4"/>
  <text x="242" y="54" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">ARRANQUE EN FRÍO</text>
  <text x="242" y="70" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">descarga + runtime + init</text>

  <text x="320" y="62" fill="currentColor" opacity=".4" font-size="14">→</text>

  <rect x="340" y="34" width="140" height="46" rx="9" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.3"/>
  <text x="410" y="54" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">ejecuta</text>
  <text x="410" y="70" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">pagás por milisegundo</text>

  <text x="488" y="62" fill="currentColor" opacity=".4" font-size="14">→</text>

  <rect x="508" y="34" width="148" height="46" rx="9" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="582" y="54" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">tibia un rato</text>
  <text x="582" y="70" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">la siguiente no paga frío</text>

  <line x1="24" y1="100" x2="656" y2="100" stroke="currentColor" opacity=".18"/>

  <text x="24" y="124" fill="#f87171" font-size="12" font-weight="700">
    EL PROBLEMA QUE SORPRENDE A TODO EL MUNDO</text>

  <rect x="24" y="136" width="240" height="120" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.3"/>
  <text x="144" y="158" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">APP TRADICIONAL</text>
  <g fill="#34d399" fill-opacity=".55">
    <rect x="44" y="170" width="56" height="16" rx="3"/>
    <rect x="108" y="170" width="56" height="16" rx="3"/>
    <rect x="172" y="170" width="56" height="16" rx="3"/>
  </g>
  <text x="144" y="182" text-anchor="middle" fill="#06281c" font-size="8.5" font-weight="700">3 instancias</text>
  <text x="144" y="208" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10">pool de 10 cada una</text>
  <text x="144" y="230" text-anchor="middle" fill="#34d399" font-size="13" font-weight="700">30 conexiones</text>
  <text x="144" y="246" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9.5">estable</text>

  <rect x="280" y="136" width="240" height="120" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.5"/>
  <text x="400" y="158" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">SERVERLESS</text>
  <g fill="#f87171" fill-opacity=".5">
    <rect x="296" y="168" width="16" height="10" rx="2"/><rect x="316" y="168" width="16" height="10" rx="2"/>
    <rect x="336" y="168" width="16" height="10" rx="2"/><rect x="356" y="168" width="16" height="10" rx="2"/>
    <rect x="376" y="168" width="16" height="10" rx="2"/><rect x="396" y="168" width="16" height="10" rx="2"/>
    <rect x="416" y="168" width="16" height="10" rx="2"/><rect x="436" y="168" width="16" height="10" rx="2"/>
    <rect x="456" y="168" width="16" height="10" rx="2"/><rect x="476" y="168" width="16" height="10" rx="2"/>
    <rect x="496" y="168" width="16" height="10" rx="2"/>
    <rect x="296" y="182" width="16" height="10" rx="2"/><rect x="316" y="182" width="16" height="10" rx="2"/>
    <rect x="336" y="182" width="16" height="10" rx="2"/><rect x="356" y="182" width="16" height="10" rx="2"/>
    <rect x="376" y="182" width="16" height="10" rx="2"/><rect x="396" y="182" width="16" height="10" rx="2"/>
    <rect x="416" y="182" width="16" height="10" rx="2"/><rect x="436" y="182" width="16" height="10" rx="2"/>
    <rect x="456" y="182" width="16" height="10" rx="2"/><rect x="476" y="182" width="16" height="10" rx="2"/>
    <rect x="496" y="182" width="16" height="10" rx="2"/>
  </g>
  <text x="400" y="210" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10">1.000 entornos concurrentes</text>
  <text x="400" y="230" text-anchor="middle" fill="#f87171" font-size="13" font-weight="700">1.000 conexiones</text>
  <text x="400" y="246" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">Postgres acepta ~100</text>

  <text x="530" y="200" fill="currentColor" opacity=".4" font-size="16">→</text>

  <rect x="552" y="160" width="104" height="72" rx="10" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="604" y="190" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">POOLER</text>
  <text x="604" y="208" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">o driver HTTP</text>
  <text x="604" y="222" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-weight="700">obligatorio</text>

  <rect x="24" y="272" width="304" height="112" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.3"/>
  <text x="176" y="294" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">BUEN ENCAJE</text>
  <text x="44" y="316" fill="currentColor" opacity=".72" font-size="10.5">· tráfico irregular o con picos</text>
  <text x="44" y="334" fill="currentColor" opacity=".72" font-size="10.5">· tareas por evento: webhooks, subidas</text>
  <text x="44" y="352" fill="currentColor" opacity=".72" font-size="10.5">· APIs con carga variable</text>
  <text x="44" y="370" fill="currentColor" opacity=".72" font-size="10.5">· entornos de prueba (escala a cero)</text>

  <rect x="352" y="272" width="304" height="112" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.3"/>
  <text x="504" y="294" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">MAL ENCAJE</text>
  <text x="372" y="316" fill="currentColor" opacity=".72" font-size="10.5">· tráfico alto y constante (sale más caro)</text>
  <text x="372" y="334" fill="currentColor" opacity=".72" font-size="10.5">· procesos largos o por lotes</text>
  <text x="372" y="352" fill="currentColor" opacity=".72" font-size="10.5">· conexiones persistentes: WebSockets</text>
  <text x="372" y="370" fill="currentColor" opacity=".72" font-size="10.5">· cargas que necesitan estado en memoria</text>
</svg>`,
        pie: 'Serverless no es "sin servidores": es "sin administrarlos", y con un conjunto distinto de restricciones.',
      },

      entrevista: [
        { p: '¿Qué es serverless y qué se gana y se pierde?',
          r: 'No significa que no haya servidores: significa que <b>no los administrás</b> y que pagás solo mientras tu código se ejecuta. ' +
             'Se gana <b>escala a cero</b> —sin tráfico, sin costo—, escalado automático hacia arriba y cero administración. ' +
             'Se pierde el <b>arranque en frío</b>, hay un <b>límite de tiempo por ejecución</b>, no se puede confiar en estado en memoria, ' +
             'y sobre todo aparece el <b>problema de las conexiones a la base</b>: cada ejecución concurrente abre la suya, así que mil peticiones ' +
             'simultáneas intentan mil conexiones contra una base que acepta cien.' },

        { p: '¿Cómo resolvés el problema de las conexiones en serverless?',
          r: 'Con un <b>pooler</b> —PgBouncer, el pooler de Supabase, RDS Proxy—, que multiplexa muchas conexiones de aplicación sobre pocas reales. ' +
             'Es la solución estándar. La alternativa es un <b>driver por HTTP</b>, como el serverless driver de Neon, que no abre conexión TCP ' +
             'persistente y hace desaparecer el problema. Y un detalle a tener presente: el modo <i>transaction pooling</i>, que es el más eficiente, ' +
             '<b>no soporta sentencias preparadas</b>, y varios ORM las usan por defecto — es una sorpresa habitual al conectar Prisma o Drizzle.' },

        { p: '¿Cómo reducís el arranque en frío?',
          r: 'La parte que controlo es la <b>inicialización de mi módulo</b>, que suele ser la más grande. Reduzco el tamaño del paquete, ' +
             'uso <b>importaciones dinámicas</b> para lo que no se necesita en todas las rutas, y evito abrir conexiones o leer configuración externa ' +
             'al cargar el módulo. Una función de 50 MB que importa tres SDKs completos arranca mucho más lento que una de 2 MB. ' +
             'Y si el caso lo permite, un <b>runtime de edge</b> arranca en milisegundos porque no levanta un Node completo, a cambio de una API más limitada.' },

        { p: '¿Cuándo serverless deja de convenir?',
          r: 'Con <b>tráfico alto y constante</b>. Pagás por invocación y por milisegundo, así que a cierto volumen una instancia siempre encendida ' +
             'sale más barata. La señal es simple: <b>si tu función está prácticamente siempre activa, ya no estás aprovechando la elasticidad</b> — ' +
             'estás pagando su sobreprecio sin usarla. También descarto serverless para procesos largos, por el límite de tiempo, ' +
             'y para conexiones persistentes como WebSockets.' },
      ],

      practica: `
<h4>Reducir el arranque en frío</h4>
<pre><code>// ❌ Importa tres SDKs completos en cada arranque, se usen o no
import { S3Client } from '@aws-sdk/client-s3';
import Stripe from 'stripe';
import { Resend } from 'resend';

export async function handler(req) {
  if (req.tipo === 'pago') { /* solo acá se usa Stripe */ }
}

// ✅ Importación dinámica: solo se carga lo que la ruta necesita
export async function handler(req) {
  if (req.tipo === 'pago') {
    const { default: Stripe } = await import('stripe');
    // …
  }
}</code></pre>

<h4>Reutilizar la conexión entre invocaciones tibias</h4>
<pre><code>// El módulo se mantiene cargado mientras el entorno esté tibio.
// Una variable a nivel de módulo sobrevive entre invocaciones del MISMO entorno.
let pool;

function obtenerPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,  // ← al POOLER, no a la base
      max: 1,                                       // 1 por entorno: no acapares
    });
  }
  return pool;
}</code></pre>

<div class="aviso"><strong>Ese <code>max: 1</code> es contraintuitivo y es lo correcto.</strong> En una
aplicación tradicional querés un pool grande; en serverless, cada entorno atiende <b>una petición por vez</b>,
así que más de una conexión por entorno es capacidad reservada que nadie usa — y multiplicada por mil entornos,
es lo que tumba la base.</div>

<h4>Elegir runtime</h4>
<table>
<tr><th>Necesitás…</th><th>Runtime</th></tr>
<tr><td>Middleware, redirecciones, geolocalización</td><td><b>Edge</b>: arranca en ms y corre cerca del usuario</td></tr>
<tr><td>Acceso a Postgres por TCP</td><td><b>Node</b>, con pooler</td></tr>
<tr><td>Librerías de Node con módulos nativos</td><td><b>Node</b>: el edge no las soporta</td></tr>
<tr><td>Procesamiento de más de un minuto</td><td><b>Ninguno</b>: va a una cola con worker</td></tr>
</table>

<h4>Checklist antes de usar serverless</h4>
<pre><code>☐ ¿La operación entra en el límite de tiempo?
☐ ¿Hay un pooler o un driver HTTP delante de la base?
☐ ¿El código NO depende de estado en memoria entre peticiones?
☐ ¿El arranque en frío es tolerable para este caso de uso?
☐ ¿El tráfico es irregular?  (si es constante y alto, revisá el costo)
☐ ¿Los archivos van a almacenamiento externo, no al disco local?</code></pre>
`,

      errores: [
        { mito: 'Serverless significa que no hay servidores.',
          realidad: 'Hay servidores: <b>no los administrás vos</b>. Y vienen con restricciones concretas — límite de tiempo, arranque en frío, ' +
                    'sin estado entre ejecuciones— que hay que conocer antes de elegirlo.' },

        { mito: 'Serverless siempre es más barato.',
          realidad: 'Con tráfico irregular sí. Con <b>tráfico alto y constante</b>, una instancia siempre encendida sale más barata: ' +
                    'pagás por invocación y por milisegundo. Si tu función está siempre activa, estás pagando el sobreprecio de una elasticidad ' +
                    'que no usás.' },

        { mito: 'Puedo conectar mi función directo a Postgres.',
          realidad: 'Podés, y a cierta concurrencia <b>tumbás la base</b>: cada ejecución abre su propia conexión. Hace falta un ' +
                    '<b>pooler</b> o un driver por HTTP, y configurar <code>max: 1</code> por entorno.' },

        { mito: 'Configuro un pool grande para tener buen rendimiento.',
          realidad: 'Al revés. En serverless cada entorno atiende <b>una petición por vez</b>, así que más de una conexión por entorno es capacidad ' +
                    'reservada que nadie usa — y multiplicada por la concurrencia, es lo que agota la base.' },
      ],

      glosario: [
        { t: 'Serverless', d: 'Modelo donde el proveedor gestiona los servidores y se paga por tiempo de ejecución.' },
        { t: 'Arranque en frío', d: 'Latencia extra de la primera invocación tras un período de inactividad.' },
        { t: 'Invocación tibia', d: 'Ejecución sobre un entorno que sigue cargado, sin costo de arranque.' },
        { t: 'Escala a cero', d: 'Cero instancias y cero costo cuando no hay tráfico.' },
        { t: 'Pooler', d: 'Intermediario que multiplexa muchas conexiones de aplicación sobre pocas reales.' },
        { t: 'Driver HTTP', d: 'Acceso a la base por HTTP en vez de TCP. Evita el problema de conexiones en serverless.' },
        { t: 'Edge runtime', d: 'Entorno liviano que arranca en milisegundos y corre cerca del usuario, con API limitada.' },
        { t: 'Importación dinámica', d: 'Cargar un módulo solo cuando se necesita, para reducir el arranque en frío.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'El edge: cómputo cerca del usuario',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> en vez de que el usuario viaje hasta tu servidor,
<b>tu código viaja hasta cerca del usuario</b>. Corre en cientos de puntos repartidos por el mundo.</div>

<h4>De CDN a edge</h4>
<p>Un <b>CDN</b> guarda copias de tus archivos en muchos lugares y los sirve desde el más cercano. Eso existe
hace décadas y resuelve el contenido estático.</p>
<p>El <b>edge computing</b> da el paso siguiente: en esos mismos puntos, además de guardar archivos, se puede
<b>ejecutar código</b>. Muy poco código, muy rápido, muy cerca.</p>

<h4>Para qué sirve de verdad</h4>
<ul>
<li><b>Redirecciones y reescrituras</b> — por país, por idioma, por dispositivo. Sin tocar tu servidor.</li>
<li><b>Autenticación previa</b> — validar un token y rechazar lo que no corresponde antes de que llegue al origen.</li>
<li><b>Pruebas A/B y banderas de funcionalidad</b> — decidir qué versión ve cada usuario.</li>
<li><b>Personalización liviana</b> — geolocalización, moneda, idioma.</li>
<li><b>Límite de peticiones</b> — cortar abuso en el borde, antes de que consuma tu infraestructura.</li>
</ul>

<div class="aviso"><strong>Fijate el patrón:</strong> todo eso es <b>decidir rápido y con poca información</b>.
El edge no es para tu lógica de negocio: es para lo que conviene resolver <i>antes</i> de llegar al servidor.
Si tu código necesita consultar la base varias veces, ponerlo en el edge lo hace <b>más lento</b>, porque la
base sigue estando en una sola región.</div>

<h4>Las restricciones</h4>
<ul>
<li><b>Runtime limitado.</b> No es Node completo: no hay acceso a archivos ni muchos módulos nativos.</li>
<li><b>Poco tiempo de CPU.</b> Están pensados para milisegundos, no para procesamiento.</li>
<li><b>La base sigue lejos.</b> Tu código está cerca del usuario, tus datos no.</li>
</ul>

<p>Ese último punto es la clave y el error más común: <b>acercar el cómputo sin acercar los datos puede
empeorar la latencia total</b>, porque ahora cada consulta va del edge a la región de la base en vez de ser
local.</p>
`,

      tecnico: `
<h4>El error de latencia que casi nadie anticipa</h4>
<pre><code>Usuario en Buenos Aires · base en São Paulo

Servidor en São Paulo:
  usuario → servidor  30 ms
  servidor → base      1 ms  × 3 consultas = 3 ms
  total                            ~33 ms

Función en el edge de Buenos Aires:
  usuario → edge       2 ms
  edge → base         30 ms  × 3 consultas = 90 ms   ← se paga 3 veces
  total                            ~92 ms</code></pre>
<p><b>El edge quedó casi tres veces más lento.</b> Porque la ganancia de acercarse al usuario se pierde apenas
hay que cruzar hacia los datos, y ese cruce se paga en cada consulta.</p>

<div class="dato"><strong>La regla que resuelve la confusión:</strong> el edge conviene cuando el trabajo se
puede hacer <b>sin consultar el origen</b>, o con <b>una sola consulta</b>. Redirigir por país, validar la firma
de un token, elegir una variante de prueba A/B, aplicar un límite de peticiones: todo eso se decide localmente.
En cambio, cualquier lógica que haga varias consultas pertenece a la región donde están los datos.</div>

<h4>Almacenamiento en el borde</h4>
<p>Para que el edge sirva de verdad, hace falta que los datos también estén cerca. Las opciones:</p>
<table>
<tr><th>Servicio</th><th>Qué es</th><th>Bueno para</th></tr>
<tr><td><b>KV</b></td><td>Clave-valor replicado globalmente, con consistencia eventual</td><td>Configuración, banderas, caché. Lectura intensiva</td></tr>
<tr><td><b>D1</b></td><td>SQLite distribuido</td><td>Datos relacionales livianos de lectura</td></tr>
<tr><td><b>Durable Objects</b></td><td>Objetos con estado, uno por clave, en una ubicación</td><td>Coordinación, WebSockets, contadores</td></tr>
<tr><td><b>R2</b></td><td>Objetos, sin cargo de egreso</td><td>Archivos servidos al público</td></tr>
</table>
<p><b>KV es de consistencia eventual</b>: una escritura tarda en verse en todos los puntos. Sirve para
configuración y banderas; <b>no</b> para nada donde leer un valor viejo sea un problema.</p>

<h4>Middleware en el edge, el caso más común</h4>
<p>En un proyecto de Next.js, el <code>middleware</code> corre en el edge por defecto. Es el lugar correcto
para redirecciones por idioma, chequeos rápidos de sesión y reescrituras — y el lugar <b>incorrecto</b> para
consultar la base o hacer trabajo pesado, porque se ejecuta en <b>cada petición</b>, incluidos los archivos
estáticos si no lo limitás con un <i>matcher</i>.</p>

<div class="dato"><strong>Un middleware sin <code>matcher</code> es un problema de costo silencioso:</strong>
se ejecuta también para cada imagen, cada script y cada hoja de estilo. En un sitio con muchos assets, eso
multiplica las invocaciones por diez o más sin que nadie lo note hasta ver la factura.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="#f87171" font-size="12" font-weight="700">
    EL ERROR QUE CASI NADIE ANTICIPA</text>

  <rect x="24" y="34" width="304" height="140" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.4"/>
  <text x="176" y="56" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">SERVIDOR EN SÃO PAULO</text>

  <circle cx="60" cy="90" r="10" fill="#22d3ee" fill-opacity=".6"/>
  <text x="60" y="112" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8.5">usuario</text>
  <line x1="72" y1="90" x2="140" y2="90" stroke="#fbbf24" stroke-width="2.4"/>
  <text x="106" y="84" text-anchor="middle" fill="#fbbf24" font-size="9" font-weight="700">30 ms</text>

  <rect x="144" y="76" width="60" height="28" rx="6" fill="#34d399" fill-opacity=".4"/>
  <text x="174" y="94" text-anchor="middle" fill="#06281c" font-size="9" font-weight="700">app</text>

  <line x1="206" y1="90" x2="250" y2="90" stroke="#34d399" stroke-width="2.4"/>
  <text x="228" y="84" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">1 ms</text>
  <rect x="254" y="76" width="56" height="28" rx="6" fill="#22d3ee" fill-opacity=".35"/>
  <text x="282" y="94" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">base</text>

  <text x="44" y="136" fill="currentColor" opacity=".65" font-size="10">3 consultas × 1 ms = 3 ms</text>
  <text x="176" y="160" text-anchor="middle" fill="#34d399" font-size="15" font-weight="700">~33 ms</text>

  <rect x="352" y="34" width="304" height="140" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.5"/>
  <text x="504" y="56" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">FUNCIÓN EN EL EDGE</text>

  <circle cx="388" cy="90" r="10" fill="#22d3ee" fill-opacity=".6"/>
  <text x="388" y="112" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8.5">usuario</text>
  <line x1="400" y1="90" x2="424" y2="90" stroke="#34d399" stroke-width="2.4"/>
  <text x="412" y="84" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">2 ms</text>

  <rect x="428" y="76" width="56" height="28" rx="6" fill="#c084fc" fill-opacity=".4"/>
  <text x="456" y="94" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">edge</text>

  <line x1="486" y1="84" x2="576" y2="84" stroke="#f87171" stroke-width="2"/>
  <line x1="486" y1="90" x2="576" y2="90" stroke="#f87171" stroke-width="2"/>
  <line x1="486" y1="96" x2="576" y2="96" stroke="#f87171" stroke-width="2"/>
  <text x="531" y="76" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">30 ms × 3</text>

  <rect x="580" y="76" width="56" height="28" rx="6" fill="#22d3ee" fill-opacity=".35"/>
  <text x="608" y="94" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">base</text>

  <text x="372" y="136" fill="#f87171" font-size="10" font-weight="700">3 consultas × 30 ms = 90 ms  ← se paga 3 veces</text>
  <text x="504" y="160" text-anchor="middle" fill="#f87171" font-size="15" font-weight="700">~92 ms</text>

  <text x="340" y="192" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    Acercar el cómputo sin acercar los datos puede EMPEORAR la latencia.</text>

  <line x1="24" y1="210" x2="656" y2="210" stroke="currentColor" opacity=".18"/>

  <text x="24" y="234" fill="#34d399" font-size="12" font-weight="700">
    LA REGLA: el edge sirve para decidir RÁPIDO y con POCA información</text>

  <rect x="24" y="246" width="304" height="138" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.3"/>
  <text x="176" y="268" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">✓ SÍ EN EL EDGE</text>
  <text x="44" y="290" fill="currentColor" opacity=".72" font-size="10.5">· redirigir por país o idioma</text>
  <text x="44" y="308" fill="currentColor" opacity=".72" font-size="10.5">· validar la firma de un token</text>
  <text x="44" y="326" fill="currentColor" opacity=".72" font-size="10.5">· elegir variante de prueba A/B</text>
  <text x="44" y="344" fill="currentColor" opacity=".72" font-size="10.5">· límite de peticiones y bloqueos</text>
  <text x="44" y="362" fill="#34d399" font-size="10" font-weight="700">se decide localmente, sin ir al origen</text>

  <rect x="352" y="246" width="304" height="138" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.3"/>
  <text x="504" y="268" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">✗ NO EN EL EDGE</text>
  <text x="372" y="290" fill="currentColor" opacity=".72" font-size="10.5">· lógica que consulta la base varias veces</text>
  <text x="372" y="308" fill="currentColor" opacity=".72" font-size="10.5">· procesamiento pesado (poco CPU)</text>
  <text x="372" y="326" fill="currentColor" opacity=".72" font-size="10.5">· librerías con módulos nativos</text>
  <text x="372" y="344" fill="currentColor" opacity=".72" font-size="10.5">· middleware SIN matcher ⚠</text>
  <text x="372" y="362" fill="#f87171" font-size="10" font-weight="700">sin matcher corre hasta para cada imagen</text>
</svg>`,
        pie: 'El edge es para lo que conviene resolver antes de llegar al servidor, no para reemplazarlo.',
      },

      entrevista: [
        { p: '¿Qué es el edge computing y para qué sirve?',
          r: 'Es ejecutar código en los puntos de presencia de un CDN, cerca del usuario, en lugar de en una región central. ' +
             'Sirve para <b>decidir rápido y con poca información</b>: redirecciones por país o idioma, validar la firma de un token antes de llegar ' +
             'al origen, elegir la variante de una prueba A/B, aplicar límites de peticiones. Todo eso se resuelve localmente. ' +
             'Lo que <b>no</b> va al edge es la lógica de negocio que consulta la base varias veces, porque los datos siguen estando en una sola región.' },

        { p: '¿Cuándo poner código en el edge puede empeorar la latencia?',
          r: 'Cuando ese código <b>necesita consultar el origen varias veces</b>. Un ejemplo concreto: usuario en Buenos Aires y base en São Paulo. ' +
             'Con el servidor en São Paulo son 30 ms de ida más tres consultas de 1 ms: unos 33 ms. Con la función en el edge son 2 ms hasta el edge, ' +
             'pero <b>cada una de las tres consultas cruza 30 ms</b> hasta la base: unos 92 ms. ' +
             '<b>Acercar el cómputo sin acercar los datos puede hacerlo casi tres veces más lento.</b>' },

        { p: '¿Qué cuidado hay que tener con el middleware en el edge?',
          r: 'Definir un <b><code>matcher</code></b>. Sin él, el middleware se ejecuta en <b>cada petición</b>, incluidas las de imágenes, scripts y ' +
             'hojas de estilo. En un sitio con muchos assets eso multiplica las invocaciones por diez o más, y es un problema de costo silencioso ' +
             'que nadie nota hasta ver la factura. Y lo segundo: no poner ahí consultas a la base ni trabajo pesado, porque el edge tiene poco tiempo ' +
             'de CPU y los datos están lejos.' },

        { p: '¿Qué es KV y cuándo NO usarlo?',
          r: 'Es almacenamiento clave-valor replicado globalmente, pensado para <b>lectura intensiva</b> desde el edge: configuración, banderas de ' +
             'funcionalidad, caché. Es de <b>consistencia eventual</b>, así que una escritura tarda en verse en todos los puntos. ' +
             'Por eso no sirve para nada donde leer un valor viejo sea un problema —saldos, stock, estado de un pedido, cualquier cosa transaccional—. ' +
             'Para eso van Durable Objects, que dan estado coordinado en una ubicación, o directamente la base en la región.' },
      ],

      practica: `
<h4>Middleware acotado</h4>
<pre><code>// middleware.ts
export function middleware(req) {
  // rápido y sin consultar nada externo
  const pais = req.geo?.country ?? 'AR';
  if (!req.nextUrl.pathname.startsWith('/es') &amp;&amp; pais === 'AR') {
    return NextResponse.redirect(new URL('/es' + req.nextUrl.pathname, req.url));
  }
}

// ⚠ SIN esto, corre también para cada imagen, script y hoja de estilo
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|webp)$).*)'],
};</code></pre>

<div class="aviso"><strong>Ese <code>matcher</code> es la diferencia entre unas pocas invocaciones por visita
y decenas.</strong> Es un problema de costo que no genera ningún error y que solo se descubre mirando la
factura o el contador de invocaciones.</div>

<h4>Qué va dónde</h4>
<table>
<tr><th>Tarea</th><th>Dónde</th><th>Por qué</th></tr>
<tr><td>Redirección por idioma</td><td><b>Edge</b></td><td>Decisión local, sin consultar nada</td></tr>
<tr><td>Verificar firma de un JWT</td><td><b>Edge</b></td><td>Criptografía local, sin ir a la base</td></tr>
<tr><td>Buscar la sesión en la base</td><td><b>Región</b></td><td>Requiere consultar los datos</td></tr>
<tr><td>Renderizar una página con datos</td><td><b>Región</b></td><td>Varias consultas</td></tr>
<tr><td>Servir imágenes</td><td><b>CDN</b></td><td>Estático puro</td></tr>
<tr><td>Bandera de funcionalidad</td><td><b>Edge + KV</b></td><td>Lectura eventual, tolera estar unos segundos vieja</td></tr>
<tr><td>Contador de stock</td><td><b>Región</b></td><td>KV es eventual: leerías un valor viejo</td></tr>
</table>

<h4>Cómo saber si el edge te está sirviendo</h4>
<pre><code># Medí lo mismo desde el edge y desde la región, con carga real.
# Si el edge no gana claramente, no vale la complejidad.

curl -w "total:%{time_total}\\n" -o /dev/null -s https://tuapp.com/api/x
# desde varias ubicaciones, no solo desde la tuya</code></pre>
<p>Y la pregunta que ordena la decisión: <b>¿esta ruta necesita consultar el origen?</b> Si la respuesta es sí,
y más de una vez, la región le va a ganar al edge casi siempre.</p>
`,

      errores: [
        { mito: 'Poner todo en el edge lo hace más rápido.',
          realidad: 'Solo si el código <b>no necesita consultar el origen</b>. Si hace varias consultas a una base que está en una región, ' +
                    'cada una cruza esa distancia y el resultado puede ser <b>varias veces más lento</b> que ejecutar en la región.' },

        { mito: 'El middleware es liviano, no importa dónde corra.',
          realidad: 'Sin <code>matcher</code> se ejecuta en <b>cada petición</b>, incluidas imágenes y scripts. En un sitio con muchos assets ' +
                    'multiplica las invocaciones por diez o más, sin generar ningún error.' },

        { mito: 'KV es una base de datos rápida.',
          realidad: 'Es <b>clave-valor de consistencia eventual</b>: una escritura tarda en verse en todos los puntos. Sirve para configuración, ' +
                    'banderas y caché; no para saldos, stock ni nada transaccional, donde leer un valor viejo es un problema real.' },

        { mito: 'El edge runtime es Node con otro nombre.',
          realidad: 'Es un entorno <b>limitado</b>: sin acceso a archivos, sin muchos módulos de Node, sin librerías con binarios nativos, ' +
                    'y con poco tiempo de CPU. Arranca en milisegundos justamente porque no levanta un Node completo.' },
      ],

      glosario: [
        { t: 'Edge computing', d: 'Ejecutar código en puntos de presencia distribuidos, cerca del usuario.' },
        { t: 'Punto de presencia (PoP)', d: 'Cada ubicación de la red donde se cachea contenido y se ejecuta código.' },
        { t: 'Edge runtime', d: 'Entorno de ejecución liviano y limitado, sin acceso a archivos ni módulos nativos.' },
        { t: 'KV', d: 'Almacenamiento clave-valor replicado globalmente, de consistencia eventual.' },
        { t: 'Durable Objects', d: 'Objetos con estado coordinado, uno por clave, en una ubicación fija.' },
        { t: 'Middleware', d: 'Código que corre antes de cada petición. En el edge, necesita un matcher.' },
        { t: 'Matcher', d: 'Patrón que limita para qué rutas se ejecuta el middleware. Evita invocaciones innecesarias.' },
        { t: 'Consistencia eventual', d: 'Los cambios se propagan con retraso; una lectura puede devolver un valor viejo.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es la diferencia entre IaaS y PaaS?',
      opciones: [
        'Con IaaS administrás el sistema operativo hacia arriba; con PaaS subís código y la plataforma se encarga',
        'IaaS es más barato siempre',
        'PaaS solo sirve para sitios estáticos',
        'IaaS no permite usar contenedores',
      ],
      correcta: 0,
      porQue: 'Es una escala de cuánto administrás vos. Y no hay una capa correcta para todo el proyecto: se elige por pieza — app en PaaS, base en SaaS, workers en IaaS.',
      porQueNo: {
        1: 'Depende del uso: un PaaS puede salir más barato si evita horas de trabajo.',
        2: 'Los PaaS ejecutan aplicaciones completas con backend.',
        3: 'Un VPS corre contenedores perfectamente.',
      },
    },
    {
      p: '¿Qué significa el modelo de responsabilidad compartida?',
      opciones: [
        'El proveedor asegura la nube; vos asegurás tu código, tus datos, el acceso y la configuración',
        'Que el costo se divide entre proveedor y cliente',
        'Que el soporte técnico es compartido',
        'Que ambos son responsables legalmente por igual',
      ],
      correcta: 0,
      porQue: 'El malentendido más caro es creer que "está en la nube" significa "está respaldado y seguro". Te garantizan durabilidad de infraestructura, no te protegen de una migración que borra datos.',
      porQueNo: {
        1: 'No tiene que ver con el reparto de costos.',
        2: 'El soporte es un servicio aparte.',
        3: 'La responsabilidad legal sobre los datos suele ser del cliente.',
      },
    },
    {
      p: '¿Cuál es el principio de Twelve-Factor que más se incumple?',
      opciones: [
        'Procesos sin estado: sesiones en memoria, archivos en disco local, caché en variables',
        'Usar control de versiones',
        'Tener documentación actualizada',
        'Escribir tests',
      ],
      correcta: 0,
      porQue: 'Con una instancia funciona; con dos, el usuario que cae en la otra pierde la sesión o no encuentra su archivo. Si tu aplicación no puede correr en dos instancias, no puede escalar.',
      porQueNo: {
        1: 'Prácticamente todos los equipos lo cumplen.',
        2: 'Es importante pero no es uno de los doce factores.',
        3: 'Tampoco es un factor, y no impide escalar.',
      },
    },
    {
      p: '¿Cuál es la latencia típica entre zonas de una misma región?',
      opciones: ['Menos de 2 ms', 'Unos 30 ms', 'Unos 120 ms', 'Más de 200 ms'],
      correcta: 0,
      porQue: 'Por eso multi-zona es barato y permite replicación sincrónica sin penalidad, mientras que multi-región es caro y trae el problema de la consistencia.',
      porQueNo: {
        1: 'Ese es el orden de magnitud entre países cercanos, como Buenos Aires y São Paulo.',
        2: 'Ese es el orden entre continentes.',
        3: 'Ese sería un recorrido muy largo, como Buenos Aires a Frankfurt.',
      },
    },
    {
      p: '¿Recomendarías una arquitectura multi-región por defecto?',
      opciones: [
        'No: multi-zona cubre el fallo más probable a bajo costo; multi-región es caro y trae problemas de consistencia',
        'Sí, es la única forma de tener alta disponibilidad',
        'Sí, porque reduce la latencia de todos los usuarios',
        'Depende únicamente del presupuesto',
      ],
      correcta: 0,
      porQue: 'Las caídas de una región completa son raras. Para la mayoría de los productos, unas horas de indisponibilidad al año son aceptables; si no lo son, es una decisión de negocio con presupuesto propio.',
      porQueNo: {
        1: 'Multi-zona ya da alta disponibilidad frente al fallo más probable.',
        2: 'Reduce latencia de lectura, pero complica las escrituras y la consistencia.',
        3: 'Además del costo, está el problema técnico de la consistencia de datos.',
      },
    },
    {
      p: 'Tu aplicación hace 10 peticiones en serie a un servidor a 120 ms. ¿Cuánto tiempo es solo de viaje?',
      opciones: ['Unos 1.200 ms', 'Unos 120 ms', 'Unos 12 ms', 'Depende del ancho de banda'],
      correcta: 0,
      porQue: 'Cada petición espera a la anterior. Las mismas diez en paralelo tardarían unos 120 ms. La latencia no se arregla con más CPU: se arregla con menos viajes.',
      porQueNo: {
        1: 'Ese sería el tiempo si fueran en paralelo.',
        2: 'No hay forma de que diez viajes de 120 ms sumen 12.',
        3: 'La latencia depende de la distancia, no del ancho de banda.',
      },
    },
    {
      p: '¿Por qué la consulta N+1 es tan peligrosa?',
      opciones: [
        'En desarrollo, con la base local, no se nota; en producción cada consulta suma latencia de red',
        'Porque consume mucha memoria',
        'Porque bloquea la base de datos',
        'Porque genera errores de tipo',
      ],
      correcta: 0,
      porQue: 'Cincuenta consultas locales tardan milisegundos y pasan desapercibidas. Con 2 ms de red cada una son 100 ms extra por petición. Es de los problemas que más tarde se descubren.',
      porQueNo: {
        1: 'El consumo de memoria no es el problema principal.',
        2: 'Son consultas normales; no bloquean nada.',
        3: 'No tiene relación con el sistema de tipos.',
      },
    },
    {
      p: '¿Qué significa "serverless"?',
      opciones: [
        'Que no administrás los servidores y pagás solo mientras tu código se ejecuta',
        'Que no hay servidores involucrados',
        'Que el código corre en el navegador',
        'Que no necesitás base de datos',
      ],
      correcta: 0,
      porQue: 'Hay servidores: no los administrás vos. Y viene con restricciones concretas: arranque en frío, límite de tiempo, sin estado entre ejecuciones y el problema de las conexiones.',
      porQueNo: {
        1: 'Los servidores existen, solo que gestionados por el proveedor.',
        2: 'Corre en infraestructura del proveedor, no en el cliente.',
        3: 'La base sigue siendo necesaria, y es justamente donde aparece el problema.',
      },
    },
    {
      p: '¿Cuál es el problema más grande de serverless con una base relacional?',
      opciones: [
        'Cada ejecución concurrente abre su propia conexión y satura el límite de la base',
        'Que las consultas son más lentas',
        'Que no se pueden usar transacciones',
        'Que no soporta SQL',
      ],
      correcta: 0,
      porQue: 'Mil peticiones simultáneas intentan mil conexiones contra una base que acepta cien. Se resuelve con un pooler o con un driver por HTTP, y configurando max: 1 por entorno.',
      porQueNo: {
        1: 'La velocidad de la consulta no cambia por ser serverless.',
        2: 'Las transacciones funcionan normalmente.',
        3: 'SQL funciona igual: el problema es la cantidad de conexiones.',
      },
    },
    {
      p: 'En una función serverless, ¿qué valor de pool de conexiones conviene?',
      opciones: [
        'max: 1, porque cada entorno atiende una petición por vez',
        'max: 10, como en una aplicación tradicional',
        'El mayor posible, para tener buen rendimiento',
        'No hace falta configurarlo',
      ],
      correcta: 0,
      porQue: 'Es contraintuitivo y correcto: más de una conexión por entorno es capacidad reservada que nadie usa, y multiplicada por la concurrencia es lo que agota la base.',
      porQueNo: {
        1: 'Multiplicado por mil entornos concurrentes serían diez mil conexiones.',
        2: 'Es exactamente lo que tumba la base en serverless.',
        3: 'El default suele ser demasiado alto para este modelo.',
      },
    },
    {
      p: '¿Cómo se reduce el arranque en frío?',
      opciones: [
        'Reduciendo el tamaño del paquete y usando importaciones dinámicas para lo que no siempre se necesita',
        'Aumentando la memoria asignada a la función',
        'Usando un modelo de base de datos más rápido',
        'Ejecutando la función más seguido',
      ],
      correcta: 0,
      porQue: 'La parte que controlás es la inicialización de tu módulo, que suele ser la más grande. Una función de 50 MB que importa tres SDKs arranca mucho más lento que una de 2 MB.',
      porQueNo: {
        1: 'Puede ayudar algo en algunas plataformas, pero no ataca la causa principal.',
        2: 'La base no interviene en el arranque del entorno.',
        3: 'Mantiene entornos tibios, pero es un parche costoso y no siempre confiable.',
      },
    },
    {
      p: '¿Cuándo serverless deja de convenir económicamente?',
      opciones: [
        'Con tráfico alto y constante: pagás por invocación y por milisegundo',
        'Cuando hay muchos usuarios distintos',
        'Cuando el código es muy largo',
        'Nunca: siempre es más barato',
      ],
      correcta: 0,
      porQue: 'A cierto volumen una instancia siempre encendida sale más barata. La señal es simple: si tu función está prácticamente siempre activa, estás pagando el sobreprecio de una elasticidad que no usás.',
      porQueNo: {
        1: 'Lo que importa es el patrón de tráfico, no cuántos usuarios distintos hay.',
        2: 'La longitud del código afecta el arranque, no el modelo de costo.',
        3: 'Con tráfico constante, una instancia dedicada suele ganar.',
      },
    },
    {
      p: '¿Cuándo poner código en el edge puede EMPEORAR la latencia?',
      opciones: [
        'Cuando ese código necesita consultar varias veces una base que está en una región',
        'Cuando hay muchos usuarios',
        'Cuando el código es muy corto',
        'Nunca: el edge siempre es más rápido',
      ],
      correcta: 0,
      porQue: 'Con usuario en Buenos Aires y base en São Paulo: servidor en la región son ~33 ms; función en el edge son ~92 ms, porque cada una de las tres consultas cruza 30 ms.',
      porQueNo: {
        1: 'El edge está justamente pensado para escalar con muchos usuarios.',
        2: 'El código corto es el caso ideal para el edge.',
        3: 'Solo es más rápido si no necesita ir al origen.',
      },
    },
    {
      p: '¿Qué cuidado hay que tener con el middleware en el edge?',
      opciones: [
        'Definir un matcher: sin él se ejecuta en cada petición, incluidas imágenes y scripts',
        'Escribirlo en TypeScript',
        'Evitar usar cookies',
        'Limitarlo a rutas de API',
      ],
      correcta: 0,
      porQue: 'Sin matcher, en un sitio con muchos assets las invocaciones se multiplican por diez o más. Es un problema de costo silencioso que no genera ningún error.',
      porQueNo: {
        1: 'El lenguaje no afecta cuántas veces se ejecuta.',
        2: 'Las cookies se usan normalmente en middleware.',
        3: 'Suele usarse justamente para rutas de páginas, no de API.',
      },
    },
    {
      p: '¿Para qué NO conviene usar KV en el edge?',
      opciones: [
        'Para saldos, stock o cualquier dato donde leer un valor viejo sea un problema',
        'Para banderas de funcionalidad',
        'Para configuración de la aplicación',
        'Para caché de respuestas',
      ],
      correcta: 0,
      porQue: 'KV es de consistencia eventual: una escritura tarda en verse en todos los puntos. Para datos transaccionales van Durable Objects o la base en la región.',
      porQueNo: {
        1: 'Es uno de sus casos ideales: tolera estar unos segundos desactualizado.',
        2: 'Igual: cambia poco y la lectura eventual es aceptable.',
        3: 'También es un buen encaje, porque el caché por definición puede estar algo viejo.',
      },
    },
  ],
});
