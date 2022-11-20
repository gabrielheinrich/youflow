<template>
  <div
    class="aspect-video bg-black text-white grid place-content-center bg-cover bg-center"
    :style="{ backgroundImage: `url(${thumbnailUrl})` }"
    ref="draggableItemEl"
    draggable="true"
    @transitionStart="transitionStart"
    @transitionEnd="transitionEnd"
    @dragover.prevent.stop="onDragOver"
    @dragstart.stop="onDragStart"
    @dragend.stop="onDragEnd"
    @dragenter.prevent
    :class="{ isDragging }"
  >
    <div class="bg-black bg-opacity-40 px-2 rounded-md font-medium py-1">
      {{ exercise.name }}
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  nextTick,
  PropType,
  defineEmits,
  computed,
} from "vue";
import { useDraggableItem } from "@/draggable";
import { ulid } from "ulid";
import { Exercise, TimelineItem } from "@/types";
import { getExerciseThumbnail } from "@/utils/getExerciseThumbnail";

interface DragTimelineItem {
  id: string;
  data: TimelineItem;
}

export default defineComponent({
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true,
    },
  },
  setup(props, context) {
    const newClipPosition = ref<number>(1000);
    const externalContainerId = ref<number>(124124);

    const increment = () => {
      const id = ulid();
      item.value = {
        id,
        data: {
          ...item.value.data,
          id,
        },
      };
    };
    const id = ulid();

    const item = ref<DragTimelineItem>({
      id,
      data: {
        id,
        exerciseId: props.exercise.id,
        exerciseReps: 1,
        cooldownTimeSecs: 0,
      },
    });

    const thumbnailUrl = computed(() => {
      return getExerciseThumbnail(props.exercise);
    });

    const {
      draggableItemEl,
      isDragging,
      onDragStart,
      onDragOver,
      onDragEnd: internalOnDragEnd,
      transitionStart,
      transitionEnd,
    } = useDraggableItem(item, newClipPosition, externalContainerId, context);

    const onDragEnd = () => {
      context.emit("dragend");
      internalOnDragEnd();
      increment();
    };

    return {
      exercise: props.exercise,
      draggableItemEl,
      isDragging,
      onDragStart,
      onDragOver,
      onDragEnd,
      transitionStart,
      transitionEnd,
      thumbnailUrl,
    };
  },
});
</script>

<style scoped></style>
