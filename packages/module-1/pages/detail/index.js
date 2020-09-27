import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";
Vue.use(VueCompositionAPI);
import "module-1/icons";
import "./ui";
import store from "./store";
import App from "./index.vue";

// import { login } from "./api";
// login({
//   cardId: "1",
//   password: "888888",
// });

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
