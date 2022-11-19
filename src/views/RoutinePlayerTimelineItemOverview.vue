<template>
  <div
    class="absolute top-2 p-4 pt-2 bg-gray-900 flex flex-col justify-center gap-2 rounded-md text-gray-200"
  >
    <div class="w-full flex justify-center text-lg">
      <span class="">{{ exercise.name }}</span>
      &nbsp;&nbsp;&nbsp;
      <span>{{ activeIndexString }}</span>
    </div>
    <div
      class="flex items-center rounded border-gray-700 border text-sm h-12 transition-colors"
    >
      <div
        class="flex items-center justify-center text-xs px-2 h-full w-[80px]"
        :class="{ 'bg-gray-700': phase == 'prepare' }"
      >
        <span>Prepare</span>
      </div>
      <div
        class="text-xs px-2 flex flex-col justify-center items-center gap-1 border-l border-r border-gray-600 h-full min-w-[80px]"
        :class="{ 'bg-gray-700': phase == 'exercise' }"
      >
        <div class="">Exercise</div>
        <div class="flex gap-1">
          <div
            v-for="rep in timelineItem.exerciseReps"
            class="px-2 rounded bg-gray-800"
            :class="{ '!bg-blue-500': exerciseRep == rep }"
          >
            {{ rep }}
          </div>
        </div>
      </div>
      <div
        class="text-xs px-2 pl-3 h-full flex justify-center items-center w-[80px]"
        :class="{ 'bg-gray-700': phase == 'cooldown' }"
      >
        <span>Cooldown</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Exercise, TimelineItem } from "@/types"
import { onMounted, computed } from "vue"
import { StepPhaseType } from "./RoutinePlayer.vue"

const props = defineProps<{
  timelineItem: TimelineItem
  exercise: Exercise
  phase: StepPhaseType
  exerciseRep: number
  workoutLength: number
  segmentIndex: number
  secondsLeft: number
}>()

const activeIndexString = computed(
  () => props.segmentIndex + 1 + " / " + props.workoutLength
)

onMounted(async () => {})
</script>

<style scoped></style>
