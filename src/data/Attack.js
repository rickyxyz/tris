export default {
  neutral: {
    name: "neutral",

    type: "neutral",
    direction: "plus",
    range: 0,
    damage: 0,
  },
  locked: {
    name: "locked",

    type: "neutral",
    direction: "plus",
    range: 0,
    damage: 0,
  },
  rush: {
    name: "rush",

    type: "attack",
    direction: "plus",
    range: 2,
    damage: 1,
  },
  slice: {
    name: "slice",

    type: "attack",
    direction: "cross",
    range: 2,
    damage: 1,
  },
  explode: {
    name: "explode",

    type: "collateral",
    direction: "radius",
    range: 2,
    damage: 1,
  },
  longRush: {
    name: "long rush",

    type: "attack",
    direction: "plus",
    range: 3,
    damage: 1,
  },
  longSlice: {
    name: "long slice",

    type: "attack",
    direction: "cross",
    range: 3,
    damage: 1,
  },
  smallExplode: {
    name: "small explode",

    type: "collateral",
    direction: "radius",
    range: 2,
    damage: 2,
  },
};
