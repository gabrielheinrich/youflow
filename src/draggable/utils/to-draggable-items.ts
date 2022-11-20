import { DraggableItem } from "../composables/draggable";

import { getIdGenerator } from "./id-generator";

const draggableItemIdGenrator = getIdGenerator();

export const toDraggableItems = (arr: Array<any>): Array<DraggableItem> => {
  return arr.map((e) => ({
    id: draggableItemIdGenrator().toString(),
    data: e,
  }));
};

export const toOriginalArray = (arr: Array<DraggableItem>): Array<any> => {
  return arr.map((e) => e.data);
};
