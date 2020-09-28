<template>
  <div class="home">
    <a :href="`/shop/goodsList?bid=${bid}`">商城首页</a>
    <p>home page</p>
    <p>home page</p>
  </div>
</template>

<script>
import { add, sleep } from "shop/common/utils";
import qs from "querystring";
export default {
  name: "home",
  components: {},
  props: {},
  data() {
    const { bid } = qs.parse(location.search.substr(1));
    return {
      bid,
    };
  },
  computed: {},
  methods: {},
  watch: {},
  async created() {
    await sleep(1000);
    console.log("sleep 1s");
    console.log(add(1, 2));
  },
  mounted() {},
  beforeDestroy() {},
};
</script>

<style lang="less" rel="stylesheet/less">
body {
  margin: 0;
}
.home {
  height: 100vh;
  color: #333;
  background-color: #f7f7f7;
  padding: 10px;
  box-sizing: border-box;
  p {
    margin: 0;
    padding: 10px 10px 10px 10px;
    line-height: 24px;
  }
}
</style>
