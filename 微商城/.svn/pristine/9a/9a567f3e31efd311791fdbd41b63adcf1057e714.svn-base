// mallcart.js
const app = getApp();
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
Page({

    data: {
        this_order_id: 0,
        // 商品总价
        sums: "",
        // 商品信息
        orderinfo: [],
        // 收货地址
        address: [],
        // 传过来的ID
        addId: "",
        // 支付成功的状态2
        status:2,
        submitIsLoading: false,
        buttonIsDisabled: false,
        glo_is_load: true
    },


    /**
     *页面监听数据加载事件，获取订单详情
     */
    onLoad: function (options) {
        console.log(options)
        //订单号获取订单信息
        // var orderId = wx.getStorageSync('oid')
        let orderId = options.oid;
        // 传过来的收货地址ID
        let addids = options.addressId
        this.setData({
            addId: addids
        })
        if (addids) {
            this.oneadd()
        } else {
            this.moadd()
        }
        let that = this

        function odetail(res) {
            console.log(res)
            res = utilFunctions.dealOrderData(res)
            console.log(res)
            that.setData({
                orderinfo: res[0],
                sums: res[0].sumPrice
            })
        }

        utilFunctions.getOrderDetail(orderId, odetail, this)

    },

    /**
     *查看默认地址
     **/
    moadd: function () {
        // 收货地址
        function maddress(res) {
            console.log(res)
            this.setData({
                address: res,
                addid: res.id
            })
        }

        utilFunctions.getAddrByDefault(maddress, this)

    },


    /**
     * 查看单个地址
     */
    oneadd: function () {
        let that = this

        function addinfo(res) {
            console.log(res)
            this.setData({
                address: res,
                addid: res.id
            })
        }

        utilFunctions.getAddrById(addinfo, that.data.addId, this)
    },


    /**
     *修改默认地址
     */
    aupdata: function () {
        wx: wx.navigateTo({
            url: '/pages/user/address/address'
        })
    },

    //开始支付
    pay_confirmOrder: function () {
        var that = this
        that.setData({
            buttonIsDisabled: true,
            submitIsLoading: true
        })

        // 支付成功修改订单状态
        utilFunctions.updateOrderStatus(that.data.orderinfo.order_mainid, that.data.status, () => {
            wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1000
            })

            setTimeout(function () {
                wx.redirectTo({
                    url: '/pages/user/pay_success/pay_success?addid=' + that.data.orderinfo.addr_id + '&totalPrice=' + that.data.orderinfo.sumPrice
                })
            }, 1000);
        }, that);

        // _function.makeOrderPayData(wx.getStorageSync("utoken"), that.data.this_order_id, that.initMakeOrderPayData, this)

    },



    initgetOrderInfoData: function (data) {
        var that = this
        if (data.code == 1) {
            that.setData({
                oinfo: data.info,
                glo_is_load: false
            })
        } else if (data.code == 2) {
            wx.showModal({
                title: '提示',
                content: '登陆超时，将重新获取用户信息',
                showCancel: false,
                success: function (res) {
                    app.getNewToken(function (token) {
                        that.setData({
                            local_global_token: token
                        })
                        _function.getOrderInfo(wx.getStorageSync("utoken"), that.data.this_order_id, that.initgetOrderInfoData, this)
                    })
                }
            })
        } else if (data.code == 5) {
            wx.showModal({
                title: '提示',
                content: data.info,
                showCancel: false
            })
            return false;
        }
    },

    initMakeOrderPayData: function (data) {
        var that = this
        that.setData({
            buttonIsDisabled: false,
            submitIsLoading: false
        })
        if (data.code == 1) {
            wx.requestPayment({
                'timeStamp': data.info.timeStamp,
                'nonceStr': data.info.nonceStr,
                'package': data.info.package,
                'signType': 'MD5',
                'paySign': data.info.paySign,
                'success': function (res) {

                },
                'fail': function (res) {

                },
                'complete': function () {
                    that.setData({
                        disabled: false
                    })
                    //支付完成 跳转订单列表
                    wx.redirectTo({
                        url: '../../user/order/list/index'
                    })
                }
            })
        } else if (data.code == 2) {
            wx.showModal({
                title: '提示',
                content: '登陆超时，将重新获取用户信息',
                showCancel: false,
                success: function (res) {
                    app.getNewToken(function (token) {
                        that.setData({
                            local_global_token: token
                        })
                        _function.getOrderInfo(wx.getStorageSync("utoken"), that.data.this_order_id, that.initgetOrderInfoData, this)
                    })
                }
            })
        } else if (data.code == 5) {
            wx.showModal({
                title: '提示',
                content: data.info,
                showCancel: false
            })
            return false;
        }
    }
})