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
        <p className="hero-eyebrow" style={{ letterSpacing: '0.2em', color: 'var(--amber)', textTransform: 'uppercase', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}>Our Story</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400 }}>Timtim <em>by Aritri</em></h1>
        <p style={{ maxWidth: '700px', margin: '24px auto 0', color: 'var(--warm-gray)', lineHeight: 1.6, fontSize: '1.1rem' }}>
          Crafting more than just supplies — we're building a community of illuminators. 
          What started as a personal passion for hand-poured candles has evolved into India's 
          most trusted source for premium candle-making raw materials.
        </p>
      </section>

      <section style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '24px' }}>The <em>Philosophy</em></h2>
            <p style={{ color: 'var(--charcoal)', lineHeight: 1.8, marginBottom: '20px' }}>
              At Timtim, we believe every candle tells a story. Whether it's a gift for a loved one 
              or a moment of self-care, the quality of materials defines the soul of the final pour. 
            </p>
            <p style={{ color: 'var(--charcoal)', lineHeight: 1.8 }}>
              We hand-select every wax, fragrance, and mould in our catalog. From our non-GMO pure soy 
              waxes to our ethically sourced fragrances, we ensure that your creative journey is 
              as beautiful as the finished product.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
             <div style={{ 
               width: '100%', 
               aspectRatio: '4/5', 
               background: '#e8d8c0', 
               borderRadius: '4px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               fontSize: '5rem'
             }}>🕯️</div>
             <div style={{ 
               position: 'absolute', 
               bottom: '-20px', 
               right: '-20px', 
               width: '60%', 
               aspectRatio: '1/1', 
               background: '#d8e8d8', 
               borderRadius: '4px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               fontSize: '3rem',
               boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
             }}>🌿</div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 20px', background: 'var(--charcoal)', color: 'var(--cream)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '40px' }}>Why choose <em>Timtim?</em></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>✦</div>
            <h4 style={{ marginBottom: '10px', fontWeight: 600 }}>Purest Materials</h4>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Lab-tested waxes and fragrances that ensure a clean, long-lasting burn every single time.</p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🚛</div>
            <h4 style={{ marginBottom: '10px', fontWeight: 600 }}>Fast Delivery</h4>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>We process orders within 24 working hours because we know your creativity can't wait.</p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>💡</div>
            <h4 style={{ marginBottom: '10px', fontWeight: 600 }}>Expert Advice</h4>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Complete beginner? Our support team and kits provide everything you need to start with confidence.</p>
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
