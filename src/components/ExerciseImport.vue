<template>
  <div class="relative">
    <button
      @click="emit('close')"
      class="top-1 right-1 absolute w-6 h-6 grid place-content-center hover:bg-gray-200 border rounded-md"
    >
      <i-material-symbols:close />
    </button>
    <div class="flex flex-col items-start py-2 mb-4g">
      <div class="flex items-center space-x-4 mb-2">
        <label for="" class="font-medium">Insert a Youtube Link</label>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-medium flex items-center space-x-2 border rounded-full px-8 py-1"
          ><span>Open YouTube</span>
          <i-material-symbols:youtube-tv class="text-base"
        /></a>
      </div>
      <input
        type="text"
        name=""
        id=""
        class="w-full px-2 py-1 border rounded-md"
        v-model="url"
      />
    </div>

    <div
      class="max-w-screen-sm aspect-video w-full bg-neutral-100 mx-auto mb-4"
    >
      <YoutubeClipPlayer
        :startPosition="startPosition"
        :endPosition="endPosition"
        @update:position="position = $event"
        :position="startPosition"
        :seekPosition="playHead"
        :playing="true"
        :videoId="youtubeId"
        @loaded="
          (duration = $event.duration), (endPosition = Math.min(duration, 60))
        "
        stopAtEnd
      />
    </div>
    <div>{{ formatTime(position) }}</div>

    <ClipMarker
      v-if="duration"
      v-model:startPosition="startPosition"
      v-model:endPosition="endPosition"
      :maxPosition="duration"
      :playHead="position"
      @update:playHead="updatePlayHead"
    />

    <div class="">
      <label class="block text-xs">Name:</label>
      <input
        type="text"
        name=""
        id=""
        v-model="name"
        placeholder="What's the name of this exercise?"
        class="w-full"
      />
    </div>

    <div class="mt-4 flex flex-col items-center">
      <button
        class="border px-8 py-1 rounded-sm border-black font-medium"
        @click="doImport"
      >
        {{ loading ? "Loading ..." : "Import" }}
      </button>
      <div class="text-red-500 text-xs" v-if="error">{{ error.message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
import ClipMarker from "@/components/ClipMarker.vue";
import { ref, computed, nextTick } from "vue";
import { Exercise } from "@/types";
import { ulid } from "ulid";
import { getWorkoutStore } from "@/stores/workoutStore";
import YoutubeClipPlayer from "@/components/YoutubeClipPlayer.vue";
import { formatTime } from "@/utils/formatTime";

const store = getWorkoutStore();
const name = ref("");

const url = ref("");

const emit = defineEmits<{ (e: "close"): void }>();
const loading = ref<boolean>(false);
const error = ref<Error>();

const startPosition = ref(0);
const endPosition = ref(0);

const position = ref(0);
const playHead = ref<number | undefined>(undefined);

const duration = ref(0);

const updatePlayHead = async (newPosition: number) => {
  console.log("updatePlayead", newPosition);
  playHead.value = newPosition;
  await nextTick();
  playHead.value = undefined;
};

const youtubeId = computed(() => {
  const match = url.value.match(/v=([^&]+)/);
  if (match) {
    return match[1];
  }
  return "";
});

const baseApiUrl = "https://yt-test.dashs.workers.dev/openbuild";

const doImport = async () => {
  try {
    loading.value = true;
    error.value = undefined;
    const url = `${baseApiUrl}/${youtubeId.value}?second=${startPosition.value}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const json = await res.json();

    console.log(json);

    const exercise: Exercise = {
      id: ulid(),
      name: name.value,
      srcType: "youtube",
      srcId: youtubeId.value!,
      description: "",
      startSecond: startPosition.value,
      endSecond: endPosition.value,
      thumbnailUrl: json.result_url,
    };

    store.exercises.push(exercise);
    emit("close");
  } catch (e) {
    error.value = e as Error;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped></style>
