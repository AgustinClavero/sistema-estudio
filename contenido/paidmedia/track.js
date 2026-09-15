/* ==========================================================================
   Track: Paid Media — Google Ads, Meta Ads, TikTok Ads
   ========================================================================== */
ESTUDIO.registrarTrack({
  id: 'paidmedia',
  titulo: 'Paid Media',
  subtitulo: 'Google, Meta y TikTok Ads — con criterio de negocio, no de botones.',
  icono: '📣',
  color: '#f472b6',

  descripcion:
    '<p>El track menos técnico y el que más rápido se traduce en plata. La mayoría de los cursos de publicidad ' +
    'enseñan <b>dónde hacer clic</b>, y eso caduca cada seis meses. Acá vas a aprender <b>por qué funciona lo que ' +
    'funciona</b>: cómo se decide una subasta, qué mide realmente cada métrica, y por qué la creatividad pesa más ' +
    'que la configuración.</p>' +
    '<p>Incluye lo que casi nunca se enseña junto: la parte <b>técnica de la medición</b> —píxeles, eventos de ' +
    'servidor, consentimiento— que es donde un desarrollador aporta muchísimo más valor que un especialista de ' +
    'medios.</p>' +
    '<p><b>Al terminar vas a poder:</b> armar y leer una cuenta de Google, Meta o TikTok Ads; montar la medición ' +
    'correctamente y detectar cuando está rota; decidir presupuesto con números en vez de intuición; y ' +
    'explicarle a un cliente por qué su campaña anda mal sin repetir jerga.</p>',

  siguientes: [
    { track: 'arquitectura', porQue: 'La medición bien hecha es un problema de arquitectura: eventos, contratos, idempotencia y privacidad.' },
  ],

  modulos: [
    { id: 'm00', titulo: 'Cómo funciona la publicidad digital', estado: 'listo', archivo: 'm00-fundamentos.js',
      resumen: 'La subasta y por qué no gana el que más paga, métricas de decisión vs de diagnóstico, el embudo y la atribución.',
      lecciones: 4, minutos: 30 },

    { id: 'm01', titulo: 'Medición: la parte que casi nadie hace bien', estado: 'listo', archivo: 'm01-medicion.js',
      resumen: 'GA4 y el modelo de eventos, píxeles y API de conversiones desde el servidor, UTM y consentimiento, y cómo verificar que no se rompió.',
      lecciones: 4, minutos: 30 },

    { id: 'm02', titulo: 'Google Ads: búsqueda', estado: 'listo', archivo: 'm02-google-busqueda.js',
      resumen: 'Intención y concordancias, negativas y términos de búsqueda, estructura de cuenta, y cómo escribir anuncios que bajen el costo.',
      lecciones: 2, minutos: 16 },

    { id: 'm03', titulo: 'Google Ads: pujas, PMax y el resto de la red', estado: 'listo', archivo: 'm03-google-pujas.js',
      resumen: 'Qué estrategia de puja y cuándo, valor de conversión y conversiones offline, y cómo tratar a Performance Max, Shopping y Display.',
      lecciones: 2, minutos: 16 },

    { id: 'm04', titulo: 'Meta Ads: estructura y segmentación', estado: 'listo', archivo: 'm04-meta-estructura.js',
      resumen: 'Cómo aprende el algoritmo, fase de aprendizaje y consolidación, y qué públicos sirven y cuáles estorban.',
      lecciones: 2, minutos: 16 },

    { id: 'm05', titulo: 'Meta Ads: creatividad, testeo y escalado', estado: 'listo', archivo: 'm05-meta-creativo.js',
      resumen: 'El creativo es la segmentación: ganchos, ángulos y fatiga. Y cómo testear sin engañarse y escalar sin romper el aprendizaje.',
      lecciones: 2, minutos: 16 },

    { id: 'm06', titulo: 'TikTok Ads', estado: 'listo', archivo: 'm06-tiktok.js',
      resumen: 'Qué se traslada de Meta y qué no, el ritmo y el audio, Spark Ads con comentarios reales, y cómo trabajar con creadores.',
      lecciones: 1, minutos: 8 },

    { id: 'm07', titulo: 'Estrategia, presupuesto y reporte', estado: 'listo', archivo: 'm07-estrategia.js',
      resumen: 'CAC, LTV y período de recuperación, cohortes, reparto entre canales — y cómo armar un informe honesto que igual se pueda defender.',
      lecciones: 2, minutos: 16 },
  ],
});
