// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let startAddress = event.startAddress
  let state = event.state

  let result = {
    orders:[],
    errMsg:{
      fromDao:{}
    }
  }
  console.log('传入的起点地址是', startAddress)

  await db.collection("order").where(_.and([
    { 
      startAddress: {
        longitude: _.eq(startAddress.longitude),
        latitude : _.eq(startAddress.latitude) 
      }
    },
    {
      state:_.eq(state)
    }
  ])
  ).get().then( res =>{
    console.log("调用数据库的结果",res);
    result.orders = res.data
  }).catch( err =>{
    result.errMsg.fromDao = err
  })
  console.log("返回的dao的结果",result);
  return result
}