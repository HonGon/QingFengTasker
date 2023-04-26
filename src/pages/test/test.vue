<template>
    <view class="content" @click="onclickLOGO">
        <image src="../../static/logo.png"/>
    </view>

</template>

<script setup>
import { ref } from 'vue'

function onclickLOGO(){
    let latestLongitude = 113.36115 
    let latestLatitude =  23.195524

    wx.cloud.callFunction({
        name:"getNearbyOrdersController",
        data:{
            latestLongitude:  latestLongitude,
            latestLatitude: latestLatitude,
            cid:"0001"
        }
    }).then(res => {
         console.log("查询之后的结果",res.result)
    }).catch(err => {
         console.log(err)
    })
}

</script>

<style lang="scss" scoped>
@import "../../common/global.scss";

.content{
    align-items: center;
    > image{
        height: 200rpx;
        width: 200rpx;
    }
}
</style>