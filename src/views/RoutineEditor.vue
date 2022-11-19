<template>
  <div class="grid grid-rows-[auto_1fr] h-screen w-screen">
    <AppHeader class="border-b" />
    <div class="grid grid-cols-[auto_1fr_auto] h-full">
      <div class="border-r max-w-sm w-screen h-full grid grid-rows-[auto_1fr]">
        <header class="p-2">
          <h2 class="mb-1 text-sm uppercase font-semibold tracking-wide">
            Exercise Library
          </h2>

          <input
            class="w-full border rounded-md px-2 py-1"
            type="text"
            name=""
            id=""
            placeholder="Search..."
          />
        </header>

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
              >
              </ExerciseClip>
            </div>
          </div>
        </div>
      </div>
      <div class="px-2 py-1 grid grid-rows-[auto_1fr_auto] gap-2">
        <div>
          <input type="text" v-model="routine.name" />
        </div>
        <div class="grid place-content-center">
          <div
            class="aspect-video bg-black max-w-screen-sm w-screen mx-auto"
          ></div>
        </div>
        <div>
          <div class="relative h-24">
            <div class="absolute inset-0 overflow-auto w-full bg-gray-50">
              <DraggableContainer
                v-model="routine.timeline"
                class="flex h-full"
              >
                <template v-slot:item="{ item }">
                  <TimelineItem
                    class="w-24 aspect-video border bg-black text-white grid place-content-center"
                    :item="item"
                    @click="
                      selection = {
                        type: 'TimelineItem',
                        id: item.id,
                      }
                    "
                  />
                </template>
              </DraggableContainer>
            </div>
          </div>

          <div>
            <button class="border rounded-md px-2 py-1" @click="save">
              Save
            </button>
          </div>
        </div>
      </div>
      <div class="border-l max-w-sm w-screen h-full p-2">
        <h2 class="mb-1 text-sm uppercase font-semibold tracking-wide">
          Inspector
        </h2>
        <h3>
          {{ selection }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { DraggableContainer, useDraggableItem } from "@/draggable";
import ExerciseClip from "@/components/ExerciseClip.vue";
import { Workout } from "@/types";
import { ulid } from "ulid";
import TimelineItem from "@/components/TimelineItem.vue";
import { getWorkoutStore } from "@/stores/workoutStore";

interface EntityId {
  id: string;
  type: "Routine" | "TimelineItem" | "Exercise";
}

const selection = ref<EntityId>();

const props = defineProps<{
  id?: string;
}>();

const routine = ref<Workout>({
  id: ulid(),
  name: "My routine",
  createdUtc: Date.now(),
  timeline: [],
});

const store = getWorkoutStore();

const router = useRouter();

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
