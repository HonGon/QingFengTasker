// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let id = event.id
  let result = {
    order: {},
    errMsg: {
      fromDao: {}
    }
  }

  await db.collection("order").where({
    id: id
  }).get().then(res => {
    console.log("调用数据库的结果",res)
    if(res.data.length != 0){
          result.order = res.data[0]
    }else{
      result.order = {}
    }
  }).catch(err => {
    result.errMsg.fromDao = err
  })
  return result
}
