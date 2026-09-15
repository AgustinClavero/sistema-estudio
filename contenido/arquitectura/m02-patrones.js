/* ==========================================================================
   Arquitectura · Módulo 02 — Patrones de diseño que sí se usan
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'arquitectura',
  id: 'm02',
  titulo: 'Patrones de diseño que sí se usan',
  fuentes: ['refactoring-guru', 'fowler'],

  intro:
    '<p>Los patrones no son recetas para aplicar: son <b>nombres para soluciones que ya estás usando sin saberlo</b>. ' +
    'Su valor real es de comunicación — decir "acá va un adaptador" ahorra diez minutos de explicación.</p>' +
    '<p>Este módulo cubre los siete u ocho que aparecen todas las semanas en código moderno. Los otros quince ' +
    'existen, y si alguna vez los necesitás vas a saber buscarlos. <b>Aprender los 23 de memoria no sirve para ' +
    'nada</b> y produce el peor efecto posible: querer usarlos.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Strategy y Factory',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> <b>Strategy</b> resuelve "hay varias formas de
hacer esto"; <b>Factory</b> resuelve "crear esto tiene su complicación y no quiero repetirla".</div>

<h4>Strategy: varias formas de hacer lo mismo</h4>
<p>Es el patrón que ya viste en el módulo anterior sin ese nombre. El síntoma que lo pide es una cadena de
<code>if</code> que crece:</p>
<pre><code>// Cada envío nuevo obliga a tocar esta función
function calcularEnvio(tipo, pedido) {
  if (tipo === 'estandar')  return pedido.peso * 200;
  if (tipo === 'express')   return pedido.peso * 500 + 1000;
  if (tipo === 'retiro')    return 0;
}

// Strategy: cada forma es una pieza propia
const estrategias = {
  estandar: { calcular: (p) =&gt; p.peso * 200 },
  express:  { calcular: (p) =&gt; p.peso * 500 + 1000 },
  retiro:   { calcular: () =&gt; 0 },
};
const calcularEnvio = (tipo, pedido) =&gt; estrategias[tipo].calcular(pedido);</code></pre>

<div class="aviso"><strong>En JavaScript, una estrategia casi siempre es simplemente una función.</strong>
No hace falta una clase con un método, ni una jerarquía, ni una interfaz por variante. Los ejemplos con clases
vienen de lenguajes donde no se pueden pasar funciones como valores. <b>Si tu "patrón Strategy" tiene tres
archivos de andamiaje para envolver una función de una línea, aplicaste el ejemplo, no el patrón.</b></div>

<h4>Factory: encapsular la creación</h4>
<p>Sirve cuando construir algo requiere pasos, decisiones o configuración que no querés repetir en cada punto
de uso.</p>
<pre><code>// ❌ La misma configuración copiada en 12 archivos
const supabase = createClient(url, key, { auth: { persistSession: false }, … });

// ✔ Una fábrica: un solo lugar donde se sabe cómo se arma
export function clienteServidor() { … }
export function clienteAdmin() { … }   // con su advertencia adentro</code></pre>

<h4>Cómo elegir entre los dos</h4>
<table>
<tr><th>Si el síntoma es…</th><th>Usá</th></tr>
<tr><td>Un <code>if</code> que crece con cada variante</td><td>Strategy</td></tr>
<tr><td>La misma configuración de creación repetida</td><td>Factory</td></tr>
<tr><td>"Depende del plan del cliente, hace X o Y"</td><td>Strategy</td></tr>
<tr><td>"Según el entorno, creo esto de forma distinta"</td><td>Factory</td></tr>
</table>
`,

      tecnico: `
<h4>Strategy con verificación de tipos</h4>
<pre><code>export interface EstrategiaEnvio {
  calcular(pedido: Pedido): number;
  diasEstimados(pedido: Pedido): number;
  disponiblePara(pedido: Pedido): boolean;
}

const ESTRATEGIAS = {
  estandar: estrategiaEstandar,
  express:  estrategiaExpress,
  retiro:   estrategiaRetiro,
} satisfies Record&lt;string, EstrategiaEnvio&gt;;

export type TipoEnvio = keyof typeof ESTRATEGIAS;

export function opcionesDisponibles(pedido: Pedido): TipoEnvio[] {
  return (Object.keys(ESTRATEGIAS) as TipoEnvio[])
    .filter((t) =&gt; ESTRATEGIAS[t].disponiblePara(pedido));
}</code></pre>

<div class="dato"><strong>El <code>satisfies</code> hace algo que <code>as</code> no:</strong> verifica que
cada entrada cumpla la interfaz <b>sin ensanchar el tipo</b>, así que <code>TipoEnvio</code> sigue siendo la
unión exacta de las claves. Con <code>as Record&lt;string, …&gt;</code> perderías eso y cualquier cadena
compilaría.</div>

<h4>Las cuatro fábricas que existen</h4>
<table>
<tr><th>Nombre</th><th>Qué hace</th><th>Cuándo</th></tr>
<tr><td><b>Función de fábrica</b></td><td>Una función que devuelve el objeto armado</td><td><b>El 90% de los casos</b></td></tr>
<tr><td><b>Método de fábrica</b></td><td>Una subclase decide qué crear</td><td>Jerarquías de clases</td></tr>
<tr><td><b>Fábrica abstracta</b></td><td>Crea familias de objetos relacionados</td><td>Muy raro fuera de librerías</td></tr>
<tr><td><b>Constructor (builder)</b></td><td>Construcción paso a paso, con muchas opciones</td><td>Consultas, configuraciones complejas</td></tr>
</table>

<div class="dato"><strong>En código moderno de aplicación, casi siempre la respuesta es la primera.</strong>
Una función que devuelve un objeto configurado cubre el caso real; las otras tres aparecen sobre todo en
librerías y en lenguajes con jerarquías de clases pesadas. Si estás dudando entre las cuatro, empezá por la
función.</div>

<h4>Un builder cuando sí vale la pena</h4>
<pre><code>// Muchas combinaciones opcionales → los parámetros no escalan
const resultados = await consulta('pedidos')
  .delTenant(tenantId)
  .conEstado('pendiente')
  .creadosDesde(hace30Dias)
  .ordenadoPor('creado_en', 'desc')
  .limite(50)
  .ejecutar();</code></pre>
<p>La señal que lo pide es una función con seis parámetros opcionales donde la mitad de los usos pasan
<code>undefined</code>.</p>

<h4>Strategy con estado y configuración</h4>
<pre><code>// A veces la estrategia necesita configuración propia:
// una fábrica que devuelve una estrategia.
export function crearEstrategiaDescuento(config: ConfigDescuento): EstrategiaDescuento {
  switch (config.tipo) {
    case 'porcentaje': return { aplicar: (m) =&gt; m * (1 - config.valor / 100) };
    case 'fijo':       return { aplicar: (m) =&gt; Math.max(0, m - config.valor) };
    case 'ninguno':    return { aplicar: (m) =&gt; m };
  }
}</code></pre>

<div class="dato"><strong>Ese caso —fábrica que devuelve estrategia— es el más común de todos en aplicaciones
reales</strong>, y es exactamente el patrón de la comisión de marketplace: el modo y el valor vienen de la
configuración del tenant, y el cálculo se resuelve en un solo lugar en vez de en cada punto de cobro.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="pt1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    STRATEGY — el síntoma que lo pide es un if que crece</text>

  <rect x="24" y="34" width="290" height="104" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="169" y="56" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">✗ una función que crece</text>
  <text x="44" y="78" fill="currentColor" opacity=".7" font-size="9.5" font-family="monospace">if (tipo === 'estandar') …</text>
  <text x="44" y="94" fill="currentColor" opacity=".7" font-size="9.5" font-family="monospace">if (tipo === 'express') …</text>
  <text x="44" y="110" fill="currentColor" opacity=".7" font-size="9.5" font-family="monospace">if (tipo === 'retiro') …</text>
  <text x="44" y="128" fill="#f87171" font-size="10" font-weight="700">cada variante toca código que ya andaba</text>

  <line x1="320" y1="86" x2="344" y2="86" stroke="currentColor" stroke-width="1.4" marker-end="url(#pt1)"/>

  <rect x="352" y="34" width="304" height="104" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="56" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">✓ una pieza por variante</text>
  <rect x="372" y="66" width="80" height="24" rx="5" fill="#34d399" fill-opacity=".25"/>
  <text x="412" y="82" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">estandar</text>
  <rect x="460" y="66" width="80" height="24" rx="5" fill="#34d399" fill-opacity=".25"/>
  <text x="500" y="82" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">express</text>
  <rect x="548" y="66" width="88" height="24" rx="5" fill="#34d399" fill-opacity=".25"/>
  <text x="592" y="82" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">retiro</text>
  <text x="504" y="110" text-anchor="middle" fill="currentColor" opacity=".68" font-size="10" font-family="monospace">estrategias[tipo].calcular(pedido)</text>
  <text x="504" y="128" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">una variante nueva = un archivo nuevo</text>

  <rect x="24" y="150" width="632" height="42" rx="9" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="44" y="170" fill="#fbbf24" font-size="11.5" font-weight="700">EN JAVASCRIPT, UNA ESTRATEGIA CASI SIEMPRE ES UNA FUNCIÓN.</text>
  <text x="44" y="186" fill="currentColor" opacity=".72" font-size="10.5">
    Si tu “Strategy” tiene tres archivos de andamiaje para envolver una línea, aplicaste el EJEMPLO, no el patrón.</text>

  <line x1="24" y1="210" x2="656" y2="210" stroke="currentColor" opacity=".18"/>

  <text x="24" y="234" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    FACTORY — un solo lugar que sabe cómo se arma algo</text>

  <rect x="24" y="246" width="290" height="76" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="169" y="266" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">✗ configuración copiada</text>
  <text x="44" y="286" fill="currentColor" opacity=".65" font-size="9.5">createClient(url, key, {…}) × 12 archivos</text>
  <text x="44" y="306" fill="#f87171" font-size="10" font-weight="700">cambiar una opción = tocar 12 lugares</text>

  <rect x="352" y="246" width="304" height="76" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="266" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">✓ una fábrica</text>
  <text x="372" y="286" fill="currentColor" opacity=".68" font-size="9.5" font-family="monospace">clienteServidor() · clienteAdmin()</text>
  <text x="372" y="306" fill="#34d399" font-size="10" font-weight="700">y la advertencia de admin vive con la fábrica</text>

  <rect x="24" y="336" width="632" height="50" rx="9" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="44" y="356" fill="#7c5cff" font-size="11.5" font-weight="700">EL CASO MÁS COMÚN DE TODOS: UNA FÁBRICA QUE DEVUELVE UNA ESTRATEGIA</text>
  <text x="44" y="376" fill="currentColor" opacity=".72" font-size="10.5">
    El modo y el valor vienen de la configuración del tenant; el cálculo se resuelve UNA vez y no en cada punto de uso.</text>
</svg>`,
        pie: 'Strategy resuelve “varias formas de hacer esto”. Factory, “armarlo tiene su complicación”.',
      },

      entrevista: [
        { p: '¿Qué problema resuelve Strategy y cómo lo reconocés?',
          r: 'Resuelve "hay varias formas de hacer lo mismo". El síntoma que lo pide es una <b>cadena de <code>if</code> que crece</b> con cada ' +
             'variante nueva, obligando a tocar código que ya funcionaba. La solución es una pieza por variante y un punto de despacho que no cambia. ' +
             'Y un detalle importante en JavaScript: <b>una estrategia casi siempre es simplemente una función</b>. ' +
             'Los ejemplos con clases y jerarquías vienen de lenguajes donde no se pueden pasar funciones como valores.' },

        { p: '¿Cuándo usarías una fábrica?',
          r: 'Cuando construir algo requiere pasos, decisiones o configuración que no quiero repetir en cada punto de uso. El ejemplo típico es un ' +
             'cliente de base de datos con opciones específicas copiadas en doce archivos: cambiar una opción obliga a tocar los doce. ' +
             'Con una fábrica hay <b>un solo lugar que sabe cómo se arma</b> — y además es donde puede vivir la advertencia, por ejemplo que el ' +
             'cliente administrativo saltea RLS y solo va en el servidor.' },

        { p: '¿Cuál de las variantes de fábrica usás en la práctica?',
          r: 'La <b>función de fábrica</b>, en el 90% de los casos: una función que devuelve el objeto armado. El método de fábrica y la fábrica ' +
             'abstracta aparecen sobre todo en librerías y en lenguajes con jerarquías de clases pesadas. ' +
             'El <b>builder</b> sí lo uso cuando hay muchas combinaciones opcionales — la señal es una función con seis parámetros opcionales donde ' +
             'la mitad de los usos pasan <code>undefined</code>—, típicamente para armar consultas.' },

        { p: '¿Cómo combinás Strategy y Factory?',
          r: 'Con una <b>fábrica que devuelve una estrategia</b>, que es el caso más común en aplicaciones reales. La configuración —el modo, el valor, ' +
             'el plan del tenant— entra en la fábrica, y sale una estrategia ya armada que solo sabe aplicar el cálculo. ' +
             'El beneficio concreto es que la decisión de "qué cálculo corresponde" ocurre <b>una vez</b>, en la fábrica, ' +
             'en vez de repetirse en cada punto donde se cobra.' },
      ],

      practica: `
<h4>Strategy tipada, sin perder la unión de claves</h4>
<pre><code>export interface EstrategiaEnvio {
  calcular(pedido: Pedido): number;
  disponiblePara(pedido: Pedido): boolean;
}

const ESTRATEGIAS = {
  estandar: { calcular: (p) =&gt; p.peso * 200, disponiblePara: () =&gt; true },
  express:  { calcular: (p) =&gt; p.peso * 500 + 1000, disponiblePara: (p) =&gt; p.peso &lt; 30 },
  retiro:   { calcular: () =&gt; 0, disponiblePara: (p) =&gt; p.tieneSucursalCerca },
} satisfies Record&lt;string, EstrategiaEnvio&gt;;

export type TipoEnvio = keyof typeof ESTRATEGIAS;   // 'estandar'|'express'|'retiro'</code></pre>

<div class="aviso"><strong>Usar <code>satisfies</code> y no <code>as</code> es la diferencia entre tener
verificación y no tenerla.</strong> Con <code>as Record&lt;string, EstrategiaEnvio&gt;</code> el tipo se
ensancha y cualquier cadena compila; con <code>satisfies</code> se verifica cada entrada y
<code>TipoEnvio</code> queda como la unión exacta.</div>

<h4>Fábrica con la advertencia adentro</h4>
<pre><code>// infraestructura/supabase.ts
import 'server-only';

/** Cliente con la sesión del usuario. RLS aplica. Usá este por defecto. */
export function clienteServidor() {
  return createServerClient(URL, ANON_KEY, { cookies: cookies() });
}

