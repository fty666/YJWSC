const app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coupon: null,
        shop_code: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        // console.log(res);
        funData.getCoupon(options.shop_code, that, (data) => {
            console.log(data);
            that.setData({
                coupon: data,
                shop_code: options.shop_code
            });
        });
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
    // editCoupon:function(e){
    //     wx.navigateTo({
    //         url: '/pages/myGoods/editCoupon/editCoupon?couponId=' + e.currentTarget.dataset.couponId
    //     })
    // },

    /**
     * 删除
     */
    delCoupon: function (e) {
        console.log(e)
        let that = this;
        let couponId = e.currentTarget.dataset.couponid;
        let index = e.currentTarget.dataset.index;
        let coupon = that.data.coupon;

        console.log(couponId)
        wx.showModal({
            title: '删除操作不可恢复',
            content: '是否确定删除',
            success: function (res) {
                if (res.confirm) {
                    funData.deleteCoupon(couponId, that, () => {
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
                } else if (res.cancel) {
                }
            }
        })

    },

    /**
     * 添加
     */
    addCoupon: function () {
        let that = this;
        wx.navigateTo({
            url: '/pages/myGoods/addCoupon/addCoupon?shop_code=' + that.data.shop_code,
        })
    },

})