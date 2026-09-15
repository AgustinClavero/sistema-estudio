/* ==========================================================================
   Arquitectura · Módulo 07 — Datos: modelado y consistencia
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'arquitectura',
  id: 'm07',
  titulo: 'Datos: modelado y consistencia',
  fuentes: ['postgres', 'supabase-docs', 'fowler'],

  intro:
    '<p>El modelo de datos es la decisión más difícil de revertir de todo el sistema: el código se reescribe, ' +
    'los datos se migran — y migrar es lento, riesgoso y no se puede deshacer.</p>' +
    '<p>Este módulo va sobre las cuatro decisiones que más pesan: <b>cómo modelar</b>, <b>qué garantías te da ' +
    'realmente una transacción</b>, <b>cómo aislar clientes</b> en un producto multi-tenant, y <b>cómo evolucionar ' +
    'el esquema</b> sin cortar el servicio.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Modelar: normalizar, y cuándo no',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> normalizar significa que <b>cada dato vive en un
solo lugar</b>. Es el default correcto, y hay excepciones concretas donde duplicar es lo correcto.</div>

<h4>Normalizar, en criollo</h4>
<pre><code>❌ Sin normalizar: el nombre del cliente repetido en cada pedido
pedidos: id | cliente_nombre | cliente_email | total
         1  | Ana Pérez      | ana@x.com     | 15000
         2  | Ana Pérez      | ana@x.com     | 8000
// Ana cambia de email → hay que actualizar N filas, y si falla una, quedan dos verdades

✔ Normalizado
clientes: id | nombre    | email
          c1 | Ana Pérez | ana@x.com
pedidos:  id | cliente_id | total</code></pre>

<div class="aviso"><strong>El problema real no es el espacio: es que puede haber
<b>dos verdades a la vez</b>.</strong> Si el email quedó actualizado en unos pedidos y no en otros, ninguna
consulta es confiable — y no hay error que lo delate. Normalizar hace que esa situación sea
<b>imposible</b>, no improbable.</div>

<h4>Las tres excepciones donde duplicar es correcto</h4>

<p><b>1 · Datos históricos.</b> Una factura debe mostrar la razón social <b>al momento de emitirse</b>. Ahí la
copia no es duplicación: es el dato correcto.</p>

<p><b>2 · Valores calculados costosos.</b> Si calcular el total de un pedido requiere sumar cien ítems y se
consulta todo el tiempo, guardarlo tiene sentido — con la disciplina de mantenerlo.</p>

<p><b>3 · Datos de otro contexto.</b> Como viste en el módulo de DDD: facturación puede guardar el nombre del
cliente en vez de consultarlo cada vez.</p>

<h4>La regla de oro</h4>
<pre><code>Normalizá por defecto.
Desnormalizá cuando midas un problema concreto.
Y cuando desnormalices, escribí cómo se mantiene sincronizado.</code></pre>

<p>La tercera línea es la que se olvida: una columna calculada sin un mecanismo que la mantenga se desactualiza
en semanas, y el sistema empieza a mostrar números que no cierran.</p>
`,

      tecnico: `
<h4>Restricciones: reglas que la base garantiza</h4>
<p>Una regla en el código se puede saltear —desde otra ruta, desde un script, desde la consola—. Una restricción
en la base <b>no</b>.</p>
<pre><code>create table cuotas (
  id uuid primary key,
  alumno_id uuid not null references alumnos(id) on delete restrict,
  periodo text not null check (periodo ~ '^\\d{4}-\\d{2}$'),
  monto_centavos int not null check (monto_centavos &gt; 0),
  estado text not null check (estado in ('pendiente','pagada','vencida','condonada')),
  vencimiento date not null,

  unique (alumno_id, periodo)      -- ← una sola cuota por alumno y período
);</code></pre>

<div class="dato"><strong>Esa restricción <code>unique</code> vale más que cualquier validación en el
código.</strong> Si dos procesos intentan crear la cuota de agosto al mismo tiempo, la aplicación no puede
evitarlo con un "verificar y después insertar" —hay una ventana entre las dos operaciones— pero la base
<b>sí</b>: una de las dos inserciones falla. <b>Las restricciones resuelven condiciones de carrera que el
código no puede.</b></div>

<h4>El <code>on delete</code>, que decide más de lo que parece</h4>
<table>
<tr><th>Opción</th><th>Qué hace</th><th>Cuándo</th></tr>
<tr><td><code>restrict</code></td><td>Impide borrar si hay hijos</td><td><b>El default seguro</b></td></tr>
<tr><td><code>cascade</code></td><td>Borra los hijos también</td><td>Solo si el hijo no existe sin el padre</td></tr>
<tr><td><code>set null</code></td><td>Deja el hijo huérfano</td><td>Relaciones opcionales</td></tr>
</table>

<div class="dato"><strong><code>cascade</code> es cómodo y peligroso:</strong> borrar un cliente por error se
lleva sus pedidos, sus facturas y su historial, en silencio y sin vuelta atrás. Conviene usarlo solo donde el
hijo <b>literalmente no tiene sentido</b> sin el padre —los ítems de un pedido— y preferir
<code>restrict</code> con borrado lógico en el resto.</div>

<h4>Borrado lógico: cuándo sí</h4>
<pre><code>-- En vez de DELETE, marcar
alter table clientes add column borrado_en timestamptz;

-- Y que la regla de "activo" viva en un solo lugar
create view clientes_activos as
  select * from clientes where borrado_en is null;</code></pre>

<div class="dato"><strong>El costo del borrado lógico es que <b>cada consulta debe recordar el filtro</b>,</strong>
y la que lo olvida muestra datos borrados sin dar ningún error. La vista o el repositorio resuelven eso — ' +
y en un producto multi-tenant, RLS puede incluir esa condición directamente en la política.</div>

<h4>Índices: los tres que importan</h4>
<pre><code>-- 1 · Toda clave foránea que se use para filtrar
create index on pedidos (cliente_id);

-- 2 · En multi-tenant, tenant_id PRIMERO en el índice compuesto
create index on pedidos (tenant_id, creado_en desc);

-- 3 · Índice parcial cuando filtrás casi siempre por lo mismo
create index on pedidos (tenant_id, creado_en desc) where cancelado_en is null;</code></pre>

<div class="dato"><strong>El orden del índice compuesto es lo que más se equivoca.</strong> Un índice
<code>(creado_en, tenant_id)</code> <b>no sirve</b> para filtrar por tenant y ordenar por fecha: la primera
columna es la que permite acotar. En multi-tenant, <code>tenant_id</code> va siempre primero — y sin eso, ' +
cada consulta recorre los datos de todos los clientes antes de filtrar.</div>

<h4>Tipos: elegir bien la primera vez</h4>
<table>
<tr><th>Para…</th><th>Usá</th><th>No uses</th></tr>
<tr><td>Dinero</td><td><code>int</code> en centavos, o <code>numeric</code></td><td><code>float</code>: errores de redondeo</td></tr>
<tr><td>Identificadores</td><td><code>uuid</code></td><td>Serial expuesto: revela volumen</td></tr>
<tr><td>Fecha con hora</td><td><code>timestamptz</code></td><td><code>timestamp</code> sin zona</td></tr>
<tr><td>Estados</td><td><code>text</code> con <code>check</code></td><td><code>int</code> sin significado</td></tr>
<tr><td>Datos variables</td><td><code>jsonb</code>, con moderación</td><td><code>jsonb</code> para todo</td></tr>
</table>

<div class="dato"><strong><code>timestamp</code> sin zona horaria es el error más caro de esa tabla.</strong>
Guarda un momento sin decir de dónde, así que dos servidores en zonas distintas escriben valores que no se
pueden comparar. Y como todo funciona bien mientras haya un solo servidor en una sola zona, el problema aparece
recién al escalar o al cambiar de región — con datos ya escritos.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    NORMALIZAR — el problema no es el espacio: son las DOS VERDADES</text>

  <rect x="24" y="34" width="304" height="88" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="54" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">✗ el email repetido en cada pedido</text>
  <text x="44" y="74" fill="currentColor" opacity=".68" font-size="9.5" font-family="monospace">pedido 1 → ana@nuevo.com</text>
  <text x="44" y="90" fill="currentColor" opacity=".68" font-size="9.5" font-family="monospace">pedido 2 → ana@viejo.com</text>
  <text x="44" y="110" fill="#f87171" font-size="10" font-weight="700">ninguna consulta es confiable — y no hay error</text>

  <rect x="352" y="34" width="304" height="88" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="54" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">✓ el email en un solo lugar</text>
  <text x="372" y="74" fill="currentColor" opacity=".68" font-size="9.5" font-family="monospace">clientes: c1 → ana@nuevo.com</text>
  <text x="372" y="90" fill="currentColor" opacity=".68" font-size="9.5" font-family="monospace">pedidos: cliente_id = c1</text>
  <text x="372" y="110" fill="#34d399" font-size="10" font-weight="700">tener dos verdades es IMPOSIBLE, no improbable</text>

  <rect x="24" y="132" width="632" height="40" rx="9" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="150" fill="#fbbf24" font-size="11" font-weight="700">Normalizá por defecto. Desnormalizá cuando midas un problema.</text>
  <text x="44" y="166" fill="currentColor" opacity=".75" font-size="10.5">
    Y al desnormalizar, <tspan font-weight="700">escribí cómo se mantiene sincronizado</tspan> — o se desactualiza en semanas y los números dejan de cerrar.</text>

  <line x1="24" y1="192" x2="656" y2="192" stroke="currentColor" opacity=".18"/>

  <text x="24" y="216" fill="#34d399" font-size="12" font-weight="700">
    LAS RESTRICCIONES RESUELVEN LO QUE EL CÓDIGO NO PUEDE</text>

  <rect x="24" y="228" width="304" height="76" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="248" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">validación en el código</text>
  <text x="44" y="268" fill="currentColor" opacity=".7" font-size="9.5">1 · ¿existe ya la cuota de agosto?  → no</text>
  <text x="44" y="282" fill="currentColor" opacity=".7" font-size="9.5">2 · insertar</text>
  <text x="44" y="298" fill="#f87171" font-size="10" font-weight="700">hay una ventana entre 1 y 2 → dos cuotas</text>

  <rect x="352" y="228" width="304" height="76" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.5"/>
  <text x="504" y="248" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">restricción en la base</text>
  <text x="372" y="270" fill="currentColor" opacity=".7" font-size="9.5" font-family="monospace">unique (alumno_id, periodo)</text>
  <text x="372" y="292" fill="#34d399" font-size="10" font-weight="700">una de las dos inserciones FALLA. Sin ventana.</text>

  <rect x="24" y="316" width="200" height="70" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="124" y="336" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">on delete CASCADE</text>
  <text x="124" y="354" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">borrás un cliente por error</text>
  <text x="124" y="372" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">se lleva todo, sin vuelta atrás</text>

  <rect x="240" y="316" width="200" height="70" rx="9" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="340" y="336" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">on delete RESTRICT</text>
  <text x="340" y="354" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">el default seguro</text>
  <text x="340" y="372" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">+ borrado lógico</text>

  <rect x="456" y="316" width="200" height="70" rx="9" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="556" y="336" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">ÍNDICE COMPUESTO</text>
  <text x="556" y="354" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">tenant_id va PRIMERO</text>
  <text x="556" y="372" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">al revés no sirve para filtrar</text>
</svg>`,
        pie: 'Una regla en el código se puede saltear. Una restricción en la base, no.',
      },

      entrevista: [
        { p: '¿Por qué normalizar, si el espacio es barato?',
          r: 'Porque el problema no es el espacio: es que puede haber <b>dos verdades a la vez</b>. Si el email de un cliente quedó actualizado en unos ' +
             'pedidos y no en otros, ninguna consulta es confiable — y <b>no hay error que lo delate</b>. Normalizar hace que esa situación sea ' +
             '<b>imposible</b>, no improbable. Y por eso el default es normalizar y desnormalizar solo cuando se mide un problema concreto, ' +
             'documentando cómo se mantiene sincronizado.' },

        { p: '¿Qué resuelve una restricción de base que el código no puede?',
          r: 'Las <b>condiciones de carrera</b>. Una validación "verificar si existe y después insertar" tiene una ventana entre las dos operaciones: ' +
             'si dos procesos corren a la vez, ambos ven que no existe y ambos insertan. Una restricción <code>unique</code> no tiene esa ventana: ' +
             '<b>una de las dos inserciones falla</b>. Además, una regla en el código se puede saltear desde otra ruta, un script o la consola; ' +
             'la restricción de la base, no.' },

        { p: '¿Cuándo es correcto desnormalizar?',
          r: 'En tres casos concretos. <b>Datos históricos</b>: una factura debe mostrar la razón social al momento de emitirse, así que la copia es el ' +
             'dato correcto, no duplicación. <b>Valores calculados costosos</b> que se consultan todo el tiempo. Y <b>datos de otro contexto</b>, ' +
             'para no consultar en vivo lo que no cambia. En los tres casos hay que <b>escribir cómo se mantiene</b>: una columna calculada sin un ' +
             'mecanismo que la actualice se desactualiza en semanas y los números dejan de cerrar.' },

        { p: '¿Qué error de índices es el más común en multi-tenant?',
          r: 'El <b>orden de las columnas</b> en un índice compuesto. Un índice <code>(creado_en, tenant_id)</code> <b>no sirve</b> para filtrar por ' +
             'tenant y ordenar por fecha, porque la primera columna es la que permite acotar. ' +
             'En multi-tenant, <code>tenant_id</code> va siempre primero — y sin eso, cada consulta recorre los datos de todos los clientes antes de ' +
             'filtrar. Es un error que no se nota con pocos datos y que aparece de golpe cuando el volumen crece.' },
      ],

      practica: `
<h4>Una tabla con las restricciones que hacen falta</h4>
<pre><code>create table pedidos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  cliente_id uuid not null references clientes(id) on delete restrict,

  estado text not null default 'borrador'
    check (estado in ('borrador','confirmado','pagado','cancelado')),

  total_centavos int not null default 0 check (total_centavos &gt;= 0),

  creado_en timestamptz not null default now(),
  confirmado_en timestamptz,
  cancelado_en timestamptz,

  -- coherencia entre estado y marcas de tiempo
  constraint estado_coherente check (
    (estado = 'confirmado' and confirmado_en is not null) or estado &lt;&gt; 'confirmado'
  )
);

create index on pedidos (tenant_id, creado_en desc);
create index on pedidos (tenant_id, estado) where cancelado_en is null;
create index on pedidos (cliente_id);</code></pre>

<div class="aviso"><strong>La restricción <code>estado_coherente</code> es del tipo que menos se usa y más
sirve.</strong> Impide el estado imposible "confirmado sin fecha de confirmación", que suele aparecer por un
script de migración o una actualización parcial — y que después rompe reportes de formas difíciles de rastrear.</div>

<h4>Valor calculado que se mantiene solo</h4>
<pre><code>-- Si el total se consulta mucho, guardarlo… con un disparador que lo mantenga
create or replace function recalcular_total() returns trigger as $$
begin
  update pedidos p
     set total_centavos = coalesce(
           (select sum(cantidad * precio_centavos) from pedido_items where pedido_id = p.id), 0)
   where p.id = coalesce(new.pedido_id, old.pedido_id);
  return null;
end $$ language plpgsql;

create trigger mantener_total
after insert or update or delete on pedido_items
for each row execute function recalcular_total();</code></pre>

<div class="dato"><strong>Un valor desnormalizado sin disparador o sin recálculo programado <b>siempre</b>
termina desactualizado.</strong> Alguien va a insertar un ítem desde un script, desde una migración o desde la
consola, y esa ruta no va a actualizar el total. Si no lo mantiene la base, no lo mantiene nadie.</div>

<h4>Detectar problemas de modelado</h4>
<pre><code>-- Claves foráneas sin índice: causa clásica de lentitud
select c.conrelid::regclass as tabla, a.attname as columna
  from pg_constraint c
  join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any(c.conkey)
 where c.contype = 'f'
   and not exists (
     select 1 from pg_index i
      where i.indrelid = c.conrelid and a.attnum = any(i.indkey));

-- Índices que nunca se usaron: candidatos a borrar
select relname, indexrelname, idx_scan
  from pg_stat_user_indexes where idx_scan = 0 order by relname;</code></pre>

<h4>Checklist de una tabla nueva</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Clave primaria <code>uuid</code></td></tr>
<tr><td>☐</td><td><code>tenant_id</code> si el producto es multi-tenant</td></tr>
<tr><td>☐</td><td><code>not null</code> en todo lo que no sea genuinamente opcional</td></tr>
<tr><td>☐</td><td><code>check</code> en estados y montos</td></tr>
<tr><td>☐</td><td><code>unique</code> donde el negocio lo exige</td></tr>
<tr><td>☐</td><td><code>on delete restrict</code> salvo motivo claro</td></tr>
<tr><td>☐</td><td>Índice en toda clave foránea usada para filtrar</td></tr>
<tr><td>☐</td><td>Índice compuesto con <code>tenant_id</code> primero</td></tr>
<tr><td>☐</td><td><code>timestamptz</code>, nunca <code>timestamp</code></td></tr>
<tr><td>☐</td><td>RLS habilitado, con al menos una política</td></tr>
</table>
`,

      errores: [
        { mito: 'Desnormalizo porque el espacio es barato.',
          realidad: 'El costo no es el espacio: es tener <b>dos verdades a la vez</b> sin ningún error que lo delate. ' +
                    'Desnormalizá cuando midas un problema, y documentá cómo se mantiene sincronizado.' },

        { mito: 'Valido en el código, no hace falta la restricción.',
          realidad: 'La validación "verificar y después insertar" tiene una <b>ventana de carrera</b>: dos procesos simultáneos pasan los dos. ' +
                    'Y el código se saltea desde un script o la consola. La restricción de la base, no.' },

        { mito: 'Uso cascade para no tener que borrar a mano.',
          realidad: 'Borrar un cliente por error <b>se lleva sus pedidos, facturas e historial</b>, en silencio y sin vuelta atrás. ' +
                    '<code>restrict</code> más borrado lógico es el default seguro.' },

        { mito: 'El orden de las columnas del índice no importa.',
          realidad: 'Importa mucho: <code>(creado_en, tenant_id)</code> no sirve para filtrar por tenant. En multi-tenant, <code>tenant_id</code> ' +
                    'va <b>primero</b>. Y no se nota con pocos datos: aparece de golpe cuando el volumen crece.' },
      ],

      glosario: [
        { t: 'Normalizar', d: 'Que cada dato exista en un solo lugar.' },
        { t: 'Desnormalizar', d: 'Duplicar a propósito por rendimiento o por historial.' },
        { t: 'Restricción', d: 'Regla que la base garantiza y el código no puede saltear.' },
        { t: 'on delete restrict', d: 'Impide borrar el padre si tiene hijos. El default seguro.' },
        { t: 'Borrado lógico', d: 'Marcar como borrado en vez de eliminar la fila.' },
        { t: 'Índice compuesto', d: 'Índice sobre varias columnas. El orden determina qué consultas acelera.' },
        { t: 'Índice parcial', d: 'Índice sobre un subconjunto de filas, definido por una condición.' },
        { t: 'timestamptz', d: 'Fecha y hora con zona horaria. Siempre preferible a timestamp.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Transacciones y concurrencia',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> una transacción garantiza que un grupo de
operaciones ocurra <b>completo o nada</b>. Lo que <b>no</b> garantiza por defecto es que dos usuarios
simultáneos no se pisen.</div>

<h4>Lo que sí garantiza</h4>
<pre><code>begin;
  update cuentas set saldo = saldo - 1000 where id = 'a';
  update cuentas set saldo = saldo + 1000 where id = 'b';
commit;
// Si algo falla en el medio, ninguna de las dos ocurre.</code></pre>

<h4>Lo que no</h4>
<p>El caso clásico, y pasa todo el tiempo:</p>
<pre><code>Usuario A                          Usuario B
lee stock = 1                      lee stock = 1
verifica: hay stock ✔              verifica: hay stock ✔
descuenta → stock = 0              descuenta → stock = -1
</code></pre>

<div class="aviso"><strong>Los dos estaban dentro de una transacción y aun así se pisaron.</strong> El
problema es que leyeron el mismo valor antes de que el otro escribiera. Una transacción protege de fallas a
mitad de camino, <b>no de la concurrencia</b> — eso requiere una decisión aparte.</div>

<h4>Las tres formas de resolverlo</h4>

<p><b>1 · Que la base haga la cuenta.</b> La más simple y la que más se olvida:</p>
<pre><code>-- ❌ leer, calcular en la aplicación, escribir
-- ✔ una sola sentencia, atómica
update productos set stock = stock - 1
 where id = $1 and stock &gt;= 1;
-- si afectó 0 filas, no había stock
</code></pre>

<p><b>2 · Bloqueo optimista.</b> Una columna de versión: si cambió, alguien te ganó.</p>

<p><b>3 · Bloqueo pesimista.</b> Reservar la fila para vos mientras trabajás.</p>

<h4>Cuál usar</h4>
<table>
<tr><th>Situación</th><th>Opción</th></tr>
<tr><td>Sumar, restar, cambiar de estado</td><td><b>Que la base haga la cuenta</b></td></tr>
<tr><td>Un formulario que edita un registro</td><td>Bloqueo optimista</td></tr>
<tr><td>Conflictos frecuentes sobre la misma fila</td><td>Bloqueo pesimista</td></tr>
</table>
`,

      tecnico: `
<h4>La operación atómica: la solución que casi siempre alcanza</h4>
<pre><code>-- Descontar stock sin condición de carrera, en una sentencia
update productos
   set stock = stock - $2
 where id = $1 and stock &gt;= $2
returning stock;

-- Si no devuelve filas: no había stock suficiente. Sin ventana, sin bloqueo.</code></pre>

<div class="dato"><strong>La cláusula <code>and stock &gt;= $2</code> es lo que hace segura la
operación.</strong> Sin ella, el <code>update</code> igual es atómico pero puede dejar el stock negativo. ' +
Con ella, la verificación y la escritura ocurren <b>en el mismo instante</b> y no hay ventana entre las dos —
que es exactamente lo que el código de aplicación no puede lograr.</div>

<h4>Bloqueo optimista</h4>
<pre><code>-- Cada actualización incrementa la versión y exige la que leíste
update pedidos
   set estado = $2, version = version + 1
 where id = $1 and version = $3;

-- 0 filas afectadas → alguien lo modificó mientras editabas
-- La aplicación avisa: "Este pedido cambió. Recargá y revisá."</code></pre>

<div class="dato"><strong>Es la opción correcta para formularios</strong> porque no bloquea nada: el usuario
puede tener la pantalla abierta media hora sin retener recursos. El costo es que <b>puede perder el trabajo</b>
si otro lo editó — por eso el mensaje importa: no alcanza con "error de concurrencia", hay que decir qué
cambió.</div>

<h4>Bloqueo pesimista</h4>
<pre><code>begin;
  select * from productos where id = $1 for update;   -- ← reserva la fila
  -- nadie más puede modificarla hasta el commit
  update productos set stock = stock - 1 where id = $1;
commit;</code></pre>

<p>Variantes:</p>
<ul>
<li><code>for update</code> — espera si otro la tiene.</li>
<li><code>for update nowait</code> — falla inmediatamente si está tomada.</li>
<li><code>for update skip locked</code> — <b>la salta</b>. Es la base de toda cola en SQL.</li>
</ul>

<div class="dato"><strong><code>skip locked</code> es lo que permite tener varios trabajadores tomando de la
misma tabla sin pisarse:</strong> cada uno toma las filas que nadie tiene reservadas. Sin él, todos los
trabajadores esperan en la misma fila y el paralelismo desaparece.</div>

<h4>Niveles de aislamiento</h4>
<table>
<tr><th>Nivel</th><th>Qué evita</th><th>Costo</th></tr>
<tr><td><b>Read committed</b></td><td>Leer datos sin confirmar</td><td>Ninguno. <b>El default</b></td></tr>
<tr><td><b>Repeatable read</b></td><td>Que un dato cambie dentro de la transacción</td><td>Puede fallar y hay que reintentar</td></tr>
<tr><td><b>Serializable</b></td><td>Todas las anomalías</td><td>Más fallas por conflicto</td></tr>
</table>

<div class="dato"><strong>Subir el nivel de aislamiento no elimina el problema: lo convierte en un error que
tenés que manejar.</strong> Con <code>serializable</code>, Postgres aborta una de las transacciones en
conflicto — así que tu código <b>debe reintentar</b>. Si no lo hace, cambiaste una condición de carrera
silenciosa por un error visible al usuario, que a veces es peor.</div>

<h4>El interbloqueo</h4>
<pre><code>Transacción A: bloquea fila 1 → intenta la 2
Transacción B: bloquea fila 2 → intenta la 1
→ ambas esperan para siempre. Postgres mata una.</code></pre>
<p>La prevención es simple y efectiva: <b>tomar los bloqueos siempre en el mismo orden</b>. Si todas las
transacciones ordenan por identificador antes de bloquear, el interbloqueo es imposible.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="#f87171" font-size="12" font-weight="700">
    LOS DOS ESTABAN EN UNA TRANSACCIÓN Y AUN ASÍ SE PISARON</text>

  <rect x="24" y="34" width="304" height="100" rx="10" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="176" y="54" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">Usuario A</text>
  <text x="44" y="74" fill="currentColor" opacity=".7" font-size="9.5">lee stock = 1</text>
  <text x="44" y="92" fill="currentColor" opacity=".7" font-size="9.5">verifica: hay stock ✔</text>
  <text x="44" y="112" fill="#34d399" font-size="10" font-weight="700">descuenta → stock = 0</text>

  <rect x="352" y="34" width="304" height="100" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="504" y="54" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">Usuario B</text>
  <text x="372" y="74" fill="currentColor" opacity=".7" font-size="9.5">lee stock = 1   ← el mismo valor</text>
  <text x="372" y="92" fill="currentColor" opacity=".7" font-size="9.5">verifica: hay stock ✔</text>
  <text x="372" y="112" fill="#f87171" font-size="10" font-weight="700">descuenta → stock = -1</text>

  <rect x="24" y="144" width="632" height="34" rx="8" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="165" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">
    Una transacción protege de fallas a mitad de camino, NO de la concurrencia. Eso requiere una decisión aparte.</text>

  <text x="24" y="202" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS TRES SOLUCIONES</text>

  <rect x="24" y="214" width="200" height="94" rx="10" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.8"/>
  <text x="124" y="234" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">1 · QUE LA BASE CUENTE</text>
  <text x="40" y="254" fill="currentColor" opacity=".7" font-size="8.5" font-family="monospace">update … set stock = stock-1</text>
  <text x="40" y="268" fill="currentColor" opacity=".7" font-size="8.5" font-family="monospace">where id=$1 and stock &gt;= 1</text>
  <text x="124" y="288" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">verificar y escribir</text>
  <text x="124" y="301" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">en el MISMO instante</text>

  <rect x="240" y="214" width="200" height="94" rx="10" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="340" y="234" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">2 · OPTIMISTA</text>
  <text x="256" y="254" fill="currentColor" opacity=".7" font-size="8.5" font-family="monospace">where id=$1 and version=$3</text>
  <text x="340" y="274" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">0 filas → alguien te ganó</text>
  <text x="340" y="292" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-weight="700">para formularios: no bloquea</text>
  <text x="340" y="304" text-anchor="middle" fill="currentColor" opacity=".55" font-size="8.5">el usuario puede perder el trabajo</text>

  <rect x="456" y="214" width="200" height="94" rx="10" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="556" y="234" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">3 · PESIMISTA</text>
  <text x="472" y="254" fill="currentColor" opacity=".7" font-size="8.5" font-family="monospace">select … for update</text>
  <text x="556" y="274" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">reserva la fila</text>
  <text x="556" y="292" text-anchor="middle" fill="#7c5cff" font-size="9.5" font-weight="700">skip locked = base de</text>
  <text x="556" y="304" text-anchor="middle" fill="#7c5cff" font-size="9.5" font-weight="700">toda cola en SQL</text>

  <rect x="24" y="320" width="304" height="66" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="340" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">SUBIR EL AISLAMIENTO NO ES GRATIS</text>
  <text x="44" y="360" fill="currentColor" opacity=".7" font-size="10">Con serializable, Postgres aborta una de las dos.</text>
  <text x="44" y="378" fill="#f87171" font-size="10" font-weight="700">Tu código DEBE reintentar, o el error lo ve el usuario.</text>

  <rect x="352" y="320" width="304" height="66" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="340" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">EVITAR INTERBLOQUEOS</text>
  <text x="372" y="360" fill="currentColor" opacity=".7" font-size="10">A bloquea 1→2 · B bloquea 2→1 → esperan para siempre</text>
  <text x="372" y="378" fill="#34d399" font-size="10" font-weight="700">Tomá los bloqueos SIEMPRE en el mismo orden.</text>
</svg>`,
        pie: 'Si podés expresarlo como una sola sentencia, la base resuelve la concurrencia sin bloqueos.',
      },

      entrevista: [
        { p: '¿Una transacción protege de que dos usuarios se pisen?',
          r: 'No. Una transacción garantiza <b>todo o nada</b> ante una falla a mitad de camino, pero no impide que dos usuarios lean el mismo valor ' +
             'antes de que el otro escriba. El caso clásico: los dos leen stock 1, los dos verifican que hay, los dos descuentan, y queda en -1 — ' +
             'con las dos operaciones dentro de transacciones. <b>La concurrencia requiere una decisión aparte.</b>' },

        { p: '¿Cuál es la forma más simple de resolver una condición de carrera?',
          r: '<b>Que la base haga la cuenta</b>, en una sola sentencia: <code>update productos set stock = stock - 1 where id = $1 and stock &gt;= 1</code>. ' +
             'La condición en el <code>where</code> hace que la verificación y la escritura ocurran <b>en el mismo instante</b>, sin ventana — ' +
             'que es exactamente lo que el código de aplicación no puede lograr. Si afectó cero filas, no había stock. ' +
             'Es más simple y más rápido que cualquier bloqueo, y se olvida con frecuencia.' },

        { p: '¿Cuándo usarías bloqueo optimista y cuándo pesimista?',
          r: '<b>Optimista</b> para formularios: una columna de versión, y si al guardar cambió, alguien te ganó. No bloquea nada, así que el usuario ' +
             'puede tener la pantalla abierta media hora sin retener recursos; el costo es que <b>puede perder el trabajo</b>, y por eso el mensaje ' +
             'debe decir qué cambió, no solo "error de concurrencia". <b>Pesimista</b> cuando los conflictos sobre la misma fila son frecuentes ' +
             'y rehacer el trabajo sería caro: se reserva la fila con <code>for update</code>.' },

        { p: '¿Qué aporta "skip locked"?',
          r: 'Permite que <b>varios trabajadores tomen de la misma tabla sin pisarse</b>: cada uno se lleva las filas que nadie tiene reservadas, en vez ' +
             'de esperar. Es la base de toda implementación de cola en SQL. Sin él, todos los trabajadores esperan en la misma fila y el paralelismo ' +
             'desaparece por completo — tenés cinco procesos haciendo el trabajo de uno.' },
      ],

      practica: `
<h4>Operación atómica: primera opción siempre</h4>
<pre><code>-- Descontar stock
update productos set stock = stock - $2
 where id = $1 and stock &gt;= $2
returning stock;

-- Transición de estado idempotente y segura
update pedidos set estado = 'pagado', pago_id = $2, pagado_en = now()
 where id = $1 and estado = 'pendiente'
returning id;

-- Reservar un cupo
update eventos set cupos_tomados = cupos_tomados + 1
 where id = $1 and cupos_tomados &lt; cupo_total
returning cupos_tomados;</code></pre>

<div class="aviso"><strong>En los tres casos, si no devuelve filas es porque la condición no se cumplía</strong>
—no había stock, el estado no era el esperado, no quedaban cupos—. Esa señal es más confiable que cualquier
verificación previa, porque ocurre en el mismo instante que la escritura.</div>

<h4>Bloqueo optimista de punta a punta</h4>
<pre><code>alter table pedidos add column version int not null default 1;</code></pre>

<pre><code>export async function actualizarPedido(id: string, cambios: Cambios, version: number) {
  const { rowCount } = await db.query(
    \`update pedidos set estado = $2, notas = $3, version = version + 1
      where id = $1 and version = $4\`,
    [id, cambios.estado, cambios.notas, version],
  );

  if (rowCount === 0) {
    const actual = await pedidos.porId(id);
    throw new ConflictoDeEdicion({
      mensaje: 'Otra persona modificó este pedido mientras lo editabas.',
      estadoActual: actual.estado,       // ← decile QUÉ cambió
      modificadoPor: actual.modificadoPor,
    });
  }
}</code></pre>

<h4>Cola con skip locked</h4>
<pre><code>-- Varios trabajadores, sin pisarse ni esperar
with tomado as (
  select id from trabajos
   where estado = 'pendiente' and ejecutar_en &lt;= now()
   order by prioridad desc, creado_en
   for update skip locked
   limit 10
)
update trabajos t set estado = 'en_curso', tomado_en = now()
  from tomado where t.id = tomado.id
returning t.*;</code></pre>

<h4>Reintentar ante conflicto de serialización</h4>
<pre><code>export async function conReintentoDeSerializacion&lt;T&gt;(fn: () =&gt; Promise&lt;T&gt;, max = 3): Promise&lt;T&gt; {
  for (let i = 0; i &lt;= max; i++) {
    try {
      return await fn();
    } catch (e: any) {
      // 40001 = serialization_failure · 40P01 = deadlock_detected
      if ((e.code === '40001' || e.code === '40P01') &amp;&amp; i &lt; max) {
        await dormir(50 * 2 ** i * Math.random());
        continue;
      }
      throw e;
    }
  }
  throw new Error('inalcanzable');
}</code></pre>

<div class="dato"><strong>Sin esta envoltura, subir el nivel de aislamiento es contraproducente:</strong>
cambiás una condición de carrera silenciosa por un error visible al usuario. El nivel alto de aislamiento
<b>asume</b> que la aplicación reintenta.</div>
`,

      errores: [
        { mito: 'Con una transacción no hay condiciones de carrera.',
          realidad: 'La transacción protege de fallas a mitad de camino, <b>no de la concurrencia</b>. Dos usuarios pueden leer el mismo valor antes ' +
                    'de que el otro escriba, cada uno dentro de su transacción.' },

        { mito: 'Leo, verifico en la aplicación y escribo.',
          realidad: 'Hay una <b>ventana</b> entre leer y escribir. Poné la condición en el <code>where</code> del <code>update</code>: ' +
                    'ahí verificación y escritura ocurren en el mismo instante.' },

        { mito: 'Subo a serializable y me olvido del problema.',
          realidad: 'Postgres <b>aborta</b> una de las transacciones en conflicto: tu código debe reintentar. Sin eso, cambiaste una condición de ' +
                    'carrera silenciosa por un error visible al usuario, que a veces es peor.' },

        { mito: 'Uso for update para que varios trabajadores tomen de una cola.',
          realidad: 'Sin <code>skip locked</code>, todos esperan en la misma fila y el paralelismo desaparece: cinco procesos haciendo el trabajo ' +
                    'de uno.' },
      ],

      glosario: [
        { t: 'Transacción', d: 'Grupo de operaciones que ocurren completas o no ocurren.' },
        { t: 'Condición de carrera', d: 'Dos procesos que leen el mismo valor y se pisan al escribir.' },
        { t: 'Operación atómica', d: 'Una sentencia que verifica y escribe en el mismo instante.' },
        { t: 'Bloqueo optimista', d: 'Columna de versión: si cambió, se rechaza la escritura.' },
        { t: 'Bloqueo pesimista', d: 'Reservar la fila con for update mientras se trabaja.' },
        { t: 'skip locked', d: 'Saltear filas reservadas por otro. Base de las colas en SQL.' },
        { t: 'Nivel de aislamiento', d: 'Cuántas anomalías de concurrencia evita la base.' },
        { t: 'Interbloqueo', d: 'Dos transacciones esperándose. Se evita tomando bloqueos en el mismo orden.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Multi-tenant y aislamiento',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> multi-tenant es que <b>varios clientes compartan
la misma aplicación sin verse entre sí</b>. Es la decisión más cara de revertir de todo el sistema.</div>

<h4>Las tres formas</h4>
<table>
<tr><th>Modelo</th><th>Aislamiento</th><th>Costo</th><th>Migraciones</th></tr>
<tr><td><b>Base por cliente</b></td><td>Total</td><td>Alto y fijo</td><td>N migraciones</td></tr>
<tr><td><b>Esquema por cliente</b></td><td>Bueno</td><td>Medio</td><td>N migraciones</td></tr>
<tr><td><b>Tabla compartida + RLS</b></td><td>Depende de las políticas</td><td>Bajo</td><td><b>Una</b></td></tr>
</table>

<div class="aviso"><strong>La columna de migraciones es la que decide en la práctica.</strong> Con base o
esquema por cliente, cada cambio de esquema es una migración por cliente: con cincuenta clientes, cada cambio
es una operación con cincuenta puntos de falla. Por eso el patrón canónico para un SaaS que va a crecer es
<b>tabla compartida con RLS</b>.</div>

<h4>Cómo funciona RLS</h4>
<p>La base filtra <b>automáticamente</b> según quién consulta:</p>
<pre><code>-- Sin RLS: el filtro depende de que el código lo escriba
select * from pedidos where tenant_id = '…';   ← si lo olvidás, ves todo

-- Con RLS: la base agrega el filtro sola
select * from pedidos;                          ← solo ves lo tuyo</code></pre>

<p>La diferencia práctica es enorme: <b>olvidarse el filtro deja de ser posible</b>. Y eso importa porque
olvidarlo no produce ningún error, solo datos de más.</p>

<h4>De dónde sale el tenant</h4>
<p>Este es el punto crítico de todo el diseño: el identificador del tenant tiene que venir de un lugar que
<b>el usuario no pueda manipular</b>.</p>
<pre><code>❌ De un parámetro de la petición       ← el usuario lo cambia
❌ De un encabezado                     ← el usuario lo cambia
❌ De una consulta a otra tabla         ← lento y saltea el punto
✔ De un claim del token de sesión       ← firmado por el servidor</code></pre>
`,

      tecnico: `
<h4>El patrón canónico</h4>
<pre><code>-- 1 · Una función que lee el tenant del token, en un esquema privado
create schema if not exists private;

create or replace function private.current_tenant_id()
returns uuid language sql stable as $$
  select nullif(
    current_setting('request.jwt.claims', true)::json -&gt;&gt; 'tenant_id', ''
  )::uuid;
$$;

-- 2 · RLS en la tabla
alter table pedidos enable row level security;

create policy tenant_aislamiento on pedidos
  for all
  using      (tenant_id = private.current_tenant_id())
  with check (tenant_id = private.current_tenant_id());</code></pre>

<div class="dato"><strong>El <code>with check</code> es tan importante como el <code>using</code> y se olvida
con frecuencia.</strong> <code>using</code> filtra lo que <b>se lee</b>; <code>with check</code> valida lo que
<b>se escribe</b>. Sin él, un usuario puede <b>insertar</b> filas con el <code>tenant_id</code> de otro cliente
—no las vería después, pero las escribió—, y eso es corrupción de datos ajenos.</div>

<h4>Rendimiento: los dos detalles que importan</h4>
<pre><code>-- ❌ La función se evalúa por CADA fila
using (tenant_id = private.current_tenant_id())

-- ✔ Con select, se evalúa UNA vez y el plan la trata como constante
using (tenant_id = (select private.current_tenant_id()))

-- Y el índice, con tenant_id primero
create index on pedidos (tenant_id, creado_en desc);</code></pre>

<div class="dato"><strong>Envolver la función en <code>select</code> puede cambiar el tiempo de una consulta en
un orden de magnitud sobre tablas grandes.</strong> Es una optimización de siete caracteres que la mayoría
descubre cuando la aplicación ya está lenta — y que conviene aplicar desde la primera política.</div>

<h4>La clave que rompe todo</h4>
<p><code>service_role</code> <b>saltea RLS por completo</b>. Con esa clave, todas las políticas dejan de
existir. Por eso:</p>
<ul>
<li>Nunca en el cliente ni en middleware.</li>
<li>Solo en acciones de servidor que genuinamente necesiten cruzar tenants.</li>
<li>Cada uso, con un comentario explicando por qué no alcanza con la sesión del usuario.</li>
<li>Y una auditoría periódica de dónde se usa.</li>
</ul>

<div class="dato"><strong>Un solo uso descuidado de <code>service_role</code> anula toda la arquitectura de
aislamiento.</strong> Una acción que la usa "porque era más fácil" y que recibe un identificador del cliente
sin verificarlo es un agujero que permite leer datos de cualquier tenant — y no aparece en ninguna prueba
funcional, porque el flujo normal funciona bien.</div>

<h4>El test que hay que tener</h4>
<pre><code>test('un tenant no puede leer datos de otro', async () =&gt; {
  const clienteA = crearClienteConSesion(tenantA);
  const { data } = await clienteA.from('pedidos').select('*').eq('id', pedidoDeTenantB);
  expect(data).toEqual([]);            // ← RLS lo filtró
});

test('un tenant no puede INSERTAR con el id de otro', async () =&gt; {
  const clienteA = crearClienteConSesion(tenantA);
  const { error } = await clienteA.from('pedidos').insert({ tenant_id: tenantB, … });
  expect(error).toBeTruthy();          // ← with check lo rechazó
});</code></pre>

<div class="dato"><strong>El segundo test es el que casi nadie escribe</strong> y el que detecta la política
sin <code>with check</code>. Conviene que sea parte del checklist de toda tabla nueva: sin él, la falla se
descubre cuando un cliente ve datos que no le corresponden.</div>

<h4>Storage: la misma regla</h4>
<pre><code>-- El path canónico es &lt;tenant_id&gt;/&lt;resto&gt;, y lo arma el SERVIDOR
create policy tenant_archivos on storage.objects
  for all
  using (bucket_id = 'adjuntos'
     and private.storage_path_tenant_id(name) = (select private.current_tenant_id()));</code></pre>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS TRES FORMAS — y la columna que decide en la práctica</text>

  <rect x="24" y="34" width="200" height="82" rx="10" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="124" y="54" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">base por cliente</text>
  <text x="124" y="74" text-anchor="middle" fill="#34d399" font-size="9.5">aislamiento total</text>
  <text x="124" y="90" text-anchor="middle" fill="#f87171" font-size="9.5">costo alto y fijo</text>
  <text x="124" y="108" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">N migraciones</text>

  <rect x="240" y="34" width="200" height="82" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="340" y="54" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">esquema por cliente</text>
  <text x="340" y="74" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">aislamiento bueno</text>
  <text x="340" y="90" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">costo medio</text>
  <text x="340" y="108" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">N migraciones</text>

  <rect x="456" y="34" width="200" height="82" rx="10" fill="#34d399" fill-opacity=".18" stroke="#34d399" stroke-width="1.8"/>
  <text x="556" y="54" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">tabla compartida + RLS</text>
  <text x="556" y="74" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">depende de las políticas</text>
  <text x="556" y="90" text-anchor="middle" fill="#34d399" font-size="9.5">costo bajo</text>
  <text x="556" y="108" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">UNA migración</text>

  <rect x="24" y="126" width="632" height="30" rx="8" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="340" y="146" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">
    Con 50 clientes, cada cambio de esquema es una operación con 50 puntos de falla.</text>

  <text x="24" y="182" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    DE DÓNDE SALE EL TENANT — el punto crítico de todo el diseño</text>

  <rect x="24" y="194" width="304" height="76" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="214" fill="#f87171" font-size="10" font-weight="700">✗ de un parámetro de la petición</text>
  <text x="44" y="232" fill="#f87171" font-size="10" font-weight="700">✗ de un encabezado</text>
  <text x="44" y="250" fill="#f87171" font-size="10" font-weight="700">✗ del cuerpo del formulario</text>
  <text x="44" y="264" fill="currentColor" opacity=".62" font-size="9.5">el usuario los cambia con una herramienta</text>

  <rect x="352" y="194" width="304" height="76" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.6"/>
  <text x="372" y="214" fill="#34d399" font-size="10.5" font-weight="700">✓ de un claim del token de sesión</text>
  <text x="372" y="234" fill="currentColor" opacity=".7" font-size="10">firmado por el servidor</text>
  <text x="372" y="252" fill="currentColor" opacity=".7" font-size="10">el usuario no lo puede alterar</text>
  <text x="372" y="266" fill="#34d399" font-size="9.5" font-weight="700">private.current_tenant_id()</text>

  <text x="24" y="298" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    USING vs WITH CHECK — y el que se olvida</text>

  <rect x="24" y="310" width="304" height="76" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="176" y="330" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">using</text>
  <text x="176" y="350" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">filtra lo que SE LEE</text>
  <text x="176" y="372" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">el que todos ponen</text>

  <rect x="352" y="310" width="304" height="76" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="504" y="330" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">with check</text>
  <text x="504" y="350" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">valida lo que SE ESCRIBE</text>
  <text x="504" y="370" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">sin él, se pueden INSERTAR filas</text>
  <text x="504" y="382" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">con el tenant de otro cliente</text>
</svg>`,
        pie: 'Con RLS, olvidarse el filtro deja de ser posible. Y olvidarlo no da error: da datos de más.',
      },

      entrevista: [
        { p: '¿Por qué tabla compartida con RLS y no base por cliente?',
          r: 'Por las <b>migraciones</b>. Con base o esquema por cliente, cada cambio de esquema es una migración por cliente: con cincuenta clientes, ' +
             'cada cambio es una operación con cincuenta puntos de falla. Con tabla compartida es <b>una sola</b>. ' +
             'El costo fijo también es mucho menor. La contrapartida es que el aislamiento depende de las políticas, y por eso hay que verificarlas ' +
             'con tests de aislamiento en cada tabla nueva.' },

        { p: '¿De dónde debe salir el identificador del tenant?',
          r: 'De un <b>claim del token de sesión</b>, firmado por el servidor. Nunca de un parámetro, un encabezado o el cuerpo del formulario: ' +
             'el usuario puede cambiar cualquiera de esos con una herramienta básica. Tampoco de una consulta a otra tabla en cada petición, ' +
             'porque es lento y no aporta seguridad extra. La función que lo lee vive en un esquema privado y las políticas la usan.' },

        { p: '¿Cuál es la diferencia entre using y with check?',
          r: '<code>using</code> filtra lo que <b>se lee</b>; <code>with check</code> valida lo que <b>se escribe</b>. ' +
             'El segundo se olvida con frecuencia y es igual de importante: sin él, un usuario puede <b>insertar</b> filas con el ' +
             '<code>tenant_id</code> de otro cliente. No las vería después, pero las escribió — y eso es corrupción de datos ajenos. ' +
             'Por eso el test de "no puedo insertar con el id de otro" debería estar en el checklist de toda tabla.' },

        { p: '¿Qué detalle de rendimiento tiene RLS?',
          r: 'Que la función del tenant se evalúa <b>por cada fila</b> si se escribe directamente en la política. Envolverla en un ' +
             '<code>select</code> —<code>(select private.current_tenant_id())</code>— hace que se evalúe una sola vez y que el planificador la trate ' +
             'como constante. <b>Puede cambiar el tiempo de una consulta en un orden de magnitud</b> sobre tablas grandes. ' +
             'Y lo otro es el índice: <code>tenant_id</code> tiene que ir primero en el índice compuesto.' },
      ],

      practica: `
<h4>Patrón completo para una tabla nueva</h4>
<pre><code>-- 1 · La tabla, con tenant_id
create table documentos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  titulo text not null,
  creado_en timestamptz not null default now()
);

-- 2 · Índice con tenant_id PRIMERO
create index on documentos (tenant_id, creado_en desc);

-- 3 · RLS habilitado
alter table documentos enable row level security;

-- 4 · Política idempotente, con using Y with check
drop policy if exists tenant_aislamiento on documentos;
create policy tenant_aislamiento on documentos
  for all
  using      (tenant_id = (select private.current_tenant_id()))
  with check (tenant_id = (select private.current_tenant_id()));</code></pre>

<div class="aviso"><strong>El <code>drop policy if exists</code> antes de crear hace la migración
idempotente</strong> — se puede volver a correr sin error, que es lo que salva cuando una migración falla a
mitad de camino y hay que reintentarla.</div>

<h4>El test de aislamiento, en las dos direcciones</h4>
<pre><code>describe('aislamiento de documentos', () =&gt; {
  it('no lee documentos de otro tenant', async () =&gt; {
    const { data } = await comoTenant(A).from('documentos').select('*');
    expect(data.every((d) =&gt; d.tenant_id === A)).toBe(true);
  });

  it('no lee un documento ajeno ni por id directo', async () =&gt; {
    const { data } = await comoTenant(A).from('documentos').select('*').eq('id', docDeB);
    expect(data).toEqual([]);
  });

  it('NO PUEDE INSERTAR con el tenant de otro', async () =&gt; {
    const { error } = await comoTenant(A).from('documentos')
      .insert({ tenant_id: B, titulo: 'intruso' });
    expect(error).toBeTruthy();
  });

  it('no puede actualizar un documento ajeno', async () =&gt; {
    const { error, data } = await comoTenant(A).from('documentos')
      .update({ titulo: 'x' }).eq('id', docDeB).select();
    expect(data).toEqual([]);
  });
});</code></pre>

<h4>Auditar los usos de service_role</h4>
<pre><code># Cada resultado debería tener un comentario que lo justifique
grep -rn "SERVICE_ROLE_KEY\\|clienteAdmin()" src/ --include="*.ts"

# Y verificar que ninguno esté en middleware o en componentes cliente
grep -rn "SERVICE_ROLE" src/middleware.ts src/**/*.tsx</code></pre>

