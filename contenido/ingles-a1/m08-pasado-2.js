/* ==========================================================================
   Inglés A1 · m08 — Pasado (2): los irregulares
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ingles-a1',
  id: 'm08',
  titulo: 'Pasado (2): los irregulares',
  fuentes: ['cambridge-dic', 'bbc-learning-english', 'wordreference'],

  intro:
    '<p>Los verbos irregulares tienen mala fama por las listas de 200 que reparten en las academias. ' +
    'La realidad es más amable: <b>unos 40 cubren casi todo lo que vas a decir</b>, y no hace falta ' +
    'aprenderlos de memoria — se agrupan por patrones.</p>' +
    '<p>Y hay un alivio que ya viste en el módulo anterior: <b>con <i>did</i> no los necesitás</b>. ' +
    '<i>Did you go?</i> y <i>I didn\'t go</i> usan la forma base. Los irregulares solo aparecen en ' +
    'afirmativas.</p>' +
    '<p>Este módulo termina en lo que de verdad importa: <b>contar qué pasó</b>. Un incidente, ' +
    'una decisión, tu parte de ayer en el standup.</p>',

  lecciones: [

    /* ==================================================================== */
    {
      id: 'l1',
      titulo: 'Los que se agrupan por patrón',
      minutos: 9,

      simple: `
        <p>Los irregulares no son un caos: la mayoría cae en unos pocos moldes. Si los ves agrupados,
        se aprenden mucho más rápido que en una lista alfabética.</p>

        <h4>1. No cambian nada</h4>
        <p>Los más fáciles de todos:</p>
        <p><span class="en" data-say>put</span> · <span class="en" data-say>cut</span> ·
        <span class="en" data-say>set</span> · <span class="en" data-say>let</span> ·
        <span class="en" data-say>cost</span> · <span class="en" data-say>hit</span> ·
        <span class="en" data-say>read</span></p>
        <p><b>Ojo con <i>read</i>:</b> se escribe igual pero <b>suena distinto</b>. Presente "riid",
        pasado "red". Es la única de la lista con esa trampa.</p>

        <h4>2. Cambian la vocal a "o"</h4>
        <ul>
          <li>break → <span class="en" data-say>broke</span></li>
          <li>speak → <span class="en" data-say>spoke</span></li>
          <li>write → <span class="en" data-say>wrote</span></li>
          <li>drive → <span class="en" data-say>drove</span></li>
          <li>choose → <span class="en" data-say>chose</span></li>
        </ul>

        <h4>3. Terminan en -ought / -aught</h4>
        <ul>
          <li>think → <span class="en" data-say>thought</span></li>
          <li>bring → <span class="en" data-say>brought</span></li>
          <li>buy → <span class="en" data-say>bought</span></li>
          <li>catch → <span class="en" data-say>caught</span></li>
          <li>teach → <span class="en" data-say>taught</span></li>
        </ul>
        <p>Todos se dicen igual al final: "-ot". Cinco verbos con un solo sonido de cierre.</p>

        <h4>4. Cambian a "e"</h4>
        <ul>
          <li>meet → <span class="en" data-say>met</span></li>
          <li>read → <span class="en" data-say>read</span> (suena "red")</li>
          <li>keep → <span class="en" data-say>kept</span></li>
          <li>leave → <span class="en" data-say>left</span></li>
          <li>feel → <span class="en" data-say>felt</span></li>
        </ul>

        <h4>5. Los que no se parecen a nada</h4>
        <p>Son pocos y hay que aprenderlos sueltos — pero son los más usados de todos:</p>
        <ul>
          <li>go → <span class="en" data-say>went</span></li>
          <li>be → <span class="en" data-say>was</span> / <span class="en" data-say>were</span></li>
          <li>have → <span class="en" data-say>had</span></li>
          <li>do → <span class="en" data-say>did</span></li>
          <li>see → <span class="en" data-say>saw</span></li>
          <li>get → <span class="en" data-say>got</span></li>
          <li>make → <span class="en" data-say>made</span></li>
          <li>take → <span class="en" data-say>took</span></li>
        </ul>

        <div class="aviso">
          <b>El alivio del módulo anterior:</b> con <b>did</b> el verbo vuelve a la forma base.<br><br>
          <span class="en" data-say>Did you go?</span> · <span class="en" data-say>I didn't go</span><br><br>
          Los irregulares <b>solo aparecen en afirmativas</b>. Eso es la mitad del problema resuelto.
        </div>
      `,

      tecnico: `
        <p>Los verbos irregulares del inglés son restos de sistemas verbales germánicos anteriores.
        La mayoría pertenecía a los <b>verbos fuertes</b>, que marcaban el pasado <b>cambiando la vocal
        de la raíz</b> (<i>ablaut</i>) en vez de agregar un sufijo.</p>

        <p>Por eso se agrupan: <i>break/broke</i>, <i>speak/spoke</i>, <i>write/wrote</i> comparten el
        mismo patrón vocálico heredado. No son excepciones aleatorias — son <b>una clase</b> con su
        propia lógica, hoy improductiva.</p>

        <div class="nota-tec">
          <b>El dato que ordena el esfuerzo:</b> los verbos irregulares son alrededor de 200, pero
          los <b>10 más frecuentes del inglés son todos irregulares</b> (be, have, do, say, go, get,
          make, know, take, see) y cubren una parte enorme del habla real.
          <br><br>
          Al revés: la cola de irregulares raros (<i>smite</i>, <i>cleave</i>, <i>hew</i>) casi no
          aparece nunca. Estudiar la lista completa es de las peores relaciones esfuerzo/resultado
          que hay en inglés.
        </div>

        <p><b>Sobre las tres columnas.</b> Las listas muestran <i>base / past / participle</i>
        (go / went / gone). En A1 <b>solo necesitás las dos primeras</b>: el participio se usa en
        present perfect y voz pasiva, que son de B1.</p>

        <p>Vale la pena saber que existe, porque explica por qué las listas tienen tres columnas —
        pero ignorar la tercera por ahora es la decisión correcta.</p>

        <p><b>Casos que confunden por escrito:</b></p>
        <table>
          <tr><th>Verbo</th><th>Pasado</th><th>Trampa</th></tr>
          <tr><td>read /riːd/</td><td>read /red/</td><td>misma grafía, distinto sonido</td></tr>
          <tr><td>lead /liːd/</td><td>led /led/</td><td>cambia la grafía, igual patrón</td></tr>
          <tr><td>find</td><td>found</td><td>no confundir con <i>found</i> = fundar</td></tr>
          <tr><td>lie</td><td>lay / lied</td><td><i>lay</i> = yacer, <i>lied</i> = mentir</td></tr>
        </table>

        <p><b>Y una regularización en curso:</b> varios verbos admiten hoy las dos formas —
        <i>learned/learnt</i>, <i>dreamed/dreamt</i>, <i>burned/burnt</i>. Las formas en <i>-ed</i> son
        más estadounidenses; las en <i>-t</i>, más británicas. Las dos son correctas.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Verbos irregulares agrupados por patrón de cambio">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">No son un caos: son cinco moldes</text>

          <g font-size="12">
            <rect x="34" y="38" width="196" height="96" rx="9" fill="#34d399" opacity="0.11" stroke="#34d399" stroke-width="1.2"/>
            <text x="132" y="58" text-anchor="middle" font-size="12.5" font-weight="800" fill="#34d399">1 · no cambian</text>
            <text x="132" y="78" text-anchor="middle" fill="currentColor" opacity="0.85">put · cut · set · let</text>
            <text x="132" y="96" text-anchor="middle" fill="currentColor" opacity="0.85">cost · hit · read</text>
            <text x="132" y="118" text-anchor="middle" font-size="11" fill="#f87171">read suena "red" en pasado</text>

            <rect x="242" y="38" width="196" height="96" rx="9" fill="#22d3ee" opacity="0.11" stroke="#22d3ee" stroke-width="1.2"/>
            <text x="340" y="58" text-anchor="middle" font-size="12.5" font-weight="800" fill="#22d3ee">2 · vocal → o</text>
            <text x="340" y="78" text-anchor="middle" fill="currentColor" opacity="0.85">break → broke</text>
            <text x="340" y="96" text-anchor="middle" fill="currentColor" opacity="0.85">write → wrote</text>
            <text x="340" y="114" text-anchor="middle" fill="currentColor" opacity="0.85">speak → spoke</text>

            <rect x="450" y="38" width="196" height="96" rx="9" fill="#c084fc" opacity="0.11" stroke="#c084fc" stroke-width="1.2"/>
            <text x="548" y="58" text-anchor="middle" font-size="12.5" font-weight="800" fill="#c084fc">3 · -ought / -aught</text>
            <text x="548" y="78" text-anchor="middle" fill="currentColor" opacity="0.85">think → thought</text>
            <text x="548" y="96" text-anchor="middle" fill="currentColor" opacity="0.85">buy → bought</text>
            <text x="548" y="114" text-anchor="middle" fill="currentColor" opacity="0.85">teach → taught</text>
          </g>

          <g font-size="12">
            <rect x="34" y="146" width="290" height="82" rx="9" fill="#fbbf24" opacity="0.11" stroke="#fbbf24" stroke-width="1.2"/>
            <text x="179" y="166" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fbbf24">4 · vocal → e</text>
            <text x="179" y="186" text-anchor="middle" fill="currentColor" opacity="0.85">meet → met · keep → kept</text>
            <text x="179" y="206" text-anchor="middle" fill="currentColor" opacity="0.85">leave → left · feel → felt</text>

            <rect x="356" y="146" width="290" height="82" rx="9" fill="#f87171" opacity="0.11" stroke="#f87171" stroke-width="1.2"/>
            <text x="501" y="166" text-anchor="middle" font-size="12.5" font-weight="800" fill="#f87171">5 · sueltos</text>
            <text x="501" y="186" text-anchor="middle" fill="currentColor" opacity="0.85">go → went · see → saw</text>
            <text x="501" y="206" text-anchor="middle" fill="currentColor" opacity="0.85">take → took · make → made</text>
          </g>

          <rect x="34" y="240" width="612" height="42" rx="9" fill="#34d399" opacity="0.1" stroke="#34d399" stroke-width="1.3"/>
          <text x="340" y="260" text-anchor="middle" font-size="12.5" font-weight="700" fill="#34d399">Y la mitad del problema ya está resuelta</text>
          <text x="340" y="277" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">
            Con did el verbo vuelve a la base: "Did you go?" · "I didn't go"
          </text>
        </svg>`,
        pie: 'Los diez verbos más frecuentes del inglés son todos irregulares. La cola larga casi no aparece.',
        nota: '<p>Estudiar la lista completa de 200 es de las peores relaciones esfuerzo/resultado que hay en inglés. ' +
              'Los del grupo 5 —los sueltos— son los que más rinden, porque son los más usados.</p>',
      },

      escucha: {
        intro: '<p>Irregulares en frases reales. Fijate que ninguno lleva <i>-ed</i>: ' +
               'la marca de pasado está en la forma misma.</p>',
        items: [
          { texto: 'I went to the office yesterday.', es: 'Ayer fui a la oficina.',
            nota: '<b>went</b> no se parece en nada a <i>go</i>. Es el más irregular de todos y el más usado.' },
          { texto: 'The build broke after the last commit.', es: 'El build se rompió después del último commit.',
            nota: '<b>broke</b>, del grupo de la vocal en "o": break → broke, speak → spoke.' },
          { texto: 'I thought it was a config problem.', es: 'Pensé que era un problema de config.',
            nota: '<b>thought</b> se dice "zot". Y fijate el <i>was</i>: dos pasados en una frase.' },
          { texto: 'I saw the error in the logs and I took a screenshot.', es: 'Vi el error en los logs y saqué una captura.',
            nota: 'Dos sueltos: <b>saw</b> y <b>took</b>. Los dos hay que aprenderlos de memoria.' },
        ],
      },

      practica: `
        <p><b>Los doce que más vas a usar en el trabajo.</b> Decilos en voz alta, tres veces cada par:</p>
        <table>
          <tr><td>go → <b>went</b></td><td>see → <b>saw</b></td><td>get → <b>got</b></td></tr>
          <tr><td>have → <b>had</b></td><td>make → <b>made</b></td><td>take → <b>took</b></td></tr>
          <tr><td>write → <b>wrote</b></td><td>break → <b>broke</b></td><td>find → <b>found</b></td></tr>
          <tr><td>think → <b>thought</b></td><td>run → <b>ran</b></td><td>put → <b>put</b></td></tr>
        </table>

        <p><b>El truco para memorizarlos:</b> no los estudies en lista. Usalos en una frase tuya real.
        <i>I went to…</i>, <i>I saw…</i>, <i>I broke…</i> Una frase propia se recuerda diez veces mejor
        que una fila de una tabla.</p>

        <p><b>Y recordá el atajo:</b> si tenés dudas del irregular, <b>armá la frase con <i>didn't</i>
        o con una pregunta</b> y el verbo vuelve a la base. No es hacer trampa: es cómo funciona el idioma.</p>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Escribí el pasado de <b>go</b>.',
          respuesta: 'went',
          porQue: '<b>went</b> no se parece en nada a <i>go</i>. Es el irregular más usado del inglés.',
        },
        {
          tipo: 'hueco',
          p: 'Escribí el pasado de <b>break</b>.',
          respuesta: 'broke',
          porQue: 'Del grupo de la vocal en «o»: break → broke, speak → spoke, write → wrote.',
        },
        {
          tipo: 'hueco',
          p: 'Escribí el pasado de <b>think</b>.',
          respuesta: 'thought',
          porQue: 'Del grupo <i>-ought</i>: think → thought, buy → bought, bring → brought. Todos suenan "-ot".',
        },
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: ['Did you went to the meeting?', 'Did you go to the meeting?', 'Did you gone to the meeting?', 'You did went to the meeting?'],
          correcta: 1,
          porQue: 'Con <b>did</b> el verbo vuelve a la <b>forma base</b>, así que ni siquiera hace falta saber el irregular.',
          porQueNo: {
            0: 'El pasado está duplicado: en <i>did</i> y en <i>went</i>.',
            2: '<i>gone</i> es el participio, que se usa en present perfect (nivel B1).',
            3: 'Mal orden y pasado duplicado.',
          },
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «Vi el error en los logs.»',
          respuesta: 'I saw the error in the logs',
          porQue: '<b>saw</b> es el pasado de <i>see</i>, del grupo de los sueltos.',
        },
      ],

      errores: [
        { mito: 'Hay que aprenderse la lista completa de 200 verbos irregulares.',
          realidad: 'Es de las peores relaciones esfuerzo/resultado del inglés. Los <b>diez más frecuentes</b> ' +
                    '(be, have, do, say, go, get, make, know, take, see) cubren una parte enorme del habla real, ' +
                    'y la cola larga casi no aparece nunca.' },
        { mito: 'Si no sé el irregular, no puedo hablar en pasado.',
          realidad: 'Sí podés: con <b>did</b> el verbo vuelve a la base. <i>Did you go?</i>, <i>I didn\'t go</i>. ' +
                    'Los irregulares solo aparecen en afirmativas — eso es la mitad del problema resuelto.' },
        { mito: '<i>read</i> es regular porque se escribe igual en presente y pasado.',
          realidad: 'Es irregular: se escribe igual pero <b>suena distinto</b>. Presente "riid", pasado "red". ' +
                    'Es la única de su grupo con esa trampa, y al escribir no se nota — al hablar sí.' },
      ],

      glosario: [
        { t: 'Verbo irregular', d: 'El que no forma el pasado con <i>-ed</i>. Son restos de los verbos fuertes germánicos, que marcaban el pasado cambiando la vocal.' },
        { t: 'Ablaut', d: 'El cambio de vocal en la raíz que marca el pasado: <i>break → broke</i>, <i>write → wrote</i>. Es lo que agrupa a varios irregulares.' },
        { t: 'Las tres columnas', d: 'base / pasado / participio (<i>go / went / gone</i>). En A1 solo hacen falta las dos primeras.' },
        { t: 'Read', d: 'Único verbo que se escribe igual en presente y pasado pero suena distinto: "riid" / "red".' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l2',
      titulo: 'Contar qué pasó',
      minutos: 8,

      simple: `
        <p>Saber los verbos no alcanza: hay que poder <b>encadenarlos en un relato</b>. Y para eso hacen
        falta unas pocas palabras que ordenan los hechos.</p>

        <h4>Los conectores de secuencia</h4>
        <table>
          <tr><th>Palabra</th><th>Español</th><th>Ejemplo</th></tr>
          <tr><td>first</td><td>primero</td><td>First I checked the logs.</td></tr>
          <tr><td>then</td><td>después</td><td>Then I found the error.</td></tr>
          <tr><td>after that</td><td>después de eso</td><td>After that I fixed it.</td></tr>
          <tr><td>so</td><td>así que</td><td>The build failed, so I reverted it.</td></tr>
          <tr><td>because</td><td>porque</td><td>It failed because the token expired.</td></tr>
          <tr><td>but</td><td>pero</td><td>I tried it, but it didn't work.</td></tr>
          <tr><td>finally</td><td>al final</td><td>Finally it worked.</td></tr>
        </table>

        <div class="analogia">
          <b>Un relato completo, con seis piezas:</b><br>
          <span class="en" data-say>First I checked the logs. Then I found a 401 error. I thought it was a config problem, so I checked the env variables. But everything was fine. Finally I saw that the token expired. I fixed it and deployed it.</span>
        </div>

        <p>Fijate que <b>no hay ninguna estructura complicada</b>: son frases cortas, en pasado,
        unidas por conectores. Así se cuenta cualquier cosa en inglés de trabajo.</p>

        <h4>La estructura de un incidente</h4>
        <p>Cuando contás algo que salió mal, el orden estándar es:</p>
        <ol>
          <li><b>Qué pasó</b> — <span class="en" data-say>The build failed this morning.</span></li>
          <li><b>Qué hiciste</b> — <span class="en" data-say>I checked the logs and I found a 401.</span></li>
          <li><b>Cuál era la causa</b> — <span class="en" data-say>The token expired.</span></li>
          <li><b>Cómo lo resolviste</b> — <span class="en" data-say>I regenerated it and redeployed.</span></li>
          <li><b>Qué falta</b> — <span class="en" data-say>We should add an alert for this.</span></li>
        </ol>

        <div class="aviso">
          <b>Un patrón que vale oro: <i>was doing X when Y happened</i>.</b><br><br>
          <span class="en" data-say>I was reviewing the PR when the build broke.</span><br>
          <span class="en" data-say>We were deploying when the API went down.</span><br><br>
          El <b>continuo</b> es el escenario y el <b>simple</b> es lo que irrumpe. Es la forma canónica
          de contar un incidente, y aparece en casi todos los reportes de bug.
        </div>
      `,

      tecnico: `
        <p><b>La narración en inglés de trabajo es deliberadamente simple.</b> Frases cortas,
        coordinadas antes que subordinadas, y un conector explícito por relación. No se valora la
        prosa elaborada: se valora que se entienda al primer intento.</p>

        <div class="nota-tec">
          <b>Una diferencia de estilo real.</b> El español escrito profesional tiende a la subordinación
          y las frases largas. El inglés técnico prefiere lo contrario: <b>una idea por frase</b>,
          conector explícito, punto.
          <br><br>
          Traducir el estilo español al inglés produce textos que suenan enredados aunque la gramática
          esté bien. Cortar en frases más cortas de lo que te parece natural casi siempre mejora
          el resultado.
        </div>

        <p><b>Los conectores por función:</b></p>
        <table>
          <tr><th>Función</th><th>Palabras</th></tr>
          <tr><td>Secuencia</td><td>first, then, after that, finally</td></tr>
          <tr><td>Causa</td><td>because, since, as</td></tr>
          <tr><td>Consecuencia</td><td>so, therefore (formal)</td></tr>
          <tr><td>Contraste</td><td>but, however (formal), although</td></tr>
          <tr><td>Adición</td><td>and, also, in addition (formal)</td></tr>
        </table>

        <p><b>Ojo con <i>so</i> y <i>because</i>:</b> señalan la misma relación en direcciones opuestas.</p>
        <ul>
          <li><i>The token expired, <b>so</b> the build failed.</i> — causa primero</li>
          <li><i>The build failed <b>because</b> the token expired.</i> — efecto primero</li>
        </ul>
        <p>No se combinan: ❌ <i>Because the token expired, so the build failed</i>. En español la
        redundancia se tolera más; en inglés suena a error.</p>

        <p><b>Sobre el patrón <i>was doing X when Y happened</i>.</b> Es la construcción canónica de la
        <b>interrupción</b>: el past continuous establece un marco temporal extendido y el past simple
        marca el evento puntual que lo corta.</p>
        <ul>
          <li><i>I <b>was reviewing</b> the PR <b>when</b> the build <b>broke</b>.</i></li>
        </ul>
        <p>Invertir los tiempos cambia el sentido: <i>I reviewed the PR when the build broke</i>
        sugiere que revisaste <b>después</b> de que se rompió, como reacción.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Estructura de cinco pasos para contar un incidente y el patrón de interrupción">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Cómo se cuenta un incidente</text>

          <line x1="56" y1="46" x2="56" y2="192" stroke="currentColor" opacity="0.2" stroke-width="2"/>

          <circle cx="56" cy="58" r="6" fill="#f87171"/>
          <text x="76" y="62" font-size="12.5" fill="currentColor" opacity="0.9"><tspan font-weight="700" fill="#f87171">1</tspan>  The build failed this morning.</text>

          <circle cx="56" cy="92" r="6" fill="#fbbf24"/>
          <text x="76" y="96" font-size="12.5" fill="currentColor" opacity="0.9"><tspan font-weight="700" fill="#fbbf24">2</tspan>  I checked the logs and found a 401.</text>

          <circle cx="56" cy="126" r="6" fill="#22d3ee"/>
          <text x="76" y="130" font-size="12.5" fill="currentColor" opacity="0.9"><tspan font-weight="700" fill="#22d3ee">3</tspan>  The token expired.</text>

          <circle cx="56" cy="160" r="6" fill="#34d399"/>
          <text x="76" y="164" font-size="12.5" fill="currentColor" opacity="0.9"><tspan font-weight="700" fill="#34d399">4</tspan>  I regenerated it and redeployed.</text>

          <circle cx="56" cy="192" r="6" fill="#c084fc"/>
          <text x="76" y="196" font-size="12.5" fill="currentColor" opacity="0.9"><tspan font-weight="700" fill="#c084fc">5</tspan>  We should add an alert for this.</text>

          <text x="486" y="62" font-size="11" fill="currentColor" opacity="0.55">qué pasó</text>
          <text x="486" y="96" font-size="11" fill="currentColor" opacity="0.55">qué hiciste</text>
          <text x="486" y="130" font-size="11" fill="currentColor" opacity="0.55">la causa</text>
          <text x="486" y="164" font-size="11" fill="currentColor" opacity="0.55">la solución</text>
          <text x="486" y="196" font-size="11" fill="currentColor" opacity="0.55">qué falta</text>

          <line x1="34" y1="214" x2="646" y2="214" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="234" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f59e0b">El patrón de interrupción</text>

          <rect x="90" y="244" width="240" height="18" rx="4" fill="#22d3ee" opacity="0.45"/>
          <text x="210" y="257" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0c0e13">I was reviewing the PR</text>

          <line x1="380" y1="238" x2="380" y2="268" stroke="#f87171" stroke-width="2.5"/>
          <text x="392" y="257" font-size="11.5" font-weight="700" fill="#f87171">when the build broke</text>

          <text x="340" y="276" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">
            continuo = el escenario · simple = lo que irrumpe
          </text>
        </svg>`,
        pie: 'Cinco pasos y frases cortas. El inglés técnico no premia la prosa elaborada.',
      },

      escucha: {
        intro: '<p>Un relato de incidente, partido en frases. Fijate lo cortas que son ' +
               'y cómo cada conector marca una relación.</p>',
        items: [
          { texto: 'First I checked the logs, then I found a 401 error.', es: 'Primero revisé los logs, después encontré un error 401.',
            nota: '<b>first</b> y <b>then</b> ordenan la secuencia. Es lo mínimo para que se siga un relato.' },
          { texto: 'The build failed because the token expired.', es: 'El build falló porque el token venció.',
            nota: '<b>because</b> pone el efecto primero. Con <i>so</i> sería al revés.' },
          { texto: 'I tried it twice, but it did not work.', es: 'Lo intenté dos veces, pero no funcionó.',
            nota: '<b>twice</b> = dos veces. Y con <i>did not</i> el verbo vuelve a la base.' },
          { texto: 'I was reviewing the PR when the build broke.', es: 'Estaba revisando el PR cuando se rompió el build.',
            nota: 'El patrón de interrupción: continuo de fondo, simple para el evento puntual.' },
        ],
      },

      practica: `
        <p><b>Contá un incidente real tuyo</b>, con los cinco pasos. Frases cortas:</p>
        <ol>
          <li>______ failed / broke ______.</li>
          <li>I checked ______ and I found ______.</li>
          <li>The problem was ______.</li>
          <li>I ______ and ______.</li>
          <li>We should ______.</li>
        </ol>

        <p><b>Después releelo buscando dos cosas:</b></p>
        <ul>
          <li>¿Hay al menos un conector entre frases? (<i>then</i>, <i>so</i>, <i>because</i>, <i>but</i>)</li>
          <li>¿Alguna frase tiene más de dos comas? Si sí, cortala en dos.</li>
        </ul>

        <p><b>Y practicá el patrón de interrupción</b>, que es el que más va a aparecer:</p>
        <p><span class="en" data-say>I was working on X when Y happened.</span></p>
        <p>Armá tres versiones con cosas que te hayan pasado de verdad.</p>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Completá con el conector de consecuencia: <b>The build failed, ______ I reverted the commit.</b>',
          respuesta: 'so',
          porQue: '<b>so</b> introduce la consecuencia: causa primero, efecto después.',
        },
        {
          tipo: 'hueco',
          p: 'Completá con el conector de causa: <b>The build failed ______ the token expired.</b>',
          respuesta: 'because',
          porQue: '<b>because</b> va en la dirección contraria a <i>so</i>: efecto primero, causa después.',
        },
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: [
            'Because the token expired, so the build failed.',
            'The build failed because the token expired.',
            'Because the token expired the build failed because.',
            'The build failed so because the token expired.',
          ],
          correcta: 1,
          porQue: '<b>so</b> y <b>because</b> señalan la misma relación en direcciones opuestas: no se combinan.',
          porQueNo: {
            0: 'Duplica la relación. En español se tolera más; en inglés suena a error.',
            2: 'Sin sentido.',
            3: 'Los dos conectores juntos no funcionan.',
          },
        },
        {
          tipo: 'ordenar',
          p: 'Armá el patrón de interrupción: «Estaba revisando el PR cuando se rompió el build.»',
          respuesta: 'I was reviewing the PR when the build broke',
          porQue: 'Continuo de fondo (<b>was reviewing</b>) + simple para lo que irrumpe (<b>broke</b>).',
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Lo intenté dos veces, pero no funcionó.</b>',
          respuesta: "I tried it twice, but it didn't work",
          respuestas: ['I tried it twice but it did not work', "I tried it twice, but it did not work"],
          pista: '«dos veces» es una sola palabra.',
          porQue: '<b>twice</b> = dos veces. Y con <i>didn\'t</i> el verbo va en base: <i>work</i>, no <i>worked</i>.',
        },
      ],

      errores: [
        { mito: 'Escribir frases largas y elaboradas suena más profesional en inglés.',
          realidad: 'Es al revés. El inglés técnico prefiere <b>una idea por frase</b>, conector explícito, punto. ' +
                    'Traducir el estilo subordinado del español produce textos enredados aunque la gramática esté bien. ' +
                    'Cortar más de lo que te parece natural casi siempre mejora.' },
        { mito: 'Puedo usar <i>because</i> y <i>so</i> en la misma frase, como en español.',
          realidad: '❌ <i>Because the token expired, so the build failed</i>. Señalan la misma relación en direcciones ' +
                    'opuestas: va uno o el otro. En español la redundancia se tolera más.' },
        { mito: 'Da igual usar past simple o past continuous para contar un incidente.',
          realidad: 'Cambia el orden de los hechos. <i>I <b>was reviewing</b> the PR when it broke</i> = estaba en eso y ' +
                    'lo interrumpió. <i>I <b>reviewed</b> the PR when it broke</i> = lo revisé <b>después</b>, como reacción. ' +
                    'Son relatos distintos.' },
      ],

      glosario: [
        { t: 'So / because', d: 'La misma relación causal en direcciones opuestas. Nunca juntos en la misma frase.' },
        { t: 'Then / after that', d: 'Los conectores de secuencia básicos. Con estos dos ya se sigue cualquier relato.' },
        { t: 'Twice', d: 'Dos veces. De tres en adelante se usa <i>times</i>: <i>three times</i>.' },
        { t: 'Patrón de interrupción', d: '<i>was doing X when Y happened</i>. El continuo es el escenario, el simple es lo que irrumpe.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l3',
      titulo: 'Explicar una decisión',
      minutos: 8,

      simple: `
        <p>Contar qué hiciste es una parte. La otra —más útil y más difícil— es <b>explicar por qué
        lo hiciste así</b>. Es lo que te van a pedir en un code review y en una entrevista técnica.</p>

        <h4>El patrón de tres partes</h4>
        <ol>
          <li><b>Qué opción tomaste</b> — <i>I used X</i></li>
          <li><b>Por qué</b> — <i>because…</i></li>
          <li><b>Qué descartaste y por qué</b> — <i>I didn't use Y because…</i></li>
        </ol>

        <div class="analogia">
          <span class="en" data-say>I used a queue instead of a cron job, because the tasks take too long. I didn't use a cron because it would block the request. It was the simplest option that worked.</span>
        </div>

        <h4>Las frases que necesitás</h4>
        <table>
          <tr><th>Inglés</th><th>Español</th></tr>
          <tr><td><span class="en" data-say>I used X instead of Y</span></td><td>usé X en vez de Y</td></tr>
          <tr><td><span class="en" data-say>I decided to…</span></td><td>decidí…</td></tr>
          <tr><td><span class="en" data-say>I chose X because…</span></td><td>elegí X porque…</td></tr>
          <tr><td><span class="en" data-say>It was the simplest option</span></td><td>era la opción más simple</td></tr>
          <tr><td><span class="en" data-say>The trade-off was…</span></td><td>la contrapartida era…</td></tr>
          <tr><td><span class="en" data-say>It turned out to be…</span></td><td>resultó ser…</td></tr>
          <tr><td><span class="en" data-say>In hindsight, I would…</span></td><td>viéndolo ahora, yo…</td></tr>
        </table>

        <div class="aviso">
          <b>Dos que valen especialmente la pena:</b><br><br>
          <b>trade-off</b> — la contrapartida de una decisión. Es <i>la</i> palabra de la ingeniería
          de software, y no tiene una traducción corta al español.<br><br>
          <b>in hindsight</b> — «viéndolo en retrospectiva». Sirve para reconocer un error sin sonar
          a disculpa: <span class="en" data-say>In hindsight, I should have added a test.</span>
        </div>

        <h4>Admitir que algo salió mal</h4>
        <p>Se valora mucho más de lo que uno espera. Las fórmulas:</p>
        <ul>
          <li><span class="en" data-say>It didn't work as expected.</span></li>
          <li><span class="en" data-say>I missed that case.</span> — se me pasó ese caso</li>
          <li><span class="en" data-say>That was my mistake.</span></li>
          <li><span class="en" data-say>I should have tested it first.</span></li>
          <li><span class="en" data-say>Good catch, thanks.</span> — buen ojo, gracias</li>
        </ul>
        <p><b><i>Good catch</i></b> es lo que se dice cuando alguien encuentra un error tuyo en un review.
        Es la respuesta estándar y suena bien: reconoce sin dramatizar.</p>
      `,

      tecnico: `
        <p><b>Por qué esto importa más de lo que parece.</b> En un equipo internacional, buena parte de
        cómo te evalúan pasa por <b>cómo explicás tus decisiones</b> — en PRs, en reviews, en
        retrospectivas. Es una habilidad de comunicación técnica, y el inglés de A1 alcanza para hacerla
        bien si tenés las fórmulas.</p>

        <div class="nota-tec">
          <b>La estructura que se espera</b> es la misma que en un ADR (Architecture Decision Record):
          contexto → opciones consideradas → decisión → consecuencias. Si ya escribís ADRs en español,
          la estructura no es nueva; solo hay que traducir las bisagras.
        </div>

        <p><b>Vocabulario de decisiones técnicas:</b></p>
        <table>
          <tr><th>Término</th><th>Significa</th></tr>
          <tr><td>trade-off</td><td>lo que se resigna a cambio de otra cosa</td></tr>
          <tr><td>edge case</td><td>caso borde</td></tr>
          <tr><td>workaround</td><td>solución provisoria que esquiva el problema</td></tr>
          <tr><td>root cause</td><td>causa raíz</td></tr>
          <tr><td>regression</td><td>algo que funcionaba y se rompió</td></tr>
          <tr><td>tech debt</td><td>deuda técnica</td></tr>
          <tr><td>overkill</td><td>desproporcionado para el problema</td></tr>
          <tr><td>good enough</td><td>suficientemente bueno</td></tr>
        </table>

        <p><b>Sobre <i>should have</i>.</b> Es la estructura para hablar de lo que <b>habría convenido
        hacer</b> y no se hizo. Gramaticalmente es de nivel B1, pero como fórmula fija se usa desde
        el primer día:</p>
        <ul>
          <li><i>I should have tested it first.</i> — debería haberlo probado antes</li>
          <li><i>We should have caught this in review.</i> — deberíamos haberlo visto en el review</li>
        </ul>
        <p>Al hablar suena "shoulda" — muy comprimido. Reconocerlo al escuchar es útil.</p>

        <p><b>Sobre el registro al admitir errores.</b> El inglés de trabajo espera reconocimiento
        <b>directo y breve</b>, sin dramatizar. <i>That was my mistake, I'll fix it</i> es perfecto.
        Disculparse largamente incomoda y desplaza el foco del problema a tus sentimientos, que es
        exactamente lo contrario de lo que se busca en un postmortem.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Estructura de tres partes para explicar una decisión técnica">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Explicar una decisión: tres partes</text>

          <g>
            <rect x="34" y="40" width="196" height="94" rx="10" fill="#34d399" opacity="0.11" stroke="#34d399" stroke-width="1.3"/>
            <text x="132" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#34d399">1 · QUÉ HICISTE</text>
            <text x="132" y="86" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">I used a queue</text>
            <text x="132" y="104" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">instead of a cron.</text>
            <text x="132" y="124" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">directo, sin rodeos</text>
          </g>

          <g>
            <rect x="242" y="40" width="196" height="94" rx="10" fill="#22d3ee" opacity="0.11" stroke="#22d3ee" stroke-width="1.3"/>
            <text x="340" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#22d3ee">2 · POR QUÉ</text>
            <text x="340" y="86" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">because the tasks</text>
            <text x="340" y="104" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">take too long.</text>
            <text x="340" y="124" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">una razón concreta</text>
          </g>

          <g>
            <rect x="450" y="40" width="196" height="94" rx="10" fill="#c084fc" opacity="0.11" stroke="#c084fc" stroke-width="1.3"/>
            <text x="548" y="62" text-anchor="middle" font-size="12.5" font-weight="800" fill="#c084fc">3 · QUÉ DESCARTASTE</text>
            <text x="548" y="86" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">I didn't use a cron</text>
            <text x="548" y="104" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">because it would block.</text>
            <text x="548" y="124" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">esto es lo que más suma</text>
          </g>

          <line x1="34" y1="152" x2="646" y2="152" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="174" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f59e0b">Dos palabras que valen todo el módulo</text>

          <g>
            <rect x="80" y="186" width="240" height="60" rx="9" fill="#f59e0b" opacity="0.11" stroke="#f59e0b" stroke-width="1.2"/>
            <text x="200" y="208" text-anchor="middle" font-size="14" font-weight="800" fill="#f59e0b">trade-off</text>
            <text x="200" y="228" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.8">lo que resignás a cambio</text>
            <text x="200" y="242" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.55">no tiene traducción corta</text>

            <rect x="360" y="186" width="240" height="60" rx="9" fill="#34d399" opacity="0.11" stroke="#34d399" stroke-width="1.2"/>
            <text x="480" y="208" text-anchor="middle" font-size="14" font-weight="800" fill="#34d399">in hindsight</text>
            <text x="480" y="228" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.8">viéndolo en retrospectiva</text>
            <text x="480" y="242" text-anchor="middle" font-size="10.5" fill="currentColor" opacity="0.55">admite sin sonar a disculpa</text>
          </g>
        </svg>`,
        pie: 'La tercera parte —qué descartaste y por qué— es la que más distingue a alguien con criterio.',
      },

      escucha: {
        intro: '<p>Explicaciones de decisiones técnicas. Son las frases que vas a decir en un ' +
               'code review o en una entrevista.</p>',
        items: [
          { texto: 'I used a queue instead of a cron job.', es: 'Usé una cola en vez de un cron.',
            nota: '<b>instead of</b> = en vez de. Es la bisagra para contrastar dos opciones.' },
          { texto: 'It was the simplest option that worked.', es: 'Era la opción más simple que funcionaba.',
            nota: 'Una justificación perfectamente válida y muy bien vista. La simplicidad se valora.' },
          { texto: 'The trade-off was a bit more latency.', es: 'La contrapartida era un poco más de latencia.',
            nota: '<b>trade-off</b> es <i>la</i> palabra de la ingeniería de software. No tiene equivalente corto en español.' },
          { texto: 'In hindsight, I should have added a test.', es: 'Viéndolo ahora, debería haber agregado un test.',
            nota: '<b>should have</b> suena "shoulda" al hablar. Reconocerlo al escuchar es útil.' },
          { texto: 'Good catch, thanks. I missed that case.', es: 'Buen ojo, gracias. Se me pasó ese caso.',
            nota: '<b>Good catch</b> es la respuesta estándar cuando alguien encuentra un error tuyo en un review.' },
        ],
      },

      practica: `
        <p><b>Explicá una decisión técnica que hayas tomado</b>, con las tres partes:</p>
        <ol>
          <li>I used ______ instead of ______.</li>
          <li>I chose it because ______.</li>
          <li>I didn't use ______ because ______.</li>
        </ol>

        <p>La tercera parte es la que más suma. Decir qué <b>descartaste y por qué</b> es lo que
        distingue a alguien que decidió de alguien que hizo lo primero que se le ocurrió.</p>

        <p><b>Y practicá admitir un error</b>, que es más difícil de lo que parece:</p>
        <ul>
          <li><span class="en" data-say>That was my mistake, I'll fix it.</span></li>
          <li><span class="en" data-say>Good catch, thanks. I missed that case.</span></li>
          <li><span class="en" data-say>In hindsight, I should have tested it first.</span></li>
        </ul>

        <p><b>Cortas y directas.</b> Disculparse largamente incomoda y desplaza el foco del problema
        a tus sentimientos — que es lo contrario de lo que se busca en un postmortem.</p>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Completá: <b>I used a queue ______ of a cron job.</b> (en vez de)',
          respuesta: 'instead',
          porQue: '<b>instead of</b> es la bisagra para contrastar la opción elegida con la descartada.',
        },
        {
          tipo: 'opcion',
          p: 'En un code review alguien encuentra un error tuyo. ¿Cuál es la mejor respuesta?',
          opciones: [
            "I'm so sorry, I'm terrible at this, I apologize.",
            'Good catch, thanks. I missed that case.',
            'That is not a real problem.',
            'OK.',
          ],
          correcta: 1,
          porQue: '<b>Good catch</b> es la respuesta estándar: reconoce el hallazgo sin dramatizar y mantiene el foco en el problema.',
          porQueNo: {
            0: 'Disculparse de más incomoda y desplaza el foco del problema a tus sentimientos.',
            2: 'Ponerse a la defensiva ante un review es lo que peor cae en un equipo.',
            3: 'Demasiado seco: no reconoce el aporte del otro.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Era la opción más simple que funcionaba.</b>',
          respuesta: 'It was the simplest option that worked',
          pista: 'El superlativo de simple es simplest.',
          porQue: 'Es una justificación perfectamente válida y bien vista. La simplicidad se valora en ingeniería.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «Viéndolo ahora, debería haber agregado un test.»',
          respuesta: 'In hindsight I should have added a test',
          porQue: '<b>in hindsight</b> + <b>should have</b>: la fórmula para reconocer un error sin sonar a disculpa.',
        },
        {
          tipo: 'dictado',
          p: 'Escuchá y escribí. Es la palabra clave de la lección.',
          respuesta: 'The trade-off was a bit more latency',
          porQue: '<b>trade-off</b> es la palabra de la ingeniería de software, y no tiene traducción corta al español.',
        },
      ],

      errores: [
        { mito: 'Cuando encuentran un error mío conviene disculparse mucho para mostrar que me importa.',
          realidad: 'Incomoda y desplaza el foco del problema a tus sentimientos. El inglés de trabajo espera ' +
                    'reconocimiento <b>directo y breve</b>: <i>Good catch, thanks</i> o <i>That was my mistake, I\'ll fix it</i>. ' +
                    'Eso se lee como profesionalismo, no como frialdad.' },
        { mito: '«Era la opción más simple» suena a excusa por no haber hecho algo mejor.',
          realidad: 'Es una de las justificaciones <b>mejor vistas</b> en ingeniería. La simplicidad se valora, ' +
                    'y <i>overkill</i> es una crítica real. <i>It was the simplest option that worked</i> es una ' +
                    'respuesta completa.' },
        { mito: 'Alcanza con decir qué hice y por qué.',
          realidad: 'La parte que más suma es la <b>tercera</b>: qué descartaste y por qué. Es lo que distingue ' +
                    'a alguien que <b>decidió</b> de alguien que hizo lo primero que se le ocurrió. ' +
                    'Es exactamente lo que se busca en una entrevista técnica.' },
      ],

      glosario: [
        { t: 'Trade-off', d: 'Lo que se resigna a cambio de otra cosa. La palabra central de la ingeniería de software; no tiene traducción corta.' },
        { t: 'In hindsight', d: 'Viéndolo en retrospectiva. Sirve para reconocer un error sin sonar a disculpa.' },
        { t: 'Good catch', d: 'Buen ojo. La respuesta estándar cuando alguien encuentra un error tuyo en un review.' },
        { t: 'Should have', d: 'Debería haber. Fórmula fija para lo que habría convenido hacer. Al hablar suena "shoulda".' },
        { t: 'Overkill', d: 'Desproporcionado para el problema. Es una crítica real en decisiones técnicas.' },
        { t: 'Workaround', d: 'Solución provisoria que esquiva el problema sin resolver la causa.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l4',
      titulo: 'El standup completo',
      minutos: 8,

      simple: `
        <p>Ahora tenés todas las piezas. Este es el módulo donde se juntan.</p>

        <h4>Las tres partes y sus tiempos</h4>
        <table>
          <tr><th>Parte</th><th>Tiempo</th><th>Módulo</th></tr>
          <tr><td>Ayer hice…</td><td>past simple</td><td>m07 y m08</td></tr>
          <tr><td>Ayer estaba…</td><td>past continuous</td><td>m07</td></tr>
          <tr><td>Hoy estoy…</td><td>present continuous</td><td>m06</td></tr>
          <tr><td>Estoy trabado por…</td><td>to be</td><td>m01</td></tr>
          <tr><td>Voy a…</td><td>going to</td><td>m09</td></tr>
        </table>

        <div class="analogia">
          <b>Un standup completo:</b><br>
          <span class="en" data-say>Yesterday I was working on the login bug. I found the root cause — the token expired too early — and I fixed it. I also updated the tests. Today I'm reviewing two PRs and then I'm picking up the notifications ticket. I'm not blocked.</span>
        </div>

        <p>Fijate: <b>pasado para lo hecho, continuo para lo que sigue en curso</b>. Y las frases
        son cortas.</p>

        <h4>Frases para «ayer»</h4>
        <ul>
          <li><span class="en" data-say>Yesterday I finished the API integration.</span></li>
          <li><span class="en" data-say>I found the root cause and fixed it.</span></li>
          <li><span class="en" data-say>I opened a PR for the login fix.</span></li>
          <li><span class="en" data-say>I couldn't finish it because I was blocked.</span></li>
          <li><span class="en" data-say>I spent most of the day debugging.</span></li>
        </ul>

        <h4>Cuando no avanzaste</h4>
        <p>Esto también hay que saber decirlo, y decirlo bien:</p>
        <ul>
          <li><span class="en" data-say>I didn't get as far as I wanted.</span> — no avancé tanto como quería</li>
          <li><span class="en" data-say>It took longer than expected.</span> — llevó más de lo esperado</li>
          <li><span class="en" data-say>I hit a few problems with the setup.</span> — me topé con problemas</li>
          <li><span class="en" data-say>I'm still on the same ticket.</span> — sigo en el mismo ticket</li>
        </ul>

        <div class="aviso">
          <b>Ninguna de esas suena a excusa.</b> Son descripciones neutras de hechos, que es exactamente
          lo que se espera en un standup. Lo que sí queda mal es <b>no decir nada</b> y que el equipo
          se entere tres días después.
        </div>

        <h4>Cerrar tu turno</h4>
        <ul>
          <li><span class="en" data-say>That's all from me.</span></li>
          <li><span class="en" data-say>No blockers.</span></li>
          <li><span class="en" data-say>Let me know if anyone needs anything.</span></li>
        </ul>
      `,

      tecnico: `
        <p><b>Sobre el registro del standup.</b> Es de los contextos más formulaicos que existen:
        estructura fija, frases cortas, mucha elipsis. Eso lo hace <b>ideal para un nivel A1</b> —
        no necesitás improvisar, necesitás las fórmulas.</p>

        <div class="nota-tec">
          <b>La elipsis del sujeto.</b> El standup es de las pocas situaciones donde el inglés permite
          omitir el pronombre:
          <br><br>
          <i>Finished the login fix yesterday. Working on the API today. No blockers.</i>
          <br><br>
          Es telegráfico y perfectamente aceptable — de hecho, es lo habitual en standups escritos
          por Slack. En cualquier otro contexto el sujeto es obligatorio.
        </div>

        <p><b>Vocabulario de standup en pasado:</b></p>
        <table>
          <tr><th>Expresión</th><th>Significa</th></tr>
          <tr><td>I got X done</td><td>terminé X</td></tr>
          <tr><td>I didn't get as far as I wanted</td><td>no avancé tanto como quería</td></tr>
          <tr><td>It took longer than expected</td><td>llevó más de lo previsto</td></tr>
          <tr><td>I hit a problem with X</td><td>me topé con un problema con X</td></tr>
          <tr><td>I spent the day on X</td><td>pasé el día en X</td></tr>
          <tr><td>I opened a PR for X</td><td>abrí un PR para X</td></tr>
          <tr><td>It's ready for review</td><td>está listo para revisar</td></tr>
          <tr><td>I paired with X on it</td><td>lo hicimos en pareja con X</td></tr>
        </table>

        <p><b>Sobre <i>couldn't</i>.</b> Es el pasado de <i>can't</i> y aparece constantemente en
        standups: <i>I couldn't reproduce it</i>, <i>I couldn't finish it</i>. Como modal, el verbo
        que le sigue va en forma base — igual que con <i>can</i>.</p>

        <p><b>Sobre reportar la falta de avance.</b> En equipos que funcionan bien, decirlo temprano es
        lo que se valora; el standup existe justamente para eso. Lo que genera problemas reales es el
        silencio: si nadie sabe que estás trabado, nadie puede destrabarte. Tener las frases automáticas
        baja mucho la barrera para decirlo.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Las cinco piezas de un standup y qué módulo cubre cada una">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Todo el track, en un standup</text>

          <g font-size="12.5">
            <rect x="34" y="40" width="612" height="34" rx="8" fill="#c084fc" opacity="0.12" stroke="#c084fc" stroke-width="1.2"/>
            <text x="52" y="62" fill="currentColor" opacity="0.9">Yesterday I <tspan font-weight="700" fill="#c084fc">was working</tspan> on the login bug.</text>
            <text x="628" y="62" text-anchor="end" font-size="11" fill="#c084fc">past continuous · m07</text>

            <rect x="34" y="80" width="612" height="34" rx="8" fill="#f87171" opacity="0.11" stroke="#f87171" stroke-width="1.2"/>
            <text x="52" y="102" fill="currentColor" opacity="0.9">I <tspan font-weight="700" fill="#f87171">found</tspan> the root cause and <tspan font-weight="700" fill="#f87171">fixed</tspan> it.</text>
            <text x="628" y="102" text-anchor="end" font-size="11" fill="#f87171">past simple · m07 y m08</text>

            <rect x="34" y="120" width="612" height="34" rx="8" fill="#22d3ee" opacity="0.12" stroke="#22d3ee" stroke-width="1.2"/>
            <text x="52" y="142" fill="currentColor" opacity="0.9">Today I<tspan font-weight="700" fill="#22d3ee">'m reviewing</tspan> two PRs.</text>
            <text x="628" y="142" text-anchor="end" font-size="11" fill="#22d3ee">present continuous · m06</text>

            <rect x="34" y="160" width="612" height="34" rx="8" fill="#34d399" opacity="0.12" stroke="#34d399" stroke-width="1.2"/>
            <text x="52" y="182" fill="currentColor" opacity="0.9">I<tspan font-weight="700" fill="#34d399">'m not</tspan> blocked.</text>
            <text x="628" y="182" text-anchor="end" font-size="11" fill="#34d399">to be · m01</text>

            <rect x="34" y="200" width="612" height="34" rx="8" fill="#fbbf24" opacity="0.12" stroke="#fbbf24" stroke-width="1.2"/>
            <text x="52" y="222" fill="currentColor" opacity="0.9">Tomorrow I<tspan font-weight="700" fill="#fbbf24">'m going to</tspan> start the notifications.</text>
            <text x="628" y="222" text-anchor="end" font-size="11" fill="#fbbf24">going to · m09</text>
          </g>

          <rect x="34" y="246" width="612" height="30" rx="8" fill="currentColor" opacity="0.06"/>
          <text x="340" y="266" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.8">
            Y en Slack se puede escribir telegráfico: "Finished the login fix. On the API today. No blockers."
          </text>
        </svg>`,
        pie: 'Cinco frases y cinco módulos del track. El standup es el examen práctico de A1.',
      },

      escucha: {
        intro: '<p>Standups completos. Esto es exactamente lo que vas a escuchar todos los días ' +
               'en un equipo internacional.</p>',
        items: [
          { texto: 'Yesterday I finished the API integration and opened a PR.', es: 'Ayer terminé la integración de la API y abrí un PR.',
            nota: 'Dos pasados coordinados con <b>and</b>. Frases cortas, sin subordinadas.' },
          { texto: "I couldn't reproduce the bug on my machine.", es: 'No pude reproducir el bug en mi máquina.',
            nota: '<b>couldn\'t</b> es el pasado de <i>can\'t</i>, y el verbo que le sigue va en base.' },
          { texto: 'It took longer than expected, so I am still on it.', es: 'Llevó más de lo esperado, así que sigo en eso.',
            nota: 'Cómo decir que no avanzaste sin que suene a excusa: es una descripción neutra.' },
          { texto: "I hit a few problems with the setup, but I got it working.", es: 'Me topé con algunos problemas con el setup, pero lo hice andar.',
            nota: '<b>hit a problem</b> = toparse con un problema. Y <b>got it working</b> = lograr que funcione.' },
          { texto: "That's all from me. No blockers.", es: 'Es todo de mi parte. Sin bloqueos.',
            nota: 'Las dos frases con las que se cierra un turno. Tenelas automáticas.' },
        ],
      },

      practica: `
        <p><b>Escribí tu standup real de hoy</b>, con las tres partes y sus tiempos:</p>
        <ol>
          <li><b>Ayer:</b> Yesterday I ______ <i>(pasado)</i></li>
          <li><b>Hoy:</b> Today I'm ______ <i>(continuous)</i></li>
          <li><b>Bloqueos:</b> I'm blocked on ______ / No blockers.</li>
        </ol>

        <p><b>Decilo en voz alta cinco veces.</b> El standup es el ejercicio ideal de A1: estructura
        fija, vocabulario acotado, y lo vas a repetir todos los días. Lo que automatices acá te va a
        servir literalmente cada mañana.</p>

        <p><b>Y tené listas las cuatro frases del «no avancé»:</b></p>
        <ul>
          <li><span class="en" data-say>It took longer than expected.</span></li>
          <li><span class="en" data-say>I didn't get as far as I wanted.</span></li>
          <li><span class="en" data-say>I hit a few problems.</span></li>
          <li><span class="en" data-say>I'm still on the same ticket.</span></li>
        </ul>
        <p>Ninguna suena a excusa. Lo que sí queda mal es callarse y que el equipo se entere
        tres días después.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'En el standup, ¿qué tiempo va para lo que hiciste ayer?',
          opciones: ['Present simple', 'Present continuous', 'Past simple', 'Going to'],
          correcta: 2,
          porQue: 'Lo terminado va en <b>past simple</b>. El continuo se reserva para lo que sigue en curso hoy.',
          porQueNo: {
            0: 'Es para rutinas y hechos, no para lo de ayer.',
            1: 'Es para lo que estás haciendo ahora.',
            3: 'Es para lo que vas a hacer.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá con el pasado de <b>can\'t</b>: <b>I ______ reproduce the bug.</b>',
          respuesta: "couldn't",
          respuestas: ['could not'],
          porQue: '<b>couldn\'t</b> es el pasado de <i>can\'t</i>. Y como es modal, el verbo que sigue va en forma base.',
        },
        {
          tipo: 'opcion',
          p: 'No terminaste lo de ayer. ¿Cómo lo decís mejor en el standup?',
          opciones: [
            "I'm sorry, I failed to finish it.",
            'It took longer than expected, so I am still on it.',
            "I didn't do anything.",
            'Nothing to report.',
          ],
          correcta: 1,
          porQue: 'Es una descripción <b>neutra de un hecho</b>, que es lo que se espera. Informa sin dramatizar.',
          porQueNo: {
            0: 'Disculparse y hablar de «fallar» dramatiza algo normal.',
            2: 'Es inexacto y además no da información útil al equipo.',
            3: 'Oculta el estado real, que es justamente lo que el standup necesita saber.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Ayer terminé la integración y abrí un PR.</b>',
          respuesta: 'Yesterday I finished the integration and opened a PR',
          pista: 'Los dos verbos son regulares.',
          porQue: 'Dos pasados coordinados con <b>and</b>. Frases cortas: así se arma un standup.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá el cierre: «Es todo de mi parte, sin bloqueos.»',
          respuesta: "That's all from me, no blockers",
          porQue: 'Las dos frases estándar para cerrar tu turno. Vale la pena tenerlas automáticas.',
        },
      ],

      errores: [
        { mito: 'Si no avancé, mejor no decir nada y ver si lo resuelvo antes del próximo standup.',
          realidad: 'Es exactamente lo que <b>sí</b> genera problemas. El standup existe para que el equipo sepa dónde ' +
                    'estás parado: si nadie sabe que estás trabado, nadie puede destrabarte. Decirlo temprano ' +
                    'se valora; el silencio no.' },
        { mito: 'Hay que hablar en frases completas y elaboradas en el standup.',
          realidad: 'Es de los contextos más telegráficos que hay. <i>Finished the login fix. On the API today. No blockers.</i> ' +
                    'es perfectamente aceptable — y hasta se puede omitir el sujeto, que es de las pocas situaciones ' +
                    'donde el inglés lo permite.' },
        { mito: 'Con <i>couldn\'t</i> el verbo va en pasado.',
          realidad: '❌ <i>I couldn\'t reproduced it</i>. <i>couldn\'t</i> es un <b>modal</b>, y los modales rigen forma base: ' +
                    '<i>I couldn\'t reproduce it</i>. Es la misma regla de <i>can</i> del módulo 5.' },
      ],

      glosario: [
        { t: "Couldn't", d: 'El pasado de <i>can\'t</i>. Como modal, el verbo que le sigue va en forma base.' },
        { t: 'Root cause', d: 'Causa raíz. Lo que se busca en un debugging serio, más allá del síntoma.' },
        { t: 'It took longer than expected', d: 'Llevó más de lo previsto. La forma neutra de reportar demora sin sonar a excusa.' },
        { t: 'Hit a problem', d: 'Toparse con un problema. <i>I hit a few problems with the setup</i>.' },
        { t: "That's all from me", d: 'Es todo de mi parte. La fórmula para cerrar tu turno en el standup.' },
      ],
    },
  ],

  /* ==================================================================== */
  vocabulario: [
    { en: 'went', es: 'fui / fue', pista: 'Pasado de go. El irregular más usado.', ejemplo: 'I went to the office yesterday.', ejemploEs: 'Ayer fui a la oficina.' },
    { en: 'saw', es: 'vi', pista: 'Pasado de see.', ejemplo: 'I saw the error in the logs.', ejemploEs: 'Vi el error en los logs.' },
    { en: 'took', es: 'tomé / llevó', pista: 'Pasado de take.', ejemplo: 'It took longer than expected.', ejemploEs: 'Llevó más de lo esperado.' },
    { en: 'made', es: 'hice', pista: 'Pasado de make.', ejemplo: 'I made a mistake.', ejemploEs: 'Cometí un error.' },
    { en: 'got', es: 'obtuve / conseguí', pista: 'Pasado de get.', ejemplo: 'I got it working.', ejemploEs: 'Logré que funcione.' },
    { en: 'had', es: 'tenía / tuve', pista: 'Pasado de have.', ejemplo: 'We had a problem with the deploy.', ejemploEs: 'Tuvimos un problema con el deploy.' },
    { en: 'broke', es: 'se rompió', pista: 'Pasado de break.', ejemplo: 'The build broke after the commit.', ejemploEs: 'El build se rompió después del commit.' },
    { en: 'wrote', es: 'escribí', pista: 'Pasado de write.', ejemplo: 'I wrote the tests yesterday.', ejemploEs: 'Escribí los tests ayer.' },
    { en: 'thought', es: 'pensé', pista: 'Pasado de think. Se dice "zot".', ejemplo: 'I thought it was a config problem.', ejemploEs: 'Pensé que era un problema de config.' },
    { en: 'found', es: 'encontré', pista: 'Pasado de find.', ejemplo: 'I found the root cause.', ejemploEs: 'Encontré la causa raíz.' },
    { en: 'ran', es: 'corrí / ejecuté', pista: 'Pasado de run.', ejemplo: 'I ran the tests locally.', ejemploEs: 'Corrí los tests localmente.' },
    { en: "couldn't", es: 'no pude', pista: 'Pasado de can\'t. El verbo que sigue va en base.', ejemplo: "I couldn't reproduce the bug.", ejemploEs: 'No pude reproducir el bug.' },
    { en: 'then', es: 'después', ejemplo: 'First I checked the logs, then I found the error.', ejemploEs: 'Primero revisé los logs, después encontré el error.' },
    { en: 'so', es: 'así que', pista: 'Causa primero, efecto después.', ejemplo: 'The build failed, so I reverted it.', ejemploEs: 'El build falló, así que lo revertí.' },
    { en: 'because', es: 'porque', pista: 'Efecto primero, causa después.', ejemplo: 'It failed because the token expired.', ejemploEs: 'Falló porque el token venció.' },
    { en: 'instead of', es: 'en vez de', ejemplo: 'I used a queue instead of a cron job.', ejemploEs: 'Usé una cola en vez de un cron.' },
    { en: 'trade-off', es: 'contrapartida', pista: 'Sin traducción corta al español.', ejemplo: 'The trade-off was more latency.', ejemploEs: 'La contrapartida era más latencia.' },
    { en: 'in hindsight', es: 'viéndolo en retrospectiva', ejemplo: 'In hindsight, I should have added a test.', ejemploEs: 'Viéndolo ahora, debería haber agregado un test.' },
    { en: 'good catch', es: 'buen ojo', pista: 'La respuesta cuando alguien encuentra un error tuyo.', ejemplo: 'Good catch, thanks.', ejemploEs: 'Buen ojo, gracias.' },
    { en: 'root cause', es: 'causa raíz', ejemplo: 'I found the root cause.', ejemploEs: 'Encontré la causa raíz.' },
    { en: 'twice', es: 'dos veces', ejemplo: 'I tried it twice.', ejemploEs: 'Lo intenté dos veces.' },
    { en: 'expected', es: 'esperado', ejemplo: 'It took longer than expected.', ejemploEs: 'Llevó más de lo esperado.' },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es el pasado de <b>go</b>?',
      opciones: ['goed', 'gone', 'went', 'goes'],
      correcta: 2,
      porQue: '<b>went</b>. No se parece en nada a <i>go</i> — es el irregular más suelto y el más usado.',
      porQueNo: {
        0: '<i>go</i> es irregular: no lleva <i>-ed</i>.',
        1: '<i>gone</i> es el participio, que se usa en present perfect (nivel B1).',
        3: '<i>goes</i> es la tercera persona del presente.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: ['Did you went to the meeting?', 'Did you go to the meeting?', 'Did you gone to the meeting?', 'Went you to the meeting?'],
      correcta: 1,
      porQue: 'Con <b>did</b>, el verbo vuelve a su <b>forma base</b>. Ni siquiera hace falta saber el irregular.',
      porQueNo: {
        0: 'El pasado está duplicado: en <i>did</i> y en <i>went</i>.',
        2: '<i>gone</i> es participio.',
        3: 'Los verbos léxicos no se pueden invertir: por eso existe <i>did</i>.',
      },
    },
    {
      p: '¿Qué tiene de particular el verbo <b>read</b> en pasado?',
      opciones: [
        'Que no tiene pasado',
        'Que se escribe igual pero suena distinto: "riid" en presente, "red" en pasado',
        'Que es regular',
        'Que cambia la vocal por escrito',
      ],
      correcta: 1,
      porQue: 'Es el único de su grupo con esa trampa: al escribir no se nota, al hablar sí.',
      porQueNo: {
        0: 'Lo tiene: es <i>read</i>, escrito igual.',
        2: 'Es irregular: un verbo regular sería ❌ <i>readed</i>.',
        3: 'La grafía no cambia; lo que cambia es solo el sonido.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: [
        'Because the token expired, so the build failed.',
        'The build failed because the token expired.',
        'The build failed so because the token expired.',
        'Because so the token expired the build failed.',
      ],
      correcta: 1,
      porQue: '<b>so</b> y <b>because</b> señalan la misma relación en direcciones opuestas: va uno o el otro, nunca los dos.',
      porQueNo: {
        0: 'Duplica la relación causal. En español se tolera más; en inglés suena a error.',
        2: 'Los dos conectores juntos no funcionan.',
        3: 'Sin sentido.',
      },
    },
    {
      p: '¿Qué significa <i>I was reviewing the PR when the build broke</i>?',
      opciones: [
        'Revisé el PR después de que se rompió el build',
        'Estaba revisando el PR y en ese momento se rompió el build',
        'Revisé el PR y luego rompí el build',
        'El build se rompió mientras yo no estaba',
      ],
      correcta: 1,
      porQue: 'Es el <b>patrón de interrupción</b>: el continuo es el escenario y el simple es el evento que lo corta.',
      porQueNo: {
        0: 'Eso sería <i>I reviewed the PR when the build broke</i>, con los dos en simple.',
        2: 'No hay relación de causa en la frase.',
        3: 'No dice nada sobre tu ausencia.',
      },
    },
    {
      p: 'En un code review encuentran un error tuyo. ¿Cuál es la mejor respuesta?',
      opciones: [
        "I'm so sorry, I apologize, this was terrible of me.",
        'Good catch, thanks. I missed that case.',
        "That's not really a problem.",
        'OK.',
      ],
      correcta: 1,
      porQue: '<b>Good catch</b> reconoce el hallazgo sin dramatizar y mantiene el foco en el problema, no en tus sentimientos.',
      porQueNo: {
        0: 'Disculparse de más incomoda y desplaza el foco.',
        2: 'Ponerse a la defensiva ante un review es lo que peor cae.',
        3: 'Demasiado seco: no reconoce el aporte del otro.',
      },
    },
    {
      p: '¿Qué es un <i>trade-off</i>?',
      opciones: [
        'Un intercambio comercial',
        'Lo que se resigna a cambio de obtener otra cosa en una decisión',
        'Un error de diseño',
        'Una negociación de sueldo',
      ],
      correcta: 1,
      porQue: 'Es <i>la</i> palabra de la ingeniería de software, y no tiene una traducción corta al español.',
      porQueNo: {
        0: 'Ese es el sentido literal, pero no el técnico.',
        2: 'Eso sería un <i>design flaw</i>.',
        3: 'Nada que ver.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: ["I couldn't reproduced it.", "I couldn't reproduce it.", "I didn't could reproduce it.", "I couldn't to reproduce it."],
      correcta: 1,
      porQue: '<b>couldn\'t</b> es un modal, y los modales rigen <b>forma base</b>. Es la misma regla de <i>can</i> del módulo 5.',
      porQueNo: {
        0: 'El pasado está duplicado.',
        2: 'Los modales no usan <i>do</i>.',
        3: 'Sobra el <i>to</i>.',
      },
    },
    {
      p: 'En un standup, ¿cómo decís mejor que no terminaste lo de ayer?',
      opciones: [
        'Nothing to report.',
        'It took longer than expected, so I am still on it.',
        "I'm sorry, I failed.",
        "I didn't do anything.",
      ],
      correcta: 1,
      porQue: 'Es una descripción <b>neutra de un hecho</b>: informa el estado real sin dramatizar.',
      porQueNo: {
        0: 'Oculta el estado real, que es justamente lo que el standup necesita saber.',
        2: 'Dramatiza algo normal y desvía el foco.',
        3: 'Es inexacto y no aporta información útil.',
      },
    },
    {
      p: '¿Por qué los verbos irregulares se agrupan en patrones como <i>break/broke</i>, <i>speak/spoke</i>?',
      opciones: [
        'Es una coincidencia',
        'Porque vienen de los verbos fuertes germánicos, que marcaban el pasado cambiando la vocal de la raíz',
        'Porque todos empiezan con la misma letra',
        'Porque los inventaron juntos',
      ],
      correcta: 1,
      porQue: 'Son una <b>clase con su propia lógica</b>, hoy improductiva. Verlos agrupados los hace mucho más fáciles de aprender que en una lista alfabética.',
      porQueNo: {
        0: 'No lo es: comparten el mismo patrón vocálico heredado.',
        2: 'La letra inicial no tiene nada que ver.',
        3: 'Son restos de un sistema antiguo, no una invención.',
      },
    },
    {
      p: '¿Qué parte de una explicación técnica es la que más distingue a alguien con criterio?',
      opciones: [
        'Decir qué hizo',
        'Decir por qué lo hizo',
        'Decir qué opciones descartó y por qué',
        'Decir cuánto tardó',
      ],
      correcta: 2,
      porQue: 'Es lo que separa a alguien que <b>decidió</b> de alguien que hizo lo primero que se le ocurrió. Y es justo lo que se busca en una entrevista técnica.',
      porQueNo: {
        0: 'Es el mínimo, no lo distintivo.',
        1: 'Suma, pero sin las alternativas queda incompleto.',
        3: 'Es información útil pero no habla de criterio.',
      },
    },
    {
      p: '¿Cuántos verbos irregulares vale la pena priorizar?',
      opciones: [
        'Los 200 de la lista completa',
        'Ninguno: con did alcanza',
        'Unos 40, y sobre todo los 10 más frecuentes, que son todos irregulares',
        'Solo los que terminan en -ought',
      ],
      correcta: 2,
      porQue: 'be, have, do, say, go, get, make, know, take y see son todos irregulares y cubren una parte enorme del habla real. La cola larga casi no aparece.',
      porQueNo: {
        0: 'Es de las peores relaciones esfuerzo/resultado del inglés.',
        1: '<i>did</i> te salva en negativas y preguntas, pero en afirmativas los necesitás.',
        3: 'Es un solo grupo de cinco verbos.',
      },
    },
  ],
});
