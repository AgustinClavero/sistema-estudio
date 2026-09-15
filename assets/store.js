/* ==========================================================================
   store.js — todo el progreso del usuario, persistido en localStorage.
   Nada de esto sale de tu navegador. Exportable/importable como JSON.
   ========================================================================== */
(function () {
  'use strict';

  var E = window.ESTUDIO;
  var CLAVE = 'estudio:v1';

  /* Intervalos de repaso espaciado, en días, por nivel. */
  var INTERVALOS = [1, 3, 7, 16, 35];
  var NIVEL_DOMINADO = INTERVALOS.length;

  function vacio() {
    return {
      v: 1,
      lecciones: {},   // "track/mod/lec" -> ts de primera vista
      examenes: {},    // "track/mod" -> {mejor, intentos, aprobado, ultimo}
      srs: {},         // "track/mod/qN" -> {nivel, proximo, fallos, aciertos}
      pomodoro: { ciclos: 0, minutos: 0, porDia: {} },
      racha: { ultimoDia: null, actual: 0, mejor: 0 },
      logros: {},      // id -> ts
      prefs: { tema: 'claro' },
      creado: Date.now(),
    };
  }

  function cargar() {
    try {
      var crudo = localStorage.getItem(CLAVE);
      if (!crudo) return vacio();
      var d = JSON.parse(crudo);
      var base = vacio();
      for (var k in base) if (!(k in d)) d[k] = base[k];
      return d;
    } catch (e) {
      console.warn('Progreso ilegible, arranco de cero.', e);
      return vacio();
    }
  }

  var d = cargar();
  var oyentes = [];

  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(d));
    } catch (e) {
      console.warn('No se pudo guardar el progreso.', e);
    }
    oyentes.forEach(function (fn) { fn(); });
  }

  var Store = E.Store = {
    datos: function () { return d; },
    guardar: guardar,
    alCambiar: function (fn) { oyentes.push(fn); },

    /* -------------------- lecciones -------------------- */

    marcarLeccion: function (clave) {
      if (!d.lecciones[clave]) {
        d.lecciones[clave] = Date.now();
        Store.tocarDia();
        Store.revisarLogros();
        guardar();
      }
    },

    leccionVista: function (clave) { return !!d.lecciones[clave]; },

    /* -------------------- exámenes -------------------- */

    registrarExamen: function (clave, puntaje, aprobado) {
      var prev = d.examenes[clave] || { mejor: 0, intentos: 0, aprobado: false };
      d.examenes[clave] = {
        mejor: Math.max(prev.mejor, puntaje),
        intentos: prev.intentos + 1,
        aprobado: prev.aprobado || aprobado,
        ultimo: Date.now(),
        ultimoPuntaje: puntaje,
      };
      Store.tocarDia();
      Store.revisarLogros();
      guardar();
    },

    examen: function (clave) { return d.examenes[clave] || null; },

    aprobado: function (trackId, moduloId) {
      var ex = d.examenes[trackId + '/' + moduloId];
      return !!(ex && ex.aprobado);
    },

    /** El módulo 0 siempre está abierto; el resto pide aprobar el anterior. */
    desbloqueado: function (trackId, moduloId) {
      var i = E.indiceModulo(trackId, moduloId);
      if (i <= 0) return true;
      var anterior = E.tracks[trackId].modulos[i - 1];
      if (anterior.estado !== 'listo') return true; // no trabar por contenido faltante
      return Store.aprobado(trackId, anterior.id);
    },

    /* -------------------- repaso espaciado -------------------- */

    srsRegistrar: function (clave, acerto) {
      var e = d.srs[clave];
      if (acerto) {
        if (!e) return;                       // acertar algo nuevo no crea tarjeta
        e.aciertos++;
        e.nivel = Math.min(e.nivel + 1, NIVEL_DOMINADO);
        e.proximo = e.nivel >= NIVEL_DOMINADO
          ? Infinity
          : Date.now() + INTERVALOS[e.nivel] * E.DIA_MS;
      } else {
        if (!e) e = d.srs[clave] = { nivel: 0, fallos: 0, aciertos: 0, proximo: 0 };
        e.fallos++;
        e.nivel = 0;
        e.proximo = Date.now() + INTERVALOS[0] * E.DIA_MS;
      }
      guardar();
    },

    /** Claves de preguntas que tocan repasar hoy. */
    srsPendientes: function () {
      var ahora = Date.now(), out = [];
      for (var k in d.srs) {
        if (d.srs[k].nivel < NIVEL_DOMINADO && d.srs[k].proximo <= ahora) out.push(k);
      }
      return out;
    },

    srsDominadas: function () {
      var n = 0;
      for (var k in d.srs) if (d.srs[k].nivel >= NIVEL_DOMINADO) n++;
      return n;
    },

    srsTotal: function () { return Object.keys(d.srs).length; },

    /* -------------------- racha -------------------- */

    tocarDia: function () {
      var hoy = E.hoy();
      var r = d.racha;
      if (r.ultimoDia === hoy) return;
      if (r.ultimoDia) {
        var ayer = new Date(Date.now() - E.DIA_MS);
        var claveAyer = ayer.getFullYear() + '-' +
          String(ayer.getMonth() + 1).padStart(2, '0') + '-' +
          String(ayer.getDate()).padStart(2, '0');
        r.actual = (r.ultimoDia === claveAyer) ? r.actual + 1 : 1;
      } else {
        r.actual = 1;
      }
      r.ultimoDia = hoy;
      r.mejor = Math.max(r.mejor, r.actual);
    },

    /** Si pasó más de un día sin estudiar, la racha mostrada es 0. */
    rachaViva: function () {
      var r = d.racha;
      if (!r.ultimoDia) return 0;
      var hoy = E.hoy();
      if (r.ultimoDia === hoy) return r.actual;
      var ayer = new Date(Date.now() - E.DIA_MS);
      var claveAyer = ayer.getFullYear() + '-' +
        String(ayer.getMonth() + 1).padStart(2, '0') + '-' +
        String(ayer.getDate()).padStart(2, '0');
      return r.ultimoDia === claveAyer ? r.actual : 0;
    },

    /* -------------------- pomodoro -------------------- */

    sumarPomodoro: function (minutos) {
      var hoy = E.hoy();
      d.pomodoro.ciclos++;
      d.pomodoro.minutos += minutos;
      d.pomodoro.porDia[hoy] = (d.pomodoro.porDia[hoy] || 0) + 1;
      Store.tocarDia();
      Store.revisarLogros();
      guardar();
    },

    /* -------------------- progreso -------------------- */

    progresoTrack: function (trackId) {
      var t = E.tracks[trackId];
      if (!t) return { pct: 0, lecciones: 0, totalLecciones: 0, modulos: 0, totalModulos: 0 };

      var totalLec = 0, vistas = 0, totalMod = 0, aprobados = 0;
      t.modulos.forEach(function (m) {
        if (m.estado !== 'listo') return;
        totalMod++;
        if (Store.aprobado(trackId, m.id)) aprobados++;
        var n = m.lecciones || 0;
        totalLec += n;
        for (var i = 1; i <= n; i++) {
          if (d.lecciones[trackId + '/' + m.id + '/l' + i]) vistas++;
        }
      });

      // El examen aprobado pesa tanto como las lecciones del módulo.
      var hechas = vistas + aprobados;
      var total = totalLec + totalMod;
      return {
        pct: total ? Math.round((hechas / total) * 100) : 0,
        lecciones: vistas, totalLecciones: totalLec,
        modulos: aprobados, totalModulos: totalMod,
        escrito: totalMod > 0,
      };
    },

    progresoGlobal: function () {
      var hechas = 0, total = 0;
      E.listaTracks().forEach(function (t) {
        var p = Store.progresoTrack(t.id);
        hechas += p.lecciones + p.modulos;
        total += p.totalLecciones + p.totalModulos;
      });
      return total ? Math.round((hechas / total) * 100) : 0;
    },

    /** Primera lección sin ver de un track desbloqueado. */
    siguientePendiente: function () {
      var tracks = E.listaTracks();
      for (var i = 0; i < tracks.length; i++) {
        var t = tracks[i];
        for (var j = 0; j < t.modulos.length; j++) {
          var m = t.modulos[j];
          if (m.estado !== 'listo') continue;
          if (!Store.desbloqueado(t.id, m.id)) break;
          for (var l = 1; l <= (m.lecciones || 0); l++) {
            if (!d.lecciones[t.id + '/' + m.id + '/l' + l]) {
              return { track: t, modulo: m, leccion: l };
            }
          }
          if (!Store.aprobado(t.id, m.id)) {
            return { track: t, modulo: m, leccion: null }; // toca el examen
          }
        }
      }
      return null;
    },

    /* -------------------- logros -------------------- */

    LOGROS: [
      { id: 'primer-paso', icono: '👣', titulo: 'Primer paso', desc: 'Leíste tu primera lección.',
        test: function (d) { return Object.keys(d.lecciones).length >= 1; } },
      { id: 'primer-examen', icono: '✅', titulo: 'Aprobado', desc: 'Aprobaste tu primer examen de módulo.',
        test: function (d) { for (var k in d.examenes) if (d.examenes[k].aprobado) return true; return false; } },
      { id: 'perfecto', icono: '💯', titulo: 'Perfecto', desc: 'Sacaste 100% en un examen.',
        test: function (d) { for (var k in d.examenes) if (d.examenes[k].mejor >= 100) return true; return false; } },
      { id: 'diez-lecciones', icono: '📚', titulo: 'Constancia', desc: 'Leíste 10 lecciones.',
        test: function (d) { return Object.keys(d.lecciones).length >= 10; } },
      { id: 'treinta-lecciones', icono: '🎓', titulo: 'En serio', desc: 'Leíste 30 lecciones.',
        test: function (d) { return Object.keys(d.lecciones).length >= 30; } },
      { id: 'racha-3', icono: '🔥', titulo: 'Tres al hilo', desc: 'Estudiaste 3 días seguidos.',
        test: function (d) { return d.racha.mejor >= 3; } },
      { id: 'racha-7', icono: '🔥', titulo: 'Semana completa', desc: 'Estudiaste 7 días seguidos.',
        test: function (d) { return d.racha.mejor >= 7; } },
      { id: 'racha-30', icono: '🏆', titulo: 'Un mes', desc: 'Estudiaste 30 días seguidos.',
        test: function (d) { return d.racha.mejor >= 30; } },
      { id: 'pomo-5', icono: '🍅', titulo: 'Enfocado', desc: 'Completaste 5 pomodoros.',
        test: function (d) { return d.pomodoro.ciclos >= 5; } },
      { id: 'pomo-25', icono: '⏱️', titulo: 'Disciplina', desc: 'Completaste 25 pomodoros.',
        test: function (d) { return d.pomodoro.ciclos >= 25; } },
      { id: 'diez-horas', icono: '🕙', titulo: 'Diez horas', desc: 'Acumulaste 10 horas de estudio enfocado.',
        test: function (d) { return d.pomodoro.minutos >= 600; } },
      { id: 'repaso-dominado', icono: '🧠', titulo: 'Grabado a fuego', desc: 'Dominaste 10 preguntas en repaso espaciado.',
        test: function () { return Store.srsDominadas() >= 10; } },
      { id: 'modulo-limpio', icono: '🎯', titulo: 'De una', desc: 'Aprobaste un examen en el primer intento.',
        test: function (d) { for (var k in d.examenes) { var e = d.examenes[k]; if (e.aprobado && e.intentos === 1) return true; } return false; } },
      { id: 'track-completo', icono: '👑', titulo: 'Track completo', desc: 'Terminaste un plan de estudio entero.',
        test: function () {
          var ts = E.listaTracks();
          for (var i = 0; i < ts.length; i++) {
            var p = Store.progresoTrack(ts[i].id);
            if (p.escrito && p.pct >= 100) return true;
          }
          return false;
        } },
    ],

    /** Devuelve los logros recién desbloqueados (para poder avisarte). */
    revisarLogros: function () {
      var nuevos = [];
      Store.LOGROS.forEach(function (l) {
        if (d.logros[l.id]) return;
        var ok = false;
        try { ok = l.test(d); } catch (e) { ok = false; }
        if (ok) { d.logros[l.id] = Date.now(); nuevos.push(l); }
      });
      if (nuevos.length) {
        nuevos.forEach(function (l) { E.avisarLogro && E.avisarLogro(l); });
      }
      return nuevos;
    },

    /* -------------------- import / export / reset -------------------- */

    exportar: function () { return JSON.stringify(d, null, 2); },

    importar: function (texto) {
      var nuevo = JSON.parse(texto);
      if (!nuevo || typeof nuevo !== 'object' || !nuevo.lecciones) {
        throw new Error('El archivo no parece un progreso de Estudio.');
      }
      d = nuevo;
      var base = vacio();
      for (var k in base) if (!(k in d)) d[k] = base[k];
      guardar();
    },

    reset: function () { d = vacio(); guardar(); },

    tema: function (nuevo) {
      if (nuevo) { d.prefs.tema = nuevo; guardar(); }
      return d.prefs.tema;
    },
  };
})();
