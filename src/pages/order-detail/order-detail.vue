<template>
    <scroll-view class="content" :scroll-y="true">
        <!-- 地图组件 -->
        <MapWithMarkers v-if="showMap" :centerLocation="centerLocation" :markers="markers" @chooseNewLocation="showLoc">
        </MapWithMarkers>
        <!-- 订单项组件 -->
        <OrderListItemCard :order="order" :buttonTypeIndex="3"></OrderListItemCard>

        <!-- 报酬信息 -->
        <template v-if="showRewardInfo">
            <uni-card title="报酬信息">
                <uni-row>
                    <uni-col :span="8">
                        <text class="text">初始报酬(元)</text>
                    </uni-col>
                    <uni-col :span="10" :push="6">
                        <text class="detail">{{ order.reward }}</text>
                    </uni-col>
                </uni-row>
                <uni-row>
                    <uni-col :span="8">
                        <text class="text">最终报酬(元)</text>
                    </uni-col>
                    <uni-col :span="10" :push="6">
                        <text class="detail">{{ order.finalReward }}</text>
                    </uni-col>
                </uni-row>
            </uni-card>
        </template>

        <!-- 发布者信息 -->
        <uni-card title="发布者信息">
            <uni-row>
                <uni-col :span="4">
                    <text class="text">
                        UID:</text>
                </uni-col>
                <uni-col :span="10" :push="10">
                    <text class="detail">{{ order.poster.uid }}</text>
                </uni-col>
            </uni-row>

            <uni-row>
                <uni-col :span="8">
                    <text class="text">称呼：</text>
                </uni-col>
                <uni-col :span="10" :push="6">
                    <text class="detail">{{ order.poster.name }}</text>
                </uni-col>
            </uni-row>

            <uni-row>
                <uni-col :span="8">
                    <text class="text">联系方式：</text>
                </uni-col>
                <uni-col :span="10" :push="6">
                    <text class="detail">{{ order.poster.phoneNumber }}</text>
                </uni-col>
            </uni-row>

            <uni-row>
                <uni-col :span="8">
                    <text class="text">详细起始地址：</text>
                </uni-col>
                <uni-col :span="10" :push="6">
                    <text class="detail">{{ order.startAddressDetail }}</text>
                </uni-col>
            </uni-row>

            <uni-row>
                <uni-col :span="8">
                    <text class="text">详细终点地址：</text>
                </uni-col>
                <uni-col :span="10" :push="6">
                    <text class="detail">{{ order.endAddressDetail }}</text>
                </uni-col>
            </uni-row>

        </uni-card>

        <!-- 承接人信息 -->
        <template v-if="showTakerInfo">
            <uni-card title="承接人信息">
                <uni-row>
                    <uni-col :span="4">
                        <text class="text">
                            UID:</text>
                    </uni-col>
                    <uni-col :span="10" :push="10">
                        <text class="detail">{{ order.taker.uid }}</text>
                    </uni-col>
                </uni-row>

                <uni-row>
                    <uni-col :span="8">
                        <text class="text">称呼：</text>
                    </uni-col>
                    <uni-col :span="10" :push="6">
                        <text class="detail">{{ order.taker.name }}</text>
                    </uni-col>
                </uni-row>

                <uni-row>
                    <uni-col :span="8">
                        <text class="text">联系方式：</text>
                    </uni-col>
                    <uni-col :span="10" :push="6">
                        <text class="detail">{{ order.taker.phoneNumber }}</text>
                    </uni-col>
                </uni-row>
            </uni-card>
        </template>


        <template v-if="showAttachment">
            <view class="image-picker">
                <ImagePicker :imageList="imageList" :isInteractable="false"></ImagePicker>
            </view>
        </template>


        <uni-popup ref="popup">
            <view class="popup-image">
                <image :src="attachmentSrc" mode="heightFix"></image>
            </view>
        </uni-popup>

        <!-- 底部面板 -->
        <BottomPanel :buttonIndexArray="ButtonIndexArray" @clickBottomButton="onClickBottomButton"></BottomPanel>
    </scroll-view>

    <uni-popup ref="cancelDialogPopup" type="dialog">
        <uni-popup-dialog type="error" cancelText="返回" confirmText="确认" title="修改订单" content="确认要取消订单吗？"
            @confirm="onCancelDialogConfirm"></uni-popup-dialog>
    </uni-popup>

    <uni-popup ref="finishDialogPopup" type="dialog">
        <uni-popup-dialog type="error" cancelText="返回" confirmText="确认" title="完成订单" content="确认提交订单已完成吗？"
            @confirm="onFinishDialogConfirm"></uni-popup-dialog>
    </uni-popup>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue"
