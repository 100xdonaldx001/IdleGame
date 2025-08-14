import {data, itemMap} from '../data.js';
import {el, fmt} from '../utils.js';
import {buyItem, sellItem} from '../market.js';

export function renderMarket() {
  const g = el('#marketGrid');
  if (!g) return;
  g.innerHTML = '';
  for (const [k, v] of Object.entries(data.market)) {
    const owned = data.inventory[k] || 0;
    if (v.stock <= 0 && owned <= 0) continue;
    const card = document.createElement('div');
    card.className = 'panel';
    const name = itemMap[k] || k;
    card.innerHTML = `<div class="phead"><b>${name}</b><small class="muted">${fmt(v.price)}g</small></div>` +
      `<div class="row"><span>Stock: ${fmt(v.stock)}</span>` +
      `<button class="btn" data-buy="${k}">Buy</button>` +
      `<button class="btn" data-sell="${k}">Sell</button></div>`;
    g.appendChild(card);
  }
  g.querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', () => { buyItem(b.dataset.buy); renderMarket(); }));
  g.querySelectorAll('[data-sell]').forEach(b => b.addEventListener('click', () => { sellItem(b.dataset.sell); renderMarket(); }));
}
