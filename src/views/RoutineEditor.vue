<template>
  <div class="grid grid-rows-[auto_1fr] h-screen w-screen">
    <AppHeader />
    <div class="grid grid-cols-[auto_1fr_auto] h-full">
      <div class="border-r max-w-sm w-screen h-full grid grid-rows-[auto_1fr]">
        <div class="p-2">
          <header>
            <div class="flex items-center mb-2 justify-between">
              <h2 class="text-sm uppercase font-semibold tracking-wide">
                Exercise Library
              </h2>
              <router-link
                :to="{ name: 'ExerciseImport' }"
                class="flex items-center space-x-2 border px-2 py-1 border-black rounded-md text-sm"
              >
                <span>Import from YouTube</span>
                <i-material-symbols:youtube-activity class="text-lg" />
              </router-link>
            </div>
          </header>
          <div class="w-full bg-black mb-2 aspect-video relative text-white">
            <div
              v-if="selectedExercise"
              class="absolute inset-0 grid grid-rows-3"
            >
              <div></div>
              <div class="grid place-content-center">
                <h3 class="font-semibold mb-2">
                  {{ selectedExercise.name }}
                </h3>
              </div>
              <div class="flex justify-center items-start">
                <button
                  @click="addToTimeline(selectedExercise)"
                  class="text-sm text-white border px-2 py-1 rounded-md"
                >
                  Add to Timeline
                </button>
              </div>
            </div>
          </div>
          <div>
            <input
              class="w-full border rounded-md px-2 py-1 mb-2"
              type="text"
              name=""
              id=""
              placeholder="Search..."
            />
          </div>
        </div>

        <div class="relative">
          <div class="absolute inset-0 overflow-auto">
            <div
              class="grid gap-2 px-2"
              :style="{
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              }"
            >
              <ExerciseClip
                v-for="exercise in exercises"
                :key="exercise.id"
                :exercise="exercise"
                @click="selectedExercise = exercise"
              >
              </ExerciseClip>
            </div>
          </div>
        </div>
      </div>
      <div class="p-3 space-y-2">
        <div>
          <div class="flex justify-between">
            <div class="flex space-x-2">
              <button
                class="w-8 h-8 grid place-content-center"
                @click="titleRef.focus()"
              >
                <i-material-symbols:edit-outline />
              </button>
              <input
                type="text"
                class="text-2xl font-semibold"
                v-model="routine.name"
                ref="titleRef"
              />
            </div>
            <button class="border rounded-md px-2 py-1" @click="save">
              Save
            </button>
          </div>
          <div>Total Duration: {{ totalDuration }}s</div>
        </div>
        <div class="relative flex justify-center py-8">
          <div class="bg-black w-full aspect-video max-w-screen-md"></div>
        </div>
        <div>
          <h2
            class="text-center mb-1 uppercase tracking-wide font-medium text-sm"
          >
            Timeline
          </h2>
          <div class="relative h-24">
            <div
              class="absolute inset-0 overflow-auto w-full bg-gray-50 border p-2"
            >
              <DraggableContainer
                v-model="routine!.timeline"
                class="flex h-full items-center space-x-2"
              >
                <template v-slot:item="{ item }">
                  <TimelineItem
                    class="w-36 aspect-video border bg-black text-white grid place-content-center"
                    :item="item"
                    @delete="deleteTimelineItem(item)"
                    @click="
                      selection = {
                        type: 'TimelineItem',
                        id: item.id,
                      }
                    "
                  />
                </template>
              </DraggableContainer>
              <div
                v-if="routine!.timeline.length == 0"
                class="absolute inset-0 grid place-content-center pointer-events-none"
              >
                Start creating your routine by dropping some exercises here
              </div>
            </div>
          </div>

          <div></div>
        </div>
      </div>
      <div class="border-l max-w-sm w-screen h-full p-2">
        <h2 class="mb-1 text-sm uppercase font-semibold tracking-wide">
          Inspector
        </h2>
        <TimelineItemInspector
          v-if="selection?.type == 'TimelineItem'"
          v-bind="getTimelineItemById(selection.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
import { defineComponent, ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { DraggableContainer, useDraggableItem } from "@/draggable";
import ExerciseClip from "@/components/ExerciseClip.vue";
import { TimelineItem as TTimelineItem, Workout } from "@/types";
import { ulid } from "ulid";
import TimelineItem from "@/components/TimelineItem.vue";
import { getWorkoutStore } from "@/stores/workoutStore";

interface EntityId {
  id: string;
  type: "Routine" | "TimelineItem" | "Exercise";
}

const selection = ref<EntityId>();

const store = getWorkoutStore();

const titleRef = ref<HTMLInputElement>();

const props = defineProps<{
  id?: string;
}>();

const selectedExercise = ref<Exercise>();

const totalDuration = computed(() => {
  if (!routine.value) return 0;
  return routine.value.timeline.reduce((acc, item) => {
    const exercise = store.getExerciseById(item.exerciseId)!;
    const exerciseDuration = exercise.endSecond - exercise.startSecond;
    return acc + item.exerciseReps * exerciseDuration + item.cooldownTimeSecs;
  }, 0);
});

const routine = ref<Workout>();

const getTimelineItemById = (id: string) => {
  const index = routine.value?.timeline.findIndex((item) => item.id === id);
  return {
    index,
    item: routine.value!.timeline[index!],
  };
};

const addToTimeline = (exercise: Exercise) => {
  const timelineItem: TTimelineItem = {
    id: ulid(),
    exerciseId: exercise.id,
    exerciseReps: 1,
    cooldownTimeSecs: 0,
  };
  routine.value!.timeline.push(timelineItem);
};

watch(
  () => props.id,
  () => {
    if (props.id != "new") {
      routine.value = JSON.parse(
        JSON.stringify(store.workouts.find((r) => r.id === props.id))
      );
    }
    if (props.id == "new" || !routine.value) {
      routine.value = {
        id: ulid(),
        name: "New routine",
        createdUtc: Date.now(),
        timeline: [],
      };
    }
  },
  {
    immediate: true,
  }
);

const router = useRouter();

const deleteTimelineItem = (item: TTimelineItem) => {
  if (selection.value?.id == item.id) {
    selection.value = undefined;
  }
  const index = routine.value!.timeline.findIndex((i) => i.id === item.id);

  routine.value!.timeline.splice(index, 1);
};

const save = () => {
  const index = store.workouts.findIndex((w) => w.id === routine.value.id);
  const workout = JSON.parse(JSON.stringify(routine.value)) as Workout;
  if (index == -1) {
    store.workouts.push(workout);
  } else {
    store.workouts[index] = workout;
  }

  router.push({ name: "Home" });
};

const exercises = store.exercises;
</script>

<style>
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
