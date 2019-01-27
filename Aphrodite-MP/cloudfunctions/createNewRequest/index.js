// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    return await db.collection('NewRequest').add({
      data: {
        _openid: event.openId,
        imageId: event.imageId,
        imagePath: event.imagePath,
        createdAt: db.serverDate()
      }
    })
  } catch (e) {
    console.error(e)
  }
}