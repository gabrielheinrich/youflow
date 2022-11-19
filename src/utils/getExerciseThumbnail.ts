import { Exercise } from "@/types";

export const getExerciseThumbnail = (exercise: Exercise): string => {
  if (exercise.thumbnailUrl) {
    return exercise.thumbnailUrl;
  }
  return `http://img.youtube.com/vi/${exercise.srcId}/0.jpg`;
};
