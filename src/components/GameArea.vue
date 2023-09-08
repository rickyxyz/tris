<script lang="ts">
import { coordinateToIndex, timeout } from "../utils/Utils";
import * as move from "../classes/Move";

export default {
  props: {
    level: Object,
    selectedMove: Number,
    isPlayerTurn: Boolean,
    tutorialTooltip: Number,
  },
  emits: [
    "endTurn",
    "entitiesUpdate",
    "endStage",
    "resetStage",
    "button_click",
  ],
  data() {
    return {
      isInTransition: false,
      transitionType: "",
      possibleMoves: Array(),
      isGridHeightBound: true,
      animationDistanceX: 0,
      animationDistanceY: 0,
      transition: {
        stageClear: {
          header: "Stage Clear",
          button: "Next Stage",
          emit: "endStage",
        },
        stageFail: {
          header: "Stage Failed",
          button: "Restart",
          emit: "resetStage",
        },
        gameClear: {
          header: "You cleared the game",
          button: "Restart",
          emit: "resetStage",
        },
      },
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
          self: {
            self: "blue",
            empty: "white",
            enemy: "white",
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
    async grid_click(tile) {
      const clickedIndex = coordinateToIndex(tile.coordinate, this.level.size);
      const playerIndex = coordinateToIndex(
        this.player.coordinate,
        this.level.size
      );

      const dx = this.player.coordinate.x - tile.coordinate.x;
      const dy = this.player.coordinate.y - tile.coordinate.y;

      if (this.possibleMoves.includes(clickedIndex)) {
        if (
          tile.entity &&
          tile.entity.health > this.player.moves[this.selectedMove].damage
        ) {
          this.animationDistanceX = `${dx * -100 - Math.sign(dx) * 50}%`;
          this.animationDistanceY = `${dy * 100 + Math.sign(dy) * 50}%`;
        } else {
          this.animationDistanceX = `${dx * -110 - Math.sign(dx) * 120}%`;
          this.animationDistanceY = `${dy * 105 + Math.sign(dy) * 120}%`;
        }
        this.level.tileMap[playerIndex].animation = "animatedMove";
        await timeout(250);
        move.execute(
          this.level,
          "player",
          this.player.moves[this.selectedMove],
          tile.coordinate
        );
        this.level.tileMap[playerIndex].animation = "";
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
      await timeout(200);
      if (endStage) {
        this.isInTransition = true;
        this.transitionType =
          this.level.nextLevel === "the_end" ? "gameClear" : "stageClear";
      } else {
        this.$emit("endTurn");
      }
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
      if (this.player.health <= 0) {
        this.isInTransition = true;
        this.transitionType = "stageFail";
        this.isPlayerTurn = true;
        return;
      }
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
    <Transition>
      <div class="stage_transition" v-if="isInTransition">
        <p>{{ this.transition[this.transitionType].header }}</p>
        <button
          class="stage_transition__button"
          @click="
            () => {
              this.isInTransition = false;
              this.$emit(this.transition[this.transitionType].emit);
            }
          "
        >
          {{ this.transition[this.transitionType].button }}
        </button>
      </div>
    </Transition>
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
        <Tooltip
          class="tooltip_wrapper"
          position="top"
          :is-visible="tutorialTooltip === 1 && tile.entity.name === 'hero'"
          @button_click="this.$emit('button_click')"
        >
          <template #tooltip>{{ this.$TEXT.tooltip_player }}</template>
          <template #content>
            <img
              v-if="tile.entity.sprite"
              :src="`/tris/entity-${tile.entity.sprite}.svg`"
              alt="player"
              class="img-tile animated"
              :class="tile.animation"
            />
            <div
              class="game_tile-health_bar"
              v-if="tile.entity && tile.entity.name !== 'hero'"
            >
              <span class="game_tile-heart" v-if="tile.entity.health">
                [{{ tile.entity.health }} / {{ tile.entity.maxHealth }}]
              </span>
            </div>
          </template>
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.stage_transition {
  text-transform: uppercase;
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  border: solid 1px var(--tris-green);
  background-color: var(--tris-black);
  font-size: 2rem;
}

.stage_transition__button {
  text-transform: uppercase;
  font-size: 1.5rem;
  padding: 5px 10px;
}

.stage_transition__button:hover {
  color: var(--tris-black);
  background-color: var(--tris-green);
}

@keyframes animationMove {
  from {
    transform: translate(0, 0);
    z-index: 1;
  }
  to {
    transform: translate(
      v-bind(animationDistanceX),
      v-bind(animationDistanceY)
    );
    z-index: 1;
  }
}

.animatedMove {
  animation: 0.3s 1 normal animationMove;
}

#game_area {
  position: relative;
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
  bottom: calc(0.2rem - 0.5vh);
  position: absolute;
  font-size: min(1.5rem, 3.5vw);
}

.tooltip_wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.blue {
  background-color: #28e47388;
}

.blue:hover {
  background-color: #28e473d4;
}

.red:hover {
  color: #ff0000;
  background-color: #ff0000aa;
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
  background-size: cover;
}
</style>
