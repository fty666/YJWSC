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
    that.setData({
      shop_code: options.shop_code
    })
    let datas = {
      shop_code: options.shop_code
    };
    funData.getReductionInGoods(datas, that, (res) => {
      that.setData({
        coupon: res
      })
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
   * 删除
   */
  delCoupon: function(e) {
    // console.log(e)
    let that = this;
    let couponId = e.currentTarget.dataset.couponid;
    let shopcode = e.currentTarget.dataset.shopcode;
    let index = e.currentTarget.dataset.index;
    let coupon = that.data.coupon;
    let start = 1;
    // console.log(couponId)
    wx.showModal({
      title: '删除操作不可恢复',
      content: '是否确定删除',
      success: function(res) {
        if (res.confirm) {
          let datas = {
            shop_code: shopcode,
            reductionId: couponId,
          }
          funData.deleteReduction(datas, that, () => {
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
  huo() {
    let that = this;
    let datas = {
      shop_code: that.data.shop_code
    };
    funData.getReductionInGoods(datas, that, (res) => {
      that.setData({
        coupon: res
      })
    });
  },
  // 下架
  sold(e) {
    let that = this;
    let couponId = e.currentTarget.dataset.couponid;
    let index = e.currentTarget.dataset.index;
    let coupon = that.data.coupon;
    let shopcode = '';
    if (coupon[index].flag == 0) {
      wx.showToast({
        title: '已下架满赠',
        icon:'none'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否要下架',
        success: function(res) {
          if (res.confirm) {
            funData.getupdateTime(couponId, that, () => {
              wx.showToast({
                title: '下架成功',
                icon: 'success',
                duration: 1000
              });
              that.huo();
            });
          } else if (res.cancel) {}
        }
      })
    }

  },
  /**
   *修改 
   */
  updtaCoupon: function(e) {
    let that = this;
    let couponId = e.currentTarget.dataset.couponid;
    let shopcode = e.currentTarget.dataset.shopcode;
    let index = e.currentTarget.dataset.index;
    let coupon = that.data.coupon[index];
    let start = 1;
    wx.navigateTo({
      url: '/pages/myGoods/updataGive/updataGive?reductionId=' + couponId + '&shop_code=' + shopcode,
    })
  },

  /**
   * 添加
   */
  addCoupon: function() {
    let that = this;
    wx.navigateTo({
      url: '/pages/myGoods/addGive/addGive?shop_code=' + that.data.shop_code,
    })
  },
})