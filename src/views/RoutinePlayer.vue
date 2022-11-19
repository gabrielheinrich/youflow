<template>
  <div
    class="grid place-content-center w-screen h-screen relative"
    @click="playOrPause"
  >
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
    <div class="absolute w-full h-full flex items-center justify-center">
      <transition
        enter-active-class="transition-[transform,opacity] duration-500 ease"
        enter-from-class="scale-75 opacity-100"
        enter-to-class="scale-105 opacity-20"
        leave-active-class="hidden"
      >
        <div
          v-if="showSymbol == 'pause'"
          class="text-white rounded-full bg-gray-800/60 p-4"
        >
          <i-material-symbols-pause-outline class="w-16 h-16">
          </i-material-symbols-pause-outline>
        </div>
      </transition>
      <transition
        enter-active-class="transition-[transform,opacity] duration-500 ease"
        enter-from-class="scale-75 opacity-100"
        enter-to-class="scale-105 opacity-20"
        leave-active-class="hidden"
      >
        <div
          v-if="showSymbol == 'play'"
          class="text-white rounded-full bg-gray-800/60 p-4"
        >
          <i-material-symbols-play-arrow class="w-16 h-16">
          </i-material-symbols-play-arrow>
        </div>
      </transition>
    </div>
  </div>

  <div
    class="absolute flex gap-4 justify-center items-end top-2 h-[100px] w-screen z-40"
    :class="{ 'bg-black': paused }"
  >
    <div class="p-4 bg-gray-900 rounded-md text-gray-200 text-xl">
      <span class="">{{ activeExercise?.name }}</span>
      &nbsp;
      <span>{{ activeIndexString }}</span>
    </div>
  </div>
  <div
    class="absolute flex gap-4 justify-center items-center bottom-2 h-[180px] w-screen z-[1000]"
    :class="{ 'bg-black': paused }"
  >
    <div class="rounded-lg flex justify-center gap-4 w-64 h-8 text-white">
      <button
        @click="goBack"
        class="bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center w-16 h-14 rounded"
      >
        <i-material-symbols-arrow-back-ios-rounded
          class="w-5 h-5 translate-x-1"
        ></i-material-symbols-arrow-back-ios-rounded>
      </button>
      <button
        @click="playOrPause"
        class="bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center w-16 h-14 rounded"
      >
        <i-material-symbols-play-arrow
          v-if="playerState != 1"
          class="w-5 h-5"
        ></i-material-symbols-play-arrow>
        <i-material-symbols-pause-outline
          v-else
          class="w-5 h-5"
        ></i-material-symbols-pause-outline>
      </button>
      <button
        @click="goNext"
        class="bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center w-16 h-14 rounded"
      >
        <i-material-symbols-arrow-forward-ios-rounded
          class="w-5 h-5 translate-x-0"
        ></i-material-symbols-arrow-forward-ios-rounded>
      </button>

      <button
        @click="exitVideo"
        class="bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center w-16 h-14 rounded"
      >
        <i-material-symbols-fullscreen-exit
          class="w-5 h-5 translate-x-0"
        ></i-material-symbols-fullscreen-exit>
      </button>
    </div>
  </div>

  <div
    v-if="isPlaying"
    class="absolute pointer-events-none top-0 left-0 flex items-center w-screen h-screen z-[2000]"
  >
    <div class="w-screen aspect-video relative">
      <div class="relative w-36 h-36 flex items-center justify-center">
        <span class="timer text-white text-4xl">
          {{ secondsLeft }}
        </span>
        <svg
          class="absolute top-[50px] left-[45px] rotate-90"
          :width="50"
          :height="50"
          :style="`--chart-color: ${circleColor}; --stroke-offset: ${timeProgress};`"
        >
          <defs>
            <filter y="-40%" x="-40%" height="180%" width="180%">
              <feGaussianBlur
                :stdDeviation="3"
                result="coloredBlur"
              ></feGaussianBlur>
              <feMerge>
                <feMergeNode in="coloredBlur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
          </defs>
          <g :style="`--stroke-width: ${12}px;`">
            <path class="value" pathLength="1" :d="svgPath"></path>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue"
import beepSound from "../../public/beeps.wav"
import YoutubeIFrameLoader from "youtube-iframe"
import { useRouter } from "vue-router"
import { getWorkoutStore } from "@/stores/workoutStore"

const workoutStore = getWorkoutStore()

console.log("beepSound", beepSound)

const router = useRouter()

const props = defineProps<{
  id: string
}>()

type SymbolType = "none" | "play" | "pause"
const iframeClass = ref("blackedout")
const showSymbol = ref("none" as SymbolType)

const setShowVideo = (shouldShow: boolean) => {
  iframeClass.value = shouldShow ? "visible" : "blackedout"
}

const workout = workoutStore.workouts.find((w) => w.id == props.id)!
const stepIndex = ref(0)
/** used to cancel current video play on skip */
let controller = new AbortController()

const activeTimelineStep = computed(() => workout.timeline[stepIndex.value])
const activeExercise = computed(
  () =>
    workoutStore.exercises.find(
      (e) => e.id == activeTimelineStep.value.exerciseId
    )!
)
const activeIndexString = computed(
  () => stepIndex.value + 1 + " / " + workout.timeline.length
)

const waitMs = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

setShowVideo(false)

//enum PlayerState
//     {
//         UNSTARTED = -1,
//         ENDED = 0,
//         PLAYING = 1,
//         PAUSED = 2,
//         BUFFERING = 3,
//         CUED = 5
//     }
const playerState = ref(-1 as YT.PlayerState)
const paused = ref(false)
let ytPlayer: YT.Player
let symbolTimer: any

const goNext = () => {
  if (stepIndex.value == workout.timeline.length - 1) return
  stepIndex.value++
}
const goBack = () => {
  // if we are > 2 seonds into video, get to start of video
  if (ytPlayer.getCurrentTime() > activeExercise.value.startSecond + 2) {
    ytPlayer.seekTo(activeExercise.value.startSecond, true)
    return
  }

  if (stepIndex.value == 0) return

  stepIndex.value--
}

const exitVideo = () => router.back()

const playOrPause = () => {
  if (playerState.value == YT.PlayerState.PLAYING) {
    ytPlayer.pauseVideo()
    paused.value = true

    showSymbol.value = "pause"
    clearTimeout(symbolTimer)
    symbolTimer = setTimeout(() => (showSymbol.value = "none"), 500)
  } else {
    ytPlayer.playVideo()
    setTimeout(() => {
      paused.value = false
    }, 100)

    showSymbol.value = "play"
    clearTimeout(symbolTimer)
    symbolTimer = setTimeout(() => (showSymbol.value = "none"), 500)
  }
}

// watch(
//   () => playerState.value,
//   (playerState) => {
//     console.log("playerState", playerState)
//   }
// )

const initPlayer = async () => {
  return new Promise((resolve) => {
    YoutubeIFrameLoader.load((YT) => {
      ytPlayer = new YT.Player("player", {
        playerVars: {
          controls: 0,
          modestbranding: 1,
          showInfo: 0,
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

const timeProgress = ref(0)
const secondsLeft = ref(0)
const isPlaying = ref(false)
let lastBeepSoundIndex = -1

const playTimelineStep = async (timelineStep: number, signal: AbortSignal) => {
  if (!workout.timeline[timelineStep]) return
  const exerciseId = workout.timeline[timelineStep].exerciseId
  const exercise = workoutStore.exercises.find((e) => e.id == exerciseId)!

  ytPlayer.loadVideoById(exercise.srcId, exercise.startSecond)
  ytPlayer.mute()
  ytPlayer.playVideo()

  await waitMs(200)
  setShowVideo(true)

  isPlaying.value = true

  return new Promise((resolve, reject) => {
    let aborted = false

    requestAnimationFrame(function step(time: number) {
      const currentTime = ytPlayer.getCurrentTime()

      timeProgress.value =
        (exercise.endSecond - currentTime) /
        (exercise.endSecond - exercise.startSecond)

      secondsLeft.value = Math.round(exercise.endSecond - currentTime)

      // console.log("progress", timeProgress.value, secondsLeft.value)

      if (currentTime > exercise.endSecond - 4.5) {
        if (timelineStep != lastBeepSoundIndex) {
          var audio = new Audio(beepSound)
          audio.play()
          lastBeepSoundIndex = timelineStep
        }
      }

      if (currentTime > exercise.endSecond - 0.5) {
        setShowVideo(false)
      }
      if (currentTime > exercise.endSecond) {
        ytPlayer.stopVideo()

        stepIndex.value++
        resolve(undefined)
        isPlaying.value = false
        return
      }
      if (aborted) return
      requestAnimationFrame(step)
    })

    signal.addEventListener("abort", () => {
      ytPlayer.stopVideo()
      aborted = true
      isPlaying.value = false
      // clearInterval(interval)
      reject(new DOMException("Video Play Cancelled", "AbortError"))
    })
  })
}

// play queue: timeline items
// play next thing which is active thing
// once play ends "jumpToNext" video and add index
// watcher on index then controls video player
watch(
  () => stepIndex.value,
  (step) => {
    // cancel any old play promise in case we skipped segment
    controller.abort()

    controller = new AbortController()
    playTimelineStep(step, controller.signal)
  }
)

const circleColor = ref("#55b303")

/** from https://stackoverflow.com/a/27905268/830213 */
function circlePath(cx: number, cy: number, r: number) {
  return (
    "M " +
    cx +
    " " +
    cy +
    " m -" +
    r +
    ", 0 a " +
    r +
    "," +
    r +
    " 0 1,0 " +
    r * 2 +
    ",0 a " +
    r +
    "," +
    r +
    " 0 1,0 -" +
    r * 2 +
    ",0"
  )
}
const svgPath = computed(() => circlePath(22, 22, 50))

onMounted(async () => {
  await initPlayer()
  await playTimelineStep(0, controller.signal)
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

svg {
  filter: drop-shadow(0 0 3px rgb(0 0 0 / 0.2))
    drop-shadow(0 0 12px rgb(0 0 0 / 0.1));
  /** see https://stackoverflow.com/a/39377282/830213, we need this in addition to y/height hack on filter */
  overflow: visible;
}

path {
  stroke: currentColor;
  stroke-width: var(--stroke-width);
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  fill-opacity: 0;
}

path.base {
  color: #ccc;
}

.dark path.base {
  color: #444;
}
path.value {
  color: var(--chart-color);
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--stroke-offset));
  /* transition: stroke-dashoffset 0.5s; */
}

.timer {
  text-shadow: 0px 0px 6px hsl(0, 0%, 10%), 0px 0px 10px hsl(0, 0%, 50%);
}
</style>
