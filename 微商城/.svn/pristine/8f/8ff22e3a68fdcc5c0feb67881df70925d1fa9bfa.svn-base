var app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const util = require('../../../utils/util.js'); 
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopInfo: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        // 查询商家信息
        funData.getShop(app.globalData.shopCode, that, (data) => {
            // console.log(data.PageInfo.list[0]);
            that.setData({
                shopInfo: data.PageInfo.list[0],
                hasData: true
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
     * 修改商家信息
     */
    editShopInfo:function(e){
        let that = this;
        let val = e.detail.value;
        if (!util.checkReg(1,val.mobile)){
            wx.showToast({
                title: '请填写正确信息',
                icon: 'none',
                duration: 2000
            })
            return;
        } else {
            funData.updateInfo(app.globalData.shopCode, val.ShopName, val.shop_addr, val.mobile,that, ()=>{
                wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 1000,
                    success:function(){
                        wx.redirectTo({
                            url: '/pages/myself/myself'
                        })
                    }
                });

            })
        }
           
    },
})