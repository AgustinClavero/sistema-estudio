/* ==========================================================================
   nucleo.js — namespace global, registro de contenido y carga bajo demanda.
   Se carga PRIMERO. Todo lo demás cuelga de window.ESTUDIO.

   Por qué los contenidos son .js y no .json:
   al abrir index.html con doble clic (file://) el navegador bloquea fetch()
   por CORS, pero SÍ permite cargar <script src="...">. Por eso cada lección
   es un archivo .js que se auto-registra llamando a ESTUDIO.registrarModulo().
   ========================================================================== */
(function () {
  'use strict';

  var ESTUDIO = window.ESTUDIO = {
    tracks: {},          // id -> objeto track
    modulos: {},         // "trackId/moduloId" -> objeto módulo
    archivosTrack: [],   // rutas relativas, las declara contenido/_registro.js
    _cargados: {},       // src -> true
  };

  /* ---------- registro (lo llaman los archivos de contenido) ---------- */

  ESTUDIO.registrarTrack = function (track) {
    ESTUDIO.tracks[track.id] = track;
  };

  ESTUDIO.registrarModulo = function (mod) {
    ESTUDIO.modulos[mod.track + '/' + mod.id] = mod;
  };

  /* ---------- carga de scripts ---------- */

  ESTUDIO.cargarScript = function (src) {
    if (ESTUDIO._cargados[src]) return Promise.resolve();
    return new Promise(function (resolver, rechazar) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () { ESTUDIO._cargados[src] = true; resolver(); };
      s.onerror = function () { rechazar(new Error('No se pudo cargar ' + src)); };
      document.head.appendChild(s);
    });
  };

  ESTUDIO.cargarTracks = function () {
    var cadena = Promise.resolve();
    ESTUDIO.archivosTrack.forEach(function (ruta) {
      cadena = cadena.then(function () {
        return ESTUDIO.cargarScript('contenido/' + ruta);
      });
    });
    return cadena;
  };

  ESTUDIO.cargarModulo = function (trackId, moduloId) {
    var clave = trackId + '/' + moduloId;
    if (ESTUDIO.modulos[clave]) return Promise.resolve(ESTUDIO.modulos[clave]);

    var meta = ESTUDIO.metaModulo(trackId, moduloId);
    if (!meta || !meta.archivo) return Promise.resolve(null);

    return ESTUDIO.cargarScript('contenido/' + trackId + '/' + meta.archivo)
      .then(function () { return ESTUDIO.modulos[clave] || null; })
      .catch(function () { return null; });
  };

  /* ---------- helpers de lectura del temario ---------- */

  ESTUDIO.metaModulo = function (trackId, moduloId) {
    var t = ESTUDIO.tracks[trackId];
    if (!t) return null;
    for (var i = 0; i < t.modulos.length; i++) {
      if (t.modulos[i].id === moduloId) return t.modulos[i];
    }
    return null;
  };

  ESTUDIO.indiceModulo = function (trackId, moduloId) {
    var t = ESTUDIO.tracks[trackId];
    if (!t) return -1;
    for (var i = 0; i < t.modulos.length; i++) {
      if (t.modulos[i].id === moduloId) return i;
    }
    return -1;
  };

  /** Módulos que ya tienen contenido escrito (estado 'listo'). */
  ESTUDIO.modulosListos = function (trackId) {
    var t = ESTUDIO.tracks[trackId];
    if (!t) return [];
    return t.modulos.filter(function (m) { return m.estado === 'listo'; });
  };

  /**
   * Fuentes de una lección: las propias si las declara, si no las del módulo.
   * Devuelve objetos del catálogo, ya resueltos.
   */
  ESTUDIO.fuentesDe = function (mod, leccion) {
    var claves = (leccion && leccion.fuentes) || (mod && mod.fuentes) || [];
    var cat = (ESTUDIO.FUENTES && ESTUDIO.FUENTES.catalogo) || {};
    return claves
      .map(function (k) { return cat[k] ? Object.assign({ clave: k }, cat[k]) : null; })
      .filter(Boolean);
  };

  ESTUDIO.listaTracks = function () {
    return ESTUDIO.archivosTrack
      .map(function (ruta) { return ESTUDIO.tracks[ruta.split('/')[0]]; })
      .filter(Boolean);
  };

  /* ---------- utilidades generales ---------- */

  ESTUDIO.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  /** Baraja una copia del array (Fisher-Yates). */
  ESTUDIO.barajar = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  ESTUDIO.hoy = function () {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  };

  ESTUDIO.DIA_MS = 86400000;

  /** "hace 3 días", "hoy", "en 5 días" */
  ESTUDIO.cuando = function (ts) {
    var dias = Math.round((ts - Date.now()) / ESTUDIO.DIA_MS);
    if (dias === 0) return 'hoy';
    if (dias === 1) return 'mañana';
    if (dias === -1) return 'ayer';
    if (dias > 0) return 'en ' + dias + ' días';
    return 'hace ' + (-dias) + ' días';
  };

  ESTUDIO.plural = function (n, sing, plur) {
    return n + ' ' + (n === 1 ? sing : plur);
  };
})();
