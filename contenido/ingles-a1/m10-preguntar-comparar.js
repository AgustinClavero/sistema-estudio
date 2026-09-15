/* ==========================================================================
   Inglés A1 · m10 — Preguntar, contar y comparar
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ingles-a1',
  id: 'm10',
  titulo: 'Preguntar, contar y comparar',
  fuentes: ['cambridge-dic', 'wordreference', 'bbc-learning-english'],

  intro:
    '<p>El último módulo de gramática, y el que más te va a servir para <b>participar</b> en una ' +
    'conversación en vez de solo entenderla.</p>' +
    '<p>Tres cosas: <b>preguntar bien</b> —que en inglés tiene un orden rígido que el español no tiene—, ' +
    '<b>hablar de cantidades</b>, y <b>comparar</b>, que es lo que necesitás para justificar cualquier ' +
    'decisión técnica.</p>',

  lecciones: [

    /* ==================================================================== */
    {
      id: 'l1',
      titulo: 'El orden de las preguntas',
      minutos: 8,

      simple: `
        <p>Ya armaste preguntas en todos los módulos anteriores. Acá está la regla completa, que
        <b>siempre es la misma</b>:</p>

        <div class="analogia">
          <b>palabra de pregunta → auxiliar → sujeto → verbo</b><br><br>
          <span class="en" data-say>What</span> ·
          <span class="en" data-say>did</span> ·
          <span class="en" data-say>you</span> ·
          <span class="en" data-say>do</span> ·
          yesterday?
        </div>

        <table>
          <tr><th>Wh-</th><th>Auxiliar</th><th>Sujeto</th><th>Verbo</th></tr>
          <tr><td>Where</td><td>are</td><td>you</td><td>from?</td></tr>
          <tr><td>What</td><td>do</td><td>you</td><td>do?</td></tr>
          <tr><td>Why</td><td>did</td><td>it</td><td>fail?</td></tr>
          <tr><td>When</td><td>can</td><td>you</td><td>start?</td></tr>
          <tr><td>How</td><td>does</td><td>it</td><td>work?</td></tr>
        </table>

        <p><b>Ese orden no se negocia.</b> En español la entonación alcanza y las palabras se pueden mover;
        en inglés el orden <b>es</b> la pregunta.</p>

        <h4>Las palabras de pregunta</h4>
        <table>
          <tr><th>Palabra</th><th>Pregunta por</th></tr>
          <tr><td><span class="en" data-say>what</span></td><td>cosa</td></tr>
          <tr><td><span class="en" data-say>where</span></td><td>lugar</td></tr>
          <tr><td><span class="en" data-say>when</span></td><td>momento</td></tr>
          <tr><td><span class="en" data-say>who</span></td><td>persona</td></tr>
          <tr><td><span class="en" data-say>why</span></td><td>motivo</td></tr>
          <tr><td><span class="en" data-say>how</span></td><td>manera</td></tr>
          <tr><td><span class="en" data-say>which</span></td><td>cuál, entre opciones conocidas</td></tr>
          <tr><td><span class="en" data-say>whose</span></td><td>de quién</td></tr>
        </table>

        <div class="aviso">
          <b>La trampa que queda:</b> las preposiciones van <b>al final</b>.<br><br>
          ❌ <i>With whom did you talk?</i> (correcto pero muy formal, casi nadie lo dice)<br>
          ✅ <span class="en" data-say>Who did you talk to?</span><br><br>
          ❌ <i>On what are you working?</i><br>
          ✅ <span class="en" data-say>What are you working on?</span><br><br>
          En español la preposición va adelante; en inglés queda colgando al final. Suena raro al
          principio y es lo normal.
        </div>

        <h4>Y la excepción de siempre</h4>
        <p>Si la palabra de pregunta <b>es el sujeto</b>, no hay auxiliar:</p>
        <ul>
          <li><span class="en" data-say>Who deployed this?</span> — no <i>Who did deploy this?</i></li>
          <li><span class="en" data-say>What broke the build?</span></li>
        </ul>
      `,

      tecnico: `
        <p>El orden canónico es <b>Wh- + auxiliar + sujeto + verbo</b>. Se llama <b>inversión</b> y es
        obligatoria en inglés estándar. Sin ella, la frase no es una pregunta neutra.</p>

        <div class="nota-tec">
          <b>Por qué el español no lo necesita.</b> El español marca la interrogación con
          <b>entonación</b> y admite orden libre: «¿Dónde trabajás?», «¿Trabajás dónde?».
          El inglés perdió flexibilidad de orden hace siglos, y la posición pasó a cargar
          información gramatical. Por eso el orden <b>es</b> la marca.
          <br><br>
          Consecuencia práctica: <i>You are from Chile?</i> con tono de pregunta se entiende, pero
          comunica <b>incredulidad</b> («¿en serio sos de Chile?»), no una pregunta neutra.
        </div>

        <p><b>Las preposiciones colgantes</b> (<i>preposition stranding</i>) son una particularidad del
        inglés. Pocas lenguas lo permiten — el español no.</p>

        <table>
          <tr><th>Natural</th><th>Formal / arcaico</th></tr>
          <tr><td>Who did you talk to?</td><td>To whom did you talk?</td></tr>
          <tr><td>What are you working on?</td><td>On what are you working?</td></tr>
          <tr><td>Where does it come from?</td><td>From where does it come?</td></tr>
        </table>

        <p>La columna de la derecha es gramatical pero suena a documento legal. En trabajo real,
        siempre la de la izquierda.</p>

        <p><b>Sobre <i>which</i> contra <i>what</i>.</b> <i>which</i> implica un conjunto <b>cerrado y
        conocido</b>; <i>what</i> es abierto.</p>
        <ul>
          <li><i>Which branch should I use?</i> — hay unas pocas y las dos sabemos cuáles</li>
          <li><i>What branch should I use?</i> — también se usa, más informal, sin implicar conjunto</li>
        </ul>

        <p><b>Sobre las preguntas indirectas.</b> Cuando la pregunta va dentro de otra frase,
        <b>se pierde la inversión</b>:</p>
        <ul>
          <li>Directa: <i>Where is the config?</i></li>
          <li>Indirecta: <i>Do you know where the config <b>is</b>?</i> — no ❌ <i>where is the config</i></li>
        </ul>
        <p>Es un error muy común y bastante visible. La regla: <b>después de <i>I don't know</i>,
        <i>Do you know</i>, <i>Can you tell me</i>, el orden vuelve a ser normal.</b></p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="El orden fijo de las preguntas en inglés y la posición final de las preposiciones">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Un orden, siempre el mismo</text>

          <g font-size="13">
            <rect x="40" y="42" width="130" height="40" rx="8" fill="#c084fc" opacity="0.22" stroke="#c084fc" stroke-width="1.3"/>
            <text x="105" y="60" text-anchor="middle" font-weight="800" fill="#c084fc">Wh-</text>
            <text x="105" y="76" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.65">what, where, why</text>

            <rect x="180" y="42" width="130" height="40" rx="8" fill="#f59e0b" opacity="0.22" stroke="#f59e0b" stroke-width="1.3"/>
            <text x="245" y="60" text-anchor="middle" font-weight="800" fill="#f59e0b">auxiliar</text>
            <text x="245" y="76" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.65">do, did, is, can</text>

            <rect x="320" y="42" width="130" height="40" rx="8" fill="#34d399" opacity="0.22" stroke="#34d399" stroke-width="1.3"/>
            <text x="385" y="60" text-anchor="middle" font-weight="800" fill="#34d399">sujeto</text>
            <text x="385" y="76" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.65">you, it, she</text>

            <rect x="460" y="42" width="130" height="40" rx="8" fill="#22d3ee" opacity="0.22" stroke="#22d3ee" stroke-width="1.3"/>
            <text x="525" y="60" text-anchor="middle" font-weight="800" fill="#22d3ee">verbo</text>
            <text x="525" y="76" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.65">do, fail, work</text>
          </g>

          <g font-size="13.5" text-anchor="middle">
            <text x="105" y="106" fill="currentColor" opacity="0.9">What</text>
            <text x="245" y="106" fill="currentColor" opacity="0.9">did</text>
            <text x="385" y="106" fill="currentColor" opacity="0.9">you</text>
            <text x="525" y="106" fill="currentColor" opacity="0.9">do?</text>

            <text x="105" y="128" fill="currentColor" opacity="0.9">Why</text>
            <text x="245" y="128" fill="currentColor" opacity="0.9">does</text>
            <text x="385" y="128" fill="currentColor" opacity="0.9">it</text>
            <text x="525" y="128" fill="currentColor" opacity="0.9">fail?</text>
          </g>

          <line x1="34" y1="150" x2="646" y2="150" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="172" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f87171">Y las preposiciones quedan colgando al final</text>

          <g font-size="12.5">
            <rect x="40" y="184" width="272" height="30" rx="7" fill="#f87171" opacity="0.1"/>
            <text x="176" y="204" text-anchor="middle" fill="#f87171">✗ On what are you working?</text>

            <rect x="368" y="184" width="272" height="30" rx="7" fill="#34d399" opacity="0.12"/>
            <text x="504" y="204" text-anchor="middle" fill="#34d399">✓ What are you working on?</text>
          </g>

          <rect x="40" y="222" width="600" height="36" rx="8" fill="#22d3ee" opacity="0.09" stroke="#22d3ee" stroke-width="1.2"/>
          <text x="340" y="238" text-anchor="middle" font-size="12" font-weight="700" fill="#22d3ee">Pregunta indirecta: se pierde la inversión</text>
          <text x="340" y="253" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.85">
            "Where is it?" → "Do you know where it is?" — no "where is it"
          </text>
        </svg>`,
        pie: 'El orden es rígido. Y dos detalles que el español no tiene: preposición al final e inversión que desaparece.',
      },

      escucha: {
        intro: '<p>Preguntas de trabajo. Fijate dónde caen las preposiciones — casi siempre al final.</p>',
        items: [
          { texto: 'What are you working on?', es: '¿En qué estás trabajando?',
            nota: '<b>on</b> colgando al final. En español la preposición va adelante; en inglés no.' },
          { texto: 'Who did you talk to about this?', es: '¿Con quién hablaste de esto?',
            nota: 'Dos preposiciones: <b>to</b> al final y <b>about</b> antes del complemento.' },
          { texto: 'Do you know where the config file is?', es: '¿Sabés dónde está el archivo de config?',
            nota: 'Pregunta <b>indirecta</b>: el orden vuelve a normal. Nunca ❌ <i>where is the config file</i>.' },
          { texto: 'Which branch should I use?', es: '¿Qué rama debería usar?',
            nota: '<b>which</b> implica un conjunto cerrado y conocido: hay unas pocas ramas y las dos sabemos cuáles.' },
        ],
      },

      practica: `
        <p><b>Armá diez preguntas sobre un proyecto tuyo</b>, en voz alta, usando cada palabra de
        pregunta una vez. Vigilá el orden: <b>Wh- + auxiliar + sujeto + verbo</b>.</p>

        <p><b>Y practicá especialmente las que llevan preposición al final</b>, que son las que más
        cuesta que salgan naturales:</p>
        <ul>
          <li><span class="en" data-say>What are you working on?</span></li>
          <li><span class="en" data-say>Who did you talk to?</span></li>
          <li><span class="en" data-say>Where does this come from?</span></li>
          <li><span class="en" data-say>What is this for?</span></li>
          <li><span class="en" data-say>Which file is it in?</span></li>
        </ul>

        <p><b>La regla de la pregunta indirecta</b>, que es donde más se falla:</p>
        <div class="analogia">
          <b>Directa:</b> Where is it? → <b>Indirecta:</b> Do you know where it <b>is</b>?<br>
          <b>Directa:</b> What does it do? → <b>Indirecta:</b> I don't know what it <b>does</b>.
        </div>
        <p>Después de <i>Do you know</i>, <i>I don't know</i> o <i>Can you tell me</i>, el orden es
        el de una frase normal.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: [
            'On what are you working?',
            'What are you working on?',
            'What on are you working?',
            'What you are working on?',
          ],
          correcta: 1,
          porQue: 'En inglés la preposición queda <b>colgando al final</b>. La versión con la preposición adelante es gramatical pero suena a documento legal.',
          porQueNo: {
            0: 'Correcta pero muy formal: casi nadie habla así.',
            2: 'La preposición no puede ir ahí.',
            3: 'Le falta la inversión: sería <i>are you</i>.',
          },
        },
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: [
            'Do you know where is the config file?',
            'Do you know where the config file is?',
            'Do you know where is it the config file?',
            'You know where is the config file?',
          ],
          correcta: 1,
          porQue: 'En una pregunta <b>indirecta</b> se pierde la inversión: el orden vuelve al de una frase normal.',
          porQueNo: {
            0: 'Mantiene la inversión de la pregunta directa. Es un error muy común y bastante visible.',
            2: 'Duplica el sujeto.',
            3: 'Le falta el auxiliar de la pregunta principal.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá con la palabra de pregunta: <b>______ did you talk to about this?</b>',
          respuesta: 'Who',
          respuestas: ['who'],
          porQue: '<b>who</b> pregunta por persona. Y fijate que <i>to</i> queda colgando al final.',
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>¿De dónde sale esto?</b> (hablando de un valor en el código)',
          respuesta: 'Where does this come from?',
          respuestas: ['Where does this come from', 'Where does it come from?'],
          pista: 'La preposición va al final.',
          porQue: 'Es una de las tres preguntas más frecuentes al leer código ajeno, junto con <i>Where is this defined?</i> y <i>Where is this used?</i>',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «¿Qué rama debería usar?»',
          respuesta: 'Which branch should I use',
          porQue: '<b>which</b> porque hay un conjunto cerrado y conocido de ramas. Y <i>should</i> es el auxiliar.',
        },
      ],

      errores: [
        { mito: 'Puedo poner la preposición al principio, como en español.',
          realidad: '<i>On what are you working?</i> es gramatical pero suena a documento legal. Lo normal es dejarla ' +
                    '<b>colgando al final</b>: <b>What are you working on?</b> Es una particularidad del inglés que ' +
                    'pocas lenguas tienen.' },
        { mito: 'En una pregunta indirecta se mantiene el orden de la pregunta.',
          realidad: '❌ <i>Do you know where is it?</i> Se <b>pierde la inversión</b>: <i>Do you know where it is?</i> ' +
                    'Después de <i>Do you know</i>, <i>I don\'t know</i> o <i>Can you tell me</i>, el orden vuelve ' +
                    'al de una frase normal.' },
        { mito: 'Con la entonación alcanza para preguntar, como en español.',
          realidad: '<i>You are from Chile?</i> se entiende, pero comunica <b>incredulidad</b> («¿en serio?»), ' +
                    'no una pregunta neutra. El orden <b>es</b> la marca de interrogación en inglés.' },
      ],

      glosario: [
        { t: 'Inversión', d: 'Poner el auxiliar delante del sujeto. Es lo que convierte una frase en pregunta.' },
        { t: 'Preposición colgante', d: 'La preposición que queda al final: <i>What are you working on?</i> Es normal en inglés y rarísimo en español.' },
        { t: 'Pregunta indirecta', d: 'La que va dentro de otra frase. Pierde la inversión: <i>Do you know where it is?</i>' },
        { t: 'Which vs what', d: '<i>which</i> implica un conjunto cerrado y conocido; <i>what</i> es abierto.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l2',
      titulo: 'Cuánto y cuántos',
      minutos: 8,

      simple: `
        <p>Para preguntar por cantidad hay dos formas, y la elección depende de si lo que contás
        <b>se puede contar</b>:</p>

        <div class="analogia">
          <span class="en" data-say>How many bugs are there?</span> — contables<br>
          <span class="en" data-say>How much time do we have?</span> — incontables
        </div>

        <p>Es lo mismo que <i>many</i> / <i>much</i> del módulo 2. Y el mismo atajo sirve:
        si dudás, reformulá con <b>a lot of</b>.</p>

        <h4>Las cantidades, de más a menos</h4>
        <table>
          <tr><th>Contables</th><th>Incontables</th><th>Español</th></tr>
          <tr><td>a lot of / many</td><td>a lot of / much</td><td>muchos / mucho</td></tr>
          <tr><td>some</td><td>some</td><td>algunos / algo de</td></tr>
          <tr><td>a few</td><td>a little</td><td>unos pocos / un poco</td></tr>
          <tr><td>few</td><td>little</td><td>pocos (y es poco)</td></tr>
          <tr><td>no / none</td><td>no / none</td><td>ninguno / nada</td></tr>
        </table>

        <div class="aviso">
          <b>La diferencia entre <i>a few</i> y <i>few</i> es real y cambia el tono.</b><br><br>
          <span class="en" data-say>I have a few questions</span> — tengo <b>unas cuantas</b> preguntas. Neutro.<br>
          <span class="en" data-say>I have few questions</span> — tengo <b>pocas</b> preguntas. Suena a que casi no tengo.<br><br>
          Lo mismo con <i>a little</i> (un poco, positivo) y <i>little</i> (poco, negativo).
          El artículo cambia el signo.
        </div>

        <h4>Números que vas a usar</h4>
        <ul>
          <li><span class="en" data-say>a couple of</span> — un par de (dos, o dos o tres)</li>
          <li><span class="en" data-say>a bunch of</span> — un montón de (informal)</li>
          <li><span class="en" data-say>most of</span> — la mayoría de</li>
          <li><span class="en" data-say>half of</span> — la mitad de</li>
          <li><span class="en" data-say>none of</span> — ninguno de</li>
        </ul>

        <h4>Preguntar por otras dimensiones</h4>
        <p><b>how</b> se combina con adjetivos para preguntar cualquier medida:</p>
        <ul>
          <li><span class="en" data-say>How long does it take?</span> — cuánto tarda</li>
          <li><span class="en" data-say>How often do you deploy?</span> — cada cuánto</li>
          <li><span class="en" data-say>How big is the file?</span> — qué tamaño</li>
          <li><span class="en" data-say>How far along are you?</span> — cuánto avanzaste</li>
        </ul>
        <p><b><i>How long</i></b> es la más útil de todas: sirve para tiempo y es la pregunta estándar
        sobre una estimación.</p>
      `,

      tecnico: `
        <p>La distinción <b>how many / how much</b> refleja la oposición contable/incontable del módulo 2.
        Es sistemática y no admite excepciones: la clase del sustantivo decide.</p>

        <table>
          <tr><th>Cuantificador</th><th>Contable</th><th>Incontable</th></tr>
          <tr><td>many / how many</td><td>✅</td><td>❌</td></tr>
          <tr><td>much / how much</td><td>❌</td><td>✅</td></tr>
          <tr><td>a few / few</td><td>✅</td><td>❌</td></tr>
          <tr><td>a little / little</td><td>❌</td><td>✅</td></tr>
          <tr><td>a lot of / some / any</td><td>✅</td><td>✅</td></tr>
        </table>

        <div class="nota-tec">
          <b>El contraste <i>a few</i> / <i>few</i> es de <b>polaridad</b>, no de cantidad.</b>
          <br><br>
          <i>a few</i> presenta la cantidad como <b>suficiente</b> ("tengo unas cuantas").
          <br><i>few</i> la presenta como <b>insuficiente</b> ("tengo pocas, casi ninguna").
          <br><br>
          La cantidad objetiva puede ser idéntica: lo que cambia es cómo la evaluás. Por eso
          <i>Few people came</i> suena a decepción y <i>A few people came</i> es neutro.
        </div>

        <p><b><i>How much</i> también pregunta por precio:</b> <i>How much is it?</i> = ¿cuánto sale?
        Es de los usos más frecuentes, porque <i>money</i> es incontable.</p>

        <p><b>La familia de <i>how</i> + adjetivo</b> es muy productiva y cubre casi cualquier medida:</p>
        <table>
          <tr><th>Pregunta</th><th>Mide</th></tr>
          <tr><td>How long…?</td><td>duración o longitud</td></tr>
          <tr><td>How often…?</td><td>frecuencia</td></tr>
          <tr><td>How big / large…?</td><td>tamaño</td></tr>
          <tr><td>How many times…?</td><td>cantidad de repeticiones</td></tr>
          <tr><td>How far…?</td><td>distancia</td></tr>
          <tr><td>How soon…?</td><td>en cuánto tiempo</td></tr>
        </table>

        <p><b>Ojo con <i>How long</i>:</b> es ambigua entre duración y longitud física.
        <i>How long is the meeting?</i> (duración) contra <i>How long is the cable?</i> (longitud).
        El contexto lo resuelve siempre.</p>

        <p><b>Y una que confunde:</b> <i>How often</i> pregunta frecuencia, <i>How many times</i>
        pregunta un número concreto de veces. <i>How often do you deploy?</i> → <i>Twice a week</i>.
        <i>How many times did you try?</i> → <i>Three times</i>.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cuantificadores para contables e incontables, y el contraste entre a few y few">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Cuánto y cuántos</text>

          <rect x="34" y="38" width="290" height="128" rx="10" fill="#22d3ee" opacity="0.09" stroke="#22d3ee" stroke-width="1.3"/>
          <text x="179" y="60" text-anchor="middle" font-size="12.5" font-weight="800" fill="#22d3ee">CONTABLES</text>
          <text x="179" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">How many bugs?</text>
          <g font-size="12" fill="currentColor" opacity="0.82">
            <text x="54" y="104">a lot of · many</text>
            <text x="54" y="124">some · a few</text>
            <text x="54" y="144">few · none</text>
          </g>

          <rect x="356" y="38" width="290" height="128" rx="10" fill="#c084fc" opacity="0.09" stroke="#c084fc" stroke-width="1.3"/>
          <text x="501" y="60" text-anchor="middle" font-size="12.5" font-weight="800" fill="#c084fc">INCONTABLES</text>
          <text x="501" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">How much time?</text>
          <g font-size="12" fill="currentColor" opacity="0.82">
            <text x="376" y="104">a lot of · much</text>
            <text x="376" y="124">some · a little</text>
            <text x="376" y="144">little · none</text>
          </g>

          <text x="340" y="184" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f59e0b">El artículo cambia el signo</text>

          <g font-size="12.5">
            <rect x="60" y="196" width="264" height="46" rx="8" fill="#34d399" opacity="0.12" stroke="#34d399" stroke-width="1.2"/>
            <text x="192" y="215" text-anchor="middle" font-weight="700" fill="#34d399">a few questions</text>
            <text x="192" y="233" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.8">unas cuantas · neutro</text>

            <rect x="356" y="196" width="264" height="46" rx="8" fill="#f87171" opacity="0.12" stroke="#f87171" stroke-width="1.2"/>
            <text x="488" y="215" text-anchor="middle" font-weight="700" fill="#f87171">few questions</text>
            <text x="488" y="233" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.8">pocas · suena a casi ninguna</text>
          </g>

          <text x="340" y="266" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">
            La cantidad puede ser la misma: lo que cambia es cómo la evaluás.
          </text>
        </svg>`,
        pie: 'La clase del sustantivo decide el cuantificador. Y el artículo decide el tono.',
      },

      escucha: {
        intro: '<p>Preguntas de cantidad y de medida. Son las que más aparecen coordinando trabajo.</p>',
        items: [
          { texto: 'How many open tickets do we have?', es: '¿Cuántos tickets abiertos tenemos?',
            nota: '<b>how many</b> porque <i>tickets</i> es contable.' },
          { texto: 'How much time do we have before the demo?', es: '¿Cuánto tiempo tenemos antes de la demo?',
            nota: '<b>how much</b> porque <i>time</i> es incontable.' },
          { texto: 'How long does the build take?', es: '¿Cuánto tarda el build?',
            nota: '<b>How long</b> es la pregunta estándar sobre duración. La más útil de todas.' },
          { texto: 'How often do you deploy to production?', es: '¿Cada cuánto despliegan a producción?',
            nota: '<b>How often</b> pregunta frecuencia; <i>How many times</i> preguntaría un número concreto.' },
          { texto: 'I have a few questions about the design.', es: 'Tengo unas cuantas preguntas sobre el diseño.',
            nota: '<b>a few</b> con artículo: neutro. Sin artículo sonaría a que casi no tenés.' },
        ],
      },

      practica: `
        <p><b>Hacé cinco preguntas de cantidad</b> sobre tu proyecto, alternando <i>many</i> y <i>much</i>:</p>
        <ol>
          <li>How many ______?</li>
          <li>How much ______?</li>
          <li>How long ______?</li>
          <li>How often ______?</li>
          <li>How big ______?</li>
        </ol>

        <p><b>Y prestá atención al par que cambia el tono:</b></p>
        <ul>
          <li><span class="en" data-say>I have a few concerns</span> — tengo algunas dudas. Neutro, abre conversación.</li>
          <li><span class="en" data-say>I have few concerns</span> — tengo pocas dudas. Suena a aprobación.</li>
        </ul>
        <p>En un code review esa diferencia importa: sin el artículo estás diciendo casi lo contrario.</p>

        <p><b>El atajo de siempre:</b> si dudás entre <i>many</i> y <i>much</i>, usá <b>a lot of</b>.
        Y si dudás entre <i>a few</i> y <i>few</i>, usá <b>some</b>.</p>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Completá: <b>How ______ open tickets do we have?</b>',
          respuesta: 'many',
          porQue: '<b>tickets</b> es contable → <i>how many</i>.',
        },
        {
          tipo: 'hueco',
          p: 'Completá: <b>How ______ time do we have?</b>',
          respuesta: 'much',
          porQue: '<b>time</b> es incontable → <i>how much</i>.',
        },
        {
          tipo: 'opcion',
          p: 'En un code review querés decir que tenés algunas dudas, sin sonar negativo. ¿Cuál va?',
          opciones: [
            'I have few concerns.',
            'I have a few concerns.',
            'I have little concerns.',
            'I have much concerns.',
          ],
          correcta: 1,
          porQue: '<b>a few</b> con artículo es neutro: «unas cuantas». Sin artículo suena a «casi ninguna», que dice casi lo contrario.',
          porQueNo: {
            0: '<i>few</i> sin artículo presenta la cantidad como insuficiente: sonaría a aprobación.',
            2: '<i>little</i> es para incontables, y <i>concerns</i> es contable.',
            3: '<i>much</i> también es para incontables.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>¿Cuánto tarda el build?</b>',
          respuesta: 'How long does the build take?',
          respuestas: ['How long does the build take'],
          pista: 'Duración se pregunta con «how long».',
          porQue: '<b>How long</b> es la pregunta estándar sobre duración, y la más útil de la familia.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «¿Cada cuánto despliegan a producción?»',
          respuesta: 'How often do you deploy to production',
          porQue: '<b>How often</b> pregunta frecuencia. Con <i>How many times</i> pedirías un número concreto de veces.',
        },
      ],

      errores: [
        { mito: '<i>a few</i> y <i>few</i> son lo mismo, el artículo es opcional.',
          realidad: 'Cambia el <b>signo</b>. <i>a few</i> presenta la cantidad como suficiente («unas cuantas»); ' +
                    '<i>few</i> como insuficiente («pocas, casi ninguna»). En un code review, ' +
                    '<i>I have few concerns</i> suena a aprobación y <i>a few concerns</i> abre conversación.' },
        { mito: '<i>How much</i> solo pregunta por precio.',
          realidad: 'Pregunta por cualquier cantidad de algo <b>incontable</b>: <i>How much time?</i>, <i>How much work?</i> ' +
                    'Lo del precio es un caso particular, porque <i>money</i> es incontable.' },
        { mito: '<i>How often</i> y <i>How many times</i> son intercambiables.',
          realidad: '<i>How often</i> pregunta <b>frecuencia</b> (<i>Twice a week</i>); <i>How many times</i> pregunta ' +
                    'un <b>número concreto</b> de repeticiones (<i>Three times</i>). Son preguntas distintas.' },
      ],

      glosario: [
        { t: 'How many / how much', d: 'La distinción contable/incontable aplicada a preguntas de cantidad.' },
        { t: 'A few / few', d: 'Con artículo, suficiente. Sin artículo, insuficiente. El mismo par con <i>a little</i> / <i>little</i>.' },
        { t: 'How long', d: 'Duración o longitud. La pregunta estándar sobre estimaciones.' },
        { t: 'How often', d: 'Frecuencia. Distinta de <i>How many times</i>, que pide un número concreto.' },
        { t: 'A couple of', d: 'Un par de. En la práctica, dos o tres.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l3',
      titulo: 'Comparar dos cosas',
      minutos: 8,

      simple: `
        <p>Comparar es lo que necesitás para <b>justificar cualquier decisión técnica</b>. Y la regla
        depende de una sola cosa: <b>cuán largo es el adjetivo</b>.</p>

        <div class="analogia">
          <b>Corto (1 sílaba):</b> se le agrega <b>-er</b><br>
          fast → <span class="en" data-say>faster</span> · big → <span class="en" data-say>bigger</span><br><br>
          <b>Largo (3+ sílabas):</b> se le pone <b>more</b> delante<br>
          expensive → <span class="en" data-say>more expensive</span> · complex → <span class="en" data-say>more complex</span>
        </div>

        <p>Y después va <b>than</b> para el segundo término:</p>
        <ul>
          <li><span class="en" data-say>Postgres is faster than SQLite for this.</span></li>
          <li><span class="en" data-say>This approach is more complex than the other one.</span></li>
        </ul>

        <h4>Los de dos sílabas</h4>
        <p>Es la zona gris. Los que terminan en <b>-y</b> llevan <b>-ier</b>:</p>
        <ul>
          <li>easy → <span class="en" data-say>easier</span></li>
          <li>busy → <span class="en" data-say>busier</span></li>
          <li>heavy → <span class="en" data-say>heavier</span></li>
        </ul>
        <p>Los demás de dos sílabas suelen ir con <i>more</i>: <i>more useful</i>, <i>more common</i>.
        Si dudás, <b>more</b> casi nunca suena mal.</p>

        <h4>Los irregulares — son tres</h4>
        <table>
          <tr><th>Adjetivo</th><th>Comparativo</th></tr>
          <tr><td>good</td><td><span class="en" data-say>better</span></td></tr>
          <tr><td>bad</td><td><span class="en" data-say>worse</span></td></tr>
          <tr><td>far</td><td><span class="en" data-say>further</span></td></tr>
        </table>

        <div class="aviso">
          <b>El error más común: usar los dos a la vez.</b><br><br>
          ❌ <i>more faster</i> · ❌ <i>more better</i><br>
          ✅ <span class="en" data-say>faster</span> · ✅ <span class="en" data-say>better</span><br><br>
          Va uno o el otro, nunca los dos.
        </div>

        <h4>Decir que son iguales</h4>
        <ul>
          <li><span class="en" data-say>It's as fast as the other one.</span> — tan rápido como</li>
          <li><span class="en" data-say>It's not as fast as I expected.</span> — no tan rápido como</li>
          <li><span class="en" data-say>They're about the same.</span> — son más o menos iguales</li>
        </ul>

        <h4>Y matizar la diferencia</h4>
        <ul>
          <li><span class="en" data-say>a bit faster</span> — un poco más rápido</li>
          <li><span class="en" data-say>much faster</span> — mucho más rápido</li>
          <li><span class="en" data-say>slightly more complex</span> — levemente más complejo</li>
        </ul>
      `,

      tecnico: `
        <p>El comparativo tiene dos estrategias: <b>sintética</b> (sufijo <i>-er</i>) y <b>analítica</b>
        (<i>more</i> + adjetivo). La elección depende de la <b>longitud fonológica</b>.</p>

        <table>
          <tr><th>Sílabas</th><th>Estrategia</th><th>Ejemplos</th></tr>
          <tr><td>1</td><td>-er</td><td>fast → faster, big → bigger</td></tr>
          <tr><td>2 terminadas en -y</td><td>-ier</td><td>easy → easier, busy → busier</td></tr>
          <tr><td>2 (resto)</td><td>variable, tiende a <i>more</i></td><td>more useful, more common</td></tr>
          <tr><td>3 o más</td><td>more</td><td>more expensive, more complicated</td></tr>
        </table>

        <div class="nota-tec">
          <b>Las reglas de escritura son las mismas de siempre:</b>
          <br>· CVC con acento final dobla: <i>big → bigger</i>, <i>hot → hotter</i>
          <br>· termina en <i>-e</i>: solo se agrega <i>-r</i>: <i>large → larger</i>
          <br>· consonante + <i>y</i>: <i>y → ier</i>: <i>easy → easier</i>
          <br><br>
          Son idénticas a las del <i>-ing</i>, el <i>-ed</i> y el plural. Una sola vez que las
          aprendés, sirven para las cuatro terminaciones.
        </div>

        <p><b>La doble marcación</b> (❌ <i>more faster</i>) es agramatical en inglés estándar.
        Existió históricamente —Shakespeare escribió <i>more better</i>— pero hoy se lee como error.</p>

        <p><b>Sobre <i>than</i> y <i>that</i>.</b> Se confunden mucho al escribir porque suenan parecido
        en habla rápida. <i>than</i> compara, <i>that</i> introduce una subordinada:</p>
        <ul>
          <li><i>It's faster <b>than</b> the other one.</i></li>
          <li><i>I think <b>that</b> it's faster.</i></li>
        </ul>

        <p><b>Sobre las estructuras de igualdad.</b> <i>as … as</i> es el comparativo de igualdad, y su
        negación es muy útil para matizar sin sonar negativo:</p>
        <ul>
          <li><i>It's not as fast as I expected.</i> — más suave que <i>It's slow</i></li>
          <li><i>It's not as simple as it looks.</i> — advertencia estándar</li>
        </ul>

        <p><b>Y los intensificadores del comparativo</b>, que son distintos de los del adjetivo simple:</p>
        <table>
          <tr><th>Con adjetivo</th><th>Con comparativo</th></tr>
          <tr><td>very fast</td><td>much faster · a lot faster</td></tr>
          <tr><td>quite fast</td><td>a bit faster · slightly faster</td></tr>
        </table>
        <p>❌ <i>very faster</i> no existe. Con comparativos va <b>much</b>, no <i>very</i>.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cómo se forma el comparativo según la longitud del adjetivo">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">La regla es la longitud del adjetivo</text>

          <g>
            <rect x="34" y="40" width="196" height="104" rx="10" fill="#34d399" opacity="0.11" stroke="#34d399" stroke-width="1.3"/>
            <text x="132" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#34d399">1 SÍLABA</text>
            <text x="132" y="86" text-anchor="middle" font-size="17" font-weight="800" fill="#34d399">+ er</text>
            <text x="132" y="110" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">fast → faster</text>
            <text x="132" y="128" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">big → bigger</text>
          </g>

          <g>
            <rect x="242" y="40" width="196" height="104" rx="10" fill="#22d3ee" opacity="0.11" stroke="#22d3ee" stroke-width="1.3"/>
            <text x="340" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#22d3ee">2 SÍLABAS EN -Y</text>
            <text x="340" y="86" text-anchor="middle" font-size="17" font-weight="800" fill="#22d3ee">y → ier</text>
            <text x="340" y="110" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">easy → easier</text>
            <text x="340" y="128" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">busy → busier</text>
          </g>

          <g>
            <rect x="450" y="40" width="196" height="104" rx="10" fill="#c084fc" opacity="0.11" stroke="#c084fc" stroke-width="1.3"/>
            <text x="548" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#c084fc">3 O MÁS</text>
            <text x="548" y="86" text-anchor="middle" font-size="17" font-weight="800" fill="#c084fc">more +</text>
            <text x="548" y="110" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">more expensive</text>
            <text x="548" y="128" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">more complicated</text>
          </g>

          <rect x="34" y="156" width="612" height="30" rx="7" fill="#f87171" opacity="0.1"/>
          <text x="340" y="176" text-anchor="middle" font-size="12" font-weight="600" fill="#f87171">
            ✗ more faster · ✗ more better — va uno o el otro, nunca los dos
          </text>

          <line x1="34" y1="200" x2="646" y2="200" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="220" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f59e0b">Los tres irregulares · y cómo matizar</text>

          <g font-size="12.5">
            <rect x="60" y="230" width="256" height="42" rx="8" fill="#fbbf24" opacity="0.11"/>
            <text x="188" y="248" text-anchor="middle" font-weight="700" fill="currentColor" opacity="0.9">good → better</text>
            <text x="188" y="264" text-anchor="middle" fill="currentColor" opacity="0.8">bad → worse · far → further</text>

            <rect x="364" y="230" width="256" height="42" rx="8" fill="#22d3ee" opacity="0.1"/>
            <text x="492" y="248" text-anchor="middle" font-weight="700" fill="currentColor" opacity="0.9">much faster · a bit faster</text>
            <text x="492" y="264" text-anchor="middle" font-size="11.5" fill="#f87171">✗ very faster</text>
          </g>
        </svg>`,
        pie: 'Tres moldes, tres irregulares, y un error que evitar. Nada más.',
      },

      escucha: {
        intro: '<p>Comparaciones técnicas. Son las frases con las que se justifica una decisión.</p>',
        items: [
          { texto: 'Postgres is faster than SQLite for this use case.', es: 'Postgres es más rápido que SQLite para este caso.',
            nota: '<b>faster than</b>: adjetivo de una sílaba, así que <i>-er</i>.' },
          { texto: 'This approach is more complex, but it scales better.', es: 'Este enfoque es más complejo, pero escala mejor.',
            nota: '<b>more complex</b> y <b>better</b> en la misma frase: uno analítico y uno irregular.' },
          { texto: "It's not as simple as it looks.", es: 'No es tan simple como parece.',
            nota: 'Comparativo de igualdad en negativo. Es una advertencia estándar.' },
          { texto: 'The new version is a bit slower but much more stable.', es: 'La versión nueva es un poco más lenta pero mucho más estable.',
            nota: '<b>a bit</b> y <b>much</b> son los intensificadores del comparativo. ❌ <i>very slower</i> no existe.' },
        ],
      },

      practica: `
        <p><b>Compará dos herramientas que uses</b>, cinco frases:</p>
        <ol>
          <li>X is ______er than Y.</li>
          <li>X is more ______ than Y.</li>
          <li>X is not as ______ as Y.</li>
          <li>X is much ______ than Y.</li>
          <li>They're about the same, but X is a bit ______.</li>
        </ol>

        <p><b>Ese ejercicio es literalmente una respuesta de entrevista técnica.</b> «¿Por qué elegiste
        X?» se contesta comparando: más rápido, más simple, más barato de mantener, mejor documentado.</p>

        <p><b>Y las tres cosas a vigilar:</b></p>
        <ul>
          <li>Nunca <i>more</i> + <i>-er</i> juntos</li>
          <li>Con comparativo va <b>much</b>, no <i>very</i></li>
          <li><i>than</i> compara, <i>that</i> introduce una subordinada — se confunden al escribir</li>
        </ul>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Escribí el comparativo de <b>fast</b>.',
          respuesta: 'faster',
          porQue: 'Una sílaba → sufijo <b>-er</b>.',
        },
        {
          tipo: 'hueco',
          p: 'Escribí el comparativo de <b>easy</b>.',
          respuesta: 'easier',
          porQue: 'Dos sílabas terminadas en <i>-y</i> → <b>-ier</b>. Misma regla que el plural y el pasado.',
        },
        {
          tipo: 'hueco',
          p: 'Escribí el comparativo de <b>good</b>.',
          respuesta: 'better',
          porQue: 'Es uno de los tres irregulares: good → better, bad → worse, far → further.',
        },
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: [
            'This is more faster than the other one.',
            'This is faster than the other one.',
            'This is more fast that the other one.',
            'This is very faster than the other one.',
          ],
          correcta: 1,
          porQue: 'Un solo mecanismo: o <i>-er</i> o <i>more</i>, nunca los dos. Y con comparativos va <b>much</b>, no <i>very</i>.',
          porQueNo: {
            0: 'Doble marcación: <i>more</i> y <i>-er</i> juntos es agramatical.',
            2: 'Dos errores: <i>more fast</i> por <i>faster</i>, y <i>that</i> por <i>than</i>.',
            3: '❌ <i>very faster</i> no existe: con comparativos se usa <i>much</i>.',
          },
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «No es tan simple como parece.»',
          respuesta: "It's not as simple as it looks",
          porQue: 'Comparativo de igualdad en negativo: <b>not as … as</b>. Es una advertencia estándar.',
        },
      ],

      errores: [
        { mito: 'Para enfatizar puedo decir <i>more faster</i> o <i>more better</i>.',
          realidad: 'Es <b>doble marcación</b> y es agramatical en inglés estándar. Va uno o el otro: ' +
                    '<i>faster</i>, <i>better</i>. Existió históricamente —Shakespeare lo escribía— pero hoy se lee como error.' },
        { mito: 'Para intensificar un comparativo se usa <i>very</i>.',
          realidad: '❌ <i>very faster</i>. Con comparativos van <b>much</b>, <b>a lot</b>, <b>a bit</b> o <b>slightly</b>. ' +
                    '<i>very</i> solo acompaña al adjetivo simple: <i>very fast</i>.' },
        { mito: '<i>than</i> y <i>that</i> son intercambiables.',
          realidad: 'Suenan parecido en habla rápida pero hacen cosas distintas: <b>than</b> compara ' +
                    '(<i>faster than</i>) y <b>that</b> introduce una subordinada (<i>I think that…</i>). ' +
                    'Es un error frecuente al escribir.' },
      ],

      glosario: [
        { t: 'Comparativo', d: 'La forma que compara dos cosas. Sintética (<i>-er</i>) para adjetivos cortos, analítica (<i>more</i>) para largos.' },
        { t: 'Than', d: 'Introduce el segundo término de la comparación. No confundir con <i>that</i>.' },
        { t: 'As … as', d: 'Comparativo de igualdad. En negativo (<i>not as … as</i>) sirve para matizar sin sonar duro.' },
        { t: 'Much / a bit', d: 'Los intensificadores del comparativo. Nunca <i>very</i>.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l4',
      titulo: 'El mejor, el peor, el más',
      minutos: 8,

      simple: `
        <p>El superlativo señala el extremo de un grupo. La regla es igual a la del comparativo,
        pero con <b>the</b> adelante:</p>

        <div class="analogia">
          <b>Corto:</b> the + adjetivo + <b>-est</b><br>
          fast → <span class="en" data-say>the fastest</span> · big → <span class="en" data-say>the biggest</span><br><br>
          <b>Largo:</b> the <b>most</b> + adjetivo<br>
          expensive → <span class="en" data-say>the most expensive</span>
        </div>

        <p><b>El <i>the</i> es obligatorio.</b> A diferencia del comparativo, que no lleva artículo,
        el superlativo siempre lo lleva: ❌ <i>It's fastest option</i> → ✅ <i>It's <b>the</b> fastest option</i>.</p>

        <h4>Los mismos tres irregulares</h4>
        <table>
          <tr><th>Adjetivo</th><th>Comparativo</th><th>Superlativo</th></tr>
          <tr><td>good</td><td>better</td><td><span class="en" data-say>the best</span></td></tr>
          <tr><td>bad</td><td>worse</td><td><span class="en" data-say>the worst</span></td></tr>
          <tr><td>far</td><td>further</td><td><span class="en" data-say>the furthest</span></td></tr>
        </table>

        <h4>Delimitar el grupo</h4>
        <p>Casi siempre se aclara <b>entre qué</b> es el más:</p>
        <ul>
          <li><span class="en" data-say>It's the fastest option we have.</span></li>
          <li><span class="en" data-say>That's the best solution for now.</span></li>
          <li><span class="en" data-say>It's the most common error in this codebase.</span></li>
          <li><span class="en" data-say>That was the worst deploy of the year.</span></li>
        </ul>

        <div class="aviso">
          <b>La frase más útil de esta lección:</b><br>
          <span class="en" data-say>It's the simplest option that works.</span><br><br>
          Es una justificación completa para casi cualquier decisión técnica, y suena a criterio,
          no a pereza. Combinada con la del módulo 8 —<i>the trade-off was…</i>— tenés una respuesta
          de entrevista entera.
        </div>

        <h4>Matizar el superlativo</h4>
        <p>Afirmar que algo es «el mejor» es fuerte. Estas fórmulas lo suavizan:</p>
        <ul>
          <li><span class="en" data-say>one of the best</span> — uno de los mejores</li>
          <li><span class="en" data-say>probably the best</span> — probablemente el mejor</li>
          <li><span class="en" data-say>the best I've seen so far</span> — el mejor que vi hasta ahora</li>
          <li><span class="en" data-say>the best option for now</span> — la mejor por ahora</li>
        </ul>
        <p><b><i>one of the best</i> lleva plural detrás:</b> <i>one of the best tools</i>, no
        ❌ <i>one of the best tool</i>.</p>
      `,

      tecnico: `
        <p>El superlativo sigue exactamente el mismo criterio de longitud que el comparativo:</p>

        <table>
          <tr><th>Sílabas</th><th>Comparativo</th><th>Superlativo</th></tr>
          <tr><td>1</td><td>fast<b>er</b></td><td>the fast<b>est</b></td></tr>
          <tr><td>2 en -y</td><td>eas<b>ier</b></td><td>the eas<b>iest</b></td></tr>
          <tr><td>3+</td><td><b>more</b> expensive</td><td>the <b>most</b> expensive</td></tr>
        </table>

        <div class="nota-tec">
          <b>Por qué el superlativo lleva <i>the</i> y el comparativo no.</b> El superlativo señala un
          referente <b>único e identificable</b> dentro de un conjunto — «el más rápido» solo puede ser uno.
          Eso es exactamente la condición del artículo definido que viste en el módulo 2.
          <br><br>
          El comparativo no identifica: compara. Por eso no lleva artículo.
        </div>

        <p><b>Sobre delimitar el conjunto.</b> Un superlativo sin grupo explícito es una afirmación
        universal, y en contexto técnico eso suele ser exagerado. Las delimitaciones más usadas:</p>
        <ul>
          <li><i>…in this codebase</i></li>
          <li><i>…that I've seen</i></li>
          <li><i>…for this use case</i></li>
          <li><i>…for now</i></li>
        </ul>
        <p><i>It's the fastest option for this use case</i> es una afirmación defendible;
        <i>It's the fastest option</i> a secas invita a que alguien la refute.</p>

        <p><b>Sobre <i>one of the</i> + superlativo.</b> Requiere <b>plural</b> porque el conjunto tiene
        varios miembros: <i>one of the best <b>tools</b></i>. Es un error frecuente y bastante visible.</p>

        <p><b>Sobre <i>the most</i> con adjetivos de dos sílabas.</b> Muchos admiten las dos formas:
        <i>the commonest</i> y <i>the most common</i> son ambos correctos, con preferencia moderna por
        la forma analítica. Ante la duda, <b>the most</b> nunca suena mal.</p>

        <p><b>Y un uso distinto de <i>most</i>:</b> sin <i>the</i>, significa «la mayoría».
        <i>Most developers use Git</i> — no es superlativo, es cuantificador. Se distingue por la
        ausencia de artículo.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparativo y superlativo lado a lado, y cómo delimitar el grupo">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Comparativo y superlativo</text>

          <g font-size="12.5">
            <rect x="34" y="40" width="290" height="106" rx="10" fill="#22d3ee" opacity="0.09" stroke="#22d3ee" stroke-width="1.3"/>
            <text x="179" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#22d3ee">COMPARATIVO</text>
            <text x="179" y="82" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.65">sin artículo</text>
            <text x="179" y="106" text-anchor="middle" fill="currentColor" opacity="0.9">faster · easier</text>
            <text x="179" y="126" text-anchor="middle" fill="currentColor" opacity="0.9">more expensive</text>

            <rect x="356" y="40" width="290" height="106" rx="10" fill="#c084fc" opacity="0.09" stroke="#c084fc" stroke-width="1.3"/>
            <text x="501" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#c084fc">SUPERLATIVO</text>
            <text x="501" y="82" text-anchor="middle" font-size="11" font-weight="700" fill="#c084fc">THE obligatorio</text>
            <text x="501" y="106" text-anchor="middle" fill="currentColor" opacity="0.9">the fastest · the easiest</text>
            <text x="501" y="126" text-anchor="middle" fill="currentColor" opacity="0.9">the most expensive</text>
          </g>

          <rect x="34" y="158" width="612" height="30" rx="7" fill="#fbbf24" opacity="0.11"/>
          <text x="340" y="178" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.9">
            good → better → the best · bad → worse → the worst · far → further → the furthest
          </text>

          <text x="340" y="210" text-anchor="middle" font-size="12.5" font-weight="700" fill="#34d399">Delimitá el grupo o te lo refutan</text>

          <g font-size="12">
            <rect x="60" y="220" width="256" height="42" rx="8" fill="#f87171" opacity="0.1"/>
            <text x="188" y="238" text-anchor="middle" fill="#f87171">It's the fastest option.</text>
            <text x="188" y="254" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">afirmación universal, discutible</text>

            <rect x="364" y="220" width="256" height="42" rx="8" fill="#34d399" opacity="0.12"/>
            <text x="492" y="238" text-anchor="middle" fill="#34d399">…for this use case.</text>
            <text x="492" y="254" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">defendible</text>
          </g>
        </svg>`,
        pie: 'La única diferencia de forma es el "the". La de fondo es cuánto estás afirmando.',
      },

      escucha: {
        intro: '<p>Superlativos en contexto técnico. Fijate cómo casi todos delimitan el grupo.</p>',
        items: [
          { texto: "It's the simplest option that works.", es: 'Es la opción más simple que funciona.',
            nota: 'La frase más útil de la lección: justificación completa que suena a criterio, no a pereza.' },
          { texto: "That's the best solution for now.", es: 'Es la mejor solución por ahora.',
            nota: '<b>for now</b> delimita: no estás afirmando que sea la mejor para siempre.' },
          { texto: "It's the most common error in this codebase.", es: 'Es el error más común de este código.',
            nota: '<b>in this codebase</b> delimita el conjunto. Sin eso sería una afirmación universal.' },
          { texto: "It's one of the best tools I've used.", es: 'Es una de las mejores herramientas que usé.',
            nota: '<b>one of the best</b> lleva <b>plural</b> detrás: <i>tools</i>, no <i>tool</i>.' },
        ],
      },

      practica: `
        <p><b>Justificá tres decisiones técnicas tuyas</b> usando superlativo delimitado:</p>
        <ol>
          <li>It's the ______est option for ______.</li>
          <li>It's the most ______ solution we have.</li>
          <li>It's one of the best ______ I've used.</li>
        </ol>

        <p><b>Y armá la respuesta completa de entrevista</b>, juntando este módulo con el 8:</p>
        <div class="analogia">
          <span class="en" data-say>I used a queue instead of a cron job. It was the simplest option that worked for this case. The trade-off was a bit more setup, but it scales better. I didn't use a cron because it would block the request.</span>
        </div>

        <p>Cuatro frases. Decisión, justificación, contrapartida y alternativa descartada. <b>Eso es
        una respuesta técnica completa</b>, y toda la gramática que necesita está en A1.</p>

        <p><b>Y las tres cosas a vigilar:</b> el <i>the</i> obligatorio, delimitar el grupo,
        y el plural después de <i>one of the</i>.</p>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Escribí el superlativo de <b>fast</b> (con artículo).',
          respuesta: 'the fastest',
          respuestas: ['fastest'],
          porQue: 'Una sílaba → <b>-est</b>, y el <b>the</b> es obligatorio en el superlativo.',
        },
        {
          tipo: 'hueco',
          p: 'Escribí el superlativo de <b>bad</b> (con artículo).',
          respuesta: 'the worst',
          respuestas: ['worst'],
          porQue: 'Es irregular: bad → worse → <b>the worst</b>.',
        },
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: [
            "It's one of the best tool I've used.",
            "It's one of the best tools I've used.",
            "It's one of best tools I've used.",
            "It's one of the most best tools I've used.",
          ],
          correcta: 1,
          porQue: '<b>one of the best</b> requiere <b>plural</b>: el conjunto tiene varios miembros.',
          porQueNo: {
            0: 'Le falta el plural en <i>tool</i>.',
            2: 'Le falta el artículo <i>the</i>.',
            3: 'Doble marcación: <i>most</i> y <i>best</i> juntos.',
          },
        },
        {
          tipo: 'opcion',
          p: 'Querés justificar una decisión sin que te la refuten. ¿Cuál es mejor?',
          opciones: [
            "It's the fastest option.",
            "It's the fastest option for this use case.",
            "It's fastest option.",
            "It's the most fast option.",
          ],
          correcta: 1,
          porQue: 'Delimitar el grupo convierte una afirmación universal —discutible— en una <b>defendible</b>.',
          porQueNo: {
            0: 'Sin delimitar es una afirmación universal, e invita a que alguien la refute.',
            2: 'Le falta el <i>the</i>, que en el superlativo es obligatorio.',
            3: '<i>fast</i> es de una sílaba: va <i>the fastest</i>, no <i>the most fast</i>.',
          },
        },
        {
          tipo: 'ordenar',
          p: 'Armá la frase clave: «Es la opción más simple que funciona.»',
          respuesta: "It's the simplest option that works",
          porQue: 'Justificación completa que suena a criterio. Combinada con <i>the trade-off was…</i> tenés una respuesta de entrevista entera.',
        },
      ],

      errores: [
        { mito: 'El <i>the</i> del superlativo es opcional.',
          realidad: 'Es <b>obligatorio</b>: ❌ <i>It\'s fastest option</i> → ✅ <i>It\'s <b>the</b> fastest option</i>. ' +
                    'La razón es que el superlativo señala un referente único e identificable, que es exactamente ' +
                    'la condición del artículo definido.' },
        { mito: '<i>one of the best</i> puede ir con singular.',
          realidad: '❌ <i>one of the best tool</i>. Va <b>plural</b>: <i>one of the best tool<b>s</b></i>. ' +
                    'El conjunto del que elegís «uno» tiene varios miembros. Es un error frecuente y visible.' },
        { mito: 'Un superlativo suena más contundente sin delimitar el grupo.',
          realidad: 'Suena más <b>discutible</b>. <i>It\'s the fastest option</i> es una afirmación universal e invita ' +
                    'a que la refuten; <i>…for this use case</i> es defendible. En contexto técnico, ' +
                    'delimitar suma credibilidad, no la quita.' },
      ],

      glosario: [
        { t: 'Superlativo', d: 'El extremo de un grupo. Lleva <i>the</i> obligatorio, y sigue el mismo criterio de longitud que el comparativo.' },
        { t: 'One of the best', d: 'Uno de los mejores. Siempre con <b>plural</b> detrás.' },
        { t: 'Most sin the', d: 'Cuando no lleva artículo no es superlativo sino cuantificador: <i>Most developers use Git</i> = la mayoría.' },
        { t: 'For this use case', d: 'Para este caso. La delimitación más útil para que un superlativo técnico sea defendible.' },
      ],
    },
  ],

  /* ==================================================================== */
  vocabulario: [
    { en: 'how many', es: 'cuántos', pista: 'Para contables.', ejemplo: 'How many open tickets do we have?', ejemploEs: '¿Cuántos tickets abiertos tenemos?' },
    { en: 'how much', es: 'cuánto', pista: 'Para incontables.', ejemplo: 'How much time do we have?', ejemploEs: '¿Cuánto tiempo tenemos?' },
    { en: 'how long', es: 'cuánto tarda / cuán largo', ejemplo: 'How long does the build take?', ejemploEs: '¿Cuánto tarda el build?' },
    { en: 'how often', es: 'cada cuánto', ejemplo: 'How often do you deploy?', ejemploEs: '¿Cada cuánto despliegan?' },
    { en: 'which', es: 'cuál (entre opciones conocidas)', ejemplo: 'Which branch should I use?', ejemploEs: '¿Qué rama debería usar?' },
    { en: 'whose', es: 'de quién', ejemplo: 'Whose PR is this?', ejemploEs: '¿De quién es este PR?' },
    { en: 'a few', es: 'unos cuantos', pista: 'Con artículo: neutro.', ejemplo: 'I have a few questions.', ejemploEs: 'Tengo unas cuantas preguntas.' },
    { en: 'a little', es: 'un poco', pista: 'Para incontables.', ejemplo: 'We have a little time left.', ejemploEs: 'Nos queda un poco de tiempo.' },
    { en: 'most of', es: 'la mayoría de', ejemplo: 'Most of the tests pass.', ejemploEs: 'La mayoría de los tests pasan.' },
    { en: 'none of', es: 'ninguno de', ejemplo: 'None of the tests pass.', ejemploEs: 'Ninguno de los tests pasa.' },
    { en: 'than', es: 'que (comparando)', pista: 'No confundir con that.', ejemplo: 'It is faster than the other one.', ejemploEs: 'Es más rápido que el otro.' },
    { en: 'better', es: 'mejor', pista: 'Irregular: good → better.', ejemplo: 'It scales better.', ejemploEs: 'Escala mejor.' },
    { en: 'worse', es: 'peor', pista: 'Irregular: bad → worse.', ejemplo: 'The new version is worse.', ejemploEs: 'La versión nueva es peor.' },
    { en: 'the best', es: 'el mejor', ejemplo: "That's the best solution for now.", ejemploEs: 'Es la mejor solución por ahora.' },
    { en: 'the worst', es: 'el peor', ejemplo: 'That was the worst deploy of the year.', ejemploEs: 'Fue el peor deploy del año.' },
    { en: 'simplest', es: 'el más simple', ejemplo: "It's the simplest option that works.", ejemploEs: 'Es la opción más simple que funciona.' },
    { en: 'as … as', es: 'tan … como', ejemplo: "It's not as simple as it looks.", ejemploEs: 'No es tan simple como parece.' },
    { en: 'a bit', es: 'un poco', pista: 'Intensificador de comparativo.', ejemplo: "It's a bit slower.", ejemploEs: 'Es un poco más lento.' },
    { en: 'much', es: 'mucho (con comparativo)', pista: 'Nunca "very faster".', ejemplo: "It's much faster.", ejemploEs: 'Es mucho más rápido.' },
    { en: 'slightly', es: 'levemente', ejemplo: "It's slightly more complex.", ejemploEs: 'Es levemente más complejo.' },
    { en: 'about the same', es: 'más o menos igual', ejemplo: "They're about the same.", ejemploEs: 'Son más o menos iguales.' },
    { en: 'use case', es: 'caso de uso', ejemplo: "It's the fastest option for this use case.", ejemploEs: 'Es la opción más rápida para este caso de uso.' },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es el orden correcto de una pregunta en inglés?',
      opciones: [
        'Sujeto + auxiliar + verbo',
        'Palabra de pregunta + auxiliar + sujeto + verbo',
        'Verbo + sujeto + palabra de pregunta',
        'Cualquiera, la entonación lo marca',
      ],
      correcta: 1,
      porQue: '<i>What did you do?</i>, <i>Why does it fail?</i> El orden es rígido y <b>es</b> la marca de interrogación.',
      porQueNo: {
        0: 'Ese es el orden de una afirmación.',
        2: 'No existe ese orden.',
        3: 'Eso funciona en español; en inglés la entonación sola comunica incredulidad, no pregunta neutra.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: [
        'On what are you working?',
        'What are you working on?',
        'What on are you working?',
        'What you are working on?',
      ],
      correcta: 1,
      porQue: 'En inglés la preposición queda <b>colgando al final</b>. Es una particularidad que pocas lenguas tienen.',
      porQueNo: {
        0: 'Gramatical pero muy formal: suena a documento legal.',
        2: 'La preposición no puede ir ahí.',
        3: 'Le falta la inversión.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: [
        'Do you know where is the config file?',
        'Do you know where the config file is?',
        'Do you know where is it the config?',
        'You know where is the config file?',
      ],
      correcta: 1,
      porQue: 'En una pregunta <b>indirecta</b> se pierde la inversión: el orden vuelve al de una frase normal.',
      porQueNo: {
        0: 'Mantiene la inversión. Es un error muy común y bastante visible.',
        2: 'Duplica el sujeto.',
        3: 'Le falta el auxiliar de la pregunta principal.',
      },
    },
    {
      p: '¿Cuál va con <b>time</b>?',
      opciones: ['How many time', 'How much time', 'How long time', 'How few time'],
      correcta: 1,
      porQue: '<b>time</b> es incontable → <i>how much</i>.',
      porQueNo: {
        0: '<i>how many</i> es para contables.',
        2: '<i>How long</i> va solo, sin <i>time</i>: <i>How long does it take?</i>',
        3: '<i>few</i> no se combina así, y además es para contables.',
      },
    },
    {
      p: 'En un code review querés decir que tenés algunas dudas, sin sonar negativo. ¿Cuál va?',
      opciones: ['I have few concerns.', 'I have a few concerns.', 'I have little concerns.', 'I have much concerns.'],
      correcta: 1,
      porQue: '<b>a few</b> con artículo es neutro. Sin artículo, <i>few</i> presenta la cantidad como insuficiente y suena a aprobación.',
      porQueNo: {
        0: 'Diría casi lo contrario: «tengo pocas, casi ninguna».',
        2: '<i>little</i> es para incontables.',
        3: '<i>much</i> también es para incontables.',
      },
    },
    {
      p: '¿Cuál es el comparativo de <b>easy</b>?',
      opciones: ['more easy', 'easyer', 'easier', 'most easy'],
      correcta: 2,
      porQue: 'Dos sílabas terminadas en <i>-y</i> → <b>-ier</b>. Es la misma regla del plural y del pasado.',
      porQueNo: {
        0: 'Los adjetivos cortos terminados en -y usan el sufijo, no <i>more</i>.',
        1: 'La <i>y</i> cambia a <i>i</i>.',
        3: 'Eso sería un superlativo, y además mal formado.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: [
        'This is more faster than the other one.',
        'This is faster than the other one.',
        'This is more fast that the other one.',
        'This is very faster than the other one.',
      ],
      correcta: 1,
      porQue: 'Un solo mecanismo: o <i>-er</i> o <i>more</i>, nunca los dos.',
      porQueNo: {
        0: 'Doble marcación, agramatical en inglés estándar.',
        2: 'Dos errores: <i>more fast</i> y <i>that</i> por <i>than</i>.',
        3: '❌ <i>very faster</i> no existe: con comparativos va <i>much</i>.',
      },
    },
    {
      p: '¿Cómo se intensifica un comparativo?',
      opciones: ['very faster', 'much faster', 'so faster', 'too faster'],
      correcta: 1,
      porQue: 'Con comparativos van <b>much</b>, <b>a lot</b>, <b>a bit</b> o <b>slightly</b>. <i>very</i> solo acompaña al adjetivo simple.',
      porQueNo: {
        0: 'No existe: <i>very</i> va con el adjetivo, no con el comparativo.',
        2: 'Tampoco funciona.',
        3: 'Tampoco.',
      },
    },
    {
      p: '¿Cuál es el superlativo de <b>bad</b>?',
      opciones: ['the baddest', 'the worse', 'the worst', 'the most bad'],
      correcta: 2,
      porQue: 'Irregular: bad → worse → <b>the worst</b>.',
      porQueNo: {
        0: 'No existe en inglés estándar.',
        1: '<i>worse</i> es el comparativo, no el superlativo.',
        3: 'Los irregulares no admiten la forma analítica.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: [
        "It's one of the best tool I've used.",
        "It's one of the best tools I've used.",
        "It's one of best tools I've used.",
        "It's the one of best tools I've used.",
      ],
      correcta: 1,
      porQue: '<b>one of the best</b> requiere <b>plural</b>: el conjunto del que elegís «uno» tiene varios miembros.',
      porQueNo: {
        0: 'Le falta el plural.',
        2: 'Le falta el artículo <i>the</i>.',
        3: 'El artículo está mal ubicado.',
      },
    },
    {
      p: '¿Por qué el superlativo lleva <i>the</i> y el comparativo no?',
      opciones: [
        'Es una convención sin explicación',
        'Porque el superlativo señala un referente único e identificable, que es la condición del artículo definido',
        'Porque el comparativo siempre va al final',
        'Porque the solo se usa con adjetivos largos',
      ],
      correcta: 1,
      porQue: '«El más rápido» solo puede ser uno. El comparativo, en cambio, no identifica: compara.',
      porQueNo: {
        0: 'Sí tiene explicación, y conecta con el módulo 2.',
        2: 'La posición no tiene nada que ver.',
        3: 'El <i>the</i> va con todos los superlativos, cortos y largos.',
      },
    },
    {
      p: 'Querés justificar una decisión técnica sin que te la refuten. ¿Cuál es mejor?',
      opciones: [
        "It's the fastest option.",
        "It's the fastest option for this use case.",
        "It's fastest option.",
        "It's more faster option.",
      ],
      correcta: 1,
      porQue: 'Delimitar el grupo convierte una afirmación universal —discutible— en una defendible.',
      porQueNo: {
        0: 'Sin delimitar invita a que alguien la refute con un contraejemplo.',
        2: 'Le falta el <i>the</i> obligatorio.',
        3: 'Doble marcación y le falta el artículo.',
      },
    },
  ],
});
