<template>
  <div class="home">
    <p>home page</p>
    <p>home page</p>
  </div>
</template>

<script>
import { add, sleep } from "module-1/common/utils";
export default {
  name: "home",
  components: {},
  props: {},
  data() {
    return {};
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
