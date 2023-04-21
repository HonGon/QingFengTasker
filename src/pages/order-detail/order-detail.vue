<template>
    <view class="content">
        <MapWithMarkers :markers="markers" @chooseNewLocation="showLoc"></MapWithMarkers>

        <uni-card class="position">
            <uni-row>
                <uni-col :span="8">
                    <view class="position-row-1">
                        {{ targetLocation }}
                    </view>
                </uni-col>
                <uni-col :span="8" :push="8">
                    <view class="position-row-1">
                        {{ targetLocation }}
                    </view>
                </uni-col>
            </uni-row>
            <uni-row>
                <uni-col :span="12">
                    <input class="position-row">
                </uni-col>
            </uni-row>
            <uni-row>
                <uni-col :span="24">
                    <input class="position-row-3">
                </uni-col>
            </uni-row>
        </uni-card>

    </view>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { onLoad } from "@dcloudio/uni-app";
import { MapWithMarkers } from "../../components/MapWithMarkers.vue"

//响应式状态
const scale = ref(16)               //地图缩放程度
const markers = ref([])              //标记点集合
const targetLocation = ref({
    name:"",
    longitude:0,
    latitude:0
})

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

function showLoc(e){
    // console.log(e)
    targetLocation.value = e
}


onLoad(async () => {
    let centerLocation = {
        name: "广东工业大学龙洞校区食堂",
        longitude: 113.358029,
        latitude: 23.197092
    }

    uni.setStorageSync("centerLocation", centerLocation)
    //加载地图组件上的标记点

    let result = await import("../../static/preset-locations.json")
    markers.value = result.default
    //chooseLoc()
    //getLoc()
    console.log(markers.value)
})
</script>

<style lang="scss" scoped>
@import "./order-detail.scss";
</style>