<template>
  <div class="home">
    <p ref="p">
      <span>height: {{ size.height }}</span>
      <span>width: {{ size.width }}</span>
      <Icon name="arrow-right" />
    </p>
    <van-cell title="标题" />

    <img :src="cat" alt="" />
    <img src="/images/cat.jpg" alt="" />
  </div>
</template>

<script>
import cat from "module-1/assets/cat.jpg";
import { defineComponent, onMounted, ref } from "@vue/composition-api";

function useRefSize(key, refs) {
  const size = ref({
    width: 0,
    height: 0,
  });

  onMounted(() => {
    const el = refs[key];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    size.value = {
      width: rect.width,
      height: rect.height,
    };
  });

  return size;
}

export default defineComponent({
  setup(props, ctx) {
    const size = useRefSize("p", ctx.refs);
    return {
      cat,
      size,
    };
  },
});
</script>

<style lang="less" rel="stylesheet/less">
.home {
  p {
    color: @red-color;
    font-size: 16px;
    margin: 0;
    padding: 10px;
    line-height: 24px;
  }

  img {
    width: 100px;
  }
}
</style>
