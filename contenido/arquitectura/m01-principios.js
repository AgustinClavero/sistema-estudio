/* ==========================================================================
   Arquitectura · Módulo 01 — Principios: SOLID y compañía
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'arquitectura',
  id: 'm01',
  titulo: 'Principios: SOLID y compañía',
  fuentes: ['fowler', 'refactoring-guru'],

  intro:
    '<p>SOLID se enseña casi siempre con animales que ladran y formas que calculan su área, y por eso mucha gente ' +
    'lo recita sin poder aplicarlo. Acá van los cinco explicados con el código que escribís todos los días.</p>' +
    '<p>Y una advertencia que vale para todo el módulo: <b>son principios, no reglas</b>. Aplicados sin criterio ' +
    'producen sistemas con veinte interfaces que nadie entiende. Lo valioso no es cumplirlos: es reconocer ' +
    '<b>el síntoma que cada uno describe</b>.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Responsabilidad única y abierto/cerrado',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un módulo debería tener <b>una sola razón para
cambiar</b>, y agregar comportamiento nuevo no debería obligarte a editar el código que ya funciona.</div>

<h4>Responsabilidad única (SRP)</h4>
<p>La formulación popular —"una clase, una cosa"— es demasiado vaga: nadie se pone de acuerdo en qué es "una
cosa". La formulación útil es otra:</p>
<pre><code>Un módulo debe tener una sola razón para cambiar.</code></pre>
<p>Y esa razón se identifica preguntando <b>quién pide el cambio</b>:</p>

<pre><code>function GenerarFactura(pedido) {
  const total = calcularTotal(pedido);       ← lo cambia CONTADURÍA
  const html  = armarPlantilla(pedido);      ← lo cambia MARKETING
  const pdf   = convertirAPdf(html);         ← lo cambia SISTEMAS
  await guardarEnStorage(pdf);               ← lo cambia SISTEMAS
  await enviarPorEmail(pdf);                 ← lo cambia MARKETING
}</code></pre>

<div class="aviso"><strong>Tres áreas distintas piden cambios sobre el mismo archivo.</strong> Eso significa
que un cambio de diseño del email puede romper el cálculo de impuestos, y que dos personas que trabajan en
cosas sin relación se pisan en el mismo lugar. <b>La señal no es "hace muchas cosas": es "distintas personas
lo cambian por distintos motivos".</b></div>

<h4>Abierto/cerrado (OCP)</h4>
<p>Se enuncia raro —"abierto a extensión, cerrado a modificación"— y en la práctica significa algo simple:
<b>agregar un caso nuevo no debería obligarte a editar el código existente</b>.</p>

<pre><code>// ❌ Cada medio de pago nuevo obliga a tocar esta función
function cobrar(metodo, monto) {
  if (metodo === 'tarjeta')      { … }
  else if (metodo === 'transferencia') { … }
  else if (metodo === 'mercadopago')   { … }
  // ← y acá va el próximo, y el próximo
}

// ✔ Un caso nuevo es un archivo nuevo. Esta función no se toca.
const medios = { tarjeta, transferencia, mercadopago };
function cobrar(metodo, monto) {
  return medios[metodo].cobrar(monto);
}</code></pre>

<div class="dato"><strong>Y la advertencia que evita el abuso:</strong> esto vale la pena cuando <b>ya
apareció el tercer caso</b>. Con dos, el <code>if</code> es más claro y más corto. Aplicarlo desde el primer
caso es construir un mecanismo de extensión para algo que quizás nunca se extienda.</div>
`,

      tecnico: `
<h4>Cómo aplicar SRP sin fragmentar de más</h4>
<p>El principio no dice "archivos chicos". Dice <b>una razón para cambiar</b>. Aplicado al ejemplo:</p>
<pre><code>facturacion/
  calculo.ts        ← cambia por reglas fiscales      (contaduría)
  plantilla.tsx     ← cambia por diseño               (marketing)
  generarPdf.ts     ← cambia por librería o formato   (sistemas)
  enviar.ts         ← cambia por proveedor de correo  (sistemas)
  index.ts          ← orquesta; cambia si cambia el flujo</code></pre>

<div class="dato"><strong>El archivo que orquesta es necesario y suele olvidarse.</strong> Si separás en cuatro
piezas pero cada consumidor tiene que llamarlas en orden, moviste el problema en vez de resolverlo: ahora el
conocimiento del flujo está repartido en cada lugar que factura. <b>Separar responsabilidades incluye tener un
lugar cuya responsabilidad es el orden.</b></div>

<h4>El límite de SRP</h4>
<table>
<tr><th>Señal de que falta separar</th><th>Señal de que separaste de más</th></tr>
<tr><td>Distintas áreas piden cambios en el mismo archivo</td><td>Un cambio típico obliga a abrir seis archivos</td></tr>
<tr><td>Los conflictos de merge son constantes</td><td>Hay archivos con una función de tres líneas</td></tr>
<tr><td>Un cambio de UI rompe una regla de negocio</td><td>Para entender un flujo hay que saltar entre carpetas</td></tr>
<tr><td>El archivo pasó las 400-500 líneas</td><td>Los nombres son <code>ManagerHelperService</code></td></tr>
</table>

<h4>Las tres formas de cumplir OCP</h4>
<pre><code>// 1 · Mapa de estrategias — la más simple y la que más se usa
const medios: Record&lt;string, MedioDePago&gt; = { tarjeta, transferencia };

// 2 · Inyección: quien llama trae la implementación
function cobrar(medio: MedioDePago, monto: number) {
  return medio.cobrar(monto);
}

// 3 · Registro: cada módulo se anota solo al cargarse
registrarMedio('mercadopago', implementacionMP);</code></pre>

<div class="dato"><strong>La tercera es la más flexible y la más peligrosa.</strong> Con un registro,
<b>no hay ningún lugar donde ver la lista completa</b> de lo que existe: hay que buscar quién llamó a
<code>registrar</code>. Es excelente para plugins de terceros y confuso para código propio, donde un mapa
explícito es más fácil de leer.</div>

<h4>Cuándo NO aplicar OCP</h4>
<p>Cuando el conjunto de casos es <b>cerrado y estable</b>. Los días de la semana son siete y no van a cambiar;
los estados de un pedido, quizás cinco. Ahí un <code>switch</code> exhaustivo es <b>mejor</b> que un mapa,
porque el compilador puede avisarte si agregás un estado y olvidás manejarlo.</p>
<pre><code>// Con un tipo union, TypeScript exige cubrir todos los casos
type Estado = 'pendiente' | 'pagado' | 'enviado' | 'cancelado';

function etiqueta(e: Estado): string {
  switch (e) {
    case 'pendiente': return 'Pendiente';
    case 'pagado':    return 'Pagado';
    case 'enviado':   return 'Enviado';
    case 'cancelado': return 'Cancelado';
  }
  // Si agregás un estado y no lo manejás acá, no compila. Eso es bueno.
}</code></pre>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="p1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    SRP — la señal no es “hace muchas cosas”, es “distintas personas lo cambian”</text>

  <rect x="24" y="34" width="290" height="124" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="169" y="56" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">GenerarFactura.ts</text>
  <text x="44" y="78" fill="currentColor" opacity=".72" font-size="10">calcularTotal()</text>
  <text x="230" y="78" fill="#fbbf24" font-size="9.5" font-weight="700">contaduría</text>
  <text x="44" y="96" fill="currentColor" opacity=".72" font-size="10">armarPlantilla()</text>
  <text x="230" y="96" fill="#22d3ee" font-size="9.5" font-weight="700">marketing</text>
  <text x="44" y="114" fill="currentColor" opacity=".72" font-size="10">convertirAPdf()</text>
  <text x="230" y="114" fill="#34d399" font-size="9.5" font-weight="700">sistemas</text>
  <text x="44" y="132" fill="currentColor" opacity=".72" font-size="10">enviarPorEmail()</text>
  <text x="230" y="132" fill="#22d3ee" font-size="9.5" font-weight="700">marketing</text>
  <text x="169" y="150" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">3 áreas piden cambios en el mismo archivo</text>

  <line x1="320" y1="96" x2="344" y2="96" stroke="currentColor" stroke-width="1.4" marker-end="url(#p1)"/>

  <rect x="352" y="34" width="304" height="124" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="56" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">facturacion/</text>
  <text x="372" y="78" fill="#fbbf24" font-size="10">calculo.ts</text>
  <text x="500" y="78" fill="currentColor" opacity=".55" font-size="9">reglas fiscales</text>
  <text x="372" y="96" fill="#22d3ee" font-size="10">plantilla.tsx</text>
  <text x="500" y="96" fill="currentColor" opacity=".55" font-size="9">diseño</text>
  <text x="372" y="114" fill="#34d399" font-size="10">generarPdf.ts · enviar.ts</text>
  <text x="500" y="114" fill="currentColor" opacity=".55" font-size="9">sistemas</text>
  <rect x="372" y="122" width="264" height="26" rx="6" fill="#7c5cff" fill-opacity=".2"/>
  <text x="504" y="139" text-anchor="middle" fill="#7c5cff" font-size="10" font-weight="700">index.ts ← alguien tiene que ser dueño del ORDEN</text>

  <line x1="24" y1="178" x2="656" y2="178" stroke="currentColor" opacity=".18"/>

  <text x="24" y="202" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    ABIERTO/CERRADO — agregar un caso no debería obligar a editar lo que funciona</text>

  <rect x="24" y="214" width="304" height="94" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="236" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">✗ cadena de if</text>
  <text x="44" y="258" fill="currentColor" opacity=".72" font-size="10" font-family="monospace">if (metodo === 'tarjeta') …</text>
  <text x="44" y="274" fill="currentColor" opacity=".72" font-size="10" font-family="monospace">else if (metodo === 'transferencia') …</text>
  <text x="44" y="290" fill="#f87171" font-size="10" font-weight="700">cada medio nuevo toca código que ya andaba</text>

  <rect x="352" y="214" width="304" height="94" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="236" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">✓ mapa de estrategias</text>
  <text x="372" y="258" fill="currentColor" opacity=".72" font-size="10" font-family="monospace">medios[metodo].cobrar(monto)</text>
  <text x="372" y="278" fill="#34d399" font-size="10" font-weight="700">un caso nuevo = un archivo nuevo</text>
  <text x="372" y="294" fill="#34d399" font-size="10" font-weight="700">esta función no se toca nunca más</text>

  <rect x="24" y="322" width="632" height="64" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="44" y="344" fill="#fbbf24" font-size="12" font-weight="700">LAS DOS ADVERTENCIAS QUE EVITAN EL ABUSO</text>
  <text x="44" y="364" fill="currentColor" opacity=".75" font-size="11">
    · OCP vale la pena cuando <tspan font-weight="700">ya apareció el tercer caso</tspan>. Con dos, el if es más corto y más claro.</text>
  <text x="44" y="380" fill="currentColor" opacity=".75" font-size="11">
    · Si el conjunto es <tspan font-weight="700">cerrado y estable</tspan> (estados de un pedido), un switch exhaustivo es MEJOR: el compilador te avisa.</text>
</svg>`,
        pie: 'Una razón para cambiar. Y extensión sin edición, pero recién cuando el tercer caso aparece.',
      },

      entrevista: [
        { p: '¿Cómo explicás el principio de responsabilidad única de forma aplicable?',
          r: 'No como "una clase, una cosa" —que es demasiado vago— sino como <b>una sola razón para cambiar</b>. Y la razón se identifica preguntando ' +
             '<b>quién pide el cambio</b>: si contaduría cambia el cálculo, marketing cambia la plantilla del email y sistemas cambia el generador de ' +
             'PDF, y las tres cosas están en el mismo archivo, ese archivo tiene tres razones para cambiar. ' +
             'La señal no es "hace muchas cosas": es <b>distintas personas lo cambian por distintos motivos</b>.' },

        { p: '¿Cómo sabés si separaste de más?',
          r: 'Por síntomas simétricos a los de separar de menos. Si un cambio típico te obliga a <b>abrir seis archivos</b>, si hay archivos con una ' +
             'función de tres líneas, o si para entender un flujo hay que saltar entre carpetas, te pasaste. ' +
             'Y hay un olvido frecuente: al separar en piezas hace falta <b>alguien dueño del orden</b>. Si cada consumidor tiene que llamar las cuatro ' +
             'piezas en secuencia, moviste el problema en vez de resolverlo.' },

        { p: '¿Qué significa abierto/cerrado en la práctica?',
          r: 'Que <b>agregar un caso nuevo no debería obligarte a editar código que ya funciona</b>. En vez de una cadena de <code>if</code> que crece ' +
             'con cada medio de pago, un mapa de estrategias donde cada medio es un archivo propio. ' +
             'Pero con una condición importante: <b>vale la pena cuando ya apareció el tercer caso</b>. Con dos, el <code>if</code> es más corto y más ' +
             'claro, y montar un mecanismo de extensión para algo que quizás nunca se extienda es complejidad sin beneficio.' },

        { p: '¿Cuándo NO conviene aplicar abierto/cerrado?',
          r: 'Cuando el conjunto de casos es <b>cerrado y estable</b>: los estados de un pedido, los días de la semana. Ahí un <code>switch</code> ' +
             'exhaustivo sobre un tipo union es <b>mejor</b> que un mapa, porque si agregás un caso y olvidás manejarlo, <b>el compilador te avisa</b> — ' +
             'y con un mapa dinámico eso se convierte en un error en tiempo de ejecución. La extensibilidad tiene sentido donde se espera extender.' },
      ],

      practica: `
<h4>Detectar violaciones de SRP con git</h4>
<pre><code># ¿Qué archivos se tocan en más commits?  → candidatos a hacer demasiado
git log --format=format: --name-only | sort | uniq -c | sort -rn | head -20

# ¿Cuántas personas distintas tocaron este archivo?
git log --format='%an' -- src/facturacion.ts | sort -u | wc -l</code></pre>

<div class="aviso"><strong>El segundo comando es el más revelador.</strong> Un archivo que tocaron seis
personas de áreas distintas casi siempre tiene varias razones para cambiar. Es una señal más objetiva que
"me parece que hace mucho".</div>

<h4>De cadena de if a mapa, paso a paso</h4>
<pre><code>// 1 · Definir el contrato
export interface MedioDePago {
  cobrar(monto: number, datos: DatosCobro): Promise&lt;Resultado&gt;;
  reembolsar(idCobro: string): Promise&lt;Resultado&gt;;
}

// 2 · Una implementación por archivo
// medios/tarjeta.ts
export const tarjeta: MedioDePago = { async cobrar(…) { … }, … };

// 3 · Un registro explícito, en un solo lugar
// medios/index.ts
export const MEDIOS = { tarjeta, transferencia, mercadopago } as const;
export type Medio = keyof typeof MEDIOS;

// 4 · El punto de uso ya no crece
export function cobrar(medio: Medio, monto: number, datos: DatosCobro) {
  return MEDIOS[medio].cobrar(monto, datos);
}</code></pre>

<div class="dato"><strong>El paso 3 con <code>as const</code> más <code>keyof typeof</code> da lo mejor de los
dos mundos:</strong> extensible como un mapa, pero con el tipo <code>Medio</code> derivado automáticamente, así
que pasar un medio inexistente <b>no compila</b>. Se gana extensibilidad sin perder la verificación.</div>

<h4>Cuándo dejar el switch</h4>
<pre><code>type Estado = 'pendiente' | 'pagado' | 'enviado' | 'cancelado';

const SIGUIENTES: Record&lt;Estado, Estado[]&gt; = {
  pendiente: ['pagado', 'cancelado'],
  pagado:    ['enviado', 'cancelado'],
  enviado:   [],
  cancelado: [],
};
// Si agregás un estado al tipo, este Record no compila hasta cubrirlo.</code></pre>

<h4>Checklist de revisión</h4>
<table>
<tr><th>Pregunta</th><th>Si la respuesta es sí…</th></tr>
<tr><td>¿Quiénes piden cambios en este archivo?</td><td>Más de un área → separar</td></tr>
<tr><td>¿Este <code>if</code> creció por tercera vez?</td><td>Convertirlo en mapa</td></tr>
<tr><td>¿El conjunto de casos es cerrado?</td><td>Dejar el <code>switch</code>: el tipo te protege</td></tr>
<tr><td>¿Hay un lugar dueño del orden?</td><td>Si no, agregar el orquestador</td></tr>
<tr><td>¿Un cambio típico abre 6 archivos?</td><td>Separaste de más</td></tr>
</table>
`,

      errores: [
        { mito: 'Responsabilidad única significa archivos chicos.',
          realidad: 'Significa <b>una razón para cambiar</b>. Un archivo de 300 líneas que solo cambia cuando cambian las reglas fiscales cumple; ' +
                    'uno de 60 que cambian tres áreas distintas, no.' },

        { mito: 'Aplico abierto/cerrado desde el primer caso.',
          realidad: 'Con uno o dos casos, el <code>if</code> es más corto y más claro. El mecanismo de extensión se justifica <b>cuando aparece el ' +
                    'tercero</b>: antes es construir infraestructura para algo que quizás nunca se extienda.' },

        { mito: 'Un mapa siempre es mejor que un switch.',
          realidad: 'Si el conjunto es <b>cerrado</b>, el <code>switch</code> sobre un tipo union es mejor: agregar un caso sin manejarlo ' +
                    '<b>no compila</b>. Con un mapa dinámico eso pasa a ser un error en producción.' },

        { mito: 'Separé en cuatro archivos, listo.',
          realidad: 'Si cada consumidor tiene que llamarlos en orden, el conocimiento del flujo quedó <b>repartido</b>. Separar bien incluye tener ' +
                    'un lugar cuya responsabilidad sea el orden.' },
      ],

      glosario: [
        { t: 'SRP', d: 'Responsabilidad única: un módulo, una razón para cambiar.' },
        { t: 'Razón para cambiar', d: 'Quién pide el cambio. Áreas distintas implican responsabilidades distintas.' },
        { t: 'OCP', d: 'Abierto/cerrado: extender sin modificar lo existente.' },
        { t: 'Estrategia', d: 'Patrón donde cada variante implementa una interfaz común.' },
        { t: 'Orquestador', d: 'Módulo cuya responsabilidad es el orden en que se llaman los demás.' },
        { t: 'Conjunto cerrado', d: 'Casos que no van a crecer. Ahí el switch exhaustivo protege más.' },
        { t: 'Registro', d: 'Mecanismo donde cada módulo se anota solo. Flexible, pero sin lista visible.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Sustitución, segregación e inversión',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> las tres restantes de SOLID tratan sobre
<b>promesas</b>: no romper la que hiciste, no obligar a nadie a cumplir promesas que no le sirven, y depender
de promesas en vez de implementaciones.</div>

<h4>Sustitución de Liskov (LSP)</h4>
<p>Si algo dice cumplir un contrato, tiene que <b>poder usarse en lugar de cualquier otra cosa que lo
cumpla</b>, sin sorpresas.</p>
<pre><code>// Todos prometen: "guardo un archivo y devuelvo su URL"
interface Almacen { guardar(archivo: File): Promise&lt;string&gt; }

// ❌ Esta implementación rompe la promesa en silencio
const almacenLocal: Almacen = {
  async guardar(archivo) {
    if (archivo.size &gt; 1_000_000) return '';   // ← devuelve vacío, no falla
    …
  }
};</code></pre>
<p>Quien la usa espera una URL o un error. Recibir una cadena vacía es una <b>tercera opción que nadie
anticipó</b>, y el problema aparece lejos del lugar donde se originó.</p>

<div class="aviso"><strong>La forma más común de romper LSP no es devolver algo raro: es
<b>lanzar un error donde el contrato no lo contemplaba</b>, o hacer nada donde se esperaba una acción.</strong>
Una implementación de "enviar notificación" que en desarrollo no hace nada y no avisa es exactamente eso — y
funciona perfecto hasta que alguien depura durante una hora por qué no llegó el aviso.</div>

<h4>Segregación de interfaces (ISP)</h4>
<p>Mejor <b>varias interfaces chicas</b> que una grande que obliga a implementar cosas que no aplican.</p>
<pre><code>// ❌ Un notificador que obliga a todos a implementar todo
interface Notificador {
  enviarEmail(…); enviarSMS(…); enviarPush(…); enviarWhatsApp(…);
}
// La implementación de email termina con tres métodos que lanzan
// "no soportado". Eso es ISP y LSP rotos al mismo tiempo.

// ✔ Interfaces por capacidad
interface EnviaEmail { enviarEmail(…); }
interface EnviaPush  { enviarPush(…);  }</code></pre>

<h4>Inversión de dependencias (DIP)</h4>
<p>El más importante de los cinco y el que más cambia un sistema: <b>lo que contiene las reglas de negocio no
debería depender de los detalles</b>, sino al revés.</p>
<pre><code>// ❌ La regla de negocio importa el proveedor concreto
import { resend } from '@/lib/resend';
export async function darDeAltaCliente(datos) {
  … await resend.emails.send(…);      // ← atado a Resend para siempre
}

// ✔ La regla depende de un contrato; el proveedor lo cumple
export async function darDeAltaCliente(datos, notificar: Notificador) {
  … await notificar.bienvenida(datos.email);
}</code></pre>
`,

      tecnico: `
<h4>Las tres formas de romper LSP</h4>
<table>
<tr><th>Forma</th><th>Ejemplo</th></tr>
<tr><td><b>Precondición más fuerte</b></td><td>La implementación exige más que el contrato: "solo archivos menores a 1 MB"</td></tr>
<tr><td><b>Postcondición más débil</b></td><td>Promete devolver una URL y devuelve una cadena vacía</td></tr>
<tr><td><b>Excepción nueva</b></td><td>Lanza un error que el contrato no contempla</td></tr>
</table>

<div class="dato"><strong>La forma más silenciosa es "hacer nada y no avisar".</strong> Es técnicamente una
postcondición más débil, pero se disfraza de amabilidad: una implementación de prueba que no envía nada y
devuelve éxito. El sistema funciona, los tests pasan, y el bug aparece en producción como "los emails no
llegan" sin ningún error en ningún log.</div>

<h4>ISP en la práctica: interfaces del lado del consumidor</h4>
<p>La versión más útil del principio no es "hacé interfaces chicas": es <b>que la interfaz la defina quien la
usa, no quien la implementa</b>.</p>
<pre><code>// El módulo de pedidos declara lo que NECESITA
// funcionalidades/pedidos/tipos.ts
export interface NotificadorDePedidos {
  pedidoConfirmado(email: string, pedidoId: string): Promise&lt;void&gt;;
}

// La infraestructura implementa esa interfaz, no al revés
// infraestructura/notificaciones.ts
export const notificador: NotificadorDePedidos = { … };</code></pre>

<div class="dato"><strong>Esa inversión de quién define la interfaz es el corazón de DIP.</strong> Cuando el
consumidor la define, la interfaz tiene <b>exactamente</b> lo que hace falta —ni un método de más— y el módulo
de negocio no tiene que conocer nada del proveedor. Cuando la define el proveedor, termina exponiendo su modelo
completo y el negocio se ata a él.</div>

<h4>DIP sin framework de inyección</h4>
<p>En JavaScript no hace falta un contenedor: alcanza con pasar las dependencias.</p>
<pre><code>// El servicio recibe lo que necesita
export function crearServicioPedidos(deps: {
  repo: RepositorioPedidos;
  notificar: NotificadorDePedidos;
  reloj: () =&gt; Date;
}) {
  return {
    async confirmar(id: string) {
      const pedido = await deps.repo.buscar(id);
      await deps.repo.guardar({ ...pedido, confirmadoEn: deps.reloj() });
      await deps.notificar.pedidoConfirmado(pedido.email, id);
    },
  };
}

// En producción
const servicio = crearServicioPedidos({ repo: repoSupabase, notificar, reloj: () =&gt; new Date() });

// En un test: sin base, sin correo, sin esperar
const servicio = crearServicioPedidos({
  repo: repoEnMemoria, notificar: espia, reloj: () =&gt; new Date('2026-01-01'),
});</code></pre>

<div class="dato"><strong>Fijate en <code>reloj</code>.</strong> El tiempo es una dependencia como cualquier
otra, y no inyectarlo es la causa más común de tests que fallan solos: los que dependen de <code>new
Date()</code> se rompen a fin de mes, en años bisiestos o cuando cambia el horario. Inyectar el reloj los
vuelve deterministas.</div>

<h4>Cuándo NO invertir</h4>
<p>DIP tiene un costo: una capa más de indirección. No lo apliques cuando:</p>
<ul>
<li>La dependencia es <b>estable y ubicua</b>: funciones del lenguaje, <code>JSON</code>, <code>Math</code>.</li>
<li>Solo hay <b>una</b> implementación posible y no necesitás sustituirla en tests.</li>
<li>La abstracción tendría <b>un solo implementador para siempre</b> — eso es una interfaz decorativa.</li>
</ul>
<p>La prueba honesta: <b>¿podés nombrar la segunda implementación?</b> Si la respuesta es "un doble de prueba",
alcanza. Si es "ninguna, por si acaso", no lo hagas.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="p2" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LSP — las tres formas de romper una promesa</text>

  <rect x="24" y="34" width="200" height="60" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="124" y="54" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">exige MÁS</text>
  <text x="124" y="74" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">“solo archivos &lt; 1 MB”</text>
  <text x="124" y="88" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">precondición más fuerte</text>

  <rect x="240" y="34" width="200" height="60" rx="9" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.6"/>
  <text x="340" y="54" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">entrega MENOS</text>
  <text x="340" y="74" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">“no hace nada y no avisa”</text>
  <text x="340" y="88" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">la más silenciosa de todas</text>

  <rect x="456" y="34" width="200" height="60" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="556" y="54" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">lanza algo NUEVO</text>
  <text x="556" y="74" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">error no contemplado</text>
  <text x="556" y="88" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">rompe lejos del origen</text>

  <line x1="24" y1="112" x2="656" y2="112" stroke="currentColor" opacity=".18"/>

  <text x="24" y="136" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    DIP — la clave es QUIÉN DEFINE LA INTERFAZ</text>

  <rect x="24" y="148" width="304" height="110" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="170" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">✗ la define el proveedor</text>

  <rect x="44" y="182" width="264" height="26" rx="6" fill="#22d3ee" fill-opacity=".2"/>
  <text x="176" y="199" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">reglas de negocio</text>
  <line x1="176" y1="212" x2="176" y2="224" stroke="#f87171" stroke-width="2" marker-end="url(#p2)" color="#f87171"/>
  <rect x="44" y="226" width="264" height="24" rx="6" fill="#f87171" fill-opacity=".22"/>
  <text x="176" y="242" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">Resend / Supabase / Stripe</text>

  <rect x="352" y="148" width="304" height="110" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="504" y="170" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">✓ la define el CONSUMIDOR</text>

  <rect x="372" y="182" width="264" height="26" rx="6" fill="#22d3ee" fill-opacity=".2"/>
  <text x="504" y="199" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">reglas de negocio + su interfaz</text>
  <line x1="504" y1="224" x2="504" y2="212" stroke="#34d399" stroke-width="2" marker-end="url(#p2)" color="#34d399"/>
  <rect x="372" y="226" width="264" height="24" rx="6" fill="#34d399" fill-opacity=".22"/>
  <text x="504" y="242" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">el proveedor IMPLEMENTA esa interfaz</text>

  <text x="352" y="274" fill="#34d399" font-size="10.5" font-weight="700">
    la interfaz tiene exactamente lo que hace falta, ni un método de más</text>

  <rect x="24" y="290" width="304" height="96" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="176" y="312" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">EL RELOJ TAMBIÉN ES UNA DEPENDENCIA</text>
  <text x="44" y="334" fill="currentColor" opacity=".72" font-size="10.5">no inyectarlo = tests que fallan solos</text>
  <text x="44" y="352" fill="currentColor" opacity=".65" font-size="10">a fin de mes · en años bisiestos</text>
  <text x="44" y="370" fill="#7c5cff" font-size="10.5" font-weight="700">reloj: () =&gt; new Date()  ← inyectalo</text>

  <rect x="352" y="290" width="304" height="96" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="504" y="312" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">LA PRUEBA HONESTA ANTES DE INVERTIR</text>
  <text x="372" y="336" fill="#fbbf24" font-size="11.5" font-weight="700">“¿podés nombrar la 2ª implementación?”</text>
  <text x="372" y="358" fill="#34d399" font-size="10.5">“un doble de prueba” → alcanza, hacelo</text>
  <text x="372" y="376" fill="#f87171" font-size="10.5" font-weight="700">“ninguna, por las dudas” → no lo hagas</text>
</svg>`,
        pie: 'Cuando la interfaz la define quien la usa, tiene exactamente lo necesario y nada más.',
      },

      entrevista: [
        { p: '¿Qué dice el principio de sustitución de Liskov y cómo se rompe?',
          r: 'Que si algo dice cumplir un contrato, tiene que <b>poder usarse en lugar de cualquier otra implementación</b> sin sorpresas. Se rompe de ' +
             'tres formas: <b>exigiendo más</b> que el contrato —"solo archivos menores a 1 MB"—, <b>entregando menos</b> —prometer una URL y devolver ' +
             'una cadena vacía— o <b>lanzando un error</b> que el contrato no contemplaba. ' +
             'La más silenciosa es "hacer nada y no avisar": una implementación de prueba que devuelve éxito sin enviar nada. ' +
             'El sistema funciona, los tests pasan, y el bug aparece en producción sin ningún error en ningún log.' },

        { p: '¿Cuál es la versión útil de segregación de interfaces?',
          r: 'No "hacé interfaces chicas", sino <b>que la interfaz la defina quien la usa, no quien la implementa</b>. Si el módulo de pedidos declara ' +
             '<code>NotificadorDePedidos</code> con el único método que necesita, esa interfaz tiene <b>exactamente</b> lo que hace falta. ' +
             'Si la define el proveedor de correo, termina exponiendo su modelo completo y el negocio se ata a él — y las implementaciones parciales ' +
             'quedan con métodos que lanzan "no soportado", que es romper segregación e Liskov a la vez.' },

        { p: '¿Qué es inversión de dependencias y por qué es la más importante?',
          r: 'Que <b>lo que contiene las reglas de negocio no dependa de los detalles</b>, sino al revés: el negocio define el contrato y la ' +
             'infraestructura lo implementa. Es la más importante porque es la que permite cambiar de proveedor, probar sin base de datos ni red, ' +
             'y mantener las reglas legibles sin ruido técnico. En JavaScript no hace falta ningún contenedor de inyección: ' +
             'alcanza con que la función reciba sus dependencias como parámetro.' },

        { p: '¿Cuándo NO conviene invertir una dependencia?',
          r: 'Cuando la dependencia es <b>estable y ubicua</b> —funciones del lenguaje, <code>JSON</code>, <code>Math</code>—, cuando hay una sola ' +
             'implementación posible, o cuando la abstracción tendría <b>un solo implementador para siempre</b>: eso es una interfaz decorativa que ' +
             'solo agrega una capa de indirección. La prueba honesta es preguntarse <b>"¿puedo nombrar la segunda implementación?"</b>. ' +
             'Si la respuesta es "un doble de prueba", alcanza para justificarla; si es "ninguna, por si acaso", no.' },
      ],

      practica: `
<h4>Inyección de dependencias sin framework</h4>
<pre><code>// funcionalidades/pedidos/servicio.ts — define lo que NECESITA
export interface RepositorioPedidos {
  buscar(id: string): Promise&lt;Pedido | null&gt;;
  guardar(p: Pedido): Promise&lt;void&gt;;
}
export interface NotificadorDePedidos {
  pedidoConfirmado(email: string, pedidoId: string): Promise&lt;void&gt;;
}

export function crearServicioPedidos(deps: {
  repo: RepositorioPedidos;
  notificar: NotificadorDePedidos;
  reloj: () =&gt; Date;
}) {
  return {
    async confirmar(id: string) {
      const pedido = await deps.repo.buscar(id);
      if (!pedido) throw new Error('Pedido inexistente');
      if (pedido.estado !== 'pendiente') throw new Error('Estado inválido');

      await deps.repo.guardar({ ...pedido, estado: 'pagado', confirmadoEn: deps.reloj() });
      await deps.notificar.pedidoConfirmado(pedido.email, id);
    },
  };
}</code></pre>

<h4>El test que esto habilita</h4>
<pre><code>test('confirmar marca el pedido y notifica', async () =&gt; {
  const guardados: Pedido[] = [];
  const avisos: string[] = [];

  const servicio = crearServicioPedidos({
    repo: {
      buscar: async () =&gt; ({ id: '1', estado: 'pendiente', email: 'a@b.com' }),
      guardar: async (p) =&gt; { guardados.push(p); },
    },
    notificar: { pedidoConfirmado: async (email) =&gt; { avisos.push(email); } },
    reloj: () =&gt; new Date('2026-01-01T00:00:00Z'),
  });

  await servicio.confirmar('1');

  expect(guardados[0].estado).toBe('pagado');
  expect(guardados[0].confirmadoEn).toEqual(new Date('2026-01-01T00:00:00Z'));
  expect(avisos).toEqual(['a@b.com']);
});</code></pre>

<div class="aviso"><strong>Sin base, sin red, sin esperas, y determinista.</strong> Ese test corre en
milisegundos y no falla nunca por causas ajenas. Es el beneficio más tangible de DIP, y suele convencer más que
cualquier argumento sobre pureza arquitectónica.</div>

<h4>Detectar violaciones de LSP</h4>
<pre><code>// Un mismo conjunto de tests, corrido contra TODAS las implementaciones
function pruebasDeContrato(nombre: string, crear: () =&gt; Almacen) {
  describe(nombre, () =&gt; {
    it('devuelve una URL válida', async () =&gt; {
      const url = await crear().guardar(archivoChico);
      expect(url).toMatch(/^https?:\\/\\//);
    });
    it('falla con error, no en silencio, si el archivo es inválido', async () =&gt; {
      await expect(crear().guardar(archivoRoto)).rejects.toThrow();
    });
  });
}

pruebasDeContrato('local', () =&gt; almacenLocal);
pruebasDeContrato('R2',    () =&gt; almacenR2);</code></pre>
<p>Es la forma más directa de garantizar sustituibilidad: <b>si el contrato es uno, los tests también</b>.</p>

<h4>Checklist</h4>
<table>
<tr><th>Pregunta</th><th>Principio</th></tr>
<tr><td>¿Alguna implementación exige más que el contrato?</td><td>LSP</td></tr>
<tr><td>¿Alguna hace nada y devuelve éxito?</td><td>LSP (la peor)</td></tr>
<tr><td>¿Hay métodos que lanzan "no soportado"?</td><td>ISP</td></tr>
<tr><td>¿La interfaz la definió el consumidor?</td><td>ISP + DIP</td></tr>
<tr><td>¿Puedo testear sin base ni red?</td><td>DIP</td></tr>
<tr><td>¿Puedo nombrar la segunda implementación?</td><td>Si no, no inviertas</td></tr>
</table>
`,

      errores: [
        { mito: 'Una implementación que no hace nada es inofensiva.',
          realidad: 'Es la ruptura de Liskov <b>más silenciosa</b>: devuelve éxito sin cumplir. Los tests pasan, no hay error en ningún log, ' +
                    'y el problema aparece en producción como "los emails no llegan".' },

        { mito: 'Segregación de interfaces significa hacer interfaces chicas.',
          realidad: 'La versión útil es <b>que la defina quien la usa</b>. Así tiene exactamente lo necesario. Cuando la define el proveedor, ' +
                    'expone su modelo entero y las implementaciones parciales terminan con métodos que lanzan "no soportado".' },

        { mito: 'Para inyectar dependencias hace falta un framework.',
          realidad: 'En JavaScript alcanza con <b>pasarlas como parámetro</b>. Un objeto <code>deps</code> con repositorio, notificador y reloj ' +
                    'da todo el beneficio sin ninguna librería.' },

        { mito: 'Abstraigo todo por si acaso.',
          realidad: 'Una interfaz con <b>un solo implementador para siempre</b> es decorativa: agrega indirección sin beneficio. ' +
                    'La prueba honesta es "¿puedo nombrar la segunda implementación?" — si la respuesta es "ninguna", no la hagas.' },
      ],

      glosario: [
        { t: 'LSP', d: 'Sustitución de Liskov: una implementación debe poder reemplazar a otra sin sorpresas.' },
        { t: 'Precondición', d: 'Lo que una función exige de su entrada. Una implementación no puede exigir más.' },
        { t: 'Postcondición', d: 'Lo que garantiza al terminar. Una implementación no puede garantizar menos.' },
        { t: 'ISP', d: 'Segregación de interfaces: mejor varias específicas que una que obliga a todo.' },
        { t: 'DIP', d: 'Inversión de dependencias: el negocio define el contrato, la infraestructura lo cumple.' },
        { t: 'Inyección de dependencias', d: 'Pasar las dependencias desde afuera en vez de importarlas adentro.' },
        { t: 'Test de contrato', d: 'Un mismo conjunto de tests corrido contra todas las implementaciones.' },
        { t: 'Interfaz decorativa', d: 'Abstracción con un solo implementador. Solo agrega indirección.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'DRY, KISS, YAGNI — y cuándo DRY hace daño',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> de los tres, el que más daño hace mal aplicado es
DRY — porque <b>unificar código que se parece pero cambia por motivos distintos</b> crea un acoplamiento que
después cuesta muchísimo deshacer.</div>

<h4>Los tres, rápido</h4>
<p><b>DRY</b> — no repitas. Pero <b>conocimiento</b>, no líneas de texto.</p>
<p><b>KISS</b> — la solución más simple que resuelva el problema, no la más ingeniosa.</p>
<p><b>YAGNI</b> — no construyas para necesidades que todavía no tenés.</p>

<h4>El malentendido central de DRY</h4>
<p>DRY no dice "no repitas código". Dice <b>no repitas conocimiento</b>. Dos bloques idénticos que representan
<b>reglas distintas</b> no son duplicación: son coincidencia.</p>
<pre><code>// Estas dos funciones son IDÉNTICAS hoy
function precioFinalCliente(base) { return base * 1.21; }
function precioFinalProveedor(base) { return base * 1.21; }</code></pre>
<p>Unificarlas parece obvio. Pero la primera es "IVA al consumidor" y la segunda es "IVA en compras", y son
<b>dos reglas de negocio distintas que hoy tienen el mismo número</b>. El día que una cambie, quien tenga la
función unificada va a agregarle un parámetro <code>tipo</code>, después otro, y en dos años esa función va a
tener cinco banderas y nadie va a saber cuál corresponde a qué.</p>

<div class="aviso"><strong>La regla práctica que evita esto:</strong> antes de unificar, preguntá
<b>"¿estos dos van a cambiar siempre juntos?"</b>. Si la respuesta es sí, unificá. Si es "puede que no", <b>dejá
la duplicación</b>. Duplicar es mucho más barato de arreglar que un acoplamiento equivocado.</div>

<h4>KISS: simple no es fácil</h4>
<p>La solución simple suele requerir <b>más</b> pensamiento, no menos. Lo fácil es la primera idea; lo simple es
la que queda después de sacar todo lo que no hacía falta.</p>
<p>Y una versión concreta: <b>tecnología aburrida</b>. Postgres antes que una base exótica, una tabla antes que
un servicio, un cron antes que una arquitectura de eventos — <b>salvo que haya una razón escrita</b>.</p>

<h4>YAGNI: el costo de lo que no se usa</h4>
<p>Construir para una necesidad futura tiene tres costos, y solo el primero es obvio:</p>
<ol>
<li>El tiempo de construirlo.</li>
<li>El tiempo de <b>mantenerlo</b> mientras no se usa.</li>
<li>Que <b>estorba</b>: cuando llegue la necesidad real, va a ser distinta de lo que anticipaste, y ahora hay que deshacer algo además de hacer lo nuevo.</li>
</ol>
`,

      tecnico: `
<h4>La regla de tres</h4>
<p>Una heurística concreta para no unificar antes de tiempo:</p>
<pre><code>1ª vez  → escribilo.
2ª vez  → duplicá. Anotá mentalmente el parecido.
3ª vez  → ahora sí, extraé. Ya viste tres formas del patrón.</code></pre>
<p>Con dos ocurrencias no tenés información suficiente para saber <b>qué</b> es lo común y qué es lo variable.
Con tres, la abstracción que sale es mucho mejor.</p>

<div class="dato"><strong>Y hay un costo asimétrico que justifica la regla:</strong> deshacer una duplicación
es un refactor local y seguro. Deshacer una abstracción equivocada implica <b>desenredar todos los usos</b> que
se acumularon mientras tanto, cada uno con sus banderas y casos especiales. <b>El error de duplicar es barato;
el de abstraer mal, caro.</b></div>

<h4>Señales de una abstracción equivocada</h4>
<table>
<tr><th>Señal</th><th>Qué indica</th></tr>
<tr><td>Parámetros booleanos que cambian el comportamiento</td><td>Se unieron casos distintos</td></tr>
<tr><td>Un parámetro <code>tipo</code> o <code>modo</code></td><td>Igual</td></tr>
<tr><td>Muchos parámetros opcionales</td><td>Cada uno es un caso que no encajaba</td></tr>
<tr><td>El nombre es genérico: <code>procesar</code>, <code>manejar</code></td><td>No hay un concepto real detrás</td></tr>
<tr><td>Los usos pasan <code>null</code> en la mitad de los argumentos</td><td>La firma no describe ningún caso real</td></tr>
</table>

<div class="dato"><strong>Cuando encontrás esto, el mejor refactor suele ser el contraintuitivo:
<b>desabstraer</b>.</strong> Copiar la función a cada punto de uso, borrar de cada copia lo que no aplica, y
recién ahí ver si queda algo genuinamente común. Se llama "inline y volver a extraer", y casi siempre deja el
código más corto que el original.</div>

<h4>Duplicación buena y duplicación mala</h4>
<pre><code>✔ Duplicación aceptable
  · Dos reglas de negocio que hoy coinciden por casualidad
  · Código de tests: la claridad vale más que la reutilización
  · Estructuras de datos de módulos distintos que evolucionan aparte
  · Fragmentos chicos y estables (formatear un precio)

✘ Duplicación que hay que eliminar
  · La misma regla de negocio escrita en dos lugares
  · Validaciones que deben coincidir sí o sí (cliente y servidor)
  · Constantes repetidas (URLs, límites, claves)
  · Lógica de autorización copiada</code></pre>

<div class="dato"><strong>La segunda línea de la lista mala merece un matiz.</strong> La validación de cliente
y servidor no se resuelve copiando ni compartiendo la función a mano: se resuelve con <b>un esquema único</b>
—con zod o similar— que ambos importan. Ahí el conocimiento está en un solo lugar y las dos capas lo usan
para lo suyo.</div>

<h4>YAGNI aplicado, con criterio</h4>
<table>
<tr><th>Tentación</th><th>Qué hacer</th></tr>
<tr><td>"Después vamos a querer multi-idioma"</td><td>No lo construyas, pero <b>no hardcodees</b> textos en el medio de la lógica</td></tr>
<tr><td>"Puede que necesitemos otra base"</td><td>No abstraigas, pero mantené el acceso a datos en un lugar</td></tr>
<tr><td>"Quizás lo hagamos plugin"</td><td>No hagas el sistema de plugins</td></tr>
<tr><td>"Va a escalar"</td><td>No optimices sin medir, pero no metas un N+1 evidente</td></tr>
</table>

<div class="dato"><strong>El matiz de esa tabla es lo que separa YAGNI de la negligencia.</strong> YAGNI dice
"no construyas la funcionalidad"; no dice "tomá decisiones que la vuelvan imposible". No armar el sistema de
traducciones está bien; esparcir textos literales por toda la lógica de negocio es hacerse daño gratis.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <rect x="24" y="28" width="632" height="52" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="340" y="50" text-anchor="middle" fill="#f87171" font-size="13" font-weight="700">
    DRY no dice “no repitas código”. Dice “no repitas CONOCIMIENTO”.</text>
  <text x="340" y="70" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11">
    Dos bloques idénticos que representan reglas distintas no son duplicación: son coincidencia.</text>

  <text x="24" y="108" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL COSTO ES ASIMÉTRICO — y por eso conviene errar hacia duplicar</text>

  <rect x="24" y="120" width="304" height="80" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="176" y="142" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">DUPLICASTE DE MÁS</text>
  <text x="176" y="164" text-anchor="middle" fill="currentColor" opacity=".72" font-size="10.5">el arreglo es un refactor local</text>
  <text x="176" y="184" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">BARATO</text>

  <rect x="352" y="120" width="304" height="80" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="504" y="142" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">ABSTRAJISTE MAL</text>
  <text x="504" y="164" text-anchor="middle" fill="currentColor" opacity=".72" font-size="10.5">hay que desenredar todos los usos</text>
  <text x="504" y="184" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">CARO</text>

  <rect x="24" y="212" width="632" height="30" rx="8" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="232" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">
    Antes de unificar: “¿estos dos van a cambiar SIEMPRE juntos?” Si es “puede que no”, dejá la duplicación.</text>

  <text x="24" y="268" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    SEÑALES DE UNA ABSTRACCIÓN EQUIVOCADA</text>

  <rect x="24" y="280" width="200" height="52" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.2"/>
  <text x="124" y="300" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">parámetros booleanos</text>
  <text x="124" y="318" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">que cambian QUÉ hace</text>

  <rect x="240" y="280" width="200" height="52" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.2"/>
  <text x="340" y="300" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">un parámetro “tipo” o “modo”</text>
  <text x="340" y="318" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">se unieron casos distintos</text>

  <rect x="456" y="280" width="200" height="52" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.2"/>
  <text x="556" y="300" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">nombre genérico</text>
  <text x="556" y="318" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">procesar() · manejar()</text>

  <rect x="24" y="342" width="632" height="44" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="44" y="362" fill="#34d399" font-size="11.5" font-weight="700">EL REFACTOR CONTRAINTUITIVO: DESABSTRAER</text>
  <text x="44" y="379" fill="currentColor" opacity=".75" font-size="11">
    Copiar la función a cada punto de uso · borrar de cada copia lo que no aplica · recién ahí ver qué queda genuinamente común.</text>
</svg>`,
        pie: 'El error de duplicar es barato. El de abstraer mal, caro. Errá hacia el barato.',
      },

      entrevista: [
        { p: '¿Qué dice DRY realmente y cómo se aplica mal?',
          r: 'Dice <b>no repitas conocimiento</b>, no "no repitas código". Dos bloques idénticos que representan <b>reglas de negocio distintas</b> ' +
             'no son duplicación: son coincidencia. Unificar "IVA al consumidor" con "IVA en compras" porque hoy son el mismo número lleva a que el ' +
             'día que una cambie se le agregue un parámetro <code>tipo</code>, después otro, y en dos años esa función tenga cinco banderas. ' +
             'La pregunta antes de unificar es: <b>"¿estos dos van a cambiar siempre juntos?"</b>. Si es "puede que no", dejo la duplicación.' },

        { p: '¿Por qué conviene errar hacia duplicar en vez de hacia abstraer?',
          r: 'Porque el costo es <b>asimétrico</b>. Deshacer una duplicación es un refactor local y seguro: juntás dos funciones. Deshacer una ' +
             'abstracción equivocada implica <b>desenredar todos los usos</b> que se acumularon mientras tanto, cada uno con sus banderas y casos ' +
             'especiales. Por eso uso la <b>regla de tres</b>: primera vez lo escribo, segunda duplico, tercera extraigo. Con dos ocurrencias no tengo ' +
             'información suficiente para saber qué es lo común y qué lo variable.' },

        { p: '¿Cómo reconocés una abstracción equivocada y qué hacés?',
          r: 'Por las banderas: parámetros booleanos que cambian <b>qué</b> hace la función, un parámetro <code>tipo</code> o <code>modo</code>, ' +
             'muchos opcionales, un nombre genérico como <code>procesar</code>, o usos que pasan <code>null</code> en la mitad de los argumentos. ' +
             'Y el mejor refactor es el contraintuitivo: <b>desabstraer</b> — copiar la función a cada punto de uso, borrar de cada copia lo que no ' +
             'aplica, y recién ahí ver si queda algo genuinamente común. Casi siempre termina más corto que el original.' },

        { p: '¿Dónde está el límite entre YAGNI y negligencia?',
          r: 'YAGNI dice <b>no construyas la funcionalidad</b>; no dice "tomá decisiones que la vuelvan imposible". No armar el sistema de traducciones ' +
             'está bien; esparcir textos literales por toda la lógica de negocio es hacerse daño gratis. Lo mismo con la base: no abstraigo el acceso a ' +
             'datos "por si cambio de proveedor", pero sí lo mantengo <b>en un lugar</b>. Y con el rendimiento: no optimizo sin medir, ' +
             'pero no dejo un N+1 evidente. El criterio es no pagar hoy por lo que quizás no pase, sin cerrar puertas gratis.' },
      ],

      practica: `
<h4>Duplicación buena y mala, con ejemplos</h4>
<pre><code>// ✔ ACEPTABLE — coinciden hoy, son reglas distintas
// facturacion/impuestos.ts
export const ivaVenta = (base: number) =&gt; base * 1.21;
// compras/impuestos.ts
export const ivaCompra = (base: number) =&gt; base * 1.21;

// ✘ ELIMINAR — la misma regla en dos lugares
// pedidos/servicio.ts
if (pedido.total &gt; 100000 &amp;&amp; !usuario.esAdmin) throw …
// reportes/exportar.ts
if (pedido.total &gt; 100000 &amp;&amp; !usuario.esAdmin) throw …
//    ↑ el día que cambie el límite, uno de los dos queda viejo</code></pre>

<h4>Un esquema, dos capas</h4>
<pre><code>// compartido/esquemas/cliente.ts — el conocimiento vive UNA vez
import { z } from 'zod';

export const EsquemaCliente = z.object({
  nombre: z.string().min(2).max(120),
  email: z.string().email(),
  cuit: z.string().regex(/^\\d{2}-\\d{8}-\\d$/),
});
export type Cliente = z.infer&lt;typeof EsquemaCliente&gt;;

// El formulario lo usa para validar mientras se escribe.
// La Server Action lo usa para validar de verdad.
// No hay dos versiones que puedan desincronizarse.</code></pre>

<div class="aviso"><strong>Esto no es "compartir código por compartir": es que la regla de qué es un cliente
válido <b>existe una sola vez</b>.</strong> Copiar la validación al cliente para "que sea más rápida" es
exactamente el tipo de duplicación que DRY sí busca eliminar, porque las dos copias tienen que coincidir
siempre.</div>

<h4>Desabstraer: el procedimiento</h4>
<pre><code>1 · Copiar el cuerpo de la función a cada punto de uso (inline).
2 · En cada copia, borrar las ramas que ese caso no ejecuta.
3 · Mirar lo que quedó. Casi siempre es mucho más corto y claro.
4 · Si dos copias siguen siendo idénticas Y cambian por lo mismo,
    recién ahí volvé a extraer — pero solo eso.</code></pre>

<h4>Antes de agregar una abstracción, preguntá</h4>
<table>
<tr><th>Pregunta</th><th>Si la respuesta es…</th></tr>
<tr><td>¿Es la tercera vez?</td><td>No → duplicá y esperá</td></tr>
<tr><td>¿Van a cambiar siempre juntos?</td><td>"Puede que no" → no unifiques</td></tr>
<tr><td>¿Puedo nombrar el concepto común?</td><td>No → no hay concepto, hay parecido</td></tr>
<tr><td>¿La firma necesita una bandera?</td><td>Sí → son dos cosas distintas</td></tr>
<tr><td>¿Alguien más va a entender el nombre?</td><td>No → el nombre está describiendo la implementación</td></tr>
</table>
`,

      errores: [
        { mito: 'Si veo código repetido, lo unifico.',
          realidad: 'Solo si representa <b>el mismo conocimiento</b>. Dos reglas distintas que hoy coinciden por casualidad, unificadas, terminan siendo ' +
                    'una función con cinco banderas que nadie entiende.' },

        { mito: 'Duplicar código siempre es deuda técnica.',
          realidad: 'Es deuda <b>barata y local</b>. Una abstracción equivocada es deuda cara y distribuida, porque hay que desenredar cada uso. ' +
                    'Conviene errar hacia el error barato.' },

        { mito: 'La solución simple es la que se me ocurre primero.',
          realidad: 'Esa es la <b>fácil</b>. La simple es la que queda después de sacar todo lo que no hacía falta, y suele requerir más pensamiento, ' +
                    'no menos.' },

        { mito: 'YAGNI significa no pensar en el futuro.',
          realidad: 'Significa <b>no construir</b> para el futuro. Pensar sí: no hardcodear textos en la lógica, mantener el acceso a datos en un lugar, ' +
                    'no dejar un N+1 evidente. YAGNI no es excusa para cerrar puertas gratis.' },
      ],

      glosario: [
        { t: 'DRY', d: 'No repitas conocimiento. No se refiere a líneas idénticas.' },
        { t: 'KISS', d: 'La solución más simple que resuelva el problema.' },
        { t: 'YAGNI', d: 'No lo vas a necesitar: no construyas para necesidades hipotéticas.' },
        { t: 'Regla de tres', d: 'Duplicar dos veces y extraer a la tercera.' },
        { t: 'Abstracción prematura', d: 'Unificar antes de conocer las variantes reales.' },
        { t: 'Desabstraer', d: 'Volver a poner la función en línea para ver qué era realmente común.' },
        { t: 'Tecnología aburrida', d: 'Preferir lo conocido y estable salvo razón escrita para lo contrario.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Señales de diseño: nombres, tamaño y Demeter',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> no hace falta ser experto para detectar mal
diseño. Hay <b>señales mecánicas</b> —nombres, tamaños, cadenas de puntos— que se ven a simple vista y aciertan
la mayoría de las veces.</div>

<h4>Los nombres, que son diagnóstico</h4>
<table>
<tr><th>Si el nombre es…</th><th>Probablemente…</th></tr>
<tr><td><code>Manager</code>, <code>Helper</code>, <code>Util</code></td><td>No sabés qué hace: no hay un concepto</td></tr>
<tr><td><code>procesar</code>, <code>manejar</code></td><td>Hace varias cosas</td></tr>
<tr><td><code>datos</code>, <code>info</code>, <code>item</code></td><td>No sabés qué representa</td></tr>
<tr><td>Con "Y" adentro: <code>validarYGuardar</code></td><td>Son dos funciones</td></tr>
<tr><td>Muy largo: <code>obtenerPedidosPendientesDelClienteActivoConEnvio</code></td><td>Le faltan parámetros o le sobra responsabilidad</td></tr>
</table>

<div class="aviso"><strong>La regla que más sirve:</strong> si te cuesta nombrar algo, <b>casi siempre es
porque no está bien separado</b>. Un nombre difícil no es un problema de vocabulario: es el diseño avisando que
esa unidad no corresponde a ningún concepto del dominio.</div>

<h4>El tamaño como alarma</h4>
<p>No son reglas, son <b>umbrales para mirar</b>:</p>
<pre><code>Archivo    &gt; 500 líneas   → mirar por qué
Función    &gt; 50 líneas    → mirar por qué
Parámetros &gt; 4            → probablemente falta un objeto
Anidamiento &gt; 3 niveles   → salida temprana o extraer
Componente &gt; 300 líneas   → separar lógica en un hook</code></pre>
<p>Pasarse no es pecado. Pasarse <b>sin poder explicar por qué</b> sí.</p>

<h4>La ley de Demeter: hablá solo con tus vecinos</h4>
<p>Un objeto debería hablar con lo que conoce directamente, no navegar por las tripas de otros.</p>
<pre><code>// ❌ Esta línea conoce la estructura interna de cuatro objetos
const ciudad = pedido.cliente.direccion.ciudad.nombre;

// Si mañana la dirección deja de estar en el cliente, esta línea
// se rompe — y todas las otras cincuenta que hacen lo mismo.

// ✔ Pedile a quien sabe
const ciudad = pedido.ciudadDeEntrega();</code></pre>

<div class="dato"><strong>La excepción importante:</strong> esto aplica a objetos con comportamiento, no a
estructuras de datos planas. Leer <code>respuesta.data.items[0].id</code> de un JSON que acabás de recibir es
perfectamente normal. La ley habla de <b>no depender de la estructura interna de objetos que tienen dueño</b>.</div>
`,

      tecnico: `
<h4>Los olores de código que más aparecen</h4>
<table>
<tr><th>Olor</th><th>Qué indica</th><th>Refactor típico</th></tr>
<tr><td><b>Envidia de funcionalidad</b></td><td>Una función usa más datos de otro módulo que del propio</td><td>Mover la función a ese módulo</td></tr>
<tr><td><b>Obsesión por primitivos</b></td><td>Todo son <code>string</code> y <code>number</code></td><td>Tipos propios: <code>Email</code>, <code>Dinero</code></td></tr>
<tr><td><b>Grupos de datos</b></td><td>Los mismos 4 parámetros viajan juntos siempre</td><td>Convertirlos en un objeto</td></tr>
<tr><td><b>Cambio divergente</b></td><td>Un módulo cambia por muchos motivos</td><td>Separar (es SRP)</td></tr>
<tr><td><b>Cirugía con escopeta</b></td><td>Un cambio obliga a tocar muchos módulos</td><td>Juntar lo que cambia junto</td></tr>
<tr><td><b>Cadena de mensajes</b></td><td><code>a.b().c().d()</code></td><td>Exponer un método que devuelva lo pedido</td></tr>
</table>

<div class="dato"><strong>Los dos del medio son opuestos y suelen confundirse.</strong> <b>Cambio
divergente</b> es "un módulo cambia por muchos motivos" → hay que <b>separarlo</b>. <b>Cirugía con escopeta</b>
es "un motivo obliga a cambiar muchos módulos" → hay que <b>juntarlos</b>. Diagnosticar mal cuál de los dos
tenés lleva a hacer exactamente el refactor contrario al que hacía falta.</div>

<h4>Obsesión por primitivos, en concreto</h4>
<pre><code>// ❌ Nada impide pasar los argumentos al revés
function transferir(desde: string, hacia: string, monto: number) { … }
transferir(cuentaB, cuentaA, 1000);   // compila, y está mal

// ✔ Tipos que no se pueden confundir
type IdCuenta = string &amp; { readonly __marca: 'IdCuenta' };
type Centavos = number &amp; { readonly __marca: 'Centavos' };

function transferir(desde: IdCuenta, hacia: IdCuenta, monto: Centavos) { … }</code></pre>

<div class="dato"><strong>Y el caso del dinero merece su propio párrafo:</strong> representar plata con un
número decimal produce errores de redondeo que aparecen recién cuando alguien concilia una cuenta. ' +
La solución estándar es guardar <b>centavos como entero</b> y formatear solo al mostrar. Es una decisión que
cuesta cero al principio y es carísima de cambiar después, porque hay datos escritos con la forma vieja.</div>

<h4>Reducir anidamiento con salida temprana</h4>
<pre><code>// ❌ Pirámide: la lógica real está en el fondo
function procesar(pedido) {
  if (pedido) {
    if (pedido.items.length &gt; 0) {
      if (pedido.cliente.activo) {
        // … lo que importa, a 4 niveles de profundidad
      }
    }
  }
}

// ✔ Los casos que no aplican salen primero
function procesar(pedido) {
  if (!pedido) return;
  if (pedido.items.length === 0) return;
  if (!pedido.cliente.activo) return;

  // … lo que importa, a un nivel
}</code></pre>

<h4>Cómo usar estas señales sin volverse insoportable</h4>
<ul>
<li>Son <b>alarmas para mirar</b>, no reglas para imponer. Un archivo de 600 líneas con una razón clara está bien.</li>
<li>En una revisión de código, preguntá antes de afirmar: "¿por qué quedó así?" suele revelar una restricción real.</li>
<li>Priorizá las señales que <b>cuestan plata</b>: acoplamiento y cambio divergente antes que el largo de una función.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS NOMBRES SON DIAGNÓSTICO</text>

  <rect x="24" y="34" width="632" height="88" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="56" fill="#f87171" font-size="10.5" font-family="monospace" font-weight="700">Manager · Helper · Util</text>
  <text x="300" y="56" fill="currentColor" opacity=".68" font-size="10.5">→ no hay un concepto detrás</text>

  <text x="44" y="76" fill="#f87171" font-size="10.5" font-family="monospace" font-weight="700">procesar() · manejar()</text>
  <text x="300" y="76" fill="currentColor" opacity=".68" font-size="10.5">→ hace varias cosas</text>

  <text x="44" y="96" fill="#f87171" font-size="10.5" font-family="monospace" font-weight="700">validarYGuardar()</text>
  <text x="300" y="96" fill="currentColor" opacity=".68" font-size="10.5">→ la “Y” delata dos funciones</text>

  <text x="44" y="114" fill="#f87171" font-size="10.5" font-family="monospace" font-weight="700">datos · info · item</text>
  <text x="300" y="114" fill="currentColor" opacity=".68" font-size="10.5">→ no sabés qué representa</text>

  <rect x="24" y="132" width="632" height="30" rx="8" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="152" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">
    Si te cuesta nombrar algo, no es falta de vocabulario: es el diseño avisando que no está bien separado.</text>

  <line x1="24" y1="180" x2="656" y2="180" stroke="currentColor" opacity=".18"/>

  <text x="24" y="204" fill="#f87171" font-size="12" font-weight="700">
    LOS DOS QUE SE CONFUNDEN — y llevan al refactor CONTRARIO</text>

  <rect x="24" y="216" width="304" height="88" rx="10" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="176" y="238" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">CAMBIO DIVERGENTE</text>
  <text x="176" y="260" text-anchor="middle" fill="currentColor" opacity=".72" font-size="10.5">UN módulo cambia por</text>
  <text x="176" y="276" text-anchor="middle" fill="currentColor" opacity=".72" font-size="10.5">MUCHOS motivos</text>
  <rect x="44" y="284" width="264" height="14" rx="4" fill="#22d3ee" fill-opacity=".28"/>
  <text x="176" y="295" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">→ SEPARARLO</text>

  <rect x="352" y="216" width="304" height="88" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="504" y="238" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">CIRUGÍA CON ESCOPETA</text>
  <text x="504" y="260" text-anchor="middle" fill="currentColor" opacity=".72" font-size="10.5">UN motivo obliga a cambiar</text>
  <text x="504" y="276" text-anchor="middle" fill="currentColor" opacity=".72" font-size="10.5">MUCHOS módulos</text>
  <rect x="372" y="284" width="264" height="14" rx="4" fill="#7c5cff" fill-opacity=".28"/>
  <text x="504" y="295" text-anchor="middle" fill="#7c5cff" font-size="10" font-weight="700">→ JUNTARLOS</text>

  <rect x="24" y="318" width="304" height="68" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="338" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">CADENA DE MENSAJES</text>
  <text x="44" y="358" fill="currentColor" opacity=".7" font-size="10" font-family="monospace">pedido.cliente.direccion.ciudad.nombre</text>
  <text x="44" y="376" fill="#f87171" font-size="10" font-weight="700">conoce las tripas de 4 objetos a la vez</text>

  <rect x="352" y="318" width="304" height="68" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="338" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">PEDILE A QUIEN SABE</text>
  <text x="372" y="358" fill="#34d399" font-size="10.5" font-family="monospace" font-weight="700">pedido.ciudadDeEntrega()</text>
  <text x="372" y="376" fill="currentColor" opacity=".62" font-size="9.5">excepción: datos planos de un JSON están bien</text>
</svg>`,
        pie: 'Alarmas para mirar, no reglas para imponer. Pasarse está bien; pasarse sin poder explicar por qué, no.',
      },

      entrevista: [
        { p: '¿Qué te dicen los nombres sobre el diseño?',
          r: 'Mucho, y a simple vista. <code>Manager</code>, <code>Helper</code> o <code>Util</code> indican que no hay un concepto detrás; ' +
             '<code>procesar</code> o <code>manejar</code> indican que hace varias cosas; una "Y" en el nombre —<code>validarYGuardar</code>— ' +
             'delata dos funciones. Y la regla más útil: <b>si te cuesta nombrar algo, casi siempre es porque no está bien separado</b>. ' +
             'Un nombre difícil no es falta de vocabulario: es el diseño avisando que esa unidad no corresponde a ningún concepto del dominio.' },

        { p: '¿Cómo usás los umbrales de tamaño sin volverlos dogma?',
          r: 'Como <b>alarmas para mirar</b>, no como reglas. Archivo de más de 500 líneas, función de más de 50, más de cuatro parámetros, ' +
             'más de tres niveles de anidamiento: cada uno es una invitación a preguntar por qué. <b>Pasarse no es pecado; pasarse sin poder ' +
             'explicar por qué, sí.</b> Un archivo de 600 líneas que solo cambia cuando cambian las reglas fiscales está bien. ' +
             'Y en una revisión prefiero preguntar "¿por qué quedó así?" antes que afirmar, porque suele haber una restricción real detrás.' },

        { p: '¿Qué diferencia hay entre cambio divergente y cirugía con escopeta?',
          r: 'Son opuestos y confundirlos lleva al refactor contrario. <b>Cambio divergente</b> es que <b>un módulo cambia por muchos motivos</b>: ' +
             'la solución es <b>separarlo</b>. <b>Cirugía con escopeta</b> es que <b>un motivo obliga a cambiar muchos módulos</b>: la solución es ' +
             '<b>juntar</b> lo que cambia junto. Si diagnosticás mal cuál tenés, terminás fragmentando algo que había que unificar o al revés.' },

        { p: '¿Qué dice la ley de Demeter y cuál es su excepción?',
          r: 'Que un objeto debería hablar con lo que conoce directamente en vez de navegar las tripas de otros. ' +
             '<code>pedido.cliente.direccion.ciudad.nombre</code> conoce la estructura interna de cuatro objetos, así que si mañana la dirección deja ' +
             'de colgar del cliente se rompen las cincuenta líneas que hacen lo mismo. La alternativa es pedirle a quien sabe: ' +
             '<code>pedido.ciudadDeEntrega()</code>. La <b>excepción</b> es que esto aplica a objetos con comportamiento, no a estructuras de datos ' +
             'planas: leer <code>respuesta.data.items[0].id</code> de un JSON recién recibido es normal.' },
      ],

      practica: `
<h4>Tipos que no se pueden confundir</h4>
<pre><code>// Marcas de tipo: cuestan cero en tiempo de ejecución
type IdCliente = string &amp; { readonly __marca: 'IdCliente' };
type IdPedido  = string &amp; { readonly __marca: 'IdPedido' };

export const idCliente = (s: string) =&gt; s as IdCliente;

function pedidosDe(cliente: IdCliente) { … }

pedidosDe(pedidoId);   // ← Error de compilación. Antes compilaba.</code></pre>

<div class="aviso"><strong>El caso del dinero es el que más vale la pena resolver temprano.</strong> Guardar
plata como decimal produce errores de redondeo que aparecen recién cuando alguien concilia una cuenta.
Guardarla como <b>centavos en entero</b> y formatear solo al mostrar cuesta cero al principio y es carísimo de
cambiar después, porque hay datos escritos con la forma vieja.</div>

<h4>Grupos de datos que viajan juntos</h4>
<pre><code>// ❌ Los mismos cuatro parámetros, en ocho funciones
function crear(calle, numero, ciudad, cp) { … }
function validar(calle, numero, ciudad, cp) { … }
function formatear(calle, numero, ciudad, cp) { … }

// ✔ Si viajan juntos, son un concepto
interface Direccion { calle: string; numero: string; ciudad: string; cp: string; }
function crear(d: Direccion) { … }
function validar(d: Direccion) { … }
function formatear(d: Direccion) { … }</code></pre>

<h4>Salida temprana</h4>
<pre><code>// De 4 niveles a 1
function procesar(pedido: Pedido | null) {
  if (!pedido) return;
  if (pedido.items.length === 0) return;
  if (!pedido.cliente.activo) return;

  // lo que importa, sin pirámide
}</code></pre>

<h4>Revisión de código: qué mirar y en qué orden</h4>
<table>
<tr><th>#</th><th>Señal</th><th>Por qué primero</th></tr>
<tr><td>1</td><td>Cirugía con escopeta / cambio divergente</td><td>Es lo que cuesta plata todos los meses</td></tr>
<tr><td>2</td><td>Lógica de negocio dentro de un componente</td><td>Dependencia invertida</td></tr>
<tr><td>3</td><td>Nombres que no dicen nada</td><td>Barato de arreglar, alto impacto</td></tr>
<tr><td>4</td><td>Parámetros booleanos de comportamiento</td><td>Suele haber dos funciones adentro</td></tr>
<tr><td>5</td><td>Anidamiento profundo</td><td>Legibilidad</td></tr>
<tr><td>6</td><td>Largo de funciones</td><td>Lo último: es la señal más débil</td></tr>
</table>
`,

      errores: [
        { mito: 'Una función de más de 50 líneas está mal.',
          realidad: 'Es una <b>alarma para mirar</b>, no una regla. Una función larga, lineal y sin ramas puede ser más clara que seis chicas que te ' +
                    'obligan a saltar. Lo que importa es poder explicar por qué quedó así.' },

        { mito: 'Un módulo que cambia mucho hay que juntarlo con los demás.',
          realidad: 'Depende de cuál de los dos olores es. <b>Un módulo, muchos motivos</b> → separar. <b>Un motivo, muchos módulos</b> → juntar. ' +
                    'Confundirlos lleva a hacer exactamente el refactor contrario.' },

        { mito: 'Usar string para todos los identificadores es simple.',
          realidad: 'Es <b>obsesión por primitivos</b>: nada impide pasar los argumentos al revés y compila igual. Marcas de tipo cuestan cero en ' +
                    'tiempo de ejecución y convierten ese bug en un error de compilación.' },

        { mito: 'La ley de Demeter prohíbe encadenar propiedades.',
          realidad: 'Aplica a <b>objetos con comportamiento</b>, no a estructuras de datos planas. Leer <code>respuesta.data.items[0].id</code> de un ' +
                    'JSON recién recibido es normal; navegar las tripas de un modelo con dueño, no.' },
      ],

      glosario: [
        { t: 'Olor de código', d: 'Señal superficial que suele indicar un problema de diseño más profundo.' },
        { t: 'Envidia de funcionalidad', d: 'Una función usa más datos de otro módulo que del propio.' },
        { t: 'Obsesión por primitivos', d: 'Representar conceptos del dominio con string y number sueltos.' },
        { t: 'Grupo de datos', d: 'Parámetros que siempre viajan juntos. Suelen ser un concepto sin nombre.' },
        { t: 'Cambio divergente', d: 'Un módulo cambia por muchos motivos distintos. Hay que separarlo.' },
        { t: 'Cirugía con escopeta', d: 'Un motivo obliga a tocar muchos módulos. Hay que juntarlos.' },
        { t: 'Ley de Demeter', d: 'Hablar solo con vecinos directos, sin navegar estructuras ajenas.' },
        { t: 'Salida temprana', d: 'Descartar los casos que no aplican al inicio para evitar anidamiento.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es la formulación útil del principio de responsabilidad única?',
      opciones: [
        'Un módulo debe tener una sola razón para cambiar, identificada por quién pide el cambio',
        'Una clase debe tener un solo método público',
        'Un archivo no debe superar las 200 líneas',
        'Cada función debe hacer una sola operación',
      ],
      correcta: 0,
      porQue: 'Si contaduría cambia el cálculo, marketing la plantilla y sistemas el generador de PDF, y las tres cosas están en el mismo archivo, ese archivo tiene tres razones para cambiar.',
      porQueNo: {
        1: 'Un módulo puede exponer varias operaciones de la misma responsabilidad.',
        2: 'El tamaño es una alarma, no la definición del principio.',
        3: '"Una operación" es tan vago como "una cosa": no da criterio.',
      },
    },
    {
      p: '¿Cuándo conviene aplicar abierto/cerrado convirtiendo un if en un mapa?',
      opciones: [
        'Cuando aparece el tercer caso: con dos, el if es más corto y más claro',
        'Desde el primer caso, para estar preparado',
        'Solo si el equipo tiene más de cinco personas',
        'Nunca: los mapas son más difíciles de leer',
      ],
      correcta: 0,
      porQue: 'Montar un mecanismo de extensión para algo que quizás nunca se extienda es complejidad sin beneficio. Con tres casos ya viste qué es lo común y qué lo variable.',
      porQueNo: {
        1: 'Es construir infraestructura para una necesidad hipotética.',
        2: 'El tamaño del equipo no determina si el conjunto de casos va a crecer.',
        3: 'Con muchos casos, el mapa es más claro y evita tocar código que ya funciona.',
      },
    },
    {
      p: '¿Cuándo es MEJOR un switch exhaustivo que un mapa extensible?',
      opciones: [
        'Cuando el conjunto de casos es cerrado: el compilador avisa si agregás uno y no lo manejás',
        'Cuando hay menos de diez casos',
        'Cuando el código es de solo lectura',
        'Nunca: el mapa siempre es superior',
      ],
      correcta: 0,
      porQue: 'Con un tipo union y un switch, agregar un estado sin manejarlo no compila. Con un mapa dinámico, eso pasa a ser un error en tiempo de ejecución.',
      porQueNo: {
        1: 'La cantidad no importa: importa si el conjunto va a crecer.',
        2: 'No tiene relación con la mutabilidad del código.',
        3: 'La verificación en compilación es una ventaja real del switch.',
      },
    },
    {
      p: '¿Cuál es la forma MÁS SILENCIOSA de romper el principio de sustitución de Liskov?',
      opciones: [
        'Una implementación que no hace nada y devuelve éxito',
        'Lanzar un error descriptivo',
        'Tardar más que las otras implementaciones',
        'Usar otra librería internamente',
      ],
      correcta: 0,
      porQue: 'Los tests pasan, no hay error en ningún log, y el problema aparece en producción como "los emails no llegan". Es una postcondición más débil disfrazada de amabilidad.',
      porQueNo: {
        1: 'Rompe el contrato si no estaba contemplado, pero al menos es visible.',
        2: 'Es un problema de rendimiento, no de contrato.',
        3: 'Es exactamente lo que la abstracción permite: el detalle interno es libre.',
      },
    },
    {
      p: '¿Cuál es la versión útil de segregación de interfaces?',
      opciones: [
        'Que la interfaz la defina quien la usa, no quien la implementa',
        'Que ninguna interfaz tenga más de tres métodos',
        'Que cada clase implemente una sola interfaz',
        'Que las interfaces estén en archivos separados',
      ],
      correcta: 0,
      porQue: 'Definida por el consumidor, la interfaz tiene exactamente lo necesario. Definida por el proveedor, expone su modelo completo y el negocio se ata a él.',
      porQueNo: {
        1: 'Un número arbitrario no captura si los métodos sirven a quien la usa.',
        2: 'Implementar varias interfaces pequeñas es justamente lo que el principio favorece.',
        3: 'Es organización de archivos, no segregación.',
      },
    },
    {
      p: 'En JavaScript, ¿qué hace falta para aplicar inversión de dependencias?',
      opciones: [
        'Pasar las dependencias como parámetro; no hace falta ningún framework',
        'Un contenedor de inyección de dependencias',
        'Decoradores y metadatos',
        'Clases abstractas',
      ],
      correcta: 0,
      porQue: 'Un objeto deps con repositorio, notificador y reloj da todo el beneficio: se puede testear sin base, sin red y de forma determinista.',
      porQueNo: {
        1: 'Es una opción, pero agrega complejidad innecesaria en la mayoría de los casos.',
        2: 'Son azúcar sintáctico, no un requisito del principio.',
        3: 'Las interfaces de TypeScript o incluso funciones alcanzan.',
      },
    },
    {
      p: '¿Por qué conviene inyectar el reloj como dependencia?',
      opciones: [
        'Porque los tests que dependen de new Date() se rompen a fin de mes o en años bisiestos',
        'Porque mejora el rendimiento',
        'Porque permite cambiar de zona horaria',
        'Porque lo exige TypeScript',
      ],
      correcta: 0,
      porQue: 'El tiempo es una dependencia como cualquier otra. Inyectarlo vuelve los tests deterministas: corren igual hoy que el 29 de febrero.',
      porQueNo: {
        1: 'No tiene ningún efecto en el rendimiento.',
        2: 'Las zonas horarias se manejan aparte, con la librería de fechas.',
        3: 'TypeScript no exige nada de esto.',
      },
    },
    {
      p: '¿Cuál es la prueba honesta antes de crear una abstracción?',
      opciones: [
        '¿Puedo nombrar la segunda implementación? Si es "ninguna, por si acaso", no la hagas',
        '¿Está en el catálogo de patrones?',
        '¿El equipo la va a entender?',
        '¿Agrega menos de 50 líneas?',
      ],
      correcta: 0,
      porQue: 'Una interfaz con un solo implementador para siempre es decorativa: solo agrega indirección. Si la segunda implementación es un doble de prueba, ya alcanza para justificarla.',
      porQueNo: {
        1: 'Que el patrón exista no significa que este problema lo necesite.',
        2: 'Importa, pero no responde si la abstracción aporta algo.',
        3: 'El tamaño no dice nada sobre su utilidad.',
      },
    },
    {
      p: '¿Qué dice DRY realmente?',
      opciones: [
        'No repitas conocimiento — dos bloques idénticos que son reglas distintas no son duplicación',
        'No repitas ninguna línea de código',
        'Extraé una función cada vez que veas algo parecido',
        'Toda constante debe estar centralizada',
      ],
      correcta: 0,
      porQue: 'Unificar "IVA al consumidor" con "IVA en compras" porque hoy coinciden lleva a que la función termine con cinco banderas cuando una de las reglas cambie.',
      porQueNo: {
        1: 'Líneas idénticas por coincidencia no representan el mismo conocimiento.',
        2: 'El parecido superficial es exactamente lo que produce abstracciones equivocadas.',
        3: 'Las constantes sí conviene centralizarlas, pero es un caso, no el principio.',
      },
    },
    {
      p: '¿Por qué conviene errar hacia duplicar en vez de hacia abstraer?',
      opciones: [
        'Porque deshacer una duplicación es local y seguro, y deshacer una abstracción equivocada obliga a desenredar todos los usos',
        'Porque duplicar es más rápido de escribir',
        'Porque las abstracciones afectan el rendimiento',
        'Porque los revisores prefieren código explícito',
      ],
      correcta: 0,
      porQue: 'El costo es asimétrico. De ahí la regla de tres: primera vez lo escribís, segunda duplicás, tercera extraés — con dos ocurrencias no sabés qué es común y qué variable.',
      porQueNo: {
        1: 'La velocidad de escritura no es el criterio.',
        2: 'El impacto en rendimiento es despreciable en la mayoría de los casos.',
        3: 'Es una preferencia, no un argumento de costo.',
      },
    },
    {
      p: '¿Cómo se reconoce una abstracción equivocada?',
      opciones: [
        'Por las banderas: parámetros booleanos o "tipo" que cambian qué hace, muchos opcionales, nombre genérico',
        'Porque tiene más de 100 líneas',
        'Porque está en la carpeta compartida',
        'Porque la escribió otra persona',
      ],
      correcta: 0,
      porQue: 'Cada bandera es un caso que no encajaba. El mejor refactor suele ser el contraintuitivo: desabstraer, poner la función en línea en cada uso y ver qué queda realmente común.',
      porQueNo: {
        1: 'El tamaño no distingue una buena abstracción de una mala.',
        2: 'Estar compartido es lo esperable en una abstracción legítima.',
        3: 'La autoría no es un criterio técnico.',
      },
    },
    {
      p: '¿Dónde está el límite entre YAGNI y negligencia?',
      opciones: [
        'YAGNI dice no construir la funcionalidad, no tomar decisiones que la vuelvan imposible',
        'YAGNI aplica solo a proyectos chicos',
        'YAGNI significa no pensar en el futuro en absoluto',
        'YAGNI se suspende cuando el cliente lo pide',
      ],
      correcta: 0,
      porQue: 'No armar el sistema de traducciones está bien; esparcir textos literales por toda la lógica de negocio es hacerse daño gratis. No optimizar sin medir está bien; dejar un N+1 evidente, no.',
      porQueNo: {
        1: 'Aplica en cualquier escala; en proyectos grandes el costo de lo no usado es mayor.',
        2: 'Pensar es gratis; construir es lo que cuesta.',
        3: 'Si el cliente lo pide, deja de ser una necesidad hipotética.',
      },
    },
    {
      p: '¿Qué señal da un nombre difícil de elegir?',
      opciones: [
        'Que esa unidad no corresponde a ningún concepto: casi siempre no está bien separada',
        'Que hace falta consultar un diccionario técnico',
        'Que el dominio es complejo',
        'Que conviene usar un nombre genérico',
      ],
      correcta: 0,
      porQue: 'Un nombre difícil no es falta de vocabulario: es el diseño avisando. Nombres como Manager, Helper o procesar son el síntoma visible de que no hay un concepto detrás.',
      porQueNo: {
        1: 'El vocabulario rara vez es el problema real.',
        2: 'Un dominio complejo tiene conceptos con nombre propio, justamente.',
        3: 'Un nombre genérico esconde el problema en vez de resolverlo.',
      },
    },
    {
      p: 'Un motivo de cambio obliga a tocar muchos módulos. ¿Qué olor es y qué se hace?',
      opciones: [
        'Cirugía con escopeta: hay que juntar lo que cambia junto',
        'Cambio divergente: hay que separar el módulo',
        'Envidia de funcionalidad: hay que mover la función',
        'Obsesión por primitivos: hay que crear tipos propios',
      ],
      correcta: 0,
      porQue: 'Es el opuesto de cambio divergente —un módulo, muchos motivos—. Confundirlos lleva a fragmentar algo que había que unificar, o al revés.',
      porQueNo: {
        1: 'Es el caso inverso: un módulo cambiando por muchos motivos.',
        2: 'Describe una función que usa más datos ajenos que propios.',
        3: 'Se refiere a representar conceptos con string y number sueltos.',
      },
    },
    {
      p: '¿Cuál es la excepción a la ley de Demeter?',
      opciones: [
        'Las estructuras de datos planas: leer respuesta.data.items[0].id de un JSON es normal',
        'Los objetos del mismo módulo',
        'Las cadenas de menos de tres niveles',
        'El código de tests',
      ],
      correcta: 0,
      porQue: 'La ley habla de no depender de la estructura interna de objetos con comportamiento y con dueño, no de navegar datos que acabás de recibir.',
      porQueNo: {
        1: 'Dentro del mismo módulo el acoplamiento es menos grave, pero no es la excepción del principio.',
        2: 'La cantidad de niveles no cambia la naturaleza del acoplamiento.',
        3: 'Los tests tienen otras licencias, pero no es la excepción de esta ley.',
      },
    },
  ],
});
