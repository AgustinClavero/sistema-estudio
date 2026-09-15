# AGENTS.md — Estudio

> Contexto de este proyecto para **cualquier agente** (Claude Code, Codex, Gemini, Cursor…).
> `CLAUDE.md` es solo un import que apunta acá — **editá este archivo, no aquél.**
>
> **Antes de tocar nada, leé:**
> 1. `README.md` de este proyecto — explica el modelo pedagógico completo (8 pestañas por
>    lección, examen al 70%, repaso espaciado a 1/3/7/16/35 días). **Respetalo, no lo reinventes.**
> 2. `../AGENTS.md` — reglas del workspace.
> 3. `../docs/BITACORA.md` — estado vivo del trabajo entre sesiones y agentes.

## Qué es

Plataforma personal de estudio. **HTML/JS estático, sin build, sin dependencias, sin internet.**
Se abre haciendo doble clic en `index.html`. El progreso vive en `localStorage` del navegador.

> ⚠️ **Este proyecto NO sigue el stack canónico del workspace** (Next.js + Supabase), y está bien así.
> Es deliberado: la gracia es que funcione con doble clic para siempre, sin toolchain que mantener.
> **No lo "modernices"** a menos que el owner lo pida explícitamente.

## Estructura

```
index.html            ← lo único que se abre
assets/
  nucleo.js           ← namespace, registro y carga de scripts
  iconos.js           ← set de íconos SVG (E.icono) — reemplazan a los emojis del chrome
  store.js            ← progreso, repaso espaciado, logros (localStorage)
  quiz.js             ← motor de exámenes, ejercicios y repaso
  audio.js            ← voz sintética (speechSynthesis) para el track de idioma
  ingles.js           ← ejercicios interactivos, escucha y shadowing
  pomodoro.js         ← temporizador
  vistas.js           ← el HTML de cada pantalla
  app.js              ← router por hash y eventos
  app.css
  img/cursos/<id>.jpg ← portada de cada curso (fotos de Pexels, locales)
contenido/
  _registro.js        ← lista de tracks (la única lista global)
  _fuentes.js         ← catálogo de fuentes + aviso de procedencia
  <track>/track.js    ← temario del track
  <track>/mNN-*.js    ← un archivo por módulo
docs/
  diseno-track-ingles.md  ← el contrato del track de idioma
```

## Diseño (look e-learning, tema claro por defecto)

Estilo tipo Udemy/devtalles: **tema claro por defecto**, con modo nocturno opcional
(toggle en Ajustes, persistido en `localStorage`). Los planes de estudio se muestran como
**Cursos**, en cards con foto de portada.

- **Íconos, no emojis, en el chrome.** Barra lateral, cards, pestañas, pomodoro y botones
  usan `E.icono('nombre')` de `assets/iconos.js` (SVG de línea, `currentColor`, funcionan en
  los dos temas). Los emojis solo quedan como **contenido**: badges de logros, el 🔊 de las
  palabras en inglés, y los emojis dentro de la prosa de las lecciones. No los conviertas.
- **Portadas de curso:** `assets/img/cursos/<trackId>.jpg`. Son fotos de **Pexels descargadas
  localmente** (licencia libre, sin atribución). Van locales sí o sí — una URL externa rompe
  el offline. Para un curso nuevo, bajá una foto con sentido y guardala con el id del track.
  El renderer la toma por convención; si querés otra ruta, seteá `track.imagen`.
- **Íconos por curso y por pestaña:** mapas `E.ICONO_CURSO` y `E.ICONO_PEST` en `iconos.js`.
  Track nuevo → agregá su entrada en `ICONO_CURSO` (si no, cae al ícono `cap` por defecto).

### Trampa de contraste (tokens de acento como texto)

Los acentos vivos (`--simple-c`, `--entrev-c`, `--prac-c`…) fueron pensados para **fondo
oscuro**. Sobre blanco **no pasan 4.5:1**. Regla:

- Acento como **borde o fondo tintado** → usar el vivo (`--simple-c`).
- Acento como **texto** → usar su variante **`--*-t`** (`--simple-t`, `--entrev-t`, `--enlace`…),
  que en tema claro se oscurece. Nunca poner un `--*-c` como `color:` de texto.
- **Los diagramas van sobre lienzo oscuro fijo en los dos temas** (`.diagrama { --diag-bg }`),
  así los `fill` literales de los SVG y el texto `currentColor` mantienen contraste sin tener
  que reescribir ni un diagrama. **No cambies el fondo del diagrama a claro.**

## Reglas al agregar contenido

- **Un archivo por módulo**, nombrado `mNN-<slug>.js`. Registralo en el `track.js` del track.
- `contenido/_registro.js` es la **única lista global** — si agregás un track, va ahí.
- **Cada lección lleva sus 8 pestañas.** No las omitas: 🟢 en criollo, 🔵 técnico, 📊 diagrama,
  💼 preguntas de entrevista, 🛠️ código real, ⚠️ errores comunes, 📖 glosario, 📚 fuentes.
