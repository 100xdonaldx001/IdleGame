import {registerRenderer, renderAll} from '../renderer.js';
import {data} from '../data.js';
import upgrades from '../upgrades/index.js';
import {canAfford, applyUpgradeEffects} from '../helpers.js';
import {el, fmt} from '../utils.js';

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
  const g = el('#upgGrid');
  g.innerHTML = '';
  upgrades.filter(u => filter === 'all' || u.type === filter).forEach(u => {
    const lvl = data.upgrades[u.key] || 0;
    const maxed = lvl >= u.max;
    const cost = Math.floor(u.cost * Math.pow(1.75, lvl));
    const can = canAfford(cost) && !maxed;
    const card = document.createElement('div');
    card.className = 'panel';
    card.innerHTML = `<div class="phead"><b>${u.name}</b><small class="muted">${u.type}</small></div>
    <p class="hint">${u.desc}</p>
    <div class="row"><span class="chip">Lv ${lvl}/${u.max}</span><span class="chip">Cost ${fmt(cost)}</span></div>
    <div class="footer"><button class="btn ${can ? 'good' : ''}" ${!can ? 'disabled' : ''}>Buy</button></div>`;
    card.querySelector('button').addEventListener('click', () => {
      if (data.gold < cost || maxed) return;
      data.gold -= cost;
      data.upgrades[u.key] = (data.upgrades[u.key] || 0) + 1;
      applyUpgradeEffects();
      renderAll();
    });
    g.appendChild(card);
  });
}

registerRenderer(renderUpgrades);
