import { watch, ref } from "@vue/composition-api";

const dftOptions = {
  isFinished: (query, res) => dftOptions.getList(res).length !== query.pageSize,
  getList: (result) => result.data || [],
};

export default function useList(searchQuery, request, options = {}) {
  if (typeof searchQuery !== "object") throw "请提供查询对象[searchQuery]!";
  if (typeof request !== "function") throw "请提供请求方法[request]!";
  const list = ref([]);
  const loading = ref(false);
  const finished = ref(false);
  options = { ...dftOptions, ...options };

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
      immediate: true,
      deep: true,
    }
  );

  return {
    list,
    loading,
    finished,
  };
}
