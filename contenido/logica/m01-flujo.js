/* ==========================================================================
   Lógica · Módulo 01 — Control de flujo y estado
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'logica',
  id: 'm01',
  titulo: 'Control de flujo y estado',
  fuentes: ['mdn-js'],

  intro:
    '<p>Condicionales y bucles son lo primero que se aprende y lo que peor se escribe. No por dificultad, sino ' +
    'porque nadie enseña las formas que <b>evitan el enredo</b>: salida temprana, acumuladores explícitos y ' +
    'condiciones con nombre.</p>' +
    '<p>Este módulo es corto y es el que más mejora la legibilidad de tu código diario.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Condicionales, bucles y acumuladores sin enredo',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el anidamiento profundo casi nunca es necesario.
Se resuelve <b>sacando los casos que no aplican al principio</b>.</div>

<h4>La salida temprana</h4>
<pre><code>// ❌ Pirámide: lo importante está en el fondo
function procesar(pedido) {
  if (pedido) {
    if (pedido.items.length &gt; 0) {
      if (pedido.cliente.activo) {
        if (pedido.total &gt; 0) {
          // … lo que realmente hace la función, a 5 niveles
        }
      }
    }
  }
}

// ✔ Los casos que no aplican salen primero
function procesar(pedido) {
  if (!pedido) return;
  if (pedido.items.length === 0) return;
  if (!pedido.cliente.activo) return;
  if (pedido.total &lt;= 0) return;

  // … lo que realmente hace la función, a un nivel
}</code></pre>

<div class="aviso"><strong>La segunda versión se lee de arriba a abajo como una lista de condiciones.</strong>
Y tiene una ventaja concreta: agregar una condición nueva es <b>una línea más al principio</b>, no un nivel más
de anidamiento — así que el archivo no se degrada con el tiempo.</div>

<h4>Condiciones con nombre</h4>
<pre><code>// ❌ Ilegible
if (u.edad &gt;= 18 &amp;&amp; u.pais === 'AR' &amp;&amp; !u.bloqueado &amp;&amp; u.saldo &gt; 0) { … }

// ✔ Cada condición dice qué significa
const esMayor = u.edad &gt;= 18;
const operaEnArgentina = u.pais === 'AR';
const puedeOperar = esMayor &amp;&amp; operaEnArgentina &amp;&amp; !u.bloqueado &amp;&amp; u.saldo &gt; 0;

if (puedeOperar) { … }</code></pre>

<h4>Los tres tipos de bucle</h4>
<table>
<tr><th>Necesito…</th><th>Uso</th></tr>
<tr><td>Transformar cada elemento</td><td><code>map</code></td></tr>
<tr><td>Quedarme con algunos</td><td><code>filter</code></td></tr>
<tr><td>Reducir a un solo valor</td><td><code>reduce</code></td></tr>
<tr><td>Hacer algo por cada uno, sin devolver</td><td><code>for...of</code></td></tr>
<tr><td>Cortar en el medio</td><td><code>for...of</code> con <code>break</code></td></tr>
</table>

<div class="dato"><strong>La última fila es la que decide entre los dos estilos.</strong>
<code>forEach</code> <b>no se puede cortar</b>: no admite <code>break</code>. Si necesitás salir apenas
encontrás algo, o usás <code>for...of</code>, o usás <code>find</code> / <code>some</code>, que cortan solos.</div>
`,

      tecnico: `
<h4>El acumulador explícito</h4>
<pre><code>// ❌ Estado repartido: difícil de seguir
let total = 0;
let cantidad = 0;
let maximo = -Infinity;
for (const p of pedidos) {
  total += p.monto;
  cantidad++;
  if (p.monto &gt; maximo) maximo = p.monto;
}

// ✔ Un solo objeto acumulador
const resumen = pedidos.reduce(
  (acc, p) =&gt; ({
    total: acc.total + p.monto,
    cantidad: acc.cantidad + 1,
    maximo: Math.max(acc.maximo, p.monto),
  }),
  { total: 0, cantidad: 0, maximo: -Infinity },
);</code></pre>

<div class="dato"><strong>La segunda versión es más clara y tiene una contra que conviene conocer:</strong>
crea un objeto nuevo en cada iteración. Con listas de millones de elementos eso se nota; con listas normales,
no. <b>Es un caso donde la versión más elegante tiene un costo real que solo importa a cierta escala</b> — y
saberlo es lo que permite elegir a propósito.</div>

<h4>Los operadores que evitan condicionales</h4>
<pre><code>// Valor por defecto: ?? solo cubre null y undefined
const nombre = usuario.nombre ?? 'Anónimo';      // ✔ "" queda como ""
const nombre = usuario.nombre || 'Anónimo';      // ⚠ "" se convierte en "Anónimo"

// Acceso seguro
const ciudad = usuario?.direccion?.ciudad;       // undefined si falta algo

// Asignación condicional
config.limite ??= 100;                           // solo si es null/undefined</code></pre>

<div class="dato"><strong>La diferencia entre <code>??</code> y <code>||</code> causa bugs reales y sutiles:</strong>
con <code>||</code>, un <b>cero legítimo</b> o una <b>cadena vacía intencional</b> se reemplazan por el valor
por defecto. <code>precio || 100</code> convierte un producto gratis en uno de 100. ' +
<b>Por defecto usá <code>??</code></b>, y <code>||</code> solo cuando querés tratar todos los valores falsos
igual.</div>

<h4>Las banderas y por qué suelen sobrar</h4>
<pre><code>// ❌ Bandera
let encontrado = false;
for (const u of usuarios) {
  if (u.email === buscado) { encontrado = true; break; }
}
if (encontrado) { … }

// ✔ El método ya existe
if (usuarios.some((u) =&gt; u.email === buscado)) { … }

// Y si necesitás el elemento:
const usuario = usuarios.find((u) =&gt; u.email === buscado);
if (usuario) { … }</code></pre>

<h4>Las máquinas de estado, para cuando los if se multiplican</h4>
<pre><code>// Cuando hay muchas transiciones, una tabla es más clara que ifs
const TRANSICIONES = {
  borrador:   ['confirmado', 'cancelado'],
  confirmado: ['pagado', 'cancelado'],
  pagado:     ['enviado'],
  enviado:    [],
  cancelado:  [],
};

function puedePasar(actual, nuevo) {
  return TRANSICIONES[actual]?.includes(nuevo) ?? false;
}</code></pre>

<div class="dato"><strong>La tabla hace visible algo que los <code>if</code> esconden: <b>qué transiciones NO
existen</b>.</strong> Mirando la tabla se ve de un vistazo que de "enviado" no se sale y que "pagado" no se
puede cancelar. Con condicionales repartidos, esa información no está en ningún lado — hay que reconstruirla
leyendo todo.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA PIRÁMIDE vs LA SALIDA TEMPRANA</text>

  <rect x="24" y="34" width="304" height="130" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="54" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">✗ pirámide</text>
  <rect x="44" y="64" width="264" height="14" rx="3" fill="#f87171" fill-opacity=".25"/>
  <rect x="60" y="82" width="248" height="14" rx="3" fill="#f87171" fill-opacity=".25"/>
  <rect x="76" y="100" width="232" height="14" rx="3" fill="#f87171" fill-opacity=".25"/>
  <rect x="92" y="118" width="216" height="14" rx="3" fill="#f87171" fill-opacity=".25"/>
  <rect x="108" y="136" width="200" height="14" rx="3" fill="#34d399" fill-opacity=".4"/>
  <text x="208" y="147" text-anchor="middle" fill="#06281c" font-size="8.5" font-weight="700">lo que importa</text>

  <rect x="352" y="34" width="304" height="130" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="504" y="54" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">✓ salida temprana</text>
  <rect x="372" y="64" width="120" height="14" rx="3" fill="#f87171" fill-opacity=".3"/>
  <text x="504" y="75" fill="currentColor" opacity=".6" font-size="8.5">if (!pedido) return;</text>
  <rect x="372" y="82" width="120" height="14" rx="3" fill="#f87171" fill-opacity=".3"/>
  <text x="504" y="93" fill="currentColor" opacity=".6" font-size="8.5">if (sin items) return;</text>
  <rect x="372" y="100" width="120" height="14" rx="3" fill="#f87171" fill-opacity=".3"/>
  <text x="504" y="111" fill="currentColor" opacity=".6" font-size="8.5">if (inactivo) return;</text>
  <rect x="372" y="124" width="264" height="26" rx="4" fill="#34d399" fill-opacity=".4"/>
  <text x="504" y="141" text-anchor="middle" fill="#06281c" font-size="9.5" font-weight="700">lo que importa, a un nivel</text>

  <rect x="24" y="176" width="632" height="34" rx="8" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="340" y="197" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">
    Y agregar una condición nueva es UNA LÍNEA MÁS, no un nivel más: el archivo no se degrada con el tiempo.</text>

  <line x1="24" y1="228" x2="656" y2="228" stroke="currentColor" opacity=".18"/>

  <text x="24" y="252" fill="#f87171" font-size="12" font-weight="700">
    EL BUG SUTIL: || vs ??</text>

  <rect x="24" y="264" width="304" height="66" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="284" fill="currentColor" opacity=".72" font-size="10.5" font-family="monospace">precio || 100</text>
  <text x="44" y="304" fill="#f87171" font-size="10.5" font-weight="700">un producto GRATIS pasa a costar 100</text>
  <text x="44" y="320" fill="currentColor" opacity=".6" font-size="9.5">porque 0 es un valor falso</text>

  <rect x="352" y="264" width="304" height="66" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.5"/>
  <text x="372" y="284" fill="currentColor" opacity=".72" font-size="10.5" font-family="monospace">precio ?? 100</text>
  <text x="372" y="304" fill="#34d399" font-size="10.5" font-weight="700">solo reemplaza null y undefined</text>
  <text x="372" y="320" fill="currentColor" opacity=".6" font-size="9.5">el 0 y el "" se respetan</text>

  <rect x="24" y="342" width="632" height="44" rx="9" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="44" y="360" fill="#7c5cff" font-size="11.5" font-weight="700">LA TABLA DE TRANSICIONES HACE VISIBLE LO QUE LOS IF ESCONDEN</text>
  <text x="44" y="378" fill="currentColor" opacity=".75" font-size="10.5">
    De un vistazo se ve qué transiciones NO existen. Con condicionales repartidos, esa información no está en ningún lado.</text>
</svg>`,
        pie: 'forEach no se puede cortar. Si necesitás salir apenas encontrás algo, usá for...of, find o some.',
      },

      entrevista: [
        { p: '¿Cómo evitás el anidamiento profundo?',
          r: 'Con <b>salida temprana</b>: descartar al principio todos los casos que no aplican, en vez de envolver la lógica real en condiciones. ' +
             'La función pasa a leerse de arriba a abajo como una lista de precondiciones. ' +
             'Y tiene una ventaja concreta: agregar una condición nueva es <b>una línea más al principio</b>, no un nivel más de anidamiento — ' +
             'así que el archivo no se degrada con el tiempo.' },

        { p: '¿Cuál es la diferencia entre || y ?? y por qué importa?',
          r: '<code>||</code> reemplaza cualquier valor <b>falso</b>: cero, cadena vacía, <code>false</code>. <code>??</code> reemplaza solo ' +
             '<code>null</code> y <code>undefined</code>. La diferencia produce bugs sutiles: <code>precio || 100</code> convierte ' +
             '<b>un producto gratis en uno de 100</b>, y <code>nombre || "Anónimo"</code> pisa una cadena vacía intencional. ' +
             'Por defecto uso <code>??</code>, y <code>||</code> solo cuando quiero tratar todos los valores falsos igual.' },

        { p: '¿Cuándo usás for...of en vez de los métodos de array?',
          r: 'Cuando necesito <b>cortar en el medio</b>. <code>forEach</code> no admite <code>break</code>, así que si el objetivo es salir apenas ' +
             'encuentro algo, uso <code>for...of</code> con <code>break</code>, o directamente <code>find</code> / <code>some</code>, ' +
             'que cortan solos. Para transformar uso <code>map</code>, para filtrar <code>filter</code>, y para reducir a un valor ' +
             '<code>reduce</code> — cada uno dice qué está pasando sin tener que leer el cuerpo.' },

        { p: '¿Cuándo conviene una tabla de transiciones en vez de condicionales?',
          r: 'Cuando hay varios estados y muchas transiciones posibles. La ventaja es que la tabla <b>hace visible lo que los <code>if</code> ' +
             'esconden</b>: qué transiciones <b>no</b> existen. Mirando la tabla se ve de un vistazo que de "enviado" no se sale y que "pagado" ' +
             'no se cancela. Con condicionales repartidos por el código, esa información no está en ningún lado y hay que reconstruirla leyendo todo.' },
      ],

      practica: `
<h4>Ejercicio 1 — Aplanar una pirámide</h4>
<pre><code>function calcularDescuento(usuario, carrito) {
  if (usuario) {
    if (usuario.activo) {
      if (carrito &amp;&amp; carrito.items.length &gt; 0) {
        if (carrito.total &gt; 5000) {
          if (usuario.esVip) {
            return carrito.total * 0.20;
          } else {
            return carrito.total * 0.10;
          }
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>function calcularDescuento(usuario, carrito) {
  if (!usuario?.activo) return 0;
  if (!carrito?.items.length) return 0;
  if (carrito.total &lt;= 5000) return 0;

  return carrito.total * (usuario.esVip ? 0.20 : 0.10);
}

De 20 líneas y 5 niveles a 5 líneas y 1 nivel.
Y ahora las condiciones de "no aplica" se leen como una lista.</code></pre>
</details>

<h4>Ejercicio 2 — Encontrar el bug del ||</h4>
<pre><code>function armarResumen(config) {
  return {
    limite: config.limite || 100,
    mostrarPrecio: config.mostrarPrecio || true,
    titulo: config.titulo || 'Sin título',
  };
}

armarResumen({ limite: 0, mostrarPrecio: false, titulo: '' });
// ¿Qué devuelve? ¿Qué debería devolver?</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>Devuelve: { limite: 100, mostrarPrecio: true, titulo: 'Sin título' }
Debería:  { limite: 0,   mostrarPrecio: false, titulo: 'Sin título' }

Los tres valores intencionales se pisaron.
El de mostrarPrecio es el peor: || true hace que SIEMPRE sea true,
así que esa opción de configuración no funciona nunca.

Corregido:
return {
  limite: config.limite ?? 100,
  mostrarPrecio: config.mostrarPrecio ?? true,
  titulo: config.titulo || 'Sin título',   // acá SÍ queremos que "" caiga
};</code></pre>
</details>

<h4>Ejercicio 3 — Reemplazar la bandera</h4>
<pre><code>function tieneProductoAgotado(carrito) {
  let hayAgotado = false;
  for (let i = 0; i &lt; carrito.items.length; i++) {
    if (carrito.items[i].stock === 0) {
      hayAgotado = true;
      break;
    }
  }
  return hayAgotado;
}</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>function tieneProductoAgotado(carrito) {
  return carrito.items.some((i) =&gt; i.stock === 0);
}

some ya corta apenas encuentra uno: hace exactamente lo mismo,
en una línea, y dice qué está preguntando.</code></pre>
</details>

<h4>Ejercicio 4 — Máquina de estados</h4>
<pre><code>Escribí una función puedeCancelar(estado) sabiendo que:
  · un pedido en borrador se puede cancelar
  · uno confirmado también
  · uno pagado NO (hay que reembolsar, que es otra cosa)
  · uno enviado NO
  · uno cancelado NO</code></pre>

<details><summary><b>Ver resolución</b></summary>

<pre><code>const CANCELABLES = new Set(['borrador', 'confirmado']);

export function puedeCancelar(estado) {
  return CANCELABLES.has(estado);
}

Con Set en vez de array: la búsqueda es constante y,
más importante, el nombre dice qué representa el conjunto.
Y agregar un estado cancelable es tocar una línea.</code></pre>
</details>
`,

      errores: [
        { mito: 'El anidamiento es inevitable cuando hay muchas condiciones.',
          realidad: 'Casi nunca. Con <b>salida temprana</b>, cada condición nueva es una línea más al principio, no un nivel más — ' +
                    'y la función se lee como una lista de precondiciones.' },

        { mito: '|| y ?? son equivalentes.',
          realidad: '<code>||</code> reemplaza <b>todos los valores falsos</b>: <code>precio || 100</code> convierte un producto gratis en uno de 100, ' +
                    'y <code>opcion || true</code> hace que esa opción sea siempre verdadera.' },

        { mito: 'forEach y for...of son intercambiables.',
          realidad: '<code>forEach</code> <b>no se puede cortar</b>: no admite <code>break</code>. Si necesitás salir apenas encontrás algo, ' +
                    'usá <code>for...of</code>, <code>find</code> o <code>some</code>.' },

        { mito: 'Una bandera booleana en un bucle es la forma normal de buscar.',
          realidad: '<code>some</code> y <code>find</code> ya hacen eso, cortan solos, y <b>dicen qué se está preguntando</b> ' +
                    'sin que haya que leer el cuerpo del bucle.' },
      ],

      glosario: [
        { t: 'Salida temprana', d: 'Descartar los casos que no aplican al principio de la función.' },
        { t: 'Acumulador', d: 'Variable u objeto donde se junta el resultado de recorrer una colección.' },
        { t: '??', d: 'Coalescencia nula: reemplaza solo null y undefined.' },
        { t: '||', d: 'O lógico: reemplaza cualquier valor falso, incluidos 0 y cadena vacía.' },
        { t: '?.', d: 'Acceso seguro: devuelve undefined si algo en la cadena falta.' },
        { t: 'some / find', d: 'Métodos que cortan apenas encuentran lo que buscan.' },
        { t: 'Máquina de estados', d: 'Tabla que declara qué transiciones son válidas.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es la ventaja concreta de la salida temprana además de la legibilidad?',
      opciones: [
        'Agregar una condición nueva es una línea más, no un nivel más de anidamiento',
        'Se ejecuta más rápido',
        'Usa menos memoria',
        'Permite usar menos variables',
      ],
      correcta: 0,
      porQue: 'Por eso el archivo no se degrada con el tiempo: cada condición futura se suma a una lista, en vez de empujar la lógica un nivel más adentro.',
      porQueNo: {
        1: 'La diferencia de rendimiento es despreciable.',
        2: 'El uso de memoria es prácticamente igual.',
        3: 'No cambia la cantidad de variables necesarias.',
      },
    },
    {
      p: '¿Qué devuelve precio || 100 cuando precio es 0?',
      opciones: [
        '100, porque 0 es un valor falso — y así un producto gratis pasa a costar 100',
        '0, porque está definido',
        'undefined',
        'Depende del modo estricto',
      ],
      correcta: 0,
      porQue: 'Es el bug sutil más común con ||. Con ?? solo se reemplazan null y undefined, así que el cero se respeta.',
      porQueNo: {
        1: 'Eso haría ??, no ||.',
        2: 'Devuelve el segundo operando, no undefined.',
        3: 'El comportamiento es el mismo en cualquier modo.',
      },
    },
    {
      p: '¿Cuándo conviene || sobre ??',
      opciones: [
        'Cuando querés tratar todos los valores falsos igual, como una cadena vacía que debe caer al default',
        'Siempre: es más corto',
        'Nunca: ?? lo reemplaza en todos los casos',
        'Solo con números',
      ],
      correcta: 0,
      porQue: 'Para un título, una cadena vacía probablemente deba mostrar "Sin título". Para un precio, un cero es un valor legítimo.',
      porQueNo: {
        1: 'La longitud no es el criterio: cambian el comportamiento.',
        2: 'Hay casos donde tratar "" como ausente es lo correcto.',
        3: 'También aplica a cadenas y booleanos.',
      },
    },
    {
      p: '¿Por qué forEach no siempre puede reemplazar a for...of?',
      opciones: [
        'Porque no admite break: no se puede cortar en el medio',
        'Porque es más lento',
        'Porque no funciona con objetos',
        'Porque no da acceso al índice',
      ],
      correcta: 0,
      porQue: 'Si el objetivo es salir apenas encontrás algo, hay que usar for...of con break, o find y some, que cortan solos.',
      porQueNo: {
        1: 'La diferencia de rendimiento es marginal.',
        2: 'Ninguno de los dos itera objetos directamente sin ayuda.',
        3: 'forEach sí da el índice como segundo parámetro.',
      },
    },
    {
      p: 'Para saber si existe un elemento que cumple una condición, ¿qué usás?',
      opciones: [
        'some, que corta solo y dice qué estás preguntando',
        'Un bucle con una bandera booleana',
        'filter y después length',
        'map y después includes',
      ],
      correcta: 0,
      porQue: 'La bandera funciona pero obliga a leer el cuerpo del bucle para entender qué se busca. filter recorre todo aunque encuentre en el primer elemento.',
      porQueNo: {
        1: 'Es más código y menos expresivo.',
        2: 'Recorre toda la lista sin necesidad.',
        3: 'Crea una lista intermedia sin motivo.',
      },
    },
    {
      p: '¿Qué método usarías para transformar cada elemento de una lista?',
      opciones: [
        'map',
        'reduce',
        'forEach',
        'filter',
      ],
      correcta: 0,
      porQue: 'Cada método dice qué está pasando sin necesidad de leer el cuerpo: map transforma, filter selecciona, reduce colapsa a un valor.',
      porQueNo: {
        1: 'Reduce a un solo valor, no transforma manteniendo la cantidad.',
        2: 'No devuelve nada: sirve para efectos.',
        3: 'Selecciona elementos, no los transforma.',
      },
    },
    {
      p: '¿Cuál es la contra de acumular con reduce sobre un objeto nuevo por iteración?',
      opciones: [
        'Crea un objeto nuevo en cada paso, lo que se nota solo con listas muy grandes',
        'No funciona con objetos',
        'Pierde el orden de los elementos',
        'No permite valor inicial',
      ],
      correcta: 0,
      porQue: 'Es un caso donde la versión más elegante tiene un costo real que solo importa a cierta escala. Saberlo permite elegir a propósito.',
      porQueNo: {
        1: 'Funciona perfectamente con objetos como acumulador.',
        2: 'Recorre en orden.',
        3: 'El valor inicial es el segundo argumento.',
      },
    },
    {
      p: '¿Qué hace visible una tabla de transiciones que los if esconden?',
      opciones: [
        'Qué transiciones NO existen',
        'El rendimiento de cada transición',
        'Quién ejecuta cada transición',
        'El orden temporal de los estados',
      ],
      correcta: 0,
      porQue: 'De un vistazo se ve que de "enviado" no se sale y que "pagado" no se cancela. Con condicionales repartidos, esa información hay que reconstruirla leyendo todo.',
      porQueNo: {
        1: 'La tabla no dice nada sobre rendimiento.',
        2: 'Los permisos son otra dimensión.',
        3: 'Muestra las transiciones válidas, no una secuencia temporal.',
      },
    },
    {
      p: '¿Por qué conviene nombrar las condiciones complejas?',
      opciones: [
        'Porque cada nombre dice qué significa esa parte de la condición',
        'Porque mejora el rendimiento',
        'Porque lo exige el linter',
        'Porque permite reutilizarlas',
      ],
      correcta: 0,
      porQue: 'Un if con cuatro comparaciones encadenadas obliga a decodificar la intención. Con nombres, se lee la regla de negocio directamente.',
      porQueNo: {
        1: 'No hay diferencia de rendimiento apreciable.',
        2: 'Los linters no lo exigen.',
        3: 'A veces sí, pero no es la razón principal.',
      },
    },
    {
      p: 'En puedeCancelar, ¿por qué usar un Set en vez de un array?',
      opciones: [
        'La búsqueda es constante y el nombre del Set declara qué representa el conjunto',
        'Ocupa menos memoria',
        'Mantiene el orden',
        'Permite duplicados',
      ],
      correcta: 0,
      porQue: 'Y agregar un estado cancelable es tocar una línea, sin modificar la lógica de la función.',
      porQueNo: {
        1: 'Suele ocupar algo más que un array chico.',
        2: 'El orden es irrelevante para esta consulta.',
        3: 'El Set justamente no permite duplicados.',
      },
    },
    {
      p: '¿Qué problema tiene mostrarPrecio: config.mostrarPrecio || true?',
      opciones: [
        'Siempre devuelve true: la opción no funciona nunca',
        'Devuelve undefined si falta',
        'Lanza un error con false',
        'Ninguno: es correcto',
      ],
      correcta: 0,
      porQue: 'Si el valor es false, || lo reemplaza por true. La opción de configuración es inútil, y el bug no da ningún error.',
      porQueNo: {
        1: 'Nunca devuelve undefined: siempre cae al segundo operando o al primero verdadero.',
        2: 'No lanza error: silenciosamente devuelve true.',
        3: 'Es exactamente el caso donde || falla.',
      },
    },
    {
      p: '¿Qué hace usuario?.direccion?.ciudad si usuario existe pero no tiene dirección?',
      opciones: [
        'Devuelve undefined sin lanzar error',
        'Lanza TypeError',
        'Devuelve null',
        'Devuelve una cadena vacía',
      ],
      correcta: 0,
      porQue: 'El acceso seguro corta la cadena apenas encuentra null o undefined, y devuelve undefined en vez de fallar.',
      porQueNo: {
        1: 'Eso ocurriría sin el operador de acceso seguro.',
        2: 'Devuelve undefined, no null.',
        3: 'No convierte a cadena.',
      },
    },
    {
      p: 'Al aplanar una función con muchos else, ¿qué se busca?',
      opciones: [
        'Que las condiciones de "no aplica" se lean como una lista al principio',
        'Que haya menos líneas totales',
        'Que se use el operador ternario',
        'Que todas las ramas devuelvan el mismo tipo',
      ],
      correcta: 0,
      porQue: 'La reducción de líneas es una consecuencia, no el objetivo: lo que se busca es que lo importante quede a un nivel de indentación.',
      porQueNo: {
        1: 'Es un efecto, no el criterio.',
        2: 'El ternario ayuda en casos chicos, no es el objetivo.',
        3: 'Es buena práctica, pero es otro tema.',
      },
    },
    {
      p: '¿Qué método NO corta apenas encuentra lo que busca?',
      opciones: [
        'filter',
        'find',
        'some',
        'every',
      ],
      correcta: 0,
      porQue: 'filter recorre toda la lista porque necesita devolver todos los que cumplen. find, some y every cortan en cuanto pueden decidir.',
      porQueNo: {
        1: 'Corta apenas encuentra el primer elemento que cumple.',
        2: 'Corta apenas encuentra uno que cumple.',
        3: 'Corta apenas encuentra uno que NO cumple.',
      },
    },
    {
      p: '¿Cuándo conviene reemplazar condicionales por una máquina de estados?',
      opciones: [
        'Cuando hay varios estados con muchas transiciones posibles entre ellos',
        'Siempre que haya más de un if',
        'Cuando el código tiene más de 100 líneas',
        'Cuando hay que validar entradas',
      ],
      correcta: 0,
      porQue: 'Con pocos estados y transiciones, la tabla es ceremonia. Con muchos, hace visible qué transiciones no existen, que es lo que los condicionales esconden.',
      porQueNo: {
        1: 'Para dos condiciones simples es complejidad innecesaria.',
        2: 'El tamaño no es el criterio.',
        3: 'La validación es otro problema.',
      },
    },
  ],
});
