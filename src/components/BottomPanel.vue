<template>
    <view class="bottom-panel">
        <button v-if="showCancel" @click="onClick(1)" class="bottom-panel-cancel">取消订单</button>
        <button v-if="showUpdate" @click="onClick(2)" class="bottom-panel-update">修改</button>
        <button v-if="showBack" @click="onClick(3)" class="bottom-panel-back">返回</button>
        <button v-if="showPay" @click="onClick(4)" class="bottom-panel-pay">支付</button>
        <button v-if="showPost" @click="onClick(5)" class="bottom-panel-post">发布</button>
        <button v-if="showFinish" @click="onClick(6)" class="bottom-panel-finish">完成</button>

    </view>
</template>

<script setup>
import { computed } from 'vue';
//Props
const props = defineProps({
    buttonIndexArray: {
        type: Array,
        required: true,
        default: [0, 0, 1, 0, 0, 0]
    }
})

//Emits
const emit = defineEmits({
    clickBottomButton: null
})

const showCancel = computed(() => {
    return props.buttonIndexArray[0] === 1 ? true : false
})
const showUpdate = computed(() => {
    return props.buttonIndexArray[1] === 1 ? true : false
})
const showBack = computed(() => {
    return props.buttonIndexArray[2] === 1 ? true : false
})
const showPay = computed(() => {
    return props.buttonIndexArray[3] === 1 ? true : false
})
const showPost = computed(() => {
    return props.buttonIndexArray[4] === 1 ? true : false
})
const showFinish = computed(() => {
    return props.buttonIndexArray[5] === 1 ? true : false
})

//处理底部面板的点击事件
function onClick(e) {
    //向父组件附上点击的底部功能按钮类型
    emit("clickBottomButton", e)
}

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
    position: fixed;
    bottom: 0;
    z-index: 99;

    &-cancel,
    &-update,
    &-back,
    &-pay,
    &-post,
    &-finish {
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

    &-cancel,
    &-post {
        background-color: $uni-color-error;
    }

    &-update {
        background-color: $uni-color-warning;
    }

    &-back {
        background-color: $uni-color-primary;
    }

    &-pay {
        background-color: $uni-color-success;
    }

    &-finish {
        background-color: $uni-color-warning;
    }
}</style>