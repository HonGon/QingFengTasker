<template>
    <view class="content">
        <view class="avatar">
            <image class="avatar-image" :src="avatarUrl"></image>
            <text class="avatar-nickname">闲人爱吃橘</text>
        </view>

        <view class="list">
            <view class="list-item">
                <uni-icons type="person" size="30"></uni-icons>
                <text class="list-item-text">基本信息</text>
                <uni-icons type="forward" size="30"></uni-icons>
            </view>
            <view class="list-item">
                <uni-icons type="location" size="30"></uni-icons>
                <text class="list-item-text">我的地址</text>
                <uni-icons type="forward" size="30"></uni-icons>
            </view>
            <view class="list-item">
                <uni-icons type="headphones" size="30"></uni-icons>
                <text class="list-item-text">联系客服</text>
                <uni-icons type="forward" size="30"></uni-icons>
            </view>
            <view class="list-item">
                <uni-icons type="help" size="30"></uni-icons>
                <text class="list-item-text">关于青峰跑腿</text>
                <uni-icons type="forward" size="30"></uni-icons>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app';

const avatarUrl = ref("")

onLoad(async () => {
    uni.login({
        provider: 'weixin',
        onlyAuthorize:true,	
        scopes:"auth_user",
        success: async (res) =>{
            await uni.showToast({
                title:"登录成功！",
                duration: 3000
            })
            console.log(res)
        }
    })
})

</script>

<style lang="scss" scoped>
@import "./my-profile.scss";
</style>