/* ==========================================================================
   app.js — router por hash, barra lateral, widget de pomodoro y eventos.
   Se carga ÚLTIMO.
   ========================================================================== */
(function () {
  'use strict';

  var E = window.ESTUDIO;
  var S = E.Store, V = E.Vistas;

  var app, lateral, pomoNodo;
  var sesionQuiz = null;        // sesión de quiz en curso
  var respondida = null;        // respuesta de la pregunta actual
  var pestanaLec = 'simple';

  /* ============================ ARRANQUE ============================ */

  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.setAttribute('data-tema', S.tema());

    app = document.getElementById('vista');
    lateral = document.getElementById('lateral');
    pomoNodo = document.getElementById('pomo');

    var btnMenu = document.getElementById('abrir-lateral');
    if (btnMenu) btnMenu.innerHTML = E.icono('menu');

    E.cargarTracks()
      .then(function () {
        dibujarLateral();
        window.addEventListener('hashchange', enrutar);
        enrutar();
      })
      .catch(function (err) {
        app.innerHTML = V.vacio('⚠️', 'No se pudo cargar el contenido',
          'Revisá que la carpeta <code>contenido/</code> esté completa.<br><small>' + E.esc(err.message) + '</small>');
      });

    E.Pomodoro.alCambiar(dibujarPomodoro);
    S.alCambiar(dibujarLateral);
    dibujarPomodoro();
    conectarEventosGlobales();
  });

  /* ============================ ROUTER ============================ */

  function ruta() {
    var h = location.hash.replace(/^#\/?/, '');
    return h ? h.split('/') : [];
  }

  function enrutar() {
    var r = ruta();
    window.scrollTo(0, 0);
    sesionQuiz = null; respondida = null;

    if (!r.length)                 return pintar(V.inicio());
    if (r[0] === 'logros')         return pintar(V.logros());
    if (r[0] === 'progreso')       return pintar(V.progreso());
    if (r[0] === 'ajustes')        return pintar(V.ajustes());
    if (r[0] === 't')              return verTrack(r[1]);
    if (r[0] === 'm')              return verModulo(r[1], r[2]);
    if (r[0] === 'l')              return verLeccion(r[1], r[2], parseInt(r[3], 10));
    if (r[0] === 'examen')         return verExamen(r[1], r[2]);
    if (r[0] === 'vocabulario')    return verVocabulario(r[1], r[2]);
    if (r[0] === 'repaso')         return verRepaso();

    pintar(V.vacio('🤷', 'No encontré esa página', 'Volvé al escritorio y seguí desde ahí.',
      '<a class="btn btn-primario" href="#/">Ir al escritorio</a>'));
  }

  function pintar(html) {
    app.innerHTML = html;
    marcarNav();
    cerrarLateral();
  }

  function cargando() {
    app.innerHTML = '<div class="vacio"><div class="ic">⏳</div><p>Cargando…</p></div>';
  }

  /* ============================ PANTALLAS ============================ */

  function verTrack(id) {
    var t = E.tracks[id];
    if (!t) return pintar(V.vacio('🤷', 'Ese track no existe', 'Volvé al escritorio.'));
    pintar(V.track(t));
  }

  function verModulo(trackId, modId) {
    var t = E.tracks[trackId], meta = E.metaModulo(trackId, modId);
    if (!t || !meta) return pintar(V.vacio('🤷', 'Ese módulo no existe', 'Volvé al escritorio.'));
    if (meta.estado !== 'listo') {
      return pintar(V.vacio('✎', 'Todavía no escribí este módulo',
        'El temario ya está definido. Pedime que lo escriba cuando quieras arrancarlo.',
        '<a class="btn btn-primario" href="#/t/' + trackId + '">Volver al track</a>'));
    }
    cargando();
    E.cargarModulo(trackId, modId).then(function (mod) {
      if (!mod) return pintar(V.vacio('⚠️', 'No pude cargar el módulo', 'Falta el archivo de contenido.'));
      pintar(V.modulo(t, meta, mod));
    });
  }

  function verLeccion(trackId, modId, n) {
    var t = E.tracks[trackId], meta = E.metaModulo(trackId, modId);
    if (!t || !meta) return pintar(V.vacio('🤷', 'No encontré esa lección', 'Volvé al escritorio.'));
    cargando();
    E.cargarModulo(trackId, modId).then(function (mod) {
      if (!mod || !mod.lecciones[n - 1]) {
        return pintar(V.vacio('🤷', 'No encontré esa lección', 'Volvé al módulo.'));
      }
      pestanaLec = 'simple';
      var ctx = { trackId: trackId, moduloId: modId, mod: mod, n: n };
      pintar(V.leccion(t, meta, mod, n, pestanaLec));
      S.marcarLeccion(trackId + '/' + modId + '/l' + n);
      conectarPestanas(mod.lecciones[n - 1], ctx);
    });
  }

  function conectarPestanas(lec, ctx) {
    var panel = document.getElementById('panel-lec');

    // Los ejercicios y la escucha se re-conectan cada vez que se redibuja el panel.
    function conectarWidgets() {
      if (!E.Ingles) return;
      E.Ingles.conectar(panel, function (clave) {
        var idx = parseInt(String(clave).split('/')[2].slice(1), 10);
        return E.Quiz.ejerciciosDe(ctx.mod)[idx] || null;
      }, lec);
    }
    conectarWidgets();

    Array.prototype.forEach.call(document.querySelectorAll('.pest'), function (b) {
      b.addEventListener('click', function () {
        pestanaLec = b.dataset.pest;
        Array.prototype.forEach.call(document.querySelectorAll('.pest'), function (o) {
          o.classList.toggle('activa', o === b);
        });
        E.Audio.detener();
        panel.innerHTML = V.panelLeccion(lec, pestanaLec, ctx);
        panel.style.animation = 'none'; void panel.offsetWidth; panel.style.animation = '';
        conectarWidgets();
      });
    });
  }

  function verExamen(trackId, modId) {
    var t = E.tracks[trackId], meta = E.metaModulo(trackId, modId);
    if (!t || !meta) return pintar(V.vacio('🤷', 'No encontré ese examen', 'Volvé al escritorio.'));
    cargando();
    E.cargarModulo(trackId, modId).then(function () {
      sesionQuiz = E.Quiz.examen(trackId, modId);
      if (!sesionQuiz) return pintar(V.vacio('📝', 'Este módulo todavía no tiene examen', 'Volvé al módulo.'));
      sesionQuiz.ctxTrack = t; sesionQuiz.ctxMeta = meta;
      respondida = null;
      pintarQuiz();
    });
  }

  function verVocabulario(trackId, modId) {
    var t = E.tracks[trackId], meta = E.metaModulo(trackId, modId);
    if (!t || !meta) return pintar(V.vacio('🤷', 'No encontré ese módulo', 'Volvé al escritorio.'));
    cargando();
    E.cargarModulo(trackId, modId).then(function () {
      sesionQuiz = E.Quiz.vocabulario(trackId, modId);
      if (!sesionQuiz) {
        return pintar(V.vacio('🗂️', 'Este módulo no tiene vocabulario',
          'Volvé al módulo y seguí con las lecciones.',
          '<a class="btn btn-primario" href="#/m/' + trackId + '/' + modId + '">Volver al módulo</a>'));
      }
      sesionQuiz.ctxTrack = t; sesionQuiz.ctxMeta = meta;
      respondida = null;
      pintarQuiz();
    });
  }

  function verRepaso() {
    if (!E.Quiz.pendientes()) {
      return pintar(V.vacio('🧠', 'No tenés nada para repasar hoy',
        'Cuando falles preguntas en un examen, van a aparecer acá los días siguientes.',
        '<a class="btn btn-primario" href="#/">Volver al escritorio</a>'));
    }
    cargando();
    E.Quiz.prepararRepaso().then(function () {
      sesionQuiz = E.Quiz.repaso();
      if (!sesionQuiz) {
        return pintar(V.vacio('🧠', 'No pude armar el repaso',
          'Las preguntas pendientes pertenecen a módulos que ya no existen.'));
      }
      respondida = null;
      pintarQuiz();
    });
  }

  /* ============================ QUIZ ============================ */

  function pintarQuiz() {
    app.innerHTML = V.quizPregunta(sesionQuiz, respondida);
    marcarNav();

    var p = sesionQuiz.actual().pregunta;

    function enviar(valor) {
      if (respondida) return;
      var res = sesionQuiz.responder(valor);
      respondida = { elegida: valor, ok: res.ok, detalle: res.detalle };
      pintarQuiz();
    }

    // Opción múltiple
    Array.prototype.forEach.call(document.querySelectorAll('.opcion'), function (b) {
      b.addEventListener('click', function () { enviar(parseInt(b.dataset.op, 10)); });
    });

    // Respuesta escrita
    if (!respondida && E.Quiz.esEscrita(p)) {
      var boton = document.getElementById('responder');
      if (p.tipo === 'ordenar') {
        var fichas = E.Ingles.fichasControl(app);
        var limpiar = document.getElementById('limpiar');
        if (limpiar) limpiar.addEventListener('click', fichas.limpiar);
        if (boton) boton.addEventListener('click', function () { enviar(fichas.valor()); });
      } else {
        var input = document.getElementById('respuesta-texto');
        if (boton && input) boton.addEventListener('click', function () { enviar(input.value); });
        if (input) {
          input.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') { ev.preventDefault(); enviar(input.value); }
          });
          input.focus();
        }
      }
    }

    var sig = document.getElementById('siguiente');
    if (sig) sig.addEventListener('click', function () {
      respondida = null;
      if (sesionQuiz.avanzar()) { pintarQuiz(); }
      else {
        sesionQuiz.cerrar();
        app.innerHTML = V.quizResultado(sesionQuiz, sesionQuiz.ctxTrack, sesionQuiz.ctxMeta);
        dibujarLateral();
      }
    });
  }

  /* ============================ BARRA LATERAL ============================ */

  function dibujarLateral() {
    if (!lateral) return;
    var pendientes = E.Quiz.pendientes();
    var h = '';

    h += '<div class="marca"><div class="marca-logo">' + E.icono('cap', { size: 20 }) + '</div>' +
      '<div><div class="marca-txt">Estudio</div><div class="marca-sub">Clavecode</div></div></div>';

    h += '<div class="nav-grupo">';
    h += item('#/', 'home', 'Escritorio');
    h += item('#/repaso', 'repeat', 'Repaso del día', pendientes ? '<span class="pill">' + pendientes + '</span>' : '');
    h += item('#/progreso', 'trending', 'Progreso');
    h += item('#/logros', 'award', 'Logros');
    h += '</div>';

    h += '<div class="nav-grupo"><div class="nav-titulo">Cursos</div>';
    E.listaTracks().forEach(function (t) {
      var p = S.progresoTrack(t.id);
      h += item('#/t/' + t.id, E.iconoCurso(t.id), t.titulo, '<span class="mini">' + p.pct + '%</span>', t.color);
      h += '<div class="barra-mini"><i style="width:' + p.pct + '%;background:' + t.color + '"></i></div>';
    });
    h += '</div>';

    h += '<div class="nav-grupo">' + item('#/ajustes', 'settings', 'Ajustes') + '</div>';

    lateral.innerHTML = h;
    marcarNav();
  }

  /* ic = nombre de ícono (assets/iconos.js). color: tinta opcional del ícono. */
  function item(href, ic, texto, extra, color) {
    var estilo = color ? ' style="color:' + color + '"' : '';
    return '<a class="nav-item" href="' + href + '"><span class="ic"' + estilo + '>' + E.icono(ic) + '</span>' +
      '<span>' + E.esc(texto) + '</span>' + (extra || '') + '</a>';
  }

  function marcarNav() {
    var actual = location.hash || '#/';
    Array.prototype.forEach.call(document.querySelectorAll('.nav-item'), function (a) {
      var href = a.getAttribute('href');
      var activo = href === actual ||
        (href !== '#/' && actual.indexOf(href) === 0) ||
        (href.indexOf('#/t/') === 0 && actual.indexOf('/' + href.slice(4) + '/') > -1);
      a.classList.toggle('activo', activo);
    });
  }

  function cerrarLateral() {
    lateral.classList.remove('abierta');
    var velo = document.querySelector('.velo');
    if (velo) velo.remove();
  }

  /* ============================ POMODORO ============================ */

  function dibujarPomodoro() {
    if (!pomoNodo) return;
    var P = E.Pomodoro, e = P.estado();
    var R = 20, C = 2 * Math.PI * R;
    var offset = C * (1 - P.fraccion());
    var icoCentro = (e.fase === 'foco' || e.fase === 'idle') ? 'timer' : 'coffee';

    pomoNodo.className = 'pomo ' + e.fase;
    pomoNodo.innerHTML =
      '<div class="pomo-anillo">' +
        '<svg width="46" height="46"><circle class="fondo" cx="23" cy="23" r="' + R + '" fill="none" stroke-width="3.5"/>' +
        '<circle class="frente" cx="23" cy="23" r="' + R + '" fill="none" stroke-width="3.5" ' +
        'stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + offset.toFixed(1) + '"/></svg>' +
        '<div class="emoji">' + E.icono(icoCentro, { size: 17 }) + '</div>' +
      '</div>' +
      '<div class="pomo-txt"><div class="pomo-reloj">' + P.reloj() + '</div>' +
        '<div class="pomo-fase">' + P.etiquetaFase() + '</div></div>' +
      '<div class="pomo-btns">' +
        '<button class="pomo-btn" id="pomo-play" title="' + (e.corriendo ? 'Pausar' : 'Arrancar') + '">' +
          E.icono(e.corriendo ? 'pause' : 'play', { size: 14 }) + '</button>' +
        '<button class="pomo-btn" id="pomo-saltar" title="Saltar esta fase">' + E.icono('skip', { size: 14 }) + '</button>' +
      '</div>';

    document.getElementById('pomo-play').addEventListener('click', function () {
      E.Pomodoro.pedirPermisoNotificaciones();
      E.Pomodoro.alternar();
    });
    document.getElementById('pomo-saltar').addEventListener('click', function () { E.Pomodoro.saltar(); });
  }

  /* ============================ LOGROS (brindis) ============================ */

  E.avisarLogro = function (logro) {
    // Se pueden desbloquear varios a la vez: van apilados, no encimados.
    var pila = document.getElementById('brindis-pila');
    if (!pila) {
      pila = document.createElement('div');
      pila.id = 'brindis-pila';
      document.body.appendChild(pila);
    }
    var n = document.createElement('div');
    n.className = 'brindis';
    n.innerHTML = '<div class="ic">' + logro.icono + '</div><div><b>Logro: ' + E.esc(logro.titulo) + '</b>' +
      '<span>' + E.esc(logro.desc) + '</span></div>';
    pila.appendChild(n);
    setTimeout(function () {
      n.remove();
      if (!pila.children.length) pila.remove();
    }, 4600);
  };

  /* ============================ EVENTOS GLOBALES ============================ */

  function conectarEventosGlobales() {
    document.getElementById('abrir-lateral').addEventListener('click', function () {
      lateral.classList.add('abierta');
      var velo = document.createElement('div');
      velo.className = 'velo';
      velo.addEventListener('click', cerrarLateral);
      document.body.appendChild(velo);
    });

    // Un enlace al hash actual no dispara hashchange: hay que re-enrutar a mano.
    // Sin esto, "Rendir de nuevo" desde la pantalla de resultado no hace nada.
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a[href^="#"]');
      if (!a) return;
      if (a.getAttribute('href') === (location.hash || '#/')) {
        ev.preventDefault();
        enrutar();
      }
    });

    // Delegación para los botones de la pantalla de ajustes.
    document.addEventListener('click', function (ev) {
      var id = ev.target && ev.target.id;
      if (id === 'exportar') exportar();
      if (id === 'importar') document.getElementById('archivo').click();
      if (id === 'tema') alternarTema();
      if (id === 'notis') E.Pomodoro.pedirPermisoNotificaciones();
      if (id === 'reset') resetear();
    });

    document.addEventListener('change', function (ev) {
      if (ev.target && ev.target.id === 'archivo') importar(ev.target.files[0]);
    });

    // Atajos: ← → entre lecciones, espacio para el pomodoro.
    document.addEventListener('keydown', function (ev) {
      if (ev.target.matches('input, textarea')) return;
      if (ev.code === 'Space' && !ev.target.closest('button')) {
        ev.preventDefault(); E.Pomodoro.alternar(); return;
      }
      var sel = ev.key === 'ArrowLeft' ? '.nav-lec .btn:first-child'
              : ev.key === 'ArrowRight' ? '.nav-lec .btn:last-child' : null;
      if (sel) { var b = document.querySelector(sel); if (b) b.click(); }
    });
  }

  function exportar() {
    var blob = new Blob([S.exportar()], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'estudio-progreso-' + E.hoy() + '.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  function importar(archivo) {
    if (!archivo) return;
    var lector = new FileReader();
    lector.onload = function () {
      try {
        S.importar(lector.result);
        dibujarLateral();
        enrutar();
        alert('Progreso importado.');
      } catch (e) {
        alert('No pude leer ese archivo: ' + e.message);
      }
    };
    lector.readAsText(archivo);
  }

  function alternarTema() {
    var nuevo = S.tema() === 'oscuro' ? 'claro' : 'oscuro';
    S.tema(nuevo);
    document.documentElement.setAttribute('data-tema', nuevo);
    if ((location.hash || '') === '#/ajustes') enrutar(); // refresca el botón
  }

  function resetear() {
    if (!confirm('¿Seguro? Se borra todo tu progreso, racha y logros. No se puede deshacer.')) return;
    S.reset();
    dibujarLateral();
    location.hash = '#/';
    enrutar();
  }
})();
