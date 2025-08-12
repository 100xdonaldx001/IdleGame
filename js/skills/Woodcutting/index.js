import items from '../../items.js';

const skill = 'Woodcutting';
const map = Object.fromEntries(items.map(i => [i.key, i]));
const { twig, oak, yew } = map;

export const nodes = [
  {key: twig.key, name: 'Twigs', time: 2000, yield: {[twig.key]: [1, 2]}, xp: 4, req: 1},
  {key: oak.key, name: 'Oak', time: 3500, yield: {[oak.key]: [3, 5]}, xp: 8, req: 5},
  {key: yew.key, name: 'Yew', time: 5000, yield: {[yew.key]: [6, 8]}, xp: 14, req: 12},
];

export function perform(state, node, {addInventory, addSkillXP, randInt}) {
  if(node.consume && !Object.entries(node.consume).every(([k,v])=> (state.inventory[k]||0)>=v)) return false;
  if(node.consume) for(const [k,v] of Object.entries(node.consume)) state.inventory[k]-=v;
  for(const [k,[a,b]] of Object.entries(node.yield||{})) addInventory(k, randInt(a,b));
  addSkillXP(skill, node.xp);
  return true;
}

export default {nodes, perform};
