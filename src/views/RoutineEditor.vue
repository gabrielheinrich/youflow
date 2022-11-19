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
              <div
                v-for="clip in 100"
                :key="clip"
                class="aspect-video bg-black"
              >
                {{ clip }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="px-2 py-1 grid grid-rows-[auto_1fr_auto] gap-2">
        <div>
          <h2>Name of routine</h2>
        </div>
        <div class="grid place-content-center">
          <div
            class="aspect-video bg-black max-w-screen-sm w-screen mx-auto"
          ></div>
        </div>
        <div>
          <div class="relative h-24">
            <div class="absolute inset-0 overflow-auto w-full">
              <div class="flex space-x-2">
                <div
                  v-for="placeholder in 100"
                  :key="placeholder"
                  class="flex-shrink-0"
                  @click="selection = 'Section ' + placeholder"
                >
                  <div>{{ placeholder }}</div>
                  <RoutineEditorClip />
                </div>
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
        <h3>
          {{ selection }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
import RoutineEditorClip from "@/components/RoutineEditorClip.vue";

import { ref } from "vue";

const selection = ref<string>();
</script>

<style scoped></style>
