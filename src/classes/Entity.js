import Move from "./Move";

let entityID = -1;

export function Entity({ name, type, sprite, health, moves, coordinate }) {
  entityID++;
  const maxHealth = health;
  const neutral = Move({
    name: "neutral",
    action: { type: "neutral", direction: "plus", range: 0, damage: 0 },
  });
  function reset() {
    health = maxHealth;
  }
  return {
    entityID: type === "player" ? "player" : entityID,
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

export function makeEntitiesObject(entities) {
  return entities.reduce((accum, curr) => {
    accum[curr.entityID] = curr;
    return accum;
  }, {});
}
