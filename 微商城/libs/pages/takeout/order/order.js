const funDta = require('../../../utils/functionMethodData.js');
const utilFunctions = require('../../../utils/functionData.js');
const urlData = require('../../../utils/urlData.js')
const template = require('../../../template/template.js');
const util = require('../../../utils/util.js');
const app = getApp();
var page = 1;
var pageSize = 20;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_load: true,
        has_data: false,
        uploadFileUrl: urlData.uploadFileUrl,
        // 订单信息
        orderinfo: "",
        px2rpxWidth: '',
        px2rpxHeight: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let that = this;
        // 显示tarBar模板
        template.tabbar("tabBar", 1, this, 4);
        loadData(that);
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
     *再来一单跳转 
     */
    again: function (e) {
        wx.navigateTo({
            url: '/pages/takeout/shopDetails/shopDetails?shop_code=' + e.currentTarget.dataset.shop_code
        })
    },

    /**
     *去评论 
     */
    comment: function (e) {
        let oid = e.currentTarget.dataset.oid
        wx.navigateTo({
            url: '/pages/takeout/assess/assess?oid=' + oid,
        })
    },

    /**
     * 查看路线
     */
    goMap:function(e){
        console.log(e)
        let oid = e.currentTarget.dataset.oid;
        console.log(oid)
        wx.navigateTo({
            url: '/pages/takeout/staticMap/staticMap?order_uuid='+oid,
        })
    },

    /**
     * 滚动到顶部/左边，会触发 scrolltoupper 事件
     */
    scrollToUpper: function () {

    },

    /**
     *订单详情 
     */ 
    oinfo:function(e){
        console.log(e)
        let oids = e.currentTarget.dataset.oids
        wx.navigateTo({
            url: '/pages/takeout/orderfinish/orderfinish?oids='+oids
        })
    },

    /**
     * 滚动到底部/右边，会触发 scrolltolower 事件
     */
    ScrollToLower: function () {
        let that=this;
        pageSize += 20;
        loadData(that);
    },

});

// 加载数据
function loadData(that) {
    // let that = this;
    let order_type = 1;
    let uid = app.globalData.user_id;
    let shop_code='';
    // let uid = 4;
    function microplat(res) {
        res = utilFunctions.dealOrderData(res.PageInfo.list);
        console.log(res);
        if (util.isEmpty(res)) {
            that.setData({
                has_data: false,
            })
        } else {
            that.setData({
                has_data: true,
            })
        }
        that.setData({
            is_load: false,
            orderinfo: res,
        })
    }
    utilFunctions.getOrderUrl(uid, order_type, page, pageSize, shop_code, microplat, this);
}