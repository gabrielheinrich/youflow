<template>
  <div @dragover.prevent.stop="onDragOver">
    <transition-group name="draggable-item-list">
      <draggable-item
        v-for="(item, index) in items"
        :key="item.id"
        :item="item"
        :containerId="id"
        :position="index"
        @itemDragOver="onItemDragOver"
        @dragenter.prevent
      >
        <slot name="item" :item="item.data"></slot>
      </draggable-item>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { PropType, toRefs } from "vue";
import DraggableItem from "./DraggableItem.vue";
import { useDraggableContainer } from "../composables/draggable";

export default {
  name: "Draggable",
  components: {
    DraggableItem,
  },
  props: {
    modelValue: {
      type: Array as PropType<any[]>,
      required: true,
    },
    transition: {
      default: "0",
      type: String,
    },
  },
  setup(props, context) {
    const { modelValue } = toRefs(props);
    const { id, items, onDragOver, onItemDragOver } = useDraggableContainer(
      modelValue,
      context
    );

    return { id, items, onDragOver, onItemDragOver };
  },
  computed: {
    transitionStyle() {
      return `transform ${this.transition}ms`;
    },
  },
};
</script>

<style scoped>
.draggable-item-list-move {
  transition: v-bind(transitionStyle);
}
</style>
