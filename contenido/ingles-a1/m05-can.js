/* ==========================================================================
   Inglés A1 · m05 — Can: poder, saber y pedir
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ingles-a1',
  id: 'm05',
  titulo: 'Can: poder, saber y pedir',
  fuentes: ['cambridge-dic', 'bbc-learning-english', 'wordreference', 'youglish'],

  intro:
    '<p><b>Can</b> es la palabra más rentable de este nivel. Con una sola resolvés tres cosas que en ' +
    'español necesitan verbos distintos: <b>poder</b>, <b>saber</b> hacer algo, y <b>pedir</b>.</p>' +
    '<p>Encima es un <b>modal</b>: no lleva la -s de tercera persona, no necesita <i>do</i> para negar ni ' +
    'preguntar, y el verbo que le sigue va siempre en forma base. Es la parte fácil.</p>' +
    '<p>La parte difícil es <b>escucharla</b>. <i>can</i> y <i>can\'t</i> suenan casi igual en inglés ' +
    'estadounidense, y significan lo contrario. A eso le dedicamos una lección entera.</p>',

  lecciones: [

    /* ==================================================================== */
    {
      id: 'l1',
      titulo: 'Poder y saber, con la misma palabra',
      minutos: 8,

      simple: `
        <p>En español distinguís «puedo nadar» de «sé nadar». En inglés las dos son <b>can</b>.</p>

        <div class="analogia">
          <span class="en" data-say>I can swim</span> — sé nadar / puedo nadar<br>
          <span class="en" data-say>I can speak English</span> — sé hablar inglés<br>
          <span class="en" data-say>I can help you</span> — puedo ayudarte
        </div>

        <p>Una preocupación menos: no tenés que elegir entre <i>know how to</i> y <i>be able to</i>.
        Para el 95% de los casos, <b>can</b>.</p>

        <h4>Se comporta como to be, no como los verbos normales</h4>
        <p><i>can</i> es un <b>modal</b>, y los modales tienen tres características que te simplifican todo:</p>
        <ul>
          <li><b>No lleva -s en tercera persona:</b> ❌ <i>she cans</i> → ✅ <span class="en" data-say>she can</span></li>
          <li><b>No necesita <i>do</i>:</b> ❌ <i>Do you can?</i> → ✅ <span class="en" data-say>Can you?</span></li>
          <li><b>El verbo que sigue va en forma base:</b> ❌ <i>can to swim</i>, ❌ <i>can swimming</i>
          → ✅ <span class="en" data-say>can swim</span></li>
        </ul>

        <table>
          <tr><th></th><th>Con can</th></tr>
          <tr><td>Afirmativo</td><td><span class="en" data-say>She can help</span></td></tr>
          <tr><td>Negativo</td><td><span class="en" data-say>She can't help</span></td></tr>
          <tr><td>Pregunta</td><td><span class="en" data-say>Can she help?</span></td></tr>
          <tr><td>Respuesta corta</td><td><span class="en" data-say>Yes, she can</span> / <span class="en" data-say>No, she can't</span></td></tr>
        </table>

        <div class="aviso">
          <b>La negación se escribe pegada:</b> <b>can't</b>, todo junto — no <i>can not</i> en dos palabras.
          (<i>cannot</i> junto también existe y es más formal; se usa en documentación.)
        </div>

        <h4>Lo que vas a decir con esto</h4>
        <ul>
          <li><span class="en" data-say>I can do that today.</span></li>
          <li><span class="en" data-say>I can't join the call, I have another meeting.</span></li>
          <li><span class="en" data-say>She can review the PR tomorrow.</span></li>
          <li><span class="en" data-say>We can deploy on Friday.</span></li>
          <li><span class="en" data-say>I can't reproduce the bug.</span></li>
        </ul>
        <p>Esa última es de las frases más usadas en cualquier equipo de software.</p>
      `,

      tecnico: `
        <p><b>Can</b> pertenece a la clase de los <b>verbos modales</b>: <i>can</i>, <i>could</i>,
        <i>will</i>, <i>would</i>, <i>shall</i>, <i>should</i>, <i>may</i>, <i>might</i>, <i>must</i>.</p>

        <p>Tienen un comportamiento morfosintáctico propio y uniforme:</p>
        <table>
          <tr><th>Propiedad</th><th>Consecuencia</th></tr>
          <tr><td>Son auxiliares</td><td>Se invierten para preguntar, sin <i>do</i></td></tr>
          <tr><td>No tienen flexión</td><td>Ninguna -s de tercera persona</td></tr>
          <tr><td>No tienen infinitivo</td><td>❌ <i>to can</i> no existe</td></tr>
          <tr><td>No se combinan entre sí</td><td>❌ <i>will can</i> no existe</td></tr>
          <tr><td>Rigen infinitivo sin <i>to</i></td><td><i>can swim</i>, no <i>can to swim</i></td></tr>
        </table>

        <div class="nota-tec">
          <b>El límite de <i>can</i>: no tiene futuro ni participio.</b> Para esos casos existe la
          perífrasis <b>be able to</b>, que sí se conjuga en todos los tiempos:
          <br><br>
          <i>I will be able to help</i> — voy a poder ayudar (❌ <i>I will can help</i>)
          <br><i>I have been able to fix it</i> — pude arreglarlo
          <br><br>
          En presente, <i>be able to</i> también funciona pero suena más formal y pesado.
          <b>Usá <i>can</i> siempre que puedas.</b>
        </div>

        <p><b>Los tres valores de <i>can</i>:</b></p>
        <ul>
          <li><b>Habilidad:</b> <i>I can speak Spanish.</i></li>
          <li><b>Posibilidad:</b> <i>We can deploy on Friday.</i> (está disponible esa opción)</li>
          <li><b>Permiso:</b> <i>You can use my laptop.</i></li>
        </ul>
        <p>La ambigüedad casi nunca genera problemas: el contexto la resuelve. Cuando importa
        distinguir, se usan otras piezas (<i>may</i> para permiso formal, <i>be allowed to</i> para
        permiso explícito).</p>

        <p><b>Sobre <i>can't</i> / <i>cannot</i> / <i>can not</i>.</b> <i>can't</i> es lo normal en
        habla y en escritura corriente. <i>cannot</i> (una sola palabra) es la forma escrita formal —
        aparece en documentación y textos legales. <i>can not</i> en dos palabras es poco frecuente y
        se reserva para cuando <i>not</i> se enfatiza o niega otra cosa.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Can cubre poder, saber y permiso, y no se comporta como un verbo normal">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Una palabra, tres significados</text>

          <g font-size="12.5" text-anchor="middle">
            <rect x="40" y="38" width="176" height="46" rx="9" fill="#34d399" opacity="0.13" stroke="#34d399" stroke-width="1.3"/>
            <text x="128" y="58" font-weight="700" fill="#34d399">saber hacer</text>
            <text x="128" y="76" fill="currentColor" opacity="0.8">I can swim</text>

            <rect x="252" y="38" width="176" height="46" rx="9" fill="#22d3ee" opacity="0.13" stroke="#22d3ee" stroke-width="1.3"/>
            <text x="340" y="58" font-weight="700" fill="#22d3ee">poder / ser posible</text>
            <text x="340" y="76" fill="currentColor" opacity="0.8">We can deploy Friday</text>

            <rect x="464" y="38" width="176" height="46" rx="9" fill="#c084fc" opacity="0.13" stroke="#c084fc" stroke-width="1.3"/>
            <text x="552" y="58" font-weight="700" fill="#c084fc">tener permiso</text>
            <text x="552" y="76" fill="currentColor" opacity="0.8">You can use my laptop</text>
          </g>

          <line x1="128" y1="90" x2="340" y2="106" stroke="currentColor" opacity="0.25" stroke-width="1.3"/>
          <line x1="340" y1="90" x2="340" y2="106" stroke="currentColor" opacity="0.25" stroke-width="1.3"/>
          <line x1="552" y1="90" x2="340" y2="106" stroke="currentColor" opacity="0.25" stroke-width="1.3"/>

          <rect x="272" y="110" width="136" height="36" rx="9" fill="#f59e0b" opacity="0.28" stroke="#f59e0b" stroke-width="1.6"/>
          <text x="340" y="134" text-anchor="middle" font-size="18" font-weight="800" fill="#f59e0b">can</text>

          <line x1="40" y1="164" x2="640" y2="164" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="186" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">Y no se comporta como un verbo normal</text>

          <g font-size="12.5">
            <rect x="40" y="198" width="288" height="30" rx="7" fill="#f87171" opacity="0.1"/>
            <text x="56" y="218" fill="#f87171">✗ she cans · ✗ Do you can? · ✗ can to swim</text>

            <rect x="352" y="198" width="288" height="30" rx="7" fill="#34d399" opacity="0.12"/>
            <text x="368" y="218" fill="#34d399">✓ she can · ✓ Can you? · ✓ can swim</text>
          </g>

          <rect x="40" y="238" width="600" height="30" rx="7" fill="#22d3ee" opacity="0.09" stroke="#22d3ee" stroke-width="1.2"/>
          <text x="340" y="258" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">
            Sin futuro ni participio: para eso está "be able to" → I will be able to help
          </text>
        </svg>`,
        pie: 'Los modales no llevan -s, no piden do, y el verbo que los sigue va en forma base. Siempre.',
      },

      escucha: {
        intro: '<p>Frases de trabajo con <i>can</i>. Fijate que después de <i>can</i> el verbo va ' +
               'siempre pelado: sin <i>to</i> y sin <i>-ing</i>.</p>',
        items: [
          { texto: 'I can do that today.', es: 'Puedo hacer eso hoy.',
            nota: 'Acá <b>can</b> va comprimido, casi "kən". Cuando lleva acento fuerte suele ser porque alguien enfatiza.' },
          { texto: "She can review the PR tomorrow.", es: 'Ella puede revisar el PR mañana.',
            nota: '<b>she can</b>, sin -s. Los modales nunca la llevan.' },
          { texto: "I can't reproduce the bug.", es: 'No puedo reproducir el bug.',
            nota: 'Una de las frases más usadas en cualquier equipo. <b>can\'t</b> se escribe pegado.' },
          { texto: 'Can you join the call at three?', es: '¿Podés sumarte a la call a las tres?',
            nota: 'Pregunta sin <i>do</i>: <b>can</b> es auxiliar y se invierte solo.' },
        ],
      },

      practica: `
        <p><b>Cinco frases sobre vos, ahora, en voz alta:</b></p>
        <ol>
          <li>I can ______ (algo que sabés hacer)</li>
          <li>I can't ______ (algo que no)</li>
          <li>Can you ______? (un pedido real que tengas pendiente)</li>
          <li>We can ______ (una opción para tu equipo)</li>
          <li>I can't ______ today, I have ______ (una excusa real)</li>
        </ol>

        <p><b>Y vigilá las tres trampas</b> mientras las decís:</p>
        <ul>
          <li>Nada de <i>-s</i>: <i>she can</i>, no <i>she cans</i></li>
          <li>Nada de <i>to</i>: <i>can help</i>, no <i>can to help</i></li>
          <li>Nada de <i>do</i>: <i>Can you?</i>, no <i>Do you can?</i></li>
        </ul>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: ['She cans help you.', 'She can helps you.', 'She can help you.', 'She can to help you.'],
          correcta: 2,
          porQue: 'Los modales no llevan <i>-s</i> y el verbo que los sigue va en forma base, sin <i>to</i>.',
          porQueNo: {
            0: '<i>can</i> nunca lleva -s: no tiene flexión.',
            1: 'La -s tampoco va en el verbo principal cuando hay un modal delante.',
            3: 'Los modales rigen infinitivo <b>sin</b> <i>to</i>.',
          },
        },
        {
          tipo: 'opcion',
          p: '¿Cómo se pregunta «¿podés ayudarme?»',
          opciones: ['Do you can help me?', 'Can you help me?', 'You can help me?', 'Can you to help me?'],
          correcta: 1,
          porQue: '<b>can</b> es auxiliar: se invierte solo, sin pedir prestado <i>do</i>.',
          porQueNo: {
            0: 'Los modales no necesitan <i>do</i>. Es el error típico al venir del módulo 3.',
            2: 'Sin inversión suena a incredulidad, no a pregunta neutra.',
            3: 'Sobra el <i>to</i>.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá con la negación de <b>can</b>: <b>I ______ reproduce the bug.</b>',
          respuesta: "can't",
          respuestas: ['cannot', 'can not'],
          porQue: '<b>can\'t</b> es lo normal. <i>cannot</i> junto es la variante formal de documentación.',
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Sé hablar inglés.</b>',
          respuesta: 'I can speak English',
          pista: 'En inglés «saber hacer algo» también es can.',
          porQue: '<b>can</b> cubre «saber hacer» y «poder». No hace falta <i>I know how to speak</i>, aunque exista.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «No puedo sumarme a la call hoy.»',
          respuesta: "I can't join the call today",
          porQue: '<b>join</b> en forma base después del modal. Y <i>join the call</i> es el bloque fijo para «sumarse a una llamada».',
        },
      ],

      errores: [
        { mito: 'Para «sé nadar» hay que decir <i>I know how to swim</i>.',
          realidad: 'Existe y es correcto, pero suena pesado. Lo natural es <b>I can swim</b>. ' +
                    '<i>can</i> cubre «poder» y «saber hacer» sin distinguir, y el contexto resuelve el resto.' },
        { mito: 'Después de <i>can</i> va <i>to</i>, como después de otros verbos.',
          realidad: 'Los modales rigen <b>infinitivo sin <i>to</i></b>: <i>can swim</i>, <i>can help</i>, <i>can do</i>. ' +
                    'Poner <i>to</i> es de los errores que más se escuchan y de los más fáciles de corregir.' },
        { mito: 'Puedo decir <i>I will can help you</i> para el futuro.',
          realidad: 'Los modales <b>no se combinan entre sí</b>. Para el futuro va <b>be able to</b>: ' +
                    '<i>I will be able to help you</i>. Y para el pasado, <i>could</i> o <i>was able to</i>.' },
      ],

      glosario: [
        { t: 'Modal', d: 'Verbo auxiliar que expresa posibilidad, permiso u obligación: can, could, will, would, should, must. No llevan -s ni piden <i>do</i>.' },
        { t: 'Forma base', d: 'El verbo pelado, sin <i>to</i> ni terminaciones. Es lo que va siempre después de un modal.' },
        { t: 'Be able to', d: 'La perífrasis que reemplaza a <i>can</i> donde este no llega: futuro y participio. <i>I will be able to…</i>' },
        { t: "Can't / cannot", d: '<i>can\'t</i> en habla y escritura corriente; <i>cannot</i> junto en registro formal y documentación.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l2',
      titulo: 'Pedir sin sonar mandón',
      minutos: 9,

      simple: `
        <p>Acá hay una diferencia cultural que importa más que la gramática.</p>

        <p>En español pedís cosas en imperativo y no suena mal: «pasame el archivo», «revisá esto».
        En inglés, el imperativo pelado <b>suena a orden</b>. Lo normal es <b>envolver el pedido</b>
        en una pregunta.</p>

        <div class="aviso">
          ❌ <i>Send me the file.</i> — suena a orden, casi grosero<br>
          ✅ <span class="en" data-say>Can you send me the file?</span> — normal<br>
          ✅ <span class="en" data-say>Could you send me the file?</span> — un poco más cortés<br>
          ✅ <span class="en" data-say>Could you send me the file, please?</span> — cortés
        </div>

        <h4>La escala de cortesía</h4>
        <table>
          <tr><th>Forma</th><th>Nivel</th><th>Cuándo</th></tr>
          <tr><td><span class="en" data-say>Can you…?</span></td><td>neutro</td><td>con cualquiera del equipo</td></tr>
          <tr><td><span class="en" data-say>Could you…?</span></td><td>más cortés</td><td>por defecto en el trabajo</td></tr>
          <tr><td><span class="en" data-say>Would you mind…?</span></td><td>muy cortés</td><td>pedidos grandes o a alguien que no conocés</td></tr>
          <tr><td><span class="en" data-say>Do you think you could…?</span></td><td>muy suave</td><td>cuando ya sabés que es molesto</td></tr>
        </table>

        <p><b>La recomendación práctica: usá <i>could</i> por defecto.</b> Es cortés sin ser exagerado,
        y sirve en cualquier contexto laboral.</p>

        <h4>Pedir permiso</h4>
        <ul>
          <li><span class="en" data-say>Can I ask a question?</span> — ¿puedo hacer una pregunta?</li>
          <li><span class="en" data-say>Can I share my screen?</span> — ¿puedo compartir pantalla?</li>
          <li><span class="en" data-say>Could I have a minute?</span> — ¿me das un minuto?</li>
        </ul>

        <h4>Ofrecer</h4>
        <ul>
          <li><span class="en" data-say>Can I help you with that?</span></li>
          <li><span class="en" data-say>I can take a look if you want.</span></li>
          <li><span class="en" data-say>Let me know if I can help.</span></li>
        </ul>

        <div class="aviso">
          <b>Ojo con <i>Would you mind…?</i></b> Es una trampa: la respuesta se invierte.<br><br>
          — <span class="en" data-say>Would you mind sending me the file?</span> (¿te molestaría mandarme el archivo?)<br>
          — <span class="en" data-say>Not at all</span> = «para nada» = <b>sí, te lo mando</b><br><br>
          Contestar <i>yes</i> significa «sí, me molesta». Por las dudas, contestá
          <span class="en" data-say>Sure, no problem</span> y listo.
        </div>
      `,

      tecnico: `
        <p>Lo que está en juego se llama <b>mitigación</b>: reducir la imposición que un pedido supone
        sobre el otro. El inglés la codifica gramaticalmente mucho más que el español.</p>

        <p>Los mecanismos, de menor a mayor:</p>
        <table>
          <tr><th>Mecanismo</th><th>Ejemplo</th></tr>
          <tr><td>Convertir la orden en pregunta</td><td>Can you send it?</td></tr>
          <tr><td>Usar el modal en pasado</td><td>Could you send it?</td></tr>
          <tr><td>Agregar <i>please</i></td><td>Could you send it, please?</td></tr>
          <tr><td>Preguntar por la disposición</td><td>Would you mind sending it?</td></tr>
          <tr><td>Duplicar la mitigación</td><td>Do you think you could send it?</td></tr>
        </table>

        <div class="nota-tec">
          <b>Por qué <i>could</i> suena más cortés que <i>can</i>.</b> Es la forma de pasado de <i>can</i>,
          pero acá no expresa pasado: expresa <b>distancia</b>. Al alejar el pedido del presente real,
          lo presenta como hipotético — y un pedido hipotético es más fácil de rechazar, lo cual reduce
          la presión sobre el otro.
          <br><br>
          Es el mismo mecanismo del español: «¿podrías…?» es más suave que «¿podés…?». La diferencia
          es cuánto se usa: en inglés de trabajo, <i>could</i> es prácticamente el default.
        </div>

        <p><b>Sobre el imperativo.</b> No está prohibido: es normal en instrucciones, documentación y
        contextos donde no hay imposición personal.</p>
        <ul>
          <li>✅ <i>Run npm install, then start the server.</i> — instrucciones técnicas</li>
          <li>✅ <i>Let me know if you have questions.</i> — fórmula fija, muy usada</li>
          <li>✅ <i>Fix login bug</i> — título de commit</li>
          <li>❌ <i>Send me the report.</i> — pedido personal, suena a orden</li>
        </ul>

        <p><b>Sobre <i>please</i>.</b> Menos frecuente de lo que enseñan. Ponerlo en cada frase suena
        forzado o servil. En un pedido escrito breve funciona bien; en conversación se usa más al final
        y con entonación descendente.</p>

        <p><b>Y una nota cultural.</b> El inglés de trabajo internacional combina <b>contenido directo</b>
        con <b>forma envuelta</b>. Se espera que digas exactamente qué necesitás — la vaguedad se lee
        como falta de claridad, no como cortesía — pero que lo formules como pregunta.
        <i>Could you send me the file by Friday?</i> es directo en el pedido y cortés en la forma.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Escala de cortesía para hacer pedidos en inglés">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Escala de cortesía al pedir</text>

          <line x1="80" y1="60" x2="600" y2="60" stroke="currentColor" opacity="0.2" stroke-width="2"/>
          <text x="80" y="48" font-size="11" font-weight="700" fill="#f87171">directo</text>
          <text x="600" y="48" text-anchor="end" font-size="11" font-weight="700" fill="#34d399">envuelto</text>

          <g>
            <rect x="34" y="76" width="146" height="66" rx="9" fill="#f87171" opacity="0.11" stroke="#f87171" stroke-width="1.3"/>
            <text x="107" y="98" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f87171">Send me the file.</text>
            <text x="107" y="118" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">suena a orden</text>
            <text x="107" y="134" text-anchor="middle" font-size="11" fill="#f87171">✗ evitalo</text>
          </g>

          <g>
            <rect x="192" y="76" width="146" height="66" rx="9" fill="#fbbf24" opacity="0.12" stroke="#fbbf24" stroke-width="1.3"/>
            <text x="265" y="98" text-anchor="middle" font-size="12.5" font-weight="700" fill="currentColor">Can you…?</text>
            <text x="265" y="118" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">neutro</text>
            <text x="265" y="134" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">con el equipo</text>
          </g>

          <g>
            <rect x="350" y="76" width="146" height="66" rx="9" fill="#34d399" opacity="0.16" stroke="#34d399" stroke-width="1.8"/>
            <text x="423" y="98" text-anchor="middle" font-size="12.5" font-weight="800" fill="#34d399">Could you…?</text>
            <text x="423" y="118" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">cortés</text>
            <text x="423" y="134" text-anchor="middle" font-size="11" font-weight="700" fill="#34d399">✓ tu default</text>
          </g>

          <g>
            <rect x="508" y="76" width="146" height="66" rx="9" fill="#c084fc" opacity="0.12" stroke="#c084fc" stroke-width="1.3"/>
            <text x="581" y="98" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">Would you mind…?</text>
            <text x="581" y="118" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">muy cortés</text>
            <text x="581" y="134" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">pedidos grandes</text>
          </g>

          <line x1="34" y1="162" x2="646" y2="162" stroke="currentColor" opacity="0.15"/>

          <rect x="34" y="176" width="612" height="42" rx="9" fill="#22d3ee" opacity="0.09" stroke="#22d3ee" stroke-width="1.2"/>
          <text x="340" y="196" text-anchor="middle" font-size="12.5" font-weight="700" fill="#22d3ee">La regla del inglés de trabajo</text>
          <text x="340" y="212" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">
            contenido DIRECTO + forma ENVUELTA · "Could you send me the file by Friday?"
          </text>

          <rect x="34" y="228" width="612" height="42" rx="9" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="340" y="248" text-anchor="middle" font-size="12" font-weight="700" fill="#f59e0b">Trampa: "Would you mind…?" invierte la respuesta</text>
          <text x="340" y="264" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.8">
            "Not at all" = sí, lo hago · Por las dudas: "Sure, no problem"
          </text>
        </svg>`,
        pie: 'Cuanto más a la derecha, menos presión sobre el otro. Could es el punto justo para casi todo.',
      },

      escucha: {
        intro: '<p>Pedidos reales de trabajo. Prestá atención a cómo se envuelven: ' +
               'ninguno es una orden directa.</p>',
        items: [
          { texto: 'Could you take a look at this PR?', es: '¿Podrías mirar este PR?',
            nota: '<b>take a look at</b> es el bloque fijo para «revisar algo por encima».' },
          { texto: 'Can I ask a quick question?', es: '¿Puedo hacer una pregunta rápida?',
            nota: '<b>quick</b> es un mitigador barato y muy usado: baja la imposición antes de pedir.' },
          { texto: 'Would you mind sharing your screen?', es: '¿Te molestaría compartir pantalla?',
            nota: 'Después de <b>mind</b> va el verbo con <i>-ing</i>, no con <i>to</i>.' },
          { texto: 'Let me know if I can help.', es: 'Avisame si puedo ayudar.',
            nota: 'Imperativo, y suena perfecto: es una fórmula fija de ofrecimiento, no una orden.' },
          { texto: 'Sure, no problem. I can do that today.', es: 'Claro, no hay problema. Puedo hacerlo hoy.',
            nota: 'La respuesta segura a cualquier pedido, incluido <i>Would you mind…?</i>' },
        ],
      },

      practica: `
        <p><b>Reescribí estas órdenes como pedidos.</b> En voz alta, con <i>could</i>:</p>
        <ol>
          <li>Send me the logs. → ______</li>
          <li>Review my PR. → ______</li>
          <li>Join the call. → ______</li>
          <li>Explain that again. → ______</li>
        </ol>

        <p><b>Y guardate estas cinco</b>, que cubren casi todo lo que vas a necesitar pedir:</p>
        <ul>
          <li><span class="en" data-say>Could you take a look at this?</span></li>
          <li><span class="en" data-say>Can I ask a quick question?</span></li>
          <li><span class="en" data-say>Could you explain that again?</span></li>
          <li><span class="en" data-say>Would you mind repeating that?</span></li>
          <li><span class="en" data-say>Let me know if I can help.</span></li>
        </ul>

        <p><b>Y la respuesta universal:</b> <span class="en" data-say>Sure, no problem.</span>
        Sirve para aceptar cualquier pedido, incluidos los que están formulados al revés
        con <i>Would you mind</i>.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Necesitás que un compañero te mande un archivo. ¿Cuál conviene?',
          opciones: ['Send me the file.', 'Could you send me the file?', 'You must send me the file.', 'I want the file.'],
          correcta: 1,
          porQue: '<b>Could you…?</b> es el default del inglés de trabajo: directo en el pedido, cortés en la forma.',
          porQueNo: {
            0: 'El imperativo pelado suena a orden en un pedido personal. Está bien para instrucciones técnicas, no para esto.',
            2: '<i>must</i> expresa obligación: suena a que sos su jefe y encima apurado.',
            3: 'Suena a exigencia sin ninguna mitigación.',
          },
        },
        {
          tipo: 'opcion',
          p: 'Te preguntan <span class="en" data-say>Would you mind sharing your screen?</span> y querés aceptar. ¿Qué contestás?',
          opciones: ['Yes, I mind.', 'Yes, of course.', 'Not at all.', 'No, I cannot.'],
          correcta: 2,
          porQue: '<i>Would you mind…?</i> pregunta si te <b>molesta</b>. «No, para nada» = sí, lo hago. Si dudás, <i>Sure, no problem</i> es infalible.',
          porQueNo: {
            0: 'Significa «sí, me molesta»: estarías rechazando.',
            1: 'Es lo que sale por instinto y es ambiguo, porque el <i>yes</i> literalmente contesta «sí me molesta». Se entiende por el tono, pero no es lo correcto.',
            3: 'Es un rechazo directo.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá con la forma más cortés de <i>can</i>: <b>______ you explain that again?</b>',
          respuesta: 'Could',
          respuestas: ['could'],
          porQue: '<b>could</b> presenta el pedido como hipotético, y eso baja la presión sobre el otro. Es el default del trabajo.',
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>¿Podrías mirar este PR?</b>',
          respuesta: 'Could you take a look at this PR?',
          respuestas: ['Could you take a look at this PR', 'Could you look at this PR?', 'Could you review this PR?'],
          pista: '«Mirar por encima» es take a look at.',
          porQue: '<b>take a look at</b> es lo más usado para pedir una revisión sin que suene a auditoría.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá el ofrecimiento: «Avisame si puedo ayudar.»',
          respuesta: 'Let me know if I can help',
          porQue: 'Imperativo, y suena perfecto: <b>Let me know</b> es una fórmula fija, no una orden.',
        },
      ],

      errores: [
        { mito: 'Si traduzco «mandame el archivo» literalmente está bien, es lo mismo que en español.',
          realidad: '<i>Send me the file</i> suena a <b>orden</b>. En español el imperativo es neutro para pedir; ' +
                    'en inglés hay que envolverlo: <b>Could you send me the file?</b> Es de las cosas que más ' +
                    'afectan cómo te perciben, y cuesta cero arreglarla.' },
        { mito: 'Hay que poner <i>please</i> en cada pedido para ser cortés.',
          realidad: 'Se usa menos de lo que enseñan. Ponerlo en cada frase suena forzado. La cortesía viene sobre todo ' +
                    'de <b>envolver el pedido en una pregunta</b> y usar <i>could</i>. <i>please</i> es un extra, ' +
                    'no el mecanismo principal.' },
        { mito: 'Contestar <i>yes</i> a <i>Would you mind…?</i> significa que aceptás.',
          realidad: 'Literalmente significa <b>«sí, me molesta»</b>. La aceptación es <i>Not at all</i> o ' +
                    '<i>Of course not</i>. En la práctica se entiende por el tono, pero para no jugártela: ' +
                    '<b>Sure, no problem</b> siempre funciona.' },
      ],

      glosario: [
        { t: 'Could', d: 'La forma de pasado de <i>can</i>, usada para pedir con más cortesía. No expresa pasado: expresa distancia.' },
        { t: 'Would you mind + -ing', d: '¿Te molestaría…? Lleva el verbo en <i>-ing</i>, y la respuesta afirmativa es negativa: <i>Not at all</i>.' },
        { t: 'Take a look at', d: 'Mirar, revisar por encima. El bloque estándar para pedir una revisión sin que suene a auditoría.' },
        { t: 'Mitigación', d: 'Reducir la imposición de un pedido. El inglés la codifica gramaticalmente mucho más que el español.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l3',
      titulo: 'La trampa: can contra can\'t',
      minutos: 8,

      simple: `
        <p>Esta lección resuelve un problema concreto que vas a tener en tu primera call:
        <b>no distinguir si alguien dijo «puedo» o «no puedo»</b>.</p>

        <p>Suena a exageración y no lo es. En inglés estadounidense, <b>can</b> y <b>can't</b>
        se parecen muchísimo, porque la <b>t</b> final casi no se pronuncia.</p>

        <div class="analogia">
          <span class="en" data-say>I can help</span><br>
          <span class="en" data-say>I can't help</span><br><br>
          Escuchalos varias veces. La diferencia es sutil.
        </div>

        <h4>Las tres señales que sí funcionan</h4>

        <p><b>1. La vocal.</b> Es la señal más confiable:</p>
        <ul>
          <li><b>can</b> afirmativo va <b>sin acento</b> y se reduce a "kən" — un murmullo</li>
          <li><b>can't</b> lleva <b>acento</b> y la vocal es plena: "KÆNT"</li>
        </ul>

        <p><b>2. La duración.</b> <i>can't</i> es más largo. La <i>t</i> corta el sonido de golpe,
        aunque no la oigas como una "t" clara.</p>

        <p><b>3. El énfasis de la frase.</b> En <i>I can help</i> el golpe cae en <b>help</b>.
        En <i>I can't help</i> el golpe cae en <b>can't</b>. Es lo del módulo 0: seguí los golpes.</p>

        <div class="aviso">
          <b>En inglés británico es más fácil:</b> <i>can't</i> se dice "kaant", con una vocal larga
          y bien distinta de <i>can</i>. Si escuchás a alguien de UK, no vas a tener este problema.
        </div>

        <h4>Y la solución que usa todo el mundo</h4>
        <p>Cuando no estás seguro, <b>preguntá</b>. No es una derrota, es lo que hacen los nativos
        entre ellos cuando el audio está malo:</p>
        <ul>
          <li><span class="en" data-say>Sorry, can or can't?</span></li>
          <li><span class="en" data-say>Sorry, you can or you cannot?</span></li>
          <li><span class="en" data-say>Just to confirm: you can do it, right?</span></li>
        </ul>
        <p>La segunda usa <b>cannot</b> separado justamente porque es imposible de confundir.
        Es un truco práctico que vale la pena tener.</p>

        <h4>Y del otro lado: cómo decirlo vos</h4>
        <p>Cuando <b>vos</b> digas <i>can't</i>, <b>acentualo fuerte</b>. Es la forma de asegurarte
        de que se entienda. Y si el tema es importante, agregá contexto:
        <span class="en" data-say>I can't do it today — maybe tomorrow.</span></p>
      `,

      tecnico: `
        <p>El fenómeno tiene dos causas que se suman.</p>

        <p><b>1. Reducción del <i>can</i> afirmativo.</b> Como auxiliar átono, <i>can</i> tiene forma
        débil: /kən/, con schwa. Es el mismo mecanismo del módulo 0 — las palabras funcionales se
        comprimen.</p>

        <p><b>2. Elisión de la /t/ final.</b> En inglés norteamericano, la /t/ final de <i>can't</i>
        rara vez se articula como oclusiva plena. Suele realizarse como una <b>oclusión glotal</b> —
        un corte brusco del aire — o directamente desaparecer ante consonante siguiente.</p>

        <table>
          <tr><th></th><th>can (afirmativo)</th><th>can't (negativo)</th></tr>
          <tr><td>Acento</td><td>átono</td><td><b>tónico</b></td></tr>
          <tr><td>Vocal</td><td>/ə/ schwa</td><td>/æ/ plena (US) · /ɑː/ larga (UK)</td></tr>
          <tr><td>Duración</td><td>corta</td><td>más larga</td></tr>
          <tr><td>Final</td><td>abierta</td><td>cortada (oclusión glotal)</td></tr>
        </table>

        <div class="nota-tec">
          <b>La señal robusta es el acento, no la /t/.</b> Perseguir la <i>t</i> no funciona porque
          muchas veces no está. Lo que sí está siempre es que <b><i>can't</i> lleva acento y <i>can</i> no</b>.
          <br><br>
          Traducido a la práctica: si escuchás la palabra <b>clara y con peso</b>, es <i>can't</i>.
          Si apenas la registrás, es <i>can</i>.
        </div>

        <p><b>La excepción que confunde:</b> <i>can</i> afirmativo <b>sí</b> lleva acento cuando se
        enfatiza o cuando queda al final de la frase:</p>
        <ul>
          <li><i>Yes, I CAN.</i> — respuesta corta, acentuado</li>
          <li><i>I CAN do it, I just don't want to.</i> — contraste enfático</li>
        </ul>
        <p>En esos casos el contexto lo aclara igual.</p>

        <p><b>Estrategia de escucha.</b> Los nativos tampoco lo resuelven solo por el sonido: usan el
        <b>contexto y la entonación de la frase completa</b>. Si alguien dice
        <i>I can't make it to the meeting</i>, la palabra que lleva el golpe principal es <i>can't</i>,
        y eso ya te lo dice. Entrenar el oído para el ritmo —no para el fonema— es lo que resuelve
        este problema.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diferencias acústicas entre can y cant en inglés estadounidense">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Por qué se confunden, y qué escuchar</text>

          <rect x="34" y="38" width="290" height="122" rx="10" fill="#34d399" opacity="0.09" stroke="#34d399" stroke-width="1.3"/>
          <text x="179" y="62" text-anchor="middle" font-size="17" font-weight="800" fill="#34d399">can</text>
          <text x="179" y="82" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.75">afirmativo</text>

          <g>
            <rect x="70" y="96" width="20" height="14" rx="3" fill="currentColor" opacity="0.18"/>
            <rect x="96" y="98" width="26" height="10" rx="3" fill="currentColor" opacity="0.14"/>
            <rect x="128" y="88" width="60" height="30" rx="5" fill="#34d399" opacity="0.45"/>
            <text x="80"  y="107" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.6">I</text>
            <text x="109" y="107" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.6">kən</text>
            <text x="158" y="108" text-anchor="middle" font-size="12" font-weight="800" fill="#34d399">HELP</text>
          </g>
          <text x="179" y="136" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.75">átono · vocal floja /ə/</text>
          <text x="179" y="152" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.75">el golpe cae en el verbo</text>

          <rect x="356" y="38" width="290" height="122" rx="10" fill="#f87171" opacity="0.09" stroke="#f87171" stroke-width="1.3"/>
          <text x="501" y="62" text-anchor="middle" font-size="17" font-weight="800" fill="#f87171">can't</text>
          <text x="501" y="82" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.75">negativo</text>

          <g>
            <rect x="392" y="96" width="20" height="14" rx="3" fill="currentColor" opacity="0.18"/>
            <rect x="418" y="86" width="66" height="34" rx="5" fill="#f87171" opacity="0.5"/>
            <rect x="490" y="98" width="46" height="10" rx="3" fill="currentColor" opacity="0.14"/>
            <text x="402" y="107" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.6">I</text>
            <text x="451" y="108" text-anchor="middle" font-size="12" font-weight="800" fill="#f87171">KÆNT</text>
            <text x="513" y="107" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.6">help</text>
          </g>
          <text x="501" y="136" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.75">tónico · vocal plena /æ/</text>
          <text x="501" y="152" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.75">el golpe cae en can't</text>

          <rect x="34" y="174" width="612" height="46" rx="9" fill="#f59e0b" opacity="0.11" stroke="#f59e0b" stroke-width="1.3"/>
          <text x="340" y="194" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f59e0b">No persigas la "t" — muchas veces no está</text>
          <text x="340" y="212" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">
            Si la palabra suena CLARA y con peso → can't · Si apenas la registrás → can
          </text>

          <rect x="34" y="230" width="612" height="46" rx="9" fill="#22d3ee" opacity="0.09" stroke="#22d3ee" stroke-width="1.2"/>
          <text x="340" y="250" text-anchor="middle" font-size="12.5" font-weight="700" fill="#22d3ee">Y si igual no estás seguro, preguntá</text>
          <text x="340" y="268" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">
            "Sorry, can or cannot?" — usar cannot separado hace imposible confundirse
          </text>
        </svg>`,
        pie: 'La señal confiable no es la consonante final: es dónde cae el acento de la frase.',
        nota: '<p>Este diagrama es una aplicación directa de la lección 3 del módulo 0. ' +
              'Si entendiste el ritmo acentual, ya tenés la herramienta para resolver este problema.</p>',
      },

      escucha: {
        intro: '<p>El ejercicio más difícil del track hasta acá. Escuchá cada frase varias veces ' +
               'antes de escribir, y usá el botón <b>Lento</b> sin culpa.</p>',
        items: [
          { texto: 'I can help you with that.', es: 'Puedo ayudarte con eso.',
            nota: 'Afirmativo: <b>can</b> apenas se oye, el golpe está en <i>help</i>.' },
          { texto: "I can't help you with that.", es: 'No puedo ayudarte con eso.',
            nota: 'Negativo: <b>can\'t</b> suena claro y con peso. Ahí está toda la diferencia.' },
          { texto: "She can't make it to the meeting.", es: 'Ella no puede llegar a la reunión.',
            nota: '<b>make it</b> = llegar, poder asistir. Es la expresión estándar para excusarse.' },
          { texto: 'Sorry, can or cannot?', es: 'Perdón, ¿podés o no podés?',
            nota: 'La pregunta que usa todo el mundo. Con <b>cannot</b> separado es imposible confundirse.' },
        ],
      },

      practica: `
        <p><b>Entrenamiento de par mínimo, tres minutos.</b> Alterná estas dos frases escuchándolas
        muchas veces seguidas, hasta que la diferencia te resulte obvia:</p>
        <p><span class="en" data-say>I can do it</span> · <span class="en" data-say>I can't do it</span></p>
        <p>No busques la <i>t</i>. Buscá <b>cuál de las palabras suena más fuerte</b>.</p>

        <p><b>Después grabate diciendo las dos</b> con el micrófono de la pestaña 🎧 y escuchate.
        ¿Se distinguen? Si no, exagerá el <i>can't</i>: al principio conviene pasarse de marcado.</p>

        <p><b>Y tené lista la pregunta de rescate.</b> No es un fracaso usarla — es lo que hacen los
        nativos entre ellos con audio malo:</p>
        <ul>
          <li><span class="en" data-say>Sorry, can or cannot?</span></li>
          <li><span class="en" data-say>Just to confirm: you can do it, right?</span></li>
        </ul>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: '¿Cuál es la señal <b>más confiable</b> para distinguir <i>can</i> de <i>can\'t</i> en inglés estadounidense?',
          opciones: [
            'Escuchar claramente la "t" final',
            'Dónde cae el acento: can\'t lleva peso, can se comprime',
            'La velocidad de la frase',
            'Si la frase es larga o corta',
          ],
          correcta: 1,
          porQue: 'La <i>t</i> muchas veces no se articula. Lo que sí está siempre es que <b>can\'t es tónico y can es átono</b>.',
          porQueNo: {
            0: 'En inglés norteamericano esa <i>t</i> se realiza como oclusión glotal o desaparece. Perseguirla no funciona.',
            2: 'La velocidad no distingue nada acá.',
            3: 'La longitud de la frase es irrelevante.',
          },
        },
        {
          tipo: 'dictado',
          p: 'Escuchá con mucha atención. ¿Puede o no puede?',
          respuesta: "I can't help you with that",
          porQue: 'Fijate que <b>can\'t</b> es la palabra que lleva el golpe. En la versión afirmativa el golpe cae en <i>help</i>.',
        },
        {
          tipo: 'dictado',
          p: 'Y esta otra. Escuchá dónde cae el peso de la frase.',
          respuesta: 'I can do that today',
          porQue: 'Acá <b>can</b> apenas se oye — va comprimido a "kən". El golpe está en <i>do</i> y en <i>today</i>.',
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Perdón, ¿podés o no podés?</b>',
          respuesta: 'Sorry, can or cannot?',
          respuestas: ['Sorry, can or cannot', "Sorry, can or can't?"],
          pista: 'Conviene la forma que no se puede confundir.',
          porQue: 'Con <b>cannot</b> separado es imposible confundirse. Es un truco práctico que usan hasta los nativos.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «Ella no puede llegar a la reunión.»',
          respuesta: "She can't make it to the meeting",
          porQue: '<b>make it</b> = llegar, poder asistir. Es la forma estándar de excusarse por no ir.',
        },
      ],

      errores: [
        { mito: 'Si presto atención a la "t" voy a distinguir <i>can</i> de <i>can\'t</i>.',
          realidad: 'En inglés norteamericano esa <i>t</i> casi nunca se articula: se realiza como una oclusión glotal ' +
                    'o desaparece. La señal confiable es <b>el acento</b>: <i>can\'t</i> suena claro y con peso, ' +
                    '<i>can</i> se comprime hasta casi desaparecer.' },
        { mito: 'Preguntar «can or cannot?» queda mal, delata que no entendí.',
          realidad: 'Lo hacen <b>los nativos entre ellos</b> cuando el audio está malo. Y usar <i>cannot</i> separado ' +
                    'es un truco deliberado justamente porque es imposible de confundir. ' +
                    'Confirmar es infinitamente mejor que asumir mal.' },
        { mito: '<i>can</i> afirmativo nunca lleva acento.',
          realidad: 'Sí lo lleva cuando se enfatiza o queda al final: <i>Yes, I CAN</i>, ' +
                    '<i>I CAN do it, I just don\'t want to</i>. Pero en esos casos el contexto lo aclara igual, ' +
                    'así que la regla práctica sigue sirviendo.' },
      ],

      glosario: [
        { t: 'Forma débil', d: 'La versión comprimida de una palabra funcional. <i>can</i> afirmativo se reduce a /kən/.' },
        { t: 'Oclusión glotal', d: 'Un corte brusco del aire en la garganta. Es como suele realizarse la <i>t</i> final de <i>can\'t</i> en EE.UU.' },
        { t: 'Make it', d: 'Llegar, poder asistir. <i>I can\'t make it</i> es la forma estándar de excusarse de una reunión.' },
        { t: 'Cannot', d: 'La forma escrita formal de <i>can\'t</i>. Al hablar sirve como truco: es imposible de confundir.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l4',
      titulo: 'Can en la call: el kit completo',
      minutos: 9,

      simple: `
        <p>Todo junto, en el contexto donde lo vas a usar. Este es el módulo que más te va a servir
        para sobrevivir tu primera reunión en inglés.</p>

        <h4>Problemas técnicos — lo primero de toda call</h4>
        <ul>
          <li><span class="en" data-say>Can you hear me?</span></li>
          <li><span class="en" data-say>I can't hear you.</span></li>
          <li><span class="en" data-say>Can you see my screen?</span></li>
          <li><span class="en" data-say>Sorry, you're breaking up.</span> — se te corta</li>
          <li><span class="en" data-say>Can you turn on your camera?</span></li>
          <li><span class="en" data-say>You're on mute.</span> — tenés el mic apagado</li>
        </ul>
        <p><b><i>You're on mute</i></b> es probablemente la frase más dicha del trabajo remoto mundial.</p>

        <h4>Cuando no entendés</h4>
        <ul>
          <li><span class="en" data-say>Sorry, could you repeat that?</span></li>
          <li><span class="en" data-say>Could you speak a bit more slowly, please?</span></li>
          <li><span class="en" data-say>Sorry, I can't follow.</span> — no te sigo</li>
          <li><span class="en" data-say>Can you write it in the chat?</span></li>
          <li><span class="en" data-say>Can you spell that?</span></li>
        </ul>

        <h4>Comprometerte con algo (o no)</h4>
        <ul>
          <li><span class="en" data-say>I can have it ready by Friday.</span></li>
          <li><span class="en" data-say>I can't commit to that today.</span></li>
          <li><span class="en" data-say>I can take a look this afternoon.</span></li>
          <li><span class="en" data-say>I can't reproduce it on my machine.</span></li>
          <li><span class="en" data-say>Let me check and I can get back to you.</span></li>
        </ul>

        <div class="analogia">
          <b>Una call completa, en cinco frases:</b><br>
          <span class="en" data-say>Hi everyone, can you hear me? Sorry, I was on mute. I can take the API task — I can have it ready by Thursday. I can't join tomorrow, I have a conflict. Let me know if I can help with anything else.</span>
        </div>

        <h4>Y la más importante de todas</h4>
        <div class="aviso">
          <span class="en" data-say>Sorry, I'm not sure I understood. Could you say that again?</span><br><br>
          <b>Usala.</b> Quedarse callado asintiendo sin entender es lo que genera problemas de verdad,
          porque después hacés algo distinto de lo que te pidieron. Pedir aclaración es normal,
          profesional y esperado.
        </div>
      `,

      tecnico: `
        <p><b>Vocabulario de reunión remota</b>, ordenado por frecuencia real:</p>
        <table>
          <tr><th>Expresión</th><th>Significa</th></tr>
          <tr><td>You're on mute</td><td>tenés el micrófono apagado</td></tr>
          <tr><td>You're breaking up</td><td>se te corta el audio</td></tr>
          <tr><td>Can you hear me?</td><td>¿me escuchan?</td></tr>
          <tr><td>I can't follow</td><td>no te sigo, me perdí</td></tr>
          <tr><td>Let's take this offline</td><td>sigamos esto después, aparte</td></tr>
          <tr><td>Let me get back to you</td><td>te confirmo después</td></tr>
          <tr><td>I'll drop it in the chat</td><td>lo escribo en el chat</td></tr>
          <tr><td>Can we circle back to this?</td><td>¿lo retomamos después?</td></tr>
        </table>

        <div class="nota-tec">
          <b>Sobre <i>take it offline</i>.</b> No significa desconectarse: significa <b>sacar un tema de
          la reunión general</b> para discutirlo aparte con quien corresponda. Es una fórmula muy útil
          cuando una discusión se está estirando y solo le interesa a dos personas.
          <br><br>
          <i>That's a good point — can we take it offline? I'll ping you after the call.</i>
        </div>

        <p><b>Sobre comprometerse con plazos.</b> El inglés de trabajo tiene un registro específico
        para esto, con distinto nivel de compromiso:</p>
        <ul>
          <li><i>I can have it ready by Friday.</i> — compromiso claro</li>
          <li><i>I should be able to finish it today.</i> — probable, con margen</li>
          <li><i>I'll try to get it done, but I can't promise.</i> — advertencia explícita</li>
          <li><i>I can't commit to that.</i> — no, formulado profesionalmente</li>
        </ul>
        <p>Esa última merece atención: <b>decir que no en inglés de trabajo es normal y esperado</b>.
        Lo que se valora es que lo digas <b>a tiempo y claro</b>, no que aceptes todo y después
        incumplas. <i>I can't commit to that today, but I could look at it on Thursday</i> es una
        respuesta excelente.</p>

        <p><b>Sobre <i>I can't reproduce it</i>.</b> Es probablemente la frase técnica más usada del
        mundo del software. Vale la pena tenerla automática, junto con
        <i>It works on my machine</i> (que se dice medio en broma, porque es el chiste más viejo
        de la industria).</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Frases con can organizadas por momento de una videollamada">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Una call, de principio a fin</text>

          <line x1="58" y1="46" x2="58" y2="278" stroke="currentColor" opacity="0.2" stroke-width="2"/>

          <circle cx="58" cy="62" r="7" fill="#34d399"/>
          <text x="80" y="58" font-size="12.5" font-weight="700" fill="#34d399">Entrás</text>
          <text x="80" y="76" font-size="12.5" fill="currentColor" opacity="0.85">Can you hear me? · Sorry, I was on mute.</text>

          <circle cx="58" cy="110" r="7" fill="#22d3ee"/>
          <text x="80" y="106" font-size="12.5" font-weight="700" fill="#22d3ee">No entendés algo</text>
          <text x="80" y="124" font-size="12.5" fill="currentColor" opacity="0.85">Could you repeat that? · Sorry, I can't follow.</text>

          <circle cx="58" cy="158" r="7" fill="#fbbf24"/>
          <text x="80" y="154" font-size="12.5" font-weight="700" fill="#fbbf24">Te comprometés</text>
          <text x="80" y="172" font-size="12.5" fill="currentColor" opacity="0.85">I can have it ready by Friday.</text>

          <circle cx="58" cy="206" r="7" fill="#f87171"/>
          <text x="80" y="202" font-size="12.5" font-weight="700" fill="#f87171">Decís que no</text>
          <text x="80" y="220" font-size="12.5" fill="currentColor" opacity="0.85">I can't commit to that today, but I could on Thursday.</text>

          <circle cx="58" cy="254" r="7" fill="#c084fc"/>
          <text x="80" y="250" font-size="12.5" font-weight="700" fill="#c084fc">Cerrás</text>
          <text x="80" y="268" font-size="12.5" fill="currentColor" opacity="0.85">Let me know if I can help. · Let's take it offline.</text>

          <rect x="392" y="42" width="254" height="70" rx="9" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" stroke-width="1.3"/>
          <text x="519" y="64" text-anchor="middle" font-size="12" font-weight="700" fill="#f59e0b">La frase más dicha</text>
          <text x="519" y="84" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">"You're on mute"</text>
          <text x="519" y="102" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">del trabajo remoto mundial</text>
        </svg>`,
        pie: 'Cada momento de una call tiene su frase hecha. Tenerlas automáticas es lo que baja los nervios.',
      },

      escucha: {
        intro: '<p>Estas son las que conviene reconocer <b>al instante</b>, sin procesarlas. ' +
               'Cuando aparecen en una call, aparecen rápido.</p>',
        items: [
          { texto: "Sorry, you're on mute.", es: 'Perdón, tenés el micrófono apagado.',
            nota: 'La frase más dicha del trabajo remoto. Si te la dicen, revisá el micrófono.' },
          { texto: "I can't hear you, you're breaking up.", es: 'No te escucho, se te corta.',
            nota: '<b>breaking up</b> = cortarse el audio. Nada que ver con romper una relación, que también es <i>break up</i>.' },
          { texto: 'I can have it ready by Thursday.', es: 'Lo puedo tener listo para el jueves.',
            nota: 'Compromiso claro con plazo. <b>by</b> = fecha límite, del módulo anterior.' },
          { texto: "I can't commit to that today, but I could look at it on Thursday.", es: 'No me puedo comprometer hoy, pero podría mirarlo el jueves.',
            nota: 'Cómo decir que no bien: negás claro y ofrecés una alternativa. Es lo que se espera.' },
          { texto: "Can we take this offline? I'll ping you after the call.", es: '¿Lo vemos aparte? Te escribo después de la call.',
            nota: '<b>take it offline</b> no es desconectarse: es sacar el tema de la reunión general.' },
        ],
      },

      practica: `
        <p><b>Armá tu kit de supervivencia.</b> Estas ocho frases cubren el 90% de lo que vas a
        necesitar en tus primeras calls. Decilas en voz alta hasta que salgan sin pensar:</p>
        <ol>
          <li><span class="en" data-say>Can you hear me?</span></li>
          <li><span class="en" data-say>Sorry, I was on mute.</span></li>
          <li><span class="en" data-say>Sorry, could you repeat that?</span></li>
          <li><span class="en" data-say>Sorry, I can't follow. Can you write it in the chat?</span></li>
          <li><span class="en" data-say>I can have it ready by Friday.</span></li>
          <li><span class="en" data-say>I can't commit to that today.</span></li>
          <li><span class="en" data-say>Let me check and get back to you.</span></li>
          <li><span class="en" data-say>Let me know if I can help.</span></li>
        </ol>

        <p><b>Por qué automatizarlas importa tanto:</b> en una call real vas a estar nervioso, y con
        nervios <b>solo sale bien lo que ya está automático</b>. Las frases que tenés que construir
        sobre la marcha son justamente las que se traban.</p>

        <p><b>Y una última cosa sobre decir que no.</b> En inglés de trabajo, negarse <b>a tiempo y
        claro</b> se valora más que aceptar todo y después incumplir. <i>I can't commit to that today,
        but I could look at it on Thursday</i> es una respuesta excelente, no una falla.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Alguien te habla y no se escucha nada. ¿Qué le decís?',
          opciones: ["You're in mute.", "You're on mute.", 'You have the mute.', 'You are muted off.'],
          correcta: 1,
          porQue: '<b>You\'re on mute</b>. Es la frase más dicha del trabajo remoto y es bloque fijo, con <i>on</i>.',
          porQueNo: {
            0: 'Es <i>on</i>, no <i>in</i>. Colocación fija.',
            2: 'No es inglés.',
            3: '<i>muted off</i> sería lo contrario, y tampoco se dice así.',
          },
        },
        {
          tipo: 'opcion',
          p: 'Te piden algo para hoy y no vas a poder. ¿Cuál es la mejor respuesta profesional?',
          opciones: [
            'No.',
            "I can't commit to that today, but I could look at it on Thursday.",
            'Maybe.',
            "I'll try.",
          ],
          correcta: 1,
          porQue: 'Negás <b>claro</b> y ofrecés una <b>alternativa concreta</b>. En inglés de trabajo se valora decir que no a tiempo, no aceptar todo y después incumplir.',
          porQueNo: {
            0: 'Es claro pero cortante, y no aporta ninguna salida.',
            2: 'Deja al otro sin información para planificar.',
            3: 'Suena a compromiso sin serlo. Genera falsas expectativas.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá: <b>Sorry, I ______ follow. Can you write it in the chat?</b>',
          respuesta: "can't",
          respuestas: ['cannot'],
          porQue: '<b>I can\'t follow</b> = «no te sigo, me perdí». Es la forma estándar de decir que perdiste el hilo.',
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Lo puedo tener listo para el viernes.</b>',
          respuesta: 'I can have it ready by Friday',
          pista: '«Para» como fecha límite es by.',
          porQue: '<b>have it ready</b> es el bloque para «tenerlo listo», y <b>by Friday</b> marca el plazo.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá el ofrecimiento de cierre: «Avisame si puedo ayudar con algo más.»',
          respuesta: 'Let me know if I can help with anything else',
          porQue: 'Es la forma estándar de cerrar tu turno en una reunión dejando la puerta abierta.',
        },
      ],

      errores: [
        { mito: 'Decir que no a una tarea queda mal, mejor aceptar y después ver.',
          realidad: 'Es al revés. En inglés de trabajo se valora <b>negarse a tiempo y claro</b>. ' +
                    'Aceptar todo y después incumplir daña mucho más la confianza. ' +
                    '<i>I can\'t commit to that today, but I could on Thursday</i> es una respuesta excelente.' },
        { mito: '<i>Take it offline</i> significa desconectarse de la llamada.',
          realidad: 'Significa <b>sacar un tema de la reunión general</b> para discutirlo aparte con quien corresponda. ' +
                    'Es una fórmula muy útil cuando una discusión se estira y solo le interesa a dos personas.' },
        { mito: 'Si no entiendo algo, mejor asentir y averiguarlo después.',
          realidad: 'Es lo que genera problemas <b>reales</b>: terminás haciendo algo distinto de lo que te pidieron. ' +
                    'Pedir aclaración es normal, profesional y esperado — hasta entre nativos con audio malo. ' +
                    'Tener la frase automática es lo que hace que no te dé vergüenza usarla.' },
      ],

      glosario: [
        { t: "You're on mute", d: 'Tenés el micrófono apagado. Bloque fijo con <i>on</i>. Probablemente la frase más dicha del trabajo remoto.' },
        { t: "You're breaking up", d: 'Se te corta el audio. Nada que ver con el otro sentido de <i>break up</i>.' },
        { t: "I can't follow", d: 'No te sigo, me perdí. La forma estándar de decir que perdiste el hilo de una explicación.' },
        { t: 'Take it offline', d: 'Sacar un tema de la reunión general para verlo aparte. No es desconectarse.' },
        { t: 'Get back to you', d: 'Volver con una respuesta más tarde. La salida de emergencia más útil que hay.' },
      ],
    },
  ],

  /* ==================================================================== */
  vocabulario: [
    { en: 'can', es: 'poder / saber hacer', pista: 'Modal: sin -s, sin do, sin to.', ejemplo: 'I can help you.', ejemploEs: 'Puedo ayudarte.' },
    { en: "can't", es: 'no poder', pista: 'Se escribe pegado.', ejemplo: "I can't reproduce the bug.", ejemploEs: 'No puedo reproducir el bug.' },
    { en: 'could', es: 'podría', pista: 'La forma cortés por defecto en el trabajo.', ejemplo: 'Could you take a look?', ejemploEs: '¿Podrías mirar esto?' },
    { en: 'be able to', es: 'ser capaz de / poder', pista: 'Reemplaza a can en futuro y participio.', ejemplo: 'I will be able to help tomorrow.', ejemploEs: 'Voy a poder ayudar mañana.' },
    { en: 'help', es: 'ayudar', ejemplo: 'Let me know if I can help.', ejemploEs: 'Avisame si puedo ayudar.' },
    { en: 'join', es: 'sumarse a', ejemplo: 'Can you join the call at three?', ejemploEs: '¿Podés sumarte a la call a las tres?' },
    { en: 'take a look at', es: 'mirar / revisar', ejemplo: 'Could you take a look at this PR?', ejemploEs: '¿Podrías mirar este PR?' },
    { en: 'reproduce', es: 'reproducir (un bug)', ejemplo: "I can't reproduce it on my machine.", ejemploEs: 'No puedo reproducirlo en mi máquina.' },
    { en: 'commit to', es: 'comprometerse a', ejemplo: "I can't commit to that today.", ejemploEs: 'No me puedo comprometer a eso hoy.' },
    { en: 'make it', es: 'llegar / poder asistir', pista: 'Para excusarse de una reunión.', ejemplo: "She can't make it to the meeting.", ejemploEs: 'Ella no puede llegar a la reunión.' },
    { en: 'on mute', es: 'con el micrófono apagado', ejemplo: "Sorry, you're on mute.", ejemploEs: 'Perdón, tenés el mic apagado.' },
    { en: 'break up', es: 'cortarse (el audio)', ejemplo: "You're breaking up.", ejemploEs: 'Se te corta.' },
    { en: 'follow', es: 'seguir (una explicación)', ejemplo: "Sorry, I can't follow.", ejemploEs: 'Perdón, no te sigo.' },
    { en: 'repeat', es: 'repetir', ejemplo: 'Could you repeat that?', ejemploEs: '¿Podrías repetir eso?' },
    { en: 'spell', es: 'deletrear', ejemplo: 'Can you spell that?', ejemploEs: '¿Lo podés deletrear?' },
    { en: 'share', es: 'compartir', ejemplo: 'Can I share my screen?', ejemploEs: '¿Puedo compartir pantalla?' },
    { en: 'screen', es: 'pantalla', ejemplo: 'Can you see my screen?', ejemploEs: '¿Ven mi pantalla?' },
    { en: 'take it offline', es: 'verlo aparte, fuera de la reunión', ejemplo: 'Can we take this offline?', ejemploEs: '¿Lo vemos aparte?' },
    { en: 'get back to you', es: 'volver con una respuesta', ejemplo: 'Let me check and get back to you.', ejemploEs: 'Dejame revisar y te confirmo.' },
    { en: 'ready', es: 'listo', ejemplo: 'I can have it ready by Friday.', ejemploEs: 'Lo puedo tener listo para el viernes.' },
    { en: 'slowly', es: 'despacio', ejemplo: 'Could you speak more slowly?', ejemploEs: '¿Podrías hablar más despacio?' },
    { en: 'sure', es: 'claro / seguro', pista: 'Sure, no problem: la respuesta universal.', ejemplo: 'Sure, no problem.', ejemploEs: 'Claro, no hay problema.' },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál está bien?',
      opciones: ['She cans help you.', 'She can helps you.', 'She can help you.', 'She can to help you.'],
      correcta: 2,
      porQue: 'Los modales no llevan <i>-s</i> y rigen infinitivo <b>sin <i>to</i></b>.',
      porQueNo: {
        0: '<i>can</i> no tiene flexión: nunca lleva -s.',
        1: 'El verbo principal tampoco la lleva cuando hay un modal delante.',
        3: 'Sobra el <i>to</i>: los modales rigen forma base.',
      },
    },
    {
      p: '¿Cómo se pregunta correctamente?',
      opciones: ['Do you can help me?', 'Can you help me?', 'Can do you help me?', 'You can help me?'],
      correcta: 1,
      porQue: '<b>can</b> es auxiliar: se invierte solo, sin pedir prestado <i>do</i>.',
      porQueNo: {
        0: 'Es el error típico al venir del present simple. Los modales no necesitan <i>do</i>.',
        2: 'Mezcla los dos mecanismos.',
        3: 'Sin inversión suena a incredulidad, no a pregunta neutra.',
      },
    },
    {
      p: '¿Cómo se dice «voy a poder ayudarte mañana»?',
      opciones: [
        'I will can help you tomorrow.',
        'I will be able to help you tomorrow.',
        'I can will help you tomorrow.',
        'I will could help you tomorrow.',
      ],
      correcta: 1,
      porQue: 'Los modales <b>no se combinan entre sí</b>. Para el futuro de <i>can</i> va la perífrasis <b>be able to</b>.',
      porQueNo: {
        0: '❌ <i>will can</i> no existe: dos modales seguidos son imposibles.',
        2: 'Mismo problema, invertido.',
        3: '<i>could</i> también es modal: tampoco puede ir después de <i>will</i>.',
      },
    },
    {
      p: 'Necesitás que alguien te mande un archivo. ¿Cuál es lo más apropiado en un contexto laboral?',
      opciones: ['Send me the file.', 'Could you send me the file?', 'You must send me the file.', 'I need the file now.'],
      correcta: 1,
      porQue: 'El inglés de trabajo combina <b>contenido directo</b> con <b>forma envuelta</b>. <i>Could you…?</i> es el default.',
      porQueNo: {
        0: 'El imperativo pelado suena a orden en un pedido personal.',
        2: '<i>must</i> expresa obligación: suena a que sos su jefe y encima apurado.',
        3: 'Es directo en las dos dimensiones, y eso suena brusco.',
      },
    },
    {
      p: '¿Por qué <i>could</i> suena más cortés que <i>can</i>?',
      opciones: [
        'Porque es más formal por definición',
        'Porque al ser forma de pasado presenta el pedido como hipotético, y eso baja la presión sobre el otro',
        'Porque es más largo',
        'Porque solo se usa con superiores',
      ],
      correcta: 1,
      porQue: 'Es el mismo mecanismo del español: «¿podrías?» es más suave que «¿podés?». La distancia temporal se lee como distancia social.',
      porQueNo: {
        0: 'No es cuestión de formalidad: se usa en cualquier registro laboral.',
        2: 'La longitud no interviene.',
        3: 'Se usa con cualquiera, incluidos pares.',
      },
    },
    {
      p: 'Te preguntan <i>Would you mind sharing your screen?</i> y querés aceptar. ¿Qué contestás?',
      opciones: ['Yes, I mind.', 'Not at all.', 'Yes, I would mind.', 'No, I cannot.'],
      correcta: 1,
      porQue: 'La pregunta es si te <b>molesta</b>. «No, para nada» = sí, lo hago. Si dudás, <i>Sure, no problem</i> es infalible.',
      porQueNo: {
        0: 'Significa «sí, me molesta»: estarías rechazando.',
        2: 'Rechazo aún más explícito.',
        3: 'Es un no directo.',
      },
    },
    {
      p: '¿Cuál es la señal más confiable para distinguir <i>can</i> de <i>can\'t</i> en inglés estadounidense?',
      opciones: [
        'La "t" final, que siempre se pronuncia',
        'El acento: can\'t es tónico y suena claro, can se comprime',
        'La velocidad de la frase',
        'Que can\'t siempre va al final',
      ],
      correcta: 1,
      porQue: 'La <i>t</i> suele realizarse como oclusión glotal o desaparecer. Lo que sí está siempre es la diferencia de acento.',
      porQueNo: {
        0: 'Justamente es lo que <b>no</b> se puede perseguir: muchas veces no está.',
        2: 'No distingue nada acá.',
        3: 'Puede ir en cualquier posición.',
      },
    },
    {
      p: '¿Qué significa <i>You\'re on mute</i>?',
      opciones: ['Estás en silencio, no hablás', 'Tenés el micrófono apagado', 'Te silenciaron de la reunión', 'No se te ve la cámara'],
      correcta: 1,
      porQue: 'Es probablemente la frase más dicha del trabajo remoto mundial. Bloque fijo con <b>on</b>.',
      porQueNo: {
        0: 'No describe tu actitud sino el estado del micrófono.',
        2: 'Eso sería <i>you were muted by the host</i>.',
        3: 'Eso sería <i>your camera is off</i>.',
      },
    },
    {
      p: '¿Qué significa <i>Can we take this offline?</i>',
      opciones: [
        '¿Podemos desconectarnos de la llamada?',
        '¿Podemos sacar este tema de la reunión y verlo aparte?',
        '¿Podemos trabajar sin internet?',
        '¿Podemos dejarlo para nunca?',
      ],
      correcta: 1,
      porQue: 'Es la fórmula para sacar de la reunión general un tema que solo le interesa a dos personas.',
      porQueNo: {
        0: 'No tiene que ver con desconectarse.',
        2: 'Nada que ver con conectividad.',
        3: 'No implica descartarlo: implica moverlo de lugar.',
      },
    },
    {
      p: 'Te piden algo para hoy y no vas a llegar. ¿Cuál es la mejor respuesta?',
      opciones: [
        "I'll try.",
        "I can't commit to that today, but I could look at it on Thursday.",
        'Maybe.',
        'Yes, no problem.',
      ],
      correcta: 1,
      porQue: 'Negás claro y ofrecés una alternativa concreta. En inglés de trabajo se valora decir que no <b>a tiempo</b> más que aceptar y después incumplir.',
      porQueNo: {
        0: 'Suena a compromiso sin serlo, y genera falsas expectativas.',
        2: 'Deja al otro sin información para planificar.',
        3: 'Aceptar algo que sabés que no vas a cumplir es lo que más daña la confianza.',
      },
    },
    {
      p: '¿Cuál está bien escrita?',
      opciones: ["I can not to help.", "I can't help.", 'I do not can help.', "I don't can help."],
      correcta: 1,
      porQue: '<b>can\'t</b> pegado es lo normal. <i>cannot</i> junto es la variante formal de documentación.',
      porQueNo: {
        0: 'Sobra el <i>to</i>, y <i>can not</i> separado es poco frecuente.',
        2: 'Los modales no usan <i>do</i>.',
        3: 'Mismo problema.',
      },
    },
    {
      p: 'No entendiste lo que dijeron en una call. ¿Qué hacés?',
      opciones: [
        'Asentís y lo averiguás después',
        'Decís <i>Sorry, could you repeat that?</i>',
        'Te disculpás largamente por tu inglés',
        'Salís de la llamada y volvés a entrar',
      ],
      correcta: 1,
      porQue: 'Es normal, corto y esperado — hasta entre nativos con audio malo. Y evita el problema real: hacer algo distinto de lo que te pidieron.',
      porQueNo: {
        0: 'Es lo que genera errores concretos de trabajo.',
        2: 'Disculparse de más incomoda y desvía el foco. Un <i>sorry</i> alcanza.',
        3: 'No resuelve nada y llama más la atención.',
      },
    },
  ],
});
