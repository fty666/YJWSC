const app = getApp();
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
const template = require('../../../template/template.js');
const util = require('../../../utils/util.js');
Page({
  data: {
    cate_one_data: [],
    this_cate_id: 0,
    glo_is_load: false,
    // 分组ID
    groupids: "",
    // 所有店铺
    shops: [],
    pages: 1,
    pasesize: 10,
    // 阿里
    upload_file_url: URLData.upload_file_url,
    have: false, //判断是否有店铺
    px2rpxWidth: '',
    px2rpxHeight: '',
  },

  // 店铺跳转
  mall_list_bind: function(e) {
    // console.log(e)
    let groupid = e.currentTarget.dataset.id;
    // console.log(e.currentTarget.dataset.id)
    if (groupid == 1) {
      // 跳转去外卖
      wx.navigateTo({
        url: '/pages/takeout/index/index',
      })
    } else {
      wx.navigateTo({
        url: '../shoplist/shoplist?groupid=' + groupid + '&shop_code=' + e.currentTarget.dataset.shop_code
      })
    }

  },

  onLoad: function(options) {
    // console.log(options)
    let gid = options.gid
    this.setData({
      groupids: gid
    })
    var that = this;
    let shop = '';

    function classify(res) {
      // console.log(res)
      //   所有店铺
      that.setData({
        shops: res.PageInfo.list,
        have: util.isEmpty(res.PageInfo.list)
      })
    }
    utilFunctions.getShopUrl(gid, that.data.pages, that.data.pasesize, classify, this)

    // 商品模糊查询
    let arrayVal = options.gname;
    let groupId = 0;
    if (arrayVal) {
      function gets(res) {
        // console.log(res)
        that.setData({
          shops: res.PageInfo.list,
          have: util.isEmpty(res.PageInfo.list)
        })
      }
      utilFunctions.getShopByName(arrayVal, that.data.pages, that.data.pasesize, groupId, gets, this)
    }

  },



  /**
   * 数据加载
   */
  onReady: function() {
    let that = this;
    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function(res) {
        // console.log(res)
        that.setData({
          px2rpxHeight: res.data.px2rpxHeight,
          px2rpxWidth: res.data.px2rpxWidth,
        })
      }
    })
  },

  /**
   * 收藏店铺
   */
  show: function(e) {
    let shopcode = e.currentTarget.dataset.shop_code
    let that = this
    function collect(res) {
      // 获取所有店铺
      function classify(res) {
        //   所有店铺
        that.setData({
          shops: res.PageInfo.list
        })
      }
      utilFunctions.getShopUrl(that.data.groupids, that.data.pages, that.data.pasesize, classify, this)
      // wx.showToast({
      //   title: '收藏成功',
      //   icon: 'success',
      //   duration: 1500
      // })
    }
    utilFunctions.insterCollect(shopcode, collect, this)
  },



  /**
   * 滚动到底部/右边，会触发 scrolltolower 事件
   */
  scrollToLower: function() {
    let that = this;
    let pageSize = that.data.pasesize;
    let page = that.data.pages;
    let gid = that.data.groupids;
    pageSize += 20;

    function classify(res) {
      // console.log(res)
      //   所有店铺
      that.setData({
        shops: res.PageInfo.list
      })
    }
    utilFunctions.getShopUrl(gid, page, pageSize, classify, this)
  },

})