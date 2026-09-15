/* ==========================================================================
   Arquitectura · Módulo 03 — Capas y dependencias
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'arquitectura',
  id: 'm03',
  titulo: 'Capas y dependencias',
  fuentes: ['fowler', 'nextjs', '12factor'],

  intro:
    '<p>Arquitectura en capas, hexagonal, cebolla, limpia. Suenan a cosas distintas y todas dicen <b>lo mismo</b> ' +
    'con vocabulario diferente: <i>las dependencias apuntan hacia adentro, hacia lo que menos cambia</i>.</p>' +
    '<p>Este módulo va sobre esa única idea, sus variantes, y —lo más importante— <b>cuánta ceremonia vale la pena</b> ' +
    'en un proyecto real. Porque la versión de manual, aplicada completa a un CRUD, produce veinte archivos para ' +
    'guardar un cliente.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Capas y la regla de dependencia',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> separá el código en capas y hacé que las
dependencias vayan <b>siempre en una dirección</b>: hacia lo que menos cambia.</div>

<h4>Las cuatro capas, en criollo</h4>
<table>
<tr><th>Capa</th><th>Qué contiene</th><th>Cada cuánto cambia</th></tr>
<tr><td><b>Presentación</b></td><td>Pantallas, componentes, formularios</td><td>Todo el tiempo</td></tr>
<tr><td><b>Aplicación</b></td><td>Casos de uso: "confirmar pedido"</td><td>Cuando cambia el flujo</td></tr>
<tr><td><b>Dominio</b></td><td>Reglas de negocio puras</td><td><b>Poco</b></td></tr>
<tr><td><b>Infraestructura</b></td><td>Base, correo, pagos, archivos</td><td>Cuando cambia un proveedor</td></tr>
</table>

<h4>La regla, que es una sola</h4>
<pre><code>Presentación  →  Aplicación  →  Dominio  ←  Infraestructura</code></pre>
<p>Fijate en la última flecha: <b>apunta al revés</b>. La infraestructura depende del dominio, no al revés. Eso
es lo que hace que puedas cambiar de proveedor de correo sin tocar una regla de negocio.</p>

<div class="aviso"><strong>El síntoma de que la regla está rota es muy reconocible:</strong> abrís un archivo
de reglas de negocio y ves un <code>import</code> de Supabase, de Resend o de React. En ese momento la regla ya
no es independiente — para probarla necesitás una base de datos, y para cambiar el proveedor tenés que tocar
lógica de negocio.</div>

<h4>Qué gana cada capa con esto</h4>
<ul>
<li><b>El dominio</b> se puede probar sin base, sin red y sin esperar. Los tests corren en milisegundos.</li>
<li><b>La infraestructura</b> se puede reemplazar sin tocar reglas.</li>
<li><b>La presentación</b> puede cambiar por completo —web, mobile, una API— sobre las mismas reglas.</li>
</ul>

<h4>El malentendido más común</h4>
<p>"Capas" no significa "carpetas llamadas <code>controllers</code>, <code>services</code> y
<code>models</code>". Eso es una convención de nombres. <b>Las capas son una regla sobre quién puede importar a
quién</b> — y si nadie la verifica, las carpetas son decorativas.</p>
`,

      tecnico: `
<h4>Qué va en cada capa, con ejemplos</h4>
<pre><code>dominio/            // sin imports de librerías externas. Ninguno.
  pedido.ts             tipos, reglas, invariantes
  precios.ts            cálculo de totales, descuentos, impuestos
  errores.ts            errores propios del negocio

aplicacion/         // orquesta el dominio; conoce los PUERTOS, no las implementaciones
  confirmarPedido.ts
  puertos.ts            interfaces: RepoPedidos, Notificador, PasarelaPago

infraestructura/    // implementa los puertos
  repoPedidosSupabase.ts
  notificadorResend.ts
  pasarelaMercadoPago.ts

presentacion/       // depende de aplicación
  app/pedidos/page.tsx
  acciones.ts           Server Actions</code></pre>

<div class="dato"><strong>La línea que define todo es la primera:</strong> el dominio no importa
<b>ninguna</b> librería externa. Ni el cliente de base, ni el SDK de pagos, ni React. Si necesita saber la
fecha, la recibe. Si necesita generar un identificador, lo recibe. <b>Esa restricción es lo que hace que las
reglas sean verificables en un test de tres líneas.</b></div>

<h4>La inversión, en concreto</h4>
<pre><code>// aplicacion/puertos.ts — la capa de aplicación DECLARA lo que necesita
export interface RepoPedidos {
  porId(id: string): Promise&lt;Pedido | null&gt;;
  guardar(p: Pedido): Promise&lt;void&gt;;
}

// aplicacion/confirmarPedido.ts — no sabe nada de Supabase
export function confirmarPedido(deps: { repo: RepoPedidos; notificar: Notificador }) {
  return async (id: string) =&gt; {
    const pedido = await deps.repo.porId(id);
    if (!pedido) throw new PedidoInexistente(id);

    const confirmado = confirmar(pedido);        // ← regla pura del dominio
    await deps.repo.guardar(confirmado);
    await deps.notificar.pedidoConfirmado(confirmado);
    return confirmado;
  };
}

// infraestructura/repoPedidosSupabase.ts — IMPLEMENTA el puerto
export const repoPedidosSupabase: RepoPedidos = { … };</code></pre>

<h4>Hacer que la regla se cumpla sola</h4>
<p>Una regla que nadie verifica se rompe en tres semanas. Con ESLint se puede hacer obligatoria:</p>
<pre><code>// eslint.config.js
{
  files: ['src/dominio/**'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        { group: ['@/infraestructura/*'], message: 'El dominio no depende de infraestructura.' },
        { group: ['@/presentacion/*', 'react', 'next/*'], message: 'El dominio no conoce la UI.' },
        { group: ['@supabase/*', 'resend', 'stripe'], message: 'El dominio no importa proveedores.' },
      ],
    }],
  },
}</code></pre>

<div class="dato"><strong>Esta es la diferencia entre "tenemos arquitectura en capas" y tenerla de
verdad.</strong> Sin verificación automática, la regla dura hasta el primer viernes con apuro: alguien importa
el cliente de base desde el dominio "por ahora", nadie lo nota en la revisión, y a los seis meses hay treinta
imports así. <b>Diez líneas de configuración valen más que cualquier documento.</b></div>

<h4>Cuántas capas hace falta</h4>
<table>
<tr><th>Tamaño</th><th>Capas recomendadas</th></tr>
<tr><td>Prototipo o landing</td><td><b>Ninguna.</b> Componentes y quizás un archivo de datos</td></tr>
<tr><td>CRUD chico</td><td>Dos: UI y datos</td></tr>
<tr><td>Producto con reglas propias</td><td>Tres: UI, aplicación/dominio juntos, infraestructura</td></tr>
<tr><td>Sistema con reglas complejas</td><td>Cuatro, separando dominio de aplicación</td></tr>
</table>

<div class="dato"><strong>Fusionar dominio y aplicación es lo correcto en la mayoría de los productos.</strong>
La separación entre "regla pura" y "caso de uso" recién rinde cuando las reglas son suficientemente ricas para
existir por sí solas. En un CRUD, esa división produce archivos de tres líneas que solo reenvían.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="cp1" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
    <path d="M0,0 L7,3.2 L0,6.4 z" fill="currentColor" opacity=".55"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA REGLA ES UNA SOLA — y fijate en la última flecha</text>

  <rect x="24" y="36" width="140" height="60" rx="10" fill="#f87171" fill-opacity=".16" stroke="#f87171" stroke-width="1.3"/>
  <text x="94" y="58" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">PRESENTACIÓN</text>
  <text x="94" y="76" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">pantallas</text>
  <text x="94" y="89" text-anchor="middle" fill="#f87171" font-size="8.5" font-weight="700">cambia todo el tiempo</text>

  <line x1="168" y1="66" x2="188" y2="66" stroke="currentColor" stroke-width="2" marker-end="url(#cp1)"/>

  <rect x="192" y="36" width="140" height="60" rx="10" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="262" y="58" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">APLICACIÓN</text>
  <text x="262" y="76" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">casos de uso</text>
  <text x="262" y="89" text-anchor="middle" fill="currentColor" opacity=".5" font-size="8.5">cambia con el flujo</text>

  <line x1="336" y1="66" x2="356" y2="66" stroke="currentColor" stroke-width="2" marker-end="url(#cp1)"/>

  <rect x="360" y="30" width="140" height="72" rx="10" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.8"/>
  <text x="430" y="54" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">DOMINIO</text>
  <text x="430" y="72" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">reglas puras</text>
  <text x="430" y="90" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">CERO imports externos</text>

  <line x1="524" y1="66" x2="504" y2="66" stroke="#7c5cff" stroke-width="2.4" marker-end="url(#cp1)" color="#7c5cff"/>
  <text x="514" y="112" text-anchor="middle" fill="#7c5cff" font-size="9" font-weight="700">↑ AL REVÉS</text>

  <rect x="528" y="36" width="128" height="60" rx="10" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="592" y="58" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">INFRAESTRUCTURA</text>
  <text x="592" y="76" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">base · correo · pagos</text>
  <text x="592" y="89" text-anchor="middle" fill="currentColor" opacity=".5" font-size="8.5">cambia con el proveedor</text>

  <rect x="24" y="126" width="632" height="42" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="44" y="146" fill="#34d399" font-size="11.5" font-weight="700">Esa flecha invertida es todo el truco.</text>
  <text x="300" y="146" fill="currentColor" opacity=".72" font-size="11">La infraestructura implementa lo que el dominio declara.</text>
  <text x="44" y="162" fill="currentColor" opacity=".72" font-size="10.5">
    Por eso podés cambiar de proveedor de correo sin tocar una sola regla de negocio, y probar el dominio sin base ni red.</text>

  <line x1="24" y1="186" x2="656" y2="186" stroke="currentColor" opacity=".18"/>

  <text x="24" y="210" fill="#f87171" font-size="12" font-weight="700">
    EL SÍNTOMA DE QUE LA REGLA ESTÁ ROTA</text>

  <rect x="24" y="222" width="632" height="52" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="242" fill="currentColor" opacity=".75" font-size="11">
    Abrís un archivo de reglas de negocio y ves <tspan font-family="monospace" fill="#f87171" font-weight="700">import { supabase } from …</tspan></text>
  <text x="44" y="264" fill="#f87171" font-size="11" font-weight="700">
    Desde ese momento, para probar la regla necesitás una base — y cambiar el proveedor obliga a tocar lógica de negocio.</text>

  <rect x="24" y="288" width="304" height="98" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="176" y="310" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">CÓMO SE HACE CUMPLIR SOLA</text>
  <text x="44" y="332" fill="currentColor" opacity=".72" font-size="10.5">no-restricted-imports en ESLint</text>
  <text x="44" y="352" fill="currentColor" opacity=".65" font-size="10">para src/dominio/**: prohibir react, next,</text>
  <text x="44" y="366" fill="currentColor" opacity=".65" font-size="10">supabase, resend, stripe…</text>
  <text x="44" y="382" fill="#7c5cff" font-size="10" font-weight="700">10 líneas valen más que cualquier documento</text>

  <rect x="352" y="288" width="304" height="98" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="504" y="310" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">CUÁNTAS CAPAS HACEN FALTA</text>
  <text x="372" y="332" fill="currentColor" opacity=".72" font-size="10.5">landing → ninguna</text>
  <text x="372" y="350" fill="currentColor" opacity=".72" font-size="10.5">CRUD chico → dos (UI y datos)</text>
  <text x="372" y="368" fill="#34d399" font-size="10.5" font-weight="700">producto con reglas → tres</text>
  <text x="372" y="382" fill="currentColor" opacity=".6" font-size="9.5">dominio y aplicación juntos está BIEN en la mayoría</text>
</svg>`,
        pie: 'Las capas no son carpetas: son una regla sobre quién importa a quién. Si nadie la verifica, es decoración.',
      },

      entrevista: [
        { p: '¿Cuál es la regla central de la arquitectura en capas?',
          r: 'Que las dependencias vayan <b>siempre en una dirección</b>: hacia lo que menos cambia. Presentación depende de aplicación, ' +
             'aplicación del dominio, y —acá está el truco— <b>la infraestructura también depende del dominio</b>, no al revés. ' +
             'Esa flecha invertida es lo que permite cambiar de proveedor de correo o de base sin tocar una regla de negocio, ' +
             'y probar el dominio sin levantar nada.' },

        { p: '¿Cómo detectás que la regla de dependencia está rota?',
          r: 'Es muy visible: abrís un archivo de reglas de negocio y ves un <code>import</code> de Supabase, de Resend o de React. ' +
             'Desde ese momento, para probar esa regla necesitás una base de datos, y cambiar el proveedor te obliga a tocar lógica de negocio. ' +
             'Y no alcanza con detectarlo a ojo: lo hago cumplir con <b><code>no-restricted-imports</code> de ESLint</b> sobre la carpeta del dominio. ' +
             'Sin verificación automática, la regla dura hasta el primer viernes con apuro.' },

        { p: '¿Cuántas capas usarías en un proyecto real?',
          r: 'Depende del tamaño, y menos de las que sugiere el manual. En una landing, ninguna. En un CRUD chico, dos: UI y datos. ' +
             'En un producto con reglas propias, <b>tres</b> —UI, aplicación y dominio juntos, infraestructura—. ' +
             'La separación entre "regla pura" y "caso de uso" recién rinde cuando las reglas son ricas de verdad; ' +
             'en un CRUD produce archivos de tres líneas que solo reenvían.' },

        { p: '¿Qué significa que el dominio no importa nada externo?',
          r: 'Literalmente ninguna librería: ni el cliente de base, ni el SDK de pagos, ni React. Si necesita saber la fecha, la <b>recibe</b>; ' +
             'si necesita generar un identificador, lo recibe. Esa restricción es lo que hace que las reglas sean verificables en un test de tres ' +
             'líneas, sin levantar nada y de forma determinista. Y es también lo que las mantiene legibles: una regla de negocio rodeada de código ' +
             'de infraestructura es mucho más difícil de auditar.' },
      ],

      practica: `
<h4>La regla, hecha obligatoria</h4>
<pre><code>// eslint.config.js
export default [
  {
    files: ['src/dominio/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['@/infraestructura/*'], message: 'El dominio no depende de infraestructura.' },
          { group: ['@/app/*', 'react', 'react-dom', 'next/*'], message: 'El dominio no conoce la UI.' },
          { group: ['@supabase/*', 'resend', 'stripe', 'mercadopago'],
            message: 'El dominio no importa proveedores. Definí un puerto.' },
        ],
      }],
    },
  },
  {
    files: ['src/aplicacion/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{ group: ['@/infraestructura/*'],
          message: 'La aplicación usa puertos, no implementaciones.' }],
      }],
    },
  },
];</code></pre>

<div class="aviso"><strong>Poner esto el primer día cuesta diez minutos.</strong> Agregarlo dos años después
significa arreglar trescientos <code>import</code> antes de que el proyecto vuelva a compilar — y por eso, en
la práctica, no se agrega nunca.</div>

<h4>Una regla de dominio, y su test</h4>
<pre><code>// dominio/pedido.ts — sin un solo import
export function confirmar(pedido: Pedido, ahora: Date): Pedido {
  if (pedido.estado !== 'pendiente') throw new EstadoInvalido(pedido.estado);
  if (pedido.items.length === 0)     throw new PedidoVacio();
  if (pedido.total &lt;= 0)             throw new TotalInvalido();

  return { ...pedido, estado: 'confirmado', confirmadoEn: ahora };
}

// El test no necesita base, red ni mocks
test('no se puede confirmar un pedido vacío', () =&gt; {
  expect(() =&gt; confirmar({ ...base, items: [] }, new Date())).toThrow(PedidoVacio);
});</code></pre>

<h4>Composición: dónde se juntan las piezas</h4>
<pre><code>// infraestructura/composicion.ts — el ÚNICO lugar que conoce a todos
import { confirmarPedido } from '@/aplicacion/confirmarPedido';
import { repoPedidosSupabase } from './repoPedidosSupabase';
import { notificadorResend } from './notificadorResend';

export const casosDeUso = {
  confirmarPedido: confirmarPedido({
    repo: repoPedidosSupabase,
    notificar: notificadorResend,
    reloj: () =&gt; new Date(),
  }),
};

// presentacion/acciones.ts
'use server';
export async function accionConfirmar(id: string) {
  return casosDeUso.confirmarPedido(id);
}</code></pre>

<div class="dato"><strong>Tener un único archivo de composición es lo que evita que la infraestructura se
filtre.</strong> Si cada Server Action importa su propio repositorio y su propio notificador, las
implementaciones concretas terminan esparcidas por la capa de presentación — y volviste al punto de partida
con más carpetas.</div>

<h4>Migrar un proyecto existente, sin frenar todo</h4>
<table>
<tr><th>#</th><th>Paso</th></tr>
<tr><td>1</td><td>Crear <code>dominio/</code> y mover ahí las funciones puras que ya existen</td></tr>
<tr><td>2</td><td>Activar la regla de ESLint <b>solo para esa carpeta</b></td></tr>
<tr><td>3</td><td>Extraer los puertos que esas funciones necesiten</td></tr>
<tr><td>4</td><td>Mover las llamadas a proveedores a <code>infraestructura/</code></td></tr>
<tr><td>5</td><td>Un archivo de composición</td></tr>
<tr><td>6</td><td>Repetir por funcionalidad, no de una</td></tr>
</table>
`,

      errores: [
        { mito: 'Tengo carpetas controllers, services y models: tengo capas.',
          realidad: 'Eso es una convención de nombres. <b>Las capas son una regla sobre quién puede importar a quién</b>, y si nadie la verifica, ' +
                    'las carpetas son decorativas: en tres semanas hay un import de la base dentro de un "model".' },

        { mito: 'Más capas es mejor arquitectura.',
          realidad: 'Cada capa es indirección. En un CRUD, separar dominio de aplicación produce archivos de tres líneas que solo reenvían. ' +
                    '<b>Tres capas cubren la mayoría de los productos</b>, con dominio y aplicación juntos.' },

        { mito: 'La regla de dependencia se respeta con disciplina.',
          realidad: 'Dura hasta el primer viernes con apuro. Alguien importa el cliente de base "por ahora", nadie lo nota en la revisión, ' +
                    'y a los seis meses hay treinta. <b>Diez líneas de ESLint valen más que cualquier documento.</b>' },

        { mito: 'Cada Server Action puede armar sus propias dependencias.',
          realidad: 'Ahí las implementaciones concretas se esparcen por la presentación y volviste al punto de partida con más carpetas. ' +
                    'Un <b>único archivo de composición</b> es lo que mantiene el aislamiento.' },
      ],

      glosario: [
        { t: 'Capa', d: 'Agrupación de código con una regla sobre a quién puede importar.' },
        { t: 'Regla de dependencia', d: 'Las dependencias apuntan hacia lo que menos cambia.' },
        { t: 'Dominio', d: 'Reglas de negocio puras, sin dependencias externas.' },
        { t: 'Aplicación', d: 'Casos de uso que orquestan el dominio a través de puertos.' },
        { t: 'Infraestructura', d: 'Implementaciones concretas: base, correo, pagos.' },
        { t: 'Composición', d: 'Único lugar donde se conectan puertos con implementaciones.' },
        { t: 'no-restricted-imports', d: 'Regla de ESLint que hace obligatoria la dirección de las dependencias.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Hexagonal: puertos y adaptadores',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> tu aplicación es una caja con <b>enchufes</b>.
Los enchufes (puertos) los define la caja; los cables que se conectan (adaptadores) los pone el mundo de
afuera.</div>

<h4>Por qué "hexagonal"</h4>
<p>El hexágono no significa nada: se dibujó así para poder poner varios lados sin sugerir "arriba" y "abajo".
Ese es todo el aporte del nombre. Lo importante es que hay <b>dos tipos de enchufe</b>:</p>

<p><b>Puertos de entrada</b> — por donde alguien le pide algo a tu aplicación. Los adaptadores son la web, una
API, un comando de consola, un cron.</p>

<p><b>Puertos de salida</b> — lo que tu aplicación necesita del mundo. Los adaptadores son la base de datos, el
correo, la pasarela de pagos.</p>

<div class="aviso"><strong>La diferencia con "capas" es sutil pero real:</strong> en capas, la UI está
<b>arriba</b> y la base <b>abajo</b>, como si una fuera más importante. En hexagonal, las dos son
<b>lo mismo</b>: cosas de afuera que se conectan a la aplicación. Y eso lleva a una conclusión práctica —
<b>la base de datos es un detalle, igual que la pantalla</b>.</div>

<h4>Lo que esto habilita</h4>
<p>La misma aplicación, con distintos adaptadores:</p>
<pre><code>Adaptadores de entrada          →  APLICACIÓN  →   Adaptadores de salida
  · web (Next.js)                                    · Postgres
  · API REST                                         · correo (Resend)
  · comando de consola                               · pagos (Mercado Pago)
  · trabajo programado                               · archivos (R2)
  · test                                             · dobles de prueba</code></pre>

<p>Fijate en la última fila: <b>los tests son un adaptador más</b>. No son un caso especial que requiere
trucos; entran por el mismo puerto que la web.</p>
`,

      tecnico: `
<h4>Los dos puertos, en código</h4>
<pre><code>// PUERTO DE ENTRADA: lo que la aplicación ofrece
export interface ConfirmarPedido {
  (id: string, usuarioId: string): Promise&lt;Pedido&gt;;
}

// PUERTOS DE SALIDA: lo que la aplicación necesita
export interface RepoPedidos { porId(id: string): Promise&lt;Pedido | null&gt;; guardar(p: Pedido): Promise&lt;void&gt;; }
export interface Notificador { pedidoConfirmado(p: Pedido): Promise&lt;void&gt;; }
export interface Reloj       { ahora(): Date; }

// EL NÚCLEO: implementa el de entrada usando los de salida
export function crearConfirmarPedido(
  deps: { repo: RepoPedidos; notificar: Notificador; reloj: Reloj },
): ConfirmarPedido {
  return async (id, usuarioId) =&gt; { … };
}</code></pre>

<div class="dato"><strong>El puerto de entrada es el que más se olvida.</strong> Sin él, cada adaptador —la
Server Action, el endpoint de API, el cron— define su propia firma, y terminás con tres formas distintas de
pedir lo mismo que se van desincronizando. Declararlo cuesta tres líneas y fija <b>el contrato de lo que la
aplicación hace</b>.</div>

<h4>Adaptadores de entrada: el mismo caso de uso, tres puertas</h4>
<pre><code>// Web
'use server';
export async function accionConfirmar(formData: FormData) {
  const sesion = await requerirSesion();
  return casosDeUso.confirmarPedido(formData.get('id') as string, sesion.usuarioId);
}

// API
export async function POST(req: Request) {
  const { id } = await req.json();
  const usuarioId = await usuarioDeToken(req);
  return Response.json(await casosDeUso.confirmarPedido(id, usuarioId));
}

// Trabajo programado
export const confirmarVencidos = inngest.createFunction(…, async () =&gt; {
  for (const id of await pendientesVencidos()) {
    await casosDeUso.confirmarPedido(id, USUARIO_SISTEMA);
  }
});</code></pre>

<div class="dato"><strong>Fijate qué hace cada adaptador y qué no.</strong> Los tres resuelven lo mismo:
<b>traducir su forma de entrada</b> —formulario, JSON, iteración— y <b>obtener la identidad</b>. Ninguno tiene
lógica de negocio. Si un adaptador empieza a decidir cosas del dominio, esa lógica va a existir en uno y faltar
en los otros dos.</div>

<h4>Dobles de prueba, que son adaptadores</h4>
<pre><code>// Un repositorio en memoria es un adaptador de salida como cualquier otro
export function repoEnMemoria(inicial: Pedido[] = []): RepoPedidos {
  const datos = new Map(inicial.map((p) =&gt; [p.id, p]));
  return {
    async porId(id) { return datos.get(id) ?? null; },
    async guardar(p) { datos.set(p.id, p); },
  };
}

const confirmar = crearConfirmarPedido({
  repo: repoEnMemoria([pedidoPendiente]),
  notificar: { async pedidoConfirmado() {} },
  reloj: { ahora: () =&gt; new Date('2026-01-01') },
});</code></pre>

<h4>El costo real, dicho sin adornos</h4>
<table>
<tr><th>Ganás</th><th>Pagás</th></tr>
<tr><td>Cambiar un proveedor toca un archivo</td><td>Una interfaz por cada dependencia</td></tr>
<tr><td>Tests sin base ni red</td><td>Un archivo de composición que mantener</td></tr>
<tr><td>El núcleo se lee sin ruido técnico</td><td>Saltar entre archivos para seguir un flujo</td></tr>
<tr><td>Varias entradas sobre la misma lógica</td><td>Más ceremonia en cambios simples</td></tr>
</table>

<div class="dato"><strong>La conclusión honesta:</strong> hexagonal se paga cuando hay <b>reglas de negocio
reales</b> y <b>más de un adaptador</b> por lado. En un CRUD con una sola UI y una sola base, la ceremonia es
más cara que el problema que resuelve — y en ese caso alcanza con no mezclar consultas dentro de los
componentes.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="hx1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA APLICACIÓN ES UNA CAJA CON ENCHUFES</text>

  <text x="24" y="48" fill="#22d3ee" font-size="10.5" font-weight="700">ADAPTADORES DE ENTRADA</text>
  <rect x="24" y="56" width="130" height="26" rx="6" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="89" y="73" text-anchor="middle" fill="currentColor" font-size="9.5">web (Next.js)</text>
  <rect x="24" y="88" width="130" height="26" rx="6" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="89" y="105" text-anchor="middle" fill="currentColor" font-size="9.5">API REST</text>
  <rect x="24" y="120" width="130" height="26" rx="6" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="89" y="137" text-anchor="middle" fill="currentColor" font-size="9.5">trabajo programado</text>
  <rect x="24" y="152" width="130" height="26" rx="6" fill="#34d399" fill-opacity=".24" stroke="#34d399" stroke-width="1.4"/>
  <text x="89" y="169" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">test ← uno más</text>

  <line x1="158" y1="70" x2="216" y2="100" stroke="#22d3ee" stroke-width="1.3" marker-end="url(#hx1)" color="#22d3ee"/>
  <line x1="158" y1="101" x2="216" y2="108" stroke="#22d3ee" stroke-width="1.3" marker-end="url(#hx1)" color="#22d3ee"/>
  <line x1="158" y1="133" x2="216" y2="118" stroke="#22d3ee" stroke-width="1.3" marker-end="url(#hx1)" color="#22d3ee"/>
  <line x1="158" y1="165" x2="216" y2="128" stroke="#34d399" stroke-width="1.3" marker-end="url(#hx1)" color="#34d399"/>

  <rect x="220" y="60" width="240" height="126" rx="12" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="2"/>
  <text x="340" y="86" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">APLICACIÓN</text>
  <text x="340" y="106" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10">reglas de negocio</text>
  <rect x="240" y="118" width="200" height="22" rx="5" fill="#34d399" fill-opacity=".2"/>
  <text x="340" y="133" text-anchor="middle" fill="currentColor" font-size="9">puerto de entrada: ConfirmarPedido</text>
  <rect x="240" y="146" width="200" height="22" rx="5" fill="#7c5cff" fill-opacity=".2"/>
  <text x="340" y="161" text-anchor="middle" fill="currentColor" font-size="9">puertos de salida: Repo · Notificador</text>
  <text x="340" y="180" text-anchor="middle" fill="#34d399" font-size="8.5" font-weight="700">los enchufes los define LA CAJA</text>

  <line x1="464" y1="100" x2="522" y2="70" stroke="#7c5cff" stroke-width="1.3" marker-end="url(#hx1)" color="#7c5cff"/>
  <line x1="464" y1="108" x2="522" y2="101" stroke="#7c5cff" stroke-width="1.3" marker-end="url(#hx1)" color="#7c5cff"/>
  <line x1="464" y1="118" x2="522" y2="133" stroke="#7c5cff" stroke-width="1.3" marker-end="url(#hx1)" color="#7c5cff"/>
  <line x1="464" y1="128" x2="522" y2="165" stroke="#34d399" stroke-width="1.3" marker-end="url(#hx1)" color="#34d399"/>

  <text x="526" y="48" fill="#7c5cff" font-size="10.5" font-weight="700">ADAPTADORES DE SALIDA</text>
  <rect x="526" y="56" width="130" height="26" rx="6" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.1"/>
  <text x="591" y="73" text-anchor="middle" fill="currentColor" font-size="9.5">Postgres</text>
  <rect x="526" y="88" width="130" height="26" rx="6" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.1"/>
  <text x="591" y="105" text-anchor="middle" fill="currentColor" font-size="9.5">correo</text>
  <rect x="526" y="120" width="130" height="26" rx="6" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.1"/>
  <text x="591" y="137" text-anchor="middle" fill="currentColor" font-size="9.5">pagos</text>
  <rect x="526" y="152" width="130" height="26" rx="6" fill="#34d399" fill-opacity=".24" stroke="#34d399" stroke-width="1.4"/>
  <text x="591" y="169" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">doble de prueba</text>

  <rect x="24" y="198" width="632" height="42" rx="9" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="218" fill="#fbbf24" font-size="11.5" font-weight="700">LA DIFERENCIA CON “CAPAS”</text>
  <text x="44" y="234" fill="currentColor" opacity=".75" font-size="11">
    En capas la UI está arriba y la base abajo, como si una importara más. Acá las dos son lo mismo: <tspan font-weight="700">la base de datos es un detalle, igual que la pantalla.</tspan></text>

  <rect x="24" y="252" width="632" height="42" rx="9" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="44" y="272" fill="#22d3ee" font-size="11.5" font-weight="700">CADA ADAPTADOR DE ENTRADA HACE SOLO DOS COSAS</text>
  <text x="44" y="288" fill="currentColor" opacity=".75" font-size="11">
    Traducir su forma de entrada (formulario · JSON · iteración) y obtener la identidad. <tspan fill="#f87171" font-weight="700">Si decide algo del dominio, esa lógica va a faltar en los otros dos.</tspan></text>

  <rect x="24" y="306" width="304" height="80" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.3"/>
  <text x="176" y="326" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">SE PAGA CUANDO…</text>
  <text x="44" y="346" fill="currentColor" opacity=".72" font-size="10.5">· hay reglas de negocio reales</text>
  <text x="44" y="364" fill="currentColor" opacity=".72" font-size="10.5">· hay más de un adaptador por lado</text>
  <text x="44" y="380" fill="#34d399" font-size="10" font-weight="700">ahí el núcleo se lee sin ruido técnico</text>

  <rect x="352" y="306" width="304" height="80" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="504" y="326" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">NO SE PAGA CUANDO…</text>
  <text x="372" y="346" fill="currentColor" opacity=".72" font-size="10.5">· es un CRUD con una UI y una base</text>
  <text x="372" y="364" fill="currentColor" opacity=".72" font-size="10.5">· no hay reglas propias que proteger</text>
  <text x="372" y="380" fill="#f87171" font-size="10" font-weight="700">ahí alcanza con no consultar dentro del componente</text>
</svg>`,
        pie: 'Los enchufes los define la caja. Los cables los pone el mundo — incluidos los tests.',
      },

      entrevista: [
        { p: '¿Qué son los puertos y adaptadores?',
          r: 'Los <b>puertos</b> son interfaces que define la aplicación: de <b>entrada</b>, lo que la aplicación ofrece, y de <b>salida</b>, ' +
             'lo que necesita del mundo. Los <b>adaptadores</b> son las implementaciones concretas: la web, la API o un cron del lado de entrada; ' +
             'Postgres, el correo o la pasarela del lado de salida. Lo clave es que <b>los enchufes los define la caja</b>, no el mundo — ' +
             'por eso la aplicación no se ata a ningún proveedor.' },

        { p: '¿En qué se diferencia hexagonal de la arquitectura en capas?',
          r: 'En capas, la UI está "arriba" y la base "abajo", como si una fuera más importante. En hexagonal las dos son <b>lo mismo</b>: ' +
             'cosas de afuera que se conectan a la aplicación. Eso lleva a una conclusión práctica que cambia decisiones: ' +
             '<b>la base de datos es un detalle, igual que la pantalla</b>. Y otra consecuencia útil: <b>los tests son un adaptador más</b>, ' +
             'no un caso especial que requiere trucos — entran por el mismo puerto que la web.' },

        { p: '¿Qué debe y qué no debe hacer un adaptador de entrada?',
          r: 'Debe hacer exactamente dos cosas: <b>traducir su forma de entrada</b> —un formulario, un JSON, una iteración de un cron— y ' +
             '<b>obtener la identidad</b> de quien pide. Lo que <b>no</b> debe tener es lógica de negocio. Si el adaptador web empieza a decidir ' +
             'cosas del dominio, esa lógica va a existir ahí y <b>faltar</b> en el endpoint de API y en el trabajo programado — ' +
             'y ese es exactamente el tipo de inconsistencia que nadie detecta hasta que alguien reporta que "por la API se puede hacer algo que ' +
             'por la web no".' },

        { p: '¿Cuándo NO vale la pena hexagonal?',
          r: 'Cuando es un CRUD con una sola UI y una sola base, sin reglas de negocio propias que proteger. Ahí la ceremonia —una interfaz por ' +
             'dependencia, un archivo de composición, saltar entre archivos para seguir un flujo— cuesta más que el problema que resuelve. ' +
             'En ese caso alcanza con <b>no meter consultas dentro de los componentes</b>. Hexagonal se paga cuando hay reglas reales y ' +
             '<b>más de un adaptador por lado</b>.' },
      ],

      practica: `
<h4>Estructura completa</h4>
<pre><code>src/
  dominio/
    pedido.ts                 tipos y reglas puras
    errores.ts

  aplicacion/
    puertos/
      entrada.ts              ConfirmarPedido, CancelarPedido…
      salida.ts               RepoPedidos, Notificador, Reloj
    confirmarPedido.ts        implementa el puerto de entrada

  infraestructura/
    repoPedidosSupabase.ts
    notificadorResend.ts
    relojSistema.ts
    composicion.ts            ← el único que conoce a todos

  app/                        adaptadores de entrada (Next.js)
    pedidos/page.tsx
    pedidos/acciones.ts
    api/pedidos/route.ts</code></pre>

<h4>Composición, con variante de test</h4>
<pre><code>// infraestructura/composicion.ts
export function crearCasosDeUso(deps?: Partial&lt;Dependencias&gt;) {
  const d: Dependencias = {
    repo: deps?.repo ?? repoPedidosSupabase,
    notificar: deps?.notificar ?? notificadorResend,
    reloj: deps?.reloj ?? relojSistema,
  };
  return {
    confirmarPedido: crearConfirmarPedido(d),
    cancelarPedido: crearCancelarPedido(d),
  };
}

export const casosDeUso = crearCasosDeUso();   // producción</code></pre>

<div class="aviso"><strong>El <code>Partial</code> es lo que hace usable esta estructura en tests.</strong>
Permite reemplazar <b>solo</b> lo que el test necesita y dejar el resto real: por ejemplo, repositorio en
memoria pero notificador de verdad si querés verificar la integración con el correo. Sin eso, cada test tiene
que construir las cinco dependencias aunque solo le importe una.</div>

<h4>Adaptador de salida completo</h4>
<pre><code>// infraestructura/repoPedidosSupabase.ts
import 'server-only';

export const repoPedidosSupabase: RepoPedidos = {
  async porId(id) {
    const { data, error } = await supabase.from('pedidos')
      .select('*, items:pedido_items(*)').eq('id', id).maybeSingle();

    if (error) throw new ErrorPersistencia('Fallo al leer el pedido', { causa: error });
    return data ? aDominio(data) : null;       // ← traduce fila → entidad
  },

  async guardar(pedido) {
    const { error } = await supabase.from('pedidos')
      .upsert(aFila(pedido));                  // ← traduce entidad → fila
    if (error) throw new ErrorPersistencia('Fallo al guardar', { causa: error });
  },
};</code></pre>

<div class="dato"><strong>Las funciones <code>aDominio</code> y <code>aFila</code> son el corazón del
adaptador.</strong> Sin ellas, la forma de la tabla —nombres en snake_case, timestamps como texto, columnas
desnormalizadas— se filtra al dominio, y las reglas de negocio terminan hablando el idioma de la base. ' +
Esa traducción es lo que permite renombrar una columna sin tocar una sola regla.</div>

<h4>Decidir si vale la pena</h4>
<table>
<tr><th>Pregunta</th><th>Sí → hexagonal</th></tr>
<tr><td>¿Hay reglas de negocio propias, no solo CRUD?</td><td>✔</td></tr>
<tr><td>¿Más de una forma de entrar? (web + API + cron)</td><td>✔</td></tr>
<tr><td>¿Integraciones externas que podrían cambiar?</td><td>✔</td></tr>
<tr><td>¿Los tests de negocio son lentos por la base?</td><td>✔</td></tr>
<tr><td>¿Es una pantalla sobre una tabla?</td><td>✘ No lo hagas</td></tr>
</table>
`,

      errores: [
        { mito: 'Hexagonal es otra cosa que arquitectura en capas.',
          realidad: 'Es la misma idea con mejor vocabulario. Lo que aporta es dejar de tratar a la base como "el fondo": ' +
                    '<b>la base de datos es un detalle, igual que la pantalla</b>, y ambas se conectan por adaptadores.' },

        { mito: 'Los tests necesitan configuración especial.',
          realidad: 'Un test es <b>un adaptador más</b>: entra por el mismo puerto que la web, con dobles del lado de salida. ' +
                    'Si tus tests necesitan trucos, es señal de que los puertos no están bien definidos.' },

        { mito: 'El adaptador web puede resolver algunas validaciones.',
          realidad: 'Entonces esa lógica <b>falta</b> en el endpoint de API y en el cron. El síntoma llega después: "por la API se puede hacer algo ' +
                    'que por la web no". Los adaptadores traducen y autentican; no deciden.' },

        { mito: 'El repositorio puede devolver las filas tal como vienen.',
          realidad: 'Ahí la forma de la tabla se filtra al dominio y las reglas terminan hablando el idioma de la base. Con funciones de traducción ' +
                    'podés renombrar una columna sin tocar una sola regla.' },
      ],

      glosario: [
        { t: 'Puerto', d: 'Interfaz que define la aplicación para hablar con el mundo.' },
        { t: 'Puerto de entrada', d: 'Lo que la aplicación ofrece. Lo consumen web, API, cron o tests.' },
        { t: 'Puerto de salida', d: 'Lo que la aplicación necesita: persistencia, correo, pagos.' },
        { t: 'Adaptador', d: 'Implementación concreta de un puerto.' },
        { t: 'Núcleo', d: 'Dominio y casos de uso: lo que queda si sacás todos los adaptadores.' },
        { t: 'Traducción', d: 'Convertir entre la forma del almacenamiento y la del dominio.' },
        { t: 'Doble de prueba', d: 'Adaptador de salida hecho para tests.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Clean Architecture: qué tomar y qué dejar',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> Clean Architecture toma la misma regla de siempre
—las dependencias apuntan hacia adentro— y le agrega <b>mucha ceremonia</b>. Vale la pena conocer qué parte de
esa ceremonia sirve y cuál no.</div>

<h4>Los cuatro círculos</h4>
<table>
<tr><th>Círculo</th><th>Qué contiene</th></tr>
<tr><td><b>Entidades</b></td><td>Reglas de negocio que valdrían aunque no hubiera software</td></tr>
<tr><td><b>Casos de uso</b></td><td>Reglas específicas de esta aplicación</td></tr>
<tr><td><b>Adaptadores</b></td><td>Traducen entre el mundo y los casos de uso</td></tr>
<tr><td><b>Frameworks</b></td><td>Next.js, la base, el SDK de pagos</td></tr>
</table>
<p>Las dependencias apuntan <b>siempre hacia adentro</b>. Es la misma regla del módulo anterior.</p>

<h4>Lo que hay que tomar</h4>
<ol>
<li><b>La regla de dependencia.</b> Es la única idea imprescindible.</li>
<li><b>Que las reglas de negocio sean independientes</b> del framework y de la base.</li>
<li><b>Que la base de datos sea un detalle</b>, no el punto de partida del diseño.</li>
<li><b>Testear el núcleo sin infraestructura.</b></li>
</ol>

<h4>Lo que conviene dejar</h4>
<div class="aviso"><strong>La ceremonia de los objetos de transporte entre cada capa.</strong> La versión de
manual propone que cada frontera tenga su propio tipo: un <code>PedidoRequest</code> en el adaptador, un
<code>ConfirmarPedidoInput</code> en el caso de uso, una <code>Pedido</code> entidad, un
<code>PedidoDTO</code> de salida, un <code>PedidoViewModel</code> para la pantalla. <b>Cinco tipos con los
mismos campos y cuatro funciones de conversión, para guardar un pedido.</b></div>

<p>En un sistema con reglas complejas, esa separación se paga. En una aplicación normal, produce archivos que
solo copian campos de un objeto a otro — y cuando agregás un campo, hay que agregarlo en cinco lugares.</p>

<h4>La versión práctica</h4>
<pre><code>Tomá:   la regla de dependencia
        el dominio sin imports externos
        puertos para lo que sale al mundo
        una traducción: fila de base ↔ entidad

Dejá:   un tipo distinto por frontera
        una interfaz por cada caso de uso
        carpetas con los nombres del libro
        aplicar la estructura completa a un CRUD</code></pre>
`,

      tecnico: `
<h4>Dónde sí conviene un tipo aparte</h4>
<p>No todos los objetos de transporte son ceremonia. Hay tres fronteras donde separar el tipo <b>gana algo
concreto</b>:</p>
<table>
<tr><th>Frontera</th><th>Por qué separar</th></tr>
<tr><td><b>Fila de base ↔ entidad</b></td><td>Para renombrar columnas sin tocar reglas</td></tr>
<tr><td><b>Entidad → respuesta de API</b></td><td>Para no filtrar campos internos sin querer</td></tr>
<tr><td><b>Entrada externa → entidad</b></td><td>Porque la entrada no es confiable y hay que validarla</td></tr>
</table>

<div class="dato"><strong>La segunda es la que tiene consecuencias de seguridad.</strong> Si tu endpoint
devuelve la entidad tal cual, el día que alguien agregue un campo <code>notasInternas</code> o
<code>margenDeGanancia</code> a la tabla, <b>ese campo se publica solo</b>. Un tipo de salida explícito
convierte esa filtración en un cambio deliberado.</div>

<h4>Serialización explícita</h4>
<pre><code>// ❌ Devuelve todo lo que tenga la entidad, hoy y en el futuro
return Response.json(pedido);

// ✔ Explícito: agregar un campo a la entidad NO lo publica
export function pedidoPublico(p: Pedido) {
  return {
    id: p.id,
    estado: p.estado,
    total: p.total,
    items: p.items.map((i) =&gt; ({ nombre: i.nombre, cantidad: i.cantidad, precio: i.precio })),
    creadoEn: p.creadoEn.toISOString(),
  };
}
return Response.json(pedidoPublico(pedido));</code></pre>

<h4>Validación en la frontera de entrada</h4>
<pre><code>// Lo que llega de afuera NO es del tipo que dice ser
const EntradaConfirmar = z.object({
  pedidoId: z.string().uuid(),
  notas: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  const parseo = EntradaConfirmar.safeParse(await req.json());
  if (!parseo.success) return Response.json({ error: 'Entrada inválida' }, { status: 400 });

  // A partir de acá el tipo es confiable
  const pedido = await casosDeUso.confirmarPedido(parseo.data.pedidoId, usuarioId);
  return Response.json(pedidoPublico(pedido));
}</code></pre>

<div class="dato"><strong>Ese <code>safeParse</code> es la frontera real del sistema.</strong> Todo lo que
está adentro puede confiar en los tipos; todo lo que está afuera, no. Marcar ese límite con validación —y no
con un <code>as</code>— es lo que hace que TypeScript sirva para algo en el borde: ' +
un <code>as</code> le miente al compilador sobre datos que vienen de la red.</div>

<h4>El síntoma de que te pasaste de ceremonia</h4>
<pre><code>Agregar un campo "descuento" a un pedido obliga a tocar:

  1. la tabla                              ← inevitable
  2. la entidad del dominio                ← inevitable
  3. el tipo de fila                       ← ok, es la traducción
  4. PedidoRequestDTO                      ← ¿por qué?
  5. ConfirmarPedidoInput                  ← ¿por qué?
  6. PedidoResponseDTO                     ← ok si es la API pública
  7. PedidoViewModel                       ← ¿por qué?
  8. cuatro funciones de mapeo             ← acá está el problema</code></pre>

<div class="dato"><strong>Tres o cuatro archivos por campo nuevo es razonable; ocho no.</strong> Si un cambio
trivial toca ocho archivos, la arquitectura está cobrando un peaje que no está devolviendo nada — y el equipo
va a empezar a evitar los cambios chicos, que es exactamente lo contrario de lo que se buscaba.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <circle cx="180" cy="120" r="92" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.2"/>
  <circle cx="180" cy="120" r="70" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.2"/>
  <circle cx="180" cy="120" r="48" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.3"/>
  <circle cx="180" cy="120" r="26" fill="#34d399" fill-opacity=".25" stroke="#34d399" stroke-width="1.6"/>

  <text x="180" y="124" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">entidades</text>
  <text x="180" y="82" text-anchor="middle" fill="#fbbf24" font-size="8.5" font-weight="700">casos de uso</text>
  <text x="180" y="62" text-anchor="middle" fill="#22d3ee" font-size="8.5" font-weight="700">adaptadores</text>
  <text x="180" y="42" text-anchor="middle" fill="#7c5cff" font-size="8.5" font-weight="700">frameworks</text>

  <text x="180" y="234" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10" font-weight="700">
    las dependencias apuntan hacia adentro</text>

  <rect x="300" y="34" width="356" height="86" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="320" y="56" fill="#34d399" font-size="12" font-weight="700">TOMÁ</text>
  <text x="320" y="76" fill="currentColor" opacity=".75" font-size="10.5">· la regla de dependencia</text>
  <text x="320" y="92" fill="currentColor" opacity=".75" font-size="10.5">· el dominio sin imports externos</text>
  <text x="320" y="108" fill="currentColor" opacity=".75" font-size="10.5">· puertos + traducción fila ↔ entidad</text>

  <rect x="300" y="130" width="356" height="104" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.5"/>
  <text x="320" y="152" fill="#f87171" font-size="12" font-weight="700">DEJÁ</text>
  <text x="320" y="172" fill="currentColor" opacity=".75" font-size="10.5">· un tipo distinto por cada frontera</text>
  <text x="320" y="188" fill="currentColor" opacity=".75" font-size="10.5">· una interfaz por cada caso de uso</text>
  <text x="320" y="204" fill="currentColor" opacity=".75" font-size="10.5">· carpetas con los nombres del libro</text>
  <text x="320" y="222" fill="#f87171" font-size="10.5" font-weight="700">· aplicar la estructura completa a un CRUD</text>

  <rect x="24" y="252" width="632" height="60" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.5"/>
  <text x="44" y="272" fill="#f87171" font-size="11.5" font-weight="700">EL SÍNTOMA DE QUE TE PASASTE: agregar un campo “descuento” obliga a tocar…</text>
  <text x="44" y="290" fill="#34d399" font-size="10.5">tabla · entidad · traducción de fila · tipo de salida de API</text>
  <text x="400" y="290" fill="#34d399" font-size="10.5" font-weight="700">← 3-4 archivos: razonable</text>
  <text x="44" y="306" fill="#f87171" font-size="10.5">+ RequestDTO + Input + ViewModel + 4 mapeos</text>
  <text x="400" y="306" fill="#f87171" font-size="10.5" font-weight="700">← 8 archivos: peaje sin retorno</text>

  <rect x="24" y="322" width="632" height="64" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="44" y="342" fill="#fbbf24" font-size="11.5" font-weight="700">LAS TRES FRONTERAS DONDE SEPARAR EL TIPO SÍ GANA ALGO</text>
  <text x="44" y="360" fill="currentColor" opacity=".75" font-size="10.5">
    fila ↔ entidad (renombrar columnas sin tocar reglas) · entrada externa → entidad (validar lo no confiable)</text>
  <text x="44" y="378" fill="#f87171" font-size="10.5" font-weight="700">
    entidad → respuesta de API: sin tipo explícito, un campo nuevo como “margenDeGanancia” SE PUBLICA SOLO.</text>
</svg>`,
        pie: 'La regla de dependencia es la idea. Los cinco tipos por frontera son la ceremonia.',
      },

      entrevista: [
        { p: '¿Qué tomarías y qué dejarías de Clean Architecture?',
          r: 'Tomo la <b>regla de dependencia</b> —que es la única idea imprescindible—, el dominio sin imports externos, los puertos para lo que sale ' +
             'al mundo, y la traducción entre fila de base y entidad. Dejo la ceremonia de <b>un tipo distinto por cada frontera</b>: ' +
             'un request, un input, una entidad, un DTO de salida y un view model con los mismos campos, más cuatro funciones de conversión. ' +
             'En un sistema con reglas complejas eso se paga; en una aplicación normal produce archivos que solo copian campos.' },

        { p: '¿Hay fronteras donde sí conviene un tipo aparte?',
          r: 'Tres. <b>Fila de base ↔ entidad</b>, para poder renombrar una columna sin tocar reglas. <b>Entrada externa → entidad</b>, ' +
             'porque lo que llega de afuera no es confiable y hay que validarlo con un esquema, no con un <code>as</code>. ' +
             'Y <b>entidad → respuesta de API</b>, que es la que tiene consecuencias de seguridad: si devolvés la entidad tal cual, el día que alguien ' +
             'agregue <code>margenDeGanancia</code> a la tabla, <b>ese campo se publica solo</b>. Un tipo de salida explícito convierte esa filtración ' +
             'en un cambio deliberado.' },

        { p: '¿Cómo sabés que te pasaste de ceremonia arquitectónica?',
          r: 'Contando archivos por cambio trivial. Agregar un campo <code>descuento</code> a un pedido debería tocar la tabla, la entidad, ' +
             'la traducción de fila y quizás el tipo de salida de la API: <b>tres o cuatro archivos es razonable</b>. ' +
             'Si toca ocho —request, input, view model, cuatro mapeos— la arquitectura está cobrando un peaje que no devuelve nada. ' +
             'Y hay una consecuencia peor que el tiempo perdido: <b>el equipo empieza a evitar los cambios chicos</b>, que es lo contrario de lo que ' +
             'se buscaba.' },

        { p: '¿Por qué validar la entrada con un esquema en vez de castear el tipo?',
          r: 'Porque un <code>as</code> <b>le miente al compilador</b> sobre datos que vienen de la red: TypeScript deja de protegerte justo en el ' +
             'punto donde el dato no es confiable. Con un <code>safeParse</code> marcás la frontera real del sistema: todo lo que está adentro puede ' +
             'confiar en los tipos, todo lo que está afuera no. Es lo que hace que la verificación de tipos sirva para algo en el borde ' +
             'y no solo en el interior.' },
      ],

      practica: `
<h4>Estructura razonable, sin ceremonia de más</h4>
<pre><code>src/
  dominio/
    pedido.ts              entidad + reglas + errores

  aplicacion/
    puertos.ts             RepoPedidos, Notificador, Reloj
    confirmarPedido.ts

  infraestructura/
    repoPedidos.ts         aDominio() / aFila()   ← traducción 1
    composicion.ts

  app/
    api/pedidos/route.ts   safeParse()            ← traducción 2 (entrada)
    _serializar.ts         pedidoPublico()        ← traducción 3 (salida)</code></pre>
<p>Tres traducciones, cada una con un motivo. Ninguna es "porque el libro lo dice".</p>

<h4>Serialización explícita, que evita filtraciones</h4>
<pre><code>// app/_serializar.ts
export function pedidoPublico(p: Pedido) {
  return {
    id: p.id,
    estado: p.estado,
    total: p.total,
    items: p.items.map((i) =&gt; ({ nombre: i.nombre, cantidad: i.cantidad })),
    creadoEn: p.creadoEn.toISOString(),
  };
}

// Un test que atrapa la filtración antes de que ocurra
test('la respuesta pública no expone campos internos', () =&gt; {
  const salida = pedidoPublico(pedidoCompleto);
  expect(salida).not.toHaveProperty('margenDeGanancia');
  expect(salida).not.toHaveProperty('notasInternas');
  expect(salida).not.toHaveProperty('costoProveedor');
});</code></pre>

<div class="aviso"><strong>Ese test es más valioso de lo que parece.</strong> Falla el día que alguien agregue
un campo sensible y lo incluya sin pensar en la serialización — que es justamente el momento en que nadie lo
está mirando.</div>

<h4>Validación en el borde</h4>
<pre><code>const Entrada = z.object({
  pedidoId: z.string().uuid(),
  notas: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  const r = Entrada.safeParse(await req.json());
  if (!r.success) {
    return Response.json({ error: 'Entrada inválida', detalle: r.error.issues }, { status: 400 });
  }
  // desde acá, los tipos son confiables
}</code></pre>

<h4>Cuánta arquitectura, según el proyecto</h4>
<table>
<tr><th>Proyecto</th><th>Estructura</th></tr>
<tr><td>Landing</td><td>Componentes. Nada más</td></tr>
<tr><td>CRUD con panel</td><td><code>funcionalidades/</code> con servicio por funcionalidad</td></tr>
<tr><td>SaaS con reglas propias</td><td>Dominio + puertos + infraestructura</td></tr>
<tr><td>Sistema con reglas críticas</td><td>Lo anterior + tipos por frontera + tests de contrato</td></tr>
</table>
`,

      errores: [
        { mito: 'Clean Architecture es la forma correcta de estructurar cualquier proyecto.',
          realidad: 'Es una forma con un costo alto de ceremonia. La <b>regla de dependencia</b> aplica siempre; los cinco tipos por frontera solo se ' +
                    'pagan con reglas de negocio complejas.' },

        { mito: 'Devuelvo la entidad y listo.',
          realidad: 'El día que alguien agregue <code>margenDeGanancia</code> a la tabla, <b>ese campo se publica solo</b>. Un tipo de salida explícito ' +
                    'convierte esa filtración en un cambio deliberado — y un test lo atrapa.' },

        { mito: 'Casteo la entrada con "as" porque sé qué llega.',
          realidad: '<code>as</code> le <b>miente al compilador</b> sobre datos que vienen de la red. La frontera real del sistema es un ' +
                    '<code>safeParse</code>: adentro los tipos son confiables, afuera no.' },

        { mito: 'Si agregar un campo toca ocho archivos, es porque la arquitectura es sólida.',
          realidad: 'Es un <b>peaje sin retorno</b>. Y tiene una consecuencia peor que el tiempo: el equipo empieza a evitar los cambios chicos, ' +
                    'que es lo contrario de lo que la arquitectura buscaba.' },
      ],

      glosario: [
        { t: 'Clean Architecture', d: 'Formulación de la regla de dependencia con cuatro círculos concéntricos.' },
        { t: 'Entidad', d: 'Regla de negocio que valdría aunque no hubiera software.' },
        { t: 'Caso de uso', d: 'Regla específica de esta aplicación.' },
        { t: 'DTO', d: 'Objeto de transporte entre fronteras. Útil solo en algunas.' },
        { t: 'Serialización explícita', d: 'Función que decide qué campos se publican.' },
        { t: 'Frontera de confianza', d: 'Punto donde se valida lo que viene de afuera.' },
        { t: 'safeParse', d: 'Validación que devuelve éxito o error en vez de lanzar.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Cómo se ve esto en una app Next.js real',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> en una app moderna con componentes de servidor, la
frontera importante ya no es "capa de arriba y capa de abajo": es <b>qué corre en el servidor y qué llega al
navegador</b>.</div>

<h4>La regla que ordena todo</h4>
<p>Los componentes de servidor pueden leer directo de la base; los de cliente, nunca. Y toda mutación pasa por
una acción de servidor.</p>
<pre><code>Componente de servidor  → puede consultar datos directamente
Componente de cliente   → recibe datos por props; solo interactividad
Server Action           → toda escritura pasa por acá, con validación</code></pre>

<div class="aviso"><strong>Y la regla que está en el estándar del workspace y viene de un problema
concreto:</strong> nada de <code>insert</code>, <code>update</code>, <code>delete</code> ni
<code>storage.upload</code> dentro de un componente cliente. No es purismo: <b>una mutación desde el cliente
depende únicamente de RLS para ser segura</b>, y no hay ningún lugar donde poner las validaciones de negocio
que no sean de base. Lo único válido desde el cliente es <code>auth</code> y las suscripciones en tiempo
real.</div>

<h4>Organizar por funcionalidad</h4>
<pre><code>src/
  app/                        rutas: lo más fino posible
    pedidos/
      page.tsx                componente de servidor: consulta y compone
      acciones.ts             'use server'

  funcionalidades/
    pedidos/
      componentes/            los de cliente van acá
      servicio.ts             consultas y mutaciones (server-only)
      reglas.ts               lógica pura, testeable
      esquemas.ts             zod, compartido entre cliente y servidor
      tipos.ts
      index.ts                la puerta de adelante

  compartido/
    ui/  utilidades/  configuracion/</code></pre>

<div class="dato"><strong>Que la carpeta <code>app/</code> sea delgada es una decisión deliberada.</strong> Las
rutas son el detalle más volátil de todos: cambian de nombre, se mueven, se agrupan. Si la lógica vive ahí,
reorganizar la navegación se convierte en un refactor de negocio.</div>

<h4>Qué gana esto</h4>
<ul>
<li>Todo lo de pedidos está en un lugar.</li>
<li>La <code>index.ts</code> define qué es público de la funcionalidad.</li>
<li>Las reglas se pueden probar sin base ni React.</li>
<li>Mover una ruta no toca la lógica.</li>
</ul>
`,

      tecnico: `
<h4>El flujo completo de una escritura</h4>
<pre><code>// 1 · esquemas.ts — compartido: una sola definición de qué es válido
export const EsquemaNuevoPedido = z.object({
  clienteId: z.string().uuid(),
  items: z.array(z.object({ productoId: z.string().uuid(), cantidad: z.number().int().positive() })).min(1),
});

// 2 · reglas.ts — pura: se prueba sin nada
export function calcularTotal(items: ItemConPrecio[]): number { … }
export function puedeCrearPedido(cliente: Cliente): boolean {
  return cliente.activo &amp;&amp; !cliente.bloqueado &amp;&amp; cliente.deuda &lt; LIMITE_DEUDA;
}

// 3 · servicio.ts — server-only: habla con la base
import 'server-only';
export async function crearPedido(datos: NuevoPedido, tenantId: string) { … }

// 4 · acciones.ts — la frontera: sesión, tenant, validación
'use server';
export async function accionCrearPedido(_prev: unknown, formData: FormData) {
  const tenant = await requireTenantContext(supabase);
  if (!tenant.ok) return { error: tenant.error };

  const parseo = EsquemaNuevoPedido.safeParse(objetoDe(formData));
  if (!parseo.success) return { error: 'Datos inválidos', detalle: parseo.error.flatten() };

  const cliente = await clientes.porId(parseo.data.clienteId, tenant.ctx.tenantId);
  if (!cliente || !puedeCrearPedido(cliente)) return { error: 'El cliente no puede operar' };

  const pedido = await crearPedido(parseo.data, tenant.ctx.tenantId);
  revalidatePath('/pedidos');
  return { ok: true, id: pedido.id };
}</code></pre>

<div class="dato"><strong>El orden de esa acción es el que importa y casi siempre se hace mal:</strong>
<b>sesión y tenant primero, después validar la forma, después las reglas de negocio, y recién ahí escribir</b>. ' +
Validar antes de autenticar desperdicia trabajo y, peor, puede filtrar información sobre qué datos existen a
través de los mensajes de error.</div>

<h4>Servidor y cliente: dónde va cada cosa</h4>
<table>
<tr><th>Necesitás…</th><th>Va en…</th></tr>
<tr><td>Leer datos para mostrar</td><td>Componente de servidor</td></tr>
<tr><td>Estado local, <code>onClick</code>, formularios interactivos</td><td>Componente de cliente</td></tr>
<tr><td>Escribir en la base</td><td><b>Server Action</b></td></tr>
<tr><td>Subir un archivo</td><td><b>Server Action</b> (el tenant lo pone el servidor)</td></tr>
<tr><td>Suscripción en tiempo real</td><td>Componente de cliente</td></tr>
<tr><td>Iniciar o cerrar sesión</td><td>Componente de cliente</td></tr>
</table>

<div class="dato"><strong>La fila de la subida es la que más se viola y la que peor consecuencia tiene.</strong>
Si el cliente arma la ruta del archivo, puede escribir en la carpeta de otro tenant. El
<code>tenant_id</code> del path lo tiene que poner <b>el servidor</b>, siempre — y es exactamente la misma
regla que ya viste en el track de infraestructura.</div>

<h4>El presupuesto de tamaño</h4>
<pre><code>Componente     &gt; 300 líneas  →  extraer lógica a un hook o a reglas.ts
Archivo        &gt; 500 líneas  →  mirar por qué
page.tsx       &gt; 100 líneas  →  está haciendo demasiado; componer
acciones.ts    &gt; 200 líneas  →  partir por funcionalidad</code></pre>

<h4>Un error que aparece con componentes de servidor</h4>
<pre><code>// ❌ N+1 en el servidor: se ve inocente y hace 51 consultas
export default async function Pagina() {
  const pedidos = await listarPedidos();
  return &lt;&gt;{pedidos.map((p) =&gt; &lt;FilaPedido key={p.id} pedido={p} /&gt;)}&lt;/&gt;;
}
async function FilaPedido({ pedido }) {
  const cliente = await clientePorId(pedido.clienteId);   // ← una por fila
  …
}

// ✔ Traer lo necesario en una consulta
const pedidos = await listarPedidos({ incluir: ['cliente'] });</code></pre>

<div class="dato"><strong>Este error es más fácil de cometer con componentes de servidor que con la carga de
datos tradicional</strong>, justamente porque poner un <code>await</code> dentro de un componente se siente
natural y no se ve como una consulta. Medir la cantidad de consultas por petición en desarrollo es la forma
más directa de detectarlo.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="nx1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA FRONTERA QUE IMPORTA: SERVIDOR / NAVEGADOR</text>

  <rect x="24" y="34" width="300" height="150" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.5"/>
  <text x="174" y="56" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">SERVIDOR</text>
  <rect x="44" y="68" width="260" height="24" rx="6" fill="#34d399" fill-opacity=".22"/>
  <text x="174" y="85" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">componente de servidor → consulta directa</text>
  <rect x="44" y="98" width="260" height="24" rx="6" fill="#34d399" fill-opacity=".28"/>
  <text x="174" y="115" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">Server Action → TODA escritura</text>
  <rect x="44" y="128" width="260" height="24" rx="6" fill="#34d399" fill-opacity=".18"/>
  <text x="174" y="145" text-anchor="middle" fill="currentColor" font-size="9.5">servicio.ts (server-only) · reglas.ts</text>
  <text x="174" y="170" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">acá viven las validaciones de negocio</text>

  <line x1="328" y1="90" x2="360" y2="90" stroke="#34d399" stroke-width="1.6" marker-end="url(#nx1)" color="#34d399"/>
  <text x="344" y="82" text-anchor="middle" fill="currentColor" opacity=".5" font-size="8">props</text>
  <line x1="360" y1="120" x2="328" y2="120" stroke="#22d3ee" stroke-width="1.6" marker-end="url(#nx1)" color="#22d3ee"/>
  <text x="344" y="136" text-anchor="middle" fill="currentColor" opacity=".5" font-size="8">acción</text>

  <rect x="364" y="34" width="292" height="150" rx="10" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.5"/>
  <text x="510" y="56" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">NAVEGADOR</text>
  <rect x="384" y="68" width="252" height="24" rx="6" fill="#22d3ee" fill-opacity=".22"/>
  <text x="510" y="85" text-anchor="middle" fill="currentColor" font-size="9.5">estado local · onClick · formularios</text>
  <rect x="384" y="98" width="252" height="24" rx="6" fill="#22d3ee" fill-opacity=".18"/>
  <text x="510" y="115" text-anchor="middle" fill="currentColor" font-size="9.5">auth · suscripciones en tiempo real</text>
  <rect x="384" y="128" width="252" height="24" rx="6" fill="#f87171" fill-opacity=".24" stroke="#f87171" stroke-width="1.3"/>
  <text x="510" y="145" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">✗ insert · update · delete · upload</text>
  <text x="510" y="170" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">acá NO hay dónde poner esas validaciones</text>

  <rect x="24" y="196" width="632" height="44" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.5"/>
  <text x="44" y="216" fill="#f87171" font-size="11.5" font-weight="700">NO ES PURISMO: una mutación desde el cliente depende ÚNICAMENTE de RLS.</text>
  <text x="44" y="234" fill="currentColor" opacity=".75" font-size="11">
    Y en una subida, si el cliente arma la ruta puede escribir en la carpeta de otro tenant. El <tspan font-family="monospace" font-weight="700">tenant_id</tspan> lo pone el SERVIDOR.</text>

  <text x="24" y="266" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL ORDEN DENTRO DE UNA SERVER ACTION — casi siempre se hace mal</text>

  <rect x="24" y="278" width="146" height="42" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.4"/>
  <text x="97" y="296" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">1 · sesión + tenant</text>
  <text x="97" y="312" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">primero, siempre</text>

  <text x="178" y="304" fill="currentColor" opacity=".4" font-size="13">→</text>

  <rect x="196" y="278" width="146" height="42" rx="8" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="269" y="296" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">2 · validar la forma</text>
  <text x="269" y="312" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">safeParse</text>

  <text x="350" y="304" fill="currentColor" opacity=".4" font-size="13">→</text>

  <rect x="368" y="278" width="146" height="42" rx="8" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="441" y="296" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">3 · reglas de negocio</text>
  <text x="441" y="312" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">reglas.ts, puras</text>

  <text x="522" y="304" fill="currentColor" opacity=".4" font-size="13">→</text>

  <rect x="540" y="278" width="116" height="42" rx="8" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.2"/>
  <text x="598" y="296" text-anchor="middle" fill="#7c5cff" font-size="10" font-weight="700">4 · escribir</text>
  <text x="598" y="312" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">+ revalidatePath</text>

  <rect x="24" y="332" width="632" height="54" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="352" fill="#fbbf24" font-size="11.5" font-weight="700">EL ERROR NUEVO DE LOS COMPONENTES DE SERVIDOR: N+1 QUE NO PARECE UNA CONSULTA</text>
  <text x="44" y="370" fill="currentColor" opacity=".75" font-size="11">
    Un <tspan font-family="monospace" font-weight="700">await</tspan> dentro de un componente de fila se siente natural… y hace una consulta por fila.</text>
  <text x="44" y="384" fill="#34d399" font-size="10.5" font-weight="700">
    Medir consultas por petición en desarrollo es la forma más directa de detectarlo.</text>
</svg>`,
        pie: 'La carpeta app/ es lo más volátil. Si la lógica vive ahí, mover una ruta es un refactor de negocio.',
      },

      entrevista: [
        { p: '¿Por qué toda mutación debe pasar por una Server Action?',
          r: 'Porque una mutación hecha desde el cliente depende <b>únicamente de RLS</b> para ser segura, y no hay ningún lugar donde poner las ' +
             'validaciones de negocio que no sean de base — "este cliente no puede comprar porque tiene deuda" no es una política de base. ' +
             'Desde el cliente lo único válido es <code>auth</code> y las suscripciones en tiempo real. ' +
             'Y en las subidas de archivos es peor: si el cliente arma la ruta, puede escribir en la carpeta de otro tenant. ' +
             'El <code>tenant_id</code> lo pone el servidor, siempre.' },

        { p: '¿Cuál es el orden correcto dentro de una Server Action?',
          r: '<b>Sesión y tenant primero</b>, después validar la forma con un esquema, después las reglas de negocio, y recién ahí escribir. ' +
             'Casi siempre se hace al revés —validar antes de autenticar— y eso desperdicia trabajo y, peor, puede <b>filtrar información sobre qué ' +
             'datos existen</b> a través de los mensajes de error. Al final, revalidar la ruta afectada para que la lectura siguiente vea el cambio.' },

        { p: '¿Cómo organizarías las carpetas de una app Next.js?',
          r: 'Por <b>funcionalidad</b>, con <code>app/</code> lo más delgada posible. Cada funcionalidad tiene sus componentes, su servicio ' +
             '<code>server-only</code>, sus reglas puras, sus esquemas compartidos y un <code>index.ts</code> que define qué es público. ' +
             'Que <code>app/</code> sea delgada es deliberado: <b>las rutas son el detalle más volátil de todos</b> —cambian de nombre, se mueven, ' +
             'se agrupan— y si la lógica vive ahí, reorganizar la navegación se convierte en un refactor de negocio.' },

        { p: '¿Qué error nuevo aparece con los componentes de servidor?',
          r: 'El <b>N+1 que no parece una consulta</b>. Poner un <code>await</code> dentro de un componente de fila se siente natural — es solo un ' +
             'componente que necesita un dato— y produce una consulta por fila. Es más fácil de cometer que con la carga de datos tradicional, ' +
             'justamente porque no se ve como una consulta. La forma más directa de detectarlo es <b>medir la cantidad de consultas por petición</b> ' +
             'en desarrollo y avisar cuando pasa un umbral.' },
      ],

      practica: `
<h4>Server Action completa, en el orden correcto</h4>
<pre><code>'use server';
import 'server-only';

export async function accionCrearPedido(_prev: unknown, formData: FormData) {
  // 1 · identidad y tenant — ANTES que nada
  const tenant = await requireTenantContext(supabase);
  if (!tenant.ok) return { error: tenant.error };

  // 2 · forma de los datos
  const parseo = EsquemaNuevoPedido.safeParse(Object.fromEntries(formData));
  if (!parseo.success) {
    return { error: 'Datos inválidos', campos: parseo.error.flatten().fieldErrors };
  }

  // 3 · reglas de negocio (puras, testeables)
  const cliente = await clientes.porId(parseo.data.clienteId, tenant.ctx.tenantId);
  if (!cliente) return { error: 'Cliente inexistente' };
  if (!puedeCrearPedido(cliente)) return { error: 'El cliente tiene la cuenta bloqueada' };

  // 4 · escribir y revalidar
  const pedido = await pedidos.crear(parseo.data, tenant.ctx.tenantId);
  revalidatePath('/pedidos');
  return { ok: true, id: pedido.id };
}</code></pre>

<h4>Subida de archivo, con el tenant del servidor</h4>
<pre><code>'use server';
export async function accionSubirComprobante(formData: FormData) {
  const tenant = await requireTenantContext(supabase);
  if (!tenant.ok) return { error: tenant.error };

  const archivo = formData.get('archivo') as File;
  if (!archivo || archivo.size &gt; 5_000_000) return { error: 'Archivo inválido' };
  if (!['image/jpeg', 'image/png', 'application/pdf'].includes(archivo.type)) {
    return { error: 'Formato no permitido' };
  }

  // El path lo arma el SERVIDOR. El cliente no elige dónde escribe.
  const ruta = \`\${tenant.ctx.tenantId}/comprobantes/\${crypto.randomUUID()}\`;
  const { error } = await supabase.storage.from('comprobantes').upload(ruta, archivo);
  if (error) return { error: 'No se pudo subir' };

  return { ok: true, ruta };
}</code></pre>

<div class="aviso"><strong>Las tres verificaciones antes de subir —tamaño, tipo y ruta armada por el
servidor— son las que convierten una subida en algo seguro.</strong> Sin la tercera, el aislamiento entre
tenants desaparece por completo, sin importar cuán buenas sean las políticas del bucket.</div>

<h4>Detectar N+1 en desarrollo</h4>
<pre><code>// instrumentacion.ts
let consultas = 0;
export function contar() { consultas++; }
export function reportar(ruta: string) {
  if (consultas &gt; 10) console.warn(\`⚠ \${consultas} consultas en \${ruta}\`);
  consultas = 0;
}</code></pre>

<h4>Checklist de una funcionalidad</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Cero mutaciones de base desde componentes cliente</td></tr>
<tr><td>☐</td><td>El servicio es <code>server-only</code></td></tr>
<tr><td>☐</td><td>Las reglas puras están en un archivo aparte y tienen tests</td></tr>
<tr><td>☐</td><td>El esquema zod se comparte entre cliente y servidor</td></tr>
<tr><td>☐</td><td>Las acciones validan sesión y tenant <b>primero</b></td></tr>
<tr><td>☐</td><td>Los paths de storage los arma el servidor</td></tr>
<tr><td>☐</td><td>Hay un <code>index.ts</code> que define lo público</td></tr>
<tr><td>☐</td><td><code>page.tsx</code> compone y no contiene lógica</td></tr>
</table>
`,

      errores: [
        { mito: 'Un insert desde el cliente está bien si hay RLS.',
          realidad: 'RLS cubre el aislamiento, no las <b>reglas de negocio</b>: "este cliente no puede comprar porque tiene deuda" no es una política ' +
                    'de base. Y sin Server Action no hay dónde ponerlas.' },

        { mito: 'El cliente puede armar la ruta del archivo que sube.',
          realidad: 'Entonces puede escribir en la carpeta de <b>otro tenant</b>. El <code>tenant_id</code> del path lo pone el servidor, siempre, ' +
                    'sin importar cuán buenas sean las políticas del bucket.' },

        { mito: 'Valido primero y después chequeo la sesión.',
          realidad: 'Desperdicia trabajo y puede <b>filtrar información</b> sobre qué datos existen vía los mensajes de error. ' +
                    'Sesión y tenant primero, siempre.' },

        { mito: 'Con componentes de servidor no hay N+1.',
          realidad: 'Es <b>más fácil</b> de cometer: un <code>await</code> dentro de un componente de fila se siente natural y no se ve como una ' +
                    'consulta. Hay que traer las relaciones en la consulta inicial y medir consultas por petición.' },
      ],

      glosario: [
        { t: 'Componente de servidor', d: 'Se renderiza en el servidor y puede consultar datos directamente.' },
        { t: 'Componente de cliente', d: 'Corre en el navegador. Solo interactividad y estado local.' },
        { t: 'Server Action', d: 'Función de servidor invocable desde el cliente. Toda escritura pasa por acá.' },
        { t: 'server-only', d: 'Marca que hace fallar el build si un módulo se importa desde el cliente.' },
        { t: 'revalidatePath', d: 'Invalida la caché de una ruta tras una mutación.' },
        { t: 'Esquema compartido', d: 'Definición de validez usada por cliente y servidor.' },
        { t: 'Puerta de adelante', d: 'El index de una funcionalidad: define qué es público.' },
        { t: 'Presupuesto de tamaño', d: 'Umbrales de líneas que disparan una revisión.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es la regla central de la arquitectura en capas?',
      opciones: [
        'Las dependencias apuntan siempre hacia lo que menos cambia, incluida la infraestructura hacia el dominio',
        'Cada capa puede llamar a cualquier otra si está documentado',
        'La base de datos es la capa fundamental sobre la que se construye todo',
        'Debe haber exactamente cuatro capas',
      ],
      correcta: 0,
      porQue: 'Esa flecha invertida —infraestructura dependiendo del dominio— es lo que permite cambiar de proveedor sin tocar reglas y probar el dominio sin levantar nada.',
      porQueNo: {
        1: 'Si cualquiera puede llamar a cualquiera, no hay capas: hay carpetas.',
        2: 'Es justo lo contrario: la base es un detalle, no el punto de partida.',
        3: 'El número depende del proyecto; tres cubren la mayoría.',
      },
    },
    {
      p: '¿Cómo se hace cumplir la regla de dependencia en la práctica?',
      opciones: [
        'Con no-restricted-imports de ESLint sobre la carpeta del dominio',
        'Con revisiones de código cuidadosas',
        'Con un documento de arquitectura',
        'Nombrando bien las carpetas',
      ],
      correcta: 0,
      porQue: 'La disciplina dura hasta el primer viernes con apuro: alguien importa la base "por ahora", nadie lo nota, y a los seis meses hay treinta. Diez líneas de configuración valen más que cualquier documento.',
      porQueNo: {
        1: 'Ayuda, pero depende de que alguien lo note en cada revisión.',
        2: 'Nadie lo lee cuando hay apuro.',
        3: 'Las carpetas sin verificación son decorativas.',
      },
    },
    {
      p: '¿Qué significa que el dominio no importe nada externo?',
      opciones: [
        'Ninguna librería: si necesita la fecha o un identificador, los recibe',
        'Que no use librerías de UI',
        'Que use solo librerías con licencia libre',
        'Que no tenga dependencias circulares',
      ],
      correcta: 0,
      porQue: 'Esa restricción es lo que hace que las reglas sean verificables en un test de tres líneas, sin levantar nada y de forma determinista.',
      porQueNo: {
        1: 'También excluye el cliente de base, los SDK de pago y todo lo demás.',
        2: 'La licencia no tiene relación con la regla de dependencia.',
        3: 'Es otro problema distinto.',
      },
    },
    {
      p: '¿Cuántas capas conviene en un producto con reglas propias pero no críticas?',
      opciones: [
        'Tres: UI, aplicación y dominio juntos, e infraestructura',
        'Cuatro, siempre separando dominio de aplicación',
        'Dos: UI y base de datos',
        'Una por cada funcionalidad',
      ],
      correcta: 0,
      porQue: 'La separación entre "regla pura" y "caso de uso" recién rinde cuando las reglas son ricas de verdad. En un producto normal produce archivos de tres líneas que solo reenvían.',
      porQueNo: {
        1: 'Agrega indirección sin beneficio en la mayoría de los productos.',
        2: 'Deja las reglas de negocio mezcladas con la UI o con las consultas.',
        3: 'Las capas y las funcionalidades son ejes distintos de organización.',
      },
    },
    {
      p: 'En arquitectura hexagonal, ¿quién define los puertos?',
      opciones: [
        'La aplicación: los enchufes los define la caja, no el mundo',
        'Cada proveedor externo',
        'La capa de presentación',
        'Un archivo de configuración compartido',
      ],
      correcta: 0,
      porQue: 'Por eso la aplicación no se ata a ningún proveedor: la interfaz tiene exactamente lo que el núcleo necesita, y el adaptador se encarga de cumplirla.',
      porQueNo: {
        1: 'Ahí el proveedor expone su modelo completo y el núcleo se ata a él.',
        2: 'La presentación es un adaptador más, no quien define contratos.',
        3: 'La configuración conecta implementaciones, no define contratos.',
      },
    },
    {
      p: '¿Cuál es la diferencia práctica entre hexagonal y capas?',
      opciones: [
        'Que la base de datos deja de estar "abajo" y pasa a ser un detalle, igual que la pantalla',
        'Que hexagonal usa seis capas',
        'Que hexagonal no permite bases de datos relacionales',
        'Que en hexagonal no hay interfaces',
      ],
      correcta: 0,
      porQue: 'Y otra consecuencia útil: los tests son un adaptador más, no un caso especial que requiere trucos. Entran por el mismo puerto que la web.',
      porQueNo: {
        1: 'El hexágono se dibujó así para no sugerir arriba y abajo; el número no significa nada.',
        2: 'La tecnología de persistencia es indiferente al patrón.',
        3: 'Los puertos son justamente interfaces.',
      },
    },
    {
      p: '¿Qué debe hacer un adaptador de entrada y qué no?',
      opciones: [
        'Traducir su forma de entrada y obtener la identidad; nunca lógica de negocio',
        'Validar reglas de negocio propias de su canal',
        'Decidir qué datos persistir',
        'Definir los puertos de salida',
      ],
      correcta: 0,
      porQue: 'Si el adaptador web decide algo del dominio, esa lógica va a faltar en el endpoint de API y en el cron. El síntoma llega después: "por la API se puede hacer algo que por la web no".',
      porQueNo: {
        1: 'Eso produce comportamientos distintos según por dónde se entre.',
        2: 'Es responsabilidad del caso de uso.',
        3: 'Los puertos de salida los define la aplicación.',
      },
    },
    {
      p: '¿Cuándo NO vale la pena la arquitectura hexagonal?',
      opciones: [
        'En un CRUD con una sola UI y una sola base, sin reglas propias que proteger',
        'Cuando el equipo es grande',
        'Cuando hay integraciones externas',
        'Cuando se usa TypeScript',
      ],
      correcta: 0,
      porQue: 'La ceremonia cuesta más que el problema que resuelve. Ahí alcanza con no meter consultas dentro de los componentes. Se paga con reglas reales y más de un adaptador por lado.',
      porQueNo: {
        1: 'Con equipos grandes los límites explícitos ayudan más, no menos.',
        2: 'Las integraciones externas son justamente uno de los motivos para adoptarla.',
        3: 'El lenguaje no tiene relación con la decisión.',
      },
    },
    {
      p: 'De Clean Architecture, ¿qué conviene dejar?',
      opciones: [
        'Un tipo distinto por cada frontera con los mismos campos y funciones de conversión entre todos',
        'La regla de dependencia',
        'El dominio sin imports externos',
        'La traducción entre fila de base y entidad',
      ],
      correcta: 0,
      porQue: 'En un sistema con reglas complejas esa separación se paga; en una aplicación normal produce archivos que solo copian campos, y agregar uno obliga a tocarlos todos.',
      porQueNo: {
        1: 'Es la única idea imprescindible del enfoque.',
        2: 'Es lo que hace las reglas verificables sin infraestructura.',
        3: 'Permite renombrar una columna sin tocar reglas: sí se justifica.',
      },
    },
    {
      p: '¿Qué frontera tiene consecuencias de seguridad si no separás el tipo?',
      opciones: [
        'Entidad → respuesta de API: un campo nuevo en la tabla se publica solo',
        'Entidad → componente de UI',
        'Caso de uso → dominio',
        'Puerto → adaptador',
      ],
      correcta: 0,
      porQue: 'Si devolvés la entidad tal cual, el día que alguien agregue margenDeGanancia o notasInternas, ese campo se publica sin que nadie lo decida. Un tipo de salida explícito lo convierte en un cambio deliberado.',
      porQueNo: {
        1: 'La UI corre del lado del usuario que ya tiene permiso para ver esos datos.',
        2: 'Es una frontera interna, sin exposición externa.',
        3: 'También es interna: no publica nada.',
      },
    },
    {
      p: '¿Por qué validar la entrada con safeParse en vez de castear con "as"?',
      opciones: [
        'Porque "as" le miente al compilador sobre datos que vienen de la red',
        'Porque "as" es más lento',
        'Porque zod genera mejores mensajes de error',
        'Porque "as" no funciona con JSON',
      ],
      correcta: 0,
      porQue: 'El safeParse marca la frontera real del sistema: adentro los tipos son confiables, afuera no. Es lo que hace que la verificación de tipos sirva en el borde y no solo en el interior.',
      porQueNo: {
        1: 'Ambos desaparecen o son irrelevantes en rendimiento.',
        2: 'Es cierto pero secundario frente a la garantía de tipo.',
        3: 'Funciona sintácticamente: el problema es que no verifica nada.',
      },
    },
    {
      p: '¿Cómo sabés que te pasaste de ceremonia arquitectónica?',
      opciones: [
        'Cuando agregar un campo trivial obliga a tocar ocho archivos',
        'Cuando hay más de tres carpetas',
        'Cuando los tests tardan más de un minuto',
        'Cuando alguien pregunta por la estructura',
      ],
      correcta: 0,
      porQue: 'Tres o cuatro archivos por campo nuevo es razonable. Con ocho, la arquitectura cobra un peaje que no devuelve nada — y el equipo empieza a evitar los cambios chicos.',
      porQueNo: {
        1: 'La cantidad de carpetas no dice nada por sí sola.',
        2: 'Es un problema de tests, no de estructura.',
        3: 'Preguntar es normal en cualquier estructura.',
      },
    },
    {
      p: '¿Por qué toda mutación debe pasar por una Server Action?',
      opciones: [
        'Porque una mutación desde el cliente depende únicamente de RLS y no hay dónde poner las reglas de negocio',
        'Porque es más rápido',
        'Porque las Server Actions se cachean mejor',
        'Porque lo exige TypeScript',
      ],
      correcta: 0,
      porQue: '"Este cliente no puede comprar porque tiene deuda" no es una política de base. Desde el cliente solo son válidos auth y las suscripciones en tiempo real.',
      porQueNo: {
        1: 'La latencia es similar o mayor: el motivo es de seguridad.',
        2: 'Las mutaciones no se cachean.',
        3: 'TypeScript no impone nada de esto.',
      },
    },
    {
      p: '¿Cuál es el orden correcto dentro de una Server Action?',
      opciones: [
        'Sesión y tenant, validar la forma, reglas de negocio, escribir',
        'Validar la forma, sesión, escribir, reglas de negocio',
        'Escribir y validar después dentro de una transacción',
        'Reglas de negocio, sesión, validar, escribir',
      ],
      correcta: 0,
      porQue: 'Validar antes de autenticar desperdicia trabajo y puede filtrar información sobre qué datos existen a través de los mensajes de error.',
      porQueNo: {
        1: 'Valida antes de saber quién pide, con el riesgo de filtrar información.',
        2: 'Escribir antes de validar es exactamente lo que no hay que hacer.',
        3: 'Aplica reglas sobre datos cuya forma todavía no se verificó.',
      },
    },
    {
      p: '¿Qué error es más fácil de cometer con componentes de servidor?',
      opciones: [
        'N+1: un await dentro de un componente de fila hace una consulta por fila',
        'Fugas de memoria en el cliente',
        'Exceso de JavaScript enviado al navegador',
        'Condiciones de carrera en el estado local',
      ],
      correcta: 0,
      porQue: 'Se siente natural —es solo un componente que necesita un dato— y no se ve como una consulta. Medir la cantidad de consultas por petición en desarrollo es la forma más directa de detectarlo.',
      porQueNo: {
        1: 'Los componentes de servidor no mantienen estado en el cliente.',
        2: 'Es justamente lo que reducen, al no enviar su código al navegador.',
        3: 'No tienen estado local ni ciclo de vida en el cliente.',
      },
    },
  ],
});
