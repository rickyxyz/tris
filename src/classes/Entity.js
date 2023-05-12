import Move from "./Move";
export default function ({ name, type, sprite, health, moves, coordinate }) {
  const maxHealth = health;
  const neutral = Move({
    name: "neutral",
    action: { type: "neutral", direction: "plus", range: 0, damage: 0 },
  });
  function reset() {
    health = maxHealth;
  }
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
