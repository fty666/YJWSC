// pages/myself/myMoney/feedBack.js
Page({
    data: {
      px2rpxWidth: '',
      px2rpxHeight: '',
    },

    bindFormSubmit: function (e) {
        console.log(e.detail.value.textarea)
    },
    onLoad: function () {
        wx.setNavigationBarTitle({
            title: '反馈意见'
        })
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
