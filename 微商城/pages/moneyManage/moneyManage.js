//获取应用实例
const app = getApp();
const urlData = require('../../utils/urlData.js');
const funData = require('../../utils/functionMethodData.js');
const util = require('../../utils/util.js');
const template = require('../../template/template.js');
let page = 1;
let pageSize = 20;
Page({
  data: {
    glo_is_load: true,
    allMoney: '0.00',
    totalIncome: '0.00',
    runningMoney: 0.0,
    publicWelfareMoney: 0.0,
    orderNum: 123456789,
    payAmount: 0.0,
    payTime: '2017年2月16日  11:42',
    payType: '微信钱包',
    hasData: false,
    moneyInfo: [, , , , , , , ],
    scrollTop: 0,
    floorstatus: false,
    px2rpxWidth: '',
    px2rpxHeight: '',
  },

  // 加载
  onLoad: function(options) {
    let that = this
    // 加载页面tarBar模块
    template.tabbar("tabBar", 2, this, 2);
    // 查询售卖总金额
    setTimeout(function() {
      funData.getShopCode(app.globalData.user_id, that, (data) => {
        funData.getOrderMoney(data.shop_code, that, (data) => {
          that.setData({
            totalIncome: data,
            hasData: true,
            glo_is_load: false,
          });
        });
      });
      // 查询每笔订单的金额
      that.getOneOrderMoney(page, pageSize, that);
    }, 1000);

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
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
   * 返回顶部
   */
  goTop: function(e) {
    this.setData({
      scrollTop: 0,
    })
  },
  /**
   * 滚动到底部,会触发 scrolltolower 事件
   */
  scrollToLower: function() {
    let that = this;
    pageSize += 20;
    // 查询每笔订单的金额
    that.getOneOrderMoney(page, pageSize, that);
    that.setData({
      floorstatus: true
    });
  },


  /**
   * 跳转订单详情
   */
  goOrderDetail: function(e) {
    let order_uuid = e.currentTarget.dataset.order_uuid;
    wx.navigateTo({
      url: '../orderManage/orderDeatail/orderDeatail?order_uuid=' + order_uuid
    })
  },


  // 查询每笔订单的金额
  getOneOrderMoney: function(page, pageSize, that) {
    funData.getOneOrderMoney(app.globalData.shopCode, page, pageSize, that, (data) => {
      let moneyInfo = data.PageInfo.list;
      let len = moneyInfo.length;
      for (let i = 0; i < len; i++) {
        moneyInfo[i].createTime = util.formatDate(moneyInfo[i].createTime, 'YY/MM/DD hh:mm:ss');
      }
      that.setData({
        moneyInfo: moneyInfo,
      });
    });
  },

})