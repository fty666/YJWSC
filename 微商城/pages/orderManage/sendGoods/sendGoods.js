const app = getApp();
const util = require('../../../utils/util.js');
const urlData = require('../../../utils/urlData.js');
const URLData = require('../../../utils/data.js');
const funData = require('../../../utils/functionMethodData.js');
Page({
  data: {
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
    logistics_company: null, // 物流公司
    logistics_number: null, // 物流单号
    px2rpxWidth: '',
    px2rpxHeight: '',
    upload_file_url: URLData.upload_file_url,
    company: '', //所有物流公司
    show: '', //显示快递公司
    WLname: '请输入物流公司',
  },
  onLoad: function(options) {
    let that = this;
    // 页面初始化 options为页面跳转所带来的参数
    funData.getOrderDetail(options.order_uuid, that, (data) => {
      let order = funData.dealOrderData(data);
      // console.log(order);
      that.setData({
        order: order[0],
        hasData: true
      });
    });
  },

  onReady: function() {
    // 页面渲染完成
    let that = this;
    // 查询物流公司
    funData.getCompany(that, (data) => {
      that.setData({
        company: data
      });
    });
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
   * 发货按钮
   */
  commitSendGoods: function(e) {
    let that = this;
    wx.showModal({
      title: '发货',
      content: '是否确认发货',
      success: function(res) {
        if (res.confirm) {

          // 同步改变数据库订单状态
          // funData.updateOrderStatus(e.currentTarget.dataset.order_mainid, that.data.to_be_received, that, () => {});

          // 增加物流订单
          funData.insertTransInfo(
            e.currentTarget.dataset.order_uuid,
            that.data.logistics_number,
            that.data.logistics_company,
            e.currentTarget.dataset.order_mainid,
            that, () => {
              wx.showToast({
                title: '发货成功',
                icon: 'success',
                duration: 1000,
                success: function() {
                  wx.redirectTo({
                    url: '/pages/orderManage/orderManage'
                  })
                }
              })

            });
        } else if (res.cancel) {
          wx.showToast({
            title: '取消发货',
            icon: 'none',
            duration: 1000
          });
        }
      }
    })
  },

  /**
   * 物流公司
   */
  logisticsCompany: function(e) {
    this.setData({
      show: true, //显示快递公司
    });
  },

  /**
   * 物流公司
   */
  getLocation: function(e) {
    this.setData({
      show: false, //显示快递公司
      WLname: e.currentTarget.dataset.companyname,
      logistics_company: e.currentTarget.dataset.shortname,
    })
  },

  /**
   * 快递单号
   */
  logisticsNumber: function(e) {
    this.setData({
      logistics_number: e.detail.value
    });
  }
})