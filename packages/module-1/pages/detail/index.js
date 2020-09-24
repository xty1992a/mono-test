import Vue from "vue";
import vant from "vant";
import VueCompositionAPI from "@vue/composition-api";
Vue.use(VueCompositionAPI);
import "vant/lib/index.css";
import "module-1/icons";
Vue.use(vant);
import store from "./store";
import App from "./index.vue";

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
