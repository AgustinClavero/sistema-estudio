/* ==========================================================================
   Arquitectura · Módulo 00 — Qué es arquitectura y qué no
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'arquitectura',
  id: 'm00',
  titulo: 'Qué es arquitectura y qué no',
  fuentes: ['fowler', 'adr', '12factor'],

  intro:
    '<p>Casi todo lo que se discute como "arquitectura" no lo es. Elegir una librería de fechas, cómo nombrar una ' +
    'carpeta o si usar <i>tabs</i> o espacios son decisiones reales, pero <b>baratas de revertir</b>.</p>' +
    '<p>Arquitectura es el subconjunto de decisiones que son <b>caras de cambiar después</b>. Ese es el criterio que ' +
    'ordena todo el track: si te equivocás y arreglarlo cuesta una tarde, no era arquitectura. Si cuesta seis meses, ' +
    'sí — y merecía que le dedicaras más de diez minutos.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Qué decisiones son de arquitectura',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> arquitectura son las decisiones que <b>cuestan
caro revertir</b>. Todo lo demás es diseño, y el diseño se cambia mientras se trabaja.</div>

<h4>La prueba, en una pregunta</h4>
<p>Ante cualquier decisión, preguntate: <b>¿cuánto costaría cambiar esto dentro de un año?</b></p>
<table>
<tr><th>Decisión</th><th>Costo de revertir</th><th>¿Arquitectura?</th></tr>
<tr><td>Qué librería de fechas usar</td><td>Una tarde</td><td>No</td></tr>
<tr><td>Cómo se llama una carpeta</td><td>Minutos</td><td>No</td></tr>
<tr><td>Si la app es multi-tenant</td><td><b>Meses</b></td><td><b>Sí</b></td></tr>
<tr><td>Relacional o documentos</td><td><b>Meses</b></td><td><b>Sí</b></td></tr>
<tr><td>Monolito o servicios separados</td><td><b>Meses</b></td><td><b>Sí</b></td></tr>
<tr><td>Sincrónico o por eventos</td><td><b>Semanas o meses</b></td><td><b>Sí</b></td></tr>
<tr><td>Qué framework de UI</td><td>Semanas</td><td>En el borde</td></tr>
<tr><td>Cómo se estructura un componente</td><td>Horas</td><td>No</td></tr>
</table>

<div class="aviso"><strong>Y de ahí sale la regla práctica más útil de esta lección:</strong> a las decisiones
caras dedicales tiempo, escribí por qué las tomaste y consultá. A las baratas, <b>decidilas rápido y seguí</b>.
Discutir dos horas el nombre de una carpeta mientras la decisión de multi-tenancy se toma sin pensar en tres
minutos es el desbalance más común de todos.</div>

<h4>Las cuatro que más se lamentan</h4>
<ol>
<li><b>Multi-tenancy</b> — meterla después implica tocar cada tabla, cada consulta y cada política.</li>
<li><b>El modelo de datos central</b> — todo lo demás se construye encima.</li>
<li><b>Los límites entre partes</b> — si están mal puestos, todo cambio toca todo.</li>
<li><b>Sincrónico o asincrónico</b> — cambia la forma de manejar errores en todo el sistema.</li>
</ol>

<h4>Lo que arquitectura NO es</h4>
<ul>
<li><b>No es un diagrama.</b> El diagrama es una foto de las decisiones, no las decisiones.</li>
<li><b>No es elegir tecnologías.</b> Es elegir <i>límites</i> y <i>formas de comunicarse</i>; las tecnologías vienen después.</li>
<li><b>No se hace una vez al principio.</b> Se toma cada decisión cara cuando aparece.</li>
<li><b>No es sinónimo de complejo.</b> "Un monolito con tres módulos y una base" es una arquitectura, y muchas veces la correcta.</li>
</ul>
`,

      tecnico: `
<h4>Decisiones de un solo sentido y de doble sentido</h4>
<p>Es el marco más práctico para decidir cuánto pensar:</p>
<ul>
<li><b>Doble sentido</b> — si sale mal, volvés atrás. <b>Decidí rápido</b>, probá, corregí.</li>
<li><b>Un solo sentido</b> — volver atrás es carísimo o imposible. <b>Frená</b>, investigá, escribí el porqué, consultá.</li>
</ul>

<div class="dato"><strong>El error más común no es equivocarse de decisión: es aplicar el proceso
equivocado.</strong> Tratar una decisión reversible como si fuera irreversible produce parálisis y reuniones
eternas. Tratar una irreversible como reversible produce la deuda que va a doler durante años. ' +
<b>Antes de discutir la decisión, clasificá cuál de las dos es.</b></div>

<h4>Qué hace que algo sea caro de revertir</h4>
<table>
<tr><th>Factor</th><th>Por qué encarece</th></tr>
<tr><td><b>Datos ya escritos</b></td><td>Migrar datos es lento, riesgoso y no se puede "deshacer"</td></tr>
<tr><td><b>Contratos públicos</b></td><td>Si otros consumen tu API, no la cambiás solo</td></tr>
<tr><td><b>Muchos puntos de contacto</b></td><td>Si algo se usa en 200 lugares, cambiarlo es un proyecto</td></tr>
<tr><td><b>Supuestos implícitos</b></td><td>Lo peor: nadie sabe dónde está el supuesto hasta que se rompe</td></tr>
</table>

<div class="dato"><strong>El último factor merece atención.</strong> Un sistema que asume "un usuario pertenece
a una sola organización" no tiene esa regla escrita en ningún lado: está <b>repartida</b> en consultas sin
filtro, en tipos sin campo y en pantallas sin selector. Cuando aparece el primer cliente que necesita dos
organizaciones, el trabajo no es agregar una columna: es encontrar todos los lugares donde el supuesto viejo
está enterrado.</div>

<h4>Diferir decisiones sin quedar paralizado</h4>
<p>La técnica se llama <b>último momento responsable</b>: postergar una decisión cara hasta tener la información
para tomarla, pero <b>no más allá</b> del punto donde postergar empieza a costar.</p>
<pre><code>· ¿Necesito decidir esto AHORA para avanzar?
    No → seguí, y anotá que quedó pendiente.
    Sí → ¿qué información me falta y cómo la consigo rápido?

· ¿Puedo tomar una decisión reversible que me deje aprender?
    Ej.: empezar con una tabla y una bandera antes de un servicio aparte.</code></pre>

<h4>La forma más barata de reducir el costo de equivocarse</h4>
<p>No es acertar más: es <b>hacer que las decisiones sean más fáciles de revertir</b>. Concretamente:</p>
<ul>
<li><b>Aislar</b> lo incierto detrás de una interfaz propia, para cambiar la implementación sin tocar el resto.</li>
<li><b>Escribir el porqué</b>, para que dentro de un año se pueda evaluar si las razones siguen valiendo.</li>
<li><b>Reducir puntos de contacto</b>: si algo se usa desde un solo módulo, reemplazarlo es local.</li>
</ul>
<p>Esto no es "arquitectura para el futuro" ni construir de más: es <b>bajar el costo del error</b> en las
pocas decisiones donde el error es caro.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA ÚNICA PREGUNTA: ¿CUÁNTO CUESTA CAMBIAR ESTO DENTRO DE UN AÑO?</text>

  <rect x="24" y="34" width="304" height="150" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="176" y="56" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">DOBLE SENTIDO</text>
  <text x="176" y="74" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">si sale mal, volvés atrás</text>
  <text x="44" y="98" fill="currentColor" opacity=".72" font-size="10.5">· qué librería de fechas</text>
  <text x="44" y="116" fill="currentColor" opacity=".72" font-size="10.5">· cómo se llama una carpeta</text>
  <text x="44" y="134" fill="currentColor" opacity=".72" font-size="10.5">· cómo se estructura un componente</text>
  <rect x="44" y="146" width="264" height="26" rx="6" fill="#34d399" fill-opacity=".22"/>
  <text x="176" y="164" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">DECIDÍ RÁPIDO Y SEGUÍ</text>

  <rect x="352" y="34" width="304" height="150" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.6"/>
  <text x="504" y="56" text-anchor="middle" fill="#f87171" font-size="12" font-weight="700">UN SOLO SENTIDO</text>
  <text x="504" y="74" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">volver atrás cuesta meses</text>
  <text x="372" y="98" fill="currentColor" opacity=".72" font-size="10.5">· si la app es multi-tenant</text>
  <text x="372" y="116" fill="currentColor" opacity=".72" font-size="10.5">· el modelo de datos central</text>
  <text x="372" y="134" fill="currentColor" opacity=".72" font-size="10.5">· los límites entre partes</text>
  <rect x="372" y="146" width="264" height="26" rx="6" fill="#f87171" fill-opacity=".24"/>
  <text x="504" y="164" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">FRENÁ · ESCRIBÍ EL PORQUÉ</text>

  <rect x="24" y="196" width="632" height="46" rx="9" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="216" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">
    El error no suele ser equivocarse de decisión: es aplicar el PROCESO equivocado.</text>
  <text x="340" y="234" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">
    Reversible tratada como irreversible = parálisis. Irreversible tratada como reversible = deuda de años.</text>

  <text x="24" y="268" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    QUÉ ENCARECE REVERTIR</text>

  <rect x="24" y="280" width="152" height="60" rx="9" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="100" y="300" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">datos escritos</text>
  <text x="100" y="320" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">migrar es lento</text>
  <text x="100" y="333" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">y no se deshace</text>

  <rect x="188" y="280" width="152" height="60" rx="9" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="264" y="300" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">contratos públicos</text>
  <text x="264" y="320" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">si otros consumen</text>
  <text x="264" y="333" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">no cambiás solo</text>

  <rect x="352" y="280" width="152" height="60" rx="9" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="428" y="300" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">200 puntos de uso</text>
  <text x="428" y="320" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">cambiarlo es</text>
  <text x="428" y="333" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">un proyecto</text>

  <rect x="516" y="280" width="140" height="60" rx="9" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.6"/>
  <text x="586" y="300" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">supuestos implícitos</text>
  <text x="586" y="318" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">LO PEOR: nadie</text>
  <text x="586" y="332" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">sabe dónde están</text>

  <rect x="24" y="352" width="632" height="34" rx="8" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="340" y="367" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">
    La mejor defensa no es acertar más: es que equivocarse cueste menos.</text>
  <text x="340" y="381" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10">
    Aislar lo incierto · escribir el porqué · reducir puntos de contacto</text>
</svg>`,
        pie: 'Si arreglarlo cuesta una tarde, no era arquitectura. Si cuesta seis meses, sí.',
      },

      entrevista: [
        { p: '¿Cómo distinguís una decisión de arquitectura de una que no lo es?',
          r: 'Por el <b>costo de revertirla</b>. Si equivocarme cuesta una tarde, no es arquitectura: es diseño, y lo cambio mientras trabajo. ' +
             'Si cuesta meses —multi-tenancy, el modelo de datos central, los límites entre partes, sincrónico contra asincrónico— sí lo es. ' +
             'Y de ahí sale una regla práctica: a las caras les dedico tiempo, escribo el porqué y consulto; a las baratas las decido rápido. ' +
             '<b>El desbalance más común es discutir dos horas el nombre de una carpeta y resolver multi-tenancy en tres minutos.</b>' },

        { p: '¿Qué son las decisiones de un solo sentido y de doble sentido?',
          r: 'Las de <b>doble sentido</b> se pueden deshacer: conviene decidirlas rápido, probar y corregir. Las de <b>un solo sentido</b> son ' +
             'carísimas o imposibles de revertir: ahí hay que frenar, investigar y dejar registrado el porqué. Lo importante es que ' +
             '<b>el error más común no es equivocarse de decisión sino aplicar el proceso equivocado</b>: tratar una reversible como irreversible ' +
             'produce parálisis, y tratar una irreversible como reversible produce deuda para años. Antes de discutir, clasifico cuál es.' },

        { p: '¿Qué hace que una decisión sea cara de revertir?',
          r: 'Cuatro cosas. <b>Datos ya escritos</b>, porque migrar es lento y no se deshace. <b>Contratos públicos</b>, porque si otros consumen tu API ' +
             'no la cambiás solo. <b>Muchos puntos de contacto</b>: algo usado en doscientos lugares no se reemplaza, se migra. ' +
             'Y la peor, los <b>supuestos implícitos</b>: un sistema que asume "un usuario, una organización" no tiene esa regla escrita en ningún ' +
             'lado — está repartida en consultas sin filtro y tipos sin campo. Cuando se rompe, el trabajo no es agregar una columna: es encontrar ' +
             'dónde quedó enterrado el supuesto.' },

        { p: '¿Cómo reducís el costo de equivocarte en arquitectura?',
          r: 'No intentando acertar más, sino <b>haciendo que las decisiones sean más fáciles de revertir</b>. Tres formas concretas: ' +
             '<b>aislar lo incierto</b> detrás de una interfaz propia, para poder cambiar la implementación sin tocar el resto; ' +
             '<b>escribir el porqué</b>, para que en un año se pueda evaluar si esas razones siguen valiendo; y ' +
             '<b>reducir los puntos de contacto</b>, porque lo que se usa desde un solo módulo se reemplaza localmente. ' +
             'No es construir de más: es bajar el costo del error donde el error es caro.' },
      ],

      practica: `
<h4>La clasificación, antes de la discusión</h4>
<pre><code>Ante cualquier decisión, en este orden:

1 · ¿Cuánto cuesta revertirla en un año?     → clasifica el proceso
2 · ¿Necesito decidirla AHORA para avanzar?  → puede esperar o no
3 · Si es cara y urgente: ¿qué información me falta?
4 · Si es cara y NO urgente: anotala y seguí
5 · Si es barata: decidila vos, ahora, y seguí</code></pre>

<div class="aviso"><strong>El paso 2 es el que más tiempo ahorra.</strong> Muchas decisiones caras <b>no hay
que tomarlas todavía</b>: se pueden postergar hasta tener información real de uso. Lo importante es
<b>anotarlas</b>, porque una decisión diferida y olvidada se termina tomando por accidente, sin que nadie la
piense.</div>

<h4>Ejemplos del workspace, clasificados</h4>
<table>
<tr><th>Decisión</th><th>Tipo</th><th>Proceso</th></tr>
<tr><td>Multi-tenant con RLS o base por cliente</td><td>Un sentido</td><td>ADR obligatorio, día 1</td></tr>
<tr><td>Supabase o Postgres propio</td><td>Un sentido a medias</td><td>Investigar; aislar el acceso a datos</td></tr>
<tr><td>Inngest o cron propio</td><td>Doble sentido</td><td>Decidir y seguir (ya está en el estándar)</td></tr>
<tr><td>Tailwind o CSS modules</td><td>Doble sentido caro</td><td>Decidir rápido, no revisitar</td></tr>
<tr><td>Nombre de una tabla</td><td>Doble sentido</td><td>Decidilo vos y seguí</td></tr>
<tr><td>Dividir en dos aplicaciones</td><td>Un sentido</td><td>ADR + criterio de gate explícito</td></tr>
</table>

<h4>Aislar lo incierto: el patrón</h4>
<pre><code>// ❌ El proveedor está esparcido por toda la aplicación
import { createClient } from '@supabase/supabase-js';
// … en 40 archivos

// ✔ Una capa propia. Si mañana cambiás de proveedor,
//    tocás un archivo, no cuarenta.
// datos/pedidos.ts
export async function pedidosDelTenant(tenantId: string) { … }
export async function crearPedido(datos: NuevoPedido) { … }</code></pre>
<p>No es una abstracción "por las dudas": es reducir <b>puntos de contacto</b> con una decisión que sabés que
puede cambiar.</p>

<h4>Preguntas para clasificar rápido</h4>
<table>
<tr><th>Pregunta</th><th>Si la respuesta es sí…</th></tr>
<tr><td>¿Va a haber datos escritos con esta forma?</td><td>Sube el costo de revertir</td></tr>
<tr><td>¿Alguien externo va a depender de esto?</td><td>Sube mucho</td></tr>
<tr><td>¿Va a estar en más de 50 lugares?</td><td>Sube</td></tr>
<tr><td>¿Se puede aislar detrás de una interfaz?</td><td><b>Baja</b> — y vale la pena hacerlo</td></tr>
<tr><td>¿Puedo probarlo en una parte chica primero?</td><td><b>Baja</b> mucho</td></tr>
</table>
`,

      errores: [
        { mito: 'La arquitectura se define al principio del proyecto.',
          realidad: 'Se toma <b>cada decisión cara cuando aparece</b>. Definir todo al principio es decidir con la menor información que vas a tener ' +
                    'nunca. Lo que sí se hace al principio son las pocas decisiones que <b>no se pueden diferir</b>, como multi-tenancy.' },

        { mito: 'Arquitectura es el diagrama de cajas y flechas.',
          realidad: 'El diagrama es una <b>foto</b> de las decisiones, útil para comunicar. Las decisiones son los límites entre partes y la forma en ' +
                    'que se comunican. Un diagrama lindo sobre límites mal puestos no arregla nada.' },

        { mito: 'Hay que discutir cada decisión en equipo.',
          realidad: 'Solo las <b>caras de revertir</b>. Discutir las baratas consume el tiempo y la energía que necesitás para las que importan — ' +
                    'y genera la sensación de que "se decide todo en comité" mientras lo grave pasa sin revisión.' },

        { mito: 'Buena arquitectura significa arquitectura sofisticada.',
          realidad: '"Un monolito con tres módulos y una base" es una arquitectura, y en la mayoría de los casos <b>la correcta</b>. ' +
                    'Lo sofisticado se justifica por un problema concreto, no por prestigio.' },
      ],

      glosario: [
        { t: 'Arquitectura', d: 'El conjunto de decisiones caras de revertir sobre un sistema.' },
        { t: 'Un solo sentido', d: 'Decisión cuya reversión es carísima o imposible.' },
        { t: 'Doble sentido', d: 'Decisión reversible con bajo costo. Se decide rápido.' },
        { t: 'Último momento responsable', d: 'Diferir una decisión hasta tener información, sin pasarse del punto donde diferir cuesta.' },
        { t: 'Punto de contacto', d: 'Lugar del código que depende de una decisión. Cuantos más, más cara de cambiar.' },
        { t: 'Supuesto implícito', d: 'Regla no escrita, repartida por el código. El costo oculto más difícil de revertir.' },
        { t: 'Costo de reversión', d: 'Esfuerzo real de deshacer una decisión una vez que el sistema está en uso.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Atributos de calidad y el arte del trade-off',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> no existe la "mejor arquitectura". Existe la que
<b>optimiza lo que a este proyecto le importa</b> y acepta pagar el precio en lo que no.</div>

<h4>Los atributos que se negocian</h4>
<table>
<tr><th>Atributo</th><th>La pregunta que responde</th></tr>
<tr><td><b>Rendimiento</b></td><td>¿Qué tan rápido responde?</td></tr>
<tr><td><b>Escalabilidad</b></td><td>¿Aguanta 10× el tráfico?</td></tr>
<tr><td><b>Disponibilidad</b></td><td>¿Cuánto puede estar caído?</td></tr>
<tr><td><b>Mantenibilidad</b></td><td>¿Cuánto cuesta agregar algo nuevo?</td></tr>
<tr><td><b>Seguridad</b></td><td>¿Qué pasa si alguien entra?</td></tr>
<tr><td><b>Simplicidad</b></td><td>¿Cuánto tarda alguien nuevo en entenderlo?</td></tr>
<tr><td><b>Costo</b></td><td>¿Cuánto sale por mes?</td></tr>
<tr><td><b>Velocidad de entrega</b></td><td>¿Cuánto tarda una idea en llegar al usuario?</td></tr>
</table>

<div class="aviso"><strong>La trampa que hay que ver:</strong> <b>mejorar uno casi siempre empeora otro</b>.
Más disponibilidad implica réplicas, que implican consistencia eventual, que complica el código. Más
simplicidad implica menos capas, y menos capas implica menos aislamiento. <b>No hay decisión gratis: hay
decisiones donde el precio se paga en algo que no te importa.</b></div>

<h4>Los tres que casi todos subestiman</h4>
<p><b>Simplicidad.</b> Se trata como si fuera "lo que queda cuando no hiciste nada bien". Es al revés: es el
atributo que <b>más afecta la velocidad futura</b>, porque un sistema simple se puede cambiar y uno complejo
hay que negociarlo.</p>

<p><b>Velocidad de entrega.</b> Un producto que tarda tres semanas en poner algo en producción pierde contra
uno que tarda un día, aunque el primero tenga mejor arquitectura en el papel.</p>

<p><b>Costo.</b> No es solo la factura de infraestructura: es <b>cuántas horas de gente</b> consume operar el
sistema todos los meses.</p>

<h4>Cómo se decide</h4>
<p>Ordenando los atributos <b>para este proyecto</b>, y escribiéndolo. Un CRM interno de veinte usuarios y una
app social de cien mil no tienen el mismo orden — y la mayoría de las malas decisiones vienen de aplicarle a
uno el orden del otro.</p>
`,

      tecnico: `
<h4>Los intercambios más comunes, con nombre</h4>
<table>
<tr><th>Ganás</th><th>Pagás</th><th>Dónde aparece</th></tr>
<tr><td>Disponibilidad</td><td>Consistencia</td><td>Réplicas, multi-región</td></tr>
<tr><td>Rendimiento</td><td>Frescura de los datos</td><td>Toda caché</td></tr>
<tr><td>Escalabilidad</td><td>Simplicidad</td><td>Colas, partición, servicios</td></tr>
<tr><td>Flexibilidad</td><td>Claridad</td><td>Configuración, plugins, abstracciones</td></tr>
<tr><td>Seguridad</td><td>Comodidad</td><td>Permisos finos, segundo factor</td></tr>
<tr><td>Velocidad de entrega</td><td>Deuda técnica</td><td>Atajos deliberados</td></tr>
<tr><td>Costo bajo</td><td>Trabajo manual</td><td>Autogestionar en vez de pagar gestionado</td></tr>
</table>

<div class="dato"><strong>La fila de la caché es la que más gente descubre tarde.</strong> Toda caché es un
intercambio de <b>frescura por velocidad</b>, y la pregunta que hay que responder <b>antes</b> de ponerla es
"¿cuántos segundos de desactualización tolera este dato?". Si la respuesta es cero, no se cachea — y hay que
buscar la velocidad en otro lado.</div>

<h4>Escribir los atributos de forma medible</h4>
<p>"Tiene que ser rápido" no es un requisito: no se puede verificar ni negociar. Un atributo de calidad útil
tiene <b>número, condición y contexto</b>:</p>
<pre><code>❌  "La app tiene que ser rápida y escalar bien."

✔  "El listado de pedidos responde en menos de 300 ms (p95)
    con 50 usuarios concurrentes y 100.000 pedidos por tenant.
    Con 10× ese volumen aceptamos hasta 1 s."</code></pre>

<div class="dato"><strong>La segunda oración de ese ejemplo es la que casi nadie escribe</strong> y la más
valiosa: define <b>qué degradación se acepta</b> al escalar. Sin eso, cualquier lentitud futura se discute como
si fuera una falla, cuando puede ser exactamente lo acordado.</div>

<h4>Un método para ordenar</h4>
<pre><code>1 · Listar los 8 atributos.
2 · Asignar a cada uno: crítico / importante / aceptable sacrificar.
3 · Regla: como máximo DOS críticos.
4 · Por cada crítico, escribir el número que lo hace verificable.
5 · Por cada "sacrificable", escribir hasta dónde.</code></pre>

<p>El paso 3 es el que fuerza la decisión real. Si todo es crítico, no se decidió nada — y en la práctica el
sistema va a terminar optimizando lo que decidió quien escribió el código ese día.</p>

<h4>Ejemplos de órdenes distintos</h4>
<table>
<tr><th>Sistema</th><th>Críticos</th><th>Sacrificable</th></tr>
<tr><td>Panel interno, 20 usuarios</td><td>Velocidad de entrega, simplicidad</td><td>Escalabilidad, rendimiento</td></tr>
<tr><td>App social</td><td>Disponibilidad, rendimiento</td><td>Consistencia inmediata, costo</td></tr>
<tr><td>SaaS B2B multi-tenant</td><td><b>Seguridad</b>, mantenibilidad</td><td>Rendimiento extremo</td></tr>
<tr><td>Pasarela de pagos</td><td><b>Consistencia</b>, seguridad</td><td>Latencia, simplicidad</td></tr>
<tr><td>Landing de marketing</td><td>Rendimiento, costo</td><td>Casi todo lo demás</td></tr>
</table>

<div class="dato"><strong>Mirá la fila del SaaS B2B, que es el caso del workspace:</strong> con seguridad como
crítico, el aislamiento entre tenants deja de ser negociable — y eso justifica RLS en todas las tablas aunque
cueste rendimiento y aunque complique algunas consultas. <b>Cuando el orden está escrito, esa discusión no se
vuelve a dar cada vez.</b></div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    NO HAY DECISIÓN GRATIS — mejorar uno empeora otro</text>

  <rect x="24" y="34" width="290" height="24" rx="6" fill="#34d399" fill-opacity=".18"/>
  <text x="40" y="51" fill="#34d399" font-size="10.5" font-weight="700">GANÁS disponibilidad</text>
  <text x="330" y="51" fill="currentColor" opacity=".4" font-size="12">→</text>
  <rect x="352" y="34" width="304" height="24" rx="6" fill="#f87171" fill-opacity=".16"/>
  <text x="368" y="51" fill="#f87171" font-size="10.5" font-weight="700">PAGÁS consistencia</text>

  <rect x="24" y="64" width="290" height="24" rx="6" fill="#34d399" fill-opacity=".18"/>
  <text x="40" y="81" fill="#34d399" font-size="10.5" font-weight="700">GANÁS rendimiento (caché)</text>
  <text x="330" y="81" fill="currentColor" opacity=".4" font-size="12">→</text>
  <rect x="352" y="64" width="304" height="24" rx="6" fill="#f87171" fill-opacity=".16"/>
  <text x="368" y="81" fill="#f87171" font-size="10.5" font-weight="700">PAGÁS frescura de los datos</text>

  <rect x="24" y="94" width="290" height="24" rx="6" fill="#34d399" fill-opacity=".18"/>
  <text x="40" y="111" fill="#34d399" font-size="10.5" font-weight="700">GANÁS escalabilidad</text>
  <text x="330" y="111" fill="currentColor" opacity=".4" font-size="12">→</text>
  <rect x="352" y="94" width="304" height="24" rx="6" fill="#f87171" fill-opacity=".16"/>
  <text x="368" y="111" fill="#f87171" font-size="10.5" font-weight="700">PAGÁS simplicidad</text>

  <rect x="24" y="124" width="290" height="24" rx="6" fill="#34d399" fill-opacity=".18"/>
  <text x="40" y="141" fill="#34d399" font-size="10.5" font-weight="700">GANÁS flexibilidad</text>
  <text x="330" y="141" fill="currentColor" opacity=".4" font-size="12">→</text>
  <rect x="352" y="124" width="304" height="24" rx="6" fill="#f87171" fill-opacity=".16"/>
  <text x="368" y="141" fill="#f87171" font-size="10.5" font-weight="700">PAGÁS claridad</text>

  <rect x="24" y="154" width="290" height="24" rx="6" fill="#34d399" fill-opacity=".18"/>
  <text x="40" y="171" fill="#34d399" font-size="10.5" font-weight="700">GANÁS costo bajo</text>
  <text x="330" y="171" fill="currentColor" opacity=".4" font-size="12">→</text>
  <rect x="352" y="154" width="304" height="24" rx="6" fill="#f87171" fill-opacity=".16"/>
  <text x="368" y="171" fill="#f87171" font-size="10.5" font-weight="700">PAGÁS horas de gente</text>

  <rect x="24" y="192" width="632" height="30" rx="8" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="340" y="212" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">
    Las buenas decisiones son las que pagan el precio en algo que a ESTE proyecto no le importa.</text>

  <text x="24" y="248" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL MISMO ATRIBUTO, DISTINTA PRIORIDAD SEGÚN EL SISTEMA</text>

  <rect x="24" y="260" width="200" height="66" rx="9" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="124" y="280" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">panel interno · 20 usuarios</text>
  <text x="124" y="298" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">crítico: entrega + simplicidad</text>
  <text x="124" y="315" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">sacrifica: escalabilidad</text>

  <rect x="240" y="260" width="200" height="66" rx="9" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="340" y="280" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">SaaS B2B multi-tenant</text>
  <text x="340" y="298" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">crítico: SEGURIDAD + mantenible</text>
  <text x="340" y="315" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">sacrifica: rendimiento extremo</text>

  <rect x="456" y="260" width="200" height="66" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.2"/>
  <text x="556" y="280" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">pasarela de pagos</text>
  <text x="556" y="298" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">crítico: CONSISTENCIA + seguridad</text>
  <text x="556" y="315" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">sacrifica: latencia, simplicidad</text>

  <rect x="24" y="340" width="632" height="46" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="360" fill="#f87171" font-size="11.5" font-weight="700">LA REGLA QUE FUERZA LA DECISIÓN: como máximo DOS críticos.</text>
  <text x="44" y="378" fill="currentColor" opacity=".72" font-size="11">
    Si todo es crítico, no se decidió nada — y el sistema termina optimizando lo que eligió quien escribió el código ese día.</text>
</svg>`,
        pie: 'No existe la mejor arquitectura. Existe la que optimiza lo que a este proyecto le importa.',
      },

      entrevista: [
        { p: '¿Qué son los atributos de calidad y por qué se negocian entre sí?',
          r: 'Son las propiedades que un sistema puede tener en más o menos medida: rendimiento, escalabilidad, disponibilidad, mantenibilidad, ' +
             'seguridad, simplicidad, costo y velocidad de entrega. Se negocian porque <b>mejorar uno casi siempre empeora otro</b>: ' +
             'más disponibilidad implica réplicas, que implican consistencia eventual, que complica el código. ' +
             'Por eso no existe "la mejor arquitectura": existe la que <b>optimiza lo que a este proyecto le importa</b> y paga el precio ' +
             'en algo que no.' },

        { p: '¿Cómo escribís un atributo de calidad de forma útil?',
          r: 'Con <b>número, condición y contexto</b>. "Tiene que ser rápido" no se puede verificar ni negociar; "el listado responde en menos de ' +
             '300 ms en p95 con 50 usuarios concurrentes y 100.000 pedidos por tenant" sí. Y agrego una segunda oración que casi nadie escribe: ' +
             '<b>qué degradación se acepta al escalar</b> — "con 10× ese volumen aceptamos hasta 1 segundo". Sin eso, cualquier lentitud futura ' +
             'se discute como una falla cuando puede ser exactamente lo acordado.' },

        { p: '¿Cuál es la regla que fuerza a decidir de verdad?',
          r: '<b>Como máximo dos atributos críticos.</b> Si todo es crítico, no se decidió nada, y en la práctica el sistema termina optimizando lo ' +
             'que eligió quien escribió el código ese día. Poner el límite obliga a nombrar qué se está dispuesto a sacrificar y hasta dónde. ' +
             'Y una vez escrito, esa discusión <b>no se vuelve a dar cada vez</b>: en un SaaS B2B con seguridad como crítico, ' +
             'RLS en todas las tablas deja de ser negociable aunque cueste rendimiento.' },

        { p: '¿Qué atributos suelen subestimarse?',
          r: 'Tres. La <b>simplicidad</b>, que se trata como lo que queda cuando no hiciste nada bien, cuando en realidad es lo que más afecta la ' +
             'velocidad futura: un sistema simple se cambia, uno complejo se negocia. La <b>velocidad de entrega</b>: un producto que tarda tres ' +
             'semanas en desplegar pierde contra uno que tarda un día, aunque tenga mejor arquitectura en el papel. Y el <b>costo</b>, que no es solo ' +
             'la factura de infraestructura sino <b>cuántas horas de gente</b> consume operar el sistema todos los meses.' },
      ],

      practica: `
<h4>La ficha de atributos, para el proyecto</h4>
<pre><code>Proyecto: CRM multi-tenant

CRÍTICOS (máximo 2)
  · Seguridad       → aislamiento total entre tenants. Cero fugas.
                      Verificable: test que intenta leer datos de otro tenant y falla.
  · Mantenibilidad  → una funcionalidad nueva se agrega sin tocar otras.
                      Verificable: archivos tocados por feature típica < 8.

IMPORTANTES
  · Rendimiento     → listados en < 500 ms p95 con 50k registros por tenant.
  · Costo           → < 100 USD/mes hasta 30 tenants.

ACEPTAMOS SACRIFICAR
  · Escalabilidad   → hasta 200 tenants. Más que eso, se rediseña.
  · Disponibilidad  → 99% es suficiente (7 h/mes). No hay guardia nocturna.</code></pre>

<div class="aviso"><strong>Lo que hace útil a esta ficha es la última sección.</strong> Escribir hasta dónde
estás dispuesto a sacrificar convierte una futura discusión en una consulta: cuando alguien proponga
multi-región "por las dudas", la respuesta ya está escrita — y si el negocio cambió, se cambia la ficha a
propósito en vez de que la decisión se filtre por la puerta de atrás.</div>

<h4>Preguntas para ordenar, si no sabés por dónde empezar</h4>
<table>
<tr><th>Pregunta</th><th>Qué revela</th></tr>
<tr><td>Si esto se cae 2 horas, ¿qué pasa?</td><td>Disponibilidad</td></tr>
<tr><td>Si se filtra un dato, ¿qué pasa?</td><td>Seguridad</td></tr>
<tr><td>¿Cuántos usuarios en 12 meses?</td><td>Escalabilidad</td></tr>
<tr><td>¿Cuánta gente va a tocar este código?</td><td>Mantenibilidad y simplicidad</td></tr>
<tr><td>¿Cuánto se puede gastar por mes?</td><td>Costo</td></tr>
<tr><td>¿Cada cuánto hay que entregar algo?</td><td>Velocidad de entrega</td></tr>
</table>

<h4>Detectar un intercambio escondido</h4>
<pre><code>Ante cualquier propuesta técnica, preguntá:

  "¿Qué empeora si hacemos esto?"

Si la respuesta es "nada", una de dos:
  a) no se entendió la propuesta, o
  b) hay un costo que todavía no se ve.

Nunca es realmente "nada".</code></pre>

<div class="dato"><strong>Esa pregunta es la herramienta más portátil de este módulo.</strong> Funciona en
cualquier discusión técnica y cambia el tono: en vez de defender o atacar una idea, el equipo pasa a nombrar el
precio — que es la única conversación que lleva a una decisión informada.</div>
`,

      errores: [
        { mito: 'Hay arquitecturas objetivamente mejores.',
          realidad: 'Hay arquitecturas <b>mejores para un conjunto de prioridades</b>. La misma decisión es excelente en una app social y pésima en una ' +
                    'pasarela de pagos. Sin el orden de atributos escrito, la discusión es de gustos.' },

        { mito: 'La simplicidad es lo que queda cuando no hiciste nada bien.',
          realidad: 'Es el atributo que <b>más afecta la velocidad futura</b>. Un sistema simple se cambia; uno complejo hay que negociarlo con quien ' +
                    'lo entiende. Elegir simplicidad es una decisión activa, no una omisión.' },

        { mito: '"Tiene que ser rápido y escalable" es un requisito.',
          realidad: 'No se puede verificar ni negociar. Un atributo útil tiene <b>número, condición y contexto</b>, y además dice ' +
                    '<b>qué degradación se acepta</b> al escalar — que es lo que evita que toda lentitud futura se trate como falla.' },

        { mito: 'Puedo tener todos los atributos en alto.',
          realidad: 'Mejorar uno empeora otro. La regla de <b>máximo dos críticos</b> existe para forzar la decisión: si todo es crítico, ' +
                    'termina decidiendo quien escribió el código ese día, no el equipo.' },
      ],

      glosario: [
        { t: 'Atributo de calidad', d: 'Propiedad no funcional del sistema: rendimiento, seguridad, simplicidad, etc.' },
        { t: 'Trade-off', d: 'Intercambio: ganar en un atributo a costa de otro.' },
        { t: 'p95', d: 'Percentil 95. El 95% de los casos está por debajo de ese valor.' },
        { t: 'Requisito verificable', d: 'Enunciado con número, condición y contexto, que se puede comprobar.' },
        { t: 'Degradación aceptada', d: 'Cuánto se permite empeorar un atributo al crecer la carga.' },
        { t: 'Costo total', d: 'Infraestructura más horas de gente necesarias para operar el sistema.' },
        { t: 'Deuda técnica', d: 'Atajo deliberado que compra velocidad hoy a cambio de trabajo mañana.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Acoplamiento, cohesión y el costo del cambio',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> <b>acoplamiento</b> es cuánto depende una parte de
otra; <b>cohesión</b> es cuánto tienen que ver entre sí las cosas que están juntas. Casi todo el dolor de un
sistema viene de tener demasiado del primero y poco del segundo.</div>

<h4>La señal de que algo anda mal</h4>
<p>Es muy concreta y no requiere teoría: <b>un cambio chico obliga a tocar muchos archivos que no tenían nada
que ver</b>.</p>
<pre><code>"Agregué un campo al formulario de cliente"
   → toqué el componente
   → toqué el tipo
   → toqué el servicio
   → toqué la migración          ← hasta acá, normal

   → toqué el módulo de facturación
   → toqué el exportador de reportes
   → toqué el módulo de envíos    ← acá está el problema</code></pre>

<div class="aviso"><strong>Los primeros cuatro son cohesión buena:</strong> son las capas de <i>lo mismo</i>.
Los últimos tres son <b>acoplamiento</b>: tres módulos distintos conocían la forma interna de cliente. ' +
La pregunta útil no es "¿toqué muchos archivos?" sino <b>"¿toqué archivos que no tienen nada que ver con lo que
cambié?"</b>.</div>

<h4>Alta cohesión: lo que cambia junto, vive junto</h4>
<p>Es la regla que ordena carpetas mejor que cualquier convención:</p>
<pre><code>❌ Por tipo técnico — lo de "pedidos" queda repartido en 5 lugares
   componentes/  hooks/  servicios/  tipos/  utils/

✔ Por funcionalidad — todo lo de pedidos, junto
   funcionalidades/pedidos/  {componentes, hooks, servicio, tipos}
   funcionalidades/clientes/
   compartido/</code></pre>

<h4>Bajo acoplamiento: hablarse por contratos</h4>
<p>Dos módulos siempre van a necesitar hablarse. La diferencia está en <b>cuánto sabe uno del otro</b>:</p>
<ul>
<li><b>Acoplado</b> — facturación importa el modelo interno de pedidos y lee sus campos.</li>
<li><b>Desacoplado</b> — facturación pide lo que necesita a través de una función que pedidos expone, y no sabe cómo está guardado.</li>
</ul>
<p>La segunda forma permite cambiar cómo se guarda un pedido <b>sin que facturación se entere</b>.</p>
`,

      tecnico: `
<h4>Los tipos de acoplamiento, de peor a mejor</h4>
<table>
<tr><th>Tipo</th><th>Qué significa</th><th>Nivel</th></tr>
<tr><td><b>De contenido</b></td><td>Un módulo modifica datos internos de otro</td><td>Pésimo</td></tr>
<tr><td><b>Común</b></td><td>Comparten estado global mutable</td><td>Muy malo</td></tr>
<tr><td><b>De control</b></td><td>Uno le pasa a otro una bandera que decide su comportamiento</td><td>Malo</td></tr>
<tr><td><b>De estructura</b></td><td>Comparten la forma de un objeto complejo</td><td>Medio</td></tr>
<tr><td><b>De datos</b></td><td>Se pasan solo los valores necesarios</td><td><b>El objetivo</b></td></tr>
</table>

<div class="dato"><strong>El acoplamiento de control es el más fácil de detectar y el más ignorado:</strong>
cuando ves una función que recibe un booleano que cambia <b>qué hace</b> —no cómo lo hace— es señal de que
adentro hay dos funciones distintas peleando. <code>procesarPedido(pedido, esUrgente)</code> con un
<code>if</code> gigante adentro suele ser <code>procesarPedidoNormal</code> y <code>procesarPedidoUrgente</code>
comprimidos a la fuerza.</div>

<h4>La dirección de las dependencias</h4>
<p>Esto importa tanto como la cantidad. Una regla que ordena casi todo:</p>
<pre><code>Lo ESTABLE no depende de lo VOLÁTIL.</code></pre>
<ul>
<li>Las reglas de negocio son estables → no deberían importar el framework de UI.</li>
<li>El acceso a datos es volátil → puede cambiar de proveedor.</li>
<li>La UI es la más volátil de todas → debería depender de todo lo demás, y nada depender de ella.</li>
</ul>

<div class="dato"><strong>Cuando la dependencia va al revés, el síntoma es muy reconocible:</strong> cambiar el
color de un botón te obliga a tocar una función que calcula impuestos. Suena absurdo y pasa todo el tiempo —
porque alguien puso la lógica de cálculo <b>dentro</b> del componente, y ahora la regla de negocio depende de
la pantalla.</div>

<h4>Cohesión: las clases que hay</h4>
<table>
<tr><th>Tipo</th><th>Qué agrupa</th><th>Nivel</th></tr>
<tr><td><b>Funcional</b></td><td>Todo contribuye a una sola tarea</td><td><b>El objetivo</b></td></tr>
<tr><td><b>Secuencial</b></td><td>La salida de uno alimenta al siguiente</td><td>Bien</td></tr>
<tr><td><b>Comunicacional</b></td><td>Operan sobre los mismos datos</td><td>Aceptable</td></tr>
<tr><td><b>Temporal</b></td><td>Se ejecutan en el mismo momento</td><td>Débil</td></tr>
<tr><td><b>Coincidental</b></td><td>Nada en común: es un cajón</td><td>Pésimo</td></tr>
</table>

<div class="dato"><strong>La cohesión coincidental tiene un nombre que todos conocen: <code>utils</code> o
<code>helpers</code>.</strong> Una carpeta donde va lo que no encaja en ningún lado termina siendo el módulo
del que <b>todo depende</b> y que <b>nadie entiende</b>. La cura no es prohibirla: es que cada vez que algo va
ahí, alguien pregunte a qué funcionalidad pertenece realmente.</div>

<h4>Medir el acoplamiento sin herramientas</h4>
<pre><code># ¿Cuántos módulos importan a este?  (si es alto, es un cuello)
grep -rl "from '@/funcionalidades/pedidos" src/ | wc -l

# ¿Cuántos módulos importa este?  (si es alto, sabe demasiado)
grep -o "from '@/[a-z]*/[a-z]*" src/funcionalidades/facturacion/*.ts | sort -u</code></pre>
<p>Un módulo que importa a otros quince es un candidato claro a dividirse; uno que es importado por quince es un
punto de contacto que hay que cuidar mucho al cambiar.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="ac1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="#f87171" font-size="12" font-weight="700">
    ALTO ACOPLAMIENTO — todos conocen las tripas de todos</text>

  <circle cx="90" cy="80" r="26" fill="#f87171" fill-opacity=".22" stroke="#f87171" stroke-width="1.3"/>
  <text x="90" y="84" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">pedidos</text>
  <circle cx="200" cy="60" r="26" fill="#f87171" fill-opacity=".22" stroke="#f87171" stroke-width="1.3"/>
  <text x="200" y="64" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">facturas</text>
  <circle cx="215" cy="128" r="26" fill="#f87171" fill-opacity=".22" stroke="#f87171" stroke-width="1.3"/>
  <text x="215" y="132" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">envíos</text>
  <circle cx="105" cy="146" r="26" fill="#f87171" fill-opacity=".22" stroke="#f87171" stroke-width="1.3"/>
  <text x="105" y="150" text-anchor="middle" fill="currentColor" font-size="9" font-weight="700">reportes</text>

  <g stroke="#f87171" stroke-width="1.2" opacity=".8">
    <line x1="112" y1="68" x2="178" y2="66"/>
    <line x1="110" y1="98" x2="196" y2="120"/>
    <line x1="96" y1="106" x2="102" y2="120"/>
    <line x1="196" y1="84" x2="210" y2="104"/>
    <line x1="130" y1="140" x2="190" y2="130"/>
    <line x1="124" y1="126" x2="182" y2="76"/>
  </g>

  <text x="52" y="188" fill="#f87171" font-size="10.5" font-weight="700">un cambio chico toca todo</text>

  <line x1="300" y1="34" x2="300" y2="196" stroke="currentColor" opacity=".2"/>

  <text x="330" y="22" fill="#34d399" font-size="12" font-weight="700">
    BAJO ACOPLAMIENTO — se hablan por contratos</text>

  <rect x="330" y="46" width="120" height="40" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.3"/>
  <text x="390" y="70" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">pedidos</text>

  <rect x="330" y="106" width="120" height="40" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.3"/>
  <text x="390" y="130" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">facturas</text>

  <rect x="500" y="46" width="120" height="40" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.3"/>
  <text x="560" y="70" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">envíos</text>

  <rect x="500" y="106" width="120" height="40" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.3"/>
  <text x="560" y="130" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">reportes</text>

  <line x1="454" y1="66" x2="496" y2="66" stroke="#34d399" stroke-width="1.6" marker-end="url(#ac1)" color="#34d399"/>
  <line x1="390" y1="90" x2="390" y2="102" stroke="#34d399" stroke-width="1.6" marker-end="url(#ac1)" color="#34d399"/>
  <line x1="454" y1="126" x2="496" y2="126" stroke="#34d399" stroke-width="1.6" marker-end="url(#ac1)" color="#34d399"/>

  <text x="330" y="172" fill="#34d399" font-size="10.5" font-weight="700">pocas flechas, y todas por la puerta de adelante</text>
  <text x="330" y="188" fill="currentColor" opacity=".6" font-size="10">cambiás cómo se guarda un pedido y nadie se entera</text>

  <line x1="24" y1="212" x2="656" y2="212" stroke="currentColor" opacity=".18"/>

  <rect x="24" y="226" width="632" height="64" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="44" y="248" fill="#fbbf24" font-size="12" font-weight="700">LA PREGUNTA QUE DETECTA EL PROBLEMA</text>
  <text x="44" y="268" fill="currentColor" opacity=".72" font-size="11">
    No es “¿toqué muchos archivos?” — tocar componente + tipo + servicio + migración es cohesión buena.</text>
  <text x="44" y="284" fill="#fbbf24" font-size="11.5" font-weight="700">
    Es: “¿toqué archivos que NO TIENEN NADA QUE VER con lo que cambié?”</text>

  <rect x="24" y="300" width="304" height="86" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="176" y="322" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">LA DIRECCIÓN TAMBIÉN IMPORTA</text>
  <text x="44" y="344" fill="currentColor" opacity=".72" font-size="10.5">lo ESTABLE no depende de lo VOLÁTIL</text>
  <text x="44" y="362" fill="currentColor" opacity=".65" font-size="10">reglas de negocio ← estables</text>
  <text x="44" y="378" fill="currentColor" opacity=".65" font-size="10">UI ← lo más volátil: nada debería depender de ella</text>

  <rect x="352" y="300" width="304" height="86" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="504" y="322" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">EL SÍNTOMA DE LA DIRECCIÓN INVERTIDA</text>
  <text x="372" y="346" fill="#f87171" font-size="11" font-weight="700">cambiar el color de un botón te obliga</text>
  <text x="372" y="362" fill="#f87171" font-size="11" font-weight="700">a tocar el cálculo de impuestos</text>
  <text x="372" y="379" fill="currentColor" opacity=".6" font-size="10">alguien puso la lógica DENTRO del componente</text>
