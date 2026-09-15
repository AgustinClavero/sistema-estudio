/* ==========================================================================
   Infra · Módulo 08 — Despliegue, CI/CD y entornos
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'infra',
  id: 'm08',
  titulo: 'Despliegue, CI/CD y entornos',
  fuentes: ['12factor', 'docker', 'postgres', 'supabase-docs'],

  intro:
    '<p>El despliegue es la parte del trabajo que más se improvisa y la que más incidentes causa. No porque sea ' +
    'difícil, sino porque casi siempre se arma <b>a los apurones</b> y después nadie lo vuelve a mirar.</p>' +
    '<p>Este módulo va sobre construir un camino a producción que sea <b>aburrido</b>: predecible, verificado y ' +
    'reversible. Un despliegue emocionante es un despliegue mal hecho.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'El pipeline: qué verificar y en qué orden',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un pipeline es una <b>lista de comprobaciones que
corre sola</b> antes de que tu código llegue a los usuarios. Su valor no está en automatizar: está en que
<b>nadie pueda saltearse los pasos</b>.</div>

<h4>Las etapas, en orden de costo</h4>
<p>La regla es simple: <b>lo barato y rápido primero</b>. Si el formato está mal, no tiene sentido correr los
tests de integración durante ocho minutos.</p>

<ol>
<li><b>Formato y lint</b> — segundos. Detecta lo trivial antes de gastar nada.</li>
<li><b>Tipos</b> — decenas de segundos. Atrapa una clase entera de errores.</li>
<li><b>Tests unitarios</b> — segundos a minutos.</li>
<li><b>Build</b> — minutos. Si no compila, nada más importa.</li>
<li><b>Tests de integración</b> — minutos. Con base de datos real.</li>
<li><b>Despliegue a un entorno de prueba</b>.</li>
<li><b>Verificación posterior</b> — que lo desplegado efectivamente responda.</li>
</ol>

<div class="aviso"><strong>El paso 7 es el que casi nadie tiene y el que más incidentes evita.</strong> Un
despliegue que "salió bien" puede haber dejado la aplicación caída: el contenedor arrancó pero no conecta a la
base, faltó una variable de entorno, la migración no corrió. <b>Sin una verificación posterior, te enterás por
un usuario.</b></div>

<h4>Qué debería frenar un despliegue</h4>
<table>
<tr><th>Sí frena</th><th>No frena</th></tr>
<tr><td>El build falla</td><td>Advertencias de lint</td></tr>
<tr><td>Los tests fallan</td><td>Cobertura de tests que bajó un punto</td></tr>
<tr><td>Los tipos no chequean</td><td>Una dependencia con una versión menor nueva</td></tr>
<tr><td>Una vulnerabilidad crítica conocida</td><td>Vulnerabilidades bajas en dependencias de desarrollo</td></tr>
<tr><td>La verificación posterior falla</td><td>Que el pipeline tardó dos minutos más</td></tr>
</table>

<p>Un pipeline que frena por cualquier cosa termina siendo un pipeline que la gente aprende a saltear. <b>Frenar
tiene que significar algo.</b></p>

<h4>El pipeline tiene que ser rápido</h4>
<p>Si tarda 25 minutos, la gente deja de esperarlo, empieza a saltearlo y a mezclar cambios para "aprovechar el
viaje". <b>Un pipeline lento se degrada solo</b>, porque el equipo lo empieza a evitar.</p>
<p>Objetivo razonable: <b>menos de 10 minutos</b> desde el commit hasta saber si está bien.</p>
`,

      tecnico: `
<h4>Un pipeline realista</h4>
<pre><code>name: ci
on: [pull_request, push]

jobs:
  rapido:                        # todo lo barato, en paralelo
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test:unit

  integracion:
    needs: rapido                # solo si lo barato pasó
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_PASSWORD: test }
        options: &gt;-
          --health-cmd pg_isready --health-interval 5s --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm migrate:test
      - run: pnpm test:integration</code></pre>

<div class="dato"><strong>Ese <code>--frozen-lockfile</code> no es un detalle.</strong> Sin él, el gestor de
paquetes puede resolver versiones distintas de las que probaste localmente, y terminás desplegando algo que
nunca corriste. Con la bandera, si el archivo de bloqueo no coincide con el manifiesto, <b>el pipeline falla</b>
— que es exactamente lo que querés.</div>

<h4>Hacerlo rápido</h4>
<table>
<tr><th>Técnica</th><th>Ahorro</th></tr>
<tr><td><b>Caché de dependencias</b></td><td>Minutos en cada corrida</td></tr>
<tr><td><b>Paralelizar</b> lint, tipos y tests</td><td>El tiempo del más lento, no la suma</td></tr>
<tr><td><b>Fallar rápido</b>: lo barato primero</td><td>No gastás 8 minutos para descubrir un error de formato</td></tr>
<tr><td><b>Solo lo que cambió</b>, en monorepo</td><td>Enorme cuando hay varias aplicaciones</td></tr>
<tr><td><b>Caché de capas de Docker</b></td><td>Build de minutos a segundos</td></tr>
</table>

<h4>La verificación posterior al despliegue</h4>
<p>Es la etapa que separa "desplegué" de "funciona". Lo mínimo:</p>
<pre><code># 1 · el endpoint de salud responde
curl -fsS https://tuapp.com/salud/listo || exit 1

# 2 · la versión desplegada es la que esperabas
VERSION=$(curl -fsS https://tuapp.com/salud | jq -r .version)
[ "$VERSION" = "$GIT_SHA" ] || { echo "Versión incorrecta: $VERSION"; exit 1; }

# 3 · una operación real de punta a punta
curl -fsS https://tuapp.com/api/ping-db || exit 1</code></pre>

<div class="dato"><strong>El punto 2 es el que atrapa el fallo más confuso de todos:</strong> el despliegue
reportó éxito pero la versión vieja sigue corriendo — porque el contenedor nuevo no arrancó y el orquestador
mantuvo el anterior, o porque la caché sirvió el build previo. Exponer la versión en el endpoint de salud
cuesta tres líneas y convierte ese misterio en una alerta.</div>

<h4>Migraciones en el pipeline</h4>
<p>La pregunta que aparece siempre: ¿la migración corre antes o después del despliegue?</p>
<ul>
<li><b>Antes</b>, y la migración debe ser <b>compatible con el código viejo</b> —que todavía está corriendo—.</li>
<li>Nunca en el arranque de la aplicación: si tenés cinco instancias, <b>cinco migraciones compitiendo</b>.</li>
<li>Siempre como un <b>paso propio</b>, con bloqueo, y que falle el despliegue si falla.</li>
</ul>
<p>Es el patrón <i>expand and contract</i> que ya viste: agregar primero, migrar el código después, y eliminar
lo viejo en un despliegue posterior.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="ci1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LO BARATO PRIMERO — fallar rápido es fallar barato</text>

  <rect x="24" y="34" width="92" height="46" rx="8" fill="#34d399" fill-opacity=".28" stroke="#34d399" stroke-width="1.3"/>
  <text x="70" y="53" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">lint</text>
  <text x="70" y="68" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">segundos</text>

  <line x1="120" y1="57" x2="134" y2="57" stroke="currentColor" stroke-width="1.3" marker-end="url(#ci1)"/>

  <rect x="138" y="34" width="92" height="46" rx="8" fill="#34d399" fill-opacity=".24" stroke="#34d399" stroke-width="1.3"/>
  <text x="184" y="53" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">tipos</text>
  <text x="184" y="68" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">~30 s</text>

  <line x1="234" y1="57" x2="248" y2="57" stroke="currentColor" stroke-width="1.3" marker-end="url(#ci1)"/>

  <rect x="252" y="34" width="92" height="46" rx="8" fill="#22d3ee" fill-opacity=".24" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="298" y="53" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">tests</text>
  <text x="298" y="68" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">1-2 min</text>

  <line x1="348" y1="57" x2="362" y2="57" stroke="currentColor" stroke-width="1.3" marker-end="url(#ci1)"/>

  <rect x="366" y="34" width="92" height="46" rx="8" fill="#fbbf24" fill-opacity=".24" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="412" y="53" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">build</text>
  <text x="412" y="68" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">2-4 min</text>

  <line x1="462" y1="57" x2="476" y2="57" stroke="currentColor" stroke-width="1.3" marker-end="url(#ci1)"/>

  <rect x="480" y="34" width="92" height="46" rx="8" fill="#7c5cff" fill-opacity=".24" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="526" y="53" text-anchor="middle" fill="#7c5cff" font-size="10" font-weight="700">integración</text>
  <text x="526" y="68" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">3-5 min</text>

  <line x1="576" y1="57" x2="590" y2="57" stroke="currentColor" stroke-width="1.3" marker-end="url(#ci1)"/>

  <rect x="594" y="34" width="62" height="46" rx="8" fill="#7c5cff" fill-opacity=".3" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="625" y="60" text-anchor="middle" fill="#7c5cff" font-size="10" font-weight="700">deploy</text>

  <text x="24" y="100" fill="#34d399" font-size="10.5" font-weight="700">
    objetivo: menos de 10 minutos del commit a saber si está bien</text>
  <text x="24" y="116" fill="currentColor" opacity=".55" font-size="10">
    un pipeline de 25 minutos se degrada solo: la gente lo evita y mezcla cambios para “aprovechar el viaje”</text>

  <line x1="24" y1="136" x2="656" y2="136" stroke="currentColor" opacity=".18"/>

  <rect x="24" y="150" width="632" height="66" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.6"/>
  <text x="44" y="172" fill="#f87171" font-size="12" font-weight="700">LA ETAPA QUE CASI NADIE TIENE: VERIFICACIÓN POSTERIOR</text>
  <text x="44" y="192" fill="currentColor" opacity=".75" font-size="11">
    Un despliegue puede reportar éxito y dejar la app caída: el contenedor arrancó pero no conecta a la base,</text>
  <text x="44" y="209" fill="currentColor" opacity=".75" font-size="11">
    faltó una variable, la migración no corrió. <tspan fill="#f87171" font-weight="700">Sin verificación posterior, te enterás por un usuario.</tspan></text>

  <text x="24" y="244" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    QUÉ DEBERÍA FRENAR UN DESPLIEGUE</text>

  <rect x="24" y="256" width="304" height="130" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="278" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">SÍ FRENA</text>
  <text x="44" y="300" fill="currentColor" opacity=".72" font-size="10.5">· el build falla</text>
  <text x="44" y="318" fill="currentColor" opacity=".72" font-size="10.5">· los tests fallan</text>
  <text x="44" y="336" fill="currentColor" opacity=".72" font-size="10.5">· los tipos no chequean</text>
  <text x="44" y="354" fill="currentColor" opacity=".72" font-size="10.5">· vulnerabilidad crítica conocida</text>
  <text x="44" y="372" fill="#f87171" font-size="10.5" font-weight="700">· la verificación posterior falla</text>

  <rect x="352" y="256" width="304" height="130" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.3"/>
  <text x="504" y="278" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">NO FRENA</text>
  <text x="372" y="300" fill="currentColor" opacity=".72" font-size="10.5">· advertencias de lint</text>
  <text x="372" y="318" fill="currentColor" opacity=".72" font-size="10.5">· cobertura que bajó un punto</text>
  <text x="372" y="336" fill="currentColor" opacity=".72" font-size="10.5">· una versión menor nueva de una dep</text>
  <text x="372" y="354" fill="currentColor" opacity=".72" font-size="10.5">· vulnerabilidades bajas en devDeps</text>
  <text x="372" y="372" fill="#34d399" font-size="10.5" font-weight="700">frenar tiene que SIGNIFICAR algo</text>
</svg>`,
        pie: 'Un pipeline que frena por cualquier cosa es un pipeline que la gente aprende a saltear.',
      },

      entrevista: [
        { p: '¿Cómo ordenarías las etapas de un pipeline?',
          r: 'Por <b>costo creciente</b>: formato y lint en segundos, después tipos, tests unitarios, build, y por último tests de integración con base ' +
             'real. La idea es <b>fallar rápido y barato</b>: no tiene sentido correr ocho minutos de integración para descubrir un error de formato. ' +
             'Y agrego una etapa que casi nadie tiene: <b>verificación posterior al despliegue</b>, porque un deploy puede reportar éxito y dejar la ' +
             'aplicación caída — el contenedor arrancó pero no conecta a la base, o faltó una variable de entorno.' },

        { p: '¿Qué debería frenar un despliegue y qué no?',
          r: 'Frenan: el build, los tests, los tipos, una vulnerabilidad crítica conocida y la verificación posterior. <b>No</b> frenan: advertencias ' +
             'de lint, una caída de un punto en cobertura, versiones menores nuevas de dependencias o vulnerabilidades bajas en dependencias de ' +
             'desarrollo. La razón es práctica: <b>un pipeline que frena por cualquier cosa es un pipeline que la gente aprende a saltear</b>, ' +
             'y ahí perdés también las verificaciones que sí importaban.' },

        { p: '¿Por qué importa que el pipeline sea rápido?',
          r: 'Porque si tarda veinticinco minutos, el equipo deja de esperarlo: empieza a saltearlo y a mezclar varios cambios en un mismo commit para ' +
             '"aprovechar el viaje" — que es justo lo contrario de lo que querés, porque hace más difícil saber qué rompió qué. ' +
             '<b>Un pipeline lento se degrada solo.</b> El objetivo razonable es menos de diez minutos, y se consigue con caché de dependencias, ' +
             'paralelizando lo independiente y ejecutando lo barato primero.' },

        { p: '¿Dónde corren las migraciones de base de datos en un pipeline?',
          r: 'Como un <b>paso propio antes del despliegue</b>, con bloqueo, y que haga fallar todo si falla. Y la migración tiene que ser ' +
             '<b>compatible con el código viejo</b>, porque durante el despliegue progresivo ese código todavía está atendiendo. ' +
             'Lo que hay que evitar es correrlas <b>en el arranque de la aplicación</b>: con cinco instancias tenés cinco migraciones compitiendo. ' +
             'El patrón es <i>expand and contract</i>: agregar, desplegar el código nuevo, y eliminar lo viejo en un despliegue posterior.' },
      ],

      practica: `
<h4>Endpoint de salud que sirve para verificar</h4>
<pre><code>// Exponer la versión es lo que atrapa el fallo más confuso:
// "el deploy salió bien" pero sigue corriendo la versión anterior.
app.get('/salud', (req, res) =&gt; {
  res.json({
    ok: true,
    version: process.env.GIT_SHA ?? 'desconocida',
    arrancado: arranqueTs,
  });
});

app.get('/salud/listo', async (req, res) =&gt; {
  try {
    await db.query('select 1');
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false, motivo: 'base no disponible' });
  }
});</code></pre>

<h4>Verificación posterior en el pipeline</h4>
<pre><code>- name: Verificar despliegue
  run: |
    for i in $(seq 1 20); do
      VERSION=$(curl -fsS "$URL/salud" | jq -r .version) &amp;&amp; break || sleep 5
    done

    if [ "$VERSION" != "$GITHUB_SHA" ]; then
      echo "::error::Se desplegó $VERSION pero se esperaba $GITHUB_SHA"
      exit 1
    fi

    curl -fsS "$URL/salud/listo" || { echo "::error::No está listo"; exit 1; }</code></pre>

<div class="aviso"><strong>Ese bucle de reintentos es necesario:</strong> justo después de un despliegue la
aplicación puede tardar unos segundos en estar lista. Sin reintentos, la verificación falla siempre y termina
desactivándose — que es peor que no tenerla.</div>

<h4>Migración como paso propio, con bloqueo</h4>
<pre><code>-- Bloqueo consultivo: si dos despliegues corren a la vez,
-- el segundo espera en vez de aplicar la misma migración dos veces.
select pg_advisory_lock(727272);

-- … aplicar migraciones pendientes …

select pg_advisory_unlock(727272);</code></pre>

<h4>Checklist de un pipeline sano</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Instalación reproducible (<code>--frozen-lockfile</code>)</td></tr>
<tr><td>☐</td><td>Etapas ordenadas de barata a cara</td></tr>
<tr><td>☐</td><td>Caché de dependencias y de capas de Docker</td></tr>
<tr><td>☐</td><td>Menos de 10 minutos de punta a punta</td></tr>
<tr><td>☐</td><td>Migraciones como paso propio, con bloqueo</td></tr>
<tr><td>☐</td><td><b>Verificación posterior que compara la versión</b></td></tr>
<tr><td>☐</td><td>Solo frena por cosas que importan</td></tr>
</table>
`,

      errores: [
        { mito: 'Si el despliegue reportó éxito, la aplicación está funcionando.',
          realidad: 'Puede haber arrancado sin conectar a la base, con una variable faltante o sin correr la migración. ' +
                    '<b>Una verificación posterior que compare la versión desplegada</b> convierte ese misterio en una alerta, y cuesta tres líneas.' },

        { mito: 'Cuantas más verificaciones frenen el despliegue, mejor.',
          realidad: 'Un pipeline que frena por advertencias de lint o por un punto de cobertura <b>se termina salteando</b>, y ahí perdés también ' +
                    'las verificaciones que sí importaban. <b>Frenar tiene que significar algo.</b>' },

        { mito: 'Las migraciones las corro al arrancar la aplicación.',
          realidad: 'Con varias instancias tenés <b>varias migraciones compitiendo</b>. Van como paso propio antes del despliegue, con bloqueo, ' +
                    'y siendo compatibles con el código viejo que todavía está atendiendo.' },

        { mito: 'Que el pipeline tarde 25 minutos no es grave.',
          realidad: 'Lo es, pero de forma indirecta: la gente deja de esperarlo, lo saltea y mezcla cambios para "aprovechar el viaje". ' +
                    '<b>Un pipeline lento se degrada solo</b>, y el costo real no es el tiempo sino la disciplina que se pierde.' },
      ],

      glosario: [
        { t: 'Pipeline', d: 'Secuencia automatizada de verificaciones y pasos entre el commit y producción.' },
        { t: 'CI', d: 'Integración continua: verificar automáticamente cada cambio.' },
        { t: 'CD', d: 'Entrega o despliegue continuo: llevar a producción de forma automatizada.' },
        { t: 'Fallar rápido', d: 'Ordenar las etapas de barata a cara para detectar errores lo antes posible.' },
        { t: 'frozen-lockfile', d: 'Instalar exactamente las versiones del archivo de bloqueo. Falla si no coinciden.' },
        { t: 'Verificación posterior', d: 'Comprobar que lo desplegado responde y es la versión esperada.' },
        { t: 'Bloqueo consultivo', d: 'Mecanismo de Postgres para que dos procesos no ejecuten lo mismo a la vez.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Entornos: desarrollo, staging y producción',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un entorno de staging que <b>no se parece a
producción</b> no te dice nada. Y uno que se parece demasiado es un riesgo de filtración de datos.</div>

<h4>Para qué sirve cada uno</h4>

<p><b>Desarrollo</b> — tu máquina. Rápido, con datos de prueba, con recarga en caliente. Nada tiene que ser
igual a producción salvo las versiones de las cosas.</p>

<p><b>Staging</b> — el ensayo. Misma infraestructura, mismo proceso de despliegue, datos parecidos pero
<b>no reales</b>. Su función es que las sorpresas ocurran ahí.</p>

<p><b>Producción</b> — usuarios reales. Todo cambio pasó por los dos anteriores.</p>

<h4>Qué tiene que ser igual y qué no</h4>
<table>
<tr><th>Igual a producción</th><th>Puede diferir</th></tr>
<tr><td>Versión del runtime y de la base</td><td>Tamaño de las instancias</td></tr>
<tr><td>El proceso de despliegue</td><td>Cantidad de réplicas</td></tr>
<tr><td>Las migraciones, en el mismo orden</td><td>Volumen de datos</td></tr>
<tr><td>La estructura de las variables de entorno</td><td>Los valores de esas variables</td></tr>
<tr><td>El proxy y sus cabeceras</td><td>El dominio</td></tr>
</table>

<div class="aviso"><strong>Lo más importante de esa tabla es la fila del despliegue.</strong> Si a staging
desplegás con un script y a producción a mano, staging <b>no está ensayando nada</b>. La mitad del valor de
staging es probar <b>el proceso</b>, no solo el código.</p></div>

<h4>Los datos de staging: el problema real</h4>
<p>Querés datos que se parezcan a los de producción para que las cosas se rompan ahí y no después. Pero copiar
producción tal cual significa <b>tener datos personales reales en un entorno con menos controles</b>.</p>
<p>La solución es <b>copiar y anonimizar</b>: mismos volúmenes y misma forma, con nombres, emails y teléfonos
reemplazados. Y si el negocio lo permite, un subconjunto en vez de todo.</p>

<p>Lo que <b>nunca</b>:</p>
<ul>
<li>Staging apuntando a la base de producción.</li>
<li>Credenciales de producción en staging.</li>
<li>Mandar emails reales desde staging.</li>
<li>Cobrar de verdad desde staging.</li>
</ul>
`,

      tecnico: `
<h4>Aislamiento entre entornos</h4>
<p>La regla es que <b>ningún entorno pueda alcanzar los recursos de otro</b>. En concreto:</p>
<ul>
<li><b>Proyectos o cuentas separadas</b>, no solo bases distintas dentro del mismo proyecto.</li>
<li><b>Credenciales distintas</b> por entorno, sin excepción.</li>
<li>Servicios externos en <b>modo de prueba</b>: pagos, correo, notificaciones.</li>
<li>Un <b>bloqueo explícito</b> en el código contra apuntar a producción desde otro entorno.</li>
</ul>

<div class="dato"><strong>Ese último punto vale la pena implementarlo de verdad:</strong> una comprobación al
arrancar que verifique que la URL de la base coincida con el entorno declarado, y que <b>falle</b> si no. ' +
El accidente clásico —copiar el archivo de variables de producción a staging para "probar algo rápido" y dejarlo
ahí— se vuelve imposible. Son diez líneas y evita el peor incidente posible.</div>

<h4>Manejo de variables por entorno</h4>
<pre><code>.env.example        ← en el repositorio: qué variables hacen falta, SIN valores
.env.local          ← tu máquina, en .gitignore
.env.staging        ← valores de staging, en .gitignore o en un gestor
.env.production     ← nunca en el repositorio, solo en el proveedor</code></pre>

<p>El archivo de ejemplo es el que más se subestima: es la <b>documentación viva</b> de qué necesita la
aplicación para arrancar. Sin él, un desarrollador nuevo pasa medio día adivinando.</p>

<h4>Validar las variables al arrancar</h4>
<pre><code>import { z } from 'zod';

const Esquema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  DATABASE_URL: z.string().url(),
  STRIPE_KEY: z.string().startsWith('sk_'),
});

export const env = Esquema.parse(process.env);   // falla al ARRANCAR

// Y el bloqueo entre entornos:
if (env.NODE_ENV !== 'production' &amp;&amp; env.DATABASE_URL.includes('prod')) {
  throw new Error('Un entorno no productivo está apuntando a la base de producción');
}</code></pre>

<div class="dato"><strong>Fallar al arrancar es mucho mejor que fallar en el primer request.</strong> Si falta
una variable, el proceso no levanta, el chequeo de salud no pasa, y el despliegue progresivo <b>deja la versión
anterior atendiendo</b>. El usuario nunca se entera. Si en cambio la aplicación arranca y falla al usar la
variable, ya desplegaste algo roto.</div>

<h4>Entornos efímeros por rama</h4>
<p>El paso siguiente a staging: que <b>cada pull request</b> tenga su propio entorno desplegado, con su propia
base. Ventajas concretas:</p>
<ul>
<li>Se revisa mirando la funcionalidad, no leyendo el diff.</li>
<li>Se prueban migraciones en aislamiento.</li>
<li>Varios cambios en paralelo sin pisarse.</li>
<li>Se destruye al cerrar la rama, así que no acumula costo.</li>
</ul>
<p>Es lo que resuelve el <b>branching de base</b> que viste en el módulo anterior: una copia instantánea de los
datos para cada rama, sin duplicar almacenamiento.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="en1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <rect x="24" y="34" width="190" height="94" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.3"/>
  <text x="119" y="56" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">DESARROLLO</text>
  <text x="119" y="78" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">tu máquina</text>
  <text x="119" y="96" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">datos de prueba</text>
  <text x="119" y="114" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">recarga en caliente</text>

  <line x1="218" y1="81" x2="242" y2="81" stroke="currentColor" stroke-width="1.4" marker-end="url(#en1)"/>

  <rect x="246" y="34" width="190" height="94" rx="10" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="341" y="56" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">STAGING</text>
  <text x="341" y="78" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">el ENSAYO</text>
  <text x="341" y="96" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">mismo proceso de deploy</text>
  <text x="341" y="114" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">datos parecidos, anonimizados</text>

  <line x1="440" y1="81" x2="464" y2="81" stroke="currentColor" stroke-width="1.4" marker-end="url(#en1)"/>

  <rect x="468" y="34" width="188" height="94" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="562" y="56" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">PRODUCCIÓN</text>
  <text x="562" y="78" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">usuarios reales</text>
  <text x="562" y="96" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">todo pasó por los dos</text>
  <text x="562" y="114" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">anteriores</text>

  <rect x="24" y="142" width="632" height="34" rx="8" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="340" y="163" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">
    Si a staging desplegás con script y a producción a mano, staging no está ensayando NADA.</text>

  <line x1="24" y1="194" x2="656" y2="194" stroke="currentColor" opacity=".18"/>

  <text x="24" y="218" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    QUÉ TIENE QUE SER IGUAL Y QUÉ NO</text>

  <rect x="24" y="230" width="304" height="112" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.3"/>
  <text x="176" y="252" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">IGUAL</text>
  <text x="44" y="274" fill="currentColor" opacity=".72" font-size="10.5">· versión del runtime y de la base</text>
  <text x="44" y="292" fill="#34d399" font-size="10.5" font-weight="700">· el proceso de despliegue</text>
  <text x="44" y="310" fill="currentColor" opacity=".72" font-size="10.5">· las migraciones, en el mismo orden</text>
  <text x="44" y="328" fill="currentColor" opacity=".72" font-size="10.5">· la estructura de las variables</text>

  <rect x="352" y="230" width="304" height="112" rx="10" fill="#22d3ee" fill-opacity=".08" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="504" y="252" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">PUEDE DIFERIR</text>
  <text x="372" y="274" fill="currentColor" opacity=".72" font-size="10.5">· tamaño de las instancias</text>
  <text x="372" y="292" fill="currentColor" opacity=".72" font-size="10.5">· cantidad de réplicas</text>
  <text x="372" y="310" fill="currentColor" opacity=".72" font-size="10.5">· volumen de datos</text>
  <text x="372" y="328" fill="#22d3ee" font-size="10.5" font-weight="700">· los VALORES de las variables</text>

  <rect x="24" y="356" width="632" height="32" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="370" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    NUNCA: staging apuntando a la base de producción · credenciales de prod en staging</text>
  <text x="340" y="383" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10">
    Un chequeo al arrancar que falle si la URL no coincide con el entorno lo vuelve imposible. Diez líneas.</text>
</svg>`,
        pie: 'La mitad del valor de staging es ensayar el proceso de despliegue, no solo el código.',
      },

      entrevista: [
        { p: '¿Qué tiene que ser igual entre staging y producción?',
          r: 'La <b>versión del runtime y de la base</b>, las <b>migraciones en el mismo orden</b>, la <b>estructura</b> de las variables de entorno, ' +
             'la configuración del proxy, y sobre todo <b>el proceso de despliegue</b>. Ese último es el que más se descuida: si a staging desplegás ' +
             'con un script y a producción a mano, staging no está ensayando nada. Lo que <b>puede</b> diferir es el tamaño de las instancias, ' +
             'la cantidad de réplicas, el volumen de datos y los valores de las variables.' },

        { p: '¿Cómo manejás los datos de staging?',
          r: 'Copiando de producción y <b>anonimizando</b>: mismos volúmenes y misma forma, con nombres, emails y teléfonos reemplazados. ' +
             'La forma de los datos importa porque es lo que hace que las cosas se rompan en staging y no en producción — un registro con un campo ' +
             'nulo inesperado, un texto larguísimo. Lo que nunca hago es apuntar staging a la base de producción, usar credenciales reales, ' +
             'mandar emails de verdad ni cobrar. Y los servicios externos van todos en modo de prueba.' },

        { p: '¿Cómo evitás que un entorno apunte accidentalmente a la base de producción?',
          r: 'Con una <b>comprobación al arrancar</b> que verifique que la URL de la base sea coherente con el entorno declarado, y que ' +
             '<b>falle</b> si no. Son diez líneas y vuelven imposible el accidente clásico: copiar el archivo de variables de producción a otro ' +
             'entorno para "probar algo rápido" y dejarlo ahí. Sumado a <b>proyectos separados</b> con credenciales distintas — no solo bases ' +
             'distintas dentro del mismo proyecto—, que es lo que hace que el error ni siquiera sea posible.' },

        { p: '¿Por qué conviene validar las variables de entorno al arrancar?',
          r: 'Porque si falta una, el proceso <b>no levanta</b>, el chequeo de salud no pasa, y el despliegue progresivo deja la versión anterior ' +
             'atendiendo. <b>El usuario nunca se entera.</b> Si en cambio la aplicación arranca y falla recién al usar esa variable, ya desplegaste ' +
             'algo roto y te enterás por un error en producción. Validar con un esquema al inicio convierte un incidente en un despliegue que ' +
             'simplemente no progresa.' },
      ],

      practica: `
<h4>El bloqueo entre entornos</h4>
<pre><code>// Diez líneas que vuelven imposible el peor accidente
const entorno = env.NODE_ENV;
const urlBase = env.DATABASE_URL;

const esProduccion = /prod|produccion/i.test(urlBase);

if (entorno !== 'production' &amp;&amp; esProduccion) {
  throw new Error(
    \`El entorno "\${entorno}" está apuntando a una base que parece de producción. Abortando.\`
  );
}
if (entorno === 'production' &amp;&amp; !esProduccion) {
  throw new Error('Producción no está apuntando a la base de producción. Abortando.');
}</code></pre>

<div class="aviso"><strong>La segunda comprobación también importa</strong> y casi nadie la pone: producción
apuntando por error a la base de staging significa que los usuarios reales están escribiendo en datos de
prueba, y que nada de lo que hicieron se guardó donde corresponde. Es más difícil de detectar que el caso
inverso.</div>

<h4>Anonimizar al copiar a staging</h4>
<pre><code>-- Después de restaurar el volcado en staging
update usuarios set
  email    = 'usuario' || id || '@ejemplo.invalid',
  nombre   = 'Nombre ' || id,
  telefono = '+540000000000',
  documento = null;

update pagos set
  tarjeta_ultimos4 = '0000',
  referencia_externa = null;

-- Desactivar todo lo que pueda salir hacia afuera
update configuracion set
  smtp_habilitado = false,
  webhooks_habilitados = false;</code></pre>

<h4>El archivo de ejemplo, que es documentación</h4>
<pre><code># .env.example — en el repositorio, SIN valores reales
NODE_ENV=development

# Base de datos
DATABASE_URL=postgres://usuario:clave@localhost:5432/miapp
DIRECT_URL=            # conexión directa, para migraciones

# Autenticación
NEXTAUTH_SECRET=       # generar con: openssl rand -base64 32

# Servicios externos (usar claves de PRUEBA en no-producción)
STRIPE_SECRET_KEY=sk_test_...
RESEND_API_KEY=</code></pre>

<h4>Checklist de entornos</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Proyectos o cuentas separadas, no solo bases distintas</td></tr>
<tr><td>☐</td><td>Credenciales distintas por entorno</td></tr>
<tr><td>☐</td><td>Servicios externos en modo prueba fuera de producción</td></tr>
<tr><td>☐</td><td>Bloqueo al arrancar contra apuntar al entorno equivocado</td></tr>
<tr><td>☐</td><td>Variables validadas con esquema al arrancar</td></tr>
<tr><td>☐</td><td><code>.env.example</code> actualizado en el repositorio</td></tr>
<tr><td>☐</td><td>Datos de staging anonimizados</td></tr>
<tr><td>☐</td><td><b>Mismo proceso de despliegue</b> en staging y producción</td></tr>
</table>
`,

      errores: [
        { mito: 'Staging con datos de prueba mínimos alcanza.',
          realidad: 'Con tres registros ficticios no se rompe nada, y por eso <b>no ensaya nada</b>. Los problemas aparecen con la <b>forma</b> real de ' +
                    'los datos: campos nulos inesperados, textos larguísimos, casos raros. Conviene copiar y anonimizar.' },

        { mito: 'Puedo apuntar staging a producción para probar con datos reales.',
          realidad: 'Es el peor accidente posible: una migración de prueba, un borrado, un email masivo. Y además pone datos personales reales en un ' +
                    'entorno con menos controles. <b>Un chequeo al arrancar lo vuelve imposible</b> — y también conviene el chequeo inverso.' },

        { mito: 'A staging despliego con el script y a producción lo hago a mano.',
          realidad: 'Entonces staging <b>no está ensayando el proceso</b>, que es la mitad de su valor. Lo que falla en un despliegue suele ser el ' +
                    'despliegue mismo: una variable faltante, una migración que no corrió, un paso olvidado.' },

        { mito: 'Si falta una variable, me entero cuando falle.',
          realidad: 'Te enterás con un error <b>en producción</b>, con usuarios adentro. Validando al arrancar, el proceso no levanta, el chequeo de ' +
                    'salud no pasa y el despliegue progresivo <b>deja la versión anterior atendiendo</b>: el usuario nunca se entera.' },
      ],

      glosario: [
        { t: 'Staging', d: 'Entorno de ensayo con la misma infraestructura y proceso que producción.' },
        { t: 'Entorno efímero', d: 'Entorno desplegado por rama o pull request, que se destruye al cerrarla.' },
        { t: 'Anonimización', d: 'Reemplazar datos personales conservando el volumen y la forma.' },
        { t: '.env.example', d: 'Archivo versionado que documenta qué variables hacen falta, sin valores.' },
        { t: 'Validación de entorno', d: 'Comprobar con un esquema que las variables existan y sean válidas al arrancar.' },
        { t: 'Modo de prueba', d: 'Configuración de un servicio externo que no produce efectos reales.' },
        { t: 'Paridad de entornos', d: 'Que staging y producción coincidan en lo que importa: versiones, proceso y estructura.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Secretos: dónde viven y cómo se rotan',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un secreto en el repositorio está comprometido
<b>para siempre</b>, aunque lo borres en el commit siguiente. El historial de git no olvida.</div>

<h4>Dónde viven los secretos</h4>
<table>
<tr><th>Lugar</th><th>Veredicto</th></tr>
<tr><td>En el código</td><td>❌ Nunca</td></tr>
<tr><td>En un archivo <code>.env</code> versionado</td><td>❌ Nunca</td></tr>
<tr><td>En un archivo <code>.env</code> ignorado por git</td><td>✔ En desarrollo</td></tr>
<tr><td>En las variables del proveedor</td><td>✔ El default para producción</td></tr>
<tr><td>En un gestor de secretos</td><td>✔ Cuando hay equipo y rotación</td></tr>
</table>

<h4>Qué hacer si se filtró uno</h4>
<p>El orden importa, y la mayoría lo hace al revés:</p>
<ol>
<li><b>Rotar el secreto</b> — inmediatamente. Es lo único que realmente lo resuelve.</li>
<li><b>Revisar el uso</b> — buscar accesos no reconocidos desde que se filtró.</li>
<li>Limpiar el historial, si corresponde. Es lo <b>menos</b> urgente.</li>
</ol>

<div class="aviso"><strong>Por qué borrarlo del historial no alcanza:</strong> si el repositorio es público,
hay bots que escanean commits <b>en segundos</b>. Si es privado, cualquiera con un clon anterior lo tiene.
Reescribir el historial es incómodo, rompe los clones de todo el equipo y <b>no revoca nada</b>.
<b>La clave filtrada hay que rotarla, y punto.</b></div>

<h4>Rotación</h4>
<p>Rotar es cambiar un secreto por otro nuevo. Conviene hacerlo periódicamente, no solo ante un incidente:
si una clave se filtró y nadie lo notó, la rotación acota la ventana.</p>
<p>Lo que hace que la rotación sea posible sin cortar el servicio es que el sistema soporte <b>dos claves
válidas a la vez</b> durante la transición. Si solo admite una, rotar implica un corte — y por eso nunca se
hace.</p>
`,

      tecnico: `
<h4>Rotación sin cortes</h4>
<p>El patrón es el mismo <i>expand and contract</i> de siempre:</p>
<pre><code>1. Crear la clave NUEVA. Las dos son válidas.
2. Desplegar la configuración con la nueva.
3. Verificar que todo usa la nueva (métricas, logs).
4. Revocar la VIEJA.</code></pre>
<p>Los pasos 1 a 3 son reversibles. Solo el 4 es definitivo. Si el servicio no permite dos claves simultáneas,
rotar exige una ventana de mantenimiento — y por eso conviene verificarlo <b>antes</b> de elegir un proveedor.</p>

<h4>Qué rotar y con qué frecuencia</h4>
<table>
<tr><th>Secreto</th><th>Frecuencia</th><th>Y siempre que…</th></tr>
<tr><td>Claves de API de terceros</td><td>Cada 6-12 meses</td><td>Alguien deja el equipo</td></tr>
<tr><td>Contraseñas de base de datos</td><td>Cada 6-12 meses</td><td>Se sospeche exposición</td></tr>
<tr><td>Claves de firma de sesión</td><td>Con cuidado: invalida sesiones</td><td>Se sospeche compromiso</td></tr>
<tr><td>Credenciales de despliegue</td><td>Cada 3-6 meses</td><td>Cambie quién tiene acceso</td></tr>
<tr><td>Firmas de webhook</td><td>Cada 12 meses</td><td>—</td></tr>
</table>

<div class="dato"><strong>La columna de la derecha suele importar más que la del medio.</strong> El momento en
que alguien deja el equipo es cuando la rotación es realmente necesaria, y es justo cuando nadie se acuerda de
hacerla. Conviene que sea un ítem de la lista de salida, no una buena intención.</div>

<h4>Prevenir la filtración</h4>
<ul>
<li><b><code>.gitignore</code> con todos los patrones</b>: <code>.env</code>, <code>.env.*</code>, <code>*.pem</code>, <code>*.key</code> — con la excepción de <code>.env.example</code>.</li>
<li><b>Un hook previo al commit</b> que escanee patrones de secretos y frene.</li>
<li><b>Escaneo en CI</b>, por si alguien no tiene el hook instalado.</li>
<li><b>Escaneo del proveedor de git</b>, activado.</li>
</ul>
<p>El hook local es el que más atrapa, pero no es confiable —se puede saltear o no estar instalado—. Por eso
hace falta también la verificación en CI, que nadie puede saltear.</p>

<h4>Secretos en distintos contextos</h4>
<table>
<tr><th>Contexto</th><th>Cómo</th></tr>
<tr><td>Aplicación en producción</td><td>Variables del proveedor, o un gestor de secretos</td></tr>
<tr><td>Pipeline de CI</td><td>Secretos del repositorio, con alcance por entorno</td></tr>
<tr><td>Contenedor en build</td><td><code>--mount=type=secret</code>, que no deja rastro en capas</td></tr>
<tr><td>Kubernetes</td><td>Secrets, pero <b>solo en base64</b>: hace falta cifrado en reposo o un gestor externo</td></tr>
<tr><td>Desarrollo local</td><td><code>.env.local</code> ignorado por git</td></tr>
</table>

<div class="dato"><strong>Un detalle sobre variables públicas en el frontend:</strong> todo lo que lleve el
prefijo del framework —<code>NEXT_PUBLIC_</code> y equivalentes— <b>termina en el paquete que descarga el
navegador</b>. Es correcto para una URL de API o una clave publicable; es un desastre para una clave de
servicio. El error se comete cuando alguien agrega el prefijo "para que funcione" sin entender qué significa,
y la clave queda expuesta en el JavaScript del sitio.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="se1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <rect x="24" y="30" width="632" height="56" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="340" y="54" text-anchor="middle" fill="#f87171" font-size="13" font-weight="700">
    Un secreto en el repositorio está comprometido PARA SIEMPRE.</text>
  <text x="340" y="74" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11">
    Si es público, hay bots que escanean commits en segundos. Si es privado, cualquiera con un clon anterior lo tiene.</text>

  <text x="24" y="112" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    QUÉ HACER SI SE FILTRÓ — y la mayoría lo hace al revés</text>

  <rect x="24" y="124" width="196" height="62" rx="9" fill="#34d399" fill-opacity=".22" stroke="#34d399" stroke-width="1.8"/>
  <text x="122" y="146" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">1 · ROTAR</text>
  <text x="122" y="164" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">inmediatamente</text>
  <text x="122" y="179" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">lo único que lo resuelve</text>

  <line x1="224" y1="155" x2="242" y2="155" stroke="currentColor" stroke-width="1.3" marker-end="url(#se1)"/>

  <rect x="246" y="124" width="196" height="62" rx="9" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="344" y="146" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">2 · REVISAR EL USO</text>
  <text x="344" y="164" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">accesos no reconocidos</text>
  <text x="344" y="179" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">desde que se filtró</text>

  <line x1="446" y1="155" x2="464" y2="155" stroke="currentColor" stroke-width="1.3" marker-end="url(#se1)"/>

  <rect x="468" y="124" width="188" height="62" rx="9" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".3" stroke-width="1.2"/>
  <text x="562" y="146" text-anchor="middle" fill="currentColor" opacity=".7" font-size="12" font-weight="700">3 · limpiar historial</text>
  <text x="562" y="164" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10.5">lo MENOS urgente</text>
  <text x="562" y="179" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">no revoca nada</text>

  <line x1="24" y1="206" x2="656" y2="206" stroke="currentColor" opacity=".18"/>

  <text x="24" y="230" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    ROTAR SIN CORTAR — solo el último paso es definitivo</text>

  <rect x="24" y="242" width="146" height="52" rx="9" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.2"/>
  <text x="97" y="262" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">1 · crear la nueva</text>
  <text x="97" y="280" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">las dos válidas</text>

  <text x="178" y="272" fill="currentColor" opacity=".4" font-size="14">→</text>

  <rect x="196" y="242" width="146" height="52" rx="9" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.2"/>
  <text x="269" y="262" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">2 · desplegar</text>
  <text x="269" y="280" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">con la nueva</text>

  <text x="350" y="272" fill="currentColor" opacity=".4" font-size="14">→</text>

  <rect x="368" y="242" width="146" height="52" rx="9" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.2"/>
  <text x="441" y="262" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">3 · verificar</text>
  <text x="441" y="280" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">métricas y logs</text>

  <text x="522" y="272" fill="currentColor" opacity=".4" font-size="14">→</text>

  <rect x="540" y="242" width="116" height="52" rx="9" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.6"/>
  <text x="598" y="262" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">4 · revocar</text>
  <text x="598" y="280" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">definitivo</text>

  <rect x="24" y="310" width="632" height="76" rx="10" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="332" fill="#fbbf24" font-size="12" font-weight="700">EL ERROR QUE EXPONE CLAVES SIN QUE NADIE LO NOTE</text>
  <text x="44" y="354" fill="currentColor" opacity=".75" font-size="11">
    Agregar el prefijo público —<tspan font-family="monospace">NEXT_PUBLIC_</tspan> y equivalentes— “para que funcione”.</text>
  <text x="44" y="374" fill="#f87171" font-size="11" font-weight="700">
    Esa variable termina en el JavaScript que descarga el navegador. Correcto para una URL; desastre para una clave de servicio.</text>
</svg>`,
        pie: 'Borrar del historial no revoca nada. La clave filtrada se rota, y punto.',
      },

      entrevista: [
        { p: 'Se filtró una clave de API en un commit. ¿Qué hacés?',
          r: '<b>Rotarla inmediatamente</b>: es lo único que realmente lo resuelve. Después reviso el uso de esa clave desde el momento de la filtración ' +
             'buscando accesos no reconocidos. Y limpiar el historial es lo <b>menos</b> urgente, porque <b>no revoca nada</b>: si el repositorio es ' +
             'público hay bots que escanean commits en segundos, y si es privado cualquiera con un clon anterior ya la tiene. ' +
             'Reescribir el historial además rompe los clones de todo el equipo. <b>La clave filtrada se rota.</b>' },

        { p: '¿Cómo rotás un secreto sin cortar el servicio?',
          r: 'Con el mismo patrón de <i>expand and contract</i>: creo la clave nueva de modo que <b>las dos sean válidas a la vez</b>, despliego la ' +
             'configuración con la nueva, verifico en métricas y logs que todo la esté usando, y recién ahí revoco la vieja. ' +
             'Los primeros tres pasos son reversibles; solo el último es definitivo. La condición es que el servicio <b>admita dos claves ' +
             'simultáneas</b> — si no, rotar exige una ventana de mantenimiento, y por eso nunca se hace. Conviene verificarlo antes de elegir proveedor.' },

        { p: '¿Cuándo es más importante rotar credenciales?',
          r: 'Cuando <b>alguien deja el equipo</b>. Más allá de cualquier calendario, ese es el momento en que la rotación es realmente necesaria — ' +
             'y es justo cuando nadie se acuerda. Por eso conviene que sea un ítem explícito de la lista de salida y no una buena intención. ' +
             'El otro caso es ante cualquier sospecha de exposición, donde no hay que esperar confirmación: rotar es barato y el riesgo no.' },

        { p: '¿Qué cuidado hay con las variables de entorno en el frontend?',
          r: 'Que todo lo que lleve el <b>prefijo público</b> del framework —<code>NEXT_PUBLIC_</code> y equivalentes— <b>termina en el paquete que ' +
             'descarga el navegador</b>. Es correcto para una URL de API o una clave publicable, y es un desastre para una clave de servicio. ' +
             'El error típico es agregar el prefijo "para que funcione" sin entender qué significa: la clave queda expuesta en el JavaScript del sitio ' +
             'y no genera ningún error, así que puede pasar meses sin que nadie lo note.' },
      ],

      practica: `
<h4>.gitignore completo</h4>
<pre><code># Secretos
.env
.env.*
!.env.example          # este SÍ va al repositorio
*.pem
*.key
*.p12
credentials.json
service-account*.json</code></pre>

<h4>Escaneo en CI, que nadie puede saltear</h4>
<pre><code>- name: Buscar secretos
  uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}</code></pre>
<p>El hook local atrapa más, pero se puede saltear o no estar instalado. <b>La verificación en CI es la que
realmente frena</b>, porque no depende de la configuración de cada máquina.</p>

<h4>Distinguir lo público de lo secreto</h4>
<pre><code># ✅ Público: termina en el navegador y está bien
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...     ← publicable por diseño, protegida por RLS

# ❌ NUNCA con prefijo público
SUPABASE_SERVICE_ROLE_KEY=eyJ...          ← saltea RLS: solo en el servidor
STRIPE_SECRET_KEY=sk_live_...
DATABASE_URL=postgres://...</code></pre>

<div class="aviso"><strong>La clave anónima de Supabase es publicable por diseño</strong> — su seguridad la
da RLS, no el secreto. La de <code>service_role</code> es lo opuesto: <b>saltea RLS por completo</b>. Ponerle
el prefijo público a esa segunda es una de las peores cosas que se pueden hacer, y no genera ningún error.</div>

<h4>Verificar que no se filtró nada al paquete del navegador</h4>
<pre><code># Después de construir, buscar patrones de claves en el bundle
grep -rE "sk_live|service_role|postgres://" .next/static/ && \\
  echo "⚠ HAY UN SECRETO EN EL BUNDLE" || echo "✓ limpio"</code></pre>
<p>Es una línea, se puede poner en el pipeline, y detecta el error más caro de esta lección antes de que llegue
a producción.</p>

<h4>Lista de salida cuando alguien deja el equipo</h4>
<table>
<tr><th>☐</th><th>Acción</th></tr>
<tr><td>☐</td><td>Quitar acceso al repositorio y al proveedor de nube</td></tr>
<tr><td>☐</td><td>Rotar credenciales de despliegue</td></tr>
<tr><td>☐</td><td>Rotar claves de API de terceros que haya usado</td></tr>
<tr><td>☐</td><td>Rotar contraseñas de base de datos compartidas</td></tr>
<tr><td>☐</td><td>Revisar accesos personales que haya creado</td></tr>
<tr><td>☐</td><td>Quitar de los canales de alertas</td></tr>
</table>
`,

      errores: [
        { mito: 'Borré el secreto del commit siguiente, ya está.',
          realidad: 'Sigue en el <b>historial</b>, y si el repositorio es público hay bots que lo escanearon en segundos. ' +
                    '<b>Rotarlo es lo único que lo resuelve</b>; limpiar el historial es lo menos urgente y no revoca nada.' },

        { mito: 'Roto los secretos cuando se filtran.',
          realidad: 'También hay que rotarlos cuando <b>alguien deja el equipo</b>, que es el momento en que más se necesita y en el que nadie se ' +
                    'acuerda. Conviene que sea un ítem de la lista de salida, no una buena intención.' },

        { mito: 'Le pongo el prefijo público a la variable para que funcione en el cliente.',
          realidad: 'Ese prefijo hace que la variable <b>termine en el JavaScript que descarga el navegador</b>. Está bien para una URL o una clave ' +
                    'publicable; con una clave de servicio, la exponés a todo el mundo <b>sin ningún error</b> que lo delate.' },

        { mito: 'Los Secrets de Kubernetes están cifrados.',
          realidad: 'Están en <b>base64</b>, que es codificación, no cifrado: se decodifican en un comando. Hace falta cifrado en reposo configurado ' +
                    'en el clúster o un gestor de secretos externo.' },
      ],

      glosario: [
        { t: 'Rotación', d: 'Reemplazar un secreto por uno nuevo y revocar el anterior.' },
        { t: 'Gestor de secretos', d: 'Servicio que almacena, distribuye y rota credenciales de forma centralizada.' },
        { t: 'Clave publicable', d: 'Credencial diseñada para estar en el cliente. Su seguridad la dan otras capas, como RLS.' },
        { t: 'service_role', d: 'Clave de Supabase que saltea RLS. Solo en el servidor, nunca con prefijo público.' },
        { t: 'Prefijo público', d: 'Marca del framework que incluye la variable en el paquete del navegador.' },
        { t: 'Escaneo de secretos', d: 'Herramienta que busca patrones de credenciales en el código y el historial.' },
        { t: 'Hook previo al commit', d: 'Verificación local antes de confirmar cambios. Útil, pero se puede saltear.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Desplegar sin cortar y volver atrás',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un despliegue bueno no es el que sale bien: es el
que <b>se puede deshacer en segundos</b> cuando sale mal.</div>

<h4>Las tres estrategias</h4>

<p><b>Reemplazo gradual.</b> Se levanta una instancia nueva, se espera a que esté lista, se retira una vieja, y
se repite. Nunca hay menos capacidad de la declarada. Es el default y sirve casi siempre.</p>

<p><b>Azul-verde.</b> Se levanta el entorno nuevo completo en paralelo y se cambia el tráfico de golpe. Cuesta
el doble de recursos durante la transición, y a cambio la vuelta atrás es <b>instantánea</b>: se apunta el
tráfico al entorno viejo, que sigue ahí.</p>

<p><b>Canario.</b> Se manda un 5% del tráfico a la versión nueva, se mide, y si está bien se aumenta. Es el más
seguro y el que más infraestructura necesita: <b>sin métricas confiables para decidir, es solo un reemplazo
gradual más lento</b>.</p>

<h4>Lo que hace posible volver atrás</h4>
<p>La vuelta atrás rápida no es una función mágica: depende de tres cosas que tenés que preparar antes.</p>

<ul>
<li><b>Versiones fijadas.</b> Si desplegás con una etiqueta móvil, no hay "versión anterior" a la que volver.</li>
<li><b>Migraciones compatibles hacia atrás.</b> Si la migración borró una columna, volver al código viejo lo rompe.</li>
<li><b>Un comando o un botón</b>, no un procedimiento de quince pasos que alguien tiene que recordar bajo presión.</li>
</ul>

<div class="aviso"><strong>El segundo punto es el que convierte una vuelta atrás simple en un incidente.</strong>
El código se revierte en segundos; <b>los datos no</b>. Si desplegaste una migración que eliminó una columna y
tenés que volver atrás, el código viejo va a fallar buscando algo que ya no existe. Por eso las migraciones van
en el patrón <i>expand and contract</i>: agregar, migrar el código, y eliminar recién en un despliegue
posterior.</div>
`,

      tecnico: `
<h4>Comparación</h4>
<table>
<tr><th></th><th>Gradual</th><th>Azul-verde</th><th>Canario</th></tr>
<tr><td>Recursos extra</td><td>Uno o dos pods</td><td><b>El doble</b></td><td>Poco</td></tr>
<tr><td>Vuelta atrás</td><td>Minutos</td><td><b>Segundos</b></td><td>Segundos</td></tr>
<tr><td>Conviven versiones</td><td>Sí, un rato</td><td>No en el tráfico</td><td>Sí, deliberadamente</td></tr>
<tr><td>Necesita métricas</td><td>No</td><td>No</td><td><b>Sí, o no sirve</b></td></tr>
<tr><td>Complejidad</td><td>Baja</td><td>Media</td><td>Alta</td></tr>
</table>

<div class="dato"><strong>Las tres comparten un requisito que casi nadie menciona:</strong> durante el
despliegue <b>conviven dos versiones del código contra la misma base de datos</b>. Eso obliga a que toda
migración sea compatible hacia atrás. Es la causa más común de incidentes durante despliegues, y aplica igual
en Kubernetes, en un PaaS o en un VPS con un script.</p></div>

<h4>Banderas de funcionalidad: separar desplegar de activar</h4>
<p>Es el cambio de modelo mental que más reduce el riesgo. En vez de que "desplegar" signifique "activar", se
despliega el código <b>apagado</b> y se enciende después, para un porcentaje de usuarios.</p>
<pre><code>if (await bandera('nuevo-checkout', { usuarioId })) {
  return nuevoCheckout();
}
return checkoutAnterior();</code></pre>
<p>Ventajas concretas:</p>
<ul>
<li><b>Apagar es instantáneo</b> y no requiere desplegar.</li>
<li>Se puede activar para un porcentaje, o solo para el equipo.</li>
<li>El código nuevo se despliega temprano, en porciones chicas, sin esperar a que esté completo.</li>
<li>Un problema se corta en segundos, no en un despliegue de vuelta atrás.</li>
</ul>
<p><b>El costo:</b> las banderas se acumulan. Cada una es una rama del código que hay que mantener y probar.
Conviene <b>borrarlas apenas la funcionalidad está estable</b> — y anotarlo como tarea al crearlas, o no pasa.</p>

<h4>Vuelta atrás, en concreto</h4>
<pre><code># Kubernetes
kubectl rollout undo deployment/mi-app

# Compose con etiquetas fijadas
sed -i "s|mi-app:.*|mi-app:$SHA_ANTERIOR|" docker-compose.yml
docker compose up -d

# PaaS: casi siempre hay un botón de "volver a este despliegue"</code></pre>

<div class="dato"><strong>Y lo más importante: probarlo.</strong> Un procedimiento de vuelta atrás que nunca se
ejecutó no es un plan, es una suposición. Conviene ensayarlo en staging de vez en cuando y cronometrarlo —
porque el día que haga falta, va a ser bajo presión y con gente mirando.</div>

<h4>Qué mirar después de desplegar</h4>
<table>
<tr><th>Señal</th><th>Ventana</th><th>Umbral</th></tr>
<tr><td>Tasa de error</td><td>5 minutos</td><td>Cualquier salto respecto de la base</td></tr>
<tr><td>Latencia p95</td><td>10 minutos</td><td>Degradación mayor al 30%</td></tr>
<tr><td>Errores de la aplicación</td><td>Continuo</td><td>Tipos de error nuevos</td></tr>
<tr><td>Métricas de negocio</td><td>30 minutos</td><td>Caída en conversión o en uso</td></tr>
</table>
<p>La última fila es la que atrapa lo que las técnicas no ven: un despliegue puede estar sano en todas las
métricas técnicas y haber roto un flujo clave.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS TRES ESTRATEGIAS</text>

  <rect x="24" y="34" width="200" height="112" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.3"/>
  <text x="124" y="56" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">GRADUAL</text>
  <g>
    <rect x="44" y="68" width="36" height="14" rx="3" fill="#f87171" fill-opacity=".5"/>
    <rect x="84" y="68" width="36" height="14" rx="3" fill="#f87171" fill-opacity=".5"/>
    <rect x="124" y="68" width="36" height="14" rx="3" fill="#34d399" fill-opacity=".6"/>
    <rect x="164" y="68" width="36" height="14" rx="3" fill="#34d399" fill-opacity=".6"/>
  </g>
  <text x="124" y="102" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10">reemplaza de a uno</text>
  <text x="124" y="120" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">vuelta atrás: minutos</text>
  <text x="124" y="136" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">el default, sirve casi siempre</text>

  <rect x="240" y="34" width="200" height="112" rx="10" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="340" y="56" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">AZUL-VERDE</text>
  <rect x="260" y="68" width="76" height="26" rx="4" fill="#f87171" fill-opacity=".35"/>
  <text x="298" y="85" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">azul (v1)</text>
  <rect x="344" y="68" width="76" height="26" rx="4" fill="#34d399" fill-opacity=".5"/>
  <text x="382" y="85" text-anchor="middle" fill="#06281c" font-size="9" font-weight="700">verde (v2)</text>
  <text x="340" y="112" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10">se cambia el tráfico de golpe</text>
  <text x="340" y="128" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-weight="700">vuelta atrás: SEGUNDOS</text>
  <text x="340" y="142" text-anchor="middle" fill="#f87171" font-size="9.5">el doble de recursos</text>

  <rect x="456" y="34" width="200" height="112" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="556" y="56" text-anchor="middle" fill="#7c5cff" font-size="11.5" font-weight="700">CANARIO</text>
  <rect x="476" y="68" width="152" height="18" rx="4" fill="#f87171" fill-opacity=".4"/>
  <text x="552" y="81" text-anchor="middle" fill="currentColor" font-size="8.5" font-weight="700">95% v1</text>
  <rect x="476" y="90" width="10" height="14" rx="3" fill="#34d399" fill-opacity=".7"/>
  <text x="510" y="101" fill="#34d399" font-size="8.5" font-weight="700">5% v2 · medir</text>
  <text x="556" y="122" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10">el más seguro</text>
  <text x="556" y="138" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">sin métricas, es solo más lento</text>

  <rect x="24" y="158" width="632" height="52" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="180" text-anchor="middle" fill="#f87171" font-size="12" font-weight="700">
    Las tres comparten un requisito: durante el despliegue conviven DOS versiones contra la MISMA base.</text>
  <text x="340" y="200" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">
    El código se revierte en segundos; los datos no. Toda migración tiene que ser compatible hacia atrás.</text>

  <line x1="24" y1="230" x2="656" y2="230" stroke="currentColor" opacity=".18"/>

  <text x="24" y="254" fill="#34d399" font-size="12" font-weight="700">
    BANDERAS DE FUNCIONALIDAD — separar DESPLEGAR de ACTIVAR</text>

  <rect x="24" y="266" width="304" height="60" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="288" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">SIN BANDERAS</text>
  <text x="176" y="308" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">desplegar = activar</text>
  <text x="176" y="322" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">apagar requiere otro despliegue</text>

  <rect x="352" y="266" width="304" height="60" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="288" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">CON BANDERAS</text>
  <text x="504" y="308" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">se despliega apagado y se enciende después</text>
  <text x="504" y="322" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">apagar es instantáneo, sin desplegar</text>

  <rect x="24" y="340" width="632" height="46" rx="9" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="44" y="360" fill="#fbbf24" font-size="11" font-weight="700">El costo de las banderas: se acumulan.</text>
  <text x="300" y="360" fill="currentColor" opacity=".7" font-size="10.5">Cada una es una rama que hay que mantener y probar.</text>
  <text x="44" y="378" fill="currentColor" opacity=".65" font-size="10.5">
    Borralas apenas la funcionalidad esté estable — y anotalo como tarea al crearlas, o no pasa.</text>
</svg>`,
        pie: 'Un despliegue bueno no es el que sale bien: es el que se puede deshacer en segundos.',
      },

      entrevista: [
        { p: '¿Qué hace posible una vuelta atrás rápida?',
          r: 'Tres cosas preparadas de antemano. <b>Versiones fijadas</b> —con una etiqueta móvil no hay "versión anterior" a la que volver—. ' +
             '<b>Migraciones compatibles hacia atrás</b>, que es el punto crítico: el código se revierte en segundos pero <b>los datos no</b>, ' +
             'así que si la migración borró una columna, el código viejo va a fallar buscándola. Y <b>un comando o un botón</b>, no un procedimiento ' +
             'de quince pasos que alguien tiene que recordar bajo presión. Y algo que se olvida: <b>hay que ensayarlo</b>, porque un procedimiento ' +
             'que nunca se ejecutó es una suposición, no un plan.' },

        { p: '¿Cuándo usarías azul-verde en vez de reemplazo gradual?',
          r: 'Cuando necesito <b>vuelta atrás instantánea</b> y puedo pagar el doble de recursos durante la transición. Con azul-verde el entorno ' +
             'viejo sigue levantado, así que revertir es reapuntar el tráfico: segundos. Con reemplazo gradual hay que volver a desplegar la versión ' +
             'anterior, que son minutos. También lo usaría cuando no quiero que <b>convivan dos versiones recibiendo tráfico</b> — aunque eso no ' +
             'elimina el problema de las migraciones, porque ambos entornos hablan con la misma base.' },

        { p: '¿Qué son las banderas de funcionalidad y qué problema resuelven?',
          r: 'Separan <b>desplegar</b> de <b>activar</b>. En vez de que subir el código signifique encenderlo, se despliega apagado y se activa ' +
             'después, para un porcentaje de usuarios o solo para el equipo. Eso da tres cosas: <b>apagar es instantáneo</b> y no requiere desplegar, ' +
             'se puede probar con tráfico real acotado, y se puede subir código incompleto en porciones chicas. ' +
             'El costo es que <b>se acumulan</b>: cada bandera es una rama del código que hay que mantener y probar, así que conviene borrarlas ' +
             'apenas la funcionalidad se estabiliza — y anotarlo como tarea al crearlas, porque si no, no pasa.' },

        { p: '¿Qué mirás en los minutos posteriores a un despliegue?',
          r: 'Cuatro señales, con ventanas distintas. <b>Tasa de error</b> en los primeros cinco minutos, ante cualquier salto respecto de la línea ' +
             'base. <b>Latencia p95</b> a los diez, si se degrada más del 30%. <b>Tipos de error nuevos</b> en el registro de excepciones. ' +
             'Y a los treinta minutos, las <b>métricas de negocio</b>: conversión, uso de la funcionalidad principal. Esa última es la que atrapa ' +
             'lo que las técnicas no ven — un despliegue puede estar sano en todas las métricas y haber roto un flujo clave.' },
      ],

      practica: `
<h4>Bandera de funcionalidad mínima</h4>
<pre><code>// No hace falta un servicio: una tabla y una caché alcanzan para empezar
export async function bandera(nombre: string, ctx: { usuarioId?: string }) {
  const b = await cache.get(\`bandera:\${nombre}\`, () =&gt; traerBandera(nombre));
  if (!b || !b.activa) return false;
  if (b.usuarios?.includes(ctx.usuarioId)) return true;      // lista explícita
  if (b.porcentaje === 100) return true;
  if (!ctx.usuarioId) return false;

  // hash estable: el mismo usuario cae siempre del mismo lado
  return hash(nombre + ctx.usuarioId) % 100 &lt; b.porcentaje;
}</code></pre>

<div class="aviso"><strong>Ese hash estable es lo que la hace usable.</strong> Si asignás al azar en cada
petición, un mismo usuario ve la versión nueva y la vieja alternadamente — y eso es peor que no tener la
funcionalidad. Con un hash sobre el nombre y el identificador del usuario, cae siempre del mismo lado.</div>

<h4>Migración compatible, en tres despliegues</h4>
<pre><code>-- Despliegue A: agregar, sin borrar. El código viejo sigue funcionando.
alter table clientes add column email_normalizado text;
update clientes set email_normalizado = lower(email);

-- Despliegue B: el código lee de la nueva y escribe en AMBAS.
--                Se puede revertir a A en cualquier momento.

-- Despliegue C: ya nadie usa la vieja.
alter table clientes drop column email;</code></pre>
<p>Son tres despliegues en vez de uno, y a cambio se puede revertir en cualquier punto sin perder datos.</p>

<h4>Ensayo de vuelta atrás</h4>
<pre><code># En staging, una vez por trimestre:
1. Desplegar una versión nueva.
2. Ejecutar el procedimiento de vuelta atrás COMPLETO.
3. Cronometrarlo.
4. Verificar que la aplicación funcione con la versión anterior.
5. Anotar el tiempo real.

# Si tarda 12 minutos, ese es tu tiempo de recuperación ante un mal despliegue.</code></pre>

<h4>Checklist antes de desplegar a producción</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Pasó por staging con el <b>mismo proceso</b></td></tr>
<tr><td>☐</td><td>La migración es compatible con el código actual</td></tr>
<tr><td>☐</td><td>La versión está fijada y es identificable</td></tr>
<tr><td>☐</td><td>La vuelta atrás es un comando conocido</td></tr>
<tr><td>☐</td><td>Hay verificación posterior automática</td></tr>
<tr><td>☐</td><td>Lo riesgoso está detrás de una bandera</td></tr>
<tr><td>☐</td><td>Alguien más sabe que se está desplegando</td></tr>
<tr><td>☐</td><td>No es viernes a las 18 h, salvo que haga falta</td></tr>
</table>
`,

      errores: [
        { mito: 'Si el despliegue tiene vuelta atrás, no hay riesgo.',
          realidad: 'El código vuelve atrás; <b>los datos no</b>. Si la migración borró una columna, el código viejo falla buscándola. ' +
                    'Por eso las migraciones van en <i>expand and contract</i>: agregar, migrar el código, y eliminar en un despliegue posterior.' },

        { mito: 'Tengo un procedimiento de vuelta atrás documentado.',
          realidad: 'Documentado no es <b>probado</b>. Un procedimiento que nunca se ejecutó es una suposición. Conviene ensayarlo en staging y ' +
                    'cronometrarlo, porque el día que haga falta va a ser bajo presión.' },

        { mito: 'Canario es siempre mejor.',
          realidad: 'Solo si tenés <b>métricas confiables</b> para decidir si promover o revertir. Sin eso es un reemplazo gradual más lento y más ' +
                    'complejo, con dos versiones conviviendo por más tiempo y sin ninguna ganancia.' },

        { mito: 'Las banderas de funcionalidad son gratis.',
          realidad: '<b>Se acumulan.</b> Cada una es una rama del código que hay que mantener y probar, y con el tiempo nadie recuerda cuáles se ' +
                    'pueden borrar. Conviene anotar la tarea de eliminarla <b>al momento de crearla</b>, o simplemente no pasa.' },
      ],

      glosario: [
        { t: 'Reemplazo gradual', d: 'Sustituir instancias de a una, esperando que cada nueva esté lista. El default.' },
        { t: 'Azul-verde', d: 'Levantar el entorno nuevo completo y cambiar el tráfico de golpe. Vuelta atrás instantánea.' },
        { t: 'Canario', d: 'Enviar un porcentaje pequeño del tráfico a la versión nueva y medir antes de promover.' },
        { t: 'Bandera de funcionalidad', d: 'Interruptor que separa desplegar de activar.' },
        { t: 'Hash estable', d: 'Asignación determinista de un usuario a una variante, para que no alterne entre versiones.' },
        { t: 'Vuelta atrás', d: 'Volver a la versión anterior. Requiere versiones fijadas y migraciones compatibles.' },
        { t: 'Expand and contract', d: 'Patrón de migración en tres etapas que mantiene la reversibilidad.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cómo conviene ordenar las etapas de un pipeline?',
      opciones: [
        'De más barata a más cara: lint, tipos, tests unitarios, build, integración',
        'Alfabéticamente, para que sea predecible',
        'Las más importantes primero, sin importar el costo',
        'Todas en paralelo siempre',
      ],
      correcta: 0,
      porQue: 'La idea es fallar rápido y barato: no tiene sentido correr ocho minutos de tests de integración para descubrir un error de formato que se detecta en segundos.',
      porQueNo: {
        1: 'El orden alfabético no tiene relación con el costo ni con la utilidad.',
        2: 'Todas importan; lo que cambia es cuánto cuesta descubrir el error.',
        3: 'Paralelizar lo independiente ayuda, pero las etapas caras no deberían correr si las baratas fallaron.',
      },
    },
    {
      p: '¿Cuál es la etapa que casi nadie tiene y más incidentes evita?',
      opciones: [
        'La verificación posterior al despliegue',
        'El análisis de cobertura de tests',
        'El escaneo de licencias',
        'La generación de documentación',
      ],
      correcta: 0,
      porQue: 'Un despliegue puede reportar éxito y dejar la aplicación caída: el contenedor arrancó pero no conecta a la base, faltó una variable, la migración no corrió. Sin verificación posterior, te enterás por un usuario.',
      porQueNo: {
        1: 'Es útil como métrica, pero no detecta un despliegue roto.',
        2: 'Importa en algunos contextos, pero no evita incidentes de despliegue.',
        3: 'No tiene relación con la salud de lo desplegado.',
      },
    },
    {
      p: '¿Qué NO debería frenar un despliegue?',
      opciones: [
        'Una advertencia de lint o una caída de un punto en cobertura',
        'Que el build falle',
        'Que los tests fallen',
        'Que la verificación posterior falle',
      ],
      correcta: 0,
      porQue: 'Un pipeline que frena por cualquier cosa termina siendo un pipeline que la gente aprende a saltear, y ahí perdés también las verificaciones que sí importaban. Frenar tiene que significar algo.',
      porQueNo: {
        1: 'Si no compila, nada más importa.',
        2: 'Es la señal más clara de que algo se rompió.',
        3: 'Significa que lo desplegado no está funcionando.',
      },
    },
    {
      p: '¿Por qué importa que el pipeline sea rápido?',
      opciones: [
        'Si tarda demasiado, la gente lo saltea y mezcla cambios para "aprovechar el viaje"',
        'Porque los runners se cobran por minuto',
        'Porque los tests fallan si tardan mucho',
        'Por requisitos del proveedor de git',
      ],
      correcta: 0,
      porQue: 'Un pipeline lento se degrada solo: el costo real no es el tiempo sino la disciplina que se pierde. El objetivo razonable es menos de diez minutos.',
      porQueNo: {
        1: 'Es un costo real pero menor comparado con la pérdida de disciplina.',
        2: 'La duración no hace fallar los tests por sí sola.',
        3: 'No existe tal requisito.',
      },
    },
    {
      p: '¿Dónde deberían correr las migraciones de base de datos?',
      opciones: [
        'Como paso propio antes del despliegue, con bloqueo, y compatibles con el código viejo',
        'En el arranque de la aplicación',
        'Manualmente después de desplegar',
        'En el primer request que las necesite',
      ],
      correcta: 0,
      porQue: 'Correrlas al arrancar significa que con cinco instancias tenés cinco migraciones compitiendo. Y deben ser compatibles hacia atrás porque el código viejo sigue atendiendo durante el despliegue.',
      porQueNo: {
        1: 'Con varias instancias, varias migraciones compiten por aplicar lo mismo.',
        2: 'Un paso manual se olvida, y no falla el despliegue si sale mal.',
        3: 'Impredecible, y puede ejecutarse concurrentemente.',
      },
    },
    {
      p: '¿Qué tiene que ser igual entre staging y producción?',
      opciones: [
        'El proceso de despliegue, las versiones y el orden de las migraciones',
        'El tamaño de las instancias y la cantidad de réplicas',
        'El volumen de datos',
        'Los valores de las variables de entorno',
      ],
      correcta: 0,
      porQue: 'Si a staging desplegás con un script y a producción a mano, staging no ensaya nada. La mitad de su valor es probar el proceso, no solo el código.',
      porQueNo: {
        1: 'Pueden diferir sin problema: staging puede ser más chico.',
        2: 'Puede ser menor, siempre que conserve la forma de los datos.',
        3: 'Deben ser distintos: usar valores de producción en staging es el peor accidente.',
      },
    },
    {
      p: '¿Cómo se manejan los datos de staging?',
      opciones: [
        'Copiando de producción y anonimizando: misma forma y volumen, sin datos personales reales',
        'Apuntando staging a la base de producción',
        'Con tres registros de prueba escritos a mano',
        'Sin datos: se prueba solo la interfaz',
      ],
      correcta: 0,
      porQue: 'La forma de los datos es lo que hace que las cosas se rompan en staging y no en producción: campos nulos inesperados, textos larguísimos, casos raros. Con tres registros ficticios no se rompe nada.',
      porQueNo: {
        1: 'Es el peor accidente posible: una migración de prueba o un email masivo real.',
        2: 'No ensaya nada, porque no reproduce la variedad real.',
        3: 'Deja sin probar todo lo que depende de datos.',
      },
    },
    {
      p: '¿Por qué conviene validar las variables de entorno al arrancar?',
      opciones: [
        'Si falta una, el proceso no levanta, no pasa el healthcheck y queda atendiendo la versión anterior',
        'Para que el código sea más legible',
        'Para reducir el uso de memoria',
        'Porque lo exige el estándar Twelve-Factor',
      ],
      correcta: 0,
      porQue: 'El usuario nunca se entera. Si en cambio la aplicación arranca y falla recién al usar la variable, ya desplegaste algo roto y te enterás por un error en producción.',
      porQueNo: {
        1: 'Es un beneficio menor comparado con evitar un despliegue roto.',
        2: 'No tiene impacto en el consumo de memoria.',
        3: 'Twelve-Factor habla de configuración por entorno, no de validación al arrancar.',
      },
    },
    {
      p: 'Se filtró una clave de API en un commit. ¿Qué hacés PRIMERO?',
      opciones: [
        'Rotarla inmediatamente',
        'Reescribir el historial de git para borrarla',
        'Hacer el repositorio privado',
        'Revisar quién la subió',
      ],
      correcta: 0,
      porQue: 'Es lo único que realmente lo resuelve. Limpiar el historial no revoca nada: si el repo es público hay bots que la escanearon en segundos, y si es privado cualquiera con un clon anterior la tiene.',
      porQueNo: {
        1: 'No revoca la clave, rompe los clones del equipo y es lo menos urgente.',
        2: 'Si ya se expuso, hacerlo privado llega tarde.',
        3: 'Importa para el proceso, pero no reduce el riesgo ahora.',
      },
    },
    {
      p: '¿Qué condición hace posible rotar un secreto sin cortar el servicio?',
      opciones: [
        'Que el servicio admita dos claves válidas simultáneamente durante la transición',
        'Que la clave sea corta',
        'Que se rote fuera de horario',
        'Que haya una réplica de la base',
      ],
      correcta: 0,
      porQue: 'Con dos claves válidas: creás la nueva, desplegás, verificás que todo la usa, y recién ahí revocás la vieja. Si el servicio solo admite una, rotar exige ventana de mantenimiento — y por eso nunca se hace.',
      porQueNo: {
        1: 'La longitud no tiene relación con la rotación.',
        2: 'Reduce el impacto, pero sigue habiendo corte.',
        3: 'No tiene relación con las credenciales de servicios externos.',
      },
    },
    {
      p: '¿Qué pasa si le ponés el prefijo público a una variable con una clave de servicio?',
      opciones: [
        'Termina en el JavaScript que descarga el navegador, expuesta a todo el mundo',
        'El framework la rechaza al construir',
        'Solo es visible para usuarios autenticados',
        'Se cifra automáticamente',
      ],
      correcta: 0,
      porQue: 'Es correcto para una URL o una clave publicable como la anónima de Supabase, cuya seguridad la da RLS. Con una clave de servicio, que saltea RLS, es un desastre — y no genera ningún error que lo delate.',
      porQueNo: {
        1: 'El framework hace exactamente lo que le pediste: incluirla en el paquete.',
        2: 'El paquete del navegador es público para cualquiera.',
        3: 'No hay ningún cifrado: se incluye en texto plano.',
      },
    },
    {
      p: '¿Qué hace posible una vuelta atrás rápida?',
      opciones: [
        'Versiones fijadas, migraciones compatibles hacia atrás y un comando conocido',
        'Tener respaldos diarios de la base',
        'Desplegar solo en horario laboral',
        'Usar contenedores en lugar de máquinas virtuales',
      ],
      correcta: 0,
      porQue: 'Con una etiqueta móvil no hay versión anterior a la que volver. Y el punto crítico son las migraciones: el código se revierte en segundos, los datos no.',
      porQueNo: {
        1: 'Restaurar un respaldo pierde todo lo escrito desde entonces: es otra cosa.',
        2: 'Reduce el impacto pero no acelera la reversión.',
        3: 'Ayuda, pero sin versiones fijadas tampoco hay a dónde volver.',
      },
    },
    {
      p: '¿Cuál es la ventaja principal de azul-verde sobre el reemplazo gradual?',
      opciones: [
        'La vuelta atrás es instantánea: el entorno viejo sigue levantado',
        'Consume menos recursos',
        'No requiere healthchecks',
        'Permite migraciones incompatibles',
      ],
      correcta: 0,
      porQue: 'Revertir es reapuntar el tráfico, que son segundos. El costo es el doble de recursos durante la transición. Y no elimina el problema de las migraciones: ambos entornos hablan con la misma base.',
      porQueNo: {
        1: 'Al contrario: requiere el doble de recursos.',
        2: 'Los healthchecks siguen siendo necesarios para saber si el entorno nuevo está listo.',
        3: 'La base es compartida, así que las migraciones tienen que ser compatibles igual.',
      },
    },
    {
      p: '¿Qué problema resuelven las banderas de funcionalidad?',
      opciones: [
        'Separan desplegar de activar: apagar es instantáneo y no requiere desplegar',
        'Eliminan la necesidad de tests',
        'Aceleran el pipeline',
        'Permiten saltear staging',
      ],
      correcta: 0,
      porQue: 'Se despliega el código apagado y se enciende después, para un porcentaje o solo para el equipo. El costo es que se acumulan: cada bandera es una rama que hay que mantener y probar.',
      porQueNo: {
        1: 'El código detrás de la bandera hay que probarlo igual, en ambos caminos.',
        2: 'No afectan la duración del pipeline.',
        3: 'Staging sigue siendo necesario para ensayar el proceso.',
      },
    },
    {
      p: 'En una bandera con porcentaje, ¿por qué se usa un hash estable del usuario?',
      opciones: [
        'Para que un mismo usuario caiga siempre del mismo lado y no alterne entre versiones',
        'Para que el sorteo sea más rápido',
        'Para cumplir con normativas de privacidad',
        'Para poder revertir la bandera',
      ],
      correcta: 0,
      porQue: 'Si asignás al azar en cada petición, el usuario ve la versión nueva y la vieja alternadamente, que es peor que no tener la funcionalidad. El hash sobre nombre e identificador lo mantiene estable.',
      porQueNo: {
        1: 'La diferencia de velocidad es irrelevante.',
        2: 'No tiene relación con privacidad.',
        3: 'Revertir se hace apagando la bandera, independientemente del método de asignación.',
      },
    },
  ],
});
