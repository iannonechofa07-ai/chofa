/* ==========================================================================
   Carrito lateral (drawer) + contador animado del header.
   ========================================================================== */
(function () {
  "use strict";

  var A = (window.AMARE = window.AMARE || {});
  var ui, cart, drawer, lastFocus;

  function freeShippingBar(snap) {
    if (!cart.needsShipping()) {
      return '<p class="free-ship is-done">' + ui.icons.download + " Tus plantillas se descargan al instante, sin envío.</p>";
    }
    var goal = A.config.shipping.freeFrom;
    var current = snap.subtotal - snap.discount;
    var pct = Math.min(100, Math.round((current / goal) * 100));
    var msg = current >= goal
      ? "¡Tenés <strong>envío gratis</strong>!"
      : "Te faltan <strong>" + ui.formatPrice(goal - current) + "</strong> para el envío gratis";
    return '<div class="free-ship' + (current >= goal ? " is-done" : "") + '"><p>' + ui.icons.truck + " " + msg + "</p>" +
      '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div></div>';
  }

  function lineHTML(i) {
    var meta = (i.optionLabels || []).join(" · ");
    var perso = i.personalization ? '<p class="line-perso">Tapa: “' + ui.esc(i.personalization) + "”</p>" : "";
    var typeLabel = A.productTypes[i.type] ? A.productTypes[i.type].label : "";
    return (
      '<li class="cart-line" data-key="' + ui.esc(i.key) + '">' +
      '  <a class="line-img" href="producto.html?p=' + encodeURIComponent(i.slug) + '"><img src="' + i.image + '" alt="" width="80" height="100"></a>' +
      '  <div class="line-body">' +
      '    <p class="line-type">' + typeLabel + "</p>" +
      '    <h4><a href="producto.html?p=' + encodeURIComponent(i.slug) + '">' + ui.esc(i.name) + "</a></h4>" +
      (meta ? '    <p class="line-meta">' + ui.esc(meta) + "</p>" : "") + perso +
      '    <div class="line-actions">' +
      '      <div class="qty qty-small">' +
      '        <button type="button" data-qty="-1" aria-label="Restar uno">' + ui.icons.minus + "</button>" +
      '        <span aria-live="polite">' + i.qty + "</span>" +
      '        <button type="button" data-qty="1" aria-label="Sumar uno">' + ui.icons.plus + "</button>" +
      "      </div>" +
      '      <button type="button" class="line-remove" data-remove aria-label="Quitar ' + ui.esc(i.name) + '">' + ui.icons.trash + "</button>" +
      "    </div>" +
      "  </div>" +
      '  <p class="line-price">' + ui.formatPrice(i.unitPrice * i.qty) + "</p>" +
      "</li>"
    );
  }

  function render(snap) {
    var body = drawer.querySelector(".drawer-body");
    var foot = drawer.querySelector(".drawer-foot");
    drawer.querySelector(".drawer-count").textContent = snap.count ? "(" + snap.count + ")" : "";

    if (!snap.items.length) {
      body.innerHTML =
        '<div class="cart-empty">' +
        '  <img src="assets/img/nuestra-historia-1.svg" alt="" width="160" height="200">' +
        "  <p class=\"serif\">Tu carrito está vacío</p>" +
        "  <p>Elegí el álbum que va a guardar tus mejores recuerdos.</p>" +
        '  <a class="btn btn-primary" href="tienda.html">Ver álbumes</a>' +
        "</div>";
      foot.hidden = true;
      return;
    }

    body.innerHTML = freeShippingBar(snap) + '<ul class="cart-lines">' + snap.items.map(lineHTML).join("") + "</ul>";
    foot.hidden = false;
    foot.innerHTML =
      (snap.discount ? '<p class="row"><span>Descuento ' + snap.coupon.code + "</span><span>− " + ui.formatPrice(snap.discount) + "</span></p>" : "") +
      '<p class="row row-total"><span>Subtotal</span><span>' + ui.formatPrice(snap.subtotal - snap.discount) + "</span></p>" +
      '<p class="drawer-note">' + (cart.needsShipping() ? "El envío se calcula en el checkout." : "Descarga inmediata después del pago.") + "</p>" +
      '<a class="btn btn-primary btn-block" href="checkout.html">Finalizar compra ' + ui.icons.arrow + "</a>" +
      '<button type="button" class="btn-link" data-close-drawer>Seguir comprando</button>';
  }

  function updateCount(snap, event) {
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      var prev = parseInt(el.textContent, 10) || 0;
      el.textContent = snap.count;
      el.classList.toggle("is-empty", snap.count === 0);
      if (event && event.type === "add" && snap.count !== prev) {
        el.classList.remove("bump");
        void el.offsetWidth; // reinicia la animación
        el.classList.add("bump");
      }
    });
  }

  function open() {
    lastFocus = document.activeElement;
    drawer.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("drawer-open");
    setTimeout(function () { var c = drawer.querySelector(".drawer-close"); if (c) c.focus(); }, 60);
  }

  function close() {
    drawer.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("drawer-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function mount() {
    ui = A.ui;
    cart = A.cart;
    if (document.getElementById("cart-drawer")) return;

    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="drawer-overlay" data-close-drawer></div>' +
      '<aside class="cart-drawer" id="cart-drawer" aria-hidden="true" aria-label="Carrito" role="dialog" aria-modal="true">' +
      '  <div class="drawer-head"><h2>Tu carrito <span class="drawer-count"></span></h2>' +
      '    <button type="button" class="icon-btn drawer-close" data-close-drawer aria-label="Cerrar carrito">' + ui.icons.close + "</button></div>" +
      '  <div class="drawer-body"></div>' +
      '  <div class="drawer-foot" hidden></div>' +
      "</aside>";
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
    drawer = document.getElementById("cart-drawer");

    document.addEventListener("click", function (e) {
      if (e.target.closest(".cart-toggle")) { e.preventDefault(); open(); return; }
      if (e.target.closest("[data-close-drawer]")) { close(); return; }
      var line = e.target.closest(".cart-line");
      if (!line || !drawer.contains(line)) return;
      var key = line.getAttribute("data-key");
      var qtyBtn = e.target.closest("[data-qty]");
      if (qtyBtn) {
        var item = cart.snapshot().items.find(function (i) { return i.key === key; });
        if (item) cart.setQty(key, item.qty + parseInt(qtyBtn.getAttribute("data-qty"), 10));
      } else if (e.target.closest("[data-remove]")) {
        line.classList.add("is-leaving");
        setTimeout(function () { cart.remove(key); }, 220);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.getAttribute("aria-hidden") === "false") close();
    });

    cart.subscribe(function (snap, ev) { render(snap); updateCount(snap, ev); });
    var snap = cart.snapshot();
    render(snap);
    updateCount(snap);
  }

  A.cartDrawer = { mount: mount, open: open, close: close };
})();
