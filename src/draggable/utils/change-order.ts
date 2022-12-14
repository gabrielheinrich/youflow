import { DraggableItem } from "../composables/draggable";

export const changeArrayOrder = (
  arr: Array<DraggableItem>,
  target: DraggableItem,
  newIndexOfTarget: number
): Array<DraggableItem> => {
  let newArr = arr.filter((e) => e.id !== target.id);
  newArr.splice(newIndexOfTarget, 0, { ...target });
  return newArr;
};
