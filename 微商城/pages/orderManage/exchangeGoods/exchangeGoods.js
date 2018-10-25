const app = getApp();
const util = require('../../../utils/util.js');
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order_uuid:null,
        exchange:null,
        exchage_status: null,
        px2rpxWidth: '',
        px2rpxHeight: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        funData.getGoodBack(options.order_uuid, that,(data)=>{
            console.log(data);
            that.setData({
                order_uuid: options.order_uuid,
                exchage_status: 2
            });
            // let exchange = Object.assign(data[0], data[1]);
            // exchange.createTime = util.formatDate(exchange.createTime, 'YY-MM-DD hh:mm:ss');
            // exchange.replyTime = util.formatDate(exchange.replyTime, 'YY-MM-DD hh:mm:ss');
            // console.log(exchange)
            that.setData({
                exchange: data
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
     * 同意换货
     */
    agreeExchange:function(){
        let that = this;
        wx.showModal({
            title: '换货',
            content: '是否同意换货',
            success: function (res) {
                if (res.confirm) {
                    funData.updateBackStatus(that.data.order_uuid,that,()=>{
                        wx.showToast({
                            title: '同意换货成功',
                            icon: 'success',
                            duration: 1000
                        });
                        that.setData({
                            exchage_status:3
                        });
                    });
                } else if (res.cancel) {
                    wx.showToast({
                        title: '拒绝换货',
                        icon: 'none',
                        duration: 1000
                    })
                }
            }
        })
    },

})