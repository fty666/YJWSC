// var util = require('../../../utils/util.js');
const app = getApp()
const utilFunctions = require('../../../utils/functionData.js');
const  util = require('../../../utils/util.js');
const URLData = require('../../../utils/data.js');

Page({
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    handleOption: {},
    upload_file_url: URLData.upload_file_url,
    // 商品id
    gid:"",
    // 商品数量
    num:""
  },

  /**
   * 页面监听事件，初次加载数据
   * */ 
  onLoad: function (options) {
    let that=this
    // console.log(options)
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    function odetail(res){
      // console.log(res)
      res = utilFunctions.dealOrderData(res)
      console.log(res);
      that.setData({
        orderInfo: res
      })
      wx.setStorage({
        key: "oinfo",
        data: that.data.orderInfo
      })
      // console.log(that.data.orderInfo)
    }
    utilFunctions.getOrderDetail(that.data.orderId,odetail,this)
  },
  payTimer() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    setInterval(() => {
      console.log(orderInfo);
      orderInfo.add_time -= 1;
      that.setData({
        orderInfo: orderInfo,
      });
    }, 1000);
  },
  // 去付款
  payOrder:function(){
    wx.navigateTo({
      url: '/pages/user/opays/opays'
    })
    wx.setStorage({
      key: "oid",
      data: this.data.orderId
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})