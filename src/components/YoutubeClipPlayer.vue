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
  mute?: boolean;
}>();

const mounted = ref(false);

const mute = props.mute ?? true;

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
      ytPlayer.value = await initPlayer(props.videoId);
      if (mute) {
        ytPlayer.value.mute();
      }
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
    ytPlayer.value.destroy();
    ytPlayer.value = undefined;
  }
});

watch(
  () => props.seekPosition,
  () => {
    if (props.seekPosition != undefined) {
      ytPlayer.value?.seekTo(props.seekPosition, true);
      if (props.playing) {
        ytPlayer.value!.playVideo();
      }
    }
  }
);

let handledOverflow = false;
onMounted(() => {
  const interval = setInterval(() => {
    if (!ytPlayer.value) return;

    emit("update:position", ytPlayer.value.getCurrentTime());
    const hasRange = props.endPosition != props.startPosition;
    if (
      hasRange &&
      ytPlayer.value.getCurrentTime() > props.endPosition &&
      ytPlayer.value.getPlayerState() == YT.PlayerState.PLAYING
    ) {
      if (props.stopAtEnd) {
        if (ytPlayer.value.getCurrentTime() - props.endPosition > 4) {
          ytPlayer.value.seekTo(props.startPosition, true);
        } else {
          ytPlayer.value.seekTo(props.endPosition, true);
        }
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
