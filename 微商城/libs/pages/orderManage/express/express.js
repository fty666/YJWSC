//获取应用实例
const app = getApp();
const util = require('../../../utils/util.js');
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const calculate = require('../../../utils/calculate.js');
const utilFunctions = require('../../../utils/functionData.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        express:'',
        express_error:'',
        express_num:'',
        express_name: '',
        express_number:'',
        px2rpxWidth: '',
        px2rpxHeight: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let oid = options.order_uuid;
        function calback(res){
            console.log(res);
            that.setData({
                express:res,
                express_num: res.Traces.length
            });
        }
        utilFunctions.getTransInfo(oid,calback,this);
        // console.log(order_uuid);
        // funData.getTransInfo(order_uuid,that,(data)=>{
        //     console.log(data);
        //     that.setData({
        //         express_name: data.shortName,
        //         express_number: data.transNO
        //     });
        //     funData.inquiryExpress(data.shortName, data.transNO,function(res){
        //         console.log(res);
        //         if(res.message == 'ok'){
        //             that.setData({
        //                 express:res.data,
        //                 express_num:res.data.length
        //             });
        //         } else {
        //             that.setData({
        //                 express_error: res.message
        //             });
        //         }
        //     });
        // });
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

    }
})