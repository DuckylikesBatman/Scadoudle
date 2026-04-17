function initCurrentNav() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  let current = parts[parts.length - 1] || 'index.html';
  if (!current.includes('.')) current = 'index.html';
  document.querySelectorAll('.nav__link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

initCart();
initCurrentNav();
initCursor();
if (typeof initProductFilters === 'function') initProductFilters();
if (typeof initScrollReveal === 'function') initScrollReveal();
if (typeof initWishlist === 'function') initWishlist();
if (typeof initQuickAdd === 'function') initQuickAdd();
if (typeof initNewsletter === 'function') initNewsletter();
if (typeof initContact === 'function') initContact();
