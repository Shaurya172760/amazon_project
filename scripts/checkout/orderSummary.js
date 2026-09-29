import { cart, removeCartItem, cartTotal, updateCart, updateDeliveryOption, saveToStorage } from '../../data/cart.js';
import { products } from '../../data/products.js';
import { formatCurrency } from '../../utils/money.js';
import { deliveryOptions } from '../../data/deliveryOptions.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderCart() {
  //display cart items
  let HTML = '';
  if (cart.length === 0) {
    document.querySelector('.order-summary').innerHTML = 
      `
        <p>Your cart is empty.</p>
        <a href="amazon.html"><button class="view-products-btn button-primary">View products</button></a>
      `;
    document.querySelector('.return-to-home-link').innerText = `${cartTotal()} items`;
  } else {
    cart.forEach((cartItem,i) => { 
      products.forEach(product => {
        if (product.id === cartItem.productId) {
          let deliveryOption;
          deliveryOptions.forEach(deliveryChoice => {
            if (deliveryChoice.id === cartItem.deliveryOptionId) {
              deliveryOption = deliveryChoice
            }
          });
          const today = dayjs();
          const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
          const dateString = deliveryDate.format('dddd, MMMM D');

          HTML += `
            <div class="cart-item-container">
              <div class="delivery-date">
                Delivery date: ${dateString}
              </div>

              <div class="cart-item-details-grid">
                <img class="product-image"
                  src="${product.image}">

                <div class="cart-item-details">
                  <div class="product-name">
                    ${product.name}
                  </div>
                  <div class="product-price">
                    \$${formatCurrency(product.priceCents)}
                  </div>
                  <div class="product-quantity">
                    <span>
                      Quantity: <span class="quantity-label" data-product-id="${product.id}">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-updateCrtItmBtn" data-product-id="${product.id}">Update</span>
                    <span class="delete-quantity-link link-primary js-delCrtItmBtn" data-product-id="${product.id}">Delete</span>
                  </div>
                </div>

                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  ${deliveryOptionsHTML(product, cartItem)}
                </div>
              </div>
            </div>
          `;
        }
      });
    });
    document.querySelector('.order-summary').innerHTML = HTML;
    document.querySelector('.return-to-home-link').innerText = `${cartTotal()} items`;

    //delete cart item
    document.querySelectorAll('.js-delCrtItmBtn')
      .forEach(delBtn => 
        delBtn.addEventListener('click', () => {
          removeCartItem(delBtn.dataset.productId);
          renderCart();
          renderPaymentSummary();
        })
      );
    
    //update cart item
    document.querySelectorAll('.js-updateCrtItmBtn')
      .forEach(updateCrtItmBtn => 
        updateCrtItmBtn.addEventListener('click', () => {
          const renderCrtChk = updateCart(updateCrtItmBtn.dataset.productId);

          if (renderCrtChk) {
            saveToStorage();
            renderCart();
            renderPaymentSummary();
          }
        })
      );

    //select delivery date
    document.querySelectorAll('.delivery-option-input')
      .forEach(deliveryOptionInput => 
        deliveryOptionInput.addEventListener('change', event => {
          const productId = deliveryOptionInput.dataset.cartItemId;
          const { deliveryOptionId } = deliveryOptionInput.dataset;
          updateDeliveryOption(productId,deliveryOptionId);
          renderCart();
          renderPaymentSummary();
        })
      );
  }
}

function deliveryOptionsHTML(product, cartItem) {
  let HTML='';
  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `\$${formatCurrency(deliveryOption.priceCents)} -`
    const defaultDelivery = cartItem.deliveryOptionId === deliveryOption.id ? 'checked' : '';
    HTML += `<div class="delivery-option">
              <input type="radio" ${defaultDelivery}
                class="delivery-option-input"
                name="delivery-option-${product.id}"
                data-delivery-option-id="${deliveryOption.id}"
                data-cart-item-id="${product.id}">
              <div>
                <div class="delivery-option-date">
                  ${dateString}
                </div>
                <div class="delivery-option-price">
                  ${priceString} Shipping
                </div>
              </div>
            </div>`
  });
  return HTML
}

