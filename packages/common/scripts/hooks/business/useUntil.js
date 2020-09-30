/*
将一个事件转换为promise
对外暴露一个事件触发器与一个promise,调用事件触发器使promise resolve
* */
import { ref, watch, isRef } from "@vue/composition-api";
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
const dftOptions = {
  maxCount: 5,
  duration: 50,
  done: undefined,
};

// 若提供初始flag,将使用watch模式
// 如果没有提供,则使用轮询+回调模式
export default function useUntil(options = {}) {
  const { maxCount, duration, done: initDone } = { ...dftOptions, ...options };
  if (initDone && !isRef(initDone)) throw "done应提供ref类型";

  const done = initDone || ref(false);

  function watchUntil() {
    return new Promise((resolve) => {
      const unwatch = watch(
        done,
        (done) => {
          if (!done) return;
          resolve(true);
          unwatch();
        },
        { immediate: true }
      );
    });
  }

  async function loopUntil(count = maxCount) {
    while (1 && count) {
      await sleep(duration);
      count--;
      if (done.value) break;
    }
    if (!done.value) console.log("time out");
    return done.value;
  }

  function onDone() {
    done.value = true;
  }

  return {
    onDone,
    until: initDone ? watchUntil : loopUntil,
  };
}
