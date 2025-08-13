import {data, skills, nodes, itemMap} from './data.js';
import upgrades from './upgrades/index.js';
import {stats} from './stats.js';
import {VERSION} from './constants.js';
import achievements from './achievements.js';
import enemies from './enemies.js';
import {mul, canAfford, applyUpgradeEffects} from './helpers.js';
import {queueCraft} from './crafting.js';
import {getEnemy} from './combat.js';
import {el, fmt, xpForLevel, levelFromXP} from './utils.js';

const formatTime = t => Array.isArray(t) ? `${t[0] / 1000}-${t[1] / 1000}s` : `${t / 1000}s`;

export function tabButton(id, label) {
  const b = document.createElement('button'); b.className = 'tab'; b.role = 'tab'; b.textContent = label; b.dataset.tab = id; b.addEventListener('click', () => activateTab(id, b)); return b;
}

export function activateTab(id, btn) {
  document.querySelectorAll('[role="tabpanel"]').forEach(p => p.hidden = true);
  el('#tab-' + id).hidden = false;
  document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', 'false'));
  if (btn) btn.setAttribute('aria-selected', 'true');
}

export function renderTabs() {
  const t = el('#tabs'); t.innerHTML = '';
  const list = [['overview', 'Overview'], ['inventory', 'Inventory'], ['crafting', 'Crafting'], ['upgrades', 'Upgrades'], ['farming', 'Farming'], ['combat', 'Combat'], ['achievements', 'Achievements'], ['settings', 'Settings']];
  list.forEach(([id, label], i) => { const b = tabButton(id, label); if (i === 0) b.setAttribute('aria-selected', 'true'); t.appendChild(b); });
  activateTab('overview');
}

export function renderStats() {
  const s = el('#statList'); s.innerHTML = '';
  const pairs = [['Gold', fmt(data.gold)], ['XP', fmt(data.xp)]];
  if (data.meta.debug) pairs.push(['Ticks', fmt(stats.totalTicks)]);
  pairs.forEach(([k, v]) => { const d = document.createElement('div'); d.className = 'stat'; d.innerHTML = `<span>${k}</span><b>${v}</b>`; s.appendChild(d); });
}

export function renderSkills() {
  const s = el('#skillList'); s.innerHTML = '';
  for (const name of skills) {
    const sk = data.skills[name];
    const row = document.createElement('div'); row.className = 'item';
    const active = data.activeSkill === name;
    const actual = levelFromXP(sk.xp);
    const cur = xpForLevel(actual);
    const next = xpForLevel(actual + 1);
    const pct = sk.lvl >= 99 && !data.meta.virtualLevels ? 100 : ((sk.xp - cur) / (next - cur)) * 100;
    const lvlText = data.meta.virtualLevels ? actual : sk.lvl;
    const isFarm = name === 'Farming';
    const btnText = isFarm ? 'Manage' : active ? 'Training' : 'Train';
    row.innerHTML = `<div><b>${name}</b><div class="bar"><span style="width:${pct}%"></span></div><small class="muted">Lv ${lvlText} · ${fmt(sk.xp)} XP</small></div><div class="row"><button class="btn ${active && !isFarm ? 'good' : ''}">${btnText}</button></div>`;
    const btn = row.querySelector('button');
    if (isFarm) {
      btn.addEventListener('click', () => { activateTab('farming'); });
    } else {
      btn.addEventListener('click', () => { data.activeSkill = name; renderSkills(); renderTaskPanel(); });
    }
    s.appendChild(row);
  }
}

export function nodeButton(skill, node) {
  const b = document.createElement('button');
  b.className = 'btn';
  b.textContent = node.name;
  const timeText = formatTime(node.time);
  b.title = `${timeText} · +${Object.entries(node.yield || {}).map(([k, [a, b]]) => `${a}-${b} ${k}`).join(', ')}${node.consume ? ' · Cost: ' + Object.entries(node.consume).map(([k, v]) => `${v} ${k}`).join(', ') : ''} · +${node.xp} XP`;
  b.addEventListener('click', () => {
    const cur = data.skills[skill].task;
    data.skills[skill].task = cur === node.key ? null : node.key;
    data.skills[skill]._prog = 0;
    data.skills[skill]._need = null;
    if (!data.skills[skill].task) el('#taskETA').textContent = '—';
    renderTaskPanel();
  });
  return b;
}

