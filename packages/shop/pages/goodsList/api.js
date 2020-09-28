import { create } from "common/scripts/request/van-request";
import qs from "querystring";

const query = qs.parse(location.search.substr(1));
const request = create(
  {
    params: {
      bid: query.bid,
    },
    headers: {
      bid: query.bid,
    },
  },
  {
    loading: false,
    isSuccess: (res) => res.resultCode === 200,
  }
);

export const getUser = () =>
  request("/users", undefined, {
    isSuccess: (res) => res.success,
  });
export const login = (data) =>
  request("/Business/BindByCardAction", { method: "POST", params: data });
export const getList = (data) =>
  request("/api/Shop/GetCategoryAndGoodsItem", {
    method: "POST",
    params: data,
  });
export const getHeadData = () =>
  request("/api/Shop/GetIndexAdvResponse", { method: "POST" });
export const getCategories = () =>
  request("/api/Shop/GetCategory", { method: "POST" });
