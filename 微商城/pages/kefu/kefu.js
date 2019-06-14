Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: 'https://zuoanzac.oss-cn-beijing.aliyuncs.com',
    px2rpxHeight: '',
    px2rpxWidth: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  /**
   *客服 
   */
  custom: function() {
    wx.makePhoneCall({
      phoneNumber: '18722405700',
    })
  },
})