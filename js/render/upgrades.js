import upgrades from '../upgrades/index.js';
import {data} from '../data.js';
import {canAfford, applyUpgradeEffects} from '../helpers.js';
import {el, fmt} from '../utils.js';
import {renderAll} from '../render.js';

export function renderUpgrades() {
  const sel = el('#upgFilter');
  if (sel && !sel.dataset.init) {
    sel.innerHTML = '<option value="all">All</option>';
    const types = Array.from(new Set(upgrades.map(u => u.type)));
    types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      sel.appendChild(opt);
    });
    sel.addEventListener('change', renderUpgrades);
    sel.dataset.init = '1';
  }
  const filter = sel ? sel.value : 'all';
  const g = el('#upgGrid'); g.innerHTML = '';
  upgrades.filter(u => filter === 'all' || u.type === filter).forEach(u => {
    const now = Date.now();
    const exp = data.upgrades[u.key] || 0;
    const active = u.duration && exp > now;
    const lvl = u.duration ? (active ? 1 : 0) : (data.upgrades[u.key] || 0);
    const maxed = u.duration ? active : lvl >= u.max;
    const cost = u.duration ? u.cost : Math.floor(u.cost * Math.pow(1.75, lvl));
    const can = canAfford(cost) && !maxed;
    const status = u.duration ? (active ? 'Active' : 'Inactive') : `Lv ${lvl}/${u.max}`;
    const card = document.createElement('div'); card.className = 'panel';
    card.innerHTML = `<div class="phead"><b>${u.name}</b><small class="muted">${u.type}</small></div>
    <p class="hint">${u.desc}</p>
    <div class="row"><span class="chip">${status}</span><span class="chip">Cost ${fmt(cost)}</span></div>
    <div class="footer"><button class="btn ${can ? 'good' : ''}" ${!can ? 'disabled' : ''}>Buy</button></div>`;
    card.querySelector('button').addEventListener('click', () => {
      if (data.gold < cost || maxed) return;
      data.gold -= cost;
      if (u.duration) data.upgrades[u.key] = Date.now() + u.duration;
      else data.upgrades[u.key] = (data.upgrades[u.key] || 0) + 1;
      applyUpgradeEffects(); renderAll();
    });
    g.appendChild(card);
  });
}

