<script setup lang="ts">
interface Props {
  icon?: string
  iconSize?: string
  color?: string | 'error'
  zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  icon: "mdi-close",
  iconSize: "20",
  color: "",
})
</script>

<template>
  <VBtn
    :color="color"
    variant="elevated"
    class="v-dialog-close-btn"
    :style="typeof zIndex === 'number' ? `z-index: ${zIndex};` : undefined"
  >
    <VIcon
      color="error"
      :icon="props.icon"
      :size="props.iconSize"
    />
  </VBtn>
</template>

<style>
.v-dialog-close-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 9999999999;
  min-width: auto;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
}
</style>
