import { calculateCollisionResult, coordinateToIndex } from "../utils/Utils";

export default function Move({ name, action }) {
  function getClickableArea(user, tileMap, boundary) {
    return calculatePossibleMoves(
      user.coordinate,
      action.direction,
      action.range,
      boundary,
      tileMap
    );
  }

  function execute(tileMap, user, targetTile) {
    const size = Math.sqrt(Object.keys(tileMap).length);
    const userIndex = coordinateToIndex(user.coordinate, size);
    const clickedTileIndex = coordinateToIndex(targetTile.coordinate, size);

    switch (action.type) {
      case "attack":
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
            const collisionResultIndex = coordinateToIndex(
              collisionResult,
              size
            );
            tileMap[collisionResultIndex].entity = user;
            user.coordinate = collisionResult;
            targetTile.entity.health = targetTile.entity.health - action.damage;
          } else {
            user.coordinate = targetTile.coordinate;
            targetTile.entity.health = 0;
            tileMap[clickedTileIndex].entity = user;
          }
        }
        break;
      case "collateral":
        const area = getClickableArea(user, size);
        for (let tile of area) {
          const idx = coordinateToIndex(tile, size);
          const tileEntity = tileMap[idx].entity;
          if (
            Object.keys(tileEntity).length !== 0 ||
            tileEntity.constructor !== Object
          ) {
            tileEntity.health -= action.damage;
            if (tileEntity.health <= 0) {
              tileMap[idx].entity = {};
            }
          }
        }
        break;
    }
  }

  return {
    name,
    colorMap: tileColorMap[action.type],
    getClickableArea,
    execute,
  };
}

