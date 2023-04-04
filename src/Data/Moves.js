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
  rush: {
    name: "rush",
    action: {
      type: "move",
      direction: "plus",
      range: 2,
      damage: 1,
    },
  },
  slice: {
    name: "slice",
    action: {
      type: "move",
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
};
