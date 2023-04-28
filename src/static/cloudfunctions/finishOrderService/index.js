// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let id = event.id

  let result = {
    msg: [],
    errMsg: {
      fromDao: [],
      fromService: []
    }
  }

  let order = {}
  //调用dao获取当前订单数据
  await cloud.callFunction({
    name: "findOrderById",
    data: {
      id: id
    }
  }).then(res => {
    order = res.result.order
    result.errMsg.fromDao.push(res.result.errMsg.fromDao)
  }).catch(err => {
    result.errMsg.fromService.push(err)
  })

  let finalReward = order.finalReward                         //获取订单的初始最终报酬
  let endTimestamp = parseInt(order.endTimestamp)             //获取订单截止时间

  //如果订单设置了截止时间
  if (endTimestamp != 0) {
    let nowTimestamp = parseInt(new Date().getTime() / 1000)    //获取当前时间
    let timeDifference = nowTimestamp - endTimestamp
    //如果承接人提交委托完成的时间超过了设置的截止时间
    if (timeDifference > 0) {
      //每分钟减少自身10%的报酬金额
      let i = Math.pow(0.9, Math.floor(timeDifference / 60))
      finalReward = parseFloat((finalReward * i).toFixed(2))
      //如果严重超时了，那么订单的报酬最低也只能是0.01元
      if (finalReward < 0.01) {
        finalReward = 0.01
      }
    }
  }
  console.log("订单的最终金额为", finalReward)

  //如果最终的报酬与最初设定的不一样，则去更新最终报酬
  if (finalReward != order.finalReward) {
    await cloud.callFunction({
      name: "updateOrderFinalRewardById",
      data: {
        _id: order._id,
        finalReward: finalReward
      }
    }).then(res => {
      result.msg.push(res.result.msg)
    }).catch(err => {
      result.errMsg.fromService.push(err)
      result.msg.push("")
    })

  }

  await cloud.callFunction({
    name: "updateOrderStateById",
    data: {
      _id: order._id,
      state: 3
    }
  }).then(res => {
    result.msg.push(res.result.msg)
  }).catch(err => {
    result.errMsg.fromService.push(err)
    result.msg.push("")
  })
  console.log("返回的seivice结果", result)
  return result
}