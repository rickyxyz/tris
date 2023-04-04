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
      player: {
        name: "hero",
        type: "player",
        coordinate: { x: 5, y: 5 },
        sprite: "👑",
      },
      entities: [
        {
          name: "t-rex",
          type: "monster",
          coordinate: { x: 4, y: 4 },
          sprite: "🦖",
          health: 1,
        },
        {
          name: "sauropod",
          type: "monster",
          coordinate: { x: 3, y: 5 },
          sprite: "🦕",
          health: 2,
        },
      ],
      neutral: {
        name: "neutral",
        action: {
          type: "neutral",
          direction: "plus",
          range: 0,
          damage: 0,
        },
      },
      moves: [
        {
          name: "slice",
          action: {
            type: "move",
            direction: "plus",
            range: 2,
            damage: 1,
          },
        },
        {
          name: "rush",
          action: {
            type: "move",
            direction: "cross",
            range: 2,
            damage: 1,
          },
        },
        {
          name: "explode",
          action: {
            type: "move",
            direction: "radius",
            range: 2,
            damage: 1,
          },
        },
        {},
        {},
        {},
      ],
      selectedMove: {} as any,
    };
  },
  methods: {
    selectMove(move) {
      if (move >= 0) {
        if (this.selectedMove === this.moves[move]) {
          this.selectedMove = this.neutral;
        } else {
          this.selectedMove = this.moves[move];
        }
      } else {
        this.selectedMove = this.neutral;
      }
    },
  },
};
</script>

<template>
  <main>
    <div id="menu_bar">Menu Bar</div>
    <div id="status_bar">Status Bar</div>
    <GameArea
      :player="player"
      :entities="entities"
      :action="selectedMove.action"
      @moved="selectMove(-1)"
    ></GameArea>
    <div id="combo_bar">Combo Bar</div>
    <MoveSet
      :moves="moves"
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
