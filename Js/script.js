// 🖼️ Banner Slider
let bannerIndex = 0;
const banners = document.querySelectorAll('.banner-slider img');

function showBanner() {
    banners.forEach(img => img.classList.remove('active'));
    bannerIndex = (bannerIndex + 1) % banners.length;
    banners[bannerIndex].classList.add('active');
}
setInterval(showBanner, 4000);

// 🧾 Load Products
async function loadProducts(category = "all") {
    const container = document.querySelector(".products");
    container.innerHTML = "";

    try {
        const res = await fetch("./products.json");
        const productsData = await res.json();

        // 🛒 Load saved cart (if any)
        const savedCart = JSON.parse(localStorage.getItem("cartData")) || [];

        productsData.forEach(p => {
            if (category === "all" || p.category === category) {
                let discountedPrice = p.price;
                let discountPercent = 0;

                if (p.discount && p.discount > 0) {
                    discountedPrice = (p.price * (1 - p.discount / 100)).toFixed(0);
                    discountPercent = p.discount;
                }

                // Check if product already in cart (to restore quantity)
                const cartItem = savedCart.find(c => c.name === p.name);
                const currentQty = cartItem ? cartItem.qty : 0;

                container.innerHTML += `
                <div class="product" 
                     data-category="${p.category}" 
                     data-price="${p.price}" 
                     data-discount="${p.discount || 0}" 
                     style="position: relative;">
                    ${discountPercent > 0 ? `<span class="sale-badge">${discountPercent}% OFF</span>` : ""}
                    <img src="${p.img}" alt="${p.name}" class="product-img">
                    <h3>${p.name}</h3>
                    <span class="desc">${p.desc}</span>
                    <p>
                        ${discountPercent > 0
                        ? `<span class="discounted">₹${discountedPrice}</span>
                               <del class="old-price">₹${p.price}</del>`
                        : `₹${p.price}`
                    }
                    </p>
                    <div class="quantity-selector">
                        <button class="minus">-</button>
                        <input type="text" value="${currentQty}" readonly>
                        <button class="plus">+</button>
                    </div>
                </div>
                `;
            }
        });

        // 🖼️ Image lightbox
        document.querySelectorAll(".product-img").forEach(img => {
            img.addEventListener("click", () => openLightbox(img.src, img.alt));
        });

        // ➕ Quantity controls
        document.querySelectorAll(".quantity-selector").forEach(selector => {
            const input = selector.querySelector("input");
            const plus = selector.querySelector(".plus");
            const minus = selector.querySelector(".minus");

            plus.addEventListener("click", () => updateQty(input, 1));
            minus.addEventListener("click", () => updateQty(input, -1));
        });

        // ✅ Update cart in localStorage when qty changes
        function updateQty(input, change) {
            let qty = parseInt(input.value);
            qty = Math.max(0, qty + change);
            input.value = qty;

            const product = input.closest(".product");
            const name = product.querySelector("h3").textContent;
            const price = parseFloat(product.dataset.price);
            const discount = parseFloat(product.dataset.discount);
            const img = product.querySelector("img").src;
            const discountedPrice = (price * (1 - discount / 100)).toFixed(0);

            let cart = JSON.parse(localStorage.getItem("cartData")) || [];
            const existing = cart.find(item => item.name === name);

            if (qty > 0) {
                if (existing) {
                    existing.qty = qty;
                } else {
                    cart.push({ name, price, qty, img, discount, discountedPrice });
                }
            } else {
                cart = cart.filter(item => item.name !== name);
            }

            localStorage.setItem("cartData", JSON.stringify(cart));
        }

    } catch (err) {
        console.error("Error loading products:", err);
        container.innerHTML = `<p style="color:red;">⚠️ Failed to load products. Please refresh.</p>`;
    }
}

// 💡 Lightbox Function
function openLightbox(src, alt) {
    document.querySelector(".lightbox-overlay")?.remove();

    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${src}" alt="${alt}">
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector(".lightbox-close").addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") overlay.remove(); }, { once: true });
}

// 🏷️ Category Filters
document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        loadProducts(btn.dataset.category);
    });
});

// 🛒 Checkout Button Logic
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();

    const checkoutButton = document.getElementById("goToCheckout");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            const cart = JSON.parse(localStorage.getItem("cartData")) || [];
            if (cart.length === 0) {
                alert("Please select at least one product to checkout.");
                return;
            }
            window.location.href = "checkout.html";
        });
    }
});
