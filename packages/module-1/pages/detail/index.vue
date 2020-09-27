<template>
  <div class="home">
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <CardGroup v-for="item in list" :data="item" :key="item.guid" />
    </van-list>
  </div>
</template>

<script>
import { defineComponent, watch, ref } from "@vue/composition-api";
import { useState, useActions } from "vuex-composition-helpers";
import useList from "scripts/hooks/business/useList";
import * as API from "./api";
import CardGroup from "./children/CardGroup";

export default defineComponent({
  name: "Detail",
  components: { CardGroup },
  setup(props, ctx) {
    const query = ref({ pageIndex: 1, pageSize: 3 });
    const { loading, finished, list } = useList(query, API.getList);
    const { users } = useState(["users"]);
    const { getUsers } = useActions(["getUsers"]);
    // setTimeout(getUsers, 2000);

    const onLoad = () => {
      if (finished.value) return;
      query.value.pageIndex++;
    };

    return {
      list,
      loading,
      finished,
      onLoad,
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