<div class="dato"><strong>Un solo uso descuidado anula toda la arquitectura de aislamiento.</strong> Una acción
que usa esa clave "porque era más fácil" y recibe un identificador del cliente sin verificarlo permite leer
datos de cualquier tenant — y <b>no aparece en ninguna prueba funcional</b>, porque el flujo normal funciona
bien.</div>

<h4>Checklist multi-tenant</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>El tenant sale de un claim del token, nunca del cliente</td></tr>
<tr><td>☐</td><td>RLS habilitado en <b>todas</b> las tablas</td></tr>
<tr><td>☐</td><td>Toda política tiene <code>using</code> <b>y</b> <code>with check</code></td></tr>
<tr><td>☐</td><td>La función del tenant va envuelta en <code>select</code></td></tr>
<tr><td>☐</td><td><code>tenant_id</code> primero en los índices compuestos</td></tr>
<tr><td>☐</td><td>Test de aislamiento en las dos direcciones por tabla</td></tr>
<tr><td>☐</td><td>Usos de <code>service_role</code> auditados y justificados</td></tr>
<tr><td>☐</td><td>Paths de storage <code>&lt;tenant_id&gt;/…</code> armados por el servidor</td></tr>
</table>
`,

      errores: [
        { mito: 'Con el filtro por tenant_id en el código alcanza.',
          realidad: 'Olvidarlo <b>no produce ningún error</b>: solo devuelve datos de más. Con RLS, olvidarlo deja de ser posible — ' +
                    'la base agrega el filtro sola.' },

        { mito: 'Con "using" en la política ya está protegido.',
          realidad: 'Falta <code>with check</code>: sin él, un usuario puede <b>insertar</b> filas con el <code>tenant_id</code> de otro cliente. ' +
                    'No las vería, pero las escribió — y eso es corrupción de datos ajenos.' },

        { mito: 'RLS no afecta el rendimiento.',
          realidad: 'Afecta bastante si la función del tenant se evalúa <b>por fila</b>. Envolverla en <code>select</code> puede mejorar una consulta ' +
                    'en un orden de magnitud sobre tablas grandes.' },

        { mito: 'Uso service_role en esa acción porque es más simple.',
          realidad: 'Esa clave <b>saltea RLS por completo</b>. Un solo uso descuidado anula toda la arquitectura de aislamiento, ' +
                    'y no aparece en ninguna prueba funcional porque el flujo normal funciona bien.' },
      ],

      glosario: [
        { t: 'Multi-tenant', d: 'Varios clientes sobre la misma aplicación, sin verse entre sí.' },
        { t: 'RLS', d: 'Row Level Security: la base filtra las filas según quién consulta.' },
        { t: 'Política', d: 'Regla de RLS. using filtra lecturas, with check valida escrituras.' },
        { t: 'Claim', d: 'Dato dentro del token firmado. De ahí sale el tenant.' },
        { t: 'service_role', d: 'Clave que saltea RLS por completo. Equivale a administrador.' },
        { t: 'Test de aislamiento', d: 'Prueba de que un tenant no puede leer ni escribir lo de otro.' },
        { t: 'Migración idempotente', d: 'La que se puede volver a correr sin error.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Migraciones: evolucionar sin cortar',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> durante un despliegue conviven <b>dos versiones
del código contra el mismo esquema</b>. Toda migración tiene que funcionar con las dos.</div>

<h4>Por qué es un problema</h4>
<pre><code>12:00  código v1 corriendo, esquema v1
12:05  se aplica la migración: se borra la columna 'email'
12:06  código v1 SIGUE corriendo y consulta 'email' → error
12:08  termina el despliegue de v2
</code></pre>
<p>Esos tres minutos son un incidente. Y si hay que volver atrás, el código v1 no puede funcionar con el
esquema nuevo: <b>estás atrapado</b>.</p>

<div class="aviso"><strong>El código se revierte en segundos; los datos no.</strong> Por eso la regla no es
"desplegar rápido" sino <b>hacer migraciones que funcionen con la versión anterior</b>. Es la diferencia entre
poder revertir y no poder.</div>

<h4>Expandir y contraer: tres despliegues</h4>
<pre><code>Despliegue A — EXPANDIR
  · agregar la columna nueva (nullable)
  · llenar los datos existentes
  · el código viejo sigue funcionando: no se le quitó nada

Despliegue B — MIGRAR EL CÓDIGO
  · el código nuevo lee de la nueva y escribe en AMBAS
  · reversible: se puede volver a A

Despliegue C — CONTRAER
  · ya nadie usa la vieja
  · recién ahora se elimina</code></pre>

<p>Son tres despliegues en vez de uno, y a cambio se puede revertir en cualquier punto sin perder datos.</p>

<h4>Las operaciones peligrosas</h4>
<table>
<tr><th>Operación</th><th>Riesgo</th></tr>
<tr><td>Borrar una columna</td><td>El código viejo la usa</td></tr>
<tr><td>Renombrar</td><td>Es borrar y crear a la vez</td></tr>
<tr><td>Cambiar el tipo</td><td>Puede reescribir toda la tabla</td></tr>
<tr><td>Agregar <code>not null</code> sin valor por defecto</td><td>Falla si hay filas</td></tr>
<tr><td>Crear un índice sin <code>concurrently</code></td><td><b>Bloquea escrituras</b></td></tr>
</table>
`,

      tecnico: `
<h4>Bloqueos: lo que hay que saber antes de aplicar</h4>
<pre><code>-- ❌ Bloquea TODA escritura mientras dura. En una tabla grande, minutos.
create index idx_pedidos_cliente on pedidos (cliente_id);

-- ✔ No bloquea. Tarda más y puede fallar, pero es aplicable en producción.
create index concurrently idx_pedidos_cliente on pedidos (cliente_id);</code></pre>

<div class="dato"><strong>Un <code>create index concurrently</code> que falla deja el índice en estado
inválido</strong> —visible en <code>pg_indexes</code>— y hay que borrarlo y reintentar. No es grave, pero
sorprende: la migración "falló" y sin embargo hay un índice ahí. Verificar <code>indisvalid</code> después de
crear evita la confusión.</div>

<h4>Agregar una columna obligatoria, sin bloquear</h4>
<pre><code>-- ❌ En versiones viejas de Postgres, reescribe toda la tabla
alter table pedidos add column canal text not null default 'web';

-- ✔ Seguro en cualquier versión: tres pasos
-- 1
alter table pedidos add column canal text;
-- 2 (por lotes, para no bloquear)
update pedidos set canal = 'web' where canal is null and id in (
  select id from pedidos where canal is null limit 10000
);
-- 3, cuando ya no hay nulos
alter table pedidos alter column canal set not null;</code></pre>

<div class="dato"><strong>La actualización por lotes es lo que evita el incidente.</strong> Un
<code>update</code> sobre un millón de filas toma un bloqueo largo y hace crecer los registros de transacción;
en lotes de diez mil, cada uno termina rápido y las escrituras normales pueden intercalarse.</div>

<h4>Renombrar sin romper</h4>
<pre><code>-- Renombrar = borrar + crear. Nunca directo.
-- A: agregar la nueva y sincronizar con un disparador
alter table clientes add column razon_social text;
update clientes set razon_social = nombre;

create trigger sincronizar
before insert or update on clientes
for each row execute function copiar_nombre_a_razon_social();

-- B: el código nuevo usa razon_social
-- C: quitar el disparador y la columna vieja</code></pre>

<h4>Migraciones que no se pueden revertir</h4>
<p>Un <code>DROP COLUMN</code> con datos <b>no se deshace</b>: la migración inversa recrea la columna vacía.
Por eso:</p>
<ul>
<li>Respaldo verificado <b>antes</b> de cualquier operación destructiva.</li>
<li>Preferir renombrar a <code>_borrado_YYYYMMDD</code> y eliminar semanas después.</li>
<li>Nunca combinar una destructiva con otros cambios en la misma migración.</li>
</ul>

<div class="dato"><strong>El truco de renombrar en vez de borrar cuesta casi nada y salva
incidentes.</strong> La columna deja de usarse, el código nuevo ya no la ve, y si en dos días aparece que algo
la necesitaba, los datos siguen ahí. Eliminarla de verdad puede esperar un mes.</div>

<h4>El proceso de una migración</h4>
<pre><code>1 · Escribirla, y escribir cómo se revierte
2 · Probarla en una copia de datos reales
3 · Medir cuánto tarda con el volumen de producción
4 · Verificar que el código ACTUAL funciona con el esquema nuevo
5 · Respaldo verificado
6 · Aplicar como paso propio del pipeline, con bloqueo
7 · Verificar después: conteos, integridad, consultas clave</code></pre>

<div class="dato"><strong>Los pasos 3 y 4 son los que más incidentes evitan.</strong> Una migración que tarda
dos segundos con mil filas puede tardar veinte minutos con diez millones — y en ese tiempo la tabla puede estar
bloqueada. Y el paso 4 es lo que garantiza que se pueda revertir el código sin quedar atrapado.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="mg1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <rect x="24" y="28" width="632" height="46" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="340" y="50" text-anchor="middle" fill="#f87171" font-size="13" font-weight="700">
    Durante un despliegue conviven DOS versiones del código contra el MISMO esquema.</text>
  <text x="340" y="67" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">
    El código se revierte en segundos; los datos no. Si la migración rompe la versión anterior, quedás atrapado.</text>

  <text x="24" y="102" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EXPANDIR Y CONTRAER — tres despliegues, reversible en cualquier punto</text>

  <rect x="24" y="114" width="196" height="86" rx="10" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.5"/>
  <text x="122" y="134" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">A · EXPANDIR</text>
  <text x="40" y="154" fill="currentColor" opacity=".7" font-size="9.5">agregar la columna (nullable)</text>
  <text x="40" y="170" fill="currentColor" opacity=".7" font-size="9.5">llenar los datos existentes</text>
  <text x="40" y="190" fill="#34d399" font-size="9.5" font-weight="700">el código viejo sigue igual</text>

  <line x1="224" y1="157" x2="240" y2="157" stroke="currentColor" stroke-width="1.4" marker-end="url(#mg1)"/>

  <rect x="244" y="114" width="196" height="86" rx="10" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.5"/>
  <text x="342" y="134" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">B · MIGRAR EL CÓDIGO</text>
  <text x="260" y="154" fill="currentColor" opacity=".7" font-size="9.5">lee de la nueva</text>
  <text x="260" y="170" fill="currentColor" opacity=".7" font-size="9.5">escribe en AMBAS</text>
  <text x="260" y="190" fill="#22d3ee" font-size="9.5" font-weight="700">se puede volver a A</text>

  <line x1="444" y1="157" x2="460" y2="157" stroke="currentColor" stroke-width="1.4" marker-end="url(#mg1)"/>

  <rect x="464" y="114" width="192" height="86" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="560" y="134" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">C · CONTRAER</text>
  <text x="480" y="154" fill="currentColor" opacity=".7" font-size="9.5">ya nadie usa la vieja</text>
  <text x="480" y="172" fill="currentColor" opacity=".7" font-size="9.5">recién ahora se elimina</text>
  <text x="480" y="192" fill="#f87171" font-size="9.5" font-weight="700">este paso NO se deshace</text>

  <line x1="24" y1="220" x2="656" y2="220" stroke="currentColor" opacity=".18"/>

  <text x="24" y="244" fill="#f87171" font-size="12" font-weight="700">
    LAS OPERACIONES QUE BLOQUEAN — y sus versiones seguras</text>

  <rect x="24" y="256" width="632" height="22" rx="5" fill="#f87171" fill-opacity=".12"/>
  <text x="40" y="271" fill="#f87171" font-size="10" font-family="monospace">create index …</text>
  <text x="300" y="271" fill="#34d399" font-size="10" font-family="monospace" font-weight="700">create index CONCURRENTLY …</text>

  <rect x="24" y="282" width="632" height="22" rx="5" fill="#f87171" fill-opacity=".12"/>
  <text x="40" y="297" fill="#f87171" font-size="10" font-family="monospace">add column not null default</text>
  <text x="300" y="297" fill="#34d399" font-size="10" font-family="monospace" font-weight="700">add nullable → llenar por LOTES → set not null</text>

  <rect x="24" y="308" width="632" height="22" rx="5" fill="#f87171" fill-opacity=".12"/>
  <text x="40" y="323" fill="#f87171" font-size="10" font-family="monospace">rename column</text>
  <text x="300" y="323" fill="#34d399" font-size="10" font-family="monospace" font-weight="700">agregar + disparador de sincronía → migrar → quitar</text>

  <rect x="24" y="342" width="632" height="44" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="44" y="360" fill="#34d399" font-size="11.5" font-weight="700">EL TRUCO QUE CUESTA NADA Y SALVA INCIDENTES</text>
  <text x="44" y="378" fill="currentColor" opacity=".75" font-size="11">
    En vez de <tspan font-family="monospace">drop column</tspan>, renombrar a <tspan font-family="monospace" font-weight="700">_borrado_20260808</tspan>. Deja de usarse, y si en dos días algo la necesitaba, los datos siguen ahí.</text>
</svg>`,
        pie: 'Tres despliegues en vez de uno, y a cambio se puede revertir en cualquier punto sin perder datos.',
      },

      entrevista: [
        { p: '¿Por qué toda migración debe ser compatible con el código anterior?',
          r: 'Porque durante un despliegue progresivo <b>conviven dos versiones del código contra el mismo esquema</b>. Si la migración borra una columna ' +
             'que la versión vieja usa, esa versión empieza a fallar en el intervalo — y si hay que revertir el código, tampoco puede funcionar con el ' +
             'esquema nuevo. <b>El código se revierte en segundos; los datos no.</b> La diferencia entre poder revertir y quedar atrapado está ' +
             'justamente en esto.' },

        { p: '¿Cómo eliminás una columna sin cortar el servicio?',
          r: 'Con <b>expandir y contraer</b>, en tres despliegues. <b>A</b>: agregar lo nuevo sin quitar nada, así el código viejo sigue funcionando. ' +
             '<b>B</b>: el código nuevo lee de la columna nueva y escribe en ambas, con lo cual se puede volver a A. ' +
             '<b>C</b>: cuando ya nadie usa la vieja, eliminarla. Y en el paso C prefiero <b>renombrarla</b> a algo como ' +
             '<code>_borrado_20260808</code> en vez de borrarla: si en dos días aparece que algo la necesitaba, los datos siguen ahí.' },

        { p: '¿Qué operaciones de migración bloquean y cómo se evitan?',
          r: 'Crear un índice <b>sin <code>concurrently</code></b> bloquea todas las escrituras mientras dura — minutos en una tabla grande. ' +
             'Agregar una columna <code>not null</code> con valor por defecto puede reescribir la tabla entera en versiones viejas: la forma segura es ' +
             'agregarla nullable, llenarla <b>por lotes</b> y recién después ponerle <code>not null</code>. ' +
             'Y un <code>update</code> masivo toma un bloqueo largo: en lotes de diez mil, cada uno termina rápido y las escrituras normales pueden ' +
             'intercalarse.' },

        { p: '¿Qué pasos del proceso de migración evitan más incidentes?',
          r: 'Dos. <b>Medir cuánto tarda con el volumen de producción</b>: una migración de dos segundos con mil filas puede tardar veinte minutos con ' +
             'diez millones, y en ese tiempo la tabla puede estar bloqueada. Y <b>verificar que el código actual funciona con el esquema nuevo</b>, ' +
             'que es lo que garantiza poder revertir el código sin quedar atrapado. Además: respaldo verificado antes de cualquier operación ' +
             'destructiva, y nunca combinar una destructiva con otros cambios en la misma migración.' },
      ],

      practica: `
<h4>Cambiar el tipo de una columna, sin cortar</h4>
<pre><code>-- Objetivo: total (numeric) → total_centavos (int)

-- MIGRACIÓN A (expandir)
alter table pedidos add column total_centavos int;
update pedidos set total_centavos = round(total * 100)::int
 where total_centavos is null;

-- Disparador para que el código viejo siga sincronizando
create or replace function sincronizar_total() returns trigger as $$
begin
  if new.total_centavos is null and new.total is not null then
    new.total_centavos := round(new.total * 100)::int;
  end if;
  if new.total is null and new.total_centavos is not null then
    new.total := new.total_centavos / 100.0;
  end if;
  return new;
end $$ language plpgsql;

create trigger mantener_total_sincronizado
before insert or update on pedidos
for each row execute function sincronizar_total();

-- DESPLIEGUE B: el código usa total_centavos

-- MIGRACIÓN C (contraer), semanas después
drop trigger mantener_total_sincronizado on pedidos;
alter table pedidos rename column total to _borrado_20260901_total;
alter table pedidos alter column total_centavos set not null;</code></pre>

<div class="aviso"><strong>El disparador bidireccional es lo que hace reversible el paso B.</strong> Mientras
esté, no importa si escribe el código viejo o el nuevo: las dos columnas quedan coherentes. Sin él, revertir el
código deja filas nuevas sin el valor viejo.</div>

<h4>Actualización masiva por lotes</h4>
<pre><code>do $$
declare
  filas int;
begin
  loop
    update pedidos set canal = 'web'
     where id in (select id from pedidos where canal is null limit 10000);
    get diagnostics filas = row_count;
    exit when filas = 0;
    commit;                    -- ← liberar el bloqueo entre lotes
    perform pg_sleep(0.1);     -- ← darle aire a las escrituras normales
  end loop;
end $$;</code></pre>

<h4>Verificación posterior</h4>
<pre><code>-- ¿La migración dejó todo coherente?
select count(*) as sin_migrar from pedidos where total_centavos is null;
select count(*) as inconsistentes from pedidos
 where abs(total_centavos - round(total * 100)) &gt; 0;

-- ¿Quedó algún índice inválido?
select indexrelid::regclass from pg_index where not indisvalid;</code></pre>

<div class="dato"><strong>La última consulta detecta un <code>create index concurrently</code> que
falló.</strong> Deja el índice en estado inválido, así que la migración "falló" pero hay un índice ahí que no
sirve para nada y ocupa espacio. Verificarlo después evita la confusión y el índice fantasma.</div>

<h4>Checklist de una migración</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Es compatible con el código <b>actual</b></td></tr>
<tr><td>☐</td><td>Está escrito cómo se revierte</td></tr>
<tr><td>☐</td><td>Probada en copia de datos reales</td></tr>
<tr><td>☐</td><td>Medido el tiempo con volumen de producción</td></tr>
<tr><td>☐</td><td>Índices con <code>concurrently</code></td></tr>
<tr><td>☐</td><td>Actualizaciones masivas por lotes</td></tr>
<tr><td>☐</td><td>Respaldo verificado si hay algo destructivo</td></tr>
<tr><td>☐</td><td>Nada destructivo mezclado con otros cambios</td></tr>
<tr><td>☐</td><td>Verificación posterior de coherencia</td></tr>
</table>
`,

      errores: [
        { mito: 'Despliego la migración y el código juntos, así no hay ventana.',
          realidad: 'Con despliegue progresivo hay <b>varios minutos</b> con las dos versiones corriendo. Y si hay que revertir, el código viejo no ' +
                    'funciona con el esquema nuevo: quedás atrapado.' },

        { mito: 'Renombrar una columna es una operación menor.',
          realidad: 'Es <b>borrar y crear a la vez</b>: el código viejo deja de encontrarla al instante. Va con columna nueva más disparador de ' +
                    'sincronía, migración del código, y quitar la vieja después.' },

        { mito: 'Creo el índice y listo.',
          realidad: 'Sin <code>concurrently</code>, <b>bloquea todas las escrituras</b> mientras dura — minutos en una tabla grande. ' +
                    'Y si un <code>concurrently</code> falla, deja un índice inválido que hay que borrar.' },

        { mito: 'La migración tardó dos segundos en desarrollo.',
          realidad: 'Con mil filas. Con diez millones puede tardar veinte minutos con la tabla bloqueada. ' +
                    '<b>Medí con volumen de producción</b> antes de aplicar.' },
      ],

      glosario: [
        { t: 'Expandir y contraer', d: 'Patrón de migración en tres despliegues que mantiene la reversibilidad.' },
        { t: 'Compatible hacia atrás', d: 'Que el esquema nuevo funcione con el código anterior.' },
        { t: 'concurrently', d: 'Crear un índice sin bloquear escrituras. Tarda más y puede fallar.' },
        { t: 'Índice inválido', d: 'El que quedó de un concurrently fallido. Hay que borrarlo.' },
        { t: 'Actualización por lotes', d: 'Modificar en tandas para no tomar bloqueos largos.' },
        { t: 'Migración destructiva', d: 'La que elimina datos. No se deshace: exige respaldo verificado.' },
        { t: 'Disparador de sincronía', d: 'Mantiene coherentes dos columnas durante una transición.' },
        { t: 'Verificación posterior', d: 'Consultas que confirman que la migración dejó todo coherente.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es el problema real de no normalizar?',
      opciones: [
        'Que puede haber dos verdades a la vez, sin ningún error que lo delate',
        'Que ocupa más espacio en disco',
        'Que las consultas son más lentas',
        'Que dificulta agregar columnas',
      ],
      correcta: 0,
      porQue: 'Si el email quedó actualizado en unos pedidos y no en otros, ninguna consulta es confiable. Normalizar hace que esa situación sea imposible, no improbable.',
      porQueNo: {
        1: 'El espacio es barato: no es el argumento.',
        2: 'Desnormalizar suele acelerar lecturas, no frenarlas.',
        3: 'No tiene relación con la evolución del esquema.',
      },
    },
    {
      p: '¿Qué resuelve una restricción de base que el código no puede?',
      opciones: [
        'Las condiciones de carrera: "verificar y después insertar" tiene una ventana, unique no',
        'La validación de formato de los datos',
        'El rendimiento de las consultas',
        'La documentación del esquema',
      ],
      correcta: 0,
      porQue: 'Si dos procesos corren a la vez, ambos ven que no existe y ambos insertan. Con unique, una de las dos inserciones falla. Además, el código se saltea desde un script o la consola.',
      porQueNo: {
        1: 'El código también puede validar formato; la diferencia es la atomicidad.',
        2: 'Algunas restricciones crean índices, pero no es su propósito.',
        3: 'Documenta, pero eso no es lo que el código no puede hacer.',
      },
    },
    {
      p: '¿Cuándo es correcto desnormalizar?',
      opciones: [
        'Datos históricos, valores calculados costosos y datos de otro contexto — documentando cómo se mantienen',
        'Siempre que mejore el rendimiento',
        'Nunca: la normalización es una regla estricta',
        'Cuando la tabla supera el millón de filas',
      ],
      correcta: 0,
      porQue: 'Una columna calculada sin un mecanismo que la mantenga se desactualiza en semanas y los números dejan de cerrar. Por eso la tercera parte —documentar cómo se sincroniza— es la que se olvida.',
      porQueNo: {
        1: 'Sin medir el problema, es optimización prematura con riesgo de inconsistencia.',
        2: 'Hay casos donde duplicar es el dato correcto, como una factura histórica.',
        3: 'El tamaño no determina si duplicar es correcto.',
      },
    },
    {
      p: 'En multi-tenant, ¿qué error de índices es más común?',
      opciones: [
        'Poner tenant_id después de otra columna en el índice compuesto',
        'Crear demasiados índices',
        'Usar índices parciales',
        'Indexar claves foráneas',
      ],
      correcta: 0,
      porQue: 'La primera columna es la que permite acotar. Con (creado_en, tenant_id) cada consulta recorre datos de todos los clientes antes de filtrar — y no se nota hasta que el volumen crece.',
      porQueNo: {
        1: 'Es un problema de escritura, pero menos grave que el orden equivocado.',
        2: 'Los índices parciales son útiles justamente en este contexto.',
        3: 'Indexar claves foráneas usadas para filtrar es recomendable.',
      },
    },
    {
      p: '¿Una transacción protege de que dos usuarios se pisen?',
      opciones: [
        'No: garantiza todo o nada ante una falla, pero dos usuarios pueden leer el mismo valor y pisarse',
        'Sí, ese es su propósito principal',
        'Sí, si el nivel de aislamiento es read committed',
        'Solo si se usa una clave primaria',
      ],
      correcta: 0,
      porQue: 'Los dos leen stock 1, los dos verifican que hay, los dos descuentan, y queda en -1 — con las dos operaciones dentro de transacciones. La concurrencia requiere una decisión aparte.',
      porQueNo: {
        1: 'Su propósito es la atomicidad ante fallas, no el control de concurrencia.',
        2: 'Read committed es justamente el nivel donde ocurre este caso.',
        3: 'La clave primaria no tiene relación con este problema.',
      },
    },
    {
      p: '¿Cuál es la forma más simple de resolver una condición de carrera al descontar stock?',
      opciones: [
        'Poner la condición en el where del update: verificación y escritura en el mismo instante',
        'Leer con for update y después escribir',
        'Subir el nivel de aislamiento a serializable',
        'Usar una cola para serializar las operaciones',
      ],
      correcta: 0,
      porQue: 'Es más simple y más rápido que cualquier bloqueo, y se olvida con frecuencia. Si afectó cero filas, no había stock.',
      porQueNo: {
        1: 'Funciona, pero bloquea y es más costoso que una sola sentencia.',
        2: 'Obliga a manejar reintentos y sigue siendo más caro.',
        3: 'Agrega latencia e infraestructura para algo que la base resuelve.',
      },
    },
    {
      p: '¿Cuándo usarías bloqueo optimista?',
      opciones: [
        'En formularios: no bloquea nada mientras el usuario tiene la pantalla abierta',
        'Cuando los conflictos son muy frecuentes',
        'En operaciones de solo lectura',
        'Cuando hay muchos trabajadores tomando de una cola',
      ],
      correcta: 0,
      porQue: 'El costo es que el usuario puede perder el trabajo, y por eso el mensaje debe decir qué cambió, no solo "error de concurrencia".',
      porQueNo: {
        1: 'Con conflictos frecuentes conviene el pesimista: rehacer el trabajo sale caro.',
        2: 'Las lecturas no necesitan control de concurrencia.',
        3: 'Ese caso pide for update skip locked.',
      },
    },
    {
      p: '¿Qué aporta "for update skip locked"?',
      opciones: [
        'Que varios trabajadores tomen de la misma tabla sin esperarse: cada uno se lleva lo no reservado',
        'Que las lecturas no bloqueen',
        'Que la transacción sea más rápida',
        'Que se eviten los interbloqueos',
      ],
      correcta: 0,
      porQue: 'Es la base de toda cola en SQL. Sin él, todos los trabajadores esperan en la misma fila y tenés cinco procesos haciendo el trabajo de uno.',
      porQueNo: {
        1: 'En Postgres las lecturas normales ya no bloquean.',
        2: 'No acelera la transacción en sí.',
        3: 'Ayuda, pero los interbloqueos se evitan tomando bloqueos en el mismo orden.',
      },
    },
    {
      p: '¿Por qué tabla compartida con RLS y no base por cliente?',
      opciones: [
        'Por las migraciones: una sola, en vez de una por cliente con N puntos de falla',
        'Porque el aislamiento es mejor',
        'Porque Postgres no soporta múltiples bases',
        'Porque RLS es más rápido',
      ],
      correcta: 0,
      porQue: 'Con cincuenta clientes, cada cambio de esquema es una operación con cincuenta puntos de falla. La contrapartida es que el aislamiento depende de las políticas, y por eso hay que testearlo.',
      porQueNo: {
        1: 'El aislamiento es mejor con base separada: se elige por costo y operación.',
        2: 'Los soporta perfectamente.',
        3: 'RLS agrega un filtro: no es más rápido que no tenerlo.',
      },
    },
    {
      p: '¿De dónde debe salir el identificador del tenant?',
      opciones: [
        'De un claim del token de sesión, firmado por el servidor',
        'De un parámetro de la petición',
        'De un encabezado personalizado',
        'De una consulta a la tabla de usuarios en cada petición',
      ],
      correcta: 0,
      porQue: 'El usuario puede cambiar cualquier parámetro, encabezado o campo del formulario con una herramienta básica. El token está firmado y no lo puede alterar.',
      porQueNo: {
        1: 'Es exactamente lo que el usuario controla.',
        2: 'Un encabezado es igual de manipulable.',
        3: 'Es lento y no aporta seguridad adicional sobre el claim.',
      },
    },
    {
      p: '¿Qué falta si una política de RLS solo tiene "using"?',
      opciones: [
        'with check: sin él, un usuario puede insertar filas con el tenant_id de otro cliente',
        'Un índice en tenant_id',
        'Habilitar RLS en la tabla',
        'Un rol específico para la política',
      ],
      correcta: 0,
      porQue: 'using filtra lo que se lee; with check valida lo que se escribe. Sin él, esas filas no se verían pero quedaron escritas — y eso es corrupción de datos ajenos.',
      porQueNo: {
        1: 'Es importante para rendimiento, no para la corrección del aislamiento.',
        2: 'Es otro paso necesario, pero la pregunta es sobre la política.',
        3: 'La política puede aplicar a todos los roles con "for all".',
      },
    },
    {
      p: '¿Qué optimización de RLS puede cambiar el tiempo de una consulta en un orden de magnitud?',
      opciones: [
        'Envolver la función del tenant en un select, para que se evalúe una vez y no por fila',
        'Usar una política por operación en vez de "for all"',
        'Deshabilitar RLS en las tablas grandes',
        'Guardar el tenant_id en una variable de sesión',
      ],
      correcta: 0,
      porQue: 'Sin el select, la función se evalúa por cada fila evaluada. Con él, el planificador la trata como constante. Es una optimización de siete caracteres.',
      porQueNo: {
        1: 'Puede aportar claridad, pero no cambia el costo por fila.',
        2: 'Elimina el aislamiento: no es una optimización aceptable.',
        3: 'Es lo que la función ya hace por debajo.',
      },
    },
    {
      p: '¿Por qué toda migración debe ser compatible con el código anterior?',
      opciones: [
        'Porque durante el despliegue conviven dos versiones contra el mismo esquema, y revertir el código no revierte los datos',
        'Porque lo exige el sistema de migraciones',
        'Para que los tests sigan pasando',
        'Porque las migraciones no se pueden aplicar dos veces',
      ],
      correcta: 0,
      porQue: 'Si la migración borra una columna que la versión vieja usa, esa versión falla en el intervalo — y si hay que revertir, tampoco puede funcionar con el esquema nuevo.',
      porQueNo: {
        1: 'Ninguna herramienta lo exige: es una consecuencia del despliegue progresivo.',
        2: 'Los tests corren contra una versión sola.',
        3: 'Las migraciones idempotentes sí se pueden reaplicar.',
      },
    },
    {
      p: '¿Cómo se agrega una columna obligatoria sin bloquear una tabla grande?',
      opciones: [
        'Agregarla nullable, llenarla por lotes, y recién después ponerle not null',
        'add column not null default en una sola sentencia',
        'Crear una tabla nueva y copiar los datos',
        'Bloquear la tabla y hacerlo de noche',
      ],
      correcta: 0,
      porQue: 'Un update sobre un millón de filas toma un bloqueo largo; en lotes de diez mil cada uno termina rápido y las escrituras normales pueden intercalarse.',
      porQueNo: {
        1: 'En versiones viejas de Postgres reescribe toda la tabla.',
        2: 'Es mucho más riesgoso y requiere sincronizar dos tablas.',
        3: 'Sigue habiendo corte, solo que a una hora menos visible.',
      },
    },
    {
      p: 'En el paso de contraer, ¿qué conviene hacer en vez de un drop column?',
      opciones: [
        'Renombrar la columna a algo como _borrado_20260808 y eliminarla semanas después',
        'Hacer un respaldo y borrar',
        'Vaciar la columna con un update a null',
        'Borrarla dentro de una transacción',
      ],
      correcta: 0,
      porQue: 'Cuesta casi nada: la columna deja de usarse, el código nuevo no la ve, y si en dos días aparece que algo la necesitaba, los datos siguen ahí.',
      porQueNo: {
        1: 'El respaldo es necesario igual, pero restaurar es mucho más caro que renombrar.',
        2: 'Eso destruye los datos igual que borrarla.',
        3: 'La transacción no ayuda una vez confirmada.',
      },
    },
  ],
});
