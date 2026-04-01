function initCursor() {
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!cur || !ring) return;

  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  (function tick() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    cur.style.cssText += `;left:${mx}px;top:${my}px`;
    ring.style.cssText += `;left:${rx}px;top:${ry}px`;
    requestAnimationFrame(tick);
  })();

  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => cur.classList.add('big'));
    el.addEventListener('mouseleave', () => cur.classList.remove('big'));
  });
}
