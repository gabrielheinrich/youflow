<template>
  <div class="w-full overflow-hidden relative aspect-video">
    <div class="absolute inset-0">
      <div ref="playerRef" class="w-full h-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import YoutubeIFrameLoader from "youtube-iframe";
import { ref, onMounted, shallowRef, watchEffect, watch } from "vue";

const props = defineProps<{
  startPosition: number;
  endPosition: number;
  position: number;
  playing: boolean;
  videoId: string;
  seekPosition?: number;
  stopAtEnd: boolean;
}>();

console.log(props);

const mounted = ref(false);

const emit = defineEmits<{
  (event: "update:position", payload: number): void;
  (event: "update:playing", payload: boolean): void;
  (event: "loaded", payload: { duration: number }): void;
}>();

const playerState = ref(-1 as YT.PlayerState);
const playerRef = ref<HTMLElement>();

let loadedVideoId = "";

let lastDuration = 0;
let ytPlayer = shallowRef<YT.Player>();
const initPlayer = async (): Promise<YT.Player> => {
  return new Promise((resolve) => {
    YoutubeIFrameLoader.load((YT) => {
      const player = new YT.Player(playerRef.value, {
        playerVars: {
          controls: 0,
          modestbranding: 1,
          showInfo: 0,
          cc_load_policy: 0,
        },
        events: {
          onReady: () => {
            console.log("ready");
            resolve(player);
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            playerState.value = event.data;
            if (player.getDuration() !== lastDuration) {
              lastDuration = player.getDuration();
              emit("loaded", { duration: lastDuration });
            }
            if (event.data == YT.PlayerState.PLAYING && !props.playing) {
              emit("update:playing", true);
            } else if (event.data == YT.PlayerState.PAUSED && props.playing) {
              emit("update:playing", false);
            }
          },
        },
      });
    });
  });
};

let lastStartPosition = 0;

// Sync videoId
watchEffect(async () => {
  if (!mounted.value) return;
  if (props.videoId) {
    if (!ytPlayer.value) {
      console.log("creating Player");
      ytPlayer.value = await initPlayer(props.videoId);
      ytPlayer.value.mute();
    }

    if (props.videoId != loadedVideoId) {
      ytPlayer.value.loadVideoById(props.videoId, props.startPosition);
      loadedVideoId = props.videoId;
      lastStartPosition = props.startPosition;
      ytPlayer.value.playVideo();
      // ytPlayer.value.seekTo(props.startPosition, true);
    }
    if (props.startPosition != lastStartPosition) {
      ytPlayer.value.seekTo(props.startPosition, true);
      lastStartPosition = props.startPosition;
    }
  } else if (ytPlayer.value) {
    console.log("destroying player");
    ytPlayer.value.destroy();
    ytPlayer.value = undefined;
  }
});

watch(
  () => props.seekPosition,
  () => {
    console.log("position changed");
    if (props.seekPosition != undefined) {
      ytPlayer.value?.seekTo(props.seekPosition, true);
      if (props.playing) {
        ytPlayer.value!.playVideo();
      }
    }
  }
);

onMounted(() => {
  const interval = setInterval(() => {
    if (!ytPlayer.value) return;

    emit("update:position", ytPlayer.value.getCurrentTime());
    if (ytPlayer.value.getCurrentTime() >= props.endPosition) {
      console.log("at end", props.stopAtEnd);
      if (props.stopAtEnd) {
        console.log("stopping");
        // ytPlayer.value.seekTo(props.endPosition, true);
        ytPlayer.value.pauseVideo();
      } else {
        ytPlayer.value.seekTo(props.startPosition, true);
      }
    }
  }, 250);
  return () => {
    clearInterval(interval);
  };
});

// watch(
//   () => props.startPosition,
//   () => {
//     if (!ytPlayer.value) return;
//     ytPlayer.value.seekTo(props.startPosition, true);
//   }
// );

// // Sync position
// watchEffect(() => {
//   if (!ytPlayer.value) return;

//   if (Math.abs(props.position - ytPlayer.value.getCurrentTime()) > 1) {
//     ytPlayer.value.seekTo(props.position, true);
//   }
// });

// Sync playstate
watchEffect(() => {
  if (!ytPlayer.value) return;

  if (
    props.playing &&
    ytPlayer.value.getPlayerState() != YT.PlayerState.PLAYING
  ) {
    ytPlayer.value.playVideo();
  } else if (
    !props.playing &&
    ytPlayer.value.getPlayerState() == YT.PlayerState.PLAYING
  ) {
    ytPlayer.value.pauseVideo();
  }
});

onMounted(async () => {
  mounted.value = true;
});
</script>

<style scoped></style>
