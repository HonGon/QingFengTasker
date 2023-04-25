// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid = event.openid

  let result = {
    user: {},
    errMsg: {
      fromDao: {}
    }
  }

  //根据openid查询user集合
  await db.collection("user").where({
    openid: openid
  }).get().then((res) => {
    console.log("Dao调用的结果",res)
    if(res.data.length != 0){
      result.user = res.data[0]
    }else{
      result.user = {}
    }
  }).catch((err) => {
    result.errMsg.fromDao = err
  })

  return result
}