/* ==========================================================================
   Inglés A1 · m01 — To be: quién sos y de dónde
   El primer verbo, y el que más errores de hispanohablante concentra.
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ingles-a1',
  id: 'm01',
  titulo: 'To be: quién sos y de dónde',
  fuentes: ['cambridge-dic', 'wordreference', 'bbc-learning-english'],

  intro:
    '<p><b>To be</b> es el verbo más usado del inglés y el primero que hay que tener automático. Con él ya podés ' +
    'presentarte, decir de dónde sos, a qué te dedicás y cómo estás.</p>' +
    '<p>Tiene una particularidad que te juega a favor y otra que te juega en contra. A favor: <b>uno solo cubre ' +
    "<i>ser</i> y <i>estar</i></b>, así que te ahorrás una decisión que en español sí tenés que tomar. " +
    'En contra: es <b>irregular</b> — <i>am</i>, <i>is</i>, <i>are</i> no se parecen entre sí — y en inglés ' +
    '<b>el sujeto nunca se omite</b>, cosa que en español hacés todo el tiempo sin darte cuenta.</p>' +
    '<p>Casi todos los errores de este módulo salen de esas dos diferencias.</p>',

  lecciones: [

    /* ==================================================================== */
    {
      id: 'l1',
      titulo: 'Un verbo para ser y estar',
      minutos: 9,

      simple: `
        <p>En español tenés dos verbos y elegís entre ellos: <i>Ana <b>es</b> médica</i> (siempre) contra
        <i>Ana <b>está</b> cansada</i> (ahora). En inglés esa decisión no existe: los dos son <b>to be</b>.</p>

        <div class="analogia">
          Ana <b>es</b> médica → <span class="en" data-say>Ana is a doctor</span><br>
          Ana <b>está</b> cansada → <span class="en" data-say>Ana is tired</span>
        </div>

        <p>Una preocupación menos. Pero <i>to be</i> cambia de forma según quién sea el sujeto, y las tres formas
        no se parecen en nada:</p>

        <table>
          <tr><th>Sujeto</th><th>Verbo</th><th>Ejemplo</th></tr>
          <tr><td>I (yo)</td><td><b>am</b></td><td><span class="en" data-say>I am a developer</span></td></tr>
          <tr><td>you (vos / ustedes)</td><td><b>are</b></td><td><span class="en" data-say>You are my friend</span></td></tr>
          <tr><td>he (él)</td><td><b>is</b></td><td><span class="en" data-say>He is at home</span></td></tr>
          <tr><td>she (ella)</td><td><b>is</b></td><td><span class="en" data-say>She is a teacher</span></td></tr>
          <tr><td>it (eso)</td><td><b>is</b></td><td><span class="en" data-say>It is cold today</span></td></tr>
          <tr><td>we (nosotros)</td><td><b>are</b></td><td><span class="en" data-say>We are ready</span></td></tr>
          <tr><td>they (ellos)</td><td><b>are</b></td><td><span class="en" data-say>They are from Brazil</span></td></tr>
        </table>

        <h4>La regla que más se olvida: el sujeto va SIEMPRE</h4>
        <p>En español decís «Soy programador» y nadie necesita que aclares quién. En inglés eso no se puede:</p>
        <div class="aviso">
          ❌ <i>Am a developer</i> · ❌ <i>Is my sister</i><br>
          ✅ <span class="en" data-say>I am a developer</span> · ✅ <span class="en" data-say>She is my sister</span>
        </div>
        <p>Sin sujeto la frase no existe. Es el error número uno del hispanohablante en sus primeros meses,
        y no es por descuido: en español el verbo ya lleva la información de quién, y en inglés no.</p>

        <h4>Las contracciones</h4>
        <p>Al hablar casi nunca se dice la forma completa. Se junta el sujeto con el verbo:</p>
        <ul>
          <li>I am → <b>I'm</b> · <span class="en" data-say>I'm from Argentina</span></li>
          <li>you are → <b>you're</b> · <span class="en" data-say>You're right</span></li>
          <li>he is → <b>he's</b> · she is → <b>she's</b> · it is → <b>it's</b></li>
          <li>we are → <b>we're</b> · they are → <b>they're</b></li>
        </ul>
        <p>No son "inglés vago": son lo normal. Usar siempre la forma larga suena raro, como hablar de usted
        con un amigo.</p>
      `,

      tecnico: `
        <p><b>To be</b> es el único verbo del inglés moderno que conserva una conjugación con más de dos formas
        en presente. El resto de los verbos solo distinguen la tercera persona del singular
        (<i>work</i> / <i>works</i>). <i>To be</i> tiene tres: <b>am</b>, <b>is</b>, <b>are</b>.</p>

        <p>La irregularidad es histórica: <i>to be</i> es un verbo <b>supletivo</b> — sus formas vienen de tres
        raíces indoeuropeas distintas que se fusionaron en un solo paradigma. <i>am</i> e <i>is</i> vienen de
        una raíz, <i>are</i> de otra, y <i>was</i>/<i>were</i> de una tercera. Por eso no hay patrón que
        aprender: son formas que se memorizan.</p>

        <div class="nota-tec">
          <b>Sobre ser y estar.</b> El inglés no perdió la distinción: nunca la tuvo como oposición gramatical.
          Cuando importa marcar lo temporal, se hace con otros recursos — adverbios (<i>right now</i>,
          <i>at the moment</i>), tiempos progresivos, o verbos más específicos (<i>feel</i>, <i>look</i>, <i>seem</i>).
          <br><br>
          Lo que sí conviene saber: al traducir de inglés a español <b>vos</b> tenés que elegir, y ahí es donde
          un hispanohablante aprendiendo inglés tiene ventaja sobre un angloparlante aprendiendo español.
        </div>

        <p><b>Sobre la obligatoriedad del sujeto.</b> El español es un idioma <b>pro-drop</b> (<i>pro-dropping</i>):
        permite omitir el pronombre sujeto porque la morfología verbal ya lo codifica — <i>hablo</i> solo puede
        ser primera persona. El inglés <b>no es pro-drop</b>: como su morfología verbal está casi erosionada,
        el pronombre es la única marca de persona, y es obligatorio.</p>

        <p>Corolario que sorprende: el inglés hasta inventa sujetos donde no hay ninguno. <i>It's raining</i>,
        <i>There is a problem</i>. Ese <i>it</i> no se refiere a nada — es un <b>sujeto expletivo</b>, puesto
        solamente porque la estructura lo exige. En español el equivalente sería decir "ello llueve".</p>

        <table>
          <tr><th>Forma</th><th>Contracción</th><th>Se dice</th></tr>
          <tr><td>I am</td><td>I'm</td><td>/aɪm/</td></tr>
          <tr><td>you are</td><td>you're</td><td>/jʊər/ o /jər/ débil</td></tr>
          <tr><td>he is</td><td>he's</td><td>/hiːz/</td></tr>
          <tr><td>we are</td><td>we're</td><td>/wɪər/</td></tr>
          <tr><td>they are</td><td>they're</td><td>/ðeər/</td></tr>
        </table>

        <p><b>Ojo con los homófonos.</b> <i>they're</i>, <i>their</i> (su) y <i>there</i> (ahí) suenan idénticos.
        Es el error de escritura más común incluso entre nativos.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ser y estar se unifican en to be, con sus tres formas">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Dos verbos del español, uno del inglés</text>

          <rect x="90" y="40" width="150" height="40" rx="9" fill="#22d3ee" opacity="0.16" stroke="#22d3ee" stroke-width="1.4"/>
          <text x="165" y="59" text-anchor="middle" font-size="15" font-weight="800" fill="#22d3ee">SER</text>
          <text x="165" y="74" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.65">permanente</text>

          <rect x="90" y="92" width="150" height="40" rx="9" fill="#c084fc" opacity="0.16" stroke="#c084fc" stroke-width="1.4"/>
          <text x="165" y="111" text-anchor="middle" font-size="15" font-weight="800" fill="#c084fc">ESTAR</text>
          <text x="165" y="126" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.65">temporal</text>

          <path d="M 244 60 Q 290 60 300 86" stroke="currentColor" opacity="0.35" stroke-width="1.6" fill="none"/>
          <path d="M 244 112 Q 290 112 300 86" stroke="currentColor" opacity="0.35" stroke-width="1.6" fill="none"/>

          <rect x="306" y="66" width="130" height="40" rx="9" fill="#f59e0b" opacity="0.25" stroke="#f59e0b" stroke-width="1.8"/>
          <text x="371" y="92" text-anchor="middle" font-size="17" font-weight="800" fill="#f59e0b">to be</text>

          <text x="530" y="78" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.72">Una decisión menos</text>
          <text x="530" y="96" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.72">que tomar.</text>

          <line x1="40" y1="150" x2="640" y2="150" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="174" text-anchor="middle" font-size="13.5" font-weight="700" fill="currentColor">Pero cambia de forma según el sujeto</text>

          <g>
            <rect x="60" y="188" width="160" height="72" rx="9" fill="#34d399" opacity="0.13" stroke="#34d399" stroke-width="1.4"/>
            <text x="140" y="212" text-anchor="middle" font-size="19" font-weight="800" fill="#34d399">am</text>
            <text x="140" y="234" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">I</text>
            <text x="140" y="252" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">y nada más</text>
          </g>

          <g>
            <rect x="236" y="188" width="180" height="72" rx="9" fill="#22d3ee" opacity="0.13" stroke="#22d3ee" stroke-width="1.4"/>
            <text x="326" y="212" text-anchor="middle" font-size="19" font-weight="800" fill="#22d3ee">is</text>
            <text x="326" y="234" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">he · she · it</text>
            <text x="326" y="252" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">una sola persona o cosa</text>
          </g>

          <g>
            <rect x="432" y="188" width="188" height="72" rx="9" fill="#c084fc" opacity="0.13" stroke="#c084fc" stroke-width="1.4"/>
            <text x="526" y="212" text-anchor="middle" font-size="19" font-weight="800" fill="#c084fc">are</text>
            <text x="526" y="234" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">you · we · they</text>
            <text x="526" y="252" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">y "you" también es singular</text>
          </g>

          <rect x="60" y="272" width="560" height="24" rx="6" fill="#f87171" opacity="0.1"/>
          <text x="340" y="288" text-anchor="middle" font-size="12" font-weight="600" fill="#f87171">
            El sujeto nunca se omite: "Am a developer" no existe. Va "I am a developer".
          </text>
        </svg>`,
        pie: 'Ser y estar colapsan en to be, pero to be se abre en am / is / are según el sujeto.',
        nota: '<p>Fijate que <b>you</b> lleva <i>are</i> tanto para «vos» como para «ustedes». El inglés no distingue ' +
              'singular de plural en la segunda persona — es la contracara de lo poco que conjuga.</p>',
      },

      escucha: {
        intro: '<p>Todas llevan <i>to be</i> con contracción, que es como se dice de verdad. ' +
               'Escribí lo que oigas: si escuchás <i>I\'m</i>, escribí <i>I\'m</i>.</p>',
        items: [
          { texto: "I'm a developer.", es: 'Soy desarrollador.',
            nota: 'Fijate que va <b>a</b> antes de la profesión. En español no lleva artículo, en inglés sí.' },
          { texto: "She's from Brazil.", es: 'Ella es de Brasil.',
            nota: '<b>from</b> es «de» en el sentido de origen. Se usa siempre con <i>to be</i>.' },
          { texto: "We're not ready yet.", es: 'Todavía no estamos listos.',
            nota: 'Acá <i>to be</i> hace de «estar». Misma forma, distinto sentido — el contexto lo resuelve.' },
          { texto: "They're at the office today.", es: 'Ellos están en la oficina hoy.',
            nota: '<b>they\'re</b> suena igual que <i>their</i> y <i>there</i>. Al escribirlo hay que pensar cuál va.' },
        ],
      },

      practica: `
        <p><b>Decilo en voz alta, sin escribir.</b> Armá cinco frases sobre vos con <i>to be</i>: tu nombre,
        tu país, tu trabajo, cómo estás hoy y dónde estás. Después escuchá cómo suenan las contracciones y repetilas.</p>

        <p><b>Un detalle que se pasa por alto:</b> en inglés las profesiones llevan artículo.</p>
        <ul>
          <li>❌ <i>I am developer</i> → ✅ <span class="en" data-say>I am a developer</span></li>
          <li>❌ <i>She is engineer</i> → ✅ <span class="en" data-say>She is an engineer</span></li>
        </ul>
        <p>Va <b>a</b> antes de consonante y <b>an</b> antes de sonido de vocal — <i>an engineer</i>, <i>an artist</i>.
        Ojo: es antes de <b>sonido</b>, no de letra.</p>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Completá con la forma correcta de <i>to be</i>: <b>She ______ my sister.</b>',
          respuesta: 'is',
          porQue: '<b>she</b> lleva <i>is</i>, igual que <i>he</i> e <i>it</i>. Una sola persona o cosa.',
        },
        {
          tipo: 'hueco',
          p: 'Completá: <b>They ______ from Colombia.</b>',
          respuesta: 'are',
          respuestas: ["'re"],
          porQue: '<b>they</b> lleva <i>are</i>, como <i>you</i> y <i>we</i>. Contraído queda <i>they\'re</i>.',
        },
        {
          tipo: 'opcion',
          p: '¿Cuál de estas frases está bien escrita?',
          opciones: ['Am a designer.', 'I am designer.', 'I am a designer.', 'I designer am.'],
          correcta: 2,
          porQue: 'Necesita las dos cosas: el sujeto <b>I</b> (que en inglés nunca se omite) y el artículo <b>a</b> antes de la profesión.',
          porQueNo: {
            0: 'Le falta el sujeto. En español «Soy diseñador» se entiende; en inglés la frase no existe sin el <i>I</i>.',
            1: 'Le falta el artículo. Las profesiones en inglés llevan <i>a</i> o <i>an</i>.',
            3: 'El orden es sujeto + verbo. El inglés es mucho más rígido que el español con esto.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Estoy cansado.</b>',
          respuesta: "I'm tired",
          respuestas: ['I am tired'],
          pista: 'Acordate de que «estar» también es to be.',
          porQue: 'Mismo verbo que para «ser». <i>I am a doctor</i> y <i>I am tired</i> usan exactamente la misma forma.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «Ella es de Argentina.»',
          respuesta: 'She is from Argentina',
          porQue: '<b>from</b> es la preposición de origen, y va siempre con <i>to be</i>: <i>I am from…</i>',
        },
      ],

      errores: [
        { mito: 'Puedo omitir el <i>I</i> o el <i>she</i> cuando queda obvio de quién hablo, como en español.',
          realidad: 'No. El inglés <b>exige el sujeto siempre</b>, porque el verbo casi no cambia y el pronombre es la única ' +
                    'marca de persona. Hasta inventa sujetos que no significan nada: <i>It\'s raining</i>, ' +
                    '<i>There is a problem</i>. Ese <i>it</i> no se refiere a nada.' },
        { mito: 'Las contracciones (<i>I\'m</i>, <i>she\'s</i>) son informales, mejor decir todo completo.',
          realidad: 'Al <b>hablar</b> son lo normal en cualquier registro, incluso profesional. La forma larga se usa para ' +
                    '<b>enfatizar</b>: <i>I AM sure</i> = "te digo que sí estoy seguro". Si decís todo largo, sin querer ' +
                    'estás enfatizando todo el tiempo. Al escribir formal sí conviene la forma completa.' },
        { mito: '<i>You are</i> es solo para plural; para «vos» hay otra forma.',
          realidad: 'No hay otra. <b>you</b> sirve para «vos», «usted» y «ustedes», y siempre lleva <i>are</i>. ' +
                    'El inglés perdió el singular <i>thou</i> hace siglos. Cuando de verdad hace falta marcar el plural ' +
                    'se agrega algo: <i>you guys</i>, <i>you all</i>, <i>y\'all</i>.' },
      ],

      glosario: [
        { t: 'To be', d: 'El verbo «ser» y «estar» a la vez. Formas de presente: <i>am</i>, <i>is</i>, <i>are</i>.' },
        { t: 'Pronombre sujeto', d: 'I, you, he, she, it, we, they. En inglés son obligatorios; en español, opcionales.' },
        { t: 'Contracción', d: 'La unión de sujeto y verbo al hablar: <i>I am</i> → <i>I\'m</i>. Es la forma normal, no una versión descuidada.' },
        { t: 'Pro-drop', d: 'La propiedad de un idioma que permite omitir el pronombre sujeto. El español la tiene, el inglés no.' },
        { t: 'Sujeto expletivo', d: 'Un sujeto que no significa nada y está solo porque la gramática lo pide: el <i>it</i> de <i>It\'s raining</i>.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l2',
      titulo: 'Negar y preguntar',
      minutos: 9,

      simple: `
        <p>Con <i>to be</i>, negar y preguntar es sorprendentemente fácil: no necesitás ningún verbo extra.
        Es el único verbo del inglés donde es así de simple.</p>

        <h4>Negar: agregás <i>not</i> detrás del verbo</h4>
        <div class="analogia">
          <span class="en" data-say>I am tired</span> → <span class="en" data-say>I am not tired</span><br>
          <span class="en" data-say>She is here</span> → <span class="en" data-say>She is not here</span><br>
          <span class="en" data-say>They are ready</span> → <span class="en" data-say>They are not ready</span>
        </div>

        <p>Y como siempre, al hablar se contrae. Acá hay <b>dos formas válidas</b> para casi todas:</p>
        <ul>
          <li><span class="en" data-say>I'm not</span> — para <i>I</i> solo existe esta</li>
          <li><span class="en" data-say>She isn't</span> o <span class="en" data-say>She's not</span></li>
          <li><span class="en" data-say>They aren't</span> o <span class="en" data-say>They're not</span></li>
        </ul>
        <p>Las dos se usan igual. No hay una más correcta.</p>

        <h4>Preguntar: das vuelta el orden</h4>
        <p>Esto es todo. El verbo se pone <b>adelante</b> del sujeto:</p>
        <div class="analogia">
          <span class="en" data-say>You are from Chile</span> → <span class="en" data-say>Are you from Chile?</span><br>
          <span class="en" data-say>He is your boss</span> → <span class="en" data-say>Is he your boss?</span>
        </div>
        <p>En español la pregunta se marca con la entonación y no hace falta mover nada. En inglés
        <b>el orden es la pregunta</b>.</p>

        <h4>Las respuestas cortas</h4>
        <p>Acá hay una costumbre que al principio suena rara: en inglés casi nunca se contesta solo
        <i>yes</i> o <i>no</i>. Suena cortante, casi maleducado. Se repite el verbo:</p>
        <ul>
          <li>— <span class="en" data-say>Are you ready?</span><br>— <span class="en" data-say>Yes, I am.</span> / <span class="en" data-say>No, I'm not.</span></li>
          <li>— <span class="en" data-say>Is she a designer?</span><br>— <span class="en" data-say>Yes, she is.</span> / <span class="en" data-say>No, she isn't.</span></li>
        </ul>
        <p><b>Ojo con una trampa:</b> en la respuesta corta afirmativa <b>no se contrae</b>.
        Se dice <i>Yes, I am</i>, nunca ❌ <i>Yes, I'm</i>. En la negativa sí: <i>No, I'm not</i>.</p>

        <h4>Preguntar con palabra de pregunta</h4>
        <p>Si querés más que un sí o un no, la palabra de pregunta va <b>primero</b> y el resto sigue igual:</p>
        <ul>
          <li><span class="en" data-say>Where are you from?</span> — ¿De dónde sos?</li>
          <li><span class="en" data-say>What is your name?</span> — ¿Cómo te llamás?</li>
          <li><span class="en" data-say>How old are you?</span> — ¿Cuántos años tenés?</li>
          <li><span class="en" data-say>Who is she?</span> — ¿Quién es ella?</li>
        </ul>
      `,

      tecnico: `
        <p>El inglés forma preguntas por <b>inversión sujeto-verbo</b>. Pero solo pueden invertirse los
        <b>verbos auxiliares</b> — <i>be</i>, <i>have</i>, <i>do</i>, y los modales (<i>can</i>, <i>will</i>…).</p>

        <p>Un verbo léxico común <b>no</b> puede invertirse. Por eso:</p>
        <ul>
          <li>✅ <i>Are you tired?</i> — <i>be</i> es auxiliar, se invierte</li>
          <li>❌ <i>Work you here?</i> — <i>work</i> es léxico, no puede</li>
          <li>✅ <i>Do you work here?</i> — se trae un auxiliar prestado, <i>do</i></li>
        </ul>

        <div class="nota-tec">
          <b>Por qué esto importa ahora.</b> <i>To be</i> es la excepción cómoda: no necesita <i>do</i>. Si aprendés
          las preguntas con <i>to be</i> y después asumís que todos los verbos funcionan igual, en el módulo 3 vas
          a producir ❌ <i>Work you here?</i> — un error clásico y muy visible. Tenelo marcado desde ahora:
          <b>to be es la excepción, no la regla</b>.
        </div>

        <p><b>Sobre las dos contracciones negativas.</b> <i>She isn't</i> contrae verbo + <i>not</i>;
        <i>She's not</i> contrae sujeto + verbo y deja <i>not</i> suelto. La diferencia es de énfasis: al dejar
        <i>not</i> separado queda acentuado, así que <i>She's NOT ready</i> niega con más fuerza.
        En la práctica se usan indistintamente, con preferencias regionales.</p>

        <p><b>Y la asimetría de <i>I</i>.</b> No existe ❌ <i>amn't</i> en inglés estándar — es un hueco del
        paradigma. Solo hay <i>I'm not</i>. (En dialectos de Irlanda y Escocia sí se usa <i>amn't</i>, y en habla
        informal aparece <i>ain't</i>, que es no estándar y conviene reconocer pero no usar.)</p>

        <p><b>Sobre las respuestas cortas.</b> No son un adorno de cortesía: son <b>elipsis</b> — se omite todo
        el predicado y queda solo el auxiliar, que carga la información. Por eso no se puede contraer
        <i>Yes, I am</i>: la contracción necesita algo detrás para apoyarse, y en la elipsis no hay nada.
        Es la misma razón por la que no se dice ❌ <i>Yes, she's</i>.</p>

        <table>
          <tr><th>Palabra</th><th>Pregunta por</th><th>Ejemplo</th></tr>
          <tr><td>what</td><td>cosa</td><td>What is your name?</td></tr>
          <tr><td>where</td><td>lugar</td><td>Where are you from?</td></tr>
          <tr><td>who</td><td>persona</td><td>Who is your manager?</td></tr>
          <tr><td>when</td><td>momento</td><td>When is the meeting?</td></tr>
          <tr><td>why</td><td>motivo</td><td>Why are you late?</td></tr>
          <tr><td>how</td><td>manera</td><td>How are you?</td></tr>
          <tr><td>how old</td><td>edad</td><td>How old are you?</td></tr>
        </table>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cómo se arma la afirmación, la negación y la pregunta con to be">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Tres formas, un solo verbo</text>

          <text x="40" y="56" font-size="12" font-weight="700" fill="#34d399">AFIRMATIVO</text>
          <g>
            <rect x="40"  y="64" width="76" height="32" rx="7" fill="#34d399" opacity="0.22"/>
            <rect x="122" y="64" width="76" height="32" rx="7" fill="#f59e0b" opacity="0.3"/>
            <rect x="204" y="64" width="120" height="32" rx="7" fill="currentColor" opacity="0.1"/>
            <text x="78"  y="85" text-anchor="middle" font-size="13.5" font-weight="700" fill="currentColor">You</text>
            <text x="160" y="85" text-anchor="middle" font-size="13.5" font-weight="800" fill="#f59e0b">are</text>
            <text x="264" y="85" text-anchor="middle" font-size="13.5" fill="currentColor" opacity="0.8">from Chile</text>
          </g>

          <text x="40" y="130" font-size="12" font-weight="700" fill="#f87171">NEGATIVO · sumás not detrás</text>
          <g>
            <rect x="40"  y="138" width="76" height="32" rx="7" fill="#34d399" opacity="0.22"/>
            <rect x="122" y="138" width="76" height="32" rx="7" fill="#f59e0b" opacity="0.3"/>
            <rect x="204" y="138" width="66" height="32" rx="7" fill="#f87171" opacity="0.3"/>
            <rect x="276" y="138" width="120" height="32" rx="7" fill="currentColor" opacity="0.1"/>
            <text x="78"  y="159" text-anchor="middle" font-size="13.5" font-weight="700" fill="currentColor">You</text>
            <text x="160" y="159" text-anchor="middle" font-size="13.5" font-weight="800" fill="#f59e0b">are</text>
            <text x="237" y="159" text-anchor="middle" font-size="13.5" font-weight="800" fill="#f87171">not</text>
            <text x="336" y="159" text-anchor="middle" font-size="13.5" fill="currentColor" opacity="0.8">from Chile</text>
          </g>
          <text x="412" y="159" font-size="11.5" fill="currentColor" opacity="0.6">= you aren't / you're not</text>

          <text x="40" y="204" font-size="12" font-weight="700" fill="#22d3ee">PREGUNTA · das vuelta los dos primeros</text>
          <g>
            <rect x="40"  y="212" width="76" height="32" rx="7" fill="#f59e0b" opacity="0.3"/>
            <rect x="122" y="212" width="76" height="32" rx="7" fill="#34d399" opacity="0.22"/>
            <rect x="204" y="212" width="120" height="32" rx="7" fill="currentColor" opacity="0.1"/>
            <text x="78"  y="233" text-anchor="middle" font-size="13.5" font-weight="800" fill="#f59e0b">Are</text>
            <text x="160" y="233" text-anchor="middle" font-size="13.5" font-weight="700" fill="currentColor">you</text>
            <text x="264" y="233" text-anchor="middle" font-size="13.5" fill="currentColor" opacity="0.8">from Chile?</text>
          </g>

          <path d="M 78 206 Q 119 190 160 206" stroke="#22d3ee" stroke-width="1.8" fill="none" opacity="0.8"/>
          <path d="M 160 206 Q 119 190 78 206" stroke="#22d3ee" stroke-width="1.8" fill="none" opacity="0.8"/>
          <text x="119" y="185" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="700">se cruzan</text>

          <rect x="356" y="206" width="284" height="44" rx="8" fill="#22d3ee" opacity="0.09" stroke="#22d3ee" stroke-width="1.2"/>
          <text x="370" y="224" font-size="11.5" font-weight="700" fill="#22d3ee">Respuesta corta</text>
          <text x="370" y="241" font-size="12" fill="currentColor" opacity="0.85">Yes, I am. · No, I'm not.</text>

          <text x="340" y="276" text-anchor="middle" font-size="12" fill="#f87171" font-weight="600">
            Trampa: "Yes, I am" NO se contrae. Nunca "Yes, I'm".
          </text>
        </svg>`,
        pie: 'La negación suma una pieza; la pregunta intercambia las dos primeras. Nada más.',
      },

      escucha: {
        intro: '<p>Preguntas y respuestas cortas. Escuchá bien si hay <i>not</i> — es una sílaba chiquita ' +
               'que cambia todo el sentido de la frase.</p>',
        items: [
          { texto: 'Are you from Argentina?', es: '¿Sos de Argentina?',
            nota: 'Fijate que <i>are</i> arranca la frase. Ese orden es la pregunta.' },
          { texto: "No, I'm not. I'm from Uruguay.", es: 'No, no soy. Soy de Uruguay.',
            nota: 'Respuesta corta + aclaración. Es el patrón normal: nunca solo "no".' },
          { texto: "She isn't here today.", es: 'Ella no está hoy.',
            nota: '<b>isn\'t</b> se dice casi pegado, "IZ-nt". Es fácil perdérselo y entender lo contrario.' },
          { texto: 'Where are you from?', es: '¿De dónde sos?',
            nota: 'La palabra de pregunta va primero y después todo sigue invertido. Cuidado: no es "From where are you?".' },
          { texto: 'Is he your manager?', es: '¿Él es tu jefe?',
            nota: '<i>manager</i> es la palabra normal en el trabajo, más que <i>boss</i>, que suena más informal.' },
        ],
      },

      practica: `
        <p><b>Convertí estas cinco a negativo y a pregunta</b>, en voz alta, sin escribir:</p>
        <ol>
          <li>You are late.</li>
          <li>She is a designer.</li>
          <li>They are in the meeting.</li>
          <li>It is expensive.</li>
          <li>We are ready.</li>
        </ol>

        <p><b>Y ahora hacé de las dos puntas.</b> Preguntate en voz alta y respondete con respuesta corta:
        <i>— Are you tired? — Yes, I am.</i> Suena tonto hacerlo solo, y es de los ejercicios que más rinde,
        porque el patrón de respuesta corta no sale natural hasta que lo repetiste muchas veces.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Alguien te pregunta <span class="en" data-say>Are you ready?</span> y querés decir que sí. ¿Cómo contestás?',
          opciones: ["Yes, I'm.", 'Yes, I am.', 'Yes, I are.', 'Yes, am I.'],
          correcta: 1,
          porQue: 'En la respuesta corta afirmativa <b>no se contrae</b>. La contracción necesita algo detrás para apoyarse y acá no hay nada.',
          porQueNo: {
            0: 'Es el error más común de todos. ❌ <i>Yes, I\'m</i> no existe: en la respuesta corta la forma va completa.',
            2: '<i>I</i> lleva <i>am</i>, nunca <i>are</i>.',
            3: 'Ese es el orden de una pregunta. En la respuesta el sujeto va primero.',
          },
        },
        {
          tipo: 'ordenar',
          p: 'Armá la pregunta: «¿De dónde sos?»',
          respuesta: 'Where are you from',
          porQue: 'La palabra de pregunta primero, después el verbo, después el sujeto. <b>from</b> queda al final — no se dice ❌ <i>From where are you</i>.',
        },
        {
          tipo: 'hueco',
          p: 'Completá la negación: <b>He ______ my boss.</b> (usá la contracción de <i>is not</i>)',
          respuesta: "isn't",
          respuestas: ['is not', "'s not"],
          porQue: 'Las dos contracciones valen: <i>He isn\'t</i> o <i>He\'s not</i>. Se usan indistintamente.',
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>¿Ella es tu hermana?</b>',
          respuesta: 'Is she your sister?',
          respuestas: ['Is she your sister'],
          pista: 'Empezá por el verbo.',
          porQue: 'El verbo adelante del sujeto: eso es todo lo que convierte una afirmación en pregunta con <i>to be</i>.',
        },
        {
          tipo: 'dictado',
          p: 'Escuchá con atención — hay una negación escondida.',
          respuesta: "They aren't in the office",
          porQue: '<b>aren\'t</b> se dice rápido y pegado. Perderse esa sílaba te hace entender exactamente lo contrario.',
        },
      ],

      errores: [
        { mito: 'Para preguntar alcanza con cambiar la entonación, como en español.',
          realidad: 'En español «¿Sos de Chile?» solo necesita la entonación. En inglés <b>hay que invertir</b>: ' +
                    '<i>Are you from Chile?</i> Decir <i>You are from Chile?</i> con tono de pregunta se entiende, ' +
                    'pero suena a incredulidad («¿en serio sos de Chile?»), no a pregunta neutra.' },
        { mito: 'Si <i>Are you tired?</i> funciona sin nada más, entonces <i>Work you here?</i> también.',
          realidad: 'No. <b>To be es la excepción.</b> Solo los auxiliares pueden invertirse. Los verbos comunes necesitan ' +
                    'pedir prestado <i>do</i>: <i>Do you work here?</i> Este es el error que más aparece cuando se pasa ' +
                    'del módulo 1 al 3 sin tener presente que <i>to be</i> es un caso especial.' },
        { mito: 'Contestar <i>yes</i> o <i>no</i> a secas está bien, es más directo.',
          realidad: 'Se entiende, pero suena <b>cortante</b> — en una conversación de trabajo puede leerse como fastidio. ' +
                    'La respuesta corta (<i>Yes, I am</i>) es lo neutro. Es de esas cosas que no son gramática ' +
                    'sino costumbre, y que marcan mucho.' },
      ],

      glosario: [
        { t: 'Inversión', d: 'Poner el verbo delante del sujeto para preguntar: <i>You are</i> → <i>Are you?</i> Solo funciona con auxiliares.' },
        { t: 'Auxiliar', d: 'Un verbo que ayuda a formar preguntas, negaciones y tiempos: <i>be</i>, <i>do</i>, <i>have</i>, <i>can</i>. Son los únicos que se invierten.' },
        { t: 'Respuesta corta', d: '<i>Yes, I am</i> / <i>No, she isn\'t</i>. Se repite el auxiliar en vez de contestar solo sí o no.' },
        { t: 'Wh- question', d: 'Pregunta que empieza con what, where, who, when, why, how. Pide información, no un sí o un no.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l3',
      titulo: 'Presentarte de verdad',
      minutos: 9,

      simple: `
        <p>Ya tenés todas las piezas. Ahora armemos lo que de verdad vas a decir la primera vez que entres
        a una call.</p>

        <h4>El paquete básico</h4>
        <div class="analogia">
          <span class="en" data-say>Hi, I'm Agustín.</span> — Hola, soy Agustín.<br>
          <span class="en" data-say>I'm from Córdoba, Argentina.</span> — Soy de Córdoba, Argentina.<br>
          <span class="en" data-say>I'm a full stack developer.</span> — Soy desarrollador full stack.<br>
          <span class="en" data-say>Nice to meet you.</span> — Un gusto conocerte.
        </div>

        <p>Cuatro frases. Con eso ya te presentaste bien. No hace falta más al principio — de hecho,
        <b>menos es mejor</b>: una presentación corta y clara suena más segura que una larga y trabada.</p>

        <h4>Las preguntas que te van a hacer</h4>
        <table>
          <tr><th>Te preguntan</th><th>Contestás</th></tr>
          <tr><td><span class="en" data-say>What's your name?</span></td><td>I'm Agustín. / My name is Agustín.</td></tr>
          <tr><td><span class="en" data-say>Where are you from?</span></td><td>I'm from Argentina.</td></tr>
          <tr><td><span class="en" data-say>How are you?</span></td><td>I'm good, thanks. And you?</td></tr>
          <tr><td><span class="en" data-say>How old are you?</span></td><td>I'm thirty.</td></tr>
          <tr><td><span class="en" data-say>What do you do?</span></td><td>I'm a developer.</td></tr>
        </table>

        <h4>La trampa más grande de todas: la edad</h4>
        <div class="aviso">
          ❌ <i>I have 30 years</i> — es la traducción literal de «tengo 30 años» y <b>está mal</b>.<br>
          ✅ <span class="en" data-say>I'm 30</span> o <span class="en" data-say>I'm 30 years old</span>
        </div>
        <p>En inglés la edad <b>se es</b>, no se tiene. Y no es la única: pasa lo mismo con el hambre,
        el frío, el calor, el miedo y la razón.</p>

        <table>
          <tr><th>En español tenés…</th><th>En inglés SOS…</th></tr>
          <tr><td>tengo hambre</td><td><span class="en" data-say>I'm hungry</span></td></tr>
          <tr><td>tengo sed</td><td><span class="en" data-say>I'm thirsty</span></td></tr>
          <tr><td>tengo frío</td><td><span class="en" data-say>I'm cold</span></td></tr>
          <tr><td>tengo calor</td><td><span class="en" data-say>I'm hot</span></td></tr>
          <tr><td>tengo miedo</td><td><span class="en" data-say>I'm scared</span></td></tr>
          <tr><td>tenés razón</td><td><span class="en" data-say>You're right</span></td></tr>
          <tr><td>tengo 30 años</td><td><span class="en" data-say>I'm 30</span></td></tr>
        </table>

        <h4>Y una más, corta pero importante</h4>
        <p>«Estoy de acuerdo» es <span class="en" data-say>I agree</span>. <b>Sin <i>am</i>.</b>
        ❌ <i>I am agree</i> es de los errores que más rápido te delatan, porque aparece en cualquier
        conversación de trabajo.</p>
      `,

      tecnico: `
        <p>Lo de la edad y el hambre no es una excepción caprichosa: es una diferencia sistemática de cómo cada
        idioma <b>codifica los estados</b>.</p>

        <p>El español los trata como <b>posesión</b> (<i>tener</i> + sustantivo: hambre, frío, 30 años).
        El inglés los trata como <b>atributo</b> (<i>be</i> + adjetivo: hungry, cold, thirty). No es que uno
        esté mal: son dos estrategias distintas para lo mismo.</p>

        <div class="nota-tec">
          <b>Cómo detectar el error antes de cometerlo.</b> Si en español la frase es «tengo + <i>algo que no es
          un objeto</i>», casi seguro en inglés va con <b>be</b> + adjetivo. Si es «tengo + <i>una cosa</i>»
          (tengo un auto, tengo una pregunta), ahí sí va <i>have</i>.
          <br><br>
          <i>I have a question</i> ✅ · <i>I have a car</i> ✅ · <i>I have hungry</i> ❌
        </div>

        <p><b>Sobre <i>I agree</i>.</b> Acá el mecanismo es otro: <i>agree</i> ya <b>es un verbo</b> en inglés,
        mientras que en español «de acuerdo» es una locución adverbial que necesita el verbo <i>estar</i>.
        Poner <i>am</i> delante es como decir ❌ <i>I am work</i>. Lo mismo pasa con:</p>
        <ul>
          <li>❌ <i>I am agree</i> → ✅ <b>I agree</b></li>
          <li>❌ <i>I am need</i> → ✅ <b>I need</b></li>
          <li>❌ <i>She is work here</i> → ✅ <b>She works here</b></li>
        </ul>

        <p><b>Sobre el artículo en las profesiones.</b> El inglés exige <i>a</i>/<i>an</i> ante un sustantivo
        contable singular en función de predicado nominal: <i>I'm a developer</i>. El español lo omite
        justamente ahí. La regla del artículo es <b>fonética, no ortográfica</b>: se usa <i>an</i> ante
        <b>sonido</b> vocálico.</p>
        <ul>
          <li><i>an engineer</i>, <i>an hour</i> — la <i>h</i> de <i>hour</i> es muda, arranca con vocal</li>
          <li><i>a university</i>, <i>a European country</i> — arrancan con sonido /j/, que es consonante</li>
        </ul>

        <p><b>Sobre <i>How are you?</i></b> En inglés estadounidense funciona más como saludo que como pregunta
        real. La respuesta esperada es breve y positiva — <i>Good, thanks. You?</i> — y contar cómo estás de
        verdad puede resultar incómodo. En un contexto donde sí se pregunta en serio, se nota por el tono
        y por el seguimiento.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 310" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Estados que en español se tienen y en inglés se son">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">En español lo tenés · en inglés lo SOS</text>

          <rect x="40" y="40" width="270" height="200" rx="10" fill="#f87171" opacity="0.07" stroke="#f87171" stroke-width="1.3"/>
          <text x="175" y="62" text-anchor="middle" font-size="13" font-weight="800" fill="#f87171">Traducción literal ✗</text>
          <g font-size="13" fill="currentColor" opacity="0.8">
            <text x="60" y="90">I have 30 years</text>
            <text x="60" y="114">I have hunger</text>
            <text x="60" y="138">I have cold</text>
            <text x="60" y="162">I have reason</text>
            <text x="60" y="186">I am agree</text>
            <text x="60" y="210">I am developer</text>
          </g>

          <g stroke="#f59e0b" stroke-width="1.6" opacity="0.6" marker-end="url(#fl)">
            <line x1="316" y1="85"  x2="358" y2="85"/>
            <line x1="316" y1="109" x2="358" y2="109"/>
            <line x1="316" y1="133" x2="358" y2="133"/>
            <line x1="316" y1="157" x2="358" y2="157"/>
            <line x1="316" y1="181" x2="358" y2="181"/>
            <line x1="316" y1="205" x2="358" y2="205"/>
          </g>
          <defs>
            <marker id="fl" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#f59e0b" opacity="0.7"/>
            </marker>
          </defs>

          <rect x="370" y="40" width="270" height="200" rx="10" fill="#34d399" opacity="0.08" stroke="#34d399" stroke-width="1.3"/>
          <text x="505" y="62" text-anchor="middle" font-size="13" font-weight="800" fill="#34d399">Como se dice ✓</text>
          <g font-size="13" font-weight="600" fill="currentColor">
            <text x="390" y="90">I'm 30</text>
            <text x="390" y="114">I'm hungry</text>
            <text x="390" y="138">I'm cold</text>
            <text x="390" y="162">You're right</text>
            <text x="390" y="186">I agree</text>
            <text x="390" y="210">I'm a developer</text>
          </g>

          <rect x="40" y="256" width="600" height="42" rx="8" fill="#22d3ee" opacity="0.09" stroke="#22d3ee" stroke-width="1.2"/>
          <text x="340" y="274" text-anchor="middle" font-size="12.5" font-weight="700" fill="#22d3ee">La regla para no equivocarte</text>
          <text x="340" y="291" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">
            "Tengo + una cosa" → have · "Tengo + un estado" → be + adjetivo
          </text>
        </svg>`,
        pie: 'La columna de la izquierda es lo que sale solo al traducir del español. La de la derecha es lo que se dice.',
        nota: '<p>De todos los errores del track, estos seis son los que más se escuchan y los más fáciles de arreglar: ' +
              'no requieren aprender nada nuevo, solo <b>desarmar el reflejo del español</b>.</p>',
      },

      escucha: {
        intro: '<p>Una presentación completa, partida en frases. Después de escribir cada una, ' +
               'grabate diciéndola vos — esta es la que más vale la pena tener automática.</p>',
        items: [
          { texto: "Hi, I'm Agustín. Nice to meet you.", es: 'Hola, soy Agustín. Un gusto conocerte.',
            nota: '<i>Nice to meet you</i> se dice la primera vez que conocés a alguien. Después ya no.' },
          { texto: "I'm from Córdoba, Argentina.", es: 'Soy de Córdoba, Argentina.',
            nota: 'Ciudad primero, país después — al revés que en muchas direcciones en español.' },
          { texto: "I'm a full stack developer.", es: 'Soy desarrollador full stack.',
            nota: 'No te olvides el <b>a</b>. En español no va, en inglés sí.' },
          { texto: "I'm thirty-two years old.", es: 'Tengo treinta y dos años.',
            nota: 'Con <i>to be</i>, nunca con <i>have</i>. También vale simplemente <i>I\'m thirty-two</i>.' },
          { texto: "Sorry, I'm not sure. Could you repeat that?", es: 'Perdón, no estoy seguro. ¿Podrías repetir eso?',
            nota: 'Guardala entera. Es la frase que más te va a salvar en tus primeras calls.' },
        ],
      },

      practica: `
        <p><b>Escribí tu presentación real</b> — la tuya, no un ejemplo — con estas cuatro líneas:</p>
        <ol>
          <li>Hi, I'm ______.</li>
          <li>I'm from ______.</li>
          <li>I'm a ______.</li>
          <li>Nice to meet you.</li>
        </ol>

        <p>Después decila en voz alta <b>diez veces</b>, hasta que salga sin pensar. Suena excesivo y no lo es:
        el objetivo no es entenderla, es <b>automatizarla</b>. En una call real vas a estar nervioso, y lo único
        que sale bien con nervios es lo que ya está automático.</p>

        <p><b>Después probá la variante incómoda:</b> decila mientras hacés otra cosa — caminando, lavando algo.
        Si podés decirla sin concentrarte, ya está lista.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Querés decir «tengo 28 años». ¿Cuál está bien?',
          opciones: ['I have 28 years', 'I have 28 years old', "I'm 28 years old", 'I am 28 years'],
          correcta: 2,
          porQue: 'La edad va con <b>to be</b>: <i>I\'m 28</i> o <i>I\'m 28 years old</i>. Las dos son correctas; la primera es más frecuente.',
          porQueNo: {
            0: 'Es la traducción literal del español. En inglés la edad no se tiene.',
            1: 'Mezcla las dos estructuras. Ni <i>have</i> ni la forma completa.',
            3: 'Casi: el verbo está bien pero falta <i>old</i>. O va <i>I\'m 28</i> a secas, o <i>I\'m 28 years old</i> completo.',
          },
        },
        {
          tipo: 'opcion',
          p: 'Tu compañero propone algo y estás de acuerdo. ¿Qué decís?',
          opciones: ['I am agree.', 'I agree.', "I'm agree with you.", 'I am agreed.'],
          correcta: 1,
          porQue: '<b>agree</b> ya es un verbo. Ponerle <i>am</i> delante es como decir ❌ <i>I am work</i>.',
          porQueNo: {
            0: 'Es el error clásico, calcado de «estoy de acuerdo». Suena muy marcado porque aparece todo el tiempo.',
            2: 'Mismo problema con el <i>am</i>. Lo correcto sería <i>I agree with you</i>.',
            3: '<i>agreed</i> es participio. Se usa en <i>Agreed!</i> como respuesta suelta, pero no con <i>I am</i>.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Tengo hambre.</b>',
          respuesta: "I'm hungry",
          respuestas: ['I am hungry'],
          pista: 'En inglés no lo tenés: lo sos.',
          porQue: 'Los estados van con <b>be</b> + adjetivo. Lo mismo con <i>thirsty</i>, <i>cold</i>, <i>tired</i>, <i>scared</i>.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá tu presentación: «Soy desarrollador de Argentina.»',
          respuesta: "I'm a developer from Argentina",
          porQue: 'Fijate en el <b>a</b> antes de la profesión y en <b>from</b> para el origen. Son las dos piezas que más se olvidan.',
        },
        {
          tipo: 'dictado',
          p: 'Escuchá y escribí. Es la frase que más te va a servir en una call.',
          respuesta: "Sorry, I'm not sure",
          porQue: 'Decir que no estás seguro <b>en inglés</b> es infinitamente mejor que quedarte callado. Tenela lista.',
        },
      ],

      errores: [
        { mito: 'La edad se dice con <i>have</i>, como en español.',
          realidad: 'Con <b>be</b>: <i>I\'m 30</i>. Y arrastra a toda una familia — hambre, sed, frío, calor, miedo, razón. ' +
                    'La regla que lo resuelve: si en español «tenés» algo que <b>no es un objeto</b>, en inglés lo <b>sos</b>.' },
        { mito: 'Al presentarme puedo decir <i>I am developer</i>, el artículo es opcional.',
          realidad: 'No es opcional: <b>I\'m a developer</b>. El inglés exige <i>a</i>/<i>an</i> antes de un sustantivo contable ' +
                    'singular. Y ojo, la elección entre <i>a</i> y <i>an</i> es por <b>sonido</b>: ' +
                    '<i>an hour</i> (h muda) pero <i>a university</i> (arranca con sonido de y).' },
        { mito: 'Cuando me preguntan <i>How are you?</i> tengo que contar cómo estoy realmente.',
          realidad: 'En inglés estadounidense funciona más como saludo que como pregunta. Lo esperado es corto: ' +
                    '<i>Good, thanks. You?</i> Contestar con detalle puede resultar incómodo. ' +
                    'No es frialdad — es una fórmula, igual que «¿qué hacés?» acá.' },
      ],

      glosario: [
        { t: 'Nice to meet you', d: 'Un gusto conocerte. Solo la primera vez. Después se usa <i>Good to see you</i>.' },
        { t: 'What do you do?', d: '¿A qué te dedicás? No es «¿qué estás haciendo?» — esa sería <i>What are you doing?</i>' },
        { t: 'Predicado nominal', d: 'La parte que va después de <i>to be</i> y describe al sujeto: <i>a developer</i>, <i>tired</i>, <i>from Argentina</i>.' },
        { t: 'a / an', d: 'El artículo indefinido. <i>an</i> va antes de sonido de vocal, no de letra vocal: <i>an hour</i>, <i>a university</i>.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l4',
      titulo: 'To be en el trabajo',
      minutos: 9,

      simple: `
        <p>Ahora lo mismo, pero en el contexto donde de verdad lo vas a usar: una call de trabajo.</p>

        <h4>Entrar a una reunión</h4>
        <div class="analogia">
          <span class="en" data-say>Hi everyone, I'm Agustín.</span> — Hola a todos, soy Agustín.<br>
          <span class="en" data-say>Sorry, I'm late.</span> — Perdón, llego tarde.<br>
          <span class="en" data-say>Can you hear me?</span> — ¿Me escuchan?<br>
          <span class="en" data-say>Sorry, my mic was off.</span> — Perdón, tenía el micrófono apagado.
        </div>

        <h4>Decir dónde estás y cómo estás</h4>
        <ul>
          <li><span class="en" data-say>I'm on a call.</span> — Estoy en una llamada.</li>
          <li><span class="en" data-say>I'm in a meeting right now.</span> — Estoy en una reunión ahora.</li>
          <li><span class="en" data-say>I'm working from home today.</span> — Hoy trabajo desde casa.</li>
          <li><span class="en" data-say>I'm available after three.</span> — Estoy disponible después de las tres.</li>
          <li><span class="en" data-say>I'm out of office tomorrow.</span> — Mañana no estoy.</li>
        </ul>

        <h4>Hablar del estado de una tarea</h4>
        <p>Esto es lo que vas a decir en el standup todos los días:</p>
        <ul>
          <li><span class="en" data-say>It's done.</span> — Está terminado.</li>
          <li><span class="en" data-say>It's not ready yet.</span> — Todavía no está listo.</li>
          <li><span class="en" data-say>It's almost done.</span> — Está casi listo.</li>
          <li><span class="en" data-say>I'm blocked.</span> — Estoy trabado.</li>
          <li><span class="en" data-say>It's in review.</span> — Está en revisión.</li>
          <li><span class="en" data-say>The build is broken.</span> — El build está roto.</li>
        </ul>

        <h4>Las frases que te salvan cuando no entendés</h4>
        <div class="aviso">
          <span class="en" data-say>Sorry, could you repeat that?</span> — Perdón, ¿lo podés repetir?<br>
          <span class="en" data-say>Sorry, I'm not sure I understand.</span> — Perdón, no estoy seguro de entender.<br>
          <span class="en" data-say>Could you speak a bit more slowly, please?</span> — ¿Podés hablar un poco más despacio?<br>
          <span class="en" data-say>Can you write it in the chat?</span> — ¿Lo podés escribir en el chat?
        </div>

        <p><b>Usalas sin vergüenza.</b> Pedir que repitan es normal — hasta entre nativos, con audio malo,
        pasa todo el tiempo. Quedarse callado asintiendo sin entender es lo que sí genera problemas,
        porque después hacés otra cosa de la que te pidieron.</p>
      `,

      tecnico: `
        <p>Un mapa rápido de las preposiciones que acompañan a <i>to be</i> en contexto laboral, que es donde
        más se equivoca la gente:</p>

        <table>
          <tr><th>Se dice</th><th>Significa</th><th>Ojo</th></tr>
          <tr><td>I'm <b>on</b> a call</td><td>estoy en una llamada</td><td>on, no in</td></tr>
          <tr><td>I'm <b>in</b> a meeting</td><td>estoy en una reunión</td><td>in, no on</td></tr>
          <tr><td>I'm <b>at</b> the office</td><td>estoy en la oficina</td><td>at para un lugar puntual</td></tr>
          <tr><td>I'm <b>in</b> the office</td><td>estoy dentro de la oficina</td><td>enfatiza el adentro</td></tr>
          <tr><td>I'm <b>on</b> vacation</td><td>estoy de vacaciones</td><td>US; en UK, <i>on holiday</i></td></tr>
          <tr><td>I'm <b>out of</b> office</td><td>no estoy disponible</td><td>lo del autorresponder</td></tr>
        </table>

        <div class="nota-tec">
          <b>No hay lógica que las una.</b> <i>on a call</i> pero <i>in a meeting</i> — son colocaciones fijas,
          combinaciones que el uso consolidó. Se aprenden como bloques, no se deducen. Intentar razonarlas
          es perder tiempo; escucharlas muchas veces es lo que funciona.
        </div>

        <p><b>Sobre el standup.</b> La estructura estándar son tres partes: qué hiciste ayer, qué vas a hacer hoy,
        y qué te está bloqueando. Con <i>to be</i> ya podés cubrir la tercera, que es la más importante — y la
        que más se calla por vergüenza.</p>

        <p><b>Registro.</b> En trabajo remoto internacional el registro es más informal de lo que un
        hispanohablante espera. <i>Hi</i> y <i>Hey</i> son normales incluso hacia arriba en la jerarquía;
        <i>Dear</i> en un mensaje interno suena raro o hasta sarcástico. Lo que <b>sí</b> importa es ser
        directo y explícito: la ambigüedad se lee como falta de claridad, no como cortesía.</p>

        <p><b>Un matiz útil.</b> Comparadas con el español, las peticiones en inglés se envuelven más:
        <i>Could you…?</i> en vez de <i>Can you…?</i>, <i>I was wondering if…</i>, <i>Would it be possible to…?</i>
        Traducir literalmente el imperativo español («mandame el archivo») produce <i>Send me the file</i>,
        que suena brusco. <i>Could you send me the file?</i> es lo neutro.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Frases con to be organizadas por momento de una jornada de trabajo remoto">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Un día de trabajo con to be</text>

          <line x1="60" y1="60" x2="60" y2="272" stroke="currentColor" opacity="0.2" stroke-width="2"/>

          <circle cx="60" cy="76" r="7" fill="#34d399"/>
          <text x="82" y="72" font-size="12.5" font-weight="700" fill="#34d399">Entrás a la call</text>
          <text x="82" y="90" font-size="12.5" fill="currentColor" opacity="0.8">Hi everyone, I'm Agustín. · Can you hear me?</text>

          <circle cx="60" cy="126" r="7" fill="#22d3ee"/>
          <text x="82" y="122" font-size="12.5" font-weight="700" fill="#22d3ee">Contás en qué andás</text>
          <text x="82" y="140" font-size="12.5" fill="currentColor" opacity="0.8">It's almost done. · It's in review. · I'm blocked.</text>

          <circle cx="60" cy="176" r="7" fill="#fbbf24"/>
          <text x="82" y="172" font-size="12.5" font-weight="700" fill="#fbbf24">No entendiste algo</text>
          <text x="82" y="190" font-size="12.5" fill="currentColor" opacity="0.8">Sorry, could you repeat that?</text>

          <circle cx="60" cy="226" r="7" fill="#c084fc"/>
          <text x="82" y="222" font-size="12.5" font-weight="700" fill="#c084fc">Decís tu disponibilidad</text>
          <text x="82" y="240" font-size="12.5" fill="currentColor" opacity="0.8">I'm available after three. · I'm out of office tomorrow.</text>

          <rect x="82" y="256" width="540" height="34" rx="8" fill="#f87171" opacity="0.09" stroke="#f87171" stroke-width="1.2"/>
          <text x="352" y="277" text-anchor="middle" font-size="12" font-weight="600" fill="#f87171">
            on a call · in a meeting · at the office — son bloques fijos, no se deducen
          </text>
        </svg>`,
        pie: 'Las mismas cuatro estructuras de to be, ubicadas en los momentos donde realmente aparecen.',
      },

      escucha: {
        intro: '<p>Frases reales de call. Estas son las que conviene reconocer <b>al instante</b>, ' +
               'sin tener que procesarlas — porque cuando aparecen, aparecen rápido.</p>',
        items: [
          { texto: 'Sorry, can you hear me?', es: 'Perdón, ¿me escuchan?',
            nota: 'Las primeras palabras de la mitad de las calls del mundo.' },
          { texto: "It's almost done, I'm just testing it.", es: 'Está casi listo, lo estoy probando nomás.',
            nota: 'Reporte típico de standup. <i>just</i> acá suavemente quiere decir «nada más que».' },
          { texto: "I'm blocked. I'm waiting for the API keys.", es: 'Estoy trabado. Estoy esperando las claves de la API.',
            nota: 'Decir que estás bloqueado <b>no</b> es admitir una falla: es la información más útil que podés dar en un standup.' },
          { texto: 'Sorry, could you repeat that? The audio is bad.', es: 'Perdón, ¿podés repetir? El audio está mal.',
            nota: 'Culpar al audio es una salida perfectamente honesta y usada por todo el mundo.' },
          { texto: "I'm out of office tomorrow, but I'm available today.", es: 'Mañana no estoy, pero hoy estoy disponible.',
            nota: 'Dos <i>to be</i> en una frase, uno para ausencia y otro para disponibilidad.' },
        ],
      },

      practica: `
        <p><b>Armá tu standup de mañana en inglés</b>, ahora mismo, con lo que estés haciendo de verdad.
        Tres líneas:</p>
        <ol>
          <li>Yesterday I was working on ______.</li>
          <li>Today I'm working on ______.</li>
          <li>I'm blocked by ______. <i>(o: I'm not blocked.)</i></li>
        </ol>

        <p>Decilo en voz alta. Si te trabás en la primera, es normal — <i>was</i> es pasado y lo vemos recién
        en el módulo 7. Por ahora usalo como fórmula fija.</p>

        <p><b>Y guardate estas cuatro en un lugar visible</b> hasta que salgan solas:</p>
        <ul>
          <li><span class="en" data-say>Sorry, could you repeat that?</span></li>
          <li><span class="en" data-say>Sorry, I'm not sure I understand.</span></li>
          <li><span class="en" data-say>Can you write it in the chat?</span></li>
          <li><span class="en" data-say>Let me check and get back to you.</span></li>
        </ul>
        <p>La última es la salida de emergencia perfecta: te da tiempo sin que quede mal.</p>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Completá con la preposición: <b>I\'m ______ a meeting right now.</b>',
          respuesta: 'in',
          porQue: 'Es <b>in a meeting</b>, pero <b>on a call</b>. No hay lógica: son bloques fijos que se aprenden de memoria.',
        },
        {
          tipo: 'hueco',
          p: 'Completá: <b>I\'m ______ a call, I\'ll text you later.</b>',
          respuesta: 'on',
          porQue: '<b>on a call</b>. Es el par del ejercicio anterior, y es justamente donde todo el mundo se equivoca.',
        },
        {
          tipo: 'opcion',
          p: 'En un standup querés decir que estás trabado esperando unos accesos. ¿Cuál suena natural?',
          opciones: [
            "I have block with the accesses.",
            "I'm blocked, I'm waiting for the access.",
            'I am block for the access.',
            'I stay blocked with access.',
          ],
          correcta: 1,
          porQue: '<b>I\'m blocked</b> es la fórmula estándar en cualquier equipo. Después se aclara por qué, con <i>waiting for</i>.',
          porQueNo: {
            0: '<i>have block</i> no es inglés. El estado va con <i>be</i> + adjetivo, no con <i>have</i>.',
            2: '<i>block</i> es el sustantivo o el verbo base. El adjetivo de estado es <i>blocked</i>.',
            3: '<i>stay</i> es «quedarse». No se usa para describir el estado de una tarea.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Todavía no está listo.</b>',
          respuesta: "It's not ready yet",
          respuestas: ['It is not ready yet', "It isn't ready yet"],
          pista: '«Todavía» al final de la frase.',
          porQue: '<b>yet</b> va al final en frases negativas. Es la forma normal de decir que algo sigue en curso sin que suene a excusa.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá la frase que más vas a usar: «Perdón, ¿podrías repetir eso?»',
          respuesta: 'Sorry could you repeat that',
          porQue: 'Con <b>could</b> en vez de <i>can</i> suena más cortés, y es lo neutro en una reunión de trabajo.',
        },
      ],

      errores: [
        { mito: 'Pedir que repitan queda mal, mejor asentir y después averiguar.',
          realidad: 'Es al revés. Asentir sin entender y después hacer otra cosa es lo que <b>sí</b> genera problemas reales. ' +
                    'Pedir que repitan es normal hasta entre nativos. Y hay una salida elegante: ' +
                    '<i>Sorry, the audio is bad — could you repeat that?</i>' },
        { mito: 'Como <i>in a meeting</i> lleva <i>in</i>, entonces es <i>in a call</i>.',
          realidad: 'Es <b>on a call</b>. Y <b>at the office</b>, y <b>on vacation</b>. Son colocaciones fijas sin lógica común. ' +
                    'Buscarles una regla es perder tiempo: se memorizan como bloques enteros.' },
        { mito: 'Ser directo suena grosero, mejor dar muchas vueltas como en español.',
          realidad: 'Mezcla dos cosas. En inglés de trabajo se espera que seas <b>directo con el contenido</b> y ' +
                    '<b>envuelto en la forma</b>: <i>Could you send me the file?</i> es directo en el pedido y cortés ' +
                    'en la formulación. Dar vueltas con el contenido se lee como falta de claridad.' },
      ],

      glosario: [
        { t: "I'm blocked", d: 'Estoy trabado. La fórmula estándar en un standup para decir que no podés avanzar por algo externo.' },
        { t: 'On a call / in a meeting', d: 'Estar en una llamada / en una reunión. Preposiciones distintas sin motivo lógico: son bloques fijos.' },
        { t: 'Out of office', d: 'Fuera de la oficina, no disponible. También el nombre del autorresponder de vacaciones (OOO).' },
        { t: 'Get back to you', d: 'Volver con una respuesta. <i>Let me check and get back to you</i> es la salida de emergencia más útil que hay.' },
        { t: 'Colocación', d: 'Una combinación fija de palabras que el uso consolidó (<i>on a call</i>). No se deduce por reglas: se memoriza.' },
      ],
    },
  ],

  /* ==================================================================== */
  vocabulario: [
    { en: 'I', es: 'yo', ejemplo: 'I am from Argentina.', ejemploEs: 'Soy de Argentina.' },
    { en: 'you', es: 'vos / ustedes', pista: 'Sirve para singular y plural.', ejemplo: 'You are right.', ejemploEs: 'Tenés razón.' },
    { en: 'he', es: 'él', ejemplo: 'He is my manager.', ejemploEs: 'Él es mi jefe.' },
    { en: 'she', es: 'ella', ejemplo: 'She is a designer.', ejemploEs: 'Ella es diseñadora.' },
    { en: 'we', es: 'nosotros', ejemplo: 'We are ready.', ejemploEs: 'Estamos listos.' },
    { en: 'they', es: 'ellos', ejemplo: 'They are in a meeting.', ejemploEs: 'Están en una reunión.' },
    { en: 'from', es: 'de (origen)', ejemplo: 'I am from Córdoba.', ejemploEs: 'Soy de Córdoba.' },
    { en: 'tired', es: 'cansado', ejemplo: 'I am tired today.', ejemploEs: 'Estoy cansado hoy.' },
    { en: 'ready', es: 'listo', ejemplo: 'It is not ready yet.', ejemploEs: 'Todavía no está listo.' },
    { en: 'hungry', es: 'con hambre', pista: 'Se es, no se tiene.', ejemplo: 'I am hungry.', ejemploEs: 'Tengo hambre.' },
    { en: 'sure', es: 'seguro', ejemplo: 'I am not sure.', ejemploEs: 'No estoy seguro.' },
    { en: 'late', es: 'tarde', ejemplo: 'Sorry, I am late.', ejemploEs: 'Perdón, llego tarde.' },
    { en: 'busy', es: 'ocupado', ejemplo: 'She is busy right now.', ejemploEs: 'Ella está ocupada ahora.' },
    { en: 'available', es: 'disponible', ejemplo: 'I am available after three.', ejemploEs: 'Estoy disponible después de las tres.' },
    { en: 'blocked', es: 'trabado', pista: 'La palabra del standup.', ejemplo: 'I am blocked by the API keys.', ejemploEs: 'Estoy trabado por las claves de la API.' },
    { en: 'done', es: 'terminado', ejemplo: 'It is done.', ejemploEs: 'Está terminado.' },
    { en: 'meeting', es: 'reunión', ejemplo: 'I am in a meeting.', ejemploEs: 'Estoy en una reunión.' },
    { en: 'developer', es: 'desarrollador', ejemplo: 'I am a developer.', ejemploEs: 'Soy desarrollador.' },
    { en: 'manager', es: 'jefe / responsable', ejemplo: 'Is he your manager?', ejemploEs: '¿Él es tu jefe?' },
    { en: 'right', es: 'correcto', pista: 'You are right = tenés razón.', ejemplo: 'You are right.', ejemploEs: 'Tenés razón.' },
    { en: 'agree', es: 'estar de acuerdo', pista: 'Ya es verbo: nunca lleva am.', ejemplo: 'I agree with you.', ejemploEs: 'Estoy de acuerdo con vos.' },
    { en: 'yet', es: 'todavía', pista: 'Va al final en frases negativas.', ejemplo: 'It is not ready yet.', ejemploEs: 'Todavía no está listo.' },
    { en: 'today', es: 'hoy', ejemplo: 'I am working from home today.', ejemploEs: 'Hoy trabajo desde casa.' },
    { en: 'tomorrow', es: 'mañana', ejemplo: 'I am out of office tomorrow.', ejemploEs: 'Mañana no estoy.' },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es la forma correcta de <i>to be</i> para <b>they</b>?',
      opciones: ['am', 'is', 'are', 'be'],
      correcta: 2,
      porQue: '<b>they are</b>, igual que <i>you are</i> y <i>we are</i>. Contraído: <i>they\'re</i>.',
      porQueNo: {
        0: '<i>am</i> es exclusivo de <i>I</i>. No se usa con ningún otro sujeto.',
        1: '<i>is</i> es para <i>he</i>, <i>she</i> e <i>it</i> — una sola persona o cosa.',
        3: '<i>be</i> es el infinitivo. No se conjuga así en presente.',
      },
    },
    {
      p: '¿Por qué en inglés no se puede decir <i>Am a developer</i>?',
      opciones: [
        'Porque falta el artículo antes de la profesión',
        'Porque el inglés exige el pronombre sujeto siempre, ya que el verbo casi no marca la persona',
        'Porque <i>am</i> no se puede usar al principio de una frase',
        'Porque <i>developer</i> necesita ir en plural',
      ],
      correcta: 1,
      porQue: 'El español es pro-drop: el verbo ya te dice quién. El inglés no, así que el pronombre es la única marca de persona y es obligatorio. Va <i>I am a developer</i>.',
      porQueNo: {
        0: 'También falta el artículo, es cierto — pero el problema principal es el sujeto. <i>Am developer</i> tampoco funciona.',
        2: 'Sí puede: <i>Am I late?</i> es perfectamente correcto. Lo que no puede es faltar el sujeto en una afirmación.',
        3: 'Está bien en singular. El plural sería otro caso distinto.',
      },
    },
    {
      p: 'Te preguntan <span class="en" data-say>Are you a designer?</span> y sos diseñador. ¿Cuál es la respuesta natural?',
      opciones: ["Yes, I'm.", 'Yes.', 'Yes, I am.', 'Yes, I am designer.'],
      correcta: 2,
      porQue: 'La respuesta corta repite el auxiliar sin contraer. <b>Yes, I am</b> — nunca ❌ <i>Yes, I\'m</i>, porque la contracción necesita algo detrás.',
      porQueNo: {
        0: 'Es el error clásico. En la respuesta corta afirmativa la forma va completa.',
        1: 'Se entiende, pero suena cortante. En inglés lo neutro es repetir el auxiliar.',
        3: 'Le falta el artículo, y además la respuesta corta no necesita repetir la profesión.',
      },
    },
    {
      p: 'Querés decir «tengo 25 años». ¿Cuál está bien?',
      opciones: ['I have 25 years', "I'm 25 years old", 'I have 25 years old', 'My age is 25 years'],
      correcta: 1,
      porQue: 'En inglés la edad va con <b>to be</b>. También vale <i>I\'m 25</i> a secas, que es incluso más frecuente.',
      porQueNo: {
        0: 'Traducción literal del español. La edad no se tiene en inglés.',
        2: 'Mezcla las dos estructuras: o <i>have</i> o <i>be</i>, y acá va <i>be</i>.',
        3: 'Es gramaticalmente posible pero nadie habla así. Suena a formulario.',
      },
    },
    {
      p: '¿Cuál de estas frases contiene el error más típico del hispanohablante?',
      opciones: ['I agree with you.', 'I am agree with you.', "I'm not sure about it.", "She isn't here."],
      correcta: 1,
      porQue: '<b>agree</b> ya es un verbo. Ponerle <i>am</i> delante equivale a decir ❌ <i>I am work</i>. Viene de calcar «estoy de acuerdo».',
      porQueNo: {
        0: 'Es exactamente la forma correcta.',
        2: 'Correcta. Acá <i>sure</i> es un adjetivo, así que sí lleva <i>be</i>.',
        3: 'Correcta. <i>isn\'t</i> es la contracción normal de <i>is not</i>.',
      },
    },
    {
      p: '¿Qué diferencia hay entre <i>She isn\'t ready</i> y <i>She\'s not ready</i>?',
      opciones: [
        'La primera es formal y la segunda informal',
        'Prácticamente ninguna: las dos son correctas y se usan indistintamente',
        'La primera es británica y la segunda estadounidense',
        'La segunda está mal escrita',
      ],
      correcta: 1,
      porQue: 'Cambia qué se contrae: verbo+not en una, sujeto+verbo en la otra. Al dejar <i>not</i> suelto queda un poco más enfatizado, pero en la práctica son intercambiables.',
      porQueNo: {
        0: 'Ninguna de las dos es más formal. En escritura formal se prefiere la forma completa <i>is not</i>.',
        2: 'Hay preferencias regionales leves, pero no es una división británico/estadounidense.',
        3: 'Está perfectamente bien escrita.',
      },
    },
    {
      p: '¿Cómo se pregunta «¿De dónde sos?»',
      opciones: ['From where you are?', 'Where you are from?', 'Where are you from?', 'Where from are you?'],
      correcta: 2,
      porQue: 'Palabra de pregunta + verbo + sujeto, y <b>from</b> al final. Es una de las preguntas que más vas a escuchar.',
      porQueNo: {
        0: 'Es la traducción literal de «¿De dónde…?» y además le falta la inversión.',
        1: 'Le falta invertir: sería <i>are you</i>, no <i>you are</i>.',
        3: '<i>from</i> no puede ir ahí. En inglés las preposiciones de este tipo quedan al final.',
      },
    },
    {
      p: 'Con <i>to be</i> alcanza con invertir para preguntar. ¿Vale lo mismo para los demás verbos?',
      opciones: [
        'Sí, todos los verbos se invierten igual',
        'No: solo los auxiliares se invierten. Los verbos comunes necesitan <i>do</i>',
        'Sí, pero solo en presente',
        'No, los demás verbos no pueden formar preguntas',
      ],
      correcta: 1,
      porQue: 'Solo <i>be</i>, <i>have</i>, <i>do</i> y los modales se invierten. Un verbo léxico pide auxiliar prestado: <i>Do you work here?</i>, nunca ❌ <i>Work you here?</i>',
      porQueNo: {
        0: 'Ese es justo el error que aparece al pasar del módulo 1 al 3. <i>To be</i> es la excepción.',
        2: 'La restricción no es de tiempo verbal: en pasado pasa lo mismo (<i>Did you work?</i>).',
        3: 'Claro que pueden — usando <i>do</i>.',
      },
    },
    {
      p: 'Estás en un standup y no podés avanzar porque te faltan unos accesos. ¿Qué decís?',
      opciones: ["I have a block.", "I'm blocked.", 'I am block.', 'I stay blocked.'],
      correcta: 1,
      porQue: '<b>I\'m blocked</b> es la fórmula estándar en cualquier equipo. Es <i>be</i> + adjetivo, como todos los estados.',
      porQueNo: {
        0: '<i>a block</i> es un objeto. No describe tu estado.',
        2: '<i>block</i> es el verbo base o el sustantivo; el adjetivo de estado es <i>blocked</i>.',
        3: '<i>stay</i> es «quedarse». No se usa así.',
      },
    },
    {
      p: '¿Cuál es correcta?',
      opciones: ["I'm on a meeting.", "I'm in a call.", "I'm in a meeting.", "I'm at a call."],
      correcta: 2,
      porQue: 'Es <b>in a meeting</b> y <b>on a call</b>. No hay lógica que las una: son colocaciones fijas que se memorizan como bloques.',
      porQueNo: {
        0: 'Invertido: <i>on</i> va con <i>call</i>, no con <i>meeting</i>.',
        1: 'También invertido: sería <i>on a call</i>.',
        3: '<i>at</i> se usa para lugares puntuales (<i>at the office</i>), no para llamadas.',
      },
    },
    {
      p: '¿Por qué se dice <i>an hour</i> pero <i>a university</i>?',
      opciones: [
        'Porque son excepciones que se memorizan sin explicación',
        'Porque la regla depende del sonido, no de la letra: <i>hour</i> empieza con vocal y <i>university</i> con sonido de y',
        'Porque <i>hour</i> es una palabra de origen francés',
        'Porque <i>university</i> es una palabra larga',
      ],
      correcta: 1,
      porQue: 'La regla es <b>fonética</b>. La <i>h</i> de <i>hour</i> es muda, así que arranca con vocal → <i>an</i>. <i>University</i> arranca con /j/, que es consonante → <i>a</i>.',
      porQueNo: {
        0: 'No son excepciones: siguen la regla perfectamente, siempre que la regla se lea como fonética.',
        2: 'El origen es correcto pero irrelevante. Lo que decide es cómo suena hoy.',
        3: 'La longitud no tiene nada que ver.',
      },
    },
    {
      p: 'En una call no entendiste lo que dijeron. ¿Cuál es la mejor reacción?',
      opciones: [
        'Asentir y averiguarlo después por tu cuenta',
        'Decir <i>Sorry, could you repeat that?</i> y pedir que lo repitan',
        'Pedir disculpas largamente por tu nivel de inglés',
        'Escribir en el chat que no entendés nada',
      ],
      correcta: 1,
      porQue: 'Es normal, corto y directo — hasta entre nativos con audio malo. Y si querés, <i>the audio is bad</i> es una aclaración perfectamente honesta.',
      porQueNo: {
        0: 'Es lo que genera problemas reales: terminás haciendo algo distinto de lo que te pidieron.',
        2: 'Disculparse de más incomoda y desvía el foco. Un <i>sorry</i> alcanza.',
        3: 'Demasiado general. Conviene preguntar por lo puntual que no entendiste.',
      },
    },
  ],
});
