import {setToastSuppressed} from './toast.js';
import {getStat, stats} from './stats.js';
import {data, nodes} from './data.js';
import {checkAchievements} from './achievementCheck.js';
import {mul, addInventory} from './helpers.js';
import {addSkillXP, helpers} from './progress.js';
import Smithing from './skills/Smithing/index.js';
import {el} from './utils.js';

function deepAssign(target, source) {
  Object.keys(target).forEach(k => { delete target[k]; });
  Object.keys(source).forEach(k => { target[k] = source[k]; });
}

export function runTests() {
  setToastSuppressed(true);
  const results = [];
  function assert(name, cond) { results.push({name, pass: !!cond}); if (!cond) console.error('FAIL:', name); else console.log('OK:', name); }
  const dataSnap = JSON.parse(JSON.stringify(data));
  const statsSnap = JSON.parse(JSON.stringify(stats));
  try {
    assert('getStat returns 0 for unknown', getStat('__nope__') === 0);
    stats.__tmp = 3; assert('getStat returns existing value', getStat('__tmp') === 3); delete stats.__tmp;
    data.ach = {}; stats.slimeKills = 49; const g0 = data.gold; checkAchievements();
    assert('slime50 not unlocked at 49', !data.ach.slime50);
    stats.slimeKills = 50; const g1 = data.gold; checkAchievements();
    assert('slime50 unlocked at 50', !!data.ach.slime50);
    assert('slime50 gives 80 gold', data.gold === g1 + 80);
    data.upgrades = {}; assert('globalGain baseline 1', Math.abs(mul.globalGain() - 1) < 1e-9);
    assert('globalXP baseline 1', Math.abs(mul.globalXP() - 1) < 1e-9);
    assert('globalSpeed baseline 1', Math.abs(mul.globalSpeed() - 1) < 1e-9);
    data.inventory = {twig:0, pine:0, baobab:0, copper:0, iron:0, silver:0, goldOre:0, platinum:0, titanium:0, uranium:0, diamond:0, fish:0, bar:0, meal:0, gem:0, skin:0};
    const smelt = nodes.Smithing[0];
    assert('smelt fails with no iron', Smithing.perform(data, smelt, helpers) === false);
    data.inventory.iron = 3; const bBefore = data.inventory.bar || 0; assert('smelt succeeds with iron', Smithing.perform(data, smelt, helpers) === true);
    assert('bar increased by 1', data.inventory.bar === bBefore + 1);
  } finally {
    deepAssign(data, dataSnap); deepAssign(stats, statsSnap); setToastSuppressed(false);
  }
  const pass = results.filter(r => r.pass).length; const total = results.length;
  const text = `${pass}/${total} tests passed.`;
  console.log('[Idle Foundry Tests]', text, results);
  const trg = el('#testResults'); if (trg) trg.textContent = 'Tests: ' + text;
  return {pass, total, results};
}
