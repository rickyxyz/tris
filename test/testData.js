import Attack from "../src/data/Attack";

export const testPlayer = {
  name: "hero",
  type: "player",
  coordinate: { x: 2, y: 2 },
  sprite: "👑",
  health: 3,
  moves: [Attack.rush, Attack.slice, Attack.explode],
};

export const testLevel = {
  stageName: "test stage",
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
