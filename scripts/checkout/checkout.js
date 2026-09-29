import { renderCart } from './orderSummary.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { loadProducts } from '../../data/products.js';
// import '../../data/backend-practice.js';

loadProducts(() => {
  renderCart();
  renderPaymentSummary();
});


