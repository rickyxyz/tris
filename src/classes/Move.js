import {
  calculatePossibleMoves,
  calculateCollisionResult,
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

  function onClick(user, targetTile) {
    if (Object.keys(targetTile.entity).length === 0) {
      return {
        userUpdate: {
          coordinate: targetTile.coordinate,
        },
        targetTileUpdate: null,
      };
    } else {
      if (targetTile.entity.health > action.damage) {
        return {
          userUpdate: {
            coordinate: calculateCollisionResult(
              user.coordinate,
              targetTile.coordinate
            ),
          },
          targetTileUpdate: {
            entity: {
              health: targetTile.entity.health - action.damage,
            },
          },
        };
      } else {
        return {
          userUpdate: {
            coordinate: targetTile.coordinate,
          },
          targetTileUpdate: {
            entity: {
              health: 0,
            },
          },
        };
      }
    }
  }

  return {
    name,
    colorMap: tileColorMap[action.type],
    getClickableArea,
    onClick,
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
