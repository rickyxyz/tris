<script lang="ts">
import GameArea from "./components/GameArea.vue";
import MoveSet from "./components/MoveSet.vue";
import Entity from "./classes/Entity";

export default {
  components: {
    GameArea,
    MoveSet,
    Entity,
  },
  data() {
    return {
      player: Entity(),
      selectedMove: {},
    };
  },
  methods: {
    selectMove(move) {
      this.selectedMove = move;
    },
  },
};
</script>

<template>
  <main>
    <div id="menu_bar">Menu Bar</div>
    <div id="status_bar">Status Bar</div>
    <GameArea :entities="player" :selectedMove="selectedMove"></GameArea>
    <div id="combo_bar">Combo Bar</div>
    <MoveSet @selectedMove="(move) => selectMove(move)"></MoveSet>
  </main>
</template>

<style scoped>
div {
  border: solid black 1px;
}

main {
  max-height: 100vh;
  display: grid;
  grid-template-rows: 1fr 2fr 23fr 1fr 12fr;
  grid-template-areas:
    "menu_bar"
    "status_bar"
    "game_area"
    "combo_bar"
    "move_set";
  padding: 0.3rem;
  gap: 0.2rem;
}

@media (min-width: 1024px) {
}
</style>
