import { cart, addToCart, saveToStorage, cartTotal } from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';
import { formatCurrency } from '../utils/money.js';

//searching for products
function search() {
    const searchParameter = document.querySelector('.search-bar').value;
    const searchURL = new URL(window.location.href);
    searchURL.searchParams.set('searchParameter', `${searchParameter}`);
    window.location.href = searchURL;
    loadProducts(renderProducts);
}
document.querySelector('.search-button').addEventListener('click', () => {
    search();
});
document.querySelector('.search-bar').addEventListener('keydown', event => {
    if (event.key === "Enter") {
        search();
    }
});

//Displaying all products
function renderProducts() {
    updateCartQty();
    let HTML = '';
    const searchURL = new URL(window.location.href);
    const searchParameter = searchURL.searchParams.get('searchParameter');
    let filteredProducts;
    if (searchParameter !== null) {
        filteredProducts = products.filter(
            product => product.name.toLowerCase().includes(searchParameter.toLowerCase()) || 
            product.keywords.includes(searchParameter));
            document.querySelector('.search-bar').value = `${searchParameter}`;
    } else {
        filteredProducts = products;
    }
    filteredProducts.forEach((product,i) => {
        HTML += `
            <div class="product-container">
                <div class="product-image-container">
                    <img class="product-image" src="${product.image}" />
                </div>

                <div class="product-name limit-text-to-2-lines">
                    ${product.name}
                </div>

                <div class="product-rating-container">
                    <img class="product-rating-stars" src="${product.getStarURL()}" />
                    <div class="product-rating-count link-primary">
                        ${product.rating.count}
                    </div>
                </div>

                <div class="product-price">
                    ${product.getPrice()}
                </div>

                <div class="product-quantity-container">
                    <select class="qtySelectDropdown" data-product-id="${product.id}">
                        <option selected value=1>1</option>
                        <option value=2>2</option>
                        <option value=3>3</option>
                        <option value=4>4</option>
                        <option value=5>5</option>
                        <option value=6>6</option>
                        <option value=7>7</option>
                        <option value=8>8</option>
                        <option value=9>9</option>
                        <option value=10>10</option>
                    </select>
                </div>

                ${product.extraInfoHTML()}

                <div class="product-spacer"></div>

                <div class="added-to-cart" data-product-id="${product.id}">
                    <img src="images/icons/checkmark.png">
                    Added
                </div>

                <button class="add-to-cart-button button-primary" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `
    });
    document.querySelector('.products-grid').innerHTML = HTML;

    //Cart Code
    function updateCartQty() {
        document.querySelector('.cart-quantity').innerHTML = `${cartTotal()}`;
    };

    document.querySelectorAll('.add-to-cart-button')
        .forEach((button,i) => 
            button.addEventListener('click',() => {
                addToCart(button, Number(document.querySelector(`.qtySelectDropdown[data-product-id="${button.dataset.productId}"]`).value));
                updateCartQty();
            })
        );
};

loadProducts(renderProducts);