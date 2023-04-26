// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let posterUid = event.posterUid
  let state = event.state

  let result = {
    orders:[],
    errMsg:{
      fromDao:{}
    }
  }
  
  await db.collection("order").where(_.and([
    {
      poster:{
        uid: _.neq(posterUid)
      }
    },
    {
      state: state
    }
  ])).get().then( res => {
    console.log("调用数据库的结果",res)
    result.orders = res.data
  }).catch( err => {
    result.errMsg.fromDao = err
  })
  console.log("返回的dao的结果",result)
  return result
}