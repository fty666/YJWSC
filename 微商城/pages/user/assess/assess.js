// pages/user/assess/assess.js
const app = getApp()
const utilFunctions = require('../../../utils/functionData.js');
const util = require('../../../utils/util.js');
const URLData = require('../../../utils/data.js');
const funData = require('../../../utils/functionMethodData.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../../images/normal.png',
    selectedSrc: '../../../images/selected.png',
    halfSrc: '../../../images/half.png',
    key: 0,//评分
    gid: "",
    detail: "",
    img: [],
    photo: [],
    check:false,
    // 订单编号
    mainid:"",
    px2rpxWidth: '',
    px2rpxHeight: '',

  },

  // /**
  //  *五星好评 
  //  */ 
  //点击右边,半颗星
  selectLeft: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 1 && e.currentTarget.dataset.key == 1) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    // console.log("得" + key + "分")
    this.setData({
      key: key
    })
  },
  //点击左边,整颗星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    // console.log("得" + key + "分")
    this.setData({
      key: key
    })
  }, 

  /**
   *上传图片 
   */
  files: function () {
    let that = this;
    let photos = that.data.photo
    let image=that.data.img
    utilFunctions.myUpload(function (newsrc, fileNmae) {
      photos.push(fileNmae)
      image.push(newsrc)
      that.setData({
        photo:photos,
        img:image
      })
      // 上传图片
      function imgs(res) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  /**
   *评价商品
   */ 
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let detail = e.detail.value.ping
    let that = this
    function assess(res) { 
        // 跳转页面
        wx.navigateBack({
            delta: 2
        })
    }
    // 商品评论
    let data = {
        goodsId: that.data.gid,
        detail: detail,
        // user_id: app.globalData.user_id,
        user_id: 4,
        img:that.data.photo,
        order_mainid: that.data.mainid,
        status: 5,
        grade: that.data.key,
        mold: 1,
    }
    // utilFunctions.insertComment(that.data.gid, detail, that.data.key, that.data.photo, that.data.mainid, assess, this)
    funData.insertComment(data,this,assess)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    console.log(options)
    that.setData({
      gid: options.gid,
      mainid: options.mainid
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