<template>
  <div class="border-b">
    <header class="grid grid-cols-3 h-12 items-center px-3">
      <router-link :to="{ name: 'Home' }">
        <h1 class="font-bold text-lg">YouPractice</h1></router-link
      >
      <div class="flex justify-center">
        <input
          type="text"
          placeholder="Search..."
          class="w-full border rounded-md px-2 py-1"
        />
      </div>
      <div class="flex justify-end space-x-2">
        <button
          @click="createNewRoutine"
          class="h-8 border rounded-md whitespace-nowrap flex space-x-1 items-center text-sm px-2"
        >
          <i-material-symbols-video-call-outline-rounded
            class="text-xl"
          ></i-material-symbols-video-call-outline-rounded>
          <span>Create a new routine</span>
        </button>
        <button
          class="text-xl w-8 h-8 border rounded-md grid place-content-center"
        >
          <i-material-symbols-settings-outline
            class="text-xl"
          ></i-material-symbols-settings-outline>
        </button>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const createNewRoutine = () => {
  router.push({ name: "RoutineEditor", params: { id: "new" } });
};
</script>

<style scoped></style>
