const funData = require('./utils/functionMethodData.js');
const weixin = require('./utils/weixin.js');
const utils = require('./utils/util.js');
const app = getApp();
App({
  globalData: {
    SocketTask: null,
    userInfo: null,
    shopCode: '',
    groupId: '',
    user_id: '',
    level: '',
    screenWidthScale: 0.0,
    screenHightScale: 0.0,
    screenWidth: 0,
    screenHight: 0,
    // 订单号
    orderUUID: '',
    // 商品ID,地址跳转商品详情
    goodsId: '',
    //订单跳转
    shcode: '',
    color: '',
    ZKprice: '',
    size: '',
    tastes: '',
    typee: '',
    volume: '',
    // 外卖订单
    shop_code: '',
    //商家code优惠券时使用
    couponCode: '',
    prcirCounp: '', //优惠券使用前价格
    weChat:'',
    locationName:'',//外卖定位店铺
  },

  onLaunch: function() {
    let that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        funData.mylogin(res.code, function(data) {
          if (data.data.data.stauts == 0) {
            wx.showModal({
              title: '提示',
              content: '您的账户被禁用了,请联系客服',
              icon: 'none',
              success: function() {
                wx.redirectTo({
                  url: '/pages/kefu/kefu',
                })
              },
              fail: function() {
                wx.redirectTo({
                  url: '/pages/kefu/kefu',
                })
              }
            })
          }
          // console.log(data)
          that.globalData.user_id = data.data.data.user_id;
          that.globalData.level = data.data.data.level;
          that.globalData.weChat = data.data.data.weChat;
          if (utils.isEmpty(that.globalData.user_id)) {
            return;
          } else {}
          wx.setStorageSync('user_info', {
            user_id: data.data.data.user_id,
            level: data.data.data.level
          });

          // websoket连接
          that.globalData.SocketTask = wx.connectSocket({
            url: 'wss://www.yjwsch.com//MicroPlatform/websocket/' + data.data.data.user_id,
          });

        });
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          })
        }
      }
    });
    // 获取页面信息
    let systemInfo = wx.getSystemInfoSync();
    wx.setStorageSync('PX_TO_RPX', {
      px2rpxWidth: systemInfo.windowWidth / 750,
      px2rpxHeight: systemInfo.screenHeight / 1334
    });
    //版本更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function() {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
  }
})