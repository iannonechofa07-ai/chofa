/* ==========================================================================
   Carrito — estado persistente en localStorage con suscripción a cambios.

   Cada línea se identifica por producto + variantes + personalización,
   así dos álbumes iguales con distinto nombre en tapa son líneas distintas.
   Los precios se guardan al momento de agregar (como hace un checkout real)
   pero se pueden revalidar contra el catálogo antes de pagar.
   ========================================================================== */
(function () {
  "use strict";

  var A = (window.AMARE = window.AMARE || {});
  var KEY = (A.config && A.config.cartStorageKey) || "amare.cart.v1";
  var listeners = [];

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var data = raw ? JSON.parse(raw) : null;
      if (data && Array.isArray(data.items)) return data;
    } catch (e) { /* storage bloqueado o JSON inválido */ }
    return { items: [], coupon: null };
  }

  var state = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* modo privado */ }
  }

  function emit(event) {
    save();
    listeners.forEach(function (fn) {
      try { fn(api.snapshot(), event || {}); } catch (e) { console.error(e); }
    });
  }

  function lineKey(item) {
    var opts = Object.keys(item.options || {}).sort().map(function (k) { return k + "=" + item.options[k]; }).join("&");
    return [item.productId, opts, (item.personalization || "").trim().toLowerCase()].join("|");
  }

  // Sincroniza entre pestañas abiertas.
  window.addEventListener("storage", function (e) {
    if (e.key === KEY) { state = load(); emit({ type: "sync" }); }
  });

  var api = {
    /**
     * item: { productId, slug, name, type, image, unitPrice, qty,
     *         options: {size:"25x25"}, optionLabels: ["25 × 25 cm", ...],
     *         personalization }
     */
    add: function (item) {
      var key = lineKey(item);
      var existing = state.items.find(function (i) { return i.key === key; });
      var qty = Math.max(1, parseInt(item.qty, 10) || 1);
      if (existing) {
        existing.qty = Math.min(20, existing.qty + qty);
      } else {
        state.items.push(Object.assign({}, item, { key: key, qty: qty }));
      }
      emit({ type: "add", key: key });
    },

    setQty: function (key, qty) {
      var line = state.items.find(function (i) { return i.key === key; });
      if (!line) return;
      qty = parseInt(qty, 10) || 0;
      if (qty <= 0) return api.remove(key);
      line.qty = Math.min(20, qty);
      emit({ type: "qty", key: key });
    },

    remove: function (key) {
      state.items = state.items.filter(function (i) { return i.key !== key; });
      emit({ type: "remove", key: key });
    },

    clear: function () {
      state = { items: [], coupon: null };
      emit({ type: "clear" });
    },

    applyCoupon: function (code) {
      var c = A.config && A.config.newsletterCoupon;
      if (c && code && code.trim().toUpperCase() === c.code) {
        state.coupon = { code: c.code, percent: c.percent };
        emit({ type: "coupon" });
        return true;
      }
      return false;
    },

    removeCoupon: function () {
      state.coupon = null;
      emit({ type: "coupon" });
    },

    count: function () {
      return state.items.reduce(function (n, i) { return n + i.qty; }, 0);
    },

    subtotal: function () {
      return state.items.reduce(function (n, i) { return n + i.unitPrice * i.qty; }, 0);
    },

    discount: function () {
      return state.coupon ? Math.round(api.subtotal() * state.coupon.percent / 100) : 0;
    },

    needsShipping: function () {
      return state.items.some(function (i) { return i.type === "fisico"; });
    },

    /** Costo de envío para una zona; 0 si no hay físicos o si supera el mínimo. */
    shippingFor: function (zoneId) {
      if (!api.needsShipping()) return 0;
      var cfg = A.config.shipping;
      if (api.subtotal() - api.discount() >= cfg.freeFrom) return 0;
      var zone = cfg.zones.find(function (z) { return z.id === zoneId; });
      return zone ? zone.price : 0;
    },

    snapshot: function () {
      return {
        items: state.items.map(function (i) { return Object.assign({}, i); }),
        coupon: state.coupon,
        count: api.count(),
        subtotal: api.subtotal(),
        discount: api.discount()
      };
    },

    subscribe: function (fn) {
      listeners.push(fn);
      return function () { listeners = listeners.filter(function (l) { return l !== fn; }); };
    }
  };

  A.cart = api;
})();
