/* ==========================================================================
   Infra · Módulo 01 — Contenedores y Docker
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'infra',
  id: 'm01',
  titulo: 'Contenedores y Docker',
  fuentes: ['docker', 'docker-buenas-practicas', 'oci', '12factor'],

  intro:
    '<p>Docker es de esas herramientas que se usan mucho antes de entenderlas. Se copia un <code>Dockerfile</code> ' +
    'de internet, funciona, y nadie vuelve a mirarlo — hasta que la imagen pesa 1,2 GB, el build tarda ocho ' +
    'minutos o algo anda distinto en producción.</p>' +
    '<p>Este módulo te da el modelo mental correcto: qué es realmente un contenedor, por qué las capas explican ' +
    'casi todo, y qué cambia cuando eso pasa de tu máquina a un servidor.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Qué problema resuelve un contenedor',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un contenedor empaqueta <b>tu aplicación y todo
lo que necesita para correr</b> en un solo bulto, para que se comporte igual en tu máquina y en el servidor.</div>

<h4>El problema, que es viejísimo</h4>
<p>"En mi máquina anda." Y es verdad: anda. Pero tu máquina tiene Node 22, el servidor tiene Node 18. Vos tenés
una librería del sistema que el servidor no tiene. Tu compañero tiene otra versión de Postgres.</p>
<p>Un contenedor elimina esa clase entera de problemas: lo que probaste es <b>literalmente lo mismo</b> que se
ejecuta en producción, con las mismas versiones de todo.</p>

<h4>Contenedor no es máquina virtual</h4>
<p>Esta distinción es la pregunta de entrevista número uno del tema:</p>
<table>
<tr><th></th><th>Máquina virtual</th><th>Contenedor</th></tr>
<tr><td>Qué virtualiza</td><td>El <b>hardware</b> entero</td><td>Solo el <b>sistema de archivos y los procesos</b></td></tr>
<tr><td>Sistema operativo</td><td>Uno completo por VM</td><td><b>Comparte el kernel</b> del host</td></tr>
<tr><td>Tamaño</td><td>Gigabytes</td><td>Decenas o cientos de megas</td></tr>
<tr><td>Arranque</td><td>Minutos</td><td><b>Milisegundos</b></td></tr>
<tr><td>Cuántos por máquina</td><td>Unos pocos</td><td>Decenas o cientos</td></tr>
</table>

<p><b>Lo clave:</b> un contenedor <b>no lleva un sistema operativo adentro</b>. Usa el kernel de la máquina
anfitriona. Lo que lleva es el resto: las librerías, los binarios, tu código.</p>

<div class="aviso"><strong>La consecuencia práctica que sorprende:</strong> un contenedor Linux <b>no puede
correr en un kernel Windows</b>. Cuando usás Docker en Windows o Mac, hay una máquina virtual Linux liviana
por debajo que no ves. Por eso Docker es más lento en esas plataformas, sobre todo al leer y escribir archivos
del disco compartido.</div>

<h4>Imagen y contenedor</h4>
<p>Otra distinción que se confunde todo el tiempo:</p>
<ul>
<li><b>Imagen</b> — la plantilla. Un archivo inmutable con tu app y sus dependencias. Es como una clase.</li>
<li><b>Contenedor</b> — una imagen <i>ejecutándose</i>. Es como una instancia.</li>
</ul>
<p>De una imagen podés levantar veinte contenedores idénticos. Y cuando un contenedor muere, <b>todo lo que
escribió adentro desaparece</b> — salvo que lo hayas guardado afuera, que es la lección 3.</p>
`,

      tecnico: `
<h4>Cómo funciona por debajo</h4>
<p>Un contenedor no es una tecnología nueva: es una combinación de funciones del kernel de Linux que existen
hace más de una década.</p>
<ul>
<li><b>Namespaces</b> — aíslan lo que el proceso <i>ve</i>: su propio árbol de procesos, su red, su sistema de archivos, sus usuarios. Adentro, tu proceso cree que es el PID 1 de una máquina limpia.</li>
<li><b>cgroups</b> — limitan lo que el proceso <i>consume</i>: CPU, memoria, entrada/salida.</li>
<li><b>Sistema de archivos por capas</b> — la imagen se construye apilando capas de solo lectura, con una capa escribible encima al ejecutar.</li>
</ul>
<p>Docker es una interfaz cómoda sobre eso. Por eso <b>no hay virtualización</b>: los procesos del contenedor
son procesos normales del host, y si hacés <code>ps aux</code> en la máquina anfitriona, <b>los ves</b>.</p>

<div class="dato"><strong>Implicancia de seguridad que se pasa por alto:</strong> como comparten el kernel, el
aislamiento de un contenedor es <b>más débil que el de una máquina virtual</b>. Una vulnerabilidad del kernel
puede permitir escapar del contenedor. Por eso los proveedores de nube que ejecutan código de terceros usan
capas adicionales —gVisor, Firecracker, Kata— que agregan una frontera real. Para tus propias aplicaciones el
aislamiento de Docker alcanza; para ejecutar código no confiable, no.</div>

<h4>El ecosistema, sin confusión</h4>
<table>
<tr><th>Pieza</th><th>Qué es</th></tr>
<tr><td><b>OCI</b></td><td>El estándar de formato de imágenes y runtime. Por eso las imágenes son portables entre herramientas</td></tr>
<tr><td><b>runc</b></td><td>El runtime de bajo nivel que efectivamente crea el contenedor</td></tr>
<tr><td><b>containerd</b></td><td>El demonio que gestiona el ciclo de vida. Es lo que usa Kubernetes</td></tr>
<tr><td><b>Docker</b></td><td>La herramienta de desarrollo: CLI, build, compose. Usa containerd por debajo</td></tr>
<tr><td><b>Podman</b></td><td>Alternativa sin demonio y sin root. Compatible con los mismos comandos</td></tr>
</table>
<p>Dato para entrevista: <b>Kubernetes dejó de usar Docker como runtime</b> en la versión 1.24. No significa que
las imágenes de Docker no sirvan —son OCI y funcionan igual—: significa que ya no hace falta el demonio de
Docker en cada nodo.</p>

<h4>Cuándo un contenedor NO es la respuesta</h4>
<ul>
<li>Un sitio estático — va a un CDN, no necesita un proceso corriendo.</li>
<li>Una función que corre por evento — el modelo serverless ya lo resuelve.</li>
<li>Aplicaciones de escritorio o cargas con GPU en Mac o Windows — la capa de virtualización molesta más de lo que ayuda.</li>
<li>Un proyecto de una persona en una plataforma gestionada que ya construye por vos.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="#f87171" font-size="12" font-weight="700">MÁQUINAS VIRTUALES — cada una con su sistema operativo</text>

  <rect x="24" y="36" width="304" height="150" rx="10" fill="currentColor" fill-opacity=".04" stroke="currentColor" stroke-opacity=".3" stroke-width="1.3"/>

  <rect x="34" y="46" width="92" height="90" rx="7" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.1"/>
  <rect x="40" y="52" width="80" height="20" rx="4" fill="#34d399" fill-opacity=".4"/>
  <text x="80" y="66" text-anchor="middle" fill="currentColor" font-size="8.5" font-weight="700">app</text>
  <rect x="40" y="76" width="80" height="20" rx="4" fill="currentColor" fill-opacity=".15"/>
  <text x="80" y="90" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8">librerías</text>
  <rect x="40" y="100" width="80" height="30" rx="4" fill="#f87171" fill-opacity=".4"/>
  <text x="80" y="114" text-anchor="middle" fill="currentColor" font-size="8.5" font-weight="700">SO completo</text>
  <text x="80" y="126" text-anchor="middle" fill="#f87171" font-size="7.5">~2 GB</text>

  <rect x="132" y="46" width="92" height="90" rx="7" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.1"/>
  <rect x="138" y="52" width="80" height="20" rx="4" fill="#22d3ee" fill-opacity=".4"/>
  <text x="178" y="66" text-anchor="middle" fill="currentColor" font-size="8.5" font-weight="700">app</text>
  <rect x="138" y="76" width="80" height="20" rx="4" fill="currentColor" fill-opacity=".15"/>
  <text x="178" y="90" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8">librerías</text>
  <rect x="138" y="100" width="80" height="30" rx="4" fill="#f87171" fill-opacity=".4"/>
  <text x="178" y="114" text-anchor="middle" fill="currentColor" font-size="8.5" font-weight="700">SO completo</text>
  <text x="178" y="126" text-anchor="middle" fill="#f87171" font-size="7.5">~2 GB</text>

  <rect x="230" y="46" width="88" height="90" rx="7" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.1"/>
  <text x="274" y="94" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9">…</text>

  <rect x="34" y="142" width="284" height="18" rx="4" fill="#7c5cff" fill-opacity=".3"/>
  <text x="176" y="155" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">hipervisor</text>
  <rect x="34" y="164" width="284" height="16" rx="4" fill="currentColor" fill-opacity=".12"/>
  <text x="176" y="176" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8.5">hardware</text>

  <text x="352" y="24" fill="#34d399" font-size="12" font-weight="700">CONTENEDORES — comparten el kernel</text>

  <rect x="352" y="36" width="304" height="150" rx="10" fill="currentColor" fill-opacity=".04" stroke="currentColor" stroke-opacity=".3" stroke-width="1.3"/>

  <rect x="362" y="46" width="70" height="60" rx="7" fill="#34d399" fill-opacity=".18" stroke="#34d399" stroke-width="1.1"/>
  <rect x="368" y="52" width="58" height="22" rx="4" fill="#34d399" fill-opacity=".5"/>
  <text x="397" y="67" text-anchor="middle" fill="currentColor" font-size="8.5" font-weight="700">app</text>
  <rect x="368" y="78" width="58" height="22" rx="4" fill="currentColor" fill-opacity=".15"/>
  <text x="397" y="93" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8">librerías</text>
  <text x="397" y="118" text-anchor="middle" fill="#34d399" font-size="8" font-weight="700">~80 MB</text>

  <rect x="440" y="46" width="70" height="60" rx="7" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.1"/>
  <rect x="446" y="52" width="58" height="22" rx="4" fill="#22d3ee" fill-opacity=".5"/>
  <text x="475" y="67" text-anchor="middle" fill="currentColor" font-size="8.5" font-weight="700">app</text>
  <rect x="446" y="78" width="58" height="22" rx="4" fill="currentColor" fill-opacity=".15"/>
  <text x="475" y="93" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8">librerías</text>
  <text x="475" y="118" text-anchor="middle" fill="#22d3ee" font-size="8" font-weight="700">~80 MB</text>

  <rect x="518" y="46" width="70" height="60" rx="7" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.1"/>
  <text x="553" y="80" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">app</text>
  <rect x="596" y="46" width="50" height="60" rx="7" fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-opacity=".25" stroke-width="1"/>
  <text x="621" y="80" text-anchor="middle" fill="currentColor" opacity=".45" font-size="9">…</text>

  <rect x="362" y="130" width="284" height="20" rx="4" fill="#7c5cff" fill-opacity=".3"/>
  <text x="504" y="144" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">motor de contenedores</text>
  <rect x="362" y="154" width="284" height="20" rx="4" fill="#34d399" fill-opacity=".35"/>
  <text x="504" y="168" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">UN SOLO kernel, compartido</text>

  <text x="352" y="200" fill="#34d399" font-size="10.5" font-weight="700">
    Arranque en milisegundos · decenas por máquina</text>

  <line x1="24" y1="216" x2="656" y2="216" stroke="currentColor" opacity=".18"/>

  <text x="24" y="240" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    IMAGEN vs CONTENEDOR — se confunden todo el tiempo</text>

  <rect x="24" y="252" width="304" height="70" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="176" y="274" text-anchor="middle" fill="#7c5cff" font-size="12" font-weight="700">IMAGEN</text>
  <text x="176" y="294" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">la plantilla, inmutable</text>
  <text x="176" y="311" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10">como una clase</text>

  <rect x="352" y="252" width="304" height="70" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="274" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">CONTENEDOR</text>
  <text x="504" y="294" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">la imagen ejecutándose</text>
  <text x="504" y="311" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10">como una instancia</text>

  <rect x="24" y="334" width="632" height="52" rx="9" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="356" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">
    Un contenedor Linux NO puede correr en un kernel Windows.</text>
  <text x="340" y="376" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10.5">
    En Windows y Mac hay una VM Linux liviana por debajo que no ves — de ahí la lentitud con archivos compartidos.</text>
</svg>`,
        pie: 'Un contenedor no lleva un sistema operativo: usa el del host. Todo lo demás se deriva de eso.',
      },

      entrevista: [
        { p: '¿Cuál es la diferencia entre un contenedor y una máquina virtual?',
          r: 'Una máquina virtual virtualiza el <b>hardware</b> y corre un sistema operativo completo por instancia: pesa gigabytes y arranca en ' +
             'minutos. Un contenedor <b>comparte el kernel del host</b> y solo aísla el sistema de archivos, los procesos y la red usando ' +
             '<i>namespaces</i> y <i>cgroups</i> del kernel de Linux: pesa decenas de megas y arranca en milisegundos. ' +
             'Dos consecuencias prácticas: <b>un contenedor Linux no corre sobre un kernel Windows</b> —en Windows y Mac hay una VM Linux por debajo—, ' +
             'y el <b>aislamiento es más débil</b>, porque una vulnerabilidad del kernel puede permitir escapar.' },

        { p: '¿Qué diferencia hay entre una imagen y un contenedor?',
          r: 'La imagen es la <b>plantilla inmutable</b>: un conjunto de capas de solo lectura con tu aplicación y sus dependencias. ' +
             'El contenedor es esa imagen <b>ejecutándose</b>, con una capa escribible encima. La analogía es clase e instancia: de una imagen ' +
             'levantás veinte contenedores idénticos. Y lo importante en la práctica: cuando el contenedor muere, <b>todo lo que escribió en su capa ' +
             'desaparece</b>, salvo que lo hayas persistido en un volumen.' },

        { p: '¿Es seguro ejecutar código no confiable en un contenedor?',
          r: 'No sin capas adicionales. Como los contenedores <b>comparten el kernel del host</b>, el aislamiento es más débil que el de una máquina ' +
             'virtual: una vulnerabilidad del kernel puede permitir escapar. Para mis propias aplicaciones el aislamiento de Docker alcanza, ' +
             'pero para ejecutar código de terceros hacen falta runtimes con una frontera real —gVisor, Firecracker, Kata—, que es lo que usan ' +
             'los proveedores de nube que ofrecen ese servicio.' },

        { p: 'Escuchaste que "Kubernetes dejó de soportar Docker". ¿Qué significa?',
          r: 'Que a partir de la versión 1.24 Kubernetes dejó de usar el <b>demonio de Docker</b> como runtime, y usa containerd o CRI-O directamente. ' +
             '<b>Las imágenes de Docker siguen funcionando exactamente igual</b>, porque son imágenes OCI, un formato estándar. ' +
             'Lo único que cambió es que ya no hace falta instalar Docker en cada nodo del clúster. Fue un anuncio que generó mucha confusión ' +
             'y en la práctica casi no afectó a nadie que solo construyera imágenes.' },
      ],

      practica: `
<h4>Los comandos que se usan de verdad</h4>
<pre><code># construir una imagen desde el Dockerfile del directorio actual
docker build -t mi-app:1.0 .

# correr un contenedor: puerto host → puerto contenedor
docker run -p 3000:3000 --env-file .env mi-app:1.0

# ver qué está corriendo
docker ps
docker ps -a            # incluye los que terminaron

# entrar a un contenedor que ya corre  ← el más útil para depurar
docker exec -it &lt;id&gt; sh

# ver los logs
docker logs -f &lt;id&gt;

# por qué murió, cuánta memoria usaba
docker inspect &lt;id&gt; | grep -A5 State
docker stats

# limpiar lo que ya no se usa (libera muchísimo disco)
docker system prune -a</code></pre>

<div class="aviso"><strong><code>docker exec -it &lt;id&gt; sh</code> es el comando que más veces te va a salvar.</strong>
Te mete adentro del contenedor <i>corriendo</i>, con su sistema de archivos y sus variables de entorno reales.
La mitad de los problemas de "anda distinto en el contenedor" se resuelven mirando desde adentro qué archivos
hay y qué variables llegaron.</div>

<h4>Diagnóstico: el contenedor se muere apenas arranca</h4>
<pre><code># 1 · ¿qué dijo antes de morir?
docker logs &lt;id&gt;

# 2 · ¿con qué código de salida?
docker inspect &lt;id&gt; --format '{{.State.ExitCode}}'
#   0   → terminó normalmente (¿tu comando no era un proceso de larga duración?)
#   1   → error de la aplicación
#   137 → lo mataron por MEMORIA (OOMKilled)  ← el más común
#   139 → segfault

# 3 · si es 137, confirmalo
docker inspect &lt;id&gt; --format '{{.State.OOMKilled}}'</code></pre>

<p>Ese <b>código 137</b> es el equivalente en contenedores del "se reinicia sin logs" del módulo anterior: el
contenedor superó su límite de memoria y el kernel lo mató. La solución es subir el límite o arreglar la fuga,
pero primero hay que saber que es eso.</p>

<h4>Cuándo NO usar Docker</h4>
<table>
<tr><th>Caso</th><th>Qué conviene</th></tr>
<tr><td>Sitio estático</td><td>Un CDN: no necesita un proceso corriendo</td></tr>
<tr><td>Función por evento</td><td>Serverless, que ya lo resuelve</td></tr>
<tr><td>Proyecto de una persona en Vercel</td><td>La plataforma ya construye por vos</td></tr>
<tr><td>Desarrollo con hot reload en Mac/Windows</td><td>Correr nativo: el disco compartido es lento</td></tr>
</table>
`,

      errores: [
        { mito: 'Un contenedor es una máquina virtual liviana.',
          realidad: 'No hay virtualización: los procesos del contenedor son <b>procesos normales del host</b>, y los ves con <code>ps aux</code> ' +
                    'desde la máquina anfitriona. Lo que hay es aislamiento por <i>namespaces</i> y límites por <i>cgroups</i>. ' +
                    'De ahí que arranquen en milisegundos.' },

        { mito: 'Si anda en el contenedor, anda en cualquier lado.',
          realidad: 'Anda en cualquier lado <b>con el mismo kernel y la misma arquitectura</b>. Una imagen construida en un Mac con chip ARM ' +
                    'no corre en un servidor x86 sin construirla para esa plataforma — es una fuente de sorpresas muy común, ' +
                    'y se resuelve con <code>--platform</code> o con builds multi-arquitectura.' },

        { mito: 'Los datos del contenedor persisten.',
          realidad: 'Cuando el contenedor muere, <b>su capa escribible desaparece</b>. Todo lo que tenga que sobrevivir va en un volumen o en un ' +
                    'servicio externo. Es la causa número uno de "se me borró la base de datos de desarrollo".' },

        { mito: 'Un contenedor aísla lo suficiente para ejecutar código no confiable.',
          realidad: 'Comparte el kernel, así que el aislamiento es <b>más débil que el de una VM</b>. Para código de terceros hacen falta runtimes ' +
                    'con frontera real como gVisor o Firecracker. Para tus propias aplicaciones, Docker alcanza.' },
      ],

      glosario: [
        { t: 'Contenedor', d: 'Proceso aislado que comparte el kernel del host, con su propio sistema de archivos y red.' },
        { t: 'Imagen', d: 'Plantilla inmutable en capas con la aplicación y sus dependencias.' },
        { t: 'Namespace', d: 'Función del kernel que aísla lo que un proceso ve: procesos, red, archivos, usuarios.' },
        { t: 'cgroup', d: 'Función del kernel que limita lo que un proceso consume: CPU, memoria, entrada/salida.' },
        { t: 'OCI', d: 'Open Container Initiative. El estándar que hace las imágenes portables entre herramientas.' },
        { t: 'containerd', d: 'Demonio que gestiona contenedores. Es lo que usa Kubernetes desde la versión 1.24.' },
        { t: 'Exit code 137', d: 'El contenedor fue matado por exceder su límite de memoria (OOMKilled).' },
        { t: 'Multi-arquitectura', d: 'Imagen construida para varias arquitecturas (ARM y x86) en un solo tag.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Imágenes, capas y Dockerfile',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> una imagen se construye por <b>capas apiladas</b>,
y cada instrucción del <code>Dockerfile</code> agrega una. Entender eso explica por qué tu build tarda ocho
minutos y por qué tu imagen pesa 1,2 GB.</div>

<h4>Cada línea es una capa</h4>
<pre><code>FROM node:22-alpine        ← capa 1: el sistema base
WORKDIR /app               ← capa 2
COPY package.json ./       ← capa 3
RUN npm install            ← capa 4  (la pesada y la lenta)
COPY . .                   ← capa 5
CMD ["node", "server.js"]  ← metadato, no capa</code></pre>

<h4>La caché: la regla que lo cambia todo</h4>
<p>Docker cachea cada capa. Al reconstruir, <b>reutiliza las capas anteriores mientras nada haya cambiado</b>.
Pero apenas una capa cambia, <b>todas las que siguen se rehacen</b>.</p>

<p>De ahí sale la regla más importante del módulo:</p>

<div class="aviso"><strong>Poné lo que cambia poco arriba y lo que cambia mucho abajo.</strong><br><br>
Tu <code>package.json</code> cambia una vez por semana. Tu código cambia veinte veces por día. Si copiás todo
junto antes de instalar dependencias, <b>reinstalás todo en cada cambio de código</b>. Si copiás primero solo el
<code>package.json</code>, la instalación queda cacheada y el build baja de minutos a segundos.</div>

<h4>El error clásico, y su versión correcta</h4>
<pre><code># ❌ Cualquier cambio de código reinstala TODAS las dependencias
COPY . .
RUN npm install

# ✅ Las dependencias solo se reinstalan si cambió el manifiesto
COPY package.json package-lock.json ./
RUN npm ci
COPY . .</code></pre>
<p>Es un cambio de dos líneas y suele ser la diferencia entre un build de 4 minutos y uno de 20 segundos.</p>

<h4>Multi-stage: por qué tu imagen no debería pesar 1 GB</h4>
<p>Para construir necesitás el compilador, las dependencias de desarrollo, las herramientas. Para <b>ejecutar</b>
no necesitás nada de eso.</p>
<p>Un build <b>multi-etapa</b> construye en una imagen grande y después copia <b>solo el resultado</b> a una
imagen mínima. La imagen final no lleva ni el código fuente ni las herramientas de construcción.</p>
<p>Es normal pasar de 1,2 GB a 150 MB. Y eso no es solo disco: son despliegues más rápidos y una superficie de
ataque mucho menor.</p>
`,

      tecnico: `
<h4>Dockerfile de producción para Node</h4>
<pre><code># ---------- etapa 1: dependencias ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable &amp;&amp; pnpm install --frozen-lockfile

# ---------- etapa 2: build ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable &amp;&amp; pnpm build

# ---------- etapa 3: la imagen final, mínima ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# usuario sin privilegios: nunca corras como root
RUN addgroup -g 1001 nodejs &amp;&amp; adduser -S -u 1001 -G nodejs app

COPY --from=build --chown=app:nodejs /app/.next/standalone ./
COPY --from=build --chown=app:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=app:nodejs /app/public ./public

USER app
EXPOSE 3000

# forma "exec": el proceso recibe las señales del sistema
CMD ["node", "server.js"]</code></pre>

<div class="dato"><strong>La forma de <code>CMD</code> importa más de lo que parece.</strong> Con
<code>CMD node server.js</code> (forma <i>shell</i>), el proceso arranca bajo un shell y <b>no recibe
<code>SIGTERM</code></b>: tu apagado ordenado nunca se ejecuta y cada deploy corta peticiones a la mitad.
Con <code>CMD ["node", "server.js"]</code> (forma <i>exec</i>), tu proceso es el PID 1 y recibe las señales.
Es un par de corchetes que arregla una clase entera de errores intermitentes.</div>

<h4>Elegir la imagen base</h4>
<table>
<tr><th>Base</th><th>Tamaño aprox.</th><th>Cuándo</th></tr>
<tr><td><code>node:22</code></td><td>~1.100 MB</td><td>Casi nunca. Trae medio Debian</td></tr>
<tr><td><code>node:22-slim</code></td><td>~250 MB</td><td>Buen default. Debian recortado, glibc</td></tr>
<tr><td><code>node:22-alpine</code></td><td>~180 MB</td><td>El más chico usable. Usa <b>musl</b>, no glibc</td></tr>
<tr><td><code>distroless</code></td><td>~120 MB</td><td>Sin shell ni gestor de paquetes. Máxima seguridad, imposible de depurar desde adentro</td></tr>
</table>

<p><b>La trampa de Alpine:</b> usa <code>musl</code> en lugar de <code>glibc</code>. Los paquetes con binarios
nativos —sharp, bcrypt, canvas, algunos drivers— pueden fallar o necesitar compilarse. Si aparecen errores
raros de librerías nativas, <b>probá con <code>slim</code> antes de perder horas</b>.</p>

<h4>.dockerignore, que casi nadie escribe</h4>
<pre><code>node_modules
.next
.git
.env*
*.log
coverage
.DS_Store</code></pre>
<p>Sin este archivo, <code>COPY . .</code> manda <b>todo</b> al contexto de build: tu <code>node_modules</code>
local, todo el historial de git, y —lo más grave— <b>tus archivos <code>.env</code> con secretos</b>, que
quedan dentro de una capa de la imagen.</p>

<div class="dato"><strong>Sobre los secretos en capas:</strong> borrar un archivo en una capa posterior
<b>no lo elimina</b>: sigue existiendo en la capa donde se agregó, y cualquiera que tenga la imagen puede
extraerlo. Lo mismo con <code>ARG</code> para claves. Los secretos van como <b>variables de entorno en tiempo
de ejecución</b>, o con <code>--mount=type=secret</code> en BuildKit, que no deja rastro en ninguna capa.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA CACHÉ DE CAPAS — lo que cambia poco va ARRIBA</text>

  <rect x="24" y="36" width="304" height="150" rx="10" fill="#f87171" fill-opacity=".07" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="58" fill="#f87171" font-size="11.5" font-weight="700">✗ COPY . .  antes de instalar</text>

  <rect x="44" y="68" width="264" height="20" rx="4" fill="#34d399" fill-opacity=".35"/>
  <text x="54" y="82" fill="currentColor" opacity=".8" font-size="9.5" font-family="monospace">FROM node:22-alpine</text>
  <text x="290" y="82" fill="#34d399" font-size="8.5" font-weight="700">caché ✓</text>

  <rect x="44" y="92" width="264" height="20" rx="4" fill="#f87171" fill-opacity=".45"/>
  <text x="54" y="106" fill="currentColor" opacity=".85" font-size="9.5" font-family="monospace">COPY . .</text>
  <text x="278" y="106" fill="#f87171" font-size="8.5" font-weight="700">cambió ✗</text>

  <rect x="44" y="116" width="264" height="26" rx="4" fill="#f87171" fill-opacity=".6"/>
  <text x="54" y="133" fill="currentColor" font-size="9.5" font-family="monospace" font-weight="700">RUN npm install</text>
  <text x="250" y="133" fill="#f87171" font-size="8.5" font-weight="700">SE REHACE ✗</text>

  <text x="176" y="162" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">build: 4 minutos</text>
  <text x="176" y="178" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">en CADA cambio de código</text>

  <rect x="352" y="36" width="304" height="150" rx="10" fill="#34d399" fill-opacity=".07" stroke="#34d399" stroke-width="1.4"/>
  <text x="372" y="58" fill="#34d399" font-size="11.5" font-weight="700">✓ manifiesto primero</text>

  <rect x="372" y="68" width="264" height="20" rx="4" fill="#34d399" fill-opacity=".35"/>
  <text x="382" y="82" fill="currentColor" opacity=".8" font-size="9.5" font-family="monospace">FROM node:22-alpine</text>
  <text x="618" y="82" fill="#34d399" font-size="8.5" font-weight="700">caché ✓</text>

  <rect x="372" y="92" width="264" height="20" rx="4" fill="#34d399" fill-opacity=".35"/>
  <text x="382" y="106" fill="currentColor" opacity=".8" font-size="9.5" font-family="monospace">COPY package.json ./</text>
  <text x="618" y="106" fill="#34d399" font-size="8.5" font-weight="700">caché ✓</text>

  <rect x="372" y="116" width="264" height="26" rx="4" fill="#34d399" fill-opacity=".45"/>
  <text x="382" y="133" fill="currentColor" font-size="9.5" font-family="monospace" font-weight="700">RUN pnpm install</text>
  <text x="600" y="133" fill="#34d399" font-size="8.5" font-weight="700">caché ✓</text>

  <rect x="372" y="146" width="264" height="18" rx="4" fill="#fbbf24" fill-opacity=".4"/>
  <text x="382" y="159" fill="currentColor" opacity=".85" font-size="9.5" font-family="monospace">COPY . .</text>
  <text x="596" y="159" fill="#fbbf24" font-size="8.5" font-weight="700">cambió — pero es rápido</text>

  <text x="504" y="180" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">build: 20 segundos</text>

  <line x1="24" y1="204" x2="656" y2="204" stroke="currentColor" opacity=".18"/>

  <text x="24" y="228" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    MULTI-STAGE — construís en una imagen grande, ejecutás en una mínima</text>

  <rect x="24" y="240" width="180" height="100" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="114" y="262" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">etapa BUILD</text>
  <text x="40" y="282" fill="currentColor" opacity=".7" font-size="9.5">· compilador</text>
  <text x="40" y="298" fill="currentColor" opacity=".7" font-size="9.5">· devDependencies</text>
  <text x="40" y="314" fill="currentColor" opacity=".7" font-size="9.5">· código fuente</text>
  <text x="114" y="332" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">1,2 GB</text>

  <text x="216" y="296" fill="currentColor" opacity=".4" font-size="16">→</text>
  <text x="240" y="284" fill="currentColor" opacity=".55" font-size="10">se copia SOLO</text>
  <text x="240" y="300" fill="currentColor" opacity=".55" font-size="10">el resultado</text>

  <rect x="352" y="240" width="180" height="100" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.5"/>
  <text x="442" y="262" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">imagen FINAL</text>
  <text x="368" y="282" fill="currentColor" opacity=".7" font-size="9.5">· runtime mínimo</text>
  <text x="368" y="298" fill="currentColor" opacity=".7" font-size="9.5">· build compilado</text>
  <text x="368" y="314" fill="#34d399" font-size="9.5" font-weight="700">· usuario sin root</text>
  <text x="442" y="332" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">150 MB</text>

  <text x="556" y="272" fill="currentColor" opacity=".6" font-size="10">deploys más rápidos</text>
  <text x="556" y="290" fill="currentColor" opacity=".6" font-size="10">menos superficie</text>
  <text x="556" y="308" fill="currentColor" opacity=".6" font-size="10">de ataque</text>

  <rect x="24" y="352" width="632" height="36" rx="8" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="340" y="367" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">
    CMD ["node","server.js"]  ≠  CMD node server.js</text>
  <text x="340" y="382" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10">
    Sin los corchetes el proceso no recibe SIGTERM: tu apagado ordenado nunca se ejecuta.</text>
</svg>`,
        pie: 'Dos líneas de orden en el Dockerfile son la diferencia entre 4 minutos y 20 segundos de build.',
      },

      entrevista: [
        { p: '¿Cómo optimizás el tiempo de build de una imagen?',
          r: 'Ordenando el <code>Dockerfile</code> según <b>la frecuencia con que cambia cada cosa</b>. Docker cachea capas y rehace todas las que ' +
             'siguen a una que cambió, así que lo estable va arriba y lo volátil abajo. En concreto: copiar primero solo el manifiesto de dependencias, ' +
             'instalar, y recién después copiar el código. Así la instalación queda cacheada y solo se rehace cuando cambian las dependencias. ' +
             'Es un cambio de dos líneas que suele bajar el build de minutos a segundos. Y sumaría un <code>.dockerignore</code>, ' +
             'para no mandar <code>node_modules</code> ni <code>.git</code> al contexto.' },

        { p: '¿Qué es un build multi-etapa y qué resuelve?',
          r: 'Construir en una imagen que tiene todo lo necesario para compilar —compilador, dependencias de desarrollo, código fuente— y después ' +
             '<b>copiar solo el resultado</b> a una imagen mínima. La imagen final no lleva el código fuente ni las herramientas de construcción. ' +
             'Es normal pasar de 1,2 GB a 150 MB. Y el beneficio no es solo disco: son despliegues más rápidos, menos ancho de banda, y sobre todo ' +
             '<b>una superficie de ataque mucho menor</b>, porque no hay compilador ni utilidades dentro del contenedor de producción.' },

        { p: '¿Por qué importa la forma en que escribís CMD?',
          r: 'Porque determina si tu proceso recibe las señales del sistema. Con la forma <i>shell</i> —<code>CMD node server.js</code>— el proceso ' +
             'arranca bajo un shell que es el PID 1, y <b>tu aplicación nunca recibe <code>SIGTERM</code></b>: el apagado ordenado no se ejecuta y ' +
             'cada deploy corta peticiones a la mitad. Con la forma <i>exec</i> —<code>CMD ["node", "server.js"]</code>— tu proceso es el PID 1 y ' +
             'recibe las señales. Es un par de corchetes que arregla una clase entera de errores intermitentes en los despliegues.' },

        { p: 'Guardaste una clave con ARG en el Dockerfile y después la borraste. ¿Está segura?',
          r: 'No. Las imágenes son <b>capas apiladas e inmutables</b>: borrar un archivo en una capa posterior no lo elimina de la capa donde se ' +
             'agregó, y cualquiera con acceso a la imagen puede extraerlo con <code>docker history</code> o desempaquetando las capas. ' +
             'Lo mismo pasa con <code>ARG</code>, que además queda en los metadatos. Los secretos van como <b>variables de entorno en tiempo de ' +
             'ejecución</b>, o con <code>--mount=type=secret</code> de BuildKit, que los expone durante el build sin dejar rastro en ninguna capa.' },
      ],

      practica: `
<h4>El .dockerignore, que casi nadie escribe</h4>
<pre><code>node_modules
.next
dist
.git
.env
.env.*
*.log
coverage
.DS_Store
Dockerfile
docker-compose.yml</code></pre>

<div class="aviso"><strong>Sin este archivo, <code>COPY . .</code> manda todo al contexto de build:</strong>
tu <code>node_modules</code> local —que además puede tener binarios compilados para <i>tu</i> sistema y romper
el contenedor—, todo el historial de git, y <b>tus archivos <code>.env</code> con secretos</b>, que quedan
dentro de una capa de la imagen para siempre.</div>

<h4>Diagnosticar una imagen que pesa demasiado</h4>
<pre><code># ¿Qué capa ocupa qué?  Ordenado, muestra al culpable enseguida
docker history mi-app:1.0 --human --format "{{.Size}}\\t{{.CreatedBy}}"

# Tamaño total de todas las imágenes
docker images

# ¿Cuánto disco está ocupando Docker en total?
docker system df</code></pre>

<h4>Secretos en tiempo de build, bien hechos</h4>
<pre><code># ❌ Queda en los metadatos de la imagen, para siempre
ARG NPM_TOKEN
RUN npm install

# ✅ BuildKit: disponible durante el RUN, sin rastro en ninguna capa
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \\
    pnpm install --frozen-lockfile</code></pre>
<pre><code>docker build --secret id=npmrc,src=$HOME/.npmrc -t mi-app .</code></pre>

<h4>Checklist de un Dockerfile de producción</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Multi-etapa: la imagen final no tiene compilador ni código fuente</td></tr>
<tr><td>☐</td><td>Manifiesto de dependencias copiado <b>antes</b> que el código</td></tr>
<tr><td>☐</td><td>Instalación reproducible (<code>npm ci</code> / <code>--frozen-lockfile</code>)</td></tr>
<tr><td>☐</td><td>Existe <code>.dockerignore</code> y excluye <code>.env</code> y <code>.git</code></td></tr>
<tr><td>☐</td><td>Corre con un usuario <b>sin privilegios</b>, no root</td></tr>
<tr><td>☐</td><td><code>CMD</code> en forma exec, con corchetes</td></tr>
<tr><td>☐</td><td>Ningún secreto en <code>ARG</code>, <code>ENV</code> ni en una capa</td></tr>
<tr><td>☐</td><td>Versión de la imagen base fijada, no <code>latest</code></td></tr>
</table>
`,

      errores: [
        { mito: 'El orden de las instrucciones del Dockerfile da igual.',
          realidad: 'Es lo que más afecta el tiempo de build. Docker rehace <b>todas las capas posteriores</b> a la que cambió: si copiás el código ' +
                    'antes de instalar dependencias, reinstalás todo en cada cambio. Manifiesto primero, código después.' },

        { mito: 'Borro el archivo con la clave en una capa siguiente y ya está.',
          realidad: 'Las capas son inmutables: el archivo <b>sigue existiendo</b> en la capa donde se agregó y se puede extraer. ' +
                    'Los secretos van como variables de entorno en ejecución, o con <code>--mount=type=secret</code> de BuildKit.' },

        { mito: 'Alpine siempre es mejor porque es más chico.',
          realidad: 'Alpine usa <b>musl</b> en lugar de glibc, y los paquetes con binarios nativos —sharp, bcrypt, canvas, algunos drivers— pueden ' +
                    'fallar o necesitar compilarse, lo que anula el ahorro. Si aparecen errores raros de librerías nativas, ' +
                    '<b>probá con <code>slim</code> antes de perder horas.</b>' },

        { mito: 'Con que la imagen funcione alcanza.',
          realidad: 'Faltan dos cosas que se notan en producción: correr con un <b>usuario sin privilegios</b> —por defecto es root, y eso convierte ' +
                    'un escape de contenedor en un compromiso del host— y el <b>CMD en forma exec</b>, sin el cual tu apagado ordenado nunca corre.' },
      ],

      glosario: [
        { t: 'Capa (layer)', d: 'Cada paso de construcción de una imagen. Son inmutables y se cachean.' },
        { t: 'Caché de capas', d: 'Reutilización de capas ya construidas. Se invalida en la primera que cambia y en todas las siguientes.' },
        { t: 'Multi-stage build', d: 'Construir en una imagen y copiar solo el resultado a otra mínima.' },
        { t: '.dockerignore', d: 'Archivo que excluye rutas del contexto de build. Evita mandar secretos y node_modules.' },
        { t: 'Forma exec', d: 'CMD con array. Hace que tu proceso sea PID 1 y reciba las señales del sistema.' },
        { t: 'BuildKit', d: 'Motor de construcción moderno de Docker. Permite secretos sin dejar rastro en capas.' },
        { t: 'distroless', d: 'Imagen base sin shell ni gestor de paquetes. Máxima seguridad, imposible depurar desde adentro.' },
        { t: 'musl vs glibc', d: 'Bibliotecas C distintas. Alpine usa musl, lo que puede romper binarios nativos.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Volúmenes, redes y Compose',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> los contenedores son <b>descartables</b>. Todo lo
que tenga que sobrevivir a su muerte vive afuera, en un volumen.</div>

<h4>Volúmenes</h4>
<p>Cuando un contenedor muere, su capa escribible desaparece. Un <b>volumen</b> es almacenamiento que vive
fuera del contenedor y sobrevive.</p>
<table>
<tr><th>Tipo</th><th>Qué es</th><th>Cuándo</th></tr>
<tr><td><b>Volumen nombrado</b></td><td>Docker lo gestiona en su propio directorio</td><td>Datos de bases de datos. Lo normal en producción</td></tr>
<tr><td><b>Bind mount</b></td><td>Un directorio de tu máquina montado adentro</td><td>Desarrollo, para editar código y ver los cambios</td></tr>
<tr><td><b>tmpfs</b></td><td>En memoria, se pierde al terminar</td><td>Archivos temporales sensibles</td></tr>
</table>

<div class="aviso"><strong>El error clásico de desarrollo:</strong> montar tu carpeta con un <i>bind mount</i>
y que el <code>node_modules</code> de tu máquina —compilado para tu sistema— tape al del contenedor. Se
resuelve con un volumen anónimo encima: <code>-v /app/node_modules</code>. Es una línea y evita horas de
"funciona en el contenedor limpio y no cuando monto la carpeta".</div>

<h4>Redes</h4>
<p>Los contenedores en la misma red de Docker <b>se ven por nombre</b>. Tu aplicación no se conecta a
<code>localhost:5432</code> sino a <code>db:5432</code>, donde <code>db</code> es el nombre del servicio.</p>
<p>Esto confunde al principio: dentro de un contenedor, <code>localhost</code> es <b>el propio contenedor</b>,
no la máquina anfitriona ni los vecinos.</p>

<h4>Docker Compose</h4>
<p>Levantar tu app, la base y el caché a mano son tres comandos largos con muchos parámetros. Compose los
describe en un archivo y los levanta con uno solo.</p>
<pre><code>docker compose up -d      # levanta todo
docker compose logs -f    # ve los logs de todos juntos
docker compose down       # baja todo
docker compose down -v    # …y BORRA los volúmenes ⚠</code></pre>
<p>Ese <code>-v</code> del último comando borra tus datos. Es el equivalente en Docker de un
<code>DROP DATABASE</code>, y se escribe por accidente con facilidad.</p>
`,

      tecnico: `
<h4>Un compose de desarrollo completo</h4>
<pre><code>services:
  app:
    build:
      context: .
      target: dev                 # etapa del multi-stage
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://app:secreto@db:5432/app
      REDIS_URL: redis://cache:6379
    volumes:
      - .:/app                    # bind mount: ves tus cambios
      - /app/node_modules         # ← volumen anónimo que protege el del contenedor
    depends_on:
      db:
        condition: service_healthy   # espera a que esté LISTA, no solo arrancada

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secreto
      POSTGRES_DB: app
    volumes:
      - datos_db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 5

  cache:
    image: redis:7-alpine

volumes:
  datos_db:</code></pre>

<div class="dato"><strong><code>depends_on</code> por sí solo no alcanza, y es un error muy común.</strong>
Sin <code>condition: service_healthy</code>, Docker solo espera a que el contenedor <i>arranque</i>, no a que
el servicio esté <i>listo</i>. Postgres tarda unos segundos en aceptar conexiones después de arrancar, así que
tu aplicación intenta conectarse y falla. El síntoma es "a veces levanta bien y a veces no", que es de los
errores más molestos de diagnosticar.</div>

<h4>Redes: quién ve a quién</h4>
<ul>
<li>Compose crea una red por proyecto y todos los servicios entran ahí. Se resuelven <b>por nombre de servicio</b>.</li>
<li><code>ports:</code> expone un puerto <b>hacia afuera</b>. Entre contenedores <b>no hace falta</b>: se hablan por la red interna.</li>
<li>Publicar el puerto de la base de datos en desarrollo está bien; <b>en producción es una superficie de ataque innecesaria</b>.</li>
<li>Para llegar a la máquina anfitriona desde adentro: <code>host.docker.internal</code> en Mac y Windows.</li>
</ul>

<h4>Compose en producción: cuándo sí</h4>
<p>Compose no es solo para desarrollo. Para un VPS con una aplicación y su base, es una opción perfectamente
válida y muchísimo más simple que Kubernetes.</p>
<p>Lo que le falta para producción seria:</p>
<ul>
<li>No reprograma contenedores si la máquina se cae — <b>es un solo servidor</b>.</li>
<li>No hay despliegue sin cortes nativo (aunque se puede con un proxy delante).</li>
<li>No escala horizontalmente entre máquinas.</li>
</ul>
<p><b>Si eso no te hace falta, Compose alcanza.</b> Es una respuesta legítima en una entrevista y evita meses
de complejidad innecesaria.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    UNA RED DE COMPOSE — se ven POR NOMBRE, no por localhost</text>

  <rect x="24" y="36" width="632" height="150" rx="12" fill="#7c5cff" fill-opacity=".06" stroke="#7c5cff" stroke-width="1.4" stroke-dasharray="6 4"/>
  <text x="44" y="58" fill="#7c5cff" font-size="10.5" font-weight="700">red del proyecto</text>

  <rect x="60" y="72" width="150" height="72" rx="9" fill="#34d399" fill-opacity=".18" stroke="#34d399" stroke-width="1.3"/>
  <text x="135" y="96" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">app</text>
  <text x="135" y="114" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">:3000</text>
  <text x="135" y="132" text-anchor="middle" fill="currentColor" opacity=".45" font-size="9">publicado afuera</text>

  <path d="M 214 100 L 268 100" stroke="#22d3ee" stroke-width="1.6"/>
  <text x="241" y="94" text-anchor="middle" fill="#22d3ee" font-size="9" font-family="monospace">db:5432</text>

  <rect x="272" y="72" width="150" height="72" rx="9" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="347" y="96" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">db</text>
  <text x="347" y="114" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">postgres:16</text>
  <text x="347" y="132" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">NO publicar en prod</text>

  <path d="M 214 126 Q 300 168 460 126" fill="none" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="340" y="164" text-anchor="middle" fill="#fbbf24" font-size="9" font-family="monospace">cache:6379</text>

  <rect x="464" y="72" width="150" height="72" rx="9" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="539" y="96" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">cache</text>
  <text x="539" y="114" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">redis:7</text>

  <text x="24" y="206" fill="#f87171" font-size="11" font-weight="700">
    Dentro de un contenedor, localhost es EL PROPIO CONTENEDOR — no el host ni los vecinos.</text>

  <line x1="24" y1="226" x2="656" y2="226" stroke="currentColor" opacity=".18"/>

  <text x="24" y="250" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    VOLÚMENES — lo que sobrevive a la muerte del contenedor</text>

  <rect x="24" y="262" width="200" height="80" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="124" y="284" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">VOLUMEN NOMBRADO</text>
  <text x="124" y="304" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">Docker lo gestiona</text>
  <text x="124" y="322" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9.5">datos de la base · producción</text>

  <rect x="240" y="262" width="200" height="80" rx="10" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="340" y="284" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">BIND MOUNT</text>
  <text x="340" y="304" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">tu carpeta, adentro</text>
  <text x="340" y="322" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9.5">desarrollo · ves tus cambios</text>

  <rect x="456" y="262" width="200" height="80" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="556" y="284" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">tmpfs</text>
  <text x="556" y="304" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">en memoria</text>
  <text x="556" y="322" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9.5">temporales sensibles</text>

  <rect x="24" y="354" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="369" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    docker compose down -v   BORRA los volúmenes.</text>
  <text x="340" y="383" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10">
    Es el DROP DATABASE de Docker, y se escribe por accidente con una facilidad notable.</text>
</svg>`,
        pie: 'Los contenedores son descartables. Los volúmenes son lo que no lo es.',
      },

      entrevista: [
        { p: '¿Cómo persistís datos en un contenedor?',
          r: 'No se persisten <i>en</i> el contenedor: se persisten <b>afuera</b>, en un volumen. Cuando el contenedor muere, su capa escribible ' +
             'desaparece. Para datos de una base uso un <b>volumen nombrado</b>, que Docker gestiona y sobrevive a recreaciones del contenedor. ' +
             'Para desarrollo uso un <b>bind mount</b> de mi carpeta, para ver los cambios sin reconstruir. Y algo importante en producción: ' +
             'un volumen local vive en <b>esa</b> máquina, así que si necesitás mover el contenedor a otro servidor, el almacenamiento tiene que ' +
             'ser de red o gestionado.' },

        { p: 'Tu aplicación en un contenedor no se conecta a la base. ¿Qué revisás primero?',
          r: 'El <b>host de conexión</b>. Dentro de un contenedor, <code>localhost</code> es el propio contenedor, no la máquina anfitriona ni los ' +
             'vecinos. Si la base es otro servicio de Compose, hay que conectarse a <code>db:5432</code> usando el <b>nombre del servicio</b>, ' +
             'porque Compose crea una red donde se resuelven por nombre. Lo segundo que miraría es si la base ya está <i>lista</i>: ' +
             '<code>depends_on</code> solo espera a que el contenedor arranque, y Postgres tarda unos segundos más en aceptar conexiones — ' +
             'de ahí el clásico "a veces levanta bien y a veces no".' },

        { p: '¿Se puede usar Docker Compose en producción?',
          r: 'Sí, y para un VPS con una aplicación y su base es una opción perfectamente válida y mucho más simple que Kubernetes. ' +
             'Lo que le falta es lo que da un orquestador: <b>no reprograma contenedores si la máquina se cae</b> —es un solo servidor—, ' +
             'no tiene despliegue sin cortes nativo, y no escala horizontalmente entre máquinas. ' +
             'Si nada de eso te hace falta, Compose alcanza, y decirlo con ese razonamiento evita meses de complejidad innecesaria.' },

        { p: '¿Por qué se monta un volumen anónimo sobre node_modules en desarrollo?',
          r: 'Porque el <i>bind mount</i> de tu carpeta <b>tapa</b> el contenido del contenedor, incluido el <code>node_modules</code> que se instaló ' +
             'adentro. Y el tuyo local puede tener binarios compilados para tu sistema operativo que no funcionan en el contenedor. ' +
             'Montando un volumen anónimo en esa ruta —<code>-v /app/node_modules</code>— esa carpeta queda excluida del bind mount y se conserva ' +
             'la del contenedor. Es una línea y evita horas de "anda en el contenedor limpio y se rompe cuando monto la carpeta".' },
      ],

      practica: `
<h4>Healthcheck: la diferencia entre "arrancó" y "está listo"</h4>
<pre><code>db:
  image: postgres:16-alpine
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U app"]
    interval: 5s
    timeout: 3s
    retries: 5
    start_period: 10s      # margen inicial sin contar fallos

app:
  depends_on:
    db:
      condition: service_healthy    # ← esperar a LISTA, no a arrancada</code></pre>

<div class="aviso"><strong>Sin <code>condition: service_healthy</code>, Compose solo espera a que el contenedor
arranque.</strong> Postgres tarda unos segundos más en aceptar conexiones, así que tu aplicación intenta
conectarse antes de tiempo y falla. El síntoma es intermitente —"a veces levanta bien"— y por eso se persigue
durante días.</div>

<h4>Comandos de Compose que se usan a diario</h4>
<pre><code>docker compose up -d                 # levantar en segundo plano
docker compose up --build            # forzar reconstrucción
docker compose logs -f app           # seguir los logs de UN servicio
docker compose exec app sh           # entrar al contenedor
docker compose ps                    # qué está corriendo y su salud
docker compose restart app           # reiniciar uno solo

docker compose down                  # bajar todo (los volúmenes quedan)
docker compose down -v               # ⚠ …y BORRAR los volúmenes</code></pre>

<h4>Respaldar el volumen de una base</h4>
<pre><code># volcado lógico: lo más simple y lo que realmente sirve
docker compose exec db pg_dump -U app app &gt; respaldo.sql

# restaurar
cat respaldo.sql | docker compose exec -T db psql -U app app</code></pre>
<p>Ese <code>-T</code> del segundo comando desactiva la asignación de TTY. Sin él, la redirección de la entrada
no funciona y el comando se queda colgado sin explicar por qué.</p>

<h4>Producción en un VPS: lo mínimo que hay que agregar</h4>
<table>
<tr><th>Necesidad</th><th>Cómo</th></tr>
<tr><td>HTTPS</td><td>Caddy o Traefik delante, con certificado automático</td></tr>
<tr><td>Reinicio ante fallo</td><td><code>restart: unless-stopped</code></td></tr>
<tr><td>Límites de recursos</td><td><code>deploy.resources.limits</code> — evita que un servicio se coma la máquina</td></tr>
<tr><td>No exponer la base</td><td>Quitar <code>ports:</code> del servicio de base de datos</td></tr>
<tr><td>Secretos</td><td>Archivo <code>.env</code> fuera del repositorio, o secretos de Docker</td></tr>
<tr><td>Respaldos</td><td>Un cron con <code>pg_dump</code> hacia almacenamiento externo</td></tr>
</table>
`,

      errores: [
        { mito: 'Los datos del contenedor están seguros mientras no lo borre.',
          realidad: 'Un contenedor se recrea en cada despliegue, y ahí su capa escribible desaparece. <b>Todo lo que tenga que sobrevivir va en un ' +
                    'volumen.</b> Y ojo con <code>docker compose down -v</code>, que borra los volúmenes: es el <code>DROP DATABASE</code> de Docker.' },

        { mito: 'Los contenedores se hablan por localhost.',
          realidad: 'Dentro de un contenedor, <code>localhost</code> es <b>el propio contenedor</b>. Los servicios de una misma red de Compose se ' +
                    'resuelven <b>por nombre de servicio</b> —<code>db:5432</code>—. Es la causa número uno de "no se conecta a la base".' },

        { mito: 'Con depends_on alcanza para que la base esté lista.',
          realidad: '<code>depends_on</code> solo espera a que el contenedor <b>arranque</b>, no a que el servicio acepte conexiones. ' +
                    'Hace falta un <code>healthcheck</code> más <code>condition: service_healthy</code>. Sin eso, el fallo es intermitente ' +
                    'y por eso cuesta tanto encontrarlo.' },

        { mito: 'Publico el puerto de la base para poder conectarme con un cliente.',
          realidad: 'En desarrollo está bien; <b>en producción es una superficie de ataque innecesaria</b>. Para acceder desde afuera conviene ' +
                    'un túnel SSH, no exponer el puerto a internet.' },
      ],

      glosario: [
        { t: 'Volumen nombrado', d: 'Almacenamiento gestionado por Docker que sobrevive a la recreación del contenedor.' },
        { t: 'Bind mount', d: 'Directorio del host montado dentro del contenedor. Usado en desarrollo.' },
        { t: 'Volumen anónimo', d: 'Volumen sin nombre, usado para excluir una ruta de un bind mount.' },
        { t: 'Red de Compose', d: 'Red interna donde los servicios se resuelven por nombre.' },
        { t: 'healthcheck', d: 'Comando que Docker ejecuta periódicamente para saber si un servicio está listo.' },
        { t: 'depends_on', d: 'Orden de arranque. Sin condition solo espera a que el contenedor inicie, no a que esté listo.' },
        { t: 'host.docker.internal', d: 'Nombre para alcanzar la máquina anfitriona desde dentro de un contenedor en Mac y Windows.' },
        { t: 'restart policy', d: 'Regla que indica si Docker debe reiniciar un contenedor que terminó.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Contenedores en producción',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> que un contenedor funcione en tu máquina y que
funcione en producción son dos problemas distintos. El segundo tiene que ver con <b>límites, salud, señales y
qué pasa cuando algo falla</b>.</div>

<h4>Las cinco cosas que hay que agregar</h4>

<p><b>1 · Límites de recursos.</b> Sin límite de memoria, un contenedor con una fuga <b>se come la máquina
entera</b> y tira todo lo demás. Con límite, lo mata el kernel y solo cae ese servicio.</p>

<p><b>2 · Chequeos de salud.</b> Un proceso puede estar vivo y no responder —bloqueado, sin conexión a la base—.
Un <i>healthcheck</i> distingue "está corriendo" de "está funcionando".</p>

<p><b>3 · Política de reinicio.</b> Si el contenedor muere, ¿alguien lo levanta? <code>restart:
unless-stopped</code> es el mínimo.</p>

<p><b>4 · Manejo de señales.</b> Ya lo viste: <code>CMD</code> en forma exec y escuchar <code>SIGTERM</code>,
o cada despliegue corta peticiones.</p>

<p><b>5 · Logs a la salida estándar.</b> No escribas archivos de log dentro del contenedor: se pierden cuando
muere. Escribí a <code>stdout</code> y que la plataforma los recolecte.</p>

<div class="aviso"><strong>El límite de memoria es el que más problemas evita y el que menos gente pone.</strong>
Sin él, una fuga en un servicio menor puede tirar la base de datos que corre en la misma máquina. Con él, el
servicio con fuga muere solo, se reinicia, y todo lo demás sigue andando. <b>Convierte un incidente en una
molestia.</b></div>

<h4>Cómo se despliega sin cortar el servicio</h4>
<p>La idea es la misma en todas las plataformas: <b>levantar lo nuevo antes de bajar lo viejo</b>.</p>
<ol>
<li>Se levanta un contenedor con la versión nueva.</li>
<li>Se espera a que su chequeo de salud diga que está listo.</li>
<li>El proxy empieza a mandarle tráfico.</li>
<li>Al contenedor viejo se le manda <code>SIGTERM</code> y termina lo que tenía en curso.</li>
<li>Recién ahí se lo elimina.</li>
</ol>
<p>Si tu aplicación no maneja el paso 4, cada despliegue corta peticiones a la mitad — y ese es el error
intermitente más común de todos.</p>
`,

      tecnico: `
<h4>Compose listo para un VPS</h4>
<pre><code>services:
  app:
    image: registro.io/mi-app:1.4.2      # versión fijada, nunca latest
    restart: unless-stopped
    environment:
      NODE_ENV: production
    env_file: .env.produccion
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/salud"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s
    deploy:
      resources:
        limits:
          memory: 512M              # sin esto, una fuga se lleva la máquina
          cpus: "1.0"
    logging:
      driver: json-file
      options:
        max-size: "10m"             # sin esto, los logs llenan el disco
        max-file: "3"</code></pre>

<div class="dato"><strong>La rotación de logs es un problema real y silencioso.</strong> Por defecto Docker
guarda los logs sin límite. Un servicio locuaz puede llenar el disco en semanas, y cuando el disco se llena
<b>todo empieza a fallar de formas incomprensibles</b>: la base no puede escribir, los logs se cortan, los
despliegues fallan. Dos líneas de configuración lo evitan.</div>

<h4>El endpoint de salud, bien hecho</h4>
<pre><code>// ❌ No dice nada útil: devuelve OK aunque la base esté caída
app.get('/salud', (req, res) =&gt; res.send('ok'));

// ✅ Distingue "vivo" de "listo para recibir tráfico"
app.get('/salud/vivo', (req, res) =&gt; res.send('ok'));   // ¿hay que reiniciarme?

app.get('/salud/listo', async (req, res) =&gt; {           // ¿me mandás tráfico?
  try {
    await db.query('select 1');
    if (apagandose) return res.status(503).send('apagando');
    res.send('ok');
  } catch {
    res.status(503).send('base no disponible');
  }
});</code></pre>

<p>La distinción importa: <b>vivo</b> responde "¿tiene sentido reiniciarme?"; <b>listo</b> responde "¿me podés
mandar tráfico ahora?". Si los mezclás, un problema temporal de la base provoca un ciclo de reinicios que lo
empeora todo.</p>

<h4>Registro de imágenes y etiquetado</h4>
<ul>
<li><b>Nunca <code>latest</code> en producción.</b> No sabés qué se desplegó ni podés volver atrás.</li>
<li>Etiquetá con el <b>hash del commit</b> —<code>mi-app:a3f2c91</code>—: es trazable y único.</li>
<li>Agregá también una etiqueta semántica —<code>mi-app:1.4.2</code>— para las personas.</li>
<li>Volver atrás es desplegar la etiqueta anterior. <b>Con <code>latest</code>, no hay atrás.</b></li>
</ul>

<h4>Seguridad</h4>
<table>
<tr><th>Control</th><th>Por qué</th></tr>
<tr><td>Usuario sin privilegios</td><td>Por defecto es root: un escape del contenedor compromete el host</td></tr>
<tr><td><code>read_only: true</code></td><td>Sistema de archivos inmutable, con tmpfs para lo temporal</td></tr>
<tr><td><code>cap_drop: [ALL]</code></td><td>Quitar capacidades del kernel que no se usan</td></tr>
<tr><td><code>no-new-privileges</code></td><td>Impide escalar privilegios dentro del contenedor</td></tr>
<tr><td>Escaneo de vulnerabilidades</td><td>Trivy o similar en CI: las imágenes base acumulan CVEs</td></tr>
<tr><td>Base fijada por digest</td><td><code>node:22-alpine@sha256:…</code> — reproducible de verdad</td></tr>
</table>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="pr1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    DESPLIEGUE SIN CORTES — levantar lo nuevo ANTES de bajar lo viejo</text>

  <rect x="24" y="36" width="632" height="118" rx="11" fill="currentColor" fill-opacity=".04" stroke="currentColor" stroke-opacity=".28" stroke-width="1.3"/>

  <rect x="44" y="52" width="110" height="40" rx="8" fill="#7c5cff" fill-opacity=".25" stroke="#7c5cff" stroke-width="1.2"/>
  <text x="99" y="76" text-anchor="middle" fill="currentColor" font-size="10" font-weight="700">proxy</text>

  <path d="M 158 66 L 196 66" stroke="#f87171" stroke-width="2" marker-end="url(#pr1)" color="#f87171"/>
  <rect x="200" y="46" width="130" height="40" rx="8" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.2"/>
  <text x="265" y="63" text-anchor="middle" fill="currentColor" font-size="10" font-weight="700">v1.4.1 (vieja)</text>
  <text x="265" y="78" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">recibe tráfico</text>

  <path d="M 158 88 L 196 108" stroke="#34d399" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#pr1)" color="#34d399"/>
  <rect x="200" y="98" width="130" height="40" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.2"/>
  <text x="265" y="115" text-anchor="middle" fill="currentColor" font-size="10" font-weight="700">v1.4.2 (nueva)</text>
  <text x="265" y="130" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">arrancando…</text>

  <text x="350" y="70" fill="currentColor" opacity=".55" font-size="10">1 · levanta la nueva</text>
  <text x="350" y="88" fill="currentColor" opacity=".55" font-size="10">2 · espera su healthcheck</text>
  <text x="350" y="106" fill="currentColor" opacity=".55" font-size="10">3 · le manda tráfico</text>
  <text x="350" y="124" fill="#fbbf24" font-size="10" font-weight="700">4 · SIGTERM a la vieja</text>
  <text x="350" y="142" fill="currentColor" opacity=".55" font-size="10">5 · la elimina</text>

  <text x="24" y="174" fill="#f87171" font-size="11" font-weight="700">
    Si tu app no maneja el paso 4, CADA despliegue corta peticiones a la mitad.</text>

  <line x1="24" y1="194" x2="656" y2="194" stroke="currentColor" opacity=".18"/>

  <text x="24" y="218" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LO QUE HAY QUE AGREGAR PARA PRODUCCIÓN</text>

  <rect x="24" y="230" width="632" height="34" rx="7" fill="#f87171" fill-opacity=".18" stroke="#f87171" stroke-width="1.6"/>
  <text x="44" y="251" fill="#f87171" font-size="11.5" font-weight="700">1 · LÍMITE DE MEMORIA</text>
  <text x="250" y="251" fill="currentColor" opacity=".7" font-size="10.5">sin él, una fuga en un servicio menor se lleva la máquina entera</text>

  <rect x="24" y="270" width="632" height="30" rx="7" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.2"/>
  <text x="44" y="289" fill="#34d399" font-size="11" font-weight="700">2 · HEALTHCHECK</text>
  <text x="250" y="289" fill="currentColor" opacity=".7" font-size="10.5">distingue “está corriendo” de “está funcionando”</text>

  <rect x="24" y="306" width="632" height="30" rx="7" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="44" y="325" fill="#22d3ee" font-size="11" font-weight="700">3 · RESTART POLICY</text>
  <text x="250" y="325" fill="currentColor" opacity=".7" font-size="10.5">restart: unless-stopped</text>

  <rect x="24" y="342" width="304" height="30" rx="7" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.2"/>
  <text x="44" y="361" fill="#7c5cff" font-size="11" font-weight="700">4 · SEÑALES</text>
  <text x="150" y="361" fill="currentColor" opacity=".7" font-size="10">CMD exec + SIGTERM</text>

  <rect x="352" y="342" width="304" height="30" rx="7" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="372" y="361" fill="#fbbf24" font-size="11" font-weight="700">5 · LOGS A stdout</text>
  <text x="490" y="361" fill="currentColor" opacity=".7" font-size="10">con rotación ⚠</text>

  <text x="340" y="390" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10.5">
    Sin rotación, los logs llenan el disco — y con el disco lleno TODO falla de formas incomprensibles.</text>
</svg>`,
        pie: 'El límite de memoria convierte un incidente en una molestia. Es lo que menos gente pone.',
      },

      entrevista: [
        { p: '¿Qué le agregarías a un contenedor que funciona en desarrollo para llevarlo a producción?',
          r: 'Cinco cosas. <b>Límites de recursos</b>, sobre todo de memoria: sin eso, una fuga en un servicio menor se lleva la máquina entera y ' +
             'tira la base de datos; con límite, muere solo ese servicio y se reinicia. <b>Healthchecks</b>, que distinguen "está corriendo" de ' +
             '"está funcionando". <b>Política de reinicio</b>. <b>Manejo de <code>SIGTERM</code></b> con <code>CMD</code> en forma exec, ' +
             'o cada despliegue corta peticiones. Y <b>logs a stdout con rotación</b>, porque sin límite llenan el disco y ahí todo falla de formas ' +
             'incomprensibles.' },

        { p: '¿Qué diferencia hay entre un chequeo de "vivo" y uno de "listo"?',
          r: '<b>Vivo</b> responde "¿tiene sentido reiniciarme?" — si falla, el orquestador reinicia el contenedor. <b>Listo</b> responde ' +
             '"¿me podés mandar tráfico ahora?" — si falla, se lo saca de rotación pero <b>no se lo reinicia</b>. ' +
             'La distinción importa: si los mezclás y la base tiene un problema temporal, el chequeo falla, el orquestador reinicia todos los ' +
             'contenedores, y eso empeora la situación en vez de resolverla. Con la separación correcta, los contenedores salen de rotación y ' +
             'vuelven solos cuando la base se recupera.' },

        { p: '¿Por qué no usar la etiqueta latest en producción?',
          r: 'Porque no sabés qué se desplegó y no podés volver atrás. Si dos despliegues usan <code>latest</code>, apuntan a imágenes distintas ' +
             'y no hay forma de reproducir cuál estaba corriendo cuando apareció un problema. Yo etiqueto con el <b>hash del commit</b>, ' +
             'que es único y trazable, más una etiqueta semántica para las personas. <b>Volver atrás pasa a ser desplegar la etiqueta anterior</b>, ' +
             'que es una operación de segundos. Con <code>latest</code> no hay atrás.' },

        { p: '¿Cómo se despliega sin cortar el servicio?',
          r: 'Levantando lo nuevo antes de bajar lo viejo. Se arranca un contenedor con la versión nueva, se espera a que su chequeo de <i>listo</i> ' +
             'pase, el proxy empieza a mandarle tráfico, y recién ahí se le manda <code>SIGTERM</code> al viejo para que termine lo que tenía en curso. ' +
             'La pieza que la mayoría olvida es la última: <b>si la aplicación no maneja <code>SIGTERM</code></b>, las peticiones en vuelo se cortan, ' +
             'y eso produce errores intermitentes en cada deploy que no se reproducen a demanda.' },
      ],

      practica: `
<h4>Rotación de logs: dos líneas que evitan un incidente</h4>
<pre><code>logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"        # máximo 30 MB por servicio</code></pre>

<div class="aviso"><strong>Por defecto Docker no rota nada.</strong> Un servicio locuaz llena el disco en
semanas, y con el disco lleno <b>todo empieza a fallar de forma incomprensible</b>: la base no puede escribir,
los logs se cortan justo cuando los necesitás, los despliegues fallan sin razón aparente. Es de los incidentes
más frustrantes porque el síntoma nunca apunta a la causa.</p></div>

<h4>Endurecer un contenedor</h4>
<pre><code>app:
  image: registro.io/mi-app:a3f2c91
  user: "1001:1001"          # nunca root
  read_only: true            # sistema de archivos inmutable
  tmpfs:
    - /tmp                   # lo temporal, en memoria
  cap_drop: [ALL]            # sin capacidades del kernel
  security_opt:
    - no-new-privileges:true</code></pre>

<h4>Etiquetado y vuelta atrás</h4>
<pre><code># en CI, al construir
docker build -t registro.io/mi-app:$GIT_SHA \\
             -t registro.io/mi-app:1.4.2 .
docker push --all-tags registro.io/mi-app

# desplegar
sed -i "s|mi-app:.*|mi-app:$GIT_SHA|" docker-compose.yml
docker compose up -d

# volver atrás: la etiqueta anterior. Segundos.
sed -i "s|mi-app:.*|mi-app:$SHA_ANTERIOR|" docker-compose.yml
docker compose up -d</code></pre>

<h4>Checklist antes de poner un contenedor en producción</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Límite de memoria y CPU definidos</td></tr>
<tr><td>☐</td><td>Healthchecks separados: vivo y listo</td></tr>
<tr><td>☐</td><td><code>restart: unless-stopped</code></td></tr>
<tr><td>☐</td><td><code>CMD</code> en forma exec y <code>SIGTERM</code> manejado</td></tr>
<tr><td>☐</td><td>Logs a stdout, con rotación configurada</td></tr>
<tr><td>☐</td><td>Corre con usuario sin privilegios</td></tr>
<tr><td>☐</td><td>Imagen etiquetada con el hash del commit, no <code>latest</code></td></tr>
<tr><td>☐</td><td>Puerto de la base <b>no</b> publicado</td></tr>
<tr><td>☐</td><td>Volúmenes de datos respaldados por un cron</td></tr>
<tr><td>☐</td><td>Secretos por variables de entorno, nunca en la imagen</td></tr>
</table>
`,

      errores: [
        { mito: 'Si no pongo límite de memoria, el contenedor usa lo que necesita.',
          realidad: 'Usa <b>todo</b>, y si tiene una fuga se lleva la máquina entera —incluida la base de datos que corre al lado—. ' +
                    'Con límite, el kernel mata solo ese contenedor y se reinicia. <b>Convierte un incidente en una molestia.</b>' },

        { mito: 'Un healthcheck que devuelve 200 alcanza.',
          realidad: 'Si responde OK aunque la base esté caída, no informa nada. Y hay que <b>separar vivo de listo</b>: si un problema temporal de ' +
                    'la base marca los contenedores como muertos, el orquestador los reinicia a todos y empeora la situación.' },

        { mito: 'Uso latest y así siempre tengo lo último.',
          realidad: 'Y nunca sabés qué está corriendo ni podés volver atrás. Etiquetá con el <b>hash del commit</b>: es único, trazable, ' +
                    'y revertir pasa a ser desplegar la etiqueta anterior en segundos.' },

        { mito: 'Los logs de Docker no ocupan tanto.',
          realidad: 'Por defecto <b>no rotan</b>. Un servicio locuaz llena el disco en semanas, y con el disco lleno todo falla de formas ' +
                    'incomprensibles: la base no escribe, los despliegues fallan, los logs se cortan justo cuando los necesitás. Son dos líneas.' },
      ],

      glosario: [
        { t: 'Límite de recursos', d: 'Tope de CPU y memoria de un contenedor, aplicado por cgroups.' },
        { t: 'Liveness', d: 'Chequeo que responde si el contenedor debe reiniciarse.' },
        { t: 'Readiness', d: 'Chequeo que responde si el contenedor puede recibir tráfico. No provoca reinicio.' },
        { t: 'Restart policy', d: 'Regla de reinicio automático ante fallos.' },
        { t: 'Rotación de logs', d: 'Límite de tamaño y cantidad de archivos de log. Sin ella se llena el disco.' },
        { t: 'Registro (registry)', d: 'Repositorio donde se publican y descargan imágenes.' },
        { t: 'Etiqueta por commit', d: 'Nombrar la imagen con el hash de git para trazabilidad y vuelta atrás.' },
        { t: 'read_only', d: 'Montar el sistema de archivos del contenedor como inmutable.' },
        { t: 'Digest', d: 'Hash SHA de una imagen. Fijarlo garantiza reproducibilidad exacta.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es la diferencia central entre un contenedor y una máquina virtual?',
      opciones: [
        'El contenedor comparte el kernel del host; la VM virtualiza el hardware y corre su propio sistema operativo',
        'El contenedor es una VM más pequeña',
        'El contenedor solo corre en Linux y la VM en cualquier sistema',
        'No hay diferencia técnica, solo de herramientas',
      ],
      correcta: 0,
      porQue: 'De ahí se derivan las diferencias de tamaño y arranque, y dos consecuencias: un contenedor Linux no corre sobre un kernel Windows, y el aislamiento es más débil que el de una VM.',
      porQueNo: {
        1: 'No hay virtualización: los procesos del contenedor son procesos normales del host.',
        2: 'Los contenedores Linux también corren en Windows y Mac, sobre una VM Linux liviana.',
        3: 'Es una diferencia arquitectónica profunda.',
      },
    },
    {
      p: '¿Qué diferencia hay entre una imagen y un contenedor?',
      opciones: [
        'La imagen es la plantilla inmutable; el contenedor es esa imagen ejecutándose',
        'Son sinónimos',
        'La imagen corre y el contenedor se guarda',
        'La imagen es para desarrollo y el contenedor para producción',
      ],
      correcta: 0,
      porQue: 'La analogía es clase e instancia. Y lo importante en la práctica: cuando el contenedor muere, su capa escribible desaparece.',
      porQueNo: {
        1: 'Son conceptos distintos que se confunden todo el tiempo.',
        2: 'Está invertido: la imagen se guarda y el contenedor ejecuta.',
        3: 'Ambos se usan en los dos entornos.',
      },
    },
    {
      p: 'Tu contenedor termina con código de salida 137. ¿Qué pasó?',
      opciones: [
        'Lo mataron por exceder el límite de memoria (OOMKilled)',
        'Un error de la aplicación',
        'Terminó normalmente',
        'Falló la conexión a la base de datos',
      ],
      correcta: 0,
      porQue: 'Es el equivalente en contenedores del "se reinicia sin logs": el kernel lo mató por memoria. Se confirma con docker inspect y el campo OOMKilled.',
      porQueNo: {
        1: 'Un error de la aplicación suele dar código 1.',
        2: 'Terminar normalmente da código 0.',
        3: 'Un fallo de conexión produce un error de la aplicación, no un 137.',
      },
    },
    {
      p: '¿Cómo se optimiza el tiempo de build de una imagen?',
      opciones: [
        'Copiando el manifiesto de dependencias e instalando ANTES de copiar el código',
        'Usando menos instrucciones RUN',
        'Aumentando la memoria de Docker',
        'Usando siempre la imagen base más chica',
      ],
      correcta: 0,
      porQue: 'Docker rehace todas las capas posteriores a la que cambió. Si copiás el código antes de instalar, reinstalás todo en cada cambio. Es un cambio de dos líneas que baja el build de minutos a segundos.',
      porQueNo: {
        1: 'Ayuda al tamaño, pero el tiempo lo domina el orden de las capas.',
        2: 'No cambia qué capas se invalidan.',
        3: 'Reduce el tamaño pero no evita reinstalar dependencias en cada cambio.',
      },
    },
    {
      p: '¿Qué resuelve un build multi-etapa?',
      opciones: [
        'Construir con todas las herramientas y copiar solo el resultado a una imagen mínima',
        'Construir varias imágenes en paralelo',
        'Dividir el build entre varias máquinas',
        'Permitir varios Dockerfile en un proyecto',
      ],
      correcta: 0,
      porQue: 'Es normal pasar de 1,2 GB a 150 MB. El beneficio no es solo disco: son despliegues más rápidos y sobre todo mucha menos superficie de ataque, porque no hay compilador dentro del contenedor de producción.',
      porQueNo: {
        1: 'Las etapas son secuenciales por dependencia, no una técnica de paralelismo.',
        2: 'Todo ocurre en el mismo entorno de construcción.',
        3: 'Es un solo Dockerfile con varias etapas.',
      },
    },
    {
      p: '¿Por qué CMD ["node","server.js"] es distinto de CMD node server.js?',
      opciones: [
        'Con la forma exec tu proceso es PID 1 y recibe SIGTERM; con la forma shell, no',
        'Solo es una diferencia de estilo',
        'La forma shell es más rápida',
        'La forma exec no permite variables de entorno',
      ],
      correcta: 0,
      porQue: 'Sin recibir SIGTERM, tu apagado ordenado nunca se ejecuta y cada deploy corta peticiones a la mitad. Es un par de corchetes que arregla una clase entera de errores intermitentes.',
      porQueNo: {
        1: 'Cambia el comportamiento ante las señales del sistema.',
        2: 'La diferencia no es de rendimiento.',
        3: 'Las variables de entorno funcionan igual; lo que no se expande son las del shell.',
      },
    },
    {
      p: 'Pusiste una clave con ARG en el Dockerfile y después borraste el archivo. ¿Está segura?',
      opciones: [
        'No: las capas son inmutables y el valor sigue siendo recuperable de la imagen',
        'Sí, al borrarla desaparece',
        'Sí, si la imagen es privada',
        'Sí, si usás multi-etapa',
      ],
      correcta: 0,
      porQue: 'Borrar en una capa posterior no elimina lo agregado en una anterior, y ARG además queda en los metadatos. Los secretos van como variables de entorno en ejecución o con --mount=type=secret de BuildKit.',
      porQueNo: {
        1: 'Las capas anteriores conservan el contenido y se pueden inspeccionar.',
        2: 'Cualquiera con acceso a la imagen puede extraerlo, privada o no.',
        3: 'Ayuda si el secreto quedó solo en la etapa de build, pero ARG queda en los metadatos igual.',
      },
    },
    {
      p: '¿Qué pasa si no escribís un .dockerignore?',
      opciones: [
        'COPY . . manda node_modules, .git y tus archivos .env al contexto y a la imagen',
        'El build falla',
        'Docker ignora las carpetas ocultas por defecto',
        'Solo afecta la velocidad del build',
      ],
      correcta: 0,
      porQue: 'Los .env con secretos quedan dentro de una capa de la imagen para siempre, y el node_modules local puede tener binarios compilados para tu sistema que rompen el contenedor.',
      porQueNo: {
        1: 'No falla: construye igual, con todo adentro.',
        2: 'No ignora nada por defecto; hay que declararlo.',
        3: 'La velocidad es lo de menos frente al riesgo de filtrar secretos.',
      },
    },
    {
      p: 'Tu aplicación en Compose no se conecta a la base. ¿Qué revisás primero?',
      opciones: [
        'El host: dentro del contenedor hay que usar el nombre del servicio, no localhost',
        'El firewall de la máquina',
        'La versión de Postgres',
        'Las credenciales',
      ],
      correcta: 0,
      porQue: 'Dentro de un contenedor, localhost es el propio contenedor. Compose crea una red donde los servicios se resuelven por nombre: db:5432.',
      porQueNo: {
        1: 'La red interna de Compose no pasa por el firewall del host.',
        2: 'La versión no impide la conexión.',
        3: 'Posible, pero el error de host es muchísimo más frecuente.',
      },
    },
    {
      p: '¿Por qué depends_on no alcanza para esperar a la base de datos?',
      opciones: [
        'Solo espera a que el contenedor arranque, no a que el servicio acepte conexiones',
        'Porque no funciona con Postgres',
        'Porque hay que ponerlo en el servicio de base de datos',
        'Sí alcanza si el orden es correcto',
      ],
      correcta: 0,
      porQue: 'Postgres tarda unos segundos más en aceptar conexiones después de arrancar. Hace falta un healthcheck más condition: service_healthy. El síntoma sin eso es intermitente y por eso cuesta encontrarlo.',
      porQueNo: {
        1: 'Funciona con cualquier servicio: la limitación es qué espera, no con qué.',
        2: 'Se declara en el servicio que depende, y aun así no basta sin condition.',
        3: 'El orden es correcto y aun así falla, porque arrancar no es estar listo.',
      },
    },
    {
      p: '¿Para qué se monta un volumen anónimo sobre node_modules en desarrollo?',
      opciones: [
        'Para que el bind mount de tu carpeta no tape el node_modules instalado dentro del contenedor',
        'Para que los cambios se vean más rápido',
        'Para ahorrar espacio en disco',
        'Para poder borrar node_modules sin reconstruir',
      ],
      correcta: 0,
      porQue: 'El bind mount reemplaza el contenido de la ruta, incluido el node_modules del contenedor. Y el local puede tener binarios compilados para otro sistema. Es una línea que evita horas de depuración.',
      porQueNo: {
        1: 'La velocidad de recarga no depende de esto.',
        2: 'Los volúmenes también ocupan disco.',
        3: 'No es el propósito ni el efecto principal.',
      },
    },
    {
      p: '¿Cuál es el límite más importante de poner en un contenedor de producción?',
      opciones: [
        'El de memoria: sin él, una fuga se lleva la máquina entera',
        'El de CPU',
        'El de conexiones de red',
        'El de espacio en disco',
      ],
      correcta: 0,
      porQue: 'Sin límite, un servicio menor con una fuga puede tirar la base de datos que corre al lado. Con límite, el kernel mata solo ese contenedor y se reinicia: convierte un incidente en una molestia.',
      porQueNo: {
        1: 'Importa, pero saturar la CPU degrada; agotar la memoria mata.',
        2: 'Rara vez es el recurso que primero se agota.',
        3: 'Importa por los logs, pero no se resuelve con un límite de contenedor.',
      },
    },
    {
      p: '¿Qué diferencia hay entre un chequeo de liveness y uno de readiness?',
      opciones: [
        'Liveness decide si reiniciar; readiness decide si mandar tráfico',
        'Son sinónimos',
        'Liveness es para el proxy y readiness para el orquestador',
        'Readiness solo se usa en Kubernetes',
      ],
      correcta: 0,
      porQue: 'Si los mezclás, un problema temporal de la base marca todos los contenedores como muertos, el orquestador los reinicia a todos y empeora la situación en vez de resolverla.',
      porQueNo: {
        1: 'Provocan acciones distintas ante un fallo.',
        2: 'Está invertido en cuanto a quién actúa sobre cada uno.',
        3: 'El concepto aplica a cualquier orquestador, incluido Compose con healthchecks.',
      },
    },
    {
      p: '¿Por qué no usar la etiqueta latest en producción?',
      opciones: [
        'No sabés qué versión está corriendo ni podés volver atrás',
        'Porque descarga más lento',
        'Porque no funciona con registros privados',
        'Porque ocupa más espacio',
      ],
      correcta: 0,
      porQue: 'Etiquetar con el hash del commit hace la imagen trazable y única, y volver atrás pasa a ser desplegar la etiqueta anterior en segundos. Con latest, no hay atrás.',
      porQueNo: {
        1: 'La velocidad de descarga no depende de la etiqueta.',
        2: 'Funciona en cualquier registro.',
        3: 'El espacio depende de las capas, no del nombre.',
      },
    },
    {
      p: '¿Qué pasa si no configurás rotación de logs en Docker?',
      opciones: [
        'Los logs crecen sin límite y pueden llenar el disco, haciendo que todo falle de forma incomprensible',
        'Docker rota automáticamente cada semana',
        'Solo se pierden los logs viejos',
        'No pasa nada relevante',
      ],
      correcta: 0,
      porQue: 'Con el disco lleno la base no puede escribir, los despliegues fallan y los logs se cortan justo cuando los necesitás. El síntoma nunca apunta a la causa. Son dos líneas de configuración.',
      porQueNo: {
        1: 'Por defecto no rota nada.',
        2: 'Al contrario: se acumulan indefinidamente.',
        3: 'Es una de las causas de incidente más frustrantes por lo difícil de diagnosticar.',
      },
    },
  ],
});
