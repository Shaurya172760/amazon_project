import { deliveryOptions } from "./deliveryOptions.js";
import { products } from "./products.js";

function Cart(localStorageKey) {
  const cart = {
    cartItems:undefined,

    loadFromStorage() {
      this.cartItems = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    },
  
    saveToStorage() {
      localStorage.setItem(localStorageKey,JSON.stringify(this));
    },

    addToCart(button) {
      const {productId} = button.dataset;
      let isInCart = false;
      this.cartItems.forEach((product) => {
        if (product.id === productId) {
          isInCart = true;
          product.qty += 1;
        }
      });
      if (!isInCart) {
        this.cartItems.push({
            id:productId, 
            qty:1, 
            deliveryOptionId:'1'
        });
      }

      saveToStorage();
    },

    removeCartItem(productId) {
      let delIndex = 0;
      this.cartItems.forEach((cartItem,i) => {
        if (productId === cartItem.id) {
          delIndex = i;
        }
      });
      this.cartItems.splice(delIndex, 1);
      
      saveToStorage();
    },

    cartTotal() {
      let cartTotal=0;
      this.cartItems.forEach((cartItem) => cartTotal += cartItem.qty);
      return cartTotal
    },

    updateCart(productId) { 
      let qty = 0;
      this.cartItems.forEach((cartItem) => {
        if (productId === cartItem.id) {
          qty = cartItem.qty;
        }
      });
      if (document.querySelector(`.js-updateCrtItmBtn[data-product-id="${productId}"]`).innerText === 'Update') {
        document.querySelector(`.quantity-label[data-product-id="${productId}"]`).innerHTML = `<input type="number" value="${qty}" min="1" name="quantity" class="updateQtyInput"/>`;
        document.querySelector(`.js-updateCrtItmBtn[data-product-id="${productId}"]`).innerText = 'Save';
      } else {
        document.querySelector(`.quantity-label[data-product-id="${productId}"]`).innerHTML = `${qty}`;
        document.querySelector(`.js-updateCrtItmBtn[data-product-id="${productId}"]`).innerText = 'Update';
      }
    },

    updateDeliveryOption(productId,deliveryOptionId) {
      this.cartItems.forEach((cartItem) => {
        if (cartItem.id === productId) {
          cartItem.deliveryOptionId = deliveryOptionId;
        }
      });

      saveToStorage();
    }
  };

  return cart;
}

const cart = Cart('cart-oop');
const bizCart = Cart('biz-cart');

cart.loadFromStorage();
bizCart.loadFromStorage();

console.log(cart);
console.log(bizCart);
console.log(bizCart.cartTotal());