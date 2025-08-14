import {data} from './data.js';
import {stats} from './stats.js';
import enemies from './enemies.js';
import {addInventory} from './helpers.js';
import {addSkillXP} from './progress.js';
import {updateQuestProgress} from './quests.js';
import {randInt, clamp, el} from './utils.js';

const cvs = el('#arena');
const ctx = cvs.getContext('2d');
let lastAtkP = 0, lastAtkE = 0; let enemyHP = 30;
let currentEnemy = null;

export function getEnemy(key) {
  if (!currentEnemy || currentEnemy.base !== key) {
    let e = enemies[data.combat.area].find(e => e.key === key) || enemies[data.combat.area][0];
    if (e.key === 'Goblin' && Math.random() < 0.01) {
      e = {...e, key: 'Loot Goblin', gold: [50, 100]};
    }
    currentEnemy = {...e, base: key};
  }
  return currentEnemy;
}

export function startStopFight() {
  data.combat.running = !data.combat.running;
  if (data.combat.running) {
    currentEnemy = null;
    const e = getEnemy(data.combat.enemyKey); enemyHP = e.hp; el('#combatInfo').textContent = 'Fighting ' + e.key;
  } else {
    currentEnemy = null;
    el('#combatInfo').textContent = 'Idle';
  }
}

export function combatTick(dt) {
  if (!data.combat.running) return;
  const p = data.combat.player; const e = getEnemy(data.combat.enemyKey);
  const pRate = 1000 / (p.spd * 1.0);
  const eRate = 1000 / (e.spd * 1.0);
  lastAtkP += dt; lastAtkE += dt;

  if (lastAtkP >= pRate) { lastAtkP -= pRate; const dmg = Math.max(1, p.atk - e.def + randInt(0, 2)); enemyHP -= dmg; }
  if (lastAtkE >= eRate) { lastAtkE -= eRate; const dmg = Math.max(1, e.atk - p.def + randInt(0, 2)); p.hp = clamp(p.hp - dmg, 0, p.hpMax); }

  if (enemyHP <= 0) {
    if (e.gold) data.gold += randInt(...e.gold);
    for (const [k, [a, b]] of Object.entries(e.drops || {})) addInventory(k, randInt(a, b));
    addSkillXP('Combat', 12);
    updateQuestProgress('kill', {enemy: e.key});
    currentEnemy = null;
    const e2 = getEnemy(data.combat.enemyKey); enemyHP = e2.hp;
    stats.slimeKills += e.key === 'Slime' ? 1 : 0; stats.fightsWon++;
  }
  if (p.hp <= 0) { p.hp = p.hpMax; data.combat.running = false; el('#combatInfo').textContent = 'Defeated!'; }
}

export function drawArena() {
  const p = data.combat.player; const e = getEnemy(data.combat.enemyKey);
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.globalAlpha = 0.15; ctx.fillStyle = '#6b7280';
  for (let x = 0; x < cvs.width; x += 16) ctx.fillRect(x, 0, 1, cvs.height);
  for (let y = 0; y < cvs.height; y += 16) ctx.fillRect(0, y, cvs.width, 1);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#22c55e'; ctx.fillRect(80, 200, 40, 40);
  ctx.fillStyle = '#ef4444'; ctx.fillRect(360, 200, 40, 40);
  bar(60, 40, p.hp / p.hpMax, '#22c55e', 'Player');
  bar(280, 40, enemyHP / Math.max(1, e.hp), '#ef4444', e.key);

  function bar(x, y, ratio, color, label) {
    ctx.strokeStyle = '#334155'; ctx.strokeRect(x, y, 140, 12); ctx.fillStyle = color; ctx.fillRect(x + 1, y + 1, Math.floor((140 - 2) * clamp(ratio, 0, 1)), 10); ctx.fillStyle = '#94a3b8'; ctx.font = '12px system-ui'; ctx.fillText(label, x, y - 4);
  }
}
