/* ==========================================================================
   Amaré Studio — configuración general de la tienda
   Editá acá: WhatsApp, Instagram, zonas de envío, textos de marca.
   ========================================================================== */
(function () {
  "use strict";

  window.AMARE = window.AMARE || {};

  window.AMARE.config = {
    brand: "Amaré Studio",
    tagline: "El regalo que se queda para siempre",
    currency: "ARS",
    locale: "es-AR",

    // Reemplazar por el número real (formato internacional sin + ni espacios).
    whatsapp: "5491100000000",
    whatsappMessage: "¡Hola Amaré! Quiero consultar por un álbum 💛",
    instagram: "https://instagram.com/amarestudio",
    instagramHandle: "@amarestudio",
    email: "hola@amarestudio.com.ar",
    location: "Tigre, Buenos Aires",

    // Envíos por zona. `days` es el texto que se muestra al cliente.
    shipping: {
      freeFrom: 120000,
      zones: [
        { id: "caba", label: "CABA", price: 6500, days: "2 a 4 días hábiles" },
        { id: "gba", label: "GBA", price: 8500, days: "3 a 5 días hábiles" },
        { id: "interior", label: "Resto del país", price: 12000, days: "4 a 8 días hábiles" }
      ]
    },

    // Código de bienvenida del newsletter.
    newsletterCoupon: { code: "BIENVENIDA10", percent: 10 },

    // Clave de almacenamiento del carrito (localStorage).
    cartStorageKey: "amare.cart.v1"
  };
})();
