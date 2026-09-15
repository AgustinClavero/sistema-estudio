/* ==========================================================================
   ingles.js — lo propio del track de idioma: ejercicios interactivos,
   pestaña de escucha y shadowing con micrófono.

   Vive aparte de vistas.js para no engordarlo: acá está todo lo que solo
   usa inglés, y vistas.js simplemente delega.
   ========================================================================== */
(function () {
  'use strict';

  var E = window.ESTUDIO;
  var esc = E.esc;
  var I = E.Ingles = {};

  var ETIQUETA_TIPO = {
    hueco:    'Completá',
    dictado:  'Escuchá y escribí',
    traducir: 'Traducí al inglés',
    ordenar:  'Ordená la oración',
    opcion:   'Elegí la correcta',
  };

  /* ============================ EJERCICIOS ============================ */

  /**
   * Ejercicios de una lección. `ctx` = { trackId, moduloId, mod, n }.
   * Cada ejercicio lleva su clave de repaso espaciado en el DOM.
   */
  I.panelEjercicios = function (lec, ctx) {
    var lista = E.Quiz.clavesEjercicios(ctx.trackId, ctx.moduloId, ctx.mod, ctx.n);
    if (!lista.length) return '';

    var h = '<div class="ejercicios">';
    h += '<h4 class="ej-titulo">Ejercicios</h4>';
    h += '<p class="sub">Lo que falles entra a tu cola de repaso y vuelve en los días siguientes. ' +
         'Equivocarte acá es la parte útil.</p>';

    lista.forEach(function (par, i) {
      h += I.ejercicio(par.ejercicio, par.clave, i + 1);
    });
    return h + '</div>';
  };

  I.ejercicio = function (ej, clave, numero) {
    var tipo = ej.tipo || 'opcion';
    var h = '<div class="ejercicio" data-clave="' + esc(clave) + '" data-tipo="' + esc(tipo) + '">';

    h += '<div class="ej-cab"><span class="ej-n">' + numero + '</span>' +
         '<span class="ej-tipo">' + esc(ETIQUETA_TIPO[tipo] || 'Ejercicio') + '</span></div>';

    h += '<div class="ej-enunciado">' + ej.p + '</div>';

    if (ej.audio || tipo === 'dictado') {
      var texto = ej.audio || E.Quiz.corregir('', ej).esperado;
      h += '<div class="ej-audio">' + E.Audio.parDeBotones(texto) + '</div>';
    }

    if (tipo === 'opcion') {
      h += '<div class="ej-opciones">';
      (ej.opciones || []).forEach(function (op, i) {
        h += '<button type="button" class="ej-op" data-op="' + i + '">' + esc(op) + '</button>';
      });
      h += '</div>';
    } else if (tipo === 'ordenar') {
      h += '<div class="ej-armado" data-armado></div>';
      h += '<div class="ej-fichas">';
      E.Quiz.fichasOrdenar(ej).forEach(function (w, i) {
        h += '<button type="button" class="ficha" data-ficha="' + i + '">' + esc(w) + '</button>';
      });
      h += '</div>';
      h += '<div class="ej-acciones">' +
           '<button type="button" class="btn btn-sm ej-check">Comprobar</button>' +
           '<button type="button" class="btn btn-sm ej-limpiar">Limpiar</button></div>';
    } else {
      h += '<div class="ej-entrada">' +
           '<input type="text" class="ej-input" placeholder="' +
           (tipo === 'traducir' ? 'Escribilo en inglés…' : 'Escribí acá…') +
           '" autocomplete="off" autocapitalize="off" spellcheck="false">' +
           '<button type="button" class="btn btn-sm btn-primario ej-check">Comprobar</button></div>';
    }

    h += '<div class="ej-feedback" hidden></div>';
    return h + '</div>';
  };

  /** HTML del resultado de corregir un ejercicio escrito. */
  I.feedback = function (det, ej) {
    var h = '<div class="ej-resultado ' + (det.ok ? 'bien' : 'mal') + '">';

    if (det.vacia) {
      return '<div class="ej-resultado mal"><b>Escribí algo primero.</b> ' +
             'Aunque no estés seguro: equivocarte con intención enseña más que dejarlo en blanco.</div>';
    }

    h += '<b>' + (det.ok ? '✓ Correcto.' : '✗ Todavía no.') + '</b>';

    if (!det.ok) {
      h += '<div class="ej-diff">';
      h += '<div class="ej-diff-fila"><span class="ej-diff-et">Escribiste</span><span>' +
           I.pintarDiff(det.diff, 'sobra') + '</span></div>';
      h += '<div class="ej-diff-fila"><span class="ej-diff-et">Era</span><span>' +
           I.pintarDiff(det.diff, 'falta') + '</span></div>';
      h += '</div>';
      if (det.otras && det.otras.length) {
        h += '<div class="ej-otras">También valía: ' +
             det.otras.map(function (o) { return '<code>' + esc(o) + '</code>'; }).join(' · ') + '</div>';
      }
    }

    var frase = det.esperado;
    if (frase) {
      h += '<div class="ej-escuchar">' + E.Audio.parDeBotones(frase) + '</div>';
    }
    if (ej && ej.porQue) h += '<div class="ej-porque">' + ej.porQue + '</div>';

    return h + '</div>';
  };

  /**
   * Dibuja el diff. `lado` decide qué versión se muestra:
   *   'sobra' → lo que escribiste (marca en rojo lo que sobra)
   *   'falta' → la respuesta correcta (marca en verde lo que te faltó)
   */
  I.pintarDiff = function (diff, lado) {
    if (!diff) return '';
    var out = [];
    diff.forEach(function (t) {
      if (t.t === 'igual') out.push('<span class="w">' + esc(t.w) + '</span>');
      else if (t.t === lado) {
        out.push('<span class="w ' + (lado === 'sobra' ? 'w-sobra' : 'w-falta') + '">' + esc(t.w) + '</span>');
      }
    });
    return out.join(' ') || '<span class="w w-vacio">(nada)</span>';
  };

  /* ============================ ESCUCHA ============================ */

  I.panelEscucha = function (lec) {
    var e = lec.escucha;
    var h = E.Audio.aviso();

    if (e.intro) h += '<div class="prosa">' + e.intro + '</div>';

    h += '<p class="sub">Escuchá primero sin mirar. Recién si no sale, bajá la velocidad. ' +
         'Revelá el texto último — leerlo antes de tiempo es lo que hace que no te entre por el oído.</p>';

    (e.items || []).forEach(function (it, i) {
      h += '<div class="escucha-item" data-idx="' + i + '">';
      h += '<div class="esc-cab"><span class="esc-n">' + (i + 1) + '</span>' +
           E.Audio.parDeBotones(it.texto) + '</div>';

      h += '<div class="esc-entrada">' +
           '<input type="text" class="esc-input" placeholder="¿Qué dijo?" ' +
           'autocomplete="off" autocapitalize="off" spellcheck="false">' +
           '<button type="button" class="btn btn-sm esc-check">Comprobar</button>' +
           '<button type="button" class="btn btn-sm esc-ver">Mostrar</button></div>';

      h += '<div class="esc-feedback" hidden></div>';

      h += '<div class="esc-shadow">' +
           '<button type="button" class="btn btn-sm esc-grabar">' + E.icono('mic', { size: 14 }) + '<span>Grabarme repitiendo</span></button>' +
           '<span class="esc-shadow-estado"></span></div>';

      if (it.nota) h += '<div class="esc-nota">' + it.nota + '</div>';
      h += '</div>';
    });

    return h;
  };

  /* ============================ VOCABULARIO ============================ */

  I.tarjetaVocabulario = function (t, meta, mod) {
    var v = mod.vocabulario;
    if (!v || !v.length) return '';

    var enCola = 0, dominadas = 0;
    var d = E.Store.datos();
    v.forEach(function (_, i) {
      var s = d.srs[t.id + '/' + meta.id + '/v' + i];
      if (!s) return;
      if (s.nivel >= 5) dominadas++; else enCola++;
    });

    var h = '<h2>Vocabulario</h2>';
    h += '<div class="tarjeta"><div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">' +
      '<div style="font-size:30px">🗂️</div>' +
      '<div style="flex:1;min-width:200px">' +
      '<h3 style="margin:0 0 3px">' + v.length + ' palabras de este módulo</h3>' +
      '<p style="margin:0;color:var(--texto-2);font-size:13.8px">' +
      'Te las pregunta del español al inglés. Las que falles entran al repaso espaciado. ' +
      (enCola || dominadas
        ? '<br>Ahora mismo: <b>' + enCola + '</b> en repaso · <b>' + dominadas + '</b> dominadas.'
        : '') +
      '</p></div>' +
      '<a class="btn btn-primario" href="#/vocabulario/' + t.id + '/' + meta.id + '">Practicar</a>' +
      '</div>';

    h += '<div class="vocab-lista">';
    v.forEach(function (p) {
      h += '<div class="vocab-fila">' +
        '<span class="vocab-en en" data-say>' + esc(p.en) + '</span>' +
        '<span class="vocab-es">' + esc(p.es) + '</span>' +
        '</div>';
    });
    h += '</div></div>';
    return h;
  };

  /* ============================ FICHAS (ordenar) ============================ */

  /**
   * Maneja el armado de una oración con fichas dentro de `raiz`.
   * Espera un [data-armado] y un .ej-fichas con botones .ficha.
   * Lo usan el ejercicio de la lección y el quiz, con el mismo HTML.
   */
  I.fichasControl = function (raiz) {
    var armado = raiz.querySelector('[data-armado]');
    var elegidas = [];
    var trabado = false;

    function repintar() {
      armado.innerHTML = elegidas.length
        ? elegidas.map(function (f) {
            return '<button type="button" class="ficha puesta" data-quitar="' + f.i + '">' +
              esc(f.w) + '</button>';
          }).join('')
        : '<span class="ej-armado-vacio">Tocá las palabras en orden</span>';
    }

    Array.prototype.forEach.call(raiz.querySelectorAll('.ej-fichas .ficha'), function (b) {
      b.addEventListener('click', function () {
        if (trabado || b.disabled) return;
        b.disabled = true;
        b.classList.add('usada');
        elegidas.push({ i: b.dataset.ficha, w: b.textContent });
        repintar();
      });
    });

    armado.addEventListener('click', function (ev) {
      if (trabado) return;
      var q = ev.target.closest && ev.target.closest('[data-quitar]');
      if (!q) return;
      var id = q.dataset.quitar;
      elegidas = elegidas.filter(function (f) { return f.i !== id; });
      var orig = raiz.querySelector('.ej-fichas .ficha[data-ficha="' + id + '"]');
      if (orig) { orig.disabled = false; orig.classList.remove('usada'); }
      repintar();
    });

    repintar();

    return {
      valor: function () { return elegidas.map(function (f) { return f.w; }).join(' '); },
      limpiar: function () {
        if (trabado) return;
        elegidas = [];
        Array.prototype.forEach.call(raiz.querySelectorAll('.ej-fichas .ficha'), function (b) {
          b.disabled = false; b.classList.remove('usada');
        });
        repintar();
      },
      trabar: function () { trabado = true; },
    };
  };

  /* ============================ EVENTOS ============================ */

  /**
   * Conecta los widgets que haya dentro de `raiz`.
   * `buscar(clave)` devuelve el ejercicio original a partir de su clave.
   */
  I.conectar = function (raiz, buscar, lec) {
    if (!raiz) return;

    /* ---- ejercicios ---- */
    Array.prototype.forEach.call(raiz.querySelectorAll('.ejercicio'), function (nodo) {
      var ej = buscar(nodo.dataset.clave);
      if (!ej) return;
      var tipo = nodo.dataset.tipo;
      var fb = nodo.querySelector('.ej-feedback');
      var cerrado = false;

      function resolverEscrito(texto) {
        if (cerrado) return;
        var det = E.Quiz.corregir(texto, ej);
        if (det.vacia) { mostrar(I.feedback(det, ej)); return; }
        cerrado = true;
        E.Store.srsRegistrar(nodo.dataset.clave, det.ok);
        nodo.classList.add(det.ok ? 'ej-ok' : 'ej-error');
        mostrar(I.feedback(det, ej));
        bloquear();
      }

      function mostrar(html) { fb.innerHTML = html; fb.hidden = false; }

      function bloquear() {
        Array.prototype.forEach.call(nodo.querySelectorAll('input, .ficha, .ej-op, .ej-check, .ej-limpiar'),
          function (el) { el.disabled = true; });
      }

      if (tipo === 'opcion') {
        Array.prototype.forEach.call(nodo.querySelectorAll('.ej-op'), function (b) {
          b.addEventListener('click', function () {
            if (cerrado) return;
            cerrado = true;
            var i = parseInt(b.dataset.op, 10);
            var ok = i === ej.correcta;
            E.Store.srsRegistrar(nodo.dataset.clave, ok);
            Array.prototype.forEach.call(nodo.querySelectorAll('.ej-op'), function (o, j) {
              if (j === ej.correcta) o.classList.add('correcta');
              else if (o === b) o.classList.add('incorrecta');
              o.disabled = true;
            });
            nodo.classList.add(ok ? 'ej-ok' : 'ej-error');
            var extra = (!ok && ej.porQueNo && ej.porQueNo[i]) ? ' ' + ej.porQueNo[i] : '';
            mostrar('<div class="ej-resultado ' + (ok ? 'bien' : 'mal') + '"><b>' +
              (ok ? '✓ Correcto.' : '✗ No era esa.') + '</b> ' + (ej.porQue || '') + extra + '</div>');
          });
        });
        return;
      }

      if (tipo === 'ordenar') {
        var fichas = I.fichasControl(nodo);
        nodo.querySelector('.ej-limpiar').addEventListener('click', fichas.limpiar);
        nodo.querySelector('.ej-check').addEventListener('click', function () {
          resolverEscrito(fichas.valor());
        });
        return;
      }

      // hueco / dictado / traducir
      var input = nodo.querySelector('.ej-input');
      nodo.querySelector('.ej-check').addEventListener('click', function () {
        resolverEscrito(input.value);
      });
      input.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); resolverEscrito(input.value); }
      });
    });

    /* ---- escucha ---- */
    if (lec && lec.escucha) {
      Array.prototype.forEach.call(raiz.querySelectorAll('.escucha-item'), function (nodo) {
        var it = lec.escucha.items[parseInt(nodo.dataset.idx, 10)];
        if (!it) return;
        var input = nodo.querySelector('.esc-input');
        var fb = nodo.querySelector('.esc-feedback');

        function revelar(det) {
          var h = '';
          if (det) h += I.feedback(det, null);
          h += '<div class="esc-texto"><span class="en" data-say>' + esc(it.texto) + '</span>' +
               (it.es ? '<span class="esc-es">' + esc(it.es) + '</span>' : '') + '</div>';
          fb.innerHTML = h;
          fb.hidden = false;
        }

        nodo.querySelector('.esc-check').addEventListener('click', function () {
          revelar(E.Quiz.corregir(input.value, { respuesta: it.texto }));
        });
        input.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter') { ev.preventDefault(); revelar(E.Quiz.corregir(input.value, { respuesta: it.texto })); }
        });
        nodo.querySelector('.esc-ver').addEventListener('click', function () { revelar(null); });

        I.conectarShadowing(nodo, it.texto);
      });
    }
  };

  /* ============================ SHADOWING ============================ */

  /**
   * Grabar tu voz y escucharla contra el modelo.
   * Sin puntaje automático: reconocer voz en Chrome manda el audio a Google
   * (rompe el "sin internet") y devuelve un puntaje poco confiable.
   */
  I.conectarShadowing = function (nodo, texto) {
    var boton = nodo.querySelector('.esc-grabar');
    var estado = nodo.querySelector('.esc-shadow-estado');
    if (!boton) return;

    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
        typeof MediaRecorder === 'undefined') {
      boton.disabled = true;
      boton.title = 'Este navegador no permite grabar audio';
      return;
    }

    var grabador = null, trozos = [], url = null;

    function pintarBotones() {
      var extra = nodo.querySelector('.esc-shadow-play');
      if (extra) extra.remove();
      if (!url) return;
      var cont = document.createElement('span');
      cont.className = 'esc-shadow-play';
      cont.innerHTML =
        '<button type="button" class="btn btn-sm" data-oir-mia>' + E.icono('play', { size: 13 }) + '<span>Mi voz</span></button>' +
        E.Audio.boton(texto, { etiqueta: E.icono('play', { size: 13 }) + '<span>El modelo</span>', clase: 'btn btn-sm' });
      nodo.querySelector('.esc-shadow').appendChild(cont);
      cont.querySelector('[data-oir-mia]').addEventListener('click', function () {
        E.Audio.detener();
        var a = new Audio(url);
        a.play();
      });
    }

    boton.addEventListener('click', function () {
      if (grabador && grabador.state === 'recording') {
        grabador.stop();
        return;
      }
      estado.textContent = 'Pidiendo permiso del micrófono…';
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        trozos = [];
        grabador = new MediaRecorder(stream);
        grabador.ondataavailable = function (ev) { if (ev.data.size) trozos.push(ev.data); };
        grabador.onstop = function () {
          stream.getTracks().forEach(function (t) { t.stop(); });
          if (url) URL.revokeObjectURL(url);
          url = URL.createObjectURL(new Blob(trozos, { type: grabador.mimeType || 'audio/webm' }));
          boton.innerHTML = E.icono('mic', { size: 14 }) + '<span>Grabar de nuevo</span>';
          boton.classList.remove('grabando');
          estado.textContent = 'Escuchate y compará. Buscá el ritmo, no la perfección.';
          pintarBotones();
        };
        grabador.start();
        boton.innerHTML = E.icono('pause', { size: 14 }) + '<span>Detener</span>';
        boton.classList.add('grabando');
        estado.textContent = 'Grabando… repetí la frase.';
      }).catch(function (err) {
        estado.textContent = err && err.name === 'NotAllowedError'
          ? 'No diste permiso al micrófono. El resto de la lección funciona igual.'
          : 'No pude acceder al micrófono (' + (err && err.name ? err.name : 'error') + ').';
      });
    });
  };
})();
