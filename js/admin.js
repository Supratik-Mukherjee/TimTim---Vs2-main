/* ═══════════════════════════════════════════════
   ADMIN.JS — Admin Dashboard Controller
   Timtim by Aritri
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  if (!window.FB) {
    showToast("Firebase not initialized. Check firebase-init.js");
    return;
  }

  const { auth, db, storage, serverTimestamp } = window.FB;

  const authView = document.getElementById('admin-auth');
  const dashView = document.getElementById('admin-dashboard');
  
  const loginForm = document.getElementById('auth-form');
  const logoutBtn = document.getElementById('logout-btn');
  const addForm   = document.getElementById('add-product-form');
  const tbody     = document.getElementById('products-tbody');
  
  // -- TOAST HELPERS
  let _tTimer;
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(_tTimer);
    _tTimer = setTimeout(() => t.classList.remove('show'), 3000);
  }

  // ── AUTHENTICATION ──────────────────────────────────────────

  auth.onAuthStateChanged(user => {
    if (user) {
      authView.style.display = 'none';
      dashView.style.display = 'block';
      loadInventory();
      showToast("Logged in as Admin");
    } else {
      authView.style.display = 'flex';
      dashView.style.display = 'none';
    }
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const pass  = document.getElementById('auth-password').value;
    const btn   = document.getElementById('login-btn');
    btn.textContent = "Logging In...";
    btn.disabled = true;

    auth.signInWithEmailAndPassword(email, pass)
      .then(() => {
        btn.textContent = "Log In Session";
        btn.disabled = false;
        loginForm.reset();
      })
      .catch(err => {
        showToast("Login Failed: " + err.message);
        btn.textContent = "Log In Session";
        btn.disabled = false;
      });
  });

  logoutBtn.addEventListener('click', () => {
    auth.signOut();
  });


  // ── INVENTORY TABLE ──────────────────────────────────────────

  function loadInventory() {
    db.collection('products').onSnapshot(snap => {
      if (snap.empty) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No products found in DB</td></tr>';
        return;
      }

      let html = '';
      snap.forEach(doc => {
        const p = doc.data();
        const id = doc.id;
        
        // Thumb fallback
        const thumbStyle = p.imageUrl ? `background-image:url('${p.imageUrl}')` : '';
        const thumbHTML = p.imageUrl ? '' : p.emoji || '📦';
        const qty = p.quantity !== undefined ? p.quantity : 0;
        const lowStock = qty < 10 ? 'low' : '';

        html += `
          <tr>
            <td>
              <div class="thumb-cell" style="${thumbStyle}">${thumbHTML}</div>
            </td>
            <td style="font-weight:600;">${p.name}</td>
            <td style="font-size:12px;color:#64748b;">${p.sku}<br>${p.cat}</td>
            <td style="font-weight:500;">₹${p.price}</td>
            <td><span class="status-badge ${lowStock}">${qty} in stock</span></td>
            <td class="actions-cell">
              <button onclick="deleteProduct('${id}')">Delete</button>
            </td>
          </tr>
        `;
      });
      tbody.innerHTML = html;
    }, err => {
      showToast("Error loading inventory");
      console.error(err);
    });
  }

  // ── CRUD OPERATIONS ──────────────────────────────────────────

  window.deleteProduct = async function(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await db.collection('products').doc(id).delete();
      showToast("Product deleted safely.");
    } catch(err) {
      showToast("Error deleting product");
    }
  };

  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('add-btn');
    btn.textContent = "Uploading...";
    btn.disabled = true;

    try {
      const file = document.getElementById('p-image').files[0];
      let imageUrl = null;

      // 1. Upload Image to Storage
      if (file) {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`products/${Date.now()}_${file.name}`);
        const snapshot = await fileRef.put(file);
        imageUrl = await snapshot.ref.getDownloadURL();
      }

      // 2. Build product document
      // Generating a unique ID string here manually or let firestore assign. 
      // Using firestore auto-id collection.add()
      
      const productData = {
        name: document.getElementById('p-name').value,
        shortName: document.getElementById('p-name').value, // Fallback
        price: Number(document.getElementById('p-price').value),
        sku: document.getElementById('p-sku').value,
        cat: document.getElementById('p-cat').value,
        desc: document.getElementById('p-desc').value,
        quantity: Number(document.getElementById('p-qty').value),
        imageUrl: imageUrl, // New image property
        bg: 'c-wax', // Safe fallback
        badges: [],
        createdAt: serverTimestamp()
      };

      await db.collection('products').add(productData);
      
      showToast("Product added successfully!");
      addForm.reset();
    } catch (err) {
      console.error(err);
      showToast("Error uploading product: " + err.message);
    } finally {
      btn.textContent = "Upload Product";
      btn.disabled = false;
    }
  });

});
