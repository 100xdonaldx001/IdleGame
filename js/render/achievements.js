import {registerRenderer} from '../renderer.js';
import {data} from '../data.js';
import achievements from '../achievements.js';
import {el, fmt} from '../utils.js';

export function renderAchievements() {
  const g = el('#achGrid');
  g.innerHTML = '';
  achievements.forEach(a => {
    const owned = !!data.ach[a.key];
    const card = document.createElement('div');
    card.className = 'panel';
    card.innerHTML = `<div class="phead"><b>${a.name}</b><small class="muted">Reward ${a.reward}g</small></div>
    <div class="row"><span class="chip">${owned ? 'Claimed' : 'Locked/Auto'}</span></div>`;
    g.appendChild(card);
  });
}

registerRenderer(renderAchievements);
