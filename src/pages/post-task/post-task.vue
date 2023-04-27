<template>
    <scroll-view class="content" :scroll-y="true" :enable-flex="true">
        <uni-section title="发布委托" type="square" titleFontSize="39rpx">
            <uni-list>
                <uni-list-item title="委托类型：" />
                <view class="task-type select">
                    <uni-data-select :clear="false" v-model="order.type" :localdata="orderTypeRange"
                        placeholder="请选择委托类型"></uni-data-select>
                </view>

                <uni-list-item title="委托内容：" />
                <view class="order-content">
                    <uni-easyinput :clearable="false" v-model="order.content" @focus="onContentFocus"
                        @change="onContentChange" type="textarea" auto-height class="order-content-textarea"
                        placeholder="请输入委托内容"></uni-easyinput>
                </view>
                <template v-if="showContentErrMsg">
                    <view class="order-content-error error">
                        <text>{{ contentErrMsg }}</text>
                    </view>
                </template>



                <uni-list-item title="起点地址：" />
                <view class="start-address address">
                    <input v-model="order.startAddress.name" placeholder="请选择起点地址" class="start-address-input address-input"
                        type="text" disabled>
                    <view @click="onClickAddressButton(1)" class="start-address-select-button button">选择</view>
                </view>
                <template v-if="showStartAddressErrMsg">
                    <view class="start-address-error error">
                        <text>*请选择地址*</text>
                    </view>
                </template>


                <uni-list-item title="终点地址：" />
                <view class="end-address address">
                    <input v-model="order.endAddress.name" placeholder="请选择终点地址" class="end-address-input address-input"
                        type="text" disabled>
                    <view @click="onClickAddressButton(2)" class="start-address-select-button button">选择</view>
                </view>
                <template v-if="showEndAddressErrMsg">
                    <view class="end-address-error error">
                        <text>*请选择地址*</text>
                    </view>
                </template>


                <uni-list-item title="联系人：">
                    <template v-slot:footer>
                        <uni-easyinput :clearable="false" v-model="order.poster.name" @focus="onPosterNameFocus"
                            @change="onPosterNameChange" class="poster-name-input input-text" type="text"
                            placeholder="请输入"></uni-easyinput>
                    </template>
                </uni-list-item>
                <template v-if="showPosterNameErrMsg">
                    <view class="poster-name-error error">
                        <text>{{ posterNameErrMsg }}</text>
                    </view>
                </template>


                <uni-list-item title="联系电话：">
                    <template v-slot:footer>
                        <uni-easyinput :clearable="false" v-model="order.poster.phoneNumber"
                            @focus="onPosterPhoneNumberFocus" @change="onPosterPhoneNumberChange"
                            class="poster-phone-number-input input-text" type="text" placeholder="请输入"></uni-easyinput>
                    </template>
                </uni-list-item>
                <template v-if="showPosterPhoneNumberErrMsg">
                    <view class="poster-phone-number-error error">
                        <text>{{ posterPhoneNumberErrMsg }}</text>
                    </view>
                </template>

                <uni-list-item title="委托报酬：">
                    <template v-slot:footer>
                        <view class="reward">
                            <uni-number-box v-model="order.reward" :value="order.reward" :min="1" :step="0.5"
                                background="#dd524d" color="#ffffff" />
                            <text class="reward-unit">元</text>
                        </view>
                    </template>
                </uni-list-item>
                <!-- <view class="task-note-error error">
                    <text >*请输入委托报酬*</text>
                </view> -->

                <uni-list-item title="" />

                <uni-list-item title="物品信息：" />
                <view class="related-object-info">
                    <view class="related-object-info-weight">
                        <text>重量:</text>
                        <uni-number-box v-model="order.relatedOb.weight" :value="order.relatedOb.weight" :step="0.5" />
                        <text>Kg</text>
                    </view>

                    <view class="related-object-info-volume">
                        <text>体积:</text>
                        <uni-data-select :clear="false" v-model="order.relatedOb.volume"
                            :localdata="volumeTypeRange"></uni-data-select>
                    </view>
                </view>

                <uni-list-item title="截止时间：">
                    <template v-slot:footer>
                        <view class="end-time">
                            <template v-if="isLimitEndTime">
                                <picker mode="time" :value="selectedTime" @change="onEndTimeChange">
                                    <view class="end-time-text">{{ selectedTime }}</view>
                                </picker>
                            </template>
                            <view class="end-time-button button" @click="onEndTimeButtonClick(isLimitEndTime)">{{
                                endTimeButtonText }}</view>
                        </view>
                    </template>
                </uni-list-item>

                <uni-list-item title="详细起点地址：">
                    <template v-slot:footer>
                        <uni-easyinput :clearable="false" v-model="order.startAddressDetail"
                            class="task-note-input input-text" type="text" placeholder="请输入（可选）"></uni-easyinput>
                    </template>
                </uni-list-item>

                <uni-list-item title="详细终点地址：">
                    <template v-slot:footer>
                        <uni-easyinput :clearable="false" v-model="order.endAddressDetail"
                            class="task-note-input input-text" type="text" placeholder="请输入（可选）"></uni-easyinput>
                    </template>
                </uni-list-item>

                <uni-list-item title="备注：">
                    <template v-slot:footer>
                        <uni-easyinput :clearable="false" v-model="order.note" class="task-note-input input-text"
                            type="text" placeholder="请输入（可选）"></uni-easyinput>
                    </template>
                </uni-list-item>
                <!-- <view class="task-note-error error">
                    <text >*请输入正确内容*</text>
                </view> -->
                <uni-list-item title="附件" rightText="可选" />
                <ImagePicker @imageChange="OnSelectedImageChange">
                </ImagePicker>
            </uni-list>
        </uni-section>

        <uni-popup ref="popup" type="bottom" :mask-click="false">
            <view class="map-popup">
                <MapWithMarkers :centerLocation="centerLocation" :markers="markers" @chooseNewLocation="onChooseAddress">
                </MapWithMarkers>
            </view>
        </uni-popup>

    </scroll-view>
    <BottomPanel :buttonIndexArray="bottomButtonIndexArray" @clickBottomButton="onPost"></BottomPanel>

    <uni-popup ref="postDialog" type="dialog">
        <uni-popup-dialog :type="postDialogType" cancelText="返回" confirmText="确认" title="发布结果" :content="postDiaglogContent"
            @confirm="onPostDialogConfirm"></uni-popup-dialog>
    </uni-popup>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { ImagePicker } from '../../components/ImagePicker.vue'
