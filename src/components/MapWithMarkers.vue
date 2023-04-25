<template>
        <view class="map-component">
            <map :longitude="centerLocation.longitude" :latitude="centerLocation.latitude" :scale="scale" :markers="markers"
                @markertap="onTapMarker" @callouttap="onTapMarker" @regionchange="onMapChange">
            </map>
        </view>
</template>

<script setup>
import { ref, onMounted, onUpdated } from "vue"
import { onLoad, onShow } from "@dcloudio/uni-app";
import { onBeforeUpdate } from "vue";

//响应式状态
const scale = ref(16)               //地图缩放程度
const centerLocation = ref({        //地图中心点位置
    name: "",                            //名称
    longitude: 0,                        //经度
    latitude: 0                      //纬度
})
const markers = ref([])              //标记点集合

//Emits
const emit = defineEmits({
    chooseNewLocation: null
})
//Props
const props = defineProps({
    markers: {
        type: Array,
        required: true
    },
    centerLocation:{
        type:Object,
        required:true
    }
})


//方法
//监听地图视野改变事件
function onMapChange(e) {
    if (e.type === "end")
        console.log("地图改变了！", "中心经度：", e.detail.centerLocation.longitude, "中心纬度：", e.detail.centerLocation.latitude,)
}

//监听地图标记点点击事件
function onTapMarker(e) {
    // console.log("点击了标记点，标号为：",e.detail.markerId)
    //根据获取的标记点ID在markers中找到目标标记点
    let targetMarker = markers.value.filter((m) => m.id == e.detail.markerId)[0]

    //将目标标记点的数据传给父组件
    let { longitude, latitude } = targetMarker
    let name = targetMarker.callout.content
    console.log({ name, longitude, latitude });
    emit("chooseNewLocation", { name, longitude, latitude })
}

onBeforeUpdate(() => {
    //从全局变量获取地图中心位置信息
    let centerLocationTemp = uni.getStorageSync("centerLocation")
    // console.log("地图中心信息", centerLocationTemp)
    centerLocation.value = centerLocationTemp
    // console.log("当前地图中心信息", centerLocation.value)
})

onMounted(() => {
    //接受父组件传入的地图标记点
    markers.value = props.markers
})
</script>

<style lang="scss" scoped>
@import "../common/global.scss";
@import "../uni.scss";
.map-component {
    margin: $margin-block;
    background-color: $color-white;
    width: 700rpx;
    > map {
        height: 400rpx;
        width: 720rpx;
    }
}
</style>