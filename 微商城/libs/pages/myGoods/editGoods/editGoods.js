const app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: null,
    category: null,
    list_img_hidden: true,
    swiper_sort: {},
    swiper_img_hidden: true,
    goodsDetail_sort: {},
    goodsDetail_img_hidden: true,
    aliyunUrl: urlData.uploadFileUrl,
    goods_picture: {
      list_img: [],
      swiper_img: [],
      goodsDetail_img: [],
    },
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
  onLoad: function (options) {
    // console.log(options.goodsId);
    let that = this;
    // 查询分类
    funData.getClass(app.globalData.groupId, that, function (data) {
      // console.log(data);
      that.setData({
        category: data
      });
    });
    // 获取商品详情
    funData.getGoodsDetails(options.goodsId, this, function (data) {
      console.log(data);
      let picture = data.picture;
      let len = picture.length;

      let swiper_sort = that.data.swiper_sort;
      let goodsDetail_sort = that.data.goodsDetail_sort;
      let list_img_hidden = null;
      let swiper_img_hidden = null;
      let goodsDetail_img_hidden = null;
      // 商品规格
      let goods_spec_value = that.data.goods_spec_value;
      let goods_spec = that.data.goods_spec;
      goods_spec.color_spec = goods_spec_value.color_spec_value = data.color ? data.color.split(',') : [];
      goods_spec.size_spec = goods_spec_value.size_spec_value = data.size ? data.size.split(',') : [];
      goods_spec.capacity_spec = goods_spec_value.capacity_spec_value = data.volume ? data.volume.split(',') : [];
      goods_spec.type_spec = goods_spec_value.type_spec_value = data.type ? data.type.split(',') : [];
      goods_spec.taste_spec = goods_spec_value.taste_spec_value = data.taste ? data.taste.split(',') : [];
      // 商品图片
      let goods_picture = that.data.goods_picture;
      let list_img = goods_picture.list_img;
      let swiper_img = goods_picture.swiper_img;
      let goodsDetail_img = goods_picture.goodsDetail_img;
      for (let i = 0; i < len; i++) {
        if (picture[i].status == 1) {
          list_img.push({ img: picture[i].img, sort: picture[i].sort, status: picture[i].status });
        } else if (picture[i].status == 2) {
          swiper_img.push({ img: picture[i].img, sort: picture[i].sort, status: picture[i].status });
          swiper_sort[picture[i].img] = picture[i].sort;
        } else if (picture[i].status == 3) {
          goodsDetail_img.push({ img: picture[i].img, sort: picture[i].sort, status: picture[i].status });
          goodsDetail_sort[picture[i].img] = picture[i].sort;
        }
      }
      goods_picture.list_img = list_img;
      goods_picture.swiper_img = swiper_img;
      goods_picture.goodsDetail_img = goodsDetail_img;

      if (list_img.length >= 1) {
        list_img_hidden = false;
      }
      if (swiper_img.length >= 3) {
        swiper_img_hidden: false;
      }
      if (goodsDetail_img.length >= 4) {
        goodsDetail_img_hidden = false;
      }
      // console.log(swiper_img);
      that.setData({
        goodsInfo: data,
        list_img: list_img,
        swiper_img: swiper_img,
        swiper_sort: swiper_sort,
        goodsDetail_img: goodsDetail_img,
        goodsDetail_sort: goodsDetail_sort,
        list_img_hidden: list_img_hidden,
        swiper_img_hidden: swiper_img_hidden,
        goodsDetail_img_hidden: goodsDetail_img_hidden,
        goods_spec_value: goods_spec_value,
        goods_spec: goods_spec,
        goods_picture: goods_picture
      });
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
   * 添加类型
   */
  spec: function (e) {
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
  specInput: function (e) {
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
  cancleInput: function (e) {
    let that = this;
    let goods_spec = that.data.goods_spec;
    let goods_spec_value = that.data.goods_spec_value;
    // console.log(goods_spec);
    // console.log(goods_spec_value);

    let myspec = e.currentTarget.dataset.spec;
    let myspec_value = myspec + '_value';
    let data_spec = goods_spec[myspec];
    let data_value = goods_spec_value[myspec_value];
    let index = e.currentTarget.dataset.index;

    // console.log(data_spec)
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
  addlistImg: function () {
    let that = this;
    let goods_picture = that.data.goods_picture;
    let list_img = goods_picture.list_img;
    // let list_img = [];
    let list_img_hidden = that.data.list_img_hidden;
    funData.myUpload(function (fileNmae) {
      list_img.push({ img: fileNmae, sort: 0, status: 1 });
      if (list_img.length >= 1) {
        list_img_hidden = !list_img_hidden;
      }
      goods_picture.list_img = list_img;
      that.setData({
        goods_picture: goods_picture,
        list_img_hidden: list_img_hidden
      });
    });
  },

  /**
   * 添加商品轮播图片,规定三张
   */
  addswiperImg: function () {
    let that = this;
    let goods_picture = that.data.goods_picture;
    let swiper_img = goods_picture.swiper_img;
    let swiper_sort = that.data.swiper_sort;
    let swiper_img_hidden = that.data.swiper_img_hidden;
    funData.myUpload(function (fileNmae) {
      swiper_img.push({ img: fileNmae, sort: 0, status: 2 });
      for (let i = 0; i < swiper_img.length; i++) {
        if (swiper_img[i].img == fileNmae) {
          swiper_sort[swiper_img[i].img] = i;
          swiper_img[i].sort = i;
        }
      }
      goods_picture.swiper_img = swiper_img;
      // if (swiper_img.length >= 3) {
      //     swiper_img_hidden = !swiper_img_hidden;
      // }
      that.setData({
        // swiper_img: swiper_img,
        goods_picture: goods_picture,
        swiper_sort: swiper_sort,
        // swiper_img_hidden: swiper_img_hidden
      });
    });
  },

  /**
   * 轮播图排序
   */
  swiperSort: function (e) {
    let that = this;
    let goods_picture = that.data.goods_picture;
    let swiper_img = goods_picture.swiper_img;
    let swiper_sort = that.data.swiper_sort;

    let img = e.currentTarget.dataset.sort;
    let val = e.detail.value;
    swiper_sort[img] = e.detail.value;
    for (let i = 0; i < swiper_img.length; i++) {
      if (swiper_img[i].img == img) {
        swiper_img[i].sort = val;
      }
    }
    goods_picture.swiper_img = swiper_img;
    // console.log(swiper_sort)
    that.setData({
      swiper_sort: swiper_sort,
      goods_picture: goods_picture
    });
  },

  /**
   * 添加商品详情图片,规定4张
   */
  addgoodsDetailImg: function () {
    let that = this;
    let goods_picture = that.data.goods_picture;
    let goodsDetail_img = goods_picture.goodsDetail_img;

    let goodsDetail_sort = that.data.goodsDetail_sort;
    let goodsDetail_img_hidden = that.data.goodsDetail_img_hidden;
    funData.myUpload(function (fileNmae) {
      goodsDetail_img.push({ img: fileNmae, sort: 0, status: 3 });
      for (let i = 0; i < goodsDetail_img.length; i++) {
        if (goodsDetail_img[i].img == fileNmae) {
          goodsDetail_sort[goodsDetail_img[i].img] = i;
          goodsDetail_img[i].sotr = i;
        }
      }
      // if (goodsDetail_img.length >= 4) {
      //     goodsDetail_img_hidden = !goodsDetail_img_hidden;
      // }
      goods_picture.goodsDetail_img = goodsDetail_img;
      that.setData({
        // goodsDetail_img: goodsDetail_img,
        goodsDetail_sort: goodsDetail_sort,
        goods_picture: goods_picture
        // goodsDetail_img_hidden: goodsDetail_img_hidden
      });
    });

  },

  /**
   * 详情图片排序
   */
  detailSort: function (e) {
    let that = this;
    let goods_picture = that.data.goods_picture;
    let goodsDetail_img = goods_picture.goodsDetail_img;

    let goodsDetail_sort = that.data.goodsDetail_sort;
    let img = e.currentTarget.dataset.sort;
    let val = e.detail.value;

    // console.log(img)
    goodsDetail_sort[img] = e.detail.value;
    // console.log(goodsDetail_sort);
    for (let i = 0; i < goodsDetail_img.length; i++) {
      if (goodsDetail_img[i].img == img) {
        goodsDetail_img[i].sort = val;
      }
    }
    goods_picture.goodsDetail_img = goodsDetail_img;
    that.setData({
      goods_picture: goods_picture,
      goodsDetail_sort: goodsDetail_sort
    });
  },

  /**
   * 删除图片
   */
  cancleImg: function (e) {
    let that = this;
    let goods_picture = that.data.goods_picture;
    let status = e.currentTarget.dataset.status;
    let index = e.currentTarget.dataset.index;
    if (status == '1') {
      let list_img = goods_picture.list_img;
      list_img.splice(index, 1);
      goods_picture.list_img = list_img;
      that.setData({
        goods_picture: goods_picture,
        list_img_hidden: true
      });
    } else if (status == '2') {
      let swiper_img = goods_picture.swiper_img;
      swiper_img.splice(index, 1);
      goods_picture.swiper_img = swiper_img;
      that.setData({
        goods_picture: goods_picture,
        swiper_img_hidden: true
      });
    } else if (status == '3') {
      let goodsDetail_img = goods_picture.goodsDetail_img;
      goodsDetail_img.splice(index, 1);
      goods_picture.goodsDetail_img = goodsDetail_img
      that.setData({
        goods_picture: goods_picture,
        goodsDetail_img_hidden: true
      });
    }

  },
  /**
   * 获取表单提交的值
   */
  formSubmit: function (e) {
    // console.log(e.detail.value);
    let that = this;
    let goods_picture = that.data.goods_picture;
    let goods = e.detail.value;
    let list_img = goods_picture.list_img;
    let swiper_img = goods_picture.swiper_img;
    // let swiper_sort = that.data.swiper_sort;
    let goodsDetail_img = goods_picture.goodsDetail_img;
    // let goodsDetail_sort = that.data.goodsDetail_sort;
    let status = ''; // 存放图片的状态, 列表图1,轮播图2,详情图3
    let img = '';    // 存放图片
    let sort = '';   // 存放图片排序

    // 商品列表图
    let list_img_len = list_img.length;
    for (let i = 0; i < list_img_len; i++) {
      img += list_img[i].img + ',';
      status += list_img[i].status + ',';
      sort += list_img[i].sort + ',';
    }
    // // 商品轮播图
    let swiper_img_len = swiper_img.length;
    for (let i = 0; i < swiper_img_len; i++) {
      img += swiper_img[i].img + ',';
      status += swiper_img[i].status + ',';
      sort += swiper_img[i].sort + ',';
      // if (JSON.stringify(swiper_sort) != "{}") {
      //     for (let k in swiper_sort) {
      //         if (k == swiper_img[i]) {
      //             sort += swiper_sort[k] + ',';
      //         }
      //     }
      // } else {
      //     sort += i + ',';
      //     console.log(111)
      // }
    }
    // // 商品详情图
    let goodsDetail_img_len = goodsDetail_img.length;
    for (let i = 0; i < goodsDetail_img_len; i++) {
      img += goodsDetail_img[i].img + ',';
      status += goodsDetail_img[i].status + ',';
      sort += goodsDetail_img[i].sort + ',';
      // if (JSON.stringify(goodsDetail_sort) != "{}") {
      //     for (let m in goodsDetail_sort) {
      //         if (m == goodsDetail_img[i]) {
      //             sort += goodsDetail_sort[m] + ',';
      //         }
      //     }
      // } else {
      //     sort += i + ',';
      //     console.log(222)

      // }
    }
    goods.img = img;
    goods.status = status;
    goods.goodsId = that.data.goodsInfo.goodsId;
    goods.sort = sort;
    // goods.shopCode = app.globalData.shopCode;
    goods.color = that.data.goods_spec_value.color_spec_value.join(','); // 颜色规格
    goods.size = that.data.goods_spec_value.size_spec_value.join(','); // 尺码规格
    goods.type = that.data.goods_spec_value.type_spec_value.join(','); // 类型规格
    goods.volume = that.data.goods_spec_value.capacity_spec_value.join(','); // 容量规格
    goods.taste = that.data.goods_spec_value.taste_spec_value.join(','); // 容量规格
    console.log(goods);
    // 修改商品
    funData.updateGoods(goods, that, () => {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1000,
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myGoods/goodsList/goodsList'
        })
      }, 1500);

    });
  },
})