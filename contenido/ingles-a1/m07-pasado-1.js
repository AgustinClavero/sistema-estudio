/* ==========================================================================
   Inglés A1 · m07 — Pasado (1): was/were y verbos regulares
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ingles-a1',
  id: 'm07',
  titulo: 'Pasado (1): to be y verbos regulares',
  fuentes: ['cambridge-dic', 'bbc-learning-english', 'youglish'],

  intro:
    '<p>El pasado en inglés tiene una ventaja enorme sobre el español: <b>una sola forma para todo</b>. ' +
    'Donde el español tiene «trabajé», «trabajaba», «he trabajado» y «había trabajado», el inglés de ' +
    'este nivel tiene <b>worked</b>.</p>' +
    '<p>Y la conjugación no existe: <i>worked</i> es igual para <i>I</i>, <i>you</i>, <i>he</i> y todos ' +
    'los demás. Ni siquiera hay una -s de tercera persona que vigilar.</p>' +
    '<p>Lo único que hay que aprender es <b>cómo se arma</b> —la terminación <i>-ed</i>— y ' +
    '<b>cómo suena</b>, que tiene tres versiones y es donde se escapa la información.</p>',

  lecciones: [

    /* ==================================================================== */
    {
      id: 'l1',
      titulo: 'Was y were',
      minutos: 8,

      simple: `
        <p>El pasado de <i>to be</i> tiene solo dos formas, contra las tres del presente:</p>

        <table>
          <tr><th>Sujeto</th><th>Presente</th><th>Pasado</th></tr>
          <tr><td>I</td><td>am</td><td><b>was</b></td></tr>
          <tr><td>he / she / it</td><td>is</td><td><b>was</b></td></tr>
          <tr><td>you / we / they</td><td>are</td><td><b>were</b></td></tr>
        </table>

        <p><b>La regla corta:</b> singular → <i>was</i>. Plural y <i>you</i> → <i>were</i>.</p>

        <ul>
          <li><span class="en" data-say>I was at the office yesterday</span></li>
          <li><span class="en" data-say>She was in a meeting</span></li>
          <li><span class="en" data-say>We were waiting for you</span></li>
          <li><span class="en" data-say>The tests were failing</span></li>
        </ul>

        <h4>Negar y preguntar: igual que en presente</h4>
        <p>Como sigue siendo <i>to be</i>, no hace falta <i>do</i>:</p>
        <ul>
          <li><span class="en" data-say>I wasn't there</span></li>
          <li><span class="en" data-say>They weren't ready</span></li>
          <li><span class="en" data-say>Were you in the call?</span></li>
          <li><span class="en" data-say>Was it working before?</span></li>
        </ul>
        <p>Respuestas cortas: <span class="en" data-say>Yes, I was</span> /
        <span class="en" data-say>No, I wasn't</span>.</p>

        <div class="aviso">
          <b>La trampa al escuchar:</b> <i>was</i> átono se reduce a "wəz" y se pierde muy fácil.<br><br>
          <span class="en" data-say>It was working</span> — «estaba funcionando»<br>
          <span class="en" data-say>It's working</span> — «está funcionando»<br><br>
          Perderse el <i>was</i> te cambia el tiempo verbal de la frase entera. Es de las diferencias
          más importantes al reportar un problema.
        </div>

        <h4>Past continuous, de regalo</h4>
        <p>Con <i>was/were</i> + <i>-ing</i> ya tenés el <b>pasado continuo</b>, que es exactamente lo
        del módulo 6 pero en pasado:</p>
        <ul>
          <li><span class="en" data-say>I was working on it yesterday</span></li>
          <li><span class="en" data-say>The tests were failing this morning</span></li>
          <li><span class="en" data-say>What were you doing?</span></li>
        </ul>
        <p>Es la forma natural de contar la parte de «ayer» del standup.</p>
      `,

      tecnico: `
        <p><b>Was/were es lo único que conserva concordancia de número en pasado.</b> Todos los demás
        verbos ingleses tienen una sola forma de pasado, sin distinguir persona ni número. <i>To be</i>
        es la excepción, otra vez.</p>

        <table>
          <tr><th>Forma</th><th>Contracción negativa</th><th>Se dice</th></tr>
          <tr><td>was not</td><td>wasn't</td><td>/ˈwɒzənt/</td></tr>
          <tr><td>were not</td><td>weren't</td><td>/wɜːnt/</td></tr>
        </table>

        <div class="nota-tec">
          <b>La forma débil de <i>was</i>.</b> Como auxiliar átono se reduce a /wəz/ — schwa, casi
          inaudible. En <i>It was working</i> la palabra que lleva el golpe es <i>working</i>, no <i>was</i>.
          <br><br>
          Por eso confundir <i>It was working</i> con <i>It's working</i> es tan fácil, y por eso importa:
          uno reporta que el problema es nuevo, el otro que ya está resuelto.
          <br><br>
          <i>weren't</i> y <i>wasn't</i>, en cambio, son <b>tónicos</b> — la negación siempre lleva acento.
          Es la misma lógica de <i>can</i> / <i>can't</i> del módulo 5.
        </div>

        <p><b>El past continuous</b> (<i>was/were</i> + <i>-ing</i>) tiene dos usos que valen la pena:</p>
        <ul>
          <li><b>Acción en curso en un momento del pasado:</b>
          <i>At three I was still debugging.</i></li>
          <li><b>Fondo para otra acción:</b> <i>I was reviewing the PR when the build broke.</i>
          El continuous es el escenario, el simple es lo que irrumpe.</li>
        </ul>

        <p>Ese segundo patrón —<i>was doing X when Y happened</i>— es la forma canónica de contar
        un incidente, y aparece constantemente en reportes de bugs.</p>

        <p><b>Un uso que conviene conocer:</b> <i>was/were going to</i> expresa un plan que no se
        cumplió. <i>I was going to finish it yesterday, but the deploy broke.</i> Es una fórmula muy
        útil para explicar por qué algo no salió, sin sonar a excusa.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Was y were, y la trampa de confundir was working con is working">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Tres formas en presente, dos en pasado</text>

          <g font-size="13">
            <rect x="60" y="42" width="240" height="30" rx="7" fill="currentColor" opacity="0.06"/>
            <text x="80" y="62" fill="currentColor" opacity="0.75">I · he · she · it</text>
            <text x="270" y="62" text-anchor="end" font-weight="800" fill="#34d399">was</text>

            <rect x="60" y="78" width="240" height="30" rx="7" fill="currentColor" opacity="0.06"/>
            <text x="80" y="98" fill="currentColor" opacity="0.75">you · we · they</text>
            <text x="270" y="98" text-anchor="end" font-weight="800" fill="#22d3ee">were</text>
          </g>

          <text x="180" y="132" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.65">
            singular → was · plural y you → were
          </text>

          <rect x="336" y="42" width="304" height="66" rx="9" fill="#c084fc" opacity="0.1" stroke="#c084fc" stroke-width="1.3"/>
          <text x="488" y="64" text-anchor="middle" font-size="12.5" font-weight="700" fill="#c084fc">De regalo: past continuous</text>
          <text x="488" y="84" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">was / were + verbo -ing</text>
          <text x="488" y="100" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">I was working on it yesterday</text>

          <line x1="34" y1="150" x2="646" y2="150" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="174" text-anchor="middle" font-size="13" font-weight="700" fill="#f87171">La trampa que cambia el mensaje entero</text>

          <g>
            <rect x="60" y="188" width="264" height="58" rx="9" fill="#f87171" opacity="0.1" stroke="#f87171" stroke-width="1.2"/>
            <text x="192" y="210" text-anchor="middle" font-size="13.5" fill="currentColor">It <tspan font-weight="800" fill="#f87171">was</tspan> working</text>
            <text x="192" y="230" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.75">antes andaba · ahora no</text>

            <rect x="356" y="188" width="264" height="58" rx="9" fill="#34d399" opacity="0.1" stroke="#34d399" stroke-width="1.2"/>
            <text x="488" y="210" text-anchor="middle" font-size="13.5" fill="currentColor">It<tspan font-weight="800" fill="#34d399">'s</tspan> working</text>
            <text x="488" y="230" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.75">ahora anda · está resuelto</text>
          </g>

          <text x="340" y="264" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.65">
            "was" átono suena "wəz" y se pierde. Dos frases opuestas separadas por una sílaba floja.
          </text>
        </svg>`,
        pie: 'Was y were se aprenden en un minuto. Escucharlos es lo que lleva tiempo.',
      },

      escucha: {
        intro: '<p>Prestá atención a <b>was</b>: es átono y casi desaparece. Si te lo perdés, ' +
               'entendés presente donde había pasado.</p>',
        items: [
          { texto: 'I was at the office yesterday.', es: 'Ayer estuve en la oficina.',
            nota: '<b>was</b> comprimido a "wəz". El golpe cae en <i>office</i> y en <i>yesterday</i>.' },
          { texto: "It was working this morning.", es: 'Esta mañana estaba funcionando.',
            nota: 'Compará con <i>It\'s working</i>. Dicen cosas opuestas y se diferencian en una sílaba floja.' },
          { texto: "The tests weren't passing before the fix.", es: 'Los tests no pasaban antes del fix.',
            nota: '<b>weren\'t</b> sí lleva acento: la negación siempre es tónica. Se oye clarito.' },
          { texto: 'What were you working on yesterday?', es: '¿En qué estabas trabajando ayer?',
            nota: 'Past continuous. Es cómo se pregunta por la parte de «ayer» del standup.' },
        ],
      },

      practica: `
        <p><b>Contá tu día de ayer en cinco frases</b>, en voz alta:</p>
        <ol>
          <li>Yesterday I was ______.</li>
          <li>I was working on ______.</li>
          <li>The ______ was/were ______.</li>
          <li>I wasn't ______.</li>
          <li>I was going to ______, but ______.</li>
        </ol>

        <p>Esa última es oro: <b><i>I was going to…, but…</i></b> es la fórmula para explicar
        un plan que no se cumplió, sin que suene a excusa.
        <span class="en" data-say>I was going to finish it yesterday, but the deploy broke.</span></p>

        <p><b>Y entrená el par que importa</b>, alternando hasta oír la diferencia:</p>
        <p><span class="en" data-say>It was working</span> · <span class="en" data-say>It's working</span></p>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Completá: <b>I ______ in a meeting when you called.</b>',
          respuesta: 'was',
          porQue: '<b>I</b> lleva <i>was</i>, igual que <i>he</i>, <i>she</i> e <i>it</i>.',
        },
        {
          tipo: 'hueco',
          p: 'Completá: <b>The tests ______ failing this morning.</b>',
          respuesta: 'were',
          porQue: '<b>the tests</b> es plural → <i>were</i>. Y con <i>-ing</i> queda past continuous.',
        },
        {
          tipo: 'opcion',
          p: 'Querés decir que el problema ya está resuelto y ahora anda bien. ¿Cuál va?',
          opciones: ["It was working.", "It's working.", "It were working.", "It working."],
          correcta: 1,
          porQue: '<b>It\'s working</b> = ahora funciona. <i>It was working</i> significaría que antes andaba y ahora no.',
          porQueNo: {
            0: 'Comunica lo contrario: que funcionaba antes, no ahora.',
            2: '<i>it</i> es singular: lleva <i>was</i>, no <i>were</i>.',
            3: 'Le falta el auxiliar.',
          },
        },
        {
          tipo: 'dictado',
          p: 'Escuchá con atención: ¿presente o pasado?',
          respuesta: 'It was working this morning',
          porQue: 'El <b>was</b> es átono y se comprime a "wəz". Perderlo cambia el tiempo de la frase entera.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «¿En qué estabas trabajando ayer?»',
          respuesta: 'What were you working on yesterday',
          porQue: 'Past continuous con inversión: <b>were you</b>. Y <i>working <b>on</b></i>, con la preposición al final.',
        },
      ],

      errores: [
        { mito: 'Como <i>you</i> puede ser singular, lleva <i>was</i>.',
          realidad: '<b>you</b> siempre lleva <i>were</i>, aunque hables con una sola persona. ' +
                    'Es el mismo criterio que en presente, donde también lleva <i>are</i>.' },
        { mito: 'Perderse el <i>was</i> al escuchar no es grave, el contexto lo aclara.',
          realidad: 'Muchas veces no lo aclara. <i>It was working</i> (antes andaba, ahora no) e ' +
                    '<i>It\'s working</i> (ahora anda) son <b>reportes opuestos</b> sobre el mismo sistema. ' +
                    'Y se diferencian en una sílaba átona.' },
        { mito: 'Para negar en pasado hace falta <i>did not</i>.',
          realidad: 'Con <i>to be</i> no: va <b>wasn\'t</b> / <b>weren\'t</b>, directo. ' +
                    '<i>did</i> aparece con los demás verbos, y eso lo vemos en la lección 4.' },
      ],

      glosario: [
        { t: 'Was / were', d: 'El pasado de <i>to be</i>. Singular → was; plural y <i>you</i> → were.' },
        { t: 'Past continuous', d: '<i>was/were</i> + verbo en <i>-ing</i>. Lo que estaba pasando en un momento del pasado.' },
        { t: 'Was going to', d: 'Un plan que no se cumplió: <i>I was going to finish it, but…</i>' },
        { t: 'Forma débil de was', d: '/wəz/, casi inaudible. Es lo que hace que se confunda con el presente.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l2',
      titulo: 'La terminación -ed',
      minutos: 8,

      simple: `
        <p>Para el resto de los verbos, el pasado se arma agregando <b>-ed</b>. Y no cambia con el
        sujeto: es la misma forma para todos.</p>

        <table>
          <tr><th>Sujeto</th><th>Verbo</th></tr>
          <tr><td>I</td><td rowspan="5" style="vertical-align:middle"><b>worked</b></td></tr>
          <tr><td>you</td></tr>
          <tr><td>he / she / it</td></tr>
          <tr><td>we</td></tr>
          <tr><td>they</td></tr>
        </table>

        <p>Ni una sola excepción de concordancia. Es el tiempo verbal más simple del inglés.</p>

        <h4>Las reglas de escritura</h4>
        <ul>
          <li><b>Normal:</b> work → <span class="en" data-say>worked</span>,
          check → <span class="en" data-say>checked</span></li>
          <li><b>Ya termina en -e → solo se agrega -d:</b> use → <span class="en" data-say>used</span>,
          close → <span class="en" data-say>closed</span></li>
          <li><b>Consonante + y → -ied:</b> try → <span class="en" data-say>tried</span>,
          copy → <span class="en" data-say>copied</span></li>
          <li><b>CVC con acento final → se dobla:</b> stop → <span class="en" data-say>stopped</span>,
          plan → <span class="en" data-say>planned</span></li>
        </ul>
        <p>Son las mismas reglas del <i>-ing</i> del módulo anterior. Una sola vez que las aprendas,
        te sirven para las dos terminaciones.</p>

        <h4>Y por qué importa</h4>
        <p>Esto es lo que vas a escribir en cada mensaje sobre trabajo hecho:</p>
        <ul>
          <li><span class="en" data-say>I fixed the login bug.</span></li>
          <li><span class="en" data-say>I deployed it this morning.</span></li>
          <li><span class="en" data-say>We tested it on staging.</span></li>
          <li><span class="en" data-say>I checked the logs and I didn't see anything.</span></li>
          <li><span class="en" data-say>I updated the docs.</span></li>
        </ul>

        <div class="aviso">
          <b>Una ventaja que conviene apreciar:</b> el inglés de este nivel <b>colapsa cuatro tiempos
          del español en uno</b>.<br><br>
          «trabajé» · «trabajaba» · «he trabajado» · «había trabajado» → todos <b>worked</b><br><br>
          (Las distinciones existen en niveles B1 y B2, con <i>present perfect</i> y <i>past perfect</i>.
          Pero en A1 no las necesitás, y comunicarte con <i>worked</i> funciona perfecto.)
        </div>
      `,

      tecnico: `
        <p>El pasado regular es <b>invariable</b>: una sola forma para las seis personas. El inglés
        perdió por completo la concordancia verbal en pasado, incluso la <i>-s</i> de tercera persona
        que sí conserva en presente.</p>

        <p><b>Las reglas ortográficas</b> son idénticas a las del <i>-ing</i>:</p>
        <table>
          <tr><th>Caso</th><th>Regla</th><th>Ejemplos</th></tr>
          <tr><td>General</td><td>+ ed</td><td>work → worked</td></tr>
          <tr><td>Termina en -e</td><td>+ d solamente</td><td>use → used, close → closed</td></tr>
          <tr><td>Consonante + y</td><td>y → ied</td><td>try → tried, deploy… <b>no</b>: deployed</td></tr>
          <tr><td>CVC con acento final</td><td>se dobla</td><td>stop → stopped, plan → planned</td></tr>
        </table>

        <div class="nota-tec">
          <b>Ojo con <i>deploy</i>.</b> Termina en <i>y</i>, pero antes hay una <b>vocal</b> (<i>o</i>),
          así que no se aplica la regla de <i>-ied</i>: es <b>deployed</b>, no ❌ <i>deploied</i>.
          Lo mismo con <i>play → played</i> y <i>enjoy → enjoyed</i>.
          <br><br>
          La regla completa es «<b>consonante</b> + y → ied». La palabra clave es «consonante».
        </div>

        <p><b>Sobre el mapeo con el español.</b> El past simple inglés cubre lo que el español reparte
        entre pretérito perfecto simple, imperfecto y compuesto:</p>
        <table>
          <tr><th>Español</th><th>Inglés A1</th></tr>
          <tr><td>trabajé</td><td rowspan="4" style="vertical-align:middle">worked</td></tr>
          <tr><td>trabajaba</td></tr>
          <tr><td>he trabajado</td></tr>
          <tr><td>había trabajado</td></tr>
        </table>

        <p>Las distinciones existen —<i>was working</i>, <i>have worked</i>, <i>had worked</i>— pero son
        de B1 en adelante. En A1 <b>usar el past simple para todo funciona</b> y se entiende perfecto.
        Es de las pocas veces que la simplificación no te penaliza.</p>

        <p><b>Un detalle que sí conviene saber ya:</b> el inglés usa <i>past simple</i> donde el español
        usaría pretérito compuesto, si hay un marcador temporal explícito.
        <i>I finished it yesterday</i> — nunca ❌ <i>I have finished it yesterday</i>.
        Con <i>yesterday</i>, <i>last week</i>, <i>this morning</i> siempre va past simple.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Reglas de escritura del -ed y cómo el inglés colapsa cuatro tiempos del español en uno">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Cuatro reglas, cero conjugación</text>

          <g font-size="12.5">
            <rect x="34" y="38" width="146" height="72" rx="9" fill="currentColor" opacity="0.05" stroke="currentColor" stroke-opacity="0.15"/>
            <text x="107" y="58" text-anchor="middle" font-weight="700" fill="currentColor" opacity="0.85">+ ed</text>
            <text x="107" y="78" text-anchor="middle" fill="currentColor" opacity="0.8">work → worked</text>
            <text x="107" y="96" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">la mayoría</text>

            <rect x="192" y="38" width="146" height="72" rx="9" fill="#c084fc" opacity="0.1" stroke="#c084fc" stroke-width="1.2"/>
            <text x="265" y="58" text-anchor="middle" font-weight="700" fill="#c084fc">+ d</text>
            <text x="265" y="78" text-anchor="middle" fill="currentColor" opacity="0.85">use → used</text>
            <text x="265" y="96" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">ya termina en -e</text>

            <rect x="350" y="38" width="146" height="72" rx="9" fill="#22d3ee" opacity="0.1" stroke="#22d3ee" stroke-width="1.2"/>
            <text x="423" y="58" text-anchor="middle" font-weight="700" fill="#22d3ee">y → ied</text>
            <text x="423" y="78" text-anchor="middle" fill="currentColor" opacity="0.85">try → tried</text>
            <text x="423" y="96" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">CONSONANTE + y</text>

            <rect x="508" y="38" width="138" height="72" rx="9" fill="#fbbf24" opacity="0.1" stroke="#fbbf24" stroke-width="1.2"/>
            <text x="577" y="58" text-anchor="middle" font-weight="700" fill="#fbbf24">doblar</text>
            <text x="577" y="78" text-anchor="middle" fill="currentColor" opacity="0.85">stop → stopped</text>
            <text x="577" y="96" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">CVC acentuada</text>
          </g>

          <rect x="34" y="120" width="612" height="28" rx="7" fill="#f87171" opacity="0.1"/>
          <text x="340" y="139" text-anchor="middle" font-size="12" font-weight="600" fill="#f87171">
            ✗ deploied — deploy tiene VOCAL antes de la y → deployed
          </text>

          <line x1="34" y1="164" x2="646" y2="164" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="188" text-anchor="middle" font-size="13" font-weight="700" fill="#34d399">Y la ventaja: cuatro tiempos del español en uno</text>

          <g font-size="12.5">
            <text x="150" y="212" text-anchor="middle" fill="currentColor" opacity="0.8">trabajé</text>
            <text x="150" y="232" text-anchor="middle" fill="currentColor" opacity="0.8">trabajaba</text>
            <text x="150" y="252" text-anchor="middle" fill="currentColor" opacity="0.8">he trabajado</text>
            <text x="150" y="272" text-anchor="middle" fill="currentColor" opacity="0.8">había trabajado</text>
          </g>

          <g stroke="#34d399" stroke-width="1.6" opacity="0.5">
            <line x1="230" y1="208" x2="380" y2="238"/>
            <line x1="230" y1="228" x2="380" y2="240"/>
            <line x1="230" y1="248" x2="380" y2="244"/>
            <line x1="230" y1="268" x2="380" y2="246"/>
          </g>

          <rect x="392" y="222" width="180" height="42" rx="9" fill="#34d399" opacity="0.22" stroke="#34d399" stroke-width="1.6"/>
          <text x="482" y="249" text-anchor="middle" font-size="17" font-weight="800" fill="#34d399">worked</text>
        </svg>`,
        pie: 'Las mismas reglas del -ing. Y una simplificación enorme respecto del español.',
      },

      escucha: {
        intro: '<p>Reportes de trabajo hecho. Es lo que vas a escribir en cada mensaje ' +
               'sobre lo que terminaste.</p>',
        items: [
          { texto: 'I fixed the login bug this morning.', es: 'Arreglé el bug del login esta mañana.',
            nota: 'Con <b>this morning</b> siempre va past simple, nunca present perfect.' },
          { texto: 'We deployed it to staging yesterday.', es: 'Lo desplegamos a staging ayer.',
            nota: '<b>deployed</b>, no <i>deploied</i>: antes de la <i>y</i> hay una vocal.' },
          { texto: "I checked the logs and I didn't see anything.", es: 'Revisé los logs y no vi nada.',
            nota: 'Un verbo en pasado y una negación con <i>didn\'t</i> — eso lo vemos en la lección 4.' },
          { texto: 'We tried three different approaches.', es: 'Probamos tres enfoques distintos.',
            nota: '<b>tried</b>: consonante + <i>y</i> → <i>-ied</i>.' },
        ],
      },

      practica: `
        <p><b>Escribí qué hiciste ayer</b>, cinco frases con verbos regulares:</p>
        <ul>
          <li>I fixed ______.</li>
          <li>I checked ______.</li>
          <li>I updated ______.</li>
          <li>We tested ______.</li>
          <li>I deployed ______.</li>
        </ul>

        <p>Esos cinco verbos —<i>fix</i>, <i>check</i>, <i>update</i>, <i>test</i>, <i>deploy</i>—
        cubren casi todo lo que reportás en un standup, y los cinco son regulares.</p>

        <p><b>Y la regla que más se rompe:</b> «consonante + y → ied». La palabra clave es
        <b>consonante</b>.</p>
        <ul>
          <li>try → tried ✅ (consonante antes de la y)</li>
          <li>deploy → deployed ✅ (vocal antes de la y)</li>
        </ul>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Escribí el pasado de <b>fix</b>.',
          respuesta: 'fixed',
          porQue: 'Regla general: <b>+ ed</b>. Es el verbo que más vas a usar reportando trabajo.',
        },
        {
          tipo: 'hueco',
          p: 'Escribí el pasado de <b>try</b>.',
          respuesta: 'tried',
          porQue: 'Consonante (<i>r</i>) + <i>y</i> → <b>-ied</b>.',
        },
        {
          tipo: 'hueco',
          p: 'Escribí el pasado de <b>deploy</b>.',
          respuesta: 'deployed',
          porQue: 'Antes de la <i>y</i> hay una <b>vocal</b> (<i>o</i>), así que la regla de <i>-ied</i> no aplica. Va <i>-ed</i> normal.',
        },
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: [
            'I have finished it yesterday.',
            'I finished it yesterday.',
            'I finish it yesterday.',
            'I was finished it yesterday.',
          ],
          correcta: 1,
          porQue: 'Con un marcador temporal explícito (<b>yesterday</b>, <i>last week</i>, <i>this morning</i>) siempre va past simple.',
          porQueNo: {
            0: 'El present perfect no admite marcadores de tiempo pasado concreto. Es un error muy frecuente.',
            2: 'Está en presente.',
            3: 'Mezcla estructuras: sería voz pasiva mal armada.',
          },
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «Lo desplegamos a staging ayer.»',
          respuesta: 'We deployed it to staging yesterday',
          porQue: '<b>deployed</b> con <i>-ed</i> normal, y <b>yesterday</b> al final de la frase.',
        },
      ],

      errores: [
        { mito: '<i>deploy</i> termina en y, así que el pasado es <i>deploied</i>.',
          realidad: 'La regla es «<b>consonante</b> + y → ied». En <i>deploy</i> hay una <b>vocal</b> antes de la <i>y</i>, ' +
                    'así que va <b>deployed</b>. Lo mismo con <i>played</i> y <i>enjoyed</i>.' },
        { mito: 'Puedo decir <i>I have finished it yesterday</i>.',
          realidad: 'No. Con un marcador de tiempo pasado concreto —<i>yesterday</i>, <i>last week</i>, <i>this morning</i>— ' +
                    'siempre va <b>past simple</b>: <i>I finished it yesterday</i>. Es de los errores que más ' +
                    'se arrastran hasta B2.' },
        { mito: 'El pasado en inglés debe tener alguna concordancia que se me está escapando.',
          realidad: 'No hay ninguna. <b>worked</b> es igual para las seis personas. Ni siquiera existe la -s ' +
                    'de tercera persona. Es el tiempo verbal más simple del idioma.' },
      ],

      glosario: [
        { t: 'Past simple', d: 'El pasado con <i>-ed</i>. Una sola forma para todas las personas.' },
        { t: 'Regla del -ied', d: 'Solo con <b>consonante</b> + y: <i>try → tried</i>. Con vocal antes de la y, va <i>-ed</i> normal: <i>deploy → deployed</i>.' },
        { t: 'Marcador temporal', d: '<i>yesterday</i>, <i>last week</i>, <i>this morning</i>. Cuando aparecen, obligan al past simple.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l3',
      titulo: 'Las tres formas de decir -ed',
      minutos: 8,

      simple: `
        <p>Se escribe siempre igual, pero se dice de <b>tres formas distintas</b>. Y no hay que
        estudiarlas: salen solas si prestás atención. Lo que sí importa es <b>no comérselas</b>.</p>

        <table>
          <tr><th>Suena</th><th>Cuándo</th><th>Ejemplos</th></tr>
          <tr><td>/t/</td><td>después de sonido sordo</td><td>fixed, checked, stopped, worked</td></tr>
          <tr><td>/d/</td><td>después de sonido sonoro o vocal</td><td>closed, tried, deployed, opened</td></tr>
          <tr><td>/ɪd/</td><td>después de <b>t</b> o <b>d</b></td><td>tested, updated, needed, started</td></tr>
        </table>

        <p><b>La única que hay que recordar es la tercera</b>, porque agrega una sílaba entera:</p>
        <ul>
          <li><span class="en" data-say>test</span> (1 sílaba) → <span class="en" data-say>tested</span> (2 sílabas)</li>
          <li><span class="en" data-say>update</span> (2) → <span class="en" data-say>updated</span> (3)</li>
          <li><span class="en" data-say>need</span> (1) → <span class="en" data-say>needed</span> (2)</li>
        </ul>

        <p>Las otras dos <b>no agregan sílaba</b>:</p>
        <ul>
          <li><span class="en" data-say>fixed</span> se dice "fikst", una sílaba — no "fik-sed"</li>
          <li><span class="en" data-say>worked</span> se dice "wörkt", una sílaba</li>
          <li><span class="en" data-say>closed</span> se dice "klouzd", una sílaba</li>
        </ul>

        <div class="aviso">
          <b>El error del hispanohablante es al revés del que uno esperaría.</b><br><br>
          No es comerse el <i>-ed</i>: es <b>pronunciarlo de más</b>. Como en español todas las
          terminaciones son sílabas («trabaj-a-do»), sale natural decir "fix-ed" en dos sílabas.<br><br>
          ❌ "FIK-sed" · ✅ <span class="en" data-say>fixed</span> — una sola sílaba, "fikst"
        </div>

        <h4>La regla que sí funciona sin pensar</h4>
        <p>Si el verbo <b>ya termina en t o en d</b>, el <i>-ed</i> suena como sílaba aparte.
        Si no, no. Eso es todo.</p>
        <ul>
          <li>tes<b>t</b> → tes-ted ✓ sílaba nueva</li>
          <li>upda<b>t</b>e → upda-ted ✓ sílaba nueva</li>
          <li>nee<b>d</b> → nee-ded ✓ sílaba nueva</li>
          <li>fix → fixed ✗ sin sílaba nueva</li>
          <li>close → closed ✗ sin sílaba nueva</li>
        </ul>
      `,

      tecnico: `
        <p>Es el mismo mecanismo de <b>asimilación</b> que rige el plural y la <i>-s</i> de tercera
        persona: el sufijo adapta su sonoridad al segmento anterior, y se inserta una vocal cuando
        la secuencia sería impronunciable.</p>

        <table>
          <tr><th>Realización</th><th>Contexto</th><th>Por qué</th></tr>
          <tr><td>/t/</td><td>tras sordo (p, k, f, s, ʃ, tʃ, θ)</td><td>asimila a sordo</td></tr>
          <tr><td>/d/</td><td>tras sonoro o vocal</td><td>asimila a sonoro</td></tr>
          <tr><td>/ɪd/</td><td>tras /t/ o /d/</td><td>epéntesis: sin vocal serían indistinguibles</td></tr>
        </table>

        <div class="nota-tec">
          <b>Por qué la tercera existe.</b> Si a <i>test</i> /test/ le agregaras solo /t/, quedaría
          /testt/ — dos oclusivas idénticas seguidas, que el oído no puede separar de una sola.
          La vocal /ɪ/ se inserta para que la marca de pasado <b>sea audible</b>.
          <br><br>
          Es exactamente la misma lógica de <i>classes</i> /ˈklæsɪz/ en el plural: cuando el sufijo
          se confundiría con lo anterior, se mete una vocal en el medio.
        </div>

        <p><b>El error típico del hispanohablante es la sobrearticulación.</b> El español no admite
        grupos consonánticos finales complejos, así que la secuencia /kst/ de <i>fixed</i> tiende a
        romperse insertando una vocal: "fik-sed". Suena marcadamente extranjero y, peor, <b>hace
        parecer que el verbo es de la tercera clase</b>, lo cual confunde.</p>

        <p><b>Los verbos de la tercera clase son pocos pero muy frecuentes en trabajo:</b></p>
        <p><i>tested</i>, <i>updated</i>, <i>started</i>, <i>needed</i>, <i>wanted</i>, <i>added</i>,
        <i>created</i>, <i>deleted</i>, <i>expected</i>, <i>reverted</i>, <i>completed</i>.</p>

        <p>Fijate que casi todos son de vocabulario técnico. Vale la pena tenerlos identificados,
        porque son justamente los que <b>sí</b> llevan sílaba extra.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Las tres pronunciaciones de la terminación -ed">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Una escritura, tres sonidos</text>

          <g>
            <rect x="34" y="40" width="196" height="106" rx="10" fill="#34d399" opacity="0.1" stroke="#34d399" stroke-width="1.3"/>
            <text x="132" y="66" text-anchor="middle" font-size="19" font-weight="800" fill="#34d399">/t/</text>
            <text x="132" y="86" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">tras sonido sordo</text>
            <text x="132" y="108" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">fixed · checked</text>
            <text x="132" y="126" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">worked · stopped</text>
            <text x="132" y="142" text-anchor="middle" font-size="11" font-weight="700" fill="#34d399">sin sílaba nueva</text>
          </g>

          <g>
            <rect x="242" y="40" width="196" height="106" rx="10" fill="#22d3ee" opacity="0.1" stroke="#22d3ee" stroke-width="1.3"/>
            <text x="340" y="66" text-anchor="middle" font-size="19" font-weight="800" fill="#22d3ee">/d/</text>
            <text x="340" y="86" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">tras sonoro o vocal</text>
            <text x="340" y="108" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">closed · tried</text>
            <text x="340" y="126" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">deployed · opened</text>
            <text x="340" y="142" text-anchor="middle" font-size="11" font-weight="700" fill="#22d3ee">sin sílaba nueva</text>
          </g>

          <g>
            <rect x="450" y="40" width="196" height="106" rx="10" fill="#f59e0b" opacity="0.14" stroke="#f59e0b" stroke-width="1.6"/>
            <text x="548" y="66" text-anchor="middle" font-size="19" font-weight="800" fill="#f59e0b">/ɪd/</text>
            <text x="548" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="currentColor" opacity="0.85">tras t o d</text>
            <text x="548" y="108" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">tested · updated</text>
            <text x="548" y="126" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">needed · started</text>
            <text x="548" y="142" text-anchor="middle" font-size="11" font-weight="800" fill="#f59e0b">SÍ agrega sílaba</text>
          </g>

          <rect x="34" y="164" width="612" height="40" rx="9" fill="#22d3ee" opacity="0.09" stroke="#22d3ee" stroke-width="1.2"/>
          <text x="340" y="182" text-anchor="middle" font-size="12.5" font-weight="700" fill="#22d3ee">La única regla que hay que recordar</text>
          <text x="340" y="198" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">
            ¿El verbo ya termina en t o d? → sílaba nueva. Si no, no.
          </text>

          <rect x="34" y="214" width="612" height="44" rx="9" fill="#f87171" opacity="0.1" stroke="#f87171" stroke-width="1.2"/>
          <text x="340" y="234" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f87171">El error del hispanohablante es al revés de lo esperado</text>
          <text x="340" y="251" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">
            No es comerse el -ed: es decirlo de más. ✗ "FIK-sed" · ✓ "fikst"
          </text>
        </svg>`,
        pie: 'Solo la tercera columna agrega una sílaba. Las otras dos se pegan al final sin ocupar tiempo.',
      },

      escucha: {
        intro: '<p>Contá las sílabas de cada verbo en pasado. Es un ejercicio de oído fino ' +
               'y es lo que evita que suenes a traducción.</p>',
        items: [
          { texto: 'I fixed it and I tested it.', es: 'Lo arreglé y lo probé.',
            nota: '<b>fixed</b> una sílaba ("fikst"), <b>tested</b> dos ("TES-tid"). Están en la misma frase a propósito.' },
          { texto: 'We updated the docs and closed the issue.', es: 'Actualizamos la doc y cerramos el issue.',
            nota: '<b>updated</b> tres sílabas, <b>closed</b> una. Otra vez el contraste.' },
          { texto: 'I started at nine and finished at six.', es: 'Empecé a las nueve y terminé a las seis.',
            nota: '<b>started</b> dos sílabas (termina en t), <b>finished</b> dos pero la segunda es del verbo, no del -ed.' },
          { texto: 'They needed more time, so we reverted the change.', es: 'Necesitaban más tiempo, así que revertimos el cambio.',
            nota: '<b>needed</b> y <b>reverted</b>: los dos terminan en <i>d</i> o <i>t</i>, los dos agregan sílaba.' },
        ],
      },

      practica: `
        <p><b>Decí estos diez en voz alta</b> y contá las sílabas. Cinco agregan una, cinco no:</p>
        <p><span class="en" data-say>fixed</span> · <span class="en" data-say>tested</span> ·
        <span class="en" data-say>checked</span> · <span class="en" data-say>updated</span> ·
        <span class="en" data-say>closed</span> · <span class="en" data-say>needed</span> ·
        <span class="en" data-say>deployed</span> · <span class="en" data-say>started</span> ·
        <span class="en" data-say>worked</span> · <span class="en" data-say>created</span></p>

        <p><i>(Agregan sílaba: tested, updated, needed, started, created — los cinco terminan en t o d.)</i></p>

        <p><b>Grabate diciendo esta frase</b> con el micrófono de la pestaña 🎧:</p>
        <p><span class="en" data-say>I fixed it, tested it, and deployed it.</span></p>
        <p>Tres verbos en pasado y <b>ninguno</b> agrega sílaba. Si te salen seis sílabas donde
        deberían ir tres, ahí está el trabajo.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: '¿Cuál de estos verbos en pasado <b>agrega una sílaba</b> al decirlo?',
          opciones: ['fixed', 'closed', 'tested', 'worked'],
          correcta: 2,
          porQue: '<b>test</b> ya termina en <i>t</i>, así que el <i>-ed</i> necesita una vocal para ser audible: "TES-tid".',
          porQueNo: {
            0: '<i>fixed</i> se dice "fikst", una sola sílaba.',
            1: '<i>closed</i> se dice "klouzd", una sola sílaba.',
            3: '<i>worked</i> se dice "wörkt", una sola sílaba.',
          },
        },
        {
          tipo: 'opcion',
          p: '¿Cuál es el error típico del hispanohablante con el <i>-ed</i>?',
          opciones: [
            'Comerse la terminación',
            'Pronunciarla como sílaba aparte cuando no corresponde',
            'Confundirla con el plural',
            'Ponerla en verbos irregulares',
          ],
          correcta: 1,
          porQue: 'Como en español toda terminación es sílaba, sale natural decir "fik-sed". Lo correcto es "fikst", pegado.',
          porQueNo: {
            0: 'Ese es el error con la <i>-s</i>, no con el <i>-ed</i>.',
            2: 'No suele haber confusión entre las dos.',
            3: 'Pasa a veces, pero no es el problema de pronunciación de esta lección.',
          },
        },
        {
          tipo: 'dictado',
          p: 'Escuchá y escribí. Contá bien las sílabas antes de decidir.',
          respuesta: 'I fixed it and I tested it',
          porQue: '<b>fixed</b> una sílaba, <b>tested</b> dos. Están juntas a propósito, para que oigas el contraste.',
        },
        {
          tipo: 'hueco',
          p: 'Escribí el pasado de <b>update</b>.',
          respuesta: 'updated',
          porQue: 'Termina en <i>-e</i> → solo se agrega <b>d</b>. Y como el sonido anterior es /t/, se dice "up-DEI-tid", con sílaba nueva.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «Lo arreglé, lo probé y lo desplegué.»',
          respuesta: 'I fixed it tested it and deployed it',
          porQue: 'Tres verbos en pasado y <b>ninguno</b> agrega sílaba. Es la frase de práctica de la lección.',
        },
      ],

      errores: [
        { mito: 'El <i>-ed</i> siempre se pronuncia como una sílaba aparte.',
          realidad: 'Solo cuando el verbo <b>ya termina en t o d</b>: <i>tested</i>, <i>updated</i>, <i>needed</i>. ' +
                    'En los demás casos se pega al final sin ocupar tiempo: <i>fixed</i> es una sola sílaba.' },
        { mito: 'Hay que memorizar cuál de las tres pronunciaciones va en cada verbo.',
          realidad: 'No. Las dos primeras <b>salen solas</b> — es lo que hace la boca naturalmente. ' +
                    'Lo único que hay que recordar es la tercera, y la regla es de un solo paso: ' +
                    '¿termina en t o d? Entonces suma sílaba.' },
        { mito: 'Si pronuncio el <i>-ed</i> bien marcado se entiende mejor.',
          realidad: 'Al contrario: sobrearticularlo suena marcadamente extranjero y encima <b>confunde</b>, ' +
                    'porque hace parecer que el verbo termina en t o d cuando no. ' +
                    '<i>fixed</i> tiene que sonar "fikst", pegado.' },
      ],

      glosario: [
        { t: 'Asimilación', d: 'El sufijo adapta su sonoridad al sonido anterior. Es lo mismo que pasa con el plural y la -s de tercera persona.' },
        { t: 'Epéntesis', d: 'Insertar una vocal para que dos sonidos parecidos no se confundan. Es por eso que <i>tested</i> suma sílaba.' },
        { t: 'Sobrearticulación', d: 'Pronunciar de más. El error típico del hispanohablante con el <i>-ed</i>: decir "fik-sed" en vez de "fikst".' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l4',
      titulo: 'Did: negar y preguntar en pasado',
      minutos: 8,

      simple: `
        <p>Para negar y preguntar en pasado se pide prestado un auxiliar, igual que en presente.
        Pero acá hay <b>una sola forma</b>: <b>did</b>, para todos los sujetos.</p>

        <div class="analogia">
          <span class="en" data-say>I fixed it</span> → <span class="en" data-say>I didn't fix it</span><br>
          <span class="en" data-say>She fixed it</span> → <span class="en" data-say>Did she fix it?</span>
        </div>

        <p>No hay <i>did</i> / <i>dids</i>: es <b>did</b> siempre. Una preocupación menos que en presente,
        donde había que elegir entre <i>do</i> y <i>does</i>.</p>

        <div class="aviso">
          <b>Y la regla que ya conocés, otra vez:</b> cuando aparece <b>did</b>, el verbo principal
          <b>vuelve a su forma base</b>. El pasado ya está marcado en el auxiliar.<br><br>
          ❌ <i>I didn't fixed it</i> → ✅ <span class="en" data-say>I didn't fix it</span><br>
          ❌ <i>Did you fixed it?</i> → ✅ <span class="en" data-say>Did you fix it?</span><br><br>
          Es exactamente el mismo principio que <i>Does he work?</i> del módulo 3. Si lo entendiste
          allá, acá no hay nada nuevo.
        </div>

        <h4>Respuestas cortas</h4>
        <ul>
          <li>— <span class="en" data-say>Did you deploy it?</span><br>
              — <span class="en" data-say>Yes, I did.</span> / <span class="en" data-say>No, I didn't.</span></li>
        </ul>

        <h4>Preguntas con palabra de pregunta</h4>
        <ul>
          <li><span class="en" data-say>What did you do yesterday?</span></li>
          <li><span class="en" data-say>When did it break?</span></li>
          <li><span class="en" data-say>Why did the build fail?</span></li>
          <li><span class="en" data-say>Who deployed this?</span> — sin <i>did</i>, porque <i>who</i> es el sujeto</li>
        </ul>
        <p>Esa última es la excepción: cuando la palabra de pregunta <b>es el sujeto</b>, no hace falta
        <i>did</i>. <i>Who deployed this?</i>, no ❌ <i>Who did deploy this?</i></p>

        <h4>Cuándo pasó</h4>
        <ul>
          <li><span class="en" data-say>yesterday</span> — ayer</li>
          <li><span class="en" data-say>this morning</span> — esta mañana</li>
          <li><span class="en" data-say>last week</span> · <span class="en" data-say>last month</span></li>
          <li><span class="en" data-say>two days ago</span> — hace dos días</li>
          <li><span class="en" data-say>before the deploy</span> — antes del deploy</li>
        </ul>
        <p><b>Ojo con <i>ago</i>:</b> va <b>después</b> del período, no antes.
        <i>two days ago</i>, nunca ❌ <i>ago two days</i>.</p>
      `,

      tecnico: `
        <p>Es el mismo <b><i>do</i>-support</b> del módulo 3, con el auxiliar en pasado. La marca
        temporal se aloja en el primer elemento del grupo verbal, y el verbo léxico queda en forma base.</p>

        <table>
          <tr><th>Presente</th><th>Pasado</th></tr>
          <tr><td>Do you work here?</td><td>Did you work here?</td></tr>
          <tr><td>She doesn't work here.</td><td>She didn't work here.</td></tr>
          <tr><td>Does it fail?</td><td>Did it fail?</td></tr>
        </table>

        <div class="nota-tec">
          <b>Una simplificación real:</b> <i>did</i> no tiene concordancia. Donde en presente había que
          elegir entre <i>do</i> y <i>does</i>, en pasado hay una sola forma para todo.
          <br><br>
          Y como el verbo léxico vuelve a la base, <b>tampoco hay que saber su pasado irregular</b> para
          negar o preguntar. <i>Did you go?</i> — no hace falta <i>went</i>. Eso baja bastante la carga
          de los verbos irregulares del módulo siguiente.
        </div>

        <p><b>La excepción de <i>who</i> y <i>what</i> como sujeto.</b> Cuando la palabra de pregunta
        ocupa la posición de sujeto, no hay inversión ni <i>do</i>-support:</p>
        <ul>
          <li><i>Who deployed this?</i> — <i>who</i> es el sujeto ✅</li>
          <li><i>Who did you talk to?</i> — <i>who</i> es el objeto, sí lleva <i>did</i> ✅</li>
          <li><i>What broke the build?</i> — <i>what</i> es el sujeto ✅</li>
          <li><i>What did you break?</i> — <i>what</i> es el objeto ✅</li>
        </ul>

        <p>La lógica: el <i>do</i>-support existe para permitir la inversión. Si la palabra de pregunta
        ya está donde va el sujeto, no hay nada que invertir.</p>

        <p><b>Sobre <i>did</i> enfático.</b> Igual que en presente, el auxiliar puede aparecer en
        afirmativas para insistir:</p>
        <ul>
          <li><i>I <b>did</b> test it, I promise.</i> — sí que lo probé</li>
          <li><i>It <b>did</b> work yesterday.</i> — ayer sí funcionaba</li>
        </ul>
        <p>Es muy útil cuando alguien pone en duda lo que hiciste. Lleva acento fuerte en <i>did</i>.</p>

        <p><b>Sobre <i>ago</i>.</b> Es <b>pospuesto</b>: va después de la expresión de tiempo.
        <i>two days ago</i>, <i>a week ago</i>, <i>ten minutes ago</i>. Es una de las pocas
        posposiciones del inglés, y por eso el orden se calca mal desde el español («hace dos días»).</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Did como auxiliar de pasado y la regla de que el verbo vuelve a su forma base">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">El pasado se muda al auxiliar</text>

          <g font-size="13.5">
            <rect x="70" y="42" width="240" height="34" rx="7" fill="#34d399" opacity="0.12" stroke="#34d399" stroke-width="1.2"/>
            <text x="190" y="64" text-anchor="middle" fill="currentColor">I fix<tspan fill="#34d399" font-weight="800">ed</tspan> it</text>

            <text x="340" y="64" text-anchor="middle" font-size="16" fill="currentColor" opacity="0.4">→</text>

            <rect x="370" y="42" width="240" height="34" rx="7" fill="#34d399" opacity="0.12" stroke="#34d399" stroke-width="1.2"/>
            <text x="490" y="64" text-anchor="middle" fill="currentColor"><tspan fill="#34d399" font-weight="800">Did</tspan> you fix it?</text>
          </g>

          <text x="340" y="98" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.7">
            la marca de pasado va UNA sola vez, y le toca al auxiliar
          </text>

          <rect x="70" y="112" width="540" height="30" rx="7" fill="#f87171" opacity="0.1"/>
          <text x="340" y="132" text-anchor="middle" font-size="12" font-weight="600" fill="#f87171">
            ✗ Did you fixed it? · ✗ I didn't fixed it
          </text>

          <line x1="34" y1="158" x2="646" y2="158" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="180" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">Y una simplificación respecto del presente</text>

          <g font-size="12.5">
            <rect x="60" y="192" width="256" height="60" rx="9" fill="currentColor" opacity="0.05" stroke="currentColor" stroke-opacity="0.15"/>
            <text x="188" y="212" text-anchor="middle" font-weight="700" fill="currentColor" opacity="0.8">PRESENTE</text>
            <text x="188" y="232" text-anchor="middle" fill="currentColor" opacity="0.8">do / does</text>
            <text x="188" y="246" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">hay que elegir</text>

            <rect x="364" y="192" width="256" height="60" rx="9" fill="#34d399" opacity="0.13" stroke="#34d399" stroke-width="1.4"/>
            <text x="492" y="212" text-anchor="middle" font-weight="700" fill="#34d399">PASADO</text>
            <text x="492" y="232" text-anchor="middle" font-weight="800" fill="#34d399">did</text>
            <text x="492" y="246" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">una sola forma, siempre</text>
          </g>

          <text x="340" y="272" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.65">
            Excepción: si la palabra de pregunta ES el sujeto, no va did — "Who deployed this?"
          </text>
        </svg>`,
        pie: 'Mismo mecanismo del módulo 3, con menos formas que elegir.',
      },

      escucha: {
        intro: '<p>Preguntas y negaciones en pasado. Fijate que el verbo principal siempre ' +
               'queda en forma base.</p>',
        items: [
          { texto: 'Did you deploy it yesterday?', es: '¿Lo desplegaste ayer?',
            nota: '<b>deploy</b> en forma base, sin <i>-ed</i>: el pasado ya lo lleva <i>did</i>.' },
          { texto: "I didn't see the error in the logs.", es: 'No vi el error en los logs.',
            nota: '<b>see</b> en base, no <i>saw</i>. Con <i>didn\'t</i> ni siquiera hace falta saber el irregular.' },
          { texto: 'Who deployed this?', es: '¿Quién desplegó esto?',
            nota: 'Sin <b>did</b>: <i>who</i> es el sujeto, así que no hay nada que invertir.' },
          { texto: 'It broke two days ago.', es: 'Se rompió hace dos días.',
            nota: '<b>ago</b> va <b>después</b> del período. Nunca ❌ <i>ago two days</i>.' },
          { texto: 'I did test it, I promise.', es: 'Sí que lo probé, te lo prometo.',
            nota: '<b>did</b> enfático, con acento fuerte. Sirve cuando ponen en duda lo que hiciste.' },
        ],
      },

      practica: `
        <p><b>Convertí estas cinco a negativo y a pregunta</b>, en voz alta, cuidando que el verbo
        quede en <b>forma base</b>:</p>
        <ol>
          <li>I deployed it. → <i>I didn't deploy it</i> · <i>Did you deploy it?</i></li>
          <li>She fixed the bug.</li>
          <li>We tested it on staging.</li>
          <li>The build failed.</li>
          <li>They updated the docs.</li>
        </ol>

        <p><b>Y armá el standup de ayer completo</b>, ahora con todas las piezas del módulo:</p>
        <div class="analogia">
          <span class="en" data-say>Yesterday I was working on the login bug. I fixed it and deployed it to staging. I didn't finish the tests, so I'm still on that today.</span>
        </div>

        <p><b>Las tres cosas a vigilar:</b> <i>was</i> para el continuo, <i>-ed</i> para lo terminado,
        y <b>forma base</b> después de <i>didn't</i>.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: ['Did you fixed it?', 'Did you fix it?', 'Do you fixed it?', 'Did you fixing it?'],
          correcta: 1,
          porQue: 'Con <b>did</b>, el verbo principal vuelve a su <b>forma base</b>. El pasado ya está marcado en el auxiliar.',
          porQueNo: {
            0: 'El pasado está duplicado: en <i>did</i> y en <i>fixed</i>.',
            2: '<i>do</i> es presente; para pasado va <i>did</i>.',
            3: 'El <i>-ing</i> no va después de <i>did</i>.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá la negación: <b>I ______ see the error in the logs.</b>',
          respuesta: "didn't",
          respuestas: ['did not'],
          porQue: '<b>didn\'t</b> + forma base. Con este auxiliar ni siquiera hace falta saber que el pasado de <i>see</i> es <i>saw</i>.',
        },
        {
          tipo: 'opcion',
          p: '¿Cómo se pregunta «¿quién desplegó esto?»',
          opciones: ['Who did deployed this?', 'Who did deploy this?', 'Who deployed this?', 'Did who deploy this?'],
          correcta: 2,
          porQue: 'Cuando la palabra de pregunta <b>es el sujeto</b>, no hace falta <i>did</i>: no hay nada que invertir.',
          porQueNo: {
            0: 'Duplica el pasado y además <i>did</i> sobra.',
            1: 'Gramatical solo como forma enfática («¿quién SÍ lo desplegó?»), no como pregunta neutra.',
            3: 'El orden no funciona.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Se rompió hace dos días.</b>',
          respuesta: 'It broke two days ago',
          pista: '«hace» va al final en inglés.',
          porQue: '<b>ago</b> es pospuesto: va <b>después</b> del período. Nunca ❌ <i>ago two days</i>.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá la pregunta: «¿Qué hiciste ayer?»',
          respuesta: 'What did you do yesterday',
          porQue: 'Dos <i>do</i>: el primero es <b>did</b>, el auxiliar de pasado, y el segundo el verbo en forma base.',
        },
      ],

      errores: [
        { mito: 'Con <i>didn\'t</i> el verbo también va en pasado.',
          realidad: '❌ <i>I didn\'t fixed it</i>. El pasado se marca <b>una sola vez</b>, y le toca al auxiliar. ' +
                    'El verbo vuelve a su forma base: <i>I didn\'t fix it</i>. Es el mismo principio de ' +
                    '<i>Does he work?</i> del módulo 3.' },
        { mito: 'Toda pregunta en pasado lleva <i>did</i>.',
          realidad: 'No cuando la palabra de pregunta <b>es el sujeto</b>: <i>Who deployed this?</i>, ' +
                    '<i>What broke the build?</i> El <i>do</i>-support existe para permitir la inversión, ' +
                    'y ahí no hay nada que invertir.' },
        { mito: '«Hace dos días» es <i>ago two days</i>.',
          realidad: '<b>ago</b> es <b>pospuesto</b>: <i>two days ago</i>, <i>a week ago</i>, <i>ten minutes ago</i>. ' +
                    'Es una de las pocas posposiciones del inglés, y por eso el orden se calca mal desde el español.' },
      ],

      glosario: [
        { t: 'Did', d: 'El auxiliar de pasado. Una sola forma para todos los sujetos, y el verbo que lo sigue va en base.' },
        { t: 'Ago', d: 'Hace (tiempo). Va <b>después</b> del período: <i>two days ago</i>.' },
        { t: 'Did enfático', d: '<i>I did test it</i> = «sí que lo probé». Sirve cuando ponen en duda lo que hiciste.' },
        { t: 'Who como sujeto', d: 'Cuando <i>who</i> o <i>what</i> ocupan la posición de sujeto, la pregunta va sin <i>did</i>.' },
      ],
    },
  ],

  /* ==================================================================== */
  vocabulario: [
    { en: 'was', es: 'era / estaba / fui', pista: 'Para I, he, she, it.', ejemplo: 'I was at the office yesterday.', ejemploEs: 'Ayer estuve en la oficina.' },
    { en: 'were', es: 'eran / estaban', pista: 'Para you, we, they.', ejemplo: 'The tests were failing.', ejemploEs: 'Los tests estaban fallando.' },
    { en: 'did', es: 'auxiliar de pasado', pista: 'El verbo que le sigue va en forma base.', ejemplo: 'Did you deploy it?', ejemploEs: '¿Lo desplegaste?' },
    { en: 'fixed', es: 'arreglé / arreglado', pista: 'Se dice "fikst", una sílaba.', ejemplo: 'I fixed the login bug.', ejemploEs: 'Arreglé el bug del login.' },
    { en: 'checked', es: 'revisé', ejemplo: 'I checked the logs.', ejemploEs: 'Revisé los logs.' },
    { en: 'tested', es: 'probé', pista: 'Dos sílabas: TES-tid.', ejemplo: 'We tested it on staging.', ejemploEs: 'Lo probamos en staging.' },
    { en: 'updated', es: 'actualicé', pista: 'Tres sílabas.', ejemplo: 'I updated the docs.', ejemploEs: 'Actualicé la documentación.' },
    { en: 'deployed', es: 'desplegué', pista: 'Vocal antes de la y: deployed, no deploied.', ejemplo: 'We deployed it yesterday.', ejemploEs: 'Lo desplegamos ayer.' },
    { en: 'created', es: 'creé', pista: 'Agrega sílaba.', ejemplo: 'I created a new branch.', ejemploEs: 'Creé una rama nueva.' },
    { en: 'started', es: 'empecé', pista: 'Agrega sílaba.', ejemplo: 'I started at nine.', ejemploEs: 'Empecé a las nueve.' },
    { en: 'finished', es: 'terminé', ejemplo: 'I finished it this morning.', ejemploEs: 'Lo terminé esta mañana.' },
    { en: 'tried', es: 'intenté / probé', pista: 'Consonante + y → ied.', ejemplo: 'We tried three approaches.', ejemploEs: 'Probamos tres enfoques.' },
    { en: 'reverted', es: 'revertí', ejemplo: 'We reverted the change.', ejemploEs: 'Revertimos el cambio.' },
    { en: 'yesterday', es: 'ayer', ejemplo: 'I fixed it yesterday.', ejemploEs: 'Lo arreglé ayer.' },
    { en: 'last week', es: 'la semana pasada', ejemplo: 'We deployed it last week.', ejemploEs: 'Lo desplegamos la semana pasada.' },
    { en: 'ago', es: 'hace (tiempo)', pista: 'Va DESPUÉS del período: two days ago.', ejemplo: 'It broke two days ago.', ejemploEs: 'Se rompió hace dos días.' },
    { en: 'this morning', es: 'esta mañana', ejemplo: 'It was working this morning.', ejemploEs: 'Esta mañana funcionaba.' },
    { en: 'before', es: 'antes de', ejemplo: 'It worked before the deploy.', ejemploEs: 'Funcionaba antes del deploy.' },
    { en: 'break', es: 'romperse', pista: 'Pasado irregular: broke.', ejemplo: 'When did it break?', ejemploEs: '¿Cuándo se rompió?' },
    { en: 'approach', es: 'enfoque', ejemplo: 'We tried a different approach.', ejemploEs: 'Probamos un enfoque distinto.' },
    { en: 'change', es: 'cambio', ejemplo: 'We reverted the change.', ejemploEs: 'Revertimos el cambio.' },
    { en: 'staging', es: 'entorno de pruebas', ejemplo: 'We tested it on staging.', ejemploEs: 'Lo probamos en staging.' },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál está bien?',
      opciones: ['You was in the meeting.', 'You were in the meeting.', 'You are was in the meeting.', 'You wasn\'t were in the meeting.'],
      correcta: 1,
      porQue: '<b>you</b> siempre lleva <i>were</i>, aunque hables con una sola persona. Es el mismo criterio que <i>are</i> en presente.',
      porQueNo: {
        0: '<i>was</i> es para <i>I</i>, <i>he</i>, <i>she</i> e <i>it</i>.',
        2: 'Dos verbos seguidos sin sentido.',
        3: 'Sin sentido.',
      },
    },
    {
      p: '¿Qué diferencia hay entre <i>It was working</i> e <i>It\'s working</i>?',
      opciones: [
        'Ninguna, son formas equivalentes',
        'La primera dice que antes funcionaba y ahora no; la segunda, que ahora funciona',
        'La primera es formal y la segunda informal',
        'La primera es británica',
      ],
      correcta: 1,
      porQue: 'Son <b>reportes opuestos</b> sobre el mismo sistema, y se diferencian en una sílaba átona (<i>was</i> suena "wəz").',
      porQueNo: {
        0: 'Dicen cosas contrarias.',
        2: 'No es cuestión de registro.',
        3: 'Es igual en todas las variedades.',
      },
    },
    {
      p: '¿Cuál es el pasado de <b>deploy</b>?',
      opciones: ['deploied', 'deployed', 'deployd', 'deploiyed'],
      correcta: 1,
      porQue: 'La regla del <i>-ied</i> es para <b>consonante</b> + y. En <i>deploy</i> hay una vocal antes de la <i>y</i>, así que va <i>-ed</i> normal.',
      porQueNo: {
        0: 'Ese sería el caso si antes de la <i>y</i> hubiera una consonante, como en <i>try → tried</i>.',
        2: 'Le falta la <i>e</i>.',
        3: 'No existe esa forma.',
      },
    },
    {
      p: '¿Cuál de estos verbos en pasado <b>agrega una sílaba</b>?',
      opciones: ['worked', 'closed', 'needed', 'fixed'],
      correcta: 2,
      porQue: '<b>need</b> ya termina en <i>d</i>, así que el <i>-ed</i> necesita una vocal para ser audible: "NII-did".',
      porQueNo: {
        0: '<i>worked</i> se dice "wörkt", una sola sílaba.',
        1: '<i>closed</i> se dice "klouzd", una sola sílaba.',
        3: '<i>fixed</i> se dice "fikst", una sola sílaba.',
      },
    },
    {
      p: '¿Cuál es el error típico del hispanohablante con la terminación <i>-ed</i>?',
      opciones: [
        'Comerse la terminación',
        'Pronunciarla como sílaba aparte cuando no corresponde',
        'Ponerla en verbos irregulares',
        'Confundirla con el plural',
      ],
      correcta: 1,
      porQue: 'Como en español toda terminación es sílaba, sale natural decir "fik-sed". Lo correcto es "fikst", todo pegado.',
      porQueNo: {
        0: 'Ese es el error con la <i>-s</i> de plural y de tercera persona.',
        2: 'Pasa, pero es un error de morfología, no de pronunciación.',
        3: 'No suele haber confusión entre las dos.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: ["I didn't fixed it.", "I didn't fix it.", "I don't fixed it.", "I didn't fixing it."],
      correcta: 1,
      porQue: 'Con <b>didn\'t</b>, el verbo vuelve a su forma base. El pasado se marca una sola vez, en el auxiliar.',
      porQueNo: {
        0: 'El pasado está duplicado.',
        2: '<i>don\'t</i> es presente.',
        3: 'El <i>-ing</i> no va después de <i>did</i>.',
      },
    },
    {
      p: '¿Cómo se pregunta «¿quién desplegó esto?»',
      opciones: ['Who did deployed this?', 'Who deployed this?', 'Did who deploy this?', 'Who does deployed this?'],
      correcta: 1,
      porQue: 'Cuando la palabra de pregunta <b>es el sujeto</b>, no hace falta <i>did</i>: no hay nada que invertir.',
      porQueNo: {
        0: 'Duplica el pasado y además <i>did</i> sobra.',
        2: 'El orden no funciona.',
        3: 'Mezcla presente y pasado.',
      },
    },
    {
      p: '¿Cómo se dice «hace dos días»?',
      opciones: ['ago two days', 'before two days', 'two days ago', 'since two days'],
      correcta: 2,
      porQue: '<b>ago</b> es pospuesto: va después del período. Es una de las pocas posposiciones del inglés.',
      porQueNo: {
        0: 'Es el calco del orden español, y no funciona.',
        1: '<i>before</i> necesita un punto de referencia: <i>before the deploy</i>.',
        3: '<i>since</i> marca el inicio de algo que sigue: <i>since Monday</i>.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: [
        'I have finished it yesterday.',
        'I finished it yesterday.',
        'I was finished it yesterday.',
        'I did finished it yesterday.',
      ],
      correcta: 1,
      porQue: 'Con un marcador de tiempo pasado concreto —<b>yesterday</b>, <i>last week</i>, <i>this morning</i>— siempre va past simple.',
      porQueNo: {
        0: 'El present perfect no admite marcadores de tiempo pasado concreto. Es de los errores que más se arrastran.',
        2: 'Sería voz pasiva mal armada.',
        3: '<i>did</i> enfático llevaría el verbo en base: <i>I did finish it</i>.',
      },
    },
    {
      p: '¿Cuántas formas de pasado tiene un verbo regular en inglés?',
      opciones: ['Seis, una por persona', 'Tres', 'Dos: singular y plural', 'Una sola, para todas las personas'],
      correcta: 3,
      porQue: '<b>worked</b> es igual para las seis personas. Ni siquiera existe la -s de tercera persona. Es el tiempo verbal más simple del inglés.',
      porQueNo: {
        0: 'Ese es el sistema del español.',
        1: 'Las tres son de pronunciación del <i>-ed</i>, no formas distintas.',
        2: 'Eso solo pasa con <i>to be</i>: <i>was</i> / <i>were</i>.',
      },
    },
    {
      p: '¿Qué significa <i>I was going to finish it, but the deploy broke</i>?',
      opciones: [
        'Voy a terminarlo cuando arreglen el deploy',
        'Tenía pensado terminarlo pero no pude, porque se rompió el deploy',
        'Estaba terminándolo mientras se rompía el deploy',
        'Terminé justo antes de que se rompiera',
      ],
      correcta: 1,
      porQue: '<b>was going to</b> expresa un plan <b>que no se cumplió</b>. Es la fórmula para explicar por qué algo no salió, sin sonar a excusa.',
      porQueNo: {
        0: 'Eso sería <i>I\'m going to finish it when…</i>',
        2: 'Eso sería <i>I was finishing it when the deploy broke</i>.',
        3: 'Diría lo contrario de lo que dice.',
      },
    },
    {
      p: '¿Por qué en <i>Did you go?</i> no hace falta saber que el pasado de <i>go</i> es <i>went</i>?',
      opciones: [
        'Porque go es regular',
        'Porque el pasado lo lleva did, y el verbo léxico queda en forma base',
        'Porque en preguntas no se usa el pasado',
        'Porque went solo se usa en afirmativas formales',
      ],
      correcta: 1,
      porQue: 'La marca temporal va en el primer elemento del grupo verbal. Eso baja bastante la carga de los verbos irregulares.',
      porQueNo: {
        0: '<i>go</i> es irregular: <i>go / went / gone</i>.',
        2: 'Sí se usa, pero marcado en el auxiliar.',
        3: '<i>went</i> se usa en cualquier afirmativa: <i>I went home</i>.',
      },
    },
  ],
});
