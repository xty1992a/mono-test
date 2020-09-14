<template>
  <div class="home">
    <p>home page</p>
  </div>
</template>

<script>
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
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
  },
  mounted() {},
  beforeDestroy() {},
};
</script>

<style lang="less" rel="stylesheet/less">
.home {
}
</style>
