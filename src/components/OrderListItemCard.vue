<template>
    <view class="order-list-item">
        <!-- 订单项标题栏 -->
        <view class="order-list-item-head">
            <view class="order-list-item-head-icon">
                <uni-icons type="help" size="30"></uni-icons>
                <view class="order-list-item-head-icon-text">{{ orderType }}</view>
            </view>
            <view class="order-list-item-head-state">
                <text class="order-list-item-head-state-detail">
                    {{ stateType }}
                </text>
                <text class="order-list-item-head-state-date">2023年5月1日 10:00:00</text>
            </view>

        </view>
        <!-- 订单项主体 -->
        <view class="order-list-item-body">
            <!-- 委托内容 -->
            <view class="order-list-item-body-row">
                <text class="order-list-item-body-row-type">委托内容：</text>
                <text class="order-list-item-body-row-content">{{ order.content }}</text>
            </view>
            <!-- 起始地址 -->
            <view class="order-list-item-body-row">
                <text class="order-list-item-body-row-type">起始地址：</text>
                <text class="order-list-item-body-row-start-address">{{ order.startAddress }}</text>
            </view>
            <!-- 终点地址 -->
            <view class="order-list-item-body-row">
                <text class="order-list-item-body-row-type">目的地址：</text>
                <text class="order-list-item-body-row-end-address">{{ order.endAddress }}</text>
            </view>
            <!-- 物品简略信息 -->
            <view class="order-list-item-body-row">
                <text class="order-list-item-body-row-type">物体重量：</text>
                <text class="order-list-item-body-row-object-weight">{{ order.releatedOb.weight }}</text>
                <text class="order-list-item-body-row-type"> 体积：</text>
                <text class="order-list-item-body-row-object-volume">{{ order.releatedOb.volume }}</text>
            </view>
            <!-- 备注 -->
            <view class="order-list-item-body-row">
                <text class="order-list-item-body-row-type">备注：</text>
                <text class="order-list-item-body-row-note">{{ order.note }}</text>
            </view>
        </view>
        <!-- 订单项页脚 -->
        <view class="order-list-item-footer">
            <!-- 倒计时-->
            <view class="order-list-item-footer-countdown">
                <text class="order-list-item-footer-countdown-text">剩余时间：</text>
                <view class="order-list-item-footer-countdown-detail">
                    <uni-countdown v-if="showCountdown" color="#FFFFFF" background-color="#007AFF" :font-size="13"
                        :show-day="false" :second="countDown.sec"></uni-countdown>
                    <text v-else> 已过期</text>
                </view>
            </view>
            <!-- 悬赏金额 -->
            <view class="order-list-item-footer-reward">
                <text class="order-list-item-footer-reward-text">报酬：</text>
                <text class="order-list-item-footer-reward-detail">5元</text>
            </view>
            <!-- 按钮 -->
            <button class="order-list-item-footer-button" type="default">查看</button>
        </view>

    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

//响应式状态
const orderType = ref("")
const stateType = ref("")
const showCountdown = ref(true)
const countDown = ref({
    sec: 2000,
})

//Props
const props = defineProps({
    order: {
        type: Object,
        required: true,
    }
})
onMounted(() => {
    // console.log(props.order.endTime)

    //按照订单类型显示不同卡片头部
    let typeIndex = props.order.type
    if (typeIndex == 0) {
        orderType.value = "帮取快递"
    }
    if (typeIndex == 1) {
        orderType.value = "帮寄快递"
    }
    if (typeIndex == 2) {
        orderType.value = "帮取外卖"
    }
    if (typeIndex == 3) {
        orderType.value = "帮送文件"
    }
    if (typeIndex == 4) {
        orderType.value = "其他委托"
    }

    let stateIndex = props.order.state
    if (stateIndex == 0) {
        stateType.value = "未接取"
    }
    if (stateIndex == 1) {
        stateType.value = "执行中"
    }
    if (stateIndex == 2) {
        stateType.value = "未付款"
    }
    if (stateIndex == 3) {
        stateType.value = "已完成"
    }

    //计算页面倒计时
    let endTime = parseInt(props.order.endTime)
    let nowTime = parseInt(Date.now() / 1000)
    let difference = endTime - nowTime
    console.log("时间差是", difference);
    if (difference > 0) {
        countDown.value.sec = difference
    } else {
        showCountdown.value = false
    }
})
</script>

<style lang="scss" scoped>
@import "../common/global.scss";

.order-list-item {
    margin: $margin-block;
    width: 690rpx;
    background-color: $color-white;
    border-radius: $card-radius;

    &-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: $margin-block $margin-block 0 $margin-block;
        padding: 0 15rpx;
        height: 70rpx;
        border-bottom: 1rpx solid #b7b7b7;

        // border: 1rpx solid #b7b7b7;
        &-icon {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        &-state {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: flex-start;
            align-items: center;

            &-date {
                font-size: 20rpx;
            }
        }
    }

    &-body {
        display: flex;
        flex-direction: column;
        margin: 0rpx $margin-block;

        // border: 1rpx solid #b7b7b7;
        &-row {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 10rpx;

            // border: 1rpx solid red;
            &-type {
                align-self: flex-start;
                width: 150rpx;
                font-size: $order-list-item-font-size;
                font-weight: bolder;
            }

            &-content,
            &-start-address,
            &-end-address,
            &-object-weight,
            &-object-volume,
            &-note {
                flex: 1;
                font-size: $order-list-item-font-size;
            }
        }
    }

    &-footer {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 0 $margin-block $margin-block $margin-block;
        // border: 1rpx solid #b7b7b7;
        height: 70rpx;

        &-countdown {
            margin: 10rpx;
            display: flex;
            justify-content: center;
            align-items: center;

            &-text {
                font-size: $order-list-item-font-size;
                font-weight: bolder;
            }

            &-detail {
                display: flex;
                align-items: center;
                height: 30rpx;
                width: 180rpx;

                >text {
                    color: #dd524d;
                }
            }
        }

        &-reward {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 6rpx;
            background-color: #dd524d;
            border-radius: 5rpx 15rpx;
            color: #FFFFFF;

            >text {
                font-size: $order-list-item-font-size;
                font-weight: bolder;
            }
        }

        &-button {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 50rpx;
            width: 150rpx;
            background-color: #007AFF;
            color: #FFFFFF;
            font-size: 30rpx;
            font-weight: bolder;
            border-radius: 15rpx 5rpx;
        }
    }
}
</style>