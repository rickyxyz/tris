<script lang="ts">
export default {
  props: {
    moves: Array
  },
  emits: ['selectedMove'],
};
</script>

<template>
  <div id="move_set">
    <div
      v-for="(move, idx) in this.moves"
      :key="idx"
      @click="this.$emit('selectedMove', idx)"
    >
      {{ move.name }}
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
