// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(async (resolve, rejec) => {
    //传入的参数
    let latestLongitude = event.latestLongitude
    let latestLatitude = event.latestLatitude
    let cid = event.cid
    let uid = event.uid
    //传出的参数
    let result = {
      orders: [],
      errMsg: {
        fromDao: [],
        fromService: []
      }
    }

    //获取对应校区域预设的地点
    let campus = {
      presetLocations: []
    }
    await cloud.callFunction({
      name: "findCampusByCid",
      data: {
        cid: cid
      }
    }).then(res => {
      // console.log("查数据库的得到的预设地址",res)
      campus = res.result.campus
    }).catch(err => {
      result.errMsg.fromService.push(err)
    })

    //腾讯位置服务有每秒并发限制，需对目的位置数组进行切割并隔一段时间调用
    let limit = 5                                   //限制数量
    let length = campus.presetLocations.length      //得到的校区预设地点的个数
    let total = 0                                   //计算需执行的批次总数
    total = (length % limit != 0) ? Math.floor((length / limit) + 1) : length / limit
    console.log("需要执行的次数", total)
    let count = 0                                   //批次计数

    let presetLocationsSplit = []                   //计算得到的包含每个批次的预设点的总数组
    let begin = 0
    let end = limit
    let locationsTemp = []
    for (let i = 0; i < total; i++) {
      locationsTemp = campus.presetLocations.slice(begin, end)
      presetLocationsSplit.push(locationsTemp)
      begin += limit
      end += limit
      if (end >= length) {
        end = length
      }
    }

    //承接人当前所处的位置
    let currentLocation = latestLatitude + "," + latestLongitude
    let key = "JA7BZ-N4767-P6QXX-PJGHW-35FLT-2MFSZ"     //位置服务的key                 
    let mode = "walking"                              //按照骑行模式进行查询
    let targetLocations = [] //分批处理时候要用的中间变量，对其使用join()得到位置服务url的to查询参数
    let latLongStr = ""
    let distanceMatrix = []

    //循环处理，每秒1次
    let interval = setInterval(async () => {
      //将获取到的预设地点转换成 lat,long; 形式拼接的字符串
      for (let i = 0; i < presetLocationsSplit[count].length; i++) {
        latLongStr = presetLocationsSplit[count][i].latitude + "," + presetLocationsSplit[count][i].longitude
        targetLocations.push(latLongStr)
      }
      let targetLocationsStr = targetLocations.join(";")
      console.log(`当前第${count}组拼接后的字符串是${targetLocationsStr}`)

     
      let requestUrl =  `https://apis.map.qq.com/ws/distance/v1/matrix/?mode=${encodeURIComponent(mode)}&from=${encodeURIComponent(currentLocation)}&to=${encodeURIComponent(targetLocationsStr)}&key=${encodeURIComponent(key)}`
      console.log("请求的url是", requestUrl)
      //调用腾讯位置服务距离矩阵计算接口
      await axios({
        method: 'GET',
        url: requestUrl,
      }).then(res => {
        if (res.data.status == 0) {
          console.log("得到的结果是",res.data)
          distanceMatrix.push(...(res.data.result.rows[0].elements))
          console.log("得到的距离矩阵是",distanceMatrix)
        } else {
          console.log("得到的结果121212是",res.data)
          result.errMsg.fromService.push(
            {
              status: res.data.status,
              message: res.data.message
            }
          )
        }
      }).catch(err => {
        console.log(err)
      })

      //中间变量复位
      targetLocations = []
      latLongStr = ""

      //批次计数加一
      count = count + 1
      console.log("当前计数是",count);

      //定时循环的出口
      if (count == total) {
        clearInterval(interval)
        resolve({ distanceMatrix, campus, result, uid })
      }
    }, 1000)
  }).then(async ({ distanceMatrix, campus, result, uid }) => {
    //对得到的距离矩阵中的每个距离添加编号id，以便标识在排序之后的对应预设点的距离
    for (let i = 0; i < distanceMatrix.length; i++) {
      Object.defineProperty(distanceMatrix[i], "id", {
        value: i,
        configurable: true,
        enumerable: true,
        writable: true
      })
    }
    //对得到的距离矩阵进行排序
    distanceMatrix = distanceMatrix.sort((a, b) => {
      return a.distance - b.distance
    })
    console.log("排序之后的距离矩阵", distanceMatrix)

    let startAddressCandidateIndexArr = []
    startAddressCandidateIndexArr.push(distanceMatrix[0].id)
    console.log("候选的起点地址标号", startAddressCandidateIndexArr)
    for (let i = 0; i < distanceMatrix.length - 1; i++) {
      //如果后续预设点的距离与最短的预设点的距离不超过100米
      //则也将其纳入待查询的候选地点之一
      // console.log(`当前距离对象${distanceMatrix[i].id}`)
      if (distanceMatrix[i + 1].distance - distanceMatrix[0].distance < 100) {
        startAddressCandidateIndexArr.push(i.id)
      }
    }

    for (let i = 0; i < startAddressCandidateIndexArr.length; i++) {
      //查询以候选地点为起点的委托订单
      let startAddress = campus.presetLocations[startAddressCandidateIndexArr[i]]
      await cloud.callFunction({
        name: "listOrdersByStartAddressAndState",
        data: {
          startAddress: startAddress,
          state:1
        }
      }).then(res => {
        console.log("调用dao的结果", res)
        result.orders =  result.orders.concat(res.result.orders)
        result.errMsg.fromDao = res.result.errMsg.fromDao
      }).catch(err => {
        result.errMsg.fromService = err
      })

      //排除接单人自己发布的委托
      result.orders = result.orders.filter( o => o.poster.uid != uid)

      console.log("返回的service的结果", result)
      return result
    }
  })
}