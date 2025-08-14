import {el} from '../utils.js';

export let prevTab = 'overview';

export function tabButton(id, label) {
  const b = document.createElement('button');
  b.className = 'tab';
  b.role = 'tab';
  b.textContent = label;
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
  const t = el('#tabs');
  t.innerHTML = '';
  const list = [
    ['overview', 'Overview'],
    ['inventory', 'Inventory'],
    ['market', 'Market'],
    ['equipment', 'Equipment'],
    ['upgrades', 'Upgrades'],
    ['combat', 'Combat'],
    ['achievements', 'Achievements'],
    ['settings', 'Settings']
  ];
  list.forEach(([id, label], i) => {
    const b = tabButton(id, label);
    if (i === 0) b.setAttribute('aria-selected', 'true');
    t.appendChild(b);
  });
  activateTab('overview');
}

