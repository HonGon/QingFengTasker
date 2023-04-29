<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { useTimerControlStore } from './store/modules/timerControlStore'
import { watch } from 'vue'

const timerControlStore = useTimerControlStore()

onLaunch(() => {
  //初始化云环境
  wx.cloud.init({
    env: 'qingfeng-cloud-9gx22hwbf0c875de'
  })
  console.log('App Launch')
})

//全局监听用户是否有新接下委托订单，如果有，则获取用户位置信息上传
watch(timerControlStore.orderIdList, () => {
  if (timerControlStore.newTimer) {
    let timer = setInterval(() => {
      //循环出口
      //如果待上传地址的订单编号数组为空
      if (timerControlStore.orderIdList.length == 0) {
        clearInterval(timer)
        //不开启新的定时器
        timerControlStore.setNewTimer(false)
      } else {

        //定时向后台上传位置信息
        console.log("正在后台上传用户位置！")
        new Promise((resolve, reject) => {
          let latestLongitude = 0
          let latestLatitude = 0
          
          //获取用户当前位置信息
          uni.getLocation({
            type: 'gcj02',
            success: (res) => {
              latestLongitude = res.longitude
              latestLatitude = res.latitude
              resolve({ latestLongitude, latestLatitude })
            },
            fail: (err) => {
              reject(err)
            }
          })
        }).then(({ latestLongitude, latestLatitude }) => {
          console.log(`正在定位当前的经度是${latestLongitude}，纬度是${latestLatitude}`)

          //上传用户当前位置信息到后台
          wx.cloud.callFunction({
            name:'modifyTakerLocationController',
            data: {
              latestLongitude: latestLongitude,
              latestLatitude: latestLatitude,
              idList: timerControlStore.orderIdList
            }
          }).then(res => {
            console.log('上传位置信息成功', res)
          }).catch( err => {
            console.log('上传位置信息成功',err)
          })

        }).catch(err => {
          console.log(err)
        })
      }
    }, 60000)   //每分钟上传一次位置信息
  } else {
  }
})
</script>

<style lang="scss">
@import "./common/global";
/*每个页面公共css */

.content {
  height: 100%;
  width: 100vw;
  background-color: $color-light-gray;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
