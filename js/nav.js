// ── SHARED NAV & FOOTER ──────────────────────────────────────────
// Injects the nav and footer into every page automatically

const Nav = (() => {

  function currentPage() {
    const p = location.pathname.split('/').pop() || 'index.html';
    return p;
  }

  function inject() {
    // ── Announcement bar
    const ann = document.querySelector('.announcement');
    if (ann) ann.innerHTML = '✦ Free shipping on orders above ₹999 &nbsp;·&nbsp; 24hr dispatch &nbsp;·&nbsp; Pan India delivery ✦';

    // ── Nav
    const nav = document.querySelector('.site-nav .nav-inner');
    if (nav) {
      const page = currentPage();
      nav.innerHTML = `
        <a class="nav-logo" href="index.html" aria-label="Timtim by Aritri — Go to homepage">
          Timtim <span>by</span> Aritri
        </a>
        <ul class="nav-links" aria-label="Site sections">
          <li><a href="index.html" ${page==='index.html'?'class="active"':''}>Shop</a></li>
          <li><a href="about.html" ${page==='about.html'?'class="active"':''}>About</a></li>
          <li><a href="contact.html" ${page==='contact.html'?'class="active"':''}>Contact</a></li>
        </ul>
        <div class="nav-actions">
          <a class="nav-icon-btn" href="login.html" aria-label="Account">👤</a>
          <button class="nav-icon-btn" id="wishlist-nav-btn" aria-label="Wishlist">
            ♡ <span class="nav-badge" id="wish-badge" aria-hidden="true">0</span>
          </button>
          <a class="nav-icon-btn" href="cart.html" aria-label="Open cart">
            🛒 <span class="nav-badge" id="cart-badge" aria-hidden="true">0</span>
          </a>
          <a class="nav-cart-btn" href="cart.html" aria-label="Open cart">
            Cart (<span id="cart-count-nav">0</span>)
          </a>
          <button class="hamburger" id="hamburger-btn"
            aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobile-nav">
            <span></span><span></span><span></span>
          </button>
        </div>
      `;
    }

    // ── Mobile nav
    const mob = document.getElementById('mobile-nav');
    if (mob) {
      mob.innerHTML = `
        <a class="mobile-nav-link" href="index.html">Shop All</a>
        <a class="mobile-nav-link" href="about.html">About Us</a>
        <a class="mobile-nav-link" href="contact.html">Contact</a>
        <a class="mobile-nav-link" href="login.html">👤 My Account</a>
        <a class="mobile-nav-link" href="cart.html">🛒 Cart (<span id="mobile-cart-count">0</span>)</a>
      `;
    }

    // ── Hamburger toggle
    const ham = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    if (ham && mobileNav) {
      ham.addEventListener('click', () => {
        const open = mobileNav.classList.toggle('open');
        ham.setAttribute('aria-expanded', open);
      });
    }

    // ── Update cart badges from sessionStorage
    updateBadges();
  }

  function updateBadges() {
    try {
      const cart = JSON.parse(sessionStorage.getItem('tt_cart') || '[]');
      const wish = JSON.parse(sessionStorage.getItem('tt_wish') || '[]');
      const count = cart.reduce((s, i) => s + (i.qty || 1), 0);
      ['cart-badge', 'cart-count-nav', 'mobile-cart-count'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = count;
      });
      const wb = document.getElementById('wish-badge');
      if (wb) wb.textContent = wish.length;
    } catch(e) {}
  }

  return { inject, updateBadges };
})();

document.addEventListener('DOMContentLoaded', Nav.inject);
