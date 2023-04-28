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
      fromService:{}
    }
  }

  await cloud.callFunction({
    name: "updateOrderStateById",
    data:{
      _id: _id,
      state: 5
    }
  }).then(res => {
    console.log("调用数据库的结果",res)
    result.msg = res.result.msg
    result.errMsg.fromDao = res.result.errMsg.fromDao
  }).catch(err => {
    result.errMsg.fromService = err
  })
  console.log("调返回的dao结果",result)
  return result
}