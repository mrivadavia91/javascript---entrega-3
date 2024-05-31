let cart = [];
let total = 0;

document.addEventListener("DOMContentLoaded", function() {
  const showCartBtn = document.getElementById("showCartBtn");
  const cartDiv = document.getElementById("cart");
  const productsContainer = document.getElementById("products");

  showCartBtn.addEventListener("click", function() {
    showCart();
  });

  // Cargar carrito desde el localStorage, si existe
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    updateCart();
  }

  fetch("products.json")
    .then(response => response.json())
    .then(products => {
      products.forEach(product => {
        const productDiv = createProductElement(product);
        productsContainer.appendChild(productDiv);
      });
    });

  function createProductElement(product) {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    const image = document.createElement("img");
    image.src = product.image;
    const title = document.createElement("h2");
    title.textContent = product.name;
    const price = document.createElement("p");
    price.textContent = `Precio: $${product.price}`;
    const button = document.createElement("button");
    button.textContent = "Agregar al Carrito";
    button.addEventListener("click", function() {
      addToCart(product);
    });
    productDiv.appendChild(image);
    productDiv.appendChild(title);
    productDiv.appendChild(price);
    productDiv.appendChild(button);
    return productDiv;
  }

  function addToCart(product) {
    cart.push(product);
    total += product.price;
    showCartBtn.style.display = "block";
    updateCart();
    saveCart();
  }

  function updateCart() {
    cartDiv.innerHTML = "";
    cart.forEach(product => {
      const item = document.createElement("div");
      item.textContent = `${product.name} - Precio: $${product.price}`;
      cartDiv.appendChild(item);
    });
    const totalItem = document.createElement("div");
    totalItem.textContent = `Total: $${total}`;
    cartDiv.appendChild(totalItem);
  }
  

  function showCart() {
    cartDiv.style.display = "block";
    showCartBtn.style.display = "none";
    const finishButton = document.createElement("button");
    finishButton.textContent = "Finalizar Compra";
    finishButton.addEventListener("click", function() {
      finishPurchase();
    });
    cartDiv.appendChild(finishButton);
  }

  function finishPurchase() {
    alert(`Compra realizada. Total: $${total}`);
    cart = [];
    total = 0;
    updateCart();
    cartDiv.style.display = "none";
    // Limpiar el localStorage al finalizar la compra
    localStorage.removeItem("cart");
  }

  function saveCart() {
    // Almacenar el carrito en el localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  }
});
