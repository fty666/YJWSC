const app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
// 优惠券页数
var page = 1;
var pageSize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon: null,
    shop_code: '',
    px2rpxWidth: '',
    px2rpxHeight: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    let that = this;
    // console.log(res);
    funData.getCoupon(app.globalData.user_id,options.shop_code, page, pageSize, that, (res) => {
      // console.log(res);
      that.setData({
        coupon: res.PageInfo.list,
        shop_code: options.shop_code
      });
    });
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
   * 删除
   */
  delCoupon: function(e) {
    // console.log(e)
    let that = this;
    let couponId = e.currentTarget.dataset.couponid;
    let myuser_id = app.globalData.user_id;
    funData.insertUC(myuser_id, couponId, that, () => {
      wx.showToast({
        title: '领取成功',
        icon: 'success',
        duration: 1000
      });
    });
  },

  /**
   * 添加
   */
  addCoupon: function() {
    let that = this;
    wx.navigateTo({
      url: '/pages/myGoods/addCoupon/addCoupon?shop_code=' + that.data.shop_code,
    })
  },

})