const urlData = require('./urlData.js');
const urlDatas = require('data.js');
const util = require('./util.js');
const calculate = require('./calculate.js');
const env = require('../weixinFileToaliyun/env.js');
const uploadAliyun = require('../weixinFileToaliyun/uploadAliyun.js');
const amapFile = require('../libs/amap-wx.js');
const config = require('./config.js');
const app = getApp();
module.exports = {
  /**
   * wx.request二次封装
   */
  myWxRequest: function (myurl, mydata, mysufun) {
    wx.request({
      url: myurl,
      method: 'POST',
      data: mydata,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.state == 1) {
          mysufun(res.data);
        } else {
          wx.showToast({
            icon: 'none',
            title: '您的网络太差',
          });
        }
      }
    });
  },

  /**
   * wx.request二次封装 post请求
   */
  requestUrl: function (data, url, pageobj, callback) {
    wx.request({
      url: url,
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.state == 1) {
          console.log(res);
          callback.apply(pageobj, [res.data.data]);
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
        }
      },
      complete: function () { }
    })
  },
  httpRequest: function (data, url, callback, pageobj) {
    wx.request({
      url: url,
      data: data,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: "error:接口请求错误",
            showCancel: false
          })
        } else {
          callback.apply(pageobj, [res.data]);
          if (res.data.status != 2 && res.data.status != 1) {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }
        }
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: "error:网络请求失败",
          showCancel: false
        })
      }
    })
  },

  /**
   * 上传图片二次封装
   */
  myUpload: function (suFun) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      // 上传文件
      success: function (res) {
        // console.log(res)
        let tempFilePaths = res.tempFilePaths;
        // 临时文件路径
        let filePath = tempFilePaths[0];
        let ext = filePath.slice(filePath.lastIndexOf('.') + 1);
        let extArr = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
        // console.log(extArr.indexOf(ext));
        if (extArr.indexOf(ext) != -1) {
          // 上传文件
          wx.uploadFile({
            url: urlDatas.UploadFiles,
            filePath: filePath,
            method: 'POST',
            header: {
              "Content-Type": "multipart/form-data",
            },
            name: 'file',
            formData: {
              'user': 'test'
            },
            success(res) {
              // console.log(res);
              let data = res.data;
              suFun(data);
            }
          });
        } else {
          wx.showToast({
            title: '图片格式不正确',
            icon: 'none'
          })
        }
      }
    })
  },

  /**
   * 查询快递
   */
  inquiryExpress: function (mytype, mypostid, mysufun) {
    switch (mytype) {
      case '中通':
      case '中通快递':
        mytype = 'zhongtong';
        break;
      case '申通':
      case '申通快递':
        mytype = 'shentong';
        break;
      case '韵达':
      case '韵达快递':
        mytype = 'yunda';
        break;
      case '圆通':
      case '圆通快递':
        mytype = 'yuantong';
        break;
      case '顺丰':
      case '顺丰快递':
        mytype = 'shunfeng';
        break;
      case '苏宁':
      case '苏宁快递':
        mytype = 'suning';
        break;
    }
    // let mydata = {
    //     type: 'zhongtong',
    //     // postid:211119071939
    //     postid:210772407168
    //     // temp:0.14004732217384586
    // };
    wx.request({
      url: 'http://www.kuaidi100.com/query',
      method: 'GET',
      data: {
        type: mytype,
        postid: mypostid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res);
        // if (res.data.message == 'ok') {
        //     mysufun(res.data.data);
        // } else {
        //     mysufun(res.data.message);
        //     // wx.showToast({
        //     //     icon: 'none',
        //     //     title: res.data.message
        //     // });
        // }
        mysufun(res.data);
      }
    });
  },


  /**
   * 高德-获取定位
   * @param sucFun
   * @param errFun
   */
  amapFilePackage(sucFun, errFun) {
    let myAmapFun = new amapFile.AMapWX({ key: config.wxGaodeMapKey });
    myAmapFun.getRegeo({
      success: function (data) {
        //成功回调
        // console.log(data)
        // that.setData({
        //     locationName: data[0].regeocodeData.pois[0].name
        // });
        sucFun(data)
      },
      fail: function (info) {
        //失败回调
        console.log(info)
        errFun(info);
      }
    })
  },

  /**
   *  高德-绘制静态图
   * @param flag
   * @param parameter
   */
  staticMap: function (flag, parameter, that) {
    let myAmapFun = new amapFile.AMapWX({ key: config.wxGaodeMapKey });
    wx.getSystemInfo({
      success: function (data) {
        console.log(data);
        let height = data.windowHeight;
        let width = data.windowWidth;
        let size = width + "*" + height;
        if (flag == 'markers') {
          // 绘制两点
          myAmapFun.getStaticmap({
            zoom: 8,
            size: size,
            scale: 2,
            // markers: "mid,0xFF0000,A:"+ longitude_A +","+latitude_A +";B:"+ longitude_B +","+ latitude_B +"",
            // markers: `mid,0xFF0000,A:$(longitude_A),$(latitude_A);B:$(longitude_B),$(latitude_B)`,
            markers: parameter,

            success: function (res) {

              that.setData({
                src: res.url
              });
            },
            fail: function (info) {
              wx.showModal({ title: info.errMsg });
            }
          });
        } else if (flag == 'paths') {

          myAmapFun.getStaticmap({
            zoom: 8,
            size: size,
            scale: 2,
            // 绘制线段
            // paths: "10,0x0000ff,1,A,:116.31604,39.96491;116.320816,39.966606;116.321785,39.966827;116.32361,39.966957",
            // 绘制区域
            // paths: "10,0x0000ff,0.1,0x0000ff,0.7:116.31604,39.96491;116.320816,39.966606;116.321785,39.966827;116.32361,39.966957;116.39361,39.966957;116.39361,39.936957",
            paths: parameter,
            success: function (res) {
              console.log(res);
              that.setData({
                src: res.url
              });
            },
            fail: function (info) {
              wx.showModal({ title: info.errMsg });
            }
          });
        } else if (flag == 'labels') {
          // 绘制标签
          myAmapFun.getStaticmap({
            zoom: 8,
            size: size,
            scale: 2,
            // labels: "朝阳公园,2,0,16,0xFFFFFF,0x008000:116.48482,39.94858",
            labels: parameter,
            success: function (res) {
              that.setData({
                src: res.url
              });
            },
            fail: function (info) {
              wx.showModal({ title: info.errMsg })
            }
          });
        }
      }
    });
  },

  // getShareData: function(mmodule, callback, pageobj) {
  // 	let that = this;
  // 	let data = {
  // 		token: urlData.duoguan_user_token,
  // 		mmodule: mmodule,
  // 		_: Date.now()
  // 	};
  // 	let res = this.requestUrl(data, urlData.duoguan_get_share_data_url, callback, pageobj)
  // },

  // 登录
  mylogin: function (mycode, sufun) {
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: urlData.loginUrl,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              code: res.code
            },
            success: function (data) {
              sufun(data)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },

  // 查询商品列表(默认上架)
  getGoods: function (myshopCode, page, pageSize, pageobj, callback) {
    let that = this;
    let data = {
      shopCode: myshopCode,
      page: page,
      pageSize: pageSize,
      isUse: 1,
    };
    this.requestUrl(data, urlData.getGoodsUrl, pageobj, callback);
  },

  // 添加商品
  insertGoods: function (data, pageobj, callback) {
    this.requestUrl(data, urlData.insertGoodsUrl, pageobj, callback);
  },

  // 查询商品详情
  getGoodsDetails: function (goodsid, pageobj, callback) {
    this.requestUrl({ goodsId: goodsid }, urlData.getGoodsDetailsUrl, pageobj, callback);
  },

  // 上架/下架商品 0审核,1上架,2下架,3强制下架,4删除  // 修改商品   // 删除商品
  deleteGoods: function (goodsid, isuse, pageobj, callback) {
    let data = {
      goodsId: goodsid,
      isUse: isuse,
    };
    this.requestUrl(data, urlData.deleteGoodsUrl, pageobj, callback);
  },

  // 修改商品信息
  // updateGoods: function (goodsid, mygoods_name, mygoods_details, myprice, mystock, myimg, mystatus, pageobj, callback){
  updateGoods: function (data, pageobj, callback) {
    // let data = {
    //     goodsId: goodsid,
    //     goods_name: mygoods_name,
    //     goods_details: mygoods_details,
    //     price: myprice,
    //     stock: mystock,
    //     img:myimg,
    //     status:mystatus
    // };
    this.requestUrl(data, urlData.updateGoodsUrl, pageobj, callback);
  },

  // 查询分组
  getGroup: function (pageobj, callback) {
    this.requestUrl({}, urlData.getGroupUrl, pageobj, callback);
  },

  // 查询分类
  getClass: function (groupid, pageobj, callback) {
    let data = {
      groupId: groupid
    }
    this.requestUrl(data, urlData.getClassUrl, pageobj, callback);
  },

  // 查询商品对应的评论
  getComment: function (goodsid, pageobj, callback) {
    let data = {
      goodsId: goodsid
    }
    this.requestUrl(data, urlData.getCommentUrl, pageobj, callback);
  },

  // 添加评论
  // insertComment: function (goodsId, detail, user_id, img, order_mainid, status, grade, mold, pageobj, callback) {

  insertComment: function (shop, pageobj, callback) {
    // let data = {
    //     goodsId: goodsId,
    //     detail: detail,
    //     user_id: user_id,
    //     img: img,
    //     order_mainid: order_mainid,
    //     status: status,
    //     grade: grade,
    //     mold:mold,
    // }
    let data = shop;
    this.requestUrl(data, urlData.insertCommentUrl, pageobj, callback);
  },

  // 查询订单(查店铺的订单)
  getOrder: function (shopCode, mystatus, mypage, mypageSize, order_type, user_id, pageobj, callback) {
    let data = {
      shop_code: shopCode,
      status: mystatus,
      page: mypage,
      pageSize: mypageSize,
      order_type: order_type,
      user_id: user_id
    }
    this.requestUrl(data, urlData.getOrderUrl, pageobj, callback);
  },

  // 修改订单状态
  updateOrderStatus: function (orderMainid, mystatus, pageobj, callback) {
    let data = {
      order_mainid: orderMainid,
      status: mystatus
    }
    this.requestUrl(data, urlData.updateOrderStatusUrl, pageobj, callback);
  },

  // 外卖修改订单状态
  updateOrder: function (orderMainid, reception, pageobj, callback) {
    let data = {
      order_mainid: orderMainid,
      reception: reception
    }
    this.requestUrl(data, urlData.updateOrderStatusUrl, pageobj, callback);
  },

  // 查询订单详情
  getOrderDetail: function (orderuuid, pageobj, callback) {
    let data = {
      order_uuid: orderuuid
    }
    this.requestUrl(data, urlData.getOrderDetailUrl, pageobj, callback);
  },

  // 对订单数据的处理
  dealOrderData: function (data) {
    // console.log(data);
    let order = [];
    let k = 0;
    // // 将订单号相同的合并为一个数组
    // for (let i = 0; i < data.length; i++) {
    //     // data[i].createTime = util.formatDate(data[i].createTime, 'YY-MM-DD hh:mm:ss');
    //     order[k] = [];
    //     order[k].push(data[i]);
    //     for (let j = i + 1; j < data.length; j++) {
    //         if (data[i].order_uuid == data[j].order_uuid) {
    //             order[k].push(data[j]);
    //             data.splice(j, 1);
    //         }
    //     }
    //     k++;
    // }
    // // console.log(order);
    // // 将每个数组转化为对象
    // let orderlen = order.length;
    // for (let n = 0; n < orderlen; n++) {
    //     order[n] = { goods: order[n] };
    // }
    // // 把每个订单的独有部分提出来
    // let order_len = order.length;
    // for (let i = 0; i < order_len; i++) {
    //     order[i].order_uuid = order[i].goods[0].order_uuid;
    //     order[i].createTime = order[i].goods[0].createTime;
    //     order[i].addr_receiver = order[i].goods[0].addr_receiver;
    //     order[i].addr_mobile = order[i].goods[0].addr_mobile;
    //     order[i].area_path = order[i].goods[0].area_path;
    //     order[i].real_money = order[i].goods[0].real_money;
    //     order[i].status = order[i].goods[0].status;
    //     order[i].order_mainid = order[i].goods[0].order_mainid;
    //     let sum = 0;
    //     let goods_len = order[i].goods.length;
    //     for (let j = 0; j < goods_len; j++) {
    //         order[i].goods[j].sum = calculate.calcMul(order[i].goods[j].num, order[i].goods[j].goodsPrice);
    //         sum = calculate.calcAdd(sum, order[i].goods[j].sum);
    //     }
    //     order[i].sumPrice = sum;
    // }
    // return order;
    let newData = data;
    let newDataLen = newData.length;
    let newOrder = {};
    // 把订单号提取出来成为一个新的对象
    for (let i = 0; i < newDataLen; i++) {
      newOrder[newData[i].order_uuid] = [];
    }
    // console.log(newOrder)

    // 把订单号相同的放到一个数组里
    for (let key in newOrder) {
      for (let j = 0; j < newDataLen; j++) {
        if (newData[j].order_uuid == key) {
          newOrder[key].push(newData[j]);
        }
      }
    }
    // 将每个对象里的数组转化为对象
    for (let key in newOrder) {
      newOrder[key] = { goods: newOrder[key] }
    }
    // 把每个订单的独有部分提出来
    let orderArr = [];
    for (let key in newOrder) {
      newOrder[key].order_uuid = newOrder[key].goods[0].order_uuid;
      newOrder[key].createTime = newOrder[key].goods[0].createTime;
      newOrder[key].addr_receiver = newOrder[key].goods[0].addr_receiver;
      newOrder[key].addr_mobile = newOrder[key].goods[0].addr_mobile;
      newOrder[key].area_path = newOrder[key].goods[0].area_path;
      newOrder[key].area_detail = newOrder[key].goods[0].area_detail;
      newOrder[key].addr_id = newOrder[key].goods[0].addr_id;
      newOrder[key].real_money = newOrder[key].goods[0].real_money;
      newOrder[key].status = newOrder[key].goods[0].status;
      newOrder[key].order_mainid = newOrder[key].goods[0].order_mainid;
      newOrder[key].order_addresss = newOrder[key].goods[0].order_addresss;
      newOrder[key].groupId = newOrder[key].goods[0].groupId;
      newOrder[key].orderMobile = newOrder[key].goods[0].orderMobile;
      newOrder[key].orderReceiver = newOrder[key].goods[0].orderReceiver;
      newOrder[key].orderPathDetail = newOrder[key].goods[0].orderPathDetail;
      newOrder[key].orderDetail = newOrder[key].goods[0].orderDetail;
      // 计算每个订单的总价
      let sum = 0;
      let goods_len = newOrder[key].goods.length;
      for (let j = 0; j < goods_len; j++) {
        newOrder[key].goods[j].sum = calculate.calcMul(newOrder[key].goods[j].num, newOrder[key].goods[j].goodsPrice);
        sum = calculate.calcAdd(sum, newOrder[key].goods[j].sum);
      }
      // 订单小数部分没有,转换成带2位小数的
      sum = String(sum).split('.');
      if (sum[1] == undefined || sum[1] == '' || sum[1] == null) {
        sum.push('00');
      } else if (sum[1].length == 1) {
        sum[1] = sum[1] + '0';
      }
      sum = sum.join('.');
      newOrder[key].sumPrice = sum;
      orderArr.push(newOrder[key]);
    }
    // console.log(orderArr);
    return orderArr;
  },

  //  查询退换货
  getGoodBack: function (orderuuid, pageobj, callback) {
    let data = {
      order_uuid: orderuuid
    }
    this.requestUrl(data, urlData.getGoodBackUrl, pageobj, callback);
  },

  // 查询售卖总金额
  getOrderMoney: function (shopCode, pageobj, callback) {
    let data = {
      shop_code: shopCode
    }
    this.requestUrl(data, urlData.getOrderMoneyUrl, pageobj, callback);
  },

  // 查询每笔订单的金额
  getOneOrderMoney: function (shopCode, mypage, mypageSize, pageobj, callback) {
    let data = {
      shop_code: shopCode,
      page: mypage,
      pageSize: mypageSize
    }
    this.requestUrl(data, urlData.getOneOrderMoneyUrl, pageobj, callback);
  },

  // 按天查询订单金额
  getMoneyByDay: function (shopCode, myyear, mymonth, pageobj, callback) {
    let data = {
      shop_code: shopCode,
      year: myyear,
      month: mymonth
    }
    this.requestUrl(data, urlData.getMoneyByDayUrl, pageobj, callback);
  },

  // 按月查询订单金额
  getMoneyByMonth: function (shopCode, myyear, pageobj, callback) {
    let data = {
      shop_code: shopCode,
      year: myyear,
    }
    this.requestUrl(data, urlData.getMoneyByDayUrl, pageobj, callback);
  },

  // 修改商家logo信息
  updateInfoLogo: function (shopCode, mylogo, pageobj, callback) {
    let data = {
      shop_code: shopCode,
      logo: mylogo,
    }
    this.requestUrl(data, urlData.updateInfoUrl, pageobj, callback);
  },

  // 修改商家信息 
  updateInfoByCode: function (data, pageobj, callback) {
    // let data = {
    //     shop_code: shopCode,
    //     groupId: groupId,
    //     shop_name: myshop_name,
    //     shop_addr: myshop_addr,
    //     shop_detail: myshop_detail,
    //     shop_tip: myshop_tip,
    //     mobile: mymobile,
    //     smsCode: mysmsCode,
    // }
    this.requestUrl(data, urlData.updateInfoByCodeUrl, pageobj, callback);
  },

  // 完善商家信息
  updateShopInfo: function (data, pageobj, callback) {
    // let data = {
    //     shop_code: shopCode,
    //     shop_detail: myshop_detail,
    //     shop_addr:myshop_addr
    //     ID_card: myID_card,
    //     shop_tip: myshop_tip,
    //     ID_img: myID_img,
    //     group_id: mygroup_id,
    //     level: 3
    // }
    this.requestUrl(data, urlData.updateInfoUrl, pageobj, callback);
  },

  // 查询商家信息
  getShop: function (shopCode, pageobj, callback) {
    let data = {
      shop_code: shopCode,
      page: 1,
      pageSize: 1
    }
    this.requestUrl(data, urlData.getShopUrl, pageobj, callback);
  },

  // 查看单个商店信息 userid
  getShopByCode: function (userid, pageobj, callback) {
    let data = {
      user_id: userid,
    }
    this.requestUrl(data, urlData.getShopByCodeurl, pageobj, callback);
  },
  // 查询单个信息 shopcode
  getShopbycode: function (shopcod, pageobj, callback) {
    let data = {
      shop_code: shopcod,
    }
    this.requestUrl(data, urlData.getShopByCodeurl, pageobj, callback);
  },

  // 查所有银行卡
  getCardByCode: function (shopCode, pageobj, callback) {
    let data = {
      shop_code: shopCode,
    }
    this.requestUrl(data, urlData.getCardByCodeUrl, pageobj, callback);
  },

  // 根据id查银行卡
  getCardById: function (mycid, pageobj, callback) {
    let data = {
      cid: mycid,
    }
    this.requestUrl(data, urlData.getCardByCodeUrl, pageobj, callback);
  },

  // 设为默认银行卡
  updateCardDefault: function (cid, shopcode, pageobj, callback) {
    let data = {
      cid: cid,
      shop_code: shopcode
    }
    this.requestUrl(data, urlData.updateCardDefaultUrl, pageobj, callback);
  },

  // 添加银行卡
  insertCard: function (myowner, myID_card, mycard_no, mymobile, mybank, shopcode, pageobj, callback) {
    let data = {
      owner: myowner,
      ID_card: myID_card,
      card_no: mycard_no,
      mobile: mymobile,
      bank: mybank,
      shop_code: shopcode,
    }
    this.requestUrl(data, urlData.insertCardUrl, pageobj, callback);
  },

  // 删除银行卡
  deleteCard: function (mycard_id, pageobj, callback) {
    let data = {
      card_id: mycard_id
    }
    this.requestUrl(data, urlData.deleteCardUrl, pageobj, callback);
  },

  // 添加物流信息
  insertTransInfo: function (myorder_uuid, mytransNO, myshortName, myorder_mainid, pageobj, callback) {
    let data = {
      order_uuid: myorder_uuid,
      transNO: mytransNO,
      shortName: myshortName,
      order_mainid: myorder_mainid,
      status: 3
    }
    this.requestUrl(data, urlData.insertTransInfoUrl, pageobj, callback);
  },

  // 获取单个物流信息
  getTransInfo: function (myorder_uuid, pageobj, callback) {
    let data = {
      order_uuid: myorder_uuid,
    }
    this.requestUrl(data, urlData.getTransInfoUrl, pageobj, callback);
  },

  // 查询收藏商店的用户
  getUserByCode: function (shopCode, pageobj, callback) {
    let data = {
      shop_code: shopCode,
    }
    this.requestUrl(data, urlData.getUserByCodeUrl, pageobj, callback);
  },

  // 商家提现
  withdraw: function (datas, pageobj, callback) {
    let data = datas;
    this.requestUrl(data, urlData.withdrawUrl, pageobj, callback);
  },

  // 查询提现记录
  getWithdrawal: function (shopCode, mystatus, mypage, mypageSize, pageobj, callback) {
    let data = {
      shopCode: shopCode,
      status: mystatus,
      page: mypage,
      pageSize: mypageSize
    }
    this.requestUrl(data, urlData.getWithdrawalUrl, pageobj, callback);
  },

  // 修改退换货状态
  updateBackStatus: function (myorder_uuid, pageobj, callback) {
    let data = {
      order_uuid: myorder_uuid
    }
    this.requestUrl(data, urlData.updateBackStatusUrl, pageobj, callback);
  },

  // 商店注册
  insertShop: function (data, pageobj, callback) {
    // let data = {
    //     owner: myowner,
    //     shop_name:myshop_name,
    //     shop_detail:myshop_detail,
    //     user_id: myuser_id
    // }
    this.requestUrl(data, urlData.insertShopUrl, pageobj, callback);
  },

  // 获取分组
  getGroup: function (pageobj, callback) {
    this.requestUrl({}, urlData.getGroupUrl, pageobj, callback);
  },

  // 发送验证码
  getSms: function (mymobile, pageobj, callback) {
    this.requestUrl({ mobile: mymobile }, urlData.getSmsUrl, pageobj, callback);
  },

  // 根据user_id获取shop_code
  getShopCode: function (myuser_id, pageobj, callback) {
    this.requestUrl({ user_id: myuser_id }, urlData.getShopCodeUrl, pageobj, callback);
  },

  // 根据user_id获取用户信息
  getUser: function (myuser_id, pageobj, callback) {
    this.requestUrl({ user_id: myuser_id }, urlData.getUserUrl, pageobj, callback);
  },

  // 根据user_id查询用户拥有优惠券
  getUserCoupon: function (myuser_id, mypage, mypageSize, pageobj, callback) {
    this.requestUrl({ user_id: myuser_id, page: mypage, pageSize: mypageSize }, urlData.getUserCouponUrl, pageobj, callback);
  },

  // 查询对应店铺可用优惠券
  getUserShopCoupon: function (data, pageobj, callback) {
    // let data = {
    //         //     user_id: myuser_id,
    //         //     shop_code: myshop_code,
    //         //     status: mystatus,
    //         //     payPrice: mypayPrice,
    //         //     page: mypage,
    //         //     pageSize: mypageSize
    //         // }
    this.requestUrl(data, urlData.getUserCouponUrl, pageobj, callback);
  },

  // 添加优惠券
  insertCoupon: function (data, pageobj, callback) {
    this.requestUrl(data, urlData.insertCouponUrl, pageobj, callback);
  },

  // 根据店铺查询优惠券
  getCoupon: function (myshop_code, page, pageSize, pageobj, callback) {
    let data = {
      shop_code: myshop_code,
      page: page,
      pageSize: pageSize
    }
    this.requestUrl(data, urlData.getCouponUrl, pageobj, callback);
  },

  // 删除优惠券
  deleteCoupon: function (mycouponId, start, pageobj, callback) {
    this.requestUrl({ couponId: mycouponId, start: start }, urlData.deleteCouponUrl, pageobj, callback);
  },

  // 领取优惠券
  insertUC: function (myuser_id, mycouponId, pageobj, callback) {
    let data = {
      user_id: myuser_id,
      couponId: mycouponId
    };
    this.requestUrl(data, urlData.insertUCUrl, pageobj, callback);
  },

  // 根据分组查询外卖商店
  getFoodsShop: function (data, pageobj, callback) {
    this.requestUrl(data, urlData.getFoodsShopUrl, pageobj, callback);
  },

  // 根据用户id获取用户收货地址
  getAddr: function (myuser_id, pageobj, callback) {
    this.requestUrl({ user_id: myuser_id }, urlData.getAddrUrl, pageobj, callback);
  },

  // 根据用户id获取默认地址
  getAddrByDefault: function (myuser_id, pageobj, callback) {
    this.requestUrl({ user_id: myuser_id }, urlData.getAddrByDefaultUrl, pageobj, callback);
  },

  // 根据地址id查单个地址
  getAddrById: function (myaddr_id, pageobj, callback) {
    this.requestUrl({ addr_id: myaddr_id }, urlData.getAddrByIdUrl, pageobj, callback);
  },

  // 根据shop_code获取店铺分类
  getFoodClass: function (myshop_code, pageobj, callback) {
    this.requestUrl({ shop_code: myshop_code }, urlData.getFoodClassUrl, pageobj, callback);
  },

  // 添加外卖分类
  insertFoodsClass: function (myshop_code, myclassName, pageobj, callback) {
    this.requestUrl({ shop_code: myshop_code, className: myclassName }, urlData.insertFoodsClassUrl, pageobj, callback);
  },

  // 修改外卖分类
  updateFoodsClass: function (myfoodClassId, myclassName, pageobj, callback) {
    this.requestUrl({ foodClassId: myfoodClassId, className: myclassName }, urlData.updateFoodsClassUrl, pageobj, callback);
  },

  // 删除外卖分类
  deleteFoodsClass: function (myfoodClassId, pageobj, callback) {
    this.requestUrl({ foodClassId: myfoodClassId }, urlData.deleteFoodsClassUrl, pageobj, callback);
  },

  // 查询外卖商品列表
  getFoodGoods: function (data, pageobj, callback) {
    // let data = {
    //     shopCode: myshopCode,
    //     isUse: myisUse,
    //     foodsClassId:myfoodsClassId,
    //     page: mypage,
    //     pageSize: mypageSize
    // };
    this.requestUrl(data, urlData.getFoodGoodsUrl, pageobj, callback);
  },

  // 根据shop_code获取商品详情
  getFoodGoodsDetails: function (shop_code, page, pageSize, isUse, pageobj, callback) {
    let data = {
      shopCode: shop_code,
      page: page,
      pageSize, pageSize,
      isUse: isUse
    }
    this.requestUrl(data, urlData.getFoodGoodsDetailsUrl, pageobj, callback);
  },

  // 根据shop_code查单个外卖商家
  getOutShopByCode: function (myshop_code, pageobj, callback) {
    this.requestUrl({ shop_code: myshop_code }, urlData.getOutShopByCodeUrl, pageobj, callback);
  },

  // 提交订单
  insertOrder: function (data, pageobj, callback) {
    this.requestUrl(data, urlData.insertOrderUrl, pageobj, callback);
  },

  // 验证手机验证码(商家修改信息时使用)
  verificationSms: function (data, pageobj, callback) {
    this.requestUrl(data, urlData.verificationSmsUrl, pageobj, callback);
  },

  // 查询查询经纬度
  getMap: function (myorder_uuid, pageobj, callback) {
    this.requestUrl({ order_uuid: myorder_uuid }, urlData.getMapUrl, pageobj, callback);
  },

  // 订单成功手机短信通知
  getOrderSms: function (mymobile, pageobj, callback) {
    this.requestUrl({ mobile: mymobile }, urlData.getOrderSmsUrl, pageobj, callback);
  },

  // 修改营业状态
  updateOutShopSale: function (shop_code, is_sale, pageobj, calback) {
    console.log(shop_code)
    console.log(is_sale)
    let data = {
      shop_code: shop_code,
      is_sale: is_sale
    }
    this.requestUrl(data, urlData.updateOutShopSale, pageobj, calback);
  },

  // 根据shop_code获取商品
  getGoodsByCodeUrl: function (shop_code, pageobj, calback) {
    let data = {
      shop_code: shop_code,
    }
    this.requestUrl(data, urlData.getGoodsByCodeUrl, pageobj, calback);
  },

  // 添加满赠
  insertReductionInGoods: function (datas, pageobj, calback) {
    let data = datas;
    this.requestUrl(data, urlData.insertReductionInGoods, pageobj, calback);
  },
  // 查询满赠
  getReductionInGoods: function (datas, pageobj, calback) {
    let data = datas;
    this.requestUrl(data, urlData.getReductionInGoods, pageobj, calback);
  },
  //删除满赠
  deleteReduction: function (datas, pageobj, calback) {
    let data = datas;
    this.requestUrl(data, urlData.deleteReduction, pageobj, calback);
  },

  // 修改满赠
  updateReductionInGoods: function (datas, pageobj, calback) {
    let data = datas;
    this.requestUrl(data, urlData.updateReductionInGoods, pageobj, calback);
  },
  // 获取满赠的信息
  getReductionInGoodsById: function (datas, pageobj, calback) {
    let data = datas;
    this.requestUrl(data, urlData.getReductionInGoodsById, pageobj, calback);
  },
  //查询待付款
  getNoPayOrder: function (user_id, pageobj, calback) {
    let data = {
      user_id: user_id,
      orderType: 2
    };
    this.requestUrl(data, urlData.getNoPayOrder, pageobj, calback);
  },

  //去付款
  getPayOrder: function (uuid, pageobj, calback) {
    let data = {
      relevanceUUID: uuid
    };
    this.requestUrl(data, urlData.getPayOrder, pageobj, calback);
  },


  //取消订单
  updateRelevanceOrder: function (oid, pageobj, calback) {
    let data = {
      relevanceUUID: oid
    };
    this.requestUrl(data, urlData.updateRelevanceOrder, pageobj, calback);
  },

  // 添加外卖评论
  insertShopComment: function (datas, calback, pageobj) {
    let data = datas;
    this.requestUrl(data, urlData.insertShopComment, calback, pageobj);
  },
  // 获取骑手信息
  getHorseManByUUID: function (datas, calbacks, pageobj) {
    let data = datas;
    this.requestUrl(data, urlData.getHorseManByUUID, pageobj, calbacks, );
  },

  //查询可提现金额
  getPayAccount: function (shopCode, pageobj, calbacks) {
    let data = {
      shopCode: shopCode
    };
    this.requestUrl(data, urlData.getPayAccount, pageobj, calbacks, );
  },

  //查询物流公司
  getCompany: function (pageobj, calbacks) {
    let data = {

    };
    this.requestUrl(data, urlData.getCompany, pageobj, calbacks, );
  }
}





