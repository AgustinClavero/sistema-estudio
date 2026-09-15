# Diseño — Track de inglés

**Fecha:** 2026-08-08 · **Estado:** ✅ implementado — motor + nivel A1 completo (12 módulos, 48 lecciones)

Este documento es el contrato del track de inglés. Si algo del código no coincide con
lo de acá, uno de los dos está mal.

---

## 1. Qué se decidió y por qué

**Un track por nivel** (`ingles-a1`, `ingles-a2`, … `ingles-c1`), no un track único con
60 módulos. Motivo: la barra lateral y el desbloqueo por examen funcionan por track;
un track de 60 módulos sería inmanejable. El campo `siguientes` encadena A1 → A2.

**Se construye A1 solo.** El owner arranca de cero. Los otros cuatro niveles quedan sin
escribir hasta que haga falta.

**El test de nivelación se posterga.** Sirve recién cuando existan varios niveles y haya
adónde saltar. Construirlo ahora es trabajo que no se usa.

**Base general + capa profesional.** Once módulos de inglés general y uno final de inglés
de trabajo, que aplica lo anterior a standups, calls y entrevistas. La capa profesional va
al final, no al principio: sin base no hay dónde apoyarla.

---

## 2. Restricciones que no se negocian

Las mismas del resto de la plataforma: **HTML/JS estático, sin build, sin dependencias,
sin internet, doble clic en `index.html`**. Todo lo de abajo respeta eso.

---

## 3. Audio

### Qué se verificó (2026-08-08, Chrome sobre `file://`)

| | |
|---|---|
| `speechSynthesis` | ✅ funciona bajo `file://` |
| Voces inglesas | ✅ 3, todas `localService: true` — David, Mark, Zira (en-US) |
| `isSecureContext` | ✅ `true` → `getUserMedia` y `MediaRecorder` disponibles |

`localService: true` es lo que habilita todo: esas voces viven en Windows, no en un
servidor. Cero archivos de audio, cero red.

### Cómo se usa desde el contenido

Un atributo, y un solo manejador de clicks delegado en todo el documento:

```html
<!-- dice su propio texto -->
<span class="en" data-say>Where are you from?</span>

<!-- dice un texto distinto del que muestra -->
<button data-say="Where are you from?">🔊</button>
```

Ningún archivo de módulo tiene que cablear nada. Funciona en la prosa, en el glosario,
en los ejercicios y en la pestaña de escucha por igual.

### Trampas resueltas en `assets/audio.js`

1. **`getVoices()` devuelve `[]` en la primera llamada.** Hay que esperar `voiceschanged`.
   Confirmado en esta máquina: primera llamada 0 voces, segunda 6.
2. **Chrome falla si hay un `utterance` pendiente** → `cancel()` antes de cada `speak()`.
3. **Si no hay ninguna voz inglesa instalada**, la plataforma lo dice en pantalla en vez
   de fallar en silencio.

### Límites, dichos en voz alta

Voces SAPI5, robóticas, **solo acento estadounidense**. Sirven para dictado, vocabulario
y frases sueltas. **No reemplazan escuchar humanos reales** a velocidad natural. La pestaña
📚 Fuentes de cada módulo enlaza a dónde escuchar gente de verdad, y eso sí necesita internet.

---

## 4. Tipos de ejercicio

`quiz.js` hoy solo acepta el índice de una opción. Se extiende con un campo `tipo`:

| `tipo` | Qué hace el que estudia | Campo con la respuesta |
|---|---|---|
| `opcion` (default) | Elige entre opciones | `correcta` (índice) |
| `hueco` | Escribe la palabra que falta | `respuesta` |
| `dictado` | 🔊 Escucha y tipea | `respuesta` |
| `traducir` | Ve español, escribe inglés | `respuesta` |
| `ordenar` | Arma la oración con las palabras desordenadas | `respuesta` |

En `ordenar`, las fichas desordenadas **se derivan de `respuesta`** — el contenido no las
declara aparte, así no pueden quedar desincronizadas.

### Corrección de texto

**Perdona lo que no cambia el significado:** mayúsculas, espacios de más, puntuación final,
tipo de apóstrofo (`'` vs `’`).

**No perdona lo que sí:** falta la `s` de tercera persona, falta el artículo, orden distinto.

Cuando hay varias respuestas válidas (`I'm` / `I am`), el contenido declara `respuestas: [...]`.
No se intenta adivinar equivalencias automáticamente: adivinar mal enseña mal.

