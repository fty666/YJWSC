const funDta = require('../../../utils/functionMethodData.js');
const urlData = require('../../../utils/urlData.js')
const template = require('../../../template/template.js');
const util = require('../../../utils/util.js');
const calculate = require('../../../utils/calculate.js');
const utilFunctions = require('../../../utils/functionData.js');
const app = getApp();
var page = 1;
var pageSize = 20;
var btnFlag = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_load: false,
    nav_type: 'menu', // 菜单类型,默认菜单(菜单-评价-商家) 
    menu_cate: -1, // 菜单类别(默认热销-1)
    num: {}, // 商品的数量
    shop_code: '',
    shop_info: null,
    goods_list: null, // 商品列表
    shop_class: null, // 店铺商品类别
    assess: false,
    adds: false,
    pei: 0, // 达到多少钱配送
    is_pei: true, // 是否满足配送
    total_price: 0.00, // 所有商品总价格
    cart_hidden: false, // 购物车是否显示
    cart: {}, // 购物车
    aliyunUrl: urlData.uploadFileUrl,
    comment: "", //商品评论
    shows: [0, 0, 0, 0, 0], //五星好评
    ginfo: false, //打开商品详情
    shopinfo: "", //单个商品详情
    discount: "", //商品折扣价
    px2rpxWidth: '',
    px2rpxHeight: '',
    gift: '', //满赠
    initialMoney: '', //起送价
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取上级页面传过来的参数
    this.setData({
      shop_code: options.shop_code,
    });
    let datas = {
      shop_code: options.shop_code
    };
    // 查询满赠
    let that = this;
    funDta.getReductionInGoods(datas, that, (res) => {
      that.setData({
        gift: res,
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    wx.showLoading()
    setTimeout(function () {

      // 获取店铺信息
      funDta.getOutShopByCode(that.data.shop_code, that, (res) => {
        let pei = res.initialMoney;
        that.setData({
          shop_info: res,
          pei: pei,
          initialMoney: res.initialMoney
        });
      });

      // 获取店铺分类
      funDta.getFoodClass(that.data.shop_code, that, (res) => {
        that.setData({
          shop_class: res
        });
      });

      // 获取店铺商品列表(默认热销,分类为空)
      getFoodGoodsList(1, '', that);

      // 获取商家评论
      function calback(res) {
        let pres = res.PageInfo.list
        // 获取评论图片
        for (let l = 0; l < pres.length; l++) {
          pres[l].shopImg = pres[l].shopImg.split(',');
        }
        that.setData({
          comment: pres
        })
      }
      utilFunctions.getShopComment(that.data.shop_code, page, pageSize, calback, that);
      //获取缓存
      wx.getStorage({
        key: 'PX_TO_RPX',
        success: function (res) {
          that.setData({
            px2rpxHeight: res.data.px2rpxHeight,
            px2rpxWidth: res.data.px2rpxWidth,
          })
        }
      })
      wx.showLoading({
        title: '稍等加载中...',
        mask:false
      })

      // 缓存时间
      setTimeout(function () {
        wx.hideLoading({
        }
        )
      }, 1500)

    }, 500)

  },

  /**
   *查看商品详情 
   */
  xinfo: function (e) {
    let that = this;
    let gids = e.currentTarget.dataset.gsid;

    function calback(res) {
      that.setData({
        shopinfo: res
      })
      let zhe = calculate.calcMul(res.discount, 0.1);
      if (util.isEmpty(zhe)) {
        that.setData({
          discount: res.price
        })
      } else {
        let jia = calculate.calcMul(res.price, zhe);
        that.setData({
          discount: jia
        })
      }
    }
    utilFunctions.getFoodGoodsDetails(gids, calback, that);
    let ginfo = that.data.ginfo;
    that.setData({
      ginfo: true
    })
  },
  /**
   *关闭商品详情 
   */
  close: function () {
    this.setData({
      ginfo: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   *  菜单-评价-商家
   */
  nav: function (e) {
    let nav_type = e.currentTarget.dataset.navtype;
    this.setData({
      nav_type: nav_type
    });
  },

  /**
   * 点击菜单类别
   */
  menuCate: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let classId = e.currentTarget.dataset.classid;
    // 获取类别对应的商品列表
    pageSize = 20;
    if (classId == -1) {
      getFoodGoodsList(1, '', that);
    } else {
      getFoodGoodsList('', classId, that);
    }
    that.setData({
      menu_cate: classId,
    });
  },

  /**
   *  改变购物车数量
   */
  changCartNum: function (e) {
    let that = this;
    let goodsid = e.currentTarget.dataset.goodsid;
    let mytype = e.currentTarget.dataset.type;
    let goods_list = that.data.goods_list;
    this.changeNum(goods_list, goodsid, mytype);
  },

  /**
   * 改变数量
   */
  changeNum: function (mygoods_list, goodsid, mytype) {
    if (btnFlag) {
      return;
    }
    btnFlag = true;
    let that = this;
    let goods_list = mygoods_list;
    let len = goods_list.length;
    let num = 0;
    let selectGoods = {}; // 选中的商品的信息
    for (let i = 0; i < len; i++) {
      if (goods_list[i].id == goodsid) {
        num = goods_list[i].num;
        if (mytype == 'add') {
          num++;
          goods_list[i].minus_hidden = true;
        } else if (mytype == 'minus') {
          num--;
          goods_list[i].minus_hidden = true;
          if (num <= 0) {
            num = 0;
            goods_list[i].minus_hidden = false;
          }
        }
        goods_list[i].num = num;
        selectGoods = goods_list[i];
      }
    }
    console.log(mytype)
    console.log(goods_list)
    console.log(selectGoods)
    // 计算总价
    calculateTotalPrice(mytype, goods_list, selectGoods, that);
  },

  /**
   * 显示购物车
   */
  showCart: function () {
    let cart_hidden = this.data.cart_hidden;
    // 获取缓存
    let value = wx.getStorageSync(this.data.shop_code);
    this.setData({
      cart: value,
      total_price: value.totalPrice,
      cart_hidden: !cart_hidden,
    });
  },

  /**
   *隐藏购物车 
   */
  hidds: function () {
    let cart_hidden = this.data.cart_hidden;
    this.setData({
      cart_hidden: !cart_hidden,
    });
  },
  /**
   * 清空购物车
   */
  emptyCart: function () {
    let that = this;
    let goods_list = that.data.goods_list;
    let len = goods_list.length;
    try {
      wx.removeStorageSync(that.data.shop_code);
      for (let i = 0; i < len; i++) {
        goods_list[i].num = 0
      }
      let initialMoney = that.data.shop_info.initialMoney;
      that.setData({
        cart: {},
        total_price: 0.00,
        pei: initialMoney,
        goods_list: goods_list,
        cart_hidden: false,
        is_pei: true,
      });

    } catch (e) {
      wx.showToast({
        title: '清空购物车失败',
        icon: 'none',
        duration: 1000
      });
    }
  },

  /**
   *拨打电话 
   */
  phone: function (e) {
    let numbers = e.currentTarget.dataset.phones;
    wx.makePhoneCall({
      phoneNumber: numbers,
    })
  },
  /**
   * 去结算
   */
  goToCount: function () {
    let that = this;
    app.globalData.shop_code = that.data.shop_code;
    wx.redirectTo({
      url: '/pages/takeout/pay/pay?shop_code=' + that.data.shop_code,
    })
  },
  // 领取优惠券
  draw: function () {
    let that = this;
    wx.navigateTo({
      url: '/pages/myGoods/getCoupon/getCoupon?shop_code=' + that.data.shop_code
    })
  },

  /**
   * 食物 滚动到顶部/左边，会触发 scrolltoupper 事件
   */
  scrollToUpper: function () { },

  /**
   * 食物 滚动到底部/右边，会触发 scrolltolower 事件
   */
  scrollToLower: function () { },
});

// 获取店铺商品列表
function getFoodGoodsList(myhot, myfoodsClassId, that, resFun) {
  let mydata = {
    shopCode: that.data.shop_code,
    isUse: 1,
    hot: myhot, // 热销
    foodsClassId: myfoodsClassId, // 外卖店铺分类id
    page: page,
    pageSize: pageSize
  };
  funDta.getFoodGoods(mydata, that, (res) => {
    // 获取这个商店的购物车缓存
    let value = wx.getStorageSync(that.data.shop_code);
    if (!util.isEmpty(value)) {
      var goodsStorage = value.goods;
      var goodsStorage_len = goodsStorage.length;
      that.setData({
        total_price: value.totalPrice
      });
      // 配送需求
      carry(that, value.totalPrice);
    }

    let newData = res.PageInfo.list;
    let len = newData.length;
    for (let i = 0; i < len; i++) {
      newData[i].num = 0; // 我每个商品添加数量
      newData[i].minus_hidden = false; // 每个是否显示减号
      if (!util.isEmpty(value)) {
        for (let j = 0; j < goodsStorage_len; j++) {
          if (newData[i].id == goodsStorage[j].id) {
            newData[i].num = goodsStorage[j].num;
            newData[i].minus_hidden = true;
          }
        }
      }
      // 折扣除以10
      if (newData[i].discount > 0 && newData[i].discount <= 10) {
        let discount = calculate.calcSub(newData[i].discount, 10); // 折扣
        newData[i].discountPrice = (calculate.calcMul(newData[i].price, discount)).toFixed(2); // 折扣价格
        if (newData[i].discountPrice == 0.00) {
          newData[i].discountPrice == 0.01;
        }
      } else if (newData[i].discount <= 0 || newData[i].discount > 10 || newData[i].discount == '') {
        newData[i].discountPrice = newData[i].price; // 折扣价格
      }
    }
    that.setData({
      goods_list: newData,
    });
  });

}

// 计算总价
function calculateTotalPrice(flag, goods_list, selectGoods, that) {
  // 所有商品的总价格
  let totalPrice = 0;
  if (flag == 'add') {
    // 增加数量
    if (selectGoods.num > selectGoods.maxnum) {
      wx.showToast({
        title: '超过最大折扣数，按原价计算',
        icon: 'none'
      })
      totalPrice = calculate.calcAdd(that.data.total_price, selectGoods.price);
      totalPrice = totalPrice.toFixed(2)
    } else {
      totalPrice = calculate.calcAdd(that.data.total_price, selectGoods.discountPrice);
      totalPrice = totalPrice.toFixed(2)
    }

  } else if (flag == 'minus') {
    // 减少数量
    if (selectGoods.num + 1 > selectGoods.maxnum) {
      totalPrice = calculate.calcReduce(that.data.total_price, selectGoods.price);
    } else {
      totalPrice = calculate.calcReduce(that.data.total_price, selectGoods.discountPrice);
    }

  }
  console.log(totalPrice);
  // 配送需求
  carry(that, totalPrice);
  if (totalPrice <= 0) {
    totalPrice = 0.00;
    that.setData({
      is_pei: true,
    });
  }
  that.setData({
    goods_list: goods_list,
    total_price: totalPrice,
  });
  // 同步缓存
  getTackoutCartStorage(totalPrice, selectGoods, that);


}

// 配送需求
function carry(that, totalPrice) {
  // 最大起送差价
  let maxPei = that.data.shop_info.initialMoney;
  // 起送差价
  let peis = calculate.calcReduce(maxPei, totalPrice);
  if (peis <= 0) {
    that.setData({
      is_pei: false,
    });
    peis = 0;
  } else if (peis >= maxPei) {
    that.setData({
      is_pei: true,
    });
    peis = maxPei;
  } else {
    that.setData({
      is_pei: true,
    });
  }
  that.setData({
    pei: peis,
  });
}

// 获取外卖购物车缓存
function getTackoutCartStorage(mytotalPrice, mygoods, that) {
  let value = wx.getStorageSync(that.data.shop_code);
  let newValue = {};
  if (util.isEmpty(value)) {
    // 不存在缓存,就创建
    let newGoods = [];
    newGoods.push(mygoods);
    newValue = {
      totalPrice: mytotalPrice,
      // reduction: that.shop_info.reduction,
      goods: newGoods
    }
    value = newValue;
  } else {
    let goods = value.goods;
    let len = goods.length;
    let flag = true; // 是否有相同商品的标志
    for (let i = 0; i < len; i++) {
      if (goods[i].id == mygoods.id) {
        goods[i] = mygoods,
          flag = false; // 有相同商品
      }
    }
    if (flag) {
      // 没有相同商品
      goods.push(mygoods);
    }
    value.totalPrice = mytotalPrice
    value.goods = goods;
  }
  // 放入缓存
  wx.setStorageSync(that.data.shop_code, value);
  // 把缓存数据显示到页面
  that.setData({
    cart: value
  });

  let clear_time = setTimeout(function () {
    btnFlag = false;
    clearTimeout(clear_time);
  }, 500);
}