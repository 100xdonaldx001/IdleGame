import {data} from './data.js';
import {stats} from './stats.js';
import {SAVE_KEY} from './constants.js';
import {showToast} from './toast.js';
import {el} from './utils.js';
import {addInventory} from './helpers.js';
import {applyUpgradeEffects} from './helpers.js';
import {renderAll} from './render.js';

export function save() {
  data.meta.last = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify({data, stats}));
  showToast('Saved.');
  el('#saveInfo').textContent = 'Saved at ' + new Date(data.meta.last).toLocaleTimeString();
}

export function load() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    data.gold = 25; addInventory('twig', 3); addInventory('iron', 2);
  } else {
    try {
      const obj = JSON.parse(raw);
      Object.assign(data, obj.data || {});
      Object.assign(stats, obj.stats || {});
      applyUpgradeEffects();
    } catch (e) { console.warn('Load failed', e); }
  }
  el('#optAutosave').checked = !!data.meta.autosave;
  el('#optDebug').checked = !!data.meta.debug;
  el('#tickInfo').hidden = !data.meta.debug;
  el('#optOfflineHours').value = data.meta.offlineCapHrs;
}

export function exportSave() {
  const b64 = btoa(unescape(encodeURIComponent(JSON.stringify({data, stats}))));
  navigator.clipboard.writeText(b64);
  showToast('Save copied to clipboard.');
}

export async function importSave() {
  const b64 = prompt('Paste your exported save code:');
  if (!b64) return;
  try {
    const obj = JSON.parse(decodeURIComponent(escape(atob(b64))));
    Object.assign(data, obj.data || {});
    Object.assign(stats, obj.stats || {});
    applyUpgradeEffects();
    save();
    renderAll();
    showToast('Imported.');
  } catch (e) { alert('Invalid code'); }
}

export function hardReset() {
  if (confirm('This will erase ALL progress. Continue?')) {
    localStorage.removeItem(SAVE_KEY); location.reload();
  }
}
