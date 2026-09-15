/* ==========================================================================
   _fuentes.js — catálogo de fuentes primarias + aviso de procedencia.

   Cómo se usa: cada módulo (o cada lección, si difiere) declara
       fuentes: ['anthropic', 'pgvector']
   con claves de este catálogo. La pestaña 📚 Fuentes las resuelve.

   Volatilidad:
     alta  → verificar SIEMPRE antes de decidir (precios, versiones, APIs)
     media → cambia, pero no de un día para el otro
     baja  → conceptual y estable
   ========================================================================== */

ESTUDIO.FUENTES = {

  /* ---------- de dónde salió el contenido de este sitio ---------- */
  procedencia: {
    corte: 'mayo de 2026',
    texto:
      '<p><b>El contenido de estas lecciones no se extrajo de las fuentes de abajo.</b> Lo escribió un modelo ' +
      'de lenguaje desde su entrenamiento — conocimiento paramétrico, sin recuperación y sin citas. ' +
      'Es exactamente el escenario que el módulo 1 del track de IA te enseña a mirar con desconfianza.</p>' +
      '<p>Las fuentes que siguen son <b>dónde verificar</b>, no de dónde se copió. Úsalas cuando algo de esta ' +
      'lección vaya a definir una decisión real: elegir plataforma, fijar un límite, dimensionar un costo.</p>',
    reglas: [
      { nivel: 'alta',  texto: 'Precios, nombres y versiones de modelos, ventanas de contexto, APIs de frameworks y detalles de versiones. <b>Verificá siempre antes de actuar.</b>' },
      { nivel: 'media', texto: 'Qué hace cada herramienta, límites típicos, buenas prácticas del ecosistema. Cambian, pero no de un día para el otro.' },
      { nivel: 'baja',  texto: 'Fundamentos: cómo funciona un transformer, por qué alucina, trade-offs de chunking, patrones de arquitectura. Estable.' },
    ],
  },

  /* ---------- catálogo ---------- */
  catalogo: {

    /* ===== proveedores de modelos ===== */
    anthropic: {
      nombre: 'Documentación de Anthropic',
      url: 'https://docs.anthropic.com',
      que: 'API de mensajes, tool calling, prompt caching, salida estructurada, modelos vigentes y sus límites.',
      volatilidad: 'alta',
    },
    'anthropic-precios': {
      nombre: 'Precios de Anthropic',
      url: 'https://www.anthropic.com/pricing',
      que: 'Costo por millón de tokens de entrada, salida y cacheados, por modelo.',
      volatilidad: 'alta',
    },
    openai: {
      nombre: 'OpenAI Platform Docs',
      url: 'https://platform.openai.com/docs',
      que: 'API, embeddings, salida estructurada, function calling. Referencia del otro gran proveedor.',
      volatilidad: 'alta',
    },
    'openai-precios': {
      nombre: 'Precios de OpenAI',
      url: 'https://openai.com/api/pricing',
      que: 'Costo por modelo, incluidos los de embeddings.',
      volatilidad: 'alta',
    },

    /* ===== fundamentos y papers ===== */
    'paper-attention': {
      nombre: '“Attention Is All You Need” (Vaswani et al., 2017)',
      url: 'https://arxiv.org/abs/1706.03762',
      que: 'El paper que introdujo el transformer. La fuente original del mecanismo de atención.',
      volatilidad: 'baja',
    },
    'paper-lost-middle': {
      nombre: '“Lost in the Middle” (Liu et al., 2023)',
      url: 'https://arxiv.org/abs/2307.03172',
      que: 'La evidencia experimental de que la información en el medio de un contexto largo se atiende peor.',
      volatilidad: 'baja',
    },
    'paper-chinchilla': {
      nombre: '“Training Compute-Optimal LLMs” (Chinchilla, 2022)',
      url: 'https://arxiv.org/abs/2203.15556',
      que: 'Las leyes de escalado: cómo repartir cómputo entre tamaño del modelo y cantidad de datos.',
      volatilidad: 'baja',
    },
    'paper-dpo': {
      nombre: '“Direct Preference Optimization” (Rafailov et al., 2023)',
      url: 'https://arxiv.org/abs/2305.18290',
      que: 'La alternativa a RLHF que se volvió estándar. Explica por qué se puede saltear el reward model.',
      volatilidad: 'baja',
    },
    'paper-rag': {
      nombre: '“Retrieval-Augmented Generation” (Lewis et al., 2020)',
      url: 'https://arxiv.org/abs/2005.11401',
      que: 'El paper que le puso nombre al patrón.',
      volatilidad: 'baja',
    },
    'paper-hyde': {
      nombre: '“Precise Zero-Shot Dense Retrieval” (HyDE, 2022)',
      url: 'https://arxiv.org/abs/2212.10496',
      que: 'Buscar con el embedding de una respuesta hipotética en vez del de la pregunta.',
      volatilidad: 'baja',
    },
    'paper-hnsw': {
      nombre: '“Efficient and robust approximate nearest neighbor search using HNSW”',
      url: 'https://arxiv.org/abs/1603.09320',
      que: 'El algoritmo detrás del índice vectorial más usado. Explica por qué la búsqueda es aproximada.',
      volatilidad: 'baja',
    },

    /* ===== RAG, embeddings y evaluación ===== */
    'anthropic-contextual': {
      nombre: 'Contextual Retrieval (Anthropic)',
      url: 'https://www.anthropic.com/news/contextual-retrieval',
      que: 'La técnica de anteponer contexto a cada fragmento antes de vectorizar, con mediciones.',
      volatilidad: 'media',
    },
    pgvector: {
      nombre: 'pgvector',
      url: 'https://github.com/pgvector/pgvector',
      que: 'El README es la referencia real: operadores, clases de índice, HNSW vs IVFFlat, ef_search, halfvec.',
      volatilidad: 'media',
    },
    mteb: {
      nombre: 'MTEB — Massive Text Embedding Benchmark',
      url: 'https://huggingface.co/spaces/mteb/leaderboard',
      que: 'Comparar modelos de embedding por tarea e idioma. Para elegir, no para creer ciegamente.',
      volatilidad: 'alta',
    },
    ragas: {
      nombre: 'Ragas',
      url: 'https://docs.ragas.io',
      que: 'Implementación de referencia de las métricas de RAG: faithfulness, context recall y precision.',
      volatilidad: 'media',
    },
    'cohere-rerank': {
      nombre: 'Cohere Rerank',
      url: 'https://docs.cohere.com/docs/rerank-overview',
      que: 'Re-ranking como servicio. Buena explicación de la diferencia entre bi-encoder y cross-encoder.',
      volatilidad: 'media',
    },
    bm25: {
      nombre: 'Búsqueda de texto completo en PostgreSQL',
      url: 'https://www.postgresql.org/docs/current/textsearch.html',
      que: 'tsvector, tsquery y ts_rank: la mitad léxica de una búsqueda híbrida.',
      volatilidad: 'baja',
    },

    /* ===== agentes, frameworks y protocolos ===== */
    mcp: {
      nombre: 'Model Context Protocol',
      url: 'https://modelcontextprotocol.io',
      que: 'Especificación, SDKs y guía de seguridad. La fuente para tools, resources y prompts.',
      volatilidad: 'media',
    },
    langgraph: {
      nombre: 'LangGraph',
      url: 'https://langchain-ai.github.io/langgraph/',
      que: 'Grafos de estado, checkpoints, human-in-the-loop. La API cambia seguido: verificá la versión.',
      volatilidad: 'alta',
    },
    langchain: {
      nombre: 'LangChain',
      url: 'https://python.langchain.com/docs/introduction/',
      que: 'El framework de cadenas. Útil para entender qué abstrae — y qué esconde.',
      volatilidad: 'alta',
    },
    llamaindex: {
      nombre: 'LlamaIndex',
      url: 'https://docs.llamaindex.ai',
      que: 'Enfocado en ingestión y estrategias de retrieval. Buena referencia de patrones de chunking.',
      volatilidad: 'alta',
    },
    'vercel-ai': {
      nombre: 'Vercel AI SDK',
      url: 'https://sdk.vercel.ai/docs',
      que: 'Streaming e integración con la interfaz en TypeScript.',
      volatilidad: 'alta',
    },
    inngest: {
      nombre: 'Inngest',
      url: 'https://www.inngest.com/docs',
      que: 'Flujos durables: reintentos, esperas largas, reanudación. El stack canónico del workspace.',
      volatilidad: 'media',
    },

    /* ===== seguridad ===== */
    'owasp-llm': {
      nombre: 'OWASP Top 10 for LLM Applications',
      url: 'https://genai.owasp.org',
      que: 'Prompt injection, fuga de datos, permisos excesivos. La referencia de seguridad del rubro.',
      volatilidad: 'media',
    },

    /* ===== observabilidad ===== */
    langfuse: {
      nombre: 'Langfuse',
      url: 'https://langfuse.com/docs',
      que: 'Trazas, evals y cost tracking para sistemas con LLM. Independiente del framework.',
      volatilidad: 'media',
    },
    opentelemetry: {
      nombre: 'OpenTelemetry',
      url: 'https://opentelemetry.io/docs/',
      que: 'Estándar de instrumentación: trazas, spans y métricas.',
      volatilidad: 'media',
    },

    sentry: {
      nombre: 'Documentación de Sentry',
      url: 'https://docs.sentry.io/',
      que: 'Captura de errores, contexto de excepciones, performance y alertas.',
      volatilidad: 'media',
    },

    'sre-book': {
      nombre: 'Google SRE Book y SRE Workbook',
      url: 'https://sre.google/books/',
      que: 'La fuente canónica de SLI/SLO, presupuesto de error, alertas de quemado, guardia y postmortems sin culpables. Gratis en línea.',
      volatilidad: 'baja',
    },

    /* ===== web y protocolos ===== */
    'mdn-http': {
      nombre: 'MDN — HTTP',
      url: 'https://developer.mozilla.org/es/docs/Web/HTTP',
      que: 'Códigos de estado, cabeceras, caché, CORS. La referencia más clara que hay, y en español.',
      volatilidad: 'baja',
    },
    'web-dev-cache': {
      nombre: 'web.dev — HTTP caching',
      url: 'https://web.dev/articles/http-cache',
      que: 'Cache-Control, ETag, stale-while-revalidate, explicados con criterio práctico.',
      volatilidad: 'baja',
    },
    letsencrypt: {
      nombre: "Let's Encrypt",
      url: 'https://letsencrypt.org/docs/',
      que: 'Emisión y renovación automática de certificados, validación por HTTP y por DNS.',
      volatilidad: 'baja',
    },
    'cloudflare-dns': {
      nombre: 'Cloudflare — Aprender sobre DNS',
      url: 'https://www.cloudflare.com/learning/dns/what-is-dns/',
      que: 'Explicaciones claras de resolución, TTL, tipos de registro y CNAME flattening.',
      volatilidad: 'baja',
    },

    /* ===== servidores y contenedores ===== */
    nodejs: {
      nombre: 'Node.js — Docs',
      url: 'https://nodejs.org/docs/latest/api/',
      que: 'Bucle de eventos, señales del proceso, worker threads, cluster.',
      volatilidad: 'baja',
    },
    nginx: {
      nombre: 'nginx',
      url: 'https://nginx.org/en/docs/',
      que: 'proxy_pass, buffering, cabeceras, timeouts. La referencia del proxy inverso más usado.',
      volatilidad: 'baja',
    },
    caddy: {
      nombre: 'Caddy',
      url: 'https://caddyserver.com/docs/',
      que: 'Proxy inverso con HTTPS automático. La opción más simple para un VPS.',
      volatilidad: 'media',
    },
    docker: {
      nombre: 'Docker — Documentación',
      url: 'https://docs.docker.com',
      que: 'Dockerfile, capas, multi-stage, BuildKit, Compose, volúmenes y redes.',
      volatilidad: 'media',
    },
    'docker-buenas-practicas': {
      nombre: 'Docker — Buenas prácticas de Dockerfile',
      url: 'https://docs.docker.com/build/building/best-practices/',
      que: 'Orden de capas, caché, multi-stage, usuario sin privilegios. La fuente de esta lección.',
      volatilidad: 'media',
    },
    oci: {
      nombre: 'Open Container Initiative',
      url: 'https://opencontainers.org',
      que: 'El estándar de formato de imagen y runtime. Por qué las imágenes son portables.',
      volatilidad: 'baja',
    },
    kubernetes: {
      nombre: 'Kubernetes — Documentación',
      url: 'https://kubernetes.io/docs/home/',
      que: 'Pods, Deployments, Services, probes, requests y limits, rollouts.',
      volatilidad: 'media',
    },
    'k8s-produccion': {
      nombre: 'Kubernetes — Configurar probes',
      url: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/',
      que: 'La diferencia entre liveness, readiness y startup, con ejemplos.',
      volatilidad: 'media',
    },
    '12factor': {
      nombre: 'The Twelve-Factor App',
      url: 'https://12factor.net/es/',
      que: 'Configuración por entorno, logs a stdout, procesos sin estado. Viejo y sigue vigente.',
      volatilidad: 'baja',
    },

    /* ===== plataformas y precios ===== */
    'supabase-docs': {
      nombre: 'Supabase — Documentación',
      url: 'https://supabase.com/docs',
      que: 'RLS, auth, storage con policies, realtime, pgvector, pooler.',
      volatilidad: 'media',
    },
    'supabase-precios': {
      nombre: 'Supabase — Precios',
      url: 'https://supabase.com/pricing',
      que: 'Planes, cupos incluidos y precio de los excedentes. <b>Verificá antes de cualquier cálculo.</b>',
      volatilidad: 'alta',
    },
    'neon-precios': {
      nombre: 'Neon — Precios',
      url: 'https://neon.tech/pricing',
      que: 'Modelo por horas de cómputo, escala a cero y branching.',
      volatilidad: 'alta',
    },
    'cloudflare-r2': {
      nombre: 'Cloudflare R2',
      url: 'https://developers.cloudflare.com/r2/',
      que: 'Almacenamiento compatible con S3 sin cargo de egreso. Mirá el precio de las operaciones.',
      volatilidad: 'alta',
    },
    'cloudflare-workers': {
      nombre: 'Cloudflare Workers y D1',
      url: 'https://developers.cloudflare.com/workers/',
      que: 'Cómputo en el edge, D1, KV, Durable Objects, y sus límites reales.',
      volatilidad: 'alta',
    },
    'aws-precios': {
      nombre: 'AWS — Calculadora de precios',
      url: 'https://calculator.aws',
      que: 'Estimar EC2, RDS, S3 y sobre todo el <b>egreso</b>, que es donde está la sorpresa.',
      volatilidad: 'alta',
    },
    pgbouncer: {
      nombre: 'PgBouncer',
      url: 'https://www.pgbouncer.org/config.html',
      que: 'Modos de pooling y sus límites — transaction pooling no soporta sentencias preparadas.',
      volatilidad: 'baja',
    },
    postgres: {
      nombre: 'PostgreSQL — Documentación',
      url: 'https://www.postgresql.org/docs/current/',
      que: 'RLS, secuencias, replicación lógica, extensiones. La referencia para migraciones.',
      volatilidad: 'baja',
    },

    /* ===== arquitectura y diseño ===== */

    fowler: {
      nombre: 'martinfowler.com',
      url: 'https://martinfowler.com/architecture/',
      que: 'Catálogo de artículos sobre arquitectura, microservicios, refactor y patrones de empresa. La referencia más citada del rubro y gratis.',
      volatilidad: 'baja',
    },

    'refactoring-guru': {
      nombre: 'Refactoring Guru — Patrones de diseño',
      url: 'https://refactoring.guru/es/design-patterns',
      que: 'Los 23 patrones GoF explicados con diagramas y código, en español. El mejor punto de entrada.',
      volatilidad: 'baja',
    },

    'ddd-referencia': {
      nombre: 'Domain-Driven Design Reference (Eric Evans)',
      url: 'https://www.domainlanguage.com/ddd/reference/',
      que: 'Resumen oficial y gratuito de los patrones de DDD: lenguaje ubicuo, bounded context, agregados.',
      volatilidad: 'baja',
    },

    adr: {
      nombre: 'Architecture Decision Records',
      url: 'https://adr.github.io/',
      que: 'Formato y ejemplos de ADR: registrar por qué se tomó una decisión, no solo cuál.',
      volatilidad: 'baja',
    },

    nextjs: {
      nombre: 'Next.js — Documentación',
      url: 'https://nextjs.org/docs',
      que: 'App Router, Server Components, Server Actions, caché y renderizado. Cambia seguido: verificá la versión.',
      volatilidad: 'alta',
    },

    react: {
      nombre: 'React — Documentación',
      url: 'https://react.dev/learn',
      que: 'Modelo mental de componentes, estado y efectos. La sección "You Might Not Need an Effect" vale sola el viaje.',
      volatilidad: 'media',
    },

    /* ===== publicidad digital ===== */

    'google-ads-ayuda': {
      nombre: 'Google Ads — Centro de ayuda',
      url: 'https://support.google.com/google-ads',
      que: 'Referencia oficial de tipos de campaña, pujas, concordancias y políticas. Cambia seguido: verificá antes de aplicar.',
      volatilidad: 'alta',
    },

    skillshop: {
      nombre: 'Google Skillshop',
      url: 'https://skillshop.exceedlms.com/student/catalog',
      que: 'Cursos y certificaciones oficiales y gratuitas de Google Ads, GA4 y Merchant Center.',
      volatilidad: 'alta',
    },

    ga4: {
      nombre: 'Google Analytics 4 — Documentación',
      url: 'https://support.google.com/analytics/topic/9143232',
      que: 'Modelo de eventos, conversiones, audiencias y atribución. Cambió por completo respecto de Universal Analytics.',
      volatilidad: 'alta',
    },

    gtm: {
      nombre: 'Google Tag Manager — Documentación',
      url: 'https://support.google.com/tagmanager',
      que: 'Etiquetas, disparadores, variables, modo de consentimiento y contenedor de servidor.',
      volatilidad: 'media',
    },

    'meta-ayuda': {
      nombre: 'Meta — Centro de ayuda para empresas',
      url: 'https://www.facebook.com/business/help',
      que: 'Estructura de campañas, píxel, API de conversiones, catálogo y políticas de Facebook e Instagram.',
      volatilidad: 'alta',
    },

    'meta-blueprint': {
      nombre: 'Meta Blueprint',
      url: 'https://www.facebook.com/business/learn',
      que: 'Cursos oficiales y gratuitos de Meta Ads, con certificaciones pagas opcionales.',
      volatilidad: 'alta',
    },

    'tiktok-business': {
      nombre: 'TikTok Ads Manager — Centro de ayuda',
      url: 'https://ads.tiktok.com/help/',
      que: 'Objetivos, formatos, Spark Ads, píxel y events API. Ecosistema más nuevo y con cambios frecuentes.',
      volatilidad: 'alta',
    },

    /* ===== lógica y algoritmos ===== */

    'mdn-js': {
      nombre: 'MDN — Referencia de JavaScript',
      url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference',
      que: 'La referencia canónica del lenguaje: métodos de Array, Map, Set, iteradores y complejidad implícita de cada operación.',
      volatilidad: 'baja',
    },

    'big-o': {
      nombre: 'Big-O Cheat Sheet',
      url: 'https://www.bigocheatsheet.com/',
      que: 'Tabla de complejidad temporal y espacial de las estructuras de datos y algoritmos más usados.',
      volatilidad: 'baja',
    },

    visualgo: {
      nombre: 'VisuAlgo',
      url: 'https://visualgo.net/es',
      que: 'Visualizaciones paso a paso de estructuras de datos y algoritmos. Sirve mucho para entender recursión y árboles.',
      volatilidad: 'baja',
    },

    'neetcode-patrones': {
      nombre: 'NeetCode — Patrones de problemas',
      url: 'https://neetcode.io/practice',
      que: 'Problemas agrupados por patrón (dos punteros, ventana deslizante, BFS/DFS). Práctica ordenada para entrevistas.',
      volatilidad: 'media',
    },

    /* ===== inglés =====
       Acá las fuentes cumplen un papel extra: son donde escuchás HUMANOS.
       La voz sintética de la plataforma sirve para practicar, no para
       aprender cómo suena el inglés de verdad. */

    'bbc-learning-english': {
      nombre: 'BBC Learning English',
      url: 'https://www.bbc.co.uk/learningenglish',
      que: 'Audio y video de hablantes reales, graduado por nivel, con transcripción. Gratis y sin registro. Es el mejor reemplazo de lo que la voz sintética no te puede dar.',
      volatilidad: 'baja',
    },

    'cambridge-dic': {
      nombre: 'Cambridge Dictionary',
      url: 'https://dictionary.cambridge.org/',
      que: 'Pronunciación de cada palabra en alfabeto fonético y en audio, en versión británica y estadounidense. Verificá acá cualquier palabra que no sepas cómo suena.',
      volatilidad: 'baja',
    },

    youglish: {
      nombre: 'YouGlish',
      url: 'https://youglish.com/',
      que: 'Escuchás una palabra o frase pronunciada por gente real en cientos de videos de YouTube, uno tras otro. Sirve para el ritmo y para los acentos que la voz sintética no tiene.',
      volatilidad: 'baja',
    },

    wordreference: {
      nombre: 'WordReference — inglés/español',
      url: 'https://www.wordreference.com/es/',
      que: 'Traducción con matices y, sobre todo, los foros: ahí están discutidas las dudas específicas del hispanohablante que un diccionario común no cubre.',
      volatilidad: 'baja',
    },

    cefr: {
      nombre: 'Marco Común Europeo (CEFR) — Consejo de Europa',
      url: 'https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions',
      que: 'Qué significa exactamente A1, A2, B1, B2, C1 y C2 en términos de lo que podés hacer. Útil para saber dónde estás parado de verdad y qué pide una oferta laboral.',
      volatilidad: 'baja',
    },
  },
};
