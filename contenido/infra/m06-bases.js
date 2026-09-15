/* ==========================================================================
   Infra · Módulo 06 — Bases de datos gestionadas
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'infra',
  id: 'm06',
  titulo: 'Bases de datos gestionadas',
  fuentes: ['postgres', 'pgbouncer', 'supabase-docs', 'supabase-precios', 'neon-precios', 'cloudflare-workers'],

  intro:
    '<p>La base de datos es la pieza que menos conviene administrar uno mismo y la que más caro sale equivocarse. ' +
    'Un servidor de aplicación que se cae se reemplaza; una base corrupta sin respaldo verificado es el final de ' +
    'un proyecto.</p>' +
    '<p>Este módulo va sobre qué te resuelve realmente un servicio gestionado, qué sigue siendo tuyo pase lo que ' +
    'pase, y cómo elegir entre las opciones sin quedarte solo con el precio de lista.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Qué te da un servicio gestionado',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> instalar Postgres es fácil. <b>Operarlo bien
durante años</b> —respaldos que restauran, actualizaciones sin cortes, ajuste de parámetros, recuperación ante
un desastre— es un oficio.</div>

<h4>Lo que se ve y lo que no</h4>
<p>Cuando alguien dice "instalo Postgres en el VPS y listo", está pensando en el primer día. Estas son las
cosas del día 200:</p>
<ul>
<li><b>Respaldos automáticos</b> y —lo más importante— que <b>restauren de verdad</b>.</li>
<li><b>Actualizaciones de versión</b>, incluidos los parches de seguridad.</li>
<li><b>Ajuste de parámetros</b>: memoria compartida, cantidad de conexiones, autovacuum.</li>
<li><b>Monitoreo</b>: consultas lentas, bloqueos, espacio en disco.</li>
<li><b>Alta disponibilidad</b>: qué pasa si esa máquina muere.</li>
<li><b>Recuperación a un punto en el tiempo</b>: volver al estado de ayer a las 14:32.</li>
</ul>

<div class="aviso"><strong>El punto que más se subestima es el <i>autovacuum</i>.</strong> Postgres no borra
físicamente las filas actualizadas o eliminadas: las marca como muertas y un proceso las limpia después. Si ese
proceso no está bien ajustado, la base <b>crece sin parar y se pone cada vez más lenta</b>, y el síntoma
—"anda cada vez peor"— no apunta a la causa. Es un problema real, silencioso, y de los primeros que aparecen
en una base autoadministrada con mucha escritura.</div>

<h4>Lo que sigue siendo tuyo, siempre</h4>
<p>Un servicio gestionado <b>no</b> te resuelve:</p>
<ul>
<li><b>El diseño del esquema</b> y los índices.</li>
<li><b>Las consultas lentas</b> que escribiste.</li>
<li><b>Las migraciones</b> y que sean compatibles hacia atrás.</li>
<li><b>El control de acceso</b> — RLS, roles, permisos.</li>
<li><b>Protegerte de vos mismo</b>: si borrás una tabla, la borraste.</li>
</ul>

<p>Y una advertencia sobre el punto anterior: los respaldos del proveedor te cubren de una falla de hardware,
<b>no de un error humano que nadie notó durante una semana</b>. Si la retención es de siete días y el problema
empezó hace diez, no hay a dónde volver.</p>
`,

      tecnico: `
<h4>Lo que hay que verificar de un proveedor</h4>
<table>
<tr><th>Punto</th><th>Qué preguntar</th></tr>
<tr><td><b>Retención de respaldos</b></td><td>¿Cuántos días? ¿Se puede extender?</td></tr>
<tr><td><b>PITR</b></td><td>¿Se puede restaurar a un momento exacto o solo a los snapshots?</td></tr>
<tr><td><b>Tiempo de restauración</b></td><td>Un respaldo de 200 GB puede tardar horas. Eso <b>es</b> tu tiempo de caída</td></tr>
<tr><td><b>Alta disponibilidad</b></td><td>¿Hay conmutación automática? ¿Cuánto tarda? ¿Está en el plan que pagás?</td></tr>
<tr><td><b>Extensiones</b></td><td>¿Están las que usás? pgvector, pg_cron, PostGIS</td></tr>
<tr><td><b>Versión de Postgres</b></td><td>¿Qué versiones ofrecen y con qué política de actualización?</td></tr>
<tr><td><b>Salida de datos</b></td><td>¿Podés hacer un <code>pg_dump</code> completo cuando quieras?</td></tr>
</table>

<div class="dato"><strong>El punto del tiempo de restauración es el que casi nadie pregunta</strong> y el que
define tu verdadero objetivo de recuperación. Tener respaldos de los últimos 30 días no sirve de mucho si
restaurarlos lleva cuatro horas y tu negocio no tolera cuatro horas caído. <b>El respaldo no es la métrica: la
métrica es cuánto tardás en volver a estar en línea.</b></div>

<h4>Dos números que hay que definir con el negocio</h4>
<ul>
<li><b>RPO</b> (<i>Recovery Point Objective</i>) — cuántos datos podés perder. Con respaldos diarios, tu RPO es de 24 horas.</li>
<li><b>RTO</b> (<i>Recovery Time Objective</i>) — cuánto podés estar caído. Es el tiempo de restauración más el de detectar el problema.</li>
</ul>
<p>No son decisiones técnicas: son decisiones de negocio. Y definirlas explícitamente cambia qué plan
contratás, qué frecuencia de respaldos configurás y si necesitás réplica o no.</p>

<h4>El autovacuum, con un poco más de detalle</h4>
<p>Postgres usa control de concurrencia multiversión: un <code>UPDATE</code> no modifica la fila, escribe una
versión nueva y marca la vieja como muerta. El <i>autovacuum</i> recupera ese espacio.</p>
<p>Cuando queda corto en una tabla con mucha escritura:</p>
<ul>
<li>La tabla se <b>infla</b>: ocupa mucho más de lo que sus datos justifican.</li>
<li>Las consultas se vuelven más lentas porque hay que leer más páginas.</li>
<li>Los índices también se inflan.</li>
<li>En el caso extremo, se acerca el límite de <i>wraparound</i> de identificadores de transacción, y ahí Postgres deja de aceptar escrituras para protegerse.</li>
</ul>
<p>Un servicio gestionado lo ajusta y lo monitorea por vos. En una base propia, es tuyo — y lo vas a descubrir
cuando ya esté inflada.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    “INSTALO POSTGRES Y LISTO” — el día 1 vs el día 200</text>

  <rect x="24" y="34" width="304" height="60" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.3"/>
  <text x="176" y="56" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">DÍA 1</text>
  <text x="176" y="78" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11">apt install postgresql · funciona</text>

  <rect x="352" y="34" width="304" height="60" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.5"/>
  <text x="504" y="56" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">DÍA 200</text>
  <text x="504" y="78" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11">todo lo de abajo, y ninguna es opcional</text>

  <rect x="24" y="106" width="200" height="34" rx="7" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.2"/>
  <text x="124" y="127" text-anchor="middle" fill="currentColor" opacity=".8" font-size="10">respaldos que RESTAUREN</text>

  <rect x="240" y="106" width="200" height="34" rx="7" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.2"/>
  <text x="340" y="127" text-anchor="middle" fill="currentColor" opacity=".8" font-size="10">actualizaciones y parches</text>

  <rect x="456" y="106" width="200" height="34" rx="7" fill="#f87171" fill-opacity=".22" stroke="#f87171" stroke-width="1.6"/>
  <text x="556" y="122" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">autovacuum</text>
  <text x="556" y="135" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8.5">el más subestimado</text>

  <rect x="24" y="148" width="200" height="34" rx="7" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.2"/>
  <text x="124" y="169" text-anchor="middle" fill="currentColor" opacity=".8" font-size="10">consultas lentas y bloqueos</text>

  <rect x="240" y="148" width="200" height="34" rx="7" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.2"/>
  <text x="340" y="169" text-anchor="middle" fill="currentColor" opacity=".8" font-size="10">alta disponibilidad</text>

  <rect x="456" y="148" width="200" height="34" rx="7" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.2"/>
  <text x="556" y="169" text-anchor="middle" fill="currentColor" opacity=".8" font-size="10">recuperación a un punto</text>

  <line x1="24" y1="202" x2="656" y2="202" stroke="currentColor" opacity=".18"/>

  <text x="24" y="226" fill="#fbbf24" font-size="12" font-weight="700">
    LOS DOS NÚMEROS QUE DEFINE EL NEGOCIO, NO VOS</text>

  <rect x="24" y="238" width="304" height="76" rx="10" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="176" y="260" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">RPO</text>
  <text x="176" y="280" text-anchor="middle" fill="currentColor" opacity=".72" font-size="10.5">cuántos datos podés perder</text>
  <text x="176" y="300" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">respaldo diario → RPO de 24 h</text>

  <rect x="352" y="238" width="304" height="76" rx="10" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="504" y="260" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">RTO</text>
  <text x="504" y="280" text-anchor="middle" fill="currentColor" opacity=".72" font-size="10.5">cuánto podés estar caído</text>
  <text x="504" y="300" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">detectar + restaurar</text>

  <rect x="24" y="326" width="632" height="60" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="348" text-anchor="middle" fill="#f87171" font-size="12" font-weight="700">
    El respaldo no es la métrica. La métrica es CUÁNTO TARDÁS EN VOLVER.</text>
  <text x="340" y="368" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">
    Tener 30 días de respaldos no sirve si restaurarlos lleva 4 horas y el negocio no tolera 4 horas caído.</text>
  <text x="340" y="382" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">
    Y la retención te cubre de una falla de hardware, no de un error humano que nadie notó en diez días.</text>
</svg>`,
        pie: 'Instalar Postgres es el día 1. Lo que se contrata es todo lo del día 200.',
      },

      entrevista: [
        { p: '¿Qué te da realmente una base de datos gestionada?',
          r: 'Lo que no se ve el primer día: <b>respaldos automáticos que restauran de verdad</b>, actualizaciones y parches de seguridad, ' +
             'ajuste de parámetros —memoria, conexiones, autovacuum—, monitoreo de consultas lentas y bloqueos, alta disponibilidad y recuperación ' +
             'a un punto en el tiempo. Instalar Postgres es trivial; <b>operarlo bien durante años es un oficio</b>. ' +
             'Lo que <b>no</b> te da es diseño de esquema, índices, consultas eficientes, migraciones ni control de acceso: eso sigue siendo tuyo.' },

        { p: '¿Qué son RPO y RTO?',
          r: '<b>RPO</b> es cuántos datos podés permitirte perder: con respaldos diarios tu RPO es de 24 horas. <b>RTO</b> es cuánto tiempo podés ' +
             'estar caído, y es el tiempo de <i>detectar</i> el problema más el de <i>restaurar</i>. Lo importante es que <b>no son decisiones ' +
             'técnicas sino de negocio</b>, y definirlas explícitamente cambia qué plan contratás y si necesitás réplica. ' +
             'La pregunta que casi nadie hace al proveedor es <b>cuánto tarda una restauración</b>: tener 30 días de respaldos no sirve si ' +
             'recuperarlos lleva cuatro horas y el negocio no tolera cuatro horas caído.' },

        { p: '¿Qué es el autovacuum y por qué importa?',
          r: 'Postgres usa control de concurrencia multiversión: un <code>UPDATE</code> no modifica la fila, escribe una versión nueva y marca la ' +
             'vieja como muerta. El <b>autovacuum</b> recupera ese espacio. Si queda corto en una tabla con mucha escritura, la tabla y sus índices ' +
             '<b>se inflan</b>, las consultas se vuelven más lentas porque hay que leer más páginas, y en el caso extremo se acerca el ' +
             '<i>wraparound</i> de transacciones y Postgres deja de aceptar escrituras. El síntoma es "anda cada vez peor", que no apunta a la causa — ' +
             'y es de los primeros problemas serios de una base autoadministrada.' },

        { p: '¿Los respaldos del proveedor te protegen de todo?',
          r: 'No. Te protegen de una <b>falla de infraestructura</b> —que el disco muera—, no de <b>vos mismo</b>. Si una migración borra datos, ' +
             'si alguien con permisos hace algo mal, o si un bug corrompe registros de a poco, eso es tuyo. Y hay un detalle temporal importante: ' +
             'si la retención es de siete días y el problema empezó hace diez, <b>no hay a dónde volver</b>. ' +
             'Por eso conviene tener un volcado propio con retención más larga, y sobre todo <b>haber probado la restauración</b>: ' +
             'un respaldo que nunca restauraste no es un respaldo.' },
      ],

      practica: `
<h4>Probar la restauración, que es lo único que cuenta</h4>
<pre><code># 1 · Volcado completo
pg_dump -Fc -h HOST -U USUARIO -d BASE &gt; respaldo.dump

# 2 · Restaurar en una base LIMPIA (no en producción)
createdb prueba_restauracion
pg_restore -d prueba_restauracion --no-owner --no-privileges respaldo.dump

# 3 · Verificar que llegó todo
psql -d prueba_restauracion -c "
  select relname, n_live_tup
  from pg_stat_user_tables
  order by n_live_tup desc limit 20;"

# 4 · Cronometrarlo. Ese tiempo ES tu RTO.</code></pre>

<div class="aviso"><strong>El paso 4 es el que convierte esto en información útil.</strong> Si la restauración
tardó 40 minutos con tu volumen actual, ese es tu tiempo de caída mínimo — y va a crecer con los datos.
Si el negocio no tolera 40 minutos, necesitás una réplica, no más respaldos.</div>

<h4>Detectar tablas infladas</h4>
<pre><code>-- Cuántas filas muertas hay y cuándo pasó el autovacuum
select
  relname,
  n_live_tup as vivas,
  n_dead_tup as muertas,
  round(100.0 * n_dead_tup / nullif(n_live_tup + n_dead_tup, 0), 1) as pct_muertas,
  last_autovacuum
from pg_stat_user_tables
where n_dead_tup &gt; 1000
order by n_dead_tup desc;</code></pre>
<p>Si una tabla tiene un porcentaje alto de filas muertas y <code>last_autovacuum</code> es viejo o nulo,
ahí está el problema. Se ajusta por tabla:</p>
<pre><code>-- Autovacuum más agresivo en una tabla con mucha escritura
alter table eventos set (
  autovacuum_vacuum_scale_factor = 0.02,   -- default 0.2
  autovacuum_vacuum_threshold = 1000
);</code></pre>

<h4>Checklist al contratar</h4>
<table>
<tr><th>☐</th><th>Verificar</th></tr>
<tr><td>☐</td><td>Retención de respaldos, y si se puede extender</td></tr>
<tr><td>☐</td><td>Si hay recuperación a un punto en el tiempo, y con qué granularidad</td></tr>
<tr><td>☐</td><td><b>Cuánto tarda una restauración</b> con tu volumen</td></tr>
<tr><td>☐</td><td>Si la alta disponibilidad está en el plan que pagás</td></tr>
<tr><td>☐</td><td>Que estén las extensiones que usás</td></tr>
<tr><td>☐</td><td>Que puedas hacer <code>pg_dump</code> completo cuando quieras</td></tr>
<tr><td>☐</td><td>Que tengas un volcado propio, fuera del proveedor</td></tr>
</table>
<p>El último es el que te salva de dos cosas a la vez: un error humano viejo, y quedarte encerrado en un
proveedor.</p>
`,

      errores: [
        { mito: 'Instalar Postgres es fácil, lo administro yo.',
          realidad: 'Instalarlo es el día 1. El día 200 son respaldos que restauran, actualizaciones, ajuste de <b>autovacuum</b>, monitoreo de ' +
                    'consultas lentas y un plan de recuperación. Es un oficio, y la base es la pieza donde equivocarse sale más caro.' },

        { mito: 'Tengo respaldos automáticos, estoy cubierto.',
          realidad: 'Te cubren de una falla de <b>infraestructura</b>, no de un error humano. Si la retención es de siete días y el problema empezó ' +
                    'hace diez, no hay a dónde volver. Y <b>un respaldo que nunca restauraste no es un respaldo</b>: hasta que no lo probaste, ' +
                    'es una suposición.' },

        { mito: 'Lo importante es la frecuencia de los respaldos.',
          realidad: 'Eso define tu <b>RPO</b> —cuántos datos perdés—, pero falta el <b>RTO</b>: cuánto tardás en volver. Treinta días de respaldos ' +
                    'no sirven si restaurarlos lleva cuatro horas y el negocio no las tolera. <b>Cronometrá una restauración real.</b>' },

        { mito: 'Un servicio gestionado me resuelve el rendimiento.',
          realidad: 'Resuelve la <b>operación</b>, no tu <b>esquema</b>. Índices faltantes, consultas N+1 y migraciones incompatibles siguen siendo ' +
                    'tuyos — y son la causa de la mayoría de los problemas de rendimiento reales.' },
      ],

      glosario: [
        { t: 'Base gestionada', d: 'Servicio donde el proveedor opera la base: respaldos, actualizaciones, monitoreo y disponibilidad.' },
        { t: 'RPO', d: 'Recovery Point Objective. Cuántos datos podés permitirte perder.' },
        { t: 'RTO', d: 'Recovery Time Objective. Cuánto podés estar caído, incluido el tiempo de detección.' },
        { t: 'PITR', d: 'Point-in-time recovery. Restaurar al estado de un momento exacto, no solo al último snapshot.' },
        { t: 'Autovacuum', d: 'Proceso que recupera el espacio de filas muertas en Postgres. Si queda corto, la base se infla.' },
        { t: 'MVCC', d: 'Control de concurrencia multiversión. Un UPDATE escribe una versión nueva en lugar de modificar.' },
        { t: 'Inflado (bloat)', d: 'Espacio ocupado por filas muertas no recuperadas. Vuelve las consultas más lentas.' },
        { t: 'Wraparound', d: 'Límite de identificadores de transacción. Al acercarse, Postgres bloquea las escrituras para protegerse.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Conexiones: el límite que aparece primero',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> una conexión a Postgres <b>no es barata</b>: es un
proceso del sistema operativo con su propia memoria. Por eso el límite llega mucho antes de lo que uno espera.</div>

<h4>Por qué el límite es tan bajo</h4>
<p>En Postgres, cada conexión abierta es un <b>proceso separado</b> en el servidor, con varios megabytes de
memoria propia. Cien conexiones son cien procesos. Por eso el máximo típico ronda las 100 y no las 10.000 —
no es una restricción arbitraria, es cómo está construido.</p>

<h4>Dónde se agota</h4>
<p>Cualquiera de estos escenarios lo alcanza sin ser un producto grande:</p>
<ul>
<li><b>Serverless</b> — cada ejecución concurrente abre la suya. Mil peticiones, mil intentos.</li>
<li><b>Varias instancias</b> — cinco instancias con pool de 20 son 100 conexiones antes de recibir tráfico.</li>
<li><b>Un pool mal configurado</b> — el default de muchos ORM es más alto de lo que conviene.</li>
<li><b>Conexiones que no se cierran</b> — una fuga que va sumando hasta que nada entra.</li>
</ul>

<h4>El pooler</h4>
<p>Un <b>pooler</b> se pone en el medio: tu aplicación abre muchas conexiones contra él, y él mantiene pocas
contra la base, reutilizándolas.</p>
<pre><code>Sin pooler:   1.000 conexiones de app  →  1.000 a Postgres  ✗
Con pooler:   1.000 conexiones de app  →  20 a Postgres     ✓</code></pre>

<div class="aviso"><strong>La trampa del pooler, que hay que conocer antes de usarlo:</strong> el modo
<b>transaction</b> —el más eficiente, y el que usan Supabase y PgBouncer por defecto para esto— reutiliza la
conexión entre transacciones. Eso rompe todo lo que dependa de estado en la sesión: <b>sentencias
preparadas</b>, <code>LISTEN/NOTIFY</code>, tablas temporales y variables de sesión.<br><br>
Y varios ORM usan sentencias preparadas <b>por defecto</b>. Es la sorpresa número uno al conectar Prisma o
Drizzle a un pooler, y se resuelve desactivándolas o usando modo <i>session</i>, que es menos eficiente.</div>
`,

      tecnico: `
<h4>Los modos de pooling</h4>
<table>
<tr><th>Modo</th><th>La conexión se libera…</th><th>Eficiencia</th><th>Restricciones</th></tr>
<tr><td><b>Session</b></td><td>Al desconectarse el cliente</td><td>Baja</td><td>Ninguna: se comporta como una conexión directa</td></tr>
<tr><td><b>Transaction</b></td><td>Al terminar cada transacción</td><td><b>Alta</b></td><td>Sin sentencias preparadas, LISTEN/NOTIFY, temporales ni variables de sesión</td></tr>
<tr><td><b>Statement</b></td><td>Al terminar cada sentencia</td><td>Máxima</td><td>No soporta transacciones de varias sentencias. Rara vez usable</td></tr>
</table>

<div class="dato"><strong>Cómo elegir en la práctica:</strong> usá <b>transaction</b> para el tráfico normal de
la aplicación — es donde está la ganancia. Reservá una conexión directa o en modo <b>session</b> para lo que lo
necesite: migraciones, <code>LISTEN/NOTIFY</code>, y herramientas administrativas. Supabase, por ejemplo,
expone <b>dos cadenas de conexión distintas</b> con puertos distintos justamente por esto, y usar la equivocada
produce errores confusos.</div>

<h4>Dimensionar el pool de la aplicación</h4>
<p>La intuición dice "más conexiones, más rendimiento". Es falso: pasado cierto punto, más conexiones
<b>empeoran</b> el rendimiento por contención. Un punto de partida razonable:</p>
<pre><code>tamaño_pool ≈ (núcleos_de_la_base × 2) + husos_de_disco</code></pre>
<p>En la práctica, para una base chica o mediana, un pool de <b>10 a 20 por instancia</b> alcanza casi siempre.
Y en serverless, <b>1 por entorno</b>, como viste en el módulo anterior.</p>

<h4>Diagnóstico</h4>
<pre><code>-- ¿Cuántas conexiones hay y en qué estado?
select state, count(*)
from pg_stat_activity
group by state;

--  active               → trabajando
--  idle                 → conectado sin hacer nada (normal, del pool)
--  idle in transaction  → ⚠ abrió una transacción y la dejó abierta

-- El límite configurado
show max_connections;</code></pre>

<div class="dato"><strong><code>idle in transaction</code> es el estado peligroso.</strong> Significa que
alguien abrió una transacción y no la cerró: mantiene bloqueos, impide que el autovacuum limpie, y consume una
conexión. Suele venir de un error en el código —una excepción entre el <code>BEGIN</code> y el
<code>COMMIT</code> sin <code>ROLLBACK</code>—. Se acota con <code>idle_in_transaction_session_timeout</code>,
que corta esas sesiones automáticamente. <b>Es una configuración de tres palabras que evita incidentes
enteros.</b></div>

<h4>Conexiones directas vs por HTTP</h4>
<p>Algunos proveedores ofrecen acceso por HTTP en vez de TCP —el driver serverless de Neon, la Data API de
Supabase—. Ventajas: no hay conexión persistente, así que el problema desaparece por completo y funciona desde
runtimes de edge. Costo: algo más de latencia por petición y, en general, sin transacciones interactivas.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    POR QUÉ EL LÍMITE ES TAN BAJO</text>

  <rect x="24" y="34" width="632" height="46" rx="10" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="54" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">
    En Postgres, cada conexión es un PROCESO del sistema operativo con su propia memoria.</text>
  <text x="340" y="72" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">
    Cien conexiones son cien procesos. Por eso el máximo típico ronda las 100, no las 10.000.</text>

  <line x1="24" y1="98" x2="656" y2="98" stroke="currentColor" opacity=".18"/>

  <rect x="24" y="112" width="290" height="112" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="169" y="134" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">SIN POOLER</text>
  <g fill="#f87171" fill-opacity=".5">
    <rect x="40" y="146" width="12" height="10" rx="2"/><rect x="56" y="146" width="12" height="10" rx="2"/>
    <rect x="72" y="146" width="12" height="10" rx="2"/><rect x="88" y="146" width="12" height="10" rx="2"/>
    <rect x="104" y="146" width="12" height="10" rx="2"/><rect x="120" y="146" width="12" height="10" rx="2"/>
    <rect x="136" y="146" width="12" height="10" rx="2"/><rect x="152" y="146" width="12" height="10" rx="2"/>
    <rect x="168" y="146" width="12" height="10" rx="2"/><rect x="184" y="146" width="12" height="10" rx="2"/>
    <rect x="200" y="146" width="12" height="10" rx="2"/><rect x="216" y="146" width="12" height="10" rx="2"/>
    <rect x="232" y="146" width="12" height="10" rx="2"/><rect x="248" y="146" width="12" height="10" rx="2"/>
    <rect x="264" y="146" width="12" height="10" rx="2"/><rect x="280" y="146" width="12" height="10" rx="2"/>
    <rect x="40" y="160" width="12" height="10" rx="2"/><rect x="56" y="160" width="12" height="10" rx="2"/>
    <rect x="72" y="160" width="12" height="10" rx="2"/><rect x="88" y="160" width="12" height="10" rx="2"/>
    <rect x="104" y="160" width="12" height="10" rx="2"/><rect x="120" y="160" width="12" height="10" rx="2"/>
    <rect x="136" y="160" width="12" height="10" rx="2"/><rect x="152" y="160" width="12" height="10" rx="2"/>
  </g>
  <text x="169" y="190" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">1.000 conexiones de app</text>
  <text x="169" y="210" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">→ 1.000 a Postgres ✗</text>

  <rect x="338" y="112" width="318" height="112" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="497" y="134" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">CON POOLER</text>
  <g fill="#34d399" fill-opacity=".4">
    <rect x="354" y="146" width="12" height="10" rx="2"/><rect x="370" y="146" width="12" height="10" rx="2"/>
    <rect x="386" y="146" width="12" height="10" rx="2"/><rect x="402" y="146" width="12" height="10" rx="2"/>
    <rect x="418" y="146" width="12" height="10" rx="2"/><rect x="434" y="146" width="12" height="10" rx="2"/>
    <rect x="450" y="146" width="12" height="10" rx="2"/><rect x="466" y="146" width="12" height="10" rx="2"/>
    <rect x="354" y="160" width="12" height="10" rx="2"/><rect x="370" y="160" width="12" height="10" rx="2"/>
    <rect x="386" y="160" width="12" height="10" rx="2"/><rect x="402" y="160" width="12" height="10" rx="2"/>
  </g>
  <rect x="490" y="142" width="52" height="34" rx="6" fill="#22d3ee" fill-opacity=".3" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="516" y="163" text-anchor="middle" fill="#22d3ee" font-size="9" font-weight="700">pooler</text>
  <g fill="#34d399" fill-opacity=".7">
    <rect x="566" y="146" width="14" height="10" rx="2"/><rect x="584" y="146" width="14" height="10" rx="2"/>
    <rect x="602" y="146" width="14" height="10" rx="2"/><rect x="620" y="146" width="14" height="10" rx="2"/>
    <rect x="566" y="160" width="14" height="10" rx="2"/><rect x="584" y="160" width="14" height="10" rx="2"/>
  </g>
  <text x="497" y="190" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">1.000 de app → 20 reales</text>
  <text x="497" y="210" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">Postgres está cómodo ✓</text>

  <text x="24" y="248" fill="#f87171" font-size="12" font-weight="700">
    LA TRAMPA DEL MODO TRANSACTION</text>

  <rect x="24" y="260" width="632" height="60" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="282" fill="currentColor" opacity=".75" font-size="11">
    Reutiliza la conexión entre transacciones → rompe todo lo que dependa del estado de la sesión:</text>
  <text x="44" y="302" fill="#f87171" font-size="11" font-weight="700">
    sentencias preparadas · LISTEN/NOTIFY · tablas temporales · variables de sesión</text>
  <text x="44" y="315" fill="currentColor" opacity=".6" font-size="10">
    Y varios ORM usan sentencias preparadas POR DEFECTO — la sorpresa n°1 al conectar Prisma o Drizzle.</text>

  <rect x="24" y="332" width="632" height="54" rx="10" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="354" fill="#fbbf24" font-size="11.5" font-weight="700">EL ESTADO PELIGROSO: idle in transaction</text>
  <text x="44" y="374" fill="currentColor" opacity=".72" font-size="10.5">
    Mantiene bloqueos, impide el autovacuum y consume una conexión. Se corta con idle_in_transaction_session_timeout.</text>
</svg>`,
        pie: 'Una conexión a Postgres es un proceso. De ahí se derivan el límite bajo y la necesidad del pooler.',
      },

      entrevista: [
        { p: '¿Por qué Postgres tiene un límite de conexiones tan bajo?',
          r: 'Porque cada conexión es un <b>proceso separado del sistema operativo</b>, con varios megabytes de memoria propia. Cien conexiones ' +
             'son cien procesos. No es una restricción arbitraria: es cómo está construido. Por eso el máximo típico ronda las 100, ' +
             'y se agota antes de lo que uno espera: cinco instancias con pool de 20 ya lo alcanzan <b>antes de recibir tráfico</b>, ' +
             'y en serverless cada ejecución concurrente abre la suya.' },

        { p: '¿Qué es un pooler y qué modos tiene?',
          r: 'Un intermediario que mantiene pocas conexiones reales contra la base y las reutiliza entre muchas conexiones de aplicación. ' +
             'Tiene tres modos: <b>session</b>, que libera al desconectarse el cliente y no tiene restricciones pero apenas ayuda; ' +
             '<b>transaction</b>, que libera al terminar cada transacción y es donde está la ganancia real; y <b>statement</b>, que libera por ' +
             'sentencia y casi no se usa porque rompe las transacciones de varias sentencias. En la práctica se usa <b>transaction para el tráfico ' +
             'normal</b> y una conexión directa para migraciones y herramientas.' },

        { p: '¿Cuál es la trampa del modo transaction?',
          r: 'Que al reutilizar la conexión entre transacciones <b>rompe todo lo que dependa del estado de la sesión</b>: sentencias preparadas, ' +
             '<code>LISTEN/NOTIFY</code>, tablas temporales y variables de sesión. Y lo importante es que varios ORM usan sentencias preparadas ' +
             '<b>por defecto</b>, así que al conectar Prisma o Drizzle a un pooler aparecen errores confusos. Se resuelve desactivándolas o usando ' +
             'modo session, que es menos eficiente. Por eso Supabase expone dos cadenas de conexión con puertos distintos: una para cada caso.' },

        { p: '¿Qué significa el estado "idle in transaction"?',
          r: 'Que una sesión abrió una transacción y no la cerró. Es el estado peligroso: <b>mantiene bloqueos, impide que el autovacuum limpie ' +
             'y consume una conexión</b>. Suele venir de un error en el código —una excepción entre el <code>BEGIN</code> y el <code>COMMIT</code> ' +
             'sin <code>ROLLBACK</code>—. Se acota con <code>idle_in_transaction_session_timeout</code>, que corta esas sesiones automáticamente. ' +
             'Es una configuración de una línea que evita incidentes enteros.' },
      ],

      practica: `
<h4>Ver qué está pasando ahora</h4>
<pre><code>-- Conexiones por estado y por aplicación
select
  application_name,
  state,
  count(*),
  max(now() - state_change) as mas_vieja
from pg_stat_activity
where datname = current_database()
group by 1, 2
order by count desc;

-- Las peligrosas: transacciones abiertas hace rato
select pid, usename, state, now() - state_change as tiempo, query
from pg_stat_activity
where state = 'idle in transaction'
  and now() - state_change &gt; interval '1 minute';</code></pre>

<div class="aviso"><strong>Si ves conexiones <code>idle in transaction</code> de más de un minuto, tenés un
bug.</strong> Alguien abre una transacción y no la cierra en algún camino de error. Mientras tanto, esa sesión
retiene bloqueos y bloquea la limpieza del autovacuum. La configuración
<code>idle_in_transaction_session_timeout</code> las corta sola, pero conviene encontrar el código igual.</div>

<h4>Configurar el pool correctamente</h4>
<pre><code>// Aplicación tradicional con instancias fijas
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 15,                       // por instancia · 5 instancias = 75
  idleTimeoutMillis: 30_000,     // devolver conexiones ociosas
  connectionTimeoutMillis: 5_000 // fallar rápido si no hay disponibles
});

// Serverless: uno por entorno, y contra el POOLER
const pool = new Pool({
  connectionString: process.env.POOLER_URL,   // ← no la URL directa
  max: 1,
});</code></pre>

<h4>Dos cadenas, dos usos</h4>
<pre><code># Tráfico normal de la aplicación → pooler en modo transaction
DATABASE_URL="postgres://…@…pooler.…:6543/postgres?pgbouncer=true"

# Migraciones, LISTEN/NOTIFY, herramientas → conexión directa
DIRECT_URL="postgres://…@…:5432/postgres"</code></pre>
<p>Ese <code>?pgbouncer=true</code> es lo que le indica a Prisma que desactive las sentencias preparadas.
Sin él, las consultas fallan de forma intermitente y el error no dice nada sobre el pooler.</p>

<h4>Síntoma → causa</h4>
<table>
<tr><th>Síntoma</th><th>Causa probable</th></tr>
<tr><td><code>too many connections</code></td><td>Pool mal dimensionado, o falta pooler</td></tr>
<tr><td>Timeouts al pedir conexión</td><td>El pool está agotado: consultas lentas o fuga</td></tr>
<tr><td>Errores intermitentes de sentencias preparadas</td><td>Modo transaction sin desactivarlas</td></tr>
<tr><td>La base se pone lenta con el tiempo</td><td><code>idle in transaction</code> bloqueando el autovacuum</td></tr>
<tr><td>Todo empeora al escalar instancias</td><td>Cada instancia suma su pool completo</td></tr>
</table>
`,

      errores: [
        { mito: 'Más conexiones en el pool, mejor rendimiento.',
          realidad: 'Pasado cierto punto, más conexiones <b>empeoran</b> el rendimiento por contención. Para una base chica o mediana, ' +
                    '<b>10 a 20 por instancia</b> alcanza casi siempre — y en serverless, una por entorno.' },

        { mito: 'Pongo un pooler y ya está resuelto.',
          realidad: 'El modo <b>transaction</b> rompe sentencias preparadas, <code>LISTEN/NOTIFY</code>, tablas temporales y variables de sesión. ' +
                    'Y varios ORM usan sentencias preparadas por defecto. Hay que desactivarlas o usar una <b>conexión directa</b> para lo que ' +
                    'lo necesite.' },

        { mito: 'Uso la misma cadena de conexión para todo.',
          realidad: 'Las migraciones y <code>LISTEN/NOTIFY</code> necesitan <b>conexión directa</b>; el tráfico normal conviene por el pooler. ' +
                    'Por eso los proveedores exponen dos cadenas con puertos distintos, y usar la equivocada da errores confusos que no mencionan ' +
                    'el pooler.' },

        { mito: 'Las conexiones idle son un problema.',
          realidad: '<code>idle</code> es <b>normal</b>: son las del pool esperando trabajo. La peligrosa es <b><code>idle in transaction</code></b>, ' +
                    'que retiene bloqueos e impide el autovacuum. Distinguirlas es lo primero al diagnosticar.' },
      ],

      glosario: [
        { t: 'Pooler', d: 'Intermediario que multiplexa muchas conexiones de aplicación sobre pocas reales.' },
        { t: 'Session pooling', d: 'Libera la conexión al desconectarse el cliente. Sin restricciones, poca ganancia.' },
        { t: 'Transaction pooling', d: 'Libera al terminar cada transacción. Máxima ganancia, rompe el estado de sesión.' },
        { t: 'Sentencia preparada', d: 'Consulta precompilada en la sesión. Incompatible con transaction pooling.' },
        { t: 'idle', d: 'Conexión abierta sin actividad. Normal en un pool.' },
        { t: 'idle in transaction', d: 'Transacción abierta sin cerrar. Retiene bloqueos e impide el autovacuum.' },
        { t: 'max_connections', d: 'Límite de conexiones simultáneas configurado en Postgres.' },
        { t: 'Driver HTTP', d: 'Acceso a la base por HTTP en lugar de TCP. Elimina el problema de conexiones.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Respaldos, réplicas y disponibilidad',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un respaldo y una réplica resuelven problemas
<b>distintos</b>, y confundirlos es lo que deja proyectos sin salida.</div>

<h4>La diferencia, que es toda</h4>
<p><b>Una réplica</b> es una copia <b>viva</b>: refleja lo que pasa en la base principal casi al instante.
Sirve para seguir funcionando si la principal muere, y para repartir las lecturas.</p>
<p><b>Un respaldo</b> es una foto <b>del pasado</b>. Sirve para volver a un estado anterior.</p>

<p>Por qué importa la distinción:</p>
<blockquote style="border-left:3px solid var(--mal);padding-left:14px;margin:16px 0;color:var(--texto-2)">
Si ejecutás un <code>DELETE</code> sin <code>WHERE</code>, <b>la réplica también lo borra</b>, en menos de un
segundo. La réplica no te protege de un error: lo <b>propaga</b>.
</blockquote>

<div class="aviso"><strong>Necesitás las dos cosas, y por razones distintas.</strong> La réplica te cubre de que
<b>el hardware falle</b>. El respaldo te cubre de que <b>vos falles</b>. Tener solo réplicas es la ilusión de
seguridad más común en infraestructura.</div>

<h4>Tipos de respaldo</h4>
<table>
<tr><th>Tipo</th><th>Qué es</th><th>Bueno para</th></tr>
<tr><td><b>Volcado lógico</b> (<code>pg_dump</code>)</td><td>Un archivo con las instrucciones para reconstruir</td><td>Portable entre versiones y proveedores. Lento en bases grandes</td></tr>
<tr><td><b>Copia física</b></td><td>Los archivos de datos tal cual</td><td>Rápido de restaurar. Atado a la versión</td></tr>
<tr><td><b>PITR</b></td><td>Copia base más el registro de cambios</td><td>Volver a <b>cualquier momento</b>, no solo al último snapshot</td></tr>
</table>

<p><b>PITR es el que cambia el juego</b>: te permite decir "restaurá al estado de ayer a las 14:31, un minuto
antes de la migración que rompió todo". Sin PITR, volvés al último snapshot y perdés todo lo posterior.</p>
`,

      tecnico: `
<h4>Replicación en Postgres</h4>
<table>
<tr><th>Tipo</th><th>Cómo</th><th>Uso</th></tr>
<tr><td><b>Física (streaming)</b></td><td>Copia byte a byte del registro de escritura</td><td>Alta disponibilidad y réplicas de lectura. Misma versión</td></tr>
<tr><td><b>Lógica</b></td><td>Replica cambios a nivel de fila, por tabla</td><td>Migraciones entre versiones o proveedores, replicación selectiva</td></tr>
</table>
<p>La <b>lógica</b> es la que se usa para migrar sin cortar, como viste en el módulo de costos: permite
replicar entre versiones distintas y hacia otro proveedor.</p>

<h4>Sincrónica o asincrónica</h4>
<ul>
<li><b>Asincrónica</b> (el default) — la escritura confirma sin esperar a la réplica. Rápida, pero si el primario muere podés perder las últimas transacciones.</li>
<li><b>Sincrónica</b> — cada escritura espera confirmación de la réplica. Sin pérdida de datos, pero le sumás la latencia de red <b>a cada escritura</b>.</li>
</ul>
<p>Con réplicas en la misma región, sincrónica cuesta poco. Entre regiones, la penalidad es grande.</p>

<div class="dato"><strong>El retraso de réplica es el problema práctico más frecuente.</strong> Con replicación
asincrónica, la réplica va unos milisegundos atrás. Si dirigís las lecturas a la réplica, un usuario puede
<b>escribir y no ver su propio cambio</b> — guarda, la interfaz recarga, y vuelve el dato viejo. Se resuelve
leyendo del primario durante unos segundos después de cada escritura de ese usuario. ' +
<b>Es intermitente y confuso, y por eso cuesta tanto diagnosticarlo.</b></div>

<h4>Conmutación por error</h4>
<p>Si el primario muere, alguien tiene que promover una réplica. Las opciones:</p>
<ul>
<li><b>Automática</b> — el proveedor detecta y promueve, típicamente en menos de un minuto. Es lo que pagás en un plan de alta disponibilidad.</li>
<li><b>Manual</b> — alguien tiene que darse cuenta y ejecutarlo. Tu RTO pasa a incluir el tiempo de reacción de una persona.</li>
</ul>
<p>Y un detalle: tras la conmutación, la <b>cadena de conexión</b> tiene que apuntar al nuevo primario.
Los proveedores lo resuelven con un nombre DNS que se reapunta; en una infraestructura propia, eso lo tenés
que construir.</p>

<h4>Una estrategia razonable</h4>
<table>
<tr><th>Capa</th><th>Qué</th><th>Cubre</th></tr>
<tr><td>1</td><td>Réplica en otra zona, con conmutación automática</td><td>Fallo de hardware o de una zona</td></tr>
<tr><td>2</td><td>PITR del proveedor, 7-30 días</td><td>Errores recientes: una migración mala</td></tr>
<tr><td>3</td><td><b>Volcado propio</b> fuera del proveedor, retención larga</td><td>Errores viejos, y quedar encerrado en un proveedor</td></tr>
<tr><td>4</td><td>Prueba de restauración periódica</td><td>Que las capas 2 y 3 <b>funcionen de verdad</b></td></tr>
</table>
<p>La capa 3 es la que casi nadie tiene y la que más veces salva. La capa 4 es la que convierte a las otras
tres en algo real y no en una suposición.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="rb1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    RÉPLICA vs RESPALDO — resuelven problemas DISTINTOS</text>

  <rect x="24" y="34" width="304" height="126" rx="10" fill="#22d3ee" fill-opacity=".08" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="176" y="56" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">RÉPLICA — copia VIVA</text>

  <rect x="48" y="70" width="96" height="34" rx="7" fill="#22d3ee" fill-opacity=".3" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="96" y="91" text-anchor="middle" fill="currentColor" font-size="10" font-weight="700">primario</text>
  <line x1="148" y1="87" x2="200" y2="87" stroke="#22d3ee" stroke-width="2" marker-end="url(#rb1)" color="#22d3ee"/>
  <rect x="204" y="70" width="96" height="34" rx="7" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="252" y="91" text-anchor="middle" fill="currentColor" font-size="10" font-weight="700">réplica</text>

  <text x="176" y="124" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">te cubre de que falle el HARDWARE</text>
  <text x="176" y="146" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">un DELETE sin WHERE se replica igual</text>

  <rect x="352" y="34" width="304" height="126" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="56" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">RESPALDO — foto del PASADO</text>

  <rect x="376" y="70" width="60" height="34" rx="7" fill="#34d399" fill-opacity=".25"/>
  <text x="406" y="91" text-anchor="middle" fill="currentColor" font-size="9">lunes</text>
  <rect x="444" y="70" width="60" height="34" rx="7" fill="#34d399" fill-opacity=".3"/>
  <text x="474" y="91" text-anchor="middle" fill="currentColor" font-size="9">martes</text>
  <rect x="512" y="70" width="60" height="34" rx="7" fill="#34d399" fill-opacity=".4"/>
  <text x="542" y="91" text-anchor="middle" fill="currentColor" font-size="9">miércoles</text>
  <rect x="580" y="70" width="60" height="34" rx="7" fill="#34d399" fill-opacity=".55"/>
  <text x="610" y="91" text-anchor="middle" fill="#06281c" font-size="9" font-weight="700">hoy</text>

  <text x="504" y="124" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">te cubre de que falles VOS</text>
  <text x="504" y="146" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10.5">podés volver a antes del error</text>

  <rect x="24" y="172" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="193" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    Tener solo réplicas es la ilusión de seguridad más común. La réplica no te protege del error: lo PROPAGA.</text>

  <line x1="24" y1="222" x2="656" y2="222" stroke="currentColor" opacity=".18"/>

  <text x="24" y="246" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS CUATRO CAPAS</text>

  <rect x="24" y="258" width="632" height="30" rx="7" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="44" y="277" fill="#22d3ee" font-size="11" font-weight="700">1 · Réplica en otra zona</text>
  <text x="270" y="277" fill="currentColor" opacity=".7" font-size="10.5">cubre fallo de hardware o de una zona entera</text>

  <rect x="24" y="294" width="632" height="30" rx="7" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.2"/>
  <text x="44" y="313" fill="#34d399" font-size="11" font-weight="700">2 · PITR del proveedor</text>
  <text x="270" y="313" fill="currentColor" opacity=".7" font-size="10.5">volver a un momento exacto: “ayer 14:31, antes de la migración”</text>

  <rect x="24" y="330" width="632" height="30" rx="7" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="44" y="349" fill="#fbbf24" font-size="11" font-weight="700">3 · Volcado PROPIO, afuera</text>
  <text x="270" y="349" fill="#fbbf24" font-size="10.5" font-weight="700">el que casi nadie tiene y el que más veces salva</text>

  <rect x="24" y="366" width="632" height="30" rx="7" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.6"/>
  <text x="44" y="385" fill="#f87171" font-size="11" font-weight="700">4 · Probar la restauración</text>
  <text x="270" y="385" fill="#f87171" font-size="10.5" font-weight="700">lo que convierte a las otras tres en algo real y no en una suposición</text>
</svg>`,
        pie: 'La réplica te cubre de que falle el hardware. El respaldo, de que falles vos.',
      },

      entrevista: [
        { p: '¿Cuál es la diferencia entre una réplica y un respaldo?',
          r: 'Una <b>réplica</b> es una copia viva que refleja el primario casi al instante; un <b>respaldo</b> es una foto del pasado. ' +
             'La distinción es crítica: si ejecutás un <code>DELETE</code> sin <code>WHERE</code>, <b>la réplica también lo borra</b> en menos de un ' +
             'segundo. La réplica no te protege de un error humano: lo <b>propaga</b>. Hacen falta las dos por razones distintas: ' +
             'la réplica cubre que falle el hardware, el respaldo cubre que falles vos. <b>Tener solo réplicas es la ilusión de seguridad más común.</b>' },

        { p: '¿Qué es PITR y por qué importa?',
          r: '<i>Point-in-time recovery</i>: guardar una copia base más el registro continuo de cambios, lo que permite restaurar a ' +
             '<b>cualquier momento</b> y no solo al último snapshot. La diferencia práctica es enorme: con PITR podés decir "restaurá a ayer a las ' +
             '14:31, un minuto antes de la migración que rompió todo"; sin PITR volvés al último respaldo y perdés todo lo posterior. ' +
             'Es lo que convierte un incidente de "perdimos el día" en "perdimos un minuto".' },

        { p: '¿Qué problema trae dirigir las lecturas a una réplica?',
          r: 'El <b>retraso de réplica</b>. Con replicación asincrónica —que es el default— la réplica va unos milisegundos atrás, así que un usuario ' +
             'puede <b>escribir y no ver su propio cambio</b>: guarda, la interfaz recarga leyendo de la réplica, y vuelve el dato viejo. ' +
             'Es intermitente y depende de a qué réplica caiga, por eso cuesta tanto diagnosticarlo. Se resuelve leyendo del primario durante unos ' +
             'segundos después de cada escritura de ese usuario.' },

        { p: '¿Qué estrategia de respaldos recomendarías?',
          r: 'Cuatro capas. <b>Réplica en otra zona con conmutación automática</b> para el fallo de hardware. <b>PITR del proveedor</b>, de 7 a 30 ' +
             'días, para errores recientes. Un <b>volcado propio fuera del proveedor</b> con retención larga — es la capa que casi nadie tiene y ' +
             'la que salva de dos cosas: un error humano viejo y quedar encerrado en un proveedor. Y <b>pruebas de restauración periódicas</b>, ' +
             'que son las que convierten a las otras tres en algo real. Un respaldo que nunca restauraste es una suposición.' },
      ],

      practica: `
<h4>Volcado propio, automatizado</h4>
<pre><code>#!/bin/bash
set -euo pipefail

FECHA=$(date +%Y-%m-%d)
ARCHIVO="respaldo-$FECHA.dump"

# 1 · volcar en formato comprimido
pg_dump -Fc "$DATABASE_URL" &gt; "$ARCHIVO"

# 2 · verificar que no esté vacío ni corrupto
pg_restore --list "$ARCHIVO" &gt; /dev/null || { echo "Volcado corrupto"; exit 1; }

# 3 · subir FUERA del proveedor de la base
aws s3 cp "$ARCHIVO" "s3://mis-respaldos/$ARCHIVO" --endpoint-url "$R2_ENDPOINT"

# 4 · avisar si algo falló  ← sin esto, el cron falla en silencio
rm "$ARCHIVO"</code></pre>

<div class="aviso"><strong>El paso 2 es el que casi nadie hace y el que evita el peor escenario:</strong>
respaldos que se generan todos los días, se suben, y están <b>vacíos o corruptos</b>. Se descubre el día que
hacen falta. <code>pg_restore --list</code> lee el índice del archivo y falla si está mal, y cuesta segundos.</div>

<h4>Medir el retraso de réplica</h4>
<pre><code>-- En la réplica: cuánto está atrasada
select now() - pg_last_xact_replay_timestamp() as retraso;

-- En el primario: estado de cada réplica
select client_addr, state, sent_lsn, replay_lsn,
       pg_wal_lsn_diff(sent_lsn, replay_lsn) as bytes_atras
from pg_stat_replication;</code></pre>

<h4>Leer del primario después de escribir</h4>
<pre><code>// Patrón para evitar "escribí y no veo mi cambio"
const VENTANA_MS = 5_000;

async function consultar(sql, params, usuarioId) {
  const escribioRecien = await cache.get(\`escritura:\${usuarioId}\`);
  const conn = escribioRecien ? primario : replica;
  return conn.query(sql, params);
}

async function escribir(sql, params, usuarioId) {
  const r = await primario.query(sql, params);
  await cache.set(\`escritura:\${usuarioId}\`, '1', { ttl: VENTANA_MS });
  return r;
}</code></pre>

<h4>Calendario de verificación</h4>
<table>
<tr><th>Cada</th><th>Qué</th></tr>
<tr><td>Diario</td><td>Que el respaldo se generó y no está vacío (automático)</td></tr>
<tr><td>Mensual</td><td><b>Restaurar de verdad</b> en una base limpia y cronometrarlo</td></tr>
<tr><td>Trimestral</td><td>Ensayo de conmutación por error, si tenés réplica</td></tr>
<tr><td>Al crecer un orden de magnitud</td><td>Volver a medir el tiempo de restauración</td></tr>
</table>
`,

      errores: [
        { mito: 'Tengo una réplica, así que estoy respaldado.',
          realidad: 'La réplica <b>propaga</b> tus errores en menos de un segundo: un <code>DELETE</code> sin <code>WHERE</code> se replica igual. ' +
                    'Cubre que falle el hardware, no que falles vos. <b>Hacen falta las dos cosas.</b>' },

        { mito: 'El respaldo se generó, entonces está bien.',
          realidad: 'Un archivo puede generarse todos los días y estar <b>vacío o corrupto</b>. Verificalo con <code>pg_restore --list</code>, ' +
                    'que cuesta segundos, y <b>restauralo de verdad</b> al menos una vez por mes. Hasta entonces es una suposición.' },

        { mito: 'Con los respaldos del proveedor alcanza.',
          realidad: 'Te cubren de fallas recientes, no de un error humano de hace un mes ni de quedar encerrado en ese proveedor. ' +
                    'Un <b>volcado propio, afuera y con retención larga</b> es la capa que casi nadie tiene y la que más veces salva.' },

        { mito: 'Dirijo las lecturas a la réplica y listo.',
          realidad: 'Aparece el <b>retraso de réplica</b>: el usuario escribe y no ve su cambio. Hay que leer del primario durante unos segundos ' +
                    'después de cada escritura de ese usuario. Es un bug intermitente y confuso si no se anticipa.' },
      ],

      glosario: [
        { t: 'Réplica', d: 'Copia viva del primario, actualizada continuamente.' },
        { t: 'Respaldo', d: 'Copia de un estado pasado, para volver atrás.' },
        { t: 'PITR', d: 'Restaurar a cualquier momento usando una copia base más el registro de cambios.' },
        { t: 'Replicación física', d: 'Copia byte a byte del registro de escritura. Requiere misma versión.' },
        { t: 'Replicación lógica', d: 'Replica cambios a nivel de fila. Permite migrar entre versiones y proveedores.' },
        { t: 'Retraso de réplica', d: 'Diferencia temporal entre el primario y la réplica. Causa el problema de leer datos viejos.' },
        { t: 'Failover', d: 'Promover una réplica a primario cuando el original falla.' },
        { t: 'pg_dump', d: 'Herramienta de volcado lógico. Portable entre versiones y proveedores.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Elegir: Supabase, Neon, RDS o propia',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> todas corren Postgres. Lo que cambia es
<b>qué viene alrededor</b>, cómo te cobran, y cuánto trabajo te queda.</div>

<h4>Qué es cada una</h4>

<p><b>Supabase</b> — Postgres <i>más</i> autenticación, almacenamiento con políticas, tiempo real, funciones
edge y RLS bien integrado. No es una base: es una plataforma de aplicación.</p>

<p><b>Neon</b> — Postgres serverless. Separa cómputo y almacenamiento, <b>escala a cero</b> y tiene
<i>branching</i>: una copia instantánea de la base para cada rama de código, sin duplicar el almacenamiento.</p>

<p><b>RDS / Cloud SQL</b> — Postgres gestionado clásico. Muchas opciones, mucho control, más configuración.
Encaja si ya vivís en esa nube.</p>

<p><b>Postgres propio</b> — en un VPS o en un contenedor. Lo más barato en dinero, lo más caro en tiempo.</p>

<h4>Dos funciones que vale la pena entender</h4>

<p><b>Branching de base (Neon).</b> Cuando abrís una rama de código, creás una rama de base con los mismos
datos, al instante y sin copiar. Probás la migración ahí, la borrás, y no tocaste nada. <b>Resuelve un problema
real</b>: probar migraciones contra datos parecidos a producción sin arriesgar nada.</p>

<p><b>RLS integrado (Supabase).</b> Las políticas de acceso viven en la base, no en tu código. Un cliente
mal escrito no puede saltarse el aislamiento entre tenants porque <b>Postgres no se lo permite</b>. Y es una
función de Postgres, así que <b>viaja</b> si migrás a otro Postgres.</p>

<div class="aviso"><strong>La pregunta que ordena la elección:</strong> ¿necesitás solo Postgres, o necesitás
<b>lo que viene alrededor</b>? Si vas a construir autenticación, almacenamiento con permisos y tiempo real de
todos modos, una plataforma que ya los trae suele salir más barata que la suma de sus partes — aunque el
precio de lista de la base sea más alto.</div>
`,

      tecnico: `
<h4>Comparación</h4>
<table>
<tr><th></th><th>Supabase</th><th>Neon</th><th>RDS</th><th>Propia</th></tr>
<tr><td>Postgres estándar</td><td>Sí</td><td>Sí</td><td>Sí</td><td>Sí</td></tr>
<tr><td>Escala a cero</td><td>No</td><td><b>Sí</b></td><td>No</td><td>No</td></tr>
<tr><td>Branching</td><td>Ramas de proyecto</td><td><b>Sí, instantáneo</b></td><td>No</td><td>No</td></tr>
<tr><td>Auth incluida</td><td><b>Sí</b></td><td>No</td><td>No</td><td>No</td></tr>
<tr><td>Storage con policies</td><td><b>Sí</b></td><td>No</td><td>No</td><td>No</td></tr>
<tr><td>Realtime</td><td><b>Sí</b></td><td>No</td><td>No</td><td>No</td></tr>
<tr><td>pgvector</td><td>Sí</td><td>Sí</td><td>Sí</td><td>Sí</td></tr>
<tr><td>Pooler incluido</td><td>Sí</td><td>Sí</td><td>RDS Proxy, aparte</td><td>Lo instalás vos</td></tr>
<tr><td>Trabajo operativo</td><td>Mínimo</td><td>Mínimo</td><td>Medio</td><td><b>Alto</b></td></tr>
</table>

<div class="dato"><strong>Sobre migrar entre estas opciones:</strong> como todas son Postgres, mover
<b>la base</b> es relativamente simple —volcado, restauración, verificar extensiones y secuencias—. Lo que
<b>no</b> se mueve es lo que está alrededor. Salir de Supabase implica reemplazar auth, storage con políticas y
realtime; y de esos tres, <b>el auth es el caro</b>: semanas de trabajo y una superficie de seguridad que no
conviene mantener uno mismo. <b>La comparación honesta no es Postgres contra Postgres.</b></div>

<h4>Lo que hay que verificar antes de elegir</h4>
<ul>
<li><b>Extensiones.</b> pgvector, pg_cron, PostGIS. No todas están en todos.</li>
<li><b>Límite de conexiones</b> del plan, y si el pooler viene incluido.</li>
<li><b>Región</b>: que exista una cerca de tus usuarios, y de tu aplicación.</li>
<li><b>Retención de respaldos y PITR</b>, y si están en el plan que pagás.</li>
<li><b>Salida</b>: que puedas hacer <code>pg_dump</code> completo cuando quieras.</li>
<li><b>Límites por plan</b>: tamaño de base, cómputo, cantidad de proyectos.</li>
</ul>

<h4>Reducir el acoplamiento desde el día uno</h4>
<p>Sin trabajo extra, estas cuatro decisiones bajan mucho el costo de moverse después:</p>
<ul>
<li><b>SQL estándar</b> siempre que se pueda; lo específico del proveedor, aislado en un lugar.</li>
<li><b>RLS es de Postgres</b>, no de Supabase: se conserva al migrar entre Postgres.</li>
<li><b>Migraciones en archivos versionados</b>, no cambios hechos a mano en un panel.</li>
<li>El acceso a <b>storage y auth detrás de tu propia interfaz</b>, no llamando al SDK desde todos lados.</li>
</ul>
<p>Ese último punto es el que convierte un cambio de proveedor de auth de "refactor de semanas" a "reescribir
un módulo".</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="#7c5cff" font-size="12" font-weight="700">
    LA PREGUNTA QUE ORDENA LA ELECCIÓN</text>

  <rect x="130" y="34" width="420" height="42" rx="10" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.6"/>
  <text x="340" y="60" text-anchor="middle" fill="#7c5cff" font-size="12.5" font-weight="700">¿Necesitás solo Postgres, o lo que viene alrededor?</text>

  <rect x="24" y="92" width="200" height="118" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="124" y="114" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">SOLO POSTGRES</text>
  <text x="124" y="136" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">tráfico intermitente</text>
  <text x="124" y="156" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">NEON</text>
  <text x="124" y="176" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">escala a cero</text>
  <text x="124" y="192" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">branching por rama</text>

  <rect x="240" y="92" width="200" height="118" rx="10" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.5"/>
  <text x="340" y="114" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">+ AUTH, STORAGE,</text>
  <text x="340" y="130" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">REALTIME, RLS</text>
  <text x="340" y="154" text-anchor="middle" fill="#22d3ee" font-size="12" font-weight="700">SUPABASE</text>
  <text x="340" y="176" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">construir eso aparte</text>
  <text x="340" y="192" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">cuesta más que la diferencia</text>

  <rect x="456" y="92" width="200" height="118" rx="10" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="556" y="114" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">CONTROL FINO</text>
  <text x="556" y="136" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">o ya vivís en esa nube</text>
  <text x="556" y="156" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">RDS / propia</text>
  <text x="556" y="176" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">más opciones</text>
  <text x="556" y="192" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">más trabajo tuyo</text>

  <line x1="24" y1="230" x2="656" y2="230" stroke="currentColor" opacity=".18"/>

  <text x="24" y="254" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    QUÉ SE MUEVE Y QUÉ NO AL MIGRAR</text>

  <rect x="24" y="266" width="304" height="118" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.3"/>
  <text x="176" y="288" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">✓ SE MUEVE FÁCIL</text>
  <text x="44" y="310" fill="currentColor" opacity=".72" font-size="10.5">· el esquema y los datos (es Postgres)</text>
  <text x="44" y="328" fill="currentColor" opacity=".72" font-size="10.5">· las migraciones versionadas</text>
  <text x="44" y="346" fill="#34d399" font-size="10.5" font-weight="700">· RLS — es de Postgres, no del proveedor</text>
  <text x="44" y="368" fill="currentColor" opacity=".5" font-size="10">volcado, restauración, extensiones, secuencias</text>

  <rect x="352" y="266" width="304" height="118" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="504" y="288" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">✗ HAY QUE RECONSTRUIR</text>
  <text x="372" y="310" fill="#f87171" font-size="11" font-weight="700">· AUTH ← semanas + riesgo de seguridad</text>
  <text x="372" y="328" fill="currentColor" opacity=".72" font-size="10.5">· storage con políticas por fila</text>
  <text x="372" y="346" fill="currentColor" opacity=".72" font-size="10.5">· realtime</text>
  <text x="372" y="368" fill="#f87171" font-size="10" font-weight="700">la comparación NO es Postgres contra Postgres</text>
</svg>`,
        pie: 'Todas corren Postgres. Lo que cambia es qué viene alrededor y cuánto trabajo te queda.',
      },

      entrevista: [
        { p: '¿Cómo elegirías entre Supabase, Neon y una base propia?',
          r: 'Por una pregunta: <b>¿necesito solo Postgres, o lo que viene alrededor?</b> Si voy a construir autenticación, almacenamiento con ' +
             'permisos y tiempo real de todos modos, <b>Supabase</b> los trae y suele salir más barato que la suma de sus partes, aunque el precio ' +
             'de lista de la base sea mayor. Si solo necesito Postgres y el tráfico es intermitente, <b>Neon</b> escala a cero y además da branching ' +
             'por rama de código. Una base propia es lo más barato en dinero y lo más caro en tiempo, y solo la elegiría con alguien dedicado a ' +
             'infraestructura o con un requisito que lo obligue.' },

        { p: '¿Qué es el branching de base de datos y qué problema resuelve?',
          r: 'Crear una copia instantánea de la base para una rama de código, sin duplicar el almacenamiento — Neon lo hace con copia sobre escritura. ' +
             'Resuelve un problema muy concreto: <b>probar una migración contra datos parecidos a producción sin arriesgar nada</b>. ' +
             'Hoy eso se hace clonando a mano un entorno de staging que suele estar desactualizado, o directamente no se prueba. ' +
             'Con branching, cada pull request puede tener su propia base con datos realistas y borrarse al cerrarse.' },

        { p: 'Si migrás entre proveedores de Postgres, ¿qué se mueve fácil y qué no?',
          r: 'Se mueve fácil <b>el esquema y los datos</b>, porque es Postgres estándar: volcado y restauración, verificando extensiones y ' +
             'reajustando secuencias. Las migraciones versionadas también viajan. Y <b>RLS viaja</b>, porque es una función de Postgres y no del ' +
             'proveedor. Lo que <b>no</b> se mueve es lo que está alrededor: auth, storage con políticas por fila y realtime hay que reconstruirlos. ' +
             '<b>De esos tres, el auth es el caro</b>: semanas de trabajo y una superficie de seguridad que no conviene mantener uno mismo.' },

        { p: '¿Cómo reducís el acoplamiento a un proveedor desde el principio?',
          r: 'Cuatro decisiones que no cuestan trabajo extra si se toman al inicio. <b>SQL estándar</b> donde se pueda, con lo específico aislado. ' +
             'Aprovechar que <b>RLS es de Postgres</b>, así que el aislamiento entre tenants viaja. <b>Migraciones en archivos versionados</b>, ' +
             'nunca cambios hechos a mano en un panel. Y el acceso a <b>storage y auth detrás de mi propia interfaz</b>, no llamando al SDK desde ' +
             'todos lados — eso convierte un cambio de proveedor de auth de "refactor de semanas" a "reescribir un módulo".' },
      ],

      practica: `
<h4>Verificar antes de comprometerte</h4>
<pre><code>-- ¿Están las extensiones que necesitás?
select * from pg_available_extensions
where name in ('vector', 'pg_cron', 'postgis', 'pg_trgm');

-- ¿Cuál es el límite de conexiones del plan?
show max_connections;

-- ¿Qué versión de Postgres?
select version();</code></pre>

<div class="aviso"><strong>La verificación de extensiones es la que más migraciones frena a mitad de camino.</strong>
Si tu sistema usa <code>pgvector</code> y el destino no lo tiene, te enterás <b>después</b> de haber movido los
datos. Son treinta segundos de consulta y evitan una migración abortada.</div>

<h4>Aislar el proveedor detrás de tu interfaz</h4>
<pre><code>// ❌ El SDK del proveedor llamado desde toda la aplicación
import { createClient } from '@supabase/supabase-js';
// …en 40 archivos distintos

// ✅ Una interfaz propia y delgada
// lib/auth.ts
export async function usuarioActual() { /* hoy Supabase, mañana otro */ }
export async function requiereSesion() { /* … */ }

