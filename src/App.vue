<script lang="ts">
import GameArea from "./components/GameArea.vue";
import ShopArea from "./components/ShopArea.vue";
import MoveSet from "./components/MoveSet.vue";
import Attack from "./data/Attack.js";
import Stage from "./classes/Stage";
import { Level } from "./data/Level";

export default {
  components: {
    GameArea,
    MoveSet,
  },
  data() {
    return {
      stageNumber: 1,
      isMobile: false,
      gameMode: "play",
      currentStage: Level.level_01,
      playerData: {
        name: "hero",
        type: "player",
        coordinate: { x: 2, y: 2 },
        sprite: "👑",
        health: 3,
        moves: [
          Attack.rush,
          Attack.slice,
          Attack.explode,
          Attack.locked,
          Attack.locked,
          Attack.locked,
        ],
      },
      selectedMoveIndex: -1,
      isPlayerTurn: true,
    };
  },
  computed: {
    level() {
      return Stage(this.playerData, this.currentStage);
    },
    player() {
      return this.level.entities.player;
    },
  },
  methods: {
    resetStage() {
      this.level = this.level.reset();
    },
    determineDeviceType() {
      let value = "100vh";
      if (window.innerWidth && window.innerWidth <= 1100) {
        value = `${window.innerHeight}px`;
      }
      document.documentElement.style.setProperty("--real100vh", value);

      this.isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) ||
        (window.innerHeight > window.innerWidth &&
          Math.abs(window.innerHeight - window.innerWidth) > 300);
    },
    switchTurn() {
      this.isPlayerTurn = !this.isPlayerTurn;
      this.selectMove(-1);
    },
    switchStage() {
      this.currentStage = Level[this.level.nextLevel];
      this.isPlayerTurn = !this.isPlayerTurn;
      this.selectMove(-1);
    },
    selectMove(move) {
      if (move === this.selectedMoveIndex) {
        move = -1;
      }
      this.selectedMoveIndex = move;
    },
  },
  watch: {
    player: {
      handler() {
        if (this.player.health <= 0) {
          this.gameMode = "game over";
        }
      },
      deep: true,
    },
  },
  created() {
    window.addEventListener("resize", this.determineDeviceType);
  },
  mounted() {
    this.determineDeviceType();
    this.shopItems = this.generateShopItems();
  },
  destroyed() {
    window.removeEventListener("resize", this.determineDeviceType);
  },
};
</script>

<template>
  <div class="screen-background" v-if="gameMode !== 'play'">
    <div class="screen-title" v-if="gameMode === 'main menu'">
      <h1>TITLE</h1>
      <h2 @click="this.gameMode = 'play'">Start</h2>
    </div>
    <div class="screen-gameover" v-if="gameMode === 'game over'">
      <h1>GAME OVER</h1>
      <h2 @click="this.gameMode = 'play'">RETRY</h2>
    </div>
  </div>
  <main :class="[isMobile ? 'mobile_layout' : 'desktop_layout']">
    <div id="menu_bar">Menu Bar</div>
    <div id="status_bar">
      Status Bar | HP: {{ this.player.health }} |
      {{ this.isPlayerTurn ? "Player Turn" : "Computer Turn" }}
    </div>
    <GameArea
      :level="level"
      :selectedMove="selectedMoveIndex"
      :isPlayerTurn="isPlayerTurn"
      @endTurn="switchTurn()"
      @end-stage="switchStage()"
    ></GameArea>
    <div id="combo_bar">Combo Bar</div>
    <MoveSet
      :moves="this.player.moveSet"
      @selectedMove="(move) => selectMove(move)"
      :class="[isMobile ? 'rounded_moveset' : '']"
    ></MoveSet>
    <div id="spacer" v-if="isMobile"></div>
  </main>
</template>

<style scoped>
.screen-background {
  color: white;
  background-color: black;
  z-index: 2;
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 30vh;
}

.screen-background > div {
  cursor: default;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5rem;
}

.screen-background > div > h2 {
  cursor: pointer;
}

:root {
  --real100vh: 100vh;
}

div {
  border: solid black 1px;
}

#spacer {
  border: none;
}

.rounded_moveset {
  border-radius: 0 0 1rem 1rem;
  overflow: hidden;
}

main {
  height: var(--real100vh);
  overflow: hidden;
  color: black;
  display: grid;
  padding: 0.3rem;
  gap: 0.2rem;
  background-color: white;
}

.mobile_layout {
  grid-template-rows: 1fr 2fr 23fr 1fr 12fr 1fr;
  grid-template-areas:
    "menu_bar"
    "status_bar"
    "game_area"
    "combo_bar"
    "move_set"
    "spacer";
}

.desktop_layout {
  grid-template-rows: 1fr 2fr 23fr 1fr 12fr;
  grid-template-areas:
    "menu_bar"
    "status_bar"
    "game_area"
    "combo_bar"
    "move_set";
}

@media (min-width: 1024px) {
}
</style>
