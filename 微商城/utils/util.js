// import _Promise from 'bluebird';
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 返回任意时间的时间戳
 */
function timeStamp(flag, mytimer) {
  // mytimer = '2015/06/23 08:00:20'
  if (flag == 1) {
    // 秒数
    mytime = String(Date.parse(new Date())).slice(0, -3);
  } else if (flag == 2) {
    // 毫秒数
    mytime = (new Date()).getTime();
  } else if (flag == 3) {
    // 任意时间时间戳 毫秒数
    mytime = (new Date(mytimer)).getTime();
  } else if (flag == 4) {
    // 任意时间时间戳 秒数
    mytime = ((new Date(mytimer)).getTime()) / 1000;
  }
}

/**
 * 格式化时间戳 
 */
function formatDate(time, format = 'YY-MM-DD hh:mm:ss') {
  var date = new Date(time);

  var year = date.getFullYear(),
    month = date.getMonth() + 1, //月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  var preArr = Array.apply(null, Array(10)).map(function(elem, index) {
    return '0' + index;
  }); ////开个长度为10的数组 格式为 00 01 02 03

  var newTime = format.replace(/YY/g, year)
    .replace(/MM/g, preArr[month] || month)
    .replace(/DD/g, preArr[day] || day)
    .replace(/hh/g, preArr[hour] || hour)
    .replace(/mm/g, preArr[min] || min)
    .replace(/ss/g, preArr[sec] || sec);

  return newTime;
}

/**
 * 格式化日期
 */
