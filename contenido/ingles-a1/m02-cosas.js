/* ==========================================================================
   Inglés A1 · m02 — Cosas: artículos y plurales
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ingles-a1',
  id: 'm02',
  titulo: 'Cosas: artículos y plurales',
  fuentes: ['cambridge-dic', 'wordreference', 'bbc-learning-english'],

  intro:
    '<p>Nombrar cosas. Suena elemental y tiene tres trampas que un hispanohablante pisa siempre: ' +
    '<b>cuándo va <i>the</i> y cuándo no va nada</b>, los plurales que no llevan <i>-s</i>, y las palabras ' +
    'que en inglés no se pueden contar aunque en español sí.</p>' +
    '<p>Ninguna te impide comunicarte, pero las tres se notan mucho. Y son de las pocas cosas del idioma ' +
    'que se arreglan con una regla clara.</p>',

  lecciones: [

    /* ==================================================================== */
    {
      id: 'l1',
      titulo: 'a, an, the… y nada',
      minutos: 9,

      simple: `
        <p>El inglés tiene tres opciones donde el español tiene dos. La tercera —<b>no poner nada</b>—
        es la que más cuesta, porque en español casi siempre va algo.</p>

        <h4>a / an — uno cualquiera</h4>
        <p>Cuando es algo que aparece por primera vez, o cualquiera de su tipo:</p>
        <ul>
          <li><span class="en" data-say>I have a question</span> — una pregunta, cualquiera</li>
          <li><span class="en" data-say>She is an engineer</span> — una ingeniera entre muchas</li>
        </ul>
        <p><b>an</b> va antes de <b>sonido</b> de vocal, no de letra vocal. Esta distinción importa:</p>
        <ul>
          <li><span class="en" data-say>an hour</span> — la <i>h</i> es muda, arranca con vocal</li>
          <li><span class="en" data-say>a university</span> — arranca con sonido de "y", que es consonante</li>
          <li><span class="en" data-say>an SSD</span> — se lee "es-es-di", arranca con vocal</li>
        </ul>

        <h4>the — ese, el que los dos sabemos cuál es</h4>
        <ul>
          <li><span class="en" data-say>Can you send me the file?</span> — el archivo del que veníamos hablando</li>
          <li><span class="en" data-say>The meeting is at three</span> — la reunión, esa</li>
        </ul>
        <p>La secuencia típica es: primero <b>a</b>, después <b>the</b>.
        <span class="en" data-say>I found a bug. The bug is in the login.</span></p>

        <h4>Nada — hablando en general</h4>
        <p>Acá está la diferencia grande con el español. Cuando hablás de algo <b>en general</b>,
        en inglés no va artículo:</p>
        <div class="aviso">
          ❌ <i>The dogs are friendly</i> (si querés decir «los perros son amigables» en general)<br>
          ✅ <span class="en" data-say>Dogs are friendly</span><br><br>
          ❌ <i>I like the coffee</i> (si te gusta el café en general)<br>
          ✅ <span class="en" data-say>I like coffee</span><br><br>
          ❌ <i>The developers work a lot</i><br>
          ✅ <span class="en" data-say>Developers work a lot</span>
        </div>
        <p>Poner <i>the</i> ahí cambia el sentido: <i>I like the coffee</i> significa «me gusta <b>este</b>
        café», el que estoy tomando.</p>

        <p>Tampoco va con nombres propios, idiomas ni la mayoría de países:
        <span class="en" data-say>I speak Spanish</span>, <span class="en" data-say>She lives in Brazil</span>.</p>
      `,

      tecnico: `
        <p>Los tres valores son <b>indefinido</b> (<i>a/an</i>), <b>definido</b> (<i>the</i>) y
        <b>cero</b> (∅). El artículo cero no es "ausencia de artículo": es una opción con significado
        propio — la lectura <b>genérica</b> o de masa.</p>

        <table>
          <tr><th>Forma</th><th>Cuándo</th><th>Ejemplo</th></tr>
          <tr><td>a / an</td><td>contable singular, primera mención</td><td>I have a bug</td></tr>
          <tr><td>the</td><td>identificable por los dos hablantes</td><td>The bug is critical</td></tr>
          <tr><td>∅ (nada)</td><td>plural o incontable, sentido genérico</td><td>Bugs are normal</td></tr>
        </table>

        <div class="nota-tec">
          <b>Por qué el español confunde acá.</b> El español usa el artículo definido también para el
          genérico: «<i>Los</i> perros son amigables», «me gusta <i>el</i> café». El inglés reserva
          <i>the</i> exclusivamente para referentes identificables. Traducir literalmente produce
          <i>The dogs are friendly</i>, que un nativo entiende como «esos perros de ahí son amigables».
          <br><br>
          No es un error de gramática: es un <b>error de significado</b>. Por eso conviene corregirlo.
        </div>

        <p><b>Los casos que más aparecen en trabajo:</b></p>
        <ul>
          <li><b>Idiomas sin artículo:</b> <i>I speak English</i>, no ❌ <i>the English</i>.</li>
          <li><b>Países sin artículo</b>, salvo los que llevan un sustantivo común o son plurales:
          <i>the United States</i>, <i>the Netherlands</i>, <i>the UK</i>. Pero <i>Argentina</i>, <i>Brazil</i>, <i>Spain</i>.</li>
          <li><b>Instituciones sin artículo cuando hablás de la función</b>: <i>go to work</i>,
          <i>at home</i>, <i>in bed</i>. Con artículo si hablás del edificio: <i>go to the office</i>.</li>
          <li><b>Tecnologías y lenguajes sin artículo:</b> <i>I use React</i>, <i>written in Python</i>.</li>
        </ul>

        <p><b>La regla de <i>a</i> vs <i>an</i> es fonológica</b>, y por eso las siglas se comportan según
        cómo se <b>leen</b>: <i>an API</i> ("ei-pi-ai"), <i>an SQL query</i> si decís "es-kiu-el",
        pero <i>a SQL query</i> si lo leés "síkuel". Las dos formas circulan.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Árbol de decisión para elegir entre a, an, the o nada">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">¿Qué artículo va?</text>

          <rect x="250" y="38" width="180" height="34" rx="8" fill="#f59e0b" opacity="0.22" stroke="#f59e0b" stroke-width="1.4"/>
          <text x="340" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">¿Hablás en general?</text>

          <line x1="290" y1="72" x2="150" y2="104" stroke="currentColor" opacity="0.3" stroke-width="1.4"/>
          <text x="196" y="88" font-size="11.5" font-weight="700" fill="#34d399">SÍ</text>
          <line x1="390" y1="72" x2="500" y2="104" stroke="currentColor" opacity="0.3" stroke-width="1.4"/>
          <text x="462" y="88" font-size="11.5" font-weight="700" fill="#f87171">NO</text>

          <rect x="40" y="108" width="220" height="76" rx="9" fill="#34d399" opacity="0.13" stroke="#34d399" stroke-width="1.4"/>
          <text x="150" y="132" text-anchor="middle" font-size="18" font-weight="800" fill="#34d399">nada</text>
          <text x="150" y="152" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.8">Dogs are friendly</text>
          <text x="150" y="170" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.8">I like coffee</text>

          <rect x="400" y="108" width="240" height="34" rx="8" fill="#22d3ee" opacity="0.18" stroke="#22d3ee" stroke-width="1.3"/>
          <text x="520" y="130" text-anchor="middle" font-size="12.5" font-weight="700" fill="currentColor">¿Los dos saben cuál es?</text>

          <line x1="460" y1="142" x2="410" y2="172" stroke="currentColor" opacity="0.3" stroke-width="1.4"/>
          <text x="424" y="160" font-size="11" font-weight="700" fill="#34d399">SÍ</text>
          <line x1="580" y1="142" x2="600" y2="172" stroke="currentColor" opacity="0.3" stroke-width="1.4"/>
          <text x="600" y="160" font-size="11" font-weight="700" fill="#f87171">NO</text>

          <rect x="308" y="176" width="150" height="66" rx="9" fill="#c084fc" opacity="0.14" stroke="#c084fc" stroke-width="1.4"/>
          <text x="383" y="200" text-anchor="middle" font-size="18" font-weight="800" fill="#c084fc">the</text>
          <text x="383" y="220" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.8">Send me the file</text>
          <text x="383" y="236" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">el de siempre</text>

          <rect x="474" y="176" width="166" height="66" rx="9" fill="#fbbf24" opacity="0.14" stroke="#fbbf24" stroke-width="1.4"/>
          <text x="557" y="200" text-anchor="middle" font-size="18" font-weight="800" fill="#fbbf24">a / an</text>
          <text x="557" y="220" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.8">I have a question</text>
          <text x="557" y="236" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.55">uno cualquiera</text>

          <rect x="40" y="256" width="600" height="26" rx="7" fill="#f87171" opacity="0.1"/>
          <text x="340" y="273" text-anchor="middle" font-size="12" font-weight="600" fill="#f87171">
            an va por SONIDO de vocal: an hour · a university · an API
          </text>
        </svg>`,
        pie: 'Dos preguntas y ya sabés cuál de los tres va. La rama del "nada" es la que el español no tiene.',
      },

      escucha: {
        intro: '<p>Prestá atención a si hay artículo o no. Son sonidos chiquitos y comprimidos, ' +
               'pero cambian el sentido.</p>',
        items: [
          { texto: 'I have a question about the design.', es: 'Tengo una pregunta sobre el diseño.',
            nota: 'Los dos artículos en una frase: <b>a</b> para la pregunta (nueva) y <b>the</b> para el diseño (el que ya conocemos).' },
          { texto: 'Developers use this tool every day.', es: 'Los desarrolladores usan esta herramienta todos los días.',
            nota: 'Sin artículo, porque habla de los desarrolladores <b>en general</b>. Poner <i>the</i> acá cambiaría el sentido.' },
          { texto: 'It takes an hour to deploy.', es: 'Tarda una hora en desplegarse.',
            nota: '<b>an hour</b>, no <i>a hour</i>: la <i>h</i> es muda y la palabra arranca con vocal.' },
          { texto: 'I speak Spanish and a little English.', es: 'Hablo español y un poco de inglés.',
            nota: 'Los idiomas van sin artículo. ❌ <i>the Spanish</i> sería «los españoles».' },
        ],
      },

      practica: `
        <p><b>El test de los dos segundos.</b> Antes de poner <i>the</i>, preguntate: «¿mi interlocutor
        sabe exactamente cuál?» Si la respuesta es no, o si estás hablando en general, no va <i>the</i>.</p>

        <p><b>Frases que vas a usar seguido, para tenerlas de memoria:</b></p>
        <ul>
          <li><span class="en" data-say>I have a question</span></li>
          <li><span class="en" data-say>Can you check the logs?</span></li>
          <li><span class="en" data-say>I work with React</span> — sin artículo, es una tecnología</li>
          <li><span class="en" data-say>I'm going to the office tomorrow</span></li>
          <li><span class="en" data-say>I work from home</span> — sin artículo, es la función, no el edificio</li>
        </ul>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Querés decir que te gusta el café, en general. ¿Cuál va?',
          opciones: ['I like the coffee.', 'I like coffee.', 'I like a coffee.', 'I like coffees.'],
          correcta: 1,
          porQue: 'En sentido general va <b>sin artículo</b>. Es el punto donde el español y el inglés se separan más.',
          porQueNo: {
            0: 'Eso significa «me gusta <b>este</b> café», el que estás tomando ahora.',
            2: '<i>a coffee</i> es una taza puntual: <i>I\'d like a coffee</i> = quiero un café.',
            3: '<i>coffee</i> como bebida en general es incontable, no lleva plural.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá con <b>a</b> o <b>an</b>: <b>The deploy takes ______ hour.</b>',
          respuesta: 'an',
          porQue: 'La <i>h</i> de <b>hour</b> es muda, así que la palabra arranca con sonido de vocal. La regla es fonética, no ortográfica.',
        },
        {
          tipo: 'hueco',
          p: 'Completá con <b>a</b> o <b>an</b>: <b>She works at ______ university.</b>',
          respuesta: 'a',
          porQue: '<b>university</b> arranca con el sonido de "y" (/j/), que es consonante — aunque la letra sea vocal.',
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Tengo una pregunta.</b>',
          respuesta: 'I have a question',
          porQue: 'Primera mención, contable, singular → <b>a</b>. Es la frase que más vas a usar en una reunión.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «¿Me podés mandar el archivo?»',
          respuesta: 'Can you send me the file',
          porQue: '<b>the file</b> porque los dos saben de qué archivo se habla. Si fuera nuevo sería <i>a file</i>.',
        },
      ],

      errores: [
        { mito: 'Si en español lleva «el» o «la», en inglés lleva <i>the</i>.',
          realidad: 'No cuando hablás <b>en general</b>. «Los perros son amigables» es <i>Dogs are friendly</i>, sin artículo. ' +
                    'El español usa el definido para lo genérico y el inglés no — <i>the</i> es solo para lo identificable.' },
        { mito: '<i>an</i> se usa antes de las letras a, e, i, o, u.',
          realidad: 'Antes del <b>sonido</b> de vocal. Por eso <i>an hour</i> (h muda) y <i>a university</i> ' +
                    '(arranca con sonido de y). Con siglas depende de cómo se lean: <i>an API</i>, <i>an SSD</i>.' },
        { mito: 'Los idiomas y países llevan artículo, como en español.',
          realidad: '<i>I speak English</i>, <i>She lives in Brazil</i> — sin artículo. Las excepciones son los países ' +
                    'con un sustantivo común o en plural: <i>the United States</i>, <i>the Netherlands</i>, <i>the UK</i>.' },
      ],

      glosario: [
        { t: 'Artículo indefinido', d: '<i>a</i> / <i>an</i>. Uno cualquiera de su tipo, o primera mención.' },
        { t: 'Artículo definido', d: '<i>the</i>. El que los dos hablantes pueden identificar.' },
        { t: 'Artículo cero', d: 'No poner nada. Marca sentido genérico o de masa: <i>Dogs are friendly</i>.' },
        { t: 'Genérico', d: 'Hablar de una categoría entera, no de un ejemplar. En inglés va sin artículo.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l2',
      titulo: 'Plurales: los que se portan bien y los que no',
      minutos: 8,

      simple: `
        <p>La regla básica es cómoda: se agrega <b>-s</b>. <i>bug → bugs</i>, <i>file → files</i>.
        Después hay cuatro grupitos de excepciones que sí conviene saber.</p>

        <h4>1. -es cuando la palabra termina en sonido siseante</h4>
        <p>Si termina en <b>s, sh, ch, x, z</b> se agrega <b>-es</b>, porque pegarle una <i>s</i> sola
        sería impronunciable:</p>
        <ul>
          <li>class → <span class="en" data-say>classes</span></li>
          <li>branch → <span class="en" data-say>branches</span></li>
          <li>box → <span class="en" data-say>boxes</span></li>
        </ul>

        <h4>2. Consonante + y → -ies</h4>
        <ul>
          <li>country → <span class="en" data-say>countries</span></li>
          <li>company → <span class="en" data-say>companies</span></li>
          <li>query → <span class="en" data-say>queries</span></li>
        </ul>
        <p>Pero si antes de la <i>y</i> hay una vocal, va <b>-s</b> normal:
        <span class="en" data-say>days</span>, <span class="en" data-say>keys</span>.</p>

        <h4>3. Los irregulares — se memorizan</h4>
        <table>
          <tr><th>Singular</th><th>Plural</th><th></th></tr>
          <tr><td>man</td><td><b>men</b></td><td>hombre</td></tr>
          <tr><td>woman</td><td><b>women</b></td><td>mujer · se dice "wi-men"</td></tr>
          <tr><td>child</td><td><b>children</b></td><td>chico</td></tr>
          <tr><td>person</td><td><b>people</b></td><td>persona</td></tr>
          <tr><td>foot</td><td><b>feet</b></td><td>pie</td></tr>
          <tr><td>tooth</td><td><b>teeth</b></td><td>diente</td></tr>
        </table>

        <h4>4. Los que no cambian</h4>
        <p><span class="en" data-say>one fish, two fish</span> · <i>sheep</i> · <i>series</i> ·
        <i>species</i>. Se ven iguales en singular y plural.</p>

        <div class="aviso">
          <b>La trampa grande: <i>people</i> es plural.</b><br>
          ❌ <i>People is nice</i> → ✅ <span class="en" data-say>People are nice</span><br>
          Y para «una persona» va <b>a person</b>, no ❌ <i>a people</i>.
        </div>
      `,

      tecnico: `
        <p>El plural regular tiene una sola forma escrita (<i>-s</i> / <i>-es</i>) pero <b>tres
        pronunciaciones</b>, elegidas por asimilación con el sonido anterior:</p>

        <table>
          <tr><th>Se dice</th><th>Cuándo</th><th>Ejemplos</th></tr>
          <tr><td>/s/</td><td>después de sonido sordo</td><td>bugs no — bits, maps, checks</td></tr>
          <tr><td>/z/</td><td>después de sonido sonoro o vocal</td><td>bugs, files, days, keys</td></tr>
          <tr><td>/ɪz/</td><td>después de siseante (s, sh, ch, x, z)</td><td>classes, branches, boxes</td></tr>
        </table>

        <div class="nota-tec">
          No hay que estudiarlo: sale solo si prestás atención al escuchar, porque es lo que la boca
          hace naturalmente. Lo importante es <b>no comerse la marca</b>, que es el error real del
          hispanohablante. La misma regla vale para la <i>-s</i> de tercera persona del verbo
          (módulo 3) y para el genitivo <i>'s</i>.
        </div>

        <p><b>Sobre los irregulares.</b> Son restos de sistemas más antiguos. <i>man/men</i>,
        <i>foot/feet</i> y <i>tooth/teeth</i> vienen de la <b>mutación vocálica</b> germánica: el plural
        no agregaba nada, cambiaba la vocal de la raíz. <i>children</i> y <i>oxen</i> conservan un
        plural en <i>-en</i> del inglés antiguo. Son pocos y muy frecuentes — se aprenden por uso.</p>

        <p><b>Sobre <i>people</i>.</b> Es el plural supletivo de <i>person</i>: se usa como plural
        normal y lleva verbo en plural. <i>Persons</i> existe pero está restringido al lenguaje
        jurídico o a carteles. Y <i>peoples</i> (con -s) significa «pueblos», grupos étnicos, que es
        otra cosa.</p>

        <p><b>Plurales que vas a ver en tecnología:</b></p>
        <ul>
          <li><i>index</i> → <b>indexes</b> o <b>indices</b> (las dos se usan; <i>indices</i> es más matemático)</li>
          <li><i>matrix</i> → <b>matrices</b> · <i>vertex</i> → <b>vertices</b></li>
          <li><i>schema</i> → <b>schemas</b> o <b>schemata</b> (la segunda ya casi no se usa)</li>
          <li><i>data</i> es técnicamente plural de <i>datum</i>, pero hoy se usa como incontable:
          <i>the data is ready</i> es lo normal.</li>
        </ul>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Reglas de formación del plural en inglés">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Cómo se arma el plural</text>

          <g>
            <rect x="26" y="40" width="150" height="98" rx="9" fill="#34d399" opacity="0.12" stroke="#34d399" stroke-width="1.3"/>
            <text x="101" y="64" text-anchor="middle" font-size="16" font-weight="800" fill="#34d399">+ s</text>
            <text x="101" y="84" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">la mayoría</text>
            <text x="101" y="106" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">bug → bugs</text>
            <text x="101" y="124" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">file → files</text>
          </g>

          <g>
            <rect x="190" y="40" width="150" height="98" rx="9" fill="#22d3ee" opacity="0.12" stroke="#22d3ee" stroke-width="1.3"/>
            <text x="265" y="64" text-anchor="middle" font-size="16" font-weight="800" fill="#22d3ee">+ es</text>
            <text x="265" y="84" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">tras s sh ch x z</text>
            <text x="265" y="106" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">class → classes</text>
            <text x="265" y="124" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">branch → branches</text>
          </g>

          <g>
            <rect x="354" y="40" width="150" height="98" rx="9" fill="#c084fc" opacity="0.12" stroke="#c084fc" stroke-width="1.3"/>
            <text x="429" y="64" text-anchor="middle" font-size="16" font-weight="800" fill="#c084fc">y → ies</text>
            <text x="429" y="84" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">consonante + y</text>
            <text x="429" y="106" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">query → queries</text>
            <text x="429" y="124" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">pero: day → days</text>
          </g>

          <g>
            <rect x="518" y="40" width="136" height="98" rx="9" fill="#fbbf24" opacity="0.12" stroke="#fbbf24" stroke-width="1.3"/>
            <text x="586" y="64" text-anchor="middle" font-size="16" font-weight="800" fill="#fbbf24">otros</text>
            <text x="586" y="84" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">se memorizan</text>
            <text x="586" y="106" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">child → children</text>
            <text x="586" y="124" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.85">person → people</text>
          </g>

          <line x1="26" y1="158" x2="654" y2="158" stroke="currentColor" opacity="0.15"/>

          <text x="340" y="182" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">Una escritura, tres sonidos</text>

          <g font-size="12.5">
            <rect x="60" y="194" width="170" height="46" rx="8" fill="currentColor" opacity="0.06"/>
            <text x="145" y="214" text-anchor="middle" font-weight="800" fill="#f59e0b">/s/</text>
            <text x="145" y="232" text-anchor="middle" fill="currentColor" opacity="0.75">bits · maps · checks</text>

            <rect x="248" y="194" width="170" height="46" rx="8" fill="currentColor" opacity="0.06"/>
            <text x="333" y="214" text-anchor="middle" font-weight="800" fill="#f59e0b">/z/</text>
            <text x="333" y="232" text-anchor="middle" fill="currentColor" opacity="0.75">bugs · files · days</text>

            <rect x="436" y="194" width="184" height="46" rx="8" fill="currentColor" opacity="0.06"/>
            <text x="528" y="214" text-anchor="middle" font-weight="800" fill="#f59e0b">/ɪz/</text>
            <text x="528" y="232" text-anchor="middle" fill="currentColor" opacity="0.75">classes · branches</text>
          </g>

          <text x="340" y="266" text-anchor="middle" font-size="12" fill="#f87171" font-weight="600">
            Sale solo si escuchás. Lo que hay que evitar es comerse la marca.
          </text>
        </svg>`,
        pie: 'Cuatro reglas de escritura y tres de sonido. Ninguna hay que estudiarla de memoria salvo los irregulares.',
      },

      escucha: {
        intro: '<p>El objetivo acá es <b>oír la marca de plural</b>, que es justo lo que un hispanohablante ' +
               'no registra. Escribí exactamente lo que oigas, con la <i>s</i> si está.</p>',
        items: [
          { texto: 'We have three branches in this repo.', es: 'Tenemos tres ramas en este repo.',
            nota: '<b>branches</b> se dice "BRAN-chiz". Ese /ɪz/ extra es lo que marca el plural.' },
          { texto: 'The people here are very nice.', es: 'La gente de acá es muy amable.',
            nota: '<b>people are</b>, nunca <i>people is</i>. En inglés es plural.' },
          { texto: 'There are two women on the team.', es: 'Hay dos mujeres en el equipo.',
            nota: '<b>women</b> se dice "WI-men", con "i". Es la irregularidad de pronunciación más traicionera.' },
          { texto: 'I fixed all the bugs and closed the issues.', es: 'Arreglé todos los bugs y cerré los issues.',
            nota: 'Dos plurales seguidos: <b>bugs</b> con /z/ y <b>issues</b> con /z/ también.' },
        ],
      },

      practica: `
        <p><b>Decí estos plurales en voz alta</b> y fijate qué hace tu boca:</p>
        <p><span class="en" data-say>bits</span> · <span class="en" data-say>bugs</span> ·
        <span class="en" data-say>classes</span> · <span class="en" data-say>queries</span> ·
        <span class="en" data-say>children</span> · <span class="en" data-say>people</span></p>

        <p>No hace falta pensar cuál de las tres pronunciaciones va: sale sola. Lo único que hay que
        vigilar es <b>que la marca esté</b>. Comerse la <i>-s</i> es el hábito heredado del español,
        donde el plural también se marca en el artículo y en el adjetivo, así que perder una no rompe nada.
        En inglés esa <i>-s</i> es la <b>única</b> señal.</p>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Escribí el plural de <b>country</b>.',
          respuesta: 'countries',
          porQue: 'Consonante + <i>y</i> → <b>-ies</b>. Ojo: si antes de la <i>y</i> hay vocal, va <i>-s</i> normal (<i>days</i>).',
        },
        {
          tipo: 'hueco',
          p: 'Escribí el plural de <b>person</b>.',
          respuesta: 'people',
          porQue: '<b>people</b> es el plural de <i>person</i>, y es plural: <i>people are</i>, nunca <i>people is</i>.',
        },
        {
          tipo: 'opcion',
          p: '¿Cuál está bien?',
          opciones: ['The people is very friendly.', 'The peoples are friendly.', 'The people are very friendly.', 'A people is friendly.'],
          correcta: 2,
          porQue: '<b>people</b> es plural, así que lleva <i>are</i>.',
          porQueNo: {
            0: 'Es el error más común: <i>people</i> parece singular por la forma pero no lo es.',
            1: '<i>peoples</i> con -s significa «pueblos», grupos étnicos. Otra palabra.',
            3: 'Para una sola persona va <i>a person</i>.',
          },
        },
        {
          tipo: 'dictado',
          p: 'Escuchá y escribí. Hay dos plurales.',
          respuesta: 'We have three branches and two issues',
          porQue: '<b>branches</b> lleva -es por terminar en <i>ch</i>; <b>issues</b> lleva -s normal.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «Hay dos mujeres en el equipo.»',
          respuesta: 'There are two women on the team',
          porQue: '<b>women</b> es irregular, y se dice "WI-men". Fijate también que va <i>on the team</i>, no <i>in</i>.',
        },
      ],

      errores: [
        { mito: '<i>People</i> es singular porque significa «la gente».',
          realidad: 'Es <b>plural</b> — es el plural de <i>person</i>. Va <i>People are nice</i>. ' +
                    'La confusión viene de que en español «gente» es singular. Es de los errores que más se repite ' +
                    'incluso en niveles avanzados.' },
        { mito: 'Comerse la -s del plural no importa, se entiende igual.',
          realidad: 'En español el plural se marca varias veces («<b>los</b> chico<b>s</b> alto<b>s</b>»), así que perder una ' +
                    'no rompe nada. En inglés esa <b>-s</b> suele ser la <b>única</b> marca. Comértela borra la información.' },
        { mito: 'Los plurales irregulares son muchísimos, no vale la pena aprenderlos.',
          realidad: 'Son <b>menos de diez frecuentes</b>: man/men, woman/women, child/children, person/people, foot/feet, ' +
                    'tooth/teeth. Justamente por ser tan usados se aprenden solos con un poco de exposición.' },
      ],

      glosario: [
        { t: 'Plural regular', d: 'El que se arma con -s o -es. Cubre la enorme mayoría de los sustantivos.' },
        { t: 'People', d: 'Plural de <i>person</i>. Siempre lleva verbo en plural: <i>people are</i>.' },
        { t: 'Data', d: 'Técnicamente plural de <i>datum</i>, pero hoy se usa como incontable: <i>the data is ready</i>.' },
        { t: 'Mutación vocálica', d: 'El mecanismo antiguo que forma <i>man/men</i> y <i>foot/feet</i>: el plural cambia la vocal en vez de agregar una marca.' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l3',
      titulo: 'This, that, these, those',
      minutos: 7,

      simple: `
        <p>Cuatro palabras para señalar cosas. Se eligen cruzando dos preguntas:
        <b>¿está cerca o lejos?</b> y <b>¿es una o varias?</b></p>

        <table>
          <tr><th></th><th>Cerca</th><th>Lejos</th></tr>
          <tr><td><b>Una</b></td><td><span class="en" data-say>this</span></td><td><span class="en" data-say>that</span></td></tr>
          <tr><td><b>Varias</b></td><td><span class="en" data-say>these</span></td><td><span class="en" data-say>those</span></td></tr>
        </table>

        <ul>
          <li><span class="en" data-say>This is my desk</span> — este escritorio, acá</li>
          <li><span class="en" data-say>That is your office</span> — esa oficina, allá</li>
          <li><span class="en" data-say>These files are new</span> — estos archivos</li>
          <li><span class="en" data-say>Those bugs are old</span> — aquellos bugs</li>
        </ul>

        <h4>El problema real no es la gramática: es la pronunciación</h4>
        <div class="aviso">
          <b>this</b> y <b>these</b> suenan casi igual para un oído hispanohablante, y es la misma
          trampa de <i>ship</i> y <i>sheep</i> del módulo 0.<br><br>
          <span class="en" data-say>this</span> — vocal corta y relajada<br>
          <span class="en" data-say>these</span> — vocal larga, sonriendo<br><br>
          Y encima <b>this</b> termina en /s/ y <b>these</b> en /z/ (con vibración).
        </div>
        <p>Con <b>that</b> y <b>those</b> es más fácil: suenan bien distinto.</p>

        <h4>Usos que no son señalar</h4>
        <p>Estas palabras se usan muchísimo más de lo que parece:</p>
        <ul>
          <li><b>Al teléfono o en una call:</b> <span class="en" data-say>Hi, this is Ana</span> — «habla Ana».
          No se dice ❌ <i>I am Ana</i> al presentarse por teléfono.</li>
          <li><b>Para referirse a lo que se acaba de decir:</b> <span class="en" data-say>That's a good point</span>,
          <span class="en" data-say>That makes sense</span>.</li>
          <li><b>Para cerrar:</b> <span class="en" data-say>That's all for today</span>.</li>
        </ul>
      `,

      tecnico: `
        <p>Son los <b>demostrativos</b>, y en inglés tienen solo dos grados de distancia
        (próximo / no próximo), mientras que el español tiene tres:</p>

        <table>
          <tr><th>Español</th><th>Inglés</th></tr>
          <tr><td>este / esta</td><td rowspan="1">this</td></tr>
          <tr><td>ese / esa</td><td rowspan="2">that</td></tr>
          <tr><td>aquel / aquella</td><td></td></tr>
        </table>

        <p>La distinción entre «ese» y «aquel» simplemente no existe en inglés: las dos son <i>that</i>.
        Cuando hace falta marcar mucha distancia se agrega algo: <i>that one over there</i>.</p>

        <div class="nota-tec">
          <b>Funcionan como pronombre y como determinante.</b>
          <br>Determinante: <i>This <b>file</b> is broken</i> — acompaña a un sustantivo.
          <br>Pronombre: <i>This is broken</i> — está solo, reemplaza al sustantivo.
          <br><br>
          En español pasa lo mismo, así que no genera errores. Lo que sí los genera es la
          concordancia de número: ❌ <i>this files</i>, ✅ <i>these files</i>.
        </div>

        <p><b>Sobre <i>this is</i> al teléfono.</b> El inglés usa el demostrativo para la
        identificación en el canal — <i>This is Ana</i> (soy Ana), <i>Is this Ana?</i> (¿hablo con Ana?).
        Traducir «soy Ana» como <i>I am Ana</i> se entiende pero suena a presentación cara a cara,
        no telefónica.</p>

        <p><b>Sobre <i>that</i> como muletilla de conversación.</b> Es una de las palabras más
        productivas del inglés hablado en reuniones, porque permite referirse a la idea anterior
        completa sin repetirla:</p>
        <ul>
          <li><i>That's a good point</i> — buen punto</li>
          <li><i>That makes sense</i> — tiene sentido</li>
          <li><i>That's fair</i> — es razonable</li>
          <li><i>I'm not sure about that</i> — no estoy seguro de eso</li>
        </ul>
        <p>Vale más aprender estas cuatro frases hechas que la tabla de arriba: se usan a diario.</p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Los cuatro demostrativos cruzando distancia y número">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Dos preguntas, cuatro respuestas</text>

          <text x="230" y="56" text-anchor="middle" font-size="12" font-weight="700" fill="#34d399">CERCA</text>
          <text x="470" y="56" text-anchor="middle" font-size="12" font-weight="700" fill="#c084fc">LEJOS</text>
          <text x="106" y="98" text-anchor="end" font-size="12" font-weight="700" fill="currentColor" opacity="0.7">UNA</text>
          <text x="106" y="168" text-anchor="end" font-size="12" font-weight="700" fill="currentColor" opacity="0.7">VARIAS</text>

          <rect x="120" y="66" width="220" height="52" rx="9" fill="#34d399" opacity="0.14" stroke="#34d399" stroke-width="1.3"/>
          <text x="230" y="92" text-anchor="middle" font-size="19" font-weight="800" fill="#34d399">this</text>
          <text x="230" y="110" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">este · esta</text>

          <rect x="360" y="66" width="220" height="52" rx="9" fill="#c084fc" opacity="0.14" stroke="#c084fc" stroke-width="1.3"/>
          <text x="470" y="92" text-anchor="middle" font-size="19" font-weight="800" fill="#c084fc">that</text>
          <text x="470" y="110" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">ese · esa · aquel</text>

          <rect x="120" y="136" width="220" height="52" rx="9" fill="#34d399" opacity="0.14" stroke="#34d399" stroke-width="1.3"/>
          <text x="230" y="162" text-anchor="middle" font-size="19" font-weight="800" fill="#34d399">these</text>
          <text x="230" y="180" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">estos · estas</text>

          <rect x="360" y="136" width="220" height="52" rx="9" fill="#c084fc" opacity="0.14" stroke="#c084fc" stroke-width="1.3"/>
          <text x="470" y="162" text-anchor="middle" font-size="19" font-weight="800" fill="#c084fc">those</text>
          <text x="470" y="180" text-anchor="middle" font-size="11.5" fill="currentColor" opacity="0.7">esos · aquellos</text>

          <rect x="120" y="206" width="460" height="42" rx="8" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="350" y="224" text-anchor="middle" font-size="12" font-weight="700" fill="#f59e0b">Lo difícil no es elegir: es que suenen distinto</text>
          <text x="350" y="241" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.8">
            this = corta, termina en /s/ · these = larga, termina en /z/
          </text>
        </svg>`,
        pie: 'El inglés junta «ese» y «aquel» en una sola palabra. Lo que sí distingue es singular de plural.',
      },

      escucha: {
        intro: '<p>Acá el ejercicio es fino: distinguir <b>this</b> de <b>these</b> al oído. ' +
               'Bajá la velocidad si hace falta.</p>',
        items: [
          { texto: 'This file is new.', es: 'Este archivo es nuevo.',
            nota: 'Singular: <b>this</b> corta + <i>file</i> sin -s.' },
          { texto: 'These files are new.', es: 'Estos archivos son nuevos.',
            nota: 'Plural: <b>these</b> larga + <i>files</i> con -s + <i>are</i>. Tres señales en la misma frase.' },
          { texto: 'Hi, this is Ana. Can you hear me?', es: 'Hola, habla Ana. ¿Me escuchás?',
            nota: 'Al teléfono o en una call se usa <b>this is</b>, no <i>I am</i>.' },
          { texto: "That's a good point, but I'm not sure.", es: 'Es un buen punto, pero no estoy seguro.',
            nota: '<b>That</b> acá no señala nada físico: se refiere a lo que la otra persona acaba de decir.' },
        ],
      },

      practica: `
        <p><b>Las cuatro frases con <i>that</i> que más se usan en reuniones.</b> Valen más que toda
        la tabla, porque las vas a decir todas las semanas:</p>
        <ul>
          <li><span class="en" data-say>That's a good point.</span> — Buen punto.</li>
          <li><span class="en" data-say>That makes sense.</span> — Tiene sentido.</li>
          <li><span class="en" data-say>I'm not sure about that.</span> — No estoy seguro de eso.</li>
          <li><span class="en" data-say>That's all from me.</span> — Es todo de mi parte. <i>(para cerrar tu turno en un standup)</i></li>
        </ul>

        <p><b>Y para practicar this/these:</b> señalá cinco cosas de tu escritorio en voz alta,
        alternando singular y plural. <i>This is my laptop. These are my headphones.</i></p>
      `,

      ejercicios: [
        {
          tipo: 'hueco',
          p: 'Completá: <b>______ files are from last week.</b> (plural, cerca)',
          respuesta: 'These',
          respuestas: ['these'],
          porQue: 'Plural + cerca = <b>these</b>. Fijate que el verbo también va en plural: <i>are</i>.',
        },
        {
          tipo: 'opcion',
          p: 'Estás en una call y te pedís turno para hablar. Querés decir «habla Ana». ¿Cómo?',
          opciones: ['I am Ana.', 'This is Ana.', 'Here is Ana.', 'It is Ana speaking me.'],
          correcta: 1,
          porQue: 'Por teléfono o en una call el inglés usa <b>This is…</b> para identificarse.',
          porQueNo: {
            0: 'Se entiende, pero suena a presentación cara a cara, no a identificarse en un canal.',
            2: '<i>Here is</i> se usa para presentar algo que estás mostrando, no para identificarte.',
            3: 'No es inglés. La forma con <i>speaking</i> sería <i>Ana speaking</i>, que también vale sola.',
          },
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>Tiene sentido.</b> (respondiendo a lo que alguien acaba de explicar)',
          respuesta: 'That makes sense',
          respuestas: ["That makes sense."],
          pista: 'Empezá por la palabra que se refiere a lo que dijo el otro.',
          porQue: 'Es de las frases más útiles de una reunión. <b>That</b> reemplaza toda la idea anterior sin repetirla.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «Estos son mis auriculares.»',
          respuesta: 'These are my headphones',
          porQue: 'Plural en todo: <b>these</b> + <b>are</b> + <b>headphones</b>. En inglés los auriculares son siempre plurales.',
        },
      ],

      errores: [
        { mito: '<i>This</i> y <i>these</i> son básicamente lo mismo, se entiende por contexto.',
          realidad: 'Se entiende, pero es <b>la misma trampa de ship/sheep</b>: dos vocales distintas que el español ' +
                    'colapsa en una. Y encima el verbo cambia (<i>is</i> / <i>are</i>), así que el error se duplica.' },
        { mito: 'Para «aquel» hay otra palabra distinta de <i>that</i>.',
          realidad: 'No la hay. El inglés tiene <b>dos</b> grados de distancia y el español tres. «Ese» y «aquel» son ' +
                    'los dos <i>that</i>. Si necesitás marcar mucha distancia, se agrega: <i>that one over there</i>.' },
        { mito: 'Al presentarme por teléfono digo <i>I am Ana</i>.',
          realidad: 'Se dice <b>This is Ana</b> o <b>Ana speaking</b>. <i>I am Ana</i> se entiende pero suena a presentación ' +
                    'presencial. Es una convención del canal, no una regla gramatical.' },
      ],

      glosario: [
        { t: 'Demostrativo', d: 'Palabra que señala: this, that, these, those. Funciona sola o acompañando a un sustantivo.' },
        { t: 'This is…', d: 'La fórmula para identificarse por teléfono o en una call. También <i>Ana speaking</i>.' },
        { t: "That's a good point", d: 'Buen punto. La frase más usada para reconocer lo que dijo otro antes de agregar algo.' },
        { t: 'Headphones', d: 'Auriculares. Siempre plural, como <i>glasses</i> (anteojos) o <i>scissors</i> (tijeras).' },
      ],
    },

    /* ==================================================================== */
    {
      id: 'l4',
      titulo: 'Lo que no se puede contar',
      minutos: 8,

      simple: `
        <p>Hay palabras que en inglés <b>no admiten plural ni número</b>, aunque en español sí.
        Son las <b>incontables</b>: cosas que se piensan como masa, no como unidades.</p>

        <div class="aviso">
          ❌ <i>I have two informations</i> → ✅ <span class="en" data-say>I have some information</span><br>
          ❌ <i>Give me an advice</i> → ✅ <span class="en" data-say>Give me some advice</span><br>
          ❌ <i>I need a feedback</i> → ✅ <span class="en" data-say>I need some feedback</span>
        </div>

        <h4>Las que más te van a hacer tropezar</h4>
        <p>Justo las que más se usan en trabajo:</p>
        <table>
          <tr><th>Incontable</th><th>Español</th><th>Para contar se dice</th></tr>
          <tr><td>information</td><td>información</td><td>a piece of information</td></tr>
          <tr><td>advice</td><td>consejo</td><td>a piece of advice</td></tr>
          <tr><td>feedback</td><td>feedback</td><td>some feedback</td></tr>
          <tr><td>work</td><td>trabajo</td><td>a job (esa sí es contable)</td></tr>
          <tr><td>software</td><td>software</td><td>a program</td></tr>
          <tr><td>research</td><td>investigación</td><td>a study</td></tr>
          <tr><td>money</td><td>dinero</td><td>—</td></tr>
          <tr><td>time</td><td>tiempo</td><td>—</td></tr>
        </table>

        <h4>Cómo se cuantifican</h4>
        <ul>
          <li><b>some</b> — algo de, en afirmativo: <span class="en" data-say>I have some feedback</span></li>
          <li><b>any</b> — en negativo y pregunta: <span class="en" data-say>Do you have any feedback?</span></li>
          <li><b>a lot of</b> — mucho, sirve para los dos: <span class="en" data-say>a lot of work</span></li>
          <li><b>much</b> — mucho, solo incontables y casi solo en negativo/pregunta:
          <span class="en" data-say>I don't have much time</span></li>
          <li><b>many</b> — muchos, solo contables: <span class="en" data-say>many bugs</span></li>
        </ul>

        <div class="analogia">
          <b>Regla práctica:</b> si dudás entre <i>much</i> y <i>many</i>, usá <b>a lot of</b>.
          Sirve para los dos, suena natural y no te podés equivocar.
        </div>
      `,

      tecnico: `
        <p>La oposición <b>contable / incontable</b> (o <i>count</i> / <i>mass</i>) no es una propiedad
        del mundo sino de cada idioma. «Consejo» es contable en español y <i>advice</i> es incontable en
        inglés — la misma realidad, distinta categorización gramatical.</p>

        <p>Un sustantivo incontable, por definición:</p>
        <ul>
          <li>no lleva <i>a</i> / <i>an</i></li>
          <li>no tiene plural</li>
          <li>lleva verbo en <b>singular</b>: <i>The information <b>is</b> correct</i></li>
          <li>se cuantifica con <i>some</i>, <i>any</i>, <i>much</i>, <i>a lot of</i>, <i>a little</i></li>
        </ul>

        <div class="nota-tec">
          <b>Para contarlos se usa un clasificador.</b> Igual que en español decimos «una hoja de papel»
          y no «un papel» para referirnos a la lámina:
          <br><i>a piece of advice</i> · <i>two pieces of information</i> · <i>a bit of feedback</i>
          <br><br>
          En registro informal <i>a piece of</i> suena algo rígido; lo habitual es reformular:
          <i>Can I give you some advice?</i> en vez de <i>Can I give you a piece of advice?</i>
        </div>

        <p><b>Muchos sustantivos son las dos cosas</b>, con significados distintos:</p>
        <table>
          <tr><th>Incontable</th><th>Contable</th></tr>
          <tr><td><i>coffee</i> — café, la bebida</td><td><i>a coffee</i> — una taza</td></tr>
          <tr><td><i>time</i> — el tiempo</td><td><i>three times</i> — tres veces</td></tr>
          <tr><td><i>experience</i> — experiencia</td><td><i>an experience</i> — una vivencia</td></tr>
          <tr><td><i>work</i> — trabajo en general</td><td><i>a work</i> — una obra (arte)</td></tr>
        </table>

        <p><b>Sobre <i>some</i> y <i>any</i>.</b> La regla escolar dice «<i>some</i> en afirmativo,
        <i>any</i> en negativo y pregunta», y funciona el 90% de las veces. La excepción útil:
        <i>some</i> aparece en preguntas cuando se <b>ofrece</b> o se espera un sí —
        <i>Would you like some coffee?</i> Preguntar <i>Would you like any coffee?</i> suena a
        que no esperás que acepte.</p>

        <p><b>Sobre <i>much</i>.</b> En afirmativo suena formal o raro: <i>I have much time</i> es
        gramatical pero nadie lo dice. Lo natural es <i>a lot of time</i>. <i>Much</i> vive
        cómodo en negativo y pregunta: <i>I don't have much time</i>, <i>How much time do we have?</i></p>
      `,

      visual: {
        svg: `<svg viewBox="0 0 680 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sustantivos contables e incontables y sus cuantificadores">
          <text x="340" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Unidades contra masa</text>

          <rect x="34" y="38" width="290" height="150" rx="10" fill="#22d3ee" opacity="0.09" stroke="#22d3ee" stroke-width="1.3"/>
          <text x="179" y="60" text-anchor="middle" font-size="13" font-weight="800" fill="#22d3ee">CONTABLES</text>
          <g fill="#22d3ee" opacity="0.55">
            <circle cx="120" cy="82" r="7"/><circle cx="146" cy="82" r="7"/><circle cx="172" cy="82" r="7"/>
            <circle cx="198" cy="82" r="7"/><circle cx="224" cy="82" r="7"/>
          </g>
          <g font-size="12.5" fill="currentColor" opacity="0.85">
            <text x="54" y="112">bug · file · question · meeting</text>
            <text x="54" y="134" font-weight="600">a bug · two bugs · many bugs</text>
          </g>
          <text x="54" y="160" font-size="11.5" fill="currentColor" opacity="0.6">llevan a/an · tienen plural</text>
          <text x="54" y="178" font-size="11.5" fill="currentColor" opacity="0.6">many · a few · a lot of</text>

          <rect x="356" y="38" width="290" height="150" rx="10" fill="#c084fc" opacity="0.09" stroke="#c084fc" stroke-width="1.3"/>
          <text x="501" y="60" text-anchor="middle" font-size="13" font-weight="800" fill="#c084fc">INCONTABLES</text>
          <path d="M 420 74 Q 460 66 500 76 Q 545 86 582 74 L 582 92 Q 545 102 500 92 Q 460 82 420 92 Z" fill="#c084fc" opacity="0.4"/>
          <g font-size="12.5" fill="currentColor" opacity="0.85">
            <text x="376" y="112">information · advice · feedback · work</text>
            <text x="376" y="134" font-weight="600">some feedback · a lot of work</text>
          </g>
          <text x="376" y="160" font-size="11.5" fill="currentColor" opacity="0.6">sin a/an · sin plural · verbo singular</text>
          <text x="376" y="178" font-size="11.5" fill="currentColor" opacity="0.6">much · a little · a lot of</text>

          <rect x="34" y="204" width="612" height="34" rx="8" fill="#f87171" opacity="0.1" stroke="#f87171" stroke-width="1.2"/>
          <text x="340" y="226" text-anchor="middle" font-size="12.5" font-weight="600" fill="#f87171">
            ✗ two informations · ✗ an advice · ✗ a feedback — las tres son incontables en inglés
          </text>

          <rect x="34" y="250" width="612" height="32" rx="8" fill="#34d399" opacity="0.1" stroke="#34d399" stroke-width="1.2"/>
          <text x="340" y="271" text-anchor="middle" font-size="12.5" font-weight="700" fill="#34d399">
            Si dudás entre much y many: usá "a lot of" y listo
          </text>
        </svg>`,
        pie: 'La categoría no viene del mundo, viene del idioma: «consejo» se cuenta en español y no en inglés.',
      },

      escucha: {
        intro: '<p>Frases de trabajo con incontables. Fijate que ninguno lleva plural, ' +
               'y que el verbo va en singular.</p>',
        items: [
          { texto: 'I have some feedback about the design.', es: 'Tengo algo de feedback sobre el diseño.',
            nota: '<b>some feedback</b>, nunca <i>a feedback</i> ni <i>feedbacks</i>.' },
          { texto: 'Do you have any information about this?', es: '¿Tenés información sobre esto?',
            nota: 'En pregunta va <b>any</b>. Y <i>information</i> jamás lleva -s.' },
          { texto: "I don't have much time today.", es: 'No tengo mucho tiempo hoy.',
            nota: '<b>much</b> vive cómodo en negativo. En afirmativo sonaría raro: se diría <i>a lot of time</i>.' },
          { texto: 'Can I give you some advice?', es: '¿Te puedo dar un consejo?',
            nota: 'En español es «un consejo», contable. En inglés es masa: <b>some advice</b>.' },
        ],
      },

      practica: `
        <p><b>Las tres que más vas a usar mal si no las fijás ahora:</b></p>
        <ul>
          <li><span class="en" data-say>I have some feedback</span> — no <i>a feedback</i></li>
          <li><span class="en" data-say>Do you have any information?</span> — no <i>informations</i></li>
          <li><span class="en" data-say>Let me give you some advice</span> — no <i>an advice</i></li>
        </ul>

        <p><b>Y el atajo que te salva siempre:</b> cuando dudes si va <i>much</i> o <i>many</i>,
        usá <b>a lot of</b>. Funciona con contables y con incontables, suena natural en cualquier
        registro, y te saca de la duda sin pensar.</p>

        <p><span class="en" data-say>a lot of bugs</span> · <span class="en" data-say>a lot of work</span> ·
        <span class="en" data-say>a lot of people</span> · <span class="en" data-say>a lot of time</span></p>
      `,

      ejercicios: [
        {
          tipo: 'opcion',
          p: 'Querés decir «tengo feedback sobre el diseño». ¿Cuál está bien?',
          opciones: ['I have a feedback about the design.', 'I have feedbacks about the design.', 'I have some feedback about the design.', 'I have many feedback about the design.'],
          correcta: 2,
          porQue: '<b>feedback</b> es incontable: sin artículo, sin plural, y se cuantifica con <i>some</i>.',
          porQueNo: {
            0: 'Los incontables no llevan <i>a</i> / <i>an</i>.',
            1: 'No tienen plural. ❌ <i>feedbacks</i> no existe.',
            3: '<i>many</i> es solo para contables. Acá iría <i>a lot of</i>.',
          },
        },
        {
          tipo: 'hueco',
          p: 'Completá con <b>much</b> o <b>many</b>: <b>How ______ bugs did you find?</b>',
          respuesta: 'many',
          porQue: '<b>bugs</b> es contable, así que va <i>many</i>. Con incontables iría <i>much</i>.',
        },
        {
          tipo: 'hueco',
          p: 'Completá con <b>some</b> o <b>any</b>: <b>Do you have ______ questions?</b>',
          respuesta: 'any',
          porQue: 'En pregunta va <b>any</b>. La excepción es cuando ofrecés algo: <i>Would you like some coffee?</i>',
        },
        {
          tipo: 'traducir',
          p: 'Traducí: <b>No tengo mucho tiempo.</b>',
          respuesta: "I don't have much time",
          respuestas: ['I do not have much time', "I don't have a lot of time"],
          pista: 'time es incontable.',
          porQue: '<b>much time</b> en negativo suena perfecto. En afirmativo se diría <i>a lot of time</i>.',
        },
        {
          tipo: 'ordenar',
          p: 'Armá: «¿Te puedo dar un consejo?»',
          respuesta: 'Can I give you some advice',
          porQue: '«Un consejo» en español es contable; <b>advice</b> en inglés no. Por eso va <i>some</i> y no <i>an</i>.',
        },
      ],

      errores: [
        { mito: 'Si en español lleva plural, en inglés también.',
          realidad: 'No siempre. <i>information</i>, <i>advice</i>, <i>feedback</i>, <i>research</i> y <i>software</i> ' +
                    'son <b>incontables</b> en inglés aunque sus equivalentes españoles se cuenten. ' +
                    'La categoría la define el idioma, no la realidad.' },
        { mito: '<i>Much</i> se usa igual que «mucho» en español.',
          realidad: 'En afirmativo suena raro o formal: nadie dice <i>I have much time</i>. <i>Much</i> vive en negativo ' +
                    'y pregunta. Para afirmar, <b>a lot of</b>. Y si dudás, <i>a lot of</i> te cubre siempre.' },
        { mito: '<i>Some</i> nunca va en preguntas.',
          realidad: 'Va cuando <b>ofrecés</b> algo o esperás un sí: <i>Would you like some coffee?</i> ' +
                    'Usar <i>any</i> ahí suena a que no esperás que acepte. Es un matiz chico pero se nota.' },
      ],

      glosario: [
        { t: 'Incontable', d: 'Sustantivo que se piensa como masa: sin plural, sin <i>a/an</i>, verbo en singular. <i>information</i>, <i>advice</i>, <i>work</i>.' },
        { t: 'A piece of', d: 'El clasificador para contar incontables: <i>a piece of advice</i>, <i>two pieces of information</i>.' },
        { t: 'Some / any', d: '<i>some</i> en afirmativo y en ofrecimientos; <i>any</i> en negativo y pregunta.' },
        { t: 'A lot of', d: 'Sirve para contables e incontables. El atajo cuando dudás entre <i>much</i> y <i>many</i>.' },
      ],
    },
  ],

  /* ==================================================================== */
  vocabulario: [
    { en: 'a lot of', es: 'mucho / muchos', pista: 'Sirve para contables e incontables.', ejemplo: 'We have a lot of work today.', ejemploEs: 'Tenemos mucho trabajo hoy.' },
    { en: 'some', es: 'algo de / algunos', ejemplo: 'I have some feedback for you.', ejemploEs: 'Tengo algo de feedback para vos.' },
    { en: 'any', es: 'algo / algún (en pregunta o negativo)', ejemplo: 'Do you have any questions?', ejemploEs: '¿Tenés alguna pregunta?' },
    { en: 'information', es: 'información', pista: 'Incontable: nunca lleva -s.', ejemplo: 'I need more information.', ejemploEs: 'Necesito más información.' },
    { en: 'advice', es: 'consejo', pista: 'Incontable en inglés.', ejemplo: 'Can I give you some advice?', ejemploEs: '¿Te puedo dar un consejo?' },
    { en: 'feedback', es: 'feedback / devolución', pista: 'Incontable: nunca feedbacks.', ejemplo: 'Thanks for the feedback.', ejemploEs: 'Gracias por el feedback.' },
    { en: 'file', es: 'archivo', ejemplo: 'Can you send me the file?', ejemploEs: '¿Me podés mandar el archivo?' },
    { en: 'question', es: 'pregunta', ejemplo: 'I have a question.', ejemploEs: 'Tengo una pregunta.' },
    { en: 'branch', es: 'rama', pista: 'Plural: branches.', ejemplo: 'We have three branches.', ejemploEs: 'Tenemos tres ramas.' },
    { en: 'company', es: 'empresa', pista: 'Plural: companies.', ejemplo: 'She works for a big company.', ejemploEs: 'Ella trabaja para una empresa grande.' },
    { en: 'child', es: 'chico / hijo', pista: 'Plural irregular: children.', ejemplo: 'They have two children.', ejemploEs: 'Tienen dos hijos.' },
    { en: 'woman', es: 'mujer', pista: 'Plural: women, se dice "wi-men".', ejemplo: 'There are two women on the team.', ejemploEs: 'Hay dos mujeres en el equipo.' },
    { en: 'man', es: 'hombre', pista: 'Plural irregular: men.', ejemplo: 'The man over there is my boss.', ejemploEs: 'El hombre de allá es mi jefe.' },
    { en: 'this', es: 'este / esto', ejemplo: 'This is my desk.', ejemploEs: 'Este es mi escritorio.' },
    { en: 'these', es: 'estos / estas', pista: 'Vocal larga, no confundir con this.', ejemplo: 'These files are new.', ejemploEs: 'Estos archivos son nuevos.' },
    { en: 'that', es: 'ese / aquel / eso', ejemplo: 'That makes sense.', ejemploEs: 'Tiene sentido.' },
    { en: 'those', es: 'esos / aquellos', ejemplo: 'Those bugs are old.', ejemploEs: 'Esos bugs son viejos.' },
    { en: 'hour', es: 'hora', pista: 'La h es muda: an hour.', ejemplo: 'It takes an hour.', ejemploEs: 'Tarda una hora.' },
    { en: 'money', es: 'dinero', pista: 'Incontable.', ejemplo: 'We do not have much money.', ejemploEs: 'No tenemos mucho dinero.' },
    { en: 'time', es: 'tiempo', pista: 'Incontable cuando es «el tiempo».', ejemplo: 'I do not have much time.', ejemploEs: 'No tengo mucho tiempo.' },
    { en: 'desk', es: 'escritorio', ejemplo: 'This is my desk.', ejemploEs: 'Este es mi escritorio.' },
    { en: 'headphones', es: 'auriculares', pista: 'Siempre plural.', ejemplo: 'These are my headphones.', ejemploEs: 'Estos son mis auriculares.' },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: 'Querés decir que te gustan los perros, en general. ¿Cuál va?',
      opciones: ['I like the dogs.', 'I like dogs.', 'I like a dogs.', 'I like a dog.'],
      correcta: 1,
      porQue: 'En sentido genérico el inglés va <b>sin artículo</b>. El español usa «los» ahí, y de ahí sale el error.',
      porQueNo: {
        0: 'Significa «me gustan <b>esos</b> perros», los que están a la vista.',
        2: '<i>a</i> no puede ir con un plural.',
        3: 'Sería «me gusta un perro», una unidad concreta.',
      },
    },
    {
      p: '¿Por qué se dice <i>an hour</i> pero <i>a university</i>?',
      opciones: [
        'Porque hour es más corta',
        'Porque la regla va por sonido: hour arranca con vocal (h muda) y university con sonido de y',
        'Porque hour viene del francés',
        'Porque university empieza con u, que es una excepción',
      ],
      correcta: 1,
      porQue: 'La regla de <i>a</i>/<i>an</i> es <b>fonológica</b>. Por eso también <i>an API</i> y <i>an SSD</i>: se leen empezando por vocal.',
      porQueNo: {
        0: 'La longitud no interviene.',
        2: 'El origen es cierto pero irrelevante: lo que decide es cómo suena hoy.',
        3: 'No es una excepción: sigue la regla, porque el sonido inicial es consonante.',
      },
    },
    {
      p: '¿Cuál es el plural de <b>country</b>?',
      opciones: ['countrys', 'countryes', 'countries', 'country'],
      correcta: 2,
      porQue: 'Consonante + <i>y</i> → <b>-ies</b>. Si antes de la <i>y</i> hubiera vocal iría <i>-s</i> normal, como en <i>days</i>.',
      porQueNo: {
        0: 'Esa forma no existe: la <i>y</i> tras consonante cambia a <i>i</i>.',
        1: 'La <i>y</i> no se conserva al agregar <i>-es</i>.',
        3: 'Los que no cambian son otros: <i>fish</i>, <i>sheep</i>, <i>series</i>.',
      },
    },
    {
      p: '¿Cuál de estas frases está bien?',
      opciones: ['The people is very friendly.', 'The people are very friendly.', 'The peoples are friendly.', 'A people is friendly.'],
      correcta: 1,
      porQue: '<b>people</b> es el plural de <i>person</i>, así que lleva verbo en plural.',
      porQueNo: {
        0: 'Es el error clásico, arrastrado de que «gente» es singular en español.',
        2: '<i>peoples</i> significa «pueblos», grupos étnicos. Otra palabra.',
        3: 'Para una persona va <i>a person</i>.',
      },
    },
    {
      p: 'Un plural regular se escribe siempre igual, pero ¿cuántas pronunciaciones tiene?',
      opciones: ['Una sola', 'Dos', 'Tres: /s/, /z/ y /ɪz/', 'Depende de la región'],
      correcta: 2,
      porQue: '<i>bits</i> lleva /s/, <i>bugs</i> lleva /z/ y <i>classes</i> lleva /ɪz/. Sale solo al hablar: lo importante es no comerse la marca.',
      porQueNo: {
        0: 'La escritura es una, el sonido no.',
        1: 'Falta la tercera, la de las palabras que terminan en siseante.',
        3: 'Es una regla general del idioma, no una variante regional.',
      },
    },
    {
      p: 'Querés decir «estos archivos son nuevos». ¿Cuál va?',
      opciones: ['This files is new.', 'These file are new.', 'These files are new.', 'Those file is new.'],
      correcta: 2,
      porQue: 'Todo tiene que concordar en plural: <b>these</b> + <b>files</b> + <b>are</b>.',
      porQueNo: {
        0: '<i>this</i> es singular y no concuerda con <i>files</i>; además <i>is</i> tendría que ser <i>are</i>.',
        1: '<i>these</i> pide plural en el sustantivo: <i>files</i>.',
        3: '<i>those</i> es «esos», lejos — y además queda en singular.',
      },
    },
    {
      p: 'Entrás a una call y querés identificarte. ¿Qué se dice?',
      opciones: ['I am Ana.', 'This is Ana.', 'Here Ana.', 'It is me, Ana.'],
      correcta: 1,
      porQue: 'Por teléfono o en una call se usa <b>This is…</b> (o <i>Ana speaking</i>). Es una convención del canal.',
      porQueNo: {
        0: 'Se entiende, pero suena a presentación cara a cara.',
        2: 'No es inglés.',
        3: 'Muy informal y ambiguo si no te conocen la voz.',
      },
    },
    {
      p: '¿Cuál está bien?',
      opciones: ['I have two informations.', 'I have an information.', 'I have some information.', 'I have informations.'],
      correcta: 2,
      porQue: '<b>information</b> es incontable: sin artículo, sin plural, cuantificado con <i>some</i>.',
      porQueNo: {
        0: 'Los incontables no tienen plural ni se cuentan directo.',
        1: 'No admiten <i>a</i> / <i>an</i>.',
        3: '❌ <i>informations</i> no existe en inglés.',
      },
    },
    {
      p: '¿Cuándo se usa <b>many</b> y cuándo <b>much</b>?',
      opciones: [
        'many para incontables, much para contables',
        'many para contables, much para incontables',
        'son intercambiables',
        'many en afirmativo, much en negativo',
      ],
      correcta: 1,
      porQue: '<i>many bugs</i> (contable) y <i>much time</i> (incontable). Y si dudás, <b>a lot of</b> sirve para los dos.',
      porQueNo: {
        0: 'Está invertido.',
        2: 'No lo son: mezclarlos suena mal enseguida.',
        3: 'Es cierto que <i>much</i> aparece más en negativo, pero eso no es lo que los distingue.',
      },
    },
    {
      p: 'Estás ofreciendo café. ¿Qué suena mejor?',
      opciones: ['Would you like any coffee?', 'Would you like some coffee?', 'Do you like the coffee?', 'Would you like a coffees?'],
      correcta: 1,
      porQue: 'En un ofrecimiento va <b>some</b>, aunque sea pregunta. Es la excepción a la regla de <i>any</i>.',
      porQueNo: {
        0: 'Gramatical, pero suena a que no esperás que acepte.',
        2: 'Pregunta si le gusta <b>este</b> café, no si quiere uno.',
        3: '<i>a</i> no puede ir con plural, y <i>coffee</i> acá es incontable.',
      },
    },
    {
      p: 'En una reunión alguien explica algo y querés decir «tiene sentido». ¿Cómo?',
      opciones: ['It has sense.', 'That makes sense.', 'This have sense.', 'It makes a sense.'],
      correcta: 1,
      porQue: '<b>That makes sense</b>. <i>That</i> se refiere a la idea entera que dijo el otro, sin repetirla.',
      porQueNo: {
        0: 'Es la traducción literal de «tiene sentido» y no funciona: el verbo es <i>make</i>.',
        2: 'Doble error: <i>this</i> por <i>that</i>, y <i>have</i> por <i>makes</i>.',
        3: '<i>sense</i> acá es incontable, no lleva artículo.',
      },
    },
    {
      p: 'Querés hablar de los desarrolladores en general. ¿Cuál va?',
      opciones: ['The developers work a lot.', 'Developers work a lot.', 'A developers work a lot.', 'The developer work a lot.'],
      correcta: 1,
      porQue: 'Sentido genérico → sin artículo. Poner <i>the</i> lo convierte en «esos desarrolladores concretos».',
      porQueNo: {
        0: 'Es correcto gramaticalmente pero significa otra cosa: unos desarrolladores identificables.',
        2: '<i>a</i> no va con plural.',
        3: 'Además del artículo, le falta la <i>-s</i> del verbo (módulo 3).',
      },
    },
  ],
});
