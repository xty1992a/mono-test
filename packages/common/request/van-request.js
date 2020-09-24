// 引入vant-ui中的toast的request,可用于移动端
import { Toast } from "vant";
import { create } from "./index";
export default create(undefined, {
  Toast: {
    loading: () => Toast.loading({ message: "加载中...", duration: 0 }),
    clear: Toast.clear,
    toast: Toast,
  },
});
