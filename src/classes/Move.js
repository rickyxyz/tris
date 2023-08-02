import { calculateCollisionResult, coordinateToIndex } from "../utils/Utils";

let possibleMovesCache = [];

export function getClickableArea(level, entityID, move) {
  const { x, y } = level.entities[entityID].coordinate;
  const shape = move.action.direction;
  const range = move.action.range;
  const tileMap = level.tileMap;
  const bound = level.size;
  let possibleMoves = [];

  function calculateDirectionalMove(
    { x0, y0 },
    directionName,
    range,
    bound,
    tileMap
  ) {
    const directionDictionary = {
      UP: { x: 0, y: 1 },
      DOWN: { x: 0, y: -1 },
      LEFT: { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 },
      "UP-RIGHT": { x: 1, y: 1 },
      "UP-LEFT": { x: -1, y: 1 },
      "DOWN-RIGHT": { x: 1, y: -1 },
      "DOWN-LEFT": { x: -1, y: -1 },
    };
    const direction = directionDictionary[directionName];
    const possibleMoves = [];

    function withinBound(distanceX, distanceY) {
      const boundX = direction.x > 0 ? bound : 1;
      const boundY = direction.y > 0 ? bound : 1;

      return (
        (direction.x != 0
          ? direction.x > 0
            ? x0 + distanceX <= boundX
            : x0 + distanceX >= boundX
          : true) &&
        (direction.y != 0
          ? direction.y > 0
            ? y0 + distanceY <= boundY
            : y0 + distanceY >= boundY
          : true)
      );
    }

    for (let distance = 1; distance <= range; distance++) {
      const distanceX = direction.x * distance;
      const distanceY = direction.y * distance;

      if (
        withinBound(distanceX, distanceY) &&
        tileMap[
          coordinateToIndex({ x: x0 + distanceX, y: y0 + distanceY }, bound)
        ].isOccupiable
      )
        possibleMoves.push({ x: x0 + distanceX, y: y0 + distanceY });
      else break;
    }

    return possibleMoves;
  }

  switch (shape) {
    case "plus":
      possibleMoves.push(
        ...calculateDirectionalMove(
          { x0: x, y0: y },
          "UP",
          range,
          bound,
          tileMap
        ),
        ...calculateDirectionalMove(
          { x0: x, y0: y },
          "DOWN",
          range,
          bound,
          tileMap
        ),
        ...calculateDirectionalMove(
          { x0: x, y0: y },
          "LEFT",
          range,
          bound,
          tileMap
        ),
        ...calculateDirectionalMove(
          { x0: x, y0: y },
          "RIGHT",
          range,
          bound,
          tileMap
        )
      );
      break;
    case "cross":
      possibleMoves.push(
        ...calculateDirectionalMove(
          { x0: x, y0: y },
          "UP-RIGHT",
          range,
          bound,
          tileMap
        ),
        ...calculateDirectionalMove(
          { x0: x, y0: y },
          "UP-LEFT",
          range,
          bound,
          tileMap
        ),
        ...calculateDirectionalMove(
          { x0: x, y0: y },
          "DOWN-RIGHT",
          range,
          bound,
          tileMap
        ),
        ...calculateDirectionalMove(
          { x0: x, y0: y },
          "DOWN-LEFT",
          range,
          bound,
          tileMap
        )
      );
      break;
    case "radius":
      const exploreQueue = [{ x, y, dist: 0 }];
      const explored = new Set();

      while (exploreQueue.length) {
        const curr = exploreQueue.pop();
        explored.add(JSON.stringify({ x: curr.x, y: curr.y }));

        if (
          curr.y + 1 <= bound &&
          curr.dist + 1 <= range &&
          tileMap[coordinateToIndex({ x: curr.x, y: curr.y + 1 }, bound)]
            .isOccupiable &&
          !explored.has(JSON.stringify({ x: curr.x, y: curr.y + 1 }))
        )
          exploreQueue.push({
            x: curr.x,
            y: curr.y + 1,
            dist: curr.dist + 1,
          });
        if (
          curr.x + 1 <= bound &&
          curr.dist + 1 <= range &&
          tileMap[coordinateToIndex({ x: curr.x + 1, y: curr.y }, bound)]
            .isOccupiable &&
          !explored.has(JSON.stringify({ x: curr.x + 1, y: curr.y }))
        )
          exploreQueue.push({
            x: curr.x + 1,
            y: curr.y,
            dist: curr.dist + 1,
          });
        if (
          curr.y - 1 > 0 &&
          curr.dist + 1 <= range &&
          tileMap[coordinateToIndex({ x: curr.x, y: curr.y - 1 }, bound)]
            .isOccupiable &&
          !explored.has(JSON.stringify({ x: curr.x, y: curr.y - 1 }))
        )
          exploreQueue.push({
            x: curr.x,
            y: curr.y - 1,
            dist: curr.dist + 1,
          });
        if (
          curr.x - 1 > 0 &&
          curr.dist + 1 <= range &&
          tileMap[coordinateToIndex({ x: curr.x - 1, y: curr.y }, bound)]
            .isOccupiable &&
          !explored.has(JSON.stringify({ x: curr.x - 1, y: curr.y }))
        )
          exploreQueue.push({
            x: curr.x - 1,
            y: curr.y,
            dist: curr.dist + 1,
          });
      }

      Array.from(explored).map((a) => possibleMoves.push(JSON.parse(a)));
      break;
  }

  possibleMoves = possibleMoves.filter(
    ({ x, y }) => y > 0 && x > 0 && y <= bound && x <= bound
  );

  possibleMovesCache = possibleMoves;

  return possibleMoves;
}

export function execute(level, entityID, move, targetCoordinate) {
  const tileMap = level.tileMap;
  const user = level.entities[entityID];
  const action = move.action;
  const size = Math.sqrt(Object.keys(tileMap).length);
  const userIndex = coordinateToIndex(user.coordinate, size);
  const clickedTileIndex = coordinateToIndex(targetCoordinate, size);
  const targetTile = tileMap[clickedTileIndex];

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
      break;
    case "collateral":
      const area = possibleMovesCache;
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
