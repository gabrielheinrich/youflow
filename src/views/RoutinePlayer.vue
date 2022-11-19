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
import { ref, onMounted, computed } from "vue"
import YoutubeIFrameLoader from "youtube-iframe"
import { useRouter } from "vue-router"

const router = useRouter()

const videoElement = ref<HTMLElement | null>(null)

const iframeClass = ref("blackedout")

const setShowVideo = (shouldShow: boolean) => {
  iframeClass.value = shouldShow ? "visible" : "blackedout"
}

setShowVideo(false)

const goNext = () => router.back()
const goBack = () => router.back()
const exitVideo = () => router.back()
// console.log(YoutubeIFrameLoader)

const playClip = async (
  videoId: string,
  startTime: number,
  endTime: number
) => {
  return new Promise((resolve, reject) => {
    YoutubeIFrameLoader.load((YT) => {
      const player = new YT.Player("player", {
        // height: "390",
        // width: "640",
        videoId: videoId,
        playerVars: {
          controls: 0,
        },
        events: {
          onReady: () => {
            player.seekTo(startTime, true)
            player.mute()
            player.playVideo()

            setTimeout(() => {
              setShowVideo(true)
            }, 1000)

            const interval = setInterval(() => {
              console.log(player.getCurrentTime())

              if (player.getCurrentTime() > endTime - 1) {
                setShowVideo(false)
              }
              if (player.getCurrentTime() > endTime) {
                player.pauseVideo()
                clearInterval(interval)
                player.destroy()
                resolve(undefined)
              }
            }, 1000)
          },
        },
      })
    })
  })
}

onMounted(async () => {
  await playClip("raUEsDttCL4", 4 * 60 + 14, 4 * 60 + 18)
  await playClip("raUEsDttCL4", 4 * 60 + 14, 4 * 60 + 18)
  await playClip("raUEsDttCL4", 4 * 60 + 14, 4 * 60 + 18)
  await playClip("ZbtVVYBLCug", 8 * 60 + 55, 9 * 60 + 30)
})

// const iframeRef = ref();

// onMounted(() => {
//   const player = new YTPlayer("#player");
//   player.load("raUEsDttCL4");
// });
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
