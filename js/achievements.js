import {getStat} from './stats.js';

export default [
  {key:'rich1', name:'First Gold', cond:s=>s.gold>=100, reward:50},
  {key:'miner5', name:'Miner Lv.5', cond:s=>s.skills.Mining.lvl>=5, reward:30},
  {key:'cook10', name:'Chef Lv.10', cond:s=>s.skills.Cooking.lvl>=10, reward:100},
  {key:'slime50', name:'Slime Smasher', cond:s=>getStat('slimeKills')>=50, reward:80},
];
