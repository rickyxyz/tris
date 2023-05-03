<script lang="ts">
import {
  calculatePossibleMoves,
  coordinateToIndex,
  calculateCollisionResult,
  timeout,
} from "../utils/Utils";
import { ref } from "vue";

export default {
  props: {
    player: Object,
    entities: Array,
    selectedMove: Number,
    isPlayerTurn: Boolean,
  },
  emits: ["endTurn"],
  data() {
    return {
      size: 5,
      possibleMoves: Array(),
      tileMap: Array(),
      gridSizeBoundary: {},
    };
  },
  computed: {
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
    grid_click(tile) {
      const clickedIndex = coordinateToIndex(tile.coordinate, this.size);
      if (this.possibleMoves.includes(clickedIndex)) {
        this.tileMap[
          coordinateToIndex(this.player.coordinate, this.size)
        ].entity = {};
        const { userUpdate, targetTileUpdate } = this.player.moves[
          this.selectedMove
        ].onClick(this.player, tile);
        if (targetTileUpdate) {
          tile.entity.health = targetTileUpdate.entity.health;
        } else {
          tile.entity = {};
        }
        this.player.coordinate = userUpdate.coordinate;
        this.tileMap[
          coordinateToIndex(this.player.coordinate, this.size)
        ].entity = this.player;
        this.clearPossiblemoves();
        this.$emit("endTurn");
      }
    },
    async enemyTurn() {
      // let o = 1;
      // for (let entity of this.entities) {
      //   if (entity.health <= 0) {
      //     continue;
      //   }
      //   let move = entity.moves[0];
      //   let closest_tile = { x: -1, y: -1 };
      //   let actionTaken = false;
      //   let area = calculatePossibleMoves(
      //     entity.coordinate,
      //     move.action.direction,
      //     move.action.range,
      //     this.size
      //   );
      //   area = area.filter((tile) => {
      //     return !this.tileMap[coordinateToIndex(tile, this.size)].entity.name || this.tileMap[coordinateToIndex(tile, this.size)].entity === this.player;
      //   })
      //   if (area.length > 0) {
      //     closest_tile = area.reduce((prev, curr) => {
      //       let newDiff = Math.abs(this.player.coordinate.x - curr.x) + Math.abs(this.player.coordinate.y - curr.y);
      //       let oldDiff = Math.abs(this.player.coordinate.x - prev.x) + Math.abs(this.player.coordinate.y - prev.y);
      //       return newDiff <= oldDiff ? curr : prev;
      //     })
      //   }
      //   for (let tile of area) {
      //     const idx = coordinateToIndex(tile, this.size);
      //     this.possibleMoves.push(idx);
      //     if (this.tileMap[idx].entity === this.player) {
      //       this.tileMap[idx].color = "red";
      //     } else {
      //       this.tileMap[idx].color = "blue";
      //     }
      //   }
      //   for (let tile of area) {
      //     const idx = coordinateToIndex(tile, this.size);
      //     if (this.tileMap[idx].entity === this.player) {
      //       this.player.health -= move.action.damage;
      //       if (this.player.health > 0) {
      //         const collisionResult = calculateCollisionResult(
      //           entity.coordinate,
      //           this.player.coordinate,
      //         );
      //         this.tileMap[coordinateToIndex(entity.coordinate, this.size)].entity = {};
      //         entity.coordinate = collisionResult;
      //         this.tileMap[coordinateToIndex(collisionResult, this.size)].entity = entity;
      //       }
      //       actionTaken = true;
      //       break;
      //     }
      //   }
      //   if (!actionTaken) {
      //     this.tileMap[coordinateToIndex(entity.coordinate, this.size)].entity = {};
      //     entity.coordinate = closest_tile;
      //     this.tileMap[coordinateToIndex(closest_tile, this.size)].entity = entity;
      //   }
      //   await timeout(400);
      //   this.clearPossiblemoves();
      //   await timeout(100);
      // }
      // this.$emit("endTurn");
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
  mounted() {
    const gameAreaHeight = this.$refs.gameArea.clientHeight;
    const gameAreaWidth = this.$refs.gameArea.clientWidth;
    this.gridSizeBoundary =
      gameAreaHeight > gameAreaWidth
        ? {
            width: "100%",
          }
        : {
            height: "100%",
          };

    for (let entity of this.entities) {
      let idx = coordinateToIndex(entity.coordinate, this.size);
      this.tileMap[idx].entity = entity;
    }
    const idx = coordinateToIndex(this.player.coordinate, this.size);
    this.tileMap[idx].entity = this.player;
  },
};
</script>

<template>
  <div id="game_area" ref="gameArea">
    <div id="game_grid" :style="gridSizeBoundary">
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
