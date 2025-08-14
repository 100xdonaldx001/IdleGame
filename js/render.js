import {renderStats} from './render/stats.js';
import {renderSkills, renderTaskPanel} from './render/skills.js';
import {renderOverview} from './render/overview.js';
import {renderInventory} from './render/inventory.js';
import {renderEquipment} from './render/equipment.js';
import {renderEnchanting} from './render/enchanting.js';
import {renderFarm} from './render/farm.js';
import {renderUpgrades} from './render/upgrades.js';
import {renderAchievements} from './render/achievements.js';
import {renderCombatUI} from './render/combat.js';
import {renderMarket} from './render/market.js';

export {tabButton, activateTab, renderTabs, prevTab} from './render/tabs.js';
export {renderStats} from './render/stats.js';
export {renderSkills, renderTaskPanel, nodeButton} from './render/skills.js';
export {renderOverview} from './render/overview.js';
export {renderInventory} from './render/inventory.js';
export {renderEquipment} from './render/equipment.js';
export {renderEnchanting} from './render/enchanting.js';
export {renderFarm} from './render/farm.js';
export {renderUpgrades} from './render/upgrades.js';
export {renderAchievements} from './render/achievements.js';
export {renderCombatUI} from './render/combat.js';
export {renderSettingsFooter} from './render/settings.js';
export {renderMarket} from './render/market.js';

export function renderAll() {
  renderStats();
  renderSkills();
  renderTaskPanel();
  renderOverview();
  renderInventory();
  renderEquipment();
  renderMarket();
  renderEnchanting(null);
  renderFarm();
  renderUpgrades();
  renderAchievements();
  renderCombatUI();
}

