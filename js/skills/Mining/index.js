import items from '../../items.js';

const skill = 'Mining';
const map = Object.fromEntries(items.map(i => [i.key, i]));
const { copper, iron, silver, goldOre, platinum, titanium, uranium, diamond } = map;

export const nodes = [
  {key: copper.key, name: 'Copper Vein', time: 2500, yield: {[copper.key]: [1, 1]}, xp: 5, req: 1},
  {key: iron.key, name: 'Iron Vein', time: 3500, yield: {[iron.key]: [1, 1]}, xp: 12, req: 15},
  {key: silver.key, name: 'Silver Vein', time: 4500, yield: {[silver.key]: [1, 1]}, xp: 20, req: 30},
  {key: goldOre.key, name: 'Gold Vein', time: 5500, yield: {[goldOre.key]: [1, 1]}, xp: 29, req: 45},
  {key: platinum.key, name: 'Platinum Vein', time: 6500, yield: {[platinum.key]: [1, 1]}, xp: 39, req: 60},
  {key: titanium.key, name: 'Titanium Vein', time: 7500, yield: {[titanium.key]: [1, 1]}, xp: 50, req: 75},
  {key: uranium.key, name: 'Uranium Vein', time: 8500, yield: {[uranium.key]: [1, 1]}, xp: 62, req: 90},
  {key: diamond.key, name: 'Diamond Deposit', time: 9500, yield: {[diamond.key]: [1, 1]}, xp: 75, req: 99},
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
