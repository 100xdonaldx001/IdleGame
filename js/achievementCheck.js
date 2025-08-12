import achievements from './achievements.js';
import {data} from './data.js';
import {showToast} from './toast.js';

export function checkAchievements() {
  achievements.forEach(a => {
    if (!data.ach[a.key] && a.cond(data)) {
      data.ach[a.key] = true; data.gold += a.reward; showToast(`Achievement: ${a.name} (+${a.reward}g)`);
    }
  });
}
