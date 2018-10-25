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
        date: '',
        time: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        // 获取店铺信息
        // setTimeout(function () {
        //     funData.getShopCode(that.globalData.user_id, that, (data) => {
        //         // 获取店铺里
        //         that.setData({
        //             shop_code: data.shop_code,
        //         });
        //     });
        // }, 1000);

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        funData.getShopCode(that.globalData.user_id, that, (data) => {
            // 获取店铺里
            that.setData({
                shop_code: data.shop_code,
            });
        });
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
     * 添加优惠券
     */
    addCoupon: function (e) {
        let that = this;
        let coupon = e.detail.value;
        // 检测优惠后金额
        if (!util.checkReg(4, coupon.couponPrice)) {
            wx.showToast({
                title: '优惠金额不正确',
                icon: 'none',
                duration: 1000
            });
        }

        // 检测满足金额
        if (!util.checkReg(4, coupon.conditions)) {
            wx.showToast({
                title: '满金额不正确',
                icon: 'none',
                duration: 1000
            });
        }

        coupon.endTime = that.data.date + ' ' + that.data.time;
        coupon.shop_code = that.data.shop_code;
        coupon.couponType = 1;
        coupon.couponDetails = '';
        funData.insertCoupon(coupon, that, () => {
            wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 1000
            });
            setTimeout(function () {
                wx.redirectTo({
                    url: '/pages/myGoods/CouponList/CouponList',
                })
            }, 1000);
        });
    },
})