/* ==========================================================================
   Inglés A1 · m00 — Cómo suena el inglés
   El módulo que ninguna academia da primero, y que evita fosilizar una
   pronunciación mala que después cuesta el triple sacarse.
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ingles-a1',
  id: 'm00',
  titulo: 'Cómo suena el inglés',
  fuentes: ['cambridge-dic', 'bbc-learning-english', 'youglish', 'cefr'],

  intro:
    '<p>Casi todo el mundo arranca inglés por el verbo <i>to be</i>. Este track arranca por el <b>sonido</b>, ' +
    'y no es capricho.</p>' +
    '<p>Si empezás a hablar antes de saber cómo suena el idioma, tu cerebro rellena los huecos con los sonidos ' +
    'del español. Eso funciona al principio — te entienden igual — pero al año esa pronunciación ya está ' +
    '<b>fosilizada</b>: automatizada, difícil de corregir. Sacarse un acento fosilizado cuesta mucho más que ' +
    'aprenderlo bien de entrada.</p>' +
    '<p>Son cuatro lecciones. No hay que memorizar nada acá: hay que <b>escuchar</b>.</p>',

  lecciones: [

    /* ==================================================================== */
    {
      id: 'l1',
      titulo: 'Por qué no se lee como se escribe',
      minutos: 8,

      simple: `
        <p>En español, si ves una palabra, sabés cómo suena. <b>Casa</b> se lee "casa". Siempre. Sin excepciones
        que valgan la pena. Esa relación uno a uno entre letra y sonido es una comodidad que en inglés
        <b>no existe</b>.</p>

        <p>Mirá estas cinco palabras. Todas tienen las mismas cuatro letras en el medio — <b>ough</b> — y las
        cinco suenan distinto:</p>

        <div class="analogia">
          <b>through</b> <span class="en" data-say>through</span> suena "zru"<br>
          <b>though</b> <span class="en" data-say>though</span> suena "dou"<br>
          <b>tough</b> <span class="en" data-say>tough</span> suena "taf"<br>
          <b>cough</b> <span class="en" data-say>cough</span> suena "cof"<br>
          <b>thought</b> <span class="en" data-say>thought</span> suena "zot"
        </div>

        <p>No hay regla que las junte. Son cinco casos que se aprenden de a uno.</p>

        <p><b>Y esto qué significa para vos.</b> Que la palabra escrita <b>no te dice cómo se pronuncia</b>.
        Por eso, cada vez que aprendas una palabra nueva, tenés que aprender <b>dos cosas a la vez</b>:
        cómo se escribe y cómo suena. Aprender solo lo escrito es la razón número uno por la que alguien
        lee inglés perfecto y no le entiende una palabra a un nativo.</p>

        <p><b>La buena noticia:</b> es cuestión de exposición, no de inteligencia. Cuantas más palabras
        escuches, más te va a sonar natural. Por eso todas las frases de este track se pueden escuchar
        tocándolas.</p>
      `,

      tecnico: `
        <p>El inglés tiene una <b>ortografía opaca</b> (o profunda): la correspondencia entre grafema y fonema
        es irregular. El español tiene ortografía <b>transparente</b> — casi biunívoca.</p>

        <p>El motivo es histórico. La ortografía inglesa se fijó con la imprenta, alrededor del siglo XV, y quedó
        congelada justo cuando el idioma estaba atravesando el <b>Gran Desplazamiento Vocálico</b>
        (<i>Great Vowel Shift</i>): un cambio masivo en cómo se pronunciaban las vocales largas, que se extendió
        durante siglos. Resultado: <b>la escritura registra una pronunciación que ya no existe</b>.</p>

        <p>A eso se le suma que el inglés absorbió vocabulario de todas partes conservando la grafía original:
        del francés normando (<i>ballet</i>, <i>rendezvous</i>), del latín (<i>debt</i> — la <i>b</i> se le
        agregó por etimología, nunca se pronunció), del griego (<i>psychology</i>), del nórdico antiguo.</p>

        <p><b>Números concretos:</b> el inglés tiene 26 letras para representar unos <b>44 fonemas</b>. El español
        tiene 27 letras para unos 24. Esa asimetría es la fuente de todo el problema.</p>

        <div class="nota-tec">
          <b>Consecuencia práctica.</b> Como la escritura no es confiable, existe una notación que sí lo es:
          el <b>Alfabeto Fonético Internacional</b> (AFI, o IPA en inglés). Es lo que aparece entre barras en
          cualquier diccionario: <i>through</i> /θruː/. No hace falta aprenderlo de memoria, pero conviene
          reconocer un puñado de símbolos — sobre todo /ə/, /ɪ/, /iː/ y /θ/, que son los que separan a un
          hispanohablante que se hace entender de uno que no.
        </div>

        <p>Por eso la recomendación operativa: <b>buscá toda palabra nueva en un diccionario que tenga audio</b>.
        Cambridge y Merriam-Webster lo tienen, gratis, con versión británica y estadounidense.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Las mismas letras -ough- con cinco sonidos distintos">
          <text x="340" y="24" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Las mismas 4 letras · 5 sonidos distintos</text>

          <rect x="278" y="42" width="124" height="34" rx="8" fill="#f59e0b" opacity="0.18" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="340" y="64" text-anchor="middle" font-size="17" font-weight="800" fill="#f59e0b">ough</text>

          <line x1="300" y1="76" x2="90"  y2="118" stroke="currentColor" opacity="0.3" stroke-width="1.4"/>
          <line x1="320" y1="76" x2="215" y2="118" stroke="currentColor" opacity="0.3" stroke-width="1.4"/>
          <line x1="340" y1="76" x2="340" y2="118" stroke="currentColor" opacity="0.3" stroke-width="1.4"/>
          <line x1="360" y1="76" x2="465" y2="118" stroke="currentColor" opacity="0.3" stroke-width="1.4"/>
          <line x1="380" y1="76" x2="590" y2="118" stroke="currentColor" opacity="0.3" stroke-width="1.4"/>

          <g font-size="14" font-weight="700" text-anchor="middle">
            <text x="90"  y="136" fill="#34d399">through</text>
            <text x="215" y="136" fill="#22d3ee">though</text>
            <text x="340" y="136" fill="#c084fc">tough</text>
            <text x="465" y="136" fill="#f87171">cough</text>
            <text x="590" y="136" fill="#fbbf24">thought</text>
          </g>

          <g font-size="12.5" text-anchor="middle" fill="currentColor" opacity="0.72">
            <text x="90"  y="158">"zru"</text>
            <text x="215" y="158">"dou"</text>
            <text x="340" y="158">"taf"</text>
            <text x="465" y="158">"cof"</text>
            <text x="590" y="158">"zot"</text>
          </g>

          <g font-size="11.5" text-anchor="middle" fill="currentColor" opacity="0.5">
            <text x="90"  y="176">a través de</text>
            <text x="215" y="176">aunque</text>
            <text x="340" y="176">duro</text>
            <text x="465" y="176">toser</text>
            <text x="590" y="176">pensamiento</text>
          </g>

          <line x1="40" y1="198" x2="640" y2="198" stroke="currentColor" opacity="0.15" stroke-width="1"/>
          <text x="340" y="222" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.65">
            En español esto no pasa nunca: "casa", "cosa" y "cesa" cambian de letra Y de sonido, juntos.
          </text>
          <text x="340" y="240" text-anchor="middle" font-size="12.5" font-weight="600" fill="#f59e0b">
            Moraleja: aprendé cada palabra escuchándola, no leyéndola.
          </text>
        </svg>`,
        pie: 'Cinco palabras con "ough" y cinco pronunciaciones sin relación entre sí.',
        nota: '<p>Este diagrama no es una curiosidad: es <b>el motivo</b> por el que este track pone un botón de audio en cada frase. ' +
              'Si leés sin escuchar, estás inventando la pronunciación.</p>',
      },

      escucha: {
        intro: '<p>Escuchá cada frase y escribí lo que oíste. No busques entender todo — buscá <b>separar las palabras</b>. ' +
               'Al principio el inglés suena como una sola cosa larga; distinguir dónde termina una palabra y empieza otra ' +
               'ya es la mitad del trabajo.</p>',
        items: [
          { texto: 'I thought it was tough.', es: 'Pensé que era difícil.',
            nota: '<b>thought</b> y <b>tough</b> se escriben casi igual y suenan completamente distinto. Es el ejemplo de la lección, en una frase.' },
          { texto: 'She walked through the door.', es: 'Ella pasó por la puerta.',
            nota: 'Ojo con <b>through</b>: la <i>gh</i> no suena. Es simplemente "zru".' },
          { texto: 'This is not what it looks like.', es: 'Esto no es lo que parece.',
            nota: 'Seis palabras cortas seguidas. Acá lo difícil no es ninguna palabra suelta, es el ritmo.' },
        ],
      },

      practica: `
        <p><b>La regla de trabajo para todo el track:</b> cada vez que veas una palabra nueva, tocala para escucharla
        <i>antes</i> de intentar leerla en voz alta. Si la leés primero, tu cerebro le va a poner sonidos españoles
        y después vas a estar corrigiendo en vez de aprendiendo.</p>

        <p>Cuando estés fuera de esta plataforma, el equivalente es <b>Cambridge Dictionary</b>: buscás la palabra,
        tocás el parlante, la repetís. Treinta segundos por palabra.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: '¿Cuál de estas parejas <b>rima</b> de verdad en inglés?',
          opciones: ['though / tough', 'through / true', 'cough / dough', 'thought / boat'],
          correcta: 1,
          porQue: '<b>through</b> /θruː/ y <b>true</b> /truː/ terminan igual: el sonido "u" largo. Lo escrito engaña, el sonido no.',
          porQueNo: {
            0: '<b>though</b> suena "dou" y <b>tough</b> suena "taf". Se escriben casi igual y no tienen nada que ver.',
            2: '<b>cough</b> suena "cof" y <b>dough</b> suena "dou" (masa, la de la pizza). No riman.',
            3: '<b>thought</b> suena "zot" y <b>boat</b> suena "bout". Distintos.',
          },
        },
        {
          tipo: 'dictado',
          p: 'Escuchá y escribí exactamente lo que oís. Podés repetirlo las veces que quieras.',
          respuesta: 'I thought it was easy',
          porQue: 'Fijate que <b>thought</b> tiene siete letras y suena con tres sonidos: "z-o-t". Esa distancia entre lo escrito y lo dicho es toda la lección.',
        },
        {
          tipo: 'traducir',
          p: 'Traducí al inglés: <b>Esto es difícil.</b>',
          respuesta: 'This is difficult',
          respuestas: ['This is hard', 'This is tough', "It's difficult", "It's hard"],
          pista: 'Hay varias formas válidas. Cualquiera de las obvias sirve.',
          porQue: 'Las tres palabras — <b>difficult</b>, <b>hard</b> y <b>tough</b> — funcionan acá. <b>tough</b> es la más informal.',
        },
      ],

      errores: [
        { mito: 'Si aprendo bien las reglas de pronunciación, voy a poder leer cualquier palabra en voz alta.',
          realidad: 'No hay un set de reglas que cubra el inglés. Hay <b>tendencias</b> con montañas de excepciones. Los propios nativos ' +
                    'se equivocan pronunciando palabras que solo leyeron y nunca escucharon — es tan común que tiene nombre. ' +
                    'La solución no es más reglas: es <b>más escucha</b>.' },
        { mito: 'La <i>h</i> en inglés no se pronuncia, como en español.',
          realidad: 'Al contrario: en inglés la <i>h</i> <b>sí suena</b>, y bastante — es un soplido. ' +
                    '<span class="en" data-say>house</span>, <span class="en" data-say>hello</span>, <span class="en" data-say>have</span>. ' +
                    'Comerse la <i>h</i> es uno de los delatores más fuertes del acento español.' },
        { mito: 'Puedo aprender la pronunciación después, cuando ya sepa gramática.',
          realidad: 'Podés, pero te va a costar <b>mucho más</b>. Los hábitos motores de pronunciación se automatizan rápido y se ' +
                    'corrigen lento. Es exactamente igual que la deuda técnica: arreglarlo hoy cuesta una hora, arreglarlo en dos años ' +
                    'cuesta un mes.' },
      ],

      glosario: [
        { t: 'Fonema', d: 'Un sonido que distingue significados. En inglés, /ɪ/ y /iː/ son fonemas distintos porque <i>ship</i> (barco) y <i>sheep</i> (oveja) son palabras distintas.' },
        { t: 'AFI / IPA', d: 'Alfabeto Fonético Internacional. La notación entre barras que aparece en los diccionarios: <i>through</i> /θruː/. Es la única forma confiable de escribir cómo suena algo.' },
        { t: 'Ortografía opaca', d: 'Cuando la escritura no te dice cómo se pronuncia. El inglés es opaco; el español es transparente.' },
        { t: 'Fosilizar', d: 'Cuando un error se repite tanto que se vuelve automático y deja de corregirse solo. Es el motivo de que este módulo vaya primero.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l2',
      titulo: 'Los sonidos que el español no tiene',
      minutos: 9,

      simple: `
        <p>El español tiene <b>5 vocales</b>. El inglés tiene alrededor de <b>12</b>, más varios diptongos.
        Eso significa que hay sonidos ingleses para los que tu boca, literalmente, nunca se movió.</p>

        <p>No son doce problemas. Son <b>cuatro</b>, y con esos cuatro resolvés casi todo:</p>

        <h4>1. La <i>th</i> — el sonido entre los dientes</h4>
        <p>Sacá un poquito la lengua entre los dientes y soplá. Eso es. Tiene dos versiones:</p>
        <ul>
          <li>Sorda (sin voz): <span class="en" data-say>think</span>, <span class="en" data-say>three</span>, <span class="en" data-say>thank you</span></li>
          <li>Sonora (con voz, vibra la garganta): <span class="en" data-say>this</span>, <span class="en" data-say>the</span>, <span class="en" data-say>mother</span></li>
        </ul>
        <p>Casi todos los hispanohablantes lo reemplazan por <b>s</b> o por <b>d</b>. Te van a entender igual,
        pero es el sonido que más te delata.</p>

        <h4>2. <i>ship</i> vs <i>sheep</i> — la vocal corta y la larga</h4>
        <p>En español la <b>i</b> es una sola. En inglés hay dos, y cambian el significado:</p>
        <ul>
          <li><span class="en" data-say>ship</span> (barco) — corta y relajada, casi una "e"</li>
          <li><span class="en" data-say>sheep</span> (oveja) — larga y tensa, sonriendo</li>
        </ul>
        <p>Lo mismo con <span class="en" data-say>live</span> (vivir) y <span class="en" data-say>leave</span> (irse).
        Y con <span class="en" data-say>bitch</span> y <span class="en" data-say>beach</span>, que conviene no confundir.</p>

        <h4>3. La vocal floja — <i>schwa</i></h4>
        <p>Es el sonido más frecuente de todo el inglés, y no existe en español. Es una vocal <b>sin forma</b>,
        la que sale cuando no hacés ningún esfuerzo. Aparece en todas las sílabas que no llevan acento:</p>
        <ul>
          <li><span class="en" data-say>about</span> — la primera vocal es floja: "ə-BAUT"</li>
          <li><span class="en" data-say>computer</span> — "kəm-PIU-tər"</li>
          <li><span class="en" data-say>problem</span> — "PRO-bləm"</li>
        </ul>
        <p>Pronunciar todas las vocales claras y fuertes, como en español, es lo que hace que suenes
        "robótico" aunque digas todo bien.</p>

        <h4>4. Las consonantes del final</h4>
        <p>En español casi nada termina en consonante fuerte. En inglés, muchísimo — y esa consonante final
        <b>cambia el significado</b>: <span class="en" data-say>work</span> / <span class="en" data-say>works</span> /
        <span class="en" data-say>worked</span>. Comértela borra el tiempo verbal.</p>
      `,

      tecnico: `
        <p>Los cuatro problemas de arriba, con nombre propio:</p>

        <table>
          <tr><th>Fonema</th><th>Ejemplo</th><th>Qué hace el hispanohablante</th></tr>
          <tr><td>/θ/ dental sorda</td><td>think, three</td><td>Lo reemplaza por /s/ o /t/</td></tr>
          <tr><td>/ð/ dental sonora</td><td>this, mother</td><td>Lo reemplaza por /d/</td></tr>
          <tr><td>/ɪ/ vs /iː/</td><td>ship / sheep</td><td>Colapsa las dos en la /i/ española</td></tr>
          <tr><td>/ə/ schwa</td><td>about, problem</td><td>La pronuncia como vocal plena</td></tr>
          <tr><td>/v/</td><td>very, love</td><td>Lo pronuncia /b/ (en español /b/ y /v/ son el mismo sonido)</td></tr>
          <tr><td>/h/</td><td>house, hello</td><td>Lo omite (en español la h es muda)</td></tr>
          <tr><td>/s/ inicial + consonante</td><td>Spain, school</td><td>Le antepone una "e": "Espain"</td></tr>
        </table>

        <div class="nota-tec">
          <b>El caso de la "e" fantasma.</b> El español no admite grupos consonánticos <i>/s/ + consonante</i> al inicio
          de palabra — por eso <i>Spain</i> se volvió <i>España</i> y <i>school</i> se volvió <i>escuela</i>. Tu aparato
          fonológico agrega esa <i>e</i> automáticamente, sin que lo decidas. Corregirlo es puramente mecánico:
          arrancá la palabra con el siseo, sin abrir la boca antes.
        </div>

        <p><b>Sobre /ɪ/ vs /iː/.</b> El contraste no es solo de duración, aunque así se enseñe. /iː/ es <b>tensa</b>
        (lengua alta y adelantada, labios estirados) e /ɪ/ es <b>laxa</b> (lengua más baja y centrada, mandíbula
        relajada). Si intentás producir /ɪ/ solo acortando la /i/ española, sigue sonando a /iː/ corta.
        El truco que funciona: pensala como un sonido a mitad de camino entre la <b>i</b> y la <b>e</b>.</p>

        <p><b>Sobre el schwa.</b> /ə/ es la vocal más frecuente del inglés — aparece en aproximadamente una de cada
        tres sílabas del habla corriente. Es consecuencia directa del ritmo acentual, que es el tema de la
        lección siguiente: en inglés las sílabas sin acento se <b>reducen</b>, y reducir significa colapsar
        la vocal hacia el centro.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Los cuatro sonidos difíciles para hispanohablantes">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Los cuatro que resuelven casi todo</text>

          <g>
            <rect x="26" y="42" width="150" height="112" rx="10" fill="#34d399" opacity="0.1" stroke="#34d399" stroke-width="1.5"/>
            <text x="101" y="66" text-anchor="middle" font-size="21" font-weight="800" fill="#34d399">θ / ð</text>
            <text x="101" y="88" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">lengua entre dientes</text>
            <text x="101" y="112" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.75">think · this</text>
            <text x="101" y="132" text-anchor="middle" font-size="11.5" fill="#f87171">NO: "sink" · "dis"</text>
          </g>

          <g>
            <rect x="190" y="42" width="150" height="112" rx="10" fill="#22d3ee" opacity="0.1" stroke="#22d3ee" stroke-width="1.5"/>
            <text x="265" y="66" text-anchor="middle" font-size="21" font-weight="800" fill="#22d3ee">ɪ / iː</text>
            <text x="265" y="88" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">laxa vs tensa</text>
            <text x="265" y="112" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.75">ship · sheep</text>
            <text x="265" y="132" text-anchor="middle" font-size="11.5" fill="#f87171">NO: las dos igual</text>
          </g>

          <g>
            <rect x="354" y="42" width="150" height="112" rx="10" fill="#c084fc" opacity="0.1" stroke="#c084fc" stroke-width="1.5"/>
            <text x="429" y="66" text-anchor="middle" font-size="21" font-weight="800" fill="#c084fc">ə</text>
            <text x="429" y="88" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">vocal floja</text>
            <text x="429" y="112" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.75">about · problem</text>
            <text x="429" y="132" text-anchor="middle" font-size="11.5" fill="#f87171">NO: "a-BOUT" claro</text>
          </g>

          <g>
            <rect x="518" y="42" width="136" height="112" rx="10" fill="#fbbf24" opacity="0.1" stroke="#fbbf24" stroke-width="1.5"/>
            <text x="586" y="66" text-anchor="middle" font-size="21" font-weight="800" fill="#fbbf24">-k -s -d</text>
            <text x="586" y="88" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">final que sí suena</text>
            <text x="586" y="112" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.75">work · works</text>
            <text x="586" y="132" text-anchor="middle" font-size="11.5" fill="#f87171">NO: comérsela</text>
          </g>

          <line x1="26" y1="176" x2="654" y2="176" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="200" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">Pares que cambian de significado</text>

          <g font-size="13" text-anchor="middle">
            <text x="120" y="228" fill="#34d399" font-weight="700">think</text>
            <text x="120" y="248" fill="currentColor" opacity="0.55">pensar</text>
            <text x="185" y="228" fill="currentColor" opacity="0.45">≠</text>
            <text x="250" y="228" fill="#f87171" font-weight="700">sink</text>
            <text x="250" y="248" fill="currentColor" opacity="0.55">hundirse</text>

            <text x="430" y="228" fill="#22d3ee" font-weight="700">live</text>
            <text x="430" y="248" fill="currentColor" opacity="0.55">vivir</text>
            <text x="495" y="228" fill="currentColor" opacity="0.45">≠</text>
            <text x="560" y="228" fill="#f87171" font-weight="700">leave</text>
            <text x="560" y="248" fill="currentColor" opacity="0.55">irse</text>
          </g>

          <text x="340" y="282" text-anchor="middle" font-size="12.5" fill="currentColor" opacity="0.7">
            No es cosmético: "I live" y "I leave" dicen cosas opuestas.
          </text>
        </svg>`,
        pie: 'Cuatro sonidos, y dos pares donde equivocarse cambia lo que dijiste.',
      },

      escucha: {
        intro: '<p>Estas frases están armadas para que tengas que distinguir los sonidos de la lección. ' +
               'Escuchá primero, escribí después.</p>',
        items: [
          { texto: 'I think this is the third one.', es: 'Creo que este es el tercero.',
            nota: 'Cuatro <b>th</b> en una frase: think, this, the, third. Repetila hasta que te salga sin trabarte.' },
          { texto: 'I live here, I never leave.', es: 'Vivo acá, nunca me voy.',
            nota: '<b>live</b> es corta y relajada; <b>leave</b> es larga y sonriendo. Es el par de la lección.' },
          { texto: 'She works at a school in Spain.', es: 'Ella trabaja en una escuela en España.',
            nota: 'Dos trampas: la <b>s</b> final de <i>works</i> (que no hay que comerse) y <i>school</i> y <i>Spain</i> ' +
                  'sin la "e" fantasma adelante.' },
          { texto: 'My mother has three brothers.', es: 'Mi mamá tiene tres hermanos.',
            nota: '<b>mother</b> y <b>brothers</b> llevan la th sonora (vibra); <b>three</b> la sorda (solo aire).' },
        ],
      },

      practica: `
        <p><b>Ejercicio de espejo, cinco minutos.</b> Poné un dedo delante de la boca y decí
        <span class="en" data-say>three</span>. Tenés que sentir el aire salir. Ahora poné la mano en la garganta
        y decí <span class="en" data-say>this</span>: tenés que sentir la vibración. Si en los dos casos sentís
        lo mismo, todavía estás diciendo "s" o "d".</p>

        <p><b>La prueba de la "e" fantasma.</b> Grabate diciendo
        <span class="en" data-say>Spain</span>, <span class="en" data-say>school</span>,
        <span class="en" data-say>Spanish</span>, <span class="en" data-say>student</span>.
        Escuchate. ¿Aparece una "e" adelante? Es automático — no lo estás decidiendo. Para corregirlo,
        empezá haciendo el siseo solo ("ssss") y recién ahí sumá el resto.</p>

        <p>Los botones 🎙️ de la pestaña <b>Escucha</b> sirven exactamente para esto: grabarte y compararte.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: '¿Cuál de estas palabras lleva la <b>th sonora</b> (la que hace vibrar la garganta)?',
          opciones: ['think', 'thank', 'mother', 'three'],
          correcta: 2,
          porQue: '<b>mother</b> /ˈmʌðər/ lleva /ð/, la versión sonora. En general la th entre vocales suele ser sonora.',
          porQueNo: {
            0: '<b>think</b> lleva /θ/, la sorda: solo sale aire, no vibra nada.',
            1: '<b>thank</b> también es sorda. <i>Thank you</i> es puro aire.',
            3: '<b>three</b> es sorda. Es la misma de <i>think</i>.',
          },
        },
        {
          tipo: 'opcion',
          p: 'Querés decir «vivo en Córdoba». ¿Cuál usás?',
          opciones: ['I leave in Córdoba', 'I live in Córdoba', 'I life in Córdoba', 'I lives in Córdoba'],
          correcta: 1,
          porQue: '<b>live</b> (vivir) con la vocal corta. Es el par de la lección: cambiar la vocal cambia el verbo.',
          porQueNo: {
            0: '<b>leave</b> es "irse". Estarías diciendo «me voy en Córdoba».',
            2: '<b>life</b> es el sustantivo «vida», no el verbo.',
            3: 'La <b>-s</b> es para <i>he/she/it</i>, no para <i>I</i>. Eso lo vemos en el módulo 3.',
          },
        },
        {
          tipo: 'dictado',
          p: 'Escuchá y escribí. Prestá atención a las consonantes del final.',
          respuesta: 'She works at a school',
          porQue: 'Dos cosas que un hispanohablante se come: la <b>s</b> de <i>works</i> y el arranque limpio de <i>school</i>, sin "e" adelante.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá la frase: «Creo que este es mi hermano.»',
          respuesta: 'I think this is my brother',
          porQue: 'Tres <b>th</b> juntas — <i>think</i>, <i>this</i>, <i>brother</i> — y las tres se practican mejor en una frase que sueltas.',
        },
      ],

      errores: [
        { mito: 'Si digo "sink" en vez de "think" no pasa nada, se entiende por contexto.',
          realidad: 'Casi siempre se entiende, sí. Pero <b>casi siempre no es siempre</b>: <i>I think it</i> vs <i>I sink it</i>, ' +
                    '<i>thing</i> vs <i>sing</i>, <i>three</i> vs <i>free</i>. Y sobre todo, es el rasgo que más marca el acento. ' +
                    'Es de lo más barato de corregir: son dos movimientos de lengua.' },
        { mito: 'La diferencia entre <i>ship</i> y <i>sheep</i> es que una es más larga.',
          realidad: 'La duración ayuda, pero lo que las separa de verdad es la <b>tensión</b>. /iː/ se dice con los labios estirados ' +
                    'como sonriendo; /ɪ/ con la boca relajada, a mitad de camino entre la i y la e española. ' +
                    'Si solo acortás la i española, seguís diciendo <i>sheep</i>.' },
        { mito: 'Hablar claro y pronunciar todas las vocales bien fuerte se entiende mejor.',
          realidad: 'Es al revés. El inglés <b>necesita</b> que las sílabas sin acento se digan flojas. Pronunciar cada vocal ' +
                    'plena y clara hace que suene antinatural y, curiosamente, <b>más difícil de seguir</b> para un nativo — ' +
                    'porque el acento es lo que le marca dónde está la información.' },
      ],

      glosario: [
        { t: 'Schwa /ə/', d: 'La vocal neutra, la más frecuente del inglés. Es el sonido que sale cuando no hacés ningún esfuerzo con la boca. Aparece en las sílabas sin acento.' },
        { t: 'Sordo / sonoro', d: 'Sonoro = las cuerdas vocales vibran (poné la mano en la garganta). Sordo = solo pasa aire. /θ/ en <i>think</i> es sorda, /ð/ en <i>this</i> es sonora.' },
        { t: 'Par mínimo', d: 'Dos palabras que se diferencian por un solo sonido: <i>ship/sheep</i>, <i>live/leave</i>. Es la herramienta estándar para entrenar el oído.' },
        { t: 'Tenso / laxo', d: 'Cuánta tensión muscular usás. /iː/ es tensa (labios estirados), /ɪ/ es laxa (boca relajada). Es lo que de verdad las separa.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l3',
      titulo: 'El ritmo: lo que más cambia todo',
      minutos: 9,

      simple: `
        <p>Si tuvieras que quedarte con <b>una sola cosa</b> de este módulo, es esta.</p>

        <p>El español y el inglés tienen ritmos distintos, y no un poco: son dos sistemas diferentes.</p>

        <div class="analogia">
          <b>Español:</b> cada sílaba dura más o menos lo mismo. Da-da-da-da-da. Como una ametralladora.<br>
          <b>Inglés:</b> las sílabas acentuadas marcan el pulso y <b>todo lo del medio se comprime</b>.
          DA-da-da-DA-da-DA. Como un tambor.
        </div>

        <p>Escuchá esta frase: <span class="en" data-say>I want to go to the party</span>.</p>

        <p>Escrita tiene ocho palabras. Dicha, tiene <b>tres golpes</b>: <b>WANT</b> — <b>GO</b> — <b>PAR</b>ty.
        Todo lo demás (<i>I, to, to, the</i>) se dice tan flojo y tan rápido que casi desaparece.
        <i>want to</i> se convierte en "wanna", <i>to the</i> se vuelve un murmullo.</p>

        <p><b>Y acá está el punto que lo cambia todo:</b> vos no entendés a los nativos <b>no</b> porque hablen rápido.
        Es porque <b>comprimen todo lo que no lleva acento</b>. Estás esperando escuchar palabras completas
        y ellos no las están diciendo completas.</p>

        <h4>Las palabras que se comprimen</h4>
        <p>Siempre las mismas, y son las que no llevan significado propio:</p>
        <ul>
          <li>Artículos: <i>a, an, the</i></li>
          <li>Preposiciones: <i>to, of, at, for, from</i></li>
          <li>Auxiliares: <i>am, is, are, do, does, have, can</i></li>
          <li>Pronombres: <i>you, he, she, them</i></li>
        </ul>

        <p>Las que <b>sí</b> llevan acento son las que tienen el contenido: sustantivos, verbos principales,
        adjetivos, y las palabras de pregunta.</p>

        <h4>Qué hacer con esto</h4>
        <p>Cuando escuches, <b>no persigas todas las palabras</b>. Perseguí los golpes. Las palabras acentuadas
        son las que llevan el mensaje; el resto lo podés reconstruir. Es como leer código: no leés cada carácter,
        buscás los nombres de las funciones.</p>
      `,

      tecnico: `
        <p>La clasificación clásica: el inglés es un idioma de <b>ritmo acentual</b> (<i>stress-timed</i>) y el
        español de <b>ritmo silábico</b> (<i>syllable-timed</i>).</p>

        <p>En un idioma de ritmo acentual, el intervalo entre sílabas acentuadas tiende a mantenerse constante,
        independientemente de cuántas sílabas átonas haya en el medio. Si hay más sílabas sin acento,
        se <b>comprimen</b> para entrar en el mismo tiempo.</p>

        <div class="nota-tec">
          Estas tres frases tardan aproximadamente <b>lo mismo</b> en decirse, aunque tengan 4, 7 y 9 sílabas:
          <br><br>
          <span class="en" data-say>CATS eat FISH</span><br>
          <span class="en" data-say>The CATS have eaten the FISH</span><br>
          <span class="en" data-say>The CATS could have eaten all of the FISH</span>
          <br><br>
          Tocá las tres y cronometralas. Los tres golpes están siempre a la misma distancia.
          Todo lo que se agregó se metió en el medio, comprimido.
        </div>

        <p><b>Dos mecanismos derivados</b>, que son los que rompen el oído del que aprende:</p>

        <p><b>1. Formas débiles</b> (<i>weak forms</i>). Muchas palabras funcionales tienen dos pronunciaciones:
        una plena, cuando se dicen aisladas o enfatizadas, y una reducida, que es la que se usa el 95% del tiempo.</p>

        <table>
          <tr><th>Palabra</th><th>Forma plena</th><th>Forma débil (la real)</th></tr>
          <tr><td>to</td><td>/tuː/</td><td>/tə/</td></tr>
          <tr><td>of</td><td>/ɒv/</td><td>/əv/ o solo /ə/</td></tr>
          <tr><td>and</td><td>/ænd/</td><td>/ən/ o solo /n/</td></tr>
          <tr><td>can</td><td>/kæn/</td><td>/kən/</td></tr>
          <tr><td>you</td><td>/juː/</td><td>/jə/</td></tr>
        </table>

        <p><b>2. Habla conectada</b> (<i>connected speech</i>). Las palabras no se dicen separadas: se enlazan,
        se asimilan y se pierden sonidos.</p>
        <ul>
          <li><b>Enlace:</b> <i>an apple</i> suena "a-NA-pəl" — la n salta a la vocal siguiente.</li>
          <li><b>Asimilación:</b> <i>did you</i> suena "DI-dʒu".</li>
          <li><b>Elisión:</b> <i>next day</i> pierde la t: "neks-day".</li>
        </ul>

        <p>Por eso una transcripción escrita nunca te prepara para el audio real: lo escrito muestra
        palabras separadas y completas, que es exactamente lo que <b>no</b> vas a escuchar.</p>

        <p><b>Nota honesta sobre la voz de esta plataforma:</b> la voz sintética pronuncia bastante bien las palabras
        sueltas, pero <b>aplica mal la compresión y el enlace</b>. Te sirve para el dictado y el vocabulario;
        para el ritmo real necesitás humanos. Están en la pestaña 📚 Fuentes.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ritmo silábico del español contra ritmo acentual del inglés">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Dos ritmos distintos, no dos velocidades</text>

          <text x="30" y="58" font-size="12.5" font-weight="700" fill="#22d3ee">ESPAÑOL · cada sílaba pesa igual</text>
          <g>
            <rect x="30"  y="70" width="66" height="30" rx="6" fill="#22d3ee" opacity="0.28"/>
            <rect x="102" y="70" width="66" height="30" rx="6" fill="#22d3ee" opacity="0.28"/>
            <rect x="174" y="70" width="66" height="30" rx="6" fill="#22d3ee" opacity="0.28"/>
            <rect x="246" y="70" width="66" height="30" rx="6" fill="#22d3ee" opacity="0.28"/>
            <rect x="318" y="70" width="66" height="30" rx="6" fill="#22d3ee" opacity="0.28"/>
            <rect x="390" y="70" width="66" height="30" rx="6" fill="#22d3ee" opacity="0.28"/>
            <rect x="462" y="70" width="66" height="30" rx="6" fill="#22d3ee" opacity="0.28"/>
          </g>
          <g font-size="12" text-anchor="middle" fill="currentColor">
            <text x="63"  y="90">quie</text><text x="135" y="90">ro</text><text x="207" y="90">ir</text>
            <text x="279" y="90">a</text><text x="351" y="90">la</text><text x="423" y="90">fies</text><text x="495" y="90">ta</text>
          </g>
          <text x="548" y="90" font-size="11.5" fill="currentColor" opacity="0.55">todas iguales</text>

          <text x="30" y="148" font-size="12.5" font-weight="700" fill="#f59e0b">INGLÉS · solo los acentos marcan el pulso</text>
          <g>
            <rect x="30"  y="160" width="26" height="18" rx="4" fill="currentColor" opacity="0.16"/>
            <rect x="60"  y="152" width="86" height="34" rx="6" fill="#f59e0b" opacity="0.4"/>
            <rect x="150" y="160" width="26" height="18" rx="4" fill="currentColor" opacity="0.16"/>
            <rect x="180" y="152" width="62" height="34" rx="6" fill="#f59e0b" opacity="0.4"/>
            <rect x="246" y="160" width="26" height="18" rx="4" fill="currentColor" opacity="0.16"/>
            <rect x="276" y="160" width="30" height="18" rx="4" fill="currentColor" opacity="0.16"/>
            <rect x="310" y="152" width="72" height="34" rx="6" fill="#f59e0b" opacity="0.4"/>
            <rect x="386" y="160" width="26" height="18" rx="4" fill="currentColor" opacity="0.16"/>
          </g>
          <g font-size="12" text-anchor="middle">
            <text x="43"  y="173" fill="currentColor" opacity="0.5">I</text>
            <text x="103" y="175" fill="#f59e0b" font-weight="800">WANT</text>
            <text x="163" y="173" fill="currentColor" opacity="0.5">to</text>
            <text x="211" y="175" fill="#f59e0b" font-weight="800">GO</text>
            <text x="259" y="173" fill="currentColor" opacity="0.5">to</text>
            <text x="291" y="173" fill="currentColor" opacity="0.5">the</text>
            <text x="346" y="175" fill="#f59e0b" font-weight="800">PAR</text>
            <text x="399" y="173" fill="currentColor" opacity="0.5">ty</text>
          </g>

          <g stroke="#f59e0b" stroke-width="2" opacity="0.85">
            <line x1="103" y1="196" x2="103" y2="208"/>
            <line x1="211" y1="196" x2="211" y2="208"/>
            <line x1="346" y1="196" x2="346" y2="208"/>
          </g>
          <text x="440" y="206" font-size="11.5" fill="#f59e0b" font-weight="600">3 golpes · 8 palabras</text>

          <line x1="30" y1="232" x2="650" y2="232" stroke="currentColor" opacity="0.15"/>

          <text x="30" y="256" font-size="12.5" font-weight="700" fill="currentColor">Estas tres tardan LO MISMO</text>
          <g font-size="12.5">
            <text x="30" y="278" fill="currentColor" opacity="0.8">CATS eat FISH</text>
            <text x="30" y="296" fill="currentColor" opacity="0.8">The CATS have eaten the FISH</text>
            <text x="30" y="314" fill="currentColor" opacity="0.8">The CATS could have eaten all of the FISH</text>
          </g>
          <g stroke="#f59e0b" stroke-width="1.6" opacity="0.5" stroke-dasharray="3 3">
            <line x1="300" y1="266" x2="300" y2="318"/>
            <line x1="470" y1="266" x2="470" y2="318"/>
          </g>
          <text x="500" y="286" font-size="11.5" fill="currentColor" opacity="0.6">lo del medio</text>
          <text x="500" y="302" font-size="11.5" fill="currentColor" opacity="0.6">se comprime</text>
        </svg>`,
        pie: 'Arriba: el español reparte el tiempo por sílaba. Abajo: el inglés lo reparte por acento, y aplasta el resto.',
        nota: '<p>Tocá las tres frases de abajo del diagrama en la pestaña 🔵 Técnico y cronometralas. ' +
              'Es la demostración más rápida de por qué te cuesta entender: <b>no hablan rápido, comprimen</b>.</p>',
      },

      escucha: {
        intro: '<p>Acá el objetivo cambia: no se trata de escribir bien, sino de <b>contar los golpes</b>. ' +
               'Escuchá cada frase dos veces antes de escribir nada, y fijate cuáles son las palabras que se oyen fuerte.</p>',
        items: [
          { texto: 'I want to go home.', es: 'Quiero irme a casa.',
            nota: 'Dos golpes: <b>WANT</b> y <b>HOME</b>. <i>I</i> y <i>to</i> casi no se oyen. En habla real, <i>want to</i> suena "wanna".' },
          { texto: 'What do you want to do?', es: '¿Qué querés hacer?',
            nota: 'En la calle esto suena casi "Wadaya wanna do?". Escrito parece otra cosa completamente.' },
          { texto: 'I have to talk to my boss about it.', es: 'Tengo que hablar con mi jefe sobre eso.',
            nota: 'Golpes en <b>TALK</b>, <b>BOSS</b> y <b>BOUT</b>. Todo el resto es relleno comprimido — y es la mitad de la frase.' },
          { texto: 'Can you send me the file?', es: '¿Me podés mandar el archivo?',
            nota: '<b>can</b> acá va débil, suena "kən". Cuando <i>can</i> lleva acento suele ser porque alguien está enfatizando.' },
        ],
      },

      practica: `
        <p><b>Ejercicio del lápiz.</b> Tomá cualquier frase de esta lección, escuchala y <b>golpeá la mesa</b>
        en cada sílaba acentuada. Solo en esas. Vas a notar que los golpes salen parejos aunque las palabras
        del medio cambien de cantidad. Eso es el ritmo del inglés, y una vez que lo sentís no se olvida.</p>

        <p><b>Shadowing (la técnica que más rinde).</b> Reproducís una frase, y la repetís <b>encima</b>,
        casi al mismo tiempo, copiando la melodía y no las palabras. No importa si te comés sonidos:
        lo que estás entrenando es el ritmo. Cinco minutos por día de esto rinden más que una hora de gramática.</p>

        <p>En la pestaña 🎧 <b>Escucha</b> tenés el botón 🎙️ para grabarte y comparar tu versión con el modelo.
        No busques sonar idéntico — buscá que los <b>golpes caigan en el mismo lugar</b>.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'En <span class="en" data-say>I want to go to the party</span>, ¿cuántas sílabas se dicen <b>fuerte</b>?',
          opciones: ['Ocho, una por palabra', 'Tres', 'Cinco', 'Todas por igual'],
          correcta: 1,
          porQue: 'Tres golpes: <b>WANT</b>, <b>GO</b> y <b>PAR</b>-ty. Las otras cinco palabras se comprimen hasta casi desaparecer.',
          porQueNo: {
            0: 'Ese es el ritmo del español. En inglés la cantidad de palabras no tiene relación con la cantidad de golpes.',
            2: 'Se acentúan solo las palabras con contenido: sustantivos, verbos principales y adjetivos.',
            3: 'Eso sería ritmo silábico — español, italiano, japonés. El inglés no funciona así.',
          },
        },
        {
          tipo: 'opcion',
          p: '¿Cuál de estas palabras <b>NO</b> suele llevar acento en una frase?',
          opciones: ['party', 'want', 'the', 'go'],
          correcta: 2,
          porQue: '<b>the</b> es un artículo: palabra funcional, sin contenido propio. Siempre se dice floja, casi como un murmullo.',
          porQueNo: {
            0: '<b>party</b> es un sustantivo. Los sustantivos llevan acento.',
            1: '<b>want</b> es el verbo principal, y esos llevan el peso de la frase.',
            3: '<b>go</b> también es verbo principal, y es de las que más se oyen.',
          },
        },
        {
          tipo: 'dictado',
          p: 'Escuchá y escribí. Es corta, pero está llena de palabras comprimidas.',
          respuesta: 'I have to go to work',
          porQue: 'Dos golpes — <b>GO</b> y <b>WORK</b> — y cuatro palabras comprimidas. En habla real <i>have to</i> suena "hafta".',
        },
        {
          tipo: 'ordenar',
          p: 'Armá la pregunta: «¿Qué querés hacer?»',
          respuesta: 'What do you want to do',
          porQue: 'Seis palabras, dos golpes: <b>WHAT</b> y <b>WANT</b>. Todo lo del medio se aplasta. Por eso escuchada parece una sola palabra.',
        },
      ],

      errores: [
        { mito: 'No entiendo a los nativos porque hablan muy rápido.',
          realidad: 'Casi nunca es la velocidad. Es la <b>compresión</b>: las palabras sin acento se reducen y se enlazan, ' +
                    'y vos estás esperando escuchar palabras completas y separadas. Pedirle a alguien que hable más lento ' +
                    'ayuda poco; lo que ayuda es acostumbrarse a que <i>want to</i> suene "wanna".' },
        { mito: 'Si pronuncio cada palabra entera y clarita, me van a entender mejor.',
          realidad: 'Te van a entender, pero vas a sonar raro — y encima es <b>más trabajo</b> para el que escucha, porque ' +
                    'el acento es lo que le indica dónde está la información importante. Decir todo con el mismo peso ' +
                    'es como escribir un texto sin puntuación.' },
        { mito: 'Las contracciones tipo "wanna" y "gonna" son inglés mal hablado.',
          realidad: 'Son la pronunciación <b>normal</b> del habla corriente, en todos los niveles sociales. En un contexto formal ' +
                    'se reducen menos, pero no desaparecen. Otra cosa es <b>escribirlas</b>: eso sí es informal, y en un mail ' +
                    'de trabajo no va.' },
      ],

      glosario: [
        { t: 'Ritmo acentual', d: '<i>Stress-timed</i>. El tiempo entre acentos tiende a ser constante y las sílabas del medio se comprimen. Es el inglés, el alemán, el ruso.' },
        { t: 'Ritmo silábico', d: '<i>Syllable-timed</i>. Cada sílaba dura más o menos lo mismo. Es el español, el italiano, el francés.' },
        { t: 'Forma débil', d: 'La pronunciación reducida de una palabra funcional. <i>to</i> se dice /tə/, <i>and</i> se dice /n/. Es la forma que vas a escuchar casi siempre.' },
        { t: 'Habla conectada', d: '<i>Connected speech</i>. Cómo se enlazan, asimilan y pierden sonidos las palabras al hablar seguido. Es la razón principal de que el audio real no se parezca a la transcripción.' },
        { t: 'Shadowing', d: 'Repetir un audio casi encima del original, copiando ritmo y melodía más que palabras. La técnica de pronunciación con mejor relación esfuerzo/resultado.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l4',
      titulo: 'El alfabeto, deletrear y cómo usar este track',
      minutos: 8,

      simple: `
        <p>Dos cosas prácticas para cerrar el módulo: saber deletrear, y saber cómo estudiar acá.</p>

        <h4>El alfabeto</h4>
        <p>Parece de jardín de infantes hasta la primera vez que alguien en una call te pide que deletrees
        tu apellido y te quedás mudo. Se usa muchísimo: mails, nombres, códigos, direcciones.</p>

        <p>El truco para aprenderlo rápido es <b>agruparlo por cómo rima</b>, no en orden:</p>
        <ul>
          <li><span class="en" data-say>A H J K</span> — riman con "ei"</li>
          <li><span class="en" data-say>B C D E G P T V</span> — riman con "i"</li>
          <li><span class="en" data-say>F L M N S X Z</span> — arrancan con "e"</li>
          <li><span class="en" data-say>I Y</span> — "ai" · <span class="en" data-say>O</span> — "ou"</li>
          <li><span class="en" data-say>Q U W</span> — "kiu", "iu", "dábliu"</li>
          <li><span class="en" data-say>R</span> — "ar"</li>
        </ul>

        <p><b>Las tres que más se confunden:</b> <b>E</b> ("i") con <b>I</b> ("ai"), <b>G</b> ("dchi") con
        <b>J</b> ("dchei"), y <b>Y</b> ("uai") con <b>W</b> ("dábliu").</p>

        <p>Para deletrear se dice letra por letra, y si hay una repetida se usa <i>double</i>:
        <span class="en" data-say>My name is Anna. A - double N - A.</span></p>

        <h4>Cómo usar este track</h4>
        <p>Cinco cosas, y ninguna es opcional:</p>
        <ol>
          <li><b>Tocá todo lo que esté marcado.</b> Las frases con fondo naranja suenan. Si leés sin escuchar,
          estás inventando la pronunciación.</li>
          <li><b>Hacé los ejercicios aunque no estés seguro.</b> Lo que falles entra a la cola de repaso y vuelve
          a los 1, 3, 7, 16 y 35 días. <b>Fallar es el mecanismo</b>, no el fracaso.</li>
          <li><b>Practicá el vocabulario del módulo</b> desde la página del módulo. Son cinco minutos y es
          donde más rinde el tiempo.</li>
          <li><b>Grabate.</b> En la pestaña 🎧 tenés el botón de micrófono. Escucharte es incómodo y es
          exactamente por eso que funciona.</li>
          <li><b>Todos los días.</b> Veinte minutos diarios superan a tres horas el domingo, y no es cerca.
          El idioma se consolida durmiendo, no estudiando.</li>
        </ol>

        <div class="aviso">
          <b>Lo que este track no te da.</b> Hablar con alguien que te corrija. Ninguna app lo da. Cuando llegues
          a A2 buscá un intercambio, un Discord o clases — pero no ahora: con A1 todavía no tenés con qué sostener
          una conversación, y frustrarte temprano es la forma más común de abandonar.
        </div>
      `,

      tecnico: `
        <p><b>Sobre deletrear en contexto profesional.</b> En una call internacional, cuando el audio está malo,
        se usa el <b>alfabeto fonético de la OTAN</b>: Alpha, Bravo, Charlie, Delta… No hace falta memorizarlo,
        pero sí reconocerlo cuando alguien lo usa. Lo vas a escuchar en soporte técnico y en aviación.</p>

        <p><b>Direcciones de mail y URLs</b>, que aparecen todo el tiempo:</p>
        <table>
          <tr><th>Símbolo</th><th>Se dice</th></tr>
          <tr><td>@</td><td>at</td></tr>
          <tr><td>.</td><td>dot</td></tr>
          <tr><td>-</td><td>dash o hyphen</td></tr>
          <tr><td>_</td><td>underscore</td></tr>
          <tr><td>/</td><td>slash</td></tr>
          <tr><td>#</td><td>hash (UK) o pound (US)</td></tr>
        </table>

        <div class="nota-tec">
          <b>Sobre el marco CEFR.</b> Los niveles A1 a C2 son del Marco Común Europeo de Referencia. No son opiniones:
          cada uno tiene descriptores concretos de qué podés hacer.
          <br><br>
          <b>A1</b> frases básicas sobre lo cotidiano · <b>A2</b> intercambios simples y rutinarios ·
          <b>B1</b> te arreglás solo de viaje y en temas conocidos · <b>B2</b> conversación fluida con nativos
          sin esfuerzo para ninguno de los dos · <b>C1</b> uso flexible y preciso en contextos profesionales ·
          <b>C2</b> prácticamente como un nativo culto.
          <br><br>
          Cuando una oferta laboral pide "inglés avanzado" casi siempre significa <b>B2</b>. Ese es el objetivo real
          de esta escalera; C1 es un extra.
        </div>

        <p><b>Sobre cuánto lleva.</b> Las estimaciones del Foreign Service Institute de Estados Unidos — que entrena
        diplomáticos — ponen al español y al inglés en la <b>categoría más fácil</b> entre sí: unas 600-750 horas de
        clase para llegar a un nivel profesional. Eso es <i>tiempo de clase</i>, sin contar la práctica personal.
        Es una referencia, no una promesa, pero sirve para calibrar: <b>esto se mide en años, no en meses</b>.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="El alfabeto inglés agrupado por rima y la escalera de niveles CEFR">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">El alfabeto, agrupado por cómo rima</text>

          <g font-size="13">
            <rect x="30" y="36" width="290" height="30" rx="7" fill="#34d399" opacity="0.13"/>
            <text x="44" y="56" font-weight="800" fill="#34d399">A H J K</text>
            <text x="150" y="56" fill="currentColor" opacity="0.72">riman con "ei"</text>

            <rect x="30" y="72" width="290" height="30" rx="7" fill="#22d3ee" opacity="0.13"/>
            <text x="44" y="92" font-weight="800" fill="#22d3ee">B C D E G P T V</text>
            <text x="185" y="92" fill="currentColor" opacity="0.72">riman con "i"</text>

            <rect x="30" y="108" width="290" height="30" rx="7" fill="#c084fc" opacity="0.13"/>
            <text x="44" y="128" font-weight="800" fill="#c084fc">F L M N S X Z</text>
            <text x="180" y="128" fill="currentColor" opacity="0.72">arrancan con "e"</text>

            <rect x="30" y="144" width="290" height="30" rx="7" fill="#fbbf24" opacity="0.13"/>
            <text x="44" y="164" font-weight="800" fill="#fbbf24">I Y · O · Q U W · R</text>
            <text x="215" y="164" fill="currentColor" opacity="0.72">sueltas</text>
          </g>

          <rect x="30" y="188" width="290" height="42" rx="7" fill="#f87171" opacity="0.11" stroke="#f87171" stroke-width="1.2"/>
          <text x="44" y="206" font-size="12" font-weight="700" fill="#f87171">Las que más se confunden</text>
          <text x="44" y="223" font-size="12" fill="currentColor" opacity="0.8">E/I · G/J · Y/W</text>

          <line x1="350" y1="36" x2="350" y2="270" stroke="currentColor" opacity="0.15"/>

          <text x="520" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">La escalera</text>

          <g>
            <rect x="380" y="234" width="270" height="26" rx="6" fill="#f59e0b" opacity="0.45"/>
            <text x="392" y="252" font-size="12.5" font-weight="800" fill="currentColor">A1</text>
            <text x="424" y="252" font-size="12" fill="currentColor" opacity="0.85">frases básicas · estás acá</text>

            <rect x="380" y="204" width="270" height="26" rx="6" fill="#f59e0b" opacity="0.3"/>
            <text x="392" y="222" font-size="12.5" font-weight="800" fill="currentColor">A2</text>
            <text x="424" y="222" font-size="12" fill="currentColor" opacity="0.7">intercambios simples</text>

            <rect x="380" y="174" width="270" height="26" rx="6" fill="#f59e0b" opacity="0.22"/>
            <text x="392" y="192" font-size="12.5" font-weight="800" fill="currentColor">B1</text>
            <text x="424" y="192" font-size="12" fill="currentColor" opacity="0.7">te arreglás solo</text>

            <rect x="380" y="144" width="270" height="26" rx="6" fill="#34d399" opacity="0.3" stroke="#34d399" stroke-width="1.5"/>
            <text x="392" y="162" font-size="12.5" font-weight="800" fill="#34d399">B2</text>
            <text x="424" y="162" font-size="12" font-weight="600" fill="#34d399">"inglés avanzado" de las ofertas</text>

            <rect x="380" y="114" width="270" height="26" rx="6" fill="#f59e0b" opacity="0.15"/>
            <text x="392" y="132" font-size="12.5" font-weight="800" fill="currentColor">C1</text>
            <text x="424" y="132" font-size="12" fill="currentColor" opacity="0.6">preciso y flexible</text>
          </g>

          <text x="515" y="88" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.65">De A1 a B2:</text>
          <text x="515" y="66" text-anchor="middle" font-size="17" font-weight="800" fill="#f59e0b">500-700 horas</text>
          <text x="515" y="46" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.55">~2 años a 45 min/día</text>

          <text x="340" y="288" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.6">
            No hay atajo. Lo que sí hay es constancia: 20 min todos los días &gt; 3 horas el domingo.
          </text>
        </svg>`,
        pie: 'Izquierda: el alfabeto por grupos de rima. Derecha: dónde estás y dónde está el objetivo real.',
      },

      escucha: {
        intro: '<p>Deletreo y frases de presentación. Escribí las letras <b>separadas por espacios</b> ' +
               'cuando sea deletreo (por ejemplo: <code>A N N A</code>).</p>',
        items: [
          { texto: 'My name is Anna.', es: 'Me llamo Anna.',
            nota: 'La frase con la que arranca cualquier presentación. Vale la pena que salga automática.' },
          { texto: 'Can you spell that, please?', es: '¿Podés deletrear eso, por favor?',
            nota: 'Guardala. En una call con audio malo la vas a usar todo el tiempo — y es mucho mejor que quedarte callado.' },
          { texto: 'It is J for July.', es: 'Es J, de July.',
            nota: 'Así se aclara una letra confusa: <i>X for Y</i>. Sirve justo para las que se parecen: G/J, E/I.' },
        ],
      },

      practica: `
        <p><b>Deletreá tu propio nombre y apellido en voz alta.</b> Ahora, no después. Es lo primero que te van a
        pedir en cualquier call y es sorprendente lo mucho que traba la primera vez.</p>

        <p>Después deletreá tu dirección de mail completa, con el <i>at</i> y los <i>dot</i>. Por ejemplo:
        <span class="en" data-say>a n a - at - gmail - dot - com</span>.</p>

        <p><b>Armá tu rutina antes de seguir.</b> Elegí un horario fijo y un mínimo diario que puedas cumplir
        <i>hasta en un día malo</i>. Que sea chico: quince minutos que se cumplen valen más que una hora que se
        abandona a la semana. El pomodoro de esta plataforma está para eso.</p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Alguien te dice su mail y escuchás "j" al principio. ¿Cuál de estas letras se le parece más y conviene confirmar?',
          opciones: ['K', 'G', 'L', 'A'],
          correcta: 1,
          porQue: '<b>G</b> ("dchi") y <b>J</b> ("dchei") son el par que más se confunde. Por eso se aclara: <i>J for July</i>.',
          porQueNo: {
            0: '<b>K</b> suena "kei" — se parece a la A, no a la J.',
            2: '<b>L</b> suena "el", del grupo que arranca con "e". No se confunde con J.',
            3: '<b>A</b> suena "ei". Se puede confundir con K, pero no con J.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>¿Podés deletrear eso, por favor?</b>',
          respuesta: 'Can you spell that, please?',
          respuestas: ['Can you spell that please', 'Could you spell that, please?', 'Could you spell that please'],
          pista: 'El verbo «deletrear» es <i>spell</i>.',
          porQue: 'Con <b>could</b> suena un poco más cortés que con <b>can</b>, pero las dos están perfectas en una call de trabajo.',
        },
        {
          tipo: 'hueco',
          p: 'Completá con el símbolo dicho en inglés: en un mail, la <b>@</b> se dice ______.',
          respuesta: 'at',
          porQue: '<b>at</b>. Y el punto es <b>dot</b>: <i>ana at gmail dot com</i>.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá la presentación: «Me llamo John y trabajo acá.»',
          respuesta: 'My name is John and I work here',
          porQue: 'Es la estructura mínima de una presentación, y todo lo que necesitás para el módulo siguiente.',
        },
      ],

      errores: [
        { mito: 'El alfabeto es lo más básico, lo salteo.',
          realidad: 'Es de lo que más se usa en trabajo remoto: deletrear tu apellido, tu mail, un código de reunión, ' +
                    'el nombre de una rama de git. Y es de lo poco que se aprende <b>completo</b> en veinte minutos. ' +
                    'La relación esfuerzo/utilidad es de las mejores de todo el track.' },
        { mito: 'Para aprender rápido conviene meterle muchas horas los fines de semana.',
          realidad: 'La memoria a largo plazo se consolida con <b>repetición espaciada y sueño</b>, no con volumen concentrado. ' +
                    'Cinco sesiones de 20 minutos en cinco días le ganan a una de 100 minutos. No es motivación barata: ' +
                    'es cómo funciona la consolidación.' },
        { mito: 'Necesito llegar a C1 o C2 para trabajar en inglés.',
          realidad: 'Casi ninguna oferta pide eso. <b>B2 alcanza</b> para la enorme mayoría de los puestos técnicos: podés seguir ' +
                    'una reunión, explicar tu trabajo y discutir una decisión. C1 y C2 importan si tu trabajo <i>es</i> el idioma ' +
                    '(traducción, redacción, negociación legal).' },
      ],

      glosario: [
        { t: 'CEFR / MCER', d: 'Marco Común Europeo de Referencia. La escala A1-C2 que usan las ofertas laborales y los exámenes. "Inglés avanzado" en una oferta suele significar B2.' },
        { t: 'Spell', d: 'Deletrear. <i>How do you spell it?</i> = ¿Cómo se escribe? Es distinto de <i>write</i>, que es escribir.' },
        { t: 'Double', d: 'Se usa al deletrear una letra repetida: <i>Anna</i> se deletrea "A - double N - A".' },
        { t: 'Alfabeto OTAN', d: 'Alpha, Bravo, Charlie… El sistema para deletrear cuando el audio está malo. Lo vas a escuchar en soporte técnico.' },
      ],
    },
  ],

  /* ==================================================================== */
  vocabulario: [
    { en: 'hello', es: 'hola', ejemplo: 'Hello, my name is Ana.', ejemploEs: 'Hola, me llamo Ana.' },
    { en: 'thank you', es: 'gracias', alternativas: ['thanks'], ejemplo: 'Thank you very much.', ejemploEs: 'Muchas gracias.' },
    { en: 'please', es: 'por favor', ejemplo: 'Can you repeat that, please?', ejemploEs: '¿Podés repetir eso, por favor?' },
    { en: 'sorry', es: 'perdón', ejemplo: 'Sorry, I did not hear you.', ejemploEs: 'Perdón, no te escuché.' },
    { en: 'yes', es: 'sí', ejemplo: 'Yes, that is right.', ejemploEs: 'Sí, es correcto.' },
    { en: 'no', es: 'no', ejemplo: 'No, that is not what I meant.', ejemploEs: 'No, no es lo que quise decir.' },
    { en: 'name', es: 'nombre', ejemplo: 'What is your name?', ejemploEs: '¿Cómo te llamás?' },
    { en: 'work', es: 'trabajar', pista: 'También es el sustantivo «trabajo».', ejemplo: 'I work from home.', ejemploEs: 'Trabajo desde casa.' },
    { en: 'live', es: 'vivir', pista: 'Vocal corta. No confundir con leave.', ejemplo: 'I live in Argentina.', ejemploEs: 'Vivo en Argentina.' },
    { en: 'leave', es: 'irse', pista: 'Vocal larga. El par de live.', ejemplo: 'I leave at six.', ejemploEs: 'Me voy a las seis.' },
    { en: 'think', es: 'pensar', pista: 'Con la th sorda: solo aire.', ejemplo: 'I think it is easy.', ejemploEs: 'Creo que es fácil.' },
    { en: 'people', es: 'gente', pista: 'Es plural: "people are", nunca "people is".', ejemplo: 'The people here are nice.', ejemploEs: 'La gente de acá es amable.' },
    { en: 'water', es: 'agua', ejemplo: 'Can I have some water?', ejemploEs: '¿Me das un poco de agua?' },
    { en: 'three', es: 'tres', pista: 'Th sorda + r. Es la palabra de práctica clásica.', ejemplo: 'I have three brothers.', ejemploEs: 'Tengo tres hermanos.' },
    { en: 'this', es: 'esto / este', pista: 'Th sonora: vibra la garganta.', ejemplo: 'This is my desk.', ejemploEs: 'Este es mi escritorio.' },
    { en: 'question', es: 'pregunta', ejemplo: 'I have a question.', ejemploEs: 'Tengo una pregunta.' },
    { en: 'word', es: 'palabra', ejemplo: 'I do not know that word.', ejemploEs: 'No conozco esa palabra.' },
    { en: 'spell', es: 'deletrear', ejemplo: 'How do you spell your name?', ejemploEs: '¿Cómo se deletrea tu nombre?' },
    { en: 'repeat', es: 'repetir', ejemplo: 'Could you repeat that?', ejemploEs: '¿Podrías repetir eso?' },
    { en: 'slowly', es: 'despacio', ejemplo: 'Please speak more slowly.', ejemploEs: 'Por favor hablá más despacio.' },
    { en: 'understand', es: 'entender', ejemplo: 'I do not understand.', ejemploEs: 'No entiendo.' },
    { en: 'again', es: 'de nuevo', ejemplo: 'Can you say it again?', ejemploEs: '¿Lo podés decir de nuevo?' },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Por qué en inglés no se puede deducir la pronunciación de una palabra a partir de cómo se escribe?',
      opciones: [
        'Porque la ortografía se congeló mientras la pronunciación seguía cambiando, y además se importaron palabras conservando su grafía original',
        'Porque el inglés no tiene reglas de pronunciación de ningún tipo',
        'Porque cada región lo pronuncia distinto y no hay un estándar',
        'Porque el alfabeto inglés tiene menos letras que el español',
      ],
      correcta: 0,
      porQue: 'La escritura se fijó con la imprenta en el siglo XV, justo durante el Gran Desplazamiento Vocálico. Encima el inglés absorbió vocabulario de todos lados sin adaptar la grafía. Resultado: 26 letras para unos 44 fonemas.',
      porQueNo: {
        1: 'Sí hay tendencias — bastante fuertes, incluso. Lo que no hay es un sistema sin excepciones como el del español.',
        2: 'Las variantes regionales existen, pero no son la causa: <i>through</i> y <i>though</i> se pronuncian distinto en todas las variantes.',
        3: 'Tiene una menos (26 contra 27). La cantidad de letras no es el problema; la relación letra-sonido sí.',
      },
    },
    {
      p: '¿Cuál de estos pares es un ejemplo de que cambiar un solo sonido cambia el significado?',
      opciones: ['ship / sheep', 'color / colour', 'can not / cannot', 'ok / okay'],
      correcta: 0,
      porQue: '<b>ship</b> es barco y <b>sheep</b> es oveja. Los separa solo la vocal: /ɪ/ laxa contra /iː/ tensa. Eso es un par mínimo.',
      porQueNo: {
        1: 'Son la misma palabra escrita distinto: <i>color</i> en EE.UU., <i>colour</i> en el Reino Unido. Mismo significado.',
        2: 'Son la misma expresión, junta o separada. No cambia el significado.',
        3: 'Dos formas de escribir lo mismo. No hay contraste de sonido que cambie el sentido.',
      },
    },
    {
      p: 'Estás diciendo <span class="en" data-say>think</span> y sentís que vibra la garganta. ¿Qué está pasando?',
      opciones: [
        'Está bien: think lleva la th sonora',
        'Estás usando la th sonora /ð/ en vez de la sorda /θ/, que es solo aire',
        'Es normal, las dos versiones de th vibran igual',
        'Significa que la estás pronunciando como una s',
      ],
      correcta: 1,
      porQue: '<b>think</b> lleva /θ/, la sorda: sale aire y nada más. La sonora /ð/ es la de <i>this</i> y <i>mother</i>. La prueba de la mano en la garganta las separa.',
      porQueNo: {
        0: '<i>think</i>, <i>three</i> y <i>thank</i> son sordas. Las sonoras son <i>this</i>, <i>the</i>, <i>mother</i>.',
        2: 'Justamente lo que las distingue es que una vibra y la otra no.',
        3: 'Si sonara como una s tampoco vibraría — la /s/ también es sorda. La vibración indica lo contrario.',
      },
    },
    {
      p: 'La frase <span class="en" data-say>I want to go to the party</span> tiene ocho palabras. ¿Cuántas sílabas se dicen fuerte?',
      opciones: ['Ocho', 'Seis', 'Tres', 'Ninguna, todas suenan igual'],
      correcta: 2,
      porQue: 'Tres golpes: <b>WANT</b>, <b>GO</b> y <b>PAR</b>-ty. Lo demás son palabras funcionales que se comprimen casi hasta desaparecer.',
      porQueNo: {
        0: 'Eso sería ritmo silábico, que es el del español. En inglés la cantidad de palabras no determina la cantidad de acentos.',
        1: 'Solo llevan acento las palabras con contenido: sustantivos, verbos principales y adjetivos. Acá son tres.',
        3: 'Si todas sonaran igual el inglés sería de ritmo silábico, y no lo es.',
      },
    },
    {
      p: '¿Cuál es la razón principal de que te cueste entender a un nativo hablando normal?',
      opciones: [
        'Que hablan a más palabras por minuto que en español',
        'Que comprimen y enlazan todo lo que no lleva acento, así que las palabras no suenan completas ni separadas',
        'Que usan vocabulario mucho más difícil del que aparece en los libros',
        'Que la gramática hablada es distinta de la escrita',
      ],
      correcta: 1,
      porQue: 'Es la compresión, no la velocidad. <i>want to</i> suena "wanna", <i>have to</i> suena "hafta", <i>did you</i> suena "didchu". Vos esperás palabras completas y separadas, y no es lo que se dice.',
      porQueNo: {
        0: 'La velocidad medida en sílabas por segundo es parecida. Lo que cambia es cuánto se reduce lo átono.',
        2: 'El vocabulario cotidiano es bastante limitado. El problema aparece con palabras que ya conocés y no reconocés al oírlas.',
        3: 'Hay diferencias de registro, pero la estructura es la misma. El obstáculo es fonético.',
      },
    },
    {
      p: '¿Qué es el <i>schwa</i> /ə/?',
      opciones: [
        'Una consonante que no existe en español',
        'La vocal neutra y relajada de las sílabas sin acento — el sonido más frecuente del inglés',
        'La forma de marcar que una vocal es larga',
        'El acento británico de la letra a',
      ],
      correcta: 1,
      porQue: 'Es la vocal que sale sin hacer esfuerzo, y aparece en cerca de una de cada tres sílabas. Está en la primera de <i>about</i> y en la última de <i>problem</i>.',
      porQueNo: {
        0: 'Es una vocal, no una consonante.',
        2: 'La longitud se marca con el símbolo ː, como en /iː/. El schwa es corto por definición.',
        3: 'No es de ninguna variante en particular: aparece en todas.',
      },
    },
    {
      p: 'Un hispanohablante dice "Espanish" en vez de <span class="en" data-say>Spanish</span>. ¿Por qué pasa?',
      opciones: [
        'Porque no sabe cómo se escribe la palabra',
        'Porque el español no admite grupos de /s/ + consonante al principio de palabra, y el aparato fonológico agrega una e automáticamente',
        'Porque en inglés esa s efectivamente lleva una e delante',
        'Porque está traduciendo mentalmente desde el español',
      ],
      correcta: 1,
      porQue: 'Es una restricción del sistema del español — por eso <i>school</i> se volvió <i>escuela</i> y <i>Spain</i>, <i>España</i>. Ocurre sin que lo decidas. Se corrige arrancando con el siseo, sin abrir la boca antes.',
      porQueNo: {
        0: 'Pasa igual sabiendo perfectamente cómo se escribe: es un automatismo motor, no un problema de ortografía.',
        2: 'No lleva ninguna e. Arranca directo con /s/.',
        3: 'Traducir mentalmente causa otros problemas, pero este es puramente fonológico.',
      },
    },
    {
      p: '¿Qué significa que un error de pronunciación se "fosilice"?',
      opciones: [
        'Que es un error que cometen todos los que aprenden el idioma',
        'Que se automatizó de tanto repetirlo y ya no se corrige solo, aunque sepas cuál es la forma correcta',
        'Que viene de una forma antigua del inglés que ya no se usa',
        'Que solo aparece cuando hablás rápido',
      ],
      correcta: 1,
      porQue: 'Es un hábito motor consolidado. Podés saber perfectamente que <i>think</i> lleva /θ/ y seguir diciendo "sink" sin darte cuenta. Es la razón de que este módulo vaya primero.',
      porQueNo: {
        0: 'Que sea común no tiene nada que ver: fosilizar describe que quedó fijado en <i>tu</i> forma de hablar.',
        2: 'Eso sería un arcaísmo. La fosilización es del que aprende, no del idioma.',
        3: 'Justamente lo contrario: aparece siempre, incluso hablando despacio y con atención.',
      },
    },
    {
      p: 'En una call te dicen una dirección de mail. ¿Cómo se dicen <b>@</b> y <b>.</b> en inglés?',
      opciones: ['arroba y punto', 'at y dot', 'a y point', 'at y period'],
      correcta: 1,
      porQue: '<b>at</b> y <b>dot</b>. Una dirección se lee así: "ana at gmail dot com".',
      porQueNo: {
        0: 'Son las palabras en español. En inglés no se usan.',
        2: '<i>point</i> se usa para los decimales de un número, no para el punto de una URL o un mail.',
        3: '<i>period</i> es el punto final de una oración escrita. En direcciones se dice <i>dot</i>.',
      },
    },
    {
      p: 'Cuando una oferta laboral pide "inglés avanzado", ¿a qué nivel del CEFR suele referirse?',
      opciones: ['A2', 'B1', 'B2', 'C2'],
      correcta: 2,
      porQue: '<b>B2</b>: podés seguir una reunión, explicar tu trabajo y discutir una decisión con nativos sin que ninguno de los dos haga un esfuerzo especial. Es el objetivo realista de esta escalera.',
      porQueNo: {
        0: 'A2 son intercambios simples y rutinarios. No alcanza para trabajar en inglés.',
        1: 'B1 te permite arreglarte solo en temas conocidos, pero todavía no seguir una discusión técnica con fluidez.',
        3: 'C2 es prácticamente nivel de nativo culto. Casi ninguna oferta técnica lo pide.',
      },
    },
    {
      p: 'Estás aprendiendo una palabra nueva. ¿Cuál es el orden que evita fosilizar mal la pronunciación?',
      opciones: [
        'Leerla primero en voz alta y después escucharla para corregir',
        'Escucharla primero y recién después leerla o decirla',
        'Escribirla varias veces hasta memorizar la grafía',
        'Aprender primero la traducción y dejar el sonido para más adelante',
      ],
      correcta: 1,
      porQue: 'Si la leés primero, tu cerebro le asigna sonidos del español y después estás corrigiendo en vez de aprendiendo. Escuchar primero evita crear el hábito equivocado.',
      porQueNo: {
        0: 'Es el orden más común y el que más errores fosiliza. La primera versión que producís es la que se te queda.',
        2: 'Sirve para la ortografía y no aporta nada al sonido — que es justamente lo que la escritura inglesa no te dice.',
        3: 'Dejar el sonido para después es exactamente lo que este módulo desaconseja: se corrige mucho más caro más tarde.',
      },
    },
    {
      p: 'En <span class="en" data-say>She works at a school</span>, ¿qué error típico del hispanohablante cambia el significado gramatical?',
      opciones: [
        'Comerse la s final de works',
        'Pronunciar school con una e adelante',
        'Decir at en vez de in',
        'Pronunciar la a como en español',
      ],
      correcta: 0,
      porQue: 'La <b>-s</b> de <i>works</i> es lo que marca la tercera persona. Comértela convierte la frase en agramatical. Los otros errores marcan acento, pero no rompen la gramática.',
      porQueNo: {
        1: 'Suena a acento español, sí, pero <i>school</i> se sigue entendiendo perfecto. No cambia nada gramatical.',
        2: '<i>at a school</i> es correcto. Sería otro tema, no un error de pronunciación.',
        3: 'Afecta el acento, no la gramática.',
      },
    },
  ],
});
