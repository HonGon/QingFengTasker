<template>
    <view class="content" @click="onclickLOGO">
        <image src="../../static/logo.png" />
    </view>

    <ImagePicker @imageChange="onImageChange" :isInteractable="true" ></ImagePicker>


</template>

<script setup>
import { ref } from 'vue';
import { ImagePicker } from '../../components/ImagePicker.vue'

let imageList = ref([
    // { id: 0, path: "http://tmp/DMIf27W924xZd6f3cb7868a0f0480626bb468c9a9c56.jpg" },
    // { id: 1, path: "http://tmp/VdhLygBHHcmn4a03f23e6094bd7350c1e67e254e04aa.jpg" },
    // { id: 2, path: "http://tmp/n3q5tN7jtuku393f0817b812784708e46ada5625fb16.jpg" }
])

function onImageChange(e){
    imageList.value = e.imageList
    console.log("图片",imageList.value)
}

function onclickLOGO() {
    let loginUser = {
        uid: '20001689000000'
    }

    if (imageList.value.length != 0) {
        new Promise(async (resolve, reject) => {
            let fileName = ""
            let attachmentListTemp = imageList.value
            let attachmentListNew = []
            console.log("现在的附件列表是1111",attachmentListTemp)
            for (let i = 0; i < attachmentListTemp.length; i++) {
                fileName = (attachmentListTemp[i].path).split('/')[3]
                console.log("上传的文件名是", fileName)
                // new Promise(async (resolve, reject) => {
                    // setTimeout(()=> {
                    //     attachmentListNew.push("你好啊" + i)
                    //     console.log("你好啊" + i)
                    //     resolve()
                    // },1000)
                    wx.cloud.uploadFile({
                        cloudPath: `order/${loginUser.uid}/${fileName}`, // 上传至云端的路径
                        filePath: attachmentListTemp[i].path, // 小程序临时文件路径
                        success: res => {
                            // 返回文件 ID
                            console.log(res.fileID)
                            attachmentListNew.push(res.fileID)
                            console.log("现在的附件列表是2222",attachmentListTemp)
                            resolve()
                        }
                    })
                // })
            }
            resolve({ attachmentListNew })
        }).then(({ attachmentListNew }) => {
            imageList.value = attachmentListNew
            console.log("promise之后的列表1111", imageList.value)
        })
    }



    // let latestLongitude = 113.36115 
    // let latestLatitude =  23.195524

    // let taker = {
    //     uid:"20001682412497624",
    //     name:"韩先生",
    //     phoneNumber: "18218856473",
    //     latestLongitude: 1,
    //     latestLatitude: 2
    // }

    // wx.cloud.callFunction({
    //     name:"updateOrderStateById",
    //     data:{
    //         _id: "8f5310216447809e0003719131da3c0f",
    //         state: 2
    //     }
    // }).then(res => {
    //      console.log("更新之后的结果",res.result)
    // }).catch(err => {
    //      console.log(err)
    // })

    // wx.cloud.uploadFile({
    // cloudPath: 'order/8f5310216447809e0003719131da3c0f/EMvvQotclpTM4a03f23e6094bd7350c1e67e254e04aa.jpg', // 上传至云端的路径
    // filePath: 'http://tmp/EMvvQotclpTM4a03f23e6094bd7350c1e67e254e04aa.jpg', // 小程序临时文件路径
    // success: res => {
    //     // 返回文件 ID
    //     console.log(res.fileID)
    // },
    // fail: console.error
    // })
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