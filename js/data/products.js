/* ==========================================================================
   Amaré Studio — catálogo de productos (datos locales)

   Esta estructura imita lo que devolvería un backend real (Supabase / Shopify):
   - cada producto tiene `id`, `slug`, `type`, precio base en ARS (entero),
     imágenes y `options` (variantes) con un modificador de precio `priceDelta`.
   - El acceso a estos datos pasa SIEMPRE por js/services/catalog.js, así que
     para conectar un backend solo hay que cambiar ese archivo.

   type: "fisico"  → álbum producido, impreso y enviado.
         "digital" → plantilla editable en Canva (descarga inmediata).
   occasion: "pareja" | "madre-padre" | "egresados" | "bebe-familia" | "viajes"
   ========================================================================== */
(function () {
  "use strict";

  window.AMARE = window.AMARE || {};

  var IMG = "assets/img/";

  // Opciones reutilizables ----------------------------------------------------
  var PHYSICAL_OPTIONS = [
    {
      id: "size",
      label: "Tamaño",
      values: [
        { id: "20x20", label: "20 × 20 cm", priceDelta: 0 },
        { id: "25x25", label: "25 × 25 cm", priceDelta: 9000 },
        { id: "30x30", label: "30 × 30 cm", priceDelta: 18000 }
      ]
    },
    {
      id: "cover",
      label: "Color de tapa",
      type: "swatch",
      values: [
        { id: "arena", label: "Arena", swatch: "#D8C3A5", priceDelta: 0 },
        { id: "rosa", label: "Rosa empolvado", swatch: "#E8C4C0", priceDelta: 0 },
        { id: "chocolate", label: "Chocolate", swatch: "#4A3228", priceDelta: 0 },
        { id: "salvia", label: "Salvia", swatch: "#A7B09A", priceDelta: 0 }
      ]
    },
    {
      id: "pages",
      label: "Cantidad de páginas",
      values: [
        { id: "20", label: "20 páginas", priceDelta: 0 },
        { id: "30", label: "30 páginas", priceDelta: 7500 },
        { id: "40", label: "40 páginas", priceDelta: 14000 }
      ]
    }
  ];

  var DIGITAL_OPTIONS = [
    {
      id: "size",
      label: "Formato",
      values: [
        { id: "cuadrado", label: "Cuadrado 20 × 20", priceDelta: 0 },
        { id: "a4", label: "A4 horizontal", priceDelta: 0 }
      ]
    },
    {
      id: "pages",
      label: "Cantidad de páginas",
      values: [
        { id: "20", label: "20 páginas", priceDelta: 0 },
        { id: "40", label: "40 páginas", priceDelta: 3500 }
      ]
    }
  ];

  var PHYSICAL_DETAILS = {
    includes: [
      "Diseño personalizado con tus fotos",
      "Impresión fotográfica en papel mate de 250 g",
      "Tapa dura forrada en tela con título grabado",
      "Caja de regalo y tarjeta escrita a mano"
    ],
    production: "Una vez que recibimos tus fotos, te mandamos una prueba digital en 3 a 5 días hábiles. Con tu aprobación, producimos el álbum en 7 a 10 días hábiles.",
    shipping: "Enviamos a todo el país por correo o mensajería. CABA y GBA en 2 a 5 días hábiles; resto del país en 4 a 8. Envío gratis en compras desde $120.000.",
    returns: "Al ser un producto personalizado no tiene cambio por gusto, pero si llega con algún defecto de fabricación lo reponemos sin costo. Tenés 10 días desde que lo recibís para avisarnos."
  };

  var DIGITAL_DETAILS = {
    includes: [
      "Link a la plantilla editable en Canva (cuenta gratis)",
      "Guía en PDF paso a paso para editar e imprimir",
      "Tipografías y paleta de colores sugeridas",
      "Uso personal ilimitado"
    ],
    production: "Descarga inmediata: apenas se acredita el pago te llega el link por mail y también lo ves en la pantalla de confirmación.",
    shipping: "No tiene envío. Es un producto 100% digital: lo editás vos y lo imprimís donde quieras (o nos lo mandás y te lo imprimimos).",
    returns: "Por ser un producto digital de descarga inmediata no tiene devolución. Si tenés cualquier problema con el link, escribinos y lo resolvemos al toque."
  };

  // Catálogo ------------------------------------------------------------------
  window.AMARE.products = [
    {
      id: "p-001",
      slug: "la-cabana",
      name: "La Cabaña",
      type: "fisico",
      occasion: "viajes",
      price: 52000,
      compareAtPrice: null,
      badge: "Más vendido",
      short: "Para ese viaje que todavía te hace sonreír: bosque, ruta y fogón.",
      description: "Un álbum de viaje con estética cálida y mucho aire para que las fotos respiren. Pensado para escapadas, vacaciones en familia o esa luna de miel en la montaña. Lo diseñamos con vos y lo producimos a mano en nuestro taller.",
      images: [IMG + "la-cabana-1.svg", IMG + "la-cabana-2.svg", IMG + "la-cabana-3.svg"],
      options: PHYSICAL_OPTIONS,
      details: PHYSICAL_DETAILS,
      tags: ["viaje", "familia"]
    },
    {
      id: "p-002",
      slug: "nuestra-historia",
      name: "Nuestra Historia",
      type: "fisico",
      occasion: "pareja",
      price: 56000,
      compareAtPrice: 62000,
      badge: "Aniversario",
      short: "Desde la primera cita hasta hoy, contado página por página.",
      description: "Nuestro álbum más elegido para aniversarios, casamientos y San Valentín. Una narrativa por capítulos, con espacio para fechas, frases y esos detalles que solo ustedes dos entienden.",
      images: [IMG + "nuestra-historia-1.svg", IMG + "nuestra-historia-2.svg", IMG + "nuestra-historia-3.svg"],
      options: PHYSICAL_OPTIONS,
      details: PHYSICAL_DETAILS,
      tags: ["pareja", "aniversario", "casamiento"]
    },
    {
      id: "p-003",
      slug: "mi-primer-ano",
      name: "Mi Primer Año",
      type: "fisico",
      occasion: "bebe-familia",
      price: 54000,
      compareAtPrice: null,
      badge: null,
      short: "Los primeros doce meses, mes a mes, para guardar toda la vida.",
      description: "Un álbum tierno y luminoso para el primer año del bebé: la llegada, las primeras veces, los cumple-mes. Incluye páginas guía para completar peso, altura y palabras favoritas.",
      images: [IMG + "mi-primer-ano-1.svg", IMG + "mi-primer-ano-2.svg", IMG + "mi-primer-ano-3.svg"],
      options: PHYSICAL_OPTIONS,
      details: PHYSICAL_DETAILS,
      tags: ["bebé", "familia", "nacimiento"]
    },
    {
      id: "p-004",
      slug: "egresados",
      name: "Egresados",
      type: "fisico",
      occasion: "egresados",
      price: 48000,
      compareAtPrice: null,
      badge: "Precio por grupo",
      short: "El viaje, la previa, el último día. Todo lo que no se tiene que olvidar.",
      description: "Un álbum para cerrar una etapa a lo grande. Ideal para secundaria, universidad o viaje de egresados. Consultanos por precios especiales para cursos completos.",
      images: [IMG + "egresados-1.svg", IMG + "egresados-2.svg", IMG + "egresados-3.svg"],
      options: PHYSICAL_OPTIONS,
      details: PHYSICAL_DETAILS,
      tags: ["egresados", "amigos"]
    },
    {
      id: "p-101",
      slug: "nuestra-historia-canva",
      name: "Nuestra Historia",
      type: "digital",
      occasion: "pareja",
      price: 9500,
      compareAtPrice: null,
      badge: null,
      short: "La versión editable de nuestro clásico: la armás vos, a tu ritmo.",
      description: "La misma estética de nuestro álbum más vendido, lista para que la edites en Canva. Cambiás fotos, textos y colores en minutos, sin saber diseño.",
      images: [IMG + "nuestra-historia-canva-1.svg", IMG + "nuestra-historia-canva-2.svg", IMG + "nuestra-historia-canva-3.svg"],
      options: DIGITAL_OPTIONS,
      details: DIGITAL_DETAILS,
      tags: ["pareja", "aniversario"]
    },
    {
      id: "p-102",
      slug: "mama-canva",
      name: "Mamá",
      type: "digital",
      occasion: "madre-padre",
      price: 8500,
      compareAtPrice: null,
      badge: "Día de la Madre",
      short: "Un homenaje a ella, con las fotos de siempre y palabras nuevas.",
      description: "Plantilla pensada para el Día de la Madre (y cualquier día). Páginas con espacio para cartas, recetas familiares y fotos de distintas épocas.",
      images: [IMG + "mama-canva-1.svg", IMG + "mama-canva-2.svg", IMG + "mama-canva-3.svg"],
      options: DIGITAL_OPTIONS,
      details: DIGITAL_DETAILS,
      tags: ["mamá", "familia"]
    },
    {
      id: "p-103",
      slug: "viaje-sonado-canva",
      name: "Viaje Soñado",
      type: "digital",
      occasion: "viajes",
      price: 9000,
      compareAtPrice: null,
      badge: null,
      short: "Mapas, rutas y postales: tu viaje convertido en diario.",
      description: "Plantilla de viaje con páginas de itinerario, mapas y collage. Ideal para mochileros, lunas de miel y vacaciones en familia.",
      images: [IMG + "viaje-sonado-canva-1.svg", IMG + "viaje-sonado-canva-2.svg", IMG + "viaje-sonado-canva-3.svg"],
      options: DIGITAL_OPTIONS,
      details: DIGITAL_DETAILS,
      tags: ["viaje"]
    },
    {
      id: "p-104",
      slug: "recuerdos-de-familia-canva",
      name: "Recuerdos de Familia",
      type: "digital",
      occasion: "bebe-familia",
      price: 10500,
      compareAtPrice: 12000,
      badge: null,
      short: "Abuelos, primos, sobremesas: el árbol de tu familia en fotos.",
      description: "Una plantilla para reunir generaciones. Incluye páginas de árbol genealógico, fotos antiguas y nuevas, y espacio para anécdotas.",
      images: [IMG + "recuerdos-de-familia-canva-1.svg", IMG + "recuerdos-de-familia-canva-2.svg", IMG + "recuerdos-de-familia-canva-3.svg"],
      options: DIGITAL_OPTIONS,
      details: DIGITAL_DETAILS,
      tags: ["familia", "abuelos"]
    }
  ];

  window.AMARE.occasions = [
    { id: "pareja", label: "Pareja / Aniversario", short: "Pareja", image: IMG + "col-pareja.svg" },
    { id: "madre-padre", label: "Día de la Madre y del Padre", short: "Mamá y Papá", image: IMG + "col-dia-madre-padre.svg" },
    { id: "egresados", label: "Egresados", short: "Egresados", image: IMG + "col-egresados.svg" },
    { id: "bebe-familia", label: "Bebé y familia", short: "Bebé y familia", image: IMG + "col-bebe-familia.svg" },
    { id: "viajes", label: "Viajes", short: "Viajes", image: IMG + "col-viajes.svg" }
  ];

  window.AMARE.productTypes = {
    fisico: { label: "Físico", long: "Álbum físico" },
    digital: { label: "Plantilla Canva", long: "Plantilla digital" }
  };
})();
