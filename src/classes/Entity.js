import Move from "./Move";

export default function Entity({
  name,
  type,
  sprite,
  health,
  moves,
  coordinate,
}) {
  let self = {
    name,
    health,
    type,
    coordinate,
    sprite,
  };

  const maxHealth = health;
  const movesObject = moves.map((move) => Move(self, move));
  const neutral = Move(self, {
    name: "neutral",
    action: {
      type: "neutral",
      direction: "plus",
      range: 0,
      damage: 0,
    },
  });

  function reset() {
    this.health = this.maxHealth;
  }

  function onClick(clickedTile) {}

  self = {
    ...self,
    neutral,
    moves: movesObject,
    reset,
  };

  return self;
}
