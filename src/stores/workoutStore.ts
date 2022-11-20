import { Exercise, Workout } from "../types";
import { acceptHMRUpdate, defineStore } from "pinia";
import { getExerciseThumbnail } from "../utils/getExerciseThumbnail";

interface WorkoutStore {
  workouts: Workout[];
  exercises: Exercise[];
}

const useStore = defineStore("workouts", {
  state: () =>
    ({
      workouts: [],
      exercises: [],
    } as WorkoutStore),
  actions: {},
  getters: {
    getExerciseById: (state) => (id: string) => {
      return state.exercises.find((e) => e.id === id);
    },
    getExerciseThumbnail: (state) => (id: string) => {
      const exercise = state.exercises.find((e) => e.id === id);
      return getExerciseThumbnail(exercise);
    },
    getWorkoutThumbnail(state) {
      return (id: string) => {
        const workout = state.workouts.find((w) => w.id === id)!;
        if (!workout) return "";
        if (workout.timeline.length) {
          return this.getExerciseThumbnail(workout.timeline[0].exerciseId);
        }
      };
    },
  },
});

if (import.meta.hot) {
  // see https://pinia.esm.dev/cookbook/hot-module-replacement.html
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}

// ensure singleton semantics of this store
export function getWorkoutStore() {
  return useStore();
}
