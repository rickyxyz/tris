import Action from "./Action.js";

export default {
  player: {
    name: "hero",
    type: "player",
    sprite: "player",
    health: 10,
    maxHealth: 10,
    heat: 0,
    maxHeat: 20,
    moves: [
      Action.rush,
      Action.slice,
      Action.explode,
      Action.locked,
      Action.locked,
    ],
  },
  sauropod: {
    name: "Sauropod",
    type: "enemy",
    sprite: "enemy1",
    health: 2,
    maxHealth: 2,
    heat: 0,
    moves: [Action.slice],
  },
  t_rex: {
    name: "T-rex",
    type: "enemy",
    sprite: "enemy1",
    health: 1,
    maxHealth: 1,
    heat: 0,
    moves: [Action.rush],
  },
};
