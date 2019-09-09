const app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const functionData = require('../../../utils/functionData.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_code: '',
    fulls: '',
    start: '', //开始
    date: '', //结束
    stime: '', //开始具体时间
    time: '', //具体时间
    px2rpxWidth: '',
    px2rpxHeight: '',
    reductionId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let datas = JSON.parse(options.datas);
    console.log(datas);
    let couponid = datas.reductionId;
    that.setData({
      reductionId: couponid,
      fulls: datas,
      start: datas.startTime.slice(0,10), //开始
      date: datas.endTime.slice(0,10), //结束
      stime: datas.startTime.slice(10), //开始具体时间
      time: datas.endTime.slice(10), //具体时间
    })
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
   * 开始日期
   */
  bindStartChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      start: e.detail.value
    })
  },

  /**
   *具体时间 
   */
  bindTime: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      stime: e.detail.value
    })
  },

  /**
   * 日期 
   */
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 时间
   */
  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },

  /**
   * 添加满减
   */
  addCoupon: function(e) {
    let that = this;
    let coupon = e.detail.value;
    // 检测优惠后金额
    if (!util.checkReg(4, coupon.reductionPrice)) {
      wx.showToast({
        title: '优惠金额不正确',
        icon: 'none',
        duration: 1000
      });
    }

    // 检测满足金额
    if (!util.checkReg(4, coupon.full)) {
      wx.showToast({
        title: '满金额不正确',
        icon: 'none',
        duration: 1000
      });
    }
    //判断优惠金额小于满足金额
    if (parseInt(coupon.couponPrice) > parseInt(coupon.conditions)) {
      wx.showToast({
        title: '优惠大于满足金额,重新添加',
        icon: 'none',
      })
      return false;
    }
    coupon.endTime = that.data.date + ' ' + that.data.time;
    coupon.startTime = that.data.start + ' ' + that.data.stime;
    coupon.reductionId = that.data.reductionId;
    console.log(that.data.reductionId)
    functionData.updateReduction(coupon, that, () => {
      wx.showModal({
        title: '提示',
        content: '添加满减成功',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/myself/myself',
            })
          } else if (res.cancel) {
            wx.navigateTo({
              url: '/pages/myself/myself',
            })
          }
        }
      })
    });
  },
})