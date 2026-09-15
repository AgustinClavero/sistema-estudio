/* ==========================================================================
   Inglés A1 · m03 — Present simple
   El tiempo verbal más usado del idioma, y el que concentra dos errores
   que se arrastran durante años: la -s de tercera persona y el do/does.
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ingles-a1',
  id: 'm03',
  titulo: 'Present simple: lo que hacés siempre',
  fuentes: ['cambridge-dic', 'bbc-learning-english', 'wordreference'],

  intro:
    '<p>El tiempo de las rutinas, los hechos y lo que es verdad en general. Es el más usado del inglés ' +
    'y el que vas a necesitar en cada frase que digas sobre tu trabajo.</p>' +
    '<p>Tiene <b>una sola irregularidad</b>: una <i>-s</i> que se agrega con <i>he</i>, <i>she</i> e <i>it</i>. ' +
    'Suena a detalle menor y no lo es — es el error más persistente del hispanohablante, y el que más ' +
    'delata el nivel real de alguien que por lo demás habla bien.</p>' +
    '<p>Y hay una segunda cosa: acá aparece <b>do</b> y <b>does</b>, ese verbo que se pide prestado para ' +
    'negar y preguntar. En el módulo 1 no hacía falta porque <i>to be</i> es la excepción. Desde ahora sí.</p>',

  lecciones: [

    /* ==================================================================== */
    {
      id: 'l1',
      titulo: 'La -s que todos se olvidan',
      minutos: 9,

      simple: `
        <p>Buena noticia primero: el present simple <b>casi no se conjuga</b>. El verbo va tal cual
        para todos los sujetos… menos uno.</p>

        <table>
          <tr><th>Sujeto</th><th>Verbo</th></tr>
          <tr><td>I</td><td><span class="en" data-say>I work</span></td></tr>
          <tr><td>you</td><td><span class="en" data-say>You work</span></td></tr>
          <tr><td><b>he / she / it</b></td><td><b><span class="en" data-say>He works</span></b></td></tr>
          <tr><td>we</td><td><span class="en" data-say>We work</span></td></tr>
          <tr><td>they</td><td><span class="en" data-say>They work</span></td></tr>
        </table>

        <p>Eso es todo. Una <b>-s</b> en la tercera persona del singular. Cinco formas iguales y una distinta.</p>

        <div class="aviso">
          <b>Y sin embargo es el error número uno.</b> No porque sea difícil de entender —lo entendés
          en diez segundos— sino porque <b>en español la información ya está en otro lado</b>. Decís
          «él trabaja» y la terminación <i>-a</i> te marca la persona. En inglés, <i>work</i> es igual
          para todos, así que esa <i>-s</i> es la <b>única</b> señal, y tu cerebro no está entrenado
          para vigilarla.
        </div>

        <h4>Las variantes de escritura</h4>
        <ul>
          <li>Termina en <b>s, sh, ch, x, o</b> → se agrega <b>-es</b>:
          <span class="en" data-say>watches</span>, <span class="en" data-say>finishes</span>,
          <span class="en" data-say>goes</span>, <span class="en" data-say>does</span></li>
          <li>Consonante + <b>y</b> → <b>-ies</b>: <span class="en" data-say>studies</span>,
          <span class="en" data-say>tries</span></li>
          <li><b>have</b> es irregular → <b><span class="en" data-say>has</span></b></li>
        </ul>
        <p>Es exactamente la misma regla que la del plural del módulo 2. Una sola regla, dos usos.</p>

        <h4>Para qué se usa</h4>
        <ul>
          <li><b>Rutinas:</b> <span class="en" data-say>I start work at nine</span></li>
          <li><b>Hechos:</b> <span class="en" data-say>The server runs on Linux</span></li>
          <li><b>Cosas permanentes:</b> <span class="en" data-say>She works at Google</span></li>
          <li><b>Cómo funciona algo:</b> <span class="en" data-say>This function returns an array</span></li>
        </ul>
        <p>Ese último uso es el que más vas a necesitar: <b>todo lo que explica cómo funciona un sistema
        va en present simple</b>. La documentación entera está escrita así.</p>
      `,

      tecnico: `
        <p>El inglés perdió casi toda su morfología verbal. De un paradigma germánico completo quedó
        una sola marca en presente: <b>-s</b> en tercera persona del singular. Es un residuo, y por eso
        parece arbitraria — porque lo es.</p>

        <p><b>Se pronuncia igual que el plural</b>, con las mismas tres realizaciones:</p>
        <table>
          <tr><th>Se dice</th><th>Cuándo</th><th>Ejemplos</th></tr>
          <tr><td>/s/</td><td>tras sonido sordo</td><td>works, gets, stops</td></tr>
          <tr><td>/z/</td><td>tras sonido sonoro o vocal</td><td>runs, needs, sees</td></tr>
          <tr><td>/ɪz/</td><td>tras siseante</td><td>watches, finishes, uses</td></tr>
        </table>

        <div class="nota-tec">
          <b>Por qué cuesta tanto, en términos de adquisición.</b> Es una marca de <b>concordancia
          redundante</b>: la información de persona ya está en el pronombre obligatorio (<i>he</i>),
          así que la <i>-s</i> no aporta nada semánticamente. Las marcas redundantes son las últimas
          en automatizarse — se entienden al instante y se producen mal durante años.
          <br><br>
          Y como omitirla no impide la comunicación, no hay presión que la corrija sola. Hay que
          vigilarla a propósito hasta que se automatice.
        </div>

        <p><b>Cuándo NO se usa el present simple</b>, que es donde el español confunde:</p>
        <ul>
          <li>Para algo que pasa <b>ahora mismo</b> va el present continuous (módulo 6).
          «Estoy trabajando» es <i>I'm working</i>, no ❌ <i>I work</i>.</li>
          <li>Para algo que empezó en el pasado y sigue, el inglés usa present perfect
          (<i>I have worked here for two years</i>) donde el español usa presente
          («trabajo acá hace dos años»). Eso es nivel B1.</li>
        </ul>

        <p><b>El uso técnico.</b> Toda la documentación de software está en present simple, porque
        describe comportamiento atemporal:</p>
        <ul>
          <li><i>This method returns a Promise.</i></li>
          <li><i>The middleware runs before every request.</i></li>
          <li><i>If the token expires, the client refreshes it.</i></li>
        </ul>
        <p>Escribir un README o el cuerpo de un PR en otro tiempo suena inmediatamente raro.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="El present simple: cinco formas iguales y una con -s">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Cinco iguales, una distinta</text>

          <g font-size="13.5">
            <rect x="90" y="40" width="180" height="30" rx="7" fill="currentColor" opacity="0.07"/>
            <text x="110" y="60" fill="currentColor" opacity="0.8">I</text>
            <text x="180" y="60" fill="currentColor" opacity="0.85" font-weight="600">work</text>

            <rect x="90" y="74" width="180" height="30" rx="7" fill="currentColor" opacity="0.07"/>
            <text x="110" y="94" fill="currentColor" opacity="0.8">you</text>
            <text x="180" y="94" fill="currentColor" opacity="0.85" font-weight="600">work</text>

            <rect x="90" y="108" width="180" height="30" rx="7" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="110" y="128" fill="currentColor" font-weight="700">he/she/it</text>
            <text x="180" y="128" fill="#f59e0b" font-weight="800">works</text>

            <rect x="90" y="142" width="180" height="30" rx="7" fill="currentColor" opacity="0.07"/>
            <text x="110" y="162" fill="currentColor" opacity="0.8">we</text>
            <text x="180" y="162" fill="currentColor" opacity="0.85" font-weight="600">work</text>

            <rect x="90" y="176" width="180" height="30" rx="7" fill="currentColor" opacity="0.07"/>
            <text x="110" y="196" fill="currentColor" opacity="0.8">they</text>
            <text x="180" y="196" fill="currentColor" opacity="0.85" font-weight="600">work</text>
          </g>

          <path d="M 278 123 L 320 123" stroke="#f59e0b" stroke-width="2" marker-end="url(#a3)"/>
          <defs>
            <marker id="a3" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#f59e0b"/>
            </marker>
          </defs>

          <rect x="330" y="94" width="316" height="58" rx="9" fill="#f87171" opacity="0.11" stroke="#f87171" stroke-width="1.3"/>
          <text x="488" y="116" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f87171">Es el error nº1 del hispanohablante</text>
          <text x="488" y="136" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.8">y no es por difícil: es porque no aporta nada</text>

          <text x="488" y="58" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.75">En español la persona ya está en el verbo:</text>
          <text x="488" y="78" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor" opacity="0.9">yo trabaj<tspan fill="#34d399">o</tspan> · él trabaj<tspan fill="#34d399">a</tspan></text>

          <line x1="90" y1="222" x2="646" y2="222" stroke="currentColor" opacity="0.15"/>

          <text x="368" y="246" text-anchor="middle" font-size="12.5" font-weight="700" fill="currentColor">Variantes de escritura</text>
          <g font-size="12" fill="currentColor" opacity="0.8">
            <text x="120" y="268">go → goes</text>
            <text x="270" y="268">watch → watches</text>
            <text x="440" y="268">study → studies</text>
            <text x="580" y="268">have → has</text>
          </g>
        </svg>`,
        pie: 'Toda la conjugación del present simple cabe en este diagrama. El problema no es aprenderla: es acordarse.',
        nota: '<p>Si te sirve de consuelo: esta <i>-s</i> se sigue perdiendo en niveles B2 cuando el hablante ' +
              'está cansado o pensando en otra cosa. La única cura es <b>vigilarla a propósito</b> hasta que salga sola.</p>',
      },

      escucha: {
        intro: '<p>El foco de esta tanda es <b>oír la -s</b>. Es un sonido chiquito al final de la palabra ' +
               'y tu oído está entrenado para ignorarlo. Escribí exactamente lo que oigas.</p>',
        items: [
          { texto: 'She works at a startup.', es: 'Ella trabaja en una startup.',
            nota: 'La <b>-s</b> de <i>works</i> se dice /s/ porque la <i>k</i> es sorda.' },
          { texto: 'He runs the deploy every Friday.', es: 'Él corre el deploy todos los viernes.',
            nota: 'Acá la <b>-s</b> suena /z/, porque la <i>n</i> es sonora. Sale solo, no hay que pensarlo.' },
          { texto: 'The build takes about ten minutes.', es: 'El build tarda unos diez minutos.',
            nota: '<b>The build</b> es tercera persona: lleva <i>takes</i>, no <i>take</i>. Aplica a cosas, no solo a personas.' },
          { texto: 'My manager finishes at six.', es: 'Mi jefe termina a las seis.',
            nota: '<b>finishes</b> lleva -es y suena /ɪz/, una sílaba entera de más.' },
        ],
      },

      practica: `
        <p><b>El chequeo de los dos segundos.</b> Cada vez que el sujeto sea <i>he</i>, <i>she</i>, <i>it</i>
        —o cualquier cosa que puedas reemplazar por ellos: <i>my boss</i>, <i>the server</i>, <i>this function</i>—
        preguntate: <b>¿le puse la -s?</b></p>

        <p>Ojo con esto último: <b>las cosas también son tercera persona</b>. Es donde más se escapa:</p>
        <ul>
          <li>❌ <i>The build take ten minutes</i> → ✅ <span class="en" data-say>The build takes ten minutes</span></li>
          <li>❌ <i>This function return an array</i> → ✅ <span class="en" data-say>This function returns an array</span></li>
          <li>❌ <i>The API need a token</i> → ✅ <span class="en" data-say>The API needs a token</span></li>
        </ul>

        <p><b>Ejercicio de escritura.</b> Escribí cinco frases sobre tu trabajo usando <i>he</i>, <i>she</i>
        o <i>it</i>. Después releelas <b>solo buscando la -s</b>. Es aburrido y es exactamente lo que
        automatiza el hábito.</p>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Completá con el verbo <b>work</b>: <b>She ______ from home on Fridays.</b>',
          respuesta: 'works',
          porQue: '<b>she</b> es tercera persona del singular → lleva <i>-s</i>.',
        },
        {
          tipo: 'hueco',
          p: 'Completá con el verbo <b>take</b>: <b>The build ______ ten minutes.</b>',
          respuesta: 'takes',
          porQue: '<b>the build</b> es una cosa, y las cosas también son tercera persona. Acá es donde más se escapa la -s.',
        },
        {
          tipo: 'hueco',
          p: 'Completá con el verbo <b>have</b>: <b>He ______ two meetings today.</b>',
          respuesta: 'has',
          porQue: '<b>have</b> es el único irregular del present simple: <i>he has</i>, no ❌ <i>he haves</i>.',
        },
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: ['This function return an array.', 'This function returns an array.', 'This function returning an array.', 'This function is return an array.'],
          correcta: 1,
          porQue: '<b>This function</b> = <i>it</i> → tercera persona → <b>returns</b>. Así está escrita toda la documentación técnica.',
          porQueNo: {
            0: 'Le falta la <i>-s</i>. Es el error más frecuente y el más visible en un PR.',
            2: '<i>returning</i> es gerundio: necesitaría <i>is</i> delante y significaría otra cosa.',
            3: 'No se combinan <i>is</i> y el verbo base así.',
          },
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «Mi jefe termina a las seis.»',
          respuesta: 'My manager finishes at six',
          porQue: '<b>finishes</b> con -es porque termina en <i>sh</i>. Misma regla que los plurales del módulo 2.',
        },
      ],

      errores: [
        { mito: 'La -s de tercera persona es un detalle menor, no cambia el significado.',
          realidad: 'No cambia el significado, es cierto — y por eso mismo es tan difícil de automatizar. ' +
                    'Pero es <b>la marca gramatical más visible del inglés escrito</b>: en un PR o un mail, ' +
                    'omitirla es lo primero que se nota. Cuesta poco arreglarla y rinde mucho.' },
        { mito: 'La -s es solo para personas (he, she).',
          realidad: 'También para <b>it</b>, y ahí entra todo lo que no es persona: <i>the build takes</i>, ' +
                    '<i>this function returns</i>, <i>the API needs</i>. Es donde más se escapa, porque el sujeto ' +
                    'no "se siente" como una tercera persona.' },
        { mito: 'Si digo <i>I work now</i> se entiende que estoy trabajando en este momento.',
          realidad: 'Se entiende, pero el present simple es para <b>rutinas y hechos</b>. Para lo que pasa ahora mismo ' +
                    'va el present continuous: <i>I\'m working</i>. Lo vemos en el módulo 6, y es otra diferencia ' +
                    'que el español no marca.' },
      ],

      glosario: [
        { t: 'Present simple', d: 'El tiempo de las rutinas, los hechos y las descripciones. Toda la documentación técnica está escrita así.' },
        { t: 'Tercera persona del singular', d: 'he, she, it — y todo lo que se pueda reemplazar por ellos: <i>my boss</i>, <i>the server</i>, <i>this function</i>.' },
        { t: 'Concordancia redundante', d: 'Una marca gramatical que no agrega información. Por eso la -s se entiende al instante y se produce mal durante años.' },
        { t: 'Has', d: 'La tercera persona de <i>have</i>. El único irregular del present simple.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l2',
      titulo: 'Do y does: negar y preguntar',
      minutos: 9,

      simple: `
        <p>Acá aparece la pieza que en el módulo 1 no hizo falta. Con <i>to be</i> alcanzaba con dar
        vuelta el orden. Con <b>cualquier otro verbo</b>, no: hay que traer un ayudante.</p>

        <p>Ese ayudante es <b>do</b> (o <b>does</b> para <i>he/she/it</i>).</p>

        <h4>Negar</h4>
        <div class="analogia">
          <span class="en" data-say>I work here</span> → <span class="en" data-say>I don't work here</span><br>
          <span class="en" data-say>She works here</span> → <span class="en" data-say>She doesn't work here</span>
        </div>

        <h4>Preguntar</h4>
        <div class="analogia">
          <span class="en" data-say>You work here</span> → <span class="en" data-say>Do you work here?</span><br>
          <span class="en" data-say>He works here</span> → <span class="en" data-say>Does he work here?</span>
        </div>

        <div class="aviso">
          <b>La trampa que hay que fijar ahora mismo: la -s se muda.</b><br><br>
          Cuando aparece <b>does</b>, el verbo principal <b>pierde la -s</b>. La marca de tercera persona
          ya está en <i>does</i>, y en inglés se pone <b>una sola vez</b>.<br><br>
          ❌ <i>Does he works here?</i> → ✅ <span class="en" data-say>Does he work here?</span><br>
          ❌ <i>She doesn't works</i> → ✅ <span class="en" data-say>She doesn't work</span>
        </div>

        <h4>Respuestas cortas, igual que con to be</h4>
        <ul>
          <li>— <span class="en" data-say>Do you work remotely?</span><br>
              — <span class="en" data-say>Yes, I do.</span> / <span class="en" data-say>No, I don't.</span></li>
          <li>— <span class="en" data-say>Does she know about this?</span><br>
              — <span class="en" data-say>Yes, she does.</span> / <span class="en" data-say>No, she doesn't.</span></li>
        </ul>

        <h4>Y con palabra de pregunta</h4>
        <ul>
          <li><span class="en" data-say>What do you do?</span> — ¿A qué te dedicás?</li>
          <li><span class="en" data-say>Where do you work?</span> — ¿Dónde trabajás?</li>
          <li><span class="en" data-say>How does it work?</span> — ¿Cómo funciona?</li>
          <li><span class="en" data-say>Why does the build fail?</span> — ¿Por qué falla el build?</li>
        </ul>
        <p>Fijate en <i>What do you do?</i>: el primer <b>do</b> es el auxiliar y el segundo es el verbo
        «hacer». No es un error de tipeo.</p>
      `,

      tecnico: `
        <p>El mecanismo se llama <b><i>do</i>-support</b> (o «perífrasis con <i>do</i>»), y es una
        particularidad del inglés que casi ningún otro idioma germánico tiene.</p>

        <p>La razón es estructural: <b>solo los auxiliares pueden moverse</b> para formar preguntas o
        recibir la negación. Un verbo léxico como <i>work</i> no puede. Entonces, cuando no hay auxiliar
        en la frase, el idioma <b>inserta uno vacío</b> —<i>do</i>— que existe solo para cargar con
        el trabajo gramatical.</p>

        <table>
          <tr><th>Frase</th><th>¿Hay auxiliar?</th><th>Pregunta</th></tr>
          <tr><td>You are tired</td><td>sí, <i>are</i></td><td>Are you tired?</td></tr>
          <tr><td>You can swim</td><td>sí, <i>can</i></td><td>Can you swim?</td></tr>
          <tr><td>You have finished</td><td>sí, <i>have</i></td><td>Have you finished?</td></tr>
          <tr><td>You work here</td><td><b>no</b></td><td><b>Do</b> you work here?</td></tr>
        </table>

        <div class="nota-tec">
          <b>De acá sale la regla de la -s.</b> La marca de concordancia va en el <b>primer elemento
          del grupo verbal</b>. Si insertás <i>do</i>, ese primer elemento pasa a ser <i>do</i> → <i>does</i>,
          y el verbo léxico queda en su forma base.
          <br><br>
          Es exactamente el mismo principio que en pasado: <i>Did you work?</i> — el pasado lo carga
          <i>did</i> y <i>work</i> vuelve a la base. Verlo así te evita memorizar dos reglas separadas.
        </div>

        <p><b><i>do</i> enfático.</b> El auxiliar también aparece en afirmativas para insistir:</p>
        <ul>
          <li><i>I <b>do</b> understand, but I disagree.</i> — Sí que entiendo, pero no estoy de acuerdo.</li>
          <li><i>It <b>does</b> work, I tested it.</i> — Sí funciona, lo probé.</li>
        </ul>
        <p>Es muy usado en discusiones técnicas para responder a una suposición del otro. Lleva acento
        fuerte en el <i>do</i>.</p>

        <p><b>Formas contraídas.</b> <i>don't</i> /doʊnt/ y <i>doesn't</i> /ˈdʌzənt/. En habla rápida
        <i>doesn't</i> se comprime mucho y es fácil perdérselo — lo cual invierte el sentido de la frase.
        Es una de las razones por las que conviene confirmar cuando no estás seguro.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cuándo hace falta do y cómo la marca de persona se muda al auxiliar">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">¿Hace falta pedir prestado un "do"?</text>

          <rect x="230" y="38" width="220" height="34" rx="8" fill="#22d3ee" opacity="0.18" stroke="#22d3ee" stroke-width="1.4"/>
          <text x="340" y="60" text-anchor="middle" font-size="12.5" font-weight="700" fill="currentColor">¿La frase ya tiene auxiliar?</text>

          <line x1="285" y1="72" x2="170" y2="102" stroke="currentColor" opacity="0.3" stroke-width="1.4"/>
          <text x="212" y="88" font-size="11.5" font-weight="700" fill="#34d399">SÍ</text>
          <line x1="395" y1="72" x2="510" y2="102" stroke="currentColor" opacity="0.3" stroke-width="1.4"/>
          <text x="462" y="88" font-size="11.5" font-weight="700" fill="#f59e0b">NO</text>

          <rect x="34" y="106" width="272" height="80" rx="9" fill="#34d399" opacity="0.11" stroke="#34d399" stroke-width="1.3"/>
          <text x="170" y="128" text-anchor="middle" font-size="12.5" font-weight="700" fill="#34d399">Se invierte y listo</text>
          <g font-size="12" fill="currentColor" opacity="0.85">
            <text x="52" y="150">You are tired → Are you tired?</text>
            <text x="52" y="170">You can swim → Can you swim?</text>
          </g>

          <rect x="374" y="106" width="272" height="80" rx="9" fill="#f59e0b" opacity="0.13" stroke="#f59e0b" stroke-width="1.3"/>
          <text x="510" y="128" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f59e0b">Se trae un do prestado</text>
          <g font-size="12" fill="currentColor" opacity="0.85">
            <text x="392" y="150">You work here →</text>
            <text x="392" y="170" font-weight="700">Do you work here?</text>
          </g>

          <line x1="34" y1="206" x2="646" y2="206" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="230" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">La marca de persona se muda al auxiliar</text>

          <g font-size="13.5">
            <rect x="80" y="244" width="230" height="32" rx="7" fill="#34d399" opacity="0.12" stroke="#34d399" stroke-width="1.2"/>
            <text x="195" y="265" text-anchor="middle" fill="currentColor">He work<tspan fill="#34d399" font-weight="800">s</tspan> here</text>

            <rect x="356" y="244" width="264" height="32" rx="7" fill="#34d399" opacity="0.12" stroke="#34d399" stroke-width="1.2"/>
            <text x="488" y="265" text-anchor="middle" fill="currentColor">Doe<tspan fill="#34d399" font-weight="800">s</tspan> he work here?</text>
          </g>

          <text x="340" y="294" text-anchor="middle" font-size="12" font-weight="600" fill="#f87171">
            ✗ Does he works here? — la -s va una sola vez, y le toca al auxiliar
          </text>
        </svg>`,
        pie: 'La misma marca de tercera persona, en un lugar o en el otro. Nunca en los dos.',
      },

      escucha: {
        intro: '<p>Ojo con <b>doesn\'t</b>: en habla rápida se comprime muchísimo y perdérselo ' +
               'te hace entender exactamente lo contrario.</p>',
        items: [
          { texto: 'Do you work remotely?', es: '¿Trabajás remoto?',
            nota: 'El <b>do</b> inicial va comprimido, casi "dyu". Es la marca de que viene una pregunta.' },
          { texto: "She doesn't work on Fridays.", es: 'Ella no trabaja los viernes.',
            nota: '<b>doesn\'t</b> suena "DA-znt", rápido. Y fijate que <i>work</i> va sin -s.' },
          { texto: 'What do you do?', es: '¿A qué te dedicás?',
            nota: 'Dos <i>do</i> seguidos: el primero es el auxiliar, el segundo el verbo «hacer». No es un error.' },
          { texto: "Why doesn't the build pass?", es: '¿Por qué no pasa el build?',
            nota: 'Pregunta negativa. <b>the build</b> es tercera persona, por eso <i>doesn\'t</i> y no <i>don\'t</i>.' },
        ],
      },

      practica: `
        <p><b>Las cuatro preguntas que más vas a usar en el trabajo.</b> Aprendelas como bloques,
        sin analizarlas:</p>
        <ul>
          <li><span class="en" data-say>What do you think?</span> — ¿Qué opinás?</li>
          <li><span class="en" data-say>How does it work?</span> — ¿Cómo funciona?</li>
          <li><span class="en" data-say>Do you have a minute?</span> — ¿Tenés un minuto?</li>
          <li><span class="en" data-say>Do you know who owns this?</span> — ¿Sabés de quién es esto?</li>
        </ul>

        <p><b>Y la trampa a vigilar.</b> Convertí estas a pregunta en voz alta, cuidando que el verbo
        principal quede <b>sin -s</b>:</p>
        <ol>
          <li>She knows the answer. → <i>Does she know the answer?</i></li>
          <li>He works on the backend. → <i>Does he work on the backend?</i></li>
          <li>It needs a token. → <i>Does it need a token?</i></li>
        </ol>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: ['Does he works here?', 'Do he works here?', 'Does he work here?', 'Do he work here?'],
          correcta: 2,
          porQue: '<b>does</b> lleva la marca de tercera persona, y por eso <i>work</i> queda en su forma base. La -s va una sola vez.',
          porQueNo: {
            0: 'La -s está duplicada: una en <i>does</i> y otra en <i>works</i>.',
            1: 'Doble error: <i>do</i> no concuerda con <i>he</i>, y <i>works</i> no debería llevar -s.',
            3: '<i>he</i> pide <i>does</i>, no <i>do</i>.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá con <b>don\'t</b> o <b>doesn\'t</b>: <b>She ______ work on weekends.</b>',
          respuesta: "doesn't",
          respuestas: ['does not'],
          porQue: '<b>she</b> pide <i>doesn\'t</i>. Y fijate que <i>work</i> queda sin -s.',
        },
        {
          tipo: 'hueco',
          p: 'Completá: <b>______ you have a minute?</b>',
          respuesta: 'Do',
          respuestas: ['do'],
          porQue: '<b>you</b> pide <i>do</i>. Es una de las preguntas más usadas del día a día laboral.',
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>¿Cómo funciona?</b>',
          respuesta: 'How does it work?',
          respuestas: ['How does it work'],
          pista: 'El sujeto es «eso»: it.',
          porQue: '<b>How does it work?</b> — <i>does</i> lleva la marca y <i>work</i> queda en base. Es de las preguntas técnicas más frecuentes.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá la negación: «Ella no trabaja los viernes.»',
          respuesta: "She doesn't work on Fridays",
          porQue: 'Con <b>doesn\'t</b>, el verbo va sin -s. Y los días de la semana llevan <i>on</i>.',
        },
      ],

      errores: [
        { mito: 'Si <i>Are you tired?</i> funciona sin nada, entonces <i>Work you here?</i> también.',
          realidad: 'No. Solo los <b>auxiliares</b> se pueden mover. <i>be</i>, <i>can</i>, <i>have</i> son auxiliares; ' +
                    '<i>work</i> no. Cuando no hay ninguno, el inglés <b>inserta <i>do</i></b> para que haya. ' +
                    'Es el error más visible al pasar del módulo 1 a este.' },
        { mito: 'Con <i>does</i>, el verbo principal también lleva -s.',
          realidad: '❌ <i>Does he works?</i> La marca de tercera persona va <b>una sola vez</b>, y le toca al primer ' +
                    'elemento del grupo verbal. Si hay <i>does</i>, el verbo vuelve a su forma base. Mismo principio ' +
                    'que <i>Did you work?</i> en pasado.' },
        { mito: '<i>What do you do?</i> tiene un <i>do</i> de más.',
          realidad: 'No: el primero es el <b>auxiliar</b> de la pregunta y el segundo es el <b>verbo</b> «hacer». ' +
                    'La frase significa «¿a qué te dedicás?». Es correcta y muy frecuente.' },
      ],

      glosario: [
        { t: 'Do-support', d: 'Insertar <i>do</i> cuando la frase no tiene auxiliar propio, para poder negar o preguntar. Es casi exclusivo del inglés.' },
        { t: 'Auxiliar', d: 'Verbo que puede moverse para formar preguntas y recibir la negación: be, do, have, can, will.' },
        { t: 'Forma base', d: 'El verbo sin ninguna terminación: <i>work</i>, <i>go</i>, <i>have</i>. Es lo que queda cuando el auxiliar carga con la marca.' },
        { t: 'Do enfático', d: '<i>I do understand</i> = «sí que entiendo». Se usa para responder a una suposición del otro.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l3',
      titulo: 'Con qué frecuencia',
      minutos: 8,

      simple: `
        <p>Para hablar de rutinas hace falta decir <b>cada cuánto</b>. Y ahí hay una regla de posición
        que en español no existe.</p>

        <h4>Los adverbios de frecuencia</h4>
        <table>
          <tr><th>Palabra</th><th>Más o menos</th></tr>
          <tr><td><span class="en" data-say>always</span></td><td>siempre · 100%</td></tr>
          <tr><td><span class="en" data-say>usually</span></td><td>normalmente · 80%</td></tr>
          <tr><td><span class="en" data-say>often</span></td><td>seguido · 60%</td></tr>
          <tr><td><span class="en" data-say>sometimes</span></td><td>a veces · 40%</td></tr>
          <tr><td><span class="en" data-say>rarely</span></td><td>rara vez · 10%</td></tr>
          <tr><td><span class="en" data-say>never</span></td><td>nunca · 0%</td></tr>
        </table>

        <h4>Dónde se ponen</h4>
        <div class="analogia">
          <b>Antes del verbo normal:</b><br>
          <span class="en" data-say>I always check the logs</span><br>
          <span class="en" data-say>She never works on weekends</span><br><br>
          <b>Pero DESPUÉS de to be:</b><br>
          <span class="en" data-say>He is always late</span><br>
          <span class="en" data-say>They are never ready</span>
        </div>
        <p>Es la única regla de posición que hay que recordar, y aplica a todos por igual.</p>

        <div class="aviso">
          <b>Cuidado con <i>never</i>.</b> Ya es negativo por sí solo: no se combina con <i>don't</i>.<br>
          ❌ <i>I don't never work on Sundays</i><br>
          ✅ <span class="en" data-say>I never work on Sundays</span><br><br>
          En español la doble negación es normal («no trabajo nunca»). En inglés estándar, no.
        </div>

        <h4>Expresiones de frecuencia</h4>
        <p>Estas van al <b>final</b> de la frase, no antes del verbo:</p>
        <ul>
          <li><span class="en" data-say>every day</span> — todos los días</li>
          <li><span class="en" data-say>once a week</span> — una vez por semana</li>
          <li><span class="en" data-say>twice a month</span> — dos veces por mes</li>
          <li><span class="en" data-say>three times a year</span> — tres veces por año</li>
          <li><span class="en" data-say>on Mondays</span> — los lunes</li>
        </ul>
        <p><span class="en" data-say>We have a standup every morning</span> — no antes del verbo,
        al final.</p>

        <h4>Una rutina completa</h4>
        <p><span class="en" data-say>I usually start at nine. I check my messages first, then I work on my tasks. We have a standup every morning at ten. I rarely work after seven.</span></p>
      `,

      tecnico: `
        <p>La regla de posición se explica mejor así: <b>el adverbio de frecuencia va inmediatamente
        antes del verbo léxico, pero después del primer auxiliar</b>.</p>

        <table>
          <tr><th>Estructura</th><th>Ejemplo</th></tr>
          <tr><td>adverbio + verbo léxico</td><td>I <b>always</b> check the logs</td></tr>
          <tr><td>to be + adverbio</td><td>He is <b>always</b> late</td></tr>
          <tr><td>auxiliar + adverbio + verbo</td><td>I have <b>never</b> seen that error</td></tr>
          <tr><td>auxiliar + adverbio + verbo</td><td>You can <b>always</b> ask me</td></tr>
        </table>

        <div class="nota-tec">
          <b>Por qué <i>to be</i> parece la excepción y no lo es.</b> <i>To be</i> funciona como su propio
          auxiliar: es el primer (y único) elemento del grupo verbal. Por eso el adverbio va detrás,
          exactamente como iría detrás de <i>have</i> o de <i>can</i>. Vista así, hay una sola regla,
          no dos.
        </div>

        <p><b>Sobre la doble negación.</b> El español tiene <b>concordancia negativa</b>: «no trabajo
        nunca» y «no vi a nadie» requieren las dos marcas. El inglés estándar tiene <b>una sola marca</b>
        por cláusula. Por eso:</p>
        <ul>
          <li>❌ <i>I don't know nothing</i> → ✅ <i>I don't know anything</i> o <i>I know nothing</i></li>
          <li>❌ <i>I didn't see nobody</i> → ✅ <i>I didn't see anybody</i></li>
        </ul>
        <p>La doble negación existe en variedades no estándar del inglés (y en muchas letras de canciones),
        donde funciona como refuerzo. En un contexto profesional se lee como error.</p>

        <p><b>Sobre <i>sometimes</i>.</b> Es el más flexible: puede ir al principio, en el medio o al final.
        <i>Sometimes I work late</i>, <i>I sometimes work late</i>, <i>I work late sometimes</i>. Los otros
        adverbios de la lista no tienen esa libertad.</p>

        <p><b>Los días de la semana.</b> <i>on Monday</i> es un lunes concreto; <i>on Mondays</i> (con -s)
        es una rutina, todos los lunes. La diferencia es la misma que entre «el lunes» y «los lunes».</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Escala de adverbios de frecuencia y su posición en la frase">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Cada cuánto, y dónde va la palabra</text>

          <line x1="70" y1="52" x2="610" y2="52" stroke="currentColor" opacity="0.25" stroke-width="2"/>
          <g font-size="12" text-anchor="middle">
            <circle cx="70"  cy="52" r="6" fill="#34d399"/>
            <text x="70" y="42" font-weight="700" fill="#34d399">always</text>
            <text x="70" y="76" fill="currentColor" opacity="0.55">100%</text>

            <circle cx="178" cy="52" r="5" fill="#34d399" opacity="0.75"/>
            <text x="178" y="42" fill="currentColor" opacity="0.85">usually</text>
            <text x="178" y="76" fill="currentColor" opacity="0.55">80%</text>

            <circle cx="286" cy="52" r="5" fill="#fbbf24" opacity="0.8"/>
            <text x="286" y="42" fill="currentColor" opacity="0.85">often</text>
            <text x="286" y="76" fill="currentColor" opacity="0.55">60%</text>

            <circle cx="394" cy="52" r="5" fill="#fbbf24" opacity="0.8"/>
            <text x="394" y="42" fill="currentColor" opacity="0.85">sometimes</text>
            <text x="394" y="76" fill="currentColor" opacity="0.55">40%</text>

            <circle cx="502" cy="52" r="5" fill="#f87171" opacity="0.75"/>
            <text x="502" y="42" fill="currentColor" opacity="0.85">rarely</text>
            <text x="502" y="76" fill="currentColor" opacity="0.55">10%</text>

            <circle cx="610" cy="52" r="6" fill="#f87171"/>
            <text x="610" y="42" font-weight="700" fill="#f87171">never</text>
            <text x="610" y="76" fill="currentColor" opacity="0.55">0%</text>
          </g>

          <line x1="34" y1="100" x2="646" y2="100" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="124" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">¿Antes o después?</text>

          <g font-size="13">
            <rect x="60" y="138" width="270" height="34" rx="7" fill="#34d399" opacity="0.12" stroke="#34d399" stroke-width="1.2"/>
            <text x="76" y="160" fill="currentColor">I <tspan fill="#34d399" font-weight="800">always</tspan> check the logs</text>
            <text x="76" y="188" font-size="11.5" fill="currentColor" opacity="0.6">ANTES del verbo normal</text>

            <rect x="360" y="138" width="270" height="34" rx="7" fill="#22d3ee" opacity="0.12" stroke="#22d3ee" stroke-width="1.2"/>
            <text x="376" y="160" fill="currentColor">He is <tspan fill="#22d3ee" font-weight="800">always</tspan> late</text>
            <text x="376" y="188" font-size="11.5" fill="currentColor" opacity="0.6">DESPUÉS de to be</text>
          </g>

          <rect x="60" y="206" width="570" height="26" rx="7" fill="currentColor" opacity="0.06"/>
          <text x="345" y="224" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.8">
            every day · once a week · on Mondays → van al FINAL
          </text>

          <rect x="60" y="240" width="570" height="30" rx="7" fill="#f87171" opacity="0.1" stroke="#f87171" stroke-width="1.2"/>
          <text x="345" y="260" text-anchor="middle" font-size="12" font-weight="600" fill="#f87171">
            ✗ I don't never work — never ya es negativo, no se duplica
          </text>
        </svg>`,
        pie: 'La escala de frecuencia arriba; abajo, la única regla de posición que hay que recordar.',
      },

      escucha: {
        intro: '<p>Rutinas de trabajo. Fijate dónde cae el adverbio en cada frase.</p>',
        items: [
          { texto: 'I usually start at nine.', es: 'Normalmente empiezo a las nueve.',
            nota: '<b>usually</b> antes del verbo. Es la posición por defecto.' },
          { texto: 'He is always in a meeting.', es: 'Él siempre está en una reunión.',
            nota: 'Acá va <b>después</b>, porque el verbo es <i>is</i>. Única excepción de posición.' },
          { texto: 'We have a standup every morning.', es: 'Tenemos un standup todas las mañanas.',
            nota: '<b>every morning</b> es una expresión, no un adverbio suelto: va al final.' },
          { texto: 'I never work on Sundays.', es: 'Nunca trabajo los domingos.',
            nota: 'Sin <i>don\'t</i>: <b>never</b> ya niega por sí solo.' },
          { texto: 'She rarely joins the call.', es: 'Ella rara vez se suma a la call.',
            nota: '<b>joins</b> con la -s de tercera persona, que el adverbio no cancela.' },
        ],
      },

      practica: `
        <p><b>Escribí tu rutina de trabajo real</b>, cinco frases, usando un adverbio distinto en cada una:</p>
        <ol>
          <li>I usually ______ at ______.</li>
          <li>I always ______ before ______.</li>
          <li>We have ______ every ______.</li>
          <li>I sometimes ______.</li>
          <li>I never ______.</li>
        </ol>

        <p>Después decilas en voz alta. Estas cinco frases son literalmente lo que vas a contestar cuando
        alguien te pregunte cómo es tu día — en una entrevista, en un onboarding, o charlando con
        alguien del equipo.</p>

        <p><b>Y vigilá dos cosas al releerlas:</b> que el adverbio esté antes del verbo (o después de
        <i>is</i>/<i>are</i>), y que no hayas puesto <i>don't</i> junto con <i>never</i>.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: ['I check always the logs.', 'I always check the logs.', 'Always I check the logs.', 'I check the logs always.'],
          correcta: 1,
          porQue: 'El adverbio de frecuencia va <b>antes del verbo léxico</b>. Es la posición por defecto.',
          porQueNo: {
            0: 'No puede ir entre el verbo y su objeto.',
            2: 'Suena forzado en inglés neutro. Solo <i>sometimes</i> tiene esa libertad.',
            3: 'Al final funciona con <i>sometimes</i>, pero no con <i>always</i>.',
          },
        },
        {
          tipo: 'opcion',
          p: '¿Y cuál está bien acá?',
          opciones: ['He always is late.', 'He is always late.', 'Always he is late.', 'He is late always.'],
          correcta: 1,
          porQue: 'Con <b>to be</b> el adverbio va <b>después</b>. Es la única excepción de posición, y es porque <i>is</i> funciona como su propio auxiliar.',
          porQueNo: {
            0: 'Con <i>to be</i> se invierte respecto de los verbos normales.',
            2: 'Posición forzada, no se usa.',
            3: 'No es la posición natural para <i>always</i>.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá sin usar <i>don\'t</i>: <b>I ______ work on Sundays.</b> (nunca)',
          respuesta: 'never',
          porQue: '<b>never</b> ya es negativo. Agregarle <i>don\'t</i> sería doble negación, que el español permite y el inglés estándar no.',
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Tenemos un standup todas las mañanas.</b>',
          respuesta: 'We have a standup every morning',
          porQue: '<b>every morning</b> es una expresión de frecuencia: va al final, no antes del verbo.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «Ella rara vez trabaja los fines de semana.»',
          respuesta: 'She rarely works on weekends',
          porQue: '<b>rarely</b> antes del verbo, y <b>works</b> conserva su -s: el adverbio no la cancela.',
        },
      ],

      errores: [
        { mito: 'Puedo decir <i>I don\'t never work on Sundays</i>, como en español.',
          realidad: 'El español tiene <b>concordancia negativa</b> («no trabajo nunca»); el inglés estándar admite ' +
                    '<b>una sola marca</b> por cláusula. Va <i>I never work</i> o <i>I don\'t work</i>. ' +
                    'La doble negación existe en inglés no estándar, pero en el trabajo se lee como error.' },
        { mito: 'Los adverbios de frecuencia se pueden poner donde queden bien, como en español.',
          realidad: 'La posición está bastante fijada: <b>antes del verbo léxico, después de <i>to be</i> y ' +
                    'después del primer auxiliar</b>. El único flexible es <i>sometimes</i>. ' +
                    'Ponerlos mal no impide entender, pero suena claramente a traducción.' },
        { mito: '<i>on Monday</i> y <i>on Mondays</i> son lo mismo.',
          realidad: '<i>on Monday</i> es <b>un lunes concreto</b>; <i>on Mondays</i> es <b>todos los lunes</b>, una rutina. ' +
                    'Igual que «el lunes» y «los lunes» en español. La <i>-s</i> es la que hace la diferencia.' },
      ],

      glosario: [
        { t: 'Adverbio de frecuencia', d: 'always, usually, often, sometimes, rarely, never. Van antes del verbo, o después de <i>to be</i>.' },
        { t: 'Concordancia negativa', d: 'Repetir la marca de negación («no… nunca»). Normal en español, no estándar en inglés.' },
        { t: 'Once / twice', d: 'Una vez / dos veces. De tres en adelante se usa <i>times</i>: <i>three times a week</i>.' },
        { t: 'On Mondays', d: 'Los lunes, como rutina. Sin la -s (<i>on Monday</i>) sería un lunes puntual.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l4',
      titulo: 'Explicar cómo funciona algo',
      minutos: 9,

      simple: `
        <p>Este es el uso del present simple que más te va a servir profesionalmente: <b>describir
        cómo funciona un sistema</b>. Toda la documentación técnica del mundo está escrita así.</p>

        <h4>El patrón</h4>
        <p>Sujeto + verbo en present simple. Sin adornos:</p>
        <ul>
          <li><span class="en" data-say>The API returns a JSON object.</span></li>
          <li><span class="en" data-say>This function takes two arguments.</span></li>
          <li><span class="en" data-say>The middleware runs before every request.</span></li>
          <li><span class="en" data-say>The job runs every night at two.</span></li>
          <li><span class="en" data-say>If the token expires, the client refreshes it.</span></li>
        </ul>

        <p><b>Fijate en la -s en todos.</b> <i>The API</i>, <i>this function</i>, <i>the middleware</i>,
        <i>the job</i>, <i>the client</i> — todos son <b>it</b>. Es donde más se escapa.</p>

        <h4>Los verbos que más vas a usar</h4>
        <table>
          <tr><th>Verbo</th><th>Para qué</th><th>Ejemplo</th></tr>
          <tr><td>returns</td><td>devuelve</td><td>It returns null.</td></tr>
          <tr><td>takes</td><td>recibe / tarda</td><td>It takes an ID.</td></tr>
          <tr><td>calls</td><td>llama a</td><td>It calls the API.</td></tr>
          <tr><td>handles</td><td>se encarga de</td><td>It handles the errors.</td></tr>
          <tr><td>fails</td><td>falla</td><td>The build fails.</td></tr>
          <tr><td>runs</td><td>se ejecuta / corre</td><td>It runs on the server.</td></tr>
          <tr><td>depends on</td><td>depende de</td><td>It depends on the config.</td></tr>
        </table>

        <h4>Preguntar sobre cómo funciona algo</h4>
        <ul>
          <li><span class="en" data-say>How does it work?</span></li>
          <li><span class="en" data-say>What does this function do?</span></li>
          <li><span class="en" data-say>Where does the config come from?</span></li>
          <li><span class="en" data-say>Why does it fail?</span></li>
          <li><span class="en" data-say>Does it need a token?</span></li>
        </ul>

        <div class="analogia">
          <b>Un ejemplo real de PR.</b><br>
          <span class="en" data-say>This PR fixes the login bug. The token expires after one hour, but the client does not refresh it. Now the client checks the expiration and refreshes the token automatically.</span>
        </div>
        <p>Todo present simple. Ni un solo tiempo raro. Eso es escribir un PR en inglés.</p>
      `,

      tecnico: `
        <p><b>Por qué el present simple y no otro tiempo.</b> Describir el comportamiento de un sistema
        es una afirmación <b>atemporal</b>: no pasó ayer ni va a pasar mañana, es cierto siempre que se
        cumplan las condiciones. Ese es exactamente el valor del present simple.</p>

        <p>Usar otro tiempo cambia el sentido de forma no deseada:</p>
        <table>
          <tr><th>Frase</th><th>Qué comunica</th></tr>
          <tr><td><i>The API returns JSON</i></td><td>así es siempre — <b>documentación</b></td></tr>
          <tr><td><i>The API is returning JSON</i></td><td>ahora mismo, quizá temporal — <b>debugging</b></td></tr>
          <tr><td><i>The API returned JSON</i></td><td>pasó una vez — <b>reporte de un caso</b></td></tr>
        </table>
        <p>Los tres son útiles, pero para cosas distintas. En un README va el primero.</p>

        <div class="nota-tec">
          <b>Condicionales tipo cero.</b> Para describir comportamiento determinista se usa
          <i>if</i> + present simple + present simple:
          <br><br>
          <i>If the token expires, the client refreshes it.</i>
          <br><i>If the build fails, the deploy stops.</i>
          <br><br>
          Ojo: <b>no va <i>will</i></b> después de <i>if</i> cuando se describe una regla general. Poner
          <i>If the token will expire</i> es un error típico y bastante visible.
        </div>

        <p><b>Registro de un PR o un issue.</b> Tres convenciones que valen la pena conocer:</p>
        <ul>
          <li><b>El título del commit va en imperativo</b>, no en present simple:
          <i>Fix login bug</i>, no <i>Fixes login bug</i> ni <i>Fixed login bug</i>.
          Es la convención de Git desde siempre.</li>
          <li><b>La descripción va en present simple:</b> <i>This PR fixes…</i>, <i>The client checks…</i></li>
          <li><b>Se usa mucho la voz pasiva</b> para no señalar a nadie: <i>The token is refreshed
          automatically</i>. Es una forma de despersonalizar que en inglés técnico se valora.</li>
        </ul>

        <p>Escribir bien un PR en inglés es de las habilidades con mejor retorno que hay: es lo que más
        gente del equipo va a leer de vos, y es asincrónico — tenés todo el tiempo del mundo para
        revisarlo.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="El mismo hecho en tres tiempos verbales y qué comunica cada uno">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">El mismo hecho, tres mensajes distintos</text>

          <g>
            <rect x="34" y="40" width="612" height="52" rx="9" fill="#34d399" opacity="0.12" stroke="#34d399" stroke-width="1.4"/>
            <text x="52" y="64" font-size="13.5" font-weight="700" fill="currentColor">The API return<tspan fill="#34d399" font-weight="800">s</tspan> JSON</text>
            <text x="52" y="82" font-size="12" fill="currentColor" opacity="0.75">así es siempre → va en el README, en la documentación, en el PR</text>
            <text x="620" y="70" text-anchor="end" font-size="11.5" font-weight="700" fill="#34d399">PRESENT SIMPLE</text>
          </g>

          <g>
            <rect x="34" y="102" width="612" height="52" rx="9" fill="#22d3ee" opacity="0.1" stroke="#22d3ee" stroke-width="1.2"/>
            <text x="52" y="126" font-size="13.5" fill="currentColor" opacity="0.9">The API <tspan fill="#22d3ee" font-weight="700">is returning</tspan> JSON</text>
            <text x="52" y="144" font-size="12" fill="currentColor" opacity="0.7">ahora mismo, quizá temporal → estás debugueando algo</text>
            <text x="620" y="132" text-anchor="end" font-size="11.5" fill="#22d3ee">continuous · m06</text>
          </g>

          <g>
            <rect x="34" y="164" width="612" height="52" rx="9" fill="#c084fc" opacity="0.1" stroke="#c084fc" stroke-width="1.2"/>
            <text x="52" y="188" font-size="13.5" fill="currentColor" opacity="0.9">The API <tspan fill="#c084fc" font-weight="700">returned</tspan> JSON</text>
            <text x="52" y="206" font-size="12" fill="currentColor" opacity="0.7">pasó una vez → estás reportando un caso concreto</text>
            <text x="620" y="194" text-anchor="end" font-size="11.5" fill="#c084fc">pasado · m07</text>
          </g>

          <rect x="34" y="230" width="612" height="52" rx="9" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" stroke-width="1.3"/>
          <text x="340" y="252" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f59e0b">Ojo con el sujeto: casi todo esto es "it"</text>
          <text x="340" y="271" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.8">
            the API · this function · the middleware · the build · the client → todos llevan -s
          </text>
        </svg>`,
        pie: 'Elegir el tiempo verbal no es un detalle de estilo: cambia qué le estás diciendo al que lee.',
      },

      escucha: {
        intro: '<p>Frases técnicas reales. Escuchá con atención la <b>-s</b> del verbo: en todas ' +
               'el sujeto es una cosa, o sea <i>it</i>.</p>',
        items: [
          { texto: 'The API returns a JSON object.', es: 'La API devuelve un objeto JSON.',
            nota: '<b>returns</b> con -s. <i>The API</i> = <i>it</i>.' },
          { texto: 'This function takes two arguments.', es: 'Esta función recibe dos argumentos.',
            nota: '<b>takes</b>. En español decimos «toma» o «recibe»; en inglés <i>takes</i> es lo estándar.' },
          { texto: 'If the token expires, the client refreshes it.', es: 'Si el token vence, el cliente lo renueva.',
            nota: 'Condicional tipo cero: present simple en las dos partes. <b>Sin <i>will</i></b> después de <i>if</i>.' },
          { texto: 'The job runs every night at two.', es: 'El job corre todas las noches a las dos.',
            nota: '<b>runs</b> + <b>every night</b> al final. Es la descripción típica de un cron.' },
          { texto: 'Why does the build fail on main?', es: '¿Por qué falla el build en main?',
            nota: 'Con <b>does</b>, el verbo <i>fail</i> queda sin -s. La marca va una sola vez.' },
        ],
      },

      practica: `
        <p><b>Escribí en inglés cómo funciona algo que hiciste vos.</b> Cinco frases, present simple,
        sin adornos. Sirve cualquier cosa: un endpoint, un script, un componente.</p>

        <div class="analogia">
          Plantilla:<br>
          1. This ______ handles ______.<br>
          2. It takes ______.<br>
          3. It calls ______.<br>
          4. If ______, it ______.<br>
          5. It returns ______.
        </div>

        <p>Cuando termines, releelo <b>solo buscando las -s</b>. Todos los sujetos van a ser <i>it</i>,
        así que todos los verbos las llevan.</p>

        <p><b>Un dato que vale oro:</b> escribir un buen PR en inglés es asincrónico. Tenés tiempo de
        pensar, buscar y revisar — no hay presión de conversación. Por eso es <b>la primera habilidad
        en inglés que conviene tener sólida</b>: te hace ver profesional aunque hablando todavía
        titubees.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Estás escribiendo la descripción de un PR. ¿Cuál va?',
          opciones: ['This PR fix the login bug.', 'This PR fixes the login bug.', 'This PR fixing the login bug.', 'This PR is fix the login bug.'],
          correcta: 1,
          porQue: '<b>This PR</b> = <i>it</i> → <b>fixes</b>. La descripción de un PR va en present simple.',
          porQueNo: {
            0: 'Le falta la -s. Es el error más visible en un PR escrito por un hispanohablante.',
            2: 'Le falta el verbo <i>is</i>, y además el continuous no es el tiempo para esto.',
            3: 'No se combinan <i>is</i> y la forma base.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá con <b>expire</b>: <b>If the token ______, the client refreshes it.</b>',
          respuesta: 'expires',
          porQue: 'Condicional tipo cero: present simple en las dos partes, y <b>the token</b> es <i>it</i>, así que lleva -s.',
        },
        {
          tipo: 'opcion',
          p: '¿Cuál es correcta para describir una regla general?',
          opciones: ['If the build will fail, the deploy stops.', 'If the build fails, the deploy stops.', 'If the build fail, the deploy stop.', 'If the build is failing, the deploy will stopped.'],
          correcta: 1,
          porQue: 'Después de <i>if</i>, cuando describís una regla general, va <b>present simple</b> — nunca <i>will</i>.',
          porQueNo: {
            0: '<i>will</i> después de <i>if</i> es un error muy típico al describir reglas.',
            2: 'Faltan las dos -s: <i>fails</i> y <i>stops</i>.',
            3: 'Mezcla tiempos y además <i>will stopped</i> no existe.',
          },
        },
        {
          tipo: 'dictado',
          p: 'Escuchá y escribí. Es una frase de documentación.',
          respuesta: 'This function takes two arguments',
          porQue: '<b>takes</b> con -s porque <i>this function</i> es <i>it</i>. Y <i>arguments</i> en plural.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «El job corre todas las noches.»',
          respuesta: 'The job runs every night',
          porQue: '<b>runs</b> con -s, y <b>every night</b> al final. Es la forma estándar de describir un cron.',
        },
      ],

      errores: [
        { mito: 'Para describir cómo funciona algo puedo usar cualquier tiempo, se entiende igual.',
          realidad: 'Cambia el mensaje. <i>The API returns JSON</i> es documentación; <i>The API is returning JSON</i> ' +
                    'suena a que estás <b>debugueando algo raro ahora mismo</b>; <i>returned</i> es un caso puntual del pasado. ' +
                    'En un README, el único que corresponde es el present simple.' },
        { mito: 'Después de <i>if</i> va <i>will</i>, porque habla del futuro.',
          realidad: '❌ <i>If the token will expire…</i> Cuando describís una <b>regla general</b>, va present simple en ' +
                    'las dos partes: <i>If the token expires, the client refreshes it</i>. ' +
                    'Es uno de los errores más frecuentes en documentación escrita por hispanohablantes.' },
        { mito: 'El título del commit va en present simple, como la descripción.',
          realidad: 'El <b>título</b> va en <b>imperativo</b>: <i>Fix login bug</i>. Ni <i>Fixes</i> ni <i>Fixed</i>. ' +
                    'Es la convención de Git. La <b>descripción</b> sí va en present simple. Son dos registros distintos ' +
                    'en el mismo commit.' },
      ],

      glosario: [
        { t: 'Condicional tipo cero', d: '<i>if</i> + present simple + present simple. Describe comportamiento determinista: <i>If the token expires, the client refreshes it</i>.' },
        { t: 'Returns / takes', d: 'Los dos verbos más usados de la documentación técnica: «devuelve» y «recibe» (o «tarda»).' },
        { t: 'Depends on', d: 'Depende de. Siempre con <i>on</i>, nunca con <i>of</i>. Es un error muy común.' },
        { t: 'Imperativo del commit', d: '<i>Fix login bug</i>, no <i>Fixes</i> ni <i>Fixed</i>. La convención de Git para el título del commit.' },
      ],
    },
  ],

  /* ==================================================================== */
  vocabulario: [
    { en: 'work', es: 'trabajar', pista: 'he works, con -s.', ejemplo: 'She works from home.', ejemploEs: 'Ella trabaja desde casa.' },
    { en: 'start', es: 'empezar', ejemplo: 'I start at nine.', ejemploEs: 'Empiezo a las nueve.' },
    { en: 'finish', es: 'terminar', pista: 'he finishes, con -es.', ejemplo: 'My manager finishes at six.', ejemploEs: 'Mi jefe termina a las seis.' },
    { en: 'need', es: 'necesitar', ejemplo: 'It needs a token.', ejemploEs: 'Necesita un token.' },
    { en: 'know', es: 'saber / conocer', ejemplo: 'Do you know the answer?', ejemploEs: '¿Sabés la respuesta?' },
    { en: 'think', es: 'pensar / opinar', ejemplo: 'What do you think?', ejemploEs: '¿Qué opinás?' },
    { en: 'return', es: 'devolver', ejemplo: 'The API returns a JSON object.', ejemploEs: 'La API devuelve un objeto JSON.' },
    { en: 'take', es: 'recibir / tardar', ejemplo: 'The build takes ten minutes.', ejemploEs: 'El build tarda diez minutos.' },
    { en: 'call', es: 'llamar a', ejemplo: 'It calls the API.', ejemploEs: 'Llama a la API.' },
    { en: 'handle', es: 'encargarse de', ejemplo: 'This function handles the errors.', ejemploEs: 'Esta función se encarga de los errores.' },
    { en: 'fail', es: 'fallar', ejemplo: 'Why does the build fail?', ejemploEs: '¿Por qué falla el build?' },
    { en: 'run', es: 'ejecutarse / correr', ejemplo: 'The job runs every night.', ejemploEs: 'El job corre todas las noches.' },
    { en: 'depend on', es: 'depender de', pista: 'Siempre "on", nunca "of".', ejemplo: 'It depends on the config.', ejemploEs: 'Depende de la configuración.' },
    { en: 'always', es: 'siempre', ejemplo: 'I always check the logs.', ejemploEs: 'Siempre reviso los logs.' },
    { en: 'usually', es: 'normalmente', ejemplo: 'I usually start at nine.', ejemploEs: 'Normalmente empiezo a las nueve.' },
    { en: 'sometimes', es: 'a veces', pista: 'El más flexible de posición.', ejemplo: 'Sometimes I work late.', ejemploEs: 'A veces trabajo hasta tarde.' },
    { en: 'never', es: 'nunca', pista: 'Ya es negativo: no lleva don\'t.', ejemplo: 'I never work on Sundays.', ejemploEs: 'Nunca trabajo los domingos.' },
    { en: 'rarely', es: 'rara vez', ejemplo: 'She rarely joins the call.', ejemploEs: 'Ella rara vez se suma a la call.' },
    { en: 'every day', es: 'todos los días', pista: 'Va al final de la frase.', ejemplo: 'We have a standup every day.', ejemploEs: 'Tenemos un standup todos los días.' },
    { en: 'once a week', es: 'una vez por semana', ejemplo: 'We deploy once a week.', ejemploEs: 'Desplegamos una vez por semana.' },
    { en: 'weekend', es: 'fin de semana', ejemplo: 'She does not work on weekends.', ejemploEs: 'Ella no trabaja los fines de semana.' },
    { en: 'remotely', es: 'de manera remota', ejemplo: 'Do you work remotely?', ejemploEs: '¿Trabajás remoto?' },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál está bien?',
      opciones: ['She work from home.', 'She works from home.', 'She working from home.', 'She is work from home.'],
      correcta: 1,
      porQue: '<b>she</b> es tercera persona del singular → el verbo lleva <b>-s</b>.',
      porQueNo: {
        0: 'Le falta la -s. Es el error número uno del hispanohablante en inglés.',
        2: 'Le falta el auxiliar <i>is</i>; y el continuous significaría otra cosa.',
        3: 'No se combinan <i>is</i> y la forma base del verbo.',
      },
    },
    {
      p: '¿Por qué la -s de tercera persona es tan difícil de automatizar?',
      opciones: [
        'Porque tiene muchas excepciones',
        'Porque no aporta información: la persona ya está en el pronombre obligatorio, así que es una marca redundante',
        'Porque cambia según la región',
        'Porque solo se usa en inglés escrito',
      ],
      correcta: 1,
      porQue: 'Las marcas redundantes son las últimas en automatizarse: se entienden al instante y se producen mal durante años, porque omitirlas no impide comunicarse.',
      porQueNo: {
        0: 'Tiene una sola excepción real (<i>have → has</i>) y unas pocas variantes de escritura.',
        2: 'Es igual en todas las variedades estándar del inglés.',
        3: 'Se usa en escrito y en hablado por igual.',
      },
    },
    {
      p: '¿Cuál de estos sujetos NO lleva -s en el verbo?',
      opciones: ['The build', 'This function', 'They', 'My manager'],
      correcta: 2,
      porQue: '<b>they</b> es plural. Los otros tres son <i>it</i> o <i>he/she</i>, y todos llevan -s.',
      porQueNo: {
        0: '<i>The build</i> es una cosa = <i>it</i> → <i>the build takes</i>.',
        1: '<i>This function</i> también es <i>it</i> → <i>returns</i>.',
        3: '<i>My manager</i> es <i>he</i> o <i>she</i> → <i>finishes</i>.',
      },
    },
    {
      p: '¿Cuál es la forma correcta de preguntar?',
      opciones: ['Works he here?', 'Does he works here?', 'Does he work here?', 'Do he work here?'],
      correcta: 2,
      porQue: 'Se inserta <b>does</b> (porque <i>work</i> no es auxiliar), y entonces el verbo vuelve a su forma base.',
      porQueNo: {
        0: 'Los verbos léxicos no se pueden invertir. Solo los auxiliares.',
        1: 'La -s está duplicada: ya la lleva <i>does</i>.',
        3: '<i>he</i> pide <i>does</i>, no <i>do</i>.',
      },
    },
    {
      p: '¿Por qué el verbo pierde la -s cuando aparece <i>does</i>?',
      opciones: [
        'Porque does es un verbo irregular',
        'Porque la marca de persona va una sola vez, en el primer elemento del grupo verbal',
        'Porque en preguntas nunca se usa la -s',
        'Es una excepción sin explicación',
      ],
      correcta: 1,
      porQue: 'Es el mismo principio que en pasado: <i>Did you work?</i> — el auxiliar carga la marca y el verbo léxico queda en base.',
      porQueNo: {
        0: 'Que <i>do</i> sea irregular no tiene nada que ver con esto.',
        2: 'En preguntas sin auxiliar insertado sí puede aparecer: <i>Who works here?</i>',
        3: 'Sí tiene explicación, y sirve para no memorizar dos reglas separadas.',
      },
    },
    {
      p: '¿Dónde va el adverbio de frecuencia?',
      opciones: [
        'Siempre al final de la frase',
        'Antes del verbo normal, pero después de to be',
        'Siempre al principio',
        'Siempre justo después del verbo',
      ],
      correcta: 1,
      porQue: '<i>I always check the logs</i> pero <i>He is always late</i>. La razón es que <i>to be</i> funciona como su propio auxiliar.',
      porQueNo: {
        0: 'Al final van las <b>expresiones</b> (<i>every day</i>, <i>once a week</i>), no los adverbios sueltos.',
        2: 'Solo <i>sometimes</i> admite esa posición con naturalidad.',
        3: 'No puede ir entre el verbo y su objeto: ❌ <i>I check always the logs</i>.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: ["I don't never work on Sundays.", 'I never work on Sundays.', "I don't work never on Sundays.", 'I not never work on Sundays.'],
      correcta: 1,
      porQue: '<b>never</b> ya es negativo. El inglés estándar admite una sola marca de negación por cláusula.',
      porQueNo: {
        0: 'Doble negación: normal en español, no estándar en inglés.',
        2: 'Además de duplicar la negación, <i>never</i> está mal ubicado.',
        3: '<i>not</i> no puede ir suelto sin auxiliar.',
      },
    },
    {
      p: 'Estás documentando una API. ¿Qué tiempo verbal corresponde?',
      opciones: [
        'Present continuous: The API is returning JSON',
        'Present simple: The API returns JSON',
        'Pasado: The API returned JSON',
        'Futuro: The API will return JSON',
      ],
      correcta: 1,
      porQue: 'El present simple expresa lo <b>atemporal</b>: así funciona siempre. Es el tiempo de toda la documentación técnica.',
      porQueNo: {
        0: 'Sugiere «ahora mismo, quizá temporal» — suena a que estás debugueando algo raro.',
        2: 'Comunica un caso puntual que ya pasó, no el comportamiento general.',
        3: 'Sugiere que todavía no lo hace, que va a cambiar.',
      },
    },
    {
      p: '¿Cuál está bien para describir una regla general?',
      opciones: [
        'If the token will expire, the client refreshes it.',
        'If the token expires, the client refreshes it.',
        'If the token expire, the client refresh it.',
        'If the token is expiring, the client will refreshed it.',
      ],
      correcta: 1,
      porQue: 'Condicional tipo cero: <b>present simple en las dos partes</b>. Nunca <i>will</i> después de <i>if</i> cuando describís una regla.',
      porQueNo: {
        0: '<i>will</i> después de <i>if</i> es de los errores más frecuentes en documentación.',
        2: 'Faltan las dos -s de tercera persona.',
        3: 'Mezcla tiempos y <i>will refreshed</i> directamente no existe.',
      },
    },
    {
      p: '¿Cómo se escribe el título de un commit en inglés?',
      opciones: ['Fixes login bug', 'Fixed login bug', 'Fix login bug', 'Fixing login bug'],
      correcta: 2,
      porQue: 'El título del commit va en <b>imperativo</b>: <i>Fix login bug</i>. Es la convención de Git. La descripción sí va en present simple.',
      porQueNo: {
        0: 'El present simple va en la <b>descripción</b>, no en el título.',
        1: 'El pasado se usa a veces, pero la convención establecida es el imperativo.',
        3: 'El gerundio no se usa para títulos de commit.',
      },
    },
    {
      p: '¿Qué significa <i>What do you do?</i>',
      opciones: ['¿Qué estás haciendo?', '¿A qué te dedicás?', '¿Qué hacemos?', '¿Qué querés hacer?'],
      correcta: 1,
      porQue: 'El primer <i>do</i> es el auxiliar y el segundo el verbo «hacer». Pregunta por la ocupación, no por el momento.',
      porQueNo: {
        0: 'Eso sería <i>What are you doing?</i>, en present continuous.',
        2: 'Sería <i>What do we do?</i>',
        3: 'Sería <i>What do you want to do?</i>',
      },
    },
    {
      p: '¿Cuál es la diferencia entre <i>on Monday</i> y <i>on Mondays</i>?',
      opciones: [
        'Ninguna, son intercambiables',
        'La primera es un lunes concreto; la segunda es todos los lunes, una rutina',
        'La primera es británica y la segunda estadounidense',
        'La segunda está mal escrita',
      ],
      correcta: 1,
      porQue: 'La <b>-s</b> convierte el día puntual en rutina. Igual que «el lunes» contra «los lunes» en español.',
      porQueNo: {
        0: 'Dicen cosas distintas.',
        2: 'No es una diferencia regional.',
        3: 'Está bien escrita y es muy usada.',
      },
    },
  ],
});
