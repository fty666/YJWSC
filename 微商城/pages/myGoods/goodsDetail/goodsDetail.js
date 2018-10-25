const app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
// const _wxcharts = require('../../../utils/wxcharts')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        glo_is_load: true,
        goods_info: null,
        comment: null,
        uploadFileUrl: urlData.uploadFileUrl,
        this_g_nav: 1,
        scrollTop: 0,
        floorstatus: false,
        currtab: 0,
        deviceW: 0,
        deviceH: 0,
        // swipertab: [{ name: '条形', index: 0 }, { name: '折线', index: 1 }, { name: '饼', index: 2 }, { name: '区域', index: 3 },]
        px2rpxWidth: '',
        px2rpxHeight: '',
        gift:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let goodsId = options.goodsId;
        // 获取商品详情
        funData.getGoodsDetails(goodsId, this, (data) => {
            // 好评率
            data.perfectRate = ((~~data.perfect) / (~~data.commentNum)) * 100 + '%';
            // 中评率
            data.greatRate = ((~~data.great) / (~~data.commentNum)) * 100 + '%';
            // 差评率 
            data.badRate = ((~~data.bad) / (~~data.commentNum)) * 100 + '%';
            that.setData({
                goods_info: data,
                glo_is_load: false
            });
        });

        // 获取商品评论
        funData.getComment(goodsId, this, (data) => {
            let len = data.length;
            for (let i = 0; i < len; i++) {
                data[i].img = data[i].img.split(',');
            }
            // console.log(data);
            that.setData({
                comment: data,
                glo_is_load: false
            });
        });

        // 满赠活动
        let datas = {
            shop_code: options.shop_code
        };
        funData.getReductionInGoods(datas, that, (res) => {
            console.log(res);
            that.setData({
                gift: res,
            });
        });

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.getDeviceInfo();
        this.graphShow();
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
     * 返回顶部
     */
    goTop: function (e) {
        this.setData({
            scrollTop: 0
        })
    },

    goods_nav_bind: function (e) {
        let that = this
        // console.log(e);
        let this_target = e.target.id;
        that.setData({
            this_g_nav: this_target
        })
    },
    /**
   * @Explain：获取设备信息
   */
    getDeviceInfo: function () {
        let that = this
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    deviceW: res.windowWidth,
                    deviceH: res.windowHeight
                })
            }
        })
    },

    /**
     * @Explain：选项卡切换
     */
    tabChange: function (e) {
        this.setData({ currtab: e.detail.current })
        this.graphShow()
    },

    /**
     * @Explain：选项卡点击切换
     */
    tabSwitch: function (e) {
        var that = this
        if (this.data.currtab === e.target.dataset.current) {
            return false
        } else {
            that.setData({
                currtab: e.target.dataset.current
            })
        }
    },

    /**
     * @Explain：初始化静态图表
     */
    graphShow: function () {
        let that = this
        switch (this.data.currtab) {
            case 0:
                that.barShow()
                break
            case 1:
                that.lineShow()
                break
            case 2:
                that.pieShow()
                break
            case 3:
                that.areaShow()
                break
        }
    },

    /**
     * 饼图
     */
    pieShow: function () {
        let pie = {
            canvasId: 'pieGraph',
            type: 'pie',
            series: [{
                name: 'cat1',
                data: 50,
            }, {
                name: 'cat2',
                data: 30,
            }, {
                name: 'cat3',
                data: 1,
            }, {
                name: 'cat4',
                data: 1,
            }, {
                name: 'cat5',
                data: 46,
            }],
            width: 360,
            height: 300,
            dataLabel: true
        }
        new _wxcharts(pie)
    },

    /**
     * 条形图
     */
    barShow: function () {
        let bar = {
            canvasId: 'barGraph',
            type: 'column',
            categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
            series: [{
                name: '成交量1',
                data: [15, 20, 45, 37, 4, 80]
            }, {
                name: '成交量2',
                data: [70, 40, 65, 100, 34, 18]
            }],
            yAxis: {
                format: function (val) {
                    return val + '万';
                }
            },
            width: 320,
            height: 200
        }
        new _wxcharts(bar)
    },

    /**
     * 折线图
     */
    lineShow: function () {
        let line = {
            canvasId: 'lineGraph',
            type: 'line',
            categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
            series: [{
                name: '成交量1',
                data: [0.15, 0.2, 0.45, 0.37, 0.4, 0.8],
                format: function (val) {
                    return val.toFixed(2) + '万';
                }
            }, {
                name: '成交量2',
                data: [0.30, 0.37, 0.65, 0.78, 0.69, 0.94],
                format: function (val) {
                    return val.toFixed(2) + '万';
                }
            }],
            yAxis: {
                title: '成交金额 (万元)',
                format: function (val) {
                    return val.toFixed(2);
                },
                min: 0
            },
            width: 320,
            height: 200
        }
        new _wxcharts(line)
    },

    /**
     * 区块图
     */
    areaShow: function () {
        let area = {
            canvasId: 'areaGraph',
            type: 'area',
            categories: ['2016-08', '2016-09', '2016-10', '2016-11', '2016-12', '2017'],
            series: [{
                name: '成交量1',
                data: [70, 40, 65, 100, 34, 18],
                format: function (val) {
                    return val.toFixed(2) + '万';
                }
            }, {
                name: '成交量2',
                data: [15, 20, 45, 37, 4, 80],
                format: function (val) {
                    return val.toFixed(2) + '万';
                }
            }],
            yAxis: {
                format: function (val) {
                    return val + '万';
                }
            },
            width: 320,
            height: 200
        }
        new _wxcharts(area)
    }

})