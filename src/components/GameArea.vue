<script lang="ts">
import { coordinateToIndex, timeout } from "../utils/Utils";
import * as move from "../classes/Move";

export default {
  props: {
    level: Object,
    selectedMove: Number,
    isPlayerTurn: Boolean,
  },
  emits: ["endTurn", "entitiesUpdate", "endStage"],
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

        const newMove = this.player.moves[this.selectedMove];

        const area = move.getClickableArea(
          this.level,
          "player",
          this.player.moves[this.selectedMove]
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

          this.level.tileMap[idx].color = tileColorMap[newMove.type][tileType];
          this.possibleMoves.push(idx);
        }
      }
    },
    grid_click(tile) {
      const clickedIndex = coordinateToIndex(tile.coordinate, this.level.size);
      if (this.possibleMoves.includes(clickedIndex)) {
        move.execute(
          this.level,
          "player",
          this.player.moves[this.selectedMove],
          tile.coordinate
        );
        this.clearPossiblemoves();
        this.$emit("endTurn");
      }
    },
    async enemyTurn() {
      let endStage = true;
      for (const index in this.entities) {
        const entity = this.entities[index];
        if (entity.health <= 0 || entity.entityID === "player") {
          continue;
        }
        endStage = false;
        const area = move.getClickableArea(
          this.level,
          entity.entityID,
          entity.moves[0]
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

        move.execute(this.level, entity.entityID, entity.moves[0], nextMove);

        this.clearPossiblemoves();
        await timeout(100);
      }
      endStage ? this.$emit("endStage") : this.$emit("endTurn");
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
        <img
          v-if="tile.entity.sprite"
          :src="`/src/assets/entity-${tile.entity.sprite}.svg`"
          alt="player"
          class="img-tile"
        />
        <div
          class="game_tile-health_bar"
          v-if="tile.entity && tile.entity.name !== 'hero'"
        >
          <span class="game_tile-heart" v-for="health in tile.entity.health">
            1024MB
          </span>
        </div>
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

.img-tile {
  height: 50%;
  width: 50%;
  color: var(--tris-green);
}

#game_grid {
  display: grid;
  aspect-ratio: 1/1;
  grid-template-columns: v-bind(gridStyle);
  grid-template-rows: v-bind(gridStyle);
}

.game_tile {
  font-size: calc(1rem + 1vh);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--tris-green);
  flex-direction: column;
}

.game_tile-health_bar {
  max-width: 100%;
  bottom: calc(0.7rem - 0.5vh);
  position: absolute;
  font-size: calc(1rem + 0.2vw);
}

.blue {
  background-color: #28e47388;
}

.red {
  color: #ff0000;
  background-color: #ff000034;
}

.red > img {
  filter: brightness(0) saturate(100%) invert(15%) sepia(83%) saturate(4404%)
    hue-rotate(358deg) brightness(105%) contrast(127%);
}

.white {
  background-color: var(--tris-black);
}

.grey {
  /* background-color: #565656; */
  background-image: url("../assets/tile-wall.svg");
}
</style>
