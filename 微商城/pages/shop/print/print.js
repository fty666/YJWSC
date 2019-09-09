const LAST_CONNECTED_DEVICE = 'last_connected_device'
const PrinterJobs = require('../../../printer/printerjobs')
const printerUtil = require('../../../printer/printerutil')
const funData = require('../../../utils/functionMethodData.js');
const app = getApp();
const util = require('../../../utils/util.js');

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i
    }
  }
  return -1
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join(',')
}

function str2ab(str) {
  // Convert str to ArrayBuff and write to printer
  let buffer = new ArrayBuffer(str.length)
  let dataView = new DataView(buffer)
  for (let i = 0; i < str.length; i++) {
    dataView.setUint8(i, str.charAt(i).charCodeAt(0))
  }
  return buffer;
}

Page({
  data: {
    devices: [],
    connected: false,
    chs: [],
    px2rpxWidth: '',
    px2rpxHeight: '',
    opdata: '还没有数据',
    orderInfo: {},
  },
  onLoad(options) {
    console.log(454645645646)
    var that = this;
    console.log(options)
    if (options.datas) {
      let data = {
        order_uuid: options.datas
      }
      funData.goTemplatedata(data, that, (res) => {
        console.log(res);
        that.setData({
          orderInfo: res
        })
      })
    }
  },
  onUnload() {
    this.closeBluetoothAdapter()
  },
  onReady: function () {
    var that = this;
    that.openBluetoothAdapter();
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
  // 调整蓝牙设备
  openBluetoothAdapter() {
    if (!wx.openBluetoothAdapter) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
      return
    }
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        this.startBluetoothDevicesDiscovery()
      },
      fail: (res) => {
        console.log('openBluetoothAdapter fail', res)
        if (res.errCode === 10001) {
          wx.showModal({
            title: '错误',
            content: '未找到蓝牙设备, 请打开蓝牙后重试。',
            showCancel: false
          })
          wx.onBluetoothAdapterStateChange((res) => {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              // 取消监听，否则stopBluetoothDevicesDiscovery后仍会继续触发onBluetoothAdapterStateChange，
              // 导致再次调用startBluetoothDevicesDiscovery
              wx.onBluetoothAdapterStateChange(() => { });
              this.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
    wx.onBLEConnectionStateChange((res) => {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      console.log('onBLEConnectionStateChange', `device ${res.deviceId} state has changed, connected: ${res.connected}`)
      this.setData({
        connected: res.connected
      })
      if (!res.connected) {
        wx.showModal({
          title: '错误',
          content: '蓝牙连接已断开',
          showCancel: false
        })
      }
    });
  },
  getBluetoothAdapterState() {
    wx.getBluetoothAdapterState({
      success: (res) => {
        console.log('getBluetoothAdapterState', res)
        if (res.discovering) {
          this.onBluetoothDeviceFound()
        } else if (res.available) {
          this.startBluetoothDevicesDiscovery()
        }
      }
    })
  },
  startBluetoothDevicesDiscovery() {
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
    wx.startBluetoothDevicesDiscovery({
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success', res)
        this.onBluetoothDeviceFound()
      },
      fail: (res) => {
        console.log('startBluetoothDevicesDiscovery fail', res)
      }
    })
  },
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery({
      complete: () => {
        console.log('stopBluetoothDevicesDiscovery')
        this._discoveryStarted = false
      }
    })
  },
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        const foundDevices = this.data.devices
        const idx = inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        if (idx === -1) {
          data[`devices[${foundDevices.length}]`] = device
        } else {
          data[`devices[${idx}]`] = device
        }
        this.setData(data)
      })
    })
  },
  // 选取连接设备
  createBLEConnection(e) {
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    const name = ds.name
    this._createBLEConnection(deviceId, name)
  },
  _createBLEConnection(deviceId, name) {
    wx.showLoading()
    wx.createBLEConnection({
      deviceId,
      success: () => {
        console.log('createBLEConnection success');
        this.setData({
          connected: true,
          name,
          deviceId,
        })
        this.getBLEDeviceServices(deviceId);
        this.writeBLECharacteristicValue();
      },
      complete() {
        wx.hideLoading()
      },
      fail: (res) => {
        console.log('createBLEConnection fail', res)
      }
    })
    this.stopBluetoothDevicesDiscovery()
  },
  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      connected: false,
      chs: [],
      canWrite: false,
    })
  },
  getBLEDeviceServices(deviceId) {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        console.log('getBLEDeviceServices', res)
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
            return
          }
        }
      }
    })
  },
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        console.log('getBLEDeviceCharacteristics success', res.characteristics)
        // 这里会存在特征值是支持write，写入成功但是没有任何反应的情况
        // 只能一个个去试
        for (let i = 0; i < res.characteristics.length; i++) {
          const item = res.characteristics[i]
          if (item.properties.write) {
            this.setData({
              canWrite: true
            })
            this._deviceId = deviceId
            this._serviceId = serviceId
            this._characteristicId = item.uuid
            break;
          }
        }
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
      }
    })
  },
  // 写入数据
  writeBLECharacteristicValue() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '您已成功连接请确认打印',
      success(res) {
        if (res.confirm) {
          let printerJobs = new PrinterJobs();
          let orderInfo = that.data.orderInfo;
          let allMsg = orderInfo.goods;
          printerJobs
            .setSize(2, 2)
            .print('***/每派外卖/***')
            .setSize(1, 1)
            .setAlign('ct')
            .setSize(2, 2)
            .print(orderInfo.shop_name)
            .setSize(1, 1)
            .print(printerUtil.fillAround('已在线支付'))
            .print('下单时间：' + orderInfo.createTime)
            .print(printerUtil.fillLine())
          // 订单列表
          allMsg.forEach((item, index) => {
            var goodsname = item.goods_name.toString();
            var num = item.num.toString();
            var price = item.price.toString();
            printerJobs.print(printerUtil.inline(goodsname + '  * ' + num, price))
          })
          let money = orderInfo.money.toString();
          let reduced_price = orderInfo.reduced_price.toString();
          let real_money = orderInfo.real_money.toString();
          printerJobs
            .print(printerUtil.fillAround('其他费用'))
            .print(printerUtil.inline('餐盒', '0'))
            .print(printerUtil.inline('配送费', money))
            .print(printerUtil.inline('满减', reduced_price))
            .print(printerUtil.fillLine())
            .print(printerUtil.inline('实际支付', real_money))
            .print(printerUtil.fillLine())
            .setAlign('lt')
            .setSize(2, 2)
            .print('地址：' + orderInfo.area_path + orderInfo.area_detail)
            .setSize(1, 1)
            .print(printerUtil.fillLine())
            .setSize(2, 2)
            .print('电话:' + orderInfo.addr_mobile)
            .setSize(1, 1)
            .print(printerUtil.fillLine())
          if (orderInfo.reduction != '') {
            let rednums = orderInfo.reduction.nums.toString();
            printerJobs
              .setSize(1, 1)
              .print('赠送')
              .print(orderInfo.reduction.goods_name)
              .println()
          }
          let buffer = printerJobs.buffer();
          console.log('ArrayBuffer', 'length: ' + buffer.byteLength, ' hex: ' + ab2hex(buffer));
          // 1.并行调用多次会存在写失败的可能性
          // 2.建议每次写入不超过20字节
          // 分包处理，延时调用
          const maxChunk = 20;
          const delay = 20;
          for (let i = 0, j = 0, length = buffer.byteLength; i < length; i += maxChunk, j++) {
            let subPackage = buffer.slice(i, i + maxChunk <= length ? (i + maxChunk) : length);
            setTimeout(that._writeBLECharacteristicValue, j * delay, subPackage);
          }
          let lens = buffer.byteLength
          // 倒计时打印第二遍
          setTimeout(that.getTwo, lens)

        }
      }
    })
  },
  getTwo() {
    let that = this;
    let printerJobs2 = new PrinterJobs();
    let orderInfo = that.data.orderInfo;
    let allMsg = orderInfo.goods;
    printerJobs2
      .setSize(2, 2)
      .print('***/每派外卖/***')
      .setSize(1, 1)
      .setAlign('ct')
      .setSize(2, 2)
      .print(orderInfo.shop_name)
      .setSize(1, 1)
      .print(printerUtil.fillAround('已在线支付'))
      .print('下单时间：' + orderInfo.createTime)
      .print(printerUtil.fillLine())
    // 订单列表
    allMsg.forEach((item, index) => {
      var goodsname = item.goods_name.toString();
      var num = item.num.toString();
      var price = item.price.toString();
      printerJobs2.print(printerUtil.inline(goodsname + '  * ' + num, price))
    })
    let money = orderInfo.money.toString();
    let reduced_price = orderInfo.reduced_price.toString();
    let real_money = orderInfo.real_money.toString();
    printerJobs2
      .print(printerUtil.fillAround('其他费用'))
      .print(printerUtil.inline('餐盒', '0'))
      .print(printerUtil.inline('配送费', money))
      .print(printerUtil.inline('满减', reduced_price))
      .print(printerUtil.fillLine())
      .print(printerUtil.inline('实际支付', real_money))
      .print(printerUtil.fillLine())
      .setAlign('lt')
      .setSize(2, 2)
      .print('地址：' + orderInfo.area_path + orderInfo.area_detail)
      .setSize(1, 1)
      .print(printerUtil.fillLine())
      .setSize(2, 2)
      .print('电话:' + orderInfo.addr_mobile)
      .setSize(1, 1)
      .print(printerUtil.fillLine())
    if (orderInfo.reduction != '') {
      let rednums = orderInfo.reduction.nums.toString();
      printerJobs2
        .setSize(1, 1)
        .print('赠送')
        .print(orderInfo.reduction.goods_name)
        .println()
    }
    let buffer2 = printerJobs2.buffer();
    console.log('ArrayBuffer', 'length: ' + buffer2.byteLength, ' hex: ' + ab2hex(buffer2));
    // 1.并行调用多次会存在写失败的可能性
    // 2.建议每次写入不超过20字节
    // 分包处理，延时调用
    const maxChunk2 = 20;
    const delay2 = 20;
    for (let i = 0, j = 0, length = buffer2.byteLength; i < length; i += maxChunk2, j++) {
      let subPackage2 = buffer2.slice(i, i + maxChunk2 <= length ? (i + maxChunk2) : length);
      setTimeout(that._writeBLECharacteristicValue, j * delay2, subPackage2);
    }
    setTimeout(function () {
      that.closeBluetoothAdapter()
    }, 10000)
  },
  _writeBLECharacteristicValue(buffer) {
    wx.writeBLECharacteristicValue({
      deviceId: this._deviceId,
      serviceId: this._serviceId,
      characteristicId: this._characteristicId,
      value: buffer,
      success(res) {
        console.log('writeBLECharacteristicValue success', res)
      },
      fail(res) {
        console.log('writeBLECharacteristicValue fail', res)
      }
    })
  },
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },
  createBLEConnectionWithDeviceId(e) {
    // 小程序在之前已有搜索过某个蓝牙设备，并成功建立连接，可直接传入之前搜索获取的 deviceId 直接尝试连接该设备
    const device = this.data.lastDevice
    if (!device) {
      return
    }
    const index = device.indexOf(':');
    const name = device.substring(0, index);
    const deviceId = device.substring(index + 1, device.length);
    console.log('createBLEConnectionWithDeviceId', name + ':' + deviceId)
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        this._createBLEConnection(deviceId, name)
      },
      fail: (res) => {
        console.log('openBluetoothAdapter fail', res)
        if (res.errCode === 10001) {
          wx.showModal({
            title: '错误',
            content: '未找到蓝牙设备, 请打开蓝牙后重试。',
            showCancel: false
          })
          wx.onBluetoothAdapterStateChange((res) => {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              // 取消监听
              wx.onBluetoothAdapterStateChange(() => { });
              this._createBLEConnection(deviceId, name)
            }
          })
        }
      }
    })
  }
})