<template>
    <scroll-view class="content" :scroll-y="true">
        <!-- 地图组件 -->
        <MapWithMarkers v-if="showMap" :markers="markers" @chooseNewLocation="showLoc"></MapWithMarkers>
        <!-- 订单项组件 -->
        <OrderListItemCard :order="order" :buttonTypeIndex="3"></OrderListItemCard>
        <!-- 发布者信息 -->
        <uni-card title="发布者信息">
            <uni-row>
                <uni-col :span="8">
                    <text class="text">
                        UID:</text>
                </uni-col>
                <uni-col :span="8" :push="8">
                    <text class="detail">{{ order.poster.uid }}</text>
                </uni-col>
            </uni-row>

            <uni-row>
                <uni-col :span="8">
                    <text class="text">称呼：</text>
                </uni-col>
                <uni-col :span="8" :push="8">
                    <text class="detail">{{ order.poster.name }}</text>
                </uni-col>
            </uni-row>

            <uni-row>
                <uni-col :span="8">
                    <text class="text">联系方式：</text>
                </uni-col>
                <uni-col :span="8" :push="8">
                    <text class="detail">{{ order.poster.phoneNumber }}</text>
                </uni-col>
            </uni-row>

            <uni-row>
                <uni-col :span="8">
                    <text class="text">详细起始地址：</text>
                </uni-col>
                <uni-col :span="8" :push="8">
                    <text class="detail">{{ order.startAddressDetail }}</text>
                </uni-col>
            </uni-row>

            <uni-row>
                <uni-col :span="8">
                    <text class="text">详细终点地址：</text>
                </uni-col>
                <uni-col :span="8" :push="8">
                    <text class="detail">{{ order.endAddressDetail }}</text>
                </uni-col>
            </uni-row>

        </uni-card>

        <!-- 承接人信息 -->
        <template v-if="showTakerInfo">
            <uni-card title="承接人信息">
                <uni-row>
                    <uni-col :span="8">
                        <text class="text">
                            UID:</text>
                    </uni-col>
                    <uni-col :span="8" :push="8">
                        <text class="detail">{{ order.taker.uid }}</text>
                    </uni-col>
                </uni-row>

                <uni-row>
                    <uni-col :span="8">
                        <text class="text">称呼：</text>
                    </uni-col>
                    <uni-col :span="8" :push="8">
                        <text class="detail">{{ order.taker.name }}</text>
                    </uni-col>
                </uni-row>

                <uni-row>
                    <uni-col :span="8">
                        <text class="text">联系方式：</text>
                    </uni-col>
                    <uni-col :span="8" :push="8">
                        <text class="detail">{{ order.taker.phoneNumber }}</text>
                    </uni-col>
                </uni-row>
            </uni-card>
        </template>
        

        <template v-if="showAttachment">
            <uni-card title="附件">
                <uni-row>
                    <uni-col v-for="attachment in  order.attachmentList" :key="attachment.id" :span="8">
                        <view class="attachment">
                            <image @click="onClickImage(attachment.src)" class="attachment-image" :src="attachment.src"
                                mode="aspectFit"></image>
                        </view>
                    </uni-col>
                </uni-row>
            </uni-card>
        </template>


        <uni-popup ref="popup">
            <view class="popup-image">
                <image :src="attachmentSrc" mode="heightFix"></image>
            </view>
        </uni-popup>

        <!-- 底部面板 -->
        <BottomPanel :buttonIndexArray="ButtonIndexArray" @clickBottomButton="onClickBottomButton"></BottomPanel>
    </scroll-view>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { onLoad } from "@dcloudio/uni-app";
import { MapWithMarkers } from "../../components/MapWithMarkers.vue"
import { OrderListItemCard } from "../../components/OrderListItemCard.vue"
import { BottomPanel } from "../../components/BottomPanel.vue"

//响应式状态
const scale = ref(16)               //地图缩放程度
const markers = ref([])              //标记点集合
const targetLocation = ref({
    name: "",
    longitude: 0,
    latitude: 0
})
const attachmentSrc = ref("")       //当前选中的附件
const popup = ref(null)             //模板引用，引用uniapp的遮罩层
// //附件列表
// const attachmentList = ref([])

//订单数据
const order = ref({})


