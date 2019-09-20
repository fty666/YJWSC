var util = require('../../../utils/util.js');
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
const funData = require('../../../utils/functionMethodData.js');
var app = getApp();
var page = 1;
var pageSize = 20;
var mystatus = -1;
Page({
  data: {
    address: {},
    region: ['广东省', '广州市', '海珠区'],
    area_path: "",
    city: "",
    addressId: 0,
    addId: "",
    addinfo: "",
    maild: '',//订单ID
    Receiver: '',//收货人
    Detail: '',//详细地址
    px2rpxWidth: '',
    px2rpxHeight: '',
    mobile: '',//电话
  },
  // bindinputMobile(event) {
  //   let address = this.data.address;
  //   address.addr_mobile = event.detail.value;
  //   if (event.detail.value) {
  //     this.setData({
  //       address: address,
  //       mobile: event.detail.value
  //     });
  //   }
  // },

  // 收货人
  bindinputName(event) {
    let address = this.data.address;
    // if (event.detail.value)
    address.addr_receiver = event.detail.value;
    if (event.detail.value) {
      this.setData({
        address: address,
        Receiver: event.detail.value
      });
    }
  },

  // 收货电话
  bindinputMobile(event) {
    let tel = event.detail.value;
    console.log(tel)
    if (!util.checkReg(1, event.detail.value)) {
      wx.showToast({
        icon: 'none',
        title: '手机号不正确'
      });
      return;
    }
    let address = this.data.address;
    address.addr_mobile = tel;
    this.setData({
      address: address,
      mobile: tel
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
    let address = this.data.address;
    address.area_detail = event.detail.value;
    if (event.detail.value) {
      this.setData({
        address: address,
        Detail: event.detail.value
      });
    }
  },

  // 是否为默认
  bindIsDefault() {
    let address = this.data.address;
    address.is_default = address.is_default ? 1 : 0;
    this.setData({
      address: address
    });
  },

  onLoad: function (options) {
    let that = this;
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    let oid = options.oid;
    function odetail(res) {
      console.log(res)
      that.setData({
        addinfo: res[0],
        city: res[0].orderPath,
        maild: res[0].order_mainid,
        Receiver: res[0].addr_receiver,
        Detail: res[0].orderPathDetail,
        mobile: res[0].orderMobile
      });
    }
    utilFunctions.getOrderDetail(oid, odetail, this);
  },

  onReady: function () {
    let that = this;
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
  selectRegionType(event) {
    let that = this;
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    let selectRegionList = that.data.selectRegionList;

    //判断是否可点击
    if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex - 1].id <= 0)) {
      return false;
    }

    this.setData({
      regionType: regionTypeIndex + 1
    })

    let selectRegionItem = selectRegionList[regionTypeIndex];

    this.getRegionList(selectRegionItem.parent_id);

    this.setRegionDoneStatus();

  },
  selectRegion(event) {
    let that = this;
    let regionIndex = event.target.dataset.regionIndex;
    let regionItem = this.data.regionList[regionIndex];
    let regionType = regionItem.type;
    let selectRegionList = this.data.selectRegionList;
    selectRegionList[regionType - 1] = regionItem;


    if (regionType != 3) {
      this.setData({
        selectRegionList: selectRegionList,
        regionType: regionType + 1
      })
      this.getRegionList(regionItem.id);
    } else {
      this.setData({
        selectRegionList: selectRegionList
      })
    }

    //重置下级区域为空
    selectRegionList.map((item, index) => {
      if (index > regionType - 1) {
        item.id = 0;
        item.name = index == 1 ? '城市' : '区县';
        item.parent_id = 0;
      }
      return item;
    });

    this.setData({
      selectRegionList: selectRegionList
    })


    that.setData({
      regionList: that.data.regionList.map(item => {

        //标记已选择的
        if (that.data.regionType == item.type && that.data.selectRegionList[that.data.regionType - 1].id == item.id) {
          item.selected = true;
        } else {
          item.selected = false;
        }

        return item;
      })
    });

    this.setRegionDoneStatus();

  },
  doneSelectRegion() {
    if (this.data.selectRegionDone === false) {
      return false;
    }

    let address = this.data.address;
    let selectRegionList = this.data.selectRegionList;
    address.province_id = selectRegionList[0].id;
    address.city_id = selectRegionList[1].id;
    address.district_id = selectRegionList[2].id;
    address.province_name = selectRegionList[0].name;
    address.city_name = selectRegionList[1].name;
    address.district_name = selectRegionList[2].name;
    address.full_region = selectRegionList.map(item => {
      return item.name;
    }).join('');

    this.setData({
      address: address,
      openSelectRegion: false
    });

  },
  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });

  },

  //取消修改 
  cancelAddress() {
    wx.navigateTo({
      url: '/pages/orderManage/orderManage'
    })
  },

  /**
   *保存地址 
   */
  saveAddress() {
    let that = this

    if (that.data.address.addr_receiver == "") {
      wx.showToast({
        icon: 'none',
        title: '用户名不能为空'
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

    if (!util.checkReg(1, that.data.mobile)) {
      wx.showToast({
        icon: 'none',
        title: '手机号不正确'
      });
      return;
    }

    // console.log(this.data.address)

    function calback(res) {
      wx.showToast({
        icon: 'success',
        title: '修改成功'
      });
      console.log('999999999999')
      wx.navigateTo({
        url: '/pages/orderManage/orderManage'
      })

    }
    let addtail = that.data.address.area_detail;
    let adds = {
      order_mainid: that.data.maild,
      orderReceiver: that.data.Receiver,
      orderMobile: that.data.mobile,
      orderPath: that.data.city,
      orderPathDetail: that.data.Detail
    }
    utilFunctions.updateOrderAddrUrl(adds, calback, this)


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