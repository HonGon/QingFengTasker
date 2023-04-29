// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  let latestLongitude = event.latestLongitude
  let latestLatitude = event.latestLatitude
  let idList = event.idList

  let result = {
    updatedCount: 0,
    errMsg: {
      fromDao: {}
    }
  }

  await db.collection('order').where({
    id: _.in(idList)
  }).update({
    data: {
      taker:{
        latestLongitude: latestLongitude,
        latestLatitude: latestLatitude
      }
    }
  }).then( res => {
    console.log('调用数据库的结果',res)
    result.updatedCount = res.stats.updated
  }).catch( err => {
    result.errMsg.fromDao = err
  })

  console.log('返回的dao的结果', result)
  return result
}