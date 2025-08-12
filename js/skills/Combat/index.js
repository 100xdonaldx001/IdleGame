const skill = 'Combat';

export const nodes = [
  {key:'train', name:'Sparring', time:3000, yield:{xp:[6,9], gold:[1,3]}, xp:0, req:1},
];

export function perform(state, node, {addSkillXP, randInt}) {
  for(const [k,[a,b]] of Object.entries(node.yield||{})) {
    if(k==='gold') state.gold += randInt(a,b);
    if(k==='xp') addSkillXP(skill, randInt(a,b));
  }
  addSkillXP(skill, node.xp);
  return true;
}

export default {nodes, perform};
