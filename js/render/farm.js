import {data, nodes} from '../data.js';
import {el} from '../utils.js';

export function renderFarm() {
  const g = el('#farmGrid');
  if (!g) return;
  g.innerHTML = '';
  const farm = data.skills.Farming;
  farm.plots.forEach((plot, i) => {
    const card = document.createElement('div');
    card.className = 'panel';
    const node = nodes.Farming.find(n => n.key === plot.task);
    const head = document.createElement('div');
    head.className = 'phead';
    head.innerHTML = `<b>Field ${i + 1}</b><small class="muted">${node ? node.name : 'Empty'}</small>`;
    card.appendChild(head);
    const list = document.createElement('div');
    list.className = 'list';
    const row = document.createElement('div');
    row.className = 'item';
    const sel = document.createElement('select');
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'Empty';
    sel.appendChild(opt);
    nodes.Farming.forEach(n => {
      const o = document.createElement('option');
      o.value = n.key;
      o.textContent = n.name;
      if (plot.task === n.key) o.selected = true;
      if (farm.lvl < n.req) o.disabled = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', e => { plot.task = e.target.value || null; plot._prog = 0; plot._need = null; renderFarm(); });
    row.appendChild(sel);
    if (node) {
      const need = plot._need || (Array.isArray(node.time) ? node.time[1] : node.time);
      const eta = Math.ceil((need - (plot._prog || 0)) / 1000);
      const span = document.createElement('span');
      span.textContent = `${eta}s`;
      row.appendChild(span);
    }
    list.appendChild(row);
    card.appendChild(list);
    g.appendChild(card);
  });
}

