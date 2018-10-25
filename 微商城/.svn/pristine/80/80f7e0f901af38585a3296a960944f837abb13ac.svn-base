// var util = require('../../../utils/util.js');
const app = getApp()
const utilFunctions = require('../../../utils/functionData.js');
const util = require('../../../utils/util.js');
const URLData = require('../../../utils/data.js');
var page = 1;
var pagesize = 10;
Page({
    data: {
        user_id: app.globalData.user_id,
        orders: null,
        glo_is_load: true,
        hasData: false,
        timer: '',
        status: 3,
        all_order: -1,       // 全部
        pending_payment: 1,  // 1未付款
        to_be_shipped: 2,    // 2付款未发货(可退货)
        to_be_received: 3,   // 3付款待收货
        to_be_evaluated: 4,  // 4收货待评价(订单完成)
        accomplish: 5,       // 5评价完成
        exchange_goods: 6,   // 6换货
        return_of_goods: 7,  // 7退货
        orderList: [],
        olists: [],
        times: "",
        active: 3,
        page: 1,
        pagesize: 10,
        upload_file_url: URLData.upload_file_url,
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        let that = this;

        // 进入页面默认状态为待收货
        utilFunctions.getOrderStatusUrl(that.data.user_id, that.data.to_be_received, page, pagesize, (data) => {
            // console.log(data);
            let orders = utilFunctions.dealOrderData(data.PageInfo.list);
            // console.log(orders);
            that.setData({
                orders: orders,
                glo_is_load: false,
                hasData: true,
            });
        }, that);
    },

    /**
     *全部 
     */
    complete: function () {
        // 页面初始化 options为页面跳转所带来的参数
        let that = this
        function microplat(data) {
            // console.log(data.PageInfo.list)
            res = utilFunctions.dealOrderData(data.PageInfo.list)
            that.setData({
                orderList: res,
                olists: res,
                active: -1
            })
            // console.log(res)
        }
        utilFunctions.getOrderUrl(that.data.page, that.data.pagesize, microplat, this)
    },

    /**
     *待发货 
     */
    send: function () {
        let send = this.data.olists
        let that = this
        that.setData({
            orderList: ""
        })
        let array2 = []
        for (let i = 0; i < send.length; i++) {
            if (send[i].status == 2) {
                array2.push(send[i])
                that.setData({
                    orderList: array2,
                    active: 2
                })
            }
        }
    },

    /**
     *待收货 
     */
    delver: function () {
        let delvers = this.data.olists
        let that = this
        let array3 = []
        // console.log(delvers)
        for (let i = 0; i < delvers.length; i++) {
            if (delvers[i].status == 3) {
                array3.push(delvers[i])
                that.setData({
                    orderList: array3,
                    active: 3
                })
            }
        }
    },

    /**
     *已完成 
     */
    assess: function () {
        let assess = this.data.olists
        let that = this
        that.setData({
            orderList: ""
        })
        let array4 = []
        for (let i = 0; i < assess.length; i++) {
            if (assess[i].status == 5 || assess[i].status == 4) {
                array4.push(assess[i])
                that.setData({
                    orderList: array4,
                    active: 4567
                })
            }
        }
    },
    // 去付款
    payOrder(e) {
        let oid = e.target.dataset.uid
        // console.log(e)
        // console.log(oid)
        wx.navigateTo({
            url: '/pages/user/opays/opays?oid=' + oid,
        })
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
     * 选择状态
     */
    selectStatus: function (e) {
        let that = this;
        let status = e.currentTarget.dataset.status;
        let hasData = true;
        utilFunctions.getOrderStatusUrl(that.data.user_id, status, page, pagesize, (data) => {
            // console.log(data);
            let orders = utilFunctions.dealOrderData(data.PageInfo.list);
            // console.log(orders);
            if (orders.length <= 0) {
                hasData = false;
            }
            that.setData({
                orders: orders,
                status: status,
                hasData: hasData,
            });
        }, that);
    },

    /**
     * 去订单详情
     */
    goOrderDetail: function (e) {
        // let order_uuid = e.currentTarget.dataset.order_uuid;
        wx.navigateTo({
            url: '/pages/user/orderDetail/orderDetail?id=' + e.currentTarget.dataset.order_uuid,
        });
    },

    /**
     * 提醒发货
     */
    remindSendGoods: function (e) {
        let order_uuid = e.currentTarget.dataset.order_uuid;
        let order_mainid = e.currentTarget.dataset.order_mainid;
        wx.showToast({
            title: '提醒发货成功',
            icon: 'success',
            duration: 1000
        })
    },

    /**
     * 确认收货
     */
    receiveGoods: function (e) {
        let that = this;
        let order_mainid = e.currentTarget.dataset.order_mainid;
        let index = e.currentTarget.dataset.index;
        let status = that.data.to_be_evaluated;
        let orders = that.data.orders;
        wx.showModal({
            title: '确认收货',
            content: '确认货物已经收到',
            success: function (res) {
                if (res.confirm) {
                    utilFunctions.updateOrderStatus(order_mainid, status, (data) => {
                        wx.showToast({
                            title: '收货成功',
                            icon: 'success',
                            duration: 1000
                        });
                        console.log(orders);
                        console.log(index);
                        orders.splice(index, 1);
                        that.setData({
                            orders: orders
                        });
                    }, that);

                } else if (res.cancel) {

                }
            }
        })

    },

    /**
     * 去评价
     */
    goComment: function (e) {
        wx.navigateTo({
            url: '/pages/user/comment/comment?order_uuid=' + e.currentTarget.dataset.order_uuid
        })

    },

    /**
     * 申请售后
     */
    afterSale: function (e) {
        let order_uuid = e.currentTarget.dataset.order_uuid;
        wx.navigateTo({
            url: '/pages/user/orderDetail/orderDetail?id=' + order_uuid
        })
    },

    /**
     * 查看物流
     */
    showExpress: function (e) {
        wx.navigateTo({
            url: '/pages/orderManage/express/express?order_uuid=' + e.currentTarget.dataset.order_uuid,
        })
    },

    /**
     * 删除订单
     */
    deleteOrder: function (e) {
        let order_mainid = e.currentTarget.dataset.order_mainid;
        wx.showModal({
            title: '提示',
            content: '删除订单不可恢复',
            success: function (res) {
                if (res.confirm) {
                    utilFunctions.deleteOrder(order_mainid, () => {
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            duration: 1000
                        });
                    }, this);
                } else if (res.cancel) {
                }
            }
        })

    },

    /**
     *  滚动到底部 / 右边，会触发 scrolltolower 事件
     */
    scrollToLower: function () {
        pagesize += 20;
        let that = this
        function microplat(data) {
            // console.log(data.PageInfo.list)
            res = utilFunctions.dealOrderData(data.PageInfo.list)
            that.setData({

            })
            // console.log(res)
        }
        utilFunctions.getOrderUrl(that.data.page, that.data.pagesize, microplat, this)
    },


})
