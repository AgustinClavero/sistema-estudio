/* ==========================================================================
   Arquitectura · Módulo 04 — Domain-Driven Design, lo útil
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'arquitectura',
  id: 'm04',
  titulo: 'Domain-Driven Design, lo útil',
  fuentes: ['ddd-referencia', 'fowler'],

  intro:
    '<p>DDD tiene mala fama merecida: su literatura es densa, su vocabulario es intimidante y mucha gente lo usa ' +
    'para justificar estructuras enormes en proyectos que no las necesitan.</p>' +
    '<p>Pero abajo de todo eso hay <b>cuatro ideas que valen para cualquier proyecto</b>, incluso uno chico. ' +
    'Este módulo se queda con esas cuatro y deja el resto explícitamente afuera, con el motivo.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Lenguaje ubicuo: la idea más barata y más ignorada',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> que el código use <b>exactamente las mismas
palabras</b> que usa el negocio, sin traducciones intermedias.</div>

<h4>El problema, con un ejemplo</h4>
<p>Una escuela habla de <b>alumnos</b>, <b>cuotas</b> y <b>morosos</b>. Y en el código dice:</p>
<pre><code>User          ← ¿es alumno? ¿es padre? ¿es profesor?
Payment       ← ¿es una cuota? ¿un producto? ¿una inscripción?
status: 3     ← ¿qué es 3?</code></pre>
<p>Cada conversación entre negocio y desarrollo necesita una traducción, y esa traducción <b>vive en la cabeza
de alguien</b>. Cuando esa persona no está, nadie sabe si un "usuario con estado 3" es un alumno moroso.</p>

<div class="aviso"><strong>El costo real no es la confusión: son los errores de interpretación.</strong>
Alguien pregunta "¿cuántos morosos hay?", otro traduce mentalmente a "usuarios con estado 3", y resulta que el
estado 3 también incluye a los que pidieron baja. <b>El número sale mal, nadie ve un error, y la decisión se
toma con el dato equivocado.</b></div>

<h4>Con lenguaje ubicuo</h4>
<pre><code>Alumno
Cuota
Cuota.estaVencida()
Alumno.esMoroso()      ← y su definición vive en un lugar
EstadoCuota = 'pendiente' | 'pagada' | 'vencida' | 'condonada'</code></pre>

<p>Ahora una conversación de negocio se puede leer directo en el código. "¿Un alumno moroso puede inscribirse?"
tiene una respuesta buscable.</p>

<h4>Las tres reglas</h4>
<ol>
<li><b>Usá las palabras del negocio</b>, aunque suenen raras en inglés. Si dicen "cuota", no es <code>Payment</code>.</li>
<li><b>Una palabra, un significado.</b> Si "cliente" significa dos cosas distintas, hacen falta dos palabras.</li>
<li><b>Cuando el negocio cambia una palabra, cambiala en el código.</b> El costo es un renombre; el de no hacerlo es permanente.</li>
</ol>
`,

      tecnico: `
<h4>Del lenguaje al tipo</h4>
<pre><code>// ❌ Genérico: no dice nada del negocio
interface User { id: string; type: number; status: number; balance: number; }

// ✔ Del dominio
interface Alumno {
  id: IdAlumno;
  nombre: string;
  situacion: 'activo' | 'suspendido' | 'egresado' | 'baja';
  cuotas: Cuota[];
}

interface Cuota {
  id: IdCuota;
  periodo: Periodo;                 // '2026-08', no un Date suelto
  monto: Centavos;
  estado: 'pendiente' | 'pagada' | 'vencida' | 'condonada';
  vencimiento: Date;
}</code></pre>

<div class="dato"><strong>El campo <code>periodo</code> muestra algo más profundo que un renombre.</strong> Una
cuota no pertenece a una fecha: pertenece a un <b>mes de cursada</b>. Modelarlo como <code>Date</code> obliga a
que cada consulta decida qué día del mes representa, y aparecen bugs de zona horaria donde la cuota de agosto
se cuenta en julio. <b>El lenguaje del negocio suele estar señalando el tipo correcto.</b></div>

<h4>Las definiciones ambiguas: donde está el valor real</h4>
<p>El ejercicio más útil de esta lección no es renombrar: es <b>preguntar qué significan exactamente las
palabras que todos usan</b>.</p>
<pre><code>"Moroso"      → ¿desde el primer día de atraso? ¿desde los 30?
              → ¿cuenta el que tiene un plan de pago vigente?
              → ¿y el que pidió la baja con deuda?

"Activo"      → ¿inscripto? ¿que asistió este mes? ¿que pagó?

"Cliente"     → ¿el que compró alguna vez? ¿el que tiene contrato?
              → ¿el que está pagando hoy?</code></pre>

<div class="dato"><strong>Hacer esas preguntas revela desacuerdos que ya existían y nadie había notado.</strong>
Es normal que dos personas del mismo equipo den definiciones distintas de "activo" y que ninguna de las dos sea
la que está implementada. <b>Ese descubrimiento vale más que todo el renombrado</b>, porque explica por qué dos
reportes nunca dan el mismo número.</div>

<h4>El lenguaje en la base de datos</h4>
<pre><code>-- ❌
create table users (id uuid, type int, status int, meta jsonb);

-- ✔
create table alumnos (
  id uuid primary key,
  situacion text not null check (situacion in ('activo','suspendido','egresado','baja')),
  …
);

create table cuotas (
  periodo text not null check (periodo ~ '^\\d{4}-\\d{2}$'),
  estado text not null check (estado in ('pendiente','pagada','vencida','condonada')),
  …
);</code></pre>

<div class="dato"><strong>El <code>check</code> hace dos cosas a la vez:</strong> documenta los valores
posibles para cualquiera que lea el esquema, y <b>los hace obligatorios</b>. Con un <code>int</code> sin
restricción, nada impide que alguien inserte un estado 7 que ningún código sabe interpretar — y esa fila queda
ahí, apareciendo en reportes, para siempre.</div>

<h4>Cuándo el renombre no vale la pena</h4>
<ul>
<li>Si el término técnico <b>es</b> el término del negocio (un "webhook" es un webhook).</li>
<li>En infraestructura pura: un pool de conexiones no necesita nombre de dominio.</li>
<li>Si el renombre implica una migración de datos grande <b>y</b> el término viejo no genera confusión real.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="lu1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="22" fill="#f87171" font-size="12" font-weight="700">
    SIN LENGUAJE COMÚN — cada conversación necesita una traducción</text>

  <rect x="24" y="34" width="180" height="80" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="114" y="54" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">NEGOCIO</text>
  <text x="114" y="76" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">alumno · cuota · moroso</text>
  <text x="114" y="96" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">inscripción · condonar</text>

  <rect x="220" y="46" width="120" height="56" rx="9" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.6"/>
  <text x="280" y="68" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">TRADUCCIÓN</text>
  <text x="280" y="86" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">vive en la cabeza</text>
  <text x="280" y="98" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">de alguien</text>

  <rect x="356" y="34" width="180" height="80" rx="10" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.2"/>
  <text x="446" y="54" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">CÓDIGO</text>
  <text x="446" y="76" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10" font-family="monospace">User · Payment</text>
  <text x="446" y="96" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10" font-family="monospace">status: 3</text>

  <line x1="208" y1="74" x2="216" y2="74" stroke="currentColor" stroke-width="1.3" marker-end="url(#lu1)"/>
  <line x1="344" y1="74" x2="352" y2="74" stroke="currentColor" stroke-width="1.3" marker-end="url(#lu1)"/>

  <text x="552" y="66" fill="#f87171" font-size="9.5" font-weight="700">cuando esa</text>
  <text x="552" y="80" fill="#f87171" font-size="9.5" font-weight="700">persona no está,</text>
  <text x="552" y="94" fill="#f87171" font-size="9.5" font-weight="700">nadie sabe qué es 3</text>

  <rect x="24" y="124" width="632" height="46" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.5"/>
  <text x="44" y="144" fill="#f87171" font-size="11.5" font-weight="700">EL COSTO REAL NO ES LA CONFUSIÓN: SON LOS ERRORES DE INTERPRETACIÓN</text>
  <text x="44" y="162" fill="currentColor" opacity=".75" font-size="11">
    “¿cuántos morosos hay?” → alguien traduce a “estado 3” → pero el 3 también incluye a los que pidieron baja. <tspan font-weight="700">Nadie ve un error.</tspan></text>

  <line x1="24" y1="192" x2="656" y2="192" stroke="currentColor" opacity=".18"/>

  <text x="24" y="216" fill="#34d399" font-size="12" font-weight="700">
    CON LENGUAJE UBICUO — una conversación de negocio se lee en el código</text>

  <rect x="24" y="228" width="632" height="58" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="44" y="250" fill="currentColor" opacity=".78" font-size="11" font-family="monospace">
    Alumno · Cuota · Cuota.estaVencida() · Alumno.esMoroso()</text>
  <text x="44" y="272" fill="currentColor" opacity=".78" font-size="11" font-family="monospace">
    EstadoCuota = 'pendiente' | 'pagada' | 'vencida' | 'condonada'</text>

  <rect x="24" y="300" width="632" height="86" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="44" y="322" fill="#fbbf24" font-size="12" font-weight="700">EL EJERCICIO QUE MÁS VALE: PREGUNTAR QUÉ SIGNIFICAN LAS PALABRAS</text>
  <text x="44" y="344" fill="currentColor" opacity=".75" font-size="10.5">
    “moroso” → ¿desde el primer día? ¿desde los 30? ¿cuenta el que tiene plan de pago vigente?</text>
  <text x="44" y="362" fill="currentColor" opacity=".75" font-size="10.5">
    “activo” → ¿inscripto? ¿que asistió este mes? ¿que pagó?</text>
  <text x="44" y="380" fill="#fbbf24" font-size="10.5" font-weight="700">
    Revela desacuerdos que ya existían — y explica por qué dos reportes nunca dan el mismo número.</text>
</svg>`,
        pie: 'El renombre es lo barato. Lo valioso es descubrir que nadie estaba de acuerdo en qué era “activo”.',
      },

      entrevista: [
        { p: '¿Qué es el lenguaje ubicuo y por qué importa?',
          r: 'Que el código use <b>exactamente las mismas palabras que el negocio</b>, sin traducción intermedia. Importa porque el costo de no tenerlo ' +
             'no es la confusión sino los <b>errores de interpretación</b>: alguien pregunta cuántos morosos hay, otro traduce mentalmente a "usuarios ' +
             'con estado 3", y resulta que ese estado también incluye a los que pidieron baja. El número sale mal, <b>nadie ve un error</b>, ' +
             'y la decisión se toma con el dato equivocado.' },

        { p: '¿Cuál es el ejercicio más valioso al construir el lenguaje?',
          r: 'No renombrar, sino <b>preguntar qué significan exactamente las palabras que todos usan</b>. "¿Moroso desde el primer día de atraso o desde ' +
             'los treinta? ¿Cuenta el que tiene un plan de pago vigente?" Hacer esas preguntas <b>revela desacuerdos que ya existían y nadie había ' +
             'notado</b>: es normal que dos personas del mismo equipo den definiciones distintas de "activo" y que ninguna sea la implementada. ' +
             'Ese descubrimiento explica por qué dos reportes nunca dan el mismo número.' },

        { p: '¿Cómo se refleja el lenguaje ubicuo en el modelo de datos?',
          r: 'Con nombres de tabla y de columna del negocio, y con <b>restricciones que documentan los valores posibles</b>. Un <code>check</code> sobre ' +
             'el estado hace dos cosas: le dice a cualquiera que lea el esquema cuáles son los valores válidos, y <b>los hace obligatorios</b>. ' +
             'Con un <code>int</code> sin restricción, nada impide que alguien inserte un estado 7 que ningún código sabe interpretar — ' +
             'y esa fila queda apareciendo en reportes para siempre.' },

        { p: '¿El lenguaje del negocio puede señalar el tipo correcto?',
          r: 'Sí, y es una de las cosas más útiles. Si el negocio habla de "la cuota de agosto", una cuota no pertenece a una <b>fecha</b> sino a un ' +
             '<b>período</b>. Modelarla con <code>Date</code> obliga a que cada consulta decida qué día del mes representa, y aparecen bugs de zona ' +
             'horaria donde la cuota de agosto se cuenta en julio. <b>Cuando el nombre del negocio no encaja con el tipo elegido, casi siempre el tipo ' +
             'está mal.</b>' },
      ],

      practica: `
<h4>El glosario, que es el entregable</h4>
<pre><code># Glosario del dominio — Gestiapp

Alumno        Persona inscripta en la escuela. Puede tener uno o más
              responsables de pago.

Cuota         Obligación de pago correspondiente a un PERÍODO (mes de
              cursada), no a una fecha. Estados: pendiente, pagada,
              vencida, condonada.

Vencida       Cuota cuyo vencimiento pasó y sigue pendiente.
              NO incluye las condonadas.

Moroso        Alumno con 2 o más cuotas vencidas y sin plan de pago
              vigente. ← definido con Administración, 2026-08-08

Condonar      Cancelar la obligación sin cobro. Requiere autorización
              de dirección y queda registrado con motivo.</code></pre>

<div class="aviso"><strong>La línea de "moroso" con fecha y con quién lo definió es la más importante del
documento.</strong> Convierte una definición discutible en una <b>decisión con dueño</b>: cuando alguien
proponga contar distinto, la conversación arranca de un acuerdo previo en vez de cero.</div>

<h4>Del glosario al código</h4>
<pre><code>// dominio/alumno.ts
export const CUOTAS_PARA_MOROSIDAD = 2;

export function esMoroso(alumno: Alumno, hoy: Date): boolean {
  if (alumno.planDePago?.vigenteHasta &amp;&amp; alumno.planDePago.vigenteHasta &gt;= hoy) {
    return false;                                    // ← el matiz del glosario
  }
  return alumno.cuotas.filter((c) =&gt; estaVencida(c, hoy)).length &gt;= CUOTAS_PARA_MOROSIDAD;
}

export function estaVencida(cuota: Cuota, hoy: Date): boolean {
  return cuota.estado === 'pendiente' &amp;&amp; cuota.vencimiento &lt; hoy;
  // 'condonada' NO cuenta — está en el glosario
}</code></pre>

<h4>Un tipo para el período</h4>
<pre><code>// El negocio habla de meses, no de días
export type Periodo = &#96;\${number}-\${string}&#96;;   // '2026-08'

export function periodoDe(fecha: Date): Periodo {
  return \`\${fecha.getUTCFullYear()}-\${String(fecha.getUTCMonth() + 1).padStart(2, '0')}\` as Periodo;
}
export function comparar(a: Periodo, b: Periodo) { return a.localeCompare(b); }</code></pre>
<p>Comparar períodos como texto funciona porque el formato está ordenado, y evita por completo los problemas de
zona horaria de comparar fechas.</p>

<h4>Cómo construir el glosario en una reunión</h4>
<table>
<tr><th>#</th><th>Paso</th></tr>
<tr><td>1</td><td>Listar las 15-20 palabras que más se repiten en las conversaciones</td></tr>
<tr><td>2</td><td>Pedir a dos personas del negocio que definan cada una <b>por separado</b></td></tr>
<tr><td>3</td><td>Comparar: donde no coinciden, hay una decisión pendiente</td></tr>
<tr><td>4</td><td>Resolver con quien decide, y anotar la fecha</td></tr>
<tr><td>5</td><td>Renombrar en el código para que coincida</td></tr>
<tr><td>6</td><td>Revisar el glosario cuando aparezca una palabra nueva</td></tr>
</table>
`,

      errores: [
        { mito: 'El lenguaje ubicuo es renombrar variables.',
          realidad: 'El renombre es lo barato. Lo valioso es <b>preguntar qué significan las palabras</b>: casi siempre aparecen definiciones distintas ' +
                    'entre personas del mismo equipo, y eso explica por qué dos reportes nunca dan el mismo número.' },

        { mito: 'Los nombres técnicos son más profesionales.',
          realidad: '<code>User</code> y <code>Payment</code> no dicen si es un alumno o un profesor, ni si es una cuota o una inscripción. ' +
                    'Cada conversación necesita una traducción que <b>vive en la cabeza de alguien</b>.' },

        { mito: 'Puedo usar un entero para el estado y documentarlo aparte.',
          realidad: 'La documentación aparte se desactualiza y nada impide insertar un estado 7 que ningún código interpreta. Un <code>check</code> ' +
                    'en la base <b>documenta y obliga</b> al mismo tiempo.' },

        { mito: 'Si el negocio cambia una palabra, la mapeo internamente.',
          realidad: 'Cada mapeo es una traducción más que alguien tiene que recordar. El costo de renombrar es puntual; ' +
                    'el de mantener dos vocabularios en paralelo es permanente.' },
      ],

      glosario: [
        { t: 'Lenguaje ubicuo', d: 'Vocabulario compartido entre negocio y código, sin traducciones.' },
        { t: 'Glosario del dominio', d: 'Documento con las definiciones acordadas, su fecha y su dueño.' },
        { t: 'Término ambiguo', d: 'Palabra que distintas personas definen distinto. Señal de decisión pendiente.' },
        { t: 'Período', d: 'Ejemplo de tipo del dominio que no es una fecha: un mes de cursada.' },
        { t: 'check', d: 'Restricción de base que limita los valores posibles de una columna.' },
        { t: 'Traducción implícita', d: 'Conversión mental entre negocio y código. El costo oculto de no tener lenguaje común.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Bounded context: la misma palabra, dos significados',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> la misma palabra significa cosas distintas en
distintas partes del negocio, y <b>forzar un único modelo para todas</b> es la causa número uno de modelos
monstruosos.</div>

<h4>El ejemplo clásico</h4>
<p>En una empresa, "cliente" significa:</p>
<table>
<tr><th>Área</th><th>Qué le importa de un cliente</th></tr>
<tr><td><b>Ventas</b></td><td>Contacto, historial de conversaciones, probabilidad de cierre</td></tr>
<tr><td><b>Facturación</b></td><td>Razón social, CUIT, condición fiscal, domicilio legal</td></tr>
<tr><td><b>Soporte</b></td><td>Tickets abiertos, plan contratado, nivel de servicio</td></tr>
<tr><td><b>Envíos</b></td><td>Dirección física, horarios, instrucciones de entrega</td></tr>
</table>

<div class="aviso"><strong>La tentación es hacer una tabla <code>clientes</code> con todos esos campos.</strong>
El resultado es una entidad con cuarenta columnas donde cada área usa ocho y ninguna entiende las otras
treinta y dos. Y peor: <b>un cambio de facturación puede romper envíos</b>, porque comparten el mismo objeto
sin tener nada que ver.</div>

<h4>Con contextos separados</h4>
<pre><code>Ventas          Cliente { id, nombre, contacto, etapa, valorEstimado }
Facturación     Cliente { id, razonSocial, cuit, condicionFiscal }
Soporte         Cliente { id, nombre, plan, ticketsAbiertos }</code></pre>
<p>Tres modelos de "cliente", cada uno con lo que su contexto necesita. <b>Comparten el identificador</b>, y eso
alcanza para relacionarlos.</p>

<h4>Cómo se reconoce un límite de contexto</h4>
<ul>
<li>Cuando <b>la misma palabra</b> significa cosas distintas.</li>
<li>Cuando distintas <b>áreas del negocio</b> piden cambios sobre lo mismo.</li>
<li>Cuando un modelo acumula campos que solo usa una parte.</li>
<li>Cuando podés describir una parte sin mencionar la otra.</li>
</ul>

<p>Ese último es el más práctico: si podés explicar cómo funciona facturación sin hablar del embudo de ventas,
son dos contextos.</p>
`,

      tecnico: `
<h4>Separar sin partir el sistema</h4>
<p>Contextos separados <b>no</b> significa servicios separados ni bases separadas. En un monolito modular
—que es el default del workspace— se traduce en:</p>
<pre><code>funcionalidades/
  ventas/
    tipos.ts          Cliente (visión de ventas)
    servicio.ts
    index.ts          ← puerta: lo único importable desde afuera
  facturacion/
    tipos.ts          Cliente (visión de facturación)
    servicio.ts
    index.ts
  soporte/
    …</code></pre>

<div class="dato"><strong>La regla que hace que esto funcione es una sola:</strong> un contexto
<b>nunca</b> importa tipos internos de otro. Si facturación necesita algo de ventas, lo pide por la puerta de
adelante y recibe <b>su propia forma</b>. Sin esa regla, las carpetas separadas se vuelven decorativas en tres
semanas.</div>

<h4>Cómo se comunican dos contextos</h4>
<table>
<tr><th>Forma</th><th>Cuándo</th></tr>
<tr><td><b>Solo el identificador</b></td><td>Casi siempre alcanza. Cada uno consulta lo suyo</td></tr>
<tr><td><b>Función pública del otro contexto</b></td><td>Cuando hace falta un dato puntual</td></tr>
<tr><td><b>Evento</b></td><td>Cuando algo pasó y otros pueden reaccionar</td></tr>
<tr><td><b>Copia local</b></td><td>Cuando se necesita para consultar seguido, y se acepta que esté algo vieja</td></tr>
</table>

<div class="dato"><strong>La cuarta merece atención porque suena mal y muchas veces es correcta.</strong>
Que facturación guarde el nombre del cliente al momento de emitir no es duplicación: es que la factura debe
mostrar <b>el nombre que tenía cuando se emitió</b>, aunque después cambie. <b>Ahí la copia no es un caché: es
parte del dato.</b></div>

<h4>El mapa de contextos</h4>
<p>Dibujar quién depende de quién y <b>cómo</b>. Las relaciones típicas:</p>
<pre><code>Ventas  ──(evento: cliente.ganado)──▶  Facturación
        ──(evento)──────────────────▶  Soporte

Facturación ──(consulta por id)──▶  Ventas   [solo lectura]

Pagos (externo) ──(webhook)──▶  Facturación   [contexto ajeno:
                                 hay que traducir su vocabulario]</code></pre>

<div class="dato"><strong>La última línea señala algo importante:</strong> un proveedor externo es un contexto
que <b>no controlás</b>, con su propio vocabulario. Su webhook habla de <code>payment_intent</code> y
<code>charge</code>; tu sistema habla de "cobro de cuota". La traducción va en un adaptador, en el borde —
si dejás entrar su vocabulario, termina en el medio de tus reglas.</div>

<h4>Cuándo NO separar</h4>
<ul>
<li>Cuando el "otro contexto" son tres campos y una pantalla.</li>
<li>Cuando las dos partes cambian siempre juntas.</li>
<li>Cuando el equipo es de una o dos personas y el producto es chico: la separación cuesta más de lo que ordena.</li>
</ul>
<p>Los contextos existen para <b>reducir el ruido</b> entre partes que no se entienden. Si todas se entienden,
no hay nada que separar.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="bc1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="#f87171" font-size="12" font-weight="700">
    UN SOLO MODELO PARA TODOS — 40 columnas, cada área usa 8</text>

  <rect x="230" y="34" width="220" height="86" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="340" y="54" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">clientes</text>
  <text x="340" y="72" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">nombre · contacto · etapa · valor</text>
  <text x="340" y="86" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">razonSocial · cuit · condicionFiscal</text>
  <text x="340" y="100" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">plan · tickets · direccion · horarios…</text>
  <text x="340" y="114" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">un cambio de facturación rompe envíos</text>

  <text x="60" y="70" fill="currentColor" opacity=".6" font-size="9.5">ventas</text>
  <text x="60" y="90" fill="currentColor" opacity=".6" font-size="9.5">facturación</text>
  <text x="560" y="70" fill="currentColor" opacity=".6" font-size="9.5">soporte</text>
  <text x="560" y="90" fill="currentColor" opacity=".6" font-size="9.5">envíos</text>
  <line x1="100" y1="66" x2="226" y2="70" stroke="#f87171" stroke-width="1.1" marker-end="url(#bc1)" color="#f87171"/>
  <line x1="110" y1="86" x2="226" y2="84" stroke="#f87171" stroke-width="1.1" marker-end="url(#bc1)" color="#f87171"/>
  <line x1="552" y1="66" x2="456" y2="70" stroke="#f87171" stroke-width="1.1" marker-end="url(#bc1)" color="#f87171"/>
  <line x1="552" y1="86" x2="456" y2="84" stroke="#f87171" stroke-width="1.1" marker-end="url(#bc1)" color="#f87171"/>

  <line x1="24" y1="136" x2="656" y2="136" stroke="currentColor" opacity=".18"/>

  <text x="24" y="160" fill="#34d399" font-size="12" font-weight="700">
    CON CONTEXTOS — tres modelos de “cliente”, cada uno con lo suyo</text>

  <rect x="24" y="172" width="200" height="88" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="124" y="192" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">VENTAS</text>
  <text x="124" y="212" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9.5">id · nombre · contacto</text>
  <text x="124" y="228" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9.5">etapa · valorEstimado</text>
  <rect x="44" y="238" width="160" height="14" rx="4" fill="#22d3ee" fill-opacity=".25"/>
  <text x="124" y="249" text-anchor="middle" fill="#22d3ee" font-size="8.5" font-weight="700">index.ts ← la puerta</text>

  <rect x="240" y="172" width="200" height="88" rx="10" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="340" y="192" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">FACTURACIÓN</text>
  <text x="340" y="212" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9.5">id · razonSocial · cuit</text>
  <text x="340" y="228" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9.5">condicionFiscal</text>
  <rect x="260" y="238" width="160" height="14" rx="4" fill="#fbbf24" fill-opacity=".25"/>
  <text x="340" y="249" text-anchor="middle" fill="#fbbf24" font-size="8.5" font-weight="700">index.ts ← la puerta</text>

  <rect x="456" y="172" width="200" height="88" rx="10" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="556" y="192" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">SOPORTE</text>
  <text x="556" y="212" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9.5">id · nombre · plan</text>
  <text x="556" y="228" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9.5">ticketsAbiertos</text>
  <rect x="476" y="238" width="160" height="14" rx="4" fill="#7c5cff" fill-opacity=".25"/>
  <text x="556" y="249" text-anchor="middle" fill="#7c5cff" font-size="8.5" font-weight="700">index.ts ← la puerta</text>

  <rect x="24" y="270" width="632" height="34" rx="8" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.5"/>
  <text x="340" y="291" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">
    LA REGLA: un contexto NUNCA importa tipos internos de otro. Comparten el id, y eso alcanza.</text>

  <rect x="24" y="316" width="304" height="70" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="176" y="336" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">LA COPIA QUE NO ES DUPLICACIÓN</text>
  <text x="44" y="356" fill="currentColor" opacity=".72" font-size="10">La factura guarda el nombre del cliente</text>
  <text x="44" y="372" fill="#fbbf24" font-size="10" font-weight="700">al momento de emitir. No es caché: es parte del dato.</text>

  <rect x="352" y="316" width="304" height="70" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="504" y="336" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">EL CONTEXTO QUE NO CONTROLÁS</text>
  <text x="372" y="356" fill="currentColor" opacity=".72" font-size="10">payment_intent · charge · refund…</text>
  <text x="372" y="372" fill="#f87171" font-size="10" font-weight="700">traducilo en el borde, o su vocabulario termina en tus reglas</text>
</svg>`,
        pie: 'Si podés explicar facturación sin mencionar el embudo de ventas, son dos contextos.',
      },

      entrevista: [
        { p: '¿Qué es un bounded context?',
          r: 'Un límite dentro del cual una palabra tiene <b>un solo significado</b>. "Cliente" significa cosas distintas en ventas, facturación y ' +
             'soporte: a cada área le importan campos distintos. Forzar un único modelo produce una entidad con cuarenta columnas donde cada área usa ' +
             'ocho — y donde <b>un cambio de facturación puede romper envíos</b>, porque comparten un objeto sin tener nada que ver. ' +
             'Con contextos separados hay tres modelos de cliente que <b>comparten el identificador</b>, y eso alcanza para relacionarlos.' },

        { p: '¿Contextos separados implica microservicios?',
          r: 'No. En un monolito modular se traducen en <b>carpetas por funcionalidad</b>, cada una con sus tipos, su servicio y una puerta de adelante. ' +
             'La regla que lo hace funcionar es una sola: <b>un contexto nunca importa tipos internos de otro</b>. ' +
             'Si facturación necesita algo de ventas, lo pide por la puerta y recibe su propia forma. ' +
             'Sin esa regla, las carpetas separadas se vuelven decorativas en tres semanas.' },

        { p: '¿Cuándo guardar una copia local de datos de otro contexto es correcto?',
          r: 'Cuando el dato <b>es parte del registro</b>, no una caché. Que facturación guarde el nombre del cliente al momento de emitir no es ' +
             'duplicación: la factura debe mostrar <b>el nombre que tenía cuando se emitió</b>, aunque el cliente después cambie de razón social. ' +
             'Ahí copiar es correcto y consultar en vivo sería un error. También sirve como copia de lectura cuando se consulta muy seguido ' +
             'y se acepta cierto desfase.' },

        { p: '¿Cómo tratás a un proveedor externo desde este punto de vista?',
          r: 'Como <b>un contexto que no controlás</b>, con su propio vocabulario. Su webhook habla de <code>payment_intent</code> y ' +
             '<code>charge</code>; mi sistema habla de "cobro de cuota". La traducción va en un <b>adaptador, en el borde</b>: ' +
             'si dejo entrar su vocabulario, termina en el medio de mis reglas de negocio y quedo atado a ese proveedor sin haberlo decidido.' },
      ],

      practica: `
<h4>La puerta de cada contexto</h4>
<pre><code>// funcionalidades/ventas/index.ts — lo ÚNICO importable desde afuera
export type { ClienteResumen } from './tipos-publicos';
export { clientePorId, marcarComoGanado } from './servicio';

// tipos-publicos.ts — la forma que ven los demás, no la interna
export interface ClienteResumen {
  id: string;
  nombre: string;
  // ← nada de 'etapa', 'valorEstimado' ni el resto: es interno de ventas
}</code></pre>

<div class="aviso"><strong>Separar el tipo público del interno es lo que evita el acoplamiento
silencioso.</strong> Si facturación puede ver <code>etapa</code>, en tres meses va a haber una regla de
facturación que depende del embudo de ventas — y el límite entre contextos habrá desaparecido sin que nadie lo
decidiera.</div>

<h4>Hacer que la regla se verifique sola</h4>
<pre><code>// eslint.config.js
{
  files: ['src/funcionalidades/facturacion/**'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['@/funcionalidades/ventas/*', '!@/funcionalidades/ventas'],
        message: 'Importá solo desde el index de ventas, no sus archivos internos.',
      }],
    }],
  },
}</code></pre>

<h4>Copia deliberada, con nombre que lo explique</h4>
<pre><code>-- La factura conserva los datos AL MOMENTO DE EMITIR.
-- No es duplicación: es el registro histórico.
create table facturas (
  id uuid primary key,
  cliente_id uuid not null,              -- referencia al otro contexto
  cliente_razon_social text not null,    -- copia deliberada
  cliente_cuit text not null,            -- copia deliberada
  emitida_en timestamptz not null,
  …
);</code></pre>

<div class="dato"><strong>Sin esa copia, reimprimir una factura de hace dos años mostraría la razón social
actual del cliente</strong> — lo cual, además de estar mal, puede ser un problema legal. Es el caso más claro
de que "no repitas datos" no es una regla universal.</div>

<h4>Comunicación por evento</h4>
<pre><code>// ventas emite; no sabe quién escucha
await emitir('cliente.ganado', { clienteId, nombre, monto });

// facturación reacciona, y traduce a SU modelo
alOcurrir('cliente.ganado', async ({ clienteId, nombre }) =&gt; {
  await facturacion.crearCuentaCorriente({ clienteId, razonSocial: nombre });
});</code></pre>

<h4>Descubrir los contextos de tu proyecto</h4>
<table>
<tr><th>#</th><th>Paso</th></tr>
<tr><td>1</td><td>Listar las palabras clave del negocio</td></tr>
<tr><td>2</td><td>Marcar las que significan cosas distintas según quién hable</td></tr>
<tr><td>3</td><td>Agrupar por área que pide los cambios</td></tr>
<tr><td>4</td><td>Verificar: ¿puedo describir un grupo sin mencionar el otro?</td></tr>
<tr><td>5</td><td>Si sí, es un contexto. Dibujar cómo se comunican</td></tr>
</table>
`,

      errores: [
        { mito: 'Una entidad "cliente" para toda la empresa es lo más limpio.',
          realidad: 'Termina con cuarenta columnas donde cada área usa ocho, y con cambios de facturación que rompen envíos. ' +
                    'Tres modelos que <b>comparten el identificador</b> es más simple, no más complejo.' },

        { mito: 'Separar contextos significa separar servicios.',
          realidad: 'En un monolito modular son <b>carpetas con una puerta de adelante</b>. Lo que define el límite no es el despliegue: ' +
                    'es que un contexto nunca importe tipos internos de otro.' },

        { mito: 'Guardar el nombre del cliente en la factura es duplicar datos.',
          realidad: 'Es <b>parte del registro histórico</b>: la factura debe mostrar los datos que tenía al emitirse. Sin esa copia, reimprimir una ' +
                    'factura vieja mostraría datos actuales, lo cual puede ser un problema legal.' },

        { mito: 'Puedo dejar entrar el vocabulario del proveedor externo, total es solo un nombre.',
          realidad: 'Ese vocabulario termina en el medio de tus reglas de negocio y te ata al proveedor sin haberlo decidido. ' +
                    'La traducción va en un adaptador, <b>en el borde</b>.' },
      ],

      glosario: [
        { t: 'Bounded context', d: 'Límite dentro del cual una palabra tiene un solo significado.' },
        { t: 'Mapa de contextos', d: 'Diagrama de qué contextos existen y cómo se comunican.' },
        { t: 'Tipo público', d: 'La forma que un contexto expone hacia afuera, distinta de la interna.' },
        { t: 'Copia deliberada', d: 'Dato replicado a propósito porque es parte del registro histórico.' },
        { t: 'Contexto ajeno', d: 'Sistema externo con vocabulario propio que hay que traducir en el borde.' },
        { t: 'Puerta de adelante', d: 'Índice que define qué es importable de un contexto.' },
        { t: 'Modelo monstruoso', d: 'Entidad que acumula los campos de todas las áreas.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Entidades, objetos de valor y agregados',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> algunas cosas del dominio <b>tienen identidad</b>
y otras <b>son un valor</b>; distinguirlas cambia cómo las guardás, las comparás y las modificás.</div>

<h4>Entidad: tiene identidad</h4>
<p>Un alumno sigue siendo el mismo alumno aunque cambie de nombre, de dirección y de curso. Lo que lo hace
"ese" alumno es su <b>identidad</b>, no sus datos.</p>
<pre><code>Alumno { id: 'a-123', nombre: 'Ana Pérez', curso: '3B' }
// cambia el nombre → sigue siendo el mismo alumno</code></pre>

<h4>Objeto de valor: es lo que contiene</h4>
<p>Un dinero de $1.500 es intercambiable con cualquier otro $1.500. No tiene identidad: <b>es</b> su valor.</p>
<pre><code>Dinero { monto: 150000, moneda: 'ARS' }
Direccion { calle, numero, ciudad, cp }
Periodo { '2026-08' }
// dos objetos con los mismos datos son EL MISMO valor</code></pre>

<div class="aviso"><strong>La consecuencia práctica es que los objetos de valor deben ser
inmutables.</strong> Si "cambiás" una dirección, en realidad la <b>reemplazás</b> por otra. Tratarlos como
mutables produce el bug clásico: modificás la dirección de un pedido y sin querer cambiás también la del
cliente, porque los dos apuntaban al mismo objeto.</div>

<h4>Agregado: un grupo con un responsable</h4>
<p>Un pedido y sus ítems no tienen sentido por separado: un ítem suelto no existe. El <b>agregado</b> es ese
grupo, y el <b>pedido</b> es su raíz: todo lo que quiera tocar un ítem pasa por el pedido.</p>
<pre><code>Pedido (raíz)
  ├─ Item
  ├─ Item
  └─ Descuento

// ✔  pedido.agregarItem(producto, cantidad)  ← la raíz valida
// ❌  item.cantidad = 5                       ← saltea la validación</code></pre>

<h4>Por qué importa</h4>
<p>Porque hay reglas que <b>solo se pueden verificar viendo el grupo completo</b>: "un pedido no puede superar
el límite de crédito del cliente" necesita ver todos los ítems. Si cada ítem se puede modificar por su cuenta,
esa regla no se puede garantizar en ningún lado.</p>
`,

      tecnico: `
<h4>Objetos de valor: inmutables, con validación al crear</h4>
<pre><code>export class Dinero {
  private constructor(readonly centavos: number, readonly moneda: Moneda) {}

  static de(centavos: number, moneda: Moneda): Dinero {
    if (!Number.isInteger(centavos)) throw new MontoInvalido('debe ser entero');
    if (centavos &lt; 0) throw new MontoInvalido('no puede ser negativo');
    return new Dinero(centavos, moneda);
  }

  mas(otro: Dinero): Dinero {
    if (otro.moneda !== this.moneda) throw new MonedasIncompatibles();
    return Dinero.de(this.centavos + otro.centavos, this.moneda);   // devuelve OTRO
  }

  igualA(otro: Dinero) { return this.centavos === otro.centavos &amp;&amp; this.moneda === otro.moneda; }
}</code></pre>

<div class="dato"><strong>Dos detalles hacen todo el trabajo.</strong> El constructor <b>privado</b> con
fábrica estática garantiza que <b>no existe un <code>Dinero</code> inválido</b> en ningún lugar del sistema:
si tenés uno en la mano, es válido. Y la comparación por <code>igualA</code> en vez de <code>===</code> refleja
que son valores: dos billetes de $1.500 son el mismo valor aunque sean objetos distintos.</div>

<h4>Agregado: la raíz protege las reglas</h4>
<pre><code>export class Pedido {
  private constructor(
    readonly id: IdPedido,
    readonly clienteId: IdCliente,
    private _items: Item[],
    private _estado: EstadoPedido,
  ) {}

  get items(): readonly Item[] { return this._items; }   // ← copia de solo lectura
  get total(): Dinero { return this._items.reduce((a, i) =&gt; a.mas(i.subtotal), Dinero.cero()); }

  agregarItem(producto: Producto, cantidad: number, limiteCredito: Dinero) {
    if (this._estado !== 'borrador') throw new PedidoNoModificable(this._estado);
    if (cantidad &lt;= 0) throw new CantidadInvalida();

    const nuevoTotal = this.total.mas(Dinero.de(producto.precio * cantidad, 'ARS'));
    if (nuevoTotal.mayorQue(limiteCredito)) throw new LimiteDeCreditoExcedido();
    // ↑ esta regla NECESITA ver el agregado completo

    this._items.push(Item.de(producto, cantidad));
  }
}</code></pre>

<div class="dato"><strong>El <code>readonly Item[]</code> del getter es lo que hace cumplir la regla.</strong>
Sin él, cualquiera puede hacer <code>pedido.items.push(...)</code> y saltear toda la validación — y el
agregado queda como una sugerencia. Es la diferencia entre "el modelo tiene reglas" y "el modelo <b>garantiza</b>
reglas".</div>

<h4>Cuán grande debe ser un agregado</h4>
<table>
<tr><th>Regla</th><th>Motivo</th></tr>
<tr><td>Lo más chico posible</td><td>Un agregado grande se convierte en un cuello de contención</td></tr>
<tr><td>Solo lo que debe cambiar junto de forma atómica</td><td>Ese es el criterio real</td></tr>
<tr><td>Entre agregados, solo el identificador</td><td>Evita cargar medio sistema para una operación</td></tr>
<tr><td>Un agregado = una transacción</td><td>Si necesitás dos, hay eventos o compensación de por medio</td></tr>
</table>

<div class="dato"><strong>El error típico es hacer el agregado demasiado grande:</strong> "cliente" con todos
sus pedidos, sus facturas y sus tickets. Cargar eso para cambiar un teléfono es absurdo, y dos operaciones
simultáneas sobre pedidos distintos <b>del mismo cliente</b> compiten entre sí. <b>Cliente y pedido son
agregados distintos que se relacionan por identificador.</b></div>

<h4>Cuánto de esto usar en la práctica</h4>
<p>La versión completa con clases, constructores privados y métodos es apropiada para reglas complejas. En un
CRUD normal, se puede quedar con la parte que rinde:</p>
<pre><code>· Objetos de valor  → sí, incluso como funciones puras sobre tipos simples
· Agregados         → sí como CONCEPTO: una función que valida el grupo entero
· Clases con estado → solo si las reglas lo justifican</code></pre>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    ENTIDAD vs OBJETO DE VALOR</text>

  <rect x="24" y="34" width="304" height="106" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="176" y="56" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">ENTIDAD — tiene identidad</text>
  <text x="44" y="78" fill="currentColor" opacity=".7" font-size="10" font-family="monospace">Alumno { id: 'a-123', nombre: 'Ana' }</text>
  <text x="44" y="98" fill="currentColor" opacity=".7" font-size="10.5">cambia el nombre → sigue siendo el mismo</text>
  <text x="44" y="118" fill="#22d3ee" font-size="10.5" font-weight="700">se compara por ID</text>
  <text x="44" y="134" fill="currentColor" opacity=".55" font-size="9.5">Alumno · Pedido · Factura</text>

  <rect x="352" y="34" width="304" height="106" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="56" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">OBJETO DE VALOR — ES su contenido</text>
  <text x="372" y="78" fill="currentColor" opacity=".7" font-size="10" font-family="monospace">Dinero { 150000, 'ARS' }</text>
  <text x="372" y="98" fill="currentColor" opacity=".7" font-size="10.5">dos con los mismos datos son EL MISMO</text>
  <text x="372" y="118" fill="#34d399" font-size="10.5" font-weight="700">INMUTABLE · se compara por valor</text>
  <text x="372" y="134" fill="currentColor" opacity=".55" font-size="9.5">Dinero · Dirección · Período · Email</text>

  <rect x="24" y="150" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="171" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    Si los tratás como mutables: cambiás la dirección de un pedido y sin querer cambiás la del cliente. Apuntaban al mismo objeto.</text>

  <line x1="24" y1="204" x2="656" y2="204" stroke="currentColor" opacity=".18"/>

  <text x="24" y="228" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    AGREGADO — un grupo con una raíz que protege las reglas</text>

  <rect x="24" y="240" width="290" height="110" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.5"/>
  <rect x="44" y="252" width="250" height="26" rx="6" fill="#7c5cff" fill-opacity=".3" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="169" y="269" text-anchor="middle" fill="#7c5cff" font-size="10" font-weight="700">Pedido (raíz)</text>
  <rect x="70" y="284" width="200" height="18" rx="4" fill="#7c5cff" fill-opacity=".16"/>
  <text x="170" y="297" text-anchor="middle" fill="currentColor" opacity=".65" font-size="8.5">Item</text>
  <rect x="70" y="306" width="200" height="18" rx="4" fill="#7c5cff" fill-opacity=".16"/>
  <text x="170" y="319" text-anchor="middle" fill="currentColor" opacity=".65" font-size="8.5">Item</text>
  <rect x="70" y="328" width="200" height="18" rx="4" fill="#7c5cff" fill-opacity=".16"/>
  <text x="170" y="341" text-anchor="middle" fill="currentColor" opacity=".65" font-size="8.5">Descuento</text>

  <rect x="330" y="240" width="326" height="110" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="493" y="260" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">POR QUÉ IMPORTA</text>
  <text x="350" y="282" fill="currentColor" opacity=".72" font-size="10.5">Hay reglas que solo se verifican viendo el grupo:</text>
  <text x="350" y="300" fill="#34d399" font-size="10.5" font-weight="700">“no superar el límite de crédito del cliente”</text>
  <text x="350" y="318" fill="currentColor" opacity=".72" font-size="10.5">necesita ver TODOS los ítems.</text>
  <text x="350" y="340" fill="#f87171" font-size="10.5" font-weight="700">Si cada ítem se modifica solo, esa regla no vive en ningún lado.</text>

  <rect x="24" y="358" width="632" height="28" rx="7" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="377" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    Error típico: agregado gigante. “Cliente con todos sus pedidos y facturas” es un cuello de contención — son agregados distintos.</text>
</svg>`,
        pie: 'Un agregado tan chico como se pueda: solo lo que debe cambiar junto de forma atómica.',
      },

      entrevista: [
        { p: '¿Cuál es la diferencia entre una entidad y un objeto de valor?',
          r: 'Una <b>entidad</b> tiene identidad: un alumno sigue siendo el mismo aunque cambie de nombre, curso y dirección; se compara por ' +
             'identificador. Un <b>objeto de valor</b> <i>es</i> su contenido: dos objetos con los mismos datos son el mismo valor, y se comparan por ' +
             'valor. La consecuencia práctica es que los objetos de valor deben ser <b>inmutables</b>: si "cambiás" una dirección, en realidad la ' +
             'reemplazás. Tratarlos como mutables produce el bug clásico de cambiar la dirección de un pedido y alterar sin querer la del cliente.' },

        { p: '¿Qué es un agregado y para qué sirve?',
          r: 'Un grupo de objetos que cambian juntos, con una <b>raíz</b> por la que pasa toda modificación. Sirve porque hay reglas que ' +
             '<b>solo se pueden verificar viendo el grupo completo</b>: "un pedido no puede superar el límite de crédito" necesita ver todos los ítems. ' +
             'Si cada ítem se puede modificar por su cuenta, esa regla no se puede garantizar en ningún lado. ' +
             'Y el detalle que lo hace real es exponer los hijos como <b>solo lectura</b>: si alguien puede hacer <code>items.push()</code>, ' +
             'el agregado es una sugerencia, no una garantía.' },

        { p: '¿Cuán grande debe ser un agregado?',
          r: '<b>Lo más chico posible</b>: solo lo que debe cambiar junto de forma atómica. El error típico es hacerlo enorme — "cliente con todos sus ' +
             'pedidos, facturas y tickets"— y ahí cargar todo para cambiar un teléfono es absurdo, y dos operaciones sobre pedidos distintos ' +
             '<b>del mismo cliente</b> compiten entre sí. Cliente y pedido son agregados distintos que se relacionan por identificador. ' +
             'La regla práctica: <b>un agregado, una transacción</b>; si necesitás dos, hay eventos o compensación de por medio.' },

        { p: '¿Cuánto de esto aplicarías en un proyecto normal?',
          r: 'Los <b>objetos de valor</b> sí, siempre — y no hace falta clases: alcanzan funciones puras sobre tipos simples, con una fábrica que ' +
             'valide. El <b>agregado como concepto</b> también: una función que valide el grupo entero antes de escribir. ' +
             'Lo que dejaría para cuando las reglas lo justifiquen son las <b>clases con estado y constructores privados</b>: ' +
             'en un CRUD agregan ceremonia sin proteger nada que no proteja ya una validación en la Server Action.' },
      ],

      practica: `
<h4>Objeto de valor sin clases</h4>
<pre><code>// Alcanza con un tipo, una fábrica que valida y funciones puras
export type Dinero = { readonly centavos: number; readonly moneda: 'ARS' | 'USD' };

export function dinero(centavos: number, moneda: Dinero['moneda']): Dinero {
  if (!Number.isInteger(centavos)) throw new MontoInvalido('debe ser entero');
  if (centavos &lt; 0) throw new MontoInvalido('no puede ser negativo');
  return Object.freeze({ centavos, moneda });
}

export const sumar = (a: Dinero, b: Dinero): Dinero =&gt; {
  if (a.moneda !== b.moneda) throw new MonedasIncompatibles();
  return dinero(a.centavos + b.centavos, a.moneda);
};

export const formatear = (d: Dinero) =&gt;
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: d.moneda })
    .format(d.centavos / 100);</code></pre>

<div class="aviso"><strong>Los centavos como entero no son un detalle de implementación: son la decisión que
evita una clase entera de bugs.</strong> Con decimales, sumar tres precios y comparar con un total da
diferencias de un centavo que aparecen recién cuando alguien concilia. Y cambiarlo después es carísimo, porque
ya hay datos escritos con la forma vieja.</div>

<h4>Agregado como función de validación</h4>
<pre><code>// Sin clases: la validación del grupo completo, en un solo lugar
export function validarPedido(pedido: Pedido, cliente: Cliente): void {
  if (pedido.items.length === 0) throw new PedidoVacio();
  if (pedido.items.some((i) =&gt; i.cantidad &lt;= 0)) throw new CantidadInvalida();

  const total = pedido.items.reduce((a, i) =&gt; sumar(a, i.subtotal), dinero(0, 'ARS'));
  if (total.centavos &gt; cliente.limiteCredito.centavos) throw new LimiteExcedido();
}

// La Server Action llama a esto ANTES de escribir
export async function accionGuardarPedido(datos: NuevoPedido) {
  const cliente = await clientes.porId(datos.clienteId);
  validarPedido(aPedido(datos), cliente);        // ← el agregado, verificado
  await pedidos.guardar(datos);
}</code></pre>

<h4>Cuando sí conviene la clase</h4>
<pre><code>// Si hay muchas transiciones con reglas, la clase gana claridad
export class Pedido {
  private constructor(private estado: EstadoPedido, private _items: Item[]) {}

  get items(): readonly Item[] { return this._items; }   // ← sin esto, no hay garantía

  confirmar() {
    if (this.estado !== 'borrador') throw new TransicionInvalida(this.estado, 'confirmado');
    if (this._items.length === 0) throw new PedidoVacio();
    this.estado = 'confirmado';
  }
}</code></pre>

<h4>Cómo elegir</h4>
<table>
<tr><th>Si…</th><th>Usá</th></tr>
<tr><td>Un valor con validación (dinero, email, período)</td><td>Tipo + fábrica que valida</td></tr>
<tr><td>Un grupo con una regla que abarca todo</td><td>Función de validación del grupo</td></tr>
<tr><td>Muchas transiciones de estado con reglas</td><td>Clase con métodos</td></tr>
<tr><td>CRUD sin reglas propias</td><td>Nada de esto: validación en la acción</td></tr>
</table>
`,

      errores: [
        { mito: 'Los objetos de valor pueden ser mutables si tengo cuidado.',
          realidad: 'El bug clásico aparece igual: dos entidades comparten el mismo objeto, cambiás uno y se altera el otro. ' +
                    'Con <code>Object.freeze</code> y funciones que devuelven copias, ese error es imposible.' },

        { mito: 'Un agregado grande simplifica: cargo todo de una.',
          realidad: 'Se convierte en un <b>cuello de contención</b>: cargás medio sistema para cambiar un teléfono, y dos operaciones sobre pedidos ' +
                    'distintos del mismo cliente compiten. Lo más chico que cumpla la regla atómica.' },

        { mito: 'Con exponer los hijos como array ya está protegido.',
          realidad: 'Sin <code>readonly</code>, cualquiera hace <code>pedido.items.push(...)</code> y saltea toda la validación. ' +
                    'Ahí el agregado es una sugerencia, no una garantía.' },

        { mito: 'DDD requiere clases con constructores privados.',
          realidad: 'Es una forma, no la única. Un tipo con una fábrica que valida y funciones puras da el mismo beneficio con mucha menos ceremonia, ' +
                    'y en un CRUD las clases con estado no protegen nada que no proteja una validación en la acción.' },
      ],

      glosario: [
        { t: 'Entidad', d: 'Objeto del dominio con identidad propia, que persiste aunque cambien sus datos.' },
        { t: 'Objeto de valor', d: 'Objeto definido por su contenido. Inmutable y comparado por valor.' },
        { t: 'Agregado', d: 'Grupo de objetos que cambian juntos, con una raíz que protege las reglas.' },
        { t: 'Raíz de agregado', d: 'Entidad por la que pasa toda modificación del grupo.' },
        { t: 'Invariante', d: 'Regla que siempre debe cumplirse dentro de un agregado.' },
        { t: 'Fábrica validadora', d: 'Función que crea un valor solo si es válido, así no existen inválidos.' },
        { t: 'Inmutabilidad', d: 'Que un objeto no cambie: las operaciones devuelven uno nuevo.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'DDD sin dogma: qué usar y qué dejar',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> DDD tiene dos mitades — una <b>estratégica</b>
que sirve casi siempre y es barata, y una <b>táctica</b> que solo se paga con reglas complejas.</div>

<h4>La mitad que sirve casi siempre</h4>
<table>
<tr><th>Práctica</th><th>Costo</th><th>Valor</th></tr>
<tr><td><b>Lenguaje ubicuo</b></td><td>Casi cero</td><td>Muy alto</td></tr>
<tr><td><b>Glosario con definiciones acordadas</b></td><td>Una reunión</td><td>Muy alto</td></tr>
<tr><td><b>Bounded contexts</b></td><td>Organización de carpetas</td><td>Alto</td></tr>
<tr><td><b>Objetos de valor</b></td><td>Bajo</td><td>Alto</td></tr>
</table>

<h4>La mitad que hay que evaluar</h4>
<table>
<tr><th>Práctica</th><th>Cuándo</th></tr>
<tr><td>Agregados con raíz y clases</td><td>Con reglas que abarcan varios objetos</td></tr>
<tr><td>Repositorios por agregado</td><td>Con agregados de verdad</td></tr>
<tr><td>Servicios de dominio</td><td>Con lógica que no pertenece a ninguna entidad</td></tr>
<tr><td>Eventos de dominio</td><td>Con varios contextos que reaccionan</td></tr>
<tr><td><b>Event sourcing</b></td><td><b>Casi nunca.</b> Auditoría legal o financiera</td></tr>
<tr><td><b>CQRS completo</b></td><td><b>Casi nunca.</b> Lecturas y escrituras con escalas muy distintas</td></tr>
</table>

<div class="aviso"><strong>Las dos últimas filas merecen la advertencia más fuerte del módulo.</strong>
<i>Event sourcing</i> y CQRS completo son de las decisiones más difíciles de revertir que existen: cambian
<b>cómo se guardan los datos</b>, así que volver atrás es una migración total. Se adoptan por un requisito
concreto y escrito —"necesitamos reconstruir el estado de cualquier momento por obligación legal"— nunca
"porque es más escalable".</div>

<h4>La secuencia recomendada</h4>
<pre><code>1 · Lenguaje ubicuo + glosario        ← empezá acá, siempre
2 · Contextos como carpetas            ← cuando aparezcan palabras ambiguas
3 · Objetos de valor                   ← desde el principio, son baratos
4 · Agregados                          ← cuando una regla abarque varios objetos
5 · Eventos                            ← cuando varios contextos reaccionen
6 · Lo demás                           ← solo con un requisito que lo pida</code></pre>
`,

      tecnico: `
<h4>Señales de que estás sobre-aplicando DDD</h4>
<ul>
<li>Hay más archivos de infraestructura de DDD que de reglas de negocio.</li>
<li>Una operación simple pasa por seis clases.</li>
<li>Hay repositorios para entidades que <b>solo se leen</b>.</li>
<li>Hay eventos de dominio con un solo suscriptor que podría ser una llamada.</li>
<li>Alguien nuevo tarda dos días en entender dónde va un cambio de una línea.</li>
</ul>

<div class="dato"><strong>La señal más honesta es la última.</strong> Una arquitectura existe para que los
cambios sean más fáciles. Si un desarrollador con experiencia no puede ubicar dónde va un cambio trivial, ' +
la estructura <b>está cobrando más de lo que devuelve</b>, por muy correcta que sea en el papel.</div>

<h4>Servicios de dominio: cuándo existen de verdad</h4>
<p>Un servicio de dominio es lógica que <b>no pertenece naturalmente a ninguna entidad</b>. El ejemplo válido
es una operación entre dos agregados:</p>
<pre><code>// No es responsabilidad de Cuenta ni de la otra Cuenta: es de la operación
export function transferir(origen: Cuenta, destino: Cuenta, monto: Dinero) {
  if (!origen.puedeDebitar(monto)) throw new SaldoInsuficiente();
  return { origen: origen.debitar(monto), destino: destino.acreditar(monto) };
}</code></pre>

<div class="dato"><strong>El abuso consiste en meter en "servicios" lógica que sí pertenece a una
entidad.</strong> Si terminás con entidades que son solo bolsas de datos y todos los servicios manipulándolas
desde afuera, volviste al modelo anémico — que es exactamente lo que DDD intenta evitar, ahora con más
carpetas.</div>

<h4>Eventos de dominio vs eventos de integración</h4>
<table>
<tr><th></th><th>De dominio</th><th>De integración</th></tr>
<tr><td>Dónde ocurre</td><td>Dentro del mismo proceso</td><td>Entre servicios o contextos</td></tr>
<tr><td>Cuándo se emite</td><td>Al aplicar un cambio</td><td>Después de confirmar la transacción</td></tr>
<tr><td>Transporte</td><td>Memoria</td><td>Cola persistente</td></tr>
<tr><td>Contenido</td><td>Puede ser rico</td><td>Mínimo y estable: es un contrato</td></tr>
</table>

<div class="dato"><strong>El error de mezclarlos tiene una consecuencia concreta:</strong> si emitís un evento
<b>antes</b> de que la transacción se confirme y esa transacción falla, ya notificaste algo que nunca pasó — ' +
un email de "pedido confirmado" de un pedido que no existe. <b>Los eventos que salen del proceso se emiten
después del commit</b>, siempre.</div>

<h4>Aplicado a un proyecto del workspace</h4>
<pre><code>Gestiapp — qué aplicar

✔ Lenguaje ubicuo    alumno, cuota, período, moroso, condonar
                     (y el glosario con las definiciones acordadas)
✔ Contextos          académico · cobranzas · comunicaciones
✔ Objetos de valor   Dinero (centavos), Período, CUIT
✔ Agregado           Alumno + sus cuotas del ciclo, cuando la regla
                     de morosidad las abarca

✘ Event sourcing     no hay requisito legal de reconstruir estados
✘ CQRS completo      las lecturas y escrituras tienen escala similar
✘ Clases con estado  el CRUD no las justifica; validación en la acción alcanza</code></pre>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    DDD TIENE DOS MITADES CON PRECIOS MUY DISTINTOS</text>

  <rect x="24" y="34" width="304" height="130" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.6"/>
  <text x="176" y="56" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">ESTRATÉGICA — barata y sirve casi siempre</text>
  <text x="44" y="80" fill="#34d399" font-size="10.5" font-weight="700">✔ lenguaje ubicuo</text>
  <text x="230" y="80" fill="currentColor" opacity=".55" font-size="9.5">costo ~0</text>
  <text x="44" y="100" fill="#34d399" font-size="10.5" font-weight="700">✔ glosario acordado</text>
  <text x="230" y="100" fill="currentColor" opacity=".55" font-size="9.5">una reunión</text>
  <text x="44" y="120" fill="#34d399" font-size="10.5" font-weight="700">✔ bounded contexts</text>
  <text x="230" y="120" fill="currentColor" opacity=".55" font-size="9.5">carpetas</text>
  <text x="44" y="140" fill="#34d399" font-size="10.5" font-weight="700">✔ objetos de valor</text>
  <text x="230" y="140" fill="currentColor" opacity=".55" font-size="9.5">bajo</text>
  <text x="176" y="158" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">EMPEZÁ ACÁ, SIEMPRE</text>

  <rect x="352" y="34" width="304" height="130" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="504" y="56" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">TÁCTICA — evaluá caso por caso</text>
  <text x="372" y="80" fill="currentColor" opacity=".72" font-size="10.5">· agregados con raíz</text>
  <text x="560" y="80" fill="currentColor" opacity=".55" font-size="9">reglas que abarcan</text>
  <text x="372" y="100" fill="currentColor" opacity=".72" font-size="10.5">· repositorios por agregado</text>
  <text x="372" y="120" fill="currentColor" opacity=".72" font-size="10.5">· servicios de dominio</text>
  <text x="372" y="140" fill="currentColor" opacity=".72" font-size="10.5">· eventos de dominio</text>
  <text x="504" y="158" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">solo con un problema que lo pida</text>

  <rect x="24" y="176" width="632" height="58" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.8"/>
  <text x="44" y="198" fill="#f87171" font-size="12" font-weight="700">EVENT SOURCING Y CQRS COMPLETO — casi nunca</text>
  <text x="44" y="218" fill="currentColor" opacity=".78" font-size="11">
    Cambian <tspan font-weight="700">cómo se guardan los datos</tspan>: volver atrás es una migración total. De las decisiones menos reversibles que existen.</text>
  <text x="44" y="232" fill="#f87171" font-size="10.5" font-weight="700">
    Se adoptan por un requisito escrito (“reconstruir el estado de cualquier momento por obligación legal”), nunca por “es más escalable”.</text>

  <text x="24" y="260" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    SEÑALES DE QUE TE PASASTE</text>

  <rect x="24" y="272" width="304" height="112" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="294" fill="currentColor" opacity=".72" font-size="10.5">· más archivos de andamiaje que de reglas</text>
  <text x="44" y="314" fill="currentColor" opacity=".72" font-size="10.5">· una operación simple pasa por 6 clases</text>
  <text x="44" y="334" fill="currentColor" opacity=".72" font-size="10.5">· repositorios de entidades que solo se leen</text>
  <text x="44" y="354" fill="currentColor" opacity=".72" font-size="10.5">· eventos con un solo suscriptor</text>
  <text x="44" y="376" fill="#f87171" font-size="10.5" font-weight="700">· alguien tarda 2 días en ubicar un cambio de 1 línea</text>

  <rect x="352" y="272" width="304" height="112" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="504" y="294" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">LA SEÑAL MÁS HONESTA</text>
  <text x="372" y="318" fill="currentColor" opacity=".75" font-size="11">Una arquitectura existe para que los cambios</text>
  <text x="372" y="334" fill="currentColor" opacity=".75" font-size="11">sean más fáciles.</text>
  <text x="372" y="356" fill="#7c5cff" font-size="11" font-weight="700">Si alguien con experiencia no puede ubicar</text>
  <text x="372" y="372" fill="#7c5cff" font-size="11" font-weight="700">un cambio trivial, cobra más de lo que devuelve.</text>
</svg>`,
        pie: 'Empezá por el lenguaje. Todo lo demás se justifica con un problema concreto.',
      },

      entrevista: [
        { p: '¿Qué partes de DDD aplicarías en cualquier proyecto?',
          r: 'La mitad <b>estratégica</b>, que es barata y rinde casi siempre: <b>lenguaje ubicuo</b> con un glosario de definiciones acordadas, ' +
             '<b>bounded contexts</b> —que en un monolito modular son carpetas con una puerta de adelante— y <b>objetos de valor</b>. ' +
             'Las tres cuestan poco y ordenan mucho. La mitad <b>táctica</b> —agregados con raíz, repositorios por agregado, servicios de dominio— ' +
             'la evalúo caso por caso, según si hay reglas que la justifiquen.' },

        { p: '¿Por qué event sourcing y CQRS completo casi nunca?',
          r: 'Porque cambian <b>cómo se guardan los datos</b>, así que son de las decisiones <b>menos reversibles</b> que existen: volver atrás es una ' +
             'migración total. Se justifican con un requisito concreto y escrito —"necesitamos poder reconstruir el estado de cualquier momento por ' +
             'obligación legal", o "las lecturas tienen tres órdenes de magnitud más de escala que las escrituras"— y nunca con ' +
             '"porque es más escalable". Adoptarlos sin ese requisito es cambiar un problema conocido por uno peor y permanente.' },

        { p: '¿Cuál es la señal más honesta de que te pasaste de arquitectura?',
          r: 'Que alguien con experiencia <b>tarde dos días en ubicar dónde va un cambio de una línea</b>. Una arquitectura existe para que los cambios ' +
             'sean más fáciles; si no lo logra, está cobrando más de lo que devuelve, por muy correcta que sea en el papel. ' +
             'Las otras señales van en la misma dirección: más archivos de andamiaje que de reglas, operaciones simples pasando por seis clases, ' +
             'repositorios para entidades que solo se leen, eventos con un solo suscriptor.' },

        { p: '¿Qué diferencia hay entre un evento de dominio y uno de integración?',
          r: 'El de <b>dominio</b> ocurre dentro del proceso, al aplicar un cambio, y puede llevar información rica. El de <b>integración</b> sale hacia ' +
             'otros contextos o servicios, viaja por una cola persistente y debe ser <b>mínimo y estable</b>, porque es un contrato. ' +
             'Y hay una regla de orden que importa: los que salen del proceso se emiten <b>después de confirmar la transacción</b>. ' +
             'Si emitís antes y la transacción falla, ya notificaste algo que nunca pasó — un email de "pedido confirmado" de un pedido que no existe.' },
      ],

      practica: `
<h4>Auditar cuánto DDD tiene sentido en tu proyecto</h4>
<pre><code>Respondé con sí o no:

1 · ¿Hay palabras del negocio que significan cosas distintas
    según quién hable?                                    → contextos
2 · ¿Hay reglas que involucran varios objetos a la vez?    → agregados
3 · ¿Hay conceptos con validación propia (dinero, CUIT)?   → obj. de valor
4 · ¿Hay áreas que reaccionan a lo que pasa en otras?      → eventos
5 · ¿Alguien pide reconstruir el estado de una fecha
    pasada por obligación legal?                          → event sourcing
6 · ¿Las lecturas tienen escala MUY distinta a las
    escrituras (3 órdenes de magnitud)?                    → CQRS

Si 5 y 6 son "no" —lo habitual— no los adoptes.</code></pre>

<h4>Evento de integración, después del commit</h4>
<pre><code>export async function confirmarPedido(id: string) {
  // 1 · transacción: si algo falla, no queda nada hecho
  const pedido = await enTransaccion(async (tx) =&gt; {
    const p = await repo.conTx(tx).porId(id);
    const confirmado = confirmar(p, new Date());
    await repo.conTx(tx).guardar(confirmado);
    await stock.conTx(tx).descontar(confirmado.items);
    return confirmado;
  });

  // 2 · recién ahora, con el commit hecho, se avisa afuera
  await inngest.send({ name: 'pedido/confirmado', data: { id: pedido.id } });
  return pedido;
}</code></pre>

<div class="aviso"><strong>Si esas dos líneas están al revés</strong> —evento primero, transacción después— y
la transacción falla, ya se disparó un email de "pedido confirmado" de un pedido que no existe. Es un error de
tres caracteres de distancia con consecuencias visibles para el cliente.</div>

<h4>Contexto, en un monolito modular</h4>
<pre><code>funcionalidades/
  academico/
    tipos.ts             Alumno (visión académica: curso, asistencia)
    servicio.ts
    index.ts
  cobranzas/
    tipos.ts             Alumno (visión de cobranzas: cuotas, deuda)
    reglas.ts            esMoroso(), estaVencida()
    servicio.ts
    index.ts
  comunicaciones/
    …

// cobranzas NO importa @/funcionalidades/academico/tipos
// pide por el index y recibe la forma pública</code></pre>

<h4>Qué adoptar, en orden</h4>
<table>
<tr><th>#</th><th>Práctica</th><th>Cuándo</th></tr>
<tr><td>1</td><td>Glosario del dominio</td><td>Ya. Es una reunión</td></tr>
<tr><td>2</td><td>Renombrar al lenguaje del negocio</td><td>Progresivo, por funcionalidad</td></tr>
<tr><td>3</td><td>Objetos de valor para dinero y fechas de negocio</td><td>Al tocar esa parte</td></tr>
<tr><td>4</td><td>Contextos como carpetas con puerta</td><td>Cuando aparezca la palabra ambigua</td></tr>
<tr><td>5</td><td>Agregados</td><td>Cuando una regla abarque varios objetos</td></tr>
<tr><td>6</td><td>Eventos entre contextos</td><td>Cuando haya más de un interesado</td></tr>
</table>
`,

      errores: [
        { mito: 'DDD es todo o nada.',
          realidad: 'La mitad <b>estratégica</b> —lenguaje, glosario, contextos, objetos de valor— es barata y sirve casi siempre. ' +
                    'La táctica se evalúa caso por caso. Adoptar solo la primera ya cambia mucho.' },

        { mito: 'Event sourcing me da auditoría gratis, así que conviene.',
          realidad: 'Cambia <b>cómo se guardan los datos</b>: es de las decisiones menos reversibles que existen. Si lo que necesitás es auditoría, ' +
                    'una tabla de historial cuesta muchísimo menos y resuelve el 90% de los casos.' },

        { mito: 'Muevo la lógica a servicios de dominio para que las entidades queden limpias.',
          realidad: 'Eso es el <b>modelo anémico</b> que DDD intenta evitar: entidades que son bolsas de datos y servicios manipulándolas desde afuera, ' +
                    'ahora con más carpetas. Un servicio de dominio es para lógica que no pertenece a ninguna entidad, como una transferencia.' },

        { mito: 'Emito el evento junto con la escritura, es más simple.',
          realidad: 'Si la transacción falla después, ya notificaste algo que nunca pasó. Los eventos que salen del proceso van ' +
                    '<b>después del commit</b>, siempre.' },
      ],

      glosario: [
        { t: 'DDD estratégico', d: 'Lenguaje ubicuo, contextos y mapa de contextos. Barato y de alto valor.' },
        { t: 'DDD táctico', d: 'Entidades, valores, agregados, repositorios y servicios de dominio.' },
        { t: 'Servicio de dominio', d: 'Lógica que no pertenece naturalmente a ninguna entidad.' },
        { t: 'Modelo anémico', d: 'Entidades sin comportamiento, con toda la lógica en servicios externos.' },
        { t: 'Evento de dominio', d: 'Ocurre dentro del proceso al aplicar un cambio.' },
        { t: 'Evento de integración', d: 'Sale hacia otros contextos. Mínimo, estable y posterior al commit.' },
        { t: 'Event sourcing', d: 'Guardar la secuencia de eventos en vez del estado actual.' },
        { t: 'CQRS', d: 'Separar el modelo de lectura del de escritura.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es el costo real de no tener un lenguaje ubicuo?',
      opciones: [
        'Los errores de interpretación: alguien traduce mentalmente y el número sale mal sin que haya ningún error',
        'Que el código sea menos elegante',
        'Que haga falta más documentación',
        'Que los nombres sean largos',
      ],
      correcta: 0,
      porQue: '"¿Cuántos morosos hay?" se traduce a "usuarios con estado 3", pero ese estado también incluye a los que pidieron baja. La decisión se toma con el dato equivocado.',
      porQueNo: {
        1: 'La elegancia es secundaria frente a los errores de interpretación.',
        2: 'La documentación no resuelve la traducción que vive en la cabeza de alguien.',
        3: 'La longitud no tiene relación con la claridad del dominio.',
      },
    },
    {
      p: '¿Cuál es el ejercicio más valioso al construir el lenguaje del dominio?',
      opciones: [
        'Preguntar qué significan exactamente las palabras: revela desacuerdos que ya existían',
        'Traducir todos los nombres al inglés',
        'Renombrar las variables del código',
        'Escribir comentarios explicando cada término',
      ],
      correcta: 0,
      porQue: 'Es normal que dos personas del mismo equipo definan "activo" distinto y que ninguna sea la implementada. Ese descubrimiento explica por qué dos reportes nunca dan el mismo número.',
      porQueNo: {
        1: 'El idioma no importa; importa que sea la palabra del negocio.',
        2: 'El renombre es la parte barata y consecuente, no la valiosa.',
        3: 'Los comentarios se desactualizan y no fuerzan un acuerdo.',
      },
    },
    {
      p: '¿Qué aporta un check sobre una columna de estado?',
      opciones: [
        'Documenta los valores posibles y los hace obligatorios al mismo tiempo',
        'Mejora el rendimiento de las consultas',
        'Permite índices parciales',
        'Reduce el tamaño de la tabla',
      ],
      correcta: 0,
      porQue: 'Con un entero sin restricción, nada impide insertar un estado 7 que ningún código sabe interpretar — y esa fila queda apareciendo en reportes para siempre.',
      porQueNo: {
        1: 'No tiene efecto significativo en rendimiento.',
        2: 'Los índices parciales son independientes del check.',
        3: 'El tamaño depende del tipo, no de la restricción.',
      },
    },
    {
      p: '¿Qué es un bounded context?',
      opciones: [
        'Un límite dentro del cual una palabra tiene un solo significado',
        'Un microservicio con su propia base de datos',
        'Una capa de la arquitectura',
        'Un módulo con más de mil líneas',
      ],
      correcta: 0,
      porQue: '"Cliente" significa cosas distintas en ventas, facturación y soporte. Forzar un modelo único produce una entidad con cuarenta columnas donde un cambio de facturación rompe envíos.',
      porQueNo: {
        1: 'Puede implementarse así, pero en un monolito modular son carpetas con una puerta.',
        2: 'Las capas son un eje distinto: quién importa a quién.',
        3: 'El tamaño no define un límite conceptual.',
      },
    },
    {
      p: '¿Qué regla hace que los contextos separados no sean decorativos?',
      opciones: [
        'Que un contexto nunca importe tipos internos de otro: solo por la puerta de adelante',
        'Que cada uno tenga su propia base de datos',
        'Que cada uno tenga un equipo asignado',
        'Que los nombres de archivo lleven el prefijo del contexto',
      ],
      correcta: 0,
      porQue: 'Sin esa regla, las carpetas separadas se vuelven decorativas en tres semanas. Si facturación puede ver el campo "etapa" de ventas, en tres meses hay una regla de facturación que depende del embudo.',
      porQueNo: {
        1: 'No hace falta: comparten base y se relacionan por identificador.',
        2: 'Ayuda organizativamente pero no impide el acoplamiento en código.',
        3: 'Es una convención de nombres, no un límite real.',
      },
    },
    {
      p: 'Facturación guarda el nombre del cliente al emitir. ¿Es duplicación?',
      opciones: [
        'No: la factura debe mostrar el nombre que tenía al emitirse. Es parte del registro histórico',
        'Sí, hay que consultar siempre el dato actual',
        'Sí, pero se acepta por rendimiento',
        'Depende de si el cliente cambió de nombre',
      ],
      correcta: 0,
      porQue: 'Sin esa copia, reimprimir una factura de hace dos años mostraría la razón social actual — lo cual, además de estar mal, puede ser un problema legal.',
      porQueNo: {
        1: 'Consultar en vivo mostraría datos que no corresponden a esa factura.',
        2: 'No es una concesión por rendimiento: es el dato correcto.',
        3: 'La corrección de la copia no depende de si hubo cambios.',
      },
    },
    {
      p: '¿Cómo tratás el vocabulario de un proveedor externo?',
      opciones: [
        'Como un contexto que no controlás: se traduce en un adaptador, en el borde',
        'Se adopta tal cual para evitar confusiones',
        'Se ignora y se usa el propio en todas las capas',
        'Se documenta y se deja pasar hacia el dominio',
      ],
      correcta: 0,
      porQue: 'Su webhook habla de payment_intent y charge; tu sistema habla de "cobro de cuota". Si dejás entrar su vocabulario, termina en el medio de tus reglas y quedás atado sin haberlo decidido.',
      porQueNo: {
        1: 'Atarse al vocabulario ajeno es exactamente lo que hay que evitar.',
        2: 'No se puede ignorar en el borde: ahí hay que traducirlo.',
        3: 'Documentarlo no impide que contamine las reglas.',
      },
    },
    {
      p: '¿Cuál es la diferencia entre entidad y objeto de valor?',
      opciones: [
        'La entidad tiene identidad y se compara por id; el valor ES su contenido y es inmutable',
        'La entidad se guarda en base y el valor en memoria',
        'La entidad tiene métodos y el valor no',
        'La entidad es mutable y el valor también',
      ],
      correcta: 0,
      porQue: 'Un alumno sigue siendo el mismo aunque cambie de nombre. Un dinero de $1.500 es intercambiable con cualquier otro $1.500. Tratar los valores como mutables produce cambios cruzados no deseados.',
      porQueNo: {
        1: 'Ambos pueden persistirse; la distinción es conceptual.',
        2: 'Los objetos de valor suelen tener operaciones propias.',
        3: 'El objeto de valor debe ser inmutable: es lo que evita el bug clásico.',
      },
    },
    {
      p: '¿Para qué sirve un agregado?',
      opciones: [
        'Para garantizar reglas que solo se pueden verificar viendo el grupo completo',
        'Para reducir la cantidad de tablas',
        'Para agrupar código relacionado en una carpeta',
        'Para cachear objetos que se usan juntos',
      ],
      correcta: 0,
      porQue: '"Un pedido no puede superar el límite de crédito" necesita ver todos los ítems. Si cada ítem se modifica por su cuenta, esa regla no vive en ningún lado.',
      porQueNo: {
        1: 'La cantidad de tablas es una decisión de modelado independiente.',
        2: 'Eso es organización de carpetas, no un agregado.',
        3: 'La caché es un tema de rendimiento, no de invariantes.',
      },
    },
    {
      p: '¿Qué detalle hace que un agregado garantice reglas en vez de solo sugerirlas?',
      opciones: [
        'Exponer los hijos como solo lectura, para que nadie pueda modificarlos salteando la raíz',
        'Que la raíz tenga un identificador único',
        'Que todos los hijos estén en la misma tabla',
        'Que el agregado se cargue completo siempre',
      ],
      correcta: 0,
      porQue: 'Sin readonly, cualquiera hace pedido.items.push(...) y saltea toda la validación. Es la diferencia entre "el modelo tiene reglas" y "el modelo garantiza reglas".',
      porQueNo: {
        1: 'Necesario, pero no impide modificar los hijos por fuera.',
        2: 'La forma de persistencia no protege las invariantes.',
        3: 'Cargarlo completo no impide modificarlo directamente.',
      },
    },
    {
      p: '¿Cuán grande debe ser un agregado?',
      opciones: [
        'Lo más chico posible: solo lo que debe cambiar junto de forma atómica',
        'Lo más grande posible, para cargar todo de una vez',
        'Del tamaño de una tabla de la base',
        'Todo lo que pertenezca a la misma entidad principal',
      ],
      correcta: 0,
      porQue: '"Cliente con todos sus pedidos, facturas y tickets" te obliga a cargar medio sistema para cambiar un teléfono, y dos operaciones sobre pedidos distintos del mismo cliente compiten entre sí.',
      porQueNo: {
        1: 'Se convierte en un cuello de contención.',
        2: 'La persistencia es un detalle: un agregado puede abarcar varias tablas.',
        3: 'Eso lleva justamente al agregado gigante.',
      },
    },
    {
      p: '¿Qué prácticas de DDD conviene adoptar en casi cualquier proyecto?',
      opciones: [
        'Lenguaje ubicuo, glosario acordado, contextos como carpetas y objetos de valor',
        'Event sourcing y CQRS',
        'Repositorios por agregado y servicios de dominio',
        'Todas o ninguna: es un enfoque integral',
      ],
      correcta: 0,
      porQue: 'Son la mitad estratégica: barata y de alto valor. La táctica se evalúa caso por caso según si hay reglas que la justifiquen.',
      porQueNo: {
        1: 'Son las decisiones menos reversibles del enfoque: casi nunca se justifican.',
        2: 'Se justifican con agregados reales, no por defecto.',
        3: 'Adoptar solo la mitad estratégica ya cambia mucho.',
      },
    },
    {
      p: '¿Por qué event sourcing casi nunca se justifica?',
      opciones: [
        'Porque cambia cómo se guardan los datos: volver atrás es una migración total',
        'Porque es más lento',
        'Porque no hay librerías maduras',
        'Porque ocupa más espacio en disco',
      ],
      correcta: 0,
      porQue: 'Se adopta por un requisito escrito, como reconstruir el estado de cualquier momento por obligación legal — nunca por "es más escalable". Si lo que necesitás es auditoría, una tabla de historial cuesta muchísimo menos.',
      porQueNo: {
        1: 'La velocidad depende de la implementación; no es el argumento central.',
        2: 'Existen implementaciones maduras.',
        3: 'Es cierto y es un costo menor frente a la irreversibilidad.',
      },
    },
    {
      p: '¿Cuál es la señal más honesta de que te pasaste de arquitectura?',
      opciones: [
        'Que alguien con experiencia tarde dos días en ubicar dónde va un cambio de una línea',
        'Que haya más de veinte archivos',
        'Que el proyecto use TypeScript estricto',
        'Que existan interfaces',
      ],
      correcta: 0,
      porQue: 'Una arquitectura existe para que los cambios sean más fáciles. Si no lo logra, está cobrando más de lo que devuelve, por muy correcta que sea en el papel.',
      porQueNo: {
        1: 'La cantidad de archivos por sí sola no dice nada.',
        2: 'El tipado estricto reduce errores; no es un síntoma.',
        3: 'Las interfaces son útiles cuando tienen más de un implementador.',
      },
    },
    {
      p: '¿Cuándo se emite un evento de integración?',
      opciones: [
        'Después de confirmar la transacción: si se emite antes y la transacción falla, notificaste algo que nunca pasó',
        'Antes de la transacción, para no perderlo',
        'Dentro de la transacción, para que sea atómico',
        'Al iniciar la operación, para que los suscriptores se preparen',
      ],
      correcta: 0,
      porQue: 'Emitir antes produce un email de "pedido confirmado" de un pedido que no existe. Es un error de dos líneas de distancia con consecuencias visibles para el cliente.',
      porQueNo: {
        1: 'Se corre el riesgo de notificar algo que después no ocurre.',
        2: 'La cola externa no participa de la transacción de la base.',
        3: 'Los suscriptores reaccionan a hechos consumados, no a intenciones.',
      },
    },
  ],
});
