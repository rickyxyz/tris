<script lang="ts">
import GameArea from "./components/GameArea.vue";
import MoveSet from "./components/MoveSet.vue";

export default {
  components: {
    GameArea,
    MoveSet,
  },
  data() {
    return {
      player: { coordinate: { x: 3, y: 3 }, sprite: "👑" },
      moves: [
        {
          name: 'slice',
          actions: [
            {
              type: 'move',
              direction: 'radius',
              range: 1
            },
            {
              type: 'attack',
              direction: 'one_direction',
              range: 1
            }
          ],
        },
        {
          name: 'neutral',
          actions: [
            {
              type: 'neutral'
            }
          ],
        },
        {},
        {},
        {},
        {},
      ],
      selectedMove: {} as any,
    };
  },
  methods: {
    selectMove(move) {
      this.selectedMove = this.moves[move];
    },
  },
};
</script>

<template>
  <main>
    <div id="menu_bar">Menu Bar</div>
    <div id="status_bar">Status Bar</div>
    <GameArea :entities="player" :actions="selectedMove.actions" @moved="(idx)=>selectMove(idx)"></GameArea>
    <div id="combo_bar">Combo Bar</div>
    <MoveSet :moves="moves" @selectedMove="(move) => selectMove(move)"></MoveSet>
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
