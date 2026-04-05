import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DATA } from '../data';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import useStorageUrl from '../hooks/useStorageUrl';
import ProductCard from '../components/ProductCard';

// ── SUB-COMPONENTS ──────────────────────────────────────────────

function HeroTile({ label, cat, url, className, onClick }) {
  const resolvedUrl = useStorageUrl(url);
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        backgroundImage: resolvedUrl ? `url('${resolvedUrl}')` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'var(--cream)'
      }}
    >
      <div className="hero-tag">{label}</div>
    </div>
  );
}

function CategoryCard({ cat, onClick }) {
  const resolvedUrl = useStorageUrl(cat.imageUrl);
  return (
    <div
      className={`cat-card reveal in ${cat.large ? 'cat-large' : ''}`}
      style={{ background: cat.bg }}
      onClick={onClick}
      role="button"
      tabIndex="0"
      aria-label={`Browse ${cat.label}`}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
    >
      <div
        className="cat-inner"
        style={resolvedUrl ? {
          backgroundImage: `url('${resolvedUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 1
        } : {}}
      >
        {!resolvedUrl && !cat.imageUrl && cat.emoji}
      </div>
      <div className="cat-overlay">
        <h3>{cat.label}</h3>
        <span>{cat.sub}</span>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();
  const [cloudProducts, setCloudProducts] = useState(DATA.legacyProducts);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      setCloudProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error("Firestore read error:", err);
    });
    return () => unsub();
  }, []);

  const featured = cloudProducts.slice(0, 8);
  const formatPrice = (p) => `₹${p}`;
  const handleProductClick = (id) => navigate(`/product/${id}`);

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
        <div className="hero-visual">
          <HeroTile 
            label="Soy Wax Collection"
            url="gs://timtim-vs2-main-10726303-20a19.firebasestorage.app/Cover/Candel_Wax.jpeg"
            className="hero-tile tall c-amber"
            onClick={() => navigate('/products?cat=Candle+Waxes')}
          />
          <HeroTile 
            label="Floral Moulds"
            url="gs://timtim-vs2-main-10726303-20a19.firebasestorage.app/Cover/Moulds.jpeg"
            className="hero-tile c-rose"
            onClick={() => navigate('/products?cat=Silicon+Moulds')}
          />
          <HeroTile 
            label="Fragrance Oils"
            url="gs://timtim-vs2-main-10726303-20a19.firebasestorage.app/Cover/Fragrances.jpeg"
            className="hero-tile c-fragrance"
            onClick={() => navigate('/products?cat=Fragrance+Oils')}
          />
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
        <div className="sec-head reveal in">
          <div><p className="sec-label">Explore</p><h2 className="sec-title" id="cat-heading">Shop by <em>Category</em></h2></div>
          <button className="view-all-btn" onClick={() => navigate('/products')}>View All →</button>
        </div>
        <div className="cat-grid" id="cat-grid">
          {DATA.categories.map((cat, i) => (
            <CategoryCard 
              key={i} 
              cat={cat} 
              onClick={() => navigate(`/products?cat=${encodeURIComponent(cat.label)}`)} 
            />
          ))}
        </div>
      </section>

      <section className="section section-cream" id="featured" aria-labelledby="featured-heading">
        <div className="sec-head reveal in">
          <div><p className="sec-label">Our Products</p><h2 className="sec-title" id="featured-heading">Featured <em>Items</em></h2></div>
          <button className="view-all-btn" onClick={() => navigate('/products')}>View All →</button>
        </div>
        <div className="prod-grid" id="featured-grid">
          {featured.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--warm-gray)', padding: '40px 0' }}>Loading products...</p>
          ) : (
            featured.map(p => (
              <ProductCard 
                key={p.id} 
                p={p} 
                onClick={() => handleProductClick(p.id)}
                formatPrice={formatPrice}
                onQuickAdd={(e) => { e.stopPropagation(); navigate(`/product/${p.id}`); }}
              />
            ))
          )}
        </div>
      </section>

      <div className="promo-strip" id="moulds">
        <div className="promo-half dark reveal in">
          <p className="promo-eyebrow">❤ Special Offer</p>
          <h2>Explore our Silicon Moulds</h2>
          <p>Floral, animal, pillar — discover our wide range of premium silicon moulds for every candle style.</p>
          <button className="btn-cream" onClick={() => navigate('/products?cat=Silicon Moulds')}>Shop Moulds</button>
        </div>
        <div className="promo-half charcoal reveal in" id="kits">
          <p className="promo-eyebrow">★ Just Starting Out?</p>
          <h2>Beginner Kits — Everything Included</h2>
          <p>Hand-curated starter kits with wax, wicks, fragrances, tools &amp; step-by-step guidance. Begin your candle journey today.</p>
          <button className="btn-sage" onClick={() => navigate('/products?cat=Beginner Kits')}>View Kits</button>
        </div>
      </div>

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
