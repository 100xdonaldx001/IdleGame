export const enemies = {
  Glade: [
    {key:'Slime', hp:30, atk:3, def:1, spd:1.0, gold:[2,5], drops:{skin:[0,1]}},
    {key:'Boar', hp:45, atk:5, def:2, spd:0.9, gold:[5,9], drops:{skin:[1,2]}},
  ],
  Cavern: [
    {key:'Bat', hp:40, atk:4, def:2, spd:1.2, gold:[5,10], drops:{gem:[0,1]}},
    {key:'Golem', hp:80, atk:6, def:4, spd:0.8, gold:[10,18], drops:{gem:[1,2]}},
  ],
};

export const areas = Object.keys(enemies);
export default enemies;
