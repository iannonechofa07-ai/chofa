/* ==========================================================================
   Amaré Studio — arranque. Cada init va envuelto en try/catch para que
   un error aislado no rompa el resto del sitio.
   ========================================================================== */
(function () {
  "use strict";
  var A = window.AMARE || {};

  function safe(fn, name) {
    try { fn(); } catch (e) { console.error("[Amaré] Falló " + name, e); }
  }

  function boot() {
    document.documentElement.classList.add("js");
    safe(function () { A.ui.renderLayout(); }, "layout");
    safe(function () { A.cartDrawer.mount(); }, "carrito");
    safe(A.effects.initHeader, "header");
    safe(A.effects.initMobileMenu, "menú");
    safe(A.effects.initHeroCarousel, "carrusel");
    safe(A.effects.initFlipbook, "flipbook");
    safe(A.effects.initNewsletter, "newsletter");
    safe(A.effects.initCounters, "contadores");
    safe(A.effects.initTestimonials, "testimonios");
    safe(function () { A.effects.initAccordions(); }, "acordeones");
    safe(A.effects.initButtonFeedback, "botones");

    var page = document.body.getAttribute("data-page");
    if (page && A.pages && A.pages[page]) safe(A.pages[page], "página " + page);
    // El bloque de contacto aparece en varias páginas (home, contacto)
    if (page !== "contacto" && A.pages && A.pages.contacto) safe(A.pages.contacto, "formulario de contacto");

    safe(function () { A.effects.initReveal(); }, "reveal");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
