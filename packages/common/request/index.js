import axios from "axios";
const log = (...args) => console.log("[request]", ...args);

// 简单的深拷贝
// 以source为模板,返回新对象,target将覆盖同名属性
export function merge(source, target) {
  return Object.keys(source).reduce(
    (map, key) => {
      let value = source[key];
      const type = typeof value;
      let isProvide = target.hasOwnProperty(key);
      if (isProvide) {
        if (type === "object") {
          value = merge(value, target[key]);
        } else {
          value = target[key];
        }
      }
      return { ...map, [key]: value };
    },
    { ...target }
  );
}

const globalOptions = {
  loading: true,
  toast: true,
  isSuccess: (res) => res.success,
  getMessage: (res) => res.message || "",
  Toast: {
    loading: () => console.log("加载中..."),
    toast: () => console.log("加载中..."),
    clear: () => void 0,
  },
};

const globalConfig = {
  method: "GET",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
};

// 提供一个方法创建含有自定义配置的request方法
export function create(dftConfig = {}, dftOptions = {}) {
  dftConfig = merge(globalConfig, dftConfig);
  dftOptions = merge(globalOptions, dftOptions);

  function request(url, config, options) {
    config = merge(dftConfig, { ...(config || {}), url });
    options = merge(dftOptions, options || {});
    if (options.loading) {
      options.Toast.loading();
    }
    return new Promise(async (resolve) => {
      try {
        const result = await axios(config);
        log("result", result);
        const response = result.data;
        const success = options.isSuccess(response) ?? false;
        const message = options.getMessage(response) ?? "";

        if (!success && options.toast) {
          options.Toast.toast(message);
        }

        resolve({
          success,
          message: success ? message : message || "业务异常",
          data: response.data,
        });
      } catch (error) {
        log("error: ", error);
        resolve({
          success: false,
          message: "网络异常",
          error,
        });
      }
      if (options?.loading) {
        options.Toast?.clear();
      }
    });
  }

  return request;
}

// 默认导出使用global配置
export default create();
