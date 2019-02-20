// 云函数入口文件
const cloud = require('wx-server-sdk')
const _ = require('lodash/core');
var chunk = require('lodash.chunk');

cloud.init()
const db = cloud.database()
const dbc = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let bidderProducts = (await db.collection('BidderProducts').get()).data
  let bidderIds = _.map(bidderProducts, 'bidder_id')
  let bidders = (await db.collection('Bidder').where({
    _id: dbc.in(bidderIds)
  }).get()).data

  let bidderProductResult =  _.map(bidderProducts, (bidderProduct) => {
    let bidderInfo = _.find(bidders, (bidder) => {
      return bidder._id === bidderProduct.bidder_id
    })

    return {
      bidderId: bidderProduct.bidder_id,
      description: bidderProduct.description,
      imageId: bidderProduct.image_id,
      imageUrl: "",
      createdAt: bidderProduct.created_at,
      price: bidderProduct.price
    }
  })

  // let imageIds = _.map(bidderProductResult, 'imageId')
  // let imageIdsBatch = chunk(imageIds, 50)
  
  // let imageUrls = _.map(imageIdsBatch, (idsBatch) => {
  //   cloud.getTempFileURL({
  //     fileList: idsBatch,
  //     success: res => {
  //       console.log('fileList ', res.fileList)
  //       _.foreach(res.fileList, (file)=> {
  //         let matchProduct = _.find(bidderProductResult, (result) => {
  //           result.imageId == file.fileID
  //         })
  //         matchProduct.imageUrl = file.tempFileURL
  //       })
  //     }
  //   })
  // })
  
  return {
    data: bidderProductResult,
    errMsg: ''
  }
}