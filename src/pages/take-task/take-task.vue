<template>
    <scroll-view class="content" :scroll-y="true">
        <view class="header">
            <!--委托订单切换-->
            <view class="header-page-segement">
                <uni-segmented-control class="header-page-segement-control" :current="segIndex" :values="segItems"
                    @clickItem="onSegmentChange" styleType="text" activeColor="#007aff"></uni-segmented-control>
            </view>

            <!-- 搜索条以及筛选条件 -->
            <view class="header-select">
                <view class="header-select-order-type">
                    <text class="header-select-order-type-text">筛选:</text>
                    <uni-data-select class="header-select-order-type-selected" v-model="orderTypeCondition"
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
        <uni-load-more :status="loadMoreTasks" :contentText="loadMoreContentText"></uni-load-more>

        <!-- 接下委托订单时的弹窗提示 -->
        <uni-popup type="dialog" ref="takeTaskDialog">
            <uni-popup-dialog type="error" cancelText="取消" confirmText="确认" title="承接委托订单" content="确认接下该委托订单吗？"
                @confirm="takeTaskDialogConfirm"></uni-popup-dialog>
        </uni-popup>
    </scroll-view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app"
import { OrderListItemCard } from "../../components/OrderListItemCard.vue";
import { BottomPanel } from "../../components/BottomPanel.vue";
import { computed } from 'vue';
import { _ } from 'lodash'
import { useLoginUserStore } from '../../store/modules/loginUserStore'
import { useTimerControlStore } from '../../store/modules/timerControlStore';

const timerControlStore = useTimerControlStore()
const loginUserStore = useLoginUserStore()

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
const takeTaskDialog = ref(null)       //模板引用，获取弹窗提示的引用    

//计算属性
//是否还有更多委托订单数据可以展示
const loadMoreTasks = computed(() => {
    return orderCount.value < orderListFilter.value.length ? "more" : "noMore"
})

//实际在页面显示的委托订单
const orderListOnDisplay = computed(() => {
    return orderListFilter.value.slice(0, orderCount.value)
})

