/* ═══════════════════════════════════════════════
   SHOP.JS — Dynamic Shop page rendering
   Timtim by Aritri
═══════════════════════════════════════════════ */

const ShopPage = (() => {

  let _currentCat = 'all';

  function renderFilters() {
    const bar = document.getElementById('shop-filter-bar');
    if (!bar) return;

    // We can extract unique categories from DATA or just hardcode
    const cats = ['all'].concat(DATA.categories.map(c => c.label));
    
    bar.innerHTML = cats.map(cat => {
      const label = cat === 'all' ? 'All Products' : cat;
      const isActive = cat === _currentCat ? 'active' : '';
      return `<button class="filter-btn ${isActive}" onclick="ShopPage.setCategory('${UI.esc(cat)}')">${UI.esc(label)}</button>`;
    }).join('');
  }

  function renderGrid() {
    const grid = document.getElementById('shop-grid');
    const title = document.getElementById('shop-title');
    if (!grid) return;

    let products = DATA.products;
    if (_currentCat !== 'all') {
      products = DATA.getByCategory(_currentCat);
      if (title) title.textContent = _currentCat;
    } else {
      if (title) title.textContent = 'Shop All';
    }

    if (products.length === 0) {
      grid.innerHTML = '<p style="text-align:center;width:100%;grid-column:1/-1;">No products found in this category.</p>';
      return;
    }

    grid.innerHTML = products.map(p => UI.prodCardHTML(p)).join('');
    setTimeout(UI.initReveal, 50);
  }

  function setCategory(cat) {
    _currentCat = cat;
    renderFilters();
    renderGrid();
  }

  function onEnter(params = {}) {
    if (params.cat) {
      _currentCat = params.cat;
    } else {
      _currentCat = 'all';
    }
    renderFilters();
    renderGrid();
  }

  return { onEnter, setCategory };

})();
