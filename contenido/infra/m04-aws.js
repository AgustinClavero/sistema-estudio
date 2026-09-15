/* ==========================================================================
   Infra · Módulo 04 — AWS, lo que hay que saber
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'infra',
  id: 'm04',
  titulo: 'AWS, lo que hay que saber',
  fuentes: ['aws-precios', 'postgres', 'docker', '12factor'],

  intro:
    '<p>AWS tiene más de doscientos servicios. En la práctica, <b>ocho o diez</b> cubren casi todo lo que hace ' +
    'un producto normal, y el resto son casos especiales o formas alternativas de hacer lo mismo.</p>' +
    '<p>Este módulo no intenta enseñarte AWS entero. Apunta a que puedas <b>leer una arquitectura de AWS y ' +
    'entenderla</b>, saber qué pieza hace qué, y —sobre todo— <b>no fundirte</b>. Lo que aprendas acá se traduce ' +
    'casi uno a uno a los otros grandes proveedores.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'El mapa: los servicios que se usan de verdad',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> los nombres de AWS son opacos a propósito, pero
detrás de cada uno hay una cosa que ya conocés.</div>

<h4>La traducción</h4>
<table>
<tr><th>Servicio</th><th>Qué es, en criollo</th></tr>
<tr><td><b>EC2</b></td><td>Una máquina virtual. Un servidor que alquilás por hora.</td></tr>
<tr><td><b>S3</b></td><td>Almacenamiento de archivos. El original que todos copian.</td></tr>
<tr><td><b>RDS</b></td><td>Base de datos gestionada: Postgres o MySQL que administran ellos.</td></tr>
<tr><td><b>Lambda</b></td><td>Serverless: tu función corre cuando llega una petición.</td></tr>
<tr><td><b>CloudFront</b></td><td>El CDN.</td></tr>
<tr><td><b>IAM</b></td><td>Quién puede hacer qué. El que hay que entender sí o sí.</td></tr>
<tr><td><b>VPC</b></td><td>Tu red privada dentro de AWS.</td></tr>
<tr><td><b>ECS / Fargate</b></td><td>Correr contenedores sin administrar servidores.</td></tr>
<tr><td><b>EKS</b></td><td>Kubernetes gestionado.</td></tr>
<tr><td><b>SQS</b></td><td>Una cola de mensajes.</td></tr>
<tr><td><b>CloudWatch</b></td><td>Logs, métricas y alarmas.</td></tr>
<tr><td><b>Route 53</b></td><td>DNS.</td></tr>
</table>

<div class="aviso"><strong>Con esos doce se entiende la enorme mayoría de las arquitecturas.</strong> Si en una
entrevista te muestran un diagrama de AWS, casi seguro está armado con estas piezas más algún servicio
específico del dominio.</div>

<h4>Las tres formas de correr tu código</h4>
<p>Es la decisión que más veces aparece, y se puede resumir así:</p>
<ul>
<li><b>EC2</b> — control total, y administrás todo: sistema operativo, parches, escalado. Más barato por unidad, más caro en tiempo.</li>
<li><b>Fargate</b> — le das un contenedor y lo corre. Sin servidores que administrar. <b>El punto medio, y casi siempre la respuesta correcta.</b></li>
<li><b>Lambda</b> — le das una función. Escala solo, cobra por ejecución, y tiene límites de tiempo y de tamaño.</li>
</ul>

<h4>Lo que hay que activar el primer día</h4>
<ol>
<li><b>Alerta de facturación</b> — antes que cualquier otra cosa.</li>
<li><b>Segundo factor</b> en la cuenta raíz, y <b>no usarla nunca más</b>.</li>
<li>Un usuario propio con permisos acotados, para el día a día.</li>
<li>Registro de auditoría activado.</li>
</ol>
<p>Los dos primeros son los que evitan los dos desastres clásicos: la factura sorpresa y la cuenta raíz
comprometida.</p>
`,

      tecnico: `
<h4>Elegir dónde corre el código</h4>
<table>
<tr><th></th><th>EC2</th><th>Fargate</th><th>Lambda</th></tr>
<tr><td>Administrás</td><td>Todo</td><td>El contenedor</td><td>La función</td></tr>
<tr><td>Arranque en frío</td><td>No</td><td>Segundos al escalar</td><td>Sí, por invocación</td></tr>
<tr><td>Tiempo máximo</td><td>Sin límite</td><td>Sin límite</td><td>15 minutos</td></tr>
<tr><td>Costo con tráfico constante</td><td><b>El más bajo</b></td><td>Medio</td><td>Alto</td></tr>
<tr><td>Costo con tráfico esporádico</td><td>Alto: pagás igual</td><td>Medio</td><td><b>El más bajo</b></td></tr>
<tr><td>Escala a cero</td><td>No</td><td>Con configuración</td><td>Sí</td></tr>
</table>

<div class="dato"><strong>La regla práctica que resume la tabla:</strong> tráfico <b>constante</b> favorece
instancias siempre encendidas; tráfico <b>esporádico o muy variable</b> favorece serverless. El error caro es
elegir Lambda para una API con tráfico sostenido: termina costando bastante más que un contenedor chico
encendido todo el día, porque estás pagando por invocación algo que ya estaría encendido igual.</div>

<h4>El detalle de Lambda con base de datos</h4>
<p>Es la trampa que ya viste en el módulo de la nube, y en AWS tiene nombre propio. Cada invocación
concurrente de Lambda es <b>un entorno de ejecución distinto</b> con sus propias conexiones. Con 500
invocaciones concurrentes y un pool de 10 por entorno, pedís 5.000 conexiones a una base que acepta 100.</p>
<pre><code>· RDS Proxy         ← intermediario que agrupa conexiones. Cuesta, y lo vale.
· Aurora Serverless con API de datos (por HTTP, sin conexiones persistentes)
· Pool de tamaño 1 por entorno de ejecución
· Reserva de concurrencia para acotar el máximo</code></pre>

<h4>Almacenamiento: las clases importan</h4>
<table>
<tr><th>Clase de S3</th><th>Para qué</th><th>Costo relativo</th></tr>
<tr><td>Standard</td><td>Acceso frecuente</td><td>Base</td></tr>
<tr><td>Intelligent-Tiering</td><td>Patrón desconocido: mueve solo</td><td>Base + tarifa chica</td></tr>
<tr><td>Standard-IA</td><td>Acceso poco frecuente</td><td>~45% menos, con cargo por recuperación</td></tr>
<tr><td>Glacier</td><td>Archivo, recuperación en minutos u horas</td><td>~80% menos</td></tr>
</table>

<div class="dato"><strong>Intelligent-Tiering es la opción por defecto razonable</strong> cuando no sabés cómo
se van a acceder los objetos: mueve cada uno de clase según su uso real, por una tarifa de monitoreo muy chica.
Pasar todo a IA "para ahorrar" y después descubrir que se accede seguido sale <b>más caro</b> que Standard,
por los cargos de recuperación.</div>

<h4>RDS: lo que se decide una vez y pesa siempre</h4>
<ul>
<li><b>Multi-AZ</b> — réplica en otra zona con conmutación automática. Duplica el costo de cómputo. Vale para producción con usuarios reales.</li>
<li><b>Almacenamiento</b> — <code>gp3</code> permite ajustar rendimiento y capacidad por separado; <code>gp2</code> los ata.</li>
<li><b>Retención de respaldos</b> — el default suele ser corto. Subirlo a 7-30 días es barato.</li>
<li><b>Cifrado</b> — <b>hay que activarlo al crear</b>. Agregarlo después exige recrear la instancia.</li>
</ul>
<p>Ese último punto es el que más se lamenta: parece un detalle al crear la base y es una migración completa
seis meses más tarde.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS TRES FORMAS DE CORRER TU CÓDIGO</text>

  <rect x="24" y="34" width="200" height="116" rx="10" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="124" y="56" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">EC2</text>
  <text x="124" y="76" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">una máquina virtual</text>
  <text x="44" y="98" fill="currentColor" opacity=".65" font-size="9.5">· control total</text>
  <text x="44" y="114" fill="#f87171" font-size="9.5">· administrás SO, parches, escalado</text>
  <text x="44" y="132" fill="#34d399" font-size="9.5" font-weight="700">· el más barato con tráfico constante</text>
  <text x="44" y="146" fill="#f87171" font-size="9.5">· no escala a cero</text>

  <rect x="240" y="34" width="200" height="116" rx="10" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.8"/>
  <text x="340" y="56" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">FARGATE</text>
  <text x="340" y="76" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">le das un contenedor</text>
  <text x="260" y="98" fill="currentColor" opacity=".65" font-size="9.5">· sin servidores que administrar</text>
  <text x="260" y="114" fill="currentColor" opacity=".65" font-size="9.5">· sin límite de tiempo</text>
  <text x="260" y="132" fill="#34d399" font-size="10" font-weight="700">EL PUNTO MEDIO — y casi siempre</text>
  <text x="260" y="146" fill="#34d399" font-size="10" font-weight="700">la respuesta correcta</text>

  <rect x="456" y="34" width="200" height="116" rx="10" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="556" y="56" text-anchor="middle" fill="#7c5cff" font-size="12" font-weight="700">LAMBDA</text>
  <text x="556" y="76" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">le das una función</text>
  <text x="476" y="98" fill="#34d399" font-size="9.5">· escala a cero</text>
  <text x="476" y="114" fill="#f87171" font-size="9.5">· arranque en frío · máx 15 min</text>
  <text x="476" y="132" fill="#34d399" font-size="9.5" font-weight="700">· el más barato si es esporádico</text>
  <text x="476" y="146" fill="#f87171" font-size="9.5" font-weight="700">· el más caro si es constante</text>

  <rect x="24" y="160" width="632" height="28" rx="7" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.3"/>
  <text x="340" y="178" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">
    El error caro: Lambda para una API con tráfico sostenido. Pagás por invocación algo que estaría encendido igual.</text>

  <line x1="24" y1="206" x2="656" y2="206" stroke="currentColor" opacity=".18"/>

  <text x="24" y="230" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA TRAMPA DE LAMBDA + BASE DE DATOS</text>

  <rect x="24" y="242" width="180" height="62" rx="9" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="114" y="264" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">500 invocaciones</text>
  <text x="114" y="280" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">concurrentes</text>
  <text x="114" y="296" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">cada una es un entorno propio</text>

  <text x="212" y="278" fill="currentColor" opacity=".4" font-size="14">×</text>

  <rect x="228" y="242" width="180" height="62" rx="9" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="318" y="264" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">pool de 10</text>
  <text x="318" y="280" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">por entorno</text>

  <text x="416" y="278" fill="currentColor" opacity=".4" font-size="14">=</text>

  <rect x="432" y="242" width="224" height="62" rx="9" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.6"/>
  <text x="544" y="264" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">5.000 conexiones pedidas</text>
  <text x="544" y="282" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">a una base que acepta 100</text>
  <text x="544" y="298" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">fix: RDS Proxy · pool de 1 · reserva de concurrencia</text>

  <rect x="24" y="318" width="632" height="68" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="44" y="340" fill="#34d399" font-size="12" font-weight="700">LO QUE SE ACTIVA EL PRIMER DÍA, ANTES QUE NADA</text>
  <text x="44" y="362" fill="currentColor" opacity=".78" font-size="11">
    1 · <tspan font-weight="700">Alerta de facturación</tspan>   2 · <tspan font-weight="700">Segundo factor en la cuenta raíz</tspan> — y no usarla nunca más</text>
  <text x="44" y="380" fill="currentColor" opacity=".78" font-size="11">
    3 · Un usuario propio con permisos acotados   4 · Registro de auditoría activado</text>
</svg>`,
        pie: 'Doce servicios explican casi toda arquitectura de AWS que te vayan a mostrar.',
      },

      entrevista: [
        { p: '¿Cuándo usarías EC2, Fargate o Lambda?',
          r: '<b>Fargate</b> es casi siempre la respuesta correcta: le das un contenedor y lo corre, sin servidores que administrar y sin límite de ' +
             'tiempo. <b>EC2</b> cuando necesito control total del sistema operativo o cuando el tráfico es tan constante que el costo por unidad ' +
             'justifica administrar la máquina. <b>Lambda</b> cuando el tráfico es esporádico o muy variable y quiero escalar a cero. ' +
             'La regla es: <b>tráfico constante favorece instancias encendidas, tráfico esporádico favorece serverless</b>.' },

        { p: '¿Cuál es el error caro más común al elegir Lambda?',
          r: 'Usarla para una <b>API con tráfico sostenido</b>. Termina costando bastante más que un contenedor chico encendido todo el día, porque ' +
             'estás pagando por invocación algo que ya estaría encendido igual. Y el segundo error es <b>Lambda contra una base relacional</b>: ' +
             'cada invocación concurrente es un entorno propio con sus conexiones, así que 500 concurrentes con un pool de 10 piden 5.000 conexiones ' +
             'a una base que acepta 100. Se resuelve con RDS Proxy, con pool de tamaño 1, o con reserva de concurrencia.' },

        { p: '¿Qué decisiones de RDS pesan para siempre?',
          r: 'Cuatro. <b>Multi-AZ</b>, que duplica el costo de cómputo y da conmutación automática — vale para producción con usuarios reales. ' +
             'El <b>tipo de almacenamiento</b>: <code>gp3</code> permite ajustar rendimiento y capacidad por separado, <code>gp2</code> los ata. ' +
             'La <b>retención de respaldos</b>, cuyo default suele ser corto y subirlo es barato. Y sobre todo el <b>cifrado</b>: ' +
             '<b>hay que activarlo al crear la instancia</b>, porque agregarlo después exige recrearla. Es el que más se lamenta: ' +
             'parece un detalle al principio y es una migración completa seis meses después.' },

        { p: '¿Qué activarías el primer día en una cuenta de AWS?',
          r: 'Una <b>alerta de facturación</b>, antes que cualquier otra cosa. <b>Segundo factor en la cuenta raíz</b>, y no volver a usarla nunca: ' +
             'la raíz puede cerrar la cuenta y saltear cualquier política. Un <b>usuario propio con permisos acotados</b> para el día a día. ' +
             'Y el <b>registro de auditoría</b> activado, para tener trazabilidad de quién hizo qué. Los dos primeros son los que evitan los dos ' +
             'desastres clásicos: la factura sorpresa y la cuenta raíz comprometida.' },
      ],

      practica: `
<h4>Alerta de facturación, lo primero de todo</h4>
<pre><code>aws budgets create-budget --account-id CUENTA --budget '{
  "BudgetName": "mensual",
  "BudgetLimit": { "Amount": "100", "Unit": "USD" },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}' --notifications-with-subscribers '[{
  "Notification": {
    "NotificationType": "FORECASTED",
    "ComparisonOperator": "GREATER_THAN",
    "Threshold": 80
  },
  "Subscribers": [{ "SubscriptionType": "EMAIL", "Address": "vos@dominio.com" }]
}]'</code></pre>

<div class="aviso"><strong>Usar <code>FORECASTED</code> y no <code>ACTUAL</code> es la diferencia
importante.</strong> La alerta por gasto real te avisa cuando ya gastaste; la de proyección te avisa cuando
<b>vas camino</b> a gastarlo. Con un recurso que se dejó encendido, esa diferencia son varios días de margen.</div>

<h4>Una arquitectura mínima y sensata</h4>
<pre><code>Route 53 (DNS)
   ↓
CloudFront (CDN + certificado)
   ↓
ALB (balanceador)                  ← subred pública
   ↓
ECS Fargate (2 tareas)             ← subred privada
   ↓
RDS Postgres (Multi-AZ)            ← subred privada, sin acceso público
   +
S3 (archivos) · SQS (cola) · CloudWatch (logs y alarmas)</code></pre>
<p>Eso cubre un producto real. Todo lo demás es optimización o casos particulares.</p>

<h4>Reglas de ciclo de vida en S3</h4>
<pre><code>{
  "Rules": [
    { "ID": "abortar-multiparte",
      "Status": "Enabled",
      "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 } },

    { "ID": "temporales",
      "Status": "Enabled",
      "Filter": { "Prefix": "temp/" },
      "Expiration": { "Days": 1 } },

    { "ID": "archivar-viejos",
      "Status": "Enabled",
      "Transitions": [{ "Days": 90, "StorageClass": "GLACIER_IR" }] }
  ]
}</code></pre>
<p>La primera regla es la más olvidada: las subidas multiparte incompletas ocupan espacio y <b>no aparecen al
listar el bucket</b>.</p>

<h4>Checklist de cuenta nueva</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Presupuesto con alerta por <b>proyección</b> al 80%</td></tr>
<tr><td>☐</td><td>Segundo factor en la raíz; sin claves de acceso en la raíz</td></tr>
<tr><td>☐</td><td>Usuario propio con permisos acotados</td></tr>
<tr><td>☐</td><td>Registro de auditoría activado en todas las regiones</td></tr>
<tr><td>☐</td><td>Bloqueo de acceso público a S3 a nivel cuenta</td></tr>
<tr><td>☐</td><td>Cifrado activado <b>al crear</b> RDS</td></tr>
<tr><td>☐</td><td>Etiquetas de proyecto y entorno en todo recurso</td></tr>
</table>
`,

      errores: [
        { mito: 'Lambda siempre sale más barato.',
          realidad: 'Con <b>tráfico sostenido</b> sale bastante más caro que un contenedor chico encendido: pagás por invocación algo que estaría ' +
                    'encendido igual. Lambda gana con tráfico esporádico o muy variable, donde escalar a cero importa.' },

        { mito: 'Conecto Lambda a RDS y listo.',
          realidad: 'Cada invocación concurrente es <b>un entorno propio con sus conexiones</b>. 500 concurrentes con pool de 10 piden 5.000 conexiones ' +
                    'a una base que acepta 100. Hace falta RDS Proxy, pool de 1, o reserva de concurrencia.' },

        { mito: 'El cifrado de RDS lo activo después.',
          realidad: '<b>No se puede</b>: hay que recrear la instancia. Lo que parece un detalle al crear la base es una migración completa seis meses ' +
                    'más tarde, con ventana de mantenimiento incluida.' },

        { mito: 'Paso todo a Standard-IA para ahorrar.',
          realidad: 'IA cobra por <b>recuperación</b>. Si los objetos se acceden seguido, sale <b>más caro</b> que Standard. Cuando no sabés el patrón ' +
                    'de acceso, <b>Intelligent-Tiering</b> mueve cada objeto solo por una tarifa de monitoreo muy chica.' },
      ],

      glosario: [
        { t: 'EC2', d: 'Máquinas virtuales. Control total y administración total.' },
        { t: 'Fargate', d: 'Ejecutar contenedores sin administrar servidores. El punto medio.' },
        { t: 'Lambda', d: 'Funciones que corren por invocación. Escalan a cero, con límite de 15 minutos.' },
        { t: 'RDS', d: 'Base de datos relacional gestionada.' },
        { t: 'Multi-AZ', d: 'Réplica en otra zona con conmutación automática. Duplica el costo de cómputo.' },
        { t: 'RDS Proxy', d: 'Intermediario que agrupa conexiones. Resuelve el problema de Lambda con bases.' },
        { t: 'Clase de almacenamiento', d: 'Nivel de S3 según frecuencia de acceso, con distinto costo.' },
        { t: 'Intelligent-Tiering', d: 'Clase que mueve cada objeto según su uso real.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'IAM: el que hay que entender sí o sí',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> IAM es <b>quién puede hacer qué sobre qué</b>. Es
el servicio más importante de AWS y el que más gente evita entender, resolviendo todo con permisos amplios.</div>

<h4>Las cuatro piezas</h4>
<ul>
<li><b>Usuario</b> — una persona, con contraseña y quizás claves de acceso.</li>
<li><b>Grupo</b> — conjunto de usuarios que comparten permisos.</li>
<li><b>Rol</b> — un conjunto de permisos que algo <b>asume temporalmente</b>. Es la pieza clave.</li>
<li><b>Política</b> — el documento que dice qué acciones se permiten sobre qué recursos.</li>
</ul>

<div class="aviso"><strong>La diferencia entre usuario y rol es la que hay que entender.</strong> Un usuario
tiene <b>credenciales permanentes</b> que hay que guardar en algún lado — y ahí es donde se filtran. Un rol se
asume y otorga credenciales <b>temporales que vencen solas</b>. Por eso la recomendación es siempre la misma:
<b>roles para todo lo que sea máquina</b>, y usuarios solo para personas.</div>

<h4>Cómo se lee una política</h4>
<pre><code>{
  "Effect": "Allow",                       ← permitir o denegar
  "Action": "s3:GetObject",                ← qué se puede hacer
  "Resource": "arn:aws:s3:::mi-bucket/*"   ← sobre qué
}</code></pre>
<p>Se lee: "permitir descargar objetos, de este bucket". Tres campos y ya podés leer la mayoría.</p>

<h4>Las dos reglas de evaluación</h4>
<ol>
<li><b>Todo está denegado por defecto.</b> Sin un <code>Allow</code> explícito, no se puede.</li>
<li><b>Un <code>Deny</code> explícito gana siempre</b>, por encima de cualquier <code>Allow</code>.</li>
</ol>
<p>Ese segundo punto es útil para poner barreras absolutas: por ejemplo, denegar el borrado de los respaldos a
todo el mundo salvo a un rol específico. <b>Nadie lo puede saltear ampliándose los permisos</b>, porque el
<code>Deny</code> gana.</p>
`,

      tecnico: `
<h4>El comodín, y por qué se cuela</h4>
<pre><code>// ❌ Lo que se escribe cuando algo no funciona y hay apuro
{ "Effect": "Allow", "Action": "s3:*", "Resource": "*" }

// ✔ Lo que corresponde
{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::mi-bucket/uploads/*"
}</code></pre>

<div class="dato"><strong>El comodín en <code>Resource</code> es peor que en <code>Action</code>.</strong>
<code>"Action": "s3:*"</code> sobre un bucket acotado es discutible pero contenido;
<code>"Resource": "*"</code> significa <b>todos los buckets de la cuenta</b>, incluidos los de respaldos y los
de otros proyectos. Si tenés que dejar un comodín en algún lado, que sea en la acción.</div>

<h4>Roles: el patrón correcto</h4>
<pre><code>// Una tarea de ECS asume un rol. No hay claves guardadas en ningún lado.
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "ecs-tasks.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}</code></pre>
<p>El SDK toma las credenciales del entorno automáticamente y <b>las rota solo</b>. No hay clave que filtrar,
que rotar ni que guardar.</p>

<h4>Federación desde CI</h4>
<p>Antes, conectar un pipeline a AWS significaba crear un usuario, generar claves y guardarlas como secretos —
credenciales permanentes con acceso a producción, sentadas en un repositorio.</p>
<p>Hoy se hace con <b>OIDC</b>: el proveedor de CI presenta un token firmado y AWS le da credenciales
temporales, con una condición que limita <b>qué repositorio y qué rama</b> pueden asumir el rol:</p>
<pre><code>"Condition": {
  "StringEquals": {
    "token.actions.githubusercontent.com:sub":
      "repo:MI-ORG/MI-REPO:ref:refs/heads/main"
  }
}</code></pre>

<div class="dato"><strong>Esa condición es lo que hace que valga la pena.</strong> Sin ella, cualquier
repositorio del proveedor podría asumir el rol. Con ella, solo la rama <code>main</code> de tu repositorio — y
<b>no hay ninguna credencial permanente que filtrar</b>. Es de las mejoras de seguridad con mejor relación
beneficio/esfuerzo que hay en AWS.</div>

<h4>Barreras que nadie puede saltear</h4>
<pre><code>// Denegar el borrado de respaldos, salvo a un rol específico.
// Un Deny explícito gana sobre cualquier Allow, así que ni un
// administrador puede ampliarse los permisos para hacerlo.
{
  "Effect": "Deny",
  "Action": ["s3:DeleteObject", "s3:DeleteBucket"],
  "Resource": "arn:aws:s3:::mis-respaldos/*",
  "Condition": {
    "StringNotEquals": { "aws:PrincipalArn": "arn:aws:iam::CUENTA:role/respaldos" }
  }
}</code></pre>

<h4>La cuenta raíz</h4>
<p>Es la que creó la cuenta. Puede hacer <b>todo</b>, incluido cerrar la cuenta y saltear cualquier política de
la organización. Por eso:</p>
<ul>
<li>Segundo factor obligatorio, preferentemente con una llave física.</li>
<li><b>Cero claves de acceso</b>. Si existen, borralas.</li>
<li>No se usa para el trabajo diario. Nunca.</li>
<li>Alerta si alguien inicia sesión con ella.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="ia1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    USUARIO vs ROL — la diferencia que hay que entender</text>

  <rect x="24" y="34" width="304" height="102" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="56" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">USUARIO</text>
  <text x="44" y="78" fill="currentColor" opacity=".72" font-size="10.5">credenciales PERMANENTES</text>
  <text x="44" y="96" fill="currentColor" opacity=".72" font-size="10.5">hay que guardarlas en algún lado…</text>
  <text x="44" y="114" fill="#f87171" font-size="10.5" font-weight="700">…y ahí es donde se filtran</text>
  <text x="44" y="130" fill="currentColor" opacity=".6" font-size="9.5">solo para PERSONAS</text>

  <rect x="352" y="34" width="304" height="102" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="504" y="56" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">ROL</text>
  <text x="372" y="78" fill="currentColor" opacity=".72" font-size="10.5">se ASUME temporalmente</text>
  <text x="372" y="96" fill="#34d399" font-size="10.5" font-weight="700">credenciales que vencen solas</text>
  <text x="372" y="114" fill="#34d399" font-size="10.5" font-weight="700">nada que guardar, filtrar ni rotar</text>
  <text x="372" y="130" fill="currentColor" opacity=".6" font-size="9.5">para TODO lo que sea máquina</text>

  <line x1="24" y1="154" x2="656" y2="154" stroke="currentColor" opacity=".18"/>

  <text x="24" y="178" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CÓMO SE LEE UNA POLÍTICA — tres campos y ya podés leer la mayoría</text>

  <rect x="24" y="190" width="196" height="52" rx="9" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="122" y="210" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">Effect</text>
  <text x="122" y="228" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">Allow o Deny</text>

  <rect x="234" y="190" width="196" height="52" rx="9" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="332" y="210" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">Action</text>
  <text x="332" y="228" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">qué se puede hacer</text>

  <rect x="444" y="190" width="212" height="52" rx="9" fill="#f87171" fill-opacity=".16" stroke="#f87171" stroke-width="1.5"/>
  <text x="550" y="210" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">Resource</text>
  <text x="550" y="228" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">acá el comodín es lo peor</text>

  <text x="24" y="262" fill="currentColor" opacity=".7" font-size="10.5">
    <tspan font-family="monospace" fill="#f87171">"Resource": "*"</tspan> = TODOS los buckets de la cuenta, incluidos respaldos y otros proyectos.</text>
  <text x="24" y="278" fill="#34d399" font-size="10.5" font-weight="700">
    Si tenés que dejar un comodín en algún lado, que sea en la acción — nunca en el recurso.</text>

  <rect x="24" y="292" width="304" height="94" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="176" y="314" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">LAS DOS REGLAS</text>
  <text x="44" y="336" fill="currentColor" opacity=".72" font-size="10.5">1 · todo denegado por defecto</text>
  <text x="44" y="356" fill="#7c5cff" font-size="10.5" font-weight="700">2 · un Deny explícito GANA SIEMPRE</text>
  <text x="44" y="374" fill="currentColor" opacity=".6" font-size="9.5">→ sirve para barreras que nadie puede saltear</text>

  <rect x="352" y="292" width="304" height="94" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="504" y="314" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">CI SIN CREDENCIALES: OIDC</text>
  <text x="372" y="336" fill="currentColor" opacity=".72" font-size="10.5">el pipeline presenta un token firmado</text>
  <text x="372" y="354" fill="currentColor" opacity=".72" font-size="10.5">AWS le da credenciales temporales</text>
  <text x="372" y="374" fill="#34d399" font-size="10.5" font-weight="700">condición: solo ESE repo y ESA rama</text>
</svg>`,
        pie: 'Roles para máquinas, usuarios para personas. Y el comodín, nunca en el recurso.',
      },

      entrevista: [
        { p: '¿Cuál es la diferencia entre un usuario y un rol de IAM?',
          r: 'Un <b>usuario</b> tiene credenciales <b>permanentes</b> que hay que guardar en algún lado — y ahí es donde se filtran. Un <b>rol</b> se ' +
             'asume y otorga credenciales <b>temporales que vencen solas</b>: no hay nada que guardar, rotar ni filtrar. Por eso la recomendación es ' +
             'siempre la misma: <b>roles para todo lo que sea máquina</b> —tareas, funciones, pipelines— y usuarios solo para personas. ' +
             'Es probablemente el cambio de práctica que más reduce el riesgo en una cuenta de AWS.' },

        { p: '¿Cómo se evalúan las políticas de IAM?',
          r: 'Con dos reglas. <b>Todo está denegado por defecto</b>: sin un <code>Allow</code> explícito, no se puede. Y <b>un <code>Deny</code> ' +
             'explícito gana siempre</b>, por encima de cualquier <code>Allow</code>. Esa segunda regla es muy útil para poner barreras absolutas: ' +
             'por ejemplo, denegar el borrado de los respaldos a todo el mundo salvo a un rol específico. <b>Ni un administrador puede saltearla ' +
             'ampliándose los permisos</b>, porque el <code>Deny</code> gana.' },

        { p: '¿Por qué el comodín en Resource es peor que en Action?',
          r: 'Porque <code>"Action": "s3:*"</code> sobre un bucket acotado es discutible pero <b>contenido</b>: como mucho podés hacer cualquier cosa ' +
             'en ese bucket. En cambio <code>"Resource": "*"</code> significa <b>todos los buckets de la cuenta</b>, incluidos los de respaldos y los ' +
             'de otros proyectos. Si por alguna razón hay que dejar un comodín, que sea en la acción y nunca en el recurso.' },

        { p: '¿Cómo conectás un pipeline de CI a AWS sin guardar credenciales?',
          r: 'Con <b>federación OIDC</b>. El proveedor de CI presenta un token firmado y AWS devuelve credenciales <b>temporales</b>, así que no hay ' +
             'ninguna clave permanente guardada como secreto del repositorio. Y lo que lo hace realmente seguro es la <b>condición</b> que limita ' +
             'qué repositorio y qué rama pueden asumir el rol: sin eso, cualquier repositorio del proveedor podría hacerlo. ' +
             'Es de las mejoras con mejor relación beneficio/esfuerzo que hay en AWS.' },
      ],

      practica: `
<h4>Rol para CI, con federación</h4>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::CUENTA:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        "token.actions.githubusercontent.com:sub":
          "repo:MI-ORG/MI-REPO:ref:refs/heads/main"
      }
    }
  }]
}</code></pre>

<div class="aviso"><strong>Sin el segundo <code>StringEquals</code>, cualquier repositorio del proveedor podría
asumir tu rol.</strong> Es el error más peligroso al configurar OIDC, y no da ningún síntoma: todo funciona
igual de bien, solo que la puerta quedó abierta para todo el mundo.</div>

<h4>Encontrar permisos excesivos</h4>
<pre><code># Analizador de acceso: detecta recursos compartidos fuera de la cuenta
aws accessanalyzer list-findings --analyzer-arn ARN

# Última vez que se usó cada permiso de un rol
aws iam generate-service-last-accessed-details --arn ARN_DEL_ROL
# → todo lo que no se usó en 90 días es candidato a sacar</code></pre>

<div class="dato"><strong>La segunda consulta es la forma menos dolorosa de achicar permisos.</strong> En vez
de adivinar qué hace falta, te dice qué <b>no se usó nunca</b> — y eso se puede sacar con muy poco riesgo.</div>

<h4>Política de un servicio, acotada de verdad</h4>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "SubirYLeerAdjuntos",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::mi-app-adjuntos/*" },

    { "Sid": "LeerSecretosPropios",
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:*:*:secret:mi-app/*" },

    { "Sid": "NuncaBorrarRespaldos",
      "Effect": "Deny",
      "Action": "s3:DeleteObject",
      "Resource": "arn:aws:s3:::mis-respaldos/*" }
  ]
}</code></pre>

<h4>Checklist de IAM</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Cuenta raíz con segundo factor y <b>sin claves de acceso</b></td></tr>
<tr><td>☐</td><td><b>Roles</b> para servicios; usuarios solo para personas</td></tr>
<tr><td>☐</td><td>CI por OIDC, <b>con condición de repositorio y rama</b></td></tr>
<tr><td>☐</td><td>Sin <code>"Resource": "*"</code> fuera de casos justificados</td></tr>
<tr><td>☐</td><td>Barreras con <code>Deny</code> sobre respaldos y recursos críticos</td></tr>
<tr><td>☐</td><td>Revisión de permisos sin usar cada 90 días</td></tr>
<tr><td>☐</td><td>Alerta si alguien inicia sesión con la cuenta raíz</td></tr>
</table>
`,

      errores: [
        { mito: 'Creo un usuario con claves para que el servicio acceda.',
          realidad: 'Son <b>credenciales permanentes</b> que hay que guardar en algún lado, y ahí se filtran. Un <b>rol</b> da credenciales temporales ' +
                    'que vencen solas: nada que guardar, rotar ni filtrar.' },

        { mito: 'Pongo "Resource": "*" para que funcione y después lo ajusto.',
          realidad: 'Eso es <b>todos los buckets de la cuenta</b>, incluidos respaldos y otros proyectos. Y el ajuste no llega nunca. ' +
                    'Si hay que dejar un comodín, que sea en la <b>acción</b>, no en el recurso.' },

        { mito: 'Configuré OIDC, ya no tengo credenciales expuestas.',
          realidad: 'Solo si pusiste la <b>condición de repositorio y rama</b>. Sin ella, <b>cualquier repositorio</b> del proveedor puede asumir tu ' +
                    'rol — y no da ningún síntoma: todo funciona igual, con la puerta abierta.' },

        { mito: 'La cuenta raíz la uso solo para cosas administrativas.',
          realidad: 'Puede hacer <b>todo</b>, incluido cerrar la cuenta y saltear cualquier política de la organización. Segundo factor, cero claves de ' +
                    'acceso, alerta al iniciar sesión, y no usarla para el día a día.' },
      ],

      glosario: [
        { t: 'IAM', d: 'Servicio de identidades y permisos de AWS.' },
        { t: 'Política', d: 'Documento que declara qué acciones se permiten o deniegan sobre qué recursos.' },
        { t: 'Rol', d: 'Conjunto de permisos que una identidad asume temporalmente.' },
        { t: 'ARN', d: 'Identificador único de un recurso de AWS.' },
        { t: 'Deny explícito', d: 'Regla de denegación que gana sobre cualquier permiso.' },
        { t: 'OIDC', d: 'Federación por token firmado, sin credenciales permanentes.' },
        { t: 'Cuenta raíz', d: 'Identidad original de la cuenta. Puede todo, incluso cerrarla.' },
        { t: 'Analizador de acceso', d: 'Herramienta que detecta recursos accesibles desde fuera de la cuenta.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'VPC: la red, sin misterio',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> una VPC es <b>tu red privada</b> dentro de AWS.
Todo lo que confunde de ella se entiende con tres conceptos: subredes, tablas de rutas y grupos de seguridad.</div>

<h4>Los tres conceptos</h4>

<p><b>Subred pública</b> — tiene una ruta hacia internet. Ahí va lo que tiene que ser alcanzable desde afuera:
el balanceador, y poco más.</p>

<p><b>Subred privada</b> — <b>no</b> tiene ruta directa desde internet. Ahí va todo lo demás: la aplicación, la
base, la caché.</p>

<p><b>Grupo de seguridad</b> — un firewall alrededor de cada recurso. Dice quién puede conectarse y a qué
puerto.</p>

<div class="aviso"><strong>La diferencia entre pública y privada no es un atributo de la subred:</strong> es
literalmente si su <b>tabla de rutas</b> tiene una salida a internet o no. Suena a tecnicismo y ordena todo:
cuando algo "no tiene internet" o "es alcanzable y no debería", la respuesta casi siempre está en la tabla de
rutas.</div>

<h4>El diseño estándar</h4>
<pre><code>VPC 10.0.0.0/16

  Subred pública  (zona A)  10.0.1.0/24  → balanceador
  Subred pública  (zona B)  10.0.2.0/24  → balanceador

  Subred privada  (zona A)  10.0.11.0/24 → aplicación
  Subred privada  (zona B)  10.0.12.0/24 → aplicación

  Subred aislada  (zona A)  10.0.21.0/24 → base de datos
  Subred aislada  (zona B)  10.0.22.0/24 → base de datos</code></pre>

<p>Dos zonas para tolerar que una se caiga. Tres niveles: lo que se alcanza desde afuera, lo que necesita
salir pero no entrar, y lo que no necesita nada de internet.</p>

<h4>Los grupos de seguridad se encadenan</h4>
<p>Esto es lo más elegante de AWS y lo que más se subutiliza: un grupo de seguridad puede referirse a
<b>otro grupo</b> en vez de a un rango de direcciones.</p>
<pre><code>Grupo "base de datos":
  permitir 5432 desde  →  grupo "aplicación"</code></pre>
<p>No hace falta saber qué IP tiene la aplicación. Si escala a veinte instancias, todas quedan permitidas
automáticamente, <b>y nada más</b>.</p>
`,

      tecnico: `
<h4>La pieza que sorprende en la factura: NAT</h4>
<p>Una subred privada no puede salir a internet por sí sola. Para que la aplicación pueda llamar a una API
externa hace falta una pasarela NAT. Y esa pasarela:</p>
<ul>
<li>Cobra <b>por hora</b>, esté o no en uso.</li>
<li>Cobra <b>por cada GB procesado</b>.</li>
<li>Se necesita <b>una por zona</b> para tener alta disponibilidad.</li>
</ul>

<div class="dato"><strong>Es una de las líneas que más veces aparece en una factura sin que nadie sepa qué
es.</strong> Dos pasarelas NAT encendidas todo el mes cuestan del orden de <b>65-70 USD</b> antes de procesar
un solo byte. En un entorno de staging que casi no se usa, es dinero puro. ' +
La alternativa: <b>endpoints de VPC</b> para hablar con servicios de AWS —S3, DynamoDB y varios más— sin pasar
por NAT. El de S3 y el de DynamoDB no tienen costo por hora, así que suelen pagarse solos de inmediato.</div>

<h4>Grupos de seguridad y listas de red</h4>
<table>
<tr><th></th><th>Grupo de seguridad</th><th>Lista de control de red</th></tr>
<tr><td>Ámbito</td><td>Un recurso</td><td>Una subred entera</td></tr>
<tr><td>Estado</td><td><b>Con estado</b>: la respuesta vuelve sola</td><td>Sin estado: hay que permitir ida y vuelta</td></tr>
<tr><td>Reglas</td><td>Solo permitir</td><td>Permitir y denegar</td></tr>
<tr><td>Uso típico</td><td><b>El 95% de los casos</b></td><td>Bloqueos amplios por subred</td></tr>
</table>

<div class="dato"><strong>Que los grupos de seguridad sean "con estado" es lo que hace que se sientan
naturales:</strong> si permitís la entrada al puerto 443, la respuesta sale sin ninguna regla adicional. Las
listas de red no lo son, y por eso quien las configura a mano suele romper el tráfico de vuelta y pasa una hora
buscando el problema en el lugar equivocado.</div>

<h4>Emparejamiento y conectividad</h4>
<ul>
<li><b>Emparejamiento</b> — conecta dos VPC. No es transitivo: si A ve a B y B ve a C, <b>A no ve a C</b>.</li>
<li><b>Transit Gateway</b> — un concentrador central. Resuelve el problema anterior cuando hay muchas redes, con costo propio.</li>
<li><b>Endpoints de VPC</b> — acceso privado a servicios de AWS sin salir a internet.</li>
<li><b>VPN o Direct Connect</b> — conexión con una red propia fuera de AWS.</li>
</ul>

<h4>Errores frecuentes</h4>
<pre><code>❌  Base de datos en subred pública "para poder conectarme"
    → usá un bastión o el gestor de sesiones. La base nunca pública.

❌  Grupo de seguridad con 0.0.0.0/0 en el puerto 22
    → una IP conocida, o mejor sin SSH abierto

❌  Una sola zona de disponibilidad
    → si esa zona se cae, se cae todo

❌  Rango de VPC solapado con otra red
    → después no se pueden emparejar. No tiene arreglo simple.</code></pre>

<div class="dato"><strong>El último es el que no tiene vuelta atrás barata.</strong> Si dos VPC usan el mismo
rango de direcciones, <b>no se pueden emparejar nunca</b> — y cambiar el rango de una VPC existente significa
recrearla y mover todo. Por eso conviene decidir los rangos con un plan desde la primera VPC, aunque parezca
prematuro.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="vp1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <rect x="24" y="30" width="632" height="188" rx="12" fill="currentColor" fill-opacity=".04" stroke="currentColor" stroke-opacity=".3" stroke-width="1.4"/>
  <text x="40" y="50" fill="currentColor" opacity=".6" font-size="11" font-weight="700">VPC 10.0.0.0/16</text>

  <text x="600" y="50" text-anchor="end" fill="currentColor" opacity=".45" font-size="9.5">zona A</text>
  <text x="648" y="50" text-anchor="end" fill="currentColor" opacity=".45" font-size="9.5">zona B</text>

  <rect x="40" y="58" width="600" height="46" rx="8" fill="#fbbf24" fill-opacity=".12" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="56" y="76" fill="#fbbf24" font-size="10.5" font-weight="700">SUBRED PÚBLICA — tiene ruta a internet</text>
  <rect x="400" y="66" width="110" height="30" rx="6" fill="#fbbf24" fill-opacity=".3"/>
  <text x="455" y="86" text-anchor="middle" fill="#3d2c05" font-size="9.5" font-weight="700">balanceador</text>
  <rect x="518" y="66" width="110" height="30" rx="6" fill="#fbbf24" fill-opacity=".3"/>
  <text x="573" y="86" text-anchor="middle" fill="#3d2c05" font-size="9.5" font-weight="700">balanceador</text>

  <rect x="40" y="110" width="600" height="46" rx="8" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="56" y="128" fill="#22d3ee" font-size="10.5" font-weight="700">SUBRED PRIVADA — sale por NAT, no entra</text>
  <rect x="400" y="118" width="110" height="30" rx="6" fill="#22d3ee" fill-opacity=".3"/>
  <text x="455" y="138" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">aplicación</text>
  <rect x="518" y="118" width="110" height="30" rx="6" fill="#22d3ee" fill-opacity=".3"/>
  <text x="573" y="138" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">aplicación</text>

  <rect x="40" y="162" width="600" height="46" rx="8" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="56" y="180" fill="#7c5cff" font-size="10.5" font-weight="700">SUBRED AISLADA — sin internet en ninguna dirección</text>
  <rect x="400" y="170" width="110" height="30" rx="6" fill="#7c5cff" fill-opacity=".3"/>
  <text x="455" y="190" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">base de datos</text>
  <rect x="518" y="170" width="110" height="30" rx="6" fill="#7c5cff" fill-opacity=".3"/>
  <text x="573" y="190" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700">réplica</text>

  <text x="24" y="240" fill="currentColor" opacity=".6" font-size="11" font-weight="700">
    Pública vs privada NO es un atributo de la subred: es si su TABLA DE RUTAS tiene salida a internet.</text>

  <rect x="24" y="252" width="304" height="60" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="176" y="272" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">GRUPOS QUE SE ENCADENAN</text>
  <text x="44" y="292" fill="currentColor" opacity=".72" font-size="10.5" font-family="monospace">grupo “base”: 5432 desde grupo “app”</text>
  <text x="44" y="307" fill="#34d399" font-size="10" font-weight="700">si la app escala a 20, todas permitidas — y nada más</text>

  <rect x="352" y="252" width="304" height="60" rx="10" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="504" y="272" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">CON ESTADO</text>
  <text x="372" y="292" fill="currentColor" opacity=".72" font-size="10.5">permitís la entrada al 443…</text>
  <text x="372" y="307" fill="#22d3ee" font-size="10" font-weight="700">…y la respuesta sale sola, sin regla extra</text>

  <rect x="24" y="324" width="632" height="62" rx="10" fill="#f87171" fill-opacity=".12" stroke="#f87171" stroke-width="1.5"/>
  <text x="44" y="346" fill="#f87171" font-size="12" font-weight="700">LA LÍNEA DE LA FACTURA QUE NADIE ENTIENDE: LA PASARELA NAT</text>
  <text x="44" y="366" fill="currentColor" opacity=".75" font-size="11">
    Cobra por hora Y por GB procesado, y hace falta una por zona. Dos encendidas todo el mes: ~65-70 USD antes de procesar un byte.</text>
  <text x="44" y="382" fill="#34d399" font-size="11" font-weight="700">
    Alternativa: endpoints de VPC. El de S3 y el de DynamoDB no tienen costo por hora — se pagan solos de inmediato.</text>
</svg>`,
        pie: 'Subredes, tablas de rutas y grupos de seguridad. Con esos tres se explica toda VPC.',
      },

      entrevista: [
        { p: '¿Qué diferencia a una subred pública de una privada?',
          r: 'Solo una cosa: si su <b>tabla de rutas</b> tiene una salida a internet o no. No es un atributo de la subred. Suena a tecnicismo y ordena ' +
             'todo el diagnóstico: cuando algo "no tiene internet" o "es alcanzable y no debería serlo", la respuesta casi siempre está en la tabla de ' +
             'rutas. El diseño estándar tiene tres niveles: pública para el balanceador, privada para la aplicación —que sale pero no recibe—, ' +
             'y aislada para la base.' },

        { p: '¿Qué ventaja tiene encadenar grupos de seguridad?',
          r: 'Que un grupo puede referirse a <b>otro grupo</b> en vez de a un rango de direcciones. Entonces la regla es "permitir el puerto 5432 desde ' +
             'el grupo de la aplicación" y <b>no hace falta saber qué IP tiene la aplicación</b>: si escala a veinte instancias, todas quedan ' +
             'permitidas automáticamente, y nada más. Es lo más elegante de la red en AWS y lo que más se subutiliza, porque mucha gente sigue ' +
             'poniendo rangos a mano.' },

        { p: '¿Qué es una pasarela NAT y por qué importa en la factura?',
          r: 'Es lo que permite que una subred privada <b>salga</b> a internet sin ser alcanzable desde afuera. Importa porque cobra <b>por hora</b> ' +
             'esté o no en uso, <b>por cada GB procesado</b>, y hace falta <b>una por zona</b> para alta disponibilidad: dos encendidas todo el mes ' +
             'son del orden de 65-70 USD antes de procesar un byte. Es una de las líneas que más aparece sin que nadie sepa qué es. ' +
             'La alternativa son los <b>endpoints de VPC</b>: el de S3 y el de DynamoDB no tienen costo por hora, así que se pagan solos.' },

        { p: '¿Cuál es el error de red que no tiene vuelta atrás barata?',
          r: 'Elegir un <b>rango de direcciones solapado</b> con otra red. Si dos VPC usan el mismo rango, <b>no se pueden emparejar nunca</b>, ' +
             'y cambiar el rango de una VPC existente significa recrearla y mover todo lo que hay adentro. Por eso conviene decidir los rangos con un ' +
             'plan desde la primera VPC, aunque en ese momento parezca prematuro. Los otros errores comunes —base en subred pública, SSH abierto a ' +
             'todo el mundo, una sola zona— se corrigen sin drama.' },
      ],

      practica: `
<h4>Grupos de seguridad encadenados</h4>
<pre><code># El grupo de la base permite 5432 SOLO desde el grupo de la app
aws ec2 authorize-security-group-ingress \\
  --group-id sg-BASE \\
  --protocol tcp --port 5432 \\
  --source-group sg-APP        # ← no una IP: otro grupo</code></pre>

<div class="aviso"><strong>Con rangos de IP a mano, cada vez que la aplicación escala hay que actualizar la
regla</strong> — y en la práctica alguien termina poniendo el rango entero de la subred "para que no moleste",
que es exactamente lo que se quería evitar.</div>

<h4>Endpoints de VPC en vez de NAT</h4>
<pre><code># El endpoint de S3 no tiene costo por hora: se paga solo de inmediato
aws ec2 create-vpc-endpoint \\
  --vpc-id vpc-XXX \\
  --service-name com.amazonaws.sa-east-1.s3 \\
  --route-table-ids rtb-PRIVADA

# Verificar cuánto tráfico está pasando por NAT
# (si es mucho hacia S3, este endpoint lo elimina)
aws cloudwatch get-metric-statistics \\
  --namespace AWS/NATGateway --metric-name BytesOutToDestination \\
  --start-time 2026-08-01T00:00:00Z --end-time 2026-08-08T00:00:00Z \\
  --period 86400 --statistics Sum</code></pre>

<h4>Diagnóstico: "no puedo conectarme"</h4>
<pre><code>1 · ¿El grupo de seguridad del DESTINO permite el puerto desde el origen?
2 · ¿El grupo del ORIGEN permite la salida?  (por defecto sí)
3 · ¿La tabla de rutas de la subred tiene ruta al destino?
4 · ¿Hay una lista de control de red bloqueando la vuelta?
    ← es SIN ESTADO: hay que permitir ida Y vuelta
5 · ¿Están en la misma VPC, o hace falta emparejamiento?
6 · ¿El servicio está escuchando en 0.0.0.0 y no en 127.0.0.1?</code></pre>

<div class="dato"><strong>El punto 4 es donde se pierde más tiempo.</strong> Los grupos de seguridad son con
estado y las listas de red no, así que si alguien tocó una lista a mano es muy fácil bloquear el tráfico de
vuelta sin darse cuenta — y el síntoma es una conexión que se queda colgada, no un rechazo claro.</div>

<h4>Checklist de VPC</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Rangos planificados, sin solapar con otras redes</td></tr>
<tr><td>☐</td><td>Al menos dos zonas de disponibilidad</td></tr>
<tr><td>☐</td><td>Base de datos en subred sin acceso público</td></tr>
<tr><td>☐</td><td>Grupos de seguridad encadenados, no rangos a mano</td></tr>
<tr><td>☐</td><td>Sin <code>0.0.0.0/0</code> en puertos de administración</td></tr>
<tr><td>☐</td><td><b>Endpoints de VPC para S3</b> y otros servicios usados</td></tr>
<tr><td>☐</td><td>Costo de NAT revisado, sobre todo en staging</td></tr>
</table>
`,

      errores: [
        { mito: 'Pongo la base en subred pública para poder conectarme.',
          realidad: 'Eso la expone a internet. Se accede con un <b>bastión</b> o con el gestor de sesiones, que además deja auditoría de quién entró. ' +
                    'La base nunca en subred pública.' },

        { mito: 'Las listas de control de red y los grupos de seguridad son lo mismo.',
          realidad: 'Los grupos son <b>con estado</b> —la respuesta vuelve sola— y actúan sobre un recurso. Las listas son <b>sin estado</b> y actúan ' +
                    'sobre la subred: hay que permitir ida y vuelta. Configurar una lista a mano y romper el tráfico de retorno es un clásico.' },

        { mito: 'La pasarela NAT es solo un detalle de red.',
          realidad: 'Cobra por hora y por GB, y hace falta una por zona: dos encendidas todo el mes son ~65-70 USD antes de procesar un byte. ' +
                    'En staging es dinero puro. Los <b>endpoints de VPC</b> para S3 y DynamoDB no tienen costo por hora.' },

        { mito: 'El rango de la VPC da igual, uso el que sugiere la consola.',
          realidad: 'Si se solapa con otra red, <b>no se pueden emparejar nunca</b>, y cambiarlo después significa recrear la VPC y mover todo. ' +
                    'Es el único error de esta lección sin vuelta atrás barata.' },
      ],

      glosario: [
        { t: 'VPC', d: 'Red privada virtual dentro de AWS.' },
        { t: 'Subred', d: 'Segmento de la VPC, atado a una zona de disponibilidad.' },
        { t: 'Tabla de rutas', d: 'Define hacia dónde va el tráfico. Es lo que hace pública o privada a una subred.' },
        { t: 'Grupo de seguridad', d: 'Firewall con estado alrededor de un recurso. Puede referirse a otro grupo.' },
        { t: 'Lista de control de red', d: 'Filtro sin estado a nivel de subred. Permite reglas de denegación.' },
        { t: 'Pasarela NAT', d: 'Permite salir a internet desde una subred privada. Cobra por hora y por GB.' },
        { t: 'Endpoint de VPC', d: 'Acceso privado a un servicio de AWS sin pasar por internet ni por NAT.' },
        { t: 'Emparejamiento', d: 'Conexión entre dos VPC. No es transitiva.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Cómo no fundirte con la factura',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> AWS no te avisa. Cobra al final del mes lo que
haya salido, y las historias de facturas de miles de dólares casi nunca son por algo exótico: son por
<b>recursos olvidados</b> y por <b>egreso</b>.</div>

<h4>Los cinco sospechosos habituales</h4>
<ol>
<li><b>Egreso.</b> Todo lo que sale hacia internet, a ~0,09 USD/GB. Es casi siempre la línea más grande.</li>
<li><b>Recursos olvidados.</b> Instancias de prueba, discos sin usar, IP reservadas sin asignar, respaldos viejos.</li>
<li><b>Pasarelas NAT.</b> Por hora y por GB, una por zona.</li>
<li><b>Sobredimensionamiento.</b> Instancias al 5% de uso, pagadas al 100%.</li>
<li><b>Registros.</b> La ingesta de logs a gran volumen es sorprendentemente cara.</li>
</ol>

<div class="aviso"><strong>El caso más doloroso, porque no aparece en la factura como un ítem obvio:</strong>
un disco de una instancia que borraste sigue existiendo y sigue cobrando. Una IP reservada sin asignar
<b>cuesta más</b> que una asignada, porque la penalizan justamente por estar ociosa. Y una instantánea de una
base que ya no existe se cobra igual. <b>Ninguna de las tres te avisa.</b></div>

<h4>Etiquetas, que parecen burocracia y no lo son</h4>
<p>Sin etiquetas, la factura te dice "EC2: 340 USD" y no tenés forma de saber de qué proyecto. Con etiquetas:</p>
<pre><code>Proyecto = matcheando  |  gestiapp  |  alta-gracia
Entorno  = prod        |  staging   |  dev
Dueño    = quién lo creó</code></pre>
<p>Después se puede filtrar la factura por cualquiera de esas dimensiones. Y aparece el hallazgo típico:
<b>staging costando la mitad de producción</b> sin que nadie lo estuviera usando.</p>

<h4>Lo primero, siempre</h4>
<p>Un presupuesto con alerta por <b>proyección</b>, no por gasto real. La diferencia: la de gasto real te avisa
cuando ya gastaste; la de proyección te avisa cuando <b>vas camino</b> a gastarlo. Con un recurso que se dejó
encendido, eso son varios días de margen.</p>
`,

      tecnico: `
<h4>Las cuatro formas de pagar cómputo</h4>
<table>
<tr><th>Modo</th><th>Descuento</th><th>Compromiso</th><th>Para qué</th></tr>
<tr><td>Bajo demanda</td><td>—</td><td>Ninguno</td><td>Carga impredecible, pruebas</td></tr>
<tr><td>Savings Plans</td><td>~30-50%</td><td>1 o 3 años de gasto por hora</td><td><b>La base estable</b></td></tr>
<tr><td>Instancias reservadas</td><td>~30-60%</td><td>1 o 3 años de instancia específica</td><td>Cargas muy predecibles</td></tr>
<tr><td>Spot</td><td>~70-90%</td><td>Te la pueden quitar con 2 min de aviso</td><td>Lotes, CI, trabajos tolerantes</td></tr>
</table>

<div class="dato"><strong>La estrategia que funciona es mixta:</strong> Savings Plans para la <b>base</b> que
sabés que vas a usar siempre, bajo demanda para el pico variable, y Spot para todo lo que tolere una
interrupción — que suele ser el pipeline de CI y los trabajos por lotes. ' +
Comprometer el 100% con un plan de ahorro es cómo se termina pagando capacidad que no se usa durante tres años.</div>

<h4>Encontrar lo que sobra</h4>
<pre><code># Discos sin adjuntar a ninguna instancia
aws ec2 describe-volumes --filters Name=status,Values=available \\
  --query 'Volumes[].{Id:VolumeId,GB:Size,Creado:CreateTime}' --output table

# IP reservadas SIN asignar (cuestan MÁS que las asignadas)
aws ec2 describe-addresses \\
  --query 'Addresses[?AssociationId==null].PublicIp' --output table

# Instantáneas viejas
aws ec2 describe-snapshots --owner-ids self \\
  --query 'Snapshots[?StartTime&lt;=&#96;2026-02-01&#96;].[SnapshotId,VolumeSize,StartTime]' \\
  --output table

# Balanceadores sin destinos sanos
aws elbv2 describe-load-balancers --query 'LoadBalancers[].LoadBalancerArn'</code></pre>

<div class="dato"><strong>La primera consulta es la que más veces encuentra dinero.</strong> Cuando se termina
una instancia, su disco puede quedar según cómo se creó — y sigue cobrando indefinidamente sin aparecer en
ninguna lista que alguien mire. Correr eso una vez por trimestre suele pagar el tiempo invertido varias veces.</div>

<h4>Los logs, que sorprenden</h4>
<p>CloudWatch cobra por <b>ingesta</b> y por <b>almacenamiento</b>, y la ingesta es la cara. Una aplicación con
mucho tráfico y nivel <code>debug</code> puede generar cientos de GB al mes.</p>
<pre><code># Sin retención configurada, los logs se guardan PARA SIEMPRE
aws logs put-retention-policy --log-group-name /app/prod --retention-in-days 30

# Ver qué grupo consume más
aws logs describe-log-groups \\
  --query 'logGroups[].{Nombre:logGroupName,Bytes:storedBytes}' \\
  --output table</code></pre>

<div class="dato"><strong>El default de retención infinita es una trampa silenciosa:</strong> el costo crece
todos los meses sin que nadie cambie nada, y como crece de a poco nunca dispara ninguna alarma. Poner retención
en todos los grupos de logs es una tarde de trabajo que se paga sola.</div>

<h4>Reducir egreso</h4>
<ul>
<li><b>CloudFront delante de todo.</b> El egreso vía CDN es más barato que el directo, y encima cachea.</li>
<li><b>Endpoints de VPC</b> para no pasar por NAT hacia servicios de AWS.</li>
<li><b>Compresión</b> activada en las respuestas.</li>
<li><b>Todo en la misma región y zona</b> cuando sea posible: entre zonas también se cobra.</li>
<li><b>Y la opción radical</b>: mover los archivos públicos a un almacenamiento <b>sin cargo de egreso</b>.</li>
</ul>
<p>Ese último punto conecta con lo que viste en el módulo de Cloudflare, y para archivos servidos al público
suele ser la diferencia más grande de toda la factura.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <rect x="24" y="28" width="632" height="42" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="340" y="54" text-anchor="middle" fill="#f87171" font-size="13" font-weight="700">
    AWS no te avisa. Cobra al final del mes lo que haya salido.</text>

  <text x="24" y="94" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS CINCO SOSPECHOSOS HABITUALES</text>

  <rect x="24" y="106" width="632" height="26" rx="6" fill="#f87171" fill-opacity=".24" stroke="#f87171" stroke-width="1.4"/>
  <text x="40" y="124" fill="#f87171" font-size="11" font-weight="700">1 · EGRESO</text>
  <text x="160" y="124" fill="currentColor" opacity=".72" font-size="10.5">~0,09 USD/GB — casi siempre la línea más grande</text>

  <rect x="24" y="136" width="632" height="26" rx="6" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.3"/>
  <text x="40" y="154" fill="#f87171" font-size="11" font-weight="700">2 · OLVIDADOS</text>
  <text x="160" y="154" fill="currentColor" opacity=".72" font-size="10.5">discos sin usar · IP reservadas ociosas · instantáneas viejas</text>

  <rect x="24" y="166" width="632" height="26" rx="6" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="40" y="184" fill="#fbbf24" font-size="11" font-weight="700">3 · NAT</text>
  <text x="160" y="184" fill="currentColor" opacity=".72" font-size="10.5">por hora Y por GB, una por zona</text>

  <rect x="24" y="196" width="632" height="26" rx="6" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="40" y="214" fill="#fbbf24" font-size="11" font-weight="700">4 · SOBREDIMENSIÓN</text>
  <text x="160" y="214" fill="currentColor" opacity=".72" font-size="10.5">instancias al 5% de uso, pagadas al 100%</text>

  <rect x="24" y="226" width="632" height="26" rx="6" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="40" y="244" fill="#22d3ee" font-size="11" font-weight="700">5 · LOGS</text>
  <text x="160" y="244" fill="currentColor" opacity=".72" font-size="10.5">la ingesta es cara, y la retención por defecto es INFINITA</text>

  <rect x="24" y="264" width="632" height="42" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="284" fill="#f87171" font-size="11" font-weight="700">Lo más doloroso: no aparecen como un ítem obvio.</text>
  <text x="44" y="300" fill="currentColor" opacity=".72" font-size="10.5">
    Un disco de una instancia borrada sigue cobrando. Una IP reservada SIN asignar cuesta MÁS que una asignada. Ninguna avisa.</text>

  <text x="24" y="330" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS CUATRO FORMAS DE PAGAR CÓMPUTO — la estrategia es MIXTA</text>

  <rect x="24" y="342" width="152" height="44" rx="8" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".3"/>
  <text x="100" y="360" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10" font-weight="700">bajo demanda</text>
  <text x="100" y="376" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">el pico variable</text>

  <rect x="188" y="342" width="152" height="44" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.5"/>
  <text x="264" y="360" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">Savings Plans −30/50%</text>
  <text x="264" y="376" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">solo la BASE estable</text>

  <rect x="352" y="342" width="152" height="44" rx="8" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="428" y="360" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">reservadas −30/60%</text>
  <text x="428" y="376" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">muy predecible</text>

  <rect x="516" y="342" width="140" height="44" rx="8" fill="#7c5cff" fill-opacity=".2" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="586" y="360" text-anchor="middle" fill="#7c5cff" font-size="10" font-weight="700">Spot −70/90%</text>
  <text x="586" y="376" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">CI y lotes</text>
</svg>`,
        pie: 'Comprometer el 100% con un plan de ahorro es pagar tres años de capacidad que no usás.',
      },

      entrevista: [
        { p: '¿Qué es lo primero que configurarías en una cuenta de AWS?',
          r: 'Un <b>presupuesto con alerta por proyección</b>, no por gasto real. La diferencia importa: la alerta de gasto real te avisa cuando ' +
             '<b>ya gastaste</b>; la de proyección te avisa cuando <b>vas camino</b> a gastarlo. Con un recurso que alguien dejó encendido, eso son ' +
             'varios días de margen. Y junto con eso, segundo factor en la cuenta raíz. Los dos evitan los dos desastres clásicos: ' +
             'la factura sorpresa y la cuenta comprometida.' },

        { p: '¿Cuáles son los costos ocultos más comunes en AWS?',
          r: 'El <b>egreso</b>, que es casi siempre la línea más grande. Los <b>recursos olvidados</b>: un disco de una instancia borrada sigue ' +
             'cobrando, una <b>IP reservada sin asignar cuesta más</b> que una asignada porque penalizan el ocio, y las instantáneas viejas se cobran ' +
             'igual. Las <b>pasarelas NAT</b>, que cobran por hora y por GB. Y los <b>logs</b>, donde la ingesta es cara y la retención por defecto es ' +
             'infinita, así que el costo crece todos los meses sin que nadie cambie nada. <b>Ninguno de esos te avisa.</b>' },

        { p: '¿Cómo combinarías los modelos de compra de cómputo?',
          r: 'De forma <b>mixta</b>. <b>Savings Plans</b> para la base que sé que voy a usar siempre — de 30 a 50% de descuento a cambio de ' +
             'comprometer gasto por hora—. <b>Bajo demanda</b> para el pico variable, que es justamente lo impredecible. Y <b>Spot</b>, con 70 a 90% ' +
             'de descuento, para todo lo que tolere una interrupción con dos minutos de aviso: el pipeline de CI y los trabajos por lotes. ' +
             '<b>Comprometer el 100% con un plan de ahorro es cómo se termina pagando tres años de capacidad que no se usa.</b>' },

        { p: '¿Para qué sirven las etiquetas y por qué no son burocracia?',
          r: 'Porque sin ellas la factura dice "EC2: 340 USD" y <b>no hay forma de saber de qué proyecto</b>. Con etiquetas de proyecto, entorno y ' +
             'dueño se puede filtrar el costo por cualquiera de esas dimensiones. Y ahí aparece el hallazgo típico: <b>staging costando la mitad de ' +
             'producción</b> sin que nadie lo estuviera usando. Es la diferencia entre poder tomar una decisión de ahorro y solo poder mirar un número ' +
             'grande sin saber de dónde sale.' },
      ],

      practica: `
<h4>Barrido trimestral de lo que sobra</h4>
<pre><code>echo "== Discos sin adjuntar =="
aws ec2 describe-volumes --filters Name=status,Values=available \\
  --query 'Volumes[].[VolumeId,Size,CreateTime]' --output table

echo "== IP reservadas ociosas (cuestan MÁS) =="
aws ec2 describe-addresses \\
  --query 'Addresses[?AssociationId==null].PublicIp' --output table

echo "== Grupos de logs SIN retención (crecen para siempre) =="
aws logs describe-log-groups \\
  --query 'logGroups[?retentionInDays==null].logGroupName' --output table

echo "== Instancias con CPU promedio < 10% (candidatas a achicar) =="
# revisar en CloudWatch por instancia</code></pre>

<div class="aviso"><strong>El tercer bloque encuentra la trampa más silenciosa.</strong> Sin retención, los
logs se guardan para siempre y el costo crece todos los meses sin que nadie cambie nada — y como crece de a
poco, nunca dispara una alarma. Ponerle retención a todos los grupos es una tarde que se paga sola.</div>

<h4>Etiquetas obligatorias desde el principio</h4>
<pre><code># Terraform: etiquetas por defecto en TODO recurso
provider "aws" {
  default_tags {
    tags = {
      Proyecto = var.proyecto
      Entorno  = var.entorno
      Gestion  = "terraform"
    }
  }
}</code></pre>
<p>Ponerlo desde el día uno cuesta cinco minutos. Etiquetar retroactivamente cuatrocientos recursos, no.</p>

<h4>Apagar staging fuera de horario</h4>
<pre><code># Staging no necesita estar encendido de noche ni los fines de semana.
# 12 h × 5 días en vez de 24 × 7 = ~65% menos.
aws application-autoscaling put-scheduled-action \\
  --service-namespace ecs \\
  --scheduled-action-name apagar-staging-noche \\
  --schedule "cron(0 22 ? * MON-FRI *)" \\
  --scalable-dimension ecs:service:DesiredCount \\
  --resource-id service/staging/mi-app \\
  --scalable-target-action MinCapacity=0,MaxCapacity=0</code></pre>

<h4>Checklist de costo</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Presupuesto con alerta por <b>proyección</b></td></tr>
<tr><td>☐</td><td>Etiquetas obligatorias de proyecto y entorno</td></tr>
<tr><td>☐</td><td>Retención configurada en <b>todos</b> los grupos de logs</td></tr>
<tr><td>☐</td><td>Ciclo de vida en S3, incluida la multiparte incompleta</td></tr>
<tr><td>☐</td><td>Barrido trimestral de discos, IP e instantáneas</td></tr>
<tr><td>☐</td><td>Staging apagado fuera de horario</td></tr>
<tr><td>☐</td><td>Savings Plans solo sobre la base estable</td></tr>
<tr><td>☐</td><td>CDN delante, y evaluar egreso sin cargo para archivos públicos</td></tr>
</table>
`,

      errores: [
        { mito: 'Borré la instancia, ya no pago nada.',
          realidad: 'El <b>disco</b> puede seguir existiendo y cobrando, la <b>IP reservada</b> sin asignar cuesta más que una asignada, y las ' +
                    '<b>instantáneas</b> siguen ahí. Ninguna de las tres te avisa ni aparece en un lugar que alguien mire.' },

        { mito: 'Compro Savings Plans para todo y ahorro más.',
          realidad: 'Comprometés gasto por <b>uno o tres años</b>. Si la carga baja o migrás, pagás capacidad que no usás. ' +
                    'Se compra sobre la <b>base</b> que sabés que vas a usar siempre, no sobre el pico.' },

        { mito: 'Los logs son baratos.',
          realidad: 'CloudWatch cobra por <b>ingesta</b>, que es la parte cara, y la <b>retención por defecto es infinita</b>. Una aplicación con ' +
                    'mucho tráfico en nivel debug genera cientos de GB al mes, y el costo crece sin que nadie cambie nada.' },

        { mito: 'Las etiquetas son burocracia.',
          realidad: 'Sin ellas la factura dice "EC2: 340 USD" y <b>no sabés de qué proyecto</b>. Con etiquetas aparece el hallazgo típico: ' +
                    'staging costando la mitad de producción sin que nadie lo use. Ponerlas después, en cuatrocientos recursos, es otra historia.' },
      ],

      glosario: [
        { t: 'Egreso', d: 'Datos que salen hacia internet. La línea más cara por unidad.' },
        { t: 'Savings Plan', d: 'Compromiso de gasto por hora a cambio de descuento.' },
        { t: 'Instancia reservada', d: 'Compromiso sobre una instancia concreta, con descuento.' },
        { t: 'Spot', d: 'Capacidad sobrante muy barata, que puede quitarse con dos minutos de aviso.' },
        { t: 'IP reservada', d: 'Dirección pública fija. Sin asignar cuesta más que asignada.' },
        { t: 'Etiqueta', d: 'Par clave-valor que permite atribuir costo por proyecto o entorno.' },
        { t: 'Alerta por proyección', d: 'Avisa según el gasto estimado del mes, no según el ya incurrido.' },
        { t: 'Retención de logs', d: 'Días que se conservan. Por defecto, infinita.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es normalmente la mejor opción para correr una aplicación web en contenedor en AWS?',
      opciones: [
        'Fargate: le das el contenedor y lo corre, sin servidores que administrar ni límite de tiempo',
        'EC2, siempre, por el control',
        'Lambda, siempre, porque escala a cero',
        'EKS, porque Kubernetes es el estándar',
      ],
      correcta: 0,
      porQue: 'Es el punto medio: no administrás sistema operativo ni parches, y no tenés el límite de 15 minutos ni el arranque en frío por invocación de Lambda.',
      porQueNo: {
        1: 'Da control pero te deja administrando sistema operativo, parches y escalado.',
        2: 'Con tráfico sostenido sale más caro que un contenedor encendido, y tiene límite de 15 minutos.',
        3: 'Suma mucha complejidad operativa que la mayoría de los productos no necesita.',
      },
    },
    {
      p: '¿Cuál es el error caro más común al elegir Lambda?',
      opciones: [
        'Usarla para una API con tráfico sostenido: pagás por invocación algo que estaría encendido igual',
        'Usarla para tareas esporádicas',
        'Usarla para procesar eventos de una cola',
        'Usarla para tareas de menos de un segundo',
      ],
      correcta: 0,
      porQue: 'Lambda gana con tráfico esporádico o muy variable, donde escalar a cero importa. Con tráfico constante, un contenedor chico encendido sale bastante más barato.',
      porQueNo: {
        1: 'Es exactamente su mejor caso de uso.',
        2: 'Es un caso clásico y adecuado.',
        3: 'También es un buen ajuste para su modelo de costo.',
      },
    },
    {
      p: '¿Por qué Lambda contra una base relacional es problemático?',
      opciones: [
        'Cada invocación concurrente es un entorno propio con sus conexiones: 500 con pool de 10 piden 5.000',
        'Lambda no puede hacer consultas SQL',
        'La latencia de red es demasiado alta',
        'No se pueden usar transacciones',
      ],
      correcta: 0,
      porQue: 'Se resuelve con RDS Proxy, con pool de tamaño 1 por entorno, o limitando la concurrencia reservada.',
      porQueNo: {
        1: 'Puede perfectamente, con el driver adecuado.',
        2: 'Dentro de la misma VPC la latencia es baja.',
        3: 'Las transacciones funcionan con normalidad.',
      },
    },
    {
      p: '¿Qué decisión de RDS no se puede cambiar después sin recrear la instancia?',
      opciones: [
        'Activar el cifrado',
        'La retención de respaldos',
        'El tipo de instancia',
        'La ventana de mantenimiento',
      ],
      correcta: 0,
      porQue: 'Parece un detalle al crear la base y es una migración completa seis meses después. Es la decisión que más se lamenta.',
      porQueNo: {
        1: 'Se modifica en cualquier momento.',
        2: 'Se cambia con un reinicio.',
        3: 'Es un parámetro editable.',
      },
    },
    {
      p: '¿Cuál es la diferencia clave entre un usuario y un rol de IAM?',
      opciones: [
        'El usuario tiene credenciales permanentes que hay que guardar; el rol da credenciales temporales que vencen solas',
        'El rol es para administradores y el usuario para el resto',
        'El usuario es más seguro porque tiene contraseña',
        'Son lo mismo con distinto nombre',
      ],
      correcta: 0,
      porQue: 'Por eso la recomendación es roles para todo lo que sea máquina y usuarios solo para personas: con un rol no hay nada que guardar, rotar ni filtrar.',
      porQueNo: {
        1: 'No es una distinción por jerarquía sino por tipo de credencial.',
        2: 'Es al revés: la credencial permanente es la que se filtra.',
        3: 'La diferencia en el manejo de credenciales es fundamental.',
      },
    },
    {
      p: '¿Cómo se evalúan las políticas de IAM?',
      opciones: [
        'Todo denegado por defecto, y un Deny explícito gana sobre cualquier Allow',
        'Gana la política más específica',
        'Gana la última política aplicada',
        'Los Allow se suman y sobrescriben los Deny',
      ],
      correcta: 0,
      porQue: 'Que el Deny gane permite crear barreras absolutas: denegar el borrado de respaldos salvo a un rol específico, sin que ni un administrador pueda saltearlo ampliándose los permisos.',
      porQueNo: {
        1: 'La especificidad no altera la precedencia del Deny.',
        2: 'No hay un orden de aplicación: se evalúan en conjunto.',
        3: 'Es exactamente al revés.',
      },
    },
    {
      p: '¿Por qué el comodín en Resource es peor que en Action?',
      opciones: [
        '"Resource": "*" significa todos los buckets de la cuenta, incluidos respaldos y otros proyectos',
        'Porque AWS lo cobra más caro',
        'Porque hace más lenta la evaluación',
        'Son igual de graves',
      ],
      correcta: 0,
      porQue: 'Un comodín en Action sobre un recurso acotado es discutible pero contenido. Si hay que dejar uno, que sea en la acción.',
      porQueNo: {
        1: 'IAM no tiene costo por evaluación.',
        2: 'La diferencia de rendimiento es irrelevante.',
        3: 'El alcance del daño es muy distinto.',
      },
    },
    {
      p: 'Al configurar OIDC para CI, ¿qué es imprescindible incluir?',
      opciones: [
        'La condición que limita qué repositorio y qué rama pueden asumir el rol',
        'Una clave de acceso de respaldo',
        'Permisos de administrador para el rol',
        'Una política de contraseñas',
      ],
      correcta: 0,
      porQue: 'Sin esa condición, cualquier repositorio del proveedor podría asumir tu rol. Y no da ningún síntoma: todo funciona igual, con la puerta abierta.',
      porQueNo: {
        1: 'El punto de OIDC es no tener credenciales permanentes.',
        2: 'Contradice el mínimo privilegio.',
        3: 'No aplica: no hay contraseña en este flujo.',
      },
    },
    {
      p: '¿Qué hace que una subred sea pública en vez de privada?',
      opciones: [
        'Que su tabla de rutas tenga una salida a internet',
        'Un atributo "público" que se marca al crearla',
        'Tener direcciones IPv4 asignadas',
        'Estar en la primera zona de disponibilidad',
      ],
      correcta: 0,
      porQue: 'No es un atributo de la subred. Esto ordena todo el diagnóstico: cuando algo no tiene internet o es alcanzable y no debería, la respuesta suele estar en la tabla de rutas.',
      porQueNo: {
        1: 'No existe tal atributo: se define por el enrutamiento.',
        2: 'Las subredes privadas también tienen direcciones.',
        3: 'La zona no determina la exposición a internet.',
      },
    },
    {
      p: '¿Qué ventaja tiene encadenar grupos de seguridad entre sí?',
      opciones: [
        'No hace falta conocer las IP: si la app escala a 20 instancias, todas quedan permitidas y nada más',
        'Mejora el rendimiento de la red',
        'Permite reglas de denegación',
        'Reduce el costo de la VPC',
      ],
      correcta: 0,
      porQue: 'Con rangos de IP a mano hay que actualizar la regla en cada escalado, y alguien termina poniendo el rango entero de la subred — justo lo que se quería evitar.',
      porQueNo: {
        1: 'No hay diferencia de rendimiento.',
        2: 'Los grupos de seguridad solo permiten; denegar es de las listas de control de red.',
        3: 'No afecta el costo.',
      },
    },
    {
      p: '¿Por qué la pasarela NAT aparece tanto en las facturas?',
      opciones: [
        'Cobra por hora esté o no en uso, y por GB procesado, y hace falta una por zona',
        'Porque procesa todo el tráfico entrante',
        'Porque incluye un balanceador',
        'Porque cobra por cada conexión establecida',
      ],
      correcta: 0,
      porQue: 'Dos pasarelas encendidas todo el mes son del orden de 65-70 USD antes de procesar un byte. Los endpoints de VPC para S3 y DynamoDB no tienen costo por hora.',
      porQueNo: {
        1: 'Maneja tráfico saliente desde subredes privadas.',
        2: 'Es un servicio distinto y se factura aparte.',
        3: 'Se factura por hora y por volumen, no por conexión.',
      },
    },
    {
      p: '¿Cuál es el error de red que no tiene vuelta atrás barata?',
      opciones: [
        'Elegir un rango de direcciones solapado con otra red: no se podrán emparejar nunca',
        'Poner la base en subred pública',
        'Dejar el puerto 22 abierto',
        'Usar una sola zona de disponibilidad',
      ],
      correcta: 0,
      porQue: 'Cambiar el rango de una VPC existente significa recrearla y mover todo. Los otros errores son graves pero se corrigen sin drama.',
      porQueNo: {
        1: 'Es grave y se corrige moviendo la instancia a una subred privada.',
        2: 'Se cierra modificando el grupo de seguridad.',
        3: 'Se agregan subredes en otra zona sin recrear la VPC.',
      },
    },
    {
      p: '¿Qué tipo de alerta de presupuesto conviene configurar?',
      opciones: [
        'Por proyección: avisa cuando vas camino a gastar, no cuando ya gastaste',
        'Por gasto real, que es más preciso',
        'Diaria por email, sin umbral',
        'Ninguna: se revisa la factura a fin de mes',
      ],
      correcta: 0,
      porQue: 'Con un recurso que alguien dejó encendido, esa diferencia son varios días de margen para actuar antes de que el gasto ocurra.',
      porQueNo: {
        1: 'Es preciso pero tardío: te avisa cuando el dinero ya se gastó.',
        2: 'Sin umbral se convierte en ruido que se ignora.',
        3: 'Es exactamente cómo aparecen las facturas sorpresa.',
      },
    },
    {
      p: '¿Cuál de estos costos sigue corriendo aunque hayas borrado la instancia?',
      opciones: [
        'El disco, las instantáneas, y la IP reservada sin asignar (que cuesta más que una asignada)',
        'Ninguno: al borrar la instancia se libera todo',
        'Solo el tráfico de red',
        'Solo si tenías Savings Plans',
      ],
      correcta: 0,
      porQue: 'Ninguno de los tres te avisa ni aparece en un lugar que alguien mire. Un barrido trimestral de discos, IP e instantáneas suele pagar el tiempo invertido varias veces.',
      porQueNo: {
        1: 'Los discos y las instantáneas pueden sobrevivir a la instancia.',
        2: 'El almacenamiento es lo que más queda corriendo.',
        3: 'Ocurre con cualquier modelo de compra.',
      },
    },
    {
      p: '¿Cómo conviene combinar los modelos de compra de cómputo?',
      opciones: [
        'Savings Plans sobre la base estable, bajo demanda para el pico, Spot para CI y lotes',
        'Savings Plans para el 100% del uso',
        'Todo bajo demanda, por flexibilidad',
        'Todo Spot, que es lo más barato',
      ],
      correcta: 0,
      porQue: 'Comprometer el 100% con un plan de ahorro es cómo se termina pagando tres años de capacidad que no se usa. Spot conviene solo donde se tolere perder la instancia con dos minutos de aviso.',
      porQueNo: {
        1: 'Si la carga baja o migrás, pagás capacidad ociosa durante años.',
        2: 'Deja sobre la mesa entre 30 y 50% de descuento en la base estable.',
        3: 'Te pueden quitar la capacidad con dos minutos de aviso: no sirve para servir tráfico crítico.',
      },
    },
  ],
});
