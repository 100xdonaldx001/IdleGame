import {load} from './persistence.js';
import {renderTabs, renderAll, renderSettingsFooter} from './render.js';
import {runTests} from './tests.js';
import {applyOfflineProgress} from './offline.js';
import {showToast} from './toast.js';
import {applyUpgradeEffects} from './helpers.js';
import {loop} from './loop.js';

export function init() {
  load(); renderTabs(); renderAll(); renderSettingsFooter();
  runTests();
  const applied = applyOfflineProgress(); if (applied > 0) showToast(`Welcome back! (+${Math.floor(applied / 60000)}m)`);
  applyUpgradeEffects();
  requestAnimationFrame(loop);
}
