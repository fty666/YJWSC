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
  onLoad: function(options) {
    let arrayVal = options.arrayVal
    let that = this;
    let groupId = 1;

    function gets(res) {
      that.setData({
        shop: res.PageInfo.list
      })
    }
    utilFunctions.getShopByName(arrayVal, page, pageSize, groupId, gets, that)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
  },
  /**
   * 条件选择
   */
  requirementSelect: function(e) {
    let that = this;
    let select = e.currentTarget.dataset.select;
    let query = select;
    pageSize = 20;
    if (select == 'distance') {
      let location = that.data.location.split(',');
      query = ['distance', [location[0]],
        [location[1]]
      ];
    };
    that.getShopBySelect(query);
    that.setData({
      select: select
    });
  },

  //查询店铺
  takes: function(e) {
    let arrayVal = e.detail.value;
    let that = this;
    let groupIdd = '1';
    function gets(res) {
      that.setData({
        shop: res.PageInfo.list
      })
    }
    utilFunctions.getShopByName(arrayVal, page, pageSize, groupIdd, gets, that)
  },

  // 根据条件查询店铺
  getShopBySelect: function(myselect) {
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
  goToShop: function(e) {
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
   * 滚动到底部/右边，会触发 scrolltolower 事件
   */
  scrollToLower: function() {
    let that = this;
    pageSize += 20;
    this.getShopBySelect(that.data.select);
  },
})