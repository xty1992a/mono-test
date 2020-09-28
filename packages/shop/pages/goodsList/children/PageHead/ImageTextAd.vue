<template>
  <div class="image-text-ad">
    <van-swipe
      @change="onChange"
      class="image-text-ad_swipe"
      :show-indicators="false"
      :loop="false"
    >
      <van-swipe-item v-for="block in blockList" :key="block.key">
        <van-row>
          <van-col :span="6" v-for="it in block.list" :key="it.guid">
            <div class="ad-menu">
              <div class="image-dd">
                <img
                  :src="
                    it.imagePath ||
                    'https://bkchina.h5.yunhuiyuan.cn/static/pictures/shop/default/catgory.png'
                  "
                  :alt="it.name"
                />
              </div>
              <p class="image-text van-ellipsis">{{ it.name }}</p>
            </div>
          </van-col>
        </van-row>
      </van-swipe-item>
    </van-swipe>
    <div class="dot-list">
      <span
        class="dot"
        v-for="it in dotList"
        :key="it.key"
        :class="{ dot_active: it.active }"
      ></span>
    </div>
  </div>
</template>

<script>
import * as API from "../../api";
import { defineComponent, ref, computed } from "@vue/composition-api";

function chunkList(list, length) {
  const result = [];
  while (list.length) {
    result.push(list.splice(0, length));
  }
  return result;
}

export default defineComponent({
  name: "image-text-ad",
  components: {},
  props: {},
  setup(ctx, { emit }) {
    const data = ref([]);
    const blockList = computed(() =>
      chunkList(data.value, 8).map((list, key) => ({
        list,
        key,
      }))
    );
    const activeIndex = ref(0);

    const dotList = computed(() =>
      blockList.value.map((n, i) => ({
        key: i,
        active: i === activeIndex.value,
      }))
    );

    function onChange(index) {
      activeIndex.value = index;
    }

    API.getCategories().then((result) => {
      if (!result.success) return;
      data.value = result.data;
      emit("load");
    });

    return {
      blockList,
      dotList,
      onChange,
    };
  },
});
</script>

<style lang="less" rel="stylesheet/less">
.image-text-ad {
  .ad-menu {
    text-align: center;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 10px;
    .image-dd {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .image-text {
      margin: 0;
      font-size: 12px;
      line-height: 20px;
      margin-top: 5px;
      width: 100%;
    }
  }
  .van-swipe__indicators {
    transform: translate(-50%, 20px);
  }
  .dot-list {
    text-align: center;
    line-height: 1;
    font-size: 0;
    padding-bottom: 10px;
    .dot {
      line-height: 1;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      display: inline-block;
      border: 1px solid #ccc;
      margin: 0 5px;
      &_active {
        background: #ff6400;
        border-color: #ff6400;
      }
    }
  }
}
</style>
