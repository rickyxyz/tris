export default {
  neutral: {
    name: "neutral",
    action: {
      type: "neutral",
      direction: "plus",
      range: 0,
      damage: 0,
    },
    cooldown: -1
  },
  locked: {
    name: "locked",
    action: {
      type: "neutral",
      direction: "plus",
      range: 0,
      damage: 0,
    },
    cooldown: -1,
  },
  rush: {
    name: "rush",
    action: {
      type: "attack",
      direction: "plus",
      range: 2,
      damage: 1,
    },
    cooldown: 2,
    timer: 0,
  },
  slice: {
    name: "slice",
    action: {
      type: "attack",
      direction: "cross",
      range: 2,
      damage: 1,
    },
    cooldown: 2,
    timer: 0,
  },
  explode: {
    name: "explode",
    action: {
      type: "collateral",
      direction: "radius",
      range: 2,
      damage: 1,
    },
    cooldown: 2,
    timer: 0,
  },
  longRush: {
    name: "long rush",
    action: {
      type: "attack",
      direction: "plus",
      range: 3,
      damage: 1,
    },
    cooldown: 2,
    timer: 0,
  },
  longSlice: {
    name: "long slice",
    action: {
      type: "attack",
      direction: "cross",
      range: 3,
      damage: 1,
    },
    cooldown: 2,
    timer: 0,
  },
  smallExplode: {
    name: "small explode",
    action: {
      type: "collateral",
      direction: "radius",
      range: 2,
      damage: 2,
    },
    cooldown: 2,
    timer: 0,
  },
};
