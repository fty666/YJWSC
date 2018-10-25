// mallcart.js
// var _function = require('../../../utils/functionData');
var app = getApp()
Page({
    data:{
        wldata:[],
        glo_is_load:true,
      px2rpxWidth: '',
      px2rpxHeight: '',
    },
    onLoad:function(options){
        var that = this;
        var order_id = options.oid;
        that.setData({
          this_order_id:order_id,
        });
    },
    onShow:function(){
        var that = this;
        //获取物流信息
        _function.getShopWuliuInfo(that.data.this_order_id,that.initgetShopWuliuInfoData,that);
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
    initgetShopWuliuInfoData:function(data){
        var that = this;
        console.log(data.info);
        if(data.code == 1){
             that.setData({
                 wldata:data.info,
                 glo_is_load:false
             })
        }else if(data.code == 5){
            wx.showModal({
                title: '提示',
                content: data.info,
                showCancel:false,
                success:function(res){
                    if (res.confirm) {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            });
            return false;
        }
    }
})