<template>
  <div class="home">
    <p>
      detail page
      <Icon name="arrow-right" />
    </p>
    <van-cell title="标题"></van-cell>

    <img :src="cat" alt="" />
    <img src="/images/cat.jpg" alt="" />
  </div>
</template>

<script>
import cat from "module-1/assets/cat.jpg";
import axios from "axios";

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
  async created() {
    try {
      const res = await axios.get("/users");
      console.log(res);
    } catch (e) {}
  },
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
