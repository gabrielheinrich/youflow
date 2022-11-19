import { createPinia } from "pinia";
import { createPersistedStatePlugin } from "pinia-plugin-persistedstate-2";
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();
const installPersistedStatePlugin = createPersistedStatePlugin();
pinia.use((context) => installPersistedStatePlugin(context));

app.use(router);
app.use(pinia);

app.mount("#app");
