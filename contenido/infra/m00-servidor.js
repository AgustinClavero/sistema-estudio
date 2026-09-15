/* ==========================================================================
   Infra · Módulo 00 — Cómo funciona un servidor, de verdad
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'infra',
  id: 'm00',
  titulo: 'Cómo funciona un servidor, de verdad',
  fuentes: ['nodejs', 'mdn-http', 'cloudflare-dns', 'nginx', '12factor'],

  intro:
    '<p>Este es el módulo que casi todo el mundo saltea, y por eso después Docker, Kubernetes y la nube se ' +
    'sienten mágicos. No lo son: son capas sobre cosas muy concretas.</p>' +
    '<p>Acá vas a entender qué pasa realmente entre que alguien escribe tu dominio en el navegador y tu código ' +
    'devuelve una respuesta. Con eso, todo el resto del track deja de ser vocabulario y pasa a tener sentido.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Qué es un servidor y qué es un proceso',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un "servidor" no es una cosa especial. Es una
computadora prendida todo el tiempo, con un programa escuchando en una puerta numerada.</div>

<h4>La palabra significa dos cosas y conviene separarlas</h4>
<ul>
<li><b>El hardware</b> — una máquina en un centro de datos. No tiene teclado ni pantalla, y salvo eso es una computadora común.</li>
<li><b>El software</b> — el programa que atiende pedidos. Cuando corrés <code>pnpm dev</code>, tu computadora <i>es</i> un servidor.</li>
</ul>
<p>Cuando alguien dice "subilo al servidor", casi siempre habla de lo primero. Cuando dice "el servidor devolvió
un 500", habla de lo segundo.</p>

<h4>Proceso</h4>
<p>Un <b>proceso</b> es un programa <i>corriendo</i>. Tu aplicación de Node es un proceso; nginx es otro;
Postgres es otro. Cada uno tiene su propia memoria y no puede tocar la del vecino.</p>
<p>Tres cosas que hay que saber de los procesos, porque explican muchos problemas reales:</p>
<ul>
<li><b>Si el proceso muere, tu aplicación deja de responder.</b> Por eso hace falta algo que lo reinicie solo.</li>
<li><b>Si se queda sin memoria, el sistema operativo lo mata.</b> Sin aviso y sin explicación.</li>
<li><b>Node corre en un solo hilo.</b> Una operación pesada bloquea a todos los usuarios al mismo tiempo.</li>
</ul>

<h4>Puertos</h4>
<p>Una máquina tiene una dirección IP, pero puede correr muchos programas. El <b>puerto</b> es el número de
puerta que distingue a cada uno.</p>
<table>
<tr><th>Puerto</th><th>Quién suele estar ahí</th></tr>
<tr><td>22</td><td>SSH (para entrar a la máquina)</td></tr>
<tr><td>80</td><td>HTTP</td></tr>
<tr><td>443</td><td>HTTPS</td></tr>
<tr><td>3000 / 5173</td><td>Tu aplicación en desarrollo</td></tr>
<tr><td>5432</td><td>Postgres</td></tr>
</table>

<div class="aviso"><strong>El error que todos ven alguna vez:</strong> <code>EADDRINUSE: address already in
use :::3000</code>. Significa que <b>ya hay otro proceso escuchando en ese puerto</b>. Dos programas no pueden
compartir una puerta. Casi siempre es una instancia anterior que quedó viva.</div>
`,

      tecnico: `
<h4>Anatomía de un proceso</h4>
<ul>
<li><b>PID</b> — identificador del proceso. Con él lo mirás o lo matás.</li>
<li><b>Memoria</b> — espacio propio y aislado. Los procesos no comparten memoria salvo que se lo pidas al sistema explícitamente.</li>
<li><b>Descriptores de archivo</b> — todo lo abierto: archivos, sockets, conexiones. Hay un límite por proceso, y agotarlo produce <code>EMFILE: too many open files</code>.</li>
<li><b>Señales</b> — mensajes del sistema. <code>SIGTERM</code> pide terminar de forma ordenada; <code>SIGKILL</code> mata sin posibilidad de reaccionar.</li>
</ul>

<div class="dato"><strong>Apagado ordenado (<i>graceful shutdown</i>):</strong> cuando desplegás, el
orquestador manda <code>SIGTERM</code> y espera unos segundos antes de mandar <code>SIGKILL</code>. Si tu
aplicación no escucha esa señal, las peticiones en curso <b>se cortan a la mitad</b> y las conexiones a la base
quedan colgadas. Manejarlo son diez líneas y evita errores intermitentes en cada deploy — que son de los más
difíciles de diagnosticar porque no se reproducen.</div>

<h4>El modelo de concurrencia de Node</h4>
<p>Node ejecuta tu JavaScript en <b>un solo hilo</b>, con un bucle de eventos. Las operaciones de entrada/salida
—red, disco, base de datos— son asíncronas y no bloquean. Pero el <b>cómputo sí bloquea</b>: mientras una
función pesada corre, ningún otro usuario recibe respuesta.</p>
<pre><code>// ❌ Bloquea el bucle de eventos: TODOS los usuarios esperan
app.get('/informe', (req, res) =&gt; {
  const r = calculoPesadoSincrono(datos);   // 3 segundos de CPU
  res.json(r);
});

// ✅ Fuera del hilo principal
app.get('/informe', async (req, res) =&gt; {
  const r = await worker.run(datos);        // worker thread o cola
  res.json(r);
});</code></pre>
<p>Para aprovechar varios núcleos se corren <b>varios procesos</b> —con el módulo <code>cluster</code>, con PM2
o con réplicas en un contenedor— y un balanceador reparte. Es la razón práctica por la que "una instancia más
grande" muchas veces no ayuda tanto como "más instancias".</p>

<h4>Recursos y sus límites</h4>
<table>
<tr><th>Recurso</th><th>Qué pasa al agotarse</th><th>Síntoma</th></tr>
<tr><td>CPU</td><td>Todo se hace más lento</td><td>Latencia alta, sin errores</td></tr>
<tr><td>Memoria</td><td>El sistema mata el proceso</td><td>Reinicios sin log, <i>OOMKilled</i></td></tr>
<tr><td>Descriptores</td><td>No se pueden abrir más conexiones</td><td><code>EMFILE</code></td></tr>
<tr><td>Conexiones a la base</td><td>Se agota el pool</td><td>Timeouts al consultar</td></tr>
<tr><td>Disco</td><td>No se puede escribir</td><td>Fallos raros; los logs dejan de escribirse</td></tr>
</table>
<p>La fila de la memoria es la más traicionera: el proceso desaparece <b>sin dejar rastro en tus logs</b>,
porque lo mató el sistema operativo. Si ves reinicios sin explicación, esa es la primera hipótesis.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    UNA MÁQUINA, UNA IP, MUCHAS PUERTAS</text>

  <rect x="24" y="38" width="632" height="150" rx="12" fill="currentColor" fill-opacity=".04" stroke="currentColor" stroke-opacity=".3" stroke-width="1.4"/>
  <text x="44" y="62" fill="currentColor" opacity=".8" font-size="12" font-weight="700">servidor  ·  198.51.100.7</text>
  <text x="44" y="79" fill="currentColor" opacity=".5" font-size="10.5">una computadora prendida todo el tiempo, sin teclado ni pantalla</text>

  <rect x="44" y="92" width="130" height="76" rx="9" fill="#7c5cff" fill-opacity=".18" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="109" y="114" text-anchor="middle" fill="#7c5cff" font-size="11" font-weight="700">:443</text>
  <text x="109" y="132" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">nginx</text>
  <text x="109" y="148" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9.5">proceso · PID 812</text>
  <text x="109" y="162" text-anchor="middle" fill="currentColor" opacity=".4" font-size="9">memoria propia</text>

  <rect x="186" y="92" width="130" height="76" rx="9" fill="#34d399" fill-opacity=".18" stroke="#34d399" stroke-width="1.3"/>
  <text x="251" y="114" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700">:3000</text>
  <text x="251" y="132" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">tu app Node</text>
  <text x="251" y="148" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9.5">proceso · PID 1043</text>
  <text x="251" y="162" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">UN SOLO HILO</text>

  <rect x="328" y="92" width="130" height="76" rx="9" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="393" y="114" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="700">:5432</text>
  <text x="393" y="132" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">Postgres</text>
  <text x="393" y="148" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9.5">proceso · PID 640</text>

  <rect x="470" y="92" width="130" height="76" rx="9" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="535" y="114" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">:22</text>
  <text x="535" y="132" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10">sshd</text>
  <text x="535" y="148" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9.5">proceso · PID 501</text>

  <text x="24" y="208" fill="#f87171" font-size="11" font-weight="700">
    Dos programas NO pueden compartir una puerta → EADDRINUSE</text>

  <line x1="24" y1="228" x2="656" y2="228" stroke="currentColor" opacity=".18"/>

  <text x="24" y="252" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    NODE: UN HILO — el cómputo pesado bloquea a TODOS</text>

  <rect x="24" y="264" width="304" height="118" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="286" fill="#f87171" font-size="11" font-weight="700">✗ cálculo pesado en el request</text>
  <rect x="44" y="298" width="264" height="18" rx="4" fill="#f87171" fill-opacity=".7"/>
  <text x="176" y="311" text-anchor="middle" fill="#3b0a0a" font-size="9.5" font-weight="700">usuario A — 3 segundos de CPU</text>
  <rect x="44" y="322" width="264" height="14" rx="4" fill="currentColor" fill-opacity=".12"/>
  <text x="176" y="333" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9">usuario B — esperando</text>
  <rect x="44" y="342" width="264" height="14" rx="4" fill="currentColor" fill-opacity=".12"/>
  <text x="176" y="353" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9">usuario C — esperando</text>
  <text x="176" y="374" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">un solo hilo: nadie avanza</text>

  <rect x="352" y="264" width="304" height="118" rx="10" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.4"/>
  <text x="372" y="286" fill="#34d399" font-size="11" font-weight="700">✓ worker o cola</text>
  <rect x="372" y="298" width="70" height="18" rx="4" fill="#34d399" fill-opacity=".7"/>
  <text x="407" y="311" text-anchor="middle" fill="#06281c" font-size="9" font-weight="700">A · encola</text>
  <rect x="372" y="322" width="70" height="14" rx="4" fill="#34d399" fill-opacity=".5"/>
  <text x="407" y="333" text-anchor="middle" fill="currentColor" font-size="9">B · responde</text>
  <rect x="372" y="342" width="70" height="14" rx="4" fill="#34d399" fill-opacity=".5"/>
  <text x="407" y="353" text-anchor="middle" fill="currentColor" font-size="9">C · responde</text>
  <rect x="456" y="298" width="184" height="58" rx="6" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.1" stroke-dasharray="3 3"/>
  <text x="548" y="322" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="700">el cálculo pesado</text>
  <text x="548" y="338" text-anchor="middle" fill="currentColor" opacity=".6" font-size="9.5">corre aparte</text>
  <text x="514" y="374" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700">el hilo principal sigue atendiendo</text>
</svg>`,
        pie: 'Un servidor es una máquina con procesos escuchando en puertos. Todo el resto del track son capas sobre esto.',
      },

      entrevista: [
        { p: '¿Por qué un cálculo pesado en Node afecta a todos los usuarios?',
          r: 'Porque Node ejecuta el JavaScript en <b>un solo hilo</b>, con un bucle de eventos. Las operaciones de entrada/salida —red, disco, base ' +
             'de datos— son asíncronas y no bloquean, pero el <b>cómputo sí</b>: mientras una función pesada corre, el bucle no puede atender ningún ' +
             'otro evento, así que todos los usuarios esperan. La solución es sacarlo del hilo principal: un <i>worker thread</i> o directamente una ' +
             'cola con un proceso aparte. Y para aprovechar varios núcleos se corren varios procesos, no un proceso más grande.' },

        { p: 'Tu aplicación se reinicia sola y no hay nada en los logs. ¿Qué sospechás?',
          r: 'Que se está quedando <b>sin memoria</b> y el sistema operativo la está matando. Cuando el kernel mata un proceso por memoria —el ' +
             '<i>OOM killer</i>— no hay oportunidad de escribir un log: el proceso desaparece. En un contenedor aparece como <code>OOMKilled</code> ' +
             'y en el host queda registro en el log del kernel. Es la primera hipótesis ante reinicios sin explicación, y lo confirmás mirando el ' +
             'uso de memoria justo antes del reinicio.' },

        { p: '¿Qué es un apagado ordenado y por qué importa?',
          r: 'Cuando desplegás, el orquestador manda <code>SIGTERM</code> y espera unos segundos antes de <code>SIGKILL</code>. Si tu aplicación ' +
             'no escucha esa señal, <b>las peticiones en curso se cortan a la mitad</b> y las conexiones a la base quedan colgadas. Manejarlo es ' +
             'dejar de aceptar conexiones nuevas, terminar las que están en curso y cerrar el pool. Son diez líneas y evitan errores intermitentes ' +
             'en cada deploy, que son de los más difíciles de diagnosticar porque no se reproducen a demanda.' },
      ],

      practica: `
<h4>Apagado ordenado</h4>
<pre><code>const servidor = app.listen(3000);

async function apagar(senal) {
  console.log(\`Recibí \${senal}, cerrando ordenadamente…\`);

  // 1 · dejar de aceptar conexiones nuevas, terminar las en curso
  servidor.close(async () =&gt; {
    // 2 · cerrar recursos externos
    await pool.end();
    await redis.quit();
    process.exit(0);
  });

  // 3 · red de seguridad: si algo se traba, salir igual
  setTimeout(() =&gt; process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () =&gt; apagar('SIGTERM'));
process.on('SIGINT',  () =&gt; apagar('SIGINT'));</code></pre>

<div class="aviso"><strong>Ese <code>setTimeout</code> final no es opcional.</strong> Si una petición se queda
colgada, sin él tu proceso nunca termina y el orquestador lo mata con <code>SIGKILL</code> igual — pero después
de esperar el timeout completo, alargando cada deploy.</div>

<h4>Comandos que resuelven el 80% de los problemas</h4>
<pre><code># ¿Quién está usando el puerto 3000?
lsof -i :3000            # Linux / macOS
netstat -ano | findstr :3000    # Windows

# ¿Qué está consumiendo CPU y memoria?
top          # o htop, más legible

# ¿Cuánta memoria queda?
free -h

# ¿Se llenó el disco?  (causa de fallos rarísimos)
df -h

# ¿Por qué murió el proceso?  ← acá aparece el OOM killer
dmesg | tail -50
journalctl -u mi-servicio -n 100</code></pre>

<h4>Síntoma → causa probable</h4>
<table>
<tr><th>Síntoma</th><th>Primera hipótesis</th></tr>
<tr><td>Reinicios sin log</td><td>Sin memoria: el sistema lo mató</td></tr>
<tr><td>Latencia alta sin errores</td><td>CPU saturada o pool de conexiones agotado</td></tr>
<tr><td><code>EADDRINUSE</code></td><td>Una instancia anterior quedó viva</td></tr>
<tr><td><code>EMFILE</code></td><td>Fuga de descriptores: conexiones que no se cierran</td></tr>
<tr><td>Errores intermitentes al desplegar</td><td>Falta apagado ordenado</td></tr>
<tr><td>Fallos raros y logs que se cortan</td><td>Disco lleno</td></tr>
</table>
`,

      errores: [
        { mito: 'Un servidor es una máquina especial.',
          realidad: 'Es una computadora común, prendida todo el tiempo, sin teclado ni pantalla. Lo que la hace un servidor es que tiene procesos ' +
                    '<b>escuchando en puertos</b>. Cuando corrés <code>pnpm dev</code>, tu máquina es un servidor.' },

        { mito: 'Si necesito más capacidad, agrando la máquina.',
          realidad: 'Con Node muchas veces no ayuda tanto como parece, porque <b>un proceso usa un solo núcleo</b>. Duplicar los núcleos sin correr ' +
                    'más procesos no duplica nada. Lo que escala es <b>más procesos o más instancias</b>, con un balanceador repartiendo.' },

        { mito: 'Si el proceso muere, alguien se entera.',
          realidad: 'Si lo mató el sistema por falta de memoria, <b>no hay log de tu aplicación</b>: desaparece sin escribir nada. ' +
                    'Por eso hace falta algo que lo reinicie automáticamente y alertas basadas en salud, no en los logs de la app.' },

        { mito: 'El apagado ordenado es un detalle de prolijidad.',
          realidad: 'Sin él, cada deploy corta peticiones a la mitad y deja conexiones colgadas. Produce <b>errores intermitentes</b> que no se ' +
                    'reproducen a demanda y que se persiguen durante días. Son diez líneas.' },
      ],

      glosario: [
        { t: 'Proceso', d: 'Un programa en ejecución, con su propia memoria aislada.' },
        { t: 'PID', d: 'Identificador numérico de un proceso.' },
        { t: 'Puerto', d: 'Número que distingue a cada programa que escucha en una misma IP.' },
        { t: 'Bucle de eventos', d: 'Mecanismo de Node que atiende operaciones asíncronas en un solo hilo.' },
        { t: 'SIGTERM', d: 'Señal que pide a un proceso terminar de forma ordenada.' },
        { t: 'SIGKILL', d: 'Señal que mata un proceso de inmediato, sin posibilidad de reaccionar.' },
        { t: 'Graceful shutdown', d: 'Terminar las peticiones en curso y cerrar recursos antes de salir.' },
        { t: 'OOM killer', d: 'Mecanismo del kernel que mata procesos cuando se agota la memoria. No deja log en tu aplicación.' },
        { t: 'Descriptor de archivo', d: 'Referencia a algo abierto: archivo, socket o conexión. Su límite produce EMFILE.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'DNS: de un nombre a una máquina',
      minutos: 8,
      fuentes: ['cloudflare-dns'],

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> el DNS es la <b>agenda de contactos de
internet</b>. Vos escribís un nombre; el sistema devuelve un número.</div>

<p>Las computadoras se encuentran por dirección IP —<code>198.51.100.7</code>—, pero nadie recuerda números.
El <b>DNS</b> traduce nombres a IPs.</p>

<h4>Qué pasa cuando escribís un dominio</h4>
<ol>
<li>El navegador mira su <b>caché</b>. Si lo resolvió hace poco, listo.</li>
<li>Le pregunta al <b>resolver</b> —el de tu proveedor de internet, o uno público como 1.1.1.1—.</li>
<li>Si no lo sabe, el resolver pregunta hacia arriba: primero quién maneja <code>.com</code>, después quién maneja <code>tudominio.com</code>.</li>
<li>Llega al <b>servidor autoritativo</b>, que tiene la respuesta real.</li>
<li>La respuesta vuelve y se <b>cachea</b> por un tiempo (el TTL).</li>
</ol>

<h4>Los registros que vas a usar</h4>
<table>
<tr><th>Tipo</th><th>Para qué</th><th>Ejemplo</th></tr>
<tr><td><b>A</b></td><td>Nombre → IPv4</td><td><code>tudominio.com → 198.51.100.7</code></td></tr>
<tr><td><b>AAAA</b></td><td>Nombre → IPv6</td><td>igual, con IPv6</td></tr>
<tr><td><b>CNAME</b></td><td>Nombre → otro nombre</td><td><code>www → tudominio.com</code></td></tr>
<tr><td><b>MX</b></td><td>A dónde van los emails</td><td>servidor de correo</td></tr>
<tr><td><b>TXT</b></td><td>Texto libre</td><td>SPF, DKIM, verificaciones</td></tr>
<tr><td><b>NS</b></td><td>Quién manda en este dominio</td><td>servidores de nombres</td></tr>
</table>

<div class="aviso"><strong>El TTL es lo que explica "cambié el DNS y no anda".</strong> El TTL dice cuántos
segundos puede cachearse una respuesta. Si tenés TTL de 24 horas y cambiás la IP, hay gente que va a seguir
yendo a la vieja <b>durante un día entero</b>.<br><br>
<b>La técnica:</b> antes de una migración, bajá el TTL a 300 segundos y esperá el TTL viejo. Después migrás, y
cuando esté estable lo volvés a subir. <b>Esto se planifica con días de anticipación</b>, y quien no lo sabe
descubre el problema en el peor momento.</div>
`,

      tecnico: `
<h4>La jerarquía</h4>
<pre><code>       .              raíz (13 grupos de servidores en el mundo)
       ↓
      com             TLD — quién maneja los .com
       ↓
 tudominio.com        autoritativo — tu proveedor de DNS
       ↓
api.tudominio.com     el registro que buscabas</code></pre>
<p>Cada nivel solo sabe a quién preguntarle después. Solo el autoritativo tiene la respuesta real.</p>

<h4>CNAME: la restricción que sorprende</h4>
<p>Un <code>CNAME</code> <b>no puede coexistir</b> con otros registros en el mismo nombre. Eso significa que en
el dominio raíz —<code>tudominio.com</code>, sin <code>www</code>— no podés usar CNAME, porque ahí ya viven los
registros <code>NS</code> y <code>SOA</code>.</p>
<p>Es un problema real cuando tu proveedor te da un nombre en vez de una IP. Las soluciones:</p>
<ul>
<li><b>ALIAS o ANAME</b> — registros no estándar que varios proveedores implementan y que se comportan como un CNAME en la raíz.</li>
<li><b>CNAME flattening</b> — lo mismo, resuelto del lado del proveedor (Cloudflare lo hace).</li>
<li>Redirigir la raíz a <code>www</code> y poner el CNAME ahí.</li>
</ul>

<div class="dato"><strong>Propagación:</strong> el DNS no "se propaga" como una onda — <b>expira</b>. No hay
nada empujando el cambio: simplemente cada caché tiene su propio vencimiento. Por eso el TTL <i>anterior</i> es
el que manda: si estaba en 24 horas, bajarlo ahora no acelera nada para quien ya tiene la respuesta vieja
cacheada. Entender esto cambia por completo cómo se planifica una migración.</div>

<h4>Salud y balanceo por DNS</h4>
<p>Un nombre puede resolver a varias IPs (round-robin). Es la forma más simple de balancear, y tiene un
problema serio: <b>el DNS no sabe si un servidor está caído</b>. Va a seguir devolviendo esa IP hasta que
alguien cambie el registro, y ese cambio tarda lo que diga el TTL.</p>
<p>Por eso el balanceo real se hace en una capa que sí conoce el estado —un balanceador de carga, o un proveedor
de DNS con chequeos de salud— y el DNS round-robin se deja para casos simples.</p>

<h4>Diagnóstico</h4>
<pre><code># ¿A qué resuelve, y desde dónde?
dig tudominio.com
dig @1.1.1.1 tudominio.com        # forzando un resolver público

# ¿Cuál es el TTL actual?          ← el dato que importa antes de migrar
dig tudominio.com | grep -A1 'ANSWER SECTION'

# ¿Quién es el autoritativo?
dig NS tudominio.com

# Seguir la cadena completa desde la raíz
dig +trace tudominio.com</code></pre>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="dn1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LA CADENA — cada nivel solo sabe a quién preguntarle después</text>

  <rect x="24" y="38" width="120" height="42" rx="9" fill="#7c5cff" fill-opacity=".18" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="84" y="63" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">navegador</text>

  <line x1="148" y1="59" x2="168" y2="59" stroke="currentColor" stroke-width="1.3" marker-end="url(#dn1)"/>

  <rect x="172" y="38" width="120" height="42" rx="9" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="232" y="57" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="700">resolver</text>
  <text x="232" y="71" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9">1.1.1.1 · tu ISP</text>

  <line x1="296" y1="59" x2="316" y2="59" stroke="currentColor" stroke-width="1.3" marker-end="url(#dn1)"/>

  <rect x="320" y="38" width="100" height="42" rx="9" fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-opacity=".3" stroke-width="1.2"/>
  <text x="370" y="57" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5" font-weight="700">raíz  ·  “.”</text>
  <text x="370" y="71" text-anchor="middle" fill="currentColor" opacity=".45" font-size="9">“preguntá a .com”</text>

  <line x1="424" y1="59" x2="444" y2="59" stroke="currentColor" stroke-width="1.3" marker-end="url(#dn1)"/>

  <rect x="448" y="38" width="90" height="42" rx="9" fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-opacity=".3" stroke-width="1.2"/>
  <text x="493" y="57" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5" font-weight="700">.com</text>
  <text x="493" y="71" text-anchor="middle" fill="currentColor" opacity=".45" font-size="9">“preguntá acá”</text>

  <line x1="542" y1="59" x2="558" y2="59" stroke="currentColor" stroke-width="1.3" marker-end="url(#dn1)"/>

  <rect x="562" y="38" width="94" height="42" rx="9" fill="#34d399" fill-opacity=".22" stroke="#34d399" stroke-width="1.4"/>
  <text x="609" y="57" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">autoritativo</text>
  <text x="609" y="71" text-anchor="middle" fill="#34d399" font-size="9" font-weight="700">198.51.100.7</text>

  <path d="M 609 84 q 0 26 -262 26 q -263 0 -263 -26" fill="none" stroke="#34d399" stroke-width="1.4" stroke-dasharray="4 3" marker-end="url(#dn1)"/>
  <text x="340" y="126" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">
    la respuesta vuelve y se CACHEA durante el TTL</text>

  <line x1="24" y1="148" x2="656" y2="148" stroke="currentColor" opacity=".18"/>

  <text x="24" y="172" fill="#f87171" font-size="12" font-weight="700">
    EL TTL — por qué “cambié el DNS y no anda”</text>

  <rect x="24" y="184" width="632" height="76" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="206" fill="currentColor" opacity=".75" font-size="11">
    El DNS no “se propaga” como una onda: <tspan font-weight="700" fill="#f87171">EXPIRA</tspan>. Nada empuja el cambio.</text>
  <text x="44" y="228" fill="currentColor" opacity=".75" font-size="11">
    Cada caché tiene su vencimiento. Con TTL de 24 h, hay gente yendo a la IP vieja durante un día entero.</text>
  <text x="44" y="250" fill="#f87171" font-size="11" font-weight="700">
    Y el TTL que manda es el ANTERIOR: bajarlo ahora no acelera nada para quien ya cacheó.</text>

  <text x="24" y="288" fill="#34d399" font-size="12" font-weight="700">
    LA TÉCNICA — se planifica con días de anticipación</text>

  <rect x="24" y="300" width="150" height="52" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="99" y="320" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">1 · bajar TTL a 300</text>
  <text x="99" y="338" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">días antes</text>

  <text x="182" y="330" fill="currentColor" opacity=".4" font-size="14">→</text>

  <rect x="202" y="300" width="150" height="52" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="277" y="320" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">2 · esperar el TTL viejo</text>
  <text x="277" y="338" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">24 h si estaba en 24 h</text>

  <text x="360" y="330" fill="currentColor" opacity=".4" font-size="14">→</text>

  <rect x="380" y="300" width="130" height="52" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="445" y="320" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">3 · migrar</text>
  <text x="445" y="338" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">se propaga en 5 min</text>

  <text x="518" y="330" fill="currentColor" opacity=".4" font-size="14">→</text>

  <rect x="538" y="300" width="118" height="52" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-width="1.3"/>
  <text x="597" y="320" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700">4 · subir el TTL</text>
  <text x="597" y="338" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">ya estable</text>

  <text x="24" y="376" fill="#fbbf24" font-size="11" font-weight="700">
    Bonus: un CNAME no puede convivir con otros registros → no se puede usar en el dominio raíz.</text>
  <text x="24" y="392" fill="currentColor" opacity=".55" font-size="10.5">
    Soluciones: ALIAS/ANAME, CNAME flattening, o redirigir la raíz a www.</text>
</svg>`,
        pie: 'El DNS no se propaga: expira. Esa distinción es la que decide si una migración sale bien.',
      },

      entrevista: [
        { p: 'Cambiaste el DNS hace dos horas y algunos usuarios siguen yendo al servidor viejo. ¿Por qué?',
          r: 'Por el <b>TTL</b>. El DNS no se propaga como una onda: <b>expira</b>. Cada caché —el navegador, el resolver del ISP— conserva la ' +
             'respuesta anterior hasta que vence su TTL. Y lo importante es que manda el <b>TTL anterior</b>: si estaba en 24 horas, bajarlo ahora ' +
             'no acelera nada para quien ya cacheó. Por eso una migración se planifica con días de anticipación: primero se baja el TTL a 300 segundos, ' +
             'se espera el TTL viejo completo, después se migra, y al estabilizarse se vuelve a subir.' },

        { p: '¿Por qué no podés usar un CNAME en el dominio raíz?',
          r: 'Porque un CNAME <b>no puede coexistir con otros registros</b> en el mismo nombre, y en la raíz ya viven obligatoriamente los ' +
             'registros NS y SOA. Es un problema real cuando el proveedor te da un nombre en vez de una IP. Las salidas son <b>ALIAS o ANAME</b> — ' +
             'registros no estándar que varios proveedores implementan—, el <b>CNAME flattening</b> que hace Cloudflare, o redirigir la raíz a ' +
             '<code>www</code> y poner el CNAME ahí.' },

        { p: '¿Sirve el DNS para balancear carga?',
          r: 'Sirve en su forma más simple —un nombre que resuelve a varias IPs, round-robin— pero tiene una limitación seria: <b>el DNS no sabe si ' +
             'un servidor está caído</b>. Va a seguir devolviendo esa IP hasta que alguien cambie el registro, y ese cambio tarda lo que diga el TTL. ' +
             'Por eso el balanceo real se hace en una capa que conoce el estado de los servidores —un balanceador de carga, o un proveedor de DNS ' +
             'con chequeos de salud— y el round-robin se deja para casos donde la disponibilidad no es crítica.' },
      ],

      practica: `
<h4>Antes de una migración de DNS</h4>
<pre><code># 1 · ¿Cuál es el TTL actual? Este número define tu cronograma.
dig tudominio.com | grep -A1 'ANSWER SECTION'
# tudominio.com.  86400  IN  A  198.51.100.7
#                 ^^^^^ 86400 segundos = 24 horas de espera

# 2 · Bajalo a 300 y esperá el TTL viejo COMPLETO antes de migrar.

# 3 · Después de migrar, verificá desde varios resolvers
dig @1.1.1.1 tudominio.com +short
dig @8.8.8.8 tudominio.com +short
dig @208.67.222.222 tudominio.com +short</code></pre>

<div class="aviso"><strong>El error típico:</strong> bajar el TTL y migrar el mismo día. No sirve — quien ya
tenía la respuesta cacheada con el TTL viejo la va a conservar el tiempo viejo. <b>Hay que esperar el TTL
anterior completo</b> entre bajarlo y migrar.</div>

<h4>Registros de una configuración típica</h4>
<pre><code>tudominio.com.        A      198.51.100.7        # el sitio
www.tudominio.com.    CNAME  tudominio.com.      # www apunta a la raíz
api.tudominio.com.    A      198.51.100.8        # la API, en otra máquina
tudominio.com.        MX 10  mx.proveedor.com.   # el correo
tudominio.com.        TXT    "v=spf1 include:..." # SPF, para que no vayas a spam
_dmarc.tudominio.com. TXT    "v=DMARC1; p=none"   # DMARC</code></pre>

<h4>Diagnóstico ordenado</h4>
<table>
<tr><th>Síntoma</th><th>Qué correr</th></tr>
<tr><td>"No resuelve"</td><td><code>dig +trace tudominio.com</code> — ver dónde se corta la cadena</td></tr>
<tr><td>"Resuelve a la IP vieja"</td><td>Mirar el TTL y probar contra otro resolver</td></tr>
<tr><td>"Anda en mi máquina y no en otra"</td><td>Caché local: <code>ipconfig /flushdns</code> o el equivalente</td></tr>
<tr><td>"El mail va a spam"</td><td><code>dig TXT tudominio.com</code> — revisar SPF, DKIM y DMARC</td></tr>
<tr><td>"El certificado no se emite"</td><td>Casi siempre el DNS todavía no apunta bien: Let's Encrypt lo verifica por DNS o HTTP</td></tr>
</table>
`,

      errores: [
        { mito: 'El DNS se propaga.',
          realidad: 'El DNS <b>expira</b>. No hay nada empujando el cambio: cada caché conserva la respuesta hasta que vence su TTL. ' +
                    'La palabra "propagación" hace creer que hay un proceso en marcha que se puede acelerar, y no lo hay.' },

        { mito: 'Bajo el TTL y migro el mismo día.',
          realidad: 'No sirve: quien ya cacheó con el TTL viejo lo conserva el tiempo viejo. Hay que <b>bajar el TTL y esperar el TTL anterior ' +
                    'completo</b> antes de migrar. Si estaba en 24 horas, son 24 horas de espera.' },

        { mito: 'Un CNAME sirve para cualquier nombre.',
          realidad: 'No puede convivir con otros registros, y en la raíz ya están NS y SOA. En el dominio raíz hay que usar <b>ALIAS/ANAME</b>, ' +
                    'CNAME flattening, o redirigir a <code>www</code>.' },

        { mito: 'Con DNS round-robin tengo alta disponibilidad.',
          realidad: 'El DNS <b>no sabe si un servidor está caído</b>: sigue devolviendo esa IP hasta que alguien cambie el registro, ' +
                    'y ese cambio tarda lo que diga el TTL. Para disponibilidad real hace falta un balanceador con chequeos de salud.' },
      ],

      glosario: [
        { t: 'DNS', d: 'Sistema que traduce nombres de dominio a direcciones IP.' },
        { t: 'Resolver', d: 'Servidor que hace las consultas por vos y cachea las respuestas.' },
        { t: 'Autoritativo', d: 'El servidor que tiene la respuesta real para un dominio.' },
        { t: 'TTL', d: 'Segundos que una respuesta puede permanecer cacheada. Define el tiempo de una migración.' },
        { t: 'Registro A', d: 'Asocia un nombre a una dirección IPv4.' },
        { t: 'CNAME', d: 'Alias de un nombre a otro nombre. No puede convivir con otros registros.' },
        { t: 'ALIAS / ANAME', d: 'Registro no estándar que permite un comportamiento tipo CNAME en el dominio raíz.' },
        { t: 'Round-robin', d: 'Devolver varias IPs alternadamente. Balanceo simple, sin conocimiento de estado.' },
        { t: 'SPF / DKIM / DMARC', d: 'Registros TXT que autentican tu correo. Sin ellos, tus emails van a spam.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'HTTP y TLS: cómo viaja la información',
      minutos: 8,
      fuentes: ['mdn-http', 'web-dev-cache', 'letsencrypt'],

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> HTTP es el <b>idioma</b> en que el navegador y tu
servidor se hablan. TLS es el <b>sobre cerrado</b> que impide que alguien en el medio lo lea.</div>

<h4>Una petición HTTP, por dentro</h4>
<pre><code>GET /api/clientes?pagina=2 HTTP/1.1
Host: api.tudominio.com
Authorization: Bearer eyJ...
Accept: application/json

(cuerpo, si lo hay)</code></pre>
<p>Y la respuesta:</p>
<pre><code>HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60

{"clientes":[...]}</code></pre>
<p>Eso es todo: <b>texto con una estructura acordada</b>. Cuando ves "un endpoint", estás viendo esto.</p>

<h4>Los códigos que importan</h4>
<table>
<tr><th>Código</th><th>Significa</th><th>Ojo con</th></tr>
<tr><td><b>200</b></td><td>Salió bien</td><td></td></tr>
<tr><td><b>301 / 302</b></td><td>Se mudó (permanente / temporal)</td><td>El 301 lo cachea el navegador <b>para siempre</b></td></tr>
<tr><td><b>400</b></td><td>Mandaste algo mal</td><td>No reintentar: va a fallar igual</td></tr>
<tr><td><b>401</b></td><td>No sé quién sos</td><td>Falta autenticación</td></tr>
<tr><td><b>403</b></td><td>Sé quién sos y no podés</td><td>Es autorización, no autenticación</td></tr>
<tr><td><b>404</b></td><td>No existe</td><td></td></tr>
<tr><td><b>429</b></td><td>Demasiadas peticiones</td><td>Reintentar con backoff</td></tr>
<tr><td><b>500</b></td><td>Se rompió del lado del servidor</td><td>Es <b>tu</b> problema</td></tr>
<tr><td><b>502 / 504</b></td><td>El proxy no pudo hablar con tu app</td><td>Tu app está caída o tarda demasiado</td></tr>
</table>

<div class="aviso"><strong>La distinción 401 vs 403 se pregunta seguido:</strong> <b>401</b> es "no sé quién
sos" —falta o es inválido el token—. <b>403</b> es "sé perfectamente quién sos, y no tenés permiso". Devolver
401 cuando corresponde 403 hace que el cliente intente volver a autenticarse en un bucle infinito.</div>

<h4>TLS, en tres pasos</h4>
<ol>
<li>El navegador pide una conexión segura.</li>
<li>El servidor manda su <b>certificado</b>, firmado por una autoridad en la que el navegador confía.</li>
<li>Acuerdan una clave y todo lo que sigue viaja cifrado.</li>
</ol>
<p>El certificado hace dos cosas a la vez: <b>cifra</b> (nadie lee en el medio) y <b>identifica</b> (sos quien
decís ser). Lo segundo es lo que evita que alguien se haga pasar por tu sitio.</p>
`,

      tecnico: `
<h4>Versiones de HTTP</h4>
<table>
<tr><th>Versión</th><th>Aporte</th><th>Nota</th></tr>
<tr><td><b>HTTP/1.1</b></td><td>Conexiones persistentes</td><td>Una petición por conexión a la vez: el navegador abre 6 y hace cola</td></tr>
<tr><td><b>HTTP/2</b></td><td>Multiplexación sobre una conexión, headers comprimidos</td><td>Elimina la cola de la capa HTTP</td></tr>
<tr><td><b>HTTP/3</b></td><td>Sobre QUIC (UDP)</td><td>Elimina también el bloqueo de la capa TCP; mejor en redes con pérdida</td></tr>
</table>
<p>Consecuencia práctica: con HTTP/2 y HTTP/3, optimizaciones clásicas como concatenar todos los scripts en un
archivo <b>dejan de tener sentido</b> y pueden empeorar el cacheo.</p>

<h4>Cabeceras de caché</h4>
<pre><code>Cache-Control: public, max-age=31536000, immutable   # assets con hash en el nombre
Cache-Control: private, no-cache                     # HTML: revalidar siempre
Cache-Control: s-maxage=60, stale-while-revalidate=300
#              ↑ el CDN cachea 60 s        ↑ y sirve lo viejo 5 min más
#                                            mientras revalida en segundo plano</code></pre>

<div class="dato"><strong><code>stale-while-revalidate</code> es de las cabeceras más útiles y menos usadas.</strong>
Permite servir contenido levemente viejo <b>de inmediato</b> mientras se actualiza por detrás. El usuario nunca
espera y el origen recibe muchísimo menos tráfico. Es la base de cómo funcionan Vercel y Cloudflare con
contenido semi-dinámico.</div>

<h4>Cabeceras de seguridad</h4>
<table>
<tr><th>Cabecera</th><th>Qué evita</th></tr>
<tr><td><code>Strict-Transport-Security</code></td><td>Que alguien fuerce la conexión a HTTP sin cifrar</td></tr>
<tr><td><code>Content-Security-Policy</code></td><td>Ejecución de scripts no autorizados (XSS)</td></tr>
<tr><td><code>X-Content-Type-Options: nosniff</code></td><td>Que el navegador adivine el tipo de archivo</td></tr>
<tr><td><code>X-Frame-Options</code> / <code>frame-ancestors</code></td><td>Que tu sitio se embeba en un iframe ajeno (clickjacking)</td></tr>
<tr><td><code>Referrer-Policy</code></td><td>Fuga de URLs internas al navegar hacia afuera</td></tr>
</table>

<h4>CORS, que no es lo que parece</h4>
<p>CORS <b>no protege tu API</b>: es una restricción que aplica <b>el navegador</b> para impedir que una página
de otro origen lea tus respuestas. Un script fuera del navegador —curl, un backend, un bot— ignora CORS por
completo.</p>
<p>Consecuencia: si tu API necesita protección, va con <b>autenticación y autorización</b>. CORS solo evita que
el JavaScript de otro sitio use la sesión del usuario contra tu API.</p>

<h4>Certificados</h4>
<ul>
<li><b>Let's Encrypt</b> emite gratis, con validación automática por HTTP o DNS. Duran 90 días y se renuevan solos.</li>
<li>La renovación automática <b>hay que verificar que funcione</b>. Un certificado vencido tira el sitio entero, y suele pasar un domingo.</li>
<li><b>Wildcard</b> (<code>*.tudominio.com</code>) cubre todos los subdominios de un nivel, pero requiere validación por DNS.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="24" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    UNA PETICIÓN HTTP ES SOLO TEXTO CON ESTRUCTURA</text>

  <rect x="24" y="36" width="304" height="112" rx="10" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="44" y="58" fill="#22d3ee" font-size="11" font-weight="700">PETICIÓN</text>
  <text x="44" y="78" fill="currentColor" opacity=".75" font-size="10" font-family="monospace">GET /api/clientes?pagina=2 HTTP/1.1</text>
  <text x="44" y="94" fill="currentColor" opacity=".75" font-size="10" font-family="monospace">Host: api.tudominio.com</text>
  <text x="44" y="110" fill="currentColor" opacity=".75" font-size="10" font-family="monospace">Authorization: Bearer eyJ…</text>
  <text x="44" y="126" fill="currentColor" opacity=".75" font-size="10" font-family="monospace">Accept: application/json</text>
  <text x="44" y="142" fill="currentColor" opacity=".45" font-size="9.5">método · ruta · cabeceras · cuerpo</text>

  <rect x="352" y="36" width="304" height="112" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="372" y="58" fill="#34d399" font-size="11" font-weight="700">RESPUESTA</text>
  <text x="372" y="78" fill="currentColor" opacity=".75" font-size="10" font-family="monospace">HTTP/1.1 200 OK</text>
  <text x="372" y="94" fill="currentColor" opacity=".75" font-size="10" font-family="monospace">Content-Type: application/json</text>
  <text x="372" y="110" fill="currentColor" opacity=".75" font-size="10" font-family="monospace">Cache-Control: max-age=60</text>
  <text x="372" y="130" fill="currentColor" opacity=".75" font-size="10" font-family="monospace">{"clientes":[…]}</text>
  <text x="372" y="146" fill="currentColor" opacity=".45" font-size="9.5">código · cabeceras · cuerpo</text>

  <line x1="24" y1="168" x2="656" y2="168" stroke="currentColor" opacity=".18"/>

  <text x="24" y="192" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LOS CÓDIGOS QUE HAY QUE DISTINGUIR</text>

  <rect x="24" y="204" width="200" height="46" rx="9" fill="#fbbf24" fill-opacity=".16" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="124" y="223" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">401</text>
  <text x="124" y="240" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">“no sé quién sos”</text>

  <rect x="240" y="204" width="200" height="46" rx="9" fill="#f87171" fill-opacity=".16" stroke="#f87171" stroke-width="1.4"/>
  <text x="340" y="223" text-anchor="middle" fill="#f87171" font-size="12" font-weight="700">403</text>
  <text x="340" y="240" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">“sé quién sos y no podés”</text>

  <rect x="456" y="204" width="200" height="46" rx="9" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="556" y="223" text-anchor="middle" fill="#7c5cff" font-size="12" font-weight="700">502 / 504</text>
  <text x="556" y="240" text-anchor="middle" fill="currentColor" opacity=".7" font-size="10.5">el proxy no llegó a tu app</text>

  <text x="24" y="270" fill="currentColor" opacity=".55" font-size="10.5">
    Devolver 401 donde corresponde 403 hace que el cliente reintente autenticarse en un bucle infinito.</text>

  <line x1="24" y1="290" x2="656" y2="290" stroke="currentColor" opacity=".18"/>

  <text x="24" y="314" fill="#34d399" font-size="11.5" font-weight="700">
    LA CABECERA MÁS ÚTIL Y MENOS USADA</text>

  <rect x="24" y="326" width="632" height="62" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="44" y="348" fill="currentColor" opacity=".85" font-size="11" font-family="monospace">
    Cache-Control: s-maxage=60, stale-while-revalidate=300</text>
  <text x="44" y="368" fill="currentColor" opacity=".7" font-size="10.5">
    El CDN cachea 60 s. Después sirve lo viejo <tspan font-weight="700">de inmediato</tspan> durante 5 minutos más…</text>
  <text x="44" y="383" fill="#34d399" font-size="10.5" font-weight="700">
    …mientras revalida por detrás. El usuario nunca espera y tu origen recibe muchísimo menos tráfico.</text>
</svg>`,
        pie: 'HTTP es texto con estructura. Entender eso desmitifica la mitad del vocabulario de infraestructura.',
      },

      entrevista: [
        { p: '¿Cuál es la diferencia entre 401 y 403?',
          r: '<b>401 es autenticación</b>: "no sé quién sos" —falta el token o es inválido—. <b>403 es autorización</b>: "sé perfectamente quién sos ' +
             'y no tenés permiso para esto". La distinción importa en la práctica: si devolvés 401 cuando corresponde 403, el cliente va a intentar ' +
             'volver a autenticarse —refrescar el token, redirigir al login— en un <b>bucle infinito</b>, porque el problema no era la identidad.' },

        { p: '¿Qué significa un 502 o un 504?',
          r: 'Que hay un <b>proxy o balanceador</b> delante de tu aplicación y no pudo obtener una respuesta. <b>502</b> es que tu aplicación no ' +
             'respondió o respondió algo inválido —probablemente está caída o se reinició—. <b>504</b> es que tardó más que el timeout del proxy. ' +
             'La distinción es útil al diagnosticar: 502 apunta a que el proceso murió; 504, a que algo tarda demasiado — una consulta lenta, ' +
             'una llamada externa sin timeout.' },

        { p: '¿CORS protege tu API?',
          r: 'No, y es un malentendido muy extendido. CORS es una restricción que aplica <b>el navegador</b> para impedir que el JavaScript de otro ' +
             'origen lea tus respuestas. Cualquier cliente fuera del navegador —curl, un backend, un bot— lo ignora por completo. ' +
             'Lo que CORS evita es que un sitio ajeno use la sesión del usuario contra tu API desde el navegador. ' +
             '<b>La protección real de una API es autenticación y autorización</b>, no CORS.' },

        { p: '¿Qué es stale-while-revalidate?',
          r: 'Una directiva de <code>Cache-Control</code> que permite servir contenido levemente viejo <b>de inmediato</b> mientras se revalida en ' +
             'segundo plano. Con <code>s-maxage=60, stale-while-revalidate=300</code>, el CDN sirve desde caché 60 segundos; pasados esos, sigue ' +
             'sirviendo lo viejo al instante durante 5 minutos más mientras pide una versión nueva por detrás. ' +
             'El resultado es que <b>el usuario nunca espera</b> y el origen recibe muchísimo menos tráfico. Es la base de cómo manejan contenido ' +
             'semi-dinámico Vercel y Cloudflare.' },
      ],

      practica: `
<h4>Cabeceras que conviene tener siempre</h4>
<pre><code>// next.config.js
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options',    value: 'nosniff' },
      { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
    ],
  }];
}</code></pre>

<h4>Estrategia de caché por tipo de contenido</h4>
<table>
<tr><th>Contenido</th><th>Cache-Control</th><th>Por qué</th></tr>
<tr><td>Assets con hash (<code>app.a3f2.js</code>)</td><td><code>max-age=31536000, immutable</code></td><td>El nombre cambia si cambia el contenido: cachear un año</td></tr>
<tr><td>HTML</td><td><code>no-cache</code></td><td>Revalidar siempre, pero puede usar la copia si no cambió</td></tr>
<tr><td>API pública semi-estática</td><td><code>s-maxage=60, stale-while-revalidate=300</code></td><td>El CDN absorbe el tráfico</td></tr>
<tr><td>API con datos del usuario</td><td><code>private, no-store</code></td><td><b>Nunca</b> en un CDN compartido</td></tr>
</table>

<div class="aviso"><strong>Esa última fila es un incidente esperando ocurrir.</strong> Si una respuesta con
datos de un usuario se cachea en un CDN sin <code>private</code>, <b>el siguiente usuario recibe los datos del
anterior</b>. Es una de las filtraciones más comunes y más graves, y no genera ningún error: simplemente pasa.</div>

<h4>Diagnóstico con curl</h4>
<pre><code># Ver solo las cabeceras de respuesta
curl -I https://tudominio.com

# Ver todo el intercambio, incluido el handshake TLS
curl -v https://tudominio.com

# ¿Cuándo vence el certificado?   ← poné un recordatorio
echo | openssl s_client -connect tudominio.com:443 2&gt;/dev/null \\
  | openssl x509 -noout -dates

# Medir dónde se va el tiempo
curl -w "dns:%{time_namelookup} conexión:%{time_connect} tls:%{time_appconnect} total:%{time_total}\\n" \\
     -o /dev/null -s https://tudominio.com</code></pre>
<p>Ese último comando es muy útil: te dice si la lentitud está en el DNS, en la conexión, en el handshake TLS o
en tu aplicación.</p>
`,

      errores: [
        { mito: 'CORS protege mi API.',
          realidad: 'CORS es una restricción del <b>navegador</b>. Cualquier cliente fuera del navegador lo ignora. La protección real es ' +
                    '<b>autenticación y autorización</b>; CORS solo evita que el JavaScript de otro sitio use la sesión del usuario contra tu API.' },

        { mito: 'Un 301 se puede deshacer cambiando la configuración.',
          realidad: 'El 301 es <b>permanente</b> y los navegadores lo cachean de forma muy agresiva, a veces indefinidamente. Si no estás seguro, ' +
                    'usá <b>302</b>: es temporal y se puede revertir. Un 301 mal puesto puede perseguirte durante meses.' },

        { mito: 'Da igual devolver 401 o 403.',
          realidad: 'Un cliente que recibe 401 intenta <b>volver a autenticarse</b>: refrescar el token, redirigir al login. Si el problema era de ' +
                    'permisos, entra en un bucle infinito. La distinción es funcional, no cosmética.' },

        { mito: 'El certificado se renueva solo, no hay que preocuparse.',
          realidad: 'Se renueva solo <b>si el proceso de renovación funciona</b>, y eso hay que verificarlo. Un certificado vencido tira el sitio ' +
                    'entero y clásicamente pasa un domingo. Conviene una alerta con 20 días de anticipación.' },
      ],

      glosario: [
        { t: 'HTTP', d: 'Protocolo de texto con estructura para pedir y devolver recursos.' },
        { t: 'TLS', d: 'Capa de cifrado que también autentica la identidad del servidor. La S de HTTPS.' },
        { t: 'Certificado', d: 'Documento firmado que prueba la identidad de un dominio y permite cifrar.' },
        { t: 'Cache-Control', d: 'Cabecera que indica quién puede cachear una respuesta y por cuánto tiempo.' },
        { t: 'stale-while-revalidate', d: 'Servir contenido viejo de inmediato mientras se revalida en segundo plano.' },
        { t: 'CORS', d: 'Restricción del navegador sobre lecturas entre orígenes. No es un mecanismo de seguridad del servidor.' },
        { t: 'HSTS', d: 'Cabecera que obliga al navegador a usar HTTPS siempre para ese dominio.' },
        { t: 'CSP', d: 'Content Security Policy. Restringe qué scripts y recursos puede cargar la página.' },
        { t: 'HTTP/2', d: 'Versión que multiplexa varias peticiones sobre una sola conexión.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'El proxy inverso: la pieza que todos saltean',
      minutos: 8,
      fuentes: ['nginx', 'caddy'],

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un <b>proxy inverso</b> es el recepcionista de tu
servidor. Atiende a todo el mundo en la puerta y decide a qué oficina mandar cada visita.</div>

<p>Tu aplicación de Node escucha en el puerto 3000. Pero los navegadores van al 443. ¿Quién los conecta?
Un proxy inverso —nginx, Caddy, Traefik— o el balanceador de tu proveedor de nube.</p>

<h4>Qué hace, en concreto</h4>
<ul>
<li><b>Termina TLS.</b> Maneja el certificado, y le habla a tu app por HTTP simple dentro de la máquina. Tu código no sabe nada de certificados.</li>
<li><b>Enruta.</b> <code>/api</code> a un servicio, <code>/</code> a otro, <code>/admin</code> a un tercero.</li>
<li><b>Balancea.</b> Reparte entre varias instancias y saca de rotación las que no responden.</li>
<li><b>Sirve archivos estáticos.</b> Mucho más rápido que hacerlo desde Node.</li>
<li><b>Comprime, cachea y limita.</b> Gzip/Brotli, caché de respuestas, límite de peticiones por IP.</li>
<li><b>Protege.</b> Es la primera línea: timeouts, límite de tamaño, filtros.</li>
</ul>

<div class="aviso"><strong>Por qué esto importa aunque uses Vercel o Supabase:</strong> aunque no lo
configures vos, <b>ese proxy existe</b> y sus límites son tus límites. Cuando ves un 502, un 504 o "request
entity too large", casi siempre estás viendo al proxy, no a tu aplicación. Saber que está ahí cambia por
completo el diagnóstico.</div>

<h4>La IP real del cliente</h4>
<p>Con un proxy en el medio, tu aplicación ve <b>la IP del proxy</b>, no la del usuario. El proxy pone la
verdadera en una cabecera —<code>X-Forwarded-For</code>—, pero hay que configurar la app para que confíe en
ella.</p>
<p>Si no lo hacés y tenés límite de peticiones por IP, <b>todos los usuarios cuentan como uno solo</b>: o
bloqueás a todos, o a ninguno. Es un bug clásico y difícil de ver.</p>
`,

      tecnico: `
<h4>Configuración típica en nginx</h4>
<pre><code>server {
  listen 443 ssl http2;
  server_name tudominio.com;

  ssl_certificate     /etc/letsencrypt/live/tudominio.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

  # estáticos: nginx los sirve mucho mejor que Node
  location /_next/static/ {
    alias /app/.next/static/;
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  location / {
    proxy_pass http://127.0.0.1:3000;

    # sin esto tu app ve la IP del proxy, no la del usuario
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # necesario para streaming y SSE
    proxy_buffering off;
    proxy_read_timeout 300s;
  }
}</code></pre>

<div class="dato"><strong><code>proxy_buffering off</code> es el que rompe más despliegues de IA.</strong>
Con el buffering activado —el valor por defecto—, nginx <b>acumula toda la respuesta</b> antes de enviarla al
cliente. El streaming funciona perfecto en <code>localhost</code> y en producción llega todo junto al final,
sin ningún error. Es una falla silenciosa clásica.</div>

<h4>Confiar en las cabeceras del proxy</h4>
<pre><code>// Express
app.set('trust proxy', 1);   // confiar en 1 salto de proxy
// req.ip pasa a ser la IP real del usuario

// Sin esto:
// · el rate limiting por IP cuenta a TODOS como uno solo
// · los logs registran siempre la misma IP
// · las cookies "secure" pueden no marcarse bien</code></pre>
<p>El número indica cuántos proxies hay delante. Poner un valor mayor al real es un riesgo: un cliente podría
falsificar <code>X-Forwarded-For</code> y hacerse pasar por otra IP.</p>

<h4>Timeouts en cascada</h4>
<p>Cada capa tiene el suyo, y <b>el más chico gana</b>:</p>
<pre><code>navegador     ~300 s
   ↓
CDN            ~100 s
   ↓
proxy           ~60 s        ← acá suele estar el 504
   ↓
tu app          ~30 s
   ↓
base de datos   ~10 s</code></pre>
<p>Conviene que los timeouts <b>crezcan hacia afuera</b>: si tu app espera 30 segundos por una consulta pero el
proxy corta a los 60, está bien. Al revés —proxy a 30, app a 60— el usuario recibe un 504 mientras tu
aplicación sigue trabajando en algo que ya nadie va a ver, gastando recursos.</p>

<h4>Alternativas</h4>
<table>
<tr><th>Herramienta</th><th>Fuerte en</th></tr>
<tr><td><b>nginx</b></td><td>El estándar. Rapidísimo, configuración verbosa</td></tr>
<tr><td><b>Caddy</b></td><td>HTTPS automático con Let's Encrypt sin configurar nada. Ideal para empezar</td></tr>
<tr><td><b>Traefik</b></td><td>Descubre servicios de Docker automáticamente por etiquetas</td></tr>
<tr><td><b>Balanceador gestionado</b></td><td>AWS ALB, Cloudflare. No lo administrás, pero tampoco lo controlás fino</td></tr>
</table>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="px1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor" opacity=".45"/></marker></defs>

  <rect x="24" y="60" width="110" height="60" rx="9" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="79" y="86" text-anchor="middle" fill="currentColor" font-size="11" font-weight="700">navegador</text>
  <text x="79" y="104" text-anchor="middle" fill="currentColor" opacity=".55" font-size="9.5">:443 HTTPS</text>

  <line x1="138" y1="90" x2="166" y2="90" stroke="currentColor" stroke-width="1.4" marker-end="url(#px1)"/>

  <rect x="170" y="40" width="160" height="140" rx="11" fill="#7c5cff" fill-opacity=".16" stroke="#7c5cff" stroke-width="1.7"/>
  <text x="250" y="64" text-anchor="middle" fill="#7c5cff" font-size="12" font-weight="700">PROXY INVERSO</text>
  <text x="250" y="79" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9.5">nginx · Caddy · Traefik</text>
  <text x="186" y="100" fill="currentColor" opacity=".72" font-size="9.5">· termina TLS</text>
  <text x="186" y="116" fill="currentColor" opacity=".72" font-size="9.5">· enruta por path</text>
  <text x="186" y="132" fill="currentColor" opacity=".72" font-size="9.5">· balancea</text>
  <text x="186" y="148" fill="currentColor" opacity=".72" font-size="9.5">· sirve estáticos</text>
  <text x="186" y="164" fill="currentColor" opacity=".72" font-size="9.5">· comprime y limita</text>

  <line x1="334" y1="70" x2="366" y2="70" stroke="currentColor" stroke-width="1.3" marker-end="url(#px1)"/>
  <rect x="370" y="52" width="140" height="36" rx="8" fill="#34d399" fill-opacity=".18" stroke="#34d399" stroke-width="1.2"/>
  <text x="440" y="68" text-anchor="middle" fill="currentColor" font-size="10" font-weight="700">app Node  :3000</text>
  <text x="440" y="81" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9">HTTP simple, sin TLS</text>

  <line x1="334" y1="110" x2="366" y2="110" stroke="currentColor" stroke-width="1.3" marker-end="url(#px1)"/>
  <rect x="370" y="92" width="140" height="36" rx="8" fill="#34d399" fill-opacity=".14" stroke="#34d399" stroke-width="1.2"/>
  <text x="440" y="108" text-anchor="middle" fill="currentColor" font-size="10" font-weight="700">app Node  :3001</text>
  <text x="440" y="121" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9">otra instancia</text>

  <line x1="334" y1="150" x2="366" y2="150" stroke="currentColor" stroke-width="1.3" marker-end="url(#px1)"/>
  <rect x="370" y="132" width="140" height="36" rx="8" fill="#fbbf24" fill-opacity=".18" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="440" y="148" text-anchor="middle" fill="currentColor" font-size="10" font-weight="700">estáticos</text>
  <text x="440" y="161" text-anchor="middle" fill="currentColor" opacity=".5" font-size="9">servidos por nginx</text>

  <text x="530" y="90" fill="currentColor" opacity=".5" font-size="10">tu código nunca</text>
  <text x="530" y="105" fill="currentColor" opacity=".5" font-size="10">ve un certificado</text>

  <line x1="24" y1="200" x2="656" y2="200" stroke="currentColor" opacity=".18"/>

  <text x="24" y="224" fill="#f87171" font-size="11.5" font-weight="700">
    LOS DOS ERRORES QUE MÁS CUESTAN</text>

  <rect x="24" y="236" width="304" height="76" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="258" fill="#f87171" font-size="11" font-weight="700">1 · No confiar en X-Forwarded-For</text>
  <text x="44" y="278" fill="currentColor" opacity=".72" font-size="10.5">Tu app ve la IP del PROXY, no la del usuario.</text>
  <text x="44" y="296" fill="currentColor" opacity=".72" font-size="10.5">El rate limit por IP cuenta a todos como uno solo.</text>

  <rect x="352" y="236" width="304" height="76" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.3"/>
  <text x="372" y="258" fill="#f87171" font-size="11" font-weight="700">2 · proxy_buffering activado</text>
  <text x="372" y="278" fill="currentColor" opacity=".72" font-size="10.5">nginx acumula TODA la respuesta antes de enviarla.</text>
  <text x="372" y="296" fill="currentColor" opacity=".72" font-size="10.5">El streaming anda en local y llega junto en prod.</text>

  <text x="24" y="336" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    TIMEOUTS EN CASCADA — gana el más chico</text>

  <rect x="24" y="348" width="130" height="22" rx="5" fill="#22d3ee" fill-opacity=".2"/>
  <text x="89" y="363" text-anchor="middle" fill="currentColor" opacity=".75" font-size="9.5">navegador ~300 s</text>
  <rect x="162" y="348" width="120" height="22" rx="5" fill="#22d3ee" fill-opacity=".28"/>
  <text x="222" y="363" text-anchor="middle" fill="currentColor" opacity=".75" font-size="9.5">CDN ~100 s</text>
  <rect x="290" y="348" width="120" height="22" rx="5" fill="#7c5cff" fill-opacity=".3"/>
  <text x="350" y="363" text-anchor="middle" fill="#7c5cff" font-size="9.5" font-weight="700">proxy ~60 s</text>
  <rect x="418" y="348" width="110" height="22" rx="5" fill="#34d399" fill-opacity=".28"/>
  <text x="473" y="363" text-anchor="middle" fill="currentColor" opacity=".75" font-size="9.5">app ~30 s</text>
  <rect x="536" y="348" width="120" height="22" rx="5" fill="#fbbf24" fill-opacity=".28"/>
  <text x="596" y="363" text-anchor="middle" fill="currentColor" opacity=".75" font-size="9.5">base ~10 s</text>

  <text x="24" y="390" fill="currentColor" opacity=".55" font-size="10.5">
    Los timeouts crecen hacia afuera. Al revés, el usuario recibe un 504 mientras tu app sigue trabajando para nadie.</text>
</svg>`,
        pie: 'Aunque uses Vercel o Supabase, ese proxy existe — y sus límites son tus límites.',
      },

      entrevista: [
        { p: '¿Qué hace un proxy inverso y por qué se usa?',
          r: 'Se pone delante de tu aplicación y hace varias cosas que no querés que haga tu código: <b>termina TLS</b> —maneja el certificado y le ' +
             'habla a tu app por HTTP simple—, <b>enruta</b> por path hacia distintos servicios, <b>balancea</b> entre instancias sacando de rotación ' +
             'las que no responden, <b>sirve archivos estáticos</b> mucho más rápido que Node, y comprime, cachea y limita peticiones. ' +
             'Y aunque uses una plataforma gestionada, <b>ese proxy existe igual</b>: cuando ves un 502 o un 504, casi siempre lo estás viendo a él.' },

        { p: 'Tu rate limiting por IP bloquea a todos los usuarios a la vez. ¿Qué pasa?',
          r: 'Que la aplicación está viendo <b>la IP del proxy</b> en lugar de la del usuario, así que todo el tráfico cuenta como una sola IP. ' +
             'El proxy pone la real en <code>X-Forwarded-For</code>, pero hay que configurar la aplicación para que confíe en esa cabecera — ' +
             'en Express es <code>app.set(\'trust proxy\', 1)</code>. El número indica cuántos proxies hay delante, y conviene que sea exacto: ' +
             'si ponés un valor mayor al real, un cliente podría falsificar la cabecera y hacerse pasar por otra IP.' },

        { p: 'El streaming funciona en local y en producción llega todo junto. ¿Qué revisás?',
          r: 'El <b>buffering del proxy</b>. Por defecto nginx acumula toda la respuesta antes de enviarla al cliente, y eso anula el streaming ' +
             '<b>sin generar ningún error</b>: simplemente el usuario recibe todo al final. Se desactiva con <code>proxy_buffering off</code>, ' +
             'y además conviene mandar las cabeceras <code>X-Accel-Buffering: no</code> y <code>Cache-Control: no-transform</code> desde la ' +
             'aplicación. Es una falla silenciosa clásica y hay que verificarla <b>en el entorno desplegado</b>, no en local.' },

        { p: '¿Cómo ordenarías los timeouts de un sistema?',
          r: 'Que <b>crezcan hacia afuera</b>: la base de datos con el timeout más corto, después la aplicación, después el proxy, después el CDN. ' +
             'Si la aplicación espera 30 segundos por una consulta y el proxy corta a los 60, está bien. Al revés —proxy a 30, aplicación a 60— ' +
             'el usuario recibe un 504 mientras tu aplicación <b>sigue trabajando en algo que ya nadie va a ver</b>, ocupando una conexión a la base ' +
             'y un hilo. Es una fuente clásica de agotamiento del pool bajo carga.' },
      ],

      practica: `
<h4>El bloque de streaming, completo</h4>
<pre><code># nginx — para SSE o respuestas en streaming
location /api/chat {
  proxy_pass http://127.0.0.1:3000;

  proxy_buffering off;          # ← el que importa
  proxy_cache off;
  chunked_transfer_encoding on;
  proxy_read_timeout 300s;      # respuestas largas

  proxy_set_header Connection '';
  proxy_http_version 1.1;
}</code></pre>
<pre><code>// y desde la aplicación, por si hay un CDN en el medio
headers: {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  'X-Accel-Buffering': 'no',
}</code></pre>

<div class="aviso"><strong>Verificalo en producción, no en local.</strong> Es la falla más silenciosa del
módulo: no hay error, no hay warning, y la única diferencia es que el usuario espera treinta segundos mirando
nada en vez de ver la respuesta aparecer.</div>

<h4>Caddy: lo mismo, en cinco líneas</h4>
<pre><code>tudominio.com {
  reverse_proxy localhost:3000
}</code></pre>
<p>Eso es todo. Caddy consigue y renueva el certificado de Let's Encrypt <b>solo</b>, y pasa las cabeceras
correctas por defecto. Para un VPS propio es la forma más rápida de tener HTTPS bien configurado, y es una
recomendación razonable frente a nginx cuando no necesitás su configuración fina.</p>

<h4>Qué mirar cuando algo falla</h4>
<table>
<tr><th>Síntoma</th><th>Dónde mirar</th></tr>
<tr><td>502 Bad Gateway</td><td>Tu app está caída o no escucha en el puerto esperado</td></tr>
<tr><td>504 Gateway Timeout</td><td>Tu app tarda más que el timeout del proxy</td></tr>
<tr><td>413 Request Entity Too Large</td><td><code>client_max_body_size</code> en nginx</td></tr>
<tr><td>El streaming llega junto</td><td><code>proxy_buffering</code></td></tr>
<tr><td>Todos los logs con la misma IP</td><td>Falta <code>trust proxy</code> en la app</td></tr>
<tr><td>Bucle de redirecciones a HTTPS</td><td>Falta <code>X-Forwarded-Proto</code></td></tr>
</table>
<p>Esa última fila es un clásico: la app ve HTTP —porque el proxy le habla en HTTP—, redirige a HTTPS, el proxy
vuelve a entregarle en HTTP, y así infinitamente.</p>
`,

      errores: [
        { mito: 'Si uso Vercel o Supabase no necesito saber esto.',
          realidad: 'Ese proxy <b>existe igual</b> y sus límites son tus límites: tamaño máximo de petición, timeout, buffering. ' +
                    'Cuando ves un 502, un 504 o "request entity too large", estás viendo al proxy. Saber que está ahí cambia el diagnóstico.' },

        { mito: 'Mi app puede leer la IP del usuario directamente.',
          realidad: 'Con un proxy en el medio, ve <b>la IP del proxy</b>. Hay que confiar explícitamente en <code>X-Forwarded-For</code>. ' +
                    'Sin eso, el rate limiting por IP trata a todos los usuarios como uno solo y los logs son inútiles.' },

        { mito: 'El streaming anda porque lo probé en localhost.',
          realidad: 'En local no hay proxy. En producción, el <b>buffering</b> puede acumular toda la respuesta y entregarla junta ' +
                    '<b>sin ningún error</b>. Hay que verificarlo en el entorno desplegado.' },

        { mito: 'Los timeouts se ponen iguales en todas las capas.',
          realidad: 'Tienen que <b>crecer hacia afuera</b>. Si el proxy corta antes que tu aplicación, el usuario ve un 504 mientras tu app sigue ' +
                    'trabajando para nadie, ocupando una conexión a la base. Bajo carga, eso agota el pool.' },
      ],

      glosario: [
        { t: 'Proxy inverso', d: 'Servidor que recibe las peticiones y las reenvía a los servicios internos.' },
        { t: 'Terminación TLS', d: 'Manejar el certificado en el proxy y hablar HTTP simple hacia adentro.' },
        { t: 'X-Forwarded-For', d: 'Cabecera donde el proxy indica la IP real del cliente.' },
        { t: 'trust proxy', d: 'Configuración de la aplicación para confiar en las cabeceras del proxy.' },
        { t: 'proxy_buffering', d: 'Opción de nginx que acumula la respuesta antes de enviarla. Rompe el streaming.' },
        { t: 'Balanceador de carga', d: 'Componente que reparte peticiones entre varias instancias y descarta las caídas.' },
        { t: 'Caddy', d: 'Proxy inverso que gestiona HTTPS automáticamente. La opción más simple para un VPS.' },
        { t: 'Traefik', d: 'Proxy que descubre servicios de Docker automáticamente por etiquetas.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Por qué un cálculo pesado en Node afecta a todos los usuarios?',
      opciones: [
        'Node ejecuta el JavaScript en un solo hilo: mientras el cómputo corre, el bucle de eventos no atiende nada',
        'Porque Node es lento para cálculos',
        'Porque se agota la memoria',
        'Porque el proxy tiene un timeout',
      ],
      correcta: 0,
      porQue: 'La entrada/salida es asíncrona y no bloquea, pero el cómputo sí. La solución es sacarlo del hilo principal con un worker o una cola, y para usar varios núcleos, correr varios procesos.',
      porQueNo: {
        1: 'La velocidad de cálculo no explica que afecte a otros usuarios.',
        2: 'Puede pasar, pero el bloqueo ocurre aunque sobre memoria.',
        3: 'El timeout es una consecuencia, no la causa.',
      },
    },
    {
      p: 'Tu aplicación se reinicia sola y no hay nada en los logs. ¿Primera hipótesis?',
      opciones: [
        'Se quedó sin memoria y el sistema operativo la mató',
        'Un error de JavaScript no capturado',
        'El proxy la desconectó',
        'Un problema de DNS',
      ],
      correcta: 0,
      porQue: 'Cuando el kernel mata un proceso por memoria no hay oportunidad de escribir un log: el proceso desaparece. En un contenedor aparece como OOMKilled. Se confirma mirando el uso de memoria justo antes.',
      porQueNo: {
        1: 'Un error de JS suele dejar un stack trace en los logs.',
        2: 'El proxy no puede matar tu proceso: solo deja de recibir respuesta.',
        3: 'El DNS afecta la resolución de nombres, no la vida del proceso.',
      },
    },
    {
      p: '¿Qué es un apagado ordenado y por qué importa?',
      opciones: [
        'Escuchar SIGTERM para terminar las peticiones en curso y cerrar recursos antes de salir',
        'Apagar el servidor desde el panel del proveedor',
        'Reiniciar la aplicación cada noche',
        'Cerrar la sesión de los usuarios antes de desplegar',
      ],
      correcta: 0,
      porQue: 'Sin eso, cada deploy corta peticiones a la mitad y deja conexiones colgadas, produciendo errores intermitentes que no se reproducen a demanda. Son diez líneas.',
      porQueNo: {
        1: 'Eso apaga la máquina, no resuelve las peticiones en curso.',
        2: 'No tiene relación con manejar señales del sistema.',
        3: 'No es necesario ni resuelve el problema de las peticiones en vuelo.',
      },
    },
    {
      p: 'Cambiaste el DNS hace dos horas y algunos usuarios siguen yendo al servidor viejo. ¿Por qué?',
      opciones: [
        'Por el TTL: cada caché conserva la respuesta anterior hasta que vence',
        'Porque el cambio todavía se está propagando por la red',
        'Porque el servidor viejo sigue encendido',
        'Porque falta reiniciar el resolver',
      ],
      correcta: 0,
      porQue: 'El DNS no se propaga: expira. Y manda el TTL anterior, así que bajarlo ahora no acelera nada para quien ya cacheó. Por eso una migración se planifica con días de anticipación.',
      porQueNo: {
        1: 'No hay ningún proceso empujando el cambio: solo vencimientos de caché.',
        2: 'Aunque lo apagues, los que tienen la IP vieja cacheada van a seguir intentando ir ahí.',
        3: 'No hay nada que reiniciar: la caché vence sola.',
      },
    },
    {
      p: '¿Cuál es el procedimiento correcto antes de migrar un dominio a otra IP?',
      opciones: [
        'Bajar el TTL, esperar el TTL anterior completo, migrar, y después volver a subirlo',
        'Bajar el TTL y migrar el mismo día',
        'Migrar directamente: el DNS se actualiza en minutos',
        'Cambiar los servidores de nombres',
      ],
      correcta: 0,
      porQue: 'Quien ya cacheó con el TTL viejo lo conserva el tiempo viejo. Si estaba en 24 horas, hay que esperar 24 horas entre bajarlo y migrar.',
      porQueNo: {
        1: 'No sirve: los que ya tienen la respuesta cacheada la conservan el tiempo anterior.',
        2: 'Depende del TTL configurado, que puede ser de horas o días.',
        3: 'Es un cambio mucho más disruptivo y tampoco esquiva el problema del caché.',
      },
    },
    {
      p: '¿Por qué no se puede usar un CNAME en el dominio raíz?',
      opciones: [
        'Un CNAME no puede convivir con otros registros, y en la raíz ya están NS y SOA',
        'Porque los CNAME solo funcionan con subdominios por diseño del navegador',
        'Porque el TTL de la raíz es fijo',
        'Sí se puede, es una limitación de algunos proveedores',
      ],
      correcta: 0,
      porQue: 'Las salidas son ALIAS o ANAME, el CNAME flattening que hace Cloudflare, o redirigir la raíz a www y poner el CNAME ahí.',
      porQueNo: {
        1: 'No tiene relación con el navegador: es una restricción del protocolo DNS.',
        2: 'El TTL no interviene en esta restricción.',
        3: 'Es una restricción del estándar, no de un proveedor.',
      },
    },
    {
      p: '¿Cuál es la diferencia entre 401 y 403?',
      opciones: [
        '401 es "no sé quién sos" (autenticación); 403 es "sé quién sos y no podés" (autorización)',
        'Son equivalentes',
        '401 es del cliente y 403 del servidor',
        '403 significa que el recurso no existe',
      ],
      correcta: 0,
      porQue: 'Si devolvés 401 cuando corresponde 403, el cliente intenta volver a autenticarse —refrescar token, redirigir al login— en un bucle infinito, porque el problema no era la identidad.',
      porQueNo: {
        1: 'Provocan comportamientos distintos en el cliente.',
        2: 'Los dos son códigos de la familia 4xx, del lado del cliente.',
        3: 'Eso es un 404.',
      },
    },
    {
      p: '¿Qué indica un 502 o un 504?',
      opciones: [
        'Que hay un proxy delante y no pudo obtener respuesta de tu aplicación',
        'Que el cliente mandó datos inválidos',
        'Que falta autenticación',
        'Que el recurso no existe',
      ],
      correcta: 0,
      porQue: '502 es que tu app no respondió o respondió algo inválido —probablemente está caída—. 504 es que tardó más que el timeout del proxy. La distinción orienta el diagnóstico.',
      porQueNo: {
        1: 'Eso sería un 400.',
        2: 'Eso sería un 401.',
        3: 'Eso sería un 404.',
      },
    },
    {
      p: '¿CORS protege tu API?',
      opciones: [
        'No: es una restricción del navegador. Un cliente fuera del navegador lo ignora',
        'Sí, impide que cualquiera consuma tu API',
        'Sí, si está bien configurado',
        'Solo protege las peticiones POST',
      ],
      correcta: 0,
      porQue: 'CORS evita que el JavaScript de otro sitio lea tus respuestas usando la sesión del usuario. La protección real de una API es autenticación y autorización.',
      porQueNo: {
        1: 'curl, un backend o un bot ignoran CORS por completo.',
        2: 'Ninguna configuración de CORS afecta a clientes que no son navegadores.',
        3: 'Aplica a todos los métodos, y en ningún caso es un control del servidor.',
      },
    },
    {
      p: '¿Qué hace stale-while-revalidate?',
      opciones: [
        'Servir contenido viejo de inmediato mientras se revalida en segundo plano',
        'Impedir que se cachee el contenido',
        'Borrar la caché cuando el contenido cambia',
        'Cachear solo para usuarios autenticados',
      ],
      correcta: 0,
      porQue: 'El usuario nunca espera y el origen recibe muchísimo menos tráfico. Es la base de cómo manejan contenido semi-dinámico plataformas como Vercel y Cloudflare.',
      porQueNo: {
        1: 'Eso sería no-store.',
        2: 'No hay invalidación activa: es una ventana de tolerancia sobre contenido vencido.',
        3: 'El contenido por usuario justamente no debe cachearse en un CDN compartido.',
      },
    },
    {
      p: 'Una respuesta con datos de un usuario se cachea en un CDN sin la directiva private. ¿Qué pasa?',
      opciones: [
        'El siguiente usuario puede recibir los datos del anterior',
        'La respuesta tarda más',
        'El CDN devuelve un error',
        'No pasa nada: el CDN detecta datos personales',
      ],
      correcta: 0,
      porQue: 'Es una de las filtraciones más comunes y más graves, y no genera ningún error: simplemente ocurre. Las respuestas con datos de usuario llevan private, no-store.',
      porQueNo: {
        1: 'Al contrario: viene de caché, así que es más rápida.',
        2: 'No hay error: el CDN cachea lo que se le permite cachear.',
        3: 'Un CDN no interpreta el contenido: obedece las cabeceras.',
      },
    },
    {
      p: '¿Qué hace un proxy inverso?',
      opciones: [
        'Termina TLS, enruta, balancea, sirve estáticos, comprime y limita peticiones',
        'Oculta la IP del usuario en internet',
        'Reemplaza a tu aplicación',
        'Solo sirve para balancear carga',
      ],
      correcta: 0,
      porQue: 'Aunque uses una plataforma gestionada, ese proxy existe igual y sus límites son tus límites: cuando ves un 502, un 504 o "request entity too large", lo estás viendo a él.',
      porQueNo: {
        1: 'Eso es un proxy directo (forward proxy), que es lo contrario.',
        2: 'La reenvía peticiones; tu aplicación sigue haciendo el trabajo.',
        3: 'Balancear es una de sus funciones, no la única.',
      },
    },
    {
      p: 'Tu rate limiting por IP bloquea a todos los usuarios a la vez. ¿Qué falta?',
      opciones: [
        'Configurar la aplicación para confiar en X-Forwarded-For',
        'Aumentar el límite de peticiones',
        'Desactivar el proxy',
        'Cambiar a rate limiting por usuario',
      ],
      correcta: 0,
      porQue: 'Sin esa configuración la aplicación ve la IP del proxy y cuenta todo el tráfico como una sola IP. El número de saltos debe ser exacto: uno mayor permitiría falsificar la cabecera.',
      porQueNo: {
        1: 'El problema no es el umbral sino que todos comparten el mismo contador.',
        2: 'El proxy es necesario; lo que falta es leer bien la cabecera.',
        3: 'Puede ser una mejora, pero no explica ni corrige el bug.',
      },
    },
    {
      p: 'El streaming funciona en local y en producción llega todo junto al final. ¿Qué revisás?',
      opciones: [
        'El buffering del proxy, que acumula la respuesta antes de enviarla',
        'La versión del modelo',
        'El timeout de la base de datos',
        'La configuración de CORS',
      ],
      correcta: 0,
      porQue: 'En local no hay proxy. En producción, proxy_buffering activado anula el streaming sin generar ningún error. Se desactiva y además se mandan las cabeceras no-transform y X-Accel-Buffering.',
      porQueNo: {
        1: 'No tiene relación con cómo se entrega la respuesta por la red.',
        2: 'El streaming se corta en la entrega, no en la consulta.',
        3: 'CORS afecta si el navegador puede leer la respuesta, no cómo se entrega.',
      },
    },
    {
      p: '¿Cómo deben ordenarse los timeouts de las distintas capas?',
      opciones: [
        'Creciendo hacia afuera: base de datos < aplicación < proxy < CDN',
        'Todos iguales, para que sea predecible',
        'Decreciendo hacia afuera',
        'Sin timeouts, para no cortar operaciones legítimas',
      ],
      correcta: 0,
      porQue: 'Si el proxy corta antes que tu aplicación, el usuario ve un 504 mientras tu app sigue trabajando para nadie, ocupando una conexión a la base. Bajo carga, eso agota el pool.',
      porQueNo: {
        1: 'Con valores iguales, las carreras entre capas producen comportamientos inconsistentes.',
        2: 'Es exactamente el orden que provoca trabajo desperdiciado y agotamiento del pool.',
        3: 'Sin timeouts, una operación colgada retiene recursos indefinidamente.',
      },
    },
  ],
});
