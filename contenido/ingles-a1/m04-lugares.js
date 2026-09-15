/* ==========================================================================
   Inglés A1 · m04 — Dónde están las cosas
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ingles-a1',
  id: 'm04',
  titulo: 'Dónde están las cosas',
  fuentes: ['cambridge-dic', 'wordreference', 'bbc-learning-english'],

  intro:
    '<p>Decir que algo <b>existe</b> y decir <b>dónde está</b>. Dos cosas que usás todo el día sin darte ' +
    'cuenta: «hay un bug en producción», «el archivo está en la carpeta de config», «la reunión es a las tres».</p>' +
    '<p>Hay una estructura nueva —<b>there is / there are</b>— y un trío de preposiciones —<b>in, on, at</b>— ' +
    'que sirve tanto para lugar como para tiempo. Las preposiciones son la parte que <b>no se deduce</b>: ' +
    'se aprenden como bloques. Este módulo te da los bloques que más se repiten.</p>',

  lecciones: [

    /* ==================================================================== */
    {
      id: 'l1',
      titulo: 'There is / there are: decir que algo existe',
      minutos: 8,

      simple: `
        <p>En español decís «hay» y listo, sin importar si es uno o muchos. En inglés hay que elegir:</p>

        <div class="analogia">
          <b>Uno:</b> <span class="en" data-say>There is a bug in production</span> — hay un bug<br>
          <b>Varios:</b> <span class="en" data-say>There are three bugs in production</span> — hay tres bugs
        </div>

        <p>El verbo concuerda con lo que viene <b>después</b>. Es lo único que hay que vigilar.</p>

        <h4>Contracciones</h4>
        <ul>
          <li>there is → <b>there's</b> · <span class="en" data-say>There's a problem</span></li>
          <li>there are → <b>there're</b>, pero casi no se usa. Se dice entero.</li>
        </ul>

        <h4>Negar y preguntar</h4>
        <p>Como es <i>to be</i>, funciona igual que en el módulo 1 — sin <i>do</i>:</p>
        <ul>
          <li><span class="en" data-say>There isn't a problem</span> — no hay un problema</li>
          <li><span class="en" data-say>There aren't any tests</span> — no hay tests</li>
          <li><span class="en" data-say>Is there a meeting today?</span> — ¿hay reunión hoy?</li>
          <li><span class="en" data-say>Are there any questions?</span> — ¿hay preguntas?</li>
        </ul>
        <p>Fijate en <b>any</b>: en negativo y pregunta va <i>any</i>, no <i>some</i>. Es lo mismo del
        módulo 2.</p>

        <div class="aviso">
          <b>La trampa: <i>there is</i> no es <i>it is</i>.</b><br><br>
          ❌ <i>It is a bug in production</i> — esto significa «<b>eso</b> es un bug en producción»<br>
          ✅ <span class="en" data-say>There is a bug in production</span> — hay un bug<br><br>
          <i>there</i> no se traduce por «ahí»: es una pieza vacía que existe solo para que la frase
          tenga sujeto, porque el inglés lo exige siempre.
        </div>

        <h4>La que más vas a usar</h4>
        <p><span class="en" data-say>Are there any questions?</span> — es cómo se cierra una presentación
        o una demo. Vale la pena tenerla automática.</p>
      `,

      tecnico: `
        <p><b>There</b> en esta construcción es un <b>sujeto expletivo</b>: no significa nada y no se
        refiere a ningún lugar. Está ahí porque el inglés no admite oraciones sin sujeto — el mismo
        motivo por el que existe <i>It's raining</i>.</p>

        <p>La prueba de que no significa «ahí» es que se puede combinar con un <i>there</i> locativo real:</p>
        <div class="nota-tec">
          <i>There is a problem <b>there</b>.</i> — Hay un problema ahí.
          <br><br>
          El primero es el expletivo, el segundo señala el lugar. Si <i>there</i> significara «ahí»
          en los dos casos, la frase sería redundante.
        </div>

        <p><b>La concordancia va con el sujeto lógico</b>, que aparece después del verbo:</p>
        <ul>
          <li><i>There <b>is</b> a bug</i> — singular</li>
          <li><i>There <b>are</b> three bugs</i> — plural</li>
          <li><i>There <b>is</b> some information</i> — incontable → singular</li>
        </ul>

        <p><b>Un detalle del habla real:</b> en conversación informal se escucha muchísimo
        <i>there's</i> seguido de plural — <i>There's two bugs</i>. Es muy frecuente y muchos nativos
        lo dicen sin pensar, pero <b>en escritura formal se corrige</b>. Conviene reconocerlo al
        escuchar y no reproducirlo al escribir.</p>

        <p><b>Con listas, concuerda con el primer elemento:</b> <i>There is a laptop, two monitors and
        a keyboard on the desk.</i> Suena mejor así que forzando el plural.</p>

        <p><b>En pasado</b> (adelanto del módulo 7): <i>There was a problem</i> / <i>There were
        three problems</i>. Misma estructura, mismo criterio.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="There is contra there are, y la diferencia con it is">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Una palabra en español, dos en inglés</text>

          <rect x="250" y="38" width="180" height="34" rx="8" fill="#f59e0b" opacity="0.25" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="340" y="61" text-anchor="middle" font-size="17" font-weight="800" fill="#f59e0b">hay</text>

          <line x1="300" y1="72" x2="180" y2="102" stroke="currentColor" opacity="0.3" stroke-width="1.4"/>
          <line x1="380" y1="72" x2="500" y2="102" stroke="currentColor" opacity="0.3" stroke-width="1.4"/>

          <rect x="46" y="106" width="270" height="78" rx="9" fill="#34d399" opacity="0.12" stroke="#34d399" stroke-width="1.3"/>
          <text x="181" y="130" text-anchor="middle" font-size="17" font-weight="800" fill="#34d399">there is</text>
          <text x="181" y="150" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.75">uno · o incontable</text>
          <text x="181" y="171" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">There is a bug</text>

          <rect x="364" y="106" width="270" height="78" rx="9" fill="#22d3ee" opacity="0.12" stroke="#22d3ee" stroke-width="1.3"/>
          <text x="499" y="130" text-anchor="middle" font-size="17" font-weight="800" fill="#22d3ee">there are</text>
          <text x="499" y="150" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.75">varios</text>
          <text x="499" y="171" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.9">There are three bugs</text>

          <text x="340" y="206" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.7">
            El verbo concuerda con lo que viene DESPUÉS
          </text>

          <rect x="46" y="220" width="588" height="30" rx="7" fill="#f87171" opacity="0.1" stroke="#f87171" stroke-width="1.2"/>
          <text x="340" y="240" text-anchor="middle" font-size="12" font-weight="600" fill="#f87171">
            ✗ "It is a bug in production" = "ESO es un bug". No es lo mismo que "hay un bug".
          </text>
        </svg>`,
        pie: 'El "there" de esta construcción no significa «ahí»: es una pieza vacía que ocupa el lugar del sujeto.',
      },

      escucha: {
        intro: '<p>Fijate si escuchás <b>is</b> o <b>are</b>: eso te dice si lo que viene es uno o varios, ' +
               'incluso antes de escuchar el sustantivo.</p>',
        items: [
          { texto: "There's a problem with the deploy.", es: 'Hay un problema con el deploy.',
            nota: '<b>there\'s</b> se dice muy pegado, casi "derz". Es la contracción más frecuente de todas.' },
          { texto: 'There are two open pull requests.', es: 'Hay dos pull requests abiertos.',
            nota: '<b>there are</b> casi no se contrae. Se dice entero.' },
          { texto: 'Are there any questions?', es: '¿Hay alguna pregunta?',
            nota: 'La frase con la que se cierra cualquier demo o presentación. Tenela automática.' },
          { texto: "There aren't any tests for this.", es: 'No hay tests para esto.',
            nota: 'En negativo va <b>any</b>, no <i>some</i>. Misma regla del módulo 2.' },
        ],
      },

      practica: `
        <p><b>Describí tu situación laboral de hoy</b> con cinco frases de <i>there is</i> / <i>there are</i>:</p>
        <ul>
          <li>There is ______ in my calendar today.</li>
          <li>There are ______ tickets in my column.</li>
          <li>There isn't ______.</li>
          <li>Are there ______?</li>
        </ul>

        <p><b>El chequeo:</b> mirá qué viene <b>después</b> del verbo. Si es singular o incontable, <i>is</i>.
        Si es plural, <i>are</i>. Nada más.</p>

        <p><b>Ojo con una cosa que vas a escuchar</b> y no conviene copiar: mucha gente dice
        <i>There's two bugs</i> en conversación informal. Es muy común y en escritura formal se corrige.
        Reconocelo al escuchar, pero escribí <i>There are</i>.</p>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Completá: <b>There ______ three open tickets.</b>',
          respuesta: 'are',
          porQue: '<b>three tickets</b> es plural → <i>are</i>. El verbo concuerda con lo que viene después.',
        },
        {
          tipo: 'hueco',
          p: 'Completá: <b>There ______ some information about this in the wiki.</b>',
          respuesta: 'is',
          porQue: '<b>information</b> es incontable, y los incontables llevan verbo en singular.',
        },
        {
          tipo: 'opcion',
          p: 'Querés decir «hay un bug en producción». ¿Cuál va?',
          opciones: ['It is a bug in production.', 'There is a bug in production.', 'Have a bug in production.', 'There has a bug in production.'],
          correcta: 1,
          porQue: 'Para decir que algo <b>existe</b> va <i>there is</i>.',
          porQueNo: {
            0: 'Significa «<b>eso</b> es un bug en producción», que es otra cosa.',
            2: 'Sin sujeto no hay frase en inglés. Y <i>have</i> no se usa para existencia.',
            3: 'Ese es el calco del «hay» de algunos idiomas romances. En inglés va <i>is</i>.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>¿Hay alguna pregunta?</b>',
          respuesta: 'Are there any questions?',
          respuestas: ['Are there any questions'],
          pista: 'Plural, y en pregunta va any.',
          porQue: 'Es la frase estándar para cerrar una presentación. Fijate en <b>any</b>: en pregunta no va <i>some</i>.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «No hay tests para esto.»',
          respuesta: "There aren't any tests for this",
          porQue: 'Negativo + plural + <b>any</b>. Los tres elementos juntos.',
        },
      ],

      errores: [
        { mito: '<i>There</i> en <i>there is</i> significa «ahí».',
          realidad: 'No significa nada: es un <b>sujeto expletivo</b>, puesto solo porque el inglés exige sujeto. ' +
                    'La prueba: <i>There is a problem <b>there</b></i> es una frase correcta, con dos <i>there</i> ' +
                    'que hacen cosas distintas.' },
        { mito: 'Puedo decir <i>It is a bug in production</i> para «hay un bug en producción».',
          realidad: 'Eso significa «<b>eso</b> es un bug en producción» — estás <b>clasificando algo</b>, no diciendo que existe. ' +
                    'Para existencia va <i>There is</i>. Es un error que cambia el sentido, no solo la forma.' },
        { mito: 'Como los nativos dicen <i>There\'s two bugs</i>, está bien escribirlo así.',
          realidad: 'Es muy frecuente en <b>habla informal</b>, pero en escritura se corrige a <i>There are</i>. ' +
                    'Conviene reconocerlo al escuchar y no reproducirlo en un PR o un mail.' },
      ],

      glosario: [
        { t: 'There is / there are', d: 'La forma de decir «hay». Se elige según lo que venga después: singular o incontable → <i>is</i>; plural → <i>are</i>.' },
        { t: 'Sujeto expletivo', d: 'Un sujeto sin significado, puesto solo porque la gramática lo exige: el <i>there</i> de <i>there is</i>, el <i>it</i> de <i>it\'s raining</i>.' },
        { t: 'Any', d: 'Reemplaza a <i>some</i> en negativo y pregunta: <i>There aren\'t any tests</i>, <i>Are there any questions?</i>' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l2',
      titulo: 'In, on, at para lugares',
      minutos: 9,

      simple: `
        <p>Tres preposiciones para tres formas de pensar un lugar. La idea de fondo es geométrica:</p>

        <div class="analogia">
          <b>in</b> — <b>adentro</b> de algo, un espacio cerrado o un área<br>
          <b>on</b> — <b>sobre</b> una superficie, o pegado a ella<br>
          <b>at</b> — un <b>punto</b>, sin pensar en su forma
        </div>

        <table>
          <tr><th>in</th><th>on</th><th>at</th></tr>
          <tr>
            <td><span class="en" data-say>in the office</span></td>
            <td><span class="en" data-say>on the desk</span></td>
            <td><span class="en" data-say>at the office</span></td>
          </tr>
          <tr>
            <td><span class="en" data-say>in Argentina</span></td>
            <td><span class="en" data-say>on the wall</span></td>
            <td><span class="en" data-say>at home</span></td>
          </tr>
          <tr>
            <td><span class="en" data-say>in the folder</span></td>
            <td><span class="en" data-say>on the second floor</span></td>
            <td><span class="en" data-say>at the door</span></td>
          </tr>
        </table>

        <h4>La diferencia entre <i>in the office</i> y <i>at the office</i></h4>
        <p>Las dos existen y significan cosas levemente distintas:</p>
        <ul>
          <li><b>at the office</b> — estoy en el trabajo, como actividad. Es lo que más se usa.</li>
          <li><b>in the office</b> — estoy físicamente adentro del edificio. Enfatiza el espacio.</li>
        </ul>
        <p>Si dudás, <b>at</b> es la apuesta segura para lugares de actividad:
        <i>at work</i>, <i>at home</i>, <i>at school</i>, <i>at the airport</i>.</p>

        <div class="aviso">
          <b>Y ahora lo que no tiene lógica.</b> Estas son <b>colocaciones fijas</b>: combinaciones que
          el uso consolidó y que hay que memorizar como bloques.<br><br>
          <span class="en" data-say>on a call</span> pero <span class="en" data-say>in a meeting</span><br>
          <span class="en" data-say>on the team</span> pero <span class="en" data-say>in the group</span><br>
          <span class="en" data-say>at home</span> pero <span class="en" data-say>in the house</span><br>
          <span class="en" data-say>on the bus</span> pero <span class="en" data-say>in the car</span>
        </div>
        <p>Buscarles una regla es perder el tiempo. Se aprenden escuchándolas repetidas.</p>

        <h4>Y las que vas a usar en el trabajo</h4>
        <ul>
          <li><span class="en" data-say>It's in the config folder</span></li>
          <li><span class="en" data-say>It's on line 42</span></li>
          <li><span class="en" data-say>I left a comment on the PR</span></li>
          <li><span class="en" data-say>It's in the main branch</span></li>
          <li><span class="en" data-say>She's on my team</span></li>
        </ul>
      `,

      tecnico: `
        <p>El sistema básico es de <b>dimensionalidad</b>:</p>
        <table>
          <tr><th>Preposición</th><th>Concibe el lugar como…</th><th>Ejemplo</th></tr>
          <tr><td>at</td><td>punto (0 dimensiones)</td><td>at the bus stop</td></tr>
          <tr><td>on</td><td>línea o superficie (1-2 dim.)</td><td>on the wall, on the road</td></tr>
          <tr><td>in</td><td>volumen o área cerrada (3 dim.)</td><td>in the box, in Argentina</td></tr>
        </table>

        <p>El mismo lugar puede tomar las tres, según cómo lo estés concibiendo:</p>
        <ul>
          <li><i>at the supermarket</i> — como destino, un punto en tu recorrido</li>
          <li><i>in the supermarket</i> — adentro del edificio</li>
          <li><i>on the supermarket</i> — sobre el techo (raro, pero gramatical)</li>
        </ul>

        <div class="nota-tec">
          <b>El límite del razonamiento.</b> La lógica dimensional explica quizá el 70% de los casos.
          El resto son colocaciones fósiles: <i>on a call</i> viene de la época en que uno estaba
          «sobre la línea» telefónica; <i>on the team</i> es americano y <i>in the team</i> es británico.
          <br><br>
          Intentar deducirlas es de las formas más eficientes de perder tiempo estudiando inglés.
          Se memorizan por bloques y por exposición.
        </div>

        <p><b>Las que aparecen en trabajo remoto</b>, ordenadas por frecuencia:</p>
        <table>
          <tr><th>Bloque</th><th>Significa</th></tr>
          <tr><td>on a call</td><td>en una llamada</td></tr>
          <tr><td>in a meeting</td><td>en una reunión</td></tr>
          <tr><td>on the team</td><td>en el equipo (US)</td></tr>
          <tr><td>at the office</td><td>en la oficina</td></tr>
          <tr><td>on Slack / on Zoom</td><td>en Slack / en Zoom</td></tr>
          <tr><td>in the repo / in the branch</td><td>en el repo / en la rama</td></tr>
          <tr><td>on line 42</td><td>en la línea 42</td></tr>
          <tr><td>on the PR</td><td>en el PR (comentarios)</td></tr>
        </table>

        <p><b>Regla práctica que funciona bastante:</b> las plataformas digitales llevan <b>on</b>
        (<i>on Slack</i>, <i>on GitHub</i>, <i>on LinkedIn</i>), y los contenedores de archivos llevan
        <b>in</b> (<i>in the folder</i>, <i>in the repo</i>).</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="La lógica dimensional de at, on e in">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">La lógica: punto, superficie, volumen</text>

          <g>
            <rect x="34" y="40" width="196" height="130" rx="10" fill="#34d399" opacity="0.09" stroke="#34d399" stroke-width="1.3"/>
            <text x="132" y="64" text-anchor="middle" font-size="19" font-weight="800" fill="#34d399">at</text>
            <circle cx="132" cy="96" r="6" fill="#34d399"/>
            <line x1="96" y1="112" x2="168" y2="112" stroke="currentColor" opacity="0.25" stroke-width="1.5"/>
            <text x="132" y="134" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.8">un punto</text>
            <text x="132" y="154" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">at home · at work</text>
          </g>

          <g>
            <rect x="242" y="40" width="196" height="130" rx="10" fill="#22d3ee" opacity="0.09" stroke="#22d3ee" stroke-width="1.3"/>
            <text x="340" y="64" text-anchor="middle" font-size="19" font-weight="800" fill="#22d3ee">on</text>
            <rect x="304" y="82" width="72" height="10" rx="2" fill="#22d3ee" opacity="0.5"/>
            <line x1="290" y1="98" x2="390" y2="98" stroke="currentColor" opacity="0.3" stroke-width="2"/>
            <text x="340" y="134" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.8">una superficie</text>
            <text x="340" y="154" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">on the desk · on line 42</text>
          </g>

          <g>
            <rect x="450" y="40" width="196" height="130" rx="10" fill="#c084fc" opacity="0.09" stroke="#c084fc" stroke-width="1.3"/>
            <text x="548" y="64" text-anchor="middle" font-size="19" font-weight="800" fill="#c084fc">in</text>
            <rect x="512" y="78" width="72" height="42" rx="5" fill="none" stroke="currentColor" opacity="0.35" stroke-width="1.8"/>
            <circle cx="548" cy="99" r="7" fill="#c084fc" opacity="0.6"/>
            <text x="548" y="134" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.8">adentro de algo</text>
            <text x="548" y="154" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">in the folder · in Argentina</text>
          </g>

          <line x1="34" y1="188" x2="646" y2="188" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="210" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f59e0b">Y el 30% que no sigue ninguna lógica</text>

          <g font-size="12.5" text-anchor="middle">
            <rect x="60" y="222" width="130" height="28" rx="7" fill="#f59e0b" opacity="0.13"/>
            <text x="125" y="241" fill="currentColor" opacity="0.9">on a call</text>

            <rect x="204" y="222" width="140" height="28" rx="7" fill="#f59e0b" opacity="0.13"/>
            <text x="274" y="241" fill="currentColor" opacity="0.9">in a meeting</text>

            <rect x="358" y="222" width="130" height="28" rx="7" fill="#f59e0b" opacity="0.13"/>
            <text x="423" y="241" fill="currentColor" opacity="0.9">on the team</text>

            <rect x="502" y="222" width="118" height="28" rx="7" fill="#f59e0b" opacity="0.13"/>
            <text x="561" y="241" fill="currentColor" opacity="0.9">at home</text>
          </g>

          <text x="340" y="270" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.65">
            Estas se memorizan como bloques. Buscarles regla es perder tiempo.
          </text>
        </svg>`,
        pie: 'La lógica dimensional cubre la mayoría de los casos. El resto son fósiles del uso.',
      },

      escucha: {
        intro: '<p>Las preposiciones son sílabas comprimidas y casi inaudibles. Ese es justamente el ejercicio: ' +
               'reconocerlas cuando apenas suenan.</p>',
        items: [
          { texto: "I'm on a call right now.", es: 'Estoy en una llamada ahora mismo.',
            nota: '<b>on</b> a call. Con <i>meeting</i> sería <i>in</i>. No hay lógica que las una.' },
          { texto: "She's in a meeting until three.", es: 'Ella está en una reunión hasta las tres.',
            nota: 'El par del anterior. Vale la pena decir los dos juntos hasta que suenen naturales.' },
          { texto: "The config is in the root folder.", es: 'La config está en la carpeta raíz.',
            nota: '<b>in</b> para contenedores de archivos: <i>in the folder</i>, <i>in the repo</i>.' },
          { texto: 'I left a comment on line 42.', es: 'Dejé un comentario en la línea 42.',
            nota: '<b>on</b> line, porque una línea es… una línea. Acá la lógica dimensional sí funciona.' },
          { texto: "She's on my team and she works at home.", es: 'Ella está en mi equipo y trabaja en casa.',
            nota: 'Dos bloques fijos seguidos: <b>on the team</b> y <b>at home</b> (sin <i>the</i>).' },
        ],
      },

      practica: `
        <p><b>Los ocho bloques que más vas a usar.</b> Decilos en voz alta, seguidos, tres veces.
        No los analices — memorizalos como una unidad:</p>
        <p><span class="en" data-say>on a call</span> · <span class="en" data-say>in a meeting</span> ·
        <span class="en" data-say>at the office</span> · <span class="en" data-say>at home</span> ·
        <span class="en" data-say>on the team</span> · <span class="en" data-say>on Slack</span> ·
        <span class="en" data-say>in the repo</span> · <span class="en" data-say>on line 42</span></p>

        <p><b>La regla que sí funciona bastante:</b> plataformas digitales van con <b>on</b>
        (<i>on Slack</i>, <i>on GitHub</i>, <i>on Zoom</i>), contenedores de archivos con <b>in</b>
        (<i>in the folder</i>, <i>in the repo</i>, <i>in the branch</i>).</p>

        <p><b>Y si dudás con un lugar físico:</b> <i>at</i> es la apuesta más segura.
        <i>at work</i>, <i>at home</i>, <i>at the airport</i>, <i>at the door</i>.</p>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Completá: <b>Sorry, I\'m ______ a call right now.</b>',
          respuesta: 'on',
          porQue: '<b>on a call</b>. Es bloque fijo — con <i>meeting</i> sería <i>in</i>, sin ningún motivo lógico.',
        },
        {
          tipo: 'hueco',
          p: 'Completá: <b>She\'s ______ a meeting until three.</b>',
          respuesta: 'in',
          porQue: '<b>in a meeting</b>. Es el par del ejercicio anterior, y donde todo el mundo se equivoca.',
        },
        {
          tipo: 'hueco',
          p: 'Completá: <b>The config file is ______ the root folder.</b>',
          respuesta: 'in',
          porQue: '<b>in</b> para contenedores: carpetas, repos, ramas. Acá la lógica de «adentro» sí funciona.',
        },
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: ['I work in home.', 'I work at home.', 'I work on home.', 'I work in the home.'],
          correcta: 1,
          porQue: '<b>at home</b>, sin artículo. Es bloque fijo, igual que <i>at work</i> y <i>at school</i>.',
          porQueNo: {
            0: '<i>in home</i> no existe. Con artículo sí sería posible (<i>in the house</i>), pero significa otra cosa.',
            2: '<i>on</i> no se combina con <i>home</i>.',
            3: 'Gramatical pero raro: enfatiza el edificio, y nadie lo dice para hablar de trabajar.',
          },
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «Dejé un comentario en el PR.»',
          respuesta: 'I left a comment on the PR',
          porQue: '<b>on the PR</b>, como <i>on GitHub</i>. Las plataformas y los documentos digitales llevan <i>on</i>.',
        },
      ],

      errores: [
        { mito: 'Si entiendo la lógica de in/on/at voy a poder deducir todos los casos.',
          realidad: 'La lógica dimensional explica quizá el 70%. El resto son <b>colocaciones fósiles</b>: ' +
                    '<i>on a call</i> pero <i>in a meeting</i>, <i>at home</i> pero <i>in the house</i>. ' +
                    'Intentar deducirlas es una de las formas más eficientes de perder tiempo estudiando inglés.' },
        { mito: 'Como en español digo «en» para todo, puedo elegir cualquiera y se entiende.',
          realidad: 'Se entiende casi siempre, sí. Pero es de lo que <b>más marca el acento gramatical</b>, ' +
                    'porque aparece en cada frase. Y los ocho bloques del trabajo remoto son pocos: ' +
                    'memorizarlos rinde muchísimo.' },
        { mito: '<i>at the office</i> y <i>in the office</i> son lo mismo.',
          realidad: 'Casi. <b>at</b> lo trata como lugar de actividad («estoy en el trabajo») y <b>in</b> enfatiza ' +
                    'estar físicamente adentro del edificio. En la práctica <i>at</i> es mucho más frecuente.' },
      ],

      glosario: [
        { t: 'Colocación', d: 'Una combinación fija de palabras que el uso consolidó: <i>on a call</i>. No se deduce por reglas.' },
        { t: 'at home / at work', d: 'Sin artículo. Son bloques fijos, no se dice ❌ <i>at the home</i>.' },
        { t: 'on the team', d: 'En el equipo. Es la forma estadounidense; en inglés británico se usa <i>in the team</i>.' },
        { t: 'on line 42', d: 'En la línea 42. Los documentos y plataformas digitales llevan <i>on</i>.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l3',
      titulo: 'Las mismas tres, pero para el tiempo',
      minutos: 8,

      simple: `
        <p>Buena noticia: <b>in</b>, <b>on</b> y <b>at</b> también sirven para el tiempo, y acá sí hay
        una regla clara que funciona casi siempre.</p>

        <div class="analogia">
          <b>at</b> → horas y momentos puntuales<br>
          <b>on</b> → días y fechas<br>
          <b>in</b> → meses, años, estaciones y períodos largos
        </div>

        <table>
          <tr><th>at</th><th>on</th><th>in</th></tr>
          <tr>
            <td><span class="en" data-say>at three o'clock</span></td>
            <td><span class="en" data-say>on Monday</span></td>
            <td><span class="en" data-say>in January</span></td>
          </tr>
          <tr>
            <td><span class="en" data-say>at noon</span></td>
            <td><span class="en" data-say>on Friday morning</span></td>
            <td><span class="en" data-say>in 2026</span></td>
          </tr>
          <tr>
            <td><span class="en" data-say>at night</span></td>
            <td><span class="en" data-say>on my birthday</span></td>
            <td><span class="en" data-say>in the morning</span></td>
          </tr>
        </table>

        <p><b>La forma de recordarlo:</b> va de más chico a más grande. Un punto en el reloj es <i>at</i>,
        un día es <i>on</i>, un período largo es <i>in</i>.</p>

        <div class="aviso">
          <b>Las tres excepciones que hay que saber:</b><br><br>
          <span class="en" data-say>at night</span> — no <i>in the night</i><br>
          <span class="en" data-say>at the weekend</span> (UK) / <span class="en" data-say>on the weekend</span> (US)<br>
          <b>Nada</b> antes de <i>today</i>, <i>tomorrow</i>, <i>yesterday</i>, <i>next week</i>, <i>last month</i><br><br>
          ❌ <i>in tomorrow</i> · ✅ <span class="en" data-say>See you tomorrow</span>
        </div>

        <h4>Duración y plazos</h4>
        <ul>
          <li><b>in</b> + tiempo = dentro de: <span class="en" data-say>The meeting starts in ten minutes</span></li>
          <li><b>for</b> + tiempo = durante: <span class="en" data-say>I worked for two hours</span></li>
          <li><b>by</b> = para (fecha límite): <span class="en" data-say>I need it by Friday</span></li>
          <li><b>until</b> = hasta: <span class="en" data-say>I'm busy until three</span></li>
        </ul>

        <div class="aviso">
          <b>La distinción que más importa en el trabajo:</b><br>
          <b>by Friday</b> = el viernes como <b>fecha límite</b>, puede ser antes<br>
          <b>on Friday</b> = el viernes, ese día<br>
          <b>until Friday</b> = hasta el viernes, y ahí termina<br><br>
          Confundir <i>by</i> y <i>until</i> genera malentendidos reales sobre entregas.
        </div>
      `,

      tecnico: `
        <p>La lógica temporal replica la espacial: <b>at</b> para puntos, <b>on</b> para unidades
        delimitadas de un día, <b>in</b> para períodos que contienen.</p>

        <table>
          <tr><th>Preposición</th><th>Se usa con</th><th>Ejemplos</th></tr>
          <tr><td>at</td><td>horas, momentos precisos, festividades</td><td>at 3pm, at noon, at midnight, at Christmas</td></tr>
          <tr><td>on</td><td>días, fechas, días + parte del día</td><td>on Monday, on March 5th, on Friday afternoon</td></tr>
          <tr><td>in</td><td>meses, años, estaciones, siglos, partes del día</td><td>in May, in 2026, in summer, in the morning</td></tr>
        </table>

        <div class="nota-tec">
          <b>El caso interesante: <i>in the morning</i> contra <i>on Monday morning</i>.</b>
          <br><br>
          Cuando la parte del día va sola, se concibe como período → <b>in</b>.
          <br>Cuando se ancla a un día concreto, ese día manda y arrastra su preposición → <b>on</b>.
          <br><br>
          <i>in the morning</i> · <i>on Monday morning</i> · <i>in the afternoon</i> · <i>on Friday afternoon</i>
          <br><br>
          Excepción histórica: <i>at night</i>, que quedó fijado con <i>at</i> aunque debería ser <i>in</i>.
        </div>

        <p><b>Las preposiciones de plazo</b>, que son las que más importan en un contexto de trabajo:</p>
        <table>
          <tr><th>Forma</th><th>Significa</th><th>Ejemplo</th></tr>
          <tr><td>in + duración</td><td>dentro de X tiempo</td><td>in ten minutes</td></tr>
          <tr><td>for + duración</td><td>durante X tiempo</td><td>for two hours</td></tr>
          <tr><td>by + momento</td><td>no más tarde que</td><td>by Friday</td></tr>
          <tr><td>until + momento</td><td>hasta ese momento</td><td>until Friday</td></tr>
          <tr><td>since + momento</td><td>desde ese momento</td><td>since Monday</td></tr>
        </table>

        <p><b>La confusión <i>by</i> / <i>until</i> es la que causa problemas reales.</b>
        <i>I need it by Friday</i> significa «necesito tenerlo el viernes o antes» — es un deadline.
        <i>I need it until Friday</i> significa «lo voy a necesitar hasta el viernes», o sea que después
        te lo devuelvo. Son cosas distintas y las dos aparecen en conversaciones sobre entregas.</p>

        <p><b>Y <i>for</i> contra <i>since</i>:</b> <i>for</i> mide la duración
        (<i>for two years</i>), <i>since</i> marca el punto de inicio (<i>since 2024</i>).
        En español los dos pueden ser «hace», y de ahí la confusión.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="at, on e in ordenados de menor a mayor unidad de tiempo, y las preposiciones de plazo">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">De lo más chico a lo más grande</text>

          <g>
            <rect x="34" y="40" width="196" height="106" rx="10" fill="#34d399" opacity="0.1" stroke="#34d399" stroke-width="1.3"/>
            <text x="132" y="66" text-anchor="middle" font-size="19" font-weight="800" fill="#34d399">at</text>
            <text x="132" y="86" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor" opacity="0.8">horas y momentos</text>
            <text x="132" y="108" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">at 3pm · at noon</text>
            <text x="132" y="128" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">at night</text>
          </g>

          <g>
            <rect x="242" y="40" width="196" height="106" rx="10" fill="#22d3ee" opacity="0.1" stroke="#22d3ee" stroke-width="1.3"/>
            <text x="340" y="66" text-anchor="middle" font-size="19" font-weight="800" fill="#22d3ee">on</text>
            <text x="340" y="86" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor" opacity="0.8">días y fechas</text>
            <text x="340" y="108" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">on Monday</text>
            <text x="340" y="128" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">on March 5th</text>
          </g>

          <g>
            <rect x="450" y="40" width="196" height="106" rx="10" fill="#c084fc" opacity="0.1" stroke="#c084fc" stroke-width="1.3"/>
            <text x="548" y="66" text-anchor="middle" font-size="19" font-weight="800" fill="#c084fc">in</text>
            <text x="548" y="86" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor" opacity="0.8">períodos largos</text>
            <text x="548" y="108" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">in May · in 2026</text>
            <text x="548" y="128" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">in the morning</text>
          </g>

          <line x1="34" y1="164" x2="646" y2="164" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="186" text-anchor="middle" font-size="13" font-weight="700" fill="#f59e0b">Plazos: la que causa problemas de verdad</text>

          <g>
            <line x1="90" y1="228" x2="590" y2="228" stroke="currentColor" opacity="0.25" stroke-width="2"/>
            <circle cx="90" cy="228" r="5" fill="currentColor" opacity="0.5"/>
            <text x="90" y="250" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.6">hoy</text>
            <circle cx="440" cy="228" r="6" fill="#f59e0b"/>
            <text x="440" y="250" text-anchor="middle" font-size="11.5" font-weight="700" fill="#f59e0b">Friday</text>

            <path d="M 90 212 L 440 212" stroke="#34d399" stroke-width="2.5" opacity="0.7"/>
            <text x="265" y="205" text-anchor="middle" font-size="11.5" font-weight="700" fill="#34d399">by Friday = entregalo en algún momento acá</text>

            <path d="M 90 268 L 440 268" stroke="#22d3ee" stroke-width="2.5" opacity="0.7"/>
            <text x="265" y="283" text-anchor="middle" font-size="11.5" font-weight="700" fill="#22d3ee">until Friday = lo tengo/uso hasta acá</text>
          </g>

          <text x="590" y="212" text-anchor="end" font-size="11.5" fill="currentColor" opacity="0.6">confundirlas rompe entregas</text>
        </svg>`,
        pie: 'Arriba, la escala de unidades. Abajo, la distinción entre plazo y duración, que sí genera malentendidos reales.',
      },

      escucha: {
        intro: '<p>Horarios y plazos. Estas son las frases que aparecen cuando alguien coordina algo con vos.</p>',
        items: [
          { texto: 'The meeting is on Monday at three.', es: 'La reunión es el lunes a las tres.',
            nota: 'Los dos juntos: <b>on</b> para el día, <b>at</b> para la hora. Siempre en ese orden.' },
          { texto: 'I need it by Friday.', es: 'Lo necesito para el viernes.',
            nota: '<b>by</b> = fecha límite. Podés entregarlo antes. No confundir con <i>until</i>.' },
          { texto: "I'm busy until three, but I'm free after that.", es: 'Estoy ocupado hasta las tres, pero después estoy libre.',
            nota: '<b>until</b> marca hasta cuándo dura algo. Es la otra mitad del par con <i>by</i>.' },
          { texto: 'The deploy starts in ten minutes.', es: 'El deploy arranca en diez minutos.',
            nota: '<b>in</b> + duración = «dentro de». No es «durante»: eso sería <i>for</i>.' },
          { texto: 'See you tomorrow morning.', es: 'Nos vemos mañana a la mañana.',
            nota: 'Sin preposición: <i>tomorrow</i>, <i>today</i>, <i>yesterday</i> y <i>next week</i> nunca la llevan.' },
        ],
      },

      practica: `
        <p><b>Escribí tu disponibilidad de mañana</b> usando las cuatro preposiciones de plazo:</p>
        <ul>
          <li>I have a meeting <b>at</b> ______.</li>
          <li>I'm busy <b>until</b> ______.</li>
          <li>I can finish it <b>by</b> ______.</li>
          <li>The deploy is <b>on</b> ______.</li>
        </ul>

        <p><b>Y fijate especialmente en esta distinción</b>, porque genera problemas reales de coordinación:</p>
        <div class="analogia">
          <span class="en" data-say>I need it by Friday</span> — el viernes es la <b>fecha límite</b>. Podés darlo antes.<br>
          <span class="en" data-say>I need it until Friday</span> — lo vas a <b>usar hasta</b> el viernes. Después lo devolvés.
        </div>
        <p>Si alguien te dice <i>by Friday</i> y entendés <i>until Friday</i>, vas a entregar tarde.</p>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Completá: <b>The meeting is ______ Monday.</b>',
          respuesta: 'on',
          porQue: '<b>on</b> para días y fechas. Con la hora sería <i>at</i>: <i>on Monday at three</i>.',
        },
        {
          tipo: 'hueco',
          p: 'Completá: <b>I start work ______ nine.</b>',
          respuesta: 'at',
          porQue: '<b>at</b> para horas y momentos puntuales.',
        },
        {
          tipo: 'hueco',
          p: 'Completá: <b>We released it ______ 2026.</b>',
          respuesta: 'in',
          porQue: '<b>in</b> para años, meses y períodos largos.',
        },
        {
          tipo: 'opcion',
          p: 'Tu jefe dice <span class="en" data-say>I need it by Friday</span>. ¿Qué significa?',
          opciones: [
            'Que lo vas a necesitar hasta el viernes y después lo devolvés',
            'Que el viernes es la fecha límite: podés entregarlo antes',
            'Que hay que entregarlo exactamente el viernes, ni antes ni después',
            'Que el trabajo arranca el viernes',
          ],
          correcta: 1,
          porQue: '<b>by</b> marca un plazo máximo. Entregar el miércoles cumple perfectamente.',
          porQueNo: {
            0: 'Eso sería <i>until Friday</i>. Confundirlos es lo que genera entregas tarde.',
            2: '<i>by</i> no exige el día exacto, exige «no más tarde que».',
            3: 'Sería <i>starting on Friday</i>.',
          },
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «La reunión es el lunes a las tres.»',
          respuesta: 'The meeting is on Monday at three',
          porQue: 'Primero el día con <b>on</b>, después la hora con <b>at</b>. Siempre en ese orden.',
        },
      ],

      errores: [
        { mito: '<i>by Friday</i> y <i>until Friday</i> son parecidos.',
          realidad: 'Son cosas distintas y esto <b>genera problemas reales</b>. <i>by Friday</i> es una fecha límite ' +
                    '(entregá el viernes o antes). <i>until Friday</i> significa que algo dura hasta el viernes. ' +
                    'Si te piden algo <i>by Friday</i> y entendés <i>until</i>, entregás tarde.' },
        { mito: 'Antes de <i>tomorrow</i> o <i>next week</i> va alguna preposición.',
          realidad: 'No va ninguna. ❌ <i>in tomorrow</i>, ❌ <i>on next week</i>. Son <b>See you tomorrow</b> ' +
                    'y <b>next week</b> a secas. Lo mismo con <i>today</i>, <i>yesterday</i>, <i>last month</i>.' },
        { mito: 'Si es de noche va <i>in the night</i>, como <i>in the morning</i>.',
          realidad: 'Es <b>at night</b>. Es una excepción histórica: quedó fijada con <i>at</i> aunque la lógica ' +
                    'diría <i>in</i>. <i>in the morning</i>, <i>in the afternoon</i>, <i>in the evening</i>… pero ' +
                    '<i>at night</i>.' },
      ],

      glosario: [
        { t: 'by', d: 'Fecha límite: no más tarde que. <i>I need it by Friday</i> = el viernes o antes.' },
        { t: 'until', d: 'Hasta ese momento. <i>I\'m busy until three</i> = después de las tres estoy libre.' },
        { t: 'for / since', d: '<i>for</i> mide duración (<i>for two years</i>); <i>since</i> marca el inicio (<i>since 2024</i>). En español los dos pueden ser «hace».' },
        { t: 'at night', d: 'Excepción fijada por el uso. Todas las demás partes del día llevan <i>in the</i>.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l4',
      titulo: 'Describir tu espacio y encontrar cosas',
      minutos: 8,

      simple: `
        <p>Juntamos todo: decir qué hay, dónde está, y pedirle a alguien que encuentre algo.
        Es exactamente lo que hacés cuando alguien te pregunta dónde está un archivo o cómo es tu setup.</p>

        <h4>Preposiciones de posición</h4>
        <table>
          <tr><th>Palabra</th><th>Español</th><th>Ejemplo</th></tr>
          <tr><td>next to</td><td>al lado de</td><td>next to the window</td></tr>
          <tr><td>behind</td><td>detrás de</td><td>behind the door</td></tr>
          <tr><td>in front of</td><td>delante de</td><td>in front of my desk</td></tr>
          <tr><td>between</td><td>entre (dos)</td><td>between the two files</td></tr>
          <tr><td>under</td><td>debajo de</td><td>under the table</td></tr>
          <tr><td>above / below</td><td>arriba / abajo de</td><td>below line 20</td></tr>
          <tr><td>inside / outside</td><td>adentro / afuera de</td><td>inside the function</td></tr>
        </table>

        <div class="aviso">
          <b>Ojo con <i>in front of</i>.</b> No es «enfrente de» en el sentido de «del otro lado».
          Eso es <b>across from</b> u <b>opposite</b>.<br><br>
          <span class="en" data-say>The chair is in front of the desk</span> — la silla está delante del escritorio<br>
          <span class="en" data-say>The bank is across from the office</span> — el banco está enfrente de la oficina
        </div>

        <h4>Describir tu setup</h4>
        <p><span class="en" data-say>There is a laptop on my desk. There are two monitors behind it. My headphones are next to the keyboard. There is a window in front of me.</span></p>

        <h4>Encontrar cosas en un proyecto</h4>
        <p>Esto es lo que más vas a usar:</p>
        <ul>
          <li><span class="en" data-say>Where is the config file?</span></li>
          <li><span class="en" data-say>It's in the root folder.</span></li>
          <li><span class="en" data-say>The function is on line 42.</span></li>
          <li><span class="en" data-say>It's inside the utils folder.</span></li>
          <li><span class="en" data-say>Look at the second file from the top.</span></li>
          <li><span class="en" data-say>It's right below the imports.</span></li>
        </ul>

        <p><b><i>right</i> como intensificador</b> es utilísimo: <i>right below</i>, <i>right after</i>,
        <i>right here</i>, <i>right there</i>. Significa «justo».</p>
      `,

      tecnico: `
        <p><b>Preposiciones simples y compuestas.</b> El inglés forma muchas locuciones prepositivas con
        varias palabras — <i>in front of</i>, <i>next to</i>, <i>across from</i> — y es importante no
        partirlas ni traducir sus piezas por separado.</p>

        <table>
          <tr><th>Inglés</th><th>Español</th><th>Error típico</th></tr>
          <tr><td>in front of</td><td>delante de</td><td>❌ <i>in front the desk</i> (falta <i>of</i>)</td></tr>
          <tr><td>across from</td><td>enfrente de</td><td>❌ <i>in front of</i> usado para esto</td></tr>
          <tr><td>next to</td><td>al lado de</td><td>❌ <i>at the side of</i></td></tr>
          <tr><td>between</td><td>entre (dos)</td><td>❌ usado con más de dos</td></tr>
          <tr><td>among</td><td>entre (varios)</td><td>—</td></tr>
        </table>

        <div class="nota-tec">
          <b><i>between</i> contra <i>among</i>.</b> <i>between</i> es para dos elementos identificables
          —o para relaciones uno a uno dentro de un grupo—, <i>among</i> para una masa indiferenciada.
          <br><br>
          <i>The bug is between these two commits.</i>
          <br><i>This pattern is common among senior developers.</i>
        </div>

        <p><b>El vocabulario de ubicación en código</b>, que es donde más lo vas a usar:</p>
        <ul>
          <li><i>on line 42</i> — en la línea 42</li>
          <li><i>above / below the imports</i> — arriba / abajo de los imports</li>
          <li><i>inside the function</i> — dentro de la función</li>
          <li><i>at the top / at the bottom of the file</i> — al principio / al final del archivo</li>
          <li><i>in the same file</i> — en el mismo archivo</li>
          <li><i>right after the auth check</i> — justo después del chequeo de auth</li>
        </ul>

        <p><b><i>right</i> como intensificador de posición.</b> No tiene nada que ver con «derecha»
        ni con «correcto»: significa «exactamente, justo». <i>right here</i>, <i>right below</i>,
        <i>right after</i>. Es muy frecuente en explicaciones técnicas y suena natural apenas
        empezás a usarlo.</p>

        <p><b>Sobre preguntar por ubicación.</b> <i>Where is…?</i> es lo neutro. En un contexto de
        código también se dice mucho <i>Where does this come from?</i> (¿de dónde sale esto?) y
        <i>Where is this used?</i> (¿dónde se usa esto?), que son las dos preguntas más frecuentes
        cuando leés código ajeno.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Preposiciones de posición aplicadas a un escritorio y a un archivo de código">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Las mismas palabras, en el escritorio y en el código</text>

          <rect x="34" y="38" width="300" height="230" rx="10" fill="currentColor" opacity="0.04" stroke="currentColor" stroke-opacity="0.15"/>
          <text x="184" y="60" text-anchor="middle" font-size="12.5" font-weight="700" fill="#22d3ee">EN EL ESCRITORIO</text>

          <rect x="70" y="150" width="228" height="12" rx="3" fill="currentColor" opacity="0.28"/>
          <text x="184" y="176" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">desk</text>

          <rect x="126" y="120" width="60" height="28" rx="4" fill="#22d3ee" opacity="0.55"/>
          <text x="156" y="139" text-anchor="middle" font-size="10" fill="#0c0e13" font-weight="700">laptop</text>
          <text x="156" y="112" text-anchor="middle" font-size="11" fill="#22d3ee">on the desk</text>

          <rect x="204" y="126" width="44" height="22" rx="3" fill="#c084fc" opacity="0.5"/>
          <text x="226" y="141" text-anchor="middle" font-size="9" fill="#0c0e13" font-weight="700">phone</text>
          <text x="252" y="120" font-size="11" fill="#c084fc">next to</text>

          <rect x="132" y="190" width="48" height="20" rx="3" fill="#fbbf24" opacity="0.5"/>
          <text x="156" y="204" text-anchor="middle" font-size="9" fill="#0c0e13" font-weight="700">bag</text>
          <text x="192" y="204" font-size="11" fill="#fbbf24">under the desk</text>

          <rect x="96" y="76" width="128" height="30" rx="4" fill="none" stroke="#34d399" stroke-width="1.5" opacity="0.7"/>
          <text x="160" y="96" text-anchor="middle" font-size="10.5" fill="#34d399">window · behind</text>

          <rect x="350" y="38" width="296" height="230" rx="10" fill="currentColor" opacity="0.04" stroke="currentColor" stroke-opacity="0.15"/>
          <text x="498" y="60" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f59e0b">EN EL CÓDIGO</text>

          <g font-size="11.5" font-family="monospace">
            <text x="372" y="88" fill="currentColor" opacity="0.4">1</text>
            <text x="394" y="88" fill="currentColor" opacity="0.7">import { db } ...</text>
            <text x="372" y="108" fill="currentColor" opacity="0.4">2</text>
            <text x="394" y="108" fill="currentColor" opacity="0.7">import { auth } ...</text>

            <text x="372" y="134" fill="currentColor" opacity="0.4">4</text>
            <text x="394" y="134" fill="#34d399" opacity="0.9">function login() {</text>
            <text x="372" y="154" fill="currentColor" opacity="0.4">5</text>
            <text x="394" y="154" fill="currentColor" opacity="0.7">  checkAuth()</text>
            <text x="372" y="174" fill="currentColor" opacity="0.4">6</text>
            <text x="394" y="174" fill="#f87171" opacity="0.9">  // el bug</text>
            <text x="372" y="194" fill="currentColor" opacity="0.4">7</text>
            <text x="394" y="194" fill="currentColor" opacity="0.7">{'}'}</text>
          </g>

          <line x1="368" y1="118" x2="620" y2="118" stroke="#c084fc" opacity="0.4" stroke-dasharray="3 3"/>
          <text x="624" y="122" text-anchor="end" font-size="10.5" fill="#c084fc">below the imports</text>

          <line x1="368" y1="180" x2="620" y2="180" stroke="#f87171" opacity="0.4" stroke-dasharray="3 3"/>
          <text x="624" y="196" text-anchor="end" font-size="10.5" fill="#f87171">right after checkAuth</text>

          <text x="498" y="228" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.75">on line 6 · inside the function</text>
          <text x="498" y="248" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.75">at the top of the file</text>

          <text x="340" y="290" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.65">
            "right" significa «justo»: right below · right after · right here
          </text>
        </svg>`,
        pie: 'Las preposiciones de posición no cambian: describen igual un escritorio que un archivo.',
      },

      escucha: {
        intro: '<p>Ubicar cosas en un proyecto. Son las frases que más vas a escuchar cuando alguien ' +
               'te explica dónde está algo.</p>',
        items: [
          { texto: 'The config file is in the root folder.', es: 'El archivo de config está en la carpeta raíz.',
            nota: '<b>in</b> para carpetas. La respuesta más común a «¿dónde está X?».' },
          { texto: "It's on line 42, right after the auth check.", es: 'Está en la línea 42, justo después del chequeo de auth.',
            nota: '<b>right after</b> = justo después. <i>right</i> acá significa «exactamente», nada de «derecha».' },
          { texto: 'My headphones are next to the keyboard.', es: 'Mis auriculares están al lado del teclado.',
            nota: '<b>next to</b> es una sola pieza: no se parte ni se cambia.' },
          { texto: 'The function is at the bottom of the file.', es: 'La función está al final del archivo.',
            nota: '<b>at the top / at the bottom</b> para principio y final de un archivo.' },
          { texto: 'The bug is somewhere between these two commits.', es: 'El bug está en algún lado entre estos dos commits.',
            nota: '<b>between</b> porque son dos identificables. Con muchos indiferenciados iría <i>among</i>.' },
        ],
      },

      practica: `
        <p><b>Describí tu escritorio en cinco frases</b>, en voz alta, usando <i>there is/are</i> y
        preposiciones de posición. Es un ejercicio tonto y funciona: te obliga a producir estructura
        completa sin tener que pensar el contenido.</p>

        <p><b>Después hacé lo mismo con un archivo de código tuyo:</b></p>
        <ul>
          <li>There are ______ imports at the top.</li>
          <li>The main function is on line ______.</li>
          <li>The helper is right below ______.</li>
          <li>The types are in a separate file, inside ______.</li>
        </ul>

        <p><b>Y las tres preguntas que más vas a hacer leyendo código ajeno:</b></p>
        <ul>
          <li><span class="en" data-say>Where is this defined?</span></li>
          <li><span class="en" data-say>Where does this come from?</span></li>
          <li><span class="en" data-say>Where is this used?</span></li>
        </ul>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Completá: <b>My headphones are ______ to the keyboard.</b> (al lado)',
          respuesta: 'next',
          porQue: '<b>next to</b> es una locución de dos palabras: no se parte ni se cambia por <i>at the side of</i>.',
        },
        {
          tipo: 'opcion',
          p: 'El banco está del otro lado de la calle, frente a tu oficina. ¿Cómo se dice?',
          opciones: [
            'The bank is in front of the office.',
            'The bank is across from the office.',
            'The bank is front the office.',
            'The bank is in the front of office.',
          ],
          correcta: 1,
          porQue: '<b>across from</b> (o <i>opposite</i>) es «enfrente», del otro lado. <i>in front of</i> es «delante de», sin cruzar nada.',
          porQueNo: {
            0: 'Significaría que el banco está delante del edificio, en la misma vereda.',
            2: 'Le falta la preposición: <i>in front of</i> va completa.',
            3: 'Mal armada: <i>in front of</i> no se parte así.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Está en la línea 42.</b>',
          respuesta: "It's on line 42",
          respuestas: ['It is on line 42'],
          pista: 'Una línea es una línea: superficie.',
          porQue: '<b>on line</b>, no <i>in line</i>. (Ojo: <i>in line</i> significa «en la fila».)',
        },
        {
          tipo: 'dictado',
          p: 'Escuchá y escribí. Es cómo alguien te indica dónde está algo.',
          respuesta: 'The config file is in the root folder',
          porQue: '<b>in</b> para carpetas. Es la respuesta más frecuente a «¿dónde está X?».',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «Hay dos monitores en mi escritorio.»',
          respuesta: 'There are two monitors on my desk',
          porQue: 'Plural → <b>there are</b>. Y <b>on</b> el escritorio, porque es una superficie.',
        },
      ],

      errores: [
        { mito: '<i>in front of</i> significa «enfrente de», del otro lado.',
          realidad: 'Significa <b>delante de</b>, en la misma dirección. Para «del otro lado» va ' +
                    '<b>across from</b> u <b>opposite</b>. <i>The chair is in front of the desk</i> ' +
                    '(la silla está delante) contra <i>The bank is across from the office</i> (cruzando la calle).' },
        { mito: '<i>right</i> en <i>right below</i> tiene que ver con «derecha».',
          realidad: 'Nada que ver. Acá significa <b>«justo, exactamente»</b>: <i>right below</i> = justo abajo, ' +
                    '<i>right after</i> = justo después, <i>right here</i> = justo acá. Es muy frecuente ' +
                    'en explicaciones técnicas.' },
        { mito: '<i>between</i> sirve para cualquier cantidad de cosas.',
          realidad: 'Es para <b>dos</b> elementos identificables, o para relaciones uno a uno. Para una masa ' +
                    'indiferenciada va <b>among</b>: <i>between these two commits</i> pero ' +
                    '<i>among senior developers</i>.' },
      ],

      glosario: [
        { t: 'next to', d: 'Al lado de. Locución de dos palabras que no se parte.' },
        { t: 'across from / opposite', d: 'Enfrente de, del otro lado. No confundir con <i>in front of</i>, que es «delante de».' },
        { t: 'right', d: 'Como intensificador de posición significa «justo»: <i>right below</i>, <i>right after</i>, <i>right here</i>.' },
        { t: 'at the top / at the bottom', d: 'Al principio / al final de un archivo o una lista.' },
        { t: 'between / among', d: '<i>between</i> para dos identificables, <i>among</i> para un grupo indiferenciado.' },
      ],
    },
  ],

  /* ==================================================================== */
  vocabulario: [
    { en: 'there is', es: 'hay (singular)', ejemplo: 'There is a bug in production.', ejemploEs: 'Hay un bug en producción.' },
    { en: 'there are', es: 'hay (plural)', ejemplo: 'There are three open tickets.', ejemploEs: 'Hay tres tickets abiertos.' },
    { en: 'in', es: 'en / dentro de', pista: 'Volumen o área cerrada.', ejemplo: 'The config is in the root folder.', ejemploEs: 'La config está en la carpeta raíz.' },
    { en: 'on', es: 'sobre / en', pista: 'Superficie o plataforma digital.', ejemplo: 'I left a comment on the PR.', ejemploEs: 'Dejé un comentario en el PR.' },
    { en: 'at', es: 'en (punto)', pista: 'Un punto: lugar de actividad u hora.', ejemplo: 'I work at home.', ejemploEs: 'Trabajo en casa.' },
    { en: 'next to', es: 'al lado de', ejemplo: 'My headphones are next to the keyboard.', ejemploEs: 'Mis auriculares están al lado del teclado.' },
    { en: 'behind', es: 'detrás de', ejemplo: 'The monitors are behind the laptop.', ejemploEs: 'Los monitores están detrás de la laptop.' },
    { en: 'in front of', es: 'delante de', pista: 'No es «enfrente»: eso es across from.', ejemplo: 'There is a window in front of me.', ejemploEs: 'Hay una ventana delante mío.' },
    { en: 'across from', es: 'enfrente de', pista: 'Del otro lado.', ejemplo: 'The bank is across from the office.', ejemploEs: 'El banco está enfrente de la oficina.' },
    { en: 'between', es: 'entre (dos)', ejemplo: 'The bug is between these two commits.', ejemploEs: 'El bug está entre estos dos commits.' },
    { en: 'under', es: 'debajo de', ejemplo: 'My bag is under the desk.', ejemploEs: 'Mi mochila está debajo del escritorio.' },
    { en: 'above', es: 'arriba de', ejemplo: 'The types are above the imports.', ejemploEs: 'Los tipos están arriba de los imports.' },
    { en: 'below', es: 'abajo de', ejemplo: 'It is right below the imports.', ejemploEs: 'Está justo abajo de los imports.' },
    { en: 'inside', es: 'dentro de', ejemplo: 'It is inside the utils folder.', ejemploEs: 'Está dentro de la carpeta utils.' },
    { en: 'right', es: 'justo / exactamente', pista: 'right after, right below, right here.', ejemplo: 'It is right after the auth check.', ejemploEs: 'Está justo después del chequeo de auth.' },
    { en: 'by', es: 'para (fecha límite)', pista: 'No confundir con until.', ejemplo: 'I need it by Friday.', ejemploEs: 'Lo necesito para el viernes.' },
    { en: 'until', es: 'hasta', ejemplo: 'I am busy until three.', ejemploEs: 'Estoy ocupado hasta las tres.' },
    { en: 'for', es: 'durante', pista: 'Mide duración.', ejemplo: 'I worked for two hours.', ejemploEs: 'Trabajé durante dos horas.' },
    { en: 'since', es: 'desde', pista: 'Marca el punto de inicio.', ejemplo: 'I have been here since Monday.', ejemploEs: 'Estoy acá desde el lunes.' },
    { en: 'folder', es: 'carpeta', ejemplo: 'It is in the config folder.', ejemploEs: 'Está en la carpeta de config.' },
    { en: 'window', es: 'ventana', ejemplo: 'There is a window behind me.', ejemploEs: 'Hay una ventana detrás mío.' },
    { en: 'floor', es: 'piso', ejemplo: 'The office is on the second floor.', ejemploEs: 'La oficina está en el segundo piso.' },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: 'Querés decir «hay tres bugs abiertos». ¿Cuál va?',
      opciones: ['There is three open bugs.', 'There are three open bugs.', 'It are three open bugs.', 'Have three open bugs.'],
      correcta: 1,
      porQue: 'El verbo concuerda con lo que viene <b>después</b>: <i>three bugs</i> es plural → <i>are</i>.',
      porQueNo: {
        0: 'Se escucha muchísimo en habla informal, pero en escritura se corrige a <i>are</i>.',
        2: '<i>it</i> no funciona acá: la construcción de existencia usa <i>there</i>.',
        3: 'Sin sujeto no hay frase en inglés, y <i>have</i> no expresa existencia.',
      },
    },
    {
      p: '¿Qué es el <i>there</i> de <i>There is a bug</i>?',
      opciones: [
        'Un adverbio que significa «ahí»',
        'Un sujeto expletivo: no significa nada, está porque el inglés exige sujeto',
        'Una forma abreviada de «they are»',
        'Una preposición de lugar',
      ],
      correcta: 1,
      porQue: 'La prueba es que se puede combinar con un <i>there</i> locativo real: <i>There is a problem there</i> es correcta y no redundante.',
      porQueNo: {
        0: 'Ese es el otro <i>there</i>, el que sí señala un lugar.',
        2: 'Eso es <i>they\'re</i>, que suena igual pero es otra cosa.',
        3: 'No introduce ningún complemento de lugar.',
      },
    },
    {
      p: '¿Cuál es correcta?',
      opciones: ["I'm in a call.", "I'm on a call.", "I'm at a call.", "I'm into a call."],
      correcta: 1,
      porQue: '<b>on a call</b>. Es colocación fija — y con <i>meeting</i> es al revés: <i>in a meeting</i>.',
      porQueNo: {
        0: 'Ese es el par confuso: <i>in</i> va con <i>meeting</i>, no con <i>call</i>.',
        2: '<i>at</i> no se combina con <i>call</i>.',
        3: '<i>into</i> indica movimiento hacia adentro.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: ['I work in home.', 'I work at home.', 'I work at the home.', 'I work on home.'],
      correcta: 1,
      porQue: '<b>at home</b>, sin artículo. Bloque fijo, igual que <i>at work</i> y <i>at school</i>.',
      porQueNo: {
        0: 'No existe esa combinación.',
        2: 'El artículo sobra: son expresiones fijas sin él.',
        3: '<i>on</i> no va con <i>home</i>.',
      },
    },
    {
      p: 'La reunión es el lunes a las tres. ¿Cómo se dice?',
      opciones: [
        'The meeting is in Monday on three.',
        'The meeting is at Monday in three.',
        'The meeting is on Monday at three.',
        'The meeting is on Monday on three.',
      ],
      correcta: 2,
      porQue: '<b>on</b> para el día y <b>at</b> para la hora. La escala va de lo más chico (at) a lo más grande (in).',
      porQueNo: {
        0: 'Las dos invertidas.',
        1: 'Las dos invertidas también.',
        3: 'El día está bien, la hora no: las horas llevan <i>at</i>.',
      },
    },
    {
      p: 'Tu jefe dice <i>I need it by Friday</i>. ¿Qué significa exactamente?',
      opciones: [
        'Que lo va a usar hasta el viernes',
        'Que el viernes es la fecha límite y podés entregarlo antes',
        'Que hay que entregarlo el viernes exacto',
        'Que empieza a necesitarlo el viernes',
      ],
      correcta: 1,
      porQue: '<b>by</b> marca un plazo máximo. Entregarlo el miércoles cumple igual.',
      porQueNo: {
        0: 'Eso sería <i>until Friday</i>. Confundirlos genera entregas tarde.',
        2: '<i>by</i> no exige el día exacto: exige «no más tarde que».',
        3: 'Sería <i>starting on Friday</i>.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: ['See you in tomorrow.', 'See you on tomorrow.', 'See you at tomorrow.', 'See you tomorrow.'],
      correcta: 3,
      porQue: '<i>tomorrow</i>, <i>today</i>, <i>yesterday</i>, <i>next week</i> y <i>last month</i> <b>no llevan preposición</b>.',
      porQueNo: {
        0: 'Sobra la preposición.',
        1: 'Sobra igual.',
        2: 'Sobra igual.',
      },
    },
    {
      p: '¿Por qué se dice <i>at night</i> y no <i>in the night</i>?',
      opciones: [
        'Porque la noche es un momento puntual',
        'Es una excepción histórica: quedó fijada con at aunque las demás partes del día llevan in the',
        'Porque es incontable',
        'Porque en inglés británico es distinto',
      ],
      correcta: 1,
      porQue: '<i>in the morning</i>, <i>in the afternoon</i>, <i>in the evening</i>… pero <b>at night</b>. Es un fósil del uso.',
      porQueNo: {
        0: 'La noche dura tanto como la mañana; la lógica diría <i>in</i>.',
        2: 'La contabilidad no interviene acá.',
        3: 'Es igual en las dos variedades.',
      },
    },
    {
      p: '¿Qué significa <i>in front of</i>?',
      opciones: ['Enfrente de, del otro lado', 'Delante de, en la misma dirección', 'Detrás de', 'Al lado de'],
      correcta: 1,
      porQue: 'Para «enfrente, del otro lado» va <b>across from</b> u <b>opposite</b>. Es un falso amigo estructural muy frecuente.',
      porQueNo: {
        0: 'Eso es <i>across from</i>.',
        2: 'Eso es <i>behind</i>.',
        3: 'Eso es <i>next to</i>.',
      },
    },
    {
      p: 'En <i>It\'s right below the imports</i>, ¿qué significa <i>right</i>?',
      opciones: ['A la derecha', 'Correcto', 'Justo, exactamente', 'Directamente hacia'],
      correcta: 2,
      porQue: '<b>right</b> como intensificador de posición significa «justo»: <i>right below</i>, <i>right after</i>, <i>right here</i>.',
      porQueNo: {
        0: 'Ese es otro uso de la misma palabra, pero no este.',
        1: 'También existe (<i>you\'re right</i>), pero no en esta construcción.',
        3: 'No tiene valor de dirección acá.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: ["It's in line 42.", "It's on line 42.", "It's at line 42.", "It's over line 42."],
      correcta: 1,
      porQue: '<b>on line 42</b>: una línea es una línea, o sea una superficie. (Ojo: <i>in line</i> significa «en la fila».)',
      porQueNo: {
        0: '<i>in line</i> es «haciendo fila».',
        2: '<i>at</i> no se usa para líneas de código.',
        3: 'No es una combinación usada.',
      },
    },
    {
      p: '¿Cuándo va <i>between</i> y cuándo <i>among</i>?',
      opciones: [
        'between para muchos, among para dos',
        'between para dos identificables, among para un grupo indiferenciado',
        'son intercambiables',
        'between para personas, among para cosas',
      ],
      correcta: 1,
      porQue: '<i>between these two commits</i> contra <i>among senior developers</i>.',
      porQueNo: {
        0: 'Está invertido.',
        2: 'No lo son: mezclarlos suena mal.',
        3: 'La distinción no es de animacidad.',
      },
    },
  ],
});
