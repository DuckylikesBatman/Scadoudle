function initHeroEffects() {
  const mosaic = document.querySelector('.hero__mosaic');
  if (!mosaic) return;

  // After each cell's slide-in animation ends, clear it so CSS hover works normally
  mosaic.querySelectorAll('.mosaic-cell').forEach((cell) => {
    cell.addEventListener('animationend', () => {
      cell.style.opacity = '1';
      cell.style.animation = 'none';
    }, { once: true });
  });

  // Mouse parallax — float the whole mosaic group with the cursor
  let tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', (e) => {
    const hw = window.innerWidth / 2;
    const hh = window.innerHeight / 2;
    tx = (e.clientX - hw) / hw * 16;
    ty = (e.clientY - hh) / hh * 9;
  });

  (function tick() {
    cx += (tx - cx) * 0.07;
    cy += (ty - cy) * 0.07;
    mosaic.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
    requestAnimationFrame(tick);
  })();
}
