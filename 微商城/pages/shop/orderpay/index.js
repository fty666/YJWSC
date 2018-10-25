const app = getApp()
const utilFunctions = require('../../../utils/functionData.js');
const funDta = require('../../../utils/functionMethodData.js');
const URLData = require('../../../utils/data.js');
const calculate = require('../../../utils/calculate.js');
const util = require('../../../utils/util.js');
const weixin = require('../../../utils/weixin.js');
var mygoods_total = 0; // 共计
var mypocket = 0; // 实付
var myfavour = 0; // 优惠
Page({

  data: {
    this_order_id: 0,
    // 商品信息
    orderinfo: [],
    // 收货地址
    address: '',
    submitIsLoading: false,
    buttonIsDisabled: false,
    glo_is_load: true,
    addId: "",
    // 实付价格
    pocket: "",
    // 共计价格
    goods_total: "",
    // 优惠
    favour: "",
    has_address: false, // 是否有地址
    coupon: '', // 优惠券
    discount: "",//折扣
    couponIds: "",//优惠券id
    reductionId: "",//满减id
    weChat: '',
    px2rpxWidth: '',
    px2rpxHeight: '',
  },

  /**
   *页面监听数据加载事件，获取订单详情 
   */
  onLoad: function (options) {

  },

  onReady: function () {
    let that = this;
    // 默认地址
    this.moadd();
    // 获取购物车数据
    let carts = wx.getStorageSync('lists');
    let nums = wx.getStorageSync('nums');
    // console.log(carts)
    let mytotal_money = 0; // 所有商品的总价格(不带优惠)
    let myreal_money = 0;  // 每个商店优惠后的总价格
    let sum = 0;   // 订单的总价格(优惠后的)
    let favours = 0; // 优惠的价格
    let order = {};
    let cart_len = carts.length;
    let coupon = {}; // 优惠券
    for (let i = 0; i < cart_len; i++) {
      coupon[carts[i].shop_code] = '';
    }
    // 价格判断
    for (let i = 0; i < cart_len; i++) {
      // let carts_price = 0; // 每个店铺里每个商品的总价格
      let total_money = 0; // 每个店铺的所有商品的总价格 total_money 不带优惠
      let real_money = 0;  // 每个商店优惠后的总价格
      let couponId = '';   // 每个店铺的优惠券的id
      let goods = carts[i].goods;
      let goods_len = carts[i].goods.length;
      for (let j = 0; j < goods_len; j++) {
        let carts_price = calculate.calcMul(goods[j].num, goods[j].price);
        // 添加单个商品总价格到对应商品信息里去
        carts[i].goods[j].carts_price = carts_price;
        // 添加所有商品总价格到对应商店信息里去
        total_money = calculate.calcAdd(carts_price, total_money);
      }
      // 每个店铺的所有商品的总价格 total_money 不带优惠
      carts[i].total_money = total_money;
      mytotal_money = calculate.calcAdd(mytotal_money, total_money);
      // 满减价格
      let reductionPrice = 0;
      let reductionId = ''; // 每个店铺的满减的id
      if (!util.isEmpty(carts[i].reduction)) {
        console.log(carts[i].reduction)
        let reduction = carts[i].reduction;
        let reduction_len = reduction.length;
        for (let l = 0; l < reduction_len; l++) {
          if (reduction[l].full <= total_money && reduction[l].reductionPrice >= reductionPrice) {
            reductionPrice = reduction[l].reductionPrice;
            console.log(reductionPrice)
            reductionId = reduction[l].reductionId;
            carts[i].reduction = reduction[l];
            that.setData({
              reductionId: reduction[l].reductionId
            });
          } else {
            carts[i].reduction = '';
          }
        }
        // 每个店铺的满减的id
        carts[i].reductionId = reductionId;
      } else {
        // 没有满减
        carts[i].reductionId = 0;
        reductionPrice = 0;
      }
      // 每个店铺的总价格(满减后的)
      carts[i].real_money = calculate.calcReduce(total_money, reductionPrice);
      // 每个店铺的优惠的价格(满减后的)
      carts[i].preferential = calculate.calcAdd(favours, reductionPrice);
      // 每个店铺的优惠价格和
      favours = calculate.calcAdd(favours, reductionPrice);
      // 订单的总价格
      sum = calculate.calcAdd(sum, carts[i].real_money);
    }
    // console.log(favours)
    console.log(carts);
    this.setData({
      pocket: sum,  // 实付
      orderinfo: carts,
      goods_total: mytotal_money,      // 共计
      favour: favours  // 优惠
    });
    mypocket = sum;
    mygoods_total = mytotal_money;
    myfavour = favours;

    // 获取用户信息
    funDta.getUser(getApp().globalData.user_id, this, (res) => {
      console.log(res)
      this.setData({
        weChat: res.weChat
      });
    });
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

  onShow: function () {
    console.log(this.data.address);
    // console.log(this.data.address)
    if (!util.isEmpty(this.data.coupon)) {
      let carts = this.data.orderinfo;
      let coupon = this.data.coupon;
      let carts_len = carts.length;
      for (let i = 0; i < carts_len; i++) {
        if (carts[i].shop_code == coupon.shop_code) {
          // 每个店铺的优惠券
          carts[i].coupon = coupon;
          // 每个店铺的优惠价格
          carts[i].preferential = calculate.calcAdd(carts[i].preferential, coupon.couponPrice);
          let favour = calculate.calcAdd(coupon.couponPrice, myfavour);
          let pocket1 = calculate.calcReduce(mygoods_total, favour);
          let pocket2 = calculate.calcReduce(mypocket, coupon.couponPrice);
          let pocket = 0;
          // console.log(pocket, newpocket);
          if (pocket1 == pocket2) {
            pocket = pocket1;
          } else {
            pocket = pocket1;
          }
          if (pocket <= 0) {
            pocket = 0;
          }
          this.setData({
            pocket: pocket,
            favour: favour
          });
        }
      }
      this.setData({
        carts: carts
      });
    }
  },

  /**
   *查看默认地址 
   **/
  moadd: function () {
    // 收货地址
    function maddress(res) {
      // console.log(res);
      if (util.isEmpty(res)) {
        this.setData({
          has_address: false
        });
      } else {
        this.setData({
          has_address: true,
          address: res,
          addid: res.id
        });
      }
    }
    utilFunctions.getAddrByDefault(maddress, this)
  },

  /**
   * 查看单个地址
   */
  // oneadd: function () {
  //     let that = this
  //     function addinfo(res) {
  //         this.setData({
  //             address: res,
  //             addid: res.id
  //         })
  //     }
  //     utilFunctions.getAddrById(addinfo, that.data.addId, this)
  // },

  /**
   *修改默认地址 
   */
  aupdata: function () {
    wx: wx.navigateTo({
      url: '/pages/user/address/address'
    })
  },

  /**
   *跳转优惠券 
   */
  favourable: function (e) {
    // console.log(e)
    let uid = e.currentTarget.dataset.uid;
    let shop_code = e.currentTarget.dataset.shop_code;
    let payPrice = e.currentTarget.dataset.payprice;

    // 选择优惠券之前判断有没有优惠券
    utilFunctions.getUserCoupon(uid, shop_code, payPrice, 1, 1, (res) => {
      console.log(res);
      if (util.isEmpty(res.PageInfo.list)) {
        wx.showToast({
          title: '没有优惠券',
          icon: 'none',
          duration: 1000
        });
        return;
      } else {
        wx.navigateTo({
          url: '/pages/shop/mallquanlist/index?uid=' + uid + '&shop_code=' + shop_code + '&payPrice=' + payPrice
        });
      }
    }, this);


  },


  //开始支付
  pay_confirmOrder: function () {
    let that = this;
    // 判断有没有地址
    if (util.isEmpty(that.data.address)) {
      wx.showToast({
        title: '请添加地址',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    // 添加订单参数
    let user_id = app.globalData.user_id;
    let addr_id = that.data.address.id;
    let order_type = 2;
    let status = 1;  // 未付款

    let total_money = '';
    let real_money = '';
    let goodsId = '';
    let num = '';
    let price = '';
    let carts_price = '';
    let shop_code = '';
    let discount = '';
    let reductionId = '';
    let couponIds = '';

    let color = '';
    let size = '';
    let typee = '';
    let volume = '';
    let taste = '';

    // 商品详情
    let order = this.data.orderinfo;
    console.log(order);
    let orderLen = order.length;
    for (let i = 0; i < orderLen; i++) {
      let goods = order[i].goods;
      let goods_len = goods.length;
      for (let j = 0; j < goods_len; j++) {
        total_money += order[i].total_money + ',';
        real_money += order[i].real_money + ',';
        goodsId += goods[j].goods_id + ',';
        num += goods[j].num + ',';
        price += goods[j].price + ',';
        carts_price += goods[j].carts_price + ',';
        discount += goods[j].discount + ',';
        shop_code += order[i].shop_code + ',';
        if (util.isEmpty(order[i].reduction)) {
          order[i].reduction = {};
          order[i].reduction.reductionId = 0;
        }
        reductionId += order[i].reduction.reductionId + ',';
        if (util.isEmpty(order[i].coupon)) {
          order[i].coupon = {};
          order[i].coupon.couponId = 0;
        }
        couponIds += order[i].coupon.couponId + ',';

        if (util.isEmpty(goods[j].color)) {
          goods[j].color = '@';
        }
        color += goods[j].color + ',';
        if (util.isEmpty(goods[j].size)) {
          goods[j].size = '@';
        }
        size += goods[j].size + ',';
        if (util.isEmpty(goods[j].type)) {
          goods[j].type = '@';
        }
        typee += goods[j].type + ',';
        if (util.isEmpty(goods[j].volume)) {
          goods[j].volume = '@';
        }
        volume += goods[j].volume + ',';
        if (util.isEmpty(goods[j].taste)) {
          goods[j].taste = '@';
        }
        taste += goods[j].taste + ',';
      }
    }

    let data = {
      user_id: app.globalData.user_id,
      addr_id: that.data.address.id,
      order_type: 2,
      status: 1,  // 未付款
      total_money: total_money,
      real_money: real_money,
      goodsId: goodsId,
      num: num,
      price: price,
      carts_price: carts_price,
      shop_code: shop_code,
      discount: discount,
      reductionId: reductionId,
      couponId: couponIds,
      color: color,
      size: size,
      type: typee,
      volume: volume,
      taste: taste,
    }
    // console.log(data);
    utilFunctions.insertMoreOrder(data, (data) => {
      // 微信支付
      console.log(data)
      let lengs = parseInt(data.length);
      let goodsname = '';
      let order_uuid = '';
      let shop_code = [];
      if (lengs <= 2) {
        // console.log('一条数据')
        goodsname = data[0].goods_name;
        shop_code = data[0].shop_code;
        order_uuid = data[1].relevanceUUID;
        // console.log(order_uuid)
      } else {
        // console.log('多条条数据')
        for (let h = 0; h < lengs - 1; h++) {
          goodsname += data[h].goods_name + ',';
          shop_code.push(data[h].shop_code);
        }
        for (let k = 0; k < lengs; k++) {
          if (data[k].relevanceUUID) {
            order_uuid = data[k].relevanceUUID;
            // console.log(order_uuid)
          }
        }
      }
      // goodsname = goodsname.slice(0, price.lastIndexOf(','));
      utilFunctions.weixinPay({
        body: goodsname,
        orderUUID: order_uuid,
        money: that.data.pocket,
        openid: that.data.weChat
      }, that, () => {
        let now = util.formatDate(new Date().getTime());
        // 支付成功通知商家
        // weixin.sendSocket(JSON.stringify(goods_list), that.data.shop_code);
        let cha = shop_code.length;
        for (let g = 0; g < cha; g++) {
          weixin.sendSocket((now + ' 订单号：' + order_uuid), shop_code[g]);
        }
        // weixin.sendSocket((now + ' 订单号：' + order_uuid), '111');

        wx.removeStorage({
          key: that.data.shop_code,
          success: function () {
            wx.showToast({
              title: '下单成功',
              icon: 'success',
              duration: 1000
            });
          }
        })
        //     // //支付成功发送短信通知商家
        //     // funDta.getOrderSms(that.data.shop_info.mobile, that, () => {
        //         // wx.showModal({
        //         //     content: '付款成功,已通知商家',
        //         //     showCancel: 'false',
        //         //     success: function (res) {
        //         //         if (res.confirm) {
        //         //             console.log('用户点击确定')
        //         //         }
        //         //     }
        //         // })
        //     // });

        wx.redirectTo({
          url: '/pages/user/pay_success/pay_success?addid=' + that.data.address.id + '&totalPrice=' + that.data.pocket,
        })

      });
    }, that);
  },
});
