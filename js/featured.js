function initProductFilters() {
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.p-card').forEach((card) => {
        card.style.display = f === 'all' || card.dataset.brand === f ? '' : 'none';
      });
    });
  });
}

function initScrollReveal() {
  const cards = document.querySelectorAll('.p-card');
  if (!cards.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 90);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  cards.forEach((c) => io.observe(c));
}

function initWishlist() {
  document.querySelectorAll('.p-card__wish').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const on = btn.textContent === '♥';
      btn.textContent = on ? '♡' : '♥';
      btn.style.color = on ? '' : '#ff3628';
    });
  });
}