import { onLoad, onShow } from "@dcloudio/uni-app"
import { ImagePicker } from '../../components/ImagePicker.vue'
import { MapWithMarkers } from "../../components/MapWithMarkers.vue"
import { OrderListItemCard } from "../../components/OrderListItemCard.vue"
import { BottomPanel } from "../../components/BottomPanel.vue"

//响应式状态
const scale = ref(16)               //地图缩放程度
const markers = ref([])              //标记点集合
const centerLocation = ref({
    name: "",
    longitude: 0,
    latitude: 0
})
const attachmentSrc = ref("")       //当前选中的附件
const popup = ref(null)             //模板引用，引用uniapp的遮罩层
const cancelDialogPopup = ref(null)
const finishDialogPopup = ref(null)

const order = ref({})               //订单数据
const imageList = ref([])           //附件列表
//侦听器
watch(imageList.value, () => {
    console.log("图片列表改变了，现在的值是", imageList.value)
})


//计算属性
const showRewardInfo = computed(() => {
    //如果订单状态是未付款或者是已完成，则显示订单报酬信息
    return order.value.state == 3 || order.value.state == 4 ? true : false
})

const showAttachment = computed(() => {
    // 如果附件列表为空，则不显示附件
    return !(order.value.attachmentList.length == 0)
})

const showTakerInfo = computed(() => {
    return order.value.state === 1 || order.value.state === 5 ? false : true
})

const showMap = computed(() => {
    return order.value.state === 4 ? false : true
})
//底部面板按钮控制
const ButtonIndexArray = computed(() => {
    let logintUser = uni.getStorageSync("loginUser")
    //如果订单是待接取状态
    if (order.value.state === 1) {
        return [1, 1, 1, 0, 0, 0]
    } else if (order.value.state === 2) {  //如果订单是待接取状态
        //判断当前登录用户的身份
        if (logintUser.uid == order.value.poster.uid) {
            return [0, 0, 1, 1, 0, 0]
        } else if (logintUser.uid == order.value.taker.uid) {
            return [0, 0, 1, 0, 0, 1]
        }
    } else if (order.value.state === 3) {  //未付款
        //判断当前登录用户的身份
        if (logintUser.uid == order.value.poster.uid) {
            return [0, 0, 1, 1, 0, 0]
        } else if (logintUser.uid == order.value.taker.uid) {
            return [0, 0, 1, 0, 0, 0]
        }
        return [0, 0, 1, 1, 0, 0]
    }
    return [0, 0, 1, 0, 0, 0]
})


//方法
//处理点击图片事件
function onClickImage(e) {
    attachmentSrc.value = e
    popup.value.open('center')
}

function onClickBottomButton(e) {
    // console.log("来自底部面板组件！", e)
    if (e === 1) {              //点击了取消订单按钮
        console.log("取消订单！")
        cancelDialogPopup.value.open()
    } else if (e === 2) {       //点击了修改按钮
        console.log("修改订单！")
    } else if (e === 3) {       //点击了返回按钮
        //返回上一个页面
        console.log("返回！")
        uni.navigateBack()
    } else if (e === 4) {       //点击了支付按钮
        payOrder()
        console.log("支付订单！")
    } else if (e === 6) {       //点击了支付按钮
        console.log("完成订单！")
        finishDialogPopup.value.open()
    }
}

//支付模拟
function payOrder() {
    uni.showModal({
        title: '微信支付',
        content: `您需支付${order.value.finalReward}元`,
        success: function (res) {
            if (res.confirm) {
                uni.showLoading({
                    title: '支付中'
                })
                console.log('用户点击确定');
                wx.cloud.callFunction({
                    name: "payOrderController",
                    data: {
                        _id: order.value._id,
                    }
                }).then(res => {
                    if (res.result.msg == "支付成功") {
                        uni.hideLoading()
                        uni.showToast({
                            title: '支付成功！',
                            duration: 2000
                        })
                        uni.redirectTo({
                            url: '/pages/order-detail/order-detail'
                        })
                    } else {
                        uni.hideLoading()
                        uni.showToast({
                            icon: 'error',
                            title: '支付失败！',
                            duration: 2000
                        })
                    }
                }).catch(err => {
                    uni.hideLoading()
                    uni.showToast({
                        icon: 'error',
                        title: '出错！',
                        duration: 2000
                    })
                })
            } else if (res.cancel) {
                console.log('用户点击取消');
            }
        }
    })
}

