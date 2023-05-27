import Enemy from "./Enemy";

export default {
  level_01: {
    stageName: "development",
    size: 5,
    spawnPoint: { x: 2, y: 2 },
    entities: [
      { entity: Enemy.sauropod, spawnPoint: { x: 3, y: 5 } },
      { entity: Enemy.t_rex, spawnPoint: { x: 4, y: 4 } },
    ],
    nextLevel: "stage_02",
  },
};
