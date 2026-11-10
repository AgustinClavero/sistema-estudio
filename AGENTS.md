# AGENTS.md — Estudio (`estudio/`)

> Fuente única de reglas, estado e historial de este proyecto, para Claude Code y Codex.
> `CLAUDE.md` es solo `@AGENTS.md`: editá este archivo.
> Antes de tocar nada: leé `T:/CLAVE USER/Desktop/PROYECTOS-CLAUDE/AGENTS.md` (reglas del workspace)
> y las últimas entradas de `T:/CLAVE USER/Desktop/PROYECTOS-CLAUDE/docs/BITACORA.md`.
> También el `README.md` de este proyecto: explica el modelo pedagógico (8 pestañas por lección,
> examen al 70%, repaso espaciado). Respetalo, no lo reinventes.
>
> Última actualización: 2026-11-10

## Qué es

Plataforma personal de estudio del owner. No es un producto de la agencia ni de un cliente.
**HTML/JS estático, sin build, sin dependencias, sin internet.** Se abre con doble clic en
`index.html` (protocolo `file://`). El progreso vive en `localStorage` del navegador (clave
`estudio:v1`), con export/import desde Ajustes para llevarlo a otro dispositivo.

Estado real: terminado y en uso, sin deploy ni dominio. Repo en GitHub: `AgustinClavero/sistema-estudio`
(una sola rama, `main`, un solo commit hasta hoy).

**No sigue el stack canónico del workspace (Next.js + Supabase) y es deliberado.** La gracia es
que funcione con doble clic para siempre, sin toolchain. No lo "modernices" salvo pedido explícito
del owner. Tampoco aplican las reglas de multi-tenant, RLS, Sentry ni Inngest del workspace.

## Cómo se corre

- Uso normal: doble clic en `index.html`.
- Servidor local para la vista previa (`.claude/launch.json`, config `estudio`):
  `python -m http.server 4173` y abrir `http://localhost:4173`.
- Validación (el único test que hay): `node validar.mjs`.
- No hay `package.json`, ni install, ni build, ni lint, ni typecheck.

## Stack

Vanilla JS (scripts clásicos, sin módulos ES en el navegador), CSS propio, SVG a mano para los
diagramas. `validar.mjs` es un script de Node sin dependencias. Voz con `speechSynthesis` del
navegador (en Windows usa las voces instaladas). Sin servicios externos.

## Estructura

```
index.html              lo único que se abre
validar.mjs             validador de contenido
assets/
  nucleo.js             namespace ESTUDIO, registro y carga de scripts bajo demanda
  iconos.js             set de íconos SVG (E.icono) + mapas ICONO_CURSO e ICONO_PEST
  store.js              progreso, repaso espaciado (1/3/7/16/35 días), logros, localStorage
  quiz.js               motor de exámenes, ejercicios escritos y repaso
  audio.js              voz sintética y atributo data-say
  ingles.js             ejercicios interactivos, pestaña Escucha, shadowing
  pomodoro.js           temporizador
  vistas.js             el HTML de cada pantalla
  app.js                router por hash y eventos
  app.css
  img/cursos/<id>.jpg   portada de cada curso (fotos de Pexels, locales)
contenido/
  _registro.js          lista de tracks (la única lista global)
  _fuentes.js           catálogo de fuentes + aviso de procedencia
  <track>/track.js      temario del track
  <track>/mNN-*.js      un archivo por módulo
docs/diseno-track-ingles.md   contrato del track de idioma
```

Tracks (ids): `ia`, `arquitectura`, `infra`, `paidmedia`, `logica`, `ingles-a1`.

## Entornos y deploy

No hay. Sin entornos, sin variables de entorno, sin CI. Se versiona en git y se usa en local.
Trunk-based con ramas cortas y PR a `main`, como el resto del workspace.

## Reglas del proyecto

- **El contenido son archivos `.js`, no `.json`.** `fetch()` está bloqueado bajo `file://`
  pero `<script src>` no. Cada módulo se auto-registra con `ESTUDIO.registrarModulo({...})`.
  Pasarlo a JSON rompe el "doble clic y funciona".
