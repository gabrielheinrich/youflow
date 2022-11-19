<template>
  <div>
    <AppHeader />

    <div class="p-4 mx-auto max-w-screen-lg">
      <div
        class="grid gap-4"
        :style="{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px,1fr))' }"
      >
        <router-link
          :to="{ name: 'RoutinePlayer', params: { id: routine.id } }"
          v-for="routine in routines"
          :key="routine.id"
        >
          <div
            class="aspect-video bg-black grid place-content-center bold text-white relative"
          >
            <h2>
              {{ routine.title }}
            </h2>
            <div class="absolute bottom-0 w-full flex justify-end p-2">
              <router-link
                :to="{ name: 'RoutineEditor', params: { id: routine.id } }"
                class="border rounded-full text-lg h-10 w-10 grid place-content-center"
              >
                <Icon icon="material-symbols:movie-edit-outline-sharp"></Icon>
              </router-link>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import AppHeader from "@/components/AppHeader.vue";

const routines = [
  {
    id: "1",
    title: "Yoga",
  },
  {
    id: "2",
    title: "Quick Stretch",
  },
  {
    id: "3",
    title: "Cardio",
  },
  {
    id: "4",
    title: "Meditation",
  },
];
</script>

<style scoped></style>