import { MapWithMarkers } from "../../components/MapWithMarkers.vue"
import { BottomPanel } from "../../components/BottomPanel.vue"

const order = ref({
    type: 1,
    state: 1,
    content: "",
    postTimestamp: "",
    startAddress: {
        name: "",
        longitude: 0,
        latitude: 0
    },
    endAddress: {
        name: "",
        longitude: 0,
        latitude: 0
    },
    poster: {
        uid: "",
        name: "",
        phoneNumber: ""
    },
    reward: 1,
    finalReward: 1,
    relatedOb: {
        weight: 0,
        volume: 1
    },
    endTimestamp: "0",
    startAddressDetail: "",
    endAddressDetail: "",
    note: "",
    attachmentList: []
})

//地图组件中心点
const centerLocation = ref({
    name: "",
    longitude: 0,
    latitude: 0
})

//委托内容下拉框数据
const orderTypeRange = ref([
    { value: 1, text: "帮取快递" },
    { value: 2, text: "帮寄快递" },
    { value: 3, text: "帮取外卖" },
    { value: 4, text: "帮送文件" },
    { value: 5, text: "其他委托" },
])

//物品体积下拉框数据
const volumeTypeRange = ref([
    { value: 1, text: "小" },
    { value: 2, text: "中" },
    { value: 3, text: "大" },
    { value: 4, text: "超大" },
])

const selectedTime = ref("12:00")               //时间选择器选中的时间    
const isLimitEndTime = ref(false)               //是否限定了截止时间
const endTimeButtonText = ref("限定时间")        //截止时间按钮显示的文本，限定还是不限定
const isChooseStartAddress = ref(true)

const markers = ref([])                             //传入地图组件的标记点
const bottomButtonIndexArray = ref([0, 0, 1, 0, 1])     //控制底部面板组件显示按钮的数组

const popup = ref(null)                             //模板引用uni.popup
const postDialog = ref(null)
const postDialogType = ref("info")
const postDiaglogContent = ref("")

const showContentErrMsg = ref(true)
const contentErrMsg = ref("* 委托内容不能为空！*")
const showPosterNameErrMsg = ref(true)
const posterNameErrMsg = ref("* 联系人内容不能为空！*")
const showPosterPhoneNumberErrMsg = ref(true)
const posterPhoneNumberErrMsg = ref("* 联系电话不能为空！*")
const showStartAddressErrMsg = ref(true)
const showEndAddressErrMsg = ref(true)

