document.addEventListener("DOMContentLoaded", () => {
    const phoneNumber = "919625290733";
    const upiId = "9625290733@paytm";
    const cartData = JSON.parse(localStorage.getItem("cartData")) || [];
    const checkoutContainer = document.getElementById("checkoutItems");
    const totalElement = document.getElementById("totalAmount");
    let totalAmount = 0;

    if (cartData.length === 0) {
        checkoutContainer.innerHTML = "<p>No items in cart. Go back to products page.</p>";
        return;
    }

    // Display cart items
    cartData.forEach(item => {
        const subtotal = item.price * item.qty;
        totalAmount += subtotal;
        checkoutContainer.innerHTML += `
            <div class="checkout-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="details">
                    <h3>${item.name}</h3>
                    <p>${item.qty} × ₹${item.price} = ₹${subtotal}</p>
                </div>
            </div>
        `;
    });

    totalElement.textContent = totalAmount;

    // WhatsApp order button
    const whatsappButton = document.getElementById("whatsappOrderBtn");
    whatsappButton.addEventListener("click", () => {
        const address = document.getElementById("userAddress").value.trim();
        if (!address) {
            alert("Please enter your delivery address.");
            return;
        }

        const orderLines = cartData.map(
            item => `${item.qty} × ${item.name} = ₹${item.qty * item.price}`
        ).join('%0A');

        const message =
            `Hello, I want to order:%0A${orderLines}%0A%0ATotal: ₹${totalAmount}%0A%0AYou can pay via UPI: ${upiId}%0A(Please share payment screenshot here)%0A%0ADelivery Address:%0A${encodeURIComponent(address)}`;

        const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappURL, "_blank");
    });
});
