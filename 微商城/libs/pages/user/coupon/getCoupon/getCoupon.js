const funData = require('../../../../utils/functionMethodData.js');
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coupon: null,
      px2rpxWidth: '',
      px2rpxHeight: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        funData.getCoupon('', this, (data) => {
            // console.log(data);
            let len = data.length;
            for (let i = 0; i < len; i++) {
                data[i].endTime = util.formatSmartTime(data[i].endTime);
            }
            // console.log(data);
            that.setData({
                coupon: data
            });
        });
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
     * 领取优惠券
     */
    getCoupon: function (e) {
        let that = this;
        let couponId = e.currentTarget.dataset.couponid;
        // 领取优惠券
        funData.getUserCoupon(getApp().globalData.user_id, that, (data) => {
            console.log(data);
            let len = data.length;
            for (let i = 0; i < len; i++) {
                if (data[i].couponId == couponId) {
                    wx.showToast({
                        title: '你已经领取该券',
                        icon: 'none',
                        duration: 1000
                    });
                    return;
                }
            }
            funData.insertUC(getApp().globalData.user_id, couponId, that, () => {
                wx.showToast({
                    title: '领取成功',
                    icon: 'success',
                    duration: 1000
                })
            });

        });
    },
})