/* ==========================================================================
   Efectos e interacciones: header con blur, menú móvil, apariciones al
   scrollear, carrusel del hero, flipbook, formularios de newsletter.
   Todos son idempotentes (se pueden llamar más de una vez sin duplicar).
   ========================================================================== */
(function () {
  "use strict";

  var A = (window.AMARE = window.AMARE || {});

  // ------------------------------------------------------ header on scroll --
  function initHeader() {
    var header = document.getElementById("site-header");
    if (!header || header.dataset.bound) return;
    header.dataset.bound = "1";
    var ticking = false;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // ------------------------------------------------------------ menú móvil --
  function initMobileMenu() {
    var btn = document.querySelector(".menu-toggle");
    var menu = document.getElementById("mobile-menu");
    if (!btn || !menu || btn.dataset.bound) return;
    btn.dataset.bound = "1";
    function set(open) {
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      btn.innerHTML = open ? A.ui.icons.close : A.ui.icons.menu;
      menu.setAttribute("aria-hidden", String(!open));
      document.documentElement.classList.toggle("menu-open", open);
    }
    btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  }

  // ------------------------------------------------- reveal (fade + slide) --
  var observer;
  function initReveal(root) {
    var items = (root || document).querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.01, rootMargin: "0px 0px -8% 0px" });
    }
    items.forEach(function (el) {
      if (el.dataset.revealBound) return;
      el.dataset.revealBound = "1";
      observer.observe(el);
    });
    // Red de seguridad: nada queda oculto si el observer falla.
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 6000);
  }

  // --------------------------------------------------------- hero carousel --
  function initHeroCarousel() {
    var root = document.querySelector("[data-carousel]");
    if (!root || root.dataset.bound) return;
    root.dataset.bound = "1";
    var slides = root.querySelectorAll(".hero-slide");
    var dotsWrap = root.querySelector(".hero-dots");
    // Con una sola imagen no hay carrusel: se muestra fija y sin puntitos.
    if (slides.length < 2) {
      if (slides[0]) slides[0].classList.add("is-active");
      if (dotsWrap) dotsWrap.hidden = true;
      return;
    }
    var interval = parseInt(root.getAttribute("data-interval"), 10) || 5500;
    var index = 0;
    var timer = null;

    slides.forEach(function (s, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ver imagen " + (i + 1));
      b.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(b);
    });
    var dots = dotsWrap.querySelectorAll("button");

    function go(i) {
      slides[index].classList.remove("is-active");
      dots[index].classList.remove("is-active");
      index = (i + slides.length) % slides.length;
      slides[index].classList.add("is-active");
      dots[index].classList.add("is-active");
      dots[index].style.setProperty("--dur", interval + "ms");
    }
    function next() { go(index + 1); }
    function start() { stop(); timer = setInterval(next, interval); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    function restart() { start(); }

    go(0);
    start();
    root.addEventListener("mouseover", function (e) { if (!root.contains(e.relatedTarget)) { stop(); root.classList.add("is-paused"); } });
    root.addEventListener("mouseout", function (e) { if (!root.contains(e.relatedTarget)) { start(); root.classList.remove("is-paused"); } });
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });

    // swipe
    var x0 = null;
    root.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
      x0 = null;
    });
  }

  // -------------------------------------------------------------- flipbook --
  function initFlipbook() {
    var root = document.querySelector("[data-flipbook]");
    if (!root || root.dataset.bound) return;
    root.dataset.bound = "1";
    var book = root.querySelector(".fb-book");
    var leaves = Array.prototype.slice.call(root.querySelectorAll(".fb-leaf"));
    var prev = root.querySelector("[data-fb-prev]");
    var next = root.querySelector("[data-fb-next]");
    var status = root.querySelector("[data-fb-status]");
    var n = leaves.length;
    var current = 0; // cantidad de hojas dadas vuelta

    var settleTimer;
    function layout(moving) {
      leaves.forEach(function (leaf, i) {
        var flipped = i < current;
        leaf.classList.toggle("is-flipped", flipped);
        // la hoja que se está moviendo queda arriba hasta terminar el giro
        leaf.style.zIndex = leaf === moving ? n + 2 : (flipped ? i + 1 : n - i);
      });
      book.classList.toggle("is-closed-front", current === 0);
      book.classList.toggle("is-closed-back", current === n);
      prev.disabled = current === 0;
      next.disabled = current === n;
      if (current === 0) status.textContent = "Tapa";
      else if (current === n) status.textContent = "Contratapa";
      else status.textContent = "Páginas " + (current * 2 - 1) + "–" + current * 2 + " de " + (n - 1) * 2;
    }
    function go(delta) {
      var target = Math.max(0, Math.min(n, current + delta));
      if (target === current) return;
      var moving = leaves[delta > 0 ? current : current - 1];
      current = target;
      layout(moving);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(function () { layout(); }, 900);
    }

    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    book.addEventListener("click", function (e) {
      var r = book.getBoundingClientRect();
      go(e.clientX - r.left > r.width / 2 ? 1 : -1);
    });
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    });
    var x0 = null;
    book.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    book.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 30) { e.preventDefault(); go(dx < 0 ? 1 : -1); }
      x0 = null;
    });
    layout();
  }

  // ------------------------------------------------------------ newsletter --
  function initNewsletter() {
    document.querySelectorAll("form[data-newsletter]").forEach(function (form) {
      if (form.dataset.bound) return;
      form.dataset.bound = "1";
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        if (!input.checkValidity()) { input.reportValidity(); return; }
        // TODO backend: enviar el mail a Mailchimp / Brevo / Supabase.
        var c = A.config.newsletterCoupon;
        form.classList.add("is-done");
        form.innerHTML =
          '<p class="newsletter-success">' + A.ui.icons.check +
          " ¡Listo! Tu código es <strong>" + c.code + "</strong>. Usalo en el checkout para tener " + c.percent + "% OFF.</p>";
      });
    });
  }

  // ------------------------------------------------ acordeón con animación --
  function initAccordions(root) {
    (root || document).querySelectorAll("details.accordion-item").forEach(function (d) {
      if (d.dataset.bound) return;
      d.dataset.bound = "1";
      var summary = d.querySelector("summary");
      var content = d.querySelector(".accordion-content");
      if (!summary || !content || !content.animate) return;
      summary.addEventListener("click", function (e) {
        e.preventDefault();
        if (d.open) {
          var h = content.offsetHeight;
          d.classList.add("is-closing");
          content.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 260, easing: "ease" })
            .onfinish = function () { d.open = false; d.classList.remove("is-closing"); };
        } else {
          d.open = true;
          var target = content.offsetHeight;
          content.animate([{ height: "0px", opacity: 0 }, { height: target + "px", opacity: 1 }], { duration: 320, easing: "cubic-bezier(.2,.7,.2,1)" });
        }
      });
    });
  }

  // ------------------------------------------ ripple / feedback de botones --
  function initButtonFeedback() {
    if (document.documentElement.dataset.btnFx) return;
    document.documentElement.dataset.btnFx = "1";
    document.addEventListener("pointerdown", function (e) {
      var btn = e.target.closest(".btn");
      if (!btn) return;
      var r = btn.getBoundingClientRect();
      btn.style.setProperty("--rx", e.clientX - r.left + "px");
      btn.style.setProperty("--ry", e.clientY - r.top + "px");
      btn.classList.remove("is-pressed");
      void btn.offsetWidth;
      btn.classList.add("is-pressed");
    });
  }

  // --------------------------------------------- contadores (count-up) --
  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    function run(el) {
      if (el.dataset.counted) return;
      el.dataset.counted = "1";
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var start = performance.now();
      var dur = 1600;
      var fmt = new Intl.NumberFormat("es-AR");
      (function tick(now) {
        var t = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = fmt.format(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    }
    if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.01 });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(run); }, 6000);
  }

  // --------------------------------------------------- slider testimonios --
  function initTestimonials() {
    var root = document.querySelector("[data-testi]");
    if (!root || root.dataset.bound) return;
    root.dataset.bound = "1";
    var slides = root.querySelectorAll(".testi-slide");
    var dotsWrap = root.querySelector(".testi-dots");
    var i = 0, timer;
    slides.forEach(function (_, k) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ver testimonio " + (k + 1));
      b.addEventListener("click", function () { go(k); start(); });
      dotsWrap.appendChild(b);
    });
    var dots = dotsWrap.querySelectorAll("button");
    function go(k) {
      slides[i].classList.remove("is-active"); dots[i].classList.remove("is-active");
      i = (k + slides.length) % slides.length;
      slides[i].classList.add("is-active"); dots[i].classList.add("is-active");
    }
    function start() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 6500); }
    go(0);
    start();
  }

  A.effects = {
    initCounters: initCounters,
    initTestimonials: initTestimonials,
    initHeader: initHeader,
    initMobileMenu: initMobileMenu,
    initReveal: initReveal,
    initHeroCarousel: initHeroCarousel,
    initFlipbook: initFlipbook,
    initNewsletter: initNewsletter,
    initAccordions: initAccordions,
    initButtonFeedback: initButtonFeedback
  };
})();
