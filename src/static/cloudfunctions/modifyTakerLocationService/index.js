// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let latestLongitude = event.latestLongitude
  let latestLatitude = event.latestLatitude
  let idList = event.idList

  let result = {
    updatedCount: 0,
    errMsg: {
      fromDao: {},
      fromService:{}
    }
  }

  await cloud.callFunction({
    name: 'updateTakerLocationInOrderIds',
    data:{
      latestLongitude: latestLongitude,
      latestLatitude: latestLatitude,
      idList: idList
    }
  }).then( res => {
    console.log('调用数据库的结果',res)
    result.updatedCount = res.result.updatedCount
    result.errMsg.fromDao = res.result.errMsg.fromDao
  }).catch( err => {
    result.errMsg.fromService = err
  })
  console.log('返回的service结果',result)
  return result
}