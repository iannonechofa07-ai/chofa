/* ==========================================================================
   Tienda: grilla con filtros por tipo, ocasión y precio + orden.
   Los filtros se reflejan en la URL (?tipo=digital&ocasion=pareja&max=20000)
   para poder compartir un link filtrado.
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
    var params = new URLSearchParams(location.search);

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
      setRadio("tipo", params.get("tipo") || "todos");
      setRadio("ocasion", params.get("ocasion") || "todas");
      priceInput.value = params.get("max") || priceInput.max;
      form.querySelector('select[name="orden"]').value = params.get("orden") || "destacados";
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

    function syncUrl(f) {
      var p = new URLSearchParams();
      if (f.type && f.type !== "todos") p.set("tipo", f.type);
      if (f.occasion && f.occasion !== "todas") p.set("ocasion", f.occasion);
      if (f.maxPrice && String(f.maxPrice) !== priceInput.max) p.set("max", f.maxPrice);
      if (f.sort && f.sort !== "destacados") p.set("orden", f.sort);
      var qs = p.toString();
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
    }

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
