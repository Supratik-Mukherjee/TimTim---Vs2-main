/* ═══════════════════════════════════════════════
   DATA.JS — All product, category & static data
   Timtim by Aritri
═══════════════════════════════════════════════ */

export const DATA = {

  /* ── PRODUCTS ─────────────────────────────── */
  products: [],
  legacyProducts: [],

  /* ── CATEGORIES ───────────────────────────── */
  categories: [
    {
      label: 'Candle Waxes',
      sub: 'Soy · Paraffin · Beeswax · Gel',
      emoji: '🕯️',
      bg: 'linear-gradient(135deg,#e8d8c0,#c8a870)',
      large: true,
      scrollTo: 'raw-material',
    },
    {
      label: 'Silicon Moulds',
      sub: 'Floral · Animal · Pillar',
      emoji: '🫙',
      bg: 'linear-gradient(135deg,#d8e8d8,#a8c8a8)',
      scrollTo: 'moulds',
    },
    {
      label: 'Fragrance Oils',
      sub: 'Floral · Fruity · Woody',
      emoji: '🌸',
      bg: 'linear-gradient(135deg,#e8d8d8,#c8a8a8)',
      scrollTo: 'fragrances',
    },
    {
      label: 'Essential Tools',
      sub: 'Thermometers · Needles · More',
      emoji: '🧰',
      bg: 'linear-gradient(135deg,#d8d8e8,#a8a8c8)',
      scrollTo: 'raw-material',
    },
    {
      label: 'Containers',
      sub: 'Tins · Glass · Urli · Dough Bowl',
      emoji: '🫧',
      bg: 'linear-gradient(135deg,#e8e0d0,#c8b890)',
      scrollTo: 'raw-material',
    },
    {
      label: 'Beginner Kits',
      sub: 'All-in-one Starter Sets',
      emoji: '🎁',
      bg: 'linear-gradient(135deg,#d8e8e0,#a8c8b8)',
      scrollTo: 'kits',
    },
  ],

  /* ── TRUST ITEMS ──────────────────────────── */
  trustItems: [
    { icon: '🚚', title: 'Fast Dispatch', sub: 'Within 24 working hours' },
    { icon: '✦', title: 'Premium Quality', sub: 'Lab-tested raw materials' },
    { icon: '📦', title: 'Secure Packaging', sub: 'Unboxing video required' },
    { icon: '💬', title: 'WhatsApp Support', sub: 'Quick help anytime' },
  ],

  /* ── PROMO CODES ──────────────────────────── */
  promoCodes: {
    TIMTIM10: 10,
    ARITRI10: 10,
    CANDLE10: 10,
    FIRST15: 15,
  },

  /* ── SHIPPING (Self-calculated via WhatsApp) ── */
  freeShippingThreshold: 0,
  shippingCost: 0,

  /* ── CONTACT ──────────────────────────────── */
  whatsappNumber: '917044973552',
  email: 'timtimbusiness.in@gmail.com',
  instagram: 'https://www.instagram.com/timtim_by_aritri',
};

/* ── HELPERS ──────────────────────────────────── */

/** Return a product by ID */
DATA.getProduct = function (id) {
  return DATA.products.find(p => p.id === id) || null;
};

/** Return products matching a category name */
DATA.getByCategory = function (cat) {
  return DATA.products.filter(p => p.cat === cat);
};

/** Return related products for a given product ID */
DATA.getRelated = function (id) {
  const product = DATA.getProduct(id);
  if (!product) return [];
  return (product.related || [])
    .map(rid => DATA.getProduct(rid))
    .filter(Boolean);
};

/** Return products to show on home (waxes + fragrances) */
DATA.getHomeWaxes = function () {
  return DATA.getByCategory('Candle Waxes').slice(0, 4);
};

DATA.getHomeFragrances = function () {
  return DATA.getByCategory('Fragrance Oils').slice(0, 6);
};

/* ── FIREBASE INTEGRATION ─────────────────────── */

/** Fetch products from Firestore */
DATA.fetchProducts = async function () {
  if (!window.FB || !window.FB.db) {
    console.warn("Firebase not initialized. Falling back to legacy products data.");
    DATA.products = DATA.legacyProducts;
    return;
  }

  try {
    const snapshot = await window.FB.db.collection('products').get();
    if (snapshot.empty) {
      console.log("No products in Firestore. Using local legacy products.");
      DATA.products = DATA.legacyProducts;
      return;
    }

    const fetched = [];
    snapshot.forEach(doc => {
      fetched.push({ _uid: doc.id, ...doc.data() });
    });

    // Convert string IDs if numeric used before, to maintain compatibility
    fetched.forEach(p => {
      // Legacy app relies on integer IDs for Router properties (`Router.go('product', { id: 1 })`)
      // If we keep Firestore IDs as string, we need to adapt getters to == instead of === or cast.
      if (!p.id) p.id = p._uid; // Use Firestore document ID as the product ID fallback
    });

    DATA.products = fetched;
    console.log(`Successfully fetched ${fetched.length} products from Firebase.`);
  } catch (error) {
    console.error("Error fetching products from Firebase:", error);
    // Fallback on error
    DATA.products = DATA.legacyProducts;
    throw error;
  }
};

/**
 * Migration helper function: run this ONCE from your browser console 
 * to upload the legacy static products to your new Firestore database.
 * Usage: DATA.seedFirestore() 
 */
DATA.seedFirestore = async function () {
  if (!window.FB || !window.FB.db) {
    console.error("Firebase not initialized.");
    return;
  }
  let successCount = 0;
  for (const item of DATA.legacyProducts) {
    try {
      // Create a document using the item's numeric ID as string for continuity
      await window.FB.db.collection('products').doc(item.id.toString()).set(item);
      successCount++;
    } catch (e) {
      console.error("Error writing document", e);
    }
  }
  console.log(`Seeding complete: ${successCount}/${DATA.legacyProducts.length} added to Firestore`);
};
