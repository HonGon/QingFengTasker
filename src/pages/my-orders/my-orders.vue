<template>
    <scroll-view class="content" scroll-y="true">
        <view class="header">
            <!--委托订单切换-->
            <view class="header-page-segement">
                <uni-segmented-control class="header-page-segement-control" :current="segIndex" :values="segItems"
                    @clickItem="onSegmentChange" styleType="text" activeColor="#007aff"></uni-segmented-control>
            </view>

            <!-- 搜索条以及筛选条件 -->
            <view class="header-search">
                <view class="header-search-bar">
                    <uni-search-bar v-model="searchBarContent" cancelButton="auto" placeholder="搜索"
                        radius=10></uni-search-bar>
                </view>
                <view class="header-search-order-state">
                    <text class="header-search-order-state-text">筛选</text>
                    <uni-data-select class="header-search-order-state-selected" v-model="orderStateCondition"
                        :localdata="orderStateConditionRange" @change="onOrderStateConditionChange"></uni-data-select>
                </view>
            </view>
        </view>


        <!-- 委托订单列表 -->
        <view class="order-list">

            <template v-for="order in orderListOnDisplay" :key="order.id">
                <OrderListItemCard :order="order" @clickOrderItem="checkOrderDetail" :buttonTypeIndex="2">
                </OrderListItemCard>
            </template>
        </view>

        <!-- 加载更多还是没有更多 -->
        <uni-load-more :status="loadMoreOrders" :contentText="loadMoreContentText"></uni-load-more>

    </scroll-view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app"
import { OrderListItemCard } from "../../components/OrderListItemCard.vue";
import { BottomPanel } from "../../components/BottomPanel.vue";
import { _ } from 'lodash'
import { watch } from 'vue';
import { useLoginUserStore } from '../../store/modules/loginUserStore'

const loginUserStore = useLoginUserStore()


//响应式状态
const segIndex = ref(0)
const segItems = ref(["我发布的", "我接下的"])
const orderStateCondition = ref(0)
const orderStateConditionRange = ref([
    { value: 0, text: "全部" },
    { value: 1, text: "待接取" },
    { value: 2, text: "执行中" },
    { value: 3, text: "未付款" },
    { value: 4, text: "已完成" },
    { value: 5, text: "已取消" }
])
const orderList = ref([])
const orderCount = ref(2)           //页面初始显示的委托订单数量

const searchBarContent = ref("")

const loadMoreContentText = ref({ //自定义加载更多组件的文本
    contentdown: "上滑显示更多委托订单",
    contentrefresh: "正在加载...",
    contentnomore: "没有更多委托订单了"
})

//计算属性
//是否还有更多委托订单数据可以展示
const loadMoreOrders = computed(() => {
    return orderCount.value < orderListFilter.value.length ? "more" : "noMore"
})

//实际在页面显示的委托订单项
const orderListOnDisplay = computed(() => {
    //如果搜索框不为空，则优先展示用户搜索的内容
    if (searchBarContent.value !== "") {
        return orderList.value.filter((o) => {
            return o.content.indexOf(searchBarContent.value) != -1
        })
    }
    return orderListFilter.value.slice(0, orderCount.value)
})

//筛选将要展示的委托订单项
const orderListFilter = computed(() => {
    //从全局变量中获取当前的用户信息
    let loginUser = loginUserStore.user
    let resultList = []

    //筛选是用户发布还是接下的委托订单
    if (segIndex.value === 0) {
        resultList = orderList.value.filter((order) => {
            return order.poster.uid === loginUser.uid
        })
    } else {
        resultList = orderList.value.filter((order) => {
            return order.taker.uid === loginUser.uid
        })
    }
    //根据委托订单状态进行筛选
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
    else if (orderStateCondition.value === 5) {
        resultList = resultList.filter((order) => {
            return order.state === 5
        })
    }
    //按照发布时间进行排序，最新的显示在最前面
    resultList = _.sortBy(resultList, (o) => {
        return -o.postTimestamp
    })
    console.log(resultList)
    return resultList
})


//方法
function onSegmentChange(e) {
    if (segIndex.value != e.currentIndex) {
        segIndex.value = e.currentIndex;
    }
    if (segIndex.value == 0) {
        orderStateConditionRange.value = [
            { value: 0, text: "全部" },
            { value: 1, text: "待接取" },
            { value: 2, text: "执行中" },
            { value: 3, text: "未付款" },
            { value: 4, text: "已完成" },
            { value: 5, text: "已取消" }
        ]
    } else {
        orderStateConditionRange.value = [
            { value: 0, text: "全部" },
            { value: 1, text: "待接取" },
            { value: 2, text: "执行中" },
            { value: 3, text: "未付款" },
            { value: 4, text: "已完成" },
            { value: 5, text: "已取消" }
        ]
    }
    orderStateCondition.value = 0
    orderCount.value = 2
}

//处理筛选条件变化事件
function onOrderStateConditionChange(e) {
    console.log("当前委托订单状态筛选条件标签", e)
}



//处理委托订单项卡片点击事件
function checkOrderDetail(e) {
    console.log("来自子组件的点击事件！", e)

    uni.setStorageSync("orderDetail", e.targetOrder)
    uni.navigateTo({
        url: "../order-detail/order-detail"
    })
}


//页面生命周期
onLoad(async () => {
    //获取委托委托订单列表
    // const result = await import("../../static/order-collection.json")
    // orderList.value = result.default
})

// 页面每次出现时
onShow(async () => {
    //从全局变量中获取用户uid
    let uid = loginUserStore.user.uid

    await wx.cloud.callFunction({
        name: "getAllMyOrdersController",
        data: {
            uid: uid
        }
    }).then(res => {
        console.log(res)
        let ordersFormDB = res.result.orders
        console.log("我的全部订单", ordersFormDB)
        orderList.value = ordersFormDB
    }).catch(err => {
        console.log(err)
    })
})


//页面滑到底部时
onReachBottom(() => {
    orderCount.value += 2
    if (orderCount.value >= orderListFilter.value.length) {
        orderCount.value = orderListFilter.value.length
    }
})

</script>

<style lang="scss" scoped>
@import "./my-orders.scss";
</style>