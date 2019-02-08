// miniprogram/pages/NewRequest/newRequest.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * Page initial data
   */
  data: {
    isUserLogin: false,
    newRequestImageUrl: '',
    requestBidders: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    isUserLogin: !!app.globalData.openId
    this.loadRequestForUser.bind(this)
    this.loadRequestBidders.bind(this)
  },

  onGotUserInfo: function(e) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        console.log('[云函数] [login] user unionid: ', res.result.unionid)
        console.log('[云函数] [login] user appid: ', res.result.appid)
        app.globalData.openId = res.result.openid
        app.globalData.unionId = res.result.unionid
        this.loadRequestForUser(res.result.openid);
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  console.log('userInfo ', res.userInfo)
                  this.setData({
                    avatarUrl: res.userInfo.avatarUrl,
                    userInfo: res.userInfo,
                    isUserLogin: true
                  })
                }
              })
            }
          }
        })

        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        this.setData({
          isUserLogin: false
        })
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  },

  // 上传图片
  doUpload: function() {
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

  createNewRequest: function(openId, imageId, imagePath) {
    wx.cloud.callFunction({
      name: 'deleteNewRequest',
      data: {
        openId: openId,
      },
      success: res => {
        wx.cloud.callFunction({
          name: 'createNewRequest',
          data: {
            openId: openId,
            imageId: imageId,
            imagePath: imagePath
          },
          success: res => {
            console.log('Create new request success for user ', openId)
          },
          fail: console.error
        })
      },
      fail: console.error
    })
  },

  loadRequestForUser: function(openId) {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'loadNewRequest',
      // 传给云函数的参数
      data: {
        openId: openId,
      },
      success: res => {
        if (res.result.data.length > 0) {
          this.setData({
            newRequestImageUrl: res.result.data[0].imagePath
          })
          this.loadRequestBidders(res.result.data[0]._id)
        }
      },
      fail: console.error
    })
  },

  loadRequestBidders: function(requestId) {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'loadBidderList',
      // 传给云函数的参数
      data: {
        requestId: requestId,
      },
      success: res => {
        console.log("bidders ", res.result.data)
        if (res.result.data.length > 0) {
          this.setData({
            requestBidders: res.result.data
          })
        }
      },
      fail: console.error
    })
  }
})