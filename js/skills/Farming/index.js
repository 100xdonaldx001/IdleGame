import items from '../../items.js';

const skill = 'Farming';
const map = Object.fromEntries(items.map(i => [i.key, i]));
const { wheat, barley, oat, apple, tomato, carrot } = map;

export const nodes = [
  {key: wheat.key, name: 'Wheat', time: 3000, yield: {[wheat.key]: [3, 5]}, xp: 5, req: 1},
  {key: barley.key, name: 'Barley', time: 4000, yield: {[barley.key]: [3, 5]}, xp: 9, req: 10},
  {key: oat.key, name: 'Oat', time: 5000, yield: {[oat.key]: [3, 5]}, xp: 13, req: 20},
  {key: apple.key, name: 'Apples', time: 6000, yield: {[apple.key]: [2, 4]}, xp: 18, req: 30},
  {key: tomato.key, name: 'Tomatoes', time: 7000, yield: {[tomato.key]: [2, 4]}, xp: 24, req: 40},
  {key: carrot.key, name: 'Carrots', time: 8000, yield: {[carrot.key]: [2, 3]}, xp: 30, req: 50},
];

export function perform(state, node, {addInventory, addSkillXP, randInt}) {
  const fields = state.skills?.Farming?.fields || 1;
  for (let i = 0; i < fields; i++) {
    for (const [k, [a, b]] of Object.entries(node.yield || {})) addInventory(k, randInt(a, b));
  }
  addSkillXP(skill, node.xp);
  return true;
}

export default {nodes, perform};
