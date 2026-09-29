import { orders } from '../data/orders.js';
import { formatCurrency } from '../utils/money.js';
import { products as productItems, loadProducts } from '../data/products.js';
import { cart, addToCart, cartTotal } from '../data/cart.js';

function renderOrdersPage() {
  function orderDateFormat(dateString) {
    const dateTimeList = dateString.split('T');
    const dateList = dateTimeList[0].split('-');
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    months.forEach((month,i) => {
      if (Number(dateList[1]) === i+1) {
        dateList[1] = months[i];
      }
    });
    return `${dateList[1]} ${dateList[2]}`;
  }
  
  let ordersHTML = '';

  loadProducts(() => {
    let orderHTML = '';
    document.querySelector('.cart-quantity').innerHTML = cartTotal();
    orders.forEach(order => {
      order.products.forEach((product) => {
        productItems.forEach((productItem,i) => {
          if (productItem.id === product.productId) {
            orderHTML += `
              <div class="product-image-container">
                <img src="${productItem.image}">
              </div>

              <div class="product-details">
                <div class="product-name">
                  ${productItem.name}
                </div>
                <div class="product-delivery-date">
                  Arriving on: ${orderDateFormat(product.estimatedDeliveryTime)}
                </div>
                <div class="product-quantity">
                  Quantity: ${product.quantity}
                </div>
                <button class="buy-again-button button-primary" data-product-id="${product.productId}" data-order-id="${order.id}">
                  <img class="buy-again-icon" src="images/icons/buy-again.png">
                  <span class="buy-again-message">Buy it again</span>
                </button>
              </div>

              <div class="product-actions">
                <button class="track-package-button button-secondary" data-product-id="${productItem.id}" data-order-id="${order.id}">
                  Track package
                </button>
              </div>
            `
          }
        })
      });

      ordersHTML += `
        <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderDateFormat(order.orderTime)}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>\$${formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
            ${orderHTML}
          </div>
        </div>
      `
      orderHTML = '';
    })

    document.querySelector('.orders-grid').innerHTML = ordersHTML;

    orders.forEach(order => {
      order.products.forEach(product => {
        // Buy it again Btn
        document.querySelector(`.buy-again-button[data-product-id="${product.productId}"][data-order-id="${order.id}"]`)
          .addEventListener('click', event => {
            productItems.forEach(productItem => {
              if (productItem.id === product.productId) {
                addToCart(event.currentTarget);
              }
            });
            document.querySelector(`.buy-again-button[data-product-id="${product.productId}"][data-order-id="${order.id}"]`).innerHTML = `
              <span class="buy-again-message">&#x2713; Added</span>
            `;
            setTimeout(() => {
              document.querySelector(`.buy-again-button[data-product-id="${product.productId}"][data-order-id="${order.id}"]`).innerHTML = `
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              `
            },1500);
            document.querySelector('.cart-quantity').innerHTML = `${cartTotal()}`;
          });
        // Track Package Btn
        document.querySelector(`.track-package-button[data-product-id="${product.productId}"][data-order-id="${order.id}"]`)
          .addEventListener('click', () => {
            window.location.href = `tracking.html?orderId=${order.id}&productId=${product.productId}`;
          });
      });
    });

  });
}

renderOrdersPage();