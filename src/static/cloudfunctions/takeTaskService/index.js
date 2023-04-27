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
      fromService:[]
    }
  }

  //更新订单状态
  await cloud.callFunction({
    name:"updateOrderStateById",
    data:{
      _id: _id,
      state: 2
    }
  }).then(res => {
    result.msg.push(res.result.msg)
    result.errMsg.fromDao.push(res.result.errMsg.fromDao)
  }).catch(err => {
    result.errMsg.fromService.push(err)
  })

  //更新订单承接者信息
  await cloud.callFunction({
    name:"updateOrderTakerById",
    data:{
      _id: _id,
      taker: taker
    }
  }).then(res => {
    result.msg.push(res.result.msg)
    result.errMsg.fromDao.push(res.result.errMsg.fromDao)
  }).catch(err => {
    result.errMsg.fromService.push(err)
  })
  console.log('返回的service结果',result);
  return result
}