const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
const calculate = require('../../../utils/calculate.js');
const template = require('../../../template/template.js');
const app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    level: app.globalData.level,
    swiper_data: [],
    index_data: [],
    glo_is_load: false,
    shareInfo: '',
    upload_file_url: URLData.upload_file_url,
    // 商铺分组
    group: [1],
    page: 1,
    pageSize: 10,
    px2rpxWidth: '',
    px2rpxHeight: '',
    takeout: '',//外卖商品
  },

  /**
   *  扫码
   */
  shop_saoma_bind: function () {
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        // console.log(res)
      }
    })
  },

  /**
   搜索商品
   */
  inputBlur: function (e) {
    // console.log(e)
    let that = this
    let arrayVal = [];
    arrayVal.push(e.detail.value);
    let dttails = e.detail.value;
    if (dttails == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入店铺名称',
        duration: 3000,
      });
      return false;
    }
    // wx.nextTick(function () {
      wx.navigateTo({
        url: '/pages/shop/mallcate/mallcate?gname=' + arrayVal,
      })
    // })

    arrayVal = [];
  },

  /**
   * 读取首页数据
   */
  onLoad: function (options) {
    let that = this;
    // 获取用户授权
    // this.getUserInfo();

    // 加载页面tarBar模块
    // setTimeout(function(){
    //     console.log(app.globalData.level)
    //     if (app.globalData.level == '1' || !app.globalData.level) {
    //         template.tabbar("tabBar", 0, that, 1);
    //     } else if (app.globalData.level == '2' || app.globalData.level == '3') {
    //         template.tabbar("tabBar", 0, that, 3);
    //     } 
    // },1000);

    //获取商家分组
    let arrays = [];

    function gets(res) {
      // console.log(res)
      arrays = res.slice(0, 7)
      that.setData({
        group: arrays
      })
    }

    utilFunctions.getGroup(gets, this);
  },

  getUserInfo: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res);
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfoBtn: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShow: function () {
  },

  onReady: function () {
    // console.log(app.globalData.level)
    let that = this;
    setTimeout(function () {
      if (app.globalData.level == '1' || !app.globalData.level) {
        template.tabbar("tabBar", 0, that, 1);
      } else if (app.globalData.level == '2' || app.globalData.level == '3') {
        template.tabbar("tabBar", 0, that, 3);
      }
    }, 1000);

    // 获取外卖
    let data = {
      page: that.data.page,
      pageSize: that.data.pageSize,
      groupId: 1,
    }
    function calback(res) {
      console.log(res)
      that.setData({
        takeout: res.PageInfo.list
      })
    }
    utilFunctions.getFoodsShopUrl(data, calback, that);

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
   *跳转店铺
   */
  sgroup: function (e) {
    // console.log(e)
    let gid = e.currentTarget.dataset.gid;
    if (gid == 1) {
      // 跳转去外卖
      wx.navigateTo({
        url: '/pages/takeout/index/index',
      })
    } else {
      wx.navigateTo({
        url: "/pages/shop/mallcate/mallcate?gid=" + gid,
      })
    }
  },

  /**
   *更多店铺分类
   */
  more: function () {
    wx.navigateTo({
      url: '/pages/shop/seller/seller'
    })
  },

  /**
   *显示店铺
   */
  go_quan_info_bind: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../mallquan/index?qid=' + e.currentTarget.id
    });
  },



  /**
  * 去商店
  */
  goToShop: function (e) {
    let sale = e.currentTarget.dataset.salse;
    wx.nextTick(function () {
      if (sale == 0) {
        wx.showToast({
          title: '该店铺停止营业',
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: '/pages/takeout/shopDetails/shopDetails?shop_code=' + e.currentTarget.dataset.shop_code
        })
      }
    })
  },

  getShareInfo: function () {

  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.shareInfo.title,
      desc: that.data.shareInfo.desc,
      path: 'pages/shop/mall/mall'
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.onLoad();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
})