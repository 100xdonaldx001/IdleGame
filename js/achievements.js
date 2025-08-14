import {getStat} from './stats.js';

export default [
  {key:'rich1', name:'First Gold', cond:s=>s.gold>=100, reward:50},
  {key:'miner5', name:'Miner Lv.5', cond:s=>s.skills.Mining.lvl>=5, reward:30},
  {key:'cook10', name:'Chef Lv.10', cond:s=>s.skills.Cooking.lvl>=10, reward:100},
  {key:'slime50', name:'Slime Smasher', cond:s=>getStat('slimeKills')>=50, reward:80},
  {key:'wood5', name:'Lumberjack Lv.5', cond:s=>s.skills.Woodcutting.lvl>=5, reward:40},
  {key:'fish5', name:'Angler Lv.5', cond:s=>s.skills.Fishing.lvl>=5, reward:40},
  {key:'combat5', name:'Warrior Lv.5', cond:s=>s.skills.Combat.lvl>=5, reward:{gold:60, xp:50}},
  {key:'slime200', name:'Slime Annihilator', cond:s=>getStat('slimeKills')>=200, reward:{gold:150, xp:150}},
];
