import items from '../../items.js';

const skill = 'Fishing';
const map = Object.fromEntries(items.map(i => [i.key, i]));
const { fish, skin } = map;

export const nodes = [
  {key: 'pond', name: 'Pond', time: 2500, yield: {[fish.key]: [1, 2]}, xp: 5, req: 1},
  {key: 'river', name: 'River', time: 3800, yield: {[fish.key]: [3, 4]}, xp: 9, req: 7},
  {key: 'sea', name: 'Open Sea', time: 5200, yield: {[fish.key]: [5, 7], [skin.key]: [0, 1]}, xp: 15, req: 13},
];

export function perform(state, node, {addInventory, addSkillXP, randInt}) {
  if(node.consume && !Object.entries(node.consume).every(([k,v])=> (state.inventory[k]||0)>=v)) return false;
  if(node.consume) for(const [k,v] of Object.entries(node.consume)) state.inventory[k]-=v;
  for(const [k,[a,b]] of Object.entries(node.yield||{})) addInventory(k, randInt(a,b));
  addSkillXP(skill, node.xp);
  return true;
}

export default {nodes, perform};
