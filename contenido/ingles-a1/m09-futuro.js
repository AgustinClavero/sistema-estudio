/* ==========================================================================
   Inglés A1 · m09 — Futuro: going to y will
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ingles-a1',
  id: 'm09',
  titulo: 'Futuro: going to y will',
  fuentes: ['cambridge-dic', 'bbc-learning-english', 'wordreference'],

  intro:
    '<p>El inglés tiene <b>tres formas</b> de hablar del futuro, y la regla que enseñan en la mayoría ' +
    'de las academias —«<i>will</i> para el futuro, <i>going to</i> para el futuro cercano»— ' +
    '<b>es falsa</b>. No es cuestión de distancia temporal.</p>' +
    '<p>Lo que las separa es <b>si ya lo decidiste antes de hablar o lo estás decidiendo ahora</b>. ' +
    'Con eso claro, la elección deja de ser un problema.</p>' +
    '<p>Y hay una tercera forma que ya conocés sin saberlo: el <b>present continuous</b> del módulo 6, ' +
    'que sirve para lo que ya está agendado.</p>',

  lecciones: [

    /* ==================================================================== */
    {
      id: 'l1',
      titulo: 'Going to: lo que ya decidiste',
      minutos: 8,

      simple: `
        <p>Se arma con <b>to be + going to + verbo en forma base</b>:</p>

        <div class="analogia">
          <span class="en" data-say>I'm going to refactor this next week</span><br>
          <span class="en" data-say>She's going to review the PR</span><br>
          <span class="en" data-say>We're going to deploy on Friday</span>
        </div>

        <p>Como el auxiliar es <i>to be</i>, negar y preguntar es lo de siempre:</p>
        <ul>
          <li><span class="en" data-say>I'm not going to finish it today</span></li>
          <li><span class="en" data-say>Are you going to join the call?</span></li>
          <li><span class="en" data-say>What are you going to do?</span></li>
        </ul>

        <h4>Para qué sirve</h4>
        <p><b>1. Planes e intenciones que ya tenías.</b> La decisión es previa a la conversación:</p>
        <ul>
          <li><span class="en" data-say>I'm going to learn English this year.</span></li>
          <li><span class="en" data-say>We're going to migrate to Postgres.</span></li>
        </ul>

        <p><b>2. Predicciones con evidencia visible.</b> Estás viendo algo que lo anticipa:</p>
        <ul>
          <li><span class="en" data-say>Look at the memory graph — it's going to crash.</span></li>
          <li><span class="en" data-say>The build is going to fail, there's a syntax error.</span></li>
        </ul>

        <div class="aviso">
          <b>Al hablar, <i>going to</i> suena "gonna".</b><br><br>
          <span class="en" data-say>I'm going to check the logs</span> → "I'm <b>gonna</b> check the logs"<br><br>
          Es la pronunciación normal en cualquier registro hablado, no habla descuidada. Al <b>escribir</b>
          sí conviene la forma completa: <i>gonna</i> escrito es muy informal y en un mail de trabajo no va.
        </div>

        <h4>Un detalle raro y frecuente</h4>
        <p>Con los verbos <i>go</i> y <i>come</i>, en vez de <i>going to go</i> se prefiere el present
        continuous a secas:</p>
        <ul>
          <li>🤏 <i>I'm going to go to the office</i> — correcto pero redundante</li>
          <li>✅ <span class="en" data-say>I'm going to the office</span> — más natural</li>
        </ul>
      `,

      tecnico: `
        <p>La construcción <b><i>be going to</i> + infinitivo</b> es una perífrasis, no un tiempo verbal
        propiamente dicho. Su significado central es <b>«hay algo en el presente que apunta a ese futuro»</b>:
        una intención ya formada, o evidencia observable.</p>

        <table>
          <tr><th>Valor</th><th>Qué hay en el presente</th><th>Ejemplo</th></tr>
          <tr><td>Intención</td><td>la decisión ya tomada</td><td>I'm going to refactor this.</td></tr>
          <tr><td>Predicción con evidencia</td><td>algo visible ahora</td><td>It's going to crash.</td></tr>
        </table>

        <div class="nota-tec">
          <b>Por qué la regla de «futuro cercano» es falsa.</b> <i>I'm going to retire in thirty years</i>
          es perfectamente correcto — treinta años no es cercano. Y <i>I'll get it right now</i> también,
          con <i>will</i> para algo inmediato.
          <br><br>
          Lo que distingue no es <b>cuándo</b> pasa, sino <b>cuándo se decidió</b>: antes de hablar
          (<i>going to</i>) o en el momento de hablar (<i>will</i>).
        </div>

        <p><b>Sobre la reducción a «gonna».</b> Es un caso de <b>coalescencia</b>: <i>going to</i>
        /ˈɡoʊɪŋ tuː/ → /ˈɡʌnə/. Ocurre solo cuando <i>to</i> introduce un verbo, no cuando es preposición
        de lugar:</p>
        <ul>
          <li><i>I'm going to <b>eat</b></i> → "gonna eat" ✅</li>
          <li><i>I'm going to <b>the office</b></i> → ❌ nunca "gonna the office"</li>
        </ul>
        <p>Es un test útil para saber cuál de los dos <i>going to</i> estás escuchando.</p>

        <p><b>Sobre la redundancia de <i>going to go</i>.</b> No es incorrecta —aparece en habla real—
        pero el continuous solo es más idiomático. Lo mismo con <i>come</i>: <i>I'm coming tomorrow</i>
        antes que <i>I'm going to come tomorrow</i>.</p>

        <p><b>El pasado de esta forma</b> es <i>was/were going to</i>, que ya viste en el módulo 7:
        expresa un plan que no se cumplió. <i>I was going to finish it, but…</i></p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Los dos usos de going to: intención previa y predicción con evidencia">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">going to: algo del presente apunta al futuro</text>

          <rect x="34" y="40" width="290" height="110" rx="10" fill="#34d399" opacity="0.1" stroke="#34d399" stroke-width="1.3"/>
          <text x="179" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#34d399">INTENCIÓN</text>
          <text x="179" y="80" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">la decisión ya estaba tomada</text>
          <text x="179" y="106" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">I'm going to refactor this.</text>
          <text x="179" y="126" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">We're going to migrate.</text>
          <text x="179" y="144" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">lo decidí antes de esta charla</text>

          <rect x="356" y="40" width="290" height="110" rx="10" fill="#22d3ee" opacity="0.1" stroke="#22d3ee" stroke-width="1.3"/>
          <text x="501" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#22d3ee">PREDICCIÓN CON EVIDENCIA</text>
          <text x="501" y="80" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">estoy viendo algo que lo anticipa</text>
          <text x="501" y="106" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">It's going to crash.</text>
          <text x="501" y="126" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">The build is going to fail.</text>
          <text x="501" y="144" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">mirá el gráfico de memoria</text>

          <rect x="34" y="164" width="612" height="40" rx="9" fill="#f87171" opacity="0.1" stroke="#f87171" stroke-width="1.3"/>
          <text x="340" y="182" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f87171">La regla que enseñan y que es FALSA</text>
          <text x="340" y="198" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">
            "going to para futuro cercano" — no: "I'm going to retire in 30 years" es correcto
          </text>

          <rect x="34" y="214" width="612" height="38" rx="9" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="340" y="232" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f59e0b">Al hablar suena "gonna"</text>
          <text x="340" y="247" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.8">
            Solo cuando le sigue un verbo: "gonna eat" ✓ · "gonna the office" ✗
          </text>
        </svg>`,
        pie: 'Lo que define a going to no es cuándo pasa, sino que ya hay algo en el presente que lo apunta.',
      },

      escucha: {
        intro: '<p>Casi todas van a sonar con <b>"gonna"</b>. Escribí la forma completa ' +
               '(<i>going to</i>), que es lo que corresponde en escritura.</p>',
        items: [
          { texto: "I'm going to check the logs.", es: 'Voy a revisar los logs.',
            nota: 'Suena "I\'m gonna check". La pronunciación reducida es lo normal, en cualquier registro hablado.' },
          { texto: "We're going to deploy on Friday.", es: 'Vamos a desplegar el viernes.',
            nota: 'Plan ya decidido. Por eso <b>going to</b> y no <i>will</i>.' },
          { texto: "The build is going to fail, there's a syntax error.", es: 'El build va a fallar, hay un error de sintaxis.',
            nota: 'Predicción con <b>evidencia visible</b>: ya estás viendo el error.' },
          { texto: "I'm not going to finish it today.", es: 'No lo voy a terminar hoy.',
            nota: 'La negación va sobre <i>to be</i>: <b>I\'m not going to</b>.' },
        ],
      },

      practica: `
        <p><b>Contá tus planes reales</b>, cinco frases con <i>going to</i>:</p>
        <ol>
          <li>This week I'm going to ______.</li>
          <li>We're going to ______.</li>
          <li>I'm not going to ______.</li>
          <li>This year I'm going to ______.</li>
          <li>Look at ______ — it's going to ______.</li>
        </ol>

        <p><b>Y entrená el sonido.</b> Escuchá y repetí hasta que te salga natural:</p>
        <p><span class="en" data-say>I'm going to check it</span> · <span class="en" data-say>I'm going to ask</span> ·
        <span class="en" data-say>We're going to try</span></p>

        <p>Las tres suenan con "gonna". <b>Decilo así al hablar y escribilo completo al escribir.</b></p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Ya venías planeando refactorizar ese módulo. ¿Cómo lo decís?',
          opciones: [
            "I will refactor that module.",
            "I'm going to refactor that module.",
            'I refactor that module.',
            "I'm refactor that module.",
          ],
          correcta: 1,
          porQue: 'La decisión <b>ya estaba tomada</b> antes de esta conversación → <i>going to</i>.',
          porQueNo: {
            0: '<i>will</i> sugiere que lo estás decidiendo justo ahora, mientras hablás.',
            2: 'El present simple no expresa planes futuros.',
            3: 'Le falta el <i>-ing</i> o el <i>going to</i>.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá la negación: <b>I ______ going to finish it today.</b>',
          respuesta: "'m not",
          respuestas: ['am not', "am not"],
          porQue: 'La negación va sobre <i>to be</i>: <b>I\'m not going to</b>.',
        },
        {
          tipo: 'opcion',
          p: 'Estás mirando el gráfico de memoria y la curva sube sin parar. ¿Qué decís?',
          opciones: [
            "It will crash.",
            "It's going to crash.",
            'It crashes.',
            'It is crash.',
          ],
          correcta: 1,
          porQue: 'Predicción con <b>evidencia visible</b>: estás viendo algo ahora que lo anticipa. Ese es el segundo uso de <i>going to</i>.',
          porQueNo: {
            0: 'Sería una predicción sin evidencia, más una opinión que una lectura de lo que ves.',
            2: 'El present simple describe comportamiento habitual.',
            3: 'No es una estructura válida.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Vamos a desplegar el viernes.</b>',
          respuesta: "We're going to deploy on Friday",
          respuestas: ['We are going to deploy on Friday'],
          pista: 'Es un plan ya decidido.',
          porQue: 'Plan previo → <b>going to</b>. Y <b>on Friday</b> para el día.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá la pregunta: «¿Qué vas a hacer?»',
          respuesta: 'What are you going to do',
          porQue: 'Palabra de pregunta + inversión de <i>to be</i>. Sin <i>do</i>, porque el auxiliar ya está.',
        },
      ],

      errores: [
        { mito: '<i>going to</i> es para el futuro cercano y <i>will</i> para el lejano.',
          realidad: 'Es la regla más difundida y es <b>falsa</b>. <i>I\'m going to retire in thirty years</i> es correcto, ' +
                    'y <i>I\'ll do it right now</i> también. Lo que distingue es <b>cuándo se decidió</b>, no cuándo pasa.' },
        { mito: 'Decir "gonna" es hablar mal.',
          realidad: 'Es la pronunciación <b>normal</b> de <i>going to</i> en habla corriente, en todos los registros. ' +
                    'Lo que sí es informal es <b>escribirlo</b>: en un mail de trabajo va la forma completa.' },
        { mito: '<i>I\'m going to go to the office</i> está mal.',
          realidad: 'No está mal, pero es redundante. Con <i>go</i> y <i>come</i> se prefiere el continuous solo: ' +
                    '<b>I\'m going to the office</b>. Suena bastante más natural.' },
      ],

      glosario: [
        { t: 'Going to', d: 'Perífrasis de futuro. Marca que algo del presente —una decisión o una evidencia— apunta a ese futuro.' },
        { t: 'Gonna', d: 'La pronunciación reducida de <i>going to</i>. Normal al hablar; informal al escribir.' },
        { t: 'Predicción con evidencia', d: 'Cuando decís lo que va a pasar porque estás viendo algo que lo anticipa. Es el segundo uso de <i>going to</i>.' },
        { t: 'Was going to', d: 'El pasado de la construcción: un plan que no se cumplió. <i>I was going to finish it, but…</i>' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l2',
      titulo: 'Will: lo que decidís ahora',
      minutos: 8,

      simple: `
        <p><b>will</b> es un modal, así que se comporta como <i>can</i>: sin <i>-s</i>, sin <i>do</i>,
        y el verbo que le sigue en forma base.</p>

        <ul>
          <li><span class="en" data-say>I will check it</span> — contraído: <span class="en" data-say>I'll check it</span></li>
          <li><span class="en" data-say>She won't be there</span> — negativo: <b>won't</b>, no <i>willn't</i></li>
          <li><span class="en" data-say>Will you be in the call?</span></li>
        </ul>

        <p>La contracción <b>'ll</b> es tan corta que casi no se oye. Y la negación <b>won't</b> es
        completamente irregular: hay que aprenderla como palabra suelta.</p>

        <h4>Los tres usos</h4>

        <p><b>1. Decisión en el momento.</b> Este es el uso central, y el que lo separa de <i>going to</i>:</p>
        <div class="analogia">
          — <span class="en" data-say>The staging server is down.</span><br>
          — <span class="en" data-say>OK, I'll take a look.</span> ← lo decidís justo ahora
        </div>
        <p>Si ya lo tenías planeado, sería <i>I'm going to take a look</i>.</p>

        <p><b>2. Ofrecimientos y promesas.</b> Es la forma estándar:</p>
        <ul>
          <li><span class="en" data-say>I'll send you the link.</span></li>
          <li><span class="en" data-say>I'll get back to you tomorrow.</span></li>
          <li><span class="en" data-say>Don't worry, I'll handle it.</span></li>
        </ul>

        <p><b>3. Predicciones sin evidencia.</b> Opiniones sobre el futuro:</p>
        <ul>
          <li><span class="en" data-say>I think it will take about two days.</span></li>
          <li><span class="en" data-say>It won't be a problem.</span></li>
        </ul>

        <div class="aviso">
          <b>La comparación que resuelve todo:</b><br><br>
          — <i>The build is broken.</i><br>
          — <span class="en" data-say>I'll fix it.</span> → me acabo de ofrecer, lo decido ahora<br>
          — <span class="en" data-say>I'm going to fix it.</span> → ya lo tenía planeado antes de que me lo dijeras<br><br>
          Las dos son correctas. Dicen cosas distintas sobre <b>cuándo</b> decidiste.
        </div>

        <h4>La frase que más vas a usar</h4>
        <p><span class="en" data-say>I'll get back to you.</span> — «te confirmo después».
        Es la salida de emergencia perfecta cuando no sabés algo y necesitás tiempo.</p>
      `,

      tecnico: `
        <p><b>will</b> es un <b>modal</b>, con todas las propiedades del módulo 5: sin flexión, sin
        infinitivo, no se combina con otros modales, y rige forma base.</p>

        <table>
          <tr><th>Forma</th><th>Escrito</th><th>Se dice</th></tr>
          <tr><td>afirmativo contraído</td><td>I'll, you'll, it'll</td><td>/aɪl/, /juːl/, /ˈɪtəl/</td></tr>
          <tr><td>negativo</td><td>won't</td><td>/woʊnt/</td></tr>
          <tr><td>negativo completo</td><td>will not</td><td>enfático</td></tr>
        </table>

        <div class="nota-tec">
          <b><i>won't</i> es una irregularidad histórica.</b> Viene de <i>woll not</i>, una variante
          antigua de <i>will</i> que sobrevivió solo en la negación. Por eso no se parece a
          <i>will</i> — y por eso hay que aprenderla como una palabra aparte, no como una contracción
          deducible.
        </div>

        <p><b>Los valores de <i>will</i></b>, ordenados por frecuencia real:</p>
        <table>
          <tr><th>Valor</th><th>Ejemplo</th></tr>
          <tr><td>Decisión espontánea</td><td>OK, I'll do it.</td></tr>
          <tr><td>Ofrecimiento</td><td>I'll send you the link.</td></tr>
          <tr><td>Promesa</td><td>I'll get back to you today.</td></tr>
          <tr><td>Predicción / opinión</td><td>It'll take two days.</td></tr>
          <tr><td>Negativa a hacer algo</td><td>The build won't start. (se niega a arrancar)</td></tr>
        </table>

        <p>Ese último merece atención: <i>won't</i> con sujeto inanimado expresa <b>resistencia</b>.
        <i>The server won't start</i> no es una predicción — significa «no arranca, y ya probé».
        Es muy usado en contexto técnico.</p>

        <p><b>Sobre <i>will</i> en condicionales.</b> Como viste en el módulo 3, <b>no va después de
        <i>if</i></b> cuando se describe una condición. Va en la otra mitad:</p>
        <ul>
          <li>✅ <i>If the build fails, I'll revert it.</i></li>
          <li>❌ <i>If the build will fail, I revert it.</i></li>
        </ul>
        <p>Es de los errores más visibles en documentación escrita por hispanohablantes.</p>

        <p><b>Sobre <i>shall</i>.</b> Aparece en gramáticas viejas como el futuro de <i>I</i> y <i>we</i>.
        En inglés actual está prácticamente extinto, salvo en ofrecimientos formales
        (<i>Shall we start?</i>) y en textos legales. No hace falta usarlo.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="La diferencia entre will y going to según cuándo se tomó la decisión">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Lo que los separa: cuándo decidiste</text>

          <line x1="70" y1="90" x2="610" y2="90" stroke="currentColor" opacity="0.25" stroke-width="2"/>
          <circle cx="340" cy="90" r="8" fill="#f59e0b"/>
          <text x="340" y="116" text-anchor="middle" font-size="11.5" font-weight="700" fill="#f59e0b">el momento de hablar</text>

          <g>
            <rect x="70" y="42" width="230" height="34" rx="8" fill="#34d399" opacity="0.2" stroke="#34d399" stroke-width="1.4"/>
            <text x="185" y="64" text-anchor="middle" font-size="12.5" font-weight="700" fill="#34d399">decidido ANTES</text>
            <line x1="185" y1="76" x2="330" y2="86" stroke="#34d399" stroke-width="1.6" opacity="0.6"/>
          </g>

          <g>
            <rect x="380" y="42" width="230" height="34" rx="8" fill="#22d3ee" opacity="0.2" stroke="#22d3ee" stroke-width="1.4"/>
            <text x="495" y="64" text-anchor="middle" font-size="12.5" font-weight="700" fill="#22d3ee">decidido AHORA</text>
            <line x1="495" y1="76" x2="350" y2="86" stroke="#22d3ee" stroke-width="1.6" opacity="0.6"/>
          </g>

          <text x="185" y="140" text-anchor="middle" font-size="17" font-weight="800" fill="#34d399">going to</text>
          <text x="495" y="140" text-anchor="middle" font-size="17" font-weight="800" fill="#22d3ee">will</text>

          <line x1="34" y1="160" x2="646" y2="160" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="182" text-anchor="middle" font-size="12.5" font-weight="700" fill="currentColor">El mismo diálogo, dos respuestas correctas</text>

          <rect x="60" y="194" width="560" height="26" rx="7" fill="currentColor" opacity="0.06"/>
          <text x="340" y="212" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.8">— The build is broken.</text>

          <g font-size="12.5">
            <rect x="60" y="226" width="272" height="42" rx="8" fill="#22d3ee" opacity="0.11" stroke="#22d3ee" stroke-width="1.2"/>
            <text x="196" y="244" text-anchor="middle" fill="currentColor" opacity="0.9">— I<tspan font-weight="800" fill="#22d3ee">'ll</tspan> fix it.</text>
            <text x="196" y="260" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.65">me ofrezco, lo decido acá</text>

            <rect x="348" y="226" width="272" height="42" rx="8" fill="#34d399" opacity="0.11" stroke="#34d399" stroke-width="1.2"/>
            <text x="484" y="244" text-anchor="middle" fill="currentColor" opacity="0.9">— I'm <tspan font-weight="800" fill="#34d399">going to</tspan> fix it.</text>
            <text x="484" y="260" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.65">ya lo tenía planeado</text>
          </g>
        </svg>`,
        pie: 'No hay una correcta y otra incorrecta: dicen cosas distintas sobre cuándo tomaste la decisión.',
      },

      escucha: {
        intro: '<p>La contracción <b>\'ll</b> es de las más difíciles de oír del inglés: ' +
               'es apenas una consonante. Escuchá varias veces.</p>',
        items: [
          { texto: "OK, I'll take a look.", es: 'Dale, le echo un vistazo.',
            nota: 'Decisión en el momento. <b>I\'ll</b> suena casi como "ail", pegado.' },
          { texto: "I'll get back to you tomorrow.", es: 'Te confirmo mañana.',
            nota: 'La salida de emergencia perfecta cuando no sabés algo y necesitás tiempo.' },
          { texto: "It won't be a problem.", es: 'No va a ser un problema.',
            nota: '<b>won\'t</b> se dice "wount". No se parece a <i>will</i>: es una irregularidad histórica.' },
          { texto: "The server won't start.", es: 'El servidor no arranca.',
            nota: 'Acá <b>won\'t</b> no es futuro: expresa <b>resistencia</b>. «No arranca, y ya probé.»' },
          { texto: "If the build fails, I'll revert it.", es: 'Si el build falla, lo revierto.',
            nota: '<b>will</b> va en la segunda mitad, nunca después de <i>if</i>.' },
        ],
      },

      practica: `
        <p><b>Practicá la decisión espontánea.</b> Leé cada situación y respondé en voz alta con
        <i>I'll…</i>:</p>
        <ol>
          <li>— The staging server is down. → ______</li>
          <li>— Nobody reviewed this PR. → ______</li>
          <li>— We need someone to write the docs. → ______</li>
          <li>— Can you check the logs? → ______</li>
        </ol>

        <p><b>Y guardate estas cuatro</b>, que son las que más vas a usar:</p>
        <ul>
          <li><span class="en" data-say>I'll take a look.</span></li>
          <li><span class="en" data-say>I'll get back to you.</span></li>
          <li><span class="en" data-say>I'll send you the link.</span></li>
          <li><span class="en" data-say>Don't worry, I'll handle it.</span></li>
        </ul>

        <p><b>Ojo con <i>won't</i>:</b> no es una contracción deducible de <i>will</i>. Viene de
        <i>woll not</i>, una forma antigua. Hay que aprenderla como palabra suelta.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Alguien dice «el servidor de staging se cayó» y decidís en ese momento ir a mirar. ¿Qué decís?',
          opciones: [
            "I'm going to take a look.",
            "I'll take a look.",
            'I take a look.',
            "I'm taking a look.",
          ],
          correcta: 1,
          porQue: '<b>Decisión espontánea</b>, tomada en el momento de hablar → <i>will</i>.',
          porQueNo: {
            0: 'Sugiere que ya lo tenías planeado antes de que te lo dijeran.',
            2: 'El present simple no expresa decisiones futuras.',
            3: 'El continuous implicaría que ya está agendado.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá la negación de <b>will</b>: <b>It ______ be a problem.</b>',
          respuesta: "won't",
          respuestas: ['will not'],
          porQue: '<b>won\'t</b>, no ❌ <i>willn\'t</i>. Es una irregularidad histórica que hay que aprender suelta.',
        },
        {
          tipo: 'opcion',
          p: '¿Qué significa <span class="en" data-say>The server won\'t start</span>?',
          opciones: [
            'El servidor no va a arrancar en el futuro',
            'El servidor no arranca, ya probé y se resiste',
            'El servidor no debería arrancar',
            'El servidor arrancará más tarde',
          ],
          correcta: 1,
          porQue: '<b>won\'t</b> con sujeto inanimado expresa <b>resistencia</b>, no futuro. Es muy usado en contexto técnico.',
          porQueNo: {
            0: 'Ese sería el valor de futuro, pero acá el contexto lo descarta.',
            2: 'Eso sería <i>shouldn\'t start</i>.',
            3: 'Diría lo contrario.',
          },
        },
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: [
            "If the build will fail, I revert it.",
            "If the build fails, I'll revert it.",
            "If the build will fail, I'll revert it.",
            'If the build fail, I revert it.',
          ],
          correcta: 1,
          porQue: 'Después de <b>if</b> nunca va <i>will</i>: la condición va en present simple y <i>will</i> en la otra mitad.',
          porQueNo: {
            0: 'Doble error: <i>will</i> después de <i>if</i> y falta <i>will</i> en la consecuencia.',
            2: '<i>will</i> después de <i>if</i> sigue siendo error.',
            3: 'Le falta la -s de tercera persona y el <i>will</i>.',
          },
        },
        {
          tipo: 'ordenar',
          p: 'Armá la salida de emergencia: «Dejame revisar y te confirmo.»',
          respuesta: "Let me check and I'll get back to you",
          porQue: 'Es la fórmula perfecta cuando no sabés algo y necesitás tiempo sin que quede mal.',
        },
      ],

      errores: [
        { mito: '<i>will</i> es «el futuro» y <i>going to</i> es una variante.',
          realidad: 'Son dos cosas distintas. <b>will</b> marca <b>decisión en el momento</b>, ofrecimiento o predicción; ' +
                    '<b>going to</b> marca <b>plan previo</b> o evidencia. Ninguno es «el futuro por defecto».' },
        { mito: 'La negación de <i>will</i> es <i>willn\'t</i>.',
          realidad: 'Es <b>won\'t</b>. Viene de <i>woll not</i>, una variante antigua de <i>will</i> que solo sobrevivió ' +
                    'en la negación. No es deducible: hay que aprenderla como palabra aparte.' },
        { mito: 'Después de <i>if</i> va <i>will</i>, porque habla del futuro.',
          realidad: '❌ <i>If the build will fail…</i> La condición va en <b>present simple</b> y <i>will</i> en la ' +
                    'otra mitad: <i>If the build fails, I\'ll revert it</i>. Es de los errores más visibles ' +
                    'en documentación escrita por hispanohablantes.' },
      ],

      glosario: [
        { t: 'Will', d: 'Modal de futuro. Marca decisión espontánea, ofrecimiento, promesa o predicción sin evidencia.' },
        { t: "Won't", d: 'La negación de <i>will</i>. Irregular: viene de <i>woll not</i>. Con sujeto inanimado expresa resistencia.' },
        { t: "I'll get back to you", d: 'Te confirmo después. La salida de emergencia más útil cuando no sabés algo.' },
        { t: 'Shall', d: 'Futuro arcaico para <i>I</i> y <i>we</i>. Hoy casi extinto salvo en <i>Shall we…?</i> y textos legales.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l3',
      titulo: 'Las tres formas, comparadas',
      minutos: 8,

      simple: `
        <p>Hay tres formas de hablar del futuro, y cada una tiene su lugar:</p>

        <table>
          <tr><th>Forma</th><th>Cuándo</th><th>Ejemplo</th></tr>
          <tr><td><b>going to</b></td><td>plan previo, evidencia visible</td><td>I'm going to refactor this.</td></tr>
          <tr><td><b>will</b></td><td>decisión ahora, ofrecimiento, opinión</td><td>I'll take a look.</td></tr>
          <tr><td><b>present continuous</b></td><td>ya agendado, con fecha</td><td>I'm meeting the client on Friday.</td></tr>
        </table>

        <h4>La diferencia entre <i>going to</i> y el continuous</h4>
        <p>Es sutil pero real:</p>
        <ul>
          <li><span class="en" data-say>I'm going to meet the client</span> — tengo la <b>intención</b>,
          todavía no coordiné</li>
          <li><span class="en" data-say>I'm meeting the client on Friday</span> — está <b>agendado</b>,
          hay invitación en el calendario</li>
        </ul>
        <p>El continuous implica que <b>ya hay un arreglo con otra persona</b>. Por eso se usa tanto
        para reuniones, viajes y citas.</p>

        <div class="aviso">
          <b>Un cuarto caso, para completar:</b> el <b>present simple</b> también sirve para futuro,
          pero solo con <b>horarios fijos</b> — cosas que están en una tabla:<br><br>
          <span class="en" data-say>The train leaves at six.</span><br>
          <span class="en" data-say>The demo starts at ten.</span><br><br>
          No sirve para planes personales: ❌ <i>I meet the client on Friday</i>.
        </div>

        <h4>Cómo elegir, en dos preguntas</h4>
        <ol>
          <li><b>¿Ya está agendado con alguien?</b> → present continuous</li>
          <li><b>¿Lo decidiste antes de esta conversación?</b> → <i>going to</i>. ¿Lo estás decidiendo ahora?
          → <i>will</i></li>
        </ol>

        <div class="analogia">
          <b>Las tres en un mismo día:</b><br>
          <span class="en" data-say>I'm meeting the client at ten.</span> (agendado)<br>
          <span class="en" data-say>After that I'm going to review the PRs.</span> (planeado)<br>
          — <i>The build is red.</i><br>
          <span class="en" data-say>Oh, I'll fix that first.</span> (recién decidido)
        </div>

        <p><b>Y la buena noticia:</b> equivocarse acá casi nunca genera malentendidos. Las tres se
        entienden. La diferencia es de naturalidad, no de comprensión.</p>
      `,

      tecnico: `
        <p><b>El inglés no tiene un tiempo futuro morfológico.</b> A diferencia del español, que conjuga
        («trabajaré»), el inglés expresa el futuro con recursos <b>perifrásticos</b>: modales, semiauxiliares
        y aspecto. Por eso hay varias formas y cada una carga un matiz distinto.</p>

        <table>
          <tr><th>Forma</th><th>Recurso</th><th>Matiz que aporta</th></tr>
          <tr><td>will + base</td><td>modal</td><td>modalidad: volición, predicción</td></tr>
          <tr><td>be going to + base</td><td>semiauxiliar</td><td>prospectivo: el presente apunta al futuro</td></tr>
          <tr><td>be + -ing</td><td>aspecto progresivo</td><td>arreglo ya existente</td></tr>
          <tr><td>present simple</td><td>—</td><td>calendario fijo, impersonal</td></tr>
        </table>

        <div class="nota-tec">
          <b>El criterio que ordena las tres primeras: qué tan «anclado» está el futuro en el presente.</b>
          <br><br>
          <i>will</i> — nada lo ancla: es pura modalidad
          <br><i>going to</i> — hay una intención o una evidencia
          <br><i>present continuous</i> — hay un <b>arreglo concreto</b>: fecha, invitación, compromiso con otro
          <br><br>
          Va de menos a más concreto. Vista así, la elección deja de ser arbitraria.
        </div>

        <p><b>Sobre el present simple con valor de futuro.</b> Requiere que el evento esté fijado por un
        <b>calendario impersonal</b>: horarios de transporte, agendas de conferencias, programación de
        clases. No admite decisiones personales.</p>
        <ul>
          <li>✅ <i>The demo starts at ten.</i> — está en la agenda del evento</li>
          <li>✅ <i>My flight leaves at six.</i></li>
          <li>❌ <i>I meet the client on Friday.</i> — es una decisión personal → continuous</li>
        </ul>

        <p><b>Sobre la frecuencia real.</b> En inglés hablado corriente, <i>going to</i> y el present
        continuous cubren la mayoría de los usos futuros. <i>will</i> aparece sobre todo en
        ofrecimientos, promesas y predicciones — que en contexto de trabajo son muy frecuentes,
        pero acotados a esos actos de habla.</p>

        <p><b>Y una nota tranquilizadora:</b> los errores de elección entre estas formas casi nunca
        generan malentendidos. Es una de las áreas donde la precisión suma naturalidad pero no
        comprensión — muy distinto de, por ejemplo, confundir <i>by</i> con <i>until</i>.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Las tres formas de futuro ordenadas por cuánto las ancla el presente">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">De menos anclado a más anclado</text>

          <line x1="80" y1="60" x2="600" y2="60" stroke="currentColor" opacity="0.2" stroke-width="2"/>
          <text x="80" y="48" font-size="11" fill="currentColor" opacity="0.6">nada lo sostiene</text>
          <text x="600" y="48" text-anchor="end" font-size="11" fill="currentColor" opacity="0.6">hay un compromiso</text>

          <g>
            <rect x="34" y="74" width="196" height="112" rx="10" fill="#22d3ee" opacity="0.1" stroke="#22d3ee" stroke-width="1.3"/>
            <text x="132" y="98" text-anchor="middle" font-size="16" font-weight="800" fill="#22d3ee">will</text>
            <text x="132" y="118" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.75">lo decido ahora mismo</text>
            <text x="132" y="142" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.9">I'll take a look.</text>
            <text x="132" y="160" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.9">I'll send you the link.</text>
            <text x="132" y="178" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.55">ofrecimientos y promesas</text>
          </g>

          <g>
            <rect x="242" y="74" width="196" height="112" rx="10" fill="#34d399" opacity="0.1" stroke="#34d399" stroke-width="1.3"/>
            <text x="340" y="98" text-anchor="middle" font-size="16" font-weight="800" fill="#34d399">going to</text>
            <text x="340" y="118" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.75">ya lo tenía decidido</text>
            <text x="340" y="142" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.9">I'm going to refactor</text>
            <text x="340" y="160" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.9">this module.</text>
            <text x="340" y="178" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.55">intención o evidencia</text>
          </g>

          <g>
            <rect x="450" y="74" width="196" height="112" rx="10" fill="#c084fc" opacity="0.1" stroke="#c084fc" stroke-width="1.3"/>
            <text x="548" y="98" text-anchor="middle" font-size="16" font-weight="800" fill="#c084fc">-ing</text>
            <text x="548" y="118" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.75">ya está agendado</text>
            <text x="548" y="142" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.9">I'm meeting the client</text>
            <text x="548" y="160" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.9">on Friday.</text>
            <text x="548" y="178" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.55">hay invitación, hay fecha</text>
          </g>

          <rect x="34" y="200" width="612" height="34" rx="8" fill="#fbbf24" opacity="0.1" stroke="#fbbf24" stroke-width="1.2"/>
          <text x="340" y="221" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">
            Y un cuarto: present simple, solo para horarios fijos → "The demo starts at ten."
          </text>

          <rect x="34" y="242" width="612" height="32" rx="8" fill="#34d399" opacity="0.1"/>
          <text x="340" y="263" text-anchor="middle" font-size="12" font-weight="600" fill="#34d399">
            Elegir mal acá casi nunca genera malentendidos: es naturalidad, no comprensión
          </text>
        </svg>`,
        pie: 'El inglés no conjuga el futuro: lo arma con recursos distintos, y cada uno aporta su matiz.',
      },

      escucha: {
        intro: '<p>Las tres formas mezcladas, como aparecen en un día real de trabajo.</p>',
        items: [
          { texto: "I'm meeting the client at ten.", es: 'Me reúno con el cliente a las diez.',
            nota: 'Continuous: ya está <b>agendado</b>, hay invitación en el calendario.' },
          { texto: "After that I'm going to review the PRs.", es: 'Después de eso voy a revisar los PRs.',
            nota: '<b>going to</b>: es un plan tuyo, decidido antes, pero sin cita con nadie.' },
          { texto: "The build is red — OK, I'll fix that first.", es: 'El build está en rojo. Dale, arreglo eso primero.',
            nota: '<b>will</b>: la decisión se toma en el momento, al enterarte.' },
          { texto: 'The demo starts at ten sharp.', es: 'La demo empieza a las diez en punto.',
            nota: 'Present simple: horario fijo de agenda. <b>sharp</b> = en punto.' },
        ],
      },

      practica: `
        <p><b>Contá tu semana</b> usando las tres formas al menos una vez:</p>
        <ol>
          <li>Algo agendado: <i>I'm ______ on ______.</i></li>
          <li>Un plan tuyo: <i>I'm going to ______.</i></li>
          <li>Un ofrecimiento: <i>I'll ______.</i></li>
        </ol>

        <p><b>Las dos preguntas para decidir:</b></p>
        <ol>
          <li>¿Ya está agendado con alguien? → <b>continuous</b></li>
          <li>¿Lo decidí antes de esta charla? → <b>going to</b>. ¿Lo decido ahora? → <b>will</b></li>
        </ol>

        <p><b>Y no te obsesiones.</b> Elegir mal entre estas tres casi nunca genera malentendidos —
        las tres se entienden. Es muy distinto de confundir <i>by</i> con <i>until</i>, donde el error
        sí rompe una entrega. Acá lo que ganás es <b>naturalidad</b>, y eso llega con el tiempo.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Tenés la reunión con el cliente ya agendada en el calendario para el viernes. ¿Cuál suena más natural?',
          opciones: [
            "I'll meet the client on Friday.",
            "I'm going to meet the client on Friday.",
            "I'm meeting the client on Friday.",
            'I meet the client on Friday.',
          ],
          correcta: 2,
          porQue: 'El continuous implica <b>arreglo previo con otra persona</b>: hay invitación, hay fecha. Es el más natural para reuniones.',
          porQueNo: {
            0: 'Sugiere que lo estás decidiendo ahora mismo.',
            1: 'Correcto, pero sugiere intención sin coordinar todavía.',
            3: 'El present simple se reserva para horarios fijos de agenda impersonal.',
          },
        },
        {
          tipo: 'opcion',
          p: '¿Cuál usarías para «la demo empieza a las diez»?',
          opciones: [
            'The demo is going to start at ten.',
            'The demo starts at ten.',
            'The demo will start at ten.',
            'The demo is start at ten.',
          ],
          correcta: 1,
          porQue: 'Es un <b>horario fijo de agenda</b>, y para eso el inglés usa present simple, igual que con trenes y clases.',
          porQueNo: {
            0: 'Se entiende, pero suena a intención más que a horario establecido.',
            2: 'Suena a predicción, no a algo ya fijado.',
            3: 'No es una estructura válida.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Alguien acaba de reportar un problema y te ofrecés a mirarlo. Completá: <b>OK, ______ take a look.</b>',
          respuesta: "I'll",
          respuestas: ['I will'],
          porQue: 'Decisión tomada <b>en el momento</b> de hablar → <i>will</i>.',
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Voy a refactorizar este módulo.</b> (ya lo tenías planeado)',
          respuesta: "I'm going to refactor this module",
          respuestas: ['I am going to refactor this module'],
          pista: 'Plan previo.',
          porQue: 'Plan decidido antes de la conversación → <b>going to</b>.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «Me reúno con el cliente el viernes.» (ya agendado)',
          respuesta: "I'm meeting the client on Friday",
          porQue: 'Present continuous con valor de futuro: hay arreglo concreto con otra persona.',
        },
      ],

      errores: [
        { mito: 'El present continuous solo sirve para lo que pasa ahora.',
          realidad: 'También expresa <b>futuro agendado</b>: <i>I\'m meeting the client on Friday</i>. ' +
                    'El requisito es que haya un <b>arreglo concreto</b> — fecha, invitación, compromiso con alguien. ' +
                    'Por eso es la forma natural para reuniones y viajes.' },
        { mito: 'El present simple nunca sirve para hablar del futuro.',
          realidad: 'Sí, pero solo con <b>horarios fijos de agenda impersonal</b>: <i>The train leaves at six</i>, ' +
                    '<i>The demo starts at ten</i>. No admite decisiones personales: ❌ <i>I meet the client on Friday</i>.' },
        { mito: 'Si elijo mal entre will, going to y continuous, no me van a entender.',
          realidad: 'Casi siempre te entienden igual. Es una de las áreas donde la precisión aporta <b>naturalidad</b>, ' +
                    'no comprensión. Muy distinto de confundir <i>by</i> con <i>until</i>, donde el error rompe una entrega.' },
      ],

      glosario: [
        { t: 'Perífrasis de futuro', d: 'El inglés no conjuga el futuro: lo arma con modales (<i>will</i>), semiauxiliares (<i>going to</i>) y aspecto (<i>-ing</i>).' },
        { t: 'Futuro agendado', d: 'El present continuous con valor futuro. Requiere arreglo concreto: fecha, invitación, compromiso.' },
        { t: 'Horario fijo', d: 'El único caso donde el present simple sirve para futuro: trenes, clases, agendas de eventos.' },
        { t: 'Sharp', d: 'En punto. <i>The demo starts at ten sharp</i>.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l4',
      titulo: 'Planificar y comprometerte',
      minutos: 8,

      simple: `
        <p>Todo el módulo aplicado a lo que más lo vas a usar: <b>decir cuándo vas a tener algo listo</b>.</p>

        <h4>Los niveles de compromiso</h4>
        <p>El inglés de trabajo distingue con bastante precisión cuánto te estás comprometiendo:</p>
        <table>
          <tr><th>Frase</th><th>Cuánto te comprometés</th></tr>
          <tr><td><span class="en" data-say>It'll be ready by Friday.</span></td><td>compromiso firme</td></tr>
          <tr><td><span class="en" data-say>I'm going to finish it today.</span></td><td>ese es el plan</td></tr>
          <tr><td><span class="en" data-say>I should be able to finish it today.</span></td><td>probable, con margen</td></tr>
          <tr><td><span class="en" data-say>I'll try to get it done, but I can't promise.</span></td><td>advertencia explícita</td></tr>
          <tr><td><span class="en" data-say>I'm not sure I can commit to that.</span></td><td>no, dicho bien</td></tr>
        </table>

        <p><b>Usar el nivel correcto importa.</b> Prometer firme algo que no vas a cumplir daña mucho
        más que decir <i>I should be able to</i> desde el principio.</p>

        <h4>Estimar</h4>
        <ul>
          <li><span class="en" data-say>It'll take about two days.</span> — <b>about</b> = más o menos</li>
          <li><span class="en" data-say>Probably by the end of the week.</span></li>
          <li><span class="en" data-say>A couple of hours, maybe.</span> — <b>a couple of</b> = un par de</li>
          <li><span class="en" data-say>Hard to say — it depends on the API.</span> — difícil de decir</li>
        </ul>

        <div class="aviso">
          <b><i>Hard to say</i> es una respuesta legítima y profesional.</b> Cuando no tenés forma de
          estimar, decirlo es mucho mejor que inventar un número. Y se puede completar:<br><br>
          <span class="en" data-say>Hard to say. Let me look into it and I'll get back to you with an estimate.</span>
        </div>

        <h4>Reprogramar</h4>
        <ul>
          <li><span class="en" data-say>I won't be able to finish it today.</span></li>
          <li><span class="en" data-say>It's going to take longer than I thought.</span></li>
          <li><span class="en" data-say>Can we push it to next week?</span> — ¿lo pasamos a la semana que viene?</li>
          <li><span class="en" data-say>I'll need another day.</span></li>
        </ul>

        <p><b>Avisar temprano es la regla.</b> En equipos que funcionan bien, mover una fecha con
        aviso es normal; enterarse el día del vencimiento no lo es.</p>

        <h4>Cerrar la conversación</h4>
        <ul>
          <li><span class="en" data-say>I'll keep you posted.</span> — te voy manteniendo al tanto</li>
          <li><span class="en" data-say>I'll let you know when it's done.</span></li>
          <li><span class="en" data-say>I'll ping you if anything changes.</span></li>
        </ul>
      `,

      tecnico: `
        <p><b>La gradación del compromiso</b> se construye con modales y mitigadores, igual que la
        cortesía del módulo 5. Cada pieza baja o sube el nivel:</p>

        <table>
          <tr><th>Recurso</th><th>Efecto</th><th>Ejemplo</th></tr>
          <tr><td>will</td><td>compromiso firme</td><td>It'll be ready by Friday.</td></tr>
          <tr><td>should be able to</td><td>probabilidad alta con margen</td><td>I should be able to finish it.</td></tr>
          <tr><td>might / may</td><td>posibilidad abierta</td><td>It might take longer.</td></tr>
          <tr><td>I'll try to</td><td>esfuerzo sin garantía</td><td>I'll try to get it done.</td></tr>
          <tr><td>about / roughly</td><td>aproximación numérica</td><td>about two days</td></tr>
        </table>

        <div class="nota-tec">
          <b>La cultura del compromiso en equipos internacionales.</b> Se espera que la palabra tenga
          peso: si decís <i>It'll be ready by Friday</i>, eso se planifica alrededor tuyo.
          <br><br>
          Por eso existen tantos niveles intermedios. Usar <i>I should be able to</i> cuando hay
          incertidumbre no es debilidad — es <b>información precisa</b>, y se valora. Lo que daña la
          confianza es prometer firme y no cumplir.
        </div>

        <p><b>Sobre <i>should</i> con valor de probabilidad.</b> No es «deber» acá: <i>I should be able
        to finish it</i> significa «lo más probable es que pueda». Es un uso muy frecuente en
        estimaciones y conviene reconocerlo, porque la traducción literal («debería poder») suena
        más dudosa en español de lo que es en inglés.</p>

        <p><b>Vocabulario de reprogramación:</b></p>
        <ul>
          <li><i>push it to next week</i> — moverlo a la semana que viene</li>
          <li><i>bump the deadline</i> — correr la fecha</li>
          <li><i>de-scope</i> — sacar cosas del alcance para llegar</li>
          <li><i>buy some time</i> — ganar tiempo</li>
          <li><i>keep you posted</i> — mantenerte al tanto</li>
        </ul>

        <p><b>Sobre <i>ping</i>.</b> Es el verbo estándar para «escribirle a alguien» en contexto
        técnico: <i>I'll ping you when it's ready</i>. Viene del comando de red y es completamente
        normal en el registro laboral.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Escala de niveles de compromiso al dar una fecha">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Cuánto te estás comprometiendo</text>

          <line x1="70" y1="52" x2="610" y2="52" stroke="currentColor" opacity="0.2" stroke-width="2"/>
          <text x="70" y="42" font-size="11" font-weight="700" fill="#34d399">firme</text>
          <text x="610" y="42" text-anchor="end" font-size="11" font-weight="700" fill="#f87171">nada</text>

          <g font-size="12">
            <rect x="34" y="66" width="612" height="30" rx="7" fill="#34d399" opacity="0.15" stroke="#34d399" stroke-width="1.2"/>
            <text x="52" y="86" fill="currentColor" opacity="0.9" font-weight="600">It'll be ready by Friday.</text>
            <text x="628" y="86" text-anchor="end" font-size="11" fill="#34d399">compromiso firme</text>

            <rect x="34" y="102" width="612" height="30" rx="7" fill="#22d3ee" opacity="0.12" stroke="#22d3ee" stroke-width="1.1"/>
            <text x="52" y="122" fill="currentColor" opacity="0.9">I'm going to finish it today.</text>
            <text x="628" y="122" text-anchor="end" font-size="11" fill="#22d3ee">ese es el plan</text>

            <rect x="34" y="138" width="612" height="30" rx="7" fill="#fbbf24" opacity="0.12" stroke="#fbbf24" stroke-width="1.1"/>
            <text x="52" y="158" fill="currentColor" opacity="0.9">I should be able to finish it today.</text>
            <text x="628" y="158" text-anchor="end" font-size="11" fill="#fbbf24">probable, con margen</text>

            <rect x="34" y="174" width="612" height="30" rx="7" fill="#f59e0b" opacity="0.12" stroke="#f59e0b" stroke-width="1.1"/>
            <text x="52" y="194" fill="currentColor" opacity="0.9">I'll try, but I can't promise.</text>
            <text x="628" y="194" text-anchor="end" font-size="11" fill="#f59e0b">advertencia explícita</text>

            <rect x="34" y="210" width="612" height="30" rx="7" fill="#f87171" opacity="0.12" stroke="#f87171" stroke-width="1.1"/>
            <text x="52" y="230" fill="currentColor" opacity="0.9">I'm not sure I can commit to that.</text>
            <text x="628" y="230" text-anchor="end" font-size="11" fill="#f87171">un no, dicho bien</text>
          </g>

          <text x="340" y="260" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">
            Usar el nivel correcto se valora. Prometer firme y no cumplir es lo que daña la confianza.
          </text>
        </svg>`,
        pie: 'Cinco niveles, y todos son respuestas profesionales. El error es elegir uno más firme del que corresponde.',
      },

      escucha: {
        intro: '<p>Compromisos, estimaciones y reprogramaciones. Son las conversaciones ' +
               'que más vas a tener sobre plazos.</p>',
        items: [
          { texto: "It'll be ready by Friday.", es: 'Va a estar listo para el viernes.',
            nota: 'Compromiso firme. Si lo decís, el equipo planifica alrededor tuyo.' },
          { texto: 'I should be able to finish it today.', es: 'Debería poder terminarlo hoy.',
            nota: '<b>should</b> acá no es «deber»: es probabilidad alta. No es debilidad, es precisión.' },
          { texto: "It'll take about two days.", es: 'Va a llevar como dos días.',
            nota: '<b>about</b> = más o menos. Es la forma normal de aproximar.' },
          { texto: "Hard to say — it depends on the API.", es: 'Difícil de decir, depende de la API.',
            nota: 'Respuesta legítima. Mejor que inventar un número que no vas a cumplir.' },
          { texto: "I won't be able to finish it today. Can we push it to Monday?", es: 'No voy a poder terminarlo hoy. ¿Lo pasamos al lunes?',
            nota: '<b>push it to</b> = moverlo a. Avisar temprano es la regla; enterarse el día del vencimiento no.' },
        ],
      },

      practica: `
        <p><b>Practicá los cinco niveles</b> con una tarea real tuya. Decí la misma cosa cinco veces,
        subiendo y bajando el compromiso:</p>
        <ol>
          <li>It'll be ready by ______.</li>
          <li>I'm going to finish ______ today.</li>
          <li>I should be able to ______.</li>
          <li>I'll try to ______, but I can't promise.</li>
          <li>I'm not sure I can commit to ______.</li>
        </ol>

        <p><b>Después elegí cuál corresponde de verdad</b> a tu situación actual. Ese ejercicio —
        elegir el nivel honesto en vez del más cómodo — es más útil que la gramática.</p>

        <p><b>Y guardate estas tres para reprogramar:</b></p>
        <ul>
          <li><span class="en" data-say>It's going to take longer than I thought.</span></li>
          <li><span class="en" data-say>Can we push it to next week?</span></li>
          <li><span class="en" data-say>I'll keep you posted.</span></li>
        </ul>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Creés que vas a llegar pero hay incertidumbre. ¿Cuál es la respuesta más honesta y profesional?',
          opciones: [
            "It'll definitely be ready today.",
            'I should be able to finish it today.',
            'Maybe.',
            "I don't know.",
          ],
          correcta: 1,
          porQue: '<b>should be able to</b> comunica probabilidad alta <b>con margen</b>. No es debilidad: es información precisa, y se valora.',
          porQueNo: {
            0: 'Prometer firme algo incierto es lo que más daña la confianza si no se cumple.',
            2: 'No le da al otro nada con qué planificar.',
            3: 'Es honesto pero incompleto: conviene agregar cuándo vas a poder estimar.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá con el aproximador: <b>It\'ll take ______ two days.</b> (más o menos)',
          respuesta: 'about',
          respuestas: ['roughly', 'around'],
          porQue: '<b>about</b> es el más común. <i>roughly</i> y <i>around</i> también funcionan.',
        },
        {
          tipo: 'opcion',
          p: 'No vas a llegar con la fecha. ¿Qué hacés?',
          opciones: [
            'Esperar al día del vencimiento y avisar ahí',
            "Avisar ahora: I won't be able to finish it today, can we push it to Monday?",
            'No decir nada y entregar tarde',
            'Entregar algo incompleto sin avisar',
          ],
          correcta: 1,
          porQue: 'Mover una fecha <b>con aviso</b> es normal en cualquier equipo. Enterarse el día del vencimiento no lo es.',
          porQueNo: {
            0: 'Le saca al equipo toda posibilidad de reorganizarse.',
            2: 'Es lo que más daña la confianza.',
            3: 'Genera trabajo extra para el que revisa y sorpresas peores después.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Te voy manteniendo al tanto.</b>',
          respuesta: "I'll keep you posted",
          respuestas: ['I will keep you posted'],
          pista: 'Es una expresión hecha con «posted».',
          porQue: '<b>keep you posted</b> es la fórmula estándar. También vale <i>I\'ll keep you updated</i>.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «¿Lo podemos pasar a la semana que viene?»',
          respuesta: 'Can we push it to next week',
          porQue: '<b>push it to</b> = moverlo a. Y <i>next week</i> sin preposición, como vimos en el módulo 4.',
        },
      ],

      errores: [
        { mito: 'Decir <i>I should be able to</i> en vez de prometer firme suena inseguro.',
          realidad: 'Al contrario: es <b>información precisa</b> y se valora. En equipos internacionales la palabra tiene peso — ' +
                    'si decís <i>It\'ll be ready by Friday</i>, se planifica alrededor tuyo. ' +
                    'Prometer firme y no cumplir daña mucho más que matizar desde el principio.' },
        { mito: 'Si no puedo estimar, tengo que dar un número igual.',
          realidad: '<b>Hard to say</b> es una respuesta legítima y profesional. Lo que la completa es decir cuándo vas ' +
                    'a poder estimar: <i>Hard to say. Let me look into it and I\'ll get back to you with an estimate.</i> ' +
                    'Inventar un número que no vas a cumplir es peor.' },
        { mito: 'Conviene avisar de una demora lo más tarde posible, por si llego.',
          realidad: 'Es al revés. Mover una fecha <b>con aviso</b> es normal; enterarse el día del vencimiento le saca ' +
                    'al equipo toda posibilidad de reorganizarse. Avisar temprano es de las cosas que más construyen ' +
                    'reputación profesional.' },
      ],

      glosario: [
        { t: 'Should be able to', d: 'Probabilidad alta con margen. <i>should</i> acá no es «deber», es «lo más probable».' },
        { t: 'About / roughly', d: 'Más o menos. Los aproximadores estándar para estimaciones.' },
        { t: 'Hard to say', d: 'Difícil de decir. Respuesta legítima cuando no tenés forma de estimar.' },
        { t: 'Push it to', d: 'Moverlo a otra fecha. <i>Can we push it to next week?</i>' },
        { t: 'Keep you posted', d: 'Mantenerte al tanto. La fórmula estándar para cerrar sin cerrar del todo.' },
        { t: 'Ping', d: 'Escribirle a alguien. <i>I\'ll ping you when it\'s ready.</i> Viene del comando de red y es normal en el registro laboral.' },
      ],
    },
  ],

  /* ==================================================================== */
  vocabulario: [
    { en: 'going to', es: 'ir a (plan previo)', pista: 'Al hablar suena "gonna".', ejemplo: "I'm going to refactor this.", ejemploEs: 'Voy a refactorizar esto.' },
    { en: 'will', es: 'auxiliar de futuro', pista: 'Decisión en el momento, ofrecimiento o predicción.', ejemplo: "I'll take a look.", ejemploEs: 'Le echo un vistazo.' },
    { en: "won't", es: 'no va a / se resiste a', pista: 'Irregular: no es willn\'t.', ejemplo: "The server won't start.", ejemploEs: 'El servidor no arranca.' },
    { en: 'about', es: 'más o menos', ejemplo: "It'll take about two days.", ejemploEs: 'Va a llevar como dos días.' },
    { en: 'a couple of', es: 'un par de', ejemplo: 'A couple of hours, maybe.', ejemploEs: 'Un par de horas, quizá.' },
    { en: 'probably', es: 'probablemente', ejemplo: 'Probably by the end of the week.', ejemploEs: 'Probablemente para fin de semana.' },
    { en: 'should be able to', es: 'debería poder', pista: 'Probabilidad alta, no obligación.', ejemplo: 'I should be able to finish it today.', ejemploEs: 'Debería poder terminarlo hoy.' },
    { en: 'hard to say', es: 'difícil de decir', pista: 'Respuesta legítima cuando no podés estimar.', ejemplo: 'Hard to say, it depends on the API.', ejemploEs: 'Difícil de decir, depende de la API.' },
    { en: 'push it to', es: 'moverlo a (otra fecha)', ejemplo: 'Can we push it to next week?', ejemploEs: '¿Lo podemos pasar a la semana que viene?' },
    { en: 'keep you posted', es: 'mantenerte al tanto', ejemplo: "I'll keep you posted.", ejemploEs: 'Te voy manteniendo al tanto.' },
    { en: 'ping', es: 'escribirle a alguien', ejemplo: "I'll ping you when it's ready.", ejemploEs: 'Te escribo cuando esté listo.' },
    { en: 'estimate', es: 'estimación', ejemplo: "I'll get back to you with an estimate.", ejemploEs: 'Te vuelvo con una estimación.' },
    { en: 'deadline', es: 'fecha límite', ejemplo: 'The deadline is Friday.', ejemploEs: 'La fecha límite es el viernes.' },
    { en: 'promise', es: 'prometer', ejemplo: "I'll try, but I can't promise.", ejemploEs: 'Voy a intentar, pero no puedo prometer.' },
    { en: 'handle', es: 'ocuparse de', ejemplo: "Don't worry, I'll handle it.", ejemploEs: 'No te preocupes, me ocupo yo.' },
    { en: 'sharp', es: 'en punto', ejemplo: 'The demo starts at ten sharp.', ejemploEs: 'La demo empieza a las diez en punto.' },
    { en: 'next week', es: 'la semana que viene', pista: 'Sin preposición.', ejemplo: 'We are going to deploy next week.', ejemploEs: 'Vamos a desplegar la semana que viene.' },
    { en: 'end of the week', es: 'fin de semana laboral', ejemplo: 'Probably by the end of the week.', ejemploEs: 'Probablemente para el fin de semana.' },
    { en: 'longer', es: 'más tiempo', ejemplo: 'It is going to take longer than I thought.', ejemploEs: 'Va a llevar más de lo que pensaba.' },
    { en: 'migrate', es: 'migrar', ejemplo: 'We are going to migrate to Postgres.', ejemploEs: 'Vamos a migrar a Postgres.' },
    { en: 'refactor', es: 'refactorizar', ejemplo: "I'm going to refactor this module.", ejemploEs: 'Voy a refactorizar este módulo.' },
    { en: 'commit to', es: 'comprometerse a', ejemplo: 'I am not sure I can commit to that.', ejemploEs: 'No estoy seguro de poder comprometerme a eso.' },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Qué distingue realmente a <i>will</i> de <i>going to</i>?',
      opciones: [
        'Que going to es para futuro cercano y will para lejano',
        'Cuándo se tomó la decisión: antes de hablar (going to) o en el momento (will)',
        'Que will es más formal',
        'Que going to solo se usa en preguntas',
      ],
      correcta: 1,
      porQue: 'La regla de la distancia temporal es falsa: <i>I\'m going to retire in thirty years</i> es correcto, y <i>I\'ll do it now</i> también.',
      porQueNo: {
        0: 'Es la regla más difundida y no se sostiene con los ejemplos.',
        2: 'No hay diferencia de registro entre las dos.',
        3: 'Se usa en afirmativas, negativas y preguntas por igual.',
      },
    },
    {
      p: 'Alguien reporta que el staging se cayó y decidís en ese momento ir a mirar. ¿Qué decís?',
      opciones: ["I'm going to take a look.", "I'll take a look.", 'I take a look.', "I'm taking a look."],
      correcta: 1,
      porQue: 'Decisión espontánea, tomada al enterarte → <b>will</b>.',
      porQueNo: {
        0: 'Sugiere que ya lo tenías planeado antes de que te lo dijeran.',
        2: 'El present simple no expresa decisiones futuras.',
        3: 'El continuous implicaría que ya estaba agendado.',
      },
    },
    {
      p: '¿Cuál es la negación de <b>will</b>?',
      opciones: ['willn\'t', "won't", 'will not be', 'wouldn\'t'],
      correcta: 1,
      porQue: '<b>won\'t</b>. Viene de <i>woll not</i>, una variante antigua que solo sobrevivió en la negación.',
      porQueNo: {
        0: 'No existe esa forma.',
        2: '<i>will not</i> es la forma completa, pero <i>be</i> ahí sobra.',
        3: '<i>wouldn\'t</i> es la negación de <i>would</i>.',
      },
    },
    {
      p: '¿Qué significa <i>The server won\'t start</i>?',
      opciones: [
        'El servidor arrancará más tarde',
        'El servidor no arranca: se resiste, ya se probó',
        'El servidor no debería arrancar',
        'El servidor va a arrancar mañana',
      ],
      correcta: 1,
      porQue: '<b>won\'t</b> con sujeto inanimado expresa <b>resistencia</b>, no futuro. Es muy usado en contexto técnico.',
      porQueNo: {
        0: 'Diría lo contrario.',
        2: 'Eso sería <i>shouldn\'t start</i>.',
        3: 'Tampoco: no hay valor de futuro acá.',
      },
    },
    {
      p: 'Tenés una reunión ya agendada con el cliente para el viernes. ¿Cuál suena más natural?',
      opciones: [
        "I'll meet the client on Friday.",
        "I'm meeting the client on Friday.",
        'I meet the client on Friday.',
        'I will meeting the client on Friday.',
      ],
      correcta: 1,
      porQue: 'El present continuous con valor de futuro implica <b>arreglo concreto</b>: hay fecha e invitación.',
      porQueNo: {
        0: 'Sugiere decisión en el momento.',
        2: 'El present simple se reserva para horarios fijos de agenda impersonal.',
        3: 'Después de <i>will</i> va la forma base.',
      },
    },
    {
      p: '¿Cuándo sirve el present simple para hablar del futuro?',
      opciones: [
        'Nunca',
        'Solo con horarios fijos de agenda: trenes, clases, demos programadas',
        'Siempre que sea un plan personal',
        'Solo en preguntas',
      ],
      correcta: 1,
      porQue: '<i>The demo starts at ten</i>, <i>The train leaves at six</i>. No admite decisiones personales: ❌ <i>I meet the client on Friday</i>.',
      porQueNo: {
        0: 'Sí sirve, en ese caso acotado.',
        2: 'Para planes personales van <i>going to</i> o el continuous.',
        3: 'Se usa en afirmativas igual.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: [
        "If the build will fail, I revert it.",
        "If the build fails, I'll revert it.",
        "If the build will fail, I'll revert it.",
        'If the build fail, I revert it.',
      ],
      correcta: 1,
      porQue: 'Después de <b>if</b> nunca va <i>will</i>: la condición va en present simple y <i>will</i> en la otra mitad.',
      porQueNo: {
        0: 'Doble error: <i>will</i> tras <i>if</i> y falta en la consecuencia.',
        2: '<i>will</i> después de <i>if</i> sigue siendo error.',
        3: 'Faltan la -s de tercera persona y el <i>will</i>.',
      },
    },
    {
      p: '¿Qué significa "gonna" y cuándo se usa?',
      opciones: [
        'Es una palabra distinta de going to',
        'Es la pronunciación reducida de going to; normal al hablar, informal al escribir',
        'Es inglés mal hablado',
        'Solo lo usan los jóvenes',
      ],
      correcta: 1,
      porQue: 'Es la pronunciación normal en cualquier registro hablado. Lo que sí es informal es <b>escribirlo</b>.',
      porQueNo: {
        0: 'Es la misma construcción, comprimida.',
        2: 'Es la forma corriente en todos los niveles.',
        3: 'La usan hablantes de todas las edades.',
      },
    },
    {
      p: 'Creés que vas a llegar hoy pero hay incertidumbre. ¿Cuál es la mejor respuesta?',
      opciones: [
        "It'll definitely be ready today.",
        'I should be able to finish it today.',
        'Maybe.',
        "I'll try.",
      ],
      correcta: 1,
      porQue: '<b>should be able to</b> comunica probabilidad alta con margen. Es información precisa, y se valora.',
      porQueNo: {
        0: 'Prometer firme algo incierto es lo que más daña la confianza si no se cumple.',
        2: 'No le da al otro nada con qué planificar.',
        3: 'Suena a compromiso sin serlo, y genera falsas expectativas.',
      },
    },
    {
      p: 'No podés estimar cuánto va a llevar algo. ¿Qué hacés?',
      opciones: [
        'Inventar un número para no quedar mal',
        'Decir "Hard to say" y ofrecer volver con una estimación',
        'No contestar',
        'Dar la estimación más optimista posible',
      ],
      correcta: 1,
      porQue: '<b>Hard to say</b> es una respuesta legítima. Lo que la completa es decir cuándo vas a poder estimar.',
      porQueNo: {
        0: 'Un número que no vas a cumplir es peor que no dar ninguno.',
        2: 'Deja al equipo sin información.',
        3: 'Es la forma más común de generar problemas de planificación.',
      },
    },
    {
      p: '¿Qué significa <i>I\'ll keep you posted</i>?',
      opciones: ['Te voy a publicar algo', 'Te voy manteniendo al tanto', 'Te voy a enviar por correo', 'Te espero'],
      correcta: 1,
      porQue: 'Es la fórmula estándar para comprometerse a informar novedades sin fijar una fecha exacta.',
      porQueNo: {
        0: 'Nada que ver con publicar.',
        2: 'Eso sería <i>I\'ll email you</i>.',
        3: 'No tiene ese sentido.',
      },
    },
    {
      p: 'Estás viendo que la memoria sube sin parar en el gráfico. ¿Qué decís?',
      opciones: ['It will crash.', "It's going to crash.", 'It crashes.', 'It would crash.'],
      correcta: 1,
      porQue: 'Predicción con <b>evidencia visible</b>: estás viendo algo ahora que lo anticipa. Es el segundo uso de <i>going to</i>.',
      porQueNo: {
        0: 'Sería una predicción sin evidencia, más una opinión.',
        2: 'El present simple describe comportamiento habitual.',
        3: '<i>would</i> es condicional, no futuro.',
      },
    },
  ],
});
