// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let order = event.order
  
  let result = {
    msg:""
  }

  console.log("待插入的订单是",order)
   
  await db.collection("order").add({
    data:order
  }).then(res => {
    // console.log("插入记录成功",res)
    result.msg = "插入成功"
  }).catch(err => {
    // console.log("插入记录失败",err)
    result.msg = "插入失败"
  })

  return result
}