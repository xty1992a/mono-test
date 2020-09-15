import Vue from "vue";
import App from "./index.vue";
import "module-1/icons";
import vant from "vant";
Vue.use(vant);
import "vant/lib/index.css";
new Vue({
  render: (h) => h(App),
}).$mount("#app");
