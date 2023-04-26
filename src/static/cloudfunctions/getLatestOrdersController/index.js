// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let posterUid = event.posterUid
  let result = {
    orders:[],
    errMsg:{
      fromDao:{},
      fromService:{},
      fromController:{}
    }
  }

  await cloud.callFunction({
    name:"getLatestOrdersService",
    data:{
      posterUid: posterUid,
    }
  }).then( res =>{
    console.log("调用service的结果",res)
    result.orders = res.result.orders
    result.errMsg.fromDao = res.result.errMsg.fromDao
    result.errMsg.fromService = res.result.errMsg.fromService
  }).catch( err =>{
    result.errMsg.fromController = err
  })
  console.log("返回的controller的结果",result)
  return result
}