import React from 'react';

export default function About() {
  return (
    <div className="page" style={{ padding: '60px 20px', textAlign: 'center', minHeight: '60vh' }}>
      <h1>About Us</h1>
      <p style={{ marginTop: '20px', color: 'var(--warm-gray)', maxWidth: '600px', margin: '20px auto' }}>
        Timtim by Aritri is India's trusted source for premium candle-making raw materials. 
        We specialize in soy wax, fragrance oils, silicon moulds, and beginner kits. 
        Our mission is to empower creators to craft candles that illuminate the soul.
      </p>
    </div>
  );
}
