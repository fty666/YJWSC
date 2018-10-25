// var util = require('../../../utils/util.js');
var app = getApp();
const funData = require('../../../utils/functionMethodData.js');
const util = require('../../../utils/util.js');
var page = 1;
var pageSize = 20;
Page({
    data: {
        coupon: '',
        px2rpxWidth: '',
        px2rpxHeight: '',
    },
    onLoad: function (options) {
        let that = this;
        funData.getUserCoupon(app.globalData.user_id, page, pageSize, that, (data) => {
            // console.log(data);
            let len = data.length;
            for (let i = 0; i < len; i++) {
                data[i].endTime = util.formatSmartTime(data[i].endTime);
            }
            that.setData({
                coupon: data
            });
        });
    },
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
    onShow: function () {

    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭
    },

    /**
     * 领券中心
     */
    goGetCoupon: function () {
        wx.navigateTo({
            url: '/pages/user/coupon/getCoupon/getCoupon',
        })
    },


})