export function renderTaskPanel() {
  const p = el('#taskPanel'); p.innerHTML = '';
  const sk = data.skills[data.activeSkill];
  const list = nodes[data.activeSkill];
  list.forEach(node => {
    const row = document.createElement('div'); row.className = 'item';
    const locked = sk.lvl < node.req;
    const timeText = formatTime(node.time);
    row.innerHTML = `<div><b>${node.name}</b><div class="hint">Req Lv.${node.req} · ${timeText}</div></div>`;
    const b = nodeButton(data.activeSkill, node); if (locked) b.disabled = true; if (sk.task === node.key) b.classList.add('good');
    row.appendChild(b); p.appendChild(row);
  });
}

export function renderOverview() {
  const g = el('#overviewGrid'); g.innerHTML = '';
  const cards = [
    ['Gold', `Earned from many actions.`, `<div class="kv"><b>${fmt(data.gold)}</b><small class="muted">coins</small></div>`],
    ['Inventory', `Your current stock.`, Object.entries(data.inventory)
      .filter(([_, v]) => v > 0)
      .map(([k, v]) => `<span class="chip">${k}: ${fmt(v)}</span>`).join(' ')],
    ['Training', `Current skill & task.`, `<div>${data.activeSkill} → <b>${(data.skills[data.activeSkill].task || 'Choose a node')}</b></div>`],
    ['Global Multipliers', `From upgrades.`, `<div class="list">
      <div class="item"><span>Gain</span><b>x${mul.globalGain().toFixed(2)}</b></div>
      <div class="item"><span>XP</span><b>x${mul.globalXP().toFixed(2)}</b></div>
      <div class="item"><span>Speed</span><b>x${mul.globalSpeed().toFixed(2)}</b></div>
    </div>`],
  ];
  for (const [title, sub, body] of cards) { const card = document.createElement('div'); card.className = 'panel'; card.innerHTML = `<div class="phead"><b>${title}</b><small class="muted">${sub}</small></div>${body}`; g.appendChild(card); }
}

export function renderInventory() {
  const g = el('#invGrid'); g.innerHTML = '';
  for (const [k, v] of Object.entries(data.inventory)) {
    if (v <= 0) continue;
    const card = document.createElement('div'); card.className = 'panel';
    const name = itemMap[k] || k;
    card.innerHTML = `<div class="phead"><b>${name}</b><small class="muted">Resource</small></div><div class="kv"><b>${fmt(v)}</b></div>`;
    g.appendChild(card);
  }
}

