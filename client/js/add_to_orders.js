const priceList = document.getElementById("buying-item-list");
const displayQuantity = document.getElementById("quantity-box");
const itemList = document.getElementById("buying-price-list");
const addProduct = document.getElementById("quantity-add-button");
const orderItemList = document.querySelector(".order-item-list ul");
const orderQuantityList = document.querySelector(".order-quantity-list ul");
const orderPriceList = document.querySelector(".order-price-list ul");
const orderItemNameList = document.getElementById("order-item-name-list");

let currentQuantity = "";

let drinks = [];
let foods = [];
let orders = [];

function addProductToOrders() {
  const selectedListItem = document.querySelector("li.selected");
  console.log(selectedListItem);
  const name = selectedListItem.innerHTML;
  let price = selectedListItem.getAttribute("data-price");
  price = parseFloat(price);
  let quantity = parseFloat(currentQuantity);
  let totalItemPrice = quantity * price;
  orders.push({
    item_name: name,
    price: price,
    totalPrice: totalItemPrice + " جنيه",
    quantity: quantity,
  });
  updateOrders(orders);
}

function updateList(items) {
  priceList.innerHTML = "";
  itemList.innerHTML = "";

  items.forEach((item, index) => {
    const priceItem = document.createElement("li");
    priceItem.textContent = item.item_price;
    priceList.appendChild(priceItem);

    const listItem = document.createElement("li");
    listItem.textContent = `${item.item_name}`;
    listItem.setAttribute("data-price", item.item_price);
    itemList.appendChild(listItem);
  });
}

function displayList(type) {
  if (type == "drinks") {
    updateList(drinks);
  } else {
    updateList(foods);
  }
}

function updateQuantity(numberOrDot) {
  switch (numberOrDot) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7": {
      currentQuantity = currentQuantity + numberOrDot;

      break;
    }
    case ".": {
      currentQuantity = currentQuantity + numberOrDot;
      break;
    }
  }
  updateQuantityBox();
}
function deleteQuantity() {
  currentQuantity = "";
  updateQuantityBox();
}
function updateQuantityBox() {
  displayQuantity.innerHTML = currentQuantity;

  // Regular expression to match valid format: 0-99.9
  const regex = /^\d{0,2}(\.\d{1})?$/;

  const parsedQuantity = parseFloat(currentQuantity);
  if (regex.test(currentQuantity) && !Number.isNaN(parsedQuantity)) {
    addProduct.removeAttribute("disabled");
  } else {
    addProduct.setAttribute("disabled", true);
    // Optionally provide user feedback:
    console.warn(
      "Invalid quantity format. Please enter up to two digits and one decimal point."
    );
  }
}

function updateOrders(orders) {
  orderItemList.innerHTML = "";
  orderPriceList.innerHTML = "";
  orderQuantityList.innerHTML = "";

  orders.forEach((order, index) => {
    const listItem = document.createElement("li");
    listItem.setAttribute("data-index", index);
    listItem.textContent = order.item_name;
    orderItemList.appendChild(listItem);

    const priceItem = document.createElement("li");
    priceItem.textContent = `${order.totalPrice}`;
    orderPriceList.appendChild(priceItem);

    const quantityItem = document.createElement("li");
    quantityItem.textContent = `${order.quantity}`;
    orderQuantityList.appendChild(quantityItem);
  });
}
updateOrders(orders);

function clearOrders() {
  orders = [];
  orderItemList.innerHTML = "";
  orderPriceList.innerHTML = "";
  orderQuantityList.innerHTML = "";
}
// Add a click event to the unordered list (ul) so that when a list item (li) is clicked, only one can be selected at a time.
itemList.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    const selected = document.querySelector("li.selected");
    if (selected) selected.className = "";
    e.target.className = "selected";
  }
});

// Add a click event to the unordered list (ul) so that when a list item (li) is clicked, only one can be selected at a time.
orderItemNameList.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    const selected = document.querySelector("li.order-selected");
    if (selected) selected.className = "";
    e.target.className = "order-selected";
  }
});
function deleteProductFromOrders() {
  const selectedListItem = document.querySelector("li.order-selected");
  if (selectedListItem) {
    index = selectedListItem.getAttribute("data-index");
    orders.splice(index, 1);
    updateOrders(orders);
    console.log(orders);
  }
}

function getProducts(category) {
  fetch("http://localhost/cashier%20system/server/" + category + ".php")
    .then((response) => response.json()) // Parse JSON response on fulfillment
    .then((data) => {
      if (category === "food") {
        foods = data;
        displayList("food");
      } else {
        drinks = data;
        displayList("drinks");
      }
    })
    .catch((error) => {
      console.error("Error getting drinks or food:", error);
    });
}
getProducts("food");
getProducts("drinks");

function createOrder() {
  console.log(JSON.stringify(orders));
  fetch("http://localhost/cashier%20system/server/order.php", {
    method: "POST",
    body: JSON.stringify(orders),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("تم أضافة الطلب");
      clearOrders();
    })
    .catch((error) => {
      console.error("Error Creating Order:", error);
    });
}
