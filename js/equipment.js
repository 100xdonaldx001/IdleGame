import {data, itemMap} from './data.js';

let nextId = 1;

const rarityTable = [
  ['common', 60, 1],
  ['uncommon', 25, 1.1],
  ['rare', 10, 1.25],
  ['epic', 4, 1.4],
  ['legendary', 1, 1.6]
];

function rollRarity() {
  const total = rarityTable.reduce((a, [, w]) => a + w, 0);
  let r = Math.random() * total;
  for (const [name, w, mult] of rarityTable) {
    r -= w;
    if (r <= 0) return {name, mult};
  }
  return {name: 'common', mult: 1};
}

function getSkill(key) {
  const k = key.toLowerCase();
  if (k.includes('pickaxe')) return 'Mining';
  if (k.includes('axe')) return 'Woodcutting';
  return null;
}

export function addEquipment(key) {
  const skill = getSkill(key);
  if (!skill) return false;
  const {name: rarity, mult} = rollRarity();
  const item = {
    id: nextId++,
    key,
    name: itemMap[key] || key,
    skill,
    rarity,
    speed: Math.random() * 0.2 * mult,
    yield: Math.random() * 0.2 * mult,
    ench: {}
  };
  data.equipment.push(item);
  return true;
}

export function equipItem(id) {
  const it = data.equipment.find(e => e.id === id);
  if (!it) return;
  if (data.equipped[it.skill] === id) {
    delete data.equipped[it.skill];
  } else {
    data.equipped[it.skill] = id;
  }
}

export function getBonus(skill) {
  const id = data.equipped[skill];
  if (!id) return {speed: 1, yield: 1};
  const it = data.equipment.find(e => e.id === id);
  if (!it) return {speed: 1, yield: 1};
  const e = it.ench || {};
  return {
    speed: 1 + it.speed + (e.speed || 0),
    yield: 1 + it.yield + (e.yield || 0)
  };
}

export function isEquipable(key) {
  return !!getSkill(key);
}

export function applyEnchant(id, stat, value) {
  const it = data.equipment.find(e => e.id === id);
  if (!it) return false;
  it.ench = it.ench || {};
  it.ench[stat] = (it.ench[stat] || 0) + value;
  return true;
}
