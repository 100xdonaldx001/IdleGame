import {el} from '../utils.js';
import {t} from '../i18n.js';

export let prevTab = 'overview';

export function tabButton(id, labelKey) {
  const b = document.createElement('button');
  b.className = 'tab';
  b.role = 'tab';
  b.textContent = t(labelKey);
  b.dataset.tab = id;
  b.addEventListener('click', () => activateTab(id, b));
  return b;
}

export function activateTab(id, btn) {
  document.querySelectorAll('[role="tabpanel"]').forEach(p => p.hidden = true);
  el('#tab-' + id).hidden = false;
  document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', 'false'));
  if (btn) btn.setAttribute('aria-selected', 'true');
  if (id !== 'farming') prevTab = id;
}

export function renderTabs() {
  const tEl = el('#tabs');
  tEl.innerHTML = '';
  const list = [
    ['overview', 'overview_title'],
    ['inventory', 'inventory_title'],
    ['market', 'market_title'],
    ['equipment', 'equipment_title'],
    ['upgrades', 'upgrades_title'],
    ['combat', 'combat_title'],
    ['achievements', 'achievements_title'],
    ['settings', 'settings_title']
  ];
  list.forEach(([id, key], i) => {
    const b = tabButton(id, key);
    if (i === 0) b.setAttribute('aria-selected', 'true');
    tEl.appendChild(b);
  });
  activateTab('overview');
}

