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
        enter-to-class="scale-105 opacity-0"
        leave-active-class="hidden"
      >
        <div
          v-if="showSymbol == 'pause'"
          class="text-white rounded-full bg-gray-800 p-4"
        >
          <i-material-symbols-pause-outline class="w-16 h-16">
          </i-material-symbols-pause-outline>
        </div>
      </transition>
      <transition
        enter-active-class="transition-[transform,opacity] duration-500 ease"
        enter-from-class="scale-75 opacity-100"
        enter-to-class="scale-105 opacity-0"
        leave-active-class="hidden"
      >
        <div
          v-if="showSymbol == 'play'"
          class="text-white rounded-full bg-gray-800 p-4"
        >
          <i-material-symbols-play-arrow class="w-16 h-16">
          </i-material-symbols-play-arrow>
        </div>
      </transition>
    </div>
  </div>

  <div
    class="absolute flex gap-4 justify-center items-end top-0 h-[100px] w-screen z-40"
    :class="{ 'bg-black': paused }"
  >
    <TimelineItemOverview
      :timeline-item="activeTimelineItem"
      :exercise="activeExercise"
      :phase="stepPhase"
      :exercise-rep="stepExerciseRep"
      :workout-length="workout.timeline.length"
      :segment-index="timelineItemIndex"
      :seconds-left="secondsLeft"
    >
    </TimelineItemOverview>
  </div>
  <div
    class="absolute flex gap-4 justify-center items-center bottom-0 h-[180px] w-screen z-[1000]"
    :class="{ 'bg-black': paused }"
  >
    <div class="rounded-lg flex justify-center gap-4 h-8 text-white">
      <button @click="goBack" class="btn">
        <i-material-symbols-arrow-back-ios-rounded
          class="translate-x-1"
        ></i-material-symbols-arrow-back-ios-rounded>
      </button>
      <button @click="playOrPause" class="btn">
        <i-material-symbols-play-arrow
          v-if="playerState != 1"
          class=""
        ></i-material-symbols-play-arrow>
        <i-material-symbols-pause-outline
          v-else
          class=""
        ></i-material-symbols-pause-outline>
      </button>
      <button @click="goNext" class="btn">
        <i-material-symbols-arrow-forward-ios-rounded
          class="translate-x-0"
        ></i-material-symbols-arrow-forward-ios-rounded>
      </button>

      <button @click="exitVideo" class="btn">
        <i-material-symbols-fullscreen-exit
          class="translate-x-0"
        ></i-material-symbols-fullscreen-exit>
      </button>
    </div>
  </div>

  <div
    v-if="isPlaying"
    class="absolute pointer-events-none top-0 left-0 flex items-center w-screen h-screen z-[2000]"
  >
    <div class="w-screen aspect-video relative">
      <div class="absolute inset-0 grid place-content-center">
        <div
          class="text-white font-bold text-6xl flex flex-col items-center"
          v-if="stepPhase == 'prepare'"
        >
          <h1
            class="bg-black bg-opacity-30 mb-2 px-2 py-1 rounded-md text-[8vh]"
          >
            Prepare
          </h1>
          <h2 class="bg-black bg-opacity-30 px-2 py-1 rounded-md text-[15vh]">
            {{ activeExercise.name }}
          </h2>
        </div>
        <transition
          enter-active-class="transition-[transform,opacity] duration-500 ease"
          leave-active-class="transition-[transform,opacity] duration-1000 ease"
          enter-from-class="scale-50 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-to-class="scale-150 opacity-0"
        >
          <div
            class="text-white font-bold text-[50] flex flex-col items-center"
            v-if="stepPhase == 'exercise' && timelineDuration - secondsLeft < 2"
          >
            <h1 class="bg-black bg-opacity-30 px-8 py-2 rounded-lg text-[15vh]">
              Start
            </h1>
          </div>
        </transition>

        <transition
          enter-active-class="transition-[transform,opacity] duration-500 ease"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
        >
          <div
            class="text-white font-bold text-6xl flex flex-col items-center"
            v-if="stepPhase == 'cooldown'"
          >
            <h2 class="bg-black bg-opacity-30 px-2 py-1 rounded-md text-[15vh]">
              Take a breath
            </h2>
            <h3 class="bg-black bg-opacity-30 px-2 py-1 rounded-md text-lg">
              You're doing great!
            </h3>
          </div>
        </transition>
      </div>
      <div class="relative w-36 h-36 flex items-center justify-center">
        <div
          class="absolute inset-2 bg-black bg-opacity-10 rounded-full z-10"
        ></div>
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

