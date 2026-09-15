/* ==========================================================================
   Track: Inglés A1 — desde cero
   Primero de una escalera de cinco niveles (A1 → C1). Cada nivel es su
   propio track: un track de 60 módulos sería inmanejable.
   ========================================================================== */
ESTUDIO.registrarTrack({
  id: 'ingles-a1',
  titulo: 'Inglés A1',
  subtitulo: 'Desde cero: entender y decir lo básico, y empezar a acostumbrar el oído.',
  // Nada de banderas: Windows no tiene glifos de emoji-bandera y las dibuja
  // como dos letras sueltas ("GB"). Verificado en Chrome sobre Windows 11.
  icono: '🗣️',
  color: '#f59e0b',

  descripcion:
    '<p>El punto de partida. <b>A1 no es "saber inglés"</b>: es poder presentarte, hablar de lo que hacés todos los días, ' +
    'pedir algo y entender frases cortas dichas despacio. Suena poco, pero es la base sobre la que se apoya todo lo demás — ' +
    'y sin ella cualquier cosa que aprendas después se te desarma al hablar.</p>' +

    '<p><b>Cómo está armado.</b> Once módulos de inglés general y uno final de inglés de trabajo, que aplica todo lo anterior ' +
    'a un standup, una call y presentarte con alguien del equipo. La capa profesional va al final a propósito: sin base ' +
    'no hay dónde apoyarla.</p>' +

    '<p><b>Cada lección tiene audio.</b> Tocá cualquier frase marcada y la escuchás. La pestaña 🎧 <b>Escucha</b> te hace ' +
    'escribir lo que oíste antes de mostrarte el texto, y te deja grabarte repitiendo para compararte con el modelo.</p>' +

    '<div class="aviso"><b>Lo que esto no puede darte.</b> La voz es la que tiene instalada Windows: sirve para el dictado ' +
    'y el vocabulario, pero es robótica y solo tiene acento estadounidense. <b>No reemplaza escuchar humanos reales.</b> ' +
    'La pestaña 📚 Fuentes de cada módulo te dice exactamente dónde escucharlos — eso sí necesita internet.</div>' +

    '<p><b>Al terminar A1 vas a poder:</b> presentarte y presentar a alguien, hablar de tu rutina y tu trabajo en presente, ' +
    'contar algo que hiciste en pasado, decir qué vas a hacer, pedir y ofrecer cosas, y entender a alguien que te habla ' +
    'despacio sobre temas conocidos.</p>' +

    '<p><b>Cuánto lleva.</b> De A1 a B2 son 500-700 horas de estudio. No hay atajo, ni con esta plataforma ni con una academia. ' +
    'Con 45 minutos por día son unos dos años; con hora y media, uno. Lo que sí cambia todo es la constancia: ' +
    '<b>20 minutos todos los días rinden más que tres horas el domingo.</b></p>',

  siguientes: [
    { track: 'ia', porQue: 'Casi todo lo serio de IA se publica primero en inglés. Cuanto antes puedas leerlo sin traductor, menos vas a depender de que alguien lo resuma.' },
  ],

  modulos: [
    { id: 'm00', titulo: 'Cómo suena el inglés', estado: 'listo', archivo: 'm00-sonidos.js',
      resumen: 'Por qué no se lee como se escribe, los sonidos que el español no tiene, el alfabeto y cómo usar este track.',
      lecciones: 4, minutos: 34 },

    { id: 'm01', titulo: 'To be: quién sos y de dónde', estado: 'listo', archivo: 'm01-to-be.js',
      resumen: 'Pronombres, el verbo to be en afirmativo/negativo/pregunta, contracciones y presentarte.',
      lecciones: 4, minutos: 36 },

    { id: 'm02', titulo: 'Cosas: artículos y plurales', estado: 'listo', archivo: 'm02-cosas.js',
      resumen: 'a / an / the / nada, plurales regulares e irregulares, this-that-these-those, contables e incontables.',
      lecciones: 4, minutos: 32 },

    { id: 'm03', titulo: 'Present simple: lo que hacés siempre', estado: 'listo', archivo: 'm03-present-simple.js',
      resumen: 'La -s de tercera persona, do/does en negativo y pregunta, adverbios de frecuencia y describir cómo funciona un sistema.',
      lecciones: 4, minutos: 35 },

    { id: 'm04', titulo: 'Dónde están las cosas', estado: 'listo', archivo: 'm04-lugares.js',
      resumen: 'There is / there are, in-on-at para lugar y para tiempo, by vs until, y ubicar cosas en un proyecto.',
      lecciones: 4, minutos: 33 },

    { id: 'm05', titulo: 'Can: poder, saber y pedir', estado: 'listo', archivo: 'm05-can.js',
      resumen: 'Habilidad y permiso, pedir sin sonar mandón, la trampa de can vs can\'t al escuchar, y el kit de frases de una call.',
      lecciones: 4, minutos: 34 },

    { id: 'm06', titulo: 'Present continuous: ahora mismo', estado: 'listo', archivo: 'm06-continuous.js',
      resumen: 'am/is/are + -ing, simple vs continuous como decisión de significado, verbos de estado y el standup.',
      lecciones: 4, minutos: 34 },

    { id: 'm07', titulo: 'Pasado (1): to be y verbos regulares', estado: 'listo', archivo: 'm07-pasado-1.js',
      resumen: 'Was / were, la terminación -ed con sus tres pronunciaciones, y did para negar y preguntar.',
      lecciones: 4, minutos: 32 },

    { id: 'm08', titulo: 'Pasado (2): los irregulares', estado: 'listo', archivo: 'm08-pasado-2.js',
      resumen: 'Los irregulares agrupados por patrón, contar un incidente, explicar una decisión y el standup completo.',
      lecciones: 4, minutos: 33 },

    { id: 'm09', titulo: 'Futuro: going to y will', estado: 'listo', archivo: 'm09-futuro.js',
      resumen: 'Going to, will y el continuous con valor de futuro; la regla falsa del «futuro cercano»; y los niveles de compromiso al dar una fecha.',
      lecciones: 4, minutos: 32 },

    { id: 'm10', titulo: 'Preguntar, contar y comparar', estado: 'listo', archivo: 'm10-preguntar-comparar.js',
      resumen: 'El orden fijo de las preguntas, preposiciones al final, cantidades, comparativos y superlativos para justificar decisiones.',
      lecciones: 4, minutos: 32 },

    { id: 'm11', titulo: 'Tu trabajo en inglés', estado: 'listo', archivo: 'm11-trabajo.js',
      resumen: 'Tu primera semana en el equipo, participar en una reunión, escribir Slack/PR/mail, y la entrevista técnica.',
      lecciones: 4, minutos: 34 },
  ],
});
