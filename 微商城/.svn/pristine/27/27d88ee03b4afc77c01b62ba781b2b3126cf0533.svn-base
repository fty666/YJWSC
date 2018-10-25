// pages/user/service/service.js
const app = getApp()
const utilFunctions = require('../../../utils/functionData.js');
const util = require('../../../utils/util.js');
const URLData = require('../../../utils/data.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oid:"",
    gid:"",
    price:"",
    ginfo:"",
    nums:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that=this
    that.setData({
      oid: options.oid,
      gid: options.gid,
      price: options.sum,
      nums:options.num
    })

    // 查询商品详情
    function goods(res){
      console.log(res)
      that.setData({
        ginfo:res
      })
    }
    utilFunctions.getGoodsDetails(that.data.gid,goods,this)
  },

  /**
   *提交申请 
   */ 
  formSubmit: function (e) {
    let that=this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let status = e.detail.value.radio
    let str = e.detail.value.checkbox
    console.log(e.detail.value.checkbox)
    function ti(res){}
    utilFunctions.insertGoodBack(that.data.oid,that.data.gid,that.data.price,status,str,that.data.ginfo,that.data.nums,ti,this)

    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    })
    wx.navigateBack({
      delta: 2
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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