<template>
  <div class="card-group">
    <van-divider class="card-group_name"
      ><span>{{ data.name }}</span></van-divider
    >
    <van-row>
      <van-col :span="12" v-for="item in data.goodsItem" :key="item.guid">
        <Card :data="item" />
      </van-col>
    </van-row>
  </div>
</template>

<script>
import Card from "./Card";
export default {
  name: "card-group",
  components: { Card },
  props: {
    data: Object,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
  watch: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
};
</script>

<style lang="less" rel="stylesheet/less">
.card-group {
  .card-group_name {
    text-align: center;
    font-weight: 500;
    font-size: 17px;
    color: #333;
    margin: 10px 0;
  }
  /*van的布局组件gutter计算存在问题*/
  .van-col {
    padding: 0 5px;
    margin-bottom: 10px;
  }
  .van-row {
    margin: 0 -5px;
  }
}
</style>
