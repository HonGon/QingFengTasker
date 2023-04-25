<template>
    <view class="content" @click="onclickLOGO">
        <image src="../../static/logo.png"/>
    </view>

</template>

<script setup>
import { ref } from 'vue'

function onclickLOGO(){
    wx.cloud.callFunction({
        name:"getOrderDetailController",
        data:{
            id:"16824146178541955"
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