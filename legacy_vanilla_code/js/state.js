/* ═══════════════════════════════════════════════
   STATE.JS — Cart & wishlist state management
              with sessionStorage persistence
   Timtim by Aritri
═══════════════════════════════════════════════ */

const State = (() => {

  /* ── INTERNAL STATE ─────────────────────── */
  let _cart     = [];
  let _wishlist = [];
  let _coupon   = null;   // { code, discount } | null

  /* ── PERSISTENCE KEYS ───────────────────── */
  const CART_KEY    = 'tt_cart';
  const WISH_KEY    = 'tt_wish';
  const COUPON_KEY  = 'tt_coupon';

  /* ── LOAD FROM STORAGE ──────────────────── */
  function load() {
    try {
      _cart     = JSON.parse(sessionStorage.getItem(CART_KEY))  || [];
      _wishlist = JSON.parse(sessionStorage.getItem(WISH_KEY))  || [];
      _coupon   = JSON.parse(sessionStorage.getItem(COUPON_KEY))|| null;
    } catch (_) {
      _cart = []; _wishlist = []; _coupon = null;
    }
  }

  /* ── SAVE TO STORAGE ────────────────────── */
  function save() {
    sessionStorage.setItem(CART_KEY,   JSON.stringify(_cart));
    sessionStorage.setItem(WISH_KEY,   JSON.stringify(_wishlist));
    sessionStorage.setItem(COUPON_KEY, JSON.stringify(_coupon));
  }

  /* ── CART METHODS ───────────────────────── */
  const cart = {

    getAll() { return [..._cart]; },

    count()  { return _cart.reduce((s, i) => s + i.qty, 0); },

    subtotal() { return _cart.reduce((s, i) => s + i.price * i.qty, 0); },

    shipping() {
      const sub = cart.subtotal();
      return sub >= DATA.freeShippingThreshold ? 0 : DATA.shippingCost;
    },

    discountAmount() {
      if (!_coupon) return 0;
      return Math.round(cart.subtotal() * (_coupon.discount / 100));
    },

    total() {
      return cart.subtotal() + cart.shipping() - cart.discountAmount();
    },

    add(productId, qty = 1) {
      const product = DATA.getProduct(productId);
      if (!product) return false;
      const existing = _cart.find(i => i.id === productId);
      if (existing) {
        existing.qty += qty;
      } else {
        _cart.push({
          id:        product.id,
          name:      product.shortName || product.name,
          price:     product.price,
          emoji:     product.emoji,
          bg:        product.bg,
          qty,
        });
      }
      save();
      return true;
    },

    remove(productId) {
      _cart = _cart.filter(i => i.id !== productId);
      save();
    },

    setQty(productId, qty) {
      const item = _cart.find(i => i.id === productId);
      if (!item) return;
      if (qty <= 0) {
        cart.remove(productId);
      } else {
        item.qty = Math.min(50, qty);
        save();
      }
    },

    changeQty(productId, delta) {
      const item = _cart.find(i => i.id === productId);
      if (!item) return;
      cart.setQty(productId, item.qty + delta);
    },

    clear() {
      _cart = [];
      _coupon = null;
      save();
    },

    isEmpty() { return _cart.length === 0; },
  };

  /* ── WISHLIST METHODS ───────────────────── */
  const wishlist = {

    getAll()    { return [..._wishlist]; },

    has(id)     { return _wishlist.includes(id); },

    toggle(id) {
      const idx = _wishlist.indexOf(id);
      if (idx > -1) {
        _wishlist.splice(idx, 1);
        save();
        return false; // removed
      } else {
        _wishlist.push(id);
        save();
        return true;  // added
      }
    },

    count() { return _wishlist.length; },
  };

  /* ── COUPON METHODS ─────────────────────── */
  const coupon = {

    apply(code) {
      const upperCode = code.trim().toUpperCase();
      const discount  = DATA.promoCodes[upperCode];
      if (!discount) return { success: false, message: 'Invalid promo code' };
      if (_coupon && _coupon.code === upperCode) {
        return { success: false, message: 'Code already applied' };
      }
      _coupon = { code: upperCode, discount };
      save();
      return { success: true, message: `${discount}% discount applied! 🎉` };
    },

    remove() {
      _coupon = null;
      save();
    },

    getActive() { return _coupon; },
  };

  /* ── INIT ───────────────────────────────── */
  load();

  /* ── PUBLIC API ─────────────────────────── */
  return { cart, wishlist, coupon };

})();
