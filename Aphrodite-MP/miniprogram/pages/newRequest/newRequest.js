// miniprogram/pages/NewRequest/newRequest.js
const app = getApp()
const db = wx.cloud.database()
const newRequestRepository = db.collection('NewRequest')

Page({

  /**
   * Page initial data
   */
  data: {
    isUserLogin: false,
    newRequestImageUrl: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    isUserLogin: !!app.globalData.openId
    this.loadRequestForUser.bind(this)
  },

  onGotUserInfo: function(e) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openId = res.result.openid
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
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
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
    newRequestRepository.add({
      data: {
        openId: openId,
        imageId: imageId,
        imagePath: imagePath,
        createdAt: db.serverDate()
      },
      success: res => {
        console.log('Create new request success for user ', openId)
      }
    })
  },

  loadRequestForUser: function(openId) {
    console.log('load request ', openId)
    newRequestRepository.where({
      _openid: openId
    }).get({
      success: res => {
        this.setData({
          newRequestImageUrl: res.data[0].imagePath
        })
      }
    })
  }
})