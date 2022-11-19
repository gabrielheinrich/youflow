<template>
  <div class="flex space-x-2">
    <label class="block text-xs mb-1">Set a start and end position:</label>
    <div class="flex text-xs mb-2 w-32">
      <div>{{ formatTime(startPosition) }} - {{ formatTime(endPosition) }}</div>
    </div>
  </div>

  <div class="h-12 relative">
    <div class="absolute inset-0 overflow-auto">
      <div :style="{ width: `${maxPosition + 20}px` }" ref="timelineRef">
        <div
          class="absolute border-b bg-gray-100 border h-8"
          :style="{ width: `${maxPosition}px`, left: '10px' }"
        ></div>
        <div
          class="w-[10px] h-8 bg-black absolute border-r-2 border-red-500"
          :style="{ left: `${startPosition}px` }"
          ref="startMarkerRef"
        ></div>
        <div
          class="w-[10px] h-8 bg-black border-l-2 border-red-500 absolute"
          :style="{ left: `${endPosition + 10}px` }"
          ref="endMarkerRef"
        ></div>

        <div
          class="bg-red-200 border-red-500 border-y-2 absolute h-8"
          :style="{
            width: `${endPosition - startPosition}px`,
            left: `${startPosition + 10}px`,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from "vue";
import { useDraggable } from "@vueuse/core";
import { formatTime } from "@/utils/formatTime";

const props = defineProps<{
  startPosition: number;
  endPosition: number;
  maxPosition: number;
}>();

const emit = defineEmits<{
  (e: "update:startPosition", value: number): void;
  (e: "update:endPosition", value: number): void;
}>();

// const maxPosition = ref<number>(2000);
// const startPosition = ref<number>(0);
// const endPosition = ref<number>(0);

const startPosition = computed(() => props.startPosition);
const endPosition = computed(() => props.endPosition);
const maxPosition = computed(() => props.maxPosition);

const startMarkerRef = ref<HTMLElement>();
const timelineRef = ref<HTMLElement>();

const endMarkerRef = ref<HTMLElement>();

const name = ref<HTMLElement>();

const youtubeLink = ref<HTMLElement>();

useDraggable(startMarkerRef, {
  onStart() {
    console.log("start");
  },
  onMove(arg) {
    const x = Math.round(arg.x - timelineRef.value!.getBoundingClientRect().x);
    const newStartPosition = Math.min(Math.max(0, x), maxPosition.value);
    emit("update:startPosition", newStartPosition);
    emit("update:endPosition", Math.max(newStartPosition, endPosition.value));
    startMarkerRef.value!.scrollIntoView();
  },
});

useDraggable(endMarkerRef, {
  onStart() {
    console.log("start");
  },
  onMove(arg) {
    const x = Math.round(
      arg.x - timelineRef.value!.getBoundingClientRect().x - 10
    );
    const newPosition = Math.min(Math.max(0, x), maxPosition.value);
    emit("update:endPosition", newPosition);
    emit("update:startPosition", Math.min(startPosition.value, newPosition));

    endMarkerRef.value!.scrollIntoView();
  },
});

watchEffect(
  () => {
    if (startPosition.value > maxPosition.value) {
      emit("update:startPosition", maxPosition.value);
    }
    if (endPosition.value > maxPosition.value) {
      emit("update:endPosition", maxPosition.value);
    }
  },
  {
    flush: "sync",
  }
);

const pixelPerSecond = 1;
</script>

<style scoped></style>
