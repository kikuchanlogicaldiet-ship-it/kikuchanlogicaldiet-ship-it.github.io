// --- Constants & Data ---
const PRODUCTS = [
    {
        id: 1,
        title: "プレミアム瞑想クッション",
        price: 8500,
        category: "Equipment",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        title: "オーガニックハーブティー",
        price: 2400,
        category: "Food",
        image: "https://images.unsplash.com/photo-1594631252845-29fc4586510d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        title: "マインドフルネス・ジャーナル",
        price: 3200,
        category: "Stationery",
        image: "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 4,
        title: "天然エッセンシャルオイル (Lavender)",
        price: 1800,
        category: "Aroma",
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
];

let cart = JSON.parse(localStorage.getItem('kikuchan_cart')) || [];

// --- Global Functions (Exposed to window for onclick) ---

window.addToCart = function (productId) {
    console.log("Adding to cart:", productId);
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    openCart();
};

window.removeFromCart = function (productId) {
    console.log("Removing from cart:", productId);
    cart = cart.filter(item => item.id !== productId);
    saveCart();
};

window.toggleCart = function () {
    const panel = document.getElementById('cart-panel');
    const backdrop = document.getElementById('cart-backdrop');
    if (panel && backdrop) {
        panel.classList.toggle('active');
        backdrop.classList.toggle('active');
    }
};

window.openCart = function () {
    const panel = document.getElementById('cart-panel');
    const backdrop = document.getElementById('cart-backdrop');
    if (panel && backdrop) {
        panel.classList.add('active');
        backdrop.classList.add('active');
    }
};

window.closeSuccessOverlay = function () {
    const overlay = document.getElementById('success-msg');
    const backdrop = document.getElementById('cart-backdrop');
    if (overlay) overlay.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
};

// --- Helper Functions ---

function saveCart() {
    localStorage.setItem('kikuchan_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    console.log("Updating Cart UI...");
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => el.textContent = totalCount);

    const cartContainer = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('cart-total-price');

    if (!cartContainer || !totalPriceElement) {
        console.log("Cart container or price element not found - possibly on index.html");
        return;
    }

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div style="text-align: center; color: var(--color-text-secondary); margin-top: 3rem;">
                <i class="fa-solid fa-cart-arrow-down" style="font-size: 3rem; opacity: 0.2; margin-bottom: 1rem; display: block;"></i>
                <p>カートは空です</p>
            </div>
        `;
        totalPriceElement.textContent = '¥0';
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">¥${item.price.toLocaleString()} × ${item.quantity}</div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join('');

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = `¥${totalAmount.toLocaleString()}`;
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    console.log("Rendering products...");
    grid.innerHTML = PRODUCTS.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.title}</h3>
                <div class="product-price">¥${product.price.toLocaleString()}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fa-solid fa-plus"></i> カートに追加
                </button>
            </div>
        </div>
    `).join('');
}

// --- Main Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded - Initializing...");

    // Initial Render
    updateCartUI();
    renderProducts();

    // Smooth scrolling for internal anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .about-text, .about-image, .product-card').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
        observer.observe(el);
    });

    // Store Event Bindings
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', window.toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', window.toggleCart);
    if (cartBackdrop) cartBackdrop.addEventListener('click', () => {
        window.toggleCart();
        window.closeSuccessOverlay();
    });

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('カートに商品が入っていません。');
                return;
            }

            // Simulation of checkout
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            if (confirm(`合計金額 ¥${total.toLocaleString()} のお買い上げを確定しますか？`)) {
                // Show Success Overlay
                const successMsg = document.getElementById('success-msg');
                if (successMsg) {
                    window.toggleCart(); // Close cart first
                    successMsg.classList.add('active');
                    cart = [];
                    saveCart();
                } else {
                    alert('お買い上げありがとうございました！');
                    cart = [];
                    saveCart();
                    window.toggleCart();
                }
            }
        });
    }
});
