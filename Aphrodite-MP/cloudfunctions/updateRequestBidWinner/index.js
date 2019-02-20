// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async(event, context) => {
  try {
    return await db.collection('RequestBidders').where({
        bidder_id: event.bidderId,
        request_id: event.requestId
      })
      .update({
        data: {
          is_win: event.isWin
        },
      })
  } catch (e) {
    console.error(e)
  }
}