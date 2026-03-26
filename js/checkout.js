/* ═══════════════════════════════════════════════
   CHECKOUT.JS — Checkout form, payment selection,
                 validation, order placement,
                 success page
   Timtim by Aritri
═══════════════════════════════════════════════ */

const CheckoutPage = (() => {

  let _selectedPayment = 'card';

  /* ── ENTER HOOK ─────────────────────────── */
  function onEnter() {
    if (State.cart.isEmpty()) {
      UI.toast('Your cart is empty — add items first');
      Router.go('home');
      return;
    }
    renderSummary();
    resetForm();
    selectPayment('card');
    setupCardFormatting();
  }

  /* ── RENDER ORDER SUMMARY SIDEBAR ───────── */
  function renderSummary() {
    const itemsEl = document.getElementById('cs-items');
    if (itemsEl) {
      itemsEl.innerHTML = State.cart.getAll().map(item => `
        <div class="cs-item">
          <span class="cs-item-name">${UI.esc(item.name)} × ${item.qty}</span>
          <span class="cs-item-price">${UI.formatPrice(item.price * item.qty)}</span>
        </div>
      `).join('');
    }

    const shipping = State.cart.shipping();
    const total    = State.cart.total();

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setText('cs-sub',   UI.formatPrice(State.cart.subtotal()));
    setText('cs-ship',  shipping === 0 ? 'Free' : UI.formatPrice(shipping));
    setText('cs-total', UI.formatPrice(total));

    const note = document.getElementById('cs-shipping-note');
    if (note) {
      note.textContent = shipping === 0
        ? '✓ Free shipping on this order'
        : `Add ${UI.formatPrice(DATA.freeShippingThreshold - State.cart.subtotal())} more for free shipping`;
    }
  }

  /* ── PAYMENT SELECTION ──────────────────── */
  function selectPayment(type) {
    _selectedPayment = type;

    // Update option styling
    ['card', 'upi', 'cod', 'wa'].forEach(t => {
      const el = document.getElementById('pay-opt-' + t);
      if (!el) return;
      el.classList.toggle('selected', t === type);
      const radio = el.querySelector('input[type="radio"]');
      if (radio) radio.checked = t === type;
    });

    // Show/hide extra fields
    const cardFields = document.getElementById('card-fields');
    const upiFields  = document.getElementById('upi-field');
    if (cardFields) cardFields.classList.toggle('show', type === 'card');
    if (upiFields)  upiFields.classList.toggle('show',  type === 'upi');
  }

  /* ── FORM RESET ─────────────────────────── */
  function resetForm() {
    const fields = [
      'cf-first','cf-last','cf-email','cf-phone',
      'cf-addr1','cf-addr2','cf-city','cf-pin',
      'cf-state','cf-card-num','cf-expiry','cf-cvv','cf-upi',
    ];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.value = '';
      el.classList.remove('error');
    });

    const btn = document.querySelector('.place-order-btn');
    if (btn) { btn.textContent = 'Place Order →'; btn.disabled = false; }
  }

  /* ── VALIDATION ─────────────────────────── */
  function validate() {
    const required = [
      { id: 'cf-first', label: 'First name' },
      { id: 'cf-last',  label: 'Last name' },
      { id: 'cf-email', label: 'Email address' },
      { id: 'cf-phone', label: 'Phone number' },
      { id: 'cf-addr1', label: 'Address' },
      { id: 'cf-city',  label: 'City' },
      { id: 'cf-pin',   label: 'Pincode' },
      { id: 'cf-state', label: 'State' },
    ];

    let firstError = null;
    let allValid   = true;

    required.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const empty = !el.value.trim();
      el.classList.toggle('error', empty);
      if (empty) {
        allValid = false;
        if (!firstError) firstError = el;
        // Remove error on input
        el.addEventListener('input', () => el.classList.remove('error'), { once: true });
      }
    });

    if (!allValid) {
      if (firstError) firstError.focus();
      UI.toast('Please fill in all required fields');
      return false;
    }

    // Email format
    const emailEl = document.getElementById('cf-email');
    if (emailEl && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl.classList.add('error');
      emailEl.focus();
      UI.toast('Please enter a valid email address');
      return false;
    }

    // Pincode
    const pinEl = document.getElementById('cf-pin');
    if (pinEl && !/^\d{6}$/.test(pinEl.value.trim())) {
      pinEl.classList.add('error');
      pinEl.focus();
      UI.toast('Please enter a valid 6-digit pincode');
      return false;
    }

    // Card fields if card selected
    if (_selectedPayment === 'card') {
      const cardNum = document.getElementById('cf-card-num');
      const expiry  = document.getElementById('cf-expiry');
      const cvv     = document.getElementById('cf-cvv');
      const digits  = (cardNum?.value || '').replace(/\s/g, '');
      if (digits.length < 16) {
        cardNum?.classList.add('error');
        UI.toast('Please enter a valid 16-digit card number');
        return false;
      }
      if (!(expiry?.value || '').includes('/')) {
        expiry?.classList.add('error');
        UI.toast('Please enter a valid expiry date');
        return false;
      }
      if ((cvv?.value || '').length < 3) {
        cvv?.classList.add('error');
        UI.toast('Please enter a valid CVV');
        return false;
      }
    }

    // UPI ID if upi selected
    if (_selectedPayment === 'upi') {
      const upiEl = document.getElementById('cf-upi');
      if (upiEl && !upiEl.value.includes('@')) {
        upiEl.classList.add('error');
        UI.toast('Please enter a valid UPI ID (e.g. name@upi)');
        return false;
      }
    }

    return true;
  }

  /* ── PLACE ORDER ────────────────────────── */
  function placeOrder() {
    if (State.cart.isEmpty()) { UI.toast('Cart is empty!'); return; }
    if (!validate()) return;

    if (_selectedPayment === 'wa') {
      _placeWhatsAppOrder();
    } else {
      _placeSimulatedOrder();
    }
  }

  function _placeWhatsAppOrder() {
    const name  = _fieldVal('cf-first') + ' ' + _fieldVal('cf-last');
    const phone = _fieldVal('cf-phone');
    const addr  = [
      _fieldVal('cf-addr1'),
      _fieldVal('cf-addr2'),
      _fieldVal('cf-city'),
      _fieldVal('cf-pin'),
      _fieldVal('cf-state'),
    ].filter(Boolean).join(', ');

    const items = State.cart.getAll()
      .map(i => `${i.name} × ${i.qty} = ${UI.formatPrice(i.price * i.qty)}`).join('\n');

    const msg = `Hi! I'd like to place an order 🕯️\n\nName: ${name}\nPhone: ${phone}\nAddress: ${addr}\n\nItems:\n${items}\n\nTotal: ${UI.formatPrice(State.cart.total())}\n\nPlease confirm my order!`;

    window.open(
      `https://wa.me/${DATA.whatsappNumber}?text=${encodeURIComponent(msg)}`,
      '_blank'
    );
    _finishOrder();
  }

  function _placeSimulatedOrder() {
    const btn = document.querySelector('.place-order-btn');
    if (btn) {
      btn.textContent = 'Processing…';
      btn.disabled    = true;
    }
    setTimeout(_finishOrder, 2000);
  }

  function _finishOrder() {
    const orderId = 'TT-' + Math.floor(100000 + Math.random() * 900000);
    const numEl   = document.getElementById('order-number');
    if (numEl) numEl.textContent = '#' + orderId;

    State.cart.clear();
    UI.updateNav();
    Router.go('success');
  }

  /* ── CARD INPUT FORMATTING ──────────────── */
  function setupCardFormatting() {
    const cardEl   = document.getElementById('cf-card-num');
    const expiryEl = document.getElementById('cf-expiry');
    const pinEl    = document.getElementById('cf-pin');

    if (cardEl) {
      cardEl.addEventListener('input', function () {
        const digits = this.value.replace(/\D/g, '').slice(0, 16);
        this.value   = digits.replace(/(.{4})/g, '$1 ').trim();
      });
    }

    if (expiryEl) {
      expiryEl.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '').slice(0, 4);
        if (v.length > 2) v = v.slice(0, 2) + ' / ' + v.slice(2);
        this.value = v;
      });
    }

    if (pinEl) {
      pinEl.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
      });
    }
  }

  /* ── HELPER ─────────────────────────────── */
  function _fieldVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  /* ── SUCCESS PAGE ENTER HOOK ────────────── */
  function onSuccessEnter() {
    // Nothing extra needed — order number already set by _finishOrder
  }

  return {
    onEnter,
    onSuccessEnter,
    selectPayment,
    placeOrder,
  };

})();
