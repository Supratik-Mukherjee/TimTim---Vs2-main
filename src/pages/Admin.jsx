import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db, storage } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Admin() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '', price: '', qty: '', sku: '', cat: 'Candle Waxes', desc: ''
  });
  const [hasWeightTiers, setHasWeightTiers] = useState(false);
  const [weightTiers, setWeightTiers] = useState([
    { weight: '1 kg', price: '' }
  ]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  useEffect(() => {
    if (!currentUser) return;

    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(fetched);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
      showMsg('Error loading inventory', 'error');
    });

    return () => unsub();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      showMsg("Product deleted safely.");
    } catch (e) {
      showMsg("Error deleting product", 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = null;
      if (file) {
        try {
          const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(fileRef, file);
          imageUrl = await getDownloadURL(snapshot.ref);
        } catch (storageErr) {
          console.error("Storage Error:", storageErr);
          showMsg("Image upload failed, creating without image.", "error");
        }
      }

      // Build weight tiers if enabled
      const tiers = hasWeightTiers
        ? weightTiers.filter(t => t.weight && t.price).map(t => ({ weight: t.weight, price: Number(t.price) }))
        : [];

      const productData = {
        name: form.name,
        shortName: form.name,
        price: hasWeightTiers && tiers.length > 0 ? tiers[0].price : Number(form.price),
        sku: form.sku,
        cat: form.cat,
        desc: form.desc,
        quantity: Number(form.qty),
        imageUrl: imageUrl,
        bg: 'c-wax',
        badges: [],
        weightTiers: tiers,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'products'), productData);

      showMsg("Product added successfully!");
      setForm({ name: '', price: '', qty: '', sku: '', cat: 'Candle Waxes', desc: '' });
      setHasWeightTiers(false);
      setWeightTiers([{ weight: '1 kg', price: '' }]);
      setFile(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
      showMsg(err.message || "Error uploading product", 'error');
    } finally {
      setUploading(false);
    }
  };

  if (!currentUser) {
    return (
      <div id="admin-auth" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="auth-box" style={{ textAlign: 'center' }}>
          <h2>Admin Access Required</h2>
          <p style={{ marginBottom: '20px', color: 'var(--warm-gray)' }}>You must be signed in to view this page.</p>
          <button className="auth-btn" onClick={() => window.location.href = '/login'}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard">
      <header className="admin-header">
        <h1>Timtim Dashboard</h1>
      </header>

      <main className="admin-main">
        <section className="admin-panel">
          <h3>Add New Product</h3>
          <form className="add-product-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="p-name">Product Title</label>
              <input type="text" id="p-name" required placeholder="e.g. Soy Wax WP565" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="form-row">
              {!hasWeightTiers && (
                <div className="form-group">
                  <label htmlFor="p-price">Price (₹)</label>
                  <input type="number" id="p-price" required={!hasWeightTiers} placeholder="295" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="p-qty">Stock Qty</label>
                <input type="number" id="p-qty" required placeholder="50" min="0" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={hasWeightTiers} onChange={e => setHasWeightTiers(e.target.checked)} style={{ accentColor: 'var(--amber, #C4883A)' }} />
                Has Weight-Based Pricing
              </label>
            </div>

            {hasWeightTiers && (
              <div className="form-group" style={{ background: '#f8f6f2', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
                <label style={{ marginBottom: '10px', display: 'block', fontWeight: 600 }}>Weight Tiers</label>
                {weightTiers.map((tier, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="e.g. 1 kg"
                      value={tier.weight}
                      onChange={e => {
                        const updated = [...weightTiers];
                        updated[idx].weight = e.target.value;
                        setWeightTiers(updated);
                      }}
                      style={{ flex: 1, padding: '8px 12px', border: '1px solid #d4cfc6', borderRadius: '4px', fontSize: '13px' }}
                    />
                    <input
                      type="number"
                      placeholder="Price ₹"
                      min="0"
                      value={tier.price}
                      onChange={e => {
                        const updated = [...weightTiers];
                        updated[idx].price = e.target.value;
                        setWeightTiers(updated);
                      }}
                      style={{ flex: 1, padding: '8px 12px', border: '1px solid #d4cfc6', borderRadius: '4px', fontSize: '13px' }}
                    />
                    {weightTiers.length > 1 && (
                      <button type="button" onClick={() => setWeightTiers(weightTiers.filter((_, i) => i !== idx))} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px', lineHeight: 1 }}>×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setWeightTiers([...weightTiers, { weight: '', price: '' }])} style={{ background: 'none', border: '1px dashed #aaa', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', color: '#666', marginTop: '4px' }}>+ Add Tier</button>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="p-sku">SKU</label>
              <input type="text" id="p-sku" required placeholder="WP565" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
            </div>

            <div className="form-group">
              <label htmlFor="p-cat">Category</label>
              <select id="p-cat" required value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}>
                <option value="Candle Waxes">Candle Waxes</option>
                <option value="Silicon Moulds">Silicon Moulds</option>
                <option value="Fragrance Oils">Fragrance Oils</option>
                <option value="Essential Tools">Essential Tools</option>
                <option value="Containers">Containers</option>
                <option value="Beginner Kits">Beginner Kits</option>
                <option value="Colors">Colors</option>
                <option value="Concrete Items">Concrete Items</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="p-desc">Description</label>
              <textarea id="p-desc" required placeholder="Describe the product..." value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="p-image">Product Image</label>
              <input type="file" id="p-image" accept="image/png, image/jpeg, image/webp" required style={{ border: 'none', padding: 0 }} onChange={e => setFile(e.target.files[0])} />
            </div>

            <button type="submit" className="submit-btn" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Product'}
            </button>
          </form>
        </section>

        <section className="admin-panel" style={{ overflowX: 'auto' }}>
          <h3>Current Inventory</h3>
          <table id="products-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--admin-border)' }}>
                <th style={{ padding: '12px' }}>Image</th>
                <th style={{ padding: '12px' }}>Product Name</th>
                <th style={{ padding: '12px' }}>SKU &amp; Cat</th>
                <th style={{ padding: '12px' }}>Price</th>
                <th style={{ padding: '12px' }}>Stock</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody id="products-tbody">
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Loading inventory...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>No products found in DB</td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                    <td style={{ padding: '12px' }}>
                      <div className="thumb-cell" style={p.imageUrl ? { backgroundImage: `url('${p.imageUrl}')`, width: 40, height: 40, backgroundSize: 'cover', borderRadius: 4 } : { width: 40, height: 40, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
                        {!p.imageUrl && (p.emoji || '📦')}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, padding: '12px' }}>{p.name}</td>
                    <td style={{ fontSize: '12px', color: '#64748b', padding: '12px' }}>{p.sku}<br />{p.cat}</td>
                    <td style={{ fontWeight: 500, padding: '12px' }}>₹{p.price}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`status-badge ${p.quantity < 10 ? 'low' : ''}`} style={{ padding: '4px 8px', borderRadius: 12, background: p.quantity < 10 ? '#fee2e2' : '#dcfce7', color: p.quantity < 10 ? '#991b1b' : '#166534', fontSize: 12 }}>
                        {p.quantity || 0} in stock
                      </span>
                    </td>
                    <td className="actions-cell" style={{ padding: '12px' }}>
                      <button onClick={() => handleDelete(p.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>

      {msg.text && (
        <div className={`toast show`} style={{ background: msg.type === 'error' ? '#ef4444' : '#10b981' }}>{msg.text}</div>
      )}
    </div>
  );
}
