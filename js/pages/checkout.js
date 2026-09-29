/* ==========================================================================
   Checkout simple: datos → envío (CABA / GBA / Resto) → pago (Mercado Pago).
   El pago es un placeholder: en producción, `createPayment` debería llamar a
   tu backend (Supabase Edge Function / Shopify Checkout) que crea la
   preferencia de Mercado Pago y devuelve el `init_point` para redirigir.
   ========================================================================== */
(function () {
  "use strict";
  var A = (window.AMARE = window.AMARE || {});

  A.pages = A.pages || {};
  A.pages.checkout = function () {
    var root = document.querySelector("[data-checkout]");
    if (!root || root.dataset.bound) return;
    root.dataset.bound = "1";

    var ui = A.ui;
    var cart = A.cart;
    var cfg = A.config;
    var form = root.querySelector("form");
    var summary = root.querySelector("[data-summary]");
    var shipBlock = root.querySelector("[data-shipping-block]");
    var zonesWrap = root.querySelector("[data-zones]");

    zonesWrap.innerHTML = cfg.shipping.zones.map(function (z, i) {
      return '<label class="radio-card"><input type="radio" name="zona" value="' + z.id + '"' + (i === 0 ? " checked" : "") + ">" +
        '<span class="radio-body"><strong>' + z.label + "</strong><small>" + z.days + "</small></span>" +
        '<span class="radio-price" data-zone-price="' + z.id + '">' + ui.formatPrice(z.price) + "</span></label>";
    }).join("");

    function zone() {
      var el = form.querySelector('input[name="zona"]:checked');
      return el ? el.value : null;
    }

    function render() {
      var snap = cart.snapshot();
      if (!snap.items.length) {
        root.innerHTML =
          '<div class="empty-state"><p class="serif">Tu carrito está vacío</p><p>Sumá un álbum para finalizar la compra.</p>' +
          '<a class="btn btn-primary" href="tienda.html">Ver álbumes</a></div>';
        return;
      }
      var needs = cart.needsShipping();
      shipBlock.hidden = !needs;
      shipBlock.querySelectorAll("input, select, textarea").forEach(function (el) {
        if (el.hasAttribute("data-required-if-ship")) el.required = needs;
      });

      var free = snap.subtotal - snap.discount >= cfg.shipping.freeFrom;
      cfg.shipping.zones.forEach(function (z) {
        var el = zonesWrap.querySelector('[data-zone-price="' + z.id + '"]');
        if (el) el.innerHTML = free ? "<s>" + ui.formatPrice(z.price) + "</s> Gratis" : ui.formatPrice(z.price);
      });

      var shipping = needs ? cart.shippingFor(zone()) : 0;
      var total = snap.subtotal - snap.discount + shipping;

      summary.innerHTML =
        '<ul class="summary-lines">' + snap.items.map(function (i) {
          return '<li><span class="summary-img"><img src="' + i.image + '" alt="" width="64" height="80"><b>' + i.qty + "</b></span>" +
            '<span class="summary-name">' + ui.esc(i.name) + "<small>" + ui.esc((A.productTypes[i.type] || {}).label || "") +
            (i.optionLabels && i.optionLabels.length ? " · " + ui.esc(i.optionLabels.join(" · ")) : "") +
            (i.personalization ? " · “" + ui.esc(i.personalization) + "”" : "") + "</small></span>" +
            "<span>" + ui.formatPrice(i.unitPrice * i.qty) + "</span></li>";
        }).join("") + "</ul>" +
        '<div class="coupon">' +
        (snap.coupon
          ? '<p class="coupon-applied">' + ui.icons.check + " Cupón <strong>" + snap.coupon.code + '</strong> aplicado <button type="button" class="btn-link" data-remove-coupon>Quitar</button></p>'
          : '<label class="sr-only" for="coupon">Código de descuento</label><input id="coupon" type="text" placeholder="Código de descuento" autocomplete="off">' +
            '<button type="button" class="btn btn-outline btn-small" data-apply-coupon>Aplicar</button>') +
        "</div>" +
        '<p class="row"><span>Subtotal</span><span>' + ui.formatPrice(snap.subtotal) + "</span></p>" +
        (snap.discount ? '<p class="row"><span>Descuento</span><span>− ' + ui.formatPrice(snap.discount) + "</span></p>" : "") +
        '<p class="row"><span>Envío</span><span>' + (needs ? (shipping ? ui.formatPrice(shipping) : "Gratis") : "No aplica (digital)") + "</span></p>" +
        '<p class="row row-total"><span>Total</span><span>' + ui.formatPrice(total) + "</span></p>";
    }

    summary.addEventListener("click", function (e) {
      if (e.target.closest("[data-apply-coupon]")) {
        var input = summary.querySelector("#coupon");
        if (!cart.applyCoupon(input.value)) {
          input.classList.add("is-invalid");
          ui.toast("Ese código no es válido");
        } else {
          ui.toast("¡Cupón aplicado!");
        }
      }
      if (e.target.closest("[data-remove-coupon]")) cart.removeCoupon();
    });

    form.addEventListener("change", function (e) { if (e.target.name === "zona") render(); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var btn = form.querySelector("[type=submit]");
      btn.disabled = true;
      btn.classList.add("is-loading");
      btn.querySelector(".btn-label").textContent = "Conectando con Mercado Pago…";

      var snap = cart.snapshot();
      var order = {
        id: "AM-" + Date.now().toString(36).toUpperCase(),
        customer: Object.fromEntries(new FormData(form).entries()),
        items: snap.items,
        shipping: cart.needsShipping() ? cart.shippingFor(zone()) : 0,
        total: snap.subtotal - snap.discount + (cart.needsShipping() ? cart.shippingFor(zone()) : 0)
      };

      createPayment(order).then(function () {
        var hasDigital = snap.items.some(function (i) { return i.type === "digital"; });
        cart.clear();
        root.innerHTML =
          '<div class="order-success reveal">' +
          '  <span class="success-icon">' + ui.icons.check + "</span>" +
          '  <p class="eyebrow">Pedido ' + order.id + "</p>" +
          "  <h2>¡Gracias, " + ui.esc(order.customer.nombre.split(" ")[0]) + "!</h2>" +
          "  <p>Te mandamos la confirmación a <strong>" + ui.esc(order.customer.email) + "</strong>.</p>" +
          (hasDigital ? '  <p class="callout callout-digital">' + ui.icons.download + "<span>Tus plantillas ya están en camino a tu mail. Abrí el link y editalas en Canva gratis.</span></p>" : "") +
          (cart.needsShipping() || snap.items.some(function (i) { return i.type === "fisico"; })
            ? "  <p>Para tus álbumes físicos, te escribimos por WhatsApp en las próximas 24 h para coordinar el envío de fotos.</p>" : "") +
          '  <a class="btn btn-primary" href="index.html">Volver al inicio</a>' +
          "</div>";
        A.effects.initReveal(root);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    /** Placeholder de pago. Reemplazar por la integración real. */
    function createPayment(order) {
      console.info("[Amaré] Pedido listo para enviar al backend:", order);
      return new Promise(function (resolve) { setTimeout(resolve, 1400); });
    }

    cart.subscribe(render);
    render();
  };
})();
