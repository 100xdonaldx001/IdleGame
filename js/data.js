import items from './items.js';
import Woodcutting from './skills/Woodcutting/index.js';
import Mining from './skills/Mining/index.js';
import Fishing from './skills/Fishing/index.js';
import Smithing from './skills/Smithing/index.js';
import Cooking from './skills/Cooking/index.js';
import Combat from './skills/Combat/index.js';
import Endurance from './skills/Endurance/index.js';
import Farming from './skills/Farming/index.js';
import {VERSION} from './constants.js';

export const skillModules = { Woodcutting, Mining, Fishing, Smithing, Cooking, Combat, Endurance, Farming };
export const skills = Object.keys(skillModules);
export const nodes = Object.fromEntries(skills.map(k => [k, skillModules[k].nodes]));
export const inventory = Object.fromEntries(items.map(i => [i.key, 0]));
export const itemMap = Object.fromEntries(items.map(i => [i.key, i.name]));

function baseSkills() {
  const obj = {};
  skills.forEach(s => { obj[s] = { lvl: 1, xp: 0, task: null }; });
  if (obj.Farming) obj.Farming.fields = 4;
  return obj;
}

export const data = {
  meta: { version: VERSION, created: Date.now(), last: Date.now(), autosave: true, debug: false, offlineCapHrs: 8, virtualLevels: false },
  gold: 0,
  xp: 0,
  skills: baseSkills(),
  inventory,
  upgrades: {},
  craftingQueue: [],
  activeSkill: 'Woodcutting',
  combat: { running: false, area: 'Glade', player: { hpMax: 10, hp: 10, atk: 4, def: 2, spd: 1.0, crit: 0.05 }, enemyKey: 'Slime', progress: 0 },
  ach: {},
};
