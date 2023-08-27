import Attack from "./Attack.js";

export default {
  sauropod: {
    name: "Sauropod",
    type: "enemy",
    sprite: "enemy1",
    health: 2,
    maxHealth: 2,
    heat: 0,
    moves: [Attack.slice],
  },
  t_rex: {
    name: "T-rex",
    type: "enemy",
    sprite: "enemy1",
    health: 1,
    maxHealth: 1,
    heat: 0,
    moves: [Attack.rush],
  },
};
