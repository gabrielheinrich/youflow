<template>
  <div class="grid place-content-center w-screen h-screen relative">
    <div ref="videoElement" class="w-screen h-screen relative">
      <div id="player" class="w-full h-full" :class="iframeClass"></div>
      <div
        :class="iframeClass"
        class="videoframe w-full h-full"
        :style="{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          zIndex: 1000,
        }"
      ></div>
    </div>
  </div>
  <div class="absolute flex gap-4 justify-center bottom-16 w-screen z-[1000]">
    <div class="rounded-lg flex justify-center gap-4 w-64 h-8 text-white">
      <button
        @click="goBack"
        class="bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center w-16 h-16 rounded"
      >
        <i-material-symbols-arrow-back-ios-rounded
          class="w-5 h-5 translate-x-1"
        ></i-material-symbols-arrow-back-ios-rounded>
      </button>
      <button
        @click="playOrPause"
        class="bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center w-16 h-16 rounded"
      >
        <i-material-symbols-arrow-forward-ios-rounded
          class="w-5 h-5 translate-x-0"
        ></i-material-symbols-arrow-forward-ios-rounded>
      </button>
      <button
        @click="goNext"
        class="bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center w-16 h-16 rounded"
      >
        <i-material-symbols-arrow-forward-ios-rounded
          class="w-5 h-5 translate-x-0"
        ></i-material-symbols-arrow-forward-ios-rounded>
      </button>

      <button
        @click="exitVideo"
        class="bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center w-16 h-16 rounded"
      >
        <i-material-symbols-fullscreen-exit
          class="w-5 h-5 translate-x-0"
        ></i-material-symbols-fullscreen-exit>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import YoutubeIFrameLoader from "youtube-iframe"
import { useRouter } from "vue-router"
import { getWorkoutStore } from "@/stores/workoutStore"
import { Workout } from "@/types"

const workoutStore = getWorkoutStore()

const router = useRouter()

const props = defineProps<{
  id: string
}>()

const iframeClass = ref("blackedout")

const setShowVideo = (shouldShow: boolean) => {
  iframeClass.value = shouldShow ? "visible" : "blackedout"
}

const workout = workoutStore.workouts.find((w) => w.id == props.id)!

setShowVideo(false)

const goNext = () => router.back()
const goBack = () => router.back()
const exitVideo = () => router.back()
const playOrPause = () => {}

// console.log(YoutubeIFrameLoader)
const playerState = ref(-1)
watch(
  () => playerState.value,
  (playerState) => {
    console.log("playerState", playerState)
  }
)

let ytPlayer: YT.Player

const initPlayer = async () => {
  return new Promise((resolve, reject) => {
    YoutubeIFrameLoader.load((YT) => {
      ytPlayer = new YT.Player("player", {
        playerVars: {
          controls: 0,
        },
        events: {
          onReady: () => {
            resolve(undefined)
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            playerState.value = event.data
          },
        },
      })
    })
  })
}

const playClip = async (
  videoId: string,
  startTime: number,
  endTime: number
) => {
  ytPlayer.loadVideoById(videoId, startTime)
  // ytPlayer.seekTo(startTime, true)
  ytPlayer.mute()
  ytPlayer.playVideo()

  setTimeout(() => {
    setShowVideo(true)
  }, 200)

  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      console.log(ytPlayer.getCurrentTime())

      if (ytPlayer.getCurrentTime() > endTime - 0.5) {
        setShowVideo(false)
      }
      if (ytPlayer.getCurrentTime() > endTime) {
        ytPlayer.stopVideo()
        // ytPlayer.pauseVideo()
        clearInterval(interval)
        // ytPlayer.destroy()
        resolve(undefined)
      }
    }, 1000)
  })
}

const playWorkout = async (wo: Workout) => {
  await initPlayer()

  for (const timelineItem of wo.timeline) {
    const exercise = workoutStore.exercises.find(
      (w) => w.id == timelineItem.exerciseId
    )!

    await playClip(exercise.srcId, exercise.startSecond, exercise.endSecond)
  }
}

onMounted(async () => {
  playWorkout(workout)
})
</script>

<style scoped>
.videoframe {
  background-color: black;
  transition: opacity 1s;
}
.blackedout {
  opacity: 100;
}

.visible {
  opacity: 0;
}
</style>
