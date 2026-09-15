/* ==========================================================================
   IA · Módulo 02 — Trabajar con un LLM
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ia',
  id: 'm02',
  titulo: 'Trabajar con un LLM',
  fuentes: ['anthropic', 'anthropic-precios', 'openai', 'openai-precios'],

  intro:
    '<p>Módulo práctico. Acá dejás de estudiar cómo funciona el modelo y empezás a <b>usarlo bien</b>: cómo se ' +
    'estructura una llamada, cómo se escribe un prompt que funciona siempre y no una vez, cómo forzar que la salida ' +
    'sea JSON válido, cómo no fundirte en tokens y cómo elegir el modelo correcto.</p>' +
    '<p>Es el módulo con más cosas que vas a aplicar mañana mismo en tus proyectos.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Anatomía de una llamada: system, user, assistant',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> una llamada al modelo es una obra de teatro con
tres personajes. El <b>system</b> es el director que da las indicaciones antes de empezar. El <b>user</b> es
quien habla. El <b>assistant</b> es el modelo respondiendo.</div>

<h4>Los tres roles</h4>

<p><b>system</b> — Las instrucciones que valen para toda la conversación. Quién es el modelo, qué puede y qué
no, en qué formato responde, con qué tono. El usuario no lo ve. Es donde va todo lo estable.</p>

<p><b>user</b> — Lo que pide la persona. También es donde metés el contexto recuperado por RAG: técnicamente es
información que "trae" el usuario aunque la haya buscado tu sistema.</p>

<p><b>assistant</b> — Las respuestas del modelo. En una conversación se van acumulando, alternando con los
mensajes de <code>user</code>.</p>

<pre><code>[
  { role: 'system',    content: 'Sos un asistente de soporte. Respondé en 2 párrafos como máximo.' },
  { role: 'user',      content: '¿Cómo cambio mi contraseña?' },
  { role: 'assistant', content: 'Entrá a Configuración → Seguridad…' },
  { role: 'user',      content: '¿Y si perdí el acceso al mail?' },   ← acá seguimos
]</code></pre>

<h4>Lo que hay que tener claro</h4>
<ul>
<li><b>Vos armás esa lista entera en cada llamada.</b> El modelo no guarda nada. Lo que parece una conversación es tu código reenviando todo el historial.</li>
<li><b>El orden importa.</b> Y no por prolijidad: la parte fija va primero para que se pueda cachear, y lo importante va al principio o al final por cómo funciona la atención.</li>
<li><b>El system prompt no es sagrado.</b> Si el contexto se alarga mucho, sus instrucciones compiten por atención con miles de tokens. Las reglas críticas conviene repetirlas cerca del final.</li>
</ul>

<div class="aviso"><strong>Truco que resuelve un problema muy común:</strong> si necesitás que la respuesta
arranque de una forma exacta, escribí vos el principio como mensaje <code>assistant</code>. El modelo continúa
desde ahí. Es la forma más confiable de eliminar el "¡Claro! Acá tenés el JSON:" que después te rompe el
<code>JSON.parse</code>.</div>
`,

      tecnico: `
<h4>Por qué existen los roles</h4>
<p>Son un artefacto del <b>SFT</b>: durante esa etapa el modelo vio decenas de miles de ejemplos con esa
estructura, delimitada por tokens especiales. Los roles no son una convención de la API: son parte de lo que
el modelo aprendió a interpretar. Por eso respetar el formato del proveedor importa más de lo que parece.</p>

<h4>Parámetros principales de una llamada</h4>
<table>
<tr><th>Parámetro</th><th>Qué controla</th><th>Nota</th></tr>
<tr><td><code>model</code></td><td>Qué modelo</td><td>Fijar la versión exacta en producción, no un alias móvil</td></tr>
<tr><td><code>max_tokens</code></td><td>Techo de tokens de salida</td><td>Obligatorio en varias APIs. Se descuenta de la ventana</td></tr>
<tr><td><code>temperature</code></td><td>Aleatoriedad del muestreo</td><td>0 para tareas con una respuesta correcta</td></tr>
<tr><td><code>system</code></td><td>Instrucciones persistentes</td><td>En la API de Anthropic es un parámetro aparte, no un mensaje</td></tr>
<tr><td><code>messages</code></td><td>El historial</td><td>Debe alternar user/assistant</td></tr>
<tr><td><code>stop_sequences</code></td><td>Cadenas que cortan la generación</td><td>Útil para delimitar salidas</td></tr>
<tr><td><code>stream</code></td><td>Respuesta incremental</td><td>Siempre que haya un humano esperando</td></tr>
<tr><td><code>tools</code></td><td>Funciones disponibles</td><td>Consumen tokens de contexto: son cacheables</td></tr>
</table>

<div class="dato"><strong>Diferencia entre proveedores:</strong> en la API de Anthropic el <code>system</code>
es un parámetro de primer nivel y los <code>messages</code> deben alternar estrictamente entre <code>user</code>
y <code>assistant</code>. En la de OpenAI el system es un mensaje más dentro del array. Es una fuente habitual
de errores al portar código entre proveedores.</div>

<h4>Manejo de errores que hay que implementar sí o sí</h4>
<table>
<tr><th>Situación</th><th>Qué hacer</th></tr>
<tr><td><b>429</b> — rate limit</td><td>Reintentar con backoff exponencial y jitter, respetando <code>retry-after</code></td></tr>
<tr><td><b>529 / 503</b> — sobrecarga</td><td>Reintentar con backoff. Considerar un modelo alternativo</td></tr>
<tr><td><b>400</b> — contexto excedido</td><td>No reintentar: recortar contexto y volver a armar el prompt</td></tr>
<tr><td><code>stop_reason: max_tokens</code></td><td>La respuesta quedó truncada. Detectarlo <b>siempre</b> antes de parsear</td></tr>
<tr><td>Timeout</td><td>Con streaming, medir tiempo entre chunks, no tiempo total</td></tr>
</table>

<p>Ese <code>stop_reason</code> es el que más se pasa por alto: si la generación se cortó por límite de tokens
vas a intentar parsear un JSON incompleto, y el error va a aparecer como "el modelo devolvió basura" cuando en
realidad devolvió una respuesta perfecta a la que le faltaba el final.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 380" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <rect x="24" y="20" width="632" height="62" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="44" y="44" fill="#7c5cff" font-size="13" font-weight="700">SYSTEM</text>
  <text x="120" y="44" fill="currentColor" opacity=".8" font-size="12">“Sos un asistente de soporte. Máximo 2 párrafos.”</text>
  <text x="44" y="66" fill="currentColor" opacity=".5" font-size="11">fijo · el usuario no lo ve · cacheable · va SIEMPRE primero</text>

  <rect x="24" y="94" width="632" height="52" rx="10" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.5"/>
  <text x="44" y="118" fill="#22d3ee" font-size="13" font-weight="700">USER</text>
  <text x="120" y="118" fill="currentColor" opacity=".8" font-size="12">“¿Cómo cambio mi contraseña?”</text>
  <text x="44" y="137" fill="currentColor" opacity=".5" font-size="11">acá también va el contexto recuperado por RAG</text>

  <rect x="24" y="158" width="632" height="52" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="44" y="182" fill="#34d399" font-size="13" font-weight="700">ASSISTANT</text>
  <text x="120" y="182" fill="currentColor" opacity=".8" font-size="12">“Entrá a Configuración → Seguridad…”</text>
  <text x="44" y="201" fill="currentColor" opacity=".5" font-size="11">lo generó el modelo en la llamada anterior — se lo reenviás vos</text>

  <rect x="24" y="222" width="632" height="52" rx="10" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.5"/>
  <text x="44" y="246" fill="#22d3ee" font-size="13" font-weight="700">USER</text>
  <text x="120" y="246" fill="currentColor" opacity=".8" font-size="12">“¿Y si perdí el acceso al mail?”</text>
  <text x="44" y="265" fill="currentColor" opacity=".5" font-size="11">el mensaje nuevo · lo más importante, al final</text>

  <rect x="24" y="286" width="632" height="46" rx="10" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="5 4"/>
  <text x="44" y="309" fill="#fbbf24" font-size="13" font-weight="700">ASSISTANT  (opcional: prefill)</text>
  <text x="270" y="309" fill="currentColor" opacity=".8" font-size="12" font-family="monospace">“{”</text>
  <text x="44" y="326" fill="currentColor" opacity=".5" font-size="11">si escribís vos el comienzo, el modelo continúa desde ahí — adiós al “¡Claro! Acá tenés:”</text>

  <text x="24" y="360" fill="currentColor" opacity=".55" font-size="11.5">
    Esta lista completa se manda ENTERA en cada llamada. El modelo no guarda absolutamente nada.</text>
</svg>`,
        pie: 'Una llamada es siempre esta estructura. Lo que llamamos conversación es tu código reenviándola completa cada vez.',
      },

      entrevista: [
        { p: '¿Qué diferencia hay entre el system prompt y el mensaje del usuario?',
          r: 'El <b>system prompt</b> contiene instrucciones persistentes que aplican a toda la conversación: rol, reglas, formato, tono. ' +
             'El usuario no lo ve y, sobre todo, no debería poder modificarlo. El <b>mensaje de user</b> es la petición concreta, y suele ser ' +
             'también donde se inyecta el contexto recuperado. La distinción importa por seguridad: <b>si mezclás instrucciones del sistema con ' +
             'contenido que viene del usuario, abrís la puerta a prompt injection</b>.' },

        { p: '¿Qué errores de la API hay que manejar en producción?',
          r: 'Los de rate limit y sobrecarga —429 y 529— con reintentos con backoff exponencial y jitter, respetando el <code>retry-after</code> ' +
             'cuando viene. El 400 por contexto excedido <b>no se reintenta</b>: hay que recortar el prompt. Y el que más se olvida: verificar el ' +
             '<code>stop_reason</code>. Si la generación se cortó por <code>max_tokens</code>, la respuesta está truncada, y si la parseás como JSON ' +
             'vas a ver un error confuso que parece del modelo cuando en realidad es un límite mal configurado.' },

        { p: '¿Cómo garantizás que la respuesta empiece con un formato específico?',
          r: 'Con <b>prefill del assistant</b>: agregás un mensaje de rol assistant con el comienzo de la respuesta ya escrito, por ejemplo una ' +
             'llave de apertura, y el modelo continúa desde ahí. Es más confiable que pedirlo por instrucción porque no depende de que obedezca: ' +
             'aprovecha que la generación es autorregresiva y el modelo simplemente completa lo que ya está escrito.' },
      ],

      practica: `
<h4>Una llamada bien armada</h4>
<pre><code>const r = await anthropic.messages.create({
  model: 'claude-haiku-4-5',      // versión fijada, no un alias móvil
  max_tokens: 1024,               // reservado dentro de la ventana
  temperature: 0,                 // tarea con una respuesta correcta
  system: SYSTEM_PROMPT,          // constante del módulo, nunca armado con string interpolado
  messages: [
    { role: 'user', content: \`Contexto:\\n\${contexto}\\n\\nPregunta: \${pregunta}\` },
    { role: 'assistant', content: '{' },     // prefill: fuerza el arranque en JSON
  ],
});

if (r.stop_reason === 'max_tokens') {
  throw new Error('Respuesta truncada: subí max_tokens o acortá el contexto');
}

const json = JSON.parse('{' + r.content[0].text);   // ojo: hay que reponer el prefill</code></pre>

<div class="aviso"><strong>Dos detalles que se olvidan siempre:</strong><br>
<b>1 · El prefill no viene en la respuesta.</b> Si arrancaste con <code>{</code>, tenés que volver a
concatenarlo antes de parsear.<br>
<b>2 · Fijá la versión del modelo.</b> Un alias tipo "latest" hace que tu sistema cambie de comportamiento un
martes cualquiera sin que hayas tocado una línea de código.</div>

<h4>Reintentos que no empeoran las cosas</h4>
<pre><code>async function conReintentos(fn, intentos = 3) {
  for (let i = 0; i &lt; intentos; i++) {
    try {
      return await fn();
    } catch (e) {
      const reintentable = e.status === 429 || e.status === 529 || e.status >= 500;
      if (!reintentable || i === intentos - 1) throw e;
      // backoff exponencial + jitter: sin el jitter, todos los clientes
      // reintentan a la vez y vuelven a tumbar el servicio
      const espera = Math.pow(2, i) * 1000 + Math.random() * 1000;
      await new Promise(r =&gt; setTimeout(r, espera));
    }
  }
}</code></pre>
<p>El <b>jitter</b> —ese <code>Math.random()</code>— no es un detalle. Sin él, todos los clientes que fallaron
al mismo tiempo reintentan al mismo tiempo, y el pico se repite exactamente igual.</p>
`,

      errores: [
        { mito: 'El system prompt es inviolable.',
          realidad: 'Es una instrucción fuerte, no una barrera de seguridad. Con contextos largos compite por atención con miles de tokens, y con ' +
                    'contenido malicioso puede ser subvertido —eso es <b>prompt injection</b>—. Las reglas críticas hay que repetirlas cerca del final ' +
                    'y, sobre todo, <b>hacerlas cumplir en el código</b>, no confiar en que el modelo obedezca.' },

        { mito: 'Si el JSON viene mal, es que el modelo es malo.',
          realidad: 'Antes de culpar al modelo, revisá tres cosas: si <code>stop_reason</code> fue <code>max_tokens</code> —la respuesta está truncada—, ' +
                    'si la temperatura está en 0, y si usaste prefill o salida estructurada. <b>La enorme mayoría de los JSON rotos son de configuración, ' +
                    'no de capacidad del modelo.</b>' },

        { mito: 'Usar el alias "latest" del modelo me mantiene actualizado.',
          realidad: 'Te mantiene <b>impredecible</b>. El proveedor actualiza el alias y tu sistema cambia de comportamiento sin que hayas hecho ' +
                    'ningún deploy — con prompts afinados para otra versión. En producción se fija la versión exacta y se migra a propósito, ' +
                    'con evals que comparen antes y después.' },

        { mito: 'Con reintentar alcanza.',
          realidad: 'Reintentar sin <b>backoff exponencial y jitter</b> convierte un pico transitorio en una tormenta: todos los clientes que ' +
                    'fallaron juntos vuelven juntos. Y hay errores que <b>no</b> se reintentan: un 400 por contexto excedido va a fallar exactamente igual ' +
                    'las tres veces, gastando tiempo y cuota.' },
      ],

      glosario: [
        { t: 'System prompt', d: 'Instrucciones persistentes que definen rol, reglas y formato. Invisibles para el usuario.' },
        { t: 'Rol (role)', d: 'Etiqueta de cada mensaje: system, user o assistant. Es un artefacto del entrenamiento SFT.' },
        { t: 'Prefill del assistant', d: 'Escribir el comienzo de la respuesta del modelo para forzar su formato.' },
        { t: 'max_tokens', d: 'Límite de tokens de salida. Se descuenta de la ventana de contexto disponible.' },
        { t: 'stop_reason', d: 'Motivo por el que terminó la generación. Si es max_tokens, la respuesta está truncada.' },
        { t: 'Backoff exponencial', d: 'Estrategia de reintentos donde la espera se duplica en cada intento.' },
        { t: 'Jitter', d: 'Aleatoriedad añadida a la espera de reintento para evitar que todos los clientes reintenten a la vez.' },
        { t: 'Rate limit', d: 'Tope de peticiones o tokens por unidad de tiempo impuesto por el proveedor.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Prompting que funciona siempre, no una vez',
      minutos: 10,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> escribí el prompt como si le explicaras la tarea a
alguien competente pero completamente nuevo, que no puede preguntarte nada y que va a hacer <b>exactamente</b>
lo que digas.</div>

<p>La diferencia entre un prompt que anda en la demo y uno que anda en producción no es el ingenio: es la
<b>precisión</b>. Un prompt vago funciona a veces; y "a veces" en producción es un problema.</p>

<h4>Las seis cosas que hacen la diferencia</h4>

<p><b>1 · Ser específico en vez de cualitativo.</b></p>
<ul>
<li>❌ "Hacé un resumen corto"</li>
<li>✅ "Resumí en máximo 3 oraciones, sin superar 50 palabras"</li>
</ul>
<p>"Corto" es una opinión. "50 palabras" es una instrucción.</p>

<p><b>2 · Decir qué hacer, no qué no hacer.</b></p>
<ul>
<li>❌ "No uses lenguaje técnico"</li>
<li>✅ "Escribí como si le explicaras a alguien sin formación técnica"</li>
</ul>
<p>Una prohibición deja infinitas opciones abiertas. Una instrucción positiva marca el camino.</p>

<p><b>3 · Dar ejemplos.</b> Un ejemplo vale más que tres párrafos de instrucciones. Si querés un formato
específico, mostralo.</p>

<p><b>4 · Estructurar el prompt.</b> Separá las partes con encabezados o etiquetas. Un bloque de texto corrido
se lee peor —también para el modelo.</p>

<p><b>5 · Definir qué hacer ante lo inesperado.</b> ¿Qué pasa si el documento no tiene la respuesta? ¿Si la
pregunta está fuera de tema? ¿Si el dato está incompleto? <b>Si no lo decís, el modelo improvisa.</b></p>

<p><b>6 · Dejarlo pensar antes de responder.</b> Para tareas con varios pasos, pedile el razonamiento primero
y la respuesta después. Mejora los resultados de verdad, porque cada paso escrito sostiene al siguiente.</p>

<div class="aviso"><strong>La prueba definitiva:</strong> si le diste el prompt a un colega junto con una
entrada de ejemplo, ¿podría producir la salida correcta sin hacerte ni una pregunta? Si no, el prompt está
incompleto — y el modelo va a llenar ese hueco a su criterio, distinto cada vez.</div>
`,

      tecnico: `
<h4>Estructura recomendada</h4>
<pre><code>&lt;rol&gt;
Sos un analista de contratos con 10 años de experiencia.
&lt;/rol&gt;

&lt;tarea&gt;
Extraé las cláusulas de rescisión del contrato y devolvé JSON.
&lt;/tarea&gt;

&lt;reglas&gt;
- Copiá el texto literal de cada cláusula, sin parafrasear.
- Si no hay cláusulas de rescisión, devolvé un array vacío.
- No infieras cláusulas implícitas.
&lt;/reglas&gt;

&lt;formato&gt;
{ "clausulas": [ { "numero": string, "texto": string, "pagina": number } ] }
&lt;/formato&gt;

&lt;ejemplo&gt;
Entrada: "...Artículo 12: Cualquiera de las partes podrá rescindir..."
Salida: { "clausulas": [ { "numero": "12", "texto": "Cualquiera de las partes
         podrá rescindir...", "pagina": 4 } ] }
&lt;/ejemplo&gt;

&lt;documento&gt;
{contenido}
&lt;/documento&gt;</code></pre>

<p>Las etiquetas tipo XML no son obligatorias, pero funcionan muy bien: son delimitadores inequívocos y hay
mucho contenido así en los datos de entrenamiento. Markdown con encabezados sirve igual.</p>

<h4>Técnicas, por efectividad real</h4>
<table>
<tr><th>Técnica</th><th>Qué es</th><th>Cuándo</th></tr>
<tr><td><b>Few-shot</b></td><td>2-5 ejemplos de entrada y salida</td><td>La de mayor impacto para fijar formato y criterio</td></tr>
<tr><td><b>Chain-of-thought</b></td><td>Pedir razonamiento antes de la respuesta</td><td>Problemas de varios pasos, clasificaciones con criterios sutiles</td></tr>
<tr><td><b>Asignación de rol</b></td><td>"Sos un X con experiencia en Y"</td><td>Efecto moderado; ayuda con el registro y el vocabulario</td></tr>
<tr><td><b>Descomposición</b></td><td>Partir en varias llamadas encadenadas</td><td>Cuando una sola llamada hace demasiadas cosas</td></tr>
<tr><td><b>Autocrítica</b></td><td>Pedirle que revise su propia salida</td><td>Tareas de alto valor; duplica el costo</td></tr>
<tr><td><b>Prefill</b></td><td>Escribir el inicio de la respuesta</td><td>Control de formato, muy confiable</td></tr>
</table>

<div class="dato"><strong>Sobre el orden de los ejemplos:</strong> en clasificación, el modelo tiene sesgo hacia
las etiquetas que aparecen más y hacia el último ejemplo mostrado. Conviene <b>balancear la cantidad por clase</b>
y no dejar siempre la misma al final. Es una causa silenciosa de sesgo en clasificadores basados en few-shot.</div>

<h4>Iteración disciplinada</h4>
<p>Un prompt no se "mejora" a ojo. El ciclo correcto es:</p>
<ol>
<li>Armar un conjunto de <b>20-50 casos</b> con su salida esperada, incluidos los raros.</li>
<li>Medir la tasa de acierto del prompt actual. Esa es tu línea base.</li>
<li>Cambiar <b>una sola cosa</b>.</li>
<li>Volver a medir sobre <i>todo</i> el conjunto.</li>
<li>Conservar el cambio solo si mejoró el agregado.</li>
</ol>
<p>Sin esto, lo que ocurre siempre es lo mismo: arreglás el caso que estabas mirando y rompés tres que no
estabas mirando. <b>Un prompt sin conjunto de evaluación no se puede mejorar, solo se puede cambiar.</b></p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <rect x="24" y="18" width="304" height="184" rx="12" fill="#f87171" fill-opacity=".07" stroke="#f87171" stroke-width="1.5"/>
  <text x="42" y="44" fill="#f87171" font-size="13" font-weight="700">✗ PROMPT VAGO</text>
  <text x="42" y="72" fill="currentColor" opacity=".75" font-size="11.5" font-family="monospace">“Resumí este texto de forma</text>
  <text x="42" y="90" fill="currentColor" opacity=".75" font-size="11.5" font-family="monospace"> clara y no muy larga, sin usar</text>
  <text x="42" y="108" fill="currentColor" opacity=".75" font-size="11.5" font-family="monospace"> lenguaje técnico.”</text>
  <text x="42" y="140" fill="currentColor" opacity=".5" font-size="11">“clara” → opinión</text>
  <text x="42" y="158" fill="currentColor" opacity=".5" font-size="11">“no muy larga” → ¿50 o 500 palabras?</text>
  <text x="42" y="176" fill="currentColor" opacity=".5" font-size="11">prohibición → deja todo lo demás abierto</text>
  <text x="42" y="194" fill="#f87171" font-size="11" font-weight="700">resultado distinto en cada llamada</text>

  <rect x="352" y="18" width="304" height="184" rx="12" fill="#34d399" fill-opacity=".07" stroke="#34d399" stroke-width="1.5"/>
  <text x="370" y="44" fill="#34d399" font-size="13" font-weight="700">✓ PROMPT PRECISO</text>
  <text x="370" y="72" fill="currentColor" opacity=".75" font-size="11.5" font-family="monospace">“Resumí en máximo 3 oraciones,</text>
  <text x="370" y="90" fill="currentColor" opacity=".75" font-size="11.5" font-family="monospace"> sin superar 50 palabras.</text>
  <text x="370" y="108" fill="currentColor" opacity=".75" font-size="11.5" font-family="monospace"> Escribí como para alguien sin</text>
  <text x="370" y="126" fill="currentColor" opacity=".75" font-size="11.5" font-family="monospace"> formación técnica.”</text>
  <text x="370" y="158" fill="currentColor" opacity=".5" font-size="11">límite numérico → verificable</text>
  <text x="370" y="176" fill="currentColor" opacity=".5" font-size="11">instrucción positiva → marca el camino</text>
  <text x="370" y="194" fill="#34d399" font-size="11" font-weight="700">mismo resultado, llamada tras llamada</text>

  <text x="24" y="238" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CICLO DE MEJORA — sin esto no estás mejorando, estás cambiando</text>

  <rect x="24" y="252" width="118" height="52" rx="9" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="83" y="274" text-anchor="middle" fill="currentColor" font-size="11.5" font-weight="700">20-50 casos</text>
  <text x="83" y="291" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10.5">con salida esperada</text>

  <text x="150" y="282" fill="currentColor" opacity=".4" font-size="15">→</text>

  <rect x="170" y="252" width="118" height="52" rx="9" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="229" y="274" text-anchor="middle" fill="currentColor" font-size="11.5" font-weight="700">Medir base</text>
  <text x="229" y="291" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10.5">tasa de acierto</text>

  <text x="296" y="282" fill="currentColor" opacity=".4" font-size="15">→</text>

  <rect x="316" y="252" width="118" height="52" rx="9" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="375" y="274" text-anchor="middle" fill="currentColor" font-size="11.5" font-weight="700">Un solo cambio</text>
  <text x="375" y="291" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10.5">uno, no tres</text>

  <text x="442" y="282" fill="currentColor" opacity=".4" font-size="15">→</text>

  <rect x="462" y="252" width="118" height="52" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="521" y="274" text-anchor="middle" fill="currentColor" font-size="11.5" font-weight="700">Volver a medir</text>
  <text x="521" y="291" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10.5">TODO el conjunto</text>

  <path d="M 521 306 q 0 34 -220 34 q -220 0 -220 -34" fill="none" stroke="currentColor" stroke-opacity=".3" stroke-width="1.4" stroke-dasharray="5 4"/>
  <text x="300" y="358" text-anchor="middle" fill="currentColor" opacity=".5" font-size="11">
    conservar el cambio solo si mejoró el agregado</text>
  <text x="340" y="384" text-anchor="middle" fill="#f87171" opacity=".9" font-size="11.5">
    Sin conjunto de evaluación, arreglás el caso que mirás y rompés tres que no mirás.</text>
</svg>`,
        pie: 'Arriba, la diferencia entre vago y preciso. Abajo, el único ciclo que realmente mejora un prompt.',
      },

      entrevista: [
        { p: '¿Cómo abordás la escritura de un prompt para una tarea nueva?',
          r: 'Empiezo por lo que voy a necesitar después: <b>un conjunto de 20 a 50 casos con la salida esperada</b>, incluidos los raros. ' +
             'Sin eso no puedo saber si estoy mejorando. Después escribo un prompt estructurado —rol, tarea, reglas, formato, ejemplos, y qué hacer ' +
             'ante lo inesperado— y mido la línea base. A partir de ahí itero cambiando <b>una sola cosa por vez</b> y volviendo a medir sobre todo el ' +
             'conjunto. Es lento al principio y mucho más rápido después.' },

        { p: '¿Por qué "sé conciso" es un mal prompt?',
          r: 'Porque es una instrucción cualitativa y por lo tanto no verificable. "Conciso" significa distintas cosas en distintas llamadas, ' +
             'así que la longitud de salida va a variar sin control. <b>"Máximo 3 oraciones, sin superar 50 palabras" es verificable por código</b>, ' +
             'da resultados consistentes y además te permite escribir un test. La regla general: si no podés comprobar automáticamente si el modelo ' +
             'cumplió la instrucción, esa instrucción está mal escrita.' },

        { p: 'Cambiás un prompt para arreglar un caso y se rompen otros. ¿Cómo lo evitás?',
          r: 'Es el síntoma de no tener evals. Un prompt sin conjunto de evaluación no se puede mejorar, solo se puede cambiar: estás optimizando ' +
             'para el caso que tenés en pantalla. La solución es tratar el prompt como código: <b>un conjunto de casos versionado, una métrica agregada, ' +
             'y la regla de conservar el cambio solo si el agregado mejora</b>. Y cuando aparece un caso nuevo que falla, se agrega al conjunto ' +
             'antes de arreglarlo, igual que un test de regresión.' },

        { p: '¿Cuándo conviene partir una tarea en varias llamadas?',
          r: 'Cuando una sola llamada hace cosas con criterios distintos —por ejemplo extraer datos <i>y</i> juzgarlos <i>y</i> redactar un informe—. ' +
             'Partirlo tiene tres ventajas: cada paso se puede evaluar por separado, se puede usar un modelo más barato en los pasos mecánicos, ' +
             'y cuando algo falla sabés exactamente dónde. El costo es más latencia y más llamadas, así que <b>no conviene partir por prolijidad ' +
             'sino cuando la calidad o la depuración lo justifican</b>.' },
      ],

      practica: `
<h4>Antes y después, con un caso real</h4>

<p><b>Prompt inicial:</b></p>
<pre><code>Analizá este email de un cliente y decime si está enojado.</code></pre>
<p>Problemas: ¿qué es "enojado"? ¿qué formato de salida? ¿qué pasa si es ambiguo? ¿y si no es un email?</p>

<p><b>Prompt corregido:</b></p>
<pre><code>&lt;tarea&gt;
Clasificá el tono del email de un cliente.
&lt;/tarea&gt;

&lt;categorias&gt;
- "neutral": consulta o trámite, sin carga emocional.
- "molesto": expresa fastidio o insatisfacción, pero mantiene el trato cordial.
- "enojado": expresa enojo explícito, exige, amenaza con irse o con reclamar.
&lt;/categorias&gt;

&lt;reglas&gt;
- Ante la duda entre dos categorías, elegí la MENOS grave.
- Las mayúsculas y los signos de exclamación por sí solos no determinan la categoría.
- Si el texto no es un email de cliente, devolvé categoria: "fuera_de_alcance".
&lt;/reglas&gt;

&lt;formato&gt;
{ "categoria": string, "fragmento_clave": string, "razon": string }
&lt;/formato&gt;

&lt;email&gt;
{contenido}
&lt;/email&gt;</code></pre>

<p>Qué cambió, punto por punto:</p>
<ul>
<li><b>Categorías definidas</b> — se elimina la interpretación.</li>
<li><b>Regla de desempate</b> — el caso ambiguo tiene una respuesta determinada.</li>
<li><b>Un falso positivo previsto</b> — las mayúsculas no son enojo por sí solas.</li>
<li><b>Salida de escape</b> — qué hacer si la entrada no es lo esperado.</li>
<li><b><code>fragmento_clave</code></b> — obliga a anclar la decisión en el texto, y te deja verificarla.</li>
</ul>

<div class="aviso"><strong>Ese último punto es el más subestimado.</strong> Pedir el fragmento que justifica la
decisión hace dos cosas a la vez: <b>mejora la clasificación</b>, porque obliga al modelo a fundamentarse en el
texto en lugar de responder de una; y <b>te da una forma de auditar</b>, porque podés verificar por código que
ese fragmento realmente exista en el email.</div>
`,

      errores: [
        { mito: 'Los prompts largos son mejores.',
          realidad: 'Los prompts <b>precisos</b> son mejores. Un prompt largo lleno de instrucciones vagas y redundantes rinde peor que uno corto ' +
                    'y específico, y encima cuesta más tokens en cada llamada. Si al agregar una instrucción la métrica no mejora, esa instrucción sobra.' },

        { mito: 'Decirle lo que NO tiene que hacer alcanza.',
          realidad: 'Una prohibición deja infinitas alternativas abiertas: "no uses jerga" no dice qué registro usar. ' +
                    '<b>Las instrucciones positivas funcionan mucho mejor</b> porque describen el objetivo en lugar de un borde.' },

        { mito: 'Si funciona en cinco ejemplos, funciona.',
          realidad: 'Cinco ejemplos elegidos por vos no representan la distribución real: casi siempre son los casos fáciles. ' +
                    'Hacen falta <b>20 a 50 casos</b> que incluyan explícitamente los raros, los ambiguos y las entradas mal formadas. ' +
                    'Eso es lo que distingue un prototipo de algo que se puede poner en producción.' },

        { mito: 'Asignarle un rol experto mejora mucho los resultados.',
          realidad: 'Ayuda con el <b>registro y el vocabulario</b>, pero su efecto sobre la exactitud es modesto y está bastante sobrevendido. ' +
                    'Lo que realmente mueve la aguja son los ejemplos, las reglas explícitas de desempate y un formato de salida bien definido.' },
      ],

      glosario: [
        { t: 'Zero-shot', d: 'Pedir la tarea sin ejemplos, solo con instrucciones.' },
        { t: 'Few-shot', d: 'Incluir entre 2 y 5 ejemplos de entrada y salida deseada. La técnica de mayor impacto.' },
        { t: 'Chain-of-thought', d: 'Pedir el razonamiento paso a paso antes de la respuesta final.' },
        { t: 'Descomposición', d: 'Partir una tarea compleja en varias llamadas encadenadas, más simples y evaluables por separado.' },
        { t: 'Autocrítica', d: 'Pedirle al modelo que revise y corrija su propia salida. Mejora la calidad al doble de costo.' },
        { t: 'Delimitadores', d: 'Etiquetas o marcas que separan las secciones del prompt sin ambigüedad.' },
        { t: 'Regla de desempate', d: 'Instrucción explícita sobre qué hacer ante un caso ambiguo. Elimina variabilidad.' },
        { t: 'Salida de escape', d: 'Categoría o respuesta prevista para entradas fuera de lo esperado.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Few-shot y chain-of-thought',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> <b>few-shot</b> es mostrarle ejemplos resueltos.
<b>Chain-of-thought</b> es dejarlo hacer la cuenta en un papel antes de decirte el resultado.</div>

<h4>Few-shot: mostrar en vez de explicar</h4>
<p>Podés escribir tres párrafos describiendo el formato que querés, o podés mostrar dos ejemplos. Lo segundo
funciona mejor y ocupa menos.</p>
<pre><code>Clasificá el sentimiento.

Texto: "Llegó tarde pero el producto es excelente"
Sentimiento: mixto

Texto: "Nunca más compro acá"
Sentimiento: negativo

Texto: "{entrada}"
Sentimiento:</code></pre>
<p>Con esos dos ejemplos el modelo ya sabe: que la salida es una sola palabra, que existe la categoría "mixto",
y que un elogio con una queja va a "mixto" y no a "positivo". Explicar todo eso con palabras habría llevado
mucho más y habría quedado más ambiguo.</p>

<p><b>Cuántos ejemplos:</b> entre 2 y 5 suele ser el punto óptimo. Más que eso da rendimientos decrecientes y
gasta tokens en cada llamada.</p>
<p><b>Cuáles elegir:</b> los <b>casos límite</b>, no los fáciles. El ejemplo que más enseña es el ambiguo, el
que muestra la regla de desempate.</p>

<h4>Chain-of-thought: dejarlo pensar</h4>
<p>Comparemos:</p>
<pre><code>❌ "¿Cuánto es el total con 21% de IVA de $4.500 más envío de $800?"
   → puede tirar un número mal, de una

✅ "Calculá paso a paso y después dame el total."
   → Subtotal: 4500 + 800 = 5300
     IVA: 5300 × 0.21 = 1113
     Total: 5300 + 1113 = 6413</code></pre>

<p><b>¿Por qué funciona?</b> Porque el modelo genera palabra por palabra, apoyándose en lo que ya escribió.
Si le pedís el resultado de una, tiene una sola pasada para llegar. Si lo dejás escribir los pasos, cada
conclusión se apoya en un paso ya escrito. Es literalmente darle más espacio para trabajar.</p>

<div class="aviso"><strong>El costo, que hay que tener presente:</strong> el razonamiento son tokens de salida,
y los tokens de salida son los caros. Chain-of-thought puede triplicar el costo de una llamada. Conviene
donde el problema tiene <b>varios pasos</b>. En una extracción o una clasificación simple es tirar plata.</div>
`,

      tecnico: `
<h4>Few-shot: detalles que importan</h4>
<ul>
<li><b>Cantidad.</b> El salto grande es de 0 a 2 ejemplos. De 5 en adelante, rendimientos decrecientes y costo creciente en cada llamada.</li>
<li><b>Selección.</b> Los ejemplos deben cubrir <i>la variedad</i>, no la frecuencia. Un caso límite bien elegido enseña más que diez casos típicos.</li>
<li><b>Balance de clases.</b> En clasificación, el modelo se sesga hacia las etiquetas más representadas entre los ejemplos. Hay que balancear.</li>
<li><b>Sesgo de recencia.</b> Existe una tendencia a favorecer la etiqueta del último ejemplo. Conviene variar cuál queda al final.</li>
<li><b>Consistencia de formato.</b> Los ejemplos tienen que ser idénticos en estructura al caso real. Cualquier variación se copia.</li>
<li><b>Few-shot dinámico.</b> En vez de ejemplos fijos, recuperar los k más similares a la entrada desde un banco de ejemplos. Es RAG aplicado a los ejemplos, y suele dar un salto notable.</li>
</ul>

<h4>Chain-of-thought: variantes</h4>
<table>
<tr><th>Variante</th><th>Cómo</th><th>Costo</th></tr>
<tr><td><b>Zero-shot CoT</b></td><td>Agregar "pensá paso a paso"</td><td>Bajo. Sorprendentemente efectivo</td></tr>
<tr><td><b>Few-shot CoT</b></td><td>Ejemplos que incluyen el razonamiento</td><td>Medio. Más control sobre el estilo de razonamiento</td></tr>
<tr><td><b>Autoconsistencia</b></td><td>N razonamientos independientes y voto mayoritario</td><td>N veces. Solo para tareas críticas</td></tr>
<tr><td><b>Razonamiento oculto</b></td><td>Razonar dentro de etiquetas que después se descartan</td><td>Medio. Mantiene limpia la salida al usuario</td></tr>
</table>

<div class="dato"><strong>Advertencia importante:</strong> el razonamiento que escribe el modelo <b>no es
necesariamente el proceso real</b> que lo llevó a la respuesta. Puede producir una explicación coherente que
justifica una conclusión a la que llegó por otro camino —racionalización, no introspección—. Sirve para
mejorar el resultado y para depurar, <b>pero no es una auditoría confiable de la decisión</b>. Esto importa
cuando alguien propone usar la explicación del modelo como justificación regulatoria.</div>

<h4>Modelos de razonamiento vs chain-of-thought por prompt</h4>
<p>Los modelos de razonamiento traen esto entrenado: generan cadenas largas internamente antes de responder.
Diferencias prácticas:</p>
<ul>
<li>Con un modelo de razonamiento, <b>pedirle chain-of-thought es redundante</b> y a veces contraproducente.</li>
<li>Rinden mejor en matemática, lógica y depuración, con más latencia y más tokens.</li>
<li>Para extracción, clasificación o resumen <b>no aportan</b> y salen bastante más caros.</li>
</ul>
<p>La decisión no es "¿uso razonamiento?" sino "¿este problema tiene varios pasos y una respuesta verificable?".</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="26" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    SIN CHAIN-OF-THOUGHT — una sola pasada para llegar al resultado</text>

  <rect x="24" y="38" width="188" height="42" rx="9" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="118" y="64" text-anchor="middle" fill="currentColor" font-size="11.5">pregunta con 3 pasos</text>

  <text x="222" y="64" fill="currentColor" opacity=".4" font-size="16">→</text>

  <rect x="248" y="38" width="150" height="42" rx="9" fill="currentColor" fill-opacity=".06" stroke="currentColor" stroke-opacity=".3" stroke-width="1.3"/>
  <text x="323" y="64" text-anchor="middle" fill="currentColor" opacity=".6" font-size="11.5">1 pasada</text>

  <text x="408" y="64" fill="currentColor" opacity=".4" font-size="16">→</text>

  <rect x="434" y="38" width="150" height="42" rx="9" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.3"/>
  <text x="509" y="64" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">$ 6.213  ✗</text>

  <line x1="24" y1="104" x2="656" y2="104" stroke="currentColor" opacity=".18"/>

  <text x="24" y="132" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CON CHAIN-OF-THOUGHT — cada paso escrito sostiene al siguiente</text>

  <rect x="24" y="144" width="188" height="42" rx="9" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="118" y="170" text-anchor="middle" fill="currentColor" font-size="11.5">pregunta con 3 pasos</text>

  <text x="222" y="170" fill="currentColor" opacity=".4" font-size="16">→</text>

  <rect x="248" y="130" width="230" height="30" rx="7" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.2"/>
  <text x="262" y="150" fill="currentColor" opacity=".8" font-size="11" font-family="monospace">Subtotal: 4500 + 800 = 5300</text>

  <rect x="248" y="164" width="230" height="30" rx="7" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.2"/>
  <text x="262" y="184" fill="currentColor" opacity=".8" font-size="11" font-family="monospace">IVA: 5300 × 0.21 = 1113</text>

  <rect x="248" y="198" width="230" height="30" rx="7" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.2"/>
  <text x="262" y="218" fill="currentColor" opacity=".8" font-size="11" font-family="monospace">Total: 5300 + 1113 = 6413</text>

  <text x="490" y="184" fill="currentColor" opacity=".4" font-size="16">→</text>

  <rect x="512" y="164" width="144" height="42" rx="9" fill="#34d399" fill-opacity=".18" stroke="#34d399" stroke-width="1.4"/>
  <text x="584" y="190" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">$ 6.413  ✓</text>

  <text x="248" y="252" fill="currentColor" opacity=".5" font-size="11">
    cada línea queda en el contexto y la siguiente se apoya en ella</text>

  <line x1="24" y1="276" x2="656" y2="276" stroke="currentColor" opacity=".18"/>

  <rect x="24" y="292" width="308" height="92" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.4"/>
  <text x="44" y="316" fill="#34d399" font-size="12.5" font-weight="700">USALO CUANDO</text>
  <text x="44" y="338" fill="currentColor" opacity=".72" font-size="11.5">· el problema tiene varios pasos</text>
  <text x="44" y="356" fill="currentColor" opacity=".72" font-size="11.5">· hay cálculo o lógica encadenada</text>
  <text x="44" y="374" fill="currentColor" opacity=".72" font-size="11.5">· la clasificación tiene criterios sutiles</text>

  <rect x="348" y="292" width="308" height="92" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.4"/>
  <text x="368" y="316" fill="#f87171" font-size="12.5" font-weight="700">NO LO USES CUANDO</text>
  <text x="368" y="338" fill="currentColor" opacity=".72" font-size="11.5">· es extracción o copiado de datos</text>
  <text x="368" y="356" fill="currentColor" opacity=".72" font-size="11.5">· es una clasificación evidente</text>
  <text x="368" y="374" fill="currentColor" opacity=".72" font-size="11.5">· ya usás un modelo de razonamiento</text>
</svg>`,
        pie: 'El razonamiento son tokens de salida — los caros. Puede triplicar el costo, así que se usa donde paga.',
      },

      entrevista: [
        { p: '¿Por qué funciona el chain-of-thought?',
          r: 'Porque la generación es autorregresiva: cada token se produce condicionado a todo lo anterior, incluido lo que el modelo mismo escribió. ' +
             'Si le pedís la respuesta directa, tiene una sola pasada por la red para resolver todo el problema. Si lo dejás escribir los pasos ' +
             'intermedios, cada paso queda en el contexto y los siguientes se apoyan sobre él. ' +
             '<b>Es darle más cómputo para el mismo problema, y por eso mejora de verdad, no solo en apariencia.</b>' },

        { p: '¿Cuántos ejemplos usás en few-shot y cómo los elegís?',
          r: 'Entre 2 y 5 suele ser el punto óptimo: el salto grande es de 0 a 2 y después hay rendimientos decrecientes con costo creciente en ' +
             'cada llamada. Sobre cuáles: elijo <b>casos límite, no casos fáciles</b> —el ejemplo ambiguo es el que enseña la regla de desempate—. ' +
             'En clasificación además balanceo la cantidad por clase, porque el modelo se sesga hacia las etiquetas más representadas y hacia la del ' +
             'último ejemplo. Y si tengo un banco grande de ejemplos, uso <b>few-shot dinámico</b>: recupero los más similares a la entrada actual.' },

        { p: '¿El razonamiento que escribe el modelo refleja cómo llegó a la respuesta?',
          r: 'No necesariamente, y es una distinción importante. El modelo puede producir una explicación coherente que <i>justifica</i> una conclusión ' +
             'a la que llegó por otro camino: es racionalización, no introspección. Sirve para mejorar el resultado y para depurar, ' +
             '<b>pero no es una auditoría confiable de la decisión</b>. Lo aclaro cuando alguien propone usar esa explicación como justificación ' +
             'ante un cliente o un regulador.' },
      ],

      practica: `
<h4>Few-shot dinámico: el patrón que más rinde</h4>
<p>En vez de ejemplos fijos, recuperá los más parecidos a la entrada actual:</p>
<pre><code>async function armarPrompt(entrada) {
  // banco de casos ya resueltos y verificados, indexado por embedding
  const similares = await buscarEjemplos(entrada, { limite: 3 });

  const ejemplos = similares
    .map(e =&gt; \`Texto: "\${e.entrada}"\\nSentimiento: \${e.salida}\`)
    .join('\\n\\n');

  return \`Clasificá el sentimiento.\\n\\n\${ejemplos}\\n\\nTexto: "\${entrada}"\\nSentimiento:\`;
}</code></pre>
<p>Es RAG aplicado a los ejemplos. Ventaja adicional muy concreta: cuando aparece un caso que el sistema falla,
lo corregís y lo agregás al banco. <b>El sistema mejora sin tocar el prompt ni desplegar nada.</b></p>

<h4>Razonamiento oculto, para no ensuciar la salida</h4>
<pre><code>Analizá el caso dentro de &lt;razonamiento&gt;. Después devolvé SOLO el JSON
final dentro de &lt;respuesta&gt;.

&lt;razonamiento&gt;
...acá pensás todo lo que necesites...
&lt;/razonamiento&gt;

&lt;respuesta&gt;
{ "categoria": "...", "confianza": 0.0 }
&lt;/respuesta&gt;</code></pre>
<p>Después extraés solo el bloque <code>&lt;respuesta&gt;</code>. El usuario ve una salida limpia, vos te quedás
con el razonamiento en los logs para depurar, y el modelo tuvo su espacio para pensar.</p>

<div class="aviso"><strong>Cuándo NO usar chain-of-thought:</strong> en tareas de un solo paso —extraer un
campo, clasificar en dos categorías obvias, reformatear— agrega latencia y costo sin mejorar nada. Y si ya
estás usando un modelo de razonamiento, pedirle explícitamente que razone es redundante y a veces empeora el
resultado.</div>
`,

      errores: [
        { mito: 'Más ejemplos siempre es mejor.',
          realidad: 'Después de 5 los rendimientos son decrecientes, pero el costo sigue subiendo <b>en cada llamada</b>. Y hay un efecto peor: ' +
                    'demasiados ejemplos parecidos hacen que el modelo copie el patrón superficial en lugar de aplicar el criterio. ' +
                    'Mejor pocos ejemplos <b>diversos</b> que muchos ejemplos similares.' },

        { mito: 'Chain-of-thought mejora cualquier tarea.',
          realidad: 'Mejora las que tienen <b>varios pasos</b>. En extracción, clasificación simple o reformateo, agrega latencia y triplica el costo ' +
                    'sin ganancia medible. Y con un modelo de razonamiento es redundante: eso ya lo hace internamente.' },

        { mito: 'El razonamiento del modelo explica su decisión.',
          realidad: 'Puede ser una <b>racionalización</b>: una explicación plausible construida después, no el proceso real. Es útil para depurar y ' +
                    'mejora el resultado, pero no sirve como auditoría. Es un punto que hay que aclarar antes de que alguien lo use como justificación ' +
                    'ante un cliente o un regulador.' },

        { mito: 'Los ejemplos de few-shot pueden ser cualquiera.',
          realidad: 'El modelo copia todo lo que ve: formato, longitud, estilo y sesgos. Si tus ejemplos tienen mayoría de una clase, va a sobrepredecir ' +
                    'esa clase; si el último ejemplo es de cierta categoría, hay sesgo hacia ella. <b>Elegí casos límite, balanceá por clase y variá ' +
                    'cuál queda al final.</b>' },
      ],

      glosario: [
        { t: 'Few-shot dinámico', d: 'Recuperar los ejemplos más similares a la entrada actual, en vez de usar ejemplos fijos.' },
        { t: 'Zero-shot CoT', d: 'Activar el razonamiento con una instrucción genérica como "pensá paso a paso", sin ejemplos.' },
        { t: 'Autoconsistencia', d: 'Generar varios razonamientos independientes y quedarse con la respuesta mayoritaria.' },
        { t: 'Razonamiento oculto', d: 'Razonar dentro de etiquetas que después se descartan, para dejar limpia la salida al usuario.' },
        { t: 'Sesgo de recencia', d: 'Tendencia a favorecer la etiqueta del último ejemplo mostrado en el prompt.' },
        { t: 'Racionalización', d: 'Explicación coherente construida a posteriori, que no refleja el proceso real de la decisión.' },
        { t: 'Banco de ejemplos', d: 'Colección de casos resueltos y verificados, usada para few-shot dinámico. Mejora el sistema sin desplegar código.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Salida estructurada: que el JSON sea siempre válido',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> si tu código va a consumir la respuesta, no
alcanza con <i>pedir</i> JSON. Hay que <b>garantizarlo</b>.</div>

<p>Le pedís al modelo un JSON con cinco campos. Funciona. Lo probás diez veces más, funciona. Lo ponés en
producción y a las dos semanas aparecen:</p>
<ul>
<li>Respuestas que arrancan con "¡Claro! Acá tenés el JSON:" antes del objeto</li>
<li>El JSON envuelto en un bloque de código markdown</li>
<li>Un campo extra que nadie pidió</li>
<li>Un número como <code>"1.234,50"</code> en vez de <code>1234.5</code></li>
<li>Un JSON cortado a la mitad</li>
</ul>
<p>Ninguna de esas es culpa del modelo: <b>todas son de configuración.</b> Y todas tienen solución.</p>

<h4>Las cuatro herramientas, de menos a más confiable</h4>

<p><b>1 · Pedirlo bien.</b> Mostrar el esquema exacto en el prompt y un ejemplo. Ayuda, pero no garantiza nada.</p>

<p><b>2 · Prefill.</b> Empezás vos la respuesta del assistant con <code>{</code>. El modelo no puede escribir
el preámbulo porque ya arrancó dentro del objeto. Barato y muy efectivo.</p>

<p><b>3 · Tool calling como truco de formato.</b> Este es el que casi nadie conoce: declarás una herramienta
cuyos parámetros son exactamente tu esquema y lo obligás a "llamarla". El proveedor garantiza que los
argumentos cumplan el esquema. <b>Nunca ejecutás esa herramienta</b>: solo la usás para obtener datos
validados.</p>

<p><b>4 · Salida estructurada nativa.</b> Varios proveedores permiten pasar un JSON Schema y garantizan que la
salida lo cumpla, restringiendo la generación token a token. Es lo más confiable cuando está disponible.</p>

<div class="aviso"><strong>Y después de todo eso, igual validás.</strong> Que el JSON sea sintácticamente válido
no significa que el contenido sea correcto: el modelo puede devolver un total mal calculado en un campo
perfectamente tipado. <b>Esquema válido ≠ dato correcto.</b></div>
`,

      tecnico: `
<h4>Comparación de mecanismos</h4>
<table>
<tr><th>Mecanismo</th><th>Garantía</th><th>Costo</th><th>Portabilidad</th></tr>
<tr><td>Instrucción en el prompt</td><td>Ninguna</td><td>Nulo</td><td>Total</td></tr>
<tr><td>Prefill del assistant</td><td>Alta para el arranque</td><td>Nulo</td><td>Alta</td></tr>
<tr><td>Tool calling forzado</td><td>Alta sobre el esquema</td><td>Tokens de la definición</td><td>Media</td></tr>
<tr><td>Structured output nativo</td><td><b>Total</b> sobre el esquema</td><td>Bajo</td><td>Baja, varía por proveedor</td></tr>
</table>

<h4>Tool calling como formateador</h4>
<pre><code>const herramienta = {
  name: 'registrar_extraccion',
  description: 'Registra los datos extraídos de la factura',
  input_schema: {
    type: 'object',
    properties: {
      numero:   { type: 'string' },
      fecha:    { type: 'string', description: 'ISO 8601, AAAA-MM-DD' },
      total:    { type: 'number', description: 'Sin separador de miles, punto decimal' },
      moneda:   { type: 'string', enum: ['ARS', 'USD', 'EUR'] },
      items:    { type: 'array', items: { /* ... */ } },
    },
    required: ['numero', 'fecha', 'total', 'moneda'],
  },
};

