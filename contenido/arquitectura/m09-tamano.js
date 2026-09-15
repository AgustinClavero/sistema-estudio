/* ==========================================================================
   Arquitectura · Módulo 09 — Elegir el tamaño correcto
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'arquitectura',
  id: 'm09',
  titulo: 'Elegir el tamaño correcto',
  fuentes: ['fowler', 'adr', 'supabase-precios', 'aws-precios'],

  intro:
    '<p>Este es el módulo bisagra del track: el que junta todo lo anterior en una sola pregunta — ' +
    '<b>¿este problema necesita una solución simple, una compleja, o una que escale?</b></p>' +
    '<p>La respuesta correcta casi siempre es más aburrida de lo que uno querría. Y el objetivo acá no es ' +
    'convencerte de que "simple es mejor" —a veces no lo es— sino darte <b>un método para decidir</b> y para ' +
    'defender la decisión con argumentos en vez de preferencias.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'El costo de la complejidad',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> la complejidad no se paga una vez cuando la
agregás: se paga <b>todos los meses</b>, en cada cambio, cada incidente y cada persona nueva.</div>

<h4>Los cuatro costos, y solo el primero es visible</h4>
<ol>
<li><b>Construirla.</b> Es el único que se estima antes.</li>
<li><b>Entenderla.</b> Cada persona que toca el sistema paga este costo, para siempre.</li>
<li><b>Operarla.</b> Más piezas, más despliegues, más cosas que fallan.</li>
<li><b>Cambiarla.</b> Un cambio simple sobre un sistema complejo deja de ser simple.</li>
</ol>

<div class="aviso"><strong>El segundo es el que más se subestima y el que más cuesta a largo plazo.</strong>
Una arquitectura que tarda dos días en entenderse cobra dos días <b>por cada persona nueva</b>, y frena a todo
el equipo cada vez que alguien tiene que tocar una parte que no conoce. Ese costo no aparece en ninguna
estimación y aparece en todos los sprints.</div>

<h4>La complejidad accidental</h4>
<p>Hay dos tipos y solo uno se puede reducir:</p>
<ul>
<li><b>Esencial</b> — viene del problema. Facturar con impuestos argentinos es complejo porque las reglas son complejas.</li>
<li><b>Accidental</b> — la agregaste vos. Cinco capas de abstracción para guardar un cliente.</li>
</ul>
<p>El trabajo de arquitectura no es eliminar complejidad —parte es inevitable— sino <b>no agregar la que no
hace falta</b> y poner la que sí hace falta en el lugar correcto.</p>

<h4>El síntoma más honesto</h4>
<pre><code>¿Cuánto tarda alguien con experiencia en ubicar dónde va un cambio de una línea?

  Minutos    → la complejidad está bajo control
  Una hora   → hay que mirar
  Dos días   → la arquitectura cobra más de lo que devuelve</code></pre>

<p>Es una medida imperfecta y es la mejor que hay: una arquitectura existe para que los cambios sean más
fáciles. Si no lo logra, no importa cuán correcta sea en el papel.</p>
`,

      tecnico: `
<h4>El presupuesto de complejidad</h4>
<p>Un equipo puede sostener una cantidad limitada de complejidad. Gastarla en un lugar significa no tenerla
para otro. Por eso conviene pensarla como un presupuesto:</p>
<pre><code>Equipo de 2 personas
  Presupuesto: bajo.
  Alcanza para: monolito modular + una base + una cola gestionada.
  NO alcanza para: microservicios + Kubernetes propio + CQRS.

Equipo de 15
  Presupuesto: medio.
  Alcanza para: lo anterior + algún servicio extraído + observabilidad rica.</code></pre>

<div class="dato"><strong>Y la parte más útil de pensarlo así: cuando alguien propone algo complejo, la
pregunta deja de ser "¿es buena idea?" y pasa a ser <b>"¿de dónde sacamos el presupuesto?"</b>.</strong> Eso
convierte una discusión de opiniones en una de prioridades — y obliga a nombrar qué se va a dejar de hacer.</div>

<h4>Dónde poner la complejidad que sí hace falta</h4>
<table>
<tr><th>Ubicación</th><th>Costo de tenerla ahí</th></tr>
<tr><td><b>En un módulo aislado</b></td><td>Bajo: solo la paga quien lo toca</td></tr>
<tr><td>En una librería con buena interfaz</td><td>Bajo</td></tr>
<tr><td>En la configuración</td><td>Medio: invisible hasta que falla</td></tr>
<tr><td><b>Repartida por todo el código</b></td><td>Máximo: la paga todo el mundo, siempre</td></tr>
</table>

<div class="dato"><strong>La misma cantidad de complejidad cuesta radicalmente distinto según dónde
esté.</strong> El cálculo de impuestos argentinos es inevitablemente complejo; concentrado en
<code>impuestos.ts</code> con una interfaz clara, casi nadie lo paga. Repartido en quince componentes, lo paga
todo el equipo todos los días. <b>La decisión no es cuánta complejidad tener: es dónde ponerla.</b></div>

<h4>Señales de complejidad accidental</h4>
<pre><code>· Configuración que nadie recuerda para qué está
· Abstracciones con una sola implementación
· Capas que solo reenvían llamadas
· Código que existe "por si acaso"
· Un patrón aplicado porque estaba en un artículo
· Dependencias que se usan una vez
· Banderas de funcionalidad de hace un año, siempre encendidas</code></pre>

<div class="dato"><strong>La última es la más fácil de resolver y la más olvidada.</strong> Una bandera que
lleva un año encendida <b>ya no es una bandera</b>: es una rama muerta del código que hay que mantener y
probar. Borrar las viejas es una tarde de trabajo que reduce complejidad real sin ningún riesgo.</div>

<h4>La deuda técnica, con nombre honesto</h4>
<table>
<tr><th>Tipo</th><th>Qué es</th><th>Qué hacer</th></tr>
<tr><td><b>Deliberada y prudente</b></td><td>"Salimos rápido, lo arreglamos después"</td><td>Anotarla, con fecha</td></tr>
<tr><td><b>Deliberada e imprudente</b></td><td>"No tenemos tiempo para diseño"</td><td>Evitarla</td></tr>
<tr><td><b>Accidental y prudente</b></td><td>"Ahora sabemos cómo debería haber sido"</td><td>Normal: es aprendizaje</td></tr>
<tr><td><b>Accidental e imprudente</b></td><td>"¿Qué es una capa?"</td><td>Formación</td></tr>
</table>

<div class="dato"><strong>La primera fila es legítima y la que más se usa mal.</strong> Deuda deliberada y
prudente significa que <b>sabés qué estás postergando y por qué</b> — y eso implica anotarlo. Sin registro, en
seis meses nadie recuerda que era un atajo, y el atajo se convierte en "así funciona el sistema".</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS CUATRO COSTOS — y solo el primero se estima</text>

  <rect x="24" y="34" width="152" height="76" rx="10" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="100" y="54" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">1 · CONSTRUIRLA</text>
  <text x="100" y="74" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">una vez</text>
  <text x="100" y="94" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-weight="700">el único que se estima</text>

  <rect x="188" y="34" width="152" height="76" rx="10" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.8"/>
  <text x="264" y="54" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">2 · ENTENDERLA</text>
  <text x="264" y="74" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">POR CADA PERSONA</text>
  <text x="264" y="94" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">nueva, para siempre</text>

  <rect x="352" y="34" width="152" height="76" rx="10" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="428" y="54" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">3 · OPERARLA</text>
  <text x="428" y="74" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">todos los meses</text>
  <text x="428" y="94" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">más piezas, más fallas</text>

  <rect x="516" y="34" width="140" height="76" rx="10" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="586" y="54" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">4 · CAMBIARLA</text>
  <text x="586" y="74" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">en cada cambio</text>
  <text x="586" y="94" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">lo simple deja de serlo</text>

  <rect x="24" y="122" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="143" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    El costo 2 no aparece en ninguna estimación y aparece en todos los sprints.</text>

  <line x1="24" y1="176" x2="656" y2="176" stroke="currentColor" opacity=".18"/>

  <text x="24" y="200" fill="#34d399" font-size="12" font-weight="700">
    LA MISMA COMPLEJIDAD CUESTA DISTINTO SEGÚN DÓNDE ESTÉ</text>

  <rect x="24" y="212" width="304" height="94" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="176" y="232" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">CONCENTRADA</text>
  <rect x="140" y="242" width="72" height="40" rx="8" fill="#34d399" fill-opacity=".35"/>
  <text x="176" y="266" text-anchor="middle" fill="#06281c" font-size="8.5" font-weight="700">impuestos.ts</text>
  <text x="176" y="298" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">casi nadie la paga</text>

  <rect x="352" y="212" width="304" height="94" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.5"/>
  <text x="504" y="232" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">REPARTIDA</text>
  <g fill="#f87171" fill-opacity=".3">
    <rect x="376" y="242" width="34" height="18" rx="4"/><rect x="418" y="242" width="34" height="18" rx="4"/>
    <rect x="460" y="242" width="34" height="18" rx="4"/><rect x="502" y="242" width="34" height="18" rx="4"/>
    <rect x="544" y="242" width="34" height="18" rx="4"/><rect x="586" y="242" width="34" height="18" rx="4"/>
    <rect x="376" y="264" width="34" height="18" rx="4"/><rect x="418" y="264" width="34" height="18" rx="4"/>
    <rect x="460" y="264" width="34" height="18" rx="4"/><rect x="502" y="264" width="34" height="18" rx="4"/>
    <rect x="544" y="264" width="34" height="18" rx="4"/><rect x="586" y="264" width="34" height="18" rx="4"/>
  </g>
  <text x="504" y="298" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">la paga todo el equipo, todos los días</text>

  <rect x="24" y="316" width="632" height="30" rx="8" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="340" y="336" text-anchor="middle" fill="#7c5cff" font-size="11.5" font-weight="700">
    La decisión no es cuánta complejidad tener: es DÓNDE PONERLA.</text>

  <rect x="24" y="356" width="632" height="30" rx="8" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="340" y="376" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">
    Ante una propuesta compleja: no “¿es buena idea?” sino “¿DE DÓNDE SACAMOS EL PRESUPUESTO?”</text>
</svg>`,
        pie: 'La complejidad se paga todos los meses, en cada cambio y con cada persona nueva.',
      },

      entrevista: [
        { p: '¿Cuáles son los costos de la complejidad y cuál se subestima más?',
          r: 'Cuatro: <b>construirla</b> —el único que se estima—, <b>entenderla</b>, <b>operarla</b> y <b>cambiarla</b>. ' +
             'El que más se subestima es el segundo: una arquitectura que tarda dos días en entenderse cobra dos días ' +
             '<b>por cada persona nueva</b>, y frena al equipo cada vez que alguien toca una parte que no conoce. ' +
             'Ese costo <b>no aparece en ninguna estimación y aparece en todos los sprints</b>.' },

        { p: '¿Qué diferencia hay entre complejidad esencial y accidental?',
          r: 'La <b>esencial</b> viene del problema: facturar con impuestos argentinos es complejo porque las reglas lo son. La <b>accidental</b> la ' +
             'agregaste vos: cinco capas para guardar un cliente. El trabajo de arquitectura no es eliminar complejidad —parte es inevitable— ' +
             'sino <b>no agregar la que no hace falta</b> y poner la que sí hace falta en el lugar correcto. ' +
             'La misma complejidad concentrada en un módulo casi no la paga nadie; repartida en quince archivos la paga todo el equipo todos los días.' },

        { p: '¿Cómo cambia la discusión pensar la complejidad como presupuesto?',
          r: 'Porque cuando alguien propone algo complejo, la pregunta deja de ser "¿es buena idea?" —que se contesta con opiniones— y pasa a ser ' +
             '<b>"¿de dónde sacamos el presupuesto?"</b>. Un equipo puede sostener una cantidad limitada de complejidad, y gastarla en un lugar ' +
             'significa no tenerla para otro. Eso convierte la discusión en una de <b>prioridades</b>, y obliga a nombrar qué se va a dejar de hacer.' },

        { p: '¿Cuál es el síntoma más honesto de exceso de arquitectura?',
          r: 'Cuánto tarda alguien con experiencia en <b>ubicar dónde va un cambio de una línea</b>. Minutos significa que está bajo control; ' +
             'una hora es señal de mirar; dos días significa que la arquitectura cobra más de lo que devuelve. ' +
             'Es una medida imperfecta y es la mejor que hay, porque una arquitectura existe justamente para que los cambios sean más fáciles: ' +
             'si no lo logra, da igual cuán correcta sea en el papel.' },
      ],

      practica: `
<h4>Detectar complejidad accidental, con comandos</h4>
<pre><code># Abstracciones con un solo implementador
for f in $(grep -rl "^export interface" src/); do
  nombre=$(grep -oP "export interface \\K\\w+" "$f" | head -1)
  usos=$(grep -rl ": $nombre\\b\\|implements $nombre" src/ | wc -l)
  [ "$usos" -le 1 ] &amp;&amp; echo "$nombre — $usos implementación"
done

# Dependencias que se usan una sola vez
for dep in $(jq -r '.dependencies | keys[]' package.json); do
  n=$(grep -rl "from '$dep'" src/ | wc -l)
  [ "$n" -le 1 ] &amp;&amp; echo "$dep — $n archivo"
done

# Banderas viejas: rama muerta que hay que mantener y probar
grep -rn "bandera(\\|featureFlag(" src/ | sort</code></pre>

<div class="aviso"><strong>El último comando suele dar el resultado más rentable.</strong> Una bandera que
lleva un año encendida <b>ya no es una bandera</b>: es una rama muerta del código. Borrar las viejas es una
tarde de trabajo que reduce complejidad real, sin ningún riesgo y sin discusión.</div>

<h4>Registrar deuda deliberada</h4>
<pre><code>// TODO(deuda): cálculo de comisión duplicado con facturacion/comision.ts
// Motivo: salimos con la demo del 12/08 y no había tiempo de unificar.
// Revisar: 2026-09-15
// Riesgo si no se hace: las dos copias se desincronizan y los montos difieren.</code></pre>

<p>Sin ese comentario, en seis meses nadie recuerda que era un atajo — y el atajo se convierte en
"así funciona el sistema".</p>

<h4>Una revisión trimestral de complejidad</h4>
<table>
<tr><th>Pregunta</th><th>Acción si la respuesta es mala</th></tr>
<tr><td>¿Cuánto tarda alguien nuevo en su primer cambio?</td><td>&gt; 3 días → simplificar</td></tr>
<tr><td>¿Hay banderas de más de 6 meses?</td><td>Borrarlas</td></tr>
<tr><td>¿Hay interfaces con un implementador?</td><td>Quitar la indirección</td></tr>
<tr><td>¿Hay dependencias usadas una vez?</td><td>Escribir esa función</td></tr>
<tr><td>¿Hay configuración que nadie sabe qué hace?</td><td>Investigar y borrar</td></tr>
<tr><td>¿Hay capas que solo reenvían?</td><td>Fusionarlas</td></tr>
</table>

<h4>Concentrar la complejidad inevitable</h4>
<pre><code>// ❌ Reglas fiscales repartidas
// componentes/FormularioFactura.tsx  → calcula IVA
// servicios/facturacion.ts           → recalcula IVA
// reportes/mensual.ts                → vuelve a calcularlo, con otra redondeo

// ✔ Un módulo, con una interfaz simple
// dominio/impuestos.ts
export function calcularImpuestos(items: Item[], condicion: CondicionFiscal): Impuestos { … }
// Adentro puede ser complejo. Afuera es una función.</code></pre>
`,

      errores: [
        { mito: 'La complejidad se paga cuando la construyo.',
          realidad: 'Ese es el <b>único costo que se estima</b>. Después se paga en entenderla —por cada persona, para siempre—, en operarla ' +
                    'y en cada cambio. El de entenderla no aparece en ninguna estimación y aparece en todos los sprints.' },

        { mito: 'Hay que eliminar la complejidad.',
          realidad: 'Parte es <b>esencial</b> y viene del problema. Lo que se decide no es cuánta tener sino <b>dónde ponerla</b>: ' +
                    'concentrada en un módulo casi nadie la paga; repartida, la paga todo el equipo todos los días.' },

        { mito: 'Una interfaz de más no molesta.',
          realidad: 'Una abstracción con <b>un solo implementador</b> es indirección pura: alguien tiene que abrir dos archivos para entender qué hace ' +
                    'una función. Multiplicado por veinte, eso es el costo de entender.' },

        { mito: 'Las banderas de funcionalidad viejas se pueden dejar.',
          realidad: 'Una bandera encendida hace un año <b>ya no es una bandera</b>: es una rama muerta que hay que mantener y probar. ' +
                    'Borrarlas es una tarde y reduce complejidad real sin ningún riesgo.' },
      ],

      glosario: [
        { t: 'Complejidad esencial', d: 'La que viene del problema y no se puede eliminar.' },
        { t: 'Complejidad accidental', d: 'La que agrega la solución. Es la que se puede reducir.' },
        { t: 'Presupuesto de complejidad', d: 'Cuánta puede sostener un equipo. Gastarla en un lado la quita de otro.' },
        { t: 'Concentrar complejidad', d: 'Ponerla en un módulo con interfaz simple para que pocos la paguen.' },
        { t: 'Deuda deliberada', d: 'Atajo consciente. Legítimo solo si queda registrado con fecha.' },
        { t: 'Indirección', d: 'Capa que hay que atravesar para entender qué hace algo.' },
        { t: 'Rama muerta', d: 'Camino de código que ya no se ejecuta pero hay que mantener.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Escalar cuando duele, no antes',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> optimizar sin medir es adivinar. Y la mayoría de
las veces se adivina mal, porque el cuello de botella <b>casi nunca está donde uno cree</b>.</div>

<h4>El orden correcto</h4>
<pre><code>1 · Medir       ¿dónde está realmente el tiempo?
2 · Entender    ¿por qué tarda ahí?
3 · Arreglar    lo más barato que resuelva el 80%
4 · Medir       ¿mejoró? ¿cuánto?</code></pre>

<div class="aviso"><strong>El paso 4 es el que casi nadie hace, y es el que evita el trabajo inútil.</strong>
Sin medir después, no sabés si la optimización sirvió — y en la práctica la mitad de las "optimizaciones"
no mueven la aguja, porque el cuello estaba en otro lado. <b>Sin ese paso, el equipo acumula complejidad que
no compró nada.</b></div>

<h4>Dónde está el tiempo, casi siempre</h4>
<table>
<tr><th>Causa</th><th>Frecuencia</th><th>Costo de arreglar</th></tr>
<tr><td><b>Falta un índice</b></td><td>Altísima</td><td>Minutos</td></tr>
<tr><td><b>N+1</b></td><td>Altísima</td><td>Una tarde</td></tr>
<tr><td>Traer columnas o filas de más</td><td>Alta</td><td>Una tarde</td></tr>
<tr><td>Falta de caché en algo caro y repetido</td><td>Alta</td><td>Un día</td></tr>
<tr><td>Llamadas en cascada</td><td>Media</td><td>Horas</td></tr>
<tr><td>El servidor está chico</td><td>Media</td><td>Un clic</td></tr>
<tr><td>El algoritmo es malo</td><td>Baja</td><td>Variable</td></tr>
<tr><td>El lenguaje es lento</td><td>Casi nunca</td><td>Enorme</td></tr>
</table>

<div class="dato"><strong>Las dos primeras filas explican la enorme mayoría de los problemas de rendimiento
de una aplicación web</strong>, y las dos se arreglan en horas. La última —"el lenguaje es lento"— es la que
más se propone y la que casi nunca es el problema real.</div>

<h4>Los tres números que hay que conocer</h4>
<pre><code>· Cuántos usuarios activos tenés HOY
· Cuál es tu p95 de respuesta HOY
· Cuánto gastás por mes HOY</code></pre>
<p>Sin esos tres, cualquier discusión sobre escalar es teórica. Con ellos, casi siempre se descubre que el
sistema está <b>muy lejos</b> de su techo.</p>
`,

      tecnico: `
<h4>Medir antes de tocar</h4>
<pre><code>-- Las consultas que más tiempo total consumen (con pg_stat_statements)
select substring(query, 1, 80) as consulta,
       calls, round(mean_exec_time::numeric, 2) as ms_promedio,
       round(total_exec_time::numeric / 1000, 1) as seg_total
  from pg_stat_statements
 order by total_exec_time desc
 limit 20;</code></pre>

<div class="dato"><strong>Ordenar por <b>tiempo total</b> y no por promedio es la diferencia entre encontrar
el problema y perseguir un fantasma.</strong> Una consulta de 2 segundos que corre una vez por día importa
menos que una de 30 ms que corre cien mil veces. La segunda consume mucho más tiempo total y es la que hay que
arreglar primero.</div>

<h4>Leer un plan de ejecución</h4>
<pre><code>explain (analyze, buffers)
select * from pedidos where tenant_id = '…' and estado = 'pendiente';</code></pre>
<p>Lo que hay que buscar:</p>
<ul>
<li><b>Seq Scan</b> sobre una tabla grande → falta un índice.</li>
<li><b>Rows</b> estimadas muy distintas de las reales → estadísticas viejas, hace falta <code>analyze</code>.</li>
<li><b>Nested Loop</b> con muchas iteraciones → suele ser un N+1 encubierto.</li>
<li><b>Sort</b> con "external merge" → se quedó sin memoria de trabajo.</li>
</ul>

<h4>El escalón de las técnicas, de barato a caro</h4>
<table>
<tr><th>#</th><th>Técnica</th><th>Ganancia típica</th><th>Costo</th></tr>
<tr><td>1</td><td>Índice faltante</td><td><b>10-1000×</b></td><td>Minutos</td></tr>
<tr><td>2</td><td>Resolver el N+1</td><td>10-100×</td><td>Una tarde</td></tr>
<tr><td>3</td><td>Traer solo lo necesario</td><td>2-10×</td><td>Una tarde</td></tr>
<tr><td>4</td><td>Caché de lo caro y repetido</td><td>10-100×</td><td>Un día + invalidación</td></tr>
<tr><td>5</td><td>Instancia más grande</td><td>2-4×</td><td>Un clic + factura</td></tr>
<tr><td>6</td><td>Réplica de lectura</td><td>2-5× en lecturas</td><td>Días + consistencia</td></tr>
<tr><td>7</td><td>Vista materializada</td><td>10-100× en agregados</td><td>Días + refresco</td></tr>
<tr><td>8</td><td>Partir el servicio</td><td>Variable</td><td><b>Meses</b></td></tr>
</table>

<div class="dato"><strong>Fijate que el paso 5 —una instancia más grande— está antes que casi todo lo
demás.</strong> Suele descartarse por orgullo técnico, y en la práctica <b>duplicar el servidor cuesta menos
que dos días de trabajo de una persona</b>. Es la optimización correcta mientras el problema sea de recursos y
no de diseño.</div>

<h4>Caché: la que más se hace mal</h4>
<p>Cachear es fácil; <b>invalidar</b> es donde están todos los problemas. Antes de agregar una caché hay que
responder tres cosas:</p>
<pre><code>1 · ¿Cuántos segundos de desactualización tolera este dato?
      Cero → no se cachea. Buscá la velocidad en otro lado.
2 · ¿Qué la invalida?
      Una escritura concreta, o simplemente el tiempo.
3 · ¿Qué pasa si sirve algo viejo?
      Si la respuesta es "un problema", no la agregues sin invalidación explícita.</code></pre>

<div class="dato"><strong>La caché mal invalidada produce el peor tipo de bug: uno que
<b>desaparece cuando lo vas a mirar</b>.</strong> El usuario ve un dato viejo, reporta, vos abrís y ya se
actualizó. Ese ciclo puede repetirse durante semanas sin que nadie encuentre la causa.</div>

<h4>Los techos reales, para calibrar</h4>
<pre><code>Postgres bien indexado         millones de filas por tabla, sin problema
Un servidor mediano            miles de peticiones por minuto
Una app Next.js con caché      decenas de miles de usuarios activos
Un trabajo por lotes nocturno  millones de registros</code></pre>

<div class="dato"><strong>La mayoría de los productos nunca llega a estos techos.</strong> Y los que llegan
tienen ingresos y equipo para resolverlo cuando pasa. <b>Diseñar hoy para un volumen que quizás nunca ocurra es
pagar complejidad todos los meses por un problema hipotético.</b></div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="es1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL ESCALÓN — de barato a caro. Casi nadie pasa del cuarto.</text>

  <rect x="24" y="34" width="632" height="22" rx="5" fill="#34d399" fill-opacity=".28"/>
  <text x="40" y="49" fill="#34d399" font-size="10" font-weight="700">1 · índice faltante</text>
  <text x="380" y="49" fill="#34d399" font-size="10" font-weight="700">10-1000×</text>
  <text x="520" y="49" fill="currentColor" opacity=".65" font-size="9.5">minutos</text>

  <rect x="24" y="60" width="632" height="22" rx="5" fill="#34d399" fill-opacity=".22"/>
  <text x="40" y="75" fill="#34d399" font-size="10" font-weight="700">2 · resolver el N+1</text>
  <text x="380" y="75" fill="#34d399" font-size="10" font-weight="700">10-100×</text>
  <text x="520" y="75" fill="currentColor" opacity=".65" font-size="9.5">una tarde</text>

  <rect x="24" y="86" width="632" height="22" rx="5" fill="#34d399" fill-opacity=".16"/>
  <text x="40" y="101" fill="currentColor" opacity=".75" font-size="10">3 · traer solo lo necesario</text>
  <text x="380" y="101" fill="currentColor" opacity=".7" font-size="10">2-10×</text>
  <text x="520" y="101" fill="currentColor" opacity=".65" font-size="9.5">una tarde</text>

  <rect x="24" y="112" width="632" height="22" rx="5" fill="#22d3ee" fill-opacity=".18"/>
  <text x="40" y="127" fill="currentColor" opacity=".75" font-size="10">4 · caché de lo caro y repetido</text>
  <text x="380" y="127" fill="currentColor" opacity=".7" font-size="10">10-100×</text>
  <text x="520" y="127" fill="#f87171" font-size="9.5" font-weight="700">+ invalidación</text>

  <rect x="24" y="138" width="632" height="22" rx="5" fill="#fbbf24" fill-opacity=".22" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="40" y="153" fill="#fbbf24" font-size="10" font-weight="700">5 · instancia más grande</text>
  <text x="380" y="153" fill="currentColor" opacity=".7" font-size="10">2-4×</text>
  <text x="520" y="153" fill="#fbbf24" font-size="9.5" font-weight="700">un clic ← se descarta por orgullo</text>

  <rect x="24" y="164" width="632" height="22" rx="5" fill="#7c5cff" fill-opacity=".16"/>
  <text x="40" y="179" fill="currentColor" opacity=".75" font-size="10">6-7 · réplica de lectura · vista materializada</text>
  <text x="520" y="179" fill="currentColor" opacity=".65" font-size="9.5">días</text>

  <rect x="24" y="190" width="632" height="22" rx="5" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.2"/>
  <text x="40" y="205" fill="#f87171" font-size="10" font-weight="700">8 · partir el servicio</text>
  <text x="380" y="205" fill="currentColor" opacity=".7" font-size="10">variable</text>
  <text x="520" y="205" fill="#f87171" font-size="9.5" font-weight="700">MESES</text>

  <rect x="24" y="222" width="632" height="30" rx="8" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="340" y="242" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">
    Duplicar el servidor cuesta menos que dos días de trabajo de una persona. Es correcto mientras el problema sea de recursos.</text>

  <line x1="24" y1="270" x2="656" y2="270" stroke="currentColor" opacity=".18"/>

  <text x="24" y="294" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL ORDEN — y el paso que casi nadie hace</text>

  <rect x="24" y="306" width="140" height="40" rx="8" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="94" y="331" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">1 · MEDIR</text>
  <line x1="168" y1="326" x2="184" y2="326" stroke="currentColor" stroke-width="1.3" marker-end="url(#es1)"/>

  <rect x="188" y="306" width="140" height="40" rx="8" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="258" y="331" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">2 · ENTENDER</text>
  <line x1="332" y1="326" x2="348" y2="326" stroke="currentColor" stroke-width="1.3" marker-end="url(#es1)"/>

  <rect x="352" y="306" width="140" height="40" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.2"/>
  <text x="422" y="331" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">3 · ARREGLAR</text>
  <line x1="496" y1="326" x2="512" y2="326" stroke="currentColor" stroke-width="1.3" marker-end="url(#es1)"/>

  <rect x="516" y="306" width="140" height="40" rx="8" fill="#f87171" fill-opacity=".22" stroke="#f87171" stroke-width="1.8"/>
  <text x="586" y="325" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">4 · MEDIR OTRA VEZ</text>
  <text x="586" y="339" text-anchor="middle" fill="#f87171" font-size="8.5" font-weight="700">el que casi nadie hace</text>

  <rect x="24" y="356" width="632" height="30" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="376" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    Sin el paso 4, la mitad de las “optimizaciones” no mueven la aguja — y el equipo acumula complejidad que no compró nada.</text>
</svg>`,
        pie: 'Ordená las consultas por tiempo TOTAL, no por promedio. Si no, perseguís fantasmas.',
      },

      entrevista: [
        { p: '¿Cuál es el orden correcto para optimizar?',
          r: '<b>Medir, entender, arreglar y volver a medir.</b> El cuarto paso es el que casi nadie hace y el que evita el trabajo inútil: ' +
             'sin él no sabés si la optimización sirvió, y en la práctica la mitad de las "optimizaciones" no mueven la aguja porque el cuello estaba ' +
             'en otro lado. <b>Sin medir después, el equipo acumula complejidad que no compró nada.</b>' },

        { p: 'Al mirar consultas lentas, ¿por qué ordenar por tiempo total y no por promedio?',
          r: 'Porque una consulta de 2 segundos que corre una vez por día importa mucho menos que una de 30 milisegundos que corre cien mil veces. ' +
             'La segunda consume muchísimo más tiempo total y es la que hay que arreglar primero. ' +
             'Ordenar por promedio te lleva a perseguir fantasmas: consultas espectacularmente lentas que casi no se ejecutan.' },

        { p: '¿Dónde suele estar el problema de rendimiento en una aplicación web?',
          r: 'En dos lugares que explican la enorme mayoría: <b>un índice faltante</b> y un <b>N+1</b>. Las dos se arreglan en horas y dan mejoras de ' +
             'entre diez y mil veces. Lo que casi nunca es el problema real es "el lenguaje es lento" — que es lo que más se propone. ' +
             'Y hay un paso del escalón que se descarta por orgullo técnico: <b>una instancia más grande</b>, que cuesta menos que dos días de trabajo ' +
             'de una persona y es la respuesta correcta mientras el problema sea de recursos y no de diseño.' },

        { p: '¿Qué hay que responder antes de agregar una caché?',
          r: 'Tres preguntas. <b>Cuántos segundos de desactualización tolera el dato</b> — si es cero, no se cachea y hay que buscar la velocidad en ' +
             'otro lado. <b>Qué la invalida</b>: una escritura concreta, o simplemente el tiempo. Y <b>qué pasa si sirve algo viejo</b>. ' +
             'Cachear es fácil; invalidar es donde están todos los problemas — y una caché mal invalidada produce el peor tipo de bug: ' +
             '<b>uno que desaparece cuando lo vas a mirar</b>.' },
      ],

      practica: `
<h4>Encontrar el índice faltante</h4>
<pre><code>-- 1 · La consulta lenta
explain (analyze, buffers)
select * from pedidos where tenant_id = $1 and estado = 'pendiente'
 order by creado_en desc limit 50;

-- Si aparece "Seq Scan on pedidos" con muchas filas → falta índice

-- 2 · Crearlo sin bloquear
create index concurrently on pedidos (tenant_id, estado, creado_en desc)
  where cancelado_en is null;

-- 3 · Verificar que se use
explain (analyze) select …;      -- ahora debería decir "Index Scan"</code></pre>

<h4>Resolver un N+1</h4>
<pre><code>// ❌ 1 + N consultas
const pedidos = await repo.pendientes();
for (const p of pedidos) p.cliente = await repoClientes.porId(p.clienteId);

// ✔ Una consulta con la relación incluida
const pedidos = await repo.pendientes({ incluir: ['cliente'] });

// ✔ O dos consultas y unir en memoria (a veces más rápido)
const pedidos = await repo.pendientes();
const ids = [...new Set(pedidos.map((p) =&gt; p.clienteId))];
const clientes = await repoClientes.porIds(ids);         // ← una sola
const mapa = new Map(clientes.map((c) =&gt; [c.id, c]));
pedidos.forEach((p) =&gt; { p.cliente = mapa.get(p.clienteId); });</code></pre>

<div class="aviso"><strong>La segunda opción —dos consultas y unir en memoria— suele ser más rápida que un
join cuando la relación es de muchos a uno</strong>, porque el join repite los datos del cliente en cada fila y
la base tiene que materializar todo eso. Con dos consultas, cada cliente viaja una sola vez.</div>

<h4>Caché con invalidación explícita</h4>
<pre><code>// Lectura: cacheada por etiqueta
export const resumenTenant = unstable_cache(
  async (tenantId: string) =&gt; calcularResumen(tenantId),
  ['resumen-tenant'],
  { tags: (tenantId) =&gt; [&#96;tenant:\${tenantId}&#96;], revalidate: 300 },
);

// Escritura: invalida esa etiqueta
export async function accionCrearPedido(datos) {
  const pedido = await pedidos.crear(datos);
  revalidateTag(&#96;tenant:\${datos.tenantId}&#96;);    // ← la invalidación explícita
  return pedido;
}</code></pre>

<h4>El tablero mínimo para decidir</h4>
<table>
<tr><th>Métrica</th><th>Para qué</th></tr>
<tr><td>Usuarios activos por día</td><td>Saber a qué distancia estás del techo</td></tr>
<tr><td>p95 de las rutas principales</td><td>Detectar degradación real</td></tr>
<tr><td>Consultas por petición</td><td>Detectar N+1 antes de producción</td></tr>
<tr><td>Consultas más lentas por <b>tiempo total</b></td><td>Priorizar dónde optimizar</td></tr>
<tr><td>Costo mensual</td><td>Saber cuándo migrar deja de ser capricho</td></tr>
</table>

<h4>Antes de escalar, preguntá</h4>
<pre><code>· ¿Medí, o estoy suponiendo?
· ¿Está el índice?
· ¿Hay un N+1?
· ¿Traigo columnas o filas de más?
· ¿Probé una instancia más grande?
· ¿El problema es de HOY o de un volumen hipotético?</code></pre>
`,

      errores: [
        { mito: 'Sé dónde está el cuello de botella.',
          realidad: 'Casi nunca está donde uno cree. <b>Medir primero</b>, y ordenar por <b>tiempo total</b> y no por promedio: ' +
                    'una consulta lenta que corre una vez por día importa menos que una rápida que corre cien mil veces.' },

        { mito: 'Optimicé, así que mejoró.',
          realidad: 'Sin <b>volver a medir</b>, no sabés. La mitad de las optimizaciones no mueven la aguja porque el cuello estaba en otro lado — ' +
                    'y quedaste con la complejidad igual.' },

        { mito: 'Poner un servidor más grande es de vagos.',
          realidad: 'Cuesta menos que <b>dos días de trabajo</b> de una persona, y es la respuesta correcta mientras el problema sea de recursos. ' +
                    'Se descarta por orgullo técnico, no por análisis.' },

        { mito: 'Agrego una caché y listo.',
          realidad: 'Cachear es fácil; <b>invalidar</b> es donde están los problemas. Una caché mal invalidada produce el peor tipo de bug: ' +
                    'el usuario ve un dato viejo, reporta, vos abrís y ya se actualizó.' },
      ],

      glosario: [
        { t: 'Tiempo total', d: 'Duración por cantidad de ejecuciones. El criterio para priorizar.' },
        { t: 'Plan de ejecución', d: 'Cómo la base va a resolver una consulta. Lo muestra explain.' },
        { t: 'Seq Scan', d: 'Recorrido completo de la tabla. Sobre tablas grandes, suele faltar un índice.' },
        { t: 'N+1', d: 'Una consulta inicial más una por cada resultado.' },
        { t: 'Invalidación', d: 'Marcar datos cacheados como viejos. La parte difícil de cachear.' },
        { t: 'Vista materializada', d: 'Resultado precalculado en disco, refrescado a demanda.' },
        { t: 'Techo real', d: 'El volumen a partir del cual el diseño actual deja de alcanzar.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Tecnología aburrida y cuándo romperla',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> elegí lo aburrido por defecto, y gastá tus pocas
"fichas de innovación" en lo que <b>es realmente distintivo</b> de tu producto.</div>

<h4>Las fichas de innovación</h4>
<p>Imaginá que tenés <b>tres fichas</b> para gastar en tecnología nueva o poco conocida. Cada una que gastás es
una cosa más que puede fallar de formas que nadie del equipo sabe diagnosticar.</p>
<pre><code>Producto con base de datos + web + una integración:

  ✔ Gastar 0 fichas: Postgres, Next.js, un proveedor conocido.
  ⚠ Gastar 1: si tu producto depende de una capacidad que solo da esa herramienta.
  ✘ Gastar 3: base exótica + framework nuevo + orquestador propio.</code></pre>

<div class="aviso"><strong>El problema de gastar todas las fichas no es cada elección por separado —cada una
puede ser defendible— sino que <b>los problemas se multiplican</b>.</strong> Cuando algo falla, no sabés si es
la base, el framework o el orquestador, y no hay nadie a quien preguntarle porque casi nadie usa esa
combinación.</div>

<h4>Qué hace que algo sea "aburrido"</h4>
<ul>
<li><b>Muchos años de uso</b> en producción por mucha gente.</li>
<li>Los <b>modos de falla son conocidos</b>: cuando algo sale mal, hay respuestas escritas.</li>
<li>Se consigue gente que ya lo sabe.</li>
<li>La documentación es completa y las respuestas de la comunidad no están desactualizadas.</li>
</ul>

<p>Aburrido no significa viejo ni malo: significa <b>previsible</b>. Y previsible es exactamente lo que querés
en las partes que no son tu diferencial.</p>

<h4>Cuándo sí conviene romperla</h4>
<table>
<tr><th>Situación</th><th>¿Vale la ficha?</th></tr>
<tr><td>Lo nuevo resuelve un problema que lo aburrido no puede</td><td>✔ Sí</td></tr>
<tr><td>Es el núcleo diferencial de tu producto</td><td>✔ Sí</td></tr>
<tr><td>El ahorro es de un orden de magnitud, medido</td><td>✔ Probablemente</td></tr>
<tr><td>"Es más moderno"</td><td>✘ No</td></tr>
<tr><td>"El equipo quiere aprenderlo"</td><td>✘ No en producción</td></tr>
<tr><td>"Lo usa una empresa grande"</td><td>✘ Tienen otros problemas</td></tr>
</table>
`,

      tecnico: `
<h4>Evaluar una tecnología nueva</h4>
<pre><code>1 · ¿Qué problema resuelve que lo actual NO puede?
      "Nada, es más lindo" → no.

2 · ¿Cuánto hace que existe? ¿Quién la usa en producción?
      Menos de 2 años → el riesgo es alto.

3 · ¿Qué pasa si el proyecto se abandona?
      ¿Podemos migrar? ¿Cuánto costaría?

4 · ¿Cuántas personas del equipo la conocen?
      Una → esa persona se vuelve un cuello de botella.

5 · ¿Cómo se depura cuando falla?
      Si no hay respuesta, es la pregunta más importante de todas.</code></pre>

<div class="dato"><strong>La quinta es la que más se olvida y la que más duele.</strong> Una tecnología puede
ser excelente y aun así ser una mala elección si, cuando falla a las 3 de la mañana, <b>no hay forma de
entender por qué</b>. La madurez de una herramienta se mide sobre todo por lo buenas que son sus herramientas
de diagnóstico.</div>

<h4>El costo de mantener lo poco común</h4>
<table>
<tr><th>Aspecto</th><th>Aburrido</th><th>Novedoso</th></tr>
<tr><td>Buscar un error</td><td>Hay respuestas escritas</td><td>Leer el código fuente</td></tr>
<tr><td>Contratar</td><td>Mucha gente lo sabe</td><td>Hay que formar</td></tr>
<tr><td>Actualizar</td><td>Guías de migración</td><td>Cambios que rompen sin aviso</td></tr>
<tr><td>Herramientas alrededor</td><td>Ecosistema maduro</td><td>Hay que construirlas</td></tr>
<tr><td>Riesgo de abandono</td><td>Bajo</td><td>Real</td></tr>
</table>

<div class="dato"><strong>La primera fila es la que se paga todas las semanas.</strong> Con una herramienta
madura, un error se resuelve buscando el mensaje y encontrando media docena de respuestas. Con una nueva, ' +
la ruta habitual es leer el código fuente de la librería — lo cual funciona, y consume una tarde en vez de
cinco minutos.</div>

<h4>Cómo probar algo nuevo sin apostar el producto</h4>
<pre><code>1 · Usarlo en algo interno, sin usuarios.
2 · Usarlo en una parte NO crítica del producto.
3 · Aislarlo detrás de una interfaz propia, para poder reemplazarlo.
4 · Definir por adelantado cómo se vuelve atrás.
5 · Fijar un plazo de evaluación y una fecha para decidir.</code></pre>

<div class="dato"><strong>El punto 5 es el que evita el limbo.</strong> Sin una fecha de decisión, las pruebas
se quedan en producción "temporalmente" durante años, sin que nadie haya decidido adoptarlas ni sacarlas — ' +
y quedan como la parte del sistema que una sola persona entiende.</div>

<h4>Aplicado al stack del workspace</h4>
<pre><code>Fichas gastadas: aproximadamente cero. Y está bien.

Postgres         décadas de uso, modos de falla documentados
Next.js          amplio uso, mucha gente lo conoce
Supabase         Postgres abajo: si hace falta, se migra
Inngest          reemplaza construir una cola propia, que sería peor
Sentry           estándar de facto
Tailwind         amplio uso

Dónde SÍ tiene sentido gastar una ficha:
  → en la capa de IA, si el producto se diferencia por ahí.
    Ahí lo nuevo resuelve algo que lo viejo no puede.</code></pre>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    TRES FICHAS DE INNOVACIÓN — gastalas donde te diferencia</text>

  <circle cx="70" cy="62" r="20" fill="#fbbf24" fill-opacity=".35" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="70" y="67" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">1</text>
  <circle cx="120" cy="62" r="20" fill="#fbbf24" fill-opacity=".35" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="120" y="67" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">2</text>
  <circle cx="170" cy="62" r="20" fill="#fbbf24" fill-opacity=".35" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="170" y="67" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">3</text>

  <rect x="212" y="34" width="444" height="56" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="232" y="54" fill="#f87171" font-size="11.5" font-weight="700">Gastarlas todas no falla por cada elección: falla porque</text>
  <text x="232" y="72" fill="#f87171" font-size="11.5" font-weight="700">LOS PROBLEMAS SE MULTIPLICAN.</text>
  <text x="232" y="86" fill="currentColor" opacity=".65" font-size="10">
    ¿es la base, el framework o el orquestador? Y nadie usa esa combinación.</text>

  <text x="24" y="120" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    ABURRIDO NO ES VIEJO NI MALO: ES PREVISIBLE</text>

  <rect x="24" y="132" width="304" height="94" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="176" y="152" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">ABURRIDO</text>
  <text x="44" y="172" fill="currentColor" opacity=".72" font-size="10">· los modos de falla están documentados</text>
  <text x="44" y="190" fill="currentColor" opacity=".72" font-size="10">· se consigue gente que ya lo sabe</text>
  <text x="44" y="208" fill="#34d399" font-size="10" font-weight="700">· un error se resuelve buscando el mensaje</text>

  <rect x="352" y="132" width="304" height="94" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="504" y="152" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">NOVEDOSO</text>
  <text x="372" y="172" fill="currentColor" opacity=".72" font-size="10">· cambios que rompen sin aviso</text>
  <text x="372" y="190" fill="currentColor" opacity=".72" font-size="10">· hay que formar a la gente</text>
  <text x="372" y="208" fill="#f87171" font-size="10" font-weight="700">· un error se resuelve leyendo el código fuente</text>

  <rect x="24" y="238" width="632" height="30" rx="8" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="340" y="258" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">
    LA PREGUNTA QUE MÁS SE OLVIDA: “¿cómo se depura cuando falla a las 3 de la mañana?”</text>

  <text x="24" y="294" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CUÁNDO SÍ VALE LA FICHA</text>

  <rect x="24" y="306" width="304" height="80" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="44" y="326" fill="#34d399" font-size="10.5" font-weight="700">✓ resuelve algo que lo aburrido no puede</text>
  <text x="44" y="346" fill="#34d399" font-size="10.5" font-weight="700">✓ es el núcleo diferencial del producto</text>
  <text x="44" y="366" fill="#34d399" font-size="10.5" font-weight="700">✓ el ahorro es de un orden de magnitud</text>
  <text x="44" y="380" fill="currentColor" opacity=".6" font-size="9.5">…y medido, no estimado</text>

  <rect x="352" y="306" width="304" height="80" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="372" y="326" fill="#f87171" font-size="10.5" font-weight="700">✗ “es más moderno”</text>
  <text x="372" y="346" fill="#f87171" font-size="10.5" font-weight="700">✗ “el equipo quiere aprenderlo”</text>
  <text x="372" y="366" fill="#f87171" font-size="10.5" font-weight="700">✗ “lo usa una empresa grande”</text>
  <text x="372" y="380" fill="currentColor" opacity=".6" font-size="9.5">tienen otros problemas y otro equipo</text>
</svg>`,
        pie: 'Sin una fecha de decisión, las pruebas se quedan “temporalmente” en producción durante años.',
      },

      entrevista: [
        { p: '¿Qué son las fichas de innovación?',
          r: 'La idea de que un equipo tiene <b>unas pocas oportunidades</b> —tres, digamos— para usar tecnología nueva o poco conocida, ' +
             'y conviene gastarlas donde el producto realmente se diferencia. El problema de gastarlas todas no es cada elección por separado ' +
             '—cada una puede ser defendible— sino que <b>los problemas se multiplican</b>: cuando algo falla no sabés si es la base, el framework ' +
             'o el orquestador, y no hay a quién preguntarle porque casi nadie usa esa combinación.' },

        { p: '¿Qué significa que una tecnología sea "aburrida"?',
          r: 'Que es <b>previsible</b>, no que sea vieja ni mala. Tiene muchos años de uso en producción, sus <b>modos de falla son conocidos</b> ' +
             'y hay respuestas escritas, se consigue gente que ya la sabe, y la documentación está completa. ' +
             'La diferencia práctica que se paga todas las semanas: con una herramienta madura, un error se resuelve buscando el mensaje; ' +
             'con una nueva, la ruta habitual es <b>leer el código fuente de la librería</b> — que funciona, y consume una tarde en vez de cinco minutos.' },

        { p: '¿Cuál es la pregunta que más se olvida al evaluar una herramienta?',
          r: '<b>"¿Cómo se depura cuando falla?"</b>. Una tecnología puede ser excelente y aun así ser una mala elección si, cuando algo sale mal a las ' +
             'tres de la mañana, no hay forma de entender por qué. La madurez de una herramienta se mide sobre todo por lo buenas que son sus ' +
             'herramientas de diagnóstico — mucho más que por sus capacidades en el caso feliz.' },

        { p: '¿Cómo probarías algo nuevo sin apostar el producto?',
          r: 'En algo interno primero, después en una parte no crítica, siempre <b>aislado detrás de una interfaz propia</b> para poder reemplazarlo, ' +
             'con un plan de reversión definido de antemano. Y el punto que evita el limbo: <b>fijar un plazo de evaluación y una fecha para decidir</b>. ' +
             'Sin esa fecha, las pruebas se quedan "temporalmente" en producción durante años, sin que nadie haya decidido adoptarlas ni sacarlas — ' +
             'y terminan siendo la parte del sistema que una sola persona entiende.' },
      ],

      practica: `
<h4>Ficha de evaluación de una tecnología</h4>
<pre><code># Evaluación: &lt;herramienta&gt;

Problema que resuelve      (que lo actual NO puede)
Alternativa aburrida       qué usaríamos si no
Diferencia concreta        el número, medido

Madurez
  Años en producción       ___
  Quién la usa en serio    ___
  Frecuencia de cambios que rompen  ___

Riesgo
  ¿Qué pasa si se abandona?    ___
  ¿Cómo migramos?              ___ (costo estimado)
  ¿Cuántos del equipo la saben? ___

Diagnóstico
  ¿Cómo se depura cuando falla? ___   ← la más importante
  ¿Hay respuestas escritas a los errores comunes? ___

Decisión
  [ ] Adoptar   [ ] Probar en algo no crítico   [ ] No
  Fecha para volver a evaluar: ___</code></pre>

<div class="aviso"><strong>La última línea es la que evita el limbo.</strong> "Probar" sin fecha de decisión
se convierte en "está en producción y nadie decidió nada", que es el peor de los tres estados: cargás el riesgo
sin haber asumido el compromiso de aprenderla bien.</div>

<h4>Aislar lo nuevo para poder sacarlo</h4>
<pre><code>// Una interfaz propia. Adentro puede estar lo nuevo.
export interface BusquedaSemantica {
  indexar(id: string, texto: string): Promise&lt;void&gt;;
  buscar(consulta: string, limite: number): Promise&lt;Resultado[]&gt;;
}

// Implementación con lo aburrido: pgvector, ya está en Postgres
export const busquedaPgvector: BusquedaSemantica = { … };

// Implementación con lo nuevo, si vale la ficha
export const busquedaNueva: BusquedaSemantica = { … };

// Una bandera decide. Volver atrás es cambiar un valor.
export const busqueda = process.env.BUSQUEDA === 'nueva' ? busquedaNueva : busquedaPgvector;</code></pre>

<h4>El stack del workspace, evaluado</h4>
<table>
<tr><th>Pieza</th><th>Fichas</th><th>Por qué está bien</th></tr>
<tr><td>Postgres</td><td>0</td><td>Décadas de uso, modos de falla documentados</td></tr>
<tr><td>Next.js</td><td>0</td><td>Amplio uso, mucha gente lo conoce</td></tr>
<tr><td>Supabase</td><td>0</td><td>Postgres abajo: si hace falta, se migra</td></tr>
<tr><td>Inngest</td><td>0</td><td>La alternativa era una cola propia, que sería peor</td></tr>
<tr><td>Sentry, Tailwind</td><td>0</td><td>Estándares de facto</td></tr>
<tr><td><b>Capa de IA</b></td><td><b>1</b></td><td>Ahí lo nuevo resuelve algo que lo viejo no puede</td></tr>
</table>

<h4>Preguntas para una propuesta técnica</h4>
<pre><code>· ¿Qué problema concreto resuelve HOY?
· ¿Qué usaríamos si no existiera? ¿Cuánto peor es?
· ¿Qué empeora si lo adoptamos?
· ¿Cómo se depura cuando falla?
· ¿Cómo volvemos atrás?
· ¿Cuántas fichas nos quedan?</code></pre>
`,

      errores: [
        { mito: 'Elegir lo aburrido es no innovar.',
          realidad: 'Es <b>elegir dónde innovar</b>. Las fichas son pocas: gastarlas en la base de datos deja sin margen para innovar en lo que ' +
                    'realmente diferencia al producto.' },

        { mito: 'Cada elección novedosa se justifica por separado.',
          realidad: 'Puede ser, y el problema es acumulativo: <b>los problemas se multiplican</b>. Cuando algo falla no sabés cuál de las tres piezas ' +
                    'nuevas es, y nadie usa esa combinación.' },

        { mito: 'Lo importante de una herramienta es lo que puede hacer.',
          realidad: 'Igual de importante es <b>cómo se depura cuando falla</b>. Una herramienta excelente sin buenas herramientas de diagnóstico ' +
                    'es una mala elección a las tres de la mañana.' },

        { mito: 'Lo probamos en producción y después decidimos.',
          realidad: 'Sin una <b>fecha de decisión</b>, se queda ahí durante años sin que nadie la adopte ni la saque — y termina siendo la parte del ' +
                    'sistema que una sola persona entiende.' },
      ],

      glosario: [
        { t: 'Tecnología aburrida', d: 'La previsible: modos de falla conocidos y respuestas escritas.' },
        { t: 'Ficha de innovación', d: 'Metáfora del presupuesto limitado para tecnología poco conocida.' },
        { t: 'Modo de falla conocido', d: 'Problema documentado con solución publicada.' },
        { t: 'Riesgo de abandono', d: 'Probabilidad de que el proyecto deje de mantenerse.' },
        { t: 'Aislamiento', d: 'Interfaz propia que permite reemplazar una herramienta sin tocar el resto.' },
        { t: 'Fecha de decisión', d: 'Momento fijado para adoptar o descartar una prueba.' },
        { t: 'Diagnóstico', d: 'Herramientas que permiten entender por qué algo falló.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'El método, aplicado a casos reales',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un método de seis preguntas que se responde en
media hora y que reemplaza a la discusión de opiniones.</div>

<h4>Las seis preguntas</h4>
<pre><code>1 · ¿Cuántos usuarios hay HOY? ¿Y en 12 meses, siendo realistas?
2 · ¿Qué pasa si esto se cae 2 horas?
3 · ¿Qué pasa si se filtra un dato?
4 · ¿Cuánta gente va a tocar este código?
5 · ¿Cuánto se puede gastar por mes?
6 · ¿Cada cuánto hay que entregar algo nuevo?</code></pre>

<p>Con esas seis respuestas, la arquitectura casi se elige sola. Y lo más importante: <b>la discusión pasa a
ser sobre las respuestas, no sobre las tecnologías</b>.</p>

<div class="aviso"><strong>La pregunta 1 tiene una trampa que hay que nombrar: "y en 12 meses, siendo
realistas".</strong> Casi todos los planes de crecimiento son optimistas por diseño — están hechos para
convencer, no para dimensionar. Diseñar para el número optimista es pagar complejidad todos los meses por un
escenario que estadísticamente no ocurre.</div>

<h4>El árbol de decisión, para la mayoría de los casos</h4>
<pre><code>¿Menos de 1.000 usuarios y menos de 5 personas en el equipo?
  → Monolito modular · una base gestionada · una cola gestionada
    Y no discutas más: eso cubre el 90% de los productos.

¿Alguna parte necesita escalar MUY distinto? (medido)
  → Extraé ESA parte. Solo esa.

¿Equipos que se bloquean al desplegar? (real, no anticipado)
  → Recién ahí, microservicios.

¿Datos con requisitos de cumplimiento propios?
  → Aislá esos datos, no el sistema entero.</code></pre>

<h4>La trampa de "vamos a crecer"</h4>
<p>Casi todo producto planea crecer, y casi ninguno crece como planeó. Diseñar para el escenario optimista
cuesta complejidad <b>todos los meses</b> a cambio de un beneficio que llega <b>tal vez</b>.</p>
<p>La alternativa: diseñar para hoy, con <b>límites claros</b> que permitan cambiar cuando haga falta. Eso es
exactamente lo que hace un monolito modular.</p>
`,

      tecnico: `
<h4>Caso 1 — CRM interno, 20 usuarios</h4>
<pre><code>Usuarios hoy / 12 meses   20 / 40
Caída de 2 h              molesto, no grave
Filtración                grave: datos de clientes
Equipo                    2 personas
Presupuesto               &lt; 50 USD/mes
Frecuencia de entrega     semanal

→ Monolito · Postgres gestionado · RLS · Sentry · un despliegue.
→ NO: microservicios, colas complejas, caché distribuida, réplicas.
→ Crítico: seguridad y velocidad de entrega. Sacrificable: escalabilidad.</code></pre>

<h4>Caso 2 — SaaS B2B multi-tenant, 50 clientes</h4>
<pre><code>Usuarios hoy / 12 meses   50 empresas / 150
Caída de 2 h              grave: los clientes trabajan con esto
Filtración                catastrófica: datos entre competidores
Equipo                    4 personas
Presupuesto               &lt; 300 USD/mes
Frecuencia                quincenal

→ Monolito modular · tabla compartida + RLS · Inngest · Sentry · staging real.
→ Multi-tenancy decidida el DÍA 1, con test de aislamiento por tabla.
→ Réplica de lectura solo si se mide que hace falta.
→ Crítico: seguridad y mantenibilidad. Sacrificable: rendimiento extremo.</code></pre>

<div class="dato"><strong>La única decisión verdaderamente irreversible de este caso es la
multi-tenancy.</strong> Todo lo demás —la cola, la observabilidad, hasta el proveedor de base— se puede cambiar
con esfuerzo acotado. Por eso es la única que merece un ADR antes de escribir la primera migración, ' +
y las otras se pueden decidir sobre la marcha.</div>

<h4>Caso 3 — App social, crecimiento impredecible</h4>
<pre><code>Usuarios hoy / 12 meses   500 / entre 2.000 y 200.000 (nadie sabe)
Caída de 2 h              grave: se pierden usuarios
Filtración                grave
Equipo                    3 personas
Presupuesto               variable
Frecuencia                semanal

→ Monolito modular, PERO con límites muy marcados en:
   · el feed (es lo que más va a crecer)
   · las notificaciones (picos)
   · el procesamiento de imágenes (CPU)
→ Cola gestionada desde el día 1: los picos son esperables.
→ CDN + almacenamiento sin egreso: las imágenes son el costo dominante.
→ Métricas de negocio desde el principio, para saber CUÁNDO escalar.</code></pre>

<div class="dato"><strong>Este caso muestra que "incertidumbre alta" no se responde con "arquitectura
compleja" sino con <b>límites bien puestos y buenas métricas</b>.</strong> No se construye para 200.000 usuarios;
se construye para saber, con anticipación, cuándo hay que hacerlo — y con los módulos ya separados para que
extraer el feed sea posible.</div>

<h4>Caso 4 — Landing de marketing</h4>
<pre><code>Usuarios                  variable, picos por campaña
Caída de 2 h              perdés conversiones
Filtración                sin datos sensibles
Equipo                    1 persona
Presupuesto               mínimo
Frecuencia                cuando hay campaña

→ Sitio estático + CDN. Sin base, sin backend.
→ Formularios a un servicio externo.
→ Crítico: rendimiento y costo. Sacrificable: casi todo lo demás.</code></pre>

<h4>Las señales de que te equivocaste, en cualquier caso</h4>
<table>
<tr><th>Señal</th><th>Diagnóstico</th></tr>
<tr><td>Un cambio simple tarda una semana</td><td>Demasiada complejidad</td></tr>
<tr><td>Cada cambio rompe algo lejano</td><td>Límites mal puestos</td></tr>
<tr><td>Nadie entiende una parte del sistema</td><td>Complejidad concentrada en una persona</td></tr>
<tr><td>La factura crece más rápido que los ingresos</td><td>Arquitectura sobredimensionada</td></tr>
<tr><td>Hay incidentes semanales</td><td>Demasiadas piezas para el equipo</td></tr>
<tr><td>El sistema se cae con la carga actual</td><td>Sub-dimensionado: escalá</td></tr>
</table>

<div class="dato"><strong>Fijate que la última fila es la única que pide <b>más</b> arquitectura.</strong> Las
otras cinco piden menos — que es la proporción real de los problemas que uno se encuentra. ' +
<b>El error de sobredimensionar es mucho más común que el de quedarse corto</b>, y también mucho más caro,
porque el sub-dimensionamiento se arregla con un clic y el sobredimensionamiento con meses.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="tm1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS SEIS PREGUNTAS — media hora, y la arquitectura casi se elige sola</text>

  <rect x="24" y="34" width="200" height="34" rx="7" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="124" y="55" text-anchor="middle" fill="currentColor" opacity=".75" font-size="9.5">1 · ¿cuántos usuarios hoy?</text>
  <rect x="240" y="34" width="200" height="34" rx="7" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="340" y="55" text-anchor="middle" fill="currentColor" opacity=".75" font-size="9.5">2 · ¿si se cae 2 horas?</text>
  <rect x="456" y="34" width="200" height="34" rx="7" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="556" y="55" text-anchor="middle" fill="currentColor" opacity=".75" font-size="9.5">3 · ¿si se filtra un dato?</text>

  <rect x="24" y="74" width="200" height="34" rx="7" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="124" y="95" text-anchor="middle" fill="currentColor" opacity=".75" font-size="9.5">4 · ¿cuánta gente lo toca?</text>
  <rect x="240" y="74" width="200" height="34" rx="7" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="340" y="95" text-anchor="middle" fill="currentColor" opacity=".75" font-size="9.5">5 · ¿cuánto se puede gastar?</text>
  <rect x="456" y="74" width="200" height="34" rx="7" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="556" y="95" text-anchor="middle" fill="currentColor" opacity=".75" font-size="9.5">6 · ¿cada cuánto se entrega?</text>

  <rect x="24" y="118" width="632" height="30" rx="8" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.5"/>
  <text x="340" y="138" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">
    Con esas respuestas, la discusión pasa a ser sobre LAS RESPUESTAS, no sobre las tecnologías.</text>

  <text x="24" y="174" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL ÁRBOL, PARA LA MAYORÍA DE LOS CASOS</text>

  <rect x="24" y="186" width="632" height="34" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.6"/>
  <text x="340" y="207" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">
    ¿&lt; 1.000 usuarios y &lt; 5 personas? → monolito modular + base gestionada + cola gestionada. Cubre el 90%.</text>

  <line x1="340" y1="224" x2="340" y2="234" stroke="currentColor" stroke-width="1.3" marker-end="url(#tm1)"/>

  <rect x="24" y="238" width="200" height="42" rx="8" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="124" y="256" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">¿una parte escala MUY distinto?</text>
  <text x="124" y="272" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">extraé ESA parte, medido</text>

  <rect x="240" y="238" width="200" height="42" rx="8" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="340" y="256" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">¿equipos que se bloquean?</text>
  <text x="340" y="272" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">real, no anticipado</text>

  <rect x="456" y="238" width="200" height="42" rx="8" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="556" y="256" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">¿cumplimiento propio?</text>
  <text x="556" y="272" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">aislá esos datos, no el sistema</text>

  <rect x="24" y="292" width="632" height="42" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="310" fill="#f87171" font-size="11.5" font-weight="700">LA TRAMPA DE “VAMOS A CRECER”</text>
  <text x="44" y="328" fill="currentColor" opacity=".75" font-size="11">
    Los planes de crecimiento están hechos para convencer, no para dimensionar. Diseñar para el número optimista se paga TODOS los meses.</text>

  <rect x="24" y="344" width="632" height="42" rx="9" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="44" y="362" fill="#7c5cff" font-size="11.5" font-weight="700">DE LAS SEIS SEÑALES DE ERROR, CINCO PIDEN MENOS ARQUITECTURA Y UNA PIDE MÁS.</text>
  <text x="44" y="380" fill="currentColor" opacity=".75" font-size="11">
    Sobredimensionar es más común y más caro: quedarse corto se arregla con un clic; pasarse, con meses.</text>
</svg>`,
        pie: 'Incertidumbre alta no se responde con arquitectura compleja: se responde con límites claros y buenas métricas.',
      },

      entrevista: [
        { p: '¿Qué método usás para elegir el tamaño de una arquitectura?',
          r: 'Seis preguntas que se responden en media hora: cuántos usuarios hay hoy y en doce meses siendo realistas; qué pasa si se cae dos horas; ' +
             'qué pasa si se filtra un dato; cuánta gente va a tocar el código; cuánto se puede gastar por mes; y cada cuánto hay que entregar. ' +
             'Con esas respuestas la arquitectura casi se elige sola, y sobre todo <b>la discusión pasa a ser sobre las respuestas y no sobre las ' +
             'tecnologías</b>, que es donde se atasca normalmente.' },

        { p: '¿Cuál es la trampa de la pregunta sobre crecimiento?',
          r: 'Que casi todos los planes de crecimiento son <b>optimistas por diseño</b>: están hechos para convencer, no para dimensionar. ' +
             'Diseñar para el número optimista es pagar complejidad todos los meses por un escenario que estadísticamente no ocurre. ' +
             'La alternativa es diseñar para hoy <b>con límites claros</b> que permitan cambiar cuando haga falta — que es exactamente lo que hace ' +
             'un monolito modular.' },

        { p: 'Un producto con crecimiento muy impredecible, ¿pide arquitectura compleja?',
          r: 'No: pide <b>límites bien puestos y buenas métricas</b>. No se construye para doscientos mil usuarios; se construye para <b>saber, con ' +
             'anticipación, cuándo hay que hacerlo</b>, y con los módulos ya separados para que extraer la parte que crezca sea posible. ' +
             'Lo que sí conviene desde el día uno en ese caso es la cola gestionada —los picos son esperables— y el CDN con almacenamiento sin egreso, ' +
             'porque las imágenes suelen ser el costo dominante.' },

        { p: '¿Es más común sobredimensionar o quedarse corto?',
          r: '<b>Sobredimensionar</b>, y además es más caro. De las seis señales de que te equivocaste, cinco piden <b>menos</b> arquitectura ' +
             '—cambios que tardan una semana, cambios que rompen cosas lejanas, partes que nadie entiende, factura que crece más que los ingresos, ' +
             'incidentes semanales— y solo una pide más. Y la asimetría de costo es clara: ' +
             '<b>quedarse corto se arregla con un clic; pasarse, con meses de trabajo.</b>' },
      ],

      practica: `
<h4>La ficha de decisión, para completar antes de empezar</h4>
<pre><code># Decisión de arquitectura — &lt;proyecto&gt;

## Contexto
Usuarios hoy              ___
Usuarios en 12 meses      ___  (número realista, no el del pitch)
Caída de 2 h              ___
Filtración de datos       ___
Personas en el equipo     ___
Presupuesto mensual       ___
Frecuencia de entrega     ___

## Atributos (máximo 2 críticos)
Críticos                  ___
Importantes               ___
Aceptamos sacrificar      ___ hasta ___

## Decisión
Aplicación                ___
Base de datos             ___
Trabajos asincrónicos     ___
Multi-tenancy             ___   ← si aplica, es la única irreversible
Observabilidad            ___

## Explícitamente NO vamos a hacer
___
___

## Revisar cuando
___ usuarios · ___ USD/mes · ___ personas en el equipo</code></pre>

<div class="aviso"><strong>Las dos últimas secciones son las que más valor tienen con el tiempo.</strong>
"Explícitamente no vamos a hacer" convierte una futura propuesta en una consulta al documento, y ' +
"revisar cuando" fija el <b>gate</b>: el número concreto a partir del cual esta decisión deja de servir. ' +
Sin ese gate, o se revisa la arquitectura cada dos meses por ansiedad, o no se revisa nunca.</div>

<h4>Los cuatro casos, en una tabla</h4>
<table>
<tr><th></th><th>CRM interno</th><th>SaaS B2B</th><th>App social</th><th>Landing</th></tr>
<tr><td>Aplicación</td><td>Monolito</td><td>Monolito modular</td><td>Modular con límites fuertes</td><td>Estático</td></tr>
<tr><td>Base</td><td>Gestionada</td><td>Gestionada + RLS</td><td>Gestionada + réplica si hace falta</td><td>Ninguna</td></tr>
<tr><td>Asincrónico</td><td>Cron</td><td>Inngest</td><td>Inngest desde el día 1</td><td>—</td></tr>
<tr><td>Archivos</td><td>Storage</td><td>Storage privado</td><td>Sin egreso + CDN</td><td>CDN</td></tr>
<tr><td>Crítico</td><td>Entrega, simplicidad</td><td>Seguridad, mantenibilidad</td><td>Disponibilidad, costo</td><td>Rendimiento, costo</td></tr>
</table>

<h4>Revisión semestral</h4>
<pre><code>· ¿Se cumplieron los números que estimamos?
· ¿Alguna de las cosas que dijimos "no vamos a hacer" ya hace falta?
· ¿Llegamos a algún gate de revisión?
· ¿Alguna señal de sobredimensión? (cambios lentos, incidentes, factura)
· ¿Alguna señal de sub-dimensión? (se cae con la carga actual)</code></pre>

<div class="dato"><strong>Media hora cada seis meses.</strong> Es mucho más barato que la alternativa habitual:
discutir la arquitectura en medio de un incidente, o dejar que la decisión se tome sola por acumulación de
parches.</div>
`,

      errores: [
        { mito: 'Hay que diseñar para el crecimiento esperado.',
          realidad: 'Los planes de crecimiento son <b>optimistas por diseño</b>: están hechos para convencer. Diseñá para hoy con <b>límites claros</b>, ' +
                    'y con un gate escrito que diga a partir de qué número se revisa.' },

        { mito: 'Incertidumbre alta significa arquitectura flexible y compleja.',
          realidad: 'Significa <b>límites bien puestos y buenas métricas</b>. No construís para el escenario grande: construís para <b>saber cuándo</b> ' +
                    'hay que construirlo, con los módulos ya separados.' },

        { mito: 'Es peor quedarse corto que pasarse.',
          realidad: 'Al revés. Quedarse corto se arregla con un clic o una tarde; <b>pasarse se arregla con meses</b>, y mientras tanto se paga en cada ' +
                    'cambio y con cada persona nueva.' },

        { mito: 'La ficha de decisión es burocracia.',
          realidad: 'Es media hora que evita meses. Y sus dos secciones más valiosas —"no vamos a hacer" y "revisar cuando"— convierten futuras ' +
                    'discusiones en consultas al documento.' },
      ],

      glosario: [
        { t: 'Ficha de decisión', d: 'Documento corto con contexto, atributos, decisión y gate de revisión.' },
        { t: 'Gate de revisión', d: 'Número concreto a partir del cual una decisión deja de servir.' },
        { t: 'Sobredimensionar', d: 'Elegir una arquitectura más compleja de lo que el problema pide.' },
        { t: 'Sub-dimensionar', d: 'Quedarse corto. Se arregla mucho más barato que lo anterior.' },
        { t: 'Número realista', d: 'La estimación de crecimiento sin el optimismo del pitch.' },
        { t: 'Explícitamente no', d: 'Lista de lo que se decidió no hacer, con su motivo.' },
        { t: 'Revisión semestral', d: 'Media hora para comprobar si la decisión sigue siendo correcta.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál de los costos de la complejidad se subestima más?',
      opciones: [
        'Entenderla: se paga por cada persona nueva, para siempre',
        'Construirla',
        'El costo de infraestructura',
        'El costo de las licencias',
      ],
      correcta: 0,
      porQue: 'Una arquitectura que tarda dos días en entenderse cobra dos días por cada persona nueva. Ese costo no aparece en ninguna estimación y aparece en todos los sprints.',
      porQueNo: {
        1: 'Es el único que sí se estima antes.',
        2: 'Es visible en la factura todos los meses.',
        3: 'Es previsible y suele ser menor.',
      },
    },
    {
      p: '¿Cuál es la diferencia entre complejidad esencial y accidental?',
      opciones: [
        'La esencial viene del problema; la accidental la agrega la solución',
        'La esencial es la del backend y la accidental la del frontend',
        'La esencial es inevitable y la accidental es intencional',
        'Son sinónimos con distinto énfasis',
      ],
      correcta: 0,
      porQue: 'Facturar con impuestos argentinos es esencialmente complejo. Cinco capas para guardar un cliente es accidental. Solo la segunda se puede reducir.',
      porQueNo: {
        1: 'No tiene relación con la capa del sistema.',
        2: 'La accidental suele ser no intencional: se acumula.',
        3: 'La distinción es justamente lo útil del concepto.',
      },
    },
    {
      p: 'La misma cantidad de complejidad, ¿cuesta lo mismo esté donde esté?',
      opciones: [
        'No: concentrada en un módulo casi nadie la paga; repartida, la paga todo el equipo todos los días',
        'Sí, la complejidad es la complejidad',
        'Cuesta más si está en el backend',
        'Cuesta menos si está documentada',
      ],
      correcta: 0,
      porQue: 'El cálculo de impuestos es inevitablemente complejo. En impuestos.ts con una interfaz clara, casi nadie lo paga. Repartido en quince componentes, lo paga todo el equipo.',
      porQueNo: {
        1: 'La ubicación cambia radicalmente quién y cuántas veces la paga.',
        2: 'La capa no determina el costo de entenderla.',
        3: 'Documentar ayuda pero no cambia el costo de atravesarla.',
      },
    },
    {
      p: '¿Cómo cambia la discusión pensar la complejidad como un presupuesto?',
      opciones: [
        'La pregunta deja de ser "¿es buena idea?" y pasa a ser "¿de dónde sacamos el presupuesto?"',
        'Permite calcular el costo exacto en horas',
        'Justifica adoptar más tecnologías',
        'Reemplaza la necesidad de medir',
      ],
      correcta: 0,
      porQue: 'Convierte una discusión de opiniones en una de prioridades, y obliga a nombrar qué se va a dejar de hacer.',
      porQueNo: {
        1: 'Es una metáfora para priorizar, no una fórmula de cálculo.',
        2: 'Hace lo contrario: hace visible que el presupuesto es limitado.',
        3: 'Medir sigue siendo necesario para las decisiones de rendimiento.',
      },
    },
    {
      p: '¿Cuál es el paso del ciclo de optimización que casi nadie hace?',
      opciones: [
        'Volver a medir después de arreglar',
        'Documentar el cambio',
        'Avisar al equipo',
        'Escribir un test',
      ],
      correcta: 0,
      porQue: 'Sin ese paso no sabés si sirvió. La mitad de las "optimizaciones" no mueven la aguja porque el cuello estaba en otro lado — y quedaste con la complejidad igual.',
      porQueNo: {
        1: 'Es útil pero no valida el resultado.',
        2: 'Es comunicación, no verificación.',
        3: 'Protege de regresiones, no confirma la mejora.',
      },
    },
    {
      p: 'Al buscar consultas lentas, ¿por qué ordenar por tiempo total?',
      opciones: [
        'Porque una consulta de 30 ms que corre cien mil veces consume más que una de 2 s que corre una vez',
        'Porque el promedio es difícil de calcular',
        'Porque el tiempo total incluye la latencia de red',
        'Porque las consultas rápidas no importan',
      ],
      correcta: 0,
      porQue: 'Ordenar por promedio te lleva a perseguir fantasmas: consultas espectacularmente lentas que casi no se ejecutan.',
      porQueNo: {
        1: 'Ambos valores están disponibles y son fáciles de obtener.',
        2: 'Mide tiempo de ejecución en la base, no de red.',
        3: 'Importan justamente por su frecuencia acumulada.',
      },
    },
    {
      p: '¿Dónde suele estar el problema de rendimiento en una aplicación web?',
      opciones: [
        'En un índice faltante o un N+1: las dos se arreglan en horas',
        'En el lenguaje de programación',
        'En el framework elegido',
        'En la cantidad de dependencias',
      ],
      correcta: 0,
      porQue: 'Explican la enorme mayoría de los casos y dan mejoras de entre diez y mil veces. "El lenguaje es lento" es lo que más se propone y casi nunca es el problema real.',
      porQueNo: {
        1: 'Es la causa menos frecuente y la más cara de cambiar.',
        2: 'Rara vez es el cuello; suele serlo la base.',
        3: 'Afecta al tamaño del paquete, no a la latencia del servidor.',
      },
    },
    {
      p: '¿Qué paso del escalón de optimización se descarta por orgullo técnico?',
      opciones: [
        'Poner una instancia más grande: cuesta menos que dos días de trabajo de una persona',
        'Agregar un índice',
        'Resolver el N+1',
        'Traer solo las columnas necesarias',
      ],
      correcta: 0,
      porQue: 'Es la respuesta correcta mientras el problema sea de recursos y no de diseño, y suele descartarse sin análisis.',
      porQueNo: {
        1: 'Es la primera medida que todos aceptan.',
        2: 'Tampoco genera resistencia; es reconocido como necesario.',
        3: 'Es una optimización aceptada sin discusión.',
      },
    },
    {
      p: '¿Qué hay que responder antes de agregar una caché?',
      opciones: [
        'Cuántos segundos de desactualización tolera el dato, qué la invalida, y qué pasa si sirve algo viejo',
        'Cuánta memoria hace falta',
        'Qué proveedor de caché usar',
        'Cuál es el tiempo de vida por defecto',
      ],
      correcta: 0,
      porQue: 'Cachear es fácil; invalidar es donde están los problemas. Una caché mal invalidada produce el peor tipo de bug: uno que desaparece cuando lo vas a mirar.',
      porQueNo: {
        1: 'Es un detalle de implementación posterior a la decisión.',
        2: 'La herramienta se elige después de definir la semántica.',
        3: 'Es parte de la respuesta a la primera pregunta.',
      },
    },
    {
      p: '¿Qué son las fichas de innovación?',
      opciones: [
        'Un presupuesto limitado de tecnología poco conocida, que conviene gastar donde el producto se diferencia',
        'Un permiso formal para adoptar herramientas',
        'Un puntaje de madurez de cada tecnología',
        'Un método para estimar el costo de migración',
      ],
      correcta: 0,
      porQue: 'El problema de gastarlas todas no es cada elección por separado: es que los problemas se multiplican y no sabés cuál de las tres piezas nuevas falló.',
      porQueNo: {
        1: 'Es una metáfora de presupuesto, no un proceso de aprobación.',
        2: 'La madurez es un insumo, no lo que la ficha mide.',
        3: 'No tiene que ver con estimar migraciones.',
      },
    },
    {
      p: '¿Qué significa que una tecnología sea "aburrida"?',
      opciones: [
        'Que es previsible: modos de falla conocidos y respuestas escritas',
        'Que es vieja y está por quedar obsoleta',
        'Que tiene pocas funcionalidades',
        'Que es de código cerrado',
      ],
      correcta: 0,
      porQue: 'La diferencia se paga todas las semanas: con una herramienta madura un error se resuelve buscando el mensaje; con una nueva, leyendo el código fuente de la librería.',
      porQueNo: {
        1: 'Aburrido no es viejo: es probado.',
        2: 'Muchas herramientas maduras son muy completas.',
        3: 'No tiene relación con el modelo de licencia.',
      },
    },
    {
      p: '¿Cuál es la pregunta que más se olvida al evaluar una herramienta nueva?',
      opciones: [
        '¿Cómo se depura cuando falla?',
        '¿Cuánto cuesta la licencia?',
        '¿Tiene tipos de TypeScript?',
        '¿Cuántas estrellas tiene?',
      ],
      correcta: 0,
      porQue: 'Una tecnología puede ser excelente y aun así ser mala elección si a las tres de la mañana no hay forma de entender por qué falló. La madurez se mide sobre todo por las herramientas de diagnóstico.',
      porQueNo: {
        1: 'Importa, pero es fácil de averiguar y no es lo olvidado.',
        2: 'Es un detalle de comodidad.',
        3: 'La popularidad no predice la experiencia operativa.',
      },
    },
    {
      p: '¿Qué evita el limbo al probar una tecnología nueva?',
      opciones: [
        'Fijar de antemano un plazo de evaluación y una fecha para decidir',
        'Documentar la prueba',
        'Usarla solo en desarrollo',
        'Pedir aprobación del equipo',
      ],
      correcta: 0,
      porQue: 'Sin fecha, las pruebas se quedan "temporalmente" en producción durante años sin que nadie las adopte ni las saque — y terminan siendo la parte que una sola persona entiende.',
      porQueNo: {
        1: 'Documentar no fuerza una decisión.',
        2: 'En desarrollo no se aprende cómo se comporta en producción.',
        3: 'La aprobación inicial no resuelve la falta de cierre.',
      },
    },
    {
      p: 'Un producto con crecimiento muy impredecible, ¿qué arquitectura pide?',
      opciones: [
        'Límites bien puestos y buenas métricas, para saber cuándo escalar',
        'Microservicios desde el principio, para estar preparado',
        'La arquitectura del escenario optimista',
        'Ninguna decisión hasta que se sepa',
      ],
      correcta: 0,
      porQue: 'No se construye para doscientos mil usuarios: se construye para saber con anticipación cuándo hay que hacerlo, con los módulos ya separados para que extraer la parte que crezca sea posible.',
      porQueNo: {
        1: 'Congela límites que nunca se validaron y multiplica el costo operativo.',
        2: 'Se paga complejidad todos los meses por un escenario que suele no ocurrir.',
        3: 'No decidir es decidir por acumulación de parches.',
      },
    },
    {
      p: '¿Es más común y más caro sobredimensionar o quedarse corto?',
      opciones: [
        'Sobredimensionar: quedarse corto se arregla con un clic, pasarse con meses',
        'Quedarse corto, porque el sistema se cae',
        'Los dos cuestan igual',
        'Depende del tamaño del equipo',
      ],
      correcta: 0,
      porQue: 'De las seis señales de que te equivocaste, cinco piden menos arquitectura y solo una pide más. Esa es la proporción real de los problemas.',
      porQueNo: {
        1: 'Es más visible pero mucho más barato de resolver.',
        2: 'La asimetría de costo de reversión es clara.',
        3: 'El tamaño influye en el presupuesto de complejidad, no en esta asimetría.',
      },
    },
  ],
});
