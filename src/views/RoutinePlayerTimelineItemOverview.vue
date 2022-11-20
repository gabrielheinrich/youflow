<template>
  <div
    class="absolute top-2 p-4 pt-2 text-white flex flex-col justify-center gap-2 rounded-lg"
  >
    <div
      class="w-full flex justify-center text-xl font-semibold bg-black rounded-lg bg-opacity-60 px-2 py-1"
    >
      <span class="">{{ exercise.name }}</span>
      &nbsp;&nbsp;&nbsp;
      <span>{{ activeIndexString }}</span>
    </div>
    <div
      class="flex items-center rounded border text-sm h-12 transition-colors bg-black bg-opacity-60 shadow-xl"
    >
      <div
        class="flex items-center justify-center text-xs px-2 h-full w-[80px] rounded-l bg-opacity-80"
        :class="{ 'bg-blue-500': phase == 'prepare' }"
      >
        <span>Prepare</span>
      </div>
      <div
        class="text-xs px-2 flex flex-col justify-center items-center gap-1 border-l border-r border-white h-full min-w-[80px] bg-opacity-80"
        :class="{ 'bg-blue-500': phase == 'exercise' }"
      >
        <!-- <div class="">Exercise</div> -->
        <div class="flex gap-1">
          <div
            v-for="rep in timelineItem.exerciseReps"
            class="px-2 rounded bg-neutral-800"
            :class="{ '!bg-blue-400': exerciseRep == rep }"
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
import { Exercise, TimelineItem } from "@/types";
import { onMounted, computed } from "vue";
import { StepPhaseType } from "./RoutinePlayer.vue";

const props = defineProps<{
  timelineItem: TimelineItem;
  exercise: Exercise;
  phase: StepPhaseType;
  exerciseRep: number;
  workoutLength: number;
  segmentIndex: number;
  secondsLeft: number;
}>();

const activeIndexString = computed(
  () => props.segmentIndex + 1 + " / " + props.workoutLength
);

onMounted(async () => {});
</script>

<style scoped></style>
