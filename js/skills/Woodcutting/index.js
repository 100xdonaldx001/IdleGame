import items from '../../items.js';

const skill = 'Woodcutting';
const map = Object.fromEntries(items.map(i => [i.key, i]));
const { twig, pine, birch, poplar, cedar, walnut, chestnut, baobab } = map;

export const nodes = [
  {key: twig.key, name: 'Twigs', time: 2500, yield: {[twig.key]: [1, 1]}, xp: 5, req: 1},
  {key: pine.key, name: 'Pine', time: 3500, yield: {[pine.key]: [1, 1]}, xp: 12, req: 15},
  {key: birch.key, name: 'Birch', time: 4500, yield: {[birch.key]: [1, 1]}, xp: 20, req: 30},
  {key: poplar.key, name: 'Poplar', time: 5500, yield: {[poplar.key]: [1, 1]}, xp: 29, req: 45},
  {key: cedar.key, name: 'Cedar', time: 6500, yield: {[cedar.key]: [1, 1]}, xp: 39, req: 60},
  {key: walnut.key, name: 'Walnut', time: 7500, yield: {[walnut.key]: [1, 1]}, xp: 50, req: 75},
  {key: chestnut.key, name: 'Chestnut', time: 8500, yield: {[chestnut.key]: [1, 1]}, xp: 62, req: 90},
  {key: baobab.key, name: 'Baobab', time: 9500, yield: {[baobab.key]: [1, 1]}, xp: 75, req: 99},
];

export function perform(state, node, {addInventory, addSkillXP, randInt, mul}) {
  if(node.consume && !Object.entries(node.consume).every(([k,v])=> (state.inventory[k]||0)>=v)) return false;
  if(node.consume) for(const [k,v] of Object.entries(node.consume)) state.inventory[k]-=v;
  const bonus = mul.equipYield ? mul.equipYield(skill) : 1;
  for(const [k,[a,b]] of Object.entries(node.yield||{})) addInventory(k, Math.floor(randInt(a,b) * bonus));
  addSkillXP(skill, node.xp);
  return true;
}

export default {nodes, perform};
