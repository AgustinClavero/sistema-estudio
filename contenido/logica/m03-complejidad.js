/* ==========================================================================
   Lógica · Módulo 03 — Complejidad y Big-O
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'logica',
  id: 'm03',
  titulo: 'Complejidad y Big-O',
  fuentes: ['big-o', 'mdn-js'],

  intro:
    '<p>Big-O tiene fama de tema académico y en realidad responde una pregunta muy práctica: ' +
    '<b>¿esto va a seguir funcionando cuando haya diez veces más datos?</b></p>' +
    '<p>No hace falta demostrar nada ni recordar fórmulas. Alcanza con reconocer cuatro o cinco formas comunes y ' +
    'saber cuál te va a explotar.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Leer la complejidad sin fórmulas',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> Big-O no mide cuánto tarda algo: mide
<b>cuánto más tarda cuando la entrada crece</b>. Es una pendiente, no un número.</div>

<h4>Las que hay que reconocer</h4>
<table>
<tr><th>Notación</th><th>Nombre</th><th>Si duplicás la entrada…</th></tr>
<tr><td><b>O(1)</b></td><td>Constante</td><td>Tarda igual</td></tr>
<tr><td><b>O(log n)</b></td><td>Logarítmica</td><td>Casi igual</td></tr>
<tr><td><b>O(n)</b></td><td>Lineal</td><td>El doble</td></tr>
<tr><td><b>O(n log n)</b></td><td>Casi lineal</td><td>Poco más del doble</td></tr>
<tr><td><b>O(n²)</b></td><td>Cuadrática</td><td><b>Cuatro veces</b></td></tr>
<tr><td><b>O(2ⁿ)</b></td><td>Exponencial</td><td>Impracticable</td></tr>
</table>

<h4>Cómo se ve con números reales</h4>
<pre><code>n = 100          n = 10.000        n = 1.000.000

O(1)          1              1                 1
O(log n)      7             13                20
O(n)        100         10.000         1.000.000
O(n log n)  700        130.000        20.000.000
O(n²)    10.000    100.000.000   1.000.000.000.000  ← acá muere</code></pre>

<div class="aviso"><strong>Fijate en la última fila: con un millón de elementos, un algoritmo cuadrático hace
un billón de operaciones.</strong> No es "más lento": es que <b>no termina nunca</b> en un tiempo útil. ' +
Y con cien elementos era instantáneo. <b>Ese salto es la razón por la que Big-O importa.</b></div>

<h4>Cómo leerla mirando el código</h4>
<pre><code>Un bucle sobre la entrada        →  O(n)
Dos bucles anidados              →  O(n²)
Un bucle que parte a la mitad    →  O(log n)
Ordenar                          →  O(n log n)
Buscar en un mapa o conjunto     →  O(1)
Buscar en un array               →  O(n)</code></pre>

<h4>Las reglas para simplificar</h4>
<pre><code>1 · Se ignoran las constantes:  O(2n)  →  O(n)
2 · Se queda el término mayor:  O(n² + n)  →  O(n²)
3 · Bucles anidados se multiplican
4 · Bucles seguidos se suman (y queda el mayor)</code></pre>
`,

      tecnico: `
<h4>El error de lectura más común</h4>
<pre><code>// ❌ "Son dos bucles: O(n²)"
for (const a of lista) { … }
for (const b of lista) { … }
// NO: son seguidos, no anidados → O(n) + O(n) = O(n)

// ✔ Esto sí es O(n²)
for (const a of lista) {
  for (const b of lista) { … }
}</code></pre>

<div class="dato"><strong>La distinción es simple y se confunde todo el tiempo:</strong>
<b>anidados se multiplican, seguidos se suman</b>. Y como en la suma queda el mayor, diez bucles seguidos sobre
la misma lista siguen siendo O(n) — más lentos por una constante, sí, pero con la misma pendiente.</div>

<h4>La complejidad escondida de los métodos</h4>
<table>
<tr><th>Operación</th><th>Complejidad</th></tr>
<tr><td><code>array.push()</code> / <code>pop()</code></td><td>O(1)</td></tr>
<tr><td><code>array.shift()</code> / <code>unshift()</code></td><td><b>O(n)</b></td></tr>
<tr><td><code>array.includes()</code> / <code>indexOf()</code></td><td>O(n)</td></tr>
<tr><td><code>array.sort()</code></td><td>O(n log n)</td></tr>
<tr><td><code>array.slice()</code> / spread</td><td>O(n)</td></tr>
<tr><td><code>map.get()</code> / <code>set()</code> / <code>has()</code></td><td>O(1)</td></tr>
<tr><td><code>set.has()</code> / <code>add()</code></td><td>O(1)</td></tr>
</table>

<div class="dato"><strong>Las dos filas que más sorprenden son <code>shift</code> y el spread.</strong> ' +
Un <code>[...acumulado, nuevo]</code> dentro de un bucle <b>copia todo el array en cada vuelta</b>, ' +
convirtiendo un recorrido lineal en cuadrático. Es el patrón "elegante" que más rendimiento arruina, ' +
y es especialmente común en código con estilo funcional.</div>

<h4>Complejidad espacial</h4>
<pre><code>No solo importa el tiempo: también cuánta memoria extra usás.

O(1) espacio    unas pocas variables, sin importar la entrada
O(n) espacio    una copia de la entrada, un mapa auxiliar
O(n²) espacio   una matriz de n × n  ← con n grande, no entra</code></pre>

<div class="dato"><strong>Y muchas veces se intercambia una por otra:</strong> usar un mapa auxiliar
convierte una búsqueda de O(n) en O(1) <b>a cambio de O(n) de memoria</b>. Casi siempre conviene — ' +
la memoria es barata y el tiempo no— pero es una decisión, no algo gratis. ' +
Con datos que no entran en memoria, el intercambio se invierte.</div>

<h4>Cuándo importa y cuándo no</h4>
<pre><code>n &lt; 100          da igual: usá lo más claro
n &lt; 10.000       evitá O(n²) si podés
n &lt; 1.000.000    O(n) u O(n log n)
n &gt; 1.000.000    hay que pensarlo de verdad

Y la pregunta previa: ¿cuántas veces se ejecuta?
Un O(n²) sobre 200 elementos que corre una vez por día: irrelevante.
Un O(n) sobre 200 elementos que corre en cada petición: puede importar.</code></pre>

<div class="dato"><strong>Esa última distinción evita las dos formas de equivocarse.</strong> Optimizar un
cuadrático que corre una vez por día es tiempo perdido; ignorar un lineal que corre mil veces por minuto ' +
es un problema real. <b>La complejidad se evalúa junto con la frecuencia</b>, no sola.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LO QUE PASA CUANDO LA ENTRADA CRECE</text>

  <line x1="70" y1="180" x2="640" y2="180" stroke="currentColor" opacity=".3" stroke-width="1.2"/>
  <line x1="70" y1="180" x2="70" y2="40" stroke="currentColor" opacity=".3" stroke-width="1.2"/>
  <text x="640" y="196" text-anchor="end" fill="currentColor" opacity=".5" font-size="9">tamaño de la entrada →</text>
  <text x="62" y="46" text-anchor="end" fill="currentColor" opacity=".5" font-size="9">tiempo</text>

  <path d="M 70 176 L 640 174" stroke="#34d399" stroke-width="2.4" fill="none"/>
  <text x="600" y="166" fill="#34d399" font-size="10" font-weight="700">O(1)</text>

  <path d="M 70 176 Q 250 158 640 148" stroke="#22d3ee" stroke-width="2.4" fill="none"/>
  <text x="600" y="140" fill="#22d3ee" font-size="10" font-weight="700">O(log n)</text>

  <path d="M 70 176 L 640 96" stroke="#7c5cff" stroke-width="2.4" fill="none"/>
  <text x="600" y="88" fill="#7c5cff" font-size="10" font-weight="700">O(n)</text>

  <path d="M 70 176 Q 380 120 640 56" stroke="#fbbf24" stroke-width="2.4" fill="none"/>
  <text x="596" y="50" fill="#fbbf24" font-size="10" font-weight="700">O(n log n)</text>

  <path d="M 70 176 Q 340 168 470 44" stroke="#f87171" stroke-width="2.8" fill="none"/>
  <text x="452" y="38" fill="#f87171" font-size="10" font-weight="700">O(n²)</text>

  <rect x="24" y="206" width="632" height="52" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="44" y="226" fill="#f87171" font-size="12" font-weight="700">CON UN MILLÓN DE ELEMENTOS, UN CUADRÁTICO HACE UN BILLÓN DE OPERACIONES</text>
  <text x="44" y="246" fill="currentColor" opacity=".78" font-size="11">
    No es “más lento”: <tspan font-weight="700">no termina nunca</tspan> en un tiempo útil. Y con cien elementos era instantáneo.</text>

  <text x="24" y="282" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA CONFUSIÓN MÁS COMÚN</text>

  <rect x="24" y="294" width="304" height="60" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="176" y="314" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">bucles SEGUIDOS → se suman</text>
  <text x="44" y="332" fill="currentColor" opacity=".7" font-size="10" font-family="monospace">for (a) {…}  for (b) {…}</text>
  <text x="44" y="348" fill="#34d399" font-size="10.5" font-weight="700">O(n) + O(n) = O(n)</text>

  <rect x="352" y="294" width="304" height="60" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.4"/>
  <text x="504" y="314" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">bucles ANIDADOS → se multiplican</text>
  <text x="372" y="332" fill="currentColor" opacity=".7" font-size="10" font-family="monospace">for (a) { for (b) {…} }</text>
  <text x="372" y="348" fill="#f87171" font-size="10.5" font-weight="700">O(n) × O(n) = O(n²)</text>

  <rect x="24" y="362" width="632" height="24" rx="7" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="340" y="379" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">
    [...acumulado, nuevo] dentro de un bucle copia TODO en cada vuelta: convierte un lineal en cuadrático.</text>
</svg>`,
        pie: 'La complejidad se evalúa junto con la frecuencia. Un cuadrático que corre una vez por día es irrelevante.',
      },

      entrevista: [
        { p: '¿Qué mide Big-O exactamente?',
          r: 'No cuánto tarda algo, sino <b>cuánto más tarda cuando la entrada crece</b>: es una pendiente, no un número. ' +
             'Por eso se ignoran las constantes: un algoritmo lineal que hace dos pasadas sigue siendo lineal, ' +
             'porque al duplicar la entrada tarda el doble en los dos casos. Lo que importa es <b>si la curva se dispara</b> ' +
             'cuando los datos crecen.' },

        { p: '¿Cuál es la confusión más común al leer complejidad?',
          r: 'Confundir bucles <b>seguidos</b> con bucles <b>anidados</b>. Dos bucles uno tras otro <b>se suman</b> y queda el mayor: ' +
             'siguen siendo lineales. Dos bucles anidados <b>se multiplican</b>: eso sí es cuadrático. ' +
             'Diez bucles seguidos sobre la misma lista siguen siendo O(n) — más lentos por una constante, sí, pero con la misma pendiente.' },

        { p: '¿Qué complejidades escondidas de los métodos de array conviene conocer?',
          r: 'Dos que sorprenden. <code>shift</code> y <code>unshift</code> son <b>lineales</b>, porque mueven todos los elementos. ' +
             'Y el spread para copiar también: <code>[...acumulado, nuevo]</code> <b>dentro de un bucle copia todo en cada vuelta</b>, ' +
             'convirtiendo un recorrido lineal en cuadrático. Es el patrón "elegante" que más rendimiento arruina, ' +
             'y es especialmente común en código con estilo funcional.' },

        { p: '¿Cuándo importa la complejidad y cuándo no?',
          r: 'Depende de dos cosas, no de una: el <b>tamaño de la entrada</b> y la <b>frecuencia de ejecución</b>. ' +
             'Un algoritmo cuadrático sobre doscientos elementos que corre una vez por día es irrelevante; ' +
             'uno lineal sobre doscientos elementos que corre en cada petición puede importar. ' +
             'Evaluarlas juntas evita las dos formas de equivocarse: optimizar lo que no hace falta e ignorar lo que sí.' },
      ],

      practica: `
<h4>Ejercicio 1 — Identificar la complejidad</h4>
<pre><code>// A
function sumar(nums) {
  let t = 0;
  for (const n of nums) t += n;
  return t;
}

// B
function pares(nums) {
  const r = [];
  for (const a of nums)
    for (const b of nums)
      if (a + b === 10) r.push([a, b]);
  return r;
}

// C
function buscar(ordenados, x) {
  let i = 0, f = ordenados.length - 1;
  while (i &lt;= f) {
    const m = Math.floor((i + f) / 2);
    if (ordenados[m] === x) return m;
    if (ordenados[m] &lt; x) i = m + 1; else f = m - 1;
  }
  return -1;
}

// D
function normalizar(nums) {
  const max = Math.max(...nums);
  return nums.map((n) =&gt; n / max);
}</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>A → O(n)        un bucle sobre la entrada
B → O(n²)       dos bucles anidados
C → O(log n)    parte el rango a la mitad en cada vuelta
D → O(n)        Math.max recorre una vez, map otra: n + n = O(n)

El D es el que más se responde mal: parece O(1) porque no
se ve el bucle, pero el spread y Math.max recorren todo.</code></pre>
</details>

<h4>Ejercicio 2 — El spread que arruina</h4>
<pre><code>function acumular(items) {
  let resultado = [];
  for (const i of items) {
    resultado = [...resultado, transformar(i)];
  }
  return resultado;
}

¿Cuál es la complejidad? ¿Cómo se arregla?</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>Es O(n²): en cada vuelta copia todo el array acumulado.
Con 10.000 elementos hace ~50.000.000 de copias.

Arreglado:
function acumular(items) {
  const resultado = [];
  for (const i of items) {
    resultado.push(transformar(i));   // push es O(1)
  }
  return resultado;
}

O directamente:
const acumular = (items) =&gt; items.map(transformar);

Las tres versiones se leen parecido. Solo la primera es cuadrática.</code></pre>
</details>

<h4>Ejercicio 3 — Intercambiar memoria por tiempo</h4>
<pre><code>Dada una lista de números y un objetivo, devolver los índices
de los dos que suman el objetivo.

Versión obvia: dos bucles anidados → O(n²)
¿Cómo llegar a O(n)?</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>function dosSuman(nums, objetivo) {
  const vistos = new Map();          // valor → índice

  for (let i = 0; i &lt; nums.length; i++) {
    const falta = objetivo - nums[i];
    if (vistos.has(falta)) return [vistos.get(falta), i];
    vistos.set(nums[i], i);
  }
  return null;
}

O(n) en tiempo, O(n) en memoria.
El intercambio: gastás memoria para el mapa y ganás
que buscar el complemento sea directo en vez de recorrer.</code></pre>
</details>

<h4>Referencia rápida</h4>
<table>
<tr><th>Si veo…</th><th>Es…</th></tr>
<tr><td>Acceso directo por índice o clave</td><td>O(1)</td></tr>
<tr><td>Un bucle sobre la entrada</td><td>O(n)</td></tr>
<tr><td>Bucles anidados</td><td>O(n²)</td></tr>
<tr><td>Partir a la mitad en cada paso</td><td>O(log n)</td></tr>
<tr><td>Ordenar</td><td>O(n log n)</td></tr>
<tr><td>Probar todas las combinaciones</td><td>O(2ⁿ)</td></tr>
</table>
`,

      errores: [
        { mito: 'Dos bucles en la misma función significan O(n²).',
          realidad: 'Solo si están <b>anidados</b>. Seguidos se suman, y queda el mayor: diez bucles seguidos sobre la misma lista ' +
                    'siguen siendo lineales.' },

        { mito: 'Copiar con spread es elegante y no tiene costo.',
          realidad: 'Copia <b>todo el array</b>. Dentro de un bucle convierte un recorrido lineal en cuadrático — ' +
                    'y es el patrón que más rendimiento arruina en código de estilo funcional.' },

        { mito: 'shift() y pop() cuestan lo mismo.',
          realidad: '<code>pop</code> saca del final y es constante; <code>shift</code> saca del principio y <b>mueve todos los demás</b>: ' +
                    'es lineal.' },

        { mito: 'Hay que optimizar todo lo que sea cuadrático.',
          realidad: 'Depende del <b>tamaño</b> y de la <b>frecuencia</b>. Un cuadrático sobre doscientos elementos que corre una vez por día ' +
                    'es irrelevante; un lineal que corre mil veces por minuto puede no serlo.' },
      ],

      glosario: [
        { t: 'Big-O', d: 'Cómo crece el tiempo o la memoria al crecer la entrada.' },
        { t: 'O(1)', d: 'Constante: no depende del tamaño de la entrada.' },
        { t: 'O(log n)', d: 'Logarítmica: parte el problema a la mitad en cada paso.' },
        { t: 'O(n)', d: 'Lineal: una pasada por la entrada.' },
        { t: 'O(n log n)', d: 'Lo que cuesta ordenar. El techo práctico habitual.' },
        { t: 'O(n²)', d: 'Cuadrática: bucles anidados. Explota con datos grandes.' },
        { t: 'Complejidad espacial', d: 'Memoria extra que usa el algoritmo.' },
        { t: 'Intercambio tiempo-memoria', d: 'Gastar memoria para ganar velocidad, o al revés.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Qué mide Big-O?',
      opciones: [
        'Cuánto más tarda algo cuando la entrada crece: es una pendiente, no un número',
        'Cuántos milisegundos tarda una función',
        'Cuánta memoria RAM consume el proceso',
        'Cuántas líneas de código tiene el algoritmo',
      ],
      correcta: 0,
      porQue: 'Por eso se ignoran las constantes: un algoritmo que hace dos pasadas sigue siendo lineal, porque al duplicar la entrada tarda el doble en los dos casos.',
      porQueNo: {
        1: 'Depende de la máquina y del lenguaje: Big-O es independiente de eso.',
        2: 'Existe complejidad espacial, pero no es lo que mide la notación por sí sola.',
        3: 'No tiene relación con la longitud del código.',
      },
    },
    {
      p: 'Dos bucles uno tras otro sobre la misma lista, ¿qué complejidad tienen?',
      opciones: [
        'O(n): seguidos se suman y queda el término mayor',
        'O(n²): son dos bucles',
        'O(2n), que es una complejidad distinta',
        'Depende del contenido de la lista',
      ],
      correcta: 0,
      porQue: 'Anidados se multiplican, seguidos se suman. Diez bucles seguidos siguen siendo lineales: más lentos por una constante, con la misma pendiente.',
      porQueNo: {
        1: 'Eso ocurre solo si están anidados.',
        2: 'Las constantes se ignoran: O(2n) es O(n).',
        3: 'La complejidad depende de la estructura, no de los valores.',
      },
    },
    {
      p: '¿Qué complejidad tiene array.shift()?',
      opciones: [
        'O(n): saca del principio y mueve todos los demás elementos',
        'O(1), igual que pop',
        'O(log n)',
        'Depende del tamaño del elemento',
      ],
      correcta: 0,
      porQue: 'pop saca del final y es constante. shift saca del principio, y por eso una cola implementada con shift se vuelve cuadrática al recorrerla entera.',
      porQueNo: {
        1: 'pop es constante porque no reordena nada.',
        2: 'No hay ninguna partición del problema.',
        3: 'El costo viene del reacomodo de posiciones.',
      },
    },
    {
      p: '¿Cuál es el patrón "elegante" que más rendimiento arruina?',
      opciones: [
        'Copiar con spread dentro de un bucle: [...acumulado, nuevo]',
        'Usar map en vez de for',
        'Usar destructuring',
        'Usar funciones flecha',
      ],
      correcta: 0,
      porQue: 'Copia todo el array en cada vuelta, convirtiendo un recorrido lineal en cuadrático. Es especialmente común en código de estilo funcional.',
      porQueNo: {
        1: 'map recorre una sola vez: es lineal.',
        2: 'No tiene costo relevante.',
        3: 'Tampoco.',
      },
    },
    {
      p: 'Con un millón de elementos, ¿qué pasa con un algoritmo cuadrático?',
      opciones: [
        'Hace del orden de un billón de operaciones: no termina en un tiempo útil',
        'Tarda el doble que uno lineal',
        'Tarda un millón de veces más que con un elemento',
        'Consume mucha memoria pero termina rápido',
      ],
      correcta: 0,
      porQue: 'Y con cien elementos era instantáneo. Ese salto es la razón por la que Big-O importa: el código no cambió, cambió el volumen.',
      porQueNo: {
        1: 'La diferencia es de órdenes de magnitud, no del doble.',
        2: 'Es el cuadrado: un billón de veces más.',
        3: 'El problema es el tiempo, no necesariamente la memoria.',
      },
    },
    {
      p: '¿Qué complejidad tiene una búsqueda binaria?',
      opciones: [
        'O(log n): parte el rango a la mitad en cada paso',
        'O(n)',
        'O(n log n)',
        'O(1)',
      ],
      correcta: 0,
      porQue: 'Con un millón de elementos hace unas veinte comparaciones. Requiere que la lista esté ordenada.',
      porQueNo: {
        1: 'Eso sería recorrer la lista entera.',
        2: 'Eso es lo que cuesta ordenar.',
        3: 'No es acceso directo: hay varias comparaciones.',
      },
    },
    {
      p: 'function normalizar(nums) { const max = Math.max(...nums); return nums.map(n => n / max); }',
      opciones: [
        'Es O(n): Math.max recorre una vez y map otra, y n + n sigue siendo lineal',
        'Es O(1): no hay bucles visibles',
        'Es O(n²): hay dos operaciones sobre la lista',
        'Es O(n log n)',
      ],
      correcta: 0,
      porQue: 'Es el caso que más se responde mal: parece constante porque no se ve un for, pero el spread y Math.max recorren todo.',
      porQueNo: {
        1: 'El spread y Math.max recorren la lista completa.',
        2: 'Son operaciones seguidas, no anidadas: se suman.',
        3: 'No hay ordenamiento ni partición.',
      },
    },
    {
      p: '¿Qué es el intercambio tiempo-memoria?',
      opciones: [
        'Usar un mapa auxiliar para que buscar sea directo, a cambio de memoria extra',
        'Guardar los resultados en disco',
        'Comprimir los datos antes de procesarlos',
        'Ejecutar en paralelo',
      ],
      correcta: 0,
      porQue: 'Casi siempre conviene —la memoria es barata y el tiempo no— pero es una decisión, no algo gratis: con datos que no entran en memoria, el intercambio se invierte.',
      porQueNo: {
        1: 'Es otra técnica, con costos distintos.',
        2: 'Reduce espacio a cambio de tiempo de descompresión.',
        3: 'Cambia el uso de recursos, no la complejidad.',
      },
    },
    {
      p: '¿Cómo se resuelve "dos números que suman un objetivo" en O(n)?',
      opciones: [
        'Guardando en un mapa los valores vistos y buscando el complemento',
        'Ordenando primero la lista',
        'Con dos bucles anidados',
        'Con búsqueda binaria sobre cada elemento',
      ],
      correcta: 0,
      porQue: 'Una sola pasada: en cada elemento se pregunta si ya se vio el complemento. Cuesta O(n) de memoria y ahorra el bucle interno.',
      porQueNo: {
        1: 'Ordenar cuesta O(n log n) y no es necesario.',
        2: 'Eso es la versión cuadrática.',
        3: 'Sería O(n log n) y requiere ordenar antes.',
      },
    },
    {
      p: '¿Qué dos cosas determinan si la complejidad importa?',
      opciones: [
        'El tamaño de la entrada y la frecuencia de ejecución',
        'El lenguaje y el framework',
        'La cantidad de usuarios y el hosting',
        'El tipo de datos y su formato',
      ],
      correcta: 0,
      porQue: 'Un cuadrático sobre doscientos elementos que corre una vez por día es irrelevante; un lineal que corre mil veces por minuto puede no serlo.',
      porQueNo: {
        1: 'Afectan las constantes, no la pendiente.',
        2: 'Influyen indirectamente, pero no son el criterio.',
        3: 'Importan menos que el tamaño y la frecuencia.',
      },
    },
    {
      p: '¿Cuál es la complejidad de map.get() y set.has()?',
      opciones: [
        'O(1): acceso directo, sin importar cuántos elementos haya',
        'O(n)',
        'O(log n)',
        'Depende de la cantidad de claves',
      ],
      correcta: 0,
      porQue: 'Es justamente la razón por la que reemplazar un includes en un bucle por un Set cambia la complejidad del algoritmo entero.',
      porQueNo: {
        1: 'Esa es la complejidad de buscar en un array.',
        2: 'Eso correspondería a un árbol de búsqueda.',
        3: 'El acceso es constante independientemente del tamaño.',
      },
    },
    {
      p: '¿Qué complejidad tiene ordenar un array?',
      opciones: [
        'O(n log n)',
        'O(n)',
        'O(n²)',
        'O(log n)',
      ],
      correcta: 0,
      porQue: 'Es el techo práctico habitual: si tu algoritmo ya ordena, agregar una pasada lineal no cambia la complejidad total.',
      porQueNo: {
        1: 'No se puede ordenar por comparación en tiempo lineal.',
        2: 'Los algoritmos ingenuos son cuadráticos, pero los usados no.',
        3: 'Eso es buscar, no ordenar.',
      },
    },
    {
      p: 'Si un algoritmo hace 3n + 5 operaciones, ¿cuál es su complejidad?',
      opciones: [
        'O(n): se ignoran constantes y términos menores',
        'O(3n)',
        'O(n + 5)',
        'O(3n + 5)',
      ],
      correcta: 0,
      porQue: 'Big-O describe la pendiente, no el valor exacto: al duplicar la entrada, tanto n como 3n + 5 tardan aproximadamente el doble.',
      porQueNo: {
        1: 'Las constantes multiplicativas se ignoran.',
        2: 'Los términos menores también.',
        3: 'No se usa la expresión completa.',
      },
    },
    {
      p: '¿Cuándo la complejidad espacial se vuelve el problema principal?',
      opciones: [
        'Cuando los datos no entran en memoria: ahí el intercambio tiempo-memoria se invierte',
        'Cuando el algoritmo es lineal',
        'Cuando se usan objetos en vez de arrays',
        'Cuando hay muchas variables locales',
      ],
      correcta: 0,
      porQue: 'Con datos que caben, gastar memoria para ganar velocidad casi siempre conviene. Cuando no caben, hay que hacer lo contrario.',
      porQueNo: {
        1: 'La linealidad no dice nada sobre memoria.',
        2: 'La diferencia es marginal.',
        3: 'Unas pocas variables son espacio constante.',
      },
    },
    {
      p: '¿Qué significa que se "ignoren las constantes" en Big-O?',
      opciones: [
        'Que un algoritmo dos veces más lento tiene la misma complejidad, porque la pendiente es la misma',
        'Que no importan los valores constantes de la entrada',
        'Que las variables no cuentan',
        'Que se ignora el tiempo de arranque',
      ],
      correcta: 0,
      porQue: 'Big-O no dice cuál es más rápido hoy: dice cuál se va a romper cuando los datos crezcan. Para elegir entre dos algoritmos de la misma complejidad hay que medir.',
      porQueNo: {
        1: 'Se refiere a factores multiplicativos, no a valores de datos.',
        2: 'Las variables sí cuentan para la complejidad espacial.',
        3: 'No tiene relación con el arranque.',
      },
    },
  ],
});
