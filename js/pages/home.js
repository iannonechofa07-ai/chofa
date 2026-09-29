/* ==========================================================================
   Home: "Nuestras colecciones" con pestañas por ocasión y grilla a sangre.
   El resto del contenido de la home está escrito en el HTML.
   ========================================================================== */
(function () {
  "use strict";
  var A = (window.AMARE = window.AMARE || {});

  function tile(p, i) {
    var ui = A.ui;
    var type = A.productTypes[p.type];
    return (
      '<a class="collection-tile reveal" href="' + ui.productUrl(p) + '" style="--d:' + (i % 3) * 80 + 'ms">' +
      '  <img class="img-primary" src="' + p.images[0] + '" alt="' + ui.esc(p.name) + '" loading="lazy" width="1000" height="1250">' +
      '  <img class="img-secondary" src="' + (p.images[1] || p.images[0]) + '" alt="" loading="lazy" width="1000" height="1250" aria-hidden="true">' +
      '  <span class="type-badge type-' + p.type + '">' + (p.type === "digital" ? ui.icons.download : ui.icons.truck) + type.label + "</span>" +
      '  <span class="tile-caption"><span class="tile-name">' + ui.esc(p.name) + "</span>" +
      '    <span class="tile-price">' + (p.type === "fisico" ? "desde " : "") + ui.formatPrice(p.price) + "</span></span>" +
      "</a>"
    );
  }

  A.pages = A.pages || {};
  A.pages.home = function () {
    var tabs = document.querySelector("[data-collection-tabs]");
    var grid = document.querySelector("[data-collection-grid]");
    var more = document.querySelector("[data-collection-more]");
    if (!tabs || !grid || tabs.dataset.bound) return;
    tabs.dataset.bound = "1";

    tabs.innerHTML =
      '<button type="button" role="tab" class="tab is-active" aria-selected="true" data-occasion="todas">Todos</button>' +
      A.occasions.map(function (o) {
        return '<button type="button" role="tab" class="tab" aria-selected="false" data-occasion="' + o.id + '">' + A.ui.esc(o.short) + "</button>";
      }).join("");

    function show(occasion) {
      A.catalog.list({ occasion: occasion }).then(function (items) {
        grid.classList.add("is-switching");
        setTimeout(function () {
          grid.innerHTML = items.slice(0, 6).map(tile).join("");
          grid.classList.remove("is-switching");
          A.effects.initReveal(grid);
        }, grid.children.length ? 220 : 0);
        var o = A.occasions.find(function (x) { return x.id === occasion; });
        more.href = "tienda.html" + (o ? "?ocasion=" + o.id : "");
        more.querySelector("span").textContent = o ? "Ver todo " + o.label : "Ver toda la tienda";
      });
    }

    tabs.addEventListener("click", function (e) {
      var b = e.target.closest(".tab");
      if (!b || b.classList.contains("is-active")) return;
      tabs.querySelectorAll(".tab").forEach(function (t) {
        var on = t === b;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
      });
      show(b.getAttribute("data-occasion"));
    });

    show("todas");
  };
})();
