export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
  orders.unshift(order);

  saveOrdersToStorage();
}

function saveOrdersToStorage() {
  localStorage.setItem('orders',JSON.stringify(orders));
}