- **Sin internet en ejecución.** Nada de CDN, fuentes web ni imágenes remotas. Las portadas de
  curso van locales en `assets/img/cursos/<trackId>.jpg` (Pexels, licencia libre, sin
  atribución). Track nuevo: bajá una foto con sentido y guardala con el id del track
  (o seteá `track.imagen`).
- **Íconos, no emojis, en el chrome** (barra lateral, cards, pestañas, pomodoro, botones):
  usar `E.icono('nombre')`. Los emojis quedan solo como contenido (badges de logros, el 🔊 de
  palabras en inglés, prosa de lecciones). Track nuevo: agregar su entrada en `ICONO_CURSO`
  (si no, cae al ícono `cap`).
- **Tema claro por defecto**, nocturno opcional en Ajustes. Contraste: los acentos vivos
  (`--simple-c`, `--entrev-c`, `--prac-c`...) pensados para fondo oscuro no pasan 4.5:1 sobre
  blanco. Como borde o fondo tintado va el vivo; como `color:` de texto va la variante `--*-t`.
  Nunca un `--*-c` como color de texto.
- **Los diagramas van sobre lienzo oscuro fijo en los dos temas** (`.diagrama { --diag-bg }`):
  evita reescribir los ~200 SVG. No cambiar ese fondo a claro.
- **Un archivo por módulo**, `mNN-<slug>.js`, registrado en el `track.js` con `estado: 'listo'`,
  `archivo`, `lecciones` (tiene que coincidir con la cantidad real: de ahí sale el progreso) y
  `minutos`. Track nuevo: `ESTUDIO.registrarTrack({...})` y sumarlo a `contenido/_registro.js`.
- **Cada lección lleva sus 8 pestañas:** en criollo, técnico, diagrama, entrevista, práctica,
  errores comunes, glosario, fuentes. Cada módulo cierra con examen (70% para desbloquear el
  siguiente) y cada respuesta explica por qué la correcta lo es y por qué las otras no.
- **La pestaña de fuentes es obligatoria y honesta.** El contenido lo escribió un modelo desde
  su entrenamiento, sin recuperación ni citas reales; cada tema lleva su confianza (rojo: verificá
  siempre precios, versiones y APIs; amarillo: cambia cada tanto; verde: estable). No inventes
  URLs ni cites fuentes que no verificaste. El aviso de procedencia es parte del diseño.
- **Claves del repaso espaciado:** `track/mod/qN` (examen), `track/mod/vN` (vocabulario),
  `track/mod/eN` (ejercicio, aplanando las lecciones en orden). Dependen del índice: reordenar
  en un módulo ya publicado le cambia el sentido a las tarjetas en cola. Agregar siempre al final.
- **Track de idioma (`ingles-*`):** un track por nivel (`ingles-a2`, `ingles-b1`...). Pestañas
  propias (suma Escucha, no exige Entrevista; el validador usa `PESTANAS_IDIOMA`). Ejercicios en
  `lec.ejercicios` con `tipo`: `opcion`, `hueco`, `dictado`, `traducir`, `ordenar` (en `ordenar` las
  fichas se derivan de la respuesta). Vocabulario en `mod.vocabulario` `{ en, es, ejemplo, ejemploEs }`.
  Audio con atributo `data-say` (vacío = dice el texto del elemento; `data-rate="lento"`).
  Las equivalencias válidas se declaran en `respuestas: [...]`, no se adivinan: la corrección
  perdona mayúsculas, espacios, puntuación y apóstrofo, pero no la `-s` ni los artículos.
  Contrato completo en `docs/diseno-track-ingles.md`.
- **Sin emojis de bandera:** Windows no tiene esos glifos y los dibuja como letras ("GB").
- **Ser honesto sobre el audio:** voz sintética y solo estadounidense, sirve para dictado y
  vocabulario, no reemplaza escuchar humanos. Eso va en la pestaña de fuentes.
- **Shadowing sin puntaje automático:** `SpeechRecognition` de Chrome manda audio a Google y
  rompería el "sin internet".

