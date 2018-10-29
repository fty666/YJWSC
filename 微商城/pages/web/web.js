// pages/web/web.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onLoad(){

  },

    onSocket: function () {
      
      SocketTask.onOpen(function () {
        console.log('onopen')
      });

      SocketTask.onMessage(function (data) {
        console.log('收到服务器内容：' + JSON.stringify(data));
        console.log(data)
      });

      SocketTask.onError(function (res) {
        console.log('WebSocket连接打开失败，请检查！')
        console.log(res)
      });
    },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  web: function () {
    let SocketTask = app.globalData.SocketTask;   
    let socketOpen = false;
    let ToSendUserno = 'BM7aMEit';
    let mymessage='8888';
    let message = mymessage + '|' + ToSendUserno;
    console.log(message)
    SocketTask.send({
      data: message,
      success:function(){
        console.log('success')
      }
    },{})
  }

})