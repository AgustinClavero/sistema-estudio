# Estudio — Clavecode

Plataforma personal de estudio. **Abrí `index.html` con doble clic y listo.** Sin instalar nada, sin internet, sin build.

---

## Cómo se usa

1. Doble clic en `index.html`.
2. El escritorio te dice qué repasar hoy y por dónde seguir.
3. Arrancá el pomodoro (botón ▶ abajo a la derecha, o la barra espaciadora).
4. Leé, rendí el examen del módulo, avanzá.

El progreso se guarda solo, en el navegador. **Usá siempre el mismo navegador**, porque el progreso vive ahí.

**Tema claro por defecto**, con modo nocturno en **Ajustes → Apariencia** (se recuerda). Los cursos se muestran en cards con portada; las imágenes son fotos de Pexels guardadas dentro de `assets/`, así que también funcionan sin internet.

### Atajos

| Tecla | Qué hace |
|---|---|
| `Espacio` | Arranca / pausa el pomodoro |
| `←` `→` | Lección anterior / siguiente |

---

## Cómo funciona el estudio

**Cada lección tiene 8 pestañas.** No hace falta leerlas todas: 🟢 *En criollo* y 🔵 *Técnico* explican lo mismo con distinta profundidad. Las otras seis son 📊 un diagrama, 💼 las preguntas de entrevista, 🛠️ el código real, ⚠️ los errores comunes, 📖 el glosario y 📚 las fuentes.

> **📚 Fuentes.** Todo el contenido lo escribió un modelo de lenguaje **desde su entrenamiento** — sin recuperación y sin citas. Esa pestaña dice de dónde salió, cuál es la fecha de corte, y **dónde verificar** cada tema, con una marca de cuánto confiar: 🔴 *verificá siempre* (precios, versiones, APIs), 🟡 *cambia cada tanto*, 🟢 *estable* (fundamentos). Si algo va a definir una decisión real, verificalo ahí primero.

**Cada módulo termina en un examen.** Necesitás **70%** para desbloquear el siguiente. Reintentos ilimitados, preguntas y opciones barajadas. Cada respuesta explica el porqué de la correcta *y* de las que descartaste.

**Repaso espaciado.** Toda pregunta que fallás vuelve a aparecer a los **1, 3, 7, 16 y 35 días**. Si la acertás cinco veces seguidas queda *dominada* y deja de aparecer. Es lo que hace que en tres meses te acuerdes.

> Cinco minutos de repaso valen más que media hora de lectura nueva. Si el escritorio te muestra repasos pendientes, empezá por ahí.

---

## Los tracks

| Track | Módulos | Lecciones | Lectura |
|---|---|---|---|
| 🧠 **Ingeniería en IA** | 10 | 48 | ~7 h |
| ☁️ **Infraestructura y Cloud** | 11 | 44 | ~6 h |
| 🏛️ **Arquitectura de software** | 10 | 40 | ~5 h |
| 📣 **Paid Media** | 8 | 19 | ~2,5 h |
| 🧩 **Lógica de programación** | 7 | 7 | ~1 h |
| 🗣️ **Inglés A1** | 12 | 48 | ~6,5 h |

**Total: 58 módulos · 206 lecciones · 823 preguntas de examen · 234 ejercicios · 266 palabras.**

### El track de inglés funciona distinto

Los cinco primeros son de leer y rendir. El de inglés además **suena y te hace escribir**:

- **Audio en todo.** Cualquier frase marcada en naranja se escucha al tocarla, a velocidad
  normal o lenta. Usa la voz que ya tiene instalada Windows — sin internet y sin descargar nada.
- **Pestaña 🎧 Escucha.** Escuchás, escribís lo que oíste, y recién después se revela el texto.
  Con botón para **grabarte repitiendo** y compararte con el modelo.
- **Ejercicios de verdad**, no solo opción múltiple: completar, dictado, traducir y ordenar
  la oración. Cuando errás te muestra **palabra por palabra** qué pusiste de más y qué te faltó.
- **Vocabulario** con repaso espaciado, igual que las preguntas de examen.

> **La voz es sintética y solo estadounidense.** Sirve para dictado y vocabulario, pero
> **no reemplaza escuchar humanos reales**. La pestaña 📚 Fuentes de cada módulo te dice dónde
> escucharlos — eso sí necesita internet.

El orden sugerido está en el escritorio, y cada track termina proponiendo con cuál seguir.

---

## Llevarte el progreso a otro dispositivo

**Ajustes → Exportar progreso** baja un `.json`. En el otro navegador, **Importar progreso**.

Importar **reemplaza** todo el progreso actual, no lo fusiona.

---

## Para el que agregue contenido (o para Claude)

### Estructura

```
estudio/
  index.html                  ← lo único que se abre
  assets/
    nucleo.js                 ← namespace, registro y carga de scripts
    store.js                  ← progreso, repaso espaciado, logros (localStorage)
    quiz.js                   ← motor de exámenes y repaso
    pomodoro.js               ← temporizador
    vistas.js                 ← el HTML de cada pantalla
    app.js                    ← router por hash y eventos
    app.css
  contenido/
    _fuentes.js               ← catálogo de fuentes + aviso de procedencia
    _registro.js              ← lista de tracks (la única lista global)
    ia/
      track.js                ← temario del track
      m00-mapa.js             ← un archivo por módulo
      m01-llm.js
      m02-trabajar.js
    arquitectura/track.js
    infra/track.js
    logica/track.js
    ingles-a1/track.js
```

