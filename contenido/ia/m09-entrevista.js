/* ==========================================================================
   IA · Módulo 09 — Modo entrevista
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ia',
  id: 'm09',
  titulo: 'Modo entrevista',
  fuentes: ['anthropic', 'mcp', 'ragas', 'owasp-llm'],

  intro:
    '<p>El módulo de cierre. Acá no hay conceptos nuevos: hay <b>práctica de decir en voz alta</b> lo que ya ' +
    'estudiaste, que es una habilidad distinta de entenderlo.</p>' +
    '<p>Vas a ver las preguntas que caen siempre, cómo diseñar un sistema con IA en un pizarrón, cómo contar ' +
    'tus propios proyectos sin sonar a tutorial, y qué preguntar vos para detectar si el equipo sabe lo que hace.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Las preguntas que caen siempre',
      minutos: 10,

      simple: `
<div class="analogia"><strong>Cómo usar esta lección:</strong> leé cada pregunta, <b>contestala en voz alta
antes de mirar la respuesta</b>, y después compará. Si al leer la respuesta pensás "ah, claro", todavía no la
sabías: la reconociste.</div>

<h4>El patrón de una buena respuesta</h4>
<p>Casi todas las respuestas buenas tienen la misma forma, y conviene practicarla:</p>
<ol>
<li><b>Una frase que responde.</b> Directo, sin rodeos.</li>
<li><b>El porqué</b>, en una o dos oraciones.</li>
<li><b>El matiz</b> — el caso donde no aplica, o el trade-off. <b>Acá es donde se nota la experiencia.</b></li>
</ol>

<p>Ejemplo de la diferencia:</p>
<table>
<tr><th>❌ Respuesta de manual</th><th>✅ Respuesta con criterio</th></tr>
<tr><td>"RAG es recuperar información y agregarla al prompt."</td><td>"RAG es recuperar y agregar al prompt. Se usa para conocimiento propio o actualizado, y su gran ventaja es que podés citar la fuente. <b>Aunque su calidad está limitada por el retrieval</b>: si el fragmento correcto no se recupera, ningún prompt lo salva."</td></tr>
</table>

<h4>Las diez que más caen</h4>
<ol>
<li>¿Qué es un LLM y cómo funciona?</li>
<li>¿Qué es RAG y cuándo lo usarías?</li>
<li>¿RAG o fine-tuning?</li>
<li>¿Qué es un embedding?</li>
<li>¿Qué es un agente y cuándo NO usarías uno?</li>
<li>¿Por qué alucinan y qué hacés al respecto?</li>
<li>¿Cómo evaluás si tu sistema funciona?</li>
<li>¿Cómo controlás los costos?</li>
<li>¿Qué es prompt injection?</li>
<li>Contame un sistema con IA que hayas construido.</li>
</ol>

<div class="aviso"><strong>Las tres que separan:</strong> la <b>7</b> (evals), la <b>8</b> (costos) y el
"cuándo NO" de la <b>5</b>. Cualquiera que leyó un blog contesta las otras siete. Esas tres solo las contesta
bien quien tuvo un sistema con usuarios reales — <b>y por eso son las que hay que practicar más</b>.</div>
`,

      tecnico: `
<h4>Respuestas modelo, de 30 a 60 segundos</h4>

<p><b>1 · ¿Qué es un LLM?</b><br>
Un modelo que predice el token siguiente dada la secuencia previa, y repite. Es un transformer entrenado sobre
enormes cantidades de texto de forma auto-supervisada. Todo lo que parece razonamiento emerge de ejecutar esa
operación. <i>Matiz:</i> eso explica sus fallas — por qué alucina, por qué falla en aritmética larga, por qué
nunca dice "no sé" por su cuenta.</p>

<p><b>2 · ¿Qué es RAG?</b><br>
Buscar los fragmentos relevantes en un corpus propio y agregarlos al prompt antes de generar. Resuelve que el
modelo solo sabe lo que estaba en su entrenamiento. Dos ventajas decisivas: podés <b>citar la fuente</b> y
podés <b>aislar por cliente</b> con un filtro. <i>Matiz:</i> su calidad está limitada por el retrieval, no por
el modelo.</p>

<p><b>3 · ¿RAG o fine-tuning?</b><br>
RAG para <b>conocimiento</b>, fine-tuning para <b>comportamiento</b>. Si el modelo no sabe algo, es RAG,
porque el conocimiento cambia y hay que poder citar la fuente. Si el modelo sabe pero no responde en el
formato que necesito y ya agoté el prompting, ahí fine-tuning. <i>Matiz:</i> se combinan.</p>

<p><b>4 · ¿Qué es un embedding?</b><br>
La representación de un texto como vector, donde la cercanía refleja similitud de significado. Permite
encontrar "cancelar suscripción" buscando "dar de baja el plan". <i>Matiz:</i> los vectores de dos modelos
distintos no se pueden comparar; cambiar de modelo obliga a reindexar todo.</p>

<p><b>5 · ¿Qué es un agente y cuándo NO usarías uno?</b><br>
Un sistema donde el modelo decide qué pasos dar, en un bucle. <b>No lo usaría siempre que pueda dibujar el
diagrama de flujo de antemano</b>: una cadena fija es más rápida, más barata, predecible y depurable.
El agente se justifica cuando los pasos dependen de lo que se descubre.</p>

<p><b>6 · ¿Por qué alucinan?</b><br>
Porque el objetivo es generar la continuación más probable, no decir la verdad. Siempre existe un token más
probable, incluso cuando la respuesta correcta no está. <i>Matiz:</i> no se elimina, se gestiona — contexto
correcto, citas verificables por código, autorización explícita para abstenerse.</p>

<p><b>7 · ¿Cómo evaluás?</b><br>
Con un conjunto de 30-50 casos reales con respuesta esperada. Priorizo métricas <b>deterministas</b>; el
LLM-as-judge lo reservo para lo genuinamente abierto, y calibrado contra puntuación humana. Los evals corren en
CI y en producción por muestreo. <i>Matiz:</i> incluyo un 15% de preguntas sin respuesta en el corpus, para
medir la abstención.</p>

<p><b>8 · ¿Cómo controlás los costos?</b><br>
Registro tokens y dólares por request, con cliente y funcionalidad. Tope de gasto verificado <b>antes</b> de
llamar, con aviso al 80%. Optimizaciones por impacto: prompt caching, resumir el historial, bajar el top_k y
usar el modelo más chico que pase las evals.</p>

<p><b>9 · ¿Qué es prompt injection?</b><br>
Instrucciones introducidas en contenido que el modelo lee. La variante peligrosa es la <b>indirecta</b>.
<i>Matiz importante:</i> no tiene solución completa, porque el modelo no puede distinguir instrucciones de
datos. La defensa real es acotar el daño: el modelo pide y el código decide, con permisos del usuario,
confirmación humana y RLS.</p>

<div class="dato"><strong>Sobre la número 10:</strong> contá tu proyecto <b>recorriendo un request de punta a
punta</b>, no listando tecnologías. "El usuario pide X, la Server Action valida sesión y resuelve el tenant,
chequea presupuesto, recupera con búsqueda híbrida filtrando por tenant, arma el prompt con tope de tokens,
llama en streaming, valida la salida y registra costo." Mencionar tenant, presupuesto y registro es lo que
demuestra producción. La lección 3 desarrolla esto.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA FORMA DE UNA BUENA RESPUESTA</text>

  <rect x="24" y="36" width="200" height="70" rx="10" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.4"/>
  <text x="124" y="60" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">1 · LA RESPUESTA</text>
  <text x="124" y="80" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">una frase, directo</text>
  <text x="124" y="97" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10">sin rodeos ni preámbulo</text>

  <rect x="240" y="36" width="200" height="70" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="340" y="60" text-anchor="middle" fill="#22d3ee" font-size="12" font-weight="700">2 · EL PORQUÉ</text>
  <text x="340" y="80" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">una o dos oraciones</text>
  <text x="340" y="97" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10">el mecanismo o la razón</text>

  <rect x="456" y="36" width="200" height="70" rx="10" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.8"/>
  <text x="556" y="60" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">3 · EL MATIZ</text>
  <text x="556" y="80" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">dónde NO aplica</text>
  <text x="556" y="97" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">acá se nota la experiencia</text>

  <line x1="24" y1="128" x2="656" y2="128" stroke="currentColor" opacity=".18"/>

  <text x="24" y="152" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS DIEZ QUE MÁS CAEN — y las tres que separan</text>

  <rect x="24" y="164" width="632" height="22" rx="6" fill="currentColor" fill-opacity=".05"/>
  <text x="40" y="179" fill="currentColor" opacity=".7" font-size="10.5">1 · ¿Qué es un LLM y cómo funciona?</text>

  <rect x="24" y="190" width="632" height="22" rx="6" fill="currentColor" fill-opacity=".05"/>
  <text x="40" y="205" fill="currentColor" opacity=".7" font-size="10.5">2 · ¿Qué es RAG?      3 · ¿RAG o fine-tuning?      4 · ¿Qué es un embedding?</text>

  <rect x="24" y="216" width="632" height="26" rx="6" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="40" y="234" fill="#fbbf24" font-size="11" font-weight="700">5 · ¿Qué es un agente y CUÁNDO NO usarías uno?</text>

  <rect x="24" y="246" width="632" height="22" rx="6" fill="currentColor" fill-opacity=".05"/>
  <text x="40" y="261" fill="currentColor" opacity=".7" font-size="10.5">6 · ¿Por qué alucinan?      9 · ¿Qué es prompt injection?</text>

  <rect x="24" y="272" width="632" height="26" rx="6" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="40" y="290" fill="#fbbf24" font-size="11" font-weight="700">7 · ¿Cómo EVALUÁS si tu sistema funciona?</text>

  <rect x="24" y="302" width="632" height="26" rx="6" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="40" y="320" fill="#fbbf24" font-size="11" font-weight="700">8 · ¿Cómo CONTROLÁS LOS COSTOS?</text>

  <rect x="24" y="332" width="632" height="22" rx="6" fill="currentColor" fill-opacity=".05"/>
  <text x="40" y="347" fill="currentColor" opacity=".7" font-size="10.5">10 · Contame un sistema con IA que hayas construido</text>

  <rect x="24" y="364" width="632" height="26" rx="8" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.3" stroke-dasharray="5 4"/>
  <text x="340" y="382" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">
    Las tres amarillas solo las contesta bien quien tuvo usuarios reales. Practicá esas.</text>
</svg>`,
        pie: 'Cualquiera contesta las siete blancas. Las tres amarillas son las que deciden.',
      },

      entrevista: [
        { p: 'Diferencia entre embeddings, RAG y fine-tuning, en 30 segundos.',
          r: 'Son tres cosas de niveles distintos. Un <b>embedding</b> es una técnica: representar texto como vector para poder buscar por significado. ' +
             '<b>RAG</b> es un patrón de arquitectura que usa esa técnica para traer información al prompt. Y <b>fine-tuning</b> es un proceso de ' +
             'entrenamiento que modifica los pesos del modelo. La confusión típica es ponerlos al mismo nivel: los embeddings son un <i>componente</i> ' +
             'de RAG, y RAG y fine-tuning resuelven problemas distintos —conocimiento contra comportamiento— y se combinan.' },

        { p: '¿Cuál es tu opinión sobre los frameworks de IA?',
          r: 'Que aceleran el prototipo y pueden estorbar en producción. Para cadenas cortas prefiero el SDK directo con mi propia orquestación, ' +
             'porque depurar es leer mi código y no bucear en capas ajenas. El framework se justifica por necesidades concretas, sobre todo ' +
             '<b>persistencia</b>: reanudar un flujo largo o pausar para aprobación humana es genuinamente difícil de escribir bien. ' +
             'Y agregaría que si el problema es durabilidad y no orquestación de LLMs, un motor de flujos como Inngest suele ser la respuesta más simple.' },

        { p: 'Te preguntan algo que no sabés. ¿Qué hacés?',
          r: 'Lo digo, y después razono en voz alta desde lo que sí sé. Algo como: "no trabajé con eso directamente, pero por lo que entiendo resuelve ' +
             'X, y lo compararía con Y por Z". <b>Un entrevistador con experiencia valora mucho más eso que una respuesta inventada</b>, ' +
             'porque lo que está evaluando es cómo pensás, no cuántos términos memorizaste. Y además muestra la misma honestidad que uno espera ' +
             'de alguien que va a reportar que algo no funciona.' },

        { p: '¿Cómo te mantenés actualizado en un campo que cambia tan rápido?',
          r: 'Distingo lo que cambia de lo que no. Los <b>modelos y las herramientas</b> cambian cada pocos meses, y eso lo sigo por fuentes primarias: ' +
             'documentación de los proveedores y papers concretos cuando hacen falta. Los <b>fundamentos</b> —cómo funciona un transformer, por qué ' +
             'alucina, cómo se evalúa, cómo se controla el costo— cambian mucho más lento y son lo que realmente permite evaluar cada herramienta ' +
             'nueva. Prefiero invertir ahí y aprender la herramienta cuando la necesito, que es una tarde.' },
      ],

      practica: `
<h4>Rutina de práctica</h4>
<p>Esto se entrena como cualquier otra cosa. Quince minutos, dos veces por semana:</p>
<ol>
<li>Elegí tres preguntas de la lista.</li>
<li><b>Contestá en voz alta</b>, cronometrando. Objetivo: 30-60 segundos.</li>
<li>Grabate una vez y escuchate. Es incómodo y es lo que más rápido mejora.</li>
<li>Chequeá que tu respuesta tenga <b>las tres partes</b>: respuesta, porqué, matiz.</li>
</ol>

<div class="aviso"><strong>El error más común al practicar:</strong> leer la respuesta y pensar "sí, eso sé".
Reconocer no es recordar. Si no podés decirla sin leer, en la entrevista tampoco vas a poder — con nervios y
alguien mirándote.</div>

<h4>Autoevaluación</h4>
<p>Marcá solo lo que podés explicar <b>en voz alta y sin leer</b>:</p>
<table>
<tr><th>Concepto</th><th>Lo puedo explicar</th></tr>
<tr><td>Qué hace un LLM, en una frase</td><td>☐</td></tr>
<tr><td>Por qué la salida cuesta más que la entrada</td><td>☐</td></tr>
<tr><td>Qué es un token y por qué importa</td><td>☐</td></tr>
<tr><td>Qué incluye la ventana de contexto</td><td>☐</td></tr>
<tr><td>Qué es un embedding y por qué no se comparan entre modelos</td><td>☐</td></tr>
<tr><td>El pipeline completo de RAG</td><td>☐</td></tr>
<tr><td>Por qué hacen falta dos etapas de búsqueda</td><td>☐</td></tr>
<tr><td>Qué es chunking y por qué importa tanto</td><td>☐</td></tr>
<tr><td>RAG vs fine-tuning, con el matiz</td><td>☐</td></tr>
<tr><td>Cómo diagnosticás un RAG que falla</td><td>☐</td></tr>
<tr><td>Qué es un eval y por qué hace falta</td><td>☐</td></tr>
<tr><td>Faithfulness y context recall</td><td>☐</td></tr>
<tr><td>Cómo funciona el tool calling</td><td>☐</td></tr>
<tr><td>Qué es un agente y cuándo NO usarlo</td><td>☐</td></tr>
<tr><td>Qué límites lleva un agente</td><td>☐</td></tr>
<tr><td>Qué es MCP</td><td>☐</td></tr>
<tr><td>Por qué el prompt injection no tiene solución completa</td><td>☐</td></tr>
<tr><td>Cómo aislás datos entre clientes</td><td>☐</td></tr>
<tr><td>Cómo controlás los costos</td><td>☐</td></tr>
<tr><td>Qué rompe el prompt caching</td><td>☐</td></tr>
</table>
<p>Veinte tildes es estar listo. Menos de quince, volvé a los módulos correspondientes — el mapa está en el
temario del track.</p>
`,

      errores: [
        { mito: 'Si me sé las definiciones, apruebo la entrevista.',
          realidad: 'Las definiciones las tiene cualquiera que leyó un blog. Lo que se evalúa es el <b>criterio</b>: cuándo NO usar un agente, ' +
                    'cómo medís si funciona, cómo controlás el costo. Son las preguntas que solo puede contestar bien quien tuvo usuarios reales.' },

        { mito: 'Cuanto más técnico suene, mejor.',
          realidad: 'Es al revés: <b>explicar algo complejo en palabras simples es la señal más fuerte de que lo entendés</b>. ' +
                    'Quien se esconde detrás del vocabulario casi siempre está tapando un hueco, y una repregunta lo expone enseguida.' },

        { mito: 'Si no sé algo, mejor improviso.',
          realidad: 'Un entrevistador con experiencia detecta una respuesta inventada casi siempre, y eso cuesta mucho más caro que un ' +
                    '"no trabajé con eso, pero lo compararía con X por Y". <b>Razonar en voz alta desde lo que sí sabés vale más que una ' +
                    'respuesta memorizada.</b>' },

        { mito: 'Leo las respuestas y con eso practico.',
          realidad: 'Reconocer no es recordar. Si no podés decirlo <b>en voz alta y sin leer</b>, en la entrevista tampoco vas a poder — ' +
                    'con nervios y alguien mirándote. Grabarse una vez es incómodo y es lo que más rápido mejora.' },
      ],

      glosario: [
        { t: 'Respuesta en tres partes', d: 'Respuesta directa, el porqué, y el matiz o trade-off. La forma que más funciona.' },
        { t: 'Matiz', d: 'El caso donde algo no aplica o el costo que tiene. Es lo que distingue experiencia de lectura.' },
        { t: 'Reconocer vs recordar', d: 'Leer y entender no es lo mismo que poder decirlo sin ayuda. Solo lo segundo sirve en una entrevista.' },
        { t: 'Pensar en voz alta', d: 'Verbalizar el razonamiento. Es lo que el entrevistador realmente quiere ver.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Diseñar un sistema en el pizarrón',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> en una entrevista de diseño no evalúan si llegás a
la solución perfecta. Evalúan <b>cómo pensás</b>: qué preguntás, qué priorizás y qué trade-offs reconocés.</div>

<h4>El método, en cinco pasos</h4>

<p><b>1 · Clarificar (2-3 minutos).</b> No empieces a dibujar. Preguntá:</p>
<ul>
<li>¿Cuántos usuarios y cuántas consultas por día?</li>
<li>¿Cuántos documentos y en qué formato? ¿Cambian seguido?</li>
<li>¿Es multi-tenant? ¿Hay datos sensibles?</li>
<li>¿Qué latencia se tolera? ¿Hay presupuesto por consulta?</li>
<li>¿Qué pasa si el sistema se equivoca? ¿Cuánto cuesta un error?</li>
</ul>
<p><b>Esta parte suma más de lo que parece.</b> Un candidato que dibuja sin preguntar ya perdió puntos.</p>

<p><b>2 · Recorrer el flujo feliz.</b> De la consulta del usuario a la respuesta, sin optimizaciones todavía.</p>

<p><b>3 · Marcar las decisiones y sus trade-offs.</b> "Acá usaría pgvector porque ya usan Postgres; a partir de
varios millones de vectores evaluaría una base dedicada."</p>

<p><b>4 · Los no funcionales.</b> Costo, latencia, seguridad, multi-tenant, observabilidad. <b>Acá se define la
entrevista.</b></p>

<p><b>5 · Cómo sabés que funciona.</b> Evals y métricas. Si terminás con esto, dejás una impresión muy fuerte.</p>

<div class="aviso"><strong>El error más común:</strong> saltar directo a dibujar cajas. Los primeros dos minutos
de preguntas valen más que diez minutos de arquitectura, porque muestran que entendés que <b>la solución
correcta depende del contexto</b>.</div>
`,

      tecnico: `
<h4>Caso típico: "diseñá un asistente sobre la documentación interna"</h4>

<p><b>Preguntas primero</b></p>
<pre><code>· ¿Cuántos documentos y de qué formato?     → define la ingestión
· ¿Con qué frecuencia cambian?              → define reindexado incremental o total
· ¿Cuántas consultas por día?               → define costo e infraestructura
· ¿Multi-tenant o una sola organización?    → define todo el aislamiento
· ¿Hay permisos por documento?              → el caso más difícil, ver abajo
· ¿Se tolera "no sé" o hay que responder?   → define la política de abstención
· ¿Qué pasa si se equivoca?                 → define cuánta verificación hace falta</code></pre>

<p><b>El diagrama</b></p>
<pre><code>INGESTIÓN (cola, offline)
  documento → extraer → chunkear (con contexto) → embeddings → índice
                                                    ↓
CONSULTA (en vivo)
  pregunta → [reescribir si hay historial]
           → búsqueda híbrida (vector + BM25, filtrada por tenant y permisos)
           → re-ranking → top 5
           → prompt (reglas + fragmentos con ID + pregunta)
           → generación en streaming
           → validar citas → responder con fuentes

TRANSVERSAL
  registro de tokens/costo · trazas · límites por tenant · evals</code></pre>

<div class="dato"><strong>El punto que más impresiona en este caso concreto:</strong> los <b>permisos por
documento</b>. Si distintos usuarios ven distintos documentos, el filtro tiene que estar <b>dentro de la
consulta vectorial</b>, no después. Y hay que mencionar el detalle técnico: con índices aproximados, filtrar
puede devolver menos resultados de los pedidos, porque el índice explora un vecindario global y después
descarta. <b>Eso demuestra que lo construiste, no que lo leíste.</b></div>

<h4>Los no funcionales, con números</h4>
<table>
<tr><th>Dimensión</th><th>Qué decir</th></tr>
<tr><td><b>Costo</b></td><td>"Registro tokens y USD por request. Prompt caching sobre system y tools. Con este volumen, estimaría X por mes."</td></tr>
<tr><td><b>Latencia</b></td><td>"Streaming, TTFT bajo un segundo. Todo lo previo a la generación suma menos de 500 ms."</td></tr>
<tr><td><b>Seguridad</b></td><td>"RLS para el aislamiento. Contenido externo delimitado. Validación de salida."</td></tr>
<tr><td><b>Escala</b></td><td>"pgvector hasta el orden del millón de vectores; después evaluaría una base dedicada."</td></tr>
<tr><td><b>Calidad</b></td><td>"30-50 casos con respuesta esperada. Mido context recall primero, después faithfulness."</td></tr>
<tr><td><b>Fallos</b></td><td>"Degradación: reintentos, modelo alternativo, y si nada anda, muestro los fragmentos sin resumen."</td></tr>
</table>

<h4>Frases que funcionan</h4>
<ul>
<li>"Empezaría con lo más simple que funcione y mediría antes de optimizar."</li>
<li>"Esto depende de X — ¿sabés cuál es el caso?"</li>
<li>"El trade-off acá es entre A y B; elegiría A porque en este contexto importa más C."</li>
<li>"No lo haría así, porque en producción me pasó que…"</li>
<li>"Antes de eso mediría, porque puede que ni sea el cuello de botella."</li>
</ul>
<p>Todas comunican lo mismo: que tomás decisiones con criterio y no por defecto.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="p1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL MÉTODO — los primeros dos minutos valen más que diez de dibujo</text>

  <rect x="24" y="36" width="122" height="72" rx="9" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.7"/>
  <text x="85" y="58" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">1 · CLARIFICAR</text>
  <text x="85" y="77" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">volumen · tenants</text>
  <text x="85" y="91" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">latencia · costo de error</text>
  <text x="85" y="104" text-anchor="middle" fill="#fbbf24" font-size="9" font-weight="700">NO dibujes todavía</text>

  <line x1="150" y1="72" x2="166" y2="72" stroke="currentColor" stroke-width="1.3" marker-end="url(#p1)"/>

  <rect x="170" y="36" width="122" height="72" rx="9" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="231" y="58" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">2 · FLUJO FELIZ</text>
  <text x="231" y="77" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">de la consulta</text>
  <text x="231" y="91" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">a la respuesta</text>
  <text x="231" y="104" text-anchor="middle" fill="currentColor" opacity=".45" font-size="9">sin optimizar aún</text>

  <line x1="296" y1="72" x2="312" y2="72" stroke="currentColor" stroke-width="1.3" marker-end="url(#p1)"/>

  <rect x="316" y="36" width="122" height="72" rx="9" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="377" y="58" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">3 · TRADE-OFFS</text>
  <text x="377" y="77" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">“elijo A porque…</text>
  <text x="377" y="91" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">a partir de X iría a B”</text>

  <line x1="442" y1="72" x2="458" y2="72" stroke="currentColor" stroke-width="1.3" marker-end="url(#p1)"/>

  <rect x="462" y="36" width="98" height="72" rx="9" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.7"/>
  <text x="511" y="58" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">4 · NO</text>
  <text x="511" y="72" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">FUNCIONALES</text>
  <text x="511" y="90" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">costo · seguridad</text>
  <text x="511" y="103" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">acá se define</text>

  <line x1="564" y1="72" x2="576" y2="72" stroke="currentColor" stroke-width="1.3" marker-end="url(#p1)"/>

  <rect x="580" y="36" width="76" height="72" rx="9" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.6"/>
  <text x="618" y="62" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">5 · EVALS</text>
  <text x="618" y="82" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">“cómo sé</text>
  <text x="618" y="94" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">que funciona”</text>

  <line x1="24" y1="130" x2="656" y2="130" stroke="currentColor" opacity=".18"/>

  <text x="24" y="154" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL DIAGRAMA QUE SIEMPRE FUNCIONA</text>

  <rect x="24" y="166" width="632" height="52" rx="9" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="44" y="186" fill="#22d3ee" font-size="11" font-weight="700">INGESTIÓN  (cola, offline)</text>
  <text x="44" y="206" fill="currentColor" opacity=".7" font-size="10.5" font-family="monospace">documento → extraer → chunkear (con contexto) → embeddings → índice</text>

  <rect x="24" y="226" width="632" height="86" rx="9" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="44" y="246" fill="#7c5cff" font-size="11" font-weight="700">CONSULTA  (en vivo)</text>
  <text x="44" y="266" fill="currentColor" opacity=".7" font-size="10.5" font-family="monospace">pregunta → [reescribir] → búsqueda híbrida (filtrada por tenant Y permisos)</text>
  <text x="44" y="284" fill="currentColor" opacity=".7" font-size="10.5" font-family="monospace">  → re-ranking → top 5 → prompt → streaming → validar citas → responder</text>
  <text x="44" y="304" fill="#7c5cff" font-size="10" font-weight="700">el filtro va DENTRO de la consulta vectorial, nunca después</text>

  <rect x="24" y="320" width="632" height="34" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="44" y="341" fill="#34d399" font-size="11" font-weight="700">TRANSVERSAL:</text>
  <text x="160" y="341" fill="currentColor" opacity=".7" font-size="10.5">tokens y costo por request · trazas · límites por tenant · evals</text>

  <text x="340" y="378" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">
    Terminar con “y así sé que funciona” deja una impresión muy fuerte.</text>
</svg>`,
        pie: 'No evalúan si llegás a la solución perfecta. Evalúan qué preguntás y qué trade-offs reconocés.',
      },

      entrevista: [
        { p: 'Diseñá un asistente que responda sobre la documentación interna de la empresa.',
          r: 'Antes de dibujar preguntaría: cuántos documentos y en qué formato, con qué frecuencia cambian, cuántas consultas por día, ' +
             'si es multi-tenant, <b>si hay permisos por documento</b>, y qué pasa si el sistema se equivoca. Con eso armaría dos mitades: ' +
             'una <b>ingestión</b> en cola —extraer, chunkear con contexto de ubicación, vectorizar, indexar— y una <b>consulta</b> en vivo — ' +
             'reescribir si hay historial, búsqueda híbrida filtrada por tenant y permisos, re-ranking, prompt con citas obligatorias, streaming, ' +
             'y validación de citas. Y encima, lo transversal: registro de costo por request, trazas, límites por tenant y un conjunto de evaluación. ' +
             'El punto que marcaría explícitamente es que <b>el filtro de permisos va dentro de la consulta vectorial</b>, nunca después.' },

        { p: 'El sistema anda bien con 100 documentos pero mal con 50.000. ¿Qué revisás?',
          r: 'Es un problema de escala en el retrieval, así que iría en orden. Primero <b>mediría recall@k</b> contra una búsqueda exhaustiva sobre ' +
             'una muestra: un índice que rendía bien con 100 documentos puede degradarse mucho con 50.000, y el síntoma no es un error sino ' +
             'respuestas peores. Si el recall bajó, subo <code>ef_search</code> y reviso los parámetros del índice. Segundo, con más documentos hay ' +
             'más candidatos parecidos, así que el <b>re-ranking</b> pasa de conveniente a imprescindible. Y tercero, revisaría si el chunking ' +
             'genera fragmentos que se explican solos, porque con poco volumen eso se disimula y con mucho, no.' },

        { p: '¿Cómo estimarías el costo mensual de ese sistema?',
          r: 'Con la cuenta explícita, para que se pueda auditar. Por consulta: tokens de entrada —system prompt, definiciones de herramientas y ' +
             'los fragmentos recuperados— más los de salida, cada uno a su precio. Después multiplico por consultas diarias y por 30. ' +
             'Y aplico las dos correcciones que más mueven el número: <b>prompt caching</b> sobre la parte fija, que baja mucho esa porción, ' +
             'y el <b>historial</b> si es un chat, porque crece de forma cuadrática. Cerraría diciendo que la estimación sirve para dimensionar, ' +
             'pero que el número real sale de la tabla de <i>requests</i> desde la primera semana.' },
      ],

      practica: `
<h4>Tres casos para practicar en voz alta</h4>

<p><b>Caso 1 · Soporte al cliente con IA</b><br>
Pistas de lo que se espera: clasificación de intención primero, RAG para lo documental, herramientas de solo
lectura para datos de cuenta, escalado a humano, y una política clara de abstención. La respuesta fuerte es una
<b>cadena fija con un tramo agéntico acotado</b>, no "un agente".</p>

<p><b>Caso 2 · Extraer datos de 10.000 facturas por día</b><br>
Pistas: procesamiento en lote con cola, modelo chico multimodal, salida estructurada garantizada, ' +
<b>validación de negocio</b> —que el total sea la suma de los ítems—, y revisión humana solo de lo que falla la
validación. Acá el punto clave es que <b>no es un agente</b>: es una cadena fija, y decirlo suma.</p>

<p><b>Caso 3 · Buscador semántico en un e-commerce</b><br>
Pistas: búsqueda <b>híbrida</b> obligatoria —los códigos de producto y las marcas necesitan BM25—, filtros por
stock y precio en SQL, re-ranking, y quizás ni haga falta generación: devolver productos ordenados puede ser
mejor que un texto. La respuesta fuerte incluye <b>"acá tal vez no necesitás un LLM en el camino
crítico"</b>.</p>

<div class="aviso"><strong>Ese último punto es de los que más impresionan:</strong> reconocer que la respuesta
correcta puede ser <b>no usar un LLM</b> demuestra criterio de ingeniería y no entusiasmo por la herramienta.
Es exactamente lo contrario de lo que hace la mayoría en una entrevista.</div>

<h4>Errores que restan puntos</h4>
<table>
<tr><th>Error</th><th>Qué comunica</th></tr>
<tr><td>Dibujar sin preguntar</td><td>Que no entendés que la solución depende del contexto</td></tr>
<tr><td>Proponer un agente para todo</td><td>Falta de criterio sobre costo y previsibilidad</td></tr>
<tr><td>No mencionar costos</td><td>Que nunca tuviste un sistema con usuarios reales</td></tr>
<tr><td>No mencionar cómo medís</td><td>Lo mismo, y es lo que más se nota</td></tr>
<tr><td>Nombrar herramientas sin justificar</td><td>Que seguiste un tutorial</td></tr>
<tr><td>Ignorar el multi-tenant si lo mencionaron</td><td>Riesgo de seguridad no percibido</td></tr>
</table>
`,

      errores: [
        { mito: 'Hay que empezar dibujando la arquitectura.',
          realidad: 'Los primeros dos minutos de <b>preguntas</b> valen más que diez de dibujo. Volumen, multi-tenant, latencia tolerada y costo de ' +
                    'un error cambian por completo la solución correcta. Dibujar sin preguntar comunica que no entendés eso.' },

        { mito: 'Cuantos más componentes proponga, mejor impresión doy.',
          realidad: 'Al revés. Proponer un agente multi-agente para un problema con pasos conocidos muestra <b>falta de criterio</b>. ' +
                    '"Empezaría con lo más simple que funcione y mediría antes de optimizar" es una frase que suma.' },

        { mito: 'Los costos y las métricas son detalles para el final.',
          realidad: 'Son <b>la parte que más distingue</b>. Cualquiera dibuja un pipeline de RAG; mencionar registro de costo por cliente, ' +
                    'límites de gasto y cómo medís la calidad es lo que muestra que trabajaste con usuarios reales.' },

        { mito: 'Siempre hay que proponer una solución con IA.',
          realidad: 'Reconocer que <b>la respuesta correcta puede ser no usar un LLM</b> —o no ponerlo en el camino crítico— es de las cosas que ' +
                    'más impresionan. Demuestra criterio de ingeniería en vez de entusiasmo por la herramienta.' },
      ],

      glosario: [
        { t: 'Entrevista de diseño', d: 'Ejercicio donde se evalúa cómo razonás una arquitectura, no si llegás a una solución exacta.' },
        { t: 'Requisitos no funcionales', d: 'Costo, latencia, seguridad, escala y observabilidad. Donde se define la entrevista.' },
        { t: 'Flujo feliz', d: 'El recorrido sin errores ni optimizaciones. El primer diagrama que conviene dibujar.' },
        { t: 'Trade-off', d: 'Lo que se gana y lo que se pierde con una decisión. Nombrarlo explícitamente suma.' },
        { t: 'Permisos por documento', d: 'Caso donde distintos usuarios ven distintos documentos. El filtro va dentro de la consulta vectorial.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Cómo hablar de tus propios proyectos',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> no cuentes <b>qué usaste</b>. Contá <b>qué
problema resolviste, qué decidiste y qué aprendiste</b>. La lista de tecnologías la tienen todos.</div>

<h4>La estructura que funciona</h4>
<ol>
<li><b>El problema</b>, en lenguaje de negocio. Una oración.</li>
<li><b>Tu decisión clave</b> y por qué. Una o dos.</li>
<li><b>Un detalle técnico concreto</b> que muestre profundidad.</li>
<li><b>Qué salió mal</b> y qué hiciste. <b>Esta es la parte más valiosa.</b></li>
<li><b>El resultado</b>, con un número si lo tenés.</li>
</ol>

<h4>La diferencia, con el mismo proyecto</h4>

<p><b>❌ Versión lista de tecnologías</b><br>
<i>"Hice un chatbot con RAG. Usé Next.js, Supabase con pgvector, la API de Anthropic y LangChain. Funciona
bien."</i></p>

<p><b>✅ Versión con criterio</b><br>
<i>"En un CRM, el equipo comercial perdía tiempo leyendo el historial completo de cada cliente antes de una
llamada. Armé un resumen automático de las interacciones.</i><br>
<i>La decisión clave fue no meter todo el historial en el prompt sino recuperar solo lo relevante, porque con
clientes de dos años el costo se iba de escala.</i><br>
<i>Un detalle: el filtro por tenant va dentro de la consulta vectorial, no filtrando después, porque si no los
datos de otro cliente ya salieron de la base.</i><br>
<i>Lo que salió mal: los primeros resúmenes inventaban detalles. Descubrí que era el retrieval, no el modelo —
el fragmento correcto no se estaba recuperando. Agregué re-ranking y contexto de ubicación en los chunks.</i><br>
<i>Terminó en unos centavos por resumen y ahorra varios minutos por llamada."</i></p>

<div class="aviso"><strong>El punto 4 es el que más suma y el que más gente evita.</strong> Contar un error y
cómo lo diagnosticaste demuestra tres cosas de una: que el sistema tuvo uso real, que sabés depurar, y que sos
honesto. <b>Un proyecto donde "todo salió bien" suena a que nunca salió del entorno de desarrollo.</b></div>
`,

      tecnico: `
<h4>Los detalles que demuestran producción</h4>
<p>Estos son los que un entrevistador con experiencia registra inmediatamente:</p>
<table>
<tr><th>Mencionar…</th><th>Comunica…</th></tr>
<tr><td>Cost tracking por cliente y feature</td><td>Tuviste usuarios reales y una factura</td></tr>
<tr><td>El filtro de tenant dentro de la consulta</td><td>Entendés el riesgo de filtración</td></tr>
<tr><td>Límite de iteraciones de un agente</td><td>Te pasó, o lo previste</td></tr>
<tr><td>Un conjunto de evaluación</td><td>Podés mejorar el sistema, no solo cambiarlo</td></tr>
<tr><td>Prompt caching y su impacto</td><td>Optimizaste con datos</td></tr>
<tr><td>Qué pasa cuando el proveedor falla</td><td>Pensaste en fallos, no solo en el camino feliz</td></tr>
<tr><td>Retención de trazas y filtrado de PII</td><td>Consideraste privacidad</td></tr>
</table>

<div class="dato"><strong>Sobre proyectos personales:</strong> son perfectamente válidos, y la forma de
contarlos es la misma. Lo que hay que agregar es la <b>honestidad de escala</b>: "es un proyecto propio, no
tuvo carga real, pero implementé cost tracking desde el principio porque quería ver a dónde se iba la plata".
Eso vale más que presentar un proyecto personal como si hubiera tenido miles de usuarios — y si el
entrevistador repregunta, la exageración se derrumba.</div>

<h4>Preparar tres historias</h4>
<p>Conviene tener listas y practicadas:</p>
<ol>
<li><b>Una técnica.</b> Un problema difícil que resolviste, con el diagnóstico.</li>
<li><b>Una de error.</b> Algo que salió mal, cómo lo detectaste y qué cambiaste después para que no vuelva.</li>
<li><b>Una de decisión.</b> Un caso donde elegiste la opción simple sobre la sofisticada, o donde recomendaste <b>no</b> usar IA.</li>
</ol>
<p>La tercera es la que menos gente tiene preparada y la que más impresiona en roles con responsabilidad.</p>

<h4>Cuando no tenés experiencia laboral con IA</h4>
<p>Es una situación muy común y tiene una respuesta buena:</p>
<ul>
<li>Contá un proyecto propio con la misma estructura, siendo honesto sobre la escala.</li>
<li>Traé experiencia <b>transferible</b>: si manejaste multi-tenancy, colas, observabilidad o control de costos en otro contexto, eso es exactamente lo que hace falta en IA.</li>
<li>Mostrá <b>criterio</b>: "no lo construí, pero para ese caso evaluaría X contra Y por Z".</li>
</ul>
<p>Un AI Engineer es más un ingeniero de sistemas que un científico de datos. <b>La experiencia en backend,
bases de datos y sistemas distribuidos cuenta muchísimo</b>, y decirlo explícitamente reencuadra la
conversación a tu favor.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="#f87171" font-size="12" font-weight="700">✗ LISTA DE TECNOLOGÍAS</text>

  <rect x="24" y="36" width="632" height="52" rx="9" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="58" fill="currentColor" opacity=".75" font-size="11.5" font-style="italic">
    “Hice un chatbot con RAG. Usé Next.js, Supabase con pgvector, la API de Anthropic y LangChain.”</text>
  <text x="44" y="78" fill="#f87171" font-size="10.5">
    Todos dicen esto. No dice nada sobre cómo pensás ni sobre si funcionó.</text>

  <text x="24" y="116" fill="#34d399" font-size="12" font-weight="700">✓ PROBLEMA · DECISIÓN · DETALLE · ERROR · RESULTADO</text>

  <rect x="24" y="128" width="632" height="34" rx="8" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.2"/>
  <text x="44" y="143" fill="#34d399" font-size="10.5" font-weight="700">1 · EL PROBLEMA  (en lenguaje de negocio)</text>
  <text x="44" y="157" fill="currentColor" opacity=".7" font-size="10">“el equipo comercial perdía tiempo leyendo el historial antes de cada llamada”</text>

  <rect x="24" y="168" width="632" height="34" rx="8" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="44" y="183" fill="#22d3ee" font-size="10.5" font-weight="700">2 · LA DECISIÓN CLAVE  (y el porqué)</text>
  <text x="44" y="197" fill="currentColor" opacity=".7" font-size="10">“recuperar lo relevante en vez de meter todo el historial: con clientes de 2 años no escalaba”</text>

  <rect x="24" y="208" width="632" height="34" rx="8" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.2"/>
  <text x="44" y="223" fill="#7c5cff" font-size="10.5" font-weight="700">3 · UN DETALLE TÉCNICO</text>
  <text x="44" y="237" fill="currentColor" opacity=".7" font-size="10">“el filtro por tenant va DENTRO de la consulta vectorial, no filtrando después”</text>

  <rect x="24" y="248" width="632" height="44" rx="8" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.8"/>
  <text x="44" y="266" fill="#fbbf24" font-size="10.5" font-weight="700">4 · QUÉ SALIÓ MAL  ←  la parte que más suma y la que más gente evita</text>
  <text x="44" y="281" fill="currentColor" opacity=".75" font-size="10">“inventaba detalles. Era el retrieval, no el modelo. Agregué re-ranking y contexto en los chunks”</text>

  <rect x="24" y="298" width="632" height="34" rx="8" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.2"/>
  <text x="44" y="313" fill="#34d399" font-size="10.5" font-weight="700">5 · EL RESULTADO  (con un número si lo tenés)</text>
  <text x="44" y="327" fill="currentColor" opacity=".7" font-size="10">“unos centavos por resumen, ahorra varios minutos por llamada”</text>

  <rect x="24" y="344" width="632" height="44" rx="9" fill="#7c5cff" fill-opacity=".08" stroke="#7c5cff" stroke-width="1.3" stroke-dasharray="5 4"/>
  <text x="340" y="364" text-anchor="middle" fill="#7c5cff" font-size="11.5" font-weight="700">
    Un proyecto donde “todo salió bien” suena a que nunca salió del entorno de desarrollo.</text>
  <text x="340" y="381" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10.5">
    Contar un error demuestra uso real, capacidad de diagnóstico y honestidad — las tres de una vez.</text>
</svg>`,
        pie: 'La lista de tecnologías la tienen todos. La historia del error la tiene quien lo construyó.',
      },

      entrevista: [
        { p: 'Contame un proyecto con IA que hayas hecho.',
          r: 'Conviene la estructura de cinco partes. <b>El problema</b> en lenguaje de negocio, no técnico. <b>La decisión clave</b> y su porqué. ' +
             '<b>Un detalle técnico</b> concreto que muestre profundidad —por ejemplo, que el filtro de tenant va dentro de la consulta vectorial y ' +
             'no después—. <b>Qué salió mal</b> y cómo lo diagnosticaste, que es la parte que más suma. Y <b>el resultado</b>, con un número si lo ' +
             'tenés. Lo que hay que evitar es la lista de tecnologías: eso lo dice todo el mundo y no comunica nada sobre cómo pensás.' },

        { p: 'No tengo experiencia laboral con IA. ¿Cómo lo manejo?',
          r: 'Con tres movimientos. Contar un <b>proyecto propio</b> con la misma estructura, siendo honesto sobre la escala —"no tuvo carga real, ' +
             'pero implementé cost tracking desde el principio porque quería ver a dónde se iba la plata"—. Traer experiencia <b>transferible</b>: ' +
             'si manejaste multi-tenancy, colas, observabilidad o control de costos en otro contexto, <b>eso es exactamente lo que hace falta acá</b>. ' +
             'Y mostrar criterio sobre lo que no construiste: "no lo hice, pero evaluaría X contra Y por Z". Un AI Engineer es más un ingeniero de ' +
             'sistemas que un científico de datos, y decirlo reencuadra la conversación.' },

        { p: 'Contame algo que hayas hecho mal.',
          r: 'Es una pregunta para responder con un caso concreto y su diagnóstico, no con una falsa modestia. Por ejemplo: un sistema que inventaba ' +
             'detalles, que al principio atribuí al modelo y traté de arreglar retocando el prompt durante días. Cuando finalmente miré <b>qué ' +
             'fragmentos se estaban recuperando</b>, el correcto no aparecía nunca: era un problema de retrieval. Lo arreglé con re-ranking y ' +
             'agregando contexto de ubicación a los chunks. <b>Y lo que cambié después fue el método</b>: ahora lo primero que miro es qué contexto ' +
             'recibió el modelo, antes de tocar una palabra del prompt.' },

        { p: '¿Qué decisión técnica tomaste de la que estés más orgulloso?',
          r: 'Las que mejor funcionan como respuesta son las de <b>simplicidad elegida a conciencia</b>. Por ejemplo, haber resuelto algo con una ' +
             'cadena fija en vez de un agente porque los pasos eran predecibles: quedó más rápido, más barato y depurable leyendo el código. ' +
             'O haber recomendado <b>no usar un LLM</b> en un camino crítico donde una consulta SQL alcanzaba. Ese tipo de respuesta muestra criterio ' +
             'de ingeniería, que es lo que se busca en un rol con responsabilidad, y es lo contrario de lo que contesta la mayoría.' },
      ],

      practica: `
<h4>Armá tus tres historias</h4>
<pre><code>HISTORIA 1 — técnica
  Problema:   ________________________________________
  Decisión:   ________________________________________
  Detalle:    ________________________________________
  Qué falló:  ________________________________________
  Resultado:  ________________________________________

HISTORIA 2 — un error
  Qué pasó:      _____________________________________
  Cómo lo detecté: ___________________________________
  Qué cambié:    _____________________________________
  Qué cambié en el MÉTODO para que no vuelva: ________

HISTORIA 3 — una decisión de simplicidad
  Opción sofisticada que descarté: ___________________
  Por qué:                          __________________
  Cómo resultó:                     __________________</code></pre>

<div class="aviso"><strong>Escribilas y practicalas en voz alta.</strong> Improvisar una historia con nervios
sale mal casi siempre: se pierde el hilo, se olvida el resultado, se va por las ramas. Escribirlas una vez y
decirlas tres veces cambia por completo cómo salen.</div>

<h4>Frases que suman y frases que restan</h4>
<table>
<tr><th>✅ Suma</th><th>❌ Resta</th></tr>
<tr><td>"Medí antes y después, y el cambio fue de X a Y"</td><td>"Quedó bastante mejor"</td></tr>
<tr><td>"Elegí lo simple porque el volumen no justificaba lo otro"</td><td>"Usé la tecnología más moderna"</td></tr>
<tr><td>"Al principio lo diagnostiqué mal, y aprendí a mirar primero el contexto"</td><td>"Salió todo bien"</td></tr>
<tr><td>"Es un proyecto propio, no tuvo carga real, pero…"</td><td>Insinuar una escala que no existió</td></tr>
<tr><td>"Eso no lo construí, pero lo evaluaría así"</td><td>Responder como si lo hubieras hecho</td></tr>
</table>

<h4>Preparar el proyecto que van a mirar</h4>
<p>Si tenés un repositorio público, que tenga:</p>
<ul>
<li>Un <b>README</b> que explique el problema y las decisiones, no solo cómo se instala.</li>
<li>El <b>cost tracking</b> visible, aunque sea mínimo. Es la señal más rápida de criterio.</li>
<li>Un archivo de <b>evals</b>, aunque tenga veinte casos.</li>
<li>Los <b>límites</b> —iteraciones, tokens— explícitos en el código.</li>
</ul>
<p>Cualquiera de esas cuatro cosas hace que tu proyecto se distinga del resto en treinta segundos de lectura.</p>
`,

      errores: [
        { mito: 'Tengo que enumerar todas las tecnologías que usé.',
          realidad: 'La lista la tienen todos y no dice nada sobre cómo pensás. Lo que importa es <b>qué problema resolviste, qué decidiste y por ' +
                    'qué</b>. Las tecnologías aparecen solas al justificar las decisiones.' },

        { mito: 'Mejor no mencionar los errores.',
          realidad: 'Es la parte que <b>más suma</b>. Contar un error y su diagnóstico demuestra uso real, capacidad de depuración y honestidad. ' +
                    'Un proyecto donde "todo salió bien" suena a que nunca salió del entorno de desarrollo.' },

        { mito: 'Si es un proyecto personal, mejor no aclararlo.',
          realidad: 'Aclaralo y contá qué hiciste igual: "no tuvo carga real, pero implementé cost tracking desde el principio". ' +
                    '<b>La honestidad de escala suma</b>, y si el entrevistador repregunta, una exageración se derrumba enseguida.' },

        { mito: 'Sin experiencia laboral en IA no tengo nada que contar.',
          realidad: 'Un AI Engineer es más un ingeniero de sistemas que un científico de datos. <b>Multi-tenancy, colas, observabilidad y control ' +
                    'de costos son exactamente lo que hace falta</b>, vengas de donde vengas. Decirlo explícitamente reencuadra la conversación.' },
      ],

      glosario: [
        { t: 'Experiencia transferible', d: 'Habilidades de otro contexto que aplican directamente: colas, multi-tenancy, observabilidad, costos.' },
        { t: 'Honestidad de escala', d: 'Aclarar el volumen real de un proyecto en lugar de insinuar más. Suma, y evita que una repregunta te exponga.' },
        { t: 'Historia de error', d: 'Relato de algo que falló, cómo se diagnosticó y qué se cambió después. La más valiosa de las tres.' },
        { t: 'Decisión de simplicidad', d: 'Haber elegido la opción simple sobre la sofisticada, con justificación. Muestra criterio.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Qué preguntar vos, y las señales de alerta',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> la entrevista es en las dos direcciones. Las
preguntas que hacés vos revelan tu nivel <b>y</b> te dicen si ese equipo sabe lo que hace.</div>

<h4>La pregunta que lo revela todo</h4>
<p style="font-size:17px;text-align:center;margin:18px 0"><b>"¿Cómo miden si el sistema está funcionando
bien?"</b></p>

<table>
<tr><th>Si responden…</th><th>Significa…</th></tr>
<tr><td>"Tenemos un conjunto de casos y detectamos regresiones al cambiar un prompt"</td><td><b>Equipo maduro.</b> Trabajaron con usuarios reales</td></tr>
<tr><td>"Lo probamos a ojo antes de subir"</td><td>Modo demo. Vas a construir eso vos</td></tr>
<tr><td>"Si el cliente se queja"</td><td>No hay proceso. Puede ser una oportunidad o un caos</td></tr>
</table>

<h4>Las otras cinco que valen</h4>
<ol>
<li><b>"¿Cuánto les cuesta por consulta y lo pueden atribuir por cliente?"</b> — si no lo saben, no hay instrumentación.</li>
<li><b>"¿Qué pasa cuando el proveedor tiene una caída?"</b> — revela si pensaron en fallos.</li>
<li><b>"¿Cómo manejan el aislamiento entre clientes?"</b> — si es multi-tenant y la respuesta es vaga, es un riesgo.</li>
<li><b>"¿Qué parte del sistema les da más dolores de cabeza?"</b> — la respuesta más honesta que vas a obtener.</li>
<li><b>"¿Cuánto tiempo pasa entre que cambian un prompt y saben si mejoró?"</b> — mide su ciclo real.</li>
</ol>

<div class="aviso"><strong>La número 4 es la mejor.</strong> Es abierta, no se puede contestar con una frase
armada, y la respuesta te dice qué vas a estar haciendo realmente los primeros seis meses. Si dicen "el
retrieval" o "los costos", están en problemas reales y conocidos — eso es bueno. Si dicen "ninguno, todo anda
bien", o no tienen usuarios o no están mirando.</div>
`,

      tecnico: `
<h4>Señales de alerta</h4>
<table>
<tr><th>Señal</th><th>Qué suele significar</th></tr>
<tr><td>"Vamos a entrenar nuestro propio modelo"</td><td>Sin equipo de ML ni presupuesto, es una fantasía. Preguntá por qué no RAG</td></tr>
<tr><td>"Fine-tuning con nuestros documentos"</td><td>Confusión conceptual: eso es RAG. Preguntá cómo van a citar fuentes</td></tr>
<tr><td>"El prompt es nuestra ventaja competitiva"</td><td>Un prompt se copia leyendo la salida. La ventaja son los datos y las evals</td></tr>
<tr><td>"No tenemos evals, vamos rápido"</td><td>Van rápido en círculos</td></tr>
<tr><td>"Todo es un agente"</td><td>Costos imprevisibles y depuración difícil</td></tr>
<tr><td>No saben cuánto cuesta por consulta</td><td>No hay instrumentación. Alguna factura va a sorprender</td></tr>
<tr><td>"La IA reemplaza a nuestro equipo de X"</td><td>Expectativas irreales; el proyecto probablemente fracase</td></tr>
</table>

<div class="dato"><strong>Ninguna de estas es descalificante por sí sola.</strong> Un equipo sin evals puede
ser exactamente el lugar donde vos aportás más valor, y decirlo en la entrevista —"eso es de lo primero que
armaría"— es una jugada fuerte. Lo que sí es descalificante es que <b>no reconozcan el problema</b> cuando lo
señalás con tacto.</div>

<h4>Buenas señales</h4>
<ul>
<li>Tienen un conjunto de evaluación y detectan regresiones.</li>
<li>Saben su costo por consulta y lo atribuyen por cliente.</li>
<li>Usan modelos distintos para tareas distintas.</li>
<li>Fijan la versión del modelo.</li>
<li>Hablan de <b>trade-offs</b> en lugar de superlativos.</li>
<li>Reconocen abiertamente qué parte funciona mal.</li>
<li>Tienen human-in-the-loop donde el costo de un error lo justifica.</li>
</ul>

<h4>Preguntas sobre el rol</h4>
<ul>
<li>"¿Qué porcentaje del trabajo es construir features nuevas y qué porcentaje sostener lo existente?"</li>
<li>"¿Quién decide qué se construye con IA y con qué criterio?"</li>
<li>"¿Cómo se mide el éxito de este rol a los seis meses?"</li>
<li>"¿Hay alguien más trabajando en IA o sería el primero?" — muy distinto ser el pionero que sumarse a un equipo.</li>
</ul>
<p>Esa última cambia por completo el trabajo, y sorprendentemente poca gente la hace.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <rect x="120" y="18" width="440" height="46" rx="10" fill="#7c5cff" fill-opacity="=.16" stroke="#7c5cff" stroke-width="1.6"/>
  <rect x="120" y="18" width="440" height="46" rx="10" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.6"/>
  <text x="340" y="47" text-anchor="middle" fill="#7c5cff" font-size="13" font-weight="700">
    “¿Cómo miden si el sistema funciona bien?”</text>

  <rect x="24" y="82" width="200" height="82" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="124" y="104" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">“Conjunto de casos,</text>
  <text x="124" y="120" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">detectamos regresiones”</text>
  <text x="124" y="142" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">equipo maduro</text>
  <text x="124" y="157" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10">tuvieron usuarios reales</text>

  <rect x="240" y="82" width="200" height="82" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="112" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">“Lo probamos a ojo”</text>
  <text x="340" y="142" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">modo demo</text>
  <text x="340" y="157" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10">eso lo vas a construir vos</text>

  <rect x="456" y="82" width="200" height="82" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="556" y="112" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">“Si el cliente se queja”</text>
  <text x="556" y="142" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">no hay proceso</text>
  <text x="556" y="157" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10">oportunidad o caos</text>

  <line x1="24" y1="186" x2="656" y2="186" stroke="currentColor" opacity=".18"/>

  <text x="24" y="210" fill="#f87171" font-size="11.5" font-weight="700">SEÑALES DE ALERTA</text>

  <rect x="24" y="222" width="304" height="22" rx="6" fill="#f87171" fill-opacity=".1"/>
  <text x="38" y="237" fill="currentColor" opacity=".75" font-size="10">“vamos a entrenar nuestro propio modelo”</text>
  <rect x="24" y="248" width="304" height="22" rx="6" fill="#f87171" fill-opacity=".1"/>
  <text x="38" y="263" fill="currentColor" opacity=".75" font-size="10">“fine-tuning con nuestros documentos”  (= es RAG)</text>
  <rect x="24" y="274" width="304" height="22" rx="6" fill="#f87171" fill-opacity=".1"/>
  <text x="38" y="289" fill="currentColor" opacity=".75" font-size="10">“el prompt es nuestra ventaja competitiva”</text>
  <rect x="24" y="300" width="304" height="22" rx="6" fill="#f87171" fill-opacity=".1"/>
  <text x="38" y="315" fill="currentColor" opacity=".75" font-size="10">no saben cuánto cuesta por consulta</text>
  <rect x="24" y="326" width="304" height="22" rx="6" fill="#f87171" fill-opacity=".1"/>
  <text x="38" y="341" fill="currentColor" opacity=".75" font-size="10">“la IA va a reemplazar al equipo de X”</text>

  <text x="352" y="210" fill="#34d399" font-size="11.5" font-weight="700">BUENAS SEÑALES</text>

  <rect x="352" y="222" width="304" height="22" rx="6" fill="#34d399" fill-opacity=".1"/>
  <text x="366" y="237" fill="currentColor" opacity=".75" font-size="10">tienen evals y detectan regresiones</text>
  <rect x="352" y="248" width="304" height="22" rx="6" fill="#34d399" fill-opacity=".1"/>
  <text x="366" y="263" fill="currentColor" opacity=".75" font-size="10">saben su costo por consulta y por cliente</text>
  <rect x="352" y="274" width="304" height="22" rx="6" fill="#34d399" fill-opacity=".1"/>
  <text x="366" y="289" fill="currentColor" opacity=".75" font-size="10">modelos distintos para tareas distintas</text>
  <rect x="352" y="300" width="304" height="22" rx="6" fill="#34d399" fill-opacity=".1"/>
  <text x="366" y="315" fill="currentColor" opacity=".75" font-size="10">hablan de trade-offs, no de superlativos</text>
  <rect x="352" y="326" width="304" height="22" rx="6" fill="#34d399" fill-opacity=".1"/>
  <text x="366" y="341" fill="currentColor" opacity=".75" font-size="10">reconocen qué parte funciona mal</text>

  <rect x="24" y="360" width="632" height="30" rx="8" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.3" stroke-dasharray="5 4"/>
  <text x="340" y="379" text-anchor="middle" fill="#7c5cff" font-size="11.5" font-weight="700">
    Ninguna alerta es descalificante sola. Lo que sí lo es: que no reconozcan el problema cuando lo señalás.</text>
</svg>`,
        pie: 'Las preguntas que hacés vos revelan tu nivel y te dicen si ese equipo sabe lo que hace.',
      },

      entrevista: [
        { p: '¿Tenés alguna pregunta para nosotros?',
          r: 'La más reveladora es <b>"¿cómo miden si el sistema está funcionando bien?"</b>: si tienen un conjunto de casos y detectan regresiones, ' +
             'es un equipo maduro; si es "lo probamos a ojo", están en modo demo. Después preguntaría cuánto les cuesta por consulta y si lo pueden ' +
             'atribuir por cliente, qué hacen cuando el proveedor tiene una caída, y sobre todo <b>"¿qué parte del sistema les da más dolores de ' +
             'cabeza?"</b> — que es abierta, no se puede contestar con una frase armada, y te dice qué vas a estar haciendo los primeros seis meses.' },

        { p: 'En la entrevista te dicen "queremos hacer fine-tuning con nuestros documentos". ¿Qué hacés?',
          r: 'Lo señalaría con tacto y en forma de pregunta, no de corrección: "¿evaluaron RAG para eso? Porque el fine-tuning ajusta comportamiento ' +
             'más que conocimiento, y con documentos que cambian tendrían que reentrenar cada vez, además de no poder citar la fuente — que en un ' +
             'contexto empresarial suele ser un requisito". Y ahí lo importante es <b>la reacción</b>: si les interesa el argumento, es un buen equipo. ' +
             'Si se ponen a la defensiva, eso también es información valiosa sobre cómo sería trabajar ahí.' },

        { p: 'El equipo no tiene evals. ¿Es un motivo para descartar el puesto?',
          r: 'No necesariamente: puede ser exactamente el lugar donde más valor aporto, y lo diría en la entrevista — "eso es de lo primero que ' +
             'armaría, porque sin eso cada cambio es una apuesta". Lo que sí me haría dudar es que <b>no reconozcan el problema</b> cuando lo señalo ' +
             'con tacto, o que digan "no tenemos evals porque vamos rápido". Ir rápido sin medir es ir rápido en círculos, y si no lo ven, ' +
             'ese va a ser mi trabajo diario durante mucho tiempo.' },
      ],

      practica: `
<h4>Tu lista, para llevar</h4>
<pre><code>SOBRE EL SISTEMA
  ☐ ¿Cómo miden si funciona bien?
  ☐ ¿Cuánto cuesta por consulta? ¿Lo atribuyen por cliente?
  ☐ ¿Qué pasa cuando el proveedor tiene una caída?
  ☐ ¿Cómo manejan el aislamiento entre clientes?
  ☐ ¿Qué parte les da más dolores de cabeza?        ← la mejor

SOBRE EL PROCESO
  ☐ ¿Cuánto pasa entre cambiar un prompt y saber si mejoró?
  ☐ ¿Los prompts están versionados en el repositorio?
  ☐ ¿Fijan la versión del modelo?

SOBRE EL ROL
  ☐ ¿Cuánto es construir y cuánto sostener?
  ☐ ¿Quién decide qué se construye con IA y con qué criterio?
  ☐ ¿Hay alguien más en IA o sería el primero?
  ☐ ¿Cómo se mide el éxito de este rol a los seis meses?</code></pre>

<div class="aviso"><strong>No las hagas todas.</strong> Tres o cuatro bien elegidas según cómo venga la
conversación valen más que una lista recitada. Y escuchá la respuesta de verdad: la información que te dan es
la base para decidir si querés el puesto.</div>

<h4>Cómo señalar un problema sin sonar arrogante</h4>
<table>
<tr><th>❌ Suena a corrección</th><th>✅ Suena a colaboración</th></tr>
<tr><td>"Eso está mal, deberían usar RAG"</td><td>"¿Evaluaron RAG para eso? Lo pregunto porque con documentos que cambian, el fine-tuning obliga a reentrenar"</td></tr>
<tr><td>"Sin evals no se puede trabajar"</td><td>"¿Cómo detectan si un cambio de prompt rompió algo? Es de lo primero que me pondría a armar"</td></tr>
<tr><td>"Los agentes son innecesarios acá"</td><td>"¿Los pasos son siempre los mismos? Porque si son predecibles, una cadena fija sería más barata y más fácil de depurar"</td></tr>
</table>
<p>La columna derecha hace lo mismo que la izquierda —señala el problema— pero abre una conversación en lugar
de cerrarla. Y de paso demuestra el conocimiento igual.</p>
`,

      errores: [
        { mito: 'Preguntar mucho me hace ver inseguro.',
          realidad: 'Es al revés: las preguntas que hacés <b>revelan tu nivel</b>. Preguntar cómo miden la calidad o cuánto cuesta por consulta ' +
                    'muestra que sabés qué importa en producción. Y de paso te dice si querés ese trabajo.' },

        { mito: 'Si el equipo tiene problemas, mejor no señalarlos.',
          realidad: 'Señalarlos <b>en forma de pregunta</b> demuestra conocimiento y abre una conversación. Lo que importa es la reacción: ' +
                    'un buen equipo se interesa por el argumento. Uno que se pone a la defensiva te está dando información valiosa.' },

        { mito: 'Un equipo sin evals es descartable.',
          realidad: 'Puede ser exactamente donde más aportás, y decirlo es una jugada fuerte. Lo descalificante no es la ausencia sino ' +
                    '<b>que no reconozcan el problema</b> cuando lo mencionás con tacto.' },

        { mito: 'Preparo todas las preguntas y las hago en orden.',
          realidad: 'Tres o cuatro bien elegidas según cómo venga la conversación valen más que una lista recitada. ' +
                    'Y escuchá las respuestas de verdad: son la base para decidir si querés el puesto.' },
      ],

      glosario: [
        { t: 'Señal de alerta', d: 'Indicio de que un equipo no entiende el problema o tiene expectativas irreales.' },
        { t: 'Pregunta abierta', d: 'La que no se puede contestar con una frase armada. Suele dar la respuesta más honesta.' },
        { t: 'Entrevista bidireccional', d: 'Entenderla como evaluación mutua, no solo del candidato.' },
        { t: 'Señalar con tacto', d: 'Plantear un problema en forma de pregunta, para abrir conversación en lugar de cerrarla.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Qué forma tiene una buena respuesta de entrevista?',
      opciones: [
        'La respuesta directa, el porqué, y el matiz o trade-off',
        'La definición más técnica y completa posible',
        'Un ejemplo largo y detallado de tu experiencia',
        'La respuesta más corta posible',
      ],
      correcta: 0,
      porQue: 'El matiz —dónde no aplica, qué cuesta— es lo que distingue a quien lo construyó de quien lo leyó. Sin él, la respuesta suena a manual.',
      porQueNo: {
        1: 'El vocabulario técnico sin criterio suele tapar huecos, y una repregunta lo expone.',
        2: 'Un monólogo pierde al entrevistador. El objetivo son 30 a 60 segundos.',
        3: 'Demasiado corta no muestra razonamiento, que es justamente lo que se evalúa.',
      },
    },
    {
      p: 'De las preguntas frecuentes, ¿cuáles separan a quien tuvo usuarios reales?',
      opciones: [
        'Cómo evaluás, cómo controlás los costos, y cuándo NO usar un agente',
        'Qué es un LLM y qué es un embedding',
        'Qué es RAG y qué es fine-tuning',
        'Qué frameworks conocés',
      ],
      correcta: 0,
      porQue: 'Evals, costos y criterio para no usar un agente son problemas que solo aparecen con usuarios reales. Las definiciones las contesta cualquiera que leyó un blog.',
      porQueNo: {
        1: 'Son definiciones básicas: se responden después de leer un artículo.',
        2: 'Muy frecuentes, pero también respondibles solo con lectura.',
        3: 'Conocer nombres de herramientas no demuestra criterio.',
      },
    },
    {
      p: 'En una entrevista de diseño, ¿qué hacés primero?',
      opciones: [
        'Preguntar: volumen, multi-tenant, latencia tolerada, costo de un error',
        'Dibujar la arquitectura completa',
        'Enumerar las tecnologías que usarías',
        'Explicar cómo funciona RAG',
      ],
      correcta: 0,
      porQue: 'Los primeros dos minutos de preguntas valen más que diez de dibujo: muestran que entendés que la solución correcta depende del contexto.',
      porQueNo: {
        1: 'Dibujar sin preguntar comunica que aplicás una plantilla sin evaluar el caso.',
        2: 'Las tecnologías se justifican al tomar decisiones, no antes.',
        3: 'Explicar teoría no es diseñar para un caso concreto.',
      },
    },
    {
      p: 'En una entrevista de diseño, ¿qué parte suele definir el resultado?',
      opciones: [
        'Los requisitos no funcionales: costo, seguridad, multi-tenant, observabilidad',
        'La cantidad de componentes del diagrama',
        'Conocer los nombres de todas las herramientas',
        'La velocidad con que dibujás',
      ],
      correcta: 0,
      porQue: 'Cualquiera dibuja un pipeline de RAG. Mencionar registro de costo por cliente, límites de gasto y cómo medís la calidad es lo que muestra experiencia real.',
      porQueNo: {
        1: 'Más componentes suele indicar falta de criterio, no más conocimiento.',
        2: 'Nombrar herramientas sin justificarlas suena a tutorial.',
        3: 'No se evalúa velocidad sino razonamiento.',
      },
    },
    {
      p: 'Te piden diseñar un buscador semántico para un e-commerce. ¿Qué respuesta impresiona más?',
      opciones: [
        'Búsqueda híbrida obligatoria, filtros SQL, y señalar que tal vez no haga falta un LLM en el camino crítico',
        'Un agente con herramientas de búsqueda',
        'RAG completo con generación de respuestas',
        'Fine-tuning sobre el catálogo de productos',
      ],
      correcta: 0,
      porQue: 'Los códigos de producto y las marcas necesitan BM25, los filtros de stock y precio son SQL, y devolver productos ordenados puede ser mejor que un texto generado. Reconocer que la respuesta correcta puede ser no usar un LLM demuestra criterio.',
      porQueNo: {
        1: 'Agrega latencia, costo e imprevisibilidad a un problema con pasos conocidos.',
        2: 'Generar texto puede no aportar nada frente a una grilla de productos.',
        3: 'Confunde conocimiento con comportamiento: el catálogo cambia todo el tiempo.',
      },
    },
    {
      p: 'Al contar un proyecto propio, ¿qué parte suma más?',
      opciones: [
        'Qué salió mal, cómo lo diagnosticaste y qué cambiaste después',
        'La lista completa de tecnologías usadas',
        'La cantidad de features implementadas',
        'El tiempo que tardaste en construirlo',
      ],
      correcta: 0,
      porQue: 'Demuestra tres cosas de una vez: que el sistema tuvo uso real, que sabés depurar y que sos honesto. Un proyecto donde "todo salió bien" suena a que nunca salió de desarrollo.',
      porQueNo: {
        1: 'La lista la tiene cualquiera y no dice nada sobre cómo pensás.',
        2: 'La cantidad no habla de calidad ni de criterio.',
        3: 'Es irrelevante frente a las decisiones que tomaste.',
      },
    },
    {
      p: 'No tenés experiencia laboral con IA. ¿Cuál es el mejor enfoque?',
      opciones: [
        'Proyecto propio con honestidad de escala, más experiencia transferible en sistemas',
        'Presentar el proyecto propio como si hubiera tenido usuarios',
        'No mencionar que no tenés experiencia',
        'Enfocarte solo en la teoría que estudiaste',
      ],
      correcta: 0,
      porQue: 'Un AI Engineer es más ingeniero de sistemas que científico de datos: multi-tenancy, colas, observabilidad y control de costos cuentan muchísimo. Decirlo explícitamente reencuadra la conversación.',
      porQueNo: {
        1: 'Si el entrevistador repregunta, la exageración se derrumba y cuesta mucho más caro.',
        2: 'Se nota enseguida y genera desconfianza sobre todo lo demás.',
        3: 'La teoría sin criterio de aplicación no diferencia de nadie.',
      },
    },
    {
      p: '¿Cuál es la mejor pregunta para saber si un equipo está maduro?',
      opciones: [
        '¿Cómo miden si el sistema está funcionando bien?',
        '¿Qué modelo usan?',
        '¿Cuántas personas hay en el equipo?',
        '¿Qué framework usan?',
      ],
      correcta: 0,
      porQue: 'Si tienen un conjunto de casos y detectan regresiones al cambiar un prompt, trabajaron con usuarios reales. Si es "lo probamos a ojo", están en modo demo.',
      porQueNo: {
        1: 'La elección de modelo no dice nada sobre madurez de proceso.',
        2: 'El tamaño no se relaciona con la calidad de las prácticas.',
        3: 'Cualquier equipo puede nombrar un framework.',
      },
    },
    {
      p: '¿Cuál es la pregunta abierta que da la respuesta más honesta?',
      opciones: [
        '¿Qué parte del sistema les da más dolores de cabeza?',
        '¿Les gusta trabajar acá?',
        '¿Cuál es la cultura del equipo?',
        '¿Cuáles son los próximos objetivos?',
      ],
      correcta: 0,
      porQue: 'No se puede contestar con una frase armada, y la respuesta te dice qué vas a estar haciendo los primeros seis meses. Si dicen "ninguno, todo anda bien", o no tienen usuarios o no están mirando.',
      porQueNo: {
        1: 'Casi nadie contesta que no en una entrevista.',
        2: 'Suele generar respuestas genéricas y ensayadas.',
        3: 'Es útil, pero se responde con el plan oficial, no con la realidad.',
      },
    },
    {
      p: 'El equipo dice "queremos hacer fine-tuning con nuestros documentos". ¿Qué señal es?',
      opciones: [
        'Confusión conceptual: eso es RAG. Conviene preguntar cómo van a citar fuentes',
        'Buena señal: tienen presupuesto para entrenar',
        'Señal neutra, es una decisión válida',
        'Señal de que el equipo es muy avanzado',
      ],
      correcta: 0,
      porQue: 'El fine-tuning ajusta comportamiento, no memoriza hechos de forma confiable, no permite citar la fuente y obliga a reentrenar con cada documento nuevo. Señalarlo como pregunta demuestra conocimiento y abre conversación.',
      porQueNo: {
        1: 'Tener presupuesto no vuelve correcta una elección técnica equivocada.',
        2: 'Para conocimiento propio que cambia, es claramente la técnica equivocada.',
        3: 'Es justamente el error más común del rubro.',
      },
    },
    {
      p: 'Un equipo no tiene evals. ¿Qué corresponde concluir?',
      opciones: [
        'No es descalificante: puede ser donde más aportes. Lo grave sería que no reconozcan el problema',
        'Hay que descartar el puesto',
        'Es normal, casi nadie los tiene',
        'Significa que el sistema no funciona',
      ],
      correcta: 0,
      porQue: 'Decir "eso es de lo primero que armaría" es una jugada fuerte. Lo que sí es mala señal es que se pongan a la defensiva o que digan "no los tenemos porque vamos rápido" — ir rápido sin medir es ir rápido en círculos.',
      porQueNo: {
        1: 'Puede ser una oportunidad clara de aportar valor desde el primer mes.',
        2: 'Que sea frecuente no lo vuelve una buena práctica.',
        3: 'Puede funcionar; lo que no pueden es saber si mejora o empeora.',
      },
    },
    {
      p: '¿Cómo conviene señalar un problema técnico en la entrevista?',
      opciones: [
        'En forma de pregunta: "¿evaluaron X? lo pregunto porque…"',
        'Directamente: "eso está mal"',
        'No señalarlo, para no incomodar',
        'Al final, cuando ya te hicieron la oferta',
      ],
      correcta: 0,
      porQue: 'Señala el problema igual y demuestra el conocimiento igual, pero abre una conversación en lugar de cerrarla. Y la reacción del equipo te da información muy valiosa.',
      porQueNo: {
        1: 'Suena a corrección y cierra la conversación, aunque tengas razón.',
        2: 'Perdés la oportunidad de demostrar criterio y de evaluar cómo reaccionan.',
        3: 'Demasiado tarde para que influya en tu decisión de aceptar.',
      },
    },
    {
      p: 'Al practicar respuestas, ¿cuál es el error más común?',
      opciones: [
        'Leer la respuesta y pensar "eso ya lo sé": reconocer no es recordar',
        'Practicar demasiadas preguntas',
        'Cronometrarse',
        'Escribir las respuestas',
      ],
      correcta: 0,
      porQue: 'Si no podés decirlo en voz alta y sin leer, en la entrevista tampoco vas a poder, con nervios y alguien mirándote. Grabarse una vez es incómodo y es lo que más rápido mejora.',
      porQueNo: {
        1: 'Practicar más ayuda; el problema es cómo se practica.',
        2: 'Cronometrarse es útil: el objetivo son 30 a 60 segundos.',
        3: 'Escribirlas ayuda a ordenar, siempre que después se digan en voz alta.',
      },
    },
    {
      p: '¿Qué decisión técnica suele impresionar más al contarla?',
      opciones: [
        'Haber elegido la opción simple sobre la sofisticada, con justificación',
        'Haber usado la tecnología más nueva disponible',
        'Haber construido un sistema multi-agente',
        'Haber entrenado un modelo propio',
      ],
      correcta: 0,
      porQue: 'Muestra criterio de ingeniería en vez de entusiasmo por la herramienta, que es lo que se busca en un rol con responsabilidad. Es lo contrario de lo que contesta la mayoría.',
      porQueNo: {
        1: 'Elegir por novedad es lo opuesto a elegir por criterio.',
        2: 'Puede indicar complejidad innecesaria si el problema no lo requería.',
        3: 'Casi siempre es la decisión equivocada fuera de un laboratorio.',
      },
    },
  ],
});
