const _wxcharts = require('../../../utils/wxcharts');
const template = require('../../../template/template.js');
const app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const util = require('../../../utils/util.js');
var lineChart = null;
var startPos = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        start: '2018-6-01',
        end:null,
        currentNav:'month',
        Range:null,
        Money:null,
        deviceW: 0,
        deviceH: 0,
        currtab: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        // 获取当前的年份/月份
        let date = new Date;
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        // console.log(year);
        // 开始时间
        // let start = year+'-01-01';
        // console.log(start);
        // 结束时间
        let end = util.formatDate(new Date().getTime(),'YY-MM-DD');
        // console.log(end)
        // 当月天数 数组
        let day = date.getDate();
        // dayRange = util.myrange(1, day);
        // console.log(dayRange);
        this.setData({
            // start:start,
            end: end,
            year: year,
            month:year+'-'+month,
        });
        // 获取当月每天的营业额
        that.getMoneyByDay(year,month,that);
        // this.barShow(that);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let that = this;
        // 页面渲染完成
        this.getDeviceInfo()
        // this.graphShow()
        // this.barShow();
        // that.line();
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

    // 条形图
    barShow: function (Range, Money,title) {
        // let that = this;
        let bar = {
            canvasId: 'barGraph',
            type: 'column',
            categories: Range,
            // categories:[1,2,3,4],
            series: [
                {
                    name: title+'营业额',
                    data: Money,
                    // data:[1,2,4,5]
                }
            ],
            yAxis: {
                format: function (val) {
                    return val + '万';
                }
            },
            width: 380,
            height: 250
        }
        new _wxcharts(bar)
    },

    line: function (Range, Money, title){
    // line: function () {
        // var simulationData = this.createSimulationData();
        lineChart = new _wxcharts({
            canvasId: 'lineCanvas',
            type: 'line',
            // categories: simulationData.categories,
            categories:Range,
            animation: true,
            series: [{
                // name: '成交量1',
                name: title + '营业额',
                // data: simulationData.data,
                data: Money,
                format: function (val, name) {
                    return val.toFixed(2) + '元';
                }
            }],
            xAxis: {
                disableGrid: false
            },
            yAxis: {
                title: '成交金额 (元)',
                format: function (val) {
                    return val.toFixed(2);
                },
                min: 0
            },
            width: 385,
            height: 300,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
                lineStyle: 'curve'
            }
        });
    },
    touchHandler: function (e) {
        lineChart.scrollStart(e);
    },
    moveHandler: function (e) {
        lineChart.scroll(e);
    },
    touchEndHandler: function (e) {
        lineChart.scrollEnd(e);
        lineChart.showToolTip(e, {
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data
            }
        });
    },
    createSimulationData: function () {
        var categories = [];
        var data = [];
        for (var i = 0; i < 15; i++) {
            categories.push('201620162-' + (i + 1));
            data.push(Math.random() * (20 - 10) + 10);
        }
        return {
            categories: categories,
            data: data
        }
    },


    /**
     * 月份时间选择器
     */
    monthChange: function (e) {
        let that = this;
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.getMoneyByDay(e.detail.value,-1,that);
        this.setData({
            year: e.detail.value,
            currentNav:'year'
        });

    },

    /**
     * 天时间选择器
     */
    dayChange: function (e) {
        let that = this;
        console.log('picker发送选择改变，携带值为', e.detail.value);
        let val = e.detail.value.split('-');
        this.getMoneyByDay(val[0],val[1],that);
        this.setData({
            month: e.detail.value,
            currentNav:'month'
        });

    },


    // 获取指定年月的营业额
    getMoneyByDay: function (year, month,that){
        // 元素为0的 营业额数组
        let Money = null;
        // 月份或者天数 范围数组
        let Range = null;
        let title = null;
        if(month == -1){
            Money = util.repeatArr(0, 13);
            Range = util.myrange(1, 12);
            title = year+'年';
            funData.getMoneyByMonth(app.globalData.shopCode, year,that, (data) => {
                console.log(data);
                // 把有产生营业额的数据替换原来的0
                let datalen = data.length;
               
                for (let j = 0; j < datalen; j++) {
                    Money.splice(data[j].month, 1, data[j].money);
                }
                Money.shift();
                console.log(title);
                console.log(Money);
                // that.barShow(Range, Money,title);
                that.line(Range, Money, title);
                that.setData({
                    Range:Range,
                    Money:Money
                })
            });
        } else {
            let day = getDaysInOneMonth(year, month);  // 获取指定年月的天数
            // console.log(day)
            Money = util.repeatArr(0 , day);
            Range = util.myrange(1, day);
            title = year+'年'+month+'月';
            funData.getMoneyByDay(app.globalData.shopCode, year, month, that, (data) => {
                console.log(data);
                // 把有产生营业额的数据替换原来的0
                let datalen = data.length;
               
                for (let j = 0; j < datalen; j++) {
                    Money.splice(data[j].day-1, 1, data[j].money);                 
                }
                // console.log(title);
                // console.log(Money);
                // that.barShow(Range, Money,title);
                that.line(Range, Money, title);
                that.setData({
                    Range: Range,
                    Money: Money
                })
            });
        }
        
    },
    

});

function getDaysInOneMonth(year, month) {
    month = parseInt(month, 10);
    var d = new Date(year, month, 0);
    return d.getDate();
}