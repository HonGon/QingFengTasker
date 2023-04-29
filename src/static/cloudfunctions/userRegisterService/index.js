// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let openid = event.openid
  let name = event.name
  let phoneNumber = event.phoneNumber

  let result = {
    _id: '',
    errMsg: {
      fromDao: {},
      fromService: {}
    }
  }

  //生成新的用户编号, 开头2000-2999的随机数再拼接一个当前的毫秒时间戳
  let uid = Math.ceil((Math.random() * 999 + 2000)).toString() + new Date().getTime().toString()

  await cloud.callFunction({
    name: 'addUser',
    data: {
      openid: openid,
      uid: uid,
      name: name,
      phoneNumber: phoneNumber
    }
  }).then(res => {
    console.log('调用dao的结果', res)
    result._id = res.result._id
    result.errMsg.fromDao = res.result.errMsg.fromDao
  }).catch(err => {
    result.errMsg.fromService = err
  })

  console.log('返回的service的结果', result)
  return result
}