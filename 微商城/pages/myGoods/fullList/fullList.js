const app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const utilFunctions = require('../../../utils/functionData.js');
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
  onLoad: function (options) {
    let that = this;
    // console.log(res);
    that.setData({
      shop_code: options.shopcode
    })
    function calback(res) {
      console.log(res)
      that.setData({
        coupon: res,
      })
    }
    console.log(options)
    utilFunctions.getReductionUrl(options.shopcode, calback, this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  /**
   * 修改
   */
  editCoupon: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/myGoods/updataFull/updataFull?couponId=' + e.currentTarget.dataset.couponid
    })
  },

  /**
   * 删除
   */
  delCoupon: function (e) {
    console.log(e)
    let that = this;
    let couponId = e.currentTarget.dataset.couponid;
    let index = e.currentTarget.dataset.index;
    let coupon = that.data.coupon;
    let shopcode = '';
    console.log(couponId)
    wx.showModal({
      title: '删除操作不可恢复',
      content: '是否确定删除',
      success: function (res) {
        if (res.confirm) {
          utilFunctions.deleteReductionUrl(shopcode, couponId, that, () => {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            });

            that.huo();
          });
        } else if (res.cancel) {
        }
      }
    })

  },

  // 获取数据
  huo: function () {
    let that=this;
    function calbacks(res) {
      console.log(res)
      that.setData({
        coupon: res,
      })
    }
    utilFunctions.getReductionUrl(that.data.shop_code,calbacks, that);
  },

  /**
   * 添加
   */
  addCoupon: function () {
    let that = this;
    wx.navigateTo({
      url: '/pages/myGoods/addFull/addFull?shop_code=' + that.data.shop_code,
    })
  },

})