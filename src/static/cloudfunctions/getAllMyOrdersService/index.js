// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let uid = event.uid

  let result = {
    orders:{},
    errMsg:{
      fromDao:{},
      fromService:{}
    }
  }

  await cloud.callFunction({
    name:"listOrdersByUid",
    data:{
      uid:uid
    }
  }).then(res =>{
    console.log("调用dao的结果", res)
    result.orders = res.result.orders
    result.errMsg.fromDao = res.result.errMsg.fromDao
  }).catch(err =>{
    result.errMsg.fromService = err
  })
  console.log("返回的Service层结果", result)
  return result
}