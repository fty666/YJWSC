const util = require('./util.js');
const config = require('./config.js');
const app = getApp();
module.exports = {

  /**
   * 微信支付
   */
  wxPay: function () {
    wx.requestPayment({
      'timeStamp': util.timeStamp(1, ''),
      'nonceStr': '后台生成获取',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
        suFun(res);
      },
      'fail': function (res) {
      }
    })
  },

  /**
   * 检查是否登录
   */
  wxIsLogin: function () {
    if (util.isEmpty(app.globalData.user_id)) {
      wx.login({
        success: res => {
          // console.log(res.code);
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          funData.mylogin(res.code, function (data) {
            console.log(data.data.data);
            app.globalData.user_id = data.data.data.user_id;
            app.globalData.level = data.data.data.level;
            wx.setStorageSync('user_info', { user_id: data.data.data.user_id, level: data.data.data.level });
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
                app.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res);
                  // console.log(res);
                }
              }
            })
          }
        }
      });
    }
  },


  /**
   * WebSocket-发送
   */
  sendSocket: function (mymessage, ToSendUserno) {
    console.log('websocket===' + mymessage + '===' + ToSendUserno);
    let socketOpen = true;
    let socketMsgQueue = [];
    let message = mymessage + '|' + ToSendUserno;
    let SocketTask = app.globalData.SocketTask;   
    SocketTask.send({
      data: message,
      success: function () {
        console.log('success')
      }
    })


    // if (!util.isEmpty(message)) {
    //   socketMsgQueue.push(message);
    // }

    // wx.onSocketOpen(function (res) {
    //   console.log('连接成功');
    //   socketOpen = true
    //   for (var i = 0; i < socketMsgQueue.length; i++) {
    //     if (socketOpen) {
    //       console.log('发送了')
    //       wx.sendSocketMessage({
    //         data: socketMsgQueue[i]
    //       })
    //     } else {
    //       socketMsgQueue.push(socketMsgQueue[i])
    //     }
    //   }
    //   socketMsgQueue = []
    // });

    // wx.onSocketError(function (res) {
    //   socketOpen = false;
    //   console.log('WebSocket连接打开失败，请检查！')
    // });
  },

  /**
   * WebSocket-接收
   */
  onSocket: function (ToSendUserno) {
    console.log('收到服务器内容：==');
    wx.connectSocket({
      url: config.wshost + ToSendUserno,
    })
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + JSON.stringify(res));
      if (!util.isEmpty(JSON.stringify(res))) {
        wx.showToast({
          title: 'webSocket成功',
          icon: 'success',
          duration: 2000
        });
        wx.playVoice({
          filePath: '/images/newMessage.mp3',
        });
      }

    });
  },
}