</svg>`,
        pie: 'Lo que cambia junto, vive junto. Lo que no tiene que ver, se habla por contratos.',
      },

      entrevista: [
        { p: '¿Qué son acoplamiento y cohesión?',
          r: '<b>Acoplamiento</b> es cuánto depende una parte de otra; <b>cohesión</b> es cuánto tienen que ver entre sí las cosas que están juntas. ' +
             'El objetivo es <b>alta cohesión y bajo acoplamiento</b>: que lo que cambia junto viva junto, y que módulos distintos se hablen por ' +
             'contratos en vez de conocer las tripas del otro. Casi todo el dolor de mantenimiento de un sistema viene de tener demasiado ' +
             'acoplamiento y poca cohesión.' },

        { p: '¿Cómo detectás acoplamiento excesivo sin herramientas?',
          r: 'Con una pregunta muy concreta después de cada cambio: <b>"¿toqué archivos que no tienen nada que ver con lo que cambié?"</b>. ' +
             'Ojo con la versión ingenua —"¿toqué muchos archivos?"— porque tocar componente, tipo, servicio y migración de la misma funcionalidad ' +
             'es <b>cohesión buena</b>. El problema aparece cuando agregar un campo a cliente te obliga a tocar facturación, reportes y envíos: ' +
             'ahí tres módulos conocían la forma interna de cliente.' },

        { p: '¿Por qué importa la dirección de las dependencias y no solo la cantidad?',
          r: 'Porque la regla que ordena casi todo es que <b>lo estable no debe depender de lo volátil</b>. Las reglas de negocio son estables y no ' +
             'deberían importar el framework de UI; la UI es lo más volátil y debería depender de todo lo demás, sin que nada dependa de ella. ' +
             'Cuando la dependencia va al revés el síntoma es inconfundible: <b>cambiar el color de un botón te obliga a tocar el cálculo de ' +
             'impuestos</b>, porque alguien puso la lógica dentro del componente.' },

        { p: '¿Qué problema tiene una carpeta "utils"?',
          r: 'Es <b>cohesión coincidental</b>: agrupa cosas que no tienen nada en común más allá de no encajar en otro lado. El resultado es un módulo ' +
             'del que <b>todo depende</b> y que <b>nadie entiende</b>, que además crece sin límite. La cura no es prohibirla —siempre hay algo ' +
             'genuinamente transversal— sino que cada vez que algo va a parar ahí, alguien pregunte a qué funcionalidad pertenece realmente. ' +
             'La mayoría de las veces la respuesta existe.' },
      ],

      practica: `
