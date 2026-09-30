/* ==========================================================================
   Tienda: grilla con filtros por tipo, ocasión y precio + orden.
   El tipo u ocasión se puede abrir desde un link: tienda.html#digital,
   tienda.html#fisico, tienda.html#pareja, etc.
   ========================================================================== */
(function () {
  "use strict";
  var A = (window.AMARE = window.AMARE || {});

  A.pages = A.pages || {};
  A.pages.tienda = function () {
    var grid = document.querySelector("[data-product-grid]");
    var form = document.querySelector("[data-filters]");
    if (!grid || !form || form.dataset.bound) return;
    form.dataset.bound = "1";

    var ui = A.ui;
    var countEl = document.querySelector("[data-result-count]");
    var occasionWrap = form.querySelector("[data-occasions]");
    var priceInput = form.querySelector('input[name="max"]');
    var priceOut = form.querySelector("[data-price-out]");
    var titleEl = document.querySelector("[data-shop-title]");

    /** Lee el filtro del #hash (o de ?tipo= / ?ocasion= para links viejos). */
    function fromUrl() {
      var token = A.ui.pageParam("tipo");
      var legacyOcc = "";
      try { legacyOcc = new URLSearchParams(location.search).get("ocasion") || ""; } catch (e) { /* nada */ }
      var isType = token === "fisico" || token === "digital";
      var isOcc = A.occasions.some(function (o) { return o.id === token; });
      return {
        tipo: isType ? token : "todos",
        ocasion: isOcc ? token : (legacyOcc || "todas")
      };
    }

    // Chips de ocasión (a partir de los datos)
    occasionWrap.innerHTML =
      '<label class="chip"><input type="radio" name="ocasion" value="todas" checked><span>Todas</span></label>' +
      A.occasions.map(function (o) {
        return '<label class="chip"><input type="radio" name="ocasion" value="' + o.id + '"><span>' + ui.esc(o.short) + "</span></label>";
      }).join("");

    A.catalog.priceRange().then(function (range) {
      var step = 500;
      priceInput.min = Math.floor(range.min / step) * step;
      priceInput.max = Math.ceil(range.max / step) * step;
      priceInput.step = step;

      // Estado inicial desde la URL
      var start = fromUrl();
      setRadio("tipo", start.tipo);
      setRadio("ocasion", start.ocasion);
      priceInput.value = priceInput.max;
      apply(false);
    });

    function setRadio(name, value) {
      var el = form.querySelector('input[name="' + name + '"][value="' + value + '"]');
      if (el) el.checked = true;
    }

    function read() {
      var fd = new FormData(form);
      return {
        type: fd.get("tipo"),
        occasion: fd.get("ocasion"),
        maxPrice: parseInt(fd.get("max"), 10) || null,
        sort: fd.get("orden")
      };
    }

    var lastHash = "";
    function syncUrl(f) {
      // Un solo filtro principal en el #: primero la ocasión, si no el tipo.
      var token = f.occasion && f.occasion !== "todas" ? f.occasion : (f.type && f.type !== "todos" ? f.type : "");
      lastHash = token;
      try { history.replaceState(null, "", location.pathname + (token ? "#" + token : "")); } catch (e) { /* entorno sin history */ }
    }

    // El menú "Plantillas Canva" (tienda.html#digital) desde la propia tienda solo cambia el #.
    window.addEventListener("hashchange", function () {
      var token = decodeURIComponent(location.hash.slice(1));
      if (token === lastHash) return;
      var next = fromUrl();
      setRadio("tipo", next.tipo);
      setRadio("ocasion", next.ocasion);
      apply(false);
    });

    function apply(pushUrl) {
      var f = read();
      priceOut.textContent = ui.formatPrice(f.maxPrice || 0);
      var pct = ((priceInput.value - priceInput.min) / (priceInput.max - priceInput.min)) * 100;
      priceInput.style.setProperty("--pct", pct + "%");
      if (titleEl) {
        titleEl.textContent = f.type === "fisico" ? "Álbumes físicos" : f.type === "digital" ? "Plantillas Canva" : "Todos los álbumes";
      }
      if (pushUrl !== false) syncUrl(f);

      A.catalog.list(f).then(function (items) {
        countEl.textContent = items.length + (items.length === 1 ? " producto" : " productos");
        if (!items.length) {
          grid.innerHTML =
            '<div class="empty-state"><p class="serif">No encontramos álbumes con esos filtros.</p>' +
            '<button type="button" class="btn btn-outline" data-reset>Limpiar filtros</button></div>';
          return;
        }
        grid.innerHTML = items.map(function (p, i) { return ui.productCard(p, { delay: (i % 3) * 70 }); }).join("");
        A.effects.initReveal(grid);
      });
    }

    function reset() {
      setRadio("tipo", "todos");
      setRadio("ocasion", "todas");
      priceInput.value = priceInput.max;
      form.querySelector('select[name="orden"]').value = "destacados";
      apply();
    }

    form.addEventListener("change", function () { apply(); });
    priceInput.addEventListener("input", function () { apply(); });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    document.addEventListener("click", function (e) { if (e.target.closest("[data-reset]")) reset(); });

    // Panel de filtros en mobile
    var toggle = document.querySelector("[data-filters-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = form.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
  };
})();
