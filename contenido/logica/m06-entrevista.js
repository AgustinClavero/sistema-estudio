/* ==========================================================================
   Lógica · Módulo 06 — Resolver problemas de entrevista
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'logica',
  id: 'm06',
  titulo: 'Resolver problemas de entrevista',
  fuentes: ['neetcode-patrones', 'big-o'],

  intro:
    '<p>En una entrevista técnica no se evalúa si sabés la respuesta: se evalúa <b>cómo pensás cuando no la ' +
    'sabés</b>. Y eso es una buena noticia, porque se puede practicar.</p>' +
    '<p>Este módulo cierra el track con un método para no quedarse en blanco, y con las cosas que más suman y ' +
    'más restan — que casi nunca son las que uno cree.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'El método, y qué se evalúa realmente',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> quedarse callado pensando es lo peor que se puede
hacer. El entrevistador <b>no ve tu razonamiento</b>: solo ve silencio.</div>

<h4>Los cinco pasos, en voz alta</h4>
<pre><code>1 · REPETIR el problema con tus palabras          (30 s)
2 · PREGUNTAR lo que no está claro                (1-2 min)
3 · PROPONER la solución de fuerza bruta          (2 min)
4 · MEJORARLA, explicando por qué                 (5 min)
5 · ESCRIBIR, hablando mientras escribís          (10 min)
6 · PROBAR con un ejemplo y con los casos borde   (3 min)</code></pre>

<div class="aviso"><strong>El paso 3 es contraintuitivo y es el que más ayuda.</strong> Decir
"la forma bruta sería dos bucles anidados, O(n²), déjame pensar si se puede mejorar" logra tres cosas: ' +
demuestra que entendiste el problema, te da una solución <b>por si el tiempo se acaba</b>, y muchas veces
el entrevistador te confirma que vas bien. <b>Nunca empieces buscando la solución óptima.</b></div>

<h4>Las preguntas que siempre valen</h4>
<pre><code>· ¿La entrada puede estar vacía?
· ¿Puede haber repetidos?
· ¿Está ordenada?
· ¿Cuán grande puede ser?
· ¿Qué devuelvo si no hay resultado?
· ¿Puedo modificar la entrada?</code></pre>

<div class="dato"><strong>Preguntar no resta: suma.</strong> Es una de las cosas que más se evalúan — ' +
en el trabajo real, alguien que implementa sin preguntar es un problema. Y con frecuencia ' +
<b>el enunciado es ambiguo a propósito</b>, justamente para ver si preguntás.</div>

<h4>Qué se evalúa de verdad</h4>
<table>
<tr><th>Se evalúa mucho</th><th>Se evalúa poco</th></tr>
<tr><td>Cómo comunicás tu razonamiento</td><td>Si llegaste a la solución óptima</td></tr>
<tr><td>Si hacés preguntas</td><td>Si recordabas el algoritmo</td></tr>
<tr><td>Si manejás los casos borde</td><td>La sintaxis exacta</td></tr>
<tr><td>Cómo reaccionás a una pista</td><td>La velocidad</td></tr>
<tr><td>Si probás tu solución</td><td>Si el código compila</td></tr>
</table>

<div class="dato"><strong>La cuarta fila de la izquierda decide muchas entrevistas.</strong> Si te dan una
pista y la <b>ignorás</b> o te ponés a la defensiva, es una señal muy mala — sugiere cómo vas a trabajar en
equipo. Si la tomás, la incorporás y agradecés, suma más que haber llegado solo.</div>
`,

      tecnico: `
<h4>El guion, palabra por palabra</h4>
<pre><code>[1 · Repetir]
"Entonces, tengo una lista de números y tengo que devolver
los índices de dos que sumen un objetivo. ¿Es así?"

[2 · Preguntar]
"¿Puede haber más de una respuesta válida? ¿Devuelvo cualquiera?"
"¿Puedo usar el mismo elemento dos veces?"
"¿La lista está ordenada?"
"¿Qué devuelvo si no hay ninguna?"

[3 · Fuerza bruta]
"La forma más directa es probar todos los pares con dos bucles
anidados. Es O(n²) en tiempo y O(1) en espacio.
Funciona, pero déjame ver si puedo hacerlo mejor."

[4 · Mejorar]
"Para cada número, lo que busco es el complemento: objetivo menos
ese número. Si guardo lo que ya vi en un mapa, buscar el complemento
es directo. Eso me da O(n) tiempo y O(n) espacio.
Estoy cambiando memoria por velocidad."

[5 · Escribir, hablando]
"Creo el mapa de valor a índice… recorro… en cada paso calculo
el complemento y pregunto si ya lo vi…"

[6 · Probar]
"Con [2,7,11,15] y objetivo 9: en el índice 0 el complemento es 7,
no lo vi. Guardo 2→0. En el índice 1 el complemento es 2, sí lo vi:
devuelvo [0,1]. Correcto.
Casos borde: lista vacía devuelve null; un solo elemento, null."</code></pre>

<div class="dato"><strong>La frase del paso 4 —"estoy cambiando memoria por velocidad"— vale mucho.</strong>
Muestra que entendés el <b>intercambio</b> y no solo la solución. Es exactamente el tipo de comentario que
distingue a alguien que memorizó el problema de alguien que lo razonó.</div>

<h4>Qué hacer si te trabás</h4>
<pre><code>1 · Decilo: "me trabé, déjame volver al ejemplo"
2 · Volvé a resolver un caso chico A MANO
3 · Preguntate qué estructura haría el paso lento más rápido
4 · Si nada funciona, pedí una pista

Pedir una pista NO resta. Trabarse en silencio cinco minutos, SÍ.</code></pre>

<div class="dato"><strong>El paso 2 resuelve la mayoría de los bloqueos.</strong> Volver a un ejemplo concreto
y resolverlo a mano <b>casi siempre revela el patrón</b> — es el mismo método del primer módulo del track. ' +
Y tiene una ventaja adicional en entrevista: mientras lo hacés en voz alta, el entrevistador ve que estás
trabajando, no bloqueado.</div>

<h4>Los errores que más restan</h4>
<table>
<tr><th>Error</th><th>Qué transmite</th></tr>
<tr><td><b>Silencio prolongado</b></td><td>No se puede evaluar nada</td></tr>
<tr><td>Escribir sin preguntar</td><td>Que en el trabajo vas a asumir</td></tr>
<tr><td>Ignorar una pista</td><td>Cómo vas a recibir una revisión de código</td></tr>
<tr><td>No probar la solución</td><td>Que no verificás lo que hacés</td></tr>
<tr><td>Defender un enfoque roto</td><td>Rigidez</td></tr>
<tr><td>Decir "esto es fácil"</td><td>Nunca suma, y a veces te equivocás</td></tr>
</table>

<h4>Cómo practicar</h4>
<pre><code>· Resolver EN VOZ ALTA, aunque estés solo. Es una habilidad aparte.
· Cronometrar: 30-40 minutos por problema
· Escribir en un editor de texto plano, sin autocompletado
· Después de resolverlo, escribir la complejidad
· Volver a los problemas fallados a los 7 días

Mejor 3 problemas por semana con este método
que 20 mirando la solución.</code></pre>

<div class="dato"><strong>Lo de "en voz alta aunque estés solo" es lo que más se saltea y más
diferencia hace.</strong> Explicar mientras se piensa es una <b>habilidad separada</b> de resolver, ' +
y la primera vez que se practica es en la entrevista si no se entrenó antes. ' +
Es exactamente lo mismo que ensayar una presentación.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="ev2" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <rect x="24" y="28" width="632" height="42" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="340" y="54" text-anchor="middle" fill="#f87171" font-size="13" font-weight="700">
    El entrevistador no ve tu razonamiento: solo ve silencio.</text>

  <text x="24" y="94" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS SEIS PASOS, EN VOZ ALTA</text>

  <rect x="24" y="106" width="100" height="44" rx="8" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="74" y="124" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-weight="700">1 · REPETIR</text>
  <text x="74" y="140" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8">30 s</text>
  <line x1="128" y1="128" x2="138" y2="128" stroke="currentColor" stroke-width="1.2" marker-end="url(#ev2)"/>

  <rect x="142" y="106" width="100" height="44" rx="8" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="192" y="124" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-weight="700">2 · PREGUNTAR</text>
  <text x="192" y="140" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8">1-2 min</text>
  <line x1="246" y1="128" x2="256" y2="128" stroke="currentColor" stroke-width="1.2" marker-end="url(#ev2)"/>

  <rect x="260" y="106" width="100" height="44" rx="8" fill="#34d399" fill-opacity=".24" stroke="#34d399" stroke-width="1.8"/>
  <text x="310" y="124" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">3 · FUERZA BRUTA</text>
  <text x="310" y="140" text-anchor="middle" fill="#34d399" font-size="8" font-weight="700">el que más ayuda</text>
  <line x1="364" y1="128" x2="374" y2="128" stroke="currentColor" stroke-width="1.2" marker-end="url(#ev2)"/>

  <rect x="378" y="106" width="100" height="44" rx="8" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="428" y="124" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">4 · MEJORAR</text>
  <text x="428" y="140" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8">explicando por qué</text>
  <line x1="482" y1="128" x2="492" y2="128" stroke="currentColor" stroke-width="1.2" marker-end="url(#ev2)"/>

  <rect x="496" y="106" width="76" height="44" rx="8" fill="#7c5cff" fill-opacity=".18" stroke="#7c5cff" stroke-width="1.2"/>
  <text x="534" y="124" text-anchor="middle" fill="#7c5cff" font-size="9.5" font-weight="700">5 · ESCRIBIR</text>
  <text x="534" y="140" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8">hablando</text>
  <line x1="576" y1="128" x2="586" y2="128" stroke="currentColor" stroke-width="1.2" marker-end="url(#ev2)"/>

  <rect x="590" y="106" width="66" height="44" rx="8" fill="#f472b6" fill-opacity=".18" stroke="#f472b6" stroke-width="1.2"/>
  <text x="623" y="124" text-anchor="middle" fill="#f472b6" font-size="9.5" font-weight="700">6 · PROBAR</text>
  <text x="623" y="140" text-anchor="middle" fill="currentColor" opacity=".6" font-size="8">casos borde</text>

  <rect x="24" y="162" width="632" height="42" rx="9" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.5"/>
  <text x="44" y="182" fill="#34d399" font-size="11.5" font-weight="700">NUNCA EMPIECES BUSCANDO LA SOLUCIÓN ÓPTIMA</text>
  <text x="44" y="198" fill="currentColor" opacity=".78" font-size="11">
    Decir la fuerza bruta demuestra que entendiste, te da una solución <tspan font-weight="700">por si se acaba el tiempo</tspan>, y suele confirmar que vas bien.</text>

  <line x1="24" y1="222" x2="656" y2="222" stroke="currentColor" opacity=".18"/>

  <text x="24" y="246" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    QUÉ SE EVALÚA DE VERDAD</text>

  <rect x="24" y="258" width="304" height="106" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="176" y="278" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">SE EVALÚA MUCHO</text>
  <text x="44" y="298" fill="currentColor" opacity=".72" font-size="10.5">· cómo comunicás tu razonamiento</text>
  <text x="44" y="316" fill="currentColor" opacity=".72" font-size="10.5">· si hacés preguntas</text>
  <text x="44" y="334" fill="currentColor" opacity=".72" font-size="10.5">· si manejás los casos borde</text>
  <text x="44" y="354" fill="#34d399" font-size="10.5" font-weight="700">· CÓMO REACCIONÁS A UNA PISTA</text>

  <rect x="352" y="258" width="304" height="106" rx="10" fill="currentColor" fill-opacity=".06" stroke="currentColor" stroke-opacity=".28"/>
  <text x="504" y="278" text-anchor="middle" fill="currentColor" opacity=".65" font-size="11" font-weight="700">SE EVALÚA POCO</text>
  <text x="372" y="298" fill="currentColor" opacity=".6" font-size="10.5">· si llegaste a la solución óptima</text>
  <text x="372" y="316" fill="currentColor" opacity=".6" font-size="10.5">· si recordabas el algoritmo</text>
  <text x="372" y="334" fill="currentColor" opacity=".6" font-size="10.5">· la sintaxis exacta</text>
  <text x="372" y="354" fill="currentColor" opacity=".6" font-size="10.5">· la velocidad</text>

  <rect x="24" y="370" width="632" height="18" rx="5" fill="#f87171" fill-opacity=".14"/>
  <text x="340" y="383" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">
    Pedir una pista NO resta. Trabarse en silencio cinco minutos, sí.</text>
</svg>`,
        pie: 'Practicar en voz alta aunque estés solo: explicar mientras pensás es una habilidad separada de resolver.',
      },

      entrevista: [
        { p: '¿Cuál es tu método para encarar un problema en una entrevista?',
          r: 'Seis pasos, todos en voz alta: <b>repetir</b> el problema con mis palabras, <b>preguntar</b> lo que no está claro, ' +
             '<b>proponer la fuerza bruta</b> con su complejidad, <b>mejorarla</b> explicando por qué, <b>escribir</b> hablando mientras escribo, ' +
             'y <b>probar</b> con un ejemplo y los casos borde. El tercero es el que más ayuda y el más contraintuitivo: ' +
             '<b>nunca empiezo buscando la solución óptima</b>, porque decir la bruta demuestra que entendí, me da una solución por si se acaba ' +
             'el tiempo, y suele confirmar que voy bien.' },

        { p: '¿Qué se evalúa realmente en una entrevista técnica?',
          r: 'Sobre todo <b>cómo pensás cuando no sabés la respuesta</b>: cómo comunicás el razonamiento, si hacés preguntas, ' +
             'si manejás los casos borde, si probás tu solución. Y una que decide muchas entrevistas: ' +
             '<b>cómo reaccionás a una pista</b>. Si la ignorás o te ponés a la defensiva, es una señal muy mala sobre cómo vas a recibir ' +
             'una revisión de código. Si la tomás y la incorporás, suma más que haber llegado solo.' },

        { p: '¿Qué hacés si te trabás?',
          r: 'Primero, <b>decirlo</b>: "me trabé, déjame volver al ejemplo". Después, <b>resolver un caso chico a mano</b>, que resuelve la mayoría ' +
             'de los bloqueos y además muestra que estoy trabajando y no bloqueado. Si eso no alcanza, preguntarme qué estructura haría más rápido ' +
             'el paso lento. Y si nada funciona, <b>pedir una pista</b>: pedirla no resta, trabarse en silencio cinco minutos sí.' },

        { p: '¿Cómo se practica esto?',
          r: 'Resolviendo <b>en voz alta aunque estés solo</b>, que es lo que más se saltea y más diferencia hace: explicar mientras pensás es una ' +
             '<b>habilidad separada</b> de resolver, y si no la entrenás, la primera vez que la usás es en la entrevista. ' +
             'Además: cronometrar treinta o cuarenta minutos, escribir en texto plano sin autocompletado, anotar la complejidad al terminar, ' +
             'y volver a los problemas fallados a los siete días. <b>Tres problemas por semana con método rinden más que veinte mirando la solución.</b>' },
      ],

      practica: `
<h4>Las preguntas de apertura, para memorizar</h4>
<pre><code>· ¿La entrada puede estar vacía?
· ¿Puede haber elementos repetidos?
· ¿Está ordenada?
· ¿Cuán grande puede ser? ¿Miles? ¿Millones?
· ¿Qué devuelvo si no hay resultado? ¿null? ¿-1? ¿lista vacía?
· ¿Puedo modificar la entrada o tiene que quedar intacta?
· Si hay varias respuestas válidas, ¿devuelvo cualquiera?</code></pre>

<div class="aviso"><strong>Estas siete preguntas cubren la mayoría de los problemas</strong> y toman noventa
segundos. Vale la pena tenerlas memorizadas: en una entrevista, con nervios, ' +
<b>es difícil pensar qué preguntar</b> — y tener la lista lista libera atención para el problema.</div>

<h4>Simulacro completo</h4>
<pre><code>PROBLEMA
"Dada una lista de logs { usuarioId, accion, timestamp }, devolver
los usuarios que hicieron más de 3 acciones en menos de 1 minuto."

[Repetir]
"Tengo logs con usuario, acción y momento. Quiero los usuarios que
en alguna ventana de 60 segundos hicieron más de 3 acciones. ¿Correcto?"

[Preguntar]
"¿Los logs vienen ordenados por tiempo?"
"¿Más de 3 significa 4 o más?"
"¿Devuelvo la lista de usuarios, o también cuándo pasó?"
"¿Cuántos logs puede haber? ¿Miles? ¿Millones?"

[Fuerza bruta]
"Podría, para cada log, contar cuántos del mismo usuario caen en los
60 segundos siguientes. Es O(n²). Funciona pero no escala."

[Mejorar]
"Puedo agrupar por usuario y usar una ventana deslizante sobre cada
grupo: como están ordenados por tiempo, avanzo el fin y muevo el
inicio mientras la diferencia supere los 60 segundos. Eso es O(n)
después de agrupar, y agrupar también es O(n)."

[Escribir]
function usuariosSospechosos(logs, limite = 3, ventanaMs = 60_000) {
  const porUsuario = new Map();
  for (const l of logs) {
    (porUsuario.get(l.usuarioId) ?? porUsuario.set(l.usuarioId, []).get(l.usuarioId))
      .push(l.timestamp);
  }

  const resultado = [];
  for (const [usuario, tiempos] of porUsuario) {
    tiempos.sort((a, b) =&gt; a - b);          // por si no venían ordenados
    let inicio = 0;
    for (let fin = 0; fin &lt; tiempos.length; fin++) {
      while (tiempos[fin] - tiempos[inicio] &gt; ventanaMs) inicio++;
      if (fin - inicio + 1 &gt; limite) { resultado.push(usuario); break; }
    }
  }
  return resultado;
}

[Probar]
"Un usuario con 4 acciones en 30 segundos: entra ✔
Un usuario con 4 acciones en 5 minutos: no entra ✔
Lista vacía: devuelve [] ✔
Un solo log: no puede superar 3 ✔"</code></pre>

<h4>Frases que ayudan</h4>
<table>
<tr><th>Situación</th><th>Qué decir</th></tr>
<tr><td>Antes de empezar</td><td>"Déjame repetir el problema para asegurarme"</td></tr>
<tr><td>Al proponer la bruta</td><td>"Empiezo con lo directo y después optimizo"</td></tr>
<tr><td>Al mejorar</td><td>"Estoy cambiando memoria por velocidad"</td></tr>
<tr><td>Al trabarte</td><td>"Me trabé, déjame volver al ejemplo"</td></tr>
<tr><td>Al recibir una pista</td><td>"Buen punto, entonces si…"</td></tr>
<tr><td>Al terminar</td><td>"Es O(n) tiempo y O(n) espacio. ¿Querés que optimice el espacio?"</td></tr>
</table>

<h4>Plan de práctica de cuatro semanas</h4>
<pre><code>Semana 1  arrays y mapas       · 3 problemas
Semana 2  dos punteros y ventana · 3 problemas
Semana 3  árboles y recursión   · 3 problemas
Semana 4  grafos y repaso       · 3 problemas + repetir los fallados

Cada problema: 40 minutos máximo, en voz alta, cronometrado.
Si a los 40 no salió: mirar la solución, entenderla,
y volver a hacerlo desde cero a los 7 días.</code></pre>
`,

      errores: [
        { mito: 'Tengo que llegar a la solución óptima o pierdo.',
          realidad: 'Se evalúa <b>cómo pensás</b>, no si recordabas el algoritmo. Empezar por la fuerza bruta demuestra que entendiste, ' +
                    'te da una solución por si se acaba el tiempo, y suele confirmar que vas bien.' },

        { mito: 'Preguntar mucho hace parecer que no sé.',
          realidad: 'Preguntar <b>suma</b>: en el trabajo real, alguien que implementa sin preguntar es un problema. ' +
                    'Y muchos enunciados son ambiguos <b>a propósito</b>, justamente para ver si preguntás.' },

        { mito: 'Si me trabo, mejor pensar en silencio hasta que salga.',
          realidad: 'El entrevistador <b>no ve tu razonamiento</b>: ve silencio, y no puede evaluar nada. Decir "me trabé, vuelvo al ejemplo" ' +
                    'y resolver un caso a mano en voz alta muestra que estás trabajando.' },

        { mito: 'Practicar leyendo soluciones alcanza.',
          realidad: 'Explicar mientras pensás es una <b>habilidad separada</b> de resolver. Si no la entrenás en voz alta, ' +
                    'la primera vez que la usás es en la entrevista.' },
      ],

      glosario: [
        { t: 'Fuerza bruta', d: 'La solución más directa, sin optimizar. El punto de partida correcto.' },
        { t: 'Pensar en voz alta', d: 'Verbalizar el razonamiento. Es lo que el entrevistador puede evaluar.' },
        { t: 'Caso borde', d: 'Entrada extrema que rompe muchas soluciones. Se prueban al final.' },
        { t: 'Intercambio', d: 'Ganar velocidad a costa de memoria, o al revés. Vale nombrarlo.' },
        { t: 'Pista', d: 'Ayuda del entrevistador. Cómo la recibís es parte de la evaluación.' },
        { t: 'Simulacro', d: 'Practicar en condiciones reales: cronometrado, en voz alta, sin ayudas.' },
        { t: 'Repetición espaciada', d: 'Volver a los problemas fallados días después.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Qué se evalúa principalmente en una entrevista técnica de lógica?',
      opciones: [
        'Cómo pensás cuando no sabés la respuesta',
        'Si conocés el algoritmo óptimo',
        'La velocidad para escribir código',
        'Si el código compila sin errores',
      ],
      correcta: 0,
      porQue: 'Y es una buena noticia, porque eso se puede practicar. La sintaxis exacta y la velocidad se evalúan poco.',
      porQueNo: {
        1: 'Es lo que menos importa: se evalúa el razonamiento, no la memoria.',
        2: 'La velocidad no es un criterio principal.',
        3: 'Los errores de sintaxis son perdonables en un pizarrón.',
      },
    },
    {
      p: '¿Por qué conviene proponer primero la solución de fuerza bruta?',
      opciones: [
        'Demuestra que entendiste, te da una solución por si se acaba el tiempo, y suele confirmar que vas bien',
        'Porque es más fácil de escribir',
        'Porque el entrevistador espera eso',
        'Porque suele ser la respuesta correcta',
      ],
      correcta: 0,
      porQue: 'Es contraintuitivo y es el paso que más ayuda: nunca conviene empezar buscando la solución óptima.',
      porQueNo: {
        1: 'La facilidad no es el motivo: es la comunicación y la red de seguridad.',
        2: 'Espera ver razonamiento, y esto es una forma de mostrarlo.',
        3: 'Casi nunca es la respuesta buscada, y eso está bien.',
      },
    },
    {
      p: '¿Qué transmite ignorar una pista del entrevistador?',
      opciones: [
        'Cómo vas a recibir una revisión de código: es una señal muy mala',
        'Que sos independiente',
        'Que la pista no era útil',
        'Que estás concentrado',
      ],
      correcta: 0,
      porQue: 'Tomar la pista, incorporarla y agradecerla suma más que haber llegado solo. Es una de las cosas que más decide entrevistas.',
      porQueNo: {
        1: 'Se lee como rigidez, no como independencia.',
        2: 'El entrevistador la dio por algo.',
        3: 'La concentración no impide escuchar.',
      },
    },
    {
      p: '¿Cuál es el peor error en una entrevista de lógica?',
      opciones: [
        'El silencio prolongado: el entrevistador no ve tu razonamiento, ve silencio',
        'Equivocarse en la sintaxis',
        'No llegar a la solución óptima',
        'Preguntar demasiado',
      ],
      correcta: 0,
      porQue: 'Sin verbalización no hay nada que evaluar. Decir "me trabé, vuelvo al ejemplo" es infinitamente mejor que callarse.',
      porQueNo: {
        1: 'Es perdonable y se evalúa poco.',
        2: 'Se evalúa el proceso, no solo el resultado.',
        3: 'Preguntar suma: los enunciados suelen ser ambiguos a propósito.',
      },
    },
    {
      p: '¿Por qué preguntar suma en vez de restar?',
      opciones: [
        'Porque en el trabajo real, alguien que implementa sin preguntar es un problema — y los enunciados son ambiguos a propósito',
        'Porque gana tiempo para pensar',
        'Porque el entrevistador tiene que hablar',
        'Porque demuestra humildad',
      ],
      correcta: 0,
      porQue: 'Muchos enunciados omiten información deliberadamente, justamente para ver si preguntás antes de implementar.',
      porQueNo: {
        1: 'Es un efecto secundario, no la razón.',
        2: 'No es una cuestión de dinámica de conversación.',
        3: 'Se evalúa el criterio profesional, no la actitud.',
      },
    },
    {
      p: 'Te trabaste en medio del problema. ¿Qué hacés primero?',
      opciones: [
        'Decirlo y volver a resolver un caso chico a mano, en voz alta',
        'Quedarte pensando hasta que salga',
        'Empezar a escribir código a ver si aparece',
        'Cambiar de problema',
      ],
      correcta: 0,
      porQue: 'Volver al ejemplo concreto resuelve la mayoría de los bloqueos, y hacerlo en voz alta muestra que estás trabajando, no bloqueado.',
      porQueNo: {
        1: 'El silencio es lo que más resta.',
        2: 'Escribir sin idea suele empeorar la situación.',
        3: 'No es una opción en una entrevista.',
      },
    },
    {
      p: '¿Pedir una pista resta puntos?',
      opciones: [
        'No: trabarse en silencio cinco minutos sí resta',
        'Sí, siempre',
        'Sí, si es antes de la mitad del tiempo',
        'Depende de la empresa',
      ],
      correcta: 0,
      porQue: 'Pedir ayuda cuando estás trabado es exactamente lo que se espera en el trabajo real. Lo que no se puede evaluar es el silencio.',
      porQueNo: {
        1: 'Es una señal de criterio, no de debilidad.',
        2: 'El momento no cambia que sea razonable.',
        3: 'Es bastante universal en entrevistas técnicas.',
      },
    },
    {
      p: '¿Qué frase muestra que entendés el intercambio y no solo la solución?',
      opciones: [
        '"Estoy cambiando memoria por velocidad"',
        '"Esta es la solución óptima"',
        '"Vi este problema antes"',
        '"Es O(n), lo mejor posible"',
      ],
      correcta: 0,
      porQue: 'Es el tipo de comentario que distingue a alguien que memorizó el problema de alguien que lo razonó.',
      porQueNo: {
        1: 'Es una afirmación, no una explicación del razonamiento.',
        2: 'Es honesto y no aporta nada sobre cómo pensás.',
        3: 'Puede ser cierto y no muestra el compromiso que asumiste.',
      },
    },
    {
      p: '¿Cuál es la parte de la práctica que más se saltea y más diferencia hace?',
      opciones: [
        'Resolver en voz alta aunque estés solo',
        'Cronometrar',
        'Usar un editor sin autocompletado',
        'Anotar la complejidad',
      ],
      correcta: 0,
      porQue: 'Explicar mientras pensás es una habilidad separada de resolver. Si no la entrenás, la primera vez que la usás es en la entrevista.',
      porQueNo: {
        1: 'Es útil, pero no entrena la comunicación.',
        2: 'Ayuda a simular condiciones, no a verbalizar.',
        3: 'Es buena práctica, con menos impacto.',
      },
    },
    {
      p: '¿Qué rinde más al practicar?',
      opciones: [
        'Tres problemas por semana con método completo',
        'Veinte problemas mirando la solución',
        'Leer artículos sobre algoritmos',
        'Memorizar implementaciones',
      ],
      correcta: 0,
      porQue: 'Y volver a los problemas fallados a los siete días: la repetición espaciada consolida el patrón, no la solución puntual.',
      porQueNo: {
        1: 'Mirar la solución da la sensación de aprender sin el razonamiento.',
        2: 'Es complemento, no práctica.',
        3: 'Falla apenas cambia el enunciado.',
      },
    },
    {
      p: '¿Cuáles son las preguntas de apertura que conviene tener memorizadas?',
      opciones: [
        'Vacío, repetidos, ordenado, tamaño, qué devolver si no hay resultado, si se puede modificar la entrada',
        'Qué lenguaje puedo usar y si puedo buscar en internet',
        'Cuánto tiempo tengo y si hay más problemas',
        'Qué complejidad esperan',
      ],
      correcta: 0,
      porQue: 'Cubren la mayoría de los problemas y toman noventa segundos. Tenerlas memorizadas libera atención para el problema en un momento de nervios.',
      porQueNo: {
        1: 'Son preguntas logísticas, no sobre el problema.',
        2: 'Tampoco aportan a la resolución.',
        3: 'Es válido preguntarlo, pero no reemplaza entender la entrada.',
      },
    },
    {
      p: 'Después de escribir la solución, ¿qué hacés?',
      opciones: [
        'Probarla con un ejemplo concreto y con los casos borde, en voz alta',
        'Esperar el veredicto del entrevistador',
        'Optimizarla más',
        'Explicar por qué elegiste ese lenguaje',
      ],
      correcta: 0,
      porQue: 'No probar transmite que no verificás lo que hacés, que es una señal directa sobre cómo trabajarías.',
      porQueNo: {
        1: 'Verificar es parte de lo que se evalúa.',
        2: 'Primero hay que confirmar que la actual funciona.',
        3: 'Es irrelevante para el problema.',
      },
    },
    {
      p: '¿Qué transmite escribir código sin haber preguntado nada?',
      opciones: [
        'Que en el trabajo vas a asumir en vez de aclarar',
        'Que sos rápido',
        'Que entendiste el problema',
        'Que tenés experiencia',
      ],
      correcta: 0,
      porQue: 'Y con frecuencia el enunciado es ambiguo a propósito: implementar sin preguntar suele llevar a resolver el problema equivocado.',
      porQueNo: {
        1: 'La velocidad se evalúa poco.',
        2: 'Justamente sugiere lo contrario si el enunciado era ambiguo.',
        3: 'La experiencia se nota en las preguntas, no en su ausencia.',
      },
    },
    {
      p: 'En el simulacro de los logs, ¿por qué se ordenan los tiempos dentro de cada usuario?',
      opciones: [
        'Porque la ventana deslizante requiere orden, y no se garantizó que los logs vinieran ordenados',
        'Para reducir la complejidad',
        'Para eliminar duplicados',
        'Porque el enunciado lo pedía',
      ],
      correcta: 0,
      porQue: 'Es exactamente el tipo de detalle que aparece si preguntaste "¿los logs vienen ordenados?" y la respuesta fue "no necesariamente".',
      porQueNo: {
        1: 'Ordenar agrega costo: no lo reduce.',
        2: 'El ordenamiento no elimina duplicados.',
        3: 'El enunciado no lo pedía: surge de la pregunta.',
      },
    },
    {
      p: '¿Qué conviene hacer con un problema que no salió en 40 minutos?',
      opciones: [
        'Mirar la solución, entenderla, y volver a hacerlo desde cero a los siete días',
        'Seguir hasta resolverlo',
        'Descartarlo y pasar al siguiente',
        'Memorizar la solución',
      ],
      correcta: 0,
      porQue: 'La repetición espaciada consolida el patrón. Rehacerlo desde cero verifica que aprendiste el razonamiento y no la solución puntual.',
      porQueNo: {
        1: 'Después de cierto punto, el rendimiento del esfuerzo cae mucho.',
        2: 'Se pierde el aprendizaje justo del problema que más lo tenía.',
        3: 'Memorizar falla apenas cambia el enunciado.',
      },
    },
  ],
});
