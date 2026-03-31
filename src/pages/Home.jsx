import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DATA } from '../data';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function Home() {
  const navigate = useNavigate();
  const [cloudProducts, setCloudProducts] = useState(DATA.legacyProducts); // Fallback to local

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      setCloudProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error("Firestore read error:", err);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Optionally trigger reveal animations or simply let CSS handle them.
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(r => r.classList.add('active'));
  }, []);

  const waxes = cloudProducts.filter(p => p.cat === 'Candle Waxes').slice(0, 4);
  const fragrances = cloudProducts.filter(p => p.cat === 'Fragrance Oils').slice(0, 6);

  const formatPrice = (p) => `₹${p}`;

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div id="page-home" className="page" aria-label="Home page">
      <section className="hero" aria-label="Hero banner" style={{ padding: 0 }}>
        <div className="hero-text">
          <p className="hero-eyebrow">Timtim by Aritri · Candle Making Supplies</p>
          <h1 className="hero-h1">Craft candles<br />that <em>illuminate</em><br />the soul</h1>
          <p className="hero-sub">Premium quality waxes, fragrances, moulds &amp; tools for the passionate candle maker. Everything you need to pour your first — or finest — candle.</p>
          <div className="hero-btns">
            <button className="btn-dark" onClick={() => navigate('/products')}>Shop Now</button>
            <button className="btn-outline" onClick={() => navigate('/products?cat=Beginner Kits')}>Beginner Kits</button>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-tile tall c-amber"><span>🕯️</span><div className="hero-tag">Soy Wax Collection</div></div>
          <div className="hero-tile c-rose"><span>🌹</span><div className="hero-tag">Floral Moulds</div></div>
          <div className="hero-tile c-fragrance"><span>🌿</span><div className="hero-tag">Fragrance Oils</div></div>
        </div>
      </section>

      <div className="trust-row" id="trust-row" aria-label="Our promises">
        {DATA.trustItems.map((item, i) => (
          <div className="trust-item" key={i}>
            <div className="trust-ico">{item.icon}</div>
            <div className="trust-txt">
              <h4>{item.title}</h4>
              <p>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="section section-white" id="categories" aria-labelledby="cat-heading">
        <div className="sec-head reveal active">
          <div><p className="sec-label">Explore</p><h2 className="sec-title" id="cat-heading">Shop by <em>Category</em></h2></div>
          <button className="view-all-btn" onClick={() => navigate('/products')}>View All →</button>
        </div>
        <div className="cat-grid" id="cat-grid">
          {DATA.categories.map((cat, i) => (
            <div
              key={i}
              className={`cat-card reveal active ${cat.large ? 'cat-large' : ''}`}
              style={{ background: cat.bg }}
              onClick={() => navigate(`/products?cat=${encodeURIComponent(cat.label)}`)}
              role="button"
              tabIndex="0"
              aria-label={`Browse ${cat.label}`}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/products?cat=${encodeURIComponent(cat.label)}`); }}
            >
              <div className="cat-inner">{cat.emoji}</div>
              <div className="cat-overlay">
                <h3>{cat.label}</h3>
                <span>{cat.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-cream" id="raw-material" aria-labelledby="wax-heading">
        <div className="sec-head reveal active">
          <div><p className="sec-label">Best Sellers</p><h2 className="sec-title" id="wax-heading">Candle <em>Waxes</em></h2></div>
          <button className="view-all-btn" onClick={() => navigate('/products?cat=Candle Waxes')}>View All →</button>
        </div>
        <div className="prod-grid" id="wax-grid">
          {waxes.map(p => (
            <div className="prod-card reveal active" key={p.id} onClick={() => handleProductClick(p.id)}>
              <div className="prod-img-wrap">
                {p.badges && p.badges.map(b => (
                  <span className={`prod-badge ${b}`} key={b}>{b === 'sale' ? 'Sale' : b === 'new' ? 'New' : 'Popular'}</span>
                ))}
                <div className={`prod-img ${p.imageUrl ? '' : p.bg}`} style={p.imageUrl ? { backgroundImage: `url('${p.imageUrl}')` } : {}}>
                  {!p.imageUrl && p.emoji}
                </div>
                <button className="quick-add" aria-label="Add to cart" onClick={(e) => { e.stopPropagation(); navigate('/cart'); }}>+</button>
              </div>
              <div className="prod-body">
                <p className="prod-cat">{p.cat}</p>
                <h3 className="prod-name">{p.shortName || p.name}</h3>
                <div className="prod-prices">
                  <span className="prod-price">{formatPrice(p.price)}</span>
                  {p.originalPrice && <span className="prod-orig">{formatPrice(p.originalPrice)}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="promo-strip" id="moulds">
        <div className="promo-half dark reveal active">
          <p className="promo-eyebrow">❤ Valentine's Special</p>
          <h2>30% Off on Heart &amp; Love Moulds</h2>
          <p>Create heartfelt gifts with our exclusive Valentine collection — teddy moulds, heart roses, and romantic sets crafted with love.</p>
          <button className="btn-cream" onClick={() => navigate('/products?cat=Silicon Moulds')}>Shop the Collection</button>
        </div>
        <div className="promo-half charcoal reveal active" id="kits">
          <p className="promo-eyebrow">★ Just Starting Out?</p>
          <h2>Beginner Kits — Everything Included</h2>
          <p>Hand-curated starter kits with wax, wicks, fragrances, tools &amp; step-by-step guidance. Begin your candle journey today.</p>
          <button className="btn-sage" onClick={() => navigate('/cart')}>Add Kit to Cart</button>
        </div>
      </div>

      <section className="section section-gray" id="fragrances" aria-labelledby="frag-heading">
        <div className="sec-head reveal active">
          <div><p className="sec-label">Scents</p><h2 className="sec-title" id="frag-heading">Fragrance <em>Oils</em></h2></div>
          <button className="view-all-btn" onClick={() => navigate('/products?cat=Fragrance Oils')}>View All →</button>
        </div>
        <div className="frag-grid" id="frag-grid">
          {fragrances.map(f => (
            <div
              key={f.id}
              className="frag-card reveal active"
              onClick={() => handleProductClick(f.id)}
              role="button"
              tabIndex="0"
              aria-label={f.shortName || f.name}
              onKeyDown={(e) => { if (e.key === 'Enter') handleProductClick(f.id); }}
            >
              <div className={`frag-img ${f.imageUrl ? '' : f.bg}`} style={f.imageUrl ? { backgroundImage: `url(${f.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                {!f.imageUrl && f.emoji}
              </div>
              <h4>{f.shortName || f.name}</h4>
              <span className="frag-price">from {formatPrice(f.price)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="newsletter" id="contact">
        <p className="nl-label">Stay in the loop</p>
        <h2>Offers, launches &amp; candle <em>inspiration</em></h2>
        <p>Subscribe and never miss a new mould drop, sale, or seasonal collection.</p>
        <form className="nl-form" id="nl-form" noValidate onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <input type="email" id="nl-email" name="email" placeholder="Enter your email address" autoComplete="email" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  );
}
