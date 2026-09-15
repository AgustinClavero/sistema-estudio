/* ==========================================================================
   quiz.js — motor de exámenes, ejercicios y repaso espaciado.
   Solo lógica: el dibujo en pantalla vive en vistas.js.

   Tipos de ejercicio:
     opcion   (default)  elegir entre opciones      → `correcta` (índice)
     hueco               escribir la palabra que falta ┐
     dictado             escuchar y tipear             ├→ `respuesta` (+ `respuestas`)
     traducir            ver español, escribir inglés  │
     ordenar             armar la oración desordenada ┘

   Claves del repaso espaciado (tres tipos, todas con índice):
     track/mod/qN   pregunta N del examen
     track/mod/vN   tarjeta N de vocabulario
     track/mod/eN   ejercicio N del módulo (lecciones aplanadas en orden)
   ========================================================================== */
(function () {
  'use strict';

  var E = window.ESTUDIO;
  var APROBAR_CON = 70; // porcentaje mínimo para desbloquear el módulo siguiente

  var ESCRITOS = { hueco: 1, dictado: 1, traducir: 1, ordenar: 1 };

  /* ============================ TEXTO ============================ */

  /**
   * Deja el texto en la forma que se compara.
   * Perdona lo que no cambia el significado; nada más.
   */
  function normalizar(s) {
    return String(s == null ? '' : s)
      .replace(/[‘’ʼ]/g, "'")   // apóstrofos tipográficos → recto
      .replace(/[“”]/g, '"')
      .toLowerCase()
      .replace(/[.,!?;:¿¡"]/g, ' ')            // puntuación fuera; el apóstrofo NO
      .replace(/\s+/g, ' ')
      .trim();
  }

  function palabras(s) {
    var n = normalizar(s);
    return n ? n.split(' ') : [];
  }

  /**
   * Diff palabra por palabra (subsecuencia común más larga).
   * Devuelve [{t:'igual'|'sobra'|'falta', w}] donde
   *   sobra = lo escribiste de más o mal   ·   falta = estaba en la respuesta y no lo pusiste
   */
  function diffPalabras(dado, esperado) {
    var a = palabras(dado), b = palabras(esperado);
    var n = a.length, m = b.length, i, j;

    var dp = [];
    for (i = 0; i <= n; i++) {
      var fila = [];
      for (j = 0; j <= m; j++) fila.push(0);
      dp.push(fila);
    }
    for (i = n - 1; i >= 0; i--) {
      for (j = m - 1; j >= 0; j--) {
        dp[i][j] = (a[i] === b[j])
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }

    var out = [];
    i = 0; j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { out.push({ t: 'igual', w: b[j] }); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ t: 'sobra', w: a[i] }); i++; }
      else { out.push({ t: 'falta', w: b[j] }); j++; }
    }
    while (i < n) out.push({ t: 'sobra', w: a[i++] });
    while (j < m) out.push({ t: 'falta', w: b[j++] });
    return out;
  }

  /** Todas las respuestas que se dan por buenas. */
  function aceptadas(p) {
    var lista = [];
    if (p.respuesta != null) lista.push(p.respuesta);
    if (p.respuestas && p.respuestas.length) lista = lista.concat(p.respuestas);
    return lista;
  }

  /* ============================ SESIÓN ============================ */

  /**
   * items: [{ clave, pregunta }]
   * modo:  'examen' | 'repaso' | 'practica'
   */
  function Sesion(items, modo, contexto) {
    this.modo = modo;
    this.contexto = contexto || {};      // { trackId, moduloId } en modo examen
    this.items = items;
    this.i = 0;
    this.respuestas = [];                // [{clave, elegida, ok, detalle}]
    this.terminada = false;
  }

  Sesion.prototype.actual = function () { return this.items[this.i]; };
  Sesion.prototype.total = function () { return this.items.length; };
  Sesion.prototype.numero = function () { return this.i + 1; };

  /**
   * valor = índice (opción múltiple) o string (ejercicio escrito).
   * Devuelve { ok, detalle } — detalle solo en los escritos.
   */
  Sesion.prototype.responder = function (valor) {
    var item = this.items[this.i];
    var p = item.pregunta;
    var ok, detalle = null;

    if (Quiz.esEscrita(p)) {
      detalle = Quiz.corregir(valor, p);
      ok = detalle.ok;
    } else {
      ok = valor === p.correcta;
    }

    this.respuestas.push({ clave: item.clave, elegida: valor, ok: ok, detalle: detalle });
    E.Store.srsRegistrar(item.clave, ok);
    return { ok: ok, detalle: detalle };
  };

  Sesion.prototype.avanzar = function () {
    this.i++;
    if (this.i >= this.items.length) { this.terminada = true; return false; }
    return true;
  };

  Sesion.prototype.aciertos = function () {
    return this.respuestas.filter(function (r) { return r.ok; }).length;
  };

  Sesion.prototype.puntaje = function () {
    if (!this.respuestas.length) return 0;
    return Math.round((this.aciertos() / this.respuestas.length) * 100);
  };

  Sesion.prototype.aprobo = function () { return this.puntaje() >= APROBAR_CON; };

  /** Cierra la sesión y persiste el resultado si era un examen de módulo. */
  Sesion.prototype.cerrar = function () {
    if (this.modo === 'examen' && this.contexto.trackId) {
      E.Store.registrarExamen(
        this.contexto.trackId + '/' + this.contexto.moduloId,
        this.puntaje(), this.aprobo()
      );
    } else {
      E.Store.tocarDia();
      E.Store.revisarLogros();
      E.Store.guardar();
    }
  };

  /* ============================ API ============================ */

  var Quiz = E.Quiz = {
    APROBAR_CON: APROBAR_CON,
    normalizar: normalizar,
    diffPalabras: diffPalabras,

    esEscrita: function (p) { return !!(p && p.tipo && ESCRITOS[p.tipo]); },

    /**
     * Corrige una respuesta escrita.
     * → { ok, esperado, dado, diff, vacia }
     */
    corregir: function (dado, p) {
      var texto = String(dado == null ? '' : dado);
      var lista = aceptadas(p);
      var esperado = lista[0] != null ? String(lista[0]) : '';
      var normDado = normalizar(texto);

      var ok = false;
      for (var i = 0; i < lista.length; i++) {
        if (normalizar(lista[i]) === normDado && normDado !== '') { ok = true; esperado = String(lista[i]); break; }
      }

      return {
        ok: ok,
        vacia: normDado === '',
        dado: texto,
        esperado: esperado,
        otras: lista.slice(1).map(String),
        diff: ok ? null : diffPalabras(texto, esperado),
      };
    },

    /** Fichas desordenadas de un ejercicio `ordenar`, derivadas de la respuesta. */
    fichasOrdenar: function (p) {
      var base = String(aceptadas(p)[0] || '').trim();
      var tokens = base.split(/\s+/).filter(Boolean);
      if (tokens.length < 2) return tokens;
      // Que no salga ya ordenado de casualidad.
      var mezcla = E.barajar(tokens);
      var intentos = 0;
      while (mezcla.join(' ') === tokens.join(' ') && intentos++ < 12) mezcla = E.barajar(tokens);
      return mezcla;
    },

    /* -------------------- armado de sesiones -------------------- */

    /** Examen de un módulo: preguntas barajadas, opciones barajadas. */
    examen: function (trackId, moduloId) {
      var mod = E.modulos[trackId + '/' + moduloId];
      if (!mod || !mod.examen || !mod.examen.length) return null;

      var items = mod.examen.map(function (p, idx) {
        return {
          clave: trackId + '/' + moduloId + '/q' + idx,
          pregunta: Quiz.prepararPregunta(p),
        };
      });
      return new Sesion(E.barajar(items), 'examen', { trackId: trackId, moduloId: moduloId });
    },

    /** Práctica de vocabulario de un módulo (ES → EN, escrito). */
    vocabulario: function (trackId, moduloId) {
      var mod = E.modulos[trackId + '/' + moduloId];
      if (!mod || !mod.vocabulario || !mod.vocabulario.length) return null;

      var items = mod.vocabulario.map(function (v, idx) {
        return {
          clave: trackId + '/' + moduloId + '/v' + idx,
          pregunta: Quiz.deVocabulario(v),
        };
      });
      return new Sesion(E.barajar(items), 'practica', { trackId: trackId, moduloId: moduloId });
    },

    /** Los ejercicios de todas las lecciones de un módulo, aplanados en orden. */
    ejerciciosDe: function (mod) {
      var out = [];
      (mod && mod.lecciones ? mod.lecciones : []).forEach(function (lec) {
        (lec.ejercicios || []).forEach(function (ej) { out.push(ej); });
      });
      return out;
    },

    /** Ejercicios de una lección, con la clave global que les toca en el módulo. */
    clavesEjercicios: function (trackId, moduloId, mod, nLeccion) {
      var base = 0, out = [];
      for (var i = 0; i < mod.lecciones.length; i++) {
        var ejs = mod.lecciones[i].ejercicios || [];
        if (i === nLeccion - 1) {
          for (var j = 0; j < ejs.length; j++) {
            out.push({ ejercicio: ejs[j], clave: trackId + '/' + moduloId + '/e' + (base + j) });
          }
          return out;
        }
        base += ejs.length;
      }
      return out;
    },

    /** Una tarjeta de vocabulario, convertida en ejercicio de traducción. */
    deVocabulario: function (v) {
      return {
        tipo: 'traducir',
        p: '¿Cómo se dice «' + v.es + '» en inglés?',
        pista: v.pista || null,
        respuesta: v.en,
        respuestas: v.alternativas || [],
        porQue: v.ejemplo
          ? '<b>' + v.en + '</b> — <span class="en" data-say>' + v.ejemplo + '</span>' +
            (v.ejemploEs ? ' <i>(' + v.ejemploEs + ')</i>' : '')
          : '<b>' + v.en + '</b>',
        audio: v.en,
      };
    },

    /**
     * Sesión de repaso con todas las tarjetas vencidas hoy.
     * Devuelve null si no hay nada pendiente o si el contenido no está cargado.
     */
    repaso: function () {
      var claves = E.Store.srsPendientes();
      var items = [];
      claves.forEach(function (clave) {
        var partes = clave.split('/');            // track / modulo / (q|v|e)N
        var mod = E.modulos[partes[0] + '/' + partes[1]];
        if (!mod || !partes[2]) return;

        var tipo = partes[2].charAt(0);
        var idx = parseInt(partes[2].slice(1), 10);
        if (isNaN(idx)) return;

        var p = null;
        if (tipo === 'q') {
          p = mod.examen && mod.examen[idx] ? Quiz.prepararPregunta(mod.examen[idx]) : null;
        } else if (tipo === 'v') {
          p = mod.vocabulario && mod.vocabulario[idx] ? Quiz.deVocabulario(mod.vocabulario[idx]) : null;
        } else if (tipo === 'e') {
          var ejs = Quiz.ejerciciosDe(mod);
          p = ejs[idx] ? Quiz.prepararPregunta(ejs[idx]) : null;
        }
        if (!p) return;

        items.push({ clave: clave, pregunta: p, origen: mod.titulo });
      });
      if (!items.length) return null;
      return new Sesion(E.barajar(items), 'repaso', {});
    },

    /** Necesario antes de un repaso: carga los módulos de las tarjetas vencidas. */
    prepararRepaso: function () {
      var claves = E.Store.srsPendientes();
      var pares = {};
      claves.forEach(function (c) {
        var p = c.split('/');
        pares[p[0] + '/' + p[1]] = [p[0], p[1]];
      });
      var cadena = Promise.resolve();
      Object.keys(pares).forEach(function (k) {
        cadena = cadena.then(function () {
          return E.cargarModulo(pares[k][0], pares[k][1]);
        });
      });
      return cadena;
    },

    /**
     * Deja la pregunta lista para mostrar. Las de opción múltiple salen con las
     * opciones barajadas; las escritas pasan tal cual (una copia).
     */
    prepararPregunta: function (p) {
      if (Quiz.esEscrita(p)) {
        var copia = {};
        for (var k in p) copia[k] = p[k];
        if (copia.tipo === 'ordenar') copia._fichas = Quiz.fichasOrdenar(copia);
        return copia;
      }
      return Quiz.barajarOpciones(p);
    },

    /**
     * Baraja las opciones manteniendo coherentes `correcta` y `porQueNo`.
     * Devuelve una copia; nunca muta el contenido original.
     */
    barajarOpciones: function (p) {
      var orden = E.barajar(p.opciones.map(function (_, i) { return i; }));
      var opciones = orden.map(function (viejo) { return p.opciones[viejo]; });
      var correcta = orden.indexOf(p.correcta);
      var porQueNo = {};
      orden.forEach(function (viejo, nuevo) {
        if (p.porQueNo && p.porQueNo[viejo] != null) porQueNo[nuevo] = p.porQueNo[viejo];
      });
      return {
        p: p.p, pista: p.pista, audio: p.audio, opciones: opciones,
        correcta: correcta, porQue: p.porQue, porQueNo: porQueNo,
      };
    },

    /** Cuántas tarjetas de repaso hay pendientes ahora mismo. */
    pendientes: function () { return E.Store.srsPendientes().length; },
  };
})();
