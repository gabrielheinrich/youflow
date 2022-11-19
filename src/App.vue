<template>
  <router-view />
</template>

<script setup lang="ts">
import { getWorkoutStore } from "./stores/workoutStore"
import { Exercise, Workout } from "./types"

const workoutStore = getWorkoutStore()

workoutStore.exercises = [
  {
    id: "0",
    name: "Short Test",
    description: "Simple Test",
    srcType: "youtube",
    srcId: "raUEsDttCL4",
    startSecond: 54,
    endSecond: 62,
  },
  {
    id: "1",
    name: "Yoga Stuff",
    description: "Simple YOLO Yoga",
    srcType: "youtube",
    srcId: "raUEsDttCL4",
    startSecond: 254,
    endSecond: 280,
  },
  {
    id: "2",
    name: "Other Stretch",
    description: "Stretch Awesome",
    srcType: "youtube",
    srcId: "ZbtVVYBLCug",
    startSecond: 535,
    endSecond: 570,
  },
  {
    id: "3",
    name: "Cardio",
    description: "Long Cardio Workout",
    srcType: "youtube",
    srcId: "kZDvg92tTMc",
    startSecond: 466,
    endSecond: 509,
  },
  {
    id: "4",
    name: "Meditation",
    description: "Be calm like Water...",
    srcType: "youtube",
    srcId: "ockCQMt9kM0",
    startSecond: 10,
    endSecond: 200,
  },
] as Exercise[]

workoutStore.workouts = [
  {
    id: "1",
    name: "Yoga",
    createdUtc: +new Date(),
    timeline: [
      {
        id: crypto.randomUUID(),
        exerciseId: "0",
        exerciseReps: 4,
        cooldownTimeSecs: 30,
      },
      {
        id: crypto.randomUUID(),
        exerciseId: "1",
        exerciseReps: 3,
        cooldownTimeSecs: 30,
      },
      {
        id: crypto.randomUUID(),
        exerciseId: "3",
        exerciseReps: 2,
        cooldownTimeSecs: 30,
      },
    ],
  },
  {
    id: "2",
    name: "Quick Stretch",
    createdUtc: +new Date(),
    timeline: [
      {
        id: crypto.randomUUID(),
        exerciseId: "2",
        exerciseReps: 2,
        cooldownTimeSecs: 20,
      },
    ],
  },
  {
    id: "3",
    name: "Cardio",
    createdUtc: +new Date(),
    timeline: [
      {
        id: crypto.randomUUID(),
        exerciseId: "2",
        exerciseReps: 2,
        cooldownTimeSecs: 20,
      },
    ],
  },
] as Workout[]
</script>

<style scoped></style>
