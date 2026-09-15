/* ==========================================================================
   Arquitectura · Módulo 05 — Monolito, monolito modular y microservicios
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'arquitectura',
  id: 'm05',
  titulo: 'Monolito, monolito modular y microservicios',
  fuentes: ['fowler', 'kubernetes', '12factor'],

  intro:
    '<p>Es la decisión más cara del rubro y la que más se toma por moda. Hay equipos de tres personas con doce ' +
    'servicios, y empresas grandes que atienden millones de usuarios con un monolito.</p>' +
    '<p>Este módulo da el <b>criterio</b>: qué problema resuelve realmente partir un sistema, cuánto cuesta ' +
    '—porque el costo es mucho mayor de lo que parece—, y cómo construir un monolito que se pueda partir ' +
    '<b>después</b>, cuando y si hace falta.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Las tres opciones y qué resuelve cada una',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> los microservicios <b>no resuelven un problema
técnico: resuelven un problema organizativo</b>. Si tu equipo cabe en una mesa, casi seguro no tenés ese
problema.</div>

<h4>Las tres formas</h4>

<p><b>Monolito.</b> Todo el código en un proyecto, un despliegue, una base. Es el default y funciona muy bien
hasta escalas que sorprenden.</p>

<p><b>Monolito modular.</b> Un solo despliegue, pero el código está organizado en módulos con límites reales
que se verifican. <b>El punto medio, y la respuesta correcta la mayoría de las veces.</b></p>

<p><b>Microservicios.</b> Varios servicios con despliegue, base y ciclo de vida independientes, comunicándose
por red.</p>

<h4>Qué resuelve cada uno</h4>
<table>
<tr><th>Problema</th><th>Solución</th></tr>
<tr><td>El código está desordenado</td><td><b>Módulos</b>, no microservicios</td></tr>
<tr><td>Los despliegues son lentos</td><td>Arreglar el pipeline</td></tr>
<tr><td>Una parte necesita escalar distinto</td><td>Separar <b>esa</b> parte</td></tr>
<tr><td>Un equipo bloquea a otro para desplegar</td><td><b>Microservicios</b> — este es el caso real</td></tr>
<tr><td>Una parte necesita otro lenguaje</td><td>Separar esa parte</td></tr>
<tr><td>Una parte tiene requisitos de cumplimiento distintos</td><td>Separar esa parte</td></tr>
</table>

<div class="aviso"><strong>Fijate que solo dos filas justifican microservicios de verdad</strong>, y las dos
son organizativas o de restricciones externas — no de calidad de código. <b>Un monolito desordenado partido en
servicios da como resultado un desorden distribuido</b>, que es estrictamente peor: ahora los mismos problemas
tienen latencia de red y fallas parciales.</div>

<h4>El error de secuencia</h4>
<p>La secuencia que funciona es siempre la misma:</p>
<pre><code>1 · monolito
2 · monolito MODULAR (límites reales, verificados)
3 · extraer UN módulo cuando haya un motivo concreto
4 · repetir solo si vuelve a haber motivo</code></pre>
<p>Empezar en el paso 3 sin haber pasado por el 2 es la forma más común de terminar con un sistema distribuido
que nadie puede cambiar: los límites nunca se probaron, así que están en el lugar equivocado — y ahora
moverlos implica coordinar despliegues.</p>
`,

      tecnico: `
<h4>Comparación honesta</h4>
<table>
<tr><th></th><th>Monolito</th><th>Modular</th><th>Microservicios</th></tr>
<tr><td>Complejidad operativa</td><td>Baja</td><td>Baja</td><td><b>Alta</b></td></tr>
<tr><td>Despliegue</td><td>Uno</td><td>Uno</td><td>N, coordinados</td></tr>
<tr><td>Transacciones</td><td>Simples</td><td>Simples</td><td><b>No existen</b> entre servicios</td></tr>
<tr><td>Depurar</td><td>Una traza</td><td>Una traza</td><td>Trazas distribuidas</td></tr>
<tr><td>Escalar por partes</td><td>No</td><td>No</td><td>Sí</td></tr>
<tr><td>Equipos independientes</td><td>No</td><td>Parcial</td><td><b>Sí</b></td></tr>
<tr><td>Mover un límite</td><td>Refactor</td><td>Refactor</td><td><b>Coordinación entre equipos</b></td></tr>
<tr><td>Costo de infraestructura</td><td>Bajo</td><td>Bajo</td><td>Alto</td></tr>
</table>

<div class="dato"><strong>La fila de "mover un límite" es la más subestimada de la tabla.</strong> En un
monolito modular, descubrir que el límite entre dos módulos está mal puesto es un refactor de una tarde. ' +
En microservicios es una migración de datos, dos despliegues coordinados y un período de compatibilidad hacia
atrás. <b>Y los límites casi siempre están mal la primera vez</b>, porque se definen cuando menos se conoce el
dominio.</div>

<h4>Lo que desaparece al partir</h4>
<p>Tres cosas que en un monolito son gratis y que hay que reconstruir a mano:</p>

<p><b>1 · Las transacciones.</b> "Marcar pedido pagado y descontar stock" es una transacción en un monolito. ' +
En dos servicios se convierte en un patrón de saga con compensación — y hay un momento donde el sistema está
inconsistente.</p>

<p><b>2 · La consistencia inmediata.</b> El pedido existe pero el servicio de facturación todavía no se enteró.
La interfaz tiene que contemplar ese estado intermedio.</p>

<p><b>3 · La llamada barata.</b> Una función pasa a ser una petición de red: puede fallar, puede tardar, puede
ejecutarse dos veces.</p>

<div class="dato"><strong>Ese tercer punto genera el error más común de sistemas distribuidos
nuevos:</strong> tratar una llamada de red como si fuera una función local, sin timeout, sin reintento y sin
idempotencia. El sistema funciona perfecto en desarrollo —donde nada falla— y en producción produce cobros
duplicados la primera vez que hay un timeout.</div>

<h4>Escalas reales, para calibrar</h4>
<table>
<tr><th>Situación</th><th>Recomendación</th></tr>
<tr><td>1-5 desarrolladores</td><td><b>Monolito modular.</b> Sin excepciones razonables</td></tr>
<tr><td>5-15, un producto</td><td>Monolito modular con límites verificados</td></tr>
<tr><td>15-50, varios productos</td><td>Modular, o pocos servicios por producto</td></tr>
<tr><td>50+, equipos autónomos</td><td>Ahí sí, microservicios por equipo</td></tr>
</table>

<div class="dato"><strong>Y un dato que ordena la discusión:</strong> un monolito bien hecho en Postgres,
con índices correctos y caché delante, atiende <b>decenas de miles de usuarios activos</b> sin despeinarse. ' +
La enorme mayoría de los productos nunca llega a ese techo — y los que llegan tienen recursos para resolverlo
cuando pasa.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="mn1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <rect x="24" y="30" width="632" height="46" rx="10" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="340" y="52" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="700">
    Los microservicios no resuelven un problema técnico: resuelven un problema ORGANIZATIVO.</text>
  <text x="340" y="69" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11">
    Si tu equipo cabe en una mesa, casi seguro no tenés ese problema.</text>

  <text x="24" y="104" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    QUÉ RESUELVE QUÉ</text>

  <rect x="24" y="116" width="632" height="22" rx="5" fill="#f87171" fill-opacity=".1"/>
  <text x="40" y="131" fill="currentColor" opacity=".72" font-size="10">el código está desordenado</text>
  <text x="380" y="131" fill="#34d399" font-size="10" font-weight="700">→ MÓDULOS, no microservicios</text>

  <rect x="24" y="142" width="632" height="22" rx="5" fill="#f87171" fill-opacity=".1"/>
  <text x="40" y="157" fill="currentColor" opacity=".72" font-size="10">los despliegues son lentos</text>
  <text x="380" y="157" fill="#34d399" font-size="10" font-weight="700">→ arreglar el pipeline</text>

  <rect x="24" y="168" width="632" height="22" rx="5" fill="#fbbf24" fill-opacity=".12"/>
  <text x="40" y="183" fill="currentColor" opacity=".72" font-size="10">una parte necesita escalar distinto</text>
  <text x="380" y="183" fill="#fbbf24" font-size="10" font-weight="700">→ separar ESA parte</text>

  <rect x="24" y="194" width="632" height="22" rx="5" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.2"/>
  <text x="40" y="209" fill="currentColor" font-size="10" font-weight="700">un equipo bloquea a otro para desplegar</text>
  <text x="380" y="209" fill="#7c5cff" font-size="10" font-weight="700">→ MICROSERVICIOS ← el caso real</text>

  <rect x="24" y="226" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="247" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    Un monolito desordenado partido en servicios da un DESORDEN DISTRIBUIDO: los mismos problemas, con latencia y fallas parciales.</text>

  <text x="24" y="284" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA SECUENCIA QUE FUNCIONA</text>

  <rect x="24" y="296" width="140" height="40" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.3"/>
  <text x="94" y="321" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">1 · monolito</text>
  <line x1="168" y1="316" x2="186" y2="316" stroke="currentColor" stroke-width="1.4" marker-end="url(#mn1)"/>

  <rect x="190" y="296" width="180" height="40" rx="8" fill="#34d399" fill-opacity=".28" stroke="#34d399" stroke-width="1.8"/>
  <text x="280" y="315" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">2 · monolito MODULAR</text>
  <text x="280" y="329" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8.5">límites reales, verificados</text>
  <line x1="374" y1="316" x2="392" y2="316" stroke="currentColor" stroke-width="1.4" marker-end="url(#mn1)"/>

  <rect x="396" y="296" width="180" height="40" rx="8" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="486" y="315" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">3 · extraer UN módulo</text>
  <text x="486" y="329" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8.5">con un motivo concreto</text>

  <rect x="24" y="346" width="632" height="40" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="364" fill="#f87171" font-size="11" font-weight="700">Empezar en el paso 3 sin pasar por el 2: los límites nunca se probaron, así que están mal.</text>
  <text x="44" y="380" fill="currentColor" opacity=".72" font-size="10.5">
    Y mover un límite mal puesto pasa de ser un refactor de una tarde a una migración de datos con dos despliegues coordinados.</text>
</svg>`,
        pie: 'Un monolito bien hecho en Postgres atiende decenas de miles de usuarios activos sin despeinarse.',
      },

      entrevista: [
        { p: '¿Qué problema resuelven realmente los microservicios?',
          r: 'Un problema <b>organizativo</b>, no técnico: que un equipo bloquee a otro para desplegar. También sirven para restricciones concretas — ' +
             'una parte que necesita escalar muy distinto, otro lenguaje, o requisitos de cumplimiento propios. ' +
             'Lo que <b>no</b> resuelven es el desorden: un monolito desordenado partido en servicios da un <b>desorden distribuido</b>, ' +
             'que es estrictamente peor porque ahora los mismos problemas tienen latencia de red y fallas parciales.' },

        { p: '¿Cuál es la secuencia correcta y por qué?',
          r: 'Monolito → monolito <b>modular</b> con límites reales y verificados → extraer <b>un</b> módulo cuando haya un motivo concreto → repetir ' +
             'solo si vuelve a haberlo. Saltear el segundo paso es la forma más común de terminar con un sistema distribuido que nadie puede cambiar: ' +
             '<b>los límites nunca se probaron, así que están en el lugar equivocado</b> — se definieron cuando menos se conocía el dominio— ' +
             'y ahora moverlos implica migrar datos y coordinar despliegues en vez de un refactor de una tarde.' },

        { p: '¿Qué desaparece cuando partís un sistema?',
          r: 'Tres cosas que en un monolito son gratis. Las <b>transacciones</b>: "marcar pagado y descontar stock" pasa a ser una saga con ' +
             'compensación, con un momento en que el sistema está inconsistente. La <b>consistencia inmediata</b>: el pedido existe pero facturación ' +
             'todavía no se enteró, y la interfaz tiene que contemplar ese estado. Y la <b>llamada barata</b>: una función pasa a ser una petición que ' +
             'puede fallar, tardar o ejecutarse dos veces — de ahí el error clásico de tratarla como local y producir cobros duplicados ' +
             'el primer día que hay un timeout.' },

        { p: '¿A partir de qué tamaño de equipo tiene sentido partir?',
          r: 'Con uno a cinco desarrolladores, monolito modular sin excepciones razonables. Hasta quince y un solo producto, también modular con ' +
             'límites verificados. Recién con equipos <b>autónomos</b> —del orden de cincuenta personas o varios productos con ciclos independientes— ' +
             'los microservicios devuelven más de lo que cuestan. Y un dato que ordena la discusión: un monolito bien hecho en Postgres, ' +
             'con índices correctos y caché delante, atiende <b>decenas de miles de usuarios activos</b>; la mayoría de los productos nunca llega ' +
             'a ese techo.' },
      ],

      practica: `
<h4>El cuestionario antes de partir</h4>
<pre><code>1 · ¿Hay equipos que se bloquean entre sí al desplegar?
      No → no partas. El problema es otro.

2 · ¿Alguna parte necesita escalar 10× más que el resto?
      No → no partas.

3 · ¿Alguna parte necesita otro lenguaje o runtime por una razón real?
      No → no partas.

4 · ¿Alguna parte tiene requisitos de cumplimiento distintos?
      No → no partas.

5 · ¿Los módulos actuales tienen límites claros y verificados?
      No → arreglá ESO primero. Partir ahora congela los límites malos.</code></pre>

<div class="aviso"><strong>La pregunta 5 es la más importante y la que más se saltea.</strong> Partir un
sistema <b>congela</b> los límites actuales: lo que en un monolito se mueve con un refactor, entre servicios
requiere migrar datos y coordinar despliegues. Si los límites todavía no están probados, partir es apostar a
que la primera versión estaba bien.</div>

<h4>El costo operativo, en concreto</h4>
<pre><code>Monolito                     Microservicios (5 servicios)
──────────────────────────   ─────────────────────────────
1 pipeline                   5 pipelines
1 despliegue                 5 despliegues + orden entre ellos
1 registro de logs           logs correlacionados por traza
1 base                       5 bases + consistencia entre ellas
1 conjunto de secretos       5 conjuntos
depurar: una traza           depurar: traza distribuida
"funciona en local"          local: docker-compose con 5 servicios</code></pre>

<div class="dato"><strong>La última línea es la que más frena al equipo día a día.</strong> Levantar el
entorno local pasa de "un comando" a "cinco servicios, sus bases y sus dependencias" — y cada persona nueva
pierde su primer día en eso. Es un costo permanente que no aparece en ninguna discusión de arquitectura.</div>

<h4>Alternativas antes de partir</h4>
<table>
<tr><th>Síntoma</th><th>Alternativa</th></tr>
<tr><td>Los despliegues tardan 40 minutos</td><td>Arreglar el pipeline: caché, paralelizar</td></tr>
<tr><td>Un trabajo pesado bloquea las peticiones</td><td>Moverlo a una cola (Inngest)</td></tr>
<tr><td>Una consulta satura la base</td><td>Índice, caché o réplica de lectura</td></tr>
<tr><td>El código está enredado</td><td>Módulos con límites verificados</td></tr>
<tr><td>Los tests tardan 20 minutos</td><td>Paralelizar y correr solo lo afectado</td></tr>
</table>
<p>Cada una de estas cuesta días. Partir el sistema cuesta meses y es difícil de revertir.</p>
`,

      errores: [
        { mito: 'Los microservicios escalan mejor.',
          realidad: 'Escalan <b>por partes</b>, que solo importa si alguna parte necesita escalar muy distinto. Un monolito escala horizontalmente ' +
                    'poniendo más instancias, y eso alcanza en la enorme mayoría de los casos.' },

        { mito: 'Mi código está desordenado, lo parto en servicios.',
          realidad: 'Vas a tener un <b>desorden distribuido</b>: los mismos problemas más latencia de red y fallas parciales. ' +
                    'El desorden se arregla con módulos y límites verificados, no con despliegues separados.' },

        { mito: 'Partimos ahora y ajustamos los límites después.',
          realidad: 'Partir <b>congela</b> los límites. Lo que era un refactor de una tarde pasa a ser migración de datos y despliegues coordinados. ' +
                    'Y los límites casi siempre están mal la primera vez, porque se definen cuando menos se conoce el dominio.' },

        { mito: 'El costo extra de microservicios es solo infraestructura.',
          realidad: 'El costo permanente es <b>operativo y cotidiano</b>: cinco pipelines, logs correlacionados, transacciones que hay que reconstruir, ' +
                    'y un entorno local que pasa de un comando a cinco servicios con sus bases.' },
      ],

      glosario: [
        { t: 'Monolito', d: 'Un proyecto, un despliegue, una base.' },
        { t: 'Monolito modular', d: 'Un despliegue con límites internos reales y verificados.' },
        { t: 'Microservicios', d: 'Servicios con despliegue, base y ciclo de vida independientes.' },
        { t: 'Desorden distribuido', d: 'El resultado de partir un sistema desordenado.' },
        { t: 'Saga', d: 'Secuencia de pasos con compensación, que reemplaza a una transacción.' },
        { t: 'Límite congelado', d: 'Frontera que pasa a ser cara de mover al separar el despliegue.' },
        { t: 'Costo operativo', d: 'Pipelines, entornos, logs y depuración que se multiplican por servicio.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'El costo real de lo distribuido',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> cuando una llamada cruza la red, deja de ser
"llamar a una función" y pasa a ser <b>enviar un mensaje que puede no llegar, llegar tarde, o llegar dos
veces</b>.</div>

<h4>Las falacias de la computación distribuida</h4>
<p>Son suposiciones falsas que todo el mundo hace sin darse cuenta:</p>
<ol>
<li>La red es confiable. <b>No.</b></li>
<li>La latencia es cero. <b>No.</b></li>
<li>El ancho de banda es infinito. <b>No.</b></li>
<li>La red es segura. <b>No.</b></li>
<li>La topología no cambia. <b>Cambia.</b></li>
</ol>

<div class="aviso"><strong>La que más daño hace en la práctica es la segunda.</strong> Una función local tarda
microsegundos; una llamada de red, milisegundos — mil veces más. Un endpoint que hacía diez llamadas internas
sin costo, al partirse, hace diez peticiones de red: pasa de 5 ms a <b>medio segundo</b>. Y el código se ve
exactamente igual.</div>

<h4>Lo que hay que agregar en cada llamada</h4>
<p>En un monolito, llamar a otro módulo es esto:</p>
<pre><code>const cliente = await clientes.porId(id);</code></pre>
<p>Entre servicios, lo mínimo responsable es:</p>
<pre><code>const cliente = await conReintento(
  conTimeout(
    () =&gt; fetch(\`\${URL_CLIENTES}/clientes/\${id}\`, { headers: { 'x-request-id': trazaId } }),
    3000,
  ),
  { max: 3, esTransitorio },
);
if (!cliente.ok) { /* ¿qué hago? ¿fallo? ¿sigo sin el cliente? */ }</code></pre>

