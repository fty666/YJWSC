const app = getApp()
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
const calculate = require('../../../utils/calculate.js');
Page({
  data: {
    quan_list: [],
    glo_is_load: true,
    page: 1,
    pageSize: 10
  },
  onLoad: function (options) {
    let that = this
    console.log(options)
    let uid = options.uid
    //查询是否有优惠卷 
    function able(res) {
      console.log(res)
    }
    utilFunctions.getUserCoupon(uid, that.data.page, that.data.pageSize, able, this)
  },

  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    _function.getShopUserQuanlist(wx.getStorageSync("utoken"), -1, that.initgetShopUserQuanlistData, that);
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
})