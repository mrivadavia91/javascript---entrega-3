let cart = [];
let total = 0;

document.addEventListener("DOMContentLoaded", function() {
  const showCartBtn = document.getElementById("showCartBtn");

  showCartBtn.addEventListener("click", function() {
    showCart();
  });

  const cartDiv = document.getElementById("cart");
  const productsContainer = document.getElementById("products");

  // Cargar carrito desde el localStorage, si existe
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    updateCart();
  }

  fetch("products.json")
  .then(response => response.json())
  .then(products => {
    const productDivs = products.map(product => createProductElement(product));
    productsContainer.append(...productDivs);
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
    const cartButton = document.getElementById("showCartBtn");
    cartButton.textContent = `Carrito (${cart.length})`;
    cartDiv.innerHTML = "";
    cart.map(product => {
      const item = document.createElement("div");
      item.textContent = `${product.name} - Precio: $${product.price}`;
      cartDiv.appendChild(item);
    });
    const totalItem = document.createElement("div");
    totalItem.textContent = `Total: $${total}`;
    cartDiv.appendChild(totalItem);
  }

  function showCart() {
    let tablaHTML = `
      <table style="width:100%; text-align:left; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Producto</th>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Precio</th>
          </tr>
        </thead>
        <tbody>`;

    cart.forEach(product => {
      tablaHTML += `
        <tr>
          <td style="border-bottom: 1px solid #ddd; padding: 8px;">${product.name}</td>
          <td style="border-bottom: 1px solid #ddd; padding: 8px;">$${product.price}</td>
        </tr>`;
    });

    tablaHTML += `
        </tbody>
      </table>
      <div style="margin-top: 10px; font-weight: bold;">Total: $${total}</div>`;

    Swal.fire({
      title: 'Carrito de Compras',
      html: tablaHTML,
      showCancelButton: true,
      confirmButtonText: 'Finalizar Compra',
      cancelButtonText: 'Seguir Comprando'
    }).then((result) => {
      if (result.isConfirmed) {
        finishPurchase();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Aquí puedes cerrar el modal y permitir al usuario seguir comprando
        console.log('Seguir comprando');
      }
    });
  }

  function finishPurchase() {
    Swal.fire({
      title: 'Compra realizada',
      text: `Total: $${total}`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      cart = [];
      total = 0;
      updateCart();
      cartDiv.style.display = "none";
      // Limpiar el localStorage al finalizar la compra
      localStorage.removeItem("cart");
    });
  }

  function saveCart() {
    // Almacenar el carrito en el localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  }
});
