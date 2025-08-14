import global from './global.js';
import woodcutting from './Woodcutting.js';
import mining from './Mining.js';
import fishing from './Fishing.js';
import smithing from './Smithing.js';
import cooking from './Cooking.js';
import alchemy from './Alchemy.js';
import craft from './Craft.js';
import combat from './Combat.js';

export default [
  ...global,
  ...woodcutting,
  ...mining,
  ...fishing,
  ...smithing,
  ...cooking,
  ...alchemy,
  ...craft,
  ...combat,
];
