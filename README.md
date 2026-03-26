# Timtim by Aritri — Frontend Prototype

A fully functional SPA prototype for a premium candle-making supplies store.  
No build tools, no frameworks, no dependencies — open `index.html` in a browser.

---

## 📁 Project Structure

```
timtim/
│
├── index.html              ← Main shell (entry point — open this)
│
├── css/
│   ├── base.css            ← Design tokens, reset, shared utilities, animations
│   ├── nav.css             ← Announcement bar, navigation, mobile menu
│   ├── home.css            ← Hero, trust bar, categories, promo, fragrances, newsletter, footer
│   ├── product.css         ← Product detail layout, gallery, specs, tabs
│   ├── cart.css            ← Cart page layout, item rows, order summary
│   └── checkout.css        ← Checkout form, payment methods, success page
│
├── js/
│   ├── data.js             ← All product & category data (edit products here)
│   ├── state.js            ← Cart, wishlist & coupon state (sessionStorage)
│   ├── router.js           ← SPA page navigation system
│   ├── ui.js               ← Shared UI utilities (toast, reveal, nav badges)
│   ├── home.js             ← Home page rendering logic
│   ├── product.js          ← Product detail page logic
│   ├── cart.js             ← Cart page rendering & interactions
│   ├── checkout.js         ← Checkout form, validation, payment, order
│   └── app.js              ← Entry point — wires everything on DOMContentLoaded
│
└── pages/                  ← HTML partials (reference copies; content is in index.html)
    ├── home.html
    ├── product.html
    ├── cart.html
    ├── checkout.html
    └── success.html
```

---

## 🚀 Getting Started

```bash
# Option 1 — open directly (works for most browsers)
open index.html

# Option 2 — local server (recommended, avoids any CORS issues)
npx serve .
# or
python3 -m http.server 8000
```

Then visit `http://localhost:8000`

---

## ✏️ How to Make Common Changes

### Add or edit a product
Open `js/data.js` and add/modify an entry in the `products` array.  
Each product has: `id, name, shortName, price, sku, cat, emoji, bg, badges, originalPrice, desc, specs, usage, related`

### Change prices or discount thresholds
In `js/data.js`:
```js
DATA.freeShippingThreshold = 999;  // free shipping above this
DATA.shippingCost          = 60;   // flat shipping fee
DATA.promoCodes            = { TIMTIM10: 10, FIRST15: 15 }; // code → % discount
```

### Update contact details
In `js/data.js`:
```js
DATA.whatsappNumber = '919899131167';
DATA.email          = 'support@timtimbyaritri.com';
DATA.instagram      = 'https://www.instagram.com/candle_rawmaterial';
```

### Change colours / brand tokens
Open `css/base.css` and edit the `:root` block:
```css
:root {
  --amber:      #C4883A;   /* primary accent */
  --charcoal:   #1C1A18;   /* dark background */
  --cream:      #F9F4EC;   /* page background */
  ...
}
```

### Add a new CSS section
Create a new file in `css/` and add a `<link>` for it in `index.html` after the existing links.

### Add a new page
1. Add a `<div id="page-yourpage" class="page">` block in `index.html`
2. Register it in `js/app.js`:  
   `Router.register('yourpage', { onEnter: YourPage.onEnter });`
3. Navigate to it anywhere with:  
   `Router.go('yourpage', { anyParam: 'value' });`

---

## 🛒 Features

| Feature | Details |
|---|---|
| **Landing page** | Hero, trust bar, category grid, wax products, promo banners, fragrances, newsletter, footer |
| **Product detail** | Gallery, specs grid, quantity selector, add to cart, wishlist, 3 info tabs, related products |
| **Cart** | Quantity controls, remove items, live order summary, promo codes, free shipping logic |
| **Checkout** | Full shipping form with validation, 4 payment methods (card, UPI, COD, WhatsApp) |
| **Order success** | Confirmation with generated order number, WhatsApp tracking link |
| **State** | Cart & wishlist persist across page navigation via `sessionStorage` |
| **Promo codes** | Try `TIMTIM10`, `ARITRI10`, `CANDLE10` (10% off), `FIRST15` (15% off) |
| **Responsive** | Fully mobile-optimised at 480px, 900px, 1100px breakpoints |
| **Accessible** | ARIA labels, skip link, focus-visible, keyboard navigation, reduced-motion support |

---

## 📦 To Deploy

This is a static site — drop the entire `timtim/` folder onto any host:

- **Netlify** — drag & drop the folder on netlify.com/drop
- **Vercel** — `vercel deploy`
- **GitHub Pages** — push to a repo and enable Pages
- **Shared hosting** — upload via FTP, point domain to `index.html`

No server or database required.

---

## 🔧 Next Steps for Production

- Replace emoji placeholders with real product photography
- Connect a real payment gateway (Razorpay, PayU, Cashfree)
- Add a backend or headless CMS for live product management
- Integrate WhatsApp Business API for automated order confirmations
- Add Google Analytics / Meta Pixel for conversion tracking
