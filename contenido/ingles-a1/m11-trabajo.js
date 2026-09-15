/* ==========================================================================
   Inglés A1 · m11 — Tu trabajo en inglés
   El módulo integrador: todo lo anterior aplicado al contexto real.
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ingles-a1',
  id: 'm11',
  titulo: 'Tu trabajo en inglés',
  fuentes: ['bbc-learning-english', 'cambridge-dic', 'cefr', 'youglish'],

  intro:
    '<p>Último módulo, y no trae gramática nueva: <b>aplica todo lo anterior</b> a las cuatro ' +
    'situaciones donde de verdad vas a usar el inglés.</p>' +
    '<p>Presentarte al equipo. Participar en una reunión sin quedarte callado. Escribir un mensaje, ' +
    'un PR o un mail. Y pasar la parte en inglés de una entrevista técnica.</p>' +
    '<p><b>Una aclaración honesta:</b> A1 no te alcanza para una conversación libre y fluida. ' +
    'Pero <b>sí te alcanza para todo esto</b>, porque las cuatro situaciones son <b>formulaicas</b>: ' +
    'tienen estructura fija y vocabulario acotado. Ese es el atajo, y este módulo te lo da.</p>',

  lecciones: [

    /* ==================================================================== */
    {
      id: 'l1',
      titulo: 'Tu primera semana en el equipo',
      minutos: 8,

      simple: `
        <p>Entrar a un equipo nuevo en inglés da nervios. La buena noticia es que las primeras
        conversaciones son <b>siempre las mismas</b>.</p>

        <h4>Presentarte</h4>
        <div class="analogia">
          <span class="en" data-say>Hi everyone, I'm Agustín. I'm a full stack developer, I'm from Argentina, and I'm joining the platform team. Nice to meet you all.</span>
        </div>
        <p>Cuatro frases. Preparalas y decilas hasta que salgan sin pensar — <b>en una call real,
        con nervios, solo sale bien lo que ya está automático</b>.</p>

        <h4>Las preguntas que te van a hacer</h4>
        <table>
          <tr><th>Te preguntan</th><th>Contestás</th></tr>
          <tr><td><span class="en" data-say>What's your background?</span></td><td>I've been a developer for X years.</td></tr>
          <tr><td><span class="en" data-say>What are you working on?</span></td><td>I'm starting with the onboarding.</td></tr>
          <tr><td><span class="en" data-say>How's it going so far?</span></td><td>Good, thanks. Still getting used to everything.</td></tr>
          <tr><td><span class="en" data-say>Do you have everything you need?</span></td><td>Almost — I still need access to X.</td></tr>
        </table>

        <h4>Pedir lo que te falta</h4>
        <p>La primera semana es toda pedir accesos. Las fórmulas:</p>
        <ul>
          <li><span class="en" data-say>Could you give me access to the repo?</span></li>
          <li><span class="en" data-say>Who should I ask about the VPN?</span></li>
          <li><span class="en" data-say>Where can I find the documentation?</span></li>
          <li><span class="en" data-say>Is there a guide for setting this up?</span></li>
        </ul>

        <div class="aviso">
          <b>La frase más valiosa de tu primera semana:</b><br>
          <span class="en" data-say>Sorry, I'm still learning the codebase. Could you explain how this works?</span><br><br>
          Nadie espera que sepas nada la primera semana. Preguntar temprano <b>se valora</b>;
          pasarte tres días trabado en silencio, no.
        </div>

        <h4>Y sobre tu inglés</h4>
        <p>Vale la pena decirlo una vez, al principio, y después no volver sobre el tema:</p>
        <p><span class="en" data-say>My English is still improving, so please tell me if I'm not clear.</span></p>
        <p>Eso invita a que te corrijan y baja la tensión. Repetirlo en cada reunión, en cambio,
        desvía la atención de lo que estás diciendo.</p>
      `,

      tecnico: `
        <p><b>Por qué el onboarding es el mejor momento para tu inglés.</b> Es la única etapa donde
        <b>se espera que preguntes todo</b>. Esa licencia se agota en unas semanas, así que conviene
        aprovecharla: es cuando podés pedir aclaraciones sin costo social.</p>

        <div class="nota-tec">
          <b>Sobre mencionar tu nivel de inglés.</b> Decirlo <b>una vez</b> es útil: baja expectativas,
          invita a que te corrijan y explica por qué a veces pedís que repitan.
          <br><br>
          Repetirlo constantemente tiene el efecto contrario: convierte tu inglés en el tema de la
          conversación en vez de tu trabajo. Una vez, al principio, y listo.
        </div>

        <p><b>Vocabulario de onboarding:</b></p>
        <table>
          <tr><th>Término</th><th>Significa</th></tr>
          <tr><td>onboarding</td><td>el proceso de incorporación</td></tr>
          <tr><td>codebase</td><td>el código del proyecto en conjunto</td></tr>
          <tr><td>access</td><td>permisos, accesos</td></tr>
          <tr><td>credentials</td><td>credenciales</td></tr>
          <tr><td>environment</td><td>entorno (dev, staging, prod)</td></tr>
          <tr><td>set up</td><td>configurar (verbo) · setup (sustantivo)</td></tr>
          <tr><td>walk me through</td><td>explicame paso a paso</td></tr>
          <tr><td>ramp up</td><td>ponerse al día, tomar velocidad</td></tr>
        </table>

        <p><b><i>Walk me through</i></b> es especialmente útil: pide una explicación <b>paso a paso</b>,
        que es exactamente lo que necesitás cuando no conocés un sistema.
        <i>Could you walk me through the deploy process?</i></p>

        <p><b>Sobre <i>How's it going?</i></b> Igual que <i>How are you?</i>, funciona más como saludo
        que como pregunta real. La respuesta esperada es breve y positiva. Si querés dar información
        real, agregala después: <i>Good, thanks. Still ramping up on the codebase.</i></p>

        <p><b>Sobre pedir por escrito.</b> En trabajo remoto, muchos pedidos van por Slack y no por
        voz. Eso te favorece: tenés tiempo de revisar. Aprovechalo — un mensaje bien escrito compensa
        mucho un inglés hablado todavía titubeante.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Las cuatro frases de presentación y el vocabulario de onboarding">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Tu presentación son cuatro frases</text>

          <g font-size="12.5">
            <rect x="34" y="38" width="612" height="30" rx="7" fill="#34d399" opacity="0.12" stroke="#34d399" stroke-width="1.1"/>
            <text x="52" y="58" fill="currentColor" opacity="0.9"><tspan font-weight="700" fill="#34d399">1</tspan>  Hi everyone, I'm Agustín.</text>

            <rect x="34" y="74" width="612" height="30" rx="7" fill="#22d3ee" opacity="0.11" stroke="#22d3ee" stroke-width="1.1"/>
            <text x="52" y="94" fill="currentColor" opacity="0.9"><tspan font-weight="700" fill="#22d3ee">2</tspan>  I'm a full stack developer, I'm from Argentina.</text>

            <rect x="34" y="110" width="612" height="30" rx="7" fill="#c084fc" opacity="0.11" stroke="#c084fc" stroke-width="1.1"/>
            <text x="52" y="130" fill="currentColor" opacity="0.9"><tspan font-weight="700" fill="#c084fc">3</tspan>  I'm joining the platform team.</text>

            <rect x="34" y="146" width="612" height="30" rx="7" fill="#fbbf24" opacity="0.11" stroke="#fbbf24" stroke-width="1.1"/>
            <text x="52" y="166" fill="currentColor" opacity="0.9"><tspan font-weight="700" fill="#fbbf24">4</tspan>  Nice to meet you all.</text>
          </g>

          <rect x="34" y="188" width="612" height="34" rx="8" fill="#f59e0b" opacity="0.11" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="340" y="209" text-anchor="middle" font-size="12" font-weight="600" fill="#f59e0b">
            Con nervios solo sale bien lo que ya está automático. Repetilas hasta que salgan solas.
          </text>

          <rect x="34" y="230" width="612" height="34" rx="8" fill="#34d399" opacity="0.1" stroke="#34d399" stroke-width="1.2"/>
          <text x="340" y="251" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.88">
            "Could you walk me through it?" — la frase que más te va a servir la primera semana
          </text>
        </svg>`,
        pie: 'La presentación es corta a propósito: una larga y trabada suena peor que una breve y clara.',
      },

      escucha: {
        intro: '<p>Conversaciones de onboarding. Son las que vas a tener en tu primera semana.</p>',
        items: [
          { texto: "Hi everyone, I'm Agustín. Nice to meet you all.", es: 'Hola a todos, soy Agustín. Un gusto conocerlos.',
            nota: '<b>you all</b> para marcar plural. El inglés no distingue «vos» de «ustedes», así que a veces se agrega.' },
          { texto: 'Could you walk me through the deploy process?', es: '¿Me podrías explicar el proceso de deploy paso a paso?',
            nota: '<b>walk me through</b> pide una explicación paso a paso. Es exactamente lo que necesitás al no conocer un sistema.' },
          { texto: "I'm still ramping up on the codebase.", es: 'Todavía me estoy poniendo al día con el código.',
            nota: '<b>ramp up</b> = ponerse al día, tomar velocidad. Vocabulario estándar de onboarding.' },
          { texto: 'Who should I ask about the VPN access?', es: '¿A quién le pregunto por el acceso a la VPN?',
            nota: 'Preguntar <b>a quién preguntarle</b> es una de las cosas más útiles de la primera semana.' },
          { texto: "My English is still improving, so please tell me if I'm not clear.", es: 'Mi inglés todavía está mejorando, así que decime si no soy claro.',
            nota: 'Decilo <b>una vez</b>, al principio. Repetirlo convierte tu inglés en el tema.' },
        ],
      },

      practica: `
        <p><b>Escribí tu presentación real</b> y decila diez veces en voz alta:</p>
        <ol>
          <li>Hi everyone, I'm ______.</li>
          <li>I'm a ______ and I'm from ______.</li>
          <li>I'm joining the ______ team.</li>
          <li>Nice to meet you all.</li>
        </ol>

        <p><b>Después practicá pedir cosas</b>, que es el 80% de la primera semana:</p>
        <ul>
          <li><span class="en" data-say>Could you give me access to the repo?</span></li>
          <li><span class="en" data-say>Who should I ask about this?</span></li>
          <li><span class="en" data-say>Where can I find the documentation?</span></li>
          <li><span class="en" data-say>Could you walk me through it?</span></li>
        </ul>

        <p><b>Y aprovechá la licencia del onboarding.</b> Es la única etapa donde se espera que
        preguntes todo, y se agota en unas semanas. Preguntar temprano se valora; pasarte tres días
        trabado en silencio, no.</p>
      `,

      ejercicios: [
        {
          tipo: 'traducir',
          p: 'Traducí: <b>¿Me podrías explicar cómo funciona esto?</b>',
          respuesta: 'Could you explain how this works?',
          respuestas: ['Could you explain how this works', 'Could you walk me through this?', 'Can you explain how this works?'],
          pista: 'Pregunta indirecta: sin inversión después de «how».',
          porQue: 'Fijate que va <b>how this works</b>, no ❌ <i>how does this work</i>: dentro de otra frase se pierde la inversión.',
        },
        {
          tipo: 'opcion',
          p: 'Es tu primera semana y no entendés una parte del sistema. ¿Qué hacés?',
          opciones: [
            'Investigar tres días solo antes de preguntar',
            'Preguntar: Sorry, I\'m still learning the codebase. Could you explain how this works?',
            'Decir que entendiste y buscarlo después',
            'Disculparte largamente por no saber',
          ],
          correcta: 1,
          porQue: 'Nadie espera que sepas nada la primera semana. Esa licencia se agota rápido: <b>aprovechala</b>.',
          porQueNo: {
            0: 'Tres días trabado en silencio es lo que sí queda mal.',
            2: 'Genera el problema real: terminás haciendo otra cosa.',
            3: 'Disculparse de más desvía el foco de la pregunta.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá: <b>Could you ______ me through the deploy process?</b> (explicar paso a paso)',
          respuesta: 'walk',
          porQue: '<b>walk me through</b> pide una explicación paso a paso. Es la fórmula estándar.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «¿A quién le pregunto por el acceso?»',
          respuesta: 'Who should I ask about the access',
          porQue: 'Preguntar <b>a quién preguntarle</b> es de lo más útil de la primera semana.',
        },
        {
          tipo: 'dictado',
          p: 'Escuchá y escribí. Es la frase de onboarding por excelencia.',
          respuesta: "I'm still ramping up on the codebase",
          porQue: '<b>ramp up</b> = ponerse al día. Y <b>codebase</b> es el código del proyecto en conjunto.',
        },
      ],

      errores: [
        { mito: 'Conviene esperar a entender bien antes de preguntar, para no molestar.',
          realidad: 'Durante el onboarding es <b>al revés</b>: es la única etapa donde se espera que preguntes todo, ' +
                    'y esa licencia se agota en unas semanas. Pasarse tres días trabado en silencio es lo que ' +
                    'sí queda mal.' },
        { mito: 'Hay que aclarar en cada reunión que tu inglés no es bueno.',
          realidad: 'Decilo <b>una vez</b>, al principio: baja expectativas e invita a que te corrijan. ' +
                    'Repetirlo convierte tu inglés en el tema de la conversación en vez de tu trabajo — ' +
                    'que es exactamente lo contrario de lo que querés.' },
        { mito: 'Una presentación larga demuestra más profesionalismo.',
          realidad: 'Una <b>corta y clara</b> suena más segura que una larga y trabada. Cuatro frases alcanzan. ' +
                    'Y con nervios solo sale bien lo que ya está automático, así que conviene tener poco ' +
                    'y tenerlo bien.' },
      ],

      glosario: [
        { t: 'Onboarding', d: 'El proceso de incorporación a un equipo. La etapa donde se espera que preguntes todo.' },
        { t: 'Codebase', d: 'El código del proyecto en conjunto. <i>I\'m still learning the codebase.</i>' },
        { t: 'Walk me through', d: 'Explicame paso a paso. La fórmula para pedir una explicación detallada.' },
        { t: 'Ramp up', d: 'Ponerse al día, tomar velocidad. <i>I\'m still ramping up.</i>' },
        { t: 'Access', d: 'Permisos, accesos. Incontable: <i>I need access to the repo</i>, no ❌ <i>accesses</i>.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l2',
      titulo: 'Participar en una reunión',
      minutos: 9,

      simple: `
        <p>El miedo real de una reunión en inglés no es no entender: es <b>querer decir algo y no
        encontrar el hueco</b>. Estas frases resuelven eso.</p>

        <h4>Pedir la palabra</h4>
        <ul>
          <li><span class="en" data-say>Can I add something?</span> — ¿puedo agregar algo?</li>
          <li><span class="en" data-say>Sorry, can I jump in?</span> — perdón, ¿puedo meterme?</li>
          <li><span class="en" data-say>Quick question —</span> — pregunta rápida</li>
          <li><span class="en" data-say>Just a thought —</span> — una idea nomás</li>
        </ul>
        <p><b><i>Sorry, can I jump in?</i></b> es la forma estándar de interrumpir sin quedar mal.
        En una call con varias personas, esperar el silencio perfecto no funciona: hay que pedirlo.</p>

        <h4>Estar de acuerdo</h4>
        <ul>
          <li><span class="en" data-say>That makes sense.</span></li>
          <li><span class="en" data-say>I agree.</span> — sin <i>am</i></li>
          <li><span class="en" data-say>Good point.</span></li>
          <li><span class="en" data-say>Exactly.</span></li>
        </ul>

        <h4>No estar de acuerdo, sin pelear</h4>
        <div class="aviso">
          El inglés de trabajo envuelve el desacuerdo. Decir <i>No, you're wrong</i> es correcto
          gramaticalmente y <b>suena agresivo</b>. Las fórmulas suaves:<br><br>
          <span class="en" data-say>I see your point, but…</span> — entiendo, pero…<br>
          <span class="en" data-say>I'm not sure about that.</span> — no estoy seguro de eso<br>
          <span class="en" data-say>Have we considered…?</span> — ¿consideramos…?<br>
          <span class="en" data-say>What if we…?</span> — ¿y si…?<br>
          <span class="en" data-say>That could work, but I'm worried about…</span>
        </div>
        <p><b><i>What if we…?</i></b> es especialmente útil: propone sin confrontar, y deja la idea
        sobre la mesa como una opción más.</p>

        <h4>Ganar tiempo mientras pensás</h4>
        <p>Esto es oro cuando el inglés te va más lento que la cabeza:</p>
        <ul>
          <li><span class="en" data-say>Let me think about that for a second.</span></li>
          <li><span class="en" data-say>That's a good question.</span></li>
          <li><span class="en" data-say>Hmm, it depends.</span></li>
          <li><span class="en" data-say>Let me check and get back to you.</span></li>
        </ul>

        <h4>Cuando perdiste el hilo</h4>
        <ul>
          <li><span class="en" data-say>Sorry, I missed that. Could you repeat it?</span></li>
          <li><span class="en" data-say>Sorry, I'm not following.</span></li>
          <li><span class="en" data-say>Just to confirm — you mean X, right?</span></li>
        </ul>
        <p><b><i>Just to confirm</i></b> es la mejor de todas: repetís con tus palabras lo que entendiste
        y el otro confirma o corrige. Resuelve el malentendido antes de que exista.</p>
      `,

      tecnico: `
        <p><b>El desacuerdo en inglés de trabajo es mitigado por defecto.</b> Igual que con los pedidos
        del módulo 5, la fuerza del acto se envuelve — pero el <b>contenido</b> sigue siendo directo.</p>

        <table>
          <tr><th>Fórmula</th><th>Qué hace</th></tr>
          <tr><td>I see your point, but…</td><td>reconoce antes de objetar</td></tr>
          <tr><td>I'm not sure about that.</td><td>presenta el desacuerdo como duda propia</td></tr>
          <tr><td>Have we considered…?</td><td>propone como pregunta al grupo</td></tr>
          <tr><td>What if we…?</td><td>propone como hipótesis, no como corrección</td></tr>
          <tr><td>I'm worried about…</td><td>señala el riesgo, no el error</td></tr>
        </table>

        <div class="nota-tec">
          <b>El patrón general: reconocer → objetar → proponer.</b>
          <br><br>
          <i>That makes sense. I'm just worried about the latency. What if we cached the result?</i>
          <br><br>
          Tres movimientos en tres frases cortas. Saltarse el primero hace que la objeción suene
          a ataque; saltarse el tercero la deja como queja sin salida.
        </div>

        <p><b>Sobre interrumpir.</b> En calls con varias personas y latencia, el turno de palabra no
        se abre solo. <i>Sorry, can I jump in?</i> no es descortesía: es el mecanismo <b>esperado</b>
        para tomar la palabra. Esperar el silencio perfecto suele significar no hablar nunca.</p>

        <p><b>Sobre las muletillas de tiempo.</b> <i>That's a good question</i>, <i>Let me think</i> y
        <i>It depends</i> cumplen una función real: te dan dos o tres segundos para armar la frase.
        Los nativos las usan por la misma razón. No son relleno vacío.</p>

        <p><b>Sobre <i>Just to confirm</i>.</b> Es una técnica de comunicación, no solo una frase:
        <b>parafrasear lo que entendiste</b> convierte un posible malentendido en una corrección
        inmediata y barata. Es especialmente valiosa cuando tu comprensión oral todavía es imperfecta —
        y sigue siendo buena práctica cuando ya no lo es.</p>

        <p><b>Vocabulario de reunión:</b> <i>agenda</i>, <i>action items</i> (tareas que salen de la
        reunión), <i>follow up</i> (dar seguimiento), <i>align</i> (ponerse de acuerdo),
        <i>circle back</i> (retomar después), <i>par down</i>… y sobre todo
        <i>let's take this offline</i>, del módulo 5.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="El patrón de tres pasos para estar en desacuerdo sin confrontar">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Cómo se disiente sin pelear</text>

          <g>
            <rect x="34" y="40" width="196" height="96" rx="10" fill="#34d399" opacity="0.11" stroke="#34d399" stroke-width="1.3"/>
            <text x="132" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#34d399">1 · RECONOCÉ</text>
            <text x="132" y="86" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.88">That makes sense.</text>
            <text x="132" y="106" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.88">I see your point.</text>
            <text x="132" y="126" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.6">sin esto suena a ataque</text>
          </g>

          <g>
            <rect x="242" y="40" width="196" height="96" rx="10" fill="#fbbf24" opacity="0.11" stroke="#fbbf24" stroke-width="1.3"/>
            <text x="340" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fbbf24">2 · OBJETÁ</text>
            <text x="340" y="86" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.88">I'm worried about</text>
            <text x="340" y="106" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.88">the latency.</text>
            <text x="340" y="126" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.6">el riesgo, no el error</text>
          </g>

          <g>
            <rect x="450" y="40" width="196" height="96" rx="10" fill="#22d3ee" opacity="0.11" stroke="#22d3ee" stroke-width="1.3"/>
            <text x="548" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#22d3ee">3 · PROPONÉ</text>
            <text x="548" y="86" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.88">What if we cached</text>
            <text x="548" y="106" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.88">the result?</text>
            <text x="548" y="126" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.6">sin esto queda como queja</text>
          </g>

          <line x1="34" y1="156" x2="646" y2="156" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="178" text-anchor="middle" font-size="12.5" font-weight="700" fill="currentColor">Y las tres que te salvan</text>

          <g font-size="12">
            <rect x="34" y="190" width="196" height="52" rx="8" fill="#c084fc" opacity="0.1"/>
            <text x="132" y="210" text-anchor="middle" font-weight="700" fill="#c084fc">Can I jump in?</text>
            <text x="132" y="228" text-anchor="middle" fill="currentColor" opacity="0.75">para tomar la palabra</text>

            <rect x="242" y="190" width="196" height="52" rx="8" fill="#c084fc" opacity="0.1"/>
            <text x="340" y="210" text-anchor="middle" font-weight="700" fill="#c084fc">Let me think.</text>
            <text x="340" y="228" text-anchor="middle" fill="currentColor" opacity="0.75">para ganar segundos</text>

            <rect x="450" y="190" width="196" height="52" rx="8" fill="#c084fc" opacity="0.1"/>
            <text x="548" y="210" text-anchor="middle" font-weight="700" fill="#c084fc">Just to confirm…</text>
            <text x="548" y="228" text-anchor="middle" fill="currentColor" opacity="0.75">para no malentender</text>
          </g>

          <rect x="34" y="252" width="612" height="30" rx="8" fill="#f59e0b" opacity="0.1"/>
          <text x="340" y="272" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.85">
            Esperar el silencio perfecto para hablar suele significar no hablar nunca.
          </text>
        </svg>`,
        pie: 'Tres movimientos en tres frases cortas. Saltarse el primero o el tercero cambia cómo se recibe todo.',
      },

      escucha: {
        intro: '<p>Frases de reunión. Estas conviene reconocerlas <b>al instante</b>: ' +
               'cuando aparecen, hay que reaccionar rápido.</p>',
        items: [
          { texto: 'Sorry, can I jump in for a second?', es: 'Perdón, ¿puedo meterme un segundo?',
            nota: 'La forma estándar de interrumpir. No es descortesía: es el mecanismo esperado.' },
          { texto: "I see your point, but I'm worried about the latency.", es: 'Entiendo tu punto, pero me preocupa la latencia.',
            nota: 'Reconocer + objetar. Sin la primera parte, la objeción suena a ataque.' },
          { texto: 'What if we cached the result instead?', es: '¿Y si mejor cacheamos el resultado?',
            nota: '<b>What if we…?</b> propone sin confrontar: deja la idea como una opción más.' },
          { texto: "That's a good question. Let me think about it for a second.", es: 'Buena pregunta. Dejame pensarlo un segundo.',
            nota: 'Muletilla de tiempo. Cumple una función real y los nativos la usan por lo mismo.' },
          { texto: 'Just to confirm — you mean the staging environment, right?', es: 'Solo para confirmar, ¿te referís al entorno de staging?',
            nota: 'La mejor de todas: parafraseás y el otro confirma o corrige. Mata el malentendido antes de que exista.' },
        ],
      },

      practica: `
        <p><b>Practicá el patrón de tres pasos</b> con un desacuerdo técnico real que hayas tenido:</p>
        <ol>
          <li>______ makes sense. / I see your point.</li>
          <li>But I'm worried about ______.</li>
          <li>What if we ______?</li>
        </ol>

        <p>Decilo en voz alta cinco veces. <b>Ese patrón es la habilidad social más importante de una
        reunión técnica</b>, y en inglés se arma con tres frases cortas que ya sabés.</p>

        <p><b>Y guardate estas cinco</b>, que son las que más te van a salvar:</p>
        <ul>
          <li><span class="en" data-say>Sorry, can I jump in?</span></li>
          <li><span class="en" data-say>That's a good question, let me think.</span></li>
          <li><span class="en" data-say>Just to confirm — you mean X, right?</span></li>
          <li><span class="en" data-say>I'm not sure about that.</span></li>
          <li><span class="en" data-say>Let me check and get back to you.</span></li>
        </ul>

        <p><b>Una nota sobre la vergüenza:</b> quedarse callado en una reunión no te hace parecer
        prudente, te hace invisible. Y una frase corta bien dicha aporta más que un silencio prolijo.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Alguien propone algo que no te convence. ¿Cuál es la mejor forma de decirlo?',
          opciones: [
            "No, that's wrong.",
            "I see your point, but I'm worried about the latency. What if we cached it?",
            'I disagree completely.',
            'Whatever you think.',
          ],
          correcta: 1,
          porQue: 'El patrón <b>reconocer → objetar → proponer</b>. Sin el primero suena a ataque; sin el tercero queda como queja sin salida.',
          porQueNo: {
            0: 'Gramaticalmente correcto y socialmente agresivo en inglés de trabajo.',
            2: 'Directo sin mitigar y sin alternativa.',
            3: 'Evita el conflicto pero no aporta tu criterio, que es lo que se espera de vos.',
          },
        },
        {
          tipo: 'opcion',
          p: 'En una call con seis personas querés decir algo pero nadie hace silencio. ¿Qué hacés?',
          opciones: [
            'Esperar a que alguien te dé la palabra',
            'Decir: Sorry, can I jump in?',
            'Escribirlo en el chat y no decir nada',
            'Dejarlo para después de la reunión',
          ],
          correcta: 1,
          porQue: 'El turno de palabra <b>no se abre solo</b> en una call con latencia. Pedirlo es el mecanismo esperado, no una descortesía.',
          porQueNo: {
            0: 'Esperar el silencio perfecto suele significar no hablar nunca.',
            2: 'Sirve como complemento, pero perdés la oportunidad de participar.',
            3: 'Si es relevante para la decisión, después ya es tarde.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá la propuesta suave: <b>______ if we cached the result?</b>',
          respuesta: 'What',
          respuestas: ['what'],
          porQue: '<b>What if we…?</b> propone como hipótesis, no como corrección. Deja la idea sobre la mesa sin confrontar.',
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Solo para confirmar: ¿te referís al entorno de staging?</b>',
          respuesta: 'Just to confirm, you mean the staging environment, right?',
          respuestas: ['Just to confirm, you mean the staging environment', 'Just to confirm - you mean the staging environment, right?'],
          pista: 'Empieza con «just to confirm».',
          porQue: 'Parafrasear lo que entendiste convierte un posible malentendido en una corrección inmediata y barata.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá la muletilla de tiempo: «Buena pregunta, dejame pensarlo.»',
          respuesta: "That's a good question, let me think about it",
          porQue: 'Cumple una función real: te da dos o tres segundos para armar la frase. Los nativos la usan por lo mismo.',
        },
      ],

      errores: [
        { mito: 'Interrumpir en una reunión queda mal.',
          realidad: 'En una call con varias personas y latencia, el turno <b>no se abre solo</b>. ' +
                    '<i>Sorry, can I jump in?</i> es el mecanismo <b>esperado</b> para tomar la palabra. ' +
                    'Esperar el silencio perfecto suele significar no hablar nunca.' },
        { mito: 'Decir <i>No, you\'re wrong</i> es directo y eso se valora en inglés.',
          realidad: 'Se valora la <b>claridad del contenido</b>, no la crudeza de la forma. El desacuerdo va envuelto: ' +
                    '<i>I see your point, but…</i> El contenido puede ser durísimo; la forma, no.' },
        { mito: 'Frases como <i>That\'s a good question</i> o <i>Let me think</i> son relleno.',
          realidad: 'Cumplen una función real: te dan dos o tres segundos para armar la frase. ' +
                    'Los nativos las usan por exactamente la misma razón. En un inglés todavía lento, son ' +
                    'una herramienta, no una muletilla vacía.' },
      ],

      glosario: [
        { t: 'Jump in', d: 'Meterse en una conversación. <i>Sorry, can I jump in?</i> es la forma estándar de interrumpir.' },
        { t: 'What if we…?', d: 'Propone como hipótesis, no como corrección. La forma más suave de sugerir un cambio.' },
        { t: 'Just to confirm', d: 'Parafrasear lo que entendiste para que el otro confirme o corrija. Mata el malentendido antes de que exista.' },
        { t: 'Action items', d: 'Las tareas concretas que salen de una reunión.' },
        { t: 'Circle back', d: 'Retomar un tema más adelante. <i>Can we circle back to this?</i>' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l3',
      titulo: 'Escribir: Slack, PR y mail',
      minutos: 8,

      simple: `
        <p>Acá tenés una ventaja enorme: <b>escribir es asincrónico</b>. Tenés tiempo de pensar,
        buscar y revisar. Un mensaje bien escrito compensa muchísimo un inglés hablado todavía titubeante.</p>

        <h4>Slack: corto y directo</h4>
        <div class="analogia">
          <span class="en" data-say>Hey, quick question — do you know why the staging deploy is failing? I checked the logs but I couldn't find anything.</span>
        </div>
        <p>Registro informal, sin saludos formales. <b><i>Dear</i> en un mensaje interno suena raro o
        hasta sarcástico.</b> <i>Hey</i> y <i>Hi</i> son normales incluso hacia arriba en la jerarquía.</p>

        <ul>
          <li><span class="en" data-say>Quick question —</span></li>
          <li><span class="en" data-say>Heads up:</span> — aviso</li>
          <li><span class="en" data-say>FYI</span> — para tu información</li>
          <li><span class="en" data-say>No rush</span> — sin apuro</li>
          <li><span class="en" data-say>When you have a minute</span> — cuando puedas</li>
        </ul>
        <p><b><i>No rush</i></b> y <b><i>when you have a minute</i></b> son mitigadores baratos:
        bajan la presión del pedido en dos palabras.</p>

        <h4>El PR: título y descripción</h4>
        <table>
          <tr><th>Parte</th><th>Cómo va</th><th>Ejemplo</th></tr>
          <tr><td>Título del commit</td><td>imperativo</td><td>Fix login token expiration</td></tr>
          <tr><td>Descripción</td><td>present simple</td><td>This PR fixes the token expiration.</td></tr>
          <tr><td>Contexto</td><td>pasado</td><td>The token expired after one hour.</td></tr>
          <tr><td>Qué falta</td><td>futuro / should</td><td>We should add an alert for this.</td></tr>
        </table>

        <div class="analogia">
          <b>Un PR completo:</b><br>
          <span class="en" data-say>This PR fixes the login bug. The token expired after one hour, but the client did not refresh it. Now the client checks the expiration and refreshes it automatically. I added a test for the expired case. We should also add an alert, but that is out of scope here.</span>
        </div>
        <p>Cinco frases. Present simple para lo que hace, pasado para el contexto, y una nota de
        qué queda afuera.</p>

        <h4>El mail: un poco más formal</h4>
        <ul>
          <li><b>Apertura:</b> <span class="en" data-say>Hi Ana,</span> — <i>Dear</i> solo con gente de afuera</li>
          <li><b>Contexto:</b> <span class="en" data-say>I'm writing about the API integration.</span></li>
          <li><b>Pedido:</b> <span class="en" data-say>Could you send me the credentials when you have a chance?</span></li>
          <li><b>Cierre:</b> <span class="en" data-say>Thanks,</span> / <span class="en" data-say>Best,</span></li>
        </ul>

        <div class="aviso">
          <b>La regla de oro de escribir en inglés de trabajo:</b> <b>una idea por frase</b>.
          Traducir el estilo subordinado del español produce textos enredados aunque la gramática
          esté perfecta. <b>Cortar más de lo que te parece natural casi siempre mejora el resultado.</b>
        </div>
      `,

      tecnico: `
        <p><b>Los tres registros escritos</b>, de menos a más formal:</p>
        <table>
          <tr><th>Canal</th><th>Registro</th><th>Apertura</th></tr>
          <tr><td>Slack interno</td><td>muy informal</td><td>Hey · Hi · nada</td></tr>
          <tr><td>PR / issue</td><td>técnico neutro</td><td>sin saludo</td></tr>
          <tr><td>Mail interno</td><td>informal-neutro</td><td>Hi + nombre</td></tr>
          <tr><td>Mail externo</td><td>formal</td><td>Dear + nombre</td></tr>
        </table>

        <div class="nota-tec">
          <b>El error de registro más común del hispanohablante es pasarse de formal.</b>
          <i>Dear Sir/Madam</i>, <i>I would like to kindly request</i>, <i>Yours faithfully</i> —
          suenan a carta comercial de 1950.
          <br><br>
          En trabajo remoto internacional el registro es bastante más informal de lo que el español
          profesional acostumbra. <i>Hi Ana, could you send me the credentials? Thanks!</i> es
          perfectamente apropiado incluso hacia arriba.
        </div>

        <p><b>Convenciones del PR:</b></p>
        <ul>
          <li><b>Título en imperativo</b>, sin punto final: <i>Fix login token expiration</i>.
          Viene de que Git lo completa como «if applied, this commit will…».</li>
          <li><b>Descripción en present simple</b>, porque describe qué hace el cambio.</li>
          <li><b>Voz pasiva</b> para despersonalizar: <i>The token is refreshed automatically</i>.
          En inglés técnico se valora; no suena evasivo.</li>
          <li><b>Out of scope</b> para marcar lo que deliberadamente no hiciste. Es una señal de
          criterio, no de pereza.</li>
        </ul>

        <p><b>Abreviaturas que vas a ver:</b></p>
        <table>
          <tr><td>FYI</td><td>for your information — para que sepas</td></tr>
          <tr><td>ASAP</td><td>as soon as possible — cuanto antes</td></tr>
          <tr><td>EOD</td><td>end of day — fin del día</td></tr>
          <tr><td>WIP</td><td>work in progress — en curso</td></tr>
          <tr><td>LGTM</td><td>looks good to me — apruebo el PR</td></tr>
          <tr><td>NIT</td><td>nitpick — comentario menor, opcional</td></tr>
          <tr><td>PTAL</td><td>please take another look — mirá de nuevo</td></tr>
          <tr><td>IMO</td><td>in my opinion — en mi opinión</td></tr>
        </table>

        <p><b><i>nit:</i></b> al principio de un comentario de review señala que es menor y no bloquea
        el merge. Es una convención muy útil: separa lo importante de lo cosmético.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Los cuatro registros escritos y la estructura de un PR">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Cuatro canales, cuatro registros</text>

          <line x1="80" y1="52" x2="600" y2="52" stroke="currentColor" opacity="0.2" stroke-width="2"/>
          <text x="80" y="42" font-size="11" font-weight="700" fill="#22d3ee">informal</text>
          <text x="600" y="42" text-anchor="end" font-size="11" font-weight="700" fill="#c084fc">formal</text>

          <g font-size="12">
            <rect x="34" y="66" width="146" height="70" rx="9" fill="#22d3ee" opacity="0.11" stroke="#22d3ee" stroke-width="1.2"/>
            <text x="107" y="86" text-anchor="middle" font-weight="800" fill="#22d3ee">Slack</text>
            <text x="107" y="106" text-anchor="middle" fill="currentColor" opacity="0.85">"Hey, quick</text>
            <text x="107" y="122" text-anchor="middle" fill="currentColor" opacity="0.85">question —"</text>

            <rect x="192" y="66" width="146" height="70" rx="9" fill="#34d399" opacity="0.11" stroke="#34d399" stroke-width="1.2"/>
            <text x="265" y="86" text-anchor="middle" font-weight="800" fill="#34d399">PR</text>
            <text x="265" y="106" text-anchor="middle" fill="currentColor" opacity="0.85">sin saludo</text>
            <text x="265" y="122" text-anchor="middle" fill="currentColor" opacity="0.85">"This PR fixes…"</text>

            <rect x="350" y="66" width="146" height="70" rx="9" fill="#fbbf24" opacity="0.11" stroke="#fbbf24" stroke-width="1.2"/>
            <text x="423" y="86" text-anchor="middle" font-weight="800" fill="#fbbf24">Mail interno</text>
            <text x="423" y="106" text-anchor="middle" fill="currentColor" opacity="0.85">"Hi Ana,"</text>
            <text x="423" y="122" text-anchor="middle" fill="currentColor" opacity="0.85">"Thanks,"</text>

            <rect x="508" y="66" width="138" height="70" rx="9" fill="#c084fc" opacity="0.11" stroke="#c084fc" stroke-width="1.2"/>
            <text x="577" y="86" text-anchor="middle" font-weight="800" fill="#c084fc">Mail externo</text>
            <text x="577" y="106" text-anchor="middle" fill="currentColor" opacity="0.85">"Dear Ana,"</text>
            <text x="577" y="122" text-anchor="middle" fill="currentColor" opacity="0.85">"Best regards,"</text>
          </g>

          <rect x="34" y="148" width="612" height="30" rx="7" fill="#f87171" opacity="0.1"/>
          <text x="340" y="168" text-anchor="middle" font-size="12" font-weight="600" fill="#f87171">
            El error más común del hispanohablante: pasarse de formal
          </text>

          <line x1="34" y1="192" x2="646" y2="192" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="212" text-anchor="middle" font-size="12.5" font-weight="700" fill="currentColor">El PR: cada parte en su tiempo verbal</text>

          <g font-size="12">
            <rect x="34" y="222" width="146" height="46" rx="8" fill="currentColor" opacity="0.06"/>
            <text x="107" y="240" text-anchor="middle" font-weight="700" fill="currentColor" opacity="0.8">título</text>
            <text x="107" y="257" text-anchor="middle" fill="currentColor" opacity="0.75">imperativo</text>

            <rect x="192" y="222" width="146" height="46" rx="8" fill="#34d399" opacity="0.1"/>
            <text x="265" y="240" text-anchor="middle" font-weight="700" fill="#34d399">descripción</text>
            <text x="265" y="257" text-anchor="middle" fill="currentColor" opacity="0.75">present simple</text>

            <rect x="350" y="222" width="146" height="46" rx="8" fill="#c084fc" opacity="0.1"/>
            <text x="423" y="240" text-anchor="middle" font-weight="700" fill="#c084fc">contexto</text>
            <text x="423" y="257" text-anchor="middle" fill="currentColor" opacity="0.75">pasado</text>

            <rect x="508" y="222" width="138" height="46" rx="8" fill="#fbbf24" opacity="0.1"/>
            <text x="577" y="240" text-anchor="middle" font-weight="700" fill="#fbbf24">qué falta</text>
            <text x="577" y="257" text-anchor="middle" fill="currentColor" opacity="0.75">should / futuro</text>
          </g>

          <text x="340" y="284" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">
            Regla de oro: una idea por frase. Cortar más de lo que parece natural casi siempre mejora.
          </text>
        </svg>`,
        pie: 'Escribir es tu ventaja: es asincrónico, tenés tiempo de revisar, y compensa un inglés hablado todavía lento.',
      },

      escucha: {
        intro: '<p>Mensajes leídos en voz alta. Fijate lo cortas que son las frases ' +
               'y lo informal del registro.</p>',
        items: [
          { texto: 'Hey, quick question — do you know why staging is failing?', es: 'Hola, pregunta rápida: ¿sabés por qué falla staging?',
            nota: '<b>Hey</b> y <b>quick question</b>: registro normal de Slack, incluso hacia arriba en la jerarquía.' },
          { texto: 'Heads up: I am going to deploy in ten minutes.', es: 'Aviso: voy a desplegar en diez minutos.',
            nota: '<b>Heads up</b> = aviso previo. Muy usado antes de hacer algo que puede afectar a otros.' },
          { texto: 'This PR fixes the token expiration. No rush on the review.', es: 'Este PR arregla el vencimiento del token. Sin apuro con la revisión.',
            nota: '<b>No rush</b> es un mitigador barato: baja la presión del pedido en dos palabras.' },
          { texto: 'LGTM, just one nit about the variable name.', es: 'Me parece bien, solo un detalle menor sobre el nombre de la variable.',
            nota: '<b>LGTM</b> = looks good to me. <b>nit</b> señala un comentario menor que no bloquea el merge.' },
          { texto: 'Could you send me the credentials when you have a chance?', es: '¿Me podrías mandar las credenciales cuando puedas?',
            nota: '<b>when you have a chance</b>: otro mitigador. Convierte un pedido en algo sin urgencia.' },
        ],
      },

      practica: `
        <p><b>Escribí un PR real tuyo en inglés</b>, con la estructura de cuatro partes:</p>
        <ol>
          <li><b>Título (imperativo):</b> ______</li>
          <li><b>Qué hace (present simple):</b> This PR ______.</li>
          <li><b>Contexto (pasado):</b> The problem was ______.</li>
          <li><b>Qué queda (should):</b> We should ______, but that's out of scope here.</li>
        </ol>

        <p><b>Después releelo con estas tres preguntas:</b></p>
        <ul>
          <li>¿Alguna frase tiene más de dos comas? Cortala en dos.</li>
          <li>¿Hay algún verbo en tercera persona sin la <b>-s</b>?</li>
          <li>¿Suena demasiado formal? Sacale los <i>kindly</i> y los <i>I would like to</i>.</li>
        </ul>

        <p><b>Esta es tu mejor herramienta ahora mismo.</b> Escribir es asincrónico: tenés tiempo de
        pensar, buscar y corregir. Un PR bien escrito es lo que más gente del equipo va a leer de vos,
        y compensa mucho un inglés hablado todavía titubeante.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Le escribís a un compañero por Slack pidiendo un archivo. ¿Cuál es el registro correcto?',
          opciones: [
            'Dear Sir, I would like to kindly request the file.',
            'Hey, could you send me the file when you have a chance? No rush.',
            'Send me the file.',
            'To whom it may concern: the file, please.',
          ],
          correcta: 1,
          porQue: 'Registro informal, pedido envuelto y mitigado. Es lo normal en Slack, incluso hacia arriba en la jerarquía.',
          porQueNo: {
            0: 'Suena a carta comercial de 1950. Pasarse de formal es el error de registro más común del hispanohablante.',
            2: 'El imperativo pelado suena a orden en un pedido personal.',
            3: 'Fórmula de carta formal a un desconocido. En Slack es directamente raro.',
          },
        },
        {
          tipo: 'opcion',
          p: '¿Cómo va el título de un commit?',
          opciones: ['Fixes login bug', 'Fixed login bug', 'Fix login bug', 'Fixing login bug'],
          correcta: 2,
          porQue: '<b>Imperativo</b>, sin punto final. Viene de que Git lo completa como «if applied, this commit will…».',
          porQueNo: {
            0: 'El present simple va en la <b>descripción</b>, no en el título.',
            1: 'El pasado se usa a veces, pero la convención establecida es el imperativo.',
            3: 'El gerundio no se usa para títulos de commit.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá el aviso previo: <b>______ up: I\'m going to deploy in ten minutes.</b>',
          respuesta: 'Heads',
          respuestas: ['heads'],
          porQue: '<b>Heads up</b> = aviso previo. Muy usado antes de hacer algo que puede afectar a otros.',
        },
        {
          tipo: 'opcion',
          p: 'En un review dejás un comentario que no bloquea el merge. ¿Cómo lo señalás?',
          opciones: [
            'IMPORTANT: change this.',
            'nit: I would rename this variable.',
            'This is wrong.',
            'FYI: this is bad.',
          ],
          correcta: 1,
          porQue: '<b>nit:</b> señala que es menor y opcional. Es una convención muy útil: separa lo importante de lo cosmético.',
          porQueNo: {
            0: 'Marca lo contrario de lo que querés comunicar.',
            2: 'Es una objeción bloqueante, y además sin mitigar.',
            3: '<i>FYI</i> informa, pero no aclara que sea menor — y «this is bad» suena duro.',
          },
        },
        {
          tipo: 'ordenar',
          p: 'Armá la descripción de un PR: «Este PR arregla el vencimiento del token.»',
          respuesta: 'This PR fixes the token expiration',
          porQue: 'Present simple con la <b>-s</b> de tercera persona (<i>This PR</i> = <i>it</i>). La descripción siempre va así.',
        },
      ],

      errores: [
        { mito: 'En un mail de trabajo conviene ser formal para mostrar respeto.',
          realidad: 'El error de registro más común del hispanohablante es <b>pasarse de formal</b>. ' +
                    '<i>Dear Sir/Madam</i> y <i>Yours faithfully</i> suenan a carta comercial de 1950. ' +
                    'En trabajo remoto internacional, <i>Hi Ana, could you…? Thanks!</i> es apropiado ' +
                    'incluso hacia arriba.' },
        { mito: 'El título del commit y la descripción van en el mismo tiempo verbal.',
          realidad: 'No. El <b>título</b> va en <b>imperativo</b> (<i>Fix login bug</i>) y la <b>descripción</b> en ' +
                    '<b>present simple</b> (<i>This PR fixes…</i>). Son dos convenciones distintas en el mismo commit.' },
        { mito: 'Escribir frases largas y con subordinadas suena más profesional.',
          realidad: 'Es al revés. La regla del inglés técnico es <b>una idea por frase</b>. Traducir el estilo ' +
                    'subordinado del español produce textos enredados aunque la gramática esté perfecta. ' +
                    'Cortar más de lo que parece natural casi siempre mejora.' },
      ],

      glosario: [
        { t: 'Heads up', d: 'Aviso previo. <i>Heads up: I\'m deploying in ten minutes.</i>' },
        { t: 'No rush', d: 'Sin apuro. Mitigador barato que baja la presión de un pedido en dos palabras.' },
        { t: 'LGTM', d: '<i>Looks good to me</i>. La aprobación estándar de un PR.' },
        { t: 'nit', d: '<i>Nitpick</i>. Comentario menor y opcional que no bloquea el merge.' },
        { t: 'Out of scope', d: 'Fuera del alcance. Marca lo que deliberadamente no hiciste: es señal de criterio.' },
        { t: 'PTAL', d: '<i>Please take another look</i>. Pedís que revisen de nuevo después de tus cambios.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l4',
      titulo: 'La entrevista técnica',
      minutos: 9,

      simple: `
        <p>Cierre del track. Una entrevista técnica en inglés parece imposible con A1 y no lo es,
        por una razón: <b>las preguntas son casi siempre las mismas</b>, y las podés preparar palabra
        por palabra.</p>

        <h4>Las cuatro preguntas que siempre aparecen</h4>

        <p><b>1. <span class="en" data-say>Tell me about yourself.</span></b></p>
        <div class="analogia">
          <span class="en" data-say>I'm a full stack developer with five years of experience. I mostly work with React and Node. Right now I'm working on a SaaS platform for schools. I like working on things that people actually use.</span>
        </div>
        <p>Cuatro frases: qué sos, con qué trabajás, qué estás haciendo ahora, qué te gusta.
        <b>No es tu biografía.</b></p>

        <p><b>2. <span class="en" data-say>Tell me about a project you worked on.</span></b></p>
        <p>Acá usás la estructura del módulo 8: qué era, qué hiciste, qué problema apareció,
        cómo lo resolviste.</p>

        <p><b>3. <span class="en" data-say>Why did you choose that approach?</span></b></p>
        <p>El patrón de tres partes: qué hiciste, por qué, qué descartaste y por qué.
        <b>Esta es la que más te evalúa.</b></p>

        <p><b>4. <span class="en" data-say>Do you have any questions for us?</span></b></p>
        <p>Siempre hay que tener dos o tres. Decir «no» se lee como falta de interés.</p>

        <div class="aviso">
          <b>Las tres frases que te salvan si no entendés:</b><br>
          <span class="en" data-say>Sorry, could you repeat the question?</span><br>
          <span class="en" data-say>Just to make sure I understood — you're asking about X, right?</span><br>
          <span class="en" data-say>That's a good question, let me think for a second.</span><br><br>
          Usarlas <b>no te resta</b>. Lo que resta es contestar otra cosa porque no entendiste.
        </div>

        <h4>Preguntas para hacer vos</h4>
        <ul>
          <li><span class="en" data-say>What does a typical week look like for the team?</span></li>
          <li><span class="en" data-say>How do you handle code reviews?</span></li>
          <li><span class="en" data-say>What's the biggest challenge the team is facing right now?</span></li>
          <li><span class="en" data-say>How much of the work is in English?</span></li>
        </ul>

        <div class="aviso">
          <b>Sobre decir que tu inglés está en camino.</b> Si te preguntan, contestá con honestidad
          y sin dramatizar:<br><br>
          <span class="en" data-say>I read and write English every day at work. My speaking is still improving, but I can follow technical discussions.</span><br><br>
          Eso es preciso, verificable y no suena a excusa. Y muestra exactamente lo que un equipo
          necesita saber.
        </div>
      `,

      tecnico: `
        <p><b>Por qué una entrevista técnica es abordable con A1.</b> Es un contexto <b>altamente
        predecible</b>: las preguntas se repiten, el vocabulario es el de tu propio trabajo, y podés
        preparar las respuestas literalmente palabra por palabra.</p>

        <div class="nota-tec">
          <b>Lo que cambia el resultado no es tu nivel, es la preparación.</b> Alguien con A2 que
          preparó cuatro respuestas suena mucho mejor que alguien con B1 que improvisa.
          <br><br>
          Y hay un detalle que juega a tu favor: en una entrevista técnica, <b>la mayor parte del
          contenido es vocabulario que ya conocés</b> — nombres de tecnologías, términos que leés
          todos los días. Lo que hay que sostener son las bisagras entre esos términos, y esas
          bisagras son de A1.
        </div>

        <p><b>La estructura STAR</b>, que se espera en las respuestas de experiencia:</p>
        <table>
          <tr><th>Parte</th><th>Qué contás</th><th>Tiempo verbal</th></tr>
          <tr><td>Situation</td><td>el contexto</td><td>pasado</td></tr>
          <tr><td>Task</td><td>qué había que hacer</td><td>pasado</td></tr>
          <tr><td>Action</td><td>qué hiciste vos</td><td>pasado</td></tr>
          <tr><td>Result</td><td>qué resultó</td><td>pasado / presente</td></tr>
        </table>
        <p>Todo en pasado, que es el módulo 7 y 8. No hace falta nada de B1.</p>

        <p><b>Vocabulario de entrevista:</b></p>
        <ul>
          <li><i>I'm responsible for…</i> — me encargo de</li>
          <li><i>I worked on…</i> — trabajé en</li>
          <li><i>My role was to…</i> — mi rol era</li>
          <li><i>We decided to…</i> — decidimos</li>
          <li><i>The main challenge was…</i> — el principal desafío era</li>
          <li><i>What I learned was…</i> — lo que aprendí fue</li>
          <li><i>I'd say my strength is…</i> — diría que mi fuerte es</li>
        </ul>

        <p><b>Sobre declarar tu nivel de inglés.</b> Ser específico funciona mucho mejor que una
        etiqueta. <i>I read and write English every day; my speaking is still improving</i> le dice
        al entrevistador exactamente qué esperar — y coincide con lo que va a observar en la
        entrevista, lo cual construye credibilidad.</p>

        <p><b>Y una nota sobre el nivel que piden.</b> Casi ninguna oferta técnica pide C1.
        «Inglés avanzado» suele significar <b>B2</b>: seguir una reunión, explicar tu trabajo y
        discutir una decisión. Ese es el objetivo real de esta escalera, y A1 es el primer escalón
        de cinco.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Las cuatro preguntas de entrevista y la estructura STAR">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Las cuatro preguntas que siempre aparecen</text>

          <g font-size="12.5">
            <rect x="34" y="38" width="612" height="30" rx="7" fill="#34d399" opacity="0.11" stroke="#34d399" stroke-width="1.1"/>
            <text x="52" y="58" fill="currentColor" opacity="0.9"><tspan font-weight="700" fill="#34d399">1</tspan>  Tell me about yourself.</text>
            <text x="628" y="58" text-anchor="end" font-size="11" fill="currentColor" opacity="0.6">4 frases, no tu biografía</text>

            <rect x="34" y="74" width="612" height="30" rx="7" fill="#22d3ee" opacity="0.11" stroke="#22d3ee" stroke-width="1.1"/>
            <text x="52" y="94" fill="currentColor" opacity="0.9"><tspan font-weight="700" fill="#22d3ee">2</tspan>  Tell me about a project you worked on.</text>
            <text x="628" y="94" text-anchor="end" font-size="11" fill="currentColor" opacity="0.6">estructura STAR</text>

            <rect x="34" y="110" width="612" height="30" rx="7" fill="#c084fc" opacity="0.14" stroke="#c084fc" stroke-width="1.4"/>
            <text x="52" y="130" fill="currentColor" opacity="0.9"><tspan font-weight="700" fill="#c084fc">3</tspan>  Why did you choose that approach?</text>
            <text x="628" y="130" text-anchor="end" font-size="11" font-weight="700" fill="#c084fc">la que más te evalúa</text>

            <rect x="34" y="146" width="612" height="30" rx="7" fill="#fbbf24" opacity="0.11" stroke="#fbbf24" stroke-width="1.1"/>
            <text x="52" y="166" fill="currentColor" opacity="0.9"><tspan font-weight="700" fill="#fbbf24">4</tspan>  Do you have any questions for us?</text>
            <text x="628" y="166" text-anchor="end" font-size="11" fill="currentColor" opacity="0.6">siempre tené dos o tres</text>
          </g>

          <line x1="34" y1="190" x2="646" y2="190" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="210" text-anchor="middle" font-size="12.5" font-weight="700" fill="currentColor">STAR: todo en pasado, todo de A1</text>

          <g font-size="11.5" text-anchor="middle">
            <rect x="52" y="220" width="136" height="42" rx="8" fill="currentColor" opacity="0.06"/>
            <text x="120" y="238" font-weight="700" fill="currentColor" opacity="0.85">Situation</text>
            <text x="120" y="254" fill="currentColor" opacity="0.7">el contexto</text>

            <rect x="200" y="220" width="136" height="42" rx="8" fill="currentColor" opacity="0.06"/>
            <text x="268" y="238" font-weight="700" fill="currentColor" opacity="0.85">Task</text>
            <text x="268" y="254" fill="currentColor" opacity="0.7">qué había que hacer</text>

            <rect x="348" y="220" width="136" height="42" rx="8" fill="#34d399" opacity="0.12"/>
            <text x="416" y="238" font-weight="700" fill="#34d399">Action</text>
            <text x="416" y="254" fill="currentColor" opacity="0.7">qué hiciste vos</text>

            <rect x="496" y="220" width="136" height="42" rx="8" fill="currentColor" opacity="0.06"/>
            <text x="564" y="238" font-weight="700" fill="currentColor" opacity="0.85">Result</text>
            <text x="564" y="254" fill="currentColor" opacity="0.7">qué resultó</text>
          </g>

          <text x="340" y="282" text-anchor="middle" font-size="11.5" fill="#f59e0b" font-weight="600">
            Alguien con A2 que preparó cuatro respuestas suena mejor que alguien con B1 que improvisa.
          </text>
        </svg>`,
        pie: 'Una entrevista técnica es un contexto predecible. Eso la vuelve abordable mucho antes de lo que parece.',
        nota: '<p>Fijate que <b>toda la estructura STAR va en pasado</b> — módulos 7 y 8. ' +
              'Y la pregunta 3 usa el patrón de decisiones del módulo 8. <b>No hace falta nada de B1</b> ' +
              'para contestar bien las cuatro.</p>',
      },

      escucha: {
        intro: '<p>Preguntas y respuestas de entrevista. Escuchá el ritmo: frases cortas, ' +
               'sin subordinadas complicadas.</p>',
        items: [
          { texto: 'Tell me about yourself.', es: 'Contame sobre vos.',
            nota: 'La primera pregunta de casi toda entrevista. Prepará cuatro frases y decilas hasta que salgan solas.' },
          { texto: "I'm a full stack developer with five years of experience.", es: 'Soy desarrollador full stack con cinco años de experiencia.',
            nota: '<b>with X years of experience</b> es la fórmula estándar. Fijate el <i>a</i> antes de la profesión.' },
          { texto: 'Why did you choose that approach?', es: '¿Por qué elegiste ese enfoque?',
            nota: 'La pregunta que más te evalúa. Se contesta con el patrón de tres partes del módulo 8.' },
          { texto: "Just to make sure I understood — you're asking about the deploy process, right?", es: 'Para asegurarme de que entendí: ¿me estás preguntando por el proceso de deploy?',
            nota: 'Parafrasear no te resta. Lo que resta es contestar otra cosa porque no entendiste.' },
          { texto: "I read and write English every day. My speaking is still improving.", es: 'Leo y escribo inglés todos los días. Mi oralidad todavía está mejorando.',
            nota: 'Preciso, verificable y sin dramatizar. Le dice al entrevistador exactamente qué esperar.' },
        ],
      },

      practica: `
        <p><b>Esta es la práctica final del track.</b> Prepará las cuatro respuestas, por escrito,
        y decilas en voz alta hasta que salgan sin pensar.</p>

        <p><b>1. Tell me about yourself</b> — cuatro frases:</p>
        <ol>
          <li>I'm a ______ with ______ years of experience.</li>
          <li>I mostly work with ______.</li>
          <li>Right now I'm working on ______.</li>
          <li>I like working on ______.</li>
        </ol>

        <p><b>2. Un proyecto</b> — estructura STAR, todo en pasado:</p>
        <ol>
          <li>I worked on ______.</li>
          <li>My role was to ______.</li>
          <li>The main challenge was ______.</li>
          <li>I ______ and it ______.</li>
        </ol>

        <p><b>3. Una decisión</b> — el patrón de tres partes del módulo 8:</p>
        <ol>
          <li>I used ______ instead of ______.</li>
          <li>Because ______.</li>
          <li>I didn't use ______ because ______.</li>
        </ol>

        <p><b>4. Tus preguntas</b> — elegí dos:</p>
        <ul>
          <li><span class="en" data-say>What does a typical week look like for the team?</span></li>
          <li><span class="en" data-say>How do you handle code reviews?</span></li>
          <li><span class="en" data-say>How much of the work is in English?</span></li>
        </ul>

        <p><b>Grabate diciendo las cuatro</b> con el micrófono de la pestaña 🎧 y escuchate.
        Es incómodo y es exactamente el ejercicio que más te va a servir antes de una entrevista real.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Te preguntan <span class="en" data-say>Tell me about yourself</span>. ¿Qué contestás?',
          opciones: [
            'Tu biografía completa desde la secundaria',
            'Cuatro frases: qué sos, con qué trabajás, qué hacés ahora y qué te gusta',
            'Solo tu nombre y edad',
            'Una lista de todas las tecnologías que conocés',
          ],
          correcta: 1,
          porQue: 'No es una biografía: es una <b>presentación profesional breve</b>. Cuatro frases preparadas suenan muchísimo mejor que una improvisación larga.',
          porQueNo: {
            0: 'Demasiado largo y con información irrelevante.',
            2: 'Demasiado corto: no dice nada profesional.',
            3: 'Una lista sin contexto no muestra criterio.',
          },
        },
        {
          tipo: 'opcion',
          p: 'No entendiste bien la pregunta del entrevistador. ¿Qué hacés?',
          opciones: [
            'Contestar lo que te parece que preguntó',
            'Decir: Just to make sure I understood — you\'re asking about X, right?',
            'Quedarte callado',
            'Disculparte largamente por tu inglés',
          ],
          correcta: 1,
          porQue: 'Parafrasear <b>no te resta</b>. Lo que resta es contestar otra cosa: eso sí se nota y se interpreta como que no seguís la conversación.',
          porQueNo: {
            0: 'Es el peor escenario: una respuesta correcta a la pregunta equivocada.',
            2: 'Deja al entrevistador sin saber qué pasó.',
            3: 'Desvía el foco de tu perfil a tus disculpas.',
          },
        },
        {
          tipo: 'opcion',
          p: 'Te preguntan si tenés preguntas para ellos. ¿Qué conviene?',
          opciones: [
            'Decir que no, para no hacer perder tiempo',
            'Tener dos o tres preparadas sobre el equipo y la forma de trabajar',
            'Preguntar solo por el sueldo',
            'Preguntar cualquier cosa para llenar',
          ],
          correcta: 1,
          porQue: 'Decir «no» se lee como <b>falta de interés</b>. Dos o tres preguntas concretas muestran que evaluaste el puesto en serio.',
          porQueNo: {
            0: 'Es el error más común y el más caro: se interpreta como desinterés.',
            2: 'Es una pregunta legítima, pero sola queda pobre.',
            3: 'Se nota cuando la pregunta es de relleno.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Soy desarrollador full stack con cinco años de experiencia.</b>',
          respuesta: "I'm a full stack developer with five years of experience",
          respuestas: ['I am a full stack developer with five years of experience'],
          pista: 'Ojo con el artículo antes de la profesión.',
          porQue: 'Dos cosas del módulo 1: el <b>a</b> antes de la profesión, y <b>with X years of experience</b> como fórmula.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá tu pregunta final: «¿Cómo es una semana típica para el equipo?»',
          respuesta: 'What does a typical week look like for the team',
          porQue: '<b>look like</b> = cómo es. Es una de las mejores preguntas para hacer al final: concreta y reveladora.',
        },
      ],

      errores: [
        { mito: 'Con A1 no puedo dar una entrevista técnica en inglés.',
          realidad: 'Una entrevista técnica es un contexto <b>altamente predecible</b>: las preguntas se repiten y ' +
                    'el vocabulario es el de tu propio trabajo. Alguien con A2 que preparó cuatro respuestas suena ' +
                    'mucho mejor que alguien con B1 que improvisa. <b>La preparación pesa más que el nivel.</b>' },
        { mito: 'Pedir que repitan la pregunta muestra que tu inglés no alcanza.',
          realidad: 'Lo que muestra que no alcanza es <b>contestar otra cosa</b>. Parafrasear ' +
                    '(<i>Just to make sure I understood…</i>) se lee como cuidado y precisión — de hecho, ' +
                    'es buena práctica también para nativos.' },
        { mito: 'Decir que mi inglés hablado está en camino me descarta.',
          realidad: 'Lo que descarta es la <b>imprecisión</b>. <i>I read and write English every day; my speaking is ' +
                    'still improving, but I can follow technical discussions</i> es específico, verificable y coincide ' +
                    'con lo que el entrevistador va a observar. Eso construye credibilidad.' },
      ],

      glosario: [
        { t: 'STAR', d: 'Situation, Task, Action, Result. La estructura esperada para contar una experiencia. Todo en pasado.' },
        { t: 'Tell me about yourself', d: 'La primera pregunta de casi toda entrevista. Cuatro frases, no una biografía.' },
        { t: 'What does it look like?', d: '¿Cómo es? <i>What does a typical week look like?</i> es una de las mejores preguntas finales.' },
        { t: 'My role was to…', d: 'Mi rol era… La fórmula para delimitar qué hiciste vos dentro de un equipo.' },
        { t: 'The main challenge was…', d: 'El principal desafío era… La bisagra para pasar del contexto al problema.' },
      ],
    },
  ],

  /* ==================================================================== */
  vocabulario: [
    { en: 'onboarding', es: 'proceso de incorporación', ejemplo: "I'm starting with the onboarding.", ejemploEs: 'Estoy arrancando con el onboarding.' },
    { en: 'codebase', es: 'el código del proyecto', ejemplo: "I'm still learning the codebase.", ejemploEs: 'Todavía estoy aprendiendo el código.' },
    { en: 'walk me through', es: 'explicame paso a paso', ejemplo: 'Could you walk me through the deploy?', ejemploEs: '¿Me explicás el deploy paso a paso?' },
    { en: 'ramp up', es: 'ponerse al día', ejemplo: "I'm still ramping up.", ejemploEs: 'Todavía me estoy poniendo al día.' },
    { en: 'jump in', es: 'meterse (en una conversación)', ejemplo: 'Sorry, can I jump in?', ejemploEs: 'Perdón, ¿puedo meterme?' },
    { en: 'What if we...?', es: '¿Y si...?', pista: 'Propone sin confrontar.', ejemplo: 'What if we cached the result?', ejemploEs: '¿Y si cacheamos el resultado?' },
    { en: 'just to confirm', es: 'solo para confirmar', ejemplo: 'Just to confirm, you mean staging?', ejemploEs: 'Solo para confirmar, ¿te referís a staging?' },
    { en: 'I see your point', es: 'entiendo tu punto', ejemplo: "I see your point, but I'm worried about latency.", ejemploEs: 'Entiendo tu punto, pero me preocupa la latencia.' },
    { en: 'circle back', es: 'retomar después', ejemplo: 'Can we circle back to this?', ejemploEs: '¿Lo podemos retomar después?' },
    { en: 'heads up', es: 'aviso previo', ejemplo: "Heads up: I'm deploying in ten minutes.", ejemploEs: 'Aviso: despliego en diez minutos.' },
    { en: 'no rush', es: 'sin apuro', ejemplo: 'No rush on the review.', ejemploEs: 'Sin apuro con la revisión.' },
    { en: 'LGTM', es: 'me parece bien', pista: 'Looks good to me. Aprobación de un PR.', ejemplo: 'LGTM, just one nit.', ejemploEs: 'Me parece bien, solo un detalle.' },
    { en: 'nit', es: 'detalle menor', pista: 'No bloquea el merge.', ejemplo: 'nit: I would rename this variable.', ejemploEs: 'Detalle: yo renombraría esta variable.' },
    { en: 'out of scope', es: 'fuera del alcance', ejemplo: "That's out of scope for this PR.", ejemploEs: 'Eso está fuera del alcance de este PR.' },
    { en: 'FYI', es: 'para que sepas', pista: 'For your information.', ejemplo: 'FYI: staging is down.', ejemploEs: 'Para que sepas: staging está caído.' },
    { en: 'EOD', es: 'fin del día', pista: 'End of day.', ejemplo: 'I will have it by EOD.', ejemploEs: 'Lo voy a tener para fin del día.' },
    { en: 'responsible for', es: 'encargado de', ejemplo: "I'm responsible for the payments module.", ejemploEs: 'Me encargo del módulo de pagos.' },
    { en: 'my role was to', es: 'mi rol era', ejemplo: 'My role was to design the API.', ejemploEs: 'Mi rol era diseñar la API.' },
    { en: 'challenge', es: 'desafío', ejemplo: 'The main challenge was the latency.', ejemploEs: 'El principal desafío era la latencia.' },
    { en: 'experience', es: 'experiencia', ejemplo: "I have five years of experience.", ejemploEs: 'Tengo cinco años de experiencia.' },
    { en: 'look like', es: 'cómo es / a qué se parece', ejemplo: 'What does a typical week look like?', ejemploEs: '¿Cómo es una semana típica?' },
    { en: 'improving', es: 'mejorando', ejemplo: 'My speaking is still improving.', ejemploEs: 'Mi oralidad todavía está mejorando.' },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: 'Es tu primera semana y no entendés una parte del sistema. ¿Qué conviene?',
      opciones: [
        'Investigar tres días solo antes de preguntar',
        'Preguntar enseguida: el onboarding es la etapa donde se espera que preguntes todo',
        'Decir que entendiste y buscarlo después',
        'Esperar a que alguien te lo explique sin pedirlo',
      ],
      correcta: 1,
      porQue: 'Esa licencia se agota en unas semanas: conviene aprovecharla. Tres días trabado en silencio es lo que sí queda mal.',
      porQueNo: {
        0: 'Es exactamente lo que genera problemas de entrega.',
        2: 'Terminás haciendo algo distinto de lo que te pidieron.',
        3: 'Nadie sabe qué no entendés si no lo decís.',
      },
    },
    {
      p: '¿Qué significa <i>Could you walk me through it?</i>',
      opciones: [
        '¿Me acompañás?',
        '¿Me lo explicás paso a paso?',
        '¿Lo revisamos juntos después?',
        '¿Me lo escribís?',
      ],
      correcta: 1,
      porQue: 'Pide una explicación <b>paso a paso</b>. Es exactamente lo que necesitás cuando no conocés un sistema.',
      porQueNo: {
        0: 'Es la traducción literal, y no es lo que significa.',
        2: 'Eso sería <i>Can we go over it together?</i>',
        3: 'Eso sería <i>Could you write it down?</i>',
      },
    },
    {
      p: 'Querés hablar en una call con seis personas y nadie hace silencio. ¿Qué hacés?',
      opciones: [
        'Esperar a que te den la palabra',
        'Decir: Sorry, can I jump in?',
        'Escribirlo solo en el chat',
        'Dejarlo para después de la reunión',
      ],
      correcta: 1,
      porQue: 'El turno <b>no se abre solo</b> en una call con latencia. Pedirlo es el mecanismo esperado, no una descortesía.',
      porQueNo: {
        0: 'Esperar el silencio perfecto suele significar no hablar nunca.',
        2: 'Sirve de complemento, pero perdés la participación.',
        3: 'Si es relevante para la decisión, después ya es tarde.',
      },
    },
    {
      p: 'No estás de acuerdo con una propuesta técnica. ¿Cuál es el mejor patrón?',
      opciones: [
        'Decir directamente que está mal',
        'Reconocer → objetar → proponer una alternativa',
        'No decir nada y hacerlo a tu manera después',
        'Estar de acuerdo aunque no lo estés',
      ],
      correcta: 1,
      porQue: '<i>That makes sense. I\'m worried about the latency. What if we cached it?</i> — sin el primer paso suena a ataque; sin el tercero queda como queja.',
      porQueNo: {
        0: 'El contenido puede ser durísimo, pero la forma va envuelta en inglés de trabajo.',
        2: 'Genera problemas peores después y no aporta tu criterio.',
        3: 'Se espera que des tu opinión: para eso te contrataron.',
      },
    },
    {
      p: '¿Para qué sirve <i>Just to confirm — you mean X, right?</i>',
      opciones: [
        'Para ganar tiempo sin decir nada',
        'Para parafrasear lo que entendiste y que el otro confirme o corrija',
        'Para mostrar que no entendiste nada',
        'Para cambiar de tema',
      ],
      correcta: 1,
      porQue: 'Convierte un posible malentendido en una corrección <b>inmediata y barata</b>. Es buena práctica incluso para nativos.',
      porQueNo: {
        0: 'Para eso están <i>Let me think</i> o <i>That\'s a good question</i>.',
        2: 'Muestra lo contrario: que seguiste lo suficiente como para parafrasear.',
        3: 'No cambia el tema, lo precisa.',
      },
    },
    {
      p: 'Le escribís por Slack a alguien de tu equipo. ¿Cuál es el registro correcto?',
      opciones: [
        'Dear Sir, I would like to kindly request the file.',
        'Hey, could you send me the file when you have a chance? No rush.',
        'Send me the file.',
        'To whom it may concern.',
      ],
      correcta: 1,
      porQue: 'El error de registro más común del hispanohablante es <b>pasarse de formal</b>. En Slack esto es normal incluso hacia arriba.',
      porQueNo: {
        0: 'Suena a carta comercial de 1950.',
        2: 'El imperativo pelado suena a orden en un pedido personal.',
        3: 'Fórmula de carta a un desconocido: en Slack es directamente raro.',
      },
    },
    {
      p: '¿Cómo va el título de un commit y cómo la descripción?',
      opciones: [
        'Los dos en present simple',
        'Título en imperativo, descripción en present simple',
        'Los dos en pasado',
        'Título en pasado, descripción en futuro',
      ],
      correcta: 1,
      porQue: '<i>Fix login bug</i> (imperativo) y <i>This PR fixes the login bug</i> (present simple). Son dos convenciones distintas en el mismo commit.',
      porQueNo: {
        0: 'El título va en imperativo por convención de Git.',
        2: 'El pasado se usa a veces en el título, pero no es la convención.',
        3: 'Ninguna de las dos corresponde.',
      },
    },
    {
      p: '¿Qué significa <i>nit:</i> al principio de un comentario en un review?',
      opciones: [
        'Que es un error grave',
        'Que es un comentario menor y opcional, que no bloquea el merge',
        'Que hay que rehacerlo todo',
        'Que no lo revisaste bien',
      ],
      correcta: 1,
      porQue: 'Viene de <i>nitpick</i>. Es una convención muy útil: separa lo importante de lo cosmético.',
      porQueNo: {
        0: 'Marca exactamente lo contrario.',
        2: 'Eso requeriría un comentario bloqueante.',
        3: 'No dice nada sobre la calidad de tu revisión.',
      },
    },
    {
      p: 'Te preguntan <i>Tell me about yourself</i> en una entrevista. ¿Qué contestás?',
      opciones: [
        'Tu biografía completa',
        'Cuatro frases: qué sos, con qué trabajás, qué hacés ahora y qué te gusta',
        'Solo tu nombre',
        'Una lista de tecnologías',
      ],
      correcta: 1,
      porQue: 'No es una biografía: es una presentación profesional breve. Cuatro frases preparadas suenan mucho mejor que una improvisación larga.',
      porQueNo: {
        0: 'Demasiado largo y con información irrelevante.',
        2: 'No dice nada profesional.',
        3: 'Una lista sin contexto no muestra criterio.',
      },
    },
    {
      p: '¿Qué es la estructura STAR y qué tiempo verbal usa?',
      opciones: [
        'Situation, Task, Action, Result — todo en pasado',
        'Un método de estimación de tareas',
        'Una forma de escribir tests',
        'Situation, Time, Answer, Review — en presente',
      ],
      correcta: 0,
      porQue: 'Es la estructura esperada para contar una experiencia en una entrevista, y va enteramente en <b>pasado</b> — módulos 7 y 8.',
      porQueNo: {
        1: 'No tiene relación con estimaciones.',
        2: 'Nada que ver con testing.',
        3: 'Esas no son las siglas ni el tiempo verbal.',
      },
    },
    {
      p: 'Te preguntan si tenés preguntas para ellos. ¿Qué conviene?',
      opciones: [
        'Decir que no, para no hacer perder tiempo',
        'Tener dos o tres preparadas sobre el equipo y la forma de trabajar',
        'Preguntar solo por el sueldo',
        'Improvisar cualquier cosa',
      ],
      correcta: 1,
      porQue: 'Decir «no» se lee como <b>falta de interés</b>. Dos o tres preguntas concretas muestran que evaluaste el puesto en serio.',
      porQueNo: {
        0: 'Es el error más común y el más caro de esta parte de la entrevista.',
        2: 'Es legítima pero sola queda pobre.',
        3: 'Se nota cuando la pregunta es de relleno.',
      },
    },
    {
      p: 'Te preguntan por tu nivel de inglés. ¿Cuál es la mejor respuesta?',
      opciones: [
        'Decir que es perfecto',
        'I read and write English every day. My speaking is still improving, but I can follow technical discussions.',
        'Pedir disculpas por tu nivel',
        'Cambiar de tema',
      ],
      correcta: 1,
      porQue: 'Es específico, verificable y coincide con lo que el entrevistador va a observar. Eso construye credibilidad.',
      porQueNo: {
        0: 'Se contradice con lo que van a escuchar en los siguientes cinco minutos.',
        2: 'Desvía el foco de tu perfil a tus disculpas.',
        3: 'Es una pregunta legítima y evitarla llama la atención.',
      },
    },
  ],
});