<h4>Reorganizar por funcionalidad</h4>
<pre><code>❌ Por tipo técnico — lo de "pedidos" queda en 5 lugares
src/
  componentes/   PedidoLista.tsx  ClienteForm.tsx  FacturaPDF.tsx
  hooks/         usePedidos.ts    useClientes.ts
  servicios/     pedidos.ts       clientes.ts
  tipos/         index.ts         ← 800 líneas de todo

✔ Por funcionalidad — lo que cambia junto, junto
src/
  funcionalidades/
    pedidos/     componentes/  hooks/  servicio.ts  tipos.ts  index.ts
    clientes/    componentes/  hooks/  servicio.ts  tipos.ts  index.ts
    facturacion/ …
  compartido/    ui/  utilidades/  configuracion/</code></pre>

<div class="aviso"><strong>El <code>index.ts</code> de cada funcionalidad es la pieza clave.</strong> Es la
<b>puerta de adelante</b>: lo único que los demás módulos pueden importar. Todo lo que no esté exportado ahí es
interno y se puede cambiar sin avisar. Sin esa puerta, la carpeta por funcionalidad es solo una forma nueva de
ordenar el mismo acoplamiento.</div>

<h4>Romper acoplamiento de control</h4>
<pre><code>// ❌ Un booleano que cambia QUÉ hace la función
function procesarPedido(pedido, esUrgente) {
  if (esUrgente) { /* 40 líneas */ } else { /* otras 40 */ }
}

