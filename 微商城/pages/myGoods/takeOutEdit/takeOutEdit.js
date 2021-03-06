const app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const utilFunctions = require('../../../utils/functionData.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: null,
    category: null,
    list_img_hidden: true,
    swiper_sort: {},
    swiper_img_hidden: true,
    goodsDetail_sort: {},
    goodsDetail_img_hidden: true,
    aliyunUrl: urlData.uploadFileUrl,
    img: '',//页面图片路径
    imgsrc: '',//存入数据库的路径
    px2rpxWidth: '',
    px2rpxHeight: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let that = this;
    // 查询分类
    // funData.getClass(app.globalData.groupId, that, function (data) {
    //     console.log(data);
    //     that.setData({
    //         category: data
    //     });
    // });
    // 获取商品详情
    let gids = options.goodsId;
    utilFunctions.getFoodGoodsDetails(gids, function (data) {
      console.log(data);
      that.setData({
        goodsInfo: data,
        img: data.img,
        imgsrc: data.img
      })
    }, this)
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
  * 添加商品列表图片
  */
  addlistImg: function () {
    let that = this;
    // let goods_picture = that.data.goods_picture;
    // let list_img = goods_picture.list_img;
    // let list_img = [];
    // let list_img_hidden = that.data.list_img_hidden;
    funData.myUpload(function (fileNmae) {
      console.log(fileNmae)
      // if (!util.isEmpty(newsrc)) {
      that.setData({
        img: fileNmae,
        imgsrc: fileNmae
      })
      // }
      // list_img.push({img:fileNmae, sort:0, status:1});
      // if (list_img.length >= 1) {
      //     list_img_hidden = !list_img_hidden;
      // }
      // goods_picture.list_img = list_img;
      // that.setData({
      //     goods_picture: goods_picture,
      //     list_img_hidden: list_img_hidden
      // });
    });
  },

  /**
   * 删除图片
   */
  // cancleImg: function (e) {
  //     let that = this;
  //     let goods_picture = that.data.goods_picture;
  //     let status = e.currentTarget.dataset.status;
  //     let index = e.currentTarget.dataset.index;
  //     if (status == '1') {
  //         let list_img  = goods_picture.list_img;
  //         list_img.splice(index, 1);
  //         goods_picture.list_img = list_img;
  //         that.setData({
  //             goods_picture: goods_picture,
  //             list_img_hidden: true
  //         });
  //     } else if (status == '2') {
  //         let swiper_img = goods_picture.swiper_img;
  //         swiper_img.splice(index, 1);
  //         goods_picture.swiper_img = swiper_img;
  //         that.setData({
  //             goods_picture: goods_picture,
  //             swiper_img_hidden: true
  //         });
  //     } else if (status == '3') {
  //         let goodsDetail_img = goods_picture.goodsDetail_img;
  //         goodsDetail_img.splice(index, 1);
  //         goods_picture.goodsDetail_img = goodsDetail_img
  //         that.setData({
  //             goods_picture: goods_picture,
  //             goodsDetail_img_hidden: true
  //         });
  //     }

  // },
  /**
   * 获取表单提交的值
   */
  formSubmit: function (e) {
    console.log(e.detail.value);
    // 判断价格
    if (!util.checkReg(4, e.detail.value.discount)) {
      wx.showToast({
        title: '请填写正确信息',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    // 判断最大购买量大于最小
    if (e.detail.value.maxnum < 0) {
      wx.showToast({
        title: '填写正确的购买量',
        icon: 'none'
      })
      return false;
    }
    let takes = e.detail.value;
    console.log(this.data.imgsrc)
    takes.img = this.data.imgsrc;
    takes.minnum = 1;
    takes.status = 1;
    takes.sort = 1;
    takes.thumbs_up = this.data.goodsInfo.thumbs_up;
    function calback(res) {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1000,
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myGoods/goodsList/goodsList'
        })
      }, 1500);
    }
    utilFunctions.updateFoodGoodsUrl(takes, calback, this);
  },
})