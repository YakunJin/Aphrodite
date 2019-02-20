//index.js
const _map = require('lodash.map')
const _find = require('lodash.find') 
const _forEach = require('lodash.foreach')
const app = getApp()

Page({
  data: {
    bidderProducts: []
  },

  onLoad: function() {
    this.loadBidderProducts();
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  loadBidderProducts: function () {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'loadBidderProducts',
      // 传给云函数的参数
      data: {},
      success: res => {
        if (res.result.data.length > 0) {
          let imageIds = _map(res.result.data, 'imageId')
          wx.cloud.getTempFileURL({
            fileList: imageIds,
            success: fileRes => {
              _forEach(fileRes.fileList, (file) => {
                let matchBidderProduct = _find(res.result.data, (bidderProduct)=> {
                  return bidderProduct.imageId == file.fileID
                })
                matchBidderProduct.imageUrl = file.tempFileURL
              })

              this.setData({
                bidderProducts: res.result.data
              })
            }
          })
        }
      },
      fail: console.error
    })
  },

  onGetOpenid: function() {
    // // 调用云函数
    // wx.cloud.callFunction({
    //   name: 'login',
    //   data: {},
    //   success: res => {
    //     console.log('[云函数] [login] user openid: ', res.result.openid)
    //     app.globalData.openid = res.result.openid
    //     wx.navigateTo({
    //       url: '../userConsole/userConsole',
    //     })
    //   },
    //   fail: err => {
    //     console.error('[云函数] [login] 调用失败', err)
    //     wx.navigateTo({
    //       url: '../deployFunctions/deployFunctions',
    //     })
    //   }
    // })
  },

})
