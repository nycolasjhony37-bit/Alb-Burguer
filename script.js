document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cart-total');
    const menuGrid = document.querySelector('.menu-grid');

    // Default Data
    const defaultMenu = [
        { id: 1, name: "Alb' Classic", category: "burgers", price: 32.90, description: "Blend 180g, queijo cheddar derretido, alface, tomate e molho da casa.", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 2, name: "Alb' Bacon Deluxe", category: "burgers", price: 38.90, description: "Blend 180g, muito bacon crocante, cebola caramelizada e maionese defumada.", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 3, name: "Combo Família", category: "combos", price: 120.00, description: "4 Alb' Classics + 2 Porções de Batata + 1 Refrigerante 2L.", img: "https://images.unsplash.com/photo-1521305916504-4a1121188589?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" }
    ];

    // State Management
    let menuData = JSON.parse(localStorage.getItem('alb_menu')) || defaultMenu;
    let cart = JSON.parse(sessionStorage.getItem('alb_cart')) || [];

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Render Menu
    const renderMenu = () => {
        if (!menuGrid) return;
        menuGrid.innerHTML = menuData.map(item => `
            <div class="menu-card" data-category="${item.category}">
                <div class="card-img">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="card-content">
                    <div class="card-category">${item.category.toUpperCase()}</div>
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="card-footer">
                        <span class="price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                        <button class="btn-icon" onclick="addToCart(${item.id})">
                            <i data-lucide="plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
        initRevealAnimations();
    };

    // Cart Toggle
    const toggleCart = () => {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    };

    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    if (closeCart) closeCart.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    // Add to Cart
    window.addToCart = (id) => {
        const item = menuData.find(m => m.id === id);
        if (item) {
            cart.push({...item, cartId: Date.now()});
            sessionStorage.setItem('alb_cart', JSON.stringify(cart));
            updateCartUI();
        }
    };

    const updateCartUI = () => {
        if (!cartCount) return;
        cartCount.textContent = cart.length;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Seu carrinho está vazio.</p>';
            cartTotal.textContent = 'R$ 0,00';
            return;
        }

        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        lucide.createIcons();
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        sessionStorage.setItem('alb_cart', JSON.stringify(cart));
        updateCartUI();
    };

    // Go to Checkout
    const checkoutBtn = document.querySelector('.btn-block');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            if (cart.length === 0) {
                e.preventDefault();
                alert('Adicione itens ao carrinho antes de finalizar!');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    // Reveal Animations
    const initRevealAnimations = () => {
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.menu-card, .about-image, .about-text').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    };

    // Initial Load
    renderMenu();
    updateCartUI();

    // Analytics: Track View
    const stats = JSON.parse(localStorage.getItem('alb_stats')) || { views: 0, clicks: 0, checkouts: 0 };
    stats.views++;
    localStorage.setItem('alb_stats', JSON.stringify(stats));

    // Category Filtering
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            const cards = document.querySelectorAll('.menu-card');
            
            cards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Mobile Menu Toggle (Simplified)
    mobileMenuBtn.addEventListener('click', () => {
        alert('Menu mobile em desenvolvimento!');
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
