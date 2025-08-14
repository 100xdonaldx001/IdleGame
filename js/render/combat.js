import {data} from '../data.js';
import {getEnemy} from '../combat.js';
import enemies from '../enemies.js';
import {el, fmt} from '../utils.js';

export function renderCombatUI() {
  const s = el('#combatStats'); s.innerHTML = '';
  const p = data.combat.player; const e = getEnemy(data.combat.enemyKey);
  const rows = [["Player HP", `${fmt(p.hp)}/${fmt(p.hpMax)}`], ["ATK", p.atk], ["DEF", p.def], ["SPD", p.spd.toFixed(2)], ["Area", data.combat.area], ["Enemy", e ? e.key : '—']];
  rows.forEach(([k, v]) => { const d = document.createElement('div'); d.className = 'item'; d.innerHTML = `<span>${k}</span><b>${v}</b>`; s.appendChild(d); });

  const l = el('#enemyList'); l.innerHTML = '';
  const groups = enemies[data.combat.area].reduce((a, x) => {
    (a[x.cat] ||= []).push(x);
    return a;
  }, {});
  Object.keys(groups).forEach(cat => {
    const head = document.createElement('div'); head.className = 'phead'; head.innerHTML = `<b>${cat}</b>`; l.appendChild(head);
    groups[cat].forEach(x => {
      const d = document.createElement('div'); d.className = 'item'; d.innerHTML = `<div><b>${x.key}</b><div class="hint">${x.hp} HP · ${x.atk}/${x.def}/${x.spd}</div></div><button class="btn">Target</button>`;
      d.querySelector('button').addEventListener('click', () => { data.combat.enemyKey = x.key; el('#combatInfo').textContent = 'Target:' + x.key; });
      l.appendChild(d);
    });
  });
}

