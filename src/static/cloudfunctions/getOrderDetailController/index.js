// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let id = event.id
  let result = {
    order: {},
    errMsg: {
      fromDao: {},
      fromService: {},
      fromController: {},
    }
  }

  await cloud.callFunction({
    name:"getOrderDetailService",
    data:{
      id: id
    }
  }).then(res => {
    console.log("调用service层结果",res)
    if(Object.keys(res.result.order).length != 0){
         result.order = res.result.order
    }else{
      result.errMsg.fromDao = res.result.errMsg.fromDao
      result.errMsg.fromService = res.result.errMsg.fromService
    }
  }).catch(err => {
    result.errMsg.fromController = err
  })
  console.log("返回controller层结果",result)
  return result 
}