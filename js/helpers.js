import {data} from './data.js';
import upgrades from './upgrades/index.js';
import {clamp} from './utils.js';
import {getBonus} from './equipment.js';

export function addInventory(key, amount) {
  data.inventory[key] = (data.inventory[key] || 0) + amount;
}

export function canAfford(cost) {
  return data.gold >= cost;
}

export function applyUpgradeEffects() {
  const p = data.combat.player;
  const ratio = p.hp / p.hpMax || 1;
  p.hpMax = 10; p.atk = 4; p.def = 2; p.spd = 1.0;
  const lvl = data.skills.Endurance ? data.skills.Endurance.lvl : 1;
  p.hpMax = Math.floor(p.hpMax * Math.pow(1.02, lvl - 1));
  let hpFlat = 0;
  for (const k in data.upgrades) {
    const u = upgrades.find(v => v.key === k); if (!u) continue;
    const lvl = data.upgrades[k];
    if (u.type === 'combatFlat') { if (u.eff.atk) p.atk += u.eff.atk * lvl; if (u.eff.def) p.def += u.eff.def * lvl; if (u.eff.hp) hpFlat += u.eff.hp * lvl; }
    if (u.type === 'combatMul') { if (u.eff.spd) p.spd *= Math.pow(u.eff.spd, lvl); }
  }
  p.hpMax += hpFlat; p.hp = clamp(Math.round(p.hpMax * ratio), 1, p.hpMax);
}

function productOf(pred) {
  let m = 1;
  for (const k in data.upgrades) {
    const u = upgrades.find(v => v.key === k);
    if (u && pred(u)) m *= Math.pow(Object.values(u.eff)[0], data.upgrades[k]);
  }
  return m;
}

function sumOf(pred) {
  let s = 0;
  for (const k in data.upgrades) {
    const u = upgrades.find(v => v.key === k);
    if (u && pred(u)) { const key = Object.keys(u.eff)[0]; s += u.eff[key] * data.upgrades[k]; }
  }
  return s;
}

export const mul = {
  globalGain: () => productOf(u => u.type === 'global' && u.eff.gain),
  globalXP: () => productOf(u => u.type === 'global' && u.eff.xp),
  globalSpeed: () => productOf(u => u.type === 'global' && u.eff.speed),
  skillGain: skill => productOf(u => u.type === skill && u.eff.gain),
  skillSpeed: skill => productOf(u => u.type === skill && u.eff.speed),
  craftValue: () => productOf(u => u.type === 'craft' && u.eff.craftValue),
  offlineFrac: skill => sumOf(u => u.type === skill && u.eff.offline),
  equipSpeed: skill => getBonus(skill).speed,
  equipYield: skill => getBonus(skill).yield,
};
