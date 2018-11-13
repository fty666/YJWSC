// pages/apply/auditing/auditing.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        status:null,
        px2rpxWidth: '',
        px2rpxHeight: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取商店的状态 
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
     * 前去购物
     */
    goShopping:function(){
        wx.redirectTo({
            url: '',
        });
    }
})