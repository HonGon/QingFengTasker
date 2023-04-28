// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let _id = event._id

  let result = {
    msg: "",
    errMsg:{
      fromDao:{},
      fromService:{},
      fromController:{}
    }
  }

  //调用根据订单唯一 _ID更新订单状态dao层方法
  await cloud.callFunction({
    name: "updateOrderStateById",
    data:{
      _id: _id,
      state: 5
    }
  }).then(res => {
    console.log("调用service的结果",res)
    result.msg = res.result.msg
    result.errMsg.fromDao = result.errMsg.fromDao
    result.errMsg.fromService = result.errMsg.fromService
  }).catch(err => {
    result.errMsg.fromController = err
  })
  console.log("调返回的controller结果",result)
  return result
}