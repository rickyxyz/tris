<script lang="ts">
import { coordinateToIndex, timeout } from "../utils/Utils";
import * as move from "../classes/Move";

export default {
  props: {
    level: Object,
    selectedMove: Number,
    isPlayerTurn: Boolean,
  },
  emits: ["endTurn", "entitiesUpdate"],
  data() {
    return {
      possibleMoves: Array(),
      isGridHeightBound: true,
    };
  },
  computed: {
    player() {
      return this.level.entities.player;
    },
    entities() {
      return this.level.entities;
    },
    gridStyle() {
      return `repeat(${this.level.size}, 1fr)`;
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
        this.level.tileMap[tile].color = "white";
      }
      this.possibleMoves = [];
    },
    generateAction() {
      if (this.selectedMove === -1) {
        this.clearPossiblemoves();
      } else {
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

        const newMove = this.player.moveSet[this.selectedMove];

        const area = move.getClickableArea(
          this.player,
          this.level.tileMap,
          this.level.size,
          this.player.moveSet[this.selectedMove]
        );

        for (let tile of area) {
          const idx = coordinateToIndex(tile, this.level.size);

          let tileType = "empty";
          switch (this.level.tileMap[idx].entity.type) {
            case "enemy":
              tileType = "enemy";
              break;
            case "player":
              tileType = "self";
              break;
          }

          this.level.tileMap[idx].color =
            tileColorMap[newMove.action.type][tileType];
          this.possibleMoves.push(idx);
        }
      }
    },
    grid_click(tile) {
      const clickedIndex = coordinateToIndex(tile.coordinate, this.level.size);
      if (this.possibleMoves.includes(clickedIndex)) {
        move.execute(
          this.level.tileMap,
          this.player,
          tile,
          this.player.moveSet[this.selectedMove]
        );

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
        const area = move.getClickableArea(
          entity,
          this.level.tileMap,
          this.level.size,
          entity.moveSet[0]
        );
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
          const idx = coordinateToIndex(tile, this.level.size);
          this.possibleMoves.push(idx);
          if (this.level.tileMap[idx].entity === this.player) {
            this.level.tileMap[idx].color = "red";
            nextMove = tile;
          } else {
            this.level.tileMap[idx].color = "blue";
          }
        }
        await timeout(400);

        move.execute(
          this.level.tileMap,
          entity,
          this.level.tileMap[coordinateToIndex(nextMove, this.level.size)],
          entity.moveSet[0]
        );

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
  created() {
    window.addEventListener("resize", this.calculategridSizeBoundary);
  },
  mounted() {
    this.calculategridSizeBoundary();
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
        v-for="(tile, idx) in this.level.tileMap"
        :key="idx"
        class="game_tile"
        :class="[tile.color]"
        @click="grid_click(tile)"
      >
        <div class="game_tile-health_bar" v-if="tile.entity">
          <span class="game_tile-heart" v-for="health in tile.entity.health">
            ❤️
          </span>
        </div>
        {{ tile.entity ? tile.entity.sprite : "" }}
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

.white {
  background-color: #ffffff;
}

.grey {
  background-color: #565656;
}
</style>
