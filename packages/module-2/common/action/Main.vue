<template>
  <transition name="center" @after-leave="onClose">
    <div class="action" v-show="show">
      <div class="mask"></div>
      <div class="center">
        <h3>
          <span>异步组件</span>
          <span class="close" @click="onCancel">&times;</span>
        </h3>
        <ul class="list">
          <li
            class="item"
            v-for="it in options"
            :key="it.value"
            @click="pickItem(it)"
          >
            <span>{{ it.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "action",
  components: {},
  props: {},
  data() {
    return {
      options: [],
      show: false,
    };
  },
  computed: {},
  methods: {
    pickItem(item) {
      this.onConfirm(item);
    },

    onClose() {
      this.$destroy();
    },
    onCancel() {
      this.resolve({ success: false, data: [] });
      this.show = false;
    },
    onConfirm(value) {
      this.resolve({ success: true, data: [value] });
      this.show = false;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  beforeDestroy() {
    this.$el && this.$el.parentNode.removeChild(this.$el);
  },
};
</script>

<style lang="less" rel="stylesheet/less">
.action {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  .mask {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .center {
    width: 50%;
    border-radius: 4px;
    background-color: #fff;
    z-index: 1;
    position: relative;
    h3 {
      margin: 0;
      padding: 10px 15px;
      font-weight: 500;
      font-size: 17px;
      border-bottom: 1px solid #e5e5e5;

      display: flex;
      align-items: center;
      justify-content: space-between;
      .close {
        cursor: pointer;
        transform: scale(1.2);
      }
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 10px;
      li {
        padding: 10px 20px;
        cursor: pointer;
      }
    }
  }
}

.center {
  &-enter,
  &-leave-to {
    opacity: 0;

    .mask {
      opacity: 0;
    }

    .center {
      transform: translateY(-40px);
    }
  }

  &-enter-active,
  &-leave-active {
    transition: 0.3s;

    .mask {
      transition: 0.3s;
    }

    .center {
      transition: 0.3s;
    }
  }
}
</style>
