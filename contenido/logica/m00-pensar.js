/* ==========================================================================
   Lógica · Módulo 00 — Pensar antes de escribir
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'logica',
  id: 'm00',
  titulo: 'Pensar antes de escribir',
  fuentes: ['neetcode-patrones', 'mdn-js'],

  intro:
    '<p>Cuando pasás mucho tiempo integrando servicios y armando pantallas, el músculo de <b>pensar el problema ' +
    'antes de escribirlo</b> se atrofia. No es falta de capacidad: es falta de uso.</p>' +
    '<p>Este módulo es el que más rinde de todo el track, porque casi todos los problemas que "no salen" no son ' +
    'de código: son de <b>no haber entendido bien el problema</b>. Y eso se arregla con un método, no con más ' +
    'experiencia.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'El método: entender, descomponer, verificar',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> antes de escribir una línea, tenés que poder
<b>resolver el problema a mano</b> con un ejemplo concreto. Si no podés, todavía no lo entendiste.</div>

<h4>Los cinco pasos</h4>
<pre><code>1 · ENTENDER      ¿qué entra? ¿qué sale? ¿qué NO está claro?
2 · EJEMPLIFICAR  resolvelo a mano con 2-3 casos
3 · DESCOMPONER   ¿cuál es el paso más chico que puedo resolver?
4 · RESOLVER      escribí la versión más obvia, sin optimizar
5 · VERIFICAR     probá con los casos borde</code></pre>

<div class="aviso"><strong>El paso 2 es el que casi nadie hace y el que más tiempo ahorra.</strong> Resolver
dos ejemplos a mano <b>revela la regla</b> que después vas a programar — y, muy seguido, revela que el
problema no era el que creías. Es cinco minutos de papel contra una hora de código que hay que tirar.</div>

<h4>Entender: las preguntas que hay que hacerse</h4>
<pre><code>· ¿Qué recibo exactamente? ¿tipo? ¿rango? ¿puede venir vacío?
· ¿Qué tengo que devolver? ¿en qué formato?
· ¿Qué pasa si la entrada es inválida?
· ¿Puede haber repetidos? ¿importa el orden?
· ¿Cuán grande puede ser la entrada?  ← define si importa el rendimiento</code></pre>

<h4>Los casos borde, que son los que rompen</h4>
<table>
<tr><th>Caso</th><th>Ejemplo</th></tr>
<tr><td><b>Vacío</b></td><td>Lista sin elementos, texto vacío</td></tr>
<tr><td><b>Uno solo</b></td><td>Un elemento: muchos algoritmos fallan acá</td></tr>
<tr><td><b>Todos iguales</b></td><td>Repetidos, duplicados</td></tr>
<tr><td><b>Extremos</b></td><td>Cero, negativos, el máximo posible</td></tr>
<tr><td><b>Ya ordenado / al revés</b></td><td>Rompe supuestos de muchos algoritmos</td></tr>
<tr><td><b>Nulo o indefinido</b></td><td>El clásico de JavaScript</td></tr>
</table>

<div class="dato"><strong>La fila de "uno solo" es la que más veces rompe.</strong> Un algoritmo que compara
elementos de a pares —el actual con el siguiente— funciona perfecto con tres elementos y <b>se rompe con
uno</b>, porque no hay siguiente. Es el caso borde que más se olvida y el más barato de verificar.</div>
`,

      tecnico: `
<h4>De ejemplo a regla: cómo se hace</h4>
<pre><code>Problema: dada una lista de números, devolver los que aparecen más de una vez.

Ejemplo 1: [1, 2, 3, 2, 1]     → [1, 2]
Ejemplo 2: [1, 2, 3]           → []
Ejemplo 3: [5, 5, 5]           → [5]        ← ¿una vez o tres?
Ejemplo 4: []                  → []

Del ejemplo 3 sale una PREGUNTA que el enunciado no aclaraba:
  ¿el resultado tiene repetidos?
Del ejemplo 1 sale otra:
  ¿el orden del resultado importa?

La regla: contar apariciones, devolver las claves con cuenta &gt; 1.</code></pre>

<div class="dato"><strong>Fijate que los ejemplos <b>generaron preguntas</b>, no solo confirmaron el
entendimiento.</strong> Ese es el valor real del paso: un enunciado ambiguo se ve ambiguo recién cuando ' +
intentás resolver un caso concreto. Y responder esas preguntas <b>antes</b> de programar evita reescribir.</div>

<h4>Descomponer: el paso más chico</h4>
<pre><code>Problema grande: "agrupar pedidos por cliente y calcular el total de cada uno"

Paso 1: recorrer los pedidos
Paso 2: para cada uno, saber a qué cliente pertenece
Paso 3: acumular el monto en ese cliente
Paso 4: devolver el resultado en el formato pedido

Cada paso es trivial. El problema completo no lo era.</code></pre>

<h4>Escribir la versión obvia primero</h4>
<pre><code>// Primera versión: la más directa, sin pensar en eficiencia
function duplicados(nums) {
  const resultado = [];
  for (const n of nums) {
    if (nums.indexOf(n) !== nums.lastIndexOf(n) &amp;&amp; !resultado.includes(n)) {
      resultado.push(n);
    }
  }
  return resultado;
}
// Funciona. Es O(n²). Y está bien como punto de partida.</code></pre>

<div class="dato"><strong>Escribir primero lo obvio parece una pérdida de tiempo y es lo contrario.</strong>
Te da una <b>referencia correcta</b> contra la cual comparar la versión optimizada, y muchas veces resulta que ' +
la versión obvia <b>alcanza</b> —si la lista tiene cincuenta elementos, O(n²) es instantáneo—. ' +
Optimizar sin tener la versión correcta es optimizar algo que quizás está mal.</div>

<h4>Pseudocódigo: cuándo sirve</h4>
<pre><code>No como ritual, sino cuando el algoritmo tiene varios pasos
y querés ver la estructura sin pelear con la sintaxis:

  contar apariciones de cada número en un mapa
  para cada entrada del mapa
    si la cuenta es mayor a 1
      agregar la clave al resultado
  devolver resultado

Después eso se traduce casi línea por línea.</code></pre>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="lg1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS CINCO PASOS</text>

  <rect x="24" y="34" width="118" height="54" rx="9" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="83" y="54" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">1 · ENTENDER</text>
  <text x="83" y="72" text-anchor="middle" fill="currentColor" opacity=".62" font-size="8.5">qué entra, qué sale</text>

  <line x1="146" y1="61" x2="158" y2="61" stroke="currentColor" stroke-width="1.2" marker-end="url(#lg1)"/>

  <rect x="162" y="34" width="118" height="54" rx="9" fill="#34d399" fill-opacity=".24" stroke="#34d399" stroke-width="1.8"/>
  <text x="221" y="54" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">2 · EJEMPLIFICAR</text>
  <text x="221" y="72" text-anchor="middle" fill="#34d399" font-size="8.5" font-weight="700">resolvelo A MANO</text>

  <line x1="284" y1="61" x2="296" y2="61" stroke="currentColor" stroke-width="1.2" marker-end="url(#lg1)"/>

  <rect x="300" y="34" width="118" height="54" rx="9" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="359" y="54" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">3 · DESCOMPONER</text>
  <text x="359" y="72" text-anchor="middle" fill="currentColor" opacity=".62" font-size="8.5">el paso más chico</text>

  <line x1="422" y1="61" x2="434" y2="61" stroke="currentColor" stroke-width="1.2" marker-end="url(#lg1)"/>

  <rect x="438" y="34" width="100" height="54" rx="9" fill="#7c5cff" fill-opacity=".18" stroke="#7c5cff" stroke-width="1.2"/>
  <text x="488" y="54" text-anchor="middle" fill="#7c5cff" font-size="10" font-weight="700">4 · RESOLVER</text>
  <text x="488" y="72" text-anchor="middle" fill="currentColor" opacity=".62" font-size="8.5">lo obvio primero</text>

  <line x1="542" y1="61" x2="554" y2="61" stroke="currentColor" stroke-width="1.2" marker-end="url(#lg1)"/>

  <rect x="558" y="34" width="98" height="54" rx="9" fill="#f87171" fill-opacity=".16" stroke="#f87171" stroke-width="1.2"/>
  <text x="607" y="54" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">5 · VERIFICAR</text>
  <text x="607" y="72" text-anchor="middle" fill="currentColor" opacity=".62" font-size="8.5">casos borde</text>

  <rect x="24" y="100" width="632" height="46" rx="9" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.6"/>
  <text x="44" y="120" fill="#34d399" font-size="12" font-weight="700">EL PASO 2 ES EL QUE CASI NADIE HACE Y EL QUE MÁS TIEMPO AHORRA</text>
  <text x="44" y="138" fill="currentColor" opacity=".78" font-size="11">
    Resolver dos ejemplos a mano <tspan font-weight="700">genera preguntas</tspan> que el enunciado no aclaraba. Cinco minutos de papel contra una hora de código a tirar.</text>

  <line x1="24" y1="168" x2="656" y2="168" stroke="currentColor" opacity=".18"/>

  <text x="24" y="192" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS CASOS BORDE — y el que más veces rompe</text>

  <rect x="24" y="204" width="152" height="44" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.1"/>
  <text x="100" y="222" text-anchor="middle" fill="currentColor" opacity=".72" font-size="10" font-weight="700">vacío</text>
  <text x="100" y="238" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">[]  ·  ""</text>

  <rect x="188" y="204" width="152" height="44" rx="8" fill="#f87171" fill-opacity=".24" stroke="#f87171" stroke-width="1.8"/>
  <text x="264" y="222" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">UNO SOLO</text>
  <text x="264" y="238" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">el que más rompe</text>

  <rect x="352" y="204" width="152" height="44" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.1"/>
  <text x="428" y="222" text-anchor="middle" fill="currentColor" opacity=".72" font-size="10" font-weight="700">todos iguales</text>
  <text x="428" y="238" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">[5, 5, 5]</text>

  <rect x="516" y="204" width="140" height="44" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.1"/>
  <text x="586" y="222" text-anchor="middle" fill="currentColor" opacity=".72" font-size="10" font-weight="700">extremos</text>
  <text x="586" y="238" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">0 · negativos · máximo</text>

  <rect x="24" y="258" width="632" height="34" rx="8" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="279" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">
    Un algoritmo que compara de a pares funciona con tres elementos y se rompe con uno: no hay “siguiente”.</text>

  <rect x="24" y="304" width="632" height="82" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="44" y="324" fill="#7c5cff" font-size="12" font-weight="700">ESCRIBIR PRIMERO LO OBVIO NO ES PERDER TIEMPO</text>
  <text x="44" y="344" fill="currentColor" opacity=".78" font-size="11">
    Te da una <tspan font-weight="700">referencia correcta</tspan> contra la cual comparar la versión optimizada.</text>
  <text x="44" y="362" fill="currentColor" opacity=".78" font-size="11">
    Y muchas veces la versión obvia <tspan font-weight="700">alcanza</tspan>: con 50 elementos, O(n²) es instantáneo.</text>
  <text x="44" y="380" fill="#7c5cff" font-size="11" font-weight="700">
    Optimizar sin tener la versión correcta es optimizar algo que quizás está mal.</text>
</svg>`,
        pie: 'Si no podés resolverlo a mano con un ejemplo, todavía no entendiste el problema.',
      },

      entrevista: [
        { p: '¿Cuál es tu método para encarar un problema nuevo?',
          r: 'Cinco pasos: <b>entender</b> qué entra y qué sale, <b>ejemplificar</b> resolviéndolo a mano con dos o tres casos, ' +
             '<b>descomponer</b> en el paso más chico que pueda resolver, <b>escribir la versión obvia</b> sin optimizar, ' +
             'y <b>verificar</b> con los casos borde. El segundo es el que más tiempo ahorra y el que casi nadie hace: ' +
             'resolver ejemplos a mano <b>genera preguntas</b> que el enunciado no aclaraba, y responderlas antes de programar evita reescribir.' },

        { p: '¿Qué casos borde probás siempre?',
          r: 'Vacío, un solo elemento, todos iguales, extremos —cero, negativos, el máximo—, entrada ya ordenada o al revés, y nulo o indefinido. ' +
             'El que más veces rompe es <b>un solo elemento</b>: un algoritmo que compara de a pares —el actual con el siguiente— ' +
             'funciona perfecto con tres y <b>se rompe con uno</b>, porque no hay siguiente. Es el más olvidado y el más barato de verificar.' },

        { p: '¿Por qué escribir primero la versión obvia?',
          r: 'Por dos razones. Te da una <b>referencia correcta</b> contra la cual comparar la versión optimizada — sin ella, no sabés si la optimizada ' +
             'sigue dando bien. Y muchas veces la versión obvia <b>alcanza</b>: si la lista tiene cincuenta elementos, un algoritmo cuadrático es ' +
             'instantáneo. <b>Optimizar sin tener primero la versión correcta es optimizar algo que quizás está mal.</b>' },

        { p: '¿Qué pregunta hacés siempre antes de elegir el enfoque?',
          r: '<b>¿Cuán grande puede ser la entrada?</b> Es la que decide si el rendimiento importa. Con cincuenta elementos, cualquier cosa funciona ' +
             'y conviene el código más claro. Con un millón, la diferencia entre lineal y cuadrático es entre un segundo y varias horas. ' +
             'Preguntarlo antes evita las dos formas de equivocarse: optimizar de más algo trivial, o elegir un enfoque que no escala.' },
      ],

      practica: `
<h4>Ejercicio 1 — Aplicar el método completo</h4>
<pre><code>Problema: dada una lista de transacciones { id, monto, tipo },
devolver el total por tipo, ordenado de mayor a menor.

Antes de escribir:
  1 · ¿Qué pasa si la lista está vacía?
  2 · ¿Los montos pueden ser negativos?
  3 · ¿Qué formato tiene que tener la salida?
  4 · Resolvé a mano este caso:
      [{id:1, monto:100, tipo:'venta'},
       {id:2, monto:50,  tipo:'gasto'},
       {id:3, monto:200, tipo:'venta'}]</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>A mano: venta = 100 + 200 = 300 · gasto = 50
Salida esperada: [{tipo:'venta', total:300}, {tipo:'gasto', total:50}]

function totalPorTipo(transacciones) {
  const acumulado = new Map();

  for (const t of transacciones) {
    acumulado.set(t.tipo, (acumulado.get(t.tipo) ?? 0) + t.monto);
  }

  return [...acumulado.entries()]
    .map(([tipo, total]) =&gt; ({ tipo, total }))
    .sort((a, b) =&gt; b.total - a.total);
}

// Casos borde verificados:
totalPorTipo([]);                              // []
totalPorTipo([{id:1, monto:0, tipo:'x'}]);     // [{tipo:'x', total:0}]</code></pre>
</details>

<h4>Ejercicio 2 — Encontrar la pregunta que falta</h4>
<pre><code>Problema: "escribí una función que reciba un texto y devuelva
la palabra más larga".

¿Qué preguntas hay que hacer antes de escribir?</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>· ¿Qué separa las palabras? ¿solo espacios? ¿saltos de línea? ¿comas?
· ¿Los signos de puntuación cuentan como parte de la palabra?
  "hola," ¿mide 4 o 5?
· Si hay empate, ¿cuál devuelvo? ¿la primera? ¿todas?
· ¿Qué devuelvo si el texto está vacío?
· ¿Los acentos y la ñ cuentan como un carácter?  ← ojo con emojis

Sin responder la tercera, dos implementaciones correctas
pueden dar resultados distintos.</code></pre>
</details>

<h4>Ejercicio 3 — Casos borde</h4>
<pre><code>function promedio(nums) {
  return nums.reduce((a, b) =&gt; a + b) / nums.length;
}

¿Con qué entradas se rompe?</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>promedio([])        → TypeError: reduce sin valor inicial en lista vacía
promedio([5])       → 5 ✔ (funciona, pero conviene verificarlo)

Corregido:
function promedio(nums) {
  if (nums.length === 0) return 0;          // o null, según el contrato
  return nums.reduce((a, b) =&gt; a + b, 0) / nums.length;
}

El valor inicial del reduce es lo que evita el error.
Y decidir qué devolver con lista vacía es una decisión de CONTRATO,
no un detalle: 0 y null significan cosas distintas para quien llama.</code></pre>
</details>

<h4>Rutina para practicar</h4>
<table>
<tr><th>Paso</th><th>Tiempo</th></tr>
<tr><td>Leer el problema y escribir qué entra y qué sale</td><td>2 min</td></tr>
<tr><td>Resolver 2 ejemplos a mano</td><td>5 min</td></tr>
<tr><td>Listar los casos borde</td><td>2 min</td></tr>
<tr><td>Escribir la versión obvia</td><td>10 min</td></tr>
<tr><td>Probar los casos borde</td><td>3 min</td></tr>
<tr><td>Recién ahí, pensar si hace falta optimizar</td><td>—</td></tr>
</table>
`,

      errores: [
        { mito: 'Leo el problema y empiezo a escribir: así voy más rápido.',
          realidad: 'Casi todos los problemas que "no salen" son de <b>no haber entendido el problema</b>. Resolver dos ejemplos a mano son cinco ' +
                    'minutos de papel contra una hora de código que hay que tirar.' },

        { mito: 'Los ejemplos sirven para confirmar que entendí.',
          realidad: 'Sirven sobre todo para <b>generar preguntas</b>. Un enunciado ambiguo se ve ambiguo recién cuando intentás resolver un caso ' +
                    'concreto — y ahí aparece "¿qué pasa si hay empate?".' },

        { mito: 'Escribo directo la versión eficiente.',
          realidad: 'Sin la versión obvia no tenés <b>referencia correcta</b> para comparar. Y muchas veces la obvia alcanza: ' +
                    'con cincuenta elementos, cuadrático es instantáneo.' },

        { mito: 'Los casos borde los pruebo al final, si sobra tiempo.',
          realidad: 'El de <b>un solo elemento</b> rompe muchísimos algoritmos que comparan de a pares, y verificarlo cuesta treinta segundos. ' +
                    'Listarlos antes de escribir cambia cómo escribís.' },
      ],

      glosario: [
        { t: 'Caso borde', d: 'Entrada extrema o inusual donde muchos algoritmos fallan.' },
        { t: 'Descomponer', d: 'Partir un problema en pasos que sí sabés resolver.' },
        { t: 'Versión obvia', d: 'La implementación más directa. Sirve de referencia correcta.' },
        { t: 'Contrato', d: 'Qué recibe y qué devuelve una función, incluidos los casos límite.' },
        { t: 'Pseudocódigo', d: 'Describir el algoritmo sin sintaxis, para ver la estructura.' },
        { t: 'Tamaño de la entrada', d: 'Lo que decide si el rendimiento importa o no.' },
        { t: 'Invariante', d: 'Condición que se mantiene verdadera durante todo el algoritmo.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es el paso del método que más tiempo ahorra y casi nadie hace?',
      opciones: [
        'Resolver dos o tres ejemplos a mano antes de escribir código',
        'Escribir pseudocódigo completo',
        'Investigar algoritmos similares',
        'Definir los tipos de TypeScript',
      ],
      correcta: 0,
      porQue: 'Resolver ejemplos a mano genera preguntas que el enunciado no aclaraba. Son cinco minutos de papel contra una hora de código que hay que tirar.',
      porQueNo: {
        1: 'Sirve en algoritmos de varios pasos, no siempre.',
        2: 'Puede ayudar, pero no revela las ambigüedades del enunciado.',
        3: 'Es útil y no reemplaza entender el problema.',
      },
    },
    {
      p: '¿Para qué sirven principalmente los ejemplos resueltos a mano?',
      opciones: [
        'Para generar preguntas que el enunciado no aclaraba',
        'Para confirmar que entendiste bien',
        'Para tener casos de test',
        'Para estimar el tiempo de desarrollo',
      ],
      correcta: 0,
      porQue: 'Un enunciado ambiguo se ve ambiguo recién cuando intentás resolver un caso concreto: ahí aparece "¿qué pasa si hay empate?".',
      porQueNo: {
        1: 'También, pero el valor mayor está en lo que revelan que falta.',
        2: 'Es un beneficio secundario.',
        3: 'No tiene relación con la estimación.',
      },
    },
    {
      p: '¿Cuál es el caso borde que más veces rompe un algoritmo?',
      opciones: [
        'Un solo elemento: los que comparan de a pares fallan porque no hay "siguiente"',
        'Lista vacía',
        'Números muy grandes',
        'Elementos repetidos',
      ],
      correcta: 0,
      porQue: 'Funciona perfecto con tres elementos y se rompe con uno. Es el más olvidado y el más barato de verificar.',
      porQueNo: {
        1: 'Rompe seguido, pero suele contemplarse primero.',
        2: 'Es un caso específico de ciertos problemas.',
        3: 'Importa, pero no es el que más algoritmos rompe.',
      },
    },
    {
      p: '¿Por qué conviene escribir primero la versión obvia?',
      opciones: [
        'Porque da una referencia correcta para comparar, y muchas veces alcanza',
        'Porque es más fácil de explicar',
        'Porque los revisores la prefieren',
        'Porque siempre es más rápida de ejecutar',
      ],
      correcta: 0,
      porQue: 'Con cincuenta elementos, un algoritmo cuadrático es instantáneo. Optimizar sin tener primero la versión correcta es optimizar algo que quizás está mal.',
      porQueNo: {
        1: 'Es un beneficio menor frente a tener una referencia correcta.',
        2: 'No es un criterio técnico.',
        3: 'Suele ser más lenta: la ventaja es que es correcta y simple.',
      },
    },
    {
      p: '¿Qué pregunta decide si el rendimiento importa?',
      opciones: [
        '¿Cuán grande puede ser la entrada?',
        '¿Qué lenguaje estoy usando?',
        '¿Cuántas veces se va a ejecutar?',
        '¿Qué estructura de datos uso?',
      ],
      correcta: 0,
      porQue: 'Con cincuenta elementos cualquier cosa funciona y conviene el código más claro. Con un millón, la diferencia entre lineal y cuadrático es entre un segundo y varias horas.',
      porQueNo: {
        1: 'Influye en constantes, no en el orden de crecimiento.',
        2: 'Importa, pero el tamaño de entrada domina la decisión.',
        3: 'Es consecuencia de la respuesta, no la pregunta previa.',
      },
    },
    {
      p: 'En "devolver la palabra más larga de un texto", ¿qué pregunta falta?',
      opciones: [
        'Si hay empate, ¿cuál devuelvo? Sin eso, dos implementaciones correctas dan resultados distintos',
        '¿Qué lenguaje uso?',
        '¿Cuántas palabras tiene el texto?',
        '¿Devuelvo mayúsculas o minúsculas?',
      ],
      correcta: 0,
      porQue: 'También falta definir qué separa las palabras y si la puntuación cuenta. Son ambigüedades que solo se ven al intentar resolver un caso concreto.',
      porQueNo: {
        1: 'No cambia la definición del problema.',
        2: 'Importa para el rendimiento, no para la corrección.',
        3: 'Es un detalle menor comparado con el empate.',
      },
    },
    {
      p: '¿Por qué reduce sin valor inicial falla con una lista vacía?',
      opciones: [
        'Porque sin valor inicial toma el primer elemento como acumulador, y no hay ninguno',
        'Porque devuelve undefined',
        'Porque no acepta listas',
        'Porque el callback recibe parámetros incorrectos',
      ],
      correcta: 0,
      porQue: 'Pasarle un valor inicial —por ejemplo cero— resuelve el caso vacío. Y decidir qué devolver con lista vacía es una decisión de contrato.',
      porQueNo: {
        1: 'Lanza un TypeError, no devuelve undefined.',
        2: 'Es un método de Array: acepta listas.',
        3: 'El callback ni siquiera llega a ejecutarse.',
      },
    },
    {
      p: 'Con lista vacía, ¿devolver 0 o null es un detalle menor?',
      opciones: [
        'No: es una decisión de contrato, porque significan cosas distintas para quien llama',
        'Sí, cualquiera sirve',
        'Siempre conviene 0',
        'Siempre conviene null',
      ],
      correcta: 0,
      porQue: 'Cero dice "el promedio es cero"; null dice "no hay promedio". Quien llama va a tratar esos dos casos de forma distinta.',
      porQueNo: {
        1: 'Cambia el significado para el consumidor de la función.',
        2: 'Puede ser engañoso si no hay datos.',
        3: 'Obliga a manejar el caso nulo aunque a veces no haga falta.',
      },
    },
    {
      p: '¿Qué significa descomponer un problema?',
      opciones: [
        'Partirlo en pasos que sí sabés resolver, aunque el problema completo no lo supieras',
        'Dividir el código en funciones chicas',
        'Separar en archivos distintos',
        'Escribir el algoritmo en pseudocódigo',
      ],
      correcta: 0,
      porQue: '"Agrupar pedidos por cliente y calcular totales" se vuelve recorrer, identificar el cliente, acumular y devolver. Cada paso es trivial; el problema completo no lo era.',
      porQueNo: {
        1: 'Es una consecuencia posible, no la descomposición mental.',
        2: 'Es organización de código, otro tema.',
        3: 'Es una forma de expresarlo, no de descomponerlo.',
      },
    },
    {
      p: '¿Cuándo sirve realmente el pseudocódigo?',
      opciones: [
        'Cuando el algoritmo tiene varios pasos y querés ver la estructura sin pelear con la sintaxis',
        'Siempre, antes de cualquier función',
        'Solo en entrevistas',
        'Cuando el problema es matemático',
      ],
      correcta: 0,
      porQue: 'No como ritual: como herramienta para separar la estructura de la implementación cuando hay complejidad suficiente para justificarlo.',
      porQueNo: {
        1: 'Para una función de tres líneas es puro trámite.',
        2: 'Sirve igual en el trabajo diario.',
        3: 'El tipo de problema no determina su utilidad.',
      },
    },
    {
      p: '¿Qué revela el caso [5, 5, 5] en un problema de "devolver los duplicados"?',
      opciones: [
        'Una ambigüedad: ¿el resultado incluye el 5 una vez o tres?',
        'Que el algoritmo es correcto',
        'Que hay que usar un Set',
        'Que la entrada es inválida',
      ],
      correcta: 0,
      porQue: 'Es exactamente el tipo de pregunta que solo aparece al resolver un caso concreto, y que dos implementaciones correctas pueden responder distinto.',
      porQueNo: {
        1: 'No verifica corrección: revela una decisión pendiente.',
        2: 'Es una posible implementación, no lo que el caso revela.',
        3: 'Es una entrada perfectamente válida.',
      },
    },
    {
      p: '¿Qué se hace después de escribir la versión obvia y verificarla?',
      opciones: [
        'Recién ahí pensar si hace falta optimizar, según el tamaño real de la entrada',
        'Optimizarla siempre',
        'Reescribirla en un estilo funcional',
        'Agregar tipos y documentación',
      ],
      correcta: 0,
      porQue: 'Si la entrada es chica, la versión obvia alcanza y es más clara. Optimizar sin necesidad agrega complejidad sin comprar nada.',
      porQueNo: {
        1: 'Optimizar sin necesidad agrega complejidad sin beneficio.',
        2: 'El estilo no cambia la corrección ni el rendimiento.',
        3: 'Es buena práctica, pero no es el siguiente paso lógico.',
      },
    },
    {
      p: '¿Qué caso borde suele romper algoritmos de ordenamiento o búsqueda?',
      opciones: [
        'La entrada ya ordenada o al revés: rompe supuestos de muchos algoritmos',
        'Números pares',
        'Listas de longitud par',
        'Elementos de tipos mixtos',
      ],
      correcta: 0,
      porQue: 'Es un caso que parece favorable y sin embargo dispara el peor comportamiento de varios algoritmos clásicos.',
      porQueNo: {
        1: 'La paridad de los valores no afecta.',
        2: 'La longitud par rara vez es un caso especial.',
        3: 'Es un problema de validación, no de algoritmo.',
      },
    },
    {
      p: '¿Cuál es la primera pregunta del paso "entender"?',
      opciones: [
        'Qué recibo exactamente: tipo, rango, si puede venir vacío',
        'Qué algoritmo voy a usar',
        'Cuánto va a tardar',
        'Dónde voy a guardar el resultado',
      ],
      correcta: 0,
      porQue: 'Las decisiones de algoritmo y estructura vienen después de saber qué entra, qué sale y qué no está claro.',
      porQueNo: {
        1: 'Elegir el algoritmo antes de entender el problema es el orden inverso.',
        2: 'Depende del enfoque, que todavía no elegiste.',
        3: 'Es una decisión posterior.',
      },
    },
    {
      p: 'Un problema "no sale". ¿Cuál es la causa más probable?',
      opciones: [
        'No entendiste bien el problema, no que falte técnica',
        'Falta conocer un algoritmo específico',
        'El lenguaje no es el adecuado',
        'Hay un error de sintaxis',
      ],
      correcta: 0,
      porQue: 'Casi todos los problemas que no salen se resuelven volviendo a los primeros dos pasos: entender y ejemplificar a mano.',
      porQueNo: {
        1: 'Ocurre, pero es mucho menos frecuente.',
        2: 'Rara vez es la causa real.',
        3: 'Se detecta de inmediato y no explica un bloqueo conceptual.',
      },
    },
  ],
});
