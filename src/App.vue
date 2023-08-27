<script lang="ts">
import GameArea from "./components/GameArea.vue";
import ShopArea from "./components/ShopArea.vue";
import MoveSet from "./components/MoveSet.vue";
import MenuScreen from "./components/MenuScreen.vue";
import Attack from "./data/Attack.js";
import { Level, tileDictionary } from "./data/Level";
import { coordinateToIndex } from "./utils/Utils";

export default {
  components: {
    GameArea,
    MoveSet,
    ShopArea,
    MenuScreen,
  },
  data() {
    return {
      gameMode: "main menu",
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
        sprite: "player",
        health: 10,
        maxHealth: 10,
        heat: 0,
        maxHeat: 20,
        moves: [
          Attack.rush,
          Attack.slice,
          Attack.explode,
          Attack.locked,
          Attack.locked,
        ],
      },
    };
  },
  computed: {
    healthBar() {
      const barLength = Math.ceil(
        (this.player.health / this.player.maxHealth) * 20
      );
      return {
        green: barLength,
        neutral: 20 - barLength,
      };
    },
    heatBar() {
      const barLength = Math.ceil(
        (this.player.heat / this.player.maxHeat) * 20
      );
      const green = Math.min(barLength, 12);
      const yellow = Math.min(barLength - green, 6);
      const red = Math.max(barLength - green - yellow, 0);
      const neutral = 20 - barLength;
      return {
        green,
        yellow,
        red,
        neutral,
      };
    },
  },
  methods: {
    resetGame() {
      this.player.health = 10;
      this.currentStage = Level.level_01;
      this.isSelecting = false;
      this.selectedMoveIndex = -1;
      this.level = this.generateStage(this.player, this.currentStage);
      this.player = this.level.entities.player;
      this.mainArea = "GameArea";
      this.gameMode = "play";
      this.isPlayerTurn = true;
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
      if (this.player.health <= 0) {
        this.gameMode = "game over";
        this.isPlayerTurn = true;
        return;
      }
      this.isPlayerTurn = !this.isPlayerTurn;
      this.selectMove(-1);
      if (this.isPlayerTurn) {
        this.player.heat = Math.max(0, this.player.heat - 5);
      }
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
      this.player.health = this.player.maxHealth;
      this.player.heat = 0;
      this.currentStage = Level[this.level.nextLevel];
      this.isPlayerTurn = true;
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
      this.isSelecting = false;
      this.selectedItem = -1;

      if (shopItem === "exit") {
        this.exitShop();
        return;
      }
      if (shopItem >= 0) {
        this.isSelecting = true;
        this.selectedItem = shopItem;
      }
    },
    generateShopItems() {
      return [Attack.heal, Attack.heatDischarge, Attack.longRush];
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
  <MenuScreen
    :game-mode="gameMode"
    @start="this.gameMode = 'play'"
    @reset="this.resetGame()"
  ></MenuScreen>
  <main :class="[isMobile ? 'mobile_layout' : 'desktop_layout']">
    <div id="menu_bar">Menu Bar</div>
    <div id="status_bar">
      <div class="status_bar__item">
        <span>HEATLH</span>
        [
        <span>
          <span style="color: var(--tris-green)">
            {{ "|".repeat(this.healthBar.green) }}
          </span>
          <span style="color: gray">
            {{ "|".repeat(this.healthBar.neutral) }}
          </span>
        </span>
        {{ this.player.health }}/{{ this.player.maxHealth }} &nbsp;]
      </div>
      <div class="status_bar__item">
        <span>HEAT</span>
        [
        <span>
          <span style="color: var(--tris-green)">
            {{ "|".repeat(this.heatBar.green) }}
          </span>
          <span style="color: yellow">
            {{ "|".repeat(this.heatBar.yellow) }}
          </span>
          <span style="color: #ff0000">
            {{ "|".repeat(this.heatBar.red) }}
          </span>
          <span style="color: gray">
            {{ "|".repeat(this.heatBar.neutral) }}
          </span>
        </span>
        {{ this.player.heat }}/{{ this.player.maxHeat }}&deg;C ]
      </div>
    </div>
    <component
      :is="mainArea"
      :level="level"
      :selectedMove="selectedMoveIndex"
      :isPlayerTurn="isPlayerTurn"
      :shop-items="shopItems"
      @endTurn="switchTurn()"
      @end-stage="switchStage()"
      @selectedShopItem="(shopItem) => selectShopItem(shopItem)"
    ></component>
    <MoveSet
      :moves="this.player.moves"
      :player="player"
      :isPlayerTurn="isPlayerTurn"
      :class="[isMobile ? 'rounded_moveset' : '']"
      :isSelecting="this.isSelecting"
      @selectedMove="(move) => selectMove(move)"
      @endTurn="switchTurn()"
    ></MoveSet>
    <div id="spacer" v-if="isMobile"></div>
  </main>
</template>

<style scoped>
#status_bar {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  background-color: var(--tris-black);
  border: solid 0.1rem var(--tris-green);
  color: var(--tris-green);
  padding: 0.2rem 0.6rem;
}

.status_bar__item {
  height: 100%;
  width: 100%;
  display: flex;
  grid-template-columns: 55px;
  gap: 5px;
}

.status_bar__item > span:first-child {
  width: 50px;
}

:root {
  --real100vh: 100vh;
}

.rounded_moveset {
  border-radius: 0 0 1rem 1rem;
  overflow: hidden;
}

#menu_bar {
  border: solid 1px var(--tris-green);
  padding: 0.2rem 0.6rem;
  text-transform: uppercase;
}

main {
  height: var(--real100vh);
  padding: 0.3rem;
  display: grid;
  gap: 0.2rem;
  overflow: hidden;
  background-color: var(--tris-black);
  color: var(--tris-green);
}

.mobile_layout {
  grid-template-rows: 1fr 2fr 23fr 14fr 1fr;
  grid-template-areas:
    "menu_bar"
    "status_bar"
    "game_area"
    "move_set"
    "spacer";
}

.desktop_layout {
  grid-template-rows: 1fr 2fr 23fr 12fr;
  grid-template-areas:
    "menu_bar"
    "status_bar"
    "game_area"
    "move_set";
}
</style>
