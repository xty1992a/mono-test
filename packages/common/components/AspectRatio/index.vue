<template>
  <div class="aspect-ratio">
    <div class="before" :style="{ paddingTop }"></div>
    <div class="aspect-ratio-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "AspectRatio",
  props: {
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
    // height / width
    ratio: {
      type: [Number, String],
    },
  },
  computed: {
    paddingTop() {
      if (this.ratio !== undefined) {
        return typeof this.ratio === "string"
          ? this.ratio
          : this.ratio * 100 + "%";
      }
      return ((this.height / this.width) * 100).toFixed(2) + "%";
    },
  },
};
</script>

<style lang="less" rel="stylesheet/less">
.aspect-ratio {
  position: relative;

  .before {
    width: 1px;
    margin-left: -1px;
    height: 0;
  }

  .aspect-ratio-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;

    video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
