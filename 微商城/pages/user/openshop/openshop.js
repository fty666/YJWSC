const app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const util = require('../../../utils/util.js')
const URLData = require('../../../utils/data.js');
const template = require('../../../template/template.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        level: '',
        user_id: URLData.userid,
        send_code: '点击获取验证码',
        disabled: false,
        tel: null,
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
      let that=this;
      //获取缓存
      wx.getStorage({
        key: 'PX_TO_RPX',
        success: function (res) {
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
        let that = this;
        if (app.globalData.level == '1' || !app.globalData.level) {
            template.tabbar("tabBar", 4, that, 1);
        } else if (app.globalData.level == '2' || app.globalData.level == '3') {
            template.tabbar("tabBar", 4, that, 3);
        }
    },
    /**
     * 获取输入手机号
     */
    getTel: function (e) {
        this.setData({
            tel: e.detail.value
        });
    },

    /**
     * 发送验证码
     */
    sendCode: function () {
        let that = this;
        // 验证手机号
        if (!util.checkReg(1, that.data.tel)) {
            wx.showToast({
                title: '手机号不正确',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        // 验证码按钮倒计时
        let i = 60;
        let cleat_set = null;
        cleat_set = setInterval(function () {
            that.setData({
                send_code: '重新发送(' + i + 's)',
                disabled: true,
            });
            i--;
            if (i < 0) {
                clearInterval(cleat_set);
                that.setData({
                    send_code: '点击获取验证码',
                    disabled: false
                });
                i = 120;
            }
        }, 1000);
        // 获取验证码
        funData.getSms(that.data.tel, that, () => {
            wx.showToast({
                title: '注意查收',
                icon: 'success',
                duration: 1000
            });
        });
    },

    /** 
     * 提交
     */
    openShop: function (e) {
        let that = this;
        // console.log(e.detail.value);
        let shop = e.detail.value;
        // 所有信息不能为空
        if (shop.owner == '' || shop.shop_name == '' || shop.mobile == '' || shop.code == '') {
            wx.showToast({
                title: '信息不能为空',
                icon: 'none',
                duration: 1000
            });
            return false;
        }
        // 验证手机号
        if (!util.checkReg(1, shop.mobile)) {
            funData.showToast({
                title: '手机号不正确',
                icon: 'none',
                duration: 1000
            });
            return false;
        }
        if (shop.mobile != that.data.tel) {
            wx.showToast({
                title: '手机号不正确',
                icon: 'none',
                duration: 1000
            });
            return false;
        }
        shop.user_id = app.globalData.user_id;
        app.globalData.level=2;
        shop.level = 2;
        funData.insertShop(shop, that, (res) => {
            wx.navigateTo({
              url: '/pages/myself/myself'
            })
        });
    },
})