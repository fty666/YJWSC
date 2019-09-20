const app = getApp()
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
const calculate = require('../../../utils/calculate.js');
const util = require('../../../utils/util.js');
const funDta = require('../../../utils/functionMethodData.js');
const weixin = require('../../../utils/weixin.js');
let var_pocket = 0;
Page({
  data: {
    this_order_id: 0,
    // 商品总价
    sums: 0,
    // 直接结算的信息
    firstinfo: "",
    // 商品数量
    gnum: "",
    // 收货地址
    address: [],
    addid: "",
    // 传过来的ID
    addId: "",
    submitIsLoading: false,
    buttonIsDisabled: false,
    glo_is_load: true,
    // 实付价格
    pocket: 0,
    // 优惠价格
    favour: 0,
    zfavour: "",
    // 优惠券ID
    coupon: "",
    couponPrice: '', //优惠券的价格
    discount: 0, //折扣
    couponId: 0, //优惠券id
    reductionId: 0, //满减id
    has_address: false, //判断是否有收货地址
    // 规格参数
    color: '', //颜色
    size: '', //尺寸
    taste: '', //口味
    typee: '', //类型
    volume: '', //内存
    weChat: '',
    shop_info: '', //店铺信息
    shop_code: '',
    px2rpxWidth: '',
    px2rpxHeight: '',
    couponShow: true, //默认
    couponList: {}, //优惠券
  },

  /**
   *页面监听数据加载事件，获取订单详情 
   */

  onLoad: function(options) {
    // console.log(options)
    let shopsCode = options.shcode;
    this.setData({
      shop_code: options.shcode
    })
    // 颜色
    if (options.color == 'undefined') {
      this.setData({
        color: ''
      })
    } else {
      this.setData({
        color: options.color
      })
    }
    // 尺寸
    if (options.size == 'undefined') {
      this.setData({
        size: ''
      })
    } else {
      this.setData({
        size: options.size
      })
    }
    // 口味
    if (options.tastes == 'undefined') {
      this.setData({
        taste: ''
      })
    } else {
      this.setData({
        taste: options.tastes
      })
    }
    // 类型
    if (options.typee == 'undefined') {
      this.setData({
        typee: ''
      })
    } else {
      this.setData({
        typee: options.typee
      })
    }
    // 内存
    if (options.volume == 'undefined') {
      this.setData({
        volume: ''
      })
    } else {
      this.setData({
        volume: options.volume
      })
    }
    // 传过来的收货地址ID
    var gids = wx.getStorageSync('gid');
    var sum = wx.getStorageSync('num');
    let ZKprice = options.ZKprice; //传过来的折扣价格
    var that = this
    // 直接结算
    function goods(res) {
      console.log(res)
      // 满减活动
      var di = 0;
      let nums = calculate.calcMul(ZKprice, sum);
      for (let l = 0; l < res.reduction.length; l++) {
        if (res.reduction[l].full <= nums) {
          if (res.reduction[l].reductionPrice > di) {
            di = res.reduction[l].reductionPrice;
            if (res.reduction[l].reductionId) {
              that.setData({
                reductionId: res.reduction[l].reductionId
              })
            }
          }
        }
      }
      if (res.discount) {
        that.setData({
          discount: res.discount
        })
      }
      let picke = calculate.calcReduce(nums, di);
      nums = calculate.dealMoney(nums);
      picke = calculate.dealMoney(picke)
      di = calculate.dealMoney(di);
      that.setData({
        favour: di
      })
      if (picke < 0) {
        picke = 0;
      }

      that.setData({
        firstinfo: res,
        sums: nums,
        gnum: sum,
        pocket: picke,
        favour: di
      });
      if (!util.isEmpty(this.data.pocket)) {
        var_pocket = this.data.pocket
      }
    }
    utilFunctions.getGoodsDetails(gids, shopsCode, goods, this)
  },

  onReady: function() {
    this.moadd()
    // 获取用户信息
    funDta.getUser(app.globalData.user_id, this, (res) => {
      this.setData({
        weChat: res.weChat
      });
    });
    let that = this;
    // 查看店铺信息
    funDta.getShopbycode(that.data.shop_code, this, (res) => {
      this.setData({
        shop_info: res.shop
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
    let cou = this.data.coupon;
    let coup = cou.couponId;
    if (coup) {
      this.setData({
        couponId: coup,
      })
    }
    let yhq = 0;
    if (cou.couponPrice) {
      yhq = cou.couponPrice;
    } else {
      yhq = 0;
    }
    this.setData({
      couponPrice: yhq
    })
    let fav = this.data.favour;
    yhq = calculate.calcAdd(fav, yhq);
    let nums = this.data.sums;
    let numss = calculate.calcReduce(nums, yhq);
    if (numss < 0) {
      numss = 0;
    }
    this.setData({
      zfavour: yhq,
      pocket: numss,
      favour: 0,
    });
    if (util.isEmpty(this.data.pocket)) {
      this.setData({
        pocket: var_pocket
      });
    } else {
      var_pocket = this.data.pocket
    }
  },

  /**
   *查看默认地址 
   **/
  moadd: function() {
    // 收货地址
    function maddress(res) {
      console.log(res)
      if (util.isEmpty(res)) {
        this.setData({
          has_address: false
        });
      } else {
        this.setData({
          address: res,
          addid: res.id,
          has_address: true
        })
      }
    }
    utilFunctions.getAddrByDefault(maddress, this)
  },

  /**
   *修改默认地址 
   */
  aupdata: function() {
    wx: wx.navigateTo({
      url: '/pages/user/address/address'
    })
  },
  /**
   * 选择优惠券
   */
  goToCoupon: function() {
    app.globalData.couponCode = this.data.shop_code;
    app.globalData.prcirCounp = this.data.pocket;
    wx.setNavigationBarTitle({
      title: '选取优惠券'
    })
    if (this.data.couponList.couponPrice) {
      let nowtal = calculate.calcAdd(this.data.couponList.couponPrice, this.data.pocket);
      this.setData({
        couponShow: false,
        pocket: nowtal
      })
    } else {
      this.setData({
        couponShow: false,
      })
    }
  },
  // 获取优惠券
  MyEvent(e) {
    let pocket = this.data.pocket;
    let mycoupon = e.detail.couponPrice;
    wx.setNavigationBarTitle({
      title: '订单支付'
    })
    let that = this;
    let newTotalPrice = 0;
    if (util.isEmpty(mycoupon)) {
      newTotalPrice = pocket;
    } else {
      newTotalPrice = calculate.calcReduce(pocket, mycoupon);
    }
    that.setData({
      pocket: newTotalPrice,
      couponShow: true,
      couponList: e.detail,
      couponId: e.detail.couponId
    });
  },
  //开始支付
  pay_confirmOrder: function() {
    let that = this;
    // 判断有没有地址
    if (util.isEmpty(this.data.address)) {
      wx.showToast({
        title: '请添加地址',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    // 满减，优惠券
    let reductionIds = 0;
    let couponId = 0;
    if (util.isEmpty(this.data.reductionId)) {
      reductionIds = 0;
    } else {
      reductionIds = this.data.reductionId;
    }
    if (util.isEmpty(this.data.couponId)) {
      couponId = 0;
    } else {
      couponId = this.data.couponId;
    }
    // 添加订单参数
    let total_money = [];
    let real_money = [];
    let addr_id = [];
    let goodsId = [];
    let num = [];
    let price = [];
    let carts_price = [];
    let status = 1;
    let psums = [];
    let shopcode = [];
    // 商品规格
    let color = '';
    let size = '';
    let typee = '';
    let volume = '';
    let taste = '';
    // 颜色规格
    if (this.data.color == 'undefined') {
      color = '';
    } else {
      color = this.data.color
    }
    // 尺寸规格
    if (this.data.size == 'undefined') {
      size = '';
    } else {
      size = this.data.size
    }
    // 口味规格
    console.log(this.data.taste)
    if (this.data.taste == 'undefined') {
      taste = '';
    } else {
      taste = this.data.taste
    }
    // 类型规格
    if (this.data.typee == 'undefined') {
      typee = '';
    } else {
      typee = this.data.typee
    }
    // 内存规格
    if (this.data.volume == 'undefined') {
      volume = '';
    } else {
      volume = this.data.volume
    }

    let mytotal_money = that.data.sums;
    let myreal_money = that.data.pocket;
    let addid = that.data.addid;
    let discount = that.data.discount;
    // 商品详情
    let ishop = this.data.firstinfo
    // 商品价格
    let psum = (this.data.gnum) * (ishop.price);
    goodsId.push(ishop.goodsId);
    num = this.data.gnum;
    price.push(ishop.price);
    carts_price.push(psum);
    shopcode.push(ishop.shopCode);
    // let reception='';//判断商家是否接单，微商城传空
    // console.log(shopcode)
    //生成订单函数和
    function orders(res) {
      // 微信支付
      // console.log(res)
      app.globalData.orderUUID = res[1].relevanceUUID;
      // -----------------------------------------------------------------------正式支付
      utilFunctions.weixinPay({
        body: res[0].goods_name,
        orderUUID: res[1].relevanceUUID,
        money: that.data.pocket,
        openid: that.data.weChat
      }, that, () => {
        let now = util.formatDate(new Date().getTime());
        // 支付成功通知商家
        // weixin.sendSocket((now + ' 订单号：' + res[0].order_uuid), that.data.shop_code);
        // weixin.sendSocket((now + ' 订单号：' + res[0].order_uuid), '111');

        wx.removeStorage({
          key: that.data.shop_code,
          success: function(res) {
            wx.showToast({
              title: '下单成功',
              icon: 'success',
              duration: 1000
            });
          }
        })

        // 订单传递
        app.globalData.ZKprice = '';
        app.globalData.color = '';
        app.globalData.shcode = '';
        app.globalData.size = '';
        app.globalData.tastes = '';
        app.globalData.typee = '';
        app.globalData.volume = '';
        wx.redirectTo({
          url: '/pages/user/pay_success/pay_success?addid=' + that.data.address.id + '&totalPrice=' + that.data.sums,
        })

      });
      // ---------------------------------------------------测试支付
      // function ce(res) {
      //   console.log(res);
      //   console.log('支付成功')
      //   wx.redirectTo({
      //     url: '/pages/user/pay_success/pay_success?addid=' + that.data.address.id + '&totalPrice=' + that.data.sums,
      //   })
      // }
      // utilFunctions.cezhifu(res[1].relevanceUUID, ce, this);
    }
    utilFunctions.insertOrder(goodsId, num, price, carts_price, color, size, typee, volume, taste, mytotal_money, myreal_money, addid, status, shopcode, discount, couponId, reductionIds, orders, this)
  }
})