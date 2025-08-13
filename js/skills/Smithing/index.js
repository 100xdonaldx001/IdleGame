import items from '../../items.js';

const skill = 'Smithing';
const map = Object.fromEntries(items.map(i => [i.key, i]));
const {
  copper, iron, silver, goldOre, platinum, titanium, uranium, diamond,
  copperBar, ironBar, silverBar, goldBar, platinumBar, titaniumBar, uraniumBar, diamondBar,
  copperPickaxe, copperAxe, ironPickaxe, ironAxe, silverPickaxe, silverAxe,
  goldPickaxe, goldAxe, platinumPickaxe, platinumAxe, titaniumPickaxe, titaniumAxe,
  uraniumPickaxe, uraniumAxe, diamondPickaxe, diamondAxe
} = map;

const metals = [
  {ore: copper, bar: copperBar, pickaxe: copperPickaxe, axe: copperAxe, time: 4000, xp: 10, req: 1},
  {ore: iron, bar: ironBar, pickaxe: ironPickaxe, axe: ironAxe, time: 5000, xp: 15, req: 15},
  {ore: silver, bar: silverBar, pickaxe: silverPickaxe, axe: silverAxe, time: 6000, xp: 20, req: 30},
  {ore: goldOre, bar: goldBar, pickaxe: goldPickaxe, axe: goldAxe, time: 7000, xp: 25, req: 45},
  {ore: platinum, bar: platinumBar, pickaxe: platinumPickaxe, axe: platinumAxe, time: 8000, xp: 30, req: 60},
  {ore: titanium, bar: titaniumBar, pickaxe: titaniumPickaxe, axe: titaniumAxe, time: 9000, xp: 35, req: 75},
  {ore: uranium, bar: uraniumBar, pickaxe: uraniumPickaxe, axe: uraniumAxe, time: 10000, xp: 40, req: 90},
  {ore: diamond, bar: diamondBar, pickaxe: diamondPickaxe, axe: diamondAxe, time: 11000, xp: 45, req: 99},
];

export const nodes = [
  ...metals.map(m => ({
    key: m.bar.key,
    name: `Smelt ${m.bar.name}`,
    time: m.time,
    consume: {[m.ore.key]: 3},
    yield: {[m.bar.key]: [1, 1]},
    xp: m.xp,
    req: m.req
  })),
  ...metals.map(m => ({
    key: m.pickaxe.key,
    name: `Forge ${m.pickaxe.name}`,
    time: m.time,
    consume: {[m.bar.key]: 3},
    yield: {[m.pickaxe.key]: [1, 1]},
    xp: m.xp + 5,
    req: m.req
  })),
  ...metals.map(m => ({
    key: m.axe.key,
    name: `Forge ${m.axe.name}`,
    time: m.time,
    consume: {[m.bar.key]: 3},
    yield: {[m.axe.key]: [1, 1]},
    xp: m.xp + 5,
    req: m.req
  })),
];

export function perform(state, node, {addInventory, addEquipment, addSkillXP, randInt}) {
  if (node.consume && !Object.entries(node.consume).every(([k, v]) => (state.inventory[k] || 0) >= v)) return false;
  if (node.consume) for (const [k, v] of Object.entries(node.consume)) state.inventory[k] -= v;
  for (const [k, [a, b]] of Object.entries(node.yield || {})) {
    const amt = randInt(a, b);
    for (let i = 0; i < amt; i++) {
      if (!addEquipment(k)) addInventory(k, 1);
    }
  }
  addSkillXP(skill, node.xp);
  return true;
}

export default {nodes, perform};
