var util = require('../../../utils/util.js');
var app = getApp();
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');

Page({
  data: {
    addressList: [],
    addId:"",
    aid:""
  },

  /**
   * 页面初始化数据
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.haddress()
  },

  /**
   *初始化获取数据函数 
   */ 
  haddress(){
    let that = this
    function address(res) {
      console.log(res)
      that.setData({
        addressList: res
      })
    }
    utilFunctions.getAddrUrl(address, this)
  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示

  },

  /**
   * 新建收货地址
   */
  addressAddOrUpdate() {
    wx.navigateTo({
      url: '/pages/user/addressAdd/addressAdd'
    })
  },

  /**
   * 结算地址跳转
   */ 
  addressUpdate(e){
    console.log(e)
    this.setData({
      oid: e.currentTarget.dataset.addressId
    })
    this.last()
  },
  
  last:function(){
    let urls = util.getPrevPageUrl()
    console.log(urls)
    let surl = 'pages/shop/orderpay/index'
    let surl2 ='pages/shop/onepay/onepay'
    let surl3 ="pages/user/opays/opays"
    if (urls == surl||urls==surl2||urls==surl3) {
      wx.navigateTo({
        url: '/'+urls+'?addressId=' +this.data.oid,
      })
    }
  },

  /**
   * 删除地址事件
   */
  deleteAddress(e) {
    console.log(e)
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success: function (res) {
        if (res.confirm) {
          let addressId = e.target.dataset.addressId;
          // console.log(addressId)
          function deletes(res) {
            that.haddress()
          }
          utilFunctions.deleteAddrUrl(deletes, addressId, this)
        }
      }
    })

  },

  /**
   * 设置默认地址
   */ 
  defaults(e){
    let that=this
    that.setData({
      addId: e.currentTarget.dataset.id
    })
    let addIds = e.currentTarget.dataset.id
    let list = that.data.addressList
    for (let i = 0; i < list.length;i++){
      if (list[i].id == addIds){
        list[i].is_default=1
      }else{
        list[i].is_default = 0;
      }
    }
    that.setData({
      addressList:list
    })

    function sdefault(res){
    }
    utilFunctions.updateAddrDefault(that.data.addId, sdefault,this)

  },

  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})