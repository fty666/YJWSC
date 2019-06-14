//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
const urlData = require('../../utils/urlData.js');
const funData = require('../../utils/functionMethodData.js');
const calculate = require('../../utils/calculate.js');
const weixin = require('../../utils/weixin.js');
const template = require('../../template/template.js');
var page = 1;
var pageSize = 20;
var mystatus = -1;
Page({
  data: {
    glo_is_load: true,
    order: null,
    totalIncome: 0.0,
    runningMoney: 0.0,
    publicWelfareMoney: 0.0,
    hasData: false,
    all_order: -1, // 全部
    pending_payment: 1, // 1未付款
    to_be_shipped: 2, // 2付款未发货(可退货)
    to_be_received: 3, // 3付款待收货
    to_be_evaluated: 4, // 4收货待评价(订单完成)
    accomplish: 5, // 5评价完成
    exchange_goods: 6, // 6换货
    return_of_goods: 7, // 7退货
    navTab: ["全部", "待发货", "待收货", "退货处理", "换货处理"],
    currentNavtab: 0,
    oederSearchInput: null, // 搜索订单号
    scrollTop: 0,
    floorstatus: false,
    shop_code: '',
    uploadFileUrl: urlData.uploadFileUrl,
    oids: '', //订单id
    now: false, //显示已发货
    px2rpxWidth: '',
    px2rpxHeight: '',
  },

  catchtouchstart: function(e) {
    let that = this;
    that.setData({
      startPoint: [e.touches[0].clientX, e.touches[0].clientY]
    });
  },


  /**
   * 拨打电话
   */
  // callEvent: function (e) {
  //     console.log(e)
  //     wx.makePhoneCall({
  //         phoneNumber: this.data.phoneNum
  //     })
  // },

  // 加载
  onLoad: function(options) {
    let that = this
    // 加载页面tarBar模块
    template.tabbar("tabBar", 1, this, 2);

  },

  onReady: function() {
    let that = this;
    funData.getShopCode(app.globalData.user_id, that, (data) => {
      that.setData({
        shop_code: data.shop_code
      });
    });
    if (that.data.currentNavtab == 0) {
      mystatus = -1;
      setTimeout(function() {
        that.getOrder(mystatus, that, page, pageSize);
        weixin.onSocket(that.data.shop_code);
      }, 1000);
    };
    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function(res) {
        that.setData({
          px2rpxHeight: res.data.px2rpxHeight,
          px2rpxWidth: res.data.px2rpxWidth,
        })
      }
    })
  },

  /**
   * 点击导航
   */
  switchTab: function(e) {
    let that = this;
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx,
      floorstatus: false
    });
    that.statusOrder(e.currentTarget.dataset.idx, that);
  },

  // 查询各种状态的订单
  statusOrder: function(tabstatus, that) {
    if (tabstatus == 0) {
      mystatus = -1;
    } else if (tabstatus == 3) {
      mystatus = 7;
    } else if (tabstatus == 4) {
      mystatus = 6;
    } else if (tabstatus == 1) {
      mystatus = 2;
    } else {
      mystatus = 3;
    }
    // console.log(mystatus);
    that.getOrder(mystatus, that, page, pageSize);
  },

  // 查询订单
  getOrder: function(mystatus, that, page, pageSize) {
    // 查询店铺订单
    let order_type = '';
    let user_id = '';
    if (app.globalData.groupId == 1) {
      order_type = 1;
    } else {
      order_type = 2;
    }
    funData.getOrder(that.data.shop_code, mystatus, page, pageSize, order_type, user_id, that, function(data) {
      // 对订单数据格式的转化
      let order = funData.dealOrderData(data.PageInfo.list);
      that.setData({
        order: order,
        hasData: true,
        glo_is_load: false
      });
    });
  },

  /**
   * 发货按钮
   */
  sendGoods: function(e) {
    if (this.data.order[0].groupId == 1) {
      let reception = that.data.to_be_received;
      let order_mainid = this.data.order[0].order_mainid;
      let that = this;

      function calback() {
        wx.showToast({
          title: '发货成功',
        })
        that.setData({
          now: true
        })
      }
      funData.updateOrder(order_mainid, reception, this, calback);
    } else {
      wx.navigateTo({
        url: '/pages/orderManage/sendGoods/sendGoods?order_uuid=' + e.currentTarget.dataset.order_uuid
      })
    }
  },

  // 改变状态 同步修改数据
  changeOrderStatus: function(index, mystatus, that) {
    let order = that.data.order;
    let len = order.length;
    order[index].status = mystatus;
    that.setData({
      order: order
    });
  },

  /**
   * 查询订单详情
   */
  orderDetail: function(e) {
    console.log(e.currentTarget.dataset.order_uuid);
    wx.navigateTo({
      url: '/pages/orderManage/orderDeatail/orderDeatail?order_uuid=' + e.currentTarget.dataset.order_uuid
    })
  },


  // 失去焦点获取输入值
  bindchange: function(e) {
    this.setData({
      oederSearchInput: e.detail.value
    });
  },

  /**
   * 搜索订单
   */
  oederSearch: function() {
    let that = this;
    wx.navigateTo({
      url: '/pages/orderManage/orderDeatail/orderDeatail?order_uuid=' + that.data.oederSearchInput
    })
  },

  /**
   *修改收货地址 
   */
  addrupdata: function(e) {
    let oids = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '/pages/orderManage/editAddr/editAddr?oid=' + oids
    })
  },

  /**
   * 换货详情按钮
   */
  exchangeGoods: function(e) {
    wx.navigateTo({
      url: '/pages/orderManage/exchangeGoods/exchangeGoods?order_uuid=' + e.currentTarget.dataset.order_uuid
    })
  },

  /**
   * 退货详情按钮
   */
  returnGoods: function(e) {
    wx.navigateTo({
      url: '/pages/orderManage/returnGoods/returnGoods?order_uuid=' + e.currentTarget.dataset.order_uuid
      // url: '/pages/orderManage/returnGoods/returnGoods'

    })
  },

  /**
   *  查看物流详情
   */
  checkLogistics: function(e) {
    wx.navigateTo({
      url: '/pages/orderManage/express/express?order_uuid=' + e.currentTarget.dataset.order_uuid
    })
  },

  /**
   * 滚动到底部/右边，会触发 scrolltolower 事件
   */
  scrollToLower: function() {
    let that = this;
    pageSize += 20;
    that.getOrder(mystatus, that, page, pageSize);
    that.setData({
      floorstatus: true
    })
  },

  /**
   * 滚动到顶部/左边，会触发 scrolltoupper 事件
   */
  scrollToUpper: function() {
    this.setData({
      floorstatus: false
    })
  },

  /**
   * 返回顶部
   */
  goTop: function(e) {
    this.setData({
      scrollTop: 0
    })
  },


})