## Estado actual

Los seis tracks están cerrados. `node validar.mjs` (corrido el 2026-11-10 sobre este árbol):
58 módulos, 206 lecciones, 823 preguntas, 234 ejercicios, 266 palabras, 71/71 fuentes en uso.

| Track | Módulos | Lecciones |
|---|---|---|
| Ingeniería en IA (`ia`) | 10 | 48 |
| Infraestructura y Cloud (`infra`) | 11 | 44 |
| Arquitectura de software (`arquitectura`) | 10 | 40 |
| Paid Media (`paidmedia`) | 8 | 19 |
| Lógica de programación (`logica`) | 7 | 7 |
| Inglés A1 (`ingles-a1`) | 12 | 48 |

No hay ramas ni PR abiertos. Lo que queda es mantenimiento: revisar lo marcado en rojo en la
pestaña de fuentes cuando envejezca (precios, versiones y APIs de IA, nube y paid media).

## Historial

- 2026-09-14: primer commit en git (`04cc238`); hasta entonces vivía en el workspace sin repo.
  Remoto `AgustinClavero/sistema-estudio`.
- 2026-08-11: rediseño visual tipo e-learning. Tema claro por defecto, íconos SVG propios,
  "Cursos" con portada local, tokens `--*-t` para texto y lienzo fijo oscuro para diagramas.
- 2026-08-08: track `ingles-a1` completo (12 módulos). Motor de idioma nuevo: `audio.js`,
  `ingles.js`, ejercicios escritos con corrección por diff palabra a palabra en `quiz.js`.
  Decisión: fonética antes que gramática, un track por nivel, test de nivelación postergado.
- 2026-08-08: cerrados los cinco primeros tracks (46 módulos); se agregó el export/import de progreso.
- Origen: plataforma sin build con 8 pestañas por lección, examen por módulo, repaso espaciado y pomodoro.

## Pendientes

- [ ] Niveles A2 a C1 de inglés, un track por nivel, solo si el owner lo pide. El motor ya está;
  es contenido puro (A2 estimado a ojo: 6-8 h humano · 2-3 h con IA, a confirmar con el owner).
- [ ] Test de nivelación: recién tiene sentido con más de un nivel.
- [ ] Revisar lo marcado en rojo en la pestaña de fuentes cuando pase tiempo (versiones, precios, APIs).

## Trampas conocidas

- **Backtick sin escapar dentro de un template literal** rompe el archivo entero y el módulo deja
  de cargar en silencio. Usar `&#96;`. Aparece al escribir markdown o ejemplos tipo
  `aws ... --query 'X[?Fecha<=&#96;2026-02-01&#96;]'`.
- **`${...}` literal dentro de un template literal**: escapar el `$` como `\$`. Típico en YAML de
  GitHub Actions (`\${{ secrets.X }}`).
- `node validar.mjs` detecta las dos como `SyntaxError`: correrlo siempre antes de dar por
  terminado un módulo. También chequea que `lecciones` en `track.js` coincida, pestañas faltantes y
  la integridad de los exámenes (`correcta` en rango, `porQueNo` sin apuntar a la correcta, opciones duplicadas).
- `speechSynthesis.getVoices()` devuelve `[]` en la primera llamada: hay que esperar `voiceschanged`
  (resuelto en `audio.js`).
- En tema claro `--ok` (#34d399) sobre blanco da 1.9:1: el diff usa `--w-falta-c`/`--w-sobra-c`
  con variantes oscuras.
- El panel de vista previa del IDE sirve un snapshot y puede no releer archivos cambiados. Para
  verificar de verdad, un script headless contra el `file://` real.
- `Store.desbloqueado()` no traba cuando el módulo anterior está `pendiente`: se pueden escribir
  módulos fuera de orden.
- El progreso está atado al navegador: abrir en otro navegador o perfil arranca de cero.

## Cómo mantener este archivo

Al cerrar una sesión de trabajo en este proyecto: actualizar "Estado actual", "Historial" y
"Pendientes" y la fecha de "Última actualización", además de la entrada de la bitácora del workspace.