//筛选将要展示的委托订单列表
const orderListFilter = computed(() => {
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


//调用后端云函数获取最新的委托订单
async function getLatestOrders() {
    //获取当前用户的uid
    let latestOrders = []
    let posterUid = loginUserStore.user.uid
    console.log("最新的委托,当前登录的用户UID", posterUid)
    await wx.cloud.callFunction({
        name: "getLatestOrdersController",
        data: {
            posterUid: posterUid
        }
    }).then(res => {
        latestOrders = res.result.orders
        latestOrders = _.sortBy(latestOrders, (o) => {
            return -o.postTimestamp
        })
    }).catch(err => {
        console.log("出错了！", err)
    })
    //返回最新发布的委托订单
    latestOrders = latestOrders.filter((o) => {
        return (parseInt(o.endTimestamp) - parseInt((new Date().getTime() / 1000))) > 0 || (parseInt(o.endTimestamp) == 0)
    })
    return latestOrders
}

//从后端云函数获取附近的委托订单
async function getUserNearbyTasks() {
    return new Promise((resovle, reject) => {
        let latestLongitude = 0
        let latestLatitude = 0
        let cid = ""
        let uid = ""
        let resultList = []

        //从全局变量中获取到校区信息
        cid = uni.getStorageSync("campus").cid

        //从全局变量中获取到校区信息
        uid = loginUserStore.user.uid
        console.log("附近的委托，当前登录的用户UID", uid)

        uni.getLocation({
            type: "gcj02",
            success: (res) => {
                // latestLongitude = res.longitude
                latestLongitude = 113.36115             // 图书馆驿站的
                // latestLatitude = res.latitude
                latestLatitude = 23.195524
                console.log("当前经度是", latestLongitude, "纬度是", latestLatitude)
                resovle({ latestLongitude, latestLatitude, cid, uid, resultList })
            },
            fail: (err) => {
                uni.showToast({
                    icon: "err",
                    title: "请打开位置开关",
                    duration: 2000
                })
            }
        })
    }).then(async ({ latestLongitude, latestLatitude, cid, uid, resultList }) => {
        await wx.cloud.callFunction({
            name: "getNearbyOrdersController",
            data: {
                latestLongitude: latestLongitude,
                latestLatitude: latestLatitude,
                cid: cid,
                uid: uid
            }
        }).then(res => {
            resultList = res.result.orders
            console.log("成功获取！", orderList.value)
        })
        console.log("promise里的", resultList)
        resultList = resultList.filter((o) => {
            return (parseInt(o.endTimestamp) - parseInt((new Date().getTime() / 1000))) > 0 || parseInt(o.endTimestamp) == 0
        })
        console.log("筛选完成之后的", resultList)
        return resultList
    })
}


//方法
//处理分页标签变更事件
async function onSegmentChange(e) {
    // console.log("当前分页标签", e);
    if (segIndex.value != e.currentIndex) {
        segIndex.value = e.currentIndex;
    }
    //重置页面一些状态
    orderTypeCondition.value = 0
    orderCount.value = 2

    if (segIndex.value == 0) {
        //获取最新的订单
        uni.showLoading({
            title: "加载中"
        })
        orderList.value = await getLatestOrders()
        uni.hideLoading()
    } else {
        //获取用户附近的委托订单
        uni.showLoading({
            title: '定位中,请稍等'
        })
        orderList.value = await getUserNearbyTasks()
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
async function takeTaskDialogConfirm() {
    uni.showLoading()
    console.log("接下该委托订单!", selectedOrder.value)

    let _id = selectedOrder.value._id

    //从全局变量中获取到登录的用户信息
    let loginUser = loginUserStore.user
    console.log("接下委托订单,当前的用户UID", loginUser.uid)

    //promis处理用户定位的异步操作
    new Promise((resovle, reject) => {
        let latestLongitude = 0
        let latestLatitude = 0
        uni.getLocation({
            type: "gcj02",
            success: (res) => {
                console.log("定位成功！", res)
                latestLongitude = res.longitude
                latestLatitude = res.latitude
                resovle({ latestLongitude, latestLatitude })
            },
            // fail:(err) => {
            //     console.log("定位失败！",err)
            //     reject(err)
            // }
        })
    }).then(async ({ latestLongitude, latestLatitude }) => {
        let taker = {
            uid: loginUser.uid,
            name: loginUser.name,
            phoneNumber: loginUser.phoneNumber,
            // latestLongitude: latestLongitude,
            latestLongitude: 113.358029,            //测试的经度 内区饭堂的坐标
            // latestLatitude: latestLatitude,      //测试的纬度
            latestLatitude: 23.197092
        }
        await wx.cloud.callFunction({
            name: "takeTaskController",
            data: {
                _id: _id,
                taker: taker
            }
        }).then(res => {
            //如果后端更新成功
            console.log("请求后端的结果", res);
            if (res.result.msg[0] == "更新成功" && res.result.msg[1] == "更新成功") {
                //如果待上传地址订单编号数组是从空的变成有的，就新开启一个定时器
                if (timerControlStore.orderIdList.length == 0) {
                    timerControlStore.setNewTimer(true)
                } else {
                    //如果不是，则不开启
                    timerControlStore.setNewTimer(false)
                }
                //将当前待上传位置信息的订单的id添加到控制定时器的全局变量里
                timerControlStore.addOrderIdToList(selectedOrder.value.id)
                console.log('当前待上传位置信息的订单ID数组',timerControlStore.orderIdList)

                uni.hideLoading()
                
                //将接下的订单信息保存在全局变量中并传递给订单详情页面
                uni.setStorageSync("orderDetail", selectedOrder.value)
                uni.navigateTo({
                    url: "/pages/order-detail/order-detail"
                })
                // uni.showToast({
                //     title: "接下委托成功！",
                //     duration: 2000
                // })
            } else {
                uni.showToast({
                    title: "请求出错！",
                    duration: 2000
                })
            }
        })
    })
    // .catch(err => {
    //     uni.showToast({
    //         icon:"error",
    //         title: "请打开定位！"
    //     })
    // })
}

//每次新进入页面都刷新数据
async function freshOrderList() {
    if (segIndex.value == 0) {
        uni.showLoading({
            title: "加载中"
        })
        orderList.value = await getLatestOrders()
        console.log("最新的委托订单列表", orderList.value)
        uni.hideLoading()
    } else {
        uni.showLoading({
            title: '定位中,请稍等'
        })
        orderList.value = await getUserNearbyTasks()
        console.log("附近的委托订单列表", orderList.value)
        uni.hideLoading()
    }
}

//页面生命周期
onLoad(async (option) => {
    //设置当前的校区编号
    uni.setStorageSync("campus", { cid: "0001" })
    console.log("页面参数为", option)
    //从前一个页面获取当前页的分段标签
    segIndex.value = parseInt(option.segIndex)
})

onShow(async () => {
    await freshOrderList()
})

//滑动到底部时
onReachBottom(() => {
    //增加页面显示的委托订单数量，每次加2
    orderCount.value += 2
    if (orderCount.value >= orderList.value.length) {
        orderCount.value = orderList.value.length
    }
})

</script>

<style lang="scss" scoped>
@import "./take-task.scss";
</style>