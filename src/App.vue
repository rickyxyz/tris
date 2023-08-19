<script lang="ts">
import GameArea from "./components/GameArea.vue";
import ShopArea from "./components/ShopArea.vue";
import MoveSet from "./components/MoveSet.vue";
import Attack from "./data/Attack.js";
import { Level, tileDictionary } from "./data/Level";
import { coordinateToIndex } from "./utils/Utils";

export default {
  components: {
    GameArea,
    MoveSet,
    ShopArea,
  },
  data() {
    return {
      gameMode: "play",
      mainArea: "GameArea",
      stageNumber: 2,
      shopLeft: 1,
      shopItems: [],
      isSelecting: false,
      selectedItem: null,
      isMobile: false,
      currentStage: Level.level_01,
      selectedMoveIndex: -1,
      isPlayerTurn: true,
      level: {},
      player: {
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
    };
  },
  methods: {
    resetStage() {
      this.player.health = 1;
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
    generateStage(player, level) {
      let entityCounter = 0;
      const tileMap = {};

      const allEntities = [{ ...player, coordinate: level.spawnPoint }];
      allEntities.push(
        ...level.entities.map((entity) => ({
          ...entity.entity,
          coordinate: entity.spawnPoint,
        }))
      );

      const entities = allEntities.reduce((accum, curr) => {
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

      for (let y = level.size; y > 0; y--) {
        for (let x = 1; x <= level.size; x++) {
          const tileType = level.map[coordinateToIndex({ x, y }, level.size)];
          tileMap[coordinateToIndex({ x, y }, level.size)] = {
            coordinate: { x, y },
            color: tileDictionary[tileType].color,
            isOccupiable: tileDictionary[tileType].isOccupiable,
            entity: {},
          };
        }
      }

      for (const entityID in entities) {
        if (Object.hasOwnProperty.call(entities, entityID)) {
          const entity = entities[entityID];
          tileMap[coordinateToIndex(entity.coordinate, level.size)].entity =
            entity;
        }
      }
      return {
        tileMap,
        entities,
        name: level.stageName,
        size: level.size,
        nextLevel: level.nextLevel,
      };
    },
    switchStage() {
      this.currentStage = Level[this.level.nextLevel];
      this.isPlayerTurn = true;
      for (const move of this.player.moves) {
        move.timer = 0;
      }
      this.level = this.generateStage(this.player, this.currentStage);
      this.selectMove(-1);
      this.stageNumber++;
      if (this.stageNumber % 3 === 0) {
        this.mainArea = "shopArea";
        this.gameMode = "shop";
      }
    },
    selectMove(move) {
      if (this.isSelecting) {
        this.player.moves[move] = this.shopItems[this.selectedItem];
        this.shopItems[this.selectedItem] = {};
        this.selectedItem = null;
        this.isSelecting = false;
        this.shopLeft--;
        if (this.shopLeft < 1) {
          this.exitShop();
        }
      } else {
        if (move === this.selectedMoveIndex) {
          move = -1;
        }
        this.selectedMoveIndex = move;
      }
    },
    exitShop() {
      this.isSelecting = false;
      this.selectedItem = null;
      this.shopItems = [];
      this.mainArea = "gameArea";
      this.gameMode = "play";
      this.shopLeft = 3;
    },
    selectShopItem(shopItem) {
      this.isSelecting = true;
      this.selectedItem = shopItem;
      if (shopItem === 9) {
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
    this.level = this.generateStage(this.player, this.currentStage);
    this.player = this.level.entities.player;
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
    <component
      :is="mainArea"
      :level="level"
      :selectedMove="selectedMoveIndex"
      :isPlayerTurn="isPlayerTurn"
      @endTurn="switchTurn()"
      @end-stage="switchStage()"
      @selectedShopItem="(shopItem) => selectShopItem(shopItem)"
      :shop-items="shopItems"
    ></component>
    <div id="combo_bar">Combo Bar</div>
    <MoveSet
      :moves="this.player.moves"
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
</style>