function format(time, fmt) {
  time = time instanceof Date ? time : new Date(time);
  var o = {
    "M+": time.getMonth() + 1, //月份 
    "d+": time.getDate(), //日 
    "h+": time.getHours(), //小时 
    "m+": time.getMinutes(), //分 
    "s+": time.getSeconds(), //秒 
    "q+": Math.floor((time.getMonth() + 3) / 3), //季度 
    "S": time.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

/**
 * 格式化日期 - （人性化）(附加时间)
 * @param {Number|Date} time
 * @return {string}
 */
function formatSmartTime(time) {
  time = time instanceof Date ? time.getTime() : new Date(time);
  var diffTime = new Date().getTime() - time;
  // console.log(diffTime);
  //今天凌晨时间戳
  const toDayTime = new Date().setHours(0, 0, 0);
  //昨天凌晨时间戳
  const yesterDayTime = toDayTime - 86400000;
  //明天凌晨时间戳
  const tomorrowTime = toDayTime + 86400000;
  //前天凌晨时间戳
  const beforeYesterdayTime = yesterDayTime - 86400000;
  //后天凌晨时间戳
  const afterTomorrowTime = tomorrowTime + 86400000;

  if (diffTime < 0) {

    diffTime = Math.abs(diffTime);
    //大于一分钟
    if (diffTime < 60000) return "一会儿";
    //大于一分钟小于一小时
    if (diffTime >= 60000 && diffTime < 3600000) return parseInt(diffTime / 60000) + "分钟后";
    //今天
    if (time < tomorrowTime) return "今天" + format(time, "hh:mm");
    //明天
    if (time < afterTomorrowTime) return "明天" + format(time, "hh:mm");
    //后天
    if (time < afterTomorrowTime + 86400000) return "后天" + format(time, "hh:mm");
  } else {
    //小于一分钟
    if (diffTime < 60000) return "刚刚";
    //大于一分钟小于一小时
    if (diffTime >= 60000 && diffTime < 3600000) return parseInt(diffTime / 60000) + "分钟前";
    //今天
    if (time > toDayTime) return "今天" + format(time, "hh:mm");
    //昨天
    if (time > yesterDayTime) return "昨天" + format(time, "hh:mm");
    //前天
    if (time > beforeYesterdayTime) return "前天" + format(time, "hh:mm");
  }
  //月份/日 大于今年开始时间
  const toYearTime = new Date();
  toYearTime.setMonth(0, 0);
  toYearTime.setHours(0, 0, 0, 0);
  const toYearTime2 = new Date(time);
  toYearTime2.setMonth(0, 0);
  toYearTime2.setHours(0, 0, 0, 0);
  if (toYearTime.getTime() == toYearTime2.getTime())
    return format(time, "M月d日 hh:mm");
  return format(time, "yyyy年M月d日 hh:mm");
}

/**
 * m-n之间的随机数
 */
function rand(m, n) {
  return Math.ceil(Math.random() * (n - m + 1)) + (m - 1);
}

/**
 * 验证正则
 */
function checkReg(flag, data) {
  let reg = null;
  switch (flag) {
    case 1:
      // 手机号
      reg = /^1[34578]\d{9}$/;
      break;
    case 2:
      // 身份证号
      reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      break;
    case 3:
      // 银行卡号
      reg = /^([1-9]{1})(\d{15}|\d{18})$/;
    case 4:
      // 带小数的金额
      reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      break;
    case 5:
      // 折扣正则(如8.8)
      reg = /[1-9](\.[1-9])?|0\.[1-9]/;
      break;
    case 6:
      // 正则验证字母中文数字
      reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
      break;
  }
  return reg.test(data);
}

/**
 * 范围数组
 */
function myrange(start, end) {
  let arr = [];
  let len = end - start + 1;
  for (let i = 1; i <= len; i++) {
    arr.push(i);
  }
  return arr;
}

/**
 * 冒泡排序
 */
function mySort(arr, flag) {
  if (arr.length == 1) {
    return arr;
  }
  let len = arr.length;
  for (var i = 0; i < len - 1; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      // 1从小到大排序
      if (flag == 1) {
        if (arr[i] > arr[j]) {
          //如果前面的数据比后面的大就交换 
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      } else {
        // 从大到小排序
        if (arr[i] < arr[j]) {
          //如果前面的数据比后面的大就交换 
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
      // console.log("第" + (++times) + "次排序后：" + arr);
    }
  }
  return arr;
}

/**
 * 指定元素,指定个数 数组
 */
function repeatArr(myvalue, mylength) {
  let arr = [];
  for (let i = 0; i < mylength; i++) {
    arr[i] = myvalue;
  }
  return arr;
}

/**
 * 处理银行卡号显示*
 */
function bankCardByStar(data) {
  let newdata = String(data);
  let len = newdata.length;
  return ('*'.repeat(len - 4) + newdata.slice(len - 4));
}

/**
 * 获取当前页url
 * @returns {*}
 */
function getCurrentPageUrl() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url
}

/**
 * 获取当前页带参数的url
 * @returns {string}
 */
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

/**
 * 获取上一页url
 * @returns {*}
 */
function getPrevPageUrl() {
  let pages = getCurrentPages(); //获取加载的页面
  let prevPage = pages[pages.length - 2]; //获取上一级页面的对象
  let url = prevPage.route; //上一个页面url
  return url;
}

/**
 * 获取上倆页url
 * @returns {*}
 */
function twoPage() {
  let pages = getCurrentPages(); //获取加载的页面
  let prevPage = pages[pages.length - 3]; //获取上一级页面的对象
  let url = prevPage.route; //上一个页面url
  return url;
}

/**
 * 倒计时
 * @param endTime
 */
function mytimer(endTime, that) {
  var EndTime = new Date(endTime);
  var clear_set = null;
  console.log(EndTime);
  clear_set = setInterval(function() {
    let NowTime = new Date();
    let t = EndTime.getTime() - NowTime.getTime();
    let d = 0;
    let h = 0;
    let m = 0;
    let s = 0;
    if (t >= 0) {
      d = Math.floor(t / 1000 / 60 / 60 / 24);
      if (d < 10) {
        d = '0' + d;
      }
      h = Math.floor(t / 1000 / 60 / 60 % 24);
      if (h < 10) {
        h = '0' + h;
      }
      m = Math.floor(t / 1000 / 60 % 60);
      if (m < 10) {
        m = '0' + m;
      }
      s = Math.floor(t / 1000 % 60);
      if (s < 10) {
        s = '0' + s;
      }
      that.setData({
        timer: d + '天' + h + '时' + m + '分' + s + '秒'
      });
    } else {
      that.setData({
        timer: '已结束'
      });
      clearInterval(clear_set);
    }
  }, 1000);
}

/**
 *  微信 wx.showToast提示框二次封装
 * @param title
 * @param type
 */
function showToast(title, mytype) {
  let image = '';
  switch (mytype) {
    case 'error':
      image = '/images/icon_error.png'
      break;
    case 'success':
      image = '/images/icon_success.png'
      break;
    case 'warning':
      image = '/images/icon_warning.png'
      break;
  }

  wx.showToast({
    title: title,
    image: image,
    duration: 1000,
    mask: true,
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
}

/**
 * 判断值是否为空
 * @param data
 * @returns {boolean}
 */
function isEmpty(data) {
  if (data === "" || data === 0 || data === "0" || data === null || data === false || typeof data === 'undefined' || data == 'NaN') {
    return true;
  }

  if (typeof data == 'object') {
    for (let key in data) {
      return false;
    }
    return true;
  }

  return false;
}

/**
 * 删除数组指定的下标元素(从0开始)
 * @param arr  数组
 * @param n    删除数组的下标
 * @returns {arr}
 */
function arrDelete(arr, n) {
  if (n < 0)　 {
    //如果n<0，则不进行任何操作。
    return arr;
  } else {
    return arr.slice(0, n).concat(arr.slice(n + 1, arr.length));
  }
}

/**
 * 产生任意长度随机字母数字组合
 * @param randomFlag 是否任意长度(任意true,不任意false)
 * @param min min-任意长度最小位[固定位数]
 * @param max max-任意长度最大位
 * @returns {string}
 */
function randomWord(randomFlag, min, max) {
  let str = "";
  let range = min;
  let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  // 随机产生
  if (randomFlag) {
    // range = Math.round(Math.random() * (max - min)) + (min+1);
    range = Math.ceil(Math.random() * (max - min + 1)) + (min - 1);
  }
  for (let i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
  // 生成3-32位随机串：randomWord(true, 3, 32)
  // 生成43位随机串：randomWord(false, 43)
}

// 判断时间前后
function CompareDate(d1, d2) {
  return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
}

function CompareHour(d1, d2) {
  let d1h = parseInt(d1.slice(0, 2));
  let d1f = parseInt(d1.slice(3, 5));
  let d2h = parseInt(d2.slice(0, 2));
  let d2f = parseInt(d2.slice(3, 5));
  if (d1h > d2h) {
    return false;
  } else if (d1h < d2h) {
    return true;
  } else if (d1h == d2h) {
    if (d1f >= d2f) {
      return false;
    } else {
      return true;
    }
  }
}

module.exports = {
  CompareDate: CompareDate,
  CompareHour: CompareHour,
  Promise: Promise,
  formatTime: formatTime,
  format: format,
  formatSmartTime: formatSmartTime,
  formatDate: formatDate,
  rand: rand,
  myrange: myrange,
  mySort: mySort,
  checkReg: checkReg,
  repeatArr: repeatArr,
  bankCardByStar: bankCardByStar,
  getCurrentPageUrl: getCurrentPageUrl,
  getPrevPageUrl: getPrevPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
  mytimer: mytimer,
  showToast: showToast,
  isEmpty: isEmpty,
  arrDelete: arrDelete,
  randomWord: randomWord,
  timeStamp: timeStamp,
  twoPage: twoPage,
}