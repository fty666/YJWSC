const app = getApp();
// const requestUtil = require('../../../utils/requestUtil');
const utilFunctions = require('../../../utils/functionData.js');
const funData = require('../../../utils/functionMethodData.js');
const URLData = require('../../../utils/data.js');
const util = require('../../../utils/util.js');

Page({
  data: {
    // 轮播图图片
    imgUrls: [
      "../../../images/2.jpg",
      "../../../images/3.jpg"
    ],
    cate_one_data: [],
    this_cate_id: "",
    glo_is_load: false,
    // 商品类别
    Sarray: [],
    // 商品列表
    goods: [],
    // 店铺ID
    shop_code: "",
    // 店铺信息
    shopinfo: "",
    // 分类ID
    listId: "",
    // 阿里
    upload_file_url: URLData.upload_file_url,
    //判断是否有该商品
    have: false,
    // 搜索框值
    place: '请输入搜索的商品',
    pageSize: 15,
    page: 1,
    px2rpxWidth: '',
    px2rpxHeight: '',
    gift: '',//满赠活动
  },

  /**
   *  商品详情跳转
   */
  mall_list_bind: function (e) {
    wx.navigateTo({
      url: '/pages/shop/malldetail/malldetail?goodsid=' + e.currentTarget.id + '&shopCode=' + this.data.shop_code
    })
  },

  /**
   *  初始化页面，获取商品分类
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({ gid: options.groupid });
    this.setData({ this_cate_id: options.groupid, shop_code: options.shop_code });
    var that = this;
    function Slist(data) {
      console.log(data)
      that.setData({
        sarray: data,
      });
    }
    utilFunctions.getClassUrl(that.data.gid, Slist, this);
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

    //店铺信息
    function shops(res) {
      console.log(res)
      that.setData({
        shopinfo: res
      })
    }
    utilFunctions.getShopByCode(that.data.shop_code, shops, this)
  },

  /**
   *搜索商品 
   */
  inputBlur: function (e) {
    // console.log(e)
    let that = this
    let arrayVal = [];
    arrayVal.push(e.detail.value);
    function gets(res) {
      console.log(res)
      that.setData({
        goods: res,
        have: util.isEmpty(res),
      })
    }
    utilFunctions.getGoodsByName(arrayVal, that.data.shop_code, gets, this)

  },

  /**
   * 数据加载
  */
  onReady: function () {
    // 设置默认
    let that = this
    setTimeout(
      function () {
        function codelist(res) {
          console.log(res)
          that.setData({
            goods: res.PageInfo.list,
          })
        }
        utilFunctions.getGoodsUrl(that.data.shop_code, that.data.listId, that.data.page, that.data.pageSize, codelist, this)
      }, 100)
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

  // 全部列表
  erery: function () {
    let listId = ""
    let that = this
    function codelist(res) {
      //   console.log(res)
      that.setData({
        goods: res.PageInfo.list,
        listId: "",
        have: false
      })
    }
    // utilFunctions.getGoodsUrl(that.data.shop_code, listId, codelist, this)
    utilFunctions.getGoodsUrl(that.data.shop_code, that.data.listId, that.data.page, that.data.pageSize, codelist, this)
  },
  /**
   *  商品分类列表，获取商品列表
   */
  cate_item_bind: function (e) {
    let that = this;
    // funData.getShopCode(app.globalData.user_id, that, (data) => {
    //     // console.log(data);
    //     app.globalData.shopCode = data.shop_code;
    //     let cids = e.currentTarget.dataset.cid
    //     // console.log(cids)
    //     // console.log(that.data.listId)
    // });
    let cids = e.currentTarget.dataset.cid;
    console.log(that.data.shop_code)
    function codelist(res) {
      //   console.log(res)
      that.setData({
        goods: res.PageInfo.list,
        listId: cids,
        have: false
      })
    }
    // utilFunctions.getGoodsUrl(that.data.shop_code, cids, codelist, this);
    utilFunctions.getGoodsUrl(that.data.shop_code, that.data.listId, that.data.page, that.data.pageSize, codelist, this)
  },

  /**
* 滚动到底部/右边，会触发 scrolltolower 事件
*/
  scrollToLower: function () {
    let that = this;
    let pageSize = that.data.pageSize;
    let page = that.data.page;
    let gid = that.data.groupids;
    pageSize += 20;
    function codelist(res) {
      //   console.log(res)
      that.setData({
        goods: res.PageInfo.list,
      })
    }
    utilFunctions.getGoodsUrl(that.data.shop_code, that.data.listId, page, pageSize, codelist, this)
  },
})