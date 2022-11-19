import { Exercise, Workout } from "@/types";
import { acceptHMRUpdate, defineStore } from "pinia";
import { getExerciseThumbnail } from "@/utils/getExerciseThumbnail";

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
      const exercise: Exercise = state.exercises.find((e) => e.id === id);
      return getExerciseThumbnail(exercise);
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
