<template>
  <div class="home">
    <PageHead @load="onHeadLoad" />
    <van-list
      v-model="loading"
      :finished="finished"
      @load="onLoad"
      finished-text="再拉也没有啦~"
    >
      <CardGroup v-for="item in list" :data="item" :key="item.guid" />
    </van-list>
    <div class="holder"></div>
    <Backtop :hide="scrollTop < 300" />
    <Menubar :menus="menus" />
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "@vue/composition-api";
import useCacheList from "scripts/hooks/business/useCacheList";
import useScrollTop from "scripts/hooks/dom/useScrollTop";
import * as API from "./api";
import CardGroup from "./children/CardGroup";
import PageHead from "./children/PageHead";
import Menubar from "shop/common/components/Menubar";
import Backtop from "components/Backtop/BackTop";
import { SHOP_MENUS } from "shop/common/constants";
const icons = {
  home: "wap-home",
  category: "notes",
  cart: "shopping-cart",
  orders: "orders",
};

export default defineComponent({
  name: "Detail",
  components: { CardGroup, Backtop, PageHead, Menubar },
  setup(props, ctx) {
    const query = ref({ pageSize: 3 });
    const key = "shop_goods_list";
    const topKey = key + "_scroll";
    const shopCart = 10;

    const menus = computed(() =>
      SHOP_MENUS.map((it) => ({
        ...it,
        icon: icons[it.key] + "-o",
        activeIcon: icons[it.key],
        active: it.key === "home",
        badge: it.key === "cart" ? shopCart : undefined,
      }))
    );
    const { loading, finished, list, params } = useCacheList({
      params: query,
      request: API.getList,
      key,
    });

    const { scrollTop, cacheTop } = useScrollTop({ cacheKey: topKey });

    async function onHeadLoad() {
      // head加载完成会改变高度,导致位置还原不正确
      if (cacheTop === -1) return;
      ensureScrollTop(cacheTop);
    }

    function onLoad() {
      if (finished.value) return;
      params.value.pageIndex++;
    }

    return {
      list,
      menus,
      loading,
      finished,
      scrollTop,
      onHeadLoad,
      onLoad,
    };
  },
});

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

async function ensureScrollTop(top, max_count = 5) {
  while (1 && max_count) {
    max_count--;
    document.scrollingElement.scrollTop = top;
    await sleep(50);
    if (document.scrollingElement.scrollTop === top) break;
  }
}
</script>

<style lang="less" rel="stylesheet/less">
.home {
  background-color: #f7f7f7;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 10px;

  .holder {
    height: 50px;
  }
}
</style>
