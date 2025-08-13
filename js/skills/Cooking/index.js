import items from '../../items.js';

const skill = 'Cooking';
const map = Object.fromEntries(items.map(i => [i.key, i]));
const {
  anchovy,
  twig,
  meal,
  wheat,
  tomato,
  carrot,
  trout,
  apple,
  bread,
  stew,
  pie,
  fishStew,
} = map;

export const nodes = [
  {key: meal.key, name: 'Cook Meal', time: 3500, consume: {[anchovy.key]: 2, [twig.key]: 1}, yield: {[meal.key]: [1, 2]}, xp: 10, req: 3},
  {key: bread.key, name: 'Bake Bread', time: 4000, consume: {[wheat.key]: 2, [twig.key]: 1}, yield: {[bread.key]: [1, 1]}, xp: 12, req: 5},
  {key: stew.key, name: 'Veggie Stew', time: 6000, consume: {[tomato.key]: 1, [carrot.key]: 1, [twig.key]: 1}, yield: {[stew.key]: [1, 1]}, xp: 18, req: 15},
  {key: pie.key, name: 'Fruit Pie', time: 6500, consume: {[apple.key]: 2, [wheat.key]: 1, [twig.key]: 1}, yield: {[pie.key]: [1, 1]}, xp: 24, req: 25},
  {key: fishStew.key, name: 'Fish Stew', time: 7000, consume: {[trout.key]: 1, [tomato.key]: 1, [carrot.key]: 1, [twig.key]: 1}, yield: {[fishStew.key]: [1, 1]}, xp: 30, req: 35},
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
