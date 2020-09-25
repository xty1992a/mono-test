import { create } from "common/request/van-request";
import qs from "querystring";

const query = qs.parse(location.search.substr(1));
const request = create({
  params: {
    bid: query.bid,
  },
});

export const getUser = () => request("/users");
export const login = (data) =>
  request("/Business/BindByCardAction", { method: "POST", params: data });
export const getList = (data) =>
  request(
    "/api/Shop/GetCategoryAndGoodsItem",
    {
      method: "POST",
      params: data,
    },
    {
      isSuccess: (res) => res.resultCode === 200,
    }
  );