<script lang="ts">
export type StepPhaseType = "prepare" | "exercise" | "cooldown";
</script>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onUnmounted } from "vue";
import beepSound from "../../public/beeps.wav";
import YoutubeIFrameLoader from "youtube-iframe";
import { useRouter } from "vue-router";
import { getWorkoutStore } from "@/stores/workoutStore";

import TimelineItemOverview from "./RoutinePlayerTimelineItemOverview.vue";
import { Exercise } from "@/types";

const workoutStore = getWorkoutStore();

const router = useRouter();

const props = defineProps<{
  id: string;
}>();

type SymbolType = "none" | "play" | "pause";
const iframeClass = ref("blackedout");
const showSymbol = ref("none" as SymbolType);

const setShowVideo = (shouldShow: boolean) => {
  iframeClass.value = shouldShow ? "visible" : "blackedout";
};

const workout = workoutStore.workouts.find((w) => w.id == props.id)!;
const timelineItemIndex = ref(0);
/** used to cancel current video play on skip */
let controller = new AbortController();

const activeTimelineItem = computed(
  () => workout.timeline[timelineItemIndex.value]
);
const activeExercise = computed(
  () =>
    workoutStore.exercises.find(
      (e) => e.id == activeTimelineItem.value.exerciseId
    )!
);
const waitMs = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isPlaying = ref(false);
let beepPlayedForTimeline = false;

let audio = new Audio(beepSound);
audio.volume = 0.2;

const resetAudio = () => {
  audio.pause();
  audio = new Audio(beepSound);
  audio.volume = 0.2;
  beepPlayedForTimeline = false;
};

setShowVideo(false);

//enum PlayerState
//     {
//         UNSTARTED = -1,
//         ENDED = 0,
//         PLAYING = 1,
//         PAUSED = 2,
//         BUFFERING = 3,
//         CUED = 5
//     }
const playerState = ref(-1 as YT.PlayerState);
const paused = ref(false);
let ytPlayer: YT.Player;
let symbolTimer: any;

// watch(
//   () => playerState.value,
//   (playerState) => {
//     console.log("playerState", playerState)
//   }
// )

const goNext = () => {
  if (timelineItemIndex.value == workout.timeline.length - 1) return;
  timelineItemIndex.value++;
};
const goBack = () => {
  // if we are > 2 seonds into video, get to start of video
  if (ytPlayer.getCurrentTime() > activeExercise.value.startSecond + 2) {
    resetTimeline(timelineItemIndex.value);
    return;
  }

  if (timelineItemIndex.value == 0) return;

  timelineItemIndex.value--;
};

const exitVideo = () => router.back();

const playOrPause = () => {
  if (playerState.value == YT.PlayerState.PLAYING) {
    ytPlayer.pauseVideo();
    paused.value = true;
    audio.pause();

    showSymbol.value = "pause";
    clearTimeout(symbolTimer);
    symbolTimer = setTimeout(() => (showSymbol.value = "none"), 500);
  } else {
    ytPlayer.playVideo();
    setTimeout(() => {
      paused.value = false;
    }, 100);

    if (audio.currentTime > 0) {
      audio.play();
    }

    showSymbol.value = "play";
    clearTimeout(symbolTimer);
    symbolTimer = setTimeout(() => (showSymbol.value = "none"), 500);
  }
};

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
            ytPlayer.mute();
            resolve(undefined);
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            playerState.value = event.data;
          },
        },
      });
    });
  });
};

const timeProgress = ref(0);
const secondsLeft = ref(0);
const timelineDuration = ref(0);
const stepPhase = ref("prepare" as StepPhaseType);
const stepExerciseRep = ref(0);

