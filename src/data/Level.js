import Enemy from "./Enemy";

export const tileDictionary = {
  0: { name: "empty", isOccupiable: true, color: "white" },
  1: { name: "wall", isOccupiable: false, color: "grey" },
};

export const Level = {
  level_01: {
    stageName: "development",
    size: 5,
    map: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ].flat(),
    spawnPoint: { x: 2, y: 2 },
    entities: [
      { entity: Enemy.sauropod, spawnPoint: { x: 3, y: 5 } },
      { entity: Enemy.t_rex, spawnPoint: { x: 4, y: 4 } },
    ],
    nextLevel: "stage_02",
  },
};
