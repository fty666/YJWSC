var util = require('../../../utils/util.js');
const app = getApp()
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');

Page({
  data: {
    typeId: 0,
    pages:1,
    pagesize:8,
    collectList: [],
    upload_file_url: URLData.upload_file_url

  },
  onLoad: function (options) {
     this.requests()
  },

  /**
   *  请求事件
   */
  requests(){
    let that= this
    function collects(res){
    console.log(res.PageInfo.list)
      that.setData({
      collectList: res.PageInfo.list
    })
  }
    utilFunctions.getCollect(that.data.pages, that.data.pagesize, collects, this)
  },

  onReady: function () {

  },
  onShow: function () {

  },
  
  /**
   *取消收藏 
   */ 
  remove:function(e){
    console.log(e)
    let that=this
    let shopcode = e.currentTarget.dataset.shopcode
    function remov(res){
      that.requests()
      wx.showToast({
        title: '已取消',
        icon: 'success',
        duration: 1200
      })
    }
    utilFunctions.delectCollect(shopcode,remov,this)

  },

  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  openGoods(event) {
    
    let that = this;
    let goodsId = this.data.collectList[event.currentTarget.dataset.index].value_id;

    //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touch_end - that.data.touch_start;
    console.log(touchTime);
    //如果按下时间大于350为长按  
    if (touchTime > 350) {
      wx.showModal({
        title: '',
        content: '确定删除吗？',
        success: function (res) {
          if (res.confirm) {
            
            util.request(api.CollectAddOrDelete, { typeId: that.data.typeId, valueId: goodsId}, 'POST').then(function (res) {
              if (res.errno === 0) {
                console.log(res.data);
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                that.getCollectList();
              }
            });
          }
        }
      })
    } else {
      
      wx.navigateTo({
        url: '/pages/goods/goods?id=' + goodsId,
      });
    }  
  },
  //按下事件开始  
  touchStart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-start')
  },
  //按下事件结束  
  touchEnd: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-end')
  }, 
})