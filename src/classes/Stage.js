import { coordinateToIndex } from "../utils/Utils";
import { tileDictionary } from "../data/Level";

export default function Stage(player, level) {
  function constructor() {
    let entityCounter = 0;
    const tileMap = {};

    const allEntities = [{ ...player, coordinate: level.spawnPoint }];
    allEntities.push(
      ...level.entities.map((entity) => ({
        ...entity.entity,
        coordinate: entity.spawnPoint,
      }))
    );

    const entities = allEntities.reduce((accum, curr) => {
      if (curr.type === "player") {
        curr.entityID = "player";
        accum.player = curr;
      } else {
        curr.entityID = entityCounter;
        accum[entityCounter] = curr;
        entityCounter++;
      }
      return accum;
    }, {});

    for (let y = level.size; y > 0; y--) {
      for (let x = 1; x <= level.size; x++) {
        const tileType = level.map[coordinateToIndex({ x, y }, level.size)];
        tileMap[coordinateToIndex({ x, y }, level.size)] = {
          coordinate: { x, y },
          color: tileDictionary[tileType].color,
          isOccupiable: tileDictionary[tileType].isOccupiable,
          entity: {},
        };
      }
    }

    for (const entityID in entities) {
      if (Object.hasOwnProperty.call(entities, entityID)) {
        const entity = entities[entityID];
        tileMap[coordinateToIndex(entity.coordinate, level.size)].entity =
          entity;
      }
    }

    return { tileMap, entities };
  }

  return {
    ...constructor(),
    name: level.stageName,
    size: level.size,
    nextLevel: level.nextLevel,
  };
}
