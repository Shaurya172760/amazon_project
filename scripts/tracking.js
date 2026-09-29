import { orders } from "../data/orders.js";
import { products as productItems, loadProducts } from "../data/products.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

const url = new URL(window.location.href);
const orderId = url.searchParams.get('orderId');
const productId = url.searchParams.get('productId');

console.log(orders);

loadProducts(() => {
  orders.forEach(order => {
    if (order.id === orderId) {
      order.products.forEach(product => {
        if (product.productId === productId) {
          let productItem;
          productItems.forEach(productListItem => {
            if (productListItem.id === productId) {
              productItem = productListItem;
            }
          })
          const date = dayjs(product.estimatedDeliveryTime);

          const HTML = `
            <div class="order-tracking">
              <a class="back-to-orders-link link-primary" href="orders.html">
                View all orders
              </a>

              <div class="delivery-date">
                Arriving on ${date.format('dddd, MMMM D')}
              </div>

              <div class="product-info">
                ${productItem.name}
              </div>

              <div class="product-info">
                Quantity: ${product.quantity}
              </div>

              <img class="product-image" src="${productItem.image}">

              <div class="progress-labels-container">
                <div class="progress-label current-status" data-label="Preparing">
                  Preparing
                </div>
                <div class="progress-label" data-label="Shipped">
                  Shipped
                </div>
                <div class="progress-label" data-label="Delivered">
                  Delivered
                </div>
              </div>

              <div class="progress-bar-container">
                <div class="progress-bar"></div>
              </div>
            </div>
          `
          document.querySelector('.main').innerHTML = HTML;

          deliveryProgressBar(date,dayjs(order.orderTime));
        }
      });
    }
  });
});

function deliveryProgressBar(deliveryDate,orderDate) {
  //progress-bar
  const totalTime = deliveryDate.diff(orderDate, 'hour');
  const timeElapsed = dayjs().diff(orderDate,'hour');
  let percentTimeElapsed = Math.round(timeElapsed/totalTime * 100);
  if (percentTimeElapsed < 5) {
    percentTimeElapsed = 5;
  };
  document.querySelector('.progress-bar').style.width = (String(percentTimeElapsed) + '%');

  //progress-label
  if (percentTimeElapsed >= 50 && percentTimeElapsed !== 100) {
    document.querySelector('.progress-label[data-label="Shipped"]').classList.add('current-status');
  } else if (percentTimeElapsed === 100) {
    document.querySelector('.progress-label[data-label="Shipped"]').classList.add('current-status');
    document.querySelector('.progress-label[data-label="Delivered"]').classList.add('current-status');
  }
}