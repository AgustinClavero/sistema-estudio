/* ==========================================================================
   Lógica · Módulo 02 — Estructuras de datos
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'logica',
  id: 'm02',
  titulo: 'Estructuras de datos',
  fuentes: ['mdn-js', 'visualgo', 'big-o'],

  intro:
    '<p>Elegir la estructura correcta suele resolver el problema entero. Y elegir mal produce el mismo bug ' +
    'una y otra vez: <b>código que funciona con cien elementos y se vuelve inusable con cien mil</b>.</p>' +
    '<p>Este módulo cubre las seis que aparecen todo el tiempo, con el criterio para elegir en cada caso.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Array, mapa y conjunto: las tres que resuelven todo',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el <b>array</b> es una fila ordenada, el
<b>mapa</b> es un diccionario, y el <b>conjunto</b> es una bolsa sin repetidos. Con esas tres se resuelve la
enorme mayoría de los problemas.</div>

<h4>Para qué sirve cada una</h4>
<table>
<tr><th>Estructura</th><th>Buena para</th><th>Mala para</th></tr>
<tr><td><b>Array</b></td><td>Orden, recorrer, acceso por posición</td><td>Buscar por valor</td></tr>
<tr><td><b>Mapa</b></td><td>Buscar por clave, agrupar, contar</td><td>Orden por valor</td></tr>
<tr><td><b>Conjunto</b></td><td>"¿ya lo vi?", quitar repetidos</td><td>Guardar información asociada</td></tr>
</table>

<h4>El costo de buscar</h4>
<pre><code>Buscar en un array:    hay que recorrerlo    →  lento con muchos datos
Buscar en un mapa:     va directo            →  igual de rápido siempre
Buscar en un conjunto: va directo            →  igual de rápido siempre</code></pre>

<div class="aviso"><strong>Esa diferencia es la que produce el bug más común de rendimiento.</strong> Un
<code>includes</code> dentro de un bucle recorre la lista <b>en cada vuelta</b>: con cien elementos son diez
mil comparaciones —instantáneo— y con cien mil son <b>diez mil millones</b>. ' +
El código es idéntico; lo que cambió es el volumen.</div>

<h4>La señal para cambiar de estructura</h4>
<pre><code>Si ves un includes, indexOf o find DENTRO de un bucle,
casi siempre hace falta un mapa o un conjunto.</code></pre>

<h4>Contar y agrupar: el patrón más útil</h4>
<pre><code>// Contar apariciones
const cuenta = new Map();
for (const x of lista) {
  cuenta.set(x, (cuenta.get(x) ?? 0) + 1);
}

// Agrupar por una propiedad
const porCliente = new Map();
for (const p of pedidos) {
  const grupo = porCliente.get(p.clienteId) ?? [];
  grupo.push(p);
  porCliente.set(p.clienteId, grupo);
}</code></pre>

<p>Esos dos patrones resuelven una cantidad enorme de problemas reales, y los dos son de una sola pasada.</p>
`,

      tecnico: `
<h4>Objeto vs Map: cuál usar</h4>
<table>
<tr><th></th><th>Objeto</th><th>Map</th></tr>
<tr><td>Claves</td><td>Solo texto y símbolos</td><td><b>Cualquier valor</b></td></tr>
<tr><td>Orden</td><td>Mezcla numéricas y de texto</td><td><b>Orden de inserción</b></td></tr>
<tr><td>Tamaño</td><td><code>Object.keys().length</code></td><td><code>.size</code></td></tr>
<tr><td>Recorrer</td><td>Requiere convertir</td><td>Iterable directo</td></tr>
<tr><td>Claves heredadas</td><td><b>Sí</b>: cuidado con <code>toString</code></td><td>No</td></tr>
</table>

<div class="dato"><strong>La última fila esconde un bug clásico:</strong> un objeto usado como diccionario
<b>ya tiene claves</b> —<code>toString</code>, <code>constructor</code>— así que
<code>if (diccionario['toString'])</code> da verdadero aunque nunca lo hayas puesto. ' +
Con un <code>Map</code> eso no pasa. <b>Para datos que vienen del usuario, siempre <code>Map</code>.</b></div>

<h4>El bug del includes en un bucle</h4>
<pre><code>// ❌ Cuadrático: recorre 'vistos' en cada vuelta
const vistos = [];
const duplicados = [];
for (const x of lista) {
  if (vistos.includes(x)) duplicados.push(x);
  else vistos.push(x);
}

// ✔ Lineal: el conjunto busca directo
const vistos = new Set();
const duplicados = [];
for (const x of lista) {
  if (vistos.has(x)) duplicados.push(x);
  else vistos.add(x);
}</code></pre>

<div class="dato"><strong>Con 100.000 elementos, la primera versión hace del orden de cinco mil millones de
comparaciones y la segunda cien mil.</strong> En la práctica: una tarda minutos y la otra milisegundos. ' +
<b>El cambio es de tres caracteres</b> — de array a conjunto y de <code>includes</code> a <code>has</code>.</div>

<h4>Pila y cola</h4>
<pre><code>PILA  (el último que entra, el primero que sale)
  · deshacer / rehacer
  · historial de navegación
  · evaluar expresiones anidadas
  → push() y pop() sobre un array

COLA  (el primero que entra, el primero que sale)
  · procesar en orden de llegada
  · recorrer un árbol por niveles
  → push() y shift()… con una advertencia</code></pre>

<div class="dato"><strong>La advertencia sobre <code>shift</code>:</strong> sacar del principio de un array
obliga a <b>mover todos los demás elementos</b>. Con colas chicas no importa; con colas de cien mil elementos,
convierte una operación que debería ser constante en una lineal — y el recorrido entero en cuadrático. ' +
Para colas grandes se usa un índice de lectura en vez de <code>shift</code>.</div>

<h4>Cuándo aparecen árboles y grafos</h4>
<pre><code>ÁRBOL   estructura jerárquica: cada nodo tiene un padre
        · categorías con subcategorías
        · comentarios con respuestas
        · el DOM
        · estructura de archivos

GRAFO   relaciones sin jerarquía: cualquiera con cualquiera
        · red de contactos
        · rutas entre ciudades
        · dependencias entre tareas</code></pre>

<div class="dato"><strong>La distinción práctica es una sola pregunta: <b>¿puede haber ciclos?</b></strong> ' +
En un árbol, no: si subís por los padres siempre llegás a la raíz. En un grafo, sí — y por eso todo recorrido
de grafo necesita un <b>conjunto de visitados</b>, o entra en bucle infinito. ' +
Es el error número uno al trabajar con grafos.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS TRES QUE RESUELVEN CASI TODO</text>

  <rect x="24" y="34" width="200" height="96" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="124" y="54" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">ARRAY</text>
  <g fill="#22d3ee" fill-opacity=".35">
    <rect x="44" y="64" width="28" height="24" rx="3"/><rect x="76" y="64" width="28" height="24" rx="3"/>
    <rect x="108" y="64" width="28" height="24" rx="3"/><rect x="140" y="64" width="28" height="24" rx="3"/>
    <rect x="172" y="64" width="28" height="24" rx="3"/>
  </g>
  <text x="124" y="104" text-anchor="middle" fill="#34d399" font-size="9.5">✓ orden · recorrer · posición</text>
  <text x="124" y="120" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">✗ buscar por valor</text>

  <rect x="240" y="34" width="200" height="96" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.3"/>
  <text x="340" y="54" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">MAPA</text>
  <rect x="260" y="64" width="76" height="14" rx="3" fill="#34d399" fill-opacity=".3"/>
  <text x="352" y="75" fill="currentColor" opacity=".6" font-size="8.5">→ valor</text>
  <rect x="260" y="82" width="76" height="14" rx="3" fill="#34d399" fill-opacity=".3"/>
  <text x="352" y="93" fill="currentColor" opacity=".6" font-size="8.5">→ valor</text>
  <text x="340" y="112" text-anchor="middle" fill="#34d399" font-size="9.5">✓ buscar · agrupar · contar</text>
  <text x="340" y="126" text-anchor="middle" fill="#f87171" font-size="9.5">✗ ordenar por valor</text>

  <rect x="456" y="34" width="200" height="96" rx="10" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="556" y="54" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">CONJUNTO</text>
  <circle cx="510" cy="80" r="14" fill="#7c5cff" fill-opacity=".35"/>
  <circle cx="546" cy="76" r="14" fill="#7c5cff" fill-opacity=".35"/>
  <circle cx="582" cy="84" r="14" fill="#7c5cff" fill-opacity=".35"/>
  <text x="556" y="112" text-anchor="middle" fill="#7c5cff" font-size="9.5">✓ “¿ya lo vi?” · sin repetidos</text>
  <text x="556" y="126" text-anchor="middle" fill="#f87171" font-size="9.5">✗ guardar info asociada</text>

  <rect x="24" y="146" width="632" height="52" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="44" y="166" fill="#f87171" font-size="12" font-weight="700">EL BUG DE RENDIMIENTO MÁS COMÚN: includes DENTRO DE UN BUCLE</text>
  <text x="44" y="186" fill="currentColor" opacity=".78" font-size="11">
    Con 100 elementos: 10.000 comparaciones, instantáneo. Con 100.000: <tspan font-weight="700">miles de millones</tspan>. El código es idéntico.</text>

  <rect x="24" y="208" width="632" height="30" rx="8" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="340" y="228" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">
    La señal: si ves includes, indexOf o find DENTRO de un bucle, casi siempre falta un mapa o un conjunto.</text>

  <line x1="24" y1="256" x2="656" y2="256" stroke="currentColor" opacity=".18"/>

  <rect x="24" y="268" width="304" height="58" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="176" y="288" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">EL OBJETO YA TIENE CLAVES</text>
  <text x="44" y="306" fill="currentColor" opacity=".7" font-size="10" font-family="monospace">diccionario['toString'] → verdadero</text>
  <text x="44" y="320" fill="#fbbf24" font-size="10" font-weight="700">para datos del usuario, siempre Map</text>

  <rect x="352" y="268" width="304" height="58" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="504" y="288" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">shift() MUEVE TODOS LOS DEMÁS</text>
  <text x="372" y="306" fill="currentColor" opacity=".7" font-size="10">con colas grandes, el recorrido se vuelve cuadrático</text>
  <text x="372" y="320" fill="#f87171" font-size="10" font-weight="700">usá un índice de lectura</text>

  <rect x="24" y="336" width="632" height="50" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="44" y="356" fill="#7c5cff" font-size="11.5" font-weight="700">ÁRBOL vs GRAFO — una sola pregunta: ¿puede haber CICLOS?</text>
  <text x="44" y="376" fill="currentColor" opacity=".78" font-size="11">
    En un grafo sí — por eso todo recorrido necesita un <tspan font-weight="700">conjunto de visitados</tspan>, o entra en bucle infinito. Es el error número uno.</text>
</svg>`,
        pie: 'Contar apariciones y agrupar por propiedad: dos patrones de una sola pasada que resuelven muchísimo.',
      },

      entrevista: [
        { p: '¿Cuándo usás array, mapa y conjunto?',
          r: '<b>Array</b> cuando importa el orden, hay que recorrer o acceder por posición. <b>Mapa</b> cuando hay que buscar por clave, agrupar ' +
             'o contar. <b>Conjunto</b> cuando la pregunta es "¿ya lo vi?" o hay que quitar repetidos. ' +
             'La diferencia práctica que más pesa es el <b>costo de buscar</b>: en un array hay que recorrerlo, ' +
             'y en un mapa o conjunto se va directo.' },

        { p: '¿Cuál es el bug de rendimiento más común y cómo se detecta?',
          r: 'Un <code>includes</code>, <code>indexOf</code> o <code>find</code> <b>dentro de un bucle</b>. Recorre la lista en cada vuelta: ' +
             'con cien elementos son diez mil comparaciones —instantáneo— y con cien mil son miles de millones. ' +
             '<b>El código es idéntico; lo que cambió es el volumen.</b> La detección es visual: si veo una búsqueda lineal dentro de un bucle, ' +
             'casi siempre falta un mapa o un conjunto — y el cambio suele ser de tres caracteres.' },

        { p: '¿Objeto o Map para un diccionario?',
          r: '<b>Map</b>, sobre todo si las claves vienen del usuario. Un objeto <b>ya tiene claves heredadas</b> como <code>toString</code> ' +
             'y <code>constructor</code>, así que <code>if (diccionario[\'toString\'])</code> da verdadero aunque nunca lo hayas puesto. ' +
             'Además, <code>Map</code> conserva el orden de inserción, acepta cualquier tipo de clave, es iterable directo y tiene ' +
             '<code>.size</code>. El objeto sirve para estructuras conocidas y fijas.' },

        { p: '¿Cuál es la diferencia práctica entre un árbol y un grafo?',
          r: 'Una sola pregunta: <b>¿puede haber ciclos?</b> En un árbol no —si subís por los padres siempre llegás a la raíz—; ' +
             'en un grafo sí. Y de ahí sale la consecuencia que importa: <b>todo recorrido de grafo necesita un conjunto de visitados</b>, ' +
             'o entra en bucle infinito. Es el error número uno al trabajar con grafos, y no se manifiesta con datos de prueba chicos ' +
             'que no tienen ciclos.' },
      ],

      practica: `
<h4>Ejercicio 1 — Detectar el cuadrático</h4>
<pre><code>function usuariosSinPedidos(usuarios, pedidos) {
  return usuarios.filter(
    (u) =&gt; !pedidos.some((p) =&gt; p.usuarioId === u.id)
  );
}

¿Cuál es el problema con 50.000 usuarios y 200.000 pedidos?</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>Por cada usuario recorre TODOS los pedidos:
50.000 × 200.000 = 10.000.000.000 comparaciones.

Corregido, con un conjunto:
function usuariosSinPedidos(usuarios, pedidos) {
  const conPedidos = new Set(pedidos.map((p) =&gt; p.usuarioId));
  return usuarios.filter((u) =&gt; !conPedidos.has(u.id));
}

Ahora: 200.000 para armar el conjunto + 50.000 para filtrar = 250.000.
De diez mil millones a doscientos cincuenta mil.</code></pre>
</details>

<h4>Ejercicio 2 — Agrupar y resumir</h4>
<pre><code>Dada una lista de ventas { producto, categoria, monto },
devolver por categoría: cantidad de ventas y monto total,
ordenado por monto descendente.</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>function resumenPorCategoria(ventas) {
  const acum = new Map();

  for (const v of ventas) {
    const actual = acum.get(v.categoria) ?? { cantidad: 0, total: 0 };
    actual.cantidad++;
    actual.total += v.monto;
    acum.set(v.categoria, actual);
  }

  return [...acum.entries()]
    .map(([categoria, datos]) =&gt; ({ categoria, ...datos }))
    .sort((a, b) =&gt; b.total - a.total);
}

Una sola pasada para agrupar, y el ordenamiento al final.
Casos borde: lista vacía → [] ✔</code></pre>
</details>

<h4>Ejercicio 3 — El objeto que miente</h4>
<pre><code>function contarPalabras(texto) {
  const cuenta = {};
  for (const p of texto.split(' ')) {
    cuenta[p] = (cuenta[p] || 0) + 1;
  }
  return cuenta;
}

contarPalabras('el constructor de toString');
// ¿Qué problema tiene?</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>cuenta['constructor'] no arranca en undefined: hereda la función
constructor del prototipo. Con || eso da un valor falso y "funciona"
por casualidad, pero la estructura queda contaminada
y Object.keys puede dar resultados inesperados.

Corregido:
function contarPalabras(texto) {
  const cuenta = new Map();
  for (const p of texto.split(' ')) {
    cuenta.set(p, (cuenta.get(p) ?? 0) + 1);
  }
  return cuenta;
}

O, si hace falta un objeto: Object.create(null) crea uno sin prototipo.</code></pre>
</details>

<h4>Ejercicio 4 — Cola sin shift</h4>
<pre><code>Implementá una cola que no use shift(), para que sacar
sea de costo constante aunque la cola tenga 100.000 elementos.</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>class Cola {
  #datos = [];
  #inicio = 0;

  encolar(x) { this.#datos.push(x); }

  desencolar() {
    if (this.#inicio &gt;= this.#datos.length) return undefined;
    const x = this.#datos[this.#inicio];
    this.#datos[this.#inicio] = undefined;   // liberar la referencia
    this.#inicio++;
    // compactar cuando la mitad quedó consumida
    if (this.#inicio &gt; 32 &amp;&amp; this.#inicio * 2 &gt; this.#datos.length) {
      this.#datos = this.#datos.slice(this.#inicio);
      this.#inicio = 0;
    }
    return x;
  }

  get tamano() { return this.#datos.length - this.#inicio; }
}

El índice de lectura evita mover todos los elementos.
La compactación evita que el array crezca sin límite.</code></pre>
</details>
`,

      errores: [
        { mito: 'Un includes dentro de un bucle es aceptable si la lista es chica.',
          realidad: 'Lo es <b>hoy</b>. Y el código no cambia cuando el volumen crece: la misma función que tardaba milisegundos con cien elementos ' +
                    'tarda minutos con cien mil, sin ninguna señal de aviso.' },

        { mito: 'Un objeto y un Map son equivalentes como diccionario.',
          realidad: 'El objeto <b>ya tiene claves heredadas</b>: consultar <code>toString</code> da verdadero aunque nunca lo hayas puesto. ' +
                    'Para claves que vienen del usuario, siempre <code>Map</code>.' },

        { mito: 'shift() es la forma normal de sacar de una cola.',
          realidad: 'Sacar del principio de un array <b>mueve todos los demás elementos</b>. Con colas grandes convierte una operación constante ' +
                    'en lineal y el recorrido entero en cuadrático.' },

        { mito: 'Un recorrido de grafo es igual que uno de árbol.',
          realidad: 'Un grafo puede tener <b>ciclos</b>, así que hace falta un <b>conjunto de visitados</b> o el recorrido entra en bucle infinito. ' +
                    'Y no se manifiesta con datos de prueba chicos.' },
      ],

      glosario: [
        { t: 'Array', d: 'Colección ordenada con acceso por posición.' },
        { t: 'Map', d: 'Diccionario clave-valor con búsqueda directa y orden de inserción.' },
        { t: 'Set', d: 'Colección sin repetidos con pertenencia directa.' },
        { t: 'Clave heredada', d: 'Propiedad que un objeto tiene por su prototipo, como toString.' },
        { t: 'Pila', d: 'El último que entra es el primero que sale.' },
        { t: 'Cola', d: 'El primero que entra es el primero que sale.' },
        { t: 'Árbol', d: 'Jerarquía sin ciclos: cada nodo tiene un padre.' },
        { t: 'Grafo', d: 'Relaciones sin jerarquía. Puede tener ciclos.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es la diferencia práctica que más pesa entre array y mapa?',
      opciones: [
        'El costo de buscar: en un array hay que recorrerlo, en un mapa se va directo',
        'El consumo de memoria',
        'Que el mapa no admite números',
        'Que el array no se puede recorrer',
      ],
      correcta: 0,
      porQue: 'Esa diferencia es la que produce el bug de rendimiento más común: búsquedas lineales repetidas dentro de un bucle.',
      porQueNo: {
        1: 'Difiere, pero no es lo que decide el uso.',
        2: 'Map admite cualquier tipo de clave, incluidos números.',
        3: 'Los arrays se recorren perfectamente.',
      },
    },
    {
      p: '¿Cuál es el bug de rendimiento más común con colecciones?',
      opciones: [
        'includes, indexOf o find dentro de un bucle',
        'Usar map en vez de for',
        'Crear arrays vacíos',
        'Usar spread para copiar',
      ],
      correcta: 0,
      porQue: 'Recorre la lista en cada vuelta: con cien elementos son diez mil comparaciones y con cien mil, miles de millones. El código es idéntico; lo que cambió es el volumen.',
      porQueNo: {
        1: 'La diferencia es marginal.',
        2: 'No tiene costo relevante.',
        3: 'Copia una vez, no en cada vuelta.',
      },
    },
    {
      p: '¿Cómo se corrige un filtro que busca dentro de otra lista?',
      opciones: [
        'Armando un Set con los identificadores y consultando con has',
        'Ordenando las dos listas primero',
        'Usando forEach en vez de filter',
        'Dividiendo la lista en partes',
      ],
      correcta: 0,
      porQue: 'De diez mil millones de comparaciones a doscientos cincuenta mil, con un cambio de dos líneas.',
      porQueNo: {
        1: 'Ordenar cuesta y no elimina la búsqueda repetida.',
        2: 'El método de iteración no cambia la complejidad.',
        3: 'Reparte el mismo problema en trozos.',
      },
    },
    {
      p: '¿Por qué Map es mejor que un objeto para claves que vienen del usuario?',
      opciones: [
        'Porque el objeto ya tiene claves heredadas como toString y constructor',
        'Porque es más rápido siempre',
        'Porque ocupa menos memoria',
        'Porque acepta más elementos',
      ],
      correcta: 0,
      porQue: 'Consultar diccionario["toString"] da verdadero aunque nunca lo hayas puesto, y la estructura queda contaminada.',
      porQueNo: {
        1: 'El rendimiento es comparable en la mayoría de los casos.',
        2: 'Suele ocupar algo más.',
        3: 'Ambos escalan a millones de entradas.',
      },
    },
    {
      p: '¿Qué patrón resuelve "contar apariciones"?',
      opciones: [
        'Un Map donde la clave es el elemento y el valor la cuenta, en una sola pasada',
        'Ordenar y recorrer comparando vecinos',
        'filter con includes',
        'Un array de contadores por índice',
      ],
      correcta: 0,
      porQue: 'Es de una sola pasada y funciona con cualquier tipo de clave. Junto con "agrupar por propiedad", resuelve una cantidad enorme de problemas reales.',
      porQueNo: {
        1: 'Funciona pero exige ordenar primero, que cuesta más.',
        2: 'Es cuadrático.',
        3: 'Solo sirve si los elementos son enteros chicos y contiguos.',
      },
    },
    {
      p: '¿Cuál es el problema de usar shift() en una cola grande?',
      opciones: [
        'Sacar del principio mueve todos los demás elementos: la operación deja de ser constante',
        'No mantiene el orden',
        'No funciona con objetos',
        'Devuelve una copia',
      ],
      correcta: 0,
      porQue: 'Con colas de cien mil elementos convierte el recorrido entero en cuadrático. Se resuelve con un índice de lectura en vez de sacar del array.',
      porQueNo: {
        1: 'Mantiene el orden correctamente.',
        2: 'Funciona con cualquier tipo de elemento.',
        3: 'Devuelve el elemento, no una copia del array.',
      },
    },
    {
      p: '¿Para qué sirve una pila?',
      opciones: [
        'Deshacer y rehacer, historial, evaluar expresiones anidadas',
        'Procesar en orden de llegada',
        'Recorrer un árbol por niveles',
        'Buscar por clave',
      ],
      correcta: 0,
      porQue: 'El último que entra es el primero que sale, que es exactamente la semántica de "deshacer el último cambio".',
      porQueNo: {
        1: 'Eso es una cola.',
        2: 'El recorrido por niveles usa cola.',
        3: 'Eso es un mapa.',
      },
    },
    {
      p: '¿Cuál es la diferencia práctica entre árbol y grafo?',
      opciones: [
        'Si puede haber ciclos: en un grafo sí, y por eso todo recorrido necesita un conjunto de visitados',
        'La cantidad de nodos',
        'Si los nodos guardan datos',
        'Si se recorre en profundidad o en anchura',
      ],
      correcta: 0,
      porQue: 'Sin el conjunto de visitados, el recorrido de un grafo entra en bucle infinito — y no se manifiesta con datos de prueba chicos sin ciclos.',
      porQueNo: {
        1: 'Ambos pueden tener cualquier cantidad.',
        2: 'Los dos guardan datos en los nodos.',
        3: 'Las dos formas se aplican a los dos.',
      },
    },
    {
      p: '¿Qué estructura conviene para "¿ya vi este elemento?"',
      opciones: [
        'Un Set: la consulta es directa y no guarda información asociada innecesaria',
        'Un array con includes',
        'Un objeto con claves booleanas',
        'Una lista ordenada con búsqueda binaria',
      ],
      correcta: 0,
      porQue: 'Es exactamente la operación para la que existe. Un array con includes es lineal y un objeto arrastra las claves heredadas.',
      porQueNo: {
        1: 'Recorre la lista en cada consulta.',
        2: 'Funciona, pero hereda claves como toString.',
        3: 'Obliga a mantener el orden y es más complejo.',
      },
    },
    {
      p: '¿Qué ventajas tiene Map sobre objeto además de las claves heredadas?',
      opciones: [
        'Acepta cualquier tipo de clave, conserva el orden de inserción, es iterable y tiene .size',
        'Es más rápido en todos los casos',
        'Se serializa mejor a JSON',
        'Permite valores duplicados',
      ],
      correcta: 0,
      porQue: 'El objeto mezcla el orden de las claves numéricas con las de texto, y requiere convertir para recorrerlo.',
      porQueNo: {
        1: 'El rendimiento depende del caso.',
        2: 'Es al revés: JSON.stringify no serializa un Map directamente.',
        3: 'Las claves son únicas en ambos.',
      },
    },
    {
      p: 'En un recorrido de grafo, ¿qué pasa si olvidás el conjunto de visitados?',
      opciones: [
        'Entra en bucle infinito si hay un ciclo, y no se nota con datos de prueba chicos',
        'Devuelve resultados en desorden',
        'Consume más memoria pero termina',
        'Salta algunos nodos',
      ],
      correcta: 0,
      porQue: 'Es el error número uno al trabajar con grafos, y aparece recién con datos reales que sí tienen ciclos.',
      porQueNo: {
        1: 'El problema es que no termina, no el orden.',
        2: 'No termina nunca.',
        3: 'Visita de más, no de menos.',
      },
    },
    {
      p: '¿Cuándo aparece naturalmente un árbol?',
      opciones: [
        'Categorías con subcategorías, comentarios con respuestas, el DOM, archivos y carpetas',
        'Red de contactos',
        'Rutas entre ciudades',
        'Dependencias circulares entre módulos',
      ],
      correcta: 0,
      porQue: 'En todos esos casos cada elemento tiene un padre y no hay ciclos: subiendo siempre se llega a la raíz.',
      porQueNo: {
        1: 'Es un grafo: las relaciones son mutuas y pueden formar ciclos.',
        2: 'Es un grafo con pesos.',
        3: 'Justamente hay ciclos, así que no es un árbol.',
      },
    },
    {
      p: '¿Qué hace Object.create(null)?',
      opciones: [
        'Crea un objeto sin prototipo, así que no tiene claves heredadas',
        'Crea un objeto inmutable',
        'Crea un objeto vacío igual que {}',
        'Crea un Map',
      ],
      correcta: 0,
      porQue: 'Es la alternativa cuando hace falta un objeto plano como diccionario y no se quiere usar Map.',
      porQueNo: {
        1: 'No lo congela: se le pueden agregar propiedades.',
        2: '{} sí hereda del prototipo de Object.',
        3: 'Sigue siendo un objeto común, sin los métodos de Map.',
      },
    },
    {
      p: 'Al agrupar por una propiedad, ¿cuál es el patrón correcto?',
      opciones: [
        'Un Map donde la clave es la propiedad y el valor un array, en una sola pasada',
        'filter una vez por cada valor distinto',
        'Ordenar por la propiedad y después partir',
        'reduce con spread del acumulador',
      ],
      correcta: 0,
      porQue: 'Una sola pasada, sin necesidad de conocer de antemano los valores posibles.',
      porQueNo: {
        1: 'Recorre la lista completa una vez por grupo.',
        2: 'Ordenar cuesta más y no hace falta.',
        3: 'Funciona, pero copiar el acumulador en cada paso es costoso.',
      },
    },
    {
      p: 'La señal visual de que hace falta cambiar de estructura es…',
      opciones: [
        'Una búsqueda lineal (includes, indexOf, find) dentro de un bucle',
        'Más de tres niveles de indentación',
        'Una función de más de 50 líneas',
        'Muchos parámetros',
      ],
      correcta: 0,
      porQue: 'Casi siempre significa que falta un mapa o un conjunto, y el cambio suele ser de pocos caracteres.',
      porQueNo: {
        1: 'Es señal de anidamiento, no de estructura de datos.',
        2: 'Es una alarma de diseño, no de complejidad algorítmica.',
        3: 'Indica responsabilidades mezcladas.',
      },
    },
  ],
});
