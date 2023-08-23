export default {
  neutral: {
    name: "neutral",
    action: {
      type: "neutral",
      direction: "plus",
      range: 0,
      damage: 0,
    },
  },
  locked: {
    name: "locked",
    action: {
      type: "neutral",
      direction: "plus",
      range: 0,
      damage: 0,
    },
  },
  rush: {
    name: "rush",
    action: {
      type: "attack",
      direction: "plus",
      range: 2,
      damage: 1,
    },
  },
  slice: {
    name: "slice",
    action: {
      type: "attack",
      direction: "cross",
      range: 2,
      damage: 1,
    },
  },
  explode: {
    name: "explode",
    action: {
      type: "collateral",
      direction: "radius",
      range: 2,
      damage: 1,
    },
  },
  longRush: {
    name: "long rush",
    action: {
      type: "attack",
      direction: "plus",
      range: 3,
      damage: 1,
    },
  },
  longSlice: {
    name: "long slice",
    action: {
      type: "attack",
      direction: "cross",
      range: 3,
      damage: 1,
    },
  },
  smallExplode: {
    name: "small explode",
    action: {
      type: "collateral",
      direction: "radius",
      range: 2,
      damage: 2,
    },
  },
};
