<template>
    <view class="bottom-panel">
        <button v-if="showCancel" class="bottom-panel-cancel">取消</button>
        <button v-if="showUpdate" class="bottom-panel-update">修改</button>
        <button v-if="showPost" class="bottom-panel-post">发布</button>
    </view>
</template>

<script setup>
const props = defineProps({
    showCancel: {
        type: Boolean,
        required: true,
        default: false
    },
    showUpdate: {
        type: Boolean,
        required: true,
        default: false
    },
    showPost: {
        type: Boolean,
        required: true,
        default: false
    }
})
</script>

<style lang="scss" scoped>
@import "../common/global.scss";
@import "../uni.scss";

.bottom-panel {
    display: flex;
    justify-content: flex-end;
    padding: 15rpx;
    background-color: $color-white;
    width: 720rpx;
    position: sticky;
    bottom: 0rpx;
    z-index: 99;

    &-cancel,
    &-update,
    &-post {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0 15rpx;
        border-radius: 5rpx 15rpx;
        height: 50rpx;
        font-size: 28rpx;
        font-weight: bolder;
        color: #ffffff;
    }

    &-cancel {
        background-color: $uni-color-primary;
    }

    &-update {
        background-color: $uni-color-warning;
    }

    &-post {
        background-color: $uni-color-error;
    }
}
</style>