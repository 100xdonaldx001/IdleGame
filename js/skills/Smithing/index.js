import items from '../../items.js';

const skill = 'Smithing';
const map = Object.fromEntries(items.map(i => [i.key, i]));
const { iron, bar } = map;

export const nodes = [
  {key: bar.key, name: 'Smelt Bar', time: 4000, consume: {[iron.key]: 3}, yield: {[bar.key]: [1, 1]}, xp: 10, req: 3},
  {key: 'plate', name: 'Forge Plate', time: 6000, consume: {[bar.key]: 3}, yield: {gold: [7, 12]}, xp: 14, req: 10},
];

export function perform(state, node, {addInventory, addSkillXP, randInt, mul}) {
  if(node.consume && !Object.entries(node.consume).every(([k,v])=> (state.inventory[k]||0)>=v)) return false;
  if(node.consume) for(const [k,v] of Object.entries(node.consume)) state.inventory[k]-=v;
  for(const [k,[a,b]] of Object.entries(node.yield||{})) {
    if(k==='gold') {
      const base = randInt(a,b);
      state.gold += base;
      const extra = mul.craftValue()-1;
      if(extra>0) state.gold += Math.floor(base*extra);
    } else {
      addInventory(k, randInt(a,b));
    }
  }
  addSkillXP(skill, node.xp);
  return true;
}

export default {nodes, perform};
