const app = getApp()
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
const calculate = require('../../../utils/calculate.js');
const util = require('../../../utils/util.js');
Page({
  data: {
    quan_list: [],
    glo_is_load: true,
    page: 1,
    pageSize: 10,
    shop_code: "",
    payPrice: "",
    px2rpxWidth: '',
    px2rpxHeight: '',
  },
  onLoad: function (options) {
    let that = this
    // console.log(options)
    let uid = options.uid;
    if (options.shop_code) {
      that.setData({
        shop_code: options.shop_code,
      })
    }
    if (options.payPrice) {
      that.setData({
        payPrice: options.payPrice,
      })
    }

    //查询是否有优惠卷 
    function able(res) {
      console.log(res)
      let coupon = res.PageInfo.list;
      let len = coupon.length;
      for (let i = 0; i < len; i++) {
        coupon[i].dealendTime = util.formatSmartTime(coupon[i].endTime);
      }
      that.setData({
        quan_list: coupon,
        glo_is_load: false,
      });
    }
    utilFunctions.getUserCoupon(uid, that.data.shop_code, that.data.payPrice, that.data.page, that.data.pageSize, able, this);
  },

  /**
   * 点击优惠券使用
   */
  useCoupon: function (e) {
    let that = this;
    let couponId = e.currentTarget.dataset.couponid;
    let index = e.currentTarget.dataset.index;
    let fulls = e.currentTarget.dataset.full;
    let coupon = that.data.quan_list;
    let times = new Date(coupon[index].endTime) - new Date().getTime();
    // console.log(coupon)
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    //跳转店铺
    let groupid = e.currentTarget.dataset.group_id;
    let shop_code = e.currentTarget.dataset.shop_code;
    if (groupid == 1) {
      wx.navigateTo({
        url: '/pages/takeout/shopDetails/shopDetails?shop_code=' + e.currentTarget.dataset.shop_code
      })
    } else {
      wx.navigateTo({
        url: '/pages/shop/shoplist/shoplist?groupid=' + groupid + '&shop_code=' + shop_code
      })
    }

    // if (coupon[index].sta == '1' && times > 0) {
    //   // 优惠券能使用
    //   if (util.getPrevPageUrl() == 'pages/takeout/pay/pay' || util.getPrevPageUrl() == 'pages/shop/onepay/onepay' || util.getPrevPageUrl() == 'pages/shop/orderpay/index') {
    //     console.log(fulls)
    //     prevPage.setData({
    //       coupon: coupon[index],
    //       couponPrice: fulls
    //     });
    //     wx.navigateBack();
    //   } else {
    //     wx.navigateTo({
    //       url: '/' + util.getPrevPageUrl() + '?couponId=' + couponId + '&couponPrice=' + fulls,
    //     });
    //   }
    // } else {
    //   wx.showToast({
    //     title: '此优惠券不可用',
    //     icon: 'none',
    //     duration: 1000
    //   });
    // }

  },

  //下拉刷新
  onPullDownRefresh: function () {
    // var that = this
    // _function.getShopUserQuanlist(wx.getStorageSync("utoken"), -1, that.initgetShopUserQuanlistData, that);
    // setTimeout(() => {
    //     wx.stopPullDownRefresh()
    // }, 1000)
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

})