import React from 'react';

export default function About() {
  return (
    <div id="page-about" className="page">
      <section className="about-hero" style={{ 
        padding: '100px 20px', 
        textAlign: 'center', 
        background: 'var(--cream)',
        borderBottom: '1px solid var(--border)'
      }}>
        <img src="/logo.png" alt="Timtim by Aritri" style={{ height: '80px', marginBottom: '24px' }} />
        <p className="hero-eyebrow" style={{ letterSpacing: '0.2em', color: 'var(--amber)', textTransform: 'uppercase', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}>Our Story</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: 'var(--amber-dark)' }}>Timtim <em>by Aritri</em></h1>
        <p style={{ maxWidth: '700px', margin: '24px auto 0', color: 'var(--warm-gray)', lineHeight: 1.6, fontSize: '1.1rem' }}>
          A Mumbai-based studio crafting more than just supplies — we're building a community of illuminators. 
          What started as a personal passion for hand-poured candles has evolved into India's 
          most trusted source for premium candle-making raw materials.
        </p>
      </section>

      <section style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '24px' }}>The <em>Philosophy</em></h2>
            <p style={{ color: 'var(--charcoal)', lineHeight: 1.8, marginBottom: '20px' }}>
              At Timtim by Aritri, we believe every candle tells a story. Whether it's a gift for a loved one 
              or a moment of self-care, the quality of materials defines the soul of the final pour. 
              Our journey began in the heart of Mumbai, driven by a simple yet powerful goal: 
              to provide Indian makers with the same high-standard supplies that were once hard to find locally.
            </p>
            <p style={{ color: 'var(--charcoal)', lineHeight: 1.8, marginBottom: '20px' }}>
              We're not just a shop; we're your creative partner. From our non-GMO pure soy waxes 
              to our ethically sourced fragrance oils and meticulously designed silicon moulds, 
              every item in our catalog is hand-selected and lab-tested. We ensure that 
              your creative journey is as beautiful, safe, and professional as the finished product.
            </p>
            <p style={{ color: 'var(--charcoal)', lineHeight: 1.8 }}>
              Today, from our Mumbai base, we're proud to support thousands of hobbyists and 
              small business owners across India. We believe in transparency, quality, and the 
              undeniable magic of a perfectly poured candle.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
             <div style={{ 
               width: '100%', 
               aspectRatio: '4/5', 
               background: 'linear-gradient(135deg, #e8d8c0, #c8a870)', 
               borderRadius: '4px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               overflow: 'hidden'
             }}>
               <img src="/logo.png" alt="Timtim" style={{ width: '65%', objectFit: 'contain', opacity: 0.9 }} />
             </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 20px', background: 'var(--charcoal)', color: 'var(--cream)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '40px' }}>Our Core <em>Values</em></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--amber)' }}>✦</div>
            <h4 style={{ marginBottom: '10px', fontWeight: 600 }}>Uncompromising Quality</h4>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>We test every batch of wax and fragrance ourselves to ensure your candles burn cleanly and smell incredible.</p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--amber)' }}>🌿</div>
            <h4 style={{ marginBottom: '10px', fontWeight: 600 }}>Eco-Conscious Choice</h4>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>We prioritize biodegradable waxes and ethically produced oils. Good for your home, good for the planet.</p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--amber)' }}>🚛</div>
            <h4 style={{ marginBottom: '10px', fontWeight: 600 }}>Mumbai Speed</h4>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Based in the heart of Mumbai, we dispatch orders within 24 working hours to keep your production moving.</p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--amber)' }}>🤝</div>
            <h4 style={{ marginBottom: '10px', fontWeight: 600 }}>For Every Maker</h4>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Whether you're pouring your first candle or your thousandth, we're here to provide the support and tools you need.</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '20px' }}>Ready to start your <em>first</em> pour?</h2>
        <p style={{ color: 'var(--warm-gray)', marginBottom: '32px' }}>Explore our hand-curated kits and find your perfect fragrance.</p>
        <button className="btn-dark" onClick={() => window.location.href='/products'}>Explore Supplies →</button>
      </section>
    </div>
  );
}
