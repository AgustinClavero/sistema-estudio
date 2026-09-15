/* ==========================================================================
   vistas.js — el HTML de cada pantalla. Solo dibuja; la lógica está en
   store.js / quiz.js. Cada función devuelve un string de HTML.
   ========================================================================== */
(function () {
  'use strict';

  var E = window.ESTUDIO;
  var esc = E.esc;
  var V = E.Vistas = {};

  function barra(pct) { return '<div class="barra"><i style="width:' + pct + '%"></i></div>'; }

  function metrica(n, etiqueta, ic) {
    var cab = ic ? '<div class="cab">' + E.icono(ic) + '</div>' : '';
    return '<div class="metrica">' + cab + '<div class="n">' + n + '</div><div class="e">' + etiqueta + '</div></div>';
  }

  /** Imagen de portada de un curso: la propia, o por convención según su id. */
  function imagenCurso(t) {
    return t.imagen || ('assets/img/cursos/' + t.id + '.jpg');
  }

  /** Nivel/etiqueta que se muestra arriba de la portada. */
  function nivelCurso(t) {
    if (/^ingles/.test(t.id)) return t.id.replace('ingles-', '').toUpperCase();
    return 'Curso';
  }

  /* ============================ DASHBOARD ============================ */

  V.inicio = function () {
    var S = E.Store, d = S.datos();
    var pendientes = E.Quiz.pendientes();
    var sig = S.siguientePendiente();
    var horas = (d.pomodoro.minutos / 60);
    var h = '';

    h += '<div class="encabezado"><h1>Tu escritorio</h1>' +
         '<p class="sub">' + saludo() + '</p></div>';

    h += '<div class="grilla g4" style="margin-bottom:26px">' +
      metrica(S.progresoGlobal() + '%', 'Progreso total', 'trending') +
      metrica(S.rachaViva(), S.rachaViva() === 1 ? 'Día de racha' : 'Días de racha', 'flame') +
      metrica(horas < 10 ? horas.toFixed(1) : Math.round(horas), 'Horas enfocadas', 'clock') +
      metrica(Object.keys(d.logros).length + '/' + S.LOGROS.length, 'Logros', 'award') +
      '</div>';

    // Repaso pendiente — lo más importante del día
    if (pendientes > 0) {
      h += '<div class="tarjeta" style="border-color:var(--alerta);margin-bottom:16px">' +
        '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">' +
        '<div class="ic-badge" style="color:var(--alerta-t)">' + E.icono('repeat', { size: 26 }) + '</div>' +
        '<div style="flex:1;min-width:200px">' +
        '<h3 style="margin:0 0 3px">Repaso del día</h3>' +
        '<p style="margin:0;color:var(--texto-2);font-size:14px">Tenés <b>' +
        E.plural(pendientes, 'pregunta', 'preguntas') + '</b> que ya fallaste antes y toca volver a ver. ' +
        'Cinco minutos acá valen más que media hora de lectura nueva.</p></div>' +
        '<a class="btn btn-primario" href="#/repaso">Repasar ahora</a>' +
        '</div></div>';
    }

    // Seguir donde quedaste
    if (sig) {
      var destino = sig.leccion
        ? '#/l/' + sig.track.id + '/' + sig.modulo.id + '/' + sig.leccion
        : '#/examen/' + sig.track.id + '/' + sig.modulo.id;
      var que = sig.leccion
        ? 'Lección ' + sig.leccion + ' · ' + esc(sig.modulo.titulo)
        : 'Examen de ' + esc(sig.modulo.titulo);
      h += '<div class="tarjeta" style="margin-bottom:26px">' +
        '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">' +
        '<div class="ic-badge" style="color:' + sig.track.color + '">' + E.icono(E.iconoCurso(sig.track.id), { size: 28 }) + '</div>' +
        '<div style="flex:1;min-width:200px">' +
        '<div style="font-size:11.5px;text-transform:uppercase;letter-spacing:.7px;color:var(--texto-3);font-weight:700">Seguí por acá</div>' +
        '<h3 style="margin:2px 0 0">' + que + '</h3>' +
        '<p style="margin:2px 0 0;color:var(--texto-2);font-size:13.5px">' + esc(sig.track.titulo) + '</p></div>' +
        '<a class="btn btn-primario btn-lg" href="' + destino + '">' +
        (sig.leccion ? 'Continuar' : 'Rendir examen') + '</a>' +
        '</div></div>';
    } else {
      h += '<div class="tarjeta" style="margin-bottom:26px"><h3 style="margin:0 0 4px">Todo al día 🎉</h3>' +
        '<p style="margin:0;color:var(--texto-2)">No te queda nada pendiente en el contenido escrito. ' +
        'Buen momento para pedir el siguiente curso.</p></div>';
    }

    h += '<h2>Cursos</h2>';
    h += '<div class="cursos-grid">';
    E.listaTracks().forEach(function (t) { h += V.tarjetaTrack(t); });
    h += '</div>';

    return h;
  };

  function saludo() {
    var hh = new Date().getHours();
    var m = hh < 6 ? 'Muy de madrugada' : hh < 13 ? 'Buenos días' : hh < 20 ? 'Buenas tardes' : 'Buenas noches';
    return m + '. Lo que estudies hoy es lo que vas a poder explicar mañana.';
  }

  V.tarjetaTrack = function (t) {
    var p = E.Store.progresoTrack(t.id);
    var listos = E.modulosListos(t.id).length;
    var totalLec = 0;
    t.modulos.forEach(function (m) { if (m.estado === 'listo') totalLec += (m.lecciones || 0); });

    var h = '<a class="curso" href="#/t/' + t.id + '" style="--c:' + t.color + '">';

    h += '<div class="curso-portada" style="background-image:url(' + imagenCurso(t) + ')">' +
      '<span class="curso-nivel">' + esc(nivelCurso(t)) + '</span>' +
      '<span class="curso-icono">' + E.icono(E.iconoCurso(t.id), { size: 24 }) + '</span>' +
      '</div>';

    h += '<div class="curso-body">';
    h += '<h3>' + esc(t.titulo) + '</h3>';
    h += '<p class="curso-sub">' + esc(t.subtitulo) + '</p>';

    h += '<div class="curso-meta">' +
      '<span>' + E.icono('grid') + listos + ' módulos</span>' +
      '<span>' + E.icono('doc') + totalLec + ' lecciones</span>' +
      '</div>';

    h += barra(p.pct);
    h += '<div class="curso-foot"><span>' + p.pct + '% completo</span>' +
      '<span class="curso-cta">' + (p.pct > 0 ? 'Continuar' : 'Empezar') + E.icono('chevron') + '</span></div>';

    h += '</div></a>';
    return h;
  };

  /* ============================ TRACK ============================ */

  V.track = function (t) {
    var S = E.Store, p = S.progresoTrack(t.id);
    var h = '';

    h += '<div class="migas"><a href="#/">Cursos</a> › ' + esc(t.titulo) + '</div>';
    h += '<div class="encabezado curso-cab">' +
      '<span class="ic-badge" style="color:' + t.color + '">' + E.icono(E.iconoCurso(t.id), { size: 26 }) + '</span>' +
      '<div><h1>' + esc(t.titulo) + '</h1>' +
      '<p class="sub" style="margin:2px 0 0">' + esc(t.subtitulo) + '</p></div></div>';

    h += '<div class="tarjeta lectura" style="margin-bottom:26px">' +
      '<div class="prosa" style="font-size:14.8px">' + t.descripcion + '</div>' +
      '<div style="margin-top:16px">' + barra(p.pct) +
      '<div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--texto-3);margin-top:7px">' +
      '<span>' + p.lecciones + '/' + p.totalLecciones + ' lecciones · ' + p.modulos + '/' + p.totalModulos + ' exámenes</span>' +
      '<span>' + p.pct + '%</span></div></div></div>';

    h += '<h2>Módulos</h2>';
    t.modulos.forEach(function (m, i) { h += V.filaModulo(t, m, i); });

    if (t.siguientes && t.siguientes.length) {
      h += '<h2>¿Y después de este track?</h2>';
      h += '<div class="grilla g2">';
      t.siguientes.forEach(function (s) {
        var otro = E.tracks[s.track];
        if (!otro) return;
        h += '<div class="tarjeta"><div class="tt" style="display:flex;gap:10px;align-items:center;margin-bottom:6px">' +
          '<span class="ic-badge" style="width:34px;height:34px;flex-basis:34px;border-radius:10px;color:' + otro.color + '">' + E.icono(E.iconoCurso(otro.id), { size: 18 }) + '</span>' +
          '<b>' + esc(otro.titulo) + '</b></div>' +
          '<p style="margin:0 0 12px;color:var(--texto-2);font-size:14px">' + esc(s.porQue) + '</p>' +
          '<a class="btn btn-sm" href="#/t/' + otro.id + '">Ver temario ' + E.icono('chevron') + '</a></div>';
      });
      h += '</div>';
    }
    return h;
  };

  V.filaModulo = function (t, m, i) {
    var S = E.Store;
    var porEscribir = m.estado !== 'listo';
    var abierto = S.desbloqueado(t.id, m.id);
    var aprobado = S.aprobado(t.id, m.id);

    var vistas = 0;
    for (var l = 1; l <= (m.lecciones || 0); l++) {
      if (S.leccionVista(t.id + '/' + m.id + '/l' + l)) vistas++;
    }

    var clases = 'modulo' + (aprobado ? ' hecho' : '') + (!abierto || porEscribir ? ' trabado' : '');
    var tag = porEscribir ? '<div class="' + clases + '">' : '<a class="' + clases + '" href="#/m/' + t.id + '/' + m.id + '">';
    var cierre = porEscribir ? '</div>' : '</a>';

    var numHtml = aprobado ? E.icono('check')
      : (!abierto ? E.icono('lock', { size: 16 })
      : (porEscribir ? E.icono('pencil', { size: 16 }) : String(i).padStart(2, '0')));

    var h = tag;
    h += '<div class="num">' + numHtml + '</div>';
    h += '<div class="cuerpo"><h4>' + esc(m.titulo) + '</h4><p>' + esc(m.resumen) + '</p>';
    h += '<div class="meta">';
    if (porEscribir) {
      h += '<span class="etiqueta">Por escribir</span>';
      if (m.temas) h += '<span>' + esc(m.temas.join(' · ')) + '</span>';
    } else if (!abierto) {
      h += '<span class="etiqueta warn">' + E.icono('lock', { size: 13 }) + ' Aprobá el módulo anterior</span>';
    } else {
      h += '<span>' + m.lecciones + ' lecciones</span>';
      h += '<span>~' + m.minutos + ' min</span>';
      h += '<span>' + vistas + '/' + m.lecciones + ' leídas</span>';
      var ex = S.examen(t.id + '/' + m.id);
      if (aprobado) h += '<span class="etiqueta ok">Aprobado ' + ex.mejor + '%</span>';
      else if (ex) h += '<span class="etiqueta warn">Mejor: ' + ex.mejor + '%</span>';
    }
    h += '</div></div>' + cierre;
    return h;
  };

  /* ============================ MÓDULO ============================ */

  V.modulo = function (t, meta, mod) {
    var S = E.Store, h = '';
    var i = E.indiceModulo(t.id, meta.id);

    h += '<div class="migas"><a href="#/">Escritorio</a> › <a href="#/t/' + t.id + '">' + esc(t.titulo) + '</a> › Módulo ' + i + '</div>';
    h += '<div class="encabezado"><h1>' + esc(meta.titulo) + '</h1>' +
      '<p class="sub">' + esc(meta.resumen) + '</p></div>';

    if (mod.intro) h += '<div class="tarjeta lectura" style="margin-bottom:24px"><div class="prosa" style="font-size:15px">' + mod.intro + '</div></div>';

    h += '<div class="lectura">';
    h += '<h2>Lecciones</h2>';
    mod.lecciones.forEach(function (lec, k) {
      var clave = t.id + '/' + meta.id + '/l' + (k + 1);
      var vista = S.leccionVista(clave);
      h += '<a class="lec-item' + (vista ? ' vista' : '') + '" href="#/l/' + t.id + '/' + meta.id + '/' + (k + 1) + '">' +
        '<span class="chk">' + (vista ? E.icono('check', { size: 12, sw: 3 }) : '') + '</span>' +
        '<span class="tit">' + (k + 1) + '. ' + esc(lec.titulo) + '</span>' +
        '<span class="min">' + E.icono('clock') + lec.minutos + ' min</span></a>';
    });

    // Vocabulario (solo si el módulo trae tarjetas)
    if (mod.vocabulario && mod.vocabulario.length) {
      h += E.Ingles.tarjetaVocabulario(t, meta, mod);
    }

    // Examen
    var ex = S.examen(t.id + '/' + meta.id);
    var todasVistas = mod.lecciones.every(function (_, k) {
      return S.leccionVista(t.id + '/' + meta.id + '/l' + (k + 1));
    });

    h += '<h2>Examen del módulo</h2>';
    h += '<div class="tarjeta"><div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">' +
      '<div class="ic-badge" style="color:' + (ex && ex.aprobado ? 'var(--ok-t)' : 'var(--marca)') + '">' +
      E.icono(ex && ex.aprobado ? 'check' : 'doc', { size: 26 }) + '</div>' +
      '<div style="flex:1;min-width:200px">' +
      '<h3 style="margin:0 0 3px">' + mod.examen.length + ' preguntas · necesitás ' + E.Quiz.APROBAR_CON + '%</h3>' +
      '<p style="margin:0;color:var(--texto-2);font-size:13.8px">' +
      (ex ? 'Mejor puntaje: <b>' + ex.mejor + '%</b> en ' + E.plural(ex.intentos, 'intento', 'intentos') + '. '
          : 'Todavía no lo rendiste. ') +
      (ex && ex.aprobado ? 'Ya desbloqueaste el módulo siguiente.' : 'Aprobarlo desbloquea el módulo siguiente.') +
      '</p></div>' +
      '<a class="btn ' + (todasVistas ? 'btn-primario' : '') + '" href="#/examen/' + t.id + '/' + meta.id + '">' +
      (ex ? 'Volver a rendir' : 'Rendir examen') + '</a></div>';
    if (!todasVistas) {
      h += '<p style="margin:14px 0 0;color:var(--texto-3);font-size:13px">' +
        'Podés rendirlo cuando quieras, pero todavía te quedan lecciones sin leer.</p>';
    }
    h += '</div>';
    h += '</div>';
    return h;
  };

  /* ============================ LECCIÓN ============================ */

  var PESTANAS = [
    { k: 'simple',    et: 'En criollo',      ic: '🟢', c: 'var(--simple-c)' },
    { k: 'tecnico',   et: 'Técnico',         ic: '🔵', c: 'var(--tecnico-c)' },
    { k: 'visual',    et: 'Visual',          ic: '📊', c: 'var(--visual-c)' },
    { k: 'escucha',   et: 'Escucha',         ic: '🎧', c: 'var(--escucha-c)' },
    { k: 'entrevista',et: 'En una entrevista',ic: '💼', c: 'var(--entrev-c)' },
    { k: 'practica',  et: 'En la práctica',  ic: '🛠️', c: 'var(--prac-c)' },
    { k: 'errores',   et: 'Errores comunes', ic: '⚠️', c: 'var(--error-c)' },
    { k: 'glosario',  et: 'Glosario',        ic: '📖', c: 'var(--glos-c)' },
    { k: 'fuentes',   et: 'Fuentes',         ic: '📚', c: 'var(--fuentes-c)' },
  ];

  /** Una pestaña se muestra solo si la lección tiene con qué llenarla. */
  function tienePestana(lec, k) {
    if (k === 'fuentes') return !!(lec._fuentes && lec._fuentes.length);
    // La práctica puede ser prosa, ejercicios interactivos, o las dos cosas.
    if (k === 'practica') return !!(lec.practica || (lec.ejercicios && lec.ejercicios.length));
    return !!lec[k];
  }

  V.leccion = function (t, meta, mod, n, pestanaActiva) {
    var lec = mod.lecciones[n - 1];
    // La pestaña de fuentes se resuelve a nivel lección o módulo.
    lec._fuentes = E.fuentesDe(mod, lec);
    var i = E.indiceModulo(t.id, meta.id);
    var ctx = { trackId: t.id, moduloId: meta.id, mod: mod, n: n };
    var h = '';

    h += '<div class="migas"><a href="#/t/' + t.id + '">' + esc(t.titulo) + '</a> › ' +
      '<a href="#/m/' + t.id + '/' + meta.id + '">Módulo ' + i + '</a> › Lección ' + n + '</div>';
    h += '<div class="encabezado lectura"><h1>' + esc(lec.titulo) + '</h1>' +
      '<p class="sub">' + esc(meta.titulo) + ' · ' + lec.minutos + ' min de lectura</p></div>';

    var disponibles = PESTANAS.filter(function (p) { return tienePestana(lec, p.k); });
    if (!disponibles.some(function (p) { return p.k === pestanaActiva; })) {
      pestanaActiva = disponibles[0] ? disponibles[0].k : 'simple';
    }

    h += '<div class="lectura"><div class="pestanas">';
    disponibles.forEach(function (p) {
      h += '<button class="pest' + (p.k === pestanaActiva ? ' activa' : '') + '" data-pest="' + p.k + '" style="--cc:' + p.c + '">' +
        E.icono(E.ICONO_PEST[p.k] || 'book') + p.et + '</button>';
    });
    h += '</div>';

    h += '<div class="panel-lec" id="panel-lec">' + V.panelLeccion(lec, pestanaActiva, ctx) + '</div>';

    // Navegación
    h += '<div class="nav-lec">';
    if (n > 1) h += '<a class="btn" href="#/l/' + t.id + '/' + meta.id + '/' + (n - 1) + '">' + E.icono('arrowleft') + 'Anterior</a>';
    else h += '<a class="btn" href="#/m/' + t.id + '/' + meta.id + '">' + E.icono('arrowleft') + 'Volver al módulo</a>';
    if (n < mod.lecciones.length) {
      h += '<a class="btn btn-primario" href="#/l/' + t.id + '/' + meta.id + '/' + (n + 1) + '">Siguiente lección' + E.icono('arrowright') + '</a>';
    } else {
      h += '<a class="btn btn-primario" href="#/examen/' + t.id + '/' + meta.id + '">Rendir el examen' + E.icono('arrowright') + '</a>';
    }
    h += '</div></div>';
    return h;
  };

  V.panelLeccion = function (lec, k, ctx) {
    if (k === 'simple' || k === 'tecnico') {
      return '<div class="prosa">' + lec[k] + '</div>';
    }
    if (k === 'practica') {
      var pr = lec.practica ? '<div class="prosa">' + lec.practica + '</div>' : '';
      if (lec.ejercicios && lec.ejercicios.length && ctx) {
        pr += E.Ingles.panelEjercicios(lec, ctx);
      }
      return pr;
    }
    if (k === 'escucha') return E.Ingles.panelEscucha(lec);
    if (k === 'visual') {
      return '<div class="diagrama">' + lec.visual.svg + '</div>' +
        (lec.visual.pie ? '<div class="diagrama-pie">' + esc(lec.visual.pie) + '</div>' : '') +
        (lec.visual.nota ? '<div class="prosa" style="margin-top:20px">' + lec.visual.nota + '</div>' : '');
    }
    if (k === 'entrevista') {
      var h = '<p class="sub">Así te lo pueden preguntar, y así conviene contestarlo. Respuestas de 30–60 segundos, no monólogos.</p>';
      lec.entrevista.forEach(function (qa) {
        h += '<div class="qa"><div class="q">❝ ' + esc(qa.p) + ' ❞</div><div class="r">' + qa.r + '</div></div>';
      });
      return h;
    }
    if (k === 'errores') {
      var e = '<p class="sub">Saber esto es lo que te separa de alguien que solo leyó el título.</p>';
      lec.errores.forEach(function (m) {
        e += '<div class="mito"><div class="m">✗ ' + esc(m.mito) + '</div><div class="v">' + m.realidad + '</div></div>';
      });
      return e;
    }
    if (k === 'glosario') {
      var g = '<div class="glosario"><dl>';
      lec.glosario.forEach(function (t) {
        g += '<dt>' + esc(t.t) + '</dt><dd>' + t.d + '</dd>';
      });
      return g + '</dl></div>';
    }
    if (k === 'fuentes') return V.panelFuentes(lec._fuentes || []);
    return '';
  };

  /* ---------- pestaña de fuentes ---------- */

  var ETIQUETA_VOLATIL = {
    alta:  { t: 'Verificá siempre', c: 'var(--mal)' },
    media: { t: 'Cambia cada tanto', c: 'var(--alerta)' },
    baja:  { t: 'Estable',           c: 'var(--ok)' },
  };

  V.panelFuentes = function (fuentes) {
    var P = (E.FUENTES && E.FUENTES.procedencia) || null;
    var h = '';

    if (P) {
      h += '<div class="procedencia">' +
        '<div class="proc-cab">⚠️ De dónde salió esto</div>' +
        '<div class="prosa" style="font-size:14.5px">' + P.texto + '</div>' +
        '<div class="proc-corte">Fecha de corte del modelo que lo escribió: <b>' + esc(P.corte) + '</b></div>' +
        '</div>';
    }

    if (!fuentes.length) {
      return h + '<p class="sub">Esta lección todavía no tiene fuentes asociadas.</p>';
    }

    h += '<h4 style="margin-top:26px">Dónde verificar</h4>';
    fuentes.forEach(function (f) {
      var v = ETIQUETA_VOLATIL[f.volatilidad] || ETIQUETA_VOLATIL.media;
      h += '<div class="fuente">' +
        '<div class="fuente-cab">' +
          '<a href="' + esc(f.url) + '" target="_blank" rel="noopener noreferrer">' + esc(f.nombre) + ' ↗</a>' +
          '<span class="fuente-vol" style="--fv:' + v.c + '">' + v.t + '</span>' +
        '</div>' +
        '<p class="fuente-que">' + f.que + '</p>' +
        '<div class="fuente-url">' + esc(f.url) + '</div>' +
        '</div>';
    });

    if (P && P.reglas) {
      h += '<h4 style="margin-top:26px">Cuánto confiar en cada cosa</h4>';
      P.reglas.forEach(function (r) {
        var v = ETIQUETA_VOLATIL[r.nivel];
        h += '<div class="regla-conf"><span class="fuente-vol" style="--fv:' + v.c + '">' + v.t + '</span>' +
          '<span>' + r.texto + '</span></div>';
      });
    }
    return h;
  };

  /* ============================ QUIZ ============================ */

  var TITULO_MODO = { examen: 'Examen', repaso: 'Repaso espaciado', practica: 'Vocabulario' };

  V.quizPregunta = function (sesion, respondida) {
    var item = sesion.actual(), p = item.pregunta;
    var titulo = TITULO_MODO[sesion.modo] || 'Práctica';
    var escrita = E.Quiz.esEscrita(p);
    var h = '<div class="lectura">';

    h += '<div class="quiz-cab"><span><b>' + titulo + '</b>' +
      (item.origen ? ' · ' + esc(item.origen) : '') + '</span>' +
      '<span>' + sesion.numero() + ' de ' + sesion.total() + '</span></div>';
    h += barra(Math.round(((sesion.numero() - 1) / sesion.total()) * 100));

    h += '<div class="pregunta">' + esc(p.p) + '</div>';

    // El audio va antes de la respuesta: en un dictado ES la pregunta.
    if (p.audio) h += '<div class="quiz-audio">' + E.Audio.parDeBotones(p.audio) + '</div>';

    if (p.pista && !respondida) h += '<p style="color:var(--texto-3);font-size:13.5px;margin:-10px 0 16px">💡 ' + esc(p.pista) + '</p>';

    if (escrita) {
      h += V.quizEscrita(p, respondida);
    } else {
      var letras = 'ABCDEFGH';
      p.opciones.forEach(function (op, i) {
        var cls = 'opcion';
        var nota = '';
        if (respondida) {
          if (i === p.correcta) { cls += ' correcta'; }
          else if (i === respondida.elegida) { cls += ' incorrecta'; }
          if (i !== p.correcta && p.porQueNo && p.porQueNo[i]) {
            nota = '<span class="nota">' + esc(p.porQueNo[i]) + '</span>';
          }
        }
        h += '<button class="' + cls + '" data-op="' + i + '"' + (respondida ? ' disabled' : '') + '>' +
          '<span class="letra">' + letras[i] + '</span><span>' + esc(op) + nota + '</span></button>';
      });
    }

    if (respondida) {
      var cabeza = respondida.ok ? '✓ Correcto.' : (escrita ? '✗ Todavía no.' : '✗ No era esa.');
      h += '<div class="explicacion"><b>' + cabeza + '</b> ' + (p.porQue || '') + '</div>';
      h += '<div class="btn-fila" style="justify-content:flex-end">' +
        '<button class="btn btn-primario btn-lg" id="siguiente">' +
        (sesion.numero() >= sesion.total() ? 'Ver resultado' : 'Siguiente pregunta →') + '</button></div>';
    }
    return h + '</div>';
  };

  /** Bloque de respuesta escrita dentro del quiz. */
  V.quizEscrita = function (p, respondida) {
    var det = respondida && respondida.detalle;

    if (p.tipo === 'ordenar' && !respondida) {
      var h = '<div class="quiz-armado" data-armado><span class="ej-armado-vacio">Tocá las palabras en orden</span></div>';
      h += '<div class="ej-fichas">';
      (p._fichas || E.Quiz.fichasOrdenar(p)).forEach(function (w, i) {
        h += '<button type="button" class="ficha" data-ficha="' + i + '">' + esc(w) + '</button>';
      });
      h += '</div><div class="btn-fila"><button class="btn btn-primario" id="responder">Comprobar</button>' +
           '<button class="btn" id="limpiar">Limpiar</button></div>';
      return h;
    }

    if (!respondida) {
      return '<div class="quiz-entrada">' +
        '<input type="text" id="respuesta-texto" class="ej-input" autocomplete="off" ' +
        'autocapitalize="off" spellcheck="false" placeholder="' +
        (p.tipo === 'traducir' ? 'Escribilo en inglés…' : 'Escribí lo que escuchaste…') + '" autofocus>' +
        '<button class="btn btn-primario" id="responder">Comprobar</button></div>';
    }

    if (!det) return '';
    var r = '<div class="quiz-correccion ' + (det.ok ? 'bien' : 'mal') + '">';
    if (det.ok) {
      r += '<div class="qc-fila"><span class="qc-et">Escribiste</span><b>' + esc(det.dado) + '</b></div>';
    } else {
      r += '<div class="qc-fila"><span class="qc-et">Escribiste</span><span>' +
           E.Ingles.pintarDiff(det.diff, 'sobra') + '</span></div>';
      r += '<div class="qc-fila"><span class="qc-et">Era</span><span>' +
           E.Ingles.pintarDiff(det.diff, 'falta') + '</span></div>';
      if (det.otras && det.otras.length) {
        r += '<div class="ej-otras">También valía: ' +
          det.otras.map(function (o) { return '<code>' + esc(o) + '</code>'; }).join(' · ') + '</div>';
      }
    }
    if (det.esperado) r += '<div class="ej-escuchar">' + E.Audio.parDeBotones(det.esperado) + '</div>';
    return r + '</div>';
  };

  V.quizResultado = function (sesion, t, meta) {
    var punt = sesion.puntaje();
    var bien = sesion.modo === 'examen' ? sesion.aprobo() : punt >= 70;
    var h = '<div class="lectura"><div class="tarjeta resultado ' + (bien ? 'bien' : 'mal') + '">';
    h += '<div style="font-size:44px;margin-bottom:6px">' + (bien ? '🎉' : '💪') + '</div>';
    h += '<div class="puntaje">' + punt + '%</div>';
    h += '<p style="color:var(--texto-2);margin:6px 0 20px">' +
      sesion.aciertos() + ' de ' + sesion.total() + ' correctas</p>';

    if (sesion.modo === 'examen') {
      h += bien
        ? '<p style="margin:0 0 20px">Aprobaste. El módulo siguiente queda desbloqueado.</p>'
        : '<p style="margin:0 0 20px">Necesitás ' + E.Quiz.APROBAR_CON + '% para avanzar. ' +
          'Las que fallaste ya entraron a tu cola de repaso — repasalas y volvé a intentarlo, sin apuro.</p>';
      h += '<div class="btn-fila" style="justify-content:center">' +
        '<a class="btn" href="#/m/' + t.id + '/' + meta.id + '">Volver al módulo</a>' +
        '<a class="btn" href="#/examen/' + t.id + '/' + meta.id + '">Rendir de nuevo</a>';
      if (bien) {
        var i = E.indiceModulo(t.id, meta.id);
        var sigM = t.modulos[i + 1];
        if (sigM && sigM.estado === 'listo') {
          h += '<a class="btn btn-primario" href="#/m/' + t.id + '/' + sigM.id + '">Módulo siguiente' + E.icono('arrowright') + '</a>';
        } else {
          h += '<a class="btn btn-primario" href="#/t/' + t.id + '">Ver el curso</a>';
        }
      }
      h += '</div>';
    } else {
      var falladas = sesion.respuestas.filter(function (r) { return !r.ok; }).length;
      h += '<p style="margin:0 0 20px">' + (falladas
        ? 'Las ' + falladas + ' que fallaste vuelven mañana. Las que acertaste se alejan en el tiempo.'
        : 'Todo correcto. Estas tarjetas se alejan en el calendario — así se consolida.') + '</p>';
      h += '<div class="btn-fila" style="justify-content:center">';
      if (sesion.modo === 'practica' && t && meta) {
        h += '<a class="btn" href="#/m/' + t.id + '/' + meta.id + '">Volver al módulo</a>' +
             '<a class="btn btn-primario" href="#/vocabulario/' + t.id + '/' + meta.id + '">Otra vuelta</a>';
      } else {
        h += '<a class="btn btn-primario" href="#/">Volver al escritorio</a>';
      }
      h += '</div>';
    }
    return h + '</div></div>';
  };

  /* ============================ LOGROS / PROGRESO ============================ */

  V.logros = function () {
    var d = E.Store.datos();
    var ganados = Object.keys(d.logros).length;
    var h = '<div class="encabezado"><h1>Logros</h1>' +
      '<p class="sub">' + ganados + ' de ' + E.Store.LOGROS.length + ' desbloqueados.</p></div>';
    h += '<div class="grilla g3">';
    E.Store.LOGROS.forEach(function (l) {
      var ts = d.logros[l.id];
      h += '<div class="logro' + (ts ? ' ganado' : '') + '">' +
        '<div class="ic">' + l.icono + '</div><h4>' + esc(l.titulo) + '</h4>' +
        '<p>' + esc(l.desc) + '</p>' +
        (ts ? '<div class="fecha">' + new Date(ts).toLocaleDateString('es-AR') + '</div>' : '') +
        '</div>';
    });
    return h + '</div>';
  };

  V.progreso = function () {
    var S = E.Store, d = S.datos();
    var h = '<div class="encabezado"><h1>Tu progreso</h1><p class="sub">Dónde estás parado y qué te falta.</p></div>';

    h += '<div class="grilla g4" style="margin-bottom:26px">' +
      metrica(S.progresoGlobal() + '%', 'Total') +
      metrica(Object.keys(d.lecciones).length, 'Lecciones leídas') +
      metrica(d.pomodoro.ciclos, 'Pomodoros') +
      metrica(S.rachaViva() + ' / ' + d.racha.mejor, 'Racha actual / récord') +
      '</div>';

    h += '<h2>Por curso</h2>';
    E.listaTracks().forEach(function (t) {
      var p = S.progresoTrack(t.id);
      h += '<div class="tarjeta" style="margin-bottom:12px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:12px;flex-wrap:wrap">' +
        '<b style="display:inline-flex;align-items:center;gap:9px"><span style="color:' + t.color + ';display:inline-flex">' + E.icono(E.iconoCurso(t.id), { size: 18 }) + '</span>' + esc(t.titulo) + '</b>' +
        '<span style="color:var(--texto-3);font-size:13px">' +
        (p.escrito ? p.lecciones + '/' + p.totalLecciones + ' lecciones · ' + p.modulos + '/' + p.totalModulos + ' exámenes'
                   : 'contenido por escribir') + '</span></div>' + barra(p.pct) + '</div>';
    });

    h += '<h2>Memoria a largo plazo</h2>';
    h += '<div class="tarjeta"><div class="grilla g3">' +
      metrica(S.srsTotal(), 'Preguntas en repaso') +
      metrica(E.Quiz.pendientes(), 'Vencen hoy') +
      metrica(S.srsDominadas(), 'Dominadas') +
      '</div>' +
      '<p style="margin:16px 0 0;color:var(--texto-2);font-size:13.8px">' +
      'Una pregunta entra acá cuando la fallás. Vuelve a los 1, 3, 7, 16 y 35 días. ' +
      'Si la acertás cinco veces seguidas queda <b>dominada</b> y deja de aparecer.</p></div>';

    return h;
  };

  V.ajustes = function () {
    var oscuro = E.Store.tema() === 'oscuro';
    return '<div class="encabezado"><h1>Ajustes</h1><p class="sub">Tu progreso vive solo en este navegador.</p></div>' +
      '<div class="lectura">' +
      '<div class="tarjeta"><h3 style="margin-top:0">Llevarte el progreso</h3>' +
      '<p style="color:var(--texto-2);font-size:14px">Descargá un archivo con todo tu avance y cargalo en otra máquina o en el celular. ' +
      'Importar <b>reemplaza</b> el progreso actual.</p>' +
      '<div class="btn-fila"><button class="btn" id="exportar">' + E.icono('download') + 'Exportar progreso</button>' +
      '<button class="btn" id="importar">' + E.icono('upload') + 'Importar progreso</button>' +
      '<input type="file" id="archivo" accept="application/json,.json" hidden></div></div>' +

      '<div class="tarjeta"><h3 style="margin-top:0">Apariencia</h3>' +
      '<div class="btn-fila"><button class="btn" id="tema">' + E.icono(oscuro ? 'sun' : 'moon') +
      'Cambiar a tema ' + (oscuro ? 'claro' : 'oscuro') + '</button>' +
      '<button class="btn" id="notis">' + E.icono('bell') + 'Permitir avisos del pomodoro</button></div></div>' +

      '<div class="tarjeta" style="border-color:color-mix(in srgb, var(--mal) 40%, transparent)">' +
      '<h3 style="margin-top:0;color:var(--mal-t)">Borrar todo</h3>' +
      '<p style="color:var(--texto-2);font-size:14px">Elimina lecciones leídas, exámenes, racha, logros y cola de repaso. No se puede deshacer.</p>' +
      '<button class="btn" id="reset">' + E.icono('trash') + 'Borrar mi progreso</button></div></div>';
  };

  V.vacio = function (ic, titulo, texto, botonHtml) {
    return '<div class="vacio"><div class="ic">' + ic + '</div><h3>' + esc(titulo) + '</h3>' +
      '<p>' + texto + '</p>' + (botonHtml || '') + '</div>';
  };
})();
