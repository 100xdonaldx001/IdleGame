export const el = sel => document.querySelector(sel);
export const fmt = n => Math.floor(n).toLocaleString();
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

export function levelFromXP(xp) {
  let lvl = 1, need = 20;
  while (xp >= need) { xp -= need; lvl++; need = Math.floor(need * 1.25 + 10); if (lvl >= 99) break; }
  return lvl;
}
