import { Entity } from "./Entity";

export default function Stage(player, level) {
  let entityCounter = 0;
  let entities = {};

  function reset() {
    for (const entityID in this.entities) {
      if (Object.hasOwnProperty.call(this.entities, entityID)) {
        const entity = this.entities[entityID];
        entity.reset();
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
    reset,
  };
}
