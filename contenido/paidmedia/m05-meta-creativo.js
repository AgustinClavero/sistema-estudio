/* ==========================================================================
   Paid Media · Módulo 05 — Meta Ads: creatividad, testeo y escalado
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'paidmedia',
  id: 'm05',
  titulo: 'Meta Ads: creatividad, testeo y escalado',
  fuentes: ['meta-ayuda', 'meta-blueprint'],

  intro:
    '<p>Cuando la segmentación se automatiza, la única variable que queda bajo tu control es <b>el creativo</b>. ' +
    'Por eso hoy se dice que el creativo <i>es</i> la segmentación: el video que hacés determina a quién le va ' +
    'a interesar, y el sistema encuentra a esa gente.</p>' +
    '<p>Este módulo va sobre eso — qué hace que un creativo funcione, cómo testear sin engañarse, y cómo escalar ' +
    'sin romper lo que andaba.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'El creativo es la segmentación',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> ya no elegís a quién le hablás con casillas de
segmentación. Lo elegís <b>con lo que decís y cómo lo mostrás</b>, y el sistema busca a quien le resuene.</div>

<h4>Los tres segundos</h4>
<p>En un feed, la persona decide en menos de tres segundos si sigue mirando. Todo lo que importa se juega ahí:</p>
<pre><code>0-3 s    GANCHO      ¿por qué frenar el scroll?
3-10 s   PROBLEMA    ¿esto es sobre mí?
10-20 s  SOLUCIÓN    ¿esto lo resuelve?
20-30 s  ACCIÓN      ¿qué hago ahora?</code></pre>

<div class="aviso"><strong>Y el error más común: empezar por el logo y el nombre de la marca.</strong> A nadie
le importa tu marca en el segundo cero — todavía no le diste ningún motivo. <b>El gancho va primero, la marca
después</b>, cuando ya conseguiste la atención.</div>

<h4>Los ganchos que funcionan</h4>
<table>
<tr><th>Tipo</th><th>Ejemplo</th></tr>
<tr><td><b>Problema directo</b></td><td>"Si te duele la espalda al final del día…"</td></tr>
<tr><td><b>Contraste visual</b></td><td>Antes y después, en el primer segundo</td></tr>
<tr><td><b>Pregunta específica</b></td><td>"¿Sabías que el 70% lo hace mal?"</td></tr>
<tr><td><b>Declaración fuerte</b></td><td>"Dejá de comprar X hasta ver esto"</td></tr>
<tr><td><b>Movimiento inesperado</b></td><td>Algo que rompe el patrón visual del feed</td></tr>
</table>

<h4>Lo que hace que un creativo no funcione</h4>
<ul>
<li>Empieza lento o con un logo animado.</li>
<li>Se ve <b>como un anuncio</b> en un feed lleno de contenido de gente.</li>
<li>Habla del producto antes de que a nadie le importe el producto.</li>
<li>No se entiende <b>sin sonido</b> — la mayoría mira en silencio.</li>
<li>El texto es tan chico que no se lee en un teléfono.</li>
</ul>

<div class="dato"><strong>El punto del sonido es el que más resultados cambia y el más fácil de
arreglar.</strong> La mayoría del consumo en el feed es <b>en silencio</b>, así que un video cuyo mensaje está
en la locución <b>no comunica nada</b>. Subtítulos quemados en el video —no los automáticos— resuelven eso
en una tarde.</div>
`,

      tecnico: `
<h4>Los formatos, y para qué sirve cada uno</h4>
<table>
<tr><th>Formato</th><th>Mejor para</th></tr>
<tr><td><b>Video vertical</b></td><td>Captación en frío. El de mayor alcance</td></tr>
<tr><td><b>Imagen simple</b></td><td>Remarketing, oferta clara, producto conocido</td></tr>
<tr><td><b>Carrusel</b></td><td>Varios productos o pasos de un proceso</td></tr>
<tr><td><b>Colección</b></td><td>Catálogo, con experiencia dentro de la app</td></tr>
<tr><td><b>Contenido de usuario</b></td><td>Confianza. Suele superar a lo producido</td></tr>
</table>

<div class="dato"><strong>Esa última fila es la más importante y la que más cuesta aceptar:</strong> un video
grabado con un teléfono, sin producción, <b>suele rendir mejor</b> que uno con producción profesional. ' +
No porque la calidad no importe, sino porque en un feed de contenido personal, lo producido <b>se ve como un
anuncio</b> — y lo que se ve como anuncio se saltea.</div>

<h4>La estructura de un video que funciona</h4>
<pre><code>0-1 s    algo que rompe el patrón: movimiento, cara, texto grande
1-3 s    el problema, en palabras de la persona
3-8 s    "esto es para vos si…" — que se identifique
8-15 s   la solución, mostrando el producto EN USO
15-22 s  prueba: testimonio, número, demostración
22-28 s  la acción, con el beneficio repetido

Con subtítulos SIEMPRE. Quemados, no los automáticos.</code></pre>

<h4>El texto del anuncio</h4>
<pre><code>Primera línea    lo único que se ve sin tocar "ver más"
                 → tiene que funcionar sola

Cuerpo           desarrollo, para quien ya se interesó
Última línea     la acción

❌ "En XYZ nos dedicamos hace 20 años a…"
✔ "Tu espalda no duele por la postura. Duele por esto:"</code></pre>

<div class="dato"><strong>La primera línea es literalmente lo único que ve la mayoría</strong>, y es donde casi
todo el mundo pone la presentación de la empresa. Reescribirla para que funcione sola ' +
—como un titular, no como una introducción— es de los cambios más baratos con más impacto.</div>

<h4>Producir variedad, no perfección</h4>
<pre><code>Mejor: 5 creativos de calidad media con ganchos DISTINTOS
Peor:  1 creativo excelente

Motivo: no sabés cuál va a funcionar, y el sistema
        necesita opciones para encontrar públicos distintos.</code></pre>

<div class="dato"><strong>Y el matiz que importa: variedad significa <b>ángulos distintos</b>, no colores
distintos.</strong> Cinco versiones del mismo video con otro texto no son cinco creativos: son uno. ' +
La variedad que sirve es la de <b>argumento</b> —problema, precio, prueba social, comparación, aspiración—
porque cada ángulo le habla a un público distinto.</div>

<h4>La fatiga creativa</h4>
<table>
<tr><th>Señal</th><th>Qué indica</th></tr>
<tr><td>CTR cae más del 30% en 7 días</td><td>Fatiga clara</td></tr>
<tr><td>Frecuencia por encima de 5</td><td>Demasiada repetición</td></tr>
<tr><td>CPM sube sin que cambie el público</td><td>El sistema tiene que insistir más</td></tr>
<tr><td>Cae la tasa de retención del video</td><td>Ya lo vieron</td></tr>
</table>

<div class="dato"><strong>La fatiga no se arregla subiendo el presupuesto ni cambiando el público: se arregla
con creativo nuevo.</strong> Y por eso conviene tener una <b>rutina de producción</b> —dos o tres creativos
nuevos por mes como mínimo— en vez de producir solo cuando el rendimiento ya cayó. ' +
Producir a las apuradas, con el resultado bajando, es cuando peor sale.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS PRIMEROS TRES SEGUNDOS DECIDEN TODO</text>

  <rect x="24" y="34" width="152" height="70" rx="9" fill="#f472b6" fill-opacity=".24" stroke="#f472b6" stroke-width="1.8"/>
  <text x="100" y="54" text-anchor="middle" fill="#f472b6" font-size="11" font-weight="700">0-3 s · GANCHO</text>
  <text x="100" y="74" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9.5">¿por qué frenar</text>
  <text x="100" y="88" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9.5">el scroll?</text>

  <rect x="188" y="34" width="152" height="70" rx="9" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="264" y="54" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">3-10 s · PROBLEMA</text>
  <text x="264" y="76" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9.5">¿esto es sobre mí?</text>

  <rect x="352" y="34" width="152" height="70" rx="9" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="428" y="54" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">10-20 s · SOLUCIÓN</text>
  <text x="428" y="76" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9.5">el producto EN USO</text>

  <rect x="516" y="34" width="140" height="70" rx="9" fill="#34d399" fill-opacity=".18" stroke="#34d399" stroke-width="1.3"/>
  <text x="586" y="54" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">20-30 s · ACCIÓN</text>
  <text x="586" y="76" text-anchor="middle" fill="currentColor" opacity=".68" font-size="9.5">¿qué hago ahora?</text>

  <rect x="24" y="116" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="137" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    El error más común: empezar por el logo. A nadie le importa tu marca en el segundo cero.</text>

  <line x1="24" y1="168" x2="656" y2="168" stroke="currentColor" opacity=".18"/>

  <rect x="24" y="180" width="632" height="46" rx="9" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.6"/>
  <text x="44" y="200" fill="#34d399" font-size="12" font-weight="700">EL ARREGLO MÁS BARATO CON MÁS IMPACTO: SUBTÍTULOS QUEMADOS</text>
  <text x="44" y="218" fill="currentColor" opacity=".78" font-size="11">
    La mayoría del consumo en el feed es <tspan font-weight="700">en silencio</tspan>. Un video cuyo mensaje está en la locución no comunica nada.</text>

  <text x="24" y="252" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    VARIEDAD ≠ VARIANTES</text>

  <rect x="24" y="264" width="304" height="70" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="284" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">✗ 5 versiones del mismo video</text>
  <text x="44" y="304" fill="currentColor" opacity=".7" font-size="10">otro texto · otro color · otra música</text>
  <text x="44" y="322" fill="#f87171" font-size="10.5" font-weight="700">no son cinco creativos: es uno</text>

  <rect x="352" y="264" width="304" height="70" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.5"/>
  <text x="504" y="284" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">✓ 5 ÁNGULOS distintos</text>
  <text x="372" y="304" fill="currentColor" opacity=".7" font-size="10">problema · precio · prueba social · comparación</text>
  <text x="372" y="322" fill="#34d399" font-size="10.5" font-weight="700">cada ángulo le habla a un público distinto</text>

  <rect x="24" y="346" width="632" height="40" rx="9" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="364" fill="#fbbf24" font-size="11.5" font-weight="700">LA FATIGA NO SE ARREGLA CON PRESUPUESTO NI CON PÚBLICO: SE ARREGLA CON CREATIVO NUEVO.</text>
  <text x="44" y="380" fill="currentColor" opacity=".75" font-size="10.5">
    Por eso conviene una rutina de producción. Producir a las apuradas, con el resultado ya cayendo, es cuando peor sale.</text>
</svg>`,
        pie: 'Un video grabado con un teléfono suele rendir más que uno producido: lo producido se ve como un anuncio.',
      },

      entrevista: [
        { p: '¿Qué significa que "el creativo es la segmentación"?',
          r: 'Que cuando la segmentación se automatiza, la variable que queda bajo tu control es el creativo — y ' +
             '<b>el video que hacés determina a quién le va a interesar</b>, que es a quien el sistema va a salir a buscar. ' +
             'Ya no elegís a quién le hablás con casillas: lo elegís con lo que decís y cómo lo mostrás. ' +
             'Por eso la variedad que importa es la de <b>ángulo</b> —problema, precio, prueba social— y no la de color o música.' },

        { p: '¿Cuál es el arreglo más barato con más impacto en un creativo?',
          r: 'Poner <b>subtítulos quemados</b> en el video. La mayoría del consumo en el feed es <b>en silencio</b>, así que un video cuyo mensaje ' +
             'está en la locución <b>no comunica nada</b> a la mayor parte de la gente que lo ve. ' +
             'Los automáticos no alcanzan porque no siempre se activan: hay que quemarlos en el archivo. ' +
             'Es una tarde de trabajo y suele mover el resultado más que cualquier ajuste de campaña.' },

        { p: '¿Por qué un video grabado con teléfono suele superar a uno producido?',
          r: 'Porque en un feed lleno de contenido personal, <b>lo producido se ve como un anuncio</b> — y lo que se ve como anuncio se saltea. ' +
             'No es que la calidad no importe: es que el contexto premia lo que parece contenido. ' +
             'Es la conclusión que más cuesta aceptar, sobre todo cuando hay presupuesto de producción disponible, ' +
             'y es de las más consistentes que se observan.' },

        { p: '¿Cómo se maneja la fatiga creativa?',
          r: 'Con <b>creativo nuevo</b>: no se arregla subiendo el presupuesto ni cambiando el público. Las señales son CTR que cae más del 30% ' +
             'en una semana, frecuencia por encima de cinco, y CPM que sube sin que cambie el público. ' +
             'Y lo importante es tener una <b>rutina de producción</b> —dos o tres creativos nuevos por mes— en vez de producir solo cuando el ' +
             'rendimiento ya cayó: producir a las apuradas, con el resultado bajando, es cuando peor sale.' },
      ],

      practica: `
<h4>Guion de un video de 30 segundos</h4>
<pre><code>[0-1 s]   Plano cerrado de la persona, hablando ya. Sin logo, sin intro.
          Texto grande en pantalla: "Esto lo hacía mal hace 10 años"

[1-4 s]   "Si te duele la espalda al final del día, no es la postura."

[4-10 s]  "Es que tu silla te obliga a apoyar el peso acá."
          (muestra, señalando)

[10-18 s] "Este apoyo cambia el punto de carga."
          (producto EN USO, no en fondo blanco)

[18-24 s] "Lo probé tres semanas. Dejé de terminar el día así."
          (testimonio, o número: 8.000 personas)

[24-30 s] "Está en el enlace. Envío en 24 h."

Subtítulos quemados en TODO el video.
Versión 9:16 y versión 1:1.</code></pre>

<div class="aviso"><strong>Fijate que el producto aparece recién en el segundo 10.</strong> Los primeros diez
segundos son <b>sobre la persona</b>, no sobre el producto — y ese es el orden que hace que alguien que no te
conoce siga mirando.</div>

<h4>Los cinco ángulos para producir variedad real</h4>
<table>
<tr><th>Ángulo</th><th>Gancho</th></tr>
<tr><td><b>Problema</b></td><td>"Si te pasa esto…"</td></tr>
<tr><td><b>Prueba social</b></td><td>"8.000 personas ya…"</td></tr>
<tr><td><b>Comparación</b></td><td>"La diferencia entre X e Y"</td></tr>
<tr><td><b>Precio</b></td><td>"Cuesta menos que un café por día"</td></tr>
<tr><td><b>Aspiración</b></td><td>"Así se siente cuando…"</td></tr>
</table>

<h4>Primera línea del texto: antes y después</h4>
<pre><code>❌ "En Muebles XYZ nos dedicamos hace más de 20 años a la fabricación…"
✔ "Tu espalda no duele por la postura. Duele por esto:"

❌ "Presentamos nuestra nueva colección de sillas ergonómicas"
✔ "Probé 7 sillas de oficina. Solo una aguantó 8 horas."

❌ "¡Aprovechá nuestras ofertas!"
✔ "El 70% compra la silla equivocada. Cómo evitarlo:"</code></pre>

<h4>Producción mínima sostenible</h4>
<pre><code>Por mes:
  2-3 videos nuevos con ángulos distintos
  4-6 variantes de texto sobre los que funcionan
  1 pieza de contenido de usuario, si se consigue

Reciclar:
  · el creativo que funcionó hace 3 meses suele volver a funcionar
  · rehacer el gancho de un video que rendía y se fatigó</code></pre>

<div class="dato"><strong>Ese último punto ahorra muchísimo trabajo:</strong> un video que rindió y se fatigó
sigue siendo bueno — lo que se gastó fue el <b>gancho</b> para ese público. Cambiar solo los primeros tres
segundos y dejar el resto suele recuperar buena parte del rendimiento por una fracción del esfuerzo.</div>
`,

      errores: [
        { mito: 'El video tiene que empezar con la marca para que la reconozcan.',
          realidad: 'A nadie le importa tu marca en el segundo cero: todavía no le diste ningún motivo. <b>El gancho va primero</b>, ' +
                    'la marca después, cuando ya conseguiste la atención.' },

        { mito: 'El audio explica todo, no hacen falta subtítulos.',
          realidad: 'La mayoría del consumo en el feed es <b>en silencio</b>. Un mensaje que vive en la locución no comunica nada, ' +
                    'y los subtítulos automáticos no siempre se activan: hay que quemarlos.' },

        { mito: 'Hago cinco variantes cambiando el texto y el color.',
          realidad: 'Eso es <b>un creativo</b>, no cinco. La variedad que sirve es la de <b>ángulo</b> —problema, precio, prueba social— ' +
                    'porque cada ángulo le habla a un público distinto.' },

        { mito: 'Cuando el rendimiento cae, subo el presupuesto o cambio el público.',
          realidad: 'Si es fatiga creativa, ninguna de las dos cosas ayuda: hace falta <b>creativo nuevo</b>. Y producirlo con el resultado ' +
                    'ya cayendo es cuando peor sale — por eso conviene una rutina mensual.' },
      ],

      glosario: [
        { t: 'Gancho', d: 'Los primeros segundos que deciden si la persona sigue mirando.' },
        { t: 'Ángulo', d: 'El argumento del creativo: problema, precio, prueba social, comparación.' },
        { t: 'Subtítulos quemados', d: 'Incrustados en el video, no dependen de que el sistema los active.' },
        { t: 'Contenido de usuario', d: 'Material que parece grabado por una persona, no producido.' },
        { t: 'Fatiga creativa', d: 'Caída de rendimiento por exceso de repetición del mismo creativo.' },
        { t: 'Frecuencia', d: 'Cuántas veces vio el anuncio la misma persona.' },
        { t: 'Retención', d: 'Qué proporción del video se mira antes de saltearlo.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Testear y escalar sin romper',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> escalar no es "subir el presupuesto". Es
<b>encontrar más gente</b> sin que el costo se dispare — y hay dos formas de hacerlo, con resultados muy
distintos.</div>

<h4>Las dos formas de escalar</h4>
<p><b>Vertical</b> — subir el presupuesto de lo que ya funciona. Rápido, y tiene techo: el sistema tiene que
llegar a gente cada vez menos ideal, y el costo sube.</p>

<p><b>Horizontal</b> — agregar creativos y públicos nuevos. Más lento, y es lo que realmente hace crecer.</p>

<div class="aviso"><strong>La regla del 20%: no subas el presupuesto más de un 20% cada tres o cuatro
días.</strong> Un salto mayor <b>reinicia la fase de aprendizaje</b>, y el rendimiento cae justo cuando estabas
escalando — lo que da la impresión de que "la campaña no aguanta más presupuesto" cuando en realidad la
rompiste vos.</div>

<h4>Testear sin engañarse</h4>
<p>El error más caro del testeo es declarar un ganador con muy pocos datos:</p>
<pre><code>Creativo A: 12 conversiones
Creativo B:  9 conversiones

"A es 33% mejor" → NO. Eso es ruido.</code></pre>

<p>Hacen falta del orden de <b>100 conversiones por variante</b>, o mil clics si comparás CTR. Con menos, la
diferencia que ves es azar.</p>

<h4>Cómo testear en la práctica</h4>
<pre><code>❌ Un conjunto por creativo, con el presupuesto dividido
   → ninguno aprende, y comparás ruido

✔ Todos los creativos en el MISMO conjunto
   → el sistema reparte hacia el que funciona
   → y vos leés el resultado después</code></pre>

<div class="dato"><strong>Esto contradice el instinto de "hacer un test A/B limpio", y con razón:</strong>
el sistema <b>ya está optimizando</b>. Ponerlos juntos aprovecha eso; separarlos en conjuntos con presupuesto
propio fragmenta el volumen y hace que ninguno aprenda — con lo cual el "test limpio" mide sobre todo la
fase de aprendizaje.</div>
`,

      tecnico: `
<h4>El orden de escalado</h4>
<pre><code>1 · Agregar creativos nuevos al conjunto que funciona
      → gratis, sin riesgo, y suele dar el mayor salto

2 · Subir el presupuesto un 20% cada 3-4 días
      → mientras el CPA se mantenga

3 · Ampliar el público (de similar 1% a 3%, o a amplio)
      → cuando el CPM empieza a subir por saturación

4 · Agregar ubicaciones o formatos nuevos
      → reels, historias, si no estaban

5 · Duplicar el conjunto que funciona
      → último recurso: compite consigo mismo</code></pre>

<div class="dato"><strong>El paso 1 es el que más rinde y el que menos se hace.</strong> Sumar creativos a un
conjunto que ya aprendió <b>no reinicia nada</b> y le da al sistema más opciones para encontrar públicos
nuevos. Es literalmente escalar sin costo ni riesgo, y suele dar más que subir el presupuesto.</div>

<h4>Cuándo el escalado vertical llegó al techo</h4>
<table>
<tr><th>Señal</th><th>Qué significa</th></tr>
<tr><td>Subís 20% y el CPA sube más de 15%</td><td>Estás en el techo del público</td></tr>
<tr><td>La frecuencia sube rápido</td><td>El público es chico para ese presupuesto</td></tr>
<tr><td>El CPM sube sin cambiar nada</td><td>Saturación</td></tr>
<tr><td>El alcance no crece con más presupuesto</td><td>Se agotó el público disponible</td></tr>
</table>

<div class="dato"><strong>Cuando aparece cualquiera de esas señales, seguir subiendo el presupuesto solo
empeora las cosas.</strong> Lo que corresponde es <b>escalar horizontalmente</b>: creativos nuevos, ángulos
nuevos, públicos más amplios. El techo no es de la campaña: es de <b>ese público con ese creativo</b>.</div>

<h4>Leer un test correctamente</h4>
<pre><code>Con menos de 50 conversiones por variante:
   NO decidas. Dejá correr.

Con 50-100:
   Diferencias mayores al 30% son sugerentes, no concluyentes.

Con 100+:
   Diferencias mayores al 20% son accionables.

Y mirá SIEMPRE la métrica de decisión (CPA, ROAS),
no la de diagnóstico (CTR).</code></pre>

<div class="dato"><strong>La última línea evita el error más frustrante:</strong> apagar el creativo con menos
CTR y descubrir después que era el que más vendía. <b>Un CTR bajo con buena conversión suele significar que el
creativo filtra bien</b> — atrae a menos gente, pero a la correcta.</div>

<h4>Qué hacer con los perdedores</h4>
<pre><code>· Pausarlos, no borrarlos: sirven de referencia
· Guardar QUÉ ángulo era, no solo el resultado
· Un creativo que perdió hoy puede ganar en otra estación
  o con otro público

Documentar en una tabla simple:
  fecha · ángulo · gancho · CPA · veredicto</code></pre>

<div class="dato"><strong>Esa tabla es el activo más valioso que se construye con el tiempo.</strong> Después
de veinte tests, muestra <b>qué ángulos funcionan con tu público</b> — y eso vale muchísimo más que cualquier
creativo individual, porque orienta toda la producción futura.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="ec1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS DOS FORMAS DE ESCALAR</text>

  <rect x="24" y="34" width="304" height="86" rx="10" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="176" y="54" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">VERTICAL — subir presupuesto</text>
  <text x="44" y="74" fill="currentColor" opacity=".72" font-size="10.5">rápido, y tiene TECHO</text>
  <text x="44" y="92" fill="currentColor" opacity=".72" font-size="10.5">el sistema llega a gente menos ideal</text>
  <text x="44" y="110" fill="#f87171" font-size="10.5" font-weight="700">máximo 20% cada 3-4 días</text>

  <rect x="352" y="34" width="304" height="86" rx="10" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.6"/>
  <text x="504" y="54" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">HORIZONTAL — creativos y públicos</text>
  <text x="372" y="74" fill="currentColor" opacity=".72" font-size="10.5">más lento</text>
  <text x="372" y="92" fill="#34d399" font-size="10.5" font-weight="700">es lo que realmente hace crecer</text>
  <text x="372" y="110" fill="currentColor" opacity=".62" font-size="10">y agregar creativos no reinicia nada</text>

  <rect x="24" y="132" width="632" height="34" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="340" y="153" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    Un salto grande reinicia el aprendizaje: parece que “no aguanta más presupuesto” cuando la rompiste vos.</text>

  <line x1="24" y1="184" x2="656" y2="184" stroke="currentColor" opacity=".18"/>

  <text x="24" y="208" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CÓMO TESTEAR — esto contradice el instinto, y con razón</text>

  <rect x="24" y="220" width="304" height="80" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="240" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">✗ un conjunto por creativo</text>
  <rect x="44" y="250" width="60" height="14" rx="3" fill="#f87171" fill-opacity=".3"/>
  <rect x="112" y="250" width="60" height="14" rx="3" fill="#f87171" fill-opacity=".3"/>
  <rect x="180" y="250" width="60" height="14" rx="3" fill="#f87171" fill-opacity=".3"/>
  <rect x="248" y="250" width="60" height="14" rx="3" fill="#f87171" fill-opacity=".3"/>
  <text x="176" y="280" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">ninguno aprende</text>
  <text x="176" y="294" text-anchor="middle" fill="currentColor" opacity=".62" font-size="9.5">el “test limpio” mide la fase de aprendizaje</text>

  <rect x="352" y="220" width="304" height="80" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.6"/>
  <text x="504" y="240" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">✓ todos en el MISMO conjunto</text>
  <rect x="372" y="250" width="264" height="18" rx="4" fill="#34d399" fill-opacity=".35"/>
  <text x="504" y="263" text-anchor="middle" fill="#06281c" font-size="9" font-weight="700">presupuesto completo · 5 creativos</text>
  <text x="504" y="284" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">el sistema ya está optimizando: aprovechalo</text>

  <rect x="24" y="312" width="304" height="74" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="176" y="332" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">12 vs 9 CONVERSIONES NO ES UNA DIFERENCIA</text>
  <text x="44" y="352" fill="currentColor" opacity=".72" font-size="10">hacen falta ~100 por variante</text>
  <text x="44" y="372" fill="#fbbf24" font-size="10" font-weight="700">con menos, lo que ves es azar</text>

  <rect x="352" y="312" width="304" height="74" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="504" y="332" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">MIRÁ CPA, NO CTR</text>
  <text x="372" y="352" fill="currentColor" opacity=".72" font-size="10">apagar el de menor CTR y descubrir</text>
  <text x="372" y="366" fill="currentColor" opacity=".72" font-size="10">que era el que más vendía…</text>
  <text x="372" y="382" fill="#7c5cff" font-size="10" font-weight="700">un CTR bajo con buena conversión FILTRA bien</text>
</svg>`,
        pie: 'Agregar creativos a un conjunto que ya aprendió no reinicia nada, y suele dar más que subir el presupuesto.',
      },

      entrevista: [
        { p: '¿Cuáles son las dos formas de escalar y cuál hace crecer de verdad?',
          r: '<b>Vertical</b> es subir el presupuesto de lo que funciona: es rápido y tiene techo, porque el sistema tiene que llegar a gente cada vez ' +
             'menos ideal y el costo sube. <b>Horizontal</b> es agregar creativos y públicos nuevos: es más lento y <b>es lo que realmente hace ' +
             'crecer</b>. Y hay una regla de seguridad para el vertical: no más de 20% cada tres o cuatro días, ' +
             'porque un salto mayor reinicia el aprendizaje — y ahí parece que "la campaña no aguanta más presupuesto" cuando la rompiste vos.' },

        { p: '¿Cuál es el paso de escalado que más rinde y menos se hace?',
          r: '<b>Agregar creativos nuevos al conjunto que ya funciona.</b> No reinicia el aprendizaje, no cuesta presupuesto extra, ' +
             'y le da al sistema más opciones para encontrar públicos nuevos. Es literalmente escalar sin costo ni riesgo, ' +
             'y suele dar un salto mayor que subir el presupuesto — que es lo primero que todo el mundo intenta.' },

        { p: '¿Cómo se testean creativos correctamente en Meta?',
          r: '<b>Todos en el mismo conjunto</b>, dejando que el sistema reparta hacia el que funciona. Esto contradice el instinto de armar un test A/B ' +
             'limpio con un conjunto por creativo, y con razón: <b>el sistema ya está optimizando</b>. ' +
             'Separarlos fragmenta el volumen y hace que ninguno salga de la fase de aprendizaje, ' +
             'con lo cual el "test limpio" termina midiendo sobre todo el aprendizaje y no el creativo.' },

        { p: '¿Qué métrica mirás para decidir entre creativos?',
          r: 'La de <b>decisión</b> —CPA o ROAS— y no la de diagnóstico. El error más frustrante es apagar el creativo con menos CTR y descubrir ' +
             'después que era el que más vendía: <b>un CTR bajo con buena conversión suele significar que el creativo filtra bien</b>, ' +
             'atrayendo a menos gente pero a la correcta. Y hace falta volumen: del orden de cien conversiones por variante, ' +
             'porque doce contra nueve es ruido.' },
      ],

      practica: `
<h4>Rutina de escalado</h4>
<pre><code>Semana 1  · Conjunto con 5 creativos, presupuesto base
          · No tocar

Semana 2  · Leer resultados: ¿hay 100+ conversiones en total?
          · Pausar los 1-2 claramente peores (por CPA, no por CTR)
          · Agregar 2 creativos nuevos con ángulos distintos

Semana 3  · Si el CPA se mantiene: +20% de presupuesto
          · Si subió: no tocar el presupuesto, agregar creativo

Semana 4  · Repetir</code></pre>

<div class="aviso"><strong>El "no tocar" de la semana 1 es la parte más difícil y la más importante.</strong>
Cada intervención reinicia el aprendizaje, y con el aprendizaje reiniciado el rendimiento empeora — ' +
lo que genera la urgencia de intervenir otra vez. Ese círculo explica muchas cuentas que nunca despegan.</div>

<h4>Tabla de aprendizajes creativos</h4>
<pre><code>| Fecha  | Ángulo        | Gancho                          | CPA    | Veredicto |
|--------|---------------|---------------------------------|--------|-----------|
| 03/06  | problema      | "Si te duele la espalda…"       | 6.200  | ✔ ganador |
| 03/06  | precio        | "Menos que un café por día"     | 11.400 | ✘         |
| 17/06  | prueba social | "8.000 personas ya…"            | 7.100  | ✔         |
| 17/06  | comparación   | "La diferencia entre X e Y"     | 15.800 | ✘         |
| 01/07  | problema (v2) | "Tu silla te obliga a…"         | 5.400  | ✔ mejor   |

Conclusión tras 5 tests: el ángulo PROBLEMA funciona con este público.
La comparación no. → producir más de problema.</code></pre>

<div class="dato"><strong>Esa conclusión final vale más que cualquier creativo individual.</strong> Saber que
tu público responde al ángulo de problema y no al de comparación <b>orienta toda la producción futura</b> — ' +
y es un aprendizaje que se acumula, a diferencia de un creativo que se fatiga.</div>

<h4>Diagnóstico al escalar</h4>
<table>
<tr><th>Al subir presupuesto…</th><th>Qué hacer</th></tr>
<tr><td>El CPA se mantiene</td><td>Seguir subiendo, 20% cada 3-4 días</td></tr>
<tr><td>El CPA sube menos del 15%</td><td>Aceptable si el volumen compensa</td></tr>
<tr><td>El CPA sube más del 15%</td><td>Volver atrás y escalar horizontal</td></tr>
<tr><td>La frecuencia se dispara</td><td>Público chico: ampliar</td></tr>
<tr><td>El alcance no crece</td><td>Público agotado: creativo o público nuevo</td></tr>
</table>

<h4>Reciclar un creativo fatigado</h4>
<pre><code>Un video que rindió y se fatigó sigue siendo bueno:
lo que se gastó es el GANCHO para ese público.

1 · Cambiar solo los primeros 3 segundos
2 · Dejar el resto igual
3 · Subirlo como creativo nuevo

Suele recuperar buena parte del rendimiento
por una fracción del esfuerzo de producir uno nuevo.</code></pre>
`,

      errores: [
        { mito: 'Para escalar, subo el presupuesto.',
          realidad: 'Tiene techo y hay que hacerlo <b>de a 20% cada 3-4 días</b>: un salto mayor reinicia el aprendizaje. ' +
                    'Lo que hace crecer de verdad es <b>agregar creativos y públicos</b>.' },

        { mito: 'Para testear bien, un conjunto por creativo.',
          realidad: 'Eso fragmenta el volumen y <b>ninguno sale de aprendizaje</b>: el "test limpio" termina midiendo el aprendizaje. ' +
                    'Todos en el mismo conjunto, dejando que el sistema reparta.' },

        { mito: 'Apago el creativo con menos CTR.',
          realidad: 'Un CTR bajo con buena conversión suele significar que <b>filtra bien</b>: menos gente, la correcta. ' +
                    'Se decide por CPA o ROAS, no por CTR.' },

        { mito: 'El creativo que se fatigó ya no sirve.',
          realidad: 'Lo que se gastó es el <b>gancho</b>. Cambiar los primeros tres segundos y dejar el resto suele recuperar buena parte del ' +
                    'rendimiento por una fracción del esfuerzo.' },
      ],

      glosario: [
        { t: 'Escalado vertical', d: 'Subir el presupuesto de lo que ya funciona. Tiene techo.' },
        { t: 'Escalado horizontal', d: 'Agregar creativos y públicos nuevos. Lo que hace crecer.' },
        { t: 'Regla del 20%', d: 'No subir el presupuesto más de ese porcentaje cada 3-4 días.' },
        { t: 'Significancia', d: 'Volumen necesario para que una diferencia no sea azar.' },
        { t: 'Techo de público', d: 'Punto donde más presupuesto ya no encuentra gente nueva adecuada.' },
        { t: 'Reciclar creativo', d: 'Cambiar el gancho de un video que rindió y se fatigó.' },
        { t: 'Tabla de aprendizajes', d: 'Registro de ángulos probados y su resultado. Se acumula con el tiempo.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Qué significa que "el creativo es la segmentación"?',
      opciones: [
        'Que el video que hacés determina a quién le va a interesar, y el sistema busca a esa gente',
        'Que hay que segmentar por tipo de creativo',
        'Que el creativo debe adaptarse a cada público configurado',
        'Que la segmentación manual sigue siendo lo principal',
      ],
      correcta: 0,
      porQue: 'Cuando la segmentación se automatiza, la variable que queda bajo tu control es el creativo. Ya no elegís a quién le hablás con casillas: lo elegís con lo que decís.',
      porQueNo: {
        1: 'No es una forma de segmentar en la plataforma.',
        2: 'Es útil, pero no es lo que la frase describe.',
        3: 'Es justamente lo contrario de lo que cambió.',
      },
    },
    {
      p: '¿Cuál es el error más común al inicio de un video publicitario?',
      opciones: [
        'Empezar con el logo o la presentación de la marca',
        'Usar música de fondo',
        'Grabar en vertical',
        'Mostrar el producto',
      ],
      correcta: 0,
      porQue: 'A nadie le importa tu marca en el segundo cero: todavía no le diste ningún motivo. El gancho va primero, la marca después.',
      porQueNo: {
        1: 'Puede ayudar; el problema es que muchos ven sin sonido.',
        2: 'Es el formato correcto para la mayor parte del alcance.',
        3: 'Conviene, pero después del gancho y del problema.',
      },
    },
    {
      p: '¿Cuál es el arreglo más barato con más impacto en un creativo de video?',
      opciones: [
        'Subtítulos quemados: la mayoría del consumo en el feed es en silencio',
        'Mejorar la calidad de la cámara',
        'Agregar música de moda',
        'Acortar el video a 10 segundos',
      ],
      correcta: 0,
      porQue: 'Un video cuyo mensaje está en la locución no comunica nada a la mayor parte de quienes lo ven. Los automáticos no alcanzan porque no siempre se activan.',
      porQueNo: {
        1: 'La producción alta suele rendir peor que lo que parece contenido.',
        2: 'Ayuda al ritmo, pero no resuelve el consumo sin sonido.',
        3: 'La duración correcta depende del mensaje.',
      },
    },
    {
      p: '¿Por qué un video grabado con teléfono suele superar a uno producido?',
      opciones: [
        'Porque en un feed de contenido personal, lo producido se ve como un anuncio y se saltea',
        'Porque pesa menos y carga más rápido',
        'Porque el algoritmo penaliza la producción alta',
        'Porque es más barato de hacer',
      ],
      correcta: 0,
      porQue: 'No es que la calidad no importe: el contexto premia lo que parece contenido. Es la conclusión que más cuesta aceptar cuando hay presupuesto de producción.',
      porQueNo: {
        1: 'El peso del archivo no afecta el rendimiento.',
        2: 'No hay penalización algorítmica por calidad.',
        3: 'El costo no explica el rendimiento.',
      },
    },
    {
      p: '¿Qué es variedad creativa real?',
      opciones: [
        'Ángulos distintos: problema, precio, prueba social, comparación, aspiración',
        'El mismo video con distintos textos y colores',
        'El mismo mensaje en varios formatos',
        'Distintas duraciones del mismo video',
      ],
      correcta: 0,
      porQue: 'Cinco versiones del mismo video no son cinco creativos: son uno. Cada ángulo le habla a un público distinto, que es lo que el sistema necesita para encontrar gente nueva.',
      porQueNo: {
        1: 'Es una variante, no un creativo distinto.',
        2: 'Los formatos son necesarios, pero no aportan ángulos nuevos.',
        3: 'Tampoco cambia el argumento.',
      },
    },
    {
      p: '¿Cómo se maneja la fatiga creativa?',
      opciones: [
        'Con creativo nuevo, y con una rutina de producción para no llegar tarde',
        'Subiendo el presupuesto',
        'Cambiando el público',
        'Bajando la frecuencia manualmente',
      ],
      correcta: 0,
      porQue: 'Producir a las apuradas, con el resultado ya cayendo, es cuando peor sale. Por eso conviene una rutina de dos o tres creativos nuevos por mes.',
      porQueNo: {
        1: 'Agrava la saturación del mismo público con el mismo creativo.',
        2: 'Puede ayudar un tiempo, pero no resuelve el desgaste del creativo.',
        3: 'La frecuencia es un síntoma, no la causa.',
      },
    },
    {
      p: '¿Cuáles son las dos formas de escalar y cuál hace crecer de verdad?',
      opciones: [
        'Vertical (más presupuesto, tiene techo) y horizontal (más creativos y públicos, lo que hace crecer)',
        'Vertical y horizontal, y la vertical es la que hace crecer',
        'Aumentar pujas y ampliar ubicaciones',
        'Duplicar campañas y duplicar conjuntos',
      ],
      correcta: 0,
      porQue: 'El vertical llega al techo porque el sistema debe alcanzar gente cada vez menos ideal. El horizontal es más lento y sostiene el crecimiento.',
      porQueNo: {
        1: 'El vertical tiene techo por definición.',
        2: 'Son tácticas puntuales, no las dos vías de escalado.',
        3: 'Duplicar hace que compitas contra vos mismo.',
      },
    },
    {
      p: '¿Cuánto se puede subir el presupuesto sin romper el aprendizaje?',
      opciones: [
        'Hasta un 20% cada tres o cuatro días',
        'El que haga falta, si el CPA se mantiene',
        'Un 50% por semana',
        'No hay límite',
      ],
      correcta: 0,
      porQue: 'Un salto mayor reinicia la fase de aprendizaje y el rendimiento cae justo cuando estabas escalando — lo que da la impresión de que la campaña no aguanta más presupuesto.',
      porQueNo: {
        1: 'El CPA se ve bien hasta que el salto reinicia el aprendizaje.',
        2: 'Supera ampliamente el umbral que dispara el reinicio.',
        3: 'El límite es concreto y tiene consecuencias.',
      },
    },
    {
      p: '¿Cuál es el paso de escalado que más rinde y menos se hace?',
      opciones: [
        'Agregar creativos nuevos al conjunto que ya funciona',
        'Duplicar el conjunto ganador',
        'Ampliar el público al 10%',
        'Sumar más ubicaciones',
      ],
      correcta: 0,
      porQue: 'No reinicia el aprendizaje, no cuesta presupuesto extra, y le da al sistema más opciones para encontrar públicos nuevos. Suele dar más que subir el presupuesto.',
      porQueNo: {
        1: 'Es el último recurso: compite consigo mismo.',
        2: 'Sirve cuando hay saturación, no como primer paso.',
        3: 'Ayuda, pero rinde menos que sumar creativos.',
      },
    },
    {
      p: '¿Cómo conviene testear creativos en Meta?',
      opciones: [
        'Todos en el mismo conjunto, dejando que el sistema reparta',
        'Un conjunto por creativo, con presupuestos iguales',
        'Uno por vez, una semana cada uno',
        'En campañas separadas',
      ],
      correcta: 0,
      porQue: 'El sistema ya está optimizando: ponerlos juntos lo aprovecha. Separarlos fragmenta el volumen y el "test limpio" termina midiendo la fase de aprendizaje.',
      porQueNo: {
        1: 'Ninguno alcanza el volumen para salir de aprendizaje.',
        2: 'Tarda muchísimo y las condiciones cambian entre semanas.',
        3: 'Fragmenta todavía más el presupuesto.',
      },
    },
    {
      p: 'Creativo A: 12 conversiones. Creativo B: 9. ¿Qué hacés?',
      opciones: [
        'Nada: hacen falta del orden de 100 por variante; eso es ruido',
        'Apagar B: A es 33% mejor',
        'Apagar A si su CTR es menor',
        'Duplicar el presupuesto de A',
      ],
      correcta: 0,
      porQue: 'Declarar ganadores con ruido, mes tras mes, es optimizar hacia el azar y descartar creativos que en realidad eran mejores.',
      porQueNo: {
        1: 'El porcentaje sin volumen suficiente no significa nada.',
        2: 'El CTR no es la métrica de decisión.',
        3: 'Escalar sobre una diferencia de ruido no tiene fundamento.',
      },
    },
    {
      p: '¿Por qué no conviene decidir entre creativos por CTR?',
      opciones: [
        'Porque un CTR bajo con buena conversión suele significar que el creativo filtra bien',
        'Porque el CTR no se mide con precisión',
        'Porque depende de la ubicación',
        'Porque Meta no lo reporta por creativo',
      ],
      correcta: 0,
      porQue: 'El error más frustrante es apagar el creativo con menos CTR y descubrir después que era el que más vendía: atrae a menos gente, pero a la correcta.',
      porQueNo: {
        1: 'Se mide con precisión.',
        2: 'Varía por ubicación, pero ese no es el motivo principal.',
        3: 'Sí lo reporta por creativo.',
      },
    },
    {
      p: 'Subís el presupuesto 20% y el CPA sube 25%. ¿Qué significa?',
      opciones: [
        'Llegaste al techo de ese público con ese creativo: escalá horizontal',
        'Hay que subir más para compensar',
        'La medición se rompió',
        'Es normal y se estabiliza solo',
      ],
      correcta: 0,
      porQue: 'El techo no es de la campaña: es de ese público con ese creativo. Seguir subiendo solo empeora las cosas.',
      porQueNo: {
        1: 'Agrava el problema: hay que llegar a gente aún menos ideal.',
        2: 'Es un efecto esperable del escalado, no una rotura.',
        3: 'Sin cambiar nada, tiende a empeorar.',
      },
    },
    {
      p: '¿Qué hacer con un creativo que rindió y se fatigó?',
      opciones: [
        'Cambiar solo los primeros tres segundos y subirlo como creativo nuevo',
        'Descartarlo definitivamente',
        'Subirlo tal cual a otro público',
        'Bajarle el presupuesto y dejarlo',
      ],
      correcta: 0,
      porQue: 'Lo que se gastó es el gancho para ese público. Cambiar solo el inicio suele recuperar buena parte del rendimiento por una fracción del esfuerzo.',
      porQueNo: {
        1: 'El cuerpo del video sigue siendo bueno.',
        2: 'Puede servir, pero el gancho gastado sigue siendo el problema.',
        3: 'La fatiga no se resuelve reduciendo el gasto.',
      },
    },
    {
      p: '¿Cuál es el activo más valioso que se construye testeando?',
      opciones: [
        'La tabla de qué ÁNGULOS funcionan con tu público, que orienta toda la producción futura',
        'El creativo ganador',
        'El público similar más preciso',
        'El histórico de CPM',
      ],
      correcta: 0,
      porQue: 'Un creativo se fatiga; el aprendizaje sobre qué argumento resuena se acumula. Saber que tu público responde al ángulo de problema y no al de comparación vale más que cualquier video.',
      porQueNo: {
        1: 'Se fatiga y deja de servir.',
        2: 'Es valioso, pero no orienta la producción creativa.',
        3: 'Es un dato de contexto, no un aprendizaje accionable.',
      },
    },
  ],
});
