var app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const util = require('../../../utils/util.js');
var i = 60;
var cleat_set = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    validate: true, // 验证手机号使用
    edit_code: '',
    shopInfo: null,
    isshop_name: 'N',
    istel: 'N',
    disabled: false,
    shop_name: '',
    address: {
      area_detail: '',
      is_default: 0,
      latitude: '',  // 纬度
      longitude: '', // 经度
    },
    tel: '',
    send: '',//验证码
    send_code: '点击获取验证码',
    location: '',  // 定位地址
    show: '',//显示定位
    px2rpxHeight: '',
    px2rpxWidth: '',
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
    var that = this;
    // 查询商家信息
    // console.log(app.globalData.user_id)
    funData.getShopByCode(app.globalData.user_id, that, (data) => {
      // funData.getShopByCode(1, that, (data) => {
      // console.log(data);
      that.setData({
        shopInfo: data.shop,
      });
    });

    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function (res) {
        // console.log(res)
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
   *  修改-获取验证手机
   */
  validateTel: function (e) {
    this.setData({
      tel: e.detail.value
    });
  },

  yanzhen: function (e) {
    // console.log(e.detail.value)
    this.setData({
      send: e.detail.value
    })
  },

  /**
   * 修改-获取输入验证码
   */
  validateCode: function (e) {
    that.setData({
      edit_code: e.detail.value
    });
  },

  /**
   * 修改-验证
   */
  validateTelCode: function () {
    let that = this;
    // 获取手机号和验证码
    let data = {
      user_id: app.globalData.user_id,
      shop_code: that.data.shopInfo.shop_code,
      mobile: that.data.tel,
      smsCode: that.data.send
    }
    funData.verificationSms(data, that, (res) => {
      if (res == '1') {
        that.setData({
          validate: 'false',
          tel: '',
          disabled: false,
          send_code: '点击获取验证码',
        });
        i = 60;
        clearInterval(cleat_set);
      } else {
        wx.showToast({
          title: '验证信息不正确',
          icon: 'success',
          duration: 1000
        });
      }
      return;
    });
  },

  /**
   * 店铺名称
   */
  editShop_name: function (e) {
    this.setData({
      shop_name: e.detail.value,
      isshop_name: 'Y',
    });
  },

  /**
   * 获取输入手机号
   */
  getTel: function (e) {
    // console.log(e.detail.value)
    this.setData({
      tel: e.detail.value,
      istel: 'Y',
    });
  },

  /**
   * 发送验证码
   */
  sendCode: function () {
    let that = this;
    // console.log(that.data.tel)
    // 验证手机号
    if (!util.checkReg(1, that.data.tel)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    // 验证码按钮倒计时
    cleat_set = setInterval(function () {
      that.setData({
        send_code: '重新发送(' + i + 's)',
        disabled: true,
      });
      i--;
      if (i < 0 || i == '') {
        clearInterval(cleat_set);
        that.setData({
          send_code: '点击获取验证码',
          disabled: false
        });
        i = 60;
      }
    }, 1000);

    // 获取验证码
    funData.getSms(that.data.tel, that, () => {
      wx.showToast({
        title: '注意查收',
        icon: 'success',
        duration: 1000
      });
    });
  },

  /**
   * 定位
   */
  locationing: function () {
    // console.log(111);
    let that = this;
    let address = that.data.address;
    funData.amapFilePackage((data) => {
      // console.log(data);
      address.area_detail = data[0].regeocodeData.pois[0].name;
      let longitude_latitude = data[0].regeocodeData.pois[0].location.split(',');
      // console.log(longitude_latitude)
      address.longitude = longitude_latitude[0];
      address.latitude = longitude_latitude[1];
      that.setData({
        location: data[0].regeocodeData.pois,
        address: address,
        show: true
      });
    }, null);
    // console.log(address)
  },

  /**
   * 选择定位地址
   */
  getLocation: function (e) {
    let that = this;
    let address = that.data.address;
    let locationName = e.currentTarget.dataset.locationname;
    let longitude_latitude = e.currentTarget.dataset.titude.split(',');
    address.area_detail = locationName;
    address.longitude = longitude_latitude[0];
    address.latitude = longitude_latitude[1];
    that.setData({
      address: address,
      location: ''
    });
    // console.log(address);
  },


  /**
   * 修改商家信息
   */
  editShopInfo: function (e) {
    let that = this;
    let val = e.detail.value;
    console.log(val)
    // 内容不能为空
    // if (util.isEmpty(val.ShopName) || util.isEmpty(val.mobile) || util.isEmpty(val.smsCode) || util.isEmpty(val.shop_addr) || util.isEmpty(val.shop_detail)) {
    //   wx.showToast({
    //     title: '信息不能为空',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return;
    // }
    // 判断手机号
    if (that.data.shopInfo.groupId == 1) {
      // 起送价
      if (val.initialMoney.length >= 1) {
        if (val.initialMoney < 25) {
          wx.showToast({
            title: '起送价输入错误',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
    }

    if (val.mobile.length > 1) {
      if (!util.checkReg(1, val.mobile)) {
        wx.showToast({
          title: '手机号不正确',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }



    // 判断验证码
    // if (!(/\^d{6}$/.test(val.smsCode))){
    //     console.log('8888888888')
    //     wx.showToast({
    //         title: '验证码不正确',
    //         icon: 'none',
    //         duration: 2000
    //     })
    //     return;
    // }

    let out = '';
    if (that.data.shopInfo.groupId == 1) {
      out = 'Y';
    } else {
      out = 'N';
    }

    let data = {
      shop_code: that.data.shopInfo.shop_code,
      groupId: that.data.shopInfo.groupId,
      shop_name: val.ShopName,
      isshop_name: that.data.isshop_name,
      shop_addr: val.shop_addr,
      shop_detail: val.shop_detail,
      shop_tip: val.shop_tip,
      mobile: val.mobile,
      istel: that.data.istel,
      latitude: that.data.address.latitude,
      longitude: that.data.address.longitude,
      smsCode: val.smsCode,
      out: out
    }
    console.log(data);
    funData.updateInfoByCode(data, that, () => {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1000,
        success: function () {
          wx.redirectTo({
            url: '/pages/myself/myself'
          })
        }
      });
    })
  },
})