<p>Y esa última línea es la pregunta importante: <b>qué hace tu sistema cuando el otro no responde</b>.
En un monolito esa pregunta no existe.</p>

<h4>La consistencia, que es el costo mayor</h4>
<p>En un monolito: guardar pedido y descontar stock es una transacción. O pasan las dos o ninguna.</p>
<p>En dos servicios: no hay transacción posible. Hay que elegir entre dejar el sistema inconsistente un rato,
o construir un mecanismo de compensación — y hay un intervalo donde el pedido existe y el stock no bajó.</p>
`,

      tecnico: `
<h4>Saga: la transacción que hay que construir a mano</h4>
<pre><code>// Cada paso tiene su compensación
const pasos = [
  { hacer: () =&gt; pedidos.crear(datos),        deshacer: (r) =&gt; pedidos.cancelar(r.id) },
  { hacer: (r) =&gt; stock.reservar(r.items),    deshacer: (r) =&gt; stock.liberar(r.reservaId) },
  { hacer: (r) =&gt; pagos.cobrar(r.total),      deshacer: (r) =&gt; pagos.reembolsar(r.cobroId) },
];

const hechos = [];
try {
  for (const paso of pasos) hechos.push({ paso, resultado: await paso.hacer(ctx) });
} catch (e) {
  for (const h of hechos.reverse()) await h.paso.deshacer(h.resultado);
  throw e;
}</code></pre>

