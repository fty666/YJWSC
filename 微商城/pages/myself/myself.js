//获取应用实例
var app = getApp();
const urlData = require('../../utils/urlData.js');
const funData = require('../../utils/functionMethodData.js');
const utilFunctions = require('../../utils/functionData.js');
const util = require('../../utils/util.js');
const template = require('../../template/template.js');

Page({
  data: {
    shopInfo: null,
    level: '',
    card: null,
    profile: '',
    money: [],
    hasData: false,
    isHidden: true,
    hide: "hide",
    noHid: "noHid",
    aliyunUrl: urlData.uploadFileUrl,
    shop: true,//是否营业
    px2rpxWidth: '',
    px2rpxHeight: '',
    shop_code: '',
    myshop_code: '',
    gid: '',
    shopcode: '',
  },
  /**
   * 我的钱包
   */
  showMoney: function () {
    wx.navigateTo({
      url: '../myself/myMoney/myMoney'
    })
  },

  setEvent: function () {
    this.setData({
      isHidden: !this.data.isHidden
    })
  },

  /**
   * 客服
   */
  callKeHu: function () {
    wx.makePhoneCall({
      phoneNumber: '17733689080'
    })
  },

  /**
   * 修改密码
   */
  modifyPassword: function () {
    this.setData({
      isHidden: !this.data.isHidden
    }),
      wx.navigateTo({
        url: '../myself/modifyPassword/modifyPassword'
      })
  },

  /**
   * 使用说明
   */
  directionsForUse: function () {
    this.setData({
      isHidden: !this.data.isHidden
    }),
      wx.navigateTo({
        url: '../myself/directionsForUse/directionsForUse'
      })
  },

  /**
   * 反馈
   */
  feedBack: function () {
    this.setData({
      isHidden: !this.data.isHidden
    }),
      wx.navigateTo({
        url: '../myself/feedBack/feedBack'
      })
  },

  /**
   * 退出登录
   */
  loginOut: function () {
    this.setData({
      isHidden: !this.data.isHidden
    })
    wx.redirectTo({
      url: '../login/login'
    })
  },


  // 加载
  onLoad: function () {
    // 加载页面tarBar模块
    template.tabbar("tabBar", 3, this, 2);
    let that = this
    // 查询商家信息
  },

  onShow: function () {
    let that = this;
  },

  onReady: function () {
    let that = this;
    funData.getShopByCode(app.globalData.user_id, that, (data) => {
      app.globalData.groupId = data.shop.groupId;
      app.globalData.shopCode = data.shop.shop_code;
      that.setData({
        gid: data.shop.groupId,
        shopcode: data.shop.shop_code,
      })
      that.setData({
        myshop_code: data.shop.shop_code,
      })
      if (util.isEmpty(data)) {
        that.setData({
          level: app.globalData.level
        });
        return;
      }
      // 判断是否营业
      if (data.is_sale == 1) {
        that.setData({
          shop: true
        })
      } else {
        that.setData({
          shop: false
        })
      }

      if (util.isEmpty(data.card)) {
        that.setData({
          shopInfo: data.shop,
          hasData: true,
          level: data.shop.level
        });
        return;
      }
      let card = data.card;
      // 银行卡号用*替换
      card.card_no = util.bankCardByStar(card.card_no);
      that.setData({
        shopInfo: data.shop,
        card: card,
        hasData: true,
        level: app.globalData.level
      });
    });
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
  },

  /**
   * 修改商家logo
   */
  editProfile: function () {
    let that = this;
    funData.myUpload(function (fileNmae) {
      // console.log(newsrc, fileNmae);
      let shopInfo = that.data.shopInfo;
      shopInfo.logo = fileNmae;
      that.setData({
        shopInfo: shopInfo
      })
      // 同步修改数据库
      let data = {
        shop_code: that.data.shopcode,
        groupId: that.data.gid,
        isshop_name: 'N',
        istel: 'N',
        out: 'N',
        logo: fileNmae
      }
      // 同步修改数据库
      function calback(res) {
      }
      utilFunctions.updateInfoByCodeUrl(data, calback, that);
    })
  },

  /**
   * 满赠活动
   */
  give: function () {
    wx.navigateTo({
      url: '/pages/myGoods/chaGive/chaGive?shop_code=' + this.data.shopInfo.shop_code,
    })
  },

  /**
   *进行拨打电话 
   */
  calling: function (e) {
    console.log(e)
    let phone = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {
      },
      fail: function () {
      }
    })
  },

  /**
   * 修改商家信息按钮
   */
  editShopInfo: function () {
    this.setData({
      isHidden: !this.data.isHidden
    }),
      wx.navigateTo({
        url: '/pages/myself/editShopInfo/editShopInfo'
      })
  },

  /**
   * 店铺优惠券
   */
  goCoupon: function () {
    let that = this;
    wx.navigateTo({
      url: '/pages/myGoods/CouponList/CouponList?shop_code=' + that.data.shopInfo.shop_code,
    })
  },

  /**
   *是否营业 
   */
  switchs: function (e) {
    // console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    let is_sale = 1;
    if (e.detail.value == true) {
      is_sale = 1;
    } else {
      is_sale = 0;
    }
    let that = this;
    let shop_code = that.data.shopInfo.shop_code;
    function calback(res) {
      if (is_sale == 0) {
        wx.showToast({
          title: '停止营业',
        })
      } else {
        wx.showToast({
          title: '正常营业',
        })
      }
    }
    funData.updateOutShopSale(shop_code, is_sale, that, calback);
  },

  /**
   *满减活动 
   */
  goFull: function () {
    wx.navigateTo({
      url: '/pages/myGoods/fullList/fullList?shopcode=' + this.data.shopInfo.shop_code,
    })
  },
  /**
   * 查看绑定的银行卡
   */
  showBankCard: function () {
    wx.navigateTo({
      url: '/pages/bankCard/bankCardList/bankCardList',
    })
  },

  /**
   * 用户收藏
   */
  showUserCollection: function () {
    wx.navigateTo({
      url: '/pages/myself/userCollection/userCollection',
    })
  },

  /**
   * 完善店铺信息
   */
  perfectInformation: function () {
    wx.navigateTo({
      url: '/pages/apply/apply',
    })
  },

  /**
   * 前去购物
   */
  goShopping: function () {
    wx.navigateTo({
      url: '/pages/shop/mall/mall',
    })
  }

})