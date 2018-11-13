var util = require('../../../utils/util.js');
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
var app = getApp();

Page({
  data: {
    address: {
      id: 0,
      area_path: "",
      area_detail: '',
      addr_receiver: '',
      addr_mobile: '',
      is_default: 1,
      latitude: '', // 纬度
      longitude: '' // 经度
    },
    location: '',  // 定位地址
    region: ['天津市', '天津市', '滨海新区'],
    area_path: "",
    city: "",
    addressId: 0,
    selects: false,
    px2rpxWidth: '',
    px2rpxHeight: '',
  },

  onLoad: function (options) {
  },

  onReady: function () {
    let that = this;
    // 默认定位地址
    let address = that.data.address;
    utilFunctions.amapFilePackage((data) => {
      // console.log(data);
      let province = data[0].regeocodeData.addressComponent.province;
      let city = data[0].regeocodeData.addressComponent.city;
      if (city.length <= 0) {
        city = province;
      } else {
        city = city[0];
      }
      let district = data[0].regeocodeData.addressComponent.district;
      address.area_path = province + ',' + city + ',' + district;
      that.setData({
        region: [province, city, district],
        city: province + ',' + city + ',' + district,
        address: address
      });
    }, () => { });
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

  bindinputMobile(event) {
    let address = this.data.address;
    address.mobile = event.detail.value;
    this.setData({
      address: address
    });
  },

  // 收货人
  bindinputName(event) {
    let address = this.data.address;
    address.addr_receiver = event.detail.value;
    this.setData({
      address: address
    });
  },

  // 收货电话
  bindinputAddress(event) {
    let address = this.data.address;
    address.addr_mobile = event.detail.value;
    this.setData({
      address: address
    });
  },

  // 省市
  bindinputCity(event) {
    let address = this.data.address;
    address.area_path = event.detail.value;
    this.setData({
      address: address
    });
  },

  // 详细地址
  bindinputInfo(event) {
    // console.log(event)
    let address = this.data.address;
    address.area_detail = event.detail.value;
    this.setData({
      address: address,
      location: ''
    });
  },

  locations() {
    this.setData({
      location: '',
    });
  },

  /**
   * 定位
   */
  location: function () {
    let that = this;
    let address = that.data.address;
    utilFunctions.amapFilePackage((data) => {
      address.area_detail = data[0].regeocodeData.pois[0].name;
      let longitude_latitude = data[0].regeocodeData.pois[0].location.split(',');
      address.longitude = longitude_latitude[0];
      address.latitude = longitude_latitude[1];
      that.setData({
        location: data[0].regeocodeData.pois,
        address: address,
      });
    }, () => { });
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
    console.log(address);
  },

  // 是否为默认
  bindIsDefault() {
    let address = this.data.address;
    address.is_default = address.is_default ? 0 : 1;
    this.setData({
      address: address
    });
  },

  setRegionDoneStatus() {
    let that = this;
    let doneStatus = that.data.selectRegionList.every(item => {
      return item.id != 0;
    });
    that.setData({
      selectRegionDone: doneStatus
    })
  },

  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });

  },

  cancelAddress() {
    wx.navigateTo({
      url: '/pages/user/address/address',
    })
  },

  /**
   *保存地址 
   */
  saveAddress() {
    // console.log(this.data.address)
    let that = this
    let address = this.data.address;
    // console.log(that.data.address)
    if (!util.checkReg(1, that.data.address.mobile)) {
      wx.showToast({
        icon: 'none',
        title: '手机号不正确'
      });
      return;
    }

    if (that.data.address.addr_receiver == "") {
      wx.showToast({
        icon: 'none',
        title: '姓名不能为空'
      });
      return;
    }

    if (that.data.address.area_detail == "") {
      wx.showToast({
        icon: 'none',
        title: '详细地址不能为空'
      });
      return;
    }

    if (that.data.address.area_path == "") {
      wx.showToast({
        icon: 'none',
        title: '地址不能为空'
      });
      return;
    }
    // console.log(address);

    function add() {
      let urls = util.getPrevPageUrl();
      let twoyrls = util.twoPage()
      console.log(urls)
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 3];  //上一个页面
      // 直接购买
      if (urls == 'pages/shop/onepay/onepay' || twoyrls == 'pages/shop/onepay/onepay') {
        wx.navigateTo({
          url: '/pages/shop/onepay/onepay?shcode=' + app.globalData.shcode + '&color=' + app.globalData.color + '&size=' + app.globalData.size + '&tastes=' + app.globalData.tastes + '&typee' + app.globalData.typee + '&volume' + app.globalData.volume + '&ZKprice=' + app.globalData.ZKprice
        })
      } else if (urls == 'pages/takeout/pay/pay' || twoyrls == 'pages/takeout/pay/pay') {
        // 外卖跳转
        wx.navigateTo({
          url: "/pages/takeout/pay/pay?shop_code=" + app.globalData.shop_code
        })
      } else if (urls == 'pages/shop/orderpay/index' || twoyrls == 'pages/shop/orderpay/index') {
        // 购物车跳转
        wx.navigateTo({
          url: "/pages/shop/orderpay/index"
        })
      } else {
        // 其他
        wx.redirectTo({
          url: '/pages/user/address/address'
        })
        wx.showToast({
          icon: 'success',
          title: '添加成功'
        });
      }
    }
    utilFunctions.addAddrUrl(add, address, this)
  },

  formSubmit(e) {
    console.log(e)
  },

  /**
   * 省市级事件
   */
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let address = this.data.address;
    address.area_path = e.detail.value;
    this.setData({
      city: e.detail.value,
      address: address
    })
  },



  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})