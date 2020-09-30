<template>
  <div class="menubar">
    <van-row>
      <van-col v-for="it in menus" :key="it.key" :span="24 / menus.length">
        <div
          class="menu-item"
          :style="{ color: it.active ? activeColor : color }"
        >
          <van-icon
            :name="it.active ? it.activeIcon : it.icon"
            :badge="it.badge"
          />
          <p class="menu-name">{{ it.name }}</p>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  name: "Menubar",
  components: {},
  props: {
    menus: {
      type: Array,
      required: true,
      validator: (v) => v.every((it) => it.name && it.link && it.icon),
    },
    activeColor: {
      type: String,
      default: "#4080e8",
    },
    color: {
      type: String,
      default: "#999",
    },
  },
  setup(props, ctx) {},
};
</script>

<style lang="less" rel="stylesheet/less">
.menubar {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  z-index: 1;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  .menu-item {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 50px;
    user-select: none;
    &:active {
      box-shadow: 0 0 100px rgba(0, 0, 0, 0.05) inset;
    }

    i {
      font-size: 20px;
      margin-top: 5px;
    }
    .menu-name {
      font-size: 12px;
      line-height: 24px;
      margin: 0;
    }
  }
}
</style>
