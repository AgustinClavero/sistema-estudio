/* ==========================================================================
   Paid Media · Módulo 04 — Meta Ads: estructura y segmentación
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'paidmedia',
  id: 'm04',
  titulo: 'Meta Ads: estructura y segmentación',
  fuentes: ['meta-ayuda', 'meta-blueprint'],

  intro:
    '<p>Meta cambió de forma radical en los últimos años: la segmentación manual detallada pasó de ser la ' +
    'habilidad central a ser, en muchos casos, un obstáculo. Hoy el sistema encuentra mejor a la gente que vos, ' +
    '<b>si le das volumen y buenas señales</b>.</p>' +
    '<p>Este módulo va sobre eso: cómo aprende realmente el algoritmo, por qué la estructura simple gana casi ' +
    'siempre, y cómo usar los públicos sin estorbarle.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Cómo aprende el algoritmo',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> Meta no le muestra tu anuncio a "hombres de 25 a
34 interesados en fitness". Le muestra tu anuncio a <b>quien parece que va a hacer lo que vos pediste</b> — y
lo averigua probando.</div>

<h4>El proceso, en cuatro pasos</h4>
<ol>
<li>Le decís <b>qué querés</b> que pase: una compra, un mensaje, un formulario.</li>
<li>El sistema muestra el anuncio de forma <b>relativamente amplia</b> al principio.</li>
<li>Observa <b>quién hace la acción</b> que pediste.</li>
<li>Empieza a buscar gente parecida a esa.</li>
</ol>

<div class="aviso"><strong>Por eso el evento que elegís optimizar es la decisión más importante de toda la
campaña.</strong> Si optimizás por "clic en el enlace", el sistema busca <b>gente que hace clic</b> — y hay
mucha que hace clic y no compra nunca. Si optimizás por compra, busca compradores. ' +
<b>Vas a conseguir exactamente lo que pediste.</b></div>

<h4>La fase de aprendizaje</h4>
<p>Mientras el sistema junta datos, el rendimiento es inestable y peor. Meta pide del orden de
<b>50 conversiones del evento optimizado en 7 días</b> por conjunto de anuncios.</p>
<pre><code>Si tu campaña genera 20 compras por semana
y tenés 4 conjuntos de anuncios:
   → 5 conversiones por conjunto
   → NINGUNO sale de aprendizaje
   → los cuatro rinden peor de lo que podrían</code></pre>

<div class="dato"><strong>De ahí sale la consolidación, que es el cambio de práctica más grande de los últimos
años.</strong> Menos conjuntos con más presupuesto rinden mucho más que muchos conjuntos chicos, ' +
aunque intuitivamente parezca que se está "probando menos". <b>Probar más cosas con poco presupuesto es no
probar nada.</b></div>

<h4>Lo que reinicia el aprendizaje</h4>
<pre><code>Reinicia                       No reinicia
· cambiar el público           · agregar un anuncio nuevo
· cambiar el evento            · pausar un anuncio
· cambiar el presupuesto       · cambios chicos de presupuesto
  más del 20%                    (menos del 20%)
· cambiar la puja
· editar el creativo</code></pre>

<div class="aviso"><strong>La consecuencia práctica: tocar la campaña todos los días garantiza que nunca
aprenda.</strong> Y como el rendimiento en aprendizaje es peor, eso confirma la sensación de que "hay que
optimizarla más" — y se entra en un círculo del que es difícil salir.</div>
`,

      tecnico: `
<h4>Elegir el evento de optimización</h4>
<table>
<tr><th>Si tenés…</th><th>Optimizá por…</th><th>Motivo</th></tr>
<tr><td>50+ compras semanales</td><td><b>Compra</b></td><td>La señal más valiosa</td></tr>
<tr><td>10-50 compras semanales</td><td>Iniciar pago o agregar al carrito</td><td>Más volumen, señal cercana</td></tr>
<tr><td>Menos de 10</td><td>Agregar al carrito o vista de contenido</td><td>Necesitás volumen para aprender</td></tr>
<tr><td>Generación de leads</td><td>Lead, con calidad medida aparte</td><td>Cuidado con los leads basura</td></tr>
</table>

<div class="dato"><strong>La regla implícita de esa tabla: <b>bajá en el embudo hasta encontrar un evento con
volumen suficiente</b>.</strong> Optimizar por compra con cinco compras semanales es peor que optimizar por
carrito con cincuenta: en el primer caso el sistema nunca aprende, en el segundo aprende algo aproximado ' +
—y aproximado con datos gana a exacto sin datos.</div>

<h4>Consolidación: cómo se ve en la práctica</h4>
<pre><code>❌ Estructura fragmentada
Campaña
  Conjunto 1: hombres 25-34, interés fitness      $ 5.000/día
  Conjunto 2: mujeres 25-34, interés fitness      $ 5.000/día
  Conjunto 3: hombres 35-44, interés running      $ 5.000/día
  Conjunto 4: similares 1%                        $ 5.000/día
  → cada uno con 5 conversiones/semana: nadie aprende

✔ Consolidada
Campaña
  Conjunto 1: amplio (18-65, sin intereses) + señal   $ 15.000/día
  Conjunto 2: remarketing                             $  5.000/día
  → el primero junta 50+ conversiones y aprende</code></pre>

<div class="dato"><strong>Lo contraintuitivo: el conjunto "amplio" suele superar al segmentado
finamente.</strong> Meta tiene muchísima más información sobre quién compra que la que vos podés expresar con
intereses — y los intereses declarados suelen ser malos predictores. <b>Restringir el público es quitarle
opciones a un sistema que elige mejor que vos.</b></div>

<h4>El presupuesto: a nivel de campaña</h4>
<p>Con presupuesto a nivel de campaña, Meta reparte entre conjuntos según lo que funciona. Con presupuesto por
conjunto, cada uno gasta lo suyo aunque rinda mal.</p>
<pre><code>Presupuesto de campaña      cuando querés que el sistema decida
Presupuesto por conjunto    cuando necesitás garantizar gasto en uno
                            (por ejemplo, un remarketing que no querés
                             que se quede sin presupuesto)</code></pre>

<h4>La estructura que funciona en la mayoría de los casos</h4>
<pre><code>Campaña 1 — Ventas (frío + similares)     70% del presupuesto
  1 conjunto amplio, con señales
  4-6 anuncios con creativos distintos

Campaña 2 — Remarketing                   30%
  1 conjunto: visitantes 30d + carritos, excluyendo compradores
  3-4 anuncios

Y nada más. Cuatro campañas con ocho conjuntos es fragmentación,
no sofisticación.</code></pre>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="mt2" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CÓMO APRENDE — vas a conseguir exactamente lo que pediste</text>

  <rect x="24" y="34" width="146" height="52" rx="9" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="97" y="54" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">1 · le decís QUÉ</text>
  <text x="97" y="72" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9">compra · mensaje · lead</text>

  <line x1="174" y1="60" x2="188" y2="60" stroke="currentColor" stroke-width="1.3" marker-end="url(#mt2)"/>

  <rect x="192" y="34" width="146" height="52" rx="9" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="265" y="54" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">2 · muestra amplio</text>
  <text x="265" y="72" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9">explora al principio</text>

  <line x1="342" y1="60" x2="356" y2="60" stroke="currentColor" stroke-width="1.3" marker-end="url(#mt2)"/>

  <rect x="360" y="34" width="146" height="52" rx="9" fill="#7c5cff" fill-opacity=".18" stroke="#7c5cff" stroke-width="1.2"/>
  <text x="433" y="54" text-anchor="middle" fill="#7c5cff" font-size="10" font-weight="700">3 · observa QUIÉN</text>
  <text x="433" y="72" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9">hizo esa acción</text>

  <line x1="510" y1="60" x2="524" y2="60" stroke="currentColor" stroke-width="1.3" marker-end="url(#mt2)"/>

  <rect x="528" y="34" width="128" height="52" rx="9" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.4"/>
  <text x="592" y="54" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">4 · busca parecidos</text>

  <rect x="24" y="98" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="119" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    Si optimizás por “clic”, busca gente que hace clic — y hay mucha que hace clic y no compra nunca.</text>

  <line x1="24" y1="152" x2="656" y2="152" stroke="currentColor" opacity=".18"/>

  <text x="24" y="176" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    FRAGMENTAR vs CONSOLIDAR — con 20 compras semanales</text>

  <rect x="24" y="188" width="304" height="110" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="208" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">✗ 4 conjuntos</text>
  <rect x="44" y="218" width="60" height="16" rx="3" fill="#f87171" fill-opacity=".3"/>
  <text x="120" y="230" fill="currentColor" opacity=".65" font-size="9">5 conv/sem</text>
  <rect x="44" y="238" width="60" height="16" rx="3" fill="#f87171" fill-opacity=".3"/>
  <text x="120" y="250" fill="currentColor" opacity=".65" font-size="9">5 conv/sem</text>
  <rect x="44" y="258" width="60" height="16" rx="3" fill="#f87171" fill-opacity=".3"/>
  <text x="120" y="270" fill="currentColor" opacity=".65" font-size="9">5 conv/sem</text>
  <text x="176" y="290" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">NINGUNO sale de aprendizaje</text>

  <rect x="352" y="188" width="304" height="110" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.6"/>
  <text x="504" y="208" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">✓ 1 conjunto amplio</text>
  <rect x="372" y="220" width="240" height="42" rx="6" fill="#34d399" fill-opacity=".35"/>
  <text x="492" y="246" text-anchor="middle" fill="#06281c" font-size="11" font-weight="700">20 conv/sem</text>
  <text x="504" y="284" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">se acerca al umbral y aprende</text>

  <rect x="24" y="310" width="632" height="30" rx="8" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="330" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">
    Probar más cosas con poco presupuesto es no probar nada.</text>

  <rect x="24" y="348" width="632" height="38" rx="9" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.5"/>
  <text x="44" y="366" fill="#7c5cff" font-size="11.5" font-weight="700">LO CONTRAINTUITIVO: el conjunto AMPLIO suele superar al segmentado finamente.</text>
  <text x="44" y="381" fill="currentColor" opacity=".75" font-size="10.5">
    Meta sabe muchísimo más sobre quién compra que lo que podés expresar con intereses. Restringir es quitarle opciones a quien elige mejor.</text>
</svg>`,
        pie: 'Tocar la campaña todos los días garantiza que nunca aprenda — y el mal rendimiento confirma la sensación de que hay que tocarla.',
      },

      entrevista: [
        { p: '¿Cómo decide Meta a quién mostrarle un anuncio?',
          r: 'No por la segmentación declarada, sino observando <b>quién hace la acción que pediste</b> y buscando gente parecida. ' +
             'Por eso <b>el evento de optimización es la decisión más importante de la campaña</b>: si optimizás por clic en el enlace, ' +
             'el sistema busca gente que hace clic — y hay muchísima que hace clic y no compra nunca. ' +
             'Vas a conseguir exactamente lo que pediste, así que hay que pedir lo correcto.' },

        { p: '¿Qué es la consolidación y por qué es el cambio de práctica más grande?',
          r: 'Usar <b>menos conjuntos de anuncios con más presupuesto</b> en vez de muchos chicos. Meta pide del orden de cincuenta conversiones ' +
             'semanales por conjunto para salir de la fase de aprendizaje; si dividís veinte compras entre cuatro conjuntos, ' +
             '<b>ninguno aprende</b> y los cuatro rinden peor de lo que podrían. Es contraintuitivo porque parece que estás probando menos, ' +
             'pero <b>probar más cosas con poco presupuesto es no probar nada</b>.' },

        { p: '¿Por qué un público amplio suele superar a uno segmentado finamente?',
          r: 'Porque Meta tiene muchísima más información sobre quién compra que la que vos podés expresar con intereses — ' +
             'y los intereses declarados suelen ser malos predictores de compra. <b>Restringir el público es quitarle opciones a un sistema que ' +
             'elige mejor que vos.</b> La segmentación fina tenía sentido cuando el algoritmo era peor; hoy es, en muchos casos, un obstáculo.' },

        { p: '¿Qué evento de optimización elegirías si tenés poco volumen?',
          r: 'Uno más <b>arriba en el embudo</b> hasta encontrar volumen suficiente: si tenés cinco compras semanales, optimizar por compra hace que ' +
             'el sistema nunca aprenda. Optimizar por "agregar al carrito" con cincuenta eventos semanales aprende algo aproximado — ' +
             'y <b>aproximado con datos gana a exacto sin datos</b>. Después, cuando el volumen crece, se sube el evento.' },
      ],

      practica: `
<h4>La estructura que funciona en la mayoría de los casos</h4>
<pre><code>Campaña 1 — Ventas                          70% del presupuesto
  Objetivo: ventas · Evento: compra (o el que tenga volumen)
  Presupuesto a nivel de campaña
  Conjunto único:
    · Ubicación y edad amplias (18-65)
    · Sin intereses, o con una señal de público amplia
    · Excluir: compradores de 30 días
    · 4-6 anuncios con creativos distintos

Campaña 2 — Remarketing                     30%
  Conjunto único:
    · Visitantes 30 días + carritos 7 días + video 50%
    · Excluir: compradores de 90 días
    · 3-4 anuncios</code></pre>

<div class="aviso"><strong>Las exclusiones de compradores no son opcionales.</strong> Sin ellas seguís pagando
por mostrarle el anuncio a quien ya compró — y además de gastar, transmite que la marca no sabe con quién está
hablando. Es de las cosas que más rápido se notan del lado del cliente.</div>

<h4>Elegir el evento por volumen</h4>
<pre><code>Contá los eventos de la última semana:

  compras            _____   ¿50+? → optimizá por compra
  iniciar pago       _____   ¿50+? → optimizá por iniciar pago
  agregar al carrito _____   ¿50+? → optimizá por carrito
  vista de contenido _____   siempre hay volumen, pero señal débil

Elegí el evento MÁS ABAJO en el embudo que tenga 50+ por semana.</code></pre>

<h4>Qué tocar y qué no</h4>
<table>
<tr><th>Acción</th><th>¿Reinicia aprendizaje?</th></tr>
<tr><td>Agregar un anuncio nuevo</td><td>No ✔</td></tr>
<tr><td>Pausar un anuncio con mal rendimiento</td><td>No ✔</td></tr>
<tr><td>Subir el presupuesto menos de 20%</td><td>No ✔</td></tr>
<tr><td>Subir el presupuesto más de 20%</td><td><b>Sí</b></td></tr>
<tr><td>Cambiar el público</td><td><b>Sí</b></td></tr>
<tr><td>Cambiar el evento de optimización</td><td><b>Sí</b></td></tr>
<tr><td>Editar el texto de un anuncio activo</td><td><b>Sí</b></td></tr>
</table>

<div class="dato"><strong>La última fila sorprende y explica muchos rendimientos rotos:</strong> corregir una
falta de ortografía en un anuncio que ya venía funcionando lo devuelve a la fase de aprendizaje. ' +
Si hay que corregir algo, conviene <b>crear un anuncio nuevo corregido y pausar el viejo</b> — eso no
reinicia nada.</div>

<h4>Ritmo de trabajo semanal</h4>
<pre><code>Lunes      revisar la semana anterior (no el fin de semana suelto)
           decidir si algo se pausa o se agrega
Martes     subir creativos nuevos si corresponde
Resto      NO TOCAR

Cambios de presupuesto: como mucho uno por semana, menor al 20%.</code></pre>
`,

      errores: [
        { mito: 'Cuanto más segmento, mejor llego a mi público.',
          realidad: 'Meta sabe más sobre quién compra que lo que podés expresar con intereses. <b>Restringir es quitarle opciones</b> a un sistema ' +
                    'que elige mejor — y además fragmenta el volumen que necesita para aprender.' },

        { mito: 'Muchos conjuntos me permiten probar más cosas.',
          realidad: 'Si el presupuesto se divide, <b>ninguno junta las 50 conversiones semanales</b> y todos quedan en aprendizaje. ' +
                    'Probar más cosas con poco presupuesto es no probar nada.' },

        { mito: 'Optimizo siempre por compra: es lo que quiero.',
          realidad: 'Con poco volumen, el sistema <b>nunca aprende</b>. Conviene subir en el embudo hasta un evento con 50+ semanales: ' +
                    'aproximado con datos gana a exacto sin datos.' },

        { mito: 'Corrijo una falta de ortografía en el anuncio y listo.',
          realidad: 'Editar un anuncio activo <b>reinicia la fase de aprendizaje</b>. Conviene crear uno nuevo corregido y pausar el viejo: ' +
                    'eso no reinicia nada.' },
      ],

      glosario: [
        { t: 'Evento de optimización', d: 'La acción que le pedís al sistema que consiga. La decisión más importante.' },
        { t: 'Fase de aprendizaje', d: 'Período en que el sistema junta datos y el rendimiento es inestable.' },
        { t: 'Consolidación', d: 'Usar menos conjuntos con más presupuesto para superar el umbral de aprendizaje.' },
        { t: 'Conjunto de anuncios', d: 'Nivel donde se define público, presupuesto y ubicaciones.' },
        { t: 'Público amplio', d: 'Sin intereses ni restricciones finas. Deja decidir al sistema.' },
        { t: 'Presupuesto de campaña', d: 'Reparto automático entre conjuntos según rendimiento.' },
        { t: 'Exclusión', d: 'Público que no debe ver la campaña, como compradores recientes.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Públicos: los que sirven y los que estorban',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> los públicos que valen son los que se construyen
con <b>datos propios</b>. Los que se arman con intereses declarados son, en su mayoría, ruido.</div>

<h4>Los tres tipos</h4>
<p><b>Personalizados</b> — gente que ya interactuó con vos: visitantes del sitio, tu lista de clientes, quienes
vieron un video, quienes interactuaron con el perfil.</p>

<p><b>Similares</b> — Meta busca gente parecida a un público personalizado. La calidad depende <b>por completo</b>
de la calidad de la lista de origen.</p>

<p><b>Guardados</b> — los que armás con intereses, edad, ubicación y comportamientos.</p>

<div class="aviso"><strong>El orden de valor es claro y sorprende a quien viene de la publicidad
tradicional:</strong> <b>personalizados &gt; similares &gt; amplio &gt; intereses</b>. ' +
Sí: un público <b>amplio sin ninguna segmentación</b> suele rendir mejor que uno armado con intereses, ' +
porque los intereses declarados son malos predictores de compra y además restringen el volumen que el sistema
necesita.</div>

<h4>Los similares, en detalle</h4>
<pre><code>Origen                          Calidad del similar
compradores (más de 500)        Excelente
compradores de alto valor       La mejor de todas
lista de clientes con email     Muy buena
visitantes del sitio            Media
gente que dio "me gusta"        Baja</code></pre>

<div class="dato"><strong>El mejor origen no es "todos los compradores": es el <b>10% que más gastó</b>.</strong>
Un similar construido sobre tus mejores clientes busca gente parecida a los que <b>más valen</b>, ' +
no a los que compran una vez y desaparecen. Es una diferencia enorme y cuesta lo mismo armarlo.</div>

<h4>El tamaño del similar</h4>
<pre><code>1%   el más parecido, el más chico, el más caro
2-3% buen equilibrio
5%+  más volumen, menos precisión

Con presupuesto chico → 1-2%
Con presupuesto grande → 3-5%, o directamente amplio</code></pre>

<h4>La lista de clientes: el activo más subestimado</h4>
<p>Subir tu base de clientes a Meta hace dos cosas: te permite <b>excluirlos</b> de campañas de captación, y
te permite crear <b>similares de alta calidad</b>. Es gratis, se hace en diez minutos, y muchísima gente
nunca lo hizo.</p>
`,

      tecnico: `
<h4>Públicos personalizados que hay que tener</h4>
<pre><code>Del sitio (con el píxel)
  · Todos los visitantes, 30 / 90 / 180 días
  · Vieron producto, 30 días
  · Agregaron al carrito, 7 y 14 días
  · Iniciaron pago, 7 días
  · Compradores, 30 / 90 / 365 días      ← para EXCLUIR y para similares

De interacción
  · Vieron el 50% o el 75% de un video, 30 días
  · Interactuaron con el perfil, 90 días
  · Abrieron un formulario y no lo enviaron

De tu base
  · Todos los clientes
  · Clientes del último año
  · El 10% que más gastó                 ← el mejor origen de similares</code></pre>

<div class="dato"><strong>El público de "vieron el 50% de un video" es el más subestimado de la lista.</strong>
Es la forma más barata de construir un público tibio grande: un video de captación con buen alcance genera
decenas de miles de personas que <b>demostraron interés real</b> —vieron medio video— sin haber visitado el
sitio. Y esa es exactamente la gente que alimenta la etapa siguiente del embudo.</div>

<h4>Cómo se arma un similar de calidad</h4>
<pre><code>1 · Exportar del sistema los clientes del último año
2 · Ordenar por facturación total, tomar el 10% superior
3 · Subir con la mayor cantidad de campos posible:
      email, teléfono, nombre, apellido, ciudad, país
      → más campos = mejor tasa de coincidencia
4 · Crear el similar al 1-3% del país objetivo
5 · Actualizar la lista cada 3 meses</code></pre>

<div class="dato"><strong>La cantidad de campos que subís determina cuántas personas Meta puede
identificar.</strong> Con solo email, la coincidencia ronda cierto porcentaje; agregando teléfono, nombre y
ciudad sube bastante. Y como el similar se construye sobre <b>los que Meta pudo identificar</b>, ' +
una coincidencia baja significa que el similar se armó sobre una muestra chica y sesgada.</div>

<h4>Exclusiones: la parte que ordena la cuenta</h4>
<table>
<tr><th>Campaña</th><th>Excluir</th></tr>
<tr><td>Captación (frío)</td><td>Compradores 90d · visitantes 30d</td></tr>
<tr><td>Remarketing medio</td><td>Compradores 90d · carritos activos</td></tr>
<tr><td>Remarketing de carrito</td><td>Compradores 30d</td></tr>
<tr><td>Todas</td><td>Empleados, si son muchos</td></tr>
</table>

<div class="dato"><strong>Sin exclusiones entre campañas, las tuyas compiten entre sí en la misma
subasta</b> — y el efecto concreto es que <b>subís tu propio costo</b>. Es de los desperdicios más silenciosos:
no aparece como un error, solo como un CPM más alto de lo que debería.</div>

<h4>Las ubicaciones automáticas</h4>
<p>Meta recomienda dejar que el sistema elija dónde mostrar el anuncio: feed, historias, reels, audiencia,
Messenger. Y en general conviene, con una condición:</p>
<pre><code>Las ubicaciones automáticas funcionan
SI tenés el creativo en los formatos correctos:
  · 1:1 o 4:5 para feed
  · 9:16 para historias y reels

Sin la versión vertical, el sistema recorta el cuadrado
y suele quedar con el texto cortado o el producto fuera de cuadro.</code></pre>

<div class="dato"><strong>Ese recorte automático es la causa más común de creativos que rinden mal sin motivo
aparente.</strong> El anuncio se ve perfecto en el feed y horrible en reels, donde muchas veces está la mayor
parte del alcance. <b>Revisar la vista previa de cada ubicación toma dos minutos</b> y evita gastar semanas de
presupuesto en un anuncio mal recortado.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL ORDEN DE VALOR — y sorprende a quien viene de la publicidad tradicional</text>

  <rect x="24" y="34" width="152" height="60" rx="9" fill="#34d399" fill-opacity=".24" stroke="#34d399" stroke-width="1.8"/>
  <text x="100" y="54" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">PERSONALIZADOS</text>
  <text x="100" y="72" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">datos propios</text>
  <text x="100" y="86" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">lo mejor</text>

  <rect x="188" y="34" width="152" height="60" rx="9" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.3"/>
  <text x="264" y="54" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">SIMILARES</text>
  <text x="264" y="72" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">calidad = calidad del origen</text>

  <rect x="352" y="34" width="152" height="60" rx="9" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="428" y="54" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">AMPLIO</text>
  <text x="428" y="72" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">sin restricciones</text>
  <text x="428" y="86" text-anchor="middle" fill="#22d3ee" font-size="9" font-weight="700">mejor que intereses</text>

  <rect x="516" y="34" width="140" height="60" rx="9" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.3"/>
  <text x="586" y="54" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">INTERESES</text>
  <text x="586" y="72" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">declarados</text>
  <text x="586" y="86" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">en su mayoría, ruido</text>

  <rect x="24" y="106" width="632" height="30" rx="8" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="126" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">
    Un público amplio sin segmentar suele rendir MEJOR que uno armado con intereses.</text>

  <line x1="24" y1="156" x2="656" y2="156" stroke="currentColor" opacity=".18"/>

  <text x="24" y="180" fill="#34d399" font-size="12" font-weight="700">
    EL MEJOR ORIGEN PARA UN SIMILAR NO ES “TODOS LOS COMPRADORES”</text>

  <rect x="24" y="192" width="304" height="60" rx="10" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".28"/>
  <text x="176" y="212" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5" font-weight="700">todos los compradores</text>
  <text x="176" y="234" text-anchor="middle" fill="currentColor" opacity=".62" font-size="10">incluye a los que compran una vez y desaparecen</text>

  <rect x="352" y="192" width="304" height="60" rx="10" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.8"/>
  <text x="504" y="212" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">el 10% QUE MÁS GASTÓ</text>
  <text x="504" y="234" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">busca gente parecida a los que MÁS VALEN</text>

  <rect x="24" y="264" width="632" height="28" rx="7" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="340" y="282" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">
    Cuantos más campos subas (email + teléfono + nombre + ciudad), más gente puede identificar Meta — y mejor sale el similar.</text>

  <rect x="24" y="302" width="304" height="84" rx="10" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="176" y="322" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">EL PÚBLICO MÁS SUBESTIMADO</text>
  <text x="44" y="342" fill="currentColor" opacity=".72" font-size="10.5">“vieron el 50% de un video”</text>
  <text x="44" y="362" fill="#22d3ee" font-size="10.5" font-weight="700">la forma más barata de construir</text>
  <text x="44" y="378" fill="#22d3ee" font-size="10.5" font-weight="700">un público tibio grande</text>

  <rect x="352" y="302" width="304" height="84" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="504" y="322" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">EL DESPERDICIO MÁS SILENCIOSO</text>
  <text x="372" y="342" fill="currentColor" opacity=".72" font-size="10.5">sin exclusiones, tus campañas compiten</text>
  <text x="372" y="360" fill="currentColor" opacity=".72" font-size="10.5">entre sí en la misma subasta</text>
  <text x="372" y="380" fill="#f87171" font-size="10.5" font-weight="700">→ subís tu propio costo, sin ningún error visible</text>
</svg>`,
        pie: 'Sin la versión vertical del creativo, el sistema recorta el cuadrado — y en reels queda el texto cortado.',
      },

      entrevista: [
        { p: '¿Cuál es el orden de valor de los tipos de público?',
          r: '<b>Personalizados &gt; similares &gt; amplio &gt; intereses.</b> Y lo que sorprende a quien viene de la publicidad tradicional es que ' +
             'un público <b>amplio sin ninguna segmentación</b> suele rendir mejor que uno armado con intereses: ' +
             'los intereses declarados son malos predictores de compra y además restringen el volumen que el sistema necesita para aprender. ' +
             'Lo que sí vale es todo lo que se construye con <b>datos propios</b>.' },

        { p: '¿Cuál es el mejor origen para un público similar?',
          r: 'No "todos los compradores" sino el <b>10% que más gastó</b>. Un similar construido sobre esa lista busca gente parecida a los clientes que ' +
             '<b>más valen</b>, no a los que compran una vez y desaparecen. Cuesta lo mismo armarlo y la diferencia es enorme. ' +
             'Y conviene subir la lista con la mayor cantidad de campos posible —email, teléfono, nombre, ciudad— porque ' +
             '<b>el similar se construye sobre las personas que Meta pudo identificar</b>: con poca coincidencia, se arma sobre una muestra chica ' +
             'y sesgada.' },

        { p: '¿Cuál es el público más subestimado?',
          r: 'El de "vieron el 50% de un video". Es <b>la forma más barata de construir un público tibio grande</b>: un video de captación con buen ' +
             'alcance genera decenas de miles de personas que demostraron interés real —vieron medio video— sin haber visitado el sitio. ' +
             'Y es exactamente la gente que alimenta la etapa siguiente del embudo, que es donde los embudos se secan.' },

        { p: '¿Qué pasa si no ponés exclusiones entre campañas?',
          r: 'Que <b>tus propias campañas compiten entre sí en la misma subasta</b>, y el efecto concreto es que <b>subís tu propio costo</b>. ' +
             'Es de los desperdicios más silenciosos que hay: no aparece como un error en ningún lado, solo como un CPM más alto de lo que debería. ' +
             'Lo mínimo es excluir compradores recientes de las campañas de captación y del remarketing.' },
      ],

      practica: `
<h4>Los públicos que hay que crear el primer día</h4>
<pre><code>Personalizados del sitio
  visitantes-30d · visitantes-180d
  vieron-producto-30d
  carrito-7d · carrito-14d
  iniciaron-pago-7d
  compradores-30d · compradores-90d · compradores-365d

De interacción
  video-50-30d · video-75-30d
  interaccion-perfil-90d
  formulario-abierto-sin-enviar-30d

De base propia
  clientes-todos
  clientes-top-10                      ← el mejor origen de similares

Similares
  similar-1-top10 · similar-3-top10
  similar-2-compradores</code></pre>

<div class="aviso"><strong>Crear los públicos <b>antes</b> de necesitarlos es lo que hace posible el
remarketing.</strong> Un público de "visitantes de 180 días" empieza a llenarse desde el momento en que lo
creás, no desde antes. Si lo creás el día que lo querés usar, está vacío — y perdiste seis meses de datos.</div>

<h4>Subir la lista de clientes</h4>
<pre><code>-- El 10% que más gastó, del último año
select email, telefono, nombre, apellido, ciudad, pais
  from clientes c
  join (
    select cliente_id, sum(total) as gastado
      from pedidos where estado = 'pagado'
       and creado_en &gt; now() - interval '1 year'
     group by 1
  ) g on g.cliente_id = c.id
 order by g.gastado desc
 limit (select count(*) / 10 from clientes);</code></pre>

<p>Meta hashea los datos en el navegador antes de subirlos, así que no salen en texto plano. Igual conviene
verificar la política de privacidad y tener base legal para el uso.</p>

<h4>Verificar los formatos del creativo</h4>
<pre><code>Antes de publicar, revisar la vista previa en:
  ☐ Feed de Facebook          1:1 o 4:5
  ☐ Feed de Instagram         1:1 o 4:5
  ☐ Historias                 9:16
  ☐ Reels                     9:16
  ☐ Columna derecha           1:1

Si el texto se corta o el producto queda fuera de cuadro
en alguna, subí la versión específica de ese formato.</code></pre>

<div class="dato"><strong>Este chequeo de dos minutos evita el problema más frecuente de creativos que "rinden
mal sin motivo".</strong> El anuncio se ve perfecto en el feed —que es donde vos lo mirás— y horrible en reels,
donde muchas veces está la mayor parte del alcance.</div>

<h4>Auditoría de públicos</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>¿Está subida la lista de clientes?</td></tr>
<tr><td>☐</td><td>¿Hay un similar del 10% que más gastó?</td></tr>
<tr><td>☐</td><td>¿Se excluyen compradores de las campañas de captación?</td></tr>
<tr><td>☐</td><td>¿Hay exclusiones cruzadas entre campañas?</td></tr>
<tr><td>☐</td><td>¿Existen públicos de video al 50% y 75%?</td></tr>
<tr><td>☐</td><td>¿Los públicos tienen tamaño suficiente (10.000+)?</td></tr>
<tr><td>☐</td><td>¿El creativo está en 1:1 y 9:16?</td></tr>
</table>
`,

      errores: [
        { mito: 'Segmentar por intereses me da un público más calificado.',
          realidad: 'Los intereses declarados son <b>malos predictores de compra</b> y restringen el volumen. Un público amplio suele rendir mejor, ' +
                    'porque el sistema tiene más datos sobre quién compra que los que vos podés expresar.' },

        { mito: 'Hago el similar sobre todos mis compradores.',
          realidad: 'Incluye a quienes compran una vez y desaparecen. El <b>10% que más gastó</b> busca gente parecida a los clientes que más valen, ' +
                    'y cuesta lo mismo armarlo.' },

        { mito: 'Creo los públicos cuando los necesite.',
          realidad: 'Un público de 180 días <b>empieza a llenarse desde que lo creás</b>. Si lo creás el día que lo querés usar, está vacío ' +
                    'y perdiste seis meses de datos.' },

        { mito: 'El creativo cuadrado sirve para todas las ubicaciones.',
          realidad: 'En reels el sistema recorta y suele quedar el texto cortado o el producto fuera de cuadro — y ahí puede estar la mayor parte ' +
                    'del alcance. Revisar la vista previa de cada ubicación toma dos minutos.' },
      ],

      glosario: [
        { t: 'Público personalizado', d: 'Construido con datos propios: sitio, lista de clientes, interacciones.' },
        { t: 'Público similar', d: 'Gente parecida a un público de origen. Su calidad depende del origen.' },
        { t: 'Público guardado', d: 'Armado con intereses, edad y ubicación.' },
        { t: 'Tasa de coincidencia', d: 'Porcentaje de tu lista que Meta pudo identificar.' },
        { t: 'Público amplio', d: 'Sin restricciones de interés. Deja decidir al sistema.' },
        { t: 'Exclusión cruzada', d: 'Evitar que dos campañas propias compitan por la misma persona.' },
        { t: 'Ubicaciones automáticas', d: 'Dejar que el sistema elija dónde mostrar el anuncio.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cómo decide Meta a quién mostrarle un anuncio?',
      opciones: [
        'Observando quién hace la acción que pediste y buscando gente parecida',
        'Por los intereses declarados en el perfil',
        'Por la segmentación demográfica que configuraste',
        'Al azar dentro del público seleccionado',
      ],
      correcta: 0,
      porQue: 'Por eso el evento de optimización es la decisión más importante: si pedís clics, busca gente que hace clic — y hay mucha que hace clic y no compra nunca.',
      porQueNo: {
        1: 'Los intereses son una señal débil comparada con el comportamiento observado.',
        2: 'La demografía acota, pero no es cómo elige dentro de ese grupo.',
        3: 'Explora al principio, pero después optimiza deliberadamente.',
      },
    },
    {
      p: '¿Qué es la consolidación y por qué importa?',
      opciones: [
        'Menos conjuntos con más presupuesto, para superar el umbral de la fase de aprendizaje',
        'Unificar todas las cuentas publicitarias',
        'Usar un solo creativo por campaña',
        'Reducir el presupuesto total',
      ],
      correcta: 0,
      porQue: 'Meta pide del orden de 50 conversiones semanales por conjunto. Si dividís veinte compras entre cuatro conjuntos, ninguno aprende y los cuatro rinden peor.',
      porQueNo: {
        1: 'Es un tema administrativo, no de rendimiento.',
        2: 'Al contrario: conviene tener varios creativos por conjunto.',
        3: 'No tiene que ver con reducir la inversión.',
      },
    },
    {
      p: '¿Por qué un público amplio suele superar a uno segmentado por intereses?',
      opciones: [
        'Porque los intereses declarados son malos predictores y restringen el volumen que el sistema necesita',
        'Porque es más barato',
        'Porque Meta lo prioriza en la subasta',
        'Porque llega a más países',
      ],
      correcta: 0,
      porQue: 'Meta tiene mucha más información sobre quién compra que la que podés expresar con intereses. Restringir es quitarle opciones a un sistema que elige mejor.',
      porQueNo: {
        1: 'El CPM amplio no es necesariamente menor.',
        2: 'No hay priorización por tipo de público.',
        3: 'La ubicación se configura aparte.',
      },
    },
    {
      p: 'Con cinco compras semanales, ¿por qué evento optimizarías?',
      opciones: [
        'Por uno más arriba del embudo, como agregar al carrito, buscando 50+ eventos semanales',
        'Por compra, que es lo que querés',
        'Por clic en el enlace',
        'Por alcance',
      ],
      correcta: 0,
      porQue: 'Optimizar por compra con ese volumen hace que el sistema nunca aprenda. Aproximado con datos gana a exacto sin datos.',
      porQueNo: {
        1: 'Con ese volumen la campaña queda en aprendizaje permanente.',
        2: 'Consigue clics de gente que no compra.',
        3: 'No es una señal de intención.',
      },
    },
    {
      p: '¿Cuál de estas acciones NO reinicia la fase de aprendizaje?',
      opciones: [
        'Agregar un anuncio nuevo al conjunto',
        'Cambiar el público',
        'Editar el texto de un anuncio activo',
        'Subir el presupuesto un 40%',
      ],
      correcta: 0,
      porQue: 'Por eso, si hay que corregir un anuncio, conviene crear uno nuevo corregido y pausar el viejo: editar el activo sí reinicia el aprendizaje.',
      porQueNo: {
        1: 'Es uno de los cambios que más claramente lo reinicia.',
        2: 'Editar un anuncio activo lo reinicia, aunque sea una falta de ortografía.',
        3: 'Los cambios de presupuesto mayores al 20% lo reinician.',
      },
    },
    {
      p: '¿Cuál es el orden de valor de los tipos de público?',
      opciones: [
        'Personalizados > similares > amplio > intereses',
        'Intereses > similares > personalizados > amplio',
        'Amplio > intereses > personalizados > similares',
        'Todos rinden parecido',
      ],
      correcta: 0,
      porQue: 'Lo que sorprende es que amplio esté por encima de intereses: los intereses declarados son malos predictores de compra y además restringen el volumen.',
      porQueNo: {
        1: 'Los intereses son la señal más débil de las cuatro.',
        2: 'Los públicos con datos propios son claramente superiores.',
        3: 'La diferencia entre datos propios e intereses es grande.',
      },
    },
    {
      p: '¿Cuál es el mejor origen para un público similar?',
      opciones: [
        'El 10% de clientes que más gastó',
        'Todos los compradores',
        'Todos los visitantes del sitio',
        'Quienes dieron "me gusta" a la página',
      ],
      correcta: 0,
      porQue: 'Busca gente parecida a los clientes que más valen, no a los que compran una vez y desaparecen. Cuesta lo mismo armarlo y la diferencia es enorme.',
      porQueNo: {
        1: 'Mezcla clientes de valor muy distinto.',
        2: 'Es una señal mucho más débil que una compra.',
        3: 'Un "me gusta" casi no predice comportamiento de compra.',
      },
    },
    {
      p: 'Al subir una lista de clientes, ¿por qué conviene incluir muchos campos?',
      opciones: [
        'Porque el similar se construye sobre las personas que Meta pudo identificar',
        'Porque Meta cobra menos',
        'Porque acelera la aprobación',
        'Porque permite segmentar por esos campos',
      ],
      correcta: 0,
      porQue: 'Con poca coincidencia, el similar se arma sobre una muestra chica y sesgada. Email más teléfono, nombre y ciudad sube bastante la identificación.',
      porQueNo: {
        1: 'Subir listas no tiene costo.',
        2: 'No afecta los tiempos de revisión.',
        3: 'Los campos se usan para coincidir, no para segmentar después.',
      },
    },
    {
      p: '¿Cuál es el público más subestimado y por qué?',
      opciones: [
        '"Vieron el 50% de un video": la forma más barata de construir un público tibio grande',
        'Los que dieron "me gusta"',
        'Los visitantes de 180 días',
        'Los compradores de 365 días',
      ],
      correcta: 0,
      porQue: 'Un video de captación con buen alcance genera decenas de miles de personas que demostraron interés real sin haber visitado el sitio — justo la gente que alimenta la etapa siguiente del embudo.',
      porQueNo: {
        1: 'Es una señal débil de intención.',
        2: 'Es valioso pero mucho más caro de construir.',
        3: 'Sirve sobre todo para excluir y para similares.',
      },
    },
    {
      p: '¿Qué pasa si no ponés exclusiones entre tus campañas?',
      opciones: [
        'Tus propias campañas compiten en la misma subasta y subís tu propio costo',
        'Meta las pausa automáticamente',
        'Se duplican las conversiones',
        'No pasa nada relevante',
      ],
      correcta: 0,
      porQue: 'Es de los desperdicios más silenciosos: no aparece como un error, solo como un CPM más alto de lo que debería.',
      porQueNo: {
        1: 'No hay pausado automático por solapamiento.',
        2: 'La duplicación de conversiones es otro problema, de medición.',
        3: 'El efecto en el costo es concreto.',
      },
    },
    {
      p: '¿Por qué crear los públicos antes de necesitarlos?',
      opciones: [
        'Porque empiezan a llenarse desde que se crean: si lo creás el día que lo usás, está vacío',
        'Porque Meta los aprueba con demora',
        'Porque tienen un costo de creación',
        'Porque expiran cada 30 días',
      ],
      correcta: 0,
      porQue: 'Un público de 180 días creado hoy no tiene los 180 días anteriores. Crear los públicos el primer día es lo que hace posible el remarketing más adelante.',
      porQueNo: {
        1: 'La creación es inmediata.',
        2: 'No tienen costo.',
        3: 'La ventana define la retención, no una expiración del público.',
      },
    },
    {
      p: '¿Cuál es la causa más común de creativos que "rinden mal sin motivo"?',
      opciones: [
        'Falta la versión vertical: el sistema recorta el cuadrado y en reels queda mal',
        'El texto es demasiado largo',
        'El presupuesto es bajo',
        'La marca no aparece al principio',
      ],
      correcta: 0,
      porQue: 'El anuncio se ve perfecto en el feed —que es donde vos lo mirás— y horrible en reels, donde muchas veces está la mayor parte del alcance. Revisar la vista previa toma dos minutos.',
      porQueNo: {
        1: 'Influye, pero es un problema de contenido, no de rendimiento inexplicable.',
        2: 'Limita el volumen, no la calidad del creativo.',
        3: 'Es una buena práctica, no la causa principal.',
      },
    },
    {
      p: '¿Cuándo conviene presupuesto a nivel de campaña y cuándo por conjunto?',
      opciones: [
        'Campaña cuando querés que el sistema reparta; por conjunto cuando necesitás garantizar gasto en uno',
        'Siempre por conjunto, para tener control',
        'Siempre a nivel de campaña',
        'Es indistinto',
      ],
      correcta: 0,
      porQue: 'Un remarketing que no querés que se quede sin presupuesto es el caso típico de presupuesto por conjunto. Para el resto, dejar que el sistema reparta suele rendir más.',
      porQueNo: {
        1: 'Impide que el sistema mueva presupuesto hacia lo que funciona.',
        2: 'Hay casos donde garantizar gasto en un conjunto es necesario.',
        3: 'La diferencia de comportamiento es concreta.',
      },
    },
    {
      p: 'Un anuncio activo tiene una falta de ortografía. ¿Qué hacés?',
      opciones: [
        'Crear uno nuevo corregido y pausar el viejo: editar el activo reinicia el aprendizaje',
        'Editarlo directamente',
        'Dejarlo así hasta el próximo ciclo',
        'Pausar toda la campaña y rehacerla',
      ],
      correcta: 0,
      porQue: 'Agregar un anuncio nuevo no reinicia el aprendizaje y pausar uno tampoco. Editar el activo sí.',
      porQueNo: {
        1: 'Devuelve el conjunto a la fase de aprendizaje.',
        2: 'No hace falta convivir con el error: hay una salida sin costo.',
        3: 'Es mucho más destructivo de lo necesario.',
      },
    },
    {
      p: '¿Qué estructura funciona en la mayoría de los casos?',
      opciones: [
        'Una campaña de captación con un conjunto amplio y varios creativos, más una de remarketing',
        'Cuatro campañas con dos conjuntos cada una, por interés',
        'Un conjunto por cada creativo',
        'Una campaña por producto del catálogo',
      ],
      correcta: 0,
      porQue: 'Cuatro campañas con ocho conjuntos es fragmentación, no sofisticación: el presupuesto se divide y ninguno alcanza el umbral de aprendizaje.',
      porQueNo: {
        1: 'Fragmenta el volumen y ninguno sale de aprendizaje.',
        2: 'Los creativos van juntos en el mismo conjunto para que el sistema elija.',
        3: 'Solo tiene sentido con catálogos grandes y mucho presupuesto.',
      },
    },
  ],
});
