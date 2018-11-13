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
    horseManMobile: '',//外卖电话
    shoPmobile: '',//商家电话
    Pmoney: '',//配送费
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    let oids = options.oids;
    function odetail(res) {
      //   console.log(res)
      that.setData({
        horseManMobile: res[0].horseManMobile,
        shoPmobile: res[0].shopMobile,
        Pmoney: res[0].money
      })
      res = utilFunctions.dealOrderData(res);
      console.log(res)
      that.setData({
        orderinfo: res[0],
      })
    }

    utilFunctions.getOrderDetail(oids, odetail, this);
  },

  /**
   *再来一单 
   */
  again: function (e) {
    wx.navigateTo({
      url: '/pages/takeout/shopDetails/shopDetails?shop_code=' + e.currentTarget.dataset.shocode
    })
  },

  /**
   *l联系商家 
   */
  calling: function () {
    console.log('66666')
    let phones = this.data.shoPmobile;
    wx.makePhoneCall({
      phoneNumber: phones,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

  /**
*l联系外卖
*/
  horseman: function () {
    console.log('000000')
    let phones = this.data.horseManMobile;
    wx.makePhoneCall({
      phoneNumber: phones,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
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