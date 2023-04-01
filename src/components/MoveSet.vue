<script lang="ts">
export default {
  props: {
    selectedMove: Object,
  },
  emits: ['selectedMove'],
  data() {
    return {
      moves: [
        {
          name: "move",
          action: "move",
          range: 1,
        },
        {},
        {},
        {},
        {},
        {},
      ],
    };
  },
  methods: {
    move_click(e) {
      this.$emit('selectedMove', this.moves[0])
    },
  },
};
</script>

<template>
  <div id="move_set">
    <div
      v-for="(move, idx) in this.moves"
      :key="idx"
      :ref="`move${idx}`"
      @click="move_click(idx)"
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
