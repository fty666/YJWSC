// const config.host = "http://39.107.70.80:8080/";
// const config.host = 'http://192.168.3.116:8080/';
// const config.host = 'https://www.wx.tianjingcq.com/'
// const config.host = "http://192.168.3.244:8080/";
const config = require('./config.js');
module.exports = {
    upload_file_url: config.uploadFileUrl,
    host_api_url: config.host,
    // duoguan_user_token: "gh_e8a34929ec8f",
    // duoguan_share_info: '',
    // duoguan_config_version: 3975,

    // 商品列表分页
    page: 1,
    level: 2,
    pageSize: 6,
    isuse: 1,
    //用户ID
    user_id: 1,
    // 订单状态
    status: -1,
    // 是否选择
    is_true: false,
    // 查询分组
    getGroupUrl: config.host + 'MicroPlatform/group/getGroup',
    // 查询分类
    getShopUrl: config.host + 'MicroPlatform/shop/getShop',
    // 商品分类
    getClassUrl: config.host + 'MicroPlatform/group/getClass',
    // 商品列表
    getGoodsUrl: config.host + 'MicroPlatform/goods/getGoods',
    // 商品详情
    getGoodsDetailsUrl: config.host + 'MicroPlatform/goods/getGoodsDetails',
    // 商品详情
    getCommentUrl: config.host + 'MicroPlatform/comment/getComment',
    // 添加到购物车
    insertGoodsCartUrl: config.host + 'MicroPlatform/goodsCart/insertGoodsCart',
    // 查看购物车信息
    getGoodsCartUrl: config.host + 'MicroPlatform/goodsCart/getGoodsCart',
    // 修改购物车数量
    updateGoodsCartUrl: config.host + 'MicroPlatform/goodsCart/updateGoodsCart',
    // 查询用户订单
    getOrderUrl: config.host + 'MicroPlatform/order/getOrder',
    // 订单详情
    getOrderDetailUrl: config.host + 'MicroPlatform/order/getOrderDetail',
    // 收货地址
    getAddrUrl: config.host + 'MicroPlatform/address/getAddr',
    // 删除地址
    deleteAddrUrl: config.host + 'MicroPlatform/address/deleteAddr',
    // 添加地址
    addAddrUrl: config.host + 'MicroPlatform/address/addAddr',
    // 查询单个地址
    getAddrByIdUrl: config.host + 'MicroPlatform/address/getAddrById',
    // 修改个人地址
    updateAddrUrl: config.host + 'MicroPlatform/address/updateAddr',
    // 设置默认
    updateAddrDefaultUrl: config.host + 'MicroPlatform/address/updateAddrDefault',
    // 删除购物车信息
    deleteGoodsCartUrl: config.host + 'MicroPlatform/goodsCart/deleteGoodsCart',
    // 商品的模糊查询
    getGoodsByNameUrl: config.host + 'MicroPlatform/goods/getGoodsByName',
    // 查询默认收货地址
    getAddrByDefaultUrl: config.host + 'MicroPlatform/address/getAddrByDefault',
    // 添加收藏
    insterCollectUrl: config.host + 'MicroPlatform/user/insterCollect',
    // 查看收藏店铺
    getCollectUrl: config.host + 'MicroPlatform/user/getCollect',
    // 取消收藏
    delectCollectUrl: config.host + 'MicroPlatform/user/delectCollect',
    // 商家注册
    insertShopUrl: config.host + 'MicroPlatform/shop/insertShop',
    // 修改个人用户
    updateUserInfoUrl: config.host + 'MicroPlatform/user/updateUserInfo',
    // 查询用户
    getUserUrl: config.host + 'MicroPlatform/user/getUser',
    // 退货换货
    insertGoodBackUrl: config.host + 'MicroPlatform/goodsBack/insertGoodBack',
    // 商品评价
    insertCommentUrl: config.host + 'MicroPlatform/comment/insertComment',
    // 商品分组
    getGroupUrl: config.host + 'MicroPlatform/group/getGroup',
    // 店铺的信息
    getShopByCodeUrl: config.host + 'MicroPlatform/shop/getShopByCode',
    // 搜索店铺
    getShopByNameUrl: config.host + 'MicroPlatform/shop/getShopByName',
    // 添加订单
    insertOrderUrl: config.host + 'MicroPlatform/order/insertOrder',
    // 修改订单转态
    updateOrderStatusUrl: config.host + 'MicroPlatform/order/updateOrderStatus',
    // 删除订单
    deleteOrderUrl: config.host + 'MicroPlatform/order/deleteOrder',
    // 用户优惠券
    getUserCouponUrl: config.host + 'MicroPlatform/coupon/getUserCoupon',
    // 根据优惠劵id查询优惠券
    getUserCouponByIdUrl: config.host + 'MicroPlatform/coupon/getUserCouponById',
    // 外卖评论
    insertShopCommentUrl: config.host + 'MicroPlatform/comment/insertShopComment',
    // 获取外卖评论
    getShopCommentUrl: config.host + 'MicroPlatform/comment/getShopComment',
    // 查询外卖分类
    getFoodClassUrl: config.host + 'MicroPlatform/foodgoods/getFoodClass',
    // 查询外卖商品详情
    getFoodGoodsDetailsUrl: config.host + 'MicroPlatform/foodgoods/getFoodGoodsDetails',
    // 查看物流
    getTransInfoUrl: config.host + 'MicroPlatform/user/getTransInfo',
    // 修改外卖分类
    updateFoodsClassUrl: config.host + 'MicroPlatform/foodgoods/updateFoodsClass',
    // 添加外卖商品
    insertFoodGoodsUrl: config.host + 'MicroPlatform/foodgoods/insertFoodGoods',
    // 删除外卖分类
    deleteFoodsClassUrl: config.host + 'MicroPlatform/foodgoods/deleteFoodsClass',
    // 修改外卖商品
    updateFoodGoodsUrl: config.host + 'MicroPlatform/foodgoods/updateFoodGoods',
    // 后台商家修改收货地址
    updateOrderAddrUrl: config.host +  'MicroPlatform/order/updateOrderAddr',
    // 查询满减
    getReductionUrl: config.host + 'MicroPlatform/coupon/getReduction',
    // 添加满减
    insertReductionUrl: config.host + 'MicroPlatform/coupon/insertReduction',
    // 修改满减
    updateReductionUrl: config.host + 'MicroPlatform/coupon/updateReduction',
    // 删除满减
    deleteReductionUrl: config.host +  'MicroPlatform/coupon/deleteReduction',
    // 计算配送费
    shippingFeeUrl: config.host +  'MicroPlatform/order/shippingFee',
    // 微信支付
    wxPay: config.host + 'MicroPlatform/shop/wxPay',
    // 支付成功返回数据接口
    wxNotifyUrl: config.host +'redwine/shop/wxNotify',
    // 查询优惠券
    getCouponUrl: config.host +'MicroPlatform/coupon/getCoupon',
    // 修改店铺信息
    updateInfoByCodeUrl: config.host + 'MicroPlatform/shop/updateInfoByCode',
    //获取外卖商品
    getFoodsShopUrl: config.host + 'MicroPlatform/shop/getFoodsShop',
    // 上传图片
    UploadFiles: config.host + 'MicroPlatform/shop/UploadFiles',
}