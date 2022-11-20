import { Exercise } from "@/types";

export const getExerciseThumbnail = (exercise?: Exercise): string => {
  if (!exercise) return "";
  if (exercise.thumbnailUrl) {
    return exercise.thumbnailUrl;
  }
  return `http://img.youtube.com/vi/${exercise.srcId}/hqdefault.jpg`;
};
