var app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const util = require('../../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
         bank:null,
         glo_is_load:true,
         hasData:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        setTimeout(function(){
            funData.getShopCode(app.globalData.user_id, that, (data) => {
                // console.log(data);
                // that.globalData.shopCode = data.shop_code;
                funData.getCardByCode(data.shop_code, that, (data) => {
                    // console.log(data);
                    let len = data.length;
                    if (len <= 0) {
                        that.setData({
                            hasData: false,
                            glo_is_load: false,
                        });
                    } else {
                        for (let i = 0; i < len; i++) {
                            data[i].card_no = util.bankCardByStar(data[i].card_no);
                        }
                        that.setData({
                            card: data,
                            hasData: true,
                            glo_is_load: false,
                        });

                    }
                });
            });
            
        },1000);
        
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
        this.onLoad();
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
     * 选择银行卡
     */
    selectBankCard:function(e){
        let prevUrl = util.getPrevPageUrl();
        // pages/myself/myMoney/myMoney
        // console.log(prevUrl);
        wx.navigateTo({
            url: '/' + util.getPrevPageUrl() + '?cid=' + e.currentTarget.dataset.cid
        })

    },

    /**
     * 添加银行卡
     */
    addCard:function(){
        wx.navigateTo({
            url: '/pages/bankCard/addBankCard/addBankCard'
        })
    },

    /**
     * 设置默认
     */
    setCardDefault:function(e){
        let that = this;
        let cid = e.currentTarget.dataset.cid;
        let card = that.data.card;
        let len  = card.length;
        for(let i = 0; i < len; i++){
            if(card[i].cid == cid){
                card[i].is_default = 1;
            } else {
                card[i].is_default = 0;
            }
        }
        funData.updateCardDefault(cid,that,()=>{
            that.setData({
                card:card
            });
            wx.showToast({
                title: '设置默认成功',
                icon: 'success',
                duration: 1000
            });
        }); 
    },

    /**
     * 解除绑定
     */
    unbindBankCard:function(e){
        let that = this;
        let cid = e.currentTarget.dataset.cid;
        funData.deleteCard(cid,that,()=>{
            wx.showToast({
                title: '解除绑定成功',
                icon: 'success',
                duration: 1000
            });
        });
    },
})