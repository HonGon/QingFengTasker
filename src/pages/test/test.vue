<template>
    <view class="content" @click="onClickPushLOGO">
        <image src="../../static/logo.png" />
    </view>

    <view class="content" @click="onClickPopLOGO">
        <image src="../../static/logo.png" />
    </view>

    <ImagePicker @imageChange="onImageChange" :isInteractable="true"></ImagePicker>
</template>

<script setup>
import { ref } from 'vue';
import { ImagePicker } from '../../components/ImagePicker.vue'
import { watch } from 'vue';
import { useTimerControlStore } from '../../store/modules/timerControlStore';

const timerControlStore = useTimerControlStore()

function onImageChange(e) {
    imageList.value = e.imageList
    console.log("图片", imageList.value)
}

function onClickLOGO() {
    // let order = {
    //     attachmentList: [],
    //     cancelTimestamp: "1682667898",
    //     content: "去内区饭堂二楼买一份炒面",
    //     endAddress: { latitude: 23.196895, longitude: 113.356947, name: "B区宿舍" },
    //     endAddressDetail: "",
    //     endTimestamp: "1682669856",
    //     finalReward: 2,
    //     id: "16826545497201869",
    //     note: "好饿，请快一点",
    //     postTimestamp: "1682654549",
    //     poster: { name: "韩某人", phoneNumber: "19102051696", uid: "20001682412497624" },
    //     relatedOb: { volume: 2, weight: 0.5 },
    //     reward: 1,
    //     startAddress: { latitude: 23.197092, longitude: 113.358029, name: "内区饭堂" },
    //     startAddressDetail: "",
    //     state: 1,
    //     taker: {},
    //     type: 5,
    //     _id: "dc31beb3644b45560002b0fe44f92f63"
    // }
    
    let latestLongitude = 6
    let latestLatitude = 6
    let idList = [
    "16824066693781199",
    "16824093168571553"
    ]


    wx.cloud.callFunction({
        name: "modifyTakerLocationController",
        data: {
            latestLongitude: latestLongitude,
            latestLatitude: latestLatitude,
            idList: idList 
        }
    }).then(res => {
        console.log("结果", res.result)
    }).catch(err => {
        console.log(err)
    })
}

function onClickPopLOGO() {
    timerControlStore.popSth()
    console.log("id数组减少", timerControlStore.orderIdList.length)
}

async function onClickPushLOGO() {
    //如果待上传地址订单编号数组是从空的变成有的，就新开启一个定时器
    if (timerControlStore.orderIdList.length == 0) {
        timerControlStore.setNewTimer(true)
    } else {
        //如果不是，则不开启
        timerControlStore.setNewTimer(false)
    }
    timerControlStore.pushSth("0")
    console.log("id数组增加", timerControlStore.orderIdList.length)

    // let loginUser = {
    //     uid: '20001689000000'
    // }


    // let latestLongitude = 113.36115 
    // let latestLatitude =  23.195524

    // let taker = {
    //     uid:"20001682412497624",
    //     name:"韩先生",
    //     phoneNumber: "18218856473",
    //     latestLongitude: 1,
    //     latestLatitude: 2
    // }
}
</script>

<style lang="scss" scoped>
@import "../../common/global.scss";

.content {
    align-items: center;

    >image {
        height: 200rpx;
        width: 200rpx;
    }
}
</style>