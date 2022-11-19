<template>
  <div class="text-xs overflow-hidden">
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

const store = getWorkoutStore();

const exercise = computed(() =>
  store.exercises.find((e) => e.id === props.item.exerciseId)
);
</script>

<style scoped></style>
