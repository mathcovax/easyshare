import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import stores from "./stores";
import components from "./components";

const app = createApp(App);

app.use(router);
app.use(stores);
app.use(components);

app.mount("#app");
