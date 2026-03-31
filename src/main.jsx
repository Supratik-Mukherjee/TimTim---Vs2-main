import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '../legacy_vanilla_code/css/base.css'
import '../legacy_vanilla_code/css/nav.css'
import '../legacy_vanilla_code/css/home.css'
import '../legacy_vanilla_code/css/product.css'
import '../legacy_vanilla_code/css/product-detail.css'
import '../legacy_vanilla_code/css/cart.css'
import '../legacy_vanilla_code/css/checkout.css'
import '../legacy_vanilla_code/css/pages.css'
import '../legacy_vanilla_code/css/shop.css'
import '../legacy_vanilla_code/css/login.css'
import '../legacy_vanilla_code/css/admin.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
