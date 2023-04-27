// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let _id = event._id
  let taker = event.taker

  let result = {
    msg:"",
    errMsg:{
      fromDao:{}
    }
  }

  await db.collection("order").doc(_id).update({
    data:{
      taker: _.set(taker)
    }
  }).then(res => {
    console.log("调用数据库的结果",res)
    if (res.stats.updated == 1) {
      result.msg = "更新成功"
    }else{
      result.msg = "更新失败"
    }
  }).catch(err => {
    result.errMsg.fromDao = err
  })

  console.log("返回的dao的结果",result);
  return result
}