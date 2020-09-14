<template>
  <div class="home">
    <p>detail page <Icon name="arrow-right" /></p>

    <img :src="cat" alt="" />
    <img src="/images/cat.jpg" alt="" />
  </div>
</template>

<script>
import cat from "module-1/assets/cat.jpg";

export default {
  name: "home",
  components: {},
  props: {},
  data() {
    return {
      cat,
    };
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
.home {
  p {
    color: @red-color;
  }
  img {
    width: 100px;
  }
}
</style>