//方法
//处理图片附件变化事件
function OnSelectedImageChange(e) {
    console.log("来自图片选择器组件的事件", e.imageList)
    order.value.attachmentList = e.imageList
    console.log("当前附件列表信息", order.value.attachmentList)
}


//处理点击选择起始地址按钮事件
function onClickAddressButton(e) {
    console.log(e)
    if (e === 1) {
        isChooseStartAddress.value = true
    } else {
        isChooseStartAddress.value = false
    }
    popup.value.open("center")      //弹出地图组件
}

//处理在地图上选择地址事件
function onChooseAddress(e) {
    if (isChooseStartAddress.value) {
        order.value.startAddress = e
        showStartAddressErrMsg.value = false
    } else {
        order.value.endAddress = e
        showEndAddressErrMsg.value = false
    }
    popup.value.close()             //关闭地图组件
}

//设置委托截止时间
function setEndTimestamp(time) {
    let hhmm = time.split(":")        //将选中的时间与当前日期进行结合，最后转为时间戳
    let currentTime = new Date()

    let hh = currentTime.getHours()
    let mm = currentTime.getMinutes()

    //处理当前为23点50分及其以后的边界情况
    if ((hh == 23 && mm >= 50) && hhmm[0] == "00") {
        currentTime.setDate(currentTime.getDate() + 1)
    }
    currentTime.setHours(hhmm[0])
    currentTime.setMinutes(hhmm[1])
    currentTime.setSeconds(0)
    order.value.endTimestamp = (parseInt(currentTime.getTime() / 1000)).toString()
    console.log(order.value.endTimestamp)
}

//处理截止时间按钮的点击事件
function onEndTimeButtonClick(e) {
    // console.log("当前是否显示选择时间按钮",e);
    isLimitEndTime.value = !e
    endTimeButtonText.value = isLimitEndTime.value ? "不限定时间" : "限定时间"
    if (!isLimitEndTime.value) {
        order.value.endTimestamp = "0"
    } else {
        setEndTimestamp(selectedTime.value)
    }
}

//处理截止时间选择事件
function onEndTimeChange(e) {
    // console.log(e);
    selectedTime.value = e.detail.value         //选中的时间动态显示在页面
    setEndTimestamp(selectedTime.value)         //设置截止时间
}

//处理点击发布按钮事件
function onPost(e) {
    if (e === 5) {
        if ((!showContentErrMsg.value) && (!showPosterNameErrMsg.value) && (!showPosterPhoneNumberErrMsg.value)
            && (!showStartAddressErrMsg.value) && (!showEndAddressErrMsg.value)) {
            postDialogType.value = "success"
            postDiaglogContent.value = "将发布已填写的跑腿委托订单，是否发布？"
            postDialog.value.open()
        } else {
            postDialogType.value = "error"
            postDiaglogContent.value = "请检查已填写的跑腿委托订单内容！"
            postDialog.value.open()
        }
        console.log("点击了底部的发布按钮")

    }
    if (e === 3) {
        console.log("点击了底部的返回按钮")
        uni.navigateBack()
    }
}

