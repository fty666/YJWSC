//初始化数据
function tabbarinit(flag) {
  // vipLevel 1用户  2经销商
  if (flag == 1) {
    return [
      {
        "pagePath": "/pages/shop/mall/mall",
        "text": "商城",
        "iconPath": "/images/tabbar/shop.png",
        "selectedIconPath": "/images/tabbar/shop_in.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      },
      {
        "pagePath": "/pages/shop/seller/seller",
        "text": "分类",
        "iconPath": "/images/tabbar/shop_cate.png",
        "selectedIconPath": "/images/tabbar/shop_cate_in.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      },
      {
        "pagePath": "/pages/shop/bcart/index",
        "text": "购物车",
        "iconPath": "/images/tabbar/shop_cart.png",
        "selectedIconPath": "/images/tabbar/shop_cart_in.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      },
      {
        "pagePath": "/pages/user/index/index",
        "text": "我的",
        "iconPath": "/images/tabbar/user.png",
        "selectedIconPath": "/images/tabbar/user_in.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      },
      {
        "pagePath": "/pages/user/openshop/openshop",
        "text": "申请开店",
        "iconPath": "/images/tabbar/set-up-shop1.png",
        "selectedIconPath": "/images/tabbar/set-up-shop2.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      }
    ]
  } else if (flag == 2) {
    return [
      {
        "pagePath": "/pages/myGoods/goodsList/goodsList",
        "text": "我的商品",
        "iconPath": "/images/tabbar/sellgoods.png",
        "selectedIconPath": "/images/tabbar/sellgoods_r.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      },
      {
        "pagePath": "/pages/orderManage/orderManage",
        "text": "订单管理",
        "iconPath": "/images/tabbar/order.png",
        "selectedIconPath": "/images/tabbar/order_r.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      },
      {
        "pagePath": "/pages/moneyManage/moneyManage",
        "text": "财务管理",
        "iconPath": "/images/tabbar/money.png",
        "selectedIconPath": "/images/tabbar/money_r.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      },
      {
        "pagePath": "/pages/myself/myself",
        "text": "我的店铺",
        "iconPath": "/images/tabbar/people.png",
        "selectedIconPath": "/images/tabbar/people_r.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      }
    ]
  } else if (flag == 3) {
    return [
      {
        "pagePath": "/pages/shop/mall/mall",
        "text": "商城",
        "iconPath": "/images/tabbar/shop.png",
        "selectedIconPath": "/images/tabbar/shop_in.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      },
      {
        "pagePath": "/pages/shop/seller/seller",
        "text": "分类",
        "iconPath": "/images/tabbar/shop_cate.png",
        "selectedIconPath": "/images/tabbar/shop_cate_in.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      },
      {
        "pagePath": "/pages/shop/bcart/index",
        "text": "购物车",
        "iconPath": "/images/tabbar/shop_cart.png",
        "selectedIconPath": "/images/tabbar/shop_cart_in.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      },
      {
        "pagePath": "/pages/user/index/index",
        "text": "我的",
        "iconPath": "/images/tabbar/user.png",
        "selectedIconPath": "/images/tabbar/user_in.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      },
      {
        "pagePath": "/pages/myself/myself",
        "text": "我的店铺",
        "iconPath": "/images/tabbar/set-up-shop1.png",
        "selectedIconPath": "/images/tabbar/set-up-shop2.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      },
    ]

  } else if (flag == 4) {
    return [
      {
        "pagePath": "/pages/takeout/index/index",
        "text": "首页",
        "iconPath": "/images/tabbar/home_icon.png",
        "selectedIconPath": "/images/tabbar/select_home.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      },
      {
        "pagePath": "/pages/takeout/order/order",
        "text": "订单",
        "iconPath": "/images/tabbar/order_icon.png",
        "selectedIconPath": "/images/tabbar/order_iconSelect.png",
        "iconColor": "#8A8A8A",
        "selectIconColor": 'red',
      },
      // {
      //     "pagePath": "/pages/takeout/userInfo/userInfo",
      //     "text": "我的",
      //     "iconPath": "/images/tabbar/people.png",
      //     "selectedIconPath": "/images/tabbar/people_select.png",
      //     "iconColor": "#8A8A8A",
      //     "selectIconColor": 'red',
      // },
    ]
  }

}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target, flag) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit(flag);
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']; //换当前的icon图标
  otabbar[id]['iconColor'] = otabbar[id]['selectIconColor']; //换当前的icon颜色
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar;
  that.setData({ bindData });
}

module.exports = {
  tabbar: tabbarmain
}