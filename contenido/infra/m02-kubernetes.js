/* ==========================================================================
   Infra · Módulo 02 — Orquestación y Kubernetes
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'infra',
  id: 'm02',
  titulo: 'Orquestación y Kubernetes',
  fuentes: ['kubernetes', 'k8s-produccion', 'pgbouncer', 'oci'],

  intro:
    '<p>Kubernetes es la tecnología más sobrevendida y peor entendida de la infraestructura moderna. Se adopta ' +
    'por currículum, se sufre por meses, y en la mayoría de los proyectos <b>no hacía falta</b>.</p>' +
    '<p>Este módulo te da las dos mitades que importan: entender de verdad qué hace y cómo funciona —para poder ' +
    'hablar con criterio y trabajar en un equipo que lo usa— y el criterio honesto para saber <b>cuándo no lo ' +
    'necesitás</b>, que es lo que realmente te va a servir en tus proyectos.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Qué problema resuelve un orquestador',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> con un servidor y tres contenedores, los manejás
a mano. Con veinte servidores y doscientos contenedores, necesitás algo que decida <b>qué corre dónde</b> y
que lo arregle solo cuando algo se cae.</div>

<h4>Los problemas que aparecen al crecer</h4>
<p>Con Docker Compose en un VPS, todo esto lo resolvés vos o no se resuelve:</p>
<ul>
<li><b>Se cayó la máquina.</b> Todos los contenedores que corrían ahí desaparecieron. ¿Quién los levanta en otra?</li>
<li><b>Necesitás cinco copias de la aplicación.</b> ¿En qué máquinas? ¿Quién reparte el tráfico?</li>
<li><b>Subió el tráfico.</b> ¿Quién agrega instancias y quién las saca cuando baja?</li>
<li><b>Desplegaste algo roto.</b> ¿Quién detecta que los contenedores nuevos no arrancan y vuelve atrás?</li>
<li><b>Una máquina se quedó sin memoria.</b> ¿Quién mueve las cargas a otra?</li>
</ul>

<p>Un <b>orquestador</b> es lo que responde todas esas preguntas por vos.</p>

<h4>El cambio de modelo mental</h4>
<p>Esta es la idea central y la que hay que entender bien:</p>

<table>
<tr><th>Sin orquestador</th><th>Con orquestador</th></tr>
<tr><td>Vos decís <b>cómo</b>: "corré este contenedor en esta máquina"</td><td>Vos decís <b>qué</b>: "quiero 5 copias de esto corriendo, siempre"</td></tr>
<tr><td>Si algo se cae, alguien lo arregla</td><td>El sistema compara el estado real con el deseado y lo corrige solo</td></tr>
<tr><td>Imperativo</td><td><b>Declarativo</b></td></tr>
</table>

<p>Le declarás un <b>estado deseado</b> y el orquestador trabaja continuamente para que la realidad coincida.
Si matás un contenedor, en segundos aparece otro — no porque alguien reaccionó, sino porque el sistema notó
que hay 4 y deberían ser 5.</p>

<div class="aviso"><strong>El precio de esa magia:</strong> ese bucle de reconciliación es lo que hace a
Kubernetes potente <b>y</b> lo que lo hace difícil de depurar. Cuando algo no funciona, la pregunta no es
"¿qué pasó?" sino "¿por qué el sistema cree que esto está bien?". Es un modelo mental distinto, y adaptarse
lleva tiempo.</div>
`,

      tecnico: `
<h4>El bucle de reconciliación</h4>
<pre><code>mientras (true):
    estado_deseado = leer de la API      # "5 réplicas de mi-app:1.4.2"
    estado_real    = observar el clúster # "hay 4 corriendo"
    if difieren:
        actuar para acercarlos           # crear 1 pod más</code></pre>
<p>Todo Kubernetes es esto, repetido por muchos controladores distintos y en paralelo. No hay un script de
despliegue: hay un estado declarado y controladores que lo persiguen.</p>

<h4>Qué te da un orquestador</h4>
<table>
<tr><th>Capacidad</th><th>Qué resuelve</th></tr>
<tr><td><b>Programación</b></td><td>Decide en qué nodo corre cada carga, según recursos y restricciones</td></tr>
<tr><td><b>Auto-reparación</b></td><td>Reinicia lo que falla; reprograma lo que estaba en un nodo caído</td></tr>
<tr><td><b>Escalado</b></td><td>Horizontal por métricas; también escala los nodos del clúster</td></tr>
<tr><td><b>Descubrimiento de servicios</b></td><td>Un nombre estable aunque las instancias cambien de IP</td></tr>
<tr><td><b>Balanceo</b></td><td>Reparte entre instancias sanas</td></tr>
<tr><td><b>Despliegue progresivo</b></td><td>Reemplaza de a poco y revierte si falla</td></tr>
<tr><td><b>Configuración y secretos</b></td><td>Inyectados como variables o archivos, separados de la imagen</td></tr>
<tr><td><b>Almacenamiento</b></td><td>Volúmenes que siguen a la carga entre nodos</td></tr>
</table>

<div class="dato"><strong>Un dato honesto:</strong> de esas ocho capacidades, un proyecto típico usa tres —
auto-reparación, balanceo y despliegue progresivo—. Y las tres se consiguen con un VPS, un proxy inverso y un
script, o directamente con una plataforma gestionada. <b>Kubernetes se justifica cuando necesitás las ocho, y
sobre todo cuando necesitás la primera</b>: programar cargas entre muchas máquinas.</div>

<h4>Las alternativas, de menos a más</h4>
<table>
<tr><th>Opción</th><th>Complejidad</th><th>Cuándo</th></tr>
<tr><td><b>Compose en un VPS</b></td><td>Muy baja</td><td>Una app, una base, un servidor. Muchísimos proyectos viven acá</td></tr>
<tr><td><b>PaaS</b> (Railway, Render, Fly)</td><td>Baja</td><td>Querés escalado y despliegues sin operar nada</td></tr>
<tr><td><b>Contenedores gestionados</b> (ECS, Cloud Run)</td><td>Media</td><td>Escala real sin administrar un clúster</td></tr>
<tr><td><b>Kubernetes gestionado</b> (EKS, GKE)</td><td>Alta</td><td>Muchos servicios, varios equipos, requisitos específicos</td></tr>
<tr><td><b>Kubernetes propio</b></td><td>Muy alta</td><td>Casi nunca. Requiere gente dedicada</td></tr>
</table>

<p><b>Cloud Run y ECS Fargate merecen atención especial:</b> te dan la mayor parte del valor de un orquestador
—escalado, salud, despliegues progresivos, escalar a cero— <b>sin que administres un clúster</b>. Para la
mayoría de los equipos son la respuesta correcta, y casi nadie los evalúa antes de saltar a Kubernetes.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="k1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL CAMBIO DE MODELO MENTAL</text>

  <rect x="24" y="36" width="304" height="92" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.4"/>
  <text x="176" y="58" text-anchor="middle" fill="#f87171" font-size="12" font-weight="700">IMPERATIVO</text>
  <text x="176" y="80" text-anchor="middle" fill="currentColor" opacity=".75" font-size="11">“corré este contenedor</text>
  <text x="176" y="96" text-anchor="middle" fill="currentColor" opacity=".75" font-size="11">en esta máquina”</text>
  <text x="176" y="118" text-anchor="middle" fill="currentColor" opacity=".5" font-size="10">si se cae, alguien lo arregla</text>

  <rect x="352" y="36" width="304" height="92" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.5"/>
  <text x="504" y="58" text-anchor="middle" fill="#34d399" font-size="12" font-weight="700">DECLARATIVO</text>
  <text x="504" y="80" text-anchor="middle" fill="currentColor" opacity=".75" font-size="11">“quiero 5 copias de esto</text>
  <text x="504" y="96" text-anchor="middle" fill="currentColor" opacity=".75" font-size="11">corriendo, siempre”</text>
  <text x="504" y="118" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">el sistema lo corrige solo</text>

  <line x1="24" y1="146" x2="656" y2="146" stroke="currentColor" opacity=".18"/>

  <text x="24" y="170" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL BUCLE DE RECONCILIACIÓN — todo Kubernetes es esto</text>

  <rect x="120" y="184" width="150" height="42" rx="9" fill="#7c5cff" fill-opacity=".18" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="195" y="203" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">estado DESEADO</text>
  <text x="195" y="218" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">5 réplicas</text>

  <line x1="274" y1="205" x2="300" y2="205" stroke="currentColor" stroke-width="1.3" marker-end="url(#k1)"/>

  <rect x="304" y="184" width="130" height="42" rx="9" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="369" y="209" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">¿difieren?</text>

  <line x1="438" y1="205" x2="464" y2="205" stroke="currentColor" stroke-width="1.3" marker-end="url(#k1)"/>

  <rect x="468" y="184" width="150" height="42" rx="9" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="543" y="203" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">estado REAL</text>
  <text x="543" y="218" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">hay 4</text>

  <path d="M 369 226 q 0 34 -100 34 q -100 0 -100 -34" fill="none" stroke="#34d399" stroke-width="1.6" marker-end="url(#k1)" color="#34d399"/>
  <text x="269" y="278" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">actuar: crear 1 pod más</text>
  <text x="440" y="252" fill="currentColor" opacity=".5" font-size="10">repetido continuamente,</text>
  <text x="440" y="268" fill="currentColor" opacity=".5" font-size="10">por muchos controladores</text>

  <rect x="24" y="296" width="632" height="42" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="340" y="314" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">
    Ese bucle es lo que lo hace potente Y lo que lo hace difícil de depurar.</text>
  <text x="340" y="331" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10.5">
    La pregunta deja de ser “¿qué pasó?” y pasa a ser “¿por qué el sistema cree que esto está bien?”</text>

  <rect x="24" y="350" width="632" height="38" rx="9" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.3" stroke-dasharray="5 4"/>
  <text x="340" y="367" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">
    Cloud Run y ECS Fargate te dan casi todo el valor SIN administrar un clúster.</text>
  <text x="340" y="382" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10.5">
    Para la mayoría de los equipos son la respuesta correcta — y casi nadie los evalúa antes de saltar a Kubernetes.</text>
</svg>`,
        pie: 'Le declarás un estado deseado y el sistema persigue esa meta continuamente. Eso es todo.',
      },

      entrevista: [
        { p: '¿Qué problema resuelve un orquestador de contenedores?',
          r: 'Decidir <b>qué corre dónde</b> cuando tenés muchas máquinas y muchos contenedores, y mantener eso funcionando sin intervención. ' +
             'En concreto: reprograma cargas cuando un nodo se cae, escala según demanda, reparte tráfico entre instancias sanas, ' +
             'y despliega de forma progresiva revirtiendo si falla. Lo central es el cambio de <b>imperativo a declarativo</b>: ' +
             'en vez de decir "corré esto acá", declarás "quiero cinco copias corriendo siempre", y un bucle de reconciliación compara ' +
             'el estado real con el deseado y corrige la diferencia.' },

        { p: '¿Qué es el bucle de reconciliación?',
          r: 'El mecanismo central de Kubernetes: controladores que leen continuamente el <b>estado deseado</b> de la API, observan el ' +
             '<b>estado real</b> del clúster, y actúan para acercarlos. Si matás un pod, en segundos aparece otro — no porque alguien reaccionó, ' +
             'sino porque un controlador notó que hay cuatro y deberían ser cinco. Es lo que lo hace potente y también lo que lo hace difícil de ' +
             'depurar: cuando algo no funciona, la pregunta deja de ser "¿qué pasó?" y pasa a ser <b>"¿por qué el sistema cree que esto está bien?"</b>.' },

        { p: '¿Qué alternativas a Kubernetes considerarías primero?',
          r: 'Varias, en orden de complejidad. <b>Compose en un VPS</b> para una aplicación y su base: muchísimos proyectos viven bien ahí. ' +
             'Un <b>PaaS</b> como Railway o Render si querés escalado y despliegues sin operar nada. Y sobre todo <b>contenedores gestionados</b> — ' +
             'Cloud Run o ECS Fargate—, que dan la mayor parte del valor de un orquestador —escalado, healthchecks, despliegues progresivos, ' +
             'escalar a cero— <b>sin que administres un clúster</b>. Para la mayoría de los equipos son la respuesta correcta, y casi nadie los ' +
             'evalúa antes de saltar a Kubernetes.' },
      ],

      practica: `
<h4>La pregunta que ordena la decisión</h4>
<p><b>¿Necesitás programar cargas entre varias máquinas?</b></p>
<ul>
<li><b>No</b> — una máquina alcanza → Compose en un VPS, o un PaaS.</li>
<li><b>Sí, pero no quiero administrar el clúster</b> → Cloud Run o ECS Fargate.</li>
<li><b>Sí, y necesito control fino</b> → Kubernetes gestionado.</li>
</ul>

<div class="aviso"><strong>El costo real de Kubernetes no es el clúster: es el tiempo.</strong> Un clúster
gestionado cuesta unos pocos cientos de dólares al mes. Lo caro es que <b>alguien tiene que entenderlo</b>:
actualizaciones de versión, CRDs, políticas de red, certificados, límites de recursos, depuración de pods que
no arrancan. En un equipo chico, esa persona deja de construir producto.</div>

<h4>Lo que un VPS con Compose resuelve perfectamente</h4>
<table>
<tr><th>Necesidad</th><th>Cómo</th></tr>
<tr><td>Reinicio ante fallo</td><td><code>restart: unless-stopped</code></td></tr>
<tr><td>HTTPS automático</td><td>Caddy o Traefik delante</td></tr>
<tr><td>Despliegue sin cortes</td><td>Levantar la nueva, esperar salud, cambiar el proxy, bajar la vieja</td></tr>
<tr><td>Límites de recursos</td><td><code>deploy.resources.limits</code></td></tr>
<tr><td>Respaldos</td><td>Un cron con <code>pg_dump</code></td></tr>
<tr><td>Métricas</td><td>Un agente y un panel gestionado</td></tr>
</table>
<p>Lo único que <b>no</b> resuelve es que si esa máquina se cae, no hay nadie que mueva las cargas a otra.
<b>Esa es la pregunta que define si necesitás un orquestador.</b> Y muchas veces la respuesta honesta es que
unos minutos de caída al año son aceptables.</p>

<h4>Cuándo el salto sí se justifica</h4>
<ul>
<li>Más de 10-15 servicios distintos con ciclos de vida independientes.</li>
<li>Varios equipos desplegando sin pisarse.</li>
<li>Requisito real de disponibilidad ante caída de una máquina completa.</li>
<li>Cargas por lotes o trabajos programados a escala.</li>
<li>Ya hay alguien en el equipo que sabe operarlo.</li>
</ul>
<p>Ese último punto no es menor: <b>adoptar Kubernetes sin nadie que lo entienda es la receta más confiable
para un mal semestre</b>.</p>
`,

      errores: [
        { mito: 'Kubernetes es el paso natural cuando un proyecto crece.',
          realidad: 'El paso natural suele ser <b>contenedores gestionados</b> —Cloud Run, ECS Fargate—, que dan escalado, salud y despliegues ' +
                    'progresivos sin administrar un clúster. Kubernetes se justifica cuando necesitás programar cargas entre muchas máquinas ' +
                    'con control fino, no cuando "el proyecto creció".' },

        { mito: 'Con un clúster gestionado, Kubernetes es fácil.',
          realidad: 'El gestionado te quita el <b>plano de control</b>, que es una parte. Queda todo lo demás: actualizaciones, políticas de red, ' +
                    'CRDs, límites de recursos, ingress, certificados y depurar pods que no arrancan. <b>El costo no es el clúster: es el tiempo ' +
                    'de alguien.</b>' },

        { mito: 'Necesito Kubernetes para tener alta disponibilidad.',
          realidad: 'Necesitás <b>más de una máquina y algo que reparta</b>. Eso se consigue con dos VPS y un balanceador, o directamente con una ' +
                    'plataforma gestionada. Kubernetes es una forma de lograrlo, no la única ni la más simple.' },

        { mito: 'Si lo pongo en el currículum, mejor.',
          realidad: 'En una entrevista técnica pesa mucho más <b>explicar por qué NO lo usaste</b> cuando no hacía falta. Adoptar complejidad ' +
                    'innecesaria es exactamente lo que un entrevistador con experiencia busca detectar.' },
      ],

      glosario: [
        { t: 'Orquestador', d: 'Sistema que decide dónde corre cada contenedor y mantiene el estado deseado.' },
        { t: 'Estado deseado', d: 'Declaración de cómo debería verse el sistema. La base del modelo declarativo.' },
        { t: 'Bucle de reconciliación', d: 'Ciclo continuo que compara el estado real con el deseado y corrige la diferencia.' },
        { t: 'Declarativo', d: 'Decir qué se quiere, no cómo lograrlo.' },
        { t: 'Auto-reparación', d: 'Reiniciar o reprogramar automáticamente lo que falla.' },
        { t: 'Cloud Run / ECS Fargate', d: 'Contenedores gestionados: escalado y despliegues sin administrar un clúster.' },
        { t: 'PaaS', d: 'Plataforma que ejecuta tu código sin que gestiones infraestructura: Railway, Render, Fly.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Las piezas de Kubernetes',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> Kubernetes tiene muchos nombres raros, pero son
pocas piezas con roles claros. Una vez que las ubicás, el vocabulario deja de dar miedo.</div>

<h4>De abajo hacia arriba</h4>

<p><b>Nodo</b> — una máquina del clúster. Puede ser física o virtual.</p>

<p><b>Pod</b> — la unidad mínima. Uno o más contenedores que <b>siempre corren juntos</b>, comparten red y
pueden compartir almacenamiento. Casi siempre es un solo contenedor.</p>
<p>Lo importante: <b>los pods son descartables</b>. Se crean y se destruyen todo el tiempo, y cambian de IP.
Nunca te conectás a un pod directamente.</p>

<p><b>Deployment</b> — declara cuántas copias de un pod querés y con qué imagen. Es lo que usás el 90% del
tiempo. Si decís "quiero 3" y hay 2, crea uno.</p>

<p><b>Service</b> — un <b>nombre y una IP estables</b> para llegar a un grupo de pods. Como los pods cambian
de IP, el Service es la dirección fija que sí podés usar. Además reparte el tráfico entre los que están sanos.</p>

<p><b>Ingress</b> — la puerta desde afuera. Enruta por dominio y por path hacia distintos Services, y maneja
los certificados.</p>

<p><b>ConfigMap y Secret</b> — configuración y credenciales, separadas de la imagen. Se inyectan como
variables de entorno o como archivos.</p>

<p><b>Namespace</b> — una carpeta lógica para separar entornos o equipos dentro del mismo clúster.</p>

<div class="aviso"><strong>Con esas siete piezas se despliega el 90% de las aplicaciones.</strong> El resto del
vocabulario —StatefulSets, DaemonSets, operadores, CRDs— aparece cuando tenés necesidades específicas. No hace
falta saberlo todo para empezar a trabajar en un equipo que lo usa.</div>
`,

      tecnico: `
<h4>El manifiesto mínimo</h4>
<pre><code>apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
spec:
  replicas: 3
  selector:
    matchLabels: { app: mi-app }        # qué pods me pertenecen
  template:
    metadata:
      labels: { app: mi-app }           # ← debe coincidir con el selector
    spec:
      containers:
      - name: app
        image: registro.io/mi-app:a3f2c91
        ports: [{ containerPort: 3000 }]
        resources:
          requests: { memory: "256Mi", cpu: "100m" }   # para PROGRAMAR
          limits:   { memory: "512Mi", cpu: "500m" }   # tope duro
        livenessProbe:
          httpGet: { path: /salud/vivo, port: 3000 }
          periodSeconds: 20
        readinessProbe:
          httpGet: { path: /salud/listo, port: 3000 }
          periodSeconds: 5
        envFrom:
        - secretRef: { name: mi-app-secretos }
---
apiVersion: v1
kind: Service
metadata:
  name: mi-app
spec:
  selector: { app: mi-app }             # a qué pods apunta
  ports: [{ port: 80, targetPort: 3000 }]</code></pre>

<div class="dato"><strong>La distinción entre <code>requests</code> y <code>limits</code> es la más importante
y la peor entendida.</strong> <b>Requests</b> es lo que el programador usa para <i>decidir dónde cabe</i> el pod:
si pedís 256 Mi, busca un nodo con esa memoria libre. <b>Limits</b> es el tope duro: superar el de memoria hace
que el kernel mate el contenedor.<br><br>
Consecuencia práctica: si ponés <i>requests</i> muy bajos, Kubernetes mete demasiados pods en un nodo y todo
compite; si los ponés muy altos, desperdiciás capacidad y los pods quedan en <code>Pending</code> porque no
entran en ningún lado. <b>Y con la CPU hay una diferencia clave:</b> superar el límite de CPU <i>ralentiza</i>
(throttling), superar el de memoria <i>mata</i>.</div>

<h4>Las etiquetas son el pegamento</h4>
<p>Kubernetes no conecta objetos por referencia directa sino por <b>etiquetas y selectores</b>. Un Service
encuentra "todos los pods con la etiqueta <code>app: mi-app</code>". Si el selector y las etiquetas del pod no
coinciden, <b>el Service no apunta a nada</b> — y no da error: simplemente no hay endpoints.</p>
<p>Es la causa número uno de "el Service no responde", y se diagnostica con
<code>kubectl get endpoints mi-app</code>: si sale vacío, el selector no coincide.</p>

<h4>Tipos de Service</h4>
<table>
<tr><th>Tipo</th><th>Alcance</th></tr>
<tr><td><b>ClusterIP</b></td><td>Solo dentro del clúster. El default y lo más usado</td></tr>
<tr><td><b>NodePort</b></td><td>Abre un puerto en cada nodo. Poco elegante</td></tr>
<tr><td><b>LoadBalancer</b></td><td>Pide un balanceador al proveedor de nube. <b>Cada uno cuesta dinero</b></td></tr>
<tr><td><b>ExternalName</b></td><td>Alias DNS a un servicio de afuera</td></tr>
</table>
<p>Por eso se usa <b>un Ingress</b> con muchos Services de tipo ClusterIP detrás, en vez de un LoadBalancer por
servicio: un solo balanceador, muchas rutas.</p>

<h4>Otros objetos que vas a escuchar</h4>
<ul>
<li><b>StatefulSet</b> — para cargas con identidad y almacenamiento propio, como una base de datos. Los pods tienen nombres estables.</li>
<li><b>DaemonSet</b> — una copia en <i>cada</i> nodo. Típico de agentes de logs y métricas.</li>
<li><b>Job / CronJob</b> — tareas que terminan, y tareas programadas.</li>
<li><b>HorizontalPodAutoscaler</b> — ajusta réplicas según CPU o métricas propias.</li>
<li><b>PersistentVolumeClaim</b> — pedido de almacenamiento que sobrevive al pod.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="kp1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <rect x="24" y="18" width="632" height="238" rx="12" fill="currentColor" fill-opacity=".03" stroke="currentColor" stroke-opacity=".25" stroke-width="1.3"/>
  <text x="44" y="38" fill="currentColor" opacity=".55" font-size="10.5" font-weight="700">CLÚSTER</text>

  <rect x="240" y="46" width="200" height="36" rx="8" fill="#7c5cff" fill-opacity=".22" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="340" y="69" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">INGRESS  ·  la puerta</text>
  <text x="460" y="62" fill="currentColor" opacity=".5" font-size="9.5">dominio + path</text>
  <text x="460" y="76" fill="currentColor" opacity=".5" font-size="9.5">+ certificados</text>

  <line x1="340" y1="82" x2="340" y2="100" stroke="currentColor" stroke-width="1.3" marker-end="url(#kp1)"/>

  <rect x="240" y="104" width="200" height="40" rx="8" fill="#22d3ee" fill-opacity=".22" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="340" y="122" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">SERVICE</text>
  <text x="340" y="137" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">nombre e IP estables</text>
  <text x="460" y="128" fill="#f87171" font-size="9.5" font-weight="700">selector: app=mi-app</text>

  <line x1="290" y1="144" x2="230" y2="176" stroke="currentColor" stroke-width="1.2" marker-end="url(#kp1)"/>
  <line x1="340" y1="144" x2="340" y2="176" stroke="currentColor" stroke-width="1.2" marker-end="url(#kp1)"/>
  <line x1="390" y1="144" x2="450" y2="176" stroke="currentColor" stroke-width="1.2" marker-end="url(#kp1)"/>

  <rect x="170" y="180" width="120" height="56" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.3"/>
  <text x="230" y="200" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">POD</text>
  <text x="230" y="215" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">app=mi-app</text>
  <text x="230" y="229" text-anchor="middle" fill="currentColor" opacity=".4" font-size="8.5">IP 10.1.4.7</text>

  <rect x="300" y="180" width="120" height="56" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.3"/>
  <text x="360" y="200" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">POD</text>
  <text x="360" y="215" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">app=mi-app</text>
  <text x="360" y="229" text-anchor="middle" fill="currentColor" opacity=".4" font-size="8.5">IP 10.1.9.2</text>

  <rect x="430" y="180" width="120" height="56" rx="8" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.3"/>
  <text x="490" y="200" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">POD</text>
  <text x="490" y="215" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">app=mi-app</text>
  <text x="490" y="229" text-anchor="middle" fill="currentColor" opacity=".4" font-size="8.5">IP 10.1.2.8</text>

  <rect x="44" y="180" width="112" height="56" rx="8" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.3" stroke-dasharray="4 3"/>
  <text x="100" y="202" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">DEPLOYMENT</text>
  <text x="100" y="218" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">replicas: 3</text>
  <text x="100" y="231" text-anchor="middle" fill="currentColor" opacity=".45" font-size="8.5">los crea y los cuida</text>

  <text x="24" y="278" fill="#f87171" font-size="11.5" font-weight="700">
    LAS ETIQUETAS SON EL PEGAMENTO — y la causa n°1 de “el Service no responde”</text>
  <text x="24" y="296" fill="currentColor" opacity=".65" font-size="10.5">
    Si el selector del Service no coincide con las etiquetas de los pods, NO apunta a nada — y no da error.</text>
  <text x="24" y="312" fill="currentColor" opacity=".65" font-size="10.5" font-family="monospace">
    kubectl get endpoints mi-app   →  vacío = el selector no coincide</text>

  <rect x="24" y="326" width="304" height="62" rx="9" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="44" y="346" fill="#22d3ee" font-size="11" font-weight="700">requests</text>
  <text x="44" y="364" fill="currentColor" opacity=".7" font-size="10">para DECIDIR en qué nodo cabe el pod</text>
  <text x="44" y="380" fill="currentColor" opacity=".5" font-size="9.5">muy bajos → todo compite · muy altos → Pending</text>

  <rect x="352" y="326" width="304" height="62" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="372" y="346" fill="#f87171" font-size="11" font-weight="700">limits</text>
  <text x="372" y="364" fill="currentColor" opacity=".7" font-size="10">tope duro</text>
  <text x="372" y="380" fill="#f87171" font-size="9.5" font-weight="700">CPU → ralentiza  ·  memoria → MATA</text>
</svg>`,
        pie: 'Siete piezas cubren el 90% de los despliegues. El resto del vocabulario aparece cuando hace falta.',
      },

      entrevista: [
        { p: '¿Qué es un pod y por qué no te conectás directamente a él?',
          r: 'Un pod es la unidad mínima de Kubernetes: uno o más contenedores que corren juntos, comparten red y pueden compartir almacenamiento. ' +
             'Casi siempre es un solo contenedor. No te conectás directamente porque <b>los pods son descartables</b>: se crean y destruyen ' +
             'continuamente y cambian de IP. Para eso está el <b>Service</b>, que da un nombre y una IP estables y reparte el tráfico entre los ' +
             'pods que están sanos.' },

        { p: '¿Cuál es la diferencia entre requests y limits?',
          r: '<b>Requests</b> es lo que el programador usa para decidir <i>dónde cabe</i> el pod: si pedís 256 Mi, busca un nodo con esa memoria ' +
             'libre. <b>Limits</b> es el tope duro en ejecución. Y hay una asimetría importante: superar el límite de <b>CPU ralentiza</b> ' +
             '—throttling—, mientras que superar el de <b>memoria mata</b> el contenedor. En la práctica, requests muy bajos hacen que Kubernetes ' +
             'meta demasiados pods en un nodo y todo compita; requests muy altos desperdician capacidad y dejan pods en <code>Pending</code> ' +
             'porque no entran en ningún lado.' },

        { p: 'Tu Service no responde pero los pods están corriendo. ¿Qué revisás?',
          r: 'Los <b>endpoints</b>: <code>kubectl get endpoints mi-app</code>. Si sale vacío, el <b>selector del Service no coincide</b> con las ' +
             'etiquetas de los pods. Kubernetes no conecta objetos por referencia directa sino por etiquetas, y cuando no coinciden el Service ' +
             'simplemente no apunta a nada — <b>sin dar ningún error</b>. Es la causa número uno de este síntoma. Si los endpoints están pero igual ' +
             'no responde, entonces miro el <i>readinessProbe</i>: un pod que no pasa readiness no recibe tráfico aunque esté corriendo.' },

        { p: '¿Por qué se usa un Ingress en vez de un Service de tipo LoadBalancer por aplicación?',
          r: 'Porque cada Service de tipo LoadBalancer <b>pide un balanceador al proveedor de nube, y cada uno cuesta dinero</b>. Con diez servicios ' +
             'serían diez balanceadores. Un <b>Ingress</b> usa un único balanceador de entrada y enruta por dominio y por path hacia muchos Services ' +
             'de tipo ClusterIP, que son internos y gratuitos. Además centraliza la gestión de certificados TLS en un solo lugar.' },
      ],

      practica: `
<h4>Los comandos que se usan de verdad</h4>
<pre><code># estado general
kubectl get pods                      # -w para ver cambios en vivo
kubectl get pods -o wide              # incluye nodo e IP
kubectl get all

# el más importante para depurar: qué le pasó a este pod
kubectl describe pod &lt;nombre&gt;         # ← los Events del final son la clave

# logs
kubectl logs &lt;pod&gt; -f
kubectl logs &lt;pod&gt; --previous         # ← del contenedor ANTERIOR, si se reinició

# entrar
kubectl exec -it &lt;pod&gt; -- sh

# probar un Service desde adentro del clúster
kubectl run tmp --rm -it --image=curlimages/curl -- sh
# &gt; curl http://mi-app

# ¿el Service apunta a algo?
kubectl get endpoints mi-app          # vacío = selector mal</code></pre>

<div class="aviso"><strong><code>kubectl describe pod</code> es el comando que más resuelve.</strong> La
sección <b>Events</b> del final te dice en texto claro qué pasó: que no hay nodo con recursos suficientes,
que no pudo descargar la imagen, que el readinessProbe falla, que lo mataron por memoria. La mayoría de la
gente mira los logs primero y los eventos nunca — y los eventos son los que explican por qué el pod ni
siquiera llegó a generar logs.</div>

<h4>Estados de un pod y qué significan</h4>
<table>
<tr><th>Estado</th><th>Qué pasa</th><th>Dónde mirar</th></tr>
<tr><td><code>Pending</code></td><td>No encontró nodo donde entre</td><td>Events: requests demasiado altos o clúster lleno</td></tr>
<tr><td><code>ImagePullBackOff</code></td><td>No pudo descargar la imagen</td><td>Nombre de la imagen, credenciales del registro</td></tr>
<tr><td><code>CrashLoopBackOff</code></td><td>Arranca y muere en bucle</td><td><code>logs --previous</code></td></tr>
<tr><td><code>OOMKilled</code></td><td>Superó el límite de memoria</td><td>Subir el límite o arreglar la fuga</td></tr>
<tr><td><code>Running</code> pero sin tráfico</td><td>No pasa el readinessProbe</td><td>Probar el endpoint de salud desde adentro</td></tr>
</table>

<h4>Secretos: la advertencia que hay que saber</h4>
<pre><code># Un Secret de Kubernetes NO está cifrado por defecto: está en base64.
kubectl get secret mis-secretos -o jsonpath='{.data.password}' | base64 -d
# …y sale la contraseña en texto plano.</code></pre>
<p>Para secretos reales hace falta <b>cifrado en reposo</b> configurado en el clúster, o un gestor externo
—Vault, AWS Secrets Manager, External Secrets Operator—. Y nunca subas manifiestos con Secrets al repositorio:
para eso existe <b>Sealed Secrets</b>, que los cifra de forma que solo el clúster pueda abrirlos.</p>
`,

      errores: [
        { mito: 'Un Secret de Kubernetes está cifrado.',
          realidad: 'Está en <b>base64</b>, que es codificación, no cifrado: cualquiera con permiso de lectura lo decodifica en un comando. ' +
                    'Para secretos reales hace falta cifrado en reposo en el clúster o un gestor externo. Y nunca subir manifiestos con Secrets ' +
                    'al repositorio.' },

        { mito: 'Si el pod está Running, la aplicación funciona.',
          realidad: '<code>Running</code> significa que el contenedor arrancó. Si no pasa el <b>readinessProbe</b>, el Service no le manda tráfico — ' +
                    'y el síntoma es "está corriendo pero no responde". Son dos cosas distintas y se diagnostican distinto.' },

        { mito: 'requests y limits son lo mismo con otro nombre.',
          realidad: '<b>Requests</b> decide dónde cabe el pod; <b>limits</b> es el tope en ejecución. Y la asimetría importa: superar el límite de ' +
                    'CPU <b>ralentiza</b>, superar el de memoria <b>mata</b>. Confundirlos lleva a pods en <code>Pending</code> o a nodos saturados.' },

        { mito: 'Pongo un Service de tipo LoadBalancer para cada aplicación.',
          realidad: 'Cada uno <b>pide un balanceador al proveedor y cuesta dinero</b>. Lo correcto es un <b>Ingress</b> con muchos Services ' +
                    'ClusterIP detrás: un solo balanceador, muchas rutas, y los certificados centralizados.' },
      ],

      glosario: [
        { t: 'Nodo', d: 'Una máquina del clúster.' },
        { t: 'Pod', d: 'Unidad mínima: uno o más contenedores que corren juntos y comparten red.' },
        { t: 'Deployment', d: 'Declara cuántas réplicas de un pod se quieren y con qué imagen.' },
        { t: 'Service', d: 'Nombre e IP estables para un grupo de pods, con balanceo entre los sanos.' },
        { t: 'Ingress', d: 'Entrada desde afuera: enruta por dominio y path, y maneja TLS.' },
        { t: 'ConfigMap / Secret', d: 'Configuración y credenciales separadas de la imagen. El Secret solo está en base64.' },
        { t: 'Namespace', d: 'Separación lógica dentro de un clúster, por entorno o por equipo.' },
        { t: 'requests', d: 'Recursos que el programador usa para decidir en qué nodo entra el pod.' },
        { t: 'limits', d: 'Tope duro de recursos. Exceder memoria mata el contenedor; exceder CPU lo ralentiza.' },
        { t: 'Selector', d: 'Consulta por etiquetas que conecta objetos. Si no coincide, el Service no apunta a nada.' },
        { t: 'StatefulSet', d: 'Para cargas con identidad estable y almacenamiento propio, como bases de datos.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Tráfico, despliegues y escalado',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> desplegar en Kubernetes no es "apagar lo viejo y
prender lo nuevo". Es <b>reemplazar de a poco</b>, verificando que cada pieza nueva funcione antes de retirar
una vieja.</div>

<h4>El despliegue progresivo</h4>
<p>Cuando cambiás la imagen de un Deployment, Kubernetes hace esto solo:</p>
<ol>
<li>Crea un pod con la versión nueva.</li>
<li><b>Espera a que pase su readinessProbe.</b></li>
<li>Cuando está listo, elimina un pod viejo.</li>
<li>Repite hasta reemplazar todos.</li>
</ol>
<p>En ningún momento hay menos capacidad de la que declaraste. Y si los pods nuevos <b>nunca pasan
readiness</b>, el despliegue se frena y los viejos siguen atendiendo. <b>Eso es lo que evita que un deploy roto
tire el servicio.</b></p>

<div class="aviso"><strong>Y esto explica por qué el readinessProbe no es opcional.</strong> Sin él,
Kubernetes considera que el pod está listo apenas arranca el proceso — antes de que tu aplicación pueda
responder. Manda tráfico a pods que todavía están inicializando, y el resultado son errores durante cada
despliegue que aparecen y desaparecen solos.</div>

<h4>Escalado, en dos niveles</h4>
<p><b>Horizontal (pods).</b> Más copias de tu aplicación. Es lo que hace el autoescalador según CPU o alguna
métrica propia. Es lo que se usa el 95% del tiempo.</p>
<p><b>De nodos.</b> Si no hay lugar para más pods, hay que agregar máquinas. Eso lo hace otro componente
—el <i>cluster autoscaler</i>— y tarda minutos, no segundos.</p>

<h4>El límite que casi nadie considera</h4>
<p>Podés escalar tu aplicación a cincuenta pods en segundos. <b>Tu base de datos sigue siendo una.</b></p>
<p>Cada pod abre conexiones al pool. Cincuenta pods con diez conexiones cada uno son quinientas conexiones, y
Postgres por defecto acepta cien. El resultado es que <b>escalar hacia arriba tira la base de datos</b> — y el
síntoma es que cuanto más escalás, peor funciona todo.</p>
<p>La solución es un <b>pooler</b> —PgBouncer, o el pooler de Supabase— que multiplexa muchas conexiones de
aplicación sobre pocas conexiones reales.</p>
`,

      tecnico: `
<h4>Controlar el despliegue</h4>
<pre><code>spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1           # cuántos pods EXTRA se permiten durante el cambio
      maxUnavailable: 0     # cuántos pueden faltar → 0 = nunca menos capacidad
  minReadySeconds: 10       # esperar antes de dar por bueno un pod nuevo
  progressDeadlineSeconds: 300   # si tarda más, marcar el despliegue como fallido</code></pre>

<pre><code># ver el avance
kubectl rollout status deployment/mi-app

# volver atrás: una sola línea, segundos
kubectl rollout undo deployment/mi-app
kubectl rollout history deployment/mi-app</code></pre>

<div class="dato"><strong><code>maxUnavailable: 0</code> es lo que garantiza que nunca haya menos capacidad
de la declarada</strong>, a costa de necesitar recursos para un pod extra durante el cambio. Con
<code>maxUnavailable: 1</code> el despliegue es más liviano pero durante unos segundos tenés una réplica menos —
lo que en horario pico puede significar latencia o errores.</div>

<h4>Estrategias más allá del rolling update</h4>
<table>
<tr><th>Estrategia</th><th>Cómo</th><th>Costo</th></tr>
<tr><td><b>Rolling update</b></td><td>Reemplazo gradual. El default</td><td>Bajo. Conviven dos versiones un rato</td></tr>
<tr><td><b>Blue-green</b></td><td>Se levanta el entorno completo nuevo y se cambia el tráfico de golpe</td><td>Doble de recursos. Vuelta atrás instantánea</td></tr>
<tr><td><b>Canario</b></td><td>Se manda un 5% del tráfico a la versión nueva y se mide</td><td>Requiere métricas y un controlador de tráfico</td></tr>
</table>
<p>El canario es el más seguro y el que más infraestructura necesita: sin métricas confiables para decidir si
promover o revertir, es solo un rolling update más lento.</p>

<div class="dato"><strong>El requisito que las tres comparten y nadie menciona:</strong> durante cualquier
despliegue <b>conviven dos versiones de tu aplicación</b> contra la <b>misma base de datos</b>. Eso obliga a que
las migraciones sean <b>compatibles hacia atrás</b>: no podés borrar una columna que la versión vieja todavía
lee. El patrón es <i>expand and contract</i> — primero agregar, desplegar el código que usa lo nuevo, y recién
en un despliegue posterior eliminar lo viejo. <b>Es la causa más común de incidentes durante despliegues</b>, y
aplica igual sin Kubernetes.</div>

<h4>Autoescalado horizontal</h4>
<pre><code>apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  scaleTargetRef: { kind: Deployment, name: mi-app }
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target: { type: Utilization, averageUtilization: 70 }
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300   # bajar despacio, para no oscilar</code></pre>
<p>Ese <code>stabilizationWindowSeconds</code> evita el <i>flapping</i>: escalar hacia arriba y hacia abajo
repetidamente ante picos cortos, que además cuesta plata y genera reinicios innecesarios.</p>

<h4>Interrupciones voluntarias</h4>
<p>Un <b>PodDisruptionBudget</b> declara cuántos pods pueden estar fuera durante mantenimiento del clúster:</p>
<pre><code>apiVersion: policy/v1
kind: PodDisruptionBudget
spec:
  minAvailable: 2
  selector: { matchLabels: { app: mi-app } }</code></pre>
<p>Sin él, actualizar los nodos puede vaciar todos tus pods a la vez. Es un objeto de cinco líneas que evita
una caída durante una operación rutinaria.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    ROLLING UPDATE — nunca menos capacidad de la declarada</text>

  <text x="30" y="52" fill="currentColor" opacity=".5" font-size="9.5">inicio</text>
  <rect x="80" y="40" width="42" height="20" rx="4" fill="#f87171" fill-opacity=".55"/>
  <rect x="126" y="40" width="42" height="20" rx="4" fill="#f87171" fill-opacity=".55"/>
  <rect x="172" y="40" width="42" height="20" rx="4" fill="#f87171" fill-opacity=".55"/>
  <text x="230" y="54" fill="currentColor" opacity=".55" font-size="9.5">3 pods v1.4.1</text>

  <text x="30" y="84" fill="currentColor" opacity=".5" font-size="9.5">paso 1</text>
  <rect x="80" y="72" width="42" height="20" rx="4" fill="#f87171" fill-opacity=".55"/>
  <rect x="126" y="72" width="42" height="20" rx="4" fill="#f87171" fill-opacity=".55"/>
  <rect x="172" y="72" width="42" height="20" rx="4" fill="#f87171" fill-opacity=".55"/>
  <rect x="218" y="72" width="42" height="20" rx="4" fill="#fbbf24" fill-opacity=".55" stroke="#fbbf24" stroke-dasharray="3 2"/>
  <text x="272" y="86" fill="#fbbf24" font-size="9.5" font-weight="700">+1 nuevo, esperando readiness</text>

  <text x="30" y="116" fill="currentColor" opacity=".5" font-size="9.5">paso 2</text>
  <rect x="80" y="104" width="42" height="20" rx="4" fill="#f87171" fill-opacity=".55"/>
  <rect x="126" y="104" width="42" height="20" rx="4" fill="#f87171" fill-opacity=".55"/>
  <rect x="172" y="104" width="42" height="20" rx="4" fill="#34d399" fill-opacity=".7"/>
  <text x="230" y="118" fill="#34d399" font-size="9.5" font-weight="700">listo → se elimina un viejo</text>

  <text x="30" y="148" fill="currentColor" opacity=".5" font-size="9.5">fin</text>
  <rect x="80" y="136" width="42" height="20" rx="4" fill="#34d399" fill-opacity=".7"/>
  <rect x="126" y="136" width="42" height="20" rx="4" fill="#34d399" fill-opacity=".7"/>
  <rect x="172" y="136" width="42" height="20" rx="4" fill="#34d399" fill-opacity=".7"/>
  <text x="230" y="150" fill="currentColor" opacity=".55" font-size="9.5">3 pods v1.4.2</text>

  <rect x="24" y="168" width="632" height="34" rx="8" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="340" y="189" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">
    Si los pods nuevos NUNCA pasan readiness, el despliegue se frena y los viejos siguen atendiendo.</text>

  <line x1="24" y1="216" x2="656" y2="216" stroke="currentColor" opacity=".18"/>

  <text x="24" y="240" fill="#f87171" font-size="12" font-weight="700">
    EL LÍMITE QUE CASI NADIE CONSIDERA</text>

  <rect x="24" y="252" width="240" height="94" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.3"/>
  <text x="144" y="272" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">tu app escala fácil</text>
  <g fill="#34d399" fill-opacity=".6">
    <rect x="44" y="284" width="26" height="14" rx="3"/><rect x="74" y="284" width="26" height="14" rx="3"/>
    <rect x="104" y="284" width="26" height="14" rx="3"/><rect x="134" y="284" width="26" height="14" rx="3"/>
    <rect x="164" y="284" width="26" height="14" rx="3"/><rect x="194" y="284" width="26" height="14" rx="3"/>
    <rect x="44" y="302" width="26" height="14" rx="3"/><rect x="74" y="302" width="26" height="14" rx="3"/>
    <rect x="104" y="302" width="26" height="14" rx="3"/><rect x="134" y="302" width="26" height="14" rx="3"/>
  </g>
  <text x="144" y="336" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10">50 pods × 10 conexiones</text>

  <text x="278" y="300" fill="currentColor" opacity=".4" font-size="16">→</text>
  <text x="278" y="322" fill="#f87171" font-size="10" font-weight="700">500</text>

  <rect x="316" y="252" width="160" height="94" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="396" y="280" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">TU BASE</text>
  <text x="396" y="298" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">SIGUE SIENDO UNA</text>
  <text x="396" y="320" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10">límite: ~100 conexiones</text>
  <text x="396" y="336" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">cuanto más escalás, peor anda</text>

  <text x="492" y="300" fill="currentColor" opacity=".4" font-size="16">→</text>

  <rect x="516" y="266" width="140" height="66" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="586" y="292" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">POOLER</text>
  <text x="586" y="310" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">PgBouncer · Supabase</text>
  <text x="586" y="324" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9">500 → 20 reales</text>

  <text x="24" y="372" fill="#fbbf24" font-size="11" font-weight="700">
    Durante CUALQUIER despliegue conviven dos versiones contra la MISMA base.</text>
  <text x="24" y="388" fill="currentColor" opacity=".65" font-size="10.5">
    Las migraciones tienen que ser compatibles hacia atrás: agregar primero, borrar en un deploy posterior.</text>
</svg>`,
        pie: 'Escalar la aplicación es fácil. Lo que no escala es lo que está detrás.',
      },

      entrevista: [
        { p: '¿Cómo funciona un despliegue en Kubernetes?',
          r: 'Con un <b>rolling update</b>: al cambiar la imagen, Kubernetes crea un pod con la versión nueva, <b>espera a que pase su ' +
             'readinessProbe</b>, y recién entonces elimina uno viejo. Repite hasta reemplazar todos. Con <code>maxUnavailable: 0</code> nunca hay ' +
             'menos capacidad de la declarada. Y lo más valioso: si los pods nuevos <b>nunca pasan readiness</b>, el despliegue se frena solo y los ' +
             'viejos siguen atendiendo — es lo que evita que un deploy roto tire el servicio.' },

        { p: '¿Por qué el readinessProbe no es opcional?',
          r: 'Porque sin él Kubernetes considera que el pod está listo apenas arranca el proceso, <b>antes de que la aplicación pueda responder</b>. ' +
             'Entonces le manda tráfico a pods que todavía están inicializando —conectando a la base, cargando configuración— y el resultado son ' +
             'errores durante cada despliegue que aparecen y desaparecen solos. Además, sin readiness el rolling update pierde su red de seguridad: ' +
             'no puede detectar que la versión nueva está rota.' },

        { p: 'Escalás tu aplicación a 50 pods y todo empieza a andar peor. ¿Qué pasó?',
          r: 'Casi seguro las <b>conexiones a la base de datos</b>. Cada pod abre su propio pool: 50 pods con 10 conexiones son 500, y Postgres por ' +
             'defecto acepta alrededor de 100. El síntoma característico es que <b>cuanto más escalás, peor funciona todo</b>, que es contraintuitivo. ' +
             'La solución es un <b>pooler</b> —PgBouncer o el pooler de Supabase— que multiplexa muchas conexiones de aplicación sobre pocas reales. ' +
             'Es el límite que casi nadie considera antes de escalar.' },

        { p: '¿Qué cuidado hay que tener con las migraciones de base de datos al desplegar?',
          r: 'Que durante cualquier despliegue progresivo <b>conviven dos versiones de la aplicación contra la misma base</b>. Eso obliga a que las ' +
             'migraciones sean <b>compatibles hacia atrás</b>: no podés borrar o renombrar una columna que la versión vieja todavía lee. ' +
             'El patrón es <i>expand and contract</i>: primero agregar la columna nueva, después desplegar el código que la usa, y recién en un ' +
             'despliegue posterior eliminar la vieja. <b>Es la causa más común de incidentes durante despliegues</b>, y aplica igual sin Kubernetes.' },
      ],

      practica: `
<h4>Ver y revertir un despliegue</h4>
<pre><code># seguir el avance
kubectl rollout status deployment/mi-app --timeout=5m

# si algo salió mal: una línea, segundos
kubectl rollout undo deployment/mi-app

# ver el historial de versiones
kubectl rollout history deployment/mi-app
kubectl rollout undo deployment/mi-app --to-revision=3</code></pre>

<div class="aviso"><strong>Poner ese <code>--timeout</code> en tu pipeline de CI es lo que convierte un
despliegue en algo verificado.</strong> Sin él, el comando devuelve enseguida y CI marca el deploy como exitoso
aunque los pods nunca hayan pasado readiness. Con timeout, si el despliegue no progresa, CI falla y te enterás
en el momento — no cuando llega la queja.</div>

<h4>Migración compatible hacia atrás</h4>
<pre><code>-- ❌ Rompe la versión vieja durante el despliegue
alter table clientes rename column nombre to nombre_completo;

-- ✅ Expand and contract, en tres pasos
-- Paso 1 (deploy A): agregar, sin borrar nada
alter table clientes add column nombre_completo text;
update clientes set nombre_completo = nombre where nombre_completo is null;
-- el código nuevo escribe en AMBAS columnas y lee de la vieja

-- Paso 2 (deploy B): el código lee de la nueva y sigue escribiendo en ambas

-- Paso 3 (deploy C): ya nadie usa la vieja
alter table clientes drop column nombre;</code></pre>
<p>Son tres despliegues en vez de uno, y es lo que permite revertir en cualquier punto sin perder datos.</p>

<h4>Pooler: qué cambia</h4>
<table>
<tr><th>Sin pooler</th><th>Con pooler</th></tr>
<tr><td>50 pods × 10 conexiones = 500</td><td>500 conexiones de app → 20 reales</td></tr>
<tr><td>Postgres rechaza a partir de ~100</td><td>Postgres ve 20 y está cómodo</td></tr>
<tr><td>Escalar empeora el servicio</td><td>Escalar funciona</td></tr>
</table>
<p><b>Detalle importante:</b> el modo <i>transaction pooling</i> —el más eficiente— no soporta sentencias
preparadas ni <code>LISTEN/NOTIFY</code>. Si tu ORM las usa, hay que configurarlo o usar modo <i>session</i>,
que es menos eficiente. Es una sorpresa habitual al conectar Prisma o Drizzle a un pooler.</p>

<h4>PodDisruptionBudget: cinco líneas que evitan una caída</h4>
<pre><code>apiVersion: policy/v1
kind: PodDisruptionBudget
metadata: { name: mi-app }
spec:
  minAvailable: 2
  selector: { matchLabels: { app: mi-app } }</code></pre>
<p>Sin esto, actualizar los nodos del clúster —una operación rutinaria— puede vaciar todos tus pods a la vez.</p>
`,

      errores: [
        { mito: 'Sin readinessProbe el despliegue igual funciona.',
          realidad: 'Kubernetes da el pod por listo apenas arranca el proceso y le manda tráfico <b>antes de que pueda responder</b>. ' +
                    'Aparecen errores en cada despliegue que van y vienen solos. Y peor: el rolling update pierde su red de seguridad y ' +
                    '<b>no puede detectar que la versión nueva está rota</b>.' },

        { mito: 'Escalar la aplicación resuelve los problemas de carga.',
          realidad: 'Hasta que <b>lo que está detrás no escala</b>. Cada pod abre su propio pool de conexiones, y llegado cierto punto ' +
                    '<b>escalar empeora el servicio</b> porque la base rechaza conexiones. Hace falta un pooler antes de escalar en serio.' },

        { mito: 'Una migración de base de datos se aplica y listo.',
          realidad: 'Durante el despliegue <b>conviven dos versiones del código</b> contra la misma base. Borrar o renombrar una columna rompe la ' +
                    'versión vieja mientras todavía atiende tráfico. El patrón correcto es <i>expand and contract</i>, en tres despliegues.' },

        { mito: 'Con kubectl apply ya está desplegado.',
          realidad: '<code>apply</code> solo registra la intención. Hay que <b>esperar el <code>rollout status</code> con timeout</b>, ' +
                    'o tu CI marca como exitoso un despliegue cuyos pods nunca arrancaron.' },
      ],

      glosario: [
        { t: 'Rolling update', d: 'Reemplazo gradual de pods, esperando readiness de cada uno antes de retirar el anterior.' },
        { t: 'maxSurge / maxUnavailable', d: 'Cuántos pods extra se permiten y cuántos pueden faltar durante un despliegue.' },
        { t: 'readinessProbe', d: 'Chequeo que decide si un pod recibe tráfico. Sin él, el despliegue pierde su red de seguridad.' },
        { t: 'Blue-green', d: 'Levantar el entorno nuevo completo y cambiar el tráfico de golpe. Vuelta atrás instantánea.' },
        { t: 'Canario', d: 'Enviar un porcentaje pequeño del tráfico a la versión nueva y medir antes de promover.' },
        { t: 'HPA', d: 'HorizontalPodAutoscaler. Ajusta réplicas según CPU o métricas propias.' },
        { t: 'Cluster autoscaler', d: 'Agrega o quita nodos cuando los pods no entran. Tarda minutos.' },
        { t: 'Pooler', d: 'Intermediario que multiplexa muchas conexiones de aplicación sobre pocas reales a la base.' },
        { t: 'Expand and contract', d: 'Patrón de migración compatible hacia atrás: agregar, migrar el código, y borrar después.' },
        { t: 'PodDisruptionBudget', d: 'Mínimo de pods que deben seguir disponibles durante mantenimiento del clúster.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Cuándo NO necesitás Kubernetes',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> esta es la lección más útil del módulo. Kubernetes
es una herramienta excelente para un problema que <b>la mayoría de los proyectos no tiene</b>.</div>

<h4>Las preguntas que ordenan la decisión</h4>

<p><b>1 · ¿Necesitás que las cargas se muevan solas entre máquinas?</b><br>
Si una sola máquina alcanza y tolerás unos minutos de caída al año, <b>no</b>. Y esa es la respuesta honesta
para muchísimos proyectos.</p>

<p><b>2 · ¿Cuántos servicios distintos tenés?</b><br>
Con menos de cinco, la complejidad de Kubernetes supera lo que resuelve.</p>

<p><b>3 · ¿Hay alguien que sepa operarlo?</b><br>
Si no, ese trabajo va a consumir a alguien del equipo durante meses. <b>Adoptar Kubernetes sin nadie que lo
entienda es la receta más confiable para un mal semestre.</b></p>

<p><b>4 · ¿Probaste contenedores gestionados?</b><br>
Cloud Run y ECS Fargate dan escalado, salud, despliegues progresivos y escalar a cero <b>sin administrar un
clúster</b>. Casi nadie los evalúa antes de saltar.</p>

<h4>El costo real, que no es el clúster</h4>
<p>Un clúster gestionado cuesta unos cientos de dólares al mes. Lo caro es todo lo demás:</p>
<ul>
<li>Actualizaciones de versión, que rompen APIs cada tanto.</li>
<li>Depurar pods que no arrancan por razones no evidentes.</li>
<li>Políticas de red, RBAC, certificados, ingress.</li>
<li>Ajustar requests y limits para que las cosas entren y no se maten.</li>
<li>Que <b>toda incorporación al equipo</b> tenga que aprenderlo.</li>
</ul>

<div class="aviso"><strong>La frase que conviene tener lista para una entrevista:</strong> <i>"Kubernetes
resuelve el problema de programar cargas entre muchas máquinas. Si no tengo ese problema, estoy pagando la
complejidad sin recibir el beneficio."</i><br><br>
Decir eso con argumentos posiciona muchísimo mejor que decir que lo usás.</div>
`,

      tecnico: `
<h4>Mapa de decisión</h4>
<table>
<tr><th>Tu situación</th><th>Lo que conviene</th></tr>
<tr><td>Un sitio o app, un equipo, tráfico moderado</td><td><b>PaaS</b> (Vercel, Railway, Render) o VPS con Compose</td></tr>
<tr><td>Varios servicios, querés escalado sin operar nada</td><td><b>Cloud Run / ECS Fargate</b></td></tr>
<tr><td>Trabajos por lotes y crons</td><td>Cloud Run Jobs, o un worker con Inngest</td></tr>
<tr><td>10+ servicios, varios equipos, requisitos de red específicos</td><td><b>Kubernetes gestionado</b></td></tr>
<tr><td>Requisitos regulatorios de infraestructura propia</td><td>Kubernetes, con gente dedicada</td></tr>
<tr><td>Quiero aprender Kubernetes</td><td>Un clúster local (kind, k3d). <b>No tu producción</b></td></tr>
</table>

<div class="dato"><strong>Cloud Run merece un párrafo aparte porque cambia la ecuación.</strong> Te da:
escalado automático <b>incluyendo escalar a cero</b> —no pagás si no hay tráfico—, despliegues progresivos con
división de tráfico por porcentaje, healthchecks, HTTPS y dominio, y todo desde una imagen de contenedor
estándar. Lo que no te da es control fino de red ni cargas con estado. <b>Para la enorme mayoría de las
aplicaciones web, eso alcanza y sobra.</b></div>

<h4>Lo que sí conviene llevarse de Kubernetes</h4>
<p>Aunque no lo uses, sus ideas son buenas y se aplican en cualquier lado:</p>
<ul>
<li><b>Declarativo sobre imperativo.</b> Que el estado deseado esté versionado en el repositorio, no en la cabeza de alguien.</li>
<li><b>Salud explícita.</b> Separar <i>vivo</i> de <i>listo</i>.</li>
<li><b>Límites de recursos.</b> Que un servicio no pueda llevarse la máquina.</li>
<li><b>Configuración separada de la imagen.</b> La misma imagen en todos los entornos.</li>
<li><b>Despliegue progresivo con vuelta atrás.</b> Reemplazar de a poco, verificando.</li>
</ul>
<p>Todo eso se consigue con Compose y un proxy. <b>Las prácticas valen más que la herramienta.</b></p>

<h4>Señales de que lo adoptaste antes de tiempo</h4>
<ul>
<li>Pasás más tiempo peleando con el clúster que construyendo producto.</li>
<li>Nadie más que una persona sabe desplegar.</li>
<li>Tenés más YAML que código de aplicación.</li>
<li>Los despliegues fallan por razones de infraestructura, no de la aplicación.</li>
<li>Instalaste un operador para algo que resolvía un cron.</li>
</ul>
<p>Dos o más de esas, y conviene evaluar si un servicio gestionado no resolvería lo mismo con una fracción
del esfuerzo.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="nk1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <rect x="150" y="16" width="380" height="44" rx="10" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.6"/>
  <text x="340" y="34" text-anchor="middle" fill="#7c5cff" font-size="12" font-weight="700">¿Necesitás que las cargas se muevan</text>
  <text x="340" y="51" text-anchor="middle" fill="#7c5cff" font-size="12" font-weight="700">solas entre varias máquinas?</text>

  <line x1="260" y1="60" x2="180" y2="90" stroke="currentColor" stroke-width="1.4" marker-end="url(#nk1)"/>
  <line x1="420" y1="60" x2="500" y2="90" stroke="currentColor" stroke-width="1.4" marker-end="url(#nk1)"/>
  <text x="196" y="82" fill="#34d399" font-size="11.5" font-weight="700">NO</text>
  <text x="474" y="82" fill="#fbbf24" font-size="11.5" font-weight="700">SÍ</text>

  <rect x="24" y="96" width="290" height="98" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="169" y="118" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">VPS con Compose  ·  PaaS</text>
  <text x="44" y="140" fill="currentColor" opacity=".7" font-size="10.5">· reinicio, HTTPS, límites, respaldos</text>
  <text x="44" y="158" fill="currentColor" opacity=".7" font-size="10.5">· despliegue sin cortes con un proxy</text>
  <text x="44" y="176" fill="#34d399" font-size="10.5" font-weight="700">· muchísimos proyectos viven acá</text>

  <rect x="366" y="96" width="290" height="98" rx="10" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="511" y="118" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">¿Querés administrar un clúster?</text>
  <text x="386" y="142" fill="#34d399" font-size="10.5" font-weight="700">NO → Cloud Run / ECS Fargate</text>
  <text x="386" y="158" fill="currentColor" opacity=".6" font-size="10">escalado, salud, deploys, escala a cero</text>
  <text x="386" y="178" fill="#fbbf24" font-size="10.5" font-weight="700">SÍ → Kubernetes gestionado</text>

  <line x1="24" y1="214" x2="656" y2="214" stroke="currentColor" opacity=".18"/>

  <text x="24" y="238" fill="#f87171" font-size="12" font-weight="700">
    EL COSTO REAL NO ES EL CLÚSTER</text>

  <rect x="24" y="250" width="200" height="60" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="124" y="274" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">clúster gestionado</text>
  <text x="124" y="294" text-anchor="middle" fill="currentColor" opacity=".65" font-size="10.5">unos cientos de USD/mes</text>

  <text x="238" y="284" fill="currentColor" opacity=".4" font-size="16">vs</text>

  <rect x="266" y="250" width="390" height="60" rx="9" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.5"/>
  <text x="461" y="272" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="700">el tiempo de alguien del equipo</text>
  <text x="461" y="290" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">actualizaciones · RBAC · red · certificados · pods que no arrancan</text>
  <text x="461" y="304" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">y que toda incorporación tenga que aprenderlo</text>

  <rect x="24" y="326" width="632" height="60" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.4" stroke-dasharray="5 4"/>
  <text x="340" y="348" text-anchor="middle" fill="#7c5cff" font-size="12" font-weight="700">
    “Kubernetes resuelve programar cargas entre muchas máquinas.</text>
  <text x="340" y="366" text-anchor="middle" fill="#7c5cff" font-size="12" font-weight="700">
    Si no tengo ese problema, pago la complejidad sin recibir el beneficio.”</text>
  <text x="340" y="382" text-anchor="middle" fill="currentColor" opacity=".6" font-size="10.5">
    Decir esto con argumentos posiciona mucho mejor en una entrevista que decir que lo usás.</text>
</svg>`,
        pie: 'La lección más útil del módulo: reconocer cuándo la herramienta correcta es la más simple.',
      },

      entrevista: [
        { p: '¿Cuándo NO usarías Kubernetes?',
          r: 'Siempre que no necesite <b>programar cargas entre varias máquinas</b>. Si una sola alcanza y tolero unos minutos de caída al año, ' +
             'un VPS con Compose y un proxy resuelve reinicio ante fallo, HTTPS, límites de recursos y despliegue sin cortes. ' +
             'Si necesito escalado pero no quiero administrar un clúster, <b>Cloud Run o ECS Fargate</b> dan casi todo el valor sin esa carga. ' +
             'Y hay un criterio que no es técnico pero decide igual: <b>si nadie en el equipo sabe operarlo</b>, ese trabajo va a consumir a alguien ' +
             'durante meses. La frase que resume: si no tengo el problema que resuelve, pago la complejidad sin recibir el beneficio.' },

        { p: '¿Cuál es el costo real de adoptar Kubernetes?',
          r: 'No es el clúster —un gestionado cuesta unos cientos de dólares al mes—: es <b>el tiempo de alguien</b>. Actualizaciones de versión ' +
             'que rompen APIs, políticas de red, RBAC, certificados, ingress, ajustar requests y limits, y depurar pods que no arrancan por razones ' +
             'no evidentes. Y hay un costo recurrente que se subestima: <b>toda incorporación al equipo tiene que aprenderlo</b> antes de poder ' +
             'desplegar. En un equipo chico, la persona que se lo pone al hombro deja de construir producto.' },

        { p: 'Si no usás Kubernetes, ¿qué prácticas suyas te llevarías igual?',
          r: 'Varias, y valen más que la herramienta. <b>Declarativo sobre imperativo</b>: que el estado deseado esté versionado en el repositorio ' +
             'y no en la cabeza de alguien. <b>Salud explícita</b>, separando <i>vivo</i> de <i>listo</i>. <b>Límites de recursos</b>, para que un ' +
             'servicio no pueda llevarse la máquina. <b>Configuración separada de la imagen</b>, para usar la misma en todos los entornos. ' +
             'Y <b>despliegue progresivo con vuelta atrás</b>. Todo eso se consigue con Compose y un proxy inverso.' },

        { p: '¿Cómo sabés si adoptaste Kubernetes antes de tiempo?',
          r: 'Por señales bastante concretas: pasás más tiempo peleando con el clúster que construyendo producto; solo una persona sabe desplegar; ' +
             'tenés más YAML que código de aplicación; los despliegues fallan por razones de infraestructura y no de la aplicación; ' +
             'o instalaste un operador para algo que resolvía un cron. Con dos o más de esas, evaluaría si un servicio gestionado no resuelve lo ' +
             'mismo con una fracción del esfuerzo. <b>Migrar hacia algo más simple es una decisión perfectamente respetable.</b>' },
      ],

      practica: `
<h4>Comparación honesta para una aplicación web típica</h4>
<table>
<tr><th></th><th>VPS + Compose</th><th>Cloud Run</th><th>Kubernetes</th></tr>
<tr><td>Puesta en marcha</td><td>Horas</td><td>Minutos</td><td>Días o semanas</td></tr>
<tr><td>Escala a cero</td><td>No</td><td><b>Sí</b></td><td>No sin extras</td></tr>
<tr><td>Escalado automático</td><td>No</td><td>Sí</td><td>Sí</td></tr>
<tr><td>Sobrevive a la caída de una máquina</td><td><b>No</b></td><td>Sí</td><td>Sí</td></tr>
<tr><td>Costo con tráfico bajo</td><td>~10 USD/mes</td><td>Casi cero</td><td>Cientos + tiempo</td></tr>
<tr><td>Conocimiento necesario</td><td>Bajo</td><td>Bajo</td><td><b>Alto</b></td></tr>
<tr><td>Control fino</td><td>Medio</td><td>Bajo</td><td><b>Total</b></td></tr>
</table>

<div class="aviso"><strong>La fila que suele decidir es la cuarta.</strong> "¿Qué pasa si esta máquina se
cae?" Si la respuesta honesta es "perdemos unos minutos y no es grave", entonces el VPS alcanza y todo lo
demás es complejidad que estás comprando sin necesitarla.</div>

<h4>Aprender Kubernetes sin sufrirlo</h4>
<pre><code># clúster local en un contenedor, en segundos
brew install kind          # o k3d
kind create cluster --name practica

kubectl get nodes
kubectl create deployment web --image=nginx --replicas=3
kubectl expose deployment web --port=80
kubectl port-forward svc/web 8080:80

# borrar todo sin dejar rastro
kind delete cluster --name practica</code></pre>
<p>Con eso podés practicar manifiestos, probes, rollouts y depuración <b>sin poner tu producción de por
medio</b>. Es la forma correcta de aprenderlo.</p>

<h4>Si tu equipo lo usa y vos entrás</h4>
<p>Lo mínimo para ser productivo desde el primer día:</p>
<table>
<tr><th>Saber</th><th>Por qué</th></tr>
<tr><td><code>kubectl get / describe / logs</code></td><td>El 80% de la depuración diaria</td></tr>
<tr><td>Leer un Deployment y un Service</td><td>Entender qué está desplegado</td></tr>
<tr><td>requests vs limits</td><td>La causa de la mitad de los problemas</td></tr>
<tr><td>liveness vs readiness</td><td>La causa de la otra mitad</td></tr>
<tr><td><code>rollout status</code> y <code>undo</code></td><td>Desplegar y revertir</td></tr>
<tr><td>Etiquetas y selectores</td><td>Por qué un Service no apunta a nada</td></tr>
</table>
<p>Eso alcanza. El resto se aprende cuando aparece.</p>
`,

      errores: [
        { mito: 'Kubernetes es el estándar, así que hay que usarlo.',
          realidad: 'Es el estándar <b>para orquestar contenedores a escala</b>. Si no tenés ese problema, estás pagando complejidad sin recibir ' +
                    'el beneficio. Muchísimos productos rentables corren en un VPS con Compose o en contenedores gestionados.' },

        { mito: 'Con un clúster gestionado ya no hay complejidad.',
          realidad: 'Te quita el plano de control, que es una parte. Quedan actualizaciones, RBAC, red, ingress, certificados, requests y limits, ' +
                    'y depurar pods que no arrancan. <b>El costo real es el tiempo de alguien</b>, no la factura del clúster.' },

        { mito: 'Necesito Kubernetes para escalar automáticamente.',
          realidad: '<b>Cloud Run y ECS Fargate</b> escalan automáticamente, incluso a cero, con despliegues progresivos y healthchecks, ' +
                    'sin administrar un clúster. Casi nadie los evalúa antes de saltar, y para la mayoría de las aplicaciones web alcanzan y sobran.' },

        { mito: 'Si ya lo adopté, migrar hacia algo más simple es un retroceso.',
          realidad: 'Es una decisión perfectamente respetable, y varios equipos la tomaron. Si pasás más tiempo con el clúster que con el producto, ' +
                    '<b>simplificar es avanzar</b>. Lo que sí conviene conservar son las prácticas: declarativo, salud explícita, límites y ' +
                    'despliegue progresivo.' },
      ],

      glosario: [
        { t: 'Cloud Run', d: 'Contenedores gestionados de Google: escalan automáticamente, incluso a cero.' },
        { t: 'ECS Fargate', d: 'Contenedores gestionados de AWS, sin administrar servidores.' },
        { t: 'kind / k3d', d: 'Clústeres de Kubernetes locales dentro de contenedores. Para aprender y probar.' },
        { t: 'RBAC', d: 'Control de acceso basado en roles dentro del clúster.' },
        { t: 'Operador', d: 'Controlador propio que gestiona una aplicación compleja dentro del clúster.' },
        { t: 'CRD', d: 'Custom Resource Definition. Tipo de objeto propio que extiende la API de Kubernetes.' },
        { t: 'Escala a cero', d: 'Reducir a cero instancias sin tráfico, y por lo tanto sin costo.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Cuál es el cambio de modelo mental que introduce un orquestador?',
      opciones: [
        'De imperativo a declarativo: decís qué querés, no cómo lograrlo',
        'De contenedores a máquinas virtuales',
        'De monolito a microservicios',
        'De HTTP a gRPC',
      ],
      correcta: 0,
      porQue: 'Declarás un estado deseado —"5 réplicas corriendo siempre"— y un bucle de reconciliación compara con el estado real y corrige la diferencia continuamente.',
      porQueNo: {
        1: 'Los orquestadores gestionan contenedores, no reemplazan uno por otro.',
        2: 'Es una decisión de arquitectura independiente del orquestador.',
        3: 'El protocolo de comunicación no tiene relación.',
      },
    },
    {
      p: '¿Qué es el bucle de reconciliación?',
      opciones: [
        'Comparar continuamente el estado real con el deseado y actuar para acercarlos',
        'El proceso de arranque del clúster',
        'La sincronización entre nodos maestros',
        'El reintento de peticiones fallidas',
      ],
      correcta: 0,
      porQue: 'Es el mecanismo central de Kubernetes. Lo hace potente y también difícil de depurar: la pregunta pasa de "¿qué pasó?" a "¿por qué el sistema cree que esto está bien?".',
      porQueNo: {
        1: 'Ocurre continuamente, no solo al arrancar.',
        2: 'Eso es replicación de estado, otra cosa.',
        3: 'Los reintentos son de la capa de aplicación.',
      },
    },
    {
      p: '¿Por qué no te conectás directamente a un pod?',
      opciones: [
        'Los pods son descartables: se crean y destruyen y cambian de IP. Para eso está el Service',
        'Porque los pods no aceptan conexiones',
        'Por razones de seguridad del clúster',
        'Porque solo el Ingress puede llegar a ellos',
      ],
      correcta: 0,
      porQue: 'El Service da un nombre y una IP estables, y reparte el tráfico entre los pods que están sanos.',
      porQueNo: {
        1: 'Aceptan conexiones perfectamente; el problema es que su dirección no es estable.',
        2: 'No es una restricción de seguridad sino de estabilidad.',
        3: 'Otros pods pueden llegar directamente; simplemente no conviene.',
      },
    },
    {
      p: '¿Cuál es la diferencia entre requests y limits?',
      opciones: [
        'Requests decide en qué nodo entra el pod; limits es el tope duro en ejecución',
        'Son sinónimos con nombres distintos',
        'Requests es para CPU y limits para memoria',
        'Requests es opcional y limits obligatorio',
      ],
      correcta: 0,
      porQue: 'Y hay una asimetría importante: superar el límite de CPU ralentiza (throttling), superar el de memoria mata el contenedor.',
      porQueNo: {
        1: 'Cumplen funciones completamente distintas.',
        2: 'Ambos aplican a los dos recursos.',
        3: 'Los dos son opcionales, aunque conviene definirlos.',
      },
    },
    {
      p: 'Tu Service no responde pero los pods están Running. ¿Qué revisás primero?',
      opciones: [
        'Los endpoints: si están vacíos, el selector no coincide con las etiquetas de los pods',
        'Los logs de la aplicación',
        'La configuración del Ingress',
        'El límite de memoria',
      ],
      correcta: 0,
      porQue: 'Kubernetes conecta objetos por etiquetas, y cuando el selector no coincide el Service no apunta a nada sin dar ningún error. Es la causa número uno de este síntoma.',
      porQueNo: {
        1: 'Si los pods corren, los logs pueden estar limpios y aun así el Service no llegar a ellos.',
        2: 'Puede ser, pero el problema más frecuente está un nivel más abajo.',
        3: 'Con OOM los pods no estarían en Running.',
      },
    },
    {
      p: '¿Por qué se usa un Ingress en vez de un LoadBalancer por servicio?',
      opciones: [
        'Cada LoadBalancer pide un balanceador al proveedor y cuesta dinero',
        'Los LoadBalancer no soportan HTTPS',
        'El Ingress es más rápido',
        'Los Service ClusterIP no funcionan dentro del clúster',
      ],
      correcta: 0,
      porQue: 'Con diez servicios serían diez balanceadores. Un Ingress usa uno solo y enruta por dominio y path hacia muchos ClusterIP, además de centralizar los certificados.',
      porQueNo: {
        1: 'Pueden soportarlo, aunque la gestión de certificados es menos práctica.',
        2: 'La diferencia es de costo y gestión, no de rendimiento.',
        3: 'ClusterIP es justamente el tipo pensado para tráfico interno.',
      },
    },
    {
      p: '¿Un Secret de Kubernetes está cifrado?',
      opciones: [
        'No: está en base64, que es codificación. Cualquiera con permiso lo decodifica',
        'Sí, con AES por defecto',
        'Sí, si el clúster es gestionado',
        'Sí, siempre que uses un Namespace privado',
      ],
      correcta: 0,
      porQue: 'Para secretos reales hace falta cifrado en reposo configurado en el clúster o un gestor externo. Y nunca subir manifiestos con Secrets al repositorio: para eso existe Sealed Secrets.',
      porQueNo: {
        1: 'El cifrado en reposo hay que habilitarlo explícitamente.',
        2: 'Depende de la configuración, no de que sea gestionado.',
        3: 'Los namespaces separan lógicamente, no cifran.',
      },
    },
    {
      p: '¿Por qué el readinessProbe no es opcional?',
      opciones: [
        'Sin él, Kubernetes manda tráfico a pods que todavía están inicializando y el rollout pierde su red de seguridad',
        'Porque el pod no arranca sin él',
        'Porque lo exige el Service',
        'Porque sin él no se pueden ver los logs',
      ],
      correcta: 0,
      porQue: 'Aparecen errores en cada despliegue que van y vienen solos. Y peor: el rolling update no puede detectar que la versión nueva está rota, así que un deploy malo reemplaza todo.',
      porQueNo: {
        1: 'El pod arranca igual; el problema es cuándo se lo considera listo.',
        2: 'El Service funciona sin él, mandando tráfico antes de tiempo.',
        3: 'Los logs son independientes de las probes.',
      },
    },
    {
      p: 'Escalás tu aplicación a 50 pods y todo empieza a andar peor. ¿Causa más probable?',
      opciones: [
        'Las conexiones a la base: 50 pods × 10 conexiones superan el límite de Postgres',
        'La CPU del clúster está saturada',
        'El Ingress no soporta tantas rutas',
        'Los pods compiten por la red',
      ],
      correcta: 0,
      porQue: 'El síntoma característico es que cuanto más escalás, peor funciona todo. Se resuelve con un pooler que multiplexa muchas conexiones de aplicación sobre pocas reales.',
      porQueNo: {
        1: 'Posible, pero no explica que empeore al escalar: más pods significa más capacidad de cómputo.',
        2: 'La cantidad de rutas no cambia al escalar réplicas.',
        3: 'Rara vez es el cuello de botella frente a las conexiones de base.',
      },
    },
    {
      p: '¿Qué cuidado exige una migración de base de datos durante un despliegue progresivo?',
      opciones: [
        'Ser compatible hacia atrás: conviven dos versiones del código contra la misma base',
        'Aplicarla después de que todos los pods estén actualizados',
        'Detener el tráfico mientras se aplica',
        'Ninguno: Kubernetes lo maneja',
      ],
      correcta: 0,
      porQue: 'Borrar o renombrar una columna rompe la versión vieja mientras todavía atiende tráfico. El patrón es expand and contract, en tres despliegues, y aplica igual sin Kubernetes.',
      porQueNo: {
        1: 'Si el código nuevo la necesita, no puede esperar a que todos estén actualizados.',
        2: 'Es un corte de servicio, justamente lo que el despliegue progresivo evita.',
        3: 'Kubernetes no sabe nada de tu esquema de base de datos.',
      },
    },
    {
      p: '¿Qué garantiza maxUnavailable: 0 durante un rolling update?',
      opciones: [
        'Que nunca haya menos capacidad de la declarada, a costa de un pod extra durante el cambio',
        'Que el despliegue sea más rápido',
        'Que no se puedan revertir los cambios',
        'Que solo se actualice un pod por vez',
      ],
      correcta: 0,
      porQue: 'Con maxUnavailable: 1 el despliegue es más liviano en recursos pero durante unos segundos tenés una réplica menos, lo que en horario pico puede significar latencia o errores.',
      porQueNo: {
        1: 'Al contrario: esperar a cada pod nuevo antes de retirar uno viejo lo hace más lento.',
        2: 'La reversión funciona igual, con rollout undo.',
        3: 'Eso lo controla maxSurge, y son parámetros independientes.',
      },
    },
    {
      p: '¿Cuál es el mejor comando para saber por qué un pod no arranca?',
      opciones: [
        'kubectl describe pod, mirando la sección Events del final',
        'kubectl logs',
        'kubectl get pods',
        'kubectl top pod',
      ],
      correcta: 0,
      porQue: 'Los Events explican en texto claro qué pasó: que no hay nodo con recursos, que no pudo descargar la imagen, que el readinessProbe falla. La mayoría mira los logs primero, pero si el pod no arrancó puede no haber logs.',
      porQueNo: {
        1: 'Si el pod nunca llegó a ejecutar, no hay logs que mirar.',
        2: 'Da el estado pero no la causa.',
        3: 'Muestra consumo de recursos, no eventos.',
      },
    },
    {
      p: '¿Cuándo NO conviene Kubernetes?',
      opciones: [
        'Cuando no necesitás programar cargas entre varias máquinas',
        'Cuando tenés más de tres servicios',
        'Cuando usás contenedores',
        'Cuando el tráfico es variable',
      ],
      correcta: 0,
      porQue: 'Si una máquina alcanza y tolerás unos minutos de caída al año, un VPS con Compose y un proxy resuelve reinicio, HTTPS, límites y despliegue sin cortes. Sin ese problema, pagás la complejidad sin el beneficio.',
      porQueNo: {
        1: 'Con pocos servicios la complejidad supera lo que resuelve, no al revés.',
        2: 'Los contenedores se pueden orquestar de muchas formas más simples.',
        3: 'Cloud Run maneja tráfico variable, incluso escalando a cero.',
      },
    },
    {
      p: '¿Qué alternativa da escalado, salud y despliegues progresivos SIN administrar un clúster?',
      opciones: [
        'Contenedores gestionados: Cloud Run o ECS Fargate',
        'Docker Compose',
        'Un VPS más grande',
        'Kubernetes gestionado',
      ],
      correcta: 0,
      porQue: 'Cloud Run además escala a cero, así que no pagás sin tráfico. Para la enorme mayoría de las aplicaciones web alcanza y sobra, y casi nadie lo evalúa antes de saltar a Kubernetes.',
      porQueNo: {
        1: 'No escala automáticamente ni sobrevive a la caída de la máquina.',
        2: 'Escalar verticalmente no da ni salud ni despliegues progresivos.',
        3: 'Sigue exigiendo administrar el clúster, que es justamente el costo que se quiere evitar.',
      },
    },
    {
      p: 'Si no usás Kubernetes, ¿qué prácticas suyas conviene llevarse igual?',
      opciones: [
        'Declarativo versionado, salud explícita, límites de recursos y despliegue progresivo',
        'El formato YAML de los manifiestos',
        'La separación en namespaces',
        'El uso de operadores',
      ],
      correcta: 0,
      porQue: 'Todo eso se consigue con Compose y un proxy inverso. Las prácticas valen más que la herramienta.',
      porQueNo: {
        1: 'El formato es un detalle, no una práctica.',
        2: 'Es un mecanismo específico del clúster, poco transferible.',
        3: 'Los operadores solo tienen sentido dentro de Kubernetes.',
      },
    },
  ],
});
