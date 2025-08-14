import achievements from './achievements.js';
import {data} from './data.js';
import {showToast} from './toast.js';

export function checkAchievements() {
  achievements.forEach(a => {
    if (!data.ach[a.key] && a.cond(data)) {
      data.ach[a.key] = true;
      const rewardMsg = applyReward(a.reward);
      showToast(`Achievement: ${a.name}${rewardMsg ? ' (' + rewardMsg + ')' : ''}`);
    }
  });
}

function applyReward(reward) {
  const parts = [];
  if (typeof reward === 'number') {
    data.gold += reward;
    parts.push(`+${reward}g`);
  } else if (reward && typeof reward === 'object') {
    if (reward.gold) {
      data.gold += reward.gold;
      parts.push(`+${reward.gold}g`);
    }
    if (reward.xp) {
      data.xp += reward.xp;
      parts.push(`+${reward.xp}xp`);
    }
  }
  return parts.join(', ');
}
