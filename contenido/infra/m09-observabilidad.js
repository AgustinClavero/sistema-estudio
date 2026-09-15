/* ==========================================================================
   Infra · Módulo 09 — Observabilidad y resiliencia
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'infra',
  id: 'm09',
  titulo: 'Observabilidad y resiliencia',
  fuentes: ['sentry', 'opentelemetry', 'sre-book', '12factor'],

  intro:
    '<p>Hay una diferencia enorme entre <b>monitorear</b> y <b>observar</b>. Monitorear es mirar si las cosas que ' +
    'sabías que podían fallar están fallando. Observar es poder responder preguntas que <b>no anticipaste</b>.</p>' +
    '<p>Este módulo va sobre las dos mitades del problema: <b>enterarte</b> de que algo anda mal —y poder ' +
    'entender qué—, y <b>aguantar</b> cuando algo de lo que dependés se cae.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Logs, métricas y trazas',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> las <b>métricas</b> te dicen que algo anda mal,
las <b>trazas</b> te dicen dónde, y los <b>logs</b> te dicen qué pasó exactamente.</div>

<h4>Los tres, con un ejemplo</h4>
<p>Un usuario reporta que la aplicación está lenta.</p>

<p><b>Métrica</b> — "la latencia p95 pasó de 200 ms a 3 s hace 40 minutos". Sabés que es real, cuándo empezó y
cuánto afecta. <b>No sabés por qué.</b></p>

<p><b>Traza</b> — seguís una petición lenta y ves el desglose: 20 ms en la aplicación, <b>2.900 ms en una
consulta a la base</b>, 30 ms en serializar. Ahora sabés dónde.</p>

<p><b>Log</b> — buscás esa consulta y encontrás la línea con la consulta completa y sus parámetros. Ahora sabés
qué.</p>

<div class="aviso"><strong>Por eso hacen falta los tres.</strong> Con solo logs, encontrar el problema es
buscar una aguja en un pajar. Con solo métricas, sabés que hay un problema y nada más. Y una traza sin logs te
dice <b>en qué componente</b> pero no <b>por qué ahí</b>.</div>

<h4>El log que sirve y el que no</h4>
<pre><code>❌  console.log('Error al procesar');
❌  console.log('Usuario ' + id + ' hizo algo raro');

✔  log.error('pago_fallido', {
      pedidoId, tenantId, usuarioId,
      motivo: 'tarjeta_rechazada',
      proveedor: 'stripe',
      trazaId: ctx.trazaId,
    });</code></pre>

<p>La diferencia práctica: el primero solo se puede <b>leer</b>. El segundo se puede <b>buscar, filtrar,
contar y graficar</b>. "¿Cuántos pagos fallaron por tarjeta rechazada esta semana, por tenant?" es una consulta
sobre el segundo e imposible sobre el primero.</p>

<h4>Qué NO poner en un log</h4>
<ul>
<li>Contraseñas, tokens, claves de API.</li>
<li>Números de tarjeta o documentos.</li>
<li>Cuerpos de petición completos, que suelen traer datos personales.</li>
<li>Emails, salvo que haga falta y esté contemplado.</li>
</ul>
<p>Los logs se guardan meses, se replican y los ve mucha gente. <b>Un dato sensible en un log es una filtración
de larga duración.</b></p>
`,

      tecnico: `
<h4>Log estructurado, con contexto que viaja</h4>
<pre><code>import pino from 'pino';
const log = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: ['req.headers.authorization', 'req.headers.cookie', '*.password'],
});

// Un logger hijo por petición: el contexto se agrega solo
app.use((req, res, next) =&gt; {
  req.log = log.child({
    trazaId: req.headers['x-request-id'] ?? crypto.randomUUID(),
    tenantId: req.tenant?.id,
    ruta: req.route?.path,
  });
  next();
});</code></pre>

<div class="dato"><strong>La opción <code>redact</code> es la que evita el accidente más común:</strong>
loguear el objeto de la petición entero "para depurar" y que se vaya el encabezado de autorización con el
token adentro. Configurarla una vez cubre todos los casos futuros, incluidos los que todavía no escribiste.</div>

<h4>Los cuatro tipos de métrica</h4>
<table>
<tr><th>Tipo</th><th>Qué mide</th><th>Ejemplo</th></tr>
<tr><td><b>Contador</b></td><td>Algo que solo sube</td><td>Peticiones totales, errores totales</td></tr>
<tr><td><b>Medidor</b></td><td>Valor actual, sube y baja</td><td>Conexiones activas, memoria</td></tr>
<tr><td><b>Histograma</b></td><td>Distribución de valores</td><td>Latencia por percentil</td></tr>
<tr><td><b>Resumen</b></td><td>Percentiles precalculados</td><td>Similar, calculado en el cliente</td></tr>
</table>

<div class="dato"><strong>El promedio de latencia es una métrica que engaña sistemáticamente.</strong> Si el
90% de las peticiones tarda 50 ms y el 10% tarda 5 segundos, el promedio da 545 ms — un número que <b>no
describe la experiencia de nadie</b>. Por eso se usan percentiles: el <b>p95</b> dice cuánto tardan las
peticiones del 5% peor, y el <b>p99</b> es donde suelen esconderse los problemas reales. ' +
Mirar promedios es la razón número uno por la que un equipo "no ve" un problema que los usuarios sí sienten.</div>

<h4>Trazas distribuidas</h4>
<p>Una traza sigue <b>una petición</b> a través de todos los servicios que toca. Cada tramo es un
<i>span</i> con su duración, y el conjunto arma una cascada:</p>
<pre><code>GET /pedidos/123                                    3.240 ms
 ├─ auth.verificar                                      12 ms
 ├─ db.query pedidos                                    28 ms
 ├─ db.query items                                   2.890 ms   ← acá está
 │   └─ (sin índice en pedido_id)
 └─ serializar                                          31 ms</code></pre>

<p>Lo que hace que funcione entre servicios es que el <b>identificador de traza se propague</b> por encabezados.
Si un servicio no lo reenvía, la traza se corta ahí y perdés la mitad del valor.</p>

<h4>Cardinalidad: el error que infla la factura</h4>
<p>Cada combinación distinta de etiquetas en una métrica es una <b>serie temporal</b> que se almacena aparte.</p>
<pre><code>❌  peticiones{ruta="/pedidos/123", usuarioId="u_8821"}
    → una serie por cada pedido y por cada usuario = millones

✔  peticiones{ruta="/pedidos/:id", metodo="GET", estado="200"}
    → decenas de series</code></pre>

<div class="dato"><strong>La alta cardinalidad es el error que más veces triplica una factura de
observabilidad</strong> — y además hace que las consultas se vuelvan lentísimas. La regla: <b>identificadores
únicos van en logs y trazas, nunca en etiquetas de métricas</b>. Las métricas son para agregar; los logs, para
el detalle.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="ob1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    “LA APP ESTÁ LENTA” — cómo se resuelve con los tres</text>

  <rect x="24" y="34" width="200" height="90" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="124" y="56" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">MÉTRICA</text>
  <text x="124" y="76" text-anchor="middle" fill="currentColor" opacity=".75" font-size="10">p95: 200 ms → 3 s</text>
  <text x="124" y="92" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">empezó hace 40 min</text>
  <text x="124" y="112" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">sabés QUE pasa</text>

  <line x1="228" y1="79" x2="248" y2="79" stroke="currentColor" stroke-width="1.4" marker-end="url(#ob1)"/>

  <rect x="252" y="34" width="200" height="90" rx="10" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="352" y="56" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">TRAZA</text>
  <text x="352" y="76" text-anchor="middle" fill="currentColor" opacity=".75" font-size="10">app 20 ms · db 2.900 ms</text>
  <text x="352" y="92" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">serializar 30 ms</text>
  <text x="352" y="112" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">sabés DÓNDE</text>

  <line x1="456" y1="79" x2="476" y2="79" stroke="currentColor" stroke-width="1.4" marker-end="url(#ob1)"/>

  <rect x="480" y="34" width="176" height="90" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="568" y="56" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">LOG</text>
  <text x="568" y="76" text-anchor="middle" fill="currentColor" opacity=".75" font-size="10">la consulta completa</text>
  <text x="568" y="92" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">con sus parámetros</text>
  <text x="568" y="112" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">sabés QUÉ</text>

  <text x="24" y="146" fill="currentColor" opacity=".55" font-size="10.5">
    Con solo logs: aguja en un pajar. Con solo métricas: sabés que hay un problema y nada más.</text>

  <line x1="24" y1="164" x2="656" y2="164" stroke="currentColor" opacity=".18"/>

  <text x="24" y="188" fill="#f87171" font-size="12" font-weight="700">
    EL PROMEDIO ENGAÑA SISTEMÁTICAMENTE</text>

  <rect x="24" y="200" width="304" height="88" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="222" fill="currentColor" opacity=".75" font-size="10.5">90% de las peticiones → 50 ms</text>
  <text x="44" y="240" fill="currentColor" opacity=".75" font-size="10.5">10% de las peticiones → 5.000 ms</text>
  <text x="44" y="262" fill="#f87171" font-size="12" font-weight="700">promedio = 545 ms</text>
  <text x="44" y="280" fill="#f87171" font-size="10" font-weight="700">no describe la experiencia de NADIE</text>

  <rect x="352" y="200" width="304" height="88" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.3"/>
  <text x="372" y="222" fill="#34d399" font-size="10.5" font-weight="700">p50 = 50 ms</text>
  <text x="372" y="240" fill="#34d399" font-size="10.5" font-weight="700">p95 = 5.000 ms   ← el 5% peor</text>
  <text x="372" y="258" fill="#34d399" font-size="10.5" font-weight="700">p99 = 5.000 ms   ← donde se esconde lo real</text>
  <text x="372" y="280" fill="currentColor" opacity=".6" font-size="10">mirar promedios es por qué un equipo “no ve”</text>

  <rect x="24" y="304" width="632" height="82" rx="10" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="326" fill="#fbbf24" font-size="12" font-weight="700">CARDINALIDAD — lo que triplica una factura de observabilidad</text>
  <text x="44" y="348" fill="#f87171" font-size="10.5" font-family="monospace">
    ✗ peticiones{ruta="/pedidos/123", usuarioId="u_8821"}  → millones de series</text>
  <text x="44" y="366" fill="#34d399" font-size="10.5" font-family="monospace">
    ✓ peticiones{ruta="/pedidos/:id", metodo="GET", estado="200"}  → decenas</text>
  <text x="44" y="382" fill="currentColor" opacity=".65" font-size="10">
    Regla: los identificadores únicos van en logs y trazas, NUNCA en etiquetas de métricas.</text>
</svg>`,
        pie: 'Métricas para agregar, trazas para localizar, logs para el detalle. Los tres, no uno.',
      },

      entrevista: [
        { p: '¿Cuál es la diferencia entre logs, métricas y trazas?',
          r: 'Responden preguntas distintas. Las <b>métricas</b> te dicen <b>que</b> algo anda mal y cuánto afecta — "el p95 pasó de 200 ms a 3 s hace ' +
             '40 minutos"—. Las <b>trazas</b> te dicen <b>dónde</b>, desglosando una petición por componente. Y los <b>logs</b> te dicen ' +
             '<b>qué</b> pasó exactamente. Hacen falta los tres: con solo logs buscás una aguja en un pajar, con solo métricas sabés que hay un ' +
             'problema y nada más, y una traza sin logs te dice en qué componente pero no por qué.' },

        { p: '¿Por qué se usan percentiles en vez de promedios?',
          r: 'Porque el promedio <b>engaña sistemáticamente</b>. Si el 90% de las peticiones tarda 50 ms y el 10% tarda 5 segundos, el promedio da ' +
             '545 ms — un número que no describe la experiencia de nadie: ni la de los rápidos ni la de los lentos. El <b>p95</b> te dice cuánto ' +
             'tardan las peticiones del 5% peor, y el <b>p99</b> es donde suelen esconderse los problemas reales. ' +
             '<b>Mirar promedios es la razón número uno por la que un equipo "no ve" un problema que los usuarios sí sienten.</b>' },

        { p: '¿Qué es la cardinalidad y por qué importa?',
          r: 'Cada combinación distinta de etiquetas en una métrica es una <b>serie temporal</b> almacenada aparte. Si etiquetás con un identificador ' +
             'de usuario o de pedido, generás millones de series: la factura se dispara y las consultas se vuelven lentísimas. ' +
             'Es el error que más veces triplica un costo de observabilidad. La regla es simple: <b>los identificadores únicos van en logs y trazas, ' +
             'nunca en etiquetas de métricas</b>. Las métricas son para agregar; los logs, para el detalle.' },

        { p: '¿Qué hace que un log sea útil?',
          r: 'Que sea <b>estructurado</b>: un evento con campos, no una frase. La diferencia práctica es que una frase solo se puede leer, mientras que ' +
             'un evento con campos se puede <b>buscar, filtrar, contar y graficar</b>. "¿Cuántos pagos fallaron por tarjeta rechazada esta semana, ' +
             'por tenant?" es una consulta trivial sobre logs estructurados e imposible sobre texto libre. Y hay un contexto que conviene que viaje ' +
             'solo: identificador de traza, tenant y ruta, con un logger hijo por petición.' },
      ],

      practica: `
<h4>Contexto que viaja entre servicios</h4>
<pre><code>// Recibir o crear el identificador
const trazaId = req.headers['x-request-id'] ?? crypto.randomUUID();

// REENVIARLO en cada llamada saliente — si no, la traza se corta
await fetch(urlServicioB, {
  headers: { 'x-request-id': trazaId },
});</code></pre>

<div class="aviso"><strong>Ese reenvío es el punto de falla más común.</strong> Basta con que un servicio no
propague el encabezado para que la traza se corte ahí, y justo perdés visibilidad sobre la parte más profunda
de la cascada — que suele ser donde está el problema.</div>

<h4>Instrumentar lo que importa</h4>
<pre><code>// Métricas: pocas, con etiquetas de baja cardinalidad
metricas.contador('peticiones_total', { ruta, metodo, estado });
metricas.histograma('peticion_duracion_ms', duracion, { ruta, metodo });
metricas.medidor('db_conexiones_activas', pool.totalCount);

// Y las de NEGOCIO, que son las que nadie pone:
metricas.contador('pagos_total', { estado: 'ok' | 'rechazado' });
metricas.contador('ia_llamadas_total', { modelo, feature });
metricas.histograma('ia_costo_usd', costo, { modelo });</code></pre>

<div class="dato"><strong>Las métricas de negocio son las que detectan lo que las técnicas no ven.</strong>
Un despliegue puede tener la latencia perfecta, cero errores y CPU normal, y haber roto el flujo de pago.
La única señal que lo delata es que <b>los pagos por minuto cayeron a cero</b>.</div>

<h4>Configuración de logs por entorno</h4>
<table>
<tr><th>Entorno</th><th>Nivel</th><th>Formato</th><th>Retención</th></tr>
<tr><td>Desarrollo</td><td>debug</td><td>Legible con colores</td><td>—</td></tr>
<tr><td>Staging</td><td>info</td><td>JSON</td><td>7 días</td></tr>
<tr><td>Producción</td><td>info</td><td>JSON</td><td>30-90 días</td></tr>
</table>
<p>Poner <code>debug</code> en producción parece prudente y sale caro: multiplica el volumen, infla la factura
y entierra las líneas que importan entre miles que no.</p>

<h4>Checklist de observabilidad mínima</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Logs estructurados en JSON, con nivel por entorno</td></tr>
<tr><td>☐</td><td>Datos sensibles ocultados por configuración, no a mano</td></tr>
<tr><td>☐</td><td>Identificador de traza generado y <b>propagado</b></td></tr>
<tr><td>☐</td><td>Latencia como histograma, mirada por percentiles</td></tr>
<tr><td>☐</td><td>Etiquetas de baja cardinalidad</td></tr>
<tr><td>☐</td><td>Captura de excepciones con contexto de usuario y tenant</td></tr>
<tr><td>☐</td><td><b>Al menos una métrica de negocio</b></td></tr>
</table>
`,

      errores: [
        { mito: 'Con los logs alcanza.',
          realidad: 'Los logs te dan el detalle pero no la <b>tendencia</b>: no sabés si algo empeoró, cuánto ni desde cuándo. Y buscar la causa de una ' +
                    'lentitud entre millones de líneas sin una traza que te diga en qué componente mirar es una aguja en un pajar.' },

        { mito: 'Miro el promedio de latencia.',
          realidad: 'El promedio <b>oculta la cola</b>. Con 90% en 50 ms y 10% en 5 s, el promedio da 545 ms y no describe la experiencia de nadie. ' +
                    'Hay que mirar <b>p95 y p99</b>, que es donde viven los problemas que los usuarios sienten.' },

        { mito: 'Etiqueto las métricas con el ID de usuario para poder filtrar.',
          realidad: 'Eso genera <b>una serie temporal por usuario</b>: la factura se dispara y las consultas se vuelven lentísimas. Los identificadores ' +
                    'únicos van en <b>logs y trazas</b>. Las métricas son para agregar.' },

        { mito: 'Logueo el objeto de la petición entero para poder depurar.',
          realidad: 'Ahí se va el encabezado de autorización con el token adentro, y los cuerpos con datos personales. Los logs se guardan meses y los ' +
                    've mucha gente: <b>un dato sensible en un log es una filtración de larga duración</b>. Configurá el ocultamiento una vez.' },
      ],

      glosario: [
        { t: 'Log estructurado', d: 'Evento con campos consultables, en vez de una frase de texto libre.' },
        { t: 'Métrica', d: 'Valor numérico agregado en el tiempo. Contador, medidor, histograma o resumen.' },
        { t: 'Traza', d: 'Recorrido de una petición por todos los servicios que toca, dividido en spans.' },
        { t: 'Span', d: 'Tramo de una traza, con su duración y sus atributos.' },
        { t: 'Percentil', d: 'p95 significa que el 95% de los valores está por debajo de ese número.' },
        { t: 'Cardinalidad', d: 'Cantidad de combinaciones de etiquetas. Alta cardinalidad dispara el costo.' },
        { t: 'Ocultamiento', d: 'Reemplazar automáticamente campos sensibles antes de escribir el log.' },
        { t: 'Propagación de contexto', d: 'Reenviar el identificador de traza por encabezados entre servicios.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Alertas que no se ignoran',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> una alerta que suena y no requiere hacer nada
enseña a ignorar <b>todas</b> las alertas — incluidas las que sí importaban.</div>

<h4>La fatiga de alertas</h4>
<p>Es el problema real de esta lección. Pasa siempre igual:</p>
<ol>
<li>Se configuran alertas para todo, "por las dudas".</li>
<li>La mitad se dispara sin que haya nada que hacer.</li>
<li>El equipo aprende a silenciarlas.</li>
<li>Un día se dispara una que importaba y también se silencia.</li>
</ol>

<div class="aviso"><strong>La regla que lo evita:</strong> una alerta solo existe si <b>alguien tiene que
hacer algo ahora</b>. Si la respuesta correcta es "mirarlo mañana", eso no es una alerta: es un tablero.
<b>Alertar de más es peor que alertar de menos</b>, porque destruye la confianza en todo el sistema.</div>

<h4>Alertar sobre síntomas, no sobre causas</h4>
<table>
<tr><th>❌ Causa</th><th>✔ Síntoma</th></tr>
<tr><td>CPU al 90%</td><td>La latencia p95 superó 2 s</td></tr>
<tr><td>Memoria al 85%</td><td>La tasa de error superó el 1%</td></tr>
<tr><td>Disco al 80%</td><td>Los usuarios no pueden completar pagos</td></tr>
<tr><td>Se reinició un contenedor</td><td>El servicio no responde hace 2 minutos</td></tr>
</table>

<p>La CPU al 90% puede ser <b>perfectamente normal</b> — un trabajo por lotes, un pico esperado. Lo que
importa es si <b>el usuario lo está sufriendo</b>. Alertar sobre causas genera ruido; alertar sobre síntomas
genera acción.</p>

<div class="dato"><strong>La excepción son los recursos que se agotan de forma irreversible</strong>, como el
disco. Ahí sí conviene alertar por causa y con anticipación, porque cuando el síntoma aparece ya es tarde: la
base no puede escribir y recuperarse lleva mucho más que prevenirlo.</div>

<h4>Cada alerta necesita tres cosas</h4>
<ul>
<li><b>Qué está pasando</b>, en una frase clara.</li>
<li><b>Qué impacto tiene</b> — cuántos usuarios, qué funcionalidad.</li>
<li><b>Un enlace a qué hacer</b> — el runbook, o al menos el tablero relevante.</li>
</ul>
<p>Una alerta que dice "Alerta: HighErrorRate en prod" a las 3 de la mañana <b>no ayuda a nadie</b>.</p>
`,

      tecnico: `
<h4>SLI, SLO y presupuesto de error</h4>
<p>El marco que convierte "queremos que ande bien" en algo medible.</p>
<ul>
<li><b>SLI</b> — el indicador. "Porcentaje de peticiones que responden bien en menos de 500 ms."</li>
<li><b>SLO</b> — el objetivo. "99,5% de las peticiones, medido en 30 días."</li>
<li><b>Presupuesto de error</b> — lo que te podés permitir fallar. Con 99,5%, es el <b>0,5%</b>.</li>
</ul>

<table>
<tr><th>SLO</th><th>Caída permitida al mes</th><th>Qué implica</th></tr>
<tr><td>99%</td><td>~7,2 horas</td><td>Alcanza con guardia en horario laboral</td></tr>
<tr><td>99,9%</td><td>~43 minutos</td><td>Hace falta automatización y guardia</td></tr>
<tr><td>99,99%</td><td>~4,3 minutos</td><td>Multi-región, muy caro</td></tr>
<tr><td>99,999%</td><td>~26 segundos</td><td>Casi nadie lo necesita de verdad</td></tr>
</table>

<div class="dato"><strong>El presupuesto de error es la herramienta más útil del marco</strong> porque
convierte la confiabilidad en una <b>decisión de negocio</b> y no en una discusión de opiniones. Si te queda
presupuesto, podés desplegar rápido y tomar riesgos. Si lo gastaste, la prioridad pasa a estabilizar.
<b>Y sube el listón de "queremos 99,99%": alguien tiene que estar dispuesto a pagar la arquitectura ' +
multi-región que eso implica.</b></div>

<h4>Alertas de quemado de presupuesto</h4>
<p>El problema de alertar con "tasa de error mayor al 1% durante 5 minutos" es que trata igual a un pico
inofensivo y a una degradación sostenida. La alternativa es alertar según <b>a qué velocidad se está
consumiendo el presupuesto</b>:</p>
<table>
<tr><th>Velocidad</th><th>Ventana</th><th>Consume el presupuesto en</th><th>Acción</th></tr>
<tr><td>14×</td><td>1 hora</td><td>~2 días</td><td>Despertar a alguien</td></tr>
<tr><td>6×</td><td>6 horas</td><td>~5 días</td><td>Despertar a alguien</td></tr>
<tr><td>1×</td><td>3 días</td><td>30 días</td><td>Ticket, no urgencia</td></tr>
</table>
<p>Así una caída total dispara en minutos, y una degradación leve genera un ticket sin despertar a nadie.
<b>Es lo que hace que una alerta nocturna signifique algo.</b></p>

<h4>Alertas de negocio</h4>
<p>Las que atrapan lo que las técnicas no ven, porque no hay ningún error:</p>
<pre><code>· Pagos por hora = 0 durante 30 minutos, en horario normal
· Registros diarios cayeron más del 50% respecto de la semana pasada
· Costo de IA superó el 80% del presupuesto mensual
· Cola de trabajos creciendo sin bajar durante 15 minutos
· Ningún email enviado en 2 horas</code></pre>

<div class="dato"><strong>El caso del costo de IA aplica directo a lo que estudiaste:</strong> un bucle de
agente mal escrito puede consumir el presupuesto mensual en horas, <b>sin generar un solo error</b>. Ninguna
métrica técnica se mueve. La única señal es el gasto acumulado, y para eso hace falta la alerta.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <rect x="24" y="28" width="632" height="58" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="340" y="52" text-anchor="middle" fill="#f87171" font-size="13" font-weight="700">
    Una alerta que suena y no requiere hacer nada enseña a ignorar TODAS las alertas.</text>
  <text x="340" y="74" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11">
    Alertar de más es peor que alertar de menos: destruye la confianza en todo el sistema.</text>

  <text x="24" y="112" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    ALERTAR SOBRE SÍNTOMAS, NO SOBRE CAUSAS</text>

  <rect x="24" y="124" width="304" height="106" rx="10" fill="#f87171" fill-opacity=".09" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="146" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">✗ CAUSAS — ruido</text>
  <text x="44" y="168" fill="currentColor" opacity=".72" font-size="10.5">· CPU al 90%</text>
  <text x="44" y="186" fill="currentColor" opacity=".72" font-size="10.5">· memoria al 85%</text>
  <text x="44" y="204" fill="currentColor" opacity=".72" font-size="10.5">· se reinició un contenedor</text>
  <text x="44" y="222" fill="#f87171" font-size="9.5" font-weight="700">puede ser perfectamente normal</text>

  <rect x="352" y="124" width="304" height="106" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="146" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">✓ SÍNTOMAS — acción</text>
  <text x="372" y="168" fill="currentColor" opacity=".72" font-size="10.5">· latencia p95 superó 2 s</text>
  <text x="372" y="186" fill="currentColor" opacity=".72" font-size="10.5">· tasa de error superó 1%</text>
  <text x="372" y="204" fill="currentColor" opacity=".72" font-size="10.5">· no se pueden completar pagos</text>
  <text x="372" y="222" fill="#34d399" font-size="9.5" font-weight="700">el usuario lo está sufriendo</text>

  <text x="24" y="252" fill="#fbbf24" font-size="10.5" font-weight="700">
    Excepción: recursos que se agotan sin vuelta atrás (disco). Ahí sí, por causa y con anticipación.</text>

  <line x1="24" y1="268" x2="656" y2="268" stroke="currentColor" opacity=".18"/>

  <text x="24" y="292" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    PRESUPUESTO DE ERROR — convierte la confiabilidad en una decisión de negocio</text>

  <rect x="24" y="304" width="150" height="46" rx="8" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.2"/>
  <text x="99" y="322" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">99%</text>
  <text x="99" y="340" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">7,2 h/mes · guardia laboral</text>

  <rect x="182" y="304" width="150" height="46" rx="8" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="257" y="322" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">99,9%</text>
  <text x="257" y="340" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">43 min · automatización</text>

  <rect x="340" y="304" width="150" height="46" rx="8" fill="#f87171" fill-opacity=".16" stroke="#f87171" stroke-width="1.2"/>
  <text x="415" y="322" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">99,99%</text>
  <text x="415" y="340" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">4,3 min · multi-región</text>

  <rect x="498" y="304" width="158" height="46" rx="8" fill="#f87171" fill-opacity=".22" stroke="#f87171" stroke-width="1.4"/>
  <text x="577" y="322" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">99,999%</text>
  <text x="577" y="340" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">26 s · casi nadie lo necesita</text>

  <rect x="24" y="360" width="632" height="28" rx="7" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="340" y="378" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">
    Queda presupuesto → desplegá rápido. Lo gastaste → la prioridad pasa a estabilizar.</text>
</svg>`,
        pie: 'Una alerta existe solo si alguien tiene que hacer algo ahora. Si no, es un tablero.',
      },

      entrevista: [
        { p: '¿Cuándo se justifica configurar una alerta?',
          r: 'Solo cuando <b>alguien tiene que hacer algo ahora</b>. Si la respuesta correcta es "lo miro mañana", eso no es una alerta: es un tablero ' +
             'o un ticket. La razón es la <b>fatiga de alertas</b>: si la mitad se dispara sin que haya nada que hacer, el equipo aprende a ' +
             'silenciarlas, y el día que se dispara una que importaba también se silencia. ' +
             '<b>Alertar de más es peor que alertar de menos</b>, porque destruye la confianza en todo el sistema.' },

        { p: '¿Por qué se alerta sobre síntomas y no sobre causas?',
          r: 'Porque una causa puede ser <b>perfectamente normal</b>: la CPU al 90% durante un trabajo por lotes no es un problema. Lo que importa es si ' +
             'el usuario lo está sufriendo, y eso lo dicen los síntomas: latencia p95, tasa de error, "no se pueden completar pagos". ' +
             'Alertar sobre causas genera ruido; sobre síntomas, acción. <b>La excepción son los recursos que se agotan de forma irreversible</b>, ' +
             'como el disco: ahí conviene alertar por causa y con anticipación, porque cuando aparece el síntoma ya es tarde.' },

        { p: '¿Qué es un presupuesto de error y para qué sirve?',
          r: 'Es lo que te podés permitir fallar dado un objetivo: con un SLO de 99,5% mensual, el presupuesto es el 0,5%. Sirve para ' +
             '<b>convertir la confiabilidad en una decisión de negocio</b> en vez de una discusión de opiniones: si queda presupuesto, se puede ' +
             'desplegar rápido y tomar riesgos; si se gastó, la prioridad pasa a estabilizar. Y sube el listón de "queremos 99,99%", ' +
             'porque alguien tiene que estar dispuesto a pagar la arquitectura multi-región que eso implica — 4,3 minutos al mes.' },

        { p: '¿Qué son las alertas de quemado y qué problema resuelven?',
          r: 'Alertan según <b>a qué velocidad se consume el presupuesto de error</b>, no sobre un umbral fijo. Con un umbral, un pico inofensivo y una ' +
             'degradación sostenida se tratan igual. Con quemado, una velocidad de 14× sobre una hora dispara una urgencia —consumiría el presupuesto ' +
             'en dos días—, mientras que una de 1× sobre tres días genera un ticket sin despertar a nadie. ' +
             'Es lo que hace que <b>una alerta nocturna signifique algo</b>.' },
      ],

      practica: `
<h4>Una alerta que se puede accionar</h4>
<pre><code>❌  "Alerta: HighErrorRate en prod"        ← a las 3 AM no ayuda a nadie

✔  Título:   Checkout fallando — 12% de error (normal: 0,3%)
   Impacto:  ~40 usuarios afectados en los últimos 10 min
   Empezó:   03:14, 6 minutos después del despliegue de v2.4.1
   Runbook:  https://.../runbooks/checkout-errores
   Tablero:  https://.../d/checkout
   Primer paso sugerido: revertir el despliegue</code></pre>

<div class="aviso"><strong>La línea que más acelera la resolución es la de "empezó".</strong> Correlacionar el
inicio del problema con el último despliegue convierte una investigación de media hora en una decisión de dos
minutos.</div>

<h4>El conjunto mínimo de alertas</h4>
<table>
<tr><th>Alerta</th><th>Condición</th><th>Urgencia</th></tr>
<tr><td>Servicio caído</td><td>Salud falla 2 min</td><td>Despertar</td></tr>
<tr><td>Tasa de error alta</td><td>Quemado 14× en 1 h</td><td>Despertar</td></tr>
<tr><td>Latencia degradada</td><td>p95 &gt; 2 s por 10 min</td><td>Horario laboral</td></tr>
<tr><td>Base sin conexiones</td><td>Pool agotado 5 min</td><td>Despertar</td></tr>
<tr><td>Disco</td><td>&gt; 85%</td><td>Horario laboral</td></tr>
<tr><td>Cola creciendo</td><td>Sube 15 min sin bajar</td><td>Horario laboral</td></tr>
<tr><td><b>Pagos en cero</b></td><td>0 en 30 min, horario normal</td><td>Despertar</td></tr>
<tr><td><b>Costo de IA</b></td><td>&gt; 80% del presupuesto</td><td>Horario laboral</td></tr>
</table>
<p>Ocho alertas. Si tenés cuarenta, casi con seguridad la mitad son ruido — y están entrenando al equipo para
ignorar las otras veinte.</p>

<h4>Revisión trimestral</h4>
<pre><code>Por cada alerta de los últimos 3 meses:

· ¿Cuántas veces se disparó?
· ¿Cuántas requirieron acción REAL?
· Si la respuesta es 0 → borrarla o bajarla a tablero
· Si se disparó 50 veces → el umbral está mal, no el sistema</code></pre>
<p>Es media hora por trimestre y es lo que evita que el sistema de alertas se degrade solo.</p>

<h4>Alerta de costo de IA</h4>
<pre><code>-- Un bucle de agente mal escrito puede consumir el presupuesto
-- mensual en horas, SIN generar un solo error técnico.
select tenant_id, sum(costo_usd) as gastado
from ai_usage
where creado_en &gt;= date_trunc('month', now())
group by tenant_id
having sum(costo_usd) &gt; 0.8 * 30;   -- 80% del cap de 30 USD</code></pre>
`,

      errores: [
        { mito: 'Cuantas más alertas, mejor cubierto estoy.',
          realidad: 'Al revés: cada alerta que no requiere acción enseña a ignorar el canal. El día que suene una que importaba, también se va a ' +
                    'silenciar. <b>Alertar de más es peor que alertar de menos.</b>' },

        { mito: 'Alerto cuando la CPU pasa el 80%.',
          realidad: 'La CPU al 80% puede ser normal —un trabajo por lotes, un pico esperado— y estar al 30% con la aplicación caída. ' +
                    'Alertá sobre <b>síntomas</b>: latencia, errores, funcionalidad rota. La excepción es el disco, que se agota sin vuelta atrás.' },

        { mito: 'Queremos 99,99% de disponibilidad.',
          realidad: 'Son <b>4,3 minutos de caída al mes</b>: implica multi-región, automatización de conmutación y guardia permanente. ' +
                    'Casi ningún producto lo necesita de verdad, y el salto de costo entre 99,9% y 99,99% es enorme. Elegilo con la factura a la vista.' },

        { mito: 'Si no hay errores, el sistema está bien.',
          realidad: 'Un bucle de agente puede consumir el presupuesto mensual de IA en horas <b>sin un solo error</b>. Un despliegue puede tener ' +
                    'latencia perfecta y haber roto el checkout. Por eso hacen falta <b>alertas de negocio</b>: pagos en cero, registros caídos, ' +
                    'costo acumulado.' },
      ],

      glosario: [
        { t: 'SLI', d: 'Indicador de nivel de servicio: la métrica que representa la experiencia del usuario.' },
        { t: 'SLO', d: 'Objetivo sobre ese indicador, en una ventana de tiempo.' },
        { t: 'Presupuesto de error', d: 'Lo que podés fallar sin incumplir el SLO. Convierte confiabilidad en decisión de negocio.' },
        { t: 'Alerta de quemado', d: 'Se dispara según la velocidad de consumo del presupuesto, no por un umbral fijo.' },
        { t: 'Fatiga de alertas', d: 'Degradación de la atención por exceso de alertas sin acción.' },
        { t: 'Runbook', d: 'Documento con los pasos concretos para atender una alerta específica.' },
        { t: 'Síntoma vs causa', d: 'El síntoma es lo que sufre el usuario; la causa, el recurso técnico detrás.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Resiliencia: aguantar cuando algo se cae',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> todo lo de lo que dependés se va a caer alguna
vez. La pregunta no es si va a pasar, sino <b>qué hace tu sistema cuando pasa</b>.</div>

<h4>Las cuatro herramientas</h4>

<p><b>Timeout.</b> Un límite de espera. Sin él, una llamada lenta ocupa un proceso indefinidamente, y con
suficientes llamadas lentas <b>tu servicio se cae por culpa del ajeno</b>.</p>

<p><b>Reintento.</b> Volver a intentar lo que falló. Solo sirve para errores <b>transitorios</b>, y siempre con
espera creciente — si no, empeorás las cosas.</p>

<p><b>Cortacircuitos.</b> Si un servicio viene fallando, dejar de llamarlo un rato. Suena contraintuitivo y es
lo correcto: darle aire para recuperarse y fallar rápido mientras tanto.</p>

<p><b>Degradación.</b> Funcionar peor en vez de no funcionar. Si el servicio de recomendaciones se cae, mostrar
los productos más vendidos en vez de una página de error.</p>

<div class="aviso"><strong>El error más caro de esta lección es reintentar sin espera creciente.</strong>
Un servicio empieza a fallar, todos sus clientes reintentan al instante, el tráfico se <b>multiplica</b> justo
cuando está débil, y termina de caerse. <b>Los reintentos ingenuos convierten una degradación en una caída
total.</b></div>

<h4>Timeouts: el que falta casi siempre</h4>
<p>Muchos clientes HTTP vienen <b>sin timeout por defecto</b>. Es decir: esperan para siempre. Eso convierte
una lentitud ajena en una caída propia, porque tus procesos se van consumiendo uno por uno atendiendo llamadas
que nunca van a volver.</p>
<p>Y el timeout del cliente tiene que ser <b>menor</b> que el del servidor. Si tu servidor corta a los 30
segundos y vos esperás 60, ya perdiste treinta segundos de un proceso para nada.</p>
`,

      tecnico: `
<h4>Reintento con espera creciente y variación</h4>
<pre><code>async function conReintento(fn, { max = 3, base = 200 } = {}) {
  for (let i = 0; i &lt;= max; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === max || !esTransitorio(e)) throw e;

      // exponencial + variación aleatoria
      const espera = base * 2 ** i * (0.5 + Math.random());
      await dormir(espera);
    }
  }
}

function esTransitorio(e) {
  // 5xx, 429 y errores de red SÍ. 4xx NO: reintentar no los arregla.
  return e.status &gt;= 500 || e.status === 429 || e.code === 'ECONNRESET';
}</code></pre>

<div class="dato"><strong>La variación aleatoria no es un adorno.</strong> Sin ella, todos los clientes que
fallaron al mismo tiempo reintentan <b>exactamente</b> al mismo tiempo, y se genera una onda de tráfico
sincronizada que vuelve a tumbar el servicio en cuanto se levanta. La variación reparte los reintentos y
suaviza el pico.</div>

<h4>Qué reintentar y qué no</h4>
<table>
<tr><th>Situación</th><th>¿Reintentar?</th><th>Por qué</th></tr>
<tr><td>500, 502, 503</td><td>✔ Sí</td><td>Suele ser transitorio</td></tr>
<tr><td>429</td><td>✔ Sí, respetando <code>Retry-After</code></td><td>El servidor te dice cuándo</td></tr>
<tr><td>Timeout de red</td><td>✔ Sí, con cuidado</td><td>Puede haberse ejecutado igual</td></tr>
<tr><td>400, 422</td><td>❌ No</td><td>La petición está mal: no va a cambiar</td></tr>
<tr><td>401, 403</td><td>❌ No</td><td>Falta permiso, no es transitorio</td></tr>
<tr><td>404</td><td>❌ No</td><td>No existe</td></tr>
</table>

<div class="dato"><strong>La fila del timeout esconde la trampa más peligrosa:</strong> un timeout significa
que <b>no sabés</b> si la operación se ejecutó. Reintentar un cobro que en realidad sí se procesó cobra dos
veces. Por eso toda operación con efectos se hace <b>idempotente</b>: se manda una clave de idempotencia y el
servidor devuelve el mismo resultado si la ve repetida.</div>

<h4>Cortacircuitos</h4>
<p>Tres estados:</p>
<ul>
<li><b>Cerrado</b> — todo normal, las llamadas pasan.</li>
<li><b>Abierto</b> — se superó el umbral de fallas: las llamadas fallan <b>inmediatamente</b>, sin salir.</li>
<li><b>Semiabierto</b> — pasado un tiempo, deja pasar una llamada de prueba. Si funciona, cierra; si no, vuelve a abrir.</li>
</ul>
<p>El valor no es solo proteger al que falla: es <b>fallar rápido</b>. Sin cortacircuitos, cada petición espera
el timeout completo antes de fallar; con él, falla al instante y podés recurrir al plan B sin consumir tiempo
ni procesos.</p>

<h4>Degradación con planes de respaldo</h4>
<pre><code>async function recomendaciones(usuarioId) {
  try {
    return await conCorte(() =&gt; servicioIA.recomendar(usuarioId));
  } catch {
    try {
      return await cache.get(\`reco:\${usuarioId}\`);        // 1 · caché vieja
    } catch {
      return await masVendidos();                          // 2 · genérico
    }
  }
}</code></pre>

<div class="dato"><strong>Servir datos viejos suele ser mucho mejor que servir un error.</strong> Un usuario
que ve recomendaciones de ayer no nota nada; uno que ve una página rota, sí. La pregunta que ordena el diseño
es: <b>¿qué es lo mínimo aceptable que puedo mostrar si esta dependencia no está?</b></div>

<h4>Aislamiento por compartimentos</h4>
<p>Separar los recursos por dependencia, para que la saturación de una no se lleve puesto todo lo demás:</p>
<pre><code>· Pool de conexiones separado para trabajos por lotes y para peticiones de usuario
· Límite de llamadas concurrentes por servicio externo
· Cola aparte para lo lento (informes, IA) y para lo rápido (notificaciones)</code></pre>
<p>Sin esta separación, un informe pesado puede consumir todas las conexiones y dejar sin base a las peticiones
de usuario.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="rs1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="22" fill="#f87171" font-size="12" font-weight="700">
    EL ERROR MÁS CARO: REINTENTAR SIN ESPERA CRECIENTE</text>

  <rect x="24" y="34" width="632" height="76" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="56" fill="currentColor" opacity=".75" font-size="11">1 · un servicio empieza a fallar</text>
  <text x="44" y="76" fill="currentColor" opacity=".75" font-size="11">2 · todos sus clientes reintentan AL INSTANTE, todos juntos</text>
  <text x="44" y="96" fill="#f87171" font-size="11.5" font-weight="700">3 · el tráfico se multiplica justo cuando está débil → se cae del todo</text>

  <rect x="24" y="120" width="632" height="26" rx="7" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="340" y="138" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">
    Fix: espera exponencial + variación aleatoria (para que no reintenten todos al mismo tiempo)</text>

  <line x1="24" y1="164" x2="656" y2="164" stroke="currentColor" opacity=".18"/>

  <text x="24" y="188" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS CUATRO HERRAMIENTAS</text>

  <rect x="24" y="200" width="152" height="86" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="100" y="222" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">TIMEOUT</text>
  <text x="100" y="242" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">un límite de espera</text>
  <text x="100" y="260" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">muchos clientes NO</text>
  <text x="100" y="274" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">lo traen por defecto</text>

  <rect x="188" y="200" width="152" height="86" rx="10" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="264" y="222" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">REINTENTO</text>
  <text x="264" y="242" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">solo errores transitorios</text>
  <text x="264" y="260" text-anchor="middle" fill="#fbbf24" font-size="9" font-weight="700">5xx y 429 sí</text>
  <text x="264" y="274" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">4xx no: no va a cambiar</text>

  <rect x="352" y="200" width="152" height="86" rx="10" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="428" y="222" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">CORTACIRCUITOS</text>
  <text x="428" y="242" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">dejar de llamar un rato</text>
  <text x="428" y="260" text-anchor="middle" fill="#7c5cff" font-size="9" font-weight="700">le da aire al que falla</text>
  <text x="428" y="274" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">y vos fallás RÁPIDO</text>

  <rect x="516" y="200" width="140" height="86" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.3"/>
  <text x="586" y="222" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">DEGRADACIÓN</text>
  <text x="586" y="242" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">funcionar peor</text>
  <text x="586" y="256" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">en vez de no funcionar</text>
  <text x="586" y="276" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">datos viejos &gt; error</text>

  <text x="24" y="308" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CORTACIRCUITOS — los tres estados</text>

  <rect x="24" y="320" width="176" height="42" rx="9" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.3"/>
  <text x="112" y="338" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">CERRADO</text>
  <text x="112" y="354" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">las llamadas pasan</text>

  <line x1="204" y1="341" x2="222" y2="341" stroke="#f87171" stroke-width="1.5" marker-end="url(#rs1)" color="#f87171"/>
  <text x="213" y="333" text-anchor="middle" fill="#f87171" font-size="8">fallas</text>

  <rect x="226" y="320" width="176" height="42" rx="9" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.3"/>
  <text x="314" y="338" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">ABIERTO</text>
  <text x="314" y="354" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">falla al instante, sin salir</text>

  <line x1="406" y1="341" x2="424" y2="341" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#rs1)" color="#fbbf24"/>
  <text x="415" y="333" text-anchor="middle" fill="#fbbf24" font-size="8">tiempo</text>

  <rect x="428" y="320" width="176" height="42" rx="9" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="516" y="338" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">SEMIABIERTO</text>
  <text x="516" y="354" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">deja pasar una de prueba</text>

  <rect x="24" y="372" width="632" height="18" rx="5" fill="#7c5cff" fill-opacity=".12"/>
  <text x="340" y="385" text-anchor="middle" fill="#7c5cff" font-size="10" font-weight="700">
    Un timeout significa que NO SABÉS si se ejecutó → toda operación con efectos tiene que ser idempotente</text>
</svg>`,
        pie: 'Todo lo de lo que dependés se va a caer. Lo que se diseña es qué hacés cuando pasa.',
      },

      entrevista: [
        { p: '¿Por qué los reintentos pueden empeorar una caída?',
          r: 'Porque si son <b>inmediatos</b>, todos los clientes que fallaron reintentan a la vez y el tráfico se multiplica <b>justo cuando el ' +
             'servicio está débil</b> — así una degradación se convierte en una caída total. Hay que usar <b>espera exponencial con variación ' +
             'aleatoria</b>: la exponencial da tiempo a recuperarse, y la variación evita que todos reintenten en el mismo instante y generen una onda ' +
             'sincronizada que lo vuelve a tumbar en cuanto se levanta.' },

        { p: '¿Qué errores conviene reintentar y cuáles no?',
          r: 'Sí los <b>transitorios</b>: 500, 502, 503, y 429 respetando el <code>Retry-After</code> que manda el servidor. ' +
             'No los <b>4xx de cliente</b> —400, 401, 403, 404—: la petición está mal o falta permiso, y reintentar no lo va a cambiar. ' +
             'El caso delicado es el <b>timeout</b>: significa que <b>no sabés</b> si la operación se ejecutó, así que reintentar un cobro puede ' +
             'cobrar dos veces. Por eso toda operación con efectos se hace <b>idempotente</b>, con una clave que el servidor reconozca si se repite.' },

        { p: '¿Qué es un cortacircuitos y qué aporta más allá de proteger al que falla?',
          r: 'Es un mecanismo de tres estados: <b>cerrado</b> deja pasar todo, <b>abierto</b> hace fallar las llamadas al instante sin salir a la red, ' +
             'y <b>semiabierto</b> deja pasar una de prueba para ver si se recuperó. Además de darle aire al servicio que falla, aporta algo para vos: ' +
             '<b>fallar rápido</b>. Sin cortacircuitos, cada petición espera el timeout completo antes de fallar; con él, falla al instante y podés ' +
             'ir al plan B sin consumir tiempo ni procesos.' },

        { p: '¿Qué es la degradación elegante?',
          r: 'Funcionar peor en vez de no funcionar. Si el servicio de recomendaciones se cae, sirvo la <b>caché vieja</b>, y si tampoco está, los ' +
             'más vendidos — cualquier cosa antes que una página de error. La pregunta que ordena el diseño es: <b>¿qué es lo mínimo aceptable que ' +
             'puedo mostrar si esta dependencia no está?</b> Servir datos de ayer suele ser mucho mejor que servir un error: el usuario no lo nota, ' +
             'y una página rota sí.' },
      ],

      practica: `
<h4>Timeouts en todas las capas</h4>
<pre><code>// Cliente HTTP — muchos NO traen timeout por defecto
const ctrl = new AbortController();
const t = setTimeout(() =&gt; ctrl.abort(), 5_000);
try {
  await fetch(url, { signal: ctrl.signal });
} finally { clearTimeout(t); }

// Base de datos
const pool = new Pool({
  connectionTimeoutMillis: 5_000,
  statement_timeout: 10_000,        // corta consultas colgadas
  idle_in_transaction_session_timeout: 30_000,
});</code></pre>

<div class="aviso"><strong><code>idle_in_transaction_session_timeout</code> merece atención aparte:</strong>
una transacción abierta y olvidada <b>bloquea el vacuum y retiene filas muertas</b>. Es una de las causas más
frecuentes de degradación progresiva de Postgres, y no se manifiesta como error sino como todo cada vez más
lento.</div>

<h4>Presupuesto de tiempo en cascada</h4>
<pre><code>Usuario espera como mucho     10 s
  └─ tu API                    9 s  ← margen para responder algo
      ├─ auth                  1 s
      ├─ base de datos         3 s
      └─ servicio externo      4 s  ← con corte, para no gastarlos todos</code></pre>
<p>El timeout de cada capa tiene que ser <b>menor</b> que el de la que la llama. Si tu servidor corta a los 30
segundos y el cliente espera 60, perdiste treinta segundos de un proceso para nada.</p>

<h4>Idempotencia en operaciones con efectos</h4>
<pre><code>// El cliente genera la clave y la reusa en TODOS los reintentos
const clave = \`pago-\${pedidoId}\`;

await stripe.paymentIntents.create(
  { amount, currency: 'ars' },
  { idempotencyKey: clave }        // ← si se repite, devuelve lo mismo
);

// Del lado propio: una restricción única hace el trabajo
create unique index on operaciones (clave_idempotencia);</code></pre>

<h4>Checklist de resiliencia</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Timeout explícito en <b>todo</b> cliente HTTP</td></tr>
<tr><td>☐</td><td>Timeouts de base de datos configurados</td></tr>
<tr><td>☐</td><td>Reintentos solo en transitorios, con espera creciente y variación</td></tr>
<tr><td>☐</td><td>Operaciones con efectos idempotentes</td></tr>
<tr><td>☐</td><td>Cortacircuitos en dependencias externas críticas</td></tr>
<tr><td>☐</td><td>Un plan de respaldo por dependencia no esencial</td></tr>
<tr><td>☐</td><td>Pools separados para lotes y para usuarios</td></tr>
<tr><td>☐</td><td>Presupuesto de tiempo coherente entre capas</td></tr>
</table>
`,

      errores: [
        { mito: 'Reintento tres veces y listo.',
          realidad: 'Si los reintentos son <b>inmediatos</b>, multiplicás el tráfico justo cuando el servicio está débil y lo terminás de tumbar. ' +
                    'Espera exponencial <b>con variación aleatoria</b>, o los clientes se sincronizan y generan una onda que lo vuelve a caer.' },

        { mito: 'Reintento cualquier error.',
          realidad: 'Los <b>4xx no se arreglan reintentando</b>: la petición está mal o falta permiso. Y reintentar un <b>timeout</b> de una operación ' +
                    'con efectos puede cobrar dos veces, porque no sabés si se ejecutó. Eso exige idempotencia.' },

        { mito: 'Mi cliente HTTP ya tiene timeout.',
          realidad: 'Muchos <b>no lo traen por defecto</b>: esperan indefinidamente. Y el del cliente tiene que ser <b>menor</b> que el del servidor, ' +
                    'o desperdiciás procesos esperando respuestas que ya fueron abandonadas del otro lado.' },

        { mito: 'Si una dependencia falla, devuelvo un error y ya.',
          realidad: 'Casi siempre hay algo mejor: caché vieja, un valor genérico, la funcionalidad sin ese adorno. ' +
                    '<b>Servir datos de ayer suele ser mucho mejor que servir un error</b>, porque el usuario ni lo nota.' },
      ],

      glosario: [
        { t: 'Timeout', d: 'Límite de espera antes de abandonar una operación.' },
        { t: 'Espera exponencial', d: 'Duplicar el tiempo entre reintentos sucesivos.' },
        { t: 'Variación aleatoria', d: 'Ruido añadido a la espera para que los clientes no reintenten sincronizados.' },
        { t: 'Cortacircuitos', d: 'Mecanismo que corta las llamadas a un servicio que viene fallando.' },
        { t: 'Degradación elegante', d: 'Ofrecer una versión reducida del servicio en vez de un error.' },
        { t: 'Idempotencia', d: 'Que repetir una operación produzca el mismo resultado que ejecutarla una vez.' },
        { t: 'Compartimentos', d: 'Aislar recursos por dependencia para que una saturación no se propague.' },
        { t: 'Presupuesto de tiempo', d: 'Reparto del tiempo total disponible entre las capas de una cascada.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Incidentes y postmortems',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> durante un incidente, <b>recuperar el servicio va
primero que entender la causa</b>. Investigar con usuarios afectados es el orden equivocado.</div>

<h4>Los cinco pasos</h4>
<ol>
<li><b>Detectar</b> — una alerta, o alguien que avisa.</li>
<li><b>Mitigar</b> — que los usuarios vuelvan a poder usar el producto. Revertir, apagar una bandera, escalar.</li>
<li><b>Comunicar</b> — al equipo y, si corresponde, a los usuarios.</li>
<li><b>Investigar</b> — <b>después</b> de mitigar.</li>
<li><b>Aprender</b> — postmortem con acciones concretas.</li>
</ol>

<div class="aviso"><strong>El error de orden más común es investigar antes de mitigar.</strong> Con usuarios
afectados, <b>revertir primero y entender después</b> casi siempre es lo correcto. La curiosidad técnica es
buena y tiene su momento: no es mientras el producto está caído.</div>

<h4>Roles, aunque el equipo sea chico</h4>
<p>Con dos personas alcanza, pero los roles tienen que estar claros:</p>
<ul>
<li><b>Quien coordina</b> — decide y mantiene el orden. <b>No</b> es quien está tecleando.</li>
<li><b>Quien opera</b> — investiga y ejecuta cambios.</li>
<li><b>Quien comunica</b> — actualiza a los demás.</li>
</ul>
<p>Cuando una sola persona hace las tres cosas, la comunicación es lo primero que se cae — y ahí aparecen cinco
personas preguntando "¿cómo va?" mientras quien está resolviendo no puede concentrarse.</p>

<h4>El postmortem sin culpables</h4>
<p>La regla es que <b>el objetivo es el sistema, no la persona</b>. No porque no importe quién hizo qué, sino
porque buscar culpables tiene un efecto muy concreto: <b>la gente deja de reportar</b>, los incidentes se
ocultan y se pierde la única fuente de información que hace mejorar el sistema.</p>
<p>La pregunta correcta no es "¿quién se equivocó?" sino <b>"¿qué permitió que ese error llegara a
producción?"</b>.</p>
`,

      tecnico: `
<h4>Gravedad, para que la respuesta sea proporcional</h4>
<table>
<tr><th>Nivel</th><th>Qué significa</th><th>Respuesta</th></tr>
<tr><td><b>SEV1</b></td><td>Caído para todos, o pérdida de datos</td><td>Todos, ya, a cualquier hora</td></tr>
<tr><td><b>SEV2</b></td><td>Funcionalidad principal rota o un tenant caído</td><td>Guardia, inmediato</td></tr>
<tr><td><b>SEV3</b></td><td>Funcionalidad secundaria degradada</td><td>Horario laboral</td></tr>
<tr><td><b>SEV4</b></td><td>Molestia menor</td><td>Backlog</td></tr>
</table>
<p>Sin niveles pasa una de dos cosas: todo se trata como urgente y el equipo se quema, o nada se trata como
urgente y las cosas graves esperan.</p>

<h4>La bitácora del incidente</h4>
<p>Anotar con marca de tiempo <b>mientras ocurre</b>, no después. La memoria reconstruye mal bajo estrés y ese
registro es la materia prima del postmortem:</p>
<pre><code>03:14  Alerta: tasa de error de checkout al 12%
03:16  Confirmado en el tablero. Empezó 03:12.
03:18  Último despliegue: v2.4.1 a las 03:08. Sospecha principal.
03:21  Revertido a v2.4.0
03:24  Tasa de error de vuelta a 0,3%. MITIGADO.
03:40  Causa: migración 041 borró una columna que v2.4.0 todavía usaba.</code></pre>

<div class="dato"><strong>Los dos números que importan son la distancia entre 03:12 y 03:14</strong> —cuánto
tardaste en <b>enterarte</b>— y entre 03:14 y 03:24 —cuánto tardaste en <b>mitigar</b>. Si el primero es
grande, el problema es la observabilidad. Si el segundo es grande, el problema es que no hay una vuelta atrás
rápida. Son dos arreglos completamente distintos, y la bitácora es lo que te dice cuál necesitás.</div>

<h4>Estructura del postmortem</h4>
<pre><code>1 · Resumen           qué pasó, en dos oraciones
2 · Impacto           usuarios, duración, datos afectados, dinero
3 · Cronología        con marcas de tiempo
4 · Causa raíz        el "por qué" hasta el final
5 · Qué funcionó      lo que salió bien también se aprende
6 · Qué falló         detección, herramientas, procedimiento
7 · Acciones          con responsable y fecha</code></pre>

<div class="dato"><strong>El punto 7 es la única razón por la que se escribe un postmortem.</strong> Un
documento con un análisis excelente y sin acciones asignadas es un ejercicio literario: en tres meses el mismo
incidente vuelve a pasar. <b>Cada acción necesita responsable y fecha</b>, y conviene revisarlas en la retro
siguiente.</div>

<h4>Los cinco porqués, con el final correcto</h4>
<pre><code>El checkout falló.
  ¿Por qué? La consulta buscaba una columna que no existía.
  ¿Por qué? Una migración la borró.
  ¿Por qué? Se asumió que el código viejo ya no la usaba.
  ¿Por qué? No hay forma de verificar qué código usa qué columna.
  ¿Por qué? No hay revisión obligatoria de compatibilidad en migraciones.

→ Acción: checklist de compatibilidad en el PR de toda migración,
          y verificación automática de que el despliegue anterior
          sigue funcionando contra el esquema nuevo.</code></pre>

<p>Fijate que la cadena <b>nunca termina en una persona</b>. Si termina en "fulano se olvidó", faltó un
porqué: la pregunta siguiente es <b>por qué el sistema permitió que ese olvido llegara a producción</b>.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="in1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL ORDEN — mitigar va ANTES que entender</text>

  <rect x="24" y="34" width="112" height="48" rx="9" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="80" y="55" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">1 · DETECTAR</text>
  <text x="80" y="71" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">alerta o aviso</text>

  <line x1="140" y1="58" x2="154" y2="58" stroke="currentColor" stroke-width="1.3" marker-end="url(#in1)"/>

  <rect x="158" y="34" width="112" height="48" rx="9" fill="#34d399" fill-opacity=".28" stroke="#34d399" stroke-width="1.8"/>
  <text x="214" y="55" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">2 · MITIGAR</text>
  <text x="214" y="71" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">revertir · apagar</text>

  <line x1="274" y1="58" x2="288" y2="58" stroke="currentColor" stroke-width="1.3" marker-end="url(#in1)"/>

  <rect x="292" y="34" width="112" height="48" rx="9" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="348" y="55" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">3 · COMUNICAR</text>
  <text x="348" y="71" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">equipo y usuarios</text>

  <line x1="408" y1="58" x2="422" y2="58" stroke="currentColor" stroke-width="1.3" marker-end="url(#in1)"/>

  <rect x="426" y="34" width="112" height="48" rx="9" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="482" y="55" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">4 · INVESTIGAR</text>
  <text x="482" y="71" text-anchor="middle" fill="#7c5cff" font-size="9" font-weight="700">recién ACÁ</text>

  <line x1="542" y1="58" x2="556" y2="58" stroke="currentColor" stroke-width="1.3" marker-end="url(#in1)"/>

  <rect x="560" y="34" width="96" height="48" rx="9" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="608" y="55" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">5 · APRENDER</text>
  <text x="608" y="71" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">postmortem</text>

  <rect x="24" y="94" width="632" height="26" rx="7" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.3"/>
  <text x="340" y="112" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    Investigar antes de mitigar es el error de orden más común. La curiosidad técnica tiene su momento — no es ese.</text>

  <line x1="24" y1="138" x2="656" y2="138" stroke="currentColor" opacity=".18"/>

  <text x="24" y="162" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS DOS NÚMEROS QUE IMPORTAN — y apuntan a arreglos distintos</text>

  <rect x="24" y="174" width="304" height="72" rx="10" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="176" y="196" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">TIEMPO HASTA ENTERARSE</text>
  <text x="176" y="216" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">03:12 pasó → 03:14 alerta</text>
  <text x="176" y="236" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">si es grande → arreglá la observabilidad</text>

  <rect x="352" y="174" width="304" height="72" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.3"/>
  <text x="504" y="196" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">TIEMPO HASTA MITIGAR</text>
  <text x="504" y="216" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">03:14 alerta → 03:24 revertido</text>
  <text x="504" y="236" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">si es grande → arreglá la vuelta atrás</text>

  <text x="24" y="276" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    POSTMORTEM SIN CULPABLES — por qué no es blandura</text>

  <rect x="24" y="288" width="304" height="98" rx="10" fill="#f87171" fill-opacity=".09" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="310" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">SI SE BUSCAN CULPABLES</text>
  <text x="44" y="332" fill="currentColor" opacity=".72" font-size="10.5">· la gente deja de reportar</text>
  <text x="44" y="350" fill="currentColor" opacity=".72" font-size="10.5">· los incidentes se ocultan</text>
  <text x="44" y="368" fill="#f87171" font-size="10.5" font-weight="700">· se pierde la única fuente de mejora</text>

  <rect x="352" y="288" width="304" height="98" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="310" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">LA PREGUNTA CORRECTA</text>
  <text x="372" y="334" fill="currentColor" opacity=".72" font-size="10.5">no: “¿quién se equivocó?”</text>
  <text x="372" y="356" fill="#34d399" font-size="11" font-weight="700">sí: “¿qué permitió que ese error</text>
  <text x="372" y="373" fill="#34d399" font-size="11" font-weight="700">llegara a producción?”</text>
</svg>`,
        pie: 'Si la cadena de porqués termina en una persona, faltó un porqué.',
      },

      entrevista: [
        { p: '¿Cuál es el orden correcto durante un incidente?',
          r: '<b>Detectar, mitigar, comunicar, investigar, aprender.</b> Lo importante es que <b>mitigar va antes que entender</b>: con usuarios ' +
             'afectados, revertir primero y entender después casi siempre es lo correcto. El error de orden más común es empezar a investigar la causa ' +
             'con el producto caído. La curiosidad técnica es buena y tiene su momento: no es mientras los usuarios no pueden usar el producto.' },

        { p: '¿Qué dos números sacás de la cronología de un incidente?',
          r: 'El <b>tiempo hasta enterarme</b> —de que empezó a que se disparó la alerta— y el <b>tiempo hasta mitigar</b> —de la alerta a que el ' +
             'servicio volvió—. Y apuntan a arreglos completamente distintos: si el primero es grande, el problema es la <b>observabilidad</b>, ' +
             'me faltan alertas o están mal puestas. Si el segundo es grande, el problema es que <b>no hay una vuelta atrás rápida</b>. ' +
             'Por eso conviene llevar la bitácora con marcas de tiempo mientras ocurre, no reconstruirla después.' },

        { p: '¿Por qué los postmortems son sin culpables?',
          r: 'No por blandura, sino por un efecto muy concreto: si se buscan culpables, <b>la gente deja de reportar</b>, los incidentes se ocultan y se ' +
             'pierde la única fuente de información que hace mejorar el sistema. La pregunta correcta no es "¿quién se equivocó?" sino ' +
             '<b>"¿qué permitió que ese error llegara a producción?"</b>. Y una señal práctica: si la cadena de porqués termina en "fulano se olvidó", ' +
             '<b>faltó un porqué</b> — la pregunta siguiente es por qué el sistema permitió ese olvido.' },

        { p: '¿Qué hace que un postmortem sirva para algo?',
          r: 'Las <b>acciones con responsable y fecha</b>. Un documento con un análisis excelente y sin acciones asignadas es un ejercicio literario: ' +
             'en tres meses el mismo incidente vuelve a pasar. Y conviene revisar esas acciones en la retro siguiente, porque si nadie las mira ' +
             'quedan igual de muertas que si no se hubieran escrito. Lo demás del documento —cronología, impacto, causa raíz, y también ' +
             '<b>qué funcionó bien</b>— es el insumo para llegar a esas acciones.' },
      ],

      practica: `
<h4>Plantilla de postmortem</h4>
<pre><code># Incidente 2026-08-07 — Checkout caído 12 minutos

## Resumen
Una migración eliminó una columna que la versión anterior todavía usaba.
El checkout falló durante el despliegue progresivo.

## Impacto
· 12 minutos (03:12 – 03:24)
· ~40 usuarios no pudieron completar la compra
· 0 pagos duplicados, 0 pérdida de datos

## Cronología
03:08  Despliegue de v2.4.1 con migración 041
03:12  Primeros errores
03:14  Alerta de tasa de error
03:18  Se identifica el despliegue como sospechoso
03:21  Reversión a v2.4.0
03:24  Mitigado

## Causa raíz
La migración 041 hizo DROP de una columna en el mismo despliegue que
introducía el código que dejaba de usarla. Durante el despliegue
progresivo convivieron ambas versiones contra el esquema nuevo.

## Qué funcionó
· La alerta se disparó en 2 minutos
· La reversión tomó 3 minutos

## Qué falló
· Nada verificaba compatibilidad hacia atrás de las migraciones
· Staging tenía una sola instancia: nunca convivieron dos versiones

## Acciones
| Acción                                         | Responsable | Fecha  |
|------------------------------------------------|-------------|--------|
| Checklist de compatibilidad en PR de migración | —           | 14/08  |
| Staging con 2 réplicas                          | —           | 21/08  |
| Verificación automática de esquema vs versión previa | —      | 28/08  |</code></pre>

<div class="aviso"><strong>Fijate que "qué funcionó" también está.</strong> No es cortesía: saber que la alerta
tardó dos minutos y la reversión tres te dice que <b>esas dos piezas no hay que tocarlas</b>, y que el esfuerzo
va todo a prevenir. Sin esa sección, es fácil terminar reformando lo que ya andaba bien.</div>

<h4>Comunicación durante el incidente</h4>
<pre><code>// Cada 15-20 minutos, aunque no haya novedades
[03:20] Investigando errores en checkout. ~40 usuarios afectados.
        Sospechamos el despliegue de las 03:08. Próxima actualización 03:35.

[03:25] MITIGADO. Revertimos a la versión anterior. Checkout normal.
        Investigando causa raíz. Postmortem mañana.</code></pre>
<p>El "próxima actualización a las X" es lo que corta el goteo de "¿cómo va?" y le devuelve la concentración a
quien está resolviendo.</p>

<h4>Preparación previa</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Niveles de gravedad definidos, con respuesta esperada</td></tr>
<tr><td>☐</td><td>Quién es la guardia, y cómo se lo contacta</td></tr>
<tr><td>☐</td><td>Runbooks de los tres incidentes más probables</td></tr>
<tr><td>☐</td><td>Vuelta atrás probada y cronometrada</td></tr>
<tr><td>☐</td><td>Canal de incidentes separado del ruido diario</td></tr>
<tr><td>☐</td><td>Plantilla de postmortem lista</td></tr>
<tr><td>☐</td><td>Acciones de postmortems anteriores revisadas</td></tr>
</table>
`,

      errores: [
        { mito: 'Primero entiendo bien qué pasó, después arreglo.',
          realidad: 'Con usuarios afectados, <b>mitigar va primero</b>: revertir, apagar la bandera, escalar. Investigar con el producto caído es el ' +
                    'error de orden más común, y el costo se mide en minutos de gente sin poder usar el producto.' },

        { mito: 'El postmortem es para determinar quién se equivocó.',
          realidad: 'Si se buscan culpables, <b>la gente deja de reportar</b> y los incidentes se ocultan. La pregunta correcta es qué permitió que ' +
                    'ese error llegara a producción. Si la cadena de porqués termina en una persona, <b>faltó un porqué</b>.' },

        { mito: 'Escribí un postmortem muy completo.',
          realidad: 'Si no tiene <b>acciones con responsable y fecha</b>, es un ejercicio literario: en tres meses el mismo incidente vuelve a pasar. ' +
                    'Y esas acciones hay que revisarlas en la retro siguiente, o quedan igual de muertas.' },

        { mito: 'Anoto la cronología cuando termine el incidente.',
          realidad: 'La memoria reconstruye mal bajo estrés, y los tiempos exactos son justamente lo que te dice <b>qué arreglar</b>: tardanza en ' +
                    'detectar apunta a la observabilidad, tardanza en mitigar apunta a la vuelta atrás. Anotá con marca de tiempo mientras ocurre.' },
      ],

      glosario: [
        { t: 'Mitigar', d: 'Devolver el servicio a los usuarios, con o sin entender la causa.' },
        { t: 'Gravedad', d: 'Clasificación del impacto que determina la urgencia de la respuesta.' },
        { t: 'Coordinador', d: 'Quien dirige el incidente y mantiene el orden. No es quien está tecleando.' },
        { t: 'Bitácora', d: 'Registro con marcas de tiempo escrito durante el incidente.' },
        { t: 'Tiempo hasta detectar', d: 'Desde que empieza el problema hasta que alguien se entera.' },
        { t: 'Tiempo hasta mitigar', d: 'Desde la detección hasta que el servicio vuelve a funcionar.' },
        { t: 'Postmortem sin culpables', d: 'Análisis centrado en el sistema, no en las personas.' },
        { t: 'Cinco porqués', d: 'Encadenar preguntas hasta llegar a una causa sistémica, no personal.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Qué pregunta responde cada pilar de la observabilidad?',
      opciones: [
        'Métricas: que algo pasa. Trazas: dónde. Logs: qué exactamente',
        'Los tres responden lo mismo con distinto formato',
        'Métricas: qué. Logs: dónde. Trazas: cuándo',
        'Solo los logs responden algo útil',
      ],
      correcta: 0,
      porQue: 'Hacen falta los tres: con solo logs buscás una aguja en un pajar, con solo métricas sabés que hay un problema y nada más, y una traza sin logs te dice en qué componente pero no por qué.',
      porQueNo: {
        1: 'Responden preguntas distintas y por eso se complementan.',
        2: 'Está invertido: la traza es la que localiza el componente.',
        3: 'Los logs solos no dan tendencia ni localización rápida.',
      },
    },
    {
      p: '¿Por qué se usan percentiles en vez del promedio de latencia?',
      opciones: [
        'El promedio oculta la cola: con 90% en 50 ms y 10% en 5 s da 545 ms, que no describe a nadie',
        'Los percentiles son más baratos de calcular',
        'El promedio no se puede graficar',
        'Es una convención sin fundamento técnico',
      ],
      correcta: 0,
      porQue: 'El p95 dice cuánto tardan las peticiones del 5% peor y el p99 es donde se esconden los problemas reales. Mirar promedios es la razón número uno por la que un equipo no ve un problema que los usuarios sí sienten.',
      porQueNo: {
        1: 'Los histogramas son más caros de almacenar, no más baratos.',
        2: 'Se puede graficar perfectamente; el problema es que engaña.',
        3: 'Tiene un fundamento muy concreto: la distribución no es simétrica.',
      },
    },
    {
      p: '¿Qué es la alta cardinalidad en métricas y por qué es un problema?',
      opciones: [
        'Muchas combinaciones de etiquetas: cada una es una serie temporal, y la factura se dispara',
        'Métricas con valores muy grandes',
        'Demasiados tipos de métrica distintos',
        'Métricas que se actualizan muy seguido',
      ],
      correcta: 0,
      porQue: 'Etiquetar con un ID de usuario o de pedido genera millones de series. La regla es que los identificadores únicos van en logs y trazas, nunca en etiquetas de métricas.',
      porQueNo: {
        1: 'La magnitud del valor no afecta el almacenamiento.',
        2: 'La variedad de tipos no es lo que dispara el costo.',
        3: 'La frecuencia importa, pero no es lo que se llama cardinalidad.',
      },
    },
    {
      p: '¿Qué hace que un log sea útil?',
      opciones: [
        'Que sea estructurado: un evento con campos que se pueden buscar, filtrar, contar y graficar',
        'Que incluya el máximo detalle posible, incluido el objeto de la petición',
        'Que esté en texto legible por humanos',
        'Que se guarde para siempre',
      ],
      correcta: 0,
      porQue: '"¿Cuántos pagos fallaron por tarjeta rechazada esta semana, por tenant?" es una consulta trivial sobre logs estructurados e imposible sobre texto libre.',
      porQueNo: {
        1: 'Ahí se van tokens y datos personales: un log es una filtración de larga duración.',
        2: 'Está bien en desarrollo; en producción se pierde la capacidad de consultar.',
        3: 'La retención infinita solo aumenta el costo y el riesgo.',
      },
    },
    {
      p: '¿Cuándo se justifica configurar una alerta?',
      opciones: [
        'Solo cuando alguien tiene que hacer algo ahora',
        'Siempre que una métrica pueda salirse de rango',
        'Cuando el equipo quiera enterarse de algo',
        'Para cada servicio, al menos una',
      ],
      correcta: 0,
      porQue: 'Si la respuesta correcta es "lo miro mañana", eso es un tablero, no una alerta. Alertar de más es peor que alertar de menos: enseña al equipo a silenciar el canal.',
      porQueNo: {
        1: 'Eso genera fatiga de alertas y destruye la confianza en el sistema.',
        2: 'Enterarse es para tableros; alertar es para actuar.',
        3: 'La cantidad debería depender de qué requiere acción, no de la cantidad de servicios.',
      },
    },
    {
      p: '¿Por qué conviene alertar sobre síntomas y no sobre causas?',
      opciones: [
        'Una causa puede ser normal: lo que importa es si el usuario lo está sufriendo',
        'Los síntomas son más fáciles de medir',
        'Las causas no se pueden monitorear',
        'Porque los síntomas se detectan antes',
      ],
      correcta: 0,
      porQue: 'La CPU al 90% puede ser un trabajo por lotes esperado, y estar al 30% con la app caída. La excepción son los recursos que se agotan sin vuelta atrás, como el disco.',
      porQueNo: {
        1: 'A menudo es al revés: la CPU es más simple de medir que la experiencia del usuario.',
        2: 'Se monitorean perfectamente; el problema es alertar sobre ellas.',
        3: 'La causa suele aparecer antes; el punto es que no siempre implica un problema.',
      },
    },
    {
      p: '¿Para qué sirve un presupuesto de error?',
      opciones: [
        'Convierte la confiabilidad en decisión de negocio: si queda, se despliega rápido; si se gastó, se estabiliza',
        'Para calcular cuánto cuesta la infraestructura',
        'Para repartir la culpa de los incidentes',
        'Para justificar más servidores',
      ],
      correcta: 0,
      porQue: 'También sube el listón de "queremos 99,99%": son 4,3 minutos al mes, e implica multi-región y guardia permanente. Alguien tiene que estar dispuesto a pagarlo.',
      porQueNo: {
        1: 'Es una medida de confiabilidad, no de costo de infraestructura.',
        2: 'Los postmortems son sin culpables por diseño.',
        3: 'Puede llevar a esa conclusión, pero no es su función.',
      },
    },
    {
      p: '¿Qué problema resuelven las alertas de quemado de presupuesto?',
      opciones: [
        'Distinguen un pico inofensivo de una degradación sostenida, según la velocidad de consumo',
        'Reducen el costo de la plataforma de observabilidad',
        'Eliminan la necesidad de guardia',
        'Detectan problemas antes de que ocurran',
      ],
      correcta: 0,
      porQue: 'Un umbral fijo trata igual a los dos casos. Con quemado, 14× en una hora despierta a alguien y 1× en tres días genera un ticket. Es lo que hace que una alerta nocturna signifique algo.',
      porQueNo: {
        1: 'No tienen relación con el costo de la plataforma.',
        2: 'Justamente definen cuándo hay que despertar a la guardia.',
        3: 'Detectan consumo en curso, no predicen.',
      },
    },
    {
      p: '¿Por qué los reintentos pueden empeorar una caída?',
      opciones: [
        'Si son inmediatos, multiplican el tráfico justo cuando el servicio está débil',
        'Porque consumen ancho de banda del cliente',
        'Porque generan logs duplicados',
        'Porque violan la idempotencia por definición',
      ],
      correcta: 0,
      porQue: 'Hay que usar espera exponencial con variación aleatoria: sin la variación, todos los clientes reintentan en el mismo instante y generan una onda que vuelve a tumbar el servicio en cuanto se levanta.',
      porQueNo: {
        1: 'Es un costo menor comparado con tumbar el servicio.',
        2: 'Es una molestia, no la causa del colapso.',
        3: 'La idempotencia es una propiedad de la operación, no algo que el reintento viole.',
      },
    },
    {
      p: '¿Qué errores NO conviene reintentar?',
      opciones: [
        'Los 4xx de cliente: 400, 401, 403, 404 — reintentar no los va a cambiar',
        'Los 500 y 502',
        'Los 429',
        'Los errores de red',
      ],
      correcta: 0,
      porQue: 'La petición está mal o falta permiso: es una condición estable. El caso delicado es el timeout, porque no sabés si la operación se ejecutó — de ahí la necesidad de idempotencia.',
      porQueNo: {
        1: 'Suelen ser transitorios: son el caso típico de reintento.',
        2: 'Se reintenta respetando el Retry-After que manda el servidor.',
        3: 'Se reintentan, con el cuidado de la idempotencia.',
      },
    },
    {
      p: 'Además de proteger al servicio que falla, ¿qué aporta un cortacircuitos?',
      opciones: [
        'Que vos falles rápido: sin él, cada petición espera el timeout completo',
        'Que se reintente automáticamente sin límite',
        'Que se cachee la última respuesta buena',
        'Que se escale el servicio caído',
      ],
      correcta: 0,
      porQue: 'Con el circuito abierto la llamada falla al instante sin salir a la red, así que podés ir al plan B sin consumir tiempo ni procesos.',
      porQueNo: {
        1: 'Hace lo contrario: deja de llamar mientras está abierto.',
        2: 'Es una técnica complementaria, no lo que hace el cortacircuitos.',
        3: 'No tiene control sobre el servicio ajeno.',
      },
    },
    {
      p: '¿Qué es la degradación elegante?',
      opciones: [
        'Funcionar peor en vez de no funcionar: caché vieja, valor genérico, la función sin ese adorno',
        'Apagar la aplicación de forma ordenada',
        'Reducir la calidad de las imágenes bajo carga',
        'Escalar hacia abajo cuando baja el tráfico',
      ],
      correcta: 0,
      porQue: 'La pregunta que ordena el diseño es: ¿qué es lo mínimo aceptable que puedo mostrar si esta dependencia no está? Servir datos de ayer suele ser mucho mejor que servir un error.',
      porQueNo: {
        1: 'Eso es apagado ordenado, otra cosa.',
        2: 'Es un caso particular, no la definición.',
        3: 'Eso es autoescalado, no degradación.',
      },
    },
    {
      p: '¿Cuál es el orden correcto durante un incidente?',
      opciones: [
        'Detectar, mitigar, comunicar, investigar, aprender',
        'Detectar, investigar, entender, arreglar, comunicar',
        'Comunicar, investigar, mitigar, aprender',
        'Investigar, escribir el postmortem, después mitigar',
      ],
      correcta: 0,
      porQue: 'Mitigar va antes que entender: con usuarios afectados, revertir primero y entender después casi siempre es lo correcto. Investigar con el producto caído es el error de orden más común.',
      porQueNo: {
        1: 'Investigar antes de mitigar deja a los usuarios afectados más tiempo.',
        2: 'Comunicar es importante pero no antes de devolver el servicio.',
        3: 'El postmortem es siempre posterior a la resolución.',
      },
    },
    {
      p: 'De la cronología de un incidente salen dos números clave. ¿Qué indican?',
      opciones: [
        'Tardanza en detectar apunta a la observabilidad; tardanza en mitigar, a la vuelta atrás',
        'Ambos indican falta de personal',
        'Ambos miden la calidad del código',
        'Solo sirven para reportar al cliente',
      ],
      correcta: 0,
      porQue: 'Son dos arreglos completamente distintos, y la bitácora escrita durante el incidente es lo que te dice cuál necesitás. Por eso se anota con marcas de tiempo mientras ocurre.',
      porQueNo: {
        1: 'Pueden mejorarse con herramientas y automatización, no necesariamente con más gente.',
        2: 'Miden la capacidad de detectar y responder, no la calidad del código.',
        3: 'Su valor principal es interno: decidir qué mejorar.',
      },
    },
    {
      p: '¿Por qué los postmortems son sin culpables?',
      opciones: [
        'Si se buscan culpables, la gente deja de reportar y los incidentes se ocultan',
        'Porque nunca hay responsables individuales',
        'Por una cuestión de cortesía en el equipo',
        'Porque lo exigen las normas de la industria',
      ],
      correcta: 0,
      porQue: 'Se pierde la única fuente de información que hace mejorar el sistema. La pregunta correcta es qué permitió que ese error llegara a producción: si la cadena de porqués termina en una persona, faltó un porqué.',
      porQueNo: {
        1: 'A veces los hay; el punto es que buscarlos es contraproducente.',
        2: 'Es una razón práctica, no de cortesía.',
        3: 'Es una práctica adoptada por su efecto, no por una norma.',
      },
    },
  ],
});
