
const urlData = require('./utils/urlData.js');
const funData = require('./utils/functionMethodData.js');
const weixin = require('./utils/weixin.js');
const utils = require('./utils/util.js');
const app = getApp();
App({
  globalData: {
    SocketTask:null,
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
    // weChat
    weChat: '',
    // 商品ID,地址跳转商品详情
    goodsId: '',
    //订单跳转
    shcode:'',
    color:'',
    ZKprice:'',
    size:'',
    tastes:'',
    typee:'',
    volume:'',
    // 外卖订单
    shop_code:'',
  },

  onLaunch: function () {
    let that = this;
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        console.log(res.code);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        funData.mylogin(res.code, function (data) {
          console.log(data.data.data);
          that.globalData.user_id = data.data.data.user_id;
          that.globalData.level = data.data.data.level;
          if (utils.isEmpty(that.globalData.user_id)) {
            return;
          } else {
          }
          wx.setStorageSync('user_info', {
            user_id: data.data.data.user_id,
            level: data.data.data.level
          });

          // websoket连接
          that.globalData.SocketTask = wx.connectSocket({
            url: 'wss://www.yjwsch.com//MicroPlatform/websocket/' +data.data.data.user_id,
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
              // console.log(res);
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
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
    wx.setStorageSync('PX_TO_RPX', { px2rpxWidth: systemInfo.windowWidth / 750, px2rpxHeight: systemInfo.screenHeight / 1334 });

  },
})