import Vue from "vue";
import Main from "./Main.vue";

function createVm(options) {
  const Com = Vue.extend(Main);
  const vm = new Com({ data: options });
  const el = document.createElement("div");
  document.body.appendChild(el);
  vm.$mount(el);
  vm.show = true;
}

const dftOptions = {
  options: [],
  value: "",
};

export default function (options = {}) {
  return new Promise((resolve) => {
    createVm({ ...options, resolve });
  });
}
