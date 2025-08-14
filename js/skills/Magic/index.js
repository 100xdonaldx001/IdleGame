import items from '../../items.js';

const skill = 'Magic';
const map = Object.fromEntries(items.map(i => [i.key, i]));
const { airRune, fireRune, waterRune, earthRune, magicEssence } = map;

export const nodes = [
  { key: 'gust', name: 'Cast Gust', time: 3000, consume: { [airRune.key]: 1 }, yield: { [magicEssence.key]: [1, 1] }, xp: 8, req: 1 },
  { key: 'fireball', name: 'Cast Fireball', time: 4000, consume: { [fireRune.key]: 1 }, yield: { [magicEssence.key]: [1, 2] }, xp: 15, req: 15 },
  { key: 'waterSurge', name: 'Cast Water Surge', time: 5000, consume: { [waterRune.key]: 1 }, yield: { [magicEssence.key]: [2, 3] }, xp: 25, req: 30 },
  { key: 'earthShield', name: 'Cast Earth Shield', time: 6000, consume: { [earthRune.key]: 1 }, yield: { [magicEssence.key]: [3, 4] }, xp: 40, req: 45 },
];

export function perform(state, node, {addInventory, addSkillXP, randInt, mul}) {
  if (node.consume && !Object.entries(node.consume).every(([k, v]) => (state.inventory[k] || 0) >= v)) return false;
  if (node.consume) for (const [k, v] of Object.entries(node.consume)) state.inventory[k] -= v;
  const bonus = mul.equipYield ? mul.equipYield(skill) : 1;
  for (const [k, [a, b]] of Object.entries(node.yield || {})) addInventory(k, Math.floor(randInt(a, b) * bonus));
  addSkillXP(skill, node.xp);
  return true;
}

export default {nodes, perform};
