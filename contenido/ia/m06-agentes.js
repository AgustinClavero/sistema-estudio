/* ==========================================================================
   IA · Módulo 06 — Tool calling y agentes
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ia',
  id: 'm06',
  titulo: 'Tool calling y agentes',
  fuentes: ['anthropic', 'mcp', 'owasp-llm'],

  intro:
    '<p>"Agente" es la palabra más usada y peor definida del rubro. En una entrevista, quien la usa con precisión ' +
    'se nota inmediatamente — y quien la usa como sinónimo de "chatbot", también.</p>' +
    '<p>Este módulo te da el mecanismo real: qué es el <i>tool calling</i>, cómo funciona el bucle de un agente, ' +
    'cómo se le da memoria, y —lo más valioso— <b>cuándo NO conviene usar uno</b>. Esa última parte es la que ' +
    'demuestra criterio.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Tool calling: cómo el modelo hace cosas',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el modelo <b>no ejecuta nada</b>. Te <i>pide</i>
que ejecutes algo y espera el resultado. Es un asesor por teléfono, no alguien con las llaves de tu oficina.</div>

<p>Esta es la confusión más extendida sobre agentes. La secuencia real es:</p>

<ol>
<li><b>Vos</b> le declarás qué funciones existen: nombre, para qué sirven, qué parámetros llevan.</li>
<li>El usuario pregunta algo.</li>
<li>El modelo responde: <i>"para contestar eso necesito que ejecutes <code>buscarCliente</code> con
<code>{ email: 'ana@ejemplo.com' }</code>"</i>.</li>
<li><b>Tu código</b> decide si la ejecuta, la ejecuta, y le devuelve el resultado.</li>
<li>El modelo usa ese resultado para responder.</li>
</ol>

<div class="aviso"><strong>El paso 4 es todo el asunto de la seguridad.</strong> El modelo <b>pide</b>; tu
código <b>decide</b>. Ahí van los permisos, la validación de argumentos y los límites. Un agente no es
peligroso porque el modelo pueda hacer cosas — es peligroso si tu código ejecuta ciegamente lo que le
pidan.</div>

<h4>Cómo se declara una herramienta</h4>
<pre><code>{
  name: 'buscar_cliente',
  description: 'Busca un cliente por su email. Devuelve nombre, plan y estado de la cuenta.',
  input_schema: {
    type: 'object',
    properties: {
      email: { type: 'string', description: 'Email exacto del cliente' },
    },
    required: ['email'],
  },
}</code></pre>

<p><b>La <code>description</code> es el prompt de la herramienta.</b> No es documentación para vos: es lo único
que el modelo lee para decidir si usarla y cómo. Una descripción vaga produce herramientas usadas mal o no
usadas nunca.</p>

<h4>Las descripciones, bien y mal</h4>
<table>
<tr><th>❌ Mal</th><th>✅ Bien</th></tr>
<tr><td>"Busca datos"</td><td>"Busca un cliente por email exacto. Úsala cuando el usuario menciona un email. No sirve para buscar por nombre."</td></tr>
<tr><td>"Consulta la base"</td><td>"Devuelve el estado actual de un pedido por su número. Los datos son de tiempo real."</td></tr>
</table>
<p>Fijate lo que agrega la columna derecha: <b>cuándo usarla</b> y <b>cuándo no</b>. Eso es lo que evita que el
modelo la llame en el momento equivocado.</p>

<h4>Tool calling también sirve para otra cosa</h4>
<p>Un uso que ya viste en el módulo 2: declarar una herramienta que <b>nunca vas a ejecutar</b>, solo para
obtener datos con el esquema garantizado. El proveedor valida los argumentos contra tu <code>input_schema</code>,
y vos leés eso como si fuera la respuesta. Es la forma más confiable de obtener JSON válido.</p>
`,

      tecnico: `
<h4>El ciclo completo de mensajes</h4>
<pre><code>1. user      → "¿Cuál es el estado de la cuenta de ana@ejemplo.com?"

2. assistant → [ tool_use  { id: 'tu_01', name: 'buscar_cliente',
                             input: { email: 'ana@ejemplo.com' } } ]
                stop_reason: 'tool_use'

3. user      → [ tool_result { tool_use_id: 'tu_01',
                               content: '{"plan":"pro","estado":"activo"}' } ]

4. assistant → "La cuenta de Ana está activa, en el plan Pro."
                stop_reason: 'end_turn'</code></pre>

<p>Dos detalles que se preguntan:</p>
<ul>
<li>El resultado de la herramienta vuelve con rol <b><code>user</code></b>, no <code>assistant</code>. Es información que entra al contexto, no algo que el modelo dijo.</li>
<li>El <code>tool_use_id</code> <b>tiene que coincidir</b>. Con varias herramientas en paralelo, es lo que empareja cada resultado con su pedido.</li>
</ul>

<h4>Herramientas en paralelo</h4>
<p>Los modelos actuales pueden pedir varias a la vez cuando son independientes: <i>"buscá el cliente Y traé sus
últimos pedidos"</i>. Hay que ejecutarlas en paralelo y devolver <b>todos</b> los resultados en un solo mensaje.
Ejecutarlas en serie multiplica la latencia sin ninguna ganancia.</p>

<h4>Diseño de herramientas</h4>
<table>
<tr><th>Regla</th><th>Por qué</th></tr>
<tr><td><b>Pocas y bien definidas</b></td><td>Más de 15-20 y el modelo empieza a confundirlas. Agrupar es mejor que multiplicar</td></tr>
<tr><td><b>Verbo + objeto</b> en el nombre</td><td><code>crear_tarea</code>, no <code>tareas</code> ni <code>handler3</code></td></tr>
<tr><td><b>Parámetros planos</b></td><td>El anidamiento profundo baja mucho la fiabilidad</td></tr>
<tr><td><b>Enums donde se pueda</b></td><td>Elimina valores inventados en los argumentos</td></tr>
<tr><td><b>Errores descriptivos</b></td><td>"Cliente no encontrado. Verificá el email." le permite corregir. "Error 500" no</td></tr>
<tr><td><b>Salidas acotadas</b></td><td>Una herramienta que devuelve 50.000 tokens llena la ventana. Paginar o resumir</td></tr>
</table>

<div class="dato"><strong>Sobre los mensajes de error:</strong> son parte del prompt. Si tu herramienta devuelve
<code>"error: constraint violation on fk_cliente_id"</code>, el modelo no tiene forma de reaccionar bien. Si
devuelve <code>"No existe un cliente con ese email. Pedile al usuario que lo verifique o buscá por nombre con
buscar_por_nombre."</code>, el modelo se recupera solo. <b>Los errores bien escritos son la diferencia entre un
agente que se traba y uno que se corrige.</b></div>

<h4>Seguridad</h4>
<ol>
<li><b>Validá los argumentos con un esquema</b> antes de ejecutar. El modelo puede inventar valores.</li>
<li><b>Ejecutá con los permisos del usuario</b>, nunca con service role. El agente no debe poder hacer más que quien lo invocó.</li>
<li><b>Clasificá las herramientas</b>: de solo lectura, de escritura reversible, y de acción irreversible. Las últimas piden confirmación humana.</li>
<li><b>Límite duro de iteraciones.</b> Sin eso, un bucle puede quemar el presupuesto de un mes.</li>
<li><b>Nunca construyas SQL o comandos concatenando</b> lo que devolvió el modelo. Es inyección con pasos extra.</li>
</ol>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="t1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <rect x="24" y="30" width="180" height="330" rx="12" fill="#22d3ee" fill-opacity=".07" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="114" y="54" text-anchor="middle" fill="#22d3ee" font-size="12.5" font-weight="700">EL MODELO</text>
  <text x="114" y="72" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10.5">decide QUÉ hace falta</text>

  <rect x="476" y="30" width="180" height="330" rx="12" fill="#34d399" fill-opacity=".07" stroke="#34d399" stroke-width="1.4"/>
  <text x="566" y="54" text-anchor="middle" fill="#34d399" font-size="12.5" font-weight="700">TU CÓDIGO</text>
  <text x="566" y="72" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">decide SI se hace</text>

  <text x="240" y="102" fill="currentColor" opacity=".55" font-size="10.5" font-weight="700">1 · declarás las herramientas</text>
  <line x1="470" y1="112" x2="212" y2="112" stroke="#34d399" stroke-width="1.6" marker-end="url(#t1)" color="#34d399"/>

  <text x="240" y="146" fill="currentColor" opacity=".55" font-size="10.5" font-weight="700">2 · el usuario pregunta</text>

  <rect x="216" y="156" width="248" height="52" rx="8" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="340" y="176" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">3 · “EJECUTÁ buscar_cliente</text>
  <text x="340" y="194" text-anchor="middle" fill="currentColor" opacity=".75" font-size="10.5" font-family="monospace">{ email: 'ana@ejemplo.com' }”</text>
  <line x1="212" y1="182" x2="212" y2="182" stroke="none"/>
  <line x1="216" y1="182" x2="212" y2="182" stroke="none"/>
  <line x1="464" y1="182" x2="470" y2="182" stroke="#fbbf24" stroke-width="1.6" marker-end="url(#t1)" color="#fbbf24"/>

  <rect x="490" y="220" width="152" height="94" rx="9" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.5"/>
  <text x="566" y="242" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">4 · TU CÓDIGO DECIDE</text>
  <text x="504" y="262" fill="currentColor" opacity=".7" font-size="10">· ¿el esquema valida?</text>
  <text x="504" y="278" fill="currentColor" opacity=".7" font-size="10">· ¿tiene permiso?</text>
  <text x="504" y="294" fill="currentColor" opacity=".7" font-size="10">· ¿es irreversible?</text>
  <text x="504" y="308" fill="#34d399" font-size="10" font-weight="700">recién ahí, ejecuta</text>

  <rect x="216" y="248" width="248" height="44" rx="8" fill="#7c5cff" fill-opacity=".18" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="340" y="266" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">5 · resultado</text>
  <text x="340" y="283" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10" font-family="monospace">{"plan":"pro","estado":"activo"}</text>
  <line x1="486" y1="270" x2="470" y2="270" stroke="#7c5cff" stroke-width="1.6" marker-end="url(#t1)" color="#7c5cff"/>
  <line x1="216" y1="270" x2="208" y2="270" stroke="#7c5cff" stroke-width="1.6" marker-end="url(#t1)" color="#7c5cff"/>

  <rect x="216" y="308" width="248" height="38" rx="8" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="340" y="332" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">6 · “La cuenta de Ana está activa.”</text>

  <rect x="24" y="372" width="632" height="24" rx="7" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.3" stroke-dasharray="5 4"/>
  <text x="340" y="388" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    El modelo PIDE. Tu código DECIDE. Ahí van permisos, validación y límites.</text>
</svg>`,
        pie: 'El modelo nunca toca tu sistema: emite una intención que tu código evalúa.',
      },

      entrevista: [
        { p: '¿Cómo funciona el tool calling?',
          r: 'Le declarás al modelo un conjunto de funciones con nombre, descripción y esquema de parámetros. Cuando necesita una, ' +
             '<b>no la ejecuta</b>: devuelve un bloque indicando qué función quiere y con qué argumentos, y termina el turno con ' +
             '<code>stop_reason: tool_use</code>. Tu código valida los argumentos, decide si tiene permiso, la ejecuta y devuelve el resultado ' +
             'en un mensaje con rol <code>user</code>. El modelo entonces continúa. <b>La distinción clave es que el modelo emite una intención ' +
             'y tu código decide si se cumple</b> — ahí es donde van los permisos y los límites.' },

        { p: '¿Qué hace que una herramienta esté bien diseñada?',
          r: 'Sobre todo la <b>descripción</b>, que es el prompt de la herramienta: tiene que decir qué hace, <i>cuándo</i> usarla y ' +
             '<i>cuándo no</i>. Después: nombre en formato verbo-objeto, parámetros planos —el anidamiento profundo baja mucho la fiabilidad—, ' +
             'enums donde el conjunto sea cerrado, y salidas acotadas, porque una herramienta que devuelve 50.000 tokens llena la ventana. ' +
             'Y algo que se subestima: <b>mensajes de error descriptivos</b>. "No existe un cliente con ese email, verificá o buscá por nombre" ' +
             'le permite corregirse; "error 500" lo deja trabado.' },

        { p: '¿Cuáles son los riesgos de seguridad del tool calling?',
          r: 'El principal es <b>ejecutar ciegamente</b> lo que el modelo pide. Por eso: valido los argumentos contra un esquema antes de ejecutar, ' +
             'porque el modelo puede inventar valores; ejecuto con los <b>permisos del usuario</b> y nunca con service role, para que el agente no ' +
             'pueda hacer más que quien lo invocó; clasifico las herramientas en lectura, escritura reversible y acción irreversible, exigiendo ' +
             'confirmación humana en las últimas; y nunca construyo SQL ni comandos concatenando lo que devolvió el modelo, porque eso es inyección ' +
             'con un paso extra. Sumado a un <b>límite duro de iteraciones</b> para que un bucle no queme el presupuesto.' },

        { p: '¿Se pueden ejecutar varias herramientas a la vez?',
          r: 'Sí, y conviene. Los modelos actuales piden varias en paralelo cuando son independientes —"buscá el cliente y traé sus últimos pedidos"—. ' +
             'Hay que ejecutarlas en paralelo y devolver <b>todos</b> los resultados en un solo mensaje, emparejando cada uno con su ' +
             '<code>tool_use_id</code>. Ejecutarlas en serie multiplica la latencia sin ninguna ganancia, y es un error de implementación bastante común.' },
      ],

      practica: `
<h4>El bucle de herramientas, con los controles puestos</h4>
<pre><code>const MAX_ITERACIONES = 8;

export async function conHerramientas(mensajes, { usuario, tenantId }) {
  for (let i = 0; i &lt; MAX_ITERACIONES; i++) {
    const r = await llamarModelo({ mensajes, tools: HERRAMIENTAS, tenantId });

    if (r.stop_reason !== 'tool_use') return r;          // terminó

    mensajes.push({ role: 'assistant', content: r.content });

    const pedidos = r.content.filter(b =&gt; b.type === 'tool_use');

    // en PARALELO: son independientes
    const resultados = await Promise.all(pedidos.map(async (p) =&gt; {
      try {
        const def = HERRAMIENTAS_POR_NOMBRE[p.name];
        if (!def) return err(p, 'Esa herramienta no existe.');

        // 1 · el modelo puede inventar argumentos
        const args = def.esquema.safeParse(p.input);
        if (!args.success) return err(p, 'Argumentos inválidos: ' + args.error.message);

        // 2 · el agente no puede más que el usuario
        if (!puede(usuario, def.permiso)) return err(p, 'No tenés permiso para esta acción.');

        // 3 · lo irreversible no se ejecuta solo
        if (def.irreversible) return pausarParaConfirmacion(p);

        const salida = await def.ejecutar(args.data, { usuario, tenantId });
        return { type: 'tool_result', tool_use_id: p.id, content: acotar(salida) };
      } catch (e) {
        // el error vuelve al modelo: que se corrija, no que se caiga
        return err(p, mensajeUtil(e));
      }
    }));

    mensajes.push({ role: 'user', content: resultados });
  }

  throw new Error('El agente superó el límite de iteraciones');
}</code></pre>

<div class="aviso"><strong>Fijate que los errores se le devuelven al modelo en vez de lanzar una excepción.</strong>
Un agente que recibe "no existe ese cliente, probá buscando por nombre" se corrige solo en la iteración
siguiente. Uno que recibe una excepción, se cae. <b>Los errores son parte de la conversación.</b></div>

<h4>Clasificar herramientas por riesgo</h4>
<table>
<tr><th>Clase</th><th>Ejemplos</th><th>Control</th></tr>
<tr><td><b>Lectura</b></td><td>buscar, consultar, listar</td><td>Ejecución directa, con RLS</td></tr>
<tr><td><b>Escritura reversible</b></td><td>crear borrador, agregar nota</td><td>Directa, pero registrada</td></tr>
<tr><td><b>Irreversible</b></td><td>enviar email, cobrar, borrar</td><td><b>Confirmación humana obligatoria</b></td></tr>
</table>
<p>Esta clasificación es lo que hace que un agente sea desplegable. Sin ella, cualquier alucinación o prompt
injection puede terminar en un email enviado a un cliente.</p>
`,

      errores: [
        { mito: 'El modelo ejecuta las funciones.',
          realidad: 'El modelo <b>pide</b> que las ejecutes y espera el resultado. Tu código las ejecuta —o no—. Esa distinción es toda la superficie ' +
                    'de seguridad de un agente: los permisos, la validación y los límites viven en tu lado, no en el prompt.' },

        { mito: 'Con poner el nombre de la función alcanza.',
          realidad: 'La <b>descripción es el prompt de la herramienta</b> y es lo único que el modelo lee para decidir. Una descripción vaga produce ' +
                    'herramientas llamadas en el momento equivocado o no llamadas nunca. Tiene que decir cuándo usarla <b>y cuándo no</b>.' },

        { mito: 'Si la herramienta falla, lanzo una excepción.',
          realidad: 'Devolvé el error <b>al modelo</b> como resultado de la herramienta, con un mensaje que le permita reaccionar. ' +
                    'Un agente que recibe "no existe ese email, probá por nombre" se corrige solo; uno que recibe una excepción se cae. ' +
                    'Los errores son parte de la conversación.' },

        { mito: 'Le doy todas las herramientas disponibles por las dudas.',
          realidad: 'Pasadas 15-20 el modelo empieza a confundirlas y a elegir mal, y además cada definición consume tokens de contexto ' +
                    'en cada llamada. <b>Conviene agrupar en herramientas más generales</b> o seleccionar el subconjunto relevante según el contexto.' },
      ],

      glosario: [
        { t: 'Tool calling', d: 'Mecanismo por el cual el modelo solicita la ejecución de funciones declaradas. También llamado function calling.' },
        { t: 'input_schema', d: 'JSON Schema que define los parámetros de una herramienta. El proveedor valida contra él.' },
        { t: 'tool_use', d: 'Bloque de respuesta donde el modelo indica qué herramienta quiere y con qué argumentos.' },
        { t: 'tool_result', d: 'Mensaje con el resultado de la ejecución, que vuelve al modelo con rol user.' },
        { t: 'stop_reason', d: 'Motivo del fin del turno. Con valor tool_use indica que el modelo espera resultados.' },
        { t: 'Llamadas en paralelo', d: 'Varias herramientas independientes solicitadas en un mismo turno.' },
        { t: 'Herramienta irreversible', d: 'La que produce efectos que no se pueden deshacer. Requiere confirmación humana.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Qué es un agente de verdad',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La definición que conviene memorizar:</strong> un agente es un sistema donde
<b>el modelo decide qué pasos dar</b>, en un bucle, hasta cumplir un objetivo. Si los pasos los decidiste vos,
no es un agente: es un flujo con IA adentro.</div>

<p>Esa distinción es exactamente lo que se evalúa cuando preguntan "¿qué es un agente?".</p>

<h4>El espectro, de menos a más agéntico</h4>

<p><b>1 · Una sola llamada.</b> Prompt → respuesta. Sin decisiones.</p>

<p><b>2 · Cadena fija.</b> Extraer → clasificar → redactar. Los pasos y el orden los definiste vos. Determinista
y fácil de depurar. <b>La mayoría de los "agentes" en producción son esto</b>, y está muy bien.</p>

<p><b>3 · Ruteo.</b> El modelo elige <i>una</i> de varias ramas y ahí termina. Una decisión, no un bucle.</p>

<p><b>4 · Agente con herramientas.</b> El modelo decide qué herramientas usar, en qué orden y cuándo parar.
<b>Acá empieza lo agéntico de verdad</b>: hay un bucle y el control lo tiene el modelo.</p>

<p><b>5 · Multi-agente.</b> Varios agentes especializados que se coordinan. Máxima flexibilidad, máxima
dificultad para depurar y controlar el costo.</p>

<div class="aviso"><strong>La regla de ingeniería:</strong> <b>usá el nivel más bajo que resuelva el
problema</b>. Cada escalón agrega latencia, costo, imprevisibilidad y superficie de fallo. Subir de nivel
porque suena mejor es la forma más rápida de construir algo caro, lento e imposible de depurar.</div>

<h4>El bucle</h4>
<pre><code>mientras (no terminó y quedan iteraciones):
    el modelo piensa qué hace falta
    ¿pide una herramienta?
        sí  → la ejecutás y le devolvés el resultado
        no  → terminó: devolvés su respuesta</code></pre>

<p>Eso es todo. Un agente no es magia: es un <code>while</code> con una llamada al modelo adentro. Lo que lo
hace difícil no es el bucle, es <b>todo lo que hay que ponerle alrededor</b> para que sea seguro, acotado y
depurable.</p>
`,

      tecnico: `
<h4>Componentes de un agente</h4>
<table>
<tr><th>Componente</th><th>Función</th></tr>
<tr><td><b>Objetivo</b></td><td>Qué tiene que lograr y cuál es el criterio de terminación</td></tr>
<tr><td><b>Herramientas</b></td><td>Qué puede hacer sobre el mundo</td></tr>
<tr><td><b>Bucle de control</b></td><td>Ejecución iterativa con límites duros</td></tr>
<tr><td><b>Memoria de trabajo</b></td><td>El historial de la sesión: qué hizo y qué obtuvo</td></tr>
<tr><td><b>Criterio de parada</b></td><td>Éxito, límite de iteraciones, límite de tokens, límite de costo, error irrecuperable</td></tr>
<tr><td><b>Observabilidad</b></td><td>Traza de cada paso. <b>Sin esto un agente es indepurable</b></td></tr>
</table>

<h4>ReAct</h4>
<p>El patrón clásico (2022): alternar <b>razonamiento</b> y <b>acción</b>.</p>
<pre><code>Pensamiento: necesito saber el plan del cliente.
Acción:      buscar_cliente({ email: "ana@ejemplo.com" })
Observación: { plan: "pro", estado: "activo" }
Pensamiento: es plan Pro, así que aplica el descuento del 20%.
Acción:      calcular_precio({ plan: "pro", items: 3 })
Observación: { total: 4800 }
Respuesta:   El total con tu descuento Pro es $4.800.</code></pre>
<p>Hoy esto está incorporado en el tool calling nativo, pero el nombre sigue apareciendo en entrevistas y en
documentación de frameworks.</p>

<h4>Los cuatro límites que no son opcionales</h4>
<ol>
<li><b>Iteraciones</b> — típicamente 5-15. Superarlo casi siempre significa que el agente está trabado.</li>
<li><b>Tokens por sesión</b> — corta escaladas descontroladas de contexto.</li>
<li><b>Costo por sesión</b> — el corte duro en dinero.</li>
<li><b>Tiempo total</b> — un agente que lleva cinco minutos no va a mejorar en el sexto.</li>
</ol>

<div class="dato"><strong>El modo de falla más caro es el bucle silencioso:</strong> el agente llama la misma
herramienta una y otra vez con argumentos ligeramente distintos, sin avanzar. Cada iteración cuesta dinero y
suma contexto. Se detecta comparando las llamadas recientes: <b>si repite la misma herramienta con los mismos
argumentos dos veces seguidas, cortá</b>. Son diez líneas y evitan facturas absurdas.</p></div>

<h4>Costo real de un agente</h4>
<p>Un agente de 6 iteraciones no cuesta 6 llamadas: cuesta más, porque <b>el contexto crece en cada vuelta</b>.
La iteración 6 reenvía todo lo anterior.</p>
<pre><code>iteración 1:  2.000 tokens
iteración 2:  3.200
iteración 3:  4.800
iteración 4:  6.100
iteración 5:  7.500
iteración 6:  9.200
              ─────
total:       32.800 tokens  ≈ 16 veces una llamada simple</code></pre>
<p>Por eso el prompt caching y los límites de iteración no son optimizaciones: son requisitos.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL ESPECTRO — usá el nivel MÁS BAJO que resuelva el problema</text>

  <rect x="24" y="36" width="120" height="60" rx="9" fill="#34d399" fill-opacity=".22" stroke="#34d399" stroke-width="1.3"/>
  <text x="84" y="58" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">1 · UNA LLAMADA</text>
  <text x="84" y="76" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">prompt → respuesta</text>
  <text x="84" y="90" text-anchor="middle" fill="currentColor" opacity=".45" font-size="9">sin decisiones</text>

  <rect x="152" y="36" width="120" height="60" rx="9" fill="#34d399" fill-opacity=".18" stroke="#34d399" stroke-width="1.3"/>
  <text x="212" y="58" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">2 · CADENA FIJA</text>
  <text x="212" y="76" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">vos definís los pasos</text>
  <text x="212" y="90" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">la mayoría en prod</text>

  <rect x="280" y="36" width="120" height="60" rx="9" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="340" y="58" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">3 · RUTEO</text>
  <text x="340" y="76" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">elige UNA rama</text>
  <text x="340" y="90" text-anchor="middle" fill="currentColor" opacity=".45" font-size="9">una decisión, sin bucle</text>

  <rect x="408" y="36" width="120" height="60" rx="9" fill="#fbbf24" fill-opacity=".22" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="468" y="54" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">4 · AGENTE</text>
  <text x="468" y="72" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">el modelo decide</text>
  <text x="468" y="86" text-anchor="middle" fill="#fbbf24" font-size="9" font-weight="700">acá empieza el bucle</text>

  <rect x="536" y="36" width="120" height="60" rx="9" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.3"/>
  <text x="596" y="58" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">5 · MULTI-AGENTE</text>
  <text x="596" y="76" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">varios coordinados</text>
  <text x="596" y="90" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">difícil de depurar</text>

  <text x="24" y="118" fill="#34d399" font-size="10.5">← más simple, barato, predecible</text>
  <text x="656" y="118" text-anchor="end" fill="#f87171" font-size="10.5">más flexible, caro, imprevisible →</text>

  <line x1="24" y1="136" x2="656" y2="136" stroke="currentColor" opacity=".18"/>

  <text x="24" y="160" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">EL BUCLE — un agente es un while con una llamada adentro</text>

  <rect x="180" y="174" width="180" height="38" rx="8" fill="#7c5cff" fill-opacity=".18" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="270" y="198" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">el modelo decide</text>

  <path d="M 360 193 L 400 193" stroke="currentColor" opacity=".45" stroke-width="1.4"/>
  <rect x="404" y="174" width="150" height="38" rx="8" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="479" y="198" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">¿pide herramienta?</text>

  <path d="M 479 212 L 479 240 L 270 240 L 270 216" fill="none" stroke="#34d399" stroke-width="1.6"/>
  <text x="376" y="256" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">SÍ → la ejecutás y devolvés el resultado</text>

  <path d="M 554 193 L 596 193" stroke="#22d3ee" stroke-width="1.6"/>
  <text x="600" y="190" fill="#22d3ee" font-size="10.5" font-weight="700">NO →</text>
  <text x="600" y="205" fill="#22d3ee" font-size="10.5" font-weight="700">respuesta</text>

  <rect x="24" y="278" width="632" height="128" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="302" fill="#f87171" font-size="12.5" font-weight="700">EL COSTO CRECE EN CADA VUELTA — el contexto se reenvía entero</text>

  <rect x="44" y="314" width="60"  height="14" rx="3" fill="#f87171" fill-opacity=".45"/>
  <text x="116" y="325" fill="currentColor" opacity=".65" font-size="10">iteración 1  ·  2.000 tokens</text>
  <rect x="44" y="332" width="96"  height="14" rx="3" fill="#f87171" fill-opacity=".5"/>
  <text x="152" y="343" fill="currentColor" opacity=".65" font-size="10">iteración 2  ·  3.200</text>
  <rect x="44" y="350" width="183" height="14" rx="3" fill="#f87171" fill-opacity=".6"/>
  <text x="239" y="361" fill="currentColor" opacity=".65" font-size="10">iteración 4  ·  6.100</text>
  <rect x="44" y="368" width="276" height="14" rx="3" fill="#f87171" fill-opacity=".75"/>
  <text x="332" y="379" fill="currentColor" opacity=".65" font-size="10">iteración 6  ·  9.200</text>

  <text x="44" y="398" fill="#f87171" font-size="11" font-weight="700">
    total 6 iteraciones ≈ 32.800 tokens ≈ 16 veces una llamada simple. Por eso los límites no son opcionales.</text>
</svg>`,
        pie: 'Cada escalón del espectro agrega poder y quita control. La ingeniería está en no subir de más.',
      },

      entrevista: [
        { p: '¿Qué es un agente?',
          r: 'Un sistema donde <b>el modelo decide qué pasos dar</b>, en un bucle, hasta cumplir un objetivo o alcanzar un límite. ' +
             'La distinción importante es contra una <b>cadena fija</b>: si los pasos y su orden los definiste vos, no es un agente — es un flujo ' +
             'con IA adentro, y muchas veces es la solución correcta. Lo agéntico empieza cuando el control del flujo pasa del código al modelo. ' +
             'Técnicamente, un agente es un <code>while</code> con una llamada al modelo adentro; lo difícil no es el bucle sino todo lo que hay que ' +
             'ponerle alrededor: límites, permisos, trazas y criterios de parada.' },

        { p: '¿Cuándo un agente es la solución correcta?',
          r: 'Cuando <b>no podés enumerar los pasos de antemano</b> porque dependen de lo que se va descubriendo. Investigar un incidente, ' +
             'depurar un problema, responder consultas que pueden requerir combinaciones distintas de fuentes. Si en cambio podés dibujar el ' +
             'diagrama de flujo, entonces implementá ese diagrama: va a ser más rápido, más barato, más predecible y muchísimo más fácil de depurar. ' +
             '<b>La regla es usar el nivel más bajo del espectro que resuelva el problema.</b>' },

        { p: '¿Qué límites hay que ponerle a un agente?',
          r: 'Cuatro, y ninguno es opcional: <b>iteraciones</b> —5 a 15 según la tarea—, <b>tokens por sesión</b>, <b>costo por sesión</b> y ' +
             '<b>tiempo total</b>. Además, detección de <b>bucles</b>: si repite la misma herramienta con los mismos argumentos dos veces seguidas, ' +
             'no está avanzando y hay que cortar. El modo de falla más caro es el bucle silencioso, donde el agente itera sin progreso mientras el ' +
             'contexto y la factura crecen en cada vuelta.' },

        { p: '¿Por qué un agente de 6 iteraciones cuesta más que 6 llamadas simples?',
          r: 'Porque el contexto <b>se reenvía completo en cada iteración</b> y crece con cada resultado de herramienta. La primera vuelta puede ser ' +
             'de 2.000 tokens y la sexta de 9.000, así que el total ronda los 33.000 — del orden de 16 veces una llamada simple. ' +
             'Por eso el <b>prompt caching</b> sobre la parte fija y los límites de iteración no son optimizaciones opcionales: son requisitos ' +
             'para que un agente sea económicamente viable.' },
      ],

      practica: `
<h4>Detección de bucles: diez líneas que evitan facturas absurdas</h4>
<pre><code>function estaEnBucle(historial) {
  const ultimas = historial
    .filter(m =&gt; m.tipo === 'tool_use')
    .slice(-3)
    .map(m =&gt; m.name + JSON.stringify(m.input));

  // misma herramienta, mismos argumentos, dos veces seguidas
  return ultimas.length &gt;= 2 &amp;&amp; ultimas[ultimas.length - 1] === ultimas[ultimas.length - 2];
}

// dentro del bucle del agente:
if (estaEnBucle(traza)) {
  return { error: 'El agente no está avanzando', traza };
}</code></pre>

<h4>Presupuesto por sesión</h4>
<pre><code>const LIMITES = {
  iteraciones: 8,
  tokens:      60_000,
  costoUsd:    0.50,
  msTotales:   120_000,
};

function excedido(estado) {
  if (estado.iteracion  &gt;= LIMITES.iteraciones) return 'iteraciones';
  if (estado.tokens     &gt;= LIMITES.tokens)      return 'tokens';
  if (estado.costoUsd   &gt;= LIMITES.costoUsd)    return 'costo';
  if (Date.now() - estado.inicio &gt;= LIMITES.msTotales) return 'tiempo';
  return null;
}</code></pre>

<div class="aviso"><strong>Cuando se alcanza un límite, no lances un error genérico.</strong> Devolvé lo que el
agente <b>sí</b> logró hasta ahí, más una explicación. Muchas veces un resultado parcial es útil, y siempre es
mejor que un "algo salió mal" — tanto para el usuario como para vos cuando tengas que depurarlo.</div>

<h4>Cadena fija vs agente, con el mismo problema</h4>
<pre><code>// ✅ CADENA FIJA — sabés los pasos: 3 llamadas, predecible, depurable
async function procesarFactura(pdf) {
  const texto  = await extraerTexto(pdf);
  const datos  = await extraerCampos(texto);        // llamada 1
  const valido = await validarContraOrden(datos);   // consulta SQL, sin IA
  const nota   = await redactarObservacion(valido); // llamada 2
  return { datos, valido, nota };
}

// ⚠️ AGENTE — solo si los pasos NO se pueden anticipar
async function investigarDiscrepancia(facturaId) {
  return conHerramientas([{ role: 'user', content:
    \`Investigá por qué la factura \${facturaId} no coincide con la orden.
     Tenés herramientas para consultar facturas, órdenes, remitos e historial.\` }]);
}</code></pre>
<p>El primero se depura leyendo el código. El segundo solo se depura leyendo la traza — y por eso la traza no
es opcional.</p>
`,

      errores: [
        { mito: 'Un chatbot con RAG es un agente.',
          realidad: 'No: es una <b>cadena fija</b> —buscar, después responder— donde vos definiste los pasos. Un agente decide por sí mismo qué ' +
                    'pasos dar. Usar "agente" como sinónimo de "chatbot" es el error de vocabulario más frecuente y se nota inmediatamente.' },

        { mito: 'Los agentes son mejores porque son más flexibles.',
          realidad: 'Son más flexibles y por eso mismo más lentos, más caros, menos predecibles y mucho más difíciles de depurar. ' +
                    '<b>Usá el nivel más bajo del espectro que resuelva el problema.</b> Si podés dibujar el diagrama de flujo, implementá ' +
                    'ese diagrama.' },

        { mito: 'Con un límite de iteraciones alcanza.',
          realidad: 'Hacen falta cuatro límites —iteraciones, tokens, costo y tiempo— más detección de bucles. Un agente puede consumir tokens ' +
                    'muy rápido dentro del límite de iteraciones si cada herramienta devuelve salidas grandes.' },

        { mito: 'Si el agente falla, muestro un error y listo.',
          realidad: 'Devolvé el <b>resultado parcial</b> más una explicación. Muchas veces lo que logró hasta ahí ya es útil, y siempre es mejor ' +
                    'que un "algo salió mal" — para el usuario y para vos, cuando tengas que entender qué pasó.' },
      ],

      glosario: [
        { t: 'Agente', d: 'Sistema donde el modelo decide qué pasos dar, en un bucle, hasta cumplir un objetivo.' },
        { t: 'Cadena fija', d: 'Secuencia de llamadas cuyos pasos y orden están definidos en el código.' },
        { t: 'Ruteo', d: 'Que el modelo elija una entre varias ramas predefinidas. Una decisión, sin bucle.' },
        { t: 'ReAct', d: 'Patrón que alterna razonamiento y acción. Hoy incorporado en el tool calling nativo.' },
        { t: 'Bucle de control', d: 'La estructura iterativa del agente, con sus criterios de parada.' },
        { t: 'Criterio de parada', d: 'Condición que termina el bucle: éxito, límite alcanzado o error irrecuperable.' },
        { t: 'Bucle silencioso', d: 'Falla donde el agente repite acciones sin avanzar, consumiendo presupuesto.' },
        { t: 'Resultado parcial', d: 'Lo que el agente logró antes de alcanzar un límite. Suele ser útil igual.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Memoria, planificación y multi-agente',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un agente no recuerda nada por sí solo. Toda la
"memoria" la construís vos, y hay <b>tres tipos distintos</b> que se implementan de forma diferente.</div>

<h4>Los tres tipos de memoria</h4>

<p><b>1 · De trabajo</b> — lo que pasó en esta sesión: qué herramientas llamó y qué obtuvo. Es simplemente el
historial de mensajes. Se pierde al terminar y crece rápido, así que hay que resumirla o recortarla.</p>

<p><b>2 · De largo plazo</b> — hechos estables sobre el usuario: cómo se llama, qué prefiere, decisiones
tomadas antes. Se guarda en una base y se reinyecta al empezar. <b>Es lo que hace que la segunda conversación
sea mejor que la primera.</b></p>

<p><b>3 · De conocimiento</b> — la documentación del dominio. Eso es RAG, y ya lo viste.</p>

<div class="aviso"><strong>La confusión frecuente:</strong> creer que "darle memoria al agente" es guardar todo
el historial de todas las conversaciones y reenviarlo. Eso es carísimo e inútil: la mayoría del historial es
ruido. <b>La memoria de largo plazo son hechos extraídos, no transcripciones.</b></div>

<h4>Planificación</h4>
<p>Hay dos formas de que un agente aborde una tarea compleja:</p>
<ul>
<li><b>Reactiva</b> — decide el paso siguiente en cada vuelta, mirando lo que obtuvo. Es lo que hace por defecto. Flexible, pero puede perder el rumbo en tareas largas.</li>
<li><b>Con plan explícito</b> — primero genera una lista de pasos, después los ejecuta y va marcando. Mucho más fácil de seguir y de mostrarle al usuario.</li>
</ul>
<p>El plan explícito tiene una ventaja concreta: podés <b>mostrárselo al usuario antes de ejecutar</b>. Eso
convierte la espera en progreso visible y permite que cancele si el plan está mal.</p>

<h4>Multi-agente</h4>
<p>Varios agentes especializados que se coordinan: uno investiga, otro escribe, otro revisa.</p>
<p><b>Cuándo tiene sentido:</b> cuando las subtareas necesitan herramientas o instrucciones realmente distintas,
o cuando conviene que corran en paralelo.</p>
<p><b>Cuándo no:</b> casi siempre al principio. El costo se multiplica, la latencia se suma, y depurar "por qué
el agente C decidió eso" cuando A y B le pasaron información es genuinamente difícil.</p>
`,

      tecnico: `
<h4>Memoria de largo plazo: extracción, no acumulación</h4>
<p>El patrón que funciona es extraer hechos estructurados al terminar cada sesión, no guardar transcripciones:</p>
<pre><code>{
  "usuario_id": "u_123",
  "hechos": [
    { "clave": "nombre",           "valor": "Ana",             "confianza": 1.0 },
    { "clave": "plan",             "valor": "pro",             "fuente": "sistema" },
    { "clave": "prefiere_formato", "valor": "respuestas breves","visto": 3 }
  ],
  "actualizado": "2026-08-07"
}</code></pre>
<p>Al iniciar una sesión, esos hechos se inyectan en el system prompt. Son unas decenas de tokens en lugar de
miles, y son exactamente lo que importa.</p>

<div class="dato"><strong>El problema difícil de la memoria es la contradicción.</strong> El usuario dijo que
prefería respuestas largas y hoy pide brevedad. ¿Se reemplaza, se acumula, se versiona? La política más segura
es <b>reemplazar con marca de tiempo y conservar el historial</b>, para poder revertir. Y para hechos sensibles
—como preferencias declaradas explícitamente— pedir confirmación antes de sobrescribir.</div>

<h4>Planificación explícita</h4>
<pre><code>// Paso 1 — el agente genera el plan
{
  "plan": [
    { "id": 1, "accion": "Buscar la factura 8871",           "estado": "pendiente" },
    { "id": 2, "accion": "Traer la orden de compra asociada", "estado": "pendiente" },
    { "id": 3, "accion": "Comparar ítem por ítem",            "estado": "pendiente" },
    { "id": 4, "accion": "Redactar el informe",               "estado": "pendiente" }
  ]
}
// Paso 2 — se ejecuta paso a paso, actualizando estados y mostrándolos</code></pre>
<p>Ventajas: el usuario ve el progreso, podés cancelar temprano si el plan está mal, y si algo falla sabés
exactamente en qué paso. Costo: una llamada extra al principio.</p>

<h4>Arquitecturas multi-agente</h4>
<table>
<tr><th>Patrón</th><th>Cómo</th><th>Cuándo</th></tr>
<tr><td><b>Supervisor</b></td><td>Un coordinador delega en especialistas y arma la respuesta</td><td>El más común y el más controlable</td></tr>
<tr><td><b>Secuencial</b></td><td>Cadena: investigador → redactor → revisor</td><td>Etapas naturalmente ordenadas</td></tr>
<tr><td><b>Paralelo</b></td><td>Varios trabajan a la vez y se fusionan resultados</td><td>Subtareas independientes; gana latencia</td></tr>
<tr><td><b>Debate</b></td><td>Agentes con posturas opuestas y un juez</td><td>Decisiones de alto valor. Muy caro</td></tr>
</table>

<h4>El costo real de multi-agente</h4>
<p>Tres agentes de 5 iteraciones cada uno no son 15 llamadas: son 15 llamadas <b>con contexto creciente</b>,
más las llamadas de coordinación, más el contexto que se pasan entre sí. Es fácil llegar a 10 o 20 veces el
costo de una solución de un solo agente.</p>
<p><b>Antes de partir en varios agentes, probá con uno solo y más herramientas.</b> Suele alcanzar, y es un
orden de magnitud más simple de operar.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS TRES TIPOS DE MEMORIA — se implementan distinto</text>

  <rect x="24" y="36" width="200" height="112" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="124" y="60" text-anchor="middle" fill="#7c5cff" font-size="12" font-weight="700">DE TRABAJO</text>
  <text x="124" y="82" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">qué hizo en ESTA sesión</text>
  <text x="124" y="100" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">= el historial de mensajes</text>
  <text x="124" y="122" text-anchor="middle" fill="#7c5cff" font-size="10">crece rápido → resumir</text>
  <text x="124" y="138" text-anchor="middle" fill="currentColor" opacity=".45" font-size="9.5">se pierde al terminar</text>

  <rect x="240" y="36" width="200" height="112" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="340" y="60" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">DE LARGO PLAZO</text>
  <text x="340" y="82" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">hechos sobre el usuario</text>
  <text x="340" y="100" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">nombre · plan · preferencias</text>
  <text x="340" y="122" text-anchor="middle" fill="#34d399" font-size="10">HECHOS extraídos,</text>
  <text x="340" y="137" text-anchor="middle" fill="#34d399" font-size="10">no transcripciones</text>

  <rect x="456" y="36" width="200" height="112" rx="10" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="556" y="60" text-anchor="middle" fill="#22d3ee" font-size="12" font-weight="700">DE CONOCIMIENTO</text>
  <text x="556" y="82" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">documentación del dominio</text>
  <text x="556" y="100" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">políticas · manuales · datos</text>
  <text x="556" y="126" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">= RAG</text>

  <rect x="24" y="160" width="632" height="42" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="178" fill="#f87171" font-size="11.5" font-weight="700">LA CONFUSIÓN FRECUENTE</text>
  <text x="44" y="195" fill="currentColor" opacity=".7" font-size="11">
    “Darle memoria” NO es guardar y reenviar todas las conversaciones: eso es carísimo y casi todo es ruido.</text>

  <line x1="24" y1="222" x2="656" y2="222" stroke="currentColor" opacity=".18"/>

  <text x="24" y="246" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    MULTI-AGENTE — el costo no se suma, se multiplica</text>

  <rect x="24" y="258" width="300" height="122" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.4"/>
  <text x="174" y="280" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">UN AGENTE + MÁS HERRAMIENTAS</text>
  <rect x="124" y="292" width="100" height="34" rx="7" fill="#34d399" fill-opacity=".25" stroke="#34d399"/>
  <text x="174" y="313" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">agente</text>
  <text x="174" y="344" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">5 iteraciones · una traza · un lugar</text>
  <text x="174" y="362" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">probá esto PRIMERO</text>

  <rect x="356" y="258" width="300" height="122" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.4"/>
  <text x="506" y="280" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">TRES AGENTES COORDINADOS</text>
  <rect x="456" y="292" width="100" height="26" rx="6" fill="#f87171" fill-opacity=".22" stroke="#f87171"/>
  <text x="506" y="309" text-anchor="middle" fill="currentColor" font-size="10" font-weight="700">supervisor</text>
  <rect x="376" y="328" width="76" height="24" rx="6" fill="#f87171" fill-opacity=".16"/>
  <text x="414" y="344" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">investiga</text>
  <rect x="464" y="328" width="76" height="24" rx="6" fill="#f87171" fill-opacity=".16"/>
  <text x="502" y="344" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">escribe</text>
  <rect x="552" y="328" width="76" height="24" rx="6" fill="#f87171" fill-opacity=".16"/>
  <text x="590" y="344" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">revisa</text>
  <text x="506" y="370" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">10-20× el costo · 3 trazas · difícil de depurar</text>
</svg>`,
        pie: 'La memoria de largo plazo son hechos, no transcripciones. Y un agente con más herramientas suele ganarle a tres agentes.',
      },

      entrevista: [
        { p: '¿Cómo le das memoria a un agente?',
          r: 'Distingo tres tipos. La <b>de trabajo</b> es el historial de la sesión, que crece rápido y hay que resumir o recortar. ' +
             'La <b>de largo plazo</b> son hechos estables sobre el usuario, y la clave es que sean <b>hechos extraídos, no transcripciones</b>: ' +
             'al terminar una sesión extraigo datos estructurados —nombre, preferencias, decisiones— y los reinyecto al empezar la siguiente. ' +
             'Son decenas de tokens en lugar de miles. Y la <b>de conocimiento</b> es directamente RAG. ' +
             'El error común es creer que darle memoria es guardar y reenviar todas las conversaciones: es carísimo y casi todo es ruido.' },

        { p: '¿Cuál es el problema difícil de la memoria de largo plazo?',
          r: 'Las <b>contradicciones</b>. El usuario dijo que prefería respuestas largas y hoy pide brevedad: ¿se reemplaza, se acumula, se versiona? ' +
             'Mi política por defecto es reemplazar con marca de tiempo pero <b>conservar el historial</b>, para poder revertir y para poder auditar ' +
             'por qué el sistema se comporta de cierta manera. Para hechos sensibles —preferencias declaradas explícitamente, datos personales— ' +
             'pido confirmación antes de sobrescribir.' },

        { p: '¿Cuándo usarías multi-agente?',
          r: 'Cuando las subtareas necesitan <b>herramientas o instrucciones genuinamente distintas</b>, o cuando pueden correr en paralelo y la ' +
             'latencia importa. Pero mi primera opción siempre es <b>un solo agente con más herramientas</b>: suele alcanzar y es un orden de magnitud ' +
             'más simple de operar y depurar. El costo de multi-agente no se suma, se multiplica —cada agente reenvía su propio contexto creciente, ' +
             'más la coordinación— y depurar "por qué el agente C decidió eso" cuando A y B le pasaron información es genuinamente difícil.' },

        { p: '¿Qué ventaja tiene que el agente genere un plan explícito?',
          r: 'Tres cosas concretas. <b>Podés mostrárselo al usuario antes de ejecutar</b>, lo que convierte una espera larga en progreso visible y ' +
             'le permite cancelar si el plan está mal. <b>Sabés exactamente en qué paso falló</b> si algo sale mal. Y <b>el agente pierde menos el ' +
             'rumbo</b> en tareas largas, porque el plan queda en el contexto como referencia. El costo es una llamada extra al principio, ' +
             'que en tareas de varios pasos se paga sola.' },
      ],

      practica: `
<h4>Extraer memoria al cerrar la sesión</h4>
<pre><code>export async function consolidarMemoria(sesionId, usuarioId) {
  const mensajes = await traerMensajes(sesionId);

  // Modelo chico: es extracción, no razonamiento
  const { hechos } = await llamarModelo({
    tarea: 'extraer',
    esquema: EsquemaHechos,
    mensajes: [{ role: 'user', content:
      \`Extraé hechos ESTABLES sobre el usuario de esta conversación.
       Solo lo que siga siendo cierto dentro de un mes.
       NO extraigas: la consulta puntual, datos de una sola vez, nada temporal.

       \${resumir(mensajes)}\` }],
  });

  for (const h of hechos) {
    await supabase.from('memoria_usuario').upsert({
      usuario_id: usuarioId,
      clave: h.clave,
      valor: h.valor,
      actualizado: new Date().toISOString(),
    }, { onConflict: 'usuario_id,clave' });
  }
}</code></pre>

<div class="aviso"><strong>El "solo lo que siga siendo cierto dentro de un mes" es la instrucción clave.</strong>
Sin ella, la extracción guarda cosas como "está preguntando por la factura 8871", que no sirve para nada la
próxima vez y encima ensucia el contexto de todas las sesiones futuras.</div>

<h4>Inyectar la memoria al arrancar</h4>
<pre><code>async function armarSystemPrompt(usuarioId) {
  const hechos = await traerMemoria(usuarioId);
  if (!hechos.length) return SYSTEM_BASE;

  return SYSTEM_BASE + \`

Lo que sabés de este usuario:
\${hechos.map(h =&gt; \`- \${h.clave}: \${h.valor}\`).join('\\n')}\`;
}</code></pre>

<div class="dato"><strong>Ojo con el prompt caching acá:</strong> si inyectás la memoria al final del system
prompt, el prefijo fijo se sigue cacheando. Si la ponés al principio, <b>rompés la caché para todos los
usuarios</b>. Lo variable siempre va después de lo fijo.</div>

<h4>Antes de partir en multi-agente, preguntate</h4>
<table>
<tr><th>Pregunta</th><th>Si la respuesta es no…</th></tr>
<tr><td>¿Las subtareas necesitan herramientas realmente distintas?</td><td>Un agente con todas las herramientas</td></tr>
<tr><td>¿Pueden correr en paralelo y eso importa?</td><td>Una cadena secuencial alcanza</td></tr>
<tr><td>¿Probaste con un agente y falló <b>medido</b>?</td><td>Probá eso primero</td></tr>
<tr><td>¿Podés depurar tres trazas entrelazadas?</td><td>No estás listo para multi-agente</td></tr>
</table>
`,

      errores: [
        { mito: 'Darle memoria es guardar todas las conversaciones y reenviarlas.',
          realidad: 'Es carísimo y casi todo el historial es ruido. La memoria de largo plazo son <b>hechos extraídos y estructurados</b>: ' +
                    'decenas de tokens con lo que realmente importa, en lugar de miles de tokens de transcripción.' },

        { mito: 'La memoria se acumula y ya está.',
          realidad: 'Aparecen <b>contradicciones</b>: lo que el usuario prefería antes y lo que prefiere ahora. Hace falta una política explícita — ' +
                    'reemplazar con marca de tiempo conservando el historial— y confirmación humana para hechos sensibles.' },

        { mito: 'Multi-agente es la evolución natural de un agente.',
          realidad: 'Es un salto grande en costo, latencia y dificultad de depuración. <b>Un agente con más herramientas suele alcanzar</b> y es un ' +
                    'orden de magnitud más simple de operar. Multi-agente se justifica cuando las subtareas necesitan herramientas realmente distintas ' +
                    'o cuando el paralelismo importa.' },

        { mito: 'Pongo la memoria del usuario al principio del system prompt.',
          realidad: 'Eso <b>rompe el prompt caching</b> para todos los usuarios, porque el prefijo deja de ser idéntico. La memoria es variable, ' +
                    'así que va <b>después</b> de la parte fija. Es un detalle que no genera ningún error y se ve solo en la factura.' },
      ],

      glosario: [
        { t: 'Memoria de trabajo', d: 'El historial de la sesión actual: qué hizo el agente y qué obtuvo.' },
        { t: 'Memoria de largo plazo', d: 'Hechos estables sobre el usuario, extraídos y reinyectados entre sesiones.' },
        { t: 'Consolidación', d: 'Proceso de extraer hechos estables de una conversación al terminarla.' },
        { t: 'Planificación explícita', d: 'Generar la lista de pasos antes de ejecutarlos, y actualizarla a medida que avanza.' },
        { t: 'Supervisor', d: 'Patrón multi-agente donde un coordinador delega en especialistas.' },
        { t: 'Agente especializado', d: 'Agente con un conjunto acotado de herramientas e instrucciones para un subdominio.' },
        { t: 'Debate', d: 'Patrón donde varios agentes argumentan posturas opuestas y un juez decide. Muy caro.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Cuándo NO usar un agente',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> esta es la lección que más te va a hacer ganar una
entrevista. Cualquiera puede explicar qué es un agente; <b>demostrar criterio para no usarlo</b> es lo que
distingue a alguien con experiencia.</div>

<h4>La pregunta que decide todo</h4>
<p><b>¿Podés dibujar el diagrama de flujo de antemano?</b></p>
<ul>
<li><b>Sí</b> → implementá ese diagrama. Más rápido, más barato, predecible, depurable.</li>
<li><b>No, porque los pasos dependen de lo que se descubra</b> → ahí sí, un agente.</li>
</ul>

<h4>Casos donde un agente es la respuesta equivocada</h4>
<table>
<tr><th>Caso</th><th>Qué corresponde</th></tr>
<tr><td>"Extraé los datos de esta factura"</td><td>Una llamada con salida estructurada</td></tr>
<tr><td>"Clasificá este ticket"</td><td>Una llamada, o un modelo chico afinado</td></tr>
<tr><td>"Respondé sobre nuestra documentación"</td><td>RAG: cadena fija de buscar y responder</td></tr>
<tr><td>"Resumí esta conversación"</td><td>Una llamada</td></tr>
<tr><td>"Traducí y adaptá al tono de la marca"</td><td>Cadena de dos llamadas</td></tr>
<tr><td>"Procesá estas 10.000 facturas"</td><td>Cadena fija en lote. Un agente por factura es carísimo</td></tr>
</table>

<h4>Casos donde sí</h4>
<ul>
<li><b>Investigación abierta</b> — "averiguá por qué esta factura no coincide con la orden". Los pasos dependen de lo que vaya encontrando.</li>
<li><b>Depuración</b> — leer logs, formular hipótesis, verificar, iterar.</li>
<li><b>Tareas con ramificación impredecible</b> — donde una respuesta abre caminos distintos.</li>
<li><b>Asistentes de uso general</b> — cuando no sabés de antemano qué va a pedir el usuario.</li>
</ul>

<div class="aviso"><strong>El costo oculto que casi nadie calcula:</strong> un agente no solo cuesta más en
tokens. Cuesta más en <b>tiempo de ingeniería</b> —hay que construir límites, trazas, manejo de errores,
confirmaciones—, en <b>soporte</b> —"¿por qué hizo eso?" es una pregunta difícil— y en <b>confianza del
usuario</b>, porque un sistema imprevisible se usa menos. <b>Ese costo se paga todos los meses.</b></div>
`,

      tecnico: `
<h4>Comparación honesta</h4>
<table>
<tr><th></th><th>Cadena fija</th><th>Agente</th></tr>
<tr><td>Latencia</td><td>Predecible, 1-3 llamadas</td><td>Variable, 3-15 llamadas</td></tr>
<tr><td>Costo</td><td>Predecible</td><td>Variable, hasta 10-20×</td></tr>
<tr><td>Depuración</td><td>Leés el código</td><td>Leés la traza de cada ejecución</td></tr>
<tr><td>Testeo</td><td>Cada paso por separado</td><td>Solo de extremo a extremo</td></tr>
<tr><td>Modos de falla</td><td>Acotados y conocidos</td><td>Abiertos: bucles, desvíos, herramientas mal usadas</td></tr>
<tr><td>Superficie de seguridad</td><td>Chica</td><td>Grande: cada herramienta es una puerta</td></tr>
<tr><td>Flexibilidad</td><td>Baja</td><td>Alta</td></tr>
</table>

<h4>El patrón intermedio que suele ser la respuesta correcta</h4>
<p>Casi nunca es "cadena fija" o "agente": es una <b>cadena fija con un paso agéntico acotado</b>.</p>
<pre><code>async function atenderConsulta(pregunta, usuario) {
  // pasos fijos — vos los controlás
  const intencion = await clasificar(pregunta);          // llamada 1

  if (intencion === 'consulta_docs') {
    return await responderConRag(pregunta);              // cadena fija
  }

  if (intencion === 'estado_cuenta') {
    return await consultarCuenta(usuario);               // sin IA: SQL
  }

  if (intencion === 'investigacion') {
    // ↓ el ÚNICO tramo agéntico, con límites propios
    return await agente(pregunta, {
      herramientas: HERRAMIENTAS_LECTURA,   // solo lectura
      maxIteraciones: 6,
      maxCostoUsd: 0.30,
    });
  }

  return derivarAHumano(pregunta);
}</code></pre>
<p>El 90% del tráfico va por caminos predecibles y baratos; solo lo que realmente lo necesita entra al tramo
agéntico, y con herramientas de solo lectura. <b>Esta arquitectura es la que más se ve en sistemas serios</b>
y es una muy buena respuesta en una entrevista de diseño.</p>

<div class="dato"><strong>La pregunta de seguimiento típica en una entrevista:</strong> "¿y cómo hacés que sea
confiable?". La respuesta que se espera: <b>reducir el espacio de decisión</b>. Menos herramientas, solo
lectura por defecto, confirmación humana para lo irreversible, límites duros y traza completa. ' +
Un agente confiable es un agente al que se le acotó el poder, no uno con mejor prompt.</div>

<h4>Cuándo un agente ya no rinde</h4>
<p>Señales de que había que haber usado una cadena fija:</p>
<ul>
<li>El agente casi siempre hace <b>la misma secuencia</b> de herramientas → codificala.</li>
<li>Tuviste que escribir tantas reglas en el prompt que ya es un diagrama de flujo en prosa.</li>
<li>El costo por consulta no es predecible y eso te impide fijar precios.</li>
<li>Cada bug requiere leer una traza de 15 pasos.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="n1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <rect x="180" y="18" width="320" height="46" rx="10" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="340" y="40" text-anchor="middle" fill="#7c5cff" font-size="12.5" font-weight="700">¿Podés dibujar el diagrama de flujo</text>
  <text x="340" y="57" text-anchor="middle" fill="#7c5cff" font-size="12.5" font-weight="700">DE ANTEMANO?</text>

  <line x1="270" y1="64" x2="180" y2="96" stroke="currentColor" stroke-width="1.4" marker-end="url(#n1)"/>
  <line x1="410" y1="64" x2="500" y2="96" stroke="currentColor" stroke-width="1.4" marker-end="url(#n1)"/>
  <text x="196" y="86" fill="#34d399" font-size="11.5" font-weight="700">SÍ</text>
  <text x="474" y="86" fill="#fbbf24" font-size="11.5" font-weight="700">NO</text>

  <rect x="24" y="102" width="296" height="120" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.5"/>
  <text x="172" y="126" text-anchor="middle" fill="#34d399" font-size="12.5" font-weight="700">IMPLEMENTÁ ESE DIAGRAMA</text>
  <text x="44" y="150" fill="currentColor" opacity=".72" font-size="11">· latencia y costo predecibles</text>
  <text x="44" y="170" fill="currentColor" opacity=".72" font-size="11">· se depura leyendo el código</text>
  <text x="44" y="190" fill="currentColor" opacity=".72" font-size="11">· cada paso se testea por separado</text>
  <text x="44" y="210" fill="currentColor" opacity=".72" font-size="11">· modos de falla acotados</text>

  <rect x="360" y="102" width="296" height="120" rx="10" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="508" y="126" text-anchor="middle" fill="#fbbf24" font-size="12.5" font-weight="700">AHÍ SÍ, UN AGENTE</text>
  <text x="380" y="150" fill="currentColor" opacity=".72" font-size="11">· investigación abierta</text>
  <text x="380" y="170" fill="currentColor" opacity=".72" font-size="11">· depuración con hipótesis</text>
  <text x="380" y="190" fill="currentColor" opacity=".72" font-size="11">· ramificación impredecible</text>
  <text x="380" y="210" fill="currentColor" opacity=".72" font-size="11">· asistente de uso general</text>

  <rect x="24" y="240" width="632" height="66" rx="10" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.5"/>
  <text x="340" y="264" text-anchor="middle" fill="#22d3ee" font-size="12.5" font-weight="700">
    LA RESPUESTA REAL SUELE SER LA MEZCLA</text>
  <text x="340" y="286" text-anchor="middle" fill="currentColor" opacity=".72" font-size="11.5">
    Cadena fija para el 90% del tráfico  +  un tramo agéntico ACOTADO para lo que lo necesita</text>
  <text x="340" y="302" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10.5">
    solo lectura · pocas herramientas · límites duros · traza completa</text>

  <rect x="24" y="322" width="632" height="66" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="346" fill="#f87171" font-size="12" font-weight="700">EL COSTO OCULTO — el que nadie calcula</text>
  <text x="44" y="366" fill="currentColor" opacity=".72" font-size="11">
    Tiempo de ingeniería (límites, trazas, confirmaciones)  ·  soporte (“¿por qué hizo eso?”)  ·  confianza del usuario.</text>
  <text x="44" y="382" fill="#f87171" font-size="11" font-weight="700">
    No se paga una vez: se paga todos los meses.</text>
</svg>`,
        pie: 'Demostrar criterio para NO usar un agente es lo que distingue a alguien con experiencia.',
      },

      entrevista: [
        { p: '¿Cuándo NO usarías un agente?',
          r: 'Siempre que <b>pueda dibujar el diagrama de flujo de antemano</b>. Si sé que los pasos son extraer, validar y redactar, implemento esos ' +
             'tres pasos: es más rápido, más barato, predecible y se depura leyendo el código. Un agente se justifica cuando los pasos <b>dependen de ' +
             'lo que se va descubriendo</b> —investigación, depuración, ramificación impredecible—. Y hay un costo que casi nadie calcula: además de ' +
             'los tokens, un agente cuesta tiempo de ingeniería en límites y trazas, cuesta soporte porque "¿por qué hizo eso?" es difícil de responder, ' +
             'y cuesta confianza del usuario. <b>Ese costo se paga todos los meses.</b>' },

        { p: 'Te piden construir un asistente que responda sobre la documentación de la empresa. ¿Agente?',
          r: 'No, eso es RAG: una cadena fija de buscar y después responder. Los pasos son siempre los mismos y no dependen del resultado, ' +
             'así que un agente solo agregaría latencia, costo e imprevisibilidad. Ahora, si además tuviera que <i>investigar</i> —cruzar varias fuentes, ' +
             'formular hipótesis, verificar— ahí evaluaría un tramo agéntico. Pero lo haría como <b>una rama acotada dentro de una cadena fija</b>, ' +
             'no convirtiendo todo el sistema en un agente.' },

        { p: 'Diseñá un sistema de atención al cliente con IA. ¿Cómo lo estructurás?',
          r: 'Con una <b>cadena fija con un tramo agéntico acotado</b>, que es la arquitectura que más se ve en sistemas serios. ' +
             'Primero clasifico la intención con una llamada barata. Las consultas sobre documentación van por RAG. Las de estado de cuenta van ' +
             'directo a SQL, sin IA. Y solo lo que requiere investigación real entra a un agente <b>con herramientas de solo lectura</b>, ' +
             'límite de iteraciones y tope de costo propio. Así el 90% del tráfico va por caminos predecibles y baratos, ' +
             'y la parte impredecible está contenida y no puede hacer daño.' },

        { p: '¿Cómo hacés que un agente sea confiable?',
          r: '<b>Reduciendo su espacio de decisión</b>, no mejorando el prompt. En concreto: pocas herramientas y bien descritas; solo lectura por ' +
             'defecto, y confirmación humana obligatoria para cualquier acción irreversible; validación de argumentos con esquema antes de ejecutar; ' +
             'ejecución con los permisos del usuario y nunca con service role; límites duros de iteraciones, tokens, costo y tiempo; detección de bucles; ' +
             'y traza completa de cada paso. <b>Un agente confiable es un agente al que se le acotó el poder.</b>' },
      ],

      practica: `
<h4>Antes de construir un agente, respondé estas seis</h4>
<table>
<tr><th>Pregunta</th><th>Si la respuesta es…</th></tr>
<tr><td>¿Puedo enumerar los pasos de antemano?</td><td><b>Sí</b> → cadena fija</td></tr>
<tr><td>¿La secuencia depende de lo que se descubra?</td><td><b>No</b> → cadena fija</td></tr>
<tr><td>¿Puedo tolerar latencia y costo variables?</td><td><b>No</b> → cadena fija</td></tr>
<tr><td>¿Tengo trazas para depurar?</td><td><b>No</b> → construilas primero</td></tr>
<tr><td>¿Alguna herramienta es irreversible?</td><td><b>Sí</b> → confirmación humana obligatoria</td></tr>
<tr><td>¿Tengo evals para saber si funciona?</td><td><b>No</b> → construilos primero</td></tr>
</table>

<h4>Empezar acotado y expandir con evidencia</h4>
<pre><code>// Versión 1 — solo lectura, pocas herramientas, límites ajustados
const V1 = {
  herramientas: [buscarCliente, buscarPedido, buscarDocumento],
  maxIteraciones: 5,
  maxCostoUsd: 0.20,
  irreversibles: [],                 // ninguna, por ahora
};

// Se expande SOLO con datos: qué pidió el agente y no pudo hacer,
// medido sobre tráfico real durante algunas semanas.</code></pre>

<div class="aviso"><strong>El camino inverso —empezar con todas las herramientas y después recortar— casi
nunca funciona.</strong> Para cuando querés sacar una herramienta, ya hay usuarios que dependen de ese
comportamiento. <b>Es mucho más fácil agregar poder que quitarlo.</b></div>

<h4>Registrar para decidir</h4>
<pre><code>await registrarSesionAgente({
  tenantId,
  iteraciones: estado.iteracion,
  herramientas_usadas: traza.map(t =&gt; t.name),
  secuencia: traza.map(t =&gt; t.name).join(' → '),   // ← el dato clave
  costo_usd: estado.costoUsd,
  exito: !!resultado,
  motivo_corte: estado.motivoCorte,
});</code></pre>

<p>Ese campo <code>secuencia</code> es el que te va a dar la respuesta más útil: si al mes descubrís que el
<b>80% de las sesiones sigue exactamente la misma secuencia</b> de herramientas, tenés la evidencia para
convertir ese caso en una cadena fija — más rápida, más barata y predecible— y dejar el agente solo para el
20% restante.</p>
`,

      errores: [
        { mito: 'Los agentes son el futuro, así que construyo todo como agente.',
          realidad: 'La mayoría de los problemas reales tienen pasos conocidos. <b>Una cadena fija es más rápida, más barata, predecible y depurable.</b> ' +
                    'El agente es una herramienta para cuando no podés anticipar la secuencia, no un objetivo arquitectónico.' },

        { mito: 'Le doy todas las herramientas y después recorto si hace falta.',
          realidad: 'Es mucho más fácil <b>agregar</b> poder que quitarlo: para cuando querés sacar una herramienta, ya hay usuarios que dependen de ' +
                    'ese comportamiento. Empezá con solo lectura y pocas herramientas, y expandí con evidencia de tráfico real.' },

        { mito: 'Un agente confiable se logra con un prompt mejor.',
          realidad: 'Se logra <b>reduciendo su espacio de decisión</b>: menos herramientas, solo lectura por defecto, confirmación humana para lo ' +
                    'irreversible, límites duros y trazas. El prompt ayuda; la arquitectura decide.' },

        { mito: 'Si el agente funciona, ya está.',
          realidad: 'Hay que <b>registrar la secuencia de herramientas</b> de cada sesión. Si el 80% sigue siempre el mismo camino, tenés la evidencia ' +
                    'para convertir ese caso en una cadena fija y quedarte con el agente solo para el resto. Es una de las optimizaciones de costo ' +
                    'más grandes disponibles.' },
      ],

      glosario: [
        { t: 'Cadena fija', d: 'Secuencia de pasos definida en el código. Predecible, barata y depurable.' },
        { t: 'Tramo agéntico', d: 'Rama acotada dentro de una cadena fija donde el modelo decide, con límites propios.' },
        { t: 'Espacio de decisión', d: 'Conjunto de acciones posibles del agente. Reducirlo es lo que lo hace confiable.' },
        { t: 'Herramientas de solo lectura', d: 'Las que no modifican estado. El conjunto por defecto de un agente seguro.' },
        { t: 'Secuencia de herramientas', d: 'El orden en que un agente las usó. Si se repite, indica que conviene una cadena fija.' },
        { t: 'Costo oculto', d: 'Tiempo de ingeniería, soporte y confianza del usuario que agrega un sistema imprevisible.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: 'Cuando el modelo usa una herramienta, ¿quién la ejecuta?',
      opciones: [
        'Tu código: el modelo solo pide que se ejecute y espera el resultado',
        'El modelo, directamente',
        'El proveedor de la API',
        'Depende de la configuración',
      ],
      correcta: 0,
      porQue: 'El modelo devuelve un bloque tool_use con la función y los argumentos, y termina el turno. Tu código valida, decide si tiene permiso y ejecuta. Ahí es donde vive toda la seguridad de un agente.',
      porQueNo: {
        1: 'El modelo no tiene acceso a tu sistema: solo genera texto estructurado.',
        2: 'El proveedor transporta la solicitud; no ejecuta nada tuyo.',
        3: 'No es configurable: el modelo nunca ejecuta código de tu sistema.',
      },
    },
    {
      p: '¿Qué es lo más importante al definir una herramienta?',
      opciones: [
        'La descripción: es el prompt de la herramienta y debe decir cuándo usarla y cuándo no',
        'El nombre, que debe ser corto',
        'Que devuelva la mayor cantidad de datos posible',
        'Que tenga muchos parámetros opcionales',
      ],
      correcta: 0,
      porQue: 'Es lo único que el modelo lee para decidir si usarla y cómo. Una descripción vaga produce herramientas llamadas en el momento equivocado o no llamadas nunca.',
      porQueNo: {
        1: 'El nombre importa —verbo + objeto— pero la descripción es lo que guía la decisión.',
        2: 'Una salida enorme llena la ventana de contexto. Conviene acotar o paginar.',
        3: 'Muchos parámetros opcionales aumentan la probabilidad de que invente valores.',
      },
    },
    {
      p: 'Una herramienta falla. ¿Qué conviene hacer?',
      opciones: [
        'Devolver el error al modelo con un mensaje que le permita corregirse',
        'Lanzar una excepción y cortar la ejecución',
        'Reintentar en silencio hasta que funcione',
        'Devolver un resultado vacío',
      ],
      correcta: 0,
      porQue: 'Un agente que recibe "no existe ese email, probá buscando por nombre" se corrige en la iteración siguiente. Los mensajes de error son parte del prompt y de la conversación.',
      porQueNo: {
        1: 'El agente se cae en vez de intentar una alternativa que probablemente tenía disponible.',
        2: 'Si el error es determinista, reintentar quema iteraciones y presupuesto sin avanzar.',
        3: 'El modelo no puede distinguir "no hay resultados" de "hubo un fallo", y va a sacar conclusiones erróneas.',
      },
    },
    {
      p: '¿Qué define a un agente frente a una cadena fija?',
      opciones: [
        'El modelo decide qué pasos dar, en un bucle, en lugar de seguir pasos que definiste vos',
        'Que use más de un modelo',
        'Que tenga acceso a internet',
        'Que responda en varios turnos',
      ],
      correcta: 0,
      porQue: 'La diferencia está en quién controla el flujo. Si los pasos y su orden están en tu código, es una cadena fija con IA adentro — y muchas veces es la solución correcta.',
      porQueNo: {
        1: 'La cantidad de modelos no tiene relación con lo agéntico.',
        2: 'Es una herramienta más; un agente puede no tener ninguna herramienta de red.',
        3: 'Un chat de varios turnos con pasos fijos sigue siendo una cadena fija.',
      },
    },
    {
      p: '¿Por qué un agente de 6 iteraciones cuesta mucho más que 6 llamadas simples?',
      opciones: [
        'El contexto se reenvía completo en cada iteración y crece con cada resultado',
        'Porque los agentes usan modelos más caros',
        'Por el costo de las herramientas',
        'Porque se cobra un recargo por tool calling',
      ],
      correcta: 0,
      porQue: 'La primera iteración puede ser de 2.000 tokens y la sexta de 9.000. El total ronda 16 veces una llamada simple. Por eso el prompt caching y los límites de iteración son requisitos, no optimizaciones.',
      porQueNo: {
        1: 'Es el mismo modelo; lo que cambia es cuánto contexto se le manda.',
        2: 'Las herramientas son código tuyo y no tienen costo de inferencia.',
        3: 'No existe tal recargo.',
      },
    },
    {
      p: '¿Cuál es el modo de falla más caro de un agente?',
      opciones: [
        'El bucle silencioso: repite acciones sin avanzar mientras el contexto y la factura crecen',
        'Que devuelva una respuesta incorrecta',
        'Que tarde más de lo esperado',
        'Que use una herramienta equivocada una vez',
      ],
      correcta: 0,
      porQue: 'Se detecta comparando las llamadas recientes: si repite la misma herramienta con los mismos argumentos dos veces seguidas, hay que cortar. Son diez líneas y evitan facturas absurdas.',
      porQueNo: {
        1: 'Es un problema de calidad, pero acotado en costo.',
        2: 'Molesto, pero el límite de tiempo lo contiene.',
        3: 'Un error puntual se corrige en la iteración siguiente si el mensaje de error es bueno.',
      },
    },
    {
      p: '¿Qué límites hay que ponerle a un agente?',
      opciones: [
        'Iteraciones, tokens, costo y tiempo, más detección de bucles',
        'Solo un límite de iteraciones',
        'Solo un límite de tiempo',
        'Ninguno: el agente termina cuando cumple el objetivo',
      ],
      correcta: 0,
      porQue: 'Los cuatro son necesarios porque se agotan de formas distintas: un agente puede consumir muchísimos tokens dentro del límite de iteraciones si las herramientas devuelven salidas grandes.',
      porQueNo: {
        1: 'Insuficiente: cada iteración puede ser arbitrariamente cara en tokens.',
        2: 'Insuficiente: en poco tiempo se puede gastar mucho dinero.',
        3: 'Un agente puede no terminar nunca. Los límites no son opcionales.',
      },
    },
    {
      p: '¿Qué es la memoria de largo plazo de un agente?',
      opciones: [
        'Hechos estables extraídos sobre el usuario, reinyectados al empezar cada sesión',
        'El historial completo de todas las conversaciones anteriores',
        'La ventana de contexto del modelo',
        'La base vectorial del RAG',
      ],
      correcta: 0,
      porQue: 'Son decenas de tokens con lo que realmente importa, en lugar de miles de tokens de transcripción donde casi todo es ruido. Es lo que hace que la segunda conversación sea mejor que la primera.',
      porQueNo: {
        1: 'Es carísimo y la mayor parte del historial no aporta nada a futuro.',
        2: 'La ventana es un límite técnico por llamada, no un mecanismo de memoria.',
        3: 'Eso es memoria de conocimiento del dominio, no del usuario.',
      },
    },
    {
      p: '¿Dónde conviene inyectar la memoria del usuario en el prompt?',
      opciones: [
        'Después de la parte fija, para no romper el prompt caching',
        'Al principio de todo, para que tenga más peso',
        'Al final del último mensaje del usuario',
        'Es indistinto',
      ],
      correcta: 0,
      porQue: 'La caché requiere un prefijo idéntico byte a byte. La memoria es variable por usuario: si va al principio, rompe la caché para todos y no genera ningún error visible.',
      porQueNo: {
        1: 'Rompe la caché en todas las llamadas. Es un costo que solo se ve en la factura.',
        2: 'Se mezcla con la petición del usuario y puede confundirse con parte de su mensaje.',
        3: 'Sí importa, por el caching y por la atención.',
      },
    },
    {
      p: '¿Cuándo conviene multi-agente?',
      opciones: [
        'Cuando las subtareas necesitan herramientas o instrucciones realmente distintas, o pueden correr en paralelo',
        'Siempre que la tarea tenga más de tres pasos',
        'Cuando el agente único es lento',
        'Cuando querés usar varios proveedores',
      ],
      correcta: 0,
      porQue: 'La primera opción siempre es un agente con más herramientas: suele alcanzar y es un orden de magnitud más simple de operar y depurar. El costo de multi-agente se multiplica, no se suma.',
      porQueNo: {
        1: 'La cantidad de pasos no justifica el salto: un solo agente puede dar muchos pasos.',
        2: 'Varios agentes suelen ser más lentos todavía, salvo que corran en paralelo.',
        3: 'Se pueden usar varios proveedores desde un solo agente.',
      },
    },
    {
      p: '¿Cuál es la pregunta que decide si usar un agente o una cadena fija?',
      opciones: [
        '¿Podés dibujar el diagrama de flujo de antemano?',
        '¿Cuántas herramientas necesitás?',
        '¿Qué modelo vas a usar?',
        '¿Cuántos usuarios va a tener?',
      ],
      correcta: 0,
      porQue: 'Si podés enumerar los pasos, implementá esos pasos: es más rápido, más barato, predecible y depurable. El agente se justifica cuando la secuencia depende de lo que se va descubriendo.',
      porQueNo: {
        1: 'Una cadena fija puede usar muchas herramientas sin ser agéntica.',
        2: 'La elección de modelo es posterior y no cambia la arquitectura.',
        3: 'El volumen afecta el costo, no si los pasos son predecibles.',
      },
    },
    {
      p: '"Respondé preguntas sobre nuestra documentación". ¿Agente?',
      opciones: [
        'No: es RAG, una cadena fija de buscar y después responder',
        'Sí, porque el modelo debe decidir qué buscar',
        'Sí, para que pueda iterar hasta encontrar la respuesta',
        'Depende del tamaño del corpus',
      ],
      correcta: 0,
      porQue: 'Los pasos son siempre los mismos y no dependen del resultado. Un agente agregaría latencia, costo e imprevisibilidad sin ninguna ganancia.',
      porQueNo: {
        1: 'Formular la consulta es un paso fijo de la cadena, no una decisión agéntica.',
        2: 'Iterar sobre el retrieval se puede hacer con lógica explícita, sin darle el control del flujo al modelo.',
        3: 'El tamaño del corpus afecta el índice, no si hacen falta decisiones autónomas.',
      },
    },
    {
      p: '¿Cómo se hace confiable a un agente?',
      opciones: [
        'Reduciendo su espacio de decisión: menos herramientas, solo lectura, límites duros y trazas',
        'Con un prompt más detallado',
        'Usando el modelo más grande disponible',
        'Aumentando el límite de iteraciones',
      ],
      correcta: 0,
      porQue: 'Un agente confiable es un agente al que se le acotó el poder. El prompt ayuda; la arquitectura decide.',
      porQueNo: {
        1: 'Ayuda, pero no impide que ejecute algo que no debía si el código se lo permite.',
        2: 'Un modelo mejor decide mejor, pero no cambia qué puede hacer.',
        3: 'Le da más margen para desviarse y para gastar más.',
      },
    },
    {
      p: 'Registrás la secuencia de herramientas y descubrís que el 80% de las sesiones sigue el mismo camino. ¿Qué hacés?',
      opciones: [
        'Convertís ese caso en una cadena fija y dejás el agente para el 20% restante',
        'Le agregás más herramientas al agente',
        'Aumentás el límite de iteraciones',
        'No hacés nada: el agente está funcionando',
      ],
      correcta: 0,
      porQue: 'Es una de las optimizaciones de costo más grandes disponibles: ese 80% pasa a ser predecible, barato y depurable, y el agente queda solo donde realmente aporta.',
      porQueNo: {
        1: 'Más herramientas aumentan la confusión y el costo sin resolver la repetición.',
        2: 'No hay problema de iteraciones: el problema es que estás pagando flexibilidad que no usás.',
        3: 'Estás pagando 10 o 20 veces de más por un flujo que resulta ser predecible.',
      },
    },
    {
      p: '¿Qué herramientas requieren confirmación humana obligatoria?',
      opciones: [
        'Las irreversibles: enviar un email, cobrar, borrar datos',
        'Todas, por seguridad',
        'Las que consultan datos sensibles',
        'Ninguna, si el prompt está bien escrito',
      ],
      correcta: 0,
      porQue: 'Clasificar las herramientas en lectura, escritura reversible e irreversible es lo que hace que un agente sea desplegable. Sin eso, una alucinación o un prompt injection pueden terminar en un email enviado a un cliente.',
      porQueNo: {
        1: 'Pedir confirmación para cada lectura hace el agente inusable.',
        2: 'La lectura de datos sensibles se controla con permisos y RLS, no con confirmación por acción.',
        3: 'El prompt no es un control de seguridad: puede ser subvertido por prompt injection.',
      },
    },
  ],
});
