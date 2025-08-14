import {data, nodes} from './data.js';
import {mul, addInventory} from './helpers.js';
import {addSkillXP} from './progress.js';
import {randInt} from './utils.js';
import {TICK_MS} from './constants.js';

export function applyOfflineProgress() {
  const now = Date.now();
  const diffMs = now - (data.meta.last || now);
  const capMs = (data.meta.offlineCapHrs || 8) * 3600 * 1000;
  const applyMs = Math.min(diffMs, capMs);
  if (applyMs <= 0) return 0;
  const skillKeys = (data.meta.offlineSkills && data.meta.offlineSkills.length ? data.meta.offlineSkills : Object.keys(nodes));
  for (const s of skillKeys) {
    const frac = mul.offlineFrac(s); if (!frac) continue;
    const nodeArr = nodes[s];
    if (!nodeArr || !nodeArr.length) continue;
    const node = nodeArr[0];
    const effectiveSpeed = node.time / (mul.globalSpeed() * mul.skillSpeed(s));
    const cycles = Math.floor((applyMs * frac) / effectiveSpeed);
    if (cycles > 0) {
      const range = node.yield;
      for (const k in range) { const [a, b] = range[k]; addInventory(k, cycles * randInt(a, b)); }
      const xpGain = cycles * node.xp * mul.globalXP();
      addSkillXP(s, xpGain);
    }
  }
  data.gold += Math.floor(Math.floor(applyMs / TICK_MS) / 40);
  return applyMs;
}
