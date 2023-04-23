<script>
export default {
  onLaunch: function () {
    // wx.cloud.init({
    //   env: 'qingfeng-cloud-9gx22hwbf0c875de'
    // })
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
@import "./common/global";
/*每个页面公共css */

.content{
  height: 100%;
  width: 100vw;
  background-color: $color-light-gray;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

</style>
