<!--
  steps:
  1. detect a move has been selected
  2. reset the move counter
  3. determine possible click
  4. fire click event
  5. progress to next action
  6. repeat until finish
  7. if finish emit moved and reset action counter
-->

<script lang="ts">
import { calculatePossibleMoves, coordinateToIndex } from "../utils/Utils";

export default {
  props: {
    entities: Object,
    actions: Array,
  },
  emits: ["moved"],
  data() {
    return {
      size: 5,
      possibleMoves: Array(),
      actionIndex: -1,
      tileMap: Array(),
    };
  },
  computed: {
    initialTileMap() {
      let tiles = {};
      for (let y = this.size; y > 0; y--) {
        for (let x = 1; x <= this.size; x++) {
          tiles[coordinateToIndex(x, y, this.size)] = {
            x,
            y,
            color: "white",
            sprite: "",
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
      const x = this.entities.coordinate.x;
      const y = this.entities.coordinate.y;
      const range = this.actions[this.actionIndex].range;

      if (this.actions[this.actionIndex].type === "move") {
        let area = calculatePossibleMoves({ x, y }, "plus", range);
        for (let tile of area) {
          const idx = coordinateToIndex(tile.x, tile.y, this.size);
          this.tileMap[idx].color = "blue";
          this.possibleMoves.push(idx);
        }
      } else if (this.actions[this.actionIndex].type === "attack") {
        let area = calculatePossibleMoves({ x, y }, "plus", range);
        for (let tile of area) {
          const idx = coordinateToIndex(tile.x, tile.y, this.size);
          this.tileMap[idx].color = "red";
          this.possibleMoves.push(idx);
        }
      }
    },
    grid_click(c) {
      const currentPlayerIndex = coordinateToIndex(
        this.entities.coordinate.x,
        this.entities.coordinate.y,
        this.size
      );
      const clickedIndex = coordinateToIndex(c.x, c.y, this.size);
      if (this.actions[this.actionIndex].type === "move") {
        if (this.possibleMoves.includes(clickedIndex)) {
          this.tileMap[currentPlayerIndex].sprite = "";
          this.tileMap[clickedIndex].sprite = this.entities.sprite;
          this.entities.coordinate = c;
          this.actionIndex++;
          this.clearPossiblemoves();
        }
      } else if (this.actions[this.actionIndex].type === "attack") {
        if (this.possibleMoves.includes(clickedIndex)) {
          this.tileMap[clickedIndex].sprite = "⚔️";
          this.actionIndex++;
          this.clearPossiblemoves();
        }
      }
    },
  },
  watch: {
    actions() {
      this.actionIndex = -1;
      this.actionIndex++;
      this.generateAction();
    },
    actionIndex(oldValue, newValue) {
      if (this.actionIndex >= this.actions.length) {
        this.possibleMoves = [];
        this.$emit("moved", 1);
        this.actionIndex = -1;
      } else {
        this.generateAction()
      }
    },
  },
  beforeMount() {
    this.tileMap = this.initialTileMap;
  },
  mounted() {
    const idx = coordinateToIndex(
      this.entities.coordinate.x,
      this.entities.coordinate.y,
      this.size
    );
    this.tileMap[idx].sprite = this.entities.sprite;
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
        {{ tile.sprite }}
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
  background-color: #2b55fcd8;
}

.red {
  background-color: #ff3628d8;
}
</style>
