/* ==========================================================================
   Lógica · Módulo 04 — Recursión
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'logica',
  id: 'm04',
  titulo: 'Recursión',
  fuentes: ['visualgo', 'mdn-js'],

  intro:
    '<p>La recursión intimida porque se enseña con la sucesión de Fibonacci, que es justamente el caso donde ' +
    '<b>no conviene usarla</b>. En la práctica aparece en un lugar muy concreto: <b>estructuras anidadas</b> — ' +
    'árboles, carpetas, categorías, JSON.</p>' +
    '<p>Este módulo apunta a que la puedas escribir sin dudar, y a que sepas cuándo conviene iterar en su lugar.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Caso base, paso recursivo y cuándo iterar',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> una función recursiva se escribe respondiendo dos
preguntas — <b>¿cuándo paro?</b> y <b>¿cómo hago el problema más chico?</b>— y nada más.</div>

<h4>Las dos partes, siempre</h4>
<pre><code>function recursiva(entrada) {
  if (esElCasoMasSimple(entrada)) {
    return respuestaDirecta;              // ← CASO BASE: cuándo paro
  }
  return combinar(recursiva(masChico(entrada)));  // ← PASO RECURSIVO
}</code></pre>

<div class="aviso"><strong>Si te trabás escribiendo recursión, casi siempre es porque
<b>no definiste el caso base primero</b>.</strong> Escribirlo antes que el paso recursivo cambia la dificultad
por completo: con el caso base claro, el resto es casi mecánico.</div>

<h4>El error que produce el error más famoso</h4>
<pre><code>❌ Sin caso base       → nunca para → desbordamiento de pila
❌ Caso base inalcanzable → lo mismo
❌ El problema no se achica → lo mismo

El mensaje "Maximum call stack size exceeded" significa
casi siempre una de esas tres cosas.</code></pre>

<h4>Dónde aparece de verdad</h4>
<table>
<tr><th>Caso</th><th>Por qué recursión</th></tr>
<tr><td><b>Árbol de categorías</b></td><td>Cada categoría puede tener subcategorías, sin límite conocido</td></tr>
<tr><td><b>Carpetas y archivos</b></td><td>Igual</td></tr>
<tr><td><b>Comentarios con respuestas</b></td><td>Igual</td></tr>
<tr><td><b>Recorrer un JSON de forma desconocida</b></td><td>La profundidad no se sabe de antemano</td></tr>
<tr><td><b>Menús de navegación anidados</b></td><td>Igual</td></tr>
</table>

<div class="dato"><strong>El denominador común: <b>no sabés cuán profundo es</b>.</strong> Si supieras que hay
exactamente tres niveles, tres bucles anidados alcanzarían. La recursión resuelve el caso donde ' +
<b>la profundidad es un dato, no una constante</b> — y eso es exactamente lo que pasa con cualquier
estructura que el usuario puede anidar.</div>

<h4>Cuándo NO usarla</h4>
<pre><code>· Cuando un bucle simple hace lo mismo
    → sumar una lista no necesita recursión
· Cuando la profundidad puede ser enorme
    → riesgo de desbordar la pila
· Cuando repite el mismo trabajo muchas veces
    → Fibonacci ingenuo: exponencial</code></pre>
`,

      tecnico: `
<h4>Recorrer un árbol: el caso canónico</h4>
<pre><code>// Aplanar una estructura anidada de categorías
function aplanar(categorias, nivel = 0) {
  const resultado = [];

  for (const c of categorias) {
    resultado.push({ id: c.id, nombre: c.nombre, nivel });

    if (c.hijos?.length) {
      resultado.push(...aplanar(c.hijos, nivel + 1));   // ← paso recursivo
    }
  }

  return resultado;   // ← caso base implícito: sin hijos, no recursa
}</code></pre>

<div class="dato"><strong>Acá el caso base no es un <code>if</code> explícito: es que el bucle
<b>no encuentra hijos</b> y la función devuelve.</strong> Es la forma más común en la práctica y confunde a
quien busca el <code>if</code> de la teoría. <b>El caso base siempre está — a veces está implícito en la
condición del bucle.</b></div>

<h4>El desbordamiento de pila</h4>
<pre><code>Cada llamada recursiva ocupa un espacio en la pila de llamadas.
El límite ronda las 10.000 llamadas anidadas.

Recorrer un árbol de categorías con 5 niveles → sin problema
Recorrer una lista de 100.000 elementos recursivamente → desborda</code></pre>

<div class="dato"><strong>La regla práctica: <b>recursión para estructuras anidadas, iteración para
listas largas</b>.</strong> La profundidad de un árbol real casi nunca pasa de veinte niveles; ' +
la longitud de una lista puede ser cualquier cosa. Si tu recursión avanza <b>a lo largo</b> de una colección
en vez de <b>hacia adentro</b> de una estructura, probablemente debería ser un bucle.</div>

<h4>Memoización: cuando se repite trabajo</h4>
<pre><code>// ❌ Fibonacci ingenuo: recalcula lo mismo miles de veces → O(2ⁿ)
function fib(n) {
  if (n &lt;= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
// fib(40) hace más de mil millones de llamadas

// ✔ Con memoria de lo ya calculado → O(n)
function fib(n, memo = new Map()) {
  if (n &lt;= 1) return n;
  if (memo.has(n)) return memo.get(n);

  const r = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, r);
  return r;
}</code></pre>

<div class="dato"><strong>La memoización no cambia el algoritmo: cambia cuántas veces se ejecuta.</strong> ' +
Y es aplicable siempre que la función sea <b>pura</b> —mismo argumento, mismo resultado—. ' +
Si depende del reloj, de una petición o de estado externo, memoizarla produce resultados viejos: ' +
es el mismo problema de invalidación de caché que ya viste en otros tracks.</div>

<h4>Convertir recursión en iteración</h4>
<pre><code>// La misma idea, con una pila explícita en vez de la del lenguaje
function aplanarIterativo(raiz) {
  const resultado = [];
  const pila = [{ nodo: raiz, nivel: 0 }];

  while (pila.length) {
    const { nodo, nivel } = pila.pop();
    resultado.push({ id: nodo.id, nivel });

    // al revés, para conservar el orden original
    for (let i = (nodo.hijos?.length ?? 0) - 1; i &gt;= 0; i--) {
      pila.push({ nodo: nodo.hijos[i], nivel: nivel + 1 });
    }
  }
  return resultado;
}</code></pre>

<div class="dato"><strong>Toda recursión se puede convertir en iteración con una pila explícita</strong>, y el
motivo para hacerlo es uno solo: <b>no depender del límite de la pila del lenguaje</b>. ' +
El costo es que se lee bastante peor — así que se hace cuando hay riesgo real de desbordar, no por deporte.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="rc1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    DOS PREGUNTAS, Y NADA MÁS</text>

  <rect x="24" y="34" width="304" height="66" rx="10" fill="#34d399" fill-opacity=".18" stroke="#34d399" stroke-width="1.6"/>
  <text x="176" y="54" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">1 · ¿CUÁNDO PARO?</text>
  <text x="176" y="74" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">el caso base</text>
  <text x="176" y="92" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">escribilo PRIMERO</text>

  <rect x="352" y="34" width="304" height="66" rx="10" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="504" y="54" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">2 · ¿CÓMO LO ACHICO?</text>
  <text x="504" y="74" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">el paso recursivo</text>
  <text x="504" y="92" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">después es casi mecánico</text>

  <rect x="24" y="112" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="133" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    “Maximum call stack size exceeded” = falta el caso base, es inalcanzable, o el problema no se achica.</text>

  <line x1="24" y1="164" x2="656" y2="164" stroke="currentColor" opacity=".18"/>

  <text x="24" y="188" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA REGLA PRÁCTICA</text>

  <rect x="24" y="200" width="304" height="80" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.5"/>
  <text x="176" y="220" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">RECURSIÓN — hacia ADENTRO</text>
  <text x="44" y="240" fill="currentColor" opacity=".72" font-size="10.5">estructuras anidadas de profundidad</text>
  <text x="44" y="256" fill="currentColor" opacity=".72" font-size="10.5">desconocida</text>
  <text x="44" y="274" fill="#34d399" font-size="10" font-weight="700">categorías · carpetas · comentarios · JSON</text>

  <rect x="352" y="200" width="304" height="80" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="504" y="220" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">ITERACIÓN — a lo LARGO</text>
  <text x="372" y="240" fill="currentColor" opacity=".72" font-size="10.5">recorrer una colección larga</text>
  <text x="372" y="258" fill="#22d3ee" font-size="10.5" font-weight="700">el límite de la pila ronda las 10.000</text>
  <text x="372" y="274" fill="currentColor" opacity=".6" font-size="10">llamadas anidadas</text>

  <rect x="24" y="290" width="632" height="30" rx="8" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="310" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">
    Si tu recursión avanza a lo LARGO de una colección en vez de hacia ADENTRO de una estructura, debería ser un bucle.</text>

  <rect x="24" y="330" width="304" height="56" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="176" y="350" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">FIBONACCI INGENUO</text>
  <text x="44" y="368" fill="currentColor" opacity=".7" font-size="10">recalcula lo mismo miles de veces → O(2ⁿ)</text>
  <text x="44" y="382" fill="#f87171" font-size="10" font-weight="700">fib(40): más de mil millones de llamadas</text>

  <rect x="352" y="330" width="304" height="56" rx="10" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="504" y="350" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">MEMOIZACIÓN</text>
  <text x="372" y="368" fill="currentColor" opacity=".7" font-size="10">no cambia el algoritmo: cambia cuántas veces corre</text>
  <text x="372" y="382" fill="#7c5cff" font-size="10" font-weight="700">solo si la función es PURA</text>
</svg>`,
        pie: 'El caso base no siempre es un if: muchas veces está implícito en que el bucle no encuentra hijos.',
      },

      entrevista: [
        { p: '¿Cómo se escribe una función recursiva?',
          r: 'Respondiendo dos preguntas: <b>¿cuándo paro?</b> —el caso base— y <b>¿cómo hago el problema más chico?</b> — el paso recursivo. ' +
             'Y hay un orden que cambia la dificultad: <b>escribir el caso base primero</b>. Si te trabás con recursión, ' +
             'casi siempre es porque empezaste por el paso recursivo. Con el caso base claro, el resto es casi mecánico.' },

        { p: '¿Qué significa "Maximum call stack size exceeded"?',
          r: 'Casi siempre una de tres cosas: <b>falta el caso base</b>, el caso base es <b>inalcanzable</b>, o <b>el problema no se está ' +
             'achicando</b> en cada llamada. Cada llamada recursiva ocupa espacio en la pila y el límite ronda las diez mil llamadas anidadas, ' +
             'así que también aparece cuando se usa recursión para recorrer una colección muy larga.' },

        { p: '¿Cuándo usarías recursión y cuándo iteración?',
          r: '<b>Recursión para estructuras anidadas</b> de profundidad desconocida —categorías, carpetas, comentarios, un JSON de forma ' +
             'desconocida— e <b>iteración para colecciones largas</b>. La señal es la dirección: si tu recursión avanza <b>a lo largo</b> de una lista ' +
             'en vez de <b>hacia adentro</b> de una estructura, probablemente debería ser un bucle. ' +
             'Un árbol real casi nunca pasa de veinte niveles; una lista puede tener cualquier longitud.' },

        { p: '¿Qué es la memoización y cuál es su condición?',
          r: 'Guardar los resultados ya calculados para no repetir trabajo. <b>No cambia el algoritmo: cambia cuántas veces se ejecuta</b> — ' +
             'Fibonacci ingenuo pasa de exponencial a lineal. La condición es que la función sea <b>pura</b>: mismo argumento, mismo resultado. ' +
             'Si depende del reloj, de una petición o de estado externo, memoizarla devuelve resultados viejos — ' +
             'es el mismo problema de invalidación de caché de siempre.' },
      ],

      practica: `
<h4>Ejercicio 1 — Recorrer categorías anidadas</h4>
<pre><code>Dada una estructura como:
[
  { id: 1, nombre: 'Ropa', hijos: [
      { id: 2, nombre: 'Remeras', hijos: [] },
      { id: 3, nombre: 'Pantalones', hijos: [
          { id: 4, nombre: 'Jeans', hijos: [] }
      ]}
  ]},
  { id: 5, nombre: 'Calzado', hijos: [] }
]

Devolver una lista plana con { id, nombre, nivel }.</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>function aplanar(categorias, nivel = 0) {
  const resultado = [];
  for (const c of categorias) {
    resultado.push({ id: c.id, nombre: c.nombre, nivel });
    if (c.hijos?.length) {
      resultado.push(...aplanar(c.hijos, nivel + 1));
    }
  }
  return resultado;
}

Caso base: implícito — sin hijos, no recursa y devuelve.
Casos borde: lista vacía → [] ✔ · hijos undefined → el ?. lo cubre ✔</code></pre>
</details>

<h4>Ejercicio 2 — Buscar en profundidad</h4>
<pre><code>Escribí buscarCategoria(categorias, id) que devuelva la categoría
con ese id, esté al nivel que esté, o null si no existe.</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>function buscarCategoria(categorias, id) {
  for (const c of categorias) {
    if (c.id === id) return c;                    // caso base: la encontré

    const enHijos = buscarCategoria(c.hijos ?? [], id);
    if (enHijos) return enHijos;                  // ← IMPORTANTE
  }
  return null;                                    // caso base: no está
}

El "if (enHijos) return" es lo que se olvida siempre.
Sin él, la función sigue buscando en los hermanos y devuelve null
aunque ya la haya encontrado en la rama anterior.</code></pre>
</details>

<h4>Ejercicio 3 — Sumar valores anidados</h4>
<pre><code>Dada una estructura de profundidad desconocida donde los números
pueden estar en cualquier nivel:
  [1, [2, 3], [4, [5, [6]]], 7]
devolver la suma total (28).</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>function sumarProfundo(valor) {
  if (typeof valor === 'number') return valor;      // caso base
  if (!Array.isArray(valor)) return 0;              // caso base defensivo

  return valor.reduce((t, v) =&gt; t + sumarProfundo(v), 0);
}

sumarProfundo([1, [2, 3], [4, [5, [6]]], 7]);   // 28

Dos casos base: uno para el valor simple, otro para lo que no
es ni número ni array. El segundo evita que un null rompa todo.</code></pre>
</details>

<h4>Ejercicio 4 — Detectar el desborde</h4>
<pre><code>function contarHasta(n) {
  if (n === 0) return 0;
  return 1 + contarHasta(n - 1);
}

contarHasta(10);       // ✔
contarHasta(100000);   // ✘ ¿por qué? ¿cómo se arregla?</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>Desborda la pila: cien mil llamadas anidadas superan el límite.
Y el problema conceptual es que la recursión avanza A LO LARGO
de un rango, no hacia adentro de una estructura.

Arreglado, con iteración:
function contarHasta(n) {
  let t = 0;
  for (let i = n; i &gt; 0; i--) t += 1;
  return t;
}

Es el ejemplo perfecto de "esto no debería ser recursivo".</code></pre>
</details>
`,

      errores: [
        { mito: 'La recursión siempre necesita un if explícito como caso base.',
          realidad: 'Muchas veces está <b>implícito</b>: el bucle no encuentra hijos y la función devuelve. Es la forma más común en la práctica ' +
                    'y confunde a quien busca el <code>if</code> de la teoría.' },

        { mito: 'Si desborda la pila, hay que aumentar el límite.',
          realidad: 'Casi siempre significa que <b>falta el caso base</b>, que es inalcanzable, o que la recursión avanza a lo largo de una colección ' +
                    'en vez de hacia adentro de una estructura — y ahí corresponde un bucle.' },

        { mito: 'Buscar en un árbol es simplemente recursar en los hijos.',
          realidad: 'Falta el <b><code>if (encontrado) return</code></b> después de la llamada recursiva. Sin él, la función sigue buscando en los ' +
                    'hermanos y devuelve null aunque ya lo haya encontrado.' },

        { mito: 'La memoización siempre acelera.',
          realidad: 'Solo si la función es <b>pura</b>. Si depende del reloj, de una petición o de estado externo, devuelve resultados viejos — ' +
                    'el mismo problema de invalidación de caché de siempre.' },
      ],

      glosario: [
        { t: 'Caso base', d: 'La condición que detiene la recursión. Se escribe primero.' },
        { t: 'Paso recursivo', d: 'La llamada que reduce el problema a uno más chico.' },
        { t: 'Pila de llamadas', d: 'Espacio donde el lenguaje guarda las llamadas anidadas.' },
        { t: 'Desbordamiento de pila', d: 'Superar el límite de llamadas anidadas.' },
        { t: 'Memoización', d: 'Guardar resultados ya calculados para no repetirlos.' },
        { t: 'Función pura', d: 'Mismo argumento, mismo resultado, sin efectos externos.' },
        { t: 'Pila explícita', d: 'Convertir recursión en iteración manejando la pila a mano.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Qué dos preguntas definen una función recursiva?',
      opciones: [
        '¿Cuándo paro? y ¿cómo hago el problema más chico?',
        '¿Qué devuelve? y ¿qué recibe?',
        '¿Es lineal o cuadrática? y ¿cuánta memoria usa?',
        '¿Es pura? y ¿tiene efectos?',
      ],
      correcta: 0,
      porQue: 'Y hay un orden que cambia la dificultad: escribir el caso base primero. Si te trabás con recursión, casi siempre es porque empezaste por el paso recursivo.',
      porQueNo: {
        1: 'Es parte de entender el problema, no de la estructura recursiva.',
        2: 'Es análisis posterior, no lo que la define.',
        3: 'Importa para memoizar, no para escribirla.',
      },
    },
    {
      p: '¿Qué significa casi siempre un desbordamiento de pila?',
      opciones: [
        'Falta el caso base, es inalcanzable, o el problema no se achica',
        'La computadora tiene poca memoria',
        'El algoritmo es cuadrático',
        'Hay un bucle infinito en un for',
      ],
      correcta: 0,
      porQue: 'También aparece cuando se usa recursión para recorrer una colección muy larga: el límite ronda las diez mil llamadas anidadas.',
      porQueNo: {
        1: 'El límite es de la pila, no de la memoria total.',
        2: 'La complejidad no causa desbordamiento por sí sola.',
        3: 'Un bucle infinito consume tiempo, no pila.',
      },
    },
    {
      p: '¿Cuándo conviene recursión sobre iteración?',
      opciones: [
        'Para estructuras anidadas de profundidad desconocida: categorías, carpetas, comentarios',
        'Para recorrer listas largas',
        'Siempre que se pueda: es más elegante',
        'Cuando hay que sumar números',
      ],
      correcta: 0,
      porQue: 'Si supieras que hay exactamente tres niveles, tres bucles anidados alcanzarían. La recursión resuelve el caso donde la profundidad es un dato, no una constante.',
      porQueNo: {
        1: 'Ahí desborda la pila: corresponde iteración.',
        2: 'La elegancia no compensa el riesgo de desbordar.',
        3: 'Un bucle simple hace lo mismo sin riesgo.',
      },
    },
    {
      p: '¿Cuál es la señal de que una recursión debería ser un bucle?',
      opciones: [
        'Que avanza a lo largo de una colección en vez de hacia adentro de una estructura',
        'Que tiene más de diez líneas',
        'Que usa un acumulador',
        'Que tiene dos casos base',
      ],
      correcta: 0,
      porQue: 'Un árbol real casi nunca pasa de veinte niveles; una lista puede tener cualquier longitud. La dirección del avance es lo que distingue.',
      porQueNo: {
        1: 'El tamaño no indica si corresponde recursión.',
        2: 'Es habitual y correcto en recursión.',
        3: 'Tener varios casos base es normal.',
      },
    },
    {
      p: 'En una función que aplana categorías, ¿dónde está el caso base?',
      opciones: [
        'Implícito: el bucle no encuentra hijos y la función devuelve',
        'No hay caso base en ese tipo de función',
        'En un if al principio que verifica null',
        'En el return final del array',
      ],
      correcta: 0,
      porQue: 'Es la forma más común en la práctica y confunde a quien busca el if de la teoría. El caso base siempre está: a veces está en la condición del bucle.',
      porQueNo: {
        1: 'Sin caso base la función no terminaría nunca.',
        2: 'Es una verificación defensiva, no el caso base.',
        3: 'El return es la consecuencia, no la condición de parada.',
      },
    },
    {
      p: 'Al buscar en un árbol recursivamente, ¿qué se olvida siempre?',
      opciones: [
        'El if que devuelve el resultado de la llamada recursiva si encontró algo',
        'Inicializar el acumulador',
        'Pasar el nivel de profundidad',
        'Validar que el id sea un número',
      ],
      correcta: 0,
      porQue: 'Sin ese if, la función sigue buscando en los hermanos y devuelve null aunque ya lo haya encontrado en la rama anterior.',
      porQueNo: {
        1: 'En una búsqueda no hace falta acumulador.',
        2: 'El nivel es opcional según lo que se necesite.',
        3: 'Es validación de entrada, no el error estructural.',
      },
    },
    {
      p: '¿Qué hace la memoización?',
      opciones: [
        'Guarda resultados ya calculados: no cambia el algoritmo, cambia cuántas veces se ejecuta',
        'Convierte la recursión en iteración',
        'Aumenta el límite de la pila',
        'Paraleliza las llamadas',
      ],
      correcta: 0,
      porQue: 'Fibonacci ingenuo pasa de exponencial a lineal sin cambiar la lógica: solo se deja de recalcular lo mismo.',
      porQueNo: {
        1: 'La estructura sigue siendo recursiva.',
        2: 'No afecta al límite de la pila.',
        3: 'Sigue siendo secuencial.',
      },
    },
    {
      p: '¿Cuál es la condición para poder memoizar una función?',
      opciones: [
        'Que sea pura: mismo argumento, mismo resultado, sin efectos externos',
        'Que sea recursiva',
        'Que reciba solo números',
        'Que no tenga más de dos parámetros',
      ],
      correcta: 0,
      porQue: 'Si depende del reloj, de una petición o de estado externo, memoizarla devuelve resultados viejos: es el mismo problema de invalidación de caché.',
      porQueNo: {
        1: 'Se puede memoizar cualquier función pura, recursiva o no.',
        2: 'Los argumentos pueden ser de cualquier tipo si se pueden usar como clave.',
        3: 'La cantidad de parámetros no es el criterio.',
      },
    },
    {
      p: '¿Por qué Fibonacci ingenuo es exponencial?',
      opciones: [
        'Porque recalcula los mismos valores miles de veces al ramificarse en dos llamadas',
        'Porque los números crecen mucho',
        'Porque usa suma en vez de multiplicación',
        'Porque no tiene caso base',
      ],
      correcta: 0,
      porQue: 'fib(40) hace más de mil millones de llamadas, la enorme mayoría repetidas. Es el caso donde se enseña recursión y justamente donde no conviene usarla así.',
      porQueNo: {
        1: 'El tamaño de los números no afecta la cantidad de llamadas.',
        2: 'La operación es irrelevante.',
        3: 'Sí lo tiene: el problema es la ramificación repetida.',
      },
    },
    {
      p: '¿Por qué convertir una recursión en iteración con pila explícita?',
      opciones: [
        'Para no depender del límite de la pila del lenguaje',
        'Porque es más legible',
        'Porque es siempre más rápido',
        'Porque permite memoizar',
      ],
      correcta: 0,
      porQue: 'El costo es que se lee bastante peor, así que se hace cuando hay riesgo real de desbordar, no por deporte.',
      porQueNo: {
        1: 'Se lee peor: ese es su costo.',
        2: 'La diferencia de velocidad es marginal.',
        3: 'La memoización funciona igual en las dos formas.',
      },
    },
    {
      p: '¿Cuál es el denominador común de los casos donde la recursión es la herramienta correcta?',
      opciones: [
        'Que no sabés cuán profunda es la estructura',
        'Que hay muchos elementos',
        'Que los datos vienen de una API',
        'Que hay que ordenar',
      ],
      correcta: 0,
      porQue: 'Si supieras que hay tres niveles, tres bucles anidados alcanzarían. La profundidad como dato y no como constante es lo que la justifica.',
      porQueNo: {
        1: 'La cantidad se maneja con iteración.',
        2: 'El origen de los datos es indistinto.',
        3: 'Ordenar tiene sus propios algoritmos.',
      },
    },
    {
      p: 'Al sumar valores en una estructura anidada, ¿por qué conviene un segundo caso base defensivo?',
      opciones: [
        'Para que un valor que no sea número ni array no rompa toda la función',
        'Para mejorar el rendimiento',
        'Para poder memoizar',
        'Para evitar el desbordamiento',
      ],
      correcta: 0,
      porQue: 'Un null o un objeto inesperado en la estructura haría fallar la llamada recursiva. Devolver 0 en ese caso mantiene la función robusta.',
      porQueNo: {
        1: 'No cambia la complejidad.',
        2: 'No tiene relación con la memoización.',
        3: 'El desbordamiento depende de la profundidad, no del tipo.',
      },
    },
    {
      p: 'contarHasta(100000) con recursión falla. ¿Cuál es el arreglo correcto?',
      opciones: [
        'Convertirlo en un bucle: la recursión avanzaba a lo largo de un rango, no hacia adentro',
        'Agregar memoización',
        'Aumentar el límite de la pila',
        'Usar recursión de cola',
      ],
      correcta: 0,
      porQue: 'Es el ejemplo perfecto de "esto no debería ser recursivo": no hay ninguna estructura anidada, solo un recorrido.',
      porQueNo: {
        1: 'No hay trabajo repetido que memoizar.',
        2: 'No es configurable de forma práctica en el entorno.',
        3: 'No está garantizada la optimización de llamada de cola en JavaScript.',
      },
    },
    {
      p: '¿Cuál es el orden correcto al escribir una función recursiva?',
      opciones: [
        'Primero el caso base, después el paso recursivo',
        'Primero el paso recursivo, que es lo interesante',
        'Primero los tipos, después la lógica',
        'Primero los tests',
      ],
      correcta: 0,
      porQue: 'Con el caso base claro, el resto es casi mecánico. Si te trabás escribiendo recursión, casi siempre es porque empezaste al revés.',
      porQueNo: {
        1: 'Es justamente lo que produce el bloqueo.',
        2: 'Ayuda, pero no resuelve la dificultad conceptual.',
        3: 'Es buena práctica y no cambia el orden de razonamiento.',
      },
    },
    {
      p: '¿Aproximadamente cuál es el límite de llamadas recursivas anidadas?',
      opciones: [
        'Del orden de diez mil',
        'Un millón',
        'Cien',
        'No hay límite',
      ],
      correcta: 0,
      porQue: 'Por eso recorrer un árbol de cinco niveles no es problema y recorrer una lista de cien mil elementos recursivamente sí lo es.',
      porQueNo: {
        1: 'Está muy por encima del límite real.',
        2: 'Está muy por debajo: los árboles reales funcionan sin problema.',
        3: 'La pila tiene un tamaño finito.',
      },
    },
  ],
});
