/* ═══════════════════════════════════════════════
   PRODUCT.JS — Product detail page logic
                Gallery, info, qty, tabs,
                wishlist, related products
   Timtim by Aritri
═══════════════════════════════════════════════ */

const ProductPage = (() => {

  let _currentId  = null;
  let _currentQty = 1;

  /* ── ENTER HOOK ─────────────────────────── */
  function onEnter({ id } = {}) {
    if (!id) return;
    _currentId  = id;
    _currentQty = 1;

    const product = DATA.getProduct(id);
    if (!product) {
      UI.toast('Product not found');
      Router.go('home');
      return;
    }

    renderBreadcrumb(product);
    renderGallery(product);
    renderInfo(product);
    renderSpecs(product);
    renderActions(product);
    renderTabContent(product);
    renderRelated(product);
    resetTabs();
    setTimeout(UI.initReveal, 50);
  }

  /* ── BREADCRUMB ─────────────────────────── */
  function renderBreadcrumb(product) {
    const catEl  = document.getElementById('pd-cat-crumb');
    const nameEl = document.getElementById('pd-name-crumb');
    if (catEl)  catEl.textContent  = product.cat;
    if (nameEl) nameEl.textContent = product.shortName || product.name;
  }

  /* ── GALLERY ────────────────────────────── */
  function renderGallery(product) {
    const mainEl  = document.getElementById('pd-main-img');
    const thumbEl = document.getElementById('pd-thumbs');
    if (!mainEl || !thumbEl) return;

    // Set main image
    mainEl.className = 'pd-main-img ' + product.bg;
    mainEl.innerHTML = `<span aria-hidden="true">${UI.esc(product.emoji)}</span>`;

    // Thumb set (main + 2 dummy variants)
    const thumbEmojis = [product.emoji, '🕯️', '📦'];
    thumbEl.innerHTML = thumbEmojis.map((em, i) => `
      <div
        class="pd-thumb ${product.bg}${i === 0 ? ' active' : ''}"
        onclick="ProductPage._selectThumb(this)"
        aria-label="Product image ${i + 1}"
        role="button"
        tabindex="0"
      >${UI.esc(em)}</div>
    `).join('');
  }

  function _selectThumb(btn) {
    btn.closest('.pd-thumbs')
      .querySelectorAll('.pd-thumb')
      .forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  }

  /* ── INFO PANEL ─────────────────────────── */
  function renderInfo(product) {
    // Badges
    const badgeRow = document.getElementById('pd-badges');
    if (badgeRow) {
      const badgeLabels = { sale: 'Sale', popular: 'Popular', new: 'New' };
      badgeRow.innerHTML = (product.badges || [])
        .map(b => `<span class="pd-badge ${UI.esc(b)}">${UI.esc(badgeLabels[b] || b)}</span>`)
        .join('');
    }

    // Name, code, description
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setText('pd-name', product.name);
    setText('pd-code', `SKU: ${product.sku} · ${product.cat}`);
    setText('pd-desc', product.desc);

    // Pricing
    const priceEl    = document.getElementById('pd-price');
    const origEl     = document.getElementById('pd-original');
    const saveEl     = document.getElementById('pd-save');
    if (priceEl) priceEl.textContent = UI.formatPrice(product.price);
    if (origEl) {
      origEl.textContent = product.originalPrice ? UI.formatPrice(product.originalPrice) : '';
      origEl.style.display = product.originalPrice ? '' : 'none';
    }
    if (saveEl) {
      const saved = product.originalPrice ? product.originalPrice - product.price : 0;
      saveEl.textContent = saved > 0 ? `Save ${UI.formatPrice(saved)}` : '';
      saveEl.style.display = saved > 0 ? '' : 'none';
    }

    // Reset qty
    const qtyEl = document.getElementById('pd-qty');
    if (qtyEl) { qtyEl.value = 1; _currentQty = 1; }
  }

  /* ── SPECS ──────────────────────────────── */
  function renderSpecs(product) {
    const grid = document.getElementById('pd-specs');
    if (!grid) return;
    grid.innerHTML = (product.specs || []).map(s => `
      <div class="pd-spec">
        <label>${UI.esc(s.label)}</label>
        <span>${UI.esc(s.value)}</span>
      </div>
    `).join('');
  }

  /* ── ACTIONS (wishlist btn state) ───────── */
  function renderActions(product) {
    const wishBtn = document.getElementById('pd-wish-btn');
    if (!wishBtn) return;
    const wished = State.wishlist.has(product.id);
    wishBtn.textContent = wished ? '♥' : '♡';
    wishBtn.classList.toggle('on', wished);
    wishBtn.setAttribute('aria-label', wished ? 'Remove from wishlist' : 'Add to wishlist');
  }

  /* ── TAB CONTENT ────────────────────────── */
  function renderTabContent(product) {
    const descEl  = document.getElementById('tab-desc-content');
    const usageEl = document.getElementById('tab-usage-content');

    if (descEl) {
      descEl.innerHTML = `
        <h4>About This Product</h4>
        <p>${UI.esc(product.desc)}</p>
      `;
    }
    if (usageEl) {
      usageEl.innerHTML = product.usage || '<p>Usage information coming soon.</p>';
    }
  }

  /* ── RELATED PRODUCTS ───────────────────── */
  function renderRelated(product) {
    const grid = document.getElementById('related-grid');
    if (!grid) return;
    const related = DATA.getRelated(product.id).slice(0, 4);
    grid.innerHTML = related.map(p => UI.prodCardHTML(p)).join('');
  }

  /* ── RESET TABS ─────────────────────────── */
  function resetTabs() {
    document.querySelectorAll('.pd-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.pd-tab-panel').forEach(p => p.classList.remove('active'));
    const firstBtn = document.querySelector('.pd-tab-btn');
    const firstPanel = document.getElementById('tab-desc');
    if (firstBtn)  firstBtn.classList.add('active');
    if (firstPanel)firstPanel.classList.add('active');
  }

  /* ── TAB SWITCHING ──────────────────────── */
  function switchTab(btn, panelId) {
    document.querySelectorAll('.pd-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.pd-tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
  }

  /* ── QUANTITY CONTROL ───────────────────── */
  function changeQty(delta) {
    _currentQty = Math.max(1, Math.min(50, _currentQty + delta));
    const el = document.getElementById('pd-qty');
    if (el) el.value = _currentQty;
  }

  /* ── ADD TO CART ────────────────────────── */
  function addToCart() {
    if (!_currentId) return;
    const product = DATA.getProduct(_currentId);
    if (!product) return;
    State.cart.add(_currentId, _currentQty);
    UI.updateNav();
    UI.toast(`Added to cart: ${product.shortName || product.name}`);

    const btn = document.getElementById('pd-atc-btn');
    UI.btnSuccess(btn, 'Added ✓', 'Add to Cart');
  }

  /* ── TOGGLE WISHLIST (detail page) ─────── */
  function toggleWish() {
    if (!_currentId) return;
    const added = State.wishlist.toggle(_currentId);
    renderActions(DATA.getProduct(_currentId));
    UI.updateNavWishlist();
    UI.toast(added ? 'Added to wishlist ♥' : 'Removed from wishlist');
  }

  /* ── TOGGLE WISHLIST (from product card) ── */
  function toggleWishFromCard(id, btn) {
    const added = State.wishlist.toggle(id);
    btn.textContent = added ? '♥' : '♡';
    btn.classList.toggle('on', added);
    btn.setAttribute('aria-label', added ? 'Remove from wishlist' : 'Add to wishlist');
    UI.updateNavWishlist();
    UI.toast(added ? 'Added to wishlist ♥' : 'Removed from wishlist');
  }

  return {
    onEnter,
    switchTab,
    changeQty,
    addToCart,
    toggleWish,
    toggleWishFromCard,
    _selectThumb,
  };

})();
