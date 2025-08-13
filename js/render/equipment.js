import {registerRenderer} from '../renderer.js';
import {data} from '../data.js';
import {equipItem} from '../equipment.js';
import {el} from '../utils.js';

export function renderEquipment() {
  const g = el('#eqGrid');
  if (!g) return;
  g.innerHTML = '';
  data.equipment.forEach(it => {
    const card = document.createElement('div');
    card.className = 'panel';
    const eq = data.equipped[it.skill] === it.id;
    card.innerHTML = `<div class="phead"><b>${it.name}</b><small class="muted">${it.skill}</small></div>
    <div class="list">
      <div class="item"><span>Speed</span><span>+${Math.round(it.speed * 100)}%</span></div>
      <div class="item"><span>Yield</span><span>+${Math.round(it.yield * 100)}%</span></div>
    </div>
    <div class="footer"><button class="btn ${eq ? 'good' : ''}">${eq ? 'Equipped' : 'Equip'}</button></div>`;
    card.querySelector('button').addEventListener('click', () => { equipItem(it.id); renderEquipment(); });
    g.appendChild(card);
  });
}

registerRenderer(renderEquipment);
