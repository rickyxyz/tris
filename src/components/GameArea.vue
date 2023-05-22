<script lang="ts">
import { coordinateToIndex, timeout } from "../utils/Utils";

export default {
  props: {
    entities: Object,
    selectedMove: Number,
    isPlayerTurn: Boolean,
  },
  emits: ["endTurn", "entitiesUpdate"],
  data() {
    return {
      size: 5,
      possibleMoves: Array(),
      tileMap: Array(),
      isGridHeightBound: true,
    };
  },
  computed: {
    player() {
      return this.entities.player;
    },
    initialTileMap() {
      let tiles = {};
      for (let y = this.size; y > 0; y--) {
        for (let x = 1; x <= this.size; x++) {
          tiles[coordinateToIndex({ x, y }, this.size)] = {
            coordinate: { x, y },
            color: "white",
            entity: {},
          };
        }
      }
      return tiles;
    },
    gridStyle() {
      return `repeat(${this.size}, 1fr)`;
    },
  },
  methods: {
    calculategridSizeBoundary() {
      this.isGridHeightBound =
        (window.innerHeight >= window.innerWidth &&
          Math.abs(window.innerHeight - window.innerWidth) < 300) ||
        (window.innerHeight < window.innerWidth &&
          Math.abs(window.innerHeight - window.innerWidth) < 20);
    },
    clearPossiblemoves() {
      for (let tile of this.possibleMoves) {
        this.tileMap[tile].color = "white";
      }
      this.possibleMoves = [];
    },
    generateAction() {
      const move =
        this.selectedMove === -1
          ? this.player.neutral
          : this.player.moves[this.selectedMove];
      const area = move.getClickableArea(this.player, this.size);
      for (let tile of area) {
        const idx = coordinateToIndex(tile, this.size);

        let tileType = "empty";
        switch (this.tileMap[idx].entity.type) {
          case "enemy":
            tileType = "enemy";
            break;
          case "player":
            tileType = "self";
            break;
        }

        this.tileMap[idx].color = move.colorMap[tileType];
        this.possibleMoves.push(idx);
      }
    },
    updateParentEntities() {
      for (const index in this.tileMap) {
        const entity = this.tileMap[index].entity;
        if (Object.keys(entity).length !== 0 || entity.constructor !== Object) {
          this.entities[entity.entityID] = entity;
        }
      }
    },
    grid_click(tile) {
      const clickedIndex = coordinateToIndex(tile.coordinate, this.size);
      if (this.possibleMoves.includes(clickedIndex)) {
        this.player.moves[this.selectedMove].execute(
          this.tileMap,
          this.player,
          tile
        );

        this.updateParentEntities();
        this.clearPossiblemoves();
        this.$emit("endTurn");
      }
    },
    async enemyTurn() {
      for (const index in this.entities) {
        const entity = this.entities[index];
        if (entity.health <= 0 || entity.entityID === "player") {
          continue;
        }
        const move = entity.moves[0];
        const area = move.getClickableArea(entity, this.size);
        let closest_tile = { x: -1, y: -1 };
        if (area.length > 0) {
          closest_tile = area.reduce((prev, curr) => {
            let newDiff =
              Math.abs(this.player.coordinate.x - curr.x) +
              Math.abs(this.player.coordinate.y - curr.y);
            let oldDiff =
              Math.abs(this.player.coordinate.x - prev.x) +
              Math.abs(this.player.coordinate.y - prev.y);
            return newDiff <= oldDiff ? curr : prev;
          });
        }
        let nextMove = closest_tile;
        for (let tile of area) {
          const idx = coordinateToIndex(tile, this.size);
          this.possibleMoves.push(idx);
          if (this.tileMap[idx].entity === this.player) {
            this.tileMap[idx].color = "red";
            nextMove = tile;
          } else {
            this.tileMap[idx].color = "blue";
          }
        }
        await timeout(400);

        move.execute(
          this.tileMap,
          entity,
          this.tileMap[coordinateToIndex(nextMove, this.size)]
        );

        this.updateParentEntities();
        this.clearPossiblemoves();
        await timeout(100);
      }
      this.$emit("endTurn");
    },
  },
  watch: {
    selectedMove() {
      if (this.isPlayerTurn) {
        this.clearPossiblemoves();
        this.generateAction();
      }
    },
    isPlayerTurn() {
      if (!this.isPlayerTurn) {
        this.enemyTurn();
      }
    },
  },
  beforeMount() {
    this.tileMap = this.initialTileMap;
  },
  created() {
    window.addEventListener("resize", this.calculategridSizeBoundary);
  },
  mounted() {
    this.calculategridSizeBoundary();
    for (const index in this.entities) {
      const entity = this.entities[index];
      let idx = coordinateToIndex(entity.coordinate, this.size);
      this.tileMap[idx].entity = entity;
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.calculategridSizeBoundary);
  },
};
</script>

<template>
  <div id="game_area" ref="gameArea">
    <div
      id="game_grid"
      :style="[this.isGridHeightBound ? { height: '100%' } : { width: '100%' }]"
    >
      <div
        v-for="(tile, idx) in this.tileMap"
        :key="idx"
        class="game_tile"
        :class="[tile.color]"
        @click="grid_click(tile)"
      >
        <div class="game_tile-health_bar">
          <span class="game_tile-heart" v-for="health in tile.entity.health">
            ❤️
          </span>
        </div>
        {{ tile.entity.sprite }}
      </div>
    </div>
  </div>
</template>

<style scoped>
#game_area {
  display: flex;
  align-items: center;
  justify-content: center;
}

#game_grid {
  display: grid;
  aspect-ratio: 1/1;
  grid-template-columns: v-bind(gridStyle);
  grid-template-rows: v-bind(gridStyle);
}

.game_tile {
  font-size: calc(1rem + 1vh);
  border: solid black 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  flex-direction: column;
}

.game_tile-health_bar {
  max-width: 100%;
  top: calc(0.7rem - 0.5vh);
  position: absolute;
  font-size: calc(0.5rem + 0.2vw);
}

.blue {
  background-color: #2a6aff88;
}

.red {
  background-color: #ff362888;
}
</style>
