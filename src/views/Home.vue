<template>
  <div>
    <AppHeader />

    <div class="p-4 mx-auto max-w-screen-lg">
      <div
        class="grid gap-4"
        :style="{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px,1fr))' }"
      >
        <router-link
          :to="{ name: 'RoutinePlayer', params: { id: workout.id } }"
          v-for="workout in workoutStore.workouts"
          :key="workout.id"
        >
          <div
            class="aspect-video bg-black grid place-content-center bold text-white relative bg-cover bg-center"
            :style="{
              backgroundImage: `url(${workoutStore.getWorkoutThumbnail(
                workout.id
              )})`,
            }"
          >
            <h2
              class="bg-black rounded-md px-2 py-1 text-2xl font-medium bg-opacity-40 border"
            >
              {{ workout.name }}
            </h2>
            <div class="absolute bottom-0 w-full flex justify-end p-2">
              <router-link
                :to="{ name: 'RoutineEditor', params: { id: workout.id } }"
                class="border rounded-full text-lg h-10 w-10 grid place-content-center bg-black bg-opacity-40"
              >
                <i-material-symbols-movie-edit-outline-sharp
                  class="text-xl"
                ></i-material-symbols-movie-edit-outline-sharp>
              </router-link>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
import { getWorkoutStore } from "@/stores/workoutStore";

const workoutStore = getWorkoutStore();
</script>

<style scoped></style>
