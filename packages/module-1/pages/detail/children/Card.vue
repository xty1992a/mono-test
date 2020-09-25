<template>
  <div class="card">
    <img src="" alt="" />
    <div class="bottom">
      <p class="name">{{ data.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "card",
  components: {},
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
.card {
  height: 150px;
  background-color: #fff;
}
</style>
