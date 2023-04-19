<template>
    <view class="content">
        <view class="avatar">
            <image class="avatar-image" src="../../static/logo.png"></image>
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

<script>
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
export default {
    components:{UniIcons}
}
</script>

<style lang="scss" scoped>
@import "./my-profile.scss";

</style>