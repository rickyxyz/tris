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
    <div class="move_set__header move_set__layout">
      <span>MOVE</span><span>MEMORY</span><span>HEAT</span>
    </div>
    <div
      v-for="(move, idx) in this.moves"
      :key="idx"
      @click="selectMove(idx)"
      class="move_set__layout"
    >
      <span>{{ move.name }}</span>
      <span>{{ move.timer }}</span>
      <span>+10%</span>
    </div>
  </div>
</template>

<style scoped>
#move_set {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(6, 1fr);
  gap: 0.2rem;
}

.move_set__layout {
  display: grid;
  grid-template-columns: auto 90px 90px;
  align-items: center;
  gap: 1.5rem;
  padding: 0.2rem 0.6rem;
}

.move_set__layout > span {
  height: min-content;
}

.move_set__header {
  background-color: var(--tris-green);
  color: var(--tris-black);
}

.move_set__item {
  background-color: var(--tris-black);
  color: var(--tris-green);
}
</style>
