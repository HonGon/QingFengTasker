// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let order = event.order

  let result = {
    msg:'',
    errMsg: {
      fromDao:{},
      fromService:{},
      fromController:{}
    }
  }

  await cloud.callFunction({
    name:'modifyOrderService',
    data:{
      order: order
    }
  }).then(res => {   
  console.log('调用service的结果',result)
    result.msg = res.result.msg
    result.errMsg.fromDao = res.result.errMsg.fromDao
    result.errMsg.fromService = res.result.errMsg.fromService
  }).catch(err => {
    result.errMsg.fromController = err
  })

  if(result.msg == '更新成功'){
    result.msg = '修改成功'
  }else{
    result.msg = '修改失败'
  }

  console.log('返回的controller的结果',result)
  return result
}