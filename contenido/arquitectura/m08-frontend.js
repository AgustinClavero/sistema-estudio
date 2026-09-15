/* ==========================================================================
   Arquitectura · Módulo 08 — Arquitectura frontend
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'arquitectura',
  id: 'm08',
  titulo: 'Arquitectura frontend',
  fuentes: ['react', 'nextjs', 'web-dev-cache'],

  intro:
    '<p>El frontend es donde la arquitectura se degrada más rápido, porque los cambios son constantes, visibles y ' +
    'siempre urgentes. Un componente de 200 líneas se convierte en uno de 900 sin que nadie tome una decisión.</p>' +
    '<p>Este módulo va sobre las cuatro cosas que lo mantienen sano: <b>dónde vive cada archivo</b>, <b>dónde vive ' +
    'cada estado</b>, <b>qué corre en el servidor y qué en el navegador</b>, y <b>cómo se componen los ' +
    'componentes</b> para que no crezcan sin control.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Organizar por funcionalidad, con presupuesto',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> organizá por <b>lo que hace</b>, no por
<b>qué tipo de archivo es</b>. Y ponele un presupuesto de tamaño a los archivos, para que crecer sea una
decisión y no un accidente.</div>

<h4>Por tipo técnico: el default que no escala</h4>
<pre><code>src/
  components/    PedidoLista.tsx  ClienteForm.tsx  FacturaPdf.tsx  … (60 archivos)
  hooks/         usePedidos.ts    useClientes.ts   … (25 archivos)
  services/      pedidos.ts       clientes.ts      …
  types/         index.ts         ← 900 líneas de todo mezclado
  utils/         index.ts         ← el cajón</code></pre>

<p>Funciona con veinte archivos. Con doscientos, tocar "pedidos" implica abrir cinco carpetas, y nadie sabe
qué se rompe si borra algo.</p>

<h4>Por funcionalidad</h4>
<pre><code>src/
  funcionalidades/
    pedidos/
      componentes/
      hooks/
      servicio.ts
      reglas.ts
      esquemas.ts
      tipos.ts
      index.ts        ← la puerta de adelante
    clientes/
    facturacion/
  compartido/
    ui/               botones, campos, modales — sin lógica de negocio
    utilidades/
    configuracion/</code></pre>

<div class="aviso"><strong>La ventaja concreta no es estética: es que <b>podés borrar una funcionalidad
entera</b>.</strong> Si el producto deja de tener facturación, borrás la carpeta y arreglás lo que rompa. Con
organización por tipo, esos archivos están repartidos entre otros sesenta y nadie se anima a tocarlos — así que
el código muerto se acumula para siempre.</div>

<h4>El presupuesto de tamaño</h4>
<pre><code>Componente     &gt; 300 líneas  →  extraer lógica a un hook
Archivo        &gt; 500 líneas  →  mirar por qué
page.tsx       &gt; 100 líneas  →  está haciendo demasiado: componer
Hook           &gt; 150 líneas  →  probablemente hace dos cosas
Props          &gt; 8           →  el componente tiene varias responsabilidades</code></pre>

<p>No son reglas: son <b>umbrales para mirar</b>. Pasarse con una razón clara está bien; pasarse sin darse
cuenta es cómo se llega a un componente de 900 líneas.</p>
`,

      tecnico: `
<h4>Qué va en cada archivo de una funcionalidad</h4>
<table>
<tr><th>Archivo</th><th>Contiene</th><th>Se prueba</th></tr>
<tr><td><code>reglas.ts</code></td><td>Lógica pura: cálculos, validaciones de negocio</td><td>Directo, sin nada montado</td></tr>
<tr><td><code>esquemas.ts</code></td><td>Zod. Compartido entre cliente y servidor</td><td>Con casos límite</td></tr>
<tr><td><code>servicio.ts</code></td><td>Consultas y mutaciones. <code>server-only</code></td><td>Integración</td></tr>
<tr><td><code>hooks/</code></td><td>Estado y efectos de la interfaz</td><td>Con una librería de testing</td></tr>
<tr><td><code>componentes/</code></td><td>Presentación</td><td>Visual o de interacción</td></tr>
<tr><td><code>index.ts</code></td><td>Lo público de la funcionalidad</td><td>—</td></tr>
</table>

<div class="dato"><strong><code>reglas.ts</code> es el archivo que más rinde y el que menos se crea.</strong>
Sacar los cálculos y las validaciones de negocio del componente los vuelve verificables en tests de tres
líneas, sin montar nada. Y como efecto secundario, esas reglas <b>dejan de duplicarse</b>: si el cálculo del
total está en el componente, la Server Action va a tener su propia copia.</div>

<h4>Hacer que la puerta se respete</h4>
<pre><code>// eslint.config.js
{
  files: ['src/funcionalidades/*/**'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['@/funcionalidades/*/*'],
        message: 'Importá desde el index de la funcionalidad, no de sus archivos internos.',
      }],
    }],
  },
}</code></pre>

<h4>El componente que creció: cómo se parte</h4>
<pre><code>// Antes: 640 líneas
export function PanelPedidos() {
  // 80 líneas de estado
  // 120 líneas de efectos y llamadas
  // 90 líneas de cálculos
  // 350 líneas de JSX
}

// Después
// hooks/usePedidosFiltrados.ts   ← estado + efectos
// reglas.ts                       ← los cálculos, puros
// componentes/FiltrosPedidos.tsx
// componentes/TablaPedidos.tsx
// componentes/ResumenPedidos.tsx
// PanelPedidos.tsx                ← 60 líneas que componen</code></pre>

<div class="dato"><strong>El orden de extracción importa: primero los <b>cálculos</b>, después el
<b>estado</b>, y al final el JSX.</strong> Los cálculos son puros y se mueven sin riesgo; el estado requiere
más cuidado; y partir el JSX sin haber sacado lo anterior produce componentes que reciben quince props ' +
—o sea, el mismo enredo repartido en más archivos.</div>

<h4>La carpeta compartida, sin que se convierta en un cajón</h4>
<pre><code>compartido/
  ui/            componentes sin lógica de negocio: Boton, Campo, Modal
  utilidades/    funciones puras genéricas: formatearFecha, agrupar
  configuracion/ constantes, entorno validado
  tipos/         solo primitivos: Resultado&lt;T&gt;, Paginado&lt;T&gt;</code></pre>

<p>La regla: <b>si menciona un concepto del negocio, no va en compartido</b>. Un <code>Boton</code> va;
un <code>SelectorDeEstadoDePedido</code>, no — ese pertenece a la funcionalidad de pedidos.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="#f87171" font-size="12" font-weight="700">
    POR TIPO TÉCNICO — lo de “pedidos” repartido en cinco carpetas</text>

  <rect x="24" y="34" width="112" height="70" rx="8" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="80" y="52" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9">components/</text>
  <rect x="34" y="60" width="92" height="10" rx="2" fill="#22d3ee" fill-opacity=".5"/>
  <rect x="34" y="74" width="92" height="10" rx="2" fill="currentColor" fill-opacity=".15"/>
  <rect x="34" y="88" width="92" height="10" rx="2" fill="currentColor" fill-opacity=".15"/>

  <rect x="144" y="34" width="112" height="70" rx="8" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="200" y="52" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9">hooks/</text>
  <rect x="154" y="60" width="92" height="10" rx="2" fill="#22d3ee" fill-opacity=".5"/>
  <rect x="154" y="74" width="92" height="10" rx="2" fill="currentColor" fill-opacity=".15"/>

  <rect x="264" y="34" width="112" height="70" rx="8" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="320" y="52" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9">services/</text>
  <rect x="274" y="60" width="92" height="10" rx="2" fill="#22d3ee" fill-opacity=".5"/>

  <rect x="384" y="34" width="112" height="70" rx="8" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="440" y="52" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9">types/</text>
  <rect x="394" y="60" width="92" height="10" rx="2" fill="#22d3ee" fill-opacity=".5"/>

  <rect x="504" y="34" width="112" height="70" rx="8" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="560" y="52" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9">utils/</text>
  <rect x="514" y="60" width="92" height="10" rx="2" fill="#22d3ee" fill-opacity=".5"/>

  <text x="24" y="122" fill="#22d3ee" font-size="10" font-weight="700">■ = archivos de “pedidos”</text>
  <text x="200" y="122" fill="#f87171" font-size="10" font-weight="700">→ tocar pedidos = abrir cinco carpetas</text>

  <line x1="24" y1="140" x2="656" y2="140" stroke="currentColor" opacity=".18"/>

  <text x="24" y="164" fill="#34d399" font-size="12" font-weight="700">
    POR FUNCIONALIDAD — todo junto, con una puerta</text>

  <rect x="24" y="176" width="200" height="94" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="124" y="196" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">pedidos/</text>
  <text x="44" y="214" fill="currentColor" opacity=".65" font-size="9">componentes/ · hooks/</text>
  <text x="44" y="230" fill="#34d399" font-size="9" font-weight="700">reglas.ts ← el que más rinde</text>
  <text x="44" y="246" fill="currentColor" opacity=".65" font-size="9">servicio.ts · esquemas.ts</text>
  <rect x="44" y="252" width="160" height="12" rx="3" fill="#22d3ee" fill-opacity=".3"/>
  <text x="124" y="262" text-anchor="middle" fill="#22d3ee" font-size="8" font-weight="700">index.ts</text>

  <rect x="240" y="176" width="200" height="94" rx="10" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="196" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">clientes/</text>
  <text x="340" y="222" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">la misma estructura</text>
  <rect x="260" y="252" width="160" height="12" rx="3" fill="#fbbf24" fill-opacity=".3"/>
  <text x="340" y="262" text-anchor="middle" fill="#3d2c05" font-size="8" font-weight="700">index.ts</text>

  <rect x="456" y="176" width="200" height="94" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="556" y="196" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">compartido/</text>
  <text x="556" y="216" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">ui · utilidades · configuración</text>
  <text x="556" y="240" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">si menciona un concepto</text>
  <text x="556" y="252" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">del negocio, NO va acá</text>

  <rect x="24" y="284" width="632" height="30" rx="8" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.5"/>
  <text x="340" y="304" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">
    La ventaja concreta: podés BORRAR una funcionalidad entera. Con la otra estructura, el código muerto se acumula para siempre.</text>

  <rect x="24" y="326" width="632" height="60" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="346" fill="#fbbf24" font-size="11.5" font-weight="700">EL PRESUPUESTO DE TAMAÑO — umbrales para MIRAR, no reglas</text>
  <text x="44" y="366" fill="currentColor" opacity=".75" font-size="10.5">
    componente &gt; 300 · archivo &gt; 500 · page.tsx &gt; 100 · hook &gt; 150 · props &gt; 8</text>
  <text x="44" y="381" fill="currentColor" opacity=".65" font-size="10.5">
    Pasarse con una razón clara está bien. Pasarse sin darse cuenta es cómo se llega a un componente de 900 líneas.</text>
</svg>`,
        pie: 'Primero los cálculos, después el estado, y al final el JSX. Al revés produce componentes con quince props.',
      },

      entrevista: [
        { p: '¿Por qué organizar por funcionalidad y no por tipo técnico?',
          r: 'Porque por tipo técnico, lo de una misma funcionalidad queda repartido en cinco carpetas: tocar "pedidos" implica abrirlas todas. ' +
             'Pero la ventaja concreta no es estética: es que <b>podés borrar una funcionalidad entera</b>. Si el producto deja de tener facturación, ' +
             'borrás la carpeta y arreglás lo que rompa. Con organización por tipo, esos archivos están mezclados entre otros sesenta y nadie se anima ' +
             'a tocarlos — así que el código muerto se acumula para siempre.' },

        { p: '¿Qué archivo de una funcionalidad rinde más y se crea menos?',
          r: '<code>reglas.ts</code>: la lógica pura, sin React ni base de datos. Sacar los cálculos y las validaciones de negocio del componente los ' +
             'vuelve verificables en tests de tres líneas, sin montar nada. Y hay un efecto secundario importante: ' +
             'esas reglas <b>dejan de duplicarse</b>. Si el cálculo del total vive dentro del componente, la Server Action va a terminar teniendo ' +
             'su propia copia — y las dos se van a desincronizar.' },

        { p: '¿Cómo partís un componente que creció demasiado?',
          r: 'En un orden que importa: primero los <b>cálculos</b>, después el <b>estado</b>, y al final el JSX. ' +
             'Los cálculos son puros y se mueven sin riesgo; el estado requiere más cuidado; y <b>partir el JSX sin haber sacado lo anterior produce ' +
             'componentes que reciben quince props</b> — o sea, el mismo enredo repartido en más archivos, que es peor que el original ' +
             'porque ahora hay que saltar entre ellos.' },

        { p: '¿Qué regla evita que la carpeta compartida se convierta en un cajón?',
          r: 'Que <b>si menciona un concepto del negocio, no va en compartido</b>. Un <code>Boton</code> o un <code>Campo</code> van; ' +
             'un <code>SelectorDeEstadoDePedido</code> no — ese pertenece a la funcionalidad de pedidos aunque se use en dos pantallas. ' +
             'Sin esa regla, <code>compartido</code> se convierte en el módulo del que todo depende y que nadie entiende, ' +
             'que es exactamente el problema de la carpeta <code>utils</code>.' },
      ],

      practica: `
<h4>Estructura de una funcionalidad</h4>
<pre><code>funcionalidades/pedidos/
  componentes/
    TablaPedidos.tsx
    FiltrosPedidos.tsx
    FormularioPedido.tsx
  hooks/
    usePedidosFiltrados.ts
  reglas.ts          calcularTotal, puedeConfirmarse, estadoSiguiente
  esquemas.ts        EsquemaNuevoPedido (compartido cliente/servidor)
  servicio.ts        'server-only': consultas y mutaciones
  acciones.ts        'use server'
  tipos.ts
  tipos-publicos.ts  lo que ven otras funcionalidades
  index.ts</code></pre>

<h4>Reglas puras, y su test</h4>
<pre><code>// reglas.ts — sin React, sin base, sin nada
export function calcularTotal(items: Item[], descuento?: Descuento): Centavos {
  const bruto = items.reduce((a, i) =&gt; a + i.precioCentavos * i.cantidad, 0);
  if (!descuento) return bruto;
  return descuento.tipo === 'porcentaje'
    ? Math.round(bruto * (1 - descuento.valor / 100))
    : Math.max(0, bruto - descuento.valor);
}

// El test no necesita nada montado
test('el descuento fijo no deja el total negativo', () =&gt; {
  expect(calcularTotal([item(1000)], { tipo: 'fijo', valor: 5000 })).toBe(0);
});</code></pre>

<div class="aviso"><strong>Ese <code>Math.max(0, …)</code> es una regla de negocio.</strong> Si vive dentro del
componente, la Server Action que valida el pedido no la tiene — y un pedido con descuento grande puede quedar
con total negativo en la base. Es exactamente el tipo de bug que la separación evita.</div>

<h4>Extraer un hook del componente</h4>
<pre><code>// hooks/usePedidosFiltrados.ts
export function usePedidosFiltrados(pedidosIniciales: Pedido[]) {
  const [estado, setEstado] = useState&lt;EstadoPedido | 'todos'&gt;('todos');
  const [busqueda, setBusqueda] = useState('');

  const filtrados = useMemo(
    () =&gt; filtrarPedidos(pedidosIniciales, { estado, busqueda }),  // ← regla pura
    [pedidosIniciales, estado, busqueda],
  );

  return { filtrados, estado, setEstado, busqueda, setBusqueda };
}</code></pre>

<h4>Auditar el tamaño</h4>
<pre><code># Los archivos más grandes: candidatos a mirar
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -rn | head -20

# Componentes por encima del presupuesto
find src -name "*.tsx" -exec sh -c \\
  'n=$(wc -l &lt; "$1"); [ "$n" -gt 300 ] &amp;&amp; echo "$n $1"' _ {} \\;</code></pre>

<h4>Checklist</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Organizado por funcionalidad, no por tipo técnico</td></tr>
<tr><td>☐</td><td>Cada funcionalidad tiene <code>index.ts</code></td></tr>
<tr><td>☐</td><td>La regla de importación está verificada por ESLint</td></tr>
<tr><td>☐</td><td>Existe <code>reglas.ts</code> con lógica pura y tests</td></tr>
<tr><td>☐</td><td>Nada en <code>compartido</code> menciona el negocio</td></tr>
<tr><td>☐</td><td>Ningún componente supera 300 líneas sin motivo</td></tr>
<tr><td>☐</td><td><code>page.tsx</code> compone y no contiene lógica</td></tr>
</table>
`,

      errores: [
        { mito: 'Organizar por tipo técnico es más ordenado.',
          realidad: 'Parece prolijo y deja lo de una funcionalidad <b>repartido en cinco carpetas</b>. Y sobre todo: no podés borrar una funcionalidad ' +
                    'entera, así que el código muerto se acumula para siempre.' },

        { mito: 'Los cálculos pueden quedar en el componente.',
          realidad: 'Ahí no se pueden probar sin montar nada, y sobre todo <b>se duplican</b>: la Server Action va a tener su propia copia del cálculo, ' +
                    'y las dos se van a desincronizar.' },

        { mito: 'Parto el componente grande en cinco componentes chicos.',
          realidad: 'Si no sacaste antes los cálculos y el estado, quedan componentes que reciben <b>quince props</b>: el mismo enredo repartido, ' +
                    'y ahora hay que saltar entre archivos para entenderlo.' },

        { mito: 'Lo que se usa en dos pantallas va en compartido.',
          realidad: 'Solo si <b>no menciona un concepto del negocio</b>. Un selector de estado de pedido pertenece a pedidos aunque se use en dos ' +
                    'lugares — si no, <code>compartido</code> se convierte en el cajón del que todo depende.' },
      ],

      glosario: [
        { t: 'Organización por funcionalidad', d: 'Agrupar por lo que hace el código, no por su tipo de archivo.' },
        { t: 'Puerta de adelante', d: 'Índice que define qué es público de una funcionalidad.' },
        { t: 'reglas.ts', d: 'Lógica pura de negocio, sin dependencias. El archivo que más rinde.' },
        { t: 'Presupuesto de tamaño', d: 'Umbral de líneas que dispara una revisión, no una regla.' },
        { t: 'Compartido', d: 'Código genérico sin conceptos del negocio.' },
        { t: 'Extracción ordenada', d: 'Sacar cálculos, después estado, y al final el JSX.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Estado: los cuatro tipos y dónde vive cada uno',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> casi todos los problemas de estado vienen de
tratar <b>datos del servidor</b> como si fueran <b>estado de la aplicación</b>.</div>

<h4>Los cuatro tipos</h4>
<table>
<tr><th>Tipo</th><th>Qué es</th><th>Dónde vive</th></tr>
<tr><td><b>Del servidor</b></td><td>Datos que vienen de la base</td><td>Componente de servidor, o una librería de datos</td></tr>
<tr><td><b>De la URL</b></td><td>Filtros, página, pestaña activa</td><td><b>En la URL</b></td></tr>
<tr><td><b>Local</b></td><td>Un modal abierto, un texto que se escribe</td><td><code>useState</code></td></tr>
<tr><td><b>Global de cliente</b></td><td>Tema, idioma, carrito sin sesión</td><td>Contexto o un store chico</td></tr>
</table>

<div class="aviso"><strong>El error que más problemas causa es el primero:</strong> copiar los datos del
servidor a un <code>useState</code> y mantenerlos con efectos. A partir de ahí tenés <b>dos copias de la
verdad</b> que hay que sincronizar a mano, y aparecen los bugs de "actualicé y no se ve", "se ve viejo después
de volver", y "dos pestañas muestran cosas distintas".</div>

<h4>El estado de la URL, que casi nadie usa</h4>
<p>Filtros, ordenamiento, página y pestaña activa <b>deberían estar en la URL</b>. Es gratis y resuelve cuatro
cosas de una:</p>
<ul>
<li>El usuario puede <b>compartir el enlace</b> con el filtro aplicado.</li>
<li>El botón de atrás funciona como se espera.</li>
<li>Recargar no pierde el estado.</li>
<li>No hay estado que sincronizar.</li>
</ul>

<div class="dato"><strong>Y hay una razón menos obvia: hace el soporte muchísimo más fácil.</strong> Cuando un
usuario reporta "el listado muestra mal los datos", con el estado en la URL <b>te manda el enlace</b> y ves
exactamente lo mismo que él. Con el estado en memoria, la conversación empieza con "¿qué filtros tenías
puestos?".</p></div>

<h4>La pregunta que ordena todo</h4>
<pre><code>¿Este dato existe en el servidor?
   Sí → no lo copies a useState. Pedilo, y revalidá al cambiarlo.

¿Alguien querría compartir esta vista por enlace?
   Sí → va en la URL.

¿Lo necesita más de un componente lejano?
   No → useState. Sí → contexto, y solo si es realmente global.</code></pre>
`,

      tecnico: `
<h4>El antipatrón, y su costo</h4>
<pre><code>// ❌ Datos del servidor copiados a estado local
function Lista() {
  const [pedidos, setPedidos] = useState&lt;Pedido[]&gt;([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState&lt;Error | null&gt;(null);

  useEffect(() =&gt; {
    let cancelado = false;
    traerPedidos()
      .then((d) =&gt; { if (!cancelado) setPedidos(d); })
      .catch((e) =&gt; { if (!cancelado) setError(e); })
      .finally(() =&gt; { if (!cancelado) setCargando(false); });
    return () =&gt; { cancelado = true; };
  }, []);
  …
}</code></pre>

<div class="dato"><strong>Ese <code>cancelado</code> es la señal de que estás reimplementando una librería de
datos.</strong> Y todavía faltan: deduplicar peticiones simultáneas, revalidar al volver a la pestaña, ' +
reintentar ante error, invalidar tras una mutación y compartir el resultado entre componentes. ' +
<b>Cada una de esas cosas es un bug esperando</b>, y todas están resueltas en un componente de servidor o en
una librería de datos.</div>

<h4>Componente de servidor: la versión sin estado</h4>
<pre><code>// Sin useState, sin useEffect, sin estados de carga
export default async function PaginaPedidos({ searchParams }) {
  const tenant = await requireTenantContext();
  const pedidos = await pedidosDelTenant(tenant.id, {
    estado: searchParams.estado,      // ← el filtro viene de la URL
    pagina: Number(searchParams.pagina ?? 1),
  });

  return &lt;TablaPedidos pedidos={pedidos} /&gt;;
}</code></pre>

<h4>Estado en la URL, bien hecho</h4>
<pre><code>'use client';
export function Filtros() {
  const router = useRouter();
  const params = useSearchParams();
  const ruta = usePathname();

  function cambiar(clave: string, valor: string | null) {
    const p = new URLSearchParams(params);
    if (valor) p.set(clave, valor); else p.delete(clave);
    p.delete('pagina');                       // ← al filtrar, volver a la 1
    router.push(&#96;\${ruta}?\${p}&#96;);
  }

  return (
    &lt;select value={params.get('estado') ?? 'todos'} onChange={(e) =&gt; cambiar('estado', e.target.value)}&gt;
      …
    &lt;/select&gt;
  );
}</code></pre>

<div class="dato"><strong>El <code>p.delete('pagina')</code> es el detalle que se olvida siempre.</strong> Si
el usuario está en la página 5 y cambia el filtro, sin esa línea queda en la página 5 de un resultado que
quizás tiene dos — y ve una lista vacía sin entender por qué.</div>

<h4>Contexto: cuándo sí</h4>
<table>
<tr><th>Situación</th><th>Solución</th></tr>
<tr><td>Tema claro/oscuro</td><td>Contexto ✔</td></tr>
<tr><td>Idioma</td><td>Contexto ✔</td></tr>
<tr><td>Usuario de la sesión</td><td>Contexto ✔ (o del servidor)</td></tr>
<tr><td>Lista de pedidos</td><td>✘ Es del servidor</td></tr>
<tr><td>Formulario de tres pasos</td><td>✘ Estado local del contenedor</td></tr>
<tr><td>Filtros de una tabla</td><td>✘ Van en la URL</td></tr>
</table>

<div class="dato"><strong>El costo del contexto es que <b>todo lo que lo consume se vuelve a renderizar</b>
cuando cambia.</strong> Un contexto con muchos valores que cambian seguido produce renderizados en cascada por
toda la aplicación. Si tenés que ponerlo, dividilo: uno para lo que casi nunca cambia y otro para lo que sí.</div>

<h4>El efecto que no hace falta</h4>
<pre><code>// ❌ Un efecto para calcular algo derivado
const [total, setTotal] = useState(0);
useEffect(() =&gt; { setTotal(items.reduce((a, i) =&gt; a + i.precio, 0)); }, [items]);

// ✔ Simplemente calcularlo
const total = items.reduce((a, i) =&gt; a + i.precio, 0);</code></pre>
<p>Si un valor se puede derivar de otros, <b>no es estado</b>. Guardarlo en <code>useState</code> crea una
segunda fuente de verdad que puede desincronizarse, y agrega un renderizado extra.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS CUATRO TIPOS DE ESTADO — y dónde vive cada uno</text>

  <rect x="24" y="34" width="152" height="88" rx="10" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.5"/>
  <text x="100" y="54" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">DEL SERVIDOR</text>
  <text x="100" y="74" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">datos de la base</text>
  <text x="100" y="94" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">componente de servidor</text>
  <text x="100" y="110" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">NUNCA en useState</text>

  <rect x="188" y="34" width="152" height="88" rx="10" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.5"/>
  <text x="264" y="54" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">DE LA URL</text>
  <text x="264" y="74" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">filtros · página · pestaña</text>
  <text x="264" y="94" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-weight="700">searchParams</text>
  <text x="264" y="110" text-anchor="middle" fill="#22d3ee" font-size="9" font-weight="700">el que casi nadie usa</text>

  <rect x="352" y="34" width="152" height="88" rx="10" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="428" y="54" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">LOCAL</text>
  <text x="428" y="74" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">modal abierto · texto</text>
  <text x="428" y="94" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">useState</text>

  <rect x="516" y="34" width="140" height="88" rx="10" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="586" y="54" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">GLOBAL</text>
  <text x="586" y="74" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">tema · idioma</text>
  <text x="586" y="94" text-anchor="middle" fill="#7c5cff" font-size="9.5" font-weight="700">contexto</text>
  <text x="586" y="110" text-anchor="middle" fill="#f87171" font-size="8.5" font-weight="700">re-renderiza a todos</text>

  <rect x="24" y="134" width="632" height="46" rx="9" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="44" y="154" fill="#f87171" font-size="12" font-weight="700">EL ERROR QUE MÁS PROBLEMAS CAUSA</text>
  <text x="44" y="172" fill="currentColor" opacity=".78" font-size="11">
    Copiar datos del servidor a <tspan font-family="monospace" font-weight="700">useState</tspan>: quedan DOS copias de la verdad que hay que sincronizar a mano.</text>

  <rect x="24" y="190" width="632" height="46" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="208" fill="currentColor" opacity=".72" font-size="10.5">De ahí salen: “actualicé y no se ve” · “se ve viejo al volver” · “dos pestañas muestran cosas distintas”</text>
  <text x="44" y="228" fill="#f87171" font-size="10.5" font-weight="700">Y si tu efecto tiene una bandera “cancelado”, ya estás reimplementando una librería de datos.</text>

  <text x="24" y="264" fill="#22d3ee" font-size="12" font-weight="700">
    EL ESTADO EN LA URL RESUELVE CUATRO COSAS DE UNA</text>

  <rect x="24" y="276" width="152" height="46" rx="8" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="100" y="303" text-anchor="middle" fill="currentColor" opacity=".72" font-size="9.5">compartir el enlace</text>
  <rect x="188" y="276" width="152" height="46" rx="8" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="264" y="303" text-anchor="middle" fill="currentColor" opacity=".72" font-size="9.5">botón atrás funciona</text>
  <rect x="352" y="276" width="152" height="46" rx="8" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="428" y="303" text-anchor="middle" fill="currentColor" opacity=".72" font-size="9.5">recargar no pierde nada</text>
  <rect x="516" y="276" width="140" height="46" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.5"/>
  <text x="586" y="297" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">SOPORTE:</text>
  <text x="586" y="311" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">te manda el enlace</text>

  <rect x="24" y="338" width="632" height="48" rx="9" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="358" fill="#fbbf24" font-size="11.5" font-weight="700">SI SE PUEDE DERIVAR DE OTROS VALORES, NO ES ESTADO.</text>
  <text x="44" y="376" fill="currentColor" opacity=".75" font-size="11">
    Guardarlo en <tspan font-family="monospace">useState</tspan> con un efecto crea una segunda fuente de verdad que puede desincronizarse — y agrega un renderizado extra.</text>
</svg>`,
        pie: 'Casi todos los problemas de estado vienen de tratar datos del servidor como estado de la aplicación.',
      },

      entrevista: [
        { p: '¿Cuáles son los cuatro tipos de estado y dónde vive cada uno?',
          r: '<b>Del servidor</b>: datos de la base, que van en un componente de servidor o en una librería de datos — <b>nunca copiados a ' +
             '<code>useState</code></b>. <b>De la URL</b>: filtros, página, pestaña activa. <b>Local</b>: un modal abierto, un texto que se escribe, ' +
             'con <code>useState</code>. Y <b>global de cliente</b>: tema, idioma, con contexto. ' +
             'Casi todos los problemas vienen de mezclar el primero con el tercero.' },

        { p: '¿Qué problema causa copiar datos del servidor a useState?',
          r: 'Que quedan <b>dos copias de la verdad</b> que hay que sincronizar a mano. De ahí salen los bugs clásicos: "actualicé y no se ve", ' +
             '"se ve viejo después de volver", "dos pestañas muestran cosas distintas". ' +
             'Y hay una señal muy concreta de que estás en ese camino: <b>si tu efecto tiene una bandera <code>cancelado</code></b>, ' +
             'ya estás reimplementando una librería de datos — y todavía te faltan deduplicar peticiones, revalidar al volver, reintentar e invalidar ' +
             'tras una mutación.' },

        { p: '¿Por qué conviene poner los filtros en la URL?',
          r: 'Resuelve cuatro cosas de una: se puede compartir el enlace con el filtro aplicado, el botón de atrás funciona como se espera, recargar no ' +
             'pierde nada, y no hay estado que sincronizar. Y hay una razón menos obvia que en la práctica pesa mucho: ' +
             '<b>hace el soporte muchísimo más fácil</b>. Cuando alguien reporta "el listado muestra mal los datos", te manda el enlace y ves ' +
             'exactamente lo mismo que él, en vez de empezar por "¿qué filtros tenías puestos?".' },

        { p: '¿Cuándo NO usarías un contexto?',
          r: 'Para datos del servidor, para formularios de varios pasos y para filtros de tabla — esos van en el servidor, en estado local del ' +
             'contenedor y en la URL respectivamente. El contexto tiene un costo concreto: <b>todo lo que lo consume se vuelve a renderizar</b> ' +
             'cuando cambia, así que un contexto con muchos valores que cambian seguido produce renderizados en cascada. ' +
             'Si hace falta, conviene dividirlo: uno para lo que casi nunca cambia y otro para lo que sí.' },
      ],

      practica: `
<h4>La misma pantalla, sin estado copiado</h4>
<pre><code>// app/pedidos/page.tsx — componente de servidor
export default async function Pagina({ searchParams }: { searchParams: Params }) {
  const tenant = await requireTenantContext();
  const { pedidos, total } = await listarPedidos(tenant.id, {
    estado: searchParams.estado as EstadoPedido | undefined,
    busqueda: searchParams.q,
    pagina: Number(searchParams.pagina ?? 1),
  });

  return (
    &lt;&gt;
      &lt;Filtros /&gt;                       {/* cliente: escribe en la URL */}
      &lt;TablaPedidos pedidos={pedidos} /&gt; {/* servidor: solo presenta */}
      &lt;Paginacion total={total} /&gt;
    &lt;/&gt;
  );
}</code></pre>

