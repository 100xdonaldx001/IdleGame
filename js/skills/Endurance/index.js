const skill = 'Endurance';

export const nodes = [
  {key:'train', name:'Jogging', time:3000, yield:{xp:[5,8]}, xp:0, req:1},
];

export function perform(state, node, {addSkillXP, randInt}) {
  for (const [k,[a,b]] of Object.entries(node.yield||{})) {
    if (k === 'xp') addSkillXP(skill, randInt(a,b));
  }
  addSkillXP(skill, node.xp);
  return true;
}

export default {nodes, perform};
