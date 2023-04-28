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
      }
    }, 1000)
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
