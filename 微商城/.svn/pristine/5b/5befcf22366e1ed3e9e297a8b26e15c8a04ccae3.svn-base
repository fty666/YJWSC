// var util = require('../../../utils/util.js');
var app = getApp();
const funData = require('../../../utils/functionMethodData.js');
const util = require('../../../utils/util.js');
Page({
    data: {
        coupon: '',
    },
    onLoad: function (options) {
        let that = this;
        funData.getUserCoupon(app.globalData.user_id, that, (data) => {
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