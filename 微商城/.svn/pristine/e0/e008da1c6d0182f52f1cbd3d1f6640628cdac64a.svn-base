const $ = require('underscore');
const _data = require('data');
const app = getApp();

//登录失效接口
const LOGIN_INVALID_LISTENER = [];
const REQUEST_ID = {};

module.exports = {
    //获取公共请求配置
    getRequestOptions: function (options, page) {
        const that = this;
        options = $.extend({
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                try {
                    res = res.data;
                    const code = res.code === undefined ? res.status : res.code;
                    options.isLoginInvalid = false;
                    if (code == 1) {
                        var data = null;
                        if (res.info !== undefined) data = res.info;
                        if (res.data !== undefined) data = res.data;
                        options.callback.apply(page, [data, res]);
                    } else if (code == 2) {//登录失效或未登录
                        options.isLoginInvalid = true;
                        
                        options.loginInvalidCount = options.loginInvalidCount + 1 || 1;
                        if (options.loginInvalidCount > 3) {
                            wx.showModal({ content: '请稍后重试~', showCancel: false });
                            return;
                        }

                        that._fireLoginInvalidListener();
                        if (!options.onLoginInvalid || options.onLoginInvalid() !== false) {//返回true，将不进行默认处理
                            var newToken = null;
                            wx.showToast({
                                title: '登陆中',
                                icon: 'loading',
                                duration: 10000,
                                success: function () {
                                    app.getNewToken(function (token) {
                                        options.data.utoken = newToken = token;
                                        wx.request(options);//再次请求数据
                                    })
                                }
                            })
                            setTimeout(function () {
                                if (newToken == null) {
                                    delete REQUEST_ID[options.requestId];
                                    options.completeAfter && options.completeAfter.apply(page,
                                        [{ statusCode: 0, errMsg: "请求超时", data: null }]);
                                }
                            }, 10000);
                        }
                    } else {
                        var msg = "fail";
                        if (res.msg !== undefined) msg = res.msg;
                        if (res.errMsg !== undefined) msg = res.errMsg;
                        if (res.code !== undefined && res.info !== undefined) msg = res.info;
                        wx.showModal({
                            content: msg,
                            showCancel: false
                        });
                    }
                } catch (err) {
                    console.error(err.stack);
                }
            },
            fail: function (res) {
                console.error(res);
                options.isLoginInvalid = false;
                // wx.showModal({
                //     content: "网络请求失败:" + res.errMsg,
                //     showCancel: false
                // });
                options.failAfter && options.failAfter.apply(page, [res]);
                console.error(res, options.url);
            },
            complete: function (res) {
                if (options.isLoginInvalid) {
                } else {
                    setTimeout(function () {
                        if (options.isShowLoading)
                            wx.hideToast();
                        delete REQUEST_ID[options.requestId];
                    }, options.delay);
                    options.completeAfter && options.completeAfter.apply(page, [res]);
                }
            }
        }, options);

        //必须配置
        options.isShowLoading = options.isShowLoading !== false;
        options.loadingText = options.loadingText || "请稍后...";
        options.delay = options.delay || 500;
        options.data = options.data || {};
        options.data.utoken = wx.getStorageSync("utoken");
        options.data.token = _data.duoguan_user_token;
        options.requestId = $.uniqueId("RQ");//生成全局唯一ID "RQ" + new Date().getTime();
        REQUEST_ID[options.requestId] = 1;
        return options;
    },
    /**
     * get 请求数据
     */
    get: function (url, data, callback, page, extend) {
        extend = extend || {};
        const options = this.getRequestOptions($.extend({ url: url, data: data, callback: callback }, extend), page);
        if (options.isShowLoading)
            wx.showToast({ icon: "loading", title: options.loadingText, duration: 10000 })
        wx.request(options);
        return options.requestId;
    },
	/**
     * post 请求数据
     */
    post: function (url, data, callback, page, extend) {
        extend = extend || {};
        const options = this.getRequestOptions($.extend({ url: url, data: data, callback: callback, method: "POST" }, extend), page);
        if (options.isShowLoading)
            wx.showToast({ icon: "loading", title: options.loadingText, duration: 10000 })
        wx.request(options);
        return options.requestId;
    },
    /**
     * 上传文件
     */
    upload: function (url, filepath, name, data, callback, page, extend) {
        extend = extend || {};
        wx.showToast({ title: '上传中...', icon: 'loading', duration: 10000 });
        const options = $.extend({
            url: url, filePath: filepath, name: name, formData: data,
            success: function (res) {
                res = JSON.parse(res.data);
                options.isLoginInvalid = false;
                if (res.code == 1) {
                    callback.apply(page, [res.data, res]);
                } else if (res.code == 2) {
                    options.isLoginInvalid = true;
                    var newToken = null;
                    wx.showToast({
                        title: '登陆中',
                        icon: 'loading',
                        duration: 10000,
                        success: function () {
                            app.getNewToken(function (token) {
                                wx.hideToast();
                                wx.uploadFile(options);
                            })
                        }
                    })
                    setTimeout(function () {
                        if (newToken == null) {
                            delete REQUEST_ID[options.requestId];
                            options.completeAfter && options.completeAfter.apply(page,
                                [{ statusCode: 0, errMsg: "请求超时", data: null }]);
                        }
                    }, 10000);
                } else {
                    wx.showModal({ content: res.info, showCancel: false });
                }
            },
            fail: function (res) {
                console.error(res);
                wx.showModal({ content: res.errMsg, showCancel: false });
            },
            complete: function (res) {
                if (options.isLoginInvalid) {
                } else {
                    wx.hideToast();
                    setTimeout(function () { delete REQUEST_ID[options.requestId]; }, options.delay);
                    options.completeAfter && options.completeAfter.apply(page, [res]);
                }
            }
        }, extend);
        options.delay = options.delay || 1000;
        options.formData = options.formData || {};
        options.formData.utoken = wx.getStorageSync("utoken");
        options.formData.token = _data.duoguan_user_token;
        console.log(options);
        options.requestId = $.uniqueId("RQ");//生成全局唯一ID "RQ" + new Date().getTime();
        REQUEST_ID[options.requestId] = 1;
        wx.uploadFile(options);
        return options.requestId;
    },
    /**
     * 根据requestId检查是否正在请求
     */
    isLoading: function (requestId) {
        if (!requestId) return false;
        return REQUEST_ID[requestId] !== undefined;
    },
    /**
     * 添加一个登录失效回调接口
     */
    addLoginInvalidListener: function (listener, isInsert) {
        isInsert = isInsert === undefined ? false : isInsert;
        if (isInsert)
            LOGIN_INVALID_LISTENER.unshift(listener);
        else
            LOGIN_INVALID_LISTENER.push(listener);
    },
    /**
     * 移除一个登录失效回调接口
     */
    removeLoginInvalidListener: function (listener) {
        var index = $.indexOf(LOGIN_INVALID_LISTENER, listener);
        if (index >= 0) LOGIN_INVALID_LISTENER.splice(index, 1);
    },
    /**
     * 触发登录失效或未登录接口
     */
    _fireLoginInvalidListener: function () {
        for (var x in LOGIN_INVALID_LISTENER)
            LOGIN_INVALID_LISTENER[x].apply(this);
    }
}