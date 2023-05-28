import { Entity } from "./Entity";
import { coordinateToIndex } from "../utils/Utils";

export default function Stage(player, level) {
  let entityCounter = 0;
  let entities = {};
  let tileMap = {};

  for (let y = level.size; y > 0; y--) {
    for (let x = 1; x <= level.size; x++) {
      tileMap[coordinateToIndex({ x, y }, level.size)] = {
        coordinate: { x, y },
        color: "white",
        entity: {},
      };
    }
  }

  function reset() {
    for (const tileIndex in this.tileMap) {
      if (Object.hasOwnProperty.call(tileMap, tileIndex)) {
        const tile = this.tileMap[tileIndex];
        tile.entity = {};
        tile.color = "white";
      }
    }
    for (const entityID in this.entities) {
      if (Object.hasOwnProperty.call(this.entities, entityID)) {
        const entity = this.entities[entityID];
        entity.reset();
        this.tileMap[coordinateToIndex(entity.coordinate, level.size)].entity =
          entity;
      }
    }

    return this;
  }

  function makeEntitiesDictionary() {
    const allEntities = [{ ...player, coordinate: level.spawnPoint }];
    allEntities.push(
      ...level.entities.map((entity) => ({
        ...entity.entity,
        coordinate: entity.spawnPoint,
      }))
    );
    const entityObjects = allEntities.map((entity) => Entity(entity));
    return entityObjects.reduce((accum, curr) => {
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
  }

  entities = makeEntitiesDictionary();

  return {
    name: level.stageName,
    size: level.size,
    entities: entities,
    nextLevel: level.nextLevel,
    tileMap,
    reset,
  };
}