const playTimelineItem = async (
  timelineStepIndex: number,
  signal: AbortSignal
) => {
  stepExerciseRep.value = 0;

  const timelineStep = workout.timeline[timelineStepIndex];
  if (!timelineStep) return;
  const exercise = workoutStore.exercises.find(
    (e) => e.id == timelineStep.exerciseId
  )!;

  announceExercise("Next Exercise: " + exercise.name);

  /** PREPARE phase */
  stepPhase.value = "prepare";

  // todo
  const PREPARE_LENGTH = 10;

  await playTimelineItemStep(
    exercise,
    (progress, secsLeft) => {
      timeProgress.value = 1 - progress;
      // console.log("p", progress)

      secondsLeft.value = secsLeft;
    },
    () => {},
    signal,
    PREPARE_LENGTH,
    {
      fadeout: false,
      stopAtEnd: false,
    }
  );

  /** EXERCISE phase with reps */
  stepPhase.value = "exercise";

  const repCount = timelineStep.exerciseReps;
  // let timeProgressBase = 0;
  // let secondsLeftBase = 0;
  const secondsPerExercise = exercise.endSecond - exercise.startSecond;
  const totalDuration = secondsPerExercise * repCount;

  await playTimelineItemStep(
    exercise,
    (progress, secsLeft) => {
      timeProgress.value = 1 - progress;
      secondsLeft.value = secsLeft;

      stepExerciseRep.value = Math.floor(progress * repCount) + 1;
    },
    () => {},
    signal,
    totalDuration,
    {
      fadeout: true,
      stopAtEnd: true,
    }
  );
  // for (let i = 0; i < repCount; i++) {
  //   stepExerciseRep.value = i + 1;
  //   timeProgressBase = 1 - i * (1 / repCount);
  //   secondsLeftBase = (repCount - (i + 1)) * secondsPerExercise;

  //   // console.log("timeProgressBase", timeProgressBase)

  //   // timeProgressBase =
  // }

  /** COOLDOWN phase with reps */
  if (timelineStep.cooldownTimeSecs) {
    stepPhase.value = "cooldown";

    runCooldownCountdown(timelineStep.cooldownTimeSecs);
    await waitMs(timelineStep.cooldownTimeSecs * 1000);
  }

  timelineItemIndex.value++;
};

const runCooldownCountdown = (seconds: number) => {
  const targetTime = performance.now() + seconds * 1000;
  const startTime = performance.now();
  isPlaying.value = true;

  requestAnimationFrame(function step(time: number) {
    if (paused.value) {
      // TODO: bug with cooldown pause/play not working, this should be handled by saving timestamp on pause etc.
    }
    timeProgress.value = (targetTime - time) / (targetTime - startTime);

    secondsLeft.value = Math.round((targetTime - time) / 1000);

    if (time > targetTime) {
      isPlaying.value = false;
      return;
    }
    requestAnimationFrame(step);
  });
};

// const playTimelineRepeatStep = async (
//   exercise: Exercise,
//   onTimeUpdate: (progress: number, secondsLeft: number) => void,
//   signal: AbortSignal
// ) => {
//   ytPlayer.playVideoAt(exercise.startSecond);

//   return new Promise((resolve, reject) => {
//     let aborted = false;

//     requestAnimationFrame(function step() {
//       const currentTime = ytPlayer.getCurrentTime();

//       if (currentTime > exercise.startSecond) {
//         onTimeUpdate(
//           (exercise.endSecond - currentTime) /
//             (exercise.endSecond - exercise.startSecond),
//           Math.round(exercise.endSecond - currentTime)
//         );

//         isPlaying.value = true;
//       }

//       // console.log("progress", timeProgress.value, secondsLeft.value)

//       if (currentTime > exercise.endSecond - 4.5) {
//         // if (!beepPlayedForTimeline) {
//         //   audio.play()
//         //   beepPlayedForTimeline = true
//         // }
//       }

//       if (currentTime > exercise.endSecond - 0.5) {
//       }
//       if (currentTime > exercise.endSecond) {
//         ytPlayer.stopVideo();

//         resolve(undefined);
//         isPlaying.value = false;
//         return;
//       }
//       if (aborted) return;
//       requestAnimationFrame(step);
//     });

//     signal.addEventListener("abort", () => {
//       ytPlayer.stopVideo();
//       audio.pause();
//       aborted = true;
//       isPlaying.value = false;

//       // clearInterval(interval)
//       reject(new DOMException("Video Play Cancelled", "AbortError"));
//     });
//   });
// };

let loadedVideoId = "";

