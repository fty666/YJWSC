const app = getApp();
const util = require('../../../utils/util.js');
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: null,
    aliyunUrl: urlData.uploadFileUrl,
    start: [0, 1, 2, 3, 4],
    status: 5, // 完成评论订单状态改为5
    key: {},
    detail: {},
    commentImg: {},
    px2rpxWidth: '',
    px2rpxHeight: '',
    texts: '',//判断前台是否使用文本框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 页面初始化 options为页面跳转所带来的参数
    funData.getOrderDetail(options.order_uuid, that, (data) => {
      // console.log(data);
      let order = funData.dealOrderData(data)[0];
      console.log(order.goods);
      let lens = order.goods.length;
      console.log(lens)
      if (lens >= 2) {
        that.setData({
          texts: 'input'
        })
      } else {
        that.setData({
          texts: 'text'
        })
      }
      console.log(that.data.texts)
      // 为每个商品添加空的 评价等级,评价详情,评价图片
      let goods = order.goods;
      let len = goods.length;
      let key = {};
      let detail = {};
      let commentImg = {};
      for (let i = 0; i < len; i++) {
        key[goods[i].goodsId] = -1;
        detail[goods[i].goodsId] = '';
        commentImg[goods[i].goodsId] = [];
      }
      that.setData({
        order: order,
        key: key,
        detail: detail,
        commentImg: commentImg
      });
    });
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

  },

  /**
   * 评价星星等级
   */
  getStart: function (e) {
    let key = this.data.key;
    let index = e.currentTarget.dataset.index + 1;
    let goodsId = e.currentTarget.dataset.goodsid;
    // console.log(goodsId);
    key[goodsId] = index;
    // console.log(key);
    this.setData({
      key: key
    });
  },

  /**
   * 评论详情
   */
  commentDetail: function (e) {
    let goodsId = e.currentTarget.dataset.goodsid;
    let detail = this.data.detail;
    detail[goodsId] = e.detail.value;
    // console.log(detail);
    this.setData({
      detail: detail
    });
  },

  /**
   * 添加图片
   */
  addImg: function (e) {
    let that = this;
    // console.log(e)
    let goodsId = e.currentTarget.dataset.goodsid;
    let commentImg = that.data.commentImg;
    funData.myUpload(function (fileNmae) {
      commentImg[goodsId].push(fileNmae);
      that.setData({
        commentImg: commentImg
      });
    });
  },

  /**
   * 删除图片
   */
  cancleImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    // console.log(index)
    let goodsId = e.currentTarget.dataset.goodsid;
    let commentImg = that.data.commentImg;
    let gooodsImg = commentImg[goodsId];
    gooodsImg.splice(index, 1);
    commentImg[goodsId] = gooodsImg;
    // console.log(commentImg)
    that.setData({
      commentImg: commentImg
    });

  },

  /**
   * 提交评论
   */
  commitComment: function () {
    let that = this;
    let key = that.data.key;
    let goods = that.data.order.goods;
    let len = goods.length;
    // 只要有一个商品的五星评价为空都不能通过
    for (let i = 0; i < len; i++) {
      // console.log(key);
      // console.log(goods[i])
      if (key[goods[i].goodsId] == -1) {
        util.showToast('请填写评价', 'warning');
        return;
      }
    }
    let goodsId = '';
    let detail = '';
    let img = '';
    let grade = '';
    let user_id = app.globalData.user_id;
    let order_mainid = that.data.order.order_mainid;
    let commentImg = that.data.commentImg;
    let detailData = that.data.detail;
    let gradeData = that.data.key;
    for (let j = 0; j < len; j++) {

      // 评论详情为空
      if (detailData[goods[j].goodsId] == undefined || detailData[goods[j].goodsId] == '' || detailData[goods[j].goodsId] == null) {
        detailData[goods[j].goodsId] = '@';
      }
      // 图片为空
      if (commentImg[goods[j].goodsId].length <= 0) {
        commentImg[goods[j].goodsId].push('@');
      }

      goodsId += goods[j].goodsId + ',';
      detail += detailData[goods[j].goodsId] + ',';
      grade += gradeData[goods[j].goodsId] + ',';
      img += String(commentImg[goods[j].goodsId]) + '/';
    }

    console.log(img)

    // 商品评论
    let data = {
      goodsId: goodsId,
      detail: detail,
      // user_id: app.globalData.user_id,
      user_id: 4,
      // user_id:user_id,            
      img: img,
      order_mainid: order_mainid,
      status: 5,
      grade: grade,
      mold: 1,
    }

    //添加评论
    funData.insertComment(data, that, () => {
      util.showToast('评价完成', 'success');
      wx.redirectTo({
        url: '/pages/user/order/order',
      })
    });
  },


})