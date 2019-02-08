// 云函数入口文件
const cloud = require('wx-server-sdk')
const _ = require('lodash/core');

cloud.init()
const db = cloud.database()
const dbc = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  let requestBidders = (await db.collection('RequestBidders').where({
    request_id: event.requestId
  }).get()).data
  let bidderIds = _.map(requestBidders, 'bidder_id')
  let bidders = (await db.collection('Bidder').where({
    _id: dbc.in(bidderIds)
  }).get()).data

  return {
    data: _.map(requestBidders, (requestBidder) => {
      let bidderInfo = _.find(bidders, (bidder) => {
        return bidder._id === requestBidder.bidder_id
      })
      return {
        requestId: requestBidder.request_id,
        bidderName: bidderInfo.name,
        bidderAvatar: bidderInfo.avatar,
        bidderReview: bidderInfo.review,
        price: requestBidder.price,
        isWin: requestBidder.is_win
      }
    }),
    errMsg: ''
  }
}