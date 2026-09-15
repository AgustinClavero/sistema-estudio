/* ==========================================================================
   Paid Media · Módulo 00 — Cómo funciona la publicidad digital
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'paidmedia',
  id: 'm00',
  titulo: 'Cómo funciona la publicidad digital',
  fuentes: ['google-ads-ayuda', 'meta-ayuda', 'skillshop'],

  intro:
    '<p>Casi toda la formación en publicidad enseña <b>dónde hacer clic</b>, y eso caduca cada seis meses. Este ' +
    'módulo enseña el mecanismo de abajo, que casi no cambió en quince años: <b>cómo se decide quién ve tu anuncio ' +
    'y cuánto pagás por eso</b>.</p>' +
    '<p>Entender la subasta explica el 80% de las decisiones que después vas a tomar — incluida la más importante: ' +
    'por qué mejorar el anuncio suele bajar el costo más que subir la puja.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'La subasta: por qué no gana el que más paga',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> cada vez que alguien podría ver un anuncio se hace
una subasta instantánea, y <b>no la gana quien más ofrece</b>: la gana quien ofrece el mejor
<b>resultado esperado para la plataforma</b>.</div>

<h4>Qué se subasta</h4>
<p>No se subasta "un espacio publicitario": se subasta <b>una impresión concreta para una persona
concreta</b>. Vos no comprás un cartel; comprás la oportunidad de mostrarle algo a <i>esta</i> persona en
<i>este</i> momento.</p>

<h4>La fórmula, simplificada</h4>
<pre><code>Puntaje = tu puja  ×  probabilidad de que la persona actúe  ×  calidad</code></pre>

<p>Gana el puntaje más alto. Por eso pasa algo que sorprende a todos al principio:</p>

<pre><code>Anunciante A: puja 100, la gente hace clic el 1% de las veces  → 100
Anunciante B: puja  50, la gente hace clic el 4% de las veces  → 200

Gana B, ofreciendo la MITAD.</code></pre>

<div class="aviso"><strong>De ahí sale la conclusión más importante de todo el track:</strong> mejorar el
anuncio y la página de destino <b>baja tu costo</b>, porque sube la probabilidad de acción. ' +
Subir la puja sube el costo por definición. <b>Casi siempre es más barato mejorar el creativo que pagar más.</b></div>

<h4>Por qué la plataforma lo hace así</h4>
<p>Porque cobra <b>cuando pasa algo</b> —un clic, una vista, una conversión— no por mostrar. Un anuncio que
nadie mira no le genera ingresos aunque el anunciante ofrezca mucho. Y además, si muestra anuncios malos, la
gente usa menos la plataforma.</p>
<p>Los intereses están alineados: <b>a la plataforma le conviene mostrar el anuncio que a la gente le va a
interesar</b>.</p>

<h4>Qué pagás realmente</h4>
<p>Ofrecés hasta 100, pero pagás <b>lo mínimo necesario para haber ganado</b> — un poco más que el segundo.
Por eso subir la puja no siempre sube lo que pagás: te hace ganar más subastas, y ahí es donde crece el gasto.</p>
`,

      tecnico: `
<h4>Cómo se llama en cada plataforma</h4>
<table>
<tr><th></th><th>Google Ads</th><th>Meta</th><th>TikTok</th></tr>
<tr><td>Puntaje</td><td>Ad Rank</td><td>Valor total</td><td>Similar a Meta</td></tr>
<tr><td>Calidad</td><td>Nivel de calidad (1-10)</td><td>Calidad y tasas de acción estimadas</td><td>Puntaje del anuncio</td></tr>
<tr><td>Se cobra por</td><td>Clic o conversión</td><td>Impresión, mayormente</td><td>Impresión o clic</td></tr>
</table>

<div class="dato"><strong>Esa última fila explica una diferencia práctica grande.</strong> En Google pagás
sobre todo por clic, así que una impresión sin clic te sale gratis. En Meta pagás por impresión, así que
<b>un creativo que nadie mira te cuesta plata igual</b>. Por eso en Meta la calidad del creativo impacta el
costo mucho más directamente.</div>

<h4>El nivel de calidad de Google, en detalle</h4>
<p>Se compone de tres cosas, todas relativas a los competidores para esa palabra clave:</p>
<ul>
<li><b>CTR esperado</b> — qué tan probable es que hagan clic. <b>El de mayor peso.</b></li>
<li><b>Relevancia del anuncio</b> — cuánto coincide con lo que la persona buscó.</li>
<li><b>Experiencia en la página de destino</b> — si la página responde a lo que buscaba.</li>
</ul>

<div class="dato"><strong>El error más común es tratar la página de destino como algo ajeno a la
campaña.</strong> Si alguien busca "zapatillas running mujer" y cae en la home, la experiencia es mala, el
nivel de calidad baja y <b>pagás más por cada clic</b> — para siempre, en todas las subastas de esa palabra. ' +
La página correcta no es una mejora de conversión: es un descuento en el costo del medio.</div>

<h4>La fase de aprendizaje</h4>
<p>Las plataformas necesitan datos para estimar la probabilidad de acción. Mientras no los tienen, muestran de
forma más aleatoria y el rendimiento es peor.</p>
<pre><code>Meta      ~50 conversiones del evento optimizado en 7 días
Google    similar en volumen; menos explícito
TikTok    similar a Meta</code></pre>

<div class="dato"><strong>De acá sale la regla que más resultados cambia y que casi nadie respeta:</strong>
si dividís el presupuesto en ocho conjuntos de anuncios, <b>ninguno junta datos suficientes</b> y los ocho
quedan aprendiendo para siempre. <b>Menos campañas con más presupuesto rinden mucho más que muchas campañas
chicas</b>, aunque parezca que estás "probando más cosas".</div>

<h4>Y el detalle que reinicia el aprendizaje</h4>
<p>Editar cosas significativas —el presupuesto de golpe, el público, el evento a optimizar, el creativo— puede
<b>reiniciar la fase de aprendizaje</b>. Por eso los cambios se hacen espaciados y de a poco: tocar todos los
días es garantizar que la campaña nunca salga de aprendizaje.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA SUBASTA — no gana el que más paga</text>

  <rect x="24" y="34" width="632" height="30" rx="8" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="340" y="54" text-anchor="middle" fill="#7c5cff" font-size="12" font-weight="700">
    Puntaje = puja × probabilidad de que la persona actúe × calidad</text>

  <rect x="24" y="76" width="304" height="86" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="96" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">ANUNCIANTE A</text>
  <text x="44" y="116" fill="currentColor" opacity=".72" font-size="10.5">puja 100 · le hacen clic el 1%</text>
  <rect x="44" y="124" width="80" height="18" rx="4" fill="#f87171" fill-opacity=".5"/>
  <text x="140" y="138" fill="#f87171" font-size="12" font-weight="700">puntaje 100</text>
  <text x="44" y="156" fill="currentColor" opacity=".6" font-size="10">paga el doble y PIERDE</text>

  <rect x="352" y="76" width="304" height="86" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.6"/>
  <text x="504" y="96" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">ANUNCIANTE B</text>
  <text x="372" y="116" fill="currentColor" opacity=".72" font-size="10.5">puja 50 · le hacen clic el 4%</text>
  <rect x="372" y="124" width="160" height="18" rx="4" fill="#34d399" fill-opacity=".55"/>
  <text x="548" y="138" fill="#34d399" font-size="12" font-weight="700">puntaje 200</text>
  <text x="372" y="156" fill="#34d399" font-size="10" font-weight="700">GANA ofreciendo la mitad</text>

  <rect x="24" y="174" width="632" height="42" rx="9" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="44" y="194" fill="#fbbf24" font-size="12" font-weight="700">LA CONCLUSIÓN MÁS IMPORTANTE DE TODO EL TRACK</text>
  <text x="44" y="211" fill="currentColor" opacity=".78" font-size="11">
    Mejorar el anuncio y la página BAJA tu costo. Subir la puja lo sube por definición. Casi siempre es más barato mejorar el creativo.</text>

  <line x1="24" y1="234" x2="656" y2="234" stroke="currentColor" opacity=".18"/>

  <text x="24" y="258" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    UNA DIFERENCIA PRÁCTICA GRANDE ENTRE PLATAFORMAS</text>

  <rect x="24" y="270" width="304" height="60" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="176" y="290" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">GOOGLE — pagás por CLIC</text>
  <text x="44" y="310" fill="currentColor" opacity=".7" font-size="10.5">una impresión sin clic te sale gratis</text>
  <text x="44" y="324" fill="currentColor" opacity=".6" font-size="10">el mal creativo cuesta oportunidad, no plata</text>

  <rect x="352" y="270" width="304" height="60" rx="10" fill="#f472b6" fill-opacity=".16" stroke="#f472b6" stroke-width="1.5"/>
  <text x="504" y="290" text-anchor="middle" fill="#f472b6" font-size="10.5" font-weight="700">META — pagás por IMPRESIÓN</text>
  <text x="372" y="310" fill="#f472b6" font-size="10.5" font-weight="700">un creativo que nadie mira te cuesta plata igual</text>
  <text x="372" y="324" fill="currentColor" opacity=".6" font-size="10">por eso ahí la calidad del creativo pesa más</text>

  <rect x="24" y="342" width="632" height="44" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.5"/>
  <text x="44" y="360" fill="#f87171" font-size="11.5" font-weight="700">LA REGLA QUE MÁS RESULTADOS CAMBIA Y CASI NADIE RESPETA</text>
  <text x="44" y="378" fill="currentColor" opacity=".78" font-size="11">
    Si dividís el presupuesto en ocho conjuntos, ninguno junta datos y los ocho quedan aprendiendo para siempre. <tspan font-weight="700">Menos campañas, más presupuesto.</tspan></text>
</svg>`,
        pie: 'Vos no comprás un espacio: comprás la oportunidad de mostrarle algo a esta persona en este momento.',
      },

      entrevista: [
        { p: '¿Cómo funciona la subasta de anuncios?',
          r: 'Cada oportunidad de mostrar un anuncio se subasta al instante, y el ganador no es quien más ofrece: es quien tiene el mayor ' +
             '<b>puntaje</b>, que combina la puja con la <b>probabilidad de que la persona actúe</b> y la calidad. ' +
             'Por eso un anunciante que ofrece la mitad puede ganarle a otro si su anuncio tiene cuatro veces más tasa de clic. ' +
             'Y de ahí sale la conclusión más importante: <b>mejorar el anuncio baja tu costo, subir la puja lo sube por definición</b>.' },

        { p: '¿Por qué a la plataforma le conviene ese modelo?',
          r: 'Porque cobra <b>cuando pasa algo</b> —un clic, una conversión— no por mostrar. Un anuncio que nadie mira no le genera ingresos aunque el ' +
             'anunciante ofrezca mucho. Y si muestra anuncios malos, la gente usa menos la plataforma. ' +
             'Los intereses quedan alineados: a la plataforma le conviene mostrar el anuncio que a la gente le va a interesar, ' +
             'que es exactamente lo que también te conviene a vos.' },

        { p: '¿Qué es la fase de aprendizaje y qué implica para la estructura de la cuenta?',
          r: 'Es el período en que la plataforma junta datos para estimar la probabilidad de acción; mientras tanto muestra de forma más aleatoria y ' +
             'el rendimiento es peor. Meta pide del orden de <b>cincuenta conversiones del evento optimizado en siete días</b>. ' +
             'La implicancia estructural es enorme: si dividís el presupuesto en ocho conjuntos, <b>ninguno junta datos suficientes</b> y los ocho ' +
             'quedan aprendiendo para siempre. <b>Menos campañas con más presupuesto rinden mucho más</b>, aunque parezca que probás menos cosas.' },

        { p: '¿Por qué la página de destino afecta el costo del medio?',
          r: 'Porque forma parte del nivel de calidad. Si alguien busca "zapatillas running mujer" y cae en la home, la experiencia es mala, ' +
             'el nivel de calidad baja y <b>pagás más por cada clic en todas las subastas de esa palabra</b>. ' +
             'Por eso mandar el tráfico a la página correcta no es solo una mejora de conversión: <b>es un descuento directo en el costo del medio</b>. ' +
             'Es el error más común, y el que más gente trata como un tema ajeno a la campaña.' },
      ],

      practica: `
<h4>Diagnóstico: ¿costo alto por puja o por calidad?</h4>
<pre><code>Si tu costo por clic sube y no cambiaste la puja:
  · ¿Bajó el CTR?          → problema de creativo o de relevancia
  · ¿Bajó el nivel de calidad? → mirá los tres componentes
  · ¿Entraron competidores?    → sube el piso de la subasta

Si tu costo por clic es mucho mayor que el de la competencia:
  · Casi siempre es CTR bajo, no puja baja.</code></pre>

<div class="aviso"><strong>El reflejo equivocado ante un costo alto es subir la puja.</strong> Eso te hace
ganar más subastas al precio que ya te parecía caro. El reflejo correcto es <b>preguntarse por qué la gente no
está haciendo clic</b>: casi siempre el anuncio no dice lo que la persona buscaba.</div>

<h4>Ver el nivel de calidad en Google Ads</h4>
<pre><code>Campañas → Palabras clave → columnas:
  · Nivel de calidad
  · CTR esperado          (por encima / promedio / por debajo)
  · Relevancia del anuncio
  · Experiencia en la página de destino

Cualquiera "por debajo del promedio" es una tarea concreta.</code></pre>

<h4>El cálculo que conviene hacer antes de empezar</h4>
<pre><code>Ticket promedio                 $ 40.000
Margen                                35%   →  $ 14.000 de ganancia por venta
Tasa de conversión de la página        2%

Cuánto puedo pagar por clic:
  $ 14.000 × 2% = $ 280 por clic, para quedar en cero
  Para ganar algo: pagar como mucho $ 150-180 por clic

Si el CPC del rubro es $ 400, esta campaña NO cierra
  → subir la conversión, subir el ticket, o cambiar de canal</code></pre>

<div class="dato"><strong>Este cálculo de tres líneas evita la mayoría de las campañas que fracasan.</strong>
Muchísimos anunciantes descubren recién a los dos meses que <b>los números nunca podían cerrar</b>, sin importar
cuán bien estuviera hecha la campaña.</div>

<h4>Estructura mínima para no partir el aprendizaje</h4>
<table>
<tr><th>Presupuesto mensual</th><th>Campañas activas</th></tr>
<tr><td>Menos de 500 USD</td><td><b>1</b></td></tr>
<tr><td>500 - 2.000 USD</td><td>1-2</td></tr>
<tr><td>2.000 - 10.000 USD</td><td>2-4</td></tr>
<tr><td>Más de 10.000 USD</td><td>Segmentar por producto o mercado</td></tr>
</table>
`,

      errores: [
        { mito: 'Si subo la puja, gano más subastas y bajo el costo por resultado.',
          realidad: 'Ganás más subastas <b>al precio que ya te parecía caro</b>. Lo que baja el costo es subir la <b>probabilidad de acción</b>: ' +
                    'mejor anuncio, mejor página, mejor coincidencia con lo que la persona buscaba.' },

        { mito: 'La página de destino es un tema aparte de la campaña.',
          realidad: 'Es parte del <b>nivel de calidad</b>. Una página que no responde a lo que la persona buscó te hace pagar más por clic ' +
                    'en todas las subastas de esa palabra. Es un descuento en el costo del medio, no solo una mejora de conversión.' },

        { mito: 'Cuantas más campañas, más aprendo.',
          realidad: 'Si el presupuesto se divide en ocho, <b>ninguna junta datos suficientes</b> y las ocho quedan aprendiendo para siempre. ' +
                    'Menos campañas con más presupuesto rinden mucho más.' },

        { mito: 'Optimizo la campaña todos los días.',
          realidad: 'Editar cosas significativas <b>reinicia la fase de aprendizaje</b>. Tocar todos los días es garantizar que la campaña ' +
                    'nunca salga de aprendizaje y siempre rinda peor de lo que podría.' },
      ],

      glosario: [
        { t: 'Subasta', d: 'Proceso instantáneo que decide qué anuncio se muestra a una persona concreta.' },
        { t: 'Puja', d: 'Lo máximo que estás dispuesto a pagar. No es lo que terminás pagando.' },
        { t: 'Ad Rank', d: 'Puntaje de Google que combina puja, CTR esperado y calidad.' },
        { t: 'Nivel de calidad', d: 'Estimación de 1 a 10 de la relevancia de tu anuncio para una palabra clave.' },
        { t: 'CTR', d: 'Porcentaje de personas que hacen clic al ver el anuncio.' },
        { t: 'Fase de aprendizaje', d: 'Período en que la plataforma junta datos y el rendimiento es inestable.' },
        { t: 'Impresión', d: 'Una vez que el anuncio se muestra.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Las métricas que importan y las que distraen',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> hay métricas que sirven para <b>diagnosticar</b> y
métricas que sirven para <b>decidir</b>. Confundirlas es la causa número uno de campañas que "andan bien" y no
generan plata.</div>

<h4>Las métricas de decisión</h4>
<table>
<tr><th>Métrica</th><th>Qué responde</th></tr>
<tr><td><b>CPA</b> — costo por adquisición</td><td>¿Cuánto me sale conseguir un cliente?</td></tr>
<tr><td><b>ROAS</b> — retorno sobre la inversión publicitaria</td><td>¿Cuánta facturación genera cada peso?</td></tr>
<tr><td><b>CAC</b> — costo de adquisición de cliente</td><td>Lo mismo que CPA, mirado desde el negocio</td></tr>
</table>

<h4>Las métricas de diagnóstico</h4>
<table>
<tr><th>Métrica</th><th>Para qué sirve</th></tr>
<tr><td><b>CPM</b> — costo por mil impresiones</td><td>Si sube, el público es más caro o el creativo peor</td></tr>
<tr><td><b>CTR</b></td><td>Si baja, el anuncio no conecta</td></tr>
<tr><td><b>CPC</b></td><td>Combinación de los dos anteriores</td></tr>
<tr><td><b>Tasa de conversión</b></td><td>Si baja, el problema está después del clic</td></tr>
</table>

<div class="aviso"><strong>La trampa: las de diagnóstico son las que te muestra la plataforma en grande.</strong>
Una campaña puede tener CTR excelente, CPC bajísimo y CPM barato, y <b>no vender nada</b>. Si mirás solo esas,
la campaña "anda bien" — y la conversación con el cliente se vuelve imposible cuando pregunta por las ventas.</div>

<h4>La cadena, que explica dónde está el problema</h4>
<pre><code>impresiones → clics → visitas → carritos → compras
              ↑CTR    ↑       ↑TC        ↑

Si el CTR es bajo         → el anuncio no conecta con el público
Si el CTR es bueno y la
  tasa de conversión baja → el problema está en la página, no en la campaña
Si todo anda y el CPA
  igual es alto           → el margen no da: revisá el negocio, no el anuncio</code></pre>

<p>Esa cadena convierte "la campaña anda mal" en una pregunta específica con una respuesta accionable.</p>

<h4>ROAS: el número que más se malinterpreta</h4>
<p>Un ROAS de 3 significa que por cada peso invertido volvieron tres <b>de facturación</b> — no de ganancia. Si
tu margen es del 30%, esos tres pesos son <b>90 centavos</b> de margen contra un peso de inversión:
<b>estás perdiendo</b>.</p>
`,

      tecnico: `
<h4>El ROAS de equilibrio</h4>
<pre><code>ROAS de equilibrio = 1 / margen

Margen 20%  →  necesitás ROAS 5,0 para no perder
Margen 35%  →  necesitás ROAS 2,9
Margen 50%  →  necesitás ROAS 2,0
Margen 70%  →  necesitás ROAS 1,4</code></pre>

<div class="dato"><strong>Este cálculo cambia por completo la conversación con un cliente.</strong> "Tenemos
ROAS 3" suena bien en abstracto; con margen del 20% significa perder plata en cada venta. ' +
<b>Sin conocer el margen, ningún ROAS se puede interpretar</b> — y sin embargo se reporta así todo el tiempo.</div>

<h4>Y la corrección que casi nadie hace</h4>
<p>El ROAS de equilibrio calculado así ignora que el cliente puede volver a comprar. Con recurrencia:</p>
<pre><code>Si el 30% de los clientes compra una segunda vez,
el valor real de una adquisición es ~1,3 veces la primera compra.

→ podés aceptar un ROAS de primera compra más bajo,
   siempre que MIDAS la recompra en vez de suponerla.</code></pre>

<div class="dato"><strong>La palabra clave es "midas".</strong> Muchísimos anunciantes justifican un ROAS malo
con "pero los clientes vuelven", sin ningún dato que lo respalde. <b>Si no podés mostrar la tasa de recompra
real, ese argumento es una excusa</b>, no una métrica.</div>

<h4>El período de análisis</h4>
<table>
<tr><th>Ventana</th><th>Para qué</th><th>Cuidado</th></tr>
<tr><td>Diaria</td><td>Detectar que algo se rompió</td><td><b>No decidas</b>: el ruido domina</td></tr>
<tr><td>7 días</td><td>Tendencias de creativo</td><td>Ojo con la estacionalidad semanal</td></tr>
<tr><td>28-30 días</td><td><b>Decisiones</b></td><td>La ventana correcta para casi todo</td></tr>
<tr><td>90 días</td><td>Estrategia y estacionalidad</td><td>—</td></tr>
</table>

<div class="dato"><strong>Mirar el rendimiento diario y reaccionar es la forma más rápida de arruinar una
campaña.</strong> Un día malo casi siempre es azar: con pocas conversiones diarias, la variación natural es
enorme. Reaccionar a ese ruido apagando y prendiendo cosas <b>reinicia el aprendizaje</b> y hace que el
rendimiento real empeore — con lo cual la reacción parece justificada.</div>

<h4>Significancia: cuántos datos hacen falta</h4>
<pre><code>Para comparar dos creativos con confianza razonable:
  · al menos 100 conversiones por variante, o
  · al menos 1.000 clics por variante si mirás CTR

Con 12 conversiones contra 9, NO hay diferencia: hay ruido.</code></pre>

<div class="dato"><strong>Es el error más caro del testeo.</strong> Se declara ganador al creativo con "40% más
conversiones" cuando la diferencia es de doce contra nueve — y se apaga el otro, que quizás era mejor. ' +
<b>Repetido durante meses, se optimiza hacia el azar.</b></div>

<h4>Métricas de vanidad, sin vueltas</h4>
<pre><code>✘ Impresiones            no sirven para decidir nada
✘ Alcance                útil solo en campañas de marca con medición aparte
✘ Interacciones          los "me gusta" no pagan sueldos
✘ Reproducciones de 3 s  es scroll, no interés
✔ Reproducciones al 75%  eso sí es atención real</code></pre>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="mt1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA CADENA — convierte “la campaña anda mal” en una pregunta específica</text>

  <rect x="24" y="34" width="112" height="34" rx="7" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="80" y="55" text-anchor="middle" fill="currentColor" opacity=".75" font-size="9.5">impresiones</text>
  <line x1="140" y1="51" x2="152" y2="51" stroke="currentColor" stroke-width="1.3" marker-end="url(#mt1)"/>
  <text x="146" y="42" text-anchor="middle" fill="#fbbf24" font-size="8" font-weight="700">CTR</text>

  <rect x="156" y="34" width="112" height="34" rx="7" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="212" y="55" text-anchor="middle" fill="currentColor" opacity=".75" font-size="9.5">clics</text>
  <line x1="272" y1="51" x2="284" y2="51" stroke="currentColor" stroke-width="1.3" marker-end="url(#mt1)"/>

  <rect x="288" y="34" width="112" height="34" rx="7" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="344" y="55" text-anchor="middle" fill="currentColor" opacity=".75" font-size="9.5">visitas</text>
  <line x1="404" y1="51" x2="416" y2="51" stroke="currentColor" stroke-width="1.3" marker-end="url(#mt1)"/>
  <text x="410" y="42" text-anchor="middle" fill="#fbbf24" font-size="8" font-weight="700">TC</text>

  <rect x="420" y="34" width="112" height="34" rx="7" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.1"/>
  <text x="476" y="55" text-anchor="middle" fill="currentColor" opacity=".75" font-size="9.5">carritos</text>
  <line x1="536" y1="51" x2="548" y2="51" stroke="currentColor" stroke-width="1.3" marker-end="url(#mt1)"/>

  <rect x="552" y="34" width="104" height="34" rx="7" fill="#34d399" fill-opacity=".25" stroke="#34d399" stroke-width="1.4"/>
  <text x="604" y="55" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">compras</text>

  <rect x="24" y="80" width="632" height="66" rx="10" fill="currentColor" fill-opacity=".05" stroke="currentColor" stroke-opacity=".25"/>
  <text x="44" y="100" fill="currentColor" opacity=".75" font-size="10.5">CTR bajo</text>
  <text x="240" y="100" fill="#fbbf24" font-size="10.5" font-weight="700">→ el anuncio no conecta con el público</text>
  <text x="44" y="120" fill="currentColor" opacity=".75" font-size="10.5">CTR bueno, conversión baja</text>
  <text x="240" y="120" fill="#22d3ee" font-size="10.5" font-weight="700">→ el problema está en la PÁGINA, no en la campaña</text>
  <text x="44" y="140" fill="currentColor" opacity=".75" font-size="10.5">todo bien y el CPA alto</text>
  <text x="240" y="140" fill="#f87171" font-size="10.5" font-weight="700">→ el margen no da: revisá el negocio, no el anuncio</text>

  <line x1="24" y1="164" x2="656" y2="164" stroke="currentColor" opacity=".18"/>

  <text x="24" y="188" fill="#f87171" font-size="12" font-weight="700">
    EL ROAS NO SE PUEDE INTERPRETAR SIN EL MARGEN</text>

  <rect x="24" y="200" width="152" height="56" rx="9" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.5"/>
  <text x="100" y="220" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">margen 20%</text>
  <text x="100" y="240" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">necesitás ROAS 5,0</text>

  <rect x="188" y="200" width="152" height="56" rx="9" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="264" y="220" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">margen 35%</text>
  <text x="264" y="240" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">ROAS 2,9</text>

  <rect x="352" y="200" width="152" height="56" rx="9" fill="#34d399" fill-opacity=".18" stroke="#34d399" stroke-width="1.3"/>
  <text x="428" y="220" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">margen 50%</text>
  <text x="428" y="240" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">ROAS 2,0</text>

  <rect x="516" y="200" width="140" height="56" rx="9" fill="#34d399" fill-opacity=".22" stroke="#34d399" stroke-width="1.3"/>
  <text x="586" y="220" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">margen 70%</text>
  <text x="586" y="240" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">ROAS 1,4</text>

  <rect x="24" y="266" width="632" height="30" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="286" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    “Tenemos ROAS 3” suena bien. Con margen 20%, es perder plata en cada venta.</text>

  <rect x="24" y="308" width="304" height="78" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="328" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">MIRAR EL DÍA A DÍA Y REACCIONAR</text>
  <text x="44" y="348" fill="currentColor" opacity=".72" font-size="10.5">Un día malo casi siempre es azar.</text>
  <text x="44" y="366" fill="#f87171" font-size="10.5" font-weight="700">Reaccionar reinicia el aprendizaje…</text>
  <text x="44" y="380" fill="#f87171" font-size="10.5" font-weight="700">…y el rendimiento empeora de verdad.</text>

  <rect x="352" y="308" width="304" height="78" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="504" y="328" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">12 CONTRA 9 NO ES UNA DIFERENCIA</text>
  <text x="372" y="348" fill="currentColor" opacity=".72" font-size="10.5">Hacen falta ~100 conversiones por variante.</text>
  <text x="372" y="368" fill="#fbbf24" font-size="10.5" font-weight="700">Declarar ganadores con ruido, mes tras mes,</text>
  <text x="372" y="382" fill="#fbbf24" font-size="10.5" font-weight="700">es optimizar hacia el azar.</text>
</svg>`,
        pie: 'Las métricas de diagnóstico son las que la plataforma te muestra en grande. Las de decisión hay que buscarlas.',
      },

      entrevista: [
        { p: '¿Qué diferencia hay entre métricas de decisión y de diagnóstico?',
          r: 'Las de <b>decisión</b> —CPA, ROAS, CAC— responden si el negocio cierra. Las de <b>diagnóstico</b> —CPM, CTR, CPC, tasa de conversión— ' +
             'dicen dónde está el problema. La trampa es que las de diagnóstico son las que <b>la plataforma te muestra en grande</b>: ' +
             'una campaña puede tener CTR excelente, CPC bajísimo y CPM barato y <b>no vender nada</b>. ' +
             'Si mirás solo esas, la campaña "anda bien" hasta que el cliente pregunta por las ventas.' },

        { p: '¿Cómo se interpreta un ROAS?',
          r: 'No se puede interpretar <b>sin conocer el margen</b>. El ROAS de equilibrio es <b>uno dividido el margen</b>: con margen del 20% ' +
             'necesitás ROAS 5 para no perder; con 50%, ROAS 2. Por eso "tenemos ROAS 3" suena bien en abstracto y, con margen del 20%, ' +
             'significa perder plata en cada venta. Y si alguien justifica un ROAS bajo diciendo "pero los clientes vuelven", ' +
             'eso solo vale <b>si puede mostrar la tasa de recompra real</b>; si no, es una excusa, no una métrica.' },

        { p: '¿En qué ventana de tiempo se toman decisiones?',
          r: 'En <b>28 a 30 días</b> para casi todo. La vista diaria sirve para detectar que algo se rompió, no para decidir: con pocas conversiones ' +
             'por día la variación natural es enorme, y un día malo casi siempre es azar. Reaccionar a ese ruido apagando y prendiendo cosas ' +
             '<b>reinicia el aprendizaje</b> y hace que el rendimiento empeore de verdad — con lo cual la reacción parece justificada, ' +
             'y se entra en un ciclo.' },

        { p: '¿Cuántos datos hacen falta para declarar un ganador entre dos creativos?',
          r: 'Del orden de <b>cien conversiones por variante</b>, o mil clics si estás comparando CTR. El error más caro del testeo es declarar ganador ' +
             'al que tiene "40% más conversiones" cuando la diferencia es <b>doce contra nueve</b> — eso es ruido, no señal. ' +
             'Y repetido durante meses, apagando al perdedor cada vez, <b>se termina optimizando hacia el azar</b> ' +
             'y descartando creativos que en realidad eran mejores.' },
      ],

      practica: `
<h4>El tablero que sirve, en cinco filas</h4>
<pre><code>Ventana: últimos 30 días

Inversión              $ ______
Conversiones           ______
CPA                    $ ______   ← ¿menor que mi CPA objetivo?
ROAS                   ______     ← ¿mayor que 1/margen?
Tasa de conversión     ______ %   ← si cayó, mirá la página

Y para diagnóstico, si algo anda mal:
CPM · CTR · CPC        ← en ese orden</code></pre>

<h4>Calcular tu CPA objetivo</h4>
<pre><code>Ticket promedio                       $ 40.000
Margen bruto                                35%  →  $ 14.000
Compras promedio por cliente (12 meses)      1,4  →  $ 19.600 de valor

CPA máximo para no perder:     $ 19.600
CPA objetivo (dejando margen): $ 9.000 - 12.000

Si tu CPA es $ 25.000 → la campaña destruye valor, por bien hecha que esté.</code></pre>

<div class="aviso"><strong>El "1,4" de ese cálculo tiene que salir de tus datos, no de una estimación
optimista.</strong> Es el número que más se infla para justificar campañas que no cierran. Si no lo podés
medir, usá 1,0 y decidí con eso — conservador y real es mejor que optimista e inventado.</div>

<h4>Test con significancia, en la práctica</h4>
<pre><code>Creativo A: 1.200 clics, 48 conversiones  → 4,0%
Creativo B: 1.150 clics, 39 conversiones  → 3,4%

¿Es A mejor? Con esos números, la diferencia está dentro del ruido.
Hace falta más volumen, o aceptar que son equivalentes.

Regla práctica: si la diferencia es menor al 20% y tenés
menos de 100 conversiones por variante, NO decidas todavía.</code></pre>

<h4>Alertas que sí sirven</h4>
<table>
<tr><th>Condición</th><th>Qué revisar</th></tr>
<tr><td>Cero conversiones en 24 h con inversión normal</td><td>La medición se rompió</td></tr>
<tr><td>CPA 50% arriba del objetivo, 7 días</td><td>Creativo o competencia</td></tr>
<tr><td>CTR cayó más del 30% en 7 días</td><td>Fatiga creativa</td></tr>
<tr><td>CPM subió más del 40%</td><td>Público chico o más competencia</td></tr>
<tr><td>La inversión no se gasta</td><td>Puja o público demasiado acotado</td></tr>
</table>

<div class="dato"><strong>La primera fila es la más importante y la que casi nadie configura.</strong> Cero
conversiones con inversión normal casi nunca significa "hoy no compró nadie": significa que <b>se rompió la
medición</b> — un despliegue que sacó el píxel, un cambio en la página de gracias. Sin esa alerta se pueden
perder semanas de datos.</div>
`,

      errores: [
        { mito: 'La campaña anda bien: el CTR es altísimo y el CPC bajísimo.',
          realidad: 'Esas son métricas de <b>diagnóstico</b>. Una campaña puede tener los mejores números de plataforma y <b>no vender nada</b>. ' +
                    'Lo que decide es CPA y ROAS contra tu margen.' },

        { mito: 'ROAS 3 es un buen resultado.',
          realidad: 'Depende del margen. Con 20% de margen, ROAS 3 es <b>perder plata en cada venta</b>. El ROAS de equilibrio es 1 dividido el margen.' },

        { mito: 'Reviso las campañas todos los días para optimizar.',
          realidad: 'Un día malo casi siempre es azar. Reaccionar <b>reinicia el aprendizaje</b> y empeora el rendimiento real, ' +
                    'lo que hace que la reacción parezca justificada. Se decide con ventanas de 28-30 días.' },

        { mito: 'El creativo A tiene 40% más conversiones: es el ganador.',
          realidad: 'Si son 12 contra 9, es <b>ruido</b>. Hacen falta del orden de 100 conversiones por variante. Declarar ganadores con ruido, ' +
                    'mes tras mes, es optimizar hacia el azar.' },
      ],

      glosario: [
        { t: 'CPA', d: 'Costo por adquisición: cuánto sale conseguir una conversión.' },
        { t: 'ROAS', d: 'Facturación generada por cada peso invertido. Se interpreta contra el margen.' },
        { t: 'ROAS de equilibrio', d: 'Uno dividido el margen. Debajo de ese número se pierde plata.' },
        { t: 'CPM', d: 'Costo por mil impresiones. Métrica de diagnóstico.' },
        { t: 'CTR', d: 'Clics sobre impresiones. Indica si el anuncio conecta.' },
        { t: 'Tasa de conversión', d: 'Compras sobre visitas. Indica si el problema está después del clic.' },
        { t: 'Significancia', d: 'Cantidad de datos necesaria para que una diferencia no sea azar.' },
        { t: 'Métrica de vanidad', d: 'La que se ve bien y no sirve para decidir nada.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'El embudo y qué pedirle a cada etapa',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> pedirle una venta a alguien que nunca escuchó tu
marca es como proponer casamiento en la primera cita. Cada etapa tiene <b>una pregunta distinta</b>.</div>

<h4>Las tres etapas</h4>
<table>
<tr><th>Etapa</th><th>Quién es</th><th>Qué le pedís</th><th>Qué medís</th></tr>
<tr><td><b>Frío</b></td><td>No te conoce</td><td>Que te preste atención</td><td>Alcance, visualizaciones, CPM</td></tr>
<tr><td><b>Tibio</b></td><td>Interactuó, no compró</td><td>Que considere</td><td>Visitas, carritos</td></tr>
<tr><td><b>Caliente</b></td><td>Estuvo a punto</td><td>Que cierre</td><td>Compras, ROAS</td></tr>
</table>

<div class="aviso"><strong>El error más común es medir todas las etapas con la misma vara.</strong> Una
campaña de público frío casi nunca va a tener buen ROAS directo — y no significa que esté mal: significa que
está haciendo su trabajo, que es <b>llenar el público tibio</b> para que las campañas de abajo funcionen.</div>

<h4>Por qué el remarketing "anda tan bien"</h4>
<p>Las campañas de público caliente siempre muestran los mejores números. Y hay una razón incómoda: esas
personas <b>ya te conocían y probablemente iban a comprar igual</b>.</p>
<p>Eso no significa que el remarketing no sirva. Significa que <b>parte de sus ventas no las generó</b>, solo se
las atribuyó — y por eso una cuenta que solo hace remarketing muestra números espectaculares mientras el
negocio no crece.</p>

<h4>La proporción que funciona</h4>
<pre><code>Marca establecida, público tibio grande
  60% frío · 25% tibio · 15% caliente

Marca nueva
  75% frío · 20% tibio · 5% caliente

Campaña de temporada corta
  40% frío · 30% tibio · 30% caliente</code></pre>

<div class="dato"><strong>La tentación permanente es mover todo hacia el caliente, porque los números
mejoran.</strong> Y funciona… durante seis semanas. Después el público tibio se agota, no entra gente nueva,
y las campañas de abajo se quedan sin a quién mostrarle. <b>El frío es lo que hace posible al resto.</b></div>
`,

      tecnico: `
<h4>Qué pedirle a cada etapa, en concreto</h4>
<pre><code>FRÍO
  Objetivo         alcance, reproducciones de video, tráfico o conversiones amplias
  Creativo         gancho fuerte, problema antes que producto
  Métrica          costo por reproducción al 75% · costo por visita
  NO le pidas      ROAS directo alto

TIBIO
  Público          visitaron, vieron el 50% de un video, interactuaron
  Creativo         producto, diferencial, prueba social
  Métrica          costo por carrito · tasa de avance

CALIENTE
  Público          carrito abandonado, vieron el producto varias veces
  Creativo         urgencia, envío, garantía, reseña
  Métrica          ROAS · CPA</code></pre>

<div class="dato"><strong>El error de creativo más frecuente es usar el mismo en las tres etapas.</strong> Un
anuncio que muestra el producto con su precio funciona con alguien que ya te conoce y <b>es invisible</b> para
quien nunca te escuchó — porque no le da ninguna razón para frenar el scroll. ' +
La etapa fría necesita hablar del <b>problema</b>, no del producto.</div>

<h4>El tamaño del público, que decide si el embudo es posible</h4>
<pre><code>Público caliente de 200 personas → no alcanza para una campaña
Público tibio de 3.000           → alcanza para 2-3 semanas
Público frío ilimitado           → siempre disponible

Regla: si el público es menor a ~10.000, no le pongas
       una campaña propia. Sumalo a otra.</code></pre>

<div class="dato"><strong>Un público chico con presupuesto propio produce dos problemas a la vez:</strong>
nunca sale de la fase de aprendizaje, y <b>satura</b> — le mostrás el mismo anuncio a las mismas 200 personas
diez veces por semana. Eso quema el público y sube el CPM, porque la plataforma tiene que insistir cada vez
más para gastar el presupuesto.</div>

<h4>La frecuencia, y cuándo empieza a doler</h4>
<table>
<tr><th>Frecuencia semanal</th><th>Qué significa</th></tr>
<tr><td>1-2</td><td>Sano</td></tr>
<tr><td>3-4</td><td>Aceptable en público caliente</td></tr>
<tr><td>5-7</td><td>Empieza la fatiga: el CTR baja</td></tr>
<tr><td>Más de 8</td><td>Estás quemando el público</td></tr>
</table>

<h4>La medición entre etapas</h4>
<p>El indicador más útil del embudo no es el ROAS de cada etapa: es la <b>tasa de avance</b> entre una y otra.</p>
<pre><code>De frío a tibio    ¿cuánta gente nueva entró al público tibio este mes?
De tibio a caliente ¿cuánta llegó al carrito?
De caliente a venta ¿cuánta compró?

Si el público tibio no crece, el embudo se está secando
aunque el ROAS de hoy se vea bien.</code></pre>

<div class="dato"><strong>Ese último indicador es el que anticipa la caída con un mes de
anticipación.</strong> Cuando el público tibio deja de crecer, el rendimiento todavía se ve bien porque las
campañas calientes siguen cosechando lo que queda. La caída llega después, y ahí ya perdiste un mes.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="em1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <path d="M 120 40 L 560 40 L 470 130 L 210 130 Z" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="340" y="70" text-anchor="middle" fill="#22d3ee" font-size="12" font-weight="700">FRÍO — no te conoce</text>
  <text x="340" y="90" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">pedile ATENCIÓN · hablá del problema</text>
  <text x="340" y="110" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">NO le pidas ROAS directo</text>

  <path d="M 210 136 L 470 136 L 420 216 L 260 216 Z" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="164" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">TIBIO — interactuó</text>
  <text x="340" y="184" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">pedile CONSIDERACIÓN</text>
  <text x="340" y="204" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">producto · diferencial · prueba social</text>

  <path d="M 260 222 L 420 222 L 390 292 L 290 292 Z" fill="#34d399" fill-opacity=".22" stroke="#34d399" stroke-width="1.5"/>
  <text x="340" y="248" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">CALIENTE</text>
  <text x="340" y="268" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">pedile el CIERRE</text>
  <text x="340" y="285" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">ROAS · CPA</text>

  <rect x="24" y="40" width="82" height="176" rx="8" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-opacity=".4"/>
  <text x="65" y="60" text-anchor="middle" fill="#7c5cff" font-size="9.5" font-weight="700">PROPORCIÓN</text>
  <text x="65" y="82" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">60%</text>
  <text x="65" y="98" text-anchor="middle" fill="currentColor" opacity=".55" font-size="8">frío</text>
  <text x="65" y="126" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">25%</text>
  <text x="65" y="142" text-anchor="middle" fill="currentColor" opacity=".55" font-size="8">tibio</text>
  <text x="65" y="170" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">15%</text>
  <text x="65" y="186" text-anchor="middle" fill="currentColor" opacity=".55" font-size="8">caliente</text>
  <text x="65" y="208" text-anchor="middle" fill="currentColor" opacity=".5" font-size="8">marca establecida</text>

  <rect x="574" y="40" width="82" height="176" rx="8" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-opacity=".5"/>
  <text x="615" y="60" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">LA TENTACIÓN</text>
  <text x="615" y="86" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">mover todo</text>
  <text x="615" y="100" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">al caliente</text>
  <text x="615" y="126" text-anchor="middle" fill="currentColor" opacity=".65" font-size="8.5">los números</text>
  <text x="615" y="138" text-anchor="middle" fill="currentColor" opacity=".65" font-size="8.5">mejoran…</text>
  <text x="615" y="162" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">…6 semanas</text>
  <text x="615" y="184" text-anchor="middle" fill="#f87171" font-size="8.5" font-weight="700">después el tibio</text>
  <text x="615" y="196" text-anchor="middle" fill="#f87171" font-size="8.5" font-weight="700">se agota</text>

  <rect x="24" y="304" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="325" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    El remarketing muestra los mejores números porque esas personas probablemente iban a comprar igual.</text>

  <rect x="24" y="348" width="632" height="38" rx="9" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.5"/>
  <text x="44" y="366" fill="#34d399" font-size="11.5" font-weight="700">EL INDICADOR QUE ANTICIPA LA CAÍDA CON UN MES DE VENTAJA</text>
  <text x="44" y="381" fill="currentColor" opacity=".78" font-size="11">
    ¿Cuánta gente nueva entró al público tibio este mes? Si deja de crecer, el embudo se está secando aunque el ROAS de hoy se vea bien.</text>
</svg>`,
        pie: 'Una campaña de frío con ROAS bajo no está fallando: está llenando el público que hace posible al resto.',
      },

      entrevista: [
        { p: '¿Por qué no se puede medir todas las etapas del embudo con la misma vara?',
          r: 'Porque cada etapa tiene una <b>pregunta distinta</b>. Una campaña de público frío casi nunca va a tener buen ROAS directo, ' +
             'y eso no significa que esté mal: significa que está haciendo su trabajo, que es <b>llenar el público tibio</b> ' +
             'para que las campañas de abajo funcionen. Medirla por ROAS lleva a apagarla — y ahí el embudo entero se seca.' },

        { p: '¿Por qué el remarketing siempre muestra los mejores números?',
          r: 'Porque esas personas <b>ya te conocían y probablemente iban a comprar igual</b>. Parte de esas ventas el remarketing no las generó: ' +
             'se las atribuyó. Eso no significa que no sirva, sino que una cuenta que <b>solo</b> hace remarketing muestra números espectaculares ' +
             'mientras el negocio no crece. Es el caso más claro de la diferencia entre atribución e incrementalidad.' },

        { p: '¿Qué pasa si movés todo el presupuesto al público caliente?',
          r: 'Los números mejoran <b>durante unas seis semanas</b>. Después el público tibio se agota porque no entra gente nueva, ' +
             'y las campañas de abajo se quedan sin a quién mostrarle. La proporción que funciona en una marca establecida es del orden de ' +
             '<b>60% frío, 25% tibio, 15% caliente</b> — y en una marca nueva, todavía más frío. ' +
             'El frío es lo que hace posible al resto.' },

        { p: '¿Cuál es el indicador que anticipa una caída de rendimiento?',
          r: 'La <b>tasa de avance entre etapas</b>, y en particular cuánta gente nueva entra al público tibio cada mes. ' +
             'Cuando ese número deja de crecer, el rendimiento todavía se ve bien porque las campañas calientes siguen cosechando lo que queda — ' +
             'la caída llega <b>un mes después</b>, y para entonces ya perdiste ese mes. Es la métrica que más anticipa y la que casi nadie mira.' },
      ],

      practica: `
<h4>Estructura de embudo mínima</h4>
<pre><code>CAMPAÑA 1 — Frío  (60% del presupuesto)
  Público          amplio o similares, sin excluir nada raro
  Objetivo         conversiones (o reproducciones si el presupuesto es chico)
  Creativo         3-5 variantes con ganchos distintos
  Éxito            costo por visita nueva · crecimiento del público tibio

CAMPAÑA 2 — Tibio (25%)
  Público          visitaron el sitio en 30 días · vieron 50% de un video
  Exclusión        compradores de 90 días
  Creativo         producto, diferencial, reseñas
  Éxito            costo por carrito

CAMPAÑA 3 — Caliente (15%)
  Público          carrito abandonado 7 días · vieron producto 3+ veces
  Exclusión        compradores
  Creativo         urgencia, envío, garantía
  Éxito            ROAS</code></pre>

<div class="aviso"><strong>Las exclusiones son lo que más se olvida y lo que más plata desperdicia.</strong>
Sin excluir compradores recientes, les seguís mostrando el anuncio de un producto que <b>ya compraron</b> — ' +
gastando presupuesto y, peor, generando la sensación de que la marca no sabe con quién está hablando.</div>

<h4>Tamaño mínimo de público</h4>
<pre><code>Menos de 1.000    no le pongas campaña propia
1.000 - 10.000    sumalo a otra campaña
10.000 - 100.000  campaña propia, presupuesto acotado
Más de 100.000    campaña propia sin problema</code></pre>

<h4>Vigilar la frecuencia</h4>
<pre><code>En Meta: columna "Frecuencia", ventana de 7 días

  &lt; 2      sano
  3-4      aceptable en caliente
  5-7      fatiga: el CTR está bajando
  &gt; 8      estás quemando el público

Si sube rápido: el público es chico para ese presupuesto.
Bajá el presupuesto o ampliá el público.</code></pre>

<h4>Seguimiento del embudo, mes a mes</h4>
<table>
<tr><th>Mes</th><th>Visitas nuevas</th><th>Público tibio</th><th>Carritos</th><th>Compras</th></tr>
<tr><td>Enero</td><td>12.000</td><td>8.500</td><td>640</td><td>180</td></tr>
<tr><td>Febrero</td><td>11.500</td><td>8.700</td><td>620</td><td>175</td></tr>
<tr><td>Marzo</td><td><b>7.200</b></td><td><b>6.100</b></td><td>580</td><td>170</td></tr>
</table>

<div class="dato"><strong>Mirá marzo: las compras casi no bajaron, pero las visitas nuevas cayeron un
37%.</strong> El rendimiento de abril va a caer con seguridad, y en el informe de marzo eso <b>todavía no se
ve</b> si solo mirás ventas. Ese es exactamente el mes en que hay que actuar.</div>
`,

      errores: [
        { mito: 'La campaña de público frío tiene ROAS bajo: la apago.',
          realidad: 'Su trabajo no es vender directo: es <b>llenar el público tibio</b>. Apagarla mejora los números un mes y seca el embudo ' +
                    'al siguiente.' },

        { mito: 'El remarketing es lo que más vende, así que le pongo todo el presupuesto.',
          realidad: 'Muestra los mejores números porque esas personas <b>ya iban a comprar</b>. Sin gente nueva entrando, en seis semanas se queda ' +
                    'sin a quién mostrarle.' },

        { mito: 'Uso el mismo creativo en todas las etapas.',
          realidad: 'Un anuncio de producto con precio funciona con quien ya te conoce y es <b>invisible</b> para quien no: no le da ninguna razón ' +
                    'para frenar el scroll. La etapa fría habla del <b>problema</b>, no del producto.' },

        { mito: 'Tengo un público caliente de 300 personas: le pongo campaña propia.',
          realidad: 'Nunca sale de aprendizaje y además <b>satura</b>: el mismo anuncio diez veces por semana a las mismas personas. ' +
                    'Debajo de unos 10.000, sumalo a otra campaña.' },
      ],

      glosario: [
        { t: 'Público frío', d: 'Personas que no conocen la marca.' },
        { t: 'Público tibio', d: 'Interactuaron pero no compraron.' },
        { t: 'Público caliente', d: 'Mostraron intención clara: carrito, vistas repetidas.' },
        { t: 'Remarketing', d: 'Anuncios dirigidos a quienes ya interactuaron.' },
        { t: 'Frecuencia', d: 'Cuántas veces vio el anuncio la misma persona en un período.' },
        { t: 'Fatiga creativa', d: 'Caída del rendimiento por exceso de repetición.' },
        { t: 'Tasa de avance', d: 'Proporción que pasa de una etapa del embudo a la siguiente.' },
        { t: 'Exclusión', d: 'Público que no debe ver una campaña, como compradores recientes.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Atribución: por qué los números nunca coinciden',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> si sumás las ventas que reporta cada plataforma,
te va a dar <b>más de lo que realmente vendiste</b>. Y eso no es un error: es cómo funciona.</div>

<h4>Por qué pasa</h4>
<p>Una persona ve un anuncio en Instagram, después busca tu marca en Google, entra por el enlace patrocinado, y
compra. <b>Las dos plataformas se atribuyen esa venta</b>, porque las dos participaron.</p>
<pre><code>Meta reporta:   40 ventas
Google reporta: 35 ventas
Tu sistema:     58 ventas reales

40 + 35 = 75 ≠ 58   ← y ninguno está mintiendo</code></pre>

<div class="aviso"><strong>El único número real es el de tu sistema.</strong> Los de las plataformas son
<b>estimaciones de contribución</b>, cada una calculada con sus reglas y sin ver lo que hicieron las otras.
Compararlas entre sí no tiene sentido; usarlas para optimizar dentro de cada plataforma, sí.</div>

<h4>Las ventanas de atribución</h4>
<p>Cada plataforma decide cuánto tiempo se atribuye una venta después de un clic o una vista:</p>
<table>
<tr><th>Plataforma</th><th>Por defecto</th></tr>
<tr><td>Meta</td><td>7 días clic + 1 día visualización</td></tr>
<tr><td>Google</td><td>30 días clic, con modelo basado en datos</td></tr>
<tr><td>TikTok</td><td>7 días clic + 1 día visualización</td></tr>
</table>

<div class="dato"><strong>Esa diferencia sola explica buena parte del desfase.</strong> Google se atribuye
ventas de hasta 30 días después; Meta, de 7. Si tu ciclo de compra es largo, Google va a parecer mucho mejor
<b>solo por su ventana</b>, sin que eso diga nada sobre su efectividad real.</div>

<h4>Y el "1 día de visualización" de Meta</h4>
<p>Significa que si alguien <b>vio</b> el anuncio —sin hacer clic— y compró en las 24 horas siguientes, Meta se
atribuye esa venta. A veces es legítimo; a veces la persona iba a comprar igual.</p>
<p>Por eso conviene mirar también <b>solo clic</b>: es un número más conservador y más comparable.</p>

<h4>Qué hacer con todo esto</h4>
<pre><code>· Para decidir CUÁNTO invertir en total → tus ventas reales
· Para decidir QUÉ hacer dentro de una plataforma → sus números
· Para comparar plataformas entre sí → ninguno de los dos alcanza
                                        (hace falta medir incrementalidad)</code></pre>
`,

      tecnico: `
<h4>Los modelos de atribución</h4>
<table>
<tr><th>Modelo</th><th>Cómo reparte</th><th>Sesgo</th></tr>
<tr><td><b>Último clic</b></td><td>Todo al último</td><td>Sobrevalora el remarketing y la marca</td></tr>
<tr><td><b>Primer clic</b></td><td>Todo al primero</td><td>Sobrevalora el descubrimiento</td></tr>
<tr><td><b>Lineal</b></td><td>Igual entre todos</td><td>Simple, poco realista</td></tr>
<tr><td><b>Decaimiento temporal</b></td><td>Más peso a lo reciente</td><td>Razonable</td></tr>
<tr><td><b>Basado en datos</b></td><td>Lo calcula la plataforma</td><td>El mejor disponible, y es una caja negra</td></tr>
</table>

<div class="dato"><strong>El de último clic es el default histórico y el más engañoso.</strong> Con ese modelo,
una campaña de marca que aparece cuando alguien ya busca tu nombre se lleva <b>todo</b> el crédito de una venta ' +
que originó una campaña de descubrimiento tres semanas antes. Es la razón principal por la que las cuentas
tienden a concentrarse en el fondo del embudo.</div>

<h4>Lo que rompió la medición: privacidad</h4>
<pre><code>· Bloqueadores de rastreo
· Restricciones de seguimiento entre apps en iOS
· Cookies de terceros desapareciendo
· Regulaciones de consentimiento

Resultado: entre el 20% y el 40% de las conversiones
NO se pueden atribuir por los métodos tradicionales.</code></pre>

<p>Las plataformas compensan con <b>modelado</b>: estiman las conversiones que no pueden ver. Eso es
razonable y significa que <b>parte de lo que reportan es una estimación</b>, no un hecho contado.</p>

<div class="dato"><strong>Por eso la medición del lado del servidor dejó de ser opcional.</strong> Enviar los
eventos desde tu backend —además del navegador— recupera buena parte de esas conversiones perdidas: ' +
no depende del navegador, ni de bloqueadores, ni de que la persona siga en la página. ' +
Es el tema del módulo siguiente y es donde un desarrollador aporta más que cualquier especialista de medios.</div>

<h4>La única medición que no miente: la incrementalidad</h4>
<p>Todo lo anterior mide <b>atribución</b>: a quién le corresponde el crédito. La pregunta que importa de verdad
es otra: <b>¿cuántas de esas ventas no habrían ocurrido sin la campaña?</b></p>
<pre><code>Prueba de apagado (la más simple y la más honesta)
  1 · Medí las ventas totales 4 semanas con la campaña encendida
  2 · Apagala 2 semanas
  3 · Compará las ventas TOTALES, no las atribuidas

Si las ventas totales no bajaron → la campaña no era incremental,
                                    aunque reportara ROAS 8.</code></pre>

<div class="dato"><strong>Esta prueba es incómoda y es la que más aprendizaje da.</strong> Es habitual que
una campaña de remarketing con ROAS espectacular resulte tener una incrementalidad mucho menor: ' +
esas personas ya estaban comprando. <b>Cuesta dos semanas de datos y puede cambiar por completo el reparto del
presupuesto.</b></div>

<h4>Lo mínimo que hay que tener</h4>
<pre><code>1 · UTM consistentes en TODO enlace pagado
2 · Ver las ventas por fuente en TU sistema, no solo en las plataformas
3 · Una pregunta de "¿cómo nos conociste?" en el checkout
4 · Comparar la suma de plataformas contra tus ventas reales, mensualmente</code></pre>

<div class="dato"><strong>El punto 3 parece anticuado y es sorprendentemente útil.</strong> Es la única señal
que no depende de cookies, ni de píxeles, ni de ventanas de atribución — y suele revelar canales que ningún
sistema estaba midiendo, como recomendaciones o comunidades.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="at1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    UN MISMO CLIENTE, DOS PLATAFORMAS QUE SE ATRIBUYEN LA VENTA</text>

  <rect x="24" y="34" width="130" height="34" rx="7" fill="#f472b6" fill-opacity=".2" stroke="#f472b6" stroke-width="1.2"/>
  <text x="89" y="55" text-anchor="middle" fill="currentColor" font-size="9.5">ve anuncio en IG</text>
  <line x1="158" y1="51" x2="176" y2="51" stroke="currentColor" stroke-width="1.3" marker-end="url(#at1)"/>
  <rect x="180" y="34" width="130" height="34" rx="7" fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-opacity=".3"/>
  <text x="245" y="55" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">busca la marca</text>
  <line x1="314" y1="51" x2="332" y2="51" stroke="currentColor" stroke-width="1.3" marker-end="url(#at1)"/>
  <rect x="336" y="34" width="130" height="34" rx="7" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="401" y="55" text-anchor="middle" fill="currentColor" font-size="9.5">clic en Google</text>
  <line x1="470" y1="51" x2="488" y2="51" stroke="currentColor" stroke-width="1.3" marker-end="url(#at1)"/>
  <rect x="492" y="34" width="130" height="34" rx="7" fill="#34d399" fill-opacity=".25" stroke="#34d399" stroke-width="1.3"/>
  <text x="557" y="55" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">COMPRA</text>

  <rect x="24" y="80" width="632" height="72" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="102" fill="currentColor" opacity=".75" font-size="11">Meta reporta <tspan font-weight="700">40</tspan> ventas · Google reporta <tspan font-weight="700">35</tspan> · tu sistema: <tspan font-weight="700" fill="#34d399">58 reales</tspan></text>
  <text x="44" y="124" fill="#f87171" font-size="12" font-weight="700">40 + 35 = 75 ≠ 58 — y ninguno está mintiendo.</text>
  <text x="44" y="144" fill="currentColor" opacity=".7" font-size="10.5">
    Son <tspan font-weight="700">estimaciones de contribución</tspan>, cada una con sus reglas y sin ver lo que hicieron las otras.</text>

  <text x="24" y="180" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS VENTANAS EXPLICAN BUENA PARTE DEL DESFASE</text>

  <rect x="24" y="192" width="200" height="50" rx="9" fill="#f472b6" fill-opacity=".16" stroke="#f472b6" stroke-width="1.2"/>
  <text x="124" y="212" text-anchor="middle" fill="#f472b6" font-size="10.5" font-weight="700">META</text>
  <text x="124" y="230" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">7 días clic + 1 visualización</text>

  <rect x="240" y="192" width="200" height="50" rx="9" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="340" y="212" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">GOOGLE</text>
  <text x="340" y="230" text-anchor="middle" fill="currentColor" opacity=".7" font-size="9.5">30 días clic</text>

  <rect x="456" y="192" width="200" height="50" rx="9" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="556" y="212" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">CONSECUENCIA</text>
  <text x="556" y="230" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">Google “parece mejor” por su ventana</text>

  <line x1="24" y1="258" x2="656" y2="258" stroke="currentColor" opacity=".18"/>

  <rect x="24" y="270" width="632" height="60" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.6"/>
  <text x="44" y="290" fill="#7c5cff" font-size="12" font-weight="700">LA ÚNICA MEDICIÓN QUE NO MIENTE: LA PRUEBA DE APAGADO</text>
  <text x="44" y="310" fill="currentColor" opacity=".78" font-size="11">
    4 semanas encendida → 2 semanas apagada → comparar las ventas <tspan font-weight="700">TOTALES</tspan>, no las atribuidas.</text>
  <text x="44" y="325" fill="#7c5cff" font-size="11" font-weight="700">
    Si las ventas totales no bajaron, la campaña no era incremental — aunque reportara ROAS 8.</text>

  <rect x="24" y="342" width="632" height="44" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="44" y="360" fill="#34d399" font-size="11.5" font-weight="700">LA SEÑAL MÁS SUBESTIMADA: “¿cómo nos conociste?” en el checkout</text>
  <text x="44" y="378" fill="currentColor" opacity=".75" font-size="11">
    No depende de cookies, ni de píxeles, ni de ventanas. Y suele revelar canales que ningún sistema estaba midiendo.</text>
</svg>`,
        pie: 'El único número real es el de tu sistema. Los de las plataformas son estimaciones de contribución.',
      },

      entrevista: [
        { p: '¿Por qué la suma de las ventas que reportan las plataformas da más que las ventas reales?',
          r: 'Porque una misma venta puede tener <b>varias plataformas involucradas</b> y cada una se la atribuye: alguien ve un anuncio en Instagram, ' +
             'después busca la marca y entra por Google. Ninguna miente — son <b>estimaciones de contribución</b> calculadas con reglas propias ' +
             'y sin ver lo que hicieron las otras. El único número real es el de tu sistema. ' +
             'Los de las plataformas sirven para optimizar <b>dentro</b> de cada una, no para compararlas entre sí.' },

        { p: '¿Qué efecto tienen las ventanas de atribución?',
          r: 'Explican buena parte del desfase. Google se atribuye ventas de hasta <b>30 días</b> después del clic; Meta, de <b>7 días</b> más un día ' +
             'de visualización. Si el ciclo de compra es largo, Google va a parecer mucho mejor <b>solo por su ventana</b>, sin que eso diga nada ' +
             'sobre su efectividad real. Y el "un día de visualización" de Meta atribuye ventas de gente que ni siquiera hizo clic, ' +
             'así que conviene mirar también el número de <b>solo clic</b>, que es más conservador y más comparable.' },

        { p: '¿Por qué el modelo de último clic es engañoso?',
          r: 'Porque le da <b>todo</b> el crédito a la última interacción. Una campaña de marca que aparece cuando alguien ya busca tu nombre se lleva ' +
             'el mérito completo de una venta que originó una campaña de descubrimiento tres semanas antes. ' +
             'Es la razón principal por la que las cuentas <b>tienden a concentrarse en el fondo del embudo</b>: ' +
             'ahí es donde los números se ven mejor, aunque el crecimiento venga de arriba.' },

        { p: '¿Cómo medirías si una campaña realmente aporta?',
          r: 'Con una <b>prueba de apagado</b>: medir las ventas totales cuatro semanas con la campaña encendida, apagarla dos semanas, ' +
             'y comparar las <b>ventas totales</b> —no las atribuidas—. Si no bajaron, la campaña no era incremental por más que reportara ROAS 8. ' +
             'Es incómodo y es lo que más aprendizaje da: es habitual que una campaña de remarketing con números espectaculares resulte tener ' +
             'poca incrementalidad, porque esas personas ya estaban comprando.' },
      ],

      practica: `
<h4>UTM consistentes: la base de todo</h4>
<pre><code>https://tusitio.com/producto
  ?utm_source=meta          ← la plataforma
  &amp;utm_medium=cpc            ← el tipo de tráfico
  &amp;utm_campaign=verano-2026  ← la campaña
  &amp;utm_content=video-gancho-a ← el creativo
  &amp;utm_term=publico-frio      ← el público

Reglas:
  · Todo en minúsculas, sin acentos ni espacios
  · Los mismos valores SIEMPRE (meta, no Meta ni facebook)
  · Documentar la convención en un lugar compartido</code></pre>

<div class="aviso"><strong>La inconsistencia de mayúsculas es el error más común y el más molesto:</strong>
<code>Meta</code>, <code>meta</code> y <code>facebook</code> aparecen como <b>tres fuentes distintas</b> en el
informe, y hay que unificarlas a mano cada mes. Definir la convención el primer día cuesta diez minutos.</div>

<h4>Comparar plataformas contra tu sistema</h4>
<pre><code>Mes: agosto

Plataforma      Ventas reportadas
Meta                    40
Google                  35
TikTok                  12
                    ─────
Suma                    87

Ventas reales (tu sistema)   58
Factor de solapamiento       87 / 58 = 1,5

→ Interpretación: en promedio, cada venta tiene 1,5 plataformas
   atribuyéndosela. Usá ese factor para dimensionar, no para repartir.</code></pre>

<h4>La pregunta del checkout</h4>
<pre><code>"¿Cómo nos conociste?"  (opcional, un solo campo)
  · Instagram / Facebook
  · Google
  · TikTok
  · Recomendación de alguien
  · Ya los conocía
  · Otro

Con 200 respuestas por mes ya tenés una señal
que NO depende de cookies ni de píxeles.</code></pre>

<div class="dato"><strong>Lo que más suele revelar esta pregunta no es cuál plataforma funciona:</strong> es
cuánta gente llega por <b>recomendación</b>, un canal que ninguna herramienta estaba midiendo y que suele
explicar la brecha entre lo atribuido y lo real.</div>

<h4>Prueba de apagado, paso a paso</h4>
<pre><code>1 · Elegí una campaña con ROAS alto (típicamente remarketing)
2 · Anotá las ventas TOTALES del negocio, 4 semanas
3 · Apagala completamente 2 semanas
4 · Anotá las ventas totales de esas 2 semanas
5 · Compará contra el mismo período del mes anterior
    y contra la tendencia general

Si las ventas totales cayeron proporcionalmente → era incremental
Si no cambiaron                                 → no lo era

Ojo: hacelo en un período SIN estacionalidad ni promociones.</code></pre>
`,

      errores: [
        { mito: 'Sumo lo que reporta cada plataforma y ese es mi total.',
          realidad: 'Vas a contar la misma venta varias veces. El <b>único número real</b> es el de tu sistema; los de las plataformas son ' +
                    'estimaciones de contribución calculadas sin ver lo que hicieron las otras.' },

        { mito: 'Google funciona mejor que Meta: reporta más ventas por peso.',
          realidad: 'Puede ser efecto de la <b>ventana de atribución</b>: Google mira 30 días y Meta 7. Con ciclo de compra largo, Google parece mejor ' +
                    'sin que eso diga nada de su efectividad.' },

        { mito: 'El ROAS de la plataforma me dice cuánto aporta la campaña.',
          realidad: 'Dice cuánto se <b>atribuye</b>, no cuánto <b>aporta</b>. La única forma de saber lo segundo es una prueba de apagado ' +
                    'mirando las ventas totales.' },

        { mito: 'Las UTM las armo cuando me acuerdo.',
          realidad: 'Sin consistencia, <code>Meta</code>, <code>meta</code> y <code>facebook</code> aparecen como <b>tres fuentes distintas</b> ' +
                    'y hay que unificarlas a mano todos los meses. La convención cuesta diez minutos el primer día.' },
      ],

      glosario: [
        { t: 'Atribución', d: 'Asignar el crédito de una conversión a uno o varios contactos previos.' },
        { t: 'Ventana de atribución', d: 'Cuánto tiempo después de un clic o vista se atribuye una conversión.' },
        { t: 'Último clic', d: 'Modelo que da todo el crédito a la última interacción. El más engañoso.' },
        { t: 'Basado en datos', d: 'Modelo que reparte el crédito según los datos de la plataforma.' },
        { t: 'Modelado', d: 'Estimación de conversiones que no se pudieron observar.' },
        { t: 'Incrementalidad', d: 'Cuántas ventas no habrían ocurrido sin la campaña.' },
        { t: 'Prueba de apagado', d: 'Apagar una campaña y comparar las ventas totales.' },
        { t: 'UTM', d: 'Parámetros en la URL que identifican el origen del tráfico.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: 'En una subasta de anuncios, ¿quién gana?',
      opciones: [
        'Quien tiene el mayor puntaje: puja por probabilidad de acción por calidad',
        'Quien ofrece más dinero',
        'Quien tiene la cuenta más antigua',
        'Quien tiene mayor presupuesto diario',
      ],
      correcta: 0,
      porQue: 'Un anunciante que ofrece la mitad puede ganar si su anuncio tiene cuatro veces más tasa de clic. De ahí sale la conclusión central: mejorar el anuncio baja el costo, subir la puja lo sube.',
      porQueNo: {
        1: 'La puja es solo uno de los factores del puntaje.',
        2: 'La antigüedad no participa en la subasta.',
        3: 'El presupuesto limita el gasto total, no gana subastas.',
      },
    },
    {
      p: '¿Por qué a la plataforma le conviene ese modelo de subasta?',
      opciones: [
        'Porque cobra cuando pasa algo: un anuncio que nadie mira no le genera ingresos',
        'Porque así cobra más caro',
        'Porque simplifica el sistema',
        'Porque lo exigen las regulaciones',
      ],
      correcta: 0,
      porQue: 'Y si muestra anuncios malos, la gente usa menos la plataforma. Los intereses quedan alineados con los del anunciante.',
      porQueNo: {
        1: 'Le conviene mostrar el anuncio más efectivo, no el más caro.',
        2: 'Es más complejo que una subasta simple por precio.',
        3: 'Ninguna regulación define el mecanismo de subasta.',
      },
    },
    {
      p: '¿Por qué la página de destino afecta el costo del medio?',
      opciones: [
        'Porque forma parte del nivel de calidad: una página irrelevante te hace pagar más por clic',
        'Porque tarda más en cargar',
        'Porque consume presupuesto adicional',
        'No lo afecta: es un tema de conversión',
      ],
      correcta: 0,
      porQue: 'Si alguien busca "zapatillas running mujer" y cae en la home, el nivel de calidad baja y pagás más en todas las subastas de esa palabra. Es un descuento en el costo del medio, no solo una mejora de conversión.',
      porQueNo: {
        1: 'La velocidad influye, pero la relevancia pesa más.',
        2: 'No hay un costo extra directo por la página.',
        3: 'Es exactamente el error más común de este tema.',
      },
    },
    {
      p: '¿Qué implica la fase de aprendizaje para la estructura de la cuenta?',
      opciones: [
        'Menos campañas con más presupuesto: dividir en ocho hace que ninguna junte datos suficientes',
        'Más campañas para aprender más rápido',
        'Cambiar el presupuesto todos los días',
        'Usar solo públicos muy acotados',
      ],
      correcta: 0,
      porQue: 'Meta pide del orden de cincuenta conversiones del evento optimizado en siete días. Con el presupuesto dividido, las ocho quedan aprendiendo para siempre.',
      porQueNo: {
        1: 'Fragmenta los datos y ninguna sale de aprendizaje.',
        2: 'Los cambios significativos reinician el aprendizaje.',
        3: 'Un público chico agrava el problema de volumen.',
      },
    },
    {
      p: '¿Qué diferencia hay entre métricas de decisión y de diagnóstico?',
      opciones: [
        'Las de decisión (CPA, ROAS) dicen si el negocio cierra; las de diagnóstico (CTR, CPM) dicen dónde está el problema',
        'Las de decisión las calcula la plataforma y las otras vos',
        'Las de diagnóstico son más precisas',
        'Son la misma cosa con distinto nombre',
      ],
      correcta: 0,
      porQue: 'La trampa es que las de diagnóstico son las que la plataforma muestra en grande. Una campaña puede tener CTR excelente y CPC bajísimo y no vender nada.',
      porQueNo: {
        1: 'Ambas están disponibles en la plataforma.',
        2: 'La precisión no es la diferencia: es para qué sirven.',
        3: 'Confundirlas es la causa número uno de campañas que "andan bien" sin vender.',
      },
    },
    {
      p: 'Con margen del 20%, ¿qué ROAS necesitás para no perder plata?',
      opciones: [
        '5,0 — el ROAS de equilibrio es uno dividido el margen',
        '1,0 — cualquier ROAS mayor a 1 es rentable',
        '2,0',
        'Depende de la plataforma',
      ],
      correcta: 0,
      porQue: 'Por eso "tenemos ROAS 3" suena bien en abstracto y con margen del 20% significa perder plata en cada venta. Sin el margen, ningún ROAS se puede interpretar.',
      porQueNo: {
        1: 'ROAS 1 significa recuperar la facturación, no el costo del producto.',
        2: 'ROAS 2 corresponde a un margen del 50%.',
        3: 'El ROAS de equilibrio depende del margen, no del canal.',
      },
    },
    {
      p: '¿En qué ventana de tiempo conviene tomar decisiones?',
      opciones: [
        '28 a 30 días: la vista diaria sirve para detectar roturas, no para decidir',
        'Diaria, para reaccionar rápido',
        '90 días, siempre',
        'Depende del presupuesto diario',
      ],
      correcta: 0,
      porQue: 'Con pocas conversiones diarias la variación natural es enorme. Reaccionar a ese ruido reinicia el aprendizaje y empeora el rendimiento real — con lo cual la reacción parece justificada.',
      porQueNo: {
        1: 'Un día malo casi siempre es azar.',
        2: '90 días sirve para estrategia; es demasiado lento para optimizar.',
        3: 'El presupuesto influye en el volumen, pero la ventana estándar es mensual.',
      },
    },
    {
      p: 'Creativo A: 48 conversiones. Creativo B: 39. ¿A es el ganador?',
      opciones: [
        'No: hacen falta del orden de 100 conversiones por variante; esa diferencia está dentro del ruido',
        'Sí, tiene 23% más conversiones',
        'Sí, si además tiene mejor CTR',
        'Depende del presupuesto de cada uno',
      ],
      correcta: 0,
      porQue: 'Declarar ganadores con ruido, mes tras mes, es optimizar hacia el azar y descartar creativos que en realidad eran mejores.',
      porQueNo: {
        1: 'El porcentaje sin volumen suficiente no indica nada.',
        2: 'El CTR con ese volumen también está dentro del ruido.',
        3: 'Aunque el presupuesto sea igual, faltan datos.',
      },
    },
    {
      p: 'Una campaña de público frío tiene ROAS bajo. ¿Qué hacés?',
      opciones: [
        'Nada: su trabajo es llenar el público tibio, no vender directo',
        'La apago: no es rentable',
        'Le subo la puja',
        'La convierto en remarketing',
      ],
      correcta: 0,
      porQue: 'Apagarla mejora los números un mes y seca el embudo al siguiente. Cada etapa tiene una pregunta distinta: al frío se le pide atención, no cierre.',
      porQueNo: {
        1: 'Es el error que hace que el embudo se seque.',
        2: 'No resuelve el problema: el frío no está para vender directo.',
        3: 'Sin frío no hay gente nueva para remarketear.',
      },
    },
    {
      p: '¿Por qué el remarketing muestra siempre los mejores números?',
      opciones: [
        'Porque esas personas ya te conocían y probablemente iban a comprar igual',
        'Porque los creativos son mejores',
        'Porque el CPM es más barato',
        'Porque las plataformas lo priorizan',
      ],
      correcta: 0,
      porQue: 'Parte de esas ventas el remarketing no las generó: se las atribuyó. Una cuenta que solo hace remarketing muestra números espectaculares mientras el negocio no crece.',
      porQueNo: {
        1: 'Los creativos suelen ser similares o más simples.',
        2: 'Los públicos chicos suelen tener CPM más alto.',
        3: 'No hay tal priorización.',
      },
    },
    {
      p: '¿Qué indicador anticipa una caída de rendimiento con un mes de ventaja?',
      opciones: [
        'Cuánta gente nueva entra al público tibio cada mes',
        'El CPM del último día',
        'La cantidad de anuncios activos',
        'El presupuesto gastado',
      ],
      correcta: 0,
      porQue: 'Cuando ese número deja de crecer, el rendimiento todavía se ve bien porque las campañas calientes siguen cosechando lo que queda. La caída llega el mes siguiente.',
      porQueNo: {
        1: 'Es ruidoso y refleja el presente, no el futuro.',
        2: 'No tiene relación con la salud del embudo.',
        3: 'Indica ritmo de gasto, no calidad del embudo.',
      },
    },
    {
      p: 'Tenés un público caliente de 300 personas. ¿Le ponés campaña propia?',
      opciones: [
        'No: nunca sale de aprendizaje y además satura, quemando el público',
        'Sí, es el público que más convierte',
        'Sí, con presupuesto muy bajo',
        'Solo si el CPM es bajo',
      ],
      correcta: 0,
      porQue: 'Le mostrás el mismo anuncio a las mismas 300 personas diez veces por semana. Eso quema el público y sube el CPM, porque la plataforma tiene que insistir más para gastar el presupuesto.',
      porQueNo: {
        1: 'Convertir bien no compensa la falta de volumen para aprender.',
        2: 'Aun con poco presupuesto, la frecuencia se dispara.',
        3: 'El CPM va a subir justamente por la saturación.',
      },
    },
    {
      p: '¿Por qué la suma de ventas reportadas por las plataformas supera a las ventas reales?',
      opciones: [
        'Porque varias plataformas se atribuyen la misma venta, cada una con sus reglas',
        'Porque las plataformas inflan los números',
        'Porque hay fraude de clics',
        'Porque se cuentan las devoluciones',
      ],
      correcta: 0,
      porQue: 'Ninguna miente: son estimaciones de contribución calculadas sin ver lo que hicieron las otras. El único número real es el de tu sistema.',
      porQueNo: {
        1: 'No hace falta inflar: el solapamiento lo explica.',
        2: 'Existe, pero no explica el desfase estructural.',
        3: 'Las devoluciones se descuentan aparte.',
      },
    },
    {
      p: '¿Qué efecto tienen las ventanas de atribución distintas?',
      opciones: [
        'Google se atribuye hasta 30 días y Meta 7, así que Google puede "parecer mejor" solo por eso',
        'No afectan la comparación',
        'Hacen que Meta reporte más ventas',
        'Solo importan en campañas de video',
      ],
      correcta: 0,
      porQue: 'Con ciclo de compra largo, la diferencia de ventana sola explica buena parte del desfase, sin decir nada sobre la efectividad real de cada canal.',
      porQueNo: {
        1: 'Son una de las causas principales de que no sean comparables.',
        2: 'La ventana más corta de Meta tiende a reportar menos.',
        3: 'Aplican a todos los formatos.',
      },
    },
    {
      p: '¿Cómo medís si una campaña realmente aporta ventas?',
      opciones: [
        'Con una prueba de apagado, comparando las ventas TOTALES del negocio',
        'Mirando el ROAS que reporta la plataforma',
        'Comparando el CPA entre campañas',
        'Con el modelo de atribución basado en datos',
      ],
      correcta: 0,
      porQue: 'Si las ventas totales no bajan al apagarla, la campaña no era incremental por más que reportara ROAS 8. Es habitual que pase con remarketing.',
      porQueNo: {
        1: 'Mide atribución, no incrementalidad.',
        2: 'Compara entre campañas, sin decir si aportan sobre la línea base.',
        3: 'Es el mejor modelo de atribución y sigue siendo atribución.',
      },
    },
  ],
});
