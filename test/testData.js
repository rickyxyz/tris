import Attack from "../src/data/Attack";
import Entity from "../src/data/Entity";

export const testPlayer = {
  name: "hero",
  type: "player",
  coordinate: { x: 2, y: 2 },
  sprite: "👑",
  health: 3,
  moves: [Attack.rush, Attack.slice, Attack.explode],
};

export const testLevel1 = {
  stageName: "test stage 1",
  size: 5,
  map: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ].flat(),
  spawnPoint: { x: 3, y: 3 },
  entities: [],
  nextLevel: null,
};

export const testLevel2 = {
  stageName: "test stage 2",
  size: 2,
  map: [
    [0, 0],
    [0, 0],
  ].flat(),
  spawnPoint: { x: 1, y: 1 },
  entities: [{ entity: Entity.sauropod, spawnPoint: { x: 2, y: 2 } }],
  nextLevel: null,
};
