<template>
  <div class="page-head">
    <van-search
      class="search-bar"
      background="rgb(240 240 240)"
      placeholder="搜索想要的商品"
    />
    <van-swipe
      class="ad-swipe"
      :autoplay="3000"
      indicator-color="white"
      v-if="data.advertises"
    >
      <van-swipe-item v-for="it in data.advertises" :key="it.imagePath">
        <AspectRatio :width="211.8">
          <img :src="it.imagePath" :alt="it.title" />
        </AspectRatio>
      </van-swipe-item>
    </van-swipe>

    <ImageTextAd @load="onLoad" />
    <div class="notice-bar" v-if="data.notice">
      <div class="left-icon">
        <van-icon name="volume" />
        <span>{{ data.notice.title }}</span>
      </div>
      <van-notice-bar
        color="#333"
        background="white"
        scrollable
        :text="data.notice.content"
      />
    </div>
  </div>
</template>

<script>
import * as API from "../../api";
import { defineComponent, reactive, ref } from "@vue/composition-api";
import ImageTextAd from "./ImageTextAd";
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

export default defineComponent({
  name: "PageHead",
  components: { ImageTextAd },
  props: {},
  setup(props, { emit }) {
    const data = ref({});

    const load = ref(false);

    function onLoad() {
      load.value = true;
    }

    async function waitLoad(max_count = 5) {
      while (1 && max_count) {
        max_count--;
        await sleep(20);
        if (load.value) break;
      }
    }

    async function fetchData() {
      const result = await API.getHeadData();
      if (!result.success) return;
      data.value = result.data;
      emit("load");
    }

    Promise.all([fetchData(), waitLoad()]).then(() => {
      console.log("head所有接口加载完毕");
      emit("load");
    });

    return {
      data,
      onLoad,
    };
  },
});
</script>

<style lang="less" rel="stylesheet/less">
.page-head {
  margin: -10px -10px 10px;
  padding-top: 40px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  .search-bar {
    z-index: 1;
    padding: 6px 10px;
    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    .van-search__content {
      background: #fff;
      .van-cell {
        line-height: 28px;
        padding-top: 0;
        padding-bottom: 0;
      }

      input {
        height: 28px;
        line-height: 28px;
      }
    }
  }

  .ad-swipe {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .notice-bar {
    display: flex;
    height: 35px;
    background: #fff;
    .left-icon {
      height: 100%;
      max-width: 100px;
      display: flex;
      align-items: center;
      padding: 0 5px;
      color: #ff6400;
      span {
        margin: 0 5px;
        padding: 0 5px;
        font-size: 12px;
        border: 1px solid #ff6400;
      }
    }
    .van-notice-bar {
      padding-left: 0;
      height: 100%;
      flex: 1;
    }
  }
}
</style>