<div class="aviso"><strong>No hay <code>useState</code>, ni <code>useEffect</code>, ni estados de carga, ni
manejo de errores duplicado.</strong> El filtro cambia la URL, la URL cambia la petición, y la petición
devuelve la página nueva. <b>Una sola fuente de verdad, sin sincronización.</b></div>

<h4>Escribir en la URL, con los detalles</h4>
<pre><code>'use client';
export function Filtros() {
  const router = useRouter();
  const params = useSearchParams();
  const ruta = usePathname();
  const [pendiente, iniciar] = useTransition();

  function cambiar(clave: string, valor: string | null) {
    const p = new URLSearchParams(params);
    valor ? p.set(clave, valor) : p.delete(clave);
    p.delete('pagina');                              // ← volver a la página 1
    iniciar(() =&gt; router.push(&#96;\${ruta}?\${p}&#96;));      // ← sin bloquear la UI
  }

  return (
    &lt;div data-pendiente={pendiente}&gt;
      &lt;select value={params.get('estado') ?? ''} onChange={(e) =&gt; cambiar('estado', e.target.value || null)}&gt;
        &lt;option value=""&gt;Todos&lt;/option&gt;
        &lt;option value="pendiente"&gt;Pendientes&lt;/option&gt;
      &lt;/select&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h4>Búsqueda con espera, sin perder escritura</h4>
<pre><code>const [texto, setTexto] = useState(params.get('q') ?? '');   // local: lo que se escribe

useEffect(() =&gt; {
  const t = setTimeout(() =&gt; {
    if (texto !== (params.get('q') ?? '')) cambiar('q', texto || null);
  }, 300);
  return () =&gt; clearTimeout(t);
}, [texto]);</code></pre>

<div class="dato"><strong>Este es el caso donde <b>sí</b> hace falta estado local junto con el de la URL:</strong>
el campo tiene que responder a cada tecla, pero no queremos navegar en cada una. El estado local es
<b>lo que se está escribiendo</b>; la URL es <b>lo que se está filtrando</b>. Son dos cosas distintas y por eso
no es duplicación.</div>

<h4>Diagnóstico</h4>
<table>
<tr><th>Síntoma</th><th>Causa</th></tr>
<tr><td>"Actualicé y no se ve"</td><td>Datos del servidor en estado local, sin invalidar</td></tr>
<tr><td>Filtros que se pierden al volver</td><td>Estado que debería estar en la URL</td></tr>
<tr><td>Renderizados en cascada</td><td>Un contexto con valores que cambian seguido</td></tr>
<tr><td>Efecto con bandera <code>cancelado</code></td><td>Estás reimplementando una librería de datos</td></tr>
<tr><td>Un efecto que solo hace <code>setState</code></td><td>Ese valor es derivado: calculalo</td></tr>
</table>
`,

      errores: [
        { mito: 'Traigo los datos con useEffect y los guardo en useState.',
          realidad: 'Quedan <b>dos copias de la verdad</b> y hay que sincronizarlas a mano. Un componente de servidor o una librería de datos ya ' +
                    'resuelven deduplicación, revalidación, reintentos e invalidación.' },

        { mito: 'Los filtros son estado de la aplicación.',
          realidad: 'Son estado <b>de la URL</b>. Ahí se pueden compartir, el botón de atrás funciona, recargar no pierde nada — y el soporte mejora ' +
                    'muchísimo porque el usuario te manda el enlace.' },

        { mito: 'Uso contexto para todo lo que necesitan varios componentes.',
          realidad: 'Todo lo que consume el contexto <b>se vuelve a renderizar</b> cuando cambia. Para datos del servidor, formularios y filtros hay ' +
                    'mejores lugares; y si hace falta contexto, dividilo por frecuencia de cambio.' },

        { mito: 'Guardo el total en estado y lo actualizo con un efecto.',
          realidad: 'Si se puede derivar, <b>no es estado</b>: calculalo. Guardarlo crea una segunda fuente de verdad que puede desincronizarse ' +
                    'y agrega un renderizado.' },
      ],

      glosario: [
        { t: 'Estado del servidor', d: 'Datos que viven en la base. No se copian a estado local.' },
        { t: 'Estado de la URL', d: 'Filtros, página y pestaña, guardados en los parámetros.' },
        { t: 'Estado local', d: 'Lo que solo importa dentro de un componente.' },
        { t: 'Estado global de cliente', d: 'Tema, idioma. Contexto o store chico.' },
        { t: 'Valor derivado', d: 'El que se calcula de otros. No debe guardarse en estado.' },
        { t: 'Invalidación', d: 'Marcar datos como viejos tras una mutación para que se vuelvan a pedir.' },
        { t: 'Transición', d: 'Actualización marcada como no urgente, para no bloquear la interfaz.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Servidor y cliente: dónde corre cada cosa',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> todo lo que mandás al navegador se descarga, se
analiza y se ejecuta en el dispositivo del usuario — así que la pregunta no es "¿puede correr en el cliente?"
sino <b>"¿hace falta que corra ahí?"</b>.</div>

<h4>Qué gana correr en el servidor</h4>
<ul>
<li><b>Menos JavaScript</b> que descargar y ejecutar.</li>
<li>Acceso directo a la base, sin una capa de API.</li>
<li>Los secretos <b>nunca</b> salen del servidor.</li>
<li>Las dependencias pesadas no van al paquete del navegador.</li>
</ul>

<h4>Qué necesita el cliente</h4>
<ul>
<li>Estado que cambia con la interacción.</li>
<li><code>onClick</code>, <code>onChange</code>, teclado, arrastrar.</li>
<li>APIs del navegador: <code>localStorage</code>, geolocalización, cámara.</li>
<li>Suscripciones en vivo.</li>
</ul>

<div class="aviso"><strong>La estrategia que funciona: <b>servidor por defecto, cliente en las hojas</b>.</strong>
El componente de página consulta y compone en el servidor; solo los pedacitos interactivos —un botón, un
formulario, un menú— son de cliente. Al revés —marcar todo como cliente y "optimizar después"— produce que
todo el árbol viaje al navegador, y revertirlo es un refactor grande.</div>

<h4>El error más caro</h4>
<p>Marcar como cliente un componente que está <b>arriba</b> del árbol. Todo lo que esté adentro pasa a ser
cliente también, aunque no lo necesite.</p>
<pre><code>❌  Layout marcado como cliente → TODA la aplicación va al navegador
✔  Layout de servidor, con un botón de cliente adentro</code></pre>

<h4>La regla no negociable</h4>
<p>Ninguna mutación de base ni subida de archivos desde el cliente. Todo pasa por una acción de servidor, que
valida sesión, tenant y reglas de negocio. Desde el cliente solo son válidos <code>auth</code> y las
suscripciones en tiempo real.</p>
`,

      tecnico: `
<h4>Componer para mantener el límite abajo</h4>
<pre><code>// ❌ El componente cliente envuelve todo → sus hijos van al navegador
'use client';
export function Panel({ pedidos }) {
  const [abierto, setAbierto] = useState(false);
  return (
    &lt;div&gt;
      &lt;button onClick={() =&gt; setAbierto(!abierto)}&gt;Filtros&lt;/button&gt;
      {abierto &amp;&amp; &lt;Filtros /&gt;}
      &lt;TablaPesada pedidos={pedidos} /&gt;   {/* ← también se vuelve cliente */}
    &lt;/div&gt;
  );
}

// ✔ El cliente recibe children: lo de adentro sigue siendo de servidor
'use client';
export function Desplegable({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  return (
    &lt;div&gt;
      &lt;button onClick={() =&gt; setAbierto(!abierto)}&gt;{etiqueta}&lt;/button&gt;
      {abierto &amp;&amp; children}
    &lt;/div&gt;
  );
}

// En el servidor
&lt;Desplegable etiqueta="Filtros"&gt;
  &lt;TablaPesada pedidos={pedidos} /&gt;   {/* sigue siendo de servidor */}
&lt;/Desplegable&gt;</code></pre>

<div class="dato"><strong>Ese patrón —pasar <code>children</code> a un componente de cliente— es la técnica más
útil de toda la lección.</strong> Permite tener interactividad en el envoltorio sin arrastrar el contenido al
navegador. La mayoría de los "necesito que esto sea cliente" se resuelven así, y no hace falta convertir nada
más.</div>

<h4>Lo que cruza el límite tiene que ser serializable</h4>
<table>
<tr><th>Se puede pasar</th><th>No se puede</th></tr>
<tr><td>Objetos, arreglos, texto, números</td><td>Funciones (salvo acciones de servidor)</td></tr>
<tr><td><code>Date</code>, <code>Map</code>, <code>Set</code></td><td>Clases con métodos</td></tr>
<tr><td>Otros componentes como <code>children</code></td><td>Símbolos, funciones dentro de objetos</td></tr>
</table>

<div class="dato"><strong>Esa restricción tiene un efecto de diseño positivo:</strong> obliga a pasar
<b>datos</b> y no comportamiento, lo cual mantiene los componentes de presentación realmente tontos. ' +
El error típico —pasar un objeto de dominio con métodos— falla al instante y empuja a serializar a un tipo
plano, que es lo que había que hacer igual.</div>

<h4>Medir lo que llega al navegador</h4>
<pre><code># Tamaño por ruta
pnpm build      # la tabla del final muestra el JS de cada página

# Qué está inflando el paquete
ANALYZE=true pnpm build</code></pre>

<div class="dato"><strong>Los tres sospechosos habituales:</strong> una librería de fechas completa cuando se
usan dos funciones, un paquete de íconos importado entero, y una librería de gráficos cargada en una página
donde el gráfico está abajo de todo. Los tres se resuelven con importación selectiva o con carga diferida.</div>

<h4>Carga diferida para lo pesado</h4>
<pre><code>const Grafico = dynamic(() =&gt; import('./Grafico'), {
  loading: () =&gt; &lt;Esqueleto /&gt;,
  ssr: false,          // si depende del navegador
});</code></pre>

<h4>Componente de servidor: los errores que aparecen</h4>
<pre><code>// ❌ N+1: un await por fila. Se ve inocente y no parece una consulta.
{pedidos.map(async (p) =&gt; &lt;Fila cliente={await clientePorId(p.clienteId)} /&gt;)}

// ❌ Cascada: dos esperas secuenciales que podían ser paralelas
const usuario = await traerUsuario();
const pedidos = await traerPedidos();

// ✔ En paralelo
const [usuario, pedidos] = await Promise.all([traerUsuario(), traerPedidos()]);</code></pre>

<div class="dato"><strong>La cascada es el problema de rendimiento más común de los componentes de
servidor.</strong> Dos <code>await</code> seguidos que no dependen entre sí duplican el tiempo de respuesta, ' +
y el código se ve perfectamente razonable. Buscar <code>await</code> consecutivos es una revisión de treinta
segundos que suele encontrar algo.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="#f87171" font-size="12" font-weight="700">
    EL ERROR MÁS CARO: marcar como cliente algo ARRIBA del árbol</text>

  <rect x="24" y="34" width="304" height="120" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <rect x="44" y="46" width="264" height="24" rx="5" fill="#f87171" fill-opacity=".3"/>
  <text x="176" y="62" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">'use client' — Layout</text>
  <rect x="60" y="76" width="232" height="20" rx="4" fill="#f87171" fill-opacity=".2"/>
  <text x="176" y="90" text-anchor="middle" fill="currentColor" opacity=".7" font-size="8.5">Panel</text>
  <rect x="76" y="100" width="200" height="20" rx="4" fill="#f87171" fill-opacity=".2"/>
  <text x="176" y="114" text-anchor="middle" fill="currentColor" opacity=".7" font-size="8.5">TablaPesada</text>
  <rect x="92" y="124" width="168" height="20" rx="4" fill="#f87171" fill-opacity=".2"/>
  <text x="176" y="138" text-anchor="middle" fill="currentColor" opacity=".7" font-size="8.5">Fila × 200</text>
  <text x="176" y="150" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">TODO va al navegador</text>

  <rect x="352" y="34" width="304" height="120" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <rect x="372" y="46" width="264" height="24" rx="5" fill="#34d399" fill-opacity=".25"/>
  <text x="504" y="62" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">servidor — Layout</text>
  <rect x="388" y="76" width="232" height="20" rx="4" fill="#34d399" fill-opacity=".18"/>
  <text x="504" y="90" text-anchor="middle" fill="currentColor" opacity=".7" font-size="8.5">Panel (servidor)</text>
  <rect x="404" y="100" width="90" height="20" rx="4" fill="#22d3ee" fill-opacity=".35" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="449" y="114" text-anchor="middle" fill="#22d3ee" font-size="8" font-weight="700">Botón (cliente)</text>
  <rect x="500" y="100" width="118" height="20" rx="4" fill="#34d399" fill-opacity=".18"/>
  <text x="559" y="114" text-anchor="middle" fill="currentColor" opacity=".7" font-size="8.5">TablaPesada</text>
  <text x="504" y="142" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">cliente solo en las HOJAS</text>

  <rect x="24" y="166" width="632" height="50" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.6"/>
  <text x="44" y="186" fill="#7c5cff" font-size="12" font-weight="700">LA TÉCNICA MÁS ÚTIL: pasarle children a un componente de cliente</text>
  <text x="44" y="206" fill="currentColor" opacity=".78" font-size="11">
    El envoltorio es interactivo, y <tspan font-weight="700">lo de adentro sigue siendo de servidor</tspan>. La mayoría de los “necesito que esto sea cliente” se resuelven así.</text>

  <line x1="24" y1="234" x2="656" y2="234" stroke="currentColor" opacity=".18"/>

  <text x="24" y="258" fill="#fbbf24" font-size="12" font-weight="700">
    EL PROBLEMA DE RENDIMIENTO MÁS COMÚN EN COMPONENTES DE SERVIDOR</text>

  <rect x="24" y="270" width="304" height="72" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="290" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">CASCADA</text>
  <text x="44" y="308" fill="currentColor" opacity=".7" font-size="9.5" font-family="monospace">const a = await traerUsuario()</text>
  <text x="44" y="322" fill="currentColor" opacity=".7" font-size="9.5" font-family="monospace">const b = await traerPedidos()</text>
  <text x="44" y="336" fill="#f87171" font-size="9.5" font-weight="700">no dependen entre sí → duplicás el tiempo</text>

  <rect x="352" y="270" width="304" height="72" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="290" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">EN PARALELO</text>
  <text x="372" y="312" fill="currentColor" opacity=".7" font-size="9.5" font-family="monospace">const [a, b] = await Promise.all([…])</text>
  <text x="372" y="334" fill="#34d399" font-size="9.5" font-weight="700">buscar awaits consecutivos: revisión de 30 segundos</text>

  <rect x="24" y="354" width="632" height="32" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="374" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    Regla no negociable: ninguna mutación ni subida desde el cliente. Solo auth y suscripciones en vivo.</text>
</svg>`,
        pie: 'Servidor por defecto, cliente en las hojas. Al revés es un refactor grande para volver.',
      },

      entrevista: [
        { p: '¿Cuál es la estrategia correcta para decidir servidor o cliente?',
          r: '<b>Servidor por defecto, cliente en las hojas</b>. La página consulta y compone en el servidor, y solo los pedacitos interactivos ' +
             '—un botón, un formulario, un menú— son de cliente. La pregunta no es "¿puede correr en el cliente?" sino ' +
             '<b>"¿hace falta que corra ahí?"</b>, porque todo lo que mandás al navegador se descarga, se analiza y se ejecuta en el dispositivo ' +
             'del usuario. Al revés —marcar todo como cliente y optimizar después— es un refactor grande para volver.' },

        { p: '¿Cuál es el error más caro con componentes de servidor y cliente?',
          r: 'Marcar como cliente un componente que está <b>arriba del árbol</b>: todo lo que esté adentro pasa a ser cliente también, aunque no lo ' +
             'necesite. Si el layout es de cliente, toda la aplicación viaja al navegador. ' +
             'Y la solución en la mayoría de los casos es la técnica más útil del tema: <b>pasarle <code>children</code> al componente de cliente</b>, ' +
             'así el envoltorio es interactivo y lo de adentro sigue siendo de servidor.' },

        { p: '¿Qué restricción hay sobre lo que cruza el límite servidor-cliente?',
          r: 'Tiene que ser <b>serializable</b>: objetos, arreglos, texto, números, fechas, y otros componentes como <code>children</code>. ' +
             'No pasan funciones —salvo acciones de servidor— ni clases con métodos. Y eso tiene un efecto de diseño positivo: ' +
             'obliga a pasar <b>datos y no comportamiento</b>, lo que mantiene los componentes de presentación realmente tontos. ' +
             'El error típico de pasar un objeto de dominio con métodos falla al instante y empuja a serializar a un tipo plano, que era lo correcto.' },

        { p: '¿Cuál es el problema de rendimiento más común en componentes de servidor?',
          r: 'La <b>cascada</b>: dos <code>await</code> seguidos que no dependen entre sí y duplican el tiempo de respuesta. ' +
             'El código se ve perfectamente razonable, así que nadie lo nota — y buscar <code>await</code> consecutivos es una revisión de treinta ' +
             'segundos que casi siempre encuentra algo. El otro es el <b>N+1</b>: un <code>await</code> dentro de un componente de fila, ' +
             'que se siente natural y no parece una consulta.' },
      ],

      practica: `
<h4>El patrón de children</h4>
<pre><code>// compartido/ui/Desplegable.tsx
'use client';
export function Desplegable({ etiqueta, children }: {
  etiqueta: string; children: ReactNode;
}) {
  const [abierto, setAbierto] = useState(false);
  return (
    &lt;section&gt;
      &lt;button onClick={() =&gt; setAbierto((v) =&gt; !v)} aria-expanded={abierto}&gt;
        {etiqueta}
      &lt;/button&gt;
      {abierto &amp;&amp; &lt;div&gt;{children}&lt;/div&gt;}
    &lt;/section&gt;
  );
}

// app/pedidos/page.tsx — de servidor
export default async function Pagina() {
  const pedidos = await listarPedidos();
  return (
    &lt;Desplegable etiqueta="Historial"&gt;
      &lt;TablaHistorial pedidos={pedidos} /&gt;   {/* nunca va al navegador */}
    &lt;/Desplegable&gt;
  );
}</code></pre>

<h4>Evitar cascadas</h4>
<pre><code>// ❌ Secuencial: el tiempo se suma
const usuario = await traerUsuario(id);
const pedidos = await traerPedidos(id);
const avisos  = await traerAvisos(id);

// ✔ Paralelo: el tiempo es el del más lento
const [usuario, pedidos, avisos] = await Promise.all([
  traerUsuario(id), traerPedidos(id), traerAvisos(id),
]);

// ✔ Y si una depende de otra, paralelizar lo que se pueda
const usuario = await traerUsuario(id);
const [pedidos, avisos] = await Promise.all([
  traerPedidos(usuario.tenantId), traerAvisos(usuario.tenantId),
]);</code></pre>

<h4>Streaming: mostrar lo rápido primero</h4>
<pre><code>export default function Pagina() {
  return (
    &lt;&gt;
      &lt;Encabezado /&gt;                        {/* instantáneo */}
      &lt;Suspense fallback={&lt;Esqueleto /&gt;}&gt;
        &lt;ResumenLento /&gt;                    {/* llega cuando esté */}
      &lt;/Suspense&gt;
      &lt;Suspense fallback={&lt;Esqueleto /&gt;}&gt;
        &lt;TablaPedidos /&gt;
      &lt;/Suspense&gt;
    &lt;/&gt;
  );
}</code></pre>

<div class="aviso"><strong>Sin <code>Suspense</code>, la página entera espera al componente más lento.</strong>
Con él, el usuario ve el encabezado y la estructura de inmediato, y cada parte aparece cuando está lista. ' +
Es la diferencia entre "tarda 2 segundos en aparecer algo" y "aparece al instante y se completa".</div>

<h4>Checklist de una página</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Servidor por defecto; <code>'use client'</code> solo en las hojas</td></tr>
<tr><td>☐</td><td>Los envoltorios interactivos reciben <code>children</code></td></tr>
<tr><td>☐</td><td>Sin <code>await</code> consecutivos que puedan ir en paralelo</td></tr>
<tr><td>☐</td><td>Sin <code>await</code> dentro de un componente de fila</td></tr>
<tr><td>☐</td><td>Lo lento envuelto en <code>Suspense</code></td></tr>
<tr><td>☐</td><td>Lo pesado y poco usado, con carga diferida</td></tr>
<tr><td>☐</td><td>Cero mutaciones desde el cliente</td></tr>
<tr><td>☐</td><td>Medido el JS por ruta después del build</td></tr>
</table>
`,

      errores: [
        { mito: 'Marco todo como cliente y optimizo después.',
          realidad: 'Si el componente está <b>arriba del árbol</b>, todo lo de adentro va al navegador. Revertirlo es un refactor grande, ' +
                    'no una optimización.' },

        { mito: 'Si necesito interactividad, el componente entero debe ser cliente.',
          realidad: 'No: pasale <code>children</code>. El envoltorio es interactivo y <b>lo de adentro sigue siendo de servidor</b>. ' +
                    'Así se resuelven la mayoría de los casos.' },

        { mito: 'Dos await seguidos no son un problema.',
          realidad: 'Si no dependen entre sí, <b>duplicás el tiempo de respuesta</b>. Y el código se ve razonable, así que nadie lo nota. ' +
                    'Buscar <code>await</code> consecutivos encuentra algo casi siempre.' },

        { mito: 'Puedo pasar un objeto del dominio con métodos al cliente.',
          realidad: 'Lo que cruza el límite tiene que ser <b>serializable</b>. Falla al instante, y eso está bien: te empuja a pasar datos planos, ' +
                    'que era lo correcto igual.' },
      ],

      glosario: [
        { t: 'Componente de servidor', d: 'Se renderiza en el servidor; su código no viaja al navegador.' },
        { t: 'Componente de cliente', d: 'Se hidrata en el navegador. Necesario para interactividad.' },
        { t: 'Patrón de children', d: 'Pasar contenido de servidor dentro de un envoltorio de cliente.' },
        { t: 'Serializable', d: 'Que se puede convertir a datos planos para cruzar el límite.' },
        { t: 'Cascada', d: 'Esperas secuenciales que podrían ser paralelas.' },
        { t: 'Suspense', d: 'Mostrar un sustituto mientras una parte de la página se resuelve.' },
        { t: 'Carga diferida', d: 'Descargar un componente solo cuando hace falta.' },
        { t: 'Hidratación', d: 'Proceso de volver interactivo el HTML en el navegador.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Componentes: composición, props y tokens',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un componente crece cuando cada caso nuevo se
resuelve <b>agregándole una prop</b>. Componer, en cambio, mantiene el tamaño constante.</div>

<h4>El componente que crece</h4>
<pre><code>&lt;Tarjeta
  titulo="…" subtitulo="…" icono={…} conBorde conSombra
  variante="destacada" alHacerClic={…} accionSecundaria={…}
  mostrarPie ocultarEncabezado compacta oscura
/&gt;</code></pre>
<p>Doce props, y cada una agrega una rama adentro. Nadie sabe qué combinaciones son válidas, y la mitad no se
usa nunca.</p>

<h4>Componer, en cambio</h4>
<pre><code>&lt;Tarjeta&gt;
  &lt;Tarjeta.Encabezado&gt;
    &lt;Tarjeta.Titulo&gt;Pedido #123&lt;/Tarjeta.Titulo&gt;
    &lt;Boton variante="fantasma"&gt;Editar&lt;/Boton&gt;
  &lt;/Tarjeta.Encabezado&gt;
  &lt;Tarjeta.Cuerpo&gt;…&lt;/Tarjeta.Cuerpo&gt;
&lt;/Tarjeta&gt;</code></pre>

<div class="aviso"><strong>La diferencia: la primera versión tiene que <b>anticipar</b> todos los casos; la
segunda no anticipa ninguno.</strong> Un caso nuevo se resuelve poniendo adentro lo que haga falta, sin tocar
el componente. Por eso <code>Tarjeta</code> deja de crecer.</div>

<h4>Cuándo cada una</h4>
<table>
<tr><th>Situación</th><th>Enfoque</th></tr>
<tr><td>2 o 3 variantes cerradas y estables</td><td>Prop <code>variante</code></td></tr>
<tr><td>Contenido que varía en estructura</td><td>Composición</td></tr>
<tr><td>Un valor de configuración</td><td>Prop</td></tr>
<tr><td>Una prop booleana que agrega una rama</td><td>Composición</td></tr>
</table>

<h4>Tokens: nunca colores literales</h4>
<pre><code>❌  className="bg-[#FF2D78] text-white"
✔  className="bg-brand text-brand-contraste"</code></pre>

<p>Con tokens, cambiar la marca es editar una variable. Con literales, es buscar y reemplazar en doscientos
archivos — y siempre queda alguno.</p>
`,

      tecnico: `
<h4>Composición con subcomponentes</h4>
<pre><code>function Tarjeta({ children, className }: Props) {
  return &lt;article className={cn('rounded-xl border bg-superficie', className)}&gt;{children}&lt;/article&gt;;
}

Tarjeta.Encabezado = function Encabezado({ children }: { children: ReactNode }) {
  return &lt;header className="flex items-center justify-between p-4 border-b"&gt;{children}&lt;/header&gt;;
};
Tarjeta.Titulo = function Titulo({ children }: { children: ReactNode }) {
  return &lt;h3 className="text-base font-semibold"&gt;{children}&lt;/h3&gt;;
};
Tarjeta.Cuerpo = function Cuerpo({ children }: { children: ReactNode }) {
  return &lt;div className="p-4"&gt;{children}&lt;/div&gt;;
};</code></pre>

<div class="dato"><strong>Adjuntar los subcomponentes al principal —<code>Tarjeta.Encabezado</code>— hace dos
cosas:</strong> deja claro que van juntos, y hace que el autocompletado los muestre al escribir
<code>Tarjeta.</code>. Es descubribilidad gratis, y es lo que hace que el equipo los use en vez de improvisar
un <code>div</code>.</div>

<h4>Variantes tipadas</h4>
<pre><code>const estilos = {
  base: 'inline-flex items-center rounded-lg font-medium transition',
  variante: {
    primario:  'bg-brand text-brand-contraste hover:bg-brand/90',
    secundario:'bg-superficie-2 text-texto hover:bg-superficie-3',
    peligro:   'bg-error text-white hover:bg-error/90',
    fantasma:  'hover:bg-superficie-2',
  },
  tamano: { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4', lg: 'h-12 px-6 text-lg' },
} as const;

type Props = {
  variante?: keyof typeof estilos.variante;
  tamano?: keyof typeof estilos.tamano;
} &amp; ButtonHTMLAttributes&lt;HTMLButtonElement&gt;;</code></pre>

<div class="dato"><strong>Derivar el tipo de las claves del objeto —<code>keyof typeof</code>— evita el error de
mantener dos listas.</strong> Agregar una variante al objeto la habilita automáticamente en el tipo; ' +
si estuvieran separados, tarde o temprano una tiene un valor que la otra no.</div>

<h4>Tokens en dos niveles</h4>
<pre><code>/* Nivel 1: la paleta cruda. No se usa directamente. */
--rosa-500: #FF2D78;
--gris-900: #0f1115;

/* Nivel 2: tokens semánticos. Estos SÍ se usan. */
--brand: var(--rosa-500);
--superficie: var(--gris-900);
--texto: #e8eaee;
--error: #f87171;</code></pre>

<div class="dato"><strong>Los dos niveles son lo que permite tener tema claro y oscuro sin duplicar
nada.</strong> El componente usa <code>--superficie</code>; el tema decide si eso es gris 900 o blanco. ' +
Si el componente usara <code>--gris-900</code> directamente, cada regla habría que escribirla dos veces —
y la que se olvide queda ilegible en uno de los dos temas.</div>

<h4>Accesibilidad: lo mínimo que no se negocia</h4>
<pre><code>· Botones son &lt;button&gt;, enlaces son &lt;a&gt;. Un div con onClick no se enfoca
  con teclado ni lo anuncia un lector de pantalla.
· Todo campo tiene &lt;label&gt; asociado.
· Contraste mínimo 4.5:1 para texto normal.
· El foco visible: nunca outline: none sin reemplazo.
· Imágenes con alt; las decorativas, alt="".</code></pre>

<div class="dato"><strong>La primera línea resuelve más problemas que las otras cuatro juntas.</strong> Un
<code>div</code> con <code>onClick</code> no recibe foco, no responde a Enter ni a la barra espaciadora, y un
lector de pantalla no dice que sea accionable. Usar el elemento correcto da todo eso <b>gratis</b>, sin una
sola línea de código extra.</div>

<h4>Cuándo extraer un componente</h4>
<table>
<tr><th>Señal</th><th>Acción</th></tr>
<tr><td>El mismo bloque aparece 3 veces</td><td>Extraer</td></tr>
<tr><td>Un bloque tiene su propio estado</td><td>Extraer</td></tr>
<tr><td>El componente pasó las 300 líneas</td><td>Mirar por qué</td></tr>
<tr><td>Un bloque se puede nombrar con un concepto</td><td>Extraer</td></tr>
<tr><td>Aparece dos veces</td><td><b>Esperar.</b> Regla de tres</td></tr>
</table>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    PROPS QUE CRECEN vs COMPOSICIÓN</text>

  <rect x="24" y="34" width="304" height="120" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="54" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">✗ una prop por caso</text>
  <text x="40" y="74" fill="currentColor" opacity=".65" font-size="8.5" font-family="monospace">titulo · subtitulo · icono · conBorde</text>
  <text x="40" y="88" fill="currentColor" opacity=".65" font-size="8.5" font-family="monospace">conSombra · variante · alHacerClic</text>
  <text x="40" y="102" fill="currentColor" opacity=".65" font-size="8.5" font-family="monospace">accionSecundaria · mostrarPie</text>
  <text x="40" y="116" fill="currentColor" opacity=".65" font-size="8.5" font-family="monospace">ocultarEncabezado · compacta · oscura</text>
  <text x="176" y="136" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">tiene que ANTICIPAR todos los casos</text>
  <text x="176" y="149" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">nadie sabe qué combinaciones son válidas</text>

  <rect x="352" y="34" width="304" height="120" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="504" y="54" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">✓ composición</text>
  <rect x="372" y="64" width="264" height="18" rx="4" fill="#34d399" fill-opacity=".2"/>
  <text x="504" y="77" text-anchor="middle" fill="currentColor" opacity=".72" font-size="8.5" font-family="monospace">&lt;Tarjeta&gt;</text>
  <rect x="388" y="86" width="248" height="18" rx="4" fill="#34d399" fill-opacity=".16"/>
  <text x="512" y="99" text-anchor="middle" fill="currentColor" opacity=".72" font-size="8.5" font-family="monospace">&lt;Tarjeta.Encabezado&gt;…&lt;/&gt;</text>
  <rect x="388" y="108" width="248" height="18" rx="4" fill="#34d399" fill-opacity=".16"/>
  <text x="512" y="121" text-anchor="middle" fill="currentColor" opacity=".72" font-size="8.5" font-family="monospace">&lt;Tarjeta.Cuerpo&gt;…&lt;/&gt;</text>
  <text x="504" y="143" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">no anticipa NINGUNO — y deja de crecer</text>

  <rect x="24" y="166" width="632" height="30" rx="8" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="340" y="186" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">
    Adjuntar los subcomponentes (Tarjeta.Titulo) da descubribilidad gratis: el autocompletado los muestra.</text>

  <line x1="24" y1="214" x2="656" y2="214" stroke="currentColor" opacity=".18"/>

  <text x="24" y="238" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    TOKENS EN DOS NIVELES — lo que permite claro y oscuro sin duplicar</text>

  <rect x="24" y="250" width="200" height="60" rx="9" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".3"/>
  <text x="124" y="270" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10" font-weight="700">1 · paleta cruda</text>
  <text x="124" y="288" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9" font-family="monospace">--rosa-500 · --gris-900</text>
  <text x="124" y="302" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">NO se usa directamente</text>

  <text x="232" y="284" fill="currentColor" opacity=".4" font-size="14">→</text>

  <rect x="248" y="250" width="200" height="60" rx="9" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.4"/>
  <text x="348" y="270" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">2 · tokens semánticos</text>
  <text x="348" y="288" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9" font-family="monospace">--brand · --superficie · --texto</text>
  <text x="348" y="302" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">estos SÍ se usan</text>

  <text x="456" y="284" fill="currentColor" opacity=".4" font-size="14">→</text>

  <rect x="472" y="250" width="184" height="60" rx="9" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="564" y="270" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">el TEMA decide</text>
  <text x="564" y="288" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">si --superficie es</text>
  <text x="564" y="302" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">gris 900 o blanco</text>

  <rect x="24" y="326" width="632" height="60" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="44" y="346" fill="#fbbf24" font-size="12" font-weight="700">ACCESIBILIDAD: LA LÍNEA QUE RESUELVE MÁS QUE TODAS LAS DEMÁS JUNTAS</text>
  <text x="44" y="366" fill="currentColor" opacity=".78" font-size="11">
    Botones son <tspan font-family="monospace" font-weight="700">&lt;button&gt;</tspan>, enlaces son <tspan font-family="monospace" font-weight="700">&lt;a&gt;</tspan>.</text>
  <text x="44" y="381" fill="currentColor" opacity=".75" font-size="10.5">
    Un <tspan font-family="monospace">div</tspan> con onClick no se enfoca, no responde a Enter, y un lector de pantalla no dice que sea accionable. El elemento correcto da todo eso gratis.</text>
</svg>`,
        pie: 'Un componente crece cuando cada caso nuevo agrega una prop. Componer mantiene el tamaño constante.',
      },

      entrevista: [
        { p: '¿Cuándo usar props y cuándo composición?',
          r: '<b>Props</b> para valores de configuración y para dos o tres variantes cerradas y estables. <b>Composición</b> cuando el contenido varía ' +
             'en estructura, o cuando una prop booleana agregaría una rama nueva. La diferencia de fondo es que ' +
             '<b>la versión con props tiene que anticipar todos los casos y la compuesta no anticipa ninguno</b>: ' +
             'un caso nuevo se resuelve poniendo adentro lo que haga falta, sin tocar el componente. Por eso deja de crecer.' },

        { p: '¿Qué aporta adjuntar los subcomponentes al principal?',
          r: 'Dos cosas. Deja claro que van juntos —<code>Tarjeta.Encabezado</code> pertenece a <code>Tarjeta</code>— y da ' +
             '<b>descubribilidad gratis</b>: al escribir <code>Tarjeta.</code> el autocompletado muestra las piezas disponibles. ' +
             'Eso es lo que hace que el equipo las use en vez de improvisar un <code>div</code> con clases sueltas, ' +
             'que es como los sistemas de componentes se erosionan.' },

        { p: '¿Por qué tokens en dos niveles?',
          r: 'Porque es lo que permite tener tema claro y oscuro <b>sin duplicar nada</b>. La paleta cruda define los colores; los tokens semánticos ' +
             '—<code>--brand</code>, <code>--superficie</code>, <code>--texto</code>— son los que usan los componentes, y el tema decide a qué color ' +
             'apuntan. Si el componente usara el color crudo directamente, habría que escribir cada regla dos veces, ' +
             'y <b>la que alguien se olvide queda ilegible en uno de los dos temas</b>.' },

        { p: '¿Cuál es la medida de accesibilidad que más rinde?',
          r: 'Usar el <b>elemento correcto</b>: los botones son <code>&lt;button&gt;</code> y los enlaces son <code>&lt;a&gt;</code>. ' +
             'Un <code>div</code> con <code>onClick</code> no recibe foco con el teclado, no responde a Enter ni a la barra espaciadora, ' +
             'y un lector de pantalla no anuncia que sea accionable. Usar el elemento correcto da todo eso <b>gratis</b>, ' +
             'sin una sola línea extra — y resuelve más problemas que el resto de las medidas juntas.' },
      ],

      practica: `
<h4>Componente compuesto completo</h4>
<pre><code>export function Tarjeta({ children, className }: { children: ReactNode; className?: string }) {
  return (
    &lt;article className={cn('rounded-xl border border-borde bg-superficie', className)}&gt;
      {children}
    &lt;/article&gt;
  );
}

Tarjeta.Encabezado = ({ children }: { children: ReactNode }) =&gt; (
  &lt;header className="flex items-center justify-between gap-3 border-b border-borde p-4"&gt;
    {children}
  &lt;/header&gt;
);

Tarjeta.Titulo = ({ children }: { children: ReactNode }) =&gt; (
  &lt;h3 className="text-base font-semibold text-texto"&gt;{children}&lt;/h3&gt;
);

Tarjeta.Cuerpo = ({ children }: { children: ReactNode }) =&gt; (
  &lt;div className="p-4 text-texto-2"&gt;{children}&lt;/div&gt;
);

Tarjeta.Pie = ({ children }: { children: ReactNode }) =&gt; (
  &lt;footer className="border-t border-borde p-4"&gt;{children}&lt;/footer&gt;
);</code></pre>

<h4>Tokens de dos niveles, con los dos temas</h4>
<pre><code>:root {
  /* paleta cruda */
  --rosa-500: #ff2d78;
  --rosa-600: #c44db8;
  --gris-50:  #f8f9fb;
  --gris-900: #0f1115;

  /* semánticos — tema oscuro por defecto */
  --brand: var(--rosa-500);
  --superficie: var(--gris-900);
  --superficie-2: #171a20;
  --texto: #e8eaee;
  --texto-2: #a8b0bd;
  --borde: #262b34;
}

:root[data-tema="claro"] {
  --brand: var(--rosa-600);        /* el rosa 500 no pasa contraste sobre blanco */
  --superficie: #ffffff;
  --superficie-2: var(--gris-50);
  --texto: #14171c;
  --texto-2: #4d5560;
  --borde: #e3e7ed;
}</code></pre>

<div class="aviso"><strong>Fijate que <code>--brand</code> cambia de valor entre temas.</strong> Un rosa que
funciona sobre fondo oscuro puede no llegar al contraste mínimo sobre blanco. Por eso el token semántico es el
lugar correcto para esa decisión: los componentes no se enteran, y el contraste queda garantizado en los dos
temas.</div>

<h4>Detectar colores literales</h4>
<pre><code># Cualquier color hexadecimal fuera del archivo de tokens
grep -rn "#[0-9a-fA-F]\\{6\\}" src/ --include="*.tsx" --include="*.ts" \\
  | grep -v "tokens.css"

# Clases arbitrarias de Tailwind con color
grep -rn "bg-\\[#\\|text-\\[#\\|border-\\[#" src/</code></pre>

<h4>Checklist de un componente de interfaz</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Menos de 8 props, o composición</td></tr>
<tr><td>☐</td><td>Sin booleanos que agreguen ramas de comportamiento</td></tr>
<tr><td>☐</td><td>Solo tokens: cero colores literales</td></tr>
<tr><td>☐</td><td>Funciona en tema claro y oscuro</td></tr>
<tr><td>☐</td><td>Elemento semántico correcto</td></tr>
<tr><td>☐</td><td>Foco visible</td></tr>
<tr><td>☐</td><td>Contraste ≥ 4.5:1</td></tr>
<tr><td>☐</td><td>Menos de 300 líneas</td></tr>
</table>
`,

      errores: [
        { mito: 'Agrego una prop para cubrir el caso nuevo.',
          realidad: 'Así es como un componente llega a doce props y nadie sabe qué combinaciones son válidas. <b>Componer</b> resuelve el caso nuevo ' +
                    'sin tocar el componente.' },

        { mito: 'Uso el color de marca directamente en las clases.',
          realidad: 'Cambiar la marca pasa a ser buscar y reemplazar en doscientos archivos, y siempre queda alguno. Con tokens es editar una variable — ' +
                    'y además permite que el color <b>cambie entre temas</b> por contraste.' },

        { mito: 'Un div con onClick es un botón.',
          realidad: 'No recibe foco con el teclado, no responde a Enter ni a la barra espaciadora, y un lector de pantalla no lo anuncia como ' +
                    'accionable. <code>&lt;button&gt;</code> da todo eso gratis.' },

        { mito: 'Extraigo el componente apenas veo el bloque repetido.',
          realidad: 'Con dos ocurrencias todavía no sabés qué es común y qué variable. <b>Regla de tres</b>: la abstracción que sale a la tercera ' +
                    'es mucho mejor.' },
      ],

      glosario: [
        { t: 'Composición', d: 'Armar la interfaz combinando piezas en vez de configurar props.' },
        { t: 'Subcomponente', d: 'Pieza adjunta al componente principal, como Tarjeta.Titulo.' },
        { t: 'Token semántico', d: 'Variable que nombra un rol —brand, superficie— y no un color.' },
        { t: 'Paleta cruda', d: 'Los colores base. No se usan directamente en componentes.' },
        { t: 'Variante', d: 'Prop cerrada con un conjunto conocido y estable de valores.' },
        { t: 'Elemento semántico', d: 'La etiqueta HTML correcta para lo que el elemento hace.' },
        { t: 'Contraste', d: 'Relación entre color de texto y fondo. Mínimo 4.5:1 para texto normal.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es la ventaja concreta de organizar por funcionalidad?',
      opciones: [
        'Que podés borrar una funcionalidad entera; con organización por tipo, el código muerto se acumula',
        'Que los nombres de archivo son más cortos',
        'Que reduce el tamaño del bundle',
        'Que evita las importaciones circulares',
      ],
      correcta: 0,
      porQue: 'Si el producto deja de tener facturación, borrás la carpeta y arreglás lo que rompa. Con organización por tipo, esos archivos están entre otros sesenta y nadie se anima a tocarlos.',
      porQueNo: {
        1: 'No tiene relación con la longitud de los nombres.',
        2: 'La estructura de carpetas no afecta el tamaño del paquete.',
        3: 'Puede ayudar, pero no es la ventaja principal.',
      },
    },
    {
      p: '¿Qué archivo de una funcionalidad rinde más y se crea menos?',
      opciones: [
        'reglas.ts con lógica pura: se prueba sin montar nada y evita que la lógica se duplique',
        'tipos.ts con todas las interfaces',
        'constantes.ts',
        'index.ts',
      ],
      correcta: 0,
      porQue: 'Si el cálculo del total vive en el componente, la Server Action va a tener su propia copia — y las dos se van a desincronizar.',
      porQueNo: {
        1: 'Es útil, pero no aporta lógica verificable.',
        2: 'Ayuda al orden, no a la testabilidad.',
        3: 'Define el límite público, que es otro problema.',
      },
    },
    {
      p: '¿En qué orden se parte un componente que creció demasiado?',
      opciones: [
        'Primero los cálculos, después el estado, y al final el JSX',
        'Primero el JSX, que es lo más largo',
        'Todo de una vez, para no dejarlo a medias',
        'Por cantidad de líneas, dividiendo en partes iguales',
      ],
      correcta: 0,
      porQue: 'Partir el JSX sin haber sacado lo anterior produce componentes que reciben quince props: el mismo enredo repartido, y ahora hay que saltar entre archivos.',
      porQueNo: {
        1: 'Sin extraer cálculos y estado, los componentes resultantes quedan acoplados por props.',
        2: 'Aumenta el riesgo sin necesidad; se puede hacer incremental.',
        3: 'Las líneas no son un criterio de responsabilidad.',
      },
    },
    {
      p: '¿Qué regla evita que la carpeta compartida se vuelva un cajón?',
      opciones: [
        'Si menciona un concepto del negocio, no va en compartido',
        'Máximo veinte archivos',
        'Solo funciones, no componentes',
        'Un archivo por categoría',
      ],
      correcta: 0,
      porQue: 'Un Boton va; un SelectorDeEstadoDePedido no, aunque se use en dos pantallas. Sin esa regla, compartido se vuelve el módulo del que todo depende y que nadie entiende.',
      porQueNo: {
        1: 'Un límite numérico no distingue lo genérico de lo específico.',
        2: 'Los componentes de interfaz genéricos sí corresponden ahí.',
        3: 'Es organización, no criterio de pertenencia.',
      },
    },
    {
      p: '¿Cuál es el error de estado que más problemas causa?',
      opciones: [
        'Copiar datos del servidor a useState: quedan dos copias de la verdad para sincronizar a mano',
        'Usar demasiados useState en un componente',
        'No usar useReducer para estado complejo',
        'Guardar objetos en lugar de primitivos',
      ],
      correcta: 0,
      porQue: 'De ahí salen "actualicé y no se ve", "se ve viejo al volver" y "dos pestañas muestran cosas distintas".',
      porQueNo: {
        1: 'Puede ser incómodo pero no genera inconsistencias.',
        2: 'Es una preferencia de estilo, no una fuente de bugs.',
        3: 'No causa desincronización por sí solo.',
      },
    },
    {
      p: 'Un efecto tuyo tiene una bandera "cancelado". ¿Qué indica?',
      opciones: [
        'Que estás reimplementando una librería de datos, y todavía faltan deduplicación, revalidación e invalidación',
        'Que el efecto está bien escrito',
        'Que falta un useCallback',
        'Que el componente debería ser de servidor obligatoriamente',
      ],
      correcta: 0,
      porQue: 'Cada una de esas piezas faltantes es un bug esperando, y todas están resueltas en un componente de servidor o en una librería de datos.',
      porQueNo: {
        1: 'Es correcto para evitar una advertencia, pero señala un problema mayor.',
        2: 'No tiene relación con la memoización.',
        3: 'Puede resolverse también con una librería de datos en el cliente.',
      },
    },
    {
      p: '¿Por qué conviene poner los filtros en la URL?',
      opciones: [
        'Se comparte el enlace, funciona el botón atrás, recargar no pierde nada, y el soporte mejora mucho',
        'Porque es más rápido que useState',
        'Porque reduce el JavaScript enviado',
        'Porque lo exige el enrutador',
      ],
      correcta: 0,
      porQue: 'La razón menos obvia pesa mucho: cuando alguien reporta un problema, te manda el enlace y ves exactamente lo mismo que él.',
      porQueNo: {
        1: 'La velocidad no es la diferencia relevante.',
        2: 'No cambia el tamaño del paquete.',
        3: 'Ningún enrutador lo exige.',
      },
    },
    {
      p: '¿Cuál es el costo de usar contexto?',
      opciones: [
        'Todo lo que lo consume se vuelve a renderizar cuando cambia',
        'Aumenta el tamaño del bundle',
        'No funciona con componentes de servidor',
        'Requiere una librería externa',
      ],
      correcta: 0,
      porQue: 'Un contexto con muchos valores que cambian seguido produce renderizados en cascada. Si hace falta, conviene dividirlo por frecuencia de cambio.',
      porQueNo: {
        1: 'El impacto en tamaño es despreciable.',
        2: 'Se usa en el árbol de cliente, que es donde corresponde.',
        3: 'Es parte de React.',
      },
    },
    {
      p: '¿Cuál es la estrategia correcta entre servidor y cliente?',
      opciones: [
        'Servidor por defecto, cliente en las hojas',
        'Cliente por defecto, servidor donde haga falta',
        'Todo cliente, y optimizar al final',
        'Depende del tamaño del componente',
      ],
      correcta: 0,
      porQue: 'Marcar como cliente algo arriba del árbol arrastra todo lo de adentro al navegador, y revertirlo es un refactor grande, no una optimización.',
      porQueNo: {
        1: 'Manda al navegador código que no lo necesita.',
        2: 'Es exactamente el camino que después cuesta revertir.',
        3: 'El criterio es si necesita interactividad, no el tamaño.',
      },
    },
    {
      p: '¿Cuál es la técnica más útil para no arrastrar contenido al cliente?',
      opciones: [
        'Pasarle children al componente de cliente: el envoltorio es interactivo y lo de adentro sigue siendo de servidor',
        'Usar dynamic import en todo',
        'Poner "use client" solo en producción',
        'Dividir el componente en dos archivos',
      ],
      correcta: 0,
      porQue: 'La mayoría de los "necesito que esto sea cliente" se resuelven así, sin convertir nada más.',
      porQueNo: {
        1: 'Difiere la carga pero el código sigue siendo de cliente.',
        2: 'La directiva no depende del entorno.',
        3: 'Separar archivos no cambia el límite servidor-cliente.',
      },
    },
    {
      p: '¿Qué restricción tiene lo que cruza el límite servidor-cliente?',
      opciones: [
        'Tiene que ser serializable: no pasan funciones ni clases con métodos',
        'Tiene que ser menor a 1 MB',
        'Solo se pueden pasar strings',
        'Debe estar tipado con TypeScript',
      ],
      correcta: 0,
      porQue: 'Y tiene un efecto de diseño positivo: obliga a pasar datos y no comportamiento, lo que mantiene los componentes de presentación realmente tontos.',
      porQueNo: {
        1: 'No hay tal límite explícito, aunque conviene no enviar de más.',
        2: 'Objetos, arreglos, fechas y números también pasan.',
        3: 'El tipado ayuda pero no es la restricción del runtime.',
      },
    },
    {
      p: '¿Cuál es el problema de rendimiento más común en componentes de servidor?',
      opciones: [
        'La cascada: dos await seguidos que no dependen entre sí y duplican el tiempo',
        'El exceso de contexto',
        'Los renderizados innecesarios',
        'La hidratación lenta',
      ],
      correcta: 0,
      porQue: 'El código se ve perfectamente razonable, así que nadie lo nota. Buscar await consecutivos es una revisión de treinta segundos que casi siempre encuentra algo.',
      porQueNo: {
        1: 'El contexto vive en el árbol de cliente.',
        2: 'Los componentes de servidor no se re-renderizan en el navegador.',
        3: 'Es un problema del cliente, no del servidor.',
      },
    },
    {
      p: '¿Cuándo conviene composición en vez de props?',
      opciones: [
        'Cuando el contenido varía en estructura, o cuando una prop booleana agregaría una rama',
        'Siempre: las props son un antipatrón',
        'Solo en componentes de más de 300 líneas',
        'Cuando hay más de tres variantes de color',
      ],
      correcta: 0,
      porQue: 'La versión con props tiene que anticipar todos los casos; la compuesta no anticipa ninguno. Un caso nuevo se resuelve poniendo adentro lo que haga falta.',
      porQueNo: {
        1: 'Las props son correctas para configuración y variantes cerradas.',
        2: 'El tamaño es un síntoma, no el criterio.',
        3: 'Las variantes de estilo se resuelven bien con una prop cerrada.',
      },
    },
    {
      p: '¿Por qué tokens de color en dos niveles?',
      opciones: [
        'Porque permiten tema claro y oscuro sin duplicar reglas, y que el color cambie por contraste',
        'Porque reducen el tamaño del CSS',
        'Porque Tailwind lo requiere',
        'Porque facilitan el autocompletado',
      ],
      correcta: 0,
      porQue: 'El componente usa --superficie y el tema decide si eso es gris 900 o blanco. Un rosa que funciona sobre oscuro puede no llegar al contraste mínimo sobre blanco.',
      porQueNo: {
        1: 'El tamaño es prácticamente el mismo.',
        2: 'Funciona con o sin Tailwind.',
        3: 'Es un beneficio menor, no la razón.',
      },
    },
    {
      p: '¿Cuál es la medida de accesibilidad que más rinde?',
      opciones: [
        'Usar el elemento correcto: button para botones, a para enlaces',
        'Agregar aria-label a todos los elementos',
        'Aumentar el tamaño de fuente',
        'Usar role="button" en los div clickeables',
      ],
      correcta: 0,
      porQue: 'Un div con onClick no recibe foco, no responde a Enter ni a la barra espaciadora, y un lector de pantalla no lo anuncia. El elemento correcto da todo eso gratis.',
      porQueNo: {
        1: 'Usados de más, los aria-label empeoran la experiencia con lector de pantalla.',
        2: 'Ayuda a la legibilidad pero no resuelve navegación por teclado.',
        3: 'El rol lo anuncia, pero sigue sin recibir foco ni responder al teclado.',
      },
    },
  ],
});
