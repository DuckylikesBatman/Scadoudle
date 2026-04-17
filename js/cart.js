(function () {
  const STORAGE_KEY = 'scadoudle_cart_v1';
  let lines = [];

  function slugify(text) {
    return String(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'item';
  }

  function readCard(card) {
    if (!card) return null;
    const name = card.querySelector('.p-card__name')?.textContent?.trim() || 'Item';
    const brand = card.querySelector('.p-card__brand')?.textContent?.trim() || '';
    const id =
      card.dataset.productId?.trim() ||
      slugify(`${brand}-${name}`);
    const price = parseFloat(card.dataset.price || '0');
    const image = card.querySelector('.p-card__img')?.getAttribute('src') || '';
    return { id, name, brand, price: Number.isFinite(price) ? price : 0, image };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        lines = [];
        return;
      }
      const parsed = JSON.parse(raw);
      lines = Array.isArray(parsed) ? parsed : [];
    } catch {
      lines = [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch (_) {}
  }

  function formatMoney(n) {
    return `$${Math.round(n * 100) / 100}`;
  }

  function subtotal() {
    return lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  }

  function itemCount() {
    return lines.reduce((n, line) => n + line.qty, 0);
  }

  function updateBagCount() {
    const badge = document.querySelector('.nav__bag-count');
    if (!badge) return;
    const c = itemCount();
    badge.textContent = String(c);
    badge.classList.toggle('nav__bag-count--empty', c === 0);
    const bag = document.getElementById('nav-cart');
    if (bag) bag.setAttribute('aria-label', c ? `Shopping bag, ${c} items` : 'Shopping bag, empty');
  }

  function renderList() {
    const list = document.getElementById('cart-drawer-list');
    const subEl = document.getElementById('cart-subtotal');
    const checkout = document.querySelector('.cart-drawer__checkout');
    if (!list || !subEl) return;

    list.innerHTML = '';

    if (!lines.length) {
      const empty = document.createElement('li');
      empty.className = 'cart-line cart-line--empty';
      empty.textContent = 'Your bag is empty — add something from the shop.';
      list.appendChild(empty);
      subEl.textContent = formatMoney(0);
      if (checkout) checkout.disabled = true;
      return;
    }

    if (checkout) checkout.disabled = false;

    lines.forEach((line) => {
      const li = document.createElement('li');
      li.className = 'cart-line';
      li.dataset.id = line.id;

      const thumbWrap = document.createElement('div');
      thumbWrap.className = 'cart-line__thumb';
      if (line.image) {
        const img = document.createElement('img');
        img.src = line.image;
        img.alt = '';
        img.width = 56;
        img.height = 56;
        img.loading = 'lazy';
        thumbWrap.appendChild(img);
      }

      const mid = document.createElement('div');
      mid.className = 'cart-line__info';
      mid.innerHTML = `<p class="cart-line__brand">${line.brand}</p><p class="cart-line__name">${line.name}</p><p class="cart-line__price">${formatMoney(
        line.price
      )}</p>`;

      const qty = document.createElement('div');
      qty.className = 'cart-line__qty';
      qty.innerHTML = `
        <button type="button" class="cart-qty" data-act="minus" aria-label="Decrease quantity">−</button>
        <span class="cart-qty__val">${line.qty}</span>
        <button type="button" class="cart-qty" data-act="plus" aria-label="Increase quantity">+</button>
      `;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'cart-line__remove';
      removeBtn.setAttribute('aria-label', `Remove ${line.name}`);
      removeBtn.textContent = 'Remove';

      qty.querySelector('[data-act="minus"]').addEventListener('click', () => setQty(line.id, line.qty - 1));
      qty.querySelector('[data-act="plus"]').addEventListener('click', () => setQty(line.id, line.qty + 1));
      removeBtn.addEventListener('click', () => removeLine(line.id));

      const row = document.createElement('div');
      row.className = 'cart-line__row';
      row.appendChild(thumbWrap);
      row.appendChild(mid);
      row.appendChild(qty);
      li.appendChild(row);
      li.appendChild(removeBtn);
      list.appendChild(li);
    });

    subEl.textContent = formatMoney(subtotal());
  }

  function setQty(id, qty) {
    const line = lines.find((l) => l.id === id);
    if (!line) return;
    if (qty < 1) {
      removeLine(id);
      return;
    }
    line.qty = qty;
    save();
    renderList();
    updateBagCount();
  }

  function removeLine(id) {
    lines = lines.filter((l) => l.id !== id);
    save();
    renderList();
    updateBagCount();
  }

  function addFromCard(card) {
    const p = readCard(card);
    if (!p) return;

    const existing = lines.find((l) => l.id === p.id);
    if (existing) {
      existing.qty += 1;
    } else {
      lines.push({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        image: p.image,
        qty: 1,
      });
    }
    save();
    renderList();
    updateBagCount();
    showToast(`Added to bag — ${p.name}`);
  }

  function open() {
    const root = document.getElementById('cart-drawer');
    if (!root) return;
    root.classList.add('cart-drawer--open');
    root.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-drawer-on');
    const closeBtn = root.querySelector('.cart-drawer__close');
    closeBtn?.focus();
  }

  function close() {
    const root = document.getElementById('cart-drawer');
    if (!root) return;
    root.classList.remove('cart-drawer--open');
    root.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-drawer-on');
  }

  function ensureDrawer() {
    if (document.getElementById('cart-drawer')) return;

    const root = document.createElement('div');
    root.id = 'cart-drawer';
    root.className = 'cart-drawer';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = `
      <button type="button" class="cart-drawer__backdrop" aria-label="Close bag"></button>
      <div class="cart-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">
        <div class="cart-drawer__head">
          <h2 id="cart-drawer-title" class="cart-drawer__title">Your bag</h2>
          <button type="button" class="cart-drawer__close" aria-label="Close bag">×</button>
        </div>
        <ul class="cart-drawer__list" id="cart-drawer-list"></ul>
        <div class="cart-drawer__foot">
          <p class="cart-drawer__subtotal">Subtotal <strong id="cart-subtotal">$0</strong></p>
          <p class="cart-drawer__note">Shipping &amp; tax calculated at checkout (demo).</p>
          <button type="button" class="btn-primary cart-drawer__checkout" disabled>Checkout</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    root.querySelector('.cart-drawer__backdrop').addEventListener('click', close);
    root.querySelector('.cart-drawer__close').addEventListener('click', close);
    root.querySelector('.cart-drawer__checkout').addEventListener('click', () => {
      if (!lines.length) return;
      showToast('Checkout is preview-only — hook up Stripe or Shopify next.');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('cart-drawer--open')) close();
    });
  }

  function ensureNavExtras() {
    const right = document.querySelector('.nav__right');
    if (!right || right.dataset.navEnhanced === '1') return;
    right.dataset.navEnhanced = '1';

    const shop = right.querySelector('a.nav__link[href="shop.html"]');
    const about = right.querySelector('a.nav__link[href="about.html"]');
    if (shop && !right.querySelector('a.nav__link[href="stores.html"]')) {
      const stores = document.createElement('a');
      stores.href = 'stores.html';
      stores.className = 'nav__link';
      stores.textContent = 'Stores';
      shop.after(stores);
    }

    if (!document.getElementById('nav-cart')) {
      const bag = document.createElement('button');
      bag.type = 'button';
      bag.id = 'nav-cart';
      bag.className = 'nav__bag';
      bag.setAttribute('aria-label', 'Shopping bag, empty');
      bag.innerHTML = `Bag <span class="nav__bag-count nav__bag-count--empty" aria-hidden="true">0</span>`;
      const cta = right.querySelector('.nav__cta');
      if (cta) right.insertBefore(bag, cta);
      else right.appendChild(bag);
      bag.addEventListener('click', () => {
        if (document.getElementById('cart-drawer')?.classList.contains('cart-drawer--open')) close();
        else open();
      });
    }
  }

  function initCart() {
    ensureDrawer();
    ensureNavExtras();
    load();
    renderList();
    updateBagCount();
  }

  window.ScadoudleCart = { addFromCard, open, close, init: initCart };
  window.initCart = initCart;
})();
