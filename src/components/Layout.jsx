import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function Layout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      
      <div className="announcement" role="status" aria-live="polite">
        ✦ Free shipping on orders above ₹999 &nbsp;·&nbsp; 24hr dispatch &nbsp;·&nbsp; Pan India delivery ✦
      </div>

      <nav className="site-nav" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <Link className="nav-logo" to="/" aria-label="Timtim by Aritri — Go to homepage">
            Timtim <span>by</span> Aritri
          </Link>
          <ul className="nav-links" aria-label="Site sections">
            <li><Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Shop</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
          </ul>
          <div className="nav-actions">
            <Link className="nav-icon-btn" to="/login" aria-label="Account">👤</Link>
            <button className="nav-icon-btn" id="wishlist-nav-btn" aria-label="Wishlist">
              ♡ <span className="nav-badge" id="wish-badge" aria-hidden="true">0</span>
            </button>
            <Link className="nav-icon-btn" to="/cart" aria-label="Open cart">
              🛒 <span className="nav-badge" id="cart-badge" aria-hidden="true">0</span>
            </Link>
            <Link className="nav-cart-btn" to="/cart" aria-label="Open cart">
              Cart (<span id="cart-count-nav">0</span>)
            </Link>
            <button 
              className={`hamburger ${mobileNavOpen ? 'open' : ''}`} 
              aria-label="Toggle navigation menu" 
              aria-expanded={mobileNavOpen} 
              aria-controls="mobile-nav"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`} id="mobile-nav" role="dialog" aria-label="Mobile navigation menu">
        <Link className="mobile-nav-link" to="/products">Shop All</Link>
        <Link className="mobile-nav-link" to="/about">About Us</Link>
        <Link className="mobile-nav-link" to="/contact">Contact</Link>
        <Link className="mobile-nav-link" to="/login">👤 My Account</Link>
        <Link className="mobile-nav-link" to="/cart">🛒 Cart (<span id="mobile-cart-count">0</span>)</Link>
      </div>

      <main id="main-content">
        <Outlet />
      </main>

      <a href="https://wa.me/919899131167" target="_blank" rel="noopener noreferrer" className="wa-float" aria-label="Chat with us on WhatsApp" title="Chat on WhatsApp">💬</a>
      <div className="toast" id="toast" role="status" aria-live="polite"></div>

      <footer className="site-footer" role="contentinfo">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link className="foot-logo" to="/" aria-label="Home">Timtim <span>by</span> Aritri</Link>
            <p>India's trusted source for premium candle-making raw materials — soy wax, fragrance oils, silicon moulds, containers &amp; beginner kits. Dispatch within 24 hours. Pan India delivery.</p>
            <div className="socials">
              <a href="https://www.instagram.com/candle_rawmaterial" target="_blank" rel="noopener noreferrer" className="soc" aria-label="Instagram">📷</a>
              <a href="https://wa.me/919899131167" target="_blank" rel="noopener noreferrer" className="soc" aria-label="WhatsApp">💬</a>
            </div>
          </div>
          <div className="foot-col">
            <h5>Shop</h5>
            <ul>
              <li><Link to="/products?cat=Candle Waxes">Candle Waxes</Link></li>
              <li><Link to="/products?cat=Silicon Moulds">Silicon Moulds</Link></li>
              <li><Link to="/products?cat=Fragrance Oils">Fragrances</Link></li>
              <li><Link to="/products?cat=Beginner Kits">Beginner Kits</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Info</h5>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="#">Shipping Policy</Link></li>
              <li><Link to="#">Return Policy</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="https://wa.me/919899131167" target="_blank" rel="noopener noreferrer">📞 WhatsApp Us</a></li>
              <li><a href="mailto:support@timtimbyaritri.com">📧 Email Support</a></li>
              <li><a href="https://instagram.com/candle_rawmaterial" target="_blank" rel="noopener noreferrer">📷 @candle_rawmaterial</a></li>
            </ul>
            <br />
            <h5>Dispatch</h5>
            <ul>
              <li><Link to="#">⏱ 24 Working Hours</Link></li>
              <li><Link to="#">📦 Pan India Delivery</Link></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <p>© {new Date().getFullYear()} Timtim by Aritri. All rights reserved.</p>
          <div className="foot-bottom-links">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Refund Policy</Link>
            <Link to="#">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
