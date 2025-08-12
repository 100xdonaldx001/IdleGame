import {el} from './utils.js';
let suppress = false;
export function showToast(msg) {
  if (suppress) return;
  const t = el('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1500);
}
export function setToastSuppressed(v) { suppress = v; }
