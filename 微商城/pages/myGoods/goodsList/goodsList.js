const app = getApp();
const urlData = require('../../../utils/urlData.js');
const funData = require('../../../utils/functionMethodData.js');
const template = require('../../../template/template.js');
let page = 1;
let pageSize = 20;
// 0未上架(审核中) 1上架 2拒绝上架(审核未通过) 3禁用(强制下架) 4下架 5删除
Page({
  data: {
    level: '',
    goods_data: null,
    isUse: 1,
    notUse: 0,
    glo_is_load: true,
    select_type: 'shangjia',
    sheng_jiang: 0,
    is_select_haoping: false,
    is_select_xiaoliang: false,
    status: {
      quanbu: -1,
      shenhe: 0,
      shangjia: 0,
      jujueshangjia: 2,
      qiangzhixiajia: 3,
      xiajia: 4,
      shanchu: 5
    },
    is_loadmore: true,
    scrollTop: 0,
    floorstatus: false,
    aliyunUrl: urlData.uploadFileUrl,
    shopCode: '',
    groupId: '',
    px2rpxWidth: '',
    px2rpxHeight: '',
  },
  /**
   * 返回顶部
   */
  goTop: function(e) {
    this.setData({
      scrollTop: 0
    })
  },
  pay_scroll: function(e, res) {
    if (e.detail.scrollTop > 50) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  onLoad: function(options) {
    if (options.selectype) {
      this.setData({
        select_type: 'shenhe'
      })
    }
    // 加载页面tarBar模块
    template.tabbar("tabBar", 0, this, 2);
    let that = this;
  },


  onReady: function() {
    var isUse = 1;
    if (this.data.select_type == 'shenhe') {
      isUse = 0;
      this.setData({
        isUse: 0
      })
    }
    let that = this;
    // 查询商品列表
    funData.getShopByCode(app.globalData.user_id, that, (res) => {
      funData.getGoods(res.shop.shop_code, page, pageSize, isUse, that, (data) => {
        let goods_info = data.PageInfo.list;
        let len = goods_info.length;
        let perfectRate = '';
        for (let i = 0; i < len; i++) {
          if (~~goods_info[i].comment_num == 0) {
            perfectRate = '0%';
          } else {
            perfectRate = (~~goods_info[i].perfect / ~~goods_info[i].comment_num) * 100 + '%';
            if (!perfectRate) {
              perfectRate = '0%';
            }
          }
          goods_info[i].perfectRate = perfectRate;
        }
        that.setData({
          level: app.globalData.level,
          goods_data: goods_info,
          glo_is_load: false,
          shopCode: res.shop.shop_code,
          groupId: res.shop.groupId
        });
      });
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

  onShow: function() {
    let that = this;
    if (app.globalData.user_id) {
      return;
    }
    funData.getUser(app.globalData.user_id, that, (data) => {
      that.setData({
        level: data.level
      });
    });
  },

  /**
   * 条件查询
   */
  select_goods_list: function(e) {
    let that = this;
    let s_type = e.currentTarget.dataset.stype;
    that.setData({
      sheng_jiang: ''
    });
    let data = {
      shopCode: that.data.shopCode,
      page: page,
      pageSize: 20,
      isUse: 1,
    };
    // 升2,降1
    switch (s_type) {
      case 'quanbu':
        data.isUse = -1; //全部-1
        break;
      case 'shenhe':
        data.isUse = 0; //未上架,审核中0
        break;
        break;
      case 'jujue':
        data.isUse = 2; //拒绝上架2(上架未通过)
        break;
      case 'qiangzhixiajia':
        data.isUse = 3; //禁止上架,强制下架3
        break;
      case 'xiajia':
        data.isUse = 4; //下架4
        break;
      case 'xiaoliang':
        // 销量排序
        if (that.data.is_select_xiaoliang == true) {
          that.setData({
            sheng_jiang: 1,
            is_select_xiaoliang: false
          });
        } else {
          that.setData({
            sheng_jiang: 2,
            is_select_xiaoliang: true
          });
        }
        data.salesNum = that.data.sheng_jiang;
        data.isUse = that.data.isUse;
        data.pageSize = pageSize;
        break;
      case 'haoping':
        // 好评排序
        if (that.data.is_select_haoping == true) {
          that.setData({
            sheng_jiang: 1,
            is_select_haoping: false
          });
        } else {
          that.setData({
            sheng_jiang: 2,
            is_select_haoping: true
          });
        }
        data.commentNum = that.data.sheng_jiang;
        data.isUse = that.data.isUse;
        data.pageSize = pageSize;
        break;
    }
    that.setData({
      select_type: s_type,
      this_page_size: 1,
      isUse: data.isUse,
      is_loadmore: true,
    });
    that.selectFun(data);
  },

  /**
   * 条件查询方法
   */
  selectFun: function(mydata) {
    let that = this;
    // 条件查询商品列表
    funData.requestUrl(mydata, urlData.getGoodsUrl, that, (data) => {
      let goods_info = data.PageInfo.list;
      let len = goods_info.length;
      let perfectRate = '';
      for (let i = 0; i < len; i++) {
        if (~~goods_info[i].comment_num == 0) {
          perfectRate = '0%';
        } else {
          perfectRate = (~~goods_info[i].perfect / ~~goods_info[i].comment_num) * 100 + '%';
          if (!perfectRate) {
            perfectRate = '0%';
          }
        }
        goods_info[i].perfectRate = perfectRate;
      }
      that.setData({
        goods_data: goods_info,
        glo_is_load: false,
        // floorstatus:true
      });
    });
  },

  /**
   * 查看分类
   */
  showClass: function() {
    wx.navigateTo({
      url: '/pages/myGoods/shopClass/shopClass',
    })
  },

  /**
   * 添加商品
   */
  addGoods: function() {
    let that = this;
    if (that.data.groupId == 1) {
      wx.navigateTo({
        url: '/pages/myGoods/takeOutGoods/takeOutGoods?scode=' + that.data.shopCode
      });
    } else {
      wx.navigateTo({
        url: '/pages/myGoods/addGoods/addGoods?scode=' + that.data.shopCode
      });
    }
  },

  /**
   * 添加优惠券
   */
  addCoupon: function() {
    let that = this;
    if (that.data.level != 3) {
      wx.showToast({
        title: '请完善信息',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/coupon/addCoupon/addCoupon'
    });
  },

  /**
   * 删除商品 isUse=5
   */
  deleteGoods: function(e) {
    let that = this;
    wx.showModal({
      title: '删除商品',
      content: '确定删除此件商品吗',
      success: function(res) {
        if (res.confirm) {
          let goodsId = e.currentTarget.dataset.goodsid;
          funData.deleteGoods(goodsId, that.data.status.shanchu, that, () => {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            })
          });
        } else if (res.cancel) {

        }
      }
    })
  },

  /**
   * 修改商品
   */
  editGoods: function(e) {
    let goodsId = e.currentTarget.dataset.goodsid;
    // console.log(goodsId);
    if (this.data.groupId == 1) {
      wx.navigateTo({
        url: '/pages/myGoods/takeOutEdit/takeOutEdit?goodsId=' + goodsId
      });
    } else {
      wx.navigateTo({
        url: '/pages/myGoods/editGoods/editGoods?goodsId=' + goodsId
      })
    }
  },

  /**
   * 下架商品
   */
  notUseGoods: function(e) {
    let that = this;
    wx.showModal({
      title: '下架商品',
      content: '确定下架此件商品吗',
      success: function(res) {
        if (res.confirm) {
          let goodsId = e.currentTarget.dataset.goodsid;
          // 下架商品
          funData.deleteGoods(goodsId, that.data.status.xiajia, that, () => {
            wx.showToast({
              title: '下架成功',
              icon: 'success',
              duration: 1000,
              success: function() {
                let index = e.currentTarget.dataset.index;
                that.changeGoods_data(index, that);
              }
            });
          });
        } else if (res.cancel) {

        }
      }
    })
  },

  /**
   * 上架商品
   */
  isUseGoods: function(e) {
    let that = this;
    wx.showModal({
      title: '上架商品',
      content: '确定上架此件商品吗',
      success: function(res) {
        if (res.confirm) {
          let goodsId = e.currentTarget.dataset.goodsid;
          // 上架商品
          funData.deleteGoods(goodsId, that.data.status.shangjia, that, () => {
            wx.showToast({
              title: '上架成功',
              icon: 'success',
              duration: 1000,
              success: function() {
                let index = e.currentTarget.dataset.index;
                that.changeGoods_data(index, that);
              }
            });
          });
        } else if (res.cancel) {

        }
      }
    })
  },

  /**
   * 提交审核
   */
  auditing: function(e) {
    let that = this;
    let goodsId = e.currentTarget.dataset.goodsid;
    funData.deleteGoods(goodsId, that.data.status.shenhe, that, () => {
      wx.showToast({
        title: '提交审核成功',
        icon: 'success',
        duration: 1000,
        success: function() {
          let index = e.currentTarget.dataset.index;
          that.changeGoods_data(index, that);
        }
      });
    });
  },

  // 动态删除商品数量
  changeGoods_data: function(index, that) {
    let goods_data = that.data.goods_data;
    let len = goods_data.length;
    goods_data.splice(index, 1);
    that.setData({
      goods_data: goods_data
    });
  },

  /**
   * 滚动到底部/右边，会触发 scrolltolower 事件
   */
  scrollToLower: function() {
    let that = this;
    pageSize += 20;
    let searchData = {
      shopCode: that.data.shopCode,
      pageSize: pageSize,
      page: page,
      isUse: that.data.isUse,
    };
    that.selectFun(searchData)
    that.setData({
      floorstatus: true
    });

  },
})