//处理点击确认发布按钮事件
async function onPostDialogConfirm() {
    uni.showLoading({
        title: "发布委托中"
    })
    if (postDialogType.value === "success") {
        let loginUser = {
            uid: "20001682412497624",
            name: "韩某人",
            phoneNumber: "18218856473"
        }
        uni.setStorageSync("loginUser", loginUser)

        //获取当前登录用户的Uid
        let poster = uni.getStorageSync("loginUser")
        order.value.poster.uid = poster.uid
        console.log(order.value)


        //处理用户上传的附件
        if (order.value.attachmentList.length != 0) {
            let fileName = ""
            let attachmentListTemp = order.value.attachmentList
            let attachmentListTempNew = []
            new Promise(async (resolve, reject) => {
                console.log("还没有上传图片的", order.value)
                for (let i = 0; i < attachmentListTemp.length; i++) {
                    fileName = (attachmentListTemp[i].path).split('/')[3]
                    new Promise(async (resolve, reject) => {
                        wx.cloud.uploadFile({
                            cloudPath: `order/${loginUser.uid}/${fileName}`, // 上传至云端的路径
                            filePath: attachmentListTemp[i].path, // 小程序临时文件路径
                            success: res => {
                                // 返回文件 ID
                                console.log("返回文件ID", res.fileID)
                                resolve(res)
                            }
                        })
                    }).then((res) => {
                        attachmentListTempNew.push(res.fileID)
                    })
                }
                resolve({ attachmentListTempNew })
            }).then(async ({ attachmentListTempNew }) => {
                order.value.attachmentList = attachmentListTempNew
                console.log("刚刚上传完图片的", order.value)

                setTimeout(async () => {
                    await wx.cloud.callFunction({
                        name: "postTaskController",
                        data: {
                            order: order.value
                        }
                    }).then(res => {
                        if (res.result.msg == "插入成功") {
                            uni.hideLoading()
                            console.log("请求后端结束后的", order.value)
                            setTimeout(() => {
                                //跳转至我的订单页面
                                uni.switchTab({
                                    url: "/pages/my-orders/my-orders"
                                })
                            }, 2100)
                            uni.showToast({
                                title: "发布委托成功！",
                                duration: 2000
                            })

                        } else {
                            uni.showToast({
                                title: "出错了，请稍后再试",
                                duration: 2000
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                        uni.showToast({
                            title: "出错了，请稍后再试",
                            duration: 2000
                        })
                    })
                }, 2500)
            })
        }

        //请求后端
        await wx.cloud.callFunction({
            name: "postTaskController",
            data: {
                order: order.value
            }
        }).then(res => {
            if (res.result.msg == "插入成功") {
                uni.hideLoading()
                console.log("请求后端结束后的", order.value)
                setTimeout(() => {
                    //跳转至我的订单页面
                    uni.switchTab({
                        url: "/pages/my-orders/my-orders"
                    })
                }, 2100)
                uni.showToast({
                    title: "发布委托成功！",
                    duration: 2000
                })

            } else {
                uni.showToast({
                    title: "出错了，请稍后再试",
                    duration: 2000
                })
            }
        }).catch(err => {
            console.log(err)
            uni.showToast({
                title: "出错了，请稍后再试",
                duration: 2000
            })
        })


    } else {
        console.log("请检查内容！")
    }
}

//处理内容输入框失去焦点事件
function onContentChange() {
    let c = order.value.content
    if (c === "") {
        contentErrMsg.value = "* 委托内容不能为空！*"
        showContentErrMsg.value = true
    }
}
//处理内容输入框聚焦事件
function onContentFocus() {
    showContentErrMsg.value = false
}

//处理联系人输入框失去焦点事件
function onPosterNameChange() {
    let n = order.value.poster.name
    if (n === "") {
        posterNameErrMsg.value = "* 联系人名称不能为空！*"
        showPosterNameErrMsg.value = true
    }
}
//处理联系人输入框聚焦事件
function onPosterNameFocus() {
    showPosterNameErrMsg.value = false
}

//处理联系人电话输入框失去焦点事件
function onPosterPhoneNumberChange() {
    let pn = order.value.poster.phoneNumber
    if (pn === "") {
        posterPhoneNumberErrMsg.value = "* 联系电话不能为空！*"
        showPosterPhoneNumberErrMsg.value = true
        return
    }
    let pattern = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    // console.log("手机号码校验结果",pattern.test(pn))
    if (!pattern.test(order.value.poster.phoneNumber)) {
        showPosterPhoneNumberErrMsg.value = true
        posterPhoneNumberErrMsg.value = "* 请输入正确的联系电话！*"
        return
    }
}
//处理联系人电话输入框聚焦事件
function onPosterPhoneNumberFocus() {
    showPosterPhoneNumberErrMsg.value = false
}

onLoad(async (option) => {
    //获取委托订单类型
    // console.log(option.orderType)
    order.value.type = parseInt(option.orderType)

    //获取当前时间
    let currentTime = new Date()
    let hh = currentTime.getHours()
    let mm = (currentTime.getMinutes() + 10)        //截止时间默认当前时间往后推迟10分钟
    if (mm >= 60) {
        hh = hh + 1
        mm = mm - 60
    }
    if (hh >= 24) {
        hh = 0
    }

    hh = hh < 10 ? "0" + hh.toString() : hh.toString()
    mm = mm < 10 ? "0" + mm.toString() : mm.toString()

    //设置当前选择的截止时间
    selectedTime.value = hh + ":" + mm

    let centerLocation = {
        name: "广东工业大学龙洞校区食堂",
        longitude: 113.358029,
        latitude: 23.197092
    }
    //从全局变量中获取到地图中心信息
    uni.setStorageSync("centerLocation", centerLocation)
    centerLocation.value = uni.getStorageSync("centerLocation")


    let result = await import("../../static/preset-locations.json")
    let presetLocations = result.default.presetLocations

    //制作地图标记点
    let locations = presetLocations
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
    markers.value = locationMarkers
})

</script>

<style lang="scss" scoped>
@import "./post-task.scss";
</style>