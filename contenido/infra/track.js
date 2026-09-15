/* ==========================================================================
   Track: Infraestructura y Cloud
   11 módulos · 44 lecciones. Completo.
   ========================================================================== */
ESTUDIO.registrarTrack({
  id: 'infra',
  titulo: 'Infraestructura y Cloud',
  subtitulo: 'Docker, Kubernetes, AWS, Cloudflare — y cuánto te va a costar realmente.',
  icono: '☁️',
  color: '#34d399',

  descripcion:
    '<p>El track más práctico. Todo lo que pasa entre "anda en mi máquina" y "anda para 10.000 personas ' +
    'sin que me llegue una factura absurda".</p>' +
    '<p>Incluye una comparativa honesta de plataformas: <b>Supabase vs Neon vs Cloudflare (D1/R2/Workers) vs AWS ' +
    'vs un VPS con Docker</b> — con números, no con opiniones. Vas a poder mirar un proyecto y saber cuál te ' +
    'conviene, y cuándo migrar deja de ser capricho y pasa a ser plata.</p>' +
    '<p><b>Al terminar vas a poder:</b> dockerizar cualquier proyecto, explicar qué resuelve Kubernetes y por qué ' +
    'probablemente no lo necesitás todavía, leer una factura de nube y saber qué la infló, y elegir stack de ' +
    'infraestructura con argumentos de costo y riesgo.</p>',

  siguientes: [
    { track: 'arquitectura', porQue: 'Si te faltó el porqué de las decisiones que desplegás, este track te lo da.' },
  ],

  modulos: [
    { id: 'm00', titulo: 'Cómo funciona un servidor, de verdad', estado: 'listo', archivo: 'm00-servidor.js',
      resumen: 'Procesos, puertos, DNS, HTTP, TLS y proxy inverso. La base que todos saltean.',
      lecciones: 4, minutos: 32 },

    { id: 'm01', titulo: 'Contenedores y Docker', estado: 'listo', archivo: 'm01-docker.js',
      resumen: 'Qué problema resuelve, capas y caché, multi-stage, volúmenes, Compose y qué cambia en producción.',
      lecciones: 4, minutos: 33 },

    { id: 'm02', titulo: 'Orquestación y Kubernetes', estado: 'listo', archivo: 'm02-kubernetes.js',
      resumen: 'Qué resuelve, sus piezas, despliegues y escalado — y el criterio honesto para saber si te hace falta.',
      lecciones: 4, minutos: 33 },

    { id: 'm03', titulo: 'El modelo mental de la nube', estado: 'listo', archivo: 'm03-nube.js',
      resumen: 'Quién administra qué, regiones y latencia, serverless con sus trampas, y hasta dónde sirve el edge.',
      lecciones: 4, minutos: 31 },

    { id: 'm04', titulo: 'AWS, lo que hay que saber', estado: 'listo', archivo: 'm04-aws.js',
      resumen: 'Los doce servicios que explican casi toda arquitectura, IAM en serio, VPC sin misterio y cómo no fundirte con la factura.',
      lecciones: 4, minutos: 31 },

    { id: 'm05', titulo: 'Cloudflare y el edge', estado: 'listo', archivo: 'm05-cloudflare.js',
      resumen: 'CDN y caché de verdad, R2 sin egreso, Workers/D1/KV/Durable Objects, y seguridad en el borde.',
      lecciones: 4, minutos: 31 },

    { id: 'm06', titulo: 'Bases de datos gestionadas', estado: 'listo', archivo: 'm06-bases.js',
      resumen: 'Qué te resuelven de verdad, el límite de conexiones, respaldos vs réplicas, y cómo elegir.',
      lecciones: 4, minutos: 32 },

    { id: 'm07', titulo: 'Cuánto cuesta realmente', estado: 'listo', archivo: 'm07-costos.js',
      resumen: 'El módulo de la plata: los cinco ejes, el egreso, la comparativa Supabase/Neon/Cloudflare/AWS/VPS y cuándo migrar.',
      lecciones: 4, minutos: 34 },

    { id: 'm08', titulo: 'Despliegue, CI/CD y entornos', estado: 'listo', archivo: 'm08-cicd.js',
      resumen: 'Pipelines que verifican de verdad, staging que ensaya el proceso, secretos y rotación, y volver atrás en segundos.',
      lecciones: 4, minutos: 31 },

    { id: 'm09', titulo: 'Observabilidad y resiliencia', estado: 'listo', archivo: 'm09-observabilidad.js',
      resumen: 'Logs, métricas y trazas, alertas que no se ignoran (SLO y presupuesto de error), timeouts/reintentos/cortacircuitos y postmortems.',
      lecciones: 4, minutos: 30 },

    { id: 'm10', titulo: 'Seguridad de infraestructura', estado: 'listo', archivo: 'm10-seguridad.js',
      resumen: 'Mínimo privilegio, superficie de ataque y red, respaldos que de verdad restauran, y cadena de suministro.',
      lecciones: 4, minutos: 30 },
  ],
});
