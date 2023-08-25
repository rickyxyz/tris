<script lang="ts">
export default {
  props: {
    isSelecting: Boolean,
    player: Object,
    isPlayerTurn: Boolean,
  },
  emits: ["selectedMove", "endTurn"],
  data() {
    return {
      isActive: -1,
    };
  },
  computed: {
    moves() {
      const { heat, maxHeat, health } = this.player;
      const availableMoves = this.player.moves.map((move) => {
        return {
          ...move,
          isUsable: heat + move.heat <= maxHeat && health - move.damage > 0,
        };
      });
      if (availableMoves.every((move) => !move.isUsable)) {
        this.$emit("endTurn");
      }
      return availableMoves;
    },
  },
  methods: {
    selectMove(idx) {
      this.isActive = this.isActive === idx ? -1 : idx;
      if (this.moves[idx].isUsable) {
        this.$emit("selectedMove", idx);
      }
    },
  },
  watch: {
    isPlayerTurn() {
      if (!this.isPlayerTurn) {
        this.isActive = -1;
      }
    },
  },
};
</script>

<template>
  <div id="move_set" :class="{ isShopping: isSelecting }">
    <div class="move_set__header move_set__layout">
      <span>MOVE</span><span>health</span><span>HEAT</span>
    </div>
    <div
      v-for="(move, idx) in this.moves"
      :key="idx"
      @click="selectMove(idx)"
      class="move_set__layout"
      :class="
        move.isUsable ? (idx === this.isActive ? 'isActive' : 'green') : 'red'
      "
    >
      <span>{{ move.name }}</span>
      <span>-{{ move.damage }}</span>
      <span>+{{ move.heat }}&deg;C</span>
    </div>
  </div>
</template>

<style scoped>
.isActive {
  background-color: var(--tris-green);
  color: var(--tris-black);
}

.green {
  color: var(--tris-green);
}

.red {
  color: red;
}

#move_set {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(6, 1fr);
  gap: 0.2rem;
}

.isShopping {
  outline: solid 1px var(--tris-green);
}

.move_set__layout {
  display: grid;
  grid-template-columns: auto 90px 90px;
  align-items: center;
  gap: 1.5rem;
  padding: 0.2rem 0.6rem;
  text-transform: uppercase;
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
