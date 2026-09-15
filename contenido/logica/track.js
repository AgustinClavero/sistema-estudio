/* ==========================================================================
   Track: Lógica de programación (repaso)
   7 módulos · 7 lecciones. Completo.
   ========================================================================== */
ESTUDIO.registrarTrack({
  id: 'logica',
  titulo: 'Lógica de programación',
  subtitulo: 'Volver a pensar con lógica: descomponer, estructurar y estimar costo.',
  icono: '🧩',
  color: '#fbbf24',

  descripcion:
    '<p>El track de mantenimiento. Cuando pasás mucho tiempo integrando servicios y armando pantallas, el músculo ' +
    'de <b>pensar el problema antes de escribirlo</b> se atrofia. Este track lo vuelve a poner en forma.</p>' +
    '<p>Es el más corto de los cinco y el más práctico: cada lección termina en ejercicios con la respuesta ' +
    'desplegable, para que primero pienses y después compares.</p>' +
    '<p><b>Al terminar vas a poder:</b> descomponer un problema sin abrir el editor, elegir la estructura de datos ' +
    'correcta por reflejo, estimar el costo de un algoritmo, y pasar la parte de lógica de una entrevista técnica ' +
    'sin quedarte en blanco.</p>',

  siguientes: [
    { track: 'arquitectura', porQue: 'La lógica resuelve un problema; la arquitectura decide dónde vive ese problema y con qué se habla.' },
  ],

  modulos: [
    { id: 'm00', titulo: 'Pensar antes de escribir', estado: 'listo', archivo: 'm00-pensar.js',
      resumen: 'El método de cinco pasos, resolver a mano antes de programar, casos borde y por qué la versión obvia va primero.',
      lecciones: 1, minutos: 8 },

    { id: 'm01', titulo: 'Control de flujo y estado', estado: 'listo', archivo: 'm01-flujo.js',
      resumen: 'Salida temprana, condiciones con nombre, el bug de || vs ??, acumuladores y máquinas de estado.',
      lecciones: 1, minutos: 8 },

    { id: 'm02', titulo: 'Estructuras de datos', estado: 'listo', archivo: 'm02-estructuras.js',
      resumen: 'Array, mapa y conjunto; el bug del includes en un bucle; objeto vs Map; pila, cola, árboles y grafos.',
      lecciones: 1, minutos: 8 },

    { id: 'm03', titulo: 'Complejidad y Big-O', estado: 'listo', archivo: 'm03-complejidad.js',
      resumen: 'Leer la complejidad sin fórmulas, la trampa del spread en un bucle, complejidad espacial y cuándo importa de verdad.',
      lecciones: 1, minutos: 8 },

    { id: 'm04', titulo: 'Recursión', estado: 'listo', archivo: 'm04-recursion.js',
      resumen: 'Caso base y paso recursivo, dónde aparece de verdad, desbordamiento de pila, memoización y cuándo conviene iterar.',
      lecciones: 1, minutos: 8 },

    { id: 'm05', titulo: 'Algoritmos que hay que conocer', estado: 'listo', archivo: 'm05-algoritmos.js',
      resumen: 'Los seis patrones y la señal que delata a cada uno: binaria, dos punteros, ventana, frecuencias, recorridos y ordenar primero.',
      lecciones: 1, minutos: 8 },

    { id: 'm06', titulo: 'Resolver problemas de entrevista', estado: 'listo', archivo: 'm06-entrevista.js',
      resumen: 'El método de seis pasos en voz alta, qué se evalúa realmente, qué hacer si te trabás y un plan de práctica.',
      lecciones: 1, minutos: 8 },
  ],
});
