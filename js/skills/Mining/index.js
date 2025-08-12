import items from '../../items.js';

const skill = 'Mining';
const map = Object.fromEntries(items.map(i => [i.key, i]));
const { pebble, iron, mythril, gem } = map;

export const nodes = [
  {key: pebble.key, name: 'Pebbles', time: 2500, yield: {[pebble.key]: [1, 2]}, xp: 5, req: 1},
  {key: iron.key, name: 'Iron Vein', time: 4000, yield: {[iron.key]: [3, 5]}, xp: 10, req: 6},
  {key: mythril.key, name: 'Mythril Vein', time: 6000, yield: {[mythril.key]: [6, 8], [gem.key]: [0, 1]}, xp: 16, req: 14},
];

export function perform(state, node, {addInventory, addSkillXP, randInt}) {
  if(node.consume && !Object.entries(node.consume).every(([k,v])=> (state.inventory[k]||0)>=v)) return false;
  if(node.consume) for(const [k,v] of Object.entries(node.consume)) state.inventory[k]-=v;
  for(const [k,[a,b]] of Object.entries(node.yield||{})) addInventory(k, randInt(a,b));
  addSkillXP(skill, node.xp);
  return true;
}

export default {nodes, perform};
