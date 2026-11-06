/**
 * Gabrica Catálogo Digital - Frontend Interactions & Welcome Club Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initClubModal();
  initCart();
  initSearchAndFilter();
  initToast();
  initViewToggle();
});

// ==========================================================================
// Welcome Club Modal Logic (Pasaporte del Arrunchis)
// ==========================================================================
function initClubModal() {
  const modalWrapper = document.getElementById('club-modal-wrapper');
  if (!modalWrapper) return;

  const closeBtn = document.getElementById('close-modal-btn');
  const skipLink = document.getElementById('skip-link');
  const backdrop = document.getElementById('modal-backdrop');
  const leadForm = document.getElementById('passport-lead-form');
  const petNameInput = document.getElementById('pet-name');
  const petTypeSelect = document.getElementById('pet-type');

  // Trigger modal display automatically when entering the page
  setTimeout(() => {
    openModal();
  }, 400);

  function openModal() {
    modalWrapper.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalWrapper.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Dismiss listeners
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (skipLink) skipLink.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalWrapper.classList.contains('active')) {
      closeModal();
    }
  });

  // Re-open triggers from anywhere in the page (e.g. CTA banners, buttons)
  const triggers = document.querySelectorAll('a[href*="pasaporte"], button:has-text("Pasaporte"), a:has-text("Pasaporte")');
  document.querySelectorAll('a, button').forEach(el => {
    if (el.innerText && el.innerText.toLowerCase().includes('pasaporte del arrunchis')) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    }
  });

  // Dynamic preview on passport card
  if (petNameInput) {
    petNameInput.addEventListener('input', (e) => {
      const petPreview = document.querySelector('.passport-card .font-bold.text-white.tracking-wide');
      if (petPreview) {
        const val = e.target.value.trim();
        const type = petTypeSelect && petTypeSelect.value === 'gato' ? 'Felino' : 'Canino';
        petPreview.textContent = val ? `${val} · ${type} Feliz` : 'Milo · Canino Feliz';
      }
    });
  }

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const petName = petNameInput ? (petNameInput.value.trim() || 'tu peludo') : 'tu peludo';
      closeModal();
      showToast(`🎉 ¡Bienvenido al Club! Pasaporte emitido para ${petName}. Cupón 10% OFF enviado.`);
    });
  }
}

// ==========================================================================
// Shopping Cart Logic
// ==========================================================================
const cartState = {
  items: [],
};

function initCart() {
  document.querySelectorAll('article').forEach((article) => {
    const addBtn = article.querySelector('button');
    const titleEl = article.querySelector('h2');
    const priceEl = article.querySelector('.text-headline-sm.font-bold');

    if (addBtn && titleEl) {
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const title = titleEl.innerText.trim();
        const price = priceEl ? priceEl.innerText.trim() : '$0';
        
        cartState.items.push({ title, price });
        updateCartUI();
        showToast(`Agregado al carrito: ${title.substring(0, 32)}...`);
      });
    }
  });
}

function updateCartUI() {
  const count = cartState.items.length;
  const badges = document.querySelectorAll('span.bg-white.text-primary.text-xs.font-bold, span.cart-badge');
  badges.forEach(b => {
    b.textContent = count;
  });

  const cartHeaderTotal = document.querySelector('header button span.text-\\[15px\\] + span');
  if (cartHeaderTotal) {
    cartHeaderTotal.textContent = `${count} items`;
  }
}

// ==========================================================================
// Search & Filter Logic
// ==========================================================================
function initSearchAndFilter() {
  const searchInput = document.querySelector('input[placeholder*="Filtrar por nombre"]');
  const clearSearchBtn = searchInput ? searchInput.parentElement.querySelector('button') : null;
  const productCards = document.querySelectorAll('main article');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      filterProducts(query, productCards);
    });

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterProducts('', productCards);
        searchInput.focus();
      });
    }
  }

  // Checkbox interactions
  const checkboxes = document.querySelectorAll('aside input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const parentLabel = cb.closest('label');
      if (parentLabel) {
        parentLabel.classList.toggle('text-primary', cb.checked);
        parentLabel.classList.toggle('font-bold', cb.checked);
      }
    });
  });
}

function filterProducts(query, cards) {
  let visibleCount = 0;
  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    if (!query || text.includes(query)) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const resultsSpan = document.querySelector('div.bg-surface-container-lowest span.bg-surface-ice.text-secondary');
  if (resultsSpan) {
    resultsSpan.textContent = `${visibleCount} disponibles`;
  }
}

// ==========================================================================
// View Mode Switcher (Grid / List)
// ==========================================================================
function initViewToggle() {
  const gridContainer = document.querySelector('.lg\\:col-span-9 .grid');
  const toggleButtons = document.querySelectorAll('.bg-surface-container-low button');

  if (toggleButtons.length >= 2 && gridContainer) {
    const gridBtn = toggleButtons[0];
    const listBtn = toggleButtons[1];

    gridBtn.addEventListener('click', () => {
      gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md';
      gridBtn.className = 'p-1.5 rounded bg-surface-container-lowest text-primary shadow-sm';
      listBtn.className = 'p-1.5 rounded text-outline hover:text-primary';
    });

    listBtn.addEventListener('click', () => {
      gridContainer.className = 'grid grid-cols-1 gap-space-md';
      listBtn.className = 'p-1.5 rounded bg-surface-container-lowest text-primary shadow-sm';
      gridBtn.className = 'p-1.5 rounded text-outline hover:text-primary';
    });
  }
}

// ==========================================================================
// Notification Toast
// ==========================================================================
function initToast() {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-primary text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300 pointer-events-none translate-y-20 opacity-0';
    toast.innerHTML = `
      <span class="material-symbols-outlined text-secondary-fixed text-xl">check_circle</span>
      <span id="toast-message" class="text-sm font-medium"></span>
    `;
    document.body.appendChild(toast);
  }
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const msgEl = document.getElementById('toast-message');
  if (toast && msgEl) {
    msgEl.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3500);
  }
}
