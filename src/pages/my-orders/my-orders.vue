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
                    <uni-data-select class="header-search-order-state-selected" v-model="orderStateCondition"
                        :localdata="orderStateConditionRange" @change="onOrderStateConditionChange"></uni-data-select>
                </view>
            </view>
        </view>


        <!-- 订单列表 -->
        <view class="order-list">

            <template v-for="order in orderListFilter" :key="order.id">
                <OrderListItemCard :order="order" @clickOrderItem="checkOrderDetail" :buttonTypeIndex="2">
                </OrderListItemCard>
            </template>
        </view>
    </scroll-view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from "@dcloudio/uni-app"
import { OrderListItemCard } from "../../components/OrderListItemCard.vue";
import { BottomPanel } from "../../components/BottomPanel.vue";
import { computed } from 'vue';

//响应式状态
const segIndex = ref(0)
const segItems = ref(["我发布的", "我接下的"])
const orderStateCondition = ref(0)
const orderStateConditionRange = ref([
    { value: 0, text: "全部" },
    { value: 1, text: "待接取" },
    { value: 2, text: "执行中" },
    { value: 3, text: "未付款" },
    { value: 4, text: "已完成" }
])
const orderList = ref([])

//计算属性
//筛选将要展示的订单列表
const orderListFilter = computed(() => {
    let user = {
        uid: "1782996909",
        name: ""
    }
    uni.setStorageSync("currentUser", user)

    //从全局变量中获取当前的用户信息
    let currentUser = uni.getStorageSync("currentUser")
    let resultList = []

    //筛选是用户发布还是接下的订单
    if (segIndex.value === 0) {
        resultList = orderList.value.filter((order) => {
            return order.poster.uid === currentUser.uid
        })
    } else {
        resultList = orderList.value.filter((order) => {
            return order.taker.uid === currentUser.uid
        })
    }
    //根据订单状态进行筛选
    if (orderStateCondition.value === 1) {
        resultList = resultList.filter((order) => {
            return order.state === 1
        })
    } else if (orderStateCondition.value === 2) {
        resultList = resultList.filter((order) => {
            return order.state === 2
        })
    } else if (orderStateCondition.value === 3) {
        resultList = resultList.filter((order) => {
            return order.state === 3
        })
    } else if (orderStateCondition.value === 4) {
        resultList = resultList.filter((order) => {
            return order.state === 4
        })
    }
    return resultList
})


//方法
function onSegmentChange(e) {
    console.log("当前分页标签", e);
    if (segIndex.value != e.currentIndex) {
        segIndex.value = e.currentIndex;
    }
    if (segIndex.value == 0) {
        orderStateConditionRange.value = [
            { value: 0, text: "全部" },
            { value: 1, text: "待接取" },
            { value: 2, text: "执行中" },
            { value: 3, text: "未付款" },
            { value: 4, text: "已完成" }
        ]
    } else {
        orderStateConditionRange.value = [
            { value: 0, text: "全部" },
            { value: 2, text: "执行中" },
            { value: 3, text: "未付款" },
            { value: 4, text: "已完成" }
        ]
    }
    orderStateCondition.value = 0
}

//处理筛选条件变化事件
function onOrderStateConditionChange(e) {
    console.log("当前订单状态筛选条件标签", e)
}



//处理订单项卡片点击事件
function checkOrderDetail(e) {
    console.log("来自子组件的点击事件！", e)

    uni.setStorageSync("orderDetail", e.targetOrder)
    uni.navigateTo({
        url: "../order-detail/order-detail"
    })
}


//页面生命周期
onLoad(async () => {
    //获取订单列表
    const result = await import("../../static/order-collection.json")
    orderList.value = result.default
})
</script>

<style lang="scss" scoped>
@import "./my-orders.scss";
</style>