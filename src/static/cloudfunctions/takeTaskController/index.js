// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let _id = event._id
  let taker = event.taker

  let result = {
    msg:[],
    errMsg:{
      fromDao:[],
      fromService:[],
      fromController:{}
    }
  }

  await cloud.callFunction({
    name:"takeTaskService",
    data:{
      _id: _id,
      taker: taker
    }
  }).then(res => {
    result.msg = res.result.msg
    result.errMsg.fromDao = res.result.errMsg.fromDao
    result.errMsg.fromService = res.result.errMsg.fromService
  }).catch(err => {
    result.errMsg.fromService = err
  })

  console.log('返回的controller层结果',result);
  return result
}