Los tracks de idioma suman dos archivos al motor: `assets/audio.js` (la voz) y
`assets/ingles.js` (ejercicios, escucha y shadowing). Las reglas para escribir ese contenido
están en [AGENTS.md](AGENTS.md) y el diseño completo en
[docs/diseno-track-ingles.md](docs/diseno-track-ingles.md).

### Por qué el contenido son `.js` y no `.json`

Al abrir con `file://`, el navegador bloquea `fetch()` por CORS pero **sí** permite `<script src>`. Por eso cada módulo es un `.js` que se auto-registra llamando a `ESTUDIO.registrarModulo({...})`, y `app.js` los inyecta bajo demanda.

**No cambiar esto a JSON**: rompe el requisito de "doble clic y funciona".

### Agregar un módulo

1. Crear `contenido/<track>/mNN-<nombre>.js` con la forma de abajo.
2. En `contenido/<track>/track.js`, poner en ese módulo:
   `estado: 'listo'`, `archivo: 'mNN-<nombre>.js'`, `lecciones: <cantidad>`, `minutos: <total>`.

El campo `lecciones` **tiene que coincidir** con la cantidad real, porque de ahí sale el cálculo de progreso.

### Forma de un módulo

```js
ESTUDIO.registrarModulo({
  track: 'ia',
  id: 'm03',
  titulo: '...',
  fuentes: ['pgvector', 'mteb'],          // claves de contenido/_fuentes.js
  intro: '<p>...</p>',                    // opcional

  lecciones: [{
    id: 'l1',
    titulo: '...',
    minutos: 9,
    simple:     `<p>...</p>`,             // explicación sin jerga
    tecnico:    `<p>...</p>`,             // la misma idea, con precisión
    visual:     { svg: `<svg …>`, pie: '...', nota: '<p>…</p>' },
    entrevista: [{ p: 'pregunta', r: 'respuesta modelo' }],
    practica:   `<p>...</p>`,             // código y casos reales
    errores:    [{ mito: '...', realidad: '...' }],
    glosario:   [{ t: 'término', d: 'definición' }],
    fuentes:    ['paper-hnsw'],           // opcional: pisa las del módulo
  }],

  examen: [{
    p: 'pregunta',
    opciones: ['a', 'b', 'c', 'd'],
    correcta: 0,                          // índice en `opciones`
    porQue: 'por qué esa es la correcta',
    porQueNo: { 1: '...', 2: '...', 3: '...' },   // índices ≠ correcta
  }],
});
```

Las pestañas sin contenido no se muestran: todos los campos de una lección salvo `titulo` y `minutos` son opcionales.

### Fuentes

El módulo declara `fuentes: ['clave1', 'clave2']` con claves de `contenido/_fuentes.js`. Una lección puede declarar las suyas y **pisa** las del módulo — útil cuando una lección trata un tema con fuentes distintas al resto.

Para agregar una fuente nueva, sumala al catálogo con los cuatro campos:

```js
'clave-corta': {
  nombre: 'Nombre visible',
  url: 'https://…',
  que: 'Qué conviene verificar exactamente ahí.',
  volatilidad: 'alta',    // alta | media | baja
}
```

El validador comprueba que toda clave usada exista, que las URLs sean válidas, y avisa si una fuente del catálogo no la usa nadie.

### Convenciones de contenido

- **`simple` y `tecnico` cubren lo mismo**, no son continuación uno del otro.
- **Los SVG se escriben a mano**, sin librerías. Usar `currentColor` con `opacity` para el texto neutro, y colores literales (`#7c5cff`, `#34d399`, `#f87171`, `#fbbf24`, `#22d3ee`, `#c084fc`) para los acentos, así funcionan en tema claro y oscuro. `viewBox` de ~680 de ancho.
- **En `errores`, el `mito` es la creencia equivocada** y `realidad` la corrección.
- **En el examen, `porQueNo` nunca lleva la clave de `correcta`.**
- Las preguntas y las opciones se barajan solas: no escribir "todas las anteriores" ni referirse a las opciones por letra.

### Trampa a evitar

El contenido va en template literals (`` ` ``). **Un backtick sin escapar rompe el archivo entero** y el módulo deja de cargar. Pasa fácil al escribir bloques de código markdown dentro de un ejemplo — usar `&#96;` en ese caso.

Antes de dar por buena una tanda de contenido:

```bash
node --check contenido/ia/m03-embeddings.js
```

### Agregar un track

1. Crear `contenido/<id>/track.js` con `ESTUDIO.registrarTrack({...})`.
2. Sumar `'<id>/track.js'` al array de `contenido/_registro.js`.

No hay que tocar nada más: la barra lateral, el escritorio y la página de progreso lo levantan solos.

---

## Verificado

- Funciona con `file://` (doble clic, sin servidor): tracks, carga de módulos bajo demanda, `localStorage` y exámenes.
- Sin errores de consola en las 12 rutas.
- Responsive hasta 375 px, sin scroll horizontal.
- Tema claro y oscuro.
