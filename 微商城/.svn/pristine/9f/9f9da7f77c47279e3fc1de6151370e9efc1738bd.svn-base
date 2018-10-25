const app = getApp();
const URLData = require('../../../utils/data');
Page({
    data: {
        goods_data: null,
        this_cate_id:0,
        this_keywords:'',
        this_page_size:1,
        this_page_num:10,
        glo_is_load: false,
        list_type:true,
        select_type:'',
        select_jiage_type:'',
        is_select_jiage:false,
        is_select_xiaoliang:false,
        is_loadmore: true,
        scrollTop: 0,
        floorstatus:false,
        upload_file_url: URLData.upload_file_url
    },
    goTop: function (e) {
        this.setData({
            scrollTop: 0
        })
    },
    pay_scroll: function (e, res) {
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
    /*
    ** 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        var that = this;
        var this_cate_id = options.cid;
        var this_keywords = options.keywords;
        that.setData({ this_cate_id: this_cate_id, this_keywords: this_keywords});
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow:function(){
        var that = this;
        var requestData = {};
        requestData.cid = that.data.this_cate_id;
        requestData.pagesize = 1;
        requestData.pagenum = that.data.this_page_num;
        requestData.keywords = that.data.this_keywords;
        requestData.stype = that.data.select_type;
        requestData.stype_jiage = that.data.select_jiage_type;
        // requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getGoodsList', { searchData: requestData }, (info) => {
        //     if (info == null) {
        //         that.setData({ is_loadmore: false });
        //     } else {
        //         if (info.length < 10) {
        //             that.setData({ is_loadmore: false });
        //         }
        //     }
        //     that.setData({ goods_data: info, glo_is_load: false });
        // }, this, { isShowLoading: false });
    },
    
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function (e) {
        var that = this;
        wx.showNavigationBarLoading();
        if (that.data.is_loadmore == false) {
            wx.hideNavigationBarLoading();
            return false;
        }
        var this_cate_id = that.data.this_cate_id;
        var searchData = {};
        searchData.cid = this_cate_id;
        searchData.ppid = 0;
        searchData.keywords = that.data.this_keywords;
        searchData.stype = that.data.select_type;
        searchData.stype_jiage = that.data.select_jiage_type;
        searchData.pagesize = that.data.this_page_size + 1;
        searchData.pagenum = that.data.this_page_num;
        // requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanShop/Api/getGoodsList', { searchData: searchData }, (info) => {
        //     wx.hideNavigationBarLoading();
        //     if (info == null) {
        //         that.setData({ is_loadmore: false });
        //     } else {
        //         if (info.length < 10) {
        //             that.setData({ is_loadmore: false });
        //         }
        //         that.setData({ goods_data: that.data.goods_data.concat(info), this_page_size: searchData.pagesize+1, glo_is_load: false });
        //     }
        
        // }, this, { isShowLoading: false });
    },
    select_goods_list:function(e){
        var that = this;
        var s_type = e.currentTarget.dataset.stype;
        that.setData({ select_jiage_type: '' });
        if(s_type == 'jiage'){
            if (that.data.is_select_jiage == true){
                that.setData({ select_jiage_type: 'jiage_sheng', is_select_jiage:false});
            }else{
                that.setData({ select_jiage_type: 'jiage_jiang', is_select_jiage:true});
            }
        } else if (s_type == 'xiaoliang'){
            if (that.data.is_select_xiaoliang == true) {
                that.setData({ select_jiage_type: 'jiage_sheng', is_select_xiaoliang: false });
            } else {
                that.setData({ select_jiage_type: 'jiage_jiang', is_select_xiaoliang: true });
            }
        }
        that.setData({ select_type: s_type, this_page_size: 1, is_loadmore:true});
        that.onShow();
    },
    toggle_list_type_bind:function(){
        var that = this;
        that.setData({ list_type: that.data.list_type==true?false:true});
    },
    detail: function (e) {
        wx.navigateTo({
            url: '../malldetail/malldetail?sid=' + e.currentTarget.id
        })
    },
})