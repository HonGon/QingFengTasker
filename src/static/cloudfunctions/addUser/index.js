// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let openid = event.openid
  let uid = event.uid
  let name = event.name
  let phoneNumber = event.phoneNumber

  let result = {
    _id: '',
    errMsg: {
      fromDao: {}
    }
  }

  await db.collection('user').add({
    data: {
      openid: openid,
      uid: uid,
      name: name,
      phoneNumber: phoneNumber
    }
  }).then(res => {
    console.log('调用数据库的结果', res)
    result._id = res._id
  }).catch(err => {
    result.errMsg.fromDao = err
  })

  return result
}