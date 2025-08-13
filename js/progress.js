import {data} from './data.js';
import {mul, addInventory, applyUpgradeEffects} from './helpers.js';
import {addEquipment} from './equipment.js';
import {randInt, levelFromXP} from './utils.js';
import {showToast} from './toast.js';

export function addSkillXP(skill, amount) {
  const sk = data.skills[skill];
  const gain = Math.floor(amount * mul.globalXP());
  sk.xp += gain; data.xp += gain;
  const lvlNow = levelFromXP(sk.xp);
  if (lvlNow > sk.lvl && sk.lvl < 99) {
    sk.lvl = Math.min(lvlNow, 99);
    showToast(`${skill} → Lv.${sk.lvl}!`);
    if (skill === 'Endurance') applyUpgradeEffects();
  }
}

export const helpers = {addInventory, addEquipment, addSkillXP, randInt, mul};
