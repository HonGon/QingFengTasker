// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let uid = event.uid

  let result = {
    orders:{},
    errMsg:{
      fromDao:{}
    }
  }
  //根据订单的发布者uid和承接者uid是传入的uid这一条件查询数据库
  await db.collection("order").where(_.or([
    {
      poster:{
        uid:uid
      }
    },
    {
      taker:{
        uid:uid
      }
    }
  ])).get().then(res =>{
    console.log("查数据库的结果", res)
    //将查询结果保存到结果result中
    result.orders = res.data
  }).catch(err =>{
    result.errMsg.fromDao = err
  })
  console.log("调用dao层的结果", result)
  return result
}