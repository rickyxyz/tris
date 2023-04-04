<script lang="ts">
import {
  calculatePossibleMoves,
  coordinateToIndex,
  calculateCollisionResult,
  timeout,
} from "../utils/Utils";

export default {
  props: {
    player: Object,
    entities: Array,
    action: Object,
    isPlayerTurn: Boolean,
  },
  emits: ["endTurn"],
  data() {
    return {
      size: 5,
      possibleMoves: Array(),
      tileMap: Array(),
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
      // console.log("generate action");
      let area = calculatePossibleMoves(
        this.player.coordinate,
        this.action.direction,
        this.action.range,
        this.size
      );
      if (this.action.type === "move") {
        for (let tile of area) {
          const idx = coordinateToIndex(tile, this.size);
          if (this.tileMap[idx].entity.type === "monster") {
            this.tileMap[idx].color = "red";
          } else {
            this.tileMap[idx].color = "blue";
          }
          this.possibleMoves.push(idx);
        }
      } else if (this.action.type === "collateral") {
        for (let tile of area) {
          const idx = coordinateToIndex(tile, this.size);
          this.tileMap[idx].color = "red";
          this.possibleMoves.push(idx);
        }
      }
    },
    grid_click(tile) {
      // console.log("grid click");
      const currentPlayerIndex = coordinateToIndex(
        this.player.coordinate,
        this.size
      );
      const clickedIndex = coordinateToIndex(tile.coordinate, this.size);
      if (this.action.type === "move") {
        if (this.possibleMoves.includes(clickedIndex)) {
          this.tileMap[currentPlayerIndex].entity = {};
          if (this.tileMap[clickedIndex].entity) {
            this.tileMap[clickedIndex].entity.health -= this.action.damage;
          }
          if (this.tileMap[clickedIndex].entity.health > 0) {
            const collisionResult = calculateCollisionResult(
              this.player.coordinate,
              tile.coordinate
            );
            this.tileMap[coordinateToIndex(collisionResult, this.size)].entity =
              this.player;
            this.player.coordinate = collisionResult;
          } else {
            this.tileMap[clickedIndex].entity = this.player;
            this.player.coordinate = tile.coordinate;
          }
          this.clearPossiblemoves();
          this.$emit("endTurn");
        }
      } else if (this.action.type === "collateral") {
        if (this.possibleMoves.includes(clickedIndex)) {
          this.player.health -= this.action.damage;
          for (let tile of this.possibleMoves) {
            if (this.tileMap[tile].entity) {
              this.tileMap[tile].entity.health -= this.action.damage;
            }
            if (this.tileMap[tile].entity.health <= 0) {
              this.tileMap[tile].entity = {};
            }
          }
          this.clearPossiblemoves();
          this.$emit("endTurn");
        }
      }
    },
    async enemyTurn() {
      let o = 1;

      for (let entity of this.entities) {
        let move = entity.moves[0];

        let area = calculatePossibleMoves(
          entity.coordinate,
          move.action.direction,
          move.action.range,
          this.size
        );

        for (let tile of area) {
          const idx = coordinateToIndex(tile, this.size);
          this.tileMap[idx].color = "blue";
          this.possibleMoves.push(idx);
        }
        await timeout(500);
        this.clearPossiblemoves();
        await timeout(100);
      }
      this.$emit("endTurn");
    },
  },
  watch: {
    action() {
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
  <div id="game_area">
    <div id="game_grid">
      <div
        v-for="(tile, idx) in this.tileMap"
        :key="idx"
        class="game_tile"
        :class="[tile.color]"
        @click="grid_click(tile)"
      >
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
  width: 100%;
  aspect-ratio: 1/1;
  grid-template-columns: v-bind(gridStyle);
  grid-template-rows: v-bind(gridStyle);
}

.game_tile {
  font-size: 1rem;
  border: solid black 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.blue {
  background-color: #2a6aff88;
}

.red {
  background-color: #ff362888;
}
</style>
