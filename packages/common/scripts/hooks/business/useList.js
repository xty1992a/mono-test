import { watch, ref } from "@vue/composition-api";

const dftOptions = {
  isFinished: (query, res) => dftOptions.getList(res).length !== query.pageSize,
  getList: (result) => result.data || [],
  initList: [],
};

export default function useList(searchQuery, request, options = {}) {
  if (typeof searchQuery !== "object") throw "请提供查询对象[searchQuery]!";
  if (typeof request !== "function") throw "请提供请求方法[request]!";
  options = { ...dftOptions, ...options };
  const list = ref(options.initList || []);
  const loading = ref(false);
  const finished = ref(false);

  watch(
    searchQuery,
    async (now) => {
      loading.value = true;
      const result = await request(now);
      loading.value = false;
      if (!result.success) {
        finished.value = true;
        return;
      }
      finished.value = options.isFinished(now, result);
      list.value = list.value.concat(options.getList(result));
    },
    {
      immediate: options.initList.length === 0,
      deep: true,
    }
  );

  return {
    list,
    loading,
    finished,
  };
}
