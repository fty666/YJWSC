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
    gift: '',
    gid: '',
    reductionId: '',
    px2rpxHeight: '',
    px2rpxWidth: '',
    start: '',//开始
    date: '',//结束
    stime: '',//开始具体时间
    time: '',//具体时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let shop_code = options.shop_code;
    let reductionId = options.reductionId;
    this.setData({
      shop_code: shop_code,
      reductionId: reductionId
    })
    let that = this;
    let datas = {
      reductionId: reductionId
    }
    // 获取满赠信息
    funData.getReductionInGoodsById(datas, that, (data) => {
      console.log(data)
      that.setData({
        gift: data,
        gid: data.goodsId,
        start: data.startDay,//开始
        date: data.endDay,//结束
        stime: data.startTime,//开始具体时间
        time: data.endTime,//具体时间
      });
    });
    // 获取商品
    // let shop_code = options.shop_code
    funData.getGoodsByCodeUrl(shop_code, that, (data) => {
      console.log(data)

      that.setData({
        goods: data,
      });
    });

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

  /**
   * 开始日期
   */
  bindStartChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      start: e.detail.value
    })
  },

  /**
   *具体时间 
   */
  bindTime: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      stime: e.detail.value
    })
  },

  /**
   * 日期 
   */
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 时间
   */
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {

  },

  /**
   *获取选择的商品 
   */
  radioChange: function (e) {
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      gid: e.detail.value
    })
  },


  /**
   * 添加优惠券
   */
  addCoupon: function (e) {
    let that = this;
    let coupon = e.detail.value;
    console.log(coupon)
    coupon.shopCode = that.data.shop_code;
    coupon.goodsId = that.data.gid;
    coupon.reductionId = that.data.reductionId;
    coupon.startTime = that.data.start + ' ' + that.data.stime;
    coupon.endTime = that.data.date + ' ' + that.data.time;
    funData.updateReductionInGoods(coupon, that, () => {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1000
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myGoods/chaGive/chaGive?shop_code=' + that.data.shop_code,
        })
      }, 1000);
    });
  },
})