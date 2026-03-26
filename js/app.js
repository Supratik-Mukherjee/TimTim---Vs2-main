/* ═══════════════════════════════════════════════
   APP.JS — Main entry point
            Registers pages, wires nav events,
            boots the application
   Timtim by Aritri
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── REGISTER PAGES ─────────────────────── */
  Router.register('home',     { onEnter: HomePage.onEnter });
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
  Router.go('home');

});
