/* ==========================================================================
   Lógica · Módulo 05 — Algoritmos que hay que conocer
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'logica',
  id: 'm05',
  titulo: 'Algoritmos que hay que conocer',
  fuentes: ['neetcode-patrones', 'visualgo', 'big-o'],

  intro:
    '<p>No hace falta saber implementar veinte algoritmos de memoria. Hace falta <b>reconocer cinco o seis ' +
    'patrones</b> y saber cuándo cada uno aplica — porque la mayoría de los problemas de entrevista, y muchos ' +
    'del trabajo real, son variaciones de esos patrones.</p>' +
    '<p>Este módulo cubre los que más aparecen, con la señal que permite reconocerlos.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Los patrones que resuelven la mayoría',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> los problemas no son infinitos: <b>se repiten con
otra ropa</b>. Reconocer el patrón es el 80% de resolverlo.</div>

<h4>Los seis patrones</h4>
<table>
<tr><th>Patrón</th><th>La señal que lo delata</th></tr>
<tr><td><b>Búsqueda binaria</b></td><td>La entrada está <b>ordenada</b></td></tr>
<tr><td><b>Dos punteros</b></td><td>Buscar un par, o comparar desde los extremos</td></tr>
<tr><td><b>Ventana deslizante</b></td><td>"Subarreglo o subcadena <b>contiguo</b>"</td></tr>
<tr><td><b>Mapa de frecuencias</b></td><td>Contar, agrupar, "¿ya lo vi?"</td></tr>
<tr><td><b>Recorrido de árbol/grafo</b></td><td>Estructura anidada o relaciones</td></tr>
<tr><td><b>Ordenar primero</b></td><td>El problema se vuelve trivial si está ordenado</td></tr>
</table>

<div class="aviso"><strong>La palabra que más señal da es "contiguo".</strong> Si el enunciado dice
"subarreglo contiguo" o "subcadena", casi siempre es <b>ventana deslizante</b>. Si dice "subconjunto" ' +
—sin exigir que sean vecinos— es otro problema completamente distinto y mucho más caro.</div>

<h4>Búsqueda binaria, en criollo</h4>
<p>Para buscar en algo ordenado: mirás el medio, y descartás <b>la mitad</b> que no puede contener lo que
buscás. Con un millón de elementos, veinte comparaciones.</p>
<pre><code>[1, 3, 5, 7, 9, 11, 13]   buscar 11

medio = 7  → 11 es mayor → descarto la izquierda
[9, 11, 13]
medio = 11 → encontrado</code></pre>

<h4>Dos punteros</h4>
<p>Dos índices que recorren la estructura, típicamente desde los extremos hacia adentro:</p>
<pre><code>¿Es palíndromo "reconocer"?
  ↑                    ↑
  r                    r   iguales → avanzo los dos
   ↑                  ↑
   e                  e    iguales → sigo
   … hasta que se cruzan</code></pre>

<h4>Ventana deslizante</h4>
<p>Una ventana que crece y se achica sobre una secuencia, sin volver atrás:</p>
<pre><code>Subcadena más larga sin caracteres repetidos: "abcabcbb"

[a]bcabcbb        ventana: "a"
[ab]cabcbb        ventana: "ab"
[abc]abcbb        ventana: "abc"   ← máximo hasta ahora: 3
a[bca]bcbb        apareció 'a' repetida → achico desde la izquierda
…</code></pre>
`,

      tecnico: `
<h4>Búsqueda binaria, con los dos detalles que fallan</h4>
<pre><code>function buscar(ordenados, x) {
  let i = 0, f = ordenados.length - 1;

  while (i &lt;= f) {                                  // ← &lt;= , no &lt;
    const m = i + Math.floor((f - i) / 2);          // ← evita desbordar
    if (ordenados[m] === x) return m;
    if (ordenados[m] &lt; x) i = m + 1; else f = m - 1;
  }
  return -1;
}</code></pre>

<div class="dato"><strong>Los dos comentarios marcan los errores clásicos.</strong> Con <code>&lt;</code> en
vez de <code>&lt;=</code>, <b>no se revisa el último elemento</b> cuando el rango se reduce a uno. ' +
Y calcular el medio como <code>(i + f) / 2</code> puede desbordar con índices muy grandes en lenguajes con
enteros acotados — en JavaScript es menos crítico, pero la forma <code>i + (f - i) / 2</code> es la correcta ' +
y no cuesta nada.</div>

<h4>Dos punteros: las tres variantes</h4>
<pre><code>// 1 · Desde los extremos: palíndromo, par que suma X en lista ordenada
let i = 0, f = n - 1;
while (i &lt; f) { … i++ o f-- según convenga }

// 2 · Rápido y lento: detectar ciclo, encontrar el medio
let lento = inicio, rapido = inicio;
while (rapido?.siguiente) { lento = lento.siguiente; rapido = rapido.siguiente.siguiente; }

// 3 · Lectura y escritura: quitar elementos in situ
let escribir = 0;
for (let leer = 0; leer &lt; n; leer++) {
  if (sirve(a[leer])) a[escribir++] = a[leer];
}</code></pre>

<div class="dato"><strong>La tercera variante es la que más aparece en el trabajo real</strong> y casi nunca se
enseña: filtrar un array <b>sin crear uno nuevo</b>, con un índice de lectura y otro de escritura. ' +
Es lo que hace <code>filter</code> por dentro, y sirve cuando la memoria importa o cuando hay que modificar la
estructura recibida.</div>

<h4>Ventana deslizante</h4>
<pre><code>function subcadenaMasLargaSinRepetir(s) {
  const ultimaPos = new Map();
  let inicio = 0, mejor = 0;

  for (let fin = 0; fin &lt; s.length; fin++) {
    const c = s[fin];
    if (ultimaPos.has(c) &amp;&amp; ultimaPos.get(c) &gt;= inicio) {
      inicio = ultimaPos.get(c) + 1;      // achico la ventana
    }
    ultimaPos.set(c, fin);
    mejor = Math.max(mejor, fin - inicio + 1);
  }
  return mejor;
}</code></pre>

<div class="dato"><strong>La condición <code>&gt;= inicio</code> es lo que hace correcta la
implementación.</strong> Sin ella, un carácter repetido que quedó <b>fuera</b> de la ventana actual haría
retroceder el inicio — y el resultado sería menor al correcto. Es el detalle que más veces se olvida ' +
en este patrón.</div>

<h4>Recorridos: en profundidad y en anchura</h4>
<table>
<tr><th></th><th>Profundidad</th><th>Anchura</th></tr>
<tr><td>Estructura auxiliar</td><td>Pila (o recursión)</td><td><b>Cola</b></td></tr>
<tr><td>Va</td><td>Hasta el fondo primero</td><td>Nivel por nivel</td></tr>
<tr><td>Bueno para</td><td>Explorar todo, detectar ciclos</td><td><b>Camino más corto</b></td></tr>
</table>

<div class="dato"><strong>La última fila decide cuál usar y se confunde seguido:</strong> si el problema pide
<b>el camino más corto</b> en un grafo sin pesos, es <b>anchura</b>, sin excepción. ' +
Profundidad encuentra <i>un</i> camino, no el más corto — y como suele encontrar alguno rápido, ' +
el error pasa desapercibido hasta que alguien compara resultados.</div>

<h4>Ordenar primero: el patrón subestimado</h4>
<pre><code>Muchos problemas se vuelven triviales con la entrada ordenada:

· encontrar duplicados          → quedan adyacentes
· agrupar por rango             → recorrido lineal
· intervalos que se solapan     → ordenar por inicio y comparar vecinos
· k elementos más grandes       → ordenar y tomar los últimos k

Costo: O(n log n). Casi siempre vale la pena.</code></pre>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA SEÑAL QUE DELATA CADA PATRÓN</text>

  <rect x="24" y="34" width="632" height="22" rx="5" fill="#22d3ee" fill-opacity=".16"/>
  <text x="40" y="49" fill="#22d3ee" font-size="10" font-weight="700">búsqueda binaria</text>
  <text x="280" y="49" fill="currentColor" opacity=".72" font-size="10">la entrada está ORDENADA</text>

  <rect x="24" y="60" width="632" height="22" rx="5" fill="#34d399" fill-opacity=".16"/>
  <text x="40" y="75" fill="#34d399" font-size="10" font-weight="700">dos punteros</text>
  <text x="280" y="75" fill="currentColor" opacity=".72" font-size="10">buscar un par, o comparar desde los extremos</text>

  <rect x="24" y="86" width="632" height="22" rx="5" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="40" y="101" fill="#fbbf24" font-size="10" font-weight="700">ventana deslizante</text>
  <text x="280" y="101" fill="#fbbf24" font-size="10" font-weight="700">la palabra “CONTIGUO”</text>

  <rect x="24" y="112" width="632" height="22" rx="5" fill="#7c5cff" fill-opacity=".16"/>
  <text x="40" y="127" fill="#7c5cff" font-size="10" font-weight="700">mapa de frecuencias</text>
  <text x="280" y="127" fill="currentColor" opacity=".72" font-size="10">contar, agrupar, “¿ya lo vi?”</text>

  <rect x="24" y="138" width="632" height="22" rx="5" fill="#f472b6" fill-opacity=".16"/>
  <text x="40" y="153" fill="#f472b6" font-size="10" font-weight="700">recorrido de árbol/grafo</text>
  <text x="280" y="153" fill="currentColor" opacity=".72" font-size="10">estructura anidada o relaciones</text>

  <rect x="24" y="164" width="632" height="22" rx="5" fill="#22d3ee" fill-opacity=".12"/>
  <text x="40" y="179" fill="#22d3ee" font-size="10" font-weight="700">ordenar primero</text>
  <text x="280" y="179" fill="currentColor" opacity=".72" font-size="10">el problema se vuelve trivial si está ordenado</text>

  <rect x="24" y="194" width="632" height="34" rx="8" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="215" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">
    “Subarreglo CONTIGUO” → ventana deslizante. “Subconjunto” (sin exigir vecinos) → otro problema, mucho más caro.</text>

  <line x1="24" y1="248" x2="656" y2="248" stroke="currentColor" opacity=".18"/>

  <text x="24" y="272" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    PROFUNDIDAD vs ANCHURA — la fila que decide</text>

  <rect x="24" y="284" width="304" height="72" rx="10" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="176" y="304" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">PROFUNDIDAD · pila</text>
  <text x="44" y="322" fill="currentColor" opacity=".7" font-size="10">hasta el fondo primero</text>
  <text x="44" y="340" fill="currentColor" opacity=".7" font-size="10">explorar todo · detectar ciclos</text>

  <rect x="352" y="284" width="304" height="72" rx="10" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.6"/>
  <text x="504" y="304" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">ANCHURA · cola</text>
  <text x="372" y="322" fill="currentColor" opacity=".7" font-size="10">nivel por nivel</text>
  <text x="372" y="340" fill="#34d399" font-size="10.5" font-weight="700">CAMINO MÁS CORTO, sin excepción</text>

  <rect x="24" y="364" width="632" height="22" rx="6" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.3"/>
  <text x="340" y="379" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">
    Profundidad encuentra UN camino, no el más corto — y como encuentra alguno rápido, el error pasa desapercibido.</text>
</svg>`,
        pie: 'Los problemas no son infinitos: se repiten con otra ropa. Reconocer el patrón es el 80%.',
      },

      entrevista: [
        { p: '¿Cuáles son los patrones que más aparecen y cómo se reconocen?',
          r: 'Seis, cada uno con su señal. <b>Búsqueda binaria</b> cuando la entrada está ordenada. <b>Dos punteros</b> cuando hay que buscar un par ' +
             'o comparar desde los extremos. <b>Ventana deslizante</b> cuando aparece la palabra <b>"contiguo"</b>. ' +
             '<b>Mapa de frecuencias</b> para contar, agrupar o preguntar "¿ya lo vi?". <b>Recorrido</b> para estructuras anidadas o relaciones. ' +
             'Y <b>ordenar primero</b> cuando el problema se vuelve trivial con la entrada ordenada.' },

        { p: '¿Qué palabra del enunciado da más señal?',
          r: '<b>"Contiguo".</b> Si dice "subarreglo contiguo" o "subcadena", casi siempre es <b>ventana deslizante</b>: ' +
             'una ventana que crece y se achica sin volver atrás, en una sola pasada. ' +
             'Si en cambio dice "subconjunto" —sin exigir que los elementos sean vecinos— es un problema completamente distinto ' +
             'y mucho más caro, porque hay que considerar combinaciones.' },

        { p: '¿Cuándo usás recorrido en anchura y cuándo en profundidad?',
          r: '<b>Anchura</b> si el problema pide el <b>camino más corto</b> en un grafo sin pesos: sin excepción. Va nivel por nivel con una cola, ' +
             'así que el primer camino que encuentra es el más corto. <b>Profundidad</b> para explorar todo o detectar ciclos, con pila o recursión. ' +
             'El error típico es usar profundidad para camino más corto: encuentra <i>un</i> camino, y como lo encuentra rápido, ' +
             '<b>el error pasa desapercibido</b> hasta que alguien compara resultados.' },

        { p: '¿Qué variante de dos punteros aparece más en el trabajo real?',
          r: 'La de <b>lectura y escritura</b>, que casi nunca se enseña: dos índices sobre el mismo array, uno que lee y otro que escribe, ' +
             'para filtrar <b>sin crear un array nuevo</b>. Es lo que hace <code>filter</code> por dentro, y sirve cuando la memoria importa ' +
             'o cuando hay que modificar la estructura recibida en vez de devolver una copia.' },
      ],

      practica: `
<h4>Ejercicio 1 — Reconocer el patrón</h4>
<pre><code>A · "Dada una lista ordenada, encontrar dos números que sumen X"
B · "Subcadena contigua más larga con como mucho 2 caracteres distintos"
C · "¿Existe un camino entre dos nodos de una red?"
D · "El elemento que más veces aparece"
E · "Cantidad mínima de saltos para llegar del nodo A al B"</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>A → dos punteros desde los extremos (la lista ya está ordenada)
B → ventana deslizante ("contigua")
C → recorrido en profundidad (solo pregunta si existe)
D → mapa de frecuencias
E → recorrido en ANCHURA ("mínima" = camino más corto)

El E es el que más se responde mal: profundidad también encuentra
un camino, pero no garantiza que sea el más corto.</code></pre>
</details>

<h4>Ejercicio 2 — Búsqueda binaria correcta</h4>
<pre><code>function buscar(ordenados, x) {
  let i = 0, f = ordenados.length - 1;
  while (i &lt; f) {
    const m = Math.floor((i + f) / 2);
    if (ordenados[m] === x) return m;
    if (ordenados[m] &lt; x) i = m + 1; else f = m - 1;
  }
  return -1;
}

¿Con qué entrada falla?</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>buscar([5], 5)  → -1, y debería devolver 0

Con un solo elemento, i = f = 0 y la condición i &lt; f es falsa:
nunca entra al bucle. Lo mismo pasa cada vez que el rango
se reduce a un elemento.

Arreglo: while (i &lt;= f)

Es el error clásico de búsqueda binaria, y el caso borde
"un solo elemento" es el que lo revela.</code></pre>
</details>

<h4>Ejercicio 3 — Ventana deslizante</h4>
<pre><code>Dada una lista de números y un tamaño k, devolver la suma máxima
de k elementos contiguos.

  [2, 1, 5, 1, 3, 2], k = 3  →  9  (5 + 1 + 3)</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>function sumaMaxima(nums, k) {
  if (nums.length &lt; k) return null;

  let suma = 0;
  for (let i = 0; i &lt; k; i++) suma += nums[i];    // primera ventana

  let mejor = suma;
  for (let i = k; i &lt; nums.length; i++) {
    suma += nums[i] - nums[i - k];                // entra uno, sale uno
    mejor = Math.max(mejor, suma);
  }
  return mejor;
}

La clave: NO recalcular la suma en cada ventana.
Sumar el que entra y restar el que sale convierte
un O(n·k) en un O(n).</code></pre>
</details>

<h4>Ejercicio 4 — Camino más corto</h4>
<pre><code>Dada una red de amistades { persona: [amigos] }, devolver
la cantidad mínima de intermediarios entre A y B.</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>function gradosDeSeparacion(red, a, b) {
  if (a === b) return 0;

  const visitados = new Set([a]);        // ← imprescindible: hay ciclos
  let nivel = [a], grados = 0;

  while (nivel.length) {
    grados++;
    const siguiente = [];

    for (const p of nivel) {
      for (const amigo of red[p] ?? []) {
        if (amigo === b) return grados;
        if (!visitados.has(amigo)) {
          visitados.add(amigo);
          siguiente.push(amigo);
        }
      }
    }
    nivel = siguiente;
  }
  return -1;   // no hay conexión
}

Anchura porque pide el mínimo. Y el Set de visitados es
obligatorio: una red de amistades tiene ciclos por todos lados.</code></pre>
</details>
`,

      errores: [
        { mito: 'Profundidad y anchura son intercambiables para buscar un camino.',
          realidad: 'Solo si alcanza con <b>cualquier</b> camino. Si el problema pide el <b>más corto</b>, es anchura sin excepción — ' +
                    'y como profundidad encuentra alguno rápido, el error pasa desapercibido.' },

        { mito: 'while (i < f) es correcto en búsqueda binaria.',
          realidad: 'Con <code>&lt;</code> <b>no se revisa el último elemento</b> cuando el rango se reduce a uno. ' +
                    'El caso borde de un solo elemento lo revela de inmediato.' },

        { mito: 'En ventana deslizante recalculo la suma de cada ventana.',
          realidad: 'Eso convierte un algoritmo lineal en O(n·k). Lo que hace eficiente al patrón es <b>sumar el que entra y restar el que sale</b>.' },

        { mito: 'El conjunto de visitados es una optimización.',
          realidad: 'En un grafo es <b>obligatorio</b>: sin él, cualquier ciclo produce un bucle infinito. Y no se manifiesta con datos de prueba ' +
                    'chicos que no tengan ciclos.' },
      ],

      glosario: [
        { t: 'Búsqueda binaria', d: 'Descartar la mitad en cada paso. Requiere entrada ordenada.' },
        { t: 'Dos punteros', d: 'Dos índices que recorren la estructura de forma coordinada.' },
        { t: 'Ventana deslizante', d: 'Rango contiguo que crece y se achica sin retroceder.' },
        { t: 'Mapa de frecuencias', d: 'Contar apariciones con un mapa. Patrón de una sola pasada.' },
        { t: 'Recorrido en profundidad', d: 'Ir hasta el fondo primero. Usa pila o recursión.' },
        { t: 'Recorrido en anchura', d: 'Nivel por nivel con una cola. Da el camino más corto.' },
        { t: 'Visitados', d: 'Conjunto obligatorio al recorrer grafos, para no entrar en ciclo.' },
        { t: 'Lectura y escritura', d: 'Dos índices sobre el mismo array para filtrar sin copiar.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Qué señal indica que corresponde búsqueda binaria?',
      opciones: [
        'Que la entrada está ordenada',
        'Que hay muchos elementos',
        'Que se buscan pares',
        'Que la estructura es anidada',
      ],
      correcta: 0,
      porQue: 'Con un millón de elementos hace unas veinte comparaciones, descartando la mitad en cada paso. Sin orden, no se puede descartar nada.',
      porQueNo: {
        1: 'La cantidad sola no habilita descartar mitades.',
        2: 'Eso sugiere dos punteros.',
        3: 'Eso sugiere recorrido.',
      },
    },
    {
      p: '¿Qué palabra del enunciado delata la ventana deslizante?',
      opciones: [
        '"Contiguo" o "subcadena"',
        '"Ordenado"',
        '"Máximo"',
        '"Único"',
      ],
      correcta: 0,
      porQue: 'Si en cambio dice "subconjunto" —sin exigir que sean vecinos— es un problema completamente distinto y mucho más caro, porque hay que considerar combinaciones.',
      porQueNo: {
        1: 'Sugiere búsqueda binaria o dos punteros.',
        2: 'Aparece en muchos patrones distintos.',
        3: 'Sugiere mapa de frecuencias o conjunto.',
      },
    },
    {
      p: 'El problema pide el camino más corto en un grafo sin pesos. ¿Qué usás?',
      opciones: [
        'Recorrido en anchura, con una cola',
        'Recorrido en profundidad, con recursión',
        'Búsqueda binaria',
        'Ordenar primero',
      ],
      correcta: 0,
      porQue: 'Va nivel por nivel, así que el primer camino que encuentra es el más corto. Profundidad encuentra un camino, no el más corto — y como lo encuentra rápido, el error pasa desapercibido.',
      porQueNo: {
        1: 'Encuentra un camino cualquiera, sin garantía de mínimo.',
        2: 'No aplica a grafos.',
        3: 'Ordenar no resuelve conectividad.',
      },
    },
    {
      p: '¿Cuál es el error clásico de la búsqueda binaria?',
      opciones: [
        'Usar while (i < f) en vez de while (i <= f): no se revisa el último elemento',
        'Calcular el medio con Math.floor',
        'Devolver -1 cuando no encuentra',
        'Empezar con i = 0',
      ],
      correcta: 0,
      porQue: 'Con un solo elemento, i = f y la condición es falsa: nunca entra al bucle. El caso borde "un solo elemento" lo revela de inmediato.',
      porQueNo: {
        1: 'Es necesario para obtener un índice entero.',
        2: 'Es una convención habitual y correcta.',
        3: 'Es el inicio correcto del rango.',
      },
    },
    {
      p: 'En ventana deslizante, ¿qué hace eficiente al patrón?',
      opciones: [
        'Sumar el elemento que entra y restar el que sale, sin recalcular la ventana',
        'Ordenar la entrada antes',
        'Usar recursión',
        'Recorrer desde los dos extremos',
      ],
      correcta: 0,
      porQue: 'Recalcular la suma de cada ventana convierte un algoritmo lineal en O(n·k). El truco de entrada-salida lo mantiene en una sola pasada.',
      porQueNo: {
        1: 'Ordenar rompería la contigüidad, que es justamente lo que importa.',
        2: 'La ventana se maneja iterativamente.',
        3: 'Eso es dos punteros, otro patrón.',
      },
    },
    {
      p: '¿Qué variante de dos punteros aparece más en el trabajo real?',
      opciones: [
        'Lectura y escritura: filtrar sin crear un array nuevo',
        'Desde los extremos',
        'Rápido y lento',
        'Tres punteros',
      ],
      correcta: 0,
      porQue: 'Es lo que hace filter por dentro, y sirve cuando la memoria importa o cuando hay que modificar la estructura recibida en vez de devolver una copia.',
      porQueNo: {
        1: 'Aparece más en entrevistas que en el trabajo diario.',
        2: 'Es específica de listas enlazadas y detección de ciclos.',
        3: 'No es una variante estándar.',
      },
    },
    {
      p: '¿Por qué el conjunto de visitados es obligatorio en un grafo?',
      opciones: [
        'Porque cualquier ciclo produce un bucle infinito sin él',
        'Porque acelera la búsqueda',
        'Porque ordena los resultados',
        'Porque evita duplicados en la salida',
      ],
      correcta: 0,
      porQue: 'Y no se manifiesta con datos de prueba chicos que no tengan ciclos: el error aparece recién con datos reales.',
      porQueNo: {
        1: 'También acelera, pero el motivo es la terminación.',
        2: 'No tiene relación con el orden.',
        3: 'Es un efecto secundario, no la razón.',
      },
    },
    {
      p: '¿Cuál es el patrón para "el elemento que más veces aparece"?',
      opciones: [
        'Mapa de frecuencias',
        'Ventana deslizante',
        'Búsqueda binaria',
        'Dos punteros',
      ],
      correcta: 0,
      porQue: 'Una sola pasada contando en un mapa, y después buscar el máximo. Contar y agrupar son las dos aplicaciones más frecuentes de ese patrón.',
      porQueNo: {
        1: 'No hay ningún rango contiguo involucrado.',
        2: 'La entrada no está ordenada ni hace falta.',
        3: 'No se buscan pares ni extremos.',
      },
    },
    {
      p: '¿Cuándo conviene "ordenar primero"?',
      opciones: [
        'Cuando el problema se vuelve trivial con la entrada ordenada: duplicados adyacentes, intervalos solapados',
        'Siempre, porque acelera todo',
        'Nunca: cuesta O(n log n)',
        'Solo con números',
      ],
      correcta: 0,
      porQue: 'El costo de O(n log n) casi siempre vale la pena si convierte un problema cuadrático en uno lineal después de ordenar.',
      porQueNo: {
        1: 'Ordenar cuesta y a veces destruye información útil, como la contigüidad.',
        2: 'Ese costo suele ser aceptable frente al beneficio.',
        3: 'Se puede ordenar cualquier cosa con un comparador.',
      },
    },
    {
      p: '¿Qué diferencia hay entre "subarreglo contiguo" y "subconjunto"?',
      opciones: [
        'El contiguo exige elementos vecinos y se resuelve con ventana; el subconjunto considera combinaciones y es mucho más caro',
        'Son sinónimos',
        'El subconjunto exige orden',
        'El contiguo requiere que estén ordenados',
      ],
      correcta: 0,
      porQue: 'Es la distinción que más cambia el enfoque y el costo, y aparece en el enunciado con una sola palabra.',
      porQueNo: {
        1: 'Son problemas de complejidad muy distinta.',
        2: 'Un subconjunto no requiere orden.',
        3: 'La contigüidad es de posición, no de orden de valores.',
      },
    },
    {
      p: 'En el recorrido en anchura, ¿qué estructura auxiliar se usa?',
      opciones: [
        'Una cola',
        'Una pila',
        'Un mapa',
        'Un árbol binario',
      ],
      correcta: 0,
      porQue: 'La cola es lo que garantiza el orden por niveles, y por eso el primer camino encontrado es el más corto.',
      porQueNo: {
        1: 'La pila da recorrido en profundidad.',
        2: 'Se usa para visitados, no para el orden del recorrido.',
        3: 'Es una estructura de datos, no un auxiliar del recorrido.',
      },
    },
    {
      p: 'En la ventana deslizante de "subcadena sin repetidos", ¿qué detalle se olvida?',
      opciones: [
        'Verificar que la posición previa del carácter esté dentro de la ventana actual',
        'Inicializar el mapa',
        'Recorrer de derecha a izquierda',
        'Ordenar la cadena',
      ],
      correcta: 0,
      porQue: 'Sin esa condición, un carácter repetido que quedó fuera de la ventana haría retroceder el inicio, y el resultado sería menor al correcto.',
      porQueNo: {
        1: 'Es necesario, pero no es el detalle sutil del patrón.',
        2: 'La dirección no cambia el resultado.',
        3: 'Ordenar destruiría la contigüidad.',
      },
    },
    {
      p: 'Para "¿existe un camino entre dos nodos?", ¿qué usarías?',
      opciones: [
        'Recorrido en profundidad: solo pregunta si existe, no cuál es el más corto',
        'Recorrido en anchura obligatoriamente',
        'Búsqueda binaria',
        'Ventana deslizante',
      ],
      correcta: 0,
      porQue: 'Cuando alcanza con cualquier camino, profundidad es más simple de escribir con recursión. Anchura sería correcta pero innecesaria.',
      porQueNo: {
        1: 'Funciona, pero no hace falta el orden por niveles.',
        2: 'No aplica a grafos.',
        3: 'No hay rangos contiguos.',
      },
    },
    {
      p: '¿Por qué calcular el medio como i + (f - i) / 2 en vez de (i + f) / 2?',
      opciones: [
        'Para evitar desbordar con índices muy grandes en lenguajes con enteros acotados',
        'Porque es más rápido',
        'Porque da un resultado distinto',
        'Porque evita decimales',
      ],
      correcta: 0,
      porQue: 'En JavaScript es menos crítico que en otros lenguajes, pero la forma segura no cuesta nada y es la correcta por defecto.',
      porQueNo: {
        1: 'La diferencia de velocidad es nula.',
        2: 'Da el mismo resultado cuando no hay desbordamiento.',
        3: 'Los decimales se resuelven con Math.floor en ambos casos.',
      },
    },
    {
      p: '¿Cuál es el valor de reconocer patrones?',
      opciones: [
        'Que los problemas se repiten con otra ropa: reconocer el patrón es la mayor parte de resolverlo',
        'Que permite memorizar soluciones',
        'Que evita tener que entender el problema',
        'Que reduce la cantidad de código',
      ],
      correcta: 0,
      porQue: 'No hace falta saber implementar veinte algoritmos de memoria: hace falta reconocer cinco o seis patrones y saber cuándo cada uno aplica.',
      porQueNo: {
        1: 'Memorizar sin entender falla apenas cambia el enunciado.',
        2: 'Entender el problema sigue siendo el primer paso.',
        3: 'La brevedad es un efecto, no el valor principal.',
      },
    },
  ],
});
