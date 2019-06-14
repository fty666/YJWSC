//获取应用实例
var app = getApp();
const urlData = require('../../utils/urlData.js');
const funData = require('../../utils/functionMethodData.js');
const util = require('../../utils/util.js');
const md5 = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // shopCode:app.globalData.shopCode,
    user_id: app.globalData.user_id,
    aliyunUrl: urlData.uploadFileUrl,
    shopInfo: null,
    group: null,
    ID_img: '',
    logo: '',
    change_takeout: false, // 是否是选择外卖,
    locationName: '',
    px2rpxWidth: '',
    px2rpxHeight: '',
    address: '定位选择地址',//定位地址
    location: '',  // 定位地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获取店铺分类
    funData.getGroup(that, (data) => {
      that.setData({
        group: data
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    funData.getShopByCode(app.globalData.user_id, that, (data) => {
      // console.log(data);
      that.setData({
        shopInfo: data.shop,
      });
    });
    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function (res) {
        that.setData({
          px2rpxHeight: res.data.px2rpxHeight,
          px2rpxWidth: res.data.px2rpxWidth,
        })
      }
    })
  },

  /**
   * 选择分组
   */
  radioChange: function (e) {
    if (e.detail.value == '1' || e.detail.value == 1) {
      this.setData({
        change_takeout: true
      });
    } else {
      this.setData({
        change_takeout: false
      });
    }
  },

  /**
   * 店铺定位
   */
  location: function (e) {
    let that = this;
    funData.amapFilePackage((data) => {
      // console.log(data)
      let locationName = {};
      locationName.desc = data[0].name;
      locationName.latitude = data[0].latitude;
      locationName.longitude = data[0].longitude;
      that.setData({
        locationName: locationName,
        address: data[0].name,
        location: data[0].regeocodeData.pois,
      });
    }, () => { });
  },

  /**
 * 选择定位地址
 */
  getLocation: function (e) {
    let that = this;
    let address = that.data.address;
    let name = e.currentTarget.dataset.locationname;
    let longitude_latitude = e.currentTarget.dataset.titude.split(',');
    console.log(longitude_latitude)
    let locationName = {};
    locationName.desc = name; 
    locationName.latitude = longitude_latitude[1] ;
    locationName.longitude = longitude_latitude[0];

    that.setData({
      address: name,
      locationName: locationName,
      location:''
    });
  },

  /**
    * 添加照片
    */
  addImgLogo: function () {
    let that = this;
    funData.myUpload(function (fileNmae) {
      that.setData({
        logo: fileNmae
      });
    });
  },

  /**
   * 添加照片
   */
  addImg: function () {
    let that = this;
    funData.myUpload(function (fileNmae) {
      that.setData({
        ID_img: fileNmae
      });
    });
  },
  /**
   * 提交
   */
  apply: function (e) {
    console.log(e.detail.value)
    let that = this;
    let shop = e.detail.value;
    console.log(shop.password.length)
    let len = shop.password.length;
    // 店铺分类不能为空
    if (util.isEmpty(shop.group_id)) {
      wx.showToast({
        title: '分类不能为空',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    // 判断密码个数
    if (len < 8 || len > 20) {
      wx.showToast({
        title: '输入的密码有误',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    // 判断密码
    if (shop.password != shop.passtoo) {
      wx.showToast({
        title: '俩次输入的密码不相同',
        icon: 'none',
        duration: 1000
      });
      return;
    }


    // 店铺简介
    if (util.isEmpty(shop.shop_detail)) {
      wx.showToast({
        title: '简介不能为空',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    // 店铺地址不能为空
    if (util.isEmpty(shop.shop_addr)) {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    // 身份证号验证
    if (!util.checkReg(2, shop.ID_card)) {
      wx.showToast({
        title: '身份证不正确',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    // // 身份证照片不能为空
    // if (that.data.ID_img == '') {
    //     wx.showToast({
    //         title: '上传身份证照片',
    //         icon: 'none',
    //         duration: 1000
    //     });
    //     return;
    // }

    // 外卖
    if (that.data.change_takeout) {
      // 起送价
      if (!util.checkReg(4, shop.initialMoney)) {
        wx.showToast({
          title: '请填写起送价',
          icon: 'none',
          duration: 1000
        });
        return;
      }
      console.log(shop.initialMoney)
      if (shop.initialMoney < 20) {
        wx.showToast({
          title: '起送价不得低于20元',
          icon: 'none',
          duration: 1000
        });
        return;
      }
      //     // 定位
      if (util.isEmpty(that.data.locationName)) {
        wx.showToast({
          title: '请定位店铺',
          icon: 'none',
          duration: 1000
        });
        return;
      }
      shop.latitude = that.data.locationName.latitude;
      shop.longitude = that.data.locationName.longitude;
    }

    shop.logo = that.data.logo;
    shop.ID_img = that.data.ID_img;
    shop.shop_code = that.data.shopInfo.shop_code;
    shop.user_id = app.globalData.user_id;
    shop.level = 3;
    shop.password = shop.password;
    shop.passtoo = shop.password;
    // console.log(shop)
    funData.updateShopInfo(shop, that, () => {
      wx.showToast({
        title: '信息已成功提交',
        icon: 'success',
        duration: 1000
      });
      app.globalData.level=3;
      setTimeout(function () {
        wx.reLaunch({
          url: '/pages/myself/myself'
        })
      }, 2000);
    });
  }

})