<script lang="ts">
import GameArea from "./components/GameArea.vue";
import MoveSet from "./components/MoveSet.vue";
import Attack from "./data/Attack.js";
import Entity from "./classes/Entity";
import Enemy from "./data/Enemy.js";

export default {
  components: {
    GameArea,
    MoveSet,
  },
  data() {
    return {
      // gameMode: "main menu",
      gameMode: "play",
      player: Entity({
        name: "hero",
        type: "player",
        coordinate: { x: 3, y: 3 },
        sprite: "👑",
        health: 3,
        moves: [Attack.rush, Attack.slice, Attack.explode],
      }),
      entities: [
        Entity({ ...Enemy.sauropod, coordinate: { x: 3, y: 5 } }),
        Entity({ ...Enemy.t_rex, coordinate: { x: 4, y: 4 } }),
      ],
      selectedMoveIndex: -1,
      isPlayerTurn: true,
    };
  },
  methods: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
    switchTurn() {
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
  mounted() {
    let value = "100vh";
    if (window.innerWidth && window.innerWidth <= 1024) {
      value = `${window.innerHeight}px`;
    }
    document.documentElement.style.setProperty("--real100vh", value);

    this.selectedMove = Attack.neutral;
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
  <main :class="[isMobile() ? 'mobile_layout' : 'desktop_layout']">
    <div id="menu_bar">Menu Bar</div>
    <div id="status_bar">
      Status Bar | HP: {{ this.player.health }} |
      {{ this.isPlayerTurn ? "Player Turn" : "Computer Turn" }}
    </div>
    <GameArea
      :player="player"
      :entities="entities"
      :selectedMove="selectedMoveIndex"
      :isPlayerTurn="isPlayerTurn"
      @endTurn="switchTurn()"
    ></GameArea>
    <div id="combo_bar">Combo Bar</div>
    <MoveSet
      :moves="this.player.moves"
      @selectedMove="(move) => selectMove(move)"
      :class="[isMobile() ? 'rounded_moveset' : '']"
    ></MoveSet>
    <div id="spacer" v-if="isMobile()"></div>
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
