import Entity from "./Entity";

export const tileDictionary = {
  0: { name: "empty", isOccupiable: true, color: "white" },
  1: { name: "wall", isOccupiable: false, color: "grey" },
};

export const Level = {
  level_01: {
    stageName: "stage 1",
    size: 5,
    map: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ].flat(),
    spawnPoint: { x: 2, y: 2 },
    entities: [{ entity: Entity.t_rex, spawnPoint: { x: 2, y: 3 } }],
    nextIsShop: true,
    nextLevel: "level_02",
  },
  level_02: {
    stageName: "stage 2",
    size: 5,
    map: [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ].flat(),
    spawnPoint: { x: 3, y: 1 },
    entities: [
      { entity: Entity.sauropod, spawnPoint: { x: 5, y: 5 } },
      { entity: Entity.t_rex, spawnPoint: { x: 1, y: 1 } },
    ],
    nextLevel: "the_end",
  },
  the_end: {
    stageName: "the end",
    size: 1,
    map: [[0]].flat(),
    spawnPoint: { x: 1, y: 1 },
  },
};
