import Attack from "./Attack.js";

export default {
  sauropod: {
    name: "Sauropod",
    type: "enemy",
    sprite: "enemy1",
    memory: 2,
    moves: [Attack.slice],
  },
  t_rex: {
    name: "T-rex",
    type: "enemy",
    sprite: "enemy1",
    memory: 1,
    moves: [Attack.rush],
  },
};
