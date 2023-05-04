<template>
  <view class="content">
    <!--公告轮播图-->
    <swiper class="notice" circular indicator-dots="true" duration="500">
      <template v-for=" notice in noticeList" :key="notice.nid">
        <swiper-item class="notice-item">
          <!-- <image src="../../static/image/index.png"></image> -->
          <uni-card :title="notice.title" :extra="notice.date">
            <text class="uni-body">{{ notice.content }}</text>
          </uni-card>

        </swiper-item>
      </template>
    </swiper>
    <!--功能区-->
    <view class="post-icon-form">
      <text class="post-icon-form-title">发布委托</text>
      <view class="post-icon-form-body">
        <view class="post-icon-form-body-item" @click="onClickPostIcon(1)">
          <image src="../../static/image/pick-up-delivery.png"></image>
          <text>帮取快递</text>
        </view>

        <view class="post-icon-form-body-item" @click="onClickPostIcon(2)">
          <image src="../../static/image/deliver-package.png"></image>
          <text>帮寄快递</text>
        </view>

        <view class="post-icon-form-body-item" @click="onClickPostIcon(3)">
          <image src="../../static/image/pick-up-takeout.png"></image>
          <text>帮取外卖</text>
        </view>

        <view class="post-icon-form-body-item" @click="onClickPostIcon(4)">
          <image src="../../static/image/deliver-file.png"></image>
          <text>帮送文件</text>
        </view>
        <view class="post-icon-form-body-item" @click="onClickPostIcon(5)">
          <image src="../../static/image/other-task.png"></image>
          <text>其他委托</text>
        </view>
      </view>
    </view>

    <view class="take-icon-form">
      <text class="take-icon-form-title">接下委托</text>
      <view class="take-icon-form-body">
        <view class="take-icon-form-body-item" @click="onClickTakeIcon(0)">
          <image src="../../static/image/latest-task.png"></image>
          <text>最新委托</text>
        </view>

        <view class="take-icon-form-body-item" @click="onClickTakeIcon(1)">
          <image src="../../static/image/nearby-task.png"></image>
          <text>附近委托</text>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useLoginUserStore } from '../../store/modules/loginUserStore'

//登录用户全局变量
const loginUserStore = useLoginUserStore()

//公告列表
const noticeList = ref([
  {
    nid: '001',
    title: '一月最新通告',
    date: '2023年01月28日',
    content: '一月最新通告一月最新通告一月最新通告一月最新通告一月最新通告一月最新通告一月最新通告一月最新通告一月最新通告一月最新通告一月最新通告一月最新通告一月最新通告一月最新通告'
  },
  {
    nid: '002',
    title: '二月最新通告',
    date: '2023年02月25日',
    content: '二月最新通告二月最新通告二月最新通告二月最新通告二月最新通告二月最新通告'
  }, {
    nid: '003',
    title: '三月最新通告',
    date: '2023年03月06日',
    content: '三月最新通告三月最新通告三月最新通告三月最新通告三月最新通告三月最新通告三月最新通告三月最新通告三月最新通告三月最新通告三月最新通告三月最新通告'
  }
])

function onClickPostIcon(orderType) {
  uni.navigateTo({
    url: "/pages/post-task/post-task?orderType=" + orderType
  })
}

function onClickTakeIcon(segIndex) {
  uni.navigateTo({
    url: "/pages/take-task/take-task?segIndex=" + segIndex
  })
}

onLoad(() => {
  console.log('进入了首页！')
  //用户静默登录
  // let openid = 'xyzxyz111122228888'  //韩某人
  let openid = 'abc123456789abc'  //小韩

  uni.showLoading()
  wx.cloud.callFunction({
    name: "userLoginController",
    data: {
      openid: openid,
    }
  }).then(res => {
    console.log("结果", res.result)
    uni.hideLoading()
    if (Object.keys(res.result.user).length != 0) {
      //改变全局变量中的登录用户信息
      loginUserStore.setLoginUser(res.result.user)
      console.log('当前登录的用户UID是', loginUserStore.user.uid)
      uni.showToast({
        title: '登录成功！'
      })
    } else {
      uni.hideLoading()
      //跳转至注册页面
      uni.redirectTo({
        url: `/pages/user-register/user-register?openid=${openid}`
      })
    }
  }).catch(err => {
    console.log(err)
  })
})

</script>

<style lang="scss">
@import "./index";
</style>
