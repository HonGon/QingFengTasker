// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {

  let openid = event.openid

  let result = {
    user: {},
    errMsg: {
      fromService: {},
      fromDao: {}
    }
  }
  //调用DAO层函数获取用户信息
  await cloud.callFunction({
    name: "findUserByOpenid",
    data: {
      openid: openid
    }
  }).then(res => {
    //调用DAO层函数的结果中user不为空的话
    if (Object.keys(res.result.user).length != 0) {
      //将获取到的用户信息保存到result中
      result.user = res.result.user
    } else {
      //user为空，将错误信息返回
      result.errMsg.fromDao = res.result.errMsg.fromDao
    }
  }).catch(err => {
    result.errMsg.fromService = err
  })
  // console.log("service执行完之后的结果",result)
  return result
}