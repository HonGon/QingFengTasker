// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  //获取前端传来的参数
  let order = event.order

  //定义后端返回的结果
  let result = {
    msg:""
  }

  console.log("传入的order",order);

  //调用service层方法
  await cloud.callFunction({
    name:"postTaskService",
    data:{
      order:order
    }
  }).then( res => {
    result.msg = res.result.msg
    console.log("调用ser层操作结果",res)
  }).catch( err => {
    result.msg = err
  })
  console.log("controller层操作结果",result)
  return result
}