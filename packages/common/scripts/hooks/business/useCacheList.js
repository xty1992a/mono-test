import { watch, ref, computed, isRef } from "@vue/composition-api";
import useList from "scripts/hooks/business/useList";

const ss = {
  getItem(key) {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch (e) {
      return null;
    }
  },
  setItem(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
};

const dftOptions = {
  params: null,
  key: "use_cache_list",
  request: () => ({ success: false }),
};
export default function useCacheList(options) {
  if (typeof options !== "object") throw "options是必须参数!";
  if (options.params && !isRef(options.params))
    throw "options.params必须是ref对象";
  options = { ...dftOptions, ...options };
  const paramsKey = options.key + "_params";
  const listKey = options.key + "_list";

  let rawParams = ss.getItem(paramsKey) || { pageIndex: 1 };
  const initList = ss.getItem(listKey) || [];

  const params = ref(rawParams);

  const query = computed(() => {
    if (!options.params) return params;
    return { ...options.params.value, ...params.value };
  });
  const { loading, finished, list } = useList(query, options.request, {
    initList,
  });

  watch(
    params,
    (now) => {
      ss.setItem(paramsKey, now);
    },
    { deep: true }
  );

  watch(list, (now) => {
    ss.setItem(listKey, now);
  });

  return {
    params,
    loading,
    finished,
    list,
  };
}
