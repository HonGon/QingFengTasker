// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = {
    user: {},
    errMsg: {
      fromController: {},
      fromService: {},
      fromDao: {},
    }
  }
  let openid = event.openid

  await cloud.callFunction({
    name: "userLoginService",
    data: {
      openid: openid
    }
  }).then(res => {
    console.log("调用service结果", res.result)
    if (Object.keys(res.result.user).length != 0) {
      result.user = res.result.user
    } else {
      result.errMsg.fromService = res.result.errMsg.fromService
      result.errMsg.fromDao = res.result.errMsg.fromDao
    }
  })
    .catch(err => {
      result.errMsg.fromController = err
    })

  return result
}