<div class="dato"><strong>Ese código esconde dos problemas serios.</strong> Primero: <b>la compensación
también puede fallar</b>, y entonces el sistema queda a medias sin nadie que lo arregle — hace falta
persistir el estado de la saga y reintentar. Segundo: <b>compensar no es lo mismo que revertir</b>. Reembolsar
no borra el cobro: deja dos movimientos en el extracto del cliente, y eso puede generar una consulta a
soporte. En un monolito, un <code>ROLLBACK</code> no deja rastro.</div>

<h4>Idempotencia: obligatoria, no opcional</h4>
<pre><code>// Un timeout NO significa que la operación no ocurrió: significa que no sabés.
// Sin idempotencia, el reintento cobra dos veces.

export async function cobrar(pedidoId: string, monto: number, clave: string) {
  const existente = await db.operaciones.porClave(clave);
  if (existente) return existente.resultado;      // ya se hizo: devolver lo mismo

  const resultado = await pasarela.cobrar(monto, { idempotencyKey: clave });
  await db.operaciones.registrar(clave, resultado);
  return resultado;
}</code></pre>

<div class="dato"><strong>La clave de idempotencia la genera <b>quien llama</b> y la reutiliza en todos los
reintentos.</strong> Si la genera el receptor, cada reintento produce una clave nueva y no sirve de nada. ' +
Es un detalle de tres líneas que decide si el sistema cobra una o tres veces.</div>

<h4>Observabilidad distribuida</h4>
<table>
<tr><th>Monolito</th><th>Distribuido</th></tr>
<tr><td>Una pila de llamadas</td><td>Traza que cruza servicios</td></tr>
<tr><td>Un archivo de logs</td><td>Logs correlacionados por identificador</td></tr>
<tr><td>Un proceso que medir</td><td>Métricas por servicio + entre servicios</td></tr>
<tr><td>"Está lento"</td><td>"¿Cuál de los seis está lento?"</td></tr>
</table>

<div class="dato"><strong>Sin propagación del identificador de traza, un sistema distribuido es
prácticamente indepurable.</strong> Y basta con que <b>un</b> servicio no reenvíe el encabezado para que la
traza se corte justo antes de la parte profunda, que es donde suele estar el problema. ' +
Es la primera cosa a montar, antes que cualquier otra pieza de observabilidad.</div>

<h4>Fallas parciales: el modo de falla nuevo</h4>
<p>En un monolito, el sistema está arriba o abajo. En uno distribuido aparece un tercer estado: ' +
<b>parcialmente roto</b>.</p>
<pre><code>· El servicio de pedidos anda, el de facturación no
    → se pueden crear pedidos, no facturar

· El de clientes está lento
    → si no hay timeout, TODO se pone lento por contagio

· Un servicio devuelve datos viejos tras un reinicio
    → inconsistencias que aparecen y desaparecen solas</code></pre>

<div class="dato"><strong>El segundo caso es el modo de falla más traicionero de los sistemas
distribuidos.</strong> Un servicio lento —no caído— consume las conexiones de todos los que lo llaman, y esos
a su vez se ponen lentos para quienes los llaman. <b>Sin timeouts y cortacircuitos, la lentitud de un servicio
secundario tumba el sistema entero.</b></div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="ds1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA MISMA LÍNEA, DOS MUNDOS</text>

  <rect x="24" y="34" width="304" height="88" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="176" y="54" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">MONOLITO</text>
  <text x="44" y="76" fill="currentColor" opacity=".75" font-size="10" font-family="monospace">await clientes.porId(id)</text>
  <text x="44" y="98" fill="#34d399" font-size="10.5" font-weight="700">microsegundos · no falla · transaccional</text>
  <text x="44" y="114" fill="currentColor" opacity=".6" font-size="9.5">“¿qué hago si no responde?” no existe como pregunta</text>

  <rect x="352" y="34" width="304" height="88" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="504" y="54" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">DISTRIBUIDO</text>
  <text x="372" y="74" fill="currentColor" opacity=".7" font-size="9.5" font-family="monospace">conReintento(conTimeout(fetch(...)))</text>
  <text x="372" y="94" fill="#f87171" font-size="10.5" font-weight="700">milisegundos (×1000) · puede fallar · sin transacción</text>
  <text x="372" y="112" fill="#f87171" font-size="10" font-weight="700">y hay que decidir qué hacer si el otro no responde</text>

  <rect x="24" y="132" width="632" height="34" rx="8" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="153" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">
    Un endpoint con 10 llamadas internas gratis pasa de 5 ms a medio segundo al partirse. Y el código se ve IGUAL.</text>

  <line x1="24" y1="186" x2="656" y2="186" stroke="currentColor" opacity=".18"/>

  <text x="24" y="210" fill="#f87171" font-size="12" font-weight="700">
    EL MODO DE FALLA NUEVO: PARCIALMENTE ROTO</text>

  <rect x="24" y="222" width="632" height="70" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="242" fill="currentColor" opacity=".72" font-size="10.5">· pedidos anda, facturación no → se crean pedidos que no se pueden facturar</text>
  <text x="44" y="262" fill="#f87171" font-size="11" font-weight="700">· clientes está LENTO (no caído) → consume las conexiones de todos los que lo llaman…</text>
  <text x="44" y="278" fill="#f87171" font-size="11" font-weight="700">  …y esos se ponen lentos para quienes los llaman. La lentitud de un servicio secundario tumba TODO.</text>

  <rect x="24" y="300" width="304" height="86" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="176" y="320" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">SAGA ≠ TRANSACCIÓN</text>
  <text x="44" y="340" fill="currentColor" opacity=".72" font-size="10">La compensación también puede fallar.</text>
  <text x="44" y="358" fill="#7c5cff" font-size="10.5" font-weight="700">Y compensar no es revertir: reembolsar</text>
  <text x="44" y="374" fill="#7c5cff" font-size="10.5" font-weight="700">deja DOS movimientos en el extracto.</text>

  <rect x="352" y="300" width="304" height="86" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="504" y="320" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">IDEMPOTENCIA: OBLIGATORIA</text>
  <text x="372" y="340" fill="currentColor" opacity=".72" font-size="10">Un timeout no dice que no ocurrió: dice que no sabés.</text>
  <text x="372" y="358" fill="#34d399" font-size="10.5" font-weight="700">La clave la genera QUIEN LLAMA y la reusa</text>
  <text x="372" y="374" fill="#34d399" font-size="10.5" font-weight="700">en todos los reintentos. Si no, no sirve de nada.</text>
</svg>`,
        pie: 'La pregunta “¿qué hago si el otro no responde?” no existe en un monolito y hay que responderla en cada llamada.',
      },

      entrevista: [
        { p: '¿Cuál de las falacias de lo distribuido hace más daño en la práctica?',
          r: 'La de que <b>la latencia es cero</b>. Una función local tarda microsegundos y una llamada de red milisegundos: <b>mil veces más</b>. ' +
             'Un endpoint que hacía diez llamadas internas gratis, al partirse hace diez peticiones de red y pasa de 5 ms a medio segundo — ' +
             'y el código se ve exactamente igual, así que nadie lo nota hasta que se mide. ' +
             'La otra que duele es "la red es confiable", porque obliga a responder en cada llamada la pregunta que en un monolito no existe: ' +
             '<b>qué hago si el otro no responde</b>.' },

        { p: '¿Por qué una saga no es equivalente a una transacción?',
          r: 'Por dos motivos. Primero, <b>la compensación también puede fallar</b>: si el reembolso no sale, el sistema queda a medias y nadie lo ' +
             'arregla solo — hay que persistir el estado de la saga y reintentar. Segundo, y más importante: <b>compensar no es revertir</b>. ' +
             'Un <code>ROLLBACK</code> no deja rastro; un reembolso deja <b>dos movimientos en el extracto del cliente</b>, con la consulta a soporte ' +
             'que eso genera. La saga reconstruye el efecto, no el estado anterior.' },

        { p: '¿Por qué la idempotencia es obligatoria en un sistema distribuido?',
          r: 'Porque un <b>timeout no significa que la operación no ocurrió</b>: significa que no sabés. Sin idempotencia, el reintento cobra dos veces. ' +
             'Y hay un detalle que decide si funciona o no: <b>la clave la genera quien llama</b> y la reutiliza en todos los reintentos. ' +
             'Si la genera el receptor, cada reintento produce una clave nueva y el mecanismo no sirve para nada.' },

        { p: '¿Cuál es el modo de falla más traicionero de un sistema distribuido?',
          r: 'Un servicio <b>lento, no caído</b>. Consume las conexiones de todos los que lo llaman, y esos a su vez se ponen lentos para quienes los ' +
             'llaman, hasta que la lentitud de un servicio secundario tumba el sistema entero. Un servicio caído es fácil: falla rápido y se maneja. ' +
             'Uno lento se propaga por contagio. Por eso <b>timeouts y cortacircuitos no son opcionales</b>: son lo que corta esa cadena.' },
      ],

      practica: `
