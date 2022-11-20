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
              <button
                @click="showImporter = !showImporter"
                class="flex items-center space-x-2 border px-2 py-1 border-black rounded-md text-sm"
              >
                <span>Import from YouTube</span>
                <i-material-symbols:youtube-activity class="text-lg" />
              </button>
            </div>
          </header>
          <div
            class="w-full bg-neutral-100 mb-2 aspect-video relative text-white"
          >
            <div
              v-if="selectedExercise"
              class="absolute inset-0 grid grid-rows-3"
            >
              <YoutubeClipPlayer
                :startPosition="selectedExercise.startSecond"
                :endPosition="selectedExercise.endSecond"
                :playing="false"
                :videoId="selectedExercise.srcId"
                :position="selectedExercise.startSecond"
              />

              <div
                class="absolute inset-0 z-10 grid place-content-center pointer-events-none"
              >
                <div class="flex items-center flex-col">
                  <h3
                    class="font-semibold mb-2 bg-opacity-20 px-2 py-1 rounded-md bg-black text-2xl"
                  >
                    {{ selectedExercise.name }}
                  </h3>
                  <button
                    @click="addToTimeline(selectedExercise)"
                    class="pointer-events-auto text-sm text-white border px-2 py-1 rounded-md bg-opacity-20 bg-black"
                  >
                    Add to Timeline
                  </button>
                </div>
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
            <div class="flex space-x-2">
              <button
                class="rounded-md px-4 border-black border py-1 font-medium hover:bg-neutral-00"
                @click="save"
              >
                Save
              </button>
              <button
                class="rounded-md px-4 border-black border py-1 font-medium hover:bg-neutral-00"
                @click="remove"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <div class="py-8">
          <div
            v-if="selectedTimelineItem"
            class="flex space-x-4 max-w-screen-md mx-auto items-baseline mb-2"
          >
            <h2 class="h-8 font-medium text-2xl">
              <span v-if="selectedTimelineItem">
                {{ selectedTimelineItem?.index! + 1 }} -
                {{ selectedTimelineItem?.exercise.name }}
              </span>
            </h2>
            <div>
              Duration:
              {{
                formatTime(
                  totalDurationOfTimelineItem(selectedTimelineItem.item)
                )
              }}
            </div>
          </div>
          <div class="relative flex justify-center">
            <div
              class="bg-black bg-neutral-100 w-full aspect-video max-w-screen-md"
            >
              <YoutubeClipPlayer
                v-if="selectedTimelineItem"
                :startPosition="selectedTimelineItem.exercise.startSecond"
                :endPosition="selectedTimelineItem.exercise.endSecond"
                :playing="true"
                :position="0"
                :videoId="selectedTimelineItem.exercise.srcId"
              />
            </div>
          </div>
          <div
            class="grid grid-cols-2 max-w-screen-sm mx-auto gap-4 mt-2"
            v-if="selectedTimelineItem"
          >
            <div class="grid grid-cols-2">
              <label>Reps</label>
              <div class="grid grid-cols-[1fr_auto]">
                <div class="border px-2 flex space-x-1">
                  <input
                    type="text"
                    v-model.number="selectedTimelineItem.item.exerciseReps"
                    class="text-right w-full"
                  />
                </div>
                <div class="flex">
                  <button
                    class="w-6"
                    @click="selectedTimelineItem.item.exerciseReps -= 1"
                  >
                    -
                  </button>
                  <button
                    class="w-6"
                    @click="selectedTimelineItem.item.exerciseReps += 1"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2">
              <label>Cooldown</label>
              <div class="grid grid-cols-[1fr_auto]">
                <div class="border px-2 flex space-x-1">
                  <input
                    type="text"
                    v-model.number="selectedTimelineItem.item.cooldownTimeSecs"
                    class="text-right w-full"
                  />
                  <span>s</span>
                </div>
                <div class="flex">
                  <button
                    class="w-6"
                    @click="selectedTimelineItem.item.cooldownTimeSecs -= 1"
                  >
                    -
                  </button>

                  <button
                    class="w-6"
                    @click="selectedTimelineItem.item.cooldownTimeSecs += 1"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="flex space-x-4 items-baseline">
            <h2 class="mb-1 uppercase tracking-wide font-medium text-sm">
              Timeline
            </h2>
            <span class="text-xs"
              >Total Duration: {{ formatTime(totalDuration) }}</span
            >
          </div>

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
                    class="w-36 aspect-video bg-black text-white grid place-content-center border-4 border-transparent"
                    :class="{
                      'border-red-400': selection?.id == item.id,
                    }"
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
      <div class="border-l max-w-sm w-screen h-full p-2" v-if="false">
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
  <div
    v-if="showImporter"
    class="fixed inset-0 h-screen w-screen pointer-events-none grid place-content-center"
  >
    <div
      class="pointer-events-auto max-w-screen-lg w-screen p-2 pt-2 pb-4 bg-white rounded-sm shadow-md border"
    >
      <ExerciseImport
        @import="showImporter = false"
        @close="showImporter = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
import { defineComponent, ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { DraggableContainer, useDraggableItem } from "@/draggable";
import ExerciseClip from "@/components/ExerciseClip.vue";
import { TimelineItem as TTimelineItem, Workout, Exercise } from "@/types";
import { ulid } from "ulid";
import TimelineItem from "@/components/TimelineItem.vue";
import { getWorkoutStore } from "@/stores/workoutStore";
import ExerciseImport from "@/components/ExerciseImport.vue";
import { formatTime } from "@/utils/formatTime";
import YoutubeClipPlayer from "@/components/YoutubeClipPlayer.vue";

interface EntityId {
  id: string;
  type: "Routine" | "TimelineItem" | "Exercise";
}

const selection = ref<EntityId>();

const selectedTimelineItem = computed(() => {
  if (selection.value?.type == "TimelineItem") {
    return getTimelineItemById(selection.value.id);
  }
});

const store = getWorkoutStore();

const titleRef = ref<HTMLInputElement>();

const showImporter = ref<boolean>(false);

const totalDurationOfTimelineItem = (item: TTimelineItem) => {
  const exercise = store.getExerciseById(item.exerciseId)!;
  return (
    item.exerciseReps * (exercise.endSecond - exercise.startSecond) +
    item.cooldownTimeSecs
  );
};

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
    exercise: store.getExerciseById(
      routine.value!.timeline[index!].exerciseId
    )!,
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

const remove = () => {
  const index = store.workouts.findIndex((w) => w.id === routine.value.id);
  if (index >= 0) {
    store.workouts.splice(index, 1);
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
