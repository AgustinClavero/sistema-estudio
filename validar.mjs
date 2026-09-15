/* ==========================================================================
   validar.mjs — chequeo de todo el contenido sin abrir el navegador.
   Uso:  node validar.mjs
   Verifica sintaxis, coherencia con el temario, pestañas y exámenes.
   ========================================================================== */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const RAIZ = dirname(fileURLToPath(import.meta.url));

/* Pestañas que se esperan en una lección. Los tracks de idioma cambian el
   set: suman 🎧 escucha y no exigen 💼 entrevista en cada lección. */
const PESTANAS = ['simple', 'tecnico', 'visual', 'entrevista', 'practica', 'errores', 'glosario'];
const PESTANAS_IDIOMA = ['simple', 'tecnico', 'visual', 'escucha', 'practica', 'errores', 'glosario'];
const esIdioma = (trackId) => /^ingles/.test(trackId);

/* Tipos de ejercicio que se responden escribiendo. */
const ESCRITOS = ['hueco', 'dictado', 'traducir', 'ordenar'];

const problemas = [];
const avisos = [];
const fallo = (m) => problemas.push(m);
const aviso = (m) => avisos.push(m);

// Se declara acá arriba para que `informar()` lo pueda leer aunque
// la validación se corte antes de cargar el contenido.
const ESTUDIO = { tracks: {}, modulos: {}, archivosTrack: [] };
ESTUDIO.registrarTrack = (t) => { ESTUDIO.tracks[t.id] = t; };
ESTUDIO.registrarModulo = (m) => { ESTUDIO.modulos[m.track + '/' + m.id] = m; };

/* ---------- 1 · sintaxis de todos los .js ---------- */

