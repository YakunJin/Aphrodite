// miniprogram/pages/newPhoto/newPhoto.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * Page initial data
   */
  data: {
    isUserLogin: false,
    newPhotoUrl: '../../images/photo-placeholder.png',
    isApertureOn: false,
    apertureOptions: ["F1", "F1.4", "F2", "F2.8", "F4", "5.6", "F8", "F11", "F16", "F22", "F32", "F44", "F64"],
    selectedApertureIndex: 0,
    isISOOn: false,
    isoOptions: ["100", "200", "400", "800", "1600", "3200", "6400", "12800"],
    selectedISOIndex: 0,
    isShutterOn: false,
    shutterOptions: ["B", "1", "1/2", "1/4", "1/8", "1/15", "1/30", "1/60","1/125","1/500","1/1000"],
    selectedShutterIndex: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    this.setData({
      isUserLogin: !!app.globalData.openId,
      deviceType: 'camera',
    })
  },

  onSetDeviceCamera() {
    this.setData({
      deviceType: 'camera'
    })
  },

  onSetDevicePhone() {
    this.setData({
      deviceType: 'phone'
    })
  },

  onSwithAperture() {
    this.setData({
      isApertureOn: !this.data.isApertureOn
    })
  },

  onSelectAperture(e) {
    this.setData({
      selectedApertureIndex: e.detail.value
    })
  },

  onSwithISO() {
    this.setData({
      isISOOn: !this.data.isISOOn
    })
  },

  onSelectISO(e) {
    this.setData({
      selectedISOIndex: e.detail.value
    })
  },

  onSwithShutter() {
    this.setData({
      isShutterOn: !this.data.isShutterOn
    })
  },

  onSelectShutter(e) {
    this.setData({
      selectedShutterIndex: e.detail.value
    })
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

  onSelectPhoto: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const filePath = res.tempFilePaths[0]
        this.setData({
          newPhotoUrl: filePath,
        })
      },
      fail: e => {
        console.error(e)
      }
    })
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
        let timeStamp = Date.parse(new Date());
        // 上传图片
        const cloudPath = 'new-photo-' + timeStamp + '-' + app.globalData.openId
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            this.setData({
              newPhotoUrl: filePath,
            })
            // this.savePhotoInfo(app.globalData.openId, res.fileID, filePath)
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

  savePhotoInfo: function(openId, photoId, photoPath) {
    wx.cloud.callFunction({
      name: 'savePhotoInfo',
      data: {
        openId: openId,
        photoId: imageId,
        photoPath: imagePath
      },
      success: res => {
        console.log('Save photo info for user ', openId)
      },
      fail: console.error
    })
  },
})