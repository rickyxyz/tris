<script lang="ts">
export default {
  props: {
    moves: Array,
  },
  emits: ["selectedMove"],
  methods: {
    selectMove(idx) {
      if (this.moves[idx].cooldown < 0 || this.moves[idx].timer <= 0) {
        this.$emit("selectedMove", idx);
      }
    },
  },
};
</script>

<template>
  <div id="move_set">
    <div v-for="(move, idx) in this.moves" :key="idx" @click="selectMove(idx)">
      {{ move.name }} - {{ move.timer }}
    </div>
  </div>
</template>

<style scoped>
div {
  border: solid black 1px;
}

#move_set {
  display: grid;
  grid-auto-flow: column;
  grid-template: repeat(3, 1fr) / repeat(2, 1fr);
}
</style>
