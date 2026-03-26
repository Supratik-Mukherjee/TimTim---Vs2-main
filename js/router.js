/* ═══════════════════════════════════════════════
   ROUTER.JS — SPA page navigation system
   Timtim by Aritri
═══════════════════════════════════════════════ */

const Router = (() => {

  let _currentPage   = 'home';
  let _currentParams = {};

  /* ── PAGE REGISTRY ──────────────────────── */
  // Each entry: { onEnter: fn(params) }
  const _pages = {};

  /* ── REGISTER A PAGE ────────────────────── */
  function register(pageId, { onEnter } = {}) {
    _pages[pageId] = { onEnter };
  }

  /* ── NAVIGATE ───────────────────────────── */
  function go(pageId, params = {}) {
    // Deactivate current page
    const prevEl = document.getElementById('page-' + _currentPage);
    if (prevEl) prevEl.classList.remove('active');

    // Activate next page
    const nextEl = document.getElementById('page-' + pageId);
    if (!nextEl) {
      console.warn(`Router: page "${pageId}" not found in DOM`);
      return;
    }

    _currentPage   = pageId;
    _currentParams = params;

    nextEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile nav if open
    UI.closeMobileNav();

    // Run page's onEnter hook
    const def = _pages[pageId];
    if (def && typeof def.onEnter === 'function') {
      def.onEnter(params);
    }
  }

  /* ── SCROLL TO SECTION ON HOME ──────────── */
  function scrollToSection(sectionId) {
    if (_currentPage !== 'home') {
      go('home');
      // Wait for page animation then scroll
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 340);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ── GETTERS ────────────────────────────── */
  function currentPage()   { return _currentPage; }
  function currentParams() { return { ..._currentParams }; }

  return { register, go, scrollToSection, currentPage, currentParams };

})();
