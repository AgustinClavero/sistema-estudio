/* ==========================================================================
   Infra · Módulo 10 — Seguridad de infraestructura
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'infra',
  id: 'm10',
  titulo: 'Seguridad de infraestructura',
  fuentes: ['docker-buenas-practicas', 'k8s-produccion', 'postgres', 'supabase-docs', 'owasp-llm', 'nginx'],

  intro:
    '<p>La seguridad de infraestructura no va sobre firewalls exóticos. Va sobre cuatro preguntas aburridas: ' +
    '<b>quién puede hacer qué</b>, <b>qué es alcanzable desde dónde</b>, <b>si tus respaldos realmente ' +
    'restauran</b>, y <b>qué estás ejecutando sin haberlo escrito vos</b>.</p>' +
    '<p>Casi todos los incidentes graves salen de responder mal una de esas cuatro. Los ataques sofisticados ' +
    'existen, pero <b>no son lo que te va a pasar</b>.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Mínimo privilegio, en serio',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> cada cosa debería poder hacer <b>exactamente lo
que necesita</b> y nada más. Suena obvio, y prácticamente nadie lo cumple — porque restringir cuesta trabajo y
dar permisos amplios "funciona".</div>

<h4>Por qué se degrada solo</h4>
<p>La secuencia es siempre la misma:</p>
<ol>
<li>Algo no funciona por un permiso.</li>
<li>Se amplía el permiso "temporalmente" para desbloquear.</li>
<li>Funciona.</li>
<li>Nadie vuelve a achicarlo.</li>
</ol>
<p>Multiplicado por dos años, todo tiene permiso para todo. <b>El problema no es la ignorancia: es que ampliar
es urgente y achicar no lo es nunca.</b></p>

<h4>Lo que cambia en la práctica</h4>
<p>El mínimo privilegio no evita que te comprometan. Lo que hace es <b>acotar el daño</b>. Si una clave se
filtra:</p>
<ul>
<li>Con permisos amplios → acceso a todo: base, archivos, otros servicios.</li>
<li>Con permisos mínimos → acceso a un bucket, solo lectura, solo desde una red.</li>
</ul>
<p>Es la diferencia entre un incidente y una catástrofe, con el mismo error de origen.</p>

<div class="aviso"><strong>El caso concreto que más aparece en este workspace:</strong> la clave de
<code>service_role</code> de Supabase <b>saltea RLS por completo</b>. Es el equivalente a administrador de la
base. Con ella, todo el aislamiento entre tenants que construiste con políticas <b>deja de existir</b>.
Por eso solo va en el servidor, en acciones protegidas, y nunca en middleware ni en el cliente.</div>

<h4>Cuentas de personas y de máquinas</h4>
<p>Son distintas y conviene tratarlas distinto:</p>
<ul>
<li><b>Personas</b> — acceso nominal, con segundo factor, revisable y revocable. Nunca cuentas compartidas: si tres personas usan el mismo usuario, no hay auditoría posible.</li>
<li><b>Máquinas</b> — una identidad <b>por servicio</b>, con permisos acotados a lo suyo. Si todos los servicios usan la misma credencial, comprometer el más chico da acceso a lo de todos.</li>
</ul>
`,

      tecnico: `
<h4>Roles de base de datos, en capas</h4>
<pre><code>-- La aplicación NO usa el superusuario. Nunca.
create role app_lectura;
grant connect on database miapp to app_lectura;
grant usage on schema public to app_lectura;
grant select on all tables in schema public to app_lectura;

create role app_escritura;
grant app_lectura to app_escritura;
grant insert, update, delete on all tables in schema public to app_escritura;

-- El de migraciones es el único que puede cambiar el esquema,
-- y lo usa el pipeline, no la aplicación.
create role app_migraciones;
grant create on schema public to app_migraciones;</code></pre>

<div class="dato"><strong>Separar el rol de migraciones del de la aplicación tiene un efecto muy concreto:</strong>
una inyección SQL exitosa contra la aplicación <b>no puede hacer <code>DROP TABLE</code></b>, porque ese rol no
tiene el permiso. Es una segunda línea de defensa que cuesta cinco minutos y que sigue en pie cuando la primera
—la validación— falla.</div>

<h4>El principio aplicado a cada capa</h4>
<table>
<tr><th>Capa</th><th>Mínimo privilegio significa</th></tr>
<tr><td>Base de datos</td><td>Rol sin permisos de esquema; RLS activo en todas las tablas</td></tr>
<tr><td>Storage</td><td>Políticas por tenant; buckets privados por defecto</td></tr>
<tr><td>Contenedor</td><td>Usuario no root; sistema de archivos de solo lectura; sin capacidades extra</td></tr>
<tr><td>Nube</td><td>Un rol por servicio, con acciones y recursos explícitos</td></tr>
<tr><td>CI/CD</td><td>Credenciales con alcance por entorno; producción requiere aprobación</td></tr>
<tr><td>Personas</td><td>Acceso nominal, con segundo factor y revisión periódica</td></tr>
</table>

<h4>Contenedor sin privilegios</h4>
<pre><code># Dockerfile
RUN addgroup -S app &amp;&amp; adduser -S app -G app
USER app                     # ← si no lo ponés, corre como root

# docker-compose / manifiesto
read_only: true              # sistema de archivos inmutable
tmpfs: [/tmp]                # lo único escribible
cap_drop: [ALL]              # sin capacidades del kernel
security_opt: [no-new-privileges:true]</code></pre>

<div class="dato"><strong>Por defecto, un contenedor corre como root.</strong> Eso significa que una ejecución
remota de código dentro del contenedor arranca con el máximo privilegio ahí adentro — y desde ahí, escapar es
mucho más fácil. Agregar <code>USER</code> es una línea, no rompe casi nada, y sube significativamente el
listón. <b>Es la mejora de seguridad con mejor relación beneficio/esfuerzo de todo el módulo.</b></div>

<h4>Revisión periódica</h4>
<p>Como los permisos solo crecen, hace falta un momento donde se achiquen a propósito. Una vez por trimestre:</p>
<pre><code>· ¿Quién tiene acceso a producción? ¿Sigue haciendo falta?
· ¿Hay credenciales sin usar hace 90 días? → revocar
· ¿Hay roles con permisos más amplios de lo necesario?
· ¿Hay cuentas de gente que ya no está?
· ¿Hay claves de API sin rotar hace más de un año?</code></pre>
<p>Media hora por trimestre. Sin este momento, la única dirección posible es hacia más permisos.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="sc1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="22" fill="#f87171" font-size="12" font-weight="700">
    POR QUÉ SE DEGRADA SOLO — ampliar es urgente, achicar no lo es nunca</text>

  <rect x="24" y="34" width="146" height="44" rx="8" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="97" y="52" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">1 · algo no funciona</text>
  <text x="97" y="68" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">por un permiso</text>

  <text x="176" y="61" fill="currentColor" opacity=".4" font-size="13">→</text>

  <rect x="192" y="34" width="146" height="44" rx="8" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.2"/>
  <text x="265" y="52" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">2 · se amplía</text>
  <text x="265" y="68" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">“temporalmente”</text>

  <text x="344" y="61" fill="currentColor" opacity=".4" font-size="13">→</text>

  <rect x="360" y="34" width="146" height="44" rx="8" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.2"/>
  <text x="433" y="59" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">3 · funciona</text>

  <text x="512" y="61" fill="currentColor" opacity=".4" font-size="13">→</text>

  <rect x="528" y="34" width="128" height="44" rx="8" fill="#f87171" fill-opacity=".22" stroke="#f87171" stroke-width="1.6"/>
  <text x="592" y="52" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">4 · nadie lo achica</text>
  <text x="592" y="68" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">nunca</text>

  <line x1="24" y1="94" x2="656" y2="94" stroke="currentColor" opacity=".18"/>

  <text x="24" y="118" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    MISMA CLAVE FILTRADA, DOS DESENLACES</text>

  <rect x="24" y="130" width="304" height="94" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="176" y="152" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">PERMISOS AMPLIOS</text>
  <text x="44" y="174" fill="currentColor" opacity=".72" font-size="10.5">· toda la base, todos los tenants</text>
  <text x="44" y="192" fill="currentColor" opacity=".72" font-size="10.5">· todos los archivos</text>
  <text x="44" y="210" fill="#f87171" font-size="11" font-weight="700">→ catástrofe</text>

  <rect x="352" y="130" width="304" height="94" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="152" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">PERMISOS MÍNIMOS</text>
  <text x="372" y="174" fill="currentColor" opacity=".72" font-size="10.5">· un bucket</text>
  <text x="372" y="192" fill="currentColor" opacity=".72" font-size="10.5">· solo lectura, solo desde una red</text>
  <text x="372" y="210" fill="#34d399" font-size="11" font-weight="700">→ incidente acotado</text>

  <text x="24" y="248" fill="currentColor" opacity=".55" font-size="10.5">
    El mismo error de origen. Lo que cambia es cuánto daño puede hacer.</text>

  <rect x="24" y="264" width="632" height="52" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="44" y="286" fill="#f87171" font-size="12" font-weight="700">service_role de Supabase = administrador de la base. SALTEA RLS POR COMPLETO.</text>
  <text x="44" y="306" fill="currentColor" opacity=".72" font-size="11">
    Con esa clave, todo el aislamiento entre tenants que construiste con políticas deja de existir.</text>

  <rect x="24" y="328" width="632" height="58" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="44" y="350" fill="#34d399" font-size="12" font-weight="700">LA MEJORA CON MEJOR RELACIÓN BENEFICIO/ESFUERZO DEL MÓDULO</text>
  <text x="44" y="370" fill="currentColor" opacity=".75" font-size="11">
    Por defecto un contenedor corre como <tspan font-family="monospace">root</tspan>. Agregar <tspan font-family="monospace" fill="#34d399">USER app</tspan> es UNA línea, no rompe casi nada,</text>
  <text x="44" y="383" fill="currentColor" opacity=".75" font-size="11">
    y hace que una ejecución remota de código adentro no arranque con el máximo privilegio.</text>
</svg>`,
        pie: 'El mínimo privilegio no evita que te comprometan. Decide cuánto daño puede hacer quien lo logre.',
      },

      entrevista: [
        { p: '¿Qué es el mínimo privilegio y por qué se degrada solo?',
          r: 'Que cada cosa pueda hacer exactamente lo que necesita y nada más. Se degrada porque la secuencia es siempre igual: algo falla por un ' +
             'permiso, se amplía "temporalmente" para desbloquear, funciona, y <b>nadie vuelve a achicarlo</b>. ' +
             'El problema no es la ignorancia: es que <b>ampliar es urgente y achicar no lo es nunca</b>. Por eso hace falta una revisión periódica ' +
             'explícita, donde se achiquen permisos a propósito — sin ese momento, la única dirección posible es hacia más.' },

        { p: '¿Qué aporta el mínimo privilegio si igual te comprometen?',
          r: 'Acota el daño, que es lo que separa un incidente de una catástrofe con el mismo error de origen. Si una clave con permisos amplios se ' +
             'filtra, el atacante tiene toda la base, todos los tenants y todos los archivos. Si la clave está acotada a un bucket, solo lectura y ' +
             'desde una red, el alcance es mucho menor. <b>No decide si te comprometen: decide cuánto puede hacer quien lo logre.</b>' },

        { p: '¿Por qué separar el rol de migraciones del rol de la aplicación?',
          r: 'Porque una <b>inyección SQL exitosa contra la aplicación no puede hacer <code>DROP TABLE</code></b> si ese rol no tiene permisos de ' +
             'esquema. Es una segunda línea de defensa que sigue en pie cuando la primera —la validación de entrada— falla, y cuesta cinco minutos ' +
             'de configuración. El rol de migraciones lo usa el pipeline como paso propio, no la aplicación en tiempo de ejecución.' },

        { p: '¿Cuál es la mejora de seguridad más barata en un contenedor?',
          r: 'Agregar <code>USER</code> al Dockerfile. Por defecto un contenedor <b>corre como root</b>, así que una ejecución remota de código adentro ' +
             'arranca con el máximo privilegio y escapar del contenedor se vuelve mucho más fácil. Es una línea, no rompe casi nada y sube ' +
             'significativamente el listón. Después vienen el sistema de archivos de solo lectura, ' +
             '<code>cap_drop: ALL</code> y <code>no-new-privileges</code>, que son casi igual de baratos.' },
      ],

      practica: `
<h4>Verificar como qué usuario corre tu contenedor</h4>
<pre><code>docker run --rm mi-imagen whoami
# root  ⚠  hay que arreglarlo
# app   ✓</code></pre>

<h4>Dockerfile con usuario propio</h4>
<pre><code>FROM node:22-alpine
WORKDIR /app

COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev
COPY --chown=node:node . .

USER node                     # ← la línea que importa
EXPOSE 3000
CMD ["node", "server.js"]</code></pre>

<div class="aviso"><strong>El <code>--chown</code> es la parte que se olvida.</strong> Sin él, los archivos
quedan de root y la aplicación —que ahora corre como <code>node</code>— no puede leer algunos. El síntoma es un
error de permisos al arrancar, y la reacción típica es sacar el <code>USER</code> en vez de arreglar el
propietario.</div>

<h4>Roles de aplicación en Supabase / Postgres</h4>
<pre><code>-- ✅ Server Action: usa la sesión del usuario, RLS aplica
const supabase = createServerClient(url, ANON_KEY, { cookies });

-- ⚠️ Solo cuando hace falta saltear RLS a propósito, y en el servidor
const admin = createClient(url, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
-- Regla: cada uso de admin debería tener un comentario explicando
--        por qué NO alcanza con la sesión del usuario.</code></pre>

<h4>Revisión trimestral de accesos</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Quién tiene acceso a producción, y si sigue haciendo falta</td></tr>
<tr><td>☐</td><td>Credenciales sin uso en 90 días → revocar</td></tr>
<tr><td>☐</td><td>Cuentas de gente que ya no está</td></tr>
<tr><td>☐</td><td>Roles con permisos más amplios de lo necesario</td></tr>
<tr><td>☐</td><td>Claves de API sin rotar en más de un año</td></tr>
<tr><td>☐</td><td>Usos de <code>service_role</code>, uno por uno</td></tr>
<tr><td>☐</td><td>Contenedores que corren como root</td></tr>
</table>
`,

      errores: [
        { mito: 'Le doy permisos amplios y después los ajusto.',
          realidad: 'El "después" no llega nunca, porque ampliar es urgente y achicar no lo es. Empezá restrictivo y ampliá con evidencia: ' +
                    'es más trabajo al principio y es la única dirección que se sostiene.' },

        { mito: 'La aplicación necesita superusuario para funcionar.',
          realidad: 'Necesita leer y escribir datos, no cambiar el esquema. Separando el rol de migraciones, una <b>inyección SQL no puede hacer ' +
                    'DROP TABLE</b>. Son cinco minutos y es defensa que sigue en pie cuando la validación falla.' },

        { mito: 'Uso service_role porque es más simple.',
          realidad: '<b>Saltea RLS por completo</b>: todo el aislamiento entre tenants deja de existir. Cada uso debería tener un comentario ' +
                    'explicando por qué no alcanza con la sesión del usuario — y nunca va en middleware ni en el cliente.' },

        { mito: 'Mi contenedor es seguro porque está aislado.',
          realidad: 'Por defecto <b>corre como root</b> adentro. Una ejecución remota de código arranca con el máximo privilegio y escapar es mucho ' +
                    'más fácil. <code>USER</code>, solo lectura, <code>cap_drop: ALL</code> y <code>no-new-privileges</code> son cuatro líneas.' },
      ],

      glosario: [
        { t: 'Mínimo privilegio', d: 'Otorgar solo los permisos estrictamente necesarios, y nada más.' },
        { t: 'service_role', d: 'Clave de Supabase que saltea RLS. Equivale a administrador de la base.' },
        { t: 'Rol de base de datos', d: 'Identidad con un conjunto de permisos sobre esquemas y tablas.' },
        { t: 'Identidad de máquina', d: 'Credencial de un servicio, distinta de la de una persona.' },
        { t: 'cap_drop', d: 'Quitar capacidades del kernel a un contenedor.' },
        { t: 'no-new-privileges', d: 'Impide que un proceso gane privilegios mediante binarios setuid.' },
        { t: 'Revisión de accesos', d: 'Momento periódico donde los permisos se achican a propósito.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Superficie de ataque y red',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> la superficie de ataque es <b>todo lo que se puede
alcanzar desde afuera</b>. Reducirla es la medida más efectiva que existe, porque lo que no es alcanzable no se
puede atacar.</div>

<h4>El inventario que casi nadie tiene</h4>
<p>Antes de proteger nada hay que saber qué está expuesto:</p>
<ul>
<li>Puertos abiertos en cada servidor.</li>
<li>Endpoints públicos de la aplicación.</li>
<li>Paneles de administración y herramientas internas.</li>
<li>Bases de datos con acceso desde internet.</li>
<li>Buckets públicos.</li>
<li>Subdominios olvidados.</li>
</ul>

<div class="aviso"><strong>Los dos últimos son los que más incidentes causan</strong>, y por el mismo motivo:
<b>nadie los mira</b>. Un bucket que se hizo público "para probar" y quedó así; un subdominio de una demo de
hace dos años que sigue apuntando a un servidor sin actualizar. No están en la cabeza de nadie, y por eso no
se parchean.</div>

<h4>Los tres puertos</h4>
<table>
<tr><th>Puerto</th><th>Quién debería alcanzarlo</th></tr>
<tr><td>443 (HTTPS)</td><td>Todo el mundo</td></tr>
<tr><td>80 (HTTP)</td><td>Todo el mundo, solo para redirigir a 443</td></tr>
<tr><td>22 (SSH)</td><td><b>Casi nadie</b>: una IP conocida, o mejor un túnel</td></tr>
<tr><td>5432 (Postgres)</td><td><b>Nadie desde internet</b></td></tr>
<tr><td>6379 (Redis)</td><td><b>Nadie desde internet</b></td></tr>
</table>

<p>Redis y las bases de datos expuestas a internet son un clásico de las noticias de filtraciones, y casi
siempre por la misma razón: se levantaron para una prueba, sin contraseña, y quedaron.</p>

<h4>Defensa en profundidad</h4>
<p>Ninguna capa alcanza sola. La idea es que cada una <b>siga sirviendo cuando la anterior falla</b>:</p>
<pre><code>borde (WAF, límites)  →  firewall de red  →  autenticación
   →  autorización  →  RLS en la base  →  cifrado en reposo</code></pre>
<p>Si el WAF no detecta el ataque, la autenticación lo frena. Si la autenticación se saltea, RLS impide leer
datos ajenos. <b>Confiar en una sola capa es apostar a que esa capa nunca falla.</b></p>
`,

      tecnico: `
<h4>Firewall: denegar por defecto</h4>
<pre><code>ufw default deny incoming
ufw default allow outgoing

ufw allow 443/tcp
ufw allow 80/tcp
ufw allow from TU_IP to any port 22    # SSH solo desde una IP conocida
ufw enable

ufw status numbered   # revisar que no haya reglas viejas</code></pre>

<div class="dato"><strong>La política de <b>denegar por defecto</b> es lo que hace que esto funcione a largo
plazo.</strong> Con "permitir por defecto y bloquear lo malo" hay que anticipar cada cosa mala, y basta que
alguien levante un servicio en un puerto nuevo para que quede expuesto sin que nadie lo decida. ' +
Con denegar por defecto, exponer algo requiere un acto explícito.</div>

<h4>Redes privadas</h4>
<p>La base de datos y los servicios internos no deberían tener IP pública. El patrón:</p>
<pre><code>Internet
   ↓ (solo 443)
Balanceador / proxy inverso        ← IP pública
   ↓ (red privada)
Aplicación                          ← sin IP pública
   ↓ (red privada)
Base de datos, caché, colas         ← sin IP pública</code></pre>
<p>Si la base no tiene ruta desde internet, una credencial filtrada <b>no alcanza</b>: hace falta además estar
adentro de la red. Es una segunda condición que el atacante tiene que cumplir.</p>

<h4>SSH, en orden de preferencia</h4>
<table>
<tr><th>Opción</th><th>Nivel</th></tr>
<tr><td>Contraseña, abierto a internet</td><td>❌ Inaceptable</td></tr>
<tr><td>Clave pública, abierto a internet</td><td>⚠ Aceptable con <code>fail2ban</code></td></tr>
<tr><td>Clave pública, restringido por IP</td><td>✔ Bien</td></tr>
<tr><td>Túnel o bastión, sin puerto expuesto</td><td>✔✔ Lo mejor</td></tr>
</table>
<pre><code># /etc/ssh/sshd_config
PasswordAuthentication no
PermitRootLogin no
PubkeyAuthentication yes</code></pre>

<h4>TLS, sin sorpresas</h4>
<ul>
<li><b>Solo TLS 1.2 y 1.3.</b> Las versiones anteriores tienen problemas conocidos.</li>
<li><b>HSTS</b> con <code>includeSubDomains</code>, para que el navegador nunca intente HTTP.</li>
<li><b>Renovación automática</b> del certificado, y una <b>alerta a 20 días</b> del vencimiento.</li>
<li><b>TLS también hacia adentro</b>, entre proxy y aplicación, si la red no es de confianza.</li>
</ul>

<div class="dato"><strong>La renovación automática falla en silencio más seguido de lo que parece</strong> —un
cambio de DNS, un puerto 80 cerrado, un permiso—. El certificado vence, el sitio deja de cargar y todos se
enteran juntos. Una alerta a 20 días convierte eso en una tarea tranquila.</div>

<h4>Subdominios huérfanos</h4>
<p>Un registro DNS que apunta a un recurso que ya no controlás puede ser reclamado por otra persona, que
entonces sirve contenido <b>desde tu dominio</b>. Con cookies de sesión de dominio amplio, eso es grave.</p>
<pre><code># Listar todos los registros y verificar que cada destino siga siendo tuyo
dig +short demo.tudominio.com
# Si apunta a un servicio dado de baja → borrar el registro</code></pre>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="rd1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="22" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LO QUE DEBERÍA SER ALCANZABLE DESDE INTERNET</text>

  <rect x="24" y="34" width="120" height="150" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="84" y="56" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">INTERNET</text>
  <text x="84" y="82" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">cualquiera</text>

  <line x1="148" y1="70" x2="172" y2="70" stroke="#34d399" stroke-width="2" marker-end="url(#rd1)" color="#34d399"/>
  <text x="160" y="62" text-anchor="middle" fill="#34d399" font-size="8.5" font-weight="700">443</text>

  <rect x="176" y="44" width="150" height="52" rx="9" fill="#34d399" fill-opacity=".2" stroke="#34d399" stroke-width="1.4"/>
  <text x="251" y="66" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">PROXY / BALANCEADOR</text>
  <text x="251" y="84" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">única IP pública</text>

  <line x1="330" y1="70" x2="354" y2="70" stroke="currentColor" stroke-width="1.4" marker-end="url(#rd1)"/>
  <text x="342" y="62" text-anchor="middle" fill="currentColor" opacity=".5" font-size="8">red privada</text>

  <rect x="358" y="44" width="150" height="52" rx="9" fill="#22d3ee" fill-opacity=".16" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="433" y="66" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">APLICACIÓN</text>
  <text x="433" y="84" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">sin IP pública</text>

  <line x1="512" y1="70" x2="530" y2="70" stroke="currentColor" stroke-width="1.4" marker-end="url(#rd1)"/>

  <rect x="534" y="44" width="122" height="52" rx="9" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="595" y="66" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">BASE / CACHÉ</text>
  <text x="595" y="84" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">sin IP pública</text>

  <line x1="84" y1="108" x2="590" y2="108" stroke="#f87171" stroke-width="1.6" stroke-dasharray="6 4" opacity=".8"/>
  <text x="337" y="102" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">✗ SIN RUTA DIRECTA</text>
  <text x="84" y="128" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9">5432 · 6379</text>

  <text x="176" y="128" fill="#34d399" font-size="10.5" font-weight="700">
    Si la base no tiene ruta desde internet, una credencial filtrada NO alcanza:</text>
  <text x="176" y="144" fill="#34d399" font-size="10.5" font-weight="700">
    hace falta además estar adentro de la red. Es una segunda condición.</text>

  <text x="24" y="172" fill="#f87171" font-size="10" font-weight="700">bases y Redis</text>
  <text x="24" y="184" fill="#f87171" font-size="10" font-weight="700">expuestos = clásico</text>

  <line x1="24" y1="200" x2="656" y2="200" stroke="currentColor" opacity=".18"/>

  <text x="24" y="224" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    DEFENSA EN PROFUNDIDAD — cada capa sirve cuando falla la anterior</text>

  <rect x="24" y="236" width="100" height="40" rx="8" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="74" y="260" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">borde/WAF</text>
  <text x="130" y="260" fill="currentColor" opacity=".4" font-size="12">→</text>

  <rect x="146" y="236" width="100" height="40" rx="8" fill="#fbbf24" fill-opacity=".2" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="196" y="260" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">firewall</text>
  <text x="252" y="260" fill="currentColor" opacity=".4" font-size="12">→</text>

  <rect x="268" y="236" width="100" height="40" rx="8" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="318" y="260" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-weight="700">autenticación</text>
  <text x="374" y="260" fill="currentColor" opacity=".4" font-size="12">→</text>

  <rect x="390" y="236" width="100" height="40" rx="8" fill="#22d3ee" fill-opacity=".2" stroke="#22d3ee" stroke-width="1.2"/>
  <text x="440" y="260" text-anchor="middle" fill="#22d3ee" font-size="9.5" font-weight="700">autorización</text>
  <text x="496" y="260" fill="currentColor" opacity=".4" font-size="12">→</text>

  <rect x="512" y="236" width="144" height="40" rx="8" fill="#34d399" fill-opacity=".24" stroke="#34d399" stroke-width="1.5"/>
  <text x="584" y="260" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">RLS + cifrado</text>

  <rect x="24" y="292" width="632" height="94" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="314" fill="#f87171" font-size="12" font-weight="700">LOS DOS QUE MÁS INCIDENTES CAUSAN — porque nadie los mira</text>
  <text x="44" y="338" fill="currentColor" opacity=".75" font-size="11">
    · <tspan font-weight="700">Bucket público</tspan> que se abrió “para probar” y quedó así.</text>
  <text x="44" y="358" fill="currentColor" opacity=".75" font-size="11">
    · <tspan font-weight="700">Subdominio huérfano</tspan>: apunta a un servicio dado de baja y otra persona lo reclama…</text>
  <text x="44" y="376" fill="#f87171" font-size="11" font-weight="700">
    …y sirve contenido DESDE TU DOMINIO. Con cookies de sesión de dominio amplio, eso es grave.</text>
</svg>`,
        pie: 'Lo que no es alcanzable no se puede atacar. Denegar por defecto y exponer con un acto explícito.',
      },

      entrevista: [
        { p: '¿Qué es la superficie de ataque y cómo se reduce?',
          r: 'Es <b>todo lo que se puede alcanzar desde afuera</b>: puertos, endpoints, paneles, bases, buckets, subdominios. Reducirla es la medida ' +
             'más efectiva que existe, porque lo que no es alcanzable no se puede atacar. Se reduce con <b>denegar por defecto</b> en el firewall, ' +
             'poniendo la aplicación y la base en <b>red privada sin IP pública</b>, y manteniendo un inventario. ' +
             'Y arranca por tener ese inventario: no se puede proteger lo que no sabés que está expuesto.' },

        { p: '¿Por qué "denegar por defecto" y no "bloquear lo malo"?',
          r: 'Porque bloquear lo malo exige <b>anticipar cada cosa mala</b>, y basta con que alguien levante un servicio en un puerto nuevo para que ' +
             'quede expuesto sin que nadie lo haya decidido. Con denegar por defecto, exponer algo requiere <b>un acto explícito</b>: alguien tiene ' +
             'que agregar la regla y, en el momento de agregarla, pensar si corresponde. Es la diferencia entre una postura que se degrada sola ' +
             'y una que se sostiene.' },

        { p: '¿Qué gana poner la base de datos en red privada si igual tiene contraseña?',
          r: 'Una <b>segunda condición</b> que el atacante tiene que cumplir. Con la base expuesta a internet, una credencial filtrada alcanza. ' +
             'Sin ruta desde internet, además hay que <b>estar adentro de la red</b>. Es defensa en profundidad: la contraseña puede fallar —se filtra, ' +
             'se reutiliza, es débil— y la red sigue en pie. Bases y Redis expuestos a internet son un clásico de las noticias de filtraciones, ' +
             'casi siempre porque se levantaron para una prueba y quedaron.' },

        { p: '¿Qué es un subdominio huérfano y por qué es peligroso?',
          r: 'Un registro DNS que apunta a un recurso que <b>ya no controlás</b> — una demo dada de baja, un servicio que se canceló. Otra persona ' +
             'puede reclamar ese recurso y entonces sirve contenido <b>desde tu dominio</b>. Si tenés cookies de sesión de dominio amplio, eso es ' +
             'grave. Es uno de los dos problemas que más incidentes causan junto con los buckets públicos olvidados, y por el mismo motivo: ' +
             '<b>nadie los mira</b>, así que no están en la cabeza de nadie ni se parchean.' },
      ],

      practica: `
<h4>Auditar qué está expuesto</h4>
<pre><code># Puertos abiertos localmente
ss -tlnp

# Qué se ve DESDE AFUERA — es lo que importa
nmap -Pn -p- TU_IP_PUBLICA

# ¿La base es alcanzable desde internet?
nc -zv TU_IP_PUBLICA 5432
# Connection refused / timeout  ✓
# succeeded                      ⚠ arreglar ahora</code></pre>

<div class="aviso"><strong>La diferencia entre el primer comando y el segundo es la que importa.</strong>
<code>ss</code> te dice qué escucha en la máquina; <code>nmap</code> desde afuera te dice qué es
<b>alcanzable</b>. Un servicio escuchando en <code>127.0.0.1</code> aparece en el primero y no en el segundo —
y eso está perfecto.</div>

<h4>Configuración de nginx que conviene tener</h4>
<pre><code>server {
  listen 443 ssl http2;
  ssl_protocols TLSv1.2 TLSv1.3;          # nada anterior

  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
  add_header X-Content-Type-Options nosniff always;
  add_header Referrer-Policy strict-origin-when-cross-origin always;
  server_tokens off;                       # no publicar la versión

  location /admin {
    allow TU_IP;
    deny all;
  }
}</code></pre>

<h4>Alerta de vencimiento de certificado</h4>
<pre><code>DIAS=$(( ( $(date -d "$(echo | openssl s_client -connect tusitio.com:443 2>/dev/null \\
  | openssl x509 -noout -enddate | cut -d= -f2)" +%s) - $(date +%s) ) / 86400 ))

[ "$DIAS" -lt 20 ] && echo "⚠ El certificado vence en $DIAS días"</code></pre>
<p>La renovación automática falla en silencio más seguido de lo que parece. Esta alerta convierte una caída
sorpresiva en una tarea tranquila.</p>

<h4>Revisión de superficie</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Firewall en denegar por defecto</td></tr>
<tr><td>☐</td><td>Base y caché sin IP pública</td></tr>
<tr><td>☐</td><td>SSH sin contraseña, restringido o por túnel</td></tr>
<tr><td>☐</td><td>Solo TLS 1.2 y 1.3, con HSTS</td></tr>
<tr><td>☐</td><td>Alerta de vencimiento de certificado</td></tr>
<tr><td>☐</td><td><b>Buckets públicos revisados uno por uno</b></td></tr>
<tr><td>☐</td><td><b>Subdominios verificados: cada destino sigue siendo tuyo</b></td></tr>
<tr><td>☐</td><td>Paneles de administración restringidos por IP</td></tr>
</table>
`,

      errores: [
        { mito: 'Bloqueo lo que sé que es peligroso.',
          realidad: 'Eso exige anticipar cada cosa mala, y cualquier servicio nuevo queda expuesto sin que nadie lo decida. ' +
                    '<b>Denegar por defecto</b>: exponer algo tiene que requerir un acto explícito.' },

        { mito: 'La base tiene contraseña fuerte, puede estar expuesta.',
          realidad: 'La contraseña puede filtrarse o reutilizarse. Sin ruta desde internet, el atacante necesita además <b>estar adentro de la red</b>: ' +
                    'una segunda condición. Bases y Redis expuestos son un clásico de las filtraciones.' },

        { mito: 'Reviso los buckets y subdominios de vez en cuando.',
          realidad: 'Son justamente los dos que <b>nadie mira</b>, y por eso los que más incidentes causan. Un bucket abierto "para probar" y un ' +
                    'subdominio huérfano que otro puede reclamar para servir contenido desde tu dominio.' },

        { mito: 'El certificado se renueva solo.',
          realidad: 'La renovación automática <b>falla en silencio</b> más seguido de lo que parece: un cambio de DNS, el puerto 80 cerrado, un permiso. ' +
                    'El sitio deja de cargar y todos se enteran juntos. Una alerta a 20 días lo convierte en una tarea tranquila.' },
      ],

      glosario: [
        { t: 'Superficie de ataque', d: 'Conjunto de puntos alcanzables desde afuera.' },
        { t: 'Denegar por defecto', d: 'Bloquear todo y permitir explícitamente lo necesario.' },
        { t: 'Red privada', d: 'Segmento sin ruta desde internet, alcanzable solo desde adentro.' },
        { t: 'Bastión', d: 'Único host de entrada por el que se accede al resto de la red.' },
        { t: 'HSTS', d: 'Cabecera que obliga al navegador a usar siempre HTTPS en ese dominio.' },
        { t: 'Subdominio huérfano', d: 'Registro DNS que apunta a un recurso que ya no controlás.' },
        { t: 'Defensa en profundidad', d: 'Varias capas independientes, cada una útil cuando falla la anterior.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Respaldos que de verdad restauran',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un respaldo que nunca se restauró <b>no es un
respaldo</b>: es un archivo que asumís que sirve. La única prueba es haberlo restaurado.</div>

<h4>Las tres formas en que fallan</h4>

<p><b>1 · No existían.</b> "Pensé que el proveedor los hacía." Muchos planes gratuitos no incluyen respaldos, o
los conservan solo unos días.</p>

<p><b>2 · Existían pero estaban rotos.</b> El proceso venía fallando hace meses y nadie miraba. Un respaldo
que falla en silencio es peor que no tenerlo, porque genera confianza falsa.</p>

<p><b>3 · Existían, servían, y nadie sabía restaurarlos.</b> Bajo presión, sin haberlo practicado, con la
documentación incompleta.</p>

<div class="aviso"><strong>La regla 3-2-1, que es vieja y sigue vigente:</strong> <b>3</b> copias de los datos,
en <b>2</b> medios distintos, con <b>1</b> fuera del sitio principal. En términos modernos: la base, un
respaldo automático del proveedor, y una copia en otro proveedor o cuenta. Ese "otro proveedor" es el que te
salva de que se comprometa tu cuenta, que es un escenario más real que el incendio del centro de datos.</div>

<h4>Las dos preguntas que definen todo</h4>
<ul>
<li><b>¿Cuántos datos podés perder?</b> Si respaldás cada 24 horas, podés perder hasta 24 horas de trabajo.</li>
<li><b>¿Cuánto podés estar caído?</b> Restaurar 500 GB puede llevar horas.</li>
</ul>
<p>De esas dos respuestas sale toda la estrategia. Y la segunda casi siempre sorprende: la gente estima el
tiempo de restauración muy por debajo de lo real, <b>porque nunca lo midió</b>.</p>

<h4>Y algo que no es un respaldo</h4>
<p><b>Una réplica no es un respaldo.</b> Una réplica copia todo en tiempo real — incluido el
<code>DELETE</code> equivocado. Te protege de que se rompa un servidor; <b>no te protege de un error, lo
propaga</b>.</p>
`,

      tecnico: `
<h4>Las capas, y de qué protege cada una</h4>
<table>
<tr><th>Capa</th><th>Protege de</th><th>NO protege de</th></tr>
<tr><td>Réplica</td><td>Falla de hardware</td><td>Errores: los propaga</td></tr>
<tr><td>Recuperación a un punto en el tiempo</td><td>Un borrado, si se detecta rápido</td><td>Perder la cuenta entera</td></tr>
<tr><td>Volcado diario en otra cuenta</td><td>Compromiso de la cuenta principal</td><td>Pérdida de hasta 24 h</td></tr>
<tr><td>Volcado mensual archivado</td><td>Corrupción detectada tarde</td><td>Datos recientes</td></tr>
</table>

<div class="dato"><strong>La recuperación a un punto en el tiempo es la más útil de las cuatro</strong> porque
te deja volver a <b>un minuto antes</b> del error, y no al respaldo de la madrugada. La diferencia práctica
entre perder 30 segundos y perder 14 horas de operación es enorme, y sin embargo mucha gente no verifica si su
plan la incluye — a veces está y nadie lo sabe, y a veces se asume que está y no.</div>

<h4>El ensayo de restauración</h4>
<p>Es la única forma de saber que funciona. Una vez por trimestre, en un entorno aparte:</p>
<pre><code>1. Tomar el respaldo más reciente.
2. Restaurarlo en una base NUEVA.
3. CRONOMETRAR cuánto tarda.
4. Verificar integridad: cantidad de filas, últimos registros, relaciones.
5. Levantar la aplicación contra esa base y probar los flujos principales.
6. Anotar el tiempo real y qué pasos faltaban en la documentación.</code></pre>

<div class="dato"><strong>El paso 6 es el que más valor genera la primera vez.</strong> Siempre aparece algo:
una extensión que hay que crear antes, permisos que no vienen en el volcado, una secuencia desincronizada, un
paso que solo estaba en la cabeza de alguien. <b>Descubrir eso un martes a la tarde es infinitamente mejor que
descubrirlo durante un incidente.</b></div>

<h4>Respaldo manual, para tener uno propio</h4>
<pre><code># Volcado comprimido, en formato personalizado (permite restauración parcial)
pg_dump "$DATABASE_URL" -Fc -Z9 -f "respaldo-$(date +%F).dump"

# Verificar que no esté corrupto ANTES de guardarlo
pg_restore --list "respaldo-$(date +%F).dump" &gt; /dev/null &amp;&amp; echo "✓ íntegro"

# Subir a OTRA cuenta / OTRO proveedor
rclone copy "respaldo-$(date +%F).dump" otroproveedor:respaldos/</code></pre>

<div class="dato"><strong>La verificación con <code>pg_restore --list</code> cuesta un segundo</strong> y
detecta el escenario más frustrante: un volcado que se truncó por falta de espacio o por una conexión cortada,
y que <b>parece un archivo normal</b> hasta que intentás usarlo — es decir, hasta el peor momento posible.</div>

<h4>El respaldo también hay que protegerlo</h4>
<ul>
<li><b>Cifrado en reposo</b>: contiene todos tus datos, con la misma sensibilidad que la base.</li>
<li><b>Acceso restringido</b>: solo el proceso que respalda escribe, y muy poca gente lee.</li>
<li><b>Inmutabilidad</b> si el proveedor la ofrece: que no se puedan borrar antes de X días. <b>Es lo que te protege de un ataque que primero borra los respaldos.</b></li>
<li><b>Alerta si no se generó</b>, no solo si falló: un proceso que dejó de ejecutarse no falla, simplemente no aparece.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <rect x="24" y="28" width="632" height="52" rx="10" fill="#f87171" fill-opacity=".14" stroke="#f87171" stroke-width="1.6"/>
  <text x="340" y="52" text-anchor="middle" fill="#f87171" font-size="13" font-weight="700">
    Un respaldo que nunca se restauró no es un respaldo: es un archivo que asumís que sirve.</text>
  <text x="340" y="70" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11">
    Y una réplica NO es un respaldo: copia el DELETE equivocado en tiempo real. No te protege de un error: lo propaga.</text>

  <text x="24" y="106" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS CUATRO CAPAS — y de qué protege cada una</text>

  <rect x="24" y="118" width="152" height="76" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="100" y="138" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">RÉPLICA</text>
  <text x="100" y="158" text-anchor="middle" fill="#34d399" font-size="9.5">✓ falla de hardware</text>
  <text x="100" y="176" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">✗ errores: los propaga</text>

  <rect x="188" y="118" width="152" height="76" rx="10" fill="#34d399" fill-opacity=".18" stroke="#34d399" stroke-width="1.6"/>
  <text x="264" y="138" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">PUNTO EN EL TIEMPO</text>
  <text x="264" y="158" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="700">volver a 1 min antes</text>
  <text x="264" y="176" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9">la más útil de las cuatro</text>

  <rect x="352" y="118" width="152" height="76" rx="10" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="428" y="138" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700">VOLCADO DIARIO</text>
  <text x="428" y="156" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">en OTRA cuenta</text>
  <text x="428" y="174" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">✓ compromiso de cuenta</text>

  <rect x="516" y="118" width="140" height="76" rx="10" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="586" y="138" text-anchor="middle" fill="#7c5cff" font-size="10.5" font-weight="700">MENSUAL ARCHIVADO</text>
  <text x="586" y="158" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">retención larga</text>
  <text x="586" y="176" text-anchor="middle" fill="#7c5cff" font-size="9.5" font-weight="700">✓ corrupción tardía</text>

  <line x1="24" y1="212" x2="656" y2="212" stroke="currentColor" opacity=".18"/>

  <text x="24" y="236" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LAS TRES FORMAS EN QUE FALLAN</text>

  <rect x="24" y="248" width="200" height="66" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="124" y="268" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">1 · no existían</text>
  <text x="124" y="286" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">“pensé que el proveedor</text>
  <text x="124" y="300" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">los hacía”</text>

  <rect x="240" y="248" width="200" height="66" rx="9" fill="#f87171" fill-opacity=".18" stroke="#f87171" stroke-width="1.6"/>
  <text x="340" y="268" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">2 · estaban rotos</text>
  <text x="340" y="286" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">fallando hace meses</text>
  <text x="340" y="300" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">peor que no tenerlos: confianza falsa</text>

  <rect x="456" y="248" width="200" height="66" rx="9" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.2"/>
  <text x="556" y="268" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">3 · nadie sabía restaurar</text>
  <text x="556" y="286" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">bajo presión, sin práctica,</text>
  <text x="556" y="300" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">con la doc incompleta</text>

  <rect x="24" y="326" width="632" height="60" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.5"/>
  <text x="44" y="348" fill="#34d399" font-size="12" font-weight="700">EL ENSAYO TRIMESTRAL — restaurar de verdad, en una base nueva, cronometrando</text>
  <text x="44" y="368" fill="currentColor" opacity=".75" font-size="11">
    Siempre aparece algo: una extensión que faltaba, permisos que no vienen en el volcado, una secuencia desincronizada.</text>
  <text x="44" y="383" fill="#34d399" font-size="11" font-weight="700">
    Descubrirlo un martes a la tarde es infinitamente mejor que descubrirlo durante un incidente.</text>
</svg>`,
        pie: 'La única prueba de que un respaldo sirve es haberlo restaurado.',
      },

      entrevista: [
        { p: '¿Por qué una réplica no es un respaldo?',
          r: 'Porque copia todo en tiempo real, <b>incluido el <code>DELETE</code> equivocado</b>. Te protege de que se rompa un servidor, ' +
             'pero <b>no te protege de un error: lo propaga</b>, y en segundos. Son cosas distintas y hacen falta las dos. ' +
             'La confusión es común y es cara: mucha gente cree que tiene respaldo porque tiene alta disponibilidad.' },

        { p: '¿Cuáles son las tres formas en que fallan los respaldos?',
          r: '<b>No existían</b> —"pensé que el proveedor los hacía", y muchos planes gratuitos no los incluyen o los retienen pocos días—. ' +
             '<b>Existían pero estaban rotos</b>: el proceso venía fallando hace meses y nadie miraba, que es peor que no tenerlos porque genera ' +
             'confianza falsa. Y <b>existían, servían, y nadie sabía restaurarlos</b>: bajo presión, sin haberlo practicado, con la documentación ' +
             'incompleta. Las tres se resuelven con lo mismo: <b>ensayar la restauración periódicamente</b>.' },

        { p: '¿Qué hace el ensayo de restauración que no hace verificar que el respaldo existe?',
          r: 'Descubre lo que falta. Siempre aparece algo: una extensión que hay que crear antes, permisos que no vienen en el volcado, una secuencia ' +
             'desincronizada, un paso que solo estaba en la cabeza de alguien. Y te da el <b>tiempo real de restauración</b> — que la gente estima ' +
             'muy por debajo, porque nunca lo midió. <b>Descubrirlo un martes a la tarde es infinitamente mejor que descubrirlo durante un ' +
             'incidente.</b>' },

        { p: '¿Cómo protegés los respaldos en sí?',
          r: 'Cifrados en reposo, porque contienen todos los datos con la misma sensibilidad que la base. Con <b>acceso restringido</b>: solo el proceso ' +
             'que respalda escribe. En <b>otra cuenta u otro proveedor</b>, que es lo que te salva si se compromete la cuenta principal — un escenario ' +
             'más real que el incendio del centro de datos. Con <b>inmutabilidad</b> si el proveedor la ofrece, que protege del ataque que primero ' +
             'borra los respaldos. Y con una <b>alerta si no se generó</b>, no solo si falló: un proceso que dejó de ejecutarse no falla, ' +
             'simplemente no aparece.' },
      ],

      practica: `
<h4>Respaldo verificado, en otra cuenta</h4>
<pre><code>#!/bin/bash
set -euo pipefail

FECHA=$(date +%F)
ARCHIVO="respaldo-$FECHA.dump"

pg_dump "$DATABASE_URL" -Fc -Z9 -f "$ARCHIVO"

# Verificar ANTES de subir: detecta el volcado truncado
pg_restore --list "$ARCHIVO" &gt; /dev/null || {
  echo "::error::Respaldo corrupto"; exit 1;
}

TAM=$(stat -c%s "$ARCHIVO")
[ "$TAM" -gt 1000000 ] || { echo "::error::Sospechosamente chico"; exit 1; }

rclone copy "$ARCHIVO" otroproveedor:respaldos/
rm "$ARCHIVO"
echo "✓ $ARCHIVO ($((TAM/1024/1024)) MB)"</code></pre>

<div class="aviso"><strong>La comprobación de tamaño mínimo atrapa un caso silencioso:</strong> el volcado que
se generó contra una base vacía porque la variable de conexión apuntaba mal. El archivo existe, el proceso
reporta éxito, y adentro no hay nada.</div>

<h4>El ensayo, paso por paso</h4>
<pre><code># 1 · Base nueva y vacía
createdb ensayo_restauracion

# 2 · Restaurar, cronometrando
time pg_restore -d ensayo_restauracion --no-owner --no-acl respaldo.dump

# 3 · Verificar integridad
psql ensayo_restauracion -c "
  select 'usuarios' t, count(*) from usuarios
  union all select 'pedidos', count(*) from pedidos;"

# 4 · Últimos registros: ¿de cuándo son?
psql ensayo_restauracion -c "select max(creado_en) from pedidos;"

# 5 · Levantar la app contra esta base y probar los flujos principales</code></pre>

<h4>Alerta de respaldo faltante</h4>
<pre><code># No alcanza con alertar si FALLA. Un proceso que dejó de
# ejecutarse no falla: simplemente no aparece.
ULTIMO=$(rclone lsl otroproveedor:respaldos/ | sort -k2 | tail -1)
HORAS=$(( ( $(date +%s) - $(date -d "$(echo "$ULTIMO" | awk '{print $2}')" +%s) ) / 3600 ))

[ "$HORAS" -gt 26 ] && echo "⚠ Sin respaldo hace $HORAS horas"</code></pre>

<h4>Checklist</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Sé cuántos datos puedo perder y cuánto puedo estar caído</td></tr>
<tr><td>☐</td><td>Recuperación a un punto en el tiempo: verificada, no supuesta</td></tr>
<tr><td>☐</td><td>Volcado diario en <b>otra cuenta u otro proveedor</b></td></tr>
<tr><td>☐</td><td>Verificación de integridad y de tamaño mínimo</td></tr>
<tr><td>☐</td><td><b>Alerta si no se generó</b>, no solo si falló</td></tr>
<tr><td>☐</td><td>Respaldos cifrados y con acceso restringido</td></tr>
<tr><td>☐</td><td><b>Ensayo de restauración trimestral, cronometrado</b></td></tr>
<tr><td>☐</td><td>Procedimiento escrito y probado por más de una persona</td></tr>
</table>
`,

      errores: [
        { mito: 'Tengo una réplica, estoy cubierto.',
          realidad: 'La réplica copia el error en tiempo real. Te cubre de una falla de hardware, <b>no de un borrado</b>. Son dos problemas distintos ' +
                    'y hacen falta las dos cosas.' },

        { mito: 'El proveedor hace respaldos automáticos.',
          realidad: 'Verificá <b>cuánta retención</b>, <b>si incluye recuperación a un punto en el tiempo</b>, y qué pasa si se compromete tu cuenta — ' +
                    'porque un respaldo dentro de la cuenta comprometida no te sirve. Y muchos planes gratuitos no incluyen respaldos.' },

        { mito: 'Mis respaldos funcionan: el proceso corre todos los días.',
          realidad: 'Que el proceso corra no significa que el archivo sirva. Un volcado truncado <b>parece un archivo normal</b> hasta que intentás ' +
                    'usarlo. Verificá integridad y tamaño al generarlo, y <b>restaurá de verdad</b> una vez por trimestre.' },

        { mito: 'Alerto si el respaldo falla.',
          realidad: 'Un proceso que <b>dejó de ejecutarse no falla</b>: simplemente no aparece, y no genera ninguna alerta. Hay que alertar por ' +
                    '<b>ausencia</b>: "no hay respaldo nuevo hace más de 26 horas".' },
      ],

      glosario: [
        { t: 'Respaldo', d: 'Copia de los datos en un momento dado, independiente del sistema en producción.' },
        { t: 'Réplica', d: 'Copia sincronizada en tiempo real. Protege de fallas, no de errores.' },
        { t: 'Punto en el tiempo', d: 'Capacidad de restaurar el estado exacto de un instante anterior.' },
        { t: 'Regla 3-2-1', d: 'Tres copias, dos medios, una fuera del sitio principal.' },
        { t: 'Inmutabilidad', d: 'Impedir que un respaldo se borre antes de cierto plazo.' },
        { t: 'Ensayo de restauración', d: 'Restaurar de verdad en un entorno aparte, para comprobar que funciona.' },
        { t: 'Alerta por ausencia', d: 'Avisar cuando algo esperado no ocurrió, no solo cuando falló.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Cadena de suministro: lo que ejecutás sin haberlo escrito',
      minutos: 7,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> en un proyecto típico, <b>el 95% del código que
corre en producción no lo escribiste vos</b>. Son dependencias, imágenes base y acciones de CI que ejecutás
confiando en gente que no conocés.</div>

<h4>Los cuatro caminos de entrada</h4>
<ul>
<li><b>Dependencias</b> — un paquete comprometido corre con los permisos de tu aplicación.</li>
<li><b>Imágenes base</b> — la imagen de tu contenedor trae cientos de paquetes del sistema.</li>
<li><b>Acciones de CI</b> — corren con acceso a tus secretos de despliegue.</li>
<li><b>Extensiones y complementos</b> — de la base, del editor, del navegador.</li>
</ul>

<div class="aviso"><strong>El tercero es el más subestimado.</strong> Una acción de CI de terceros corre
<b>con acceso a los secretos del pipeline</b>: credenciales de despliegue, claves de API, tokens del
repositorio. Si esa acción se compromete, se lleva todo eso <b>sin tocar tu código</b>. Por eso conviene
fijarlas por hash de commit y no por etiqueta: una etiqueta la puede mover el autor —o quien lo
comprometa— para apuntar a código distinto sin que vos cambies nada.</div>

<h4>Las cuatro medidas que cubren la mayoría</h4>
<ol>
<li><b>Archivo de bloqueo versionado</b> y <code>--frozen-lockfile</code> en CI. Sin esto no sabés qué versión estás desplegando.</li>
<li><b>Menos dependencias.</b> La más segura es la que no instalaste — y hay muchos paquetes de tres líneas.</li>
<li><b>Escaneo automático</b> de vulnerabilidades conocidas, y actualizaciones periódicas.</li>
<li><b>Versiones fijadas</b> en imágenes base y acciones de CI.</li>
</ol>

<h4>El caso especial de la IA</h4>
<p>Si tu sistema le da herramientas a un modelo, aparece un camino nuevo: <b>prompt injection</b>. Un
documento que el modelo lee puede contener instrucciones, y el modelo <b>no distingue de forma confiable</b>
entre lo que le pidió el usuario y lo que dice el contenido que está procesando.</p>
<p>La defensa no es un mejor prompt: es que <b>las herramientas peligrosas requieran confirmación humana</b> y
que el modelo corra con permisos acotados, como cualquier otro componente.</p>
`,

      tecnico: `
<h4>Fijar versiones donde importa</h4>
<pre><code># ❌ Imagen base con etiqueta móvil: cambia bajo tus pies
FROM node:22-alpine

# ✔ Fijada por digest: siempre exactamente la misma
FROM node:22-alpine@sha256:1a2b3c...

# ❌ Acción de CI por etiqueta: el autor puede moverla
- uses: alguien/accion@v1

# ✔ Fijada por hash de commit
- uses: alguien/accion@a1b2c3d4e5f6...</code></pre>

<div class="dato"><strong>La diferencia entre una etiqueta y un hash es quién controla qué se ejecuta.</strong>
Una etiqueta es un puntero <b>móvil</b>: el autor —o quien comprometa su cuenta— puede reapuntarla a código
distinto, y tu pipeline lo ejecuta sin que vos hayas cambiado una línea. Un hash de commit es inmutable.
<b>Con acceso a los secretos de despliegue, esa diferencia es todo.</b></div>

<h4>Reducir la superficie de la imagen</h4>
<table>
<tr><th>Imagen base</th><th>Tamaño aprox.</th><th>Paquetes del sistema</th></tr>
<tr><td><code>node:22</code></td><td>~1 GB</td><td>Cientos</td></tr>
<tr><td><code>node:22-slim</code></td><td>~200 MB</td><td>Bastantes menos</td></tr>
<tr><td><code>node:22-alpine</code></td><td>~130 MB</td><td>Mínimos</td></tr>
<tr><td><code>distroless</code></td><td>~70 MB</td><td>Ni siquiera hay shell</td></tr>
</table>
<p>Menos paquetes es menos superficie y menos vulnerabilidades que parchear. Y <code>distroless</code> tiene
una propiedad interesante: <b>sin shell, muchas técnicas de post-explotación no funcionan</b> porque no hay
con qué ejecutarlas.</p>

<h4>Escaneo, en el lugar correcto</h4>
<pre><code>- name: Escanear imagen
  uses: aquasecurity/trivy-action@HASH
  with:
    image-ref: mi-imagen:\${{ github.sha }}
    severity: CRITICAL,HIGH
    exit-code: '1'          # frena solo por crítico y alto</code></pre>

<div class="dato"><strong>Frenar por severidad crítica y alta, y no por todo, es deliberado.</strong> Un
escaneo que reporta ochenta vulnerabilidades bajas en dependencias de desarrollo hace que el equipo aprenda a
ignorar el resultado — <b>el mismo mecanismo que la fatiga de alertas</b>. Frenar tiene que significar algo,
también acá.</div>

<h4>Actualizaciones: el equilibrio real</h4>
<p>Actualizar todo el tiempo rompe cosas; no actualizar nunca acumula vulnerabilidades. Lo que funciona:</p>
<ul>
<li><b>Parches de seguridad</b> — automáticos, con tests que los validen.</li>
<li><b>Versiones menores</b> — agrupadas, semanal o quincenalmente.</li>
<li><b>Versiones mayores</b> — a mano, leyendo qué cambió, de a una.</li>
</ul>
<p>Un proyecto que no se actualiza hace dos años acumula tanta deuda que actualizar se vuelve un proyecto en sí
mismo — y por eso se pospone otra vez.</p>

<h4>Prompt injection, con una defensa concreta</h4>
<pre><code>const PELIGROSAS = new Set(['borrar_registro', 'enviar_email', 'ejecutar_sql']);

async function ejecutarHerramienta(nombre, args, ctx) {
  if (PELIGROSAS.has(nombre) &amp;&amp; !ctx.confirmadoPorHumano) {
    return { requiereConfirmacion: true, nombre, args };
  }
  // Y el tenant sale del CONTEXTO, nunca de lo que dijo el modelo
  return herramientas[nombre](args, { tenantId: ctx.tenantId });
}</code></pre>
<p>La segunda línea de ese comentario es la más importante: si el modelo puede elegir el <code>tenant_id</code>,
una instrucción inyectada en un documento puede pedirle datos de otro tenant. <b>El contexto de seguridad no
pasa por el modelo.</b></p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="cs1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <rect x="24" y="28" width="632" height="42" rx="10" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="340" y="54" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="700">
    El ~95% del código que corre en producción no lo escribiste vos.</text>

  <text x="24" y="96" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS CUATRO CAMINOS DE ENTRADA</text>

  <rect x="24" y="108" width="152" height="72" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="100" y="128" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">DEPENDENCIAS</text>
  <text x="100" y="148" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">corren con los permisos</text>
  <text x="100" y="162" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">de tu aplicación</text>

  <rect x="188" y="108" width="152" height="72" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="264" y="128" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">IMAGEN BASE</text>
  <text x="264" y="148" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">cientos de paquetes</text>
  <text x="264" y="162" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">del sistema</text>

  <rect x="352" y="108" width="152" height="72" rx="10" fill="#f87171" fill-opacity=".2" stroke="#f87171" stroke-width="1.8"/>
  <text x="428" y="128" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">ACCIONES DE CI</text>
  <text x="428" y="148" text-anchor="middle" fill="#f87171" font-size="9.5" font-weight="700">acceso a TUS SECRETOS</text>
  <text x="428" y="162" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">el más subestimado</text>

  <rect x="516" y="108" width="140" height="72" rx="10" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="586" y="128" text-anchor="middle" fill="#22d3ee" font-size="10.5" font-weight="700">EXTENSIONES</text>
  <text x="586" y="148" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">base, editor,</text>
  <text x="586" y="162" text-anchor="middle" fill="currentColor" opacity=".65" font-size="9.5">navegador</text>

  <line x1="24" y1="198" x2="656" y2="198" stroke="currentColor" opacity=".18"/>

  <text x="24" y="222" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    ETIQUETA vs HASH — quién controla qué se ejecuta</text>

  <rect x="24" y="234" width="304" height="80" rx="10" fill="#f87171" fill-opacity=".1" stroke="#f87171" stroke-width="1.3"/>
  <text x="176" y="254" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700">✗ ETIQUETA — puntero MÓVIL</text>
  <text x="44" y="274" fill="currentColor" opacity=".72" font-size="10" font-family="monospace">uses: alguien/accion@v1</text>
  <text x="44" y="294" fill="#f87171" font-size="10" font-weight="700">el autor puede reapuntarla a otro código</text>
  <text x="44" y="308" fill="#f87171" font-size="10" font-weight="700">y tu pipeline lo ejecuta igual</text>

  <rect x="352" y="234" width="304" height="80" rx="10" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.4"/>
  <text x="504" y="254" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">✓ HASH DE COMMIT — inmutable</text>
  <text x="372" y="274" fill="currentColor" opacity=".72" font-size="10" font-family="monospace">uses: alguien/accion@a1b2c3d…</text>
  <text x="372" y="294" fill="#34d399" font-size="10" font-weight="700">siempre exactamente el mismo código</text>
  <text x="372" y="308" fill="currentColor" opacity=".6" font-size="10">con acceso a los secretos, esa diferencia es todo</text>

  <rect x="24" y="328" width="632" height="58" rx="10" fill="#7c5cff" fill-opacity=".1" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="44" y="350" fill="#7c5cff" font-size="12" font-weight="700">EL CASO IA — prompt injection</text>
  <text x="44" y="370" fill="currentColor" opacity=".75" font-size="11">
    Un documento que el modelo lee puede contener instrucciones, y el modelo no distingue de forma confiable.</text>
  <text x="44" y="384" fill="#7c5cff" font-size="11" font-weight="700">
    La defensa no es un mejor prompt: herramientas peligrosas con confirmación humana + el tenant NUNCA pasa por el modelo.</text>
</svg>`,
        pie: 'Confiás en gente que no conocés. La pregunta es cuánto poder les das.',
      },

      entrevista: [
        { p: '¿Cuál es el riesgo de cadena de suministro más subestimado?',
          r: 'Las <b>acciones de CI de terceros</b>, porque corren <b>con acceso a los secretos del pipeline</b>: credenciales de despliegue, claves de ' +
             'API, tokens del repositorio. Si una se compromete, se lleva todo eso <b>sin tocar tu código</b>. Por eso conviene fijarlas por ' +
             '<b>hash de commit</b> y no por etiqueta: una etiqueta es un puntero móvil que el autor —o quien comprometa su cuenta— puede reapuntar ' +
             'a código distinto, y tu pipeline lo ejecuta sin que vos hayas cambiado una línea.' },

        { p: '¿Qué medidas cubren la mayor parte del riesgo de dependencias?',
          r: 'Cuatro. <b>Archivo de bloqueo versionado</b> con <code>--frozen-lockfile</code> en CI, para saber exactamente qué se despliega. ' +
             '<b>Menos dependencias</b>: la más segura es la que no instalaste, y hay muchos paquetes de tres líneas que no valen el riesgo. ' +
             '<b>Escaneo automático</b> con actualizaciones periódicas. Y <b>versiones fijadas</b> en imágenes base y acciones de CI. ' +
             'Ninguna es sofisticada, y entre las cuatro cubren la enorme mayoría de los casos reales.' },

        { p: '¿Por qué conviene una imagen base más chica?',
          r: 'Menos paquetes es <b>menos superficie</b> y menos vulnerabilidades que parchear: pasar de una imagen completa de ~1 GB a alpine de ' +
             '~130 MB elimina cientos de paquetes del sistema que tu aplicación nunca usa. Y <code>distroless</code> tiene una propiedad extra: ' +
             '<b>no tiene shell</b>, así que muchas técnicas de post-explotación no funcionan simplemente porque no hay con qué ejecutarlas. ' +
             'El costo es que depurar adentro del contenedor se vuelve más incómodo.' },

        { p: '¿Cómo se defiende un sistema con IA de prompt injection?',
          r: 'No con un prompt mejor — el modelo <b>no distingue de forma confiable</b> entre la instrucción del usuario y el contenido que está ' +
             'leyendo. La defensa es arquitectónica: <b>las herramientas peligrosas requieren confirmación humana</b>, y el modelo corre con ' +
             '<b>permisos acotados</b> como cualquier otro componente. Y lo más importante: <b>el contexto de seguridad no pasa por el modelo</b> — ' +
             'si el modelo puede elegir el <code>tenant_id</code>, una instrucción inyectada en un documento puede pedir datos de otro tenant. ' +
             'Ese identificador sale del contexto del servidor, siempre.' },
      ],

      practica: `
<h4>Fijar todo lo que se ejecuta</h4>
<pre><code># Obtener el digest de una imagen
docker pull node:22-alpine
docker inspect --format='{{index .RepoDigests 0}}' node:22-alpine

# Obtener el hash de commit de una acción de CI
gh api repos/ALGUIEN/ACCION/commits/v1 --jq .sha</code></pre>

<h4>Actualizaciones agrupadas por riesgo</h4>
<pre><code># .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule: { interval: weekly }
    groups:
      seguridad:
        applies-to: security-updates
        patterns: ['*']
      menores:
        update-types: [minor, patch]
    ignore:
      - dependency-name: '*'
        update-types: [version-update:semver-major]   # mayores a mano</code></pre>

<div class="aviso"><strong>Agrupar es lo que hace sostenible el proceso.</strong> Veinte pull requests
separados por semana se ignoran; <b>uno agrupado con veinte actualizaciones menores se revisa</b>. Y las
mayores quedan fuera a propósito: esas se hacen a mano, de a una, leyendo qué cambió.</div>

<h4>Auditar dependencias antes de sumarlas</h4>
<pre><code># ¿Cuántas dependencias arrastra?
npm info PAQUETE dependencies

# ¿Se mantiene?
npm info PAQUETE time.modified

# ¿Cuánto pesa realmente?
npx bundlephobia PAQUETE</code></pre>
<p>Para una función de tres líneas, escribirla es más barato que sumar un paquete con seis dependencias
transitivas que vas a arrastrar durante años.</p>

<h4>El contexto de seguridad no pasa por el modelo</h4>
<pre><code>// ❌ El modelo elige el tenant → una instrucción inyectada puede cambiarlo
async function buscar({ tenantId, texto }) { ... }

// ✔ El tenant sale del contexto del servidor; el modelo solo elige QUÉ buscar
async function buscar({ texto }, ctx) {
  return db.buscar(ctx.tenantId, texto);
}</code></pre>

<h4>Checklist de cadena de suministro</h4>
<table>
<tr><th>☐</th><th>Control</th></tr>
<tr><td>☐</td><td>Archivo de bloqueo versionado y <code>--frozen-lockfile</code> en CI</td></tr>
<tr><td>☐</td><td>Imágenes base fijadas por digest</td></tr>
<tr><td>☐</td><td><b>Acciones de CI fijadas por hash de commit</b></td></tr>
<tr><td>☐</td><td>Escaneo de imagen que frena solo por crítico y alto</td></tr>
<tr><td>☐</td><td>Actualizaciones agrupadas; mayores a mano</td></tr>
<tr><td>☐</td><td>Imagen base mínima (alpine o distroless)</td></tr>
<tr><td>☐</td><td>Herramientas peligrosas de IA con confirmación humana</td></tr>
<tr><td>☐</td><td>El <code>tenant_id</code> nunca lo elige el modelo</td></tr>
</table>
`,

      errores: [
        { mito: 'Solo reviso mi código.',
          realidad: 'El <b>~95% de lo que corre no lo escribiste vos</b>: dependencias, imagen base, acciones de CI, extensiones. Cada una es un ' +
                    'camino de entrada, y la de CI es la peor porque corre con acceso a tus secretos de despliegue.' },

        { mito: 'Uso versiones con etiqueta para recibir mejoras automáticamente.',
          realidad: 'Una etiqueta es un puntero <b>móvil</b>: el autor puede reapuntarla a código distinto y tu pipeline lo ejecuta sin que cambies ' +
                    'una línea. Fijá por <b>digest</b> las imágenes y por <b>hash de commit</b> las acciones, y actualizá a propósito.' },

        { mito: 'El escaneo tiene que frenar por cualquier vulnerabilidad.',
          realidad: 'Ochenta hallazgos bajos en dependencias de desarrollo hacen que el equipo aprenda a ignorar el resultado — la misma dinámica que ' +
                    'la fatiga de alertas. Frená por <b>crítico y alto</b>, para que frenar signifique algo.' },

        { mito: 'Contra prompt injection uso un prompt más estricto.',
          realidad: 'El modelo <b>no distingue de forma confiable</b> entre instrucción y contenido. La defensa es arquitectónica: confirmación humana ' +
                    'en herramientas peligrosas, permisos acotados, y <b>el contexto de seguridad nunca pasa por el modelo</b>.' },
      ],

      glosario: [
        { t: 'Cadena de suministro', d: 'Todo el código y los artefactos de terceros que terminan ejecutándose.' },
        { t: 'Archivo de bloqueo', d: 'Registro de las versiones exactas instaladas. Debe estar versionado.' },
        { t: 'Digest', d: 'Hash inmutable que identifica una imagen concreta, a diferencia de una etiqueta.' },
        { t: 'Distroless', d: 'Imagen sin sistema operativo completo ni shell. Superficie mínima.' },
        { t: 'Dependencia transitiva', d: 'La que llega indirectamente, a través de otra dependencia.' },
        { t: 'Prompt injection', d: 'Instrucciones ocultas en contenido que el modelo lee y termina obedeciendo.' },
        { t: 'Confirmación humana', d: 'Exigir aprobación antes de ejecutar una acción con efectos.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Por qué el mínimo privilegio se degrada solo con el tiempo?',
      opciones: [
        'Ampliar un permiso es urgente y achicarlo no lo es nunca',
        'Los sistemas otorgan permisos automáticamente',
        'Las herramientas no permiten permisos finos',
        'Porque los equipos no conocen el principio',
      ],
      correcta: 0,
      porQue: 'La secuencia es siempre igual: algo falla por un permiso, se amplía "temporalmente", funciona, y nadie vuelve a achicarlo. Por eso hace falta una revisión periódica donde se achiquen a propósito.',
      porQueNo: {
        1: 'Los permisos los otorgan personas, no el sistema.',
        2: 'La mayoría de las plataformas modernas permite permisos muy granulares.',
        3: 'Casi todos lo conocen; el problema es la asimetría de urgencia.',
      },
    },
    {
      p: '¿Qué aporta el mínimo privilegio si igual te comprometen?',
      opciones: [
        'Acota el daño: con la misma clave filtrada, la diferencia entre incidente y catástrofe',
        'Impide que ocurra el compromiso',
        'Acelera la detección del ataque',
        'Reduce el costo de la infraestructura',
      ],
      correcta: 0,
      porQue: 'Con permisos amplios el atacante tiene toda la base, todos los tenants y todos los archivos. Con permisos acotados, un bucket, solo lectura y desde una red.',
      porQueNo: {
        1: 'No evita el compromiso: decide su alcance.',
        2: 'La detección depende de la observabilidad, no de los permisos.',
        3: 'No tiene relación con el costo.',
      },
    },
    {
      p: '¿Por qué separar el rol de migraciones del rol de la aplicación?',
      opciones: [
        'Una inyección SQL contra la app no puede hacer DROP TABLE si ese rol no tiene permisos de esquema',
        'Para que las migraciones corran más rápido',
        'Porque Postgres lo exige',
        'Para poder auditar quién hizo cada consulta',
      ],
      correcta: 0,
      porQue: 'Es una segunda línea de defensa que sigue en pie cuando la primera —la validación de entrada— falla, y cuesta cinco minutos de configuración.',
      porQueNo: {
        1: 'La velocidad no cambia por el rol.',
        2: 'Postgres permite usar un solo rol; es una decisión de diseño.',
        3: 'La auditoría se resuelve con logging, no con la separación de roles.',
      },
    },
    {
      p: '¿Cuál es la mejora de seguridad más barata en un contenedor?',
      opciones: [
        'Agregar USER al Dockerfile: por defecto corre como root',
        'Cambiar el puerto expuesto',
        'Usar una red bridge personalizada',
        'Aumentar el límite de memoria',
      ],
      correcta: 0,
      porQue: 'Como root, una ejecución remota de código adentro arranca con el máximo privilegio y escapar es mucho más fácil. Es una línea y no rompe casi nada.',
      porQueNo: {
        1: 'Cambiar el puerto es ofuscación, no seguridad.',
        2: 'Ayuda al aislamiento entre contenedores, pero no al privilegio interno.',
        3: 'Es una medida de estabilidad, no de seguridad.',
      },
    },
    {
      p: '¿Por qué "denegar por defecto" y no "bloquear lo malo"?',
      opciones: [
        'Bloquear lo malo exige anticipar cada cosa mala; cualquier servicio nuevo queda expuesto sin que nadie lo decida',
        'Es más rápido de configurar',
        'Consume menos recursos del firewall',
        'Es lo que exigen las certificaciones',
      ],
      correcta: 0,
      porQue: 'Con denegar por defecto, exponer algo requiere un acto explícito: alguien tiene que agregar la regla y, al agregarla, pensar si corresponde.',
      porQueNo: {
        1: 'Al principio requiere más trabajo, no menos.',
        2: 'La diferencia de rendimiento es despreciable.',
        3: 'Algunas lo piden, pero la razón es de diseño.',
      },
    },
    {
      p: '¿Qué se gana poniendo la base de datos en red privada si ya tiene contraseña?',
      opciones: [
        'Una segunda condición: además de la credencial hay que estar dentro de la red',
        'Mejor rendimiento de las consultas',
        'Respaldos automáticos',
        'Cifrado en reposo',
      ],
      correcta: 0,
      porQue: 'La contraseña puede filtrarse o reutilizarse. Sin ruta desde internet, el atacante necesita cumplir una condición más. Es defensa en profundidad.',
      porQueNo: {
        1: 'Puede mejorar la latencia, pero no es el motivo de seguridad.',
        2: 'Los respaldos son independientes de la topología de red.',
        3: 'El cifrado se configura aparte.',
      },
    },
    {
      p: '¿Qué es un subdominio huérfano y por qué es peligroso?',
      opciones: [
        'Un DNS que apunta a un recurso que ya no controlás: otro puede reclamarlo y servir contenido desde tu dominio',
        'Un subdominio sin certificado TLS',
        'Un subdominio que no aparece en el sitemap',
        'Un subdominio con demasiado tráfico',
      ],
      correcta: 0,
      porQue: 'Con cookies de sesión de dominio amplio eso es grave. Es uno de los dos problemas que más incidentes causan junto a los buckets públicos olvidados, y por el mismo motivo: nadie los mira.',
      porQueNo: {
        1: 'Es un problema distinto y menos grave.',
        2: 'Es una cuestión de SEO, no de seguridad.',
        3: 'El tráfico alto no lo convierte en un riesgo de este tipo.',
      },
    },
    {
      p: 'Dentro de un servidor, ¿qué diferencia hay entre revisar puertos con ss y escanear desde afuera?',
      opciones: [
        'ss muestra qué escucha en la máquina; el escaneo externo muestra qué es realmente alcanzable',
        'Son equivalentes',
        'El escaneo externo es menos confiable',
        'ss detecta más puertos siempre',
      ],
      correcta: 0,
      porQue: 'Un servicio escuchando solo en 127.0.0.1 aparece en ss y no en el escaneo externo — y eso está perfecto. Lo que importa para la superficie de ataque es lo alcanzable.',
      porQueNo: {
        1: 'Muestran cosas distintas: local versus alcanzable.',
        2: 'Es justamente el que refleja la exposición real.',
        3: 'Detecta más, pero incluye los que no son alcanzables desde afuera.',
      },
    },
    {
      p: '¿Por qué una réplica no es un respaldo?',
      opciones: [
        'Copia todo en tiempo real, incluido el DELETE equivocado: no te protege de un error, lo propaga',
        'Porque está en la misma región',
        'Porque no incluye los índices',
        'Porque se puede desincronizar',
      ],
      correcta: 0,
      porQue: 'Te protege de que se rompa un servidor, no de un error humano. Mucha gente cree que tiene respaldo porque tiene alta disponibilidad.',
      porQueNo: {
        1: 'Puede estar en otra región y el problema persiste.',
        2: 'Una réplica sí incluye los índices.',
        3: 'La desincronización es un problema distinto y menor.',
      },
    },
    {
      p: '¿Cuál es la forma más engañosa en que fallan los respaldos?',
      opciones: [
        'Que existan pero estén rotos: generan confianza falsa, peor que no tenerlos',
        'Que ocupen mucho espacio',
        'Que sean demasiado frecuentes',
        'Que estén cifrados',
      ],
      correcta: 0,
      porQue: 'El proceso viene fallando hace meses y nadie mira. Un volcado truncado parece un archivo normal hasta que intentás usarlo, es decir, hasta el peor momento posible.',
      porQueNo: {
        1: 'Es un costo, no un fallo de la estrategia.',
        2: 'Mayor frecuencia reduce la pérdida potencial.',
        3: 'El cifrado es una buena práctica, no un problema.',
      },
    },
    {
      p: '¿Qué descubre un ensayo de restauración que no descubre verificar que el respaldo existe?',
      opciones: [
        'Los pasos que faltaban —extensiones, permisos, secuencias— y el tiempo real de restauración',
        'Si el respaldo está cifrado',
        'Cuánto espacio ocupa',
        'Con qué frecuencia se genera',
      ],
      correcta: 0,
      porQue: 'Siempre aparece algo que solo estaba en la cabeza de alguien. Y el tiempo real casi siempre sorprende, porque nunca se midió. Descubrirlo un martes es infinitamente mejor que durante un incidente.',
      porQueNo: {
        1: 'Eso se verifica sin restaurar.',
        2: 'Es un dato del archivo, no del proceso.',
        3: 'Se ve en la configuración del respaldo.',
      },
    },
    {
      p: '¿Por qué no alcanza con alertar cuando el respaldo falla?',
      opciones: [
        'Un proceso que dejó de ejecutarse no falla: simplemente no aparece y no genera ninguna alerta',
        'Porque las alertas de fallo llegan tarde',
        'Porque el proveedor no las envía',
        'Porque generan demasiado ruido',
      ],
      correcta: 0,
      porQue: 'Hay que alertar por ausencia: "no hay respaldo nuevo hace más de 26 horas". Es un caso de alerta sobre algo que no ocurrió, no sobre algo que salió mal.',
      porQueNo: {
        1: 'Llegan a tiempo cuando efectivamente hay un fallo detectado.',
        2: 'Muchos proveedores sí las envían; el problema es el proceso que desaparece.',
        3: 'Es un tipo de alerta que sí requiere acción.',
      },
    },
    {
      p: '¿Cuál es el riesgo de cadena de suministro más subestimado?',
      opciones: [
        'Las acciones de CI de terceros: corren con acceso a los secretos de despliegue',
        'Las fuentes tipográficas externas',
        'Las imágenes de ejemplo en el README',
        'Los comentarios en las dependencias',
      ],
      correcta: 0,
      porQue: 'Si una acción se compromete, se lleva credenciales de despliegue, claves de API y tokens del repositorio sin tocar tu código.',
      porQueNo: {
        1: 'Es un riesgo de privacidad y rendimiento, mucho menor.',
        2: 'No se ejecutan en producción.',
        3: 'Los comentarios no se ejecutan.',
      },
    },
    {
      p: '¿Por qué fijar acciones de CI por hash de commit y no por etiqueta?',
      opciones: [
        'Una etiqueta es un puntero móvil: el autor puede reapuntarla a otro código y tu pipeline lo ejecuta',
        'Los hashes se resuelven más rápido',
        'Las etiquetas no funcionan en todos los proveedores',
        'Es un requisito de los repositorios privados',
      ],
      correcta: 0,
      porQue: 'Un hash de commit es inmutable. Con acceso a los secretos de despliegue, esa diferencia entre puntero móvil e inmutable es todo.',
      porQueNo: {
        1: 'La diferencia de velocidad es irrelevante.',
        2: 'Las etiquetas funcionan en todos lados; el problema es que se mueven.',
        3: 'No hay tal requisito.',
      },
    },
    {
      p: '¿Cómo se defiende un sistema con IA de prompt injection?',
      opciones: [
        'Herramientas peligrosas con confirmación humana, permisos acotados, y el tenant_id nunca elegido por el modelo',
        'Con un prompt de sistema más estricto',
        'Filtrando palabras clave del contenido de entrada',
        'Usando un modelo más grande',
      ],
      correcta: 0,
      porQue: 'El modelo no distingue de forma confiable entre instrucción y contenido. Si puede elegir el tenant_id, una instrucción inyectada en un documento puede pedir datos de otro tenant.',
      porQueNo: {
        1: 'Sigue siendo texto que el contenido inyectado puede contradecir.',
        2: 'Se evade con reformulaciones y otros idiomas.',
        3: 'Un modelo más capaz no elimina la ambigüedad estructural.',
      },
    },
  ],
});
