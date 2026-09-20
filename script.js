const cart = [];

const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const checkoutButton = document.getElementById("checkoutButton");

const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");

const checkoutTotal = document.getElementById("checkoutTotal");

const WHATSAPP = "543844546841";

const MERCADO_PAGO = "https://link.mercadopago.com.ar/pirunet";


/* FORMATO DE DINERO */

function formatPrice(price) {
  return "$" + Number(price).toLocaleString("es-AR");
}


/* ABRIR CARRITO */

function openCartPanel() {
  cartPanel.classList.add("active");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}


/* CERRAR CARRITO */

function closeCartPanel() {
  cartPanel.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}


/* AGREGAR PRODUCTO */

function addProduct(button) {

  const product = {
    id: Date.now(),
    name: button.dataset.name,
    plan: button.dataset.plan,
    price: Number(button.dataset.price)
  };

  cart.push(product);

  updateCart();

  openCartPanel();

  button.textContent = "✓ Agregado";

  setTimeout(() => {
    button.textContent = "Agregar Al Carrito";
  }, 1000);
}


/* ELIMINAR PRODUCTO */

function removeProduct(id) {

  const index = cart.findIndex(product => product.id === id);

  if (index !== -1) {
    cart.splice(index, 1);
  }

  updateCart();
}


/* ACTUALIZAR CARRITO */

function updateCart() {

  cartCount.textContent = cart.length;

  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty-cart">
        <div>🛒</div>
        <h3>Tu Carrito Está Vacío</h3>
        <p>Agregá Un Servicio Para Continuar.</p>
      </div>
    `;

    cartTotal.textContent = "$0";
    checkoutTotal.textContent = "$0";
    checkoutButton.disabled = true;

    return;
  }

  checkoutButton.disabled = false;

  let total = 0;

  cartItems.innerHTML = "";

  cart.forEach(product => {

    total += product.price;

    const item = document.createElement("div");

    item.className = "cart-item";

    item.innerHTML = `
      <div class="cart-item-info">
        <strong>${product.name}</strong>
        <span>${product.plan}</span>
        <button class="remove-item" data-id="${product.id}">
          Eliminar
        </button>
      </div>

      <div class="cart-item-price">
        ${formatPrice(product.price)}
      </div>
    `;

    cartItems.appendChild(item);
  });

  cartTotal.textContent = formatPrice(total);
  checkoutTotal.textContent = formatPrice(total);

  document.querySelectorAll(".remove-item").forEach(button => {

    button.addEventListener("click", () => {
      removeProduct(Number(button.dataset.id));
    });

  });
}


/* TOTAL */

function getTotal() {

  return cart.reduce((total, product) => {
    return total + product.price;
  }, 0);

}


/* ABRIR CHECKOUT */

function openCheckout() {

  if (cart.length === 0) return;

  checkoutTotal.textContent = formatPrice(getTotal());

  checkoutModal.classList.add("active");

}


/* CERRAR CHECKOUT */

function closeCheckoutModal() {

  checkoutModal.classList.remove("active");

}


/* GENERAR PEDIDO */

function createOrderMessage(name, phone, payment) {

  let message = `Hola SergioStreaming! 👋

Quiero Realizar El Siguiente Pedido:

`;

  cart.forEach((product, index) => {

    message += `${index + 1}. ${product.name} - ${product.plan} - ${formatPrice(product.price)}\n`;

  });

  message += `
━━━━━━━━━━━━━━
Total: ${formatPrice(getTotal())}
━━━━━━━━━━━━━━

Nombre: ${name}
WhatsApp: ${phone}
Método De Pago: ${payment}
`;

  if (payment === "Mercado Pago") {

    message += `
    
Link De Pago:
${MERCADO_PAGO}

Una Vez Realizado El Pago, Envío El Comprobante Por Este WhatsApp.
`;

  } else {

    message += `

Quiero Recibir Los Datos Para Realizar La Transferencia.
`;

  }

  return message;
}


/* EVENTOS */

document.querySelectorAll(".add-button").forEach(button => {

  button.addEventListener("click", () => {
    addProduct(button);
  });

});


openCart.addEventListener("click", openCartPanel);

closeCart.addEventListener("click", closeCartPanel);

cartOverlay.addEventListener("click", closeCartPanel);

checkoutButton.addEventListener("click", openCheckout);

closeCheckout.addEventListener("click", closeCheckoutModal);


/* CERRAR MODAL TOCANDO AFUERA */

checkoutModal.addEventListener("click", event => {

  if (event.target === checkoutModal) {
    closeCheckoutModal();
  }

});


/* CONFIRMAR PEDIDO */

checkoutForm.addEventListener("submit", event => {

  event.preventDefault();

  if (cart.length === 0) return;

  const name = document.getElementById("customerName").value.trim();

  const phone = document.getElementById("customerWhatsapp").value.trim();

  const payment = document.querySelector(
    'input[name="payment"]:checked'
  ).value;

  if (!name || !phone) {
    alert("Completá Tu Nombre Y Número De WhatsApp.");
    return;
  }

  const message = createOrderMessage(
    name,
    phone,
    payment
  );

  const whatsappURL =
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank");

});


/* ESC PARA CERRAR */

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {

    closeCartPanel();
    closeCheckoutModal();

  }

});


/* INICIO */

updateCart();
