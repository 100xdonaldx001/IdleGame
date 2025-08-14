import {data} from './data.js';
import {startStopFight} from './combat.js';
import {save, exportSave, importSave, hardReset} from './persistence.js';
import {applyOfflineProgress} from './offline.js';
import {renderAll, renderStats, renderSkills, renderQuests, activateTab} from './render.js';
import {claimQuestReward} from './quests.js';
import {runTests} from './tests.js';
import {el, clamp} from './utils.js';
import {showToast} from './toast.js';

export function initEvents() {
  el('#btnFight').addEventListener('click', startStopFight);
  el('#btnSaveNow').addEventListener('click', save);
  el('#btnExport').addEventListener('click', exportSave);
  el('#btnImport').addEventListener('click', importSave);
  el('#btnHardReset').addEventListener('click', hardReset);
  el('#btnClaimOffline').addEventListener('click', () => { const ms = applyOfflineProgress(); renderAll(); showToast(`Applied ${Math.floor(ms / 60000)} min of offline.`); });
  el('#btnRunTests').addEventListener('click', () => runTests());
  el('#optAutosave').addEventListener('change', e => { data.meta.autosave = e.target.checked; });
  el('#optDebug').addEventListener('change', e => {
    const dbg = e.target.checked;
    data.meta.debug = dbg;
    el('#tickInfo').hidden = !dbg;
    if (!dbg) el('#tickInfo').textContent = '';
    renderStats();
  });
  el('#optVirtualLevels').addEventListener('change', e => { data.meta.virtualLevels = e.target.checked; renderSkills(); });
  el('#optOfflineHours').addEventListener('change', e => { data.meta.offlineCapHrs = clamp(parseInt(e.target.value || '8'), 0, 24); e.target.value = data.meta.offlineCapHrs; });

  const ql = el('#questList');
  if (ql) {
    ql.addEventListener('click', e => {
      const c = e.target.dataset.claim;
      const go = e.target.dataset.goto;
      if (c) { if (claimQuestReward(c)) { renderQuests(); renderStats(); } }
      if (go) activateTab(go);
    });
  }
}
