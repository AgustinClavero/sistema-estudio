/* ==========================================================================
   Paid Media · Módulo 06 — TikTok Ads
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'paidmedia',
  id: 'm06',
  titulo: 'TikTok Ads',
  fuentes: ['tiktok-business', 'meta-ayuda'],

  intro:
    '<p>TikTok funciona con la misma mecánica de subasta y aprendizaje que Meta, así que casi todo lo del módulo ' +
    'anterior aplica. Lo que cambia —y cambia mucho— es <b>el contenido</b>: un anuncio que funciona en Meta ' +
    'suele fracasar en TikTok, y no por la configuración.</p>' +
    '<p>Este módulo va sobre esa diferencia, sobre los formatos propios de la plataforma, y sobre cuándo TikTok ' +
    'tiene sentido y cuándo es una distracción cara.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Qué cambia respecto de Meta',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> en Meta la gente <b>ve</b> contenido; en TikTok
la gente <b>consume</b> contenido a un ritmo mucho más rápido. Un anuncio que se ve como anuncio muere en
menos de un segundo.</div>

<h4>Las diferencias que importan</h4>
<table>
<tr><th></th><th>Meta</th><th>TikTok</th></tr>
<tr><td>Formato</td><td>Feed mixto</td><td><b>Video vertical, pantalla completa</b></td></tr>
<tr><td>Sonido</td><td>Mayormente en silencio</td><td><b>Con sonido</b>, casi siempre</td></tr>
<tr><td>Ritmo</td><td>Rápido</td><td><b>Mucho más rápido</b></td></tr>
<tr><td>Tolerancia a lo publicitario</td><td>Media</td><td><b>Muy baja</b></td></tr>
<tr><td>Producción alta</td><td>Neutra o negativa</td><td><b>Claramente negativa</b></td></tr>
<tr><td>Descubrimiento</td><td>Basado en conexiones</td><td>Basado solo en interés</td></tr>
</table>

<div class="aviso"><strong>La fila del sonido invierte una regla del módulo anterior.</strong> En Meta hay que
asumir que se ve en silencio y quemar subtítulos; en TikTok <b>el audio es parte del contenido</b> —la música,
el tono, un sonido en tendencia— y un video mudo se siente fuera de lugar. ' +
<b>El mismo archivo no sirve para las dos plataformas.</b></div>

<h4>La regla de oro</h4>
<pre><code>Si tu anuncio se puede reconocer como anuncio en el primer segundo,
ya lo perdiste.

En TikTok la gente saltea con el pulgar sin pensarlo.
No hay "vamos a ver de qué se trata".</code></pre>

<h4>El descubrimiento por interés</h4>
<p>TikTok no depende de a quién seguís: muestra contenido según <b>lo que mirás</b>. Eso tiene dos
consecuencias prácticas:</p>
<ul>
<li>Un anuncio bueno puede llegar a muchísima gente sin ninguna base previa.</li>
<li>La segmentación importa todavía menos que en Meta: <b>el contenido decide el alcance</b>.</li>
</ul>

<h4>Cuándo TikTok tiene sentido</h4>
<table>
<tr><th>Situación</th><th>¿Conviene?</th></tr>
<tr><td>Producto visual, con demostración clara</td><td>✔ Sí</td></tr>
<tr><td>Público joven o amplio de consumo</td><td>✔ Sí</td></tr>
<tr><td>Capacidad de producir video seguido</td><td>✔ Imprescindible</td></tr>
<tr><td>Venta B2B con ciclo largo</td><td>✘ Casi nunca</td></tr>
<tr><td>Sin capacidad de producir video</td><td>✘ No: es el único formato</td></tr>
</table>

<div class="dato"><strong>La tercera fila es la que decide de verdad.</strong> TikTok exige <b>volumen
constante de video</b> — los creativos se fatigan mucho más rápido que en Meta. Si no podés producir varios
videos por mes de forma sostenida, el canal se apaga solo a las seis semanas. ' +
<b>Es una decisión de capacidad de producción, no de presupuesto.</b></div>
`,

      tecnico: `
<h4>Lo que se traslada de Meta y lo que no</h4>
<pre><code>SE TRASLADA
  · consolidar: pocos grupos con presupuesto suficiente
  · optimizar por el evento con volumen suficiente
  · públicos personalizados y similares
  · no tocar la campaña todos los días
  · medir con píxel + Events API (envío de servidor)

NO SE TRASLADA
  · el creativo: hay que producir específico
  · el formato: solo 9:16, pantalla completa
  · el audio: acá sí importa
  · el ritmo: cortes cada 1-2 segundos, no cada 5</code></pre>

<h4>La estructura de un video que funciona</h4>
<pre><code>0-1 s    algo que rompe el patrón: movimiento, cara hablando ya,
         texto grande, un sonido reconocible
1-3 s    el "por qué te tiene que importar", dicho rápido
3-12 s   desarrollo con cortes frecuentes
12-20 s  cierre + acción

Nunca:
  · plano fijo largo
  · locución lenta y pausada
  · música corporativa de fondo
  · el logo antes del segundo 10</code></pre>

<div class="dato"><strong>El ritmo de cortes es la diferencia más medible entre un video que funciona y uno
que no.</strong> Un video con un plano fijo de cinco segundos <b>pierde a la mitad de la audiencia</b> antes de
llegar al mensaje. Cortar cada uno o dos segundos —aunque sea con cambios de encuadre del mismo material—
sostiene la atención lo suficiente para que el mensaje llegue.</div>

<h4>Spark Ads: la ventaja propia de TikTok</h4>
<p>Permite promocionar una publicación <b>orgánica</b> —tuya o de un creador— manteniendo su apariencia
natural, con sus comentarios y su cuenta de origen.</p>
<pre><code>Ventajas
  · se ve como contenido, no como anuncio
  · conserva los comentarios: es prueba social real
  · el rendimiento orgánico suele predecir el pago
  · el perfil del creador aporta credibilidad

Requisito
  · el creador tiene que darte permiso (código de autorización)</code></pre>

<div class="dato"><strong>El detalle de los comentarios es más importante de lo que parece.</strong> Un anuncio
normal arranca sin comentarios; un Spark Ad sobre una publicación que ya funcionó llega con ' +
<b>decenas de comentarios reales de gente</b> — y eso cambia por completo cómo se percibe. ' +
Es prueba social que no se puede fabricar.</div>

<h4>Trabajar con creadores</h4>
<table>
<tr><th>Modalidad</th><th>Cómo funciona</th></tr>
<tr><td><b>Contenido a medida</b></td><td>Le pagás para que grabe; el video es tuyo</td></tr>
<tr><td><b>Spark Ad</b></td><td>Promocionás su publicación desde su cuenta</td></tr>
<tr><td><b>Mercado de creadores</b></td><td>La plataforma conecta marcas y creadores</td></tr>
<tr><td><b>Afiliación</b></td><td>Comisión por venta, sin costo fijo</td></tr>
</table>

<div class="dato"><strong>El error habitual con creadores es darles un guion cerrado.</strong> Lo que los hace
funcionar es <b>su forma de hablar</b>, que es lo que su audiencia reconoce y por lo que le cree. ' +
Un video de creador con guion corporativo pierde las dos cosas: no suena a él y sigue sonando a anuncio. ' +
Conviene dar el mensaje y los puntos obligatorios, y dejar la forma en sus manos.</div>

<h4>Medición</h4>
<p>Aplica lo mismo que en Meta: píxel más envío de servidor con la Events API, y un identificador de evento
compartido para deduplicar. Y una advertencia:</p>
<pre><code>La ventana de atribución de TikTok es corta (7 días clic, 1 de vista).
Con ciclos de compra largos, va a reportar MENOS que Google.
No es que funcione peor: es que mira menos días.</code></pre>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LO QUE CAMBIA — y lo que se traslada tal cual desde Meta</text>

  <rect x="24" y="34" width="304" height="126" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="176" y="54" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">SE TRASLADA</text>
  <text x="44" y="74" fill="currentColor" opacity=".72" font-size="10">· consolidar: pocos grupos</text>
  <text x="44" y="92" fill="currentColor" opacity=".72" font-size="10">· optimizar por evento con volumen</text>
  <text x="44" y="110" fill="currentColor" opacity=".72" font-size="10">· públicos propios y similares</text>
  <text x="44" y="128" fill="currentColor" opacity=".72" font-size="10">· no tocar todos los días</text>
  <text x="44" y="148" fill="currentColor" opacity=".72" font-size="10">· píxel + Events API con event_id</text>

  <rect x="352" y="34" width="304" height="126" rx="10" fill="#f472b6" fill-opacity=".14" stroke="#f472b6" stroke-width="1.5"/>
  <text x="504" y="54" text-anchor="middle" fill="#f472b6" font-size="11" font-weight="700">NO SE TRASLADA</text>
  <text x="372" y="74" fill="#f472b6" font-size="10" font-weight="700">· el creativo: hay que producir específico</text>
  <text x="372" y="92" fill="currentColor" opacity=".72" font-size="10">· solo 9:16, pantalla completa</text>
  <text x="372" y="110" fill="#f472b6" font-size="10" font-weight="700">· el AUDIO: acá sí importa</text>
  <text x="372" y="128" fill="currentColor" opacity=".72" font-size="10">· cortes cada 1-2 s, no cada 5</text>
  <text x="372" y="148" fill="currentColor" opacity=".6" font-size="9.5">el mismo archivo no sirve para las dos</text>

  <rect x="24" y="172" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="193" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    Si tu anuncio se reconoce como anuncio en el primer segundo, ya lo perdiste. Acá no hay “vamos a ver de qué se trata”.</text>

  <line x1="24" y1="224" x2="656" y2="224" stroke="currentColor" opacity=".18"/>

  <text x="24" y="248" fill="#7c5cff" font-size="12" font-weight="700">
    SPARK ADS — la ventaja propia de TikTok</text>

  <rect x="24" y="260" width="304" height="70" rx="10" fill="currentColor" fill-opacity=".06" stroke="currentColor" stroke-opacity=".28"/>
  <text x="176" y="280" text-anchor="middle" fill="currentColor" opacity=".68" font-size="10.5" font-weight="700">anuncio normal</text>
  <text x="44" y="300" fill="currentColor" opacity=".65" font-size="10">arranca sin comentarios</text>
  <text x="44" y="318" fill="currentColor" opacity=".65" font-size="10">se ve como lo que es</text>

  <rect x="352" y="260" width="304" height="70" rx="10" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.6"/>
  <text x="504" y="280" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">Spark Ad</text>
  <text x="372" y="300" fill="#7c5cff" font-size="10" font-weight="700">llega con decenas de comentarios reales</text>
  <text x="372" y="318" fill="currentColor" opacity=".65" font-size="10">prueba social que no se puede fabricar</text>

  <rect x="24" y="342" width="632" height="44" rx="9" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="44" y="360" fill="#fbbf24" font-size="11.5" font-weight="700">LA DECISIÓN REAL NO ES DE PRESUPUESTO: ES DE CAPACIDAD DE PRODUCCIÓN.</text>
  <text x="44" y="378" fill="currentColor" opacity=".75" font-size="10.5">
    Los creativos se fatigan mucho más rápido. Si no podés producir varios videos por mes, el canal se apaga solo a las seis semanas.</text>
</svg>`,
        pie: 'En Meta asumís silencio y quemás subtítulos. En TikTok el audio es parte del contenido. El mismo archivo no sirve.',
      },

      entrevista: [
        { p: '¿Qué se traslada de Meta a TikTok y qué no?',
          r: 'Se traslada toda la mecánica: <b>consolidar</b> en pocos grupos, optimizar por el evento con volumen suficiente, públicos propios y ' +
             'similares, no tocar la campaña todos los días, y medir con píxel más envío de servidor con identificador compartido. ' +
             'Lo que <b>no</b> se traslada es el creativo: formato solo vertical a pantalla completa, cortes cada uno o dos segundos, ' +
             'y —lo que invierte una regla de Meta— <b>el audio importa</b>. El mismo archivo no sirve para las dos plataformas.' },

        { p: '¿Por qué el audio cambia todo respecto de Meta?',
          r: 'Porque en Meta hay que asumir que se ve <b>en silencio</b> y por eso se queman subtítulos; en TikTok <b>el audio es parte del ' +
             'contenido</b> —la música, el tono, un sonido en tendencia— y un video mudo se siente fuera de lugar. ' +
             'Es una de las razones por las que reutilizar el creativo de Meta suele fracasar sin que la configuración tenga nada de malo.' },

        { p: '¿Qué son los Spark Ads y cuál es su ventaja menos obvia?',
          r: 'Permiten promocionar una publicación <b>orgánica</b> —tuya o de un creador— manteniendo su apariencia natural y su cuenta de origen. ' +
             'La ventaja menos obvia son <b>los comentarios</b>: un anuncio normal arranca sin ninguno, mientras que un Spark Ad sobre una publicación ' +
             'que ya funcionó llega con decenas de comentarios reales de gente. <b>Es prueba social que no se puede fabricar</b>, ' +
             'y cambia por completo cómo se percibe el anuncio.' },

        { p: '¿Cuándo NO conviene TikTok?',
          r: 'Cuando <b>no hay capacidad de producir video de forma sostenida</b>. Es el único formato de la plataforma y los creativos se fatigan ' +
             'mucho más rápido que en Meta, así que si no podés hacer varios videos por mes, el canal se apaga solo a las seis semanas. ' +
             '<b>Es una decisión de capacidad de producción, no de presupuesto.</b> También suele descartarse en venta B2B con ciclo largo.' },
      ],

      practica: `
<h4>Adaptar un creativo de Meta a TikTok</h4>
<pre><code>NO alcanza con recortar a 9:16. Hay que:

☐ Rehacer el primer segundo: algo que rompa el patrón
☐ Acelerar el ritmo: cortes cada 1-2 segundos
☐ Grabar audio nuevo, hablado natural (no locución)
☐ Sacar el logo del principio
☐ Sacar la música corporativa
☐ Agregar texto en pantalla al estilo de la plataforma
☐ Que la persona hable a cámara, sin guion leído</code></pre>

<div class="aviso"><strong>El punto del guion leído es el más determinante y el más difícil de aceptar.</strong>
Un texto memorizado y recitado <b>se nota inmediatamente</b> y activa el reflejo de saltear. ' +
Funciona mejor darle a la persona los tres puntos que tiene que decir y dejarla hablar con sus palabras, ' +
aunque el resultado sea menos prolijo.</div>

<h4>Estructura de cuenta</h4>
<pre><code>Campaña — Ventas
  Objetivo: conversiones · Evento: el que tenga volumen
  Grupo único:
    · Público amplio (o similar de compradores)
    · Ubicación: solo TikTok (no la red de audiencia, al principio)
    · 5-8 videos distintos

Campaña — Remarketing
  Grupo único: visitantes 30d + vieron 75% de video, sin compradores
  3-4 videos</code></pre>

<h4>Spark Ads, paso a paso</h4>
<pre><code>1 · Publicar de forma orgánica desde la cuenta de marca
    (o pedirle al creador que publique)
2 · Ver cuál funciona orgánicamente: retención, comentarios, guardados
3 · Pedir el código de autorización de esa publicación
4 · Crear el anuncio usando ese código
5 · Promocionar SOLO las que ya funcionaron orgánicamente</code></pre>

<div class="dato"><strong>El paso 5 es la clave y convierte a lo orgánico en un laboratorio gratis.</strong>
El rendimiento orgánico <b>predice bastante bien</b> el rendimiento pago, así que publicar cinco videos por
semana y promocionar solo el que despegó es mucho más eficiente que apostar presupuesto a ciegas.</div>

<h4>Briefing para un creador</h4>
<pre><code>QUÉ DAR
  · el problema que resuelve el producto
  · 3 puntos que sí o sí tiene que mencionar
  · qué NO se puede decir (afirmaciones legales)
  · la acción final
  · duración objetivo

QUÉ NO DAR
  · un guion palabra por palabra
  · un tono que no sea el suyo
  · exigencias de producción</code></pre>

<div class="dato"><strong>Lo que hace funcionar a un creador es <b>su forma de hablar</b>,</strong> que es lo
que su audiencia reconoce y por lo que le cree. Un video de creador con guion corporativo pierde las dos
cosas: no suena a él y sigue sonando a anuncio — con lo cual pagaste por el creador y no obtuviste su
ventaja.</div>
`,

      errores: [
        { mito: 'Reutilizo el creativo de Meta recortado a vertical.',
          realidad: 'No alcanza: cambia el <b>ritmo</b>, cambia el <b>audio</b> —que en TikTok sí importa— y cambia la tolerancia a lo publicitario. ' +
                    'Hay que producir específico.' },

        { mito: 'En TikTok también hay que asumir que se ve sin sonido.',
          realidad: 'Es al revés: <b>el audio es parte del contenido</b>. Un video mudo se siente fuera de lugar. Es una de las reglas de Meta ' +
                    'que se invierte.' },

        { mito: 'Le doy al creador un guion cerrado para controlar el mensaje.',
          realidad: 'Lo que lo hace funcionar es <b>su forma de hablar</b>. Con guion corporativo no suena a él y sigue sonando a anuncio: ' +
                    'pagaste por el creador y perdiste su ventaja.' },

        { mito: 'TikTok es cuestión de tener presupuesto.',
          realidad: 'Es cuestión de <b>capacidad de producción</b>. Los creativos se fatigan mucho más rápido y el video es el único formato: ' +
                    'sin producción sostenida, el canal se apaga solo a las seis semanas.' },
      ],

      glosario: [
        { t: 'Spark Ad', d: 'Promocionar una publicación orgánica manteniendo su apariencia y comentarios.' },
        { t: 'Código de autorización', d: 'Permiso que da el creador para usar su publicación como anuncio.' },
        { t: 'Mercado de creadores', d: 'Espacio donde la plataforma conecta marcas con creadores.' },
        { t: 'Ritmo de cortes', d: 'Frecuencia de cambios de plano. Determina la retención.' },
        { t: 'Retención', d: 'Qué proporción del video se mira antes de saltearlo.' },
        { t: 'Events API', d: 'Envío de eventos desde el servidor, equivalente a la API de conversiones.' },
        { t: 'Descubrimiento por interés', d: 'Mostrar contenido según lo que mirás, no según a quién seguís.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Qué se traslada tal cual de Meta a TikTok?',
      opciones: [
        'La mecánica: consolidar, optimizar por evento con volumen, públicos propios y medición de servidor',
        'El creativo, recortado a vertical',
        'La estrategia de audio',
        'El ritmo de edición',
      ],
      correcta: 0,
      porQue: 'La subasta y el aprendizaje funcionan igual. Lo que no se traslada es el contenido: formato, ritmo y audio son distintos.',
      porQueNo: {
        1: 'Recortar no alcanza: hay que producir específico.',
        2: 'Se invierte: en TikTok el audio importa.',
        3: 'TikTok pide cortes cada uno o dos segundos.',
      },
    },
    {
      p: '¿Qué regla de Meta se invierte en TikTok?',
      opciones: [
        'La del sonido: en TikTok el audio es parte del contenido, no un extra',
        'La de consolidar campañas',
        'La de no tocar la campaña a diario',
        'La de usar públicos propios',
      ],
      correcta: 0,
      porQue: 'En Meta hay que asumir consumo en silencio y quemar subtítulos; en TikTok un video mudo se siente fuera de lugar.',
      porQueNo: {
        1: 'Se mantiene igual.',
        2: 'También se mantiene.',
        3: 'Sigue siendo el tipo de público más valioso.',
      },
    },
    {
      p: '¿Cuál es la regla de oro del creativo en TikTok?',
      opciones: [
        'Si se reconoce como anuncio en el primer segundo, ya lo perdiste',
        'Debe durar al menos 30 segundos',
        'Tiene que mostrar el logo al inicio',
        'La calidad de producción debe ser alta',
      ],
      correcta: 0,
      porQue: 'La gente saltea con el pulgar sin pensarlo: no hay "vamos a ver de qué se trata". La tolerancia a lo publicitario es muy baja.',
      porQueNo: {
        1: 'La duración depende del mensaje; muchos buenos son más cortos.',
        2: 'El logo al inicio es de las formas más rápidas de que lo salteen.',
        3: 'La producción alta suele jugar en contra.',
      },
    },
    {
      p: '¿Qué determina más el alcance en TikTok?',
      opciones: [
        'El contenido: el descubrimiento es por interés, no por conexiones',
        'La cantidad de seguidores',
        'La segmentación configurada',
        'El presupuesto diario',
      ],
      correcta: 0,
      porQue: 'TikTok muestra contenido según lo que mirás, así que un anuncio bueno puede llegar a muchísima gente sin ninguna base previa. La segmentación importa todavía menos que en Meta.',
      porQueNo: {
        1: 'El descubrimiento no depende de a quién seguís.',
        2: 'Influye, pero mucho menos que el contenido.',
        3: 'Limita el volumen, no la capacidad de despegar.',
      },
    },
    {
      p: '¿Qué diferencia más medible hay entre un video que funciona y uno que no?',
      opciones: [
        'El ritmo de cortes: un plano fijo de cinco segundos pierde a la mitad de la audiencia',
        'La resolución del video',
        'La duración total',
        'El color de la marca',
      ],
      correcta: 0,
      porQue: 'Cortar cada uno o dos segundos —aunque sea con cambios de encuadre del mismo material— sostiene la atención lo suficiente para que el mensaje llegue.',
      porQueNo: {
        1: 'Un video con teléfono en buena luz alcanza.',
        2: 'Importa, pero la retención se pierde por ritmo antes que por duración.',
        3: 'No tiene impacto en la retención.',
      },
    },
    {
      p: '¿Cuál es la ventaja menos obvia de los Spark Ads?',
      opciones: [
        'Conservan los comentarios reales de la publicación original',
        'Cuestan menos por impresión',
        'No requieren aprobación',
        'Permiten más caracteres de texto',
      ],
      correcta: 0,
      porQue: 'Un anuncio normal arranca sin comentarios; un Spark Ad sobre una publicación que funcionó llega con decenas de comentarios reales. Es prueba social que no se puede fabricar.',
      porQueNo: {
        1: 'El costo depende de la subasta, no del formato.',
        2: 'Pasan por el mismo proceso de revisión.',
        3: 'El límite de texto es el mismo.',
      },
    },
    {
      p: '¿Cómo conviene usar lo orgánico junto con Spark Ads?',
      opciones: [
        'Publicar varios videos por semana y promocionar solo los que ya funcionaron orgánicamente',
        'Promocionar todo lo que se publica',
        'Publicar solo lo que se va a promocionar',
        'No mezclar lo orgánico con lo pago',
      ],
      correcta: 0,
      porQue: 'El rendimiento orgánico predice bastante bien el pago, así que lo orgánico funciona como un laboratorio gratis. Es mucho más eficiente que apostar presupuesto a ciegas.',
      porQueNo: {
        1: 'Desperdicia presupuesto en videos que ya mostraron que no funcionan.',
        2: 'Pierde justamente la señal previa que hace útil el método.',
        3: 'La combinación es una de las mayores ventajas de la plataforma.',
      },
    },
    {
      p: '¿Cuál es el error habitual al trabajar con creadores?',
      opciones: [
        'Darles un guion cerrado: pierden su forma de hablar, que es lo que los hace funcionar',
        'Pagarles por publicación',
        'Pedirles varios videos',
        'Elegir creadores chicos',
      ],
      correcta: 0,
      porQue: 'Con guion corporativo no suena a él y sigue sonando a anuncio: pagaste por el creador y perdiste su ventaja. Conviene dar el mensaje y los puntos obligatorios, no la forma.',
      porQueNo: {
        1: 'Es una modalidad normal de trabajo.',
        2: 'Es razonable y suele mejorar el resultado.',
        3: 'Los creadores chicos suelen tener audiencias muy comprometidas.',
      },
    },
    {
      p: '¿Qué decide realmente si TikTok tiene sentido para un negocio?',
      opciones: [
        'La capacidad de producir video de forma sostenida',
        'El presupuesto disponible',
        'La edad del público objetivo',
        'Tener una cuenta con seguidores',
      ],
      correcta: 0,
      porQue: 'El video es el único formato y los creativos se fatigan mucho más rápido que en Meta. Sin producción sostenida, el canal se apaga solo a las seis semanas.',
      porQueNo: {
        1: 'Con presupuesto y sin creativos, el canal no se sostiene.',
        2: 'El público ya no es tan joven como se supone.',
        3: 'El descubrimiento por interés hace que los seguidores importen poco.',
      },
    },
    {
      p: 'Al adaptar un creativo de Meta, ¿qué NO alcanza?',
      opciones: [
        'Recortarlo a formato vertical',
        'Regrabar el audio',
        'Acelerar el ritmo de cortes',
        'Sacar el logo del principio',
      ],
      correcta: 0,
      porQue: 'Hay que rehacer el primer segundo, acelerar el ritmo, regrabar audio natural, sacar el logo y la música corporativa. El recorte solo cambia el encuadre.',
      porQueNo: {
        1: 'Es una de las adaptaciones necesarias.',
        2: 'También es necesaria.',
        3: 'Es parte de la adaptación correcta.',
      },
    },
    {
      p: '¿Por qué un guion leído funciona mal en TikTok?',
      opciones: [
        'Porque se nota inmediatamente y activa el reflejo de saltear',
        'Porque el algoritmo lo detecta',
        'Porque no permite subtítulos',
        'Porque alarga el video',
      ],
      correcta: 0,
      porQue: 'Funciona mejor darle a la persona los tres puntos que tiene que decir y dejarla hablar con sus palabras, aunque el resultado sea menos prolijo.',
      porQueNo: {
        1: 'No hay detección algorítmica de guiones.',
        2: 'Los subtítulos se pueden agregar igual.',
        3: 'La duración es independiente.',
      },
    },
    {
      p: '¿Qué hay que tener en cuenta al comparar TikTok con Google en los informes?',
      opciones: [
        'La ventana de atribución de TikTok es corta: va a reportar menos con ciclos de compra largos',
        'TikTok no reporta conversiones',
        'TikTok usa un modelo de último clic',
        'Los datos de TikTok se actualizan cada 48 horas',
      ],
      correcta: 0,
      porQue: 'No es que funcione peor: es que mira menos días. Es el mismo efecto que hace que Google "parezca mejor" que Meta.',
      porQueNo: {
        1: 'Las reporta con píxel y Events API.',
        2: 'Usa modelos similares a los de otras plataformas.',
        3: 'La latencia de datos no explica una diferencia sistemática.',
      },
    },
    {
      p: '¿Qué estructura de cuenta conviene al empezar en TikTok?',
      opciones: [
        'Una campaña de ventas con un grupo amplio y 5-8 videos, más una de remarketing',
        'Un grupo por cada video, para comparar',
        'Una campaña por cada interés',
        'Solo remarketing al principio',
      ],
      correcta: 0,
      porQue: 'Aplica la misma lógica de consolidación que Meta: pocos grupos con presupuesto suficiente para salir de la fase de aprendizaje.',
      porQueNo: {
        1: 'Fragmenta el volumen y ninguno aprende.',
        2: 'Los intereses importan todavía menos que en Meta.',
        3: 'Sin captación no hay a quién remarketear.',
      },
    },
    {
      p: '¿Qué NO conviene incluir en un briefing para un creador?',
      opciones: [
        'Un guion palabra por palabra y un tono que no sea el suyo',
        'Los tres puntos que debe mencionar',
        'Lo que legalmente no puede decir',
        'La duración objetivo',
      ],
      correcta: 0,
      porQue: 'Lo que hace funcionar a un creador es su forma de hablar, que es lo que su audiencia reconoce y por lo que le cree.',
      porQueNo: {
        1: 'Es exactamente lo que sí hay que dar.',
        2: 'Las restricciones legales son imprescindibles.',
        3: 'Es una guía razonable y no invade su estilo.',
      },
    },
    {
      p: 'En TikTok, ¿qué peso tiene la segmentación por intereses?',
      opciones: [
        'Todavía menos que en Meta: el contenido decide el alcance',
        'Es la variable más importante',
        'El mismo que en Meta',
        'Solo importa en remarketing',
      ],
      correcta: 0,
      porQue: 'El descubrimiento es por interés observado, no por conexiones: un anuncio bueno puede llegar a muchísima gente sin base previa.',
      porQueNo: {
        1: 'El creativo pesa mucho más.',
        2: 'En TikTok pesa aún menos.',
        3: 'También aplica en captación, donde importa poco.',
      },
    },
  ],
});