//处理取消订单点击事件
function onCancelDialogConfirm() {
    console.log("取消了订单！")
    //获取当前委托订单的编号
    let _id = order.value._id
    wx.cloud.callFunction({
        name: "cancelOrderController",
        data: {
            _id: _id
        }
    }).then(res => {
        if (res.result.msg == "更新成功") {
            uni.showToast({
                icon: "success",
                title: "取消订单成功！",
                duration: 2000
            })
            //刷新页面
            setTimeout(() => {
                uni.redirectTo({
                    url: "/pages/order-detail/order-detail"
                })
            }, 500)

        } else {
            uni.showToast({
                icon: "error",
                title: "出错！",
                duration: 2000
            })
        }
    }).catch(err => {
        console.log("取消订单失败", err)
        uni.showToast({
            icon: "error",
            title: "出错！",
            duration: 2000
        })
    })
}

//处理完成订单点击事件
function onFinishDialogConfirm() {
    console.log("完成了订单！")
    wx.cloud.callFunction({
        name: "finishOrderController",
        data: {
            id: order.value.id
        }
    }).then(res => {
        if (res.result.msg == "提交成功") {
            uni.showToast({
                title: "提交完成成功！",
            })
            uni.redirectTo({
                url: "/pages/order-detail/order-detail"
            })
        } else {
            uni.showToast({
                title: "出错！",
                duration: 2000
            })
        }
    }).catch(err => {
        console.log("提交完成失败！", err)
        uni.showToast({
            title: "出错！",
            duration: 2000
        })
    })

}

onLoad(async () => {
    uni.showLoading()
    //从全局变量中获取订单对象
    let orderId = uni.getStorageSync("orderDetail").id

    //调用后端云函数
    await wx.cloud.callFunction({
        name: "getOrderDetailController",
        data: {
            id: orderId
        }
    }).then(res => {
        order.value = res.result.order
        console.log("当前订单是", order.value)
    })

    //检查附件信息
    if (order.value.attachmentList.length != 0) {
        new Promise((resolve, reject) => {
            let fileList = []
            wx.cloud.getTempFileURL({
                fileList: order.value.attachmentList,
                success: res => {
                    fileList = res.fileList
                    resolve({ fileList })
                }
            })
        }).then(({ fileList }) => {
            let id = 0
            for (let i = 0; i < fileList.length; i++) {
                imageList.value.push({
                    id: id++,
                    path: fileList[i].tempFileURL
                })
            }
        })
    }
    console.log("当前选择的图片列表",imageList.value)

    //制作地图标记点
    let locations = [order.value.startAddress, order.value.endAddress]
    let locationMarkers = []
    let markersIndex = 0

    for (markersIndex = 0; markersIndex < locations.length; markersIndex++) {
        locationMarkers.push({
            id: markersIndex,
            longitude: locations[markersIndex].longitude,
            latitude: locations[markersIndex].latitude,
            iconPath: "/static/image/location.png",
            width: 20,
            height: 20,
            callout: {
                content: locations[markersIndex].name,
                color: "#ffffff",
                fontSize: 15,
                borderRadius: 5,
                bgColor: "#007aff",
                padding: 2,
                display: "ALWAYS"
            }
        })
    }
    //如果订单是被人承接之后的状态，即不是待接取以及已取消的状态
    //地图上显示骑手的坐标
    if (order.value.state != 1 && order.value.state != 5) {
        markersIndex++
        locationMarkers.push({
            id: markersIndex,
            longitude: order.value.taker.latestLongitude,
            latitude: order.value.taker.latestLatitude,
            iconPath: "/static/image/location.png",
            width: 20,
            height: 20,
            callout: {
                content: "承接人",
                color: "#ffffff",
                fontSize: 15,
                borderRadius: 5,
                bgColor: "#dd524d",
                padding: 2,
                display: "ALWAYS"
            }
        })
    }
    //将标记点传给地图组件
    markers.value = locationMarkers
    console.log("当前地图标点", markers.value)
    //取订单起点、终点的中点作为地图中心
    centerLocation.value = {
        longitude: (order.value.startAddress.longitude + order.value.endAddress.longitude) / 2,
        latitude: (order.value.startAddress.latitude + order.value.endAddress.latitude) / 2
    }
    uni.setStorageSync("centerLocation", centerLocation.value)
    uni.hideLoading()
})

onLoad(async () => {
})
</script>

<style lang="scss" scoped>
@import "./order-detail.scss";
</style>