**Feedback:** diff palabra por palabra (LCS) que muestra qué escribiste y qué faltaba,
marcando la diferencia exacta. Es la parte que más enseña de todo el motor.

---

## 5. Repaso espaciado: tres tipos de tarjeta

El SRS existente es agnóstico de la clave, así que **`store.js` no cambia**. Lo que cambia
es cómo `quiz.js` reconstruye la pregunta a partir de la clave:

| Clave | De dónde sale |
|---|---|
| `track/mod/qN` | `mod.examen[N]` — ya existía |
| `track/mod/vN` | `mod.vocabulario[N]` — nuevo |
| `track/mod/eN` | N-ésimo ejercicio del módulo, aplanando las lecciones en orden — nuevo |

> ⚠️ Los tres dependen del **índice**. Reordenar preguntas, vocabulario o ejercicios de un
> módulo ya publicado le cambia el significado a las tarjetas que el usuario tenga en cola.
> Es una limitación que ya tenía el diseño original; se documenta, no se arregla ahora.

### Vocabulario

```js
vocabulario: [
  { en: 'work', es: 'trabajar', ejemplo: 'I work from home.', ejemploEs: 'Trabajo desde casa.' },
]
```

Se practica desde la página del módulo. Cada tarjeta se pregunta como `traducir` (ES → EN).
Lo que fallás entra al repaso espaciado igual que una pregunta de examen.

---

## 6. Pestañas de una lección de inglés

Las 8 existentes se reinterpretan y **se suma una novena, 🎧 Escucha**. Las pestañas ya son
opcionales (campo ausente = pestaña oculta), así que sumar una no rompe ningún track viejo.

| Pestaña | En un track técnico | En inglés |
|---|---|---|
| 🟢 En criollo | explicación sin jerga | la regla en criollo |
| 🔵 Técnico | la misma idea con precisión | la gramática con precisión |
| 📊 Visual | diagrama | líneas de tiempo verbales |
| 🎧 **Escucha** | — | **dictado y comprensión** |
| 💼 En una entrevista | preguntas de entrevista | la estructura en una situación de trabajo |
| 🛠️ En la práctica | código real | prosa + **ejercicios interactivos** |
| ⚠️ Errores comunes | mitos | **el error típico del hispanohablante** |
| 📖 Glosario | términos | vocabulario con audio |
| 📚 Fuentes | dónde verificar | dónde escuchar humanos reales |

Los ejercicios viven en un campo nuevo `lec.ejercicios` y se dibujan en la pestaña 🛠️,
debajo de la prosa de `lec.practica` si la hay.

---

## 7. Shadowing con micrófono

Grabás tu voz repitiendo la frase y escuchás **la tuya contra el modelo**, una después de
la otra.

**Sin puntaje automático, y es a propósito.** Se podría usar `SpeechRecognition`, pero en
Chrome eso manda tu audio a servidores de Google — rompe la regla de "sin internet" — y
devuelve un puntaje poco confiable que te haría desconfiar del resto de la plataforma.
Tu oído comparando dos audios es mejor juez, y es como funciona el shadowing de verdad.

Si el permiso de micrófono se deniega, se explica qué pasó y el resto de la lección
sigue funcionando.

---

## 8. Los 12 módulos de A1

| | Módulo |
|---|---|
| m00 | Cómo suena el inglés — por qué no se lee como se escribe |
| m01 | To be, pronombres, presentarte |
| m02 | Sustantivos, artículos, plurales |
| m03 | Present simple |
| m04 | There is / there are, lugares |
| m05 | Can, pedir cosas |
| m06 | Present continuous |
| m07 | Pasado de to be y verbos regulares |
| m08 | Verbos irregulares, contar qué hiciste |
| m09 | Futuro: going to / will |
| m10 | Preguntas, cantidades, comparar |
| m11 | Tu trabajo en inglés — standup, call, pedir que repitan |

~48 lecciones y ~500 palabras de vocabulario.

---

## 9. Orden de construcción

1. Motor: `audio.js`, tipos de ejercicio, vocabulario SRS, pestaña escucha, shadowing.
2. `validar.mjs` al día con las formas nuevas.
3. `track.js` de A1 + `m00` y `m01` completos.
4. **Verificar en el navegador real** antes de escribir los otros diez módulos.

El paso 4 es el que evita escribir 48 lecciones con un formato de ejercicios que no sirve.
