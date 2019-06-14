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
    let that = this;
    funData.getCoupon(app.globalData.user_id, options.shop_code, page, pageSize, that, (res) => {
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
    console.log(e)
    let that = this;
    let couponId = e.currentTarget.dataset.couponid;
    let index = e.currentTarget.dataset.index;
    let coupon = that.data.coupon;
    let start = 1;
    wx.showModal({
      title: '删除操作不可恢复',
      content: '是否确定删除',
      success: function(res) {
        if (res.confirm) {
          funData.deleteCoupon(couponId, start, that, () => {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            });
            coupon.splice(index, 1);
            that.setData({
              coupon: coupon
            });
          });
        } else if (res.cancel) {}
      }
    })

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

  // 滚动加载
  scrollToLower: function() {
    pageSize += 10;
    let that = this;
    funData.getCoupon(app.globalData.user_id, options.shop_code, page, pageSize, that, (res) => {
      that.setData({
        coupon: res.PageInfo.list,
        shop_code: options.shop_code
      });
    });
  }
})