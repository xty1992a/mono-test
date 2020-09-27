// 引入vant-ui中的toast的request,可用于移动端
import { Toast } from "vant";
import { create as crt, merge } from "./index";

export { merge } from "./index";

// 套娃
export function create(dftConfig, dftOptions = {}) {
  return crt(
    dftConfig,
    merge(dftOptions, {
      Toast: {
        loading: () => Toast.loading({ message: "加载中...", duration: 0 }),
        clear: Toast.clear,
        toast: Toast,
      },
    })
  );
}

export default create();
