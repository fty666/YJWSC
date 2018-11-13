const funDta = require('../../../utils/functionMethodData.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order_uuid:'',
        src: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let order_uuids = options.order_uuid;
        this.setData({
            order_uuid: order_uuids
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let that = this;
        let myorder_uuid = that.data.order_uuid;
        console.log(myorder_uuid)
        funDta.getMap(myorder_uuid,that,(data)=>{
            console.log(data);
            // let paths = "10,0x0000ff,1,,:"+  +",39.96491;116.320816,39.966606";
            funDta.staticMap('paths', paths, that);
            
        });
        // let paths = "5,0x0000ff,1,A:116.31604,39.96491;B:116.32361,39.966957";
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

    }
})