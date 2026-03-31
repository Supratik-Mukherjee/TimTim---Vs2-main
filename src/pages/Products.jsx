import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DATA } from '../data';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cloudProducts, setCloudProducts] = useState(DATA.legacyProducts); // Fallback to local
  
  const initialCat = searchParams.get('cat') || 'all';
  const [currentCat, setCurrentCat] = useState(initialCat);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      setCloudProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error("Firestore read error:", err);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('cat') || 'all';
    setCurrentCat(cat);
  }, [searchParams]);

  const handleFilterClick = (catName) => {
    if (catName === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ cat: catName });
    }
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const formatPrice = (p) => `₹${p}`;

  const allCategories = ['all', ...DATA.categories.map(c => c.label)];
  
  const productsToDisplay = currentCat === 'all' 
    ? cloudProducts 
    : cloudProducts.filter(p => p.cat === currentCat);

  return (
    <div id="page-shop" className="page" aria-label="Shop page">
      <div className="page-header" style={{ textAlign: 'center', padding: '60px 20px 20px' }}>
        <h1 id="shop-title">{currentCat === 'all' ? 'Shop All' : currentCat}</h1>
        <p style={{ marginTop: '10px', color: 'var(--warm-gray)' }}>Premium quality waxes, fragrances, moulds &amp; tools.</p>
      </div>
      
      <div className="shop-filter-bar" id="shop-filter-bar">
        {allCategories.map(cat => (
          <button 
            key={cat} 
            className={`filter-btn ${currentCat === cat ? 'active' : ''}`} 
            onClick={() => handleFilterClick(cat)}
          >
            {cat === 'all' ? 'All Products' : cat}
          </button>
        ))}
      </div>
      
      <div id="shop-grid" className="shop-tile-grid">
        {productsToDisplay.length === 0 ? (
          <p style={{ textAlign: 'center', width: '100%', gridColumn: '1/-1' }}>No products found in this category.</p>
        ) : (
          productsToDisplay.map(p => (
            <div className="shop-tile" key={p.id} onClick={() => handleProductClick(p.id)}>
              {p.badges && p.badges.map(b => (
                <span className={`prod-badge ${b}`} key={b}>{b === 'sale' ? 'Sale' : b === 'new' ? 'New' : 'Popular'}</span>
              ))}
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="shop-tile-img" />
              ) : (
                <div className={`shop-tile-placeholder ${p.bg || 'c-wax'}`}>
                  {p.emoji || '📦'}
                </div>
              )}
              <div className="shop-tile-overlay">
                <h3 className="shop-tile-name">{p.shortName || p.name}</h3>
                <span className="shop-tile-price">{formatPrice(p.price)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
