<template>
  <div>
    <h2 class="font-medium text-lg mb-3">
      {{ props.index + 1 }} - {{ exercise.name }}
    </h2>

    <div class="mb-2 text-sm">
      Rep Duration:
      {{ exercise.endSecond - exercise.startSecond }}s
    </div>
    <div class="mb-2 text-sm">
      Total Duration:
      {{
        item.exerciseReps * (exercise.endSecond - exercise.startSecond) +
        item.cooldownTimeSecs
      }}s
    </div>
    <div class="grid grid-cols-2 mb-2">
      <label>Reps</label>
      <div class="grid grid-cols-[1fr_auto]">
        <div class="border px-2 flex space-x-1">
          <input
            type="text"
            v-model.number="item.exerciseReps"
            class="text-right w-full"
          />
        </div>
        <div class="flex">
          <button class="w-6" @click="item.exerciseReps -= 1">-</button>
          <button class="w-6" @click="item.exerciseReps += 1">+</button>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2">
      <label>Cooldown</label>
      <div class="grid grid-cols-[1fr_auto]">
        <div class="border px-2 flex space-x-1">
          <input
            type="text"
            v-model.number="item.cooldownTimeSecs"
            class="text-right w-full"
          />
          <span>s</span>
        </div>
        <div class="flex">
          <button class="w-6" @click="item.cooldownTimeSecs -= 1">-</button>
          <button class="w-6" @click="item.cooldownTimeSecs += 1">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TimelineItem } from "@/types";
import { getWorkoutStore } from "@/stores/workoutStore";
import { computed } from "vue";

const props = defineProps<{
  item: TimelineItem;
  index: number;
}>();

const store = getWorkoutStore();

const exercise = computed(
  () => store.exercises.find((e) => e.id === props.item.exerciseId)!
);
</script>

<style scoped></style>
