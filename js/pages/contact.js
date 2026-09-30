/* Contacto: formulario con validación y envío simulado. */
(function () {
  "use strict";
  var A = (window.AMARE = window.AMARE || {});

  A.pages = A.pages || {};
  A.pages.contacto = function () {
    var form = document.querySelector("[data-contact-form]");
    if (!form || form.dataset.bound) return;
    form.dataset.bound = "1";

    // Preselecciona el motivo desde la URL (contacto.html#disenio)
    var motivo = A.ui.pageParam("motivo");
    if (motivo) {
      var sel = form.querySelector('select[name="motivo"]');
      if (sel && sel.querySelector('option[value="' + motivo + '"]')) sel.value = motivo;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var btn = form.querySelector("[type=submit]");
      btn.disabled = true;
      btn.classList.add("is-loading");
      // TODO backend: enviar a Formspree / Supabase / email.
      var data = Object.fromEntries(new FormData(form).entries());
      console.info("[Amaré] Mensaje de contacto:", data);
      setTimeout(function () {
        form.innerHTML =
          '<div class="order-success">' +
          '<span class="success-icon">' + A.ui.icons.check + "</span>" +
          "<h2>¡Gracias, " + A.ui.esc(data.nombre.split(" ")[0]) + "!</h2>" +
          "<p>Recibimos tu mensaje. Te respondemos dentro de las 24 h hábiles.</p>" +
          '<a class="btn btn-outline" href="' + A.ui.whatsappUrl() + '" target="_blank" rel="noopener">¿Apurada? Escribinos por WhatsApp</a>' +
          "</div>";
      }, 900);
    });
  };
})();
