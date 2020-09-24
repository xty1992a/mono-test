<template>
  <div class="home">
    <p ref="p">
      <span>
        <span>height: {{ size.height }}</span>
        <span>width: {{ size.width }}</span>
      </span>
      <Icon name="arrow-right" />
    </p>

    <van-row>
      <van-col :span="12">
        <img :src="cat" alt="" />
      </van-col>
      <van-col :span="12">
        <img src="/images/cat.jpg" alt="" />
      </van-col>
    </van-row>

    <van-cell-group class="list" ref="list">
      <van-cell class="item" v-for="it in users" :key="it.id" :title="it.name">
        <span>{{ it.age }}</span>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import cat from "module-1/assets/cat.jpg";
import { defineComponent, watch } from "@vue/composition-api";
import { useState, useActions } from "vuex-composition-helpers";

import useRefSize from "common/hooks/dom/useRefSize";

export default defineComponent({
  name: "Detail",
  setup(props, ctx) {
    const { getUsers } = useActions(["getUsers"]);
    const { users } = useState(["users"]);
    getUsers();
    const size = useRefSize("p", ctx.refs);

    watch(users, () => {
      console.log(useRefSize("list", ctx.refs, true).value);
    });

    return {
      cat,
      size,
      users,
    };
  },
});
</script>

<style lang="less" rel="stylesheet/less">
.home {
  p {
    color: @red-color;
    font-size: 15px;
    margin: 0;
    padding: 10px 15px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  img {
    width: 100px;
    display: block;
  }
}
</style>
