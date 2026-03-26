/* ═══════════════════════════════════════════════
   HOME.JS — Home page rendering
             Hero, Categories, Wax grid,
             Fragrances, Footer year
   Timtim by Aritri
═══════════════════════════════════════════════ */

const HomePage = (() => {

  /* ── RENDER CATEGORY GRID ───────────────── */
  function renderCategories() {
    const grid = document.getElementById('cat-grid');
    if (!grid) return;

    grid.innerHTML = DATA.categories.map((cat, i) => `
      <div
        class="cat-card reveal${cat.large ? ' cat-large' : ''}"
        style="background:${cat.bg}"
        onclick="Router.scrollToSection('${UI.esc(cat.scrollTo)}')"
        role="button"
        tabindex="0"
        aria-label="Browse ${UI.esc(cat.label)}"
        onkeydown="if(event.key==='Enter')Router.scrollToSection('${UI.esc(cat.scrollTo)}')"
      >
        <div class="cat-inner">${UI.esc(cat.emoji)}</div>
        <div class="cat-overlay">
          <h3>${UI.esc(cat.label)}</h3>
          <span>${UI.esc(cat.sub)}</span>
        </div>
      </div>
    `).join('');
  }

  /* ── RENDER WAX PRODUCTS GRID ───────────── */
  function renderWaxes() {
    const grid = document.getElementById('wax-grid');
    if (!grid) return;
    grid.innerHTML = DATA.getHomeWaxes().map(p => UI.prodCardHTML(p)).join('');
  }

  /* ── RENDER FRAGRANCE ROW ───────────────── */
  function renderFragrances() {
    const grid = document.getElementById('frag-grid');
    if (!grid) return;

    grid.innerHTML = DATA.getHomeFragrances().map(f => `
      <div
        class="frag-card reveal"
        onclick="Router.go('product', { id: ${f.id} })"
        role="button"
        tabindex="0"
        aria-label="${UI.esc(f.shortName || f.name)}"
        onkeydown="if(event.key==='Enter')Router.go('product',{id:${f.id}})"
      >
        <div class="frag-img ${UI.esc(f.bg)}">${UI.esc(f.emoji)}</div>
        <h4>${UI.esc(f.shortName || f.name)}</h4>
        <span class="frag-price">from ${UI.formatPrice(f.price)}</span>
      </div>
    `).join('');
  }

  /* ── SET FOOTER YEAR ────────────────────── */
  function setFooterYear() {
    const el = document.getElementById('foot-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── SETUP NEWSLETTER FORM ──────────────── */
  function setupNewsletter() {
    const form = document.getElementById('nl-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !input.value.trim()) return;
      UI.toast('🎉 Subscribed! Welcome to the family.');
      input.value = '';
    });
  }

  /* ── ENTER HOOK ─────────────────────────── */
  function onEnter() {
    renderCategories();
    renderWaxes();
    renderFragrances();
    setFooterYear();
    setupNewsletter();
    setTimeout(UI.initReveal, 50);
  }

  return { onEnter };

})();