/**
 * ⚠️ SALTEA RLS POR COMPLETO. Equivale a administrador de la base.
 * Solo para operaciones que genuinamente necesitan cruzar tenants.
 * Cada uso debe justificar por qué no alcanza con clienteServidor().
 */
export function clienteAdmin() {
  return createClient(URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}</code></pre>

<div class="dato"><strong>Ese comentario en la fábrica vale más que un documento aparte:</strong> aparece en el
autocompletado del editor, justo en el momento en que alguien está por usarlo. La documentación que llega
cuando hace falta es la única que se lee.</div>

<h4>Builder para consultas</h4>
<pre><code>class ConsultaPedidos {
  private filtros: Filtro[] = [];
  private orden?: Orden;
  private tope = 100;

  delTenant(id: string) { this.filtros.push(['tenant_id', id]); return this; }
  conEstado(e: Estado)  { this.filtros.push(['estado', e]);     return this; }
  limite(n: number)     { this.tope = Math.min(n, 500);          return this; }

  async ejecutar() { … }
}</code></pre>
<p>El <code>Math.min</code> del límite es la ventaja escondida: un builder es <b>el lugar natural para poner
topes de seguridad</b> que de otro modo habría que repetir en cada consulta.</p>

<h4>Cuándo NO usar estos patrones</h4>
<table>
<tr><th>Situación</th><th>Qué hacer</th></tr>
<tr><td>Dos variantes estables</td><td>Un <code>if</code>. Es más corto y más claro</td></tr>
<tr><td>Conjunto cerrado de casos</td><td><code>switch</code> exhaustivo sobre un tipo union</td></tr>
<tr><td>Creación de una línea</td><td>Sin fábrica: solo agrega indirección</td></tr>
<tr><td>Un objeto con dos campos</td><td>Sin builder: un objeto literal alcanza</td></tr>
</table>
`,

      errores: [
        { mito: 'Strategy necesita una clase por variante.',
          realidad: 'En JavaScript, <b>una función alcanza</b>. Las clases de los ejemplos vienen de lenguajes donde no se pueden pasar funciones como ' +
                    'valores. Tres archivos de andamiaje para envolver una línea es aplicar el ejemplo, no el patrón.' },

        { mito: 'Toda creación de objeto merece una fábrica.',
          realidad: 'Si crear es una línea sin decisiones ni configuración, la fábrica <b>solo agrega indirección</b>. Se justifica cuando hay pasos, ' +
                    'opciones repetidas o una advertencia que conviene que viaje con el constructor.' },

        { mito: 'Uso as Record para tipar el mapa de estrategias.',
          realidad: '<code>as</code> <b>ensancha</b> el tipo y cualquier cadena compila. Con <code>satisfies</code> se verifica cada entrada y el tipo ' +
                    'de las claves queda como la unión exacta.' },

        { mito: 'Un builder siempre es más elegante que parámetros.',
          realidad: 'Con dos o tres campos, un objeto literal es más corto y más claro. El builder se justifica cuando hay <b>muchas combinaciones ' +
                    'opcionales</b> y la mitad de los usos pasarían <code>undefined</code>.' },
      ],

      glosario: [
        { t: 'Strategy', d: 'Patrón donde cada forma de hacer algo es una pieza intercambiable.' },
        { t: 'Factory', d: 'Patrón que encapsula cómo se crea algo.' },
        { t: 'Función de fábrica', d: 'La variante más común: una función que devuelve el objeto armado.' },
        { t: 'Builder', d: 'Construcción paso a paso, útil con muchas opciones combinables.' },
        { t: 'satisfies', d: 'Operador de TypeScript que verifica sin ensanchar el tipo.' },
        { t: 'Punto de despacho', d: 'El lugar que elige qué estrategia usar. No debería crecer.' },
        { t: 'Andamiaje', d: 'Código de estructura que no aporta comportamiento. Señal de patrón mal aplicado.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Adapter, Facade y Decorator',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> los tres envuelven algo, y se distinguen por
<b>para qué</b>: Adapter cambia la forma, Facade simplifica, Decorator agrega comportamiento.</div>

<h4>Adapter: hacer que encaje</h4>
<p>Tenés una interfaz que tu código espera y algo externo con otra forma. El adaptador traduce.</p>
<pre><code>// Tu código quiere esto
interface Notificador { enviar(a: string, asunto: string, cuerpo: string): Promise&lt;void&gt; }

// El proveedor ofrece otra cosa
// resend.emails.send({ from, to, subject, html })

// El adaptador traduce, y nada más
export const notificadorResend: Notificador = {
  async enviar(a, asunto, cuerpo) {
    await resend.emails.send({ from: REMITENTE, to: a, subject: asunto, html: cuerpo });
  },
};</code></pre>

<div class="aviso"><strong>El valor no es "poder cambiar de proveedor mañana"</strong> —eso pasa poco—.
El valor real es que <b>el resto del código no habla el idioma del proveedor</b>: no aparecen <code>from</code>,
<code>html</code> ni objetos de configuración en el medio de una regla de negocio. Y como efecto secundario,
cambiar de proveedor se vuelve posible.</div>

<h4>Facade: una puerta simple a algo complicado</h4>
<p>Cuando una operación real requiere coordinar cinco cosas, la fachada expone una función y esconde el orden.</p>
<pre><code>// ❌ Cada punto de uso repite la coreografía
const cliente = await crearCliente(datos);
const tenant  = await crearTenant(cliente.id);
await asignarRol(cliente.id, tenant.id, 'admin');
await crearBucket(tenant.id);
await enviarBienvenida(cliente.email);

// ✔ Una fachada
await altaDeCliente(datos);</code></pre>

<h4>Decorator: agregar sin modificar</h4>
<p>Envolver algo para sumarle comportamiento, manteniendo la misma interfaz.</p>
<pre><code>// La función original no se toca
const conReintento = (fn) =&gt; async (...args) =&gt; { /* reintenta */ };
const conCache     = (fn) =&gt; async (...args) =&gt; { /* cachea */ };
const conMetricas  = (fn) =&gt; async (...args) =&gt; { /* mide */ };

const buscarPrecio = conMetricas(conCache(conReintento(buscarPrecioApi)));</code></pre>

<div class="dato"><strong>El orden importa y casi nadie lo piensa.</strong> En ese ejemplo, la caché está
<b>afuera</b> del reintento: si hay acierto, no se reintenta nada. Si estuvieran al revés, cada acierto de caché
igual pasaría por la lógica de reintento. <b>Leé la composición de adentro hacia afuera y preguntate qué envuelve
a qué.</b></div>
`,

      tecnico: `
<h4>Los tres, comparados</h4>
<table>
<tr><th></th><th>Adapter</th><th>Facade</th><th>Decorator</th></tr>
<tr><td>Cambia la interfaz</td><td><b>Sí</b></td><td>Sí, la simplifica</td><td><b>No</b>: la mantiene</td></tr>
<tr><td>Envuelve</td><td>Una cosa</td><td>Varias</td><td>Una cosa</td></tr>
<tr><td>Agrega comportamiento</td><td>No</td><td>Coordina</td><td><b>Sí</b></td></tr>
<tr><td>Se apila</td><td>No</td><td>No</td><td><b>Sí</b>, en cadena</td></tr>
</table>

<div class="dato"><strong>La prueba para distinguirlos:</strong> si podés usar el resultado en el mismo lugar
donde usabas el original, es <b>Decorator</b>. Si tuviste que cambiar cómo se lo llama, es <b>Adapter</b>. Si
juntaste varias llamadas en una, es <b>Facade</b>.</div>

<h4>Adaptador con normalización de errores</h4>
<p>Un adaptador que solo traduce nombres de campos hace la mitad del trabajo. La otra mitad es
<b>normalizar los errores</b>, porque cada proveedor los reporta distinto:</p>
<pre><code>export const notificadorResend: Notificador = {
  async enviar(a, asunto, cuerpo) {
    try {
      const { error } = await resend.emails.send({ … });
      if (error) throw new ErrorNotificacion(error.message, { causa: error });
    } catch (e) {
      // El resto del sistema maneja UN tipo de error, no los de cada proveedor
      throw e instanceof ErrorNotificacion ? e : new ErrorNotificacion('Fallo al enviar', { causa: e });
    }
  },
};</code></pre>

<div class="dato"><strong>Sin esa normalización, el manejo de errores del proveedor se filtra a toda la
aplicación</strong> — y ahí el adaptador deja de servir para lo que existía: vas a tener <code>if
(error.statusCode === 429)</code> en el medio de una regla de negocio, y cambiar de proveedor vuelve a ser
imposible.</div>

<h4>Decorator: los envoltorios que valen la pena</h4>
<pre><code>// Cada uno hace una cosa y se puede probar aparte
export const conReintento = &lt;A extends any[], R&gt;(
  fn: (...args: A) =&gt; Promise&lt;R&gt;, opciones = { max: 3 },
) =&gt; async (...args: A): Promise&lt;R&gt; =&gt; { … };

export const conTimeout = &lt;A extends any[], R&gt;(
  fn: (...args: A) =&gt; Promise&lt;R&gt;, ms: number,
) =&gt; async (...args: A): Promise&lt;R&gt; =&gt; { … };

// El orden es una decisión, no un detalle:
const buscar = conMetricas(          // mide TODO, incluido el reintento
                 conCache(           // si hay acierto, no reintenta ni espera
                   conReintento(
                     conTimeout(buscarApi, 5000))));</code></pre>

<h4>Facade y el riesgo de que crezca</h4>
<p>Una fachada empieza con cinco líneas y a los seis meses tiene doscientas y ocho parámetros opcionales. El
síntoma: cada caso nuevo agrega una bandera. La cura es <b>varias fachadas específicas</b> en vez de una
genérica:</p>
<pre><code>❌ altaDeCliente(datos, { conBucket, conBienvenida, esInterno, saltearPago })

✔ altaDeClienteEstandar(datos)
✔ altaDeClienteInterno(datos)
✔ altaDeClienteImportado(datos)
   … y las tres reusan las mismas piezas internas</code></pre>

<div class="dato"><strong>Es el mismo diagnóstico del módulo anterior:</strong> los parámetros booleanos que
cambian <b>qué</b> hace la función son varias funciones comprimidas. Que sea una fachada no lo cambia — solo lo
hace más difícil de ver, porque parece que "coordinar" justifica la complejidad.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="pt2" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS TRES ENVUELVEN — se distinguen por PARA QUÉ</text>

  <rect x="24" y="34" width="200" height="112" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="124" y="56" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">ADAPTER</text>
  <text x="124" y="76" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">cambia la FORMA</text>
  <rect x="44" y="86" width="70" height="22" rx="5" fill="#f87171" fill-opacity=".25"/>
  <text x="79" y="101" text-anchor="middle" fill="currentColor" font-size="8.5">proveedor</text>
  <line x1="118" y1="97" x2="134" y2="97" stroke="#22d3ee" stroke-width="1.5" marker-end="url(#pt2)" color="#22d3ee"/>
  <rect x="138" y="86" width="66" height="22" rx="5" fill="#34d399" fill-opacity=".25"/>
  <text x="171" y="101" text-anchor="middle" fill="currentColor" font-size="8.5">tu forma</text>
  <text x="124" y="126" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-weight="700">tu código no habla</text>
  <text x="124" y="140" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-weight="700">el idioma del proveedor</text>

  <rect x="240" y="34" width="200" height="112" rx="10" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="56" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">FACADE</text>
  <text x="340" y="76" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">SIMPLIFICA varias</text>
  <rect x="260" y="86" width="160" height="14" rx="4" fill="#fbbf24" fill-opacity=".3"/>
  <text x="340" y="97" text-anchor="middle" fill="#3d2c05" font-size="8.5" font-weight="700">altaDeCliente(datos)</text>
  <text x="260" y="114" fill="currentColor" opacity=".55" font-size="8.5">crearCliente · crearTenant · asignarRol</text>
  <text x="260" y="128" fill="currentColor" opacity=".55" font-size="8.5">crearBucket · enviarBienvenida</text>
  <text x="340" y="142" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">esconde el ORDEN</text>

  <rect x="456" y="34" width="200" height="112" rx="10" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="556" y="56" text-anchor="middle" fill="#7c5cff" font-size="11.5" font-weight="700">DECORATOR</text>
  <text x="556" y="76" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">AGREGA, misma interfaz</text>
  <rect x="472" y="86" width="168" height="18" rx="5" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-opacity=".5"/>
  <rect x="482" y="90" width="148" height="10" rx="3" fill="#7c5cff" fill-opacity=".2"/>
  <rect x="492" y="92" width="128" height="6" rx="2" fill="#7c5cff" fill-opacity=".35"/>
  <text x="556" y="120" text-anchor="middle" fill="#7c5cff" font-size="9.5" font-weight="700">se APILA en cadena</text>
  <text x="556" y="138" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">métricas(cache(reintento(fn)))</text>

  <rect x="24" y="158" width="632" height="30" rx="8" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="340" y="178" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">
    La prueba: ¿lo usás en el mismo lugar? Decorator. ¿Cambiaste cómo se llama? Adapter. ¿Juntaste varias? Facade.</text>

  <line x1="24" y1="206" x2="656" y2="206" stroke="currentColor" opacity=".18"/>

  <text x="24" y="230" fill="#fbbf24" font-size="12" font-weight="700">
    EL ORDEN DE LOS DECORADORES ES UNA DECISIÓN, NO UN DETALLE</text>

  <rect x="24" y="242" width="304" height="70" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.3"/>
  <text x="176" y="262" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">✓ cache AFUERA del reintento</text>
  <text x="44" y="282" fill="currentColor" opacity=".7" font-size="9.5" font-family="monospace">conCache(conReintento(fn))</text>
  <text x="44" y="302" fill="#34d399" font-size="10" font-weight="700">si hay acierto, no reintenta ni espera</text>

  <rect x="352" y="242" width="304" height="70" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="504" y="262" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">✗ cache ADENTRO</text>
  <text x="372" y="282" fill="currentColor" opacity=".7" font-size="9.5" font-family="monospace">conReintento(conCache(fn))</text>
  <text x="372" y="302" fill="#f87171" font-size="10" font-weight="700">cada acierto pasa igual por la lógica de reintento</text>

  <rect x="24" y="326" width="632" height="60" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="346" fill="#f87171" font-size="11.5" font-weight="700">LA FACHADA QUE CRECE — el síntoma es que cada caso nuevo agrega una bandera</text>
  <text x="44" y="365" fill="currentColor" opacity=".7" font-size="10.5" font-family="monospace">
    ✗ altaDeCliente(datos, { conBucket, conBienvenida, esInterno, saltearPago })</text>
  <text x="44" y="381" fill="#34d399" font-size="10.5" font-family="monospace" font-weight="700">
    ✓ altaEstandar() · altaInterno() · altaImportado()  ← reusan las mismas piezas</text>
</svg>`,
        pie: 'Adapter cambia la forma. Facade simplifica. Decorator agrega manteniendo la interfaz.',
      },

      entrevista: [
        { p: '¿Cómo distinguís Adapter, Facade y Decorator?',
          r: 'Los tres envuelven algo; se distinguen por el propósito. <b>Adapter</b> cambia la forma para que algo externo encaje con la interfaz que ' +
             'tu código espera. <b>Facade</b> junta varias operaciones en una para esconder el orden. <b>Decorator</b> agrega comportamiento ' +
             '<b>manteniendo la misma interfaz</b>, y por eso se apila. La prueba rápida: si podés usar el resultado en el mismo lugar donde usabas ' +
             'el original, es Decorator; si tuviste que cambiar cómo se lo llama, Adapter; si juntaste varias llamadas en una, Facade.' },

        { p: '¿Cuál es el valor real de un adaptador?',
          r: 'No es "poder cambiar de proveedor mañana", que pasa poco. Es que <b>el resto del código no habla el idioma del proveedor</b>: ' +
             'no aparecen <code>from</code>, <code>html</code> ni objetos de configuración en el medio de una regla de negocio. ' +
             'Y hay una segunda mitad que se suele olvidar: <b>normalizar los errores</b>. Sin eso vas a terminar con ' +
             '<code>if (error.statusCode === 429)</code> dentro de una regla de negocio, y el adaptador deja de servir para lo que existía.' },

        { p: '¿Por qué importa el orden en que componés decoradores?',
          r: 'Porque cambia el comportamiento. Con <code>conCache(conReintento(fn))</code>, la caché está afuera: si hay acierto, ' +
             '<b>no se reintenta ni se espera nada</b>. Al revés, cada acierto de caché igual pasa por la lógica de reintento. ' +
             'Lo mismo con métricas: si están afuera, miden el tiempo total incluidos los reintentos; si están adentro, miden solo la llamada. ' +
             'Conviene leer la composición de adentro hacia afuera y preguntarse qué envuelve a qué.' },

        { p: '¿Cómo evitás que una fachada crezca sin control?',
          r: 'El síntoma es que cada caso nuevo agrega una bandera: <code>altaDeCliente(datos, { esInterno, saltearPago, … })</code>. ' +
             'La cura es <b>varias fachadas específicas</b> en vez de una genérica —alta estándar, alta interna, alta importada— que reusan las mismas ' +
             'piezas internas. Es el mismo diagnóstico de siempre: los booleanos que cambian <b>qué</b> hace la función son varias funciones ' +
             'comprimidas. Que sea una fachada solo lo hace más difícil de ver, porque parece que "coordinar" justifica la complejidad.' },
      ],

      practica: `
<h4>Adaptador completo: forma + errores</h4>
<pre><code>// funcionalidades/notificaciones/tipos.ts — lo define el consumidor
export interface Notificador {
  enviar(a: string, asunto: string, cuerpo: string): Promise&lt;void&gt;;
}
export class ErrorNotificacion extends Error {
  constructor(msg: string, public opciones?: { causa?: unknown; reintentable?: boolean }) {
    super(msg);
  }
}

// infraestructura/notificador-resend.ts
export const notificadorResend: Notificador = {
  async enviar(a, asunto, cuerpo) {
    const { error } = await resend.emails.send({
      from: REMITENTE, to: a, subject: asunto, html: cuerpo,
    });
    if (error) {
      throw new ErrorNotificacion(error.message, {
        causa: error,
        reintentable: error.name === 'rate_limit_exceeded',
      });
    }
  },
};</code></pre>

<div class="aviso"><strong>El campo <code>reintentable</code> es lo que hace que el adaptador realmente
aísle.</strong> El proveedor sabe cuál de sus errores es transitorio; el resto del sistema solo necesita saber
si conviene reintentar. Sin ese campo, la lógica de reintento tiene que conocer los códigos de error de cada
proveedor — y ahí el aislamiento se rompió.</div>

<h4>Decoradores componibles</h4>
<pre><code>type Async&lt;A extends any[], R&gt; = (...args: A) =&gt; Promise&lt;R&gt;;

export function conTimeout&lt;A extends any[], R&gt;(fn: Async&lt;A, R&gt;, ms: number): Async&lt;A, R&gt; {
  return async (...args) =&gt; {
    const t = new Promise&lt;never&gt;((_, rej) =&gt;
      setTimeout(() =&gt; rej(new Error('timeout')), ms));
    return Promise.race([fn(...args), t]);
  };
}

export function conMetricas&lt;A extends any[], R&gt;(fn: Async&lt;A, R&gt;, nombre: string): Async&lt;A, R&gt; {
  return async (...args) =&gt; {
    const inicio = performance.now();
    try {
      return await fn(...args);
    } finally {
      metricas.histograma('operacion_ms', performance.now() - inicio, { nombre });
    }
  };
}

// La composición documenta la decisión
export const buscarPrecio = conMetricas(
  conCache(conReintento(conTimeout(buscarPrecioApi, 5000))),
  'buscar_precio',
);</code></pre>

<h4>Fachada que no crece</h4>
<pre><code>// Piezas internas, reutilizables
async function crearCuentaBase(datos) { … }
async function prepararStorage(tenantId) { … }
async function darBienvenida(email) { … }

// Fachadas específicas — sin banderas
export async function altaEstandar(datos) {
  const { tenantId, email } = await crearCuentaBase(datos);
  await prepararStorage(tenantId);
  await darBienvenida(email);
}

export async function altaImportado(datos) {
  const { tenantId } = await crearCuentaBase(datos);
  await prepararStorage(tenantId);
  // sin bienvenida: son cuentas migradas, ya son clientes
}</code></pre>

<h4>Cuándo cada uno</h4>
<table>
<tr><th>Situación</th><th>Patrón</th></tr>
<tr><td>La API externa tiene otra forma que la tuya</td><td>Adapter</td></tr>
<tr><td>Una operación real requiere coordinar cinco cosas</td><td>Facade</td></tr>
<tr><td>Querés reintento, caché o métricas sin tocar la función</td><td>Decorator</td></tr>
<tr><td>Querés cambiar de proveedor sin tocar el negocio</td><td>Adapter</td></tr>
<tr><td>El mismo comportamiento extra en muchas funciones</td><td>Decorator</td></tr>
</table>
`,

      errores: [
        { mito: 'El adaptador solo traduce nombres de campos.',
          realidad: 'Esa es la mitad. La otra es <b>normalizar los errores</b>: sin eso terminás con los códigos del proveedor dentro de tus reglas de ' +
                    'negocio, y el aislamiento que justificaba el adaptador desaparece.' },

        { mito: 'El orden de los decoradores da igual.',
          realidad: 'Cambia el comportamiento. Con la caché <b>afuera</b> del reintento, un acierto no reintenta nada; al revés, cada acierto pasa por ' +
                    'toda la lógica. Leé la composición de adentro hacia afuera.' },

        { mito: 'Una fachada con opciones es más flexible.',
          realidad: 'Cada bandera es un caso distinto comprimido. Terminás con ocho parámetros opcionales y nadie sabe qué combinación es válida. ' +
                    '<b>Varias fachadas específicas</b> que reusan las mismas piezas es más claro.' },

        { mito: 'Uso Adapter para poder cambiar de proveedor mañana.',
          realidad: 'Eso pasa poco, y no es el beneficio principal. El beneficio real y cotidiano es que <b>tus reglas de negocio no hablan el idioma ' +
                    'del proveedor</b>. Cambiar de proveedor es un efecto secundario.' },
      ],

      glosario: [
        { t: 'Adapter', d: 'Traduce entre la interfaz de algo externo y la que tu código espera.' },
        { t: 'Facade', d: 'Expone una operación simple que coordina varias por dentro.' },
        { t: 'Decorator', d: 'Envuelve algo agregando comportamiento sin cambiar su interfaz.' },
        { t: 'Composición', d: 'Encadenar decoradores. El orden define el comportamiento.' },
        { t: 'Normalizar errores', d: 'Convertir errores de un proveedor a un tipo propio del sistema.' },
        { t: 'Error reintentable', d: 'Marca que indica si conviene volver a intentar. La pone el adaptador.' },
        { t: 'Coreografía', d: 'Secuencia de llamadas que una fachada esconde.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Repository y los patrones de datos',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> Repository es "el único lugar del sistema que sabe
cómo se guardan las cosas". Todo el resto le pide, y no sabe si abajo hay SQL, un archivo o una API.</div>

<h4>Qué problema resuelve</h4>
<p>Sin repositorio, las consultas se esparcen:</p>
<pre><code>// En un componente
const { data } = await supabase.from('pedidos').select('*').eq('estado', 'pendiente');

// En una Server Action
const { data } = await supabase.from('pedidos').select('*, cliente(*)').eq('estado', 'pendiente');

// En un reporte
const { data } = await supabase.from('pedidos').select('id, total').eq('estado','pendiente');</code></pre>
<p>Tres versiones de "los pedidos pendientes", en tres lugares. Cuando agregues una condición —por ejemplo,
excluir los cancelados lógicamente— vas a arreglar dos y olvidar la tercera.</p>

<div class="aviso"><strong>Ese olvido es el problema real, y es peor de lo que parece</strong>: el reporte va a
seguir funcionando y mostrando números <b>distintos</b> a los de la pantalla. Nadie ve un error; alguien ve una
inconsistencia meses después y nadie sabe cuál de los dos está bien.</div>

<h4>Con repositorio</h4>
<pre><code>// datos/pedidos.ts — el ÚNICO lugar que sabe cómo se consultan
export const pedidos = {
  pendientes: () =&gt; …,
  porId: (id) =&gt; …,
  crear: (datos) =&gt; …,
  cambiarEstado: (id, estado) =&gt; …,
};

// Todo el resto
const lista = await pedidos.pendientes();</code></pre>

<h4>La ventaja que se nota primero</h4>
<p>No es la portabilidad: es que <b>la regla vive en un lugar</b>. "Pendiente" significa una cosa en todo el
sistema, y cambiarla es un solo cambio.</p>

<h4>Y la advertencia</h4>
<p>Un repositorio que solo reenvía llamadas a la base sin agregar nada es <b>una capa de indirección
gratis</b>. Si tus métodos son <code>obtenerTodos()</code>, <code>obtenerPorId()</code> y
<code>guardar()</code> y nada más, no ganaste nada. El valor aparece cuando los métodos hablan el idioma del
<b>negocio</b>, no el de la tabla.</p>
`,

      tecnico: `
<h4>Repositorio orientado al dominio</h4>
<pre><code>// ❌ Genérico: es la tabla con otro nombre
interface RepoPedidos {
  obtenerTodos(): Promise&lt;Pedido[]&gt;;
  obtenerPorId(id: string): Promise&lt;Pedido&gt;;
  actualizar(id: string, campos: Partial&lt;Pedido&gt;): Promise&lt;void&gt;;
}

// ✔ Del dominio: los nombres son del negocio
interface RepoPedidos {
  pendientesDelTenant(tenantId: string): Promise&lt;Pedido[]&gt;;
  vencidosSinFacturar(desde: Date): Promise&lt;Pedido[]&gt;;
  marcarPagado(id: string, pagoId: string): Promise&lt;void&gt;;
  cancelar(id: string, motivo: string): Promise&lt;void&gt;;
}</code></pre>

<div class="dato"><strong>La diferencia práctica es enorme:</strong> con el primero, cada punto de uso tiene
que saber que "pendiente" es <code>estado = 'pendiente' AND cancelado_en IS NULL AND tenant_id = …</code>. ' +
Con el segundo, esa definición vive una sola vez. <b>El repositorio genérico traslada el conocimiento al
consumidor; el de dominio lo concentra.</b></div>

<h4>El problema N+1, que aparece con o sin repositorio</h4>
<pre><code>// ❌ 1 consulta + N consultas
const pedidos = await repo.pendientes();
for (const p of pedidos) {
  p.cliente = await repoClientes.porId(p.clienteId);   // ← una por pedido
}

// ✔ El repositorio expone la variante que trae lo necesario
const pedidos = await repo.pendientesConCliente();</code></pre>

<div class="dato"><strong>Y acá aparece la tensión real del patrón:</strong> si el repositorio expone una
variante por cada combinación de datos relacionados, termina con treinta métodos. Si expone una sola, o trae de
más o produce N+1. <b>La solución práctica es un parámetro explícito de inclusión</b> —
<code>pendientes({ incluir: ['cliente'] })</code>— que mantiene el control en el consumidor sin que este sepa
cómo se arma la consulta.</div>

<h4>Unidad de trabajo: varias operaciones, una transacción</h4>
<pre><code>// El problema: si falla el segundo paso, el primero ya se escribió
await repoPedidos.marcarPagado(id, pagoId);
await repoStock.descontar(items);         // ← si falla acá, quedó inconsistente

// La solución: una unidad de trabajo
await enTransaccion(async (tx) =&gt; {
  await repoPedidos.conTx(tx).marcarPagado(id, pagoId);
  await repoStock.conTx(tx).descontar(items);
});</code></pre>

<div class="dato"><strong>Y el límite que hay que conocer:</strong> una transacción de base de datos
<b>no puede abarcar una llamada a un servicio externo</b>. Si el flujo es "cobrar en la pasarela y marcar el
pedido", no hay transacción que lo cubra: el cobro ya ocurrió afuera. Eso se resuelve con idempotencia y
compensación, no con transacciones — y es el tema del módulo de eventos.</div>

<h4>Cuándo el repositorio NO vale la pena</h4>
<table>
<tr><th>Situación</th><th>Por qué</th></tr>
<tr><td>Prototipo o proyecto de un archivo</td><td>La indirección cuesta más de lo que ahorra</td></tr>
<tr><td>Consultas de una línea, usadas una vez</td><td>No hay conocimiento que concentrar</td></tr>
<tr><td>El "repositorio" solo reenvía</td><td>Es una capa gratis</td></tr>
<tr><td>Ya usás un ORM con repositorios</td><td>No pongas uno encima del otro</td></tr>
</table>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="pt3" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="22" fill="#f87171" font-size="12" font-weight="700">
    SIN REPOSITORIO — “pendiente” significa tres cosas distintas</text>

  <rect x="24" y="34" width="180" height="34" rx="7" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.2"/>
  <text x="114" y="55" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">componente</text>

  <rect x="216" y="34" width="180" height="34" rx="7" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.2"/>
  <text x="306" y="55" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">Server Action</text>

  <rect x="408" y="34" width="180" height="34" rx="7" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.2"/>
  <text x="498" y="55" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">reporte</text>

  <line x1="114" y1="72" x2="114" y2="94" stroke="#f87171" stroke-width="1.4" marker-end="url(#pt3)" color="#f87171"/>
  <line x1="306" y1="72" x2="306" y2="94" stroke="#f87171" stroke-width="1.4" marker-end="url(#pt3)" color="#f87171"/>
  <line x1="498" y1="72" x2="498" y2="94" stroke="#f87171" stroke-width="1.4" marker-end="url(#pt3)" color="#f87171"/>

  <rect x="24" y="98" width="564" height="30" rx="7" fill="#f87171" fill-opacity=".22" stroke="#f87171" stroke-width="1.4"/>
  <text x="306" y="118" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">tres consultas distintas a la misma tabla</text>

  <rect x="24" y="136" width="632" height="42" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="156" fill="#f87171" font-size="11" font-weight="700">Agregás una condición, arreglás dos y olvidás la tercera.</text>
  <text x="44" y="172" fill="currentColor" opacity=".72" font-size="10.5">
    El reporte sigue funcionando y muestra números DISTINTOS. Nadie ve un error — solo una inconsistencia, meses después.</text>

  <line x1="24" y1="196" x2="656" y2="196" stroke="currentColor" opacity=".18"/>

  <text x="24" y="220" fill="#34d399" font-size="12" font-weight="700">
    CON REPOSITORIO — un solo lugar sabe cómo se consulta</text>

  <rect x="24" y="232" width="180" height="30" rx="7" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="114" y="251" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">componente</text>
  <rect x="216" y="232" width="180" height="30" rx="7" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="306" y="251" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">Server Action</text>
  <rect x="408" y="232" width="180" height="30" rx="7" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="498" y="251" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">reporte</text>

  <line x1="114" y1="266" x2="280" y2="282" stroke="#34d399" stroke-width="1.4" marker-end="url(#pt3)" color="#34d399"/>
  <line x1="306" y1="266" x2="306" y2="282" stroke="#34d399" stroke-width="1.4" marker-end="url(#pt3)" color="#34d399"/>
  <line x1="498" y1="266" x2="336" y2="282" stroke="#34d399" stroke-width="1.4" marker-end="url(#pt3)" color="#34d399"/>

  <rect x="180" y="286" width="252" height="34" rx="8" fill="#34d399" fill-opacity=".24" stroke="#34d399" stroke-width="1.6"/>
  <text x="306" y="307" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">pedidos.pendientesDelTenant()</text>

  <rect x="24" y="334" width="304" height="52" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="176" y="352" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">✗ repositorio genérico</text>
  <text x="44" y="370" fill="currentColor" opacity=".65" font-size="9.5" font-family="monospace">obtenerTodos() · obtenerPorId()</text>
  <text x="44" y="382" fill="#f87171" font-size="9.5" font-weight="700">es la tabla con otro nombre: capa gratis</text>

  <rect x="352" y="334" width="304" height="52" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="352" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">✓ repositorio del dominio</text>
  <text x="372" y="370" fill="currentColor" opacity=".65" font-size="9.5" font-family="monospace">vencidosSinFacturar() · marcarPagado()</text>
  <text x="372" y="382" fill="#34d399" font-size="9.5" font-weight="700">concentra el conocimiento en vez de trasladarlo</text>
</svg>`,
        pie: 'El repositorio genérico traslada el conocimiento al consumidor. El de dominio lo concentra.',
      },

      entrevista: [
        { p: '¿Qué problema resuelve el patrón Repository?',
          r: 'Que la <b>definición de una consulta viva en un solo lugar</b>. Sin él, "los pedidos pendientes" termina escrito de tres formas distintas ' +
             'en un componente, una acción y un reporte. Cuando agregás una condición, arreglás dos y olvidás la tercera — y lo peor es que ' +
             '<b>no hay ningún error</b>: el reporte sigue funcionando y muestra números distintos a los de la pantalla. ' +
             'Alguien ve la inconsistencia meses después y nadie sabe cuál de los dos está bien.' },

        { p: '¿Cuándo un repositorio no aporta nada?',
          r: 'Cuando sus métodos son <code>obtenerTodos</code>, <code>obtenerPorId</code> y <code>guardar</code>: eso es la tabla con otro nombre, ' +
             'una capa de indirección gratis. El valor aparece cuando los métodos hablan el idioma del <b>negocio</b>: ' +
             '<code>vencidosSinFacturar</code>, <code>marcarPagado</code>, <code>pendientesDelTenant</code>. ' +
             'La diferencia es que el repositorio genérico <b>traslada</b> el conocimiento al consumidor —que tiene que saber qué significa "pendiente"— ' +
             'y el de dominio lo <b>concentra</b>.' },

        { p: '¿Cómo manejás el problema N+1 con un repositorio?',
          r: 'Es la tensión real del patrón. Si expongo una variante por cada combinación de datos relacionados, termino con treinta métodos; ' +
             'si expongo una sola, o traigo de más o produzco N+1. La solución práctica es un <b>parámetro explícito de inclusión</b> — ' +
             '<code>pendientes({ incluir: [\'cliente\'] })</code>—, que deja el control en el consumidor sin que este tenga que saber cómo se arma ' +
             'la consulta. Lo que hay que evitar es el bucle que llama al repositorio una vez por elemento.' },

        { p: '¿Qué es una unidad de trabajo y cuál es su límite?',
          r: 'Es agrupar varias operaciones en <b>una sola transacción</b>, para que o se escriben todas o ninguna: marcar el pedido pagado y descontar ' +
             'stock no pueden quedar a medias. El <b>límite</b> es importante: una transacción de base de datos <b>no puede abarcar una llamada a un ' +
             'servicio externo</b>. Si el flujo es "cobrar en la pasarela y marcar el pedido", el cobro ya ocurrió afuera y no hay rollback posible. ' +
             'Eso se resuelve con idempotencia y compensación, no con transacciones.' },
      ],

      practica: `
<h4>Repositorio de dominio</h4>
<pre><code>// datos/pedidos.ts
import 'server-only';

export const pedidos = {
  async pendientesDelTenant(tenantId: string, opciones?: { incluir?: ('cliente')[] }) {
    const seleccion = opciones?.incluir?.includes('cliente')
      ? '*, cliente:clientes(id, nombre, email)'
      : '*';

    const { data, error } = await supabase
      .from('pedidos')
      .select(seleccion)
      .eq('tenant_id', tenantId)
      .eq('estado', 'pendiente')
      .is('cancelado_en', null)          // ← la regla vive ACÁ, una vez
      .order('creado_en', { ascending: false });

    if (error) throw new ErrorDatos('No se pudieron leer los pedidos', { causa: error });
    return data;
  },

  async marcarPagado(id: string, pagoId: string) { … },
  async cancelar(id: string, motivo: string) { … },
};</code></pre>

<div class="aviso"><strong>La línea de <code>cancelado_en</code> es todo el valor del patrón.</strong> Es la
regla que, sin repositorio, alguien iba a olvidar en el reporte. Acá está una vez y aplica a todos los
consumidores automáticamente.</div>

<h4>Unidad de trabajo con Postgres</h4>
<pre><code>-- Lo más simple y robusto: una función en la base
create or replace function confirmar_pago(p_pedido uuid, p_pago text)
returns void language plpgsql as $$
begin
  update pedidos set estado = 'pagado', pago_id = p_pago
   where id = p_pedido and estado = 'pendiente';

  if not found then
    raise exception 'Pedido no encontrado o en estado inválido';
  end if;

  update stock s set cantidad = s.cantidad - i.cantidad
    from pedido_items i
   where i.pedido_id = p_pedido and s.producto_id = i.producto_id;
end $$;</code></pre>
<p>Todo dentro de una transacción implícita: si algo falla, no queda nada a medias.</p>

<h4>Detectar N+1 en desarrollo</h4>
<pre><code>// Contador de consultas por petición: si un endpoint hace 40, hay N+1
let consultas = 0;
if (process.env.NODE_ENV !== 'production') {
  const original = supabase.from.bind(supabase);
  supabase.from = (t) =&gt; { consultas++; return original(t); };
}
// al terminar la petición
if (consultas &gt; 10) console.warn(\`⚠ \${consultas} consultas en \${ruta}\`);</code></pre>

<h4>Checklist</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Los métodos tienen nombres del <b>negocio</b>, no de la tabla</td></tr>
<tr><td>☐</td><td>Las reglas de filtrado viven una sola vez</td></tr>
<tr><td>☐</td><td>Los errores se normalizan a un tipo propio</td></tr>
<tr><td>☐</td><td>Hay una forma explícita de incluir relaciones</td></tr>
<tr><td>☐</td><td>Las operaciones que deben ser atómicas están en una transacción</td></tr>
<tr><td>☐</td><td>El repositorio es <code>server-only</code></td></tr>
</table>
`,

      errores: [
        { mito: 'Un repositorio sirve para poder cambiar de base de datos.',
          realidad: 'Eso pasa casi nunca. El beneficio real y cotidiano es que <b>la definición de una consulta vive una sola vez</b>, así que ' +
                    '"pendiente" significa lo mismo en la pantalla y en el reporte.' },

        { mito: 'Un repositorio con obtenerTodos y obtenerPorId ya es un repositorio.',
          realidad: 'Es la tabla con otro nombre: una <b>capa de indirección gratis</b>. Cada consumidor sigue teniendo que saber qué significa ' +
                    '"pendiente". El valor aparece con métodos del dominio.' },

        { mito: 'Con repositorio no hay N+1.',
          realidad: 'Un bucle que llama al repositorio una vez por elemento produce N+1 igual. Hace falta una forma explícita de <b>incluir ' +
                    'relaciones</b> en la consulta, y medir la cantidad de consultas por petición en desarrollo.' },

        { mito: 'Envuelvo todo en una transacción y listo.',
          realidad: 'Una transacción de base de datos <b>no puede abarcar una llamada externa</b>. Si ya cobraste en la pasarela, no hay rollback: ' +
                    'ese caso se resuelve con idempotencia y compensación.' },
      ],

      glosario: [
        { t: 'Repository', d: 'Único lugar que sabe cómo se consultan y guardan las entidades.' },
        { t: 'Repositorio de dominio', d: 'El que expone métodos con nombres del negocio, no de la tabla.' },
        { t: 'N+1', d: 'Una consulta inicial más una por cada resultado. Causa clásica de lentitud.' },
        { t: 'Inclusión explícita', d: 'Parámetro que indica qué relaciones traer en la misma consulta.' },
        { t: 'Unidad de trabajo', d: 'Agrupar operaciones en una transacción atómica.' },
        { t: 'Compensación', d: 'Deshacer con una operación inversa lo que no se puede revertir.' },
        { t: 'server-only', d: 'Marca que impide importar un módulo desde el cliente.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Observer y cuándo NO usar un patrón',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> Observer permite que algo avise "pasó esto" sin
saber quién escucha. Es potentísimo y es el patrón que <b>más fácil vuelve un sistema imposible de
seguir</b>.</div>

<h4>Observer, en criollo</h4>
<p>En vez de que "crear pedido" llame a las cinco cosas que tienen que pasar después, <b>emite un evento</b> y
quien quiera se suscribe.</p>
<pre><code>// ❌ Acoplado: crearPedido conoce a todos
async function crearPedido(datos) {
  const pedido = await guardar(datos);
  await enviarEmail(pedido);
  await descontarStock(pedido);
  await notificarDeposito(pedido);
  await registrarMetrica(pedido);
}

// ✔ Observer: crearPedido solo avisa
async function crearPedido(datos) {
  const pedido = await guardar(datos);
  emitir('pedido.creado', pedido);
}</code></pre>

<h4>Lo que ganás</h4>
<ul>
<li>Agregar una reacción nueva no toca <code>crearPedido</code>.</li>
<li>Cada reacción se puede probar aparte.</li>
<li>Si una falla, las otras pueden seguir.</li>
</ul>

<h4>Lo que perdés, y es mucho</h4>
<div class="aviso"><strong>Mirando <code>crearPedido</code> ya no sabés qué pasa después.</strong> Para
entender el flujo completo hay que buscar todos los suscriptores, que pueden estar en cualquier archivo. ' +
Depurar deja de ser "seguir el código" y pasa a ser "buscar quién escucha", y el orden de ejecución no está
escrito en ningún lado.</div>

<h4>La regla que ordena la decisión</h4>
<table>
<tr><th>Si…</th><th>Entonces</th></tr>
<tr><td>Las reacciones son <b>parte del negocio</b> y deben ocurrir sí o sí</td><td>Llamada directa</td></tr>
<tr><td>Las reacciones son <b>efectos secundarios</b> que pueden fallar</td><td>Evento</td></tr>
<tr><td>Hay <b>una o dos</b> reacciones</td><td>Llamada directa</td></tr>
<tr><td>Hay <b>muchas</b> y aparecen nuevas seguido</td><td>Evento</td></tr>
<tr><td>El orden importa</td><td>Llamada directa</td></tr>
</table>

<p>Descontar stock es parte del negocio: si falla, el pedido no debería quedar confirmado. Registrar una
métrica no lo es: si falla, no pasa nada.</p>
`,

      tecnico: `
<h4>Observer en proceso, y su límite</h4>
<pre><code>type Manejador&lt;T&gt; = (dato: T) =&gt; Promise&lt;void&gt;;

const suscriptores = new Map&lt;string, Manejador&lt;any&gt;[]&gt;();

export function alOcurrir&lt;T&gt;(evento: string, fn: Manejador&lt;T&gt;) {
  suscriptores.set(evento, [...(suscriptores.get(evento) ?? []), fn]);
}

export async function emitir&lt;T&gt;(evento: string, dato: T) {
  const fns = suscriptores.get(evento) ?? [];
  // Aisladas: si una falla, las otras siguen
  await Promise.allSettled(fns.map((fn) =&gt; fn(dato)));
}</code></pre>

<div class="dato"><strong><code>allSettled</code> y no <code>all</code> es la decisión clave.</strong> Con
<code>all</code>, un suscriptor que falla cancela el resto y propaga el error a quien emitió — lo que anula el
desacoplamiento, porque ahora <code>crearPedido</code> falla por culpa de una métrica. Pero
<code>allSettled</code> tiene su propio riesgo: <b>si nadie mira los resultados, los errores desaparecen en
silencio</b>. Hay que registrarlos.</div>

<h4>El límite de un observer en memoria</h4>
<p>Un emisor en proceso <b>no sobrevive a un reinicio</b>. Si el servidor se cae después de guardar el pedido y
antes de que corra el suscriptor, ese trabajo se pierde y nadie se entera.</p>
<pre><code>Observer en memoria     → efectos que se pueden perder sin consecuencia
Cola persistente        → efectos que NO se pueden perder</code></pre>
<p>Por eso en el workspace todo lo que importa va a Inngest y no a un emisor local: la cola garantiza entrega,
reintentos y visibilidad.</p>

<h4>El problema del acoplamiento temporal escondido</h4>
<pre><code>// Suscriptor A: crea la factura
alOcurrir('pedido.creado', crearFactura);
// Suscriptor B: envía la factura por email
alOcurrir('pedido.creado', enviarFacturaPorEmail);   // ← necesita que A ya haya corrido</code></pre>

<div class="dato"><strong>Ese es el error más difícil de diagnosticar de todo el patrón.</strong> Aparenta
funcionar mientras el orden de registro sea el correcto, y falla de forma intermitente cuando cambia el orden,
cuando se paraleliza o cuando alguien agrega un suscriptor en el medio. <b>Si B depende de A, no son dos
suscriptores del mismo evento: B debería escuchar el evento que emite A.</b></div>

<h4>Cuándo NO usar ningún patrón</h4>
<p>El sesgo más caro de este módulo es querer aplicar lo que acabás de aprender. Señales de que estás poniendo
un patrón de más:</p>
<ul>
<li>Tenés que <b>explicar</b> por qué está ahí.</li>
<li>El "antes" eran diez líneas y el "después" son cuatro archivos.</li>
<li>Hay una sola implementación de la interfaz y no vas a tener otra.</li>
<li>El nombre del patrón está en el nombre del archivo pero no resuelve nada.</li>
</ul>

<div class="dato"><strong>La pregunta que corta la discusión: "¿qué problema concreto tenemos hoy que esto
resuelve?"</strong> Si la respuesta es "ninguno, pero cuando crezcamos…", volvé a YAGNI. Un patrón agregado
sin problema que lo justifique es <b>complejidad con un nombre respetable</b>, que es peor que la complejidad
sin nombre porque cuesta más discutirla.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="pt4" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    OBSERVER — ganás desacoplamiento, perdés trazabilidad</text>

  <rect x="24" y="34" width="290" height="112" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="169" y="54" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">llamada directa</text>
  <rect x="44" y="64" width="100" height="24" rx="5" fill="#22d3ee" fill-opacity=".25"/>
  <text x="94" y="80" text-anchor="middle" fill="currentColor" font-size="8.5" font-weight="700">crearPedido</text>
  <line x1="148" y1="76" x2="166" y2="76" stroke="currentColor" stroke-width="1.2" marker-end="url(#pt4)"/>
  <text x="176" y="72" fill="currentColor" opacity=".6" font-size="8.5">email</text>
  <text x="176" y="86" fill="currentColor" opacity=".6" font-size="8.5">stock</text>
  <text x="176" y="100" fill="currentColor" opacity=".6" font-size="8.5">depósito</text>
  <text x="176" y="114" fill="currentColor" opacity=".6" font-size="8.5">métrica</text>
  <text x="169" y="136" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">leés el código y sabés todo lo que pasa</text>

  <rect x="352" y="34" width="304" height="112" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.3"/>
  <text x="504" y="54" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">observer</text>
  <rect x="372" y="64" width="100" height="24" rx="5" fill="#22d3ee" fill-opacity=".25"/>
  <text x="422" y="80" text-anchor="middle" fill="currentColor" font-size="8.5" font-weight="700">crearPedido</text>
  <line x1="476" y1="76" x2="494" y2="76" stroke="#34d399" stroke-width="1.4" marker-end="url(#pt4)" color="#34d399"/>
  <rect x="498" y="64" width="138" height="24" rx="5" fill="#34d399" fill-opacity=".25"/>
  <text x="567" y="80" text-anchor="middle" fill="currentColor" font-size="8.5" font-weight="700">emitir('pedido.creado')</text>
  <text x="372" y="106" fill="currentColor" opacity=".6" font-size="9">¿quién escucha? está en cualquier archivo</text>
  <text x="372" y="122" fill="#f87171" font-size="9.5" font-weight="700">depurar deja de ser “seguir el código”</text>
  <text x="372" y="138" fill="#f87171" font-size="9.5" font-weight="700">y el ORDEN no está escrito en ningún lado</text>

  <rect x="24" y="158" width="632" height="46" rx="9" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="44" y="178" fill="#fbbf24" font-size="11.5" font-weight="700">LA REGLA QUE DECIDE</text>
  <text x="44" y="196" fill="currentColor" opacity=".75" font-size="11">
    ¿La reacción es <tspan font-weight="700">parte del negocio</tspan> (descontar stock)? → llamada directa. ¿Es un <tspan font-weight="700">efecto secundario</tspan> (una métrica)? → evento.</text>

  <text x="24" y="230" fill="#f87171" font-size="12" font-weight="700">
    EL ERROR MÁS DIFÍCIL DE DIAGNOSTICAR: DEPENDENCIA ENTRE SUSCRIPTORES</text>

  <rect x="24" y="242" width="632" height="60" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="262" fill="currentColor" opacity=".72" font-size="10.5" font-family="monospace">A: crearFactura      B: enviarFacturaPorEmail   ← B necesita que A ya haya corrido</text>
  <text x="44" y="280" fill="#f87171" font-size="10.5" font-weight="700">
    Funciona mientras el orden de registro sea el correcto. Falla intermitentemente al paralelizar o al insertar otro suscriptor.</text>
  <text x="44" y="296" fill="#34d399" font-size="10.5" font-weight="700">
    Si B depende de A, no son dos suscriptores del mismo evento: B debería escuchar el evento que emite A.</text>

  <rect x="24" y="316" width="304" height="70" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="176" y="336" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">EL LÍMITE DEL EMISOR EN MEMORIA</text>
  <text x="44" y="356" fill="currentColor" opacity=".7" font-size="10">no sobrevive a un reinicio</text>
  <text x="44" y="374" fill="#7c5cff" font-size="10" font-weight="700">lo que no se puede perder → cola persistente</text>

  <rect x="352" y="316" width="304" height="70" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="504" y="336" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">LA PREGUNTA QUE CORTA LA DISCUSIÓN</text>
  <text x="372" y="358" fill="#f87171" font-size="11" font-weight="700">“¿qué problema concreto tenemos HOY</text>
  <text x="372" y="376" fill="#f87171" font-size="11" font-weight="700">que esto resuelve?”</text>
</svg>`,
        pie: 'Un patrón sin problema que lo justifique es complejidad con un nombre respetable.',
      },

      entrevista: [
        { p: '¿Cuándo usarías un evento en vez de una llamada directa?',
          r: 'La regla que uso es si la reacción es <b>parte del negocio</b> o un <b>efecto secundario</b>. Descontar stock es parte del negocio: ' +
             'si falla, el pedido no debería quedar confirmado, así que va como llamada directa dentro de la misma transacción. ' +
             'Registrar una métrica o mandar un email de cortesía son efectos secundarios: si fallan no pasa nada, y ahí el evento aporta. ' +
             'También pesa la cantidad: con una o dos reacciones la llamada directa es más clara; con muchas que aparecen seguido, el evento gana.' },

        { p: '¿Qué perdés al adoptar Observer?',
          r: '<b>Trazabilidad.</b> Mirando <code>crearPedido</code> ya no sabés qué pasa después: para entender el flujo hay que buscar todos los ' +
             'suscriptores, que pueden estar en cualquier archivo. Depurar deja de ser "seguir el código" y pasa a ser "buscar quién escucha", ' +
             'y <b>el orden de ejecución no está escrito en ningún lado</b>. Es un costo real, y por eso no lo aplico por defecto sino cuando el ' +
             'desacoplamiento resuelve un problema concreto.' },

        { p: '¿Cuál es el error más difícil de diagnosticar con eventos?',
          r: 'Que un suscriptor <b>dependa de otro</b>. Si A crea la factura y B la envía por email, y ambos escuchan el mismo evento, funciona ' +
             'mientras el orden de registro sea el correcto — y falla de forma <b>intermitente</b> cuando cambia el orden, cuando se paraleliza, ' +
             'o cuando alguien mete un suscriptor en el medio. La corrección es conceptual: <b>si B depende de A, no son dos suscriptores del mismo ' +
             'evento; B debería escuchar el evento que emite A.</b>' },

        { p: '¿Cuál es el límite de un emisor de eventos en memoria?',
          r: 'Que <b>no sobrevive a un reinicio</b>. Si el proceso se cae después de guardar el pedido y antes de que corra el suscriptor, ese trabajo ' +
             'se pierde y nadie se entera. Por eso el criterio es: efectos que se pueden perder sin consecuencia pueden ir en memoria; ' +
             'todo lo que <b>no</b> se puede perder va a una <b>cola persistente</b> que garantice entrega, reintentos y visibilidad. ' +
             'Y hay un detalle de implementación: usar <code>allSettled</code> para que un suscriptor que falla no cancele al resto, ' +
             'pero registrando los rechazos — si nadie los mira, los errores desaparecen en silencio.' },
      ],

      practica: `
<h4>Emisor tipado, con errores visibles</h4>
<pre><code>type Eventos = {
  'pedido.creado':   { pedidoId: string; tenantId: string; total: number };
  'pedido.pagado':   { pedidoId: string; pagoId: string };
  'cliente.dado.alta': { clienteId: string; email: string };
};

const subs: { [K in keyof Eventos]?: ((d: Eventos[K]) =&gt; Promise&lt;void&gt;)[] } = {};

export function alOcurrir&lt;K extends keyof Eventos&gt;(
  evento: K, fn: (d: Eventos[K]) =&gt; Promise&lt;void&gt;,
) {
  (subs[evento] ??= []).push(fn as any);
}

export async function emitir&lt;K extends keyof Eventos&gt;(evento: K, dato: Eventos[K]) {
  const fns = subs[evento] ?? [];
  const resultados = await Promise.allSettled(fns.map((fn) =&gt; fn(dato)));

  // Sin esto, los errores desaparecen en silencio
  resultados.forEach((r, i) =&gt; {
    if (r.status === 'rejected') {
      log.error('suscriptor_fallo', { evento, indice: i, error: String(r.reason) });
    }
  });
}</code></pre>

<div class="aviso"><strong>El bloque final es obligatorio.</strong> <code>allSettled</code> evita que un
suscriptor tumbe al resto, pero a cambio <b>traga los errores</b>. Sin ese registro, un email que dejó de
enviarse hace tres semanas no genera ninguna señal en ningún lado.</div>

<h4>Dependencia entre suscriptores: el arreglo</h4>
<pre><code>// ❌ B depende de que A ya haya corrido
alOcurrir('pedido.creado', crearFactura);
alOcurrir('pedido.creado', enviarFacturaPorEmail);

// ✔ Encadenar por eventos: B escucha lo que A produce
alOcurrir('pedido.creado', async (p) =&gt; {
  const factura = await crearFactura(p);
  await emitir('factura.creada', { facturaId: factura.id, email: p.email });
});
alOcurrir('factura.creada', enviarFacturaPorEmail);</code></pre>

<h4>Cuándo dejar la llamada directa</h4>
<pre><code>// Parte del negocio: si falla, NADA debe quedar hecho
export async function confirmarPago(pedidoId: string, pagoId: string) {
  await enTransaccion(async (tx) =&gt; {
    await pedidos.conTx(tx).marcarPagado(pedidoId, pagoId);
    await stock.conTx(tx).descontar(pedidoId);
  });

  // Efectos secundarios: van por evento, después de que lo importante ya está
  await emitir('pedido.pagado', { pedidoId, pagoId });
}</code></pre>

<div class="dato"><strong>Ese es el patrón correcto y el que hay que recordar:</strong> lo transaccional
adentro de la transacción y por llamada directa; lo secundario afuera y por evento. Mezclarlo es lo que produce
pedidos pagados sin stock descontado, o stock descontado sin pedido pagado.</div>

<h4>Antes de agregar un patrón</h4>
<table>
<tr><th>Pregunta</th><th>Si la respuesta es…</th></tr>
<tr><td>¿Qué problema concreto tenemos hoy?</td><td>"Ninguno" → no lo agregues</td></tr>
<tr><td>¿Cuánto código agrega?</td><td>Más de lo que simplifica → no</td></tr>
<tr><td>¿Hay que explicarlo para que se entienda?</td><td>Sí → probablemente sobra</td></tr>
<tr><td>¿Hay una sola implementación?</td><td>Sí y no va a haber otra → no</td></tr>
<tr><td>¿Alguien nuevo lo va a entender solo?</td><td>No → costo de mantenimiento alto</td></tr>
</table>
`,

      errores: [
        { mito: 'Los eventos siempre desacoplan mejor.',
          realidad: 'Desacoplan el código y <b>acoplan el tiempo</b>: aparecen dependencias de orden que no están escritas en ningún lado. ' +
                    'Para lo que es parte del negocio, la llamada directa dentro de una transacción es más segura y más clara.' },

        { mito: 'Uso allSettled y ya está aislado.',
          realidad: 'Aísla, pero <b>traga los errores</b>. Sin registrar los rechazos, un suscriptor que dejó de funcionar hace semanas no genera ' +
                    'ninguna señal. Registrarlos es obligatorio.' },

        { mito: 'Si un suscriptor necesita que otro haya corrido, los ordeno al registrarlos.',
          realidad: 'Funciona hasta que alguien cambia el orden, paraleliza o inserta uno en el medio — y falla de forma <b>intermitente</b>. ' +
                    'Si B depende de A, B tiene que escuchar el evento que <b>emite</b> A.' },

        { mito: 'Aprendí el patrón, lo aplico donde pueda.',
          realidad: 'Es el sesgo más caro. Un patrón sin un problema concreto que lo justifique es <b>complejidad con un nombre respetable</b>, ' +
                    'que es peor que la complejidad sin nombre porque cuesta más discutirla.' },
      ],

      glosario: [
        { t: 'Observer', d: 'Patrón donde algo emite un aviso y varios reaccionan sin conocerse.' },
        { t: 'Suscriptor', d: 'Función registrada para reaccionar a un evento.' },
        { t: 'allSettled', d: 'Espera todas las promesas sin cancelar por una que falle.' },
        { t: 'Acoplamiento temporal', d: 'Dependencia de orden de ejecución no declarada en el código.' },
        { t: 'Efecto secundario', d: 'Reacción que puede fallar sin invalidar la operación principal.' },
        { t: 'Cola persistente', d: 'Infraestructura que garantiza entrega y reintentos tras un reinicio.' },
        { t: 'Encadenar eventos', d: 'Que un suscriptor emita su propio evento para lo que depende de él.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es el valor principal de conocer los patrones de diseño?',
      opciones: [
        'Comunicación: nombrar una solución ahorra diez minutos de explicación',
        'Poder aplicar los 23 en cualquier proyecto',
        'Cumplir con estándares de la industria',
        'Escribir menos código',
      ],
      correcta: 0,
      porQue: 'Los patrones son nombres para soluciones que ya usás sin saberlo. Aprender los 23 de memoria produce el peor efecto posible: querer usarlos.',
      porQueNo: {
        1: 'La mayoría no aplica a código moderno de aplicación.',
        2: 'No hay ningún estándar que exija usarlos.',
        3: 'Muchos agregan código: lo que dan es estructura, no brevedad.',
      },
    },
    {
      p: '¿Qué síntoma pide el patrón Strategy?',
      opciones: [
        'Una cadena de if que crece con cada variante nueva',
        'Una función con muchas líneas',
        'Un archivo con muchas importaciones',
        'Código duplicado entre módulos',
      ],
      correcta: 0,
      porQue: 'Cada variante nueva obliga a tocar código que ya funcionaba. Strategy convierte eso en una pieza por variante y un punto de despacho que no cambia.',
      porQueNo: {
        1: 'Puede resolverse extrayendo funciones, sin necesidad de Strategy.',
        2: 'Indica acoplamiento, no necesariamente variantes de comportamiento.',
        3: 'Puede pedir extracción o no, según si es el mismo conocimiento.',
      },
    },
    {
      p: 'En JavaScript, ¿qué forma toma normalmente una estrategia?',
      opciones: [
        'Una función: no hace falta una clase por variante',
        'Una clase que implementa una interfaz',
        'Un módulo con estado interno',
        'Una clase abstracta con subclases',
      ],
      correcta: 0,
      porQue: 'Los ejemplos con clases vienen de lenguajes donde no se pueden pasar funciones como valores. Tres archivos de andamiaje para envolver una línea es aplicar el ejemplo, no el patrón.',
      porQueNo: {
        1: 'Es válido, pero suele ser andamiaje innecesario.',
        2: 'Una estrategia normalmente no necesita estado propio.',
        3: 'Agrega jerarquía sin ningún beneficio en este lenguaje.',
      },
    },
    {
      p: '¿Por qué usar satisfies en vez de as al tipar un mapa de estrategias?',
      opciones: [
        'satisfies verifica cada entrada sin ensanchar el tipo, así que las claves siguen siendo una unión exacta',
        'satisfies es más rápido en tiempo de ejecución',
        'as no funciona con Record',
        'satisfies genera código adicional útil',
      ],
      correcta: 0,
      porQue: 'Con as Record<string, …> el tipo se ensancha y cualquier cadena compila. Con satisfies, pasar un medio inexistente no compila.',
      porQueNo: {
        1: 'Ambos desaparecen al compilar: no hay efecto en tiempo de ejecución.',
        2: 'Funciona, pero pierde la precisión del tipo de las claves.',
        3: 'No genera nada: es solo verificación en tiempo de compilación.',
      },
    },
    {
      p: '¿Cómo distinguís un Decorator de un Adapter?',
      opciones: [
        'Si podés usar el resultado en el mismo lugar que el original, es Decorator; si cambiaste cómo se lo llama, Adapter',
        'El Decorator siempre agrega logging',
        'El Adapter siempre envuelve una librería externa',
        'El Decorator usa clases y el Adapter funciones',
      ],
      correcta: 0,
      porQue: 'El Decorator mantiene la interfaz y por eso se apila. El Adapter la cambia para que algo externo encaje con lo que tu código espera.',
      porQueNo: {
        1: 'Logging es un caso de uso, no la definición.',
        2: 'Suele ser así, pero también se adapta código propio con otra forma.',
        3: 'Ambos pueden implementarse de las dos maneras.',
      },
    },
    {
      p: '¿Cuál es el valor real de un adaptador?',
      opciones: [
        'Que tus reglas de negocio no hablen el idioma del proveedor',
        'Poder cambiar de proveedor la semana que viene',
        'Reducir la cantidad de dependencias',
        'Mejorar el rendimiento de las llamadas',
      ],
      correcta: 0,
      porQue: 'Cambiar de proveedor pasa poco y es un efecto secundario. El beneficio cotidiano es que no aparecen campos y objetos de configuración del proveedor dentro de una regla de negocio.',
      porQueNo: {
        1: 'Ocurre rara vez; es una justificación débil por sí sola.',
        2: 'La dependencia sigue existiendo, solo queda contenida.',
        3: 'Agrega una capa: no mejora el rendimiento.',
      },
    },
    {
      p: 'Además de traducir la forma, ¿qué debe hacer un adaptador?',
      opciones: [
        'Normalizar los errores del proveedor a un tipo propio, incluyendo si son reintentables',
        'Cachear las respuestas',
        'Registrar métricas de uso',
        'Validar los datos de entrada',
      ],
      correcta: 0,
      porQue: 'Sin eso terminás con "if (error.statusCode === 429)" dentro de una regla de negocio, y el aislamiento que justificaba el adaptador desaparece.',
      porQueNo: {
        1: 'Es responsabilidad de un decorador, no del adaptador.',
        2: 'También corresponde a un decorador.',
        3: 'La validación es del dominio, antes de llegar al adaptador.',
      },
    },
    {
      p: 'En conCache(conReintento(fn)), ¿qué comportamiento se obtiene?',
      opciones: [
        'Si hay acierto de caché, no se reintenta ni se espera nada',
        'Cada acierto de caché pasa igual por la lógica de reintento',
        'La caché solo guarda los resultados de reintentos exitosos',
        'El orden no cambia el comportamiento',
      ],
      correcta: 0,
      porQue: 'La caché está afuera, así que corta antes. Al revés —conReintento(conCache(fn))— cada acierto pasaría por toda la lógica de reintento.',
      porQueNo: {
        1: 'Eso ocurre con el orden invertido.',
        2: 'La caché guarda lo que devuelve lo que envuelve, sin distinguir.',
        3: 'El orden es una decisión de diseño con efectos concretos.',
      },
    },
    {
      p: '¿Cómo se evita que una fachada crezca sin control?',
      opciones: [
        'Con varias fachadas específicas que reusan las mismas piezas internas',
        'Agregando parámetros opcionales para cada caso',
        'Documentando bien las combinaciones válidas',
        'Dividiéndola por cantidad de líneas',
      ],
      correcta: 0,
      porQue: 'Cada bandera es un caso distinto comprimido. Que sea una fachada solo lo hace más difícil de ver, porque parece que "coordinar" justifica la complejidad.',
      porQueNo: {
        1: 'Es exactamente el mecanismo por el que crece hasta volverse ilegible.',
        2: 'Documentar una firma confusa no la arregla.',
        3: 'El tamaño es un síntoma; el problema son las responsabilidades mezcladas.',
      },
    },
    {
      p: '¿Cuál es el beneficio principal del patrón Repository?',
      opciones: [
        'Que la definición de una consulta viva en un solo lugar',
        'Poder cambiar de base de datos',
        'Mejorar el rendimiento de las consultas',
        'Evitar escribir SQL',
      ],
      correcta: 0,
      porQue: 'Sin él, "los pedidos pendientes" queda escrito de tres formas distintas. Cuando agregás una condición, arreglás dos y olvidás la tercera — sin ningún error visible.',
      porQueNo: {
        1: 'Ocurre casi nunca y no justifica el patrón por sí solo.',
        2: 'No mejora el rendimiento: puede empeorarlo si oculta N+1.',
        3: 'El SQL sigue existiendo, solo queda concentrado.',
      },
    },
    {
      p: '¿Cuándo un repositorio no aporta nada?',
      opciones: [
        'Cuando sus métodos son obtenerTodos y obtenerPorId: es la tabla con otro nombre',
        'Cuando tiene más de diez métodos',
        'Cuando lo usa más de un módulo',
        'Cuando devuelve tipos del dominio',
      ],
      correcta: 0,
      porQue: 'Cada consumidor sigue teniendo que saber qué significa "pendiente". El valor aparece con métodos del negocio, que concentran el conocimiento en vez de trasladarlo.',
      porQueNo: {
        1: 'La cantidad de métodos no determina su utilidad.',
        2: 'Ser usado desde varios módulos es justamente su propósito.',
        3: 'Devolver tipos del dominio es deseable.',
      },
    },
    {
      p: '¿Cuál es el límite de una unidad de trabajo basada en transacciones?',
      opciones: [
        'No puede abarcar una llamada a un servicio externo: si ya cobraste, no hay rollback',
        'No funciona con más de tres tablas',
        'No se puede usar en Postgres',
        'Requiere bloquear toda la base',
      ],
      correcta: 0,
      porQue: 'Ese caso se resuelve con idempotencia y compensación, no con transacciones. Es la diferencia entre consistencia dentro de la base y consistencia con el mundo exterior.',
      porQueNo: {
        1: 'No hay tal límite.',
        2: 'Postgres tiene soporte transaccional completo.',
        3: 'Bloquea solo las filas afectadas, según el nivel de aislamiento.',
      },
    },
    {
      p: '¿Cuándo conviene un evento en vez de una llamada directa?',
      opciones: [
        'Cuando la reacción es un efecto secundario que puede fallar sin invalidar la operación',
        'Siempre: los eventos desacoplan mejor',
        'Cuando hay una sola reacción',
        'Cuando el orden de ejecución importa',
      ],
      correcta: 0,
      porQue: 'Descontar stock es parte del negocio y va en la transacción; registrar una métrica es secundario y va por evento. Los eventos desacoplan el código pero acoplan el tiempo.',
      porQueNo: {
        1: 'También acoplan el tiempo y hacen invisible el orden de ejecución.',
        2: 'Con una sola reacción, la llamada directa es más clara.',
        3: 'Si el orden importa, el evento lo vuelve implícito y frágil.',
      },
    },
    {
      p: 'Dos suscriptores del mismo evento, y B necesita que A ya haya corrido. ¿Qué hacés?',
      opciones: [
        'B debería escuchar el evento que emite A, no el mismo evento',
        'Registrar A antes que B',
        'Agregar una espera en B',
        'Usar Promise.all en vez de allSettled',
      ],
      correcta: 0,
      porQue: 'Depender del orden de registro funciona hasta que alguien lo cambia, paraleliza o inserta un suscriptor en el medio — y falla de forma intermitente.',
      porQueNo: {
        1: 'Es exactamente la dependencia frágil que causa el problema.',
        2: 'Una espera arbitraria es una condición de carrera con más pasos.',
        3: 'Cambia el manejo de errores, no el orden de ejecución.',
      },
    },
    {
      p: '¿Qué pregunta corta la discusión sobre si agregar un patrón?',
      opciones: [
        '¿Qué problema concreto tenemos hoy que esto resuelve?',
        '¿Está en el catálogo de patrones?',
        '¿Lo usan otros equipos?',
        '¿Cuántas líneas ahorra?',
      ],
      correcta: 0,
      porQue: 'Si la respuesta es "ninguno, pero cuando crezcamos", volvés a YAGNI. Un patrón sin problema que lo justifique es complejidad con un nombre respetable, y eso cuesta más discutirlo.',
      porQueNo: {
        1: 'Que exista no significa que este problema lo necesite.',
        2: 'Otros equipos tienen otros problemas y otras escalas.',
        3: 'Muchos patrones agregan líneas: lo que dan es estructura.',
      },
    },
  ],
});
