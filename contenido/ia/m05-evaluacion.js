/* ==========================================================================
   IA · Módulo 05 — Evaluación
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ia',
  id: 'm05',
  titulo: 'Evaluación',
  fuentes: ['ragas', 'langfuse', 'anthropic'],

  intro:
    '<p>Este es el módulo que casi nadie estudia y que <b>más rápido te distingue en una entrevista</b>. ' +
    'Si en una charla técnica mencionás evals con criterio, el entrevistador entiende inmediatamente que ' +
    'trabajaste con esto en producción y no solo en un tutorial.</p>' +
    '<p>La razón es simple: los evals son lo único que aparece cuando un sistema con IA tiene usuarios reales. ' +
    'En un demo no hacen falta. En producción, sin ellos, cada cambio es una apuesta.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Por qué sin evals no tenés nada',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> escribir software con IA sin evals es como
programar sin poder ejecutar el código. Podés escribir algo que <i>parece</i> correcto, pero no tenés forma de
saberlo.</div>

<p>La historia se repite en todos los proyectos:</p>

<ol>
<li>Armás una feature con IA. Probás cinco casos. Andan. La subís.</li>
<li>Un usuario reporta un caso que sale mal. Retocás el prompt. Ese caso ahora anda.</li>
<li>Otro usuario reporta otro caso. Retocás de nuevo. Anda.</li>
<li>A la semana, alguien reporta que <b>volvió a fallar el primer caso</b>.</li>
</ol>

<p>Estás dando vueltas en círculo. Cada arreglo rompe algo que no estás mirando, y como no medís nada,
no te enterás hasta que se queja alguien.</p>

<h4>Por qué el software con IA necesita esto y el software normal no tanto</h4>
<table>
<tr><th>Software tradicional</th><th>Software con IA</th></tr>
<tr><td>La misma entrada da la misma salida</td><td>La misma entrada puede dar salidas distintas</td></tr>
<tr><td>Correcto o incorrecto</td><td>Mejor o peor, en varias dimensiones</td></tr>
<tr><td>Un cambio afecta lo que tocaste</td><td>Un cambio de prompt afecta <b>todo</b></td></tr>
<tr><td>Se verifica leyendo el código</td><td>Solo se verifica <b>ejecutándolo muchas veces</b></td></tr>
</table>

<p>Esa tercera fila es la clave: en software normal, si tocás la función de facturación no rompés el login.
En un sistema con IA, cambiar una oración del prompt <b>puede cambiar el comportamiento en cualquier caso</b>.
No hay aislamiento.</p>

<div class="aviso"><strong>La definición práctica:</strong> un <b>eval</b> es un conjunto de casos con la
respuesta esperada, más una forma automática de puntuar. Es el equivalente a una suite de tests, pero midiendo
<b>calidad</b> en lugar de corrección exacta.<br><br>
<b>Sin evals no podés mejorar un sistema. Solo podés cambiarlo.</b></div>

<h4>Lo que te habilitan</h4>
<ul>
<li><b>Cambiar el prompt con confianza.</b> Medís antes y después.</li>
<li><b>Bajar de modelo y ahorrar plata.</b> Sin evals nadie se anima; con evals sabés exactamente cuánta calidad estás negociando.</li>
<li><b>Migrar de proveedor.</b> Corrés el mismo conjunto contra los dos.</li>
<li><b>Detectar regresiones</b> cuando el proveedor actualiza un modelo.</li>
<li><b>Discutir con datos</b> en vez de con impresiones.</li>
</ul>
`,

      tecnico: `
<h4>Los tres niveles</h4>
<table>
<tr><th>Nivel</th><th>Qué mide</th><th>Costo</th><th>Cuándo se corre</th></tr>
<tr><td><b>Unitario</b></td><td>Un componente aislado: retrieval, clasificador, extractor</td><td>Muy bajo</td><td>En cada cambio, en CI</td></tr>
<tr><td><b>De extremo a extremo</b></td><td>El sistema completo sobre casos reales</td><td>Medio</td><td>Antes de desplegar</td></tr>
<tr><td><b>En producción</b></td><td>Muestreo de tráfico real, señales implícitas</td><td>Continuo</td><td>Siempre</td></tr>
</table>
<p>El error habitual es saltar directo al segundo. Los evals <b>unitarios</b> —sobre todo los de retrieval— son
baratos, rápidos y ubican el problema; los de extremo a extremo dicen que algo está mal pero no dónde.</p>

<h4>Tipos de métrica</h4>
<ul>
<li><b>Determinista</b> — exactitud, F1, coincidencia exacta, esquema válido, latencia, costo. Barata y confiable. <b>Usala siempre que se pueda.</b></li>
<li><b>Basada en referencia</b> — comparar contra una respuesta ideal. ROUGE y BLEU miden solapamiento de palabras: baratas pero muy pobres para lenguaje natural, porque penalizan decir lo mismo con otras palabras.</li>
<li><b>Basada en modelo</b> — <i>LLM-as-judge</i>. Cara y ruidosa, pero es lo único viable para juzgar calidad abierta.</li>
<li><b>Humana</b> — el patrón oro. Cara y lenta; se usa para calibrar las anteriores, no para medir todos los días.</li>
</ul>

<div class="dato"><strong>Orden de preferencia:</strong> siempre <b>la métrica determinista más fuerte que
puedas construir</b>. Mucha gente salta directo a LLM-as-judge para cosas que se verifican con una expresión
regular. Si la tarea es extraer un número, la métrica es "¿el número coincide?", no la opinión de otro modelo.
<b>Convertir una tarea abierta en una verificable es la mejor decisión de diseño que podés tomar.</b></div>

<h4>La trampa de la métrica única</h4>
<p>Un solo número esconde compensaciones. Un sistema puede subir la exactitud y a la vez volverse tres veces más
lento o más caro, y el número sube igual. Conviene un pequeño tablero:</p>
<pre><code>{
  exactitud:      0.87,
  faithfulness:   0.94,     // ¿la respuesta está fundamentada?
  context_recall: 0.91,     // ¿se recuperó lo correcto?
  abstenciones:   0.06,     // ¿cuántas veces dijo "no sé"?
  citas_invalidas:0.01,
  p95_latencia_ms: 3200,
  costo_por_1000:  1.42,    // USD
}</code></pre>
<p>Esa fila de <b>abstenciones</b> es la más informativa y la que menos gente mide: si baja de golpe, el sistema
dejó de admitir que no sabe — es decir, <b>empezó a inventar</b>.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="e1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="24" fill="#f87171" font-size="12" font-weight="700">SIN EVALS  ·  el círculo</text>

  <rect x="40" y="38" width="140" height="42" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.3"/>
  <text x="110" y="64" text-anchor="middle" fill="currentColor" opacity=".8" font-size="11">falla el caso A</text>
  <line x1="184" y1="59" x2="212" y2="59" stroke="currentColor" stroke-width="1.3" marker-end="url(#e1)"/>

  <rect x="216" y="38" width="140" height="42" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.3"/>
  <text x="286" y="64" text-anchor="middle" fill="currentColor" opacity=".8" font-size="11">retocás el prompt</text>
  <line x1="360" y1="59" x2="388" y2="59" stroke="currentColor" stroke-width="1.3" marker-end="url(#e1)"/>

  <rect x="392" y="38" width="140" height="42" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.3"/>
  <text x="462" y="64" text-anchor="middle" fill="currentColor" opacity=".8" font-size="11">falla el caso B</text>

  <path d="M 532 59 q 44 0 44 34 q 0 34 -44 34 l -448 0 q -44 0 -44 -34 q 0 -34 44 -34"
        fill="none" stroke="#f87171" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#e1)"/>
  <text x="308" y="118" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    …y a la semana vuelve a fallar el caso A</text>

  <line x1="24" y1="146" x2="656" y2="146" stroke="currentColor" opacity=".18"/>

  <text x="24" y="172" fill="#34d399" font-size="12" font-weight="700">CON EVALS  ·  la espiral</text>

  <rect x="40" y="186" width="150" height="48" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="115" y="206" text-anchor="middle" fill="currentColor" opacity=".8" font-size="11">medís la línea base</text>
  <text x="115" y="223" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">0.72</text>
  <line x1="194" y1="210" x2="222" y2="210" stroke="currentColor" stroke-width="1.3" marker-end="url(#e1)"/>

  <rect x="226" y="186" width="150" height="48" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="301" y="206" text-anchor="middle" fill="currentColor" opacity=".8" font-size="11">UN cambio</text>
  <text x="301" y="223" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10">uno, no tres</text>
  <line x1="380" y1="210" x2="408" y2="210" stroke="currentColor" stroke-width="1.3" marker-end="url(#e1)"/>

  <rect x="412" y="186" width="150" height="48" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="487" y="206" text-anchor="middle" fill="currentColor" opacity=".8" font-size="11">volvés a medir</text>
  <text x="487" y="223" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">0.81  ✓ queda</text>

  <path d="M 562 210 q 44 0 44 30 q 0 30 -44 30 l -448 0 q -44 0 -44 -30 q 0 -30 44 -30"
        fill="none" stroke="#34d399" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#e1)"/>
  <text x="338" y="266" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">
    cada vuelta sube el número — y si baja, se revierte</text>

  <rect x="24" y="292" width="632" height="96" rx="10" fill="#7c5cff" fill-opacity=".08" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="340" y="318" text-anchor="middle" fill="#7c5cff" font-size="13" font-weight="700">
    Sin evals no podés MEJORAR un sistema. Solo podés CAMBIARLO.</text>
  <text x="340" y="344" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11.5">
    En software normal, tocar facturación no rompe el login.</text>
  <text x="340" y="364" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11.5">
    En un sistema con IA, cambiar una oración del prompt puede cambiar el comportamiento en CUALQUIER caso.</text>
  <text x="340" y="382" text-anchor="middle" fill="currentColor" opacity=".5" font-size="11">
    No hay aislamiento — por eso hace falta medir el agregado, no el caso que estás mirando.</text>
</svg>`,
        pie: 'La diferencia entre girar en círculos y avanzar en espiral es una sola cosa: medir.',
      },

      entrevista: [
        { p: '¿Qué son los evals y por qué son necesarios?',
          r: 'Un eval es un conjunto de casos con su respuesta esperada más una forma automática de puntuar: el equivalente a una suite de tests, ' +
             'pero midiendo calidad en lugar de corrección exacta. Son necesarios porque en un sistema con IA <b>no hay aislamiento</b>: cambiar una ' +
             'oración del prompt puede alterar el comportamiento en cualquier caso, no solo en el que estabas mirando. Sin una medición agregada, ' +
             'arreglás el caso que tenés en pantalla y rompés tres que no ves. <b>Sin evals no se puede mejorar un sistema, solo cambiarlo.</b>' },

        { p: '¿Qué tipo de métrica preferís?',
          r: 'Siempre <b>la métrica determinista más fuerte que pueda construir</b>. Si la tarea es extraer un número, la métrica es si el número ' +
             'coincide; si es clasificar, es exactitud o F1; si es devolver JSON, es si valida el esquema. Son baratas, rápidas y no tienen ruido. ' +
             'Solo reservo <b>LLM-as-judge</b> para lo que genuinamente es abierto, como la calidad de un resumen. Un error muy común es saltar ' +
             'directo al juez para cosas que se verifican con una expresión regular. <b>Convertir una tarea abierta en una verificable es la mejor ' +
             'decisión de diseño que podés tomar en este tema.</b>' },

        { p: '¿Alcanza con una sola métrica?',
          r: 'No, porque un número único esconde compensaciones: un cambio puede subir la exactitud y a la vez triplicar la latencia o el costo, ' +
             'y el número sube igual. Prefiero un tablero chico con exactitud, <i>faithfulness</i>, <i>context recall</i>, tasa de abstención, ' +
             'citas inválidas, latencia p95 y costo por mil consultas. <b>La tasa de abstención es la más informativa y la que menos gente mide</b>: ' +
             'si cae de golpe, significa que el sistema dejó de admitir que no sabe — o sea, empezó a inventar.' },
      ],

      practica: `
<h4>El eval más barato y más útil: retrieval</h4>
<p>Si vas a construir un solo eval, que sea este. Es determinista, corre en segundos y ubica la mayoría de los
problemas de un RAG.</p>
<pre><code>// evals/casos-retrieval.json
[
  { "pregunta": "¿Con cuánta anticipación pido vacaciones?", "esperado": "doc-vac-002" },
  { "pregunta": "¿Cuánto tarda un reembolso?",              "esperado": "doc-reemb-005" }
]</code></pre>
<pre><code>const r = await medirRetrieval(casos);
// { recall: 0.94, mrr: 0.71, enTop5: 0.86 }</code></pre>
<p>Sin ninguna llamada a un modelo grande, sin jueces, sin ambigüedad. <b>Y mide justo la etapa que más
determina la calidad.</b></p>

<h4>El tablero que conviene tener</h4>
<pre><code>export async function correrEvals(conjunto) {
  const r = await Promise.all(conjunto.map(ejecutarCaso));

  return {
    // deterministas — baratas y confiables
    exactitud:        prop(r, c =&gt; c.correcto),
    esquemaValido:    prop(r, c =&gt; c.parseo_ok),
    citasInvalidas:   prop(r, c =&gt; c.citas.inventadas.length &gt; 0),
    abstenciones:     prop(r, c =&gt; c.se_abstuvo),

    // de retrieval
    contextRecall:    prop(r, c =&gt; c.recuperado_correcto),

    // operativas — las que revelan compensaciones ocultas
    p95Latencia:      percentil(r.map(c =&gt; c.ms), 95),
    costoPor1000:     suma(r.map(c =&gt; c.costo_usd)) / r.length * 1000,
  };
}</code></pre>

<div class="aviso"><strong>Cómo empezar hoy si no tenés nada:</strong> tomá <b>20 casos reales</b> de tus logs
—incluidos los que fallaron— y escribí la respuesta esperada de cada uno. Eso ya te da una línea base contra
la cual comparar. <b>Veinte casos malos son infinitamente mejores que ninguno</b>; el conjunto crece solo, cada
vez que aparece un caso nuevo que falla.</div>

<h4>La regla de oro del ciclo</h4>
<pre><code>1. Medí la línea base.
2. Cambiá UNA sola cosa.
3. Volvé a medir sobre TODO el conjunto.
4. Conservá el cambio solo si el agregado mejoró.
5. Si aparece un caso nuevo que falla → agregalo al conjunto ANTES de arreglarlo.</code></pre>
<p>El paso 5 es lo que convierte tu conjunto de evaluación en una red de seguridad que crece: es exactamente
la misma disciplina que un test de regresión.</p>
`,

      errores: [
        { mito: 'Pruebo cinco casos a mano y si andan, anda.',
          realidad: 'Cinco casos elegidos por vos son los fáciles: no representan la distribución real ni incluyen los ambiguos, los mal formados ' +
                    'ni los adversariales. <b>Hacen falta 20-50 como mínimo</b>, y los que más valen son los que hoy fallan.' },

        { mito: 'Los evals son para cuando el producto esté maduro.',
          realidad: 'Son lo que te <b>permite</b> madurarlo. Sin ellos no podés bajar de modelo para ahorrar, ni cambiar de proveedor, ni saber si ' +
                    'una actualización del modelo te rompió algo. Empezar con 20 casos toma una hora y cambia por completo la forma de trabajar.' },

        { mito: 'Uso LLM-as-judge para todo, es lo más moderno.',
          realidad: 'Es caro, lento y ruidoso. <b>Siempre preferí la métrica determinista más fuerte posible</b>: si la tarea es extraer un número, ' +
                    'la métrica es si el número coincide. El juez se reserva para lo genuinamente abierto, como la calidad de un resumen.' },

        { mito: 'Con medir la exactitud alcanza.',
          realidad: 'Un número único esconde compensaciones: podés subir la exactitud y triplicar el costo sin enterarte. Y falta la métrica más ' +
                    'reveladora: la <b>tasa de abstención</b>. Si cae de golpe, el sistema dejó de admitir que no sabe — empezó a inventar, ' +
                    'y la exactitud puede incluso subir mientras eso pasa.' },
      ],

      glosario: [
        { t: 'Eval', d: 'Conjunto de casos con respuesta esperada más una forma automática de puntuar. Test de calidad, no de corrección.' },
        { t: 'Línea base (baseline)', d: 'Medición del sistema actual, contra la cual se comparan todos los cambios.' },
        { t: 'Regresión', d: 'Empeoramiento de casos que antes funcionaban, provocado por un cambio.' },
        { t: 'Métrica determinista', d: 'Puntuación calculable por código sin ambigüedad: exactitud, esquema válido, coincidencia exacta.' },
        { t: 'LLM-as-judge', d: 'Usar un modelo para puntuar las salidas de otro. Necesario en tareas abiertas, caro y ruidoso.' },
        { t: 'Tasa de abstención', d: 'Proporción de veces que el sistema declara no tener la información. Su caída súbita indica que empezó a inventar.' },
        { t: 'F1', d: 'Media armónica de precisión y exhaustividad. Métrica estándar en clasificación con clases desbalanceadas.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Construir el conjunto de evaluación',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el conjunto de evaluación es el <b>activo más
valioso</b> de un sistema con IA. Los prompts se reescriben, los modelos cambian, el código se refactoriza —
el conjunto de casos sobrevive a todo.</div>

<h4>De dónde salen los casos</h4>

<p><b>1 · De tus logs.</b> La mejor fuente, por lejos. Consultas reales de usuarios reales. Si todavía no
tenés usuarios, de las pruebas internas.</p>

<p><b>2 · De los casos que fallaron.</b> Cada bug reportado es un caso de evaluación gratis. <b>La regla:
antes de arreglarlo, agregalo al conjunto.</b> Igual que un test de regresión.</p>

<p><b>3 · De los expertos del dominio.</b> Preguntale a quien conoce el negocio qué preguntas difíciles haría.
Suelen ser justo las que el sistema falla.</p>

<p><b>4 · Generados con un LLM, pero con cuidado.</b> Sirve para tener volumen rápido, pero tienden a ser
demasiado limpios y a parecerse entre sí. <b>Siempre hay que revisarlos a mano</b>, o vas a estar midiendo
contra preguntas que ningún humano haría.</p>

<h4>Qué tiene que haber adentro</h4>
<table>
<tr><th>Tipo de caso</th><th>Proporción</th><th>Por qué</th></tr>
<tr><td>Típicos</td><td>~50%</td><td>El uso normal</td></tr>
<tr><td>Difíciles pero válidos</td><td>~25%</td><td>Ambiguos, multi-parte, con jerga</td></tr>
<tr><td><b>Sin respuesta en el corpus</b></td><td>~15%</td><td>Miden si sabe abstenerse. <b>Casi nadie los incluye</b></td></tr>
<tr><td>Mal formados o fuera de tema</td><td>~10%</td><td>Miden si no se rompe</td></tr>
</table>

<div class="aviso"><strong>Esa tercera fila es la que más gente olvida y la más reveladora.</strong> Si tu
conjunto solo tiene preguntas que <i>sí</i> tienen respuesta, estás midiendo la mitad del sistema. Un modelo que
responde bien el 95% de lo que sabe pero <b>inventa el 100% de lo que no sabe</b> es peligroso, y tu eval le va
a dar 95%.</div>

<h4>Cuántos casos</h4>
<ul>
<li><b>20</b> — mínimo para tener una señal. Empezá acá hoy mismo.</li>
<li><b>50-100</b> — donde los números se vuelven estables y confiables.</li>
<li><b>200+</b> — para detectar diferencias chicas entre dos versiones.</li>
</ul>
<p>Es mejor <b>30 casos bien elegidos y bien etiquetados</b> que 500 generados automáticamente sin revisar.</p>
`,

      tecnico: `
<h4>Estructura de un caso</h4>
<pre><code>{
  "id": "vac-001",
  "pregunta": "¿Con cuánta anticipación tengo que pedir vacaciones?",

  // referencia — cuál corresponde depende de qué evaluás
  "fragmento_esperado": "doc-vac-002",          // eval de retrieval
  "respuesta_ideal": "30 días corridos de anticipación.",
  "debe_contener": ["30 días"],                  // determinista, barata
  "no_debe_contener": ["15 días"],
  "debe_abstenerse": false,

  // metadatos — permiten segmentar los resultados
  "categoria": "recursos_humanos",
  "dificultad": "facil",
  "origen": "log_produccion",
  "agregado": "2026-08-07"
}</code></pre>

<div class="dato"><strong>El campo <code>categoria</code> vale mucho más de lo que parece.</strong> Un promedio
global de 0,85 puede esconder que una categoría entera está en 0,40. Segmentar los resultados por categoría es
lo que convierte "el sistema anda bien" en "el sistema anda bien salvo en facturación", que es accionable.</div>

<h4>Los campos deterministas primero</h4>
<p><code>debe_contener</code> y <code>no_debe_contener</code> parecen rudimentarios y son sorprendentemente
efectivos. Verifican lo que realmente importa —que aparezca el dato correcto y no el incorrecto— sin necesidad
de un juez, con costo cero y sin ruido.</p>
<pre><code>function evaluarDeterminista(salida, caso) {
  const texto = salida.toLowerCase();
  return {
    contiene:   (caso.debe_contener    ?? []).every(t =&gt; texto.includes(t.toLowerCase())),
    noContiene: (caso.no_debe_contener ?? []).every(t =&gt; !texto.includes(t.toLowerCase())),
    abstencion: salida.includes('No encuentro esa información') === caso.debe_abstenerse,
  };
}</code></pre>
<p>Con eso solo ya cubrís buena parte de lo que importa. El juez basado en modelo entra <i>después</i>, para lo
que esto no puede medir.</p>

<h4>Higiene del conjunto</h4>
<ul>
<li><b>Congelado y versionado.</b> Va en el repositorio, no en la cabeza de nadie ni en una planilla suelta.</li>
<li><b>Separado del desarrollo.</b> Si ajustás el prompt mirando los mismos casos, terminás sobreajustando: el número sube y el sistema real no mejora. Conviene un subconjunto <i>ciego</i> que solo se toca antes de desplegar.</li>
<li><b>Crece con los fallos.</b> Cada caso reportado entra al conjunto antes de ser arreglado.</li>
<li><b>Se revisa.</b> Un corpus que cambia puede invalidar respuestas esperadas: una política que se actualizó vuelve incorrecto un caso que era correcto.</li>
</ul>

<h4>Datos sintéticos, cuando se justifican</h4>
<p>Generar casos con un LLM sirve para <b>volumen inicial</b> y para <b>cubrir huecos</b> deliberados
—"generame 10 preguntas sobre reembolsos que un empleado nuevo haría"—. Pero tienden a ser demasiado limpios,
gramaticales y homogéneos, mientras que las consultas reales son cortas, con errores de tipeo y ambiguas.
<b>Sintéticos para volumen, reales para la verdad.</b></p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    COMPOSICIÓN DE UN CONJUNTO DE EVALUACIÓN</text>

  <rect x="24" y="38" width="316" height="30" rx="6" fill="#34d399" fill-opacity=".7"/>
  <text x="38" y="58" fill="#06281c" font-size="11.5" font-weight="700">TÍPICOS  ·  ~50%</text>
  <text x="352" y="58" fill="currentColor" opacity=".65" font-size="11">el uso normal del sistema</text>

  <rect x="24" y="76" width="158" height="30" rx="6" fill="#fbbf24" fill-opacity=".7"/>
  <text x="38" y="96" fill="#3b2a05" font-size="11.5" font-weight="700">DIFÍCILES  ·  ~25%</text>
  <text x="196" y="96" fill="currentColor" opacity=".65" font-size="11">ambiguos, multi-parte, con jerga interna</text>

  <rect x="24" y="114" width="95" height="30" rx="6" fill="#f87171" fill-opacity=".8"/>
  <text x="34" y="134" fill="#3b0a0a" font-size="11" font-weight="700">SIN RESPUESTA</text>
  <text x="133" y="128" fill="#f87171" font-size="11.5" font-weight="700">~15%  ·  los que casi nadie incluye</text>
  <text x="133" y="143" fill="currentColor" opacity=".6" font-size="10.5">miden si el sistema sabe ABSTENERSE</text>

  <rect x="24" y="152" width="63" height="30" rx="6" fill="#7c5cff" fill-opacity=".7"/>
  <text x="32" y="172" fill="#fff" font-size="10" font-weight="700">BASURA</text>
  <text x="101" y="172" fill="currentColor" opacity=".65" font-size="11">~10%  ·  mal formados o fuera de tema — miden que no se rompa</text>

  <rect x="24" y="200" width="632" height="66" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="224" fill="#f87171" font-size="12.5" font-weight="700">POR QUÉ IMPORTA LA FRANJA ROJA</text>
  <text x="44" y="246" fill="currentColor" opacity=".75" font-size="11.5">
    Un sistema que responde bien el 95% de lo que sabe pero inventa el 100% de lo que no sabe…</text>
  <text x="44" y="262" fill="currentColor" opacity=".75" font-size="11.5">
    …saca 95% en un conjunto que solo tiene preguntas con respuesta. Estás midiendo la mitad del sistema.</text>

  <line x1="24" y1="288" x2="656" y2="288" stroke="currentColor" opacity=".18"/>

  <text x="24" y="312" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">DE DÓNDE SALEN LOS CASOS</text>

  <rect x="24" y="324" width="152" height="60" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="100" y="346" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">tus logs</text>
  <text x="100" y="365" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10.5">la mejor fuente</text>

  <rect x="184" y="324" width="152" height="60" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="260" y="346" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">los que fallaron</text>
  <text x="260" y="365" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10.5">agregar ANTES de arreglar</text>

  <rect x="344" y="324" width="152" height="60" rx="9" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="420" y="346" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">expertos del dominio</text>
  <text x="420" y="365" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10.5">las preguntas difíciles</text>

  <rect x="504" y="324" width="152" height="60" rx="9" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.3" stroke-dasharray="4 3"/>
  <text x="580" y="346" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">generados con LLM</text>
  <text x="580" y="365" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10.5">volumen sí, verdad no</text>
</svg>`,
        pie: 'La franja roja es la que separa un eval honesto de uno que se miente a sí mismo.',
      },

      entrevista: [
        { p: '¿Cómo armás un conjunto de evaluación?',
          r: 'Priorizo <b>consultas reales de los logs</b>, porque las sintéticas son demasiado limpias comparadas con lo que escribe la gente. ' +
             'Cuido la composición: alrededor de 50% casos típicos, 25% difíciles, <b>15% preguntas cuya respuesta no está en el corpus</b> y ' +
             '10% entradas mal formadas. Esa franja de preguntas sin respuesta es la que casi nadie incluye y es crítica: mide si el sistema sabe ' +
             'abstenerse. Empiezo con 20 casos y crece solo, porque cada caso que falla en producción entra al conjunto <b>antes</b> de arreglarlo, ' +
             'igual que un test de regresión.' },

        { p: '¿Por qué incluir preguntas que no tienen respuesta en el corpus?',
          r: 'Porque si no, estás midiendo la mitad del sistema. Un modelo que responde bien el 95% de lo que sabe pero <b>inventa el 100% de lo que ' +
             'no sabe</b> saca 95% en un conjunto donde todas las preguntas tienen respuesta — y es peligroso en producción. Esos casos miden la ' +
             '<b>tasa de abstención</b>, que además es una alarma muy útil: si baja de golpe tras un cambio, significa que el sistema empezó a inventar, ' +
             'y la exactitud puede incluso subir mientras eso pasa.' },

        { p: '¿Usarías casos generados por un LLM?',
          r: 'Para <b>volumen inicial y cobertura de huecos</b>, sí, pero siempre revisados a mano. El problema es que son demasiado limpios: ' +
             'gramaticales, completos, homogéneos entre sí. Las consultas reales son cortas, tienen errores de tipeo, son ambiguas y dependen del ' +
             'contexto de la conversación. Si medís solo contra sintéticos, optimizás para preguntas que ningún usuario hace. ' +
             '<b>Sintéticos para volumen, reales para la verdad.</b>' },

        { p: '¿Cómo evitás sobreajustar el prompt a tu propio conjunto de evaluación?',
          r: 'Separando un <b>subconjunto ciego</b> que no miro durante el desarrollo y solo corro antes de desplegar. Si ajusto el prompt mirando ' +
             'los mismos casos una y otra vez, termino optimizando para ellos: el número sube y el sistema real no mejora. Es exactamente el problema ' +
             'de entrenar y evaluar sobre el mismo conjunto. Además segmento por categoría, porque un promedio global de 0,85 puede esconder que ' +
             'una categoría entera está en 0,40.' },
      ],

      practica: `
<h4>Empezar hoy, con lo que tengas</h4>
<pre><code>-- Las 20 consultas más frecuentes de la última semana:
-- ese es tu primer conjunto de evaluación.
select consulta_original, count(*) as veces
from ai_requests
where feature = 'chat_docs'
  and created_at &gt; now() - interval '7 days'
group by 1
order by veces desc
limit 20;</code></pre>
<p>Escribí a mano la respuesta esperada de cada una. Una hora de trabajo, y pasás de no tener nada a tener una
línea base.</p>

<h4>Convertir un bug en un caso, automáticamente</h4>
<pre><code>// Cuando un usuario marca una respuesta como incorrecta,
// se guarda con todo el contexto necesario para reproducirla.
export async function reportarFallo(requestId, comentario) {
  const traza = await traerTraza(requestId);

  await supabase.from('eval_candidatos').insert({
    pregunta:            traza.consulta_original,
    respuesta_obtenida:  traza.respuesta,
    fragmentos_usados:   traza.enviados_al_prompt,
    comentario_usuario:  comentario,
    revisado: false,          // alguien escribe la respuesta esperada
  });
}</code></pre>
<p>Con eso el conjunto crece solo. Una vez por semana alguien revisa los candidatos, escribe la respuesta
esperada y los promueve al conjunto oficial. <b>Es la diferencia entre un eval que envejece y uno que
mejora.</b></p>

<h4>Segmentar los resultados</h4>
<pre><code>const porCategoria = agrupar(resultados, r =&gt; r.caso.categoria);

for (const [cat, casos] of porCategoria) {
  console.log(cat, {
    exactitud: prop(casos, c =&gt; c.correcto),
    n: casos.length,
  });
}
// recursos_humanos { exactitud: 0.94, n: 18 }
// facturacion      { exactitud: 0.41, n: 12 }   ← acá está el problema
// tecnico          { exactitud: 0.88, n: 20 }</code></pre>

<div class="aviso"><strong>Ese 0,41 es invisible en el promedio global</strong>, que daría alrededor de 0,78 y
parecería aceptable. Segmentar por categoría es lo que convierte "el sistema anda bien" en "el sistema anda bien
salvo en facturación" — que es una frase accionable.</div>
`,

      errores: [
        { mito: 'Genero 500 casos con un LLM y ya tengo un buen eval.',
          realidad: 'Son demasiado limpios y homogéneos: gramaticales, completos, todos parecidos. Las consultas reales son cortas, con errores de ' +
                    'tipeo y ambiguas. <b>Treinta casos reales bien etiquetados valen más que 500 sintéticos sin revisar.</b>' },

        { mito: 'Mi conjunto solo tiene preguntas que el sistema debería poder responder.',
          realidad: 'Entonces no medís lo más peligroso: qué hace cuando <b>no</b> sabe. Hace falta un 15% de preguntas sin respuesta en el corpus ' +
                    'para medir la tasa de abstención. Sin ellas, un sistema que inventa sistemáticamente puede sacar 95%.' },

        { mito: 'Ajusto el prompt mirando los resultados del eval.',
          realidad: 'Así <b>sobreajustás</b>: el número sube y el sistema real no mejora, porque optimizaste para esos casos concretos. ' +
                    'Hay que reservar un subconjunto <b>ciego</b> que solo se corre antes de desplegar.' },

        { mito: 'El promedio global me dice cómo anda el sistema.',
          realidad: 'Esconde categorías enteras rotas. Un 0,78 global puede ser 0,94 en un tema y <b>0,41 en otro</b>. Segmentar por categoría ' +
                    'es lo que convierte una métrica en una decisión.' },
      ],

      glosario: [
        { t: 'Golden dataset', d: 'Conjunto de casos con la respuesta correcta conocida. El activo más duradero de un sistema con IA.' },
        { t: 'Conjunto ciego', d: 'Subconjunto que no se mira durante el desarrollo, para evitar sobreajuste.' },
        { t: 'Sobreajuste al eval', d: 'Optimizar para los casos de prueba en lugar de para el problema real.' },
        { t: 'Caso adversarial', d: 'Entrada deliberadamente difícil, ambigua o maliciosa.' },
        { t: 'Datos sintéticos', d: 'Casos generados por un modelo. Útiles para volumen, poco representativos de la realidad.' },
        { t: 'Segmentación', d: 'Analizar los resultados por categoría en lugar de un promedio único.' },
        { t: 'Test de regresión', d: 'Caso que se agrega tras un fallo para asegurar que no vuelva a ocurrir.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'LLM-as-judge y las métricas de RAG',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> cuando no hay una respuesta única correcta —como
en un resumen— usás <b>otro modelo como corrector</b>. Funciona sorprendentemente bien, pero tiene sesgos que
hay que conocer.</div>

<h4>Cuándo hace falta un juez</h4>
<p>Solo cuando la calidad es genuinamente subjetiva: ¿este resumen es bueno? ¿el tono es apropiado? ¿la
respuesta es útil? Si la tarea tiene una respuesta verificable, <b>no uses juez</b>: usá código.</p>

<h4>Los cuatro sesgos que hay que conocer</h4>
<p>Cada uno tiene un nombre y una corrección concreta. Mencionarlos en una entrevista muestra experiencia real:</p>

<table>
<tr><th>Sesgo</th><th>Qué hace</th><th>Corrección</th></tr>
<tr><td><b>De posición</b></td><td>Prefiere la primera opción que se le muestra</td><td>Evaluar en los dos órdenes y promediar</td></tr>
<tr><td><b>De verbosidad</b></td><td>Prefiere las respuestas largas, aunque no sean mejores</td><td>Pedir que ignore la longitud; controlar por extensión</td></tr>
<tr><td><b>De autoafinidad</b></td><td>Prefiere el texto generado por su propia familia de modelos</td><td>Usar como juez un modelo de otra familia</td></tr>
<tr><td><b>De benevolencia</b></td><td>Tiende a aprobar: casi todo le parece 4 sobre 5</td><td>Rúbrica explícita con ejemplos de cada nivel</td></tr>
</table>

<div class="aviso"><strong>El más peligroso es el último.</strong> Un juez sin rúbrica te da 4,2 sobre 5 casi
siempre, lo cual es indistinguible de no medir nada. La corrección es dar una <b>escala definida con ejemplos
concretos de qué es un 1, un 3 y un 5</b> en tu dominio.</div>

<h4>Las tres métricas de RAG</h4>
<p>Estas tres te las pueden preguntar por nombre:</p>

<p><b>Context recall</b> — ¿el fragmento con la respuesta fue recuperado? Mide el <b>retrieval</b>.
Es la primera que hay que mirar porque acota a todas las demás.</p>

<p><b>Faithfulness</b> (fidelidad) — ¿cada afirmación de la respuesta está respaldada por el contexto
recuperado? Mide la <b>generación</b>. Detecta que el modelo agregó cosas de su conocimiento propio.</p>

<p><b>Answer relevance</b> — ¿la respuesta contesta lo que se preguntó? Detecta respuestas correctas pero que
no vienen al caso.</p>

<p>Las tres juntas te dicen dónde está el problema: recall bajo → arreglá la búsqueda; recall alto y
faithfulness bajo → arreglá el prompt; ambas altas y relevance baja → el modelo se está yendo por las ramas.</p>
`,

      tecnico: `
<h4>Diseñar un juez que sirva</h4>
<p>Un juez mal diseñado es peor que ninguno, porque da una falsa sensación de medición. Los requisitos:</p>

<ol>
<li><b>Rúbrica explícita con ejemplos.</b> "Puntuá del 1 al 5" sin definir cada nivel produce todo 4.</li>
<li><b>Razonamiento antes del puntaje.</b> El campo de justificación va <i>primero</i> en el esquema de salida: obliga a fundamentar en vez de racionalizar.</li>
<li><b>Escala corta.</b> De 1 a 5, o binaria. De 1 a 10 nadie —ni un modelo— distingue un 6 de un 7 de forma consistente.</li>
<li><b>Temperatura 0.</b> Es una tarea de clasificación, no creativa.</li>
<li><b>Una dimensión por llamada.</b> Pedirle que puntúe exactitud, tono y completitud a la vez las mezcla.</li>
<li><b>Calibrado contra humanos.</b> Sin esto no sabés si el juez mide lo que creés.</li>
</ol>

<div class="dato"><strong>La calibración es el paso que separa un juez confiable de uno decorativo:</strong>
tomá 30 casos, puntualos a mano, corré el juez sobre los mismos, y medí el <b>acuerdo</b>. Si coincide en el
80-90%, podés confiar en él para el resto. Si coincide en el 50%, tu juez está midiendo otra cosa y todos los
números que produjo hasta ahora son ruido. <b>Es media hora de trabajo y define si tenés una métrica o una
ilusión.</b></div>

<h4>Faithfulness, paso a paso</h4>
<p>La implementación estándar descompone en lugar de puntuar de una:</p>
<ol>
<li>Descomponer la respuesta en afirmaciones atómicas.</li>
<li>Por cada afirmación, preguntar: "¿se deduce del contexto? sí / no / parcialmente".</li>
<li><code>faithfulness = afirmaciones sustentadas / total</code>.</li>
</ol>
<p>Descomponer primero es lo que la hace confiable: puntuar "del 1 al 5, ¿qué tan fiel es esta respuesta?" de
un solo golpe es mucho más ruidoso, y además el resultado no te dice <i>qué</i> parte falló.</p>

<h4>Costo y muestreo</h4>
<p>Un juez cuesta una llamada extra por caso y dimensión. Con 100 casos y 3 dimensiones son 300 llamadas por
corrida. Estrategias:</p>
<ul>
<li><b>Modelo chico para el juez</b> cuando la tarea de juicio es simple (¿está sustentado o no?).</li>
<li><b>Muestreo en producción</b> — juzgar el 1-5% del tráfico alcanza para detectar tendencias.</li>
<li><b>Deterministas primero</b> — filtrar con código y usar el juez solo donde la comprobación automática no llega.</li>
</ul>

<h4>Señales implícitas en producción</h4>
<p>Más baratas que cualquier juez y muy informativas:</p>
<table>
<tr><th>Señal</th><th>Qué sugiere</th></tr>
<tr><td>El usuario reformula la pregunta</td><td>La respuesta no sirvió</td></tr>
<tr><td>Copia la respuesta</td><td>Le sirvió</td></tr>
<tr><td>Abre el documento citado</td><td>Confía y verifica: buena señal</td></tr>
<tr><td>Abandona la sesión sin más</td><td>Ambiguo, pero útil en agregado</td></tr>
<tr><td>Pulgar arriba/abajo</td><td>Explícito, pero con muy poca tasa de respuesta</td></tr>
</table>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS TRES MÉTRICAS DE RAG — cada una señala una etapa distinta</text>

  <rect x="24" y="38" width="632" height="62" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="44" y="62" fill="#34d399" font-size="12.5" font-weight="700">CONTEXT RECALL</text>
  <text x="230" y="62" fill="currentColor" opacity=".8" font-size="11.5">¿el fragmento correcto fue recuperado?</text>
  <text x="44" y="84" fill="currentColor" opacity=".55" font-size="11">mide el RETRIEVAL  ·  se mira PRIMERO: acota a todas las demás</text>

  <rect x="24" y="108" width="632" height="62" rx="10" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="44" y="132" fill="#22d3ee" font-size="12.5" font-weight="700">FAITHFULNESS</text>
  <text x="230" y="132" fill="currentColor" opacity=".8" font-size="11.5">¿cada afirmación está respaldada por el contexto?</text>
  <text x="44" y="154" fill="currentColor" opacity=".55" font-size="11">mide la GENERACIÓN  ·  detecta que el modelo agregó cosas de su memoria</text>

  <rect x="24" y="178" width="632" height="62" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="44" y="202" fill="#7c5cff" font-size="12.5" font-weight="700">ANSWER RELEVANCE</text>
  <text x="230" y="202" fill="currentColor" opacity=".8" font-size="11.5">¿la respuesta contesta lo que se preguntó?</text>
  <text x="44" y="224" fill="currentColor" opacity=".55" font-size="11">detecta respuestas correctas pero que no vienen al caso</text>

  <rect x="24" y="252" width="632" height="42" rx="9" fill="#fbbf24" fill-opacity=".1" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="44" y="270" fill="#fbbf24" font-size="11.5" font-weight="700">CÓMO LEERLAS JUNTAS</text>
  <text x="44" y="287" fill="currentColor" opacity=".7" font-size="11">
    recall bajo → arreglá la búsqueda  ·  recall alto + faithfulness bajo → arreglá el prompt  ·  relevance baja → se va por las ramas</text>

  <line x1="24" y1="312" x2="656" y2="312" stroke="currentColor" opacity=".18"/>

  <text x="24" y="336" fill="#f87171" font-size="11.5" font-weight="700">
    LOS 4 SESGOS DEL JUEZ  —  nombrarlos en una entrevista muestra experiencia real</text>

  <rect x="24" y="348" width="152" height="58" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="100" y="368" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">POSICIÓN</text>
  <text x="100" y="385" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">prefiere la primera</text>
  <text x="100" y="399" text-anchor="middle" fill="#34d399" font-size="10">→ evaluar en ambos órdenes</text>

  <rect x="184" y="348" width="152" height="58" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="260" y="368" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">VERBOSIDAD</text>
  <text x="260" y="385" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">prefiere las largas</text>
  <text x="260" y="399" text-anchor="middle" fill="#34d399" font-size="10">→ controlar por extensión</text>

  <rect x="344" y="348" width="152" height="58" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="420" y="368" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">AUTOAFINIDAD</text>
  <text x="420" y="385" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">prefiere lo suyo</text>
  <text x="420" y="399" text-anchor="middle" fill="#34d399" font-size="10">→ juez de otra familia</text>

  <rect x="504" y="348" width="152" height="58" rx="9" fill="#f87171" fill-opacity=".18" stroke="#f87171" stroke-width="1.7"/>
  <text x="580" y="368" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">BENEVOLENCIA</text>
  <text x="580" y="385" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">todo le parece un 4</text>
  <text x="580" y="399" text-anchor="middle" fill="#34d399" font-size="10">→ rúbrica con ejemplos</text>
</svg>`,
        pie: 'El sesgo de benevolencia es el más peligroso: da números que parecen mediciones y no lo son.',
      },

      entrevista: [
        { p: '¿Qué es LLM-as-judge y cuáles son sus problemas?',
          r: 'Es usar un modelo para puntuar las salidas de otro, y es necesario cuando la calidad es genuinamente subjetiva —un resumen, un tono—. ' +
             'Tiene cuatro sesgos conocidos: <b>de posición</b>, prefiere la primera opción que ve; <b>de verbosidad</b>, prefiere las respuestas ' +
             'largas; <b>de autoafinidad</b>, prefiere el texto de su propia familia de modelos; y <b>de benevolencia</b>, tiende a aprobar todo. ' +
             'Se corrigen evaluando en ambos órdenes, controlando por longitud, usando un juez de otra familia, y sobre todo con una ' +
             '<b>rúbrica explícita con ejemplos de cada nivel</b>. Y hay que <b>calibrarlo contra puntuación humana</b>, o no sabés si mide lo que creés.' },

        { p: 'Explicame faithfulness y context recall.',
          r: '<b>Context recall</b> mide el retrieval: si el fragmento con la respuesta correcta fue efectivamente recuperado. ' +
             '<b>Faithfulness</b> mide la generación: qué proporción de las afirmaciones de la respuesta están respaldadas por el contexto que se ' +
             'le pasó. Se leen juntas y así ubican el problema: <b>recall bajo</b> significa arreglar la búsqueda; <b>recall alto con faithfulness ' +
             'bajo</b> significa que el modelo está agregando cosas de su conocimiento propio, y eso se arregla en el prompt. ' +
             'Siempre miro recall primero porque acota el techo de todo lo demás.' },

        { p: '¿Cómo se implementa una métrica de faithfulness?',
          r: 'Descomponiendo en lugar de puntuar de una. Primero se parte la respuesta en <b>afirmaciones atómicas</b>; después, por cada una, ' +
             'se le pregunta a un modelo si se deduce del contexto —sí, no o parcialmente—; y la métrica es la proporción de afirmaciones ' +
             'sustentadas. Descomponer primero la hace mucho menos ruidosa que pedir un puntaje global, y tiene una ventaja adicional importante: ' +
             '<b>te dice qué parte específica de la respuesta no tenía respaldo</b>, que es accionable.' },

        { p: '¿Cómo sabés si podés confiar en tu juez?',
          r: 'Calibrándolo. Tomo unos 30 casos, los puntúo a mano, corro el juez sobre los mismos y mido el <b>acuerdo</b>. Si coincide en el 80-90%, ' +
             'confío en él para el resto del conjunto. Si coincide en el 50%, está midiendo otra cosa y todos los números que produjo son ruido. ' +
             '<b>Es media hora de trabajo y define si tenés una métrica o una ilusión de métrica</b>, y es un paso que casi nadie hace.' },
      ],

      practica: `
<h4>Un juez con rúbrica</h4>
<pre><code>const RUBRICA = \`
Puntuá qué tan bien la RESPUESTA se apoya en el CONTEXTO.

5 — Todas las afirmaciones se deducen directamente del contexto.
4 — Todas se deducen, con alguna reformulación que no altera el sentido.
3 — La mayoría se deduce, pero hay una afirmación no sustentada.
2 — Varias afirmaciones sin respaldo, o una contradice el contexto.
1 — Mayormente inventada o contradice el contexto.

Ejemplo de 5:  contexto "el plazo es de 30 días" → respuesta "30 días".
Ejemplo de 2:  contexto "el plazo es de 30 días" → respuesta "30 días,
               prorrogables a 45" (la prórroga NO está en el contexto).
\`;

const ESQUEMA = {
  type: 'object',
  properties: {
    // el razonamiento va PRIMERO: obliga a fundamentar antes de puntuar
    afirmaciones_sin_respaldo: { type: 'array', items: { type: 'string' } },
    justificacion: { type: 'string' },
    puntaje: { type: 'integer', minimum: 1, maximum: 5 },
  },
  required: ['afirmaciones_sin_respaldo', 'justificacion', 'puntaje'],
};</code></pre>

<div class="aviso"><strong>El orden de los campos del esquema no es cosmético.</strong> Los campos se generan
en orden y cada uno se condiciona a los anteriores. Con <code>puntaje</code> primero, el modelo decide y después
justifica —racionaliza—. Con las afirmaciones y la justificación primero, <b>razona y después concluye</b>.
Cambia la calidad del juicio de verdad.</div>

<h4>Calibrar contra humanos</h4>
<pre><code>const humanos = [ { id: 'c1', puntaje: 4 }, { id: 'c2', puntaje: 2 }, /* …30 casos */ ];
const juez     = await Promise.all(humanos.map(h =&gt; juzgar(h.id)));

