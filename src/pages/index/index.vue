<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" @click="onclick"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
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
    onclick(e){
      wx.cloud.callFunction({
      name:"add",
      data:{
        a : 1,
        b : 2,
      },
    })
    .then(res => {
      console.log(res.result)
    })
    .catch(console.error)
    }
  },
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
