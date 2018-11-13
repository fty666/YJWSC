const app = getApp()
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
const calculate = require('../../../utils/calculate.js');
const util = require('../../../utils/util.js');
const weixin = require('../../../utils/weixin.js');
const funDta = require('../../../utils/functionMethodData.js');

Page({

    data: {
        this_order_id: 0,
        // 收货地址
        address: [],
        // 传过来的ID
        addId: "",
        // 支付成功的状态2
        status: 2,
        submitIsLoading: false,
        buttonIsDisabled: false,
        glo_is_load: true,
        weChat: '',
        px2rpxWidth: '',
        px2rpxHeight: '',
        // 待付款订单
        orderinfo: [],
        // 订单号
        relevance_uuid: '',
        // 商品总价
        sums: "",
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
        let that = this;
        let carts = "";
        // function odetail(res) {
        //     console.log(res)
        //     res = utilFunctions.dealOrderData(res);
        //     console.log(res)
        //     carts = res;
        //     // console.log(res)
        //     that.setData({
        //         orderinfo: res[0],
        //         sums: res[0].sumPrice
        //     })
        // };
        // utilFunctions.getOrderDetail(orderId, odetail, this);

        // 查询付款信息
        let uuid = options.oid;
        function calback(res) {
            console.log(res);
            that.setData({
                relevance_uuid: res.relevance_uuid,
                orderinfo: res.order,
                sums: res.money
            })
        }
        funDta.getPayOrder(uuid, that, calback)
    },


    onReady: function () {
        // 获取用户信息
        funDta.getUser(getApp().globalData.user_id, this, (res) => {
            console.log(res)
            this.setData({
                weChat: res.weChat
            });
        });
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
        let orders = that.data.orderinfo;
        let goodname = '';
        let lengs = orders.length;
        let shop_code=[];
        if (lengs <= 1) {
            goodname = orders[0].goods_name;
            shop_code = orders[0].shop_code;
        } else {
            for (let y = 0; y < lengs; y++) {
                goodname += orders[y].goods_name + ',';
                shop_code.push(orders[y].shop_code);
            }
        }
        utilFunctions.weixinPay({
            body: goodname,
            orderUUID: that.data.relevance_uuid,
            money: that.data.sums,
            openid: that.data.weChat
        }, that, () => {
            let now = util.formatDate(new Date().getTime());
            // 支付成功通知商家
            // weixin.sendSocket(JSON.stringify(goods_list), that.data.shop_code);
            let lenths = shop_code.length;
            // for (let b=0;b<lenths;b++){
            //     setTimeout(function(){
            //         weixin.sendSocket((now + ' 订单号：' + that.data.relevance_uuid), shop_code[b]);
            //     },500)
            // }
            // weixin.sendSocket((now + ' 订单号：' + orders.order_uuid), '111');

            wx.removeStorage({
                key: that.data.shop_code,
                success: function (res) {
                    wx.showToast({
                        title: '下单成功',
                        icon: 'success',
                        duration: 1000
                    });
                }
            })
            setTimeout(function () {
                wx.redirectTo({
                    url: '/pages/user/pay_success/pay_success?addid=' + that.data.addId + '&totalPrice=' + that.data.sums
                })
            }, 1000);

        });

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