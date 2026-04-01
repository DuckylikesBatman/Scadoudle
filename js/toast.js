function showToast(message) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('toast--visible');
  clearTimeout(el._toastT);
  el._toastT = setTimeout(() => el.classList.remove('toast--visible'), 3200);
}
