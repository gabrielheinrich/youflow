<template>
  <div class="aspect-video bg-black w-24 flex-shrink-0" ref="clipRef"></div>
</template>

<script setup lang="ts">
import { useDraggable } from "@vueuse/core";
import { ref } from "vue";

const clipRef = ref<HTMLElement>();
const draggable = useDraggable(clipRef, {});
</script>

<style scoped></style>
