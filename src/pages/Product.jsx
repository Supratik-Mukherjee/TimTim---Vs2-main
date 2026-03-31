import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [toast, setToast] = useState({ show: false, text: '', type: 'success' });

  const showToast = (text, type = 'success') => {
    setToast({ show: true, text, type });
    setTimeout(() => setToast({ show: false, text: '', type: 'success' }), 2500);
  };

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const d = await getDoc(doc(db, 'products', id));
        if (d.exists()) {
          const pData = { id: d.id, ...d.data() };
          setProduct(pData);
          
          // Fetch related products (same category, excluding current)
          const q = query(
            collection(db, 'products'),
            where('cat', '==', pData.cat),
            limit(5)
          );
          const rSnap = await getDocs(q);
          const rList = rSnap.docs
            .map(rd => ({ id: rd.id, ...rd.data() }))
            .filter(rd => rd.id !== id)
            .slice(0, 4);
          setRelated(rList);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // Set default weight when product loads
  useEffect(() => {
    if (product && product.weightTiers && product.weightTiers.length > 0) {
      setSelectedWeight(product.weightTiers[0]);
    } else {
      setSelectedWeight(null);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const activePrice = selectedWeight ? selectedWeight.price : product.price;
    const cartKey = selectedWeight ? `${product.id}_${selectedWeight.weight}` : product.id;
    
    const cart = JSON.parse(sessionStorage.getItem('tt_cart') || '[]');
    const existing = cart.find(item => item.cartKey === cartKey);
    
    let newCart;
    if (existing) {
      newCart = cart.map(item => 
        item.cartKey === cartKey ? { ...item, qty: item.qty + qty } : item
      );
    } else {
      newCart = [...cart, {
        ...product,
        cartKey,
        price: activePrice,
        selectedWeight: selectedWeight ? selectedWeight.weight : null,
        qty
      }];
    }
    
    sessionStorage.setItem('tt_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
    
    const weightLabel = selectedWeight ? ` (${selectedWeight.weight})` : '';
    showToast(`✓ Added ${qty} × ${product.shortName || product.name}${weightLabel} to cart`);
  };

  if (loading) return (
    <div className="page-loading" style={{ padding: '100px 20px', textAlign: 'center' }}>
      <div className="loader"></div>
      <p style={{ marginTop: '20px', fontFamily: 'var(--font-sans)', color: 'var(--warm-gray)' }}>Gently fetching details...</p>
    </div>
  );

  if (!product) return (
    <div className="page-error" style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', marginBottom: '20px' }}>Product Missing</h1>
      <p style={{ marginBottom: '30px', color: 'var(--warm-gray)' }}>We couldn't find the item you're looking for.</p>
      <Link to="/products" className="btn-dark">Back to Shop</Link>
    </div>
  );

  return (
    <div id="page-product" className="page">
      <div className="product-container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <Link to={`/products?cat=${encodeURIComponent(product.cat)}`}>{product.cat}</Link>
          <span className="sep">/</span>
          <span className="current">{product.shortName || product.name}</span>
        </nav>

        <div className="product-main">
          <div className="product-gallery">
            <div className="main-img-wrap">
               {product.imageUrl ? (
                 <img src={product.imageUrl} alt={product.name} className="product-featured-img" />
               ) : (
                 <div className={`product-placeholder ${product.bg || 'c-wax'}`}>
                   {product.emoji || '📦'}
                 </div>
               )}
            </div>
          </div>

          <div className="product-details">
            <p className="product-cat-label">{product.cat}</p>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-sku">SKU: {product.sku}</p>
            
            <div className="product-price-row">
              <span className="current-price">₹{selectedWeight ? selectedWeight.price : product.price}</span>
              {!selectedWeight && product.originalPrice && <span className="old-price">₹{product.originalPrice}</span>}
              {!selectedWeight && product.originalPrice && <span className="discount-tag">Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>}
              {selectedWeight && <span style={{ fontSize: '13px', color: 'var(--warm-gray)', marginLeft: '4px' }}>for {selectedWeight.weight}</span>}
            </div>

            {product.weightTiers && product.weightTiers.length > 0 && (
              <div className="weight-selector" style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--warm-gray)', fontWeight: 500, marginBottom: '10px' }}>Select Weight</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.weightTiers.map((tier, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedWeight(tier)}
                      style={{
                        padding: '10px 18px',
                        border: selectedWeight && selectedWeight.weight === tier.weight ? '2px solid var(--amber, #C4883A)' : '1px solid var(--mid-gray, #D4CFC6)',
                        background: selectedWeight && selectedWeight.weight === tier.weight ? 'var(--amber-pale, #FBF2E3)' : 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13px',
                        fontWeight: selectedWeight && selectedWeight.weight === tier.weight ? 600 : 400,
                        color: 'var(--charcoal, #1C1A18)',
                        transition: 'all 0.18s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        minWidth: '80px',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{tier.weight}</span>
                      <span style={{ fontSize: '12px', color: 'var(--amber-dark, #8B5E1A)' }}>₹{tier.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.desc}</p>
            </div>

            <div className="product-actions">
              <div className="qty-picker">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <input type="number" value={qty} readOnly className="qty-input" />
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <button className="add-to-cart-btn btn-dark" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>

            <div className="product-trust-badges">
              <div className="trust-badge">📦 24h Dispatch</div>
              <div className="trust-badge">✦ Quality Tested</div>
              <div className="trust-badge">🛡️ Secure Payment</div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="related-products">
            <div className="sec-head">
              <h2 className="sec-title">More in <em>{product.cat}</em></h2>
              <Link to={`/products?cat=${encodeURIComponent(product.cat)}`} className="view-all-btn">View All →</Link>
            </div>
            <div className="prod-grid">
              {related.map(rp => (
                <Link to={`/product/${rp.id}`} key={rp.id} className="prod-card">
                  <div className="prod-img-wrap">
                    <div className={`prod-img ${rp.imageUrl ? '' : (rp.bg || 'c-wax')}`} style={rp.imageUrl ? { backgroundImage: `url('${rp.imageUrl}')` } : {}}>
                      {!rp.imageUrl && (rp.emoji || '📦')}
                    </div>
                  </div>
                  <div className="prod-body">
                    <p className="prod-cat">{rp.cat}</p>
                    <h3 className="prod-name">{rp.shortName || rp.name}</h3>
                    <div className="prod-prices">
                      <span className="prod-price">₹{rp.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: toast.type === 'error' ? '#ef4444' : '#16a34a',
          color: 'white',
          padding: '14px 28px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 500,
          fontFamily: 'var(--font-sans)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 900,
          whiteSpace: 'nowrap',
          animation: 'toastSlideIn 0.3s ease',
        }}>
          {toast.text}
        </div>
      )}

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
