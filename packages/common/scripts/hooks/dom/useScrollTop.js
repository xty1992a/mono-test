import { onMounted, ref, onUnmounted } from "@vue/composition-api";
import { throttle } from "scripts/utils/throttle";
const dftOptions = {
  throttleTime: 50,
  el: document.scrollingElement,
};
export default function useScrollTop(options = {}) {
  options = { ...dftOptions, ...options };
  const scrollTop = ref(0);
  function onScroll() {
    scrollTop.value = options.el.scrollTop;
  }
  const throttleFn = throttle(options.throttleTime, false, onScroll);

  onMounted(() => {
    window.addEventListener("scroll", throttleFn);
  });
  onUnmounted(() => {
    window.removeEventListener("scroll", throttleFn);
  });
  return {
    scrollTop,
  };
}
