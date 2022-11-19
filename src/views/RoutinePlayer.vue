<template>
  <div class="grid place-content-center w-screen h-screen">
    <div
      :style="{
        position: 'relative',
        width: '640px',
        height: '390px',
      }"
    >
      <div id="player" :class="iframeClass">
        <!-- <iframe
      ref="iframeRef"
      width="560"
      height="315"
      src="https://www.youtube.com/embed/raUEsDttCL4?clip=Ugkxswq6MwMSo37BrTO2GlzTu9TlXMRbMwTF&amp;clipt=EIWaDxiMrxI"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe> -->
      </div>
      <div
        :class="iframeClass"
        class="videoframe"
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
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import YoutubeIFrameLoader from "youtube-iframe";

const iframeClass = ref("blackedout");

const setShowVideo = (shouldShow: boolean) => {
  iframeClass.value = shouldShow ? "visible" : "blackedout";
};

setShowVideo(false);

console.log(YoutubeIFrameLoader);

const playClip = async (
  videoId: string,
  startTime: number,
  endTime: number
) => {
  return new Promise((resolve, reject) => {
    YoutubeIFrameLoader.load((YT) => {
      const player = new YT.Player("player", {
        height: "390",
        width: "640",
        videoId: videoId,
        playerVars: {
          controls: 0,
        },
        events: {
          onReady: () => {
            player.seekTo(startTime, true);
            player.mute();
            player.playVideo();

            setTimeout(() => {
              setShowVideo(true);
            }, 1000);

            const interval = setInterval(() => {
              console.log(player.getCurrentTime());

              if (player.getCurrentTime() > endTime - 1) {
                setShowVideo(false);
              }
              if (player.getCurrentTime() > endTime) {
                player.pauseVideo();
                clearInterval(interval);
                player.destroy();
                resolve(undefined);
              }
            }, 1000);
          },
        },
      });
    });
  });
};

onMounted(async () => {
  await playClip("raUEsDttCL4", 4 * 60 + 14, 4 * 60 + 24);
  await playClip("ZbtVVYBLCug", 8 * 60 + 55, 9 * 60 + 30);
});

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
