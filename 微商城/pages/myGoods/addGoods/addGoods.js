const app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const util = require('../../../utils/util.js');
const utilFunctions = require('../../../utils/functionData.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_info: '',
    shop_code: '',
    category: null,
    list_img: [],
    list_img_hidden: true,
    swiper_img: [],
    swiper_sort: {},
    swiper_img_hidden: true,
    goodsDetail_img: [],
    goodsDetail_sort: {},
    goodsDetail_img_hidden: true,
    aliyunUrl: urlData.uploadFileUrl,
    goods_spec: {
      color_spec: [],
      size_spec: [],
      capacity_spec: [],
      type_spec: [],
      taste_spec: [],
    },
    goods_spec_value: {
      color_spec_value: [],
      size_spec_value: [],
      capacity_spec_value: [],
      type_spec_value: [],
      taste_spec_value: []
    },
    px2rpxHeight:'',
    px2rpxWidth:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      code: options.scode
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
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
    let user_id = app.globalData.user_id;
    funData.getShopByCode(user_id, that, (data) => {
      that.setData({
        shop_code: data.shop.shop_code,
        shop_info: data.shop
      });
      let scodes = data.shop.groupId;
      if (scodes == 1) {
        // 获取外卖分类
        utilFunctions.getFoodClass(data.shop.shop_code, (res) => {
          console.log(res)
          that.setData({
            category: res
          });
        }, that);
      } else {
        if (data.shop.groupId == 'undefined' || data.shop.groupId == undefined) {
          wx.showModal({
            title: '提示',
            content: '请先完善店铺信息',
            icon: 'none',
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/myself/myself',
                })
              }
            }
          })
          return false;
        }
        // 查询分类
        funData.getClass(data.shop.groupId, that, function(res) {
          console.log(res);
          that.setData({
            category: res
          });
        });
      }
    });
  },

  /**
   * 添加类型
   */
  spec: function(e) {
    let that = this;
    // 获取类型
    let myspec = e.currentTarget.dataset.spec;
    let goods_spec = that.data.goods_spec;
    // 动态获取类型变量
    let data = goods_spec[myspec];
    // 动态添加类型输入框
    data.push(data.length);
    // 重新赋值
    goods_spec[myspec] = data;
    that.setData({
      goods_spec: goods_spec
    })

  },

  /**
   * 获取类型值
   */
  specInput: function(e) {
    let that = this;
    let goods_spec_value = that.data.goods_spec_value;
    let myspec = e.currentTarget.dataset.spec;
    let myspec_value = myspec + '_value';
    let data = goods_spec_value[myspec_value];
    // 获取点击按钮的下标
    let index = e.currentTarget.dataset.index;
    // 获取输入框的值
    let val = e.detail.value;
    data.splice(index, 1, val);
    // 重新赋值
    goods_spec_value[myspec_value] = data;
    that.setData({
      goods_spec_value: goods_spec_value
    });
    return val;
  },

  /**
   * 删除类型
   */
  cancleInput: function(e) {
    let that = this;
    let goods_spec = that.data.goods_spec;
    let goods_spec_value = that.data.goods_spec_value;
    let myspec = e.currentTarget.dataset.spec;
    let myspec_value = myspec + '_value';
    let data_spec = goods_spec[myspec];
    let data_value = goods_spec_value[myspec_value];
    let index = e.currentTarget.dataset.index;
    data_spec.splice(index, 1);
    data_value.splice(index, 1);
    goods_spec[myspec] = data_spec;
    goods_spec_value[myspec_value] = data_value;
    that.setData({
      goods_spec: goods_spec,
      goods_spec_value: goods_spec_value
    });
  },

  /**
   * 添加商品列表图片
   */
  addlistImg: function() {
    let that = this;
    let list_img = that.data.list_img;
    let list_img_hidden = that.data.list_img_hidden;
    funData.myUpload(function(fileName) {
      list_img.push(fileName);
      if (list_img.length >= 1) {
        list_img_hidden = !list_img_hidden;
      }
      that.setData({
        list_img: list_img,
        list_img_hidden: list_img_hidden
      });
    });
  },

  /**
   * 添加商品轮播图片,规定三张
   */
  addswiperImg: function() {
    let that = this;
    let swiper_img = that.data.swiper_img;
    let swiper_sort = that.data.swiper_sort;
    let swiper_img_hidden = that.data.swiper_img_hidden;
    funData.myUpload(function(fileNmae) {
      swiper_img.push(fileNmae);
      for (let i = 0; i < swiper_img.length; i++) {
        if (swiper_img[i] == fileNmae) {
          swiper_sort[swiper_img[i]] = i;
        }
      }
      if (swiper_img.length >= 3) {
        swiper_img_hidden = !swiper_img_hidden;
      }
      that.setData({
        swiper_img: swiper_img,
        swiper_sort: swiper_sort,
        swiper_img_hidden: swiper_img_hidden
      });
    });
  },
  /**
   *查看大图片 
   */
  bigImg(e) {
    var imgs = e.currentTarget.dataset.imgsrc;
    var arr = [];
    arr.push(imgs)
    //图片预览
    wx.previewImage({
      current: imgs, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  /**
   * 轮播图排序
   */
  swiperSort: function(e) {
    let that = this;
    let swiper_sort = that.data.swiper_sort;
    let index = e.currentTarget.dataset.index;
    let img = e.currentTarget.dataset.sort;
    swiper_sort[img] = e.detail.value;
    that.setData({
      swiper_sort: swiper_sort
    });
  },

  /**
   * 添加商品详情图片,规定4张
   */
  addgoodsDetailImg: function() {
    let that = this;
    let goodsDetail_img = that.data.goodsDetail_img;
    let goodsDetail_sort = that.data.goodsDetail_sort;
    let goodsDetail_img_hidden = that.data.goodsDetail_img_hidden;
    funData.myUpload(function(fileNmae) {
      goodsDetail_img.push(fileNmae);
      for (let i = 0; i < goodsDetail_img.length; i++) {
        if (goodsDetail_img[i] == fileNmae) {
          goodsDetail_sort[goodsDetail_img[i]] = i;
        }
      }
      that.setData({
        goodsDetail_img: goodsDetail_img,
        goodsDetail_sort: goodsDetail_sort,
      });
    });

  },

  /**
   * 详情图片排序
   */
  detailSort: function(e) {
    let that = this;
    let goodsDetail_sort = that.data.goodsDetail_sort;
    let img = e.currentTarget.dataset.sort;
    goodsDetail_sort[img] = e.detail.value;
    that.setData({
      goodsDetail_sort: goodsDetail_sort
    });
  },

  /**
   * 删除图片
   */
  cancleImg: function(e) {
    let that = this;
    let status = e.currentTarget.dataset.status;
    let index = e.currentTarget.dataset.index;
    let data = null;
    if (status == '1') {
      data = that.data.list_img;
      data.splice(index, 1);
      that.setData({
        list_img: data,
        list_img_hidden: true
      });
    } else if (status == '2') {
      data = that.data.swiper_img;
      data.splice(index, 1);
      that.setData({
        swiper_img: data,
        swiper_img_hidden: true
      });
    } else if (status == '3') {
      data = that.data.goodsDetail_img;
      data.splice(index, 1);
      that.setData({
        goodsDetail_img: data,
        goodsDetail_img_hidden: true
      });
    }

  },
  /**
   *查看大图片 
   */
  bigImg(e) {
    var imgs = e.currentTarget.dataset.imgsrc;
    var arr = [];
    arr.push(imgs)
    //图片预览
    wx.previewImage({
      current: imgs, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },

  /**
   * 获取表单提交的值
   */
  formSubmit: function(e) {
    let that = this;
    let goods = e.detail.value;
    // 主要信息不能为空
    if (goods.goods_details == '' || goods.goods_name == '' || goods.price == '' || goods.stock == '') {
      wx.showToast({
        title: '请填写正确信息',
        icon: 'none',
        duration: 1000,
      });
      return;
    }

    // 价格只能为数字
    if (!util.checkReg(4, goods.price)) {
      wx.showToast({
        title: '价格不正确',
        icon: 'none',
        duration: 1000,
      });
      return;
    }

    // 折扣为0.1-9.9之间
    if (!util.checkReg(4, goods.discount)) {
      wx.showToast({
        title: '折扣不正确',
        icon: 'none',
        duration: 1000,
      });
      return;
    }

    if (goods.discount > 10 || goods.discount == 0) {
      wx.showToast({
        title: '折扣不正确',
        icon: 'none',
        duration: 1000,
      });
      return;
    }

    let list_img = that.data.list_img;
    let swiper_img = that.data.swiper_img;
    let swiper_sort = that.data.swiper_sort;
    let goodsDetail_img = that.data.goodsDetail_img;
    let goodsDetail_sort = that.data.goodsDetail_sort;
    let status = ''; // 存放图片的状态, 列表图1,轮播图2,详情图3
    let img = ''; // 存放图片
    let sort = ''; // 存放图片排序
    // 商品列表图
    let list_img_len = list_img.length;
    for (let i = 0; i < list_img_len; i++) {
      img += list_img[i] + ',';
      status += '1,'
      sort += '0,'
    }
    // 商品轮播图
    let swiper_img_len = swiper_img.length;
    for (let i = 0; i < swiper_img_len; i++) {
      img += swiper_img[i] + ',';
      status += '2,';
      // JSON.stringify(c) == "{}"
      if (JSON.stringify(swiper_sort) != "{}") {
        for (let k in swiper_sort) {
          if (k == swiper_img[i]) {
            sort += swiper_sort[k] + ',';
          }
        }
      } else {
        sort += i + ',';
        console.log(111)
      }
    }
    // 商品详情图
    let goodsDetail_img_len = goodsDetail_img.length;
    for (let i = 0; i < goodsDetail_img_len; i++) {
      img += goodsDetail_img[i] + ',';
      status += '3,';
      if (JSON.stringify(goodsDetail_sort) != "{}") {
        for (let m in goodsDetail_sort) {
          if (m == goodsDetail_img[i]) {
            sort += goodsDetail_sort[m] + ',';
          }
        }
      } else {
        sort += i + ',';
        console.log(222)

      }
    }
    goods.img = img; // 图片
    goods.status = status; // 图片转态
    goods.shopCode = that.data.shop_code; // 商品编号
    goods.sort = sort; // 图片排序
    goods.color = that.data.goods_spec_value.color_spec_value.join(','); // 颜色规格
    goods.size = that.data.goods_spec_value.size_spec_value.join(','); // 尺码规格
    goods.type = that.data.goods_spec_value.type_spec_value.join(','); // 类型规格
    goods.volume = that.data.goods_spec_value.capacity_spec_value.join(','); // 容量规格
    goods.taste = that.data.goods_spec_value.taste_spec_value.join(','); // 容量规格

    // 添加商品
    funData.insertGoods(goods, that, () => {
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1000,
      });
      setTimeout(function() {
        wx.redirectTo({
          url: '/pages/myGoods/goodsList/goodsList?selectype=' + 'shenhe'
        })
      }, 1500);
    });
  },
});