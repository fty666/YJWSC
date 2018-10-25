const funDta = require('../../../utils/functionMethodData.js');
const utilFunctions = require('../../../utils/functionData.js');
const urlData = require('../../../utils/urlData.js');
const template = require('../../../template/template.js');
const util = require('../../../utils/util.js');
var page = 1;
var pageSize = 20;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_load: false,
    has_data: true,
    locationName: '', // 定位地址
    location: null,
    select: 'all', // 条件选择,默认全部
    shop: null, // 店铺
    prev_page_url: '', // 上级页面
    options: '', // 页面接收的参数
    uploadFileUrl: urlData.uploadFileUrl,
    px2rpxWidth: '',
    px2rpxHeight: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let that = this;
    if (!util.isEmpty(options)) {
      that.setData({
        options: options.locationName
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    // 显示tarBar模板
    template.tabbar("tabBar", 0, this, 4);
    // 定位
    if (util.getPrevPageUrl() == 'pages/takeout/chooseAddress/chooseAddress') {
      that.setData({
        locationName: that.data.options
      });
    } else {
      funDta.amapFilePackage((data) => {
        console.log(data);
        that.setData({
          locationName: data[0].regeocodeData.pois[0].name,
          location: data[0].regeocodeData.pois[0].location
        });
      }, () => { });
    }
    // 加载数据
    that.getShopBySelect(that.data.select);
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
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
   * 选择地址
   */
  chooseAddress: function () {
    wx.navigateTo({
      url: '/pages/takeout/chooseAddress/chooseAddress',
    })
  },

  /**
   * 条件选择
   */
  requirementSelect: function (e) {
    let that = this;
    let select = e.currentTarget.dataset.select;
    let query = select;
    pageSize = 20;
    if (select == 'distance') {
      let location = that.data.location.split(',');
      query = ['distance', [location[0]], [location[1]]];
    };
    that.getShopBySelect(query);
    that.setData({
      select: select
    });
  },

  //查询店铺
  takes: function (e) {
    console.log(e.detail.value)
    let arrayVal = e.detail.value;
    wx.navigateTo({
      url: '/pages/takeout/souIndex/souIndex?arrayVal=' + arrayVal,
    })
  },

  // 根据条件查询店铺
  getShopBySelect: function (myselect) {
    let that = this;
    let data = {
      groupId: 1,
      page: page,
      pageSize: pageSize
    };
    if (typeof myselect == 'string') {
      data[myselect] = 1;
    } else {
      data[myselect[0]] = 1;
      data.longitude = myselect[1];
      data.latitude = myselect[2];
    }


    // 在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    funDta.getFoodsShop(data, that, (res) => {
      // console.log(res);
      that.setData({
        shop: res.PageInfo.list,
      });
      // 结束导航条加载动画
      wx.hideNavigationBarLoading();
    });
  },

  /**
   * 去商店
   */
  goToShop: function (e) {
    let sale = e.currentTarget.dataset.salse;
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

  },

  /**
   * 滚动到顶部/左边，会触发 scrolltoupper 事件
   */
  scrollToUpper: function () {

  },

  /**
   * 滚动到底部/右边，会触发 scrolltolower 事件
   */
  scrollToLower: function () {
    console.log(9999)
    let that = this;
    pageSize += 20;
    this.getShopBySelect(that.data.select);
  },
})