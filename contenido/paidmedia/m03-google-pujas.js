/* ==========================================================================
   Paid Media · Módulo 03 — Google Ads: pujas, PMax y el resto de la red
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'paidmedia',
  id: 'm03',
  titulo: 'Google Ads: pujas, PMax y el resto de la red',
  fuentes: ['google-ads-ayuda', 'skillshop', 'ga4'],

  intro:
    '<p>Google Ads no es solo búsqueda: es display, video, Shopping y Performance Max — y todo eso se maneja ' +
    'sobre todo eligiendo <b>estrategia de puja</b>, no ajustando ofertas a mano.</p>' +
    '<p>Este módulo va sobre las dos decisiones que más determinan el resultado: <b>qué estrategia de puja usar ' +
    'y cuándo</b>, y <b>cómo tratar a Performance Max</b>, que es la campaña más usada, la más automática y la ' +
    'que más problemas causa cuando se activa sin entenderla.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Estrategias de puja: cuál y cuándo',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> las pujas automáticas funcionan muy bien
<b>cuando tienen datos</b>, y muy mal cuando no. La decisión no es "automático o manual": es
<b>cuánta información puedo darle al sistema</b>.</div>

<h4>Las estrategias, en orden de madurez</h4>
<table>
<tr><th>Estrategia</th><th>Optimiza para</th><th>Necesita</th></tr>
<tr><td><b>CPC manual</b></td><td>Nada: lo decidís vos</td><td>Nada</td></tr>
<tr><td><b>Maximizar clics</b></td><td>Volumen de clics</td><td>Nada</td></tr>
<tr><td><b>Maximizar conversiones</b></td><td>Cantidad</td><td>Medición funcionando</td></tr>
<tr><td><b>CPA objetivo</b></td><td>Cantidad a un costo</td><td>~30 conversiones/mes</td></tr>
<tr><td><b>Maximizar valor</b></td><td>Facturación</td><td>Valor por conversión</td></tr>
<tr><td><b>ROAS objetivo</b></td><td>Facturación a un retorno</td><td>~50 conversiones/mes con valor</td></tr>
</table>

<div class="aviso"><strong>La trampa está en las dos últimas filas: si no llegás al volumen mínimo, esas
estrategias rinden <b>peor</b> que maximizar clics.</strong> El sistema no tiene con qué estimar, así que puja
de forma errática y además restringe el alcance para cumplir un objetivo que no puede calcular. ' +
Es un caso donde "más sofisticado" da resultados peores.</div>

<h4>El camino que funciona</h4>
<pre><code>1 · Maximizar clics (con un tope de CPC)
      hasta juntar 30 conversiones al mes
2 · Maximizar conversiones
      hasta estabilizar el CPA
3 · CPA objetivo, empezando por el CPA que YA estás teniendo
4 · Bajar el objetivo de a poco (10-15% por vez)</code></pre>

<div class="dato"><strong>El punto 3 es donde más se equivoca la gente:</strong> ponen el CPA objetivo que
<b>les gustaría</b> tener, no el que tienen. Si tu CPA real es 8.000 y ponés objetivo 3.000, el sistema
concluye que casi ninguna subasta vale la pena y <b>deja de mostrar el anuncio</b>. ' +
La campaña no gasta, no aprende, y parece que "no funciona".</div>

<h4>La regla más importante</h4>
<pre><code>Si la medición está rota, TODA estrategia automática es peor que manual.

El sistema optimiza hacia lo que ve. Si ve mal, optimiza mal —
y lo hace con mucha eficiencia.</code></pre>
`,

      tecnico: `
<h4>Cuándo cada estrategia</h4>
<pre><code>CPC manual
  · Cuentas nuevas sin conversiones medidas
  · Campañas de marca (el CPC es tan bajo que no hay qué optimizar)
  · Cuando querés control absoluto por una razón concreta

Maximizar clics + tope de CPC
  · Fase inicial, para juntar datos
  · El tope es imprescindible: sin él, puede pagar cualquier cosa

Maximizar conversiones
  · Cuando la medición anda y hay algo de volumen
  · Cuando querés todo el volumen posible sin techo de costo

CPA objetivo
  · Con 30+ conversiones mensuales estables
  · Cuando el negocio tiene un costo máximo por cliente claro

ROAS objetivo
  · Comercio electrónico con valores muy distintos por venta
  · Con 50+ conversiones mensuales CON valor enviado</code></pre>

<div class="dato"><strong>La distinción entre CPA y ROAS objetivo se decide por una sola pregunta:</strong>
<b>¿todas tus ventas valen lo mismo?</b> Si vendés un servicio de precio fijo, CPA. Si vendés productos de
2.000 y de 200.000 pesos, ROAS — porque con CPA el sistema trataría igual una venta chica que una grande, ' +
y va a conseguir muchas chicas.</div>

<h4>El error de tocar el objetivo</h4>
<pre><code>❌ Bajar el CPA objetivo de 8.000 a 4.000 de golpe
   → el sistema restringe el alcance drásticamente
   → cae el volumen, y con menos datos empeora la estimación
   → espiral descendente

✔ Bajar un 10-15% por vez, esperando 2 semanas entre ajustes</code></pre>

<div class="dato"><strong>Y hay un detalle que agrava el error: cambiar el objetivo puede reiniciar el
aprendizaje.</strong> Así que ajustar cada tres días garantiza que la campaña <b>nunca</b> salga de la fase de
aprendizaje — y ahí el rendimiento malo confirma la sospecha de que "no funciona", cerrando el círculo.</div>

<h4>El valor de conversión, que cambia todo</h4>
<pre><code>Sin valor:  el sistema trata igual una venta de $2.000 y una de $200.000
Con valor:  puede priorizar las que más facturan

// Enviarlo siempre que exista
gtag('event', 'conversion', {
  send_to: 'AW-XXXX/YYYY',
  value: pedido.total,        // ← esto habilita ROAS objetivo
  currency: 'ARS',
  transaction_id: pedido.id,
});</code></pre>

<div class="dato"><strong>Para generación de leads, el valor no es obvio y por eso casi nadie lo
envía.</strong> Pero se puede estimar: si el 20% de los leads cierra y el ticket promedio es 100.000, ' +
<b>un lead vale 20.000</b>. Enviar ese valor —incluso estimado— permite que el sistema priorice las fuentes de
leads que efectivamente cierran, y suele ser una de las mejoras más grandes disponibles.</div>

<h4>Conversiones offline: el nivel siguiente</h4>
<p>Si el cierre ocurre por teléfono o en persona, el sistema no lo ve. Se puede subir después:</p>
<pre><code>1 · Al generarse el lead, guardar el GCLID (identificador del clic)
2 · Cuando el lead cierra en el CRM, subir esa conversión con su valor
3 · El sistema aprende qué clics generan ventas REALES, no solo formularios</code></pre>

<div class="dato"><strong>Esta es la diferencia entre optimizar hacia formularios y optimizar hacia
clientes.</strong> Sin conversiones offline, el sistema busca gente que llene formularios — y encuentra ' +
mucha, de baja calidad. Con ellas, aprende cuáles terminan comprando. ' +
<b>En negocios con venta consultiva es la mejora individual más grande que existe.</b></div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="pj1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL CAMINO — cada escalón necesita el volumen del anterior</text>

  <rect x="24" y="34" width="152" height="60" rx="9" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="100" y="54" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">1 · Maximizar clics</text>
  <text x="100" y="72" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">con tope de CPC</text>
  <text x="100" y="86" text-anchor="middle" fill="currentColor" opacity=".55" font-size="8.5">hasta 30 conv/mes</text>

  <line x1="180" y1="64" x2="194" y2="64" stroke="currentColor" stroke-width="1.3" marker-end="url(#pj1)"/>

  <rect x="198" y="34" width="152" height="60" rx="9" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="274" y="54" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">2 · Max. conversiones</text>
  <text x="274" y="72" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">hasta estabilizar el CPA</text>

  <line x1="354" y1="64" x2="368" y2="64" stroke="currentColor" stroke-width="1.3" marker-end="url(#pj1)"/>

  <rect x="372" y="34" width="152" height="60" rx="9" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.5"/>
  <text x="448" y="54" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">3 · CPA objetivo</text>
  <text x="448" y="72" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">= el CPA que YA tenés</text>
  <text x="448" y="86" text-anchor="middle" fill="currentColor" opacity=".55" font-size="8.5">no el que te gustaría</text>

  <line x1="528" y1="64" x2="542" y2="64" stroke="currentColor" stroke-width="1.3" marker-end="url(#pj1)"/>

  <rect x="546" y="34" width="110" height="60" rx="9" fill="#7c5cff" fill-opacity=".18" stroke="#7c5cff" stroke-width="1.2"/>
  <text x="601" y="54" text-anchor="middle" fill="#7c5cff" font-size="10" font-weight="700">4 · bajar</text>
  <text x="601" y="72" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">10-15% por vez</text>
  <text x="601" y="86" text-anchor="middle" fill="currentColor" opacity=".55" font-size="8.5">cada 2 semanas</text>

  <rect x="24" y="106" width="632" height="52" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="44" y="126" fill="#f87171" font-size="12" font-weight="700">EL ERROR MÁS COMÚN: poner el CPA que te GUSTARÍA tener</text>
  <text x="44" y="146" fill="currentColor" opacity=".78" font-size="11">
    CPA real 8.000, objetivo 3.000 → el sistema concluye que casi ninguna subasta vale la pena y <tspan font-weight="700">deja de mostrar el anuncio</tspan>.</text>

  <rect x="24" y="168" width="632" height="30" rx="8" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="188" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">
    Y cambiar el objetivo reinicia el aprendizaje: ajustar cada tres días garantiza que nunca salga de aprendizaje.</text>

  <line x1="24" y1="218" x2="656" y2="218" stroke="currentColor" opacity=".18"/>

  <rect x="24" y="230" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".16" stroke="#f87171" stroke-width="1.6"/>
  <text x="340" y="251" text-anchor="middle" fill="#f87171" font-size="12" font-weight="700">
    Si la medición está rota, TODA estrategia automática es peor que manual. El sistema optimiza hacia lo que ve.</text>

  <text x="24" y="288" fill="#34d399" font-size="12" font-weight="700">
    LA MEJORA MÁS GRANDE EN VENTA CONSULTIVA: CONVERSIONES OFFLINE</text>

  <rect x="24" y="300" width="304" height="86" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="320" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">SIN conversiones offline</text>
  <text x="44" y="340" fill="currentColor" opacity=".72" font-size="10.5">el sistema optimiza hacia FORMULARIOS</text>
  <text x="44" y="360" fill="#f87171" font-size="10.5" font-weight="700">encuentra muchos, de baja calidad</text>
  <text x="44" y="378" fill="currentColor" opacity=".6" font-size="10">y el CPA se ve fantástico</text>

  <rect x="352" y="300" width="304" height="86" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.5"/>
  <text x="504" y="320" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">CON conversiones offline</text>
  <text x="372" y="340" fill="currentColor" opacity=".72" font-size="10.5">se sube el cierre real desde el CRM</text>
  <text x="372" y="360" fill="#34d399" font-size="10.5" font-weight="700">optimiza hacia CLIENTES, no formularios</text>
  <text x="372" y="378" fill="currentColor" opacity=".6" font-size="10">guardá el GCLID al generar el lead</text>
</svg>`,
        pie: 'La decisión no es automático o manual: es cuánta información puedo darle al sistema.',
      },

      entrevista: [
        { p: '¿Cuándo conviene una estrategia de puja automática?',
          r: 'Cuando <b>tiene datos</b>. CPA objetivo pide del orden de treinta conversiones mensuales y ROAS objetivo unas cincuenta con valor enviado. ' +
             'Por debajo de eso rinden <b>peor que maximizar clics</b>: el sistema no tiene con qué estimar, puja de forma errática y encima restringe ' +
             'el alcance para cumplir un objetivo que no puede calcular. Es un caso donde lo más sofisticado da peores resultados.' },

        { p: '¿Cuál es el error más común al configurar CPA objetivo?',
          r: 'Poner el CPA que <b>te gustaría</b> tener en vez del que ya tenés. Si tu CPA real es 8.000 y ponés objetivo 3.000, el sistema concluye ' +
             'que casi ninguna subasta vale la pena y <b>deja de mostrar el anuncio</b>: la campaña no gasta, no aprende, y parece que no funciona. ' +
             'El camino correcto es empezar con el CPA actual y bajarlo entre 10% y 15% por vez, esperando dos semanas — ' +
             'porque además cambiar el objetivo puede reiniciar el aprendizaje.' },

        { p: '¿Cómo elegís entre CPA objetivo y ROAS objetivo?',
          r: 'Con una sola pregunta: <b>¿todas tus ventas valen lo mismo?</b> Si vendés un servicio de precio fijo, CPA. Si vendés productos de 2.000 y ' +
             'de 200.000 pesos, ROAS — porque con CPA el sistema trata igual una venta chica que una grande, y <b>va a conseguir muchas chicas</b>, ' +
             'que es lo más fácil. ROAS exige enviar el valor de cada conversión.' },

        { p: '¿Qué son las conversiones offline y por qué importan tanto?',
          r: 'Subir al sistema las ventas que se cierran <b>fuera del sitio</b> —por teléfono, en persona— usando el identificador del clic que se ' +
             'guardó al generarse el lead. Importan porque cambian hacia qué optimiza el sistema: sin ellas busca <b>gente que llene formularios</b> ' +
             'y encuentra mucha, de baja calidad, con un CPA que se ve fantástico. Con ellas aprende <b>cuáles terminan comprando</b>. ' +
             'En negocios con venta consultiva es la mejora individual más grande que existe.' },
      ],

      practica: `
<h4>Enviar valor incluso en generación de leads</h4>
<pre><code>// Estimar el valor de un lead con datos propios
// Tasa de cierre: 20% · Ticket promedio: $ 100.000
// → un lead vale $ 20.000

gtag('event', 'conversion', {
  send_to: 'AW-XXXXX/lead',
  value: 20000,            // ← estimado, y mucho mejor que nada
  currency: 'ARS',
});

// Y si tenés segmentos con tasas distintas, diferenciá:
// lead de formulario completo   → 25.000
// lead de chat                  → 12.000
// lead de descarga de material  →  4.000</code></pre>

<div class="aviso"><strong>Diferenciar el valor por tipo de lead es lo que hace que el sistema deje de
perseguir el lead más barato.</strong> Sin eso, va a encontrar muchísimas descargas de material —que casi no
cierran— porque son las más fáciles de conseguir, y el CPA promedio va a mejorar mientras las ventas bajan.</div>

<h4>Conversiones offline, el flujo completo</h4>
<pre><code>// 1 · Al llegar la visita, guardar el identificador del clic
const gclid = new URLSearchParams(location.search).get('gclid');
if (gclid) {
  document.cookie = &#96;gclid=\${gclid};max-age=7776000;path=/&#96;;  // 90 días
}

// 2 · Al enviarse el formulario, guardarlo con el lead
await leads.crear({ ...datos, gclid: leerCookie('gclid') });

// 3 · Cuando el lead cierra en el CRM, subir la conversión
await googleAds.subirConversionOffline({
  gclid: lead.gclid,
  conversionName: 'Venta cerrada',
  conversionTime: venta.fecha,
  conversionValue: venta.monto,
  currencyCode: 'ARS',
});</code></pre>

<h4>Diagnóstico de una campaña con puja automática</h4>
<table>
<tr><th>Síntoma</th><th>Causa probable</th></tr>
<tr><td>No gasta el presupuesto</td><td>El objetivo es demasiado agresivo</td></tr>
<tr><td>Gasta todo y el CPA se dispara</td><td>Falta objetivo, o la medición cuenta de más</td></tr>
<tr><td>Rendimiento muy variable</td><td>Poco volumen para la estrategia elegida</td></tr>
<tr><td>Sigue en aprendizaje siempre</td><td>Cambios demasiado frecuentes</td></tr>
<tr><td>Muchas conversiones, pocas ventas</td><td>Optimiza hacia el evento equivocado</td></tr>
</table>

<div class="dato"><strong>La última fila es la más importante y la que más tarda en detectarse:</strong>
todos los números de la plataforma se ven bien y el negocio no crece. Casi siempre significa que el evento
optimizado es demasiado fácil de conseguir — y se resuelve con valor por conversión o con conversiones
offline.</div>

<h4>Checklist antes de activar puja automática</h4>
<pre><code>☐ La medición funciona y está verificada
☐ Hay al menos 30 conversiones mensuales (para CPA objetivo)
☐ Se envía el valor de conversión (para ROAS objetivo)
☐ No hay conversiones contadas dos veces
☐ El objetivo inicial es el CPA/ROAS que YA se está teniendo
☐ Hay presupuesto suficiente para no limitar al sistema</code></pre>
`,

      errores: [
        { mito: 'Las pujas automáticas siempre son mejores que las manuales.',
          realidad: 'Solo <b>con datos suficientes</b>. Con poco volumen, CPA o ROAS objetivo rinden <b>peor</b> que maximizar clics, ' +
                    'porque el sistema no tiene con qué estimar y encima restringe el alcance.' },

        { mito: 'Pongo el CPA objetivo que necesito para que el negocio cierre.',
          realidad: 'Si está muy por debajo del actual, el sistema <b>deja de mostrar el anuncio</b>. Se empieza con el CPA real y se baja ' +
                    'entre 10% y 15% por vez, cada dos semanas.' },

        { mito: 'Para leads no tiene sentido enviar valor.',
          realidad: 'Se puede <b>estimar</b>: tasa de cierre por ticket promedio. Y diferenciar por tipo de lead evita que el sistema persiga ' +
                    'el lead más barato — que suele ser el que menos cierra.' },

        { mito: 'Con las conversiones del sitio alcanza para optimizar.',
          realidad: 'Si el cierre ocurre por teléfono, el sistema optimiza hacia <b>formularios</b> y encuentra muchos de baja calidad. ' +
                    'Las conversiones offline lo hacen optimizar hacia clientes reales.' },
      ],

      glosario: [
        { t: 'CPC manual', d: 'Vos definís cuánto pagar por clic.' },
        { t: 'CPA objetivo', d: 'El sistema puja para conseguir conversiones a un costo dado.' },
        { t: 'ROAS objetivo', d: 'El sistema puja para conseguir cierto retorno sobre la inversión.' },
        { t: 'Valor de conversión', d: 'Cuánto vale cada conversión. Habilita las estrategias de valor.' },
        { t: 'GCLID', d: 'Identificador del clic de Google. Permite subir conversiones offline.' },
        { t: 'Conversión offline', d: 'Venta cerrada fuera del sitio, subida después al sistema.' },
        { t: 'Fase de aprendizaje', d: 'Período tras un cambio en que el rendimiento es inestable.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Performance Max y el resto de la red',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> Performance Max es una campaña que decide sola
<b>dónde</b>, <b>a quién</b> y <b>con qué</b> mostrarte. Es muy potente y es una caja negra — así que hay que
darle buenas señales, porque no vas a poder corregirla en detalle.</div>

<h4>Qué es y qué hace</h4>
<p>Una sola campaña que usa <b>todos</b> los inventarios de Google a la vez: búsqueda, Shopping, YouTube,
Display, Discover, Gmail y Maps. Vos le das:</p>
<ul>
<li><b>Recursos</b> — textos, imágenes, videos, logo.</li>
<li><b>Señales de público</b> — pistas de a quién buscar (no son una segmentación estricta).</li>
<li><b>Un objetivo</b> — conversiones o valor.</li>
</ul>
<p>Y el sistema decide todo lo demás.</p>

<div class="aviso"><strong>El problema real de PMax no es que sea automática: es que
<b>canibaliza</b>.</strong> Si tenés campañas de búsqueda de marca y activás PMax, PMax se va a llevar esas
búsquedas —que iban a convertir igual— y va a mostrar un ROAS espectacular. ' +
El resultado: parece que PMax funciona genial y las otras campañas empeoran, cuando en realidad ' +
<b>solo se movió el crédito de lugar</b>.</div>

<h4>Cómo evitar la canibalización</h4>
<pre><code>1 · Excluir tu marca de PMax (se pide al soporte o por lista de negativas)
2 · Mantener la campaña de marca en búsqueda, aparte
3 · Comparar el TOTAL de la cuenta antes y después, no PMax sola</code></pre>

<h4>Cuándo PMax tiene sentido</h4>
<table>
<tr><th>Situación</th><th>¿PMax?</th></tr>
<tr><td>Comercio electrónico con catálogo y buen feed</td><td>✔ Sí, es su mejor caso</td></tr>
<tr><td>Ya tenés búsqueda funcionando y querés ampliar</td><td>✔ Sí, con marca excluida</td></tr>
<tr><td>Cuenta nueva, sin conversiones medidas</td><td>✘ No: no tiene con qué aprender</td></tr>
<tr><td>Presupuesto muy chico</td><td>✘ No: se diluye entre siete inventarios</td></tr>
<tr><td>Generación de leads sin conversiones offline</td><td>⚠ Cuidado: va a traer leads baratos y malos</td></tr>
</table>

<div class="dato"><strong>Esa última fila merece énfasis porque es el caso donde PMax hace más daño.</strong>
Sin conversiones offline, PMax va a encontrar el formulario más barato posible — y suele conseguir un volumen
enorme de leads sin ninguna intención real. El CPA se ve maravilloso y <b>el equipo comercial pierde semanas</b>
llamando a gente que nunca quiso comprar.</div>
`,

      tecnico: `
<h4>Los grupos de recursos</h4>
<p>PMax se organiza en <b>grupos de recursos</b>, que son el equivalente a los grupos de anuncios. Cada uno
tiene sus textos, imágenes, videos y su señal de público.</p>
<pre><code>Grupo de recursos: Running
  Títulos, descripciones, imágenes de running
  Señal de público: interesados en running
  Grupo de listado: productos de running

Grupo de recursos: Trail
  … lo mismo, con su contenido</code></pre>

<div class="dato"><strong>Sin grupos separados, PMax mezcla todo:</strong> puede mostrar una imagen de
zapatillas de trail con un texto de running. Separar por línea de producto es lo que da algo de control sobre
la coherencia del mensaje — y es de lo poco que se puede controlar realmente.</div>

<h4>El video que se genera solo</h4>
<p>Si no subís videos, Google <b>genera uno automáticamente</b> con tus imágenes y textos. Suele ser malo, y
se muestra en YouTube igual.</p>
<pre><code>Subir al menos un video propio, aunque sea simple:
  · vertical 9:16 y horizontal 16:9
  · 15 a 30 segundos
  · con los primeros 3 segundos fuertes</code></pre>

<div class="dato"><strong>No se puede desactivar la generación automática de video</strong>, así que la única
forma de que no se muestre uno malo es <b>subir uno propio</b>. Es un caso claro de que PMax no se controla
apagando cosas: se controla dándole mejores materiales.</div>

<h4>Shopping y el feed de productos</h4>
<p>Para comercio electrónico, PMax con feed es su mejor versión. Y el feed es lo que decide el resultado:</p>
<table>
<tr><th>Campo</th><th>Por qué importa</th></tr>
<tr><td><b>Título</b></td><td>Es lo que más pesa para que aparezca. Debe incluir marca, tipo y atributos</td></tr>
<tr><td><b>Imagen</b></td><td>Fondo limpio, producto grande, sin texto superpuesto</td></tr>
<tr><td><b>Precio</b></td><td>Debe coincidir exactamente con la página o se rechaza</td></tr>
<tr><td><b>Disponibilidad</b></td><td>Un producto sin stock anunciado desperdicia clics</td></tr>
<tr><td><b>GTIN / marca</b></td><td>Mejoran mucho la coincidencia con búsquedas</td></tr>
</table>

<div class="dato"><strong>El título del feed es la palanca más grande de Shopping y casi nadie la
optimiza.</strong> "Zapatilla 4521" no aparece en ninguna búsqueda útil; ' +
"Nike Zapatillas Running Mujer Air Zoom Talle 38 Negro" aparece en muchísimas. ' +
<b>Reescribir los títulos del feed suele mover el rendimiento más que cualquier ajuste de campaña.</b></div>

<h4>Display y video, en su lugar</h4>
<pre><code>Display
  · Sirve para remarketing, no para captación en frío
  · Sin exclusiones, aparece en aplicaciones de juegos y sitios basura
  · Excluir SIEMPRE: aplicaciones móviles, contenido no apto

YouTube
  · Los primeros 5 segundos deciden todo (después se puede saltar)
  · Para captación amplia, no para venta directa
  · Medir por vistas completadas y visitas, no por ROAS directo</code></pre>

<div class="dato"><strong>La exclusión de aplicaciones móviles en Display es la primera cosa que hay que
hacer</strong> y la que más presupuesto salva. Sin ella, una parte importante de las impresiones va a juegos
donde los "clics" son en su mayoría accidentales — tráfico que rebota al instante y que se paga igual.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="pm1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    PERFORMANCE MAX — una campaña, siete inventarios</text>

  <rect x="24" y="34" width="160" height="76" rx="10" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="104" y="54" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">VOS LE DAS</text>
  <text x="104" y="72" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9">recursos · señales</text>
  <text x="104" y="86" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9">de público · objetivo</text>
  <text x="104" y="102" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">y nada más</text>

  <line x1="188" y1="72" x2="208" y2="72" stroke="currentColor" stroke-width="1.4" marker-end="url(#pm1)"/>

  <rect x="212" y="34" width="150" height="76" rx="10" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="287" y="60" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">CAJA NEGRA</text>
  <text x="287" y="80" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">decide dónde, a quién</text>
  <text x="287" y="96" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">y con qué</text>

  <line x1="366" y1="60" x2="386" y2="46" stroke="#7c5cff" stroke-width="1.2" marker-end="url(#pm1)" color="#7c5cff"/>
  <line x1="366" y1="72" x2="386" y2="72" stroke="#7c5cff" stroke-width="1.2" marker-end="url(#pm1)" color="#7c5cff"/>
  <line x1="366" y1="84" x2="386" y2="98" stroke="#7c5cff" stroke-width="1.2" marker-end="url(#pm1)" color="#7c5cff"/>

  <text x="394" y="45" fill="currentColor" opacity=".65" font-size="9">búsqueda · Shopping</text>
  <text x="394" y="63" fill="currentColor" opacity=".65" font-size="9">YouTube · Display</text>
  <text x="394" y="81" fill="currentColor" opacity=".65" font-size="9">Discover · Gmail · Maps</text>
  <text x="394" y="101" fill="#f87171" font-size="9" font-weight="700">no elegís cuál</text>

  <rect x="24" y="124" width="632" height="58" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="44" y="144" fill="#f87171" font-size="12" font-weight="700">EL PROBLEMA REAL NO ES QUE SEA AUTOMÁTICA: ES QUE CANIBALIZA</text>
  <text x="44" y="164" fill="currentColor" opacity=".78" font-size="11">
    Se lleva tus búsquedas de marca —que convertían igual— y muestra un ROAS espectacular.</text>
  <text x="44" y="178" fill="#f87171" font-size="11" font-weight="700">
    Parece que PMax funciona genial y las demás empeoran. Solo se movió el crédito de lugar.</text>

  <rect x="24" y="192" width="632" height="30" rx="8" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="340" y="212" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">
    Excluí tu marca de PMax · mantené la campaña de marca aparte · compará el TOTAL de la cuenta, no PMax sola.</text>

  <line x1="24" y1="242" x2="656" y2="242" stroke="currentColor" opacity=".18"/>

  <text x="24" y="266" fill="#fbbf24" font-size="12" font-weight="700">
    DONDE PMAX HACE MÁS DAÑO: LEADS SIN CONVERSIONES OFFLINE</text>

  <rect x="24" y="278" width="632" height="46" rx="9" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="298" fill="currentColor" opacity=".78" font-size="11">
    Encuentra el formulario más barato posible: volumen enorme de leads sin ninguna intención real.</text>
  <text x="44" y="316" fill="#fbbf24" font-size="11" font-weight="700">
    El CPA se ve maravilloso y el equipo comercial pierde semanas llamando a gente que nunca quiso comprar.</text>

  <rect x="24" y="336" width="304" height="50" rx="9" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.5"/>
  <text x="176" y="356" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">LA PALANCA MÁS GRANDE DE SHOPPING</text>
  <text x="44" y="376" fill="#34d399" font-size="10" font-weight="700">reescribir los TÍTULOS del feed</text>

  <rect x="352" y="336" width="304" height="50" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="504" y="356" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">LO PRIMERO EN DISPLAY</text>
  <text x="372" y="376" fill="#f87171" font-size="10" font-weight="700">excluir aplicaciones móviles: clics accidentales</text>
</svg>`,
        pie: 'PMax no se controla apagando cosas: se controla dándole mejores materiales.',
      },

      entrevista: [
        { p: '¿Cuál es el problema principal de Performance Max?',
          r: 'No es que sea automática: es que <b>canibaliza</b>. Si tenés campañas de búsqueda de marca y activás PMax, se va a llevar esas búsquedas ' +
             '—que iban a convertir igual— y va a mostrar un ROAS espectacular. El resultado es que <b>parece que PMax funciona genial y las demás ' +
             'empeoran</b>, cuando en realidad solo se movió el crédito de lugar. Se mitiga excluyendo la marca de PMax, ' +
             'manteniendo la campaña de marca aparte, y comparando el <b>total de la cuenta</b> antes y después.' },

        { p: '¿En qué caso PMax hace más daño?',
          r: 'En <b>generación de leads sin conversiones offline</b>. PMax va a encontrar el formulario más barato posible y suele conseguir un volumen ' +
             'enorme de leads sin ninguna intención real. El CPA se ve maravilloso en la plataforma y ' +
             '<b>el equipo comercial pierde semanas</b> llamando a gente que nunca quiso comprar. ' +
             'Sin subir el cierre real desde el CRM, PMax optimiza hacia formularios y lo hace muy bien.' },

        { p: '¿Cómo se controla algo que es una caja negra?',
          r: '<b>Dándole mejores materiales</b>, no apagando cosas. Separar en grupos de recursos por línea de producto, para que no mezcle una imagen ' +
             'de trail con un texto de running. Subir videos propios —porque si no los subís, Google <b>genera uno automáticamente</b> y no se puede ' +
             'desactivar—. Y en comercio electrónico, cuidar el feed, que es donde está la palanca real.' },

        { p: '¿Cuál es la palanca más grande en Shopping?',
          r: 'El <b>título del feed</b>, y casi nadie lo optimiza. "Zapatilla 4521" no aparece en ninguna búsqueda útil; ' +
             '"Nike Zapatillas Running Mujer Air Zoom Talle 38 Negro" aparece en muchísimas. ' +
             '<b>Reescribir los títulos suele mover el rendimiento más que cualquier ajuste de campaña</b>, ' +
             'porque es lo que determina en qué búsquedas el producto puede aparecer.' },
      ],

      practica: `
<h4>Títulos de feed que funcionan</h4>
<pre><code>❌ "Zapatilla 4521"
❌ "OFERTA!! Zapatillas ⚡ ENVÍO GRATIS"     ← los símbolos se penalizan

✔ Estructura: Marca + Tipo + Atributo + Modelo + Variante
   "Nike Zapatillas Running Mujer Air Zoom Pegasus 40 Talle 38 Negro"

Orden por categoría:
  Indumentaria  Marca + Género + Producto + Color + Talle
  Electrónica   Marca + Modelo + Especificación clave + Color
  Consumo       Marca + Producto + Cantidad + Sabor/Variante</code></pre>

<div class="aviso"><strong>Los primeros 70 caracteres son los que se ven</strong>, así que lo más importante va
adelante. Y los símbolos, mayúsculas excesivas y textos promocionales <b>pueden hacer que el producto se
rechace</b> — las promociones van en el campo de promoción, no en el título.</div>

<h4>Estructura de PMax</h4>
<pre><code>Campaña PMax — Comercio
  Grupo de recursos: Running
    · 5 títulos, 5 descripciones específicos de running
    · 8-10 imágenes de running (cuadradas, horizontales, verticales)
    · 1-2 videos propios
    · Señal de público: clientes que compraron running + interesados
    · Grupo de listado: solo productos de running

  Grupo de recursos: Trail
    · Lo mismo, con su contenido

Exclusiones de la campaña:
  · Marca propia (por lista de negativas de cuenta)
  · Ubicaciones donde no vendés</code></pre>

<h4>Medir PMax honestamente</h4>
<pre><code>❌ "PMax tiene ROAS 8, es la mejor campaña"

✔ Comparar el TOTAL de la cuenta:
      Mes anterior (sin PMax):  inversión $ 500.000 · ventas $ 2.100.000
      Mes actual  (con PMax):   inversión $ 700.000 · ventas $ 2.600.000

      Inversión +40%, ventas +24%  → PMax trajo volumen pero peor eficiencia
      Y hay que revisar si canibalizó la búsqueda de marca.</code></pre>

<div class="dato"><strong>Esta comparación a nivel de cuenta es la única forma honesta de evaluar
PMax.</strong> Mirando solo su tablero, siempre va a parecer la mejor campaña — porque se queda con las
conversiones más fáciles de todo el sistema.</div>

<h4>Exclusiones obligatorias en Display</h4>
<pre><code>Configuración → Exclusiones de contenido:
  ☐ Aplicaciones móviles          ← la más importante
  ☐ Juegos
  ☐ Contenido para adultos y sensible
  ☐ Contenido generado por usuarios sin moderar

Y revisar mensualmente el informe de emplazamientos,
excluyendo los sitios con muchos clics y cero conversiones.</code></pre>
`,

      errores: [
        { mito: 'PMax tiene el mejor ROAS de la cuenta, así que le doy más presupuesto.',
          realidad: 'Se queda con las conversiones <b>más fáciles del sistema</b>, incluidas las búsquedas de tu marca. Hay que comparar el ' +
                    '<b>total de la cuenta</b> antes y después, no su tablero.' },

        { mito: 'PMax es buena para generar leads baratos.',
          realidad: 'Sin conversiones offline, encuentra <b>el formulario más barato posible</b> y trae volumen sin intención. El CPA se ve ' +
                    'maravilloso y el equipo comercial pierde semanas llamando a gente que nunca quiso comprar.' },

        { mito: 'No subo videos porque no tengo: que use las imágenes.',
          realidad: 'Google <b>genera un video automáticamente</b>, suele ser malo, se muestra en YouTube igual, y <b>no se puede desactivar</b>. ' +
                    'La única forma de evitarlo es subir uno propio.' },

        { mito: 'El feed lo genero automático desde el catálogo y listo.',
          realidad: 'El <b>título</b> es la palanca más grande de Shopping. "Zapatilla 4521" no aparece en ninguna búsqueda útil; ' +
                    'reescribir títulos suele mover más el rendimiento que cualquier ajuste de campaña.' },
      ],

      glosario: [
        { t: 'Performance Max', d: 'Campaña que usa todos los inventarios de Google con una sola configuración.' },
        { t: 'Grupo de recursos', d: 'Conjunto de textos, imágenes y videos con su señal de público.' },
        { t: 'Señal de público', d: 'Pista sobre a quién buscar. No es una segmentación estricta.' },
        { t: 'Canibalización', d: 'Cuando una campaña se lleva conversiones que otra ya conseguía.' },
        { t: 'Feed de productos', d: 'Archivo con los datos del catálogo que alimenta Shopping.' },
        { t: 'GTIN', d: 'Código de producto estándar. Mejora la coincidencia con búsquedas.' },
        { t: 'Emplazamiento', d: 'Sitio o aplicación donde se mostró un anuncio de Display.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuándo conviene una estrategia de puja automática?',
      opciones: [
        'Cuando tiene datos suficientes: CPA objetivo pide unas 30 conversiones mensuales',
        'Siempre: son mejores que las manuales',
        'Solo en campañas de marca',
        'Cuando el presupuesto es bajo',
      ],
      correcta: 0,
      porQue: 'Por debajo de ese volumen rinden peor que maximizar clics: el sistema no tiene con qué estimar, puja de forma errática y restringe el alcance para cumplir un objetivo que no puede calcular.',
      porQueNo: {
        1: 'Con poco volumen son peores que las manuales.',
        2: 'En marca el CPC es tan bajo que casi no hay qué optimizar.',
        3: 'Con presupuesto bajo suele faltar el volumen necesario.',
      },
    },
    {
      p: '¿Cuál es el error más común al configurar CPA objetivo?',
      opciones: [
        'Poner el CPA que te gustaría tener en vez del que ya tenés',
        'Ponerlo demasiado alto',
        'Cambiarlo una vez por mes',
        'Usarlo en campañas de remarketing',
      ],
      correcta: 0,
      porQue: 'Si tu CPA real es 8.000 y ponés 3.000, el sistema concluye que casi ninguna subasta vale la pena y deja de mostrar el anuncio: no gasta, no aprende, y parece que no funciona.',
      porQueNo: {
        1: 'Un objetivo alto gasta más, pero al menos la campaña funciona y aprende.',
        2: 'Es una frecuencia razonable; el problema es cambiarlo cada tres días.',
        3: 'Es un uso válido.',
      },
    },
    {
      p: '¿Cómo se elige entre CPA objetivo y ROAS objetivo?',
      opciones: [
        'Preguntando si todas las ventas valen lo mismo',
        'Por el tamaño del presupuesto',
        'Por el tipo de campaña',
        'ROAS siempre es mejor',
      ],
      correcta: 0,
      porQue: 'Con ventas de valor muy distinto, CPA trata igual una de 2.000 que una de 200.000 — y el sistema va a conseguir muchas chicas, que es lo más fácil.',
      porQueNo: {
        1: 'El presupuesto influye en el volumen, no en cuál corresponde.',
        2: 'Ambas se pueden usar en varios tipos de campaña.',
        3: 'ROAS exige enviar valor y más volumen de conversiones.',
      },
    },
    {
      p: '¿Qué cambia enviar conversiones offline?',
      opciones: [
        'El sistema deja de optimizar hacia formularios y pasa a optimizar hacia clientes reales',
        'Reduce el costo por clic',
        'Aumenta el alcance de las campañas',
        'Permite usar concordancia amplia',
      ],
      correcta: 0,
      porQue: 'Sin ellas, busca gente que llene formularios y encuentra mucha, de baja calidad, con un CPA que se ve fantástico. En venta consultiva es la mejora individual más grande que existe.',
      porQueNo: {
        1: 'No afecta directamente el CPC.',
        2: 'No amplía el alcance: mejora la calidad de la optimización.',
        3: 'La concordancia es una decisión independiente.',
      },
    },
    {
      p: 'En generación de leads, ¿qué pasa si no diferenciás el valor por tipo de lead?',
      opciones: [
        'El sistema persigue el lead más barato, que suele ser el que menos cierra',
        'No pasa nada relevante',
        'Google rechaza la conversión',
        'Se duplican las conversiones',
      ],
      correcta: 0,
      porQue: 'Va a encontrar muchísimas descargas de material que casi no cierran, porque son las más fáciles de conseguir. El CPA promedio mejora mientras las ventas bajan.',
      porQueNo: {
        1: 'Cambia hacia qué optimiza el sistema.',
        2: 'No hay rechazo por falta de valor.',
        3: 'La duplicación es otro problema, del transaction_id.',
      },
    },
    {
      p: '¿Qué pasa si la medición está rota y usás pujas automáticas?',
      opciones: [
        'Toda estrategia automática rinde peor que manual: el sistema optimiza hacia lo que ve',
        'Las automáticas lo compensan solas',
        'Google avisa y las desactiva',
        'No afecta al resultado',
      ],
      correcta: 0,
      porQue: 'Y lo hace con mucha eficiencia: gasta el presupuesto buscando exactamente a la gente equivocada.',
      porQueNo: {
        1: 'No pueden compensar datos que no reciben.',
        2: 'No hay ninguna desactivación automática por esto.',
        3: 'Es probablemente el factor que más afecta.',
      },
    },
    {
      p: '¿Cuál es el problema principal de Performance Max?',
      opciones: [
        'Que canibaliza: se lleva búsquedas de marca que ya convertían y muestra un ROAS espectacular',
        'Que es más cara que otras campañas',
        'Que no permite usar video',
        'Que solo funciona en Shopping',
      ],
      correcta: 0,
      porQue: 'Parece que PMax funciona genial y las demás campañas empeoran, cuando en realidad solo se movió el crédito de lugar. Hay que comparar el total de la cuenta.',
      porQueNo: {
        1: 'El costo depende de la subasta, no del tipo de campaña.',
        2: 'Usa video: de hecho lo genera solo si no se lo das.',
        3: 'Usa los siete inventarios de Google.',
      },
    },
    {
      p: '¿En qué caso PMax hace más daño?',
      opciones: [
        'Generación de leads sin conversiones offline: trae volumen enorme sin intención real',
        'Comercio electrónico con buen feed',
        'Cuentas con búsqueda ya funcionando',
        'Campañas de remarketing',
      ],
      correcta: 0,
      porQue: 'El CPA se ve maravilloso en la plataforma y el equipo comercial pierde semanas llamando a gente que nunca quiso comprar.',
      porQueNo: {
        1: 'Es su mejor caso de uso.',
        2: 'Funciona bien si se excluye la marca.',
        3: 'No es su caso típico ni el más problemático.',
      },
    },
    {
      p: '¿Cómo se controla una campaña que es una caja negra?',
      opciones: [
        'Dándole mejores materiales: grupos de recursos separados, videos propios, buen feed',
        'Bajando el presupuesto',
        'Pausándola y reactivándola',
        'Poniendo pujas manuales',
      ],
      correcta: 0,
      porQue: 'No se controla apagando cosas. Separar por línea de producto evita que mezcle una imagen de trail con un texto de running, y subir video propio evita el que genera Google.',
      porQueNo: {
        1: 'Limita el volumen sin mejorar la calidad.',
        2: 'Reinicia el aprendizaje y empeora el rendimiento.',
        3: 'PMax no admite pujas manuales.',
      },
    },
    {
      p: 'Si no subís videos a PMax, ¿qué pasa?',
      opciones: [
        'Google genera uno automáticamente, suele ser malo, y no se puede desactivar',
        'No se muestra en YouTube',
        'La campaña no se aprueba',
        'Se usan solo las imágenes',
      ],
      correcta: 0,
      porQue: 'La única forma de evitar que se muestre un video malo es subir uno propio. Es un ejemplo claro de que PMax se controla con materiales, no con configuraciones.',
      porQueNo: {
        1: 'Se muestra igual, con el video generado.',
        2: 'Se aprueba sin problema.',
        3: 'Las imágenes se usan para generar el video.',
      },
    },
    {
      p: '¿Cuál es la palanca más grande en Shopping?',
      opciones: [
        'El título del feed: determina en qué búsquedas puede aparecer el producto',
        'La puja',
        'El presupuesto diario',
        'La cantidad de imágenes',
      ],
      correcta: 0,
      porQue: '"Zapatilla 4521" no aparece en ninguna búsqueda útil; "Nike Zapatillas Running Mujer Air Zoom Talle 38 Negro" aparece en muchísimas. Reescribir títulos mueve más que cualquier ajuste de campaña.',
      porQueNo: {
        1: 'Influye en cuánto pagás, no en dónde aparecés.',
        2: 'Limita el volumen, no la relevancia.',
        3: 'Importa, pero mucho menos que el título.',
      },
    },
    {
      p: '¿Qué NO conviene poner en el título del feed?',
      opciones: [
        'Símbolos, mayúsculas excesivas y textos promocionales: pueden hacer que se rechace',
        'La marca',
        'El talle o la variante',
        'El tipo de producto',
      ],
      correcta: 0,
      porQue: 'Las promociones van en el campo de promoción, no en el título. Y los primeros 70 caracteres son los que se ven, así que lo importante va adelante.',
      porQueNo: {
        1: 'La marca es de los datos más importantes.',
        2: 'Los atributos mejoran mucho la coincidencia.',
        3: 'Es imprescindible para que aparezca en las búsquedas correctas.',
      },
    },
    {
      p: '¿Cuál es la primera exclusión que hay que hacer en Display?',
      opciones: [
        'Aplicaciones móviles: gran parte de esos clics son accidentales',
        'Sitios de noticias',
        'YouTube',
        'Dispositivos de escritorio',
      ],
      correcta: 0,
      porQue: 'Sin esa exclusión, una parte importante de las impresiones va a juegos donde los clics son en su mayoría accidentales: tráfico que rebota al instante y se paga igual.',
      porQueNo: {
        1: 'Pueden ser un buen emplazamiento según el rubro.',
        2: 'Es un canal aparte con su propia lógica.',
        3: 'Suele ser el dispositivo con mejor conversión.',
      },
    },
    {
      p: '¿Cómo se evalúa honestamente Performance Max?',
      opciones: [
        'Comparando el total de la cuenta antes y después, no su tablero',
        'Por el ROAS que reporta la campaña',
        'Por la cantidad de conversiones',
        'Por el CPC promedio',
      ],
      correcta: 0,
      porQue: 'Mirando solo su tablero siempre va a parecer la mejor campaña, porque se queda con las conversiones más fáciles de todo el sistema.',
      porQueNo: {
        1: 'Ese ROAS incluye conversiones canibalizadas de otras campañas.',
        2: 'Las conversiones pueden ser las que ya conseguías por otro lado.',
        3: 'No dice nada sobre la contribución real.',
      },
    },
    {
      p: 'Al bajar un CPA objetivo, ¿cómo conviene hacerlo?',
      opciones: [
        'Entre 10% y 15% por vez, esperando unas dos semanas entre ajustes',
        'De golpe, para llegar rápido al objetivo',
        'Cada tres días, en pasos chicos',
        'No conviene bajarlo nunca',
      ],
      correcta: 0,
      porQue: 'Bajarlo de golpe hace que el sistema restrinja el alcance drásticamente y caiga el volumen, lo que empeora la estimación. Y cambiar el objetivo puede reiniciar el aprendizaje.',
      porQueNo: {
        1: 'Produce una espiral descendente de volumen y datos.',
        2: 'Garantiza que la campaña nunca salga de la fase de aprendizaje.',
        3: 'Se puede y se debe optimizar, con paciencia.',
      },
    },
  ],
});
