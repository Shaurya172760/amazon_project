import { deliveryOptions } from "./deliveryOptions.js";
import { products } from "./products.js";

class Cart {
    cartItems;
    #localStorageKey;

    constructor(localStorageKey) {
      this.#localStorageKey = localStorageKey;
      this.#loadFromStorage();
    }

    #loadFromStorage() {
      this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey)) || [];
    }
  
    saveToStorage() {
      localStorage.setItem(this.localStorageKey,JSON.stringify(this.cartItems));
    }

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
    }

    removeCartItem(productId) {
      let delIndex = 0;
      this.cartItems.forEach((cartItem,i) => {
        if (productId === cartItem.id) {
          delIndex = i;
        }
      });
      this.cartItems.splice(delIndex, 1);
      
      saveToStorage();
    }

    cartTotal() {
      let cartTotal=0;
      this.cartItems.forEach((cartItem) => cartTotal += cartItem.qty);
      return cartTotal
    }

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
    }

    updateDeliveryOption(productId,deliveryOptionId) {
      this.cartItems.forEach((cartItem) => {
        if (cartItem.id === productId) {
          cartItem.deliveryOptionId = deliveryOptionId;
        }
      });

      saveToStorage();
    }
  }

const cart = new Cart('cart-oop');
const bizCart = new Cart('biz-cart');

console.log(cart);
console.log(bizCart);
console.log(bizCart.localStorageKey);