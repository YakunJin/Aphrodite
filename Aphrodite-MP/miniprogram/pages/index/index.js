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

              console.log('load bidder products', res.result.data);
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

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = 'new-request-image' + app.globalData.openId
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            this.setData({
              newRequestImageUrl: filePath,
            })
            this.createNewRequest(app.globalData.openId, res.fileID, filePath)
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
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
