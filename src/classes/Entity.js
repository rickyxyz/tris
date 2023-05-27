import Move from "./Move";

export function Entity({ name, type, sprite, health, moves, coordinate }) {
  const maxHealth = health;
  const spawnPoint = coordinate;

  function reset() {
    this.health = maxHealth;
    this.coordinate = spawnPoint;
  }

  const neutral = Move({
    name: "neutral",
    action: { type: "neutral", direction: "plus", range: 0, damage: 0 },
  });
  return {
    name,
    health,
    type,
    coordinate,
    sprite,
    moves: moves.map((move) => Move(move)),
    neutral,
    reset,
  };
}
