import {quests, isQuestComplete} from '../quests.js';
import {data} from '../data.js';
import {el} from '../utils.js';

export function renderQuests() {
  const list = el('#questList');
  if (!list) return;
  list.innerHTML = '';
  quests.forEach(q => {
    const qd = data.quests[q.key];
    const row = document.createElement('div');
    row.className = 'item';
    let act = '';
    if (qd.claimed) {
      act = '<span class="chip">Claimed</span>';
    } else if (isQuestComplete(q, qd)) {
      act = `<button class="btn" data-claim="${q.key}">Claim</button>`;
    } else {
      const prog = q.goal.type === 'skill'
        ? `${Math.min(qd.progress, q.goal.level)}/${q.goal.level}`
        : `${Math.min(qd.progress, q.goal.count)}/${q.goal.count}`;
      act = `<span class="chip">${prog}</span>`;
      if (q.goto) act += ` <button class="btn" data-goto="${q.goto}">Go</button>`;
    }
    row.innerHTML = `<span>${q.name}</span><span>${act}</span>`;
    list.appendChild(row);
  });
}

