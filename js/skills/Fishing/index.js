import items from '../../items.js';

const skill = 'Fishing';
const map = Object.fromEntries(items.map(i => [i.key, i]));
const { anchovy, sardine, trout, salmon, catfish, tuna, swordfish, shark, manta, angler } = map;

export const nodes = [
  {key:'anchovy', name:'Anchovy Shoal', time:2500, yield:{[anchovy.key]:[1,1]}, xp:5, req:1},
  {key:'sardine', name:'Sardine Spot', time:3000, yield:{[sardine.key]:[1,1]}, xp:8, req:11},
  {key:'trout', name:'Trout Stream', time:3500, yield:{[trout.key]:[1,1]}, xp:12, req:22},
  {key:'salmon', name:'Salmon Run', time:4000, yield:{[salmon.key]:[1,1]}, xp:16, req:33},
  {key:'catfish', name:'Catfish Pond', time:4500, yield:{[catfish.key]:[1,1]}, xp:20, req:44},
  {key:'tuna', name:'Tuna Reef', time:5000, yield:{[tuna.key]:[1,1]}, xp:25, req:55},
  {key:'swordfish', name:'Swordfish Deep', time:5500, yield:{[swordfish.key]:[1,1]}, xp:30, req:66},
  {key:'shark', name:'Shark Waters', time:6000, yield:{[shark.key]:[1,1]}, xp:36, req:77},
  {key:'manta', name:'Manta Ray Cove', time:6500, yield:{[manta.key]:[1,1]}, xp:42, req:88},
  {key:'angler', name:'Anglerfish Abyss', time:7000, yield:{[angler.key]:[1,1]}, xp:50, req:99},
];

export function perform(state, node, {addInventory, addSkillXP, randInt}) {
  if(node.consume && !Object.entries(node.consume).every(([k,v])=> (state.inventory[k]||0)>=v)) return false;
  if(node.consume) for(const [k,v] of Object.entries(node.consume)) state.inventory[k]-=v;
  for(const [k,[a,b]] of Object.entries(node.yield||{})) addInventory(k, randInt(a,b));
  addSkillXP(skill, node.xp);
  return true;
}

export default {nodes, perform};
