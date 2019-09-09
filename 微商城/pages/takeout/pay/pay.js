const funDta = require('../../../utils/functionMethodData.js');
const urlData = require('../../../utils/urlData.js')
const util = require('../../../utils/util.js');
const calculate = require('../../../utils/calculate.js');
const weixin = require('../../../utils/weixin.js');
const utilFunctions = require('../../../utils/functionData.js');
const app = getApp();
var couponIds = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    is_load: false,
    shop_code: '',
    options: '',
    address: {}, // 地址
    shop_info: null, // 商店信息
    goods_list: null, // 商品
    totalGoodsPrice: 0, // 所有商品总的价钱
    totalPrice: 0, // 总的价格
    full_subtraction: 0, // 满减价格
    full_subtraction_id: 0, // 满减id
    coupon: '', // 优惠券
    msg: '', // 备注
    tableware: '1人餐具', // 餐具数量(默认1人)
    aliyunUrl: urlData.uploadFileUrl,
    tablewareArr: ['1人餐具', '2人餐具', '3人餐具', '4人餐具', '5人餐具', '6人餐具', '7人餐具', '8人餐具', '9人餐具', '10人以上'],
    userMoney: '', //根据距离配送费
    horseMoney: '', //骑手的费用
    has_address: false,
    reachTime: '', //订单返回时间
    body: '', //商品名
    px2rpxWidth: '',
    px2rpxHeight: '',
    // 显示优惠券
    couponShow: true,
    couponList: {}, //要使用的优惠券，
    // 满赠ID传递
    ReductionID:'',
    ReductionName:'暂无'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    this.setData({
      shop_code: options.shop_code,
      options: options.shop_code,
    });
    this.getReduction(options.shop_code);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    // 获取默认地址
    getAddrByDefault(that);
    // 获取信息
    // 获取用户信息
    funDta.getUser(getApp().globalData.user_id, that, (res) => {
      that.setData({
        userInfo: res
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
  // 查看满赠
  getReduction: function(code) {
    let that=this;
    let data = {
      shopCode: code
    }
    funDta.getReductions(data, that, (data) => {
      let reData=data;
      // 获取商品信息
      let totalPrice=0;
      wx.getStorage({
        key: that.data.shop_code,
        success: function (res) {
         totalPrice = res.data.totalPrice;
          console.log(that.data.ReductionID.length)
          for (let i = 0; i < reData.length;i++){
            if (totalPrice > reData[i].full){
                that.setData({
                  ReductionID: reData[i].id,
                  ReductionName: reData[i].goods_name
                })
            }
          }
        }
      });
    })
  },
  /**
   * 选择地址
   */
  goToAddress: function() {
    let that = this;
    // 将当前页面地址存储在缓存中
    wx.setStorageSync('navigate', '/pages/takeout/pay/pay');
    wx.navigateTo({
      url: '/pages/user/address/address',
    });
    // if (that.data.has_address == true) {
    //   orderinfo(that);
    // }
  },

  /**
   * 选择优惠券
   */
  goToCoupon: function() {
    app.globalData.couponCode = this.data.shop_code;
    app.globalData.prcirCounp = this.data.totalPrice;
    if (this.data.couponList.couponPrice) {
      let nowtal = calculate.calcAdd(this.data.couponList.couponPrice, this.data.totalPrice);
      this.setData({
        couponShow: false,
        totalPrice: nowtal,
      })
    } else {
      this.setData({
        couponShow: false,
        coupon: ''
      })
    }
  },
  // 获取优惠券
  MyEvent(e) {
    let totalPrice = this.data.totalPrice;
    let mycoupon = e.detail.couponPrice;
    let that = this;
    let newTotalPrice = 0;
    wx.setNavigationBarTitle({
      title: '订单支付'
    })
    if (util.isEmpty(mycoupon)) {
      newTotalPrice = totalPrice;
      that.setData({
        totalPrice: newTotalPrice,
        coupon: '',
        couponShow: true,
        couponList: e.detail
      });
    } else {
      newTotalPrice = calculate.calcReduce(totalPrice, mycoupon);
      that.setData({
        totalPrice: newTotalPrice,
        coupon: mycoupon,
        couponShow: true,
        couponList: e.detail
      });
    }
  },
  /**
   * 备注
   */
  msg: function(e) {
    this.setData({
      msg: e.detail.value
    });
  },

  /**
   * 餐具数量
   */
  getTableware: function(e) {
    this.setData({
      tableware: this.data.tablewareArr[e.detail.value]
    })
  },

  /**
   * 支付
   */
  submitInfo: function(e) {
    var formId = e.detail.formId;
    console.log(e.detail.formId);
    // console.log(this.data.goods_list)
    let goodsNmae = null;
    let that = this;
    let goods_list = that.data.goods_list;
    let goodsId = ''; // 商品id
    let num = ''; // 商品数量
    let price = ''; // 商品价格
    let carts_price = ''; // 每个商品总价格
    let discount = 0; // 商品折扣
    let color = ''; // 颜色
    let size = ''; // 尺寸
    let mytype = ''; // 类型
    let volume = ''; // 容量
    let taste = ''; // 味道
    let shop_code = that.data.shop_code + ','; // 店铺编号
    let goods_list_len = goods_list.length;
    // 获取商品名
    if (goods_list_len <= 1) {
      for (let i = 0; i < goods_list_len; i++) {
        goodsNmae = goods_list[0].goods_name;
      }
    } else {
      for (let i = 0; i < goods_list_len; i++) {
        goodsNmae += goods_list[i].goods_name + ',';
      }
    }
    for (let i = 0; i < goods_list_len; i++) {
      goodsId += goods_list[i].id + ',';
      num += goods_list[i].num + ',';
      price += goods_list[i].price + ',';
      carts_price += calculate.calcMul(goods_list[i].discountPrice, goods_list[i].num) + ',';
      if (goods_list[i].discount) {
        discount += goods_list[i].discount + ',';
      } else {
        discount += 0 + ',';
      }
      color = that.specification(goods_list[i].color, color);
      size = that.specification(goods_list[i].size, size);
      mytype = that.specification(goods_list[i].type, mytype);
      volume = that.specification(goods_list[i].volume, volume);
      taste = that.specification(goods_list[i].taste, taste);
      // shop_code += that.data.shop_code + ',';
    }
    // 备注
    let order_remarks = '备注:' + that.data.msg + ';餐具:' + that.data.tableware;
    // 没有优惠券
    let couponId = '';
    if (util.isEmpty(that.data.couponList)) {
      couponId = 0;
    } else {
      couponId = that.data.couponList.couponId;
    }

    // 判断超出范围
    if (that.data.userMoney == '已超出配送范围!') {
      wx.showToast({
        title: '地址超出配送范围',
      })
      return false;
    }
    // 判断地址
    if (util.isEmpty(that.data.address)) {
      wx.showToast({
        title: '请添加地址',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    let data = {
      user_id: getApp().globalData.user_id,
      total_money: that.data.totalGoodsPrice + ',',
      order_type: 1,
      real_money: that.data.totalPrice + ',',
      addr_id: that.data.address.id,
      goodsId: goodsId,
      num: num,
      price: price,
      discount: discount,
      carts_price: carts_price,
      color: color,
      size: size,
      type: mytype,
      volume: volume,
      taste: taste,
      couponId: couponId + ',',
      reductionId: that.data.full_subtraction_id,
      reductionIds: that.data.ReductionID,
      order_remarks: order_remarks,
      status: 1, // 付款待发货
      // shop_code: that.data.shop_code,
      shop_code: shop_code,
      reception: 0, //判断商家是否接单，外卖传0微商城传空
      horseMoney: that.data.horseMoney, //骑手的费用
      reachTime: that.data.reachTime
    }
    funDta.insertOrder(data, that, (res) => {
      // 清空这个缓存
      let lengs = parseInt(res.length);
      let relevanceUUID = '';
      let orderUUID = '';
      for (let r = 0; r < lengs; r++) {
        if (res[r].relevanceUUID) {
          relevanceUUID = res[r].relevanceUUID;
        }
        if (res[r].orderUUID) {
          orderUUID = res[r].orderUUID;
        }
      }
      app.globalData.orderUUID = orderUUID;
      //发送模板信息
      let templat = {
        order_uuid: orderUUID,
        formid: formId,
        weChat: app.globalData.weChat
      }
      funDta.goTemplate(templat, that, (res) => {
        console.log(res)
      })
      // // 微信支付，正式relevanceUUID
      // 测试支付
      function ce(res) {
        console.log(res);
        wx.removeStorage({
          key: that.data.shop_code,
          success: function(res) {}
        })
        // 去除订单shopcode
        app.globalData.shop_code = '';
        wx.redirectTo({
          url: '/pages/takeout/order/order',
        })
      }
      utilFunctions.cezhifu(relevanceUUID, ce, this);
    });
  },

  // 商品规格的处理
  specification: function(mydata, myspecification) {
    let specification = myspecification;
    if (util.isEmpty(mydata)) {
      specification += '@' + ',';
    } else {
      specification += mydata[myspecification] + ',';
    }
    return specification;
  },
  //web发送 
  sendSocket: function(mymessage, ToSendUserno) {
    console.log('websocket===' + mymessage + '===' + ToSendUserno);
    let socketOpen = true;
    let socketMsgQueue = [];
    let message = mymessage + '|' + ToSendUserno;
    let SocketTask = app.globalData.SocketTask;
    SocketTask.send({
      data: message,
      success: function() {}
    })
  }
});

// 获取默认地址
function getAddrByDefault(that) {
  var that = that;
  funDta.getAddrByDefault(getApp().globalData.user_id, that, (data) => {
    if (util.isEmpty(data)) {
      that.setData({
        address: '',
      });
      // 获取地址
      wx.showModal({
        title: '提示',
        content: '你还没有地址，请创建',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/user/addressAdd/addressAdd',
            })
          } else if (res.cancel) {

          }
        }
      })
    } else {
      that.setData({
        address: data
      });
      orderinfo(that);
    }
  });
}

// 获取订单信息
function orderinfo(that) {
  var that = that;
  // 获取店铺信息
  funDta.getOutShopByCode(that.data.shop_code, that, (shopdata) => {
    that.setData({
      shop_info: shopdata
    });
    // 获取配送费
    let datas = {
      startlongitude: shopdata.longitude,
      startlatitude: shopdata.latitude,
      area_path: that.data.address.area_path,
      area_detail: that.data.address.area_detail
    }

    function calback(ress) {
      that.setData({
        userMoney: ress.userMoney,
        horseMoney: ress.horseMoney,
        reachTime: ress.reachTime
      })
      // 获取商品信息
      wx.getStorage({
        key: that.data.shop_code,
        success: function(res) {
          console.log(res)
          let goods_list = res.data.goods;
          let len = goods_list.length;
          for (let i = len - 1; i >= 0; i--) {
            if (goods_list[i].num == 0) {
              goods_list.splice(i, 1);
            }
          }
          let totalPrice = res.data.totalPrice;
          // 判断满减
          totalPrice = reductions(shopdata.reduction, totalPrice, that);
          // 添加配送费
          totalPrice = distribution(totalPrice, that.data.userMoney);
          totalPrice = totalPrice.toFixed(2);
          that.setData({
            totalGoodsPrice: res.data.totalPrice,
            totalPrice: totalPrice,
            goods_list: res.data.goods,
          });
        }
      });
    }
    utilFunctions.shippingFeeUrl(datas, calback, this);
  });
}

// 添加配送费
function distribution(totalPrice, transMoney) {
  var newTotalPrice = 0;
  if (util.isEmpty(transMoney)) {
    newTotalPrice = totalPrice;
  } else {
    newTotalPrice = calculate.calcAdd(totalPrice, transMoney);
  }
  return newTotalPrice;
}

// 满减后的价格
function reductions(reduction, totalPrice, that) {
  // 满减
  let reductionPrice = 0; // 存放符合满减的价格
  let full_subtraction_id = 0;
  let reductionLen = 0;
  if (reduction == undefined || '') {
    reductionLen = 0;
    full_subtraction_id = 0;
  } else {
    reductionLen = reduction.length;
  }
  if (reductionLen > 0) {
    for (let i = 0; i < reductionLen; i++) {
      if (totalPrice >= reduction[i].full) {
        reductionPrice = reduction[i].reductionPrice;
        full_subtraction_id = reduction[i].reductionId;
      }
    }
    var newTotalPrice = calculate.calcReduce(totalPrice, reductionPrice);
    if (newTotalPrice < 0) {
      newTotalPrice = totalPrice;
      reductionPrice = '0';
    }
  } else {
    newTotalPrice = totalPrice;
  }
  that.setData({
    full_subtraction_id: full_subtraction_id,
    full_subtraction: reductionPrice
  });
  return newTotalPrice;
}