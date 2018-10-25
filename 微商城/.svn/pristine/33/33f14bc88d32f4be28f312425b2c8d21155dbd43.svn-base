const funData = require('../../../utils/functionMethodData.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_load: true,
    shop_code: '',
    shop_class: [],
    px2rpxWidth: '',
    px2rpxHeight: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    funData.getShopCode(getApp().globalData.user_id, that, (data) => {
      that.setData({
        shop_code: data.shop_code
      });
      funData.getFoodClass(data.shop_code, that, (res) => {
        console.log(res);
        that.setData({
          is_load: false,
          shop_class: res
        });
      });
    });
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
    let that = this;
    // 加载类别
    funData.getShopCode(getApp().globalData.user_id, that, (data) => {
      funData.getFoodClass(that.data.shop_code, that, (res) => {
        console.log(res);
        that.setData({
          is_load: false,
          shop_class: res
        });
      });
    });
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
   * 修改分类(失去焦点事件)
   */
  editClass: function (e) {
    let that = this;
    let classId = e.currentTarget.dataset.classid;
    let className = e.detail.value;
    let len = className.length;
    console.log(len)
    if (len <= 0) {
      wx.showToast({
        title: '类名不能为空',
        icon: 'none'
      })
      return false;
    }
    console.log(className);
    if (util.isEmpty(classId)) {
      // 分类id为空时,添加分类
      funData.insertFoodsClass(that.data.shop_code, className, that, (res) => {
      });
    } else {
      // 分类id不为空时,修改分类
      funData.updateFoodsClass(classId, className, that, (res) => {
      });
    }
    // 加载类别
    funData.getShopCode(getApp().globalData.user_id, that, (data) => {
      funData.getFoodClass(that.data.shop_code, that, (res) => {
        console.log(res);
        that.setData({
          is_load: false,
          shop_class: res
        });
      });
    });

  },

  /**
   * 删除分类
   */
  delClass: function (e) {
    console.log(e)
    let that = this;
    let shop_class = that.data.shop_class;
    // 获取分类id
    let classId = e.currentTarget.dataset.classid;
    let index = e.currentTarget.dataset.index;
    if (!util.isEmpty(classId)) {
      wx.showModal({
        title: '提示',
        content: '确定要删除此分类吗?',
        success: function (res) {
          if (res.confirm) {
            // 分类下有商品不能删除
            funData.getFoodGoods(
              {
                shopCode: that.data.shop_code,
                page: 1,
                pageSize: 1,
                isUse: 1,
                foodsClassId: classId
              },
              that, (data) => {
                console.log(data);
                if (!util.isEmpty(data.PageInfo.list)) {
                  wx.showModal({
                    title: '此分类下有商品,不能删除'
                  });
                } else {
                  // 执行删除
                  funData.deleteFoodsClass(classId, that, () => {
                    wx.showToast({
                      title: '删除成功',
                      icon: 'success',
                      duration: 1000
                    });
                    shop_class.splice(index, 1);
                    that.setData({
                      shop_class: shop_class
                    });
                  });

                }
              }
            );
          } else if (res.cancel) {

          }
        }
      });
    } else {
      // 没有classId直接删除
      shop_class.splice(index, 1);
      that.setData({
        shop_class: shop_class
      });
    }
  },

  /**
   * 添加分类
   */
  addClass: function () {
    let that = this;
    let shop_class = that.data.shop_class;

    // 添加分类
    if (util.isEmpty(shop_class)) {
      shop_class = [];
    }
    shop_class.push({ shop_code: that.data.shop_code, classId: '', className: '' });
    that.setData({
      shop_class: shop_class
    });
  },
})