// page/component/pages/limitlotterypublish/limitlotterypublish.js
var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js

const app = getApp();

const date = new Date()
const years = []
const months = []
const days = []

for (let i = date.getFullYear(); i <= date.getFullYear() + 6; i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}


Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,


    c_title: '发布抽签',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),

    inputtxt1: '20字以内（例如：bobo&coco太空告白限定手办）',
    inputtxt2: '手机号（美拆联系使用不对外公布）',
    inputtxt3: '￥',

    name: '',
    num: '',
    price: '',
    phone: '',


    years: years,
    year: date.getFullYear(),
    months: months,
    month: 2,
    days: days,
    day: 2,
    value: [0, 0, 0, '00', '00'],

    hours: ['00', '01', '02', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    hour: [],
    minutes: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
    minute: '00',

    ishowpicker: false,
    selecttype: "",

    banner: "",
    bannerList: [],
    bannerlocalList: [],
    bannerwidthList: [],
    logo: "",
    logoList: [],
    logolocalList: [],
    logowidthList: [],
    goodsImg: "",
    goodsImgList: [],
    goodsImglocalList: [],
    goodsImgwidthList: [],

    starttime: "",
    stoptime: "",

  },


  getTime: function(e) {
    var _this = this;
    const val = e.detail.value;
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]],
      hour: this.data.hours[val[3]],
      minute: this.data.minutes[val[4]]
    })

  },

  selecttime: function(w) {
    var _this = this;
    var tg = w.currentTarget.dataset.tg;
    _this.setData({
      ishowpicker: true,
      selecttype: tg,
    })
  },

  closepicker: function() {
    var _this = this
    _this.setData({
      ishowpicker: false,
      selecttype: "",
    })
  },

  performpicker: function() {
    var _this = this;
    if (_this.data.selecttype == "start") {
      _this.setData({
        starttime: _this.data.year + "-" + _this.data.month + "-" + _this.data.day + " " + _this.data.hour + ":" + _this.data.minute,
      })
    } else if (_this.data.selecttype == "stop") {
      _this.setData({
        stoptime: _this.data.year + "-" + _this.data.month + "-" + _this.data.day + " " + _this.data.hour + ":" + _this.data.minute,
      })
    }
    _this.setData({
      ishowpicker: false,
      selecttype: "",
    })
  },

  // 监听输入input值
  namefun: function(e) {
    this.data.name = e.detail.value;
  },
  // 监听输入input值
  numfun: function(e) {
    this.data.num = e.detail.value;
  },
  pricefun: function(e) {
    this.data.price = e.detail.value;
  },
  phonefun: function(e) {
    this.data.phone = e.detail.value;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      _this.data.loginid = app.signindata.loginid;
      _this.data.openid = app.signindata.openid;
      _this.setData({
        uid: app.signindata.uid,
        grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
        isShareFun: app.signindata.isShareFun,
      });
    } else {
      _this.data.loginid = app.signindata.loginid;
      _this.data.openid = app.signindata.openid;
      _this.setData({
        uid: app.signindata.uid,
        grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
        isShareFun: app.signindata.isShareFun,
      });
    }

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.data.openid = app.signindata.openid;
          _this.setData({
            uid: app.signindata.uid,
            avatarUrl: app.signindata.avatarUrl,
            grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
            isStore: app.signindata.isStore,
            isProduce: app.signindata.isProduce,
            signinlayer: true,
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          wx.hideLoading()
          app.userstatistics(37);
          _this.onLoadfun();
          this.setData({
            signinlayer: false,
          })
        }
      }
    });


    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()

    var yearindex = (_this.data.years || []).findIndex((item) => item == year) || 0;
    var monthindex = (_this.data.months || []).findIndex((item) => item == month) || 0;
    var dayindex = (_this.data.days || []).findIndex((item) => item == day) || 0;
    var hourindex = (_this.data.hours || []).findIndex((item) => item == hour) || 0;
    var minuteindex = (_this.data.minutes || []).findIndex((item) => item == minute) || 0;
    var arrvalue = [yearindex, monthindex, dayindex, hourindex, minuteindex];
    _this.setData({
      year: year,
      month: month,
      day: day,
      value: arrvalue,
      hour: hour,
      minute: minute
    })
  },

  onLoadfun: function() {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
      isShareFun: app.signindata.isShareFun,
      isStore: app.signindata.isStore,
      isProduce: app.signindata.isProduce,
    });
    wx.hideShareMenu();
  },

  upserviceimg: function(w) {
    var _this = this
    var choose = w.currentTarget.dataset.choose;
    var type = w.currentTarget.dataset.type;
    wx.chooseImage({
      count: choose,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        wx.showLoading({
          title: '加载中...',
        })
        if (type == "banner") {
          _this.setData({
            banner: "",
            bannerList: [],
            bannerlocalList: [],
          })
        } else if (type == "logo") {
          _this.setData({
            logo: "",
            logoList: [],
            logolocalList: [],
          })
        } else if (type == "goodsImg") {
          _this.setData({
            goodsImg: "",
            goodsImgList: [],
            goodsImglocalList: [],
          })
        }
        let tempFilePaths = res.tempFilePaths;

        for (var i = 0; i < tempFilePaths.length; i++) {
          if (type == "banner") {
            _this.setData({
              ['bannerlocalList[' + i + ']']: {
                img: tempFilePaths[i],
                vwidth: "",
              }
            })
          } else if (type == "logo") {
            _this.setData({
              ['logolocalList[' + i + ']']: {
                img: tempFilePaths[i],
                vwidth: "",
              }
            })
          } else if (type == "goodsImg") {
            _this.setData({
              ['goodsImglocalList[' + i + ']']: {
                img: tempFilePaths[i],
                vwidth: "",
              }
            })
          }
          if (i == (tempFilePaths.length - 1)) {
            _this.uploadFile(tempFilePaths[i], type, true);
          } else {
            _this.uploadFile(tempFilePaths[i], type, false);
          }
        };
      }
    })
  },

  //上传文件
  uploadFile: function(filePath, name, ishidden) {
    var _this = this;
    wx.uploadFile({
      url: Dec.comurl() + 'spread.php',
      filePath: filePath,
      name: name,
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        'mod': 'info',
        'operation': 'upload',
        'type': 9
      },
      success: function(res) {
        if (ishidden) {
          wx.hideLoading()
        }
        if (res.data) {
          if (name == "banner") {
            _this.setData({
              banner: _this.data.banner + res.data + ",",
              bannerList: _this.data.bannerList.concat(res.data),
            })
          } else if (name == "logo") {
            _this.setData({
              logo: _this.data.logo + res.data + ",",
              logoList: _this.data.logoList.concat(res.data)
            })
          } else if (name == "goodsImg") {
            _this.setData({
              goodsImg: _this.data.goodsImg + res.data + ",",
              goodsImgList: _this.data.goodsImgList.concat(res.data)
            })
          }
        } else {
          app.showToastC('上传失败,请重新上传');
        }
      },
      fail: function(res) {
        if (ishidden) {
          wx.hideLoading()
        }
        app.showToastC('上传失败,请重新上传');
      }
    })
  },

  imageLoadad: function(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;

    if (type == "banner") {
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 80,
        viewWidth = 80 * ratio;
      var bannerlocalList = _this.data.bannerlocalList;
      if (bannerlocalList[index]) {
        bannerlocalList[index].vwidth = viewWidth;
        _this.setData({
          bannerlocalList: bannerlocalList
        });
      };
    } else if (type == "logo") {
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 80,
        viewWidth = 80 * ratio;
      var logolocalList = _this.data.logolocalList;
      if (logolocalList[index]) {
        logolocalList[index].vwidth = viewWidth;
        _this.setData({
          logolocalList: logolocalList
        });
      };
    } else if (type == "goodsImg") {
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 80,
        viewWidth = 80 * ratio;
      var goodsImglocalList = _this.data.goodsImglocalList;
      if (goodsImglocalList[index]) {
        goodsImglocalList[index].vwidth = viewWidth;
        _this.setData({
          goodsImglocalList: goodsImglocalList
        });
      };
    }

  },

  commitinfo: function(w) {
    var _this = this;
    if (this.data.name.length > 20) {
      app.showToastC('活动名称应少于20个字')
      return false;
    } else if (this.data.name.length == 0) {
      app.showToastC('请输入名称')
      return false;
    } else if (this.data.num.length == 0) {
      app.showToastC('请输入数量')
      return false;
    } else if (this.data.price.length == 0) {
      app.showToastC('请输入价格')
      return false;
    } else if (this.data.banner.length == 0) {
      app.showToastC('请选择banner图片')
      return false;
    } else if (this.data.goodsImg.length == 0) {
      app.showToastC('请选择详情图片')
      return false;
    } else if (this.data.logo.length == 0) {
      app.showToastC('请选择logo')
      return false;
    } else if (this.data.phone == 0) {
      app.showToastC('输入的手机号为空')
      return false;
    } else if (this.data.phone.length < 11) {
      app.showToastC('手机号长度有误')
      return false;
    } else if (this.data.phone && this.data.phone[0] != 1) {
      app.showToastC('手机号有误！')
      return false;
    } else if (this.data.starttime.length == 0) {
      app.showToastC('请选择开始时间')
      return false;
    } else if (this.data.stoptime.length == 0) {
      app.showToastC('请选择结束时间')
      return false;
    } else {}
    wx.showLoading({
      title: '加载中...',
    })
    // 统计新用户
    var qqqqq = Dec.Aese('mod=lotto&operation=apply' + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&title=' + _this.data.name + '&number=' + _this.data.num + '&price=' + _this.data.price + '&mobile=' + _this.data.phone + '&banner=' + _this.data.banner + '&goodsImg=' + _this.data.goodsImg + '&logo=' + _this.data.logo + '&start_time=' + _this.data.starttime + '&end_time=' + _this.data.stoptime);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qqqqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          app.showToastC('提交成功');
          _this.setData({
            name: '',
            num: '',
            price: '',
            phone: '',
            banner: "",
            bannerList: [],
            bannerlocalList: [],
            logo: "",
            logoList: [],
            logolocalList: [],
            goodsImg: "",
            goodsImgList: [],
            goodsImglocalList: [],

            starttime: "",
            stoptime: "",
          })
        }
      },
      fail: function() {}
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})