const archivosJs = [
  ...readdirSync(join(RAIZ, 'assets')).filter(f => f.endsWith('.js')).map(f => join('assets', f)),
  'contenido/_registro.js',
];
for (const dir of readdirSync(join(RAIZ, 'contenido'), { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  for (const f of readdirSync(join(RAIZ, 'contenido', dir.name))) {
    if (f.endsWith('.js')) archivosJs.push(join('contenido', dir.name, f));
  }
}

for (const rel of archivosJs) {
  try {
    execFileSync(process.execPath, ['--check', join(RAIZ, rel)], { stdio: 'pipe' });
  } catch (e) {
    const salida = (e.stderr || '').toString();
    const linea = salida.match(/:(\d+)\n/)?.[1] ?? '?';
    const causa = salida.match(/SyntaxError: .*/)?.[0] ?? 'error de sintaxis';
    fallo(`${rel}:${linea} — ${causa}`);
    fallo(`   ↳ casi siempre es un backtick sin escapar dentro de un template literal (usar &#96;)`);
  }
}
if (problemas.length) { informar(); process.exit(1); }

/* ---------- 2 · cargar el contenido en un ESTUDIO falso ---------- */

const contexto = vm.createContext({ ESTUDIO, console });
const ejecutar = (rel) => vm.runInContext(readFileSync(join(RAIZ, rel), 'utf8'), contexto, { filename: rel });

ejecutar('contenido/_fuentes.js');
const CATALOGO = ESTUDIO.FUENTES?.catalogo ?? {};
const VOLATILIDADES = ['alta', 'media', 'baja'];

for (const [clave, f] of Object.entries(CATALOGO)) {
  if (!f.nombre) fallo(`fuente "${clave}" sin nombre`);
  if (!f.url || !/^https?:\/\//.test(f.url)) fallo(`fuente "${clave}" con URL inválida`);
  if (!f.que) fallo(`fuente "${clave}" sin descripción de qué verificar ahí`);
  if (!VOLATILIDADES.includes(f.volatilidad)) {
    fallo(`fuente "${clave}" con volatilidad "${f.volatilidad}" (debe ser alta, media o baja)`);
  }
}

/** Verifica que las claves de fuentes existan en el catálogo. */
const revisarFuentes = (claves, donde) => {
  if (!claves) return;
  if (!Array.isArray(claves)) { fallo(`${donde} — "fuentes" debe ser un array`); return; }
  claves.forEach(k => { if (!CATALOGO[k]) fallo(`${donde} — fuente desconocida: "${k}"`); });
  if (new Set(claves).size !== claves.length) aviso(`${donde} — fuentes duplicadas`);
};

const fuentesUsadas = new Set();

ejecutar('contenido/_registro.js');
for (const ruta of ESTUDIO.archivosTrack) ejecutar('contenido/' + ruta);

/* ---------- 3 · coherencia del temario ---------- */

for (const rutaTrack of ESTUDIO.archivosTrack) {
  const trackId = rutaTrack.split('/')[0];
  const track = ESTUDIO.tracks[trackId];
  if (!track) { fallo(`${rutaTrack} no registró ningún track`); continue; }

  for (const meta of track.modulos) {
    const donde = `${trackId}/${meta.id}`;

    if (meta.estado !== 'listo') {
      if (!meta.temas?.length) aviso(`${donde} pendiente sin lista de temas`);
      continue;
    }

    if (!meta.archivo) { fallo(`${donde} está 'listo' pero no declara archivo`); continue; }
    const rel = join('contenido', trackId, meta.archivo);
    if (!existsSync(join(RAIZ, rel))) { fallo(`${donde} apunta a ${meta.archivo}, que no existe`); continue; }

    ejecutar(rel);
    const mod = ESTUDIO.modulos[donde];
    if (!mod) { fallo(`${rel} no registró el módulo ${donde}`); continue; }

    /* fuentes del módulo */
    if (!mod.fuentes?.length) aviso(`${donde} sin fuentes declaradas`);
    revisarFuentes(mod.fuentes, donde);
    (mod.fuentes ?? []).forEach(k => fuentesUsadas.add(k));

    /* lecciones */
    if (meta.lecciones !== mod.lecciones.length) {
      fallo(`${donde} — track.js dice ${meta.lecciones} lecciones, el archivo tiene ${mod.lecciones.length} (rompe el cálculo de progreso)`);
    }
    mod.lecciones.forEach((l, i) => {
      const ref = `${donde}/l${i + 1}`;
      if (!l.titulo) fallo(`${ref} sin título`);
      if (!l.minutos) fallo(`${ref} sin minutos`);
      // La pestaña 🛠️ se llena con prosa, con ejercicios, o con las dos.
      const tiene = (k) => k === 'practica' ? !!(l.practica || l.ejercicios?.length) : !!l[k];
      const esperadas = esIdioma(trackId) ? PESTANAS_IDIOMA : PESTANAS;
      const faltan = esperadas.filter(k => !tiene(k));
      if (faltan.length) aviso(`${ref} sin pestañas: ${faltan.join(', ')}`);
      if (l.visual && !l.visual.svg) fallo(`${ref} tiene visual sin svg`);
      if (l.visual?.svg && !l.visual.svg.includes('viewBox')) aviso(`${ref} svg sin viewBox (no escala)`);
      revisarFuentes(l.fuentes, ref);
      (l.fuentes ?? []).forEach(k => fuentesUsadas.add(k));
      (l.errores || []).forEach((e, j) => {
        if (!e.mito || !e.realidad) fallo(`${ref} error[${j}] incompleto`);
      });
      (l.entrevista || []).forEach((q, j) => {
        if (!q.p || !q.r) fallo(`${ref} entrevista[${j}] incompleta`);
      });
      (l.glosario || []).forEach((g, j) => {
        if (!g.t || !g.d) fallo(`${ref} glosario[${j}] incompleto`);
      });

      /* pestaña 🎧 escucha */
      if (l.escucha) {
        if (!l.escucha.items?.length) fallo(`${ref} escucha sin items`);
        (l.escucha.items || []).forEach((it, j) => {
          if (!it.texto?.trim()) fallo(`${ref} escucha[${j}] sin texto para reproducir`);
          if (!it.es) aviso(`${ref} escucha[${j}] sin traducción al español`);
        });
      }

      /* ejercicios interactivos */
      (l.ejercicios || []).forEach((ej, j) => {
        const eref = `${ref}/ej${j}`;
        const tipo = ej.tipo || 'opcion';
        if (!ej.p) fallo(`${eref} sin enunciado`);

        if (tipo === 'opcion') {
          if (!Array.isArray(ej.opciones) || ej.opciones.length < 2) { fallo(`${eref} sin opciones`); return; }
          if (typeof ej.correcta !== 'number' || ej.correcta < 0 || ej.correcta >= ej.opciones.length) {
            fallo(`${eref} correcta=${ej.correcta} fuera de rango`);
          }
          if (new Set(ej.opciones).size !== ej.opciones.length) fallo(`${eref} tiene opciones duplicadas`);
          return;
        }

        if (!ESCRITOS.includes(tipo)) { fallo(`${eref} tipo desconocido: "${tipo}"`); return; }

        const resp = ej.respuesta ?? ej.respuestas?.[0];
        if (!resp || !String(resp).trim()) { fallo(`${eref} (${tipo}) sin respuesta`); return; }
        if (ej.respuestas && !Array.isArray(ej.respuestas)) fallo(`${eref} "respuestas" debe ser un array`);
        // Ordenar arma fichas partiendo la respuesta: con una sola palabra no hay nada que ordenar.
        if (tipo === 'ordenar' && String(resp).trim().split(/\s+/).length < 3) {
          fallo(`${eref} (ordenar) necesita al menos 3 palabras`);
        }
        // El dictado se escucha: sin voz no hay ejercicio.
        if (tipo === 'dictado' && !ej.audio && !ej.respuesta) {
          fallo(`${eref} (dictado) necesita "respuesta" o "audio" con el texto a reproducir`);
        }
        if (ej.correcta != null) aviso(`${eref} es escrito pero declara "correcta" (se ignora)`);
      });
    });

    /* vocabulario */
    (mod.vocabulario || []).forEach((v, j) => {
      const vref = `${donde}/v${j}`;
      if (!v.en?.trim()) fallo(`${vref} sin palabra en inglés`);
      if (!v.es?.trim()) fallo(`${vref} sin traducción al español`);
      if (v.alternativas && !Array.isArray(v.alternativas)) fallo(`${vref} "alternativas" debe ser un array`);
      if (!v.ejemplo) aviso(`${vref} (${v.en}) sin oración de ejemplo`);
    });
    if (mod.vocabulario) {
      const repes = mod.vocabulario.map(v => v.en?.toLowerCase()).filter(Boolean);
      if (new Set(repes).size !== repes.length) fallo(`${donde} tiene palabras repetidas en el vocabulario`);
    }
    if (esIdioma(trackId) && !mod.vocabulario?.length) {
      aviso(`${donde} es de idioma y no trae vocabulario`);
    }

    /* examen */
    if (!mod.examen?.length) { fallo(`${donde} sin examen`); continue; }
    if (mod.examen.length < 8) aviso(`${donde} tiene solo ${mod.examen.length} preguntas (se recomiendan 10+)`);

    mod.examen.forEach((q, i) => {
      const ref = `${donde}/q${i}`;
      if (!q.p) fallo(`${ref} sin enunciado`);
      if (!Array.isArray(q.opciones) || q.opciones.length < 2) { fallo(`${ref} sin opciones`); return; }
      if (typeof q.correcta !== 'number' || q.correcta < 0 || q.correcta >= q.opciones.length) {
        fallo(`${ref} correcta=${q.correcta} fuera de rango (0..${q.opciones.length - 1})`);
      }
      if (!q.porQue) fallo(`${ref} sin explicación de la correcta`);
      if (new Set(q.opciones).size !== q.opciones.length) fallo(`${ref} tiene opciones duplicadas`);
      for (const k of Object.keys(q.porQueNo || {})) {
        const idx = Number(k);
        if (Number.isNaN(idx) || idx < 0 || idx >= q.opciones.length) fallo(`${ref} porQueNo[${k}] fuera de rango`);
        else if (idx === q.correcta) fallo(`${ref} porQueNo[${k}] apunta a la respuesta CORRECTA`);
      }
      const sinExplicar = q.opciones
        .map((_, j) => j)
        .filter(j => j !== q.correcta && !(q.porQueNo || {})[j]);
      if (sinExplicar.length) aviso(`${ref} opciones sin porQueNo: ${sinExplicar.join(', ')}`);
      // Las opciones se barajan: no pueden referirse a su propia posición.
      if (q.opciones.some(o => /todas las anteriores|ninguna de las anteriores|opción [ABCD]\b/i.test(o))) {
        fallo(`${ref} usa una opción posicional ("todas las anteriores") — las opciones se barajan`);
      }
    });
  }
}

/* ---------- 4 · informe ---------- */

function informar() {
  // Puede llamarse antes de cargar el contenido (si falló la sintaxis).
  const modulos = ESTUDIO.modulos;
  const listos = Object.keys(modulos).length;
  const lecciones = Object.values(modulos).reduce((a, m) => a + m.lecciones.length, 0);
  const preguntas = Object.values(modulos).reduce((a, m) => a + (m.examen?.length || 0), 0);
  const ejercicios = Object.values(modulos).reduce(
    (a, m) => a + m.lecciones.reduce((b, l) => b + (l.ejercicios?.length || 0), 0), 0);
  const vocabulario = Object.values(modulos).reduce((a, m) => a + (m.vocabulario?.length || 0), 0);

  if (avisos.length) {
    console.log(`\n  AVISOS (${avisos.length})`);
    avisos.forEach(a => console.log('   · ' + a));
  }
  if (problemas.length) {
    console.log(`\n  ERRORES (${problemas.length})`);
    problemas.forEach(p => console.log('   ✗ ' + p));
    console.log('');
    return;
  }
  const total = Object.keys(ESTUDIO.FUENTES?.catalogo ?? {}).length;
  const sinUsar = Object.keys(ESTUDIO.FUENTES?.catalogo ?? {})
    .filter(k => !fuentesUsadas.has(k));
  if (sinUsar.length) console.log(`\n  · fuentes del catálogo sin usar: ${sinUsar.join(', ')}`);

  const extra = (ejercicios ? ` · ${ejercicios} ejercicios` : '') +
                (vocabulario ? ` · ${vocabulario} palabras` : '');
  console.log(`\n  ✓ Todo bien — ${listos} módulos · ${lecciones} lecciones · ${preguntas} preguntas` +
              extra + ` · ${fuentesUsadas.size}/${total} fuentes en uso\n`);
}

informar();
process.exit(problemas.length ? 1 : 0);