<h4>Cliente entre servicios, con lo mínimo responsable</h4>
<pre><code>export function clienteDeServicio(base: string, nombre: string) {
  const corte = crearCortacircuitos({ umbralFallas: 5, ventanaMs: 30_000 });

  return async function pedir&lt;T&gt;(ruta: string, opciones: RequestInit = {}): Promise&lt;T&gt; {
    return corte.ejecutar(async () =&gt; {
      const ctrl = new AbortController();
      const t = setTimeout(() =&gt; ctrl.abort(), 3000);
      try {
        const r = await fetch(\`\${base}\${ruta}\`, {
          ...opciones,
          signal: ctrl.signal,
          headers: {
            ...opciones.headers,
            'x-request-id': contextoActual().trazaId,   // ← propagar SIEMPRE
          },
        });
        if (!r.ok) throw new ErrorServicio(nombre, r.status, await r.text());
        return r.json() as Promise&lt;T&gt;;
      } finally { clearTimeout(t); }
    });
  };
}</code></pre>

<div class="aviso"><strong>Si un servicio no reenvía <code>x-request-id</code>, la traza se corta ahí</strong> —
y justo perdés visibilidad sobre la parte más profunda de la cascada, que es donde suele estar el problema.
Propagar el identificador es lo primero que hay que montar en un sistema distribuido, antes que cualquier otra
pieza de observabilidad.</div>

<h4>Saga persistida, que sobrevive a un reinicio</h4>
<pre><code>-- Sin esto, un reinicio en la mitad deja la saga colgada para siempre
create table sagas (
  id uuid primary key,
  tipo text not null,
  estado text not null,          -- 'en_curso' | 'compensando' | 'ok' | 'fallida'
  paso_actual int not null default 0,
  contexto jsonb not null,
  creada_en timestamptz not null default now(),
  actualizada_en timestamptz not null default now()
);

-- Y un trabajo periódico que retome las que quedaron a medias
select * from sagas
 where estado in ('en_curso','compensando')
   and actualizada_en &lt; now() - interval '5 minutes';</code></pre>

<h4>Idempotencia de punta a punta</h4>
<pre><code>// Quien llama genera la clave, UNA vez, y la reusa en cada reintento
const clave = \`cobro-\${pedidoId}\`;

await conReintento(() =&gt; pagos.cobrar({ pedidoId, monto, claveIdempotencia: clave }));

// Del lado del receptor: una restricción única hace el trabajo pesado
create unique index on operaciones (clave_idempotencia);</code></pre>

<h4>Checklist de una llamada entre servicios</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Timeout explícito, menor que el del que llama</td></tr>
<tr><td>☐</td><td>Reintentos solo en errores transitorios, con espera creciente</td></tr>
<tr><td>☐</td><td>Cortacircuitos, para no propagar la lentitud</td></tr>
<tr><td>☐</td><td>Identificador de traza propagado</td></tr>
<tr><td>☐</td><td>Operaciones con efectos, idempotentes</td></tr>
<tr><td>☐</td><td>Definido qué hacer si el otro no responde</td></tr>
<tr><td>☐</td><td>Contrato versionado y compatible hacia atrás</td></tr>
</table>
`,

      errores: [
        { mito: 'Una llamada entre servicios es como llamar a una función.',
          realidad: 'Es <b>mil veces más lenta</b>, puede fallar, puede ejecutarse dos veces y no participa de ninguna transacción. ' +
                    'Y obliga a responder algo que en un monolito no existe: qué hacés si el otro no responde.' },

        { mito: 'Con una saga tengo el equivalente a una transacción.',
          realidad: 'La <b>compensación también puede fallar</b>, y compensar no es revertir: un reembolso deja dos movimientos en el extracto. ' +
                    'Además, sin persistir el estado de la saga, un reinicio la deja colgada para siempre.' },

        { mito: 'Agrego idempotencia si aparecen duplicados.',
          realidad: 'Los duplicados aparecen el primer día que hay un timeout, y para entonces ya se cobró dos veces. ' +
                    'Y la clave tiene que generarla <b>quien llama</b>: si la genera el receptor, cada reintento produce una nueva y no sirve.' },

        { mito: 'Un servicio caído es el peor caso.',
          realidad: 'El peor es uno <b>lento</b>: consume las conexiones de todos los que lo llaman y la lentitud se propaga por contagio hasta tumbar ' +
                    'el sistema entero. Un servicio caído falla rápido y es fácil de manejar.' },
      ],

      glosario: [
        { t: 'Falacias de lo distribuido', d: 'Suposiciones falsas sobre la red que todos hacemos sin notarlo.' },
        { t: 'Saga', d: 'Secuencia de pasos con compensación que reemplaza a una transacción.' },
        { t: 'Compensación', d: 'Operación inversa que corrige el efecto, sin borrar el rastro.' },
        { t: 'Idempotencia', d: 'Que repetir una operación produzca el mismo resultado.' },
        { t: 'Clave de idempotencia', d: 'Identificador que genera quien llama y reutiliza en los reintentos.' },
        { t: 'Falla parcial', d: 'Estado en que unas partes funcionan y otras no.' },
        { t: 'Contagio de lentitud', d: 'Propagación de la lentitud de un servicio a todos los que lo llaman.' },
        { t: 'Traza distribuida', d: 'Seguimiento de una petición a través de varios servicios.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Monolito modular: cómo se hace bien',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un monolito modular es <b>un solo despliegue con
límites que se verifican solos</b>. Toda la disciplina de los microservicios, sin ninguno de sus costos
operativos.</div>

<h4>Las cuatro reglas</h4>
<ol>
<li><b>Un módulo por área del negocio</b>, no por tipo técnico.</li>
<li><b>Cada módulo tiene una puerta de adelante</b>: un índice que define qué es público.</li>
<li><b>Nadie importa el interior de otro módulo.</b> Y esto se verifica automáticamente.</li>
<li><b>Cada módulo es dueño de sus tablas.</b> Los demás no las consultan directamente.</li>
</ol>

<div class="aviso"><strong>La cuarta es la que casi nadie aplica y la que más determina si el módulo se puede
extraer algún día.</strong> Si el módulo de reportes hace <code>select</code> sobre la tabla de pedidos,
extraer pedidos a un servicio aparte se vuelve imposible sin reescribir reportes. <b>Y es la más fácil de
violar</b>, porque hacer un join es más cómodo que pedirle los datos al otro módulo.</div>

<h4>La estructura</h4>
<pre><code>src/
  modulos/
    pedidos/
      index.ts          ← lo único importable desde afuera
      servicio.ts
      reglas.ts
      tipos.ts          internos
      tipos-publicos.ts lo que ven los demás
      tablas.ts         las tablas que este módulo posee
    clientes/
    facturacion/
  compartido/
    ui/  utilidades/  errores/</code></pre>

<h4>Qué gana esto</h4>
<ul>
<li>Un solo despliegue, un pipeline, una base: <b>cero costo operativo extra</b>.</li>
<li>Transacciones normales entre módulos, mientras estén en la misma base.</li>
<li>Depuración con una sola traza.</li>
<li>Y si algún día hace falta partir, <b>los límites ya están probados</b>.</li>
</ul>

<p>Esa última línea es el punto: el monolito modular no es "microservicios para pobres". Es
<b>la etapa que hace que partir sea posible</b> si alguna vez tiene sentido.</p>
`,

      tecnico: `
<h4>Verificar los límites automáticamente</h4>
<pre><code>// eslint.config.js — sin esto, la regla dura tres semanas
export default [
  {
    files: ['src/modulos/*/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@/modulos/*/*'],           // cualquier archivo interno de otro módulo
          message: 'Importá desde el index del módulo, no de sus archivos internos.',
        }],
      }],
    },
  },
];</code></pre>

<div class="dato"><strong>El patrón <code>@/modulos/*/*</code> prohíbe importar cualquier archivo interno pero
permite <code>@/modulos/pedidos</code>, que resuelve al índice.</strong> Con esa única regla, la puerta de
adelante deja de ser una convención y pasa a ser una restricción real que rompe el build.</div>

<h4>Propiedad de las tablas</h4>
<pre><code>// modulos/pedidos/tablas.ts — declaración explícita
export const TABLAS_PEDIDOS = ['pedidos', 'pedido_items', 'pedido_historial'] as const;

// Un test que verifica que nadie más las consulte
test('solo el módulo de pedidos consulta sus tablas', () =&gt; {
  const usos = buscarEnCodigo(/from\\(['"](pedidos|pedido_items)['"]\\)/g);
  const afuera = usos.filter((u) =&gt; !u.archivo.startsWith('src/modulos/pedidos/'));
  expect(afuera).toEqual([]);
});</code></pre>

<div class="dato"><strong>Ese test parece exagerado hasta la primera vez que salva un refactor.</strong> Es
la única forma práctica de detectar la violación más cómoda de todas: alguien necesita un dato de pedidos
desde reportes, hace un join, funciona perfecto, y nadie lo nota en la revisión porque el código es correcto. ' +
Seis meses después hay veinte consultas así y el módulo dejó de ser extraíble.</div>

<h4>Cuando hace falta un join entre módulos</h4>
<pre><code>// ❌ Reportes consulta la tabla de pedidos directamente
const filas = await db.from('pedidos').select('*, clientes(*)');

// ✔ Opción A: el módulo dueño expone lo que hace falta
const datos = await pedidos.resumenParaReportes({ desde, hasta });

// ✔ Opción B: una vista de solo lectura, mantenida por el módulo dueño
create view vista_pedidos_reportes as
  select p.id, p.total, p.creado_en, c.nombre as cliente
    from pedidos p join clientes c on c.id = p.cliente_id;
// reportes puede leer la VISTA, que es un contrato explícito</code></pre>

<div class="dato"><strong>La opción B es la salida pragmática y suele ser la mejor para reportes.</strong> Una
vista es un <b>contrato explícito</b>: el módulo dueño sabe que existe y que no puede romperla sin avisar. ' +
Un join directo es un acoplamiento invisible que nadie registró.</div>

<h4>Comunicación entre módulos</h4>
<table>
<tr><th>Necesidad</th><th>Forma</th></tr>
<tr><td>Un dato puntual</td><td>Llamada a la función pública del otro módulo</td></tr>
<tr><td>Reaccionar a algo que pasó</td><td>Evento en proceso</td></tr>
<tr><td>Reaccionar sin poder perderlo</td><td>Cola persistente (Inngest)</td></tr>
<tr><td>Lectura masiva para reportes</td><td>Vista de solo lectura</td></tr>
<tr><td>Operación que debe ser atómica</td><td>Transacción — se puede, están en la misma base</td></tr>
</table>

<div class="dato"><strong>La última fila es el privilegio que hay que aprovechar sin culpa.</strong> Poder
hacer una transacción entre dos módulos es exactamente lo que se pierde al partir, y es lo que hace que un
monolito modular sea tan cómodo. <b>No renuncies a eso por imitar una arquitectura distribuida que no
tenés.</b></div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="mm1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <rect x="24" y="30" width="632" height="140" rx="12" fill="currentColor" fill-opacity=".04" stroke="currentColor" stroke-opacity=".3" stroke-width="1.4"/>
  <text x="40" y="50" fill="currentColor" opacity=".6" font-size="11" font-weight="700">UN SOLO DESPLIEGUE · UNA BASE · UN PIPELINE</text>

  <rect x="44" y="60" width="180" height="96" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="134" y="80" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">pedidos</text>
  <rect x="58" y="88" width="152" height="16" rx="4" fill="#22d3ee" fill-opacity=".3"/>
  <text x="134" y="100" text-anchor="middle" fill="#22d3ee" font-size="8.5" font-weight="700">index.ts ← la puerta</text>
  <text x="134" y="120" text-anchor="middle" fill="currentColor" opacity=".55" font-size="8.5">servicio · reglas · tipos</text>
  <rect x="58" y="128" width="152" height="18" rx="4" fill="#7c5cff" fill-opacity=".2"/>
  <text x="134" y="141" text-anchor="middle" fill="#7c5cff" font-size="8.5" font-weight="700">tablas: pedidos, pedido_items</text>

  <rect x="240" y="60" width="180" height="96" rx="10" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="330" y="80" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">clientes</text>
  <rect x="254" y="88" width="152" height="16" rx="4" fill="#fbbf24" fill-opacity=".3"/>
  <text x="330" y="100" text-anchor="middle" fill="#3d2c05" font-size="8.5" font-weight="700">index.ts ← la puerta</text>
  <text x="330" y="120" text-anchor="middle" fill="currentColor" opacity=".55" font-size="8.5">servicio · reglas · tipos</text>
  <rect x="254" y="128" width="152" height="18" rx="4" fill="#7c5cff" fill-opacity=".2"/>
  <text x="330" y="141" text-anchor="middle" fill="#7c5cff" font-size="8.5" font-weight="700">tablas: clientes, contactos</text>

  <rect x="436" y="60" width="196" height="96" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="534" y="80" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">facturación</text>
  <rect x="450" y="88" width="168" height="16" rx="4" fill="#34d399" fill-opacity=".3"/>
  <text x="534" y="100" text-anchor="middle" fill="#06281c" font-size="8.5" font-weight="700">index.ts ← la puerta</text>
  <text x="534" y="120" text-anchor="middle" fill="currentColor" opacity=".55" font-size="8.5">servicio · reglas · tipos</text>
  <rect x="450" y="128" width="168" height="18" rx="4" fill="#7c5cff" fill-opacity=".2"/>
  <text x="534" y="141" text-anchor="middle" fill="#7c5cff" font-size="8.5" font-weight="700">tablas: facturas, notas</text>

  <line x1="228" y1="96" x2="236" y2="96" stroke="#34d399" stroke-width="1.6" marker-end="url(#mm1)" color="#34d399"/>
  <line x1="424" y1="96" x2="432" y2="96" stroke="#34d399" stroke-width="1.6" marker-end="url(#mm1)" color="#34d399"/>

  <rect x="24" y="182" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="203" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    LA REGLA QUE CASI NADIE APLICA: cada módulo es dueño de SUS tablas. Los demás no las consultan.</text>

  <rect x="24" y="226" width="632" height="52" rx="9" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="246" fill="#fbbf24" font-size="11" font-weight="700">Y es la más fácil de violar, porque hacer un join es más cómodo que pedir el dato.</text>
  <text x="44" y="266" fill="currentColor" opacity=".75" font-size="10.5">
    Nadie lo nota en la revisión —el código es correcto—. Seis meses después hay veinte consultas así y el módulo ya no se puede extraer.</text>

  <rect x="24" y="290" width="304" height="96" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="176" y="310" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">EL PRIVILEGIO QUE HAY QUE USAR</text>
  <text x="44" y="332" fill="currentColor" opacity=".75" font-size="10.5">Transacciones entre módulos: se puede,</text>
  <text x="44" y="348" fill="currentColor" opacity=".75" font-size="10.5">están en la misma base.</text>
  <text x="44" y="370" fill="#34d399" font-size="10.5" font-weight="700">No renuncies a eso por imitar una arquitectura</text>
  <text x="44" y="382" fill="#34d399" font-size="10.5" font-weight="700">distribuida que no tenés.</text>

  <rect x="352" y="290" width="304" height="96" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="504" y="310" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">SI HACE FALTA UN JOIN ENTRE MÓDULOS</text>
  <text x="372" y="332" fill="currentColor" opacity=".75" font-size="10.5">A · el dueño expone una función</text>
  <text x="372" y="350" fill="#7c5cff" font-size="10.5" font-weight="700">B · una VISTA de solo lectura</text>
  <text x="372" y="368" fill="currentColor" opacity=".65" font-size="10">La vista es un contrato explícito: el dueño</text>
  <text x="372" y="382" fill="currentColor" opacity=".65" font-size="10">sabe que existe y no la rompe sin avisar.</text>
</svg>`,
        pie: 'No es “microservicios para pobres”: es la etapa que hace que partir sea posible si alguna vez tiene sentido.',
      },

      entrevista: [
        { p: '¿Cuáles son las reglas de un monolito modular?',
          r: 'Cuatro. <b>Un módulo por área del negocio</b>, no por tipo técnico. <b>Cada módulo con una puerta de adelante</b> que define qué es ' +
             'público. <b>Nadie importa el interior de otro</b>, y eso se verifica automáticamente con ESLint. ' +
             'Y la que casi nadie aplica: <b>cada módulo es dueño de sus tablas</b>, así que los demás no las consultan directamente. ' +
             'Esa última es la que determina si el módulo se va a poder extraer algún día.' },

        { p: '¿Por qué la propiedad de las tablas es la regla más difícil de sostener?',
          r: 'Porque violarla es <b>más cómodo</b> que respetarla: si reportes necesita un dato de pedidos, hacer un join es inmediato y funciona ' +
             'perfecto. Nadie lo nota en la revisión porque el código es correcto. Seis meses después hay veinte consultas así y ' +
             '<b>el módulo dejó de ser extraíble</b>. Por eso conviene verificarlo con un test que busque consultas a las tablas de un módulo ' +
             'desde fuera de él: parece exagerado hasta la primera vez que salva un refactor.' },

        { p: '¿Qué hacés cuando reportes necesita cruzar datos de varios módulos?',
          r: 'Dos opciones legítimas. Que el <b>módulo dueño exponga una función</b> con exactamente lo que hace falta, o una <b>vista de solo ' +
             'lectura</b> mantenida por él. La vista suele ser la mejor para reportes porque es un <b>contrato explícito</b>: el módulo dueño sabe que ' +
             'existe y no puede romperla sin avisar. Un join directo, en cambio, es un acoplamiento invisible que nadie registró en ningún lado.' },

        { p: '¿El monolito modular es "microservicios para pobres"?',
          r: 'No: es la <b>etapa que hace que partir sea posible</b> si alguna vez tiene sentido. Da toda la disciplina de límites sin ninguno de los ' +
             'costos operativos —un pipeline, un despliegue, una traza— y conserva un privilegio que se pierde al partir: ' +
             '<b>transacciones entre módulos</b>, porque están en la misma base. Ese privilegio hay que usarlo sin culpa; ' +
             'renunciar a él por imitar una arquitectura distribuida que no tenés es pagar el costo sin recibir el beneficio.' },
      ],

      practica: `
<h4>La puerta de adelante</h4>
<pre><code>// modulos/pedidos/index.ts — el contrato del módulo
export type { PedidoResumen, EstadoPedido } from './tipos-publicos';

export {
  crearPedido,
  confirmarPedido,
  pedidoPorId,
  pedidosDelCliente,
  resumenParaReportes,        // ← lo que reportes necesita, expuesto a propósito
} from './servicio';

// NO se exporta: tipos internos, el repositorio, las funciones auxiliares</code></pre>

<h4>Verificación automática de límites</h4>
<pre><code>// eslint.config.js
{
  files: ['src/modulos/*/**'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['@/modulos/*/*'],
        message: 'Importá desde el index del módulo (@/modulos/pedidos), no de sus archivos internos.',
      }],
    }],
  },
}</code></pre>

<div class="aviso"><strong>Ese patrón permite <code>@/modulos/pedidos</code> y prohíbe
<code>@/modulos/pedidos/servicio</code>.</strong> Con una sola regla, la puerta de adelante deja de ser una
convención y pasa a romper el build cuando alguien la saltea.</div>

<h4>Test de propiedad de tablas</h4>
<pre><code>import { readFileSync } from 'fs';
import { globSync } from 'glob';

const PROPIEDAD = {
  pedidos:     ['pedidos', 'pedido_items', 'pedido_historial'],
  clientes:    ['clientes', 'contactos'],
  facturacion: ['facturas', 'notas_credito'],
};

test('nadie consulta tablas de otro módulo', () =&gt; {
  const violaciones: string[] = [];

  for (const [modulo, tablas] of Object.entries(PROPIEDAD)) {
    for (const archivo of globSync('src/**/*.ts')) {
      if (archivo.startsWith(\`src/modulos/\${modulo}/\`)) continue;
      const contenido = readFileSync(archivo, 'utf8');
      for (const tabla of tablas) {
        if (contenido.includes(\`from('\${tabla}')\`)) {
          violaciones.push(\`\${archivo} consulta \${tabla} (de \${modulo})\`);
        }
      }
    }
  }
  expect(violaciones).toEqual([]);
});</code></pre>

<h4>Migrar un monolito existente a modular</h4>
<table>
<tr><th>#</th><th>Paso</th></tr>
<tr><td>1</td><td>Listar las áreas del negocio (no las carpetas actuales)</td></tr>
<tr><td>2</td><td>Elegir <b>una</b>: la más aislada, para practicar</td></tr>
<tr><td>3</td><td>Mover sus archivos a <code>modulos/&lt;area&gt;/</code></td></tr>
<tr><td>4</td><td>Crear el <code>index.ts</code> con lo que hoy usan otros</td></tr>
<tr><td>5</td><td>Activar la regla de ESLint <b>solo para ese módulo</b></td></tr>
<tr><td>6</td><td>Arreglar los imports que rompan</td></tr>
<tr><td>7</td><td>Declarar sus tablas y agregar el test</td></tr>
<tr><td>8</td><td>Repetir con la siguiente área</td></tr>
</table>
<p>De a un módulo, sin frenar el desarrollo. Un big bang de reorganización tiende a quedarse a medias y a
dejar el proyecto peor que antes.</p>
`,

      errores: [
        { mito: 'Tengo carpetas por funcionalidad: es un monolito modular.',
          realidad: 'Sin una <b>puerta de adelante verificada</b>, cualquiera importa archivos internos y las carpetas son decorativas. ' +
                    'El límite existe cuando romperlo <b>rompe el build</b>.' },

        { mito: 'Un join entre tablas de módulos distintos es inofensivo.',
          realidad: 'Es la violación más cómoda y la que más determina si el módulo se podrá extraer. Usá una función pública del dueño ' +
                    'o una <b>vista de solo lectura</b>, que es un contrato explícito.' },

        { mito: 'Como voy a partir algún día, evito las transacciones entre módulos.',
          realidad: 'Estás pagando el costo de lo distribuido <b>sin tener los beneficios</b>. Mientras compartan base, la transacción es correcta ' +
                    'y es exactamente el privilegio que hace cómodo a un monolito modular.' },

        { mito: 'Reorganizo todo el proyecto de una vez.',
          realidad: 'Un big bang de reorganización tiende a quedarse a medias y a dejar el proyecto peor que antes. ' +
                    'De a un módulo, empezando por el más aislado, sin frenar el desarrollo.' },
      ],

      glosario: [
        { t: 'Monolito modular', d: 'Un despliegue con límites internos verificados automáticamente.' },
        { t: 'Puerta de adelante', d: 'Índice que define qué es público de un módulo.' },
        { t: 'Propiedad de tablas', d: 'Regla de que cada módulo es el único que consulta las suyas.' },
        { t: 'Vista de solo lectura', d: 'Contrato explícito para que otro módulo lea datos cruzados.' },
        { t: 'Límite verificado', d: 'Restricción que rompe el build si se viola.' },
        { t: 'Extraíble', d: 'Módulo cuyos límites permiten convertirlo en servicio sin reescribir el resto.' },
        { t: 'Migración incremental', d: 'Reorganizar de a un módulo, sin frenar el desarrollo.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Cuándo partir de verdad, y cómo',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> se extrae <b>un</b> módulo, por <b>un</b> motivo
escrito, y se mide si mejoró antes de extraer el siguiente.</div>

<h4>Los motivos que sí justifican extraer</h4>
<table>
<tr><th>Motivo</th><th>Señal concreta</th></tr>
<tr><td><b>Escala distinta</b></td><td>Una parte consume el 80% de los recursos y crece aparte</td></tr>
<tr><td><b>Equipos bloqueados</b></td><td>Dos equipos coordinan cada despliegue y eso frena entregas</td></tr>
<tr><td><b>Otro runtime</b></td><td>Una parte necesita Python o GPU por una razón real</td></tr>
<tr><td><b>Cumplimiento</b></td><td>Datos que deben vivir aislados o en otra jurisdicción</td></tr>
<tr><td><b>Ciclo distinto</b></td><td>Una parte se despliega diez veces por día y otra una vez por mes</td></tr>
</table>

<div class="aviso"><strong>Y un motivo que NO está en la lista aunque suene razonable: "para que sea más
mantenible".</strong> Eso lo resuelven los módulos. Si el problema es de organización del código, partir lo
empeora — porque agrega latencia, fallas parciales y coordinación de despliegues a un problema que era de
límites.</div>

<h4>Cómo se extrae</h4>
<pre><code>1 · Elegir el módulo MÁS AISLADO, no el más problemático
2 · Verificar que su límite ya está limpio (nadie toca sus tablas)
3 · Poner una interfaz delante: los demás llaman a una función,
    no importa si adentro es local o remoto
4 · Mover el código, dejando la interfaz igual
5 · Migrar sus tablas
6 · Cambiar la implementación de la interfaz de local a HTTP
7 · Medir: ¿mejoró el problema que motivó todo esto?</code></pre>

<div class="aviso"><strong>El paso 3 es el que hace todo esto reversible.</strong> Si los demás módulos llaman
a una función y esa función <b>puede ser local o remota</b>, podés probar la extracción y volver atrás sin
tocar a nadie más. Sin esa interfaz, cambiar de local a remoto significa modificar todos los puntos de uso a
la vez.</div>

<h4>El primero es el caro</h4>
<p>Extraer el primer servicio no cuesta "un servicio": cuesta <b>toda la infraestructura de lo distribuido</b>
— trazas correlacionadas, contratos versionados, despliegue coordinado, entorno local con varios servicios.</p>
<p>Del segundo en adelante es mucho más barato. Por eso conviene tener claro si va a haber un segundo: extraer
uno solo y quedarse ahí es <b>pagar el costo completo por el beneficio de un caso</b>.</p>
`,

      tecnico: `
<h4>La interfaz que hace reversible la extracción</h4>
<pre><code>// modulos/pedidos/index.ts — el contrato no cambia nunca
export interface ApiPedidos {
  porId(id: string): Promise&lt;PedidoResumen | null&gt;;
  crear(datos: NuevoPedido): Promise&lt;PedidoResumen&gt;;
}

// implementacion-local.ts
export const pedidosLocal: ApiPedidos = { … };

// implementacion-remota.ts
export const pedidosRemoto: ApiPedidos = {
  async porId(id) {
    return pedir&lt;PedidoResumen | null&gt;(\`/pedidos/\${id}\`);
  },
  …
};

// Una bandera decide cuál se usa. Volver atrás es cambiar un valor.
export const pedidos: ApiPedidos =
  process.env.PEDIDOS_REMOTO === '1' ? pedidosRemoto : pedidosLocal;</code></pre>

<div class="dato"><strong>Esa bandera convierte la extracción en una decisión reversible.</strong> Podés
desplegar el servicio nuevo, dirigir un porcentaje del tráfico, medir, y volver atrás en segundos si algo anda
mal — en vez de una migración de un solo sentido donde el rollback implica volver a fusionar el código.</div>

<h4>Los contratos entre servicios: la parte que se subestima</h4>
<p>Una vez separados, el contrato es lo único que los une, y ya no lo podés cambiar libremente:</p>
<pre><code>· Versionar desde el día uno: /v1/pedidos
· Los cambios deben ser compatibles hacia atrás:
    ✔ agregar un campo opcional
    ✔ agregar un endpoint
    ✘ quitar un campo
    ✘ cambiar un tipo
    ✘ volver obligatorio algo que era opcional
· Para quitar algo: deprecar, esperar, medir uso, después quitar</code></pre>

<div class="dato"><strong>Ese ciclo de deprecación es lo que más frena a los equipos y nadie lo anticipa.</strong>
En un monolito, quitar un campo es un refactor con el compilador ayudando. Entre servicios es: anunciar,
esperar a que el otro equipo lo saque de su código, verificar por métricas que nadie lo usa, y recién ahí
borrar. <b>Semanas en vez de minutos.</b></div>

<h4>El patrón de la higuera estranguladora</h4>
<p>Para extraer sin un big bang: poner un proxy delante y mover rutas de a una.</p>
<pre><code>Cliente → Proxy ─┬─ /pedidos/*   → servicio nuevo   (migrado)
                 └─ /*           → monolito         (todo lo demás)</code></pre>
<p>Se migra ruta por ruta, con la posibilidad de revertir cada una por separado. Es lento y es <b>mucho</b> más
seguro que cortar todo de una.</p>

<h4>Señales de que la extracción salió mal</h4>
<table>
<tr><th>Señal</th><th>Qué significa</th></tr>
<tr><td>Los dos servicios se despliegan siempre juntos</td><td>El límite estaba mal: no son independientes</td></tr>
<tr><td>Un cambio de negocio toca los dos</td><td>Igual</td></tr>
<tr><td>Uno consulta la base del otro</td><td>No hubo separación real</td></tr>
<tr><td>Se agregaron endpoints "solo para el otro servicio"</td><td>El acoplamiento se movió al contrato</td></tr>
<tr><td>Nadie puede levantar el entorno local</td><td>El costo operativo superó al beneficio</td></tr>
</table>

<div class="dato"><strong>La primera fila es el diagnóstico definitivo.</strong> Si dos servicios siempre se
despliegan juntos, no son dos servicios: es <b>un sistema con latencia de red adentro</b>. Y la respuesta
correcta en ese caso es volver a fusionarlos, que es una decisión que casi nadie se anima a tomar.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="ex1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA INTERFAZ QUE HACE REVERSIBLE LA EXTRACCIÓN</text>

  <rect x="24" y="34" width="632" height="98" rx="10" fill="currentColor" fill-opacity=".04" stroke="currentColor" stroke-opacity=".3"/>
  <rect x="44" y="46" width="160" height="30" rx="7" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="124" y="66" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">otros módulos</text>

  <line x1="208" y1="61" x2="238" y2="61" stroke="currentColor" stroke-width="1.4" marker-end="url(#ex1)"/>

  <rect x="242" y="46" width="180" height="30" rx="7" fill="#34d399" fill-opacity=".28" stroke="#34d399" stroke-width="1.8"/>
  <text x="332" y="66" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">interface ApiPedidos</text>

  <line x1="426" y1="55" x2="456" y2="46" stroke="#7c5cff" stroke-width="1.3" marker-end="url(#ex1)" color="#7c5cff"/>
  <line x1="426" y1="68" x2="456" y2="82" stroke="#7c5cff" stroke-width="1.3" marker-end="url(#ex1)" color="#7c5cff"/>

  <rect x="460" y="34" width="176" height="26" rx="6" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.1"/>
  <text x="548" y="51" text-anchor="middle" fill="currentColor" font-size="9">implementación LOCAL</text>
  <rect x="460" y="72" width="176" height="26" rx="6" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.1"/>
  <text x="548" y="89" text-anchor="middle" fill="currentColor" font-size="9">implementación REMOTA</text>

  <rect x="44" y="102" width="592" height="20" rx="5" fill="#34d399" fill-opacity=".16"/>
  <text x="340" y="116" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">
    una bandera decide cuál se usa → volver atrás es cambiar un valor, no un refactor</text>

  <text x="24" y="158" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    HIGUERA ESTRANGULADORA — migrar ruta por ruta, sin big bang</text>

  <rect x="24" y="170" width="110" height="30" rx="7" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="79" y="190" text-anchor="middle" fill="currentColor" font-size="9.5">cliente</text>
  <line x1="138" y1="185" x2="158" y2="185" stroke="currentColor" stroke-width="1.4" marker-end="url(#ex1)"/>
  <rect x="162" y="170" width="110" height="30" rx="7" fill="#fbbf24" fill-opacity="0.22" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="217" y="190" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">proxy</text>

  <line x1="276" y1="178" x2="316" y2="164" stroke="#34d399" stroke-width="1.5" marker-end="url(#ex1)" color="#34d399"/>
  <rect x="320" y="150" width="180" height="26" rx="6" fill="#34d399" fill-opacity=".22" stroke="#34d399" stroke-width="1.2"/>
  <text x="410" y="167" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">/pedidos/* → servicio nuevo</text>

  <line x1="276" y1="192" x2="316" y2="204" stroke="currentColor" stroke-width="1.4" marker-end="url(#ex1)"/>
  <rect x="320" y="192" width="180" height="26" rx="6" fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-opacity=".3"/>
  <text x="410" y="209" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">/* → monolito (todo lo demás)</text>

  <text x="516" y="186" fill="currentColor" opacity=".6" font-size="9.5">cada ruta se</text>
  <text x="516" y="200" fill="currentColor" opacity=".6" font-size="9.5">revierte sola</text>

  <line x1="24" y1="234" x2="656" y2="234" stroke="currentColor" opacity=".18"/>

  <rect x="24" y="246" width="632" height="52" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.5"/>
  <text x="44" y="266" fill="#f87171" font-size="11.5" font-weight="700">EL CICLO DE DEPRECACIÓN — lo que más frena y nadie anticipa</text>
  <text x="44" y="286" fill="currentColor" opacity=".75" font-size="11">
    Quitar un campo: monolito = un refactor con el compilador ayudando. Entre servicios = anunciar, esperar, medir uso, borrar. <tspan font-weight="700">Semanas.</tspan></text>

  <rect x="24" y="308" width="632" height="78" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="44" y="328" fill="#fbbf24" font-size="12" font-weight="700">EL DIAGNÓSTICO DEFINITIVO DE UNA EXTRACCIÓN FALLIDA</text>
  <text x="44" y="350" fill="currentColor" opacity=".78" font-size="11.5">
    Si dos servicios <tspan font-weight="700">siempre se despliegan juntos</tspan>, no son dos servicios:</text>
  <text x="44" y="368" fill="#f87171" font-size="11.5" font-weight="700">
    es UN sistema con latencia de red adentro.</text>
  <text x="44" y="382" fill="currentColor" opacity=".65" font-size="10.5">
    La respuesta correcta es volver a fusionarlos — que es la decisión que casi nadie se anima a tomar.</text>
</svg>`,
        pie: 'Un módulo, un motivo escrito, y medir si mejoró antes de extraer el siguiente.',
      },

      entrevista: [
        { p: '¿Qué motivos justifican extraer un módulo a un servicio?',
          r: 'Cinco, y todos concretos: <b>escala muy distinta</b> —una parte consume el 80% de los recursos y crece aparte—, ' +
             '<b>equipos que se bloquean</b> al desplegar, <b>otro runtime</b> por una razón real, <b>requisitos de cumplimiento</b> que exigen aislar ' +
             'datos, y <b>ciclos de despliegue</b> muy distintos. Lo que <b>no</b> justifica, aunque suene razonable, es "para que sea más mantenible": ' +
             'eso lo resuelven los módulos, y partir lo empeora agregando latencia y coordinación a un problema que era de límites.' },

        { p: '¿Cómo hacés que una extracción sea reversible?',
          r: 'Poniendo <b>una interfaz delante antes de mover nada</b>. Si los demás módulos llaman a una función y esa función puede tener una ' +
             'implementación local o una remota, la extracción se activa con una <b>bandera</b>: podés desplegar el servicio nuevo, dirigir parte del ' +
             'tráfico, medir, y volver atrás en segundos. Sin esa interfaz, pasar de local a remoto obliga a cambiar todos los puntos de uso a la vez ' +
             'y el rollback implica volver a fusionar el código.' },

        { p: '¿Qué se subestima siempre al separar servicios?',
          r: 'El <b>ciclo de deprecación de los contratos</b>. En un monolito, quitar un campo es un refactor con el compilador ayudando. ' +
             'Entre servicios es: anunciar, esperar a que el otro equipo lo saque de su código, verificar por métricas que nadie lo usa, y recién ahí ' +
             'borrar. <b>Semanas en vez de minutos</b>, y para siempre. Por eso los contratos se versionan desde el día uno y todo cambio debe ser ' +
             'compatible hacia atrás: agregar campos opcionales sí, quitar o cambiar tipos no.' },

        { p: '¿Cómo sabés que una extracción salió mal?',
          r: 'La señal definitiva es que <b>los dos servicios siempre se despliegan juntos</b>. Si es así, no son dos servicios: es un sistema con ' +
             'latencia de red adentro, y estás pagando todos los costos de lo distribuido sin ninguno de los beneficios. ' +
             'Otras señales: un cambio de negocio toca los dos, uno consulta la base del otro, o aparecieron endpoints "solo para el otro servicio" — ' +
             'ahí el acoplamiento simplemente se mudó al contrato. La respuesta correcta suele ser <b>volver a fusionarlos</b>.' },
      ],

      practica: `
<h4>Antes de extraer: el documento de una página</h4>
<pre><code># Extracción de <módulo> a servicio

Motivo             (uno solo, concreto y medible)
Métrica actual     el número que muestra el problema hoy
Métrica objetivo   qué número esperamos después
Riesgos            qué se rompe si sale mal
Plan de reversión  cómo volvemos atrás, y en cuánto tiempo
Costo estimado     infraestructura + horas + costo operativo permanente
¿Habrá un segundo? si la respuesta es "no", reconsiderá</code></pre>

<div class="aviso"><strong>La última línea es la que más decisiones evita.</strong> El primer servicio no
cuesta "un servicio": cuesta <b>toda la infraestructura de lo distribuido</b> —trazas correlacionadas,
contratos versionados, despliegue coordinado, entorno local con varios servicios—. Extraer uno solo y quedarse
ahí es pagar el costo completo por el beneficio de un caso.</div>

<h4>La interfaz, antes de mover nada</h4>
<pre><code>// Paso 1: los demás dejan de importar el servicio y usan la interfaz
export interface ApiPedidos {
  porId(id: string): Promise&lt;PedidoResumen | null&gt;;
  crear(datos: NuevoPedido): Promise&lt;PedidoResumen&gt;;
}

export const pedidos: ApiPedidos =
  process.env.PEDIDOS_REMOTO === '1' ? pedidosRemoto : pedidosLocal;

// Paso 2: implementar la versión remota
// Paso 3: activar la bandera en staging, medir
// Paso 4: activar en producción con un porcentaje
// Paso 5: mover el código del módulo al repositorio del servicio</code></pre>

<h4>Contrato versionado</h4>
<pre><code>GET /v1/pedidos/:id

// ✔ Compatible: agregar campo opcional
{ id, total, estado, descuento?: number }

// ✘ Rompe: quitar campo, cambiar tipo, volver obligatorio un opcional

// Para quitar 'total':
//   1. agregar 'totalCentavos'
//   2. anunciar la deprecación de 'total'
//   3. medir uso durante semanas
//   4. cuando el uso sea cero, quitar</code></pre>

<h4>Revisión posterior, a los tres meses</h4>
<table>
<tr><th>Pregunta</th><th>Si la respuesta es mala…</th></tr>
<tr><td>¿Mejoró la métrica del motivo?</td><td>No → considerá volver a fusionar</td></tr>
<tr><td>¿Se despliegan por separado?</td><td>No → el límite estaba mal</td></tr>
<tr><td>¿Aumentaron los incidentes?</td><td>Sí → falta resiliencia entre servicios</td></tr>
<tr><td>¿Alguien puede levantar el entorno local?</td><td>No → el costo operativo ganó</td></tr>
<tr><td>¿Los cambios tardan más que antes?</td><td>Sí → el contrato está frenando</td></tr>
</table>
`,

      errores: [
        { mito: 'Extraigo servicios para que el código sea más mantenible.',
          realidad: 'La mantenibilidad la dan los <b>módulos</b>. Partir agrega latencia, fallas parciales y coordinación de despliegues a un problema ' +
                    'que era de límites — así que lo empeora.' },

        { mito: 'Muevo el código primero y después arreglo las llamadas.',
          realidad: 'Sin una <b>interfaz delante</b>, la extracción no es reversible: pasar de local a remoto obliga a cambiar todos los puntos de uso ' +
                    'a la vez, y volver atrás implica volver a fusionar el código.' },

        { mito: 'El contrato lo ajustamos sobre la marcha.',
          realidad: 'Una vez separados, quitar un campo es <b>anunciar, esperar, medir y borrar</b>: semanas en vez de minutos. ' +
                    'Versionar desde el día uno y solo hacer cambios compatibles hacia atrás.' },

        { mito: 'Si dos servicios se despliegan siempre juntos, es cuestión de coordinación.',
          realidad: 'Es el <b>diagnóstico de que el límite estaba mal</b>: no son dos servicios, es un sistema con latencia de red adentro. ' +
                    'La respuesta correcta suele ser volver a fusionarlos.' },
      ],

      glosario: [
        { t: 'Extracción', d: 'Convertir un módulo en un servicio independiente.' },
        { t: 'Interfaz de transición', d: 'Contrato que permite que la implementación sea local o remota.' },
        { t: 'Higuera estranguladora', d: 'Migrar ruta por ruta detrás de un proxy, sin big bang.' },
        { t: 'Contrato versionado', d: 'API con versión explícita y cambios compatibles hacia atrás.' },
        { t: 'Deprecación', d: 'Anunciar, esperar y medir antes de quitar algo de un contrato.' },
        { t: 'Costo del primero', d: 'Toda la infraestructura de lo distribuido, que se paga en la primera extracción.' },
        { t: 'Refusión', d: 'Volver a unir dos servicios cuyo límite resultó estar mal.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Qué problema resuelven realmente los microservicios?',
      opciones: [
        'Un problema organizativo: que un equipo bloquee a otro para desplegar',
        'El desorden del código',
        'La lentitud de las consultas',
        'La complejidad de la lógica de negocio',
      ],
      correcta: 0,
      porQue: 'Un monolito desordenado partido en servicios da un desorden distribuido: los mismos problemas más latencia de red y fallas parciales.',
      porQueNo: {
        1: 'Eso lo resuelven los módulos, y partir lo empeora.',
        2: 'Se resuelve con índices, caché o réplicas de lectura.',
        3: 'La complejidad del dominio no cambia por separar despliegues.',
      },
    },
    {
      p: '¿Cuál es la secuencia correcta hacia una arquitectura distribuida?',
      opciones: [
        'Monolito → monolito modular con límites verificados → extraer un módulo con motivo',
        'Microservicios desde el día uno, para no migrar después',
        'Monolito → microservicios, directamente',
        'Depende del framework elegido',
      ],
      correcta: 0,
      porQue: 'Saltear el paso modular significa que los límites nunca se probaron, así que están en el lugar equivocado — y ahora moverlos es migración de datos y despliegues coordinados.',
      porQueNo: {
        1: 'Los límites se definen cuando menos se conoce el dominio: casi seguro están mal.',
        2: 'Congela límites que nunca se validaron.',
        3: 'La decisión es de organización y dominio, no de herramienta.',
      },
    },
    {
      p: '¿Qué desaparece cuando partís un sistema en servicios?',
      opciones: [
        'Las transacciones entre partes, la consistencia inmediata y la llamada barata',
        'La necesidad de tests',
        'La complejidad del dominio',
        'Los problemas de rendimiento',
      ],
      correcta: 0,
      porQue: 'Las tres eran gratis en un monolito y hay que reconstruirlas a mano: sagas con compensación, estados intermedios visibles en la interfaz, y llamadas que pueden fallar o repetirse.',
      porQueNo: {
        1: 'Hacen más falta, no menos.',
        2: 'El dominio es el mismo, ahora repartido.',
        3: 'Suelen aparecer nuevos, por la latencia de red.',
      },
    },
    {
      p: '¿Cuál es la falacia de lo distribuido que más daño hace en la práctica?',
      opciones: [
        'Que la latencia es cero: una llamada de red es mil veces más lenta que una función local',
        'Que el ancho de banda es infinito',
        'Que la red es segura',
        'Que la topología no cambia',
      ],
      correcta: 0,
      porQue: 'Un endpoint con diez llamadas internas gratis pasa de 5 ms a medio segundo al partirse — y el código se ve exactamente igual, así que nadie lo nota hasta medirlo.',
      porQueNo: {
        1: 'Importa con volúmenes altos, pero afecta a menos casos.',
        2: 'Es un problema real de seguridad, no de rendimiento cotidiano.',
        3: 'Afecta a la configuración, no a cada llamada.',
      },
    },
    {
      p: '¿Por qué una saga no equivale a una transacción?',
      opciones: [
        'Porque la compensación también puede fallar, y compensar no es revertir: deja rastro',
        'Porque es más lenta',
        'Porque requiere una base especial',
        'Porque no se puede automatizar',
      ],
      correcta: 0,
      porQue: 'Un ROLLBACK no deja rastro; un reembolso deja dos movimientos en el extracto del cliente. Y sin persistir el estado de la saga, un reinicio la deja colgada para siempre.',
      porQueNo: {
        1: 'La velocidad no es la diferencia conceptual.',
        2: 'Se implementa con cualquier base más una tabla de estado.',
        3: 'Se automatiza; el problema es que no garantiza atomicidad.',
      },
    },
    {
      p: '¿Quién debe generar la clave de idempotencia?',
      opciones: [
        'Quien llama, y reutilizarla en todos los reintentos',
        'El servicio receptor, al recibir la petición',
        'La base de datos, con un valor autogenerado',
        'Un servicio central de claves',
      ],
      correcta: 0,
      porQue: 'Si la genera el receptor, cada reintento produce una clave nueva y el mecanismo no sirve para nada. Es un detalle de tres líneas que decide si el sistema cobra una o tres veces.',
      porQueNo: {
        1: 'Cada reintento generaría una clave distinta.',
        2: 'La base no sabe que dos peticiones son el mismo intento.',
        3: 'Agrega una dependencia sin resolver el problema de origen.',
      },
    },
    {
      p: '¿Cuál es el modo de falla más traicionero de un sistema distribuido?',
      opciones: [
        'Un servicio lento, no caído: consume las conexiones de todos y la lentitud se propaga por contagio',
        'Un servicio completamente caído',
        'Una base de datos sin índices',
        'Un despliegue fallido',
      ],
      correcta: 0,
      porQue: 'Un servicio caído falla rápido y es fácil de manejar. Uno lento tumba el sistema entero por contagio, y por eso timeouts y cortacircuitos no son opcionales.',
      porQueNo: {
        1: 'Es el caso fácil: falla rápido y se puede degradar.',
        2: 'Es un problema local del servicio, no un modo distribuido.',
        3: 'Se revierte; no se propaga por la red.',
      },
    },
    {
      p: '¿Cuáles son las reglas de un monolito modular?',
      opciones: [
        'Módulo por área del negocio, puerta de adelante, nadie importa el interior de otro, y cada módulo es dueño de sus tablas',
        'Una carpeta por tipo técnico, con nombres consistentes',
        'Un archivo por entidad y tests por módulo',
        'Un repositorio por módulo dentro de un monorepo',
      ],
      correcta: 0,
      porQue: 'La cuarta —propiedad de las tablas— es la que casi nadie aplica y la que determina si el módulo se podrá extraer algún día.',
      porQueNo: {
        1: 'Organizar por tipo técnico reparte cada funcionalidad en cinco carpetas.',
        2: 'Es útil, pero no define límites entre módulos.',
        3: 'Es una decisión de repositorio, no de límites de código.',
      },
    },
    {
      p: '¿Por qué la propiedad de las tablas es la regla más difícil de sostener?',
      opciones: [
        'Porque violarla con un join es más cómodo, funciona perfecto y nadie lo nota en la revisión',
        'Porque las bases no permiten permisos por tabla',
        'Porque los ORM no lo soportan',
        'Porque requiere una base por módulo',
      ],
      correcta: 0,
      porQue: 'Seis meses después hay veinte consultas así y el módulo dejó de ser extraíble. Por eso conviene un test que busque consultas a las tablas de un módulo desde fuera de él.',
      porQueNo: {
        1: 'Postgres tiene permisos granulares por tabla y por rol.',
        2: 'Es una regla de disciplina, independiente de la herramienta.',
        3: 'En un monolito modular comparten base a propósito.',
      },
    },
    {
      p: 'Reportes necesita cruzar datos de varios módulos. ¿Qué hacés?',
      opciones: [
        'Una vista de solo lectura mantenida por el módulo dueño, o una función pública que exponga lo necesario',
        'Un join directo: es más rápido',
        'Copiar las tablas al módulo de reportes',
        'Dar acceso de lectura a todas las tablas',
      ],
      correcta: 0,
      porQue: 'Una vista es un contrato explícito: el dueño sabe que existe y no puede romperla sin avisar. Un join directo es un acoplamiento invisible que nadie registró.',
      porQueNo: {
        1: 'Es exactamente la violación que impide extraer el módulo después.',
        2: 'Duplica datos y crea un problema de sincronización.',
        3: 'Elimina el límite por completo.',
      },
    },
    {
      p: 'En un monolito modular, ¿conviene evitar transacciones entre módulos?',
      opciones: [
        'No: es el privilegio que se pierde al partir y hay que usarlo sin culpa',
        'Sí, para estar preparado para separar después',
        'Sí, porque acoplan los módulos',
        'Depende del motor de base de datos',
      ],
      correcta: 0,
      porQue: 'Renunciar a las transacciones por imitar una arquitectura distribuida que no tenés es pagar el costo sin recibir el beneficio.',
      porQueNo: {
        1: 'Es pagar hoy el costo de una separación que quizás nunca ocurra.',
        2: 'Comparten base a propósito: la transacción es correcta.',
        3: 'Cualquier base transaccional lo permite.',
      },
    },
    {
      p: '¿Qué motivo NO justifica extraer un módulo a un servicio?',
      opciones: [
        '"Para que el código sea más mantenible"',
        'Una parte necesita escalar 10× más que el resto',
        'Dos equipos coordinan cada despliegue y eso frena entregas',
        'Datos que por cumplimiento deben vivir aislados',
      ],
      correcta: 0,
      porQue: 'La mantenibilidad la dan los módulos. Partir agrega latencia, fallas parciales y coordinación a un problema que era de límites, así que lo empeora.',
      porQueNo: {
        1: 'Es uno de los motivos válidos.',
        2: 'Es el caso organizativo por excelencia.',
        3: 'Es una restricción externa que sí justifica aislar.',
      },
    },
    {
      p: '¿Qué hace que una extracción sea reversible?',
      opciones: [
        'Poner una interfaz delante antes de mover nada, con una bandera que elige implementación local o remota',
        'Mantener el código viejo comentado',
        'Tener respaldos de la base',
        'Documentar el proceso',
      ],
      correcta: 0,
      porQue: 'Podés desplegar el servicio nuevo, dirigir parte del tráfico, medir y volver atrás en segundos. Sin esa interfaz, pasar de local a remoto obliga a cambiar todos los puntos de uso a la vez.',
      porQueNo: {
        1: 'El código comentado se desactualiza y no es una vía de reversión.',
        2: 'Los respaldos no revierten un cambio de arquitectura.',
        3: 'Documentar no cambia el costo técnico de volver atrás.',
      },
    },
    {
      p: '¿Qué se subestima siempre al separar servicios?',
      opciones: [
        'El ciclo de deprecación de contratos: quitar un campo pasa de minutos a semanas',
        'El costo del hosting',
        'La necesidad de más tests unitarios',
        'La curva de aprendizaje del framework',
      ],
      correcta: 0,
      porQue: 'En un monolito el compilador ayuda. Entre servicios hay que anunciar, esperar a que el otro equipo lo saque, verificar por métricas que nadie lo usa, y recién ahí borrar.',
      porQueNo: {
        1: 'Es real pero menor frente al costo permanente de coordinación.',
        2: 'Los tests unitarios no cambian sustancialmente.',
        3: 'Es puntual, no permanente.',
      },
    },
    {
      p: 'Dos servicios extraídos siempre se despliegan juntos. ¿Qué significa?',
      opciones: [
        'Que el límite estaba mal: no son dos servicios, es un sistema con latencia de red adentro',
        'Que falta automatizar el pipeline',
        'Que hace falta un orquestador',
        'Que el equipo necesita más coordinación',
      ],
      correcta: 0,
      porQue: 'Estás pagando todos los costos de lo distribuido sin ninguno de los beneficios. La respuesta correcta suele ser volver a fusionarlos, que es la decisión que casi nadie se anima a tomar.',
      porQueNo: {
        1: 'Automatizar no elimina la dependencia entre los dos.',
        2: 'Un orquestador coordina el despliegue, no arregla el límite.',
        3: 'Más coordinación es el síntoma, no la cura.',
      },
    },
  ],
});
