/* ═══════════════════════════════════════════════
   DATA.JS — All product, category & static data
   Timtim by Aritri
═══════════════════════════════════════════════ */

const DATA = {

  /* ── PRODUCTS ─────────────────────────────── */
  products: [
    {
      id: 1,
      name: 'Soy Wax — Pure White WP565',
      shortName: 'Soy Wax WP565',
      price: 295,
      sku: 'WP565',
      cat: 'Candle Waxes',
      emoji: '🫙',
      bg: 'c-wax',
      badges: ['popular'],
      desc: 'Our best-selling soy wax, specially formulated for container candles. WP565 offers a clean, smooth finish with excellent fragrance throw and natural white colour. Sourced from non-GMO soybeans.',
      specs: [
        { label: 'Type',          value: 'Container Soy Wax' },
        { label: 'Melt Point',    value: '46–49 °C' },
        { label: 'Fragrance Load',value: 'Up to 10%' },
        { label: 'Pack Sizes',    value: '500g / 1kg / 5kg' },
        { label: 'Colour',        value: 'Natural White' },
        { label: 'Origin',        value: 'USA / India' },
      ],
      usage: `<h4>How to Use</h4>
        <p>Melt WP565 at 75–80 °C using a double boiler. Add fragrance at 65–70 °C and stir for 2 minutes. Pour into containers at 55–60 °C. Allow 24 hours cure time before burning.</p>
        <ul>
          <li>Use cotton or wood wicks for best results</li>
          <li>Fragrance load: 6–10% recommended</li>
          <li>Container temperature should be 25–30 °C before pouring</li>
          <li>Allow at least 48 hours before first burn</li>
        </ul>`,
      related: [2, 3, 4],
    },
    {
      id: 2,
      name: 'Soy Wax Pillar WP666',
      shortName: 'Pillar Wax WP666',
      price: 290,
      sku: 'WP666',
      cat: 'Candle Waxes',
      emoji: '🕯️',
      bg: 'c-amber',
      badges: [],
      desc: 'Formulated for free-standing pillar and mould candles. WP666 has a higher melt point for shape retention and gives a beautiful rustic, natural look when cooled.',
      specs: [
        { label: 'Type',          value: 'Pillar / Mould Soy Wax' },
        { label: 'Melt Point',    value: '58–62 °C' },
        { label: 'Fragrance Load',value: 'Up to 8%' },
        { label: 'Pack Sizes',    value: '500g / 1kg / 5kg' },
        { label: 'Colour',        value: 'Off-White / Creamy' },
        { label: 'Finish',        value: 'Matte Rustic' },
      ],
      usage: `<h4>How to Use</h4>
        <p>Melt at 85–90 °C. Add fragrance at 75 °C and stir well. Pour into silicon moulds at 65–70 °C. Allow full 48 hours curing before unmoulding.</p>
        <ul>
          <li>Ideal for pillar, taper, and novelty moulds</li>
          <li>Use 6–8% fragrance load maximum</li>
          <li>Lightly heat mould before pouring to avoid air pockets</li>
          <li>Do not refrigerate — allow room temperature cooling</li>
        </ul>`,
      related: [1, 3, 5],
    },
    {
      id: 3,
      name: 'Pearl Wax WP20',
      shortName: 'Pearl Wax WP20',
      price: 330,
      sku: 'WP20',
      cat: 'Candle Waxes',
      emoji: '🌿',
      bg: 'c-fragrance',
      badges: ['sale'],
      originalPrice: 500,
      desc: 'Unique granular pearl wax creates stunning "snow" and "rocky road" textured candles. Fill any container — no melting required! Perfect for beginners and visual art candles.',
      specs: [
        { label: 'Type',          value: 'Granular / Pearl Wax' },
        { label: 'Fragrance Load',value: 'Up to 5%' },
        { label: 'Pack Sizes',    value: '500g / 1kg' },
        { label: 'Colour',        value: 'Natural White' },
        { label: 'Use',           value: 'No-melt Container Filling' },
        { label: 'Difficulty',    value: 'Beginner Friendly' },
      ],
      usage: `<h4>How to Use</h4>
        <p>Pearl wax can be used directly without melting. Mix fragrance oil with the granules (up to 5%), toss well and fill your container. Insert a wick and you're done!</p>
        <ul>
          <li>Mix fragrance oil before filling container</li>
          <li>Toss / shake well to coat granules evenly</li>
          <li>For coloured pearls, add candle dye flakes</li>
          <li>Ideal for layered, textured or ombre effects</li>
        </ul>`,
      related: [1, 4, 6],
    },
    {
      id: 4,
      name: 'Beeswax WP355',
      shortName: 'Beeswax WP355',
      price: 160,
      sku: 'WP355',
      cat: 'Candle Waxes',
      emoji: '🍯',
      bg: 'c-wick',
      badges: ['new'],
      desc: '100% pure natural beeswax sourced from ethical apiaries. Burns slower and cleaner than paraffin, with a naturally warm honey scent. Ideal for tapers, votives, and organic candles.',
      specs: [
        { label: 'Type',          value: 'Pure Beeswax' },
        { label: 'Melt Point',    value: '62–65 °C' },
        { label: 'Fragrance Load',value: 'Up to 6%' },
        { label: 'Pack Sizes',    value: '100g / 500g / 1kg' },
        { label: 'Colour',        value: 'Natural Yellow' },
        { label: 'Scent',         value: 'Natural Honey' },
      ],
      usage: `<h4>How to Use</h4>
        <p>Melt beeswax slowly at 80–85 °C using a double boiler. Beeswax thickens quickly so work fast. Pour into moulds or containers at 70 °C.</p>
        <ul>
          <li>No additives needed — burns beautifully as-is</li>
          <li>Blend with soy wax for softer texture</li>
          <li>Use cotton wicks sized slightly larger than for soy</li>
          <li>Allow 72 hours curing for best results</li>
        </ul>`,
      related: [1, 2, 3],
    },
    {
      id: 5,
      name: 'Paraffin Wax WP100',
      shortName: 'Paraffin WP100',
      price: 120,
      sku: 'WP100',
      cat: 'Candle Waxes',
      emoji: '🕯️',
      bg: 'c-wax',
      badges: [],
      desc: 'High-quality refined paraffin wax for brilliant white candles with excellent colour and fragrance retention. The classic choice for pillars, votives, and container candles.',
      specs: [
        { label: 'Type',          value: 'Refined Paraffin Wax' },
        { label: 'Melt Point',    value: '52–56 °C' },
        { label: 'Fragrance Load',value: 'Up to 12%' },
        { label: 'Pack Sizes',    value: '500g / 1kg / 5kg' },
        { label: 'Colour',        value: 'Crystal White' },
      ],
      usage: `<h4>How to Use</h4>
        <p>Melt at 70–75 °C. Add additives (stearic acid) if desired, then fragrance at 65 °C. Pour at 60 °C into moulds or containers.</p>
        <ul>
          <li>Add 10% stearic acid for harder, opaque finish</li>
          <li>Fragrance load up to 12% — great scent throw</li>
          <li>Excellent for gifting candles</li>
        </ul>`,
      related: [1, 2, 4],
    },
    {
      id: 6,
      name: 'Vanilla Fragrance Oil FO29',
      shortName: 'Vanilla FO29',
      price: 254,
      sku: 'FO29',
      cat: 'Fragrance Oils',
      emoji: '🍦',
      bg: 'c-vanilla',
      badges: ['popular'],
      desc: 'A warm, creamy, comforting vanilla — the most loved fragrance in our collection. Excellent throw in both soy and paraffin wax. Works equally well in wax melts and diffusers.',
      specs: [
        { label: 'Top Note',      value: 'Sweet Cream' },
        { label: 'Middle Note',   value: 'Vanilla Bean' },
        { label: 'Base Note',     value: 'Musk, Benzoin' },
        { label: 'Usage Rate',    value: '6–10%' },
        { label: 'Pack Sizes',    value: '30ml / 100ml / 500ml' },
        { label: 'Compatibility', value: 'Soy, Paraffin, Beeswax' },
      ],
      usage: `<h4>Blending Tips</h4>
        <p>Add fragrance oil at 65–70 °C for best results. Vanilla fragrances may discolour wax to amber over time — this is normal.</p>
        <ul>
          <li>Recommended usage: 8% in soy, 10% in paraffin</li>
          <li>Pairs beautifully with sandalwood or coffee</li>
          <li>Allow 48-hour cure for full scent development</li>
          <li>Safe for candles, wax melts, and diffusers</li>
        </ul>`,
      related: [7, 8, 9],
    },
    {
      id: 7,
      name: 'Lavender Fragrance Oil FO15',
      shortName: 'Lavender FO15',
      price: 272,
      sku: 'FO15',
      cat: 'Fragrance Oils',
      emoji: '💜',
      bg: 'c-lavender',
      badges: [],
      desc: 'A fresh, aromatic, true-to-nature lavender fragrance. Relaxing and versatile — perfect for bedroom candles, meditation spaces, and stress-relief products.',
      specs: [
        { label: 'Top Note',      value: 'Fresh Lavender' },
        { label: 'Middle Note',   value: 'Herbs, Floral' },
        { label: 'Base Note',     value: 'Musk, Woods' },
        { label: 'Usage Rate',    value: '6–10%' },
        { label: 'Pack Sizes',    value: '30ml / 100ml / 500ml' },
        { label: 'Compatibility', value: 'All Wax Types' },
      ],
      usage: `<h4>Blending Tips</h4>
        <p>Lavender is a flexible middle note that blends well with most fragrances. Add at 65 °C and stir gently.</p>
        <ul>
          <li>Pairs with eucalyptus, mint, or rose</li>
          <li>Excellent hot throw in soy wax</li>
          <li>Great for bath and body applications too</li>
        </ul>`,
      related: [6, 8, 10],
    },
    {
      id: 8,
      name: 'Real Rose Fragrance Oil FO23',
      shortName: 'Rose FO23',
      price: 334,
      sku: 'FO23',
      cat: 'Fragrance Oils',
      emoji: '🌹',
      bg: 'c-rose',
      badges: [],
      desc: 'A rich, romantic, true Bulgarian rose fragrance. Deeply floral with a classic quality — our top-selling fragrance for gifting candles.',
      specs: [
        { label: 'Top Note',    value: 'Fresh Petals' },
        { label: 'Middle Note', value: 'Bulgarian Rose' },
        { label: 'Base Note',   value: 'Musk, Powdery' },
        { label: 'Usage Rate',  value: '6–8%' },
        { label: 'Pack Sizes',  value: '30ml / 100ml / 500ml' },
      ],
      usage: `<h4>Blending Tips</h4>
        <p>Rose fragrances can accelerate trace — add at the correct temperature and pour promptly.</p>
        <ul>
          <li>Do not add above 70 °C</li>
          <li>Recommended for container candles over pillars</li>
          <li>Valentine gifts best seller!</li>
        </ul>`,
      related: [6, 7, 9],
    },
    {
      id: 9,
      name: 'Sandalwood Fragrance Oil FO25',
      shortName: 'Sandalwood FO25',
      price: 346,
      sku: 'FO25',
      cat: 'Fragrance Oils',
      emoji: '🌿',
      bg: 'c-sandalwood',
      badges: [],
      desc: 'A deep, woody, meditative sandalwood with warm earthy base notes. A timeless unisex fragrance that grounds any room with a sense of calm.',
      specs: [
        { label: 'Top Note',    value: 'Bergamot' },
        { label: 'Middle Note', value: 'Cedarwood' },
        { label: 'Base Note',   value: 'Sandalwood, Amber' },
        { label: 'Usage Rate',  value: '6–10%' },
        { label: 'Pack Sizes',  value: '30ml / 100ml / 500ml' },
      ],
      usage: `<h4>Blending Tips</h4>
        <p>Sandalwood is a rich base note — blend with lighter top notes for balance.</p>
        <ul>
          <li>Pairs with rose, vanilla, or oud</li>
          <li>Strong hot throw in paraffin wax</li>
          <li>Allow 72-hour cure for full depth</li>
        </ul>`,
      related: [6, 7, 8],
    },
    {
      id: 10,
      name: 'Coffee Fragrance Oil FO26',
      shortName: 'Coffee FO26',
      price: 242,
      sku: 'FO26',
      cat: 'Fragrance Oils',
      emoji: '☕',
      bg: 'c-coffee',
      badges: [],
      desc: 'A rich, freshly-brewed coffee fragrance with hints of dark chocolate and cream. Energising and comforting — perfect for kitchen and study candles.',
      specs: [
        { label: 'Top Note',    value: 'Fresh Coffee' },
        { label: 'Middle Note', value: 'Dark Chocolate' },
        { label: 'Base Note',   value: 'Cream, Vanilla' },
        { label: 'Usage Rate',  value: '6–10%' },
        { label: 'Pack Sizes',  value: '30ml / 100ml / 500ml' },
      ],
      usage: `<h4>Blending Tips</h4>
        <p>Coffee fragrance has excellent throw in all wax types.</p>
        <ul>
          <li>Use with brown candle dye for café aesthetic</li>
          <li>Pairs well with vanilla or cinnamon</li>
        </ul>`,
      related: [6, 9, 11],
    },
    {
      id: 11,
      name: 'Fruity Set of 12 FO101',
      shortName: 'Fruity Set FO101',
      price: 829,
      sku: 'FO101',
      cat: 'Fragrance Oils',
      emoji: '🍓',
      bg: 'c-fragrance',
      badges: ['popular'],
      desc: '12 premium fruity fragrance oils in a curated gift set — strawberry, mango, citrus, peach, lychee, watermelon, kiwi, passion fruit, pineapple, blueberry, coconut, and cherry.',
      specs: [
        { label: 'Includes',    value: '12 × 10ml bottles' },
        { label: 'Scent Family',value: 'Fruity & Fresh' },
        { label: 'Usage Rate',  value: '6–10% each' },
        { label: 'Best For',    value: 'Gifting, Sampling' },
      ],
      usage: `<h4>Set Contents</h4>
        <p>Strawberry · Mango · Sweet Citrus · Peach Nectar · Lychee · Watermelon · Kiwi Breeze · Passion Fruit · Pineapple · Wild Blueberry · Tropical Coconut · Cherry Blossom</p>
        <ul>
          <li>All compatible with soy, paraffin, and gel wax</li>
          <li>Mix and match for custom blends</li>
          <li>Perfect starter fragrance sampler</li>
        </ul>`,
      related: [6, 7, 8],
    },
    {
      id: 12,
      name: 'Heart Rose Silicon Mould SM23',
      shortName: 'Heart Rose Mould SM23',
      price: 220,
      sku: 'SM23',
      cat: 'Silicon Moulds',
      emoji: '🌸',
      bg: 'c-rose',
      badges: ['sale'],
      originalPrice: 280,
      desc: 'Food-grade silicon mould with intricate heart and rose petal details. Creates stunning Valentine-themed candles. Highly flexible for easy unmoulding.',
      specs: [
        { label: 'Cavity Size', value: '60 × 60 × 40mm' },
        { label: 'Cavities',    value: '6 per sheet' },
        { label: 'Material',    value: 'Food-Grade Silicon' },
        { label: 'Max Temp',    value: '220 °C' },
        { label: 'Style',       value: 'Heart with Rose Petals' },
      ],
      usage: `<h4>Mould Care</h4>
        <p>Lightly spray mould release or wipe with vegetable oil before each use. Wash with warm soapy water after use.</p>
        <ul>
          <li>Compatible with soy, paraffin, and gel wax</li>
          <li>Pour at wax temperature ≤75 °C</li>
          <li>Allow full cool-down before unmoulding</li>
          <li>Store flat in a cool dry place</li>
        </ul>`,
      related: [1, 2, 3],
    },
    {
      id: 13,
      name: 'Complete Beginner Candle Kit BK01',
      shortName: 'Beginner Kit BK01',
      price: 1199,
      sku: 'BK01',
      cat: 'Beginner Kits',
      emoji: '🎁',
      bg: 'c-amber',
      badges: ['popular'],
      desc: 'Everything you need to make your first candles at home — hand-curated by our experts. Includes soy wax, cotton wicks, fragrance oil (your choice), container, pouring jug, thermometer, and step-by-step guide.',
      specs: [
        { label: 'Includes',   value: '8-item complete kit' },
        { label: 'Wax',        value: '500g Soy WP565' },
        { label: 'Wicks',      value: '10 × Pre-tabbed Cotton' },
        { label: 'Fragrance',  value: '1 × 30ml (Choice of 6)' },
        { label: 'Container',  value: '1 × Glass Jar (200ml)' },
        { label: 'Tools',      value: 'Jug, Thermometer, Stirrer' },
      ],
      usage: `<h4>Kit Contents</h4>
        <p>This kit has everything to make 2–3 medium candles. Follow the included step-by-step guide or watch our Instagram tutorials.</p>
        <ul>
          <li>Makes approximately 2–3 candles</li>
          <li>Choose your fragrance at checkout</li>
          <li>Scan QR code for video tutorial</li>
          <li>WhatsApp support included</li>
        </ul>`,
      related: [1, 6, 4],
    },
  ],

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
      label: 'Fragrances',
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
    { icon: '🚚', title: 'Fast Dispatch',    sub: 'Within 24 working hours' },
    { icon: '✦',  title: 'Premium Quality', sub: 'Lab-tested raw materials' },
    { icon: '📦', title: 'Secure Packaging',sub: 'Unboxing video required' },
    { icon: '💬', title: 'WhatsApp Support',sub: 'Quick help anytime' },
  ],

  /* ── PROMO CODES ──────────────────────────── */
  promoCodes: {
    TIMTIM10: 10,
    ARITRI10: 10,
    CANDLE10: 10,
    FIRST15:  15,
  },

  /* ── SHIPPING ─────────────────────────────── */
  freeShippingThreshold: 999,
  shippingCost:          60,

  /* ── CONTACT ──────────────────────────────── */
  whatsappNumber: '919899131167',
  email: 'support@timtimbyaritri.com',
  instagram: 'https://www.instagram.com/candle_rawmaterial',
};

/* ── HELPERS ──────────────────────────────────── */

/** Return a product by ID */
DATA.getProduct = function(id) {
  return DATA.products.find(p => p.id === id) || null;
};

/** Return products matching a category name */
DATA.getByCategory = function(cat) {
  return DATA.products.filter(p => p.cat === cat);
};

/** Return related products for a given product ID */
DATA.getRelated = function(id) {
  const product = DATA.getProduct(id);
  if (!product) return [];
  return (product.related || [])
    .map(rid => DATA.getProduct(rid))
    .filter(Boolean);
};

/** Return products to show on home (waxes + fragrances) */
DATA.getHomeWaxes = function() {
  return DATA.getByCategory('Candle Waxes').slice(0, 4);
};

DATA.getHomeFragrances = function() {
  return DATA.getByCategory('Fragrance Oils').slice(0, 6);
};
