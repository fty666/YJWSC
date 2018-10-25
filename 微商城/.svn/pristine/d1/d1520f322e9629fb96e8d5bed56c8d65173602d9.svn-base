const app = getApp();
const util = require('../../../utils/util.js');
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const calculate = require('../../../utils/calculate.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        returnGoods:null,
        aliyunUrl: urlData.uploadFileUrl,
        back_status:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        console.log(options.order_uuid);
        funData.getGoodBack(options.order_uuid, that, (data) => {
            console.log(data);
            let returnGoods = data;
            let goods = returnGoods.goods;
            let len = goods.length;
            let  allPrice = 0;
            for(let i = 0; i < len; i++){
                goods[i].goodsTotalPrice = calculate.calcMul(goods[i].goods_price,goods[i].num);
                allPrice = calculate.calcAdd(allPrice, goods[i].goodsTotalPrice);
            }
            returnGoods.allPrice = allPrice;
            that.setData({
                returnGoods: returnGoods,
                back_status: data.goods[0].back_status
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
     * 同意退货
     */
    agreeReturn:function(){
        let that = this;
        wx.showModal({
            title: '同意退货',
            content: '确定同意退货',
            success: function (res) {
                if (res.confirm) {
                    funData.updateBackStatus(that.data.returnGoods, that, () => {
                        wx.showToast({
                            title: '同意退货',
                            icon: 'success',
                            duration: 1000
                        });
                        that.setData({
                            back_status:3
                        });
                    });
                } else if (res.cancel) {
                    
                }
            }
        })
        
    },

    /**
     * 不同意退货
     */
    refuseReturn:function(){
        
    }
})