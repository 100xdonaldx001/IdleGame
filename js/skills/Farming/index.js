import items from '../../items.js';

const skill = 'Farming';
const map = Object.fromEntries(items.map(i => [i.key, i]));
const { wheat, barley, oat, apple, tomato, carrot } = map;

export const nodes = [
  {key: wheat.key, name: 'Wheat', time: [180000, 240000], yield: {[wheat.key]: [3, 5]}, xp: 5, req: 1},
  {key: barley.key, name: 'Barley', time: [240000, 300000], yield: {[barley.key]: [3, 5]}, xp: 9, req: 10},
  {key: oat.key, name: 'Oat', time: [300000, 360000], yield: {[oat.key]: [3, 5]}, xp: 13, req: 20},
  {key: apple.key, name: 'Apples', time: [360000, 420000], yield: {[apple.key]: [2, 4]}, xp: 18, req: 30},
  {key: tomato.key, name: 'Tomatoes', time: [420000, 480000], yield: {[tomato.key]: [2, 4]}, xp: 24, req: 40},
  {key: carrot.key, name: 'Carrots', time: [480000, 540000], yield: {[carrot.key]: [2, 3]}, xp: 30, req: 50},
];

export function perform(state, node, {addInventory, addSkillXP, randInt}) {
  for (const [k, [a, b]] of Object.entries(node.yield || {})) {
    addInventory(k, randInt(a, b));
  }
  addSkillXP(skill, node.xp);
  return true;
}

export default {nodes, perform};
