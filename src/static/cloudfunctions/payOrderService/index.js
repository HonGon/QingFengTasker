// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let _id = event._id

  let result = {
    msg: "",
    errMsg: {
      fromDao: {},
      fromSercice: {}
    }
  }

  await cloud.callFunction({
    name:'updateOrderStateById',
    data: {
      _id: _id,
      state: 4
    }
  }).then(res => {
    console.log('调dao的结果',res)
    result.msg = res.result.msg
    result.errMsg.fromDao = res.result.errMsg.fromDao
  }).catch(err => {
    result.errMsg.fromSercice = err
  })

  if(result.msg == '更新成功'){
    result.msg ='支付成功'
  }else{
    result.msg ='支付失败'
  }

  console.log('返回的service结果',result)
  return result
}