import { cart, cartTotal } from '../../data/cart.js';
import { products } from '../../data/products.js';
import { deliveryOptions } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../../utils/money.js';
import { addOrder } from '../../data/orders.js';

export function renderPaymentSummary() {
  let totalPriceItems = 0;
  cart.forEach(cartItem => {
    products.forEach(product => {
      if (cartItem.productId === product.id) {
        totalPriceItems += product.priceCents * cartItem.quantity;

      }
    });
  });

  let shippingCost = 0;
  cart.forEach(cartItem => {
    deliveryOptions.forEach(deliveryOption => {
      if (cartItem.deliveryOptionId === deliveryOption.id) {
        shippingCost += deliveryOption.priceCents;
      }
    });
  })

  const totalBeforeTax = totalPriceItems + shippingCost;
  const tax = totalBeforeTax*0.1;
  const finalTotal = totalBeforeTax*1.1;

  document.querySelector('.payment-summary').innerHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${cartTotal()}):</div>
      <div class="payment-summary-money">\$${formatCurrency(totalPriceItems)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">\$${formatCurrency(shippingCost)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">\$${formatCurrency(totalBeforeTax)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">\$${formatCurrency(tax)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">\$${formatCurrency(finalTotal)}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `

  document.querySelector('.place-order-button')
    .addEventListener('click', async () => {
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart
        })
      })

      const order = await response.json()
      addOrder(order);
      window.location.href= "orders.html";
      localStorage.setItem('cart',JSON.stringify([]));
      cart = [];
      document.querySelector('.cart-quantity').innerText = '0';
    });

  if (cartTotal() === 0) {
    document.querySelector('.place-order-button').disabled = true;
  }
}