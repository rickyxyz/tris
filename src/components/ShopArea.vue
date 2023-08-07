<script lang="ts">
export default {
  props: ["shopItems"],
  emits: ["selectedShopItem"],
};
</script>

<template>
  <div id="game_area">
    <div
      class="shop_item"
      v-for="(shopItem, idx) in this.shopItems"
      :key="idx"
      @click="this.$emit('selectedShopItem', idx)"
    >
      {{ shopItem.name ?? idx }}
    </div>
  </div>
</template>

<style scoped>
#game_area {
  display: grid;
  grid-template: repeat(5, 1fr) / repeat(2, 1fr);
}

.shop_item {
  border: 1px solid black;
}
</style>
