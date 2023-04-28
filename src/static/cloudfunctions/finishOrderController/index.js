// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let id = event.id

  let result = {
    msg: {},
    errMsg: {
      fromDao: [],
      fromService: [],
      fromController: {}
    }
  }

  let msg = []

  await cloud.callFunction({
    name:"finishOrderService",
    data:{
      id: id 
    }
  }).then(res => {
    console.log("调用service的结果", res)
    msg = res.result.msg
    result.errMsg.fromDao = res.result.errMsg.fromDao
    result.errMsg.fromService = res.result.errMsg.fromS
  }).catch(err => {
    result.errMsg.fromService.push(err)
  })

  if(msg.length == 1){
    if(msg[0] == "更新成功"){
      result.msg = "提交成功"
    }else{
      result.msg = "提交失败"
    }
  }else if(msg.length == 2) {
    if(msg[0] == "更新成功" && msg[1] == "更新成功"){
      result.msg = "提交成功"
    }else{
      result.msg = "提交失败"
    }
  }else{
    result.msg = "提交失败"
  }

  console.log("返回的controller的结果", result)
  return result
}