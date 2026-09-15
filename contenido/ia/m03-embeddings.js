/* ==========================================================================
   IA · Módulo 03 — Embeddings y búsqueda semántica
   ========================================================================== */
ESTUDIO.registrarModulo({
  track: 'ia',
  id: 'm03',
  titulo: 'Embeddings y búsqueda semántica',
  fuentes: ['pgvector', 'mteb', 'openai', 'paper-hnsw', 'supabase-docs'],

  intro:
    '<p>Este es el módulo que hace posible el siguiente. RAG no es más que <b>buscar bien y pegar el resultado en ' +
    'el prompt</b>, y toda la parte de "buscar bien" vive acá.</p>' +
    '<p>Vas a entender qué es un embedding, cómo se mide que dos textos se parezcan, dónde se guardan esos vectores ' +
    'y por qué la búsqueda vectorial es <i>aproximada</i> — un detalle que casi nadie menciona y que se pregunta seguido.</p>',

  lecciones: [

    /* ================================================================== */
    {
      id: 'l1',
      titulo: 'Qué es un embedding',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> un embedding es la <b>coordenada GPS de un
significado</b>. Textos que quieren decir cosas parecidas quedan cerca; textos que no tienen nada que ver,
lejos.</div>

<p>Imaginate un mapa gigante donde en vez de ciudades hay ideas. "Perro" y "gato" están cerca. "Perro" y
"cachorro" están casi pegados. "Perro" y "contabilidad" están en puntas opuestas.</p>

<p>Un <b>embedding</b> es exactamente eso: la dirección de un texto en ese mapa, escrita como una lista de
números.</p>

<pre><code>"perro"      → [0.21, -0.44, 0.87, ... ]   (1.536 números)
"cachorro"   → [0.19, -0.41, 0.85, ... ]   ← casi los mismos
"contabilidad" → [-0.72, 0.33, -0.11, ... ] ← completamente otros</code></pre>

<p>Cada número es una coordenada en una dimensión. Un mapa común tiene 2 (latitud y longitud); estos tienen
entre 384 y 3.072. No te podés imaginar 1.536 dimensiones, y no hace falta: la idea es la misma, solo que con
muchos más ejes.</p>

<h4>Por qué esto es tan potente</h4>
<p>Porque permite buscar <b>por significado y no por palabras</b>. Comparalo:</p>

<table>
<tr><th>Buscás</th><th>Búsqueda clásica encuentra</th><th>Búsqueda semántica encuentra</th></tr>
<tr><td>"cómo cancelo mi suscripción"</td><td>Solo documentos que digan literalmente "cancelo" y "suscripción"</td><td>También "dar de baja el plan", "rescindir el servicio", "terminar la membresía"</td></tr>
</table>

<p>Ningún usuario escribe con las palabras exactas de tu documentación. Esa brecha es la que cierra el
embedding.</p>

<h4>De dónde salen esos números</h4>
<p>De un modelo entrenado específicamente para esto. Le das texto, te devuelve el vector. No es el mismo
modelo que genera respuestas: es más chico, más rápido y mucho más barato — suele costar centavos por millón
de tokens.</p>

<div class="aviso"><strong>La regla que más problemas evita:</strong> el vector solo tiene sentido dentro del
modelo que lo creó. <b>Los embeddings de dos modelos distintos no se pueden comparar entre sí</b>, ni siquiera
si tienen la misma cantidad de dimensiones. Si cambiás de modelo de embeddings, tenés que <b>reindexar todo</b>
desde cero. Sin excepciones.</div>
`,

      tecnico: `
<p>Un embedding es una representación vectorial densa de dimensión fija, aprendida de forma que la <b>proximidad
geométrica</b> se corresponda con la <b>similitud semántica</b>.</p>

<h4>Cómo se generan</h4>
<p>Se usa un modelo de tipo encoder —arquitectura BERT o similar— entrenado con objetivos contrastivos: se le
muestran pares de textos relacionados y pares no relacionados, y se ajusta para que los primeros queden cerca
y los segundos lejos. Los modelos actuales suelen añadir <i>hard negatives</i>: ejemplos que se parecen
superficialmente pero significan cosas distintas, que es donde está la dificultad real.</p>

<p>La salida se obtiene agregando los vectores de los tokens —por <i>mean pooling</i> o tomando el token
especial <code>[CLS]</code>— y normalmente se <b>normaliza a norma 1</b>, lo que hace que el producto punto y
la similitud coseno coincidan.</p>

<h4>Dimensionalidad</h4>
<table>
<tr><th>Dimensiones</th><th>Compromiso</th></tr>
<tr><td>384</td><td>Modelos chicos y locales. Rápidos, baratos de almacenar, algo menos precisos</td></tr>
<tr><td>768 – 1.024</td><td>El punto habitual. Buen equilibrio</td></tr>
<tr><td>1.536 – 3.072</td><td>Modelos grandes de API. Más precisión, más costo de almacenamiento y de búsqueda</td></tr>
</table>
<p>Varios modelos modernos soportan <b>Matryoshka Representation Learning</b>: podés truncar el vector a menos
dimensiones y sigue funcionando razonablemente. Permite guardar 3.072 dimensiones y buscar con 512 para un
filtrado rápido, refinando después.</p>

<h4>Modelos simétricos y asimétricos</h4>
<p>Distinción que se pasa por alto y que degrada resultados sin que se note:</p>
<ul>
<li><b>Simétrico</b> — comparar dos textos del mismo tipo (¿estas dos preguntas son la misma?).</li>
<li><b>Asimétrico</b> — comparar una consulta corta contra un documento largo. Es el caso de RAG.</li>
</ul>
<p>Varios modelos exigen <b>prefijos distintos</b> para consulta y documento (por ejemplo <code>query:</code>
y <code>passage:</code>). Omitirlos no genera ningún error: simplemente los resultados son peores, y es muy
difícil de diagnosticar después.</p>

<div class="dato"><strong>Coste de cambiar de modelo:</strong> los espacios vectoriales de dos modelos no son
comparables — no hay traducción entre ellos. Cambiar de modelo de embeddings implica <b>regenerar todos los
vectores del corpus</b>. En un corpus grande eso es horas de cómputo y dinero, así que es una decisión de
arquitectura, no una preferencia. Conviene guardar en la base <b>qué modelo y qué versión</b> generó cada
vector, para poder migrar de forma incremental.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 380" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="26" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    EL MAPA DE LOS SIGNIFICADOS  (acá dibujado en 2D; en la realidad son ~1.536 ejes)</text>

  <rect x="24" y="40" width="632" height="256" rx="12" fill="currentColor" fill-opacity=".03" stroke="currentColor" stroke-opacity=".2" stroke-width="1.3"/>

  <circle cx="150" cy="110" r="6" fill="#34d399"/>
  <text x="164" y="114" fill="#34d399" font-size="12.5" font-weight="700">perro</text>
  <circle cx="176" cy="128" r="6" fill="#34d399" fill-opacity=".8"/>
  <text x="190" y="132" fill="#34d399" opacity=".85" font-size="12">cachorro</text>
  <circle cx="138" cy="146" r="6" fill="#34d399" fill-opacity=".7"/>
  <text x="152" y="150" fill="#34d399" opacity=".75" font-size="12">gato</text>
  <circle cx="196" cy="98" r="6" fill="#34d399" fill-opacity=".6"/>
  <text x="210" y="102" fill="#34d399" opacity=".7" font-size="12">mascota</text>
  <ellipse cx="170" cy="122" rx="86" ry="52" fill="#34d399" fill-opacity=".07" stroke="#34d399" stroke-opacity=".35" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text x="170" y="192" text-anchor="middle" fill="#34d399" opacity=".65" font-size="11">vecindario “animales”</text>

  <circle cx="480" cy="200" r="6" fill="#fbbf24"/>
  <text x="494" y="204" fill="#fbbf24" font-size="12.5" font-weight="700">contabilidad</text>
  <circle cx="510" cy="222" r="6" fill="#fbbf24" fill-opacity=".8"/>
  <text x="524" y="226" fill="#fbbf24" opacity=".85" font-size="12">balance</text>
  <circle cx="460" cy="232" r="6" fill="#fbbf24" fill-opacity=".7"/>
  <text x="474" y="236" fill="#fbbf24" opacity=".75" font-size="12">factura</text>
  <ellipse cx="490" cy="218" rx="84" ry="46" fill="#fbbf24" fill-opacity=".07" stroke="#fbbf24" stroke-opacity=".35" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text x="490" y="280" text-anchor="middle" fill="#fbbf24" opacity=".65" font-size="11">vecindario “finanzas”</text>

  <circle cx="300" cy="238" r="7" fill="#7c5cff"/>
  <text x="314" y="242" fill="#7c5cff" font-size="12.5" font-weight="700">“cómo doy de baja el plan”</text>
  <circle cx="336" cy="216" r="6" fill="#22d3ee" fill-opacity=".85"/>
  <text x="350" y="205" fill="#22d3ee" font-size="12">“cancelar suscripción”</text>
  <line x1="300" y1="238" x2="336" y2="216" stroke="#22d3ee" stroke-width="2.2" opacity=".8"/>
  <text x="248" y="268" fill="currentColor" opacity=".5" font-size="10.5">cero palabras en común, pero quedan pegados</text>

  <line x1="176" y1="128" x2="480" y2="200" stroke="#f87171" stroke-width="1.2" stroke-dasharray="5 4" opacity=".55"/>
  <text x="316" y="150" fill="#f87171" opacity=".8" font-size="11">lejos = nada que ver</text>

  <text x="24" y="326" fill="currentColor" opacity=".6" font-size="11.5">
    Buscar deja de ser “qué documentos contienen estas palabras” y pasa a ser</text>
  <text x="24" y="346" fill="currentColor" opacity=".85" font-size="12.5" font-weight="700">
    “qué documentos están CERCA de esta pregunta en el mapa”.</text>
  <text x="24" y="368" fill="#f87171" opacity=".8" font-size="11">
    Ojo: cada modelo dibuja su propio mapa. Vectores de modelos distintos NO se pueden comparar.</text>
</svg>`,
        pie: 'Los vecindarios son reales: los embeddings agrupan por significado, no por letras compartidas.',
      },

      entrevista: [
        { p: '¿Qué es un embedding?',
          r: 'Es la representación de un texto como un vector de números, generada por un modelo entrenado para que ' +
             '<b>la cercanía geométrica se corresponda con la similitud de significado</b>. Textos que quieren decir lo mismo quedan cerca en ese ' +
             'espacio aunque no compartan ni una palabra. Eso es lo que permite buscar por significado: un usuario que escribe "dar de baja el plan" ' +
             'encuentra un documento que dice "cancelar la suscripción", cosa que una búsqueda por palabras clave nunca haría.' },

        { p: '¿Podés comparar embeddings generados por modelos distintos?',
          r: 'No, nunca. Cada modelo define su propio espacio vectorial y no hay ninguna correspondencia entre ellos, ni siquiera cuando la ' +
             'dimensionalidad coincide. La consecuencia operativa es importante: <b>cambiar de modelo de embeddings obliga a regenerar todos los ' +
             'vectores del corpus</b>. Por eso conviene guardar en la base qué modelo y qué versión generó cada vector, para poder migrar de forma ' +
             'incremental en vez de tener que hacer un corte total.' },

        { p: '¿Qué diferencia hay entre un modelo de embeddings simétrico y uno asimétrico?',
          r: 'El <b>simétrico</b> compara textos del mismo tipo y longitud —por ejemplo, detectar si dos preguntas son la misma—. El <b>asimétrico</b> ' +
             'compara una consulta corta contra un documento largo, que es exactamente el caso de RAG. Muchos modelos asimétricos requieren ' +
             '<b>prefijos distintos</b> para consulta y documento. Omitirlos no genera ningún error: simplemente empeora el retrieval, y es una ' +
             'causa de bajo rendimiento muy difícil de diagnosticar después.' },

        { p: '¿Más dimensiones es mejor?',
          r: 'Hasta cierto punto. Más dimensiones capturan matices más finos, pero cuestan más en almacenamiento, en memoria del índice y en tiempo ' +
             'de búsqueda. En la práctica el salto de calidad de 768 a 3.072 dimensiones suele ser mucho menor que el salto de costo. ' +
             'Algunos modelos modernos soportan <b>Matryoshka</b>, que permite truncar el vector y conservar buena parte de la calidad: ' +
             'podés guardar la versión completa y buscar con una truncada para un primer filtrado rápido.' },
      ],

      practica: `
<h4>Generar y guardar un embedding</h4>
<pre><code>// Un embedding es una llamada a un modelo distinto del que genera texto:
// más chico, más rápido y órdenes de magnitud más barato.
const { data } = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: 'Para dar de baja el plan, entrá a Configuración → Suscripción.',
});

const vector = data[0].embedding;   // number[1536]

await supabase.from('documentos').insert({
  tenant_id: tenant.ctx.tenantId,
  contenido: texto,
  embedding: vector,
  modelo_embedding: 'text-embedding-3-small',   // ← guardalo SIEMPRE
  version_indexado: 1,
});</code></pre>

<div class="aviso"><strong>Ese campo <code>modelo_embedding</code> parece un detalle y no lo es.</strong>
El día que quieras cambiar de modelo —porque salió uno mejor o más barato— vas a necesitar saber qué filas
están en qué espacio vectorial para poder migrar de a poco. Sin ese campo, la migración es un corte total del
servicio.</div>

<h4>Prefijos: el error silencioso</h4>
<pre><code>// ❌ Mismo tratamiento para consulta y documento
embed(pregunta);
embed(documento);

// ✅ Con un modelo asimétrico, cada lado lleva su prefijo
embed('query: '   + pregunta);
embed('passage: ' + documento);</code></pre>
<p>Cuál corresponde depende del modelo — hay que leer su tarjeta. Lo importante es que <b>si el modelo los pide
y no se los das, no falla nada</b>: simplemente recuperás peor, y lo vas a atribuir a otra cosa.</p>

<h4>Qué NO conviene meter en un embedding</h4>
<table>
<tr><th>Dato</th><th>Por qué no</th><th>Qué hacer</th></tr>
<tr><td>Precios, stock, saldos</td><td>Cambian todo el tiempo; el índice queda viejo</td><td>Tool calling contra la base en vivo</td></tr>
<tr><td>Números de identificación</td><td>Los embeddings capturan significado, no cadenas exactas</td><td>Búsqueda por palabra clave o consulta directa</td></tr>
<tr><td>Tablas grandes de datos</td><td>El significado de una tabla no se resume en un punto</td><td>Consulta SQL, o indexar fila por fila</td></tr>
<tr><td>Documentos enteros de 50 páginas</td><td>El vector promedia todo y no representa nada</td><td>Partir en fragmentos (módulo 4)</td></tr>
</table>
`,

      errores: [
        { mito: 'Un embedding entiende el texto.',
          realidad: 'Codifica <b>patrones de uso</b> aprendidos estadísticamente. Funciona muy bien para similitud temática, pero falla en cosas ' +
                    'que a una persona le parecen obvias: <b>la negación es el caso clásico</b>. "El envío es gratis" y "el envío no es gratis" ' +
                    'quedan a una distancia mínima, porque hablan del mismo tema.' },

        { mito: 'Si dos textos tienen alta similitud, uno responde al otro.',
          realidad: 'Alta similitud significa "hablan de lo mismo", no "acá está la respuesta". Una pregunta y otra pregunta muy parecida ' +
                    'tienen similitud altísima y ninguna responde a la otra. Es una de las razones por las que la búsqueda vectorial sola no alcanza ' +
                    'y hace falta <b>re-ranking</b>.' },

        { mito: 'Cambio a un modelo de embeddings mejor y listo.',
          realidad: 'Hay que <b>regenerar todos los vectores</b>. Los espacios no son compatibles ni con la misma dimensionalidad. En un corpus ' +
                    'grande son horas de cómputo y plata, así que es una decisión de arquitectura. Guardá el modelo y la versión en cada fila para ' +
                    'poder migrar de forma incremental.' },

        { mito: 'Los umbrales de similitud son universales.',
          realidad: 'Un valor de 0,8 no significa lo mismo en dos modelos distintos, ni siquiera en dos corpus distintos con el mismo modelo. ' +
                    '<b>El umbral se calibra con tus propios datos</b>, mirando ejemplos reales de qué queda arriba y qué queda abajo. Copiar el ' +
                    'número de un tutorial es una fuente garantizada de resultados malos.' },
      ],

      glosario: [
        { t: 'Embedding', d: 'Representación de un texto como vector numérico, donde la cercanía refleja similitud de significado.' },
        { t: 'Vector denso', d: 'Vector donde casi todas las posiciones tienen valor, a diferencia de los dispersos como TF-IDF.' },
        { t: 'Dimensionalidad', d: 'Cantidad de números del vector. Típicamente entre 384 y 3.072.' },
        { t: 'Espacio vectorial', d: 'El "mapa" definido por un modelo. Cada modelo tiene el suyo y no son intercambiables.' },
        { t: 'Aprendizaje contrastivo', d: 'Entrenamiento que acerca los pares relacionados y aleja los no relacionados.' },
        { t: 'Hard negative', d: 'Ejemplo que se parece superficialmente al correcto pero no lo es. Es lo que más enseña al modelo.' },
        { t: 'Mean pooling', d: 'Promediar los vectores de todos los tokens para obtener el vector del texto completo.' },
        { t: 'Normalización', d: 'Escalar el vector a norma 1. Hace que producto punto y coseno coincidan.' },
        { t: 'Matryoshka', d: 'Entrenamiento que permite truncar el vector a menos dimensiones conservando buena parte de la calidad.' },
        { t: 'Modelo asimétrico', d: 'Modelo pensado para comparar consultas cortas con documentos largos. Suele requerir prefijos distintos.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l2',
      titulo: 'Cómo se mide la cercanía',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> si un embedding es una flecha que apunta a un
significado, lo que importa casi siempre es <b>hacia dónde apunta</b>, no cuán larga es.</div>

<p>Tenés dos vectores y querés saber cuánto se parecen. Hay tres formas de medirlo, y la diferencia entre
ellas importa.</p>

<h4>1 · Similitud coseno — la que se usa</h4>
<p>Mide el <b>ángulo</b> entre las dos flechas, ignorando su longitud.</p>
<ul>
<li><code>1</code> → apuntan exactamente al mismo lado. Idénticos en significado.</li>
<li><code>0</code> → perpendiculares. No tienen relación.</li>
<li><code>-1</code> → opuestos.</li>
</ul>
<p>En textos reales casi todo cae entre <b>0,5 y 0,95</b>. Un 0,3 ya es "no tienen nada que ver".</p>

<p><b>¿Por qué ignorar la longitud?</b> Porque la longitud del vector tiende a reflejar cosas como cuán largo
era el texto, no de qué habla. Un párrafo y un libro sobre el mismo tema apuntan al mismo lado; el del libro
es más largo. Vos querés el tema, no el tamaño.</p>

<h4>2 · Producto punto</h4>
<p>Mira el ángulo <b>y</b> la longitud. Si los vectores están normalizados —longitud 1, que es lo habitual—
<b>da exactamente lo mismo que el coseno</b>, pero se calcula más rápido porque salta el paso de dividir.</p>

<h4>3 · Distancia euclidiana</h4>
<p>La distancia en línea recta entre las dos puntas. Es la intuitiva, pero es la que menos se usa en texto:
le afecta demasiado la magnitud. Con vectores normalizados equivale al coseno, así que tampoco aporta.</p>

<div class="aviso"><strong>Lo que hay que retener:</strong> <b>usá coseno</b> (o producto punto sobre vectores
normalizados, que es lo mismo más rápido). Y sobre todo: <b>el índice de tu base de datos tiene que estar
creado con la misma métrica que usás al consultar.</b> Si no coinciden, la búsqueda devuelve resultados
plausibles pero equivocados — y no falla nada, así que te podés pasar semanas sin notarlo.</div>
`,

      tecnico: `
<h4>Las tres métricas</h4>
<pre><code>coseno(a,b)     =  (a · b) / (‖a‖ · ‖b‖)        ∈ [-1, 1]   ↑ mejor
producto(a,b)   =   a · b                                    ↑ mejor
euclidiana(a,b) =  ‖a - b‖                       ∈ [0, ∞)    ↓ mejor</code></pre>

<p>Con vectores normalizados a norma 1 se cumple que <code>‖a-b‖² = 2 - 2(a·b)</code>, es decir: <b>las tres
métricas producen el mismo ranking</b>. Lo que cambia es el costo de cómputo y la convención de orden.</p>

<h4>Operadores en pgvector</h4>
<table>
<tr><th>Operador</th><th>Métrica</th><th>Clase de índice</th></tr>
<tr><td><code>&lt;=&gt;</code></td><td>Distancia coseno (1 - similitud)</td><td><code>vector_cosine_ops</code></td></tr>
<tr><td><code>&lt;#&gt;</code></td><td>Producto punto negado</td><td><code>vector_ip_ops</code></td></tr>
<tr><td><code>&lt;-&gt;</code></td><td>Distancia euclidiana (L2)</td><td><code>vector_l2_ops</code></td></tr>
</table>
<p>Los tres devuelven <b>distancia</b>, no similitud: menor es mejor, y por eso se ordena con <code>ASC</code>.
Para obtener la similitud coseno a partir de <code>&lt;=&gt;</code> se hace <code>1 - distancia</code>.</p>

<div class="dato"><strong>El error de configuración más caro de este módulo:</strong> crear el índice con una
clase de operadores y consultar con otro operador. Postgres <b>no usa el índice</b> —hace un escaneo secuencial
completo— o, peor, devuelve un orden distinto del esperado. No hay error ni warning. Los síntomas son
"la búsqueda anda lenta" o "los resultados son raros", y casi nadie mira ahí.</div>

<h4>Umbrales</h4>
<p>Es tentador filtrar por <code>similitud &gt; 0.8</code>. Antes de fijar ese número:</p>
<ul>
<li>La escala <b>depende del modelo</b>. Algunos concentran casi todo entre 0,7 y 0,9; otros usan más rango.</li>
<li>Depende del <b>corpus</b>. En un corpus temáticamente homogéneo todo se parece a todo y las similitudes suben.</li>
<li>Depende de la <b>longitud del fragmento</b>. Fragmentos largos promedian más y tienden a similitudes medias.</li>
</ul>
<p>La forma correcta de calibrar: tomá 30-50 consultas reales, mirá el puntaje del fragmento correcto y el del
primer fragmento incorrecto, y elegí el corte que los separa. <b>Un umbral heredado de un tutorial no
significa nada sobre tus datos.</b></p>

<h4>Por qué la similitud sola no alcanza</h4>
<p>El embedding comprime todo el texto en un punto, así que pierde información. Dos fallas conocidas:</p>
<ul>
<li><b>Negación.</b> "El envío es gratis" y "el envío no es gratis" quedan a distancia mínima.</li>
<li><b>Pregunta contra pregunta.</b> Dos preguntas parecidas tienen similitud altísima, pero ninguna responde a la otra.</li>
</ul>
<p>Por eso en un RAG serio la búsqueda vectorial es solo el <b>primer filtro</b>: recupera unos 50 candidatos
plausibles y después un <i>re-ranker</i> —que sí lee el par completo— elige los 5 buenos.</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <defs><marker id="v1" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L6.5,3 L0,6 z" fill="currentColor"/></marker></defs>

  <text x="24" y="26" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    LO QUE IMPORTA ES EL ÁNGULO, NO LA LONGITUD</text>

  <line x1="60" y1="230" x2="330" y2="230" stroke="currentColor" opacity=".2"/>
  <line x1="60" y1="230" x2="60" y2="60" stroke="currentColor" opacity=".2"/>

  <line x1="60" y1="230" x2="230" y2="100" stroke="#34d399" stroke-width="2.6" marker-end="url(#v1)" color="#34d399"/>
  <text x="238" y="98" fill="#34d399" font-size="12" font-weight="700">“perro”</text>

  <line x1="60" y1="230" x2="180" y2="138" stroke="#34d399" stroke-width="2.6" opacity=".7" marker-end="url(#v1)" color="#34d399"/>
  <text x="120" y="128" fill="#34d399" opacity=".85" font-size="12">“cachorro”</text>

  <path d="M 108 196 A 62 62 0 0 1 122 184" fill="none" stroke="#34d399" stroke-width="1.6"/>
  <text x="132" y="200" fill="#34d399" font-size="11" font-weight="700">ángulo chico → coseno 0.96</text>

  <line x1="60" y1="230" x2="300" y2="222" stroke="#f87171" stroke-width="2.6" marker-end="url(#v1)" color="#f87171"/>
  <text x="240" y="248" fill="#f87171" font-size="12" font-weight="700">“contabilidad”</text>
  <path d="M 128 214 A 70 70 0 0 0 130 228" fill="none" stroke="#f87171" stroke-width="1.6"/>
  <text x="140" y="222" fill="#f87171" font-size="11" font-weight="700">ángulo grande → 0.31</text>

  <text x="60" y="270" fill="currentColor" opacity=".5" font-size="11">
    “cachorro” es más corto que “perro” y da igual: apuntan casi al mismo lado.</text>

  <rect x="368" y="46" width="288" height="66" rx="10" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.4"/>
  <text x="386" y="70" fill="#34d399" font-size="12.5" font-weight="700">COSENO  ·  la que se usa</text>
  <text x="386" y="90" fill="currentColor" opacity=".7" font-size="11">solo el ángulo · 1 = igual, 0 = sin relación</text>
  <text x="386" y="106" fill="currentColor" opacity=".5" font-size="10.5">pgvector: operador &lt;=&gt;</text>

  <rect x="368" y="122" width="288" height="66" rx="10" fill="#22d3ee" fill-opacity=".1" stroke="#22d3ee" stroke-width="1.4"/>
  <text x="386" y="146" fill="#22d3ee" font-size="12.5" font-weight="700">PRODUCTO PUNTO</text>
  <text x="386" y="166" fill="currentColor" opacity=".7" font-size="11">ángulo + longitud</text>
  <text x="386" y="182" fill="currentColor" opacity=".5" font-size="10.5">normalizado = idéntico al coseno, más rápido</text>

  <rect x="368" y="198" width="288" height="66" rx="10" fill="currentColor" fill-opacity=".05" stroke="currentColor" stroke-opacity=".28" stroke-width="1.3"/>
  <text x="386" y="222" fill="currentColor" opacity=".8" font-size="12.5" font-weight="700">EUCLIDIANA  ·  poco usada en texto</text>
  <text x="386" y="242" fill="currentColor" opacity=".6" font-size="11">distancia en línea recta</text>
  <text x="386" y="258" fill="currentColor" opacity=".45" font-size="10.5">le afecta demasiado la magnitud</text>

  <rect x="24" y="298" width="632" height="80" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="322" fill="#f87171" font-size="12.5" font-weight="700">EL ERROR QUE NO AVISA</text>
  <text x="44" y="344" fill="currentColor" opacity=".75" font-size="11.5">
    Crear el índice con una métrica  (vector_l2_ops)  y consultar con otro operador  (&lt;=&gt;).</text>
  <text x="44" y="364" fill="currentColor" opacity=".75" font-size="11.5">
    Postgres ignora el índice o devuelve otro orden. Sin error ni warning. Se nota como “anda lento” o “da resultados raros”.</text>
</svg>`,
        pie: 'Coseno mira solo el ángulo, y eso es lo que querés: el tema, no el tamaño del texto.',
      },

      entrevista: [
        { p: '¿Qué métrica de similitud usás y por qué?',
          r: '<b>Similitud coseno</b>, o producto punto si los vectores están normalizados —que da idéntico ranking y se calcula más rápido—. ' +
             'El coseno mide solo el ángulo entre los vectores e ignora su magnitud, que es lo correcto para texto: la longitud del vector tiende a ' +
             'reflejar la extensión del texto más que su tema, y a mí me interesa el tema. La distancia euclidiana con vectores normalizados produce ' +
             'el mismo ranking, así que no aporta nada.' },

        { p: 'Tu búsqueda vectorial devuelve resultados raros y va lenta. ¿Qué revisás primero?',
          r: 'Que la <b>clase de operadores del índice coincida con el operador de la consulta</b>. Es el error más común y el más silencioso: ' +
             'si creaste el índice con <code>vector_l2_ops</code> y consultás con <code>&lt;=&gt;</code>, Postgres no puede usar ese índice — ' +
             'hace un escaneo secuencial completo, de ahí la lentitud— y el orden puede no ser el que esperás. No tira ningún error ni warning. ' +
             'Se verifica con un <code>EXPLAIN ANALYZE</code>: si ves <i>Seq Scan</i> en lugar de <i>Index Scan</i>, es eso.' },

        { p: '¿Cómo elegís el umbral de similitud?',
          r: 'Empíricamente, nunca copiando un número. La escala depende del modelo, del corpus y hasta de la longitud de los fragmentos. ' +
             'Tomo entre 30 y 50 consultas reales, miro el puntaje del fragmento correcto y el del primer incorrecto, y elijo el corte que los separa. ' +
             'Y en general prefiero <b>no filtrar por umbral</b> sino recuperar un top-k amplio y dejar que un <b>re-ranker</b> decida, porque el ' +
             'umbral absoluto es frágil frente a consultas atípicas.' },

        { p: '¿Por qué la búsqueda vectorial sola no alcanza?',
          r: 'Porque el embedding comprime todo el texto en un punto y pierde información. Dos fallas concretas: <b>la negación</b> —"el envío es ' +
             'gratis" y "el envío no es gratis" quedan a distancia mínima porque hablan del mismo tema— y la <b>confusión entre pregunta y respuesta</b>, ' +
             'porque dos preguntas parecidas tienen similitud altísima sin que ninguna responda a la otra. Por eso la búsqueda vectorial se usa como ' +
             'primer filtro amplio y después entra un re-ranker que sí lee el par consulta-documento completo.' },
      ],

      practica: `
<h4>Búsqueda vectorial en Postgres, bien hecha</h4>
<pre><code>-- Índice y consulta DEBEN usar la misma métrica
create index on documentos
  using hnsw (embedding vector_cosine_ops);

-- 1 - distancia = similitud coseno
select
  id,
  contenido,
  1 - (embedding &lt;=&gt; $1) as similitud
from documentos
where tenant_id = $2                 -- ← el filtro de tenant va SIEMPRE
order by embedding &lt;=&gt; $1            -- ← distancia: ascendente
limit 50;                            -- ← amplio; el re-ranker recorta después</code></pre>

<div class="aviso"><strong>Tres cosas de esa consulta que valen oro:</strong><br>
<b>1 ·</b> El índice es <code>vector_cosine_ops</code> y el operador es <code>&lt;=&gt;</code>. Coinciden.<br>
<b>2 ·</b> El <code>where tenant_id</code> está <b>en la consulta</b>, no filtrando después. En multi-tenant,
filtrar el resultado ya recuperado significa que el modelo pudo haber visto datos de otro cliente.<br>
<b>3 ·</b> <code>limit 50</code>, no 5. La búsqueda vectorial es un filtro grueso; la precisión la pone el
re-ranking.</div>

<h4>Verificar que el índice se esté usando</h4>
<pre><code>explain analyze
select id from documentos
where tenant_id = '...'
order by embedding &lt;=&gt; '[...]'
limit 50;</code></pre>
<p>Buscá <code>Index Scan using ..._hnsw</code>. Si ves <code>Seq Scan</code>, el índice no se está usando y
estás comparando contra <b>toda</b> la tabla en cada consulta. Causas habituales: métrica que no coincide, el
índice no existe, o la tabla es tan chica que el planificador decide que el escaneo es más barato — esto
último es normal y deja de pasar al crecer.</p>

<h4>Calibrar el umbral con tus datos</h4>
<pre><code>// Para 30-50 consultas reales de las que sabés la respuesta correcta:
for (const caso of casosReales) {
  const r = await buscar(caso.pregunta, { limite: 20 });
  const posicion = r.findIndex(x =&gt; x.id === caso.idCorrecto);
  console.log({
    pregunta: caso.pregunta,
    posicion,                                  // -1 = ni apareció
    simCorrecta: r[posicion]?.similitud,
    simPrimeroIncorrecto: r.find(x =&gt; x.id !== caso.idCorrecto)?.similitud,
  });
}</code></pre>
<p>Ese <code>posicion</code> es la métrica que importa: si el fragmento correcto suele estar entre los primeros
20, tu recuperación funciona y el re-ranker va a hacer el resto. <b>Si aparece un <code>-1</code>, ningún prompt
del mundo va a salvar esa consulta.</b></p>
`,

      errores: [
        { mito: 'La métrica del índice y la de la consulta pueden ser distintas.',
          realidad: 'No pueden. Postgres deja de usar el índice —escaneo secuencial, mucho más lento— o devuelve un orden distinto del esperado. ' +
                    '<b>No hay error ni warning</b>, y por eso este bug sobrevive semanas. Confirmalo con <code>EXPLAIN ANALYZE</code>.' },

        { mito: 'Una similitud de 0,85 siempre es "muy parecido".',
          realidad: 'La escala depende del modelo y del corpus. En un corpus temáticamente homogéneo casi todo pasa de 0,8 y ese umbral no filtra ' +
                    'nada. <b>El umbral se calibra con tus datos</b>, o directamente se reemplaza por recuperar un top-k amplio y re-rankear.' },

        { mito: 'Filtro por tenant después de recuperar.',
          realidad: 'Grave en multi-tenant. Si recuperás y después filtrás, los fragmentos de otro cliente <b>ya salieron de la base</b>, y basta un ' +
                    'error de programación para que lleguen al prompt. <b>El aislamiento va en la cláusula <code>where</code> de la consulta</b>, ' +
                    'y en Supabase además respaldado por RLS.' },

        { mito: 'Con recuperar los 5 mejores alcanza.',
          realidad: 'La búsqueda vectorial es un <b>filtro grueso</b>: es rápida pero imprecisa, porque comprime cada texto en un punto. ' +
                    'Lo estándar es recuperar entre 30 y 50 candidatos y dejar que un re-ranker —que lee el par consulta-documento completo— ' +
                    'elija los 5 finales. Recuperar solo 5 de entrada te deja sin margen de corrección.' },
      ],

      glosario: [
        { t: 'Similitud coseno', d: 'Medida del ángulo entre dos vectores, entre -1 y 1. Ignora la magnitud. La métrica estándar en texto.' },
        { t: 'Producto punto', d: 'Suma de los productos componente a componente. Con vectores normalizados equivale al coseno.' },
        { t: 'Distancia euclidiana (L2)', d: 'Distancia en línea recta entre dos puntos. Poco usada en texto por la influencia de la magnitud.' },
        { t: 'Clase de operadores', d: 'En pgvector, la métrica con la que se construye el índice. Debe coincidir con el operador de la consulta.' },
        { t: 'Top-k', d: 'Cantidad de resultados que devuelve la búsqueda. Conviene amplio antes del re-ranking.' },
        { t: 'Umbral de similitud', d: 'Corte por debajo del cual se descarta un resultado. Se calibra empíricamente, nunca se copia.' },
        { t: 'Re-ranker', d: 'Modelo que reordena los candidatos leyendo el par consulta-documento completo. Más preciso y más lento.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l3',
      titulo: 'Dónde se guardan: pgvector y las bases vectoriales',
      minutos: 9,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> tenés dos opciones — <b>agregarle vectores a la
base que ya usás</b>, o <b>montar una base aparte especializada</b>. Para la mayoría de los proyectos, la
primera es la respuesta correcta.</div>

<h4>Opción A · pgvector — vectores dentro de Postgres</h4>
<p>Es una extensión que le agrega a Postgres un tipo de dato <code>vector</code> y operadores de distancia.
Tus embeddings viven en una columna, al lado del resto de tus datos.</p>

<p><b>Lo que ganás, y es mucho más de lo que parece:</b></p>
<ul>
<li><b>Una sola base.</b> Un backup, un sistema de permisos, un lugar donde mirar.</li>
<li><b>Filtrás y buscás en la misma consulta.</b> "documentos de este cliente, de este año, parecidos a esta pregunta" es un solo <code>SELECT</code>.</li>
<li><b>Transacciones reales.</b> Si guardás un documento y falla el embedding, se revierte todo. Con dos bases separadas te quedan datos huérfanos.</li>
<li><b>RLS de Postgres.</b> El aislamiento entre clientes lo hace la base, no tu código.</li>
</ul>

<p><b>Lo que perdés:</b> a escala muy grande —decenas de millones de vectores— una base dedicada rinde mejor.</p>

<h4>Opción B · base vectorial dedicada</h4>
<p>Pinecone, Qdrant, Weaviate, Milvus. Están hechas para una sola cosa y la hacen muy bien.</p>
<p><b>Lo que ganás:</b> más rendimiento a gran escala, índices más sofisticados, escalado horizontal pensado
para esto.</p>
<p><b>Lo que perdés:</b> un sistema más que operar, respaldar y pagar; los datos quedan partidos en dos lugares;
y el filtrado combinado con metadatos suele ser más limitado que un <code>WHERE</code> de SQL.</p>

<div class="aviso"><strong>La regla honesta:</strong> si ya usás Postgres —y en este workspace, siempre—
<b>empezá con pgvector</b>. Aguanta cómodo del orden del millón de vectores, que es muchísimo más de lo que
tiene casi cualquier producto. Migrás a una base dedicada cuando tengas un problema medido de rendimiento, no
antes. <b>Sumar una base vectorial "porque es lo que se usa" es complejidad que vas a pagar todos los
días.</b></div>
`,

      tecnico: `
<h4>Comparación</h4>
<table>
<tr><th></th><th>pgvector</th><th>Dedicada (Qdrant, Pinecone…)</th></tr>
<tr><td><b>Escala cómoda</b></td><td>Hasta ~1-5M vectores</td><td>Decenas o cientos de millones</td></tr>
<tr><td><b>Filtrado por metadatos</b></td><td>SQL completo, con joins</td><td>Filtros propios, más limitados</td></tr>
<tr><td><b>Transacciones</b></td><td>ACID con el resto de tus datos</td><td>No hay: consistencia eventual entre sistemas</td></tr>
<tr><td><b>Operación</b></td><td>Ninguna extra</td><td>Un servicio más que mantener</td></tr>
<tr><td><b>Aislamiento multi-tenant</b></td><td>RLS nativo</td><td>Por colección o por filtro, implementado por vos</td></tr>
<tr><td><b>Costo</b></td><td>Incluido en tu base</td><td>Servicio aparte</td></tr>
</table>

<h4>Esquema recomendado con pgvector</h4>
<pre><code>create extension if not exists vector;

create table documentos (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null,
  fuente_id     uuid not null,            -- documento original del que salió
  contenido     text not null,            -- el fragmento
  embedding     vector(1536) not null,
  modelo_embedding text not null,         -- para poder migrar de modelo
  metadata      jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

alter table documentos enable row level security;

create policy "tenant aisla documentos" on documentos
  for select using (tenant_id = private.current_tenant_id());

create index on documentos using hnsw (embedding vector_cosine_ops);
create index on documentos (tenant_id);
create index on documentos using gin (metadata);</code></pre>

<div class="dato"><strong>Sobre el filtrado con índices aproximados:</strong> hay una interacción que sorprende.
Si filtrás por <code>tenant_id</code> y ese tenant tiene pocos documentos, el índice HNSW puede devolver
<b>menos resultados de los pedidos</b>, porque explora un vecindario global y después descarta lo que no pasa
el filtro. Se lo llama <i>pre-filtering vs post-filtering</i>. En pgvector se mitiga subiendo
<code>hnsw.ef_search</code>, o usando índices parciales por tenant si son pocos y grandes. <b>Es una causa
real de "faltan resultados" que casi nadie diagnostica.</b></div>

<h4>Cuándo sí conviene una base dedicada</h4>
<ul>
<li>Más de 10 millones de vectores con latencia exigente.</li>
<li>Necesitás índices o funciones que Postgres no tiene: cuantización avanzada, multi-vector, búsqueda dispersa nativa.</li>
<li>La carga de búsqueda vectorial es tan alta que compite con la carga transaccional de tu base principal.</li>
<li>Querés escalar la búsqueda de forma independiente del resto.</li>
</ul>
<p>Ninguno de esos criterios es "lo usa todo el mundo".</p>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <rect x="24" y="24" width="304" height="240" rx="12" fill="#34d399" fill-opacity=".07" stroke="#34d399" stroke-width="1.5"/>
  <text x="44" y="50" fill="#34d399" font-size="13.5" font-weight="700">pgvector  ·  todo en Postgres</text>

  <rect x="44" y="66" width="264" height="112" rx="9" fill="#34d399" fill-opacity=".12" stroke="#34d399" stroke-opacity=".5" stroke-width="1.2"/>
  <text x="60" y="88" fill="currentColor" opacity=".85" font-size="11.5" font-weight="700">una sola base</text>
  <text x="60" y="108" fill="currentColor" opacity=".7" font-size="11">clientes · documentos · embeddings</text>
  <text x="60" y="126" fill="currentColor" opacity=".7" font-size="11">pedidos · usuarios · todo junto</text>
  <text x="60" y="150" fill="#34d399" font-size="11" font-weight="700">un WHERE filtra y busca a la vez</text>
  <text x="60" y="168" fill="#34d399" font-size="11" font-weight="700">RLS aísla los tenants sola</text>

  <text x="44" y="200" fill="currentColor" opacity=".65" font-size="11">✓ un backup · un permiso · un lugar</text>
  <text x="44" y="218" fill="currentColor" opacity=".65" font-size="11">✓ transacciones reales</text>
  <text x="44" y="236" fill="currentColor" opacity=".65" font-size="11">✓ cero operación extra</text>
  <text x="44" y="254" fill="#fbbf24" opacity=".85" font-size="11">− se queda corto pasados varios millones</text>

  <rect x="352" y="24" width="304" height="240" rx="12" fill="#22d3ee" fill-opacity=".07" stroke="#22d3ee" stroke-width="1.5"/>
  <text x="372" y="50" fill="#22d3ee" font-size="13.5" font-weight="700">Base dedicada  ·  dos sistemas</text>

  <rect x="372" y="66" width="122" height="112" rx="9" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".3" stroke-width="1.2"/>
  <text x="433" y="112" text-anchor="middle" fill="currentColor" opacity=".8" font-size="11.5" font-weight="700">Postgres</text>
  <text x="433" y="132" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10.5">tus datos</text>

  <rect x="510" y="66" width="130" height="112" rx="9" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-opacity=".55" stroke-width="1.2"/>
  <text x="575" y="112" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">Qdrant</text>
  <text x="575" y="132" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10.5">los vectores</text>

  <path d="M 494 122 L 510 122" stroke="#f87171" stroke-width="2" stroke-dasharray="3 3"/>
  <text x="502" y="160" text-anchor="middle" fill="#f87171" font-size="10.5" font-weight="700">sincronizar</text>

  <text x="372" y="200" fill="currentColor" opacity=".65" font-size="11">✓ escala a decenas de millones</text>
  <text x="372" y="218" fill="#f87171" opacity=".8" font-size="11">− dos backups, dos permisos, dos costos</text>
  <text x="372" y="236" fill="#f87171" opacity=".8" font-size="11">− sin transacciones entre los dos</text>
  <text x="372" y="254" fill="#f87171" opacity=".8" font-size="11">− filtrado por metadatos más limitado</text>

  <rect x="24" y="284" width="632" height="94" rx="10" fill="#7c5cff" fill-opacity=".08" stroke="#7c5cff" stroke-width="1.4"/>
  <text x="340" y="310" text-anchor="middle" fill="#7c5cff" font-size="13" font-weight="700">
    Si ya usás Postgres: empezá con pgvector.</text>
  <text x="340" y="332" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11.5">
    Aguanta cómodo el orden del millón de vectores — más de lo que tiene casi cualquier producto.</text>
  <text x="340" y="354" text-anchor="middle" fill="currentColor" opacity=".7" font-size="11.5">
    Migrás cuando tengas un problema de rendimiento MEDIDO, no porque “es lo que se usa”.</text>
  <text x="340" y="372" text-anchor="middle" fill="currentColor" opacity=".5" font-size="11">
    Cada sistema que sumás lo pagás todos los días, en operación y en bugs de sincronización.</text>
</svg>`,
        pie: 'La decisión no es técnica sino de costo operativo: un sistema o dos.',
      },

      entrevista: [
        { p: '¿pgvector o una base vectorial dedicada?',
          r: 'Si ya uso Postgres, <b>pgvector</b>, y migro solo con un problema de rendimiento medido. La razón principal no es técnica sino operativa: ' +
             'con pgvector tengo un solo backup, un solo sistema de permisos, transacciones reales entre el documento y su embedding, y puedo ' +
             'combinar búsqueda vectorial con filtros SQL y joins en una sola consulta. Una base dedicada rinde mejor a partir de decenas de millones ' +
             'de vectores, pero antes de eso lo único que agrega es un sistema más que operar y un problema de sincronización.' },

        { p: '¿Cuál es el riesgo de tener los vectores en un sistema separado de tus datos?',
          r: 'La <b>desincronización</b>, que es un problema real y molesto. No hay transacción que abarque los dos sistemas: si guardás el documento ' +
             'en Postgres y falla la escritura del vector, te queda un documento que nunca se va a encontrar; si borrás en Postgres y falla el borrado ' +
             'del vector, te queda un fragmento fantasma que <b>puede aparecer en resultados y llegar al prompt</b>. Eso último es especialmente grave ' +
             'si el motivo del borrado fue una baja de datos o un pedido de eliminación. Se mitiga con una cola de reconciliación, pero es trabajo ' +
             'que con pgvector directamente no existe.' },

        { p: '¿Cómo aislás los datos por cliente en una búsqueda vectorial?',
          r: 'Con el filtro <b>dentro de la consulta</b>, nunca después de recuperar, y respaldado por RLS en Postgres para que el aislamiento no ' +
             'dependa de que ningún programador se olvide. Hay un detalle técnico importante: con índices aproximados como HNSW, filtrar puede ' +
             'devolver <b>menos resultados de los pedidos</b>, porque el índice explora un vecindario global y después descarta lo que no pasa el ' +
             'filtro. Se mitiga subiendo <code>ef_search</code> o con índices parciales. Es una causa real de "faltan resultados" que casi nadie diagnostica.' },
      ],

      practica: `
<h4>La función de búsqueda, con el tenant blindado</h4>
<pre><code>create or replace function buscar_documentos(
  consulta_embedding vector(1536),
  limite int default 50
)
returns table (id uuid, contenido text, similitud float)
language sql stable
security invoker            -- ← respeta RLS del usuario que llama
set search_path = ''
as $$
  select
    d.id,
    d.contenido,
    1 - (d.embedding &lt;=&gt; consulta_embedding) as similitud
  from public.documentos d
  where d.tenant_id = private.current_tenant_id()   -- ← en la consulta
  order by d.embedding &lt;=&gt; consulta_embedding
  limit limite;
$$;</code></pre>

<div class="aviso"><strong>Tres decisiones deliberadas ahí:</strong><br>
<b><code>security invoker</code></b> — la función respeta el RLS del que llama. Con <code>security definer</code>
te saltarías el aislamiento entre clientes, que es exactamente lo que no querés.<br>
<b><code>set search_path = ''</code></b> — evita el secuestro del <i>search path</i>, un vector de ataque real
en funciones de Postgres.<br>
<b>El tenant sale de <code>current_tenant_id()</code></b>, del JWT — nunca de un parámetro que mande el
cliente.</div>

<h4>Migrar de modelo de embeddings sin cortar el servicio</h4>
<pre><code>-- 1 · columna nueva, conviven los dos espacios
alter table documentos add column embedding_v2 vector(3072);

-- 2 · reindexar de a lotes, en background
--     (leés donde embedding_v2 is null, generás, actualizás)

-- 3 · cuando no queda ninguna fila sin migrar, el índice nuevo
create index concurrently on documentos using hnsw (embedding_v2 vector_cosine_ops);

-- 4 · cambiás la consulta a embedding_v2 y recién ahí borrás la vieja</code></pre>
<p>Este es el motivo real por el que conviene guardar <code>modelo_embedding</code> en cada fila: sin ese
campo, la migración es un corte total en vez de un proceso gradual.</p>

<h4>Ajustar cuando faltan resultados al filtrar</h4>
<pre><code>-- HNSW explora un vecindario y DESPUÉS aplica tu WHERE.
-- Si el tenant tiene pocos docs, pueden volver menos de los pedidos.
set hnsw.ef_search = 200;      -- default 40: más lento, más completo</code></pre>
`,

      errores: [
        { mito: 'Para hacer RAG hace falta una base vectorial.',
          realidad: 'Es la creencia que más complejidad innecesaria genera. <b>pgvector aguanta cómodo el orden del millón de vectores</b>, ' +
                    'que es más de lo que tiene casi cualquier producto. Sumar una base dedicada antes de tener un problema medido te agrega ' +
                    'un backup, un costo, un sistema que operar y un problema de sincronización, todos los días.' },

        { mito: 'Puedo filtrar por tenant después de la búsqueda vectorial.',
          realidad: 'Los datos de otro cliente <b>ya salieron de la base</b>. Un descuido posterior y llegan al prompt. El filtro va en la consulta, ' +
                    'y en Postgres además respaldado por <b>RLS</b>, para que el aislamiento no dependa de que nadie se olvide.' },

        { mito: 'Si filtro, el índice me devuelve igual los k mejores del subconjunto.',
          realidad: 'Con índices aproximados como HNSW, <b>no</b>. El índice explora un vecindario global y después descarta lo que no pasa el filtro, ' +
                    'así que podés recibir <b>menos resultados de los que pediste</b>. Se ajusta con <code>hnsw.ef_search</code> o con índices ' +
                    'parciales. Es una causa real de "faltan resultados" que se diagnostica muy tarde.' },

        { mito: 'Cambiar de modelo de embeddings es cambiar una variable de entorno.',
          realidad: 'Hay que <b>regenerar todos los vectores</b>, porque los espacios no son compatibles. Se hace con una columna nueva, migración por ' +
                    'lotes en background y cambio de consulta al final. Sin el campo <code>modelo_embedding</code> en cada fila, esa migración gradual ' +
                    'es imposible y te queda un corte total.' },
      ],

      glosario: [
        { t: 'pgvector', d: 'Extensión de Postgres que agrega el tipo vector y operadores de distancia.' },
        { t: 'Base vectorial', d: 'Base de datos especializada en almacenar y buscar vectores: Pinecone, Qdrant, Weaviate, Milvus.' },
        { t: 'RLS', d: 'Row Level Security. Reglas de acceso por fila aplicadas por Postgres, no por tu código.' },
        { t: 'security invoker', d: 'Función que se ejecuta con los permisos de quien la llama, respetando RLS.' },
        { t: 'Pre-filtering / post-filtering', d: 'Si el filtro por metadatos se aplica antes o después de la búsqueda vectorial. Afecta cuántos resultados obtenés.' },
        { t: 'ef_search', d: 'Parámetro de HNSW que controla cuánto explora la búsqueda. Más alto: más lento y más completo.' },
        { t: 'Reindexado', d: 'Regenerar todos los embeddings de un corpus, necesario al cambiar de modelo.' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l4',
      titulo: 'Índices: por qué la búsqueda vectorial es aproximada',
      minutos: 8,

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> comparar tu pregunta contra un millón de vectores
uno por uno es exacto pero lentísimo. Los índices hacen una <b>búsqueda aproximada</b>: encuentran casi
siempre los mejores, muchísimo más rápido.</div>

<p>Sin índice, buscar significa calcular la distancia contra <b>todos</b> los vectores de la tabla y ordenar.
Con un millón de documentos, eso es un millón de cuentas por consulta. Funciona con mil documentos y no
funciona con un millón.</p>

<p>Un <b>índice vectorial</b> organiza los vectores para no tener que mirarlos todos. Y acá viene lo que
sorprende a todo el mundo:</p>

<div class="aviso"><strong>La búsqueda vectorial indexada es <b>aproximada</b>, no exacta.</strong> Puede
saltearse el mejor resultado. Se llama <i>ANN</i> — Approximate Nearest Neighbor— y es un intercambio
deliberado: renunciás a un poquito de precisión a cambio de ser cien veces más rápido. <b>Esto se pregunta
seguido en entrevistas y muy poca gente lo sabe.</b></div>

<h4>Los dos índices que vas a ver</h4>

<p><b>HNSW</b> — arma una red de vecinos en varios niveles, como un mapa con rutas rápidas y calles locales.
La búsqueda arranca por las rutas rápidas y va bajando. Es el que más se usa: muy rápido y muy preciso.
A cambio, ocupa más memoria y tarda más en construirse.</p>

<p><b>IVFFlat</b> — divide el espacio en barrios y guarda a qué barrio pertenece cada vector. Al buscar, mira
solo los barrios más cercanos. Se construye rápido y ocupa poco, pero es menos preciso.</p>

<table>
<tr><th></th><th>HNSW</th><th>IVFFlat</th></tr>
<tr><td>Velocidad de búsqueda</td><td>Muy rápida</td><td>Rápida</td></tr>
<tr><td>Precisión</td><td>Alta</td><td>Media</td></tr>
<tr><td>Memoria</td><td>Alta</td><td>Baja</td></tr>
<tr><td>Construcción</td><td>Lenta</td><td>Rápida</td></tr>
<tr><td>Datos que cambian seguido</td><td>Bien</td><td>Mal: hay que reconstruirlo</td></tr>
</table>

<p><b>En la práctica: usá HNSW</b>, salvo que la memoria sea un problema serio.</p>

<h4>El detalle que arruina más de un despliegue</h4>
<p>IVFFlat necesita ver los datos para armar los barrios. <b>Si creás el índice sobre una tabla vacía y después
cargás un millón de filas, el índice queda inservible</b> — los barrios se calcularon sobre nada. Hay que
crearlo <i>después</i> de cargar los datos, o reconstruirlo. HNSW no tiene este problema.</p>
`,

      tecnico: `
<h4>HNSW — Hierarchical Navigable Small World</h4>
<p>Construye un grafo multicapa. La capa superior tiene pocos nodos con conexiones de largo alcance; las
inferiores, cada vez más nodos y conexiones más locales. La búsqueda desciende desde arriba, refinando en cada
nivel. La complejidad es aproximadamente logarítmica en la cantidad de vectores.</p>

<table>
<tr><th>Parámetro</th><th>Qué controla</th><th>Efecto</th></tr>
<tr><td><code>m</code></td><td>Conexiones por nodo (default 16)</td><td>Más: mejor recall, más memoria y construcción más lenta</td></tr>
<tr><td><code>ef_construction</code></td><td>Amplitud al construir (default 64)</td><td>Más: mejor índice, construcción más lenta</td></tr>
<tr><td><code>ef_search</code></td><td>Amplitud al buscar (default 40)</td><td>Más: mejor recall, consulta más lenta. <b>Ajustable en caliente</b></td></tr>
</table>

<p>El más útil en el día a día es <code>ef_search</code>: se cambia por sesión, sin reconstruir nada, y es la
palanca directa entre velocidad y exhaustividad.</p>

<h4>IVFFlat — Inverted File with Flat compression</h4>
<p>Agrupa los vectores en <code>lists</code> celdas mediante k-means y guarda la pertenencia. Al buscar, explora
las <code>probes</code> celdas más cercanas al vector de consulta.</p>
<ul>
<li><code>lists</code> ≈ <code>filas / 1000</code> hasta el millón; por encima, <code>sqrt(filas)</code>.</li>
<li><code>probes</code> ≈ <code>sqrt(lists)</code> como punto de partida.</li>
<li><b>Requiere datos representativos al construirse.</b> Sobre tabla vacía queda inútil.</li>
</ul>

<h4>Recall: la métrica que hay que medir y casi nadie mide</h4>
<p><b>Recall@k</b> = proporción de los k verdaderos vecinos más cercanos que el índice efectivamente devolvió.
Se calcula comparando contra una búsqueda exhaustiva sobre una muestra:</p>
<pre><code>-- verdad de referencia: sin índice
set enable_indexscan = off;
select id from documentos order by embedding &lt;=&gt; $1 limit 10;

-- lo que devuelve el índice
set enable_indexscan = on;
select id from documentos order by embedding &lt;=&gt; $1 limit 10;

-- recall@10 = |intersección| / 10</code></pre>

<div class="dato"><strong>Por qué importa de verdad:</strong> un recall del 90% significa que <b>uno de cada
diez fragmentos correctos nunca llega al prompt</b>. El modelo entonces responde sin esa información y el
resultado se percibe como una alucinación. <b>Es un problema de índice diagnosticado como problema de
modelo</b>, y es una de las causas más frecuentes de "el RAG no anda" que nadie encuentra.</div>

<h4>Cuantización</h4>
<p>Para corpus muy grandes, pgvector ofrece almacenamiento reducido:</p>
<ul>
<li><b>halfvec</b> — 16 bits por dimensión en vez de 32. Mitad de memoria, pérdida de calidad muy baja.</li>
<li><b>Cuantización binaria</b> — 1 bit por dimensión. Reducción enorme; se usa como filtro grueso y después se re-puntúa con los vectores completos.</li>
</ul>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="26" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    SIN ÍNDICE  ·  exacto pero inviable</text>
  <rect x="24" y="38" width="632" height="52" rx="10" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.4"/>
  <text x="44" y="60" fill="currentColor" opacity=".8" font-size="11.5">Compara tu pregunta contra los 1.000.000 de vectores, uno por uno.</text>
  <text x="44" y="80" fill="#f87171" font-size="11.5" font-weight="700">100% de precisión  ·  cientos de milisegundos o segundos por consulta</text>

  <text x="24" y="122" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    CON ÍNDICE  ·  aproximado y viable</text>

  <rect x="24" y="134" width="304" height="150" rx="11" fill="#34d399" fill-opacity=".08" stroke="#34d399" stroke-width="1.5"/>
  <text x="44" y="158" fill="#34d399" font-size="13" font-weight="700">HNSW  ·  el que se usa</text>

  <circle cx="70"  cy="184" r="5" fill="#34d399"/>
  <circle cx="170" cy="180" r="5" fill="#34d399"/>
  <circle cx="270" cy="188" r="5" fill="#34d399"/>
  <line x1="70" y1="184" x2="170" y2="180" stroke="#34d399" stroke-width="1.8"/>
  <line x1="170" y1="180" x2="270" y2="188" stroke="#34d399" stroke-width="1.8"/>
  <text x="290" y="188" fill="currentColor" opacity=".45" font-size="9.5">rutas rápidas</text>

  <circle cx="70"  cy="212" r="4" fill="#34d399" fill-opacity=".7"/>
  <circle cx="118" cy="216" r="4" fill="#34d399" fill-opacity=".7"/>
  <circle cx="170" cy="210" r="4" fill="#34d399" fill-opacity=".7"/>
  <circle cx="220" cy="218" r="4" fill="#34d399" fill-opacity=".7"/>
  <circle cx="270" cy="214" r="4" fill="#34d399" fill-opacity=".7"/>
  <line x1="70" y1="212" x2="118" y2="216" stroke="#34d399" stroke-width="1.2" opacity=".6"/>
  <line x1="118" y1="216" x2="170" y2="210" stroke="#34d399" stroke-width="1.2" opacity=".6"/>
  <line x1="170" y1="210" x2="220" y2="218" stroke="#34d399" stroke-width="1.2" opacity=".6"/>
  <line x1="220" y1="218" x2="270" y2="214" stroke="#34d399" stroke-width="1.2" opacity=".6"/>
  <line x1="70" y1="184" x2="70" y2="212" stroke="#34d399" stroke-width="1" opacity=".4" stroke-dasharray="2 2"/>
  <line x1="170" y1="180" x2="170" y2="210" stroke="#34d399" stroke-width="1" opacity=".4" stroke-dasharray="2 2"/>
  <text x="290" y="216" fill="currentColor" opacity=".45" font-size="9.5">calles locales</text>

  <text x="44" y="248" fill="currentColor" opacity=".7" font-size="11">Baja de las rutas rápidas a las locales.</text>
  <text x="44" y="266" fill="#34d399" font-size="11" font-weight="700">rápido + preciso · usa más memoria</text>

  <rect x="352" y="134" width="304" height="150" rx="11" fill="#22d3ee" fill-opacity=".08" stroke="#22d3ee" stroke-width="1.5"/>
  <text x="372" y="158" fill="#22d3ee" font-size="13" font-weight="700">IVFFlat  ·  por barrios</text>

  <circle cx="420" cy="200" r="26" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-opacity=".5"/>
  <circle cx="490" cy="186" r="26" fill="#22d3ee" fill-opacity=".3" stroke="#22d3ee"/>
  <circle cx="558" cy="208" r="26" fill="#22d3ee" fill-opacity=".18" stroke="#22d3ee" stroke-opacity=".5"/>
  <circle cx="490" cy="186" r="4" fill="#fbbf24"/>
  <text x="490" y="232" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-weight="700">solo mira acá</text>
  <text x="418" y="164" text-anchor="middle" fill="currentColor" opacity=".4" font-size="9.5">ignora</text>
  <text x="558" y="248" text-anchor="middle" fill="currentColor" opacity=".4" font-size="9.5">ignora</text>

  <text x="372" y="266" fill="#22d3ee" font-size="11" font-weight="700">liviano · menos preciso · OJO tabla vacía</text>

  <rect x="24" y="300" width="632" height="78" rx="10" fill="#fbbf24" fill-opacity=".08" stroke="#fbbf24" stroke-width="1.4"/>
  <text x="44" y="324" fill="#fbbf24" font-size="12.5" font-weight="700">
    ANN — Approximate Nearest Neighbor: el índice PUEDE saltearse el mejor resultado.</text>
  <text x="44" y="346" fill="currentColor" opacity=".75" font-size="11.5">
    Recall del 90% = 1 de cada 10 fragmentos correctos nunca llega al prompt.</text>
  <text x="44" y="366" fill="currentColor" opacity=".75" font-size="11.5">
    El modelo responde sin esa info y parece una alucinación. Es un problema de ÍNDICE disfrazado de problema de MODELO.</text>
</svg>`,
        pie: 'El intercambio deliberado: un poco de precisión a cambio de ser cien veces más rápido.',
      },

      entrevista: [
        { p: '¿La búsqueda vectorial es exacta?',
          r: 'Con un índice, <b>no</b>: es aproximada. Se la llama <i>ANN</i>, Approximate Nearest Neighbor, y es un intercambio deliberado — ' +
             'renunciás a algo de precisión a cambio de órdenes de magnitud de velocidad. Sin índice sí es exacta, pero implica comparar contra ' +
             'todos los vectores, lo cual deja de ser viable enseguida. La consecuencia práctica es que <b>hay que medir el recall</b>: ' +
             'si es 90%, uno de cada diez fragmentos correctos nunca entra al prompt, y ese error se va a percibir como una alucinación del modelo.' },

        { p: '¿HNSW o IVFFlat?',
          r: '<b>HNSW</b> en casi todos los casos: es más rápido, más preciso y tolera bien las inserciones continuas. Sus costos son más memoria y ' +
             'una construcción más lenta. <b>IVFFlat</b> conviene cuando la memoria es un límite real, se construye mucho más rápido y ocupa menos, ' +
             'pero es menos preciso y tiene una trampa importante: agrupa los vectores con k-means al momento de crearse, así que ' +
             '<b>si lo creás sobre una tabla vacía queda inservible</b>. Hay que construirlo con los datos ya cargados.' },

        { p: '¿Cómo sabés si tu índice vectorial está funcionando bien?',
          r: 'Midiendo <b>recall@k</b> contra una búsqueda exhaustiva sobre una muestra. En Postgres se hace desactivando el índice con ' +
             '<code>enable_indexscan = off</code> para obtener la verdad de referencia, corriendo la misma consulta con el índice, y calculando ' +
             'qué proporción de los k reales aparecieron. Si el recall es bajo, la palanca inmediata es <code>ef_search</code>, que se ajusta en ' +
             'caliente sin reconstruir el índice. <b>Es una métrica que casi nadie mide y explica muchos "el RAG no anda".</b>' },
      ],

      practica: `
<h4>Crear el índice, en el orden correcto</h4>
<pre><code>-- HNSW: se puede crear antes o después de cargar datos
create index concurrently documentos_embedding_hnsw
  on documentos using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- IVFFlat: SIEMPRE con los datos ya cargados
-- lists ≈ filas/1000
create index concurrently documentos_embedding_ivf
  on documentos using ivfflat (embedding vector_cosine_ops)
  with (lists = 1000);</code></pre>
<p><code>concurrently</code> evita bloquear la tabla mientras se construye. En una tabla grande, sin eso, tu
aplicación se queda sin escrituras durante toda la construcción.</p>

<h4>Medir el recall antes de dar por bueno el índice</h4>
<pre><code>async function medirRecall(consultas, k = 10) {
  let total = 0;
  for (const q of consultas) {
    const exacto  = await sql\`set enable_indexscan = off\`.then(() =&gt; buscar(q, k));
    const aproxim = await sql\`set enable_indexscan = on\`.then(() =&gt; buscar(q, k));
    const ids = new Set(exacto.map(r =&gt; r.id));
    total += aproxim.filter(r =&gt; ids.has(r.id)).length / k;
  }
  return total / consultas.length;    // 0.95 = muy bueno · 0.80 = revisá ef_search
}</code></pre>

<div class="aviso"><strong>Cuándo correr esto:</strong> al montar el índice, y de nuevo cuando el corpus crezca
un orden de magnitud. Un índice con buen recall sobre 10.000 documentos puede degradarse con 500.000, y el
síntoma no va a ser un error sino respuestas peores.</div>

<h4>La palanca de emergencia</h4>
<pre><code>-- Faltan resultados o el recall bajó: subí ef_search.
-- No requiere reconstruir nada; se aplica por sesión.
set hnsw.ef_search = 100;       -- default 40

-- Con IVFFlat, el equivalente:
set ivfflat.probes = 20;        -- default 1 (¡muy bajo!)</code></pre>
<p>Ese <code>ivfflat.probes = 1</code> por defecto es una trampa clásica: explora <b>un solo barrio</b>. Si usás
IVFFlat y nunca lo tocaste, tu recall es mucho peor de lo que creés.</p>
`,

      errores: [
        { mito: 'La búsqueda vectorial devuelve siempre los más parecidos.',
          realidad: 'Con índice es <b>aproximada</b>: puede saltearse el mejor resultado. Un recall del 90% suena bien hasta que lo traducís — ' +
                    'uno de cada diez fragmentos correctos nunca llega al prompt, y el modelo responde sin él. <b>Ese error se diagnostica casi ' +
                    'siempre como alucinación</b>, cuando es un problema de índice.' },

        { mito: 'Creo el índice al principio, con la tabla vacía.',
          realidad: 'Con <b>IVFFlat</b> eso lo deja inservible: agrupa los vectores con k-means en el momento de crearse, y sobre una tabla vacía ' +
                    'los grupos se calculan sobre nada. Hay que construirlo con los datos cargados. HNSW no tiene este problema.' },

        { mito: 'Los parámetros por defecto están bien.',
          realidad: 'El caso más grave es <b><code>ivfflat.probes = 1</code></b>: explora un solo barrio y el recall es muy bajo. ' +
                    'Con HNSW, <code>ef_search = 40</code> es razonable pero se queda corto al filtrar por tenant o al crecer el corpus. ' +
                    'Son parámetros que hay que medir, no aceptar.' },

        { mito: 'El índice se configura una vez y listo.',
          realidad: 'El recall se degrada al crecer el corpus. Un índice que rendía bien con 10.000 documentos puede rendir mucho peor con 500.000, ' +
                    'y <b>el síntoma no es un error sino respuestas peores</b>. Conviene volver a medir el recall cada vez que el corpus crece un ' +
                    'orden de magnitud.' },
      ],

      glosario: [
        { t: 'ANN', d: 'Approximate Nearest Neighbor. Búsqueda de vecinos cercanos que sacrifica exactitud por velocidad.' },
        { t: 'HNSW', d: 'Índice basado en un grafo de vecinos multicapa. El más usado: rápido y preciso, con más consumo de memoria.' },
        { t: 'IVFFlat', d: 'Índice que agrupa los vectores en celdas y explora solo las más cercanas. Liviano y menos preciso.' },
        { t: 'Recall@k', d: 'Proporción de los k verdaderos vecinos más cercanos que el índice devolvió. La métrica de calidad del índice.' },
        { t: 'ef_search', d: 'Parámetro de HNSW que controla la amplitud de la búsqueda. Ajustable en caliente.' },
        { t: 'probes', d: 'Cantidad de celdas que explora IVFFlat. Su valor por defecto de 1 es una trampa habitual.' },
        { t: 'concurrently', d: 'Opción de CREATE INDEX que evita bloquear la tabla durante la construcción.' },
        { t: 'Cuantización', d: 'Reducir la precisión numérica de los vectores para ahorrar memoria (halfvec, binaria).' },
      ],
    },

    /* ================================================================== */
    {
      id: 'l5',
      titulo: 'Lo que la búsqueda semántica NO resuelve',
      minutos: 8,
      fuentes: ['bm25', 'paper-hyde', 'cohere-rerank'],

      simple: `
<div class="analogia"><strong>La idea en una frase:</strong> los embeddings son buenísimos para "hablamos de lo
mismo" y bastante malos para "esto es exactamente lo que buscabas". Esa diferencia explica casi todos los
fracasos de RAG.</div>

<p>Después de ver lo bien que funciona la búsqueda semántica, es fácil creer que reemplaza a todo. No es así.
Estos son los casos donde falla, y todos aparecen en producción:</p>

<h4>1 · La negación</h4>
<p>"El envío es gratis" y "el envío <b>no</b> es gratis" tienen una similitud altísima. Hablan del mismo tema.
Para el embedding, esa palabrita de dos letras casi no mueve la aguja — pero cambia el significado por
completo.</p>

<h4>2 · Códigos, identificadores y nombres exactos</h4>
<p>Buscás la factura <code>FA-2024-8871</code>. El embedding entiende "esto parece un identificador de
factura" y te trae la <code>FA-2024-8817</code>, que se le parece muchísimo. <b>Para valores exactos, la
búsqueda por palabra clave es infinitamente mejor.</b></p>

<h4>3 · Preguntas que se parecen a preguntas</h4>
<p>Si tu corpus tiene preguntas frecuentes, la pregunta del usuario va a tener similitud altísima con <i>otras
preguntas</i>, no con las respuestas. Se parecen en forma y en tema. Es una trampa muy común.</p>

<h4>4 · Números, fechas y comparaciones</h4>
<p>"Contratos que vencen antes de marzo" no es una búsqueda semántica: es un <code>WHERE fecha &lt;
'2026-03-01'</code>. Ningún embedding entiende de rangos.</p>

<h4>5 · Términos internos de tu empresa</h4>
<p>Si le llaman "Proyecto Cóndor" al sistema de facturación, el modelo de embeddings no tiene forma de saberlo.
Para él, "Cóndor" es un ave.</p>

<div class="aviso"><strong>La conclusión, y es la que define la arquitectura del próximo módulo:</strong>
la búsqueda semántica es <b>una pieza</b>, no la solución. Un sistema serio combina búsqueda vectorial
<b>+</b> búsqueda por palabra clave <b>+</b> filtros SQL <b>+</b> re-ranking. Eso es la <i>búsqueda
híbrida</i>, y es lo que separa un RAG de demo de uno que funciona.</div>
`,

      tecnico: `
<h4>Las fallas, con su causa</h4>
<table>
<tr><th>Falla</th><th>Por qué ocurre</th><th>Solución</th></tr>
<tr><td>Negación</td><td>El vector codifica el tema; una partícula negativa aporta poca señal</td><td>Re-ranker (lee el par completo) o extracción estructurada</td></tr>
<tr><td>Identificadores exactos</td><td>Los embeddings capturan patrones, no cadenas literales</td><td>BM25 o búsqueda exacta en SQL</td></tr>
<tr><td>Pregunta↔pregunta</td><td>Similitud de forma y tema, no de rol</td><td>Modelo asimétrico con prefijos, o indexar preguntas hipotéticas junto al fragmento</td></tr>
<tr><td>Rangos numéricos y fechas</td><td>El espacio vectorial no tiene noción de orden</td><td>Filtros SQL sobre metadatos</td></tr>
<tr><td>Jerga interna</td><td>No estaba en el entrenamiento del modelo de embeddings</td><td>Expansión de sinónimos, glosario, o BM25 sobre el término literal</td></tr>
<tr><td>Consultas muy cortas</td><td>Poco contexto para ubicar el vector</td><td>Reescritura de consulta con un LLM</td></tr>
</table>

<h4>Búsqueda híbrida</h4>
<p>Combinar búsqueda densa (vectorial) con búsqueda dispersa (BM25) cubre las debilidades de cada una: la
vectorial aporta comprensión de significado, la léxica aporta precisión sobre términos exactos.</p>
<p>La fusión estándar es <b>Reciprocal Rank Fusion (RRF)</b>, que combina por <i>posición</i> en cada ranking en
lugar de por puntaje. Es clave: los puntajes de coseno y de BM25 están en escalas incomparables, así que
sumarlos directamente no tiene sentido.</p>
<pre><code>RRF(doc) = Σ  1 / (k + posición_en_ranking_i)        con k ≈ 60</code></pre>
<p>Un documento que sale segundo en ambos rankings supera a uno que sale primero en uno solo. Eso es
exactamente lo que querés.</p>

<h4>Reescritura de consulta</h4>
<p>Las consultas reales son cortas, ambiguas o dependen del turno anterior de la conversación. Un paso previo
con un LLM chico mejora mucho el retrieval:</p>
<ul>
<li><b>Expansión</b> — agregar sinónimos y términos relacionados.</li>
<li><b>Descontextualización</b> — "¿y el precio?" se convierte en "¿cuál es el precio del plan Pro?" usando el historial. <b>Sin esto, un chat con RAG falla desde el segundo mensaje.</b></li>
<li><b>Descomposición</b> — partir una pregunta compuesta en varias búsquedas.</li>
<li><b>HyDE</b> — generar una respuesta hipotética y buscar con <i>su</i> embedding, en lugar del de la pregunta. Ataca el problema pregunta↔pregunta de raíz.</li>
</ul>

<div class="dato"><strong>La descontextualización es el arreglo con mejor relación esfuerzo/beneficio de todo
RAG conversacional.</strong> En un chat, a partir del segundo mensaje las preguntas son fragmentos ("¿y eso
cuánto sale?") que como consulta aislada no recuperan absolutamente nada. Una llamada barata a un modelo chico
que reescriba la pregunta en forma autónoma arregla una categoría entera de fallas.</div>
`,

      visual: {
        svg: `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, sans-serif">
  <text x="24" y="26" fill="currentColor" opacity=".6" font-size="11.5" font-weight="700">
    DONDE LA BÚSQUEDA SEMÁNTICA FALLA</text>

  <rect x="24" y="38" width="632" height="46" rx="9" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="58" fill="#f87171" font-size="12" font-weight="700">NEGACIÓN</text>
  <text x="170" y="58" fill="currentColor" opacity=".8" font-size="11.5" font-family="monospace">“el envío es gratis”  vs  “el envío NO es gratis”</text>
  <text x="170" y="75" fill="currentColor" opacity=".55" font-size="11">similitud 0.97 — para el vector hablan del mismo tema</text>

  <rect x="24" y="92" width="632" height="46" rx="9" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="112" fill="#f87171" font-size="12" font-weight="700">CÓDIGOS</text>
  <text x="170" y="112" fill="currentColor" opacity=".8" font-size="11.5" font-family="monospace">FA-2024-8871  →  te trae  FA-2024-8817</text>
  <text x="170" y="129" fill="currentColor" opacity=".55" font-size="11">el embedding ve “un identificador de factura”, no la cadena exacta</text>

  <rect x="24" y="146" width="632" height="46" rx="9" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="166" fill="#f87171" font-size="12" font-weight="700">PREGUNTA↔PREGUNTA</text>
  <text x="230" y="166" fill="currentColor" opacity=".8" font-size="11.5">tu pregunta se parece a OTRAS PREGUNTAS, no a las respuestas</text>
  <text x="230" y="183" fill="currentColor" opacity=".55" font-size="11">misma forma, mismo tema, cero utilidad</text>

  <rect x="24" y="200" width="632" height="46" rx="9" fill="#f87171" fill-opacity=".08" stroke="#f87171" stroke-width="1.3"/>
  <text x="44" y="220" fill="#f87171" font-size="12" font-weight="700">RANGOS</text>
  <text x="170" y="220" fill="currentColor" opacity=".8" font-size="11.5">“contratos que vencen antes de marzo”</text>
  <text x="170" y="237" fill="currentColor" opacity=".55" font-size="11">esto es un WHERE, no una búsqueda semántica</text>

  <line x1="24" y1="266" x2="656" y2="266" stroke="currentColor" opacity=".18"/>

  <text x="24" y="292" fill="#34d399" font-size="12.5" font-weight="700">
    LA RESPUESTA: BÚSQUEDA HÍBRIDA</text>

  <rect x="24" y="304" width="146" height="46" rx="9" fill="#7c5cff" fill-opacity=".14" stroke="#7c5cff" stroke-width="1.3"/>
  <text x="97" y="322" text-anchor="middle" fill="#7c5cff" font-size="11.5" font-weight="700">vectorial</text>
  <text x="97" y="339" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">significado</text>

  <text x="178" y="332" fill="currentColor" opacity=".4" font-size="14">+</text>

  <rect x="194" y="304" width="146" height="46" rx="9" fill="#22d3ee" fill-opacity=".14" stroke="#22d3ee" stroke-width="1.3"/>
  <text x="267" y="322" text-anchor="middle" fill="#22d3ee" font-size="11.5" font-weight="700">BM25</text>
  <text x="267" y="339" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">términos exactos</text>

  <text x="348" y="332" fill="currentColor" opacity=".4" font-size="14">+</text>

  <rect x="364" y="304" width="146" height="46" rx="9" fill="#fbbf24" fill-opacity=".14" stroke="#fbbf24" stroke-width="1.3"/>
  <text x="437" y="322" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="700">filtros SQL</text>
  <text x="437" y="339" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">fechas, rangos, tenant</text>

  <text x="518" y="332" fill="currentColor" opacity=".4" font-size="14">+</text>

  <rect x="534" y="304" width="122" height="46" rx="9" fill="#34d399" fill-opacity=".16" stroke="#34d399" stroke-width="1.4"/>
  <text x="595" y="322" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700">re-ranking</text>
  <text x="595" y="339" text-anchor="middle" fill="currentColor" opacity=".55" font-size="10">lee el par completo</text>

  <text x="340" y="374" text-anchor="middle" fill="currentColor" opacity=".6" font-size="11.5">
    Se fusionan por POSICIÓN (RRF), no sumando puntajes: coseno y BM25 están en escalas incomparables.</text>
</svg>`,
        pie: 'Cada pieza cubre la debilidad de las otras. Ninguna sola alcanza.',
      },

      entrevista: [
        { p: '¿Cuáles son las limitaciones de la búsqueda por embeddings?',
          r: 'Cinco, y todas aparecen en producción. <b>La negación</b>: "el envío es gratis" y "el envío no es gratis" quedan casi pegados porque ' +
             'hablan del mismo tema. <b>Los identificadores exactos</b>: buscando una factura te devuelve otra con número parecido, porque captura ' +
             'patrones y no cadenas literales. <b>La confusión pregunta-pregunta</b>: la consulta se parece más a otras preguntas del corpus que a ' +
             'las respuestas. <b>Los rangos numéricos y fechas</b>, que son un <code>WHERE</code> y no una búsqueda semántica. Y <b>la jerga interna</b>, ' +
             'que el modelo de embeddings nunca vio. Por eso un sistema serio usa búsqueda híbrida y re-ranking, no solo vectores.' },

        { p: '¿Qué es la búsqueda híbrida y cómo se fusionan los resultados?',
          r: 'Es combinar búsqueda densa (vectorial) con búsqueda dispersa por palabras clave (BM25). La densa aporta comprensión del significado; ' +
             'la léxica aporta precisión sobre términos exactos, códigos y jerga. Lo importante es <b>cómo se combinan</b>: no se pueden sumar los ' +
             'puntajes, porque la similitud coseno y el puntaje BM25 están en escalas totalmente distintas. Se usa <b>Reciprocal Rank Fusion</b>, ' +
             'que combina por <i>posición</i> en cada ranking: un documento que sale segundo en ambos le gana a uno que sale primero en uno solo.' },

        { p: 'Tu chat con RAG funciona bien en el primer mensaje y mal a partir del segundo. ¿Qué pasa?',
          r: 'Falta <b>descontextualizar la consulta</b>. A partir del segundo turno las preguntas son fragmentos que dependen del contexto: ' +
             '"¿y eso cuánto sale?" como consulta aislada no recupera nada, porque no menciona de qué está hablando. La solución es un paso previo ' +
             'con un modelo chico y barato que reescriba la pregunta en forma autónoma usando el historial —"¿cuál es el precio del plan Pro?"— y ' +
             'buscar con <i>eso</i>. <b>Es el arreglo con mejor relación esfuerzo/beneficio de todo RAG conversacional</b>: una llamada barata que ' +
             'elimina una categoría entera de fallas.' },

        { p: '¿Qué es HyDE?',
          r: '<i>Hypothetical Document Embeddings</i>. En vez de buscar con el embedding de la pregunta, le pedís al modelo que genere una respuesta ' +
             'hipotética —aunque sea inventada— y buscás con el embedding de <b>esa respuesta</b>. Ataca de raíz el problema pregunta↔pregunta: ' +
             'una respuesta hipotética se parece mucho más a la respuesta real que la pregunta original. El costo es una llamada extra al modelo ' +
             'antes de cada búsqueda, así que conviene donde la calidad del retrieval justifique esa latencia.' },
      ],

      practica: `
<h4>Búsqueda híbrida en Postgres, con RRF</h4>
<pre><code>with vectorial as (
  select id, row_number() over (order by embedding &lt;=&gt; $1) as pos
  from documentos
  where tenant_id = $3
  order by embedding &lt;=&gt; $1
  limit 50
),
lexica as (
  select id, row_number() over (
    order by ts_rank_cd(busqueda_tsv, plainto_tsquery('spanish', $2)) desc
  ) as pos
  from documentos
  where tenant_id = $3
    and busqueda_tsv @@ plainto_tsquery('spanish', $2)
  limit 50
)
select
  coalesce(v.id, l.id) as id,
  coalesce(1.0 / (60 + v.pos), 0) +
  coalesce(1.0 / (60 + l.pos), 0) as puntaje_rrf
from vectorial v
full outer join lexica l on v.id = l.id
order by puntaje_rrf desc
limit 20;</code></pre>
<p>El <code>full outer join</code> es lo que hace que entre un documento que solo aparece en uno de los dos
rankings — que es justamente el caso que la búsqueda vectorial sola se pierde.</p>

<h4>Descontextualizar la consulta en un chat</h4>
<pre><code>async function consultaAutonoma(historial, pregunta) {
  // Modelo chico: es una tarea mecánica, no justifica el modelo principal
  const r = await llamarModelo({
    tarea: 'clasificar',
    mensajes: [{ role: 'user', content:
      \`Reescribí la pregunta para que se entienda SIN el historial.
       No la respondas. Si ya es autónoma, devolvela igual.

       Historial:
       \${historial.slice(-4).map(m =&gt; m.role + ': ' + m.content).join('\\n')}

       Pregunta: \${pregunta}\` }],
  });
  return r.texto.trim();
}

// "¿y eso cuánto sale?"  →  "¿cuál es el precio del plan Pro?"</code></pre>

<div class="aviso"><strong>Cuándo saltear este paso:</strong> si es el primer mensaje de la conversación, no
hace falta — es una llamada y una latencia de más. Un simple <code>if (historial.length === 0)</code> te ahorra
esa llamada en un buen porcentaje de los casos.</div>

<h4>Checklist antes de dar por bueno un retrieval</h4>
<table>
<tr><th>Verificá</th><th>Cómo</th></tr>
<tr><td>¿Encuentra por identificador exacto?</td><td>Buscá un código que exista y mirá si sale primero</td></tr>
<tr><td>¿Distingue afirmación de negación?</td><td>Dos fragmentos opuestos sobre el mismo tema</td></tr>
<tr><td>¿Anda en el segundo turno del chat?</td><td>Pregunta de seguimiento con pronombre</td></tr>
<tr><td>¿Respeta filtros de fecha y rango?</td><td>Consulta con restricción temporal</td></tr>
<tr><td>¿Entiende la jerga interna?</td><td>Un término propio de la empresa</td></tr>
</table>
<p>Los cinco fallan con búsqueda vectorial sola. Si los cinco pasan, tu retrieval está bien armado.</p>
`,

      errores: [
        { mito: 'La búsqueda semántica reemplaza a la búsqueda por palabras clave.',
          realidad: 'Se <b>complementan</b>. Para códigos, identificadores, nombres propios y jerga interna, BM25 le gana claramente: ' +
                    'los embeddings capturan patrones, no cadenas literales. Lo estándar en un sistema serio es la búsqueda híbrida con fusión por RRF.' },

        { mito: 'Si la similitud es alta, el fragmento sirve.',
          realidad: 'Alta similitud significa "hablan de lo mismo", no "acá está la respuesta". Una pregunta y otra pregunta parecida tienen ' +
                    'similitud altísima y ninguna responde a la otra. <b>El re-ranking existe precisamente para esta distinción</b>, porque lee el ' +
                    'par consulta-documento completo en vez de comparar dos puntos.' },

        { mito: 'Puedo indexar los rangos de fechas y números como texto.',
          realidad: 'El espacio vectorial no tiene noción de orden: no hay forma de que "antes de marzo" se resuelva por proximidad. ' +
                    'Eso va en <b>metadatos con filtros SQL</b>. Intentar resolverlo con embeddings es una de las formas más rápidas de perder una semana.' },

        { mito: 'En un chat, busco directamente con lo que escribió el usuario.',
          realidad: 'Funciona en el primer mensaje y falla en el segundo. "¿Y eso cuánto sale?" como consulta aislada no recupera nada. ' +
                    'Hace falta <b>descontextualizar con el historial</b> antes de buscar — una llamada barata a un modelo chico que elimina ' +
                    'una categoría entera de fallas.' },
      ],

      glosario: [
        { t: 'Búsqueda densa', d: 'Búsqueda por embeddings. Captura significado.' },
        { t: 'Búsqueda dispersa', d: 'Búsqueda por frecuencia de términos, como BM25 o TF-IDF. Captura coincidencias literales.' },
        { t: 'BM25', d: 'Algoritmo clásico de ranking por palabras clave. Sigue siendo muy fuerte para términos exactos.' },
        { t: 'Búsqueda híbrida', d: 'Combinación de búsqueda densa y dispersa. El estándar en sistemas de producción.' },
        { t: 'RRF', d: 'Reciprocal Rank Fusion. Fusiona rankings por posición, no por puntaje, porque las escalas no son comparables.' },
        { t: 'Reescritura de consulta', d: 'Transformar la consulta del usuario antes de buscar: expandir, descontextualizar o descomponer.' },
        { t: 'Descontextualización', d: 'Reescribir una pregunta de seguimiento para que se entienda sin el historial.' },
        { t: 'HyDE', d: 'Generar una respuesta hipotética y buscar con su embedding en lugar del de la pregunta.' },
        { t: 'tsvector', d: 'Tipo de Postgres para búsqueda de texto completo. Es la mitad léxica de una búsqueda híbrida.' },
      ],
    },
  ],

  /* ==================================================================== */
  examen: [
    {
      p: '¿Qué es un embedding?',
      opciones: [
        'Un vector de números donde la cercanía refleja similitud de significado',
        'Una versión comprimida del texto que se puede volver a expandir',
        'Un resumen del texto generado por un LLM',
        'Un índice de las palabras clave del documento',
      ],
      correcta: 0,
      porQue: 'Es una representación aprendida donde la proximidad geométrica se corresponde con la similitud semántica. Eso es lo que permite encontrar "dar de baja el plan" buscando "cancelar suscripción".',
      porQueNo: {
        1: 'No es reversible: no se puede reconstruir el texto original a partir del vector.',
        2: 'Un resumen es texto. Un embedding es un vector numérico y lo genera un modelo distinto.',
        3: 'Eso describe un índice invertido tipo BM25, que es búsqueda dispersa, no densa.',
      },
    },
    {
      p: '¿Podés comparar un embedding de un modelo con el de otro modelo?',
      opciones: [
        'No: cada modelo define su propio espacio y no hay correspondencia entre ellos',
        'Sí, si tienen la misma cantidad de dimensiones',
        'Sí, aplicando una normalización previa',
        'Solo si ambos son del mismo proveedor',
      ],
      correcta: 0,
      porQue: 'Por eso cambiar de modelo de embeddings obliga a regenerar todos los vectores del corpus, y por eso conviene guardar en cada fila qué modelo la generó: permite migrar de forma incremental.',
      porQueNo: {
        1: 'La dimensionalidad coincidente no implica ninguna relación entre los espacios.',
        2: 'La normalización ajusta la magnitud, no traduce entre espacios distintos.',
        3: 'Dos modelos del mismo proveedor tampoco comparten espacio vectorial.',
      },
    },
    {
      p: '¿Qué métrica de similitud se usa habitualmente con embeddings de texto?',
      opciones: [
        'Similitud coseno, porque mide el ángulo e ignora la magnitud',
        'Distancia euclidiana, porque es la más intuitiva',
        'Diferencia absoluta componente a componente',
        'Distancia de edición entre los textos originales',
      ],
      correcta: 0,
      porQue: 'La magnitud del vector tiende a reflejar la extensión del texto más que su tema. El coseno mira solo hacia dónde apunta, que es lo que interesa.',
      porQueNo: {
        1: 'Le afecta demasiado la magnitud; con vectores normalizados da el mismo ranking que el coseno, así que no aporta nada.',
        2: 'No es una métrica de similitud semántica estándar.',
        3: 'Opera sobre las cadenas, no sobre los vectores. Es otra cosa.',
      },
    },
    {
      p: 'Creaste el índice con vector_l2_ops y consultás con el operador <=>. ¿Qué pasa?',
      opciones: [
        'Postgres no usa el índice —hace escaneo secuencial— y no avisa nada',
        'Devuelve un error de tipos',
        'Funciona igual: los operadores son intercambiables',
        'Convierte automáticamente entre métricas',
      ],
      correcta: 0,
      porQue: 'Es el error más silencioso del módulo. Se manifiesta como "la búsqueda anda lenta" o "los resultados son raros" y se confirma con EXPLAIN ANALYZE: si ves Seq Scan en lugar de Index Scan, es esto.',
      porQueNo: {
        1: 'No hay error ni warning, y por eso el bug sobrevive semanas.',
        2: 'La clase de operadores del índice debe coincidir con el operador de la consulta.',
        3: 'No existe ninguna conversión automática entre métricas.',
      },
    },
    {
      p: 'Tenés 300.000 documentos y ya usás Postgres. ¿Qué conviene?',
      opciones: [
        'pgvector: aguanta cómodo esa escala y evita operar un sistema más',
        'Pinecone, porque es la opción profesional',
        'Qdrant, para separar la carga de búsqueda',
        'Una base vectorial cualquiera: Postgres no sirve para vectores',
      ],
      correcta: 0,
      porQue: 'pgvector aguanta cómodo el orden del millón de vectores. Además te da transacciones reales, filtros SQL combinados con la búsqueda y RLS para aislar tenants. Se migra con un problema de rendimiento medido, no antes.',
      porQueNo: {
        1: 'Sumar un sistema sin necesidad medida agrega backup, costo, operación y un problema de sincronización.',
        2: 'Separar la carga tiene sentido a escalas mucho mayores, no con 300.000 documentos.',
        3: 'pgvector es una solución sólida y ampliamente usada en producción.',
      },
    },
    {
      p: 'En un sistema multi-tenant, ¿dónde va el filtro por tenant en una búsqueda vectorial?',
      opciones: [
        'Dentro de la consulta, respaldado por RLS',
        'Después de recuperar, filtrando el array de resultados',
        'En el prompt, pidiéndole al modelo que ignore lo ajeno',
        'En el frontend, antes de mostrar',
      ],
      correcta: 0,
      porQue: 'Si filtrás después, los datos del otro cliente ya salieron de la base y basta un descuido para que lleguen al prompt. El aislamiento va en la consulta y respaldado por RLS para que no dependa de que nadie se olvide.',
      porQueNo: {
        1: 'Los datos ajenos ya se recuperaron. Es una filtración esperando ocurrir.',
        2: 'Confiar el aislamiento de datos a una instrucción en lenguaje natural no es un control de seguridad.',
        3: 'Todavía peor: los datos ya viajaron al cliente.',
      },
    },
    {
      p: '¿La búsqueda vectorial con índice es exacta?',
      opciones: [
        'No: es aproximada (ANN) y puede saltearse el mejor resultado',
        'Sí, siempre devuelve los k más cercanos',
        'Sí, con HNSW; no con IVFFlat',
        'Depende de la métrica elegida',
      ],
      correcta: 0,
      porQue: 'Es un intercambio deliberado: algo de precisión a cambio de órdenes de magnitud de velocidad. Un recall del 90% significa que uno de cada diez fragmentos correctos nunca llega al prompt, y ese error se percibe como alucinación.',
      porQueNo: {
        1: 'Solo la búsqueda exhaustiva sin índice lo garantiza, y deja de ser viable enseguida.',
        2: 'HNSW también es aproximado, aunque con mejor recall que IVFFlat.',
        3: 'La aproximación viene de la estructura del índice, no de la métrica.',
      },
    },
    {
      p: '¿Cuál es la trampa de IVFFlat?',
      opciones: [
        'Agrupa los vectores al construirse: sobre una tabla vacía queda inservible',
        'No soporta la métrica coseno',
        'No se puede usar en Postgres',
        'Consume más memoria que HNSW',
      ],
      correcta: 0,
      porQue: 'Usa k-means para armar las celdas en el momento de crearse. Si la tabla está vacía, los grupos se calculan sobre nada. Hay que construirlo con los datos ya cargados. HNSW no tiene este problema.',
      porQueNo: {
        1: 'Soporta las tres métricas, igual que HNSW.',
        2: 'Es una de las dos opciones de índice de pgvector.',
        3: 'Al revés: IVFFlat consume bastante menos memoria que HNSW.',
      },
    },
    {
      p: '¿Qué mide el recall@k de un índice vectorial?',
      opciones: [
        'Qué proporción de los k verdaderos vecinos más cercanos devolvió el índice',
        'Cuántos resultados devolvió en total',
        'La similitud promedio de los resultados',
        'Cuánto tardó la consulta',
      ],
      correcta: 0,
      porQue: 'Se calcula comparando contra una búsqueda exhaustiva sobre una muestra. Es la métrica de calidad del índice y casi nadie la mide, lo que explica muchos "el RAG no anda" que en realidad son índices mal configurados.',
      porQueNo: {
        1: 'Esa es la cantidad devuelta, no dice nada sobre si eran los correctos.',
        2: 'La similitud promedio puede ser alta aunque falten los mejores resultados.',
        3: 'Eso es latencia. Recall es exhaustividad.',
      },
    },
    {
      p: '"El envío es gratis" y "el envío no es gratis" en búsqueda vectorial:',
      opciones: [
        'Tienen similitud altísima: el embedding captura el tema, no la negación',
        'Tienen similitud muy baja por la negación',
        'Tienen similitud negativa',
        'No se pueden comparar',
      ],
      correcta: 0,
      porQue: 'Es una de las fallas conocidas de los embeddings. Se corrige con re-ranking, que lee el par consulta-documento completo en vez de comparar dos puntos comprimidos.',
      porQueNo: {
        1: 'Una partícula negativa aporta muy poca señal al vector frente al resto del contenido.',
        2: 'La similitud negativa implicaría vectores opuestos, y estos son casi idénticos.',
        3: 'Se comparan perfectamente: el problema es que el resultado engaña.',
      },
    },
    {
      p: 'Necesitás encontrar la factura con número exacto FA-2024-8871. ¿Qué usás?',
      opciones: [
        'Búsqueda por palabra clave o consulta SQL exacta',
        'Búsqueda vectorial, que entiende el formato',
        'Un embedding del número solo',
        'Un LLM que lo busque leyendo todo',
      ],
      correcta: 0,
      porQue: 'Los embeddings capturan patrones, no cadenas literales: con búsqueda vectorial te puede devolver la FA-2024-8817, que "se le parece". Para valores exactos, BM25 o SQL son infinitamente mejores.',
      porQueNo: {
        1: 'Entiende que es un identificador de factura, y por eso mismo confunde unos con otros.',
        2: 'Sigue siendo búsqueda semántica, con la misma debilidad.',
        3: 'Carísimo, lento y menos confiable que un WHERE.',
      },
    },
    {
      p: '¿Cómo se fusionan los resultados en una búsqueda híbrida?',
      opciones: [
        'Con RRF: combinando la posición en cada ranking, no los puntajes',
        'Sumando el puntaje de coseno y el de BM25',
        'Promediando ambos puntajes',
        'Quedándose siempre con el ranking vectorial',
      ],
      correcta: 0,
      porQue: 'La similitud coseno y el puntaje BM25 están en escalas incomparables, así que combinarlos directamente no significa nada. RRF usa la posición: un documento segundo en ambos rankings le gana a uno primero en uno solo.',
      porQueNo: {
        1: 'Sumar números en escalas distintas produce un ranking arbitrario.',
        2: 'Promediar tiene el mismo problema que sumar.',
        3: 'Eso anula el aporte de la búsqueda léxica, que es justamente lo que cubre códigos y jerga.',
      },
    },
    {
      p: 'Tu chat con RAG anda bien en el primer mensaje y falla desde el segundo. ¿Qué falta?',
      opciones: [
        'Descontextualizar la consulta con el historial antes de buscar',
        'Subir el top_k de la búsqueda',
        'Cambiar el modelo de embeddings',
        'Bajar la temperatura',
      ],
      correcta: 0,
      porQue: 'Desde el segundo turno las preguntas son fragmentos como "¿y eso cuánto sale?", que aislados no recuperan nada. Reescribirlas en forma autónoma con un modelo chico es el arreglo con mejor relación esfuerzo/beneficio de todo RAG conversacional.',
      porQueNo: {
        1: 'Traer más resultados de una consulta que no dice de qué habla no ayuda.',
        2: 'El modelo de embeddings no es el problema: la consulta está incompleta.',
        3: 'La temperatura afecta la generación, no la recuperación.',
      },
    },
    {
      p: '¿Por qué la búsqueda vectorial conviene recuperar 50 candidatos en vez de 5?',
      opciones: [
        'Es un filtro grueso: la precisión final la aporta el re-ranking',
        'Porque cuanto más contexto reciba el modelo, mejor responde',
        'Para aprovechar mejor el índice',
        'Porque el límite mínimo de pgvector es 50',
      ],
      correcta: 0,
      porQue: 'La búsqueda vectorial es rápida pero imprecisa, porque comprime cada texto en un punto. Lo estándar es recuperar 30-50 candidatos y dejar que un re-ranker, que lee el par completo, elija los 5 finales.',
      porQueNo: {
        1: 'Al contrario: mandar 50 fragmentos al prompt es caro y empeora la respuesta por el lost in the middle. Los 50 son para re-rankear, no para el prompt.',
        2: 'El tamaño del top-k no cambia la eficiencia del índice de esa forma.',
        3: 'No existe tal límite.',
      },
    },
  ],
});
