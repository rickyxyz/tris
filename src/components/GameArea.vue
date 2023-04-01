<script lang="ts">
export default {
  props: {
    entities: Object,
    selectedMove: Object,
  },
  data() {
    return {
      size: 3,
    };
  },
  computed: {
    coordinates() {
      let coordinates = new Array();
      for (let y = this.size; y > 0; y--) {
        for (let x = 1; x <= this.size; x++) {
          coordinates.push({ x, y });
        }
      }
      return coordinates;
    },
    gridStyle() {
      return `repeat(${this.size}, 1fr)`;
    },
  },
  methods: {
    grid_click(c) {
      let currentPlayerPosition = `tile${this.entities.coordinate.x}${this.entities.coordinate.y}`;
      let clickedLocation = `tile${c.x}${c.y}`;
      if(this.selectedMove.action) {
        this.$refs[currentPlayerPosition][0].innerText = '';
        this.$refs[clickedLocation][0].innerText = this.entities.sprite;
        this.entities.coordinate = c;
      }
      console.log(c);
    },
  },
  watch: {
    selectedMove(newMove) {
      console.log(newMove);
    }
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
        v-for="(coordinate, idx) in this.coordinates"
        :key="idx"
        :ref="`tile${coordinate.x}${coordinate.y}`"
        class="game_tile"
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
  font-size: 2rem;
  border: solid black 1px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
