import { onMounted, ref, onUnmounted } from "@vue/composition-api";
import { throttle } from "scripts/utils/throttle";
const dftOptions = {
  throttleTime: 50,
  el: document.scrollingElement,
  cacheKey: undefined,
};
export default function useScrollTop(options = {}) {
  options = { ...dftOptions, ...options };
  const scrollTop = ref(0);
  let cacheTop = -1;
  try {
    cacheTop = JSON.parse(sessionStorage.getItem(options.cacheKey));
  } catch (e) {
    console.log(e);
  }

  function onScroll() {
    scrollTop.value = options.el.scrollTop;
    if (!options.cacheKey) return;
    sessionStorage.setItem(options.cacheKey, scrollTop.value);
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
    cacheTop,
  };
}
