import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DATA } from '../data';

export default function Checkout() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Customer form
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  // Pricing
  const [couponCode, setCouponCode] = useState('');
  const [discountPct, setDiscountPct] = useState(0);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('tt_cart') || '[]');
      if (saved.length === 0) {
        navigate('/cart');
        return;
      }
      setItems(saved);

      // Check if discount was applied in cart page
      const savedCoupon = sessionStorage.getItem('tt_coupon');
      if (savedCoupon && DATA.promoCodes[savedCoupon]) {
        setCouponCode(savedCoupon);
        setDiscountPct(DATA.promoCodes[savedCoupon]);
      }
    } catch {
      navigate('/cart');
    }
  }, [navigate]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const shippingCost = subtotal >= DATA.freeShippingThreshold ? 0 : DATA.shippingCost;
  const discountAmount = (subtotal * discountPct) / 100;
  const total = Math.max(0, subtotal + shippingCost - discountAmount);
  const formatPrice = (p) => `₹${Math.round(p)}`;

  const generateOrderNumber = () => {
    const prefix = 'TT';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const buildWhatsAppMessage = (orderNum) => {
    let msg = `🕯️ *NEW ORDER — Timtim by Aritri*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📋 *Order:* ${orderNum}\n`;
    msg += `📅 *Date:* ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}\n\n`;

    msg += `👤 *Customer Details*\n`;
    msg += `Name: ${form.name}\n`;
    msg += `Phone: ${form.phone}\n`;
    if (form.email) msg += `Email: ${form.email}\n`;
    msg += `Address: ${form.address}, ${form.city}, ${form.state} - ${form.pincode}\n\n`;

    msg += `🛒 *Order Items*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;

    items.forEach((item, i) => {
      const qty = item.qty || 1;
      const lineTotal = item.price * qty;
      const weightLabel = item.selectedWeight ? ` [${item.selectedWeight}]` : '';
      msg += `${i + 1}. ${item.name}${weightLabel}\n`;
      msg += `   ${qty} × ₹${item.price} = ₹${lineTotal}\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Subtotal: ₹${Math.round(subtotal)}\n`;
    msg += `Shipping: ${shippingCost === 0 ? 'FREE 🎉' : `₹${shippingCost}`}\n`;
    if (discountAmount > 0) {
      msg += `Discount (${couponCode} ${discountPct}%): -₹${Math.round(discountAmount)}\n`;
    }
    msg += `\n💰 *TOTAL: ₹${Math.round(total)}*\n\n`;

    if (form.notes) {
      msg += `📝 *Notes:* ${form.notes}\n\n`;
    }

    msg += `Payment: Cash on Delivery / UPI\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━`;

    return msg;
  };

  const validateForm = () => {
    const required = ['name', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!form[field].trim()) {
        return false;
      }
    }
    if (!/^\d{10}$/.test(form.phone.trim())) return false;
    if (!/^\d{6}$/.test(form.pincode.trim())) return false;
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      alert('Please fill all required fields correctly.\n• Phone must be 10 digits\n• Pincode must be 6 digits');
      return;
    }

    const orderNum = generateOrderNumber();
    setOrderNumber(orderNum);

    const message = buildWhatsAppMessage(orderNum);
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${DATA.whatsappNumber}?text=${encoded}`;

    // Clear cart
    sessionStorage.removeItem('tt_cart');
    sessionStorage.removeItem('tt_coupon');
    window.dispatchEvent(new Event('cart-updated'));

    // Open WhatsApp
    window.open(waUrl, '_blank');

    setOrderPlaced(true);
  };

  // ── SUCCESS STATE ──
  if (orderPlaced) {
    return (
      <div className="success-page">
        <div className="success-box">
          <div className="success-icon">✅</div>
          <h2>Order Placed!</h2>
          <p>Your order has been sent via WhatsApp. We'll confirm it shortly and get it dispatched within 24 hours.</p>

          <div className="order-num-box">
            <span>Order Number</span>
            <strong>{orderNumber}</strong>
          </div>

          <p className="success-note">
            💬 A WhatsApp message with your order details has been opened. Please send it to complete your order.
            <br /><br />
            📦 You'll receive a confirmation and tracking update on WhatsApp once dispatched.
          </p>

          <div className="success-actions">
            <Link to="/" className="btn-dark">Back to Home</Link>
            <Link to="/products" className="btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── CHECKOUT FORM ──
  return (
    <div id="page-checkout" className="page" aria-label="Checkout page">
      <div className="page-header" style={{ textAlign: 'center', padding: '60px 20px 20px' }}>
        <h1>Checkout</h1>
        <p style={{ marginTop: '10px', color: 'var(--warm-gray)' }}>
          Review your order and provide delivery details
        </p>
      </div>

      <div className="checkout-layout">
        {/* ── LEFT: FORM ── */}
        <div className="checkout-form">

          {/* Contact Info */}
          <div className="cf-section">
            <h3>Contact Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="co-name">Full Name *</label>
                <input
                  className="form-input"
                  id="co-name"
                  type="text"
                  placeholder="Your full name"
                  required
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="co-phone">Phone (WhatsApp) *</label>
                <input
                  className="form-input"
                  id="co-phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  required
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
            <div className="form-row full">
              <div className="form-group">
                <label className="form-label" htmlFor="co-email">Email (optional)</label>
                <input
                  className="form-input"
                  id="co-email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="cf-section">
            <h3>Shipping Address</h3>
            <div className="form-row full">
              <div className="form-group">
                <label className="form-label" htmlFor="co-address">Street Address *</label>
                <input
                  className="form-input"
                  id="co-address"
                  type="text"
                  placeholder="House no., street, locality"
                  required
                  value={form.address}
                  onChange={e => handleChange('address', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="co-city">City *</label>
                <input
                  className="form-input"
                  id="co-city"
                  type="text"
                  placeholder="City"
                  required
                  value={form.city}
                  onChange={e => handleChange('city', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="co-state">State *</label>
                <input
                  className="form-input"
                  id="co-state"
                  type="text"
                  placeholder="State"
                  required
                  value={form.state}
                  onChange={e => handleChange('state', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="co-pincode">Pincode *</label>
                <input
                  className="form-input"
                  id="co-pincode"
                  type="text"
                  placeholder="6-digit pincode"
                  maxLength="6"
                  required
                  value={form.pincode}
                  onChange={e => handleChange('pincode', e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <div></div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="cf-section">
            <h3>Payment</h3>
            <div className="payment-methods">
              <div className="pay-option selected">
                <input type="radio" name="payment" id="pay-wa" defaultChecked readOnly />
                <div className="pay-label-group">
                  <p className="pay-title">WhatsApp Order</p>
                  <p className="pay-sub">Order via WhatsApp — pay COD or via UPI after confirmation</p>
                </div>
                <div className="pay-icons">
                  <span className="pay-icon wa">💬 WA</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '14px', lineHeight: 1.7 }}>
              Your order will be sent to our WhatsApp. We'll confirm availability and share payment details (UPI / bank transfer). 
              Cash on Delivery is also available.
            </p>
          </div>

          {/* Order Notes */}
          <div className="cf-section">
            <h3>Order Notes (optional)</h3>
            <div className="form-group">
              <textarea
                className="form-input"
                id="co-notes"
                rows="3"
                placeholder="Any special instructions for your order..."
                value={form.notes}
                onChange={e => handleChange('notes', e.target.value)}
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>
          </div>

          {/* Place Order Button */}
          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={items.length === 0}
          >
            💬 Place Order via WhatsApp
          </button>
        </div>

        {/* ── RIGHT: ORDER SUMMARY ── */}
        <aside className="checkout-summary">
          <div className="cs-box">
            <h2 className="cs-title">Order Summary</h2>

            {items.map(item => (
              <div className="cs-item" key={item.cartKey || item.id}>
                <span className="cs-item-name">
                  {item.name}
                  {item.selectedWeight && <span style={{ color: 'var(--amber-dark)', fontSize: '11px' }}> ({item.selectedWeight})</span>}
                  {' '}<span style={{ color: 'var(--warm-gray)' }}>× {item.qty || 1}</span>
                </span>
                <span className="cs-item-price">{formatPrice(item.price * (item.qty || 1))}</span>
              </div>
            ))}

            <div className="cs-totals">
              <div className="cs-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="cs-row">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free 🎉' : formatPrice(shippingCost)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="cs-row" style={{ color: 'var(--sage)' }}>
                  <span>Discount ({couponCode})</span>
                  <span>−{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="cs-row grand">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <p className="cs-shipping-note">
              {shippingCost === 0 ? '✓ Free shipping applied' : `Add ${formatPrice(DATA.freeShippingThreshold - subtotal)} more for free shipping`}
            </p>

            <div className="cs-security-note">
              🔒 Your order will be placed securely via WhatsApp. No online payment is collected on this page.
            </div>
          </div>

          <button
            className="continue-btn"
            onClick={() => navigate('/cart')}
            style={{ marginTop: '16px', display: 'block', width: '100%', textAlign: 'center' }}
          >
            ← Back to Cart
          </button>
        </aside>
      </div>
    </div>
  );
}
