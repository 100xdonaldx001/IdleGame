import {data} from '../data.js';
import {mul} from '../helpers.js';
import {el, fmt} from '../utils.js';

export function renderOverview() {
  const g = el('#overviewGrid');
  g.innerHTML = '';
  const cards = [
    ['Gold', `Earned from many actions.`, `<div class="kv"><b>${fmt(data.gold)}</b><small class="muted">coins</small></div>`],
    ['Inventory', `Your current stock.`, Object.entries(data.inventory)
      .filter(([_, v]) => v > 0)
      .map(([k, v]) => `<span class="chip">${k}: ${fmt(v)}</span>`).join(' ')],
    ['Training', `Current skill & task.`, `<div>${data.activeSkill} → <b>${(data.skills[data.activeSkill].task || 'Choose a node')}</b></div>`],
    ['Global Multipliers', `From upgrades.`, `<div class="list">
        <div class="item"><span>Gain</span><b>x${mul.globalGain().toFixed(2)}</b></div>
        <div class="item"><span>XP</span><b>x${mul.globalXP().toFixed(2)}</b></div>
        <div class="item"><span>Speed</span><b>x${mul.globalSpeed().toFixed(2)}</b></div>
      </div>`]
  ];
  for (const [title, sub, body] of cards) {
    const card = document.createElement('div');
    card.className = 'panel';
    card.innerHTML = `<div class="phead"><b>${title}</b><small class="muted">${sub}</small></div>${body}`;
    g.appendChild(card);
  }
}

