function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      showToast('Please fill in all fields.');
      return;
    }
    showToast('Thanks — we will get back to you soon.');
    form.reset();
  });
}
