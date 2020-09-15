<template>
  <div class="home">
    <p>list detail page</p>
    <button @click="pick">选择人员</button>
  </div>
</template>

<script>
const sleep = (time) => new Promise((r) => setTimeout(r, time));
export default {
  name: "home",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    async pick() {
      import("../../common/action").then(async ({ default: action }) => {
        const result = await action({
          options: [
            { name: "张三", value: "zs" },
            { name: "李四", value: "ls" },
          ],
        });
        console.log(result);
      });
    },
  },
  watch: {},
  async created() {
    await sleep(500);
    console.log("sleep 1s");
    this.pick();
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
  p {
    margin: 0;
    font-size: 18px;
  }

  background-color: yellowgreen;
  height: 100vh;
}
</style>
