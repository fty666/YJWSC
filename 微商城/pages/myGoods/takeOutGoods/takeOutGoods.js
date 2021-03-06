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
    px2rpxWidth: '',
    px2rpxHeight: '',
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
    let user_id = app.globalData.user_id;
    funData.getShopByCode(user_id, that, (data) => {
      that.setData({
        shop_code: data.shop.shop_code,
        shop_info: data.shop
      });
      // console.log(data.shop.shop_tip)
      let scodes = data.shop.groupId
      if (scodes == 1) {
        // 获取外卖分类
        utilFunctions.getFoodClass(data.shop.shop_code, (res) => {
          // console.log(res)
          that.setData({
            category: res
          });
        }, that);
      } else {
        // 查询分类
        funData.getClass(data.shop.groupId, that, function(res) {
          // console.log(res);
          that.setData({
            category: res
          });
        });
      }
    });
    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function(res) {
        that.setData({
          px2rpxHeight: res.data.px2rpxHeight,
          px2rpxWidth: res.data.px2rpxWidth,
        })
      }
    })

  },

  /**
   * 添加商品列表图片
   */
  addlistImg: function() {
    let that = this;
    let list_img = that.data.list_img;
    let list_img_hidden = that.data.list_img_hidden;
    funData.myUpload(function(fileNmae) {
      list_img.push(fileNmae);
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
   * 获取表单提交的值
   */
  formSubmit: function(e) {
    let that = this;
    let goods = e.detail.value;
    // 商品名称
    if (goods.goodsName == '') {
      wx.showToast({
        title: '商品名称不能为空',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    if (goods.goodsName.length>10) {
      wx.showToast({
        title: '商品名称字数过大',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    if (!util.checkReg(6,goods.goodsName)){
      wx.showToast({
        title: '商品名称输入有误',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    // 商品价格
    if (goods.price == '') {
      wx.showToast({
        title: '商品价格不能为空',
        icon: 'none',
        duration: 1000,
      });
      return;
    }

    // 商品折扣
    if (goods.stock == '') {
      wx.showToast({
        title: '商品折扣不能为空',
        icon: 'none',
        duration: 1000,
      });
      return;
    }

    if (parseInt(goods.stock) > 10 || parseInt(goods.stock) == 0) {
      wx.showToast({
        title: '商品折扣输入有误',
        icon: 'none',
        duration: 1000,
      });
      return;
    }


    // 商品描述
    if (goods.goodsDetails == '') {
      wx.showToast({
        title: '商品描述不能为空',
        icon: 'none',
        duration: 1000,
      });
      return;
    }

    // 价格只能为数字
    if (!util.checkReg(4, goods.price)) {
      wx.showToast({
        title: '价格填写不正确',
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

    // 判断最大购买量与最小购买量
    if (parseInt(goods.maxnum) < 0) {
      wx.showToast({
        title: '购买填写不正确',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    goods.minnum = 1;
    goods.img = that.data.list_img; // 图片
    goods.shopCode = that.data.shop_code;
    goods.thumbs_up = 0;
    // 添加商品
    function calback(res) {
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
    }
    utilFunctions.insertFoodGoodsUrl(goods, calback, this)
  },
});