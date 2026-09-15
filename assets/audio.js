/* ==========================================================================
   audio.js — voz sintética para el track de inglés.

   Usa speechSynthesis, que en Chrome sobre file:// funciona con las voces
   que ya tiene instaladas Windows (localService: true). Sin red, sin MP3,
   sin dependencias.

   Desde el contenido no hace falta cablear nada: cualquier elemento con el
   atributo data-say suena al hacerle clic.

     <span class="en" data-say>Where are you from?</span>   ← dice su propio texto
     <button data-say="Good morning">🔊</button>            ← dice otro texto
     <button data-say="..." data-rate="lento">🐢</button>   ← más despacio

   TRAMPA RESUELTA ACÁ: getVoices() devuelve [] en la primera llamada. Las
   voces llegan asincrónicamente y avisan con el evento 'voiceschanged'.
   Verificado en esta máquina: 1ra llamada 0 voces, 2da 6.
   ========================================================================== */
(function () {
  'use strict';

  var E = window.ESTUDIO;
  var SS = window.speechSynthesis || null;

  var voz = null;            // la SpeechSynthesisVoice elegida
  var resuelto = false;      // ya intentamos elegir con la lista real
  var oyentes = [];

  var RATE = { normal: 0.95, lento: 0.62 };

  /* Orden de preferencia. Zira y Mark suenan bastante mejor que David. */
  var PREFERIDAS = [
    'Microsoft Zira', 'Microsoft Mark', 'Microsoft David',
    'Google US English', 'Samantha', 'Microsoft Aria', 'Microsoft Jenny',
  ];

  function vocesInglesas() {
    if (!SS) return [];
    var todas = SS.getVoices() || [];
    return todas.filter(function (v) { return /^en([-_]|$)/i.test(v.lang || ''); });
  }

  function elegirVoz() {
    var en = vocesInglesas();
    if (!en.length) return null;

    // Las locales funcionan sin internet; las remotas (Google) no. Preferir locales.
    var locales = en.filter(function (v) { return v.localService; });
    var pool = locales.length ? locales : en;

    for (var i = 0; i < PREFERIDAS.length; i++) {
      for (var j = 0; j < pool.length; j++) {
        if ((pool[j].name || '').indexOf(PREFERIDAS[i]) === 0) return pool[j];
      }
    }
    // Preferir en-US si no reconocimos ninguna por nombre.
    for (var k = 0; k < pool.length; k++) {
      if (/^en[-_]US/i.test(pool[k].lang)) return pool[k];
    }
    return pool[0];
  }

  function resolver() {
    if (!SS) { resuelto = true; return; }
    var v = elegirVoz();
    if (v) { voz = v; resuelto = true; avisar(); return; }
    // Lista todavía vacía: no marcamos resuelto, esperamos voiceschanged.
    if (SS.getVoices().length) { resuelto = true; avisar(); }
  }

  function avisar() {
    var fns = oyentes.slice();
    oyentes.length = 0;
    fns.forEach(function (fn) { try { fn(); } catch (e) {} });
  }

  if (SS) {
    resolver();
    if (typeof SS.addEventListener === 'function') {
      SS.addEventListener('voiceschanged', resolver);
    } else {
      SS.onvoiceschanged = resolver;
    }
    // Red de seguridad: algunos Chrome no disparan el evento si el usuario
    // todavía no interactuó con la página.
    setTimeout(resolver, 250);
    setTimeout(resolver, 1200);
  }

  var Audio = E.Audio = {

    /** ¿Se puede hablar inglés en este navegador? */
    disponible: function () { return !!(SS && voz); },

    /** Aún no sabemos: la lista de voces puede no haber llegado. */
    indefinido: function () { return !!SS && !resuelto; },

    voz: function () { return voz; },

    nombreVoz: function () { return voz ? voz.name : null; },

    /** Llama a fn cuando se sepa si hay voz o no (o ya mismo si se sabe). */
    cuandoListo: function (fn) {
      if (resuelto || !SS) { fn(); return; }
      oyentes.push(fn);
      setTimeout(function () {
        var i = oyentes.indexOf(fn);
        if (i > -1) { oyentes.splice(i, 1); fn(); }
      }, 2500);
    },

    detener: function () { if (SS) { try { SS.cancel(); } catch (e) {} } },

    /**
     * Dice un texto en inglés.
     * opciones: { velocidad: 'normal'|'lento', alTerminar: fn }
     */
    decir: function (texto, opciones) {
      opciones = opciones || {};
      if (!SS || !texto) return false;
      if (!voz) resolver();
      if (!voz) return false;

      // Chrome se cuelga si se encola sobre algo pendiente.
      try { SS.cancel(); } catch (e) {}

      var u = new SpeechSynthesisUtterance(String(texto));
      u.voice = voz;
      u.lang = voz.lang || 'en-US';
      u.rate = RATE[opciones.velocidad] || RATE.normal;
      u.pitch = 1;
      if (opciones.alTerminar) {
        u.onend = opciones.alTerminar;
        u.onerror = opciones.alTerminar;
      }
      try { SS.speak(u); } catch (e) { return false; }
      return true;
    },

    /** HTML de un botón de audio, para armar vistas desde JS. */
    boton: function (texto, opciones) {
      opciones = opciones || {};
      var etiqueta = ('etiqueta' in opciones) ? opciones.etiqueta
        : (E.icono ? E.icono('volume', { size: 14 }) : '♪');
      var clase = 'say-btn' + (opciones.clase ? ' ' + opciones.clase : '');
      return '<button type="button" class="' + clase + '" data-say="' + E.esc(texto) + '"' +
        (opciones.velocidad ? ' data-rate="' + opciones.velocidad + '"' : '') +
        ' title="Escuchar">' + etiqueta + '</button>';
    },

    /** El par normal + lento, que es como conviene escuchar al principio. */
    parDeBotones: function (texto) {
      var ico = E.icono || function () { return ''; };
      return '<span class="say-par">' +
        Audio.boton(texto, { etiqueta: ico('volume', { size: 14 }) + '<span>Escuchar</span>' }) +
        Audio.boton(texto, { etiqueta: ico('gauge', { size: 14 }) + '<span>Lento</span>', velocidad: 'lento' }) +
        '</span>';
    },

    /**
     * Aviso para mostrar arriba del contenido de inglés cuando no hay voz.
     * Devuelve '' si todo está bien.
     */
    aviso: function () {
      if (!SS) {
        return '<div class="aviso-audio">🔇 <b>Este navegador no puede reproducir audio.</b> ' +
          'El texto y los ejercicios escritos funcionan igual, pero te vas a perder el dictado. ' +
          'Probá con Chrome o Edge.</div>';
      }
      if (!voz) {
        return '<div class="aviso-audio">🔇 <b>No encontré ninguna voz en inglés instalada.</b> ' +
          'En Windows se agregan desde <i>Configuración → Hora e idioma → Idioma y región → ' +
          'Agregar idioma → English (United States)</i>, tildando “Voz”. ' +
          'Mientras tanto, el resto de la lección funciona normal.</div>';
      }
      return '';
    },
  };

  /* ---------- un único manejador para todos los [data-say] del documento ---------- */

  document.addEventListener('click', function (ev) {
    var el = ev.target.closest && ev.target.closest('[data-say]');
    if (!el) return;
    ev.preventDefault();

    // data-say con valor dice ese texto; vacío, dice el texto del propio elemento.
    var texto = el.getAttribute('data-say');
    if (!texto) texto = el.textContent || '';
    texto = texto.replace(/\s+/g, ' ').trim();
    if (!texto) return;

    if (!Audio.disponible()) {
      el.classList.add('say-mudo');
      setTimeout(function () { el.classList.remove('say-mudo'); }, 1200);
      return;
    }

    var previo = document.querySelector('.sonando');
    if (previo) previo.classList.remove('sonando');
    el.classList.add('sonando');

    Audio.decir(texto, {
      velocidad: el.getAttribute('data-rate') === 'lento' ? 'lento' : 'normal',
      alTerminar: function () { el.classList.remove('sonando'); },
    });
  });

  /* Si se cambia de pantalla, que no siga hablando la anterior. */
  window.addEventListener('hashchange', function () { Audio.detener(); });
})();
