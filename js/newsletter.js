function initNewsletter() {
  const btn = document.querySelector('.newsletter__submit');
  const input = document.querySelector('.newsletter__input');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const v = input.value.trim();
    if (!v || !input.validity.valid) {
      showToast('Please enter a valid email.');
      return;
    }
    showToast("You're on the list. Welcome to the drop.");
    input.value = '';
  });
}
