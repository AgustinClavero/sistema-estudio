/* ==========================================================================
   Paid Media · Módulo 02 — Google Ads: búsqueda
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'paidmedia',
  id: 'm02',
  titulo: 'Google Ads: búsqueda',
  fuentes: ['google-ads-ayuda', 'skillshop'],

  intro:
    '<p>La búsqueda es el único canal donde la persona <b>ya te está buscando</b>. Eso lo hace el más rentable y ' +
    'también el más caro: no hay que convencer a nadie de que quiere algo, solo de que lo compre acá.</p>' +
    '<p>Este módulo va sobre lo que decide el resultado: entender la <b>intención</b> detrás de una búsqueda, ' +
    'controlar qué búsquedas activan tus anuncios, y escribir anuncios que la persona sienta escritos para ella.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Intención: la única segmentación que importa',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> en búsqueda no segmentás personas: segmentás
<b>momentos</b>. La misma persona vale muy distinto según lo que esté escribiendo.</div>

<h4>Los cuatro tipos de intención</h4>
<table>
<tr><th>Intención</th><th>Ejemplo</th><th>¿Vale pagar?</th></tr>
<tr><td><b>Transaccional</b></td><td>"comprar zapatillas running talle 42"</td><td>Sí, lo que haga falta</td></tr>
<tr><td><b>Comercial</b></td><td>"mejores zapatillas para correr"</td><td>Sí, con cuidado</td></tr>
<tr><td><b>Informativa</b></td><td>"cómo elegir zapatillas para correr"</td><td>Casi nunca en búsqueda</td></tr>
<tr><td><b>De navegación</b></td><td>"nike argentina"</td><td>Solo si sos vos</td></tr>
</table>

<div class="aviso"><strong>El error más caro es pagar por intención informativa.</strong> Alguien que busca
"cómo elegir zapatillas" está a semanas de comprar, y vas a pagar el clic hoy. Ese tráfico se atiende con
contenido, no con anuncios — y si lo querés en anuncios, va a una campaña aparte con otra expectativa
de resultado.</div>

<h4>Las palabras que revelan la intención</h4>
<pre><code>ALTA intención     comprar · precio · cotizar · cerca de mí · turno
                   envío · promo · descuento · online · &lt;marca&gt; + &lt;producto&gt;

BAJA intención     qué es · cómo · para qué sirve · diferencia entre
                   gratis · manual · tutorial · significado

Excluir casi siempre    gratis · empleo · trabajo · curso · pdf
                        segunda mano · usado · reparación</code></pre>

<div class="dato"><strong>Esa última lista es la que más plata ahorra el primer día.</strong> Sin excluir
"gratis", una campaña de software paga clics de gente que busca exactamente lo contrario a comprar. ' +
Y "empleo" o "trabajo" traen a quien busca trabajar en tu empresa — clic pagado, cero valor.</div>

<h4>La estructura que ordena todo</h4>
<pre><code>Cuenta
 └─ Campaña        = un presupuesto y un objetivo
     └─ Grupo      = un TEMA de búsqueda + sus anuncios
         └─ Palabras clave + anuncios</code></pre>

<p>La regla que ordena el diseño: <b>un grupo, un tema, un anuncio que hable de ese tema</b>. Si en un grupo
tenés "zapatillas running" y "zapatillas fútbol", ningún anuncio puede ser específico para las dos.</p>
`,

      tecnico: `
<h4>Las concordancias, en orden de control</h4>
<table>
<tr><th>Tipo</th><th>Cómo se escribe</th><th>Qué activa</th></tr>
<tr><td><b>Exacta</b></td><td><code>[zapatillas running]</code></td><td>Esa búsqueda y variantes muy cercanas</td></tr>
<tr><td><b>De frase</b></td><td><code>"zapatillas running"</code></td><td>Búsquedas que incluyen ese significado</td></tr>
<tr><td><b>Amplia</b></td><td><code>zapatillas running</code></td><td>Cualquier cosa relacionada</td></tr>
</table>

<div class="dato"><strong>La palabra clave: incluso la exacta <b>ya no es exacta</b>.</strong> Hoy incluye
variantes cercanas, sinónimos y reformulaciones, así que <code>[zapatillas running]</code> puede activarse con
"calzado para correr". Eso significa que <b>el informe de términos de búsqueda dejó de ser opcional</b>: es la
única forma de ver por qué búsquedas estás pagando realmente.</div>

<h4>Estrategia de concordancias que funciona</h4>
<pre><code>Empezar    exacta y de frase, con negativas desde el día 1
Después    agregar amplia SOLO si las pujas son automáticas
           y hay suficientes conversiones para guiarlas

Nunca      amplia con puja manual y sin negativas
           → es la forma más rápida de gastar sin resultado</code></pre>

<h4>Las negativas, que es donde está el trabajo real</h4>
<pre><code>Nivel de cuenta    lo que NUNCA querés: gratis, empleo, curso, pdf
Nivel de campaña   lo que no aplica a esa campaña
Nivel de grupo     para que un grupo no le robe búsquedas a otro</code></pre>

<div class="dato"><strong>El tercer nivel es el que casi nadie usa y el que ordena las cuentas
grandes.</strong> Si tenés un grupo de "zapatillas running" y otro de "zapatillas running mujer", ' +
sin negativas cruzadas los dos compiten por la misma búsqueda y el anuncio que aparece es impredecible. ' +
Agregar <code>[zapatillas running mujer]</code> como negativa exacta en el grupo genérico lo resuelve.</div>

<h4>El informe de términos de búsqueda</h4>
<p>Es la herramienta más importante de toda la cuenta y la que menos se mira. Muestra <b>qué escribió
realmente la gente</b>, que casi nunca coincide con tus palabras clave.</p>
<pre><code>Rutina semanal, 15 minutos:

1 · Abrir el informe de términos de búsqueda
2 · Ordenar por costo, descendente
3 · Por cada término irrelevante → agregarlo como negativa
4 · Por cada término bueno con volumen → agregarlo como palabra clave
5 · Repetir</code></pre>

<div class="dato"><strong>Y hay un límite importante que conocer:</strong> por privacidad, Google
<b>no muestra los términos con poco volumen</b>. Eso significa que una parte del gasto —a veces significativa—
corresponde a búsquedas que <b>no vas a poder ver nunca</b>. Es un argumento fuerte a favor de la concordancia
exacta cuando el presupuesto es acotado.</div>

<h4>Estructura de cuenta</h4>
<pre><code>Campaña: Zapatillas — Búsqueda
  Grupo: running hombre       → [zapatillas running hombre] …
  Grupo: running mujer        → [zapatillas running mujer] …
  Grupo: trail                → [zapatillas trail] …

Campaña: Marca
  Grupo: marca                → [minombre], "minombre zapatillas"
  → separada porque el CPC es bajísimo y mezclarla distorsiona
     el promedio de todo lo demás</code></pre>

<div class="dato"><strong>Separar la campaña de marca no es un capricho de organización:</strong> las
búsquedas de tu propio nombre tienen CPC bajísimo y conversión altísima, así que mezcladas ' +
<b>inflan el promedio de la cuenta</b> y hacen que campañas genéricas malas parezcan aceptables. ' +
Con la marca aparte, ves el rendimiento real de la captación.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EN BÚSQUEDA NO SEGMENTÁS PERSONAS: SEGMENTÁS MOMENTOS</text>

  <rect x="24" y="34" width="152" height="76" rx="10" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.6"/>
  <text x="100" y="54" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">TRANSACCIONAL</text>
  <text x="100" y="72" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9">“comprar zapatillas</text>
  <text x="100" y="84" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9">running talle 42”</text>
  <text x="100" y="102" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">pagá lo que haga falta</text>

  <rect x="188" y="34" width="152" height="76" rx="10" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="264" y="54" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">COMERCIAL</text>
  <text x="264" y="72" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9">“mejores zapatillas</text>
  <text x="264" y="84" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9">para correr”</text>
  <text x="264" y="102" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">sí, con cuidado</text>

  <rect x="352" y="34" width="152" height="76" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.4"/>
  <text x="428" y="54" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">INFORMATIVA</text>
  <text x="428" y="72" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9">“cómo elegir</text>
  <text x="428" y="84" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9">zapatillas”</text>
  <text x="428" y="102" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">contenido, no anuncios</text>

  <rect x="516" y="34" width="140" height="76" rx="10" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="586" y="54" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">NAVEGACIÓN</text>
  <text x="586" y="76" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9">“nike argentina”</text>
  <text x="586" y="102" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">solo si sos vos</text>

  <rect x="24" y="122" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="143" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    Pagar clics de intención informativa es pagar hoy por una compra que está a semanas.</text>

  <line x1="24" y1="176" x2="656" y2="176" stroke="currentColor" opacity=".18"/>

  <text x="24" y="200" fill="#fbbf24" font-size="12" font-weight="700">
    LA CONCORDANCIA EXACTA YA NO ES EXACTA</text>

  <rect x="24" y="212" width="632" height="46" rx="9" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="232" fill="currentColor" opacity=".75" font-size="11">
    <tspan font-family="monospace" font-weight="700">[zapatillas running]</tspan> puede activarse con “calzado para correr”: incluye variantes, sinónimos y reformulaciones.</text>
  <text x="44" y="250" fill="#fbbf24" font-size="11" font-weight="700">
    Por eso el informe de términos de búsqueda dejó de ser opcional: es la única forma de ver por qué pagás.</text>

  <rect x="24" y="268" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="289" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    Y Google NO muestra los términos con poco volumen: parte del gasto corresponde a búsquedas que nunca vas a ver.</text>

  <text x="24" y="326" fill="#34d399" font-size="12" font-weight="700">
    LAS DOS COSAS QUE MÁS PLATA AHORRAN EL PRIMER DÍA</text>

  <rect x="24" y="338" width="304" height="48" rx="9" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="176" y="356" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">NEGATIVAS DE CUENTA</text>
  <text x="44" y="376" fill="currentColor" opacity=".72" font-size="10">gratis · empleo · trabajo · curso · pdf · usado</text>

  <rect x="352" y="338" width="304" height="48" rx="9" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="356" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">CAMPAÑA DE MARCA SEPARADA</text>
  <text x="372" y="376" fill="currentColor" opacity=".72" font-size="10">mezclada, infla el promedio y tapa lo que anda mal</text>
</svg>`,
        pie: 'Un grupo, un tema, un anuncio que hable de ese tema. Si el grupo mezcla temas, ningún anuncio puede ser específico.',
      },

      entrevista: [
        { p: '¿Qué se segmenta realmente en campañas de búsqueda?',
          r: '<b>Momentos, no personas.</b> La misma persona vale muy distinto según lo que esté escribiendo: "cómo elegir zapatillas" es intención ' +
             'informativa y está a semanas de comprar; "comprar zapatillas running talle 42" es transaccional. ' +
             'El error más caro es pagar clics de intención informativa — ese tráfico se atiende con contenido, ' +
             'y si querés atacarlo con anuncios va en una campaña aparte con otra expectativa de resultado.' },

        { p: '¿Por qué el informe de términos de búsqueda es imprescindible hoy?',
          r: 'Porque <b>la concordancia exacta ya no es exacta</b>: incluye variantes cercanas, sinónimos y reformulaciones, ' +
             'así que <code>[zapatillas running]</code> puede activarse con "calzado para correr". El informe es la única forma de ver ' +
             '<b>por qué búsquedas estás pagando realmente</b>. Y hay un límite que conviene conocer: Google no muestra los términos de poco volumen, ' +
             'así que una parte del gasto corresponde a búsquedas que nunca vas a ver — un argumento fuerte a favor de la exacta ' +
             'cuando el presupuesto es acotado.' },

        { p: '¿Qué nivel de negativas casi nadie usa y para qué sirve?',
          r: 'Las negativas <b>a nivel de grupo</b>. Si tenés un grupo de "zapatillas running" y otro de "zapatillas running mujer", sin negativas ' +
             'cruzadas los dos compiten por la misma búsqueda y <b>el anuncio que aparece es impredecible</b>. ' +
             'Agregar la versión más específica como negativa exacta en el grupo genérico lo resuelve, y es lo que ordena las cuentas grandes.' },

        { p: '¿Por qué separar la campaña de marca?',
          r: 'Porque las búsquedas de tu propio nombre tienen <b>CPC bajísimo y conversión altísima</b>. Mezcladas con las genéricas ' +
             '<b>inflan el promedio de toda la cuenta</b> y hacen que campañas de captación malas parezcan aceptables. ' +
             'Con la marca aparte, ves el rendimiento real de lo que trae gente nueva — que es lo que realmente estás tratando de evaluar.' },
      ],

      practica: `
<h4>Negativas de cuenta: la lista base</h4>
<pre><code>gratis · gratuito · free
empleo · trabajo · vacante · sueldo · cv
curso · tutorial · aprender · cómo hacer
pdf · manual · descargar
usado · segunda mano · reparación · repuesto
opiniones · reclamos · estafa
wikipedia · significado · qué es</code></pre>

<div class="aviso"><strong>La última fila merece un matiz.</strong> "Opiniones" y "reclamos" a veces conviene
<b>no</b> excluirlas: quien busca "opiniones sobre &lt;tu marca&gt;" está evaluando comprarte, y mostrarle un
anuncio con reseñas puede ser muy rentable. La exclusión aplica a las opiniones de <b>competidores</b>, ' +
que es otra cosa.</div>

<h4>Rutina semanal de términos de búsqueda</h4>
<pre><code>1 · Campañas → Información → Términos de búsqueda
2 · Rango: últimos 7 días. Ordenar por Costo, descendente
3 · Por cada fila de arriba:
      ¿es relevante?  No → marcar y "Agregar como negativa"
                      Sí, y tiene conversiones → agregar como palabra clave exacta
4 · Revisar también los términos con clics y CERO conversiones
      → suelen ser los que más silenciosamente drenan presupuesto</code></pre>

<div class="dato"><strong>El paso 4 es el que más ahorra y el que nadie hace.</strong> Ordenar por costo
muestra lo caro; ordenar por <b>clics con cero conversiones</b> muestra el goteo constante — términos que
cuestan poco cada uno y suman una parte importante del gasto mensual.</div>

<h4>Estructura de una cuenta chica</h4>
<pre><code>Campaña 1 — Marca                    (5-10% del presupuesto)
  Grupo: marca exacta                [minombre]
  Grupo: marca + producto            "minombre zapatillas"

Campaña 2 — Genéricas alta intención (60%)
  Grupo: comprar zapatillas running  [comprar zapatillas running] …
  Grupo: zapatillas running precio   [zapatillas running precio] …

Campaña 3 — Competencia              (10%, opcional y con cuidado)
  Grupo: competidor A                "competidor A alternativa"

Campaña 4 — Remarketing de búsqueda  (20%)
  Mismas palabras, público que ya visitó, puja más alta</code></pre>

<h4>Verificar que la estructura está sana</h4>
<table>
<tr><th>Señal</th><th>Qué significa</th></tr>
<tr><td>Un grupo con más de 20 palabras clave</td><td>Mezcla temas: el anuncio no puede ser específico</td></tr>
<tr><td>Muchos términos irrelevantes en el informe</td><td>Faltan negativas</td></tr>
<tr><td>CTR menor al 3% en genéricas</td><td>El anuncio no coincide con la búsqueda</td></tr>
<tr><td>La marca mezclada con genéricas</td><td>El promedio está distorsionado</td></tr>
<tr><td>Todas las palabras en amplia con puja manual</td><td>Gasto sin control</td></tr>
</table>
`,

      errores: [
        { mito: 'La concordancia exacta solo activa esa búsqueda.',
          realidad: 'Ya no: incluye variantes cercanas, sinónimos y reformulaciones. Por eso el <b>informe de términos de búsqueda</b> es la ' +
                    'herramienta más importante de la cuenta.' },

        { mito: 'Empiezo con concordancia amplia para juntar datos.',
          realidad: 'Amplia con puja manual y sin negativas es la forma más rápida de gastar sin resultado. Amplia se justifica ' +
                    '<b>con pujas automáticas y suficientes conversiones</b> que las guíen.' },

        { mito: 'Junto todas las palabras en un grupo grande.',
          realidad: 'Si el grupo mezcla temas, <b>ningún anuncio puede ser específico</b> — y la relevancia es lo que baja el costo por clic. ' +
                    'Un grupo, un tema.' },

        { mito: 'La campaña de marca la dejo con las demás.',
          realidad: 'Su CPC bajísimo <b>infla el promedio</b> de la cuenta y hace que campañas de captación malas parezcan aceptables. ' +
                    'Separada, ves el rendimiento real.' },
      ],

      glosario: [
        { t: 'Intención', d: 'Lo que la persona quiere lograr con su búsqueda.' },
        { t: 'Concordancia', d: 'Regla que define qué búsquedas activan una palabra clave.' },
        { t: 'Término de búsqueda', d: 'Lo que la persona escribió realmente, distinto de tu palabra clave.' },
        { t: 'Negativa', d: 'Palabra que impide que tu anuncio se muestre en esas búsquedas.' },
        { t: 'Grupo de anuncios', d: 'Conjunto de palabras de un mismo tema con sus anuncios.' },
        { t: 'Campaña de marca', d: 'La que responde a búsquedas de tu propio nombre.' },
        { t: 'Remarketing de búsqueda', d: 'Pujar más alto por quienes ya visitaron el sitio.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Escribir anuncios que la gente sienta suyos',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el mejor anuncio de búsqueda es el que
<b>repite lo que la persona escribió</b> y agrega la razón para elegirte a vos.</div>

<h4>Por qué funciona repetir la búsqueda</h4>
<p>Alguien escribe "zapatillas running mujer talle 38". Ve tres anuncios:</p>
<pre><code>A: "Zapatillas deportivas | Envío gratis"
B: "Calzado y accesorios | Las mejores marcas"
C: "Zapatillas Running Mujer T.38 | Stock inmediato"

Casi todos hacen clic en C.</code></pre>
<p>No es que C sea más creativo: es que C <b>demuestra que tiene lo que la persona busca</b>. Y además, Google
resalta en negrita las palabras que coinciden con la búsqueda, así que C se ve distinto en la pantalla.</p>

<div class="aviso"><strong>Y eso tiene un efecto directo en el costo:</strong> más clics significa mejor
nivel de calidad, que significa <b>pagar menos por cada clic</b> en todas las subastas de esa palabra. ' +
Escribir bien el anuncio no es solo conseguir más clics: es conseguirlos más baratos.</div>

<h4>La estructura de un anuncio</h4>
<pre><code>Títulos    hasta 15, de 30 caracteres — se muestran 3
Descripciones  hasta 4, de 90 caracteres — se muestran 2
Extensiones    enlaces, textos destacados, llamada, ubicación</code></pre>

<h4>Qué poner en los títulos</h4>
<pre><code>1-3   la búsqueda, casi textual        "Zapatillas Running Mujer"
4-6   el diferencial                    "Envío Gratis 24hs"
7-9   la acción                         "Comprá Online Ahora"
10-12 confianza                         "12 Cuotas Sin Interés"
13-15 urgencia o variantes              "Últimos Talles Disponibles"</code></pre>

<div class="dato"><strong>Escribir menos de diez títulos es dejar rendimiento sobre la mesa.</strong> El
sistema prueba combinaciones y elige la mejor para cada búsqueda; con cuatro títulos tiene muy poco con qué
trabajar. Es la mejora más barata que existe en una cuenta: <b>media hora de escritura</b>.</div>

<h4>Las extensiones, que son gratis</h4>
<p>Ocupan más espacio en la pantalla, dan más razones para hacer clic, y <b>no cuestan nada extra</b>. Un
anuncio sin extensiones ocupa la mitad del espacio que uno con ellas.</p>
`,

      tecnico: `
<h4>Anuncios adaptables: cómo funcionan realmente</h4>
<p>Google prueba combinaciones de tus títulos y descripciones, y aprende cuáles funcionan mejor <b>para cada
búsqueda</b>. Vos controlás dos cosas:</p>
<ul>
<li><b>Fijar posición</b> — obligar a que un título aparezca siempre en la posición 1, 2 o 3.</li>
<li><b>Anclar</b> — asegurar que cierto mensaje siempre esté presente.</li>
</ul>

<div class="dato"><strong>Fijar todo anula el sistema.</strong> Si fijás las tres posiciones, Google no puede
combinar nada y el anuncio adaptable se convierte en un anuncio fijo — perdiendo justamente lo que lo hace
rendir. <b>Fijá como mucho la posición 1</b>, y solo si hay una razón legal o de marca.</div>

<h4>Inserción dinámica de palabra clave</h4>
<pre><code>Título: {KeyWord:Zapatillas Running}

Si la búsqueda coincide con una palabra clave del grupo,
Google inserta esa palabra. Si no entra por longitud,
usa el texto de respaldo.</code></pre>

<div class="dato"><strong>Es potente y peligrosa.</strong> Si el grupo tiene palabras clave mal escritas o con
faltas de ortografía, <b>esas faltas aparecen en tu anuncio</b> — y con concordancias amplias podés terminar
con títulos absurdos. Úsala solo en grupos muy acotados y con palabras clave revisadas una por una.</div>

<h4>Las extensiones, con lo que aporta cada una</h4>
<table>
<tr><th>Extensión</th><th>Qué aporta</th></tr>
<tr><td><b>Enlaces de sitio</b></td><td>Más espacio y rutas alternativas. La de mayor impacto</td></tr>
<tr><td><b>Textos destacados</b></td><td>Beneficios cortos sin enlace: "Envío gratis", "12 cuotas"</td></tr>
<tr><td><b>Fragmentos estructurados</b></td><td>Listas: marcas, servicios, tipos</td></tr>
<tr><td><b>Llamada</b></td><td>Botón de teléfono. Muy efectiva en móvil</td></tr>
<tr><td><b>Ubicación</b></td><td>Imprescindible en negocios con local</td></tr>
<tr><td><b>Precio</b></td><td>Filtra: menos clics, mejor calificados</td></tr>
</table>

<div class="dato"><strong>La extensión de precio hace algo contraintuitivo y muy útil: <b>baja el
CTR</b>.</strong> Quien ve el precio y no le sirve, no hace clic — y eso es exactamente lo que querés, porque
ese clic te iba a costar y no iba a convertir. <b>Menos clics, mejor calificados, mejor CPA.</b></div>

<h4>La página de destino</h4>
<pre><code>❌ Anuncio de "zapatillas running mujer" → home del sitio
✔ Anuncio de "zapatillas running mujer" → listado filtrado de esa categoría

La página debe:
  · repetir el mismo mensaje del anuncio
  · cargar en menos de 2,5 segundos en móvil
  · tener la acción visible sin scrollear
  · no pedir más datos de los necesarios</code></pre>

<div class="dato"><strong>La coherencia entre anuncio y página es parte del nivel de calidad</strong>, así que
mandar todo a la home no solo baja la conversión: <b>sube el costo por clic</b> en todas las subastas de esa
palabra. Es el ejemplo más claro de que la página de destino es una decisión de medios, no solo de diseño.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    BÚSQUEDA: “zapatillas running mujer talle 38”</text>

  <rect x="24" y="34" width="632" height="34" rx="7" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".25"/>
  <text x="40" y="56" fill="currentColor" opacity=".6" font-size="10.5">A · “Zapatillas deportivas | Envío gratis”</text>
  <text x="480" y="56" fill="#f87171" font-size="10" font-weight="700">genérico</text>

  <rect x="24" y="72" width="632" height="34" rx="7" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".25"/>
  <text x="40" y="94" fill="currentColor" opacity=".6" font-size="10.5">B · “Calzado y accesorios | Las mejores marcas”</text>
  <text x="480" y="94" fill="#f87171" font-size="10" font-weight="700">no dice nada</text>

  <rect x="24" y="110" width="632" height="38" rx="7" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.6"/>
  <text x="40" y="134" fill="#34d399" font-size="11" font-weight="700">C · “Zapatillas Running Mujer T.38 | Stock inmediato”</text>
  <text x="480" y="134" fill="#34d399" font-size="10.5" font-weight="700">← casi todos hacen clic acá</text>

  <rect x="24" y="158" width="632" height="46" rx="9" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="44" y="178" fill="#fbbf24" font-size="11.5" font-weight="700">No es que C sea más creativo: DEMUESTRA que tiene lo que la persona busca.</text>
  <text x="44" y="196" fill="currentColor" opacity=".75" font-size="11">
    Y Google resalta en negrita las palabras que coinciden, así que C además <tspan font-weight="700">se ve distinto</tspan> en la pantalla.</text>

  <rect x="24" y="212" width="632" height="30" rx="8" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="340" y="232" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">
    Más clics → mejor nivel de calidad → pagás MENOS por clic. No es solo conseguir clics: es conseguirlos más baratos.</text>

  <line x1="24" y1="262" x2="656" y2="262" stroke="currentColor" opacity=".18"/>

  <text x="24" y="286" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS 15 TÍTULOS — escribir menos de 10 es dejar rendimiento sobre la mesa</text>

  <rect x="24" y="298" width="122" height="46" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.3"/>
  <text x="85" y="316" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">1-3 · la búsqueda</text>
  <text x="85" y="332" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8.5">casi textual</text>

  <rect x="152" y="298" width="122" height="46" rx="8" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="213" y="316" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-weight="700">4-6 · diferencial</text>
  <text x="213" y="332" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8.5">envío gratis 24hs</text>

  <rect x="280" y="298" width="122" height="46" rx="8" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="341" y="316" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">7-9 · acción</text>
  <text x="341" y="332" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8.5">comprá online</text>

  <rect x="408" y="298" width="122" height="46" rx="8" fill="#7c5cff" fill-opacity=".18" stroke="#7c5cff" stroke-width="1.2"/>
  <text x="469" y="316" text-anchor="middle" fill="#7c5cff" font-size="9.5" font-weight="700">10-12 · confianza</text>
  <text x="469" y="332" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8.5">12 cuotas</text>

  <rect x="536" y="298" width="120" height="46" rx="8" fill="#f472b6" fill-opacity=".18" stroke="#f472b6" stroke-width="1.2"/>
  <text x="596" y="316" text-anchor="middle" fill="#f472b6" font-size="9.5" font-weight="700">13-15 · urgencia</text>
  <text x="596" y="332" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8.5">últimos talles</text>

  <rect x="24" y="354" width="632" height="32" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="374" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    Fijar las tres posiciones anula el sistema: el anuncio adaptable se vuelve fijo y pierde lo que lo hace rendir.</text>
</svg>`,
        pie: 'La extensión de precio BAJA el CTR — y eso es bueno: el que no hace clic te iba a costar y no iba a convertir.',
      },

      entrevista: [
        { p: '¿Por qué conviene repetir la búsqueda en el título del anuncio?',
          r: 'Por dos motivos que se suman. <b>Demuestra que tenés lo que la persona busca</b>, y además Google resalta en negrita las palabras que ' +
             'coinciden con la búsqueda, así que el anuncio <b>se ve distinto</b> en la pantalla. El efecto es más clics, y más clics significa ' +
             'mejor nivel de calidad, que significa <b>pagar menos por cada clic</b>. No se trata solo de conseguir clics: ' +
             'se trata de conseguirlos más baratos.' },

        { p: '¿Cómo se aprovecha bien un anuncio adaptable?',
          r: 'Escribiendo <b>al menos diez títulos</b> variados —la búsqueda, el diferencial, la acción, la confianza, la urgencia— para que el sistema ' +
             'tenga con qué combinar. Escribir cuatro es dejar rendimiento sobre la mesa, y es la mejora más barata que hay en una cuenta: ' +
             'media hora de escritura. Y hay algo que <b>no</b> hay que hacer: fijar las tres posiciones. ' +
             'Eso anula el sistema y convierte el anuncio adaptable en uno fijo.' },

        { p: '¿Qué extensión tiene un efecto contraintuitivo y útil?',
          r: 'La de <b>precio</b>: <b>baja el CTR</b>. Quien ve el precio y no le sirve, no hace clic — y eso es exactamente lo que querés, ' +
             'porque ese clic te iba a costar plata y no iba a convertir. <b>Menos clics, mejor calificados, mejor CPA.</b> ' +
             'Es un buen recordatorio de que el CTR es una métrica de diagnóstico, no de decisión: subirlo no siempre es mejor.' },

        { p: '¿Por qué mandar todo el tráfico a la home es un problema de medios y no solo de diseño?',
          r: 'Porque la coherencia entre anuncio y página forma parte del <b>nivel de calidad</b>. Un anuncio de "zapatillas running mujer" que lleva a ' +
             'la home baja ese nivel, y eso <b>sube el costo por clic en todas las subastas de esa palabra</b>. ' +
             'Así que no solo convierte menos: además pagás más por cada visita. Es el ejemplo más claro de que la página de destino ' +
             'es una decisión de medios.' },
      ],

      practica: `
<h4>Plantilla de 15 títulos</h4>
<pre><code>Producto: zapatillas running mujer

 1  Zapatillas Running Mujer          ← la búsqueda
 2  Running Mujer | Todos los Talles
 3  Zapatillas Para Correr Mujer
 4  Envío Gratis en 24 Horas          ← diferencial
 5  12 Cuotas Sin Interés
 6  Cambio Gratis 30 Días
 7  Comprá Online Ahora               ← acción
 8  Ver Modelos y Precios
 9  Elegí Tu Talle Hoy
10  +8.000 Clientes Conformes         ← confianza
11  Distribuidor Oficial
12  Garantía de 1 Año
13  Últimos Talles Disponibles        ← urgencia
14  Stock Limitado
15  Ofertas de Temporada</code></pre>

<div class="aviso"><strong>Escribir estos quince lleva media hora y suele mejorar el CTR entre un 20% y un
40%</strong> respecto de un anuncio con cuatro títulos. Es probablemente la mejor relación entre esfuerzo y
resultado de toda la disciplina.</div>

<h4>Extensiones mínimas</h4>
<pre><code>Enlaces de sitio (4 mínimo)
  · Zapatillas Running    → /running
  · Ofertas               → /ofertas
  · Guía de Talles        → /talles
  · Envíos y Cambios      → /envios

Textos destacados (6-8)
  Envío gratis · 12 cuotas · Cambio gratis · Garantía oficial
  Stock inmediato · Atención por WhatsApp

Fragmento estructurado
  Marcas: Nike, Adidas, Asics, New Balance</code></pre>

<h4>La página de destino que corresponde</h4>
<table>
<tr><th>Anuncio de…</th><th>Página</th></tr>
<tr><td>"zapatillas running mujer"</td><td><code>/zapatillas/running?genero=mujer</code></td></tr>
<tr><td>"zapatillas running talle 38"</td><td>El mismo listado, prefiltrado por talle</td></tr>
<tr><td>Marca genérica</td><td>Home, o mejor una página de categorías</td></tr>
<tr><td>Un producto específico</td><td>La ficha de ese producto</td></tr>
</table>

<h4>Auditoría rápida de anuncios</h4>
<pre><code>Por cada grupo de anuncios:

☐ ¿Hay al menos 10 títulos?
☐ ¿Los primeros 3 contienen la palabra clave del grupo?
☐ ¿Hay 4 descripciones?
☐ ¿Están las extensiones de enlaces y textos destacados?
☐ ¿La página de destino coincide con el mensaje?
☐ ¿La página carga en menos de 2,5 s en móvil?
☐ ¿Hay como mucho UNA posición fijada?
☐ ¿La "eficacia del anuncio" dice "Buena" o "Excelente"?</code></pre>
`,

      errores: [
        { mito: 'Escribo cuatro títulos y con eso alcanza.',
          realidad: 'El sistema prueba combinaciones: con cuatro tiene muy poco con qué trabajar. <b>Diez o más</b> es media hora de escritura ' +
                    'y suele mejorar el CTR entre 20% y 40%.' },

        { mito: 'Fijo las posiciones para controlar el mensaje.',
          realidad: 'Fijar las tres <b>anula el sistema</b>: el anuncio adaptable se convierte en uno fijo. Fijá como mucho la primera, ' +
                    'y solo con una razón legal o de marca.' },

        { mito: 'Un CTR más alto siempre es mejor.',
          realidad: 'La extensión de precio lo <b>baja</b> a propósito, filtrando a quien el precio no le sirve. Menos clics, mejor calificados, ' +
                    'mejor CPA. El CTR es diagnóstico, no decisión.' },

        { mito: 'Mando todo a la home, así ven todo el catálogo.',
          realidad: 'Baja la conversión <b>y sube el costo por clic</b>, porque la coherencia con la búsqueda es parte del nivel de calidad. ' +
                    'La página de destino es una decisión de medios.' },
      ],

      glosario: [
        { t: 'Anuncio adaptable', d: 'Formato donde Google combina tus títulos y descripciones por búsqueda.' },
        { t: 'Título', d: 'Línea de hasta 30 caracteres. Se muestran hasta tres.' },
        { t: 'Extensión', d: 'Elemento extra que ocupa más espacio y no cuesta más.' },
        { t: 'Fijar posición', d: 'Obligar a que un título aparezca siempre en cierto lugar.' },
        { t: 'Inserción dinámica', d: 'Insertar automáticamente la palabra clave en el título.' },
        { t: 'Eficacia del anuncio', d: 'Puntaje de Google sobre la variedad y relevancia de tus recursos.' },
        { t: 'Página de destino', d: 'A dónde llega el clic. Parte del nivel de calidad.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: 'En campañas de búsqueda, ¿qué se segmenta realmente?',
      opciones: [
        'Momentos: la misma persona vale distinto según lo que esté escribiendo',
        'Perfiles demográficos',
        'Intereses declarados',
        'Dispositivos',
      ],
      correcta: 0,
      porQue: '"Cómo elegir zapatillas" está a semanas de comprar; "comprar zapatillas running talle 42" es una compra inminente. La intención es la señal, no la persona.',
      porQueNo: {
        1: 'Se pueden ajustar, pero no son la señal principal.',
        2: 'Eso es propio de campañas de display o redes sociales.',
        3: 'Es un ajuste, no el eje de la segmentación.',
      },
    },
    {
      p: '¿Cuál es el error más caro con la intención de búsqueda?',
      opciones: [
        'Pagar clics de intención informativa, que están a semanas de la compra',
        'Pujar por la propia marca',
        'Usar concordancia exacta',
        'Separar campañas por producto',
      ],
      correcta: 0,
      porQue: 'Ese tráfico se atiende con contenido. Si se ataca con anuncios, va en una campaña aparte y con otra expectativa de resultado.',
      porQueNo: {
        1: 'Suele ser barato y muy rentable, aunque conviene medirlo aparte.',
        2: 'Es la concordancia con más control.',
        3: 'Es buena práctica de estructura.',
      },
    },
    {
      p: '¿Por qué el informe de términos de búsqueda es imprescindible?',
      opciones: [
        'Porque la concordancia exacta ya no es exacta: incluye variantes y sinónimos',
        'Porque muestra el nivel de calidad',
        'Porque calcula el presupuesto óptimo',
        'Porque predice el CTR',
      ],
      correcta: 0,
      porQue: 'Es la única forma de ver por qué búsquedas pagás realmente. Y Google no muestra los términos de poco volumen, así que parte del gasto nunca vas a poder verlo.',
      porQueNo: {
        1: 'El nivel de calidad se ve en la vista de palabras clave.',
        2: 'No sugiere presupuestos.',
        3: 'No hace predicciones.',
      },
    },
    {
      p: '¿Qué nivel de negativas ordena las cuentas grandes y casi nadie usa?',
      opciones: [
        'Las negativas a nivel de grupo, para que un grupo no le robe búsquedas a otro',
        'Las de cuenta',
        'Las de campaña',
        'Las automáticas',
      ],
      correcta: 0,
      porQue: 'Sin negativas cruzadas, un grupo genérico y uno específico compiten por la misma búsqueda y el anuncio que aparece es impredecible.',
      porQueNo: {
        1: 'Son necesarias pero no resuelven la competencia entre grupos.',
        2: 'Tampoco: actúan sobre toda la campaña por igual.',
        3: 'No existen negativas automáticas confiables.',
      },
    },
    {
      p: '¿Por qué separar la campaña de marca?',
      opciones: [
        'Porque su CPC bajísimo infla el promedio y hace que campañas malas parezcan aceptables',
        'Porque Google lo exige',
        'Porque las búsquedas de marca no convierten',
        'Para gastar menos presupuesto',
      ],
      correcta: 0,
      porQue: 'Con la marca aparte, ves el rendimiento real de lo que trae gente nueva, que es lo que estás tratando de evaluar.',
      porQueNo: {
        1: 'No hay ninguna exigencia de la plataforma.',
        2: 'Convierten muchísimo: ese es justamente el problema al mezclarlas.',
        3: 'El gasto se controla con presupuestos, no con la separación.',
      },
    },
    {
      p: '¿Cuándo se justifica la concordancia amplia?',
      opciones: [
        'Con pujas automáticas y suficientes conversiones que las guíen',
        'Al empezar, para juntar datos rápido',
        'Siempre, porque llega a más gente',
        'Con puja manual y presupuesto bajo',
      ],
      correcta: 0,
      porQue: 'Amplia con puja manual y sin negativas es la forma más rápida de gastar sin resultado: no hay nada que oriente al sistema.',
      porQueNo: {
        1: 'Junta datos ruidosos y gasta el presupuesto en búsquedas irrelevantes.',
        2: 'Llegar a más gente sin intención no es una ventaja.',
        3: 'Es la peor combinación posible.',
      },
    },
    {
      p: '¿Por qué conviene repetir la búsqueda en el título del anuncio?',
      opciones: [
        'Demuestra que tenés lo que busca, y Google resalta en negrita las coincidencias',
        'Porque mejora el posicionamiento orgánico',
        'Porque reduce el presupuesto necesario',
        'Porque lo exige la política de anuncios',
      ],
      correcta: 0,
      porQue: 'El anuncio se ve distinto en la pantalla, recibe más clics, y eso mejora el nivel de calidad — con lo cual pagás menos por cada clic.',
      porQueNo: {
        1: 'Los anuncios no afectan el posicionamiento orgánico.',
        2: 'Baja el costo por clic, no el presupuesto necesario.',
        3: 'No es un requisito de política.',
      },
    },
    {
      p: '¿Cuántos títulos conviene escribir en un anuncio adaptable?',
      opciones: [
        'Al menos diez, variados: búsqueda, diferencial, acción, confianza, urgencia',
        'Exactamente tres, los que se muestran',
        'Cuatro alcanza',
        'Quince siempre, aunque se repitan',
      ],
      correcta: 0,
      porQue: 'El sistema prueba combinaciones y elige la mejor por búsqueda. Con cuatro tiene muy poco con qué trabajar, y escribir diez es media hora que suele mejorar el CTR entre 20% y 40%.',
      porQueNo: {
        1: 'Se muestran tres, pero el sistema elige entre todos los que le des.',
        2: 'Limita mucho las combinaciones posibles.',
        3: 'Repetidos no aportan variedad, que es lo que el sistema necesita.',
      },
    },
    {
      p: '¿Qué pasa si fijás las tres posiciones de los títulos?',
      opciones: [
        'Anulás el sistema: el anuncio adaptable se convierte en uno fijo',
        'Mejorás el control sin perder rendimiento',
        'Google lo rechaza',
        'Aumenta el nivel de calidad',
      ],
      correcta: 0,
      porQue: 'Pierde justamente lo que lo hace rendir. Conviene fijar como mucho la primera posición, y solo con una razón legal o de marca.',
      porQueNo: {
        1: 'Se pierde la optimización por búsqueda, que es la ventaja del formato.',
        2: 'Lo permite: la penalización es de rendimiento, no de política.',
        3: 'Tiende a bajarlo, porque los anuncios son menos relevantes por búsqueda.',
      },
    },
    {
      p: '¿Qué extensión baja el CTR a propósito y por qué está bien?',
      opciones: [
        'La de precio: filtra a quien el precio no le sirve, y ese clic iba a costar sin convertir',
        'La de llamada',
        'La de ubicación',
        'Los enlaces de sitio',
      ],
      correcta: 0,
      porQue: 'Menos clics, mejor calificados, mejor CPA. Es un buen recordatorio de que el CTR es una métrica de diagnóstico, no de decisión.',
      porQueNo: {
        1: 'Suele subir la interacción en móvil.',
        2: 'Aporta confianza y suele mejorar el CTR local.',
        3: 'Ocupan más espacio y aumentan el CTR.',
      },
    },
    {
      p: '¿Por qué la página de destino es una decisión de medios?',
      opciones: [
        'Porque la coherencia con la búsqueda es parte del nivel de calidad y afecta el costo por clic',
        'Porque Google la revisa manualmente',
        'Porque determina el presupuesto diario',
        'Porque define la concordancia',
      ],
      correcta: 0,
      porQue: 'Mandar todo a la home no solo baja la conversión: sube el costo por clic en todas las subastas de esa palabra.',
      porQueNo: {
        1: 'La revisión es automática y de políticas, no de relevancia.',
        2: 'El presupuesto lo definís vos.',
        3: 'La concordancia se configura en las palabras clave.',
      },
    },
    {
      p: '¿Cuál es el riesgo de la inserción dinámica de palabra clave?',
      opciones: [
        'Que las faltas de ortografía de tus palabras clave aparezcan en el anuncio',
        'Que Google cobre más por usarla',
        'Que no funcione en móvil',
        'Que reduzca el nivel de calidad automáticamente',
      ],
      correcta: 0,
      porQue: 'Y con concordancias amplias se pueden generar títulos absurdos. Solo conviene en grupos muy acotados y con palabras clave revisadas una por una.',
      porQueNo: {
        1: 'No tiene costo adicional.',
        2: 'Funciona en todos los dispositivos.',
        3: 'Bien usada suele mejorarlo por relevancia.',
      },
    },
    {
      p: 'En el informe de términos de búsqueda, ¿qué revisión es la que más ahorra y nadie hace?',
      opciones: [
        'Ordenar por clics con cero conversiones, para ver el goteo constante',
        'Ordenar por impresiones',
        'Ordenar alfabéticamente',
        'Mirar solo los términos con conversiones',
      ],
      correcta: 0,
      porQue: 'Ordenar por costo muestra lo caro; ordenar por clics sin conversión muestra los términos que cuestan poco cada uno y suman una parte importante del gasto mensual.',
      porQueNo: {
        1: 'Las impresiones sin clics no cuestan.',
        2: 'No prioriza por impacto económico.',
        3: 'Deja fuera exactamente lo que hay que excluir.',
      },
    },
    {
      p: '¿Qué señal indica que un grupo de anuncios está mal armado?',
      opciones: [
        'Tener más de 20 palabras clave de temas distintos: el anuncio no puede ser específico',
        'Tener menos de cinco palabras clave',
        'Tener más de diez títulos',
        'Tener extensiones de sitio',
      ],
      correcta: 0,
      porQue: 'Un grupo, un tema, un anuncio que hable de ese tema. Si mezcla temas, ningún anuncio puede coincidir con la búsqueda — y la relevancia es lo que baja el costo.',
      porQueNo: {
        1: 'Grupos muy acotados suelen rendir mejor.',
        2: 'Es lo recomendable.',
        3: 'Son gratis y aumentan el espacio ocupado.',
      },
    },
    {
      p: '¿Qué exclusión conviene matizar en la lista base de negativas?',
      opciones: [
        '"Opiniones": quien busca opiniones sobre tu propia marca está evaluando comprarte',
        '"Gratis"',
        '"Empleo"',
        '"Pdf"',
      ],
      correcta: 0,
      porQue: 'La exclusión aplica a opiniones de competidores. Mostrarle un anuncio con reseñas a quien busca opiniones sobre vos puede ser muy rentable.',
      porQueNo: {
        1: 'Casi siempre trae a quien busca lo contrario a comprar.',
        2: 'Trae a quien quiere trabajar en tu empresa: clic pagado sin valor.',
        3: 'Indica intención de descarga, no de compra.',
      },
    },
  ],
});
