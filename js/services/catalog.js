/* ==========================================================================
   Servicio de catálogo — ÚNICO punto de acceso a los productos.

   Hoy lee de window.AMARE.products (js/data/products.js).
   Todas las funciones devuelven Promesas, igual que lo haría una API real.
   Para conectar un backend, reemplazá el cuerpo de `fetchAll()`:

   · Supabase:
       const { data } = await supabase.from("products").select("*, options(*)");
       return data.map(normalize);

   · Shopify Storefront API:
       const res = await fetch("https://TU-TIENDA.myshopify.com/api/2024-07/graphql.json", {...});
       return json.data.products.nodes.map(normalizeShopify);

   Mientras `normalize` devuelva la misma forma que js/data/products.js,
   el resto del sitio (tienda, ficha, carrito) no necesita cambios.
   ========================================================================== */
(function () {
  "use strict";

  var A = (window.AMARE = window.AMARE || {});
  var cache = null;

  function fetchAll() {
    if (!cache) cache = Promise.resolve((A.products || []).slice());
    return cache;
  }

  function matches(p, f) {
    if (f.type && f.type !== "todos" && p.type !== f.type) return false;
    if (f.occasion && f.occasion !== "todas" && p.occasion !== f.occasion) return false;
    if (f.maxPrice && p.price > f.maxPrice) return false;
    if (f.query) {
      var q = f.query.toLowerCase();
      var hay = (p.name + " " + p.short + " " + (p.tags || []).join(" ")).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }

  var sorters = {
    destacados: function () { return 0; },
    "precio-asc": function (a, b) { return a.price - b.price; },
    "precio-desc": function (a, b) { return b.price - a.price; },
    nombre: function (a, b) { return a.name.localeCompare(b.name, "es"); }
  };

  A.catalog = {
    /** Lista de productos con filtros opcionales { type, occasion, maxPrice, query, sort }. */
    list: function (filters) {
      var f = filters || {};
      return fetchAll().then(function (all) {
        var out = all.filter(function (p) { return matches(p, f); });
        return out.sort(sorters[f.sort] || sorters.destacados);
      });
    },

    getBySlug: function (slug) {
      return fetchAll().then(function (all) {
        return all.find(function (p) { return p.slug === slug; }) || null;
      });
    },

    getById: function (id) {
      return fetchAll().then(function (all) {
        return all.find(function (p) { return p.id === id; }) || null;
      });
    },

    /** Relacionados: misma ocasión primero, después mismo tipo. */
    related: function (product, limit) {
      return fetchAll().then(function (all) {
        var others = all.filter(function (p) { return p.id !== product.id; });
        others.sort(function (a, b) {
          var sa = (a.occasion === product.occasion ? 2 : 0) + (a.type === product.type ? 1 : 0);
          var sb = (b.occasion === product.occasion ? 2 : 0) + (b.type === product.type ? 1 : 0);
          return sb - sa;
        });
        return others.slice(0, limit || 4);
      });
    },

    priceRange: function () {
      return fetchAll().then(function (all) {
        var prices = all.map(function (p) { return p.price; });
        return { min: Math.min.apply(null, prices), max: Math.max.apply(null, prices) };
      });
    },

    /** Precio final de una combinación de opciones { size: "25x25", ... }. */
    priceFor: function (product, selection) {
      var total = product.price;
      (product.options || []).forEach(function (opt) {
        var chosen = selection && selection[opt.id];
        var val = opt.values.find(function (v) { return v.id === chosen; });
        if (val) total += val.priceDelta || 0;
      });
      return total;
    }
  };
})();
