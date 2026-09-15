/* ==========================================================================
   IA · Módulo 00 — Mapa del terreno
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ia',
  id: 'm00',
  titulo: 'Mapa del terreno',
  fuentes: ['anthropic', 'openai', 'paper-attention'],

  intro:
    '<p>Antes de aprender <i>cómo</i> se construye algo con IA, hace falta saber <b>de qué estamos hablando</b>. ' +
    'Este módulo es corto y es el que evita que digas una barbaridad en los primeros dos minutos de una entrevista.</p>' +
    '<p>Salís de acá sabiendo qué es cada palabra, cómo se ve un producto con IA por dentro, y cuáles son las tres ' +
    'formas de hacer que un modelo sepa cosas que no sabía.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'IA, Machine Learning, Deep Learning, LLM: quién contiene a quién',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> son muñecas rusas. La IA es la caja grande, el
machine learning va adentro, el deep learning adentro de eso, y los LLM son una cajita chiquita adentro de todo.</div>

<p>Vamos de afuera hacia adentro.</p>

<h4>Inteligencia Artificial (IA)</h4>
<p>Es <b>el objetivo</b>, no una técnica: lograr que una máquina haga algo que, si lo hiciera una persona,
dirías que requirió inteligencia. El GPS que calcula la ruta más corta es IA. El rival del ajedrez de 1997 era IA.
Nada de eso "aprende" — son reglas escritas por un humano, y siguen contando como IA.</p>

<h4>Machine Learning (aprendizaje automático)</h4>
<p>Es <b>una forma de lograr IA</b>: en vez de escribirle las reglas, le mostrás miles de ejemplos y las reglas
las saca solo.</p>
<p>La diferencia es este vuelco, y vale la pena que te quede grabado:</p>
<ul>
<li><b>Programación de toda la vida:</b> vos ponés las <i>reglas</i> + los <i>datos</i> → la máquina te da las <i>respuestas</i>.</li>
<li><b>Machine learning:</b> vos ponés los <i>datos</i> + las <i>respuestas</i> → la máquina te devuelve las <i>reglas</i>.</li>
</ul>
<p>Ejemplo: para detectar spam a mano tendrías que escribir mil reglas ("si dice GRATIS en mayúsculas…") y aun
así te lo esquivan. Con ML le mostrás 100.000 mails ya marcados como spam o no spam, y el sistema deduce solo
qué los distingue.</p>

<h4>Deep Learning (aprendizaje profundo)</h4>
<p>Es <b>una forma de hacer machine learning</b>, usando <i>redes neuronales</i> con muchas capas apiladas
(de ahí lo de "profundo"). Cada capa aprende algo un poco más abstracto que la anterior. En una red que mira
fotos: la primera capa detecta bordes, la siguiente formas, la siguiente ojos y narices, la última "esto es un gato".</p>
<p>Lo importante: <b>vos no le decís qué mirar</b>. Eso lo descubre entrenando. Por eso necesita muchísimos datos
y muchísima capacidad de cómputo.</p>

<h4>LLM (Large Language Model / modelo grande de lenguaje)</h4>
<p>Es <b>un tipo específico de red neuronal profunda</b>, entrenada con cantidades gigantescas de texto, cuya
única tarea es predecir qué viene después. Claude, GPT, Gemini y Llama son LLMs.</p>

<h4>¿Y la "IA generativa"?</h4>
<p>Esa no es otra muñeca: es una <b>etiqueta según lo que sale</b>. Si el modelo produce contenido nuevo
(texto, imagen, audio, video), es IA generativa. Si solo clasifica o predice un número, no lo es.</p>
<ul>
<li>Un LLM escribiendo un mail → generativa ✅</li>
<li>Un modelo que decide si un mail es spam → machine learning, pero <b>no</b> generativa ❌</li>
<li>Midjourney generando una imagen → generativa, pero <b>no</b> es un LLM ❌</li>
</ul>

<div class="aviso"><strong>Lo que hay que retener:</strong> todo LLM es deep learning, todo deep learning es
machine learning, todo machine learning es IA. Al revés <b>no</b> vale, y confundir eso es el primer error
que se escucha en una entrevista.</div>
`,

      tecnico: `
<p>Las mismas capas, con la terminología que vas a leer en papers y en descripciones de puesto.</p>

<h4>Inteligencia Artificial</h4>
<p>Campo de la computación. Incluye <b>IA simbólica</b> (sistemas expertos, motores de reglas, algoritmos de
búsqueda como A*, planificación, lógica de primer orden) y <b>IA estadística</b> (machine learning). La IA
simbólica dominó hasta los años 80; el enfoque estadístico ganó cuando aparecieron datos y cómputo suficientes.</p>

<h4>Machine Learning</h4>
<p>Se divide clásicamente en tres paradigmas:</p>
<table>
<tr><th>Paradigma</th><th>Qué recibe</th><th>Ejemplos</th></tr>
<tr><td><b>Supervisado</b></td><td>Datos etiquetados (entrada → salida correcta)</td><td>Clasificación, regresión, detección de spam</td></tr>
<tr><td><b>No supervisado</b></td><td>Datos sin etiquetar</td><td>Clustering, reducción de dimensionalidad, detección de anomalías</td></tr>
<tr><td><b>Por refuerzo</b></td><td>Un entorno y una señal de recompensa</td><td>Juegos, robótica, RLHF</td></tr>
</table>
<p>Existe además el <b>aprendizaje auto-supervisado</b> (<i>self-supervised</i>), que es el que hace posible a
los LLM: las etiquetas se generan del propio dato. Al modelo le tapás la palabra siguiente de un texto y la
etiqueta correcta es, precisamente, esa palabra. Por eso se puede entrenar con internet entero sin que nadie
etiquete nada a mano.</p>

<h4>Deep Learning</h4>
<p>Redes neuronales artificiales con múltiples capas ocultas. Un <b>parámetro</b> (o peso) es un número
ajustable de la red; el entrenamiento consiste en encontrar los valores que minimizan una <i>función de
pérdida</i>, mediante <b>descenso por gradiente</b> y <b>retropropagación</b>. La clave del deep learning es el
<i>aprendizaje de representaciones</i>: la red descubre por sí sola qué características del dato son relevantes,
en lugar de recibirlas diseñadas a mano (<i>feature engineering</i>).</p>

<h4>Transformer</h4>
<p>Arquitectura presentada en 2017 en el paper <i>"Attention Is All You Need"</i> (Google). Su aporte central
es el <b>mecanismo de atención</b>, que permite procesar todos los tokens de una secuencia en paralelo y
ponderar cuánto influye cada uno sobre cada otro. Esto reemplazó a las arquitecturas recurrentes (RNN, LSTM),
que procesaban palabra por palabra y no escalaban. <b>Todo LLM moderno es un transformer.</b></p>

<h4>LLM</h4>
<p>Transformer con miles de millones de parámetros, entrenado de forma auto-supervisada sobre corpus masivos de
texto para modelar la distribución de probabilidad del siguiente token. La escala es lo que produce las
<b>capacidades emergentes</b>: habilidades (razonamiento en varios pasos, traducción, escritura de código) que
nadie programó explícitamente y que aparecen recién a partir de cierto tamaño.</p>

<h4>Modelo fundacional (foundation model)</h4>
<p>Modelo grande, preentrenado de forma general, pensado para ser adaptado a muchas tareas distintas.
Es el término paraguas: incluye LLMs pero también modelos de visión y multimodales.</p>

<h4>Dónde encaja tu rol</h4>
<table>
<tr><th>Rol</th><th>Qué hace</th></tr>
<tr><td><b>Data Scientist</b></td><td>Analiza datos, hace experimentos, saca conclusiones de negocio.</td></tr>
<tr><td><b>ML Engineer</b></td><td>Entrena, ajusta y despliega modelos propios. Sabe de features, métricas, pipelines de datos.</td></tr>
<tr><td><b>AI Engineer</b></td><td><b>Construye productos sobre modelos que ya existen.</b> No entrena nada: integra, orquesta, evalúa, controla costos y seguridad.</td></tr>
</table>
<p>Este track es de <b>AI Engineer</b>. No vas a necesitar cálculo ni álgebra lineal — vas a necesitar entender
sistemas distribuidos, APIs, bases de datos y trade-offs.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 660 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <rect x="18" y="18" width="624" height="304" rx="18" fill="#7c5cff" fill-opacity=".07" stroke="#7c5cff" stroke-width="1.6"/>
  <text x="36" y="44" fill="#7c5cff" font-size="14" font-weight="700">Inteligencia Artificial</text>
  <text x="36" y="62" fill="currentColor" opacity=".55" font-size="11.5">el objetivo · incluye reglas, búsqueda, planificación</text>

  <rect x="48" y="76" width="564" height="230" rx="16" fill="#22d3ee" fill-opacity=".07" stroke="#22d3ee" stroke-width="1.6"/>
  <text x="66" y="100" fill="#22d3ee" font-size="14" font-weight="700">Machine Learning</text>
  <text x="66" y="118" fill="currentColor" opacity=".55" font-size="11.5">aprende las reglas a partir de ejemplos</text>

  <rect x="78" y="132" width="504" height="158" rx="14" fill="#34d399" fill-opacity=".07" stroke="#34d399" stroke-width="1.6"/>
  <text x="96" y="156" fill="#34d399" font-size="14" font-weight="700">Deep Learning</text>
  <text x="96" y="174" fill="currentColor" opacity=".55" font-size="11.5">redes neuronales de muchas capas</text>

  <rect x="108" y="188" width="444" height="86" rx="12" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="126" y="214" fill="#fbbf24" font-size="14" font-weight="700">LLM  ·  transformers</text>
  <text x="126" y="234" fill="currentColor" opacity=".62" font-size="11.5">Claude · GPT · Gemini · Llama</text>
  <text x="126" y="252" fill="currentColor" opacity=".45" font-size="11.5">entrenados con texto para predecir el token siguiente</text>

  <rect x="18" y="340" width="624" height="46" rx="12" fill="none" stroke="#c084fc" stroke-width="1.6" stroke-dasharray="6 4"/>
  <text x="36" y="362" fill="#c084fc" font-size="13" font-weight="700">IA Generativa</text>
  <text x="36" y="379" fill="currentColor" opacity=".55" font-size="11.5">no es una capa: es una etiqueta según lo que el modelo PRODUCE (texto, imagen, audio, video)</text>
</svg>`,
        pie: 'Cada caja está enteramente contenida en la de afuera. La línea punteada cruza varias capas a la vez.',
        nota: '<p>Fijate que <b>IA Generativa</b> aparece separada y punteada a propósito: un generador de imágenes es ' +
              'IA generativa sin ser un LLM, y un detector de spam es machine learning sin ser generativo. ' +
              'Las cuatro cajas de arriba se contienen; la de abajo las atraviesa.</p>',
      },

      entrevista: [
        { p: '¿Cuál es la diferencia entre inteligencia artificial, machine learning y deep learning?',
          r: 'Son círculos concéntricos. <b>IA</b> es el campo entero: cualquier sistema que haga algo que asociamos con inteligencia, ' +
             'incluso si son reglas escritas a mano. <b>Machine learning</b> es un subconjunto donde el sistema deduce las reglas a partir ' +
             'de ejemplos en vez de recibirlas programadas. <b>Deep learning</b> es un subconjunto de ML que usa redes neuronales de muchas ' +
             'capas y aprende por sí solo qué características del dato importan. Los LLM son deep learning aplicado a texto.' },

        { p: '¿Un LLM es lo mismo que IA generativa?',
          r: 'No, aunque se superponen. <b>IA generativa</b> es una categoría por el tipo de salida: cualquier modelo que produce contenido nuevo. ' +
             'Un LLM es un tipo de modelo, específicamente de texto. Todo LLM es generativo, pero hay IA generativa que no es un LLM ' +
             '—un generador de imágenes por difusión, por ejemplo— y hay modelos de lenguaje que no generan, como un clasificador basado en BERT.' },

        { p: '¿Qué diferencia hay entre un AI Engineer y un ML Engineer?',
          r: 'El <b>ML Engineer</b> construye y entrena modelos: trabaja con datasets, features, métricas de entrenamiento y pipelines. ' +
             'El <b>AI Engineer</b> construye productos sobre modelos que ya existen y consume por API. Su problema no es la función de pérdida: ' +
             'es el diseño del sistema alrededor del modelo —recuperación de contexto, orquestación, evaluación, latencia, costo por request y seguridad. ' +
             'Es un rol mucho más cercano a ingeniería de software y sistemas distribuidos que a ciencia de datos.' },

        { p: '¿Por qué los transformers reemplazaron a las redes recurrentes?',
          r: 'Por dos razones. La primera es <b>paralelización</b>: una RNN procesa la secuencia palabra por palabra, así que no podés ' +
             'aprovechar una GPU entera; el transformer procesa todos los tokens a la vez. La segunda es el <b>alcance</b>: las RNN pierden ' +
             'información de lo que ocurrió muchas palabras atrás, mientras que la atención conecta directamente cualquier token con cualquier otro, ' +
             'sin importar la distancia. Eso es lo que hizo viable entrenar a la escala de los LLM actuales.' },
      ],

      practica: `
<p>Clasificá estos casos reales. Es exactamente el tipo de decisión que vas a tomar como AI Engineer:</p>

<table>
<tr><th>Problema</th><th>Qué corresponde</th><th>Por qué</th></tr>
<tr><td>Detectar si un pago con tarjeta es fraudulento</td><td>ML clásico (gradient boosting)</td><td>Datos tabulares, millones de ejemplos etiquetados, hace falta latencia de milisegundos. Un LLM sería más lento, más caro y peor.</td></tr>
<tr><td>Resumir la conversación de un cliente en un CRM</td><td>LLM vía API</td><td>Texto libre, no hay dataset etiquetado, la salida es lenguaje natural.</td></tr>
<tr><td>Recomendar productos en un e-commerce</td><td>ML clásico (filtrado colaborativo)</td><td>Es un problema de similitud sobre comportamiento, no de lenguaje.</td></tr>
<tr><td>Extraer los datos de una factura escaneada</td><td>LLM multimodal o modelo de visión</td><td>Documentos con formato variable. Un OCR clásico se rompe con cada plantilla nueva.</td></tr>
<tr><td>Clasificar tickets en 5 categorías fijas, 50.000 por día</td><td>Modelo chico afinado, no un LLM grande</td><td>Con ese volumen, un LLM grande te cuesta cientos de dólares al día para una tarea que un modelo de 100M de parámetros resuelve igual de bien.</td></tr>
</table>

<div class="aviso"><strong>La pregunta que te va a servir toda la carrera:</strong> "¿esto necesita <i>entender lenguaje</i>,
o solamente <i>encontrar un patrón</i>?" Si es lo segundo, un LLM es casi siempre la herramienta equivocada:
más lenta, más cara y menos predecible.</div>

<h4>Cómo se ve en el código</h4>
<pre><code>// Esto NO es IA — son reglas escritas a mano. Y para muchos casos, alcanza.
const esSpam = (asunto) =&gt; /GRATIS|GANASTE|!!!/.test(asunto);

// Esto es machine learning clásico: un modelo entrenado con ejemplos etiquetados.
const prob = modeloSpam.predict(vectorizar(asunto));   // 0.93

// Esto es un LLM: lenguaje natural entra, lenguaje natural sale.
const r = await anthropic.messages.create({
  model: 'claude-haiku-4-5',
  max_tokens: 64,
  messages: [{ role: 'user', content: \`¿Este mail es spam? Respondé sí o no.\\n\\n\${cuerpo}\` }],
});</code></pre>
<p>Las tres líneas resuelven el mismo problema. La diferencia está en el costo, la latencia, la explicabilidad
y en cuánto se degradan cuando aparece un caso que nunca viste.</p>
`,

      errores: [
        { mito: '"IA" y "LLM" son sinónimos.',
          realidad: 'Un LLM es una técnica muy específica dentro de un campo enorme. Decir "vamos a usar IA" cuando querés decir ' +
                    '"vamos a llamar a la API de un LLM" es impreciso, y en una entrevista técnica se nota enseguida. <b>Nombrá la herramienta, no la categoría.</b>' },

        { mito: 'Los LLM razonan como una persona.',
          realidad: 'Un LLM calcula la distribución de probabilidad del token siguiente. Que el resultado <i>parezca</i> razonamiento es un efecto ' +
                    'de haber sido entrenado con enormes cantidades de texto donde había razonamiento escrito. <b>La distinción importa en la práctica:</b> ' +
                    'explica por qué falla en aritmética de varios dígitos, por qué el mismo problema con otras palabras da otro resultado, y por qué ' +
                    'inventa una cita con total seguridad.' },

        { mito: 'Si el problema es difícil, hay que usar el modelo más grande.',
          realidad: 'La pregunta correcta es si el problema necesita <b>lenguaje</b>. Para clasificar, puntuar o detectar anomalías sobre datos ' +
                    'estructurados, un modelo clásico chico es más rápido, más barato, más determinista y más fácil de auditar. ' +
                    'El LLM se justifica cuando la entrada o la salida son texto libre.' },

        { mito: 'Machine learning es lo mismo que deep learning.',
          realidad: 'El deep learning es una rama del ML, y no siempre la mejor. Sobre datos tabulares —el caso más común en una empresa— ' +
                    '<b>los árboles de decisión potenciados (XGBoost, LightGBM) suelen ganarle a una red neuronal</b>, con una fracción del costo ' +
                    'y de los datos necesarios.' },
      ],

      glosario: [
        { t: 'Inteligencia Artificial (IA)', d: 'Campo de la computación dedicado a que las máquinas resuelvan tareas asociadas a la inteligencia humana. No implica aprendizaje.' },
        { t: 'Machine Learning (ML)', d: 'Subcampo de la IA donde el sistema infiere las reglas a partir de ejemplos, en lugar de recibirlas programadas.' },
        { t: 'Deep Learning', d: 'ML basado en redes neuronales con múltiples capas, capaces de aprender por sí mismas qué características del dato son relevantes.' },
        { t: 'Red neuronal', d: 'Modelo compuesto por capas de unidades conectadas por pesos numéricos, ajustados durante el entrenamiento.' },
        { t: 'Parámetro (peso)', d: 'Cada número ajustable de la red. "Un modelo de 70B" significa 70 mil millones de parámetros.' },
        { t: 'Transformer', d: 'Arquitectura de red neuronal (2017) basada en el mecanismo de atención. Es la base de todos los LLM actuales.' },
        { t: 'Atención', d: 'Mecanismo que permite a cada token del texto ponderar cuánto le importa cada otro token, sin importar la distancia entre ellos.' },
        { t: 'LLM', d: 'Large Language Model. Transformer de gran escala entrenado sobre texto para predecir el token siguiente.' },
        { t: 'IA Generativa', d: 'Categoría de modelos definida por su salida: producen contenido nuevo (texto, imagen, audio, video).' },
        { t: 'Modelo fundacional', d: 'Modelo grande preentrenado de propósito general, pensado para adaptarse a muchas tareas distintas.' },
        { t: 'Aprendizaje auto-supervisado', d: 'Entrenamiento donde las etiquetas se derivan del propio dato (ej: predecir la palabra tapada). Es lo que permite entrenar sin etiquetado humano.' },
        { t: 'Capacidades emergentes', d: 'Habilidades que aparecen solo a partir de cierta escala del modelo y que nadie programó de forma explícita.' },
        { t: 'Inferencia', d: 'Usar un modelo ya entrenado para obtener una respuesta. Es lo que pagás por token cuando llamás a una API.' },
        { t: 'Entrenamiento', d: 'Proceso de ajustar los parámetros del modelo a partir de datos. Cuesta millones de dólares en un LLM de frontera.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Cómo se ve un producto con IA por dentro',
      minutos: 10,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el LLM es el cocinero. Cocina increíble, pero no
sabe qué hay en tu heladera, no atiende el teléfono, no cobra y no se acuerda de lo que hizo ayer.
<b>Todo lo demás lo pone tu sistema.</b></div>

<p>Esta es la confusión más cara del rubro: creer que "hacer un producto con IA" es llamar a una API. Esa
llamada es una línea de código. El producto son las otras seis capas que la rodean.</p>

<h4>Las 7 piezas</h4>

<p><b>1 · La interfaz.</b> Por dónde entra el pedido: un chat, un botón "resumir", un formulario, un mail
que llega. Muchas veces la mejor interfaz para IA <i>no</i> es un chat — un botón que hace una cosa bien suele
ganarle a una cajita de texto que puede hacer cualquier cosa mal.</p>

<p><b>2 · La orquestación.</b> Tu backend. Decide qué se le pide al modelo, en qué orden, qué pasa si falla,
cuántas veces reintenta, y con qué se combina. Es el cerebro del sistema, y es <b>código común y corriente</b>,
no magia.</p>

<p><b>3 · El contexto.</b> El modelo no sabe nada de tu negocio. Antes de preguntarle algo, hay que buscar los
datos relevantes y pegárselos en el mensaje. Eso es RAG, y es el módulo 4 entero.</p>

<p><b>4 · El modelo.</b> La llamada a la API. Es la pieza que menos código tiene y de la que todo el mundo habla.</p>

<p><b>5 · Las herramientas.</b> Le das al modelo una lista de acciones que puede pedir: "buscar cliente",
"crear tarea", "mandar mail". Él no las ejecuta — <b>te pide que las ejecutes vos</b>, y le devolvés el
resultado. Ahí empieza lo agéntico.</p>

<p><b>6 · Evaluación y observabilidad.</b> ¿Está funcionando? ¿Mejoró o empeoró con el último cambio de prompt?
¿Cuánto salió hoy? Sin esto estás manejando de noche sin luces.</p>

<p><b>7 · Los guardrails (barandas).</b> Qué no puede pasar nunca: filtrar datos personales, cortar si supera
el presupuesto, validar la salida antes de guardarla, no dejar que el usuario reescriba tus instrucciones.</p>

<div class="aviso"><strong>La proporción real:</strong> en un producto serio con IA, la llamada al modelo es
menos del <b>5% del código</b>. El otro 95% es traer el contexto correcto, validar, medir, cachear, controlar
costos y manejar errores. Por eso el puesto se llama <i>ingeniero</i>.</div>
`,

      tecnico: `
<p>El mismo stack, con los nombres que vas a ver en un diagrama de arquitectura.</p>

<table>
<tr><th>Capa</th><th>Responsabilidad</th><th>Con qué se suele hacer</th></tr>
<tr><td><b>Interfaz</b></td><td>Entrada del usuario, streaming de la respuesta, estados de carga y error</td><td>Next.js / React, SSE o WebSocket</td></tr>
<tr><td><b>Orquestación</b></td><td>Control de flujo, reintentos, timeouts, encadenado de llamadas, ejecución asíncrona</td><td>Server Actions, LangGraph, Inngest / colas</td></tr>
<tr><td><b>Recuperación de contexto</b></td><td>Búsqueda semántica e híbrida, re-ranking, armado del prompt</td><td>pgvector, Qdrant, Pinecone, BM25</td></tr>
<tr><td><b>Modelo</b></td><td>Inferencia</td><td>API de Anthropic / OpenAI / Google, o self-hosted con vLLM</td></tr>
<tr><td><b>Herramientas</b></td><td>Definición de tools, ejecución, devolución del resultado al modelo</td><td>Tool calling nativo, MCP</td></tr>
<tr><td><b>Evaluación y observabilidad</b></td><td>Trazas, latencia, tokens, costo por tenant, tasa de acierto, regresiones</td><td>Langfuse, LangSmith, Sentry, tablas propias</td></tr>
<tr><td><b>Guardrails</b></td><td>Validación de esquema, filtrado de PII, límites de presupuesto, moderación</td><td>Zod, expresiones regulares, clasificadores, límites por tenant</td></tr>
</table>

<h4>El camino de un request, paso a paso</h4>
<ol>
<li><b>Autenticación y contexto de tenant.</b> Quién pregunta y a qué datos tiene derecho. En multi-tenant esto va <i>primero</i>: define todo el resto.</li>
<li><b>Control de presupuesto.</b> Consultar el gasto acumulado del tenant y cortar si excede el tope. Antes de gastar, no después.</li>
<li><b>Recuperación.</b> Convertir la consulta a embedding, buscar los k fragmentos más cercanos <i>filtrando por tenant</i>, re-rankear.</li>
<li><b>Armado del prompt.</b> System prompt + contexto recuperado + historial + mensaje del usuario, dentro del presupuesto de tokens.</li>
<li><b>Inferencia.</b> Llamada al modelo, en streaming si hay un humano esperando.</li>
<li><b>Bucle de herramientas.</b> Si el modelo pide una tool: validar argumentos, ejecutar con los permisos del usuario, devolver el resultado, volver a llamar. Con un <b>límite duro de iteraciones</b>.</li>
<li><b>Validación de salida.</b> Parsear contra un esquema, verificar citaciones, filtrar datos sensibles.</li>
<li><b>Registro.</b> Persistir tokens de entrada y salida, costo en USD, latencia, modelo, tenant y feature.</li>
</ol>

<div class="dato"><strong>Los pasos 1, 2, 7 y 8 son los que separan un demo de un producto.</strong> Un prototipo
hace 3-4-5 y funciona en la demo. Lo que rompe en producción es siempre lo otro: un tenant que ve datos de
otro, una factura de 4.000 dólares en un fin de semana, un JSON malformado que tumba el guardado.</div>

<h4>Síncrono o asíncrono</h4>
<p>Regla práctica: si la operación puede superar los <b>30 segundos</b>, no va en el request del usuario.
Va a una cola con un worker (Inngest, SQS, BullMQ) y el usuario recibe el resultado por notificación o polling.
Un agente que encadena seis llamadas con herramientas <i>siempre</i> cae en esta categoría.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 470" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="f1" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
    <path d="M0,0 L7,3.2 L0,6.4 z" fill="currentColor" opacity=".45"/></marker></defs>

  <rect x="30" y="18" width="420" height="48" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="46" y="40" fill="currentColor" font-size="13.5" font-weight="700">1 · Interfaz</text>
  <text x="46" y="57" fill="currentColor" opacity=".55" font-size="11">chat, botón, formulario · streaming de la respuesta</text>

  <rect x="30" y="82" width="420" height="48" rx="10" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="46" y="104" fill="currentColor" font-size="13.5" font-weight="700">2 · Orquestación</text>
  <text x="46" y="121" fill="currentColor" opacity=".55" font-size="11">tu backend: qué se pide, en qué orden, qué pasa si falla</text>

  <rect x="30" y="146" width="420" height="48" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="46" y="168" fill="currentColor" font-size="13.5" font-weight="700">3 · Contexto  (RAG)</text>
  <text x="46" y="185" fill="currentColor" opacity=".55" font-size="11">buscar TUS datos y pegarlos en el prompt</text>

  <rect x="30" y="210" width="420" height="48" rx="10" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="2"/>
  <text x="46" y="232" fill="currentColor" font-size="13.5" font-weight="700">4 · El modelo</text>
  <text x="46" y="249" fill="currentColor" opacity=".55" font-size="11">la llamada a la API — menos del 5% del código</text>

  <rect x="30" y="274" width="420" height="48" rx="10" fill="#c084fc" fill-opacity=".12" stroke="#c084fc" stroke-width="1.4"/>
  <text x="46" y="296" fill="currentColor" font-size="13.5" font-weight="700">5 · Herramientas (tools)</text>
  <text x="46" y="313" fill="currentColor" opacity=".55" font-size="11">el modelo PIDE una acción · vos la ejecutás y le devolvés el resultado</text>

  <rect x="30" y="338" width="420" height="48" rx="10" fill="#60a5fa" fill-opacity=".12" stroke="#60a5fa" stroke-width="1.4"/>
  <text x="46" y="360" fill="currentColor" font-size="13.5" font-weight="700">6 · Evaluación y observabilidad</text>
  <text x="46" y="377" fill="currentColor" opacity=".55" font-size="11">¿funciona? ¿mejoró? ¿cuánto salió?</text>

  <rect x="30" y="402" width="420" height="48" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="46" y="424" fill="currentColor" font-size="13.5" font-weight="700">7 · Guardrails</text>
  <text x="46" y="441" fill="currentColor" opacity=".55" font-size="11">presupuesto, PII, validación de salida, prompt injection</text>

  <line x1="466" y1="30" x2="466" y2="440" stroke="currentColor" opacity=".22" stroke-width="1.4" stroke-dasharray="4 4"/>
  <text x="482" y="150" fill="#fbbf24" font-size="12" font-weight="700">← lo que</text>
  <text x="482" y="168" fill="#fbbf24" font-size="12" font-weight="700">   todos miran</text>
  <text x="482" y="196" fill="currentColor" opacity=".5" font-size="11">(la capa 4)</text>

  <text x="482" y="300" fill="#34d399" font-size="12" font-weight="700">← lo que</text>
  <text x="482" y="318" fill="#34d399" font-size="12" font-weight="700">   decide si sirve</text>
  <text x="482" y="346" fill="currentColor" opacity=".5" font-size="11">(todo el resto)</text>
</svg>`,
        pie: 'Las 7 capas de un producto con IA. La única que aparece en los tutoriales es la 4.',
      },

      entrevista: [
        { p: 'Describime la arquitectura de una funcionalidad con IA que hayas construido.',
          r: 'Conviene recorrerla como un request de punta a punta y no como una lista de tecnologías. Por ejemplo: ' +
             '"El usuario pide un resumen desde el CRM. La Server Action valida sesión y resuelve el tenant, chequea el presupuesto ' +
             'mensual de ese tenant, recupera las interacciones relevantes con búsqueda vectorial <i>filtrando por tenant</i>, ' +
             'arma el prompt con un tope de tokens, llama al modelo en streaming, valida la salida contra un esquema y registra ' +
             'tokens y costo en una tabla de uso. Si el resumen es de un lote grande, no va en el request: va a una cola." ' +
             '<b>Mencionar tenant, presupuesto y registro es lo que muestra que trabajaste en producción y no solo en un demo.</b>' },

        { p: '¿Por qué no llamar al modelo directamente desde el frontend?',
          r: 'Por cuatro razones, y conviene decirlas todas. <b>Primero, la clave de API</b>: si está en el cliente, es pública, y ' +
             'cualquiera puede gastar tu saldo. <b>Segundo, control de costos</b>: no hay forma de imponer un límite por usuario. ' +
             '<b>Tercero, el contexto</b>: los datos que el modelo necesita están en tu base y el cliente no debería poder pedirlos ' +
             'sin pasar por tus reglas de autorización. <b>Cuarto, observabilidad</b>: si no pasa por tu backend, no podés registrar ' +
             'ni medir nada. La única excepción razonable es un proxy en el edge que igual valida sesión.' },

        { p: '¿Qué parte de un sistema con IA es la que más suele fallar?',
          r: 'La recuperación de contexto, casi siempre. Cuando alguien dice "el modelo alucina", en la mayoría de los casos el modelo ' +
             'respondió razonablemente con el contexto que recibió — el problema es que ese contexto estaba incompleto o era el equivocado. ' +
             'Por eso las métricas de retrieval (<i>context recall</i> y <i>precision</i>) importan tanto como la calidad de la generación: ' +
             '<b>si el dato correcto nunca entró al prompt, ningún prompt lo va a salvar.</b>' },
      ],

      practica: `
<h4>El esqueleto real de una llamada bien hecha</h4>
<pre><code>'use server';
import 'server-only';

export async function resumirLead(leadId: string) {
  // 1 · quién sos y a qué tenés derecho
  const tenant = await requireTenantContext(supabase);
  if (!tenant.ok) return { error: tenant.error };

  // 2 · ¿queda presupuesto?
  const budget = await checkBudget(tenant.ctx.tenantId);
  if (!budget.ok) return { error: 'Límite mensual de IA alcanzado' };

  // 3 · contexto — SIEMPRE filtrado por tenant
  const interacciones = await buscarSimilares({
    tenantId: tenant.ctx.tenantId,
    leadId,
    limite: 8,
  });

  // 4 · 5 · el modelo (con cost tracking adentro del helper)
  const r = await callAnthropic(supabase, {
    tenantId: tenant.ctx.tenantId,
    feature: 'lead_summary',
    model: 'claude-haiku-4-5',
    messages: [{ role: 'user', content: armarPrompt(interacciones) }],
  });

  // 7 · validar antes de confiar
  const parsed = EsquemaResumen.safeParse(r.json);
  if (!parsed.success) return { error: 'Respuesta con formato inválido' };

  return { data: parsed.data };
}</code></pre>

<p>Contá las líneas: <b>una sola</b> habla con el modelo. Todo lo demás es ingeniería alrededor.
Ese es exactamente el punto de esta lección.</p>

<div class="aviso"><strong>Detalle que se pregunta seguido:</strong> fijate que el filtro por tenant está en el
paso 3, dentro de la búsqueda. Si lo hicieras después de recuperar, el modelo ya habría visto datos de otro
cliente — aunque no los muestres, ya se filtraron. <b>El aislamiento va en la consulta, nunca en el post-procesado.</b></div>
`,

      errores: [
        { mito: 'El prompt es el producto.',
          realidad: 'El prompt es la parte más visible y la más fácil de copiar. <b>Lo que nadie te puede copiar es tu contexto</b> ' +
                    '—tus datos, bien indexados y bien recuperados— y tu sistema de evaluación. Dos empresas con el mismo prompt y el ' +
                    'mismo modelo dan resultados muy distintos según qué le pegaron adelante.' },

        { mito: 'Si el modelo se equivoca, hay que mejorar el prompt.',
          realidad: 'Primero verificá <b>qué contexto recibió</b>. En la práctica la mayoría de los errores no son de redacción del prompt ' +
                    'sino de recuperación: el fragmento correcto no estaba entre los recuperados. Retocar el prompt cuando el problema es ' +
                    'de retrieval es perder días.' },

        { mito: 'Con que ande alcanza; los costos se ven después.',
          realidad: 'El registro de tokens y costo hay que ponerlo <b>desde la primera llamada</b>, no después. Sin eso no podés saber ' +
                    'qué feature te está costando plata, no podés cobrarle a un cliente por consumo, y te vas a enterar del problema ' +
                    'cuando llegue la factura. Es cinco minutos al principio y una semana de arqueología después.' },

        { mito: 'La interfaz de un producto con IA tiene que ser un chat.',
          realidad: 'El chat es la interfaz más difícil de todas: acepta cualquier entrada, así que tenés que manejar infinitos casos y ' +
                    'el usuario no sabe qué puede pedir. <b>Un botón que hace una cosa bien</b> suele dar más valor y es infinitamente ' +
                    'más fácil de evaluar. Usá chat cuando el problema realmente sea abierto.' },
      ],

      glosario: [
        { t: 'Orquestación', d: 'La lógica que decide qué llamadas se hacen, en qué orden, con qué reintentos y qué pasa ante un error.' },
        { t: 'Contexto', d: 'Todo el texto que le mandás al modelo en una llamada: instrucciones, datos recuperados, historial y pregunta.' },
        { t: 'Tool / herramienta', d: 'Función que le declarás al modelo y que él puede pedir que ejecutes. El modelo nunca ejecuta nada por su cuenta.' },
        { t: 'Guardrail', d: 'Control que limita lo que el sistema puede hacer o decir: presupuesto, validación de esquema, filtro de PII, moderación.' },
        { t: 'Observabilidad', d: 'Capacidad de ver qué pasó por dentro: trazas, tokens, costo, latencia y errores por request.' },
        { t: 'Traza (trace)', d: 'Registro completo de un request: cada llamada al modelo, cada tool, con sus entradas, salidas y tiempos.' },
        { t: 'PII', d: 'Personally Identifiable Information — datos que identifican a una persona. Hay que filtrarlos antes de mandarlos a un tercero.' },
        { t: 'Streaming', d: 'Devolver la respuesta token a token mientras se genera, en lugar de esperar a que esté completa.' },
        { t: 'Cost tracking', d: 'Registrar tokens de entrada y salida, y su costo en dinero, por request, feature y cliente.' },
        { t: 'Budget cap', d: 'Tope de gasto por cliente o por período que corta las llamadas antes de superarlo.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Las tres formas de que un modelo "sepa" algo',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> imaginate que contratás a alguien brillante, con
enorme cultura general, pero que <b>nunca vio tu empresa</b> y no se acuerda de nada de un día para el otro.
Tenés tres maneras de hacerlo útil.</div>

<h4>1 · Prompting — le explicás en el momento</h4>
<p>Le decís qué hacer, cómo, y le pasás la información necesaria pegada en el mensaje. Es hablarle.</p>
<ul>
<li><b>Cuesta:</b> nada extra.</li>
<li><b>Tarda:</b> el tiempo de escribirlo.</li>
<li><b>Sirve para:</b> casi todo. <b>Siempre se empieza acá.</b></li>
<li><b>Límite:</b> no le podés pegar tus 40.000 documentos en cada mensaje.</li>
</ul>

<h4>2 · RAG — le das acceso al archivo</h4>
<p>Antes de preguntarle, tu sistema <b>busca</b> los documentos relevantes y se los pega en el mensaje. El
modelo no "aprendió" nada: le acercaste la carpeta correcta justo antes de preguntar.</p>
<ul>
<li><b>Cuesta:</b> hay que construir la búsqueda (es el módulo 4 entero).</li>
<li><b>Sirve para:</b> que sepa cosas de tu negocio, cosas nuevas, cosas privadas.</li>
<li><b>Ventaja enorme:</b> actualizás un documento y el sistema ya responde distinto. Sin reentrenar nada.</li>
<li><b>Ventaja n°2:</b> podés mostrar <b>de dónde</b> sacó cada afirmación. Con fine-tuning eso es imposible.</li>
</ul>

<h4>3 · Fine-tuning — lo mandás a un curso</h4>
<p>Le mostrás miles de ejemplos de entrada y salida deseada, y ajustás los pesos del modelo para que adopte
ese <b>comportamiento</b>: un tono, un formato, una forma de clasificar.</p>
<ul>
<li><b>Cuesta:</b> plata, tiempo y un dataset de calidad (cientos o miles de ejemplos).</li>
<li><b>Sirve para:</b> consistencia de estilo o formato, tareas muy repetitivas, o hacer que un modelo chico y barato iguale a uno grande en <i>una</i> tarea.</li>
<li><b>Trampa:</b> cada vez que cambie la información, hay que reentrenar. Y no podés citar fuentes.</li>
</ul>

<div class="aviso"><strong>La regla de oro, y es literalmente una pregunta de entrevista:</strong><br>
<b>RAG es para conocimiento. Fine-tuning es para comportamiento.</b><br>
Si querés que sepa <i>qué</i>, es RAG. Si querés cambiar <i>cómo</i> responde, es fine-tuning.</div>

<h4>El orden en que se prueban</h4>
<p>Siempre el mismo, y saltearse pasos es la forma más común de quemar meses:</p>
<ol>
<li><b>Mejor prompt.</b> Gratis, inmediato. Resuelve más casos de los que uno cree.</li>
<li><b>Prompt + ejemplos</b> dentro del mismo mensaje (<i>few-shot</i>).</li>
<li><b>RAG.</b> Cuando el problema es que le falta información.</li>
<li><b>Fine-tuning.</b> Solo cuando lo anterior no alcanza y tenés datos y evaluación.</li>
</ol>
`,

      tecnico: `
<table>
<tr><th></th><th>Prompting</th><th>RAG</th><th>Fine-tuning</th></tr>
<tr><td><b>Qué modifica</b></td><td>La entrada</td><td>La entrada (con datos recuperados)</td><td>Los pesos del modelo</td></tr>
<tr><td><b>Resuelve</b></td><td>Instrucción, formato, tono básico</td><td>Falta de conocimiento</td><td>Comportamiento, estilo, formato estricto</td></tr>
<tr><td><b>Costo inicial</b></td><td>Nulo</td><td>Medio (ingesta + índice)</td><td>Alto (dataset + entrenamiento)</td></tr>
<tr><td><b>Costo por request</b></td><td>Bajo</td><td>Medio (más tokens de entrada)</td><td>Bajo (permite modelo más chico)</td></tr>
<tr><td><b>Actualizar datos</b></td><td>Editar el prompt</td><td>Reindexar el documento (minutos)</td><td>Reentrenar (horas o días)</td></tr>
<tr><td><b>Citar fuentes</b></td><td>No aplica</td><td><b>Sí</b></td><td><b>No</b></td></tr>
<tr><td><b>Riesgo de alucinación</b></td><td>Alto</td><td>Bajo si el retrieval es bueno</td><td>Alto (puede sonar aún más seguro)</td></tr>
<tr><td><b>Latencia</b></td><td>Base</td><td>Base + búsqueda (~50-200 ms)</td><td>Menor si bajás de tamaño de modelo</td></tr>
</table>

<h4>Una cuarta opción: contexto largo</h4>
<p>Con ventanas de 200K tokens o más, a veces conviene <b>meter el documento entero</b> en vez de armar un RAG.
Se lo llama <i>context stuffing</i>.</p>
<ul>
<li><b>Conviene</b> cuando el corpus es chico y estable (un manual, un contrato, un código base acotado), sobre todo con <i>prompt caching</i> activado: el costo de los tokens cacheados baja muchísimo.</li>
<li><b>No conviene</b> cuando el corpus es grande o cambia seguido: pagás todos los tokens en cada llamada, la latencia crece, y aparece el efecto <i>lost in the middle</i> — la información que queda en el medio de un contexto muy largo se atiende peor que la del principio o el final.</li>
</ul>

<h4>Variantes de fine-tuning</h4>
<ul>
<li><b>Full fine-tuning:</b> se ajustan todos los parámetros. Carísimo, casi nadie lo hace fuera de laboratorios.</li>
<li><b>LoRA / QLoRA:</b> <i>Low-Rank Adaptation</i>. Se congela el modelo y se entrenan matrices adicionales pequeñas. Es lo que se usa en la práctica: mucho más barato y los adaptadores pesan megabytes en vez de gigabytes.</li>
<li><b>Destilación:</b> usar un modelo grande para generar ejemplos con los que entrenar uno chico. Muy usado para bajar costo y latencia manteniendo calidad en una tarea puntual.</li>
</ul>

<h4>Se combinan</h4>
<p>No son excluyentes. Un sistema maduro suele tener <b>fine-tuning para el formato y el tono</b> y
<b>RAG para los hechos</b>: el modelo afinado sabe <i>cómo</i> tiene que contestar, y el retrieval le dice
<i>qué</i> contestar. Combinado con un buen prompt, es el estándar de la industria.</p>

<div class="dato"><strong>Criterio para decidir el fine-tuning:</strong> si no tenés al menos unos cientos de
ejemplos de calidad <b>y</b> un conjunto de evaluación para saber si mejoraste, no estás en condiciones de
afinar. Sin evals, el fine-tuning es fe.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 430" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="f3" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
    <path d="M0,0 L7,3.2 L0,6.4 z" fill="currentColor" opacity=".5"/></marker></defs>

  <rect x="210" y="14" width="260" height="42" rx="10" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="340" y="40" text-anchor="middle" fill="currentColor" font-size="13.5" font-weight="700">El modelo no responde bien</text>

  <line x1="340" y1="56" x2="340" y2="82" stroke="currentColor" opacity=".5" stroke-width="1.5" marker-end="url(#f3)"/>

  <rect x="180" y="86" width="320" height="46" rx="10" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="1.4"/>
  <text x="340" y="107" text-anchor="middle" fill="currentColor" font-size="12.5" font-weight="600">¿Le falta INFORMACIÓN</text>
  <text x="340" y="124" text-anchor="middle" fill="currentColor" font-size="12.5" font-weight="600">o le falta FORMA de responder?</text>

  <line x1="230" y1="132" x2="150" y2="176" stroke="currentColor" opacity=".5" stroke-width="1.5" marker-end="url(#f3)"/>
  <line x1="450" y1="132" x2="530" y2="176" stroke="currentColor" opacity=".5" stroke-width="1.5" marker-end="url(#f3)"/>
  <text x="150" y="158" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">información</text>
  <text x="536" y="158" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">forma</text>

  <rect x="24" y="182" width="290" height="88" rx="12" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.5"/>
  <text x="42" y="206" fill="#34d399" font-size="13.5" font-weight="700">¿Cabe en el prompt?</text>
  <text x="42" y="228" fill="currentColor" opacity=".7" font-size="11.5">SÍ, y es estable  →  pegalo entero</text>
  <text x="42" y="246" fill="currentColor" opacity=".7" font-size="11.5">(context stuffing + prompt caching)</text>
  <text x="42" y="264" fill="currentColor" opacity=".7" font-size="11.5">NO, o cambia seguido  →  RAG</text>

  <rect x="366" y="182" width="290" height="88" rx="12" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="384" y="206" fill="#fbbf24" font-size="13.5" font-weight="700">¿Probaste el prompt a fondo?</text>
  <text x="384" y="228" fill="currentColor" opacity=".7" font-size="11.5">NO  →  mejor prompt + few-shot</text>
  <text x="384" y="246" fill="currentColor" opacity=".7" font-size="11.5">SÍ, y tenés dataset + evals</text>
  <text x="384" y="264" fill="currentColor" opacity=".7" font-size="11.5">      →  fine-tuning (LoRA)</text>

  <rect x="24" y="298" width="632" height="52" rx="12" fill="#7c5cff" fill-opacity=".08" stroke="#7c5cff" stroke-width="1.5" stroke-dasharray="5 4"/>
  <text x="340" y="320" text-anchor="middle" fill="#7c5cff" font-size="13.5" font-weight="700">RAG es para CONOCIMIENTO  ·  Fine-tuning es para COMPORTAMIENTO</text>
  <text x="340" y="340" text-anchor="middle" fill="currentColor" opacity=".6" font-size="11.5">se combinan: afinás el tono y el formato, recuperás los hechos</text>

  <text x="340" y="380" text-anchor="middle" fill="currentColor" opacity=".5" font-size="11.5" font-weight="600">ORDEN DE PRUEBA</text>
  <text x="340" y="402" text-anchor="middle" fill="currentColor" opacity=".7" font-size="12">prompt  →  few-shot  →  RAG  →  fine-tuning</text>
  <text x="340" y="420" text-anchor="middle" fill="currentColor" opacity=".45" font-size="11">saltear pasos es la forma más común de perder meses</text>
</svg>`,
        pie: 'Árbol de decisión. La pregunta de arriba es la única que importa: ¿le falta información o le falta forma?',
      },

      entrevista: [
        { p: '¿Cuándo usarías RAG y cuándo fine-tuning?',
          r: 'La regla es <b>RAG para conocimiento, fine-tuning para comportamiento</b>. Si el modelo no sabe algo —datos de mi empresa, ' +
             'información posterior a su entrenamiento, documentos privados— eso es RAG, porque el conocimiento cambia y necesito poder ' +
             'actualizarlo sin reentrenar y poder citar la fuente. Si el modelo sabe la respuesta pero no la da en el formato o el tono que ' +
             'necesito de forma consistente, y ya agoté el prompting, ahí sí fine-tuning. En la práctica <b>se combinan</b>: fine-tuning para el ' +
             'formato, RAG para los hechos.' },

        { p: 'Un cliente quiere "entrenar un modelo con los documentos de su empresa". ¿Qué le decís?',
          r: 'Que casi seguro lo que necesita es RAG, no entrenamiento. Es el malentendido más común. El fine-tuning no es un buen mecanismo ' +
             'para incorporar hechos: hace falta muchísimo dato para que un hecho puntual se fije, no hay forma de citar la fuente, y cada ' +
             'documento nuevo obliga a reentrenar. <b>Con RAG, agregar un documento es indexarlo</b> —minutos— y la respuesta puede mostrar de ' +
             'dónde salió, que en un contexto empresarial suele ser un requisito y no un lujo.' },

        { p: 'Con ventanas de contexto de 200K tokens, ¿RAG no quedó obsoleto?',
          r: 'No, aunque cambió el umbral. Para corpus chicos y estables hoy conviene meter todo en contexto, sobre todo con <i>prompt caching</i>. ' +
             'Pero RAG sigue siendo necesario por tres motivos: <b>costo</b> —pagás todos los tokens en cada llamada, y con volumen eso no cierra—; ' +
             '<b>escala</b>, porque 200K tokens son unas 500 páginas y una empresa tiene mucho más que eso; y <b>calidad</b>, por el efecto ' +
             '<i>lost in the middle</i>: el contenido en el medio de un contexto larguísimo se atiende peor que un fragmento corto y bien elegido. ' +
             'Se volvieron complementarios: RAG recupera menos fragmentos pero mejores, y el contexto largo perdona un retrieval imperfecto.' },

        { p: '¿Qué necesitás antes de hacer fine-tuning?',
          r: 'Tres cosas, y si falta alguna no arrancaría. <b>Un dataset de calidad</b>, de al menos algunos cientos de ejemplos representativos ' +
             '—la calidad importa más que la cantidad—. <b>Un conjunto de evaluación separado</b>, porque sin medir no hay forma de saber si mejoré ' +
             'o si simplemente sobreajusté. Y <b>haber agotado el prompting</b>, para tener una línea base contra la cual comparar. ' +
             'Fine-tuning sin evals es fe, no ingeniería.' },
      ],

      practica: `
<h4>Casos reales y qué corresponde en cada uno</h4>

<table>
<tr><th>Situación</th><th>Solución</th><th>Por qué</th></tr>
<tr><td>"Que conteste preguntas sobre nuestro manual de 300 páginas"</td><td>RAG (o contexto largo si es estable)</td><td>Conocimiento. Además se necesita citar la sección de origen.</td></tr>
<tr><td>"Que escriba siempre en el tono de nuestra marca"</td><td>Prompting con ejemplos; fine-tuning si no alcanza</td><td>Comportamiento. Probá primero con 3-5 ejemplos en el prompt.</td></tr>
<tr><td>"Que sepa el stock actual"</td><td>Tool calling, no RAG</td><td>Es un dato que cambia por minuto: se consulta en vivo, no se indexa.</td></tr>
<tr><td>"Que clasifique 200.000 tickets por día en 12 categorías"</td><td>Fine-tuning de un modelo chico</td><td>Volumen alto y tarea acotada: afinar un modelo barato baja el costo uno o dos órdenes de magnitud.</td></tr>
<tr><td>"Que responda con la política de devoluciones vigente"</td><td>RAG</td><td>Cambia cada tanto y hay que poder actualizarla sin tocar el modelo.</td></tr>
<tr><td>"Que devuelva siempre un JSON con estos 8 campos"</td><td>Salida estructurada, no fine-tuning</td><td>Los modelos actuales ya lo garantizan con un esquema. Afinar para esto es matar una mosca a cañonazos.</td></tr>
</table>

<div class="aviso"><strong>Distinción que se pasa por alto:</strong> <b>RAG es para datos que cambian poco</b>
(documentos, políticas, historia). <b>Tool calling es para datos que cambian todo el tiempo</b> (stock, precios,
estado de un pedido). Indexar el stock en una base vectorial es un error de diseño: para cuando lo buscás ya
está viejo. Esa diferencia aparece seguido en entrevistas.</div>
`,

      errores: [
        { mito: 'Hago fine-tuning para que el modelo aprenda sobre mi empresa.',
          realidad: '<b>El error número uno del rubro.</b> El fine-tuning ajusta comportamiento, no memoriza hechos de forma confiable. ' +
                    'Te va a salir caro, no vas a poder citar fuentes, cada dato nuevo exige reentrenar, y encima el modelo puede afirmar cosas ' +
                    'incorrectas con más seguridad que antes. Para conocimiento propio: <b>RAG</b>.' },

        { mito: 'RAG es viejo, ahora todo entra en el contexto.',
          realidad: 'Con corpus chicos y estables, sí conviene meter todo. Pero 200K tokens son unas 500 páginas, y pagás <b>todos</b> esos tokens ' +
                    'en cada llamada. Con volumen, la cuenta no cierra. Además está el <i>lost in the middle</i>: la información enterrada en el medio ' +
                    'de un contexto enorme se atiende peor que un fragmento corto bien elegido.' },

        { mito: 'RAG y fine-tuning son alternativas: elegís una.',
          realidad: 'Son <b>ortogonales</b> y los sistemas maduros usan las dos. El fine-tuning define <i>cómo</i> responde ' +
                    '(formato, tono, estructura); el RAG define <i>qué</i> responde (los hechos). Presentarlas como excluyentes en una entrevista ' +
                    'delata que solo se leyó el titular.' },

        { mito: 'Indexo todo en la base vectorial y listo.',
          realidad: 'Los datos volátiles —stock, precios, estado de un pedido, saldo— <b>no van en un índice vectorial</b>. Para cuando los ' +
                    'recuperás ya están desactualizados. Eso se resuelve con <b>tool calling</b>: el modelo pide el dato y vos lo consultás en vivo.' },
      ],

      glosario: [
        { t: 'Prompting', d: 'Darle instrucciones y datos al modelo dentro del mensaje. La forma más barata y siempre el primer intento.' },
        { t: 'RAG', d: 'Retrieval-Augmented Generation. Buscar información relevante y agregarla al prompt antes de generar la respuesta.' },
        { t: 'Fine-tuning', d: 'Continuar el entrenamiento de un modelo con ejemplos propios para ajustar su comportamiento.' },
        { t: 'LoRA', d: 'Low-Rank Adaptation. Técnica de fine-tuning que congela el modelo y entrena matrices pequeñas adicionales. Mucho más barata.' },
        { t: 'Destilación', d: 'Usar un modelo grande para generar datos con los que entrenar uno chico, buscando calidad similar a menor costo.' },
        { t: 'Context stuffing', d: 'Meter documentos enteros en el prompt aprovechando ventanas de contexto grandes, en lugar de recuperar fragmentos.' },
        { t: 'Lost in the middle', d: 'Fenómeno por el cual el modelo atiende peor la información ubicada en el medio de un contexto muy largo.' },
        { t: 'Few-shot', d: 'Incluir algunos ejemplos de entrada y salida deseada dentro del prompt para fijar formato y estilo.' },
        { t: 'Prompt caching', d: 'Reutilizar la parte fija de un prompt entre llamadas, reduciendo mucho el costo y la latencia de esos tokens.' },
        { t: 'Sobreajuste (overfitting)', d: 'Cuando el modelo memoriza los ejemplos de entrenamiento y empeora frente a casos nuevos.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'El vocabulario de las ofertas laborales',
      minutos: 8,

      simple: `
<div class="analogia"><strong>Para qué es esta lección:</strong> para que puedas leer una oferta de trabajo de
punta a punta <b>sin googlear cada renglón</b>, y para reconocer cuándo una oferta está bien escrita y cuándo
la escribió alguien que pegó palabras de moda.</div>

<p>No hace falta que domines todos estos términos ahora — el resto del track los desarrolla. Lo que sí conviene
es que ninguno te resulte completamente desconocido.</p>

<h4>Lo que dice la oferta → lo que quiere decir</h4>

<table>
<tr><th>Dice</th><th>Quiere decir</th></tr>
<tr><td>"Experiencia con LLMs"</td><td>Usaste la API de un modelo en algo real, no solo el chat web.</td></tr>
<tr><td>"Experiencia con RAG"</td><td>Construiste búsqueda sobre documentos propios: indexar, buscar, armar el prompt.</td></tr>
<tr><td>"Vector databases"</td><td>Usaste pgvector, Pinecone, Qdrant o Weaviate para buscar por significado.</td></tr>
<tr><td>"Prompt engineering"</td><td>Sabés escribir instrucciones que funcionan de forma consistente, no una vez.</td></tr>
<tr><td>"Agentic systems"</td><td>Sistemas donde el modelo decide qué acciones ejecutar, en un bucle.</td></tr>
<tr><td>"Function / tool calling"</td><td>Le declaraste funciones al modelo y manejaste el ciclo de llamada y respuesta.</td></tr>
<tr><td>"LangChain / LangGraph"</td><td>Usaste un framework de orquestación. LangGraph es el moderno: grafos de estado.</td></tr>
<tr><td>"Evals"</td><td><b>Señal de madurez.</b> Miden si el sistema funciona; no van a ciegas.</td></tr>
<tr><td>"Guardrails"</td><td>Les importa la seguridad y el control de lo que el sistema puede decir o hacer.</td></tr>
<tr><td>"Observability / tracing"</td><td>Tienen el sistema en producción de verdad y lo monitorean.</td></tr>
<tr><td>"Fine-tuning"</td><td>Ojo: a veces querían decir RAG. Vale preguntar a qué se refieren.</td></tr>
<tr><td>"Multimodal"</td><td>Imágenes, audio o video además de texto.</td></tr>
<tr><td>"MCP"</td><td>Model Context Protocol: el estándar para conectar herramientas a modelos. Muy nuevo, buena señal.</td></tr>
</table>

<div class="aviso"><strong>Cómo leer una oferta:</strong> si menciona <b>evals</b>, <b>observabilidad</b> o
<b>costos</b>, esa gente puso algo en producción y sabe lo que duele. Si solo dice "LLM, RAG, LangChain,
agentes", puede ser un equipo experimentado… o un demo con nombre de producto. <b>Preguntá en la entrevista
cómo miden si el sistema funciona</b> — la respuesta te dice todo.</div>
`,

      tecnico: `
<p>Agrupados por área, como los vas a ver en un diagrama de arquitectura o en una descripción de puesto seria.</p>

<h4>Modelo e inferencia</h4>
<ul>
<li><b>Token</b> — unidad mínima de texto que procesa el modelo. Se factura por token.</li>
<li><b>Context window</b> — cuántos tokens entran en una llamada (entrada + salida).</li>
<li><b>Temperature / top-p</b> — parámetros de muestreo que controlan cuán determinista es la salida.</li>
<li><b>Latencia / TTFT</b> — <i>time to first token</i>: cuánto tarda en empezar a responder. Distinto del tiempo total.</li>
<li><b>Streaming</b> — devolver la respuesta token a token mientras se genera.</li>
<li><b>Quantization</b> — reducir la precisión numérica de los pesos para que el modelo entre en menos memoria.</li>
<li><b>Self-hosted vs API</b> — correr el modelo vos (vLLM, Ollama) o consumirlo de un proveedor.</li>
</ul>

<h4>Contexto y recuperación</h4>
<ul>
<li><b>Embedding</b> — representación numérica del significado de un texto.</li>
<li><b>Vector database</b> — base optimizada para buscar por cercanía entre embeddings.</li>
<li><b>Chunking</b> — partir documentos en fragmentos indexables.</li>
<li><b>Semantic search</b> — buscar por significado en vez de por coincidencia de palabras.</li>
<li><b>Hybrid search</b> — combinar búsqueda vectorial con búsqueda por palabra clave (BM25).</li>
<li><b>Re-ranking</b> — reordenar los resultados recuperados con un modelo más preciso pero más lento.</li>
<li><b>Top-k</b> — cuántos fragmentos se recuperan por consulta.</li>
</ul>

<h4>Comportamiento y orquestación</h4>
<ul>
<li><b>System prompt</b> — instrucciones persistentes que definen el rol y las reglas del modelo.</li>
<li><b>Few-shot</b> — ejemplos dentro del prompt.</li>
<li><b>Chain-of-thought</b> — pedirle que razone paso a paso antes de responder.</li>
<li><b>Structured output</b> — forzar que la salida cumpla un esquema JSON.</li>
<li><b>Tool / function calling</b> — el modelo solicita la ejecución de funciones declaradas.</li>
<li><b>Agent</b> — bucle donde el modelo decide acciones, observa resultados y vuelve a decidir.</li>
<li><b>MCP</b> — Model Context Protocol: estándar abierto para exponer herramientas y datos a un modelo.</li>
<li><b>Human-in-the-loop</b> — puntos donde el sistema se detiene y pide aprobación humana.</li>
</ul>

<h4>Calidad, costo y seguridad</h4>
<ul>
<li><b>Hallucination</b> — el modelo afirma algo falso con total seguridad.</li>
<li><b>Evals</b> — pruebas automatizadas sobre la calidad de las salidas.</li>
<li><b>LLM-as-judge</b> — usar un modelo para puntuar las respuestas de otro.</li>
<li><b>Golden dataset</b> — conjunto de casos con respuesta correcta conocida, usado como referencia.</li>
<li><b>Guardrails</b> — controles sobre entrada y salida.</li>
<li><b>Prompt injection</b> — ataque donde el contenido que el modelo lee reescribe sus instrucciones.</li>
<li><b>Jailbreak</b> — lograr que el modelo eluda sus restricciones.</li>
<li><b>Tracing</b> — registro detallado de cada paso de una ejecución.</li>
<li><b>Token accounting / cost tracking</b> — atribuir tokens y dinero por request, feature y cliente.</li>
</ul>

<div class="dato"><strong>Cómo estudiar esta lista:</strong> no la memorices ahora. Volvé acá al terminar cada
módulo y fijate cuántos términos ya podés explicar <b>en voz alta y sin leer</b>. Ese es el indicador real de
si el track te está sirviendo — y es exactamente lo que te van a pedir en una entrevista.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <rect x="18" y="16" width="316" height="176" rx="14" fill="#fbbf24" fill-opacity=".08" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="36" y="42" fill="#fbbf24" font-size="13.5" font-weight="700">MODELO E INFERENCIA</text>
  <text x="36" y="66" fill="currentColor" opacity=".72" font-size="11.5">token · context window · temperature</text>
  <text x="36" y="86" fill="currentColor" opacity=".72" font-size="11.5">streaming · TTFT · latencia</text>
  <text x="36" y="106" fill="currentColor" opacity=".72" font-size="11.5">quantization · self-hosted vs API</text>
  <text x="36" y="132" fill="currentColor" opacity=".42" font-size="11">→ módulos 1 y 2</text>

  <rect x="346" y="16" width="316" height="176" rx="14" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.5"/>
  <text x="364" y="42" fill="#34d399" font-size="13.5" font-weight="700">CONTEXTO Y RECUPERACIÓN</text>
  <text x="364" y="66" fill="currentColor" opacity=".72" font-size="11.5">embedding · vector database · chunking</text>
  <text x="364" y="86" fill="currentColor" opacity=".72" font-size="11.5">semantic search · hybrid search</text>
  <text x="364" y="106" fill="currentColor" opacity=".72" font-size="11.5">re-ranking · top-k · RAG</text>
  <text x="364" y="132" fill="currentColor" opacity=".42" font-size="11">→ módulos 3 y 4</text>

  <rect x="18" y="206" width="316" height="176" rx="14" fill="#7c5cff" fill-opacity=".08" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="36" y="232" fill="#7c5cff" font-size="13.5" font-weight="700">COMPORTAMIENTO Y ORQUESTACIÓN</text>
  <text x="36" y="256" fill="currentColor" opacity=".72" font-size="11.5">system prompt · few-shot · chain-of-thought</text>
  <text x="36" y="276" fill="currentColor" opacity=".72" font-size="11.5">structured output · tool calling · agent</text>
  <text x="36" y="296" fill="currentColor" opacity=".72" font-size="11.5">LangGraph · MCP · human-in-the-loop</text>
  <text x="36" y="322" fill="currentColor" opacity=".42" font-size="11">→ módulos 6 y 7</text>

  <rect x="346" y="206" width="316" height="176" rx="14" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.5"/>
  <text x="364" y="232" fill="#f87171" font-size="13.5" font-weight="700">CALIDAD, COSTO Y SEGURIDAD</text>
  <text x="364" y="256" fill="currentColor" opacity=".72" font-size="11.5">hallucination · evals · LLM-as-judge</text>
  <text x="364" y="276" fill="currentColor" opacity=".72" font-size="11.5">golden dataset · guardrails · tracing</text>
  <text x="364" y="296" fill="currentColor" opacity=".72" font-size="11.5">prompt injection · cost tracking</text>
  <text x="364" y="322" fill="currentColor" opacity=".42" font-size="11">→ módulos 5 y 8</text>

  <text x="340" y="366" text-anchor="middle" fill="currentColor" opacity=".5" font-size="11.5">
    Si una oferta solo menciona el cuadrante violeta, probablemente sea un demo.</text>
</svg>`,
        pie: 'Los cuatro grupos en los que cae cualquier término que veas en una oferta de AI Engineer.',
      },

      entrevista: [
        { p: '¿Qué experiencia tenés con sistemas de IA?',
          r: 'Conviene responder <b>por capas del sistema, no por lista de herramientas</b>. Algo así: "Construí una funcionalidad que hace X. ' +
             'El contexto lo recupero con búsqueda vectorial sobre Postgres con pgvector, filtrando por tenant. Registro tokens y costo por request ' +
             'para poder ponerle un tope mensual a cada cliente. Los casos que tardan mucho van a una cola en vez de bloquear al usuario." ' +
             'Eso muestra criterio de ingeniería. Enumerar "usé LangChain y Pinecone" muestra que seguiste un tutorial.' },

        { p: '¿Qué preguntarías vos en una entrevista para saber si el equipo está maduro?',
          r: 'Una sola pregunta alcanza: <b>"¿cómo miden si el sistema está funcionando bien?"</b>. Si tienen un conjunto de evaluación, casos ' +
             'de referencia y detectan regresiones al cambiar un prompt, es un equipo serio. Si la respuesta es "lo probamos a ojo" o "si el ' +
             'cliente se queja", el sistema está en modo demo. La segunda buena pregunta es cuánto les cuesta por request y si lo pueden atribuir por cliente.' },
      ],

      practica: `
<h4>Autoevaluación honesta</h4>
<p>Recorré esta lista en voz alta. Por cada término, decí una frase que lo explique. Si tenés que leer,
todavía no lo sabés — y en una entrevista se nota inmediatamente.</p>

<table>
<tr><th>Término</th><th>Podés explicarlo sin leer</th></tr>
<tr><td>token</td><td>☐</td></tr>
<tr><td>context window</td><td>☐</td></tr>
<tr><td>embedding</td><td>☐</td></tr>
<tr><td>RAG</td><td>☐</td></tr>
<tr><td>chunking</td><td>☐</td></tr>
<tr><td>hybrid search</td><td>☐</td></tr>
<tr><td>re-ranking</td><td>☐</td></tr>
<tr><td>tool calling</td><td>☐</td></tr>
<tr><td>agente</td><td>☐</td></tr>
<tr><td>eval</td><td>☐</td></tr>
<tr><td>prompt injection</td><td>☐</td></tr>
<tr><td>MCP</td><td>☐</td></tr>
</table>

<div class="aviso"><strong>Volvé a esta tabla al terminar cada módulo.</strong> El track está diseñado para que
al final puedas tildar las doce. Esa es la meta concreta: no leer doce definiciones, sino poder explicarlas
mirando a alguien a los ojos.</div>
`,

      errores: [
        { mito: 'Hay que saber todos estos términos antes de empezar a construir.',
          realidad: 'Al revés. <b>Se aprenden construyendo.</b> Un término que nombra algo que ya te pasó se te queda para siempre; ' +
                    'uno que memorizaste de una lista se evapora en una semana. Esta lección es un mapa para orientarte, no un examen de entrada.' },

        { mito: 'Si la oferta pide LangChain, necesito LangChain.',
          realidad: 'Lo que en realidad piden es que sepas <b>orquestar</b>: encadenar llamadas, manejar estado, controlar errores y reintentos. ' +
                    'El framework se aprende en un día si entendés el problema que resuelve. Muchos equipos serios usan el SDK directo justamente ' +
                    'porque el framework les agregaba capas que no necesitaban.' },

        { mito: 'Usar palabras técnicas hace que suenes más experto.',
          realidad: 'Suele pasar lo contrario. <b>Explicar un concepto complejo en palabras simples es la señal más fuerte de que lo entendés.</b> ' +
                    'Quien se esconde detrás del vocabulario técnico casi siempre está tapando un hueco, y un entrevistador con experiencia lo detecta ' +
                    'con una repregunta.' },
      ],

      glosario: [
        { t: 'AI Engineer', d: 'Rol que construye productos sobre modelos preentrenados: integración, orquestación, evaluación, costo y seguridad.' },
        { t: 'TTFT', d: 'Time To First Token. Cuánto tarda el modelo en empezar a responder. Es lo que percibe el usuario, distinto del tiempo total.' },
        { t: 'Top-k', d: 'Cantidad de fragmentos que se recuperan en una búsqueda antes de armar el prompt.' },
        { t: 'BM25', d: 'Algoritmo clásico de búsqueda por palabras clave. Se combina con búsqueda vectorial en la búsqueda híbrida.' },
        { t: 'Quantization', d: 'Reducir la precisión numérica de los pesos (de 16 a 4 bits, por ejemplo) para que el modelo ocupe menos memoria.' },
        { t: 'vLLM', d: 'Motor de inferencia de alto rendimiento para servir modelos abiertos en infraestructura propia.' },
        { t: 'Jailbreak', d: 'Técnica para lograr que un modelo eluda sus restricciones de seguridad.' },
        { t: 'Prompt injection', d: 'Ataque donde texto leído por el modelo (una web, un documento) contiene instrucciones que intentan reemplazar las tuyas.' },
        { t: 'Human-in-the-loop', d: 'Diseño donde el sistema se detiene y pide confirmación humana antes de una acción sensible.' },
        { t: 'Golden dataset', d: 'Conjunto de casos con respuesta correcta conocida, usado como referencia para medir la calidad del sistema.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál de estas afirmaciones es correcta?',
      opciones: [
        'Todo LLM es deep learning, y todo deep learning es machine learning',
        'Todo machine learning es deep learning',
        'La IA y el machine learning son lo mismo',
        'Los LLM son un tipo de IA que no usa machine learning',
      ],
      correcta: 0,
      porQue: 'Son círculos concéntricos: IA ⊃ machine learning ⊃ deep learning ⊃ LLM. La inclusión va en una sola dirección.',
      porQueNo: {
        1: 'Al revés: el deep learning es una rama del ML. Un árbol de decisión es ML y no es deep learning.',
        2: 'La IA incluye enfoques sin aprendizaje, como los motores de reglas o los algoritmos de búsqueda.',
        3: 'Un LLM es una red neuronal profunda entrenada con datos: es machine learning por definición.',
      },
    },
    {
      p: '¿Qué invierte el machine learning respecto de la programación tradicional?',
      opciones: [
        'Recibe datos y respuestas, y devuelve las reglas',
        'Recibe reglas y datos, y devuelve respuestas',
        'Elimina la necesidad de tener datos',
        'Reemplaza el código por consultas a una base de datos',
      ],
      correcta: 0,
      porQue: 'Esa inversión es la definición operativa del ML: en vez de escribir las reglas, se las deducís mostrando ejemplos junto con sus respuestas correctas.',
      porQueNo: {
        1: 'Ese es exactamente el esquema de la programación tradicional.',
        2: 'El ML necesita más datos que la programación clásica, no menos.',
        3: 'La forma de almacenar los datos no tiene relación con el paradigma de aprendizaje.',
      },
    },
    {
      p: 'Un modelo que genera imágenes a partir de texto es…',
      opciones: [
        'IA generativa, pero no un LLM',
        'Un LLM, porque recibe texto',
        'Machine learning clásico',
        'Ni IA generativa ni deep learning',
      ],
      correcta: 0,
      porQue: 'IA generativa es una categoría definida por la salida: produce contenido nuevo. Un LLM, en cambio, es un tipo específico de modelo cuya salida es texto.',
      porQueNo: {
        1: 'Recibir texto no lo convierte en LLM; lo que define al LLM es ser un transformer de gran escala que modela y genera lenguaje.',
        2: 'Es deep learning generativo, no un modelo clásico tipo regresión o árboles.',
        3: 'Es ambas cosas: es deep learning y es generativo.',
      },
    },
    {
      p: '¿Cuál es el aporte central de la arquitectura transformer?',
      opciones: [
        'El mecanismo de atención, que conecta cualquier token con cualquier otro y permite procesar en paralelo',
        'Reducir la cantidad de parámetros necesarios',
        'Permitir entrenar sin ningún tipo de datos',
        'Eliminar la necesidad de usar GPU',
      ],
      correcta: 0,
      porQue: 'La atención resolvió los dos límites de las redes recurrentes: no se podía paralelizar el entrenamiento, y se perdía información a larga distancia.',
      porQueNo: {
        1: 'Al contrario: los transformers habilitaron modelos con órdenes de magnitud más parámetros.',
        2: 'Siguen requiriendo corpus enormes de texto.',
        3: 'Justamente aprovechan mejor la GPU al permitir procesamiento paralelo.',
      },
    },
    {
      p: 'En un producto con IA en producción, ¿qué proporción del código suele ser la llamada al modelo?',
      opciones: [
        'Una porción muy chica: la mayor parte es contexto, validación, medición y control de costos',
        'Alrededor de la mitad',
        'Casi todo: el resto es solo interfaz',
        'Depende del modelo elegido',
      ],
      correcta: 0,
      porQue: 'La llamada es una función. El producto son las capas alrededor: autenticación y tenant, presupuesto, recuperación de contexto, validación de salida y registro de uso.',
      porQueNo: {
        1: 'Muy por encima de la realidad: la orquestación y el contexto pesan mucho más.',
        2: 'Ese es el modelo mental de un demo, y es exactamente lo que rompe al llegar a producción.',
        3: 'La proporción no cambia según el proveedor: las capas necesarias son las mismas.',
      },
    },
    {
      p: '¿Por qué no conviene llamar al modelo directamente desde el navegador?',
      opciones: [
        'Expone la API key, impide limitar costos, no permite autorizar el acceso a los datos y elimina la observabilidad',
        'Porque los modelos no aceptan peticiones desde el navegador',
        'Porque la latencia sería mayor',
        'Solo por una cuestión de organización del código',
      ],
      correcta: 0,
      porQue: 'Son cuatro problemas simultáneos, y el de la clave expuesta es el más grave: cualquiera puede leerla y gastar tu saldo.',
      porQueNo: {
        1: 'Técnicamente se puede: el problema es de seguridad y control, no de compatibilidad.',
        2: 'La latencia podría incluso ser menor. No es el motivo.',
        3: 'Es un problema de seguridad y de costos, no de prolijidad.',
      },
    },
    {
      p: 'Un cliente quiere que el modelo conozca sus 5.000 documentos internos, que se actualizan cada semana. ¿Qué corresponde?',
      opciones: [
        'RAG',
        'Fine-tuning con los documentos',
        'Reentrenar un modelo desde cero',
        'Pegar todos los documentos en el system prompt',
      ],
      correcta: 0,
      porQue: 'RAG es para conocimiento. Además permite actualizar un documento reindexándolo en minutos y, sobre todo, poder citar la fuente de cada afirmación.',
      porQueNo: {
        1: 'El fine-tuning ajusta comportamiento, no memoriza hechos de forma confiable. Con actualización semanal sería insostenible y no podrías citar fuentes.',
        2: 'Cuesta millones de dólares y no resuelve el problema.',
        3: 'No entran en la ventana de contexto, y aunque entraran pagarías todos esos tokens en cada llamada.',
      },
    },
    {
      p: 'La regla que resume cuándo usar cada técnica es:',
      opciones: [
        'RAG para conocimiento, fine-tuning para comportamiento',
        'RAG para comportamiento, fine-tuning para conocimiento',
        'Fine-tuning siempre que haya presupuesto',
        'RAG para texto, fine-tuning para imágenes',
      ],
      correcta: 0,
      porQue: 'Si el problema es que le falta información, es RAG. Si el problema es cómo responde —formato, tono, estructura—, es fine-tuning. En sistemas maduros se combinan.',
      porQueNo: {
        1: 'Está invertida, y es exactamente el error más común del rubro.',
        2: 'El fine-tuning sin dataset de calidad ni evaluación empeora las cosas, tengas el presupuesto que tengas.',
        3: 'La distinción no tiene nada que ver con la modalidad del dato.',
      },
    },
    {
      p: 'Necesitás que el modelo conozca el stock actual de un producto, que cambia cada minuto. ¿Qué usás?',
      opciones: [
        'Tool calling: el modelo pide el dato y tu sistema lo consulta en vivo',
        'RAG: indexar el stock en una base vectorial',
        'Fine-tuning con los datos de stock',
        'Pegar la tabla completa de stock en el system prompt',
      ],
      correcta: 0,
      porQue: 'Los datos volátiles se consultan en el momento. Un índice vectorial siempre estaría desactualizado, y esta distinción entre RAG y tools aparece seguido en entrevistas.',
      porQueNo: {
        1: 'Para cuando recuperás el fragmento, el stock ya cambió. Los datos volátiles no se indexan.',
        2: 'Peor todavía: quedaría congelado en el momento del entrenamiento.',
        3: 'Sería enorme, caro y estaría viejo apenas lo enviás.',
      },
    },
    {
      p: '¿Cuál de estas señales indica mejor que un equipo tiene su sistema de IA realmente en producción?',
      opciones: [
        'Mencionan evals, observabilidad y control de costos',
        'Mencionan LangChain y bases vectoriales',
        'Usan el modelo más grande disponible',
        'Tienen un chatbot en la página principal',
      ],
      correcta: 0,
      porQue: 'Evals, tracing y costos son problemas que solo aparecen cuando el sistema tiene usuarios reales. Son la mejor señal de madurez, y también la mejor pregunta que podés hacer vos en una entrevista.',
      porQueNo: {
        1: 'Son herramientas que se usan en cualquier tutorial. No dicen nada sobre madurez.',
        2: 'Suele indicar lo contrario: que no midieron si un modelo más chico y barato alcanzaba.',
        3: 'Un chatbot es fácil de mostrar y difícil de sostener. No es señal de nada por sí solo.',
      },
    },
    {
      p: 'Tenés que clasificar 200.000 tickets por día en 12 categorías fijas. ¿Qué conviene?',
      opciones: [
        'Un modelo chico afinado o un clasificador clásico',
        'El LLM más grande disponible, por precisión',
        'Un agente con varias herramientas',
        'RAG sobre el historial de tickets',
      ],
      correcta: 0,
      porQue: 'Es una tarea acotada y de altísimo volumen. Un LLM grande costaría cientos de dólares por día para algo que un modelo pequeño resuelve igual de bien, más rápido y de forma más predecible.',
      porQueNo: {
        1: 'La diferencia de precisión no justifica un costo uno o dos órdenes de magnitud mayor en una tarea tan acotada.',
        2: 'No hay decisiones ni acciones que tomar: es clasificación pura. Un agente agrega latencia y costo sin aportar nada.',
        3: 'No falta conocimiento, falta una decisión de categoría entre doce opciones fijas.',
      },
    },
    {
      p: 'Cuando alguien dice "el modelo alucina", ¿cuál es la causa más frecuente en un sistema RAG?',
      opciones: [
        'El contexto recuperado estaba incompleto o era el equivocado',
        'La temperatura estaba demasiado baja',
        'El modelo elegido era demasiado chico',
        'Faltaba fine-tuning',
      ],
      correcta: 0,
      porQue: 'En la mayoría de los casos el modelo respondió de forma razonable con lo que recibió: el problema estaba aguas arriba, en el retrieval. Si el dato correcto nunca entró al prompt, ningún prompt lo salva.',
      porQueNo: {
        1: 'Una temperatura baja hace la salida más determinista, no más falsa.',
        2: 'Puede influir, pero es mucho menos frecuente que un problema de recuperación.',
        3: 'El fine-tuning no aporta hechos; si acaso, puede hacer que afirme cosas incorrectas con más seguridad.',
      },
    },
  ],
});
