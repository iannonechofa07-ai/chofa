/* ==========================================================================
   Componentes reutilizables: header, footer, carrito lateral, WhatsApp,
   tarjeta de producto, toasts y utilidades de formato.

   Cada página tiene placeholders vacíos:
     <div data-component="header"></div>
     <div data-component="footer"></div>
   y este archivo los completa. El contenido propio de cada página
   está escrito directo en el HTML.
   ========================================================================== */
(function () {
  "use strict";

  var A = (window.AMARE = window.AMARE || {});
  var cfg = A.config;

  // ---------------------------------------------------------------- utils --
  var money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function formatPrice(n) { return money.format(n).replace(/\s/g, ""); }

  function productUrl(p) { return "producto.html?p=" + encodeURIComponent(p.slug); }

  function whatsappUrl(text) {
    return "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(text || cfg.whatsappMessage);
  }

  var ICONS = {
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/></svg>',
    truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true" class="icon-fill"><path d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.8 5-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.9a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.1 8.1 0 1 1 12 20.1Zm4.5-6c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true" class="icon-fill"><path d="M8 5.5v13l11-6.5z"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17l9-10"/></svg>',
    hand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12M11 11V5a1.5 1.5 0 0 1 3 0v6M14 11V6.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-.5a5 5 0 0 1-4-2L4 14.8a1.5 1.5 0 0 1 2.2-2L8 14.5"/></svg>'
  };

  var NAV = [
    { href: "index.html", label: "Inicio", id: "home" },
    { href: "nosotras.html", label: "Nosotras", id: "nosotras" },
    { href: "tienda.html", label: "Tienda", id: "tienda" },
    { href: "tienda.html?tipo=digital", label: "Plantillas Canva", id: "plantillas" },
    { href: "preguntas-frecuentes.html", label: "Preguntas", id: "faq" },
    { href: "contacto.html", label: "Contacto", id: "contacto" }
  ];

  function currentPage() { return document.body.getAttribute("data-page") || ""; }

  // --------------------------------------------------------------- header --
  function renderHeader(el) {
    if (el.children.length) return;
    var page = currentPage();
    var links = NAV.map(function (n) {
      var active = n.id === page ? ' aria-current="page"' : "";
      return '<li><a href="' + n.href + '"' + active + ">" + n.label + "</a></li>";
    }).join("");

    el.outerHTML =
      '<header class="site-header" id="site-header">' +
      '  <div class="header-bar container">' +
      '    <button class="icon-btn menu-toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-menu">' + ICONS.menu + "</button>" +
      '    <a class="logo" href="index.html" aria-label="Amaré Studio, inicio">Amaré <em>Studio</em></a>' +
      '    <nav class="main-nav" aria-label="Principal"><ul>' + links + "</ul></nav>" +
      '    <div class="header-actions">' +
      '      <button class="icon-btn cart-toggle" type="button" aria-label="Abrir carrito" aria-controls="cart-drawer">' + ICONS.bag +
      '        <span class="cart-count" data-cart-count aria-live="polite">0</span></button>' +
      "    </div>" +
      "  </div>" +
      "</header>" +
      '<div class="mobile-menu" id="mobile-menu" aria-hidden="true">' +
      '  <nav aria-label="Menú móvil"><ul>' + links + "</ul></nav>" +
      '  <div class="mobile-menu-foot"><a href="' + cfg.instagram + '" target="_blank" rel="noopener">' + ICONS.instagram + " " + cfg.instagramHandle + '</a><a href="' + whatsappUrl() + '" target="_blank" rel="noopener">' + ICONS.whatsapp + " WhatsApp</a></div>" +
      "</div>";
  }

  // --------------------------------------------------------------- footer --
  function renderFooter(el) {
    if (el.children.length) return;
    var year = new Date().getFullYear();
    var ig = [1, 2, 3, 4, 5, 6].map(function (i) {
      return '<a href="' + cfg.instagram + '" target="_blank" rel="noopener" aria-label="Publicación de Instagram ' + i + '">' +
        '<img src="assets/img/ig-' + i + '.svg" alt="" width="800" height="800" loading="lazy"></a>';
    }).join("");
    el.outerHTML =
      '<footer class="site-footer">' +
      '  <div class="container">' +
      '    <div class="footer-top">' +
      '      <a class="logo logo-large" href="index.html">Amaré <em>Studio</em></a>' +
      '      <p class="footer-tagline">Álbumes de fotos personalizados, hechos a mano en Argentina. ' + cfg.tagline + ".</p>" +
      '      <div class="footer-social">' +
      '        <a class="icon-btn" href="' + cfg.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">' + ICONS.instagram + "</a>" +
      '        <a class="icon-btn" href="' + whatsappUrl() + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + ICONS.whatsapp + "</a>" +
      '        <a class="icon-btn" href="mailto:' + cfg.email + '" aria-label="Email">' + ICONS.mail + "</a>" +
      "      </div>" +
      "    </div>" +
      '    <div class="footer-grid">' +
      '      <div class="footer-col"><h3>Páginas</h3><ul>' +
      '        <li><a href="index.html">Inicio</a></li>' +
      '        <li><a href="nosotras.html">Nosotras</a></li>' +
      '        <li><a href="tienda.html">Tienda</a></li>' +
      '        <li><a href="contacto.html">Contacto</a></li>' +
      "      </ul></div>" +
      '      <div class="footer-col"><h3>Ayuda</h3><ul>' +
      '        <li><a href="tienda.html?tipo=fisico">Álbumes físicos</a></li>' +
      '        <li><a href="tienda.html?tipo=digital">Plantillas Canva</a></li>' +
      '        <li><a href="preguntas-frecuentes.html">Preguntas frecuentes</a></li>' +
      '        <li><a href="checkout.html">Checkout</a></li>' +
      "      </ul></div>" +
      '      <div class="footer-col"><h3>Medios de pago</h3>' +
      '        <ul class="payments" aria-label="Medios de pago aceptados">' +
      "          <li>Mercado Pago</li><li>Visa</li><li>Mastercard</li><li>Amex</li><li>Transferencia</li>" +
      "        </ul>" +
      '        <p class="footer-note">Hasta 3 cuotas sin interés con Mercado Pago.</p>' +
      "      </div>" +
      '      <div class="footer-col footer-ig"><h3>Instagram ' + cfg.instagramHandle + '</h3><div class="footer-ig-grid">' + ig + "</div></div>" +
      "    </div>" +
      '    <div class="footer-bottom">' +
      "      <p>Hecho con amor en " + cfg.location + ' <span class="heart">' + ICONS.heart + "</span></p>" +
      "      <p>© " + year + " Amaré Studio. Todos los derechos reservados.</p>" +
      "    </div>" +
      "  </div>" +
      "</footer>";
  }

  // ------------------------------------------------------------- whatsapp --
  function renderWhatsapp() {
    if (document.querySelector(".whatsapp-float")) return;
    var a = document.createElement("a");
    a.className = "whatsapp-float";
    a.href = whatsappUrl();
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "Escribinos por WhatsApp");
    a.innerHTML = ICONS.whatsapp + '<span class="whatsapp-label">¿Te ayudamos?</span>';
    document.body.appendChild(a);
  }

  // --------------------------------------------------------- product card --
  function productCard(p, opts) {
    opts = opts || {};
    var type = A.productTypes[p.type];
    var occasion = A.occasions.find(function (o) { return o.id === p.occasion; });
    var compare = p.compareAtPrice ? '<s class="price-compare">' + formatPrice(p.compareAtPrice) + "</s>" : "";
    var badge = p.badge ? '<span class="tag tag-soft">' + esc(p.badge) + "</span>" : "";
    return (
      '<article class="product-card reveal" data-type="' + p.type + '" style="--d:' + (opts.delay || 0) + 'ms">' +
      '  <a class="product-media" href="' + productUrl(p) + '" aria-label="' + esc(p.name + " – " + type.long) + '">' +
      '    <img class="img-primary" src="' + p.images[0] + '" alt="' + esc(p.name) + '" loading="lazy" width="1000" height="1250">' +
      '    <img class="img-secondary" src="' + (p.images[1] || p.images[0]) + '" alt="" loading="lazy" width="1000" height="1250" aria-hidden="true">' +
      '    <span class="type-badge type-' + p.type + '">' + (p.type === "digital" ? ICONS.download : ICONS.truck) + type.label + "</span>" +
      "  </a>" +
      '  <div class="product-info">' +
      '    <p class="product-meta">' + esc(occasion ? occasion.short : "") + badge + "</p>" +
      '    <h3 class="product-name"><a href="' + productUrl(p) + '">' + esc(p.name) + "</a></h3>" +
      '    <p class="product-price">' + (p.type === "fisico" ? "<small>desde</small> " : "") + formatPrice(p.price) + " " + compare + "</p>" +
      "  </div>" +
      "</article>"
    );
  }

  // ----------------------------------------------------------------- toast --
  var toastTimer;
  function toast(msg) {
    var t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.innerHTML = ICONS.check + "<span>" + esc(msg) + "</span>";
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-visible"); }, 2600);
  }

  A.ui = {
    esc: esc,
    formatPrice: formatPrice,
    productUrl: productUrl,
    whatsappUrl: whatsappUrl,
    icons: ICONS,
    productCard: productCard,
    toast: toast,
    renderLayout: function () {
      document.querySelectorAll('[data-component="header"]').forEach(renderHeader);
      document.querySelectorAll('[data-component="footer"]').forEach(renderFooter);
      renderWhatsapp();
      // Links de WhatsApp escritos en el HTML: usan el número de config.js
      document.querySelectorAll("a[data-whatsapp]").forEach(function (a) { a.href = whatsappUrl(); });
    }
  };
})();
