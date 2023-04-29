<template>
    <scroll-view class="content" :scroll-y="true" :enable-flex="true">
        <uni-section title="修改订单" type="square" titleFontSize="39rpx">
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

                <uni-list-item title="附件" rightText="可选" />
                <ImagePicker :imageList="imageList" @imageChange="onSelectedImageChange">
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
    <BottomPanel :buttonIndexArray="bottomButtonIndexArray" @clickBottomButton="onModify"></BottomPanel>

    <uni-popup ref="modifyDialog" type="dialog">
        <uni-popup-dialog :type="modifyDialogType" cancelText="返回" confirmText="确认" title="修改订单"
            :content="modifyDialogContent" @confirm="onModifyDialogConfirm"></uni-popup-dialog>
    </uni-popup>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { ImagePicker } from '../../components/ImagePicker.vue'
import { MapWithMarkers } from "../../components/MapWithMarkers.vue"
import { BottomPanel } from "../../components/BottomPanel.vue"
import { useLoginUserStore } from '../../store/modules/loginUserStore'

const loginUserStore = useLoginUserStore()

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
    taker: {

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

const imageList = ref([])

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

const markers = ref([])                                     //传入地图组件的标记点
const bottomButtonIndexArray = ref([0, 1, 1, 0, 0, 0])     //控制底部面板组件显示按钮的数组

const popup = ref(null)                                    //模板引用uni.popup
const modifyDialog = ref(null)
const modifyDialogType = ref("info")
const modifyDialogContent = ref("")

const showContentErrMsg = ref(false)
const contentErrMsg = ref("* 委托内容不能为空！*")
const showPosterNameErrMsg = ref(false)
const posterNameErrMsg = ref("* 联系人内容不能为空！*")
const showPosterPhoneNumberErrMsg = ref(false)
const posterPhoneNumberErrMsg = ref("* 联系电话不能为空！*")
const showStartAddressErrMsg = ref(false)
const showEndAddressErrMsg = ref(false)

//方法
//处理图片附件变化事件
function onSelectedImageChange(e) {
    imageList.value = e.imageList
    console.log("当前附件列表信息", order.value.attachmentList)
    console.log("当前图片列表信息", imageList.value)
    order.value.attachmentList = order.value.attachmentList.filter(a => {
        let arr = []
        let imageName = ''
        for (let i = 0; i < imageList.value.length; i++) {
            arr = imageList.value[i].path.split('/')
            imageName = arr[arr.length - 1]
            if (a.indexOf(imageName) != -1) {
                return true
            } else {
                return false
            }
        }
    })
    console.log('当前的附件列表', order.value.attachmentList)
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

//处理点击修改按钮事件
function onModify(e) {
    if (e === 2) {
        if ((!showContentErrMsg.value) && (!showPosterNameErrMsg.value) && (!showPosterPhoneNumberErrMsg.value)
            && (!showStartAddressErrMsg.value) && (!showEndAddressErrMsg.value)) {
            modifyDialogType.value = "success"
            modifyDialogContent.value = "将修改已填写的跑腿委托订单，是否修改？"
            modifyDialog.value.open()
        } else {
            modifyDialogType.value = "error"
            modifyDialogContent.value = "请检查已填写的跑腿委托订单内容！"
            modifyDialog.value.open()
        }
        console.log("点击了底部的发布按钮")

    }
    if (e === 3) {
        console.log("点击了底部的返回按钮")
        uni.navigateBack()
    }
}

//处理点击确认修改按钮事件
async function onModifyDialogConfirm() {
    uni.showLoading({
        title: "提交修改中"
    })
    if (modifyDialogType.value === "success") {
        //获取当前订单发布者的Uid
        let uid = order.value.poster.uid

        //处理用户上传的附件
        if (imageList.value.length != 0) {
            let fileName = ""
            //如果用户选了新的图片作为附件，那就把新的图片上传到云存储中
            //而imageList中混合了path为临时url和本地存储路径的图片，故需要将其本地存储的筛选出来，再上传
            let attachmentListTemp = imageList.value.filter(i => i.path.indexOf('tmp') != -1)
            let attachmentListTempNew = []
            console.log("还没有上传图片的", order.value)
            for (let i = 0; i < attachmentListTemp.length; i++) {
                fileName = (attachmentListTemp[i].path).split('/')[3]
                await new Promise(async (resolve, reject) => {
                    wx.cloud.uploadFile({
                        cloudPath: `user/${uid}/${fileName}`, // 上传至云端的路径
                        filePath: attachmentListTemp[i].path, // 小程序临时文件路径
                        success: res => {
                            // 返回文件 ID
                            console.log("返回文件ID", res.fileID)
                            resolve(res)
                        },
                        fail: err => {
                            reject(err)
                        }
                    })
                }).then((res) => {
                    attachmentListTempNew.push(res.fileID)
                }).catch(err => {
                    console.log(err)
                })
            }
            order.value.attachmentList.push(...attachmentListTempNew)
            console.log("刚刚上传完图片的", order.value)
        }

        //请求后端
        await wx.cloud.callFunction({
            name: "modifyOrderController",
            data: {
                order: order.value
            }
        }).then(res => {
            if (res.result.msg == "修改成功") {
                uni.hideLoading()
                console.log("请求后端结束后的", order.value)
                uni.showToast({
                    title: "修改订单成功！",
                    duration: 2000
                })
                setTimeout(() => {
                    //跳转至我的订单页面
                    uni.redirectTo({
                        url: "/pages/order-detail/order-detail"
                    })
                }, 2100)
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

//页面生命周期
onLoad(async () => {
    uni.showLoading()
    let poster = loginUserStore.user
    console.log("修改委托,当前登录的用户UID", poster.uid)

    //从缓存中获取待更新的委托订单数据
    order.value = uni.getStorageSync('modifyOrderDetail')
    console.log('当前需要修改的订单信息', order.value)
    //检查附件信息，如果有附件，需要通过云存储api获取附件的临时url
    if (order.value.attachmentList.length != 0) {
        console.log('订单附件长度不为零')
        new Promise((resolve, reject) => {
            let fileList = []
            wx.cloud.getTempFileURL({
                fileList: order.value.attachmentList,
                success: res => {
                    fileList = res.fileList
                    resolve({ fileList })
                    console.log('临时url表', res.fileList)
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
            console.log('图片列表', imageList.value)
        })
    }


    //获取原订单的截止时间信息
    let endTimestamp = new Date(parseInt(order.value.endTimestamp))
    //如果原订单限制了时间
    if (endTimestamp != 0) {
        let hh = endTimestamp.getHours()
        let mm = endTimestamp.getMinutes()
        //设置当前选择的截止时间
        selectedTime.value = hh + ":" + mm
        isLimitEndTime.value = true
        endTimeButtonText.value = "不限定时间"
    } else {
        //如果原订单没有限制时间
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

        isLimitEndTime.value = false
        endTimeButtonText.value = "限定时间"
    }

    let centerLocation = {
        name: "广东工业大学龙洞校区食堂",
        longitude: 113.358029,
        latitude: 23.197092
    }

    //导入的预设地址
    let result = await import("../../static/preset-locations.json")
    let presetLocations = result.default.presetLocations

    //默认第一个导入的地址为地图的中心
    centerLocation.value = presetLocations[0]

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
    uni.hideLoading()
})

</script>

<style lang="scss" scoped>
@import "./modify-order.scss";
</style>