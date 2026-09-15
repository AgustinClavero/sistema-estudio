/* ==========================================================================
   pomodoro.js — temporizador de concentración 25/5 (descanso largo cada 4).
   El beep se genera con WebAudio: no hay archivos de audio que cargar.
   ========================================================================== */
(function () {
  'use strict';

  var E = window.ESTUDIO;

  var CONFIG = { foco: 25, corto: 5, largo: 15, cicloLargo: 4 };

  var estado = {
    fase: 'idle',        // idle | foco | corto | largo
    restante: CONFIG.foco * 60,
    corriendo: false,
    completadosSeguidos: 0,
  };

  var intervalo = null;
  var oyentes = [];

  function emitir() { oyentes.forEach(function (fn) { fn(estado); }); }

  function duracion(fase) {
    if (fase === 'foco') return CONFIG.foco * 60;
    if (fase === 'corto') return CONFIG.corto * 60;
    if (fase === 'largo') return CONFIG.largo * 60;
    return CONFIG.foco * 60;
  }

  function tic() {
    estado.restante--;
    if (estado.restante <= 0) { completar(); return; }
    emitir();
  }

  function completar() {
    detener();
    var eraFoco = estado.fase === 'foco';

    if (eraFoco) {
      estado.completadosSeguidos++;
      E.Store.sumarPomodoro(CONFIG.foco);
      var toca = (estado.completadosSeguidos % CONFIG.cicloLargo === 0) ? 'largo' : 'corto';
      preparar(toca);
      beep(3);
      notificar('Pomodoro completo 🍅',
        toca === 'largo' ? 'Descanso largo: ' + CONFIG.largo + ' minutos.'
                         : 'Descanso: ' + CONFIG.corto + ' minutos.');
    } else {
      preparar('foco');
      beep(2);
      notificar('Descanso terminado', 'A darle otros ' + CONFIG.foco + ' minutos.');
    }
    emitir();
  }

  function preparar(fase) {
    estado.fase = fase;
    estado.restante = duracion(fase);
    estado.corriendo = false;
  }

  function detener() {
    if (intervalo) { clearInterval(intervalo); intervalo = null; }
    estado.corriendo = false;
  }

  /* ---------------- sonido y notificación ---------------- */

  var ctxAudio = null;

  function beep(veces) {
    try {
      if (!ctxAudio) ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
      if (ctxAudio.state === 'suspended') ctxAudio.resume();
      for (var i = 0; i < veces; i++) {
        var t0 = ctxAudio.currentTime + i * 0.28;
        var osc = ctxAudio.createOscillator();
        var vol = ctxAudio.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t0);
        vol.gain.setValueAtTime(0.0001, t0);
        vol.gain.exponentialRampToValueAtTime(0.22, t0 + 0.02);
        vol.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
        osc.connect(vol); vol.connect(ctxAudio.destination);
        osc.start(t0); osc.stop(t0 + 0.24);
      }
    } catch (e) { /* sin audio, seguimos igual */ }
  }

  function notificar(titulo, cuerpo) {
    try {
      if (!('Notification' in window)) return;
      if (Notification.permission === 'granted') {
        new Notification(titulo, { body: cuerpo });
      }
    } catch (e) { /* file:// puede bloquearlo; no es crítico */ }
  }

  /* ---------------- API pública ---------------- */

  var Pomodoro = E.Pomodoro = {
    CONFIG: CONFIG,
    estado: function () { return estado; },
    alCambiar: function (fn) { oyentes.push(fn); },

    arrancar: function () {
      if (estado.corriendo) return;
      if (estado.fase === 'idle') preparar('foco');
      estado.corriendo = true;
      intervalo = setInterval(tic, 1000);
      // Desbloquea el audio: los navegadores lo exigen tras un gesto del usuario.
      try {
        if (!ctxAudio) ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
        if (ctxAudio.state === 'suspended') ctxAudio.resume();
      } catch (e) { /* ignorar */ }
      emitir();
    },

    pausar: function () { detener(); emitir(); },

    alternar: function () {
      estado.corriendo ? Pomodoro.pausar() : Pomodoro.arrancar();
    },

    reiniciar: function () {
      detener();
      preparar(estado.fase === 'idle' ? 'foco' : estado.fase);
      emitir();
    },

    /** Salta la fase actual sin contarla como completada. */
    saltar: function () {
      detener();
      if (estado.fase === 'foco') {
        var toca = ((estado.completadosSeguidos + 1) % CONFIG.cicloLargo === 0) ? 'largo' : 'corto';
        preparar(toca);
      } else {
        preparar('foco');
      }
      emitir();
    },

    pedirPermisoNotificaciones: function () {
      try {
        if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
        }
      } catch (e) { /* ignorar */ }
    },

    reloj: function () {
      var m = Math.floor(estado.restante / 60);
      var s = estado.restante % 60;
      return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    },

    etiquetaFase: function () {
      return { idle: 'Listo', foco: 'Concentración', corto: 'Descanso', largo: 'Descanso largo' }[estado.fase];
    },

    /** 0..1 — para el anillo de progreso. */
    fraccion: function () {
      var total = duracion(estado.fase === 'idle' ? 'foco' : estado.fase);
      return 1 - (estado.restante / total);
    },
  };

  // Avisar antes de cerrar si hay un foco corriendo.
  window.addEventListener('beforeunload', function (ev) {
    if (estado.corriendo && estado.fase === 'foco') {
      ev.preventDefault();
      ev.returnValue = '';
    }
  });
})();
