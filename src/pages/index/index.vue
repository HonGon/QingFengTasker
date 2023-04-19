<template>
  <view class="content">
    <!--公告轮播图-->
    <swiper class="notice" circular indicator-dots="true" duration="500">
      <swiper-item class="notice-item">
        <image src="../../static/image/index.png"></image>
      </swiper-item>

      <swiper-item class="notice-item">
        <image src="../../static/logo.png"></image>
      </swiper-item>

      <swiper-item class="notice-item">
        <image src="../../static/image/my-orders.png"></image>
      </swiper-item>


    </swiper>
    <!--功能区-->
    <view class="post-icon-form">
      <text class="post-icon-form-title">发布委托</text>
      <view class="post-icon-form-body">
        <view class="post-icon-form-body-item">
          <image src="../static/image/index.png"></image>
          <text>帮取快递</text>
        </view>

        <view class="post-icon-form-body-item">
          <image src="../static/image/index.png"></image>
          <text>帮送快递</text>
        </view>

        <view class="post-icon-form-body-item">
          <image src="../static/image/index.png"></image>
          <text>帮取外卖</text>
        </view>

        <view class="post-icon-form-body-item">
          <image src="../static/image/index.png"></image>
          <text>帮拿快递</text>
        </view>
        <view class="post-icon-form-body-item">
          <image src="../static/image/index.png"></image>
          <text>其他委托</text>
        </view>
      </view>
    </view>

    <view class="take-icon-form">
      <text class="take-icon-form-title">接下委托</text>
      <view class="take-icon-form-body">
        <view class="take-icon-form-body-item">
          <image src="../static/image/index.png"></image>
          <text>最新委托</text>
        </view>

        <view class="take-icon-form-body-item">
          <image src="../static/image/index.png"></image>
          <text>附近委托</text>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import { withCtx } from 'vue'

export default {
  data() {
    return {
      title: 'Hello',
    }
  },
  onLoad() {

  },
  methods: {
    onclick(e) {
      //   wx.cloud.callFunction({
      //   name:"add",
      //   data:{
      //     a : 1,
      //     b : 2,
      //   },
      // })
      // .then(res => {
      //   console.log(res.result)
      // })
      // .catch(console.error)
    }
  },
}
</script>

<style lang="scss">
@import "./index";
</style>
