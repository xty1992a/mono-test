<template>
  <div class="home">
    <section>
      <van-row>
        <van-col :span="12">
          <img :src="cat" alt="" />
        </van-col>
        <van-col :span="12">
          <img src="/images/cat.jpg" alt="" />
        </van-col>
      </van-row>

      <van-cell-group class="list" ref="cell">
        <van-cell
          class="item"
          v-for="it in users"
          :key="it.id"
          :title="it.name"
        >
          <span>{{ it.age }}</span>
        </van-cell>
      </van-cell-group>
    </section>

    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <CardGroup v-for="item in list" :data="item" :key="item.guid" />
    </van-list>
  </div>
</template>

<script>
import cat from "module-1/assets/cat.jpg";
import { defineComponent, watch, ref } from "@vue/composition-api";
import { useState, useActions } from "vuex-composition-helpers";
import useList from "common/hooks/business/useList";
import * as API from "./api";
import CardGroup from "./children/CardGroup";

export default defineComponent({
  name: "Detail",
  components: { CardGroup },
  setup(props, ctx) {
    const query = ref({ pageIndex: 1, pageSize: 3 });
    const { getUsers } = useActions(["getUsers"]);
    const { users } = useState(["users"]);
    const { loading, finished, list } = useList(query, API.getList);
    getUsers();

    const onLoad = () => {
      if (finished.value) return;
      query.value.pageIndex++;
    };

    return {
      cat,
      users,
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

  section {
    overflow: hidden;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  }
  p {
    margin: 0;
    color: @red-color;
    font-size: 15px;
    padding: 10px 15px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  img {
    width: 100px;
    display: block;
    margin: auto;
  }
}
</style>
