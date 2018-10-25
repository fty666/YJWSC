var util = require('../../../utils/util.js');
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
var app = getApp();
Page({
    data: {
        address: {},
        region: ['广东省', '广州市', '海珠区'],
        area_path: "",
        city: "",
        addressId: 0,
        addId: "",
        addinfo: "",
        px2rpxWidth: '',
        px2rpxHeight: '',
    },
    bindinputMobile(event) {
        let address = this.data.address;
        address.addr_mobile = event.detail.value;
        this.setData({
            address: address
        });
    },

    // 收货人
    bindinputName(event) {
        let address = this.data.address;
        address.addr_receiver = event.detail.value;
        this.setData({
            address: address
        });
    },

    // 收货电话
    bindinputAddress(event) {
        let tel = event.detail.value;

        let address = this.data.address;
        address.addr_mobile = tel;
        this.setData({
            address: address
        });
    },

    // 省市
    bindinputCity(event) {
        let address = this.data.address;
        address.area_path = event.detail.value;
        this.setData({
            address: address
        });
    },

    // 详细地址
    bindinputInfo(event) {
        let address = this.data.address;
        address.area_detail = event.detail.value;
        this.setData({
            address: address
        });
    },

    // 是否为默认
    bindIsDefault() {
        let address = this.data.address;
        address.is_default = address.is_default ? 1 : 0;
        this.setData({
            address: address
        });
    },

    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        console.log(options)
        let that = this
        that.setData({
            addId: options.addr_id
        })
        let path = that.data.address.area_path
        let receiver = that.data.address.addr_receiver
        let phones = that.data.address.addr_mobile
        let detail = that.data.address.area_detail
        function addinfo(res) {
            console.log(res)
            // 传递过来的
            let paths = res.area_path
            let receivers = res.addr_receiver
            let mobiel = res.addr_mobile
            let details = res.area_detail

            that.setData({
                addinfo: res,
                city: res.area_path,
                addressId: res.id,
                path: paths,
                receiver: receivers,
                phones: mobiel,
                detail: details,
                address: res
            })
        }
        utilFunctions.getAddrById(addinfo, that.data.addId, this)

    },

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
    selectRegionType(event) {
        let that = this;
        let regionTypeIndex = event.target.dataset.regionTypeIndex;
        let selectRegionList = that.data.selectRegionList;

        //判断是否可点击
        if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex - 1].id <= 0)) {
            return false;
        }

        this.setData({
            regionType: regionTypeIndex + 1
        })

        let selectRegionItem = selectRegionList[regionTypeIndex];

        this.getRegionList(selectRegionItem.parent_id);

        this.setRegionDoneStatus();

    },
    selectRegion(event) {
        let that = this;
        let regionIndex = event.target.dataset.regionIndex;
        let regionItem = this.data.regionList[regionIndex];
        let regionType = regionItem.type;
        let selectRegionList = this.data.selectRegionList;
        selectRegionList[regionType - 1] = regionItem;


        if (regionType != 3) {
            this.setData({
                selectRegionList: selectRegionList,
                regionType: regionType + 1
            })
            this.getRegionList(regionItem.id);
        } else {
            this.setData({
                selectRegionList: selectRegionList
            })
        }

        //重置下级区域为空
        selectRegionList.map((item, index) => {
            if (index > regionType - 1) {
                item.id = 0;
                item.name = index == 1 ? '城市' : '区县';
                item.parent_id = 0;
            }
            return item;
        });

        this.setData({
            selectRegionList: selectRegionList
        })


        that.setData({
            regionList: that.data.regionList.map(item => {

                //标记已选择的
                if (that.data.regionType == item.type && that.data.selectRegionList[that.data.regionType - 1].id == item.id) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }

                return item;
            })
        });

        this.setRegionDoneStatus();

    },
    doneSelectRegion() {
        if (this.data.selectRegionDone === false) {
            return false;
        }

        let address = this.data.address;
        let selectRegionList = this.data.selectRegionList;
        address.province_id = selectRegionList[0].id;
        address.city_id = selectRegionList[1].id;
        address.district_id = selectRegionList[2].id;
        address.province_name = selectRegionList[0].name;
        address.city_name = selectRegionList[1].name;
        address.district_name = selectRegionList[2].name;
        address.full_region = selectRegionList.map(item => {
            return item.name;
        }).join('');

        this.setData({
            address: address,
            openSelectRegion: false
        });

    },
    cancelSelectRegion() {
        this.setData({
            openSelectRegion: false,
            regionType: this.data.regionDoneStatus ? 3 : 1
        });

    },

    //取消修改 
    cancelAddress() {
        wx.navigateTo({
            url: '/pages/user/address/address',
        })
    },

    /**
     *保存地址 
     */
    saveAddress() {
        let that = this
        if (!util.checkReg(1, that.data.address.addr_mobile)) {
            wx.showToast({
                icon: 'none',
                title: '手机号不正确'
            });
            return;
        }

        if (that.data.address.addr_receiver == "") {
            wx.showToast({
                icon: 'none',
                title: '姓名不能为空'
            });
            return;
        }

        if (that.data.address.area_detail == "") {
            wx.showToast({
                icon: 'none',
                title: '详细地址不能为空'
            });
            return;
        }

        if (that.data.address.area_path == "") {
            wx.showToast({
                icon: 'none',
                title: '地址不能为空'
            });
            return;
        }

        // console.log(this.data.address)

        function updata(res) {
        }
        utilFunctions.updateAddr(updata, that.data.address, that.data.addressId, this)
        // wx.navigateTo({
        //     url: '/pages/user/address/address'
        // })
        wx.redirectTo({
            url: '/pages/user/index/index',
        })
        wx.showToast({
            icon: 'success',
            title: '修改成功'
        });

    },

    formSubmit(e) {
        console.log(e)
    },

    /**
     * 省市级事件
     */
    bindRegionChange: function (e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        let address = this.data.address;
        address.area_path = e.detail.value;
        this.setData({
            city: e.detail.value,
            address: address
        })
    },

    onShow: function () {
        // 页面显示

    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭

    }
})