- **La pestaña de fuentes es obligatoria y honesta.** Todo el contenido lo escribe un modelo
  desde su entrenamiento, sin recuperación ni citas reales. Cada tema lleva su marca de
  confianza: 🔴 verificá siempre (precios, versiones, APIs) · 🟡 cambia cada tanto · 🟢 estable.
  **No inventes URLs ni cites fuentes que no verificaste.**
- Cada módulo cierra con examen. Cada respuesta explica por qué la correcta es correcta
  **y por qué las otras no**.

## Reglas del track de idioma (`ingles-*`)

Los tracks de idioma usan un set de pestañas distinto: suman 🎧 **Escucha** y no exigen
💼 Entrevista en cada lección. El validador ya lo contempla (`PESTANAS_IDIOMA`).
El contrato completo está en [docs/diseno-track-ingles.md](docs/diseno-track-ingles.md).

- **Un track por nivel** — `ingles-a1`, `ingles-a2`… Un track de 60 módulos sería inmanejable.
- **Audio: el atributo `data-say`.** Cualquier elemento con `data-say` suena al hacerle clic.
  Con valor dice ese texto; vacío, dice el texto del propio elemento.
  ```html
  <span class="en" data-say>Where are you from?</span>
  <button data-say="Good morning" data-rate="lento">🐢</button>
  ```
- **Ejercicios** en `lec.ejercicios`, con `tipo`: `opcion` · `hueco` · `dictado` · `traducir` ·
  `ordenar`. Los escritos llevan `respuesta` (y `respuestas: [...]` para las alternativas
  válidas). En `ordenar`, las fichas **se derivan de la respuesta** — no se declaran aparte.
- **Vocabulario** en `mod.vocabulario`: `{ en, es, ejemplo, ejemploEs }`. Se practica desde
  la página del módulo y alimenta el repaso espaciado.
- **La corrección de texto perdona** mayúsculas, espacios, puntuación y tipo de apóstrofo.
  **No perdona** la `-s` de tercera persona ni los artículos. Si hay varias respuestas
  válidas, declaralas — **no se adivinan equivalencias**, porque adivinar mal enseña mal.
- **Nada de emojis de bandera.** Windows no tiene glifos de bandera y los dibuja como dos
  letras sueltas ("GB"). Verificado en Chrome sobre Windows 11.
- **Sé honesto sobre el audio.** La voz es sintética, robótica y solo estadounidense. Sirve
  para dictado y vocabulario; **no reemplaza escuchar humanos**. Eso va en 📚 Fuentes.

### Claves del repaso espaciado

Hay tres tipos, y las tres dependen del **índice**:

| Clave | De dónde sale |
|---|---|
| `track/mod/qN` | `mod.examen[N]` |
| `track/mod/vN` | `mod.vocabulario[N]` |
| `track/mod/eN` | N-ésimo ejercicio del módulo, aplanando las lecciones en orden |

> ⚠️ Reordenar preguntas, vocabulario o ejercicios de un módulo **ya publicado** le cambia
> el significado a las tarjetas que el usuario tenga en cola. Agregá al final, no en el medio.

## Validación

```bash
node validar.mjs
```

**Corré esto siempre antes de dar por terminado un módulo.** Es el único test que hay.

## Estado (2026-08-08)

| Track | Módulos | Lecciones | Estado |
|---|---|---|---|
| 🧠 Ingeniería en IA | 10 | 48 | ✅ completo |
| ☁️ Infraestructura y Cloud | 11 | 44 | ✅ completo |
| 🏛️ Arquitectura de software | 10 | 40 | ✅ completo |
| 📣 Paid Media | 8 | 19 | ✅ completo |
| 🧩 Lógica de programación | 7 | 7 | ✅ completo |
| 🗣️ Inglés A1 | 12 | 48 | ✅ completo |

**Totales: 58 módulos · 206 lecciones · 823 preguntas · 234 ejercicios · 266 palabras · 71 fuentes.**

Los seis tracks están **cerrados**. Lo que queda es mantenimiento: revisar lo marcado
🔴 en 📚 Fuentes cuando envejezca.

**Lo que sigue, si el owner lo pide:** los niveles **A2 a C1** de inglés, un track por nivel
(`ingles-a2`, `ingles-b1`…). El motor de idioma ya está terminado y verificado, así que es puro
contenido. El **test de nivelación** recién tiene sentido cuando exista más de un nivel — hoy
no hay adónde saltar.

## Trampas al escribir contenido

Las dos rompen **el archivo entero** y el módulo deja de cargar **en silencio** en el navegador.
`node validar.mjs` las detecta como `SyntaxError` — por eso hay que correrlo siempre.

1. **Backtick sin escapar** dentro de un template literal → usar `&#96;`.
   Aparece al escribir bloques de código markdown, o en ejemplos tipo
   `aws … --query 'X[?Fecha<=&#96;2026-02-01&#96;]'`.
2. **`${...}` literal** dentro de un template literal → escapar el `$` como `\$`.
   Aparece en YAML de GitHub Actions (`\${{ secrets.X }}`, `\${{ github.sha }}`).

Otro detalle: `Store.desbloqueado()` **no traba** cuando el módulo anterior está `pendiente`,
así que se pueden escribir módulos fuera de orden sin romper la navegación.
