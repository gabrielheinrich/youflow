<template>
  <div>
    <header class="grid grid-cols-3 h-10 items-center px-2">
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
          <Icon
            class="text-xl"
            icon="material-symbols:video-call-outline-rounded"
          />
          <span>Create a new routine</span>
        </button>
        <button
          class="text-xl w-8 h-8 border rounded-md grid place-content-center"
        >
          <Icon icon="material-symbols:settings-outline" />
        </button>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";

const router = useRouter();

const createNewRoutine = () => {
  router.push({ name: "RoutineEditor", params: { id: "new" } });
};
</script>

<style scoped></style>
