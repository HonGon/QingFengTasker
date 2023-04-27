<template>
    <uni-card class="order-list-item">
        <!-- 订单项标题栏 -->
        <uni-row>
            <uni-col :span="24">
                <view class="order-list-item-head">
                    <view class="order-list-item-head-icon">
                        <uni-icons type="help" size="30"></uni-icons>
                        <view class="order-list-item-head-icon-text">{{ orderTypeDetail }}</view>
                    </view>

                    <view class="order-list-item-head-state">
                        <text class="order-list-item-head-state-detail">
                            {{ orderStateDetail }}
                        </text>
                        <text class="order-list-item-head-state-date">{{ TimeDetail }}</text>
                    </view>
                </view>
            </uni-col>
        </uni-row>

        <!-- 订单项主体 -->
        <uni-row class="order-list-item-body">
            <!-- 委托订单编号 -->
            <uni-row>
                <uni-col :span="8">
                    <text class="order-list-item-body-row-type">订单编号：</text>
                </uni-col>
                <uni-col :span="14" :push="2">
                    <text class="order-list-item-body-row-content">{{ order.id }}</text>
                </uni-col>
            </uni-row>

            <!-- 委托内容 -->
            <uni-row>
                <uni-col :span="8">
                    <text class="order-list-item-body-row-type">委托内容：</text>
                </uni-col>
                <uni-col :span="14" :push="2">
                    <text class="order-list-item-body-row-content">{{ order.content }}</text>
                </uni-col>
            </uni-row>
            <!-- 起始地址 -->
            <uni-row>
                <uni-col :span="8">
                    <text class="order-list-item-body-row-type">起始地址：</text>
                </uni-col>
                <uni-col :span="14" :push="2">
                    <text class="order-list-item-body-row-start-address">{{ order.startAddress.name }}</text>
                </uni-col>
            </uni-row>
            <!-- 终点地址 -->
            <uni-row>
                <uni-col :span="8">
                    <text class="order-list-item-body-row-type">终点地址：</text>
                </uni-col>
                <uni-col :span="14" :push="2">
                    <text class="order-list-item-body-row-end-address">{{ order.endAddress.name }}</text>
                </uni-col>
            </uni-row>
            <!-- 物品简略信息 -->
            <uni-row>
                <uni-col :span="8">
                    <text class="order-list-item-body-row-type">物体重量(Kg)：</text>
                </uni-col>
                <uni-col :span="14" :push="2">
                    <text class="order-list-item-body-row-object-weight">{{ order.relatedOb.weight }}</text>
                </uni-col>
            </uni-row>
            <uni-row>
                <uni-col :span="8">
                    <text class="order-list-item-body-row-type"> 物体体积：</text>
                </uni-col>
                <uni-col :span="14" :push="2">
                    <text class="order-list-item-body-row-object-volume">{{ relatedObVolume }}</text>
                </uni-col>
            </uni-row>
            <!-- 备注 -->
            <uni-row>
                <uni-col :span="8">
                    <text class="order-list-item-body-row-type">备注：</text>
                </uni-col>
                <uni-col :span="14" :push="2">
                    <text class="order-list-item-body-row-note">{{ order.note }}</text>
                </uni-col>
            </uni-row>
        </uni-row>

        <!-- 订单项页脚 -->
        <uni-row>
            <uni-col :span="24">
                <view class="order-list-item-footer">
                    <!-- 页脚上层部分 -->
                    <view class="footer-top">
                        <!-- 悬赏金额 -->
                        <view class="order-list-item-footer-reward">
                            <text class="order-list-item-footer-reward-text">报酬：</text>
                            <text class="order-list-item-footer-reward-detail">{{ order.reward }} 元</text>
                        </view>
                    </view>
                    <!-- 页脚下层部分 -->
                    <view class="footer-bottom">
                        <!-- 倒计时-->
                        <view class="order-list-item-footer-countdown">
                            <text class="order-list-item-footer-countdown-text">剩余时间：</text>
                            <view class="order-list-item-footer-countdown-detail">
                                <uni-countdown v-if="showCountdown" color="#FFFFFF" background-color="#007AFF"
                                    :font-size="13" :show-day="false" :second="countDownSecond"
                                    @timeup="onCountDownTimeup"></uni-countdown>
                                <text v-else> 已过期</text>
                            </view>
                        </view>

                        <!-- 按钮 -->
                        <view v-if="showButton" class="order-list-item-footer-button" @click="onClickOrderItem">{{
                            buttonTypeDetail }}</view>
                    </view>
                </view>
            </uni-col>
        </uni-row>
    </uni-card>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app';
import { onMounted } from 'vue';
import { ref, computed, watch } from 'vue';

//响应式状态
// const orderType = ref("")
// const stateType = ref("")

const orderTypeRange = ref(["帮取快递", "帮寄快递", "帮取外卖", "帮送文件", "其他委托"])
const stateTypeRange = ref(["待接取", "执行中", "未付款", "已完成", "已取消"])

const showCountdown = ref(true)
const countDownSecond = ref(1000)
const buttonTypeRange = ref(["接下", "查看"])

//计算属性
const orderTypeDetail = computed(() => {
    //按照订单类型显示不同卡片头部
    return orderTypeRange.value[props.order.type - 1]
})

