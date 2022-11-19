import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import RoutineEditor from "@/views/RoutineEditor.vue";
import RoutinePlayer from "@/views/RoutinePlayer.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/editor/:id",
      name: "RoutineEditor",
      component: RoutineEditor,
    },
    {
      path: "/player/:id",
      name: "RoutinePlayer",
      component: RoutinePlayer,
    },
  ],
});

export default router;
