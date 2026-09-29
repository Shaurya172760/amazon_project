import { deliveryOptions } from "./deliveryOptions.js";
import { products } from "./products.js";

export const cart = JSON.parse(localStorage.getItem('cart')) || [];

export function saveToStorage() {
  localStorage.setItem('cart',JSON.stringify(cart));
}

export function addToCart(button, qty = 1) {
  const {productId} = button.dataset;
  let isInCart = false;
  if (Object.keys(button.dataset).length === 1) {
    document.querySelector(`.added-to-cart[data-product-id="${productId}"]`).style.opacity = '1';
    setTimeout(() => document.querySelector(`.added-to-cart[data-product-id="${productId}"]`).style.opacity = '0',1200);
  };
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      isInCart = true;
      cartItem.quantity += qty;
    }
  });
  if (!isInCart) {
    cart.push({
      productId:productId, 
      quantity:qty, 
      deliveryOptionId:'1'
    });
  }

  saveToStorage();
}

export function removeCartItem(productId) {
  let delIndex = 0;
  cart.forEach((cartItem,i) => {
    if (productId === cartItem.productId) {
      delIndex = i;
    }
  });
  cart.splice(delIndex, 1);
    
  saveToStorage();
}

export function cartTotal() {
  let cartTotal=0;
  cart.forEach((cartItem) => cartTotal += cartItem.quantity);
  return cartTotal
}

export function updateCart(productId) { 
  let qty = 0;
  cart.forEach(cartItem => {
    if (productId === cartItem.productId) {
      qty = cartItem.quantity;
    }
  });
  if (document.querySelector(`.js-updateCrtItmBtn[data-product-id="${productId}"]`).innerText === 'Update') {
    document.querySelector(`.quantity-label[data-product-id="${productId}"]`).innerHTML = `<input type="number" value="${qty}" min="1" name="quantity" class="updateQtyInput"/>`;
    document.querySelector(`.js-updateCrtItmBtn[data-product-id="${productId}"]`).innerText = 'Save';
    return false;
  } else {
    const newQty = Number(document.querySelector('.updateQtyInput').value);
    cart.forEach(cartItem => {
      if (productId === cartItem.productId) {
        cartItem.quantity = newQty;
        
      }
    });
    document.querySelector(`.quantity-label[data-product-id="${productId}"]`).innerHTML = `${qty}`;
    document.querySelector(`.js-updateCrtItmBtn[data-product-id="${productId}"]`).innerText = 'Update';
    return true;
  }
}

export function updateDeliveryOption(productId,deliveryOptionId) {
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.deliveryOptionId = deliveryOptionId;
    }
  });

  saveToStorage();
}