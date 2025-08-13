import {registerRenderer} from '../renderer.js';
import {data} from '../data.js';
import {stats} from '../stats.js';
import {el, fmt} from '../utils.js';

export function renderStats() {
  const s = el('#statList');
  s.innerHTML = '';
  const pairs = [
    ['Gold', fmt(data.gold)],
    ['XP', fmt(data.xp)]
  ];
  if (data.meta.debug) pairs.push(['Ticks', fmt(stats.totalTicks)]);
  pairs.forEach(([k, v]) => {
    const d = document.createElement('div');
    d.className = 'stat';
    d.innerHTML = `<span>${k}</span><b>${v}</b>`;
    s.appendChild(d);
  });
}

registerRenderer(renderStats);
