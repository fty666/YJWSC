// pages/myself/myMoney/modifyPassword.js
Page({
  data:{
    px2rpxWidth: '',
    px2rpxHeight: '',
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
        title: '修改密码'
    })
  },
  onReady:function(){
    // 页面渲染完成
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
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})