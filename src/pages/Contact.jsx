import React from 'react';

export default function Contact() {
  return (
    <div className="page" style={{ padding: '60px 20px', textAlign: 'center', minHeight: '60vh' }}>
      <h1>Contact Us</h1>
      <p style={{ marginTop: '20px', color: 'var(--warm-gray)', maxWidth: '600px', margin: '20px auto' }}>
        Have questions about our products or need help with a formula? Get in touch with us!
      </p>
      
      <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <a href="mailto:support@timtimbyaritri.com" className="btn-outline" style={{ display: 'inline-block', width: '250px' }}>
          📧 Email Support
        </a>
        <a href="https://wa.me/919899131167" target="_blank" rel="noopener noreferrer" className="btn-dark" style={{ display: 'inline-block', width: '250px' }}>
          💬 WhatsApp Us
        </a>
        <a href="https://instagram.com/candle_rawmaterial" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'inline-block', width: '250px' }}>
          📷 Instagram
        </a>
      </div>
    </div>
  );
}
