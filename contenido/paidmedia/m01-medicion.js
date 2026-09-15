/* ==========================================================================
   Paid Media · Módulo 01 — Medición
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'paidmedia',
  id: 'm01',
  titulo: 'Medición: la parte que casi nadie hace bien',
  fuentes: ['ga4', 'gtm', 'meta-ayuda', 'google-ads-ayuda'],

  intro:
    '<p>Este es el módulo donde un desarrollador aporta más valor que cualquier especialista de medios. La ' +
    'medición es un problema técnico —eventos, contratos, idempotencia, privacidad— y está mal implementada en la ' +
    'enorme mayoría de las cuentas.</p>' +
    '<p>Y el costo de tenerla mal no es "informes imprecisos": es que <b>el algoritmo optimiza hacia el dato ' +
    'equivocado</b>. Una plataforma que recibe señales malas gasta el presupuesto buscando a la gente que no es, ' +
    'de forma perfectamente eficiente.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'GA4 y el modelo de eventos',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> en GA4 <b>todo es un evento</b>. No hay
"páginas vistas" por un lado y "objetivos" por otro: hay eventos, y algunos los marcás como conversión.</div>

<h4>El cambio de modelo</h4>
<table>
<tr><th>Antes (Universal Analytics)</th><th>Ahora (GA4)</th></tr>
<tr><td>Sesiones y páginas vistas</td><td>Eventos con parámetros</td></tr>
<tr><td>Categoría / acción / etiqueta</td><td>Nombre del evento + parámetros libres</td></tr>
<tr><td>Objetivos configurados aparte</td><td>Un evento marcado como conversión</td></tr>
<tr><td>Rebote</td><td>Interacción (lo opuesto)</td></tr>
</table>

<div class="aviso"><strong>La consecuencia práctica: los tutoriales de hace tres años no sirven.</strong>
Y peor: mucha gente migró copiando la estructura vieja, así que hay cuentas con eventos llamados
<code>categoria_accion_etiqueta</code> que no aprovechan nada del modelo nuevo. <b>Si vas a heredar una cuenta,
revisá esto antes que cualquier otra cosa.</b></div>

<h4>Los tres tipos de evento</h4>
<ul>
<li><b>Automáticos</b> — GA4 los recoge solo: primera visita, inicio de sesión, clic saliente.</li>
<li><b>Recomendados</b> — nombres estándar que GA4 entiende: <code>purchase</code>, <code>add_to_cart</code>, <code>generate_lead</code>.</li>
<li><b>Propios</b> — los que definís vos para tu negocio.</li>
</ul>

<div class="dato"><strong>Usar los nombres recomendados no es una formalidad.</strong> GA4 entiende
<code>purchase</code> con su parámetro <code>value</code> y arma informes de comercio electrónico
<b>automáticamente</b>. Si lo llamás <code>compra_finalizada</code>, esos informes quedan vacíos y hay que
armar todo a mano. <b>Los nombres estándar donde existan, propios solo donde no.</b></div>

<h4>La estructura de un evento</h4>
<pre><code>evento: purchase
parámetros:
  transaction_id: 'ORD-1234'      ← imprescindible: evita duplicados
  value: 45000
  currency: 'ARS'
  items: [ { item_id, item_name, price, quantity } ]</code></pre>

<h4>Lo mínimo que hay que medir</h4>
<pre><code>Comercio electrónico   view_item · add_to_cart · begin_checkout · purchase
Generación de leads    generate_lead · contacto_enviado
SaaS                   sign_up · trial_iniciado · suscripcion_activa</code></pre>
`,

      tecnico: `
<h4>Enviar un evento correctamente</h4>
<pre><code>// Compra — usando el nombre y los parámetros estándar
gtag('event', 'purchase', {
  transaction_id: pedido.id,        // ← el que evita contar dos veces
  value: pedido.totalPesos,
  currency: 'ARS',
  tax: pedido.impuestos,
  shipping: pedido.envio,
  items: pedido.items.map((i) =&gt; ({
    item_id: i.sku,
    item_name: i.nombre,
    item_category: i.categoria,
    price: i.precioUnitario,
    quantity: i.cantidad,
  })),
});</code></pre>

<div class="dato"><strong>El <code>transaction_id</code> es el parámetro más importante de todos y el que más
se omite.</strong> Sin él, si la persona recarga la página de gracias, <b>la compra se cuenta de nuevo</b> — y
con eso el ROAS reportado sube sin que haya vendido nada más. Es una de las causas más frecuentes de números
inflados que después no cierran con el sistema real.</div>

<h4>La capa de datos, que es lo que hace todo mantenible</h4>
<pre><code>// La aplicación empuja datos; el gestor de etiquetas decide qué hacer con ellos
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: pedido.id,
    value: pedido.total,
    currency: 'ARS',
    items: [ … ],
  },
});</code></pre>

<div class="dato"><strong>La ventaja concreta de la capa de datos es organizativa, no técnica:</strong> el
desarrollador implementa <b>una vez</b> y quien maneja marketing puede conectar una plataforma nueva sin tocar
código. Sin ella, cada píxel nuevo es un ticket de desarrollo — y en la práctica eso significa que los píxeles
se agregan mal, a las apuradas, directamente en el HTML.</div>

<h4>Marcar conversiones: menos es más</h4>
<p>En GA4 marcás qué eventos son conversión. La tentación es marcar muchos:</p>
<pre><code>❌ purchase, add_to_cart, view_item, scroll, clic_whatsapp, ver_video…
   → todo es conversión, así que nada lo es

✔ purchase (o generate_lead)
   → y como mucho una secundaria de verdad importante</code></pre>

<div class="dato"><strong>Y hay una consecuencia que va más allá del informe:</strong> las conversiones de GA4
se pueden importar a Google Ads para optimizar pujas. Si marcaste <code>scroll</code> como conversión y la
importás, <b>el algoritmo va a buscar gente que haga scroll</b> — y lo va a hacer muy bien. ' +
Optimizar hacia una métrica sin valor es peor que no optimizar.</div>

<h4>Conectar GA4 con Google Ads</h4>
<pre><code>1 · Vincular las cuentas (Administrador → Vínculos con Google Ads)
2 · Importar SOLO las conversiones que valen
3 · Elegir UNA fuente de verdad para cada conversión:
      o la etiqueta de Google Ads, o la importada de GA4 — nunca las dos
</code></pre>

<div class="dato"><strong>Ese paso 3 es el error de configuración más común y produce el doble de conversiones
reportadas.</strong> Si la misma compra la cuenta la etiqueta de Google Ads <b>y</b> la importada de GA4, ' +
Google ve el doble, calcula el CPA a la mitad, y las pujas automáticas suben el gasto persiguiendo un
rendimiento que no existe.</div>

<h4>Lo que GA4 no hace bien</h4>
<ul>
<li><b>No es la fuente de verdad de las ventas.</b> Esa es tu base de datos.</li>
<li>Los datos tardan hasta 48 horas en estabilizarse; no compares en tiempo real.</li>
<li>Aplica muestreo en informes muy grandes.</li>
<li>Sin consentimiento, modela conversiones que no puede observar.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="ga1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA CAPA DE DATOS — la aplicación empuja, el gestor decide</text>

  <rect x="24" y="34" width="140" height="46" rx="8" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="94" y="54" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">tu aplicación</text>
  <text x="94" y="70" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">se implementa UNA vez</text>

  <line x1="168" y1="57" x2="188" y2="57" stroke="currentColor" stroke-width="1.4" marker-end="url(#ga1)"/>

  <rect x="192" y="34" width="150" height="46" rx="8" fill="#34d399" fill-opacity=".22" stroke="#34d399" stroke-width="1.5"/>
  <text x="267" y="54" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">dataLayer</text>
  <text x="267" y="70" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">purchase · value · items</text>

  <line x1="346" y1="50" x2="378" y2="40" stroke="#7c5cff" stroke-width="1.3" marker-end="url(#ga1)" color="#7c5cff"/>
  <line x1="346" y1="57" x2="378" y2="62" stroke="#7c5cff" stroke-width="1.3" marker-end="url(#ga1)" color="#7c5cff"/>
  <line x1="346" y1="64" x2="378" y2="84" stroke="#7c5cff" stroke-width="1.3" marker-end="url(#ga1)" color="#7c5cff"/>

  <rect x="382" y="28" width="130" height="24" rx="5" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.1"/>
  <text x="447" y="44" text-anchor="middle" fill="currentColor" font-size="9">GA4</text>
  <rect x="382" y="56" width="130" height="24" rx="5" fill="#f472b6" fill-opacity=".2" stroke="#f472b6" stroke-width="1.1"/>
  <text x="447" y="72" text-anchor="middle" fill="currentColor" font-size="9">píxel de Meta</text>
  <rect x="382" y="84" width="130" height="24" rx="5" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.1"/>
  <text x="447" y="100" text-anchor="middle" fill="currentColor" font-size="9">Google Ads · TikTok</text>

  <text x="524" y="52" fill="#34d399" font-size="10" font-weight="700">agregar un píxel</text>
  <text x="524" y="68" fill="#34d399" font-size="10" font-weight="700">NUEVO no requiere</text>
  <text x="524" y="84" fill="#34d399" font-size="10" font-weight="700">tocar código</text>

  <rect x="24" y="120" width="632" height="46" rx="9" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="44" y="140" fill="#f87171" font-size="12" font-weight="700">EL PARÁMETRO MÁS IMPORTANTE Y EL QUE MÁS SE OMITE: transaction_id</text>
  <text x="44" y="158" fill="currentColor" opacity=".78" font-size="11">
    Sin él, si la persona recarga la página de gracias <tspan font-weight="700">la compra se cuenta de nuevo</tspan> — y el ROAS sube sin haber vendido nada.</text>

  <line x1="24" y1="186" x2="656" y2="186" stroke="currentColor" opacity=".18"/>

  <text x="24" y="210" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    MARCAR CONVERSIONES — menos es más, y no solo por el informe</text>

  <rect x="24" y="222" width="304" height="88" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="242" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">✗ TODO es conversión</text>
  <text x="44" y="262" fill="currentColor" opacity=".68" font-size="9.5">purchase · add_to_cart · view_item</text>
  <text x="44" y="278" fill="currentColor" opacity=".68" font-size="9.5">scroll · clic_whatsapp · ver_video</text>
  <text x="44" y="298" fill="#f87171" font-size="10" font-weight="700">si todo es conversión, nada lo es</text>

  <rect x="352" y="222" width="304" height="88" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="504" y="242" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">✓ una principal, real</text>
  <text x="372" y="262" fill="currentColor" opacity=".68" font-size="9.5">purchase (o generate_lead)</text>
  <text x="372" y="280" fill="currentColor" opacity=".68" font-size="9.5">+ como mucho una secundaria</text>
  <text x="372" y="300" fill="#34d399" font-size="10" font-weight="700">las importa Google Ads para optimizar pujas</text>

  <rect x="24" y="322" width="632" height="30" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="342" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    Si importás “scroll” como conversión, el algoritmo va a buscar gente que haga scroll — y lo va a hacer muy bien.</text>

  <rect x="24" y="360" width="632" height="26" rx="7" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="378" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">
    Una sola fuente por conversión: o la etiqueta de Google Ads o la importada de GA4. Nunca las dos.</text>
</svg>`,
        pie: 'La medición mal hecha no da “informes imprecisos”: hace que el algoritmo optimice hacia el dato equivocado.',
      },

      entrevista: [
        { p: '¿Cuál es el cambio de modelo de GA4 respecto de lo anterior?',
          r: 'Que <b>todo es un evento</b>: no hay páginas vistas por un lado y objetivos por otro, hay eventos con parámetros libres y algunos se ' +
             'marcan como conversión. La consecuencia práctica es que los tutoriales viejos no sirven, y peor: mucha gente migró copiando la ' +
             'estructura anterior, así que hay cuentas con eventos llamados <code>categoria_accion_etiqueta</code> que no aprovechan nada del ' +
             'modelo nuevo. Si heredás una cuenta, es lo primero que reviso.' },

        { p: '¿Por qué conviene usar los nombres de evento recomendados?',
          r: 'Porque GA4 los entiende y arma informes <b>automáticamente</b>. <code>purchase</code> con su parámetro <code>value</code> alimenta todos ' +
             'los informes de comercio electrónico; si lo llamás <code>compra_finalizada</code>, esos informes quedan vacíos y hay que armar todo a ' +
             'mano. La regla es <b>nombres estándar donde existan, propios solo donde no</b>.' },

        { p: '¿Cuál es el parámetro que más se omite y qué causa?',
          r: '<code>transaction_id</code>. Sin él, si la persona <b>recarga la página de gracias</b> la compra se cuenta de nuevo, y el ROAS reportado ' +
             'sube sin que haya vendido nada más. Es una de las causas más frecuentes de números inflados que después no cierran con el sistema real, ' +
             'y se arregla con una línea.' },

        { p: '¿Qué error de configuración duplica las conversiones reportadas?',
          r: 'Contar la misma conversión con <b>dos fuentes a la vez</b>: la etiqueta propia de Google Ads y la importada de GA4. ' +
             'Google ve el doble, calcula el CPA a la mitad, y <b>las pujas automáticas suben el gasto persiguiendo un rendimiento que no existe</b>. ' +
             'Hay que elegir una sola fuente por conversión. Es el error de configuración más común que me encuentro.' },
      ],

      practica: `
<h4>Implementación con capa de datos</h4>
<pre><code>// utilidades/analitica.ts
type EventoAnalitica =
  | { nombre: 'view_item'; datos: { item_id: string; item_name: string; price: number } }
  | { nombre: 'add_to_cart'; datos: { items: Item[]; value: number } }
  | { nombre: 'begin_checkout'; datos: { items: Item[]; value: number } }
  | { nombre: 'purchase'; datos: { transaction_id: string; value: number; items: Item[] } };

export function medir(evento: EventoAnalitica) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: evento.nombre,
    ecommerce: { currency: 'ARS', ...evento.datos },
  });
}</code></pre>

<div class="aviso"><strong>Tipar los eventos con una unión discriminada resuelve el problema más común de la
medición: los parámetros mal escritos.</strong> Un <code>transation_id</code> con una letra menos no da ningún
error, no se ve en ningún lado, y rompe la deduplicación en silencio. Con tipos, no compila.</div>

<h4>Evitar el doble conteo al recargar</h4>
<pre><code>// app/gracias/page.tsx
useEffect(() =&gt; {
  const clave = &#96;compra-medida-\${pedido.id}&#96;;
  if (sessionStorage.getItem(clave)) return;      // ya se midió

  medir({ nombre: 'purchase', datos: { transaction_id: pedido.id, … } });
  sessionStorage.setItem(clave, '1');
}, [pedido.id]);</code></pre>

<p>El <code>transaction_id</code> ya protege del lado de la plataforma, y esto además evita el evento
duplicado en origen.</p>

<h4>Auditar una cuenta de GA4 heredada</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>¿Los eventos usan nombres estándar donde corresponde?</td></tr>
<tr><td>☐</td><td>¿<code>purchase</code> lleva <code>transaction_id</code> y <code>value</code>?</td></tr>
<tr><td>☐</td><td>¿Cuántas conversiones marcadas hay? (más de 3 es sospechoso)</td></tr>
<tr><td>☐</td><td>¿Alguna conversión se cuenta desde dos fuentes?</td></tr>
<tr><td>☐</td><td>¿Está excluido el tráfico interno?</td></tr>
<tr><td>☐</td><td>¿Están excluidas las referencias de la pasarela de pago?</td></tr>
<tr><td>☐</td><td>¿Coinciden las compras de GA4 con las del sistema, ±10%?</td></tr>
</table>

<div class="dato"><strong>La sexta fila es un clásico que rompe la atribución sin que nadie lo note.</strong>
Si el usuario va a la pasarela de pago y vuelve, GA4 cuenta esa vuelta como una <b>visita nueva referida por la
pasarela</b> — y le atribuye la compra a "mercadopago.com" en vez de a la campaña que la originó. ' +
Se arregla agregando el dominio a la lista de referencias excluidas.</div>

<h4>Comparar contra la verdad, todos los meses</h4>
<pre><code>-- Tu sistema, que es la fuente real
select date_trunc('month', creado_en) as mes,
       count(*) as compras, sum(total) as facturado
  from pedidos where estado = 'pagado' group by 1;

-- Comparar con el informe de GA4.
-- Diferencia menor al 10%  → aceptable
-- Diferencia mayor al 25%  → hay algo roto, no es "muestreo"</code></pre>
`,

      errores: [
        { mito: 'Le pongo nombres propios a los eventos, es más claro para nosotros.',
          realidad: 'GA4 entiende los <b>nombres estándar</b> y arma informes de comercio automáticamente. Con nombres propios esos informes quedan ' +
                    'vacíos y hay que reconstruir todo a mano.' },

        { mito: 'El transaction_id es opcional.',
          realidad: 'Sin él, <b>recargar la página de gracias cuenta la compra de nuevo</b>. Es una de las causas más comunes de ROAS inflado ' +
                    'que no cierra con el sistema real.' },

        { mito: 'Marco muchas conversiones para tener más datos.',
          realidad: 'Si todo es conversión, nada lo es — y si las importás a Google Ads, <b>el algoritmo va a optimizar hacia el scroll</b> ' +
                    'y lo va a hacer muy bien. Optimizar hacia una métrica sin valor es peor que no optimizar.' },

        { mito: 'Uso la etiqueta de Google Ads y también importo de GA4, por las dudas.',
          realidad: 'Eso <b>duplica</b> las conversiones reportadas: Google calcula el CPA a la mitad y las pujas automáticas suben el gasto ' +
                    'persiguiendo un rendimiento inexistente. Una sola fuente por conversión.' },
      ],

      glosario: [
        { t: 'Evento', d: 'Unidad de medición de GA4. Todo se registra como evento con parámetros.' },
        { t: 'Evento recomendado', d: 'Nombre estándar que GA4 entiende y usa para armar informes.' },
        { t: 'transaction_id', d: 'Identificador único de la compra. Evita contarla dos veces.' },
        { t: 'Capa de datos', d: 'Objeto donde la aplicación publica eventos para el gestor de etiquetas.' },
        { t: 'Conversión', d: 'Evento marcado como importante. Se puede importar a Google Ads.' },
        { t: 'Referencia excluida', d: 'Dominio que no debe cortar la sesión, como la pasarela de pago.' },
        { t: 'Muestreo', d: 'Cálculo sobre una parte de los datos en informes muy grandes.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Píxeles y eventos de servidor',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el píxel del navegador pierde entre el 20% y el
40% de las conversiones. Enviar los eventos <b>también desde tu servidor</b> recupera buena parte de eso.</div>

<h4>Por qué el navegador pierde datos</h4>
<ul>
<li><b>Bloqueadores</b> de publicidad y rastreo.</li>
<li><b>Restricciones del sistema operativo</b> al seguimiento entre aplicaciones.</li>
<li><b>Navegadores</b> que limitan las cookies de terceros.</li>
<li>La persona <b>cierra la pestaña</b> antes de que el evento salga.</li>
<li>Fallas de red.</li>
</ul>

<div class="aviso"><strong>Lo importante es que esa pérdida no es aleatoria: es sesgada.</strong> La gente que
usa bloqueadores tiende a tener otro perfil, así que la plataforma no solo ve menos conversiones — ' +
<b>ve un subconjunto sesgado</b>, y optimiza hacia él. Ese sesgo es más dañino que el volumen perdido.</div>

<h4>La solución: enviar también desde el servidor</h4>
<pre><code>Navegador  →  píxel  →  plataforma        (se pierde parte)
        +
Servidor   →  API    →  plataforma        (no se pierde)

La plataforma une los dos por un identificador de evento
y descarta el duplicado.</code></pre>

<p>Cada plataforma lo llama distinto y es exactamente lo mismo:</p>
<table>
<tr><th>Plataforma</th><th>Nombre</th></tr>
<tr><td>Meta</td><td>API de conversiones</td></tr>
<tr><td>Google</td><td>Conversiones mejoradas / API</td></tr>
<tr><td>TikTok</td><td>Events API</td></tr>
</table>

<h4>Lo que hace posible la deduplicación</h4>
<p>El mismo evento se manda dos veces —una desde el navegador y otra desde el servidor— con
<b>el mismo identificador</b>. La plataforma lo reconoce y lo cuenta una sola vez.</p>
<pre><code>navegador:  { event_id: 'compra-ORD-1234', … }
servidor:   { event_id: 'compra-ORD-1234', … }
                        ↑ el mismo
→ se cuenta UNA vez</code></pre>

<div class="dato"><strong>Sin ese identificador compartido, mandar desde los dos lados
<b>duplica</b> las conversiones en vez de recuperarlas.</strong> Es el error más frecuente al implementar la
parte de servidor, y produce el efecto contrario al buscado: números inflados y pujas automáticas
desbocadas.</div>
`,

      tecnico: `
<h4>Implementación completa: navegador + servidor</h4>
<pre><code>// 1 · En el navegador, con un id compartido
const eventId = &#96;compra-\${pedido.id}&#96;;

fbq('track', 'Purchase', {
  value: pedido.total, currency: 'ARS',
}, { eventID: eventId });          // ← el id que permite deduplicar</code></pre>

<pre><code>// 2 · En el servidor, el MISMO id
'use server';
import { createHash } from 'crypto';

const hash = (v: string) =&gt; createHash('sha256').update(v.trim().toLowerCase()).digest('hex');

export async function enviarCompraAMeta(pedido: Pedido, ctx: ContextoWeb) {
  await fetch(&#96;https://graph.facebook.com/v21.0/\${PIXEL_ID}/events&#96;, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: META_TOKEN,
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: &#96;compra-\${pedido.id}&#96;,        // ← el mismo del navegador
        action_source: 'website',
        event_source_url: ctx.url,
        user_data: {
          em: [hash(pedido.email)],              // ← SIEMPRE con hash
          ph: pedido.telefono ? [hash(pedido.telefono)] : undefined,
          client_ip_address: ctx.ip,
          client_user_agent: ctx.userAgent,
          fbc: ctx.fbc,                          // de la cookie _fbc
          fbp: ctx.fbp,                          // de la cookie _fbp
        },
        custom_data: { value: pedido.total, currency: 'ARS' },
      }],
    }),
  });
}</code></pre>

<div class="dato"><strong>Los campos <code>fbc</code> y <code>fbp</code> son los que más mejoran la
coincidencia y los que más se omiten.</strong> Vienen de cookies que el píxel ya dejó en el navegador y
contienen el identificador del clic en el anuncio. Sin ellos, Meta tiene que adivinar a qué campaña corresponde
la conversión; con ellos, la atribución es directa. <b>Hay que leerlos en el servidor y reenviarlos.</b></div>

<h4>Los datos personales: con hash, siempre</h4>
<table>
<tr><th>Campo</th><th>Qué mandar</th></tr>
<tr><td>Email</td><td>Minúsculas, sin espacios, <b>SHA-256</b></td></tr>
<tr><td>Teléfono</td><td>Solo dígitos con código de país, <b>SHA-256</b></td></tr>
<tr><td>Nombre y apellido</td><td>Minúsculas, sin acentos, <b>SHA-256</b></td></tr>
<tr><td>IP y agente de usuario</td><td>Sin hash: se usan para coincidencia técnica</td></tr>
</table>

<div class="dato"><strong>La normalización antes del hash no es un detalle: es lo que decide si
coincide.</strong> <code>Ana@Mail.com</code> y <code>ana@mail.com</code> producen hashes <b>completamente
distintos</b>, así que sin normalizar la tasa de coincidencia se desploma y todo el esfuerzo del lado del
servidor no sirve de nada. Minúsculas y sin espacios, siempre, antes de hashear.</div>

<h4>Dónde disparar el evento de servidor</h4>
<pre><code>❌ En la página de gracias      → el usuario puede no llegar
❌ Al crear el pedido           → puede no pagarse

✔ En el webhook de la pasarela cuando el pago se CONFIRMA
   → es el momento real de la conversión, y no depende del navegador</code></pre>

<div class="dato"><strong>Disparar desde el webhook de pago tiene una ventaja adicional que se descubre
tarde:</strong> mide las compras que se completan <b>fuera del navegador</b> —una transferencia que se acredita
al otro día, un pago en efectivo— que el píxel nunca vería. En mercados con muchos medios de pago offline,
esa diferencia puede ser enorme.</div>

<h4>Conversiones mejoradas de Google</h4>
<pre><code>// Google usa el mismo principio con otra implementación
gtag('set', 'user_data', {
  email: 'ana@mail.com',        // Google hashea en el cliente
  phone_number: '+5491112345678',
});
// Y después el evento de conversión normal.</code></pre>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="px1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    DOS CAMINOS, UN SOLO EVENTO CONTADO</text>

  <rect x="24" y="34" width="170" height="46" rx="8" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="109" y="54" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">NAVEGADOR · píxel</text>
  <text x="109" y="70" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">se pierde 20-40%</text>

  <rect x="24" y="90" width="170" height="46" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.5"/>
  <text x="109" y="110" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">SERVIDOR · API</text>
  <text x="109" y="126" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">no depende del navegador</text>

  <line x1="198" y1="57" x2="252" y2="76" stroke="#22d3ee" stroke-width="1.4" marker-end="url(#px1)" color="#22d3ee"/>
  <line x1="198" y1="113" x2="252" y2="94" stroke="#34d399" stroke-width="1.6" marker-end="url(#px1)" color="#34d399"/>

  <rect x="256" y="60" width="180" height="50" rx="9" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="346" y="80" text-anchor="middle" fill="#7c5cff" font-size="10" font-weight="700">la plataforma une por</text>
  <text x="346" y="98" text-anchor="middle" fill="#7c5cff" font-size="10" font-family="monospace" font-weight="700">event_id</text>

  <line x1="440" y1="85" x2="466" y2="85" stroke="currentColor" stroke-width="1.4" marker-end="url(#px1)"/>

  <rect x="470" y="60" width="186" height="50" rx="9" fill="#34d399" fill-opacity=".22" stroke="#34d399" stroke-width="1.4"/>
  <text x="563" y="82" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">se cuenta UNA vez</text>
  <text x="563" y="100" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9">con la mejor cobertura posible</text>

  <rect x="24" y="150" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="171" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    Sin ese id compartido, mandar desde los dos lados DUPLICA las conversiones en vez de recuperarlas.</text>

  <text x="24" y="208" fill="#fbbf24" font-size="12" font-weight="700">
    LO QUE MÁS SE OMITE Y MÁS MEJORA LA COINCIDENCIA</text>

  <rect x="24" y="220" width="304" height="76" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="176" y="240" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">fbc y fbp</text>
  <text x="44" y="260" fill="currentColor" opacity=".72" font-size="10">Cookies que el píxel ya dejó, con el id del clic.</text>
  <text x="44" y="278" fill="#fbbf24" font-size="10" font-weight="700">Sin ellos, Meta tiene que adivinar la campaña.</text>
  <text x="44" y="291" fill="currentColor" opacity=".6" font-size="9.5">Leelos en el servidor y reenvialos.</text>

  <rect x="352" y="220" width="304" height="76" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="504" y="240" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">NORMALIZAR ANTES DEL HASH</text>
  <text x="372" y="260" fill="currentColor" opacity=".72" font-size="10" font-family="monospace">Ana@Mail.com ≠ ana@mail.com</text>
  <text x="372" y="278" fill="#f87171" font-size="10" font-weight="700">hashes completamente distintos →</text>
  <text x="372" y="291" fill="#f87171" font-size="10" font-weight="700">la coincidencia se desploma y no sirve nada</text>

  <text x="24" y="322" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    DÓNDE DISPARAR EL EVENTO DE SERVIDOR</text>

  <rect x="24" y="334" width="200" height="52" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="124" y="354" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">✗ página de gracias</text>
  <text x="124" y="372" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">el usuario puede no llegar</text>

  <rect x="240" y="334" width="200" height="52" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="340" y="354" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">✗ al crear el pedido</text>
  <text x="340" y="372" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">puede no pagarse</text>

  <rect x="456" y="334" width="200" height="52" rx="9" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.6"/>
  <text x="556" y="352" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">✓ webhook del pago</text>
  <text x="556" y="368" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">y además captura pagos</text>
  <text x="556" y="380" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">que ocurren fuera del navegador</text>
</svg>`,
        pie: 'La pérdida del navegador no es aleatoria: es sesgada. Y el sesgo daña más que el volumen perdido.',
      },

      entrevista: [
        { p: '¿Por qué hace falta enviar eventos desde el servidor?',
          r: 'Porque el píxel del navegador <b>pierde entre el 20% y el 40%</b> de las conversiones: bloqueadores, restricciones del sistema operativo, ' +
             'límites a cookies de terceros, pestañas que se cierran. Y lo importante es que esa pérdida <b>no es aleatoria: es sesgada</b> — ' +
             'quien usa bloqueadores tiene otro perfil, así que la plataforma ve un subconjunto sesgado y optimiza hacia él. ' +
             'Ese sesgo daña más que el volumen perdido.' },

        { p: '¿Cómo se evita duplicar al mandar desde los dos lados?',
          r: 'Con un <b>identificador de evento compartido</b>: el mismo <code>event_id</code> en el evento del navegador y en el del servidor. ' +
             'La plataforma los reconoce como el mismo hecho y lo cuenta una vez. <b>Sin ese identificador, mandar desde los dos lados duplica</b> ' +
             'en vez de recuperar — y produce el efecto contrario al buscado: números inflados y pujas automáticas desbocadas. ' +
             'Es el error más frecuente al implementar la parte de servidor.' },

        { p: '¿Qué datos se envían y cómo?',
          r: 'Los datos personales —email, teléfono, nombre— van <b>hasheados con SHA-256</b>, y la IP y el agente de usuario sin hash porque se usan ' +
             'para coincidencia técnica. Lo crítico es <b>normalizar antes de hashear</b>: minúsculas y sin espacios. ' +
             '<code>Ana@Mail.com</code> y <code>ana@mail.com</code> producen hashes completamente distintos, así que sin normalizar ' +
             'la tasa de coincidencia se desploma y todo el trabajo del lado del servidor no sirve de nada.' },

        { p: '¿Desde dónde conviene disparar el evento de servidor?',
          r: 'Desde el <b>webhook de la pasarela cuando el pago se confirma</b>, no desde la página de gracias —a la que el usuario puede no llegar— ' +
             'ni al crear el pedido —que puede no pagarse—. Y tiene una ventaja que se descubre tarde: ' +
             'mide las compras que se completan <b>fuera del navegador</b>, como una transferencia que se acredita al día siguiente. ' +
             'En mercados con muchos medios de pago offline, esa diferencia puede ser enorme.' },
      ],

      practica: `
<h4>Capturar los identificadores del clic</h4>
<pre><code>// El píxel deja _fbc y _fbp en cookies. Hay que leerlas en el servidor.
export function contextoWeb(req: Request) {
  const cookies = parseCookies(req.headers.get('cookie') ?? '');
  return {
    fbc: cookies._fbc,           // id del clic en el anuncio
    fbp: cookies._fbp,           // id del navegador
    ip: req.headers.get('x-forwarded-for')?.split(',')[0],
    userAgent: req.headers.get('user-agent'),
    url: req.headers.get('referer'),
  };
}

// Guardarlos con el pedido, para poder usarlos en el webhook
await pedidos.crear({ ...datos, meta: contextoWeb(req) });</code></pre>

<div class="aviso"><strong>Guardar el contexto <b>con el pedido</b> es lo que hace posible disparar desde el
webhook.</strong> Cuando el pago se confirma dos días después, ya no hay navegador ni cookies: la única forma
de tener <code>fbc</code> es haberlo guardado al momento de la compra.</div>

<h4>Normalización correcta antes del hash</h4>
<pre><code>import { createHash } from 'crypto';

const sha = (v: string) =&gt; createHash('sha256').update(v).digest('hex');

export const normalizar = {
  email: (v: string) =&gt; sha(v.trim().toLowerCase()),
  telefono: (v: string) =&gt; sha(v.replace(/\\D/g, '')),        // solo dígitos, con país
  nombre: (v: string) =&gt; sha(v.trim().toLowerCase()
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')),      // sin acentos
};</code></pre>

<h4>Envío desde el webhook, idempotente</h4>
<pre><code>export async function POST(req: Request) {
  const evento = await verificarFirma(req);         // ← siempre validar la firma
  if (evento.tipo !== 'pago.aprobado') return ok();

  // Idempotencia: el webhook puede llegar dos veces
  const yaEnviado = await db.eventosEnviados.existe(evento.pagoId);
  if (yaEnviado) return ok();

  const pedido = await pedidos.porPagoId(evento.pagoId);

  await Promise.allSettled([
    enviarAMeta(pedido),
    enviarAGoogle(pedido),
    enviarATikTok(pedido),
  ]);

  await db.eventosEnviados.registrar(evento.pagoId);
  return ok();
}</code></pre>

<div class="dato"><strong>El <code>allSettled</code> evita que una plataforma caída impida enviar a las
otras</strong> — y el registro de enviados evita que un reintento del webhook genere una conversión duplicada
en las tres. Las dos cosas juntas son lo que hace confiable el envío desde el servidor.</div>

<h4>Verificar que funciona</h4>
<table>
<tr><th>Plataforma</th><th>Dónde mirar</th><th>Qué buscar</th></tr>
<tr><td>Meta</td><td>Administrador de eventos → Descripción</td><td>Calidad de coincidencia (7+ es bueno) y "deduplicados"</td></tr>
<tr><td>Meta</td><td>Probador de eventos</td><td>Que llegue el navegador Y el servidor</td></tr>
<tr><td>Google</td><td>Conversiones → Diagnóstico</td><td>Porcentaje de conversiones mejoradas</td></tr>
<tr><td>TikTok</td><td>Events Manager</td><td>Cobertura de la Events API</td></tr>
</table>

<div class="dato"><strong>La métrica de "calidad de coincidencia" de Meta es el mejor indicador de si lo
hiciste bien.</strong> Por debajo de 5 significa que faltan campos o que la normalización está mal; ' +
por encima de 7, la implementación está sana. Es la primera cosa a mirar después de implementar.</div>
`,

      errores: [
        { mito: 'Con el píxel del navegador alcanza.',
          realidad: 'Pierde entre el 20% y el 40%, y de forma <b>sesgada</b>: la plataforma ve un subconjunto que no representa a tus clientes ' +
                    'y optimiza hacia él.' },

        { mito: 'Mando desde el navegador y desde el servidor: así capturo todo.',
          realidad: 'Sin un <b>identificador de evento compartido</b>, eso <b>duplica</b> las conversiones. El resultado es el opuesto al buscado: ' +
                    'números inflados y pujas desbocadas.' },

        { mito: 'Hasheo el email tal como lo escribió el usuario.',
          realidad: '<code>Ana@Mail.com</code> y <code>ana@mail.com</code> dan hashes distintos. Sin <b>normalizar antes</b> —minúsculas, sin espacios— ' +
                    'la coincidencia se desploma y el envío de servidor no sirve.' },

        { mito: 'Disparo el evento de servidor en la página de gracias.',
          realidad: 'A esa página el usuario puede no llegar, y además perdés las compras que se completan fuera del navegador. ' +
                    'Va en el <b>webhook del pago confirmado</b>.' },
      ],

      glosario: [
        { t: 'Píxel', d: 'Script en el navegador que envía eventos a la plataforma.' },
        { t: 'API de conversiones', d: 'Envío de eventos desde el servidor. Cada plataforma le pone otro nombre.' },
        { t: 'event_id', d: 'Identificador compartido entre navegador y servidor para deduplicar.' },
        { t: 'fbc / fbp', d: 'Cookies con el identificador del clic y del navegador. Mejoran la atribución.' },
        { t: 'Hash', d: 'Transformación irreversible de un dato personal antes de enviarlo.' },
        { t: 'Normalización', d: 'Limpiar el dato antes de hashear. Sin ella no coincide.' },
        { t: 'Calidad de coincidencia', d: 'Puntaje de Meta sobre qué tan bien puede identificar a las personas.' },
        { t: 'Idempotencia', d: 'Que un webhook repetido no genere una conversión duplicada.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'UTM, consentimiento y privacidad',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> las UTM son la única parte de la medición que
controlás por completo — y por eso es la que más rinde tenerla ordenada.</div>

<h4>Los cinco parámetros</h4>
<table>
<tr><th>Parámetro</th><th>Qué responde</th><th>Ejemplo</th></tr>
<tr><td><code>utm_source</code></td><td>¿De dónde vino?</td><td><code>meta</code>, <code>google</code></td></tr>
<tr><td><code>utm_medium</code></td><td>¿Qué tipo de tráfico?</td><td><code>cpc</code>, <code>email</code></td></tr>
<tr><td><code>utm_campaign</code></td><td>¿Qué campaña?</td><td><code>verano-2026</code></td></tr>
<tr><td><code>utm_content</code></td><td>¿Qué creativo?</td><td><code>video-gancho-a</code></td></tr>
<tr><td><code>utm_term</code></td><td>¿Qué palabra o público?</td><td><code>publico-frio</code></td></tr>
</table>

<div class="aviso"><strong>La regla que más problemas evita: una convención escrita y respetada.</strong>
<code>Meta</code>, <code>meta</code>, <code>facebook</code> y <code>FB</code> aparecen como <b>cuatro fuentes
distintas</b> en el informe, y hay que unificarlas a mano todos los meses. Definirla el primer día cuesta diez
minutos y ahorra horas para siempre.</div>

<h4>El consentimiento, en criollo</h4>
<p>En muchos países hace falta permiso antes de usar cookies de medición o publicidad. Y eso genera una
tensión real: si nadie acepta, no medís nada.</p>
<p>La solución que usan las plataformas es el <b>modo de consentimiento</b>: en vez de no enviar nada, se envían
señales <b>sin cookies</b> —sin identificar a la persona— y la plataforma <b>estima</b> las conversiones que no
puede observar.</p>

<pre><code>Sin consentimiento  →  se envía una señal anónima
                    →  la plataforma modela las conversiones perdidas
                    →  medís menos preciso, pero medís</code></pre>

<h4>Los datos que nunca deben salir</h4>
<ul>
<li>Emails o teléfonos <b>sin hashear</b>.</li>
<li>Nombres, documentos, direcciones en texto plano.</li>
<li><b>Datos personales en la URL</b> — quedan en registros de servidores que no controlás.</li>
<li>Información de salud, orientación política o cualquier categoría sensible.</li>
</ul>

<div class="aviso"><strong>El tercer punto es el que más se viola sin querer.</strong> Una página de gracias
con <code>?email=ana@mail.com&amp;monto=45000</code> manda ese dato a <b>todos</b> los píxeles de la página, a
los registros del CDN y al historial del navegador. Y una vez que salió, no se puede recuperar.</div>
`,

      tecnico: `
<h4>Convención de UTM, escrita</h4>
<pre><code>utm_source    meta · google · tiktok · newsletter · influencer
              → siempre minúsculas, sin espacios, sin acentos

utm_medium    cpc · display · video · email · social-organico · afiliado

utm_campaign  &lt;objetivo&gt;-&lt;periodo&gt;
              → prospecting-2026-q3 · remarketing-carrito

utm_content   &lt;formato&gt;-&lt;variante&gt;
              → video-testimonial-a · carrusel-beneficios

utm_term      &lt;publico o palabra&gt;
              → frio-intereses · lookalike-1 · zapatillas-running</code></pre>

<div class="dato"><strong>Guardar esa convención en un documento compartido y enlazarla desde el gestor de
campañas es lo que la hace sobrevivir.</strong> Sin eso, la primera persona que arme una campaña un viernes a
las siete va a inventar sus propios valores — y a partir de ahí la limpieza mensual es permanente.</div>

<h4>Parámetros automáticos de las plataformas</h4>
<pre><code>Google Ads permite plantillas con valores dinámicos:
  utm_campaign={campaignid}&amp;utm_content={creative}&amp;utm_term={keyword}

Meta permite lo mismo:
  utm_campaign={{campaign.name}}&amp;utm_content={{ad.name}}

Ventaja: no dependen de que alguien las escriba bien.
Desventaja: los nombres los ponés vos igual — nombrá con criterio.</code></pre>

<h4>Modo de consentimiento, con la implementación real</h4>
<pre><code>// ANTES de cargar cualquier etiqueta: estado por defecto denegado
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
});

// Cuando la persona acepta
gtag('consent', 'update', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
});</code></pre>

<div class="dato"><strong>El <code>wait_for_update</code> es el detalle que decide si funciona.</strong> Le dice
a la etiqueta que espere ese tiempo por la decisión del usuario antes de enviar. Sin él, ' +
<b>el evento de página vista sale antes de que la persona acepte</b> y se pierde para siempre — con lo cual la
implementación del banner deja de servir para lo que existía.</div>

<h4>Qué cambia con y sin consentimiento</h4>
<table>
<tr><th></th><th>Con consentimiento</th><th>Sin consentimiento</th></tr>
<tr><td>Cookies</td><td>Sí</td><td>No</td></tr>
<tr><td>Se envía señal</td><td>Completa</td><td>Anónima, sin identificadores</td></tr>
<tr><td>Conversiones</td><td>Observadas</td><td><b>Modeladas</b> (estimadas)</td></tr>
<tr><td>Remarketing</td><td>Sí</td><td>No</td></tr>
</table>

<h4>Datos personales fuera de la URL</h4>
<pre><code>❌ /gracias?email=ana@mail.com&amp;pedido=1234&amp;monto=45000
   → va a todos los píxeles, a los logs del CDN y al historial

✔ /gracias?p=ORD-1234
   → un identificador opaco; los datos se leen en el servidor</code></pre>

<div class="dato"><strong>Y hay un detalle que agrava el caso:</strong> la URL completa se envía como
<b>referente</b> a cualquier recurso externo que cargue la página —una fuente, un script de terceros, un
píxel—. Así que un email en la URL no solo llega a los píxeles que vos pusiste: llega a todos los dominios
que la página toca.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS CINCO PARÁMETROS — la única parte de la medición que controlás del todo</text>

  <rect x="24" y="34" width="122" height="52" rx="8" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="85" y="53" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-family="monospace" font-weight="700">source</text>
  <text x="85" y="70" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">¿de dónde vino?</text>

  <rect x="152" y="34" width="122" height="52" rx="8" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="213" y="53" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-family="monospace" font-weight="700">medium</text>
  <text x="213" y="70" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">¿qué tipo de tráfico?</text>

  <rect x="280" y="34" width="122" height="52" rx="8" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="341" y="53" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-family="monospace" font-weight="700">campaign</text>
  <text x="341" y="70" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">¿qué campaña?</text>

  <rect x="408" y="34" width="122" height="52" rx="8" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="469" y="53" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-family="monospace" font-weight="700">content</text>
  <text x="469" y="70" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">¿qué creativo?</text>

  <rect x="536" y="34" width="120" height="52" rx="8" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="596" y="53" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-family="monospace" font-weight="700">term</text>
  <text x="596" y="70" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">¿qué público?</text>

  <rect x="24" y="96" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="117" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    Meta · meta · facebook · FB = cuatro fuentes distintas en el informe. Convención escrita el primer día: diez minutos.</text>

  <line x1="24" y1="150" x2="656" y2="150" stroke="currentColor" opacity=".18"/>

  <text x="24" y="174" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CONSENTIMIENTO — no es “medir o no medir”</text>

  <rect x="24" y="186" width="304" height="80" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="176" y="206" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">CON CONSENTIMIENTO</text>
  <text x="44" y="226" fill="currentColor" opacity=".72" font-size="10">cookies · señal completa</text>
  <text x="44" y="244" fill="currentColor" opacity=".72" font-size="10">conversiones observadas</text>
  <text x="44" y="260" fill="#34d399" font-size="10" font-weight="700">remarketing disponible</text>

  <rect x="352" y="186" width="304" height="80" rx="10" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="504" y="206" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">SIN CONSENTIMIENTO</text>
  <text x="372" y="226" fill="currentColor" opacity=".72" font-size="10">sin cookies · señal anónima</text>
  <text x="372" y="244" fill="#fbbf24" font-size="10" font-weight="700">conversiones MODELADAS</text>
  <text x="372" y="260" fill="currentColor" opacity=".65" font-size="10">medís menos preciso, pero medís</text>

  <rect x="24" y="276" width="632" height="30" rx="8" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="340" y="296" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">
    wait_for_update: sin él, la vista de página sale ANTES de que la persona acepte — y se pierde para siempre.</text>

  <rect x="24" y="318" width="632" height="68" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="44" y="338" fill="#f87171" font-size="12" font-weight="700">LO QUE MÁS SE VIOLA SIN QUERER: DATOS PERSONALES EN LA URL</text>
  <text x="44" y="358" fill="currentColor" opacity=".75" font-size="10.5" font-family="monospace">
    /gracias?email=ana@mail.com&amp;monto=45000</text>
  <text x="44" y="378" fill="#f87171" font-size="11" font-weight="700">
    La URL completa se envía como referente a TODO dominio externo que la página toque. Una vez que salió, no se recupera.</text>
</svg>`,
        pie: 'Las UTM son lo único que controlás del todo. Por eso ordenarlas es lo que más rinde por minuto invertido.',
      },

      entrevista: [
        { p: '¿Cuál es la regla más importante con las UTM?',
          r: 'Una <b>convención escrita y respetada</b>. Sin ella, <code>Meta</code>, <code>meta</code>, <code>facebook</code> y <code>FB</code> ' +
             'aparecen como cuatro fuentes distintas en el informe y hay que unificarlas a mano todos los meses. ' +
             'Definirla el primer día cuesta diez minutos y ahorra horas para siempre. Y conviene guardarla en un documento compartido y enlazarla ' +
             'desde el gestor de campañas, porque si no, la primera persona que arme una campaña un viernes va a inventar sus propios valores.' },

        { p: '¿Qué es el modo de consentimiento y qué resuelve?',
          r: 'Resuelve la tensión entre pedir permiso y poder medir. En vez de no enviar nada cuando la persona no acepta, se envían ' +
             '<b>señales anónimas sin cookies</b> y la plataforma <b>estima</b> —modela— las conversiones que no puede observar. ' +
             'Se mide menos preciso, pero se mide. Y hay un detalle de implementación que decide si funciona: <code>wait_for_update</code>, ' +
             'que le dice a la etiqueta que espere la decisión del usuario. <b>Sin él, la vista de página sale antes de que acepte y se pierde.</b>' },

        { p: '¿Qué datos nunca deben salir hacia las plataformas?',
          r: 'Emails o teléfonos <b>sin hashear</b>, nombres y documentos en texto plano, categorías sensibles como salud u orientación política, ' +
             'y sobre todo <b>datos personales en la URL</b>. Ese último es el que más se viola sin querer: una página de gracias con ' +
             '<code>?email=ana@mail.com</code> manda ese dato a todos los píxeles, a los registros del CDN y al historial del navegador.' },

        { p: '¿Por qué es especialmente grave un dato personal en la URL?',
          r: 'Porque la URL completa se envía como <b>referente</b> a cualquier recurso externo que cargue la página: una fuente, un script de terceros, ' +
             'un píxel. Así que ese email no llega solo a los píxeles que vos pusiste — <b>llega a todos los dominios que la página toca</b>, ' +
             'incluidos los que no elegiste. Y una vez que salió, no se puede recuperar. Se resuelve pasando un identificador opaco ' +
             'y leyendo los datos en el servidor.' },
      ],

      practica: `
<h4>Constructor de UTM, para no depender de la memoria</h4>
<pre><code>const FUENTES = ['meta', 'google', 'tiktok', 'newsletter', 'influencer'] as const;
const MEDIOS  = ['cpc', 'display', 'video', 'email', 'afiliado'] as const;

export function enlaceConUtm(base: string, p: {
  source: typeof FUENTES[number];
  medium: typeof MEDIOS[number];
  campaign: string;
  content?: string;
  term?: string;
}) {
  const url = new URL(base);
  url.searchParams.set('utm_source', p.source);
  url.searchParams.set('utm_medium', p.medium);
  url.searchParams.set('utm_campaign', limpiar(p.campaign));
  if (p.content) url.searchParams.set('utm_content', limpiar(p.content));
  if (p.term)    url.searchParams.set('utm_term', limpiar(p.term));
  return url.toString();
}

const limpiar = (v: string) =&gt; v.trim().toLowerCase()
  .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
  .replace(/\\s+/g, '-');</code></pre>

<div class="aviso"><strong>Tipar las fuentes y medios con una unión hace que la convención se cumpla
sola.</strong> Escribir <code>'Facebook'</code> deja de compilar, y con eso desaparece la limpieza manual
mensual del informe.</div>

<h4>Consentimiento, en el orden correcto</h4>
<pre><code>&lt;!-- 1 · PRIMERO el estado por defecto, antes de cualquier etiqueta --&gt;
&lt;script&gt;
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500,
  });
&lt;/script&gt;

&lt;!-- 2 · DESPUÉS el gestor de etiquetas --&gt;
&lt;script src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXX"&gt;&lt;/script&gt;</code></pre>

<pre><code>// 3 · Al aceptar
export function aceptarCookies() {
  gtag('consent', 'update', {
    ad_storage: 'granted', ad_user_data: 'granted',
    ad_personalization: 'granted', analytics_storage: 'granted',
  });
  localStorage.setItem('consentimiento', 'aceptado');
}</code></pre>

<h4>Identificador opaco en la página de gracias</h4>
<pre><code>// ❌ /gracias?email=ana@mail.com&amp;monto=45000
// ✔ /gracias?p=ORD-1234

export default async function Gracias({ searchParams }) {
  const pedido = await pedidos.porCodigoPublico(searchParams.p);
  if (!pedido) notFound();
  // los datos se leen en el servidor: nunca viajan en la URL
  return &lt;Resumen pedido={pedido} /&gt;;
}</code></pre>

<h4>Checklist de privacidad y medición</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Convención de UTM escrita y tipada</td></tr>
<tr><td>☐</td><td>Estado de consentimiento por defecto <b>antes</b> de las etiquetas</td></tr>
<tr><td>☐</td><td><code>wait_for_update</code> configurado</td></tr>
<tr><td>☐</td><td>Cero datos personales en URLs</td></tr>
<tr><td>☐</td><td>Todo dato personal enviado va hasheado y normalizado</td></tr>
<tr><td>☐</td><td>Política de privacidad que menciona las plataformas usadas</td></tr>
<tr><td>☐</td><td>El banner permite <b>rechazar</b> con la misma facilidad que aceptar</td></tr>
</table>
`,

      errores: [
        { mito: 'Las UTM las escribo a mano cuando armo la campaña.',
          realidad: 'Terminás con cuatro variantes de la misma fuente y limpieza manual todos los meses. Una convención <b>tipada</b> hace que ' +
                    'escribir mal deje de compilar.' },

        { mito: 'Si la persona no acepta cookies, no puedo medir nada.',
          realidad: 'Con <b>modo de consentimiento</b> se envían señales anónimas y la plataforma <b>modela</b> las conversiones. ' +
                    'Menos preciso, pero muy lejos de no medir.' },

        { mito: 'Pongo el banner de cookies y con eso alcanza.',
          realidad: 'Falta el estado por defecto <b>antes</b> de las etiquetas y el <code>wait_for_update</code>. Sin eso, los eventos salen antes ' +
                    'de la decisión y el banner no sirve para lo que existía.' },

        { mito: 'Paso el email en la URL de la página de gracias, es más cómodo.',
          realidad: 'La URL completa se envía como <b>referente a todos los dominios externos</b> que la página toca, además de quedar en registros ' +
                    'e historial. Usá un identificador opaco y leé los datos en el servidor.' },
      ],

      glosario: [
        { t: 'UTM', d: 'Parámetros de URL que identifican el origen del tráfico.' },
        { t: 'Convención', d: 'Documento con los valores permitidos de cada parámetro.' },
        { t: 'Modo de consentimiento', d: 'Enviar señales anónimas cuando no hay permiso, para que se modele.' },
        { t: 'wait_for_update', d: 'Tiempo que la etiqueta espera la decisión del usuario antes de enviar.' },
        { t: 'Conversión modelada', d: 'Estimación de una conversión que no se pudo observar.' },
        { t: 'Referente', d: 'Cabecera con la URL de origen, que se envía a recursos externos.' },
        { t: 'Identificador opaco', d: 'Código que no revela datos personales y se resuelve en el servidor.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Verificar que la medición funciona',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> la medición se rompe <b>en silencio</b>. No hay
error, no hay alerta: simplemente los números empiezan a estar mal y nadie se entera hasta el informe
mensual.</div>

<h4>Cómo se rompe</h4>
<ul>
<li>Un despliegue cambió la ruta de la página de gracias.</li>
<li>Alguien rediseñó el formulario y el disparador dejó de coincidir.</li>
<li>Se migró la pasarela de pago y el webhook cambió de forma.</li>
<li>Caducó el token de la API de conversiones.</li>
<li>El banner de cookies bloqueó una etiqueta que antes cargaba.</li>
</ul>

<div class="aviso"><strong>Ninguna de estas cosas produce un error visible.</strong> El sitio funciona
perfecto, las ventas siguen ocurriendo, y lo único que pasa es que las plataformas <b>dejan de ver</b> las
conversiones — y empiezan a optimizar a ciegas. Suele descubrirse tres semanas después, cuando el rendimiento
cayó y nadie entiende por qué.</div>

<h4>La alerta que hay que tener</h4>
<pre><code>Si hubo inversión normal y CERO conversiones en 24 horas
  → casi seguro se rompió la medición, no es que nadie compró</code></pre>

<p>Es una alerta de cinco minutos y es la que más incidentes de medición detecta a tiempo.</p>

<h4>La verificación mensual, en tres pasos</h4>
<pre><code>1 · Contar las ventas en TU sistema
2 · Compararlas con lo que reporta cada plataforma
3 · Si la diferencia es mayor al 25%, buscar la causa
    — y no aceptar "es el muestreo" como explicación</code></pre>

<h4>Las herramientas de prueba</h4>
<table>
<tr><th>Plataforma</th><th>Herramienta</th></tr>
<tr><td>GA4</td><td>DebugView</td></tr>
<tr><td>Meta</td><td>Probador de eventos + extensión Pixel Helper</td></tr>
<tr><td>Google Ads</td><td>Diagnóstico de conversiones + Tag Assistant</td></tr>
<tr><td>TikTok</td><td>Pixel Helper</td></tr>
</table>
`,

      tecnico: `
<h4>Prueba completa antes de lanzar</h4>
<pre><code>1 · Abrir el sitio con el modo de prueba activado
2 · Recorrer el embudo entero como un usuario real
3 · Verificar en CADA paso que el evento llega:
      ver producto → agregar al carrito → iniciar pago → comprar
4 · Verificar los PARÁMETROS, no solo que el evento exista:
      ¿value tiene el número correcto?
      ¿currency está?
      ¿transaction_id es el del pedido?
5 · Hacer una compra real de prueba y verificar el evento de servidor
6 · Recargar la página de gracias y confirmar que NO se cuenta dos veces</code></pre>

<div class="dato"><strong>El paso 4 es el que más problemas encuentra.</strong> Es habitual que el evento
llegue correctamente y que <code>value</code> venga en cero, o con el total sin impuestos, o como texto en vez
de número. La plataforma lo acepta sin quejarse, y el ROAS que reporta queda mal <b>para siempre</b> sin que
nada indique la causa.</div>

<h4>Monitoreo automático</h4>
<pre><code>// Trabajo diario: comparar lo medido con lo real
export const verificarMedicion = inngest.createFunction(
  { id: 'verificar-medicion' },
  { cron: '0 9 * * *' },
  async () =&gt; {
    const ayer = await pedidos.contarDelDia(restarDias(new Date(), 1));
    const inversion = await plataformas.inversionDelDia(restarDias(new Date(), 1));

    if (inversion &gt; 0 &amp;&amp; ayer.compras &gt; 0) {
      const reportadas = await plataformas.conversionesDelDia(restarDias(new Date(), 1));

      if (reportadas === 0) {
        await alertar('medicion_rota', {
          mensaje: 'Hubo inversión y ventas reales, pero cero conversiones reportadas',
          compras: ayer.compras, inversion,
        });
      }

      const desvio = Math.abs(reportadas - ayer.compras) / ayer.compras;
      if (desvio &gt; 0.4) {
        await alertar('medicion_desviada', { reportadas, reales: ayer.compras, desvio });
      }
    }
  },
);</code></pre>

<div class="dato"><strong>La condición del medio —"hubo inversión <b>y</b> ventas reales"— es lo que evita los
falsos positivos.</strong> Sin ella, un domingo sin ventas dispararía la alerta todas las semanas y en un mes
nadie la mira. Con ella, la alerta significa algo: <b>vendiste y la plataforma no lo vio</b>.</div>

<h4>Un test automatizado del embudo</h4>
<pre><code>test('el embudo dispara todos los eventos con sus parámetros', async ({ page }) =&gt; {
  const eventos: any[] = [];
  await page.exposeFunction('capturar', (e: any) =&gt; eventos.push(e));
  await page.addInitScript(() =&gt; {
    window.dataLayer = new Proxy([], {
      set(t, k, v) { if (v?.event) (window as any).capturar(v); return Reflect.set(t, k, v); },
    });
  });

  await page.goto('/producto/zapatilla-x');
  await page.click('text=Agregar al carrito');
  await page.click('text=Finalizar compra');

  expect(eventos.map((e) =&gt; e.event)).toEqual(
    expect.arrayContaining(['view_item', 'add_to_cart', 'begin_checkout']),
  );

  const carrito = eventos.find((e) =&gt; e.event === 'add_to_cart');
  expect(carrito.ecommerce.value).toBeGreaterThan(0);       // ← el parámetro
  expect(carrito.ecommerce.currency).toBe('ARS');
});</code></pre>

<div class="dato"><strong>Este test es lo que convierte la medición en algo que no se rompe en
silencio.</strong> Corriendo en el pipeline, un rediseño del botón que rompe el disparador ' +
<b>falla el build</b> en vez de descubrirse tres semanas después en el informe mensual.</div>

<h4>Auditoría trimestral</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Recorrer el embudo con las herramientas de prueba</td></tr>
<tr><td>☐</td><td>Comparar cada plataforma contra el sistema (±25%)</td></tr>
<tr><td>☐</td><td>Revisar la calidad de coincidencia de Meta (7+)</td></tr>
<tr><td>☐</td><td>Verificar que los tokens de API no caducaron</td></tr>
<tr><td>☐</td><td>Confirmar que la deduplicación funciona</td></tr>
<tr><td>☐</td><td>Revisar que no haya conversiones contadas dos veces</td></tr>
<tr><td>☐</td><td>Comprobar que el tráfico interno sigue excluido</td></tr>
</table>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <rect x="24" y="28" width="632" height="52" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="340" y="50" text-anchor="middle" fill="#f87171" font-size="13" font-weight="700">
    La medición se rompe EN SILENCIO.</text>
  <text x="340" y="70" text-anchor="middle" fill="currentColor" opacity=".72" font-size="11">
    El sitio funciona, las ventas ocurren, y lo único que pasa es que las plataformas dejan de verlas — y optimizan a ciegas.</text>

  <text x="24" y="106" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CÓMO SE ROMPE — ninguna de estas cosas da un error visible</text>

  <rect x="24" y="118" width="200" height="44" rx="8" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.1"/>
  <text x="124" y="136" text-anchor="middle" fill="currentColor" opacity=".72" font-size="9.5">cambió la ruta de /gracias</text>
  <text x="124" y="152" text-anchor="middle" fill="currentColor" opacity=".72" font-size="9.5">en un despliegue</text>

  <rect x="240" y="118" width="200" height="44" rx="8" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.1"/>
  <text x="340" y="136" text-anchor="middle" fill="currentColor" opacity=".72" font-size="9.5">se rediseñó el formulario</text>
  <text x="340" y="152" text-anchor="middle" fill="currentColor" opacity=".72" font-size="9.5">y el disparador no coincide</text>

  <rect x="456" y="118" width="200" height="44" rx="8" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.1"/>
  <text x="556" y="136" text-anchor="middle" fill="currentColor" opacity=".72" font-size="9.5">caducó el token de la API</text>
  <text x="556" y="152" text-anchor="middle" fill="currentColor" opacity=".72" font-size="9.5">de conversiones</text>

  <rect x="24" y="172" width="632" height="30" rx="8" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="192" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">
    Se descubre tres semanas después, cuando el rendimiento cayó y nadie entiende por qué.</text>

  <line x1="24" y1="222" x2="656" y2="222" stroke="currentColor" opacity=".18"/>

  <rect x="24" y="234" width="632" height="52" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.6"/>
  <text x="44" y="254" fill="#34d399" font-size="12" font-weight="700">LA ALERTA DE CINCO MINUTOS QUE MÁS INCIDENTES DETECTA</text>
  <text x="44" y="274" fill="currentColor" opacity=".78" font-size="11.5">
    Hubo <tspan font-weight="700">inversión normal</tspan> Y <tspan font-weight="700">ventas reales</tspan>, pero CERO conversiones reportadas → se rompió la medición.</text>

  <rect x="24" y="296" width="632" height="26" rx="7" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.2"/>
  <text x="340" y="314" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">
    Sin la condición “y ventas reales”, un domingo flojo dispara la alerta todas las semanas y en un mes nadie la mira.</text>

  <rect x="24" y="332" width="304" height="54" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="176" y="352" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">VERIFICÁ LOS PARÁMETROS</text>
  <text x="44" y="370" fill="currentColor" opacity=".72" font-size="10">value en cero · sin currency · como texto</text>
  <text x="44" y="382" fill="#fbbf24" font-size="10" font-weight="700">la plataforma lo acepta sin quejarse</text>

  <rect x="352" y="332" width="304" height="54" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.5"/>
  <text x="504" y="352" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">TEST DEL EMBUDO EN EL PIPELINE</text>
  <text x="372" y="370" fill="currentColor" opacity=".72" font-size="10">un rediseño que rompe el disparador…</text>
  <text x="372" y="382" fill="#34d399" font-size="10" font-weight="700">…falla el BUILD, no el informe mensual</text>
</svg>`,
        pie: 'La plataforma acepta un value en cero sin quejarse. Y el ROAS queda mal para siempre.',
      },

      entrevista: [
        { p: '¿Por qué la medición es peligrosa cuando se rompe?',
          r: 'Porque <b>se rompe en silencio</b>: no hay error, el sitio funciona, las ventas siguen ocurriendo. Lo único que pasa es que las ' +
             'plataformas <b>dejan de ver</b> las conversiones y empiezan a optimizar a ciegas — gastando el presupuesto buscando a la gente ' +
             'equivocada, de forma perfectamente eficiente. Suele descubrirse tres semanas después, cuando el rendimiento cayó y nadie entiende ' +
             'por qué.' },

        { p: '¿Cuál es la alerta más valiosa y cómo se configura para que sirva?',
          r: '"Hubo inversión normal y <b>ventas reales</b>, pero cero conversiones reportadas". La condición de las ventas reales es lo que evita ' +
             'los falsos positivos: sin ella, un domingo flojo dispara la alerta todas las semanas y en un mes nadie la mira. ' +
             'Con ella, la alerta significa algo muy concreto: <b>vendiste y la plataforma no lo vio</b>. Son cinco minutos de configuración ' +
             'y es la que más incidentes de medición detecta a tiempo.' },

        { p: 'Al verificar eventos, ¿qué es lo que más problemas encuentra?',
          r: 'Revisar los <b>parámetros</b>, no solo que el evento exista. Es habitual que el evento llegue perfecto y que <code>value</code> venga en ' +
             'cero, o con el total sin impuestos, o como texto en vez de número. <b>La plataforma lo acepta sin quejarse</b>, y el ROAS que reporta ' +
             'queda mal para siempre sin que nada indique la causa. Por eso la verificación tiene que mirar el contenido del evento, ' +
             'no solo su presencia.' },

        { p: '¿Cómo evitás que la medición se rompa sin que nadie lo note?',
          r: 'Con un <b>test del embudo corriendo en el pipeline</b> que verifique que cada evento se dispara y que sus parámetros son correctos. ' +
             'Así, un rediseño del botón que rompe el disparador <b>falla el build</b> en vez de descubrirse tres semanas después en el informe ' +
             'mensual. Y en paralelo, un trabajo diario que compare lo medido con las ventas reales del sistema y alerte si el desvío pasa cierto ' +
             'porcentaje.' },
      ],

      practica: `
<h4>Prueba manual antes de lanzar</h4>
<pre><code>Con GA4 DebugView y Meta Pixel Helper abiertos:

1 · Ver un producto      → view_item con item_id y price
2 · Agregar al carrito   → add_to_cart con value &gt; 0 y currency
3 · Iniciar el pago      → begin_checkout con los items
4 · Completar la compra  → purchase con transaction_id, value, items
5 · RECARGAR /gracias    → NO debe aparecer un purchase nuevo
6 · Esperar el webhook   → verificar el evento de servidor en el probador
7 · En el probador de Meta, confirmar que dice "deduplicado"</code></pre>

<div class="aviso"><strong>Los pasos 5 y 7 son los que casi nadie hace y los que validan lo más
importante:</strong> que no se cuente doble por recarga, y que la deduplicación entre navegador y servidor
esté funcionando. Sin verificar el 7, podés estar duplicando todas las conversiones sin saberlo.</div>

<h4>Alerta diaria</h4>
<pre><code>export const alertaMedicion = inngest.createFunction(
  { id: 'alerta-medicion' },
  { cron: '0 9 * * *' },
  async () =&gt; {
    const dia = restarDias(new Date(), 1);
    const [reales, inversion, reportadas] = await Promise.all([
      pedidos.contarPagados(dia),
      plataformas.inversion(dia),
      plataformas.conversiones(dia),
    ]);

    if (inversion === 0 || reales === 0) return;         // sin señal, sin alerta

    if (reportadas === 0) {
      return alertar('medicion_rota', { reales, inversion });
    }
    const desvio = Math.abs(reportadas - reales) / reales;
    if (desvio &gt; 0.4) {
      return alertar('medicion_desviada', { reales, reportadas, desvio });
    }
  },
);</code></pre>

<h4>Informe de conciliación mensual</h4>
<pre><code>Mes: agosto 2026

                    Sistema   GA4    Meta   Google   TikTok
Compras                 187    174      92       68       21
Facturación       8.415.000  7.9M    4.1M     3.0M     0.9M

GA4 vs sistema:        -7%   ✔ aceptable
Suma de plataformas:   181 = 97% del total   ← solapamiento normal

⚠ Si GA4 estuviera 30% abajo, hay algo roto: no es muestreo.</code></pre>

<div class="dato"><strong>Este informe de cinco filas es la herramienta de diagnóstico más útil del
módulo.</strong> Hecho todos los meses, cualquier rotura aparece como un salto evidente en una fila — y como es
comparativo, no requiere saber cuál "debería" ser el número correcto.</div>

<h4>Documentar la implementación</h4>
<pre><code># Medición — mapa de eventos

| Evento         | Se dispara en           | Parámetros            | Destinos        |
|----------------|-------------------------|-----------------------|-----------------|
| view_item      | /producto/[slug]        | item_id, price        | GA4, Meta       |
| add_to_cart    | botón "Agregar"         | items, value          | GA4, Meta, TikTok |
| begin_checkout | /checkout               | items, value          | GA4, Meta       |
| purchase       | webhook de pago         | transaction_id, value | GA4, Meta, Google, TikTok |

Deduplicación: event_id = &#96;compra-&lt;pedidoId&gt;&#96;
Fuente de verdad de ventas: tabla pedidos, estado = 'pagado'</code></pre>
`,

      errores: [
        { mito: 'Si la medición se rompe, me voy a dar cuenta.',
          realidad: 'Se rompe <b>en silencio</b>: no hay error y el sitio funciona. Se descubre tres semanas después, cuando el rendimiento cayó ' +
                    'y nadie entiende por qué.' },

        { mito: 'Verifico que el evento llegue y con eso alcanza.',
          realidad: 'Falta verificar los <b>parámetros</b>. Un <code>value</code> en cero o como texto se acepta sin quejas, y el ROAS queda mal ' +
                    'para siempre sin que nada indique la causa.' },

        { mito: 'La diferencia con GA4 es por el muestreo.',
          realidad: 'El muestreo explica pocos puntos porcentuales. Una diferencia mayor al 25% <b>es una rotura</b>, y aceptar esa explicación ' +
                    'es cómo se convive con la medición rota durante meses.' },

        { mito: 'Configuro una alerta de cero conversiones y listo.',
          realidad: 'Sin la condición de <b>"y hubo ventas reales"</b>, un domingo flojo la dispara todas las semanas y en un mes nadie la mira. ' +
                    'Una alerta que se ignora es peor que no tenerla.' },
      ],

      glosario: [
        { t: 'DebugView', d: 'Herramienta de GA4 para ver eventos en tiempo real durante la prueba.' },
        { t: 'Probador de eventos', d: 'Herramienta de Meta para verificar píxel y API de conversiones.' },
        { t: 'Conciliación', d: 'Comparar lo que reporta cada plataforma con las ventas reales.' },
        { t: 'Deduplicado', d: 'Estado que confirma que navegador y servidor se contaron una sola vez.' },
        { t: 'Falso positivo', d: 'Alerta que se dispara sin que haya un problema real.' },
        { t: 'Mapa de eventos', d: 'Documento con qué se dispara dónde, con qué parámetros y a qué destinos.' },
        { t: 'Muestreo', d: 'Cálculo sobre parte de los datos. Explica pocos puntos, no un 30%.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es el cambio de modelo central de GA4?',
      opciones: [
        'Todo es un evento: no hay páginas vistas por un lado y objetivos por otro',
        'Se mide por sesiones en vez de por usuarios',
        'Ya no hace falta instalar nada',
        'Los informes son en tiempo real',
      ],
      correcta: 0,
      porQue: 'Hay eventos con parámetros libres y algunos se marcan como conversión. Mucha gente migró copiando la estructura vieja, así que hay cuentas que no aprovechan nada del modelo nuevo.',
      porQueNo: {
        1: 'Es al revés: el modelo pasó de sesiones a eventos.',
        2: 'Sigue requiriendo instalación y configuración.',
        3: 'Los datos tardan hasta 48 horas en estabilizarse.',
      },
    },
    {
      p: '¿Por qué conviene usar los nombres de evento recomendados?',
      opciones: [
        'Porque GA4 los entiende y arma los informes de comercio automáticamente',
        'Porque son más cortos',
        'Porque los propios no están permitidos',
        'Porque mejoran el SEO',
      ],
      correcta: 0,
      porQue: 'Con nombres propios esos informes quedan vacíos y hay que reconstruir todo a mano. La regla es nombres estándar donde existan, propios solo donde no.',
      porQueNo: {
        1: 'La longitud no tiene relevancia.',
        2: 'Los eventos propios están permitidos y son necesarios.',
        3: 'No tiene relación con el posicionamiento.',
      },
    },
    {
      p: '¿Qué causa omitir el transaction_id en el evento de compra?',
      opciones: [
        'Que recargar la página de gracias cuente la compra de nuevo e infle el ROAS',
        'Que el evento no se envíe',
        'Que no aparezcan los productos',
        'Que se pierda la moneda',
      ],
      correcta: 0,
      porQue: 'Es una de las causas más frecuentes de números inflados que después no cierran con el sistema real, y se arregla con una línea.',
      porQueNo: {
        1: 'El evento se envía igual: el problema es que se cuenta dos veces.',
        2: 'Los productos van en el parámetro items.',
        3: 'La moneda va en currency.',
      },
    },
    {
      p: '¿Qué error de configuración duplica las conversiones reportadas en Google Ads?',
      opciones: [
        'Contar la misma conversión con la etiqueta propia y también con la importada de GA4',
        'Tener varias campañas activas',
        'Usar pujas automáticas',
        'Vincular GA4 con Google Ads',
      ],
      correcta: 0,
      porQue: 'Google ve el doble, calcula el CPA a la mitad, y las pujas automáticas suben el gasto persiguiendo un rendimiento que no existe.',
      porQueNo: {
        1: 'No afecta al conteo de conversiones.',
        2: 'Las pujas usan los datos: el problema es la fuente duplicada.',
        3: 'Vincular está bien; el problema es importar además de la etiqueta propia.',
      },
    },
    {
      p: '¿Por qué el píxel del navegador pierde conversiones de forma problemática?',
      opciones: [
        'Porque la pérdida es sesgada: la plataforma ve un subconjunto no representativo y optimiza hacia él',
        'Porque pierde exactamente el 50%',
        'Porque solo falla en móviles',
        'Porque las conversiones se recuperan solas después',
      ],
      correcta: 0,
      porQue: 'Quien usa bloqueadores tiene otro perfil. Ese sesgo daña más que el volumen perdido, porque la optimización se orienta a un público que no representa a tus clientes.',
      porQueNo: {
        1: 'La pérdida ronda el 20-40% y varía por mercado.',
        2: 'Ocurre en todos los dispositivos y navegadores.',
        3: 'Sin envío de servidor, no se recuperan.',
      },
    },
    {
      p: '¿Cómo se evita duplicar al enviar desde navegador y servidor?',
      opciones: [
        'Con el mismo event_id en ambos envíos',
        'Enviando desde el servidor con un retraso',
        'Enviando solo la mitad de los eventos desde cada lado',
        'No se puede evitar',
      ],
      correcta: 0,
      porQue: 'Sin ese identificador compartido, mandar desde los dos lados duplica en vez de recuperar — y produce números inflados y pujas desbocadas.',
      porQueNo: {
        1: 'El retraso no evita que se cuenten como dos hechos distintos.',
        2: 'Eso pierde datos en vez de recuperarlos.',
        3: 'La deduplicación por event_id es el mecanismo estándar.',
      },
    },
    {
      p: 'Al enviar datos personales por la API de conversiones, ¿qué es imprescindible?',
      opciones: [
        'Normalizar antes de hashear: minúsculas y sin espacios',
        'Enviarlos en texto plano para que coincidan mejor',
        'Cifrarlos con una clave propia',
        'Pedir permiso explícito por cada envío',
      ],
      correcta: 0,
      porQue: 'Ana@Mail.com y ana@mail.com producen hashes completamente distintos. Sin normalizar, la tasa de coincidencia se desploma y todo el trabajo de servidor no sirve.',
      porQueNo: {
        1: 'Enviar datos personales sin hashear es inaceptable.',
        2: 'La plataforma no podría comparar con una clave que no conoce.',
        3: 'El consentimiento se gestiona a nivel de sitio, no por envío.',
      },
    },
    {
      p: '¿Desde dónde conviene disparar el evento de servidor de una compra?',
      opciones: [
        'Desde el webhook de la pasarela cuando el pago se confirma',
        'Desde la página de gracias',
        'Al crear el pedido',
        'Desde un trabajo nocturno',
      ],
      correcta: 0,
      porQue: 'A la página de gracias el usuario puede no llegar y el pedido puede no pagarse. Además, el webhook captura compras que se completan fuera del navegador, como una transferencia acreditada al día siguiente.',
      porQueNo: {
        1: 'Depende de que el usuario llegue y no cierre la pestaña.',
        2: 'Un pedido creado puede no pagarse nunca.',
        3: 'Llega demasiado tarde para las ventanas de atribución.',
      },
    },
    {
      p: '¿Cuál es la regla más importante con las UTM?',
      opciones: [
        'Una convención escrita y respetada, idealmente tipada en código',
        'Usar siempre los cinco parámetros',
        'Que sean lo más descriptivas posible',
        'Cambiarlas en cada campaña',
      ],
      correcta: 0,
      porQue: 'Meta, meta, facebook y FB aparecen como cuatro fuentes distintas y hay que unificarlas a mano todos los meses. Tipar los valores hace que escribir mal deje de compilar.',
      porQueNo: {
        1: 'Algunos no siempre aplican; lo crítico es la consistencia.',
        2: 'Descriptivas sin convención sigue produciendo fragmentación.',
        3: 'Cambiar los valores rompe la comparabilidad histórica.',
      },
    },
    {
      p: '¿Qué resuelve el modo de consentimiento?',
      opciones: [
        'Enviar señales anónimas cuando no hay permiso, para que la plataforma modele las conversiones',
        'Evitar tener que pedir consentimiento',
        'Cifrar los datos de los usuarios',
        'Bloquear todas las cookies',
      ],
      correcta: 0,
      porQue: 'Se mide menos preciso, pero se mide. Y el detalle que decide si funciona es wait_for_update: sin él, la vista de página sale antes de que la persona acepte y se pierde.',
      porQueNo: {
        1: 'El consentimiento se sigue pidiendo; esto define qué pasa mientras tanto.',
        2: 'No es un mecanismo de cifrado.',
        3: 'Permite habilitarlas según la decisión del usuario.',
      },
    },
    {
      p: '¿Por qué es especialmente grave un dato personal en la URL?',
      opciones: [
        'Porque la URL completa se envía como referente a todo dominio externo que la página cargue',
        'Porque se ve en la barra del navegador',
        'Porque hace la URL más larga',
        'Porque afecta el posicionamiento',
      ],
      correcta: 0,
      porQue: 'Ese email no llega solo a los píxeles que pusiste: llega a todos los dominios que la página toca, incluidos los que no elegiste. Y una vez que salió, no se recupera.',
      porQueNo: {
        1: 'Es visible pero eso es lo menos grave.',
        2: 'La longitud es irrelevante.',
        3: 'No tiene relación con el posicionamiento.',
      },
    },
    {
      p: '¿Por qué la medición rota es peligrosa?',
      opciones: [
        'Porque se rompe en silencio: no hay error y las plataformas empiezan a optimizar a ciegas',
        'Porque el sitio deja de funcionar',
        'Porque se pierden ventas',
        'Porque las plataformas bloquean la cuenta',
      ],
      correcta: 0,
      porQue: 'El sitio funciona perfecto, las ventas siguen ocurriendo, y solo pasa que las plataformas dejan de verlas. Se descubre tres semanas después, cuando el rendimiento cayó.',
      porQueNo: {
        1: 'El sitio sigue funcionando con normalidad.',
        2: 'Las ventas ocurren: lo que se pierde es la señal.',
        3: 'No hay bloqueo por falta de eventos.',
      },
    },
    {
      p: '¿Qué condición evita que la alerta de "cero conversiones" se vuelva ruido?',
      opciones: [
        'Exigir que además haya habido inversión normal y ventas reales',
        'Ejecutarla solo los lunes',
        'Elevar el umbral a dos días',
        'Enviarla solo por email',
      ],
      correcta: 0,
      porQue: 'Sin esa condición, un domingo flojo la dispara todas las semanas y en un mes nadie la mira. Con ella significa algo concreto: vendiste y la plataforma no lo vio.',
      porQueNo: {
        1: 'Perdería seis días de detección.',
        2: 'Retrasa la detección sin reducir falsos positivos.',
        3: 'El canal no cambia la calidad de la señal.',
      },
    },
    {
      p: 'Al verificar eventos, ¿qué encuentra más problemas?',
      opciones: [
        'Revisar los parámetros: un value en cero o como texto se acepta sin quejas',
        'Confirmar que el evento aparece en el probador',
        'Contar cuántos eventos hay configurados',
        'Revisar el orden de los eventos',
      ],
      correcta: 0,
      porQue: 'La plataforma acepta un value incorrecto sin ninguna señal, y el ROAS que reporta queda mal para siempre sin que nada indique la causa.',
      porQueNo: {
        1: 'Es necesario pero insuficiente: el evento puede llegar con datos malos.',
        2: 'La cantidad no dice nada sobre la corrección.',
        3: 'Importa menos que el contenido de cada evento.',
      },
    },
    {
      p: '¿Cómo evitás que la medición se rompa sin que nadie lo note?',
      opciones: [
        'Con un test del embudo en el pipeline que verifique eventos y parámetros',
        'Documentando la implementación',
        'Revisando el informe una vez por mes',
        'Poniendo comentarios en el código de las etiquetas',
      ],
      correcta: 0,
      porQue: 'Así un rediseño del botón que rompe el disparador falla el build, en vez de descubrirse tres semanas después en el informe mensual.',
      porQueNo: {
        1: 'Ayuda a entender, no detecta roturas.',
        2: 'Detecta tarde: el daño de tres semanas ya ocurrió.',
        3: 'Los comentarios no verifican comportamiento.',
      },
    },
  ],
});
