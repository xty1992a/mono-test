<template>
  <div class="card-group">
    <h3 class="card-group_name">{{ data.name }}</h3>
    <van-row :gutter="10">
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
  }
  .van-col {
    margin-bottom: 10px;
  }
}
</style>
