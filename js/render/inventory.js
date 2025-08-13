import {registerRenderer} from '../renderer.js';
import {data, itemMap} from '../data.js';
import {el, fmt} from '../utils.js';

export function renderInventory() {
  const g = el('#invGrid');
  g.innerHTML = '';
  for (const [k, v] of Object.entries(data.inventory)) {
    if (v <= 0) continue;
    const card = document.createElement('div');
    card.className = 'panel';
    const name = itemMap[k] || k;
    card.innerHTML = `<div class="phead"><b>${name}</b><small class="muted">Resource</small></div><div class="kv"><b>${fmt(v)}</b></div>`;
    g.appendChild(card);
  }
}

registerRenderer(renderInventory);
