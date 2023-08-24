import Attack from "./Attack.js";

export default {
  sauropod: {
    name: "Sauropod",
    type: "enemy",
    sprite: "enemy1",
    health: 2,
    maxHealth: 2,
    moves: [Attack.slice],
  },
  t_rex: {
    name: "T-rex",
    type: "enemy",
    sprite: "enemy1",
    health: 5,
    maxHealth: 5,
    moves: [Attack.rush],
  },
};