// ✔ Dos funciones, y quien llama elige
function procesarPedidoNormal(pedido) { … }
function procesarPedidoUrgente(pedido) { … }</code></pre>
<p>La señal es el booleano que decide <b>qué</b> hace la función, no <b>cómo</b>. Casi siempre son dos funciones
comprimidas a la fuerza.</p>

<h4>Comunicación entre módulos, sin conocer las tripas</h4>
<pre><code>// ❌ facturación conoce la forma interna de pedidos
import { PedidoDB } from '@/funcionalidades/pedidos/tipos';
const total = pedido.items.reduce((a, i) =&gt; a + i.precio * i.cant, 0);

// ✔ pedidos expone lo que hace falta, y guarda el cómo
import { totalDePedido } from '@/funcionalidades/pedidos';
const total = totalDePedido(pedidoId);</code></pre>
<p>Ahora se puede cambiar cómo se guardan los ítems, o mover el cálculo a la base, <b>sin que facturación se
entere</b>.</p>

<h4>Diagnóstico rápido</h4>
<table>
<tr><th>Síntoma</th><th>Problema</th></tr>
<tr><td>Un cambio chico toca módulos ajenos</td><td>Acoplamiento alto</td></tr>
<tr><td>Un archivo se toca en casi todos los PR</td><td>Cohesión baja: hace demasiado</td></tr>
<tr><td>Nadie sabe dónde poner algo nuevo</td><td>Los límites no están claros</td></tr>
<tr><td>Cambiar la UI rompe reglas de negocio</td><td>Dependencia invertida</td></tr>
<tr><td><code>utils</code> con más de 20 archivos</td><td>Cohesión coincidental</td></tr>
</table>
`,

      errores: [
        { mito: 'Si toco muchos archivos, hay acoplamiento.',
          realidad: 'Depende de <b>cuáles</b>. Tocar componente, tipo, servicio y migración de la misma funcionalidad es <b>cohesión buena</b>. ' +
                    'El problema es tocar archivos <b>que no tienen nada que ver</b> con lo que cambiaste.' },

        { mito: 'Organizar por tipo técnico es más ordenado.',
          realidad: 'Parece prolijo y deja lo de una misma funcionalidad <b>repartido en cinco carpetas</b>. Organizando por funcionalidad, lo que ' +
                    'cambia junto está junto, y el límite del módulo se vuelve visible.' },

        { mito: 'Con carpetas por funcionalidad ya está desacoplado.',
          realidad: 'Solo si cada una tiene una <b>puerta de adelante</b> —un <code>index</code> que define lo público—. Si los demás importan archivos ' +
                    'internos, es la misma maraña con otra estructura de directorios.' },

        { mito: 'Una carpeta utils es inevitable.',
          realidad: 'Algo transversal siempre hay, pero <code>utils</code> con veinte archivos es <b>cohesión coincidental</b>: todo depende de ella y ' +
                    'nadie la entiende. Cada vez que algo va ahí, preguntá a qué funcionalidad pertenece — casi siempre hay respuesta.' },
      ],

      glosario: [
        { t: 'Acoplamiento', d: 'Grado en que un módulo depende de otro.' },
        { t: 'Cohesión', d: 'Grado en que los elementos de un módulo pertenecen juntos.' },
        { t: 'Acoplamiento de datos', d: 'El mejor: se pasan solo los valores necesarios.' },
        { t: 'Acoplamiento de control', d: 'Pasar una bandera que decide qué hace la otra función.' },
        { t: 'Cohesión funcional', d: 'La mejor: todo el módulo contribuye a una sola tarea.' },
        { t: 'Cohesión coincidental', d: 'La peor: se agrupa lo que no encaja en otro lado.' },
        { t: 'Puerta de adelante', d: 'Archivo índice que define qué es público de un módulo.' },
        { t: 'Dependencia invertida', d: 'Cuando lo estable termina dependiendo de lo volátil.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'ADR: dejar escrito el porqué',
      minutos: 6,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el código muestra <b>qué</b> se decidió; nunca
muestra <b>por qué</b>. Un ADR es un documento corto que guarda esa segunda parte.</div>

<h4>El problema que resuelve</h4>
<p>Dentro de un año alguien —quizás vos— va a mirar una decisión rara y va a pensar "esto está mal, lo cambio".
Y hay dos posibilidades:</p>
<ul>
<li>Efectivamente estaba mal, y cambiarlo es una mejora.</li>
<li>Había una razón, esa razón sigue vigente, y <b>cambiarlo va a romper algo</b> que nadie recuerda.</li>
</ul>
<p>Sin registro, no hay forma de distinguir esos dos casos. Y como investigar cuesta, en la práctica pasa una
de dos cosas igual de malas: se cambia a ciegas y se rompe, o <b>no se toca nunca por miedo</b> — y ese miedo
se acumula hasta que el sistema entero se vuelve intocable.</p>

<div class="aviso"><strong>Esa segunda consecuencia es la más cara y la menos visible.</strong> Un sistema
lleno de decisiones sin explicar se vuelve <b>rígido por desconocimiento</b>, no por diseño. Nadie puede
argumentar a favor de cambiar algo cuyo motivo original no conoce.</div>

<h4>Qué es un ADR</h4>
<p>Un archivo de <b>una página</b>, versionado junto al código, con cuatro secciones:</p>
<pre><code>Contexto      → qué problema había y qué restricciones existían
Decisión      → qué se decidió, en una oración
Alternativas  → qué más se evaluó y por qué se descartó
Consecuencias → qué mejora, qué empeora, qué queda pendiente</code></pre>

<h4>Cuándo escribir uno</h4>
<p>Con el criterio de la primera lección: <b>solo para decisiones caras de revertir</b>. Elegir una librería de
fechas no lleva ADR. Decidir el modelo de multi-tenancy, sí.</p>
<p>Regla práctica: si dentro de seis meses alguien podría preguntar "¿y por qué se hizo así?", va ADR.</p>
`,

      tecnico: `
<h4>La sección que más se subestima: alternativas</h4>
<p>Registrar solo la decisión tomada tiene la mitad del valor. Lo que hace útil a un ADR dentro de un año es
saber <b>qué más se consideró y por qué se descartó</b>, porque eso permite evaluar si las razones siguen
vigentes.</p>
<pre><code>Alternativas evaluadas

  A · Base de datos por cliente
      Descartada: 30 bases para migrar en cada cambio de esquema,
      y el costo fijo por base no cierra con nuestro precio.

  B · Esquema de Postgres por cliente
      Descartada: mismo problema de migraciones, con menos aislamiento.

  C · Tabla compartida + RLS       ← ELEGIDA
      Una sola migración. El aislamiento depende de las políticas,
      así que exige test de aislamiento obligatorio por tabla.</code></pre>

<div class="dato"><strong>Fijate en la última línea:</strong> deja explícito el <b>riesgo aceptado</b> y la
<b>mitigación</b>. Dentro de un año, si alguien encuentra una tabla sin política, el ADR no solo explica la
decisión: explica <b>qué disciplina hacía falta para que fuera segura</b> — y eso convierte un hallazgo suelto
en un incumplimiento identificable.</div>

<h4>Estados de un ADR</h4>
<table>
<tr><th>Estado</th><th>Qué significa</th></tr>
<tr><td><b>Propuesto</b></td><td>Escrito, en discusión</td></tr>
<tr><td><b>Aceptado</b></td><td>Es la decisión vigente</td></tr>
<tr><td><b>Reemplazado por N</b></td><td>Se cambió de opinión. <b>El original NO se borra</b></td></tr>
<tr><td><b>Obsoleto</b></td><td>Ya no aplica: eso que decidía no existe</td></tr>
</table>

<div class="dato"><strong>Que el original no se borre es la parte contraintuitiva y la más importante.</strong>
Un ADR reemplazado sigue siendo información valiosa: muestra que <b>esa alternativa ya se probó</b> y por qué
no funcionó. Sin eso, cada dos años alguien vuelve a proponer lo mismo con entusiasmo, y el equipo vuelve a
recorrer el mismo camino.</div>

<h4>Consecuencias, incluyendo las malas</h4>
<p>Un ADR que solo lista beneficios es publicidad, no documentación. La sección tiene tres partes:</p>
<pre><code>Positivas   · una sola migración por cambio de esquema
            · costo fijo bajo hasta ~200 tenants

Negativas   · una consulta sin filtro puede filtrar datos entre clientes
            · el rendimiento depende de índices que incluyan tenant_id
            · escalar más allá de 200 tenants exige repensar

Pendientes  · definir el gate de migración a otro modelo
            · test de aislamiento en toda tabla nueva</code></pre>

<div class="dato"><strong>La sección de pendientes es la que evita el olvido silencioso.</strong> Toda decisión
grande deja cosas sin resolver, y si no quedan escritas al lado de la decisión, se pierden — hasta que aparecen
como un problema urgente que "nadie vio venir", cuando en realidad se había visto y no se anotó.</div>

<h4>Dónde viven</h4>
<pre><code>proyecto/
  docs/decisiones/
    0001-multi-tenancy-con-rls.md
    0002-inngest-para-trabajos-asincronicos.md
    0003-monorepo-con-turborepo.md
    0004-r2-para-archivos-publicos.md</code></pre>
<p>Numerados, en el repositorio, revisados en el mismo pull request que introduce el cambio. Un ADR que vive en
una herramienta aparte se desactualiza; uno que viaja con el código se revisa cuando el código se revisa.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <rect x="24" y="28" width="632" height="56" rx="10" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="340" y="52" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="700">
    El código muestra QUÉ se decidió. Nunca muestra POR QUÉ.</text>
  <text x="340" y="72" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11">
    Sin el porqué, dentro de un año nadie puede distinguir “esto estaba mal” de “esto tenía una razón que sigue vigente”.</text>

  <text x="24" y="110" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS DOS SALIDAS MALAS DE NO REGISTRAR</text>

  <rect x="24" y="122" width="304" height="66" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="144" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">SE CAMBIA A CIEGAS</text>
  <text x="176" y="164" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">y se rompe algo que</text>
  <text x="176" y="180" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">nadie recordaba</text>

  <rect x="352" y="122" width="304" height="66" rx="10" fill="#f87171" fill-opacity=".18" stroke="#f87171" stroke-width="1.6"/>
  <text x="504" y="144" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">NO SE TOCA NUNCA</text>
  <text x="504" y="164" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">rígido por DESCONOCIMIENTO,</text>
  <text x="504" y="180" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">no por diseño ← la más cara</text>

  <text x="24" y="216" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    UN ADR: UNA PÁGINA, CUATRO SECCIONES, VERSIONADO CON EL CÓDIGO</text>

  <rect x="24" y="228" width="152" height="66" rx="9" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="100" y="250" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">CONTEXTO</text>
  <text x="100" y="270" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">qué problema había</text>
  <text x="100" y="284" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">y qué restricciones</text>

  <rect x="188" y="228" width="152" height="66" rx="9" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.3"/>
  <text x="264" y="250" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">DECISIÓN</text>
  <text x="264" y="272" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">en una oración</text>

  <rect x="352" y="228" width="152" height="66" rx="9" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="428" y="250" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">ALTERNATIVAS</text>
  <text x="428" y="270" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">la más subestimada:</text>
  <text x="428" y="284" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">qué se descartó y por qué</text>

  <rect x="516" y="228" width="140" height="66" rx="9" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.2"/>
  <text x="586" y="250" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">CONSECUENCIAS</text>
  <text x="586" y="270" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">incluidas las MALAS</text>
  <text x="586" y="284" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">y lo que queda pendiente</text>

  <rect x="24" y="310" width="304" height="76" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="176" y="332" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">EL ADR REEMPLAZADO NO SE BORRA</text>
  <text x="44" y="354" fill="currentColor" opacity=".72" font-size="10.5">muestra que esa alternativa YA se probó</text>
  <text x="44" y="374" fill="#34d399" font-size="10.5" font-weight="700">si no, cada dos años alguien la vuelve a proponer</text>

  <rect x="352" y="310" width="304" height="76" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="504" y="332" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">CUÁNDO ESCRIBIR UNO</text>
  <text x="372" y="354" fill="currentColor" opacity=".72" font-size="10.5">solo decisiones CARAS DE REVERTIR</text>
  <text x="372" y="374" fill="#f87171" font-size="10.5" font-weight="700">¿en 6 meses alguien va a preguntar por qué? → ADR</text>
</svg>`,
        pie: 'Un ADR reemplazado sigue valiendo: prueba que esa alternativa ya se recorrió.',
      },

      entrevista: [
        { p: '¿Qué es un ADR y qué problema resuelve?',
          r: 'Un documento de una página, versionado con el código, que registra <b>por qué</b> se tomó una decisión de arquitectura: contexto, ' +
             'decisión, alternativas descartadas y consecuencias. Resuelve que <b>el código muestra qué se decidió pero nunca por qué</b>. ' +
             'Sin ese registro, dentro de un año nadie puede distinguir "esto estaba mal" de "esto tenía una razón que sigue vigente", y pasa una de ' +
             'dos cosas igual de malas: se cambia a ciegas y se rompe, o <b>no se toca nunca por miedo</b> — y el sistema se vuelve rígido por ' +
             'desconocimiento, no por diseño.' },

        { p: '¿Cuál es la sección más importante de un ADR?',
          r: 'Las <b>alternativas descartadas</b>, y es la que más se omite. Registrar solo la decisión tomada tiene la mitad del valor; ' +
             'lo que hace útil al documento en un año es saber qué más se evaluó y <b>por qué no</b>, porque permite comprobar si esas razones ' +
             'siguen vigentes. Y conviene que cada alternativa diga qué riesgo se aceptó y con qué mitigación: eso convierte un hallazgo suelto ' +
             'en un incumplimiento identificable.' },

        { p: '¿Qué se hace cuando una decisión registrada cambia?',
          r: 'Se escribe un ADR nuevo y el anterior se marca como <b>reemplazado</b>, pero <b>no se borra</b>. Es la parte contraintuitiva y la más ' +
             'importante: un ADR reemplazado sigue siendo información valiosa porque muestra que <b>esa alternativa ya se probó</b> y por qué no ' +
             'funcionó. Sin eso, cada dos años alguien vuelve a proponer lo mismo con entusiasmo y el equipo recorre otra vez el mismo camino.' },

        { p: '¿Para qué decisiones se escribe un ADR?',
          r: 'Solo para las <b>caras de revertir</b>. Elegir una librería de fechas no lleva ADR; decidir el modelo de multi-tenancy sí. ' +
             'La regla práctica que uso es: <b>si dentro de seis meses alguien podría preguntar "¿y por qué se hizo así?", va ADR</b>. ' +
             'Escribir uno por cada decisión chica vuelve el registro ruidoso y deja de leerse, que es exactamente el fracaso que se quería evitar.' },
      ],

      practica: `
<h4>Plantilla completa</h4>
<pre><code># 0001 · Multi-tenancy con tabla compartida y RLS

Estado: Aceptado · 2026-08-08

## Contexto
SaaS B2B con clientes que no deben verse entre sí. Esperamos 20-50
clientes en el primer año. Equipo de 2 personas. Presupuesto de
infraestructura acotado. El esquema va a cambiar seguido durante el
primer año.

## Decisión
Tabla compartida con columna tenant_id y Row Level Security en
PostgreSQL. El tenant sale de un claim del JWT, nunca del cliente.

## Alternativas evaluadas
A · Base por cliente — descartada: 50 migraciones por cambio de esquema
    y costo fijo por base que no cierra con nuestro precio.
B · Esquema por cliente — descartada: mismo problema de migraciones,
    con menos aislamiento real del que aparenta.
C · Tabla compartida + RLS — ELEGIDA.

## Consecuencias
Positivas
  · Una sola migración por cambio.
  · Costo fijo bajo hasta ~200 tenants.
  · El aislamiento vive en la base, no en el código de la aplicación.

Negativas
  · Una consulta con service_role saltea RLS: hay que auditar sus usos.
  · Todo índice debe incluir tenant_id o el rendimiento se degrada.
  · Más de ~200 tenants exige repensar el modelo.

Pendientes
  · Definir el gate concreto de migración (número de tenants o tamaño).
  · Test de aislamiento obligatorio en toda tabla nueva.</code></pre>

<div class="aviso"><strong>Ese ADR tarda veinte minutos en escribirse</strong> y responde por adelantado la
mayoría de las preguntas que van a aparecer durante los dos años siguientes — incluida la más importante:
<b>bajo qué condición esta decisión deja de servir</b>.</div>

<h4>Cuándo sí y cuándo no</h4>
<table>
<tr><th>Decisión</th><th>¿ADR?</th></tr>
<tr><td>Modelo de multi-tenancy</td><td>✔ Sí</td></tr>
<tr><td>Monolito o servicios separados</td><td>✔ Sí</td></tr>
<tr><td>Elegir Inngest en vez de cron propio</td><td>✔ Sí</td></tr>
<tr><td>Mover archivos a un almacenamiento sin egreso</td><td>✔ Sí</td></tr>
<tr><td>Qué librería de fechas</td><td>✘ No</td></tr>
<tr><td>Nombre de una carpeta</td><td>✘ No</td></tr>
<tr><td>Formato de los commits</td><td>✘ No (va en el README)</td></tr>
</table>

<h4>Cómo se mantienen vivos</h4>
<pre><code>· Van en docs/decisiones/ del propio proyecto, numerados.
· Se revisan en el MISMO pull request que introduce el cambio.
· Se enlazan desde el CLAUDE.md o README del proyecto.
· Cuando una decisión cambia: ADR nuevo + marcar el viejo como
  "Reemplazado por 00XX". Nunca borrar.</code></pre>

<div class="dato"><strong>El punto de revisarlo en el mismo pull request es el que los mantiene
sinceros.</strong> Un ADR escrito después, cuando ya se implementó, tiende a justificar lo que se hizo en vez
de registrar lo que se pensó. Escrito antes o durante, todavía tiene las dudas reales adentro.</div>
`,

      errores: [
        { mito: 'Escribo un ADR por cada decisión técnica.',
          realidad: 'Solo para las <b>caras de revertir</b>. Un registro con cincuenta documentos sobre decisiones triviales deja de leerse, ' +
                    'que es exactamente el fracaso que se quería evitar. La regla: si en seis meses alguien podría preguntar el porqué, va.' },

        { mito: 'Con anotar la decisión alcanza.',
          realidad: 'Sin las <b>alternativas descartadas</b> perdés la mitad del valor: en un año nadie puede evaluar si las razones siguen ' +
                    'vigentes. Y sin las <b>consecuencias negativas</b>, el documento es publicidad, no documentación.' },

        { mito: 'Cuando la decisión cambia, actualizo el ADR viejo.',
          realidad: 'Se escribe uno <b>nuevo</b> y el viejo se marca como reemplazado. El original prueba que esa alternativa ya se recorrió — ' +
                    'sin eso, cada dos años alguien la vuelve a proponer.' },

        { mito: 'Los ADR los escribo después, cuando ya está implementado.',
          realidad: 'Ahí tienden a <b>justificar</b> lo que se hizo en vez de registrar lo que se pensó. Escritos antes o durante, y revisados en el ' +
                    'mismo pull request, conservan las dudas reales — que es lo que los hace útiles.' },
      ],

      glosario: [
        { t: 'ADR', d: 'Architecture Decision Record: registro corto de una decisión y su porqué.' },
        { t: 'Contexto', d: 'Problema y restricciones que existían al decidir.' },
        { t: 'Alternativas', d: 'Opciones evaluadas y descartadas, con su motivo.' },
        { t: 'Consecuencias', d: 'Lo que mejora, lo que empeora y lo que queda pendiente.' },
        { t: 'Reemplazado', d: 'Estado de un ADR cuya decisión fue cambiada por otra posterior.' },
        { t: 'Gate', d: 'Condición explícita bajo la cual una decisión deja de servir.' },
        { t: 'Riesgo aceptado', d: 'Consecuencia negativa que se asume a propósito, con su mitigación.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Qué criterio distingue una decisión de arquitectura de una que no lo es?',
      opciones: [
        'El costo de revertirla dentro de un año',
        'Si aparece en el diagrama del sistema',
        'Si la toma una persona senior',
        'Si involucra más de un archivo',
      ],
      correcta: 0,
      porQue: 'Si equivocarte cuesta una tarde, es diseño y se cambia mientras trabajás. Si cuesta meses —multi-tenancy, modelo de datos, límites entre partes— es arquitectura.',
      porQueNo: {
        1: 'El diagrama es una foto de las decisiones, no lo que las define.',
        2: 'Quién decide no cambia la naturaleza de la decisión.',
        3: 'Muchos cambios tocan varios archivos y son triviales de revertir.',
      },
    },
    {
      p: '¿Cuál es el error más común al tomar decisiones técnicas?',
      opciones: [
        'Aplicar el proceso equivocado: tratar una reversible como irreversible, o al revés',
        'No documentar lo suficiente',
        'No consultar con el equipo',
        'Elegir tecnologías nuevas',
      ],
      correcta: 0,
      porQue: 'Tratar una reversible como irreversible produce parálisis y reuniones eternas. Tratar una irreversible como reversible produce la deuda que va a doler años. Primero clasificás, después discutís.',
      porQueNo: {
        1: 'Documentar de más también es un costo; el problema es no distinguir qué merece documentarse.',
        2: 'Consultar todas las decisiones consume la energía que necesitás para las que importan.',
        3: 'Puede ser un riesgo, pero no es el error estructural.',
      },
    },
    {
      p: '¿Qué factor hace más difícil de revertir una decisión?',
      opciones: [
        'Los supuestos implícitos, porque nadie sabe dónde están enterrados',
        'La cantidad de líneas de código',
        'El lenguaje de programación elegido',
        'La antigüedad del proyecto',
      ],
      correcta: 0,
      porQue: 'Un sistema que asume "un usuario, una organización" no tiene esa regla escrita: está repartida en consultas sin filtro y tipos sin campo. El trabajo no es agregar una columna, es encontrar dónde quedó el supuesto.',
      porQueNo: {
        1: 'Un módulo grande y bien aislado puede reemplazarse; uno chico y difuso, no.',
        2: 'Influye, pero no es el factor determinante.',
        3: 'La antigüedad correlaciona con acoplamiento, pero no lo causa por sí sola.',
      },
    },
    {
      p: '¿Cómo se reduce el costo de equivocarse en arquitectura?',
      opciones: [
        'Haciendo que las decisiones sean más fáciles de revertir: aislar, escribir el porqué, reducir puntos de contacto',
        'Investigando más antes de cada decisión',
        'Eligiendo siempre la opción más flexible',
        'Postergando todas las decisiones lo máximo posible',
      ],
      correcta: 0,
      porQue: 'No se trata de acertar más, sino de bajar el costo del error donde el error es caro. No es construir de más: es reducir puntos de contacto con lo incierto.',
      porQueNo: {
        1: 'Ayuda en las decisiones caras, pero investigar todo paraliza.',
        2: 'La flexibilidad se paga en claridad; no es gratis.',
        3: 'Diferir sin límite convierte la decisión en algo que se toma por accidente.',
      },
    },
    {
      p: '¿Por qué no existe "la mejor arquitectura"?',
      opciones: [
        'Porque mejorar un atributo de calidad casi siempre empeora otro',
        'Porque las tecnologías cambian muy rápido',
        'Porque cada equipo tiene preferencias distintas',
        'Porque la arquitectura es subjetiva',
      ],
      correcta: 0,
      porQue: 'Más disponibilidad implica réplicas, que implican consistencia eventual, que complica el código. Las buenas decisiones pagan el precio en algo que a ese proyecto no le importa.',
      porQueNo: {
        1: 'Es cierto pero secundario: los intercambios son estructurales, no de moda.',
        2: 'Las preferencias existen, pero el argumento real son los intercambios medibles.',
        3: 'Los intercambios son objetivos; lo que varía es la prioridad del proyecto.',
      },
    },
    {
      p: '¿Cómo se escribe un atributo de calidad de forma útil?',
      opciones: [
        'Con número, condición y contexto — y qué degradación se acepta al escalar',
        'Como un objetivo general del equipo',
        'Indicando qué tecnología lo garantiza',
        'Con un adjetivo claro: rápido, seguro, escalable',
      ],
      correcta: 0,
      porQue: 'La segunda parte —qué degradación se acepta— es la que casi nadie escribe y la más valiosa: sin ella, cualquier lentitud futura se discute como falla cuando puede ser lo acordado.',
      porQueNo: {
        1: 'Un objetivo general no se puede verificar ni negociar.',
        2: 'Ninguna tecnología garantiza un atributo por sí sola.',
        3: '"Rápido" no dice cuánto, con qué carga ni en qué percentil.',
      },
    },
    {
      p: '¿Qué regla fuerza a decidir de verdad las prioridades de un sistema?',
      opciones: [
        'Como máximo dos atributos críticos',
        'Todos los atributos deben ser al menos importantes',
        'Priorizar siempre la seguridad',
        'Definir un responsable por atributo',
      ],
      correcta: 0,
      porQue: 'Si todo es crítico, no se decidió nada, y en la práctica el sistema termina optimizando lo que eligió quien escribió el código ese día.',
      porQueNo: {
        1: 'Es exactamente el problema: sin sacrificios explícitos no hay decisión.',
        2: 'Depende del sistema: en una landing la prioridad es otra.',
        3: 'Útil para ejecutar, pero no reemplaza la priorización.',
      },
    },
    {
      p: '¿Qué atributo se subestima más y por qué importa?',
      opciones: [
        'La simplicidad: es lo que más afecta la velocidad futura, porque un sistema simple se cambia y uno complejo se negocia',
        'La escalabilidad, porque todo producto crece',
        'La disponibilidad, porque las caídas son visibles',
        'El rendimiento, porque los usuarios lo notan',
      ],
      correcta: 0,
      porQue: 'Se trata como si fuera lo que queda cuando no hiciste nada bien. Elegir simplicidad es una decisión activa, no una omisión.',
      porQueNo: {
        1: 'Suele estar sobrevalorada: la mayoría de los productos no llega a la escala que anticipa.',
        2: 'Es visible y por eso rara vez se subestima.',
        3: 'También es visible y suele estar bien atendido.',
      },
    },
    {
      p: 'Después de un cambio chico, ¿qué pregunta detecta acoplamiento excesivo?',
      opciones: [
        '¿Toqué archivos que no tienen nada que ver con lo que cambié?',
        '¿Toqué muchos archivos?',
        '¿Escribí muchas líneas?',
        '¿Tardé más de lo estimado?',
      ],
      correcta: 0,
      porQue: 'Tocar componente, tipo, servicio y migración de la misma funcionalidad es cohesión buena. El problema aparece cuando agregar un campo a cliente te obliga a tocar facturación, reportes y envíos.',
      porQueNo: {
        1: 'La cantidad sola no distingue cohesión buena de acoplamiento malo.',
        2: 'El volumen de código no indica dónde están los límites.',
        3: 'Puede deberse a muchas causas ajenas al diseño.',
      },
    },
    {
      p: '¿Qué regla ordena la dirección de las dependencias?',
      opciones: [
        'Lo estable no depende de lo volátil',
        'Todo depende de la base de datos',
        'Cada módulo depende como máximo de tres',
        'Las dependencias deben ser bidireccionales',
      ],
      correcta: 0,
      porQue: 'Las reglas de negocio son estables y no deberían importar el framework de UI. Cuando se invierte, el síntoma es que cambiar el color de un botón te obliga a tocar el cálculo de impuestos.',
      porQueNo: {
        1: 'Es justamente lo que hace difícil cambiar de proveedor de datos.',
        2: 'Un número arbitrario no captura qué depende de qué.',
        3: 'Las dependencias bidireccionales son la peor forma de acoplamiento.',
      },
    },
    {
      p: '¿Qué problema tiene una carpeta "utils" que crece sin control?',
      opciones: [
        'Cohesión coincidental: todo depende de ella y nadie la entiende',
        'Que los nombres de archivo se repiten',
        'Que aumenta el tamaño del bundle',
        'Que dificulta el autocompletado',
      ],
      correcta: 0,
      porQue: 'Agrupa cosas sin nada en común más allá de no encajar en otro lado. La cura es que cada vez que algo va ahí, alguien pregunte a qué funcionalidad pertenece realmente.',
      porQueNo: {
        1: 'Es un inconveniente menor, no el problema estructural.',
        2: 'Puede ocurrir, pero no es lo que la hace dañina.',
        3: 'Es una molestia, no una consecuencia arquitectónica.',
      },
    },
    {
      p: 'Al organizar por funcionalidad, ¿qué hace falta para que realmente desacople?',
      opciones: [
        'Una puerta de adelante: un índice que define qué es público del módulo',
        'Que cada carpeta tenga menos de diez archivos',
        'Que los nombres estén en inglés',
        'Que cada funcionalidad tenga sus propios tests',
      ],
      correcta: 0,
      porQue: 'Si los demás módulos importan archivos internos, es la misma maraña con otra estructura de directorios. Lo no exportado en el índice es interno y se puede cambiar sin avisar.',
      porQueNo: {
        1: 'El tamaño no determina si el límite se respeta.',
        2: 'El idioma es una convención, no un mecanismo de aislamiento.',
        3: 'Los tests son valiosos pero no definen el contrato público.',
      },
    },
    {
      p: '¿Cuál es la sección más subestimada de un ADR?',
      opciones: [
        'Las alternativas descartadas y por qué',
        'El título',
        'La fecha',
        'El nombre de quien decidió',
      ],
      correcta: 0,
      porQue: 'Es lo que permite evaluar en un año si las razones siguen vigentes. Registrar solo la decisión tomada tiene la mitad del valor.',
      porQueNo: {
        1: 'Ayuda a encontrarlo, pero no aporta criterio.',
        2: 'Da contexto temporal, nada más.',
        3: 'Los ADR describen decisiones del sistema, no atribuciones personales.',
      },
    },
    {
      p: 'Una decisión registrada en un ADR cambia. ¿Qué se hace con el documento original?',
      opciones: [
        'Se marca como reemplazado y NO se borra: prueba que esa alternativa ya se recorrió',
        'Se borra para evitar confusión',
        'Se edita para reflejar la decisión nueva',
        'Se archiva fuera del repositorio',
      ],
      correcta: 0,
      porQue: 'Sin ese registro, cada dos años alguien vuelve a proponer lo mismo con entusiasmo y el equipo recorre otra vez el mismo camino.',
      porQueNo: {
        1: 'Se pierde la información de qué ya se probó y por qué falló.',
        2: 'Se pierde el rastro de la evolución del razonamiento.',
        3: 'Fuera del repositorio deja de revisarse cuando el código se revisa.',
      },
    },
    {
      p: '¿Cuándo conviene escribir el ADR?',
      opciones: [
        'Antes o durante, y revisarlo en el mismo pull request que introduce el cambio',
        'Después de implementar, cuando ya se sabe si funcionó',
        'Al cierre del trimestre, junto con los demás',
        'Solo si alguien lo pide',
      ],
      correcta: 0,
      porQue: 'Escrito después, tiende a justificar lo que se hizo en vez de registrar lo que se pensó. Escrito antes o durante, conserva las dudas reales, que es lo que lo hace útil.',
      porQueNo: {
        1: 'Ahí el documento se vuelve una racionalización de lo ya hecho.',
        2: 'A esa altura ya se perdieron el contexto y las alternativas evaluadas.',
        3: 'Si depende del pedido, las decisiones caras quedan sin registrar.',
      },
    },
  ],
});
