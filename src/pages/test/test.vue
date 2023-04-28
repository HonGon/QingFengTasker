<template>
    <view class="content" @click="onclickLOGO">
        <image src="../../static/logo.png" />
    </view>

    <view class="content" @click="onclickPopLOGO">
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

function onclickLOGO(){
        wx.cloud.callFunction({
        name:"payOrderController",
        data:{
            _id: "627d947664478764000ebd0b09da90e7",
        }
    }).then(res => {
         console.log("更新之后的结果",res.result)
    }).catch(err => {
         console.log(err)
    })
}

function onclickPopLOGO(){
    timerControlStore.popSth()
    console.log("id数组减少", timerControlStore.orderIdList.length)
}

async function onclickPushLOGO() {
    //如果待上传地址订单编号数组是从空的变成有的，就新开启一个定时器
    if(timerControlStore.orderIdList.length == 0){
        timerControlStore.setNewTimer(true)
    }else{
        //如果不是，则不开启
        timerControlStore.setNewTimer(false)
    }
    timerControlStore.pushSth("0")
    console.log("id数组增加",timerControlStore.orderIdList.length)

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