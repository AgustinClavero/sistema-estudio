/* ==========================================================================
   IA · Módulo 01 — Qué es un LLM y cómo funciona
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ia',
  id: 'm01',
  titulo: 'Qué es un LLM y cómo funciona',
  fuentes: ['anthropic', 'paper-attention', 'paper-chinchilla', 'paper-dpo'],

  intro:
    '<p>Este es el módulo que hace que todo lo demás tenga sentido. Si entendés <b>qué hace exactamente</b> un LLM ' +
    'cuando responde, dejás de sorprenderte: sabés por qué alucina, por qué el mismo prompt da respuestas distintas, ' +
    'por qué se le olvida el principio de la conversación y por qué falla en aritmética pero escribe código decente.</p>' +
    '<p>No hay matemática acá. Hay modelos mentales correctos, que es lo que se pregunta en una entrevista.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Lo único que hace un LLM: predecir el siguiente token',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> es el autocompletado del teléfono, pero entrenado
con casi todo el texto que escribió la humanidad, y prediciendo con una precisión que da vértigo.</div>

<p>Un LLM hace <b>una sola cosa</b>: recibe un texto y calcula, para cada palabra posible del idioma, qué tan
probable es que sea la que sigue. Después elige una, la pega al final, y vuelve a empezar.</p>

<p>Si le das <i>"La capital de Francia es"</i>, por dentro pasa algo así:</p>
<ul>
<li><code>París</code> → 94%</li>
<li><code>la</code> → 3%</li>
<li><code>una</code> → 1%</li>
<li><code>Madrid</code> → 0.4%</li>
<li>…y así con decenas de miles de opciones más</li>
</ul>
<p>Elige <code>París</code>. Ahora el texto es <i>"La capital de Francia es París"</i> y repite el cálculo
para la palabra siguiente. Y otra vez. Y otra. Hasta que la opción más probable es "acá se termina".</p>

<div class="aviso"><strong>Esto es literalmente todo.</strong> No hay una base de datos de hechos adentro, no hay
un módulo de razonamiento, no hay una tabla de verdades. Hay un solo mecanismo, ejecutado una y otra vez,
palabra por palabra.</div>

<h4>Entonces, ¿por qué parece que piensa?</h4>
<p>Porque para predecir bien el texto que escribieron millones de personas, no alcanza con memorizar. Si en el
entrenamiento aparecen millones de ejemplos de razonamiento escrito —demostraciones, explicaciones, debates,
código con sus comentarios— la única forma de predecir bien esas continuaciones es haber capturado <b>los
patrones del razonamiento mismo</b>.</p>
<p>El resultado se parece muchísimo a pensar. Pero el mecanismo por debajo sigue siendo predicción.</p>

<h4>Tres consecuencias que se sienten todos los días</h4>
<ol>
<li><b>Es incremental.</b> Cada palabra se genera mirando todo lo anterior, incluido lo que él mismo acaba de
escribir. Por eso si arranca mal, sigue mal: se está condicionando a su propio error.</li>
<li><b>No sabe que no sabe.</b> Siempre hay una palabra más probable que las demás, incluso cuando la respuesta
correcta no existe en ningún lado. Nunca se queda en blanco. <b>Esa es la raíz de la alucinación.</b></li>
<li><b>Pensar en voz alta lo mejora de verdad.</b> Como cada palabra se apoya en las anteriores, si lo dejás
escribir el razonamiento paso a paso, las conclusiones se apoyan sobre pasos ya escritos y acierta más.
No es un truco de estilo: cambia el resultado.</li>
</ol>
`,

      tecnico: `
<p>Formalmente, un LLM modela la distribución de probabilidad del token siguiente condicionada a la secuencia
previa:</p>
<pre><code>P(token_n | token_1, token_2, ..., token_n-1)</code></pre>

<p>El texto completo se genera de forma <b>autorregresiva</b>: cada token producido se concatena a la entrada
y el proceso se repite. La probabilidad de una secuencia completa es el producto de las probabilidades
condicionales de cada token.</p>

<h4>Qué pasa en una pasada</h4>
<ol>
<li><b>Tokenización.</b> El texto se corta en tokens y cada uno se mapea a un entero.</li>
<li><b>Embedding.</b> Cada entero se convierte en un vector denso (típicamente de 2.000 a 12.000 dimensiones), al que se le suma información posicional.</li>
<li><b>Capas del transformer.</b> Decenas de bloques idénticos, cada uno con auto-atención multi-cabeza y una red feed-forward, con conexiones residuales y normalización.</li>
<li><b>Proyección final.</b> El vector del último token se proyecta al tamaño del vocabulario, produciendo un <b>logit</b> por cada token posible.</li>
<li><b>Softmax.</b> Los logits se convierten en una distribución de probabilidad.</li>
<li><b>Muestreo.</b> Se elige un token según esa distribución (ver la lección de temperatura).</li>
</ol>

<div class="dato"><strong>Dato que cambia el modelo mental:</strong> el modelo produce un vector de probabilidades
sobre <b>todo el vocabulario</b> —del orden de 100.000 a 200.000 tokens— en cada paso. Generar una respuesta de
500 tokens implica 500 pasadas completas por la red. Por eso la generación es la parte cara: el prompt se procesa
de una sola vez en paralelo (<i>prefill</i>), pero la salida se produce token por token (<i>decode</i>).</div>

<h4>Prefill y decode</h4>
<table>
<tr><th></th><th>Prefill</th><th>Decode</th></tr>
<tr><td><b>Qué procesa</b></td><td>Todo el prompt de entrada</td><td>Un token por vez</td></tr>
<tr><td><b>Paralelizable</b></td><td>Sí, entero</td><td>No, es secuencial</td></tr>
<tr><td><b>Limitado por</b></td><td>Cómputo</td><td>Ancho de banda de memoria</td></tr>
<tr><td><b>Impacta en</b></td><td>TTFT (tiempo al primer token)</td><td>Tokens por segundo</td></tr>
</table>
<p>Esta distinción explica dos cosas prácticas: por qué los tokens de salida cuestan más que los de entrada
(en general entre 3 y 5 veces), y por qué el <b>prompt caching</b> funciona — permite saltear el prefill de la
parte del prompt que no cambió.</p>

<h4>Sin estado</h4>
<p>La API es <b>stateless</b>. El modelo no recuerda nada entre llamadas. Lo que llamamos "conversación" es tu
sistema reenviando el historial completo en cada request. Consecuencia directa sobre el costo: en un chat
largo, el mensaje número 20 paga los 19 anteriores otra vez.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 380" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="a1" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
    <path d="M0,0 L7,3.2 L0,6.4 z" fill="currentColor" opacity=".5"/></marker></defs>

  <rect x="24" y="20" width="330" height="44" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="42" y="48" fill="currentColor" font-size="14" font-family="monospace">"La capital de Francia es"</text>

  <line x1="189" y1="64" x2="189" y2="92" stroke="currentColor" opacity=".5" stroke-width="1.5" marker-end="url(#a1)"/>
  <text x="200" y="84" fill="currentColor" opacity=".5" font-size="11">una pasada por la red</text>

  <text x="24" y="112" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">PROBABILIDAD DEL TOKEN SIGUIENTE</text>

  <rect x="24" y="124" width="470" height="26" rx="5" fill="#34d399" fill-opacity=".9"/>
  <text x="36" y="142" fill="#06281c" font-size="13" font-weight="700" font-family="monospace">París</text>
  <text x="506" y="142" fill="#34d399" font-size="13" font-weight="700">94%</text>

  <rect x="24" y="156" width="24" height="20" rx="4" fill="#60a5fa" fill-opacity=".75"/>
  <text x="58" y="171" fill="currentColor" opacity=".8" font-size="12" font-family="monospace">la</text>
  <text x="506" y="171" fill="currentColor" opacity=".6" font-size="12">3%</text>

  <rect x="24" y="182" width="11" height="20" rx="4" fill="#60a5fa" fill-opacity=".55"/>
  <text x="58" y="197" fill="currentColor" opacity=".8" font-size="12" font-family="monospace">una</text>
  <text x="506" y="197" fill="currentColor" opacity=".6" font-size="12">1%</text>

  <rect x="24" y="208" width="6" height="20" rx="3" fill="#f87171" fill-opacity=".6"/>
  <text x="58" y="223" fill="currentColor" opacity=".8" font-size="12" font-family="monospace">Madrid</text>
  <text x="506" y="223" fill="currentColor" opacity=".6" font-size="12">0.4%</text>

  <text x="58" y="248" fill="currentColor" opacity=".4" font-size="11.5">… y ~200.000 tokens más, todos con alguna probabilidad</text>

  <line x1="189" y1="262" x2="189" y2="290" stroke="currentColor" opacity=".5" stroke-width="1.5" marker-end="url(#a1)"/>
  <text x="200" y="282" fill="currentColor" opacity=".5" font-size="11">se elige uno y se pega al final</text>

  <rect x="24" y="294" width="400" height="44" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="42" y="322" fill="currentColor" font-size="14" font-family="monospace">"La capital de Francia es París"</text>

  <path d="M 430 316 q 60 0 60 -140 q 0 -140 -60 -140" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#a1)"/>
  <text x="500" y="300" fill="#fbbf24" font-size="12" font-weight="700">y vuelve</text>
  <text x="500" y="317" fill="#fbbf24" font-size="12" font-weight="700">a empezar</text>

  <text x="24" y="366" fill="currentColor" opacity=".45" font-size="11.5">Nunca hay una casilla vacía: SIEMPRE existe un token más probable que los demás. De ahí sale la alucinación.</text>
</svg>`,
        pie: 'El ciclo completo. Se repite una vez por cada token de la respuesta.',
      },

      entrevista: [
        { p: '¿Cómo le explicarías a alguien no técnico qué hace un LLM?',
          r: 'Le diría que es un autocompletado extremadamente bueno. Recibe un texto y calcula qué palabra es más probable que siga, ' +
             'la agrega, y repite el proceso. Lo que lo hace impresionante es la escala: entrenado con enormes cantidades de texto humano, ' +
             'para predecir bien tuvo que capturar patrones de gramática, de conocimiento del mundo y de razonamiento. ' +
             '<b>Pero el mecanismo sigue siendo predicción del token siguiente, no comprensión.</b>' },

        { p: '¿Por qué los tokens de salida cuestan más que los de entrada?',
          r: 'Por cómo funciona la inferencia. El prompt de entrada se procesa en una sola pasada paralelizable —el <i>prefill</i>—, ' +
             'así que la GPU se aprovecha bien. La salida, en cambio, se genera token por token: cada uno necesita una pasada completa ' +
             'por la red y no se puede paralelizar, porque cada token depende del anterior. Esa fase —el <i>decode</i>— está limitada por ' +
             'ancho de banda de memoria y es mucho más cara por token. De ahí la diferencia de precio, que suele ser de 3 a 5 veces.' },

        { p: '¿Por qué pedirle que "piense paso a paso" mejora los resultados?',
          r: 'Porque la generación es autorregresiva: cada token se produce condicionado a todo lo anterior, incluido lo que el modelo mismo ' +
             'acaba de escribir. Si le pedís la respuesta directa, tiene que llegar al resultado en una sola pasada. Si lo dejás escribir los ' +
             'pasos intermedios, cada paso queda en el contexto y los siguientes se apoyan sobre él. ' +
             '<b>Es literalmente darle más cómputo para el mismo problema</b>, y por eso mejora de verdad y no solo en apariencia.' },

        { p: '¿Un LLM tiene memoria entre llamadas?',
          r: 'No, la API es sin estado. El modelo no recuerda absolutamente nada de una llamada a la otra. Lo que parece una conversación ' +
             'es tu aplicación reenviando el historial completo en cada request. Esto tiene dos consecuencias de ingeniería: ' +
             '<b>el costo crece de forma cuadrática</b> en un chat largo, porque cada mensaje reenvía todos los anteriores; ' +
             'y toda memoria de largo plazo hay que construirla vos, con resúmenes o con recuperación.' },
      ],

      practica: `
<h4>Vas a ver este comportamiento todo el tiempo</h4>

<p><b>Arranca mal y sigue mal.</b> Si la primera línea de la respuesta toma un camino equivocado, el resto se
condiciona a ese error. Por eso funciona tan bien "sembrar" el comienzo de la respuesta:</p>
<pre><code>messages: [
  { role: 'user', content: 'Extraé los datos de esta factura en JSON.' },
  { role: 'assistant', content: '{' },   // ← lo obligás a arrancar por acá
]</code></pre>
<p>Esa técnica se llama <b>prefill del assistant</b>. Elimina de raíz el "Claro, acá tenés el JSON:" que después
te rompe el parseo.</p>

<p><b>El costo de un chat crece rápido.</b> Como cada llamada reenvía todo el historial:</p>
<table>
<tr><th>Mensaje</th><th>Tokens enviados</th><th>Acumulado</th></tr>
<tr><td>1</td><td>500</td><td>500</td></tr>
<tr><td>5</td><td>2.500</td><td>7.500</td></tr>
<tr><td>10</td><td>5.000</td><td>27.500</td></tr>
<tr><td>20</td><td>10.000</td><td>105.000</td></tr>
</table>
<p>Veinte mensajes de un usuario cuestan lo mismo que <b>doscientas</b> llamadas sueltas. Por eso en producción
se resume el historial viejo o se recorta con una ventana deslizante.</p>

<div class="aviso"><strong>Regla práctica:</strong> si la respuesta tiene que ser larga, el usuario tiene que
verla aparecer. Usá <b>streaming</b> siempre que haya alguien esperando: no acelera nada, pero el TTFT baja de
8 segundos a menos de uno y la percepción cambia por completo.</div>
`,

      errores: [
        { mito: 'El modelo "busca" la respuesta en algún lado.',
          realidad: 'No hay ninguna base de datos adentro. El conocimiento está distribuido en los pesos de la red como patrones estadísticos, ' +
                    'no como hechos consultables. <b>Por eso no puede decirte de dónde sacó algo</b> —salvo que se lo hayas dado vos en el prompt— ' +
                    'y por eso la única forma de tener citas confiables es RAG.' },

        { mito: 'Si sabe escribir código, entiende matemática.',
          realidad: 'Son cosas distintas. El código es texto con patrones muy regulares y hay muchísimo en el entrenamiento. La aritmética de ' +
                    'varios dígitos, en cambio, exige un algoritmo exacto, y predecir el token siguiente no lo es. Por eso un LLM te escribe una ' +
                    'función correcta para multiplicar y al mismo tiempo se equivoca multiplicando dos números de seis cifras. ' +
                    '<b>La solución no es un prompt mejor: es darle una calculadora como tool.</b>' },

        { mito: 'Como se equivoca, es porque el modelo es chico.',
          realidad: 'Muchos errores son estructurales, no de escala. Un modelo más grande alucina menos pero no deja de alucinar, porque el mecanismo ' +
                    'es el mismo: siempre hay un token más probable, incluso cuando la respuesta correcta no existe. Lo que cambia el juego no es el ' +
                    'tamaño sino <b>darle el contexto correcto y una forma de verificar</b>.' },

        { mito: 'Mandar todo el historial es lo normal y no importa.',
          realidad: 'Importa, y bastante. El costo crece de forma cuadrática con la cantidad de mensajes, y además el contexto largo degrada la ' +
                    'atención sobre lo que está en el medio. En producción se resume el historial viejo, se recorta con una ventana, o se recupera ' +
                    'solo lo relevante. <b>Reenviar todo siempre es la causa número uno de facturas sorpresa.</b>' },
      ],

      glosario: [
        { t: 'Autorregresivo', d: 'Que genera la salida elemento por elemento, usando lo ya generado como entrada para el paso siguiente.' },
        { t: 'Logit', d: 'Puntaje sin normalizar que el modelo asigna a cada token del vocabulario antes de convertirlo en probabilidad.' },
        { t: 'Softmax', d: 'Función que convierte un vector de logits en una distribución de probabilidad que suma 1.' },
        { t: 'Vocabulario', d: 'Conjunto de todos los tokens que el modelo conoce. Suele tener entre 100.000 y 200.000 entradas.' },
        { t: 'Prefill', d: 'Fase inicial donde se procesa todo el prompt de entrada de una sola vez, en paralelo. Determina el TTFT.' },
        { t: 'Decode', d: 'Fase de generación, token por token, secuencial. Determina la velocidad en tokens por segundo.' },
        { t: 'Stateless', d: 'Sin estado: la API no guarda nada entre llamadas. El historial lo reenvía tu aplicación.' },
        { t: 'Prefill del assistant', d: 'Técnica que consiste en escribir el comienzo de la respuesta del modelo para condicionar su formato.' },
        { t: 'Chain-of-thought', d: 'Pedirle al modelo que escriba su razonamiento paso a paso antes de la respuesta final.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Tokens: la unidad de todo, y de la factura',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el modelo no lee letras ni palabras. Lee pedacitos
llamados <b>tokens</b>, que son más o menos sílabas o fragmentos de palabra. Y te cobra por cada uno.</div>

<p>Antes de que el modelo vea nada, tu texto pasa por un cortador que lo parte en pedazos conocidos. Por ejemplo:</p>
<pre><code>"El gato duerme tranquilo"
 →  [ "El" ] [ " gato" ] [ " du" ] [ "erme" ] [ " tranqu" ] [ "ilo" ]
 →  6 tokens</code></pre>

<p>Fijate dos cosas: el espacio va <b>pegado</b> a la palabra siguiente, y las palabras poco frecuentes se
parten en varios pedazos. Las palabras comunes suelen ser un token entero; las raras, tres o cuatro.</p>

<h4>Las equivalencias que conviene tener en la cabeza</h4>
<table>
<tr><th>Contenido</th><th>Tokens aproximados</th></tr>
<tr><td>1 palabra en inglés</td><td>~1,3</td></tr>
<tr><td>1 palabra en español</td><td>~2</td></tr>
<tr><td>1 página de texto</td><td>~600</td></tr>
<tr><td>Este párrafo</td><td>~90</td></tr>
<tr><td>Un libro de 300 páginas</td><td>~180.000</td></tr>
</table>

<div class="aviso"><strong>Dato que sorprende y que impacta en la factura:</strong> <b>el español cuesta más
caro que el inglés.</b> Los tokenizadores se entrenaron mayormente con texto en inglés, así que el español se
parte en más pedazos para decir lo mismo. La misma frase puede costarte entre un 30% y un 60% más de tokens.
Si tenés un prompt de sistema largo y fijo, escribirlo en inglés y pedir la respuesta en español es una
optimización real.</div>

<h4>Por qué esto explica cosas raras</h4>
<p><b>"¿Cuántas erres tiene 'ferrocarril'?"</b> — El modelo suele fallar. No es tonto: es que nunca vio las
letras. Vio los tokens <code>ferro</code> y <code>carril</code>. Contar letras dentro de un token es como
pedirte que cuentes los píxeles de una palabra que estás leyendo de un vistazo.</p>

<p><b>Los números se parten raro.</b> <code>1234567</code> puede convertirse en <code>123</code> + <code>45</code>
+ <code>67</code>. Esa es una de las razones por las que la aritmética de muchos dígitos le sale mal.</p>
`,

      tecnico: `
<p>Los LLM modernos usan tokenizadores de <b>subpalabra</b>, en general <i>Byte-Pair Encoding</i> (BPE) o
alguna de sus variantes. El algoritmo parte de bytes individuales y va fusionando iterativamente los pares más
frecuentes del corpus, hasta llegar al tamaño de vocabulario deseado.</p>

<p>El resultado es un buen compromiso: las palabras frecuentes quedan como un token único (eficiente), y
cualquier cadena arbitraria —un nombre propio, un identificador, un error de tipeo— sigue siendo representable
descomponiéndose en piezas más chicas. <b>No existe el "token desconocido"</b>, que era el gran problema de los
tokenizadores basados en palabras.</p>

<h4>Implicancias prácticas</h4>
<ul>
<li><b>Costo.</b> Se factura por token de entrada y de salida, con tarifas distintas. La salida suele costar entre 3 y 5 veces más.</li>
<li><b>Ventana de contexto.</b> Se mide en tokens e incluye <i>todo</i>: system prompt, historial, documentos recuperados, definiciones de herramientas y la respuesta que se está generando.</li>
<li><b>Sesgo de idioma.</b> El inglés es el idioma más eficiente en tokens. Español, portugués y francés cuestan entre 1,3 y 1,6 veces más; idiomas con otros alfabetos, bastante más.</li>
<li><b>Datos estructurados.</b> El JSON gasta muchos tokens en llaves, comillas y espacios. Para contexto voluminoso, formatos más compactos —CSV, YAML, texto plano— ahorran bastante.</li>
<li><b>Tokenizadores distintos.</b> Cada familia de modelos tiene el suyo. Un mismo texto no da la misma cuenta en Claude que en GPT: no se pueden comparar presupuestos de tokens entre proveedores sin recalcular.</li>
</ul>

<div class="dato"><strong>Cómo estimar sin llamar a la API:</strong> para español, <code>tokens ≈ caracteres / 3,5</code>
es una aproximación razonable para presupuestar. Si necesitás precisión —para cortar contexto, por ejemplo—
hay que usar el tokenizador real del proveedor, o el endpoint de conteo de tokens cuando existe.</div>

<h4>Dónde se va el presupuesto</h4>
<table>
<tr><th>Componente</th><th>Tokens típicos</th><th>¿Se puede cachear?</th></tr>
<tr><td>System prompt</td><td>200 – 2.000</td><td><b>Sí</b> — es fijo, es el candidato ideal</td></tr>
<tr><td>Definiciones de herramientas</td><td>500 – 3.000</td><td><b>Sí</b> — también son fijas</td></tr>
<tr><td>Documentos recuperados (RAG)</td><td>1.000 – 8.000</td><td>No, cambian por consulta</td></tr>
<tr><td>Historial de conversación</td><td>Crece sin techo</td><td>Parcialmente, el prefijo estable</td></tr>
<tr><td>Mensaje del usuario</td><td>10 – 500</td><td>No</td></tr>
</table>
<p>Las dos primeras filas son fijas entre llamadas: ahí es donde el <b>prompt caching</b> da el mayor ahorro,
que puede llegar al 90% del costo de esos tokens.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 360" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="30" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">TEXTO QUE ESCRIBÍS</text>
  <rect x="24" y="40" width="440" height="38" rx="8" fill="none" stroke="currentColor" stroke-opacity=".3" stroke-width="1.4"/>
  <text x="40" y="65" fill="currentColor" font-size="15" font-family="monospace">El gato duerme tranquilo</text>

  <text x="24" y="112" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">LO QUE VE EL MODELO  ·  6 tokens</text>

  <rect x="24" y="124" width="42" height="34" rx="6" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="45" y="146" text-anchor="middle" fill="currentColor" font-size="13" font-family="monospace">El</text>

  <rect x="72" y="124" width="66" height="34" rx="6" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="105" y="146" text-anchor="middle" fill="currentColor" font-size="13" font-family="monospace">·gato</text>

  <rect x="144" y="124" width="50" height="34" rx="6" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.3"/>
  <text x="169" y="146" text-anchor="middle" fill="currentColor" font-size="13" font-family="monospace">·du</text>

  <rect x="200" y="124" width="62" height="34" rx="6" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.3"/>
  <text x="231" y="146" text-anchor="middle" fill="currentColor" font-size="13" font-family="monospace">erme</text>

  <rect x="268" y="124" width="82" height="34" rx="6" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="309" y="146" text-anchor="middle" fill="currentColor" font-size="13" font-family="monospace">·tranqu</text>

  <rect x="356" y="124" width="48" height="34" rx="6" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="380" y="146" text-anchor="middle" fill="currentColor" font-size="13" font-family="monospace">ilo</text>

  <text x="24" y="180" fill="currentColor" opacity=".45" font-size="11">el punto “·” representa el espacio, que va PEGADO a la palabra siguiente</text>

  <text x="24" y="216" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">EL MISMO SIGNIFICADO, DOS IDIOMAS</text>

  <rect x="24" y="228" width="270" height="30" rx="6" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.3"/>
  <text x="38" y="248" fill="currentColor" font-size="12.5" font-family="monospace">"The cat sleeps"</text>
  <text x="306" y="248" fill="#34d399" font-size="13" font-weight="700">3 tokens</text>

  <rect x="24" y="266" width="378" height="30" rx="6" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.3"/>
  <text x="38" y="286" fill="currentColor" font-size="12.5" font-family="monospace">"El gato duerme"</text>
  <text x="414" y="286" fill="#f87171" font-size="13" font-weight="700">5 tokens  (+66%)</text>

  <text x="24" y="330" fill="currentColor" opacity=".5" font-size="11.5">El tokenizador se entrenó mayormente con inglés. El español dice lo mismo con más tokens</text>
  <text x="24" y="348" fill="currentColor" opacity=".5" font-size="11.5">— y los tokens son exactamente lo que te facturan.</text>
</svg>`,
        pie: 'Tokenización y su costo. Las cifras son aproximadas y varían según el tokenizador de cada proveedor.',
      },

      entrevista: [
        { p: '¿Qué es un token y por qué importa?',
          r: 'Es la unidad mínima que procesa el modelo: aproximadamente un fragmento de palabra, obtenido con un tokenizador de subpalabra ' +
             'tipo BPE. Importa por tres razones muy concretas: <b>es la unidad de facturación</b>, <b>es la unidad de la ventana de contexto</b>, ' +
             'y explica varias limitaciones raras —como que el modelo no pueda contar letras dentro de una palabra, porque nunca vio letras: vio tokens.' },

        { p: 'Tu aplicación gasta mucho más de lo esperado en tokens. ¿Qué revisás?',
          r: 'En orden de impacto: <b>primero el historial de conversación</b>, porque se reenvía completo en cada llamada y el costo crece de ' +
             'forma cuadrática. <b>Segundo, el prompt caching</b>: si el system prompt y las definiciones de herramientas son fijas y no están ' +
             'cacheadas, estás pagando de más en cada request. <b>Tercero, cuántos fragmentos recupera el RAG</b>: bajar de veinte a cinco bien ' +
             'elegidos suele mejorar la calidad y bajar el costo al mismo tiempo. <b>Cuarto, el modelo</b>: verificar si la tarea no la resuelve ' +
             'igual uno más chico y barato.' },

        { p: '¿Por qué el mismo texto cuesta distinto en inglés que en español?',
          r: 'Porque el tokenizador se entrena sobre un corpus mayoritariamente en inglés, así que las secuencias frecuentes en inglés quedan ' +
             'comprimidas en un solo token y las de otros idiomas se fragmentan más. En español eso significa entre un 30% y un 60% más de tokens ' +
             'para decir lo mismo. Es una consideración real de costo: en sistemas de alto volumen conviene escribir los prompts fijos en inglés ' +
             'y pedir la respuesta en español.' },
      ],

      practica: `
<h4>Presupuestar el contexto antes de armar el prompt</h4>
<pre><code>const LIMITE = 180_000;          // ventana del modelo
const RESERVA_SALIDA = 4_000;    // lo que querés que pueda responder

const presupuesto = LIMITE - RESERVA_SALIDA
  - contar(systemPrompt)
  - contar(definicionesDeTools)
  - contar(mensajeUsuario);

// recortá el RAG y el historial para que entren en ese presupuesto
const contexto = recortarA(fragmentos, presupuesto * 0.7);
const historial = recortarA(mensajes, presupuesto * 0.3);</code></pre>

<div class="aviso"><strong>Error que se paga caro:</strong> armar el prompt sin reservar espacio para la salida.
Si llenás la ventana con contexto, el modelo se queda sin lugar para responder y te corta la respuesta a la
mitad. <b>Siempre reservá el máximo de tokens de salida antes de repartir el resto.</b></div>

<h4>Ahorros ordenados por impacto real</h4>
<table>
<tr><th>Acción</th><th>Ahorro típico</th><th>Esfuerzo</th></tr>
<tr><td>Activar prompt caching en la parte fija</td><td>Hasta 90% de esos tokens</td><td>Bajo</td></tr>
<tr><td>Resumir el historial pasados N mensajes</td><td>50-80% en chats largos</td><td>Medio</td></tr>
<tr><td>Bajar el top-k del RAG de 20 a 5</td><td>60-75% del contexto</td><td>Bajo</td></tr>
<tr><td>Usar un modelo más chico donde alcance</td><td>10-20 veces</td><td>Medio (hay que evaluar)</td></tr>
<tr><td>Prompts fijos en inglés</td><td>20-40% de esa porción</td><td>Bajo</td></tr>
<tr><td>Contexto en texto plano en vez de JSON</td><td>15-30% del contexto</td><td>Bajo</td></tr>
</table>
<p>El de mayor relación beneficio/esfuerzo es casi siempre el primero. El más subestimado, el tercero: recuperar
menos fragmentos pero mejor elegidos suele <b>subir</b> la calidad además de bajar el costo.</p>
`,

      errores: [
        { mito: 'Un token es una palabra.',
          realidad: 'Es un fragmento de palabra. En español el promedio ronda los <b>dos tokens por palabra</b>, y las palabras poco frecuentes ' +
                    'pueden necesitar tres o cuatro. Estimar "una palabra = un token" te deja el presupuesto corto casi a la mitad.' },

        { mito: 'La ventana de contexto es para el documento que le mando.',
          realidad: 'La ventana incluye <b>absolutamente todo</b>: system prompt, definiciones de herramientas, historial, documentos recuperados ' +
                    '<i>y la respuesta que se está generando</i>. Si no reservás espacio para la salida, el modelo se queda sin lugar y te corta ' +
                    'la respuesta por la mitad.' },

        { mito: 'Puedo usar el mismo conteo de tokens para todos los proveedores.',
          realidad: 'Cada familia de modelos tiene su propio tokenizador. El mismo texto puede dar cuentas distintas en Claude, GPT o Gemini. ' +
                    'Si tu sistema recorta contexto según un límite, ese cálculo <b>hay que rehacerlo</b> al cambiar de proveedor, o vas a mandar ' +
                    'prompts que exceden la ventana.' },

        { mito: 'Mandar el contexto en JSON es lo más prolijo.',
          realidad: 'Prolijo para vos, caro para la factura. Las llaves, comillas y espacios del JSON son tokens que pagás. ' +
                    'Para bloques grandes de contexto, texto plano o CSV transmiten lo mismo con un 15-30% menos. <b>El JSON reservalo para la ' +
                    'salida estructurada</b>, donde sí aporta.' },
      ],

      glosario: [
        { t: 'Token', d: 'Unidad mínima de texto que procesa el modelo. Aproximadamente un fragmento de palabra.' },
        { t: 'Tokenizador', d: 'Componente que convierte texto en tokens y viceversa. Cada familia de modelos tiene el suyo.' },
        { t: 'BPE', d: 'Byte-Pair Encoding. Algoritmo que construye el vocabulario fusionando iterativamente los pares de bytes más frecuentes.' },
        { t: 'Subpalabra', d: 'Estrategia de tokenización que parte las palabras en fragmentos, permitiendo representar cualquier cadena sin "token desconocido".' },
        { t: 'Ventana de contexto', d: 'Cantidad máxima de tokens que el modelo puede manejar en una llamada, incluyendo entrada y salida.' },
        { t: 'Token de entrada', d: 'Los que mandás. Más baratos, se procesan en paralelo durante el prefill.' },
        { t: 'Token de salida', d: 'Los que genera. Entre 3 y 5 veces más caros, porque se producen secuencialmente.' },
        { t: 'Prompt caching', d: 'Reutilizar el procesamiento de la parte fija del prompt entre llamadas, con un descuento importante sobre esos tokens.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'El transformer y la atención, sin matemática',
      minutos: 10,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> la atención es el mecanismo por el cual cada palabra
<b>mira a todas las demás</b> y decide cuáles le importan para entenderse a sí misma.</div>

<p>Tomá esta oración:</p>
<p style="font-size:17px;text-align:center;margin:18px 0"><i>"El perro no cruzó la calle porque <b>estaba</b> cansado."</i></p>
<p>¿Quién estaba cansado? El perro. Vos lo resolviste sin pensarlo. Ahora cambiá una palabra:</p>
<p style="font-size:17px;text-align:center;margin:18px 0"><i>"El perro no cruzó la calle porque <b>estaba</b> mojada."</i></p>
<p>Ahora "estaba" se refiere a la calle. Una sola palabra al final cambió a qué se refiere una palabra del medio.</p>

<p><b>Eso es exactamente lo que resuelve la atención.</b> Cuando el modelo procesa <i>"estaba"</i>, mira todas
las palabras de la oración y le pone un peso a cada una: "perro" mucho, "calle" poco, "porque" algo. Esos pesos
no están programados: los aprendió entrenando.</p>

<h4>Por qué esto fue tan importante</h4>
<p>Antes, los modelos leían palabra por palabra en orden, arrastrando un resumen de lo leído. Dos problemas:</p>
<ul>
<li><b>No se podía paralelizar.</b> Para procesar la palabra 50 había que haber terminado las 49 anteriores. Con una GPU capaz de hacer miles de cosas a la vez, era un desperdicio enorme.</li>
<li><b>Se olvidaba lo lejano.</b> Ese resumen que arrastraba se iba diluyendo. Una palabra de treinta atrás quedaba casi borrada.</li>
</ul>
<p>La atención rompe las dos limitaciones de un saque: <b>todas las palabras se procesan a la vez</b>, y
<b>cualquier palabra puede conectarse directamente con cualquier otra</b>, esté a dos posiciones o a dos mil.</p>

<h4>"Multi-cabeza": varias miradas en paralelo</h4>
<p>No hay un solo mecanismo de atención sino muchos (32, 64, más), funcionando al mismo tiempo. Cada uno
aprende a mirar una relación distinta: uno se especializa en concordancia de género y número, otro en a quién
se refiere un pronombre, otro en la relación verbo-objeto. Es como leer la misma oración con varios pares de
ojos, cada uno buscando otra cosa.</p>

<div class="aviso"><strong>El costo de esta maravilla:</strong> si cada palabra mira a todas las demás, con
1.000 palabras son un millón de comparaciones; con 10.000 palabras, cien millones. El costo crece <b>al
cuadrado</b>. Por eso las ventanas de contexto grandes fueron tan difíciles de lograr y por eso el contexto
largo sale caro.</div>
`,

      tecnico: `
<h4>La operación de atención</h4>
<p>Cada token se proyecta en tres vectores mediante matrices aprendidas:</p>
<ul>
<li><b>Query (Q)</b> — "qué estoy buscando"</li>
<li><b>Key (K)</b> — "qué ofrezco yo"</li>
<li><b>Value (V)</b> — "qué información aporto si me eligen"</li>
</ul>
<p>El peso de atención entre dos tokens es el producto punto entre la <i>query</i> de uno y la <i>key</i> del
otro, escalado y pasado por softmax. La salida de cada token es la suma de los <i>values</i> de todos los
tokens, ponderada por esos pesos:</p>
<pre><code>Atención(Q, K, V) = softmax( Q·Kᵀ / √d ) · V</code></pre>
<p>La división por la raíz de la dimensión evita que los productos punto crezcan demasiado y saturen el softmax.</p>

<h4>Un bloque transformer</h4>
<p>Los modelos apilan decenas de bloques idénticos. Cada bloque contiene:</p>
<ol>
<li><b>Auto-atención multi-cabeza.</b> Varias atenciones en paralelo, cada una con sus propias matrices Q, K, V; los resultados se concatenan y proyectan.</li>
<li><b>Red feed-forward.</b> Dos capas densas con una no linealidad. Es donde reside la mayor parte de los parámetros del modelo.</li>
<li><b>Conexiones residuales.</b> La entrada de cada subcapa se suma a su salida, lo que permite entrenar redes muy profundas sin que el gradiente se desvanezca.</li>
<li><b>Normalización de capa.</b> Estabiliza el entrenamiento.</li>
</ol>

<h4>Detalles que aparecen en entrevistas</h4>
<ul>
<li><b>Atención causal (enmascarada).</b> En un modelo generativo, cada token solo puede mirar hacia atrás. Se implementa poniendo en menos infinito los pesos hacia el futuro antes del softmax. Es lo que permite entrenar sobre toda la secuencia en paralelo sin que el modelo "haga trampa" viendo la respuesta.</li>
<li><b>Codificación posicional.</b> La atención por sí sola no distingue el orden —es invariante a permutaciones—. Hay que inyectar la posición: originalmente con funciones sinusoidales, hoy predominan las <b>rotatorias (RoPE)</b>, que generalizan mejor a secuencias más largas que las vistas en entrenamiento.</li>
<li><b>Complejidad cuadrática.</b> La atención es O(n²) en la longitud de la secuencia, tanto en cómputo como en memoria. De ahí las variantes: FlashAttention (optimización de memoria sin cambiar el resultado), atención por ventanas, GQA y MQA (compartir keys y values entre cabezas para achicar la caché KV).</li>
<li><b>Caché KV.</b> Durante la generación, las keys y values de los tokens ya procesados se guardan para no recalcularlos. Es lo que hace viable el decode, y también lo que consume la mayor parte de la memoria de GPU al servir contextos largos.</li>
</ul>

<div class="dato"><strong>Dónde está el conocimiento:</strong> es una confusión frecuente creer que vive en la
atención. La atención <b>enruta</b> información entre posiciones; el conocimiento fáctico está principalmente
en las <b>capas feed-forward</b>, que concentran cerca de dos tercios de los parámetros y se comportan como una
memoria asociativa.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="26" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    AL PROCESAR LA PALABRA “estaba”, ¿A QUÉ LE PRESTA ATENCIÓN?</text>

  <text x="40"  y="72" fill="currentColor" opacity=".85" font-size="14" font-family="monospace">El</text>
  <text x="80"  y="72" fill="#34d399" font-size="14" font-weight="700" font-family="monospace">perro</text>
  <text x="150" y="72" fill="currentColor" opacity=".85" font-size="14" font-family="monospace">no</text>
  <text x="185" y="72" fill="currentColor" opacity=".85" font-size="14" font-family="monospace">cruzó</text>
  <text x="248" y="72" fill="currentColor" opacity=".85" font-size="14" font-family="monospace">la</text>
  <text x="275" y="72" fill="#f87171" font-size="14" font-weight="700" font-family="monospace">calle</text>
  <text x="335" y="72" fill="currentColor" opacity=".85" font-size="14" font-family="monospace">porque</text>
  <text x="408" y="72" fill="#7c5cff" font-size="15" font-weight="700" font-family="monospace">estaba</text>
  <text x="486" y="72" fill="currentColor" opacity=".85" font-size="14" font-family="monospace">cansado</text>

  <path d="M 430 82 Q 250 140 100 82" fill="none" stroke="#34d399" stroke-width="5" opacity=".75"/>
  <path d="M 434 82 Q 360 130 292 82" fill="none" stroke="#f87171" stroke-width="1.3" opacity=".5"/>
  <path d="M 428 82 Q 400 116 366 82" fill="none" stroke="currentColor" stroke-width="1" opacity=".25"/>
  <path d="M 440 82 Q 480 120 515 82" fill="none" stroke="#22d3ee" stroke-width="2.6" opacity=".6"/>

  <text x="96"  y="160" fill="#34d399" font-size="12" font-weight="700">0.61</text>
  <text x="286" y="152" fill="#f87171" font-size="11.5" opacity=".8">0.06</text>
  <text x="360" y="138" fill="currentColor" opacity=".45" font-size="11.5">0.03</text>
  <text x="508" y="150" fill="#22d3ee" font-size="11.5" opacity=".85">0.22</text>

  <text x="24" y="196" fill="currentColor" opacity=".55" font-size="11.5">
    “estaba” se apoya sobre todo en “perro”: por eso entiende que el cansado es el perro.</text>

  <line x1="24" y1="216" x2="656" y2="216" stroke="currentColor" opacity=".18"/>

  <text x="24" y="244" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CAMBIAMOS LA ÚLTIMA PALABRA</text>

  <text x="40"  y="288" fill="currentColor" opacity=".85" font-size="14" font-family="monospace">El</text>
  <text x="80"  y="288" fill="currentColor" opacity=".5" font-size="14" font-family="monospace">perro</text>
  <text x="150" y="288" fill="currentColor" opacity=".85" font-size="14" font-family="monospace">no</text>
  <text x="185" y="288" fill="currentColor" opacity=".85" font-size="14" font-family="monospace">cruzó</text>
  <text x="248" y="288" fill="currentColor" opacity=".85" font-size="14" font-family="monospace">la</text>
  <text x="275" y="288" fill="#34d399" font-size="14" font-weight="700" font-family="monospace">calle</text>
  <text x="335" y="288" fill="currentColor" opacity=".85" font-size="14" font-family="monospace">porque</text>
  <text x="408" y="288" fill="#7c5cff" font-size="15" font-weight="700" font-family="monospace">estaba</text>
  <text x="486" y="288" fill="currentColor" opacity=".85" font-size="14" font-family="monospace">mojada</text>

  <path d="M 430 298 Q 250 352 100 298" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".22"/>
  <path d="M 434 298 Q 360 344 292 298" fill="none" stroke="#34d399" stroke-width="5" opacity=".75"/>
  <path d="M 440 298 Q 480 336 515 298" fill="none" stroke="#22d3ee" stroke-width="2.6" opacity=".6"/>

  <text x="286" y="366" fill="#34d399" font-size="12" font-weight="700">0.58</text>
  <text x="96"  y="374" fill="currentColor" opacity=".4" font-size="11.5">0.05</text>

  <text x="24" y="394" fill="currentColor" opacity=".55" font-size="11.5">
    Una sola palabra al final reasigna por completo a qué se refiere una palabra del medio. Eso es la atención.</text>
</svg>`,
        pie: 'Los pesos son ilustrativos. En un modelo real hay decenas de cabezas haciendo esto en paralelo, cada una mirando otra relación.',
      },

      entrevista: [
        { p: 'Explicame el mecanismo de atención.',
          r: 'Cada token genera tres vectores: una <i>query</i> —qué estoy buscando—, una <i>key</i> —qué ofrezco— y un <i>value</i> —qué información aporto—. ' +
             'El peso entre dos tokens sale del producto punto entre la query de uno y la key del otro, normalizado con softmax. ' +
             'La representación de cada token pasa a ser la suma de los values de todos los demás, ponderada por esos pesos. ' +
             '<b>En una frase: cada palabra decide, con pesos aprendidos, cuánto le importa cada otra palabra para entenderse a sí misma.</b>' },

        { p: '¿Qué son Q, K y V y por qué son tres cosas distintas?',
          r: 'Porque separan tres roles que no tienen por qué coincidir. La <i>key</i> es cómo un token se anuncia frente a los demás; ' +
             'el <i>value</i> es la información que aporta si alguien lo elige; y la <i>query</i> es lo que un token está buscando. ' +
             'Si key y value fueran lo mismo, no podrías tener un token que sea fácil de encontrar por una razón pero aporte información sobre otra. ' +
             'La analogía útil es una búsqueda: la query es lo que escribís, las keys son los títulos indexados y los values el contenido que te devuelven.' },

        { p: '¿Por qué es difícil hacer ventanas de contexto muy grandes?',
          r: 'Porque la atención es <b>cuadrática</b> en la longitud de la secuencia: si cada token mira a todos los demás, duplicar el contexto ' +
             'cuadruplica el cómputo y la memoria. Además está la <b>caché KV</b>, que guarda keys y values de todos los tokens procesados y crece ' +
             'linealmente con el contexto: en la práctica es lo que satura la memoria de GPU al servir. Por eso aparecieron FlashAttention, ' +
             'la atención por ventanas y esquemas como GQA o MQA, que comparten keys y values entre cabezas para achicar esa caché.' },

        { p: '¿Por qué hace falta codificación posicional?',
          r: 'Porque la atención es invariante a permutaciones: si solo mirás pesos entre pares, "el perro mordió al hombre" y "el hombre mordió al perro" ' +
             'son idénticos. Hay que inyectar la posición explícitamente. El paper original usaba funciones sinusoidales; hoy predomina <b>RoPE</b>, ' +
             'que codifica la posición como una rotación en el espacio de queries y keys y generaliza mucho mejor a secuencias más largas que las de entrenamiento.' },
      ],

      practica: `
<h4>Por qué esto te sirve en el día a día</h4>

<p><b>1 · Explica el <i>lost in the middle</i>.</b> Con contextos muy largos, la atención se reparte entre
muchísimos tokens y la información del medio compite en desventaja. Consecuencia práctica:
<b>poné lo más importante al principio o al final del prompt</b>, nunca sepultado en el medio.</p>

<p><b>2 · Explica el costo del contexto largo.</b> Duplicar el contexto no duplica el costo de atención: lo
cuadruplica. Recuperar cinco fragmentos buenos casi siempre le gana a recuperar cincuenta mediocres, en
calidad y en plata.</p>

<p><b>3 · Explica el prompt caching.</b> La caché KV guarda el trabajo ya hecho sobre un prefijo del prompt.
Por eso el caching exige que la parte fija esté <b>al principio y sea idéntica byte a byte</b>:</p>
<pre><code>// ✅ La parte estable primero: el prefijo se cachea
[ system prompt fijo ][ definiciones de tools ][ contexto RAG ][ mensaje del usuario ]

// ❌ Con un timestamp adelante, el prefijo cambia siempre y NO se cachea nunca
[ "Hoy es 07/08/2026..." ][ system prompt ][ ... ]</code></pre>

<div class="aviso"><strong>Error clásico y silencioso:</strong> meter la fecha, el nombre del usuario o un ID de
sesión al principio del system prompt. Rompe la caché en todas las llamadas y nadie se da cuenta hasta que
mira la factura. <b>Todo lo variable va después de lo fijo.</b></div>
`,

      errores: [
        { mito: 'El transformer "entiende" la oración.',
          realidad: 'Calcula pesos de relevancia entre posiciones, aprendidos por optimización estadística. El resultado captura relaciones ' +
                    'sintácticas y semánticas reales, y es genuinamente útil — pero <b>describirlo como comprensión lleva a expectativas equivocadas</b> ' +
                    'sobre cuándo va a fallar.' },

        { mito: 'El conocimiento del modelo está en la atención.',
          realidad: 'La atención <b>enruta</b> información entre posiciones. El conocimiento fáctico vive principalmente en las <b>capas feed-forward</b>, ' +
                    'que concentran alrededor de dos tercios de los parámetros y funcionan como una memoria asociativa. Es una distinción que se pregunta ' +
                    'en entrevistas más técnicas.' },

        { mito: 'Más contexto siempre es mejor.',
          realidad: 'Tiene costo cuadrático y degrada la atención sobre lo relevante. Está bien medido que la información en el medio de un contexto ' +
                    'muy largo se recupera peor que la del principio o el final. <b>Menos contexto y mejor elegido gana casi siempre</b>, en calidad y en costo.' },

        { mito: 'El orden del prompt da igual mientras esté toda la información.',
          realidad: 'No da igual, por dos motivos distintos. Por la atención, lo que va al medio se atiende peor. Y por el <b>prompt caching</b>: ' +
                    'solo se cachea un prefijo idéntico, así que si ponés algo variable adelante perdés el descuento en todas las llamadas.' },
      ],

      glosario: [
        { t: 'Atención (self-attention)', d: 'Mecanismo por el cual cada token pondera cuánto le importa cada otro token de la secuencia.' },
        { t: 'Query / Key / Value', d: 'Los tres vectores derivados de cada token: qué busca, cómo se anuncia y qué información aporta.' },
        { t: 'Multi-head attention', d: 'Varias atenciones en paralelo, cada una especializada en un tipo distinto de relación.' },
        { t: 'Atención causal', d: 'Variante donde cada token solo puede mirar hacia atrás. Necesaria para generar texto sin ver el futuro.' },
        { t: 'Codificación posicional', d: 'Información de orden que se inyecta porque la atención por sí sola es invariante a permutaciones.' },
        { t: 'RoPE', d: 'Rotary Position Embedding. Codifica la posición como una rotación; generaliza mejor a contextos largos.' },
        { t: 'Feed-forward', d: 'Capa densa dentro de cada bloque transformer. Concentra la mayor parte de los parámetros y del conocimiento fáctico.' },
        { t: 'Conexión residual', d: 'Sumar la entrada de una subcapa a su salida, lo que permite entrenar redes muy profundas.' },
        { t: 'Caché KV', d: 'Almacenamiento de las keys y values ya calculadas para no recomputarlas en cada token generado.' },
        { t: 'FlashAttention', d: 'Implementación de la atención optimizada para memoria, que da el mismo resultado mucho más rápido.' },
        { t: 'GQA / MQA', d: 'Grouped/Multi-Query Attention. Comparten keys y values entre cabezas para reducir el tamaño de la caché KV.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Cómo se entrena: de internet crudo a asistente útil',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> son tres etapas muy distintas. Primero lee
muchísimo, después aprende a comportarse, y al final aprende qué respuestas gustan más.</div>

<h4>Etapa 1 · Pre-entrenamiento — leer todo</h4>
<p>Se le dan cantidades enormes de texto —webs, libros, código, documentación— y una única tarea: adiviná la
palabra que sigue. Millones de millones de veces.</p>
<p>Nadie etiquetó nada: la respuesta correcta es la palabra que efectivamente venía. Eso se llama
<b>auto-supervisión</b>, y es lo que permitió entrenar con internet entero.</p>
<p>Acá se aprende <b>todo</b>: gramática, hechos, estilos, razonamiento, cómo se escribe una función.
Es la etapa que cuesta decenas de millones de dólares y meses de cómputo.</p>
<p><b>El resultado es un modelo base, y es raro de usar.</b> No conversa: continúa texto. Si le escribís
<i>"¿Cuál es la capital de Francia?"</i> te puede contestar <i>"¿Y la de Italia? ¿Y la de España?"</i>,
porque en internet las preguntas suelen venir en listas.</p>

<h4>Etapa 2 · Ajuste por instrucciones (SFT) — aprender a comportarse</h4>
<p>Se le muestran decenas de miles de ejemplos escritos por personas: una instrucción y la respuesta ideal.
El modelo aprende el <b>formato del diálogo</b>: que a una pregunta se responde, que a un pedido se obedece,
que hay un turno de usuario y uno de asistente.</p>
<p>Es muchísimo más barata que la etapa 1 y es la que convierte un continuador de texto en un asistente.</p>

<h4>Etapa 3 · Aprendizaje por preferencias (RLHF) — aprender qué es "mejor"</h4>
<p>Para la misma pregunta se generan varias respuestas y una persona elige cuál prefiere. Con miles de esas
comparaciones se entrena un modelo que predice la preferencia humana, y con él se ajusta el modelo principal.</p>
<p>Acá se afinan cosas que son difíciles de escribir como regla: ser útil sin ser pesado, admitir cuando no
sabe, no ayudar a hacer daño, mantener un tono.</p>

<div class="aviso"><strong>La consecuencia práctica más importante:</strong> el modelo tiene una <b>fecha de
corte de conocimiento</b>, fijada en la etapa 1. Todo lo posterior sencillamente no existe para él. No lo sabe
y no puede saberlo. <b>Por eso existe RAG</b> — y por eso preguntarle por algo reciente es una receta para que
te invente una respuesta.</div>
`,

      tecnico: `
<table>
<tr><th></th><th>Pre-entrenamiento</th><th>SFT</th><th>RLHF / DPO</th></tr>
<tr><td><b>Datos</b></td><td>Billones de tokens sin etiquetar</td><td>10K – 1M pares instrucción/respuesta</td><td>Comparaciones de preferencia</td></tr>
<tr><td><b>Señal</b></td><td>Predicción del token siguiente</td><td>Predicción del token siguiente sobre respuestas ideales</td><td>Recompensa por preferencia</td></tr>
<tr><td><b>Costo</b></td><td>Decenas de millones de USD</td><td>Miles a cientos de miles</td><td>Similar a SFT</td></tr>
<tr><td><b>Duración</b></td><td>Semanas o meses</td><td>Horas o días</td><td>Días</td></tr>
<tr><td><b>Qué aporta</b></td><td>Conocimiento y capacidad</td><td>Formato y obediencia</td><td>Calidad, tono, seguridad</td></tr>
</table>

<h4>Pre-entrenamiento</h4>
<p>La calidad del corpus pesa más que su volumen: el filtrado, la deduplicación y la mezcla de fuentes son
decisivos. Las <b>leyes de escalado</b> (Kaplan 2020, Chinchilla 2022) describen cómo repartir un presupuesto
de cómputo entre tamaño del modelo y cantidad de datos; el hallazgo de Chinchilla fue que los modelos de la
época estaban <b>sobredimensionados y sub-entrenados</b>: convenía menos parámetros y muchos más tokens.</p>

<h4>SFT — Supervised Fine-Tuning</h4>
<p>Es aprendizaje supervisado clásico sobre pares (instrucción, respuesta). La calidad de los ejemplos importa
mucho más que la cantidad: unos pocos miles bien curados superan a cientos de miles ruidosos. Acá se instaura
el formato de chat con roles, incluidos los tokens especiales que delimitan cada turno.</p>

<h4>Alineación por preferencias</h4>
<ul>
<li><b>RLHF</b> — se entrena un <i>reward model</i> con comparaciones humanas y luego se optimiza el modelo contra él mediante PPO. Es efectivo pero inestable y caro de implementar.</li>
<li><b>DPO</b> (Direct Preference Optimization) — deriva matemáticamente el mismo objetivo pero sin necesidad de un reward model separado ni de RL. Mucho más simple y estable; hoy es lo más común.</li>
<li><b>Constitutional AI</b> — enfoque de Anthropic donde el modelo critica y revisa sus propias respuestas contra un conjunto explícito de principios, reduciendo la dependencia de etiquetado humano.</li>
</ul>

<h4>Modelos de razonamiento</h4>
<p>Una etapa más reciente entrena al modelo, mediante aprendizaje por refuerzo sobre problemas con respuesta
verificable, para que produzca cadenas largas de razonamiento antes de contestar. Cambia el perfil de uso:
mucha más latencia y muchos más tokens de salida, a cambio de mejor desempeño en matemática, lógica y código.
<b>Para tareas de extracción o resumen no aportan nada y salen bastante más caros.</b></p>

<div class="dato"><strong>El impuesto de la alineación:</strong> las etapas 2 y 3 pueden reducir levemente
ciertas capacidades brutas del modelo base a cambio de utilidad y seguridad. Es un compromiso deliberado y
se lo conoce como <i>alignment tax</i>.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="t4" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
    <path d="M0,0 L7,3.2 L0,6.4 z" fill="currentColor" opacity=".5"/></marker></defs>

  <rect x="24" y="20" width="632" height="96" rx="12" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="44" y="46" fill="#7c5cff" font-size="14" font-weight="700">1 · PRE-ENTRENAMIENTO</text>
  <text x="44" y="68" fill="currentColor" opacity=".75" font-size="12">Billones de tokens de internet · "adiviná el token siguiente" · auto-supervisado</text>
  <text x="44" y="88" fill="currentColor" opacity=".75" font-size="12">Aprende: gramática, hechos, estilos, razonamiento, código</text>
  <text x="44" y="107" fill="#f87171" font-size="11.5" font-weight="600">Resultado: modelo BASE — continúa texto, no conversa · decenas de millones de USD</text>

  <line x1="340" y1="116" x2="340" y2="140" stroke="currentColor" opacity=".5" stroke-width="1.5" marker-end="url(#t4)"/>

  <rect x="24" y="144" width="632" height="90" rx="12" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.5"/>
  <text x="44" y="170" fill="#22d3ee" font-size="14" font-weight="700">2 · SFT  —  ajuste por instrucciones</text>
  <text x="44" y="192" fill="currentColor" opacity=".75" font-size="12">Decenas de miles de pares (instrucción → respuesta ideal), escritos por personas</text>
  <text x="44" y="212" fill="currentColor" opacity=".75" font-size="12">Aprende el formato del diálogo: turnos, obedecer, responder</text>
  <text x="44" y="229" fill="#34d399" font-size="11.5" font-weight="600">Resultado: ya es un asistente · miles a cientos de miles de USD</text>

  <line x1="340" y1="234" x2="340" y2="258" stroke="currentColor" opacity=".5" stroke-width="1.5" marker-end="url(#t4)"/>

  <rect x="24" y="262" width="632" height="90" rx="12" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.5"/>
  <text x="44" y="288" fill="#34d399" font-size="14" font-weight="700">3 · ALINEACIÓN  —  RLHF o DPO</text>
  <text x="44" y="310" fill="currentColor" opacity=".75" font-size="12">Personas comparan respuestas: "prefiero ésta" · se aprende la preferencia</text>
  <text x="44" y="330" fill="currentColor" opacity=".75" font-size="12">Ajusta lo difícil de escribir como regla: tono, honestidad, seguridad, utilidad</text>
  <text x="44" y="347" fill="#fbbf24" font-size="11.5" font-weight="600">Resultado: el modelo que consumís por API</text>

  <rect x="24" y="366" width="632" height="26" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.3" stroke-dasharray="5 4"/>
  <text x="340" y="384" text-anchor="middle" fill="#f87171" font-size="12" font-weight="700">
    La FECHA DE CORTE queda fijada en la etapa 1. Todo lo posterior no existe para el modelo.</text>
</svg>`,
        pie: 'Las tres etapas. La primera aporta el conocimiento; las otras dos, el comportamiento.',
      },

      entrevista: [
        { p: '¿Cómo se entrena un LLM?',
          r: 'En tres etapas. <b>Pre-entrenamiento</b>: auto-supervisado sobre billones de tokens, prediciendo el token siguiente; ahí se adquiere ' +
             'todo el conocimiento y es la etapa carísima. <b>SFT</b>: aprendizaje supervisado sobre pares instrucción-respuesta escritos por humanos, ' +
             'que convierte un continuador de texto en un asistente que respeta turnos y obedece. <b>Alineación</b>: RLHF o DPO sobre comparaciones de ' +
             'preferencia humana, que ajusta tono, honestidad y seguridad. <b>La clave: el conocimiento viene de la primera etapa; el comportamiento, de las otras dos.</b>' },

        { p: '¿Qué diferencia hay entre un modelo base y uno instruido?',
          r: 'El modelo base solo continúa texto: si le escribís una pregunta, es probable que te devuelva más preguntas, porque en internet las ' +
             'preguntas suelen aparecer en listas. El modelo instruido pasó por SFT y alineación, así que entiende el formato de diálogo y responde. ' +
             'En la práctica, todo lo que consumís por API es instruido. Los modelos base tienen sentido casi solo como punto de partida para hacer ' +
             'tu propio fine-tuning.' },

        { p: '¿Qué es RLHF y por qué muchos usan DPO ahora?',
          r: '<b>RLHF</b> entrena primero un <i>reward model</i> que predice qué respuesta preferiría un humano, y después optimiza el modelo contra ' +
             'esa recompensa usando aprendizaje por refuerzo, típicamente PPO. Funciona, pero tiene tres componentes en juego, es inestable y cuesta ' +
             'implementarlo bien. <b>DPO</b> demostró que se puede optimizar directamente el mismo objetivo a partir de los pares de preferencia, ' +
             'sin reward model ni RL. Da resultados comparables con mucha menos complejidad, y por eso se volvió el estándar.' },

        { p: '¿Por qué el modelo no sabe cosas recientes?',
          r: 'Porque el conocimiento se fija en el pre-entrenamiento, que tiene una fecha de corte. Todo lo posterior no está en los pesos. ' +
             'Y lo importante es que <b>el modelo tampoco sabe que no sabe</b>: si le preguntás por un hecho posterior al corte, va a generar la ' +
             'continuación más probable, que puede ser una invención perfectamente verosímil. La solución no es un prompt mejor: es darle la ' +
             'información por RAG o por una herramienta de búsqueda.' },
      ],

      practica: `
<h4>Qué se deduce de esto para tu sistema</h4>

<p><b>1 · Nunca confíes en el conocimiento interno para datos con fecha.</b> Precios, versiones de librerías,
normativa, quién dirige una empresa: todo eso hay que dárselo. La pregunta que conviene hacerse antes de cada
feature es "¿esto puede haber cambiado desde el entrenamiento?". Si la respuesta es sí, va por RAG o por tool.</p>

<p><b>2 · El formato de chat es un artefacto del SFT.</b> Los roles <code>system</code>, <code>user</code> y
<code>assistant</code> no son magia: son tokens especiales que el modelo aprendió a interpretar en esa etapa.
Por eso respetar el formato del proveedor importa, y por eso el <i>prefill del assistant</i> funciona tan bien:
estás completando un turno que el modelo ya sabe cómo continuar.</p>

<p><b>3 · Elegí el tipo de modelo según la tarea.</b></p>
<table>
<tr><th>Tarea</th><th>Tipo de modelo</th><th>Por qué</th></tr>
<tr><td>Extraer campos de un documento</td><td>Modelo chico y rápido</td><td>No hay nada que razonar: hay que copiar bien.</td></tr>
<tr><td>Resumir una conversación</td><td>Modelo mediano</td><td>Necesita comprensión, no cadenas de razonamiento.</td></tr>
<tr><td>Depurar un bug complejo</td><td>Modelo de razonamiento</td><td>Las cadenas largas de razonamiento pagan de verdad acá.</td></tr>
<tr><td>Clasificar en categorías fijas</td><td>Modelo chico, o afinado</td><td>Un modelo de razonamiento acá es tirar plata y latencia.</td></tr>
</table>

<div class="aviso"><strong>Error de costo frecuente:</strong> usar un modelo de razonamiento para tareas que no
razonan. Generan muchos tokens de pensamiento —que pagás— y agregan segundos de latencia sin mejorar el
resultado en una extracción o un resumen. <b>El razonamiento se reserva para problemas con varios pasos y una
respuesta verificable.</b></div>
`,

      errores: [
        { mito: 'El modelo se actualiza solo con el tiempo.',
          realidad: 'Los pesos son fijos. Un modelo entrenado con corte en cierta fecha va a saber exactamente lo mismo dentro de dos años. ' +
                    'Lo que cambia es que el proveedor publica <b>modelos nuevos</b>. Cualquier información actualizada tenés que dársela vos, ' +
                    'por contexto o por herramientas.' },

        { mito: 'Si le digo que estamos en 2026, va a saber cosas de 2026.',
          realidad: 'Decirle la fecha le da <i>consciencia</i> de la fecha, no <i>conocimiento</i> de lo que pasó. Puede ayudar a que diga ' +
                    '"eso es posterior a mi entrenamiento", pero no hace aparecer información que no está en los pesos. ' +
                    '<b>Es un malentendido común y una fuente segura de alucinaciones.</b>' },

        { mito: 'RLHF hace que el modelo sea más inteligente.',
          realidad: 'Lo hace más <b>útil y más seguro</b>, no más capaz. La capacidad bruta viene del pre-entrenamiento. De hecho, la alineación ' +
                    'puede reducir levemente algunas capacidades del modelo base a cambio de utilidad y control: es un compromiso deliberado, ' +
                    'y se lo llama <i>alignment tax</i>.' },

        { mito: 'Los modelos de razonamiento son mejores para todo.',
          realidad: 'Son mejores donde hay <b>varios pasos y una respuesta verificable</b>: matemática, lógica, depuración. Para extracción, ' +
                    'clasificación o resumen no aportan y cuestan bastante más en tokens de pensamiento y en latencia. Elegir el modelo por tarea ' +
                    'es una de las decisiones de costo más rentables que vas a tomar.' },
      ],

      glosario: [
        { t: 'Pre-entrenamiento', d: 'Primera etapa, auto-supervisada sobre corpus masivos. Es donde el modelo adquiere su conocimiento.' },
        { t: 'Modelo base', d: 'El resultado del pre-entrenamiento. Continúa texto pero no sigue instrucciones ni conversa.' },
        { t: 'SFT', d: 'Supervised Fine-Tuning. Ajuste con pares instrucción-respuesta que convierte el modelo base en un asistente.' },
        { t: 'RLHF', d: 'Reinforcement Learning from Human Feedback. Alineación mediante un reward model entrenado con preferencias humanas.' },
        { t: 'DPO', d: 'Direct Preference Optimization. Alternativa a RLHF que optimiza directamente sobre pares de preferencia, sin RL.' },
        { t: 'Reward model', d: 'Modelo auxiliar que predice qué respuesta preferiría un humano. Componente central de RLHF.' },
        { t: 'Constitutional AI', d: 'Método donde el modelo critica y corrige sus propias respuestas contra principios explícitos.' },
        { t: 'Fecha de corte', d: 'Límite temporal de los datos de entrenamiento. El modelo no tiene conocimiento posterior a esa fecha.' },
        { t: 'Leyes de escalado', d: 'Relaciones empíricas entre cómputo, tamaño del modelo y datos que guían cómo repartir el presupuesto de entrenamiento.' },
        { t: 'Alignment tax', d: 'Pérdida leve de capacidad bruta que puede producir la alineación, a cambio de utilidad y seguridad.' },
        { t: 'Modelo de razonamiento', d: 'Modelo entrenado para generar cadenas largas de razonamiento antes de responder. Más lento y caro, mejor en problemas de varios pasos.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l5',
      titulo: 'La ventana de contexto: por qué "se olvida"',
      minutos: 8,
      fuentes: ['paper-lost-middle', 'anthropic'],

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el modelo tiene un escritorio de tamaño fijo.
Todo lo que necesita para responder tiene que estar sobre ese escritorio al mismo tiempo. Lo que no entra,
no existe.</div>

<p>La <b>ventana de contexto</b> es cuántos tokens caben en una llamada. Y "caben" incluye absolutamente todo:</p>
<ul>
<li>El system prompt (tus instrucciones)</li>
<li>Las definiciones de las herramientas disponibles</li>
<li>Todo el historial de la conversación</li>
<li>Los documentos que recuperaste con RAG</li>
<li>El mensaje actual del usuario</li>
<li><b>Y la respuesta que se está generando</b></li>
</ul>

<h4>Entonces, ¿por qué "se olvida"?</h4>
<p>Porque no se olvida: <b>nunca lo recibió</b>. Como la API no tiene memoria, tu aplicación reenvía el
historial en cada llamada. Cuando ese historial ya no entra, hay que recortarlo — y lo que se recorta,
sencillamente no llegó.</p>
<p>Por eso pasa lo típico: le decís tu nombre al principio, hablás cuarenta mensajes, y de golpe no sabe cómo
te llamás. No se olvidó. Tu sistema recortó ese mensaje para hacer lugar.</p>

<h4>Y hay algo peor que quedarse afuera: quedar en el medio</h4>
<p>Está bien medido que los modelos atienden <b>mejor el principio y el final</b> del contexto que el medio.
Se lo llama <i>lost in the middle</i>. Un dato enterrado en la mitad de 100.000 tokens puede ser ignorado
aunque técnicamente esté ahí.</p>

<div class="aviso"><strong>Las dos reglas que se deducen de esto:</strong><br>
<b>1 · Reservá siempre espacio para la respuesta.</b> Si llenás la ventana de contexto, el modelo se queda sin
lugar para contestar y te corta la respuesta a la mitad.<br>
<b>2 · Poné lo importante al principio o al final.</b> Nunca en el medio.</div>
`,

      tecnico: `
<h4>Cómo se reparte la ventana</h4>
<pre><code>ventana_total
  = system_prompt
  + definiciones_de_tools
  + historial
  + contexto_recuperado
  + mensaje_actual
  + max_tokens_de_salida     ← reservar SIEMPRE</code></pre>
<p>Exceder el límite produce un error de la API, no un recorte automático. La gestión del presupuesto de
tokens es responsabilidad de tu aplicación.</p>

<h4>Estrategias de manejo del historial</h4>
<table>
<tr><th>Estrategia</th><th>Cómo funciona</th><th>Cuándo conviene</th></tr>
<tr><td><b>Ventana deslizante</b></td><td>Conservar los últimos N mensajes</td><td>Simple y suficiente en chats cortos</td></tr>
<tr><td><b>Resumen progresivo</b></td><td>Al superar un umbral, resumir lo viejo con el propio modelo y reemplazarlo</td><td>Conversaciones largas donde el contexto temprano importa</td></tr>
<tr><td><b>Memoria estructurada</b></td><td>Extraer hechos ("se llama X", "prefiere Y") a un almacén y reinyectarlos</td><td>Asistentes personales, sesiones que se retoman</td></tr>
<tr><td><b>RAG sobre el historial</b></td><td>Indexar la conversación y recuperar solo los fragmentos relevantes</td><td>Historiales muy largos con temas variados</td></tr>
</table>

<h4>Ventana grande no es lo mismo que uso efectivo</h4>
<p>Que un modelo declare 200K tokens no significa que rinda igual en todo ese rango. Los benchmarks tipo
<i>needle in a haystack</i> —esconder un dato y pedir que lo encuentre— muestran degradación variable según
la posición, y se agrava cuando hay que combinar <b>varios</b> datos dispersos en el contexto.</p>

<div class="dato"><strong>Efecto colateral que sorprende:</strong> con contextos muy largos el modelo tiende a
<b>seguir peor las instrucciones del system prompt</b>. Compiten por atención con decenas de miles de tokens de
contenido. Si tenés reglas críticas de formato, conviene <b>repetirlas cerca del final</b>, además de tenerlas
en el system prompt.</div>

<h4>Cómo se relaciona con el costo</h4>
<ul>
<li>Los tokens de entrada se pagan <b>en cada llamada</b>. Un contexto de 50K tokens repetido 1.000 veces al día son 50 millones de tokens diarios.</li>
<li>La atención es cuadrática: contexto más largo también implica más latencia de prefill, no solo más dinero.</li>
<li><b>El prompt caching</b> es el gran mitigador: si el prefijo largo es estable, se cachea y el descuento sobre esos tokens es enorme.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="28" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA VENTANA DE CONTEXTO — todo tiene que entrar acá adentro</text>

  <rect x="24" y="40" width="632" height="66" rx="10" fill="none" stroke="currentColor" stroke-opacity=".3" stroke-width="1.6"/>

  <rect x="30" y="46" width="86" height="54" rx="7" fill="#7c5cff" fill-opacity=".3" stroke="#7c5cff" stroke-width="1.2"/>
  <text x="73" y="70" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">SYSTEM</text>
  <text x="73" y="86" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">fijo · cacheable</text>

  <rect x="120" y="46" width="76" height="54" rx="7" fill="#c084fc" fill-opacity=".3" stroke="#c084fc" stroke-width="1.2"/>
  <text x="158" y="70" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">TOOLS</text>
  <text x="158" y="86" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">fijo · cacheable</text>

  <rect x="200" y="46" width="170" height="54" rx="7" fill="#fbbf24" fill-opacity=".28" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="285" y="70" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">HISTORIAL</text>
  <text x="285" y="86" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">crece sin techo ⚠</text>

  <rect x="374" y="46" width="140" height="54" rx="7" fill="#34d399" fill-opacity=".28" stroke="#34d399" stroke-width="1.2"/>
  <text x="444" y="70" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">CONTEXTO RAG</text>
  <text x="444" y="86" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">cambia por consulta</text>

  <rect x="518" y="46" width="60" height="54" rx="7" fill="#22d3ee" fill-opacity=".28" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="548" y="70" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">USER</text>

  <rect x="582" y="46" width="68" height="54" rx="7" fill="#f87171" fill-opacity=".28" stroke="#f87171" stroke-width="1.6" stroke-dasharray="4 3"/>
  <text x="616" y="66" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">SALIDA</text>
  <text x="616" y="82" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">RESERVAR</text>
  <text x="616" y="94" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">SIEMPRE</text>

  <text x="24" y="132" fill="#f87171" font-size="11.5">Si no reservás el último bloque, la respuesta se corta a la mitad.</text>

  <line x1="24" y1="152" x2="656" y2="152" stroke="currentColor" opacity=".18"/>

  <text x="24" y="180" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    ATENCIÓN EFECTIVA SEGÚN LA POSICIÓN  ·  “lost in the middle”</text>

  <path d="M 40 286 C 130 200, 200 300, 340 296 C 480 300, 550 200, 640 254"
        fill="none" stroke="#22d3ee" stroke-width="2.6"/>
  <line x1="40" y1="300" x2="640" y2="300" stroke="currentColor" opacity=".25"/>
  <line x1="40" y1="300" x2="40" y2="196" stroke="currentColor" opacity=".25"/>

  <text x="46" y="316" fill="currentColor" opacity=".6" font-size="11">principio</text>
  <text x="326" y="316" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">medio</text>
  <text x="614" y="316" fill="currentColor" opacity=".6" font-size="11">final</text>
  <text x="16" y="196" fill="currentColor" opacity=".5" font-size="10" transform="rotate(-90 16 196)">atención</text>

  <text x="326" y="336" text-anchor="middle" fill="currentColor" opacity=".55" font-size="11.5">
    poné lo importante al principio o al final — nunca sepultado en el medio</text>
</svg>`,
        pie: 'Arriba, cómo se reparte la ventana. Abajo, por qué la posición dentro del contexto importa.',
      },

      entrevista: [
        { p: '¿Qué es la ventana de contexto y qué incluye?',
          r: 'Es la cantidad máxima de tokens que el modelo puede manejar en una sola llamada. Incluye <b>todo</b>: system prompt, definiciones de ' +
             'herramientas, historial completo, contexto recuperado, el mensaje del usuario y también la respuesta que se va a generar. ' +
             'Ese último punto es el que más se olvida: si llenás la ventana con entrada, el modelo se queda sin espacio para responder. ' +
             '<b>Siempre hay que reservar el máximo de tokens de salida antes de repartir el resto.</b>' },

        { p: 'Tu chatbot "se olvida" de lo que le dijeron al principio. ¿Qué pasa y cómo lo resolvés?',
          r: 'No se olvida: nunca lo recibió. La API no tiene estado, así que el historial lo reenvía mi aplicación, y cuando deja de entrar hay que ' +
             'recortarlo. Lo resolvería según el caso: <b>ventana deslizante</b> si alcanza con lo reciente; <b>resumen progresivo</b> si el contexto ' +
             'temprano importa —resumir lo viejo con el propio modelo y reemplazarlo—; o <b>memoria estructurada</b>, extrayendo hechos estables como ' +
             'el nombre o las preferencias a un almacén aparte y reinyectándolos siempre. Esa última opción es la más robusta y la más barata.' },

        { p: '¿Qué es el "lost in the middle"?',
          r: 'Es el fenómeno por el cual los modelos recuperan mejor la información ubicada al principio o al final del contexto que la del medio. ' +
             'Está medido con benchmarks tipo <i>needle in a haystack</i> y se agrava cuando hay que combinar varios datos dispersos. ' +
             'La implicancia práctica es doble: <b>ubicar lo crítico en los extremos del prompt</b>, y desconfiar de la idea de que "si está en el ' +
             'contexto, el modelo lo va a usar". Es una de las razones por las que RAG sigue siendo útil aunque las ventanas sean enormes.' },
      ],

      practica: `
<h4>Orden recomendado del prompt</h4>
<pre><code>1. System prompt          ← fijo, cacheable, va PRIMERO
2. Definiciones de tools  ← fijo, cacheable
3. Contexto recuperado    ← lo más relevante primero
4. Historial (resumido)
5. Mensaje del usuario    ← al FINAL, es lo más importante
6. [reservado para la salida]</code></pre>
<p>Dos razones lo justifican: <b>el caching</b> exige que lo fijo esté al principio y sea idéntico byte a byte,
y <b>la atención</b> favorece los extremos, así que la pregunta actual conviene al final.</p>

<h4>Resumen progresivo, el patrón más útil</h4>
<pre><code>async function armarHistorial(mensajes, limite) {
  if (contar(mensajes) &lt;= limite) return mensajes;

  const viejos = mensajes.slice(0, -8);      // todo menos los últimos 8
  const recientes = mensajes.slice(-8);

  const resumen = await resumir(viejos);      // una llamada barata, modelo chico

  return [
    { role: 'user', content: \`Resumen de la conversación previa:\\n\${resumen}\` },
    ...recientes,
  ];
}</code></pre>

<div class="aviso"><strong>Detalle importante:</strong> resumí con un modelo <b>chico y barato</b>. Es una tarea
mecánica y no justifica el modelo principal. Y guardá el resumen: si lo recalculás en cada mensaje, la
optimización te termina costando más que el problema que venía a resolver.</div>

<h4>Cómo saber si tenés un problema de contexto</h4>
<table>
<tr><th>Síntoma</th><th>Causa probable</th></tr>
<tr><td>Ignora instrucciones del system prompt en conversaciones largas</td><td>El system compite con demasiado contexto. Repetí las reglas críticas cerca del final.</td></tr>
<tr><td>La respuesta se corta a la mitad</td><td>No reservaste tokens de salida.</td></tr>
<tr><td>No usa un dato que sí está en el contexto</td><td>Lost in the middle. Movelo a un extremo o reducí el contexto.</td></tr>
<tr><td>Costo alto y creciente en chats</td><td>Historial sin recorte ni resumen.</td></tr>
</table>
`,

      errores: [
        { mito: 'El modelo se acuerda de la conversación.',
          realidad: 'La API es sin estado. La "memoria" es tu aplicación reenviando el historial en cada llamada. Todo lo que parezca memoria ' +
                    '—recordar el nombre, retomar una sesión de ayer— <b>lo tenés que construir vos</b>.' },

        { mito: 'Con una ventana de 200K puedo mandar lo que quiera.',
          realidad: 'Podés, pero pagás todos esos tokens <b>en cada llamada</b> y la atención se degrada sobre el contenido del medio. ' +
                    'Ventana grande es un techo, no una recomendación: sirve para no tener que recortar agresivamente, no para dejar de elegir qué mandás.' },

        { mito: 'Si el dato está en el contexto, el modelo lo va a usar.',
          realidad: 'No necesariamente. El <i>lost in the middle</i> está bien documentado: la información sepultada en el medio de un contexto ' +
                    'largo se atiende peor. <b>Cinco fragmentos bien elegidos le ganan a cincuenta mediocres</b>, en calidad y en costo.' },

        { mito: 'Si no entra, recorto los mensajes más viejos y listo.',
          realidad: 'Es lo más simple, pero suele borrar justo lo que definía la tarea: las instrucciones iniciales del usuario. ' +
                    'Un <b>resumen progresivo</b> —o extraer los hechos estables a una memoria aparte— conserva lo importante a una fracción del costo.' },
      ],

      glosario: [
        { t: 'Ventana de contexto', d: 'Máximo de tokens que el modelo procesa en una llamada, incluyendo la respuesta generada.' },
        { t: 'Lost in the middle', d: 'Degradación de la atención sobre la información ubicada en el centro de un contexto largo.' },
        { t: 'Needle in a haystack', d: 'Prueba que esconde un dato en un contexto muy largo y mide si el modelo lo encuentra.' },
        { t: 'Ventana deslizante', d: 'Estrategia que conserva solo los últimos N mensajes del historial.' },
        { t: 'Resumen progresivo', d: 'Reemplazar el historial antiguo por un resumen generado por el propio modelo.' },
        { t: 'Memoria estructurada', d: 'Extraer hechos estables sobre el usuario a un almacén aparte y reinyectarlos en cada llamada.' },
        { t: 'max_tokens', d: 'Parámetro que limita cuántos tokens puede generar el modelo. Se descuenta de la ventana disponible.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l6',
      titulo: 'Temperatura y sampling: por qué no responde siempre igual',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el modelo te da una lista de candidatos con sus
probabilidades. La <b>temperatura</b> decide si elegís siempre al favorito o si le das chance a los demás.</div>

<p>Volvamos al ejemplo. Ante <i>"El cielo está"</i>, el modelo calcula:</p>
<ul>
<li><code>despejado</code> → 40%</li>
<li><code>nublado</code> → 30%</li>
<li><code>gris</code> → 15%</li>
<li><code>azul</code> → 10%</li>
<li>otros → 5%</li>
</ul>

<p>Ahora hay que <b>elegir uno</b>. Y ahí entra la temperatura:</p>

<table>
<tr><th>Temperatura</th><th>Qué hace</th><th>Resultado</th></tr>
<tr><td><b>0</b></td><td>Siempre el más probable</td><td>Determinista y repetible. Elige "despejado" todas las veces.</td></tr>
<tr><td><b>0,3 – 0,7</b></td><td>Favorece a los probables pero deja variar</td><td>Equilibrio. El uso general.</td></tr>
<tr><td><b>1,0+</b></td><td>Aplana las diferencias</td><td>Creativo y variado. También más propenso a irse al pasto.</td></tr>
</table>

<p>Pensalo así: la temperatura no cambia lo que el modelo <i>sabe</i>. Cambia cuánto riesgo toma al elegir.
Temperatura alta no lo hace más creativo en el sentido de tener mejores ideas: lo hace <b>menos predecible</b>,
lo cual a veces se parece a la creatividad y a veces a decir cualquier cosa.</p>

<div class="aviso"><strong>La regla que resuelve el 90% de los casos:</strong><br>
<b>Si hay una respuesta correcta, temperatura 0.</b> Extracción de datos, clasificación, generación de JSON,
respuestas basadas en documentos.<br>
<b>Si hay muchas respuestas válidas, subila.</b> Redacción, ideas, variantes de un texto.</div>
`,

      tecnico: `
<h4>Temperatura</h4>
<p>La temperatura divide los logits antes del softmax:</p>
<pre><code>P(token) = softmax( logits / T )</code></pre>
<ul>
<li><b>T &lt; 1</b> — agranda las diferencias entre logits: la distribución se vuelve más picuda y el token más probable se lleva casi toda la masa.</li>
<li><b>T = 1</b> — la distribución original que aprendió el modelo.</li>
<li><b>T &gt; 1</b> — aplana la distribución: los tokens improbables ganan chance.</li>
<li><b>T = 0</b> — es un caso especial implementado como <i>greedy decoding</i>: se toma siempre el argmax, sin muestreo.</li>
</ul>

<h4>Otros parámetros de muestreo</h4>
<table>
<tr><th>Parámetro</th><th>Qué hace</th><th>Uso típico</th></tr>
<tr><td><b>top_p</b> (nucleus)</td><td>Considera solo los tokens cuya probabilidad acumulada llega a p, y muestrea entre ellos</td><td>0,9 – 0,95. Se adapta mejor que top_k a la forma de la distribución</td></tr>
<tr><td><b>top_k</b></td><td>Considera solo los k tokens más probables</td><td>Menos usado hoy: un k fijo funciona mal cuando la distribución cambia de forma</td></tr>
<tr><td><b>frequency_penalty</b></td><td>Penaliza tokens según cuántas veces ya aparecieron</td><td>Reducir repeticiones en textos largos</td></tr>
<tr><td><b>presence_penalty</b></td><td>Penaliza tokens que ya aparecieron, sin importar cuántas veces</td><td>Empujar hacia vocabulario nuevo</td></tr>
<tr><td><b>stop sequences</b></td><td>Cortan la generación al aparecer una cadena</td><td>Delimitar salidas estructuradas</td></tr>
</table>
<p>Recomendación estándar: <b>ajustar temperatura o top_p, no los dos a la vez</b>. Combinarlos vuelve el
comportamiento difícil de razonar y de reproducir.</p>

<div class="dato"><strong>Temperatura 0 no garantiza determinismo perfecto.</strong> En la práctica influyen el
paralelismo de la GPU y el orden no determinista de las operaciones en punto flotante, el <i>batching</i> junto
a otros usuarios, y las actualizaciones del modelo del lado del proveedor. Con T=0 obtenés <b>alta
reproducibilidad</b>, no una garantía criptográfica. Es un matiz que se valora en entrevistas, y explica por
qué los tests de salidas de LLM no deben comparar cadenas exactas.</div>

<h4>Valores por caso de uso</h4>
<table>
<tr><th>Caso</th><th>Temperatura</th></tr>
<tr><td>Extracción de datos estructurados</td><td>0</td></tr>
<tr><td>Clasificación</td><td>0</td></tr>
<tr><td>Preguntas sobre documentos (RAG)</td><td>0 – 0,2</td></tr>
<tr><td>Generación de código</td><td>0 – 0,3</td></tr>
<tr><td>Resumen</td><td>0,2 – 0,4</td></tr>
<tr><td>Redacción, tono de marca</td><td>0,6 – 0,9</td></tr>
<tr><td>Lluvia de ideas, variantes</td><td>0,9 – 1,2</td></tr>
</table>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="26" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA MISMA DISTRIBUCIÓN, TRES TEMPERATURAS</text>

  <text x="24" y="58" fill="#34d399" font-size="13" font-weight="700">T = 0</text>
  <text x="86" y="58" fill="currentColor" opacity=".5" font-size="11">determinista · siempre el favorito</text>
  <rect x="24"  y="66" width="200" height="22" rx="4" fill="#34d399" fill-opacity=".9"/>
  <rect x="230" y="66" width="4"   height="22" rx="2" fill="currentColor" opacity=".2"/>
  <rect x="240" y="66" width="3"   height="22" rx="1.5" fill="currentColor" opacity=".2"/>
  <rect x="249" y="66" width="2"   height="22" rx="1" fill="currentColor" opacity=".2"/>
  <text x="270" y="82" fill="currentColor" opacity=".55" font-size="11">“despejado” el 100% de las veces</text>

  <text x="24" y="128" fill="#fbbf24" font-size="13" font-weight="700">T = 0.7</text>
  <text x="86" y="128" fill="currentColor" opacity=".5" font-size="11">equilibrado · el uso general</text>
  <rect x="24"  y="136" width="112" height="22" rx="4" fill="#fbbf24" fill-opacity=".85"/>
  <rect x="142" y="136" width="84"  height="22" rx="4" fill="#fbbf24" fill-opacity=".6"/>
  <rect x="232" y="136" width="42"  height="22" rx="4" fill="#fbbf24" fill-opacity=".4"/>
  <rect x="280" y="136" width="28"  height="22" rx="4" fill="#fbbf24" fill-opacity=".28"/>
  <text x="322" y="152" fill="currentColor" opacity=".55" font-size="11">varía, pero se mantiene razonable</text>

  <text x="24" y="198" fill="#f87171" font-size="13" font-weight="700">T = 1.5</text>
  <text x="86" y="198" fill="currentColor" opacity=".5" font-size="11">aplanado · impredecible</text>
  <rect x="24"  y="206" width="66" height="22" rx="4" fill="#f87171" fill-opacity=".7"/>
  <rect x="96"  y="206" width="60" height="22" rx="4" fill="#f87171" fill-opacity=".6"/>
  <rect x="162" y="206" width="54" height="22" rx="4" fill="#f87171" fill-opacity=".5"/>
  <rect x="222" y="206" width="50" height="22" rx="4" fill="#f87171" fill-opacity=".42"/>
  <rect x="278" y="206" width="46" height="22" rx="4" fill="#f87171" fill-opacity=".34"/>
  <rect x="330" y="206" width="42" height="22" rx="4" fill="#f87171" fill-opacity=".26"/>
  <text x="386" y="222" fill="currentColor" opacity=".55" font-size="11">cualquiera puede salir · más creativo y más errático</text>

  <line x1="24" y1="252" x2="656" y2="252" stroke="currentColor" opacity=".18"/>

  <rect x="24" y="270" width="308" height="56" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="44" y="292" fill="#34d399" font-size="12.5" font-weight="700">¿Hay UNA respuesta correcta?</text>
  <text x="44" y="313" fill="currentColor" opacity=".7" font-size="11.5">extracción · clasificación · JSON · RAG  →  T = 0</text>

  <rect x="348" y="270" width="308" height="56" rx="10" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="368" y="292" fill="#fbbf24" font-size="12.5" font-weight="700">¿Hay MUCHAS respuestas válidas?</text>
  <text x="368" y="313" fill="currentColor" opacity=".7" font-size="11.5">redacción · ideas · variantes  →  T = 0.7 – 1.0</text>
</svg>`,
        pie: 'La temperatura no cambia lo que el modelo sabe: cambia cuánto riesgo toma al elegir entre lo que ya calculó.',
      },

      entrevista: [
        { p: '¿Qué es la temperatura y cómo la elegís?',
          r: 'Es un parámetro que divide los logits antes del softmax, controlando cuán picuda o plana queda la distribución del token siguiente. ' +
             'Con temperatura baja el modelo se queda casi siempre con el más probable; con temperatura alta, los improbables ganan chance. ' +
             '<b>El criterio es simple: si existe una respuesta correcta, temperatura 0</b> —extracción, clasificación, JSON, respuestas basadas en ' +
             'documentos—. Si hay muchas salidas válidas y quiero variedad, la subo. Y ajusto temperatura <i>o</i> top_p, no los dos juntos.' },

        { p: 'Con temperatura 0, ¿la salida es siempre idéntica?',
          r: 'Es <b>altamente reproducible pero no garantizada</b>. Con T=0 el muestreo es greedy, así que la fuente de aleatoriedad desaparece, ' +
             'pero quedan otras: el orden no determinista de las operaciones en punto flotante sobre GPU, el batching junto a otras peticiones, ' +
             'y actualizaciones del modelo del lado del proveedor. La consecuencia práctica es concreta: ' +
             '<b>los tests sobre salidas de LLM no deben comparar cadenas exactas</b>, sino validar estructura y propiedades.' },

        { p: '¿Cuál es la diferencia entre temperature y top_p?',
          r: '<b>Temperature</b> reescala toda la distribución antes de muestrear: cambia la forma de la curva. <b>Top_p</b> —o nucleus sampling— ' +
             'no la reescala: recorta la cola, quedándose con el conjunto más chico de tokens cuya probabilidad acumulada alcanza p, y muestrea ahí ' +
             'dentro. La ventaja de top_p es que se adapta: si la distribución es muy picuda considera pocos candidatos, y si es plana considera más. ' +
             'Por eso se prefiere sobre top_k, que usa un número fijo sin importar la forma de la distribución.' },
      ],

      practica: `
<h4>Configuraciones que conviene tener a mano</h4>
<pre><code>// Extracción de datos: cero margen para la creatividad
{ temperature: 0, max_tokens: 1024 }

// Respuesta sobre documentos recuperados
{ temperature: 0.1, max_tokens: 2048 }

// Redacción con tono de marca
{ temperature: 0.8, max_tokens: 1500 }

// Variantes de un mismo texto: mismo prompt, varias llamadas
{ temperature: 1.0, max_tokens: 400 }</code></pre>

<div class="aviso"><strong>El error más caro de esta lección:</strong> dejar la temperatura por defecto (que
suele ser 1) en una tarea de extracción. Vas a tener un porcentaje de salidas con formato distinto,
campos inventados y JSON inválido — y lo peor es que <b>en las pruebas manuales no se nota</b>, porque los
primeros diez casos salen bien. Aparece en producción, con volumen, como un goteo de errores raros.</div>

<h4>Cómo testear algo no determinista</h4>
<p>No compares texto exacto. Validá propiedades:</p>
<pre><code>// ❌ Se rompe con cualquier variación
expect(salida).toBe('{"nombre":"Ana","edad":30}');

// ✅ Valida lo que realmente importa
const r = EsquemaPersona.parse(JSON.parse(salida));
expect(r.nombre).toBe('Ana');
expect(r.edad).toBe(30);</code></pre>
<p>Y para tareas críticas, corré el mismo caso varias veces y medí la <b>tasa de acierto</b>. Que funcione una
vez no dice nada; que funcione 19 de 20 veces sí.</p>
`,

      errores: [
        { mito: 'Temperatura alta hace al modelo más inteligente o más creativo.',
          realidad: 'Lo hace más <b>impredecible</b>. No genera mejores ideas: genera más variedad, incluida más variedad de errores. ' +
                    'La creatividad útil suele venir de un buen prompt y de buenos ejemplos, no de subir la temperatura.' },

        { mito: 'Temperatura 0 garantiza la misma salida siempre.',
          realidad: 'Da alta reproducibilidad, no una garantía. El no determinismo de punto flotante en GPU, el batching y las actualizaciones ' +
                    'del proveedor pueden cambiar el resultado. <b>Nunca escribas tests que comparen la salida carácter por carácter.</b>' },

        { mito: 'Conviene ajustar temperature y top_p juntos para afinar mejor.',
          realidad: 'Interactúan de forma difícil de razonar y hacen el comportamiento casi imposible de reproducir o depurar. ' +
                    'La recomendación de todos los proveedores es <b>mover uno solo</b> y dejar el otro en su valor por defecto.' },

        { mito: 'La temperatura afecta la calidad del contenido.',
          realidad: 'Afecta la <b>selección</b> entre lo que el modelo ya calculó, no lo que sabe. Si la respuesta correcta no está entre los ' +
                    'candidatos probables, ninguna temperatura te la va a traer. Eso es un problema de contexto o de modelo, no de muestreo.' },
      ],

      glosario: [
        { t: 'Temperatura', d: 'Parámetro que divide los logits antes del softmax, controlando cuán concentrada queda la distribución.' },
        { t: 'Greedy decoding', d: 'Elegir siempre el token más probable. Es lo que ocurre con temperatura 0.' },
        { t: 'Top_p (nucleus sampling)', d: 'Muestrear solo entre los tokens cuya probabilidad acumulada alcanza p. Se adapta a la forma de la distribución.' },
        { t: 'Top_k', d: 'Muestrear solo entre los k tokens más probables. Menos usado por no adaptarse a la distribución.' },
        { t: 'Frequency penalty', d: 'Penalización proporcional a cuántas veces apareció ya un token. Reduce repeticiones.' },
        { t: 'Presence penalty', d: 'Penalización fija a los tokens que ya aparecieron. Empuja hacia vocabulario nuevo.' },
        { t: 'Stop sequence', d: 'Cadena que corta la generación al aparecer. Útil para delimitar salidas estructuradas.' },
        { t: 'Determinismo', d: 'Que la misma entrada produzca siempre la misma salida. Con LLMs es aproximado, nunca garantizado.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l7',
      titulo: 'Por qué alucina, y qué hacer al respecto',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el modelo nunca se queda callado. Siempre hay un
token más probable que los otros — <b>incluso cuando la respuesta correcta no existe</b>. Esa es la alucinación,
y es una consecuencia del diseño, no una falla.</div>

<p>Una <b>alucinación</b> es cuando el modelo afirma algo falso con total naturalidad: inventa una función de
una librería, una cita de un paper, un artículo de una ley, un número. Y lo dice con la misma seguridad con la
que dice algo cierto, porque <b>internamente no hay ninguna diferencia entre ambos casos</b>. En los dos generó
la continuación más probable.</p>

<h4>De dónde salen las alucinaciones</h4>

<p><b>1 · No lo sabe, pero igual tiene que contestar algo.</b> Le preguntás por algo posterior a su fecha de
corte, o directamente inexistente. No hay una casilla "no sé": hay una distribución de probabilidad, y algo va
a salir.</p>

<p><b>2 · Lo sabe a medias.</b> Vio el tema pocas veces en el entrenamiento. Tiene el patrón general —cómo se
ve el nombre de una función de esa librería— pero no el dato exacto. Entonces genera algo con la <i>forma</i>
correcta y el <i>contenido</i> inventado. Por eso las funciones inventadas siempre suenan tan plausibles.</p>

<p><b>3 · El contexto que le diste no alcanzaba.</b> En un sistema RAG, esta es la causa más frecuente de lejos.
Recuperaste cinco fragmentos, ninguno tenía la respuesta, y el modelo completó el hueco. <b>Técnicamente
alucinó, pero el error fue tuyo.</b></p>

<p><b>4 · La pregunta daba por sentado algo falso.</b> Si preguntás "¿por qué la ley 27.999 prohíbe X?", el
modelo tiende a aceptar la premisa y explicarte por qué. Se llama <i>sycophancy</i>: la alineación lo empuja a
ser servicial, y contradecirte no se siente servicial.</p>

<h4>Qué hacer</h4>
<table>
<tr><th>Medida</th><th>Cuánto ayuda</th></tr>
<tr><td><b>Darle el contexto correcto</b> (RAG bien hecho)</td><td>Muchísimo. Es la medida principal.</td></tr>
<tr><td><b>Exigir citas</b> del fragmento de origen</td><td>Mucho. Además te permite verificar.</td></tr>
<tr><td><b>Autorizarlo explícitamente a decir "no sé"</b></td><td>Bastante, y es gratis.</td></tr>
<tr><td><b>Temperatura 0</b> en tareas factuales</td><td>Algo.</td></tr>
<tr><td><b>Verificar con código</b> lo verificable</td><td>Total, donde aplica.</td></tr>
<tr><td>Pedirle "no alucines"</td><td><b>Nada.</b> No sabe cuándo está alucinando.</td></tr>
</table>

<div class="aviso"><strong>Lo más importante de esta lección:</strong> la alucinación <b>no se elimina</b>, se
gestiona. Cualquier sistema que dependa de que el modelo nunca se equivoque está mal diseñado. Los sistemas
buenos asumen que va a equivocarse y hacen que el error sea <b>detectable y barato</b>.</div>
`,

      tecnico: `
<h4>Taxonomía</h4>
<ul>
<li><b>Alucinación intrínseca</b> — contradice el contexto que se le dio. Suele indicar un prompt confuso, contexto contradictorio, o exceso de longitud.</li>
<li><b>Alucinación extrínseca</b> — afirma algo no verificable con el contexto provisto. Es la más común y la más difícil de detectar automáticamente.</li>
<li><b>Falla de fidelidad (<i>faithfulness</i>)</b> — en RAG, cuando la respuesta no está sustentada por los fragmentos recuperados. Es la métrica central de evaluación de un sistema RAG.</li>
</ul>

<h4>Causas, en orden de frecuencia real</h4>
<ol>
<li><b>Falla de recuperación.</b> El fragmento correcto nunca entró al prompt. En sistemas RAG es la causa dominante, y por eso <i>context recall</i> se mide antes que cualquier métrica de generación.</li>
<li><b>Conocimiento paramétrico escaso.</b> Hechos de cola larga, poco representados en el entrenamiento.</li>
<li><b>Conflicto entre contexto y pesos.</b> El contexto dice A y el conocimiento interno dice B. El modelo puede priorizar cualquiera; hay que instruirlo explícitamente sobre cuál manda.</li>
<li><b>Degradación por contexto largo.</b> Lost in the middle, o instrucciones diluidas entre demasiados tokens.</li>
<li><b>Sycophancy.</b> La alineación premia la utilidad percibida, lo que sesga hacia aceptar premisas del usuario.</li>
</ol>

<h4>Mitigaciones, por capa del sistema</h4>
<table>
<tr><th>Capa</th><th>Medida</th></tr>
<tr><td><b>Recuperación</b></td><td>Búsqueda híbrida, re-ranking, umbral mínimo de similitud, medir context recall</td></tr>
<tr><td><b>Prompt</b></td><td>"Respondé <i>solo</i> con el contexto provisto. Si no está, decí que no tenés esa información." Autorización explícita a abstenerse.</td></tr>
<tr><td><b>Salida</b></td><td>Exigir citas con identificador de fragmento y verificar programáticamente que existan</td></tr>
<tr><td><b>Verificación</b></td><td>Validación de esquema, chequeo contra la base de datos, ejecución del código generado, cálculo con herramientas</td></tr>
<tr><td><b>Evaluación</b></td><td>Faithfulness con LLM-as-judge sobre un conjunto de referencia; detección de regresiones</td></tr>
<tr><td><b>Producto</b></td><td>Mostrar las fuentes, permitir reportar errores, human-in-the-loop en decisiones de alto impacto</td></tr>
</table>

<div class="dato"><strong>Sobre la confianza declarada:</strong> pedirle al modelo que puntúe su propia certeza
tiene un valor limitado — está mal calibrado y esa autoevaluación es, a su vez, texto generado. Señales más
útiles: si las citas apuntan a fragmentos que existen, cuál fue el puntaje de similitud del retrieval, y si
varias generaciones independientes coinciden (autoconsistencia).</div>

<h4>Verificación programática: la mitigación más fuerte</h4>
<p>Donde la respuesta sea comprobable por código, comprobala. No le pidas al modelo que calcule un total:
que devuelva los ítems y calculá vos. No le pidas que confirme que un cliente existe: buscalo en la base.
<b>Cada verificación que movés del modelo al código elimina una clase entera de errores.</b></p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="26" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    POR QUÉ NUNCA DICE “NO SÉ” POR SU CUENTA</text>

  <rect x="24" y="40" width="300" height="120" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.4"/>
  <text x="42" y="64" fill="#34d399" font-size="12.5" font-weight="700">SABE LA RESPUESTA</text>
  <text x="42" y="86" fill="currentColor" opacity=".65" font-size="11">“La capital de Francia es…”</text>
  <rect x="42" y="98" width="220" height="16" rx="3" fill="#34d399" fill-opacity=".85"/>
  <text x="270" y="111" fill="#34d399" font-size="10.5" font-weight="700">94%</text>
  <rect x="42" y="120" width="14" height="12" rx="3" fill="currentColor" opacity=".2"/>
  <rect x="42" y="136" width="8"  height="12" rx="3" fill="currentColor" opacity=".15"/>
  <text x="42" y="156" fill="currentColor" opacity=".5" font-size="10.5">distribución picuda → confiable</text>

  <rect x="356" y="40" width="300" height="120" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.4"/>
  <text x="374" y="64" fill="#f87171" font-size="12.5" font-weight="700">NO SABE LA RESPUESTA</text>
  <text x="374" y="86" fill="currentColor" opacity=".65" font-size="11">“La ley 27.999 establece…”</text>
  <rect x="374" y="98" width="62" height="16" rx="3" fill="#f87171" fill-opacity=".7"/>
  <text x="444" y="111" fill="#f87171" font-size="10.5" font-weight="700">9%</text>
  <rect x="374" y="120" width="56" height="12" rx="3" fill="#f87171" fill-opacity=".55"/>
  <rect x="374" y="136" width="52" height="12" rx="3" fill="#f87171" fill-opacity=".45"/>
  <text x="374" y="156" fill="#f87171" opacity=".9" font-size="10.5">distribución plana → igual elige uno</text>

  <text x="24" y="188" fill="currentColor" opacity=".62" font-size="12">
    En los dos casos el mecanismo es idéntico: elegir el token más probable. El modelo</text>
  <text x="24" y="206" fill="currentColor" opacity=".62" font-size="12">
    no distingue “lo sé” de “no lo sé”. Por eso inventa con la misma seguridad.</text>

  <line x1="24" y1="226" x2="656" y2="226" stroke="currentColor" opacity=".18"/>

  <text x="24" y="252" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    QUÉ SIRVE CONTRA LA ALUCINACIÓN</text>

  <rect x="24" y="264" width="196" height="52" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="40" y="286" fill="#34d399" font-size="12" font-weight="700">Contexto correcto</text>
  <text x="40" y="305" fill="currentColor" opacity=".6" font-size="10.5">RAG bien hecho · lo principal</text>

  <rect x="232" y="264" width="196" height="52" rx="9" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="248" y="286" fill="#22d3ee" font-size="12" font-weight="700">Exigir citas</text>
  <text x="248" y="305" fill="currentColor" opacity=".6" font-size="10.5">y verificar que existan</text>

  <rect x="440" y="264" width="216" height="52" rx="9" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="456" y="286" fill="#7c5cff" font-size="12" font-weight="700">Verificar con código</text>
  <text x="456" y="305" fill="currentColor" opacity=".6" font-size="10.5">esquema · base de datos · cálculo</text>

  <rect x="24" y="328" width="632" height="46" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4" stroke-dasharray="5 4"/>
  <text x="340" y="349" text-anchor="middle" fill="#f87171" font-size="12.5" font-weight="700">
    Lo que NO sirve: pedirle “no alucines”</text>
  <text x="340" y="367" text-anchor="middle" fill="currentColor" opacity=".6" font-size="11">
    no sabe cuándo está alucinando — para él los dos casos de arriba se sienten igual</text>
</svg>`,
        pie: 'La alucinación no se elimina: se gestiona haciendo que el error sea detectable y barato.',
      },

      entrevista: [
        { p: '¿Por qué alucinan los LLMs?',
          r: 'Porque el objetivo del modelo es generar la continuación más probable, no decir la verdad. Siempre existe un token más probable ' +
             'que los demás, incluso cuando la respuesta correcta no está en sus pesos ni en el contexto. Y como el mecanismo es idéntico cuando ' +
             'sabe y cuando no sabe, <b>afirma lo falso con la misma seguridad que lo cierto</b>. No es un bug: es una consecuencia directa del ' +
             'objetivo de entrenamiento.' },

        { p: 'Tu sistema RAG alucina. ¿Cómo lo diagnosticás?',
          r: 'Primero verifico si es un problema de <b>recuperación</b> o de <b>generación</b>, porque son arreglos distintos. Miro qué fragmentos ' +
             'se recuperaron para esa consulta: si la respuesta correcta no estaba entre ellos, el problema es de retrieval —chunking, embeddings, ' +
             'top_k, falta de búsqueda híbrida o de re-ranking— y ningún cambio de prompt lo va a resolver. Si el fragmento correcto <i>sí</i> estaba ' +
             'y el modelo igual respondió otra cosa, ahí sí es generación: prompt ambiguo, contexto demasiado largo, o conflicto entre el contexto y ' +
             'el conocimiento interno. <b>En mi experiencia la primera causa es mucho más frecuente</b>, y por eso mido <i>context recall</i> antes ' +
             'que cualquier métrica de la respuesta.' },

        { p: '¿Se puede eliminar la alucinación?',
          r: 'No con la arquitectura actual, porque es inherente al objetivo de predicción. Lo que sí se puede es <b>reducir su frecuencia y su ' +
             'impacto</b>: darle el contexto correcto, exigir citas verificables, autorizarlo explícitamente a abstenerse, verificar por código todo ' +
             'lo verificable, y medir <i>faithfulness</i> de forma continua. La postura correcta de diseño es asumir que se va a equivocar y hacer ' +
             'que ese error sea <b>detectable y barato</b> — no apostar a que no ocurra.' },

        { p: '¿Sirve pedirle al modelo que indique su nivel de confianza?',
          r: 'Poco. Esa autoevaluación es también texto generado y está mal calibrada: puede declarar alta confianza sobre algo inventado. ' +
             'Señales bastante más útiles son <b>externas</b>: si las citas apuntan a fragmentos que realmente existen, cuál fue el puntaje de ' +
             'similitud del retrieval, y si varias generaciones independientes coinciden entre sí —autoconsistencia—. ' +
             'Todas esas las podés verificar con código, que es la diferencia clave.' },
      ],

      practica: `
<h4>Un prompt anti-alucinación que funciona</h4>
<pre><code>Respondé ÚNICAMENTE con la información del contexto provisto.

Reglas:
- Si el contexto no contiene la respuesta, decí exactamente:
  "No encuentro esa información en los documentos disponibles."
- No uses conocimiento propio para completar huecos.
- Citá el identificador del fragmento entre corchetes tras cada afirmación: [doc-3]
- Si el contexto se contradice, señalá la contradicción en lugar de elegir uno.

CONTEXTO:
{fragmentos}

PREGUNTA: {pregunta}</code></pre>

<p>Tres cosas hacen que esto funcione mejor que "no alucines":</p>
<ul>
<li><b>Le das una salida explícita.</b> Sin una frase concreta para el "no sé", el modelo va a preferir inventar antes que quedar sin responder.</li>
<li><b>Las citas son verificables.</b> No dependés de su honestidad: comprobás por código que <code>doc-3</code> exista y esté entre los recuperados.</li>
<li><b>Contemplás la contradicción.</b> Es un caso real y frecuente que casi nadie maneja.</li>
</ul>

<h4>Verificar las citas por código</h4>
<pre><code>function verificarCitas(respuesta, fragmentosRecuperados) {
  const citadas = [...respuesta.matchAll(/\\[(doc-\\d+)\\]/g)].map(m =&gt; m[1]);
  const validas = new Set(fragmentosRecuperados.map(f =&gt; f.id));

  const inventadas = citadas.filter(c =&gt; !validas.has(c));
  return {
    ok: inventadas.length === 0 &amp;&amp; citadas.length &gt; 0,
    inventadas,
    sinCitar: citadas.length === 0,
  };
}</code></pre>
<p>Si aparecen citas inventadas, tenés una señal <b>dura</b> de alucinación — sin necesidad de que un humano lea
la respuesta. Eso se puede alertar, loguear y usar como métrica.</p>

<div class="aviso"><strong>El principio general:</strong> <b>todo lo que se pueda verificar con código, verificalo
con código.</b> No le pidas al modelo que sume: que devuelva los ítems y sumá vos. No le pidas que confirme que
un cliente existe: buscalo en la base. Cada verificación que movés del modelo al código elimina una clase entera
de errores, para siempre.</div>
`,

      errores: [
        { mito: 'Si le pido que no alucine, alucina menos.',
          realidad: 'No tiene efecto porque <b>el modelo no sabe cuándo está alucinando</b>: generar algo falso y generar algo cierto se sienten ' +
                    'exactamente igual por dentro. Lo que sí funciona es darle una salida explícita —una frase concreta para decir que no tiene la ' +
                    'información— y exigirle citas que puedas verificar.' },

        { mito: 'Un modelo más grande no alucina.',
          realidad: 'Alucina menos, pero alucina. El mecanismo es el mismo. Y hay un efecto perverso: los modelos más capaces producen alucinaciones ' +
                    '<b>más plausibles</b>, lo que las vuelve más difíciles de detectar. La solución nunca es solo escalar el modelo.' },

        { mito: 'Con RAG se terminó el problema.',
          realidad: 'RAG lo reduce muchísimo cuando el retrieval es bueno, pero <b>si el fragmento correcto no se recupera, el modelo completa el hueco igual</b>. ' +
                    'La calidad de un sistema RAG está limitada por su recuperación, no por su generación. Por eso <i>context recall</i> se mide primero.' },

        { mito: 'Le puedo preguntar al modelo qué tan seguro está.',
          realidad: 'Esa respuesta es texto generado como cualquier otro y está mal calibrada: puede declarar alta confianza sobre algo inventado. ' +
                    'Las señales confiables son externas y verificables por código: <b>citas que existen, puntaje de similitud del retrieval, ' +
                    'coincidencia entre varias generaciones independientes</b>.' },
      ],

      glosario: [
        { t: 'Alucinación', d: 'Afirmación falsa generada con aparente seguridad. Consecuencia del objetivo de predecir el token más probable.' },
        { t: 'Alucinación intrínseca', d: 'La que contradice el contexto provisto.' },
        { t: 'Alucinación extrínseca', d: 'La que no se puede verificar con el contexto provisto. La más común y la más difícil de detectar.' },
        { t: 'Faithfulness', d: 'Métrica de RAG: qué proporción de la respuesta está efectivamente sustentada por el contexto recuperado.' },
        { t: 'Context recall', d: 'Métrica de RAG: si el fragmento con la respuesta correcta fue efectivamente recuperado. Se mide antes que cualquier métrica de generación.' },
        { t: 'Sycophancy', d: 'Tendencia del modelo a aceptar las premisas del usuario en lugar de contradecirlas, producto de la alineación.' },
        { t: 'Grounding', d: 'Anclar la respuesta en fuentes concretas y verificables.' },
        { t: 'Autoconsistencia', d: 'Generar varias respuestas independientes y comparar. La coincidencia es una señal de confiabilidad.' },
        { t: 'Abstención', d: 'Que el modelo declare explícitamente que no tiene la información, en vez de inventar. Hay que autorizarla en el prompt.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es la operación fundamental que realiza un LLM?',
      opciones: [
        'Calcular la probabilidad del token siguiente dada la secuencia previa, y repetir',
        'Buscar la respuesta en una base de conocimiento interna',
        'Aplicar reglas gramaticales para construir oraciones válidas',
        'Comparar la pregunta con preguntas similares que vio en el entrenamiento',
      ],
      correcta: 0,
      porQue: 'Todo lo demás —parecer que razona, escribir código, traducir— emerge de ejecutar esa única operación una y otra vez de forma autorregresiva.',
      porQueNo: {
        1: 'No hay una base de datos consultable adentro. El conocimiento está distribuido en los pesos como patrones estadísticos.',
        2: 'La gramática correcta emerge del entrenamiento; no hay reglas programadas.',
        3: 'No hay recuperación de ejemplos: hay generación a partir de una distribución de probabilidad.',
      },
    },
    {
      p: '¿Por qué los tokens de salida cuestan más que los de entrada?',
      opciones: [
        'La salida se genera token por token de forma secuencial, mientras que la entrada se procesa en paralelo',
        'Porque los proveedores quieren desalentar respuestas largas',
        'Porque la salida usa un modelo distinto',
        'Porque la salida requiere más memoria de almacenamiento',
      ],
      correcta: 0,
      porQue: 'El prefill procesa todo el prompt en una pasada paralelizable; el decode necesita una pasada completa por la red por cada token generado y no se puede paralelizar.',
      porQueNo: {
        1: 'La diferencia refleja un costo real de cómputo, no una política comercial.',
        2: 'Es el mismo modelo y la misma red en ambas fases.',
        3: 'No hay almacenamiento involucrado: es cómputo y ancho de banda de memoria.',
      },
    },
    {
      p: 'En español, ¿cuántos tokens equivalen aproximadamente a una palabra?',
      opciones: ['Alrededor de 2', 'Exactamente 1', 'Alrededor de 0,5', 'Depende solo de la longitud de la palabra'],
      correcta: 0,
      porQue: 'Los tokenizadores se entrenan sobre corpus mayoritariamente en inglés, así que el español se fragmenta más: aproximadamente el doble de tokens que palabras.',
      porQueNo: {
        1: 'Esa aproximación deja el presupuesto de tokens corto casi a la mitad.',
        2: 'Sería el caso si un token abarcara varias palabras, lo cual no ocurre.',
        3: 'Depende sobre todo de la frecuencia de la palabra en el corpus de entrenamiento, no solo de su longitud.',
      },
    },
    {
      p: '¿Qué incluye la ventana de contexto?',
      opciones: [
        'System prompt, tools, historial, contexto recuperado, mensaje del usuario y la respuesta que se genera',
        'Solamente el mensaje que envía el usuario',
        'El historial de conversación únicamente',
        'Todo lo enviado, pero no la respuesta generada',
      ],
      correcta: 0,
      porQue: 'Incluye absolutamente todo, la salida también. Por eso hay que reservar el máximo de tokens de respuesta antes de repartir el resto: si no, la respuesta se corta a la mitad.',
      porQueNo: {
        1: 'Es solo uno de los componentes, y en general el más chico.',
        2: 'Faltan el system prompt, las herramientas y el contexto recuperado.',
        3: 'La respuesta también consume ventana. Ese es justamente el error más común.',
      },
    },
    {
      p: 'Un usuario dice que el chatbot "se olvidó" de su nombre tras cuarenta mensajes. ¿Qué pasó?',
      opciones: [
        'El historial se recortó para entrar en la ventana, así que ese mensaje nunca llegó al modelo',
        'El modelo tiene una memoria limitada que se va borrando',
        'El modelo decidió que ese dato no era relevante',
        'Hubo un error en la API',
      ],
      correcta: 0,
      porQue: 'La API es sin estado: el historial lo reenvía tu aplicación en cada llamada. Cuando deja de entrar, hay que recortarlo, y lo recortado sencillamente no existe para el modelo.',
      porQueNo: {
        1: 'No hay memoria interna que se borre. No hay memoria en absoluto entre llamadas.',
        2: 'El modelo no decide qué recordar: recibe lo que le mandás y nada más.',
        3: 'Es el comportamiento esperado del diseño, no una falla del proveedor.',
      },
    },
    {
      p: '¿Qué es el fenómeno "lost in the middle"?',
      opciones: [
        'El modelo atiende peor la información ubicada en el centro de un contexto largo',
        'Los tokens del medio de una palabra se pierden al tokenizar',
        'Las capas intermedias del transformer pierden información',
        'El historial del medio de la conversación se borra automáticamente',
      ],
      correcta: 0,
      porQue: 'Está medido con pruebas tipo needle in a haystack. La implicancia práctica es directa: poné lo crítico al principio o al final del prompt, nunca sepultado en el medio.',
      porQueNo: {
        1: 'La tokenización no pierde información: es reversible.',
        2: 'Las conexiones residuales existen precisamente para evitar esa pérdida entre capas.',
        3: 'No hay borrado automático: si algo se recorta, lo recorta tu aplicación.',
      },
    },
    {
      p: 'Estás construyendo una extracción de datos de facturas a JSON. ¿Qué temperatura usás?',
      opciones: ['0', '0,7', '1,0', '1,5'],
      correcta: 0,
      porQue: 'Hay una única respuesta correcta y no querés ninguna variabilidad. Dejar la temperatura por defecto en tareas de extracción es una fuente clásica de JSON inválido y campos inventados en producción.',
      porQueNo: {
        1: 'Introduce variabilidad innecesaria en una tarea que tiene una sola respuesta correcta.',
        2: 'Es un valor pensado para redacción, no para extracción estructurada.',
        3: 'Aplana tanto la distribución que aparecen salidas claramente erráticas.',
      },
    },
    {
      p: 'Con temperatura 0, ¿la salida es idéntica siempre?',
      opciones: [
        'Es altamente reproducible, pero no está garantizado',
        'Sí, siempre exactamente igual',
        'No, sigue siendo completamente aleatoria',
        'Solo si además fijás top_p en 0',
      ],
      correcta: 0,
      porQue: 'Con T=0 el muestreo es greedy, pero quedan el no determinismo de punto flotante en GPU, el batching y las actualizaciones del proveedor. Por eso los tests sobre salidas de LLM nunca deben comparar cadenas exactas.',
      porQueNo: {
        1: 'Suena razonable pero es falso en la práctica, y es justamente lo que rompe tests frágiles.',
        2: 'La aleatoriedad del muestreo sí desaparece: la variación residual es mucho menor.',
        3: 'Combinar temperature y top_p no agrega determinismo y vuelve el comportamiento más difícil de razonar.',
      },
    },
    {
      p: '¿En qué etapa del entrenamiento adquiere el modelo su conocimiento del mundo?',
      opciones: ['Pre-entrenamiento', 'SFT (ajuste por instrucciones)', 'RLHF', 'En las tres por igual'],
      correcta: 0,
      porQue: 'El pre-entrenamiento auto-supervisado sobre billones de tokens es donde se adquiere el conocimiento. SFT y RLHF ajustan comportamiento: formato, tono, seguridad.',
      porQueNo: {
        1: 'SFT enseña el formato del diálogo y a obedecer instrucciones, no aporta conocimiento nuevo significativo.',
        2: 'RLHF ajusta preferencias y seguridad. Incluso puede reducir levemente capacidades brutas: el alignment tax.',
        3: 'Están claramente especializadas, y confundirlas es un error frecuente en entrevistas.',
      },
    },
    {
      p: '¿Cuál es la diferencia entre un modelo base y uno instruido?',
      opciones: [
        'El base solo continúa texto; el instruido pasó por SFT y alineación, y responde en formato de diálogo',
        'El base es más chico',
        'El instruido tiene más conocimiento',
        'El base no puede generar texto',
      ],
      correcta: 0,
      porQue: 'Al modelo base le preguntás algo y puede devolverte más preguntas, porque en internet las preguntas suelen venir en listas. Lo que consumís por API siempre es instruido.',
      porQueNo: {
        1: 'El tamaño es el mismo: la diferencia está en las etapas de entrenamiento posteriores.',
        2: 'El conocimiento viene del pre-entrenamiento, que ambos comparten.',
        3: 'Genera texto perfectamente: lo que no hace es seguir el formato de instrucción y respuesta.',
      },
    },
    {
      p: 'En un sistema RAG que alucina, ¿cuál es la causa más frecuente?',
      opciones: [
        'El fragmento con la respuesta correcta nunca se recuperó',
        'La temperatura estaba demasiado alta',
        'El prompt no era lo bastante enfático',
        'El modelo era demasiado chico',
      ],
      correcta: 0,
      porQue: 'La calidad de un sistema RAG está limitada por su recuperación. Por eso se mide context recall antes que cualquier métrica de generación: si el dato nunca entró al prompt, ningún prompt lo salva.',
      porQueNo: {
        1: 'Puede contribuir, pero es una causa mucho menos frecuente que una falla de retrieval.',
        2: 'Pedirle enfáticamente que no invente no funciona: el modelo no sabe cuándo está inventando.',
        3: 'Un modelo más grande alucina menos, pero igual completa un hueco si el contexto no traía la respuesta.',
      },
    },
    {
      p: '¿Cuál de estas medidas NO reduce las alucinaciones?',
      opciones: [
        'Agregar "no alucines" al prompt',
        'Exigir citas verificables del fragmento de origen',
        'Autorizar explícitamente al modelo a decir que no tiene la información',
        'Verificar por código lo que sea verificable',
      ],
      correcta: 0,
      porQue: 'El modelo no distingue internamente entre generar algo cierto y generar algo falso: las dos cosas se sienten igual. Pedirle que no alucine no le da ninguna información accionable.',
      porQueNo: {
        1: 'Funciona muy bien, y además te permite detectar el problema por código verificando que las citas existan.',
        2: 'Es de las medidas más efectivas: sin una salida explícita, el modelo prefiere inventar antes que no responder.',
        3: 'Es la mitigación más fuerte donde aplica: elimina clases enteras de error de forma definitiva.',
      },
    },
  ],
});
