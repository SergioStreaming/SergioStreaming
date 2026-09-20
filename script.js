let cart = [];

const mercadoPagoLink =
    "https://link.mercadopago.com.ar/pirunet";

const whatsappNumber =
    "543844546841";


/* =========================
   AGREGAR AL CARRITO
========================= */

function addToCart(name, price) {

    cart.push({
        name: name,
        price: price
    });

    updateCart();

    openCart();
}


/* =========================
   ACTUALIZAR CARRITO
========================= */

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");


    cartCount.textContent = cart.length;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p style="
                color:#777;
                text-align:center;
                padding:30px 0;
            ">
                Tu Carrito Está Vacío.
            </p>
        `;

        cartTotal.textContent = "$0";

        return;
    }


    cartItems.innerHTML = "";


    let total = 0;


    cart.forEach((item, index) => {

        total += item.price;


        const div =
            document.createElement("div");

        div.className = "cart-item";


        div.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <span>$${formatPrice(item.price)}</span>
            </div>

            <button
                class="remove-item"
                onclick="removeFromCart(${index})">
                ×
            </button>
        `;


        cartItems.appendChild(div);

    });


    cartTotal.textContent =
        "$" + formatPrice(total);
}


/* =========================
   ELIMINAR
========================= */

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();
}


/* =========================
   FORMATEAR PRECIO
========================= */

function formatPrice(price) {

    return price.toLocaleString("es-AR");
}


/* =========================
   ABRIR CARRITO
========================= */

function openCart() {

    document
        .getElementById("cartOverlay")
        .classList.add("active");

    document.body.style.overflow = "hidden";
}


/* =========================
   CERRAR CARRITO
========================= */

function closeCart() {

    document
        .getElementById("cartOverlay")
        .classList.remove("active");

    document.body.style.overflow = "";
}


/* =========================
   CHECKOUT
========================= */

function openCheckout() {

    if (cart.length === 0) {

        alert("Tu Carrito Está Vacío.");

        return;
    }


    closeCart();


    document
        .getElementById("checkoutOverlay")
        .classList.add("active");

    document.body.style.overflow = "hidden";
}


/* =========================
   CERRAR CHECKOUT
========================= */

function closeCheckout() {

    document
        .getElementById("checkoutOverlay")
        .classList.remove("active");

    document.body.style.overflow = "";
}


/* =========================
   CONFIRMAR PEDIDO
========================= */

function confirmOrder() {

    const name =
        document
            .getElementById("customerName")
            .value
            .trim();


    const customerWhatsapp =
        document
            .getElementById("customerWhatsapp")
            .value
            .trim();


    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;


    if (!name || !customerWhatsapp) {

        alert(
            "Completá Tu Nombre Y Tu WhatsApp."
        );

        return;
    }


    let total = 0;

    let products = "";


    cart.forEach(item => {

        total += item.price;

        products +=
            `• ${item.name} — $${formatPrice(item.price)}\n`;

    });


    const message =
`🛒 *NUEVO PEDIDO - SERGIOSTREAMING*

👤 Nombre: ${name}
📱 WhatsApp: ${customerWhatsapp}

📦 *Productos:*
${products}
💰 *Total: $${formatPrice(total)}*

💳 Método De Pago:
${payment}

🔗 Mercado Pago:
${mercadoPagoLink}`;


    const url =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


    window.open(url, "_blank");
}


/* =========================
   CERRAR TOCANDO AFUERA
========================= */

document
    .getElementById("cartOverlay")
    .addEventListener("click", function(event) {

        if (event.target === this) {
            closeCart();
        }

    });


document
    .getElementById("checkoutOverlay")
    .addEventListener("click", function(event) {

        if (event.target === this) {
            closeCheckout();
        }

    });


/* =========================
   INICIO
========================= */

updateCart();
