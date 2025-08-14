import items from '../../items.js';

const skill = 'Alchemy';
const map = Object.fromEntries(items.map(i => [i.key, i]));
const {
  redHerb,
  blueHerb,
  healingPotion,
  manaPotion,
} = map;

export const nodes = [
  {
    key: healingPotion.key,
    name: 'Brew Healing Potion',
    time: 5000,
    consume: {[redHerb.key]: 2},
    yield: {[healingPotion.key]: [1, 1]},
    xp: 12,
    req: 3,
  },
  {
    key: manaPotion.key,
    name: 'Brew Mana Potion',
    time: 5500,
    consume: {[blueHerb.key]: 2},
    yield: {[manaPotion.key]: [1, 1]},
    xp: 15,
    req: 5,
  },
];

export function perform(state, node, {addInventory, addSkillXP, randInt, mul}) {
  if (node.consume && !Object.entries(node.consume).every(([k, v]) => (state.inventory[k] || 0) >= v)) return false;
  if (node.consume) for (const [k, v] of Object.entries(node.consume)) state.inventory[k] -= v;
  for (const [k, [a, b]] of Object.entries(node.yield || {})) {
    if (k === 'gold') {
      const base = randInt(a, b);
      state.gold += base;
      const extra = mul.craftValue() - 1;
      if (extra > 0) state.gold += Math.floor(base * extra);
    } else {
      addInventory(k, randInt(a, b));
    }
  }
  addSkillXP(skill, node.xp);
  return true;
}

export default {nodes, perform};
