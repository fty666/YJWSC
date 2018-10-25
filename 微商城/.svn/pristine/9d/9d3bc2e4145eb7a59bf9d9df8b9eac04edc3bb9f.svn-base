const app = getApp();
const util = require('../../../utils/util.js');
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
Page({
    data: {
        order: null,
        totalIncome: 0.0,
        runningMoney: 0.0,
        publicWelfareMoney: 0.0,
        hasData: false,
        all_order: -1,       // 全部
        pending_payment: 1,  // 1未付款
        to_be_shipped: 2,    // 2付款未发货(可退货)
        to_be_received: 3,   // 3付款待收货
        to_be_evaluated: 4,  // 4收货待评价(订单完成)
        accomplish: 5,       // 5评价完成
        exchange_goods: 6,   // 6换货
        return_of_goods: 7,  // 7退货
        timer:'',
    },
    onLoad: function (options) {
        // console.log(options.order_uuid)
        let that = this;
        // 页面初始化 options为页面跳转所带来的参数
        funData.getOrderDetail(options.order_uuid, that, (data) => {
            // console.log(data);
            let order = funData.dealOrderData(data);
            // console.log(order);
            that.setData({
                order:order[0],
                hasData:true
            });
            // 未付款倒计时
            if (order[0].status == 1) {
                timer: util.mytimer('2018-06-28 12:12:12',that)
            }
        });
        

    },
    onReady: function () {
       
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
    * 发货按钮
    */
    sendGoods: function (e) {
        let that = this;
        wx.showModal({
            title: '发货',
            content: '是否确认发货',
            success: function (res) {
                if (res.confirm) {
                    wx.showToast({
                        title: '发货成功',
                        icon: 'success',
                        duration: 1000,
                        success: function () {
                            // 同步改变数据库订单状态
                            funData.updateOrderStatus(e.currentTarget.dataset.order_mainid, that.data.to_be_received, that, () => {
                                // 同步改变页面订单状态
                                that.changeOrderStatus(e.currentTarget.dataset.index, that.data.to_be_received, that);
                            });
                        }
                    });

                } else if (res.cancel) {
                    wx.showToast({
                        title: '取消发货',
                        icon: 'none',
                        duration: 1000
                    });
                }
            }
        })
    },
    // 改变状态 同步修改数据
    changeOrderStatus: function (index, mystatus, that) {
        let order = that.data.order;
        let len = order.length;
        order[index].status = mystatus;
        that.setData({
            order: order
        });
    },

    /**
    * 换货详情按钮
    */
    exchangeGoods: function (e) {
        wx.navigateTo({
            // url: '/pages/orderManage/exchangeGoods/exchangeGoods?order_uuid=' + e.currentTarget.dataset.order_mainid
            url: '/pages/orderManage/exchangeGoods/exchangeGoods'

        })
    },

    /**
     * 退货详情按钮
     */
    returnGoods: function (e) {
        wx.navigateTo({
            // url: '/pages/orderManage/exchangeGoods/exchangeGoods?order_uuid=' + e.currentTarget.dataset.order_mainid
            url: '/pages/orderManage/returnGoods/returnGoods'

        })
    },
})