export const el = sel => document.querySelector(sel);
export const fmt = n => Math.floor(n).toLocaleString();
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

export function levelFromXP(xp) {
  let lvl = 1, need = 100;
  while (xp >= need) {
    xp -= need;
    lvl++;
    need = Math.ceil(need * 1.104);
  }
  return lvl;
}

export function xpForLevel(lvl) {
  let xp = 0, need = 100;
  for (let i = 1; i < lvl; i++) {
    xp += need;
    need = Math.ceil(need * 1.104);
  }
  return xp;
}
