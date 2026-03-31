import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const d = await getDoc(doc(db, 'products', id));
        if (d.exists()) {
          setProduct({ id: d.id, ...d.data() });
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
  }, [id]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading product details...</div>;
  if (!product) return <div style={{ padding: '60px', textAlign: 'center' }}>Product not found. <br/><button onClick={() => navigate('/products')} style={{ marginTop: '20px' }}>Back to Shop</button></div>;

  const handleAddToCart = () => {
    alert(`Added ${qty} of ${product.shortName || product.name} to Cart. (Cart logic not fully implemented yet)`);
  };

  return (
    <div id="page-product" className="page" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: '20px', color: '#6b7280', fontSize: '14px' }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
        <span className="sep" aria-hidden="true" style={{ margin: '0 10px' }}>/</span>
        <span onClick={() => navigate(`/products?cat=${product.cat}`)} style={{ cursor: 'pointer' }}>{product.cat}</span>
        <span className="sep" aria-hidden="true" style={{ margin: '0 10px' }}>/</span>
        <span className="current" style={{ fontWeight: 600, color: '#111827' }}>{product.shortName || product.name}</span>
      </nav>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        <div style={{ flex: '1 1 400px' }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', aspectRatio: '1/1' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', borderRadius: '8px' }}>
               {product.emoji || '📦'}
            </div>
          )}
        </div>
        
        <div style={{ flex: '1 1 400px' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>{product.name}</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>SKU: {product.sku}</p>
          
          <div style={{ fontSize: '24px', fontWeight: 600, marginBottom: '20px' }}>
            ₹{product.price}
          </div>
          
          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />
          
          <p style={{ lineHeight: '1.6', color: '#374151', marginBottom: '30px', whiteSpace: 'pre-wrap' }}>
            {product.desc}
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <span style={{ fontWeight: 500 }}>Qty</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '4px', overflow: 'hidden' }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '8px 12px', background: '#f9fafb', border: 'none', borderRight: '1px solid #d1d5db', cursor: 'pointer' }}>-</button>
              <input type="number" value={qty} readOnly style={{ width: '50px', textAlign: 'center', border: 'none' }} />
              <button onClick={() => setQty(qty + 1)} style={{ padding: '8px 12px', background: '#f9fafb', border: 'none', borderLeft: '1px solid #d1d5db', cursor: 'pointer' }}>+</button>
            </div>
          </div>
          
          <button onClick={handleAddToCart} style={{ background: '#111827', color: 'white', padding: '14px 24px', border: 'none', borderRadius: '4px', width: '100%', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
