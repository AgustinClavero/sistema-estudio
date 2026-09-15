/* ==========================================================================
   Track: Ingeniería en IA
   Cada módulo apunta a su archivo. `estado: 'listo'` = tiene contenido escrito.
   ========================================================================== */
ESTUDIO.registrarTrack({
  id: 'ia',
  titulo: 'Ingeniería en IA',
  subtitulo: 'De qué es un token hasta poner un sistema agéntico en producción.',
  icono: '🧠',
  color: '#7c5cff',

  descripcion:
    '<p>Este track te lleva desde cero hasta poder <b>diseñar, explicar y defender</b> un sistema con LLMs. ' +
    'No es un curso de matemática ni de entrenar modelos: es el trabajo real de un <i>AI Engineer</i>, que es ' +
    'construir productos sobre modelos que ya existen.</p>' +
    '<p>El eje del track es el camino que sigue toda oferta laboral seria: entender qué hace un LLM y qué no, ' +
    'darle contexto propio (RAG), medir si funciona (evals), dejarlo actuar sobre el mundo (agentes y tools), ' +
    'y sostenerlo en producción sin fundirte en costos ni abrir un agujero de seguridad.</p>' +
    '<p><b>Al terminar vas a poder:</b> explicar qué es un embedding sin leer, dibujar una arquitectura RAG en un ' +
    'pizarrón, justificar cuándo usar un agente y cuándo no, y contestar las preguntas que aparecen en entrevistas ' +
    'de AI Engineer.</p>',

  siguientes: [
    { track: 'arquitectura', porQue: 'Los sistemas agénticos en producción fallan por arquitectura, no por prompts. Acá aprendés a poner los límites y las capas en el lugar correcto.' },
    { track: 'infra', porQue: 'Un worker de IA que tarda 40 segundos necesita colas, contenedores y observabilidad. Este track te da la infraestructura que sostiene lo que construiste.' },
  ],

  modulos: [
    { id: 'm00', titulo: 'Mapa del terreno', estado: 'listo', archivo: 'm00-mapa.js',
      resumen: 'Qué es cada cosa, quién contiene a quién, y cómo se ve un producto con IA por dentro.',
      lecciones: 4, minutos: 35 },

    { id: 'm01', titulo: 'Qué es un LLM y cómo funciona', estado: 'listo', archivo: 'm01-llm.js',
      resumen: 'Tokens, atención, entrenamiento, ventana de contexto, temperatura y por qué alucina.',
      lecciones: 7, minutos: 65 },

    { id: 'm02', titulo: 'Trabajar con un LLM', estado: 'listo', archivo: 'm02-trabajar.js',
      resumen: 'Prompting, salida estructurada, streaming, costos, prompt caching y elección de modelo.',
      lecciones: 7, minutos: 65 },

    { id: 'm03', titulo: 'Embeddings y búsqueda semántica', estado: 'listo', archivo: 'm03-embeddings.js',
      resumen: 'Vectores, similitud coseno, pgvector, índices aproximados y los límites de lo semántico.',
      lecciones: 5, minutos: 42 },

    { id: 'm04', titulo: 'RAG de punta a punta', estado: 'listo', archivo: 'm04-rag.js',
      resumen: 'El patrón más pedido en ofertas laborales, completo y sin agujeros.',
      lecciones: 5, minutos: 45 },

    { id: 'm05', titulo: 'Evaluación', estado: 'listo', archivo: 'm05-evaluacion.js',
      resumen: 'Sin evals no sabés si mejoraste o rompiste algo. El módulo que más te distingue en una entrevista.',
      lecciones: 4, minutos: 33 },

    { id: 'm06', titulo: 'Tool calling y agentes', estado: 'listo', archivo: 'm06-agentes.js',
      resumen: 'Qué es un agente de verdad, cómo se le pone límite, y cuándo NO conviene usar uno.',
      lecciones: 4, minutos: 34 },

    { id: 'm07', titulo: 'Frameworks: LangChain, LangGraph, MCP', estado: 'listo', archivo: 'm07-frameworks.js',
      resumen: 'Qué problema resuelve cada uno y cuándo te conviene no usar ninguno.',
      lecciones: 4, minutos: 32 },

    { id: 'm08', titulo: 'IA en producción', estado: 'listo', archivo: 'm08-produccion.js',
      resumen: 'Observabilidad, costos, prompt injection, multi-tenant y cómo degradar en vez de caerse.',
      lecciones: 4, minutos: 33 },

    { id: 'm09', titulo: 'Modo entrevista', estado: 'listo', archivo: 'm09-entrevista.js',
      resumen: 'Las preguntas que caen siempre, diseñar en el pizarrón, contar tus proyectos y qué preguntar vos.',
      lecciones: 4, minutos: 34 },
  ],
});
