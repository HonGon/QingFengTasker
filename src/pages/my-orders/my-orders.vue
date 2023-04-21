<template>
    <scroll-view class="content" scroll-y="true">
        <view class="header">
            <!--订单切换-->
            <view class="header-page-segement">
                <uni-segmented-control class="header-page-segement-control" :current="segIndex" :values="segItems"
                    @clickItem="onSegmentChange" styleType="text" activeColor="#007aff"></uni-segmented-control>
            </view>

            <!-- 搜索条以及筛选条件 -->
            <view class="header-search">
                <view class="header-search-bar">
                    <uni-search-bar cancelButton="auto" placeholder="搜索" radius=10></uni-search-bar>
                </view>
                <view class="header-search-order-state">
                    <text class="header-search-order-state-text">筛选</text>
                    <uni-data-select class="header-search-order-state-selected" v-model="orderState"
                        :localdata="orderStateRange"></uni-data-select>
                </view>
            </view>
        </view>


        <!-- 订单列表 -->
        <view class="order-list">
            <OrderListItemCard :order="order"></OrderListItemCard>
            <OrderListItemCard :order="order"></OrderListItemCard>
            <OrderListItemCard :order="order"></OrderListItemCard>
        </view>

        <BottomPanel :showCancel="true" :showUpdate="true"></BottomPanel>

    </scroll-view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from "@dcloudio/uni-app"
import { OrderListItemCard } from "../../components/OrderListItemCard.vue";
import { BottomPanel } from "../../components/BottomPanel.vue";

//响应式状态
const segIndex = ref(0)
const segItems = ref(["我发布的", "我接下的"])
const orderState = ref(0)
const orderStateRange = ref([
    { orderState: 0, text: "全部" },
    { orderState: 1, text: "未接下" },
    { orderState: 2, text: "执行中" },
    { orderState: 3, text: "未付款" },
    { orderState: 4, text: "已完成" }
])
const countDown = ref({
    hour: 1,
    min: 20,
    sec: 59,
})
const order = ref({})

//方法
function onSegmentChange(e) {
    console.log(e);
    if (segIndex.value != e.currentIndex) {
        segIndex.value = e.currentIndex;
    }
    if (segIndex.value == 0) {
        orderStateRange.value = [
            { orderState: 0, text: "全部" },
            { orderState: 1, text: "未接下" },
            { orderState: 2, text: "执行中" },
            { orderState: 3, text: "未付款" },
            { orderState: 4, text: "已完成" }
        ]
    } else {
        orderStateRange.value = [
            { orderState: 0, text: "全部" },
            { orderState: 2, text: "执行中" },
            { orderState: 3, text: "未付款" },
            { orderState: 4, text: "已完成" }
        ]
    }
}

//页面生命周期
onLoad(() => {
    order.value = {
        id: "202304201681984902",        //订单编号
        type: 4,                        //委托类型
        state: 1,                       //订单状态
        content: "去图书馆下拿快递去图书馆下拿快递去图书馆下拿快递去图书馆下拿快递去图书馆下拿快递",      //委托内容
        startAddress: "图书馆",          //起始地址
        endAddress: "学生宿舍C栋601B",   //目的地址
        releatedOb: {                   //委托相关物品信息
            weight: "3Kg",
            volume: "超大",
        },
        note: "请尽快取件",              //订单备注
        endTime: "1682996902",          //委托完成截止时间
        reward: "10元",                 //委托报酬
        poster: {                       //委托发布者信息
            name: "",                   //称呼
            phoneNumber: ""             //联系电话
        },
        taker: {                        //委托承接者信息
            name: "",
            phoneNumber: "",
            latestPosition: ""          //骑手的最新位置
        },
        attachmentList: ["", ""],        //图片附件url列表
    }
})
</script>

<style lang="scss" scoped>
@import "./my-orders.scss";
</style>