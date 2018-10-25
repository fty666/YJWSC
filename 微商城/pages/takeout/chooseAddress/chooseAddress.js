const funDta = require('../../../utils/functionData.js');
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_load: false,
        has_data: true,
        location: '',  // 定位地址
        prev_page_url:'', // 上级页面
        address:null, // 用户地址
        px2rpxWidth: '',
        px2rpxHeight: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            prev_page_url: util.getPrevPageUrl()
        }); 
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let that = this;
        funDta.amapFilePackage((data) => {
            // console.log(data);
            that.setData({
                location: data[0].regeocodeData,
            });
        }, ()=>{});
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

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 重新定位
     */
    againLocation:function(){
        let that = this;
        funDta.amapFilePackage((data) => {
            // console.log(data);
            that.setData({
                location: data[0].regeocodeData,
            });
        }, ()=>{});
    },

    /**
     * 获取用户的收货地址 
     */
    getUserAddr:function(){
        let that = this;
        if (app.globalData.user_id){
            funDta.getAddr(app.globalData.user_id, that, (data) => {
                console.log(data);
                if(data.length > 0){
                    that.setData({
                        address:data
                    });
                }
            });
        }
    },

    /**
     * 点击地址
     */
    getAddr:function(e){
        let that = this;
        let locationName = e.currentTarget.dataset.addr;
        wx.navigateTo({
            url: '/' + that.data.prev_page_url + '?locationName=' + locationName ,
        })
    }
})