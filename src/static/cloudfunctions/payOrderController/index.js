// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let _id = event._id

  let result = {
    msg: "",
    errMsg: {
      fromDao: {},
      fromSercice: {},
      fromController: {
      }
    }
  }

  await cloud.callFunction({
    name: 'payOrderService',
    data: {
      _id: _id,
    }
  }).then(res => {
    console.log('调用service的结果', res)
    result.msg = res.result.msg
    result.errMsg.fromDao = res.result.errMsg.fromDao
    result.errMsg.fromSercice = res.result.errMsg.fromSercice
  }).catch(err => {
    result.errMsg.fromController = err
  })

  console.log('返回的controller结果', result)
  return result
}