function calculatePossibleMoves({ x, y }, shape, range, bound, tileMap) {
  let possibleMoves = [];
  switch (shape) {
    case "plus":
      // RIGHT
      for (let distance = 1; distance <= range; distance++) {
        if (
          x + distance <= bound &&
          tileMap[coordinateToIndex({ x: x + distance, y }, bound)].isOccupiable
        )
          possibleMoves.push({ x: x + distance, y });
        else break;
      }

      // LEFT
      for (let distance = 1; distance <= range; distance++) {
        if (
          x - distance >= 1 &&
          tileMap[coordinateToIndex({ x: x - distance, y }, bound)].isOccupiable
        )
          possibleMoves.push({ x: x - distance, y });
        else break;
      }

      // UP
      for (let distance = 1; distance <= range; distance++) {
        if (
          y + distance <= bound &&
          tileMap[coordinateToIndex({ x, y: y + distance }, bound)].isOccupiable
        )
          possibleMoves.push({ x, y: y + distance });
        else break;
      }

      // DOWN
      for (let distance = 1; distance <= range; distance++) {
        if (
          y - distance >= 1 &&
          tileMap[coordinateToIndex({ x, y: y - distance }, bound)].isOccupiable
        )
          possibleMoves.push({ x, y: y - distance });
        else break;
      }
      break;
    case "cross":
      // UP-RIGHT
      for (let distance = 1; distance <= range; distance++) {
        if (
          x + distance <= bound &&
          y + distance <= bound &&
          tileMap[
            coordinateToIndex({ x: x + distance, y: y + distance }, bound)
          ].isOccupiable
        ) {
          possibleMoves.push({ x: x + distance, y: y + distance });
        } else break;
      }

      // // UP-LEFT
      for (let distance = 1; distance <= range; distance++) {
        if (
          x - distance >= 1 &&
          y + distance <= bound &&
          tileMap[
            coordinateToIndex({ x: x - distance, y: y + distance }, bound)
          ].isOccupiable
        )
          possibleMoves.push({ x: x - distance, y: y + distance });
        else break;
      }

      // // DOWN-RIGHT
      for (let distance = 1; distance <= range; distance++) {
        if (
          x + distance <= bound &&
          y - distance >= 1 &&
          tileMap[
            coordinateToIndex({ x: x + distance, y: y - distance }, bound)
          ].isOccupiable
        )
          possibleMoves.push({ x: x + distance, y: y - distance });
        else break;
      }

      // // DOWN-LEFT
      for (let distance = 1; distance <= range; distance++) {
        if (
          x - distance >= 1 &&
          y - distance >= 1 &&
          tileMap[
            coordinateToIndex({ x: x - distance, y: y - distance }, bound)
          ].isOccupiable
        )
          possibleMoves.push({ x: x - distance, y: y - distance });
        else break;
      }
      break;
    case "radius":
      // RIGHT
      for (let distance = 1; distance <= range; distance++) {
        if (
          x + distance <= bound &&
          tileMap[coordinateToIndex({ x: x + distance, y }, bound)].isOccupiable
        ) {
          possibleMoves.push({ x: x + distance, y });

          // UP
          for (
            let distance_up = 1;
            distance_up <= range - distance;
            distance_up++
          ) {
            if (
              y + distance_up <= bound &&
              tileMap[
                coordinateToIndex(
                  { x: x + distance, y: y + distance_up },
                  bound
                )
              ].isOccupiable
            )
              possibleMoves.push({ x: x + distance, y: y + distance_up });
            else break;
          }

          // DOWN
          for (
            let distance_up = 1;
            distance_up <= range - distance;
            distance_up++
          ) {
            if (
              y + distance_up <= bound &&
              tileMap[
                coordinateToIndex(
                  { x: x + distance, y: y - distance_up },
                  bound
                )
              ].isOccupiable
            )
              possibleMoves.push({ x: x + distance, y: y - distance_up });
            else break;
          }
        } else break;
      }

      // LEFT
      for (let distance = 1; distance <= range; distance++) {
        if (
          x - distance >= 1 &&
          tileMap[coordinateToIndex({ x: x - distance, y }, bound)].isOccupiable
        ) {
          possibleMoves.push({ x: x - distance, y });
          // UP
          for (
            let distance_up = 1;
            distance_up <= range - distance;
            distance_up++
          ) {
            if (
              y + distance_up <= bound &&
              tileMap[
                coordinateToIndex(
                  { x: x - distance, y: y + distance_up },
                  bound
                )
              ].isOccupiable
            )
              possibleMoves.push({ x: x - distance, y: y + distance_up });
            else break;
          }

          // DOWN
          for (
            let distance_up = 1;
            distance_up <= range - distance;
            distance_up++
          ) {
            if (
              y + distance_up <= bound &&
              tileMap[
                coordinateToIndex(
                  { x: x - distance, y: y - distance_up },
                  bound
                )
              ].isOccupiable
            )
              possibleMoves.push({ x: x - distance, y: y - distance_up });
            else break;
          }
        } else break;
      }

      // UP
      for (let distance = 1; distance <= range; distance++) {
        if (
          y + distance <= bound &&
          tileMap[coordinateToIndex({ x, y: y + distance }, bound)].isOccupiable
        ) {
          possibleMoves.push({ x, y: y + distance });

          // RIGHT
          for (
            let distance_up = 1;
            distance_up <= range - distance;
            distance_up++
          ) {
            if (
              x + distance_up <= bound &&
              tileMap[
                coordinateToIndex(
                  { x: x + distance_up, y: y + distance },
                  bound
                )
              ].isOccupiable
            )
              possibleMoves.push({ x: x + distance_up, y: y + distance });
            else break;
          }

          // LEFT
          for (
            let distance_up = 1;
            distance_up <= range - distance;
            distance_up++
          ) {
            if (
              x - distance_up <= bound &&
              tileMap[
                coordinateToIndex(
                  { x: x - distance_up, y: y + distance },
                  bound
                )
              ].isOccupiable
            )
              possibleMoves.push({ x: x - distance_up, y: y + distance });
            else break;
          }
        } else break;
      }

      // DOWN
      for (let distance = 1; distance <= range; distance++) {
        if (
          y - distance >= 1 &&
          tileMap[coordinateToIndex({ x, y: y - distance }, bound)].isOccupiable
        ) {
          possibleMoves.push({ x, y: y - distance });

          // RIGHT
          for (
            let distance_up = 1;
            distance_up <= range - distance;
            distance_up++
          ) {
            if (
              x + distance_up <= bound &&
              tileMap[
                coordinateToIndex(
                  { x: x + distance_up, y: y - distance },
                  bound
                )
              ].isOccupiable
            )
              possibleMoves.push({ x: x + distance_up, y: y - distance });
            else break;
          }

          // LEFT
          for (
            let distance_up = 1;
            distance_up <= range - distance;
            distance_up++
          ) {
            if (
              x - distance_up <= bound &&
              tileMap[
                coordinateToIndex(
                  { x: x - distance_up, y: y - distance },
                  bound
                )
              ].isOccupiable
            )
              possibleMoves.push({ x: x - distance_up, y: y - distance });
            else break;
          }
        } else break;
      }
      break;
  }

  possibleMoves = possibleMoves.filter(
    ({ x, y }) => y > 0 && x > 0 && y <= bound && x <= bound
  );

  return possibleMoves;
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
