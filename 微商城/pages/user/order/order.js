// var util = require('../../../utils/util.js');
const app = getApp()
const utilFunctions = require('../../../utils/functionData.js');
const funDta = require('../../../utils/functionMethodData.js');
const util = require('../../../utils/util.js');
const URLData = require('../../../utils/data.js');
const weixin = require('../../../utils/weixin.js');
Page({
  data: {
    orders: null,
    glo_is_load: true,
    hasData: false,
    timer: '',
    status: 3,
    all_order: -1, // 全部
    pending_payment: 1, // 1未付款
    to_be_shipped: 2, // 2付款未发货(可退货)
    to_be_received: 3, // 3付款待收货
    to_be_evaluated: 4, // 4收货待评价(订单完成)
    accomplish: 5, // 5评价完成
    exchange_goods: 6, // 6换货
    return_of_goods: 7, // 7退货
    orderList: [],
    olists: [],
    times: "",
    active: 3,
    page: 1,
    pageSize: 20,
    upload_file_url: URLData.upload_file_url,
    px2rpxWidth: '',
    px2rpxHeight: '',
    pays: false, //付款
    payshow: false,
    obligation: '', //待付款订单
    every: false, //全部
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    let sendStatu = '';
    if (options.sends) {
      sendStatu = 2;
      that.setData({
        status: 2
      })
    } else if (options.common) {
      sendStatu = 4;
      that.setData({
        status: 4
      })
    } else {
      sendStatu = 3;
      that.setData({
        status: 3
      })
    }
    that.getOrder(sendStatu, that);
  },
  /**
   *获取订单 
   */
  getOrder: function(statu, that) {
    var page = that.data.page;
    var pageSize = that.data.pageSize;
    // 进入页面默认状态为待收货
    utilFunctions.getOrderStatusUrl(app.globalData.user_id, statu, page, pageSize, (data) => {
      let orders = utilFunctions.dealOrderData(data.PageInfo.list);
      if (orders.length <= 0) {
        that.setData({
          orders: orders,
          glo_is_load: false,
          hasData: false,
        });
      } else {
        that.setData({
          orders: orders,
          glo_is_load: false,
          hasData: true,
          status: statu
        });
      }
    }, that);
  },
  // 去付款
  payOrder(e) {
    let oid = e.target.dataset.uid;
    let index = parseInt(e.target.dataset.index);
    let addid = parseInt(e.target.dataset.addid);
    let obligation = this.data.obligation;
    wx.navigateTo({
      url: '/pages/user/opays/opays?oid=' + oid + '&addressId=' + addid,
    })
  },

  /**
   * 取消订单
   */
  escorder(e) {
    let that = this;
    let oid = e.target.dataset.uid;
    wx.showModal({
      title: '提示',
      content: '确定要取消此订单',
      success: function(res) {
        if (res.confirm) {
          function calback() {
            that.fu(that);
            that.getOrder(-1, that);
            wx.showToast({
              title: '已取消订单',
            })
          }
          funDta.updateRelevanceOrder(oid, that, calback)
        } else if (res.cancel) {}
      }
    })


  },

  onReady: function() {
    // 页面渲染完成
    let that = this;
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
   * 选择状态
   */
  selectStatus: function(e) {
    let that = this;
    let status = parseInt(e.currentTarget.dataset.status);
    if (status == -1) {
      that.setData({
        every: true,
        hasData: true
      })
      that.fu(that);
    } else {
      that.setData({
        pays: false,
        every: false,
      })
    }
    let hasData = true;
    that.getOrder(status, that);
  },

  /**
   *待付款 
   */
  obligation: function() {
    let that = this;
    that.setData({
      every: false
    })
    that.fu(that);
    that.setData({
      pays: true,
      orders: '',
      status: 1,
      hasData: true
    })
  },

  /**
   * 去订单详情
   */
  OrderDetails: function(e) {
    wx.navigateTo({
      url: '/pages/user/orderDetail/orderDetail?id=' + e.currentTarget.dataset.order_uuid,
    });
  },
  // 去付款详情 
  goOrderDetail: function(e) {
    wx.navigateTo({
      url: '/pages/user/opayDetail/opayDetail?oid=' + e.currentTarget.dataset.order_uuid + '&addressId=' + e.currentTarget.dataset.addid,
    })

  },

  /**
   * 提醒发货
   */
  remindSendGoods: function(e) {
    let order_uuid = e.currentTarget.dataset.order_uuid;
    let order_mainid = e.currentTarget.dataset.order_mainid;
    let shop_code = e.currentTarget.dataset.shop_code;
    let shopMobile = e.currentTarget.dataset.shopmobile;
    // 支付成功通知商家
    let that = this;
    let now = util.formatDate(new Date().getTime());
    that.sendSocket((now + ' 订单号：' + order_uuid), shop_code);
    //支付成功发送短信通知商家
    funDta.getOrderSms(shopMobile, that, () => {
      wx.showToast({
        title: '提醒发货成功',
        icon: 'success',
        duration: 1000
      })
    });
  },

  //web发送 
  sendSocket: function(mymessage, ToSendUserno) {
    let socketOpen = true;
    let socketMsgQueue = [];
    let message = mymessage + '|' + ToSendUserno;
    let SocketTask = app.globalData.SocketTask;
    SocketTask.send({
      data: message,
      success: function() {}
    })
  },


  /**
   * 确认收货
   */
  receiveGoods: function(e) {
    let that = this;
    let order_mainid = e.currentTarget.dataset.order_mainid;
    let index = e.currentTarget.dataset.index;
    let status = that.data.to_be_evaluated;
    let orders = that.data.orders;
    wx.showModal({
      title: '确认收货',
      content: '确认货物已经收到',
      success: function(res) {
        if (res.confirm) {
          utilFunctions.updateOrderStatus(order_mainid, status, (data) => {
            wx.showToast({
              title: '收货成功',
              icon: 'success',
              duration: 1000
            });
            orders.splice(index, 1);
            that.setData({
              orders: orders
            });
          }, that);

        } else if (res.cancel) {

        }
      }
    })

  },

  /**
   * 去评价
   */
  goComment: function(e) {
    wx.navigateTo({
      url: '/pages/user/comment/comment?order_uuid=' + e.currentTarget.dataset.order_uuid
    })
  },

  /**
   * 申请售后
   */
  afterSale: function(e) {
    let order_uuid = e.currentTarget.dataset.order_uuid;
    wx.navigateTo({
      url: '/pages/user/orderDetail/orderDetail?id=' + order_uuid
    })
  },

  /**
   * 查看物流
   */
  showExpress: function(e) {
    wx.navigateTo({
      url: '/pages/orderManage/express/express?order_uuid=' + e.currentTarget.dataset.order_uuid,
    })
  },

  /**
   * 删除订单
   */
  deleteOrder: function(e) {
    let order_mainid = e.currentTarget.dataset.order_mainid;
    let index = e.currentTarget.dataset.index;
    let orders = this.data.orders;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '删除订单不可恢复',
      success: function(res) {
        if (res.confirm) {
          utilFunctions.deleteOrder(order_mainid, () => {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            });
          }, this);
          orders.splice(index, 1);
          that.setData({
            orders: orders
          });
        } else if (res.cancel) {}
      }
    })

  },

  /**
   *  滚动到底部 / 右边，会触发 scrolltolower 事件
   */
  scrollToLower: function() {
    let that = this;
    let pageSize = that.data.pageSize;
    pageSize += 20;
    let order_type = 2;
    let status = that.data.status;
    let user_id = app.globalData.user_id;
    let shop_code = '';

    function microplat(data) {
      res = utilFunctions.dealOrderData(data.PageInfo.list)
      that.setData({
        orders: res,
        olists: res,
        active: -1
      })
    }
    utilFunctions.getOrderUrls(status, user_id, order_type, that.data.page, pageSize, shop_code, microplat, this)
  },

  // 查询待付款订单
  fu: function(that) {
    function calback(res) {
      // console.log(res)
      if (res.length <= 0) {
        that.setData({
          obligation: res,
        })
      } else {
        that.setData({
          obligation: res,
        })
      }
    }
    funDta.getNoPayOrder(app.globalData.user_id, that, calback)
  }
})