//计算属性
const showAttachment = computed(() => {
    // 如果附件列表为空，则不显示附件
    return !(order.value.attachmentList.length == 0)
})

const showTakerInfo = computed( () => {
    return order.value.state === 1 ? false : true
})

const showMap = computed( () => {
    return order.value.state === 4 ? false : true
})
//底部面板按钮控制
const ButtonIndexArray = computed( () => {
    if (order.value.state === 1 ) {
        return [1,1,1,0]
    }else if (order.value.state === 3 ){
        return [0,0,1,1]
    }
    return [0,0,1,0]
})


//方法
//处理点击图片事件
function onClickImage(e) {
    console.log(e)
    attachmentSrc.value = e
    console.log(popup);
    popup.value.open('center')
}

function onClickBottomButton(e) {
    // console.log("来自底部面板组件！", e)
    if (e === 1) {              //点击了取消订单按钮
        console.log("取消订单！")
    } else if (e === 2) {       //点击了修改按钮
        console.log("修改订单！")
    } else if (e === 3) {       //点击了返回按钮
        //返回上一个页面
        console.log("返回！")
        uni.navigateBack()
    } else if (e === 4) {       //点击了支付按钮
        console.log("支付订单！")
    }
}

//选择位置
async function chooseLoc() {
    uni.chooseLocation({
        longitude: centerLocation.value.longitude,
        latitude: centerLocation.value.latitude,
        success: (res) => {
            console.log(res);
            centerLocation.value.longitude = res.longitude
            centerLocation.value.latitude = res.latitude
            console.log("选择后的经纬度", centerLocation.value.longitude, centerLocation.value.latitude);
        },
    });
}

//获取用户位置
async function getLoc() {
    uni.getLocation({
        type: "gcj02",
        success: (res) => {
            centerLocation.value.longitude = res.longitude
            centerLocation.value.latitude = res.latitude
            console.log("当前所处位置", "经度", res.longitude, "纬度", res.latitude);
        }
    })
}

function showLoc(e) {
    // console.log(e)
    targetLocation.value = e
}


onLoad(async () => {
    let centerLocation = {
        name: "广东工业大学龙洞校区食堂",
        longitude: 113.358029,
        latitude: 23.197092
    }
    //从全局变量中获取到地图中心信息
    uni.setStorageSync("centerLocation", centerLocation)


    //     let orderDetail = {
    //         id: "202304201681985555",
    //         type: 3,
    //         state: 2,
    //         postTimestamp: "1682132166",
    //         content: "去拿东北门拿外卖去拿东北门拿外卖去拿东北门拿外卖去拿东北门拿外卖",
    //         startAddress: "东北门",
    //         endAddress: "学生宿舍C栋601B",
    //         releatedOb: {
    //             weight: "0.5Kg",
    //             volume: "小"
    //         },
    //         note: "请尽快取件",
    //         endTime: "1682144352",
    //         reward: 10,
    //         poster: {
    //             uid: "1782996909",
    //             name: "韩先生",
    //             phoneNumber: "18212227876"
    //         },
    //         taker: {
    //             uid: "1792996920",
    //             name:"张先生",
    //             phoneNumber: "1910367898",
    //             latestPosition: ""
    //         },
    //         attachmentList: [
    //             "../../static/1.jpg",
    //             "../../static/logo.png",
    //             "../../static/logo.png"
    //         ],
    //         startAddressDetail:"东北门左边",
    //         endAddressDetail:"C1-601B室"

    // }   
    //     console.log(JSON.stringify(orderDetail))
    //     uni.setStorageSync("orderDetail",orderDetail)

    //从全局变量中获取订单对象
    order.value = uni.getStorageSync("orderDetail")
    //console.log(order.value)

    //加载预设地图组件上的标记点
    let result = await import("../../static/preset-locations.json")
    markers.value = result.default
    //chooseLoc()
    //getLoc()
    //console.log(markers.value)

    //检查附件信息
    let aid = 0
    if (order.value.attachmentList.length != 0) {
        for (let i = 0; i < order.value.attachmentList.length; i++) {
            order.value.attachmentList[i] = {
                id: aid++,
                src: order.value.attachmentList[i]
            }
        }
    }
    //console.log("附件信息", order.value.attachmentList);
})
</script>

<style lang="scss" scoped>
@import "./order-detail.scss";
</style>