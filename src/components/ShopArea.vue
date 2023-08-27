<script lang="ts">
export default {
  props: ["shopItems"],
  emits: ["selectedShopItem"],
  data() {
    return { selectedItem: -1 };
  },
  methods: {
    selectItem(idx) {
      const newItemIndex = this.selectedItem === idx ? -1 : idx;
      this.selectedItem = newItemIndex;
      this.$emit("selectedShopItem", newItemIndex);
    },
  },
};
</script>

<template>
  <div id="game_area">
    <div
      class="shop_item"
      :class="idx == selectedItem ? 'isActive' : ''"
      v-for="(shopItem, idx) in this.shopItems"
      :key="idx"
      @click="this.selectItem(idx)"
    >
      <div class="shop_item__header">
        <span>{{ shopItem.name ?? idx }}</span>
      </div>
      <div class="shop_item__description">
        {{ shopItem.description }}<br />
        {{
          `${
            shopItem.damage > 0 ? "DAMAGE&nbsp;" : "HEAL&nbsp;&nbsp;&nbsp;"
          }: ${shopItem.damage}`
        }}<br />
        {{ `HEAT&nbsp;&nbsp;&nbsp;: ${shopItem.heat}` }}&deg;C
      </div>
    </div>
    <div class="shop_item__exit" @click="this.selectItem('exit')">EXIT</div>
  </div>
</template>

<style scoped>
#game_area {
  display: grid;
  grid-template-rows: repeat(3, 1fr) 40px;
  gap: 10px;
  padding: 15px 15px;
  max-height: 100%;
  overflow: hidden;
}

.isActive {
  background-color: var(--tris-green);
  color: var(--tris-black);
}

.shop_item {
  border: 1px solid var(--tris-green);
  padding: 5px 12px;
}

.shop_item__header {
  border-bottom: 1px solid var(--tris-green);
  text-transform: uppercase;
  align-items: center;
}

.shop_item__description {
  text-align: justify;
  height: 6rem;
  overflow: hidden;
}

.shop_item__exit {
  border: 1px solid var(--tris-green);
  width: 60px;
  text-align: center;
  justify-self: right;
}
</style>
