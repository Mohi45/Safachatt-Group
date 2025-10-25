// Banner slider
let bannerIndex = 0;
const banners = document.querySelectorAll('.banner-slider img');
function showBanner() {
  banners.forEach(img => img.classList.remove('active'));
  bannerIndex = (bannerIndex + 1) % banners.length;
  banners[bannerIndex].classList.add('active');
}
setInterval(showBanner, 4000);

// Fetch products from JSON file
async function loadProducts(category = "all") {
  const container = document.querySelector(".products");
  container.innerHTML = "";

  try {
    const res = await fetch("products.json");
    const productsData = await res.json();

    productsData.forEach(p => {
      if (category === "all" || p.category === category) {
        container.innerHTML += `
        <div class="product" data-category="${p.category}">
          <img src="${p.img}" alt="${p.name}">
          <h3>${p.name}</h3>
          <span class="desc">${p.desc}</span>
          <p>₹${p.price}</p>
          <div class="quantity-selector">
            <button class="minus">-</button>
            <input type="text" value="0" readonly>
            <button class="plus">+</button>
          </div>
        </div>`;
      }
    });

    // Quantity buttons
    document.querySelectorAll(".quantity-selector").forEach(selector => {
      const input = selector.querySelector("input");
      selector.querySelector(".plus").addEventListener("click", () => input.value = parseInt(input.value) + 1);
      selector.querySelector(".minus").addEventListener("click", () => input.value = Math.max(0, parseInt(input.value) - 1));
    });

  } catch (err) {
    console.error("Error loading products:", err);
    container.innerHTML = `<p style="color:red;">Failed to load products. Please refresh.</p>`;
  }
}

// Category filter
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadProducts(btn.dataset.category);
  });
});

document.addEventListener("DOMContentLoaded", () => loadProducts());
