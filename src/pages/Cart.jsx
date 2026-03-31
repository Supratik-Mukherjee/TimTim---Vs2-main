import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DATA } from '../data';

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(DATA.shippingCost);

  useEffect(() => {
    // Load from legacy sessionStorage or default
    try {
      const saved = JSON.parse(sessionStorage.getItem('tt_cart') || '[]');
      setItems(saved);
    } catch (e) {
      setItems([]);
    }
  }, []);

  const saveCart = (newItems) => {
    setItems(newItems);
    sessionStorage.setItem('tt_cart', JSON.stringify(newItems));
    // Trigger global event if Nav needs to update, though React context is better for future refactoring
    window.dispatchEvent(new Event('cart-updated'));
  };

  const changeQty = (id, delta) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(50, (item.qty || 1) + delta));
        return { ...item, qty: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = items.filter(item => item.id !== id);
    saveCart(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

  useEffect(() => {
    setShippingCost(subtotal >= DATA.freeShippingThreshold ? 0 : DATA.shippingCost);
  }, [subtotal]);

  const applyCoupon = () => {
    const code = couponCode.toUpperCase();
    if (DATA.promoCodes[code]) {
      const pct = DATA.promoCodes[code];
      const amt = (subtotal * pct) / 100;
      setDiscountAmount(amt);
      alert(`Coupon Applied: ${pct}% off!`);
    } else {
      alert('Invalid Promo Code');
      setDiscountAmount(0);
    }
  };

  const formatPrice = (p) => `₹${Math.round(p)}`;
  const total = subtotal + shippingCost - discountAmount;
  const count = items.reduce((s, i) => s + (i.qty || 1), 0);

  return (
    <div id="page-cart" className="page" aria-label="Shopping cart">
      <div className="page-header" style={{ textAlign: 'center', padding: '60px 20px 20px' }}>
        <h1>Your Cart</h1>
        <p id="cart-subtitle">{items.length === 0 ? 'Your cart is empty' : `${count} item${count !== 1 ? 's' : ''} in your cart`}</p>
      </div>
      
      <div className="cart-layout">
        <div id="cart-items-col" aria-live="polite" aria-label="Cart items">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-ico" aria-hidden="true">🛒</div>
              <p>Your cart is empty</p>
              <button className="btn-dark" onClick={() => navigate('/products')}>Start Shopping</button>
            </div>
          ) : (
            <div className="cart-items-list" role="list">
              {items.map(item => (
                <div className="cart-item-row" role="listitem" key={item.id}>
                  <div className={`cart-item-img ${item.bg}`} aria-hidden="true">{item.emoji}</div>
                  <div>
                    <p className="ci-name" onClick={() => navigate(`/product/${item.id}`)} title="View product" style={{ cursor: 'pointer' }}>
                      {item.name}
                    </p>
                    <p className="ci-unit-price">{formatPrice(item.price)} each</p>
                    <div className="ci-qty-ctrl" role="group" aria-label={`Quantity for ${item.name}`}>
                      <button className="ci-qty-btn" onClick={() => changeQty(item.id, -1)} aria-label="Decrease quantity">−</button>
                      <span className="ci-qty-val" aria-live="polite">{item.qty || 1}</span>
                      <button className="ci-qty-btn" onClick={() => changeQty(item.id, 1)} aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                  <div className="ci-price-col">
                    <span className="ci-price">{formatPrice(item.price * (item.qty || 1))}</span>
                    <button className="ci-remove" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <aside className="order-summary" aria-label="Order summary">
          <h2 className="os-title">Order Summary</h2>
          <div className="os-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="os-row"><span>Shipping</span><span>{shippingCost === 0 ? 'Free 🎉' : formatPrice(shippingCost)}</span></div>
          <div className="os-row" style={{ color: discountAmount > 0 ? 'var(--sage)' : '' }}>
            <span>Discount</span><span>{discountAmount > 0 ? `−${formatPrice(discountAmount)}` : '₹0'}</span>
          </div>
          <div className="os-row total"><span>Total</span><span>{formatPrice(Math.max(0, total))}</span></div>
          <div className="os-divider"></div>
          
          <div className="coupon-row">
            <label htmlFor="coupon-input" className="sr-only">Promo code</label>
            <input 
              className="coupon-input" 
              id="coupon-input" 
              type="text" 
              placeholder="Promo code" 
              autoComplete="off" 
              spellCheck="false"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={discountAmount > 0}
              style={{ color: discountAmount > 0 ? 'var(--sage)' : '' }}
            />
            <button className="coupon-apply-btn" onClick={applyCoupon} disabled={discountAmount > 0}>Apply</button>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--warm-gray)', marginBottom: '16px' }}>
            Try: <code style={{ fontSize: '11px', background: 'var(--light-gray)', padding: '2px 6px' }}>TIMTIM10</code>
          </p>
          
          <button className="checkout-cta-btn" onClick={() => navigate('/checkout')} disabled={items.length === 0}>Proceed to Checkout →</button>
          <button className="continue-btn" onClick={() => navigate('/products')}>← Continue Shopping</button>
          
          <p id="os-shipping-note" style={{ fontSize: '11px', textAlign: 'center', marginTop: '14px', color: shippingCost === 0 ? 'var(--sage)' : 'var(--warm-gray)' }}>
            {shippingCost === 0 ? '✓ Free shipping applied' : `Add ${formatPrice(DATA.freeShippingThreshold - subtotal)} more for free shipping`}
          </p>
          
          <div className="os-trust">
            <span>🔒 Secure &amp; encrypted checkout</span>
            <span>📦 Free shipping on orders ≥ ₹999</span>
            <span>↩ Easy 7-day returns</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
