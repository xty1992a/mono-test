import { watch, ref } from "@vue/composition-api";
import { Toast } from "vant";

const dftOptions = {
  isFinished: (query, res) => dftOptions.getList(res).length !== query.pageSize,
  getList: (result) => result.data || [],
  Toast: {
    loading: Toast.loading,
    clear: Toast.clear,
    toast: Toast,
  },
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
      options.Toast.loading();
      const result = await request(now);
      options.Toast.clear();
      loading.value = false;
      if (!result.success) return;
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
