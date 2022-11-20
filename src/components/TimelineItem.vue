<template>
  <div
    class="text-xs overflow-hidden relative container bg-cover bg-center"
    :style="{ backgroundImage: `url(${thumbnailUrl})` }"
  >
    <button
      class="absolute top-1 right-1 h-6 w-6 grid place-content-center border rounded-full bg-black"
      @click.stop="emit('delete')"
    >
      <i-material-symbols:delete-forever-outline />
    </button>
    <h2 class="rounded-md bg-black bg-opacity-20 px-2 py-1 text-base">
      {{ exercise.name }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { TimelineItem } from "@/types";
import { getWorkoutStore } from "@/stores/workoutStore";
import { computed } from "vue";
import { getExerciseThumbnail } from "@/utils/getExerciseThumbnail";

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

const thumbnailUrl = computed(() => {
  return getExerciseThumbnail(exercise.value);
});
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
