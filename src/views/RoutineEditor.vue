<template>
  <div class="grid grid-rows-[auto_1fr] h-screen w-screen">
    <AppHeader class="border-b" />
    <div class="grid grid-cols-[auto_1fr_auto] h-full">
      <div class="border-r max-w-sm w-full h-full">Assets</div>
      <div>Preview</div>
      <div class="border-r max-w-sm w-full h-full">Inspector</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
</script>

<style scoped></style>