export function renderFarm() {
  const g = el('#farmGrid');
  if (!g) return;
  g.innerHTML = '';
  const farm = data.skills.Farming;
  farm.plots.forEach((plot, i) => {
    const card = document.createElement('div'); card.className = 'panel';
    const node = nodes.Farming.find(n => n.key === plot.task);
    const head = document.createElement('div'); head.className = 'phead'; head.innerHTML = `<b>Field ${i + 1}</b><small class="muted">${node ? node.name : 'Empty'}</small>`; card.appendChild(head);
    const list = document.createElement('div'); list.className = 'list';
    const row = document.createElement('div'); row.className = 'item';
    const sel = document.createElement('select');
    const opt = document.createElement('option'); opt.value = ''; opt.textContent = 'Empty'; sel.appendChild(opt);
    nodes.Farming.forEach(n => {
      const o = document.createElement('option'); o.value = n.key; o.textContent = n.name;
      if (plot.task === n.key) o.selected = true;
      if (farm.lvl < n.req) o.disabled = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', e => { plot.task = e.target.value || null; plot._prog = 0; plot._need = null; renderFarm(); });
    row.appendChild(sel);
    if (node) {
      const need = plot._need || (Array.isArray(node.time) ? node.time[1] : node.time);
      const eta = Math.ceil((need - (plot._prog || 0)) / 1000);
      const span = document.createElement('span'); span.textContent = `${eta}s`; row.appendChild(span);
    }
    list.appendChild(row); card.appendChild(list); g.appendChild(card);
  });
}

export function renderCrafting() {
  const g = el('#craftGrid'); g.innerHTML = '';
  const q = (el('#craftSearch')?.value || '').trim().toLowerCase();
  const list = [...nodes.Smithing, ...nodes.Cooking].filter(n => {
    if (!q) return true;
    const names = [
      ...Object.keys(n.consume || {}),
      ...Object.keys(n.yield),
      n.name
    ].map(k => (itemMap[k] || k).toLowerCase());
    return names.some(x => x.includes(q));
  });
  list.forEach(n => {
    const card = document.createElement('div'); card.className = 'panel';
    const canAff = n.consume ? Object.entries(n.consume).every(([k, v]) => (data.inventory[k] || 0) >= v) : true;
    const btn = `<button class="btn" ${!canAff ? 'disabled' : ''}>Craft</button>`;
    card.innerHTML = `<div class="phead"><b>${n.name}</b><small class="muted">${formatTime(n.time)}</small></div>
    <div class="list">
      <div class="item"><span>Costs</span><span>${n.consume ? Object.entries(n.consume).map(([k, v]) => `${v} ${k}`).join(', ') : '—'}</span></div>
      <div class="item"><span>Yields</span><span>${Object.entries(n.yield).map(([k, [a, b]]) => `${a}-${b} ${k}`).join(', ')}</span></div>
    </div>
    <div class="footer">${btn}<small class="muted">+${n.xp} XP</small></div>`;
    const b = card.querySelector('button'); b.addEventListener('click', () => queueCraft(n));
    g.appendChild(card);
  });
}

export function renderUpgrades() {
  const sel = el('#upgFilter');
  if (sel && !sel.dataset.init) {
    sel.innerHTML = '<option value="all">All</option>';
    const types = Array.from(new Set(upgrades.map(u => u.type)));
    types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      sel.appendChild(opt);
    });
    sel.addEventListener('change', renderUpgrades);
    sel.dataset.init = '1';
  }
  const filter = sel ? sel.value : 'all';
  const g = el('#upgGrid'); g.innerHTML = '';
  upgrades.filter(u => filter === 'all' || u.type === filter).forEach(u => {
    const lvl = data.upgrades[u.key] || 0; const maxed = lvl >= u.max;
    const cost = Math.floor(u.cost * Math.pow(1.75, lvl));
    const can = canAfford(cost) && !maxed;
    const card = document.createElement('div'); card.className = 'panel';
    card.innerHTML = `<div class="phead"><b>${u.name}</b><small class="muted">${u.type}</small></div>
    <p class="hint">${u.desc}</p>
    <div class="row"><span class="chip">Lv ${lvl}/${u.max}</span><span class="chip">Cost ${fmt(cost)}</span></div>
    <div class="footer"><button class="btn ${can ? 'good' : ''}" ${!can ? 'disabled' : ''}>Buy</button></div>`;
    card.querySelector('button').addEventListener('click', () => {
      if (data.gold < cost || maxed) return; data.gold -= cost; data.upgrades[u.key] = (data.upgrades[u.key] || 0) + 1; applyUpgradeEffects(); renderAll();
    });
    g.appendChild(card);
  });
}

export function renderAchievements() {
  const g = el('#achGrid'); g.innerHTML = '';
  achievements.forEach(a => {
    const owned = !!data.ach[a.key];
    const card = document.createElement('div'); card.className = 'panel';
    card.innerHTML = `<div class="phead"><b>${a.name}</b><small class="muted">Reward ${a.reward}g</small></div>
    <div class="row"><span class="chip">${owned ? 'Claimed' : 'Locked/Auto'}</span></div>`;
    g.appendChild(card);
  });
}

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

export function renderSettingsFooter() {
  el('#version').textContent = 'v' + VERSION;
  el('#saveInfo').textContent = 'Loaded';
}

export function renderAll() {
  renderStats(); renderSkills(); renderTaskPanel(); renderOverview(); renderInventory(); renderFarm(); renderCrafting(); renderUpgrades(); renderAchievements(); renderCombatUI();
}
