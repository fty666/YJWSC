//获取应用实例
var app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const util = require('../../../utils/util.js');
var cardNum = null;

Page({
  data: {
    shopInfo: null,
    card: null,
    deposit: '',
    owner: '',
    shopcode: '',
    px2rpxWidth: '',
    px2rpxHeight: '',
    // 可以提现的额度
    pay_account: '',
    ID_card: '', //IDcards
  },

  // 加载
  onLoad: function(options) {
    var that = this;
    // 获取shopcode
    funData.getShopCode(app.globalData.user_id, that, (data) => {
      that.setData({
        shopcode: data.shop_code
      })
      let shopcode = data.shop_code;
      // 获取商店信息
      funData.getShopbycode(shopcode, that, (data) => {
        var card = null;
        if (util.getPrevPageUrl() == 'pages/myself/myself') {
          card = data.card;
          cardNum = card.card_no;
          card.card_no = util.bankCardByStar(card.card_no);
          that.setData({
            shopInfo: data.shop,
            card: card,
            hasData: true,
            owner: data.card.owner,
            cardNo: data.card.card_no,
          });
        } else if (util.getPrevPageUrl() == 'pages/bankCard/bankCardList/bankCardList') {
          // 上一级页面是从银行卡列表页面跳转过来的  查询选择的银行卡
          funData.getCardById(options.cid, that, (res) => {
            card = res[0];
            cardNum = card.card_no;
            card.card_no = util.bankCardByStar(card.card_no);
            that.setData({
              shopInfo: data.shop,
              card: card,
              hasData: true
            });
          });
        }
      });
      // 获取可以提现的金额
      function calbacks(res) {
        that.setData({
          pay_account: res.payAccount
        })
      }
      funData.getPayAccount(shopcode, that, calbacks)
    })

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
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




  // 全部提现
  allDeposit: function() {
    let deposit = '0.00';
    if (this.data.shopInfo) {
      deposit = this.data.shopInfo.pay_account;
    } else {
      deposit = '0.00';
    }
    this.setData({
      deposit: deposit
    });
  },

  // 更换银行卡
  changeBankCard: function() {
    wx.navigateTo({
      url: '/pages/bankCard/bankCardList/bankCardList',
    })
  },


  // 提现金额
  withdrawPrice: function(e) {
    let that = this;
    let deposit = e.detail.value;
    let price = Number(deposit);
    // 输入金额校验
    if (!util.checkReg(4, price)) {
      wx.showToast({
        title: '请输入正确金额',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    if (deposit > that.data.shopInfo.pay_account) {
      wx.showToast({
        title: '超过可提现金额',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    this.setData({
      deposit: deposit
    });
  },

  // 提现
  extract: function() {
    let that = this;
    let cardNo = that.data.cardNo;
    if (cardNo == '' || cardNo == undefined || cardNo == null) {
      wx.showToast({
        title: '请先添加银行卡',
        icon: 'none'
      })
      return false;
    }
    let pay_account = that.data.shopInfo.pay_account;
    let deposit = that.data.deposit;
    // 提现金额验证
    if (deposit == '0.00' || deposit == '') {
      wx.showToast({
        title: '请输入提取金额',
        icon: 'none',
        duration: 2000
      });
      return;
    } else if (deposit > pay_account) {
      wx.showToast({
        title: '提现金额过大',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (that.data.deposit < 100) {
      wx.showToast({
        title: '提现金额不能小于100',
        icon: 'none'
      })
      return false;
    }
    let datas = {
      shopCode: that.data.shopcode,
      card_no: cardNum,
      price: that.data.deposit,
      owner: that.data.owner
    };
    funData.withdraw(datas, that, () => {
      wx.showToast({
        title: '提现成功',
        icon: 'none',
        duration: 2000
      });
    });
  },

  /**
   * 查看明细
   */
  showDetail: function() {
    wx.navigateTo({
      url: '/pages/myself/myMoney/moneyDeatail/moneyDeatail',
    })
  },
})