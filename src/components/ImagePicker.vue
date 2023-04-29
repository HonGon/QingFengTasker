<template>
    <view class="image-picker">
        <template v-for="image in imageList" :key="image.id">
            <view class="image-picker-item item">
                <template v-if="isInteractable">
                    <image class="image-picker-item-delete-icon" src="../../static/image/delete.png"
                        @click="deleteImage(image.id)" />
                </template>
                <image @click="checkImage(image.id)" class="image-picker-item-image" :src="image.path" mode="aspectFill" />
            </view>
        </template>

        <template v-if="isInteractable">
            <template v-if="showAddButton">
                <view class="image-picker-addButton" @click="addimage">
                    <image src="../../static/image/add.png" />
                </view>
            </template>
        </template>
    </view>
</template>

<script setup>
import { onMounted } from 'vue'
import { computed, watch } from 'vue'
import { ref } from 'vue'

const imageList = ref([])           //图片列表
const imageId = ref(0)              //图片的ID
const imageCount = ref(0)           //当前选择图片的计数
const showAddButton = ref(true)     //是否显示添加图片的图标

//Props
const props = defineProps({
    isInteractable: {
        type: Boolean,
        default: true
    },
    imageList: {
        type: Array,
        default: []
    }
})

//Emits
const emit = defineEmits({
    imageChange: null
})

watch(imageCount, () => {
    if (imageCount.value == 3) {
        showAddButton.value = false
    } else {
        showAddButton.value = true
    }
})

//增加新的图片
function addimage() {
    console.log("增加",)
    uni.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: function (res) {
            // console.log("选中的图片信息", res.tempFilePaths);
            imageList.value.push({
                id: Math.floor((new Date().getTime())).toString(),
                path: res.tempFilePaths[0]
            })
            imageCount.value = imageCount.value + 1
            emit("imageChange", { imageList: imageList.value })
            // console.log("当前图片列表", imageList.value);
        }
    })
}

//删除选中的图片
function deleteImage(e) {
    imageList.value = imageList.value.filter((i) => {
        return i.id != e
    })
    imageCount.value = imageCount.value - 1
    emit("imageChange", { imageList: imageList.value })
    // console.log("删除之后的图片列表", imageList.value)
}

//预览选中的图片
function checkImage(e) {
    let { id, path } = imageList.value.filter(i => i.id == e)[0]
    console.log(path)
    uni.previewImage({
        current: id,
        urls: [path]
    })
}

onMounted(() => {
    imageList.value = props.imageList
    imageCount.value = props.imageList.length
    console.log('当前图片选择器选择的图片个数',imageCount.value)
})

</script>

<style lang="scss" scoped>
.image-picker {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 30rpx;
    padding: 15rpx 30rpx;
    border-radius: 15rpx;
    box-shadow: 1rpx 1rpx 10rpx #b7b7b7;
    background-color: #ffffff;
    width: 630rpx;

    // background-color: #b7b7b7;
    &-item {
        &-delete-icon {
            position: absolute;
            margin-left: 100rpx;
            width: 50rpx;
            height: 50rpx;
        }

        &-image {
            width: 150rpx;
            height: 150rpx;
        }
    }

    &-addButton {
        >image {
            padding: 20rpx;
            width: 130rpx;
            height: 130rpx;
        }
    }
}
</style>