import Vue from "vue";
import vant from "vant";
import App from "./index.vue";
import VueCompositionAPI from "@vue/composition-api";
Vue.use(VueCompositionAPI);
import "vant/lib/index.css";
import "module-1/icons";
Vue.use(vant);

new Vue({
  render: (h) => {
    return h(App);
  },
}).$mount("#app");
