<template>
  <div class="float-btn" @click="(e) => $emit('click', e)" :style="style">
    <slot></slot>
  </div>
</template>

<script>
const isIPhoneX = () => {
  if (typeof window !== "undefined" && window) {
    return (
      /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 812
    );
  }
  return false;
};
export default {
  name: "FloatBtn",
  components: {},
  props: {
    bottom: {
      type: String,
      default: "70px",
    },
    right: {
      type: String,
      default: "15px",
    },
  },
  computed: {
    computedBottom() {
      return isIPhoneX()
        ? `calc(constant(safe-area-inset-bottom) + ${this.bottom})`
        : this.bottom;
    },
    style() {
      if (!isIPhoneX()) {
        return {
          bottom: this.bottom,
          right: this.right,
        };
      }
      return `
        bottom: calc(constant(safe-area-inset-bottom) + ${this.bottom});
        bottom: calc(env(safe-area-inset-bottom) + ${this.bottom});
        right: ${this.right}
        `;
    },
  },
};
</script>

<style lang="less" rel="stylesheet/less">
.float-btn {
  width: 50px;
  height: 50px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  overflow: hidden;
  position: fixed;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
