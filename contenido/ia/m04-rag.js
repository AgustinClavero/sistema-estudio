/* ==========================================================================
   IA · Módulo 04 — RAG de punta a punta
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ia',
  id: 'm04',
  titulo: 'RAG de punta a punta',
  fuentes: ['paper-rag', 'anthropic-contextual', 'pgvector', 'cohere-rerank', 'bm25', 'ragas'],

  intro:
    '<p>Este es <b>el módulo</b>. Si hay una sola cosa que se pide en las ofertas de AI Engineer, es RAG. ' +
    'Y es también donde más gente se queda a mitad de camino: monta un prototipo que anda con diez documentos ' +
    'y no entiende por qué se cae con diez mil.</p>' +
    '<p>Salís de acá pudiendo dibujar el pipeline completo en un pizarrón, explicar cada decisión con su ' +
    'trade-off, y —sobre todo— <b>diagnosticar dónde falla</b>, que es la pregunta que separa a quien lo ' +
    'construyó de quien leyó sobre el tema.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Qué es RAG y el pipeline completo',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el modelo es un experto brillante con la memoria
congelada en el día que terminó de estudiar. <b>RAG es acercarle la carpeta correcta justo antes de
preguntarle.</b></div>

<p><b>RAG</b> significa <i>Retrieval-Augmented Generation</i>: generación aumentada por recuperación. El nombre
suena complicado y la idea es simple, en tres pasos:</p>

<ol>
<li><b>Buscar</b> en tus documentos los fragmentos relevantes para la pregunta.</li>
<li><b>Pegarlos</b> en el prompt, junto con la pregunta.</li>
<li><b>Preguntar</b> al modelo, que responde usando eso.</li>
</ol>

<p>Eso es todo. La complejidad no está en la idea: está en hacer bien el paso 1.</p>

<h4>Las dos mitades del sistema</h4>

<p><b>Mitad 1 · Ingestión</b> — pasa una sola vez por documento, offline:</p>
<pre><code>documento → extraer texto → partir en fragmentos → generar embeddings → guardar</code></pre>

<p><b>Mitad 2 · Consulta</b> — pasa en cada pregunta, en vivo:</p>
<pre><code>pregunta → (reescribir) → buscar → re-rankear → armar prompt → generar → responder con fuentes</code></pre>

<div class="aviso"><strong>La frase que más te va a servir en una entrevista:</strong> <b>"la calidad de un RAG
está limitada por su recuperación, no por su generación"</b>. Si el fragmento con la respuesta nunca entra al
prompt, no hay modelo ni prompt que lo salve. Por eso la mayor parte del trabajo —y de este módulo— está en la
búsqueda, no en la redacción del prompt.</div>

<h4>Por qué RAG y no las alternativas</h4>
<table>
<tr><th></th><th>RAG</th><th>Fine-tuning</th><th>Todo en el contexto</th></tr>
<tr><td>Actualizar un dato</td><td>Reindexar: minutos</td><td>Reentrenar: horas o días</td><td>Inmediato</td></tr>
<tr><td>Citar la fuente</td><td><b>Sí</b></td><td>No</td><td>Sí</td></tr>
<tr><td>Corpus grande</td><td><b>Sin límite</b></td><td>Sin límite</td><td>Limitado por la ventana</td></tr>
<tr><td>Costo por consulta</td><td>Medio</td><td>Bajo</td><td>Alto: pagás todo cada vez</td></tr>
<tr><td>Datos privados por cliente</td><td><b>Fácil de aislar</b></td><td>Un modelo por cliente: inviable</td><td>Posible pero caro</td></tr>
</table>

<p>Esa última fila es decisiva en un SaaS multi-tenant y casi nadie la menciona: con RAG el aislamiento es un
<code>WHERE tenant_id</code>. Con fine-tuning necesitarías un modelo por cliente.</p>
`,

      tecnico: `
<h4>El pipeline, etapa por etapa</h4>

<p><b>Ingestión (offline)</b></p>
<ol>
<li><b>Extracción</b> — de PDF, HTML, DOCX, Markdown a texto plano, conservando estructura (títulos, tablas, orden de lectura).</li>
<li><b>Limpieza</b> — quitar encabezados y pies repetidos, menús de navegación, ruido de OCR.</li>
<li><b>Chunking</b> — partir en fragmentos indexables con solapamiento.</li>
<li><b>Enriquecimiento</b> — agregar metadatos: fuente, sección, fecha, tenant, permisos.</li>
<li><b>Embedding</b> — vectorizar cada fragmento, en lote.</li>
<li><b>Indexación</b> — guardar vector + texto + metadatos, con índice vectorial y de texto completo.</li>
</ol>

<p><b>Consulta (en vivo)</b></p>
<ol>
<li><b>Reescritura</b> — descontextualizar contra el historial, expandir, o descomponer.</li>
<li><b>Recuperación</b> — búsqueda híbrida (vectorial + BM25) filtrada por tenant y permisos, top-k amplio (30-50).</li>
<li><b>Re-ranking</b> — un cross-encoder reordena y recorta a los 3-8 mejores.</li>
<li><b>Armado del prompt</b> — fragmentos con identificador, dentro del presupuesto de tokens.</li>
<li><b>Generación</b> — con instrucciones de fundamentación y citación.</li>
<li><b>Post-proceso</b> — validar citas, filtrar PII, registrar tokens y costo.</li>
</ol>

<div class="dato"><strong>Los dos números que definen todo el sistema:</strong> <b>context recall</b> —¿el
fragmento correcto está entre los recuperados?— y <b>faithfulness</b> —¿la respuesta está sustentada por lo
recuperado?—. El primero acota al segundo: si el recall es 70%, tu techo de calidad es 70%, sin importar cuán
bueno sea el modelo. <b>Siempre se mide el recall primero.</b></div>

<h4>Bi-encoder y cross-encoder</h4>
<p>La distinción que explica por qué hacen falta dos etapas de búsqueda:</p>
<table>
<tr><th></th><th>Bi-encoder (embeddings)</th><th>Cross-encoder (re-ranker)</th></tr>
<tr><td>Cómo funciona</td><td>Vectoriza consulta y documento por separado y compara vectores</td><td>Procesa consulta y documento <b>juntos</b> y emite un puntaje</td></tr>
<tr><td>Precomputable</td><td>Sí: los documentos se vectorizan una vez</td><td>No: hay que correrlo por cada par</td></tr>
<tr><td>Velocidad</td><td>Millones de comparaciones por segundo</td><td>Decenas o cientos de pares por segundo</td></tr>
<tr><td>Precisión</td><td>Media</td><td>Alta</td></tr>
</table>
<p>De ahí el diseño estándar: el bi-encoder hace el filtro grueso sobre millones, el cross-encoder afina sobre
las 50 candidatas. <b>Ninguno reemplaza al otro.</b></p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="r1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".5"/></marker></defs>

  <text x="24" y="24" fill="#22d3ee" font-size="12" font-weight="700">INGESTIÓN  ·  una vez por documento, offline</text>
  <rect x="24" y="34" width="632" height="60" rx="10" fill="#22d3ee" fill-opacity=".07" stroke="#22d3ee" stroke-width="1.4"/>

  <rect x="38" y="48" width="86" height="32" rx="7" fill="#22d3ee" fill-opacity=".18"/>
  <text x="81" y="68" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">documento</text>
  <line x1="126" y1="64" x2="142" y2="64" stroke="currentColor" stroke-width="1.3" marker-end="url(#r1)"/>
  <rect x="146" y="48" width="76" height="32" rx="7" fill="#22d3ee" fill-opacity=".18"/>
  <text x="184" y="68" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">extraer</text>
  <line x1="224" y1="64" x2="240" y2="64" stroke="currentColor" stroke-width="1.3" marker-end="url(#r1)"/>
  <rect x="244" y="48" width="94" height="32" rx="7" fill="#fbbf24" fill-opacity=".26"/>
  <text x="291" y="68" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">CHUNKING</text>
  <line x1="340" y1="64" x2="356" y2="64" stroke="currentColor" stroke-width="1.3" marker-end="url(#r1)"/>
  <rect x="360" y="48" width="94" height="32" rx="7" fill="#22d3ee" fill-opacity=".18"/>
  <text x="407" y="68" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">embeddings</text>
  <line x1="456" y1="64" x2="472" y2="64" stroke="currentColor" stroke-width="1.3" marker-end="url(#r1)"/>
  <rect x="476" y="48" width="166" height="32" rx="7" fill="#22d3ee" fill-opacity=".28" stroke="#22d3ee" stroke-opacity=".6"/>
  <text x="559" y="68" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">índice  (vector + texto)</text>

  <line x1="559" y1="94" x2="559" y2="150" stroke="currentColor" opacity=".35" stroke-width="1.4" stroke-dasharray="4 4"/>

  <text x="24" y="126" fill="#7c5cff" font-size="12" font-weight="700">CONSULTA  ·  en cada pregunta, en vivo</text>
  <rect x="24" y="136" width="632" height="150" rx="10" fill="#7c5cff" fill-opacity=".07" stroke="#7c5cff" stroke-width="1.4"/>

  <rect x="38" y="152" width="104" height="34" rx="7" fill="#7c5cff" fill-opacity=".2"/>
  <text x="90" y="173" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">pregunta</text>
  <line x1="144" y1="169" x2="160" y2="169" stroke="currentColor" stroke-width="1.3" marker-end="url(#r1)"/>
  <rect x="164" y="152" width="120" height="34" rx="7" fill="#7c5cff" fill-opacity=".2"/>
  <text x="224" y="167" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">reescribir</text>
  <text x="224" y="180" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9">descontextualizar</text>
  <line x1="286" y1="169" x2="302" y2="169" stroke="currentColor" stroke-width="1.3" marker-end="url(#r1)"/>

  <rect x="306" y="146" width="150" height="46" rx="7" fill="#34d399" fill-opacity=".24" stroke="#34d399" stroke-opacity=".6"/>
  <text x="381" y="164" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">BUSCAR (híbrida)</text>
  <text x="381" y="180" text-anchor="middle" fill="#34d399" font-size="9.5">vector + BM25 → 50 candidatos</text>
  <line x1="458" y1="169" x2="474" y2="169" stroke="currentColor" stroke-width="1.3" marker-end="url(#r1)"/>

  <rect x="478" y="146" width="164" height="46" rx="7" fill="#34d399" fill-opacity=".24" stroke="#34d399" stroke-opacity=".6"/>
  <text x="560" y="164" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">RE-RANKEAR</text>
  <text x="560" y="180" text-anchor="middle" fill="#34d399" font-size="9.5">cross-encoder → los 5 mejores</text>

  <path d="M 560 192 q 0 22 -240 22 q -240 0 -240 22" fill="none" stroke="currentColor" opacity=".3" stroke-width="1.3" stroke-dasharray="4 3"/>

  <rect x="38" y="234" width="150" height="38" rx="7" fill="#7c5cff" fill-opacity=".2"/>
  <text x="113" y="257" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">armar el prompt</text>
  <line x1="190" y1="253" x2="206" y2="253" stroke="currentColor" stroke-width="1.3" marker-end="url(#r1)"/>
  <rect x="210" y="234" width="130" height="38" rx="7" fill="#fbbf24" fill-opacity=".26"/>
  <text x="275" y="257" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">generar</text>
  <line x1="342" y1="253" x2="358" y2="253" stroke="currentColor" stroke-width="1.3" marker-end="url(#r1)"/>
  <rect x="362" y="234" width="280" height="38" rx="7" fill="#34d399" fill-opacity=".2"/>
  <text x="502" y="257" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">respuesta + fuentes verificadas</text>

  <rect x="24" y="304" width="632" height="100" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="330" text-anchor="middle" fill="#f87171" font-size="13" font-weight="700">
    La calidad de un RAG está limitada por su RECUPERACIÓN, no por su generación.</text>
  <text x="340" y="354" text-anchor="middle" fill="currentColor" opacity=".75" font-size="11.5">
    Si el fragmento correcto nunca entra al prompt, ningún modelo ni ningún prompt lo salvan.</text>
  <text x="340" y="378" text-anchor="middle" fill="currentColor" opacity=".75" font-size="11.5">
    Por eso se mide <tspan font-weight="700">context recall</tspan> ANTES que cualquier métrica de la respuesta:</text>
  <text x="340" y="396" text-anchor="middle" fill="currentColor" opacity=".6" font-size="11">
    con 70% de recall, tu techo de calidad es 70% — da igual qué modelo uses.</text>
</svg>`,
        pie: 'El pipeline completo. Las cajas verdes son donde se gana o se pierde el sistema.',
      },

      entrevista: [
        { p: 'Explicame qué es RAG.',
          r: 'Es un patrón donde, antes de preguntarle al modelo, <b>se buscan los fragmentos relevantes en un corpus propio y se agregan al prompt</b>. ' +
             'Resuelve el problema de que el modelo solo sabe lo que estaba en su entrenamiento: le da información privada, actualizada y específica ' +
             'del negocio, sin reentrenar nada. Tiene dos mitades: una <b>ingestión</b> offline —extraer, chunkear, vectorizar, indexar— y una ' +
             '<b>consulta</b> en vivo —reescribir, buscar, re-rankear, generar—. Y dos ventajas que suelen ser decisivas: podés citar la fuente, ' +
             'y podés aislar datos por cliente con un simple filtro.' },

        { p: 'Si tuvieras que dibujarme la arquitectura en un pizarrón, ¿qué dibujarías?',
          r: 'Dos filas. Arriba la <b>ingestión</b>: documento → extracción → chunking → embeddings → índice. Abajo la <b>consulta</b>: ' +
             'pregunta → reescritura → búsqueda híbrida (vectorial + BM25, filtrada por tenant) → re-ranking → armado del prompt → generación → ' +
             'validación de citas. Y marcaría dos cosas: que el <b>chunking</b> y el <b>re-ranking</b> son donde se gana o se pierde el sistema, ' +
             'y que hay un bucle de <b>evaluación</b> midiendo context recall y faithfulness, porque sin eso no sabés si un cambio mejoró o empeoró.' },

        { p: '¿Por qué hacen falta dos etapas de búsqueda?',
          r: 'Porque los dos modelos que intervienen tienen perfiles opuestos. El <b>bi-encoder</b> —los embeddings— vectoriza consulta y documento ' +
             'por separado, así que los documentos se pueden precalcular y comparar millones por segundo, pero es impreciso porque comprime cada texto ' +
             'en un punto. El <b>cross-encoder</b> —el re-ranker— procesa la consulta y el documento <i>juntos</i>, lo que es mucho más preciso pero ' +
             'no se puede precalcular y solo maneja decenas o cientos de pares. Entonces se combinan: el bi-encoder filtra millones a 50, y el ' +
             'cross-encoder afina esos 50 a los 5 finales.' },

        { p: '¿Qué métrica mirás primero cuando un RAG no funciona?',
          r: '<b>Context recall</b>: si el fragmento con la respuesta correcta estuvo entre los recuperados. Es lo primero porque acota todo lo demás — ' +
             'con 70% de recall, mi techo de calidad es 70% por más que use el mejor modelo del mundo. Recién si el recall es bueno y las respuestas ' +
             'siguen siendo malas miro <b>faithfulness</b>, que evalúa si la respuesta está sustentada por lo que se recuperó. ' +
             'Diagnosticar al revés es la forma más común de perder días retocando prompts para un problema de búsqueda.' },
      ],

      practica: `
<h4>El pipeline mínimo pero completo</h4>
<pre><code>// ---------- INGESTIÓN (offline, en una cola) ----------
export async function ingestar(archivo, tenantId) {
  const texto     = await extraerTexto(archivo);          // PDF/DOCX/HTML → texto
  const fragmentos = chunkear(texto, { objetivo: 500, solape: 80 });

  const vectores = await embeddingsEnLote(               // en lote: 100× más barato
    fragmentos.map(f =&gt; 'passage: ' + f.texto)
  );

  await supabase.from('documentos').insert(
    fragmentos.map((f, i) =&gt; ({
      tenant_id: tenantId,
      fuente_id: archivo.id,
      contenido: f.texto,
      embedding: vectores[i],
      modelo_embedding: MODELO_EMB,
      metadata: { seccion: f.seccion, pagina: f.pagina, posicion: i },
    }))
  );
}

// ---------- CONSULTA (en vivo) ----------
export async function responder(pregunta, historial, tenantId) {
  const consulta = historial.length
    ? await consultaAutonoma(historial, pregunta)   // "¿y eso?" → pregunta completa
    : pregunta;

  const candidatos = await buscarHibrido(consulta, { tenantId, limite: 50 });
  if (!candidatos.length) {
    return { texto: 'No encuentro información sobre eso en los documentos disponibles.' };
  }

  const mejores = await reRankear(consulta, candidatos, { limite: 5 });

  const r = await llamarModelo({
    tarea: 'responder',
    tenantId,
    mensajes: [{ role: 'user', content: armarPrompt(mejores, consulta) }],
  });

  const citas = verificarCitas(r.texto, mejores);       // ¿las fuentes existen?
  return { texto: r.texto, fuentes: mejores, citasValidas: citas.ok };
}</code></pre>

<div class="aviso"><strong>Fijate el <code>if (!candidatos.length)</code>.</strong> Es tres líneas y evita la
peor falla posible: llamar al modelo sin ningún contexto, con lo cual responde <b>desde su conocimiento
general</b> y suena perfectamente creíble. El usuario recibe una respuesta inventada sobre tu negocio.
<b>Sin contexto, no se llama al modelo.</b></div>

<h4>El presupuesto de un RAG típico</h4>
<table>
<tr><th>Etapa</th><th>Latencia</th><th>Costo relativo</th></tr>
<tr><td>Reescritura de consulta</td><td>200-500 ms</td><td>Muy bajo (modelo chico)</td></tr>
<tr><td>Embedding de la consulta</td><td>50-150 ms</td><td>Despreciable</td></tr>
<tr><td>Búsqueda híbrida</td><td>30-120 ms</td><td>Cero (tu base)</td></tr>
<tr><td>Re-ranking de 50 candidatos</td><td>100-400 ms</td><td>Bajo</td></tr>
<tr><td>Generación</td><td>1-10 s</td><td><b>El 90% del costo</b></td></tr>
</table>
<p>Todo lo previo a la generación suma menos de un segundo y cuesta centavos. <b>Esa es la razón para ser
generoso con el retrieval y austero con el contexto que mandás</b>: mejorar la búsqueda es barato, mandar
fragmentos de más es caro.</p>
`,

      errores: [
        { mito: 'RAG es pegarle los documentos al prompt.',
          realidad: 'Eso es <i>context stuffing</i> y solo funciona con corpus chicos. RAG es un <b>pipeline</b>: chunking, indexado, búsqueda ' +
                    'híbrida, re-ranking, armado del prompt y validación. La diferencia se nota justo cuando el corpus crece, que es cuando ' +
                    'el prototipo deja de servir.' },

        { mito: 'Si el modelo responde mal, mejoro el prompt.',
          realidad: 'Primero mirá <b>qué fragmentos recibió</b>. En la mayoría de los casos el modelo respondió razonablemente con un contexto ' +
                    'incompleto. <b>Retocar el prompt cuando el problema es de retrieval es la forma más común de perder días</b> en un proyecto de RAG.' },

        { mito: 'Cuantos más fragmentos le mande, mejor.',
          realidad: 'Falso por dos motivos: pagás todos esos tokens en cada llamada, y por el <i>lost in the middle</i> la información sepultada ' +
                    'entre muchos fragmentos se atiende peor. <b>Cinco fragmentos bien elegidos superan a cincuenta mediocres</b>, en calidad y en costo.' },

        { mito: 'Si no encuentro nada, igual le pregunto al modelo.',
          realidad: 'Es la peor falla posible: sin contexto, el modelo responde desde su conocimiento general y suena creíble, ' +
                    'pero está inventando sobre tu negocio. <b>Si el retrieval vuelve vacío, se corta antes de llamar al modelo</b> y se devuelve ' +
                    'un mensaje explícito de que no hay información.' },
      ],

      glosario: [
        { t: 'RAG', d: 'Retrieval-Augmented Generation. Recuperar información relevante y agregarla al prompt antes de generar.' },
        { t: 'Ingestión', d: 'Proceso offline que convierte documentos en fragmentos indexados y vectorizados.' },
        { t: 'Bi-encoder', d: 'Modelo que vectoriza consulta y documento por separado. Rápido, precomputable, menos preciso.' },
        { t: 'Cross-encoder', d: 'Modelo que procesa consulta y documento juntos. Preciso, no precomputable, lento.' },
        { t: 'Context recall', d: 'Si el fragmento con la respuesta correcta fue recuperado. Acota el techo de calidad del sistema.' },
        { t: 'Faithfulness', d: 'Qué proporción de la respuesta está sustentada por el contexto recuperado.' },
        { t: 'Grounding', d: 'Anclar la respuesta en fuentes concretas y verificables.' },
        { t: 'Abstención', d: 'Que el sistema declare que no tiene la información en vez de inventar.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Ingestión: extraer y partir en fragmentos',
      minutos: 10,
      fuentes: ['anthropic-contextual', 'llamaindex'],

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el <b>chunking</b> es cortar tus documentos en
pedazos. Suena trivial y es <b>la decisión que más determina si tu RAG va a funcionar</b>.</div>

<h4>¿Por qué hay que cortar?</h4>
<p>Por dos razones. Primero, no podés meter un manual de 300 páginas en el prompt. Segundo, y más importante:
un embedding de un documento entero <b>no representa nada</b>. Es el promedio de todos sus temas, así que queda
en un punto medio que no está cerca de ninguna pregunta concreta.</p>

<h4>El dilema del tamaño</h4>
<table>
<tr><th>Fragmentos chicos (~200 palabras)</th><th>Fragmentos grandes (~1.000 palabras)</th></tr>
<tr><td>✓ Muy precisos: el vector representa una idea</td><td>✓ Contexto completo, se entiende solo</td></tr>
<tr><td>✗ Les falta contexto: "el plazo es de 30 días" ¿de qué?</td><td>✗ El vector promedia varios temas y pierde precisión</td></tr>
<tr><td>✗ La respuesta puede quedar partida en dos</td><td>✗ Más tokens, más caro, más ruido</td></tr>
</table>

<p><b>El punto de partida razonable: 300-600 palabras con 50-100 de solapamiento.</b> El solapamiento —repetir
el final de un fragmento al principio del siguiente— evita que una idea que cae justo en el corte quede
partida al medio y no se encuentre nunca.</p>

<h4>Cortar por estructura, no por cantidad</h4>
<p>Acá está la diferencia entre un RAG mediocre y uno bueno. Comparar:</p>

<p><b>❌ Cortar cada 500 caracteres.</b> Parte oraciones al medio, mezcla el final de una sección con el
principio de otra, corta tablas.</p>

<p><b>✅ Cortar por estructura.</b> Respetar títulos, párrafos y secciones. Un fragmento = una idea completa.
Si una sección es muy larga, recién ahí se parte por párrafos.</p>

<div class="aviso"><strong>El truco que más mejora un RAG y cuesta diez líneas:</strong> pegarle a cada
fragmento su <b>contexto de ubicación</b> antes de vectorizarlo.<br><br>
En vez de indexar <i>"El plazo es de 30 días corridos."</i>, indexás:<br>
<i>"[Manual del empleado &gt; Vacaciones &gt; Solicitud] El plazo es de 30 días corridos."</i><br><br>
Ahora el fragmento se explica solo, y una pregunta sobre vacaciones lo encuentra. <b>Sin eso, ese fragmento es
casi irrecuperable.</b></div>
`,

      tecnico: `
<h4>Extracción: donde se pierden más proyectos de lo que se cree</h4>
<table>
<tr><th>Formato</th><th>Dificultad</th><th>Qué se rompe</th></tr>
<tr><td>Markdown, texto</td><td>Trivial</td><td>Nada</td></tr>
<tr><td>HTML</td><td>Baja</td><td>Menús y pies repetidos que ensucian todos los fragmentos</td></tr>
<tr><td>DOCX</td><td>Media</td><td>Tablas, notas al pie, control de cambios</td></tr>
<tr><td>PDF digital</td><td><b>Alta</b></td><td>Orden de lectura en dos columnas, tablas, encabezados</td></tr>
<tr><td>PDF escaneado</td><td><b>Muy alta</b></td><td>Todo: necesita OCR o un modelo multimodal</td></tr>
</table>

<div class="dato"><strong>El PDF es el enemigo.</strong> No guarda estructura: guarda glifos con coordenadas.
Una extracción ingenua de un PDF a dos columnas lee <b>una línea de la izquierda, una de la derecha</b>, y
produce texto sin sentido que se indexa igual sin que nada falle. Para documentos complejos conviene un modelo
multimodal que "vea" la página, o herramientas de layout dedicadas. <b>Antes de culpar al retrieval,
imprimí el texto extraído y leelo.</b> Es el primer diagnóstico y casi nadie lo hace.</div>

<h4>Estrategias de chunking</h4>
<table>
<tr><th>Estrategia</th><th>Cómo</th><th>Cuándo</th></tr>
<tr><td><b>Tamaño fijo</b></td><td>N caracteres con solapamiento</td><td>Solo como base de comparación. Rompe oraciones</td></tr>
<tr><td><b>Recursivo</b></td><td>Parte por secciones → párrafos → oraciones hasta entrar en el tamaño</td><td>El default razonable</td></tr>
<tr><td><b>Por estructura</b></td><td>Respeta encabezados Markdown, secciones, artículos</td><td><b>El mejor</b> con documentos estructurados</td></tr>
<tr><td><b>Semántico</b></td><td>Corta donde cambia el tema, medido por embeddings de oraciones consecutivas</td><td>Texto sin estructura. Caro de ingestar</td></tr>
<tr><td><b>Por proposición</b></td><td>Un LLM reescribe el texto en afirmaciones autónomas</td><td>Máxima precisión, costo de ingestión alto</td></tr>
</table>

<h4>Contextual retrieval</h4>
<p>La técnica de mayor impacto reportada en los últimos años: antes de vectorizar, un LLM chico genera para
cada fragmento una o dos oraciones que lo sitúan dentro del documento completo, y se anteponen al texto.</p>
<pre><code>Fragmento crudo:
  "El plazo es de 30 días corridos."

Fragmento contextualizado (lo que se indexa):
  "Este fragmento pertenece al Manual del Empleado 2026, sección Vacaciones,
   y describe el plazo de anticipación para solicitarlas.
   El plazo es de 30 días corridos."</code></pre>
<p>Reduce mucho las fallas de recuperación. El costo es una llamada por fragmento en la ingestión —mitigable con
prompt caching sobre el documento completo— y se paga una sola vez.</p>

<h4>Desacoplar lo que se busca de lo que se envía</h4>
<p>No tienen por qué ser lo mismo, y esto resuelve el dilema del tamaño de raíz:</p>
<ul>
<li><b>Small-to-big</b> — indexás fragmentos chicos y precisos, pero al recuperar mandás al prompt el fragmento <b>padre</b>, más grande. Precisión de búsqueda con contexto de lectura.</li>
<li><b>Índice de resúmenes</b> — buscás sobre resúmenes y mandás el original.</li>
<li><b>Preguntas hipotéticas</b> — indexás preguntas que ese fragmento respondería. Ataca de raíz el problema pregunta↔pregunta.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="#f87171" font-size="12" font-weight="700">✗ CORTAR CADA 500 CARACTERES</text>

  <rect x="24" y="34" width="200" height="70" rx="8" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="38" y="54" fill="currentColor" opacity=".75" font-size="10">…de la sección anterior.</text>
  <text x="38" y="70" fill="currentColor" opacity=".75" font-size="10">VACACIONES. Todo empleado</text>
  <text x="38" y="86" fill="currentColor" opacity=".75" font-size="10">con más de un año podrá sol‑</text>
  <text x="38" y="99" fill="#f87171" font-size="9.5" font-weight="700">← corta una palabra al medio</text>

  <rect x="234" y="34" width="200" height="70" rx="8" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="248" y="54" fill="currentColor" opacity=".75" font-size="10">icitar licencia. El plazo es</text>
  <text x="248" y="70" fill="currentColor" opacity=".75" font-size="10">de 30 días corridos.</text>
  <text x="248" y="86" fill="currentColor" opacity=".75" font-size="10">REEMBOLSOS. Los gastos…</text>
  <text x="248" y="99" fill="#f87171" font-size="9.5" font-weight="700">← dos temas mezclados</text>

  <text x="446" y="60" fill="#f87171" font-size="11" font-weight="700">“¿de qué plazo</text>
  <text x="446" y="76" fill="#f87171" font-size="11" font-weight="700">habla esto?”</text>
  <text x="446" y="96" fill="currentColor" opacity=".5" font-size="10">irrecuperable</text>

  <line x1="24" y1="124" x2="656" y2="124" stroke="currentColor" opacity=".18"/>

  <text x="24" y="150" fill="#34d399" font-size="12" font-weight="700">✓ CORTAR POR ESTRUCTURA + CONTEXTO</text>

  <rect x="24" y="160" width="304" height="96" rx="8" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.3"/>
  <rect x="34" y="170" width="284" height="30" rx="5" fill="#7c5cff" fill-opacity=".25"/>
  <text x="46" y="189" fill="#7c5cff" font-size="10" font-weight="700">[Manual 2026 &gt; Vacaciones &gt; Solicitud]</text>
  <text x="38" y="220" fill="currentColor" opacity=".8" font-size="10.5">Todo empleado con más de un año</text>
  <text x="38" y="236" fill="currentColor" opacity=".8" font-size="10.5">podrá solicitar licencia. El plazo es</text>
  <text x="38" y="250" fill="currentColor" opacity=".8" font-size="10.5">de 30 días corridos.</text>

  <rect x="338" y="160" width="304" height="96" rx="8" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.3"/>
  <rect x="348" y="170" width="284" height="30" rx="5" fill="#7c5cff" fill-opacity=".25"/>
  <text x="360" y="189" fill="#7c5cff" font-size="10" font-weight="700">[Manual 2026 &gt; Reembolsos]</text>
  <text x="352" y="220" fill="currentColor" opacity=".8" font-size="10.5">Los gastos de viaje se reintegran</text>
  <text x="352" y="236" fill="currentColor" opacity=".8" font-size="10.5">contra presentación de comprobante</text>
  <text x="352" y="250" fill="currentColor" opacity=".8" font-size="10.5">dentro de los 60 días.</text>

  <text x="24" y="280" fill="#34d399" font-size="11" font-weight="700">
    Cada fragmento = una idea completa, y se explica solo.</text>
  <text x="24" y="298" fill="currentColor" opacity=".6" font-size="11">
    El encabezado violeta se agrega ANTES de vectorizar: es lo que lo hace encontrable.</text>

  <rect x="24" y="318" width="632" height="86" rx="10" fill="#fbbf24" fill-opacity=".09" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="342" fill="#fbbf24" font-size="12.5" font-weight="700">EL DILEMA DEL TAMAÑO, Y CÓMO SE ESQUIVA</text>
  <text x="44" y="364" fill="currentColor" opacity=".75" font-size="11.5">
    Chico = preciso pero sin contexto.  ·  Grande = con contexto pero impreciso.</text>
  <text x="44" y="386" fill="currentColor" opacity=".75" font-size="11.5">
    <tspan font-weight="700">Small-to-big:</tspan> indexás el fragmento chico para buscar, y mandás al prompt el padre grande. Las dos cosas.</text>
</svg>`,
        pie: 'El chunking es la decisión de ingeniería que más determina la calidad de un RAG.',
      },

      entrevista: [
        { p: '¿Cómo elegís la estrategia de chunking?',
          r: 'Primero miro si el documento <b>tiene estructura</b>. Si la tiene —encabezados, secciones, artículos— corto por ahí, porque una sección ' +
             'suele ser una idea completa. Si no la tiene, uso chunking recursivo: parto por párrafos y después por oraciones hasta entrar en el ' +
             'tamaño objetivo, que arranco en 300-600 palabras con 50-100 de solapamiento. Y en todos los casos <b>antepongo el contexto de ubicación</b> ' +
             'al texto antes de vectorizar, porque un fragmento que no se explica solo es casi irrecuperable. Después ajusto midiendo recall, no a ojo.' },

        { p: '¿Para qué sirve el solapamiento entre fragmentos?',
          r: 'Para que una idea que cae justo en el punto de corte no quede partida entre dos fragmentos y no se encuentre en ninguno. ' +
             'Si el corte pasa por el medio de una definición, ningún fragmento la contiene entera y el retrieval falla. ' +
             'Con 50-100 palabras de solapamiento el final de cada fragmento se repite al principio del siguiente. El costo es un poco de ' +
             'almacenamiento duplicado, que es barato comparado con perder la respuesta.' },

        { p: '¿Qué es contextual retrieval?',
          r: 'Es usar un LLM chico durante la ingestión para generar, por cada fragmento, una o dos oraciones que lo sitúan dentro del documento ' +
             'completo, y anteponerlas al texto antes de vectorizar. Un fragmento como "el plazo es de 30 días" pasa a decir de qué plazo habla y ' +
             'a qué sección pertenece. <b>Reduce mucho las fallas de recuperación</b> y el costo se paga una sola vez en la ingestión — ' +
             'además es mitigable con prompt caching sobre el documento completo.' },

        { p: 'Tu RAG funciona mal con PDFs. ¿Qué revisás primero?',
          r: '<b>El texto extraído, leyéndolo.</b> Es lo primero y casi nadie lo hace. El PDF no guarda estructura, guarda glifos con coordenadas: ' +
             'una extracción ingenua de un documento a dos columnas lee una línea de la izquierda y una de la derecha, produciendo texto sin sentido ' +
             'que se indexa igual sin que nada falle. Si el texto está roto, no hay chunking, embedding ni re-ranking que lo arregle. ' +
             'Para documentos complejos uso un modelo multimodal que vea la página o una herramienta de análisis de layout.' },
      ],

      practica: `
<h4>Chunking por estructura, con contexto</h4>
<pre><code>function chunkear(documento, { objetivo = 500, solape = 80 }) {
  const secciones = partirPorEncabezados(documento);   // respeta la jerarquía
  const fragmentos = [];

  for (const sec of secciones) {
    const ruta = sec.jerarquia.join(' &gt; ');             // "Manual &gt; Vacaciones &gt; Solicitud"

    if (contarPalabras(sec.texto) &lt;= objetivo) {
      fragmentos.push({ texto: sec.texto, ruta, seccion: sec.titulo });
      continue;
    }
    // Sección larga: se parte por párrafos, con solapamiento
    for (const parte of partirPorParrafos(sec.texto, objetivo, solape)) {
      fragmentos.push({ texto: parte, ruta, seccion: sec.titulo });
    }
  }

  // Lo que se VECTORIZA lleva el contexto; lo que se GUARDA, el texto limpio.
  return fragmentos.map(f =&gt; ({
    ...f,
    paraIndexar: \`[\${f.ruta}]\\n\${f.texto}\`,
  }));
}</code></pre>

<div class="aviso"><strong>Esa última línea es la clave.</strong> El campo <code>paraIndexar</code> —con el
encabezado de ubicación— es lo que se convierte en embedding. El campo <code>texto</code> —limpio— es lo que se
manda al prompt. <b>Buscar y leer no tienen por qué usar la misma versión del fragmento.</b></div>

<h4>Small-to-big: precisión al buscar, contexto al leer</h4>
<pre><code>// Indexás fragmentos chicos (precisos) pero guardás a qué padre pertenecen
{ id: 'frag-042', contenido: 'El plazo es de 30 días corridos.',
  padre_id: 'sec-vacaciones', embedding: [...] }

// Al recuperar, devolvés el PADRE completo
const encontrados = await buscarHibrido(consulta, { limite: 50 });
const padres = [...new Set(encontrados.map(f =&gt; f.padre_id))];
const contexto = await traerSecciones(padres.slice(0, 5));</code></pre>
<p>Resuelve el dilema del tamaño sin negociar: buscás sobre lo preciso, leés sobre lo completo.</p>

<h4>Antes de dar por buena una ingestión</h4>
<table>
<tr><th>Verificá</th><th>Cómo</th></tr>
<tr><td>El texto extraído es legible</td><td><b>Imprimí 3 fragmentos al azar y leelos.</b> Es el diagnóstico n°1</td></tr>
<tr><td>No hay basura repetida</td><td>Buscá encabezados/pies que aparezcan en todos los fragmentos</td></tr>
<tr><td>Los fragmentos se explican solos</td><td>Leé uno fuera de contexto: ¿se entiende de qué habla?</td></tr>
<tr><td>Las tablas sobrevivieron</td><td>Buscá un fragmento con una tabla y mirá si conserva sentido</td></tr>
<tr><td>El tamaño es razonable</td><td>Histograma de palabras por fragmento: ojo con los de 20 y los de 3.000</td></tr>
</table>
`,

      errores: [
        { mito: 'El chunking es un detalle de implementación.',
          realidad: 'Es <b>la decisión que más determina la calidad</b> de un RAG. Un chunking malo hace que la respuesta correcta sea irrecuperable, ' +
                    'y después no importa qué modelo, qué re-ranker ni qué prompt uses. Es lo primero que ajustaría antes que cualquier otra cosa.' },

        { mito: 'Cortar cada N caracteres está bien para empezar.',
          realidad: 'Parte oraciones al medio, mezcla temas distintos en un fragmento y destroza tablas. Sirve solo como línea base de comparación. ' +
                    'El <b>chunking recursivo</b> —párrafos, después oraciones— cuesta lo mismo de implementar y es sustancialmente mejor.' },

        { mito: 'Lo que indexo tiene que ser lo mismo que le mando al modelo.',
          realidad: 'No tiene por qué. <b>Buscar y leer son dos problemas distintos.</b> Podés indexar el fragmento con su contexto de ubicación, ' +
                    'o indexar fragmentos chicos y mandar el padre completo (<i>small-to-big</i>), o indexar preguntas hipotéticas. ' +
                    'Desacoplarlos resuelve el dilema del tamaño de raíz.' },

        { mito: 'Los PDFs se procesan igual que cualquier otro documento.',
          realidad: 'El PDF no guarda estructura sino glifos con coordenadas. Un documento a dos columnas extraído de forma ingenua produce texto ' +
                    'sin sentido — y <b>se indexa igual, sin que nada falle</b>. Antes de tocar el retrieval, imprimí el texto extraído y leelo.' },
      ],

      glosario: [
        { t: 'Chunking', d: 'Partir documentos en fragmentos indexables. La decisión de mayor impacto de un RAG.' },
        { t: 'Solapamiento (overlap)', d: 'Repetir el final de un fragmento al principio del siguiente para no partir ideas.' },
        { t: 'Chunking recursivo', d: 'Partir por secciones, después párrafos y después oraciones hasta entrar en el tamaño objetivo.' },
        { t: 'Chunking semántico', d: 'Cortar donde cambia el tema, detectado comparando embeddings de oraciones consecutivas.' },
        { t: 'Contextual retrieval', d: 'Anteponer a cada fragmento una descripción generada de su lugar en el documento antes de vectorizar.' },
        { t: 'Small-to-big', d: 'Indexar fragmentos chicos para buscar y enviar el fragmento padre, más grande, al prompt.' },
        { t: 'Preguntas hipotéticas', d: 'Indexar preguntas que el fragmento respondería, en lugar del fragmento mismo.' },
        { t: 'OCR', d: 'Reconocimiento óptico de caracteres. Necesario en documentos escaneados.' },
        { t: 'Orden de lectura', d: 'La secuencia correcta del texto en un documento con columnas o layout complejo. Lo que más rompe en PDF.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Recuperación: búsqueda híbrida y re-ranking',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> primero <b>una red grande</b> que traiga muchos
candidatos plausibles, después <b>un experto</b> que los mire con atención y elija los mejores.</div>

<h4>Etapa 1 · La red grande</h4>
<p>Combinás dos búsquedas que se cubren mutuamente:</p>
<ul>
<li><b>Vectorial</b> — encuentra por significado. Resuelve que el usuario diga "dar de baja" y el documento diga "cancelar".</li>
<li><b>Por palabras clave (BM25)</b> — encuentra por coincidencia literal. Resuelve códigos, nombres propios y jerga interna.</li>
</ul>
<p>Cada una trae 50 candidatos y se fusionan. Traés de más a propósito: es barato y todavía no hay que
decidir.</p>

<h4>Etapa 2 · El experto</h4>
<p>Un <b>re-ranker</b> lee cada candidato <i>junto con</i> la pregunta y le pone un puntaje. Es lento —no puede
mirar millones— pero sobre 50 candidatos tarda unos cientos de milisegundos y es mucho más preciso.</p>

<p>Te quedás con los 3 a 8 mejores. Esos son los que van al prompt.</p>

<div class="aviso"><strong>Por qué esta separación no es opcional:</strong> la búsqueda vectorial comprime cada
texto en <b>un punto</b>, y ahí se pierde información. Por eso confunde "el envío es gratis" con "el envío no es
gratis". El re-ranker no comprime nada: lee el par completo. <b>Agregar re-ranking suele ser la mejora más
grande que le podés hacer a un RAG que ya funciona</b>, y son unas pocas líneas.</div>

<h4>Cómo se fusionan los dos rankings</h4>
<p>Un detalle que parece menor y no lo es: <b>no se pueden sumar los puntajes</b>. La similitud coseno va de 0
a 1 y el puntaje BM25 puede ser 3, 17 o 42 según el corpus. Sumarlos no significa nada.</p>
<p>Se usa <b>RRF</b>, que combina por <b>posición</b>: cuenta si un documento salió primero, segundo o décimo en
cada lista, no cuánto puntaje sacó. Un documento que sale segundo en las dos búsquedas le gana a uno que sale
primero en una sola y no aparece en la otra. Que es exactamente lo que querés.</p>
`,

      tecnico: `
<h4>La cascada de recuperación</h4>
<pre><code>corpus completo  (millones)
      │  búsqueda híbrida: vectorial + BM25, filtrada por tenant
      ▼
  ~50 candidatos
      │  re-ranking con cross-encoder
      ▼
   3-8 fragmentos  →  al prompt</code></pre>

<p>Cada etapa es más precisa y más cara por elemento que la anterior; por eso cada una procesa menos.</p>

<h4>Filtrado: antes o después</h4>
<table>
<tr><th></th><th>Pre-filtering</th><th>Post-filtering</th></tr>
<tr><td>Cuándo se aplica</td><td>Restringe el conjunto antes de buscar</td><td>Se busca en todo y se descarta después</td></tr>
<tr><td>Resultados</td><td>Siempre k del subconjunto correcto</td><td><b>Puede devolver menos de k</b></td></tr>
<tr><td>Rendimiento con índice ANN</td><td>Puede degradarse si el filtro es muy selectivo</td><td>Rápido pero incompleto</td></tr>
<tr><td>Multi-tenant</td><td><b>Obligatorio</b></td><td>Inaceptable: los datos ajenos ya salieron</td></tr>
</table>
<p>En pgvector, cuando el filtro es muy selectivo conviene subir <code>hnsw.ef_search</code> o usar índices
parciales.</p>

<h4>Re-rankers</h4>
<table>
<tr><th>Opción</th><th>Latencia (50 docs)</th><th>Nota</th></tr>
<tr><td>API dedicada (Cohere Rerank, Voyage)</td><td>100-300 ms</td><td>Lo más simple. Multilingüe</td></tr>
<tr><td>Cross-encoder local (bge-reranker…)</td><td>50-300 ms con GPU</td><td>Sin costo por llamada; hay que operarlo</td></tr>
<tr><td>LLM como juez</td><td>1-3 s</td><td>Muy preciso y muy caro. Solo si el volumen es bajo</td></tr>
</table>

<div class="dato"><strong>Diversidad: el problema de los cinco fragmentos idénticos.</strong> Si tu corpus tiene
una idea repetida en varios documentos, el top-5 puede ser <b>cinco versiones de lo mismo</b>, desperdiciando
todo el contexto. <b>MMR</b> (Maximal Marginal Relevance) penaliza los candidatos demasiado parecidos a los ya
seleccionados, equilibrando relevancia y variedad. Importa sobre todo en preguntas amplias del tipo "resumime
todo lo que hay sobre X".</div>

<h4>Qué top-k usar</h4>
<ul>
<li><b>Búsqueda inicial: 30-50.</b> Traer de más es barato y todavía no hay que decidir.</li>
<li><b>Después del re-ranking: 3-8.</b> Más que eso empeora por <i>lost in the middle</i> y encarece cada llamada.</li>
<li>Si el re-ranker le da a todos los candidatos un puntaje bajo, <b>eso es una señal</b>: probablemente el corpus no tiene la respuesta y conviene abstenerse en vez de mandar los cinco menos malos.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="k1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <rect x="180" y="18" width="320" height="40" rx="9" fill="currentColor" fill-opacity=".06" stroke="currentColor" stroke-opacity=".28" stroke-width="1.3"/>
  <text x="340" y="43" text-anchor="middle" fill="currentColor" opacity=".75" font-size="12" font-weight="700">corpus completo  ·  millones de fragmentos</text>

  <line x1="270" y1="58" x2="200" y2="86" stroke="currentColor" stroke-width="1.3" marker-end="url(#k1)"/>
  <line x1="410" y1="58" x2="480" y2="86" stroke="currentColor" stroke-width="1.3" marker-end="url(#k1)"/>

  <rect x="60" y="90" width="250" height="72" rx="10" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="185" y="114" text-anchor="middle" fill="#7c5cff" font-size="12.5" font-weight="700">BÚSQUEDA VECTORIAL</text>
  <text x="185" y="134" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11">encuentra por SIGNIFICADO</text>
  <text x="185" y="152" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10.5">“dar de baja” → “cancelar suscripción”</text>

  <rect x="370" y="90" width="250" height="72" rx="10" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="495" y="114" text-anchor="middle" fill="#22d3ee" font-size="12.5" font-weight="700">BM25  ·  palabras clave</text>
  <text x="495" y="134" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11">encuentra LITERALMENTE</text>
  <text x="495" y="152" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10.5">FA-2024-8871 · jerga interna</text>

  <line x1="185" y1="162" x2="300" y2="192" stroke="currentColor" stroke-width="1.3" marker-end="url(#k1)"/>
  <line x1="495" y1="162" x2="380" y2="192" stroke="currentColor" stroke-width="1.3" marker-end="url(#k1)"/>

  <rect x="200" y="196" width="280" height="44" rx="9" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="340" y="215" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">FUSIÓN por POSICIÓN  (RRF)</text>
  <text x="340" y="232" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10.5">sumar los puntajes no sirve: escalas incomparables</text>

  <line x1="340" y1="240" x2="340" y2="264" stroke="currentColor" stroke-width="1.3" marker-end="url(#k1)"/>

  <rect x="240" y="268" width="200" height="34" rx="8" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".3" stroke-width="1.3"/>
  <text x="340" y="290" text-anchor="middle" fill="currentColor" opacity=".8" font-size="12" font-weight="700">~50 candidatos</text>

  <line x1="340" y1="302" x2="340" y2="326" stroke="currentColor" stroke-width="1.3" marker-end="url(#k1)"/>

  <rect x="150" y="330" width="380" height="48" rx="10" fill="#34d399" fill-opacity=".18" stroke="#34d399" stroke-width="1.6"/>
  <text x="340" y="350" text-anchor="middle" fill="#34d399" font-size="12.5" font-weight="700">RE-RANKER  ·  cross-encoder</text>
  <text x="340" y="368" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">lee pregunta + documento JUNTOS · no comprime nada</text>

  <line x1="340" y1="378" x2="340" y2="396" stroke="currentColor" stroke-width="1.3" marker-end="url(#k1)"/>
  <text x="340" y="412" text-anchor="middle" fill="#34d399" font-size="12.5" font-weight="700">3-8 fragmentos  →  al prompt</text>

  <text x="556" y="354" fill="currentColor" opacity=".5" font-size="10.5">la mejora más</text>
  <text x="556" y="369" fill="currentColor" opacity=".5" font-size="10.5">grande por línea</text>
  <text x="556" y="384" fill="currentColor" opacity=".5" font-size="10.5">de código</text>
</svg>`,
        pie: 'Red grande primero, experto después. Cada etapa procesa menos y decide mejor.',
      },

      entrevista: [
        { p: '¿Qué es un re-ranker y por qué mejora tanto un RAG?',
          r: 'Es un <b>cross-encoder</b>: un modelo que procesa la consulta y el documento <i>juntos</i> y emite un puntaje de relevancia. ' +
             'La diferencia con los embeddings es que estos comprimen cada texto en un punto por separado y ahí se pierde información —por eso ' +
             'confunden afirmación con negación—, mientras que el re-ranker no comprime nada. No se puede usar para buscar en millones porque no ' +
             'es precomputable, pero sobre 50 candidatos tarda unos cientos de milisegundos. <b>Agregarlo suele ser la mejora más grande por línea ' +
             'de código en un RAG que ya funciona.</b>' },

        { p: '¿Por qué no se pueden sumar los puntajes de la búsqueda vectorial y la BM25?',
          r: 'Porque están en escalas incomparables: la similitud coseno va de 0 a 1, y el puntaje BM25 no tiene cota superior fija — depende del ' +
             'corpus, de la frecuencia de los términos y de la longitud de los documentos. Sumarlos produce un ranking arbitrario donde una de las dos ' +
             'búsquedas domina por accidente de escala. Por eso se usa <b>RRF</b>, que combina por <i>posición</i> en cada ranking: es indiferente a ' +
             'la escala y premia a los documentos que aparecen bien en ambas listas.' },

        { p: '¿Qué top-k usás?',
          r: 'Distinto en cada etapa. En la <b>búsqueda inicial, 30 a 50</b>: traer de más es barato, todavía no hay que decidir y le doy margen al ' +
             're-ranker. Después del <b>re-ranking, 3 a 8</b>: más que eso encarece cada llamada y empeora la respuesta por el <i>lost in the middle</i>. ' +
             'Y agrego una señal útil: si el re-ranker le da a todos los candidatos un puntaje bajo, probablemente el corpus no tiene la respuesta, ' +
             'y ahí conviene <b>abstenerse</b> en lugar de mandar los cinco menos malos.' },

        { p: '¿Qué es MMR y cuándo lo usarías?',
          r: '<i>Maximal Marginal Relevance</i>. Al seleccionar los fragmentos finales, penaliza los que son demasiado parecidos a los ya elegidos, ' +
             'equilibrando relevancia con diversidad. Resuelve un problema concreto: si una idea está repetida en varios documentos, el top-5 puede ' +
             'ser <b>cinco versiones de lo mismo</b>, desperdiciando todo el contexto disponible. Importa sobre todo en preguntas amplias del tipo ' +
             '"resumime todo lo que hay sobre X"; en preguntas puntuales aporta poco.' },
      ],

      practica: `
<h4>Recuperación completa</h4>
<pre><code>export async function recuperar(consulta, { tenantId, final = 5 }) {
  // 1 · red grande — las dos búsquedas en paralelo
  const [densos, lexicos] = await Promise.all([
    buscarVectorial(consulta, { tenantId, limite: 50 }),
    buscarBM25(consulta,      { tenantId, limite: 50 }),
  ]);

  // 2 · fusión por posición (RRF), nunca por puntaje
  const K = 60;
  const puntajes = new Map();
  const sumar = (lista) =&gt; lista.forEach((doc, i) =&gt; {
    puntajes.set(doc.id, (puntajes.get(doc.id) ?? 0) + 1 / (K + i + 1));
  });
  sumar(densos); sumar(lexicos);

  const candidatos = [...puntajes.entries()]
    .sort((a, b) =&gt; b[1] - a[1])
    .slice(0, 50)
    .map(([id]) =&gt; porId(id, densos, lexicos));

  if (!candidatos.length) return [];

  // 3 · el experto
  const rankeados = await reRankear(consulta, candidatos);

  // 4 · si nada supera el umbral, mejor abstenerse que responder con ruido
  const utiles = rankeados.filter(d =&gt; d.puntaje &gt; UMBRAL_RERANK);
  return utiles.slice(0, final);
}</code></pre>

<div class="aviso"><strong>El paso 4 es el que casi nadie implementa y el que más alucinaciones evita.</strong>
Si el re-ranker considera que ningún candidato es relevante, mandar igual los cinco menos malos <b>garantiza</b>
una respuesta inventada con apariencia de fundamentada. Devolver vacío y decir "no tengo esa información" es
la respuesta correcta.</div>

<h4>Diversidad con MMR</h4>
<pre><code>function mmr(candidatos, embConsulta, { k = 5, lambda = 0.7 }) {
  const elegidos = [];
  const restantes = [...candidatos];

  while (elegidos.length &lt; k &amp;&amp; restantes.length) {
    let mejor = null, mejorPuntaje = -Infinity;
    for (const c of restantes) {
      const relevancia = coseno(c.embedding, embConsulta);
      const redundancia = elegidos.length
        ? Math.max(...elegidos.map(e =&gt; coseno(c.embedding, e.embedding)))
        : 0;
      // lambda alto = prioriza relevancia · lambda bajo = prioriza variedad
      const p = lambda * relevancia - (1 - lambda) * redundancia;
      if (p &gt; mejorPuntaje) { mejorPuntaje = p; mejor = c; }
    }
    elegidos.push(mejor);
    restantes.splice(restantes.indexOf(mejor), 1);
  }
  return elegidos;
}</code></pre>

<h4>Orden de aplicación de las mejoras</h4>
<table>
<tr><th>#</th><th>Mejora</th><th>Impacto</th><th>Esfuerzo</th></tr>
<tr><td>1</td><td>Agregar re-ranking</td><td><b>Muy alto</b></td><td>Bajo</td></tr>
<tr><td>2</td><td>Contexto de ubicación en el chunk</td><td>Muy alto</td><td>Bajo</td></tr>
<tr><td>3</td><td>Búsqueda híbrida (sumar BM25)</td><td>Alto</td><td>Medio</td></tr>
<tr><td>4</td><td>Descontextualizar la consulta en chats</td><td>Alto</td><td>Bajo</td></tr>
<tr><td>5</td><td>Abstención por umbral</td><td>Alto en confiabilidad</td><td>Muy bajo</td></tr>
<tr><td>6</td><td>Ajustar el chunking</td><td>Variable</td><td>Alto: hay que reindexar</td></tr>
</table>
`,

      errores: [
        { mito: 'Con la búsqueda vectorial alcanza.',
          realidad: 'Falla en negaciones, en códigos exactos y en jerga interna, porque comprime cada texto en un punto. ' +
                    'La <b>búsqueda híbrida</b> cubre esos huecos con BM25, y el <b>re-ranking</b> corrige los errores de ordenamiento. ' +
                    'Un RAG solo vectorial es un prototipo.' },

        { mito: 'Sumo el puntaje de coseno y el de BM25 y ordeno.',
          realidad: 'Están en escalas incomparables: el coseno va de 0 a 1 y BM25 no tiene cota fija. Sumarlos produce un ranking donde una de las ' +
                    'dos búsquedas domina por accidente de escala. <b>RRF combina por posición</b>, que es indiferente a la escala.' },

        { mito: 'Recupero directamente los 5 mejores y listo.',
          realidad: 'Te dejás sin margen. La búsqueda vectorial es un filtro grueso: lo estándar es traer 30-50 candidatos y dejar que el re-ranker ' +
                    '—mucho más preciso— elija los 5 finales. <b>Recuperar 5 de entrada equivale a confiar en el filtro grueso.</b>' },

        { mito: 'Si el retrieval devuelve algo, se lo mando al modelo.',
          realidad: 'Si el re-ranker le pone puntaje bajo a todos los candidatos, mandarlos igual <b>garantiza</b> una respuesta inventada con ' +
                    'apariencia de fundamentada. Un umbral de abstención son tres líneas y evita una clase entera de alucinaciones.' },
      ],

      glosario: [
        { t: 'Búsqueda híbrida', d: 'Combinación de búsqueda vectorial y por palabras clave.' },
        { t: 'RRF', d: 'Reciprocal Rank Fusion. Combina rankings por posición, no por puntaje.' },
        { t: 'Re-ranker', d: 'Cross-encoder que reordena candidatos leyendo el par consulta-documento completo.' },
        { t: 'Pre-filtering', d: 'Aplicar los filtros de metadatos antes de la búsqueda vectorial. Obligatorio en multi-tenant.' },
        { t: 'MMR', d: 'Maximal Marginal Relevance. Equilibra relevancia y diversidad al seleccionar los fragmentos finales.' },
        { t: 'Umbral de abstención', d: 'Puntaje mínimo por debajo del cual el sistema declara que no tiene la información.' },
        { t: 'Cascada de recuperación', d: 'Etapas sucesivas cada vez más precisas y más caras sobre conjuntos cada vez más chicos.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Generación: fundamentar, citar y saber callarse',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> ya tenés los fragmentos correctos. Ahora hay que
lograr que el modelo <b>responda con eso y solo con eso</b>, diga de dónde lo sacó, y admita cuando no está.</div>

<h4>Las tres reglas del prompt de RAG</h4>

<p><b>1 · Solo con el contexto provisto.</b> Hay que decirlo explícitamente. Si no, el modelo mezcla lo que
recuperaste con su conocimiento general, y el resultado es una respuesta donde no podés distinguir qué parte
está fundamentada.</p>

<p><b>2 · Darle una salida para el "no sé".</b> Y darle la frase exacta. Sin una salida concreta, el modelo
prefiere inventar antes que no responder — porque siempre hay un token más probable.</p>

<p><b>3 · Exigir citas verificables.</b> Que marque de qué fragmento salió cada afirmación, con un
identificador que vos puedas comprobar por código.</p>

<h4>Por qué las citas cambian todo</h4>
<p>No son un adorno de interfaz. Son tres cosas a la vez:</p>
<ul>
<li><b>Confianza del usuario</b> — puede verificar en la fuente.</li>
<li><b>Una métrica automática</b> — contás las citas inventadas, sin que nadie lea las respuestas.</li>
<li><b>Una presión sobre el modelo</b> — tener que citar lo empuja a fundamentarse en el texto en vez de responder de memoria.</li>
</ul>

<div class="aviso"><strong>Y lo más importante: las citas se verifican por código.</strong> Extraés los
identificadores citados y comprobás que existan entre los fragmentos recuperados. Si el modelo cita un
<code>doc-17</code> que nunca le mandaste, tenés una <b>señal dura</b> de alucinación —automática, sin humano en
el medio, medible en producción.</div>

<h4>El orden del prompt</h4>
<pre><code>1. Instrucciones y reglas       ← fijo, cacheable
2. Fragmentos con su ID
3. La pregunta                  ← al final: es lo más importante
4. Recordatorio de las reglas críticas   ← porque compiten con el contexto</code></pre>
<p>Ese punto 4 sorprende, pero con contextos largos las instrucciones del principio pierden fuerza frente a
miles de tokens de contenido. Repetir las dos o tres reglas críticas cerca del final funciona.</p>
`,

      tecnico: `
<h4>Un prompt de RAG que aguanta producción</h4>
<pre><code>Respondé la pregunta usando ÚNICAMENTE los fragmentos provistos.

Reglas:
1. No uses conocimiento propio para completar lo que falte.
2. Si los fragmentos no contienen la respuesta, respondé exactamente:
   "No encuentro esa información en los documentos disponibles."
3. Citá el ID del fragmento tras cada afirmación: [doc-3]
4. Si dos fragmentos se contradicen, señalá la contradicción en lugar
   de elegir uno.
5. Si la respuesta es parcial, indicá qué parte no está cubierta.

FRAGMENTOS:
[doc-1] (Manual 2026 &gt; Vacaciones) Todo empleado con más de un año...
[doc-2] (Política de Licencias) El plazo de anticipación es de 30 días...

PREGUNTA: {pregunta}

Recordá: solo los fragmentos, siempre con cita, y si no está, decilo.</code></pre>

<p>Las reglas 4 y 5 son las que separan un prompt copiado de uno pensado. Los documentos reales <b>se
contradicen</b> —versiones distintas, políticas que cambiaron— y las respuestas reales suelen ser parciales.
Si no contemplás esos casos, el modelo elige uno en silencio.</p>

<h4>Formatos de citación</h4>
<table>
<tr><th>Formato</th><th>Ventaja</th><th>Desventaja</th></tr>
<tr><td>Marcadores en línea <code>[doc-3]</code></td><td>Simple, verificable con una expresión regular</td><td>Ensucia el texto si hay muchas</td></tr>
<tr><td>Salida estructurada con <code>afirmaciones[]</code></td><td>Cada afirmación con su fuente. Máxima verificabilidad</td><td>Menos natural de leer; hay que reensamblar</td></tr>
<tr><td>Citas al final</td><td>Texto limpio</td><td>No se sabe qué frase salió de dónde</td></tr>
</table>
<p>Para uso interno y auditoría, la salida estructurada. Para cara al usuario, marcadores en línea que la
interfaz convierte en enlaces.</p>

<div class="dato"><strong>Verificación de fundamentación (<i>grounding check</i>):</strong> un paso más allá de
verificar que la cita exista es verificar que el fragmento citado <b>efectivamente respalde</b> la afirmación.
Se hace con una segunda llamada barata a un modelo chico: "¿esta afirmación se deduce de este fragmento? sí/no".
Duplica el costo, así que se reserva para dominios sensibles —legal, salud, financiero— o se aplica por muestreo
para monitorear la tasa en producción.</div>

<h4>Manejo de contradicciones</h4>
<p>Es un caso real y frecuente que casi ningún tutorial menciona. Estrategias:</p>
<ul>
<li><b>Preferir por metadatos</b> — el documento más reciente gana. Requiere fechas confiables en la ingestión.</li>
<li><b>Explicitar</b> — que el modelo señale ambas versiones y su fuente. Es lo más honesto.</li>
<li><b>Escalar</b> — marcar el caso para revisión humana. En dominios sensibles, la única opción defendible.</li>
</ul>
<p>Lo que <b>no</b> se debe hacer es dejar que el modelo elija en silencio: el usuario recibe una afirmación
categórica sobre algo que en tu corpus está en disputa.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    ESTRUCTURA DEL PROMPT DE RAG</text>

  <rect x="24" y="36" width="632" height="42" rx="9" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="44" y="54" fill="#7c5cff" font-size="12" font-weight="700">1 · REGLAS</text>
  <text x="160" y="54" fill="currentColor" opacity=".75" font-size="11">solo el contexto · frase exacta para el “no sé” · citar · señalar contradicciones</text>
  <text x="160" y="70" fill="currentColor" opacity=".45" font-size="10.5">fijo entre llamadas → cacheable</text>

  <rect x="24" y="86" width="632" height="66" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="44" y="106" fill="#34d399" font-size="12" font-weight="700">2 · FRAGMENTOS, cada uno con su ID</text>
  <text x="44" y="126" fill="currentColor" opacity=".75" font-size="10.5" font-family="monospace">[doc-1] (Manual 2026 &gt; Vacaciones)  Todo empleado con más de un año…</text>
  <text x="44" y="144" fill="currentColor" opacity=".75" font-size="10.5" font-family="monospace">[doc-2] (Política de Licencias)      El plazo de anticipación es de 30 días…</text>

  <rect x="24" y="160" width="632" height="36" rx="9" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="44" y="183" fill="#22d3ee" font-size="12" font-weight="700">3 · LA PREGUNTA</text>
  <text x="200" y="183" fill="currentColor" opacity=".6" font-size="11">al final: es lo más importante y la atención favorece los extremos</text>

  <rect x="24" y="204" width="632" height="36" rx="9" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="44" y="227" fill="#fbbf24" font-size="12" font-weight="700">4 · RECORDATORIO</text>
  <text x="200" y="227" fill="currentColor" opacity=".6" font-size="11">con contexto largo, las reglas del principio pierden fuerza</text>

  <line x1="24" y1="262" x2="656" y2="262" stroke="currentColor" opacity=".18"/>

  <text x="24" y="288" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA CITA NO ES UN ADORNO: ES UNA MÉTRICA</text>

  <rect x="24" y="300" width="200" height="86" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.3"/>
  <text x="124" y="324" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">CONFIANZA</text>
  <text x="124" y="346" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10.5">el usuario puede</text>
  <text x="124" y="362" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10.5">ir a la fuente</text>

  <rect x="240" y="300" width="200" height="86" rx="10" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="340" y="324" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">MÉTRICA AUTOMÁTICA</text>
  <text x="340" y="346" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10.5">¿el ID citado existe?</text>
  <text x="340" y="362" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10.5">se verifica por código</text>
  <text x="340" y="378" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">señal dura de alucinación</text>

  <rect x="456" y="300" width="200" height="86" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="556" y="324" text-anchor="middle" fill="#7c5cff" font-size="11.5" font-weight="700">PRESIÓN AL MODELO</text>
  <text x="556" y="346" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10.5">tener que citar lo obliga</text>
  <text x="556" y="362" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10.5">a apoyarse en el texto</text>
</svg>`,
        pie: 'Las citas hacen tres trabajos a la vez, y el del medio es el que te deja medir en producción.',
      },

      entrevista: [
        { p: '¿Cómo evitás que el modelo mezcle el contexto recuperado con su conocimiento general?',
          r: 'Con tres cosas en el prompt, y las tres hacen falta. <b>Instrucción explícita</b> de responder solo con los fragmentos provistos. ' +
             '<b>Una salida concreta para el "no sé"</b>, con la frase exacta — sin eso el modelo prefiere inventar, porque siempre hay un token más ' +
             'probable. Y <b>citas obligatorias</b> con identificador de fragmento. Esa última es la más potente porque no depende de que obedezca: ' +
             '<b>puedo verificar por código</b> que los IDs citados existan entre los que le mandé.' },

        { p: '¿Cómo detectás alucinaciones en producción sin que un humano lea las respuestas?',
          r: 'La señal más barata y más dura son las <b>citas inventadas</b>: extraigo los identificadores con una expresión regular y verifico que ' +
             'existan entre los fragmentos recuperados. Si cita un doc-17 que nunca le mandé, es alucinación confirmada, sin ambigüedad. ' +
             'Una capa más arriba está el <b>grounding check</b>: una segunda llamada a un modelo chico preguntando si la afirmación se deduce del ' +
             'fragmento citado. Como duplica el costo, lo aplico por muestreo para monitorear la tasa, o al 100% solo en dominios sensibles.' },

        { p: '¿Qué hacés cuando dos documentos recuperados se contradicen?',
          r: 'Lo peor es dejar que el modelo elija en silencio, porque el usuario recibe una afirmación categórica sobre algo que en el corpus está ' +
             'en disputa. Según el dominio: <b>preferir por metadatos</b> —el documento más reciente gana, si tengo fechas confiables—, ' +
             '<b>explicitar la contradicción</b> mostrando ambas versiones con su fuente, que es lo más honesto y suele ser lo correcto, ' +
             'o <b>escalar a revisión humana</b> en dominios sensibles. Lo que sí es innegociable es que la regla esté en el prompt: ' +
             'si no la ponés, el modelo elige uno y no te enterás.' },
      ],

      practica: `
<h4>Verificación de citas</h4>
<pre><code>function verificarCitas(respuesta, fragmentos) {
  const citados = [...respuesta.matchAll(/\\[(doc-\\d+)\\]/g)].map(m =&gt; m[1]);
  const validos = new Set(fragmentos.map(f =&gt; f.id));

  const inventadas = [...new Set(citados)].filter(c =&gt; !validos.has(c));
  const abstuvo = respuesta.includes('No encuentro esa información');

  return {
    ok: inventadas.length === 0,
    inventadas,
    sinCitar: citados.length === 0 &amp;&amp; !abstuvo,   // afirma sin fundamentar
    cobertura: new Set(citados).size / fragmentos.length,
  };
}</code></pre>
<p>Los tres indicadores sirven para cosas distintas: <code>inventadas</code> es alucinación confirmada,
<code>sinCitar</code> detecta respuestas que afirman sin fundamento, y <code>cobertura</code> muy baja sugiere
que estás mandando más fragmentos de los necesarios.</p>

<h4>Salida estructurada con fundamentación</h4>
<pre><code>{
  "respuesta": "El plazo de anticipación es de 30 días corridos.",
  "afirmaciones": [
    { "texto": "El plazo de anticipación es de 30 días corridos.",
      "fuentes": ["doc-2"] }
  ],
  "cobertura": "completa",          // completa | parcial | sin_informacion
  "contradicciones": []
}</code></pre>
<p>Con este formato podés verificar afirmación por afirmación, mostrar en la interfaz qué parte tiene respaldo,
y alertar automáticamente cuando <code>cobertura</code> sea <code>parcial</code> — que es información valiosísima
sobre huecos en tu corpus.</p>

<div class="aviso"><strong>Ese campo <code>cobertura</code> vale oro y casi nadie lo pide.</strong> Un tablero
con el porcentaje de respuestas <code>parcial</code> o <code>sin_informacion</code> por tema te dice
<b>exactamente qué documentación te falta</b>. Es la forma más barata de saber qué escribir después: te lo
dicen tus propios usuarios sin tener que preguntarles.</div>

<h4>Streaming con citas: el orden importa</h4>
<pre><code>// ❌ Citas al final: no podés verificar hasta que termine,
//    y si estaban mal ya se las mostraste al usuario.

// ✅ Citas en línea: verificás al cerrar el stream y marcás
//    la respuesta si hay IDs inventados.
for await (const chunk of stream) {
  emitir(chunk);
  acumulado += chunk;
}
const check = verificarCitas(acumulado, fragmentos);
if (!check.ok) registrarAlucinacion(check, { consulta, fragmentos });</code></pre>
`,

      errores: [
        { mito: 'Con poner "usá solo el contexto" alcanza.',
          realidad: 'Ayuda, pero sin una <b>salida explícita para el "no sé"</b> el modelo igual completa los huecos: siempre hay un token más ' +
                    'probable que los demás. Hay que darle la frase exacta con la que abstenerse, y exigir citas que puedas verificar por código.' },

        { mito: 'Las citas son una función de la interfaz.',
          realidad: 'Son un <b>mecanismo de verificación</b>. Comprobar que los IDs citados existan entre los fragmentos enviados te da detección ' +
                    'automática de alucinaciones en producción, sin que nadie lea nada. Eso es infraestructura de calidad, no decoración.' },

        { mito: 'Si el modelo cita bien, la respuesta es correcta.',
          realidad: 'Que la cita <b>exista</b> no significa que el fragmento <b>respalde</b> la afirmación. Puede citar el doc-3 y decir algo que ' +
                    'el doc-3 no dice. Verificar eso requiere un <b>grounding check</b> —una segunda llamada barata— que se aplica al 100% en dominios ' +
                    'sensibles y por muestreo en el resto.' },

        { mito: 'Si los documentos se contradicen, que el modelo elija el mejor.',
          realidad: 'Va a elegir uno <b>en silencio</b> y el usuario recibe una afirmación categórica sobre algo que en tu corpus está en disputa. ' +
                    'La regla de señalar contradicciones tiene que estar escrita en el prompt; si no está, el problema existe y no te enterás.' },
      ],

      glosario: [
        { t: 'Grounding', d: 'Anclar cada afirmación en una fuente concreta del contexto recuperado.' },
        { t: 'Grounding check', d: 'Verificación de que el fragmento citado efectivamente respalde la afirmación.' },
        { t: 'Citación en línea', d: 'Marcadores como [doc-3] dentro del texto, verificables con una expresión regular.' },
        { t: 'Abstención', d: 'Declarar explícitamente que no hay información, en lugar de inventar.' },
        { t: 'Cobertura', d: 'Si la respuesta cubre la pregunta completa, parcialmente, o nada. Señala huecos en el corpus.' },
        { t: 'Contradicción', d: 'Fragmentos recuperados que afirman cosas incompatibles. Hay que preverlo en el prompt.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l5',
      titulo: 'Diagnóstico: dónde falla tu RAG',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> "el RAG anda mal" no es un diagnóstico. Hay
<b>cinco lugares</b> donde se puede romper, y cada uno se arregla de forma distinta. Saber cuál es te ahorra
semanas.</div>

<p>Este es el método. Se recorre <b>en este orden</b>, y en cada paso te preguntás una sola cosa:</p>

<h4>1 · ¿El texto extraído está bien?</h4>
<p><b>Cómo:</b> imprimí tres fragmentos al azar y leelos.<br>
<b>Si está roto</b> —texto mezclado, tablas destruidas, símbolos raros— no sigas. Nada de lo que hagas después
lo arregla. Es el problema n°1 con PDFs y el que menos gente revisa.</p>

<h4>2 · ¿El fragmento correcto está en la base?</h4>
<p><b>Cómo:</b> buscá a mano en la tabla el texto que debería responder.<br>
<b>Si no está</b>, es un problema de ingestión: el documento no se procesó, el chunking lo partió mal, o quedó
filtrado.</p>

<h4>3 · ¿La búsqueda lo encuentra?</h4>
<p><b>Cómo:</b> corré la consulta y mirá en qué posición aparece el fragmento correcto.<br>
<b>Si no aparece en el top-50</b>, es un problema de <b>retrieval</b>. Acá se resuelve el 70% de los casos:
falta contexto en el chunk, falta BM25, la consulta no se descontextualizó.</p>

<h4>4 · ¿El re-ranking lo deja pasar?</h4>
<p><b>Cómo:</b> si estaba en el top-50 pero no en los 5 finales.<br>
<b>Problema de ranking:</b> el re-ranker no es adecuado para tu dominio o idioma, o el umbral es muy alto.</p>

<h4>5 · ¿El modelo lo usa?</h4>
<p><b>Cómo:</b> si el fragmento correcto llegó al prompt y la respuesta igual está mal.<br>
<b>Recién acá</b> el problema es de generación: prompt ambiguo, contexto demasiado largo, o conflicto entre el
contexto y el conocimiento interno del modelo.</p>

<div class="aviso"><strong>El error que cuesta semanas:</strong> empezar por el paso 5. Se retoca el prompt una
y otra vez cuando el fragmento correcto <b>nunca entró</b>. Es la razón más frecuente de proyectos de RAG
estancados. <b>El orden del diagnóstico no es una sugerencia.</b></div>
`,

      tecnico: `
<h4>Tabla de diagnóstico</h4>
<table>
<tr><th>Síntoma</th><th>Etapa</th><th>Arreglo</th></tr>
<tr><td>Responde sobre otro tema</td><td>Retrieval</td><td>Contexto en el chunk, búsqueda híbrida, re-ranking</td></tr>
<tr><td>Dice que no encuentra algo que sí está</td><td>Retrieval</td><td>Subir <code>ef_search</code>, revisar filtros, medir recall</td></tr>
<tr><td>Mezcla información de varios clientes</td><td><b>Filtrado</b></td><td>Filtro en la consulta + RLS. <b>Crítico</b></td></tr>
<tr><td>Responde bien al primero, mal al segundo</td><td>Reescritura</td><td>Descontextualizar con el historial</td></tr>
<tr><td>Cita documentos inexistentes</td><td>Generación</td><td>Reforzar el prompt, bajar temperatura, verificar citas</td></tr>
<tr><td>Ignora el contexto y usa conocimiento propio</td><td>Generación</td><td>Instrucción explícita + recordatorio al final</td></tr>
<tr><td>La respuesta se corta</td><td>Configuración</td><td><code>max_tokens</code> y reserva de ventana</td></tr>
<tr><td>Anda bien con 100 docs y mal con 10.000</td><td>Índice</td><td>Medir recall@k; ajustar índice y parámetros</td></tr>
<tr><td>Devuelve cinco veces lo mismo</td><td>Diversidad</td><td>MMR o deduplicación por fuente</td></tr>
<tr><td>Texto extraído ilegible</td><td><b>Ingestión</b></td><td>Cambiar el extractor. Nada más lo arregla</td></tr>
</table>

<h4>Instrumentación mínima</h4>
<p>Sin esto el diagnóstico es adivinar. Por cada consulta hay que registrar:</p>
<pre><code>{
  consulta_original: '...',
  consulta_reescrita: '...',        // ¿la reescritura la arruinó?
  candidatos: [{ id, score_vector, score_bm25, score_rrf }],
  rankeados:  [{ id, score_rerank }],
  enviados_al_prompt: ['doc-3', 'doc-7'],
  tokens_contexto: 2840,
  citas_en_respuesta: ['doc-3'],
  citas_invalidas: [],
  se_abstuvo: false,
  latencia_por_etapa: { reescritura: 210, busqueda: 60, rerank: 180, generacion: 3200 },
}</code></pre>
<p>Con esa traza, cualquiera de los cinco diagnósticos se hace en minutos. Sin ella, cada uno lleva horas.</p>

<div class="dato"><strong>El conjunto de evaluación es lo que convierte esto en ingeniería.</strong>
30-50 preguntas reales con el identificador del fragmento que debería responderlas. Con eso medís
<b>context recall</b> —¿el correcto fue recuperado?— y <b>MRR</b> —¿en qué posición?— de forma automática.
Sin ese conjunto no podés saber si un cambio mejoró o solo movió el problema, y todo el ajuste es a ciegas.</div>

<h4>Rendimientos decrecientes</h4>
<p>Un RAG bien construido llega rápido a un techo. A partir de ahí, lo que suele faltar no es más técnica sino:</p>
<ul>
<li><b>Mejor documentación fuente.</b> Si la respuesta no está escrita en ningún lado, ningún RAG la va a encontrar. El campo <code>cobertura</code> de la lección anterior te dice exactamente qué falta.</li>
<li><b>Recortar el alcance.</b> Un sistema que responde bien el 90% de un dominio acotado vale más que uno que responde el 60% de todo.</li>
<li><b>Human-in-the-loop.</b> Para el resto, escalar a una persona con el contexto ya recuperado.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="d1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    “EL RAG ANDA MAL” — RECORRER EN ESTE ORDEN, SIEMPRE</text>

  <rect x="24" y="36" width="470" height="52" rx="9" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="58" fill="#f87171" font-size="12" font-weight="700">1 · ¿El texto extraído es legible?</text>
  <text x="44" y="76" fill="currentColor" opacity=".65" font-size="10.5">imprimí 3 fragmentos y leelos — el diagnóstico que nadie hace</text>
  <text x="510" y="66" fill="#f87171" font-size="11" font-weight="700">INGESTIÓN</text>

  <line x1="259" y1="88" x2="259" y2="102" stroke="currentColor" stroke-width="1.3" marker-end="url(#d1)"/>

  <rect x="24" y="106" width="470" height="52" rx="9" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="128" fill="#fbbf24" font-size="12" font-weight="700">2 · ¿El fragmento correcto está en la base?</text>
  <text x="44" y="146" fill="currentColor" opacity=".65" font-size="10.5">buscalo a mano en la tabla</text>
  <text x="510" y="136" fill="#fbbf24" font-size="11" font-weight="700">CHUNKING</text>

  <line x1="259" y1="158" x2="259" y2="172" stroke="currentColor" stroke-width="1.3" marker-end="url(#d1)"/>

  <rect x="24" y="176" width="470" height="60" rx="9" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.8"/>
  <text x="44" y="198" fill="#34d399" font-size="12" font-weight="700">3 · ¿La búsqueda lo encuentra en el top-50?</text>
  <text x="44" y="216" fill="currentColor" opacity=".65" font-size="10.5">mirá en qué POSICIÓN aparece el correcto</text>
  <text x="44" y="231" fill="#34d399" font-size="10.5" font-weight="700">acá se resuelve el 70% de los casos</text>
  <text x="510" y="212" fill="#34d399" font-size="11" font-weight="700">RETRIEVAL</text>

  <line x1="259" y1="236" x2="259" y2="250" stroke="currentColor" stroke-width="1.3" marker-end="url(#d1)"/>

  <rect x="24" y="254" width="470" height="52" rx="9" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="44" y="276" fill="#22d3ee" font-size="12" font-weight="700">4 · ¿El re-ranking lo deja entre los 5 finales?</text>
  <text x="44" y="294" fill="currentColor" opacity=".65" font-size="10.5">estaba en el top-50 pero no llegó al prompt</text>
  <text x="510" y="284" fill="#22d3ee" font-size="11" font-weight="700">RANKING</text>

  <line x1="259" y1="306" x2="259" y2="320" stroke="currentColor" stroke-width="1.3" marker-end="url(#d1)"/>

  <rect x="24" y="324" width="470" height="52" rx="9" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="44" y="346" fill="#7c5cff" font-size="12" font-weight="700">5 · ¿El modelo usa lo que le llegó?</text>
  <text x="44" y="364" fill="currentColor" opacity=".65" font-size="10.5">el correcto llegó al prompt y la respuesta igual está mal</text>
  <text x="510" y="354" fill="#7c5cff" font-size="11" font-weight="700">GENERACIÓN</text>

  <rect x="24" y="388" width="632" height="26" rx="8" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.3" stroke-dasharray="5 4"/>
  <text x="340" y="406" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    Empezar por el paso 5 —retocar el prompt— es lo que estanca proyectos de RAG durante semanas.</text>
</svg>`,
        pie: 'Cinco preguntas, en orden. Cada una descarta una etapa entera.',
      },

      entrevista: [
        { p: 'Tu RAG da respuestas malas. ¿Cómo lo diagnosticás?',
          r: 'Con un recorrido en orden, y cada paso descarta una etapa. <b>Uno</b>, miro el texto extraído: imprimo fragmentos y los leo, porque ' +
             'con PDFs es habitual que esté roto y nada de lo que haga después lo arregla. <b>Dos</b>, verifico que el fragmento correcto exista en ' +
             'la base. <b>Tres</b>, corro la búsqueda y miro en qué posición aparece — <b>acá se resuelve la mayoría de los casos</b>. ' +
             '<b>Cuatro</b>, si estaba en el top-50 pero no llegó al prompt, es el re-ranking. <b>Cinco</b>, recién si el fragmento correcto llegó ' +
             'y la respuesta sigue mal, es un problema de generación. Empezar por el cinco es el error que estanca proyectos durante semanas.' },

        { p: '¿Qué instrumentación necesitás para poder diagnosticar?',
          r: 'Por cada consulta guardo una traza con: la consulta original y la reescrita, los candidatos con su puntaje en cada búsqueda, el puntaje ' +
             'del re-ranker, qué fragmentos terminaron en el prompt, cuántos tokens de contexto, qué citó la respuesta, si alguna cita era inválida, ' +
             'si se abstuvo, y la latencia por etapa. <b>Con esa traza cualquiera de los cinco diagnósticos lleva minutos; sin ella, horas.</b> ' +
             'Es lo primero que agregaría a un sistema que no la tiene.' },

        { p: 'Mejoraste todo lo técnico y el RAG sigue sin llegar al nivel que necesitás. ¿Qué queda?',
          r: 'Casi siempre lo que falta no es técnica sino <b>documentación fuente</b>: si la respuesta no está escrita en ningún lado, ningún RAG ' +
             'la va a encontrar. Por eso conviene que el modelo devuelva un campo de <b>cobertura</b> —completa, parcial, sin información— y armar ' +
             'un tablero por tema: te dice exactamente qué documentación falta escribir, dicho por los propios usuarios. Las otras dos salidas son ' +
             '<b>recortar el alcance</b> —vale más responder bien el 90% de un dominio acotado que el 60% de todo— y <b>escalar a un humano</b> ' +
             'con el contexto ya recuperado.' },
      ],

      practica: `
<h4>El conjunto de evaluación: 40 líneas que cambian el proyecto</h4>
<pre><code>// evals/retrieval.json — 30-50 preguntas reales con la respuesta esperada
[
  { "pregunta": "¿Con cuánta anticipación pido vacaciones?",
    "fragmento_esperado": "doc-vacaciones-002" },
  { "pregunta": "¿Cuánto tardan en reintegrar un viaje?",
    "fragmento_esperado": "doc-reembolsos-005" }
]</code></pre>

<pre><code>export async function medirRetrieval(casos) {
  let recall = 0, mrr = 0, enTop5 = 0;

  for (const c of casos) {
    const r = await recuperar(c.pregunta, { tenantId: TEST, final: 50 });
    const pos = r.findIndex(d =&gt; d.id === c.fragmento_esperado);

    if (pos &gt;= 0)  { recall++; mrr += 1 / (pos + 1); }
    if (pos &gt;= 0 &amp;&amp; pos &lt; 5) enTop5++;

    if (pos &lt; 0) console.log('NO RECUPERADO →', c.pregunta);   // los que hay que mirar
  }

  return {
    recall:  recall  / casos.length,   // ¿está entre los recuperados?
    mrr:     mrr     / casos.length,   // ¿en qué posición? 1.0 = siempre primero
    enTop5:  enTop5  / casos.length,   // ¿llega al prompt?
  };
}</code></pre>

<div class="aviso"><strong>Ese <code>console.log</code> de los no recuperados es la lista de tareas.</strong>
Cada pregunta que aparece ahí es un caso concreto que tu sistema no puede responder. Arreglás esos, volvés a
medir, y sabés si mejoraste de verdad. <b>Sin esta medición, cada cambio es una apuesta.</b></div>

<h4>Metas razonables</h4>
<table>
<tr><th>Métrica</th><th>Preocupante</th><th>Aceptable</th><th>Bueno</th></tr>
<tr><td>Recall@50</td><td>&lt; 0,80</td><td>0,90</td><td>&gt; 0,95</td></tr>
<tr><td>Recall@5 (post re-rank)</td><td>&lt; 0,60</td><td>0,75</td><td>&gt; 0,85</td></tr>
<tr><td>MRR</td><td>&lt; 0,40</td><td>0,60</td><td>&gt; 0,75</td></tr>
<tr><td>Citas inválidas</td><td>&gt; 5%</td><td>&lt; 2%</td><td>~0%</td></tr>
</table>
<p>Fijate la brecha entre Recall@50 y Recall@5: si el primero es 0,95 y el segundo 0,60, tu búsqueda está bien
y <b>el problema es el re-ranking</b>. Esa comparación sola ya te ubica el 40% de los problemas.</p>
`,

      errores: [
        { mito: '"El RAG anda mal" es un diagnóstico.',
          realidad: 'Hay <b>cinco etapas</b> que se rompen distinto y se arreglan distinto: extracción, chunking, retrieval, ranking y generación. ' +
                    'Recorrerlas en orden ubica el problema en minutos. Saltar directo a "voy a mejorar el prompt" es la causa n°1 de proyectos ' +
                    'de RAG estancados.' },

        { mito: 'Si mejoro el prompt, mejora el sistema.',
          realidad: 'El prompt es la <b>última</b> etapa. Si el fragmento correcto no llegó, ningún prompt lo trae de vuelta. ' +
                    'Antes de tocar una palabra del prompt hay que confirmar que el fragmento correcto estuvo entre los enviados.' },

        { mito: 'Puedo evaluar el RAG probando algunas preguntas a mano.',
          realidad: 'Con cinco preguntas elegidas por vos no medís nada: son las fáciles. Hacen falta <b>30-50 casos con el fragmento esperado</b> ' +
                    'y métricas automáticas de recall y MRR. Es lo que te permite saber si un cambio mejoró o solo movió el problema de lugar.' },

        { mito: 'Si el RAG no llega al nivel que quiero, es un problema técnico.',
          realidad: 'Muchas veces la respuesta <b>no está escrita en ningún lado</b>. Ahí lo que falta es documentación, no ingeniería. ' +
                    'Un campo de <code>cobertura</code> en la respuesta te arma la lista de qué escribir, dicho por los propios usuarios.' },
      ],

      glosario: [
        { t: 'Context recall', d: 'Proporción de casos donde el fragmento correcto fue recuperado. Acota el techo de todo el sistema.' },
        { t: 'MRR', d: 'Mean Reciprocal Rank. Promedio de 1/posición del resultado correcto. Mide qué tan arriba aparece.' },
        { t: 'Traza', d: 'Registro detallado de cada etapa de una consulta, con entradas, salidas, puntajes y tiempos.' },
        { t: 'Conjunto de evaluación', d: 'Preguntas reales con la respuesta esperada, usadas para medir cambios de forma automática.' },
        { t: 'Recall@k', d: 'Si el resultado correcto aparece entre los primeros k. Se mide en cada etapa de la cascada.' },
        { t: 'Human-in-the-loop', d: 'Escalar a una persona los casos que el sistema no resuelve, con el contexto ya recuperado.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Qué significa que "la calidad de un RAG está limitada por su recuperación"?',
      opciones: [
        'Si el fragmento correcto no entra al prompt, ningún modelo ni prompt puede arreglarlo',
        'Que hay que usar el modelo más grande posible',
        'Que la generación no importa',
        'Que conviene recuperar la mayor cantidad de fragmentos posible',
      ],
      correcta: 0,
      porQue: 'El context recall acota el techo del sistema: con 70% de recall, el 30% de las preguntas no tiene forma de responderse bien. Por eso se mide recall antes que cualquier métrica de la respuesta.',
      porQueNo: {
        1: 'Un modelo más grande no puede usar información que nunca recibió.',
        2: 'La generación importa, pero solo puede trabajar con lo que le llegó.',
        3: 'Recuperar de más encarece y empeora por lost in the middle. Lo que importa es recuperar lo correcto.',
      },
    },
    {
      p: '¿Por qué un RAG usa dos etapas de búsqueda (bi-encoder y cross-encoder)?',
      opciones: [
        'El bi-encoder es rápido pero impreciso; el cross-encoder es preciso pero lento',
        'Por redundancia, en caso de que uno falle',
        'Porque los embeddings no funcionan con documentos largos',
        'Para poder usar dos proveedores distintos',
      ],
      correcta: 0,
      porQue: 'El bi-encoder precalcula los documentos y compara millones por segundo. El cross-encoder procesa consulta y documento juntos —mucho más preciso— pero no es precomputable. Uno filtra millones a 50, el otro afina 50 a 5.',
      porQueNo: {
        1: 'No es redundancia: cada uno hace un trabajo distinto en una cascada.',
        2: 'Funcionan con documentos largos; el problema es que comprimen todo en un punto.',
        3: 'La elección de proveedor no tiene nada que ver con el diseño en dos etapas.',
      },
    },
    {
      p: '¿Cuál es el punto de partida razonable para el tamaño de un fragmento?',
      opciones: [
        '300-600 palabras con 50-100 de solapamiento',
        '50 palabras sin solapamiento',
        'El documento completo',
        '5.000 palabras, para no perder contexto',
      ],
      correcta: 0,
      porQue: 'Equilibra precisión del vector con suficiente contexto. El solapamiento evita que una idea que cae en el punto de corte quede partida y no se encuentre en ningún fragmento.',
      porQueNo: {
        1: 'Demasiado chico: sin contexto, un fragmento como "el plazo es de 30 días" es irrecuperable.',
        2: 'El embedding promedia todos los temas y no queda cerca de ninguna pregunta concreta.',
        3: 'Demasiado grande: el vector se diluye y pagás tokens de ruido en cada llamada.',
      },
    },
    {
      p: '¿Cuál es la mejora de mayor impacto y menor esfuerzo en el chunking?',
      opciones: [
        'Anteponer al fragmento su contexto de ubicación antes de vectorizarlo',
        'Reducir el tamaño de los fragmentos a la mitad',
        'Eliminar el solapamiento para ahorrar espacio',
        'Vectorizar cada oración por separado',
      ],
      correcta: 0,
      porQue: 'Un fragmento como "el plazo es de 30 días" no dice de qué habla. Anteponer "[Manual > Vacaciones > Solicitud]" lo hace encontrable. Son diez líneas y cambia el recall notablemente.',
      porQueNo: {
        1: 'Fragmentos más chicos son más precisos pero tienen todavía menos contexto: agrava el problema.',
        2: 'El solapamiento existe para que una idea partida por el corte no se pierda. Quitarlo empeora el recall.',
        3: 'Una oración suelta casi nunca contiene una respuesta completa y multiplica el índice.',
      },
    },
    {
      p: 'Tu RAG funciona mal con PDFs. ¿Qué revisás primero?',
      opciones: [
        'El texto extraído: imprimí fragmentos y leelos',
        'El modelo de embeddings',
        'El tamaño del top-k',
        'La temperatura de generación',
      ],
      correcta: 0,
      porQue: 'El PDF guarda glifos con coordenadas, no estructura. Una extracción ingenua de un documento a dos columnas produce texto sin sentido que se indexa igual sin que nada falle. Si el texto está roto, nada de lo que hagas después lo arregla.',
      porQueNo: {
        1: 'Ningún modelo de embeddings puede recuperar significado de un texto que quedó mezclado.',
        2: 'Traer más resultados de un índice con texto roto no ayuda.',
        3: 'La temperatura es la última etapa; el problema está en la primera.',
      },
    },
    {
      p: '¿Cómo se fusionan los resultados de búsqueda vectorial y BM25?',
      opciones: [
        'Con RRF: combinando la posición en cada ranking',
        'Sumando los puntajes de ambos',
        'Quedándose con el mejor puntaje absoluto',
        'Alternando un resultado de cada lista',
      ],
      correcta: 0,
      porQue: 'El coseno va de 0 a 1 y BM25 no tiene cota fija: sumarlos da un ranking donde una búsqueda domina por accidente de escala. RRF usa la posición, que es indiferente a la escala.',
      porQueNo: {
        1: 'Las escalas son incomparables, así que la suma no significa nada.',
        2: 'Mismo problema: los puntajes no son comparables entre sí.',
        3: 'Ignora que un documento aparezca bien en ambas listas, que es justamente la señal más fuerte.',
      },
    },
    {
      p: '¿Qué top-k conviene en la búsqueda inicial de un RAG con re-ranking?',
      opciones: [
        '30-50, porque es un filtro grueso y el re-ranker afina después',
        '3-5, para no gastar tokens',
        '500, para maximizar el recall',
        'Exactamente los mismos que se van a enviar al prompt',
      ],
      correcta: 0,
      porQue: 'Traer de más en la búsqueda es barato: no cuesta tokens porque todavía no va al prompt. El re-ranker necesita margen para corregir los errores de ordenamiento del bi-encoder.',
      porQueNo: {
        1: 'La búsqueda no gasta tokens del modelo. Recuperar 5 equivale a confiar ciegamente en el filtro grueso.',
        2: 'El re-ranking de 500 candidatos agrega latencia significativa con poca ganancia.',
        3: 'Eso anula el propósito del re-ranking, que es elegir entre más opciones de las que caben.',
      },
    },
    {
      p: 'El re-ranker le da puntaje bajo a todos los candidatos. ¿Qué conviene hacer?',
      opciones: [
        'Abstenerse: devolver que no hay información en lugar de mandar los menos malos',
        'Mandar igual los 5 primeros',
        'Bajar el umbral hasta que pasen algunos',
        'Repetir la búsqueda con más candidatos',
      ],
      correcta: 0,
      porQue: 'Mandar contexto irrelevante garantiza una respuesta inventada con apariencia de fundamentada. El umbral de abstención son tres líneas y evita una clase entera de alucinaciones.',
      porQueNo: {
        1: 'El modelo va a construir una respuesta sobre fragmentos que no responden la pregunta.',
        2: 'Eso convierte la señal de "no hay respuesta" en ruido que llega al usuario.',
        3: 'Puede ayudar como paso previo, pero si el corpus no tiene la respuesta, ampliar la búsqueda no la crea.',
      },
    },
    {
      p: '¿Cuál es la principal utilidad técnica de exigir citas al modelo?',
      opciones: [
        'Permiten verificar por código si el modelo alucinó, sin intervención humana',
        'Hacen que la interfaz se vea más profesional',
        'Reducen la cantidad de tokens de salida',
        'Aceleran la generación',
      ],
      correcta: 0,
      porQue: 'Extraés los IDs citados y comprobás que existan entre los fragmentos enviados. Una cita a un documento que nunca mandaste es alucinación confirmada, medible en producción de forma automática.',
      porQueNo: {
        1: 'Es un beneficio secundario, no la razón técnica.',
        2: 'Al contrario: agregan algunos tokens a la respuesta.',
        3: 'No tienen efecto sobre la velocidad de generación.',
      },
    },
    {
      p: 'Dos fragmentos recuperados se contradicen. ¿Qué NO conviene hacer?',
      opciones: [
        'Dejar que el modelo elija uno en silencio',
        'Preferir el más reciente según metadatos',
        'Pedirle que señale ambas versiones con su fuente',
        'Escalar el caso a revisión humana',
      ],
      correcta: 0,
      porQue: 'El usuario recibe una afirmación categórica sobre algo que en tu corpus está en disputa, y vos no te enterás. La regla de señalar contradicciones tiene que estar escrita en el prompt.',
      porQueNo: {
        1: 'Es una estrategia válida cuando tenés fechas confiables en los metadatos.',
        2: 'Es la opción más honesta y suele ser la correcta.',
        3: 'En dominios sensibles es la única opción defendible.',
      },
    },
    {
      p: 'Tu RAG responde bien al primer mensaje de un chat y mal al segundo. ¿Qué falta?',
      opciones: [
        'Descontextualizar la consulta usando el historial antes de buscar',
        'Aumentar la ventana de contexto',
        'Cambiar el modelo de generación',
        'Reindexar el corpus',
      ],
      correcta: 0,
      porQue: 'Desde el segundo turno las preguntas son fragmentos como "¿y eso cuánto sale?", que como consulta aislada no recuperan nada. Reescribirlas en forma autónoma con un modelo chico es de las mejoras más rentables de todo RAG conversacional.',
      porQueNo: {
        1: 'La ventana no es el problema: la búsqueda nunca encontró los fragmentos correctos.',
        2: 'El modelo no puede usar contexto que el retrieval no trajo.',
        3: 'El corpus está bien; la consulta está incompleta.',
      },
    },
    {
      p: 'Al diagnosticar un RAG que falla, ¿por dónde se empieza?',
      opciones: [
        'Por verificar que el texto extraído sea legible',
        'Por mejorar el prompt de generación',
        'Por cambiar a un modelo más grande',
        'Por aumentar el top-k',
      ],
      correcta: 0,
      porQue: 'Es el paso 1 de un recorrido de cinco etapas, y el que menos gente hace. Si el texto extraído está roto —habitual con PDFs— ninguna mejora posterior sirve.',
      porQueNo: {
        1: 'Es el paso 5. Empezar por ahí es la causa número uno de proyectos de RAG estancados.',
        2: 'Un modelo más grande no arregla un problema de recuperación ni de extracción.',
        3: 'Puede ayudar, pero antes hay que saber en qué etapa está el problema.',
      },
    },
    {
      p: 'Tu Recall@50 es 0,95 pero tu Recall@5 es 0,60. ¿Dónde está el problema?',
      opciones: [
        'En el re-ranking: la búsqueda encuentra el fragmento pero no llega al prompt',
        'En el chunking',
        'En la extracción de texto',
        'En el prompt de generación',
      ],
      correcta: 0,
      porQue: 'Esa brecha es un diagnóstico directo: la búsqueda funciona —el fragmento está entre los 50— pero el re-ranker no lo sube al top-5. Comparar esas dos métricas ubica una porción grande de los problemas sin más investigación.',
      porQueNo: {
        1: 'Con Recall@50 de 0,95 el chunking está funcionando: los fragmentos se encuentran.',
        2: 'Si la extracción estuviera rota, el Recall@50 también sería bajo.',
        3: 'El problema es anterior: el fragmento correcto ni siquiera llega al prompt.',
      },
    },
    {
      p: '¿Qué ventaja tiene RAG sobre fine-tuning en un SaaS multi-tenant?',
      opciones: [
        'El aislamiento entre clientes es un filtro en la consulta, no un modelo por cliente',
        'Es más barato de entrenar',
        'Genera respuestas más largas',
        'No requiere base de datos',
      ],
      correcta: 0,
      porQue: 'Con fine-tuning necesitarías un modelo entrenado por cliente, lo cual es inviable. Con RAG el aislamiento es un WHERE tenant_id respaldado por RLS. Es una ventaja decisiva que casi nunca se menciona.',
      porQueNo: {
        1: 'Cierto, pero no es la ventaja específica del contexto multi-tenant.',
        2: 'La longitud de la respuesta no depende de la técnica.',
        3: 'Al contrario: RAG requiere un índice donde guardar los fragmentos.',
      },
    },
    {
      p: 'Después de optimizar todo lo técnico, tu RAG sigue sin alcanzar el nivel esperado. ¿Qué suele faltar?',
      opciones: [
        'Documentación fuente: la respuesta no está escrita en ningún lado',
        'Un modelo de embeddings más grande',
        'Más fragmentos en el prompt',
        'Una base vectorial dedicada',
      ],
      correcta: 0,
      porQue: 'Ningún RAG puede encontrar lo que no existe. Pedirle al modelo un campo de "cobertura" —completa, parcial, sin información— arma automáticamente la lista de qué documentación falta escribir.',
      porQueNo: {
        1: 'Si la información no está en el corpus, ningún modelo de embeddings la va a encontrar.',
        2: 'Más fragmentos irrelevantes empeoran la respuesta y encarecen la llamada.',
        3: 'Cambia el rendimiento a gran escala, no la existencia de la información.',
      },
    },
  ],
});
