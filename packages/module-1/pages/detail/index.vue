<template>
  <div class="home">
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <CardGroup v-for="item in list" :data="item" :key="item.guid" />
    </van-list>
    <Backtop :hide="scrollTop < 300" bottom="30px" />
  </div>
</template>

<script>
import { defineComponent, ref } from "@vue/composition-api";
import useList from "scripts/hooks/business/useList";
import useScrollTop from "scripts/hooks/dom/useScrollTop";
import * as API from "./api";
import CardGroup from "./children/CardGroup";
import Backtop from "components/Backtop/BackTop";

export default defineComponent({
  name: "Detail",
  components: { CardGroup, Backtop },
  setup(props, ctx) {
    const query = ref({ pageIndex: 1, pageSize: 3 });
    const { loading, finished, list } = useList(query, API.getList);
    const { scrollTop } = useScrollTop();

    const onLoad = () => {
      if (finished.value) return;
      query.value.pageIndex++;
    };

    return {
      list,
      loading,
      finished,
      onLoad,
      scrollTop,
    };
  },
});
</script>

<style lang="less" rel="stylesheet/less">
.home {
  background-color: #f7f7f7;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 10px;
}
</style>
