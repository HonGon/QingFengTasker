<template>
    <view class="content">
        <view class="avatar">
            <image class="avatar-image" src="../../static/logo.png"></image>
            <text class="avatar-nickname">{{ userName }}</text>
        </view>

        <view class="list">
            <view class="list-item" @click="onClickProfileDetail">
                <uni-icons type="person" size="30"></uni-icons>
                <text class="list-item-text">基本信息</text>
                <uni-icons type="forward" size="30"></uni-icons>
            </view>
            <view class="list-item" @click="onClickSupport">
                <uni-icons type="headphones" size="30"></uni-icons>
                <text class="list-item-text">联系客服</text>
                <uni-icons type="forward" size="30"></uni-icons>
            </view>
            <view class="list-item">
                <uni-icons type="help" size="30"></uni-icons>
                <text class="list-item-text">关于青蜂跑腿</text>
                <uni-icons type="forward" size="30"></uni-icons>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app';
import { useLoginUserStore } from '../../store/modules/loginUserStore'

const loginUserStore = useLoginUserStore()

const userName = ref("")

function onClickProfileDetail(){
    uni.navigateTo({
        url:'/pages/profile-detail/profile-detail'
    })
}

function onClickSupport(){
    uni.navigateTo({
        url:'/pages/support/support'
    })
}

onLoad(() => {
    console.log("进入了我的页面")
    userName.value = loginUserStore.user.name
})

</script>

<style lang="scss" scoped>
@import "./my-profile.scss";
</style>