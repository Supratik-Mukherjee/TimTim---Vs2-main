/* ═══════════════════════════════════════════════
   APP.JS — Main entry point
            Registers pages, wires nav events,
            boots the application
   Timtim by Aritri
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── REGISTER PAGES ─────────────────────── */
  Router.register('home',     { onEnter: HomePage.onEnter });
  Router.register('shop',     { onEnter: ShopPage.onEnter });
  Router.register('product',  { onEnter: ProductPage.onEnter });
  Router.register('cart',     { onEnter: CartPage.onEnter });
  Router.register('checkout', { onEnter: CheckoutPage.onEnter });
  Router.register('success',  { onEnter: CheckoutPage.onSuccessEnter });

  /* ── NAV LOGO ───────────────────────────── */
  document.getElementById('nav-logo-btn')
    ?.addEventListener('click', () => Router.go('home'));

  /* ── HAMBURGER ──────────────────────────── */
  document.getElementById('hamburger-btn')
    ?.addEventListener('click', UI.toggleMobileNav);

  /* ── CART BUTTON ────────────────────────── */
  document.getElementById('nav-cart-btn')
    ?.addEventListener('click', () => Router.go('cart'));

  /* ── WISHLIST BUTTON ────────────────────── */
  document.getElementById('wishlist-nav-btn')
    ?.addEventListener('click', () => {
      const count = State.wishlist.count();
      UI.toast(count > 0 ? `Wishlist: ${count} item${count !== 1 ? 's' : ''}` : 'Your wishlist is empty');
    });

  /* ── INITIAL NAV STATE ──────────────────── */
  UI.updateNav();

  /* ── BOOT HOME PAGE ─────────────────────── */
  DATA.fetchProducts().then(() => {
    // Hide loading screen
    const loading = document.getElementById('app-loading');
    if (loading) {
      loading.style.opacity = '0';
      setTimeout(() => loading.remove(), 600);
    }
    const hash = window.location.hash.replace('#', '');
    if (hash && typeof Router !== 'undefined') {
      Router.go(hash === 'shop' ? 'shop' : 'home');
    } else {
      Router.go('home');
    }
  }).catch(err => {
    console.error("Firebase fetch failed or not configured", err);
    // Fallback to local load if Firebase fails
    const loading = document.getElementById('app-loading');
    if (loading) loading.style.opacity = '0';
    Router.go('home');
  });

});