const r = await anthropic.messages.create({
  model: 'claude-haiku-4-5',
  max_tokens: 2048,
  temperature: 0,
  tools: [herramienta],
  tool_choice: { type: 'tool', name: 'registrar_extraccion' },  // ← forzado
  messages: [{ role: 'user', content: texto }],
});

const datos = r.content.find(b =&gt; b.type === 'tool_use').input;   // ya validado</code></pre>

<h4>Reglas para diseñar el esquema</h4>
<ul>
<li><b>Usá <code>enum</code> siempre que el conjunto sea cerrado.</b> Es la forma más barata de eliminar categorías inventadas.</li>
<li><b>Usá <code>description</code> en cada campo.</b> El modelo las lee: son parte del prompt. "ISO 8601" evita diez formatos de fecha distintos.</li>
<li><b>Marcá <code>required</code> lo que sea obligatorio</b>, y agregá un campo explícito de "no encontrado" en vez de dejar que invente un valor.</li>
<li><b>Evitá anidamiento profundo.</b> Más de dos o tres niveles baja la fiabilidad de forma notoria; conviene aplanar.</li>
<li><b>Números como <code>number</code>, no como <code>string</code>.</b> Si los pedís como texto, vas a recibir "1.234,50" tarde o temprano.</li>
</ul>

