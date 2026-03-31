/* ═══════════════════════════════════════════════
   CART.JS — Cart page rendering and interactions
   Timtim by Aritri
═══════════════════════════════════════════════ */

const CartPage = (() => {

  /* ── ENTER HOOK ─────────────────────────── */
  function onEnter() {
    render();
  }

  /* ── FULL RENDER ────────────────────────── */
  function render() {
    renderItems();
    renderSummary();
  }

  /* ── RENDER ITEMS COLUMN ────────────────── */
  function renderItems() {
    const col = document.getElementById('cart-items-col');
    if (!col) return;

    const items     = State.cart.getAll();
    const subtitle  = document.getElementById('cart-subtitle');
    const ctaBtn    = document.getElementById('checkout-cta-btn');

    if (State.cart.isEmpty()) {
      if (subtitle) subtitle.textContent = 'Your cart is empty';
      if (ctaBtn) { ctaBtn.disabled = true; }

      col.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-ico" aria-hidden="true">🛒</div>
          <p>Your cart is empty</p>
          <button class="btn-dark" onclick="Router.go('home')">Start Shopping</button>
        </div>
      `;
      return;
    }

    const count = State.cart.count();
    if (subtitle) subtitle.textContent = `${count} item${count !== 1 ? 's' : ''} in your cart`;
    if (ctaBtn)   ctaBtn.disabled = false;

    col.innerHTML = `
      <div class="cart-items-list" role="list">
        ${items.map(item => _itemHTML(item)).join('')}
      </div>
    `;
  }

  /* ── SINGLE ITEM HTML ───────────────────── */
  function _itemHTML(item) {
    return `
      <div class="cart-item-row" role="listitem" id="cart-item-${item.id}">
        <div class="cart-item-img ${UI.esc(item.bg)}" aria-hidden="true">${UI.esc(item.emoji)}</div>
        <div>
          <p class="ci-name"
             onclick="Router.go('product',{id:${item.id}})"
             title="View product">${UI.esc(item.name)}</p>
          <p class="ci-unit-price">${UI.formatPrice(item.price)} each</p>
          <div class="ci-qty-ctrl" role="group" aria-label="Quantity for ${UI.esc(item.name)}">
            <button class="ci-qty-btn"
              onclick="CartPage.changeQty(${item.id}, -1)"
              aria-label="Decrease quantity">−</button>
            <span class="ci-qty-val" aria-live="polite">${item.qty}</span>
            <button class="ci-qty-btn"
              onclick="CartPage.changeQty(${item.id}, 1)"
              aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="ci-price-col">
          <span class="ci-price">${UI.formatPrice(item.price * item.qty)}</span>
          <button class="ci-remove"
            onclick="CartPage.removeItem(${item.id})"
            aria-label="Remove ${UI.esc(item.name)}">Remove</button>
        </div>
      </div>
    `;
  }

  /* ── RENDER SUMMARY ─────────────────────── */
  function renderSummary() {
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    const subtotal = State.cart.subtotal();
    const shipping = State.cart.shipping();
    const discount = State.cart.discountAmount();
    const total    = State.cart.total();
    const coupon   = State.coupon.getActive();

    setText('os-subtotal', UI.formatPrice(subtotal));
    setText('os-shipping', shipping === 0 ? 'Free 🎉' : UI.formatPrice(shipping));
    setText('os-discount', discount > 0 ? `−${UI.formatPrice(discount)}` : '₹0');
    setText('os-total',    UI.formatPrice(total));

    // Colour discount row
    const discRow = document.getElementById('os-discount');
    if (discRow) discRow.style.color = discount > 0 ? 'var(--sage)' : '';

    // Coupon input hint
    const couponInput = document.getElementById('coupon-input');
    if (couponInput && coupon) {
      couponInput.value       = coupon.code;
      couponInput.disabled    = true;
      couponInput.style.color = 'var(--sage)';
    }

    // Shipping note
    const note = document.getElementById('os-shipping-note');
    if (note) {
      if (shipping === 0) {
        note.textContent = '✓ Free shipping applied';
        note.style.color = 'var(--sage)';
      } else {
        const remaining = DATA.freeShippingThreshold - subtotal;
        note.textContent = `Add ${UI.formatPrice(remaining)} more for free shipping`;
        note.style.color = 'var(--warm-gray)';
      }
    }
  }

  /* ── ACTIONS ────────────────────────────── */
  function changeQty(productId, delta) {
    State.cart.changeQty(productId, delta);
    UI.updateNav();
    render();
  }

  function removeItem(productId) {
    State.cart.remove(productId);
    UI.updateNav();
    render();
    UI.toast('Item removed from cart');
  }

  function applyCoupon() {
    const input = document.getElementById('coupon-input');
    if (!input) return;
    const result = State.coupon.apply(input.value);
    UI.toast(result.message);
    if (result.success) renderSummary();
  }

  /* ── ADD FROM PRODUCT CARD ──────────────── */
  function addFromCard(productId, btn) {
    State.cart.add(productId, 1);
    UI.updateNav();
    const p = DATA.getProduct(productId);
    UI.toast(`Added: ${p ? (p.shortName || p.name) : 'Product'}`);
    UI.btnSuccess(btn, 'Added ✓', 'Add to Cart');
  }

  return {
    onEnter,
    render,
    changeQty,
    removeItem,
    applyCoupon,
    addFromCard,
  };

})();