const orderStateDetail = computed(() => {
    //按照订单状态显示不同卡片头部
    return stateTypeRange.value[props.order.state - 1]
})
const postTimeDetail = computed(() => {
    //将订单的发布时间戳转换为日期形式
    let postTimeDate = new Date(parseInt(props.order.postTimestamp) * 1000)
    return postTimeDate.toLocaleDateString().replace(/\//g, "-") + " " + postTimeDate.toTimeString().substr(0, 8);
})
const buttonTypeDetail = computed(() => {
    //如果父组件传来的按钮标号为1，2时，分别显示“接下”,“查看”
    return buttonTypeRange.value[props.buttonTypeIndex - 1]
})
const showButton = computed(() => {
    //如果父组件传来的按钮标号为3时，则卡片不显示按钮
    return !(props.buttonTypeIndex === 3)
})
const relatedObVolume = computed(() => {
    //根据委托订单中的物品体积标号进行不同的显示
    if (props.order.relatedOb.volume == 1) {
        return "小"
    } else if (props.order.relatedOb.volume == 2) {
        return "中"
    } else if (props.order.relatedOb.volume == 3) {
        return "大"
    } else if (props.order.relatedOb.volume == 4) {
        return "超大"
    }
})

const TimeDetail = computed(() => {
    //卡片右上角显示的具体日期的会根据订单的状态变化而变化
    if (props.order.state == 1) {
        return timestampTodate(props.order.postTimestamp)
    } else if (props.order.state == 2) {
        return timestampTodate(props.order.takeTimestamp)
    } else if (props.order.state == 3) {
        return timestampTodate(props.order.finishTimestamp)
    } else if (props.order.state == 4) {
        return timestampTodate(props.order.payTimestamp)
    } else if (props.order.state == 5) {
        return timestampTodate(props.order.cancelTimestamp)
    }
})


//Props
const props = defineProps({
    order: {
        type: Object,
        required: true,
    },
    buttonTypeIndex: {
        type: Number,
        required: true
    }
})

//Emits
const emit = defineEmits({
    clickOrderItem: null
})

//方法
//日期转换
function timestampTodate(timestamp) {
    let date = new Date(parseInt(timestamp) * 1000)
    return date.toLocaleDateString().replace(/\//g, "-") + " " + date.toTimeString().substr(0, 8);
}

//监听倒计时结束事件
function onCountDownTimeup() {
    showCountdown.value = false
}


//监听订单项卡片的点击事件
function onClickOrderItem() {
    // let orderId = props.order.id
    // let posterUid = props.order.poster.uid


    //向父组件抛出clickOrderItem事件
    emit("clickOrderItem", { targetOrder: props.order, buttonTypeIndex: props.buttonTypeIndex })
}

//侦听器
watch(props.order.endTimestamp, () => {
    //计算页面倒计时
    let endTimestamp = parseInt(props.order.endTimestamp)
    console.log("结束时间", props.order.endTimestamp);
    let nowTime = parseInt(Date.now() / 1000)
    let difference = endTimestamp - nowTime
    console.log("时间差是", difference);
    if (difference > 0) {
        countDownSecond.value = difference
    } else {
        showCountdown.value = false
    }
})

// //每次出现
// onShow(() => {
//     // console.log(props.order.endTimestamp)
//     //计算页面倒计时
//     let endTimestamp = parseInt(props.order.endTimestamp)
//     // console.log("结束时间", props.order.endTimestamp);
//     let nowTime = parseInt(Date.now() / 1000)
//     let difference = endTimestamp - nowTime
//     // console.log("时间差是", difference);
//     if (difference > 0) {
//         countDownSecond.value = difference
//     } else {
//         showCountdown.value = false
//     }
// })

onMounted(()=>{
    //计算页面倒计时
    let endTimestamp = parseInt(props.order.endTimestamp)
    console.log("结束时间", props.order.endTimestamp);
    let nowTime = parseInt(Date.now() / 1000)
    let difference = endTimestamp - nowTime
    console.log("时间差是", difference);
    if (difference > 0) {
        countDownSecond.value = difference
    } else {
        showCountdown.value = false
    }
})
</script>

<style lang="scss" scoped>
@import "../common/global.scss";

.order-list-item {
    background-color: $color-white;
    border-radius: $card-radius;

    &-head {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15rpx;
        border-bottom: 1rpx solid #b7b7b7;

        &-icon {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 100rpx;
        }

        &-state {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: flex-start;
            align-items: center;
            height: 100rpx;

            &-date {
                font-size: 20rpx;
            }
        }
    }

    &-body {
        &-row {
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
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        &-countdown {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            &-text {
                font-size: $order-list-item-font-size;
                font-weight: bolder;
            }

            &-detail {
                display: flex;
                align-items: center;
                height: 60rpx;
                width: 180rpx;

                >text {
                    color: #dd524d;
                }
            }
        }

        &-reward {
            align-self: center;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 15rpx 0;
            padding: 6rpx;
            height: 50rpx;
            width: 100%;
            background-color: #dd524d;
            border-radius: 5rpx 15rpx;
            color: #FFFFFF;

            >text {
                font-size: $order-list-item-font-size;
                font-weight: bolder;
            }
        }

        &-button {
            align-self: center;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 6rpx;
            margin-left: 40rpx;
            height: 60rpx;
            width: 150rpx;
            background-color: #007AFF;
            color: #FFFFFF;
            font-size: 30rpx;
            font-weight: bolder;
            border-radius: 15rpx 5rpx;
        }
    }
}

.footer-top {
    display: flex;
    width: 100%
}

.footer-bottom {
    display: flex;
    justify-content: space-between;
    width: 100%
}
</style>