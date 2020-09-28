<template>
  <a :href="`/shop/home?bid=${bid}`">
    <div class="card">
      <AspectRatio class="card_img">
        <img :src="data.imagePath" alt="" />
      </AspectRatio>

      <div class="card_content">
        <div class="card_top">
          <p class="card_name">{{ data.name }}</p>
          <div class="cart-icon"></div>
        </div>
        <div class="card_bottom">
          <div class="card_price"><span>￥</span>{{ data.marketPrice }}</div>
          <div class="card_sale-count">已售: {{ data.sellCount }}</div>
        </div>
      </div>
    </div>
  </a>
</template>

<script>
import qs from "querystring";
export default {
  name: "card",
  components: {},
  props: {
    data: Object,
  },
  setup() {
    const { bid } = qs.parse(location.search.substr(1));
    return { bid };
  },
};
</script>

<style lang="less" rel="stylesheet/less">
.card {
  background-color: #fff;
  text-decoration: none;
  color: #333;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  p {
    margin: 0;
  }
  .card_content {
    padding: 10px;
    .card_top {
      display: flex;
      margin-bottom: 5px;
      .card_name {
        .multi-line(2, 1.5);
        font-size: 14px;
      }
      .cart-icon {
        width: 4em;
      }
    }
    .card_bottom {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      div {
        flex: 1;
      }
      .card_price {
        font-size: 14px;
        color: #ff6400;
        font-weight: 500;
        span {
          font-weight: normal;
          font-size: 10px;
        }
      }
      .card_sale-count {
        text-align: right;
        color: #999;
      }
    }
  }
}
</style>
