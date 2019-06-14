var app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bank: '',
    shopcode: '',
    px2rpxWidth: '',
    px2rpxHeight: '',
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    let uid = app.globalData.user_id;

    function scode(res) {
      that.setData({
        shopcode: res.shop.shop_code
      });
    }
    funData.getShopByCode(uid, this, scode);
    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function(res) {
        that.setData({
          px2rpxHeight: res.data.px2rpxHeight,
          px2rpxWidth: res.data.px2rpxWidth,
        })
      }
    })
  },


  /**
   * 选择银行
   */
  selectBank: function(e) {
    this.setData({
      bank: e.currentTarget.dataset.bank
    });
  },

  /**
   * 添加银行卡
   */
  addBankCard: function(e) {
    let that = this;
    let cardInfo = e.detail.value;
    // 所有信息不能为空
    if (cardInfo.owner == "" || cardInfo.mobile == "" || cardInfo.ID_card == "" || cardInfo.card_no == "" || that.data.bank == "") {
      wx.showToast({
        title: '请填写正确信息',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    // 验证身份证和银行卡号
    if ((!util.checkReg(2, cardInfo.ID_card)) || (!util.checkReg(3, cardInfo.card_no))) {
      wx.showToast({
        title: '请填写正确信息',
        icon: 'none',
        duration: 1000
      })
      return;
    } else if (that.data.bank == '') {
      wx.showToast({
        title: '请选择正确开户行',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    // 添加银行卡
    funData.insertCard(
      cardInfo.owner,
      cardInfo.ID_card,
      cardInfo.card_no,
      cardInfo.mobile,
      that.data.bank,
      that.data.shopcode,
      that, (res) => {
        wx.redirectTo({
          url: '/pages/bankCard/bankCardList/bankCardList',
        })
        wx.showToast({
          title: '添加银行卡成功',
          icon: 'none'
        })
      });
  },


})