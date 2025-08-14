import {data, skills, inventory as baseInventory, marketInventory as baseMarket} from './data.js';
import {stats} from './stats.js';
import {SAVE_KEY} from './constants.js';
import {showToast} from './toast.js';
import {t} from './i18n.js';
import {el} from './utils.js';
import {addInventory} from './helpers.js';
import {applyUpgradeEffects} from './helpers.js';
import {renderAll, renderSettingsFooter} from './render.js';

function convertLegacyLogs() {
  const inv = data.inventory || {};
  if (inv.oak) {
    inv.pine = (inv.pine || 0) + inv.oak;
    delete inv.oak;
  }
  if (inv.yew) {
    inv.birch = (inv.birch || 0) + inv.yew;
    delete inv.yew;
  }
  const wc = data.skills && data.skills.Woodcutting;
  if (wc) {
    if (wc.task === 'oak') wc.task = 'pine';
    if (wc.task === 'yew') wc.task = 'birch';
  }
}

export function save() {
  data.meta.last = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify({data, stats}));
  showToast(t('toast_saved'));
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
      convertLegacyLogs();
      data.inventory = Object.assign({}, baseInventory, data.inventory);
      data.market = Object.assign(JSON.parse(JSON.stringify(baseMarket)), data.market);
      if (!Array.isArray(data.marketQueue)) data.marketQueue = [];
      if (!Array.isArray(data.equipment)) data.equipment = [];
      if (!data.equipped) data.equipped = {};
      data.equipment.forEach(it => {
        if (!it.ench) it.ench = {};
        if (!it.rarity) it.rarity = 'common';
      });
      applyUpgradeEffects();
      if (data.meta.virtualLevels == null) data.meta.virtualLevels = false;
    } catch (e) { console.warn('Load failed', e); }
  }
  skills.forEach(s => {
    if (!data.skills[s]) data.skills[s] = { lvl: 1, xp: 0, task: null };
  });
  const farm = data.skills.Farming;
  if (farm) {
    farm.fields = farm.fields || 4;
    farm.plots = farm.plots || Array.from({length: farm.fields}, () => ({task: null, _prog: 0, _need: null}));
  }
  if (!Array.isArray(data.meta.offlineSkills)) data.meta.offlineSkills = ['Woodcutting', 'Mining', 'Fishing'];
  el('#optAutosave').checked = !!data.meta.autosave;
  el('#optDebug').checked = !!data.meta.debug;
  el('#tickInfo').hidden = !data.meta.debug;
  el('#optVirtualLevels').checked = !!data.meta.virtualLevels;
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
    convertLegacyLogs();
    data.inventory = Object.assign({}, baseInventory, data.inventory);
    data.market = Object.assign(JSON.parse(JSON.stringify(baseMarket)), data.market);
    if (!Array.isArray(data.marketQueue)) data.marketQueue = [];
    if (!Array.isArray(data.equipment)) data.equipment = [];
    if (!data.equipped) data.equipped = {};
    data.equipment.forEach(it => {
      if (!it.ench) it.ench = {};
      if (!it.rarity) it.rarity = 'common';
    });
    applyUpgradeEffects();
    if (!Array.isArray(data.meta.offlineSkills)) data.meta.offlineSkills = ['Woodcutting', 'Mining', 'Fishing'];
    save();
    renderAll();
    renderSettingsFooter();
    showToast('Imported.');
  } catch (e) { alert('Invalid code'); }
}

export function hardReset() {
  if (confirm('This will erase ALL progress. Continue?')) {
    localStorage.removeItem(SAVE_KEY); location.reload();
  }
}
