/* ==========================================================================
   Paid Media · Módulo 07 — Estrategia, presupuesto y reporte
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'paidmedia',
  id: 'm07',
  titulo: 'Estrategia, presupuesto y reporte',
  fuentes: ['google-ads-ayuda', 'meta-ayuda', 'ga4'],

  intro:
    '<p>Este es el módulo que separa a alguien que <b>ejecuta campañas</b> de alguien que <b>decide inversión</b>. ' +
    'Y las dos preguntas que hay que poder responder son incómodas: <b>cuánto conviene invertir</b> y ' +
    '<b>cuánto de lo que reportamos ocurrió gracias a nosotros</b>.</p>' +
    '<p>Cierra con lo que más impacta en la relación con un cliente o con la dirección: cómo armar un informe ' +
    'que sea honesto y que igual se pueda defender.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Cuánto invertir y cómo repartir',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> no se decide el presupuesto por lo que "se puede
gastar": se decide por <b>cuánto vale un cliente</b> y <b>cuánto tarda en devolver la plata</b>.</div>

<h4>Los tres números que ordenan todo</h4>
<table>
<tr><th>Número</th><th>Qué es</th></tr>
<tr><td><b>CAC</b></td><td>Lo que te sale conseguir un cliente nuevo</td></tr>
<tr><td><b>LTV</b></td><td>Lo que ese cliente deja en total, a lo largo del tiempo</td></tr>
<tr><td><b>Recuperación</b></td><td>Cuántos meses tarda en devolver lo que costó</td></tr>
</table>

<div class="aviso"><strong>El tercero es el que decide si podés crecer, y casi nadie lo mira.</strong> Un
negocio con LTV alto y recuperación de doce meses <b>no puede escalar rápido</b>: cada cliente nuevo consume
caja durante un año. Uno con recuperación de un mes puede reinvertir enseguida. ' +
<b>Dos negocios con el mismo LTV pueden tener capacidades de crecimiento completamente distintas.</b></div>

<h4>La cuenta básica</h4>
<pre><code>Ticket promedio                  $ 40.000
Margen bruto                          35%   →  $ 14.000 por venta
Compras por cliente (12 meses)        1,6   →  $ 22.400 de LTV bruto

CAC máximo teórico:     $ 22.400   (quedás en cero)
CAC objetivo saludable: $  7.000   (un tercio del LTV)

Si tu CAC real es $ 18.000:
  · el negocio no muere, pero no deja margen para nada más
  · y no hay caja para crecer</code></pre>

<h4>La regla del tercio</h4>
<p>Una referencia práctica: <b>CAC alrededor de un tercio del LTV</b>. Deja margen para operación, para el
producto y para crecer.</p>
<pre><code>CAC = LTV/3    saludable
CAC = LTV/2    ajustado, funciona
CAC = LTV      sobrevivís, no crecés
CAC &gt; LTV      cada cliente nuevo te hace perder plata</code></pre>

<div class="dato"><strong>Y hay una trampa con el LTV que conviene nombrar: <b>casi siempre está
inflado</b>.</strong> Se calcula con los mejores clientes, se proyecta a tres años, se asume una recurrencia
que no está medida. <b>Si no podés mostrar el número con datos propios de doce meses, usá el de la primera
compra</b> — conservador y real es mucho mejor que optimista e inventado.</div>
`,

      tecnico: `
<h4>Calcular el LTV honestamente</h4>
<pre><code>-- Con datos propios, sin proyecciones
select
  count(distinct cliente_id)                              as clientes,
  round(avg(compras)::numeric, 2)                         as compras_prom,
  round(avg(gastado)::numeric)                            as ltv_12m
from (
  select cliente_id, count(*) as compras, sum(total) as gastado
    from pedidos
   where estado = 'pagado'
     and creado_en &gt;= now() - interval '12 months'
   group by 1
) t;</code></pre>

<div class="dato"><strong>Y la corrección que casi nadie hace: ese cálculo <b>sobrestima</b>.</strong> Incluye
a clientes que compraron hace once meses y todavía pueden volver, y a los que compraron el mes pasado y no
tuvieron tiempo. <b>El cálculo correcto sigue a una cohorte</b>: los clientes que compraron por primera vez ' +
hace exactamente doce meses, y cuánto gastaron desde entonces.</div>

<h4>Análisis por cohorte</h4>
<pre><code>-- Cuánto deja realmente una camada de clientes, mes a mes
with primeras as (
  select cliente_id, min(creado_en) as primera
    from pedidos where estado = 'pagado' group by 1
)
select
  date_trunc('month', p.primera)                          as cohorte,
  count(distinct p.cliente_id)                            as clientes,
  round(sum(o.total) filter (where o.creado_en &lt; p.primera + interval '1 month')::numeric) as mes_0,
  round(sum(o.total) filter (where o.creado_en &lt; p.primera + interval '3 months')::numeric) as mes_3,
  round(sum(o.total) filter (where o.creado_en &lt; p.primera + interval '12 months')::numeric) as mes_12
from primeras p
join pedidos o on o.cliente_id = p.cliente_id and o.estado = 'pagado'
group by 1 order by 1;</code></pre>

<div class="dato"><strong>Ese informe responde la pregunta que define la estrategia:</strong> si el mes 0
aporta el 80% del total, sos un negocio de <b>compra única</b> y el CAC tiene que cerrar con la primera venta. ' +
Si el mes 12 duplica al mes 0, podés pagar más caro un cliente porque la recurrencia lo devuelve. ' +
<b>Son dos estrategias de inversión completamente distintas.</b></div>

<h4>Repartir entre canales</h4>
<table>
<tr><th>Canal</th><th>Rol</th><th>Cuándo priorizarlo</th></tr>
<tr><td><b>Google búsqueda</b></td><td>Captura demanda existente</td><td>Si la gente ya busca tu categoría</td></tr>
<tr><td><b>Meta</b></td><td>Crea demanda</td><td>Si el producto se explica visualmente</td></tr>
<tr><td><b>TikTok</b></td><td>Crea demanda, público amplio</td><td>Si podés producir video seguido</td></tr>
<tr><td><b>Remarketing</b></td><td>Cierra</td><td>Siempre, con presupuesto acotado</td></tr>
</table>

<div class="dato"><strong>La distinción clave es <b>capturar</b> versus <b>crear</b> demanda.</strong> Si nadie
busca tu categoría —un producto nuevo, una necesidad no reconocida— la búsqueda no tiene a quién capturar y ' +
hay que empezar por crear demanda. Al revés, si hay búsqueda con volumen, empezar por ahí es mucho más barato
que convencer a alguien desde cero.</div>

<h4>Cómo se reparte, en la práctica</h4>
<pre><code>Presupuesto chico (menos de 1.000 USD/mes)
  → UN canal. Elegí el que capture demanda existente si la hay.
    Repartirlo entre tres es no aprender en ninguno.

Presupuesto medio
  → 60-70% el canal principal · 20-30% el segundo · 10% pruebas

Presupuesto grande
  → repartir por incrementalidad medida, no por ROAS reportado</code></pre>

<div class="dato"><strong>La primera línea es la que más se viola.</strong> Con presupuesto chico, repartir
entre Google, Meta y TikTok garantiza que ninguno junte datos suficientes para aprender — ' +
y los tres van a rendir peor de lo que rendiría uno solo con todo el presupuesto. ' +
<b>Diversificar es una estrategia de escala, no de arranque.</b></div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS TRES NÚMEROS — y el tercero decide si podés crecer</text>

  <rect x="24" y="34" width="200" height="66" rx="10" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="124" y="54" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">CAC</text>
  <text x="124" y="76" text-anchor="middle" fill="currentColor" opacity=".68" font-size="10">lo que sale conseguir</text>
  <text x="124" y="90" text-anchor="middle" fill="currentColor" opacity=".68" font-size="10">un cliente nuevo</text>

  <rect x="240" y="34" width="200" height="66" rx="10" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.3"/>
  <text x="340" y="54" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">LTV</text>
  <text x="340" y="76" text-anchor="middle" fill="currentColor" opacity=".68" font-size="10">lo que deja en total,</text>
  <text x="340" y="90" text-anchor="middle" fill="currentColor" opacity=".68" font-size="10">a lo largo del tiempo</text>

  <rect x="456" y="34" width="200" height="66" rx="10" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.8"/>
  <text x="556" y="54" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">RECUPERACIÓN</text>
  <text x="556" y="76" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">cuántos meses tarda</text>
  <text x="556" y="90" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">en devolver lo que costó</text>

  <rect x="24" y="112" width="632" height="42" rx="9" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="132" fill="#fbbf24" font-size="11.5" font-weight="700">Dos negocios con el MISMO LTV pueden tener capacidades de crecimiento completamente distintas.</text>
  <text x="44" y="148" fill="currentColor" opacity=".75" font-size="10.5">
    Recuperación a 12 meses: cada cliente consume caja durante un año. A 1 mes: reinvertís enseguida.</text>

  <text x="24" y="182" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA REGLA DEL TERCIO</text>

  <rect x="24" y="194" width="152" height="46" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.4"/>
  <text x="100" y="214" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">CAC = LTV / 3</text>
  <text x="100" y="231" text-anchor="middle" fill="#34d399" font-size="9.5">saludable</text>

  <rect x="188" y="194" width="152" height="46" rx="8" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="264" y="214" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">CAC = LTV / 2</text>
  <text x="264" y="231" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">ajustado, funciona</text>

  <rect x="352" y="194" width="152" height="46" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.2"/>
  <text x="428" y="214" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">CAC = LTV</text>
  <text x="428" y="231" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">sobrevivís, no crecés</text>

  <rect x="516" y="194" width="140" height="46" rx="8" fill="#f87171" fill-opacity=".24" stroke="#f87171" stroke-width="1.6"/>
  <text x="586" y="214" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">CAC &gt; LTV</text>
  <text x="586" y="231" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">perdés en cada cliente</text>

  <rect x="24" y="252" width="632" height="42" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.5"/>
  <text x="44" y="272" fill="#f87171" font-size="11.5" font-weight="700">EL LTV CASI SIEMPRE ESTÁ INFLADO</text>
  <text x="44" y="288" fill="currentColor" opacity=".75" font-size="10.5">
    Se calcula con los mejores clientes y se proyecta a tres años. Si no lo podés mostrar con 12 meses de datos propios, usá la primera compra.</text>

  <rect x="24" y="306" width="632" height="80" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="44" y="326" fill="#7c5cff" font-size="12" font-weight="700">CAPTURAR vs CREAR DEMANDA — la distinción que ordena el reparto</text>
  <text x="44" y="346" fill="currentColor" opacity=".78" font-size="11">
    Si ya buscan tu categoría → empezá por búsqueda: es mucho más barato que convencer desde cero.</text>
  <text x="44" y="364" fill="currentColor" opacity=".78" font-size="11">
    Si nadie busca (producto nuevo, necesidad no reconocida) → la búsqueda no tiene a quién capturar.</text>
  <text x="44" y="381" fill="#f87171" font-size="10.5" font-weight="700">
    Y con presupuesto chico: UN canal. Repartir entre tres garantiza que ninguno aprenda.</text>
</svg>`,
        pie: 'Diversificar canales es una estrategia de escala, no de arranque.',
      },

      entrevista: [
        { p: '¿Qué tres números ordenan la decisión de presupuesto?',
          r: '<b>CAC</b> —lo que sale conseguir un cliente—, <b>LTV</b> —lo que ese cliente deja en total— y el <b>período de recuperación</b>: ' +
             'cuántos meses tarda en devolver lo que costó. El tercero es el que decide si podés crecer y casi nadie lo mira: ' +
             'un negocio con recuperación a doce meses <b>no puede escalar rápido</b> porque cada cliente nuevo consume caja durante un año. ' +
             '<b>Dos negocios con el mismo LTV pueden tener capacidades de crecimiento completamente distintas.</b>' },

        { p: '¿Cuál es la trampa más común con el LTV?',
          r: 'Que <b>casi siempre está inflado</b>: se calcula con los mejores clientes, se proyecta a tres años y se asume una recurrencia que nadie ' +
             'midió. Y hay un error técnico frecuente incluso cuando se calcula con datos: promediar todos los clientes de los últimos doce meses ' +
             '<b>sobrestima</b>, porque mezcla a quien compró hace once meses con quien compró el mes pasado. ' +
             'El cálculo correcto <b>sigue a una cohorte</b>. Si no lo podés mostrar con datos propios, usá el valor de la primera compra: ' +
             'conservador y real es mejor que optimista e inventado.' },

        { p: '¿Qué te dice un análisis por cohortes sobre la estrategia?',
          r: 'Define en qué negocio estás. Si el primer mes aporta el 80% del total de la cohorte, sos un negocio de <b>compra única</b> ' +
             'y el CAC tiene que cerrar con la primera venta. Si el mes doce duplica al mes cero, podés pagar más caro un cliente porque ' +
             'la recurrencia lo devuelve. <b>Son dos estrategias de inversión completamente distintas</b>, y la mayoría de los negocios ' +
             'no sabe en cuál está.' },

        { p: '¿Cómo repartirías el presupuesto entre canales?',
          r: 'Con presupuesto chico, <b>un solo canal</b> —y si hay demanda existente en búsqueda, ese, porque capturar es mucho más barato que crear. ' +
             'Repartir entre tres garantiza que <b>ninguno junte datos suficientes</b> y los tres rindan peor que uno solo con todo. ' +
             'Con presupuesto medio, 60-70% al principal y el resto al segundo más pruebas. Y con presupuesto grande, ' +
             'el reparto se hace por <b>incrementalidad medida</b>, no por el ROAS que reporta cada plataforma. ' +
             'Diversificar es una estrategia de escala, no de arranque.' },
      ],

      practica: `
<h4>La ficha de decisión de inversión</h4>
<pre><code># Inversión — &lt;producto&gt;

Ticket promedio               $ ______
Margen bruto                  ______ %
Compras por cliente (12m)     ______   ← de datos propios, no estimado
LTV bruto 12 meses            $ ______
LTV con margen                $ ______

CAC máximo (LTV con margen)   $ ______
CAC objetivo (un tercio)      $ ______
CAC real actual               $ ______

Recuperación (meses)          ______   ← el que define si podés crecer
Caja disponible por mes       $ ______

Presupuesto sostenible: $ ______ /mes</code></pre>

<div class="aviso"><strong>La última línea no sale del CAC objetivo: sale de la <b>caja</b>.</strong> Un
negocio con recuperación a seis meses y caja para tres meses de inversión <b>no puede gastar</b> lo que su
CAC objetivo permitiría — se queda sin efectivo antes de cobrar. Es la restricción que más veces se omite ' +
en los planes de crecimiento.</div>

<h4>Cohortes: la consulta que hay que correr</h4>
<pre><code>with primeras as (
  select cliente_id, min(creado_en)::date as primera
    from pedidos where estado = 'pagado' group by 1
),
gasto as (
  select p.cliente_id, p.primera,
         sum(o.total) filter (where o.creado_en &lt; p.primera + interval  '1 month') as m0,
         sum(o.total) filter (where o.creado_en &lt; p.primera + interval  '3 months') as m3,
         sum(o.total) filter (where o.creado_en &lt; p.primera + interval '12 months') as m12
    from primeras p
    join pedidos o on o.cliente_id = p.cliente_id and o.estado = 'pagado'
   group by 1, 2
)
select date_trunc('month', primera) as cohorte,
       count(*) as clientes,
       round(avg(m0))  as ltv_mes_0,
       round(avg(m3))  as ltv_mes_3,
       round(avg(m12)) as ltv_mes_12
  from gasto
 group by 1 order by 1;</code></pre>

<h4>Interpretar el resultado</h4>
<table>
<tr><th>Si el mes 12 es…</th><th>Estrategia</th></tr>
<tr><td>~ igual al mes 0</td><td>Compra única: el CAC cierra con la primera venta</td></tr>
<tr><td>1,5× el mes 0</td><td>Algo de recurrencia: podés pagar un 30-40% más</td></tr>
<tr><td>2× o más</td><td>Recurrencia fuerte: el CAC puede ser mucho mayor</td></tr>
<tr><td>Cae por cohorte reciente</td><td>Algo empeoró: producto, servicio o calidad del tráfico</td></tr>
</table>

<div class="dato"><strong>La última fila es una alerta de negocio, no de marketing.</strong> Si las cohortes
recientes valen menos que las viejas, la campaña puede estar trayendo <b>peores clientes</b> — típico cuando se
escala agresivamente o se optimiza hacia un evento demasiado fácil. Es de las pocas señales que conectan la
inversión publicitaria con la salud del negocio.</div>

<h4>Reparto por presupuesto</h4>
<pre><code>&lt; 1.000 USD/mes    un canal
1.000-5.000        70% principal · 30% segundo
5.000-20.000       60/25/15, con pruebas
&gt; 20.000           por incrementalidad medida</code></pre>
`,

      errores: [
        { mito: 'El presupuesto se define por lo que se puede gastar.',
          realidad: 'Se define por <b>cuánto vale un cliente</b> y <b>cuánto tarda en devolver la plata</b>. Y la restricción real suele ser la caja: ' +
                    'con recuperación a seis meses y caja para tres, no podés gastar lo que el CAC objetivo permitiría.' },

        { mito: 'Nuestro LTV es alto, podemos pagar más por cliente.',
          realidad: 'Casi siempre está <b>inflado</b>: se calcula con los mejores clientes y se proyecta a años. Si no lo podés mostrar con doce meses ' +
                    'de datos propios y por cohorte, usá el valor de la primera compra.' },

        { mito: 'Reparto el presupuesto entre Google, Meta y TikTok para diversificar.',
          realidad: 'Con presupuesto chico, <b>ninguno junta datos suficientes</b> y los tres rinden peor que uno solo con todo. ' +
                    'Diversificar es una estrategia de escala, no de arranque.' },

        { mito: 'Empiezo por Meta porque llega a más gente.',
          realidad: 'Si la gente <b>ya busca</b> tu categoría, capturar esa demanda es mucho más barato que crearla. La distinción entre ' +
                    'capturar y crear demanda es la que ordena el reparto entre canales.' },
      ],

      glosario: [
        { t: 'CAC', d: 'Costo de adquisición de un cliente nuevo.' },
        { t: 'LTV', d: 'Valor total que deja un cliente a lo largo del tiempo.' },
        { t: 'Período de recuperación', d: 'Meses que tarda un cliente en devolver lo que costó adquirirlo.' },
        { t: 'Cohorte', d: 'Grupo de clientes que compraron por primera vez en el mismo período.' },
        { t: 'Regla del tercio', d: 'Referencia práctica: CAC cerca de un tercio del LTV.' },
        { t: 'Capturar demanda', d: 'Llegar a quien ya está buscando la solución.' },
        { t: 'Crear demanda', d: 'Generar interés en quien no sabía que tenía el problema.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'El informe honesto',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el mejor informe es el que hace que la próxima
conversación empiece en una <b>decisión</b>, no en una discusión sobre los números.</div>

<h4>Lo que casi todos los informes hacen mal</h4>
<ul>
<li>Muestran <b>métricas de plataforma</b> —impresiones, alcance, CTR— que no responden ninguna pregunta de negocio.</li>
<li>Suman las ventas de todas las plataformas, que <b>siempre da de más</b>.</li>
<li>Comparan contra el mes anterior sin considerar estacionalidad.</li>
<li>Presentan solo lo bueno, así que <b>pierden credibilidad</b> cuando aparece algo malo.</li>
</ul>

<div class="aviso"><strong>Ese último punto es el más costoso a largo plazo.</strong> Un informe que solo
muestra lo bueno funciona hasta que el cliente descubre por su cuenta que las ventas no crecieron — ' +
y a partir de ahí <b>todo lo que reportes se lee con desconfianza</b>, incluidas las cosas que están bien. ' +
La credibilidad se pierde de golpe y se recupera muy lento.</div>

<h4>La estructura que funciona</h4>
<pre><code>1 · El número del negocio          ventas totales, contra el objetivo
2 · Qué hizo el medio pago          inversión, conversiones atribuidas, CPA
3 · Qué cambió y por qué            causas, no solo variaciones
4 · Qué NO funcionó                 explícito, con lo que se aprendió
5 · Qué se hace el mes que viene    tres acciones concretas
6 · Qué necesitamos                 lo que depende del cliente</code></pre>

<div class="dato"><strong>Empezar por el número del negocio y no por el de la plataforma cambia toda la
conversación.</strong> Si arrancás con "tuvimos 40 conversiones y ROAS 4", la charla es sobre tu trabajo. ' +
Si arrancás con "las ventas totales fueron X, contra un objetivo de Y", la charla es sobre <b>el negocio</b> — ' +
que es donde vos querés que esté, porque ahí las decisiones son compartidas.</div>

<h4>La sección que más credibilidad da</h4>
<p>La cuarta: <b>qué no funcionó</b>. Incluirla parece contraintuitivo y hace exactamente lo opuesto a lo que
uno teme:</p>
<ul>
<li>Demuestra que estás mirando de verdad.</li>
<li>Hace creíble todo lo demás.</li>
<li>Evita la sorpresa: los problemas se cuentan antes de que exploten.</li>
</ul>
`,

      tecnico: `
<h4>Reportar la atribución sin mentir</h4>
<pre><code>❌ "Generamos 87 ventas este mes"
   (sumando Meta 40 + Google 35 + TikTok 12)

✔ "El negocio vendió 58 este mes.
    Las plataformas se atribuyen 87 en total, lo que es normal:
    varias participan en la misma venta.
    Nuestra lectura: el medio pago participó en la mayoría."</code></pre>

<div class="dato"><strong>Explicar el solapamiento <b>una vez, al principio de la relación</b>, evita meses de
malentendidos.</strong> Cuando el cliente entiende por qué los números no cierran, deja de ser un motivo de
sospecha y pasa a ser un dato conocido. Explicarlo recién cuando lo pregunta —o peor, cuando lo descubre— ' +
tiene un efecto completamente distinto.</div>

<h4>Comparar bien</h4>
<table>
<tr><th>Comparación</th><th>Cuándo sirve</th></tr>
<tr><td>Mes contra mes anterior</td><td>Solo sin estacionalidad</td></tr>
<tr><td><b>Mes contra el mismo mes del año anterior</b></td><td>La más honesta</td></tr>
<tr><td>Últimos 30 días contra los 30 previos</td><td>Para tendencias cortas</td></tr>
<tr><td>Contra el objetivo</td><td><b>La que importa</b></td></tr>
</table>

<div class="dato"><strong>Comparar diciembre contra noviembre en casi cualquier rubro produce una conclusión
falsa</b> —para bien o para mal— y es la comparación por defecto de todas las herramientas. ' +
Contra el mismo mes del año anterior, la estacionalidad se neutraliza; y contra el objetivo, ' +
la conversación pasa a ser sobre si el plan se está cumpliendo, que es lo único accionable.</div>

<h4>Las métricas que van en el informe</h4>
<pre><code>SIEMPRE
  · Ventas totales del negocio (la fuente real)
  · Inversión
  · Conversiones atribuidas y CPA por canal
  · Comparación contra objetivo

SI HAY ESPACIO
  · Tasa de conversión del sitio
  · Ticket promedio
  · Clientes nuevos vs recurrentes

NUNCA como titular
  · Impresiones · alcance · interacciones · CTR
    (sirven para explicar una causa, no para encabezar)</code></pre>

<h4>Explicar una caída sin excusas ni drama</h4>
<pre><code>❌ "Bajó el rendimiento por cambios en el algoritmo"
   → no se puede verificar, suena a excusa

❌ "Todo mal, hay que rehacer todo"
   → alarmismo sin diagnóstico

✔ "El CPA subió de 6.200 a 9.400 (+52%).
    Causa: el creativo principal llegó a frecuencia 7 y el CTR cayó 38%.
    Es fatiga creativa, era esperable a esta altura.
    Acción: 3 creativos nuevos, ya en producción, salen el lunes.
    Expectativa: volver al rango de 7.000 en dos semanas."</code></pre>

<div class="dato"><strong>La diferencia entre el segundo y el tercer ejemplo no es el tono: es que el tercero
tiene <b>causa, acción y expectativa</b>.</strong> Con esos tres elementos, el cliente sabe qué esperar y ' +
puede evaluar el mes siguiente contra algo concreto. Sin ellos, solo puede confiar o desconfiar.</div>

<h4>La periodicidad</h4>
<pre><code>Semanal    interno, para operar. No para el cliente.
Mensual    el informe de decisión
Trimestral revisión de estrategia: canales, presupuesto, objetivos

Informes semanales al cliente generan reacciones a ruido
y presión para tocar campañas que deberían estar quietas.</code></pre>

<div class="dato"><strong>Esa última línea protege el rendimiento tanto como cualquier optimización.</strong>
Un informe semanal invita a discutir variaciones que son azar, y esa discusión termina en cambios que ' +
<b>reinician el aprendizaje</b>. La periodicidad del informe es, en la práctica, una decisión técnica.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA ESTRUCTURA QUE FUNCIONA — y el orden importa</text>

  <rect x="24" y="34" width="632" height="24" rx="6" fill="#34d399" fill-opacity=".24" stroke="#34d399" stroke-width="1.5"/>
  <text x="40" y="51" fill="#34d399" font-size="10.5" font-weight="700">1 · EL NÚMERO DEL NEGOCIO</text>
  <text x="300" y="51" fill="currentColor" opacity=".7" font-size="10">ventas totales contra el objetivo</text>

  <rect x="24" y="62" width="632" height="24" rx="6" fill="#22d3ee" fill-opacity=".16"/>
  <text x="40" y="79" fill="#22d3ee" font-size="10.5" font-weight="700">2 · qué hizo el medio pago</text>
  <text x="300" y="79" fill="currentColor" opacity=".7" font-size="10">inversión · conversiones · CPA</text>

  <rect x="24" y="90" width="632" height="24" rx="6" fill="#22d3ee" fill-opacity=".16"/>
  <text x="40" y="107" fill="#22d3ee" font-size="10.5" font-weight="700">3 · qué cambió y POR QUÉ</text>
  <text x="300" y="107" fill="currentColor" opacity=".7" font-size="10">causas, no solo variaciones</text>

  <rect x="24" y="118" width="632" height="24" rx="6" fill="#fbbf24" fill-opacity=".22" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="40" y="135" fill="#fbbf24" font-size="10.5" font-weight="700">4 · qué NO funcionó</text>
  <text x="300" y="135" fill="#fbbf24" font-size="10" font-weight="700">la sección que más credibilidad da</text>

  <rect x="24" y="146" width="632" height="24" rx="6" fill="#22d3ee" fill-opacity=".16"/>
  <text x="40" y="163" fill="#22d3ee" font-size="10.5" font-weight="700">5 · qué se hace el mes que viene</text>
  <text x="300" y="163" fill="currentColor" opacity=".7" font-size="10">tres acciones concretas</text>

  <rect x="24" y="174" width="632" height="24" rx="6" fill="#22d3ee" fill-opacity=".16"/>
  <text x="40" y="191" fill="#22d3ee" font-size="10.5" font-weight="700">6 · qué necesitamos</text>
  <text x="300" y="191" fill="currentColor" opacity=".7" font-size="10">lo que depende del cliente</text>

  <rect x="24" y="208" width="632" height="34" rx="8" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="340" y="229" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">
    Empezar por el negocio hace que la charla sea sobre EL NEGOCIO, no sobre tu trabajo. Ahí las decisiones son compartidas.</text>

  <line x1="24" y1="258" x2="656" y2="258" stroke="currentColor" opacity=".18"/>

  <text x="24" y="282" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EXPLICAR UNA CAÍDA: CAUSA · ACCIÓN · EXPECTATIVA</text>

  <rect x="24" y="294" width="200" height="92" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="124" y="314" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">✗ EXCUSA</text>
  <text x="40" y="334" fill="currentColor" opacity=".68" font-size="9.5">“bajó por cambios en</text>
  <text x="40" y="348" fill="currentColor" opacity=".68" font-size="9.5">el algoritmo”</text>
  <text x="40" y="370" fill="#f87171" font-size="9.5" font-weight="700">no se puede verificar</text>

  <rect x="240" y="294" width="200" height="92" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="340" y="314" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">✗ ALARMISMO</text>
  <text x="256" y="334" fill="currentColor" opacity=".68" font-size="9.5">“todo mal, hay que</text>
  <text x="256" y="348" fill="currentColor" opacity=".68" font-size="9.5">rehacer todo”</text>
  <text x="256" y="370" fill="#f87171" font-size="9.5" font-weight="700">sin diagnóstico</text>

  <rect x="456" y="294" width="200" height="92" rx="9" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.6"/>
  <text x="556" y="314" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">✓ CON LOS TRES</text>
  <text x="472" y="332" fill="currentColor" opacity=".72" font-size="9.5">causa: fatiga (frec. 7, CTR -38%)</text>
  <text x="472" y="348" fill="currentColor" opacity=".72" font-size="9.5">acción: 3 creativos, salen el lunes</text>
  <text x="472" y="364" fill="currentColor" opacity=".72" font-size="9.5">expectativa: volver a 7.000 en 2 semanas</text>
  <text x="472" y="380" fill="#34d399" font-size="9.5" font-weight="700">el cliente puede evaluar el mes siguiente</text>
</svg>`,
        pie: 'Un informe que solo muestra lo bueno funciona hasta que el cliente descubre solo que las ventas no crecieron.',
      },

      entrevista: [
        { p: '¿Por qué el informe debe empezar por el número del negocio?',
          r: 'Porque cambia de qué se habla. Si arrancás con "tuvimos 40 conversiones y ROAS 4", la conversación es <b>sobre tu trabajo</b>. ' +
             'Si arrancás con "las ventas totales fueron X contra un objetivo de Y", la conversación es <b>sobre el negocio</b> — ' +
             'y ahí las decisiones son compartidas, que es donde querés estar. Las métricas de plataforma sirven para explicar causas, ' +
             'no para encabezar.' },

        { p: '¿Cuál es la sección que más credibilidad da y por qué?',
          r: '<b>Qué no funcionó.</b> Incluirla parece contraintuitivo y hace lo opuesto a lo que uno teme: demuestra que estás mirando de verdad, ' +
             'hace creíble todo lo demás, y evita la sorpresa porque los problemas se cuentan antes de que exploten. ' +
             'Un informe que solo muestra lo bueno funciona <b>hasta que el cliente descubre por su cuenta</b> que las ventas no crecieron — ' +
             'y a partir de ahí todo lo que reportes se lee con desconfianza.' },

        { p: '¿Cómo se reporta la atribución sin mentir?',
          r: 'Sin sumar lo que reporta cada plataforma, porque eso siempre da de más. Digo el número real del negocio, aclaro que las plataformas ' +
             'se atribuyen más en total <b>porque varias participan en la misma venta</b>, y doy mi lectura. ' +
             'Y explico el solapamiento <b>una vez, al principio de la relación</b>: cuando el cliente lo entiende, deja de ser un motivo de sospecha ' +
             'y pasa a ser un dato conocido. Explicarlo recién cuando lo descubre tiene un efecto muy distinto.' },

        { p: '¿Por qué la periodicidad del informe es una decisión técnica?',
          r: 'Porque un informe semanal al cliente invita a discutir variaciones que <b>son azar</b>, y esa discusión termina en presión para tocar ' +
             'campañas que deberían estar quietas — con lo cual se <b>reinicia el aprendizaje</b> y el rendimiento empeora de verdad. ' +
             'Semanal sirve para operar internamente; el informe de decisión es mensual, y la revisión de estrategia, trimestral.' },
      ],

      practica: `
<h4>Plantilla de informe mensual</h4>
<pre><code># &lt;Cliente&gt; — Agosto 2026

## 1 · El negocio
Ventas totales       $ 8.415.000   (objetivo: $ 8.000.000) ✔ +5%
Contra agosto 2025   +18%
Pedidos              187

## 2 · Medio pago
Inversión            $ 1.240.000
Conversiones atribuidas   Meta 92 · Google 68 · TikTok 21
CPA promedio         $ 6.850  (objetivo: $ 7.000) ✔
Nota: las plataformas suman 181 conversiones sobre 187 ventas reales.
      Es normal: varias participan en la misma venta.

## 3 · Qué cambió
· El creativo "testimonio-3" superó al anterior: CPA $ 5.400 vs $ 7.900.
· Google búsqueda subió el CPC 18% — entró un competidor nuevo
  (visible en el informe de subastas).

## 4 · Qué NO funcionó
· La campaña de TikTok no llegó al CPA objetivo ($ 11.200 vs 7.000).
  Diagnóstico: creativo adaptado de Meta, no producido para la plataforma.
  Decisión: producir 3 videos específicos o pausar el canal en septiembre.
· El público similar al 5% rindió peor que el amplio. Se pausó.

## 5 · Septiembre
1. Producir 3 videos nativos para TikTok (decisión pendiente del cliente)
2. Separar campaña de marca en Google para aislar el efecto del competidor
3. Subir presupuesto de Meta 20% (el CPA aguanta)

## 6 · Necesitamos
· Aprobación de los 3 videos de TikTok, o decisión de pausar el canal
· Acceso al CRM para subir conversiones offline (mejora esperada: alta)</code></pre>

<div class="aviso"><strong>Fijate que la sección 6 convierte una dependencia en una decisión del
cliente.</strong> Sin ella, "no pudimos hacer X porque no nos dieron acceso" aparece <b>tres meses después</b>
como una excusa. Escrito cada mes, es un pedido con historia.</div>

<h4>Cómo se ve una explicación completa</h4>
<pre><code>Métrica    CPA subió de $ 6.200 a $ 9.400 (+52%)

Causa      El creativo principal llegó a frecuencia 7 y el CTR cayó 38%.
           Es fatiga creativa, esperable a esta altura del ciclo.

Acción     3 creativos nuevos, ya en producción, salen el lunes.

Expectativa Volver al rango de $ 7.000 en dos semanas.
           Si a las tres semanas sigue arriba de $ 8.000,
           el problema es otro y lo revisamos juntos.</code></pre>

<div class="dato"><strong>Esa última línea —el criterio de "si no pasa esto, entonces"— es la que más
confianza construye.</strong> Estás diciendo por adelantado <b>cómo se sabrá si te equivocaste</b>, ' +
que es exactamente lo contrario de una excusa.</div>

<h4>Errores a evitar en el informe</h4>
<table>
<tr><th>Error</th><th>Por qué</th></tr>
<tr><td>Sumar conversiones de todas las plataformas</td><td>Siempre da de más</td></tr>
<tr><td>Encabezar con impresiones o alcance</td><td>No responden nada de negocio</td></tr>
<tr><td>Comparar solo contra el mes anterior</td><td>La estacionalidad distorsiona</td></tr>
<tr><td>Omitir lo que no funcionó</td><td>Se pierde credibilidad de golpe</td></tr>
<tr><td>Explicar con "cambios del algoritmo"</td><td>No se puede verificar: suena a excusa</td></tr>
<tr><td>Informar todas las semanas</td><td>Genera reacciones a ruido</td></tr>
</table>
`,

      errores: [
        { mito: 'Muestro solo lo bueno para que el cliente esté tranquilo.',
          realidad: 'Funciona <b>hasta que descubre por su cuenta</b> que las ventas no crecieron — y a partir de ahí todo lo que reportes se lee con ' +
                    'desconfianza. La credibilidad se pierde de golpe y se recupera muy lento.' },

        { mito: 'Sumo las ventas que reporta cada plataforma.',
          realidad: 'Eso <b>siempre da de más</b>, porque varias participan en la misma venta. Se reporta el número real del negocio y se explica ' +
                    'el solapamiento — una vez, al principio de la relación.' },

        { mito: 'Comparo contra el mes anterior.',
          realidad: 'La <b>estacionalidad</b> distorsiona: diciembre contra noviembre produce una conclusión falsa en casi cualquier rubro. ' +
                    'Contra el mismo mes del año anterior, y sobre todo contra el objetivo.' },

        { mito: 'Informo todas las semanas para que el cliente esté al tanto.',
          realidad: 'Invita a discutir variaciones que <b>son azar</b>, y esa discusión termina en cambios que reinician el aprendizaje. ' +
                    'La periodicidad del informe es, en la práctica, una decisión técnica.' },
      ],

      glosario: [
        { t: 'Informe de decisión', d: 'El mensual: sirve para decidir, no para informar actividad.' },
        { t: 'Solapamiento', d: 'Que varias plataformas se atribuyan la misma venta.' },
        { t: 'Comparación interanual', d: 'Contra el mismo mes del año anterior. Neutraliza la estacionalidad.' },
        { t: 'Causa, acción, expectativa', d: 'Los tres elementos de una explicación que no es excusa.' },
        { t: 'Criterio de falsación', d: 'Decir por adelantado cómo se sabrá si la hipótesis era equivocada.' },
        { t: 'Métrica de vanidad', d: 'La que se ve bien y no responde ninguna pregunta de negocio.' },
        { t: 'Dependencia del cliente', d: 'Lo que hace falta de su lado. Se pide por escrito, cada mes.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál de los tres números clave decide si podés crecer y casi nadie mira?',
      opciones: [
        'El período de recuperación: cuántos meses tarda un cliente en devolver lo que costó',
        'El CAC',
        'El LTV',
        'El ROAS',
      ],
      correcta: 0,
      porQue: 'Con recuperación a doce meses, cada cliente nuevo consume caja durante un año. Dos negocios con el mismo LTV pueden tener capacidades de crecimiento completamente distintas.',
      porQueNo: {
        1: 'Es fundamental, pero no dice nada sobre el ritmo de reinversión.',
        2: 'Tampoco: dos negocios con igual LTV pueden crecer a ritmos muy distintos.',
        3: 'Es una métrica de campaña, no de capacidad financiera.',
      },
    },
    {
      p: '¿Cuál es la referencia práctica de la regla del tercio?',
      opciones: [
        'CAC cerca de un tercio del LTV: deja margen para operación, producto y crecimiento',
        'Invertir un tercio del presupuesto en cada canal',
        'Recuperar un tercio de la inversión el primer mes',
        'Destinar un tercio del margen a publicidad',
      ],
      correcta: 0,
      porQue: 'Con CAC igual al LTV sobrevivís pero no crecés, y por encima perdés plata en cada cliente nuevo.',
      porQueNo: {
        1: 'Repartir en tres partes iguales fragmenta el aprendizaje.',
        2: 'Es una meta razonable pero no es la regla del tercio.',
        3: 'No es la referencia estándar.',
      },
    },
    {
      p: '¿Cuál es la trampa más común con el LTV?',
      opciones: [
        'Que está inflado: se calcula con los mejores clientes y se proyecta a años sin datos',
        'Que es difícil de calcular',
        'Que cambia todos los meses',
        'Que solo aplica a suscripciones',
      ],
      correcta: 0,
      porQue: 'Si no lo podés mostrar con doce meses de datos propios y por cohorte, usá el valor de la primera compra: conservador y real es mejor que optimista e inventado.',
      porQueNo: {
        1: 'Con datos de ventas es una consulta simple.',
        2: 'Varía, pero eso no es lo que lo hace engañoso.',
        3: 'Aplica a cualquier negocio con recompra.',
      },
    },
    {
      p: '¿Por qué promediar todos los clientes de los últimos 12 meses sobrestima el LTV?',
      opciones: [
        'Porque mezcla a quien compró hace once meses con quien compró el mes pasado y aún no tuvo tiempo de volver',
        'Porque incluye devoluciones',
        'Porque no descuenta el margen',
        'Porque incluye clientes inactivos',
      ],
      correcta: 0,
      porQue: 'El cálculo correcto sigue a una cohorte: los clientes que compraron por primera vez en un mismo período, y cuánto gastaron desde entonces.',
      porQueNo: {
        1: 'Se pueden excluir, y no es el sesgo principal.',
        2: 'Es otro ajuste, distinto del sesgo temporal.',
        3: 'Los inactivos bajan el promedio, no lo suben.',
      },
    },
    {
      p: 'En un análisis por cohortes, el mes 12 es casi igual al mes 0. ¿Qué significa?',
      opciones: [
        'Es un negocio de compra única: el CAC tiene que cerrar con la primera venta',
        'La medición está rota',
        'Hay que subir el presupuesto',
        'Los clientes están insatisfechos',
      ],
      correcta: 0,
      porQue: 'Si hubiera recurrencia fuerte, el mes 12 duplicaría al mes 0 y podrías pagar más caro un cliente. Son dos estrategias de inversión completamente distintas.',
      porQueNo: {
        1: 'Es un resultado normal en muchos rubros.',
        2: 'Justamente indica que hay menos margen para pagar más.',
        3: 'Puede ser simplemente la naturaleza del producto.',
      },
    },
    {
      p: 'Con presupuesto menor a 1.000 USD por mes, ¿cómo repartís entre canales?',
      opciones: [
        'Un solo canal: repartir entre tres garantiza que ninguno junte datos suficientes',
        'Un tercio a cada uno, para diversificar',
        'Mitad Google, mitad Meta',
        'Todo a remarketing, que tiene mejor ROAS',
      ],
      correcta: 0,
      porQue: 'Los tres rendirían peor que uno solo con todo el presupuesto. Diversificar es una estrategia de escala, no de arranque.',
      porQueNo: {
        1: 'Fragmenta el aprendizaje en las tres plataformas.',
        2: 'Sigue dividiendo un presupuesto que ya es chico.',
        3: 'Sin captación no entra gente nueva al embudo.',
      },
    },
    {
      p: '¿Qué distinción ordena el reparto entre canales?',
      opciones: [
        'Capturar demanda existente vs crear demanda',
        'Canales de pago vs orgánicos',
        'Móvil vs escritorio',
        'B2B vs B2C',
      ],
      correcta: 0,
      porQue: 'Si la gente ya busca tu categoría, capturar es mucho más barato que convencer desde cero. Si nadie busca, la búsqueda no tiene a quién capturar.',
      porQueNo: {
        1: 'Es otra distinción, sobre el tipo de inversión.',
        2: 'Es un ajuste de configuración, no de estrategia de canal.',
        3: 'Influye, pero no es el eje que ordena el reparto.',
      },
    },
    {
      p: '¿Qué restricción se omite más al planificar presupuesto?',
      opciones: [
        'La caja: con recuperación a seis meses no podés gastar lo que el CAC objetivo permitiría',
        'El límite de la plataforma',
        'La estacionalidad',
        'La capacidad del equipo',
      ],
      correcta: 0,
      porQue: 'El presupuesto sostenible no sale del CAC objetivo: sale de cuánto efectivo podés adelantar hasta cobrar.',
      porQueNo: {
        1: 'Las plataformas no imponen techos relevantes en estos volúmenes.',
        2: 'Se considera habitualmente en los planes.',
        3: 'Importa, pero la restricción financiera es la que más se omite.',
      },
    },
    {
      p: '¿Por qué el informe debe empezar por el número del negocio?',
      opciones: [
        'Porque hace que la conversación sea sobre el negocio y no sobre tu trabajo',
        'Porque es el dato más fácil de conseguir',
        'Porque lo exigen los clientes',
        'Porque las plataformas no son confiables',
      ],
      correcta: 0,
      porQue: 'Si arrancás con conversiones y ROAS, la charla es sobre tu desempeño. Si arrancás con ventas contra objetivo, las decisiones son compartidas.',
      porQueNo: {
        1: 'Suele requerir acceso al sistema del cliente.',
        2: 'Muchos no lo piden: hay que proponerlo.',
        3: 'Son confiables para lo suyo; el punto es de encuadre.',
      },
    },
    {
      p: '¿Cuál es la sección que más credibilidad da a un informe?',
      opciones: [
        'Qué NO funcionó, con el diagnóstico y lo que se aprendió',
        'El resumen ejecutivo',
        'Los gráficos de tendencia',
        'La comparación con la competencia',
      ],
      correcta: 0,
      porQue: 'Demuestra que estás mirando de verdad, hace creíble todo lo demás, y evita la sorpresa: los problemas se cuentan antes de que exploten.',
      porQueNo: {
        1: 'Ayuda a la lectura, no a la credibilidad.',
        2: 'Son útiles pero no generan confianza por sí solos.',
        3: 'Suele basarse en estimaciones poco verificables.',
      },
    },
    {
      p: '¿Cómo se reporta la atribución sin mentir?',
      opciones: [
        'Con el número real del negocio, aclarando que las plataformas suman más porque varias participan en la misma venta',
        'Sumando lo que reporta cada plataforma',
        'Reportando solo la plataforma principal',
        'Usando el promedio entre plataformas y sistema',
      ],
      correcta: 0,
      porQue: 'Y conviene explicar el solapamiento una vez, al principio de la relación: cuando el cliente lo entiende, deja de ser motivo de sospecha.',
      porQueNo: {
        1: 'Siempre da de más y termina descubriéndose.',
        2: 'Oculta el aporte de las otras y sigue sin cerrar.',
        3: 'Un promedio no tiene ningún significado real.',
      },
    },
    {
      p: '¿Cuál es la comparación más honesta en un informe mensual?',
      opciones: [
        'Contra el mismo mes del año anterior, y contra el objetivo',
        'Contra el mes anterior',
        'Contra el promedio del año',
        'Contra el mejor mes histórico',
      ],
      correcta: 0,
      porQue: 'Comparar diciembre contra noviembre produce una conclusión falsa en casi cualquier rubro, y es la comparación por defecto de todas las herramientas.',
      porQueNo: {
        1: 'La estacionalidad distorsiona el resultado.',
        2: 'Suaviza demasiado y esconde tendencias.',
        3: 'Compara contra un caso excepcional.',
      },
    },
    {
      p: '¿Qué tres elementos convierten una explicación en algo que no es una excusa?',
      opciones: [
        'Causa, acción y expectativa',
        'Datos, gráficos y comparativas',
        'Diagnóstico, presupuesto y plazo',
        'Contexto, disculpa y plan',
      ],
      correcta: 0,
      porQue: 'Con esos tres, el cliente sabe qué esperar y puede evaluar el mes siguiente contra algo concreto. Sin ellos, solo puede confiar o desconfiar.',
      porQueNo: {
        1: 'Son formas de presentar, no elementos de la explicación.',
        2: 'Falta decir qué se espera que ocurra después.',
        3: 'La disculpa no aporta información accionable.',
      },
    },
    {
      p: '¿Por qué la periodicidad del informe es una decisión técnica?',
      opciones: [
        'Porque un informe semanal invita a discutir ruido y eso termina en cambios que reinician el aprendizaje',
        'Porque generar informes consume tiempo',
        'Porque las plataformas actualizan datos cada semana',
        'Porque los datos tardan 48 horas en estabilizarse',
      ],
      correcta: 0,
      porQue: 'La presión para tocar campañas que deberían estar quietas empeora el rendimiento real. Semanal sirve para operar internamente; el informe de decisión es mensual.',
      porQueNo: {
        1: 'Es un costo, pero no el motivo técnico.',
        2: 'Los datos se actualizan a diario.',
        3: 'Es cierto y afecta a la lectura diaria, no a la periodicidad del informe.',
      },
    },
    {
      p: '¿Qué aporta incluir una sección de "qué necesitamos" en el informe?',
      opciones: [
        'Convierte una dependencia en una decisión del cliente, con historia escrita',
        'Alarga el informe',
        'Justifica el presupuesto',
        'Reemplaza la reunión mensual',
      ],
      correcta: 0,
      porQue: 'Sin ella, "no pudimos hacer X porque no nos dieron acceso" aparece tres meses después como una excusa. Escrito cada mes, es un pedido con historia.',
      porQueNo: {
        1: 'Ocupa poco y es de lo más accionable.',
        2: 'No tiene relación con justificar la inversión.',
        3: 'Complementa la reunión, no la reemplaza.',
      },
    },
  ],
});
