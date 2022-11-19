import { Exercise, Workout } from "@/types";
import { acceptHMRUpdate, defineStore } from "pinia";

interface WorkoutStore {
  workouts: Workout[];
  exercises: Exercise[];
}

const useStore = defineStore({
  id: `user`,
  state: () => ({} as WorkoutStore),
  actions: {},
  getters: {
    getExerciseById: (state) => (id: string) => {
      return state.exercises.find((e) => e.id === id);
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
