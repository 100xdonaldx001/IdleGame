import achievements from '../achievements.js';
import {data} from '../data.js';
import {el} from '../utils.js';

export function renderAchievements() {
  const g = el('#achGrid'); g.innerHTML = '';
  achievements.forEach(a => {
    const owned = !!data.ach[a.key];
    const card = document.createElement('div'); card.className = 'panel';
    const reward = formatReward(a.reward);
    card.innerHTML = `<div class="phead"><b>${a.name}</b><small class="muted">Reward ${reward}</small></div>` +
      `<div class="row"><span class="chip">${owned ? 'Claimed' : 'Locked/Auto'}</span></div>`;
    g.appendChild(card);
  });
}

function formatReward(reward) {
  if (typeof reward === 'number') return `${reward}g`;
  if (reward && typeof reward === 'object') {
    const parts = [];
    if (reward.gold) parts.push(`${reward.gold}g`);
    if (reward.xp) parts.push(`${reward.xp}xp`);
    return parts.join(', ');
  }
  return '';
}

