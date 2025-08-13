import {data, itemMap} from './data.js';

let nextId = 1;

function getSkill(key) {
  const k = key.toLowerCase();
  if (k.includes('pickaxe')) return 'Mining';
  if (k.includes('axe')) return 'Woodcutting';
  return null;
}

export function addEquipment(key) {
  const skill = getSkill(key);
  if (!skill) return false;
  const item = {
    id: nextId++,
    key,
    name: itemMap[key] || key,
    skill,
    speed: Math.random() * 0.2,
    yield: Math.random() * 0.2,
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
  return {speed: 1 + it.speed, yield: 1 + it.yield};
}

export function isEquipable(key) {
  return !!getSkill(key);
}
