const funData = require('../../../utils/functionMethodData.js');
const utilFunctions = require('../../../utils/functionData.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_load: true,
    shop_code: '',
    shop_class: [],
    fullinfo: '',//满减活动
    px2rpxWidth: '',
    px2rpxHeight: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      shop_code: options.shopcode,
      is_load: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    function calback(res) {
      console.log(res)
      that.setData({
        fullinfo: res
      })
    }
    utilFunctions.getReductionUrl(that.data.shop_code, calback, this);
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
   * 修改分类(失去焦点事件)
   */
  editFull: function (e) {
    let that = this;
    let fullinfo = that.data.fullinfo;
    let index = e.currentTarget.dataset.index;
    let reductionId = e.currentTarget.dataset.reductionid;
    let full_reductionPrice = e.detail.value.split('-');
    if (full_reductionPrice.length < 2) {
      wx.showModal({
        title: '填写格式不正确',
      });
      return;
    }
    let full = full_reductionPrice[0];
    // console.log(full)
    let reductionPrice = full_reductionPrice[1];
    // console.log(reductionPrice)
    if (parseInt(full) <= parseInt(reductionPrice)) {
      wx.showModal({
        title: '提示',
        content: '优惠大于满减，添加失败',
      })
      return false;
    }
    if (!parseFloat(full) || !parseFloat(reductionPrice)) {
      wx.showModal({
        title: '填写格式不正确',
      });
      return;
    }
    console.log(full_reductionPrice);
    if (util.isEmpty(reductionId)) {
      // 分类id为空时,添加满减
      function calback(data) {
        console.log(data)
        fullinfo[index].reductionId = data.reductionId;
        fullinfo[index].full = data.full;
        fullinfo[index].reductionPrice = data.reductionPrice;
        that.setData({
          fullinfo: fullinfo
        });
        wx.showToast({
          title: '添加成功',
        })
      }
      utilFunctions.insertReduction(that.data.shop_code, full, reductionPrice, this, calback)

    } else {
      // 满减id不为空时,修改满减
      function calback() {
        wx.showToast({
          title: '修改成功',
        })
      }
      utilFunctions.updateReduction(reductionId, full, reductionPrice, that.data.shop_code, calback, this);
    }
  },

  /**
   * 删除满减
   */
  delFull: function (e) {
    console.log(99999)
    let that = this;
    let fullinfo = this.data.fullinfo;
    // 获取满减id
    let reductionId = e.currentTarget.dataset.reductionid;
    let index = e.currentTarget.dataset.index;
    if (!util.isEmpty(reductionId)) {
      wx.showModal({
        title: '提示',
        content: '确定要删除此满减吗?',
        success: function (res) {
          if (res.confirm) {
            function calback() {
              wx.showToast({
                title: '删除成功',
              })
            }
            utilFunctions.deleteReductionUrl(that.data.shop_code, reductionId, () => { }, that)
            if (fullinfo.length == 1) {
              wx.showToast({
                title: '保留最后一位',
              })
              return false;
            }
            // 直接删除
            fullinfo.splice(index, 1);
            that.setData({
              fullinfo: fullinfo
            });
          } else if (res.cancel) {

          }
        }
      });
    } else {
      fullinfo.splice(index, 1);
      that.setData({
        fullinfo: fullinfo
      });
    }
  },

  /**
   * 添加分类
   */
  addFull: function () {
    let that = this;
    let fullinfo = that.data.fullinfo;
    if (util.isEmpty(fullinfo)) {
      fullinfo = [];
    } else {
      fullinfo.push({ full: '', reductionPrice: '', reductionId: '' });
    }

    that.setData({
      fullinfo: fullinfo
    });
  },

});
