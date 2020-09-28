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
    <Backtop :hide="scrollTop < 300" bottom="30px" />
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "@vue/composition-api";
import useCacheList from "scripts/hooks/business/useCacheList";
import useScrollTop from "scripts/hooks/dom/useScrollTop";
import * as API from "./api";
import CardGroup from "./children/CardGroup";
import PageHead from "./children/PageHead";
import Backtop from "components/Backtop/BackTop";

export default defineComponent({
  name: "Detail",
  components: { CardGroup, Backtop, PageHead },
  setup(props, ctx) {
    const query = ref({ pageSize: 3 });
    const key = "shop_goods_list";
    const topKey = key + "_scroll";
    const top = sessionStorage.getItem(topKey);

    const { loading, finished, list, params } = useCacheList({
      params: query,
      request: API.getList,
      key,
    });

    const { scrollTop } = useScrollTop();

    async function onHeadLoad() {
      if (top) {
        await ensureScrollTop(+top);
      }
      watch(scrollTop, (now) => {
        sessionStorage.setItem(topKey, now);
      });
    }

    const onLoad = () => {
      if (finished.value) return;
      params.value.pageIndex++;
    };
    return {
      list,
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
