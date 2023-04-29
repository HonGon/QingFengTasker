// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let openid = event.openid
  let name = event.name
  let phoneNumber = event.phoneNumber

  let result = {
    msg: '',
    errMsg: {
      fromDao: {},
      fromService: {},
      fromController: {}
    }
  }


  let _id = ''
  await cloud.callFunction({
    name: 'userRegisterService',
    data: {
      openid: openid,
      name: name,
      phoneNumber: phoneNumber
    }
  }).then(res => {
    console.log('调用service的结果', res)
    _id = res.result._id
    result.errMsg.fromDao = res.result.errMsg.fromDao
    result.errMsg.fromService = res.result.errMsg.fromService
  }).catch(err => {
    result.errMsg.fromController = err
  })


  if (_id != '') {
    result.msg = '注册成功'
  } else {
    result.msg = '注册失败'
  }

  console.log('返回controller的结果', result)
  return result
}