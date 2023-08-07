import Enemy from "./Enemy";

export const tileDictionary = {
  0: { name: "empty", isOccupiable: true, color: "white" },
  1: { name: "wall", isOccupiable: false, color: "grey" },
};

export const Level = {
  level_01: {
    stageName: "development_01",
    size: 5,
    map: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ].flat(),
    spawnPoint: { x: 2, y: 2 },
    entities: [{ entity: Enemy.t_rex, spawnPoint: { x: 2, y: 3 } }],
    nextLevel: "level_02",
  },
  level_02: {
    stageName: "development_02",
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
      { entity: Enemy.sauropod, spawnPoint: { x: 5, y: 5 } },
      { entity: Enemy.t_rex, spawnPoint: { x: 1, y: 1 } },
    ],
    nextLevel: "level_03",
  },
};
