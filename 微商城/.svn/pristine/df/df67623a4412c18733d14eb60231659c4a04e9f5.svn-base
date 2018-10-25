// pages/users/users/users.js
var util = require('../../../utils/util.js');
const app = getApp();
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
var env = require('../../../weixinFileToaliyun/env.js');
var uploadAliyun = require('../../../weixinFileToaliyun/uploadAliyun.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userinfo:"",
    // 呢称
    necheng: "请设置新的呢称",
    phone:"绑定新的电话号码",
    // 头像
    img: "",
    covering_layer_hidden: true,
    immediate_sale_hidden: true,
    serverUrl: app.globalData.aliyunServerURL,
    // 阿里
    upload_file_url: URLData.upload_file_url,
  },

  // 日期单击事件
  bindPicker: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  cancel_sale: function () {
    this.setData({
      immediate_sale_hidden: true
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    function userinfo(res){
      console.log(res)
      that.setData({
        userinfo:res
      })
    }
    utilFunctions.getUserurl(userinfo,this)

  },

  // 修改呢称
  names:function(e){
      // console.log(e)
      let that=this
      let user_name = e.detail.value
      function uname(res){
        wx: wx.showToast({
          title: '修改成功',
          icon: 'success',
        })
      }
      utilFunctions.updateUserInfo(user_name, uname,this)

  },

  /**
   * 用户电话
   */
  phones:function(e){
    // console.log(e)
    let that = this
    let telephone = e.detail.value

    if (!util.checkReg(1, telephone)) {
      wx.showToast({
        icon: 'none',
        title: '手机号不正确'
      });
      return;
    }
    function uphone(res){
      wx:wx.showToast({
        title: '修改成功',
        icon: 'success',
      })
    }
    utilFunctions.updateUserphone(telephone, uphone, this)
  },

  /*
  修改头像
  */ 


  //拍摄照片
  photo: function () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      }
    })
    this.setData({
      immediate_sale_hidden: true
    });
  },

  // 本地上传
  local: function () {
    let that = this;
    utilFunctions.myUpload(function (newsrc, fileNmae) {
      that.setData({
        mimg: fileNmae,
        img: newsrc
      })
      // 上传图片
      function imgs(res) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })
      }
      utilFunctions.updateUserphoto(that.data.mimg, imgs, this)
      console.log(that.data.mimg)
    })
    that.setData({
      immediate_sale_hidden: true
    });
  },

  // 头像上传事件
  immediate_sales: function () {
    this.setData({
      immediate_sale_hidden: false
    });
  },
  cancel_sale: function () {
    this.setData({
      immediate_sale_hidden: true
    });
  },

  /**
   *修改完成跳转 
   */ 
  bttns:function(){
    wx.switchTab({
      url: '/pages/user/index/index',
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