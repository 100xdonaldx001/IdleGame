import {data} from '../data.js';
import {enchantItem, getEnchantCost} from '../enchanting.js';
import {renderEquipment} from './equipment.js';
import {el} from '../utils.js';

export function renderEnchanting(id) {
  const panel = el('#enchantPanel');
  if (!panel) return;
  panel.innerHTML = '';
  if (id == null) {
    panel.hidden = true;
    return;
  }
  const it = data.equipment.find(e => e.id === id);
  if (!it) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;
  const e = it.ench || {};
  const speed = Math.round((it.speed + (e.speed || 0)) * 100);
  const yieldB = Math.round((it.yield + (e.yield || 0)) * 100);
  const speedCost = getEnchantCost(it, 'speed');
  const yieldCost = getEnchantCost(it, 'yield');
  panel.innerHTML = `
    <div class="phead"><b>Enchant ${it.name}</b><small class="muted">${it.rarity}</small></div>
    <div class="list">
      <div class="item"><span>Speed</span><span>+${speed}% <button class="btn" data-stat="speed">Enchant (${speedCost}g)</button></span></div>
      <div class="item"><span>Yield</span><span>+${yieldB}% <button class="btn" data-stat="yield">Enchant (${yieldCost}g)</button></span></div>
    </div>
    <div class="footer"><button class="btn" id="closeEnchant">Close</button></div>`;
  panel.querySelectorAll('button[data-stat]').forEach(b => {
    b.addEventListener('click', () => {
      if (enchantItem(id, b.dataset.stat)) {
        renderEquipment();
        renderEnchanting(id);
      }
    });
  });
  panel.querySelector('#closeEnchant').addEventListener('click', () => {
    renderEnchanting(null);
  });
}
