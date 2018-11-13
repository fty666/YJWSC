// mallcart.js
// var _function = require('../../../utils/functionData');
var app = getApp()
Page({
    data:{
        quan_list:[],
        glo_is_load:true,
      px2rpxWidth: '',
      px2rpxHeight: '',
    },
    set_quan_bind:function(e){
        var qid = e.currentTarget.id;
        wx.redirectTo({
            url: '../mallsure/mallsure?quan_id='+qid
        });
    },
    onLoad:function(){
      var that = this;
      _function.getShopUserQuanlist(wx.getStorageSync("utoken"),0,that.initgetShopUserQuanlistData,that);
    },
    initgetShopUserQuanlistData:function(data){
      var that = this;
      if(data.code == 2){
            wx.showToast({
                title: '登陆中',
                icon: 'loading',
                duration: 10000,
                success:function(){
                    app.getNewToken(function(token){
                        _function.getShopUserQuanlist(wx.getStorageSync("utoken"),0,that.initgetShopUserQuanlistData,that);
                    })
                }
            })
            return false;
      }
      that.setData({
          quan_list:data.info,
          glo_is_load:false
      });
    },
    //下拉刷新
    onPullDownRefresh:function(){
      var that = this
      _function.getShopUserQuanlist(wx.getStorageSync("utoken"),0,that.initgetShopUserQuanlistData,that);
      setTimeout(()=>{
        wx.stopPullDownRefresh()
      },1000)
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

})