<template>
  <router-view />
</template>

<script setup lang="ts">
import { getWorkoutStore } from "./stores/workoutStore";
import { Exercise, Workout } from "./types";
import { workouts, exercises } from "./seed";

const workoutStore = getWorkoutStore();

if (workoutStore.exercises.length == 0) {
  workoutStore.exercises = exercises;
  workoutStore.workouts = workouts;
}
</script>

<style scoped></style>
