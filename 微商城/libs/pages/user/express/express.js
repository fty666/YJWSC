// var util = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
    orderId: 1,
    expressInfo: {},
    expressTraces: [],
    px2rpxWidth: '',
    px2rpxHeight: '',
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.id
    });
    this.getExpressInfo();
  },
  onReady: function () {
    // 页面渲染完成
    let that = this;
    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function (res) {
        console.log(res)
        that.setData({
          px2rpxHeight: res.data.px2rpxHeight,
          px2rpxWidth: res.data.px2rpxWidth,
        })
      }
    })

  },
  onShow: function () {
    // 页面显示

  },
  getExpressInfo() {
    let that = this;
    util.request(api.OrderExpress, { orderId: that.data.orderId }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          expressInfo: res.data,
          expressTraces: res.data.traces
        });
      }
    });
  },
  updateExpress() {
    this.getExpressInfo();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})