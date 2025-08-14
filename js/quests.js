import {data} from './data.js';
import {showToast} from './toast.js';

// Quest definitions. Each quest has a key, name, goal and reward.
// goal.type can be 'skill' (reach a level) or 'kill' (defeat enemies).
export const quests = [
  {
    key: 'wood5',
    name: 'Novice Woodcutter',
    goal: {type: 'skill', skill: 'Woodcutting', level: 5},
    reward: {gold: 50},
    goto: 'overview'
  },
  {
    key: 'slay10',
    name: 'First Blood',
    goal: {type: 'kill', count: 10},
    reward: {gold: 100},
    goto: 'combat'
  }
];

// Ensure quest progress objects exist on data load
export function initQuests() {
  if (!data.quests) data.quests = {};
  quests.forEach(q => {
    if (!data.quests[q.key]) data.quests[q.key] = {progress: 0, claimed: false};
    // initialise skill quest progress from current levels
    const qd = data.quests[q.key];
    if (q.goal.type === 'skill') {
      qd.progress = data.skills[q.goal.skill]?.lvl || 0;
    }
  });
}

export function isQuestComplete(q, qd = data.quests[q.key]) {
  if (q.goal.type === 'skill') return qd.progress >= q.goal.level;
  if (q.goal.type === 'kill') return qd.progress >= q.goal.count;
  return false;
}

export function updateQuestProgress(type, info) {
  quests.forEach(q => {
    const qd = data.quests[q.key];
    if (qd.claimed) return;
    if (q.goal.type === 'skill' && type === 'skill' && q.goal.skill === info.skill) {
      qd.progress = Math.max(qd.progress, info.lvl);
    }
    if (q.goal.type === 'kill' && type === 'kill') {
      qd.progress += 1;
    }
  });
}

export function claimQuestReward(key) {
  const q = quests.find(q => q.key === key);
  const qd = q && data.quests[key];
  if (!q || !qd || qd.claimed || !isQuestComplete(q, qd)) return false;
  if (q.reward.gold) data.gold += q.reward.gold;
  qd.claimed = true;
  showToast(`Quest Complete: ${q.name}`);
  return true;
}

