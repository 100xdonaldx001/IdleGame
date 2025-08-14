import {data, skills, nodes} from '../data.js';
import {el, fmt, xpForLevel, levelFromXP} from '../utils.js';
import {activateTab, prevTab} from './tabs.js';

const formatTime = t => Array.isArray(t) ? `${t[0] / 1000}-${t[1] / 1000}s` : `${t / 1000}s`;

export function renderSkills() {
  const s = el('#skillList');
  s.innerHTML = '';
  for (const name of skills) {
    const sk = data.skills[name];
    const row = document.createElement('div');
    row.className = 'item';
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
      btn.addEventListener('click', () => {
        if (el('#tab-farming').hidden) {
          activateTab('farming');
        } else {
          const btnPrev = document.querySelector(`.tab[data-tab="${prevTab}"]`);
          activateTab(prevTab, btnPrev);
        }
      });
    } else {
      btn.addEventListener('click', () => {
        data.activeSkill = name;
        renderSkills();
        renderTaskPanel();
        if (!el('#tab-farming').hidden) {
          const btnPrev = document.querySelector(`.tab[data-tab="${prevTab}"]`);
          activateTab(prevTab, btnPrev);
        }
      });
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
  const p = el('#taskPanel');
  p.innerHTML = '';
  const skillName = data.activeSkill;
  const sk = data.skills[skillName];
  const list = nodes[skillName].slice().sort((a, b) => a.req - b.req);
  if (skillName === 'Smithing') {
    p.className = 'grid';
    list.forEach(node => {
      const card = document.createElement('div');
      card.className = 'panel';
      const locked = sk.lvl < node.req;
      const timeText = formatTime(node.time);
      const costText = node.consume ? Object.entries(node.consume).map(([k, v]) => `${v} ${k}`).join(', ') : '—';
      const yieldText = Object.entries(node.yield || {}).map(([k, [a, b]]) => `${a}-${b} ${k}`).join(', ');
      card.innerHTML = `<div class="phead"><b>${node.name}</b><small class="muted">Lv ${node.req} · ${timeText}</small></div>
        <div class="list">
          <div class="item"><span>Costs</span><span>${costText}</span></div>
          <div class="item"><span>Yields</span><span>${yieldText}</span></div>
        </div>`;
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = sk.task === node.key ? 'Stop' : 'Train';
      if (locked) b.disabled = true;
      if (sk.task === node.key) b.classList.add('good');
      b.addEventListener('click', () => {
        const cur = data.skills[skillName].task;
        data.skills[skillName].task = cur === node.key ? null : node.key;
        data.skills[skillName]._prog = 0;
        data.skills[skillName]._need = null;
        if (!data.skills[skillName].task) el('#taskETA').textContent = '—';
        renderTaskPanel();
      });
      const footer = document.createElement('div');
      footer.className = 'footer';
      footer.appendChild(b);
      const xp = document.createElement('small');
      xp.className = 'muted';
      xp.textContent = `+${node.xp} XP`;
      footer.appendChild(xp);
      card.appendChild(footer);
      p.appendChild(card);
    });
  } else {
    p.className = 'grid';
    list.forEach(node => {
      const card = document.createElement('div');
      card.className = 'panel';
      const locked = sk.lvl < node.req;
      const timeText = formatTime(node.time);
      const costText = node.consume ? Object.entries(node.consume).map(([k, v]) => `${v} ${k}`).join(', ') : '—';
      const yieldText = Object.entries(node.yield || {}).map(([k, [a, b]]) => `${a}-${b} ${k}`).join(', ');
      card.innerHTML = `<div class="phead"><b>${node.name}</b><small class="muted">Lv ${node.req} · ${timeText}</small></div>
          <div class="list">
            <div class="item"><span>Costs</span><span>${costText}</span></div>
            <div class="item"><span>Yields</span><span>${yieldText}</span></div>
          </div>`;
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = sk.task === node.key ? 'Stop' : 'Train';
      if (locked) b.disabled = true;
      if (sk.task === node.key) b.classList.add('good');
      b.addEventListener('click', () => {
        const cur = data.skills[skillName].task;
        data.skills[skillName].task = cur === node.key ? null : node.key;
        data.skills[skillName]._prog = 0;
        data.skills[skillName]._need = null;
        if (!data.skills[skillName].task) el('#taskETA').textContent = '—';
        renderTaskPanel();
      });
      const footer = document.createElement('div');
      footer.className = 'footer';
      footer.appendChild(b);
      const xp = document.createElement('small');
      xp.className = 'muted';
      xp.textContent = `+${node.xp} XP`;
      footer.appendChild(xp);
      card.appendChild(footer);
      p.appendChild(card);
    });
  }
}

