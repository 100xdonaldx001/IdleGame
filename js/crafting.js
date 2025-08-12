import {data} from './data.js';
import {mul} from './helpers.js';
import {addInventory} from './helpers.js';
import {addSkillXP} from './progress.js';
import {randInt} from './utils.js';
import {showToast} from './toast.js';

export function queueCraft(n) {
  if (n.consume && !Object.entries(n.consume).every(([k, v]) => (data.inventory[k] || 0) >= v)) return;
  if (n.consume) for (const [k, v] of Object.entries(n.consume)) data.inventory[k] -= v;
  data.craftingQueue.push({key: n.key, timeLeft: Math.floor(n.time / (mul.globalSpeed() * 1)), origin: n});
  showToast('Queued ' + n.name);
}

export function craftingTick(dt) {
  if (data.craftingQueue.length === 0) return;
  const item = data.craftingQueue[0];
  item.timeLeft -= dt;
  if (item.timeLeft <= 0) {
    const origin = item.origin;
    for (const [k, [a, b]] of Object.entries(origin.yield)) {
      if (k === 'gold') data.gold += randInt(a, b); else addInventory(k, randInt(a, b));
    }
    addSkillXP(origin.key === 'bar' || origin.key === 'plate' ? 'Smithing' : 'Cooking', origin.xp);
    data.craftingQueue.shift();
    showToast(`${origin.name} crafted`);
  }
}
