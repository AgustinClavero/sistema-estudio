/* ==========================================================================
   Inglés A1 · m06 — Present continuous
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ingles-a1',
  id: 'm06',
  titulo: 'Present continuous: ahora mismo',
  fuentes: ['cambridge-dic', 'bbc-learning-english', 'wordreference'],

  intro:
    '<p>El tiempo de lo que <b>está pasando ahora</b>. Se arma igual que en español —«estoy trabajando» ' +
    'es <i>I am working</i>— y por eso parece fácil.</p>' +
    '<p>Lo difícil es otra cosa: <b>en inglés no se puede elegir</b>. En español podés decir «trabajo ' +
    'desde casa» o «estoy trabajando desde casa» casi indistintamente. En inglés cada forma dice algo ' +
    'distinto, y usar la equivocada cambia el mensaje.</p>' +
    '<p>Y hay un grupo de verbos que <b>directamente no admite esta forma</b>. Es la parte que hay que ' +
    'saber antes de empezar a usarla.</p>',

  lecciones: [

    /* ==================================================================== */
    {
      id: 'l1',
      titulo: 'Cómo se arma',
      minutos: 8,

      simple: `
        <p>Dos piezas: <b>to be</b> conjugado + el verbo con <b>-ing</b>.</p>

        <div class="analogia">
          <span class="en" data-say>I am working</span> — estoy trabajando<br>
          <span class="en" data-say>She is testing the API</span> — está probando la API<br>
          <span class="en" data-say>They are waiting for us</span> — están esperándonos
        </div>

        <p>Como el auxiliar es <i>to be</i>, negar y preguntar funciona como en el módulo 1:
        <b>sin <i>do</i></b>.</p>

        <table>
          <tr><th></th><th>Ejemplo</th></tr>
          <tr><td>Afirmativo</td><td><span class="en" data-say>I'm working on it</span></td></tr>
          <tr><td>Negativo</td><td><span class="en" data-say>I'm not working on it</span></td></tr>
          <tr><td>Pregunta</td><td><span class="en" data-say>Are you working on it?</span></td></tr>
          <tr><td>Respuesta corta</td><td><span class="en" data-say>Yes, I am</span> / <span class="en" data-say>No, I'm not</span></td></tr>
        </table>

        <h4>Las reglas de escritura del -ing</h4>
        <p>Tres, y todas mecánicas:</p>
        <ul>
          <li><b>Normal:</b> work → <span class="en" data-say>working</span></li>
          <li><b>Termina en -e muda → se cae:</b> write → <span class="en" data-say>writing</span>,
          make → <span class="en" data-say>making</span>, use → <span class="en" data-say>using</span></li>
          <li><b>Consonante-vocal-consonante con acento al final → se dobla:</b>
          run → <span class="en" data-say>running</span>, get → <span class="en" data-say>getting</span>,
          stop → <span class="en" data-say>stopping</span></li>
        </ul>
        <p>Ojo con la tercera: <i>open</i> no dobla (<i>opening</i>) porque el acento está en la primera
        sílaba. Solo dobla si la sílaba final es la acentuada.</p>

        <div class="aviso">
          <b>La trampa: el <i>-ing</i> no reemplaza al verbo <i>to be</i>.</b><br><br>
          ❌ <i>I working on it</i> — le falta el <i>am</i><br>
          ✅ <span class="en" data-say>I'm working on it</span><br><br>
          En español «estoy trabajando» tiene las dos piezas, y aun así esta se olvida mucho — porque
          la contracción <i>I'm</i> es tan corta que se cae al escribir rápido.
        </div>

        <h4>Lo que vas a decir con esto</h4>
        <ul>
          <li><span class="en" data-say>I'm working on the login bug.</span></li>
          <li><span class="en" data-say>She's testing it right now.</span></li>
          <li><span class="en" data-say>We're waiting for the review.</span></li>
          <li><span class="en" data-say>The build is running.</span></li>
          <li><span class="en" data-say>I'm not doing anything right now.</span></li>
        </ul>
      `,

      tecnico: `
        <p>La estructura es <b><i>be</i> + participio de presente</b>. El <i>-ing</i> se llama
        <i>present participle</i> cuando funciona como parte del verbo, y <i>gerund</i> cuando funciona
        como sustantivo (<i>Running is good for you</i>). Es la misma forma con dos funciones.</p>

        <p><b>Las reglas ortográficas</b>, con su lógica:</p>
        <table>
          <tr><th>Caso</th><th>Regla</th><th>Ejemplos</th></tr>
          <tr><td>General</td><td>+ ing</td><td>work → working</td></tr>
          <tr><td>Termina en -e muda</td><td>se elimina la e</td><td>write → writing, use → using</td></tr>
          <tr><td>CVC con acento final</td><td>se dobla la consonante</td><td>run → running, begin → beginning</td></tr>
          <tr><td>CVC sin acento final</td><td>no se dobla</td><td>open → opening, listen → listening</td></tr>
          <tr><td>Termina en -ie</td><td>ie → y</td><td>die → dying, lie → lying</td></tr>
        </table>

        <div class="nota-tec">
          <b>Por qué se dobla la consonante.</b> No es un capricho: es para <b>preservar la vocal corta</b>.
          En inglés, una vocal seguida de una sola consonante + vocal tiende a leerse larga
          (<i>hoping</i> /ˈhoʊpɪŋ/), y doblando la consonante se marca que sigue siendo corta
          (<i>hopping</i> /ˈhɒpɪŋ/).
          <br><br>
          <i>hope → hoping</i> (esperar) contra <i>hop → hopping</i> (saltar). Son palabras distintas,
          y la consonante doble es lo único que las separa por escrito.
        </div>

        <p><b>Sobre la variante británica.</b> En inglés británico se dobla la <i>l</i> final aunque no
        esté acentuada: <i>travel → travelling</i>, <i>cancel → cancelling</i>. En estadounidense no:
        <i>traveling</i>, <i>canceling</i>. Las dos son correctas; conviene ser consistente dentro de
        un mismo documento.</p>

        <p><b>Sobre la omisión del auxiliar.</b> Es un error muy frecuente en escritura rápida
        (Slack, comentarios de PR), y viene de que <i>I'm</i> es una sílaba mínima. Aparece sobre todo
        con sujetos largos: <i>The deploy pipeline running on the new runner</i> — le falta <i>is</i>.
        Conviene releer buscando específicamente eso.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Estructura del present continuous y reglas de escritura del -ing">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Dos piezas, siempre las dos</text>

          <g>
            <rect x="120" y="42" width="120" height="42" rx="9" fill="#34d399" opacity="0.2" stroke="#34d399" stroke-width="1.5"/>
            <text x="180" y="62" text-anchor="middle" font-size="15" font-weight="800" fill="#34d399">am / is / are</text>
            <text x="180" y="78" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.65">to be conjugado</text>

            <text x="264" y="70" text-anchor="middle" font-size="20" fill="currentColor" opacity="0.4">+</text>

            <rect x="288" y="42" width="120" height="42" rx="9" fill="#22d3ee" opacity="0.2" stroke="#22d3ee" stroke-width="1.5"/>
            <text x="348" y="62" text-anchor="middle" font-size="15" font-weight="800" fill="#22d3ee">verb + ing</text>
            <text x="348" y="78" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.65">siempre igual</text>

            <text x="432" y="70" text-anchor="middle" font-size="18" fill="currentColor" opacity="0.4">=</text>

            <rect x="456" y="42" width="180" height="42" rx="9" fill="#f59e0b" opacity="0.18" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="546" y="68" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">I am working</text>
          </g>

          <rect x="120" y="94" width="516" height="28" rx="7" fill="#f87171" opacity="0.1"/>
          <text x="378" y="113" text-anchor="middle" font-size="12" font-weight="600" fill="#f87171">
            ✗ "I working on it" — sin el am no hay frase
          </text>

          <line x1="34" y1="140" x2="646" y2="140" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="162" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">Las tres reglas de escritura</text>

          <g font-size="12.5">
            <rect x="34" y="176" width="196" height="66" rx="9" fill="currentColor" opacity="0.05" stroke="currentColor" stroke-opacity="0.15"/>
            <text x="132" y="196" text-anchor="middle" font-weight="700" fill="currentColor" opacity="0.85">normal</text>
            <text x="132" y="216" text-anchor="middle" fill="currentColor" opacity="0.8">work → working</text>
            <text x="132" y="234" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">+ ing y listo</text>

            <rect x="242" y="176" width="196" height="66" rx="9" fill="#c084fc" opacity="0.1" stroke="#c084fc" stroke-width="1.2"/>
            <text x="340" y="196" text-anchor="middle" font-weight="700" fill="#c084fc">-e muda</text>
            <text x="340" y="216" text-anchor="middle" fill="currentColor" opacity="0.85">write → writing</text>
            <text x="340" y="234" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">se cae la e</text>

            <rect x="450" y="176" width="196" height="66" rx="9" fill="#fbbf24" opacity="0.1" stroke="#fbbf24" stroke-width="1.2"/>
            <text x="548" y="196" text-anchor="middle" font-weight="700" fill="#fbbf24">CVC acentuada</text>
            <text x="548" y="216" text-anchor="middle" fill="currentColor" opacity="0.85">run → running</text>
            <text x="548" y="234" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">se dobla</text>
          </g>

          <text x="340" y="266" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">
            Se dobla para mantener la vocal corta: hope → hoping (esperar) · hop → hopping (saltar)
          </text>
        </svg>`,
        pie: 'La estructura no falla nunca. Lo que falla es olvidarse el auxiliar al escribir rápido.',
      },

      escucha: {
        intro: '<p>Fijate en el auxiliar: casi siempre viene contraído y es una sílaba mínima. ' +
               'Escribí la contracción tal como la oigas.</p>',
        items: [
          { texto: "I'm working on the login bug.", es: 'Estoy trabajando en el bug del login.',
            nota: '<b>working on</b>, con <i>on</i>. Es el bloque fijo para «trabajar en algo».' },
          { texto: "She's testing it right now.", es: 'Ella lo está probando ahora mismo.',
            nota: '<b>right now</b> refuerza el «ahora». Es la compañía típica del continuous.' },
          { texto: "We're waiting for the review.", es: 'Estamos esperando la revisión.',
            nota: '<b>wait for</b>, con <i>for</i>. En español «esperar algo» no lleva preposición; en inglés sí.' },
          { texto: "The build is running, it isn't done yet.", es: 'El build está corriendo, todavía no terminó.',
            nota: 'Dos formas de <i>to be</i> en una frase, una afirmativa y otra negativa.' },
        ],
      },

      practica: `
        <p><b>Contá qué estás haciendo, ahora mismo, en cinco frases:</b></p>
        <ol>
          <li>I'm ______ right now.</li>
          <li>I'm not ______.</li>
          <li>My team is ______.</li>
          <li>We're waiting for ______.</li>
          <li>The ______ is running.</li>
        </ol>

        <p><b>Al releerlas, buscá específicamente el auxiliar.</b> Es lo único que se olvida:
        el <i>-ing</i> nunca falta, pero el <i>am</i>/<i>is</i>/<i>are</i> sí, sobre todo cuando el
        sujeto es largo.</p>

        <p>❌ <i>The deploy pipeline running on the new runner</i> → le falta <b>is</b>.</p>

        <p><b>Y dos bloques con preposición</b> que conviene fijar ahora:</p>
        <ul>
          <li><span class="en" data-say>working on something</span> — trabajando en algo</li>
          <li><span class="en" data-say>waiting for something</span> — esperando algo</li>
        </ul>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Escribí la forma <i>-ing</i> de <b>write</b>.',
          respuesta: 'writing',
          porQue: 'Termina en <b>-e muda</b>, así que la <i>e</i> se cae. Nada de ❌ <i>writeing</i>.',
        },
        {
          tipo: 'hueco',
          p: 'Escribí la forma <i>-ing</i> de <b>run</b>.',
          respuesta: 'running',
          porQue: 'Consonante-vocal-consonante con acento al final → se dobla, para mantener la vocal corta.',
        },
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: ['I working on the bug.', "I'm working on the bug.", 'I am work on the bug.', "I'm work on the bug."],
          correcta: 1,
          porQue: 'Las dos piezas: <b>am</b> + <b>working</b>. El auxiliar es lo que más se olvida al escribir rápido.',
          porQueNo: {
            0: 'Le falta el <i>am</i>. Es el error más frecuente de esta estructura.',
            2: 'Le falta el <i>-ing</i>.',
            3: 'Mismo problema: <i>work</i> tiene que ir en <i>-ing</i>.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Estamos esperando la revisión.</b>',
          respuesta: "We're waiting for the review",
          respuestas: ['We are waiting for the review'],
          pista: '«Esperar algo» lleva preposición en inglés.',
          porQue: '<b>wait for</b>. En español «esperar la revisión» no lleva nada; en inglés siempre va <i>for</i>.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá la pregunta: «¿Estás trabajando en eso?»',
          respuesta: 'Are you working on that',
          porQue: 'Como el auxiliar es <i>to be</i>, la pregunta se arma <b>invirtiendo</b>, sin <i>do</i>.',
        },
      ],

      errores: [
        { mito: 'Con poner el verbo en <i>-ing</i> ya está: el <i>am</i> se sobreentiende.',
          realidad: 'No. ❌ <i>I working on it</i> no es una frase. El inglés necesita <b>las dos piezas</b>. ' +
                    'Se olvida mucho al escribir rápido porque <i>I\'m</i> es una sílaba mínima, y aparece sobre todo ' +
                    'con sujetos largos.' },
        { mito: 'La consonante se dobla siempre en verbos cortos.',
          realidad: 'Solo si la <b>última sílaba está acentuada</b>. <i>run → running</i> (una sílaba, acentuada), ' +
                    'pero <i>open → opening</i> (acento en la primera). Y es para preservar la vocal corta: ' +
                    '<i>hope → hoping</i> contra <i>hop → hopping</i>.' },
        { mito: '«Esperar la revisión» es <i>waiting the review</i>.',
          realidad: 'Va <b>waiting <i>for</i> the review</b>. Es de las preposiciones que el español no tiene y ' +
                    'que se olvidan sistemáticamente. Igual que <i>working <b>on</b> something</i>.' },
      ],

      glosario: [
        { t: 'Present continuous', d: '<i>be</i> + verbo en <i>-ing</i>. Expresa lo que está pasando ahora.' },
        { t: 'Participio de presente', d: 'La forma <i>-ing</i> cuando es parte del verbo. La misma forma es «gerundio» cuando funciona como sustantivo.' },
        { t: 'Working on', d: 'Trabajando en algo. Siempre con <i>on</i>.' },
        { t: 'Waiting for', d: 'Esperando algo. Siempre con <i>for</i>, aunque en español no lleve preposición.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l2',
      titulo: 'Simple o continuous: la decisión',
      minutos: 9,

      simple: `
        <p>Acá está el corazón del módulo. Las dos frases existen y <b>dicen cosas distintas</b>:</p>

        <div class="analogia">
          <span class="en" data-say>I work from home</span> — trabajo desde casa. Es mi situación habitual.<br>
          <span class="en" data-say>I'm working from home</span> — estoy trabajando desde casa. Hoy, o esta semana.
        </div>

        <p>La primera describe <b>cómo son las cosas</b>. La segunda, <b>qué está pasando ahora</b> —
        y sugiere que es temporal.</p>

        <table>
          <tr><th>Present simple</th><th>Present continuous</th></tr>
          <tr><td>rutinas y hábitos</td><td>ahora mismo</td></tr>
          <tr><td>hechos permanentes</td><td>situaciones temporales</td></tr>
          <tr><td>cómo funciona algo</td><td>qué está pasando</td></tr>
          <tr><td><i>I work at a startup</i></td><td><i>I'm working on a new feature</i></td></tr>
          <tr><td><i>The API returns JSON</i></td><td><i>The API is returning 500s</i></td></tr>
        </table>

        <div class="aviso">
          <b>Ese último par vale por toda la lección.</b><br><br>
          <span class="en" data-say>The API returns JSON</span> — así funciona. Es <b>documentación</b>.<br>
          <span class="en" data-say>The API is returning 500s</span> — está pasando ahora, no debería.
          Es un <b>incidente</b>.<br><br>
          Si reportás un problema en present simple, suena a que siempre fue así por diseño.
        </div>

        <h4>Las palabras que acompañan a cada uno</h4>
        <ul>
          <li><b>Simple:</b> always, usually, never, every day, on Mondays</li>
          <li><b>Continuous:</b> now, right now, at the moment, today, this week, currently</li>
        </ul>
        <p>Si la frase lleva <i>right now</i> o <i>at the moment</i>, casi seguro va continuous.
        Si lleva <i>always</i> o <i>every day</i>, casi seguro simple.</p>

        <h4>Por qué esto cuesta viniendo del español</h4>
        <p>Porque en español el presente simple <b>cubre las dos cosas</b>. «¿Qué hacés?» puede
        significar «¿a qué te dedicás?» o «¿qué estás haciendo ahora?». En inglés son dos preguntas
        distintas y no se pueden confundir:</p>
        <ul>
          <li><span class="en" data-say>What do you do?</span> — ¿a qué te dedicás?</li>
          <li><span class="en" data-say>What are you doing?</span> — ¿qué estás haciendo?</li>
        </ul>
        <p>Contestar la profesión a la segunda pregunta es un clásico de los primeros meses.</p>
      `,

      tecnico: `
        <p>La oposición es <b>aspectual</b>, no temporal: las dos formas hablan del presente, pero lo
        conciben de manera distinta.</p>

        <ul>
          <li><b>Present simple → aspecto no progresivo.</b> Presenta la situación como un todo cerrado:
          un hecho, una propiedad, una rutina.</li>
          <li><b>Present continuous → aspecto progresivo.</b> Presenta la situación <b>en desarrollo</b>,
          vista desde adentro, sin sus límites.</li>
        </ul>

        <div class="nota-tec">
          <b>Por qué el español confunde.</b> El español también tiene perífrasis progresiva
          («estoy trabajando»), pero <b>no es obligatoria</b>: el presente simple puede cubrir el
          valor progresivo sin problema («¿qué hacés?» = «¿qué estás haciendo?»).
          <br><br>
          En inglés la distinción es <b>gramaticalizada</b>: elegir mal no suena raro, dice otra cosa.
          Ese es el salto conceptual del módulo.
        </div>

        <p><b>Los tres valores del continuous</b>, más allá del «ahora mismo»:</p>
        <table>
          <tr><th>Valor</th><th>Ejemplo</th></tr>
          <tr><td>En este momento</td><td><i>I'm reading the docs.</i></td></tr>
          <tr><td>Período temporal extendido</td><td><i>I'm working on the auth module this sprint.</i></td></tr>
          <tr><td>Plan futuro ya agendado</td><td><i>I'm meeting the client on Friday.</i></td></tr>
        </table>

        <p>El segundo es el más útil en trabajo: no significa que estés tecleando en este instante,
        sino que <b>es tu foco actual</b>. Es exactamente lo que se dice en un standup.</p>

        <p>El tercero sorprende: el continuous se usa para <b>futuro con arreglo previo</b>.
        <i>I'm meeting the client on Friday</i> no es ahora — es un plan cerrado, con fecha.
        Lo vemos con más detalle en el módulo 9.</p>

        <p><b>Un uso adicional que conviene reconocer:</b> continuous + <i>always</i> expresa
        irritación o exageración.</p>
        <ul>
          <li><i>The build is always failing.</i> — «el build falla todo el tiempo» (queja)</li>
          <li><i>He's always asking for changes.</i> — «siempre está pidiendo cambios» (fastidio)</li>
        </ul>
        <p>Contradice la regla de que <i>always</i> va con simple, y justamente por eso funciona:
        el desajuste es lo que carga la connotación.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparación entre present simple y present continuous">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">La misma situación, dos lecturas</text>

          <rect x="34" y="38" width="290" height="132" rx="10" fill="#34d399" opacity="0.09" stroke="#34d399" stroke-width="1.3"/>
          <text x="179" y="60" text-anchor="middle" font-size="13" font-weight="800" fill="#34d399">PRESENT SIMPLE</text>
          <text x="179" y="78" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">cómo son las cosas</text>

          <g stroke="#34d399" stroke-width="2.5" opacity="0.6">
            <line x1="60" y1="100" x2="298" y2="100"/>
          </g>
          <g fill="#34d399" opacity="0.7">
            <circle cx="80" cy="100" r="4"/><circle cx="128" cy="100" r="4"/><circle cx="176" cy="100" r="4"/>
            <circle cx="224" cy="100" r="4"/><circle cx="272" cy="100" r="4"/>
          </g>
          <text x="179" y="122" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">se repite, es estable</text>

          <text x="179" y="146" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">I work from home</text>
          <text x="179" y="163" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">The API returns JSON</text>

          <rect x="356" y="38" width="290" height="132" rx="10" fill="#22d3ee" opacity="0.09" stroke="#22d3ee" stroke-width="1.3"/>
          <text x="501" y="60" text-anchor="middle" font-size="13" font-weight="800" fill="#22d3ee">PRESENT CONTINUOUS</text>
          <text x="501" y="78" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">qué está pasando</text>

          <line x1="382" y1="100" x2="620" y2="100" stroke="currentColor" opacity="0.2" stroke-width="1.5" stroke-dasharray="4 4"/>
          <rect x="440" y="92" width="120" height="16" rx="4" fill="#22d3ee" opacity="0.55"/>
          <text x="500" y="86" text-anchor="middle" font-size="10.5" fill="#22d3ee" font-weight="700">ahora</text>
          <text x="501" y="122" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">en curso, temporal</text>

          <text x="501" y="146" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">I'm working from home</text>
          <text x="501" y="163" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">The API is returning 500s</text>

          <rect x="34" y="184" width="612" height="46" rx="9" fill="#f59e0b" opacity="0.11" stroke="#f59e0b" stroke-width="1.3"/>
          <text x="340" y="204" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f59e0b">El par que resume todo</text>
          <text x="340" y="222" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">
            "returns JSON" = documentación · "is returning 500s" = incidente
          </text>

          <text x="340" y="252" text-anchor="middle" font-size="12.5" font-weight="700" fill="currentColor">Las palabras que delatan cuál va</text>
          <g font-size="12">
            <text x="179" y="274" text-anchor="middle" fill="#34d399">always · usually · never · every day</text>
            <text x="501" y="274" text-anchor="middle" fill="#22d3ee">right now · at the moment · today · currently</text>
          </g>
          <text x="340" y="292" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.6">
            En español el presente simple cubre las dos. En inglés no.
          </text>
        </svg>`,
        pie: 'No es cuestión de sonar mejor: elegir mal comunica algo distinto.',
      },

      escucha: {
        intro: '<p>Pares mínimos de significado. Escuchá cuál de las dos formas se usa ' +
               'y pensá por qué.</p>',
        items: [
          { texto: 'I work from home, but this week I am working from the office.', es: 'Trabajo desde casa, pero esta semana estoy trabajando desde la oficina.',
            nota: 'Las dos en una frase: la primera es lo habitual, la segunda lo temporal.' },
          { texto: 'The API is returning 500s right now.', es: 'La API está devolviendo 500 ahora mismo.',
            nota: 'Continuous porque es un <b>incidente</b>. En simple sonaría a que siempre fue así.' },
          { texto: 'What are you working on?', es: '¿En qué estás trabajando?',
            nota: 'La pregunta más frecuente de un standup. Continuous porque pregunta por el foco actual.' },
          { texto: 'What do you do?', es: '¿A qué te dedicás?',
            nota: 'La misma pregunta en simple significa otra cosa completamente: pregunta por tu profesión.' },
        ],
      },

      practica: `
        <p><b>Elegí el tiempo correcto</b> en cada situación, en voz alta:</p>
        <ol>
          <li>Explicás qué hace tu empresa. → simple o continuous?</li>
          <li>Reportás que el deploy está fallando ahora. → ?</li>
          <li>Contás en el standup en qué estás esta semana. → ?</li>
          <li>Documentás qué devuelve un endpoint. → ?</li>
          <li>Decís que hoy estás desde la oficina, aunque normalmente no. → ?</li>
        </ol>
        <p><i>(simple · continuous · continuous · simple · continuous)</i></p>

        <p><b>El test rápido:</b> preguntate «¿esto es <b>cómo son las cosas</b>, o <b>qué está pasando</b>?»
        Si podés agregar <i>right now</i> o <i>this week</i> sin que suene raro, va continuous.</p>

        <p><b>Y no confundas las dos preguntas:</b></p>
        <ul>
          <li><span class="en" data-say>What do you do?</span> → «Soy desarrollador.»</li>
          <li><span class="en" data-say>What are you doing?</span> → «Estoy revisando un PR.»</li>
        </ul>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'La API está devolviendo errores 500 en este momento. ¿Cómo lo reportás?',
          opciones: [
            'The API returns 500s.',
            'The API is returning 500s.',
            'The API return 500s.',
            'The API returning 500s.',
          ],
          correcta: 1,
          porQue: 'Es un <b>incidente en curso</b> → continuous. En simple sonaría a que siempre devolvió 500 por diseño.',
          porQueNo: {
            0: 'Suena a documentación: «así funciona la API».',
            2: 'Le falta la -s del present simple, y además el tiempo tampoco corresponde.',
            3: 'Le falta el auxiliar <i>is</i>.',
          },
        },
        {
          tipo: 'opcion',
          p: 'Te preguntan <span class="en" data-say>What do you do?</span> ¿Qué contestás?',
          opciones: [
            "I'm reviewing a PR.",
            "I'm a developer.",
            "I'm working right now.",
            'I do my tasks.',
          ],
          correcta: 1,
          porQue: '<b>What do you do?</b> pregunta por tu <b>profesión</b>, no por el momento. Para eso está <i>What are you doing?</i>',
          porQueNo: {
            0: 'Esa es la respuesta a <i>What are you doing?</i>',
            2: 'Contesta al momento, no a la ocupación.',
            3: 'Es gramatical pero no contesta nada.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá con <b>work</b> en el tiempo correcto: <b>I usually ______ from home.</b>',
          respuesta: 'work',
          porQue: '<b>usually</b> marca rutina → present simple, y con <i>I</i> no lleva -s.',
        },
        {
          tipo: 'hueco',
          p: 'Completá con <b>work</b>: <b>This week I ______ from the office.</b> (usá la contracción con am)',
          respuesta: "am working",
          respuestas: ["'m working", 'am working'],
          porQue: '<b>this week</b> marca una situación temporal → continuous.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá la pregunta del standup: «¿En qué estás trabajando?»',
          respuesta: 'What are you working on',
          porQue: 'Continuous porque pregunta por el <b>foco actual</b>. Y <i>working <b>on</b></i>, con la preposición al final.',
        },
      ],

      errores: [
        { mito: 'Present simple y continuous son intercambiables, es cuestión de estilo.',
          realidad: 'Dicen cosas distintas. <i>The API returns JSON</i> es <b>documentación</b>; ' +
                    '<i>The API is returning 500s</i> es un <b>incidente</b>. Reportar un problema en present simple ' +
                    'suena a que siempre fue así por diseño.' },
        { mito: '<i>What do you do?</i> y <i>What are you doing?</i> preguntan lo mismo.',
          realidad: 'La primera pregunta por tu <b>profesión</b>, la segunda por lo que estás <b>haciendo ahora</b>. ' +
                    'En español «¿qué hacés?» cubre las dos, y por eso este error es tan común en los primeros meses.' },
        { mito: 'Si algo pasa ahora, siempre va continuous.',
          realidad: 'Casi siempre, pero hay verbos que <b>no admiten continuous</b> ni aunque estén pasando ahora: ' +
                    '<i>I know</i>, <i>I need</i>, <i>I want</i>. Es el tema de la lección siguiente.' },
      ],

      glosario: [
        { t: 'Aspecto', d: 'Cómo se concibe una situación: cerrada (simple) o en desarrollo (continuous). No tiene que ver con cuándo pasa.' },
        { t: 'At the moment / currently', d: 'Marcadores típicos del continuous. Si aparecen, casi seguro va esa forma.' },
        { t: 'What are you working on?', d: 'La pregunta más frecuente de un standup. Pregunta por tu foco actual.' },
        { t: 'Continuous + always', d: '<i>The build is always failing</i>. Expresa queja o exageración, no rutina.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l3',
      titulo: 'Los verbos que no admiten -ing',
      minutos: 8,

      simple: `
        <p>Hay un grupo de verbos que <b>no van en continuous</b>, ni aunque la situación esté pasando
        ahora mismo. Se llaman <b>verbos de estado</b>.</p>

        <div class="aviso">
          ❌ <i>I am knowing the answer</i> → ✅ <span class="en" data-say>I know the answer</span><br>
          ❌ <i>I am needing help</i> → ✅ <span class="en" data-say>I need help</span><br>
          ❌ <i>I am wanting to ask</i> → ✅ <span class="en" data-say>I want to ask</span><br>
          ❌ <i>I am agreeing</i> → ✅ <span class="en" data-say>I agree</span>
        </div>

        <h4>Los que más vas a usar</h4>
        <table>
          <tr><th>Grupo</th><th>Verbos</th></tr>
          <tr><td>Pensamiento</td><td>know, think (=opinar), believe, understand, remember, forget</td></tr>
          <tr><td>Emoción</td><td>like, love, hate, want, need, prefer</td></tr>
          <tr><td>Sentidos</td><td>see, hear, smell, taste</td></tr>
          <tr><td>Posesión</td><td>have (=tener), own, belong</td></tr>
          <tr><td>Ser / parecer</td><td>be, seem, look (=parecer), mean</td></tr>
          <tr><td>Otros</td><td>agree, depend, cost, matter</td></tr>
        </table>

        <p><b>La lógica:</b> describen <b>estados</b>, no acciones. Un estado no está «en progreso»:
        simplemente es. Sabés algo o no lo sabés — no podés estar sabiéndolo.</p>

        <h4>Los que cambian de significado</h4>
        <p>Algunos verbos admiten las dos formas, con sentidos distintos:</p>
        <table>
          <tr><th>Estado (simple)</th><th>Acción (continuous)</th></tr>
          <tr><td><i>I think it's a bug</i> — opino</td><td><i>I'm thinking about it</i> — lo estoy pensando</td></tr>
          <tr><td><i>I have two monitors</i> — tengo</td><td><i>I'm having lunch</i> — estoy almorzando</td></tr>
          <tr><td><i>It looks fine</i> — parece</td><td><i>I'm looking at it</i> — lo estoy mirando</td></tr>
          <tr><td><i>I see the problem</i> — lo veo/entiendo</td><td><i>I'm seeing a doctor</i> — voy a un médico</td></tr>
        </table>

        <p><b>El caso de <i>think</i> es el más útil:</b></p>
        <ul>
          <li><span class="en" data-say>I think we should refactor this</span> — mi opinión</li>
          <li><span class="en" data-say>I'm thinking about how to fix it</span> — proceso mental en curso</li>
        </ul>

        <div class="aviso">
          <b>La excepción famosa:</b> <span class="en" data-say>I'm loving it</span>.<br>
          Gramaticalmente «incorrecta», pero se usa muchísimo en habla informal para enfatizar
          algo puntual y temporal. Reconocela, pero en un contexto profesional escribí <i>I love it</i>.
        </div>
      `,

      tecnico: `
        <p>La distinción se llama <b>estativo</b> contra <b>dinámico</b> (o <i>stative</i> / <i>dynamic</i>),
        y es una propiedad léxica del verbo — parte de lo que significa.</p>

        <ul>
          <li><b>Dinámicos:</b> describen procesos con desarrollo interno. Admiten progresivo.
          <i>run</i>, <i>write</i>, <i>build</i>, <i>test</i>.</li>
          <li><b>Estativos:</b> describen estados sin fases internas. El progresivo no tiene qué mostrar.
          <i>know</i>, <i>own</i>, <i>belong</i>, <i>seem</i>.</li>
        </ul>

        <div class="nota-tec">
          <b>El test de la pregunta.</b> Un verbo es dinámico si tiene sentido preguntar
          «¿qué estás haciendo?» y contestar con él.
          <br><br>
          — <i>What are you doing?</i> — <i>I'm writing tests.</i> ✅ dinámico
          <br>— <i>What are you doing?</i> — <i>I'm knowing the answer.</i> ❌ estativo
          <br><br>
          Es un test rápido que funciona en la enorme mayoría de los casos.
        </div>

        <p><b>La ambigüedad estado/acción</b> es sistemática y vale la pena entenderla, porque
        aparece en varios verbos frecuentes:</p>
        <table>
          <tr><th>Verbo</th><th>Estativo</th><th>Dinámico</th></tr>
          <tr><td>think</td><td>opinar</td><td>reflexionar</td></tr>
          <tr><td>have</td><td>poseer</td><td>experimentar (have lunch, have a meeting)</td></tr>
          <tr><td>see</td><td>percibir, entender</td><td>visitar, salir con alguien</td></tr>
          <tr><td>taste</td><td>saber a</td><td>probar</td></tr>
          <tr><td>be</td><td>ser</td><td>comportarse (<i>You're being difficult</i>)</td></tr>
        </table>

        <p>Fijate en <i>have</i>: <i>I'm having a meeting at three</i> es perfectamente correcto,
        porque ahí <i>have</i> no es «poseer» sino «participar en». Es de los que más aparece en
        contexto laboral.</p>

        <p><b>Sobre <i>I'm loving it</i>.</b> El progresivo con verbos estativos existe y crece:
        marca <b>temporalidad e intensidad</b>. <i>I'm loving this sprint</i> sugiere entusiasmo
        puntual, no un amor permanente. Es habla informal — reconocerla sirve, usarla en un mail
        de trabajo no.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Verbos de estado contra verbos de acción y los que cambian de significado">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Estados contra acciones</text>

          <rect x="34" y="38" width="290" height="118" rx="10" fill="#c084fc" opacity="0.09" stroke="#c084fc" stroke-width="1.3"/>
          <text x="179" y="60" text-anchor="middle" font-size="13" font-weight="800" fill="#c084fc">ESTADOS · sin -ing</text>
          <g font-size="12" fill="currentColor" opacity="0.85">
            <text x="52" y="84">know · think (opinar) · believe</text>
            <text x="52" y="104">want · need · like · prefer</text>
            <text x="52" y="124">have (tener) · seem · agree</text>
          </g>
          <text x="179" y="146" text-anchor="middle" font-size="11.5" fill="#c084fc">no tienen «en progreso»: simplemente son</text>

          <rect x="356" y="38" width="290" height="118" rx="10" fill="#22d3ee" opacity="0.09" stroke="#22d3ee" stroke-width="1.3"/>
          <text x="501" y="60" text-anchor="middle" font-size="13" font-weight="800" fill="#22d3ee">ACCIONES · con -ing</text>
          <g font-size="12" fill="currentColor" opacity="0.85">
            <text x="374" y="84">work · write · test · build</text>
            <text x="374" y="104">run · wait · review · deploy</text>
            <text x="374" y="124">read · fix · check · deploy</text>
          </g>
          <text x="501" y="146" text-anchor="middle" font-size="11.5" fill="#22d3ee">tienen desarrollo: se pueden estar haciendo</text>

          <rect x="34" y="168" width="612" height="34" rx="8" fill="#34d399" opacity="0.1" stroke="#34d399" stroke-width="1.2"/>
          <text x="340" y="189" text-anchor="middle" font-size="12" font-weight="600" fill="#34d399">
            El test: ¿tiene sentido contestarlo a "What are you doing?"
          </text>

          <text x="340" y="226" text-anchor="middle" font-size="13" font-weight="700" fill="#f59e0b">Y los que cambian de significado</text>

          <g font-size="12">
            <rect x="34" y="238" width="300" height="42" rx="8" fill="currentColor" opacity="0.05"/>
            <text x="50" y="256" fill="currentColor" opacity="0.85">I <tspan font-weight="700">think</tspan> it's a bug</text>
            <text x="50" y="272" font-size="11" fill="currentColor" opacity="0.6">= mi opinión</text>

            <rect x="346" y="238" width="300" height="42" rx="8" fill="#22d3ee" opacity="0.09"/>
            <text x="362" y="256" fill="currentColor" opacity="0.85">I'm <tspan font-weight="700" fill="#22d3ee">thinking</tspan> about it</text>
            <text x="362" y="272" font-size="11" fill="currentColor" opacity="0.6">= lo estoy pensando ahora</text>
          </g>
        </svg>`,
        pie: 'Los estados no van en -ing. Y varios verbos cambian de bando según lo que signifiquen.',
      },

      escucha: {
        intro: '<p>Fijate cuáles van en simple aunque estén pasando ahora, y cuáles cambian ' +
               'de sentido según la forma.</p>',
        items: [
          { texto: "I don't know the answer, but I'm looking into it.", es: 'No sé la respuesta, pero lo estoy investigando.',
            nota: '<b>know</b> es estado → simple. <b>look into</b> es acción → continuous. Las dos en una frase.' },
          { texto: 'I think we should refactor this.', es: 'Creo que deberíamos refactorizar esto.',
            nota: '<b>think</b> como opinión va en simple. ❌ <i>I\'m thinking we should</i> suena a que todavía lo estás decidiendo.' },
          { texto: "I'm having a meeting at three.", es: 'Tengo una reunión a las tres.',
            nota: 'Acá <b>have</b> no es «poseer» sino «participar en», así que sí admite continuous.' },
          { texto: 'I need help with this, it depends on the config.', es: 'Necesito ayuda con esto, depende de la configuración.',
            nota: '<b>need</b> y <b>depend</b> son estados: siempre en simple.' },
        ],
      },

      practica: `
        <p><b>Usá el test</b>: ¿tiene sentido contestar con este verbo a «what are you doing?»</p>
        <ul>
          <li><i>write</i> → «I'm writing tests» ✅ tiene sentido</li>
          <li><i>know</i> → «I'm knowing the answer» ❌ no tiene sentido</li>
        </ul>

        <p><b>Los seis que más vas a usar mal</b>, porque en español sí admiten «estar + gerundio»:</p>
        <ul>
          <li>❌ I'm knowing → ✅ <span class="en" data-say>I know</span></li>
          <li>❌ I'm needing → ✅ <span class="en" data-say>I need</span></li>
          <li>❌ I'm wanting → ✅ <span class="en" data-say>I want</span></li>
          <li>❌ I'm understanding → ✅ <span class="en" data-say>I understand</span></li>
          <li>❌ I'm agreeing → ✅ <span class="en" data-say>I agree</span></li>
          <li>❌ It's depending on → ✅ <span class="en" data-say>It depends on</span></li>
        </ul>

        <p><b>Y el par de <i>think</i></b>, que es el que más se aprovecha en el trabajo:</p>
        <ul>
          <li><span class="en" data-say>I think we should wait</span> — tengo esa opinión</li>
          <li><span class="en" data-say>I'm still thinking about it</span> — todavía no decidí</li>
        </ul>
        <p>La segunda es utilísima para ganar tiempo sin comprometerte.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: ["I'm knowing the answer.", 'I know the answer.', "I'm know the answer.", 'I knowing the answer.'],
          correcta: 1,
          porQue: '<b>know</b> es un verbo de estado: no admite continuous ni aunque el estado sea actual.',
          porQueNo: {
            0: 'Los estados no tienen desarrollo interno, así que no pueden estar «en progreso».',
            2: 'Mezcla el auxiliar con la forma base.',
            3: 'Le falta el auxiliar y además el verbo no admite -ing.',
          },
        },
        {
          tipo: 'opcion',
          p: 'Querés dar tu opinión sobre una decisión técnica. ¿Cuál va?',
          opciones: [
            "I'm thinking we should refactor this.",
            'I think we should refactor this.',
            "I'm think we should refactor this.",
            'I thinking we should refactor this.',
          ],
          correcta: 1,
          porQue: '<b>think</b> como «opinar» es estado → simple. En continuous significaría que todavía lo estás decidiendo.',
          porQueNo: {
            0: 'Gramatical, pero comunica «lo estoy considerando», no «esta es mi opinión».',
            2: 'Mal armada.',
            3: 'Le falta el auxiliar.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá con <b>need</b>: <b>I ______ help with this.</b>',
          respuesta: 'need',
          porQue: '<b>need</b> es estado: siempre simple, aunque lo necesites ahora mismo.',
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Tengo una reunión a las tres.</b> (usando have en continuous)',
          respuesta: "I'm having a meeting at three",
          respuestas: ['I am having a meeting at three'],
          pista: 'Acá have no es «poseer».',
          porQue: 'Cuando <b>have</b> significa «participar en» (una reunión, un almuerzo) sí admite continuous.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «No sé, todavía lo estoy pensando.»',
          respuesta: "I don't know, I'm still thinking about it",
          porQue: 'Los dos usos de la lección juntos: <b>know</b> en simple (estado) y <b>thinking about</b> en continuous (proceso).',
        },
      ],

      errores: [
        { mito: 'Si en español puedo decir «estoy necesitando», en inglés también.',
          realidad: '<b>need</b>, <b>know</b>, <b>want</b>, <b>understand</b> y <b>agree</b> son verbos de estado: ' +
                    'no van en continuous. El español es mucho más permisivo con la perífrasis progresiva. ' +
                    'Va <i>I need help</i>, no ❌ <i>I\'m needing help</i>.' },
        { mito: '<i>have</i> nunca va en continuous porque es un verbo de estado.',
          realidad: 'Depende de qué signifique. Como «poseer» no: ❌ <i>I\'m having two monitors</i>. ' +
                    'Como «participar en» sí: ✅ <i>I\'m having a meeting</i>, <i>I\'m having lunch</i>. ' +
                    'Es de los que más aparece en contexto laboral.' },
        { mito: '<i>I\'m loving it</i> demuestra que la regla no existe.',
          realidad: 'Es un uso <b>informal y marcado</b>: el progresivo con un estativo agrega temporalidad e intensidad. ' +
                    'Funciona justamente porque rompe la regla. Reconocelo al escuchar; en un mail de trabajo ' +
                    'escribí <i>I love it</i>.' },
      ],

      glosario: [
        { t: 'Verbo de estado', d: 'Describe un estado, no un proceso. No admite continuous: know, need, want, seem, agree.' },
        { t: 'Verbo dinámico', d: 'Describe un proceso con desarrollo. Admite continuous: work, write, test, wait.' },
        { t: 'Think', d: 'Como «opinar» va en simple; como «reflexionar» va en continuous. <i>I think</i> contra <i>I\'m thinking about it</i>.' },
        { t: 'Look into', d: 'Investigar, revisar a fondo. <i>I\'m looking into it</i> es la respuesta estándar a un problema reportado.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l4',
      titulo: 'El standup en continuous',
      minutos: 9,

      simple: `
        <p>El present continuous es <b>el tiempo del standup</b>. Todo lo que contás sobre en qué
        estás va en esta forma.</p>

        <h4>La estructura de un standup</h4>
        <p>Tres partes, siempre las mismas:</p>
        <ol>
          <li><b>Qué hiciste ayer</b> — pasado (módulo 7)</li>
          <li><b>En qué estás hoy</b> — <b>continuous</b></li>
          <li><b>Qué te bloquea</b> — <i>to be</i> (módulo 1)</li>
        </ol>

        <div class="analogia">
          <span class="en" data-say>Yesterday I finished the login form. Today I'm working on the API integration. I'm not blocked.</span>
        </div>
        <p>Eso es un standup completo. Tres frases.</p>

        <h4>Frases para la parte de «hoy»</h4>
        <ul>
          <li><span class="en" data-say>I'm working on the auth module.</span></li>
          <li><span class="en" data-say>I'm still fixing the bug from yesterday.</span></li>
          <li><span class="en" data-say>I'm reviewing two PRs today.</span></li>
          <li><span class="en" data-say>I'm waiting for the design.</span></li>
          <li><span class="en" data-say>I'm looking into the failing tests.</span></li>
          <li><span class="en" data-say>I'm picking up the ticket about notifications.</span></li>
        </ul>

        <h4>Y para bloqueos</h4>
        <ul>
          <li><span class="en" data-say>I'm blocked on the API keys.</span></li>
          <li><span class="en" data-say>I'm waiting for a review.</span></li>
          <li><span class="en" data-say>I'm not blocked, everything is fine.</span></li>
        </ul>

        <div class="aviso">
          <b><i>still</i> es la palabra clave del standup.</b> Significa «todavía» y va antes del verbo
          principal:<br><br>
          <span class="en" data-say>I'm still working on it</span> — sigo en eso<br>
          <span class="en" data-say>It's still failing</span> — sigue fallando<br><br>
          Te salva cuando llevás tres días con la misma tarea: <i>still</i> lo dice sin sonar a excusa.
        </div>

        <h4>Un bonus: el continuous como futuro</h4>
        <p>Cuando algo ya está <b>agendado</b>, se usa continuous aunque sea futuro:</p>
        <ul>
          <li><span class="en" data-say>I'm meeting the client on Friday.</span></li>
          <li><span class="en" data-say>We're deploying tomorrow morning.</span></li>
          <li><span class="en" data-say>I'm taking Monday off.</span></li>
        </ul>
        <p>No es un plan vago: es algo que ya tiene fecha. Lo vemos completo en el módulo 9.</p>
      `,

      tecnico: `
        <p><b>Por qué el standup es continuous.</b> Porque la pregunta es <i>What are you working on?</i>
        — pregunta por el <b>foco actual</b>, no por una rutina. El aspecto progresivo presenta la tarea
        como en curso e inconclusa, que es exactamente el estado de una tarea en un sprint.</p>

        <div class="nota-tec">
          <b>El matiz que importa.</b>
          <br><i>I work on the auth module</i> → suena a que ese es tu rol permanente.
          <br><i>I'm working on the auth module</i> → es tu tarea de este sprint.
          <br><br>
          En un standup la segunda es la correcta, y la diferencia se nota.
        </div>

        <p><b>Vocabulario de standup</b>, ordenado por utilidad real:</p>
        <table>
          <tr><th>Expresión</th><th>Significa</th></tr>
          <tr><td>I'm picking up X</td><td>voy a tomar la tarea X</td></tr>
          <tr><td>I'm looking into X</td><td>estoy investigando X</td></tr>
          <tr><td>I'm still on X</td><td>sigo con X</td></tr>
          <tr><td>I'm wrapping up X</td><td>estoy terminando X</td></tr>
          <tr><td>I'm blocked on X</td><td>estoy trabado por X</td></tr>
          <tr><td>It's in review</td><td>está en revisión</td></tr>
          <tr><td>I'll pair with X on it</td><td>lo voy a hacer en pareja con X</td></tr>
          <tr><td>No blockers</td><td>sin bloqueos</td></tr>
        </table>

        <p><b>Sobre <i>still</i>.</b> Va inmediatamente antes del verbo léxico, después del auxiliar:
        <i>I'm <b>still</b> working</i>, <i>It's <b>still</b> failing</i>. Es el mismo lugar que los
        adverbios de frecuencia del módulo 3.</p>

        <p><b>Sobre el registro del standup.</b> Es de los contextos más informales y formulaicos del
        trabajo: frases cortas, sin subordinadas, mucha elipsis. <i>Working on the API today, no
        blockers</i> es perfectamente aceptable — hasta se omite el sujeto, que es de las pocas
        situaciones donde el inglés lo permite.</p>

        <p><b>Sobre el continuous con valor de futuro.</b> Requiere <b>arreglo previo</b>: hay una
        fecha, una invitación en el calendario, algo concreto. Por eso <i>I'm meeting the client on
        Friday</i> funciona y <i>I'm being tired tomorrow</i> no. Es la diferencia con <i>going to</i>,
        que sirve para intenciones sin agenda.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Estructura de tres partes de un standup y qué tiempo verbal usa cada una">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Un standup son tres frases</text>

          <g>
            <rect x="34" y="40" width="196" height="118" rx="10" fill="#c084fc" opacity="0.1" stroke="#c084fc" stroke-width="1.3"/>
            <text x="132" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#c084fc">1 · AYER</text>
            <text x="132" y="82" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">pasado · m07</text>
            <text x="132" y="110" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.9">Yesterday I finished</text>
            <text x="132" y="127" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.9">the login form.</text>
          </g>

          <g>
            <rect x="242" y="40" width="196" height="118" rx="10" fill="#22d3ee" opacity="0.16" stroke="#22d3ee" stroke-width="1.8"/>
            <text x="340" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#22d3ee">2 · HOY</text>
            <text x="340" y="82" text-anchor="middle" font-size="11" font-weight="700" fill="#22d3ee">continuous</text>
            <text x="340" y="110" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.9">Today I'm working on</text>
            <text x="340" y="127" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.9">the API integration.</text>
            <text x="340" y="146" text-anchor="middle" font-size="10.5" fill="#22d3ee">el corazón del standup</text>
          </g>

          <g>
            <rect x="450" y="40" width="196" height="118" rx="10" fill="#f87171" opacity="0.1" stroke="#f87171" stroke-width="1.3"/>
            <text x="548" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#f87171">3 · BLOQUEOS</text>
            <text x="548" y="82" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">to be · m01</text>
            <text x="548" y="110" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.9">I'm blocked on</text>
            <text x="548" y="127" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.9">the API keys.</text>
          </g>

          <rect x="34" y="176" width="612" height="42" rx="9" fill="#f59e0b" opacity="0.11" stroke="#f59e0b" stroke-width="1.3"/>
          <text x="340" y="196" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f59e0b">"still" es la palabra que te salva</text>
          <text x="340" y="213" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">
            I'm still working on it — lo dice sin que suene a excusa
          </text>

          <rect x="34" y="228" width="612" height="52" rx="9" fill="#34d399" opacity="0.09" stroke="#34d399" stroke-width="1.2"/>
          <text x="340" y="248" text-anchor="middle" font-size="12.5" font-weight="700" fill="#34d399">Y el bonus: continuous también sirve para futuro agendado</text>
          <text x="340" y="266" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">
            I'm meeting the client on Friday · We're deploying tomorrow
          </text>
        </svg>`,
        pie: 'Cada parte del standup usa un tiempo distinto. La del medio, la más importante, va en continuous.',
      },

      escucha: {
        intro: '<p>Standups reales. Estas son las frases que vas a decir y escuchar todos los días ' +
               'si trabajás en un equipo internacional.</p>',
        items: [
          { texto: "Today I'm working on the API integration.", es: 'Hoy estoy trabajando en la integración de la API.',
            nota: 'La frase central del standup. <b>working on</b>, siempre con <i>on</i>.' },
          { texto: "I'm still fixing the bug from yesterday.", es: 'Sigo arreglando el bug de ayer.',
            nota: '<b>still</b> va antes del verbo principal. Es la palabra que te salva cuando llevás días con lo mismo.' },
          { texto: "I'm blocked on the API keys, I'm waiting for infra.", es: 'Estoy trabado por las claves de la API, estoy esperando a infra.',
            nota: 'Dos continuous: uno para el estado y otro para la espera. Y <b>waiting for</b> con <i>for</i>.' },
          { texto: "I'm wrapping up the tests, it should be in review today.", es: 'Estoy terminando los tests, debería estar en revisión hoy.',
            nota: '<b>wrap up</b> = terminar, cerrar. Muy usado en standups.' },
          { texto: "I'm meeting the client on Friday.", es: 'Me reúno con el cliente el viernes.',
            nota: 'Continuous con valor de <b>futuro agendado</b>: ya tiene fecha, no es una intención vaga.' },
        ],
      },

      practica: `
        <p><b>Escribí tu standup de mañana</b>, con lo que estés haciendo de verdad. Tres frases:</p>
        <ol>
          <li>Yesterday I ______.</li>
          <li>Today I'm ______.</li>
          <li>I'm blocked on ______. <i>(o: No blockers.)</i></li>
        </ol>

        <p>Si te trabás en la primera, es normal — el pasado lo vemos en el módulo 7. Por ahora usalo
        como fórmula fija.</p>

        <p><b>Los seis bloques que cubren casi cualquier standup:</b></p>
        <ul>
          <li><span class="en" data-say>I'm working on…</span></li>
          <li><span class="en" data-say>I'm still on…</span></li>
          <li><span class="en" data-say>I'm looking into…</span></li>
          <li><span class="en" data-say>I'm picking up…</span></li>
          <li><span class="en" data-say>I'm wrapping up…</span></li>
          <li><span class="en" data-say>I'm blocked on…</span></li>
        </ul>

        <p><b>Y una nota sobre el registro:</b> el standup es de lo más informal que hay. Frases cortas,
        sin subordinadas. Hasta se puede omitir el sujeto:
        <span class="en" data-say>Working on the API today, no blockers.</span>
        Es de las pocas situaciones donde el inglés lo permite.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'En un standup, ¿cómo decís en qué estás trabajando hoy?',
          opciones: [
            'Today I work on the API.',
            "Today I'm working on the API.",
            'Today I working on the API.',
            'Today I am work on the API.',
          ],
          correcta: 1,
          porQue: 'El standup pregunta por el <b>foco actual</b> → continuous. En simple sonaría a que ese es tu rol permanente.',
          porQueNo: {
            0: 'Gramatical, pero comunica «ese es mi trabajo siempre», no «es mi tarea de hoy».',
            2: 'Le falta el auxiliar.',
            3: 'Le falta el <i>-ing</i>.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá con «todavía»: <b>I\'m ______ fixing the bug from yesterday.</b>',
          respuesta: 'still',
          porQue: '<b>still</b> va entre el auxiliar y el verbo principal, igual que los adverbios de frecuencia del módulo 3.',
        },
        {
          tipo: 'opcion',
          p: 'Ya tenés la reunión con el cliente agendada para el viernes. ¿Cómo lo decís?',
          opciones: [
            'I meet the client on Friday.',
            "I'm meeting the client on Friday.",
            'I will meeting the client on Friday.',
            "I'm meet the client on Friday.",
          ],
          correcta: 1,
          porQue: 'El continuous sirve para <b>futuro agendado</b>: algo que ya tiene fecha y arreglo previo.',
          porQueNo: {
            0: 'El present simple para futuro se usa con horarios fijos (trenes, clases), no con reuniones puntuales.',
            2: 'Después de <i>will</i> va la forma base, no <i>-ing</i>.',
            3: 'Le falta el <i>-ing</i>.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Estoy trabado por las claves de la API.</b>',
          respuesta: "I'm blocked on the API keys",
          respuestas: ['I am blocked on the API keys'],
          pista: '«Trabado por» lleva on.',
          porQue: '<b>blocked on</b>, con <i>on</i>. Es la fórmula estándar y decirla a tiempo es lo más útil que aportás en un standup.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «Estoy terminando los tests.»',
          respuesta: "I'm wrapping up the tests",
          porQue: '<b>wrap up</b> = terminar, cerrar. Es de los verbos frasales más usados en standups.',
        },
      ],

      errores: [
        { mito: 'En el standup da igual decir <i>I work on X</i> o <i>I\'m working on X</i>.',
          realidad: 'Cambia el mensaje. <i>I work on the auth module</i> suena a que ese es tu <b>rol permanente</b>; ' +
                    '<i>I\'m working on it</i> es tu <b>tarea de este sprint</b>. En un standup corresponde la segunda.' },
        { mito: 'Decir que llevás días con la misma tarea queda mal.',
          realidad: 'Lo que queda mal es <b>no decirlo</b>. <i>I\'m still working on it</i> lo comunica sin sonar a excusa, ' +
                    'y le da al equipo la información que necesita. <i>still</i> es exactamente la palabra para eso.' },
        { mito: 'El continuous es solo para lo que pasa en este instante.',
          realidad: 'También cubre <b>períodos temporales</b> (<i>I\'m working on this sprint</i>, aunque ahora estés almorzando) ' +
                    'y <b>futuro agendado</b> (<i>I\'m meeting the client on Friday</i>). El requisito del futuro es que ' +
                    'haya arreglo previo, no que sea inminente.' },
      ],

      glosario: [
        { t: 'Still', d: 'Todavía. Va entre el auxiliar y el verbo: <i>I\'m still working on it</i>.' },
        { t: 'Pick up', d: 'Tomar una tarea. <i>I\'m picking up the notifications ticket</i>.' },
        { t: 'Look into', d: 'Investigar. La respuesta estándar cuando alguien reporta un problema.' },
        { t: 'Wrap up', d: 'Terminar, cerrar algo. <i>I\'m wrapping up the tests</i>.' },
        { t: 'Blocked on', d: 'Trabado por algo externo. Siempre con <i>on</i>.' },
        { t: 'No blockers', d: 'Sin bloqueos. La forma corta de cerrar tu turno en el standup.' },
      ],
    },
  ],

  /* ==================================================================== */
  vocabulario: [
    { en: 'working on', es: 'trabajando en', pista: 'Siempre con on.', ejemplo: "I'm working on the login bug.", ejemploEs: 'Estoy trabajando en el bug del login.' },
    { en: 'waiting for', es: 'esperando', pista: 'Siempre con for.', ejemplo: "We're waiting for the review.", ejemploEs: 'Estamos esperando la revisión.' },
    { en: 'still', es: 'todavía', pista: 'Va entre el auxiliar y el verbo.', ejemplo: "I'm still working on it.", ejemploEs: 'Sigo trabajando en eso.' },
    { en: 'right now', es: 'ahora mismo', ejemplo: "She's testing it right now.", ejemploEs: 'Lo está probando ahora mismo.' },
    { en: 'at the moment', es: 'en este momento', ejemplo: "I'm not available at the moment.", ejemploEs: 'No estoy disponible en este momento.' },
    { en: 'currently', es: 'actualmente', ejemplo: "I'm currently on another task.", ejemploEs: 'Actualmente estoy en otra tarea.' },
    { en: 'look into', es: 'investigar', ejemplo: "I'm looking into the failing tests.", ejemploEs: 'Estoy investigando los tests que fallan.' },
    { en: 'pick up', es: 'tomar (una tarea)', ejemplo: "I'm picking up the notifications ticket.", ejemploEs: 'Voy a tomar el ticket de notificaciones.' },
    { en: 'wrap up', es: 'terminar / cerrar', ejemplo: "I'm wrapping up the tests.", ejemploEs: 'Estoy terminando los tests.' },
    { en: 'review', es: 'revisión / revisar', ejemplo: "It's in review.", ejemploEs: 'Está en revisión.' },
    { en: 'test', es: 'probar', ejemplo: "She's testing the API.", ejemploEs: 'Ella está probando la API.' },
    { en: 'deploy', es: 'desplegar', ejemplo: "We're deploying tomorrow.", ejemploEs: 'Desplegamos mañana.' },
    { en: 'fix', es: 'arreglar', ejemplo: "I'm fixing the bug.", ejemploEs: 'Estoy arreglando el bug.' },
    { en: 'know', es: 'saber', pista: 'Verbo de estado: nunca en -ing.', ejemplo: "I don't know the answer.", ejemploEs: 'No sé la respuesta.' },
    { en: 'understand', es: 'entender', pista: 'Estado: nunca en -ing.', ejemplo: "I don't understand.", ejemploEs: 'No entiendo.' },
    { en: 'want', es: 'querer', pista: 'Estado: nunca en -ing.', ejemplo: 'I want to ask something.', ejemploEs: 'Quiero preguntar algo.' },
    { en: 'seem', es: 'parecer', pista: 'Estado.', ejemplo: 'It seems fine to me.', ejemploEs: 'A mí me parece bien.' },
    { en: 'matter', es: 'importar', pista: 'Estado.', ejemplo: "It doesn't matter.", ejemploEs: 'No importa.' },
    { en: 'no blockers', es: 'sin bloqueos', ejemplo: 'Working on the API today, no blockers.', ejemploEs: 'Hoy en la API, sin bloqueos.' },
    { en: 'sprint', es: 'sprint / iteración', ejemplo: "I'm on the auth module this sprint.", ejemploEs: 'Este sprint estoy en el módulo de auth.' },
    { en: 'ticket', es: 'ticket / tarea', ejemplo: "I'm picking up that ticket.", ejemploEs: 'Voy a tomar ese ticket.' },
    { en: 'pair with', es: 'trabajar en pareja con', ejemplo: "I'm pairing with Ana on this.", ejemploEs: 'Estoy trabajando en pareja con Ana en esto.' },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál está bien?',
      opciones: ['I working on the bug.', "I'm working on the bug.", 'I am work on the bug.', "I'm work on the bug."],
      correcta: 1,
      porQue: 'El continuous necesita <b>las dos piezas</b>: <i>to be</i> conjugado + verbo en <i>-ing</i>.',
      porQueNo: {
        0: 'Le falta el auxiliar. Es el error más frecuente de esta estructura, sobre todo al escribir rápido.',
        2: 'Le falta el <i>-ing</i>.',
        3: 'Mismo problema.',
      },
    },
    {
      p: '¿Cuál es la forma <i>-ing</i> de <b>run</b>?',
      opciones: ['runing', 'running', 'runnning', 'runeing'],
      correcta: 1,
      porQue: 'Consonante-vocal-consonante con acento final → se dobla la consonante, para preservar la vocal corta.',
      porQueNo: {
        0: 'Con una sola <i>n</i> la vocal se leería larga, como en <i>ruining</i>.',
        2: 'Se dobla, no se triplica.',
        3: '<i>run</i> no termina en <i>-e</i>: esa regla es para <i>write → writing</i>.',
      },
    },
    {
      p: 'La API está devolviendo errores 500 justo ahora. ¿Cómo lo reportás?',
      opciones: [
        'The API returns 500s.',
        'The API is returning 500s.',
        'The API return 500s.',
        'The API returning 500s.',
      ],
      correcta: 1,
      porQue: 'Es un <b>incidente en curso</b> → continuous. En present simple sonaría a documentación: «así funciona».',
      porQueNo: {
        0: 'Comunica que es su comportamiento normal y esperado.',
        2: 'Le falta la -s de tercera persona, y además el tiempo no corresponde.',
        3: 'Le falta el auxiliar <i>is</i>.',
      },
    },
    {
      p: 'Te preguntan <i>What do you do?</i> ¿Qué contestás?',
      opciones: ["I'm reviewing a PR.", "I'm a developer.", "I'm working right now.", 'I do my job.'],
      correcta: 1,
      porQue: '<b>What do you do?</b> pregunta por tu profesión. Para el momento actual va <i>What are you doing?</i>',
      porQueNo: {
        0: 'Esa es la respuesta a <i>What are you doing?</i>',
        2: 'También contesta al momento, no a la ocupación.',
        3: 'Es gramatical pero no informa nada.',
      },
    },
    {
      p: '¿Cuál está mal?',
      opciones: ["I'm working on it.", "I'm knowing the answer.", "I'm waiting for you.", "I'm reviewing the PR."],
      correcta: 1,
      porQue: '<b>know</b> es un verbo de estado: no admite continuous, ni aunque el estado sea actual. Va <i>I know</i>.',
      porQueNo: {
        0: '<i>work</i> es dinámico: admite continuous perfectamente.',
        2: '<i>wait</i> también es dinámico.',
        3: '<i>review</i> también.',
      },
    },
    {
      p: '¿Cuál es la diferencia entre <i>I think it\'s a bug</i> e <i>I\'m thinking about it</i>?',
      opciones: [
        'Ninguna, son intercambiables',
        'La primera es mi opinión; la segunda, que lo estoy considerando ahora',
        'La primera es formal y la segunda informal',
        'La segunda está mal: think nunca va en continuous',
      ],
      correcta: 1,
      porQue: '<b>think</b> como «opinar» es estado; como «reflexionar» es acción. El par se aprovecha mucho en el trabajo.',
      porQueNo: {
        0: 'Dicen cosas distintas.',
        2: 'No es una cuestión de registro.',
        3: 'Sí puede ir en continuous, cuando significa «reflexionar».',
      },
    },
    {
      p: '¿Cuál es correcta?',
      opciones: ["I'm having two monitors.", "I'm having a meeting at three.", "I'm having the answer.", "I'm having a car."],
      correcta: 1,
      porQue: 'Cuando <b>have</b> significa «participar en» (una reunión, un almuerzo) sí admite continuous. Como «poseer», no.',
      porQueNo: {
        0: 'Acá <i>have</i> es «poseer»: va <i>I have two monitors</i>.',
        2: '«Tener la respuesta» es posesión, va en simple.',
        3: 'Posesión otra vez.',
      },
    },
    {
      p: 'En un standup, ¿qué tiempo corresponde para contar en qué estás hoy?',
      opciones: ['Present simple', 'Present continuous', 'Pasado', 'Futuro con will'],
      correcta: 1,
      porQue: 'La pregunta es por el <b>foco actual</b>. <i>I work on the auth module</i> sonaría a rol permanente; <i>I\'m working on it</i> es la tarea del sprint.',
      porQueNo: {
        0: 'Comunica rutina o rol permanente, no tarea actual.',
        2: 'El pasado es para la parte de «ayer».',
        3: 'Para lo que va a pasar, no para lo que estás haciendo.',
      },
    },
    {
      p: '¿Dónde va <i>still</i>?',
      opciones: [
        "Still I'm working on it.",
        "I'm still working on it.",
        "I'm working still on it.",
        "I'm working on it still.",
      ],
      correcta: 1,
      porQue: 'Entre el auxiliar y el verbo principal, igual que los adverbios de frecuencia del módulo 3.',
      porQueNo: {
        0: 'Posición forzada, no se usa así.',
        2: 'No puede ir entre el verbo y su complemento.',
        3: 'Al final suena raro con <i>still</i>.',
      },
    },
    {
      p: 'Ya tenés agendada una reunión con el cliente para el viernes. ¿Cómo lo decís?',
      opciones: [
        'I meet the client on Friday.',
        "I'm meeting the client on Friday.",
        'I will meeting the client on Friday.',
        'I am meet the client on Friday.',
      ],
      correcta: 1,
      porQue: 'El continuous también sirve para <b>futuro agendado</b>: algo con fecha y arreglo previo.',
      porQueNo: {
        0: 'El simple con valor de futuro se reserva para horarios fijos (trenes, clases).',
        2: 'Después de <i>will</i> va la forma base.',
        3: 'Le falta el <i>-ing</i>.',
      },
    },
    {
      p: '¿Qué significa <i>I\'m looking into it</i>?',
      opciones: ['Lo estoy mirando por dentro', 'Lo estoy investigando', 'Estoy entrando ahí', 'Me está gustando'],
      correcta: 1,
      porQue: '<b>look into</b> = investigar, revisar a fondo. Es la respuesta estándar cuando alguien reporta un problema.',
      porQueNo: {
        0: 'Es la traducción literal, y no es lo que significa.',
        2: 'Eso sería <i>going into</i>.',
        3: 'Nada que ver.',
      },
    },
    {
      p: '¿Por qué se dobla la consonante en <i>running</i> pero no en <i>opening</i>?',
      opciones: [
        'Porque run es más corto',
        'Porque solo se dobla si la última sílaba está acentuada, para preservar la vocal corta',
        'Porque open termina en n',
        'Es una excepción sin regla',
      ],
      correcta: 1,
      porQue: 'En <i>open</i> el acento está en la primera sílaba, así que no dobla. La lógica es marcar que la vocal sigue siendo corta: <i>hope → hoping</i> contra <i>hop → hopping</i>.',
      porQueNo: {
        0: 'La longitud no es el criterio: <i>begin → beginning</i> tiene dos sílabas y sí dobla.',
        2: 'La letra final no decide: <i>run</i> también termina en n y sí dobla.',
        3: 'Sí tiene regla, y bastante consistente.',
      },
    },
  ],
});
