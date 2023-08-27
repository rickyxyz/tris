export default {
  neutral: {
    name: "neutral",
    type: "neutral",
    direction: "plus",
    range: 0,
    damage: 0,
    description: "",
  },
  locked: {
    name: "locked",
    type: "neutral",
    direction: "plus",
    range: 0,
    damage: 0,
    description: "",
  },
  rush: {
    name: "rush",
    type: "attack",
    direction: "plus",
    range: 2,
    damage: 1,
    heat: 5,
    description: "Attack enemy in a plus shaped area",
  },
  slice: {
    name: "slice",
    type: "attack",
    direction: "cross",
    range: 2,
    damage: 1,
    heat: 5,
    description: "Attack enemy in a cross shaped area",
  },
  explode: {
    name: "explode",
    type: "collateral",
    direction: "radius",
    range: 2,
    damage: 10,
    heat: 5,
    description: "Damage all entities in a radius",
  },
  longRush: {
    name: "long rush",
    type: "attack",
    direction: "plus",
    range: 3,
    damage: 1,
    heat: 5,
    description: "Attack enemy in a plus shaped area",
  },
  heal: {
    name: "heal",
    type: "self",
    direction: "radius",
    range: 0,
    damage: -5,
    heat: 10,
    description: "Heal with the cost of heat",
  },
  heatDischarge: {
    name: "Heat Discharge",
    type: "self",
    direction: "radius",
    range: 0,
    damage: 5,
    heat: -20,
    description: "Reduce heat with the cost of health",
  },
};
