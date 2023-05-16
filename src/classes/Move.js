import {
  calculatePossibleMoves,
  calculateCollisionResult,
  coordinateToIndex,
} from "../utils/Utils";

export default function Move({ name, action }) {
  function getClickableArea(user, boundary) {
    return calculatePossibleMoves(
      user.coordinate,
      action.direction,
      action.range,
      boundary
    );
  }

  function execute(tileMap, user, targetTile) {
    const size = Math.sqrt(Object.keys(tileMap).length);
    const userIndex = coordinateToIndex(user.coordinate, size);
    const clickedTileIndex = coordinateToIndex(targetTile.coordinate, size);
    const entityUpdates = [];

    tileMap[userIndex].entity = {};

    if (Object.keys(targetTile.entity).length === 0) {
      tileMap[clickedTileIndex].entity = user;
      user.coordinate = targetTile.coordinate;
    } else {
      if (targetTile.entity.health > action.damage) {
        const collisionResult = calculateCollisionResult(
          user.coordinate,
          targetTile.coordinate
        );
        const collisionResultIndex = coordinateToIndex(collisionResult, size);
        tileMap[collisionResultIndex].entity = user;
        user.coordinate = collisionResult;
        targetTile.entity.health = targetTile.entity.health - action.damage;
      } else {
        user.coordinate = targetTile.coordinate;
        targetTile.entity.health = 0;
        tileMap[clickedTileIndex].entity = user;
      }
    }
  }

  return {
    name,
    colorMap: tileColorMap[action.type],
    getClickableArea,
    execute,
  };
}

const tileColorMap = {
  attack: {
    self: "white",
    empty: "blue",
    enemy: "red",
  },
  collateral: {
    self: "red",
    empty: "red",
    enemy: "red",
  },
};
