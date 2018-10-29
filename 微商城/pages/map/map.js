var amapFile = require('../../utils/amap-wx.js');
// var config = require('../../libs/config.js');
var Key ='e0aa130ad1e3021c27bc637f22eda880';
Page({
  data: {
    markers: [{
      iconPath: "../../images/qi.png",
      id: 0,
      latitude: 39.989643,
      longitude: 116.481028,
      width: 50,
      height: 50
    }, {
        iconPath: "../../images/zhon.png",
      id: 0,
      latitude: 39.90816,
      longitude: 116.434446,
      width: 50,
      height: 50
    }],
    distance: 18,
    cost: '',
    polyline: []
  },
  onLoad: function () {
    var that = this;
    var key = Key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getRidingRoute({
      origin: '116.481028,39.989643',
      destination: '116.434446,39.90816',
      success: function (data) {
        console.log(data)
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.taxi_cost) {
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }

      },
      fail: function (info) {

      }
    })
  },
  goDetail: function () {
    wx.navigateTo({
      url: '../navigation_ride_detail/navigation'
    })
  },
  goToCar: function (e) {
    wx.redirectTo({
      url: '../navigation_car/navigation'
    })
  },
  goToBus: function (e) {
    wx.redirectTo({
      url: '../navigation_bus/navigation'
    })
  },
  goToRide: function (e) {
    wx.redirectTo({
      url: '../navigation_ride/navigation'
    })
  },
  goToWalk: function (e) {
    wx.redirectTo({
      url: '../navigation_walk/navigation'
    })
  }
})