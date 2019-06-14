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
    discount: "", //折扣
    couponIds: "", //优惠券id
    reductionId: "", //满减id
    weChat: '',
    px2rpxWidth: '',
    px2rpxHeight: '',
    // 显示优惠券
    couponShow: true,
    couponList: {}, //要使用的优惠券
    arrCoupon: [], //页面显示的优惠券
    XshopCode: '', //判断选取的商品
    Zprice: 0, //总价钱
    yhqPrice: 0, //优惠的价格
  },

  onReady: function() {
    let that = this;
    // 默认地址
    this.moadd();
    // 获取购物车数据
    let carts = wx.getStorageSync('lists');
    let nums = wx.getStorageSync('nums');
    let mytotal_money = 0; // 所有商品的总价格(不带优惠)
    let myreal_money = 0; // 每个商店优惠后的总价格
    let sum = 0; // 订单的总价格(优惠后的)
    let favours = 0; // 优惠的价格
    let order = {};
    let cart_len = carts.length;
    let coupon = {}; // 优惠券
    for (let i = 0; i < cart_len; i++) {
      coupon[carts[i].shop_code] = '';
    }
    // 价格判断
    for (let i = 0; i < cart_len; i++) {
      let total_money = 0; // 每个店铺的所有商品的总价格 total_money 不带优惠
      let real_money = 0; // 每个商店优惠后的总价格
      let couponId = ''; // 每个店铺的优惠券的id
      let goods = carts[i].goods;
      let goods_len = carts[i].goods.length;
      for (let j = 0; j < goods_len; j++) {
        // 计算折扣价格
        let carts_price = calculate.calcMul(goods[j].num, goods[j].discountPrice);
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
    this.setData({
      pocket: sum, // 实付
      Zprice: sum,
      orderinfo: carts,
      goods_total: mytotal_money, // 共计
      favour: favours // 优惠
    });
    mypocket = sum;
    mygoods_total = mytotal_money;
    myfavour = favours;

    // 获取用户信息
    funDta.getUser(getApp().globalData.user_id, this, (res) => {
      // console.log(res)
      this.setData({
        weChat: res.weChat
      });
    });
    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function(res) {
        that.setData({
          px2rpxHeight: res.data.px2rpxHeight,
          px2rpxWidth: res.data.px2rpxWidth,
        })
      }
    })

  },
  onShow: function() {
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
  moadd: function() {
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
   *修改默认地址 
   */
  aupdata: function() {
    wx: wx.navigateTo({
      url: '/pages/user/addressAdd/addressAdd'
    })
  },
  list: function() {
    wx: wx.navigateTo({
      url: '/pages/user/address/address'
    })
  },
  /**
   * 选择优惠券
   */
  goToCoupon: function(e) {
    // 传递商家Code
    let shop_code = e.currentTarget.dataset.shop_code;
    app.globalData.couponCode = shop_code;
    app.globalData.prcirCounp = this.data.pocket;
    wx.setNavigationBarTitle({
      title: '选取优惠券'
    })
    if (this.data.XshopCode == shop_code) {
      if (this.data.couponList.couponPrice) {
        let nowtal = calculate.calcReduce(this.data.Zprice, this.data.yhqPrice);
        this.setData({
          couponShow: false,
          pocket: nowtal,
        })
      } else {
        this.setData({
          couponShow: false,
        })
      }

    } else {
      this.setData({
        couponShow: false,
      })
    }
  },
  // 获取优惠券
  MyEvent(e) {
    let pocket = this.data.pocket;
    let mycoupon = e.detail;
    let arr = this.data.arrCoupon;
    let yhqPrice = this.data.yhqPrice;
    let that = this;
    let newTotalPrice = 0;
    wx.setNavigationBarTitle({
      title: '订单支付'
    })
    if (util.isEmpty(mycoupon)) {
      newTotalPrice = pocket;
    } else {
      if (e.detail.shop_code != this.data.XshopCode) {
        yhqPrice += mycoupon.couponPrice;
      }
      newTotalPrice = calculate.calcReduce(this.data.Zprice, yhqPrice);
    }
    if (e.detail.shop_code == this.data.XshopCode) {} else {
      if (e.detail.couponPrice != undefined) {
        arr.push(e.detail);
        this.setData({
          XshopCode: e.detail.shop_code
        })
      }
    }
    that.setData({
      pocket: newTotalPrice,
      couponShow: true,
      couponList: e.detail,
      arrCoupon: arr,
      yhqPrice: yhqPrice
    });
  },

  //开始支付
  pay_confirmOrder: function() {
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
    let status = 1; // 未付款
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
    // console.log(order);
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
      status: 1, // 未付款
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
    utilFunctions.insertMoreOrder(data, (data) => {
      console.log(data)
      let lengs = parseInt(data.length);
      let goodsname = '';
      let order_uuid = '';
      let shop_code = [];
      if (lengs <= 2) {
        goodsname = data[0].goods_name;
        shop_code = data[0].shop_code;
        order_uuid = data[1].relevanceUUID;
      } else {
        for (let h = 0; h < lengs - 1; h++) {
          goodsname += data[h].goods_name + ',';
          shop_code.push(data[h].shop_code);
        }
        for (let k = 0; k < lengs; k++) {
          if (data[k].relevanceUUID) {
            order_uuid = data[k].relevanceUUID;
          }
        }
      }
      // 正式支付
      // 正式支付完
      // 测试支付
      function ce(res) {
        console.log(res);
        console.log('支付成功')
        wx.redirectTo({
          url: '/pages/user/pay_success/pay_success?addid=' + that.data.address.id + '&totalPrice=' + that.data.pocket,
        })
      }
      utilFunctions.cezhifu(order_uuid, ce, this);
    }, that);
  },
});