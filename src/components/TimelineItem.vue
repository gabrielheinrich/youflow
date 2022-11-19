<template>
  <div class="text-xs overflow-hidden relative container">
    <button
      class="absolute top-1 right-1 h-6 w-6 grid place-content-center border rounded-full bg-black"
      @click.stop="emit('delete')"
    >
      <i-material-symbols:delete-forever-outline />
    </button>
    {{ exercise.name }}
  </div>
</template>

<script setup lang="ts">
import { TimelineItem } from "@/types";
import { getWorkoutStore } from "@/stores/workoutStore";
import { computed } from "vue";

const props = defineProps<{
  item: TimelineItem;
}>();

const emit = defineEmits<{
  (e: "delete"): void;
}>();

const store = getWorkoutStore();

const exercise = computed(() =>
  store.exercises.find((e) => e.id === props.item.exerciseId)
);
</script>

<style scoped>
.container:hover > button {
  opacity: 1;
}

.container > button {
  opacity: 0;
  transition: opacity 0.2s;
}
</style>
