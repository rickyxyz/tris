<script lang="ts">
import GameArea from "./components/GameArea.vue";
import MoveSet from "./components/MoveSet.vue";
import Moves from "./Data/Moves.js";

export default {
  components: {
    GameArea,
    MoveSet,
  },
  data() {
    return {
      player: {
        name: "hero",
        type: "player",
        coordinate: { x: 3, y: 3 },
        sprite: "👑",
        health: 3,
        moves: [Moves.rush, Moves.slice, Moves.explode],
      },
      entities: [
        {
          name: "t-rex",
          type: "monster",
          coordinate: { x: 4, y: 4 },
          sprite: "🦖",
          health: 1,
          moves: [Moves.rush]
        },
        {
          name: "sauropod",
          type: "monster",
          coordinate: { x: 3, y: 5 },
          sprite: "🦕",
          health: 2,
          moves: [Moves.slice]
        },
      ],
      selectedMove: {} as any,
      isPlayerTurn: true,
    };
  },
  methods: {
    switchTurn() {
      this.isPlayerTurn = !this.isPlayerTurn;
      this.selectMove(-1);
    },
    selectMove(move) {
      if (move >= 0) {
        if (this.selectedMove === this.player.moves[move]) {
          this.selectedMove = Moves.neutral;
        } else {
          this.selectedMove = this.player.moves[move];
        }
      } else {
        this.selectedMove = Moves.neutral;
      }
    },
  },
};
</script>

<template>
  <main>
    <div id="menu_bar">Menu Bar</div>
    <div id="status_bar">
      Status Bar | HP: {{ this.player.health }} |
      {{ this.isPlayerTurn ? "Player Turn" : "Computer Turn" }}
    </div>
    <GameArea
      :player="player"
      :entities="entities"
      :action="selectedMove.action"
      :isPlayerTurn="isPlayerTurn"
      @endTurn="switchTurn()"
    ></GameArea>
    <div id="combo_bar">Combo Bar</div>
    <MoveSet
      :moves="this.player.moves"
      @selectedMove="(move) => selectMove(move)"
    ></MoveSet>
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
