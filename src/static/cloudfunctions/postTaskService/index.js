// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let order = event.order
  let result = {
    msg:""
  }

  //生成新的订单编号
  let orderId = String(new Date().getTime()) + String(parseInt((Math.random() * 1000 + 1000)))
  
  Object.defineProperty(order, "id", {
    value: orderId,
    configurable:true,
    writable:true,
    enumerable:true
  })

  //初始化委托的最终报酬为发布者定义的报酬
  let finalReward = order.reward
  console.log("报酬是",finalReward)

  Object.defineProperty(order, "finalReward", {
    value: finalReward,
    configurable:true,
    writable:true,
    enumerable:true
  })

  // console.log("即将插入的订单为",order)

  await cloud.callFunction({
    name:"addOrder",
    data:{
      order:order
    }
  }).then( res => {
    // console.log("调用dao层操作结果",res)
     result.msg =  res.result.msg
  }).catch( err => {
    result.msg = err
  })
  console.log("service层返回的结果",result)
  return result
}