<div class="dato"><strong>Sobre el orden de los campos:</strong> el modelo los genera en el orden en que aparecen
en el esquema, y cada campo se condiciona a los anteriores. Si un campo depende de un análisis, poné primero
el campo de razonamiento y después la conclusión. Un esquema con <code>{ razon, categoria }</code> rinde mejor
que <code>{ categoria, razon }</code>, porque en el segundo la razón se escribe <i>después</i> de haber
decidido — o sea, se racionaliza.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="26" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LO QUE PUEDE SALIR MAL SI SOLO “PEDÍS” JSON</text>

  <rect x="24" y="38" width="632" height="98" rx="10" fill="#f87171" fill-opacity=".07" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="62" fill="currentColor" opacity=".8" font-size="11.5" font-family="monospace">¡Claro! Acá tenés el JSON que pediste:</text>
  <text x="44" y="80" fill="currentColor" opacity=".8" font-size="11.5" font-family="monospace">&#96;&#96;&#96;json</text>
  <text x="44" y="98" fill="currentColor" opacity=".8" font-size="11.5" font-family="monospace">{ "total": "1.234,50", "moneda": "pesos",</text>
  <text x="44" y="116" fill="currentColor" opacity=".8" font-size="11.5" font-family="monospace">  "nota": "campo que nadie pidió" </text>
  <text x="44" y="131" fill="#f87171" font-size="10.5">preámbulo · markdown · número como texto · enum inventado · campo extra · sin cerrar</text>

  <text x="24" y="172" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS CUATRO HERRAMIENTAS, DE MENOS A MÁS CONFIABLE</text>

  <rect x="24" y="184" width="632" height="44" rx="9" fill="currentColor" fill-opacity=".05" stroke="currentColor" stroke-opacity=".28" stroke-width="1.3"/>
  <text x="44" y="203" fill="currentColor" opacity=".85" font-size="12" font-weight="700">1 · Pedirlo bien en el prompt</text>
  <text x="330" y="203" fill="currentColor" opacity=".55" font-size="11">esquema + ejemplo</text>
  <text x="560" y="203" fill="#f87171" font-size="11" font-weight="700">sin garantía</text>
  <rect x="44" y="211" width="80" height="6" rx="3" fill="#f87171" fill-opacity=".5"/>

  <rect x="24" y="236" width="632" height="44" rx="9" fill="#fbbf24" fill-opacity=".08" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="44" y="255" fill="#fbbf24" font-size="12" font-weight="700">2 · Prefill del assistant</text>
  <text x="330" y="255" fill="currentColor" opacity=".55" font-size="11">arrancás vos con “{”</text>
  <text x="560" y="255" fill="#fbbf24" font-size="11" font-weight="700">gratis y efectivo</text>
  <rect x="44" y="263" width="230" height="6" rx="3" fill="#fbbf24" fill-opacity=".7"/>

  <rect x="24" y="288" width="632" height="44" rx="9" fill="#22d3ee" fill-opacity=".08" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="44" y="307" fill="#22d3ee" font-size="12" font-weight="700">3 · Tool calling forzado</text>
  <text x="330" y="307" fill="currentColor" opacity=".55" font-size="11">el esquema es la herramienta</text>
  <text x="560" y="307" fill="#22d3ee" font-size="11" font-weight="700">muy confiable</text>
  <rect x="44" y="315" width="400" height="6" rx="3" fill="#22d3ee" fill-opacity=".7"/>

  <rect x="24" y="340" width="632" height="44" rx="9" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="44" y="359" fill="#34d399" font-size="12" font-weight="700">4 · Structured output nativo</text>
  <text x="330" y="359" fill="currentColor" opacity=".55" font-size="11">restringe la generación</text>
  <text x="560" y="359" fill="#34d399" font-size="11" font-weight="700">garantizado</text>
  <rect x="44" y="367" width="560" height="6" rx="3" fill="#34d399" fill-opacity=".85"/>
</svg>`,
        pie: 'Y aun con el nivel 4: esquema válido no significa dato correcto. La validación de negocio sigue siendo tuya.',
      },

      entrevista: [
        { p: '¿Cómo garantizás que un LLM devuelva JSON válido?',
          r: 'Escalando garantías. Lo mínimo es mostrar el esquema y un ejemplo en el prompt, pero eso no garantiza nada. Después está el ' +
             '<b>prefill del assistant</b>, arrancando la respuesta con una llave, que elimina preámbulos y bloques markdown. ' +
             'Más arriba, <b>tool calling forzado</b>: declaro una herramienta cuyos parámetros son mi esquema y obligo al modelo a llamarla, ' +
             'con lo cual el proveedor valida la estructura; nunca ejecuto esa herramienta. Y si el proveedor lo soporta, <b>salida estructurada ' +
             'nativa</b> con JSON Schema, que restringe la generación token a token. <b>Igual valido siempre con Zod del lado del código</b>, ' +
             'porque estructura válida no implica contenido correcto.' },

        { p: '¿Qué es tool calling usado como formateador?',
          r: 'Es aprovechar el mecanismo de herramientas para obtener datos estructurados sin ninguna intención de ejecutar nada. ' +
             'Declaro una herramienta ficticia cuyo <code>input_schema</code> es exactamente la forma que necesito, fuerzo su uso con ' +
             '<code>tool_choice</code>, y leo los argumentos que el modelo generó. El proveedor ya los validó contra el esquema. ' +
             'Es más confiable que pedir JSON en texto libre y funciona en proveedores que no tienen salida estructurada nativa.' },

        { p: 'El JSON viene bien formado pero con datos incorrectos. ¿Qué hacés?',
          r: 'Separo los dos problemas, porque tienen soluciones distintas. La <b>estructura</b> se garantiza con los mecanismos del proveedor. ' +
             'El <b>contenido</b> es un problema de prompt, de contexto y de verificación: uso <code>enum</code> donde el conjunto sea cerrado, ' +
             'pongo <code>description</code> en cada campo con el formato esperado, y sobre todo <b>verifico por código lo verificable</b> — ' +
             'que el total sea la suma de los ítems, que el cliente exista en la base, que la fecha sea coherente. ' +
             'Cada verificación que muevo del modelo al código elimina una clase entera de errores.' },
      ],

      practica: `
<h4>El patrón completo, de punta a punta</h4>
<pre><code>import { z } from 'zod';

const EsquemaFactura = z.object({
  numero: z.string().min(1),
  fecha: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
  total: z.number().positive(),
  moneda: z.enum(['ARS', 'USD', 'EUR']),
  items: z.array(z.object({
    descripcion: z.string(),
    cantidad: z.number().int().positive(),
    precio: z.number().nonnegative(),
  })),
});

export async function extraerFactura(texto: string) {
  const r = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2048,
    temperature: 0,
    tools: [herramientaExtraccion],
    tool_choice: { type: 'tool', name: 'registrar_extraccion' },
    messages: [{ role: 'user', content: texto }],
  });

  if (r.stop_reason === 'max_tokens') {
    return { error: 'Respuesta truncada' };
  }

  const bloque = r.content.find(b =&gt; b.type === 'tool_use');
  if (!bloque) return { error: 'El modelo no usó la herramienta' };

  // 1 · validación de ESTRUCTURA
  const parsed = EsquemaFactura.safeParse(bloque.input);
  if (!parsed.success) return { error: 'Esquema inválido', detalle: parsed.error };

  // 2 · validación de NEGOCIO — la que de verdad te salva
  const suma = parsed.data.items.reduce((a, i) =&gt; a + i.cantidad * i.precio, 0);
  if (Math.abs(suma - parsed.data.total) &gt; 0.01) {
    return { error: 'El total no coincide con la suma de los ítems' };
  }

  return { data: parsed.data };
}</code></pre>

<div class="aviso"><strong>El paso 2 es el que separa un sistema serio de uno frágil.</strong> El modelo puede
devolver un JSON impecable con un total mal sumado, y ninguna validación de esquema lo va a detectar.
<b>Todo lo que se pueda comprobar con aritmética o con una consulta a la base, comprobalo.</b></div>

<h4>Diseño de esquema: antes y después</h4>
<pre><code>// ❌ Invita al error
{ categoria: string, monto: string, fecha: string }

// ✅ Cierra las puertas
{
  razon: string,                                    // primero el análisis…
  categoria: enum['ingreso','egreso','ajuste'],     // …después la conclusión
  monto: number,                                    // número, no texto
  fecha: string /* description: "ISO 8601 AAAA-MM-DD" */,
  encontrado: boolean,                              // salida explícita para "no está"
}</code></pre>
<p>Fijate el orden: <code>razon</code> antes que <code>categoria</code>. Como los campos se generan en orden y
cada uno se condiciona a los anteriores, así el modelo <b>razona y después concluye</b>. Al revés, concluye y
después inventa una justificación.</p>
`,

      errores: [
        { mito: 'Si le pido JSON en el prompt, me va a dar JSON.',
          realidad: 'La mayoría de las veces sí, y ese es justamente el problema: el fallo aparece con volumen, en producción, como un goteo. ' +
                    'Preámbulos, bloques markdown y campos extra son inevitables sin un mecanismo que los impida. ' +
                    '<b>Usá prefill como mínimo, y tool calling forzado o salida nativa si está disponible.</b>' },

        { mito: 'Si el esquema valida, el dato es correcto.',
          realidad: 'Son cosas distintas. Un total mal sumado, una fecha imposible o un ID inexistente pasan cualquier validación de esquema. ' +
                    '<b>La validación de negocio —aritmética, consultas a la base, coherencia entre campos— es tuya</b>, y es la que realmente evita ' +
                    'que se guarde basura.' },

        { mito: 'Cuanto más detallado el esquema, mejor.',
          realidad: 'El anidamiento profundo baja la fiabilidad de forma notoria. Más de dos o tres niveles y empiezan a aparecer estructuras ' +
                    'incompletas. <b>Conviene aplanar</b>, o partir la extracción en varias llamadas más simples y componer el resultado en tu código.' },

        { mito: 'El orden de los campos del esquema da igual.',
          realidad: 'No da igual: se generan en orden y cada campo se condiciona a los anteriores. Poner el campo de razonamiento <b>antes</b> de la ' +
                    'conclusión mejora la calidad de la conclusión. Al revés, el modelo decide primero y justifica después — que es exactamente ' +
                    'lo que no querés.' },
      ],

      glosario: [
        { t: 'Structured output', d: 'Mecanismo del proveedor que garantiza que la salida cumpla un JSON Schema, restringiendo la generación.' },
        { t: 'JSON Schema', d: 'Estándar para describir la forma de un objeto JSON: tipos, campos requeridos, valores permitidos.' },
        { t: 'tool_choice', d: 'Parámetro que fuerza al modelo a usar una herramienta determinada en vez de dejarlo elegir.' },
        { t: 'Zod', d: 'Librería de validación de esquemas en TypeScript. Valida en runtime y deriva los tipos estáticos.' },
        { t: 'Validación de negocio', d: 'Comprobaciones sobre el contenido más allá de la estructura: sumas, existencia de referencias, coherencia.' },
        { t: 'Enum', d: 'Restricción a un conjunto cerrado de valores. La forma más barata de evitar categorías inventadas.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l5',
      titulo: 'Streaming y latencia: que se sienta rápido',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el streaming no hace que la respuesta llegue antes.
Hace que <b>empiece</b> antes — y para el usuario eso es casi lo mismo.</div>

<p>Sin streaming, esperás 8 segundos mirando un spinner y después aparece todo junto. Con streaming, a los 600
milisegundos empieza a escribirse y podés ir leyendo. El tiempo total es el mismo. La experiencia no se parece
en nada.</p>

<h4>Las dos métricas que hay que separar</h4>
<table>
<tr><th>Métrica</th><th>Qué mide</th><th>De qué depende</th></tr>
<tr><td><b>TTFT</b><br><small>time to first token</small></td><td>Cuánto tarda en empezar</td><td>Tamaño del prompt, carga del proveedor, red</td></tr>
<tr><td><b>Velocidad</b><br><small>tokens por segundo</small></td><td>Cuán rápido escribe</td><td>Tamaño del modelo, hardware</td></tr>
</table>
<p>Un prompt gigante empeora el TTFT aunque la respuesta sea corta: hay que procesar toda la entrada antes de
poder emitir el primer token. Por eso el prompt caching mejora el TTFT tanto como el costo.</p>

<h4>Cuándo usar streaming</h4>
<ul>
<li><b>Sí:</b> siempre que un humano esté esperando y la respuesta sea de más de dos o tres oraciones.</li>
<li><b>No:</b> procesos en segundo plano, extracción de datos que tu código va a parsear, cualquier cosa donde nadie mira la pantalla.</li>
</ul>
<p>Para salidas estructuradas el streaming no aporta: necesitás el JSON completo antes de poder hacer nada
con él.</p>

<div class="aviso"><strong>Regla de oro de la latencia:</strong> si la operación puede superar los <b>30
segundos</b>, no va en el request del usuario. Va a una cola con un worker, y el resultado llega por
notificación o por polling. Un agente que encadena varias herramientas <b>siempre</b> cae en esta
categoría.</div>
`,

      tecnico: `
<h4>De dónde sale la latencia</h4>
<pre><code>latencia_total
  = red
  + cola del proveedor
  + prefill        (∝ tokens de entrada)
  + decode         (∝ tokens de salida ÷ velocidad)</code></pre>

<p>Consecuencias prácticas de esa fórmula:</p>
<ul>
<li><b>El prompt afecta el TTFT, no la velocidad.</b> Recortar contexto mejora el arranque.</li>
<li><b>La longitud de la salida domina el tiempo total.</b> Pedir respuestas más breves es la optimización más directa.</li>
<li><b>El prompt caching salta el prefill</b> de la parte cacheada: mejora costo y TTFT a la vez.</li>
<li><b>Los modelos de razonamiento generan muchos tokens ocultos</b> antes de responder: el TTFT visible se dispara.</li>
</ul>

<h4>Timeouts con streaming</h4>
<p>Un timeout global sobre una respuesta larga la mata justo cuando estaba por terminar. Lo correcto es medir
el <b>tiempo entre chunks</b>: si el flujo sigue llegando, la conexión está sana.</p>
<pre><code>const TIMEOUT_ENTRE_CHUNKS = 20_000;
let ultimo = Date.now();

for await (const chunk of stream) {
  if (Date.now() - ultimo &gt; TIMEOUT_ENTRE_CHUNKS) {
    throw new Error('El stream se cortó');
  }
  ultimo = Date.now();
  emitir(chunk);
}</code></pre>

<h4>Percepción de velocidad</h4>
<table>
<tr><th>Técnica</th><th>Efecto</th></tr>
<tr><td>Streaming</td><td>El más grande. TTFT en lugar de tiempo total</td></tr>
<tr><td>Mostrar pasos intermedios ("buscando…", "leyendo 4 documentos…")</td><td>Muy alto en agentes: convierte la espera en progreso</td></tr>
<tr><td>Respuesta optimista mientras se verifica</td><td>Alto, pero riesgoso si después hay que corregir</td></tr>
<tr><td>Cachear respuestas frecuentes</td><td>Total en los aciertos de caché</td></tr>
<tr><td>Modelo chico para la primera respuesta</td><td>Alto en chats: contestar rápido y refinar después</td></tr>
</table>

<div class="dato"><strong>Sobre la infraestructura:</strong> el streaming necesita que toda la cadena lo
soporte. Un proxy que bufferiza, una plataforma serverless con límite de tiempo de respuesta, o un CDN mal
configurado pueden acumular todo y entregarlo junto al final — anulando el beneficio sin que ningún error se
dispare. Es una falla silenciosa clásica: <b>hay que verificarlo en el entorno desplegado, no solo en local</b>.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="26" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">SIN STREAMING</text>

  <rect x="24" y="38" width="470" height="30" rx="6" fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-opacity=".25" stroke-width="1.2"/>
  <text x="259" y="58" text-anchor="middle" fill="currentColor" opacity=".5" font-size="11.5">spinner · el usuario no ve nada</text>
  <rect x="494" y="38" width="120" height="30" rx="6" fill="#f87171" fill-opacity=".25" stroke="#f87171" stroke-width="1.3"/>
  <text x="554" y="58" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">todo junto</text>
  <text x="24" y="86" fill="#f87171" font-size="11.5">percepción: 8 segundos de espera</text>

  <line x1="24" y1="106" x2="656" y2="106" stroke="currentColor" opacity=".18"/>

  <text x="24" y="132" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">CON STREAMING</text>

  <rect x="24" y="144" width="52" height="30" rx="6" fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-opacity=".25" stroke-width="1.2"/>
  <text x="50" y="164" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10">TTFT</text>

  <rect x="80"  y="144" width="66" height="30" rx="6" fill="#34d399" fill-opacity=".7"/>
  <rect x="150" y="144" width="66" height="30" rx="6" fill="#34d399" fill-opacity=".62"/>
  <rect x="220" y="144" width="66" height="30" rx="6" fill="#34d399" fill-opacity=".54"/>
  <rect x="290" y="144" width="66" height="30" rx="6" fill="#34d399" fill-opacity=".46"/>
  <rect x="360" y="144" width="66" height="30" rx="6" fill="#34d399" fill-opacity=".38"/>
  <rect x="430" y="144" width="66" height="30" rx="6" fill="#34d399" fill-opacity=".3"/>
  <rect x="500" y="144" width="114" height="30" rx="6" fill="#34d399" fill-opacity=".22"/>

  <text x="24" y="192" fill="#34d399" font-size="11.5">percepción: 0,6 segundos — el resto lo va leyendo mientras se escribe</text>
  <text x="24" y="210" fill="currentColor" opacity=".45" font-size="11">el tiempo TOTAL es exactamente el mismo</text>

  <line x1="24" y1="234" x2="656" y2="234" stroke="currentColor" opacity=".18"/>

  <rect x="24" y="250" width="200" height="72" rx="10" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="44" y="272" fill="#22d3ee" font-size="12" font-weight="700">TTFT</text>
  <text x="44" y="292" fill="currentColor" opacity=".7" font-size="11">cuánto tarda en EMPEZAR</text>
  <text x="44" y="310" fill="currentColor" opacity=".5" font-size="10.5">↓ recortando el prompt · caching</text>

  <rect x="240" y="250" width="200" height="72" rx="10" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="260" y="272" fill="#fbbf24" font-size="12" font-weight="700">TOKENS / SEGUNDO</text>
  <text x="260" y="292" fill="currentColor" opacity=".7" font-size="11">cuán rápido ESCRIBE</text>
  <text x="260" y="310" fill="currentColor" opacity=".5" font-size="10.5">↓ con un modelo más chico</text>

  <rect x="456" y="250" width="200" height="72" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="476" y="272" fill="#f87171" font-size="12" font-weight="700">&gt; 30 SEGUNDOS</text>
  <text x="476" y="292" fill="currentColor" opacity=".7" font-size="11">no va en el request</text>
  <text x="476" y="310" fill="currentColor" opacity=".5" font-size="10.5">va a una cola con worker</text>
</svg>`,
        pie: 'El streaming no acelera nada: mueve la percepción del tiempo total al tiempo de arranque.',
      },

      entrevista: [
        { p: '¿Qué es el TTFT y por qué importa más que la latencia total?',
          r: '<b>TTFT</b> es <i>time to first token</i>: cuánto tarda el modelo en emitir el primer token. Importa porque con streaming es lo que ' +
             'el usuario realmente percibe como velocidad — a partir de ahí ya está leyendo. Depende sobre todo del tamaño del prompt, porque hay ' +
             'que procesar toda la entrada antes de emitir nada. Por eso <b>recortar contexto y activar prompt caching mejoran el TTFT</b>, ' +
             'no solo el costo.' },

        { p: '¿Cuándo NO usarías streaming?',
          r: 'Cuando nadie está mirando: procesos en segundo plano, jobs de una cola, tareas programadas. Y sobre todo cuando la salida es ' +
             '<b>estructurada</b> y mi código la va a parsear: necesito el JSON completo antes de poder hacer nada, así que el streaming solo ' +
             'agrega complejidad sin ningún beneficio. El streaming es una optimización de <i>percepción</i>, y si no hay quien perciba, no aporta.' },

        { p: 'Una operación con IA tarda 45 segundos. ¿Cómo la manejás?',
          r: 'No va en el request del usuario. La mando a una <b>cola con un worker</b> —Inngest, SQS, lo que use el proyecto— y le devuelvo al ' +
             'usuario un identificador inmediato. El resultado llega por notificación, por polling o por realtime. Aparte de la experiencia, ' +
             'hay razones duras: los timeouts de las plataformas serverless suelen estar por debajo de eso, y una conexión larga que se corta ' +
             'te deja sin forma de recuperar el trabajo ya pagado. <b>Un agente que encadena varias herramientas cae siempre en esta categoría.</b>' },
      ],

      practica: `
<h4>Streaming en un Route Handler de Next.js</h4>
<pre><code>export async function POST(req: Request) {
  const { pregunta } = await req.json();

  const stream = await anthropic.messages.stream({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: pregunta }],
  });

  return new Response(
    new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        try {
          for await (const evento of stream) {
            if (evento.type === 'content_block_delta') {
              controller.enqueue(enc.encode(evento.delta.text));
            }
          }
        } catch (e) {
          controller.enqueue(enc.encode('\\n\\n[Se interrumpió la respuesta]'));
        } finally {
          controller.close();
        }
      },
    }),
    { headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',   // ← evita que un proxy bufferice
        'X-Accel-Buffering': 'no',                   // ← nginx
    }}
  );
}</code></pre>

<div class="aviso"><strong>Esos dos headers son el detalle que arruina más deploys.</strong> El streaming
funciona perfecto en <code>localhost</code> y en producción llega todo junto al final, porque un proxy o un CDN
lo acumuló. No tira ningún error: simplemente no hay streaming. <b>Verificalo siempre en el entorno
desplegado.</b></div>

<h4>Presupuesto de latencia de un RAG típico</h4>
<table>
<tr><th>Etapa</th><th>Tiempo típico</th><th>Cómo bajarlo</th></tr>
<tr><td>Embedding de la consulta</td><td>50-150 ms</td><td>Cachear consultas repetidas</td></tr>
<tr><td>Búsqueda vectorial</td><td>20-100 ms</td><td>Índice correcto, top_k más bajo</td></tr>
<tr><td>Re-ranking</td><td>100-400 ms</td><td>Solo sobre los primeros 20-30 candidatos</td></tr>
<tr><td>TTFT del modelo</td><td>400-1500 ms</td><td>Prompt caching, menos contexto</td></tr>
<tr><td>Generación completa</td><td>2-15 s</td><td>Respuestas más breves, modelo más rápido</td></tr>
</table>
<p>Con streaming, el usuario percibe la suma de las primeras cuatro filas — alrededor de un segundo. Sin
streaming, percibe todo, incluida la última.</p>
`,

      errores: [
        { mito: 'El streaming hace que el modelo responda más rápido.',
          realidad: 'El tiempo total es <b>idéntico</b>. Lo que cambia es cuándo empieza a ver algo el usuario. Es una optimización de percepción, ' +
                    'no de rendimiento — lo cual no la hace menos valiosa, pero conviene decirlo con precisión en una entrevista.' },

        { mito: 'Si anda el streaming en local, anda en producción.',
          realidad: 'Es una de las fallas silenciosas más comunes. Un proxy que bufferiza, un CDN mal configurado o límites de la plataforma ' +
                    'pueden acumular toda la respuesta y entregarla junta. <b>No se dispara ningún error</b>: simplemente desaparece el beneficio. ' +
                    'Hay que verificarlo en el entorno desplegado.' },

        { mito: 'Con un timeout global de 60 segundos alcanza.',
          realidad: 'Un timeout global mata respuestas largas legítimas justo antes de terminar. Con streaming lo correcto es medir el ' +
                    '<b>tiempo entre chunks</b>: mientras el flujo siga llegando, la conexión está sana, sin importar cuánto lleve en total.' },

        { mito: 'Para operaciones lentas alcanza con subir el timeout.',
          realidad: 'Las plataformas serverless tienen topes propios que no podés subir, y una conexión larga que se corta te deja sin forma de ' +
                    'recuperar trabajo que ya pagaste. <b>Por encima de 30 segundos, la respuesta correcta es una cola con worker</b>, no un timeout más alto.' },
      ],

      glosario: [
        { t: 'Streaming', d: 'Devolver la respuesta token a token mientras se genera, en vez de esperar a que esté completa.' },
        { t: 'TTFT', d: 'Time To First Token. Cuánto tarda en aparecer el primer token. Es la latencia percibida.' },
        { t: 'Tokens por segundo', d: 'Velocidad de generación una vez arrancada la respuesta.' },
        { t: 'SSE', d: 'Server-Sent Events. Protocolo habitual para enviar streaming desde el servidor al navegador.' },
        { t: 'Buffering', d: 'Acumulación de la respuesta por parte de un proxy o CDN, que anula el streaming sin generar errores.' },
        { t: 'Cola de trabajos', d: 'Sistema donde las tareas largas se procesan en segundo plano, fuera del request del usuario.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l6',
      titulo: 'Costos: cómo se factura y cómo no fundirte',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> pagás por token, de entrada y de salida, con
precios distintos. Parece poco por llamada. Multiplicado por usuarios y por días, deja de parecerlo.</div>

<h4>La cuenta básica</h4>
<pre><code>costo = (tokens_entrada  × precio_entrada)
      + (tokens_salida    × precio_salida)</code></pre>
<p>Los precios se publican por millón de tokens y <b>la salida cuesta entre 3 y 5 veces más</b> que la entrada.
Entre el modelo más chico y el más grande de una misma familia puede haber un factor de 10 a 30.</p>

<h4>Dónde se va la plata, en orden</h4>

<p><b>1 · El historial de conversación.</b> El campeón indiscutido. Como se reenvía completo en cada llamada,
una charla de veinte mensajes cuesta lo mismo que doscientas llamadas sueltas.</p>

<p><b>2 · No usar prompt caching.</b> Si tu system prompt y tus definiciones de herramientas suman 3.000
tokens fijos y hacés 10.000 llamadas por día, son 30 millones de tokens diarios que podrías estar pagando a
una fracción del precio.</p>

<p><b>3 · Recuperar de más.</b> Traer veinte fragmentos "por las dudas" cuando cinco alcanzan. Además de caro,
suele empeorar la respuesta.</p>

<p><b>4 · Usar un modelo grande donde no hace falta.</b> Clasificar, extraer o reformatear con el modelo más
caro es el error más silencioso de todos: funciona bien, así que nadie lo revisa.</p>

<p><b>5 · Reintentos sin control.</b> Un bucle de agente sin límite de iteraciones puede quemar un presupuesto
mensual en una tarde.</p>

<div class="aviso"><strong>Lo que hay que implementar desde la primera llamada, no después:</strong>
<b>registrar tokens y costo por request</b>, con el cliente y la funcionalidad asociados. Son cinco minutos al
principio. Sin eso no podés saber qué feature te cuesta plata, no podés cobrarle a un cliente por consumo, y
te enterás del problema cuando llega la factura.</div>
`,

      tecnico: `
<h4>Prompt caching</h4>
<p>Es la optimización de mejor relación beneficio/esfuerzo, sin discusión. El proveedor guarda el estado
computado de un <b>prefijo</b> del prompt; en llamadas posteriores con el mismo prefijo, salta el prefill y
cobra esos tokens con un descuento importante.</p>
<p>Requisitos que hay que respetar:</p>
<ul>
<li>El prefijo debe ser <b>idéntico byte a byte</b>.</li>
<li>Debe estar <b>al principio</b> del prompt.</li>
<li>Suele haber un <b>mínimo de tokens</b> para que valga la pena cachear.</li>
<li>La caché tiene un <b>TTL corto</b> —del orden de minutos— que se renueva con cada acierto.</li>
</ul>
<pre><code>// ✅ Estable primero → se cachea
[ system fijo ][ tools ][ contexto variable ][ mensaje del usuario ]

// ❌ Un timestamp adelante rompe la caché en TODAS las llamadas
[ "Hoy es 07/08/2026" ][ system fijo ][ ... ]</code></pre>

<h4>Cost tracking: el esquema mínimo</h4>
<pre><code>create table ai_requests (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null,
  feature       text not null,          -- 'lead_summary', 'chat', ...
  model         text not null,
  tokens_in     int  not null,
  tokens_out    int  not null,
  tokens_cached int  not null default 0,
  costo_usd     numeric(10,6) not null,
  latencia_ms   int,
  exito         boolean not null,
  created_at    timestamptz not null default now()
);</code></pre>
<p>Con esa tabla podés responder las preguntas que importan: cuánto gasta cada cliente, qué feature es la más
cara, si el caching está funcionando de verdad, y si el gasto por usuario sube o baja tras un cambio.</p>

<h4>Control de presupuesto</h4>
<pre><code>async function checkBudget(tenantId: string) {
  const { data } = await supabase
    .from('ai_usage_mensual')
    .select('costo_usd')
    .eq('tenant_id', tenantId)
    .eq('periodo', periodoActual())
    .single();

  const gastado = data?.costo_usd ?? 0;
  const tope = await topeDelPlan(tenantId);

  if (gastado &gt;= tope)       return { ok: false, motivo: 'limite_alcanzado' };
  if (gastado &gt;= tope * 0.8) avisarAlCliente(tenantId, gastado, tope);
  return { ok: true, restante: tope - gastado };
}</code></pre>
<p>Se chequea <b>antes</b> de la llamada, no después. Y conviene avisar al 80% en lugar de cortar de golpe al
100%: un corte sin aviso se percibe como una caída del servicio.</p>

<div class="dato"><strong>Cascada de modelos:</strong> un patrón de ahorro muy efectivo es resolver con un
modelo chico y escalar al grande solo cuando hace falta —cuando el chico declara baja confianza, cuando la
validación falla, o cuando la entrada supera cierta complejidad—. Si el 80% de los casos los resuelve el
modelo barato, el ahorro es enorme y la calidad agregada casi no se mueve.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="26" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    DÓNDE SE VA LA PLATA  ·  ordenado por impacto real</text>

  <rect x="24" y="38" width="520" height="34" rx="7" fill="#f87171" fill-opacity=".7"/>
  <text x="40" y="60" fill="#3b0a0a" font-size="12" font-weight="700">1 · Historial reenviado completo en cada llamada</text>
  <text x="556" y="60" fill="#f87171" font-size="12" font-weight="700">altísimo</text>

  <rect x="24" y="80" width="410" height="34" rx="7" fill="#fbbf24" fill-opacity=".65"/>
  <text x="40" y="102" fill="#3b2a05" font-size="12" font-weight="700">2 · No usar prompt caching</text>
  <text x="446" y="102" fill="#fbbf24" font-size="12" font-weight="700">muy alto</text>

  <rect x="24" y="122" width="300" height="34" rx="7" fill="#fbbf24" fill-opacity=".45"/>
  <text x="40" y="144" fill="currentColor" font-size="12" font-weight="700">3 · Recuperar 20 fragmentos donde 5 alcanzan</text>
  <text x="336" y="144" fill="#fbbf24" font-size="12" font-weight="700">alto</text>

  <rect x="24" y="164" width="250" height="34" rx="7" fill="#22d3ee" fill-opacity=".4"/>
  <text x="40" y="186" fill="currentColor" font-size="12" font-weight="700">4 · Modelo grande donde no hace falta</text>
  <text x="286" y="186" fill="#22d3ee" font-size="12" font-weight="700">alto y silencioso</text>

  <rect x="24" y="206" width="150" height="34" rx="7" fill="#7c5cff" fill-opacity=".4"/>
  <text x="40" y="228" fill="currentColor" font-size="12" font-weight="700">5 · Bucles sin límite</text>
  <text x="186" y="228" fill="#7c5cff" font-size="12" font-weight="700">catastrófico si pasa</text>

  <line x1="24" y1="260" x2="656" y2="260" stroke="currentColor" opacity=".18"/>

  <text x="24" y="286" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    PROMPT CACHING — el orden del prompt lo decide todo</text>

  <rect x="24" y="298" width="300" height="86" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.4"/>
  <text x="42" y="320" fill="#34d399" font-size="12" font-weight="700">✓ SE CACHEA</text>
  <rect x="42" y="330" width="90" height="20" rx="4" fill="#34d399" fill-opacity=".5"/>
  <text x="87" y="344" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">system fijo</text>
  <rect x="136" y="330" width="60" height="20" rx="4" fill="#34d399" fill-opacity=".4"/>
  <text x="166" y="344" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">tools</text>
  <rect x="200" y="330" width="60" height="20" rx="4" fill="currentColor" fill-opacity=".12"/>
  <text x="230" y="344" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">RAG</text>
  <rect x="264" y="330" width="46" height="20" rx="4" fill="currentColor" fill-opacity=".12"/>
  <text x="287" y="344" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">user</text>
  <text x="42" y="370" fill="currentColor" opacity=".6" font-size="10.5">prefijo estable e idéntico byte a byte</text>

  <rect x="356" y="298" width="300" height="86" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.4"/>
  <text x="374" y="320" fill="#f87171" font-size="12" font-weight="700">✗ NO SE CACHEA NUNCA</text>
  <rect x="374" y="330" width="80" height="20" rx="4" fill="#f87171" fill-opacity=".5"/>
  <text x="414" y="344" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">fecha/hora</text>
  <rect x="458" y="330" width="90" height="20" rx="4" fill="currentColor" fill-opacity=".12"/>
  <text x="503" y="344" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">system fijo</text>
  <rect x="552" y="330" width="50" height="20" rx="4" fill="currentColor" fill-opacity=".12"/>
  <text x="577" y="344" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">tools</text>
  <text x="374" y="370" fill="#f87171" opacity=".9" font-size="10.5">un token variable adelante y perdés todo el descuento</text>
</svg>`,
        pie: 'Meter la fecha o el nombre del usuario al principio del system prompt es el error de costos más silencioso que existe.',
      },

      entrevista: [
        { p: '¿Cómo controlás los costos de un sistema con IA?',
          r: 'En dos planos. <b>Medir</b>: registro tokens de entrada, salida y cacheados, más el costo en dólares, por request, con el cliente ' +
             'y la funcionalidad asociados. Sin eso no puedo optimizar nada porque no sé dónde se va la plata. <b>Controlar</b>: tope de gasto por ' +
             'cliente verificado <i>antes</i> de cada llamada, con aviso al 80%. Y después las optimizaciones concretas, por impacto: ' +
             'prompt caching sobre la parte fija, resumir el historial en chats largos, bajar el top_k del RAG, y usar el modelo más chico que ' +
             'pase las evals para cada tarea.' },

        { p: '¿Qué es prompt caching y qué condiciones tiene?',
          r: 'Es reutilizar el procesamiento del prefijo estable de un prompt entre llamadas. El proveedor guarda el estado computado y en llamadas ' +
             'posteriores salta el prefill, con lo cual mejora <b>costo y TTFT a la vez</b>. Las condiciones son estrictas: el prefijo tiene que estar ' +
             '<b>al principio</b> y ser <b>idéntico byte a byte</b>, suele haber un mínimo de tokens, y la caché tiene un TTL corto que se renueva ' +
             'con cada acierto. El error clásico es poner un timestamp o el nombre del usuario adelante del system prompt: rompe la caché en todas ' +
             'las llamadas y no genera ningún error visible.' },

        { p: 'El costo por usuario de tu producto se duplicó. ¿Cómo lo investigás?',
          r: 'Con la tabla de <i>requests</i> puedo agrupar por feature, por modelo y por fecha, y ver dónde saltó. Las causas que revisaría, en orden: ' +
             '<b>historial más largo</b> —conversaciones que crecieron y no se están resumiendo—; <b>tasa de acierto de caché en baja</b>, ' +
             'que suele indicar que alguien metió algo variable al principio del prompt; <b>más fragmentos recuperados</b> por un cambio en el top_k; ' +
             'y <b>reintentos</b>, que duplican silenciosamente el costo de los casos que fallan. Si no tengo esa tabla, el primer paso es agregarla, ' +
             'porque sin datos es adivinar.' },

        { p: '¿Qué es una cascada de modelos?',
          r: 'Resolver primero con un modelo chico y barato, y escalar al grande solo cuando hace falta: cuando el chico declara baja confianza, ' +
             'cuando la validación de la salida falla, o cuando la entrada supera cierta complejidad. Si el 80% de los casos los resuelve el modelo ' +
             'barato, el ahorro es grande y la calidad agregada casi no se mueve. <b>La condición para hacerlo bien es tener evals</b>, ' +
             'porque necesitás medir cuánto perdés en calidad y con qué frecuencia se escala de verdad.' },
      ],

      practica: `
<h4>Optimizaciones ordenadas por relación beneficio/esfuerzo</h4>
<table>
<tr><th>#</th><th>Acción</th><th>Ahorro</th><th>Esfuerzo</th></tr>
<tr><td>1</td><td>Prompt caching sobre system y tools</td><td>Hasta 90% de esos tokens</td><td>Bajo</td></tr>
<tr><td>2</td><td>Bajar top_k del RAG de 20 a 5</td><td>60-75% del contexto</td><td>Bajo</td></tr>
<tr><td>3</td><td>Resumir el historial pasados N mensajes</td><td>50-80% en chats</td><td>Medio</td></tr>
<tr><td>4</td><td>Modelo chico donde las evals lo permitan</td><td>10-20 veces</td><td>Medio</td></tr>
<tr><td>5</td><td>Cachear respuestas a preguntas frecuentes</td><td>100% en los aciertos</td><td>Medio</td></tr>
<tr><td>6</td><td>Prompts fijos en inglés</td><td>20-40% de esa porción</td><td>Bajo</td></tr>
</table>

<div class="aviso"><strong>La número 2 es la más subestimada.</strong> Recuperar menos fragmentos pero mejor
elegidos <b>sube</b> la calidad además de bajar el costo, por el efecto <i>lost in the middle</i>. Es de las
pocas optimizaciones donde no hay que negociar nada a cambio.</div>

<h4>Registrar el costo en un solo lugar</h4>
<pre><code>const PRECIOS = {
  'claude-haiku-4-5': { in: 1.00, out: 5.00, cached: 0.10 },   // USD por millón
  // ...
};

export async function callAnthropic(supabase, opciones) {
  const t0 = Date.now();
  const r = await anthropic.messages.create(opciones);

  const p = PRECIOS[opciones.model];
  const u = r.usage;
  const costo =
      (u.input_tokens          / 1e6) * p.in
    + (u.output_tokens         / 1e6) * p.out
    + (u.cache_read_input_tokens ?? 0) / 1e6 * p.cached;

  await supabase.from('ai_requests').insert({
    tenant_id: opciones.tenantId,
    feature: opciones.feature,
    model: opciones.model,
    tokens_in: u.input_tokens,
    tokens_out: u.output_tokens,
    tokens_cached: u.cache_read_input_tokens ?? 0,
    costo_usd: costo,
    latencia_ms: Date.now() - t0,
    exito: true,
  });

  return r;
}</code></pre>
<p>La clave del patrón es que <b>ninguna parte de la aplicación llama a la API directamente</b>. Todas pasan por
este helper. Así el registro no se puede olvidar, y agregar un modelo nuevo es tocar un solo archivo.</p>
`,

      errores: [
        { mito: 'Los costos los vemos cuando el producto crezca.',
          realidad: 'Para cuando crece, ya no sabés qué feature te cuesta plata ni cuánto consume cada cliente, y reconstruirlo hacia atrás es ' +
                    'imposible. <b>La instrumentación son cinco minutos al principio</b> y una semana de arqueología después. Va desde la primera llamada.' },

        { mito: 'El modelo más caro es el más seguro.',
          realidad: 'Es el más seguro <i>si no medís</i>. Para extracción, clasificación o reformateo, un modelo chico suele empatar a una fracción ' +
                    'del costo y con menos latencia. <b>Sin evals no podés bajar de modelo con confianza</b> — que es otra razón para tenerlas.' },

        { mito: 'Activé prompt caching, así que ya está.',
          realidad: 'Hay que <b>verificar la tasa de acierto</b>. Si alguien mete un timestamp, un ID de sesión o el nombre del usuario al principio ' +
                    'del prompt, la caché no se usa nunca y no aparece ningún error. Por eso el campo de tokens cacheados va en la tabla de uso: ' +
                    'si es cero, el caching está roto.' },

        { mito: 'Un bucle de agente se detiene solo.',
          realidad: 'No siempre. Un agente puede quedarse llamando herramientas en círculos y quemar un presupuesto mensual en una tarde. ' +
                    '<b>Límite duro de iteraciones, tope de tokens por sesión y corte por presupuesto</b> no son opcionales: son requisitos de producción.' },
      ],

      glosario: [
        { t: 'Prompt caching', d: 'Reutilizar el procesamiento del prefijo estable del prompt, con descuento importante sobre esos tokens.' },
        { t: 'Cache hit rate', d: 'Proporción de llamadas que aprovechan la caché. Si es cero, algo variable se coló al principio del prompt.' },
        { t: 'TTL de caché', d: 'Tiempo que sobrevive una entrada de caché sin usarse. Suele ser de minutos y se renueva con cada acierto.' },
        { t: 'Cost tracking', d: 'Registrar tokens y costo por request, atribuidos a cliente y funcionalidad.' },
        { t: 'Budget cap', d: 'Tope de gasto por cliente y período, verificado antes de cada llamada.' },
        { t: 'Cascada de modelos', d: 'Resolver con un modelo barato y escalar al caro solo cuando es necesario.' },
        { t: 'Caché semántica', d: 'Reutilizar respuestas de preguntas suficientemente similares, medidas por embedding.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l7',
      titulo: 'Elegir modelo: la matriz capacidad, costo y latencia',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> elegir modelo es como elegir vehículo. Nadie va a
comprar el pan en un camión, y nadie muda una casa en una moto. <b>La pregunta no es cuál es el mejor: es cuál
es el adecuado para este viaje.</b></div>

<h4>Los tres ejes, que siempre están en tensión</h4>
<ul>
<li><b>Capacidad</b> — qué tan bien resuelve tareas difíciles.</li>
<li><b>Costo</b> — cuánto sale por millón de tokens.</li>
<li><b>Latencia</b> — cuánto tarda.</li>
</ul>
<p>En general se mueven juntos: más capacidad, más caro y más lento. La habilidad está en <b>no pagar
capacidad que la tarea no necesita</b>.</p>

<h4>Familias, en términos generales</h4>
<table>
<tr><th>Nivel</th><th>Para qué</th><th>Costo relativo</th></tr>
<tr><td><b>Chico y rápido</b></td><td>Clasificar, extraer, reformatear, resumir cosas breves, filtros previos</td><td>1×</td></tr>
<tr><td><b>Intermedio</b></td><td>El caballito de batalla: RAG, redacción, análisis, la mayoría de features</td><td>3-5×</td></tr>
<tr><td><b>Grande</b></td><td>Razonamiento complejo, código difícil, análisis con matices</td><td>10-30×</td></tr>
<tr><td><b>De razonamiento</b></td><td>Matemática, lógica, depuración: problemas de varios pasos verificables</td><td>alto, más latencia</td></tr>
</table>

<h4>El método que conviene seguir</h4>
<ol>
<li><b>Armá 20-50 casos de prueba</b> con la salida esperada. Antes que nada.</li>
<li><b>Empezá por el modelo más chico</b> que te parezca plausible.</li>
<li><b>Medí.</b> ¿Pasa el umbral de calidad que necesitás?</li>
<li>Si sí, <b>quedate ahí</b>. Si no, subí un escalón y volvé a medir.</li>
</ol>
<p>La mayoría hace lo contrario: arranca con el más grande, funciona, y nunca vuelve a revisarlo. Así se
termina pagando diez veces de más por una tarea que resolvía un modelo chico.</p>

<div class="aviso"><strong>Lo que hay que fijar en producción:</strong> la <b>versión exacta</b> del modelo,
nunca un alias tipo "latest". Si no, el proveedor actualiza el alias un martes y tu sistema cambia de
comportamiento sin que hayas hecho un solo deploy — con prompts afinados para otra versión.</div>
`,

      tecnico: `
<h4>Criterios más allá del benchmark</h4>
<table>
<tr><th>Criterio</th><th>Por qué importa</th></tr>
<tr><td><b>Ventana de contexto</b></td><td>Define cuánto RAG e historial podés meter</td></tr>
<tr><td><b>Calidad de tool calling</b></td><td>Varía mucho entre modelos y es crítica en agentes</td></tr>
<tr><td><b>Salida estructurada</b></td><td>Si hay garantía nativa de esquema o hay que emularla</td></tr>
<tr><td><b>Multimodal</b></td><td>Necesario para documentos escaneados, capturas, fotos</td></tr>
<tr><td><b>Rate limits de tu cuenta</b></td><td>Un modelo excelente con un límite bajo no te sirve a escala</td></tr>
<tr><td><b>Residencia de datos</b></td><td>Puede ser un requisito legal duro del cliente</td></tr>
<tr><td><b>Estabilidad de versiones</b></td><td>Con qué frecuencia deprecan y cuánto aviso dan</td></tr>
<tr><td><b>Prompt caching</b></td><td>Cambia la economía completa de un sistema con prompts largos</td></tr>
</table>

<div class="dato"><strong>Sobre los benchmarks públicos:</strong> sirven para descartar, no para elegir.
Miden tareas genéricas —exámenes, problemas de programación competitiva— que casi nunca se parecen a la tuya.
<b>Un modelo que sale segundo en un ranking puede ser el mejor para tu caso concreto.</b> La única medición que
importa es tu propio conjunto de evaluación con tus datos reales.</div>

<h4>Multi-proveedor: cuándo y cómo</h4>
<p><b>A favor:</b> resiliencia ante caídas, poder de negociación, poder elegir el mejor modelo por tarea.
<b>En contra:</b> cada proveedor tiene su formato de mensajes, su tokenizador y su comportamiento; los prompts
no se transfieren sin re-evaluar.</p>
<p>El punto medio razonable: una <b>capa de abstracción propia y delgada</b> —tu propia función
<code>llamarModelo()</code>— que normalice mensajes, errores y registro de uso. No un framework pesado: una
interfaz mínima que te deje cambiar de proveedor sin tocar la aplicación.</p>

<h4>API o modelo propio</h4>
<table>
<tr><th></th><th>API de proveedor</th><th>Self-hosted (Llama, Mistral…)</th></tr>
<tr><td><b>Costo inicial</b></td><td>Nulo</td><td>Alto: GPUs e ingeniería</td></tr>
<tr><td><b>Costo marginal</b></td><td>Por token</td><td>Fijo: pagás la GPU esté o no en uso</td></tr>
<tr><td><b>Punto de equilibrio</b></td><td colspan="2">Volumen muy alto y sostenido. Por debajo, la API gana casi siempre</td></tr>
<tr><td><b>Privacidad</b></td><td>Los datos salen de tu infraestructura</td><td>Control total</td></tr>
<tr><td><b>Capacidad</b></td><td>Modelos de frontera</td><td>Modelos abiertos: buenos, pero un escalón por debajo</td></tr>
<tr><td><b>Operación</b></td><td>Nada</td><td>Servís, escalás y monitoreás vos</td></tr>
</table>
<p>Self-hosting se justifica por <b>requisitos de privacidad o soberanía de datos</b>, o por volumen realmente
alto y estable. Como estrategia de ahorro para un producto que recién arranca, casi nunca cierra.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="26" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CAPACIDAD vs COSTO — la habilidad es no pagar lo que la tarea no necesita</text>

  <line x1="70" y1="240" x2="640" y2="240" stroke="currentColor" opacity=".28" stroke-width="1.3"/>
  <line x1="70" y1="240" x2="70" y2="52" stroke="currentColor" opacity=".28" stroke-width="1.3"/>
  <text x="350" y="264" text-anchor="middle" fill="currentColor" opacity=".5" font-size="11">costo por millón de tokens  →</text>
  <text x="30" y="150" fill="currentColor" opacity=".5" font-size="11" transform="rotate(-90 30 150)">capacidad  →</text>

  <circle cx="140" cy="212" r="15" fill="#34d399" fill-opacity=".55" stroke="#34d399" stroke-width="1.5"/>
  <text x="140" y="192" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">chico</text>
  <text x="140" y="290" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">clasificar</text>
  <text x="140" y="304" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">extraer</text>
  <text x="140" y="318" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">reformatear</text>

  <circle cx="300" cy="150" r="21" fill="#22d3ee" fill-opacity=".55" stroke="#22d3ee" stroke-width="1.5"/>
  <text x="300" y="118" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">intermedio</text>
  <text x="300" y="290" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">RAG</text>
  <text x="300" y="304" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">redacción</text>
  <text x="300" y="318" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">la mayoría</text>

  <circle cx="480" cy="100" r="26" fill="#7c5cff" fill-opacity=".5" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="480" y="62" text-anchor="middle" fill="#7c5cff" font-size="11.5" font-weight="700">grande</text>
  <text x="480" y="290" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">análisis con matices</text>
  <text x="480" y="304" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">código difícil</text>

  <circle cx="600" cy="86" r="22" fill="#fbbf24" fill-opacity=".45" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="600" y="52" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">razonamiento</text>
  <text x="600" y="290" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">matemática</text>
  <text x="600" y="304" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">lógica · debug</text>

  <rect x="24" y="336" width="632" height="52" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.4" stroke-dasharray="5 4"/>
  <text x="340" y="358" text-anchor="middle" fill="#34d399" font-size="12.5" font-weight="700">
    EL MÉTODO: empezá por el más chico y subí solo si las evals te obligan</text>
  <text x="340" y="378" text-anchor="middle" fill="currentColor" opacity=".6" font-size="11">
    lo habitual es al revés — arrancar con el grande, ver que funciona, y no revisarlo nunca más</text>
</svg>`,
        pie: 'Las posiciones son ilustrativas: la relación capacidad/costo cambia con cada generación de modelos.',
      },

      entrevista: [
        { p: '¿Cómo elegís qué modelo usar para una funcionalidad?',
          r: 'Con evals, no con intuición ni con rankings. Armo entre 20 y 50 casos representativos con la salida esperada, ' +
             '<b>empiezo por el modelo más chico que me parezca plausible</b> y mido. Si pasa el umbral de calidad que necesito, me quedo ahí. ' +
             'Si no, subo un escalón y vuelvo a medir. Es lo contrario de lo habitual, que es arrancar con el más grande porque "es el mejor" y ' +
             'no revisarlo nunca. Además de calidad, considero ventana de contexto, calidad del tool calling si hay agentes, y rate limits reales ' +
             'de la cuenta.' },

        { p: '¿Usarías un modelo self-hosted?',
          r: 'Solo con una razón concreta. Las dos que lo justifican son <b>requisitos de privacidad o soberanía de datos</b> —un cliente que no ' +
             'acepta que la información salga de su infraestructura— o <b>volumen muy alto y sostenido</b>, donde el costo fijo de las GPUs queda por ' +
             'debajo del costo marginal por token. Fuera de eso, la API gana: no pagás GPU ociosa, tenés acceso a modelos de frontera y no operás ' +
             'infraestructura de inferencia, que es un trabajo en sí mismo. <b>Como estrategia de ahorro para un producto que recién arranca, casi nunca cierra.</b>' },

        { p: '¿Qué opinás de los benchmarks públicos?',
          r: 'Sirven para <b>descartar, no para elegir</b>. Miden tareas genéricas —exámenes, programación competitiva— que rara vez se parecen a ' +
             'la tarea real, y además hay riesgo de contaminación de los datos de prueba. Un modelo que sale segundo en un ranking puede ser claramente ' +
             'el mejor para mi caso. Los uso para armar una lista corta de candidatos y después decido con mi propio conjunto de evaluación, ' +
             'con datos reales del producto.' },

        { p: '¿Cómo manejás la dependencia de un proveedor?',
          r: 'Con una <b>capa de abstracción propia y delgada</b>: una única función por la que pasan todas las llamadas, que normaliza el formato ' +
             'de mensajes, el manejo de errores y el registro de uso. No un framework pesado, que agrega su propio acoplamiento. Eso me permite ' +
             'cambiar de proveedor tocando un archivo. Lo que <b>no</b> es transferible son los prompts: cada modelo responde distinto, así que un ' +
             'cambio de proveedor siempre implica volver a correr las evals. Por eso la abstracción resuelve el problema técnico, pero el conjunto ' +
             'de evaluación es lo que realmente te da la libertad de moverte.' },
      ],

      practica: `
<h4>Matriz de decisión para tus proyectos</h4>
<table>
<tr><th>Tarea</th><th>Modelo</th><th>Por qué</th></tr>
<tr><td>Clasificar el sentimiento de un comentario</td><td>Chico</td><td>Tarea acotada, alto volumen, no necesita razonar</td></tr>
<tr><td>Extraer campos de una factura</td><td>Chico multimodal</td><td>Es copiar bien, no interpretar</td></tr>
<tr><td>Responder preguntas sobre documentos (RAG)</td><td>Intermedio</td><td>Necesita comprensión y buen seguimiento de instrucciones</td></tr>
<tr><td>Redactar una propuesta comercial</td><td>Intermedio o grande</td><td>La calidad de escritura sí se nota</td></tr>
<tr><td>Agente que encadena herramientas</td><td>Intermedio o grande</td><td>El tool calling de los modelos chicos es más flojo</td></tr>
<tr><td>Depurar un bug en una consulta SQL compleja</td><td>De razonamiento</td><td>Varios pasos con una respuesta verificable</td></tr>
<tr><td>Resumir 10.000 tickets por noche</td><td>Chico, en lote</td><td>Volumen alto sin humano esperando</td></tr>
</table>

<h4>Una capa de abstracción que no estorba</h4>
<pre><code>type Peticion = {
  tarea: 'clasificar' | 'extraer' | 'responder' | 'redactar' | 'razonar';
  tenantId: string;
  mensajes: Mensaje[];
  esquema?: JSONSchema;
};

// La tarea decide el modelo — no cada punto de llamada
const MODELO_POR_TAREA = {
  clasificar: 'claude-haiku-4-5',
  extraer:    'claude-haiku-4-5',
  responder:  'claude-sonnet-5',
  redactar:   'claude-sonnet-5',
  razonar:    'claude-opus-5',
};

export async function llamarModelo(p: Peticion) {
  const modelo = MODELO_POR_TAREA[p.tarea];
  // ...cost tracking, reintentos, validación, todo en un solo lugar
}</code></pre>

<div class="aviso"><strong>La ventaja real de este patrón:</strong> el modelo se elige <b>por tarea, en un solo
archivo</b>. Cuando sale un modelo nuevo o querés probar si uno más barato alcanza, cambiás una línea y corrés
las evals. Si en cambio el nombre del modelo está desperdigado en veinte llamadas, esa prueba nunca se hace —
y ahí es donde se queda el dinero.</div>
`,

      errores: [
        { mito: 'Uso el mejor modelo y me olvido del tema.',
          realidad: 'Es la fuente de sobrecosto más común y más silenciosa: funciona bien, así que nadie lo revisa. Para clasificar, extraer o ' +
                    'reformatear, un modelo chico suele empatar a una fracción del precio y con menos latencia. <b>Sin evals no te vas a animar a ' +
                    'bajar de modelo</b>, y ahí es donde se queda la plata.' },

        { mito: 'El modelo que gana en los benchmarks es el que me conviene.',
          realidad: 'Los benchmarks miden tareas genéricas que rara vez se parecen a la tuya, y hay riesgo de contaminación de los datos de prueba. ' +
                    'Sirven para armar una lista corta. <b>La decisión se toma con tu propio conjunto de evaluación</b> y datos reales del producto.' },

        { mito: 'Self-hosting es más barato.',
          realidad: 'Solo con volumen muy alto y sostenido. Pagás la GPU esté o no en uso, más el trabajo de servir, escalar y monitorear — ' +
                    'que es un puesto de trabajo, no una tarde. <b>La razón sólida para self-hostear es privacidad o soberanía de datos</b>, ' +
                    'no ahorro.' },

        { mito: 'Puedo cambiar de proveedor sin tocar nada.',
          realidad: 'La <b>llamada</b> se abstrae fácil; los <b>prompts</b> no se transfieren. Cada modelo responde distinto a las mismas ' +
                    'instrucciones, y los tokenizadores difieren, así que tus cálculos de presupuesto de contexto también cambian. ' +
                    'Un cambio de proveedor siempre exige volver a correr las evals.' },
      ],

      glosario: [
        { t: 'Benchmark', d: 'Prueba estandarizada de capacidad. Útil para descartar candidatos, no para elegir el definitivo.' },
        { t: 'Contaminación de datos', d: 'Cuando los casos de un benchmark aparecieron en el entrenamiento, inflando el resultado.' },
        { t: 'Self-hosting', d: 'Servir un modelo en infraestructura propia, con herramientas como vLLM u Ollama.' },
        { t: 'Modelo abierto', d: 'Modelo con pesos descargables (Llama, Mistral, Qwen). No siempre con licencia libre de restricciones.' },
        { t: 'Capa de abstracción', d: 'Interfaz propia y delgada que aísla la aplicación del SDK de cada proveedor.' },
        { t: 'Rate limit', d: 'Tope de peticiones o tokens por minuto de tu cuenta. Puede ser el verdadero límite a escala, más que el modelo.' },
        { t: 'Residencia de datos', d: 'En qué jurisdicción se procesan y almacenan los datos. Suele ser un requisito legal del cliente.' },
        { t: 'Deprecación', d: 'Retiro de una versión de modelo por parte del proveedor. Fijar versiones obliga a planificar la migración.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es la función del system prompt?',
      opciones: [
        'Contener instrucciones persistentes que aplican a toda la conversación y que el usuario no ve',
        'Guardar el historial de la conversación',
        'Definir qué modelo se va a usar',
        'Es un mensaje más del usuario, sin diferencia real',
      ],
      correcta: 0,
      porQue: 'Define rol, reglas, formato y tono. Es donde va todo lo estable, y por eso además es la parte ideal para cachear.',
      porQueNo: {
        1: 'El historial va en el array de messages, alternando user y assistant.',
        2: 'El modelo se elige con el parámetro model.',
        3: 'Los roles son un artefacto del entrenamiento SFT: el modelo los interpreta distinto. Y mezclarlos abre la puerta a prompt injection.',
      },
    },
    {
      p: 'Querés forzar que la respuesta arranque con "{". ¿Qué técnica usás?',
      opciones: [
        'Prefill: agregar un mensaje de rol assistant que ya contenga "{"',
        'Poner "empezá con llave" en el system prompt',
        'Bajar la temperatura a 0',
        'Usar una stop sequence',
      ],
      correcta: 0,
      porQue: 'Aprovecha que la generación es autorregresiva: el modelo continúa desde donde vos lo dejaste, así que no puede escribir un preámbulo. Ojo: el prefill no viene en la respuesta, hay que reponerlo antes de parsear.',
      porQueNo: {
        1: 'Ayuda pero no garantiza. Un porcentaje de respuestas va a traer preámbulo igual.',
        2: 'Reduce variabilidad pero no controla cómo arranca la respuesta.',
        3: 'Las stop sequences cortan la generación, no controlan su inicio.',
      },
    },
    {
      p: '¿Qué hay que verificar SIEMPRE antes de parsear la respuesta como JSON?',
      opciones: [
        'El stop_reason: si fue max_tokens, la respuesta está truncada',
        'Que la temperatura haya sido 0',
        'Que el modelo sea el más grande disponible',
        'Que el prompt no supere los 1.000 tokens',
      ],
      correcta: 0,
      porQue: 'Es el error más confuso de diagnosticar: parece que el modelo devolvió basura, cuando en realidad devolvió una respuesta correcta a la que le faltaba el final por un max_tokens mal configurado.',
      porQueNo: {
        1: 'Es buena práctica, pero no explica un JSON incompleto.',
        2: 'El tamaño del modelo no tiene relación con que la respuesta se haya truncado.',
        3: 'El límite relevante es el de salida, no el del prompt.',
      },
    },
    {
      p: '¿Cuál de estos prompts es mejor?',
      opciones: [
        '"Resumí en máximo 3 oraciones, sin superar 50 palabras"',
        '"Hacé un resumen conciso"',
        '"No escribas demasiado"',
        '"Resumí bien, que se entienda"',
      ],
      correcta: 0,
      porQue: 'Es la única instrucción verificable por código. Si no podés comprobar automáticamente si el modelo cumplió, la instrucción está mal escrita.',
      porQueNo: {
        1: '"Conciso" es cualitativo: significa cosas distintas en cada llamada.',
        2: 'Es una prohibición, y deja infinitas opciones abiertas. Las instrucciones positivas funcionan mejor.',
        3: 'No define ni longitud ni criterio. El modelo va a improvisar, distinto cada vez.',
      },
    },
    {
      p: 'Para few-shot, ¿qué ejemplos conviene elegir?',
      opciones: [
        'Casos límite y ambiguos, balanceados por clase',
        'Los casos más frecuentes y típicos',
        'La mayor cantidad posible, mínimo 20',
        'Ejemplos generados por el propio modelo',
      ],
      correcta: 0,
      porQue: 'El ejemplo ambiguo es el que enseña la regla de desempate. Además hay que balancear por clase y variar cuál queda último, porque el modelo se sesga hacia lo más representado y hacia el último ejemplo.',
      porQueNo: {
        1: 'Los casos típicos el modelo ya los resuelve solo. No aportan información nueva.',
        2: 'De 5 en adelante hay rendimientos decrecientes con costo creciente en cada llamada.',
        3: 'Se propagarían los errores del modelo. Los ejemplos deben estar verificados.',
      },
    },
    {
      p: '¿Cuándo NO conviene usar chain-of-thought?',
      opciones: [
        'En extracción de datos o clasificación simple, y con modelos de razonamiento',
        'Cuando el problema tiene varios pasos',
        'Cuando hay cálculos involucrados',
        'Nunca: siempre mejora los resultados',
      ],
      correcta: 0,
      porQue: 'En tareas de un solo paso agrega latencia y puede triplicar el costo sin ganancia medible. Y con un modelo de razonamiento es redundante: ya lo hace internamente.',
      porQueNo: {
        1: 'Ahí es exactamente donde más aporta.',
        2: 'Los cálculos encadenados son el caso de uso ideal.',
        3: 'El razonamiento son tokens de salida, que son los caros. No es gratis.',
      },
    },
    {
      p: '¿Cuál es el mecanismo MÁS confiable para garantizar la estructura de la salida?',
      opciones: [
        'Salida estructurada nativa con JSON Schema, cuando el proveedor la soporta',
        'Describir el formato en el system prompt',
        'Pedirle que revise su propia respuesta',
        'Usar temperatura 0',
      ],
      correcta: 0,
      porQue: 'Restringe la generación token a token para que la salida cumpla el esquema. La escala de confiabilidad es: instrucción < prefill < tool calling forzado < salida nativa.',
      porQueNo: {
        1: 'Es el nivel más bajo de la escala: ayuda pero no garantiza nada.',
        2: 'Duplica el costo y sigue dependiendo del criterio del modelo.',
        3: 'Reduce variabilidad pero no impone estructura.',
      },
    },
    {
      p: 'El modelo devuelve un JSON con estructura válida pero un total mal calculado. ¿Qué falta?',
      opciones: [
        'Validación de negocio en el código: comprobar que el total sea la suma de los ítems',
        'Un esquema más estricto',
        'Un modelo más grande',
        'Bajar la temperatura',
      ],
      correcta: 0,
      porQue: 'Esquema válido no significa dato correcto. Todo lo que se pueda comprobar con aritmética o con una consulta a la base hay que comprobarlo por código.',
      porQueNo: {
        1: 'Ningún esquema puede expresar "este número debe ser la suma de estos otros".',
        2: 'Reduciría la frecuencia del error pero no lo elimina, y cuesta mucho más.',
        3: 'La temperatura afecta la variabilidad, no la exactitud aritmética.',
      },
    },
    {
      p: 'En un esquema de salida con un campo de categoría y uno de razón, ¿en qué orden conviene ponerlos?',
      opciones: [
        'Primero la razón, después la categoría',
        'Primero la categoría, después la razón',
        'Es indistinto',
        'Conviene pedirlos en dos llamadas separadas',
      ],
      correcta: 0,
      porQue: 'Los campos se generan en orden y cada uno se condiciona a los anteriores. Con la razón primero, el modelo razona y después concluye. Al revés, concluye y después racionaliza.',
      porQueNo: {
        1: 'Es el orden intuitivo pero el peor: la justificación se escribe después de haber decidido.',
        2: 'Sí importa, precisamente por cómo funciona la generación autorregresiva.',
        3: 'Duplica costo y latencia para algo que se resuelve ordenando bien los campos.',
      },
    },
    {
      p: '¿Qué mejora el streaming?',
      opciones: [
        'La latencia percibida: el usuario ve la respuesta empezar mucho antes',
        'El tiempo total de la respuesta',
        'El costo por token',
        'La calidad de la respuesta',
      ],
      correcta: 0,
      porQue: 'El tiempo total es idéntico. Lo que cambia es que el usuario percibe el TTFT en lugar de la latencia completa. Es una optimización de percepción, y conviene decirlo con esa precisión.',
      porQueNo: {
        1: 'No cambia en absoluto: se generan los mismos tokens a la misma velocidad.',
        2: 'Se cobran exactamente los mismos tokens.',
        3: 'Es la misma generación; solo cambia cómo se entrega.',
      },
    },
    {
      p: 'Una operación con IA tarda 45 segundos. ¿Qué corresponde?',
      opciones: [
        'Mandarla a una cola con un worker y devolverle al usuario un identificador',
        'Subir el timeout del request',
        'Usar streaming para que se sienta más rápida',
        'Usar un modelo más grande',
      ],
      correcta: 0,
      porQue: 'Por encima de 30 segundos no va en el request del usuario: las plataformas serverless tienen topes propios, y una conexión que se corta te deja sin forma de recuperar trabajo ya pagado.',
      porQueNo: {
        1: 'Muchos topes de plataforma no se pueden subir, y no resuelve la pérdida de trabajo si la conexión cae.',
        2: 'Ayuda a la percepción pero no resuelve el riesgo de timeout ni la pérdida del resultado.',
        3: 'Sería más lento todavía.',
      },
    },
    {
      p: '¿Qué rompe el prompt caching?',
      opciones: [
        'Poner algo variable, como un timestamp, al principio del prompt',
        'Usar temperatura 0',
        'Tener un system prompt muy largo',
        'Usar herramientas (tools)',
      ],
      correcta: 0,
      porQue: 'La caché exige un prefijo idéntico byte a byte y ubicado al principio. Un token variable adelante invalida la caché en todas las llamadas, sin generar ningún error visible.',
      porQueNo: {
        1: 'No tiene ninguna relación con el caching.',
        2: 'Al contrario: un system prompt largo y fijo es el candidato ideal para cachear.',
        3: 'Las definiciones de herramientas son fijas, así que también son cacheables.',
      },
    },
    {
      p: '¿Cuál es la forma correcta de elegir modelo para una funcionalidad?',
      opciones: [
        'Empezar por el más chico plausible y subir solo si las evals lo exigen',
        'Usar siempre el más capaz disponible',
        'Elegir el primero del ranking de benchmarks',
        'Usar el mismo modelo para todo el sistema',
      ],
      correcta: 0,
      porQue: 'Es lo contrario de lo habitual, y por eso es donde queda la mayor parte del sobrecosto: arrancar con el grande, ver que funciona y no revisarlo nunca más.',
      porQueNo: {
        1: 'Es el sobrecosto más silencioso que existe, justamente porque funciona bien y nadie lo cuestiona.',
        2: 'Los benchmarks miden tareas genéricas que rara vez se parecen a la tuya. Sirven para descartar, no para elegir.',
        3: 'Distintas tareas tienen distintas exigencias. Elegir el modelo por tarea es de las decisiones de costo más rentables.',
      },
    },
    {
      p: 'En producción, ¿qué versión del modelo conviene fijar?',
      opciones: [
        'La versión exacta',
        'El alias "latest", para tener siempre lo último',
        'Da igual: los alias no cambian',
        'La versión más vieja, por estabilidad',
      ],
      correcta: 0,
      porQue: 'Con un alias móvil, el proveedor actualiza y tu sistema cambia de comportamiento sin ningún deploy, con prompts afinados para otra versión. Las migraciones se hacen a propósito y con evals que comparen antes y después.',
      porQueNo: {
        1: 'Es exactamente lo que hace que tu sistema cambie sin aviso un martes cualquiera.',
        2: 'Los alias sí se actualizan: esa es toda su razón de ser.',
        3: 'Las versiones viejas se deprecan y perdés mejoras. La clave es controlar cuándo migrás, no evitarlo.',
      },
    },
  ],
});
