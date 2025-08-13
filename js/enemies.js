export const enemies = {
  Glade: [
    {key:'Slime', cat:'Aberration', hp:30, atk:3, def:1, spd:1.0, drops:{skin:[0,1]}},
    {key:'Boar', cat:'Beast', hp:45, atk:5, def:2, spd:0.9, drops:{skin:[1,2]}},
    {key:'Wolf', cat:'Beast', hp:60, atk:6, def:3, spd:1.0, drops:{skin:[1,2]}},
    {key:'Chicken', cat:'Farming', hp:20, atk:1, def:0, spd:1.2, drops:{egg:[1,3], feather:[0,2]}},
    {key:'Cow', cat:'Farming', hp:80, atk:4, def:4, spd:0.8, drops:{skin:[1,2]}},
    {key:'Sheep', cat:'Farming', hp:50, atk:3, def:1, spd:0.9, drops:{wool:[1,3]}},
    {key:'Bear', cat:'Beast', hp:90, atk:8, def:4, spd:0.9, drops:{skin:[2,3]}},
    {key:'Fairy', cat:'Mythical', hp:40, atk:7, def:2, spd:1.3, drops:{gem:[1,2]}}
  ],
  Cavern: [
    {key:'Bat', cat:'Beast', hp:40, atk:4, def:2, spd:1.2, drops:{gem:[0,1]}},
    {key:'Golem', cat:'Construct', hp:80, atk:6, def:4, spd:0.8, drops:{gem:[1,2]}},
    {key:'Spider', cat:'Beast', hp:55, atk:5, def:2, spd:1.0, drops:{skin:[0,1]}},
    {key:'Goblin', cat:'Humanoid', hp:70, atk:7, def:3, spd:1.1, gold:[12,20], drops:{gem:[1,2]}},
    {key:'Skeleton', cat:'Undead', hp:65, atk:7, def:4, spd:1.0, drops:{bone:[1,2]}},
    {key:'Zombie', cat:'Undead', hp:75, atk:6, def:3, spd:0.8, drops:{skin:[0,1], bone:[0,1]}},
    {key:'Orc', cat:'Humanoid', hp:85, atk:8, def:5, spd:1.0, gold:[15,22], drops:{skin:[1,2]}},
    {key:'Dragon', cat:'Mythical', hp:150, atk:12, def:8, spd:1.2, drops:{scale:[1,2], gem:[1,3]}}
  ],
};

export const areas = Object.keys(enemies);
export default enemies;
