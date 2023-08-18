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
    ShopArea,
  },
  data() {
    return {
      gameMode: "play",
      stageNumber: 2,
      shopLeft: 1,
      shopItems: [],
      isSelecting: false,
      selectedItem: null,
      isMobile: false,
      currentStage: Level.level_01,
      playerData: {
        name: "hero",
        type: "player",
        sprite: "👑",
        health: 5,
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
      this.gameMode;
      return Stage(this.playerData, this.currentStage);
    },
    player() {
      return this.level.entities.player;
    },
  },
  watch: {},
  methods: {
    resetStage() {
      this.playerData.health = 1;
      this.gameMode = "play";
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
      if (this.isPlayerTurn)
        for (const move of this.player.moves) {
          if (move.timer > 0) move.timer--;
        }
      this.selectMove(-1);
      if (this.player.health <= 0) this.gameMode = "game over";
    },
    switchStage() {
      this.playerData.health = this.level.entities.player.health;
      this.playerData.moves = this.level.entities.player.moves;
      this.currentStage = Level[this.level.nextLevel];
      this.isPlayerTurn = !this.isPlayerTurn;
      this.selectMove(-1);
      this.stageNumber++;
      if (this.stageNumber % 3 === 0) this.gameMode = "shop";
    },
    selectMove(move) {
      if (move === this.selectedMoveIndex) {
        move = -1;
      }
      this.selectedMoveIndex = move;
    },
    exitShop() {
      this.isSelecting = false;
      this.selectedItem = null;
      this.shopItems = [];
      this.gameMode = "play";
      this.currentStage = Level.level_02;
      this.shopLeft = 3;
    },
    selectShopItem(shopItem) {
      this.isSelecting = true;
      this.selectedItem = shopItem;
      if (shopItem === 9) {
        this.exitShop();
      }
    },
    changeMove(move) {
      this.player.moves[move] = this.shopItems[this.selectedItem];
      this.shopItems[this.selectedItem] = {};
      this.selectedItem = null;
      this.isSelecting = false;
      this.shopLeft--;
      if (this.shopLeft < 1) {
        this.exitShop();
      }
    },
    generateShopItems() {
      return [
        Attack.longRush,
        Attack.longSlice,
        Attack.smallExplode,
        4,
        5,
        6,
        7,
        8,
        9,
        {
          name: "exit",
        },
      ];
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
  <div
    class="screen-background"
    v-if="gameMode !== 'play' && gameMode !== 'shop'"
  >
    <div class="screen-title" v-if="gameMode === 'main menu'">
      <h1>TITLE</h1>
      <h2 @click="this.gameMode = 'play'">Start</h2>
    </div>
    <div class="screen-gameover" v-if="gameMode === 'game over'">
      <h1>GAME OVER</h1>
      <h2 @click="this.resetStage">RETRY</h2>
    </div>
  </div>
  <main :class="[isMobile ? 'mobile_layout' : 'desktop_layout']">
    <div id="menu_bar">Menu Bar</div>
    <div id="status_bar">
      Status Bar | HP: {{ this.player.health }} |
      {{ this.isPlayerTurn ? "Player Turn" : "Computer Turn" }}
    </div>
    <ShopArea
      v-if="gameMode === 'shop'"
      @selectedShopItem="(shopItem) => selectShopItem(shopItem)"
      :shop-items="shopItems"
    ></ShopArea>
    <GameArea
      v-else-if="gameMode === 'play'"
      :level="level"
      :selectedMove="selectedMoveIndex"
      :isPlayerTurn="isPlayerTurn"
      @endTurn="switchTurn()"
      @end-stage="switchStage()"
    ></GameArea>
    <div id="combo_bar">Combo Bar</div>
    <MoveSet
      :moves="this.player.moves"
      @selectedMove="
        (move) => (isSelecting ? changeMove(move) : selectMove(move))
      "
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
