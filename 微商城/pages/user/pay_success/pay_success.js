const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        address:{},
        totalPrice:'',
        px2rpxWidth: '',
        px2rpxHeight: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let addr_id = options.addid;
        let totalPrice = options.totalPrice;
        // let detail_addr = data.area_path + '' + data.area_detail;
        utilFunctions.getAddrById((data) => { 
            console.log(data);
            that.setData({
                address: data,
                totalPrice:totalPrice
            });
        }, addr_id, that);
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
     * 返回首页
     */
    backFirstPage: function () {
        wx.redirectTo({
            url: '/pages/shop/mall/mall'
        })
    },

    /**
     * 查看订单
     */
    viewOrder: function () {
        wx.redirectTo({
            url: '/pages/user/order/order'
        })
    }
})