const playTimelineItemStep = async (
  exercise: Exercise,
  onTimeUpdate: (progress: number, secondsLeft: number) => void,
  onEnd: () => void,
  signal: AbortSignal,
  totalDuration: number,
  options: {
    fadeout: boolean;
    stopAtEnd: boolean;
  }
) => {
  timelineDuration.value = totalDuration;

  if (
    exercise.srcId != loadedVideoId ||
    isPlaying.value == false ||
    ytPlayer.getPlayerState() != YT.PlayerState.PLAYING
  ) {
    ytPlayer.loadVideoById(exercise.srcId, exercise.startSecond);
    loadedVideoId = exercise.srcId;
    await waitMs(200);
    ytPlayer.playVideo();
  } else {
    ytPlayer.seekTo(exercise.startSecond, true);
    await waitMs(200);
  }

  let timeElapsed = 0;
  let currentTime = exercise.startSecond;

  setShowVideo(true);

  resetAudio();

  return new Promise((resolve, reject) => {
    let aborted = false;

    requestAnimationFrame(function step() {
      const newTime = ytPlayer.getCurrentTime();
      if (newTime < exercise.endSecond && newTime > currentTime) {
        timeElapsed += newTime - currentTime;
        onTimeUpdate(
          timeElapsed / totalDuration,
          Math.round(totalDuration - timeElapsed)
        );

        if (!isPlaying.value) isPlaying.value = true;
      }
      if (newTime) {
        currentTime = newTime;
      }

      // console.log("progress", timeProgress.value, secondsLeft.value)

      if (timeElapsed > totalDuration - 4.5) {
        if (!beepPlayedForTimeline) {
          audio.play();
          beepPlayedForTimeline = true;
        }
      }

      if (options.fadeout && timeElapsed > totalDuration - 2) {
        setShowVideo(false);
      }
      if (timeElapsed >= totalDuration) {
        if (options.stopAtEnd) {
          ytPlayer.stopVideo();
          isPlaying.value = false;
        }

        resolve(undefined);
        return;
      }
      if (currentTime >= exercise.endSecond) {
        ytPlayer.seekTo(exercise.startSecond, true);
        currentTime = exercise.startSecond;
      }
      if (aborted) return;
      requestAnimationFrame(step);
    });

    signal.addEventListener("abort", () => {
      console.log("stop");
      ytPlayer.stopVideo();
      audio.pause();
      aborted = true;
      isPlaying.value = false;

      // clearInterval(interval)
      reject(new DOMException("Video Play Cancelled", "AbortError"));
    });
  });
};

const resetTimeline = (step: number) => {
  controller.abort();

  controller = new AbortController();
  playTimelineItem(step, controller.signal);
};

// play queue: timeline items
// play next thing which is active thing
// once play ends "jumpToNext" video and add index
// watcher on index then controls video player
watch(
  () => timelineItemIndex.value,
  (step) => {
    resetTimeline(step);
  }
);

/**
 * PROGRESS CIRCLE
 */

const circleColor = ref("#3D81F6");

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
  );
}
const svgPath = computed(() => circlePath(22, 22, 50));

var msg = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();

/**
 * SPEECH TO TEXT ANNOUNCEMENT
 */
const announceExercise = (announcement: string) => {
  msg.voice = voices[0];
  msg.volume = 1; // From 0 to 1
  msg.rate = 0.9; // From 0.1 to 10
  msg.pitch = 1; // From 0 to 2
  msg.text = announcement;
  msg.lang = "en";
  speechSynthesis.speak(msg);
};

onMounted(async () => {
  await initPlayer();
  await playTimelineItem(0, controller.signal);
});

onUnmounted(() => {
  ytPlayer.destroy();

  controller.abort();

  audio.pause();
  speechSynthesis.pause();
});
</script>

<style scoped>
.videoframe {
  background-color: black;
  transition: opacity 1.5s;
}
.blackedout {
  opacity: 100;
}

.visible {
  opacity: 0;
  transition-delay: 0.5s;
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
/* 
.timer {
  text-shadow: 0px 0px 6px hsl(0, 0%, 10%), 0px 0px 10px hsl(0, 0%, 50%);
} */

.btn {
  @apply rounded-full text-2xl bg-black bg-opacity-50 hover:bg-opacity-80 text-white border h-16 w-16 grid place-content-center;
}
</style>
