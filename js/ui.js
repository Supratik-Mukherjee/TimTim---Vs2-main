/* ═══════════════════════════════════════════════
   UI.JS — Shared UI utilities
           Toast, reveal, nav badge updates,
           mobile menu, XSS helper
   Timtim by Aritri
═══════════════════════════════════════════════ */

const UI = (() => {

  /* ── TOAST ──────────────────────────────── */
  let _toastTimer;

  function toast(message, duration = 2800) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('show'), duration);
  }

  /* ── FORMAT PRICE ───────────────────────── */
  function formatPrice(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN');
  }

  /* ── XSS ESCAPE ─────────────────────────── */
  function esc(str) {
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#39;');
  }

  /* ── UPDATE NAV BADGES ──────────────────── */
  function updateNavCart() {
    const count = State.cart.count();

    // Count text in button
    const countEl = document.getElementById('cart-count-nav');
    if (countEl) countEl.textContent = count;

    // Badge icon
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle('show', count > 0);
    }
  }

  function updateNavWishlist() {
    const count = State.wishlist.count();
    const btn   = document.getElementById('wishlist-nav-btn');
    const badge = document.getElementById('wish-badge');

    if (btn)   btn.textContent = count > 0 ? '♥' : '♡';
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle('show', count > 0);
    }
  }

  function updateNav() {
    updateNavCart();
    updateNavWishlist();
  }

  /* ── MOBILE NAV ─────────────────────────── */
  function closeMobileNav() {
    const nav   = document.getElementById('mobile-nav');
    const btn   = document.getElementById('hamburger-btn');
    if (nav) nav.classList.remove('open');
    if (btn) {
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  }

  function toggleMobileNav() {
    const nav  = document.getElementById('mobile-nav');
    const btn  = document.getElementById('hamburger-btn');
    if (!nav) return;
    const isOpen = nav.classList.toggle('open');
    if (btn) {
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    }
  }

  /* ── SCROLL REVEAL ──────────────────────── */
  let _revealObserver;

  function initReveal() {
    // Disconnect previous observer if any
    if (_revealObserver) _revealObserver.disconnect();

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal:not(.in)')
        .forEach(el => el.classList.add('in'));
      return;
    }

    _revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            _revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
    );

    // Only observe elements within the active page
    const activePage = document.querySelector('.page.active');
    if (!activePage) return;
    activePage.querySelectorAll('.reveal:not(.in)')
      .forEach(el => _revealObserver.observe(el));
  }

  /* ── PRODUCT CARD HTML ──────────────────── */
  function prodCardHTML(product) {
    const wished = State.wishlist.has(product.id);
    const badgeHTML = product.badges && product.badges.length > 0
      ? `<div class="prod-badge ${product.badges[0]}">${esc(product.badges[0])}</div>`
      : '';

    return `
      <article
        class="prod-card reveal"
        onclick="Router.go('product', { id: ${product.id} })"
        aria-label="${esc(product.shortName || product.name)}"
        role="button"
        tabindex="0"
        onkeydown="if(event.key==='Enter')Router.go('product',{id:${product.id}})"
      >
        <div class="prod-thumb ${esc(product.bg)}">
          ${badgeHTML}
          <div class="prod-thumb-inner" aria-hidden="true">${esc(product.emoji)}</div>
          <div class="prod-actions" onclick="event.stopPropagation()">
            <button
              class="atc-btn"
              onclick="CartPage.addFromCard(${product.id}, this)"
              aria-label="Add ${esc(product.shortName || product.name)} to cart"
            >Add to Cart</button>
            <button
              class="wish-btn${wished ? ' on' : ''}"
              onclick="ProductPage.toggleWishFromCard(${product.id}, this)"
              aria-label="${wished ? 'Remove from' : 'Add to'} wishlist"
            >${wished ? '♥' : '♡'}</button>
          </div>
        </div>
        <p class="prod-name">${esc(product.shortName || product.name)}</p>
        <div class="prod-prices">
          <span class="prod-price">${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="prod-original">${formatPrice(product.originalPrice)}</span>` : ''}
        </div>
      </article>
    `;
  }

  /* ── ANIMATE BUTTON FEEDBACK ────────────── */
  function btnSuccess(btn, text = 'Added ✓', resetText = null, color = 'var(--sage)') {
    if (!btn) return;
    const original     = resetText || btn.textContent;
    const originalBg   = btn.style.background;
    btn.textContent    = text;
    btn.style.background = color;
    btn.disabled       = true;
    setTimeout(() => {
      btn.textContent    = original;
      btn.style.background = originalBg;
      btn.disabled       = false;
    }, 1800);
  }

  return {
    toast,
    formatPrice,
    esc,
    updateNav,
    updateNavCart,
    updateNavWishlist,
    closeMobileNav,
    toggleMobileNav,
    initReveal,
    prodCardHTML,
    btnSuccess,
  };

})();
