export function Entity({ name, type, sprite, health, moves, coordinate }) {
  const maxHealth = health;
  const spawnPoint = coordinate;

  function reset() {
    this.health = maxHealth;
    this.coordinate = spawnPoint;
  }

  return {
    name,
    health,
    type,
    coordinate,
    sprite,
    moveSet: moves,
    reset,
  };
}
