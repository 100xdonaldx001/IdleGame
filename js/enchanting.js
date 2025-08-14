import {data} from './data.js';
import {applyEnchant} from './equipment.js';
import {showToast} from './toast.js';

const baseCost = {speed: 20, yield: 20};
const rarityMult = {common: 1, uncommon: 1.2, rare: 1.5, epic: 2, legendary: 3};

export function getEnchantCost(item, stat) {
  const lvl = Math.round((item.ench && item.ench[stat] || 0) / 0.05);
  const mult = rarityMult[item.rarity] || 1;
  return Math.floor(baseCost[stat] * (lvl + 1) * mult);
}

export function enchantItem(id, stat) {
  const it = data.equipment.find(e => e.id === id);
  if (!it) return false;
  const cost = getEnchantCost(it, stat);
  if (data.gold < cost) {
    showToast('Not enough gold');
    return false;
  }
  data.gold -= cost;
  applyEnchant(id, stat, 0.05);
  showToast('Enchantment applied');
  return true;
}
