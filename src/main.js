import { createApp } from "vue";
import App from "./App.vue";
import Tooltip from "./components/Tooltip.vue";
import "./assets/main.css";
import Text from "./data/Text";

const app = createApp(App);
app.config.errorHandler = (err) => {
  console.log(err);
};
app.config.compilerOptions.isCustomElement = (tag) => {
  return tag.startsWith("ion-");
};
app.component("Tooltip", Tooltip);
app.config.globalProperties.$TEXT = Text;
app.mount("#app");