// lib/storage.ts
export async function subirArchivo(tenantId, ruta, archivo) { /* … */ }
export async function urlFirmada(tenantId, ruta, segundos) { /* … */ }</code></pre>
<p>Con eso, cambiar de proveedor de auth toca <b>dos archivos</b> en vez de cuarenta. Y no cuesta nada
si se hace desde el principio.</p>

<h4>Tabla de decisión</h4>
<table>
<tr><th>Tu situación</th><th>Elección</th></tr>
<tr><td>Necesitás auth, storage y realtime</td><td><b>Supabase</b></td></tr>
<tr><td>Solo Postgres, tráfico intermitente</td><td><b>Neon</b> — escala a cero</td></tr>
<tr><td>Querés base por rama de código</td><td><b>Neon</b> — branching instantáneo</td></tr>
<tr><td>Ya vivís en AWS o GCP</td><td><b>RDS / Cloud SQL</b></td></tr>
<tr><td>Presupuesto mínimo y tenés tiempo</td><td><b>Postgres propio</b> en un VPS</td></tr>
<tr><td>Requisito de infraestructura propia</td><td><b>Postgres propio</b>, con alguien dedicado</td></tr>
</table>

<h4>Antes de migrar por precio</h4>
<pre><code>1. ¿Qué línea de la factura es la cara?
2. ¿Se puede optimizar sin migrar?  (pooler, plan más chico, archivos a R2)
3. ¿Qué tendría que reconstruir?     (auth es el caro)
4. ahorro × 12  vs  horas × tarifa × 3</code></pre>
<p>Ese margen de <b>× 3</b> es por lo que siempre sale mal: la migración lleva más de lo estimado y aparecen
problemas después. Si el ahorro no lo soporta, la cuenta no cierra.</p>
`,

      errores: [
        { mito: 'Todas son Postgres, así que son intercambiables.',
          realidad: 'La <b>base</b> es intercambiable; lo que está alrededor no. Salir de una plataforma integrada implica reconstruir auth, ' +
                    'storage con políticas y realtime — y el auth son semanas más una superficie de seguridad que no conviene mantener uno mismo.' },

        { mito: 'Comparo el precio de la base y elijo.',
          realidad: 'Falta sumar lo que tendrías que <b>construir vos</b>. Si igual vas a necesitar autenticación y almacenamiento con permisos, ' +
                    'una plataforma que ya los trae suele salir más barata que la suma de sus partes, aunque el precio de lista sea mayor.' },

        { mito: 'Si migro, RLS lo pierdo.',
          realidad: '<b>RLS es una función de Postgres</b>, no del proveedor: viaja intacto al migrar entre Postgres. Es una de las razones para ' +
                    'apoyar el aislamiento entre tenants ahí y no en el código de la aplicación.' },

        { mito: 'Verifico las extensiones después de migrar.',
          realidad: 'Es la comprobación que más migraciones frena a mitad de camino. Si usás <code>pgvector</code> y el destino no lo tiene, ' +
                    'te enterás <b>después</b> de mover los datos. Son treinta segundos de consulta antes de empezar.' },
      ],

      glosario: [
        { t: 'Branching de base', d: 'Copia instantánea de la base para una rama de código, sin duplicar almacenamiento.' },
        { t: 'Copia sobre escritura', d: 'Técnica que permite clonar sin copiar: solo se escriben los bloques que cambian.' },
        { t: 'RLS', d: 'Row Level Security. Reglas de acceso por fila aplicadas por Postgres. Viaja entre proveedores.' },
        { t: 'Escala a cero', d: 'Apagar el cómputo sin tráfico, y por lo tanto sin costo.' },
        { t: 'Vendor lock-in', d: 'Acoplamiento que encarece cambiar de proveedor.' },
        { t: 'Capa de abstracción', d: 'Interfaz propia que aísla la aplicación del SDK del proveedor.' },
        { t: 'Extensión', d: 'Módulo que agrega funciones a Postgres: pgvector, pg_cron, PostGIS. Verificar antes de migrar.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Qué te resuelve principalmente una base de datos gestionada?',
      opciones: [
        'La operación: respaldos que restauran, actualizaciones, autovacuum, monitoreo y disponibilidad',
        'El diseño del esquema y los índices',
        'Las consultas lentas de tu aplicación',
        'Las migraciones compatibles hacia atrás',
      ],
      correcta: 0,
      porQue: 'Instalar Postgres es el día 1; operarlo bien durante años es un oficio. Lo que NO te resuelve es esquema, índices, consultas ni migraciones: eso sigue siendo tuyo.',
      porQueNo: {
        1: 'El esquema y los índices son decisiones de tu aplicación.',
        2: 'Una consulta mal escrita es lenta en cualquier proveedor.',
        3: 'La compatibilidad hacia atrás es responsabilidad de quien escribe la migración.',
      },
    },
    {
      p: '¿Qué es el autovacuum y qué pasa si queda corto?',
      opciones: [
        'Recupera el espacio de filas muertas; si queda corto, la base se infla y se pone cada vez más lenta',
        'Hace respaldos automáticos periódicos',
        'Optimiza las consultas automáticamente',
        'Cierra las conexiones ociosas',
      ],
      correcta: 0,
      porQue: 'Postgres usa MVCC: un UPDATE escribe una versión nueva y marca la vieja como muerta. El síntoma de un autovacuum corto es "anda cada vez peor", que no apunta a la causa.',
      porQueNo: {
        1: 'Los respaldos son un mecanismo aparte.',
        2: 'No modifica planes de consulta; a lo sumo actualiza estadísticas.',
        3: 'Las conexiones ociosas se manejan con timeouts.',
      },
    },
    {
      p: '¿Qué son RPO y RTO?',
      opciones: [
        'RPO es cuántos datos podés perder; RTO es cuánto podés estar caído',
        'Son métricas de rendimiento de consultas',
        'Son niveles de servicio del proveedor',
        'Son tipos de replicación',
      ],
      correcta: 0,
      porQue: 'No son decisiones técnicas sino de negocio. Y la pregunta que casi nadie hace al proveedor es cuánto tarda una restauración: eso ES tu RTO.',
      porQueNo: {
        1: 'No tienen relación con el rendimiento de consultas.',
        2: 'Son objetivos que definís vos, no niveles que ofrece el proveedor.',
        3: 'La replicación es un mecanismo; RPO y RTO son objetivos.',
      },
    },
    {
      p: '¿Por qué el límite de conexiones de Postgres es tan bajo?',
      opciones: [
        'Cada conexión es un proceso del sistema operativo con su propia memoria',
        'Por una restricción de licencia',
        'Porque el protocolo no soporta más',
        'Para forzar el uso de poolers comerciales',
      ],
      correcta: 0,
      porQue: 'Cien conexiones son cien procesos. Por eso el máximo típico ronda las 100 y se agota antes de lo esperado: cinco instancias con pool de 20 ya lo alcanzan sin tráfico.',
      porQueNo: {
        1: 'Postgres es de código abierto y sin restricciones de licencia por conexión.',
        2: 'El protocolo no impone ese límite.',
        3: 'PgBouncer es libre; la razón es arquitectónica.',
      },
    },
    {
      p: '¿Cuál es la trampa del modo transaction en un pooler?',
      opciones: [
        'Rompe sentencias preparadas, LISTEN/NOTIFY, tablas temporales y variables de sesión',
        'Es más lento que el modo session',
        'No soporta transacciones',
        'Requiere una versión específica de Postgres',
      ],
      correcta: 0,
      porQue: 'Al reutilizar la conexión entre transacciones se pierde el estado de sesión. Y varios ORM usan sentencias preparadas por defecto: es la sorpresa número uno al conectar Prisma o Drizzle.',
      porQueNo: {
        1: 'Es más eficiente que session: por eso se usa.',
        2: 'Soporta transacciones completas; lo que no soporta es estado ENTRE transacciones.',
        3: 'Funciona con cualquier versión moderna.',
      },
    },
    {
      p: '¿Qué significa el estado "idle in transaction"?',
      opciones: [
        'Una transacción quedó abierta sin cerrar: retiene bloqueos e impide el autovacuum',
        'Es el estado normal de las conexiones del pool',
        'La conexión está esperando una consulta lenta',
        'La conexión se cerró correctamente',
      ],
      correcta: 0,
      porQue: 'Suele venir de una excepción entre el BEGIN y el COMMIT sin ROLLBACK. Se acota con idle_in_transaction_session_timeout, que es una configuración de una línea que evita incidentes.',
      porQueNo: {
        1: 'Ese es "idle" a secas, que sí es normal.',
        2: 'Eso sería "active".',
        3: 'Una conexión cerrada no aparece en pg_stat_activity.',
      },
    },
    {
      p: '¿Cuál es el tamaño de pool razonable por instancia en una aplicación tradicional?',
      opciones: [
        '10 a 20: más conexiones empeoran el rendimiento por contención',
        '100, para tener margen',
        '1, como en serverless',
        'El máximo que permita la base',
      ],
      correcta: 0,
      porQue: 'La intuición de "más conexiones, más rendimiento" es falsa: pasado cierto punto hay contención. En serverless, en cambio, sí conviene 1 por entorno.',
      porQueNo: {
        1: 'Cinco instancias con 100 cada una serían 500 conexiones.',
        2: 'Eso es correcto para serverless, no para instancias fijas que atienden varias peticiones a la vez.',
        3: 'Agota la base apenas escalás instancias.',
      },
    },
    {
      p: '¿Cuál es la diferencia clave entre una réplica y un respaldo?',
      opciones: [
        'La réplica propaga tus errores; el respaldo te permite volver a antes del error',
        'La réplica es más rápida de restaurar',
        'El respaldo se actualiza en tiempo real',
        'Son lo mismo con distinto nombre',
      ],
      correcta: 0,
      porQue: 'Un DELETE sin WHERE se replica en menos de un segundo. La réplica cubre que falle el hardware; el respaldo cubre que falles vos. Tener solo réplicas es la ilusión de seguridad más común.',
      porQueNo: {
        1: 'No se "restaura" una réplica: se promueve, y con los mismos datos erróneos.',
        2: 'El respaldo es una foto del pasado, no se actualiza.',
        3: 'Resuelven problemas completamente distintos.',
      },
    },
    {
      p: '¿Qué permite PITR que no permite un respaldo diario?',
      opciones: [
        'Restaurar a un momento exacto, como "ayer 14:31, un minuto antes de la migración"',
        'Hacer respaldos más rápido',
        'Replicar entre regiones',
        'Comprimir mejor los datos',
      ],
      correcta: 0,
      porQue: 'Guarda una copia base más el registro continuo de cambios. Sin PITR volvés al último snapshot y perdés todo lo posterior: convierte "perdimos el día" en "perdimos un minuto".',
      porQueNo: {
        1: 'La velocidad de respaldo no es lo que cambia.',
        2: 'La replicación es un mecanismo distinto.',
        3: 'No tiene relación con la compresión.',
      },
    },
    {
      p: 'Dirigís las lecturas a una réplica y los usuarios reportan que "a veces no se guarda". ¿Qué pasa?',
      opciones: [
        'Retraso de réplica: escriben en el primario y leen de la réplica, que va atrasada',
        'La base rechaza las escrituras',
        'Falta un índice',
        'El pooler está mal configurado',
      ],
      correcta: 0,
      porQue: 'Es el problema de "read your own writes". Se resuelve leyendo del primario durante unos segundos después de cada escritura de ese usuario. Es intermitente y por eso cuesta diagnosticarlo.',
      porQueNo: {
        1: 'Si las rechazara, habría un error explícito, no un dato viejo.',
        2: 'Un índice faltante afecta la velocidad, no la consistencia.',
        3: 'El pooler no causa retraso de datos entre primario y réplica.',
      },
    },
    {
      p: '¿Qué capa de respaldo es la que casi nadie tiene y la que más veces salva?',
      opciones: [
        'Un volcado propio fuera del proveedor, con retención larga',
        'La réplica en otra zona',
        'El PITR del proveedor',
        'Los snapshots automáticos',
      ],
      correcta: 0,
      porQue: 'Te salva de dos cosas a la vez: un error humano viejo que la retención del proveedor ya no cubre, y quedar encerrado en un proveedor.',
      porQueNo: {
        1: 'Cubre el fallo de hardware, pero propaga los errores humanos.',
        2: 'Cubre errores recientes, dentro de su ventana de retención.',
        3: 'Son la base del PITR, pero siguen estando dentro del proveedor.',
      },
    },
    {
      p: 'Al verificar un respaldo, ¿qué hay que comprobar como mínimo?',
      opciones: [
        'Que el archivo no esté corrupto (pg_restore --list) y restaurarlo de verdad periódicamente',
        'Que el archivo exista y pese más de cero',
        'Que la fecha sea la de hoy',
        'Que esté subido al almacenamiento correcto',
      ],
      correcta: 0,
      porQue: 'Un respaldo puede generarse todos los días y estar vacío o corrupto, y se descubre el día que hace falta. pg_restore --list cuesta segundos; la restauración real es la única prueba que cuenta.',
      porQueNo: {
        1: 'Un archivo con contenido puede estar igualmente corrupto o incompleto.',
        2: 'La fecha no dice nada sobre el contenido.',
        3: 'Estar bien guardado no implica que sirva.',
      },
    },
    {
      p: 'Al comparar Supabase con alternativas más baratas, ¿qué hay que sumar?',
      opciones: [
        'El costo de reconstruir auth, storage con políticas y realtime',
        'El costo del dominio',
        'El costo de aprender SQL',
        'Nada: todas son Postgres',
      ],
      correcta: 0,
      porQue: 'La base es intercambiable; lo que está alrededor no. De los tres, el auth es el caro: semanas de trabajo y una superficie de seguridad que no conviene mantener uno mismo.',
      porQueNo: {
        1: 'Es marginal y no depende del proveedor de base.',
        2: 'SQL es el mismo en todas.',
        3: 'La base sí es intercambiable, pero la plataforma alrededor no.',
      },
    },
    {
      p: '¿Qué es el branching de base de datos y qué problema resuelve?',
      opciones: [
        'Una copia instantánea por rama de código: permite probar migraciones contra datos realistas sin riesgo',
        'Replicar la base en otra región',
        'Dividir la base en varias más chicas',
        'Hacer respaldos incrementales',
      ],
      correcta: 0,
      porQue: 'Hoy eso se hace clonando a mano un staging que suele estar desactualizado, o directamente no se prueba. Con branching, cada pull request puede tener su propia base y borrarse al cerrarse.',
      porQueNo: {
        1: 'Eso es replicación entre regiones.',
        2: 'Eso sería particionado o sharding.',
        3: 'Los respaldos incrementales son otro mecanismo.',
      },
    },
    {
      p: 'Al migrar entre proveedores de Postgres, ¿qué viaja sin problemas?',
      opciones: [
        'El esquema, los datos, las migraciones versionadas y las políticas RLS',
        'La autenticación de usuarios',
        'Las políticas de storage por fila',
        'La funcionalidad de tiempo real',
      ],
      correcta: 0,
      porQue: 'RLS es una función de Postgres, no del proveedor, así que el aislamiento entre tenants viaja intacto. Es una razón para apoyar el aislamiento ahí y no en el código de la aplicación.',
      porQueNo: {
        1: 'Es lo más caro de reconstruir: semanas y una superficie de seguridad.',
        2: 'Son específicas del sistema de storage del proveedor.',
        3: 'Es una función de la plataforma, no de Postgres.',
      },
    },
  ],
});
