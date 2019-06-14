// pages/takeout/orderfinish/orderfinish.js
const funDta = require('../../../utils/functionMethodData.js');
const utilFunctions = require('../../../utils/functionData.js');
const urlData = require('../../../utils/urlData.js')
const template = require('../../../template/template.js');
const util = require('../../../utils/util.js');
const app = getApp();
var page = 1;
var pageSize = 20;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderinfo: '',
    uploadFileUrl: urlData.uploadFileUrl,
    px2rpxWidth: '',
    px2rpxHeight: '',
    horseManMobile: '', //外卖电话
    shoPmobile: '', //商家电话
    Pmoney: '', //配送费
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let oids = options.oids;
    function odetail(res) {
      that.setData({
        horseManMobile: res[0].horseManMobile,
        shoPmobile: res[0].mobile,
        Pmoney: res[0].money
      })
      res = utilFunctions.dealOrderData(res);
      that.setData({
        orderinfo: res[0],
      })
    }

    utilFunctions.getOrderDetail(oids, odetail, this);
  },

  /**
   *再来一单 
   */
  again: function(e) {
    wx.navigateTo({
      url: '/pages/takeout/shopDetails/shopDetails?shop_code=' + e.currentTarget.dataset.shocode
    })
  },

  /**
   *l联系商家 
   */
  calling: function() {
    let phones = this.data.shoPmobile;
    wx.makePhoneCall({
      phoneNumber: phones,
      success: function() {},
      fail: function() {}
    })
  },

  /**
   *l联系外卖
   */
  horseman: function() {
    let phones = this.data.horseManMobile;
    wx.makePhoneCall({
      phoneNumber: phones,
      success: function() {
      },
      fail: function() {
      }
    })
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

  }
})

// 加载数据
// function loadData(that) {
//     // let that = this;
//     let order_type = 1;
//     let uid = app.globalData.user_id;
//     // let uid = 4;
//     function microplat(res) {
//         // console.log(res.PageInfo.list)
//         res = utilFunctions.dealOrderData(res.PageInfo.list);
//         // console.log(res);
//         that.setData({
//             orderinfo: res,
//         })
//     }
//     utilFunctions.getOrderUrl(uid, order_type, page, pageSize, microplat, this);
// }