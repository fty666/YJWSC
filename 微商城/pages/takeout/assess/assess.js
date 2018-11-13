// pages/takeout/assess/assess.js
const funDta = require('../../../utils/functionMethodData.js');
const utilFunctions = require('../../../utils/functionData.js');
const urlData = require('../../../utils/urlData.js')
const template = require('../../../template/template.js');
const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade: 0,
    rider: [0, 1, 2, 3, 4],     //为骑手打分
    star: [0, 1, 2, 3, 4],  //位商家打分
    oid: "",
    orderInfo: "",
    uploadFileUrl: urlData.uploadFileUrl,
    img: [],
    photo: [],
    // 赞评分
    grade: [],
    gid: [],
    order_mainid: "",
    shop_code: "",
    shop_detail: "",
    shop_grade: "",//店铺打分
    rider_grade: "",//为骑手打分
    status: 5,
    comments: {},
    px2rpxWidth: '',
    px2rpxHeight: '',
    bike: '',//骑手信息
    bikeId: '',//骑手ID
    SCfiles: true,//上传图片显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      oid: options.oid
    })
    let oids = options.oid;
    // 获取骑手信息
    let that = this;
    function calbacks(data) {
      console.log(data)
      that.setData({
        bike: data.data,
        bikeId: data.horseManId
      })
    }
    let datas = {
      orderUUID: oids
    }
    funDta.getHorseManByUUID(datas, calbacks, that)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成a
   */
  onReady: function () {
    let orderId = this.data.oid;
    let that = this;
    function odetail(res) {
      res = utilFunctions.dealOrderData(res);
      console.log(res)
      let goods = res[0].goods;
      let len = goods.length;
      let comm = {};
      for (let o = 0; o < len; o++) {
        comm[goods[o].goodsId] = 3;
      }
      that.setData({
        orderInfo: res,
        order_mainid: res[0].order_mainid,
        shop_code: res[0].shop_code,
        comments: comm
      })
    }
    utilFunctions.getOrderDetail(orderId, odetail, this);

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
   *骑手 
   */
  riders: function (e) {
    let index = e.currentTarget.dataset.index + 1;
    this.setData({
      rider_grade: index
    })
  },
  /**
  *五星好评
  */
  high: function (e) {
    console.log(e)
    let index = e.currentTarget.dataset.index + 1;
    this.setData({
      shop_grade: index
    })
  },

  /**
   *上传图片 
  */
  files: function () {
    let that = this;
    let photos = that.data.photo
    let image = that.data.img
    utilFunctions.myUpload(function (fileNmae) {
      photos.push(fileNmae)
      image.push(fileNmae)
      that.setData({
        photo: photos,
        img: image
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
    // console.log(image.length)
    // if (image.length > 3) {
    //   SCfiles: false
    // }
  },

  zanCai: function (e) {
    let that = this;
    let comment = that.data.comments;
    let gid = e.currentTarget.dataset.gid;
    let mytype = e.currentTarget.dataset.type;
    console.log()
    if (mytype == 'zan') {
      comment[gid] = 5;
    } else if (mytype == 'cai') {
      comment[gid] = 1;
    }
    that.setData({
      comments: comment
    });
  },

  /**
   *提交 
   */
  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let shop_detail = e.detail.value.text;
    if (this.data.shop_grade == "") {
      wx.showToast({
        title: '请为商家打分',
      });
      return;
    }
    // 店铺参数
    let goodsId = '';
    let grade = '';
    let comment = this.data.comments;
    console.log(comment)
    let goods = this.data.orderInfo[0].goods;
    let len = goods.length;
    // 商品参数
    let good_detail = '';
    let gmold = 1;
    let good_img = '';
    let mold = '';
    for (let i = 0; i < len; i++) {
      goodsId += goods[i].goodsId + ',';
      good_detail += '@' + ',';
      good_img += '@' + '/';
      mold += 1 + ',';
      if (comment[goods[i].goodsId] == 3) {
        comment[goods[i].goodsId] = 5;
      }
      grade += comment[goods[i].goodsId] + ','
    }
    if (util.isEmpty(shop_detail)) {
      shop_detail = '@' + ',';
    } else {
      shop_detail = e.detail.value.text + ',';
    }
    if (util.isEmpty(this.data.photo)) {
      this.setData({
        photo: '@' + '/'
      })
    }

    // 店铺评价
    let shop = {
      goodsId: this.data.shop_code,
      detail: shop_detail,
      user_id: app.globalData.user_id,
      img: this.data.photo,
      order_mainid: this.data.order_mainid,
      status: this.data.status,
      grade: this.data.shop_grade,
      mold: 2
    }
    // 商品评价
    let data = {
      goodsId: goodsId,
      detail: good_detail,
      user_id: app.globalData.user_id,
      img: '@/',
      order_mainid: this.data.order_mainid,
      status: this.data.status,
      grade: grade,
      mold: mold,
    }
    // 骑手评价
    let horseman = {
      goodsId: this.data.bikeId,
      // goodsId: 55,
      detail: '@',
      user_id: app.globalData.user_id,
      // user_id: 4,
      img: '/@',
      order_mainid: this.data.order_mainid,
      status: this.data.status,
      grade: this.data.rider_grade,
      mold: 3,
    }

    //总参数传递
    let datas = {
      goodsId: data.goodsId + shop.goodsId + ',' + horseman.goodsId,
      detail: data.detail + shop.detail + horseman.detail,
      user_id: app.globalData.user_id,
      img: data.img + shop.img + horseman.img,
      order_mainid: data.order_mainid,
      status: data.status,
      grade: data.grade + shop.grade + ',' + horseman.grade,
      mold: data.mold + shop.mold + ',' + horseman.mold,
    }
    console.log(datas)
    let that = this;
    function calback(res) {
      wx.showToast({
        title: '添加成功',
      })
      wx.navigateTo({
        url: '/pages/takeout/index/index',
      })

    }
    funDta.insertComment(datas, this, calback);

    // 添加外卖评论
    // let datas = {
    //   shop_code: that.data.shop_code,
    //   shop_detail: shop_detail,
    //   user_id: app.globalData.user_id,
    //   shop_grade: this.data.shop_grade,
    //   shop_img: this.data.photo,
    //   order_mainid: this.data.order_mainid,
    //   goodsId: goodsId,
    //   status: 5,
    //   grade: grade
    // }
    // function calback(res){}
    // funDta.insertShopComment(datas, calback, that);
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