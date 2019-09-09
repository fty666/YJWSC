const app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_code: '',
    goods: '',
    gid: '',
    start: '', //开始
    date: '', //结束
    stime: '', //开始具体时间
    time: '', //具体时间
    px2rpxWidth: '',
    px2rpxHeight: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let shop_code = options.shop_code;
    this.setData({
      shop_code: options.shop_code
    })
    let that = this;
    // 获取店铺信息
    funData.getGoodsByCodeUrl(shop_code, that, (data) => {
      // 获取店铺里
      that.setData({
        goods: data,
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
   * 开始日期
   */
  bindStartChange: function(e) {
    this.setData({
      start: e.detail.value
    })
  },

  /**
   *具体时间 
   */
  bindTime: function(e) {
    this.setData({
      stime: e.detail.value
    })
  },

  /**
   * 日期 
   */
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 时间
   */
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  /**
   *获取选择的商品 
   */
  radioChange: function(e) {
    this.setData({
      gid: e.detail.value
    })
  },


  /**
   * 添加满赠
   */
  addCoupon: function(e) {
    let that = this;
    let coupon = e.detail.value;
    coupon.shopCode = that.data.shop_code;
    coupon.goodsId = that.data.gid;
    coupon.startTime = that.data.start + ' ' + that.data.stime;
    coupon.endTime = that.data.date + ' ' + that.data.time;
    // 检测时间前后
    if (util.CompareDate(that.data.start, that.data.date) == true) {
      wx.showToast({
        title: '时间填写不正确',
        icon: 'none',
      })
      return false;
    } else {
      if (that.data.start == that.data.date) {
        if (util.CompareHour(that.data.stime, that.data.time) == false) {
          wx.showToast({
            title: '时间填写不正确',
            icon: 'none',
          })
          return false;
        }
      }
    }
    funData.insertReductionInGoods(coupon, that, () => {
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1000
      });
      wx.navigateTo({
        url: '/pages/myGoods/chaGive/chaGive?shop_code=' + that.data.shop_code,
      })
    });
  },
})