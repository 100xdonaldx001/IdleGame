const skill = 'Cooking';

export const nodes = [
  {key:'meal', name:'Cook Meal', time:3500, consume:{fish:2, twig:1}, yield:{meal:[1,2]}, xp:10, req:3},
  {key:'feast', name:'Hearty Feast', time:5500, consume:{meal:2, bar:1}, yield:{gold:[10,16]}, xp:14, req:11},
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
