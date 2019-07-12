const app = getApp()
const utilFunctions = require('../../utils/functionData.js');
const URLData = require('../../utils/data.js');
const calculate = require('../../utils/calculate.js');
const util = require('../../utils/util.js');
Component({
  /**
   * 组件的初始数据
   */
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
  created: function() {
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
    //查询是否有优惠卷 
    function able(res) {
      let coupon = res.PageInfo.list;
      let len = coupon.length;
      if (len == 0) {
        that.triggerEvent('onMyEvent', '');
        wx.showToast({
          title: '暂无可用优惠券',
          icon: 'none'
        })
        return;
      }
      for (let i = 0; i < len; i++) {
        coupon[i].dealendTime = util.formatSmartTime(coupon[i].endTime);
      }
      that.setData({
        quan_list: coupon,
        glo_is_load: false,
      });
    }
    let uid = app.globalData.user_id;
    utilFunctions.getUserCoupon(uid, app.globalData.couponCode, that.data.payPrice, that.data.page, that.data.pageSize, able, this);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 使用优惠券
    useCoupon(e) {
      if (e.currentTarget.dataset.res.conditions > app.globalData.prcirCounp) {
        wx.showToast({
          title: '该优惠券不满足',
          icon: 'none'
        });
        this.triggerEvent('onMyEvent', '');
      } else if (e.currentTarget.dataset.res.conditions==undefined){
        wx.showToast({
          title: '取消使用优惠券',
          icon: 'none'
        });
        this.triggerEvent('onMyEvent', '');
      } else {
        this.triggerEvent('onMyEvent', e.currentTarget.dataset.res);
      }
    }
  }
})