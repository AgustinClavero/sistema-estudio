/* ==========================================================================
   Arquitectura · Módulo 06 — Sistemas orientados a eventos
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'arquitectura',
  id: 'm06',
  titulo: 'Sistemas orientados a eventos',
  fuentes: ['inngest', 'fowler', 'postgres'],

  intro:
    '<p>Los eventos son la herramienta que más rápido convierte un sistema legible en uno imposible de seguir. ' +
    'Y al mismo tiempo son imprescindibles para todo lo que tarda, todo lo que puede fallar y todo lo que no ' +
    'debe bloquear al usuario.</p>' +
    '<p>Este módulo va sobre usarlos con criterio: qué garantías te da realmente una cola, por qué la entrega ' +
    '<b>exactamente una vez</b> no existe, y cómo diseñar eventos que no te obliguen a reescribir todo en un año.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Colas y pub/sub: qué resuelve cada uno',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> una <b>cola</b> es "que alguien haga esto después";
<b>pub/sub</b> es "pasó esto, el que quiera que reaccione". Son problemas distintos.</div>

<h4>Cola: trabajo diferido</h4>
<p>Hay <b>un</b> trabajo, y <b>un</b> trabajador lo toma. Sirve para todo lo que no debe hacer esperar al
usuario:</p>
<pre><code>· generar un PDF                    · procesar una imagen
· enviar un email                   · sincronizar con un sistema externo
· recalcular un reporte             · llamar a un modelo de IA</code></pre>

<p>El usuario recibe una respuesta inmediata; el trabajo ocurre atrás.</p>

<h4>Pub/sub: notificación</h4>
<p>Pasó algo y <b>varios</b> interesados reaccionan, cada uno por su cuenta:</p>
<pre><code>pedido.confirmado  →  facturación crea la factura
                   →  depósito prepara el envío
                   →  analítica registra la conversión
                   →  marketing suma puntos de fidelidad</code></pre>

<div class="aviso"><strong>La diferencia que importa:</strong> en una cola, si el trabajo falla, <b>se
reintenta el mismo trabajo</b>. En pub/sub, cada suscriptor falla o tiene éxito por separado — y por eso cada
uno necesita <b>su propia</b> política de reintentos. Mezclar los dos modelos produce el bug de reintentar
todos los suscriptores porque uno falló, y mandar cuatro emails.</div>

<h4>Cuándo NO usar ninguno</h4>
<p>Si la operación es <b>parte del negocio</b> y debe ocurrir sí o sí para que la principal sea válida,
va sincrónica y dentro de la transacción. Descontar stock al confirmar un pedido no es un evento: si falla, el
pedido no debería quedar confirmado.</p>

<h4>La pregunta que ordena la decisión</h4>
<pre><code>"Si esto falla, ¿la operación principal sigue siendo válida?"

  No  → sincrónico, en la transacción
  Sí  → evento o cola</code></pre>
`,

      tecnico: `
<h4>Los tres modelos, comparados</h4>
<table>
<tr><th></th><th>Cola</th><th>Pub/sub</th><th>Registro (log)</th></tr>
<tr><td>Consumidores</td><td>Uno por mensaje</td><td>Todos los suscriptos</td><td>Todos, con su posición</td></tr>
<tr><td>Al consumir</td><td>El mensaje se va</td><td>Cada uno recibe copia</td><td>Se conserva</td></tr>
<tr><td>Reprocesar</td><td>No</td><td>No</td><td><b>Sí</b>, volviendo atrás</td></tr>
<tr><td>Orden</td><td>Aproximado</td><td>Sin garantía</td><td>Garantizado por partición</td></tr>
<tr><td>Ejemplos</td><td>SQS, Inngest</td><td>SNS, Realtime</td><td>Kafka</td></tr>
</table>

<div class="dato"><strong>La fila de "reprocesar" es la razón por la que existe el registro.</strong> Con una
cola, un mensaje consumido desapareció: si tu consumidor tenía un bug, el dato se perdió. Con un registro
podés <b>volver atrás la posición y reprocesar</b> los últimos tres días con el código arreglado. ' +
Es una capacidad potentísima y también la que hace a Kafka mucho más complejo de operar — no lo adoptes si no
vas a usar esa capacidad.</div>

<h4>El error de guardar y publicar por separado</h4>
<pre><code>// ❌ Dos operaciones que pueden fallar por separado
await db.pedidos.guardar(pedido);      // ✔ ok
await cola.enviar('pedido.creado');    // ✘ falla → el pedido existe y nadie se enteró

// ❌ Al revés es peor
await cola.enviar('pedido.creado');    // ✔ ok
await db.pedidos.guardar(pedido);      // ✘ falla → se notificó algo que no existe</code></pre>

<div class="dato"><strong>Este problema tiene nombre —<i>dual write</i>— y no se resuelve con reintentos ni con
cuidado.</strong> La solución estándar es la <b>bandeja de salida</b>: escribir el evento <b>en la misma
transacción</b> que el dato, en una tabla, y que un proceso aparte lo publique después. ' +
Si la transacción falla, no queda ni el dato ni el evento; si tiene éxito, quedan los dos y la publicación se
reintenta hasta lograrlo.</div>

<h4>La bandeja de salida</h4>
<pre><code>-- Todo en una transacción: o quedan los dos o ninguno
begin;
  insert into pedidos (…) values (…);
  insert into eventos_salientes (tipo, datos)
       values ('pedido.creado', jsonb_build_object('pedidoId', …));
commit;

-- Un proceso aparte publica lo pendiente y marca lo enviado
select * from eventos_salientes where enviado_en is null order by id limit 100;</code></pre>

<h4>Cuándo cada uno, en concreto</h4>
<table>
<tr><th>Necesidad</th><th>Herramienta</th></tr>
<tr><td>Trabajo pesado que no debe bloquear</td><td>Cola</td></tr>
<tr><td>Reintentos automáticos y visibilidad</td><td>Cola gestionada (Inngest)</td></tr>
<tr><td>Varios interesados en lo mismo</td><td>Pub/sub</td></tr>
<tr><td>Actualizar la interfaz al instante</td><td>Realtime (no es una cola)</td></tr>
<tr><td>Reprocesar histórico</td><td>Registro tipo Kafka</td></tr>
<tr><td>Algo que debe ocurrir sí o sí con la operación</td><td><b>Ninguna:</b> transacción</td></tr>
</table>

<div class="dato"><strong>La cuarta fila señala una confusión frecuente:</strong> Realtime de Supabase
<b>no es una cola</b>. Es notificación en vivo para actualizar una pantalla; si el cliente está desconectado,
el mensaje se pierde y no hay reintento. Usarlo para lógica de negocio produce trabajos que a veces no ocurren,
sin ninguna señal.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="ev1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    COLA — un trabajo, un trabajador</text>

  <rect x="24" y="34" width="90" height="28" rx="6" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="69" y="52" text-anchor="middle" fill="currentColor" font-size="9">productor</text>
  <line x1="118" y1="48" x2="136" y2="48" stroke="currentColor" stroke-width="1.3" marker-end="url(#ev1)"/>
  <rect x="140" y="34" width="150" height="28" rx="6" fill="#fbbf24" fill-opacity=".22" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="215" y="52" text-anchor="middle" fill="#fbbf24" font-size="9" font-weight="700">▢ ▢ ▢ cola</text>
  <line x1="294" y1="48" x2="312" y2="48" stroke="currentColor" stroke-width="1.3" marker-end="url(#ev1)"/>
  <rect x="316" y="34" width="110" height="28" rx="6" fill="#34d399" fill-opacity=".22" stroke="#34d399" stroke-width="1.2"/>
  <text x="371" y="52" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">trabajador</text>
  <text x="440" y="52" fill="currentColor" opacity=".6" font-size="9.5">si falla, se reintenta EL MISMO trabajo</text>

  <text x="24" y="88" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    PUB/SUB — un hecho, varios interesados</text>

  <rect x="24" y="100" width="90" height="28" rx="6" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="69" y="118" text-anchor="middle" fill="currentColor" font-size="9">emisor</text>
  <line x1="118" y1="114" x2="136" y2="114" stroke="currentColor" stroke-width="1.3" marker-end="url(#ev1)"/>
  <rect x="140" y="100" width="150" height="28" rx="6" fill="#7c5cff" fill-opacity=".22" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="215" y="118" text-anchor="middle" fill="#7c5cff" font-size="9" font-weight="700">pedido.confirmado</text>

  <line x1="294" y1="108" x2="318" y2="90" stroke="#7c5cff" stroke-width="1.2" marker-end="url(#ev1)" color="#7c5cff"/>
  <line x1="294" y1="112" x2="318" y2="110" stroke="#7c5cff" stroke-width="1.2" marker-end="url(#ev1)" color="#7c5cff"/>
  <line x1="294" y1="118" x2="318" y2="132" stroke="#7c5cff" stroke-width="1.2" marker-end="url(#ev1)" color="#7c5cff"/>
  <line x1="294" y1="122" x2="318" y2="152" stroke="#7c5cff" stroke-width="1.2" marker-end="url(#ev1)" color="#7c5cff"/>

  <text x="326" y="93" fill="currentColor" opacity=".68" font-size="9">facturación</text>
  <text x="326" y="113" fill="currentColor" opacity=".68" font-size="9">depósito</text>
  <text x="326" y="135" fill="currentColor" opacity=".68" font-size="9">analítica</text>
  <text x="326" y="155" fill="currentColor" opacity=".68" font-size="9">fidelidad</text>

  <text x="430" y="120" fill="#f87171" font-size="9.5" font-weight="700">cada uno con SU política</text>
  <text x="430" y="134" fill="#f87171" font-size="9.5" font-weight="700">de reintentos</text>

  <rect x="24" y="172" width="632" height="30" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="192" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    Mezclarlos produce el bug de reintentar TODOS los suscriptores porque uno falló → cuatro emails.</text>

  <line x1="24" y1="222" x2="656" y2="222" stroke="currentColor" opacity=".18"/>

  <text x="24" y="246" fill="#f87171" font-size="12" font-weight="700">
    GUARDAR Y PUBLICAR POR SEPARADO — no se arregla con reintentos</text>

  <rect x="24" y="258" width="304" height="60" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="278" fill="currentColor" opacity=".72" font-size="10" font-family="monospace">db.guardar(pedido)   ✔</text>
  <text x="44" y="294" fill="currentColor" opacity=".72" font-size="10" font-family="monospace">cola.enviar(evento)  ✘</text>
  <text x="44" y="311" fill="#f87171" font-size="10" font-weight="700">el pedido existe y nadie se enteró</text>

  <rect x="352" y="258" width="304" height="60" rx="10" fill="#f87171" fill-opacity=".16" stroke="#f87171" stroke-width="1.5"/>
  <text x="372" y="278" fill="currentColor" opacity=".72" font-size="10" font-family="monospace">cola.enviar(evento)  ✔</text>
  <text x="372" y="294" fill="currentColor" opacity=".72" font-size="10" font-family="monospace">db.guardar(pedido)   ✘</text>
  <text x="372" y="311" fill="#f87171" font-size="10" font-weight="700">se notificó algo que NO EXISTE ← peor</text>

  <rect x="24" y="330" width="632" height="56" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="44" y="350" fill="#34d399" font-size="12" font-weight="700">LA SOLUCIÓN: BANDEJA DE SALIDA</text>
  <text x="44" y="368" fill="currentColor" opacity=".78" font-size="11">
    El evento se escribe <tspan font-weight="700">en la misma transacción</tspan> que el dato, en una tabla. Un proceso aparte lo publica después.</text>
  <text x="44" y="382" fill="#34d399" font-size="10.5" font-weight="700">
    Si la transacción falla, no queda ni el dato ni el evento. Si tiene éxito, quedan los dos.</text>
</svg>`,
        pie: '“Si esto falla, ¿la operación principal sigue siendo válida?” No → transacción. Sí → evento.',
      },

      entrevista: [
        { p: '¿Cuál es la diferencia entre una cola y pub/sub?',
          r: 'Una <b>cola</b> es trabajo diferido: hay un trabajo y un trabajador lo toma; si falla, se reintenta <b>el mismo trabajo</b>. ' +
             '<b>Pub/sub</b> es notificación: pasó algo y varios interesados reaccionan, cada uno por su cuenta, así que cada suscriptor necesita ' +
             '<b>su propia</b> política de reintentos. Mezclar los dos modelos produce el bug de reintentar todos los suscriptores porque uno falló — ' +
             'y mandar cuatro emails.' },

        { p: '¿Cuándo NO conviene usar un evento?',
          r: 'Cuando la operación es <b>parte del negocio</b> y debe ocurrir sí o sí para que la principal sea válida. Descontar stock al confirmar un ' +
             'pedido no es un evento: si falla, el pedido no debería quedar confirmado, así que va sincrónico y dentro de la transacción. ' +
             'La pregunta que uso es: <b>"si esto falla, ¿la operación principal sigue siendo válida?"</b>. Si la respuesta es no, transacción; ' +
             'si es sí, evento.' },

        { p: '¿Qué es el problema de la doble escritura y cómo se resuelve?',
          r: 'Que guardar el dato y publicar el evento son <b>dos operaciones que pueden fallar por separado</b>: o el pedido existe y nadie se enteró, ' +
             'o —peor— se notificó algo que no existe. No se arregla con reintentos ni con cuidado. La solución estándar es la ' +
             '<b>bandeja de salida</b>: escribir el evento en una tabla <b>dentro de la misma transacción</b> que el dato, y que un proceso aparte lo ' +
             'publique después. Si la transacción falla no queda nada; si tiene éxito quedan los dos y la publicación se reintenta hasta lograrlo.' },

        { p: '¿Realtime de Supabase sirve como cola?',
          r: 'No. Es <b>notificación en vivo</b> para actualizar una pantalla: si el cliente está desconectado, el mensaje se pierde y no hay reintento ' +
             'ni registro. Usarlo para lógica de negocio produce trabajos que a veces no ocurren, <b>sin ninguna señal de error</b> — que es el peor ' +
             'tipo de falla. Para trabajo que no se puede perder hace falta una cola persistente con reintentos y visibilidad.' },
      ],

      practica: `
<h4>Bandeja de salida completa</h4>
<pre><code>create table eventos_salientes (
  id bigserial primary key,
  tipo text not null,
  datos jsonb not null,
  creado_en timestamptz not null default now(),
  enviado_en timestamptz,
  intentos int not null default 0,
  ultimo_error text
);
create index on eventos_salientes (enviado_en) where enviado_en is null;</code></pre>

<pre><code>// La escritura: dato y evento en la MISMA transacción
export async function crearPedido(datos: NuevoPedido) {
  return enTransaccion(async (tx) =&gt; {
    const pedido = await tx.pedidos.insertar(datos);
    await tx.eventosSalientes.insertar({
      tipo: 'pedido.creado',
      datos: { pedidoId: pedido.id, tenantId: pedido.tenantId },
    });
    return pedido;
  });
}

// El publicador: proceso aparte, reintenta hasta lograrlo
export async function publicarPendientes() {
  const pendientes = await db.eventosSalientes.pendientes({ limite: 100 });
  for (const e of pendientes) {
    try {
      await inngest.send({ name: e.tipo, data: e.datos });
      await db.eventosSalientes.marcarEnviado(e.id);
    } catch (err) {
      await db.eventosSalientes.registrarFallo(e.id, String(err));
    }
  }
}</code></pre>

<div class="aviso"><strong>El índice parcial <code>where enviado_en is null</code> es lo que hace esto viable a
largo plazo.</strong> Sin él, la consulta de pendientes recorre toda la tabla —que crece para siempre— y a los
seis meses el publicador se vuelve el proceso más lento del sistema.</div>

<h4>Trabajo diferido con Inngest</h4>
<pre><code>export const generarFactura = inngest.createFunction(
  {
    id: 'generar-factura',
    retries: 4,
    concurrency: { limit: 5 },                 // no saturar el servicio de PDF
    idempotency: 'event.data.pedidoId',        // el mismo pedido no se procesa dos veces
  },
  { event: 'pedido/confirmado' },
  async ({ event, step }) =&gt; {
    const datos = await step.run('leer-pedido', () =&gt; pedidos.porId(event.data.pedidoId));
    const pdf   = await step.run('generar-pdf', () =&gt; generarPdf(datos));
    const url   = await step.run('subir', () =&gt; storage.subir(pdf));
    await step.run('notificar', () =&gt; notificar.facturaLista(datos.email, url));
  },
);</code></pre>

<div class="dato"><strong>Cada <code>step.run</code> se persiste por separado.</strong> Si falla el envío del
email, al reintentar <b>no se vuelve a generar el PDF</b>: se retoma desde el paso que falló. ' +
Sin eso, un reintento repite todo el trabajo caro — y en el caso de una llamada a un modelo de IA, lo vuelve a
pagar.</div>

<h4>Elegir la herramienta</h4>
<table>
<tr><th>Necesidad</th><th>Opción</th></tr>
<tr><td>Trabajo diferido con reintentos y visibilidad</td><td>Inngest</td></tr>
<tr><td>Eventos entre módulos, en proceso</td><td>Emisor local + bandeja de salida si importa</td></tr>
<tr><td>Actualizar la UI en vivo</td><td>Realtime — <b>no</b> para lógica</td></tr>
<tr><td>Reprocesar histórico</td><td>Registro tipo Kafka (solo si vas a usarlo)</td></tr>
<tr><td>Tarea programada</td><td>Cron de Inngest o del proveedor</td></tr>
</table>
`,

      errores: [
        { mito: 'Guardo el dato y después publico el evento.',
          realidad: 'Son <b>dos operaciones que pueden fallar por separado</b>. O el dato existe sin evento, o se notificó algo que no existe. ' +
                    'La solución es la <b>bandeja de salida</b>: evento y dato en la misma transacción.' },

        { mito: 'Realtime me sirve para disparar trabajos.',
          realidad: 'Si el cliente está desconectado, el mensaje <b>se pierde sin dejar rastro</b>. Es notificación de interfaz, no una cola. ' +
                    'Para trabajo que no se puede perder hace falta persistencia y reintentos.' },

        { mito: 'Si un suscriptor falla, reintento el evento completo.',
          realidad: 'Eso reintenta también a los que sí funcionaron: cuatro emails. En pub/sub, <b>cada suscriptor</b> tiene su propia política ' +
                    'de reintentos.' },

        { mito: 'Todo lo que pasa después de una operación puede ser un evento.',
          realidad: 'Solo lo que <b>puede fallar sin invalidar la operación principal</b>. Descontar stock al confirmar un pedido va en la transacción: ' +
                    'si falla, el pedido no debería quedar confirmado.' },
      ],

      glosario: [
        { t: 'Cola', d: 'Trabajo diferido: un mensaje, un trabajador, reintentos del mismo trabajo.' },
        { t: 'Pub/sub', d: 'Notificación: un hecho, varios suscriptores independientes.' },
        { t: 'Registro (log)', d: 'Secuencia persistida que permite reprocesar desde una posición anterior.' },
        { t: 'Doble escritura', d: 'Guardar el dato y publicar el evento como operaciones separadas.' },
        { t: 'Bandeja de salida', d: 'Tabla donde el evento se escribe en la misma transacción que el dato.' },
        { t: 'Publicador', d: 'Proceso que lee la bandeja de salida y envía lo pendiente.' },
        { t: 'Paso persistido', d: 'Unidad de un trabajo que, al reintentar, no se vuelve a ejecutar si ya salió bien.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Entrega, orden e idempotencia',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> la entrega "exactamente una vez"
<b>no existe</b>. Lo que existe es entrega al menos una vez, más <b>procesamiento</b> idempotente — que da el
mismo resultado.</div>

<h4>Las tres garantías</h4>
<table>
<tr><th>Garantía</th><th>Qué significa</th><th>Cuándo se usa</th></tr>
<tr><td><b>Como mucho una vez</b></td><td>Puede perderse, nunca se duplica</td><td>Métricas, telemetría</td></tr>
<tr><td><b>Al menos una vez</b></td><td>Nunca se pierde, puede duplicarse</td><td><b>Prácticamente todo</b></td></tr>
<tr><td><b>Exactamente una vez</b></td><td>Ni se pierde ni se duplica</td><td>No existe de verdad</td></tr>
</table>

<div class="aviso"><strong>Por qué la tercera no existe:</strong> el consumidor procesa el mensaje y después
confirma. Si se cae <b>entre esas dos cosas</b>, el sistema no tiene forma de saber si el trabajo se hizo, así
que lo reenvía. Cualquier producto que diga ofrecer "exactamente una vez" en realidad ofrece
<b>al menos una vez más deduplicación</b> — que es exactamente lo que podés hacer vos.</div>

<h4>Entonces: idempotencia</h4>
<p>Si el mensaje puede llegar dos veces, el <b>procesamiento</b> tiene que dar el mismo resultado. Tres formas:</p>
<ol>
<li><b>Operación naturalmente idempotente.</b> "Poner el estado en pagado" se puede hacer diez veces.</li>
<li><b>Verificar antes.</b> "Si ya está pagado, no hago nada."</li>
<li><b>Registro de procesados.</b> Guardar el identificador del mensaje y descartar los repetidos.</li>
</ol>

<h4>El orden: la otra garantía que no tenés</h4>
<p>Los mensajes pueden llegar desordenados. Si <code>pedido.creado</code> y <code>pedido.confirmado</code>
salen con milisegundos de diferencia, el segundo puede procesarse primero.</p>
<pre><code>· Diseñar los eventos para que el orden NO importe   ← lo mejor
· Incluir una versión o marca de tiempo y descartar lo viejo
· Usar una clave de partición para que lo del mismo pedido vaya en orden</code></pre>
`,

      tecnico: `
<h4>Deduplicación con registro de procesados</h4>
<pre><code>create table mensajes_procesados (
  id text primary key,                 -- el identificador del mensaje
  procesado_en timestamptz not null default now(),
  resultado jsonb
);

-- Y una política de retención: sin esto crece para siempre
delete from mensajes_procesados where procesado_en &lt; now() - interval '30 days';</code></pre>

<pre><code>export async function procesar(mensaje: Mensaje) {
  return enTransaccion(async (tx) =&gt; {
    const yaEsta = await tx.mensajesProcesados.porId(mensaje.id);
    if (yaEsta) return yaEsta.resultado;          // duplicado: devolver lo mismo

    const resultado = await hacerElTrabajo(tx, mensaje);
    await tx.mensajesProcesados.insertar({ id: mensaje.id, resultado });
    return resultado;
  });
}</code></pre>

<div class="dato"><strong>Que la marca y el trabajo estén en la <b>misma transacción</b> es lo que hace que
funcione.</strong> Si marcás como procesado antes y el trabajo falla, perdiste el mensaje para siempre; ' +
si marcás después y el proceso muere en el medio, se va a reprocesar. Juntos, o las dos cosas ocurren o
ninguna.</div>

<h4>Manejar el desorden con versiones</h4>
<pre><code>// Cada evento lleva la versión del recurso al momento de emitirse
{ tipo: 'pedido.actualizado', pedidoId: 'p-1', version: 7, datos: { … } }

// El consumidor descarta lo que ya superó
export async function aplicar(evento: Evento) {
  const actual = await proyeccion.porId(evento.pedidoId);
  if (actual &amp;&amp; actual.version &gt;= evento.version) return;   // llegó tarde: ignorar
  await proyeccion.guardar({ ...evento.datos, version: evento.version });
}</code></pre>

<div class="dato"><strong>Usar una versión y no una marca de tiempo es deliberado.</strong> Los relojes de
distintas máquinas no están perfectamente sincronizados, así que dos eventos pueden tener marcas que no
reflejan el orden real. Una versión que incrementa la base es <b>un orden verdadero</b>, no una aproximación.</div>

<h4>Mensajes envenenados y cola de descarte</h4>
<p>Un mensaje que siempre falla —datos corruptos, un caso no contemplado— se reintenta para siempre y bloquea
o satura la cola. La solución es un <b>límite de intentos</b> y una <b>cola de descarte</b>:</p>
<pre><code>intento 1 → falla → reintentar en 1 min
intento 2 → falla → reintentar en 5 min
intento 3 → falla → reintentar en 30 min
intento 4 → falla → COLA DE DESCARTE + alerta</code></pre>

<div class="dato"><strong>Y lo más importante de la cola de descarte es que alguien la mire.</strong> Una cola
de descarte sin alerta ni revisión periódica es un lugar donde el trabajo desaparece en silencio: ' +
las facturas que no se generaron están ahí, y nadie se entera hasta que un cliente reclama.</div>

<h4>Orden por partición</h4>
<pre><code>// Si el orden importa DENTRO de un pedido pero no entre pedidos:
// usar el id del pedido como clave de partición.
await cola.enviar({ evento, claveParticion: pedidoId });

// Todos los mensajes del pedido p-1 van a la misma partición → orden garantizado.
// Los de p-1 y p-2 pueden procesarse en paralelo.</code></pre>

<div class="dato"><strong>La contra que hay que conocer:</strong> la clave de partición <b>limita el
paralelismo</b>. Si elegís una clave con pocos valores distintos —por ejemplo el tenant, en un sistema con tres
tenants grandes— todos los mensajes van a tres particiones y no podés escalar más allá de tres consumidores por
más máquinas que agregues.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="en1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <rect x="24" y="28" width="632" height="52" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="340" y="50" text-anchor="middle" fill="#f87171" font-size="13" font-weight="700">
    La entrega “exactamente una vez” NO EXISTE.</text>
  <text x="340" y="70" text-anchor="middle" fill="currentColor" opacity=".72" font-size="11">
    El consumidor procesa y después confirma. Si se cae entre las dos cosas, nadie sabe si el trabajo se hizo — y se reenvía.</text>

  <text x="24" y="106" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS TRES GARANTÍAS</text>

  <rect x="24" y="118" width="200" height="62" rx="9" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="124" y="138" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">como mucho una vez</text>
  <text x="124" y="156" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">puede perderse</text>
  <text x="124" y="172" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">telemetría, métricas</text>

  <rect x="240" y="118" width="200" height="62" rx="9" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.8"/>
  <text x="340" y="138" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">AL MENOS UNA VEZ</text>
  <text x="340" y="156" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">puede duplicarse</text>
  <text x="340" y="172" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">prácticamente todo</text>

  <rect x="456" y="118" width="200" height="62" rx="9" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.2"/>
  <text x="556" y="138" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">exactamente una vez</text>
  <text x="556" y="156" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">no existe</text>
  <text x="556" y="172" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">quien lo promete, deduplica</text>

  <rect x="24" y="192" width="632" height="30" rx="8" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="340" y="212" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">
    Lo que sí existe: entrega AL MENOS UNA VEZ + PROCESAMIENTO idempotente. El resultado es el mismo.</text>

  <text x="24" y="248" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA MARCA Y EL TRABAJO, EN LA MISMA TRANSACCIÓN</text>

  <rect x="24" y="260" width="200" height="60" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="124" y="280" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">marcar ANTES</text>
  <text x="124" y="298" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">si el trabajo falla…</text>
  <text x="124" y="313" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">perdiste el mensaje</text>

  <rect x="240" y="260" width="200" height="60" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="340" y="280" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">marcar DESPUÉS</text>
  <text x="340" y="298" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">si muere en el medio…</text>
  <text x="340" y="313" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">se reprocesa</text>

  <rect x="456" y="260" width="200" height="60" rx="9" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.6"/>
  <text x="556" y="280" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">LAS DOS JUNTAS</text>
  <text x="556" y="298" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">misma transacción</text>
  <text x="556" y="313" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">o las dos, o ninguna</text>

  <rect x="24" y="332" width="304" height="54" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="176" y="352" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">VERSIÓN, NO MARCA DE TIEMPO</text>
  <text x="44" y="370" fill="currentColor" opacity=".7" font-size="10">Los relojes de distintas máquinas no coinciden.</text>
  <text x="44" y="382" fill="#7c5cff" font-size="10" font-weight="700">Una versión de la base es un orden VERDADERO.</text>

  <rect x="352" y="332" width="304" height="54" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="504" y="352" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">COLA DE DESCARTE SIN ALERTA</text>
  <text x="372" y="370" fill="currentColor" opacity=".7" font-size="10">Es un lugar donde el trabajo desaparece en silencio.</text>
  <text x="372" y="382" fill="#f87171" font-size="10" font-weight="700">Las facturas no generadas están ahí, y nadie lo sabe.</text>
</svg>`,
        pie: 'No busques que el mensaje llegue una vez. Hacé que llegar dos veces no importe.',
      },

      entrevista: [
        { p: '¿Por qué no existe la entrega "exactamente una vez"?',
          r: 'Porque el consumidor <b>procesa y después confirma</b>: si se cae entre esas dos cosas, el sistema no tiene forma de saber si el trabajo ' +
             'se hizo, así que reenvía el mensaje. Cualquier producto que prometa "exactamente una vez" en realidad ofrece ' +
             '<b>al menos una vez más deduplicación</b> — que es exactamente lo que podés implementar vos. ' +
             'La conclusión práctica es que no hay que buscar que el mensaje llegue una sola vez: hay que hacer que <b>llegar dos veces no importe</b>.' },

        { p: '¿Cómo implementás deduplicación correctamente?',
          r: 'Con una tabla de mensajes procesados y —esto es lo clave— <b>la marca y el trabajo en la misma transacción</b>. ' +
             'Si marcás como procesado <b>antes</b> y el trabajo falla, perdiste el mensaje para siempre; si marcás <b>después</b> y el proceso muere ' +
             'en el medio, se reprocesa. Juntos, o las dos cosas ocurren o ninguna. Y hace falta una política de <b>retención</b>: sin ella, ' +
             'esa tabla crece para siempre.' },

        { p: '¿Cómo manejás el desorden de los mensajes?',
          r: 'Lo mejor es <b>diseñar los eventos para que el orden no importe</b>. Si no se puede, incluyo una <b>versión</b> del recurso en el evento y ' +
             'el consumidor descarta lo que ya superó. Uso versión y no marca de tiempo a propósito: los relojes de distintas máquinas no están ' +
             'sincronizados, así que dos marcas pueden no reflejar el orden real, mientras que <b>una versión que incrementa la base es un orden ' +
             'verdadero</b>. La tercera opción es una clave de partición, cuando el orden importa dentro de una entidad.' },

        { p: '¿Qué es un mensaje envenenado y cómo se maneja?',
          r: 'Uno que <b>siempre falla</b> —datos corruptos, un caso no contemplado— y que reintentado para siempre bloquea o satura la cola. ' +
             'Se maneja con un <b>límite de intentos</b> con espera creciente y una <b>cola de descarte</b>. ' +
             'Y lo más importante: <b>alguien tiene que mirarla</b>. Una cola de descarte sin alerta ni revisión periódica es un lugar donde el trabajo ' +
             'desaparece en silencio — las facturas que no se generaron están ahí, y nadie se entera hasta que un cliente reclama.' },
      ],

      practica: `
<h4>Procesamiento idempotente, en la misma transacción</h4>
<pre><code>export async function procesarEvento(evento: Evento) {
  return enTransaccion(async (tx) =&gt; {
    // 1 · ¿ya se procesó?
    const previo = await tx.query(
      'select resultado from mensajes_procesados where id = $1', [evento.id]);
    if (previo.rows[0]) return previo.rows[0].resultado;

    // 2 · el trabajo real
    const resultado = await hacerTrabajo(tx, evento);

    // 3 · marcar, en la MISMA transacción
    await tx.query(
      'insert into mensajes_procesados (id, resultado) values ($1, $2)',
      [evento.id, resultado]);

    return resultado;
  });
}</code></pre>

<h4>Operaciones naturalmente idempotentes</h4>
<pre><code>-- ✔ Se puede ejecutar diez veces: el resultado es el mismo
update pedidos set estado = 'pagado', pago_id = $2
 where id = $1 and estado = 'pendiente';

-- ✔ Insertar o no hacer nada
insert into notificaciones (id, …) values ($1, …)
on conflict (id) do nothing;

-- ✘ NO idempotente: cada ejecución suma
update cuentas set saldo = saldo + $1 where id = $2;
--   ← esta necesita registro de procesados sí o sí</code></pre>

<div class="aviso"><strong>La cláusula <code>and estado = 'pendiente'</code> del primer ejemplo hace dos cosas
a la vez:</strong> vuelve la operación idempotente y protege contra transiciones inválidas. Si el pedido ya
estaba cancelado, la actualización no afecta ninguna fila — y podés detectarlo mirando el conteo.</div>

<h4>Reintentos con descarte</h4>
<pre><code>export const procesarPago = inngest.createFunction(
  {
    id: 'procesar-pago',
    retries: 4,
    onFailure: async ({ error, event }) =&gt; {
      // se ejecuta cuando se agotaron los reintentos
      await db.colaDescarte.insertar({ evento: event, error: String(error) });
      await alertar('pago_no_procesado', { pedidoId: event.data.pedidoId, error });
    },
  },
  { event: 'pago/recibido' },
  async ({ event, step }) =&gt; { … },
);</code></pre>

<h4>Revisión de la cola de descarte</h4>
<pre><code>-- Un trabajo diario que reporta lo que quedó afuera
select tipo, count(*) as cantidad, min(creado_en) as mas_viejo
  from cola_descarte
 where resuelto_en is null
 group by tipo;

-- Si esto devuelve filas y nadie las mira, el trabajo se perdió en silencio.</code></pre>

<h4>Checklist de un consumidor</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>El procesamiento es idempotente</td></tr>
<tr><td>☐</td><td>La marca de procesado va en la misma transacción que el trabajo</td></tr>
<tr><td>☐</td><td>La tabla de procesados tiene política de retención</td></tr>
<tr><td>☐</td><td>El evento no depende del orden, o lleva versión</td></tr>
<tr><td>☐</td><td>Hay límite de intentos y cola de descarte</td></tr>
<tr><td>☐</td><td><b>Alguien mira la cola de descarte</b> — hay alerta</td></tr>
<tr><td>☐</td><td>Los pasos caros están separados para no repetirse al reintentar</td></tr>
</table>
`,

      errores: [
        { mito: 'Mi cola garantiza entrega exactamente una vez.',
          realidad: 'Ninguna lo hace de verdad: ofrecen <b>al menos una vez más deduplicación</b>. El procesamiento tiene que ser idempotente ' +
                    'igual, porque el consumidor puede caerse entre procesar y confirmar.' },

        { mito: 'Marco el mensaje como procesado y después hago el trabajo.',
          realidad: 'Si el trabajo falla, <b>perdiste el mensaje para siempre</b>. Y al revés se reprocesa. Las dos cosas van en la ' +
                    '<b>misma transacción</b>.' },

        { mito: 'Ordeno los eventos por marca de tiempo.',
          realidad: 'Los relojes de distintas máquinas no están sincronizados: dos marcas pueden no reflejar el orden real. ' +
                    'Una <b>versión</b> incrementada por la base sí es un orden verdadero.' },

        { mito: 'Tengo una cola de descarte, así que no pierdo trabajo.',
          realidad: 'Solo si <b>alguien la mira</b>. Sin alerta ni revisión, es el lugar donde el trabajo desaparece en silencio: ' +
                    'las facturas no generadas están ahí y nadie se entera hasta que un cliente reclama.' },
      ],

      glosario: [
        { t: 'Al menos una vez', d: 'Garantía habitual: no se pierde, puede duplicarse.' },
        { t: 'Idempotencia', d: 'Que repetir el procesamiento dé el mismo resultado.' },
        { t: 'Deduplicación', d: 'Descartar mensajes ya procesados usando su identificador.' },
        { t: 'Mensaje envenenado', d: 'El que siempre falla y satura la cola si no se limita.' },
        { t: 'Cola de descarte', d: 'Destino de los mensajes que agotaron sus reintentos.' },
        { t: 'Clave de partición', d: 'Valor que agrupa mensajes para garantizar orden entre ellos.' },
        { t: 'Versión del recurso', d: 'Número incremental que permite descartar eventos atrasados.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'CQRS y event sourcing: qué son y cuándo',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> son dos patrones potentes, independientes entre
sí, y <b>ambos casi siempre innecesarios</b> — pero conviene entenderlos para poder decir que no con
argumentos.</div>

<h4>CQRS: separar lectura de escritura</h4>
<p>Significa tener <b>modelos distintos</b> para leer y para escribir. Suena raro y en realidad ya lo estás
haciendo de forma leve:</p>
<pre><code>Escritura:  crearPedido(datos)          ← valida reglas, escribe normalizado
Lectura:    listadoDePedidos()          ← join, campos calculados, desnormalizado</code></pre>

<p>Eso es <b>CQRS leve</b> y está perfecto: distintos tipos para leer y escribir, misma base, misma tabla. El
CQRS "completo" es otra cosa: <b>bases distintas</b>, sincronizadas por eventos.</p>

<div class="aviso"><strong>Y ahí aparece el costo que casi nadie menciona primero:</strong> con bases
separadas, la lectura queda <b>desactualizada</b> respecto de la escritura. El usuario crea algo, lo redirigís
al listado, y no está. Cada pantalla del producto tiene que contemplar ese desfase — y eso es trabajo de
interfaz en todos lados, no solo en el backend.</div>

<h4>Event sourcing: guardar los hechos, no el estado</h4>
<p>En vez de guardar "el pedido está pagado", se guarda la secuencia completa:</p>
<pre><code>PedidoCreado      { items: [...] }
ItemAgregado      { producto: 'X' }
PedidoConfirmado  { }
PagoRecibido      { monto: 15000 }

El estado actual se calcula reproduciendo los eventos.</code></pre>

<h4>Qué gana</h4>
<ul>
<li><b>Auditoría perfecta:</b> queda registrado todo lo que pasó y en qué orden.</li>
<li><b>Viajar en el tiempo:</b> reconstruir el estado de cualquier momento.</li>
<li><b>Preguntas nuevas sobre el pasado:</b> podés calcular métricas que no existían cuando ocurrió.</li>
</ul>

<h4>Qué cuesta</h4>
<ul>
<li>Una consulta simple pasa a ser reproducir eventos, o mantener una proyección.</li>
<li>Cambiar el esquema de un evento viejo es un problema serio: <b>ya está escrito</b>.</li>
<li>Borrar datos personales es difícil: el registro es inmutable por diseño.</li>
<li><b>Volver atrás es una migración total.</b></li>
</ul>
`,

      tecnico: `
<h4>CQRS: los tres niveles</h4>
<table>
<tr><th>Nivel</th><th>Qué implica</th><th>Cuándo</th></tr>
<tr><td><b>Leve</b></td><td>Tipos distintos para leer y escribir, misma tabla</td><td><b>Siempre.</b> Ya lo hacés</td></tr>
<tr><td><b>Medio</b></td><td>Vistas materializadas o tablas de lectura en la misma base</td><td>Cuando una consulta es cara y se repite</td></tr>
<tr><td><b>Completo</b></td><td>Base de lectura separada, sincronizada por eventos</td><td>Escalas muy distintas entre lectura y escritura</td></tr>
</table>

<div class="dato"><strong>El nivel medio resuelve el 95% de los casos donde alguien propone CQRS
completo.</strong> Una vista materializada en Postgres da la misma ventaja —consultas de lectura rapidísimas
sobre datos preprocesados— <b>sin base separada, sin sincronización y sin desfase impredecible</b>: vos
controlás cuándo se refresca.</div>

<h4>Vista materializada, la opción intermedia</h4>
<pre><code>create materialized view resumen_pedidos_tenant as
select tenant_id,
       date_trunc('day', creado_en) as dia,
       count(*)                      as cantidad,
       sum(total)                    as facturado
  from pedidos
 where cancelado_en is null
 group by 1, 2;

create unique index on resumen_pedidos_tenant (tenant_id, dia);

-- Refrescar sin bloquear lecturas (requiere el índice único de arriba)
refresh materialized view concurrently resumen_pedidos_tenant;</code></pre>

<div class="dato"><strong>El <code>concurrently</code> depende del índice único</strong> y es la diferencia
entre una vista usable en producción y una que bloquea todas las lecturas cada vez que se refresca. ' +
Es un detalle de una línea que se descubre tarde y en el peor momento.</div>

<h4>Event sourcing: el problema de la evolución</h4>
<pre><code>// Versión 1, escrita hace dos años — y sigue en la base
{ tipo: 'PedidoCreado', v: 1, datos: { cliente: 'Ana', total: 15000 } }

// Versión 2: ahora el cliente es un id y el total está en centavos
{ tipo: 'PedidoCreado', v: 2, datos: { clienteId: 'c-1', totalCentavos: 1500000 } }

// El código tiene que entender AMBAS, para siempre
function aplicar(evento) {
  const datos = evento.v === 1 ? migrarV1aV2(evento.datos) : evento.datos;
  …
}</code></pre>

<div class="dato"><strong>Esa función de migración no se puede borrar nunca.</strong> Los eventos viejos siguen
en el registro y hay que poder reproducirlos, así que el código acumula una capa de traducción por cada cambio
de formato que hubo en la historia del sistema. <b>Es el costo de mantenimiento que nadie proyecta al
adoptarlo.</b></div>

<h4>Y el problema de borrar datos personales</h4>
<p>El registro de eventos es <b>inmutable por diseño</b>. Si alguien ejerce su derecho a que borres sus datos,
no podés simplemente eliminar eventos sin romper la reproducción. Las salidas habituales:</p>
<ul>
<li><b>Cifrado por persona:</b> los datos personales van cifrados con una clave por usuario; borrar la clave los vuelve ilegibles.</li>
<li><b>Eventos de anulación:</b> agregar un evento que marca los datos como borrados, y filtrar al reproducir.</li>
</ul>
<p>Las dos son trabajo real que hay que diseñar desde el principio, no agregar después.</p>

<h4>La alternativa que resuelve el 90% de los casos</h4>
<pre><code>-- Si lo que necesitás es auditoría, una tabla de historial alcanza
create table pedidos_historial (
  id bigserial primary key,
  pedido_id uuid not null,
  cambio jsonb not null,          -- qué cambió
  usuario_id uuid,                -- quién
  ocurrido_en timestamptz not null default now()
);</code></pre>
<p>Da trazabilidad completa, se consulta con SQL normal, y el estado actual sigue estando donde siempre.
<b>Sin ninguno de los costos de event sourcing.</b></p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="cq1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CQRS TIENE TRES NIVELES — y casi siempre alcanza con los dos primeros</text>

  <rect x="24" y="34" width="200" height="76" rx="10" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.6"/>
  <text x="124" y="54" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">LEVE</text>
  <text x="124" y="74" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">tipos distintos, misma tabla</text>
  <text x="124" y="94" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">SIEMPRE — ya lo hacés</text>

  <rect x="240" y="34" width="200" height="76" rx="10" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="340" y="54" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">MEDIO</text>
  <text x="340" y="74" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">vista materializada</text>
  <text x="340" y="94" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">resuelve el 95% de los casos</text>

  <rect x="456" y="34" width="200" height="76" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.4"/>
  <text x="556" y="54" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">COMPLETO</text>
  <text x="556" y="74" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">base de lectura separada</text>
  <text x="556" y="94" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">solo con escalas MUY distintas</text>

  <rect x="24" y="120" width="632" height="42" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="140" fill="#f87171" font-size="11.5" font-weight="700">EL COSTO DE CQRS COMPLETO QUE NADIE MENCIONA PRIMERO</text>
  <text x="44" y="156" fill="currentColor" opacity=".75" font-size="11">
    La lectura queda desactualizada: el usuario crea algo, lo mandás al listado, y no está. <tspan font-weight="700">Cada pantalla del producto tiene que contemplarlo.</tspan></text>

  <line x1="24" y1="182" x2="656" y2="182" stroke="currentColor" opacity=".18"/>

  <text x="24" y="206" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EVENT SOURCING — guardar los hechos, no el estado</text>

  <rect x="24" y="218" width="300" height="76" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.3"/>
  <rect x="40" y="228" width="268" height="14" rx="3" fill="#7c5cff" fill-opacity=".25"/>
  <text x="174" y="239" text-anchor="middle" fill="currentColor" font-size="8">PedidoCreado</text>
  <rect x="40" y="245" width="268" height="14" rx="3" fill="#7c5cff" fill-opacity=".25"/>
  <text x="174" y="256" text-anchor="middle" fill="currentColor" font-size="8">ItemAgregado</text>
  <rect x="40" y="262" width="268" height="14" rx="3" fill="#7c5cff" fill-opacity=".25"/>
  <text x="174" y="273" text-anchor="middle" fill="currentColor" font-size="8">PagoRecibido</text>
  <text x="174" y="289" text-anchor="middle" fill="#7c5cff" font-size="9" font-weight="700">el estado se calcula reproduciendo</text>

  <rect x="340" y="218" width="316" height="76" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="498" y="236" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">LO QUE CUESTA</text>
  <text x="356" y="254" fill="currentColor" opacity=".72" font-size="9.5">· cambiar el formato de un evento viejo: ya está escrito</text>
  <text x="356" y="270" fill="currentColor" opacity=".72" font-size="9.5">· borrar datos personales: el registro es inmutable</text>
  <text x="356" y="286" fill="#f87171" font-size="9.5" font-weight="700">· volver atrás es una migración TOTAL</text>

  <rect x="24" y="306" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="327" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    La función que migra eventos v1 a v2 NO SE PUEDE BORRAR NUNCA. Se acumula una capa por cada cambio de formato de la historia.</text>

  <rect x="24" y="350" width="632" height="36" rx="9" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.5"/>
  <text x="44" y="368" fill="#34d399" font-size="11.5" font-weight="700">LA ALTERNATIVA QUE RESUELVE EL 90%: una tabla de historial.</text>
  <text x="44" y="382" fill="currentColor" opacity=".75" font-size="10.5">
    Trazabilidad completa, SQL normal, el estado actual donde siempre — y sin ninguno de los costos de arriba.</text>
</svg>`,
        pie: 'Entenderlos sirve sobre todo para poder decir que no con argumentos.',
      },

      entrevista: [
        { p: '¿Qué es CQRS y cuántos niveles tiene?',
          r: 'Separar el modelo de lectura del de escritura. Tiene tres niveles. El <b>leve</b> —tipos distintos para leer y escribir sobre la misma ' +
             'tabla— <b>ya lo hacés</b> y está perfecto. El <b>medio</b> usa vistas materializadas o tablas de lectura en la misma base, y ' +
             '<b>resuelve el 95% de los casos</b> donde alguien propone el completo. El <b>completo</b> tiene base de lectura separada sincronizada por ' +
             'eventos, y solo se justifica con escalas muy distintas entre lectura y escritura.' },

        { p: '¿Cuál es el costo de CQRS completo que menos se menciona?',
          r: 'Que <b>la lectura queda desactualizada</b> respecto de la escritura. El usuario crea algo, lo redirigís al listado, y no está. ' +
             'Cada pantalla del producto tiene que contemplar ese desfase con estados de carga, mensajes o lecturas optimistas — y eso es ' +
             '<b>trabajo de interfaz en todos lados</b>, no solo un problema del backend. Con una vista materializada en la misma base, en cambio, ' +
             'vos controlás cuándo se refresca.' },

        { p: '¿Cuál es el costo de mantenimiento de event sourcing que nadie proyecta?',
          r: 'La <b>evolución del formato de los eventos</b>. Cuando cambiás la estructura de un evento, los viejos siguen en el registro y hay que ' +
             'poder reproducirlos, así que escribís una función de migración de la versión 1 a la 2. <b>Esa función no se puede borrar nunca</b>: ' +
             'el código acumula una capa de traducción por cada cambio de formato que hubo en toda la historia del sistema. ' +
             'Y hay un segundo costo serio: borrar datos personales de un registro inmutable por diseño requiere cifrado por persona ' +
             'o eventos de anulación, diseñados desde el principio.' },

        { p: 'Si lo que se necesita es auditoría, ¿qué proponés?',
          r: 'Una <b>tabla de historial</b>: qué cambió, quién lo hizo y cuándo. Da trazabilidad completa, se consulta con SQL normal, ' +
             'el estado actual sigue estando donde siempre, y no tiene <b>ninguno</b> de los costos de event sourcing — ' +
             'ni migración de formatos acumulada, ni problema para borrar datos personales, ni reconstrucción del estado en cada consulta. ' +
             'Event sourcing se justifica cuando el requisito es reconstruir el estado exacto de cualquier momento, no cuando alcanza con saber ' +
             'qué pasó.' },
      ],

      practica: `
<h4>Vista materializada: CQRS medio, sin sus costos</h4>
<pre><code>create materialized view resumen_diario as
select tenant_id,
       date_trunc('day', creado_en)::date as dia,
       count(*)   as pedidos,
       sum(total) as facturado
  from pedidos
 where cancelado_en is null
 group by 1, 2;

-- Índice único: obligatorio para refrescar sin bloquear
create unique index on resumen_diario (tenant_id, dia);</code></pre>

<pre><code>// Refresco programado
export const refrescarResumen = inngest.createFunction(
  { id: 'refrescar-resumen' },
  { cron: '0 * * * *' },                    // cada hora
  async () =&gt; {
    await db.query('refresh materialized view concurrently resumen_diario');
  },
);</code></pre>

<div class="aviso"><strong>Sin el índice único, <code>concurrently</code> no funciona</strong> y el refresco
bloquea todas las lecturas de la vista mientras dura. Es un detalle de una línea que se descubre en producción,
cuando el panel se congela cada hora.</div>

<h4>Tabla de historial: auditoría sin event sourcing</h4>
<pre><code>create table pedidos_historial (
  id bigserial primary key,
  pedido_id uuid not null references pedidos(id),
  campo text not null,
  valor_anterior jsonb,
  valor_nuevo jsonb,
  usuario_id uuid,
  motivo text,
  ocurrido_en timestamptz not null default now()
);

create index on pedidos_historial (pedido_id, ocurrido_en desc);</code></pre>

<pre><code>-- Y un disparador que la llena sola
create or replace function registrar_cambio_pedido() returns trigger as $$
begin
  if new.estado is distinct from old.estado then
    insert into pedidos_historial (pedido_id, campo, valor_anterior, valor_nuevo, usuario_id)
    values (new.id, 'estado', to_jsonb(old.estado), to_jsonb(new.estado),
            current_setting('app.usuario_id', true)::uuid);
  end if;
  return new;
end $$ language plpgsql;</code></pre>

<h4>Antes de aceptar event sourcing o CQRS completo</h4>
<table>
<tr><th>Pregunta</th><th>Si la respuesta es "no"…</th></tr>
<tr><td>¿Hay un requisito escrito de reconstruir estados pasados?</td><td>No lo adoptes</td></tr>
<tr><td>¿Las lecturas superan a las escrituras en 3 órdenes de magnitud?</td><td>No adoptes CQRS completo</td></tr>
<tr><td>¿Ya probaron índices, caché y vistas materializadas?</td><td>Probá eso primero</td></tr>
<tr><td>¿El equipo ya operó algo así antes?</td><td>El riesgo sube mucho</td></tr>
<tr><td>¿Está resuelto cómo borrar datos personales?</td><td>Resolvelo <b>antes</b>, no después</td></tr>
</table>
`,

      errores: [
        { mito: 'CQRS significa tener dos bases de datos.',
          realidad: 'Eso es CQRS <b>completo</b>. El leve —tipos distintos para leer y escribir— ya lo hacés, y el medio —vistas materializadas— ' +
                    'resuelve el 95% de los casos sin base separada ni desfase impredecible.' },

        { mito: 'Event sourcing me da auditoría gratis.',
          realidad: 'Gratis no: pagás la <b>migración de formatos acumulada</b> —esas funciones no se borran nunca—, la reconstrucción del estado, ' +
                    'y el problema de borrar datos personales de un registro inmutable. Una tabla de historial da trazabilidad sin nada de eso.' },

        { mito: 'Con CQRS completo la interfaz no cambia.',
          realidad: 'Cambia en <b>todos lados</b>: la lectura queda desactualizada, así que cada pantalla tiene que contemplar que lo recién creado ' +
                    'todavía no aparece.' },

        { mito: 'Uso refresh materialized view y listo.',
          realidad: 'Sin <code>concurrently</code> —que requiere un índice único— el refresco <b>bloquea todas las lecturas</b> de la vista. ' +
                    'Se descubre en producción, cuando el panel se congela cada hora.' },
      ],

      glosario: [
        { t: 'CQRS', d: 'Separar el modelo de lectura del de escritura. Tiene tres niveles de intensidad.' },
        { t: 'Vista materializada', d: 'Resultado de una consulta guardado en disco y refrescado a demanda.' },
        { t: 'concurrently', d: 'Modo de refresco que no bloquea lecturas. Requiere un índice único.' },
        { t: 'Event sourcing', d: 'Guardar la secuencia de eventos en vez del estado actual.' },
        { t: 'Proyección', d: 'Vista del estado construida reproduciendo eventos.' },
        { t: 'Migración de eventos', d: 'Traducción de formatos viejos a nuevos. No se puede borrar.' },
        { t: 'Tabla de historial', d: 'Registro de cambios con quién, qué y cuándo. La alternativa práctica.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Diseñar eventos que no te arruinen la vida',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un evento es un <b>contrato público</b>. Una vez
que alguien lo consume, cambiarlo cuesta lo mismo que cambiar una API — con el agravante de que no sabés
quién lo está escuchando.</div>

<h4>Nombrar en pasado, siempre</h4>
<pre><code>❌  crear-pedido        ← eso es una orden, no un hecho
❌  procesarPago        ← igual
✔  pedido.creado
✔  pago.recibido
✔  cliente.dado.de.baja</code></pre>

<p>Un evento describe <b>algo que ya pasó</b>. Si el nombre está en imperativo, en realidad estás usando la
cola para dar órdenes, y ahí el emisor sabe lo que tiene que ocurrir después — que es justo lo que querías
evitar.</p>

<div class="aviso"><strong>La diferencia no es de estilo: cambia quién decide.</strong> Con
<code>enviar-email-de-bienvenida</code>, quien emite decidió que hay que mandar un email. Con
<code>cliente.dado.de.alta</code>, el emisor informa un hecho y <b>cada suscriptor decide qué hacer</b> — que
es lo que permite agregar reacciones sin tocar el emisor.</div>

<h4>Qué poner adentro</h4>
<p>Hay dos escuelas y las dos sirven, para cosas distintas:</p>

<p><b>Delgado</b> — solo identificadores. Quien reacciona consulta lo que necesita.</p>
<pre><code>{ tipo: 'pedido.confirmado', pedidoId: 'p-1', tenantId: 't-9' }</code></pre>

<p><b>Gordo</b> — los datos relevantes incluidos.</p>
<pre><code>{ tipo: 'pedido.confirmado', pedidoId: 'p-1', total: 15000, email: '…', items: [...] }</code></pre>

<table>
<tr><th></th><th>Delgado</th><th>Gordo</th></tr>
<tr><td>Datos siempre frescos</td><td>✔</td><td>✘</td></tr>
<tr><td>Funciona si el emisor está caído</td><td>✘</td><td>✔</td></tr>
<tr><td>Contrato chico y estable</td><td>✔</td><td>✘</td></tr>
<tr><td>Sin consultas extra</td><td>✘</td><td>✔</td></tr>
</table>

<div class="dato"><strong>La recomendación práctica: <b>delgado con lo mínimo indispensable para decidir</b>.</strong>
Identificadores más los pocos campos que un suscriptor necesitaría para decidir <b>si le interesa</b> — por
ejemplo el tipo o el monto— sin tener que consultar. Todo evento con más de diez campos casi siempre está
exponiendo el modelo interno del emisor.</div>
`,

      tecnico: `
<h4>Versionar desde el día uno</h4>
<pre><code>{
  "id": "evt_01H…",              // único: para deduplicar
  "tipo": "pedido.confirmado",
  "version": 1,                  // ← desde el primer evento
  "ocurridoEn": "2026-08-08T14:23:00Z",
  "tenantId": "t-9",
  "datos": { "pedidoId": "p-1", "total": 1500000 }
}</code></pre>

<div class="dato"><strong>Los cuatro campos de arriba de <code>datos</code> son los que se olvidan y los que
más falta hacen después.</strong> El <code>id</code> permite deduplicar; <code>version</code> permite evolucionar;
<code>ocurridoEn</code> distingue cuándo pasó de cuándo se procesó —que pueden diferir en horas si hubo un
atraso—; y <code>tenantId</code> permite filtrar y auditar por cliente sin abrir el contenido. ' +
Agregarlos al principio cuesta nada; agregarlos después implica manejar eventos con y sin ellos para siempre.</div>

<h4>Evolución compatible</h4>
<table>
<tr><th>Cambio</th><th>¿Compatible?</th></tr>
<tr><td>Agregar un campo opcional</td><td>✔ Sí</td></tr>
<tr><td>Agregar un tipo de evento nuevo</td><td>✔ Sí</td></tr>
<tr><td>Quitar un campo</td><td>✘ No</td></tr>
<tr><td>Renombrar un campo</td><td>✘ No</td></tr>
<tr><td>Cambiar el tipo de un campo</td><td>✘ No</td></tr>
<tr><td>Volver obligatorio un campo opcional</td><td>✘ No</td></tr>
</table>

<p>Para un cambio incompatible: <b>emitir las dos versiones</b> un tiempo, migrar los consumidores, y recién
después dejar de emitir la vieja.</p>

<div class="dato"><strong>Y el problema que hace todo esto más difícil que con una API:</strong> con una API
sabés quién la consume porque hay peticiones con identificación. Con eventos, <b>no sabés quién escucha</b> — ' +
por eso hace falta un registro explícito de suscriptores por evento, o vas a quedarte emitiendo las dos
versiones para siempre por miedo a romper algo.</div>

<h4>Qué NO poner en un evento</h4>
<ul>
<li><b>Datos sensibles.</b> Los eventos se persisten, se replican y quedan en logs.</li>
<li><b>El modelo interno completo.</b> Atás a los consumidores a tu estructura.</li>
<li><b>Objetos grandes.</b> Poné una referencia y que el consumidor lo descargue.</li>
<li><b>Estado que va a cambiar.</b> Un evento describe un instante, no el presente.</li>
</ul>

<h4>El catálogo de eventos</h4>
<p>El documento que evita el desorden. Por cada evento:</p>
<pre><code>pedido.confirmado          v1

Cuándo se emite   Cuando un pedido pasa de 'pendiente' a 'confirmado'
                  y la transacción se confirmó.
Emisor            módulo pedidos
Datos             pedidoId, tenantId, total (centavos), email
Suscriptores      facturación (crea la factura)
                  depósito (prepara el envío)
                  analítica (registra la conversión)
Garantía          al menos una vez, sin orden garantizado
Frecuencia        ~200/día</code></pre>

<div class="dato"><strong>La línea de suscriptores es la que más valor tiene con el tiempo.</strong> Es lo
único que te permite responder "¿puedo cambiar este evento?" sin adivinar. Sin ese registro, cambiar un evento
es una apuesta — y en la práctica lleva a no cambiarlos nunca, así que el contrato se vuelve deuda permanente.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <rect x="24" y="28" width="632" height="46" rx="10" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="340" y="50" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="700">
    Un evento es un CONTRATO PÚBLICO — con el agravante de que no sabés quién lo escucha.</text>
  <text x="340" y="67" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">
    Con una API sabés quién la consume. Con eventos hace falta un registro explícito de suscriptores.</text>

  <text x="24" y="100" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    NOMBRAR EN PASADO — no es estilo: cambia QUIÉN DECIDE</text>

  <rect x="24" y="112" width="304" height="72" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="132" fill="#f87171" font-size="10.5" font-family="monospace" font-weight="700">enviar-email-de-bienvenida</text>
  <text x="44" y="152" fill="currentColor" opacity=".72" font-size="10.5">quien emite ya decidió qué hay que hacer</text>
  <text x="44" y="172" fill="#f87171" font-size="10.5" font-weight="700">es una orden disfrazada de evento</text>

  <rect x="352" y="112" width="304" height="72" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="372" y="132" fill="#34d399" font-size="10.5" font-family="monospace" font-weight="700">cliente.dado.de.alta</text>
  <text x="372" y="152" fill="currentColor" opacity=".72" font-size="10.5">el emisor informa un HECHO</text>
  <text x="372" y="172" fill="#34d399" font-size="10.5" font-weight="700">cada suscriptor decide qué hacer</text>

  <text x="24" y="212" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS CUATRO CAMPOS QUE SE OLVIDAN — y que después no se pueden agregar sin dolor</text>

  <rect x="24" y="224" width="152" height="52" rx="9" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="100" y="244" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-family="monospace" font-weight="700">id</text>
  <text x="100" y="264" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">para deduplicar</text>

  <rect x="188" y="224" width="152" height="52" rx="9" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="264" y="244" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-family="monospace" font-weight="700">version</text>
  <text x="264" y="264" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">para evolucionar</text>

  <rect x="352" y="224" width="152" height="52" rx="9" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="428" y="244" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-family="monospace" font-weight="700">ocurridoEn</text>
  <text x="428" y="262" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">cuándo pasó ≠</text>
  <text x="428" y="273" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">cuándo se procesó</text>

  <rect x="516" y="224" width="140" height="52" rx="9" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="586" y="244" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-family="monospace" font-weight="700">tenantId</text>
  <text x="586" y="264" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">filtrar y auditar</text>

  <rect x="24" y="288" width="304" height="48" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="176" y="306" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">DELGADO CON LO MÍNIMO PARA DECIDIR</text>
  <text x="44" y="326" fill="currentColor" opacity=".7" font-size="10">ids + los pocos campos que definen si a alguien le interesa</text>

  <rect x="352" y="288" width="304" height="48" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="504" y="306" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">MÁS DE 10 CAMPOS</text>
  <text x="372" y="326" fill="#f87171" font-size="10" font-weight="700">casi siempre estás exponiendo tu modelo interno</text>

  <rect x="24" y="346" width="632" height="40" rx="9" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="44" y="364" fill="#7c5cff" font-size="11.5" font-weight="700">EL CATÁLOGO: la línea de SUSCRIPTORES es la que más vale con el tiempo.</text>
  <text x="44" y="380" fill="currentColor" opacity=".75" font-size="10.5">
    Es lo único que permite responder “¿puedo cambiar este evento?” sin adivinar. Sin ella, no se cambian nunca y el contrato se vuelve deuda.</text>
</svg>`,
        pie: 'Nombrado en pasado, versionado desde el primero, y con un catálogo que diga quién escucha.',
      },

      entrevista: [
        { p: '¿Por qué los eventos se nombran en pasado?',
          r: 'Porque describen <b>algo que ya pasó</b>, y eso cambia quién decide. Con <code>enviar-email-de-bienvenida</code>, quien emite ya decidió ' +
             'qué hay que hacer: es una orden disfrazada de evento. Con <code>cliente.dado.de.alta</code>, el emisor informa un hecho y ' +
             '<b>cada suscriptor decide qué hacer con él</b> — que es exactamente lo que permite agregar reacciones nuevas sin tocar el emisor. ' +
             'Si tus eventos están en imperativo, en realidad estás usando la cola para dar órdenes.' },

        { p: '¿Evento delgado o gordo?',
          r: '<b>Delgado con lo mínimo indispensable para decidir</b>: identificadores más los pocos campos que un suscriptor necesitaría para saber ' +
             '<b>si le interesa</b>, como el tipo o el monto, sin tener que consultar. El delgado puro obliga a consultar siempre y falla si el emisor ' +
             'está caído; el gordo lleva datos que pueden quedar viejos y ata a los consumidores a tu estructura. ' +
             'Como regla: <b>un evento con más de diez campos casi siempre está exponiendo el modelo interno del emisor</b>.' },

        { p: '¿Qué campos debe llevar todo evento desde el primer día?',
          r: 'Cuatro que casi siempre se olvidan: <b><code>id</code></b> único para deduplicar, <b><code>version</code></b> para poder evolucionar, ' +
             '<b><code>ocurridoEn</code></b> —porque cuándo pasó y cuándo se procesó pueden diferir en horas si hubo atraso— y ' +
             '<b><code>tenantId</code></b> para filtrar y auditar sin abrir el contenido. Agregarlos al principio cuesta nada; ' +
             'agregarlos después implica manejar eventos con y sin ellos <b>para siempre</b>.' },

        { p: '¿Por qué es más difícil cambiar un evento que una API?',
          r: 'Porque con una API <b>sabés quién la consume</b>: hay peticiones con identificación y métricas de uso. Con eventos ' +
             '<b>no sabés quién escucha</b>, así que "¿puedo cambiar esto?" es una apuesta. Por eso hace falta un <b>catálogo</b> con un registro ' +
             'explícito de suscriptores por evento. Sin él, en la práctica los eventos no se cambian nunca por miedo a romper algo, ' +
             'y el contrato se convierte en deuda permanente.' },
      ],

      practica: `
<h4>Esquema base de todo evento</h4>
<pre><code>import { z } from 'zod';

export const Sobre = z.object({
  id: z.string(),                     // único: deduplicación
  tipo: z.string(),
  version: z.number().int().positive(),
  ocurridoEn: z.string().datetime(),
  tenantId: z.string().uuid(),
  datos: z.unknown(),
});

export const PedidoConfirmadoV1 = Sobre.extend({
  tipo: z.literal('pedido.confirmado'),
  version: z.literal(1),
  datos: z.object({
    pedidoId: z.string().uuid(),
    totalCentavos: z.number().int(),
    email: z.string().email(),
  }),
});</code></pre>

<div class="aviso"><strong>Validar el evento <b>al consumirlo</b> y no solo al emitirlo es lo que evita el bug
más frustrante:</strong> un emisor que cambió el formato sin avisar y un consumidor que empieza a escribir
<code>undefined</code> en la base sin lanzar ningún error. Con validación en el borde, falla ruidosamente
y va a la cola de descarte.</div>

<h4>Emitir dos versiones durante una transición</h4>
<pre><code>// Mientras los consumidores migran, se emiten ambas
await emitir({ tipo: 'pedido.confirmado', version: 1, datos: { total: p.total } });
await emitir({ tipo: 'pedido.confirmado', version: 2, datos: { totalCentavos: p.totalCentavos } });

// Cuando el catálogo dice que nadie consume la v1, se deja de emitir.</code></pre>

<h4>Catálogo de eventos, versionado con el código</h4>
<pre><code># docs/eventos/pedido.confirmado.md

## pedido.confirmado · v1

**Se emite cuando** un pedido pasa de 'pendiente' a 'confirmado'
y la transacción se confirmó (nunca antes del commit).

**Emisor** módulo &#96;pedidos&#96;

**Datos** pedidoId · totalCentavos · email

**Suscriptores**
| Módulo       | Qué hace                    | Contacto |
|--------------|-----------------------------|----------|
| facturación  | crea la factura             | …        |
| depósito     | genera la orden de armado   | …        |
| analítica    | registra la conversión      | …        |

**Garantías** al menos una vez · sin orden garantizado
**Frecuencia** ~200/día · picos de 50/min los lunes</code></pre>

<h4>Checklist de un evento nuevo</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Nombre en <b>pasado</b>, describe un hecho</td></tr>
<tr><td>☐</td><td>Tiene <code>id</code>, <code>version</code>, <code>ocurridoEn</code> y <code>tenantId</code></td></tr>
<tr><td>☐</td><td>Delgado: solo lo mínimo para decidir</td></tr>
<tr><td>☐</td><td>Sin datos sensibles ni objetos grandes</td></tr>
<tr><td>☐</td><td>Esquema validado <b>al consumir</b>, no solo al emitir</td></tr>
<tr><td>☐</td><td>Se emite <b>después</b> del commit</td></tr>
<tr><td>☐</td><td>Está en el catálogo, con sus suscriptores</td></tr>
<tr><td>☐</td><td>El consumidor es idempotente</td></tr>
</table>
`,

      errores: [
        { mito: 'El nombre del evento es una cuestión de estilo.',
          realidad: 'Cambia <b>quién decide</b>. Un nombre en imperativo significa que el emisor ya resolvió qué hay que hacer, ' +
                    'y ahí perdiste el desacoplamiento que motivaba usar eventos.' },

        { mito: 'Pongo todo el objeto en el evento, así nadie tiene que consultar.',
          realidad: 'Atás a los consumidores a tu <b>modelo interno</b> y los datos quedan viejos. Un evento con más de diez campos casi siempre está ' +
                    'exponiendo la estructura del emisor.' },

        { mito: 'Agrego la versión cuando haga falta.',
          realidad: 'Para entonces hay eventos con y sin ella, y vas a manejar los dos casos <b>para siempre</b>. Lo mismo con <code>id</code>, ' +
                    '<code>ocurridoEn</code> y <code>tenantId</code>: cuestan nada al principio.' },

        { mito: 'Valido el evento al emitirlo, con eso alcanza.',
          realidad: 'El bug frustrante es al revés: el emisor cambió el formato y el consumidor empieza a escribir <code>undefined</code> ' +
                    '<b>sin ningún error</b>. Validar al consumir hace que falle ruidosamente y vaya a la cola de descarte.' },
      ],

      glosario: [
        { t: 'Evento', d: 'Registro de un hecho ocurrido. Se nombra en pasado.' },
        { t: 'Sobre', d: 'Campos comunes a todo evento: id, tipo, versión, momento y tenant.' },
        { t: 'Evento delgado', d: 'Lleva identificadores y lo mínimo para decidir.' },
        { t: 'Evento gordo', d: 'Lleva los datos completos. Ata al consumidor al modelo del emisor.' },
        { t: 'Catálogo de eventos', d: 'Documento con cada evento, sus datos y sus suscriptores.' },
        { t: 'Cambio compatible', d: 'Agregar campos opcionales o tipos nuevos. Quitar o renombrar no lo es.' },
        { t: 'Transición de versión', d: 'Emitir dos versiones hasta que todos los consumidores migren.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es la diferencia entre una cola y pub/sub?',
      opciones: [
        'La cola es trabajo diferido con un consumidor; pub/sub es notificación con varios independientes',
        'Son sinónimos con distinta implementación',
        'La cola es más rápida',
        'Pub/sub garantiza el orden y la cola no',
      ],
      correcta: 0,
      porQue: 'En una cola, si falla se reintenta el mismo trabajo. En pub/sub, cada suscriptor falla o tiene éxito por separado y necesita su propia política — mezclarlos produce cuatro emails.',
      porQueNo: {
        1: 'Resuelven problemas distintos, no es solo implementación.',
        2: 'La velocidad depende del proveedor, no del modelo.',
        3: 'Ninguno garantiza orden por defecto.',
      },
    },
    {
      p: '¿Qué pregunta define si algo va como evento o dentro de la transacción?',
      opciones: [
        '"Si esto falla, ¿la operación principal sigue siendo válida?"',
        '"¿Cuánto tarda en ejecutarse?"',
        '"¿Cuántos módulos están involucrados?"',
        '"¿Es una operación de escritura?"',
      ],
      correcta: 0,
      porQue: 'Descontar stock al confirmar un pedido no es un evento: si falla, el pedido no debería quedar confirmado. Registrar una métrica sí puede fallar sin invalidar nada.',
      porQueNo: {
        1: 'La duración importa para elegir cola, no para decidir si va en la transacción.',
        2: 'La cantidad de módulos no determina la atomicidad requerida.',
        3: 'Muchas escrituras van perfectamente por evento.',
      },
    },
    {
      p: '¿Qué es el problema de la doble escritura y cómo se resuelve?',
      opciones: [
        'Guardar el dato y publicar el evento pueden fallar por separado; se resuelve con una bandeja de salida',
        'Escribir dos veces la misma fila; se resuelve con un índice único',
        'Duplicar datos entre módulos; se resuelve normalizando',
        'Escribir en dos bases; se resuelve con transacciones distribuidas',
      ],
      correcta: 0,
      porQue: 'El evento se escribe en la misma transacción que el dato, en una tabla, y un proceso aparte lo publica. Si la transacción falla no queda nada; si tiene éxito quedan los dos.',
      porQueNo: {
        1: 'Ese es otro problema, de unicidad.',
        2: 'La duplicación entre contextos a veces es deliberada.',
        3: 'Las transacciones distribuidas son otra cosa y rara vez se usan.',
      },
    },
    {
      p: '¿Realtime de Supabase sirve para disparar lógica de negocio?',
      opciones: [
        'No: si el cliente está desconectado el mensaje se pierde sin reintento ni rastro',
        'Sí, es equivalente a una cola',
        'Sí, si se combina con un índice',
        'Solo para operaciones de lectura',
      ],
      correcta: 0,
      porQue: 'Es notificación en vivo para actualizar una pantalla. Usarlo para lógica produce trabajos que a veces no ocurren, sin ninguna señal de error — el peor tipo de falla.',
      porQueNo: {
        1: 'No persiste ni reintenta: no es una cola.',
        2: 'Los índices no tienen relación con la entrega de mensajes.',
        3: 'La limitación no es de tipo de operación sino de persistencia.',
      },
    },
    {
      p: '¿Por qué no existe la entrega "exactamente una vez"?',
      opciones: [
        'Porque el consumidor procesa y después confirma: si se cae en el medio, nadie sabe si se hizo',
        'Porque las redes pierden paquetes',
        'Porque los relojes no están sincronizados',
        'Porque las colas no persisten los mensajes',
      ],
      correcta: 0,
      porQue: 'Quien promete "exactamente una vez" ofrece al menos una vez más deduplicación. La conclusión práctica es hacer que llegar dos veces no importe.',
      porQueNo: {
        1: 'Es una causa de pérdida, no la razón de la imposibilidad.',
        2: 'Afecta al orden, no a la cantidad de entregas.',
        3: 'Las colas persistentes sí guardan los mensajes.',
      },
    },
    {
      p: 'Al deduplicar, ¿dónde debe ir la marca de "ya procesado"?',
      opciones: [
        'En la misma transacción que el trabajo',
        'Antes del trabajo, para no repetirlo',
        'Después del trabajo, en otra transacción',
        'En memoria, para que sea rápido',
      ],
      correcta: 0,
      porQue: 'Marcar antes y fallar pierde el mensaje para siempre; marcar después y morir en el medio lo reprocesa. Juntos, o las dos cosas ocurren o ninguna.',
      porQueNo: {
        1: 'Si el trabajo falla, el mensaje queda marcado y se pierde.',
        2: 'Si el proceso muere entre ambas, se reprocesa.',
        3: 'Se pierde con cada reinicio del proceso.',
      },
    },
    {
      p: '¿Por qué usar una versión en vez de una marca de tiempo para descartar eventos atrasados?',
      opciones: [
        'Porque los relojes de distintas máquinas no están sincronizados: una versión de la base es un orden verdadero',
        'Porque las versiones ocupan menos espacio',
        'Porque las marcas de tiempo no se pueden comparar',
        'Porque las versiones son más legibles',
      ],
      correcta: 0,
      porQue: 'Dos eventos pueden tener marcas que no reflejan el orden real. Una versión incrementada por la base sí lo refleja.',
      porQueNo: {
        1: 'La diferencia de tamaño es irrelevante.',
        2: 'Se pueden comparar; el problema es que pueden mentir.',
        3: 'La legibilidad no es el criterio.',
      },
    },
    {
      p: '¿Qué falta si tenés una cola de descarte?',
      opciones: [
        'Que alguien la mire: sin alerta ni revisión, el trabajo desaparece en silencio',
        'Que tenga índice',
        'Que se borre automáticamente',
        'Que esté en otra base',
      ],
      correcta: 0,
      porQue: 'Las facturas que no se generaron están ahí, y nadie se entera hasta que un cliente reclama.',
      porQueNo: {
        1: 'Ayuda al rendimiento pero no resuelve el problema.',
        2: 'Borrarla automáticamente destruye la evidencia del problema.',
        3: 'Su ubicación no cambia que nadie la revise.',
      },
    },
    {
      p: '¿Qué nivel de CQRS resuelve el 95% de los casos donde alguien propone el completo?',
      opciones: [
        'El medio: vistas materializadas o tablas de lectura en la misma base',
        'El leve: tipos distintos para leer y escribir',
        'El completo, no hay alternativa',
        'Ninguno: hace falta event sourcing',
      ],
      correcta: 0,
      porQue: 'Da consultas de lectura rapidísimas sobre datos preprocesados, sin base separada, sin sincronización y sin desfase impredecible: vos controlás cuándo se refresca.',
      porQueNo: {
        1: 'Es útil y ya se hace, pero no resuelve consultas caras.',
        2: 'Solo se justifica con escalas muy distintas entre lectura y escritura.',
        3: 'Event sourcing es otro patrón y mucho más caro.',
      },
    },
    {
      p: '¿Cuál es el costo de CQRS completo que menos se menciona?',
      opciones: [
        'Que la lectura queda desactualizada y cada pantalla del producto debe contemplarlo',
        'El costo de la segunda base',
        'La complejidad del código de escritura',
        'La necesidad de más tests',
      ],
      correcta: 0,
      porQue: 'El usuario crea algo, lo redirigís al listado y no está. Es trabajo de interfaz en todos lados, no solo un problema del backend.',
      porQueNo: {
        1: 'Es real pero menor y previsible.',
        2: 'El modelo de escritura suele quedar más simple.',
        3: 'Los tests aumentan, pero no es el costo principal.',
      },
    },
    {
      p: '¿Cuál es el costo de mantenimiento de event sourcing que nadie proyecta?',
      opciones: [
        'Las funciones que migran eventos de formatos viejos no se pueden borrar nunca',
        'El espacio en disco del registro',
        'La velocidad de escritura',
        'La falta de librerías',
      ],
      correcta: 0,
      porQue: 'Los eventos viejos siguen en el registro y hay que poder reproducirlos, así que el código acumula una capa de traducción por cada cambio de formato de la historia del sistema.',
      porQueNo: {
        1: 'Es un costo real pero menor y previsible.',
        2: 'Escribir eventos suele ser rápido: el costo está en la lectura.',
        3: 'Existen implementaciones maduras.',
      },
    },
    {
      p: 'Si el requisito es auditoría, ¿qué conviene?',
      opciones: [
        'Una tabla de historial: qué cambió, quién y cuándo',
        'Event sourcing, que da auditoría por diseño',
        'Guardar los logs de la aplicación',
        'Una réplica de la base',
      ],
      correcta: 0,
      porQue: 'Da trazabilidad completa, se consulta con SQL normal y no tiene ninguno de los costos de event sourcing: ni migración de formatos acumulada, ni problema para borrar datos personales.',
      porQueNo: {
        1: 'Resuelve más de lo pedido a un costo muy alto e irreversible.',
        2: 'Los logs se rotan y no están pensados para consultas de negocio.',
        3: 'Una réplica tiene el estado actual, no el historial.',
      },
    },
    {
      p: '¿Por qué los eventos se nombran en pasado?',
      opciones: [
        'Porque describen un hecho: si está en imperativo, el emisor ya decidió qué hay que hacer',
        'Por convención de la industria',
        'Para que sea más fácil buscarlos',
        'Porque los verbos en presente están reservados',
      ],
      correcta: 0,
      porQue: 'Con "cliente.dado.de.alta" cada suscriptor decide qué hacer, y por eso se pueden agregar reacciones sin tocar el emisor. Con "enviar-email" perdiste ese desacoplamiento.',
      porQueNo: {
        1: 'Hay una razón funcional detrás de la convención.',
        2: 'La búsqueda no depende del tiempo verbal.',
        3: 'No hay nada reservado: es una decisión de diseño.',
      },
    },
    {
      p: '¿Qué campos debe llevar todo evento desde el primer día?',
      opciones: [
        'id, version, ocurridoEn y tenantId',
        'Solo el tipo y los datos',
        'El usuario que lo originó y la IP',
        'El estado completo de la entidad',
      ],
      correcta: 0,
      porQue: 'El id deduplica, la versión permite evolucionar, ocurridoEn distingue cuándo pasó de cuándo se procesó, y tenantId permite filtrar sin abrir el contenido. Agregarlos después implica manejar eventos con y sin ellos para siempre.',
      porQueNo: {
        1: 'Sin id ni versión, deduplicar y evolucionar se vuelve muy difícil.',
        2: 'La IP suele ser dato sensible innecesario en un evento.',
        3: 'Eso es un evento gordo que ata a los consumidores al modelo interno.',
      },
    },
    {
      p: '¿Por qué es más difícil cambiar un evento que una API?',
      opciones: [
        'Porque no sabés quién lo escucha: hace falta un catálogo con los suscriptores registrados',
        'Porque los eventos son binarios',
        'Porque no se pueden versionar',
        'Porque viajan por una cola',
      ],
      correcta: 0,
      porQue: 'Con una API hay peticiones identificadas y métricas de uso. Sin catálogo, cambiar un evento es una apuesta — y en la práctica lleva a no cambiarlos nunca.',
      porQueNo: {
        1: 'El formato suele ser JSON, igual que en una API.',
        2: 'Se versionan perfectamente; el problema es saber quién usa cada versión.',
        3: 'El transporte no es lo que dificulta el cambio.',
      },
    },
  ],
});
