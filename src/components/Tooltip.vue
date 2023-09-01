<script lang="ts">
export default {
  props: {
    tooltip_text: String,
    position: String,
    isVisible: Boolean,
  },
  emits: ["button_click"],
};
</script>
<template>
  <div class="tooltip-wrapper">
    <slot name="content"> </slot>
    <span class="tooltip" :class="position" v-if="isVisible">
      <slot name="tooltip"></slot>
      <button class="tooltip_button" @click="this.$emit('button_click')">
        <ion-icon name="play-sharp"></ion-icon>
      </button>
    </span>
  </div>
</template>
<style scoped>
.tooltip-wrapper {
  position: relative;
}
.tooltip {
  position: absolute;
  text-align: justify;
  z-index: 1;
  background-color: white;
  color: black;
  border: none;
  border-radius: 10px;
  padding: 0.3rem 1rem 0.6rem 1rem;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.tooltip-wrapper:hover .tooltip {
  opacity: 1;
}
.tooltip_button {
  font-weight: 900;
  border-radius: 100%;
  aspect-ratio: 1/1;
  min-width: 30px;
  border: none;
  padding-left: 3px;
  padding-top: 4px;
}
.bottom {
  top: 100%;
  right: 50%;
  transform: translate(50%);
}
.bottom:after {
  content: "";
  position: absolute;
  background-color: white;
  width: 15px;
  height: 15px;
  left: 50%;
  bottom: 100%;
  transform: translate(-50%, 50%) rotate(45deg);
}

.top {
  bottom: 100%;
  right: 50%;
  transform: translate(50%);
}
.top:after {
  content: "";
  position: absolute;
  background-color: white;
  width: 15px;
  height: 15px;
  left: 50%;
  top: 100%;
  transform: translate(-50%, -50%) rotate(45deg);
}
</style>
