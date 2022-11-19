<template>
  <div
    class="aspect-video bg-black text-white grid place-content-center"
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
    {{ exercise.name }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, PropType, defineEmits } from "vue";
import { useDraggableItem } from "@/draggable";
import { ulid } from "ulid";
import { Exercise, TimelineItem } from "@/types";

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
    };
  },
});
</script>

<style scoped></style>