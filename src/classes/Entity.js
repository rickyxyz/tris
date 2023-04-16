export default function Entity({
  name,
  type,
  sprite,
  health,
  moves,
  coordinate,
}) {
  const maxHealth = health;
  function reset() {
    this.health = this.maxHealth;
  }

  return {
    name,
    health,
    type,
    coordinate,
    sprite,
    moves,
    reset,
  };
}
