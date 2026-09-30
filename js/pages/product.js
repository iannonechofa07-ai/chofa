/* ==========================================================================
   Ficha de producto: galería, variantes, personalización, envío,
   acordeón de información y productos relacionados.
   URL: producto.html#<slug>
   ========================================================================== */
(function () {
  "use strict";
  var A = (window.AMARE = window.AMARE || {});

  A.pages = A.pages || {};
  A.pages.producto = function () {
    var root = document.querySelector("[data-product-root]");
    if (!root || root.dataset.bound) return;
    root.dataset.bound = "1";

    var slug = A.ui.pageParam("p") || "nuestra-historia";
    // Un link a otro producto desde esta misma página solo cambia el #: recargar.
    window.addEventListener("hashchange", function () { location.reload(); });
    A.catalog.getBySlug(slug).then(function (p) {
      if (!p) { notFound(root); return; }
      render(root, p);
    });
  };

  function notFound(root) {
    root.innerHTML =
      '<div class="container empty-state section-tight"><p class="serif">No encontramos este álbum.</p>' +
      '<a class="btn btn-primary" href="tienda.html">Ir a la tienda</a></div>';
  }

  function render(root, p) {
    var ui = A.ui;
    var cfg = A.config;
    var isPhysical = p.type === "fisico";
    var type = A.productTypes[p.type];
    var occasion = A.occasions.find(function (o) { return o.id === p.occasion; });
    var selection = {};
    p.options.forEach(function (o) { selection[o.id] = o.values[0].id; });

    document.title = p.name + " · " + type.long + " · Amaré Studio";
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", p.short);

    var optionsHTML = p.options.map(function (o) {
      var isSwatch = o.type === "swatch";
      return (
        '<fieldset class="option-group" data-option="' + o.id + '">' +
        '  <legend>' + ui.esc(o.label) + ': <span data-option-label="' + o.id + '">' + ui.esc(o.values[0].label) + "</span></legend>" +
        '  <div class="option-values' + (isSwatch ? " is-swatches" : "") + '">' +
        o.values.map(function (v, i) {
          var extra = v.priceDelta ? ' <small>+' + ui.formatPrice(v.priceDelta) + "</small>" : "";
          var inner = isSwatch
            ? '<span class="swatch" style="--swatch:' + v.swatch + '"></span><span class="sr-only">' + ui.esc(v.label) + "</span>"
            : "<span>" + ui.esc(v.label) + extra + "</span>";
          return '<label class="' + (isSwatch ? "swatch-option" : "pill") + '" title="' + ui.esc(v.label) + '">' +
            '<input type="radio" name="' + o.id + '" value="' + v.id + '"' + (i === 0 ? " checked" : "") + ">" + inner + "</label>";
        }).join("") +
        "  </div>" +
        "</fieldset>"
      );
    }).join("");

    var physicalHTML = isPhysical
      ? '<div class="field">' +
        '  <label for="perso">Personalizá la tapa <span class="optional">(opcional)</span></label>' +
        '  <input id="perso" name="perso" type="text" maxlength="32" placeholder="Ej: Juli & Tomi · 2019" autocomplete="off">' +
        '  <p class="hint"><span data-perso-count>0</span>/32 · Se graba en dorado sobre la tapa.</p>' +
        "</div>" +
        '<div class="field">' +
        '  <label for="zone">Calculá tu envío</label>' +
        '  <select id="zone" name="zone">' +
        '    <option value="">Elegí tu zona</option>' +
        cfg.shipping.zones.map(function (z) { return '<option value="' + z.id + '">' + z.label + "</option>"; }).join("") +
        "  </select>" +
        '  <p class="hint" data-ship-out>Envío gratis en compras desde ' + ui.formatPrice(cfg.shipping.freeFrom) + ".</p>" +
        "</div>"
      : '<div class="callout callout-digital">' + ui.icons.download +
        "<div><strong>Descarga inmediata</strong><p>Se edita en Canva gratis, desde la compu o el celu. Después la imprimís donde quieras.</p></div></div>";

    var d = p.details;
    var accordion = [
      ["Qué incluye", "<ul>" + d.includes.map(function (x) { return "<li>" + ui.esc(x) + "</li>"; }).join("") + "</ul>"],
      [isPhysical ? "Tiempos de producción" : "Entrega", "<p>" + ui.esc(d.production) + "</p>"],
      ["Envíos", "<p>" + ui.esc(d.shipping) + "</p>"],
      ["Cambios y devoluciones", "<p>" + ui.esc(d.returns) + "</p>"]
    ].map(function (row, i) {
      return '<details class="accordion-item"' + (i === 0 ? " open" : "") + "><summary>" + row[0] +
        '<span class="accordion-icon" aria-hidden="true"></span></summary><div class="accordion-content">' + row[1] + "</div></details>";
    }).join("");

    var thumbs = p.images.map(function (src, i) {
      return '<button type="button" class="thumb' + (i === 0 ? " is-active" : "") + '" data-index="' + i + '" aria-label="Ver imagen ' + (i + 1) + '">' +
        '<img src="' + src + '" alt="" width="100" height="125"></button>';
    }).join("");
    var slides = p.images.map(function (src, i) {
      return '<figure class="gallery-slide" data-zoom><img src="' + src + '" alt="' + ui.esc(p.name) + " – imagen " + (i + 1) + '" width="1000" height="1250"' + (i ? ' loading="lazy"' : "") + "></figure>";
    }).join("");

    var bTitle = document.querySelector("[data-banner-title]");
    var bCrumb = document.querySelector("[data-banner-crumb]");
    if (bTitle) bTitle.textContent = p.name;
    if (bCrumb) bCrumb.innerHTML = '<a href="tienda.html#' + p.type + '">' + type.label + '</a> <span aria-hidden="true">/</span> ' + ui.esc(p.name);

    root.innerHTML =
      '<div class="container section-tight">' +
      '  <div class="product-layout">' +
      '    <div class="product-gallery reveal">' +
      '      <div class="gallery-track" data-gallery>' + slides + "</div>" +
      '      <div class="gallery-thumbs">' + thumbs + "</div>" +
      "    </div>" +
      '    <form class="product-buy reveal" data-buy style="--d:120ms">' +
      '      <p class="product-kicker"><span class="type-badge type-' + p.type + ' is-inline">' + (isPhysical ? ui.icons.truck : ui.icons.download) + type.label + "</span>" +
      (occasion ? '<a href="tienda.html#' + occasion.id + '">' + ui.esc(occasion.label) + "</a>" : "") + "</p>" +
      "      <h1>" + ui.esc(p.name) + "</h1>" +
      '      <p class="product-lead">' + ui.esc(p.short) + "</p>" +
      '      <p class="product-price-big"><span data-price>' + ui.formatPrice(p.price) + "</span>" +
      (p.compareAtPrice ? ' <s class="price-compare">' + ui.formatPrice(p.compareAtPrice) + "</s>" : "") + "</p>" +
      '      <p class="installments">Hasta 3 cuotas sin interés de <span data-installment>' + ui.formatPrice(Math.round(p.price / 3)) + "</span></p>" +
      '      <div class="gold-rule"></div>' +
      optionsHTML + physicalHTML +
      '      <div class="buy-row">' +
      '        <div class="qty" aria-label="Cantidad">' +
      '          <button type="button" data-step="-1" aria-label="Restar uno">' + ui.icons.minus + "</button>" +
      '          <input type="number" name="qty" value="1" min="1" max="20" inputmode="numeric" aria-label="Cantidad">' +
      '          <button type="button" data-step="1" aria-label="Sumar uno">' + ui.icons.plus + "</button>" +
      "        </div>" +
      '        <button class="btn btn-primary btn-grow" type="submit" data-add><span class="btn-label">Agregar al carrito</span></button>' +
      "      </div>" +
      '      <ul class="mini-trust">' +
      "        <li>" + ui.icons.lock + " Pago seguro con Mercado Pago</li>" +
      "        <li>" + (isPhysical ? ui.icons.hand + " Hecho a mano en Argentina" : ui.icons.download + " Link al instante en tu mail") + "</li>" +
      "      </ul>" +
      '      <p class="product-description">' + ui.esc(p.description) + "</p>" +
      '      <div class="accordion">' + accordion + "</div>" +
      "    </form>" +
      "  </div>" +
      "</div>" +
      '<section class="section section-related"><div class="container">' +
      '  <div class="section-head reveal"><p class="eyebrow eyebrow-slash">Te puede gustar</p><h2>También <em>elegidos</em></h2></div>' +
      '  <div class="product-grid" data-related></div>' +
      "</div></section>";

    var form = root.querySelector("[data-buy]");
    var priceEl = form.querySelector("[data-price]");
    var instEl = form.querySelector("[data-installment]");
    var qtyInput = form.querySelector('input[name="qty"]');

    function updatePrice() {
      var price = A.catalog.priceFor(p, selection);
      priceEl.textContent = ui.formatPrice(price);
      instEl.textContent = ui.formatPrice(Math.round(price / 3));
      priceEl.classList.remove("flash");
      void priceEl.offsetWidth;
      priceEl.classList.add("flash");
    }

    form.addEventListener("change", function (e) {
      var group = e.target.closest("[data-option]");
      if (group) {
        var id = group.getAttribute("data-option");
        selection[id] = e.target.value;
        var opt = p.options.find(function (o) { return o.id === id; });
        var val = opt.values.find(function (v) { return v.id === e.target.value; });
        form.querySelector('[data-option-label="' + id + '"]').textContent = val.label;
        updatePrice();
      }
      if (e.target.name === "zone") {
        var out = form.querySelector("[data-ship-out]");
        var z = cfg.shipping.zones.find(function (x) { return x.id === e.target.value; });
        out.innerHTML = z
          ? "<strong>" + ui.formatPrice(z.price) + "</strong> · llega en " + z.days + ". Gratis desde " + ui.formatPrice(cfg.shipping.freeFrom) + "."
          : "Envío gratis en compras desde " + ui.formatPrice(cfg.shipping.freeFrom) + ".";
      }
    });

    var perso = form.querySelector("#perso");
    if (perso) {
      perso.addEventListener("input", function () {
        form.querySelector("[data-perso-count]").textContent = perso.value.length;
      });
    }

    form.addEventListener("click", function (e) {
      var step = e.target.closest("[data-step]");
      if (!step) return;
      var v = (parseInt(qtyInput.value, 10) || 1) + parseInt(step.getAttribute("data-step"), 10);
      qtyInput.value = Math.max(1, Math.min(20, v));
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("[data-add]");
      var labels = p.options.map(function (o) {
        return o.values.find(function (v) { return v.id === selection[o.id]; }).label;
      });
      A.cart.add({
        productId: p.id,
        slug: p.slug,
        name: p.name,
        type: p.type,
        image: p.images[0],
        unitPrice: A.catalog.priceFor(p, selection),
        qty: qtyInput.value,
        options: Object.assign({}, selection),
        optionLabels: labels,
        personalization: perso ? perso.value.trim() : ""
      });
      btn.classList.add("is-added");
      btn.querySelector(".btn-label").innerHTML = ui.icons.check + " ¡Agregado!";
      ui.toast(p.name + " se sumó a tu carrito");
      setTimeout(function () { A.cartDrawer.open(); }, 450);
      setTimeout(function () {
        btn.classList.remove("is-added");
        btn.querySelector(".btn-label").textContent = "Agregar al carrito";
      }, 2200);
    });

    initGallery(root);
    A.effects.initAccordions(root);
    A.effects.initReveal(root);

    A.catalog.related(p, 4).then(function (items) {
      var grid = root.querySelector("[data-related]");
      grid.innerHTML = items.map(function (x, i) { return ui.productCard(x, { delay: i * 70 }); }).join("");
      A.effects.initReveal(grid);
    });
  }

  function initGallery(root) {
    var track = root.querySelector("[data-gallery]");
    var thumbs = root.querySelectorAll(".thumb");

    function setActive(i) {
      thumbs.forEach(function (t, j) { t.classList.toggle("is-active", i === j); });
    }
    thumbs.forEach(function (t) {
      t.addEventListener("click", function () {
        var i = parseInt(t.getAttribute("data-index"), 10);
        track.scrollTo({ left: track.clientWidth * i, behavior: "smooth" });
        setActive(i);
      });
    });
    var raf;
    track.addEventListener("scroll", function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { setActive(Math.round(track.scrollLeft / track.clientWidth)); });
    }, { passive: true });

    // Zoom que sigue al mouse (solo con puntero fino)
    if (window.matchMedia("(hover: hover)").matches) {
      root.querySelectorAll("[data-zoom]").forEach(function (fig) {
        var img = fig.querySelector("img");
        fig.addEventListener("mousemove", function (e) {
          var r = fig.getBoundingClientRect();
          img.style.transformOrigin = ((e.clientX - r.left) / r.width) * 100 + "% " + ((e.clientY - r.top) / r.height) * 100 + "%";
          fig.classList.add("is-zoomed");
        });
        fig.addEventListener("mouseleave", function () { fig.classList.remove("is-zoomed"); });
      });
    }
  }
})();
