// ===== PRELOADER =====
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('hidden');
  }
}
setTimeout(hidePreloader, 1800);
window.addEventListener('load', () => setTimeout(hidePreloader, 1800));

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar?.classList.add('scrolled');
  else navbar?.classList.remove('scrolled');

  // Back to top
  const btn = document.getElementById('back-top');
  if (btn) {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }
});

// ===== HAMBURGER / MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobile-overlay');
const overlayClose = document.getElementById('overlay-close');

hamburger?.addEventListener('click', () => mobileOverlay?.classList.add('open'));
overlayClose?.addEventListener('click', () => mobileOverlay?.classList.remove('open'));
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileOverlay?.classList.remove('open'));
});

// ===== BACK TO TOP =====
document.getElementById('back-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== CART (with sessionStorage) =====
let cart = JSON.parse(sessionStorage.getItem('envision_cart') || '[]');

function getCartCount() {
  return cart.reduce((total, item) => total + item.qty, 0);
}

function updateCartUI() {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) cartCountEl.textContent = getCartCount();
  sessionStorage.setItem('envision_cart', JSON.stringify(cart));
}

// Initialize cart count on page load
updateCartUI();

// Add to Cart buttons
document.querySelectorAll('.add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name || 'Item';
    const price = parseInt(btn.dataset.price) || 0;

    // Check if item already in cart
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    updateCartUI();

    // Show toast
    const toastText = document.getElementById('toast-text');
    const cartToast = document.getElementById('cart-toast');
    if (toastText) toastText.textContent = `${name} added to cart!`;
    cartToast?.classList.add('show');
    setTimeout(() => cartToast?.classList.remove('show'), 3000);
  });
});

// Cart icon click → go to checkout
document.querySelector('.cart-btn')?.addEventListener('click', () => {
  window.location.href = 'checkout.html';
});

// ===== WISHLIST TOGGLE =====
document.querySelectorAll('.btn-wishlist, .wishlist-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const icon = btn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
    }
    btn.style.color = btn.querySelector('.fa-solid') ? 'var(--gold)' : '';
  });
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => observer.observe(el));

// ===== CONTACT FORM =====
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('form-success')?.classList.add('visible');
  e.target.reset();
  setTimeout(() => document.getElementById('form-success')?.classList.remove('visible'), 4000);
});

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.style.color = 'var(--gold)';
  }
});

// ===== SEARCH =====
const searchData = [
  // Collections
  { title: 'Office Furniture 01',     category: 'Collections', url: 'collections.html' },
  { title: 'Office Furniture 02',     category: 'Collections', url: 'collections.html' },
  { title: 'Office Furniture 03',     category: 'Collections', url: 'collections.html' },
  { title: 'Office Furniture 04',     category: 'Collections', url: 'collections.html' },
  { title: 'Office Furniture 05',     category: 'Collections', url: 'collections.html' },
  { title: 'Office Furniture 06',     category: 'Collections', url: 'collections.html' },
  { title: 'Office Pod',              category: 'Collections', url: 'collections.html' },
  // Spotlight
  { title: 'Office Furniture',        category: 'Spotlight',   url: 'spotlight.html'   },
  { title: 'Office Pod',              category: 'Spotlight',   url: 'spotlight.html'   },
  { title: 'Custom Furniture',        category: 'Spotlight',   url: 'spotlight.html'   },
  // Reviews
  { title: 'Customer Reviews',        category: 'Reviews',     url: 'reviews.html'     },
  { title: 'Client Testimonials',     category: 'Reviews',     url: 'reviews.html'     },
  // Contact
  { title: 'Contact Us',              category: 'Contact',     url: 'contact.html'     },
  { title: 'Visit Our Showroom',      category: 'Contact',     url: 'contact.html'     },
  { title: 'Request Custom Quote',    category: 'Contact',     url: 'contact.html'     },
];

const searchBtn     = document.getElementById('search-btn');
const searchOverlay = document.getElementById('search-overlay');
const searchInput   = document.getElementById('search-input');
const searchClose   = document.getElementById('search-close');
const searchResults = document.getElementById('search-results');

function openSearch() {
  searchOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => searchInput.focus(), 100);
}

function closeSearch() {
  searchOverlay.classList.remove('open');
  document.body.style.overflow = '';
  searchInput.value = '';
  searchResults.innerHTML = '';
}

function runSearch(query) {
  searchResults.innerHTML = '';
  if (!query.trim()) return;

  const matches = searchData.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  if (matches.length === 0) {
    searchResults.innerHTML = '<p class="search-no-results">No results found.</p>';
    return;
  }

  matches.forEach(item => {
    const el = document.createElement('div');
    el.className = 'search-result-item';
    el.innerHTML = `<h4>${item.title}</h4><p>${item.category}</p>`;
    el.addEventListener('click', () => { window.location.href = item.url; });
    searchResults.appendChild(el);
  });
}

searchBtn?.addEventListener('click', openSearch);
searchClose?.addEventListener('click', closeSearch);
searchInput?.addEventListener('input', e => runSearch(e.target.value));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });