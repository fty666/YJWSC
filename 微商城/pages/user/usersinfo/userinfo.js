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
    userinfo: "",
    // 呢称
    necheng: "请设置新的呢称",
    phone: "绑定新的电话号码",
    // 头像
    img: "",
    covering_layer_hidden: true,
    immediate_sale_hidden: true,
    phones: false,
    serverUrl: app.globalData.aliyunServerURL,
    // 阿里
    upload_file_url: URLData.upload_file_url,
    susses: false,//判断是否修改成功
    // 用户提交信息
    user_name: '',
    telephone: '',
    mimg: '',
    px2rpxWidth: '',
    px2rpxHeight: '',
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
    let that = this
    function userinfo(res) {
      console.log(res)
      that.setData({
        userinfo: res,
        img: res.photo,
        telephone: res.telephone,
      })
    }
    utilFunctions.getUserurl(userinfo, this)

  },

  // 修改呢称
  names: function (e) {
    // console.log(e)
    let that = this
    let user_name = e.detail.value
    if (util.isEmpty(user_name)) {
      wx: wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
      })
      return false;
    }
    that.setData({
      user_name: user_name
    })
    //修改电话
    function datas(res){
      wx.showToast({
        title: '修改成功'
      });
    }
    let uname = {
      user_name: user_name,
      user_id: app.globalData.user_id
    }
    utilFunctions.updateUserInfo(datas, uname, that)
  },

  /**
   * 用户电话
   */
  phones: function (e) {
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
    that.setData({
      telephone: telephone,
      phones: true
    })
    //修改电话
    function datas(res) {
      wx.showToast({
        title: '修改成功'
      });
    }
    let uname = {
      telephone: telephone,
      user_id: app.globalData.user_id
    }
    utilFunctions.updateUserInfo(datas, uname, that)
  },

  /*
  修改头像
  */


  //拍摄照片
  photo: function () {
    let that = this;
    utilFunctions.myUpload(function (fileNmae) {
      that.setData({
        mimg: fileNmae,
        img: fileNmae
      })
      function datas(res) {
        wx.showToast({
          title: '修改成功'
        });
      }
      let uname = {
        photo: fileNmae,
        user_id: app.globalData.user_id
      }
      utilFunctions.updateUserInfo(datas, uname, that)
    })
    that.setData({
      immediate_sale_hidden: true
    });
  },

  // 本地上传
  local: function () {
    let that = this;
    utilFunctions.myUpload(function (fileNmae) {
      that.setData({
        mimg: fileNmae,
        img: fileNmae
      })
      function datas(res) {
        wx.showToast({
          title: '修改成功'
        });
      }
      let uname = {
        photo: fileNmae,
        user_id: app.globalData.user_id
      }
      utilFunctions.updateUserInfo(datas, uname, that)
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
  bttns: function () {
    wx.reLaunch({
      url: '/pages/user/index/index',
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