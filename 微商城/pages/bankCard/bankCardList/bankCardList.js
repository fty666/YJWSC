var app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bank: null,
    glo_is_load: true,
    hasData: false,
    shopcode: '',
    px2rpxWidth: '',
    px2rpxHeight: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    setTimeout(function() {
      funData.getShopCode(app.globalData.user_id, that, (data) => {
        funData.getCardByCode(data.shop_code, that, (data) => {
          let len = data.length;
          if (len <= 0) {
            that.setData({
              hasData: false,
              glo_is_load: false,
            });
          } else {
            for (let i = 0; i < len; i++) {
              data[i].card_no = util.bankCardByStar(data[i].card_no);
            }
            that.setData({
              card: data,
              hasData: true,
              glo_is_load: false,
            });

          }
        });
      });
    }, 1000);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    // 获取shopcode
    funData.getShopCode(app.globalData.user_id, that, (data) => {
      that.setData({
        shopcode: data.shop_code
      })
    });
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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad();
  },

  /**
   * 选择银行卡
   */
  selectBankCard: function(e) {
    let prevUrl = util.getPrevPageUrl();
    wx.navigateTo({
      url: '/' + util.getPrevPageUrl() + '?cid=' + e.currentTarget.dataset.cid
    })
  },

  /**
   * 添加银行卡
   */
  addCard: function() {
    wx.navigateTo({
      url: '/pages/bankCard/addBankCard/addBankCard'
    })
  },

  /**
   * 设置默认
   */
  setCardDefault: function(e) {
    let that = this;
    let cid = e.currentTarget.dataset.cid;
    let card = that.data.card;
    let len = card.length;
    for (let i = 0; i < len; i++) {
      if (card[i].cid == cid) {
        card[i].is_default = 1;
      } else {
        card[i].is_default = 0;
      }
    }
    funData.updateCardDefault(cid, that.data.shopcode, that, () => {
      that.setData({
        card: card
      });
      wx.showToast({
        title: '设置默认成功',
        icon: 'success',
        duration: 1000
      });
    });
  },

  /**
   * 解除绑定
   */
  unbindBankCard: function(e) {
    let that = this;
    let cid = e.currentTarget.dataset.cid;
    wx.showModal({
      title: '提示',
      content: '是否确定要解除',
      success: function(res) {
        if (res.confirm) {
          funData.deleteCard(cid, that, () => {
            // 重新获取数据
            funData.getShopCode(app.globalData.user_id, that, (data) => {
              funData.getCardByCode(data.shop_code, that, (data) => {
                let len = data.length;
                if (len <= 0) {
                  that.setData({
                    hasData: false,
                    glo_is_load: false,
                  });
                } else {
                  for (let i = 0; i < len; i++) {
                    data[i].card_no = util.bankCardByStar(data[i].card_no);
                  }
                  that.setData({
                    card: data,
                    hasData: true,
                    glo_is_load: false,
                  });
                }
              });
            });
            wx.showToast({
              title: '解除绑定成功',
              icon: 'success',
              duration: 1000
            });
          });
        }
      }
    })
  },
})