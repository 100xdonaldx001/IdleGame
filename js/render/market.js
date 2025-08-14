import {data, itemMap} from '../data.js';
import {el, fmt} from '../utils.js';
import {listItem} from '../market.js';

export function renderMarket() {
  const g = el('#marketGrid');
  if (!g) return;
  g.innerHTML = '';
  const queued = {};
  data.marketQueue.forEach(it => { queued[it.key] = (queued[it.key] || 0) + 1; });
  for (const [k, v] of Object.entries(data.market)) {
    const owned = data.inventory[k] || 0;
    const q = queued[k] || 0;
    if (owned <= 0 && q <= 0) continue;
    const card = document.createElement('div');
    card.className = 'panel';
    const name = itemMap[k] || k;
    card.innerHTML = `<div class="phead"><b>${name}</b><small class="muted">Base ${fmt(v.base)}g</small></div>` +
      `<div class="row"><span>Owned: ${fmt(owned)}</span>` +
      `<input type="number" value="${v.base}" min="1" style="width:60px" data-price="${k}">` +
      `<button class="btn" data-list="${k}">List</button></div>` +
      (q ? `<div class="row"><span>Queued: ${fmt(q)}</span></div>` : '');
    g.appendChild(card);
  }
  g.querySelectorAll('[data-list]').forEach(b => b.addEventListener('click', () => {
    const key = b.dataset.list;
    const input = g.querySelector(`[data-price="${key}"]`);
    const price = Number(input.value);
    listItem(key, price);
    renderMarket();
  }));
}
