/* ==========================================================================
   Track: Arquitectura de software y patrones de diseño
   10 módulos · 40 lecciones. Completo.
   ========================================================================== */
ESTUDIO.registrarTrack({
  id: 'arquitectura',
  titulo: 'Arquitectura de software',
  subtitulo: 'Patrones, capas y el criterio para elegir la solución del tamaño correcto.',
  icono: '🏛️',
  color: '#22d3ee',

  descripcion:
    '<p>El track que te da el <b>criterio</b>. La mayoría de los problemas de un sistema no son de código: son de ' +
    'límites mal puestos, dependencias en la dirección equivocada y decisiones tomadas por moda en vez de por necesidad.</p>' +
    '<p>Acá vas a aprender los patrones clásicos, pero sobre todo <i>cuándo</i> aplicarlos — y cuándo la respuesta ' +
    'correcta es la solución aburrida de tres archivos.</p>' +
    '<p><b>Al terminar vas a poder:</b> mirar un requerimiento y saber si pide un monolito modular o algo distribuido, ' +
    'nombrar el patrón que resuelve un problema en vez de improvisar, y defender una decisión de arquitectura con ' +
    'argumentos de trade-off en lugar de preferencias.</p>',

  siguientes: [
    { track: 'infra', porQue: 'Una arquitectura solo existe de verdad cuando la podés desplegar. Acá aprendés dónde corre cada pieza que diseñaste.' },
  ],

  modulos: [
    { id: 'm00', titulo: 'Qué es arquitectura y qué no', estado: 'listo', archivo: 'm00-que-es.js',
      resumen: 'Decisiones caras de revertir, atributos de calidad y trade-offs, acoplamiento y cohesión, y ADR.',
      lecciones: 4, minutos: 30 },

    { id: 'm01', titulo: 'Principios: SOLID y compañía', estado: 'listo', archivo: 'm01-principios.js',
      resumen: 'SOLID con ejemplos reales, DRY/KISS/YAGNI y por qué DRY mal aplicado hace más daño, y las señales mecánicas de mal diseño.',
      lecciones: 4, minutos: 31 },

    { id: 'm02', titulo: 'Patrones de diseño que sí se usan', estado: 'listo', archivo: 'm02-patrones.js',
      resumen: 'Strategy y Factory, Adapter/Facade/Decorator, Repository y datos, Observer — y cuándo NO usar ninguno.',
      lecciones: 4, minutos: 31 },

    { id: 'm03', titulo: 'Capas y dependencias', estado: 'listo', archivo: 'm03-capas.js',
      resumen: 'La regla de dependencia, hexagonal con puertos y adaptadores, qué tomar de Clean Architecture, y cómo se ve todo esto en Next.js.',
      lecciones: 4, minutos: 31 },

    { id: 'm04', titulo: 'Domain-Driven Design, lo útil', estado: 'listo', archivo: 'm04-ddd.js',
      resumen: 'Lenguaje ubicuo y glosario, bounded contexts, entidades/valores/agregados, y qué dejar afuera sin culpa.',
      lecciones: 4, minutos: 30 },

    { id: 'm05', titulo: 'Monolito, monolito modular y microservicios', estado: 'listo', archivo: 'm05-monolito.js',
      resumen: 'Qué resuelve cada opción, el costo real de lo distribuido, cómo se hace bien un monolito modular, y cuándo y cómo partir.',
      lecciones: 4, minutos: 31 },

    { id: 'm06', titulo: 'Sistemas orientados a eventos', estado: 'listo', archivo: 'm06-eventos.js',
      resumen: 'Colas vs pub/sub, bandeja de salida, entrega e idempotencia, CQRS y event sourcing (y por qué casi nunca), y cómo diseñar eventos.',
      lecciones: 4, minutos: 31 },

    { id: 'm07', titulo: 'Datos: modelado y consistencia', estado: 'listo', archivo: 'm07-datos.js',
      resumen: 'Normalizar y restricciones, transacciones y concurrencia, multi-tenant con RLS, y migraciones sin cortar el servicio.',
      lecciones: 4, minutos: 32 },

    { id: 'm08', titulo: 'Arquitectura frontend', estado: 'listo', archivo: 'm08-frontend.js',
      resumen: 'Organización por funcionalidad y presupuesto de tamaño, los cuatro tipos de estado, servidor vs cliente, y composición con tokens.',
      lecciones: 4, minutos: 30 },

    { id: 'm09', titulo: 'Elegir el tamaño correcto', estado: 'listo', archivo: 'm09-tamano.js',
      resumen: 'El módulo bisagra: el costo real de la complejidad, escalar cuando duele, tecnología aburrida, y un método de seis preguntas con casos.',
      lecciones: 4, minutos: 31 },
  ],
});