const exacto  = prop(humanos, (h, i) =&gt; h.puntaje === juez[i].puntaje);
const cercano = prop(humanos, (h, i) =&gt; Math.abs(h.puntaje - juez[i].puntaje) &lt;= 1);

console.log({ exacto, cercano });
// { exacto: 0.63, cercano: 0.90 }  → confiable para tendencias</code></pre>
<p>El acuerdo <b>exacto</b> casi nunca es alto —dos personas tampoco coinciden siempre—. Lo que importa es el
acuerdo <b>dentro de un punto</b>: por encima de 0,85 el juez sirve para comparar versiones.</p>

<h4>Faithfulness descompuesta</h4>
<pre><code>export async function faithfulness(respuesta, contexto) {
  const { afirmaciones } = await extraerAfirmaciones(respuesta);   // modelo chico

  const veredictos = await Promise.all(
    afirmaciones.map(a =&gt; verificarSustento(a, contexto))          // sí / no / parcial
  );

  const sustentadas = veredictos.filter(v =&gt; v === 'si').length;
  return {
    puntaje: sustentadas / afirmaciones.length,
    sinSustento: afirmaciones.filter((_, i) =&gt; veredictos[i] === 'no'),  // accionable
  };
}</code></pre>
`,

      errores: [
        { mito: 'Le pido al modelo "puntuá del 1 al 10" y ya tengo una métrica.',
          realidad: 'Sin rúbrica, el <b>sesgo de benevolencia</b> te da 7 u 8 casi siempre, que es indistinguible de no medir. ' +
                    'Y en una escala de 10 nadie distingue un 6 de un 7 de forma consistente. <b>Escala corta, rúbrica explícita, ejemplos de ' +
                    'cada nivel.</b>' },

        { mito: 'Uso el mismo modelo para generar y para juzgar.',
          realidad: 'Aparece el <b>sesgo de autoafinidad</b>: los modelos tienden a preferir el texto de su propia familia. ' +
                    'Conviene un juez de otra familia, o al menos verificar que el sesgo no esté afectando la comparación entre versiones.' },

        { mito: 'Si el juez me da 4,5 sobre 5, el sistema anda bien.',
          realidad: 'No sabés eso hasta <b>calibrar contra puntuación humana</b>. Un juez sin calibrar puede estar midiendo fluidez en vez de ' +
                    'exactitud. Treinta casos puntuados a mano te dicen si tenés una métrica o una ilusión de métrica.' },

        { mito: 'Uso el juez para todo el tráfico de producción.',
          realidad: 'Duplica el costo y la latencia de cada consulta. En producción alcanza con <b>muestrear el 1-5%</b> para detectar tendencias, ' +
                    'y complementarlo con señales implícitas —reformulaciones, copiado, clics en las fuentes— que son gratis.' },
      ],

      glosario: [
        { t: 'LLM-as-judge', d: 'Usar un modelo para puntuar salidas de otro modelo.' },
        { t: 'Rúbrica', d: 'Definición explícita de cada nivel de la escala, con ejemplos. Corrige el sesgo de benevolencia.' },
        { t: 'Calibración', d: 'Comparar el juez contra puntuación humana para saber si mide lo que se cree.' },
        { t: 'Sesgo de posición', d: 'Tendencia a preferir la primera opción presentada.' },
        { t: 'Sesgo de verbosidad', d: 'Tendencia a preferir respuestas más largas.' },
        { t: 'Sesgo de autoafinidad', d: 'Tendencia a preferir texto generado por la propia familia de modelos.' },
        { t: 'Faithfulness', d: 'Proporción de afirmaciones de la respuesta sustentadas por el contexto recuperado.' },
        { t: 'Answer relevance', d: 'Si la respuesta contesta efectivamente la pregunta formulada.' },
        { t: 'Afirmación atómica', d: 'Unidad mínima verificable en que se descompone una respuesta para evaluarla.' },
        { t: 'Señal implícita', d: 'Comportamiento del usuario que indica satisfacción sin que la declare: copiar, reformular, abrir la fuente.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Evals en el ciclo de trabajo',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un eval que corrés a mano cuando te acordás no
sirve. Tiene que correr <b>solo</b>, en cada cambio, como los tests.</div>

<h4>Los cuatro momentos</h4>

<p><b>1 · Mientras desarrollás.</b> Un subconjunto chico y rápido —10-20 casos— que corras en segundos. Es tu
ciclo de trabajo.</p>

<p><b>2 · En cada pull request.</b> El conjunto completo, automático. Si una métrica baja más de cierto umbral,
el PR se marca. <b>Prompts y evals versionados juntos, en el repositorio.</b></p>

<p><b>3 · Antes de desplegar.</b> Acá entra el subconjunto ciego, ese que nadie miró durante el desarrollo.</p>

<p><b>4 · En producción, continuo.</b> Muestreo del tráfico real más señales implícitas. Es lo único que
detecta que el mundo cambió.</p>

<div class="aviso"><strong>El caso que hace inevitable el punto 4:</strong> el proveedor actualiza el modelo.
Vos no tocaste nada —no hubo deploy, no hubo commit— y tu sistema se comporta distinto. Sin monitoreo continuo,
te enterás por un cliente. <b>Es el argumento más fuerte para fijar la versión del modelo</b> y para tener
evals corriendo todo el tiempo.</div>

<h4>Tratar los prompts como código</h4>
<p>Esto es lo que más ordena un proyecto y casi nadie lo hace al principio:</p>
<ul>
<li><b>Los prompts viven en el repositorio</b>, no en la base de datos ni en un panel. Versionados con git.</li>
<li><b>Cada cambio de prompt es un commit</b> con sus resultados de eval en la descripción.</li>
<li><b>Los evals corren en CI</b> igual que los tests.</li>
<li><b>La versión del modelo está fijada</b> y cambiarla es un cambio explícito, con su comparación.</li>
</ul>
<p>Con eso podés responder "¿por qué cambió el comportamiento el martes?" mirando el historial, en vez de
adivinar.</p>
`,

      tecnico: `
<h4>Evals en CI</h4>
<pre><code># .github/workflows/evals.yml
name: evals
on: [pull_request]

jobs:
  evaluar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm evals:rapidos          # deterministas: retrieval, esquema, formato
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
      - name: Comparar contra la línea base
        run: node scripts/comparar-evals.mjs --umbral 0.03</code></pre>

<p>Detalle de diseño importante: <b>los evals deterministas corren en cada PR</b> —son baratos y rápidos—;
los que usan juez, solo en la rama principal o bajo etiqueta, porque cuestan dinero real por corrida.</p>

<div class="dato"><strong>Sobre el umbral:</strong> con conjuntos chicos, una variación de un par de puntos
suele ser ruido, no señal. Con 50 casos, un caso que cambia mueve la métrica 2 puntos. Por eso el umbral de
alerta se fija según el tamaño del conjunto, y conviene <b>correr los casos críticos varias veces</b> y usar
la mediana, para separar variación real de aleatoriedad del muestreo.</div>

<h4>Monitoreo en producción</h4>
<table>
<tr><th>Qué</th><th>Frecuencia</th><th>Alerta si…</th></tr>
<tr><td>Tasa de abstención</td><td>Continua</td><td>Cae o sube más de un 50% relativo</td></tr>
<tr><td>Citas inválidas</td><td>Continua</td><td>Supera el 2%</td></tr>
<tr><td>Latencia p95</td><td>Continua</td><td>Se degrada más del 30%</td></tr>
<tr><td>Costo por consulta</td><td>Diaria</td><td>Sube más del 20% sin cambio de tráfico</td></tr>
<tr><td>Faithfulness por muestreo</td><td>1-5% del tráfico</td><td>Cae por debajo del umbral</td></tr>
<tr><td>Reformulaciones del usuario</td><td>Continua</td><td>Suben: señal de respuestas que no sirven</td></tr>
</table>

<p>Las tres primeras son <b>gratis</b>: salen de la traza que ya guardás. Son las que hay que poner primero.</p>

<h4>Comparar dos versiones bien</h4>
<ul>
<li><b>Mismo conjunto, mismas condiciones.</b> Suena obvio y es la causa n°1 de comparaciones inválidas.</li>
<li><b>Varias corridas.</b> Los LLM no son deterministas: una sola corrida por versión no distingue una mejora real de la aleatoriedad.</li>
<li><b>Mirá también las operativas.</b> Una versión mejor pero tres veces más lenta puede no convenir.</li>
<li><b>Revisá los casos que cambiaron de resultado</b>, no solo el agregado. Ahí se ve qué hizo realmente el cambio.</li>
</ul>
<p>Ese último punto es el más útil en la práctica: un agregado que sube 2 puntos puede esconder que arreglaste
diez casos y rompiste ocho.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="c1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS CUATRO MOMENTOS DE UN EVAL</text>

  <rect x="24" y="38" width="150" height="88" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="99" y="60" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">1 · DESARROLLO</text>
  <text x="99" y="80" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">10-20 casos</text>
  <text x="99" y="96" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">corre en segundos</text>
  <text x="99" y="116" text-anchor="middle" fill="currentColor" opacity=".45" font-size="10">tu ciclo de trabajo</text>

  <line x1="178" y1="82" x2="196" y2="82" stroke="currentColor" stroke-width="1.3" marker-end="url(#c1)"/>

  <rect x="200" y="38" width="150" height="88" rx="10" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="275" y="60" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">2 · CADA PR</text>
  <text x="275" y="80" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">conjunto completo</text>
  <text x="275" y="96" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">automático, en CI</text>
  <text x="275" y="116" text-anchor="middle" fill="currentColor" opacity=".45" font-size="10">bloquea si baja</text>

  <line x1="354" y1="82" x2="372" y2="82" stroke="currentColor" stroke-width="1.3" marker-end="url(#c1)"/>

  <rect x="376" y="38" width="150" height="88" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="451" y="60" text-anchor="middle" fill="#7c5cff" font-size="11.5" font-weight="700">3 · PRE-DEPLOY</text>
  <text x="451" y="80" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">conjunto CIEGO</text>
  <text x="451" y="96" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">nadie lo miró antes</text>
  <text x="451" y="116" text-anchor="middle" fill="currentColor" opacity=".45" font-size="10">evita sobreajuste</text>

  <line x1="530" y1="82" x2="548" y2="82" stroke="currentColor" stroke-width="1.3" marker-end="url(#c1)"/>

  <rect x="552" y="38" width="104" height="88" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="604" y="60" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">4 · PROD</text>
  <text x="604" y="80" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">muestreo 1-5%</text>
  <text x="604" y="96" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">+ señales</text>
  <text x="604" y="116" text-anchor="middle" fill="currentColor" opacity=".45" font-size="10">continuo</text>

  <rect x="24" y="150" width="632" height="76" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="174" fill="#f87171" font-size="12.5" font-weight="700">
    POR QUÉ EL PUNTO 4 NO ES OPCIONAL</text>
  <text x="44" y="196" fill="currentColor" opacity=".75" font-size="11.5">
    El proveedor actualiza el modelo. Vos no tocaste nada: sin deploy, sin commit.</text>
  <text x="44" y="216" fill="currentColor" opacity=".75" font-size="11.5">
    Tu sistema se comporta distinto y te enterás por un cliente. Es el argumento más fuerte para FIJAR la versión.</text>

  <line x1="24" y1="248" x2="656" y2="248" stroke="currentColor" opacity=".18"/>

  <text x="24" y="272" fill="#34d399" font-size="11.5" font-weight="700">
    TRATAR LOS PROMPTS COMO CÓDIGO</text>

  <rect x="24" y="284" width="304" height="100" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.3"/>
  <text x="44" y="306" fill="#34d399" font-size="11.5" font-weight="700">✓ ASÍ</text>
  <text x="44" y="326" fill="currentColor" opacity=".7" font-size="10.5">prompts en el repositorio, versionados</text>
  <text x="44" y="344" fill="currentColor" opacity=".7" font-size="10.5">cada cambio = un commit con sus métricas</text>
  <text x="44" y="362" fill="currentColor" opacity=".7" font-size="10.5">evals en CI · versión del modelo fijada</text>
  <text x="44" y="378" fill="#34d399" font-size="10">“¿por qué cambió el martes?” → mirás el historial</text>

  <rect x="352" y="284" width="304" height="100" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.3"/>
  <text x="372" y="306" fill="#f87171" font-size="11.5" font-weight="700">✗ ASÍ NO</text>
  <text x="372" y="326" fill="currentColor" opacity=".7" font-size="10.5">prompts en la base o en un panel</text>
  <text x="372" y="344" fill="currentColor" opacity=".7" font-size="10.5">cambios sin registro de quién y por qué</text>
  <text x="372" y="362" fill="currentColor" opacity=".7" font-size="10.5">alias “latest” del modelo</text>
  <text x="372" y="378" fill="#f87171" font-size="10">“¿por qué cambió el martes?” → nadie sabe</text>
</svg>`,
        pie: 'Un eval que corrés a mano cuando te acordás no es un eval: es una anécdota.',
      },

      entrevista: [
        { p: '¿Cómo integrás los evals en el ciclo de desarrollo?',
          r: 'En cuatro momentos. Un <b>subconjunto rápido</b> de 10-20 casos mientras desarrollo, que corre en segundos. El <b>conjunto completo ' +
             'en cada pull request</b>, automático, marcando el PR si alguna métrica baja del umbral. Un <b>subconjunto ciego</b> antes de desplegar, ' +
             'que nadie miró durante el desarrollo, para evitar sobreajuste. Y <b>monitoreo continuo en producción</b> con muestreo del 1-5% más ' +
             'señales implícitas. Además trato los prompts como código: viven en el repositorio, versionados con git, y cada cambio es un commit ' +
             'con sus resultados de eval.' },

        { p: '¿Por qué es importante fijar la versión del modelo?',
          r: 'Porque si usás un alias móvil, el proveedor actualiza y <b>tu sistema cambia de comportamiento sin que haya habido ningún deploy ni ' +
             'ningún commit</b>. Los prompts estaban afinados para la versión anterior y las métricas se mueven sin causa aparente. ' +
             'Con la versión fijada, la migración es una decisión explícita: corro las evals contra el modelo nuevo, comparo, y recién ahí cambio. ' +
             'Y aun así conviene el monitoreo continuo, porque es lo único que detecta que algo se movió.' },

        { p: 'Tu eval mejoró de 0,82 a 0,85. ¿Es una mejora real?',
          r: 'No necesariamente, y hay que decirlo. Con 50 casos, tres puntos son un caso y medio: puede ser puro ruido, porque los LLM no son ' +
             'deterministas. Antes de dar el cambio por bueno haría dos cosas: <b>correr varias veces y comparar medianas</b>, y sobre todo ' +
             '<b>mirar qué casos cambiaron de resultado</b>. Un agregado que sube tres puntos puede esconder que arreglaste diez casos y rompiste ' +
             'ocho — y esos ocho pueden ser los importantes.' },
      ],

      practica: `
<h4>Comparar dos versiones, mirando los casos</h4>
<pre><code>export function comparar(antes, despues) {
  const arreglados = [], rotos = [];

  for (const id of Object.keys(antes)) {
    if (!antes[id].correcto &amp;&amp;  despues[id].correcto) arreglados.push(id);
    if ( antes[id].correcto &amp;&amp; !despues[id].correcto) rotos.push(id);
  }

  return {
    delta: prop(despues, c =&gt; c.correcto) - prop(antes, c =&gt; c.correcto),
    arreglados,
    rotos,                            // ← lo que hay que mirar SIEMPRE
    netos: arreglados.length - rotos.length,
  };
}</code></pre>

<div class="aviso"><strong>El campo <code>rotos</code> es el más importante del informe.</strong> Un delta
positivo con ocho casos rotos puede ser un mal negocio si esos ocho son los más frecuentes en producción.
<b>El agregado te dice si moviste la aguja; la lista de rotos te dice si valió la pena.</b></div>

<h4>Alertas que salen gratis de la traza</h4>
<pre><code>-- Estas tres consultas no cuestan una sola llamada extra a un modelo:
-- salen de lo que ya estás registrando.

-- 1 · ¿el sistema dejó de admitir que no sabe?
select date_trunc('hour', created_at) as hora,
       avg(case when se_abstuvo then 1 else 0 end) as tasa_abstencion
from ai_requests where feature = 'chat_docs'
group by 1 order by 1 desc limit 24;

-- 2 · ¿está inventando fuentes?
select avg(case when jsonb_array_length(citas_invalidas) &gt; 0 then 1 else 0 end)
from ai_requests where created_at &gt; now() - interval '1 day';

-- 3 · ¿se degradó la latencia?
select percentile_cont(0.95) within group (order by latencia_ms)
from ai_requests where created_at &gt; now() - interval '1 hour';</code></pre>

<h4>Qué construir primero si no tenés nada</h4>
<table>
<tr><th>#</th><th>Qué</th><th>Tiempo</th><th>Por qué primero</th></tr>
<tr><td>1</td><td>Traza por consulta</td><td>2 h</td><td>Sin datos no podés medir ni diagnosticar nada</td></tr>
<tr><td>2</td><td>20 casos de retrieval</td><td>1 h</td><td>Determinista, rápido, ubica la mayoría de los problemas</td></tr>
<tr><td>3</td><td>Alertas de abstención y citas</td><td>1 h</td><td>Salen gratis de la traza</td></tr>
<tr><td>4</td><td>Evals en CI</td><td>3 h</td><td>Hace que lo anterior no se abandone</td></tr>
<tr><td>5</td><td>Juez calibrado</td><td>6 h</td><td>Solo cuando lo determinista ya no alcanza</td></tr>
</table>
<p>Ese orden importa: <code>2 h + 1 h + 1 h</code> te dan el 80% del beneficio. El juez —lo más vistoso— va
último, y muchas veces no hace falta.</p>
`,

      errores: [
        { mito: 'Corro los evals cuando cambio algo grande.',
          realidad: 'Los cambios chicos también rompen: una palabra del prompt puede alterar el comportamiento en cualquier caso. ' +
                    'Si el eval no corre <b>solo</b>, en CI, deja de correrse en dos semanas. Es exactamente lo que pasa con los tests que no están ' +
                    'automatizados.' },

        { mito: 'Los prompts van en la base de datos para poder cambiarlos sin desplegar.',
          realidad: 'Suena práctico y hace imposible responder "¿por qué cambió el comportamiento el martes?". <b>Los prompts van en el repositorio, ' +
                    'versionados con git</b>, y cada cambio es un commit con sus resultados de eval. Si necesitás cambiarlos sin desplegar, ' +
                    'al menos versionalos y registrá quién cambió qué.' },

        { mito: 'Si la métrica subió, el cambio fue bueno.',
          realidad: 'Mirá <b>qué casos cambiaron de resultado</b>. Un delta de +3 puntos puede significar diez casos arreglados y ocho rotos, ' +
                    'y esos ocho pueden ser los más frecuentes en producción. El agregado dice si moviste la aguja; la lista de rotos dice si ' +
                    'valió la pena.' },

        { mito: 'Con los evals en CI ya estoy cubierto.',
          realidad: 'Falta producción. El proveedor puede actualizar el modelo sin que vos toques nada, el corpus cambia, y las consultas reales ' +
                    'derivan hacia temas nuevos. <b>Las alertas de abstención, citas inválidas y latencia salen gratis de la traza que ya guardás</b> ' +
                    'y detectan justo lo que CI no puede ver.' },
      ],

      glosario: [
        { t: 'CI', d: 'Integración continua. Ejecución automática de pruebas —y evals— en cada cambio.' },
        { t: 'Umbral de regresión', d: 'Caída máxima tolerada en una métrica antes de marcar un cambio como problemático.' },
        { t: 'Muestreo en producción', d: 'Evaluar una fracción del tráfico real para detectar tendencias sin duplicar el costo.' },
        { t: 'Deriva (drift)', d: 'Cambio gradual en las consultas reales o en el comportamiento del modelo con el tiempo.' },
        { t: 'Versión fijada', d: 'Usar un identificador exacto de modelo en lugar de un alias móvil como "latest".' },
        { t: 'Prompt versionado', d: 'Prompt almacenado en el repositorio con historial de cambios en git.' },
        { t: 'Casos rotos', d: 'Los que funcionaban antes de un cambio y dejaron de funcionar. El dato más importante de una comparación.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Por qué un sistema con IA necesita evals más que el software tradicional?',
      opciones: [
        'Porque no hay aislamiento: un cambio de prompt puede alterar el comportamiento en cualquier caso',
        'Porque los modelos son más lentos',
        'Porque el código es más complejo',
        'Porque hay más usuarios',
      ],
      correcta: 0,
      porQue: 'En software normal, tocar facturación no rompe el login. En un sistema con IA, cambiar una oración del prompt puede cambiar cualquier comportamiento, así que hay que medir el agregado y no solo el caso que estás mirando.',
      porQueNo: {
        1: 'La latencia es un problema operativo, no de correctitud.',
        2: 'El código de un sistema con IA suele ser más simple que el de muchos sistemas tradicionales.',
        3: 'La cantidad de usuarios no cambia la necesidad de medir calidad.',
      },
    },
    {
      p: '¿Qué tipo de métrica conviene preferir?',
      opciones: [
        'La determinista más fuerte que se pueda construir',
        'LLM-as-judge, que es lo más moderno',
        'Evaluación humana, que es el patrón oro',
        'ROUGE y BLEU, que son estándares',
      ],
      correcta: 0,
      porQue: 'Si la tarea es extraer un número, la métrica es si el número coincide. Barata, rápida y sin ruido. Convertir una tarea abierta en una verificable es la mejor decisión de diseño en este tema.',
      porQueNo: {
        1: 'Es caro, lento y ruidoso. Se reserva para lo genuinamente abierto, como la calidad de un resumen.',
        2: 'Es el patrón oro pero no escala: se usa para calibrar las otras métricas, no para medir todos los días.',
        3: 'Miden solapamiento de palabras y penalizan decir lo mismo con otras palabras. Muy pobres para lenguaje natural.',
      },
    },
    {
      p: '¿Qué proporción del conjunto de evaluación deberían ser preguntas SIN respuesta en el corpus?',
      opciones: [
        'Alrededor del 15%: miden si el sistema sabe abstenerse',
        'Ninguna: solo se evalúan preguntas que el sistema debe poder responder',
        'La mitad, para forzar la abstención',
        'Solo si el corpus es pequeño',
      ],
      correcta: 0,
      porQue: 'Sin ellas medís la mitad del sistema. Un modelo que responde bien el 95% de lo que sabe pero inventa el 100% de lo que no sabe saca 95% en un conjunto sin esta franja, y es peligroso en producción.',
      porQueNo: {
        1: 'Eso deja sin medir el comportamiento más riesgoso: qué hace cuando no sabe.',
        2: 'Desbalancea el conjunto y deja de representar el uso real.',
        3: 'El tamaño del corpus no cambia la necesidad de medir la abstención.',
      },
    },
    {
      p: '¿Qué es el sesgo de benevolencia en LLM-as-judge?',
      opciones: [
        'El juez tiende a aprobar: casi todo le parece un 4 sobre 5',
        'El juez prefiere las respuestas más largas',
        'El juez prefiere la primera opción que ve',
        'El juez prefiere textos de su propia familia de modelos',
      ],
      correcta: 0,
      porQue: 'Es el más peligroso porque produce números que parecen mediciones y no lo son. Se corrige con una rúbrica explícita que defina cada nivel con ejemplos concretos del dominio.',
      porQueNo: {
        1: 'Ese es el sesgo de verbosidad.',
        2: 'Ese es el sesgo de posición.',
        3: 'Ese es el sesgo de autoafinidad.',
      },
    },
    {
      p: '¿Cómo sabés si podés confiar en tu LLM-as-judge?',
      opciones: [
        'Calibrándolo: puntuás 30 casos a mano y medís el acuerdo con el juez',
        'Usando el modelo más grande disponible como juez',
        'Pidiéndole que explique su puntaje',
        'Corriéndolo varias veces y promediando',
      ],
      correcta: 0,
      porQue: 'Sin calibración no sabés si el juez mide lo que creés: puede estar puntuando fluidez en vez de exactitud. Es media hora de trabajo y define si tenés una métrica o una ilusión de métrica.',
      porQueNo: {
        1: 'Un modelo grande sin rúbrica ni calibración tiene los mismos sesgos.',
        2: 'La explicación mejora la calidad del juicio pero no prueba que coincida con el criterio humano.',
        3: 'Reduce la varianza pero no corrige un sesgo sistemático.',
      },
    },
    {
      p: '¿Qué mide faithfulness?',
      opciones: [
        'Qué proporción de las afirmaciones de la respuesta está respaldada por el contexto recuperado',
        'Si el fragmento correcto fue recuperado',
        'Si la respuesta contesta lo que se preguntó',
        'Cuánto se parece la respuesta a la respuesta ideal',
      ],
      correcta: 0,
      porQue: 'Mide la etapa de generación: detecta que el modelo agregó cosas de su conocimiento propio en lugar de limitarse al contexto que se le pasó.',
      porQueNo: {
        1: 'Eso es context recall, que mide el retrieval.',
        2: 'Eso es answer relevance.',
        3: 'Eso sería una métrica basada en referencia, como ROUGE.',
      },
    },
    {
      p: 'Tu context recall es 0,60 y tu faithfulness es 0,95. ¿Dónde está el problema?',
      opciones: [
        'En el retrieval: el fragmento correcto no se está recuperando',
        'En el prompt de generación',
        'En el modelo, que es demasiado chico',
        'No hay problema: 0,95 es un buen número',
      ],
      correcta: 0,
      porQue: 'Faithfulness alto significa que el modelo usa bien lo que recibe. Recall bajo significa que muchas veces no recibe lo correcto. El sistema responde fielmente sobre el contexto equivocado.',
      porQueNo: {
        1: 'El faithfulness alto indica que el prompt está funcionando: el modelo se atiene al contexto.',
        2: 'Un modelo más grande no puede usar información que nunca recibió.',
        3: 'Con recall de 0,60, el 40% de las preguntas no tiene forma de responderse bien.',
      },
    },
    {
      p: '¿Por qué el campo de justificación va ANTES del puntaje en el esquema del juez?',
      opciones: [
        'Los campos se generan en orden: así razona antes de concluir en vez de racionalizar después',
        'Para que sea más fácil de leer',
        'Porque el puntaje es opcional',
        'Es indistinto, es solo una convención',
      ],
      correcta: 0,
      porQue: 'Cada campo se condiciona a los anteriores. Con el puntaje primero, el modelo decide y después inventa una justificación. Con la justificación primero, fundamenta y después concluye.',
      porQueNo: {
        1: 'La legibilidad es un efecto secundario, no la razón.',
        2: 'El puntaje es el campo principal del juez.',
        3: 'Cambia la calidad del juicio de forma medible, por cómo funciona la generación autorregresiva.',
      },
    },
    {
      p: '¿Qué métrica revela que un sistema "empezó a inventar"?',
      opciones: [
        'Una caída brusca en la tasa de abstención',
        'Un aumento en la latencia',
        'Un aumento en el costo por consulta',
        'Una caída en el número de consultas',
      ],
      correcta: 0,
      porQue: 'Si el sistema deja de admitir que no sabe, está completando huecos. Es la métrica más informativa y la que menos gente mide, y encima la exactitud puede subir mientras eso ocurre.',
      porQueNo: {
        1: 'Indica un problema de rendimiento, no de veracidad.',
        2: 'Suele indicar más contexto o un modelo distinto, no invención.',
        3: 'Es una métrica de producto, no de calidad de las respuestas.',
      },
    },
    {
      p: 'Tu eval subió de 0,82 a 0,85 con 50 casos. ¿Qué hacés antes de dar el cambio por bueno?',
      opciones: [
        'Correr varias veces y revisar qué casos concretos cambiaron de resultado',
        'Desplegarlo: la métrica mejoró',
        'Agregar más casos al conjunto',
        'Cambiar a un modelo más grande',
      ],
      correcta: 0,
      porQue: 'Con 50 casos, tres puntos son un caso y medio: puede ser ruido, porque los LLM no son deterministas. Y un delta positivo puede esconder diez casos arreglados y ocho rotos, que pueden ser los más frecuentes.',
      porQueNo: {
        1: 'Tres puntos con 50 casos están dentro del rango de variación aleatoria.',
        2: 'Buena idea a futuro, pero no resuelve si este cambio concreto sirvió.',
        3: 'No tiene relación con validar si el cambio actual fue una mejora.',
      },
    },
    {
      p: '¿Por qué conviene reservar un subconjunto "ciego"?',
      opciones: [
        'Para evitar sobreajustar el prompt a los casos que mirás durante el desarrollo',
        'Para reducir el costo de los evals',
        'Para acelerar la ejecución en CI',
        'Porque algunos casos son confidenciales',
      ],
      correcta: 0,
      porQue: 'Si ajustás el prompt mirando los mismos casos una y otra vez, optimizás para ellos: el número sube y el sistema real no mejora. Es el mismo problema que entrenar y evaluar sobre el mismo conjunto.',
      porQueNo: {
        1: 'Es un conjunto adicional: no reduce el costo, lo aumenta un poco.',
        2: 'Corre además del resto, no en lugar de él.',
        3: 'La confidencialidad no tiene que ver con la validez estadística.',
      },
    },
    {
      p: '¿Cuál es el argumento más fuerte para fijar la versión exacta del modelo?',
      opciones: [
        'El proveedor puede actualizar y cambiar el comportamiento sin que hayas hecho ningún deploy',
        'Las versiones nuevas son más caras',
        'Los alias no funcionan en producción',
        'Las versiones fijas son más rápidas',
      ],
      correcta: 0,
      porQue: 'Con un alias móvil tu sistema cambia un martes cualquiera, con prompts afinados para otra versión, y sin ningún commit que lo explique. Con versión fija, la migración es una decisión explícita con su comparación de evals.',
      porQueNo: {
        1: 'El precio no depende de si usás alias o versión exacta.',
        2: 'Funcionan perfectamente: el problema es que cambian sin aviso.',
        3: 'El rendimiento es el mismo.',
      },
    },
    {
      p: 'Si tuvieras que construir una sola cosa de evaluación primero, ¿cuál sería?',
      opciones: [
        'La traza por consulta: sin datos no podés medir ni diagnosticar nada',
        'Un LLM-as-judge calibrado',
        'Un panel de métricas visual',
        'Un conjunto de 500 casos sintéticos',
      ],
      correcta: 0,
      porQue: 'La traza —consulta, candidatos, puntajes, fragmentos enviados, citas, latencia, costo— es lo que hace posible todo lo demás. Sin ella, cada diagnóstico lleva horas en vez de minutos.',
      porQueNo: {
        1: 'Es lo más vistoso y lo último que conviene construir. Muchas veces ni hace falta.',
        2: 'Un panel sin datos abajo no muestra nada.',
        3: 'Los casos sintéticos sin revisar son demasiado limpios y poco representativos.',
      },
    },
    {
      p: 'Un promedio global de 0,78 en tu eval. ¿Qué te podés estar perdiendo?',
      opciones: [
        'Que una categoría entera esté en 0,41 mientras otras están en 0,94',
        'Nada: el promedio resume bien el sistema',
        'Que el conjunto sea demasiado grande',
        'Que el modelo sea demasiado caro',
      ],
      correcta: 0,
      porQue: 'Segmentar por categoría es lo que convierte "el sistema anda bien" en "el sistema anda bien salvo en facturación", que es accionable. El promedio global esconde categorías enteras rotas.',
      porQueNo: {
        1: 'Precisamente esconde la distribución, que es donde está la información útil.',
        2: 'Un conjunto grande mejora la confiabilidad; no es un problema.',
        3: 'El costo es una métrica separada, que también conviene mirar pero no es lo que esconde el promedio.',
      },
    },
  ],
});
