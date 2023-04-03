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
import {calculatePossibleMoves} from '../utils/Utils';

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
      let tiles = new Array();
      for (let y = this.size; y > 0; y--) {
        for (let x = 1; x <= this.size; x++) {
          tiles.push({ x, y, color: "white" });
        }
      }
      return tiles;
    },
    gridStyle() {
      return `repeat(${this.size}, 1fr)`;
    },
  },
  methods: {
    grid_click(c) {
      let currentPlayerPosition = `tile${this.entities.coordinate.x}${this.entities.coordinate.y}`;
      let clickedLocation = `tile${c.x}${c.y}`;
      let clickedIndex = (c.y - this.size) * this.size * -1 + c.x - 1;
      if (this.actions[this.actionIndex].type === "move") {
        if (this.possibleMoves.includes(clickedIndex)) {
          this.$refs[currentPlayerPosition][0].innerText = "";
          this.$refs[clickedLocation][0].innerText = this.entities.sprite;
          this.entities.coordinate = c;
          this.actionIndex++;
        }
      } else if (this.actions[this.actionIndex].type === "attack") {
        if (this.possibleMoves.includes(clickedIndex)) {
          this.$refs[clickedLocation][0].innerText = "⚔️";
          this.actionIndex++;
        }
      }
    },
  },
  watch: {
    "entities.coordinate"() {
      for (let tile of this.possibleMoves) {
        this.tileMap[tile].color = "white";
      }
      this.possibleMoves = [];
    },
    actionIndex() {
      if (this.actionIndex === this.actions.length) {
        this.possibleMoves = [];
        this.$emit("moved", 1);
        this.actionIndex = -1;
      } else {
        const x = this.entities.coordinate.x;
        const y = this.entities.coordinate.y;
        const range = this.actions[this.actionIndex].range;
        if (this.actions[this.actionIndex].type === "move") {
          let area = calculatePossibleMoves({x, y}, 'plus', range);
          for (let tile of area) {
            this.tileMap[
              (tile.y - this.size) * this.size * -1 + tile.x - 1
            ].color = "blue";
            this.possibleMoves.push(
              (tile.y - this.size) * this.size * -1 + tile.x - 1
            );
          }
        } else if (this.actions[this.actionIndex].type === "attack") {
          let area = calculatePossibleMoves({x, y}, 'plus', range);
          for (let tile of area) {
            this.tileMap[
              (tile.y - this.size) * this.size * -1 + tile.x - 1
            ].color = "red";
            this.possibleMoves.push(
              (tile.y - this.size) * this.size * -1 + tile.x - 1
            );
          }
        } else {
          for (let tile of this.possibleMoves) {
            this.tileMap[tile].color = "white";
          }
          this.possibleMoves = [];
        }
      }
    },
    actions() {
      for (let tile of this.possibleMoves) {
        this.tileMap[tile].color = "white";
      }
      this.possibleMoves = [];
      this.actionIndex = -1;
      this.actionIndex++;
    },
  },
  beforeMount() {
    this.tileMap = this.initialTileMap;
  },
  mounted() {
    let identifier = `tile${this.entities.coordinate.x}${this.entities.coordinate.y}`;
    this.$refs[identifier][0].innerText = this.entities.sprite;
  },
};
</script>

<template>
  <div id="game_area">
    <div id="game_grid">
      <div
        v-for="(coordinate, idx) in this.tileMap"
        :key="idx"
        :ref="`tile${coordinate.x}${coordinate.y}`"
        class="game_tile"
        :class="[this.tileMap[idx].color === 'blue' ? 'blue' : '']"
        @click="grid_click(coordinate)"
      ></div>
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
