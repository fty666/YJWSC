// var _function = require('../../../utils/functionData');
var app = getApp();
Page({
  data:{
    shop_quan_info:[],
    glo_is_load:true,
    // this_quan_d_img:_function.duoguanData.duoguan_host_api_url+'/temp_pic/shop/privilege.jpg'
    px2rpxWidth: '',
    px2rpxHeight: '',
  },
  onLoad:function(options){
      var that = this;
      var qid = options.qid;
      _function.getShopQuanInfo(qid,that.initgetShopQuanInfoData,that);
  },
  initgetShopQuanInfoData:function(data){
      var that = this;
      that.setData({
        shop_quan_info:data.info,
        glo_is_load:false
      });
  },
  quan_lingqu_bind:function(){
    var that = this;
    wx.showToast({
        title: '领取中',
        icon: 'loading',
        duration: 10000,
        mask:true
    });
    _function.getShopQuanLingqu(wx.getStorageSync("utoken"),that.data.shop_quan_info.id,that.initgetShopQuanLingquData,that);
  },
  initgetShopQuanLingquData:function(data){
    var that = this;
    console.log(data.info);
    if(data.code == 1 || data.code == 5){
        wx.hideToast();
         wx.showModal({
            title: '提示',
            content: data.info,
            showCancel:false
        });
    }else if(data.code == 2){
        wx.showToast({
                title: '登陆中',
                icon: 'loading',
                duration: 10000,
                success:function(){
                    app.getNewToken(function(token){
                        _function.getShopQuanLingqu(wx.getStorageSync("utoken"),that.data.shop_quan_info.id,that.initgetShopQuanLingquData,that);
                    })
                }
            });
    }
  },
  onShareAppMessage: function () {   
    var that = this
    return {
      title: that.data.shop_quan_info.q_name,
      desc: that.data.shop_quan_info.q_shuoming,
      path: 'pages/shop/mallquan/index'
    }
  },
  /**
    * 生命周期函数--监听页面初次渲染完成
    */
  onReady: function () {
    let that = this;
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
});