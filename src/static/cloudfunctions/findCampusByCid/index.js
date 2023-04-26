// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let cid = event.cid
  let result = {
    campus: {},
    errMsg: {
      fromDao:{}
    }
  }

  await db.collection("campus").where({
    cid: cid
  }).get().then( res => {
    console.log("调用数据库的结果", res)
    if(res.data.legth != 0){
      result.campus = res.data[0]
    }else{
      result.campus = {}
    }
  }).catch( err => {
    result.errMsg.fromDao = err
  })
  console.log("返回的dao的结果", result)
  return result
}