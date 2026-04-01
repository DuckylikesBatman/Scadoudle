function initQuickAdd() {
  document.querySelectorAll('.p-card__overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      e.preventDefault();
      const card = overlay.closest('.p-card');
      const name = card?.querySelector('.p-card__name')?.textContent?.trim() || 'Item';
      showToast(`Added to bag — ${name}`);
    });
  });
}
