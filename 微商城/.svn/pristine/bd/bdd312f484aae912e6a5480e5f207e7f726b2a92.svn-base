//获取应用实例
var app = getApp();
const urlData = require('../../../../utils/urlData.js');
const funData = require('../../../../utils/functionMethodData.js');
const util = require('../../../../utils/util.js');
var page = 1;
var pageSize = 20;
Page({
    data: {
        shopCode: app.globalData.shopCode,
        withdraw: null,
        status:'', // 1提现完成,0提现中
        scrollTop:0,
        glo_is_load:true,
        floorstatus: false,

    },

    onLoad: function (options) {
        let that = this;
        // 获取提现明细
        that.queryWithdraw('' , page, pageSize);
        // funData.getWithdrawal(that.data.shopCode, '', page, pageSize, that, (data) => {
        //     console.log(data);
        //     let withdraw = data.PageInfo.list;
        //     // 用*替换银行卡号
        //     let len = withdraw.length;
        //     for(let i = 0; i < len; i++){
        //         withdraw[i].card_no = util.bankCardByStar(withdraw[i].card_no);
        //     }
        //     that.setData({
        //         withdraw: withdraw,
        //         glo_is_load:false
        //     });
        // });
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },

    /**
     * 点击导航
     */
    selectTab:function(e){
        let that = this;
        let status = e.currentTarget.dataset.status;
        if(status == '-1'){
            status = '';
        }
        console.log(status);
        pageSize = 20;
        if(status == ''){
            // 全部
            that.queryWithdraw('', page, pageSize);
            that.setData({
                status: status
            });
        } else if (status == '1'){
            // 提完成
            that.queryWithdraw(1, page, pageSize);
            that.setData({
                status: status
            });
        } else if(status == '0'){
            // 提现中
            that.queryWithdraw(0, page, pageSize);
            that.setData({
                status: status
            });
        }
        that.setData({
            floorstatus:false
        });
    },

    /**
   * 返回顶部
   */
    goTop: function (e) {
        this.setData({
            scrollTop: 0
        })
    },

    /**
     * 滚动到底部/右边，会触发 scrolltolower 事件
     */
    scrollToLower:function(){
        let that = this;
        pageSize += 20;
        that.queryWithdraw(that.data.status, page, pageSize);
        that.setData({
            floorstatus:true
        });

    },

    /**
     * 获取提现明细
     */
    queryWithdraw: function (status,page, pageSize){
        let that = this;
        // 获取提现明细
        funData.getWithdrawal(that.data.shopCode, status, page, pageSize, that, (data) => {
            console.log(data);
            let withdraw = data.PageInfo.list;
            // 用*替换银行卡号
            let len = withdraw.length;
            for (let i = 0; i < len; i++) {
                withdraw[i].card_no = util.bankCardByStar(withdraw[i].card_no);
            }
            that.setData({
                withdraw: withdraw,
                glo_is_load:false
            });
        });
    }

});
