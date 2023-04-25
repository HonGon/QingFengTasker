<template>
    <scroll-view class="content" :scroll-y="true">
        <view class="header">
            <!--委托订单切换-->
            <view class="header-page-segement">
                <uni-segmented-control class="header-page-segement-control" :current="segIndex" :values="segItems"
                    @clickItem="onSegmentChange" styleType="text" activeColor="#007aff"></uni-segmented-control>
            </view>

            <!-- 搜索条以及筛选条件 -->
            <view class="header-search">
                <view class="header-search-bar">
                    <uni-search-bar cancelButton="auto" placeholder="搜索" radius=10></uni-search-bar>
                </view>
                <view class="header-search-order-type">
                    <text class="header-search-order-type-text">筛选</text>
                    <uni-data-select class="header-search-order-type-selected" v-model="orderTypeCondition"
                        :localdata="orderTypeConditionRange" @change="onOrderTypeConditionChange"></uni-data-select>
                </view>
            </view>
        </view>


        <!-- 委托订单列表 -->
        <view class="order-list">
            <template v-for="order in orderListOnDisplay" :key="order.id">
                <OrderListItemCard :order="order" @clickOrderItem="checkOrderDetail" :buttonTypeIndex="1">
                </OrderListItemCard>
            </template>
        </view>

        <!-- 加载更多还是没有更多 -->
        <uni-load-more :status="loadMoreTasks"  :contentText="loadMoreContentText"></uni-load-more>

        <!-- 接下委托订单时的弹窗提示 -->
        <uni-popup  type="dialog" ref="takeTaskDialog" >
            <uni-popup-dialog type="error" 
            cancelText="取消" confirmText="确认" 
            title="承接委托订单" content="确认接下该委托订单吗？" 
            @confirm="takeTaskDialogConfirm"
		    ></uni-popup-dialog>
        </uni-popup>
    </scroll-view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad , onReachBottom } from "@dcloudio/uni-app"
import { OrderListItemCard } from "../../components/OrderListItemCard.vue";
import { BottomPanel } from "../../components/BottomPanel.vue";
import { computed } from 'vue';

//响应式状态
const segIndex = ref(0)
const segItems = ref(["最新委托订单", "附近委托订单"])
const orderTypeCondition = ref(0)
const orderTypeConditionRange = ref([
    { value: 0, text: "全部" },
    { value: 1, text: "帮取快递" },
    { value: 2, text: "帮寄快递" },
    { value: 3, text: "帮取外卖" },
    { value: 4, text: "帮送文件" },
    { value: 5, text: "其他" }
])
const orderList = ref([])
const orderCount = ref(2)               //页面初始显示的委托数量
const selectedOrder = ref({})           //选中的委托订单

const loadMoreContentText = ref({ //自定义加载更多组件的文本
    contentdown: "上滑显示更多委托订单",
    contentrefresh: "正在加载...",
    contentnomore: "没有更多委托订单了"
})
const takeTaskDialog  = ref(null)       //模板引用，获取弹窗提示的引用    

//计算属性
//是否还有更多委托订单数据可以展示
const loadMoreTasks = computed( ()=> {
    return orderCount.value < orderListFilter.value.length? "more" : "noMore"
})

//实际在页面显示的委托订单
const orderListOnDisplay = computed( ()=> {
    return orderListFilter.value.slice(0, orderCount.value)
})

//筛选将要展示的委托订单列表
const orderListFilter = computed(() => {
    let user = {
        uid: "1782996909",
        name: ""
    }
    uni.setStorageSync("currentUser", user)

    //从全局变量中获取当前的用户信息
    let currentUser = uni.getStorageSync("currentUser")
    let resultList = orderList.value
    //根据委托订单类型进行筛选
    if (orderTypeCondition.value === 1) {
        resultList = resultList.filter((order) => {
            return order.type === 1
        })
    } else if (orderTypeCondition.value === 2) {
        resultList = resultList.filter((order) => {
            return order.type === 2
        })
    } else if (orderTypeCondition.value === 3) {
        resultList = resultList.filter((order) => {
            return order.type === 3
        })
    } else if (orderTypeCondition.value === 4) {
        resultList = resultList.filter((order) => {
            return order.type === 4
        })
    }
    else if (orderTypeCondition.value === 5) {
        resultList = resultList.filter((order) => {
            return order.type === 5
        })
    }
    return resultList
})

//获取用户定位信息
async function getUserNearbyTasks() {
    await uni.getLocation({
            type:"gcj02",
            success: (res) => {
                console.log("当前经度是",res.longitude,"纬度是",res.latitude)
                return {longitude:res.longitude,latitude:res.latitude}
            }
        })
    return {}
}

//方法
//处理分页标签变更事件
async function onSegmentChange(e) {
    // console.log("当前分页标签", e);
    if (segIndex.value != e.currentIndex) {
        segIndex.value = e.currentIndex;
    }
    orderTypeCondition.value = 0
    orderCount.value = 2
    if (segIndex.value == 1){
        uni.showLoading({
            title: '加载中'
        })
        //获取用户附近的委托订单
        await getUserNearbyTasks()
        uni.hideLoading()
    }
}

//处理筛选条件变化事件
function onOrderTypeConditionChange(e) {
    // console.log("当前委托订单状态筛选条件标签", e)
}

//处理委托订单项卡片点击接下按钮的事件
function checkOrderDetail(e) {
    console.log("来自子组件的点击事件！", e)
    selectedOrder.value = e.targetOrder
    takeTaskDialog.value.open()
}

//处理接下委托订单弹窗确认事件
function takeTaskDialogConfirm() {
    console.log("接下该委托订单!",selectedOrder.value)
}


//页面生命周期
onLoad(async (option) => {
    //获取委托订单列表
    const result = await import("../../static/order-collection.json")
    orderList.value = result.default
    
    console.log("页面参数为",option)
    //从前一个页面获取当前页的分段标签
    segIndex.value = parseInt(option.segIndex)

    if(segIndex.value == 1){
        getUserNearbyTasks()
    }

})

//滑动到底部时
onReachBottom( () => {
    //增加页面显示的委托订单数量，每次加2
    orderCount.value += 2
    if(orderCount.value >= orderList.value.length){
        orderCount.value = orderList.value.length
    }
})

</script>

<style lang="scss" scoped>
@import "./take-task.scss";
</style>