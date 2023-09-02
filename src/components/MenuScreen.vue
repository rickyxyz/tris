<script lang="ts">
export default {
  props: { gameMode: String },
  emits: ["start", "reset", "restart"],
};
</script>

<template>
  <div class="screen-background">
    <div class="screen-title" v-if="gameMode === 'main menu'">
      <h1>TRIS</h1>
      <h2 @click="this.$emit('start')">PLAY</h2>
    </div>
    <div class="screen-gameover" v-if="gameMode === 'game over'">
      <h1>GAME OVER</h1>
      <h2 @click="this.$emit('reset')">RETRY</h2>
    </div>
    <div class="screen-endgame" v-if="gameMode === 'the end'">
      <h2>YOU HAVE REACHED THE END, THANK YOU FOR PLAYING</h2>
      <h2 @click="this.$emit('restart')">MAIN MENU</h2>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 3rem;
}

.screen-background {
  color: white;
  background-color: black;
  z-index: 2;
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 30vh 2rem 0 2rem;
}

.screen-background > div {
  cursor: default;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5rem;
}

.screen-background > div > h2 {
  cursor: pointer;
}
</style>
