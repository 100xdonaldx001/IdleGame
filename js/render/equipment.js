import {data} from '../data.js';
import {equipItem} from '../equipment.js';
import {renderEnchanting} from './enchanting.js';
import {el} from '../utils.js';

export function renderEquipment() {
  const g = el('#eqGrid');
  if (!g) return;
  g.innerHTML = '';
  renderEnchanting(null);
  data.equipment.forEach(it => {
    const card = document.createElement('div');
    card.className = 'panel';
    const eq = data.equipped[it.skill] === it.id;
    const e = it.ench || {};
    const spd = Math.round((it.speed + (e.speed || 0)) * 100);
    const yld = Math.round((it.yield + (e.yield || 0)) * 100);
    card.innerHTML = `<div class="phead"><b>${it.name}</b><small class="muted">${it.skill} • ${it.rarity}</small></div>
      <div class="list">
        <div class="item"><span>Speed</span><span>+${spd}%</span></div>
        <div class="item"><span>Yield</span><span>+${yld}%</span></div>
      </div>
      <div class="footer"><button class="btn ${eq ? 'good' : ''}" data-act="equip">${eq ? 'Equipped' : 'Equip'}</button>
      <button class="btn" data-act="enchant">Enchant</button></div>`;
    card.querySelector('button[data-act="equip"]').addEventListener('click', () => { equipItem(it.id); renderEquipment(); });
    card.querySelector('button[data-act="enchant"]').addEventListener('click', () => { renderEnchanting(it.id); });
    g.appendChild(card);
  });
}

