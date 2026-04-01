function initQuickAdd() {
  document.querySelectorAll('.p-card__overlay').forEach((overlay) => {
    overlay.setAttribute('role', 'button');
    overlay.setAttribute('tabindex', '0');
    const go = (e) => {
      e.preventDefault();
      const card = overlay.closest('.p-card');
      if (card && window.ScadoudleCart) window.ScadoudleCart.addFromCard(card);
    };
    overlay.addEventListener('click', go);
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go(